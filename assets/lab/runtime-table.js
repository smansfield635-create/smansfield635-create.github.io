// /assets/lab/runtime-table.js
// LAB_RUNTIME_TABLE_NORTH_TWO_CYCLE_CANVAS_F13_RELEASE_DISTRIBUTOR_TNT_v1
// Full-file replacement.
// North primary Runtime Table authority.
// Purpose:
// - Correct North from a single primary sequence into the locked two-cycle law.
// - Cycle 1: NORTH -> EAST -> WEST -> SOUTH -> NORTH.
// - Cycle 2: NORTH -> EAST -> SOUTH -> WEST -> CANVAS.
// - Separate Canvas F13 release from F21 completion/downstream release.
// - Allow Canvas F13 evidence before F21.
// - Hold final READY text, final visual pass, and downstream release under North F21 latch only.
// - Preserve Runtime Table, Triple G, Visual Carrier Plan, Loading Optimization, Wide Probe,
//   checkpoint, transmission, F21 NEWS latch, and Hearth-facing compatibility exports.

(() => {
  "use strict";

  const CONTRACT = "LAB_RUNTIME_TABLE_NORTH_TWO_CYCLE_CANVAS_F13_RELEASE_DISTRIBUTOR_TNT_v1";
  const RECEIPT = "LAB_RUNTIME_TABLE_NORTH_TWO_CYCLE_CANVAS_F13_RELEASE_DISTRIBUTOR_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "LAB_RUNTIME_TABLE_NORTH_PRIMARY_GATE_REGISTRY_MACRO_DISTRIBUTOR_TNT_v1";
  const BASELINE_CONTRACT = "LAB_RUNTIME_TABLE_NORTH_PRIMARY_GATE_REGISTRY_MACRO_DISTRIBUTOR_TNT_v1";
  const VERSION = "2026-05-31.lab-runtime-table-north-two-cycle-canvas-f13-release-distributor-v1";

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

  const CYCLE = Object.freeze({
    ONE: "NORTH_EAST_WEST_SOUTH_NORTH",
    TWO: "NORTH_EAST_SOUTH_WEST_CANVAS"
  });

  const CARDINAL = Object.freeze({
    NORTH: "NORTH",
    EAST: "EAST",
    SOUTH: "SOUTH",
    WEST: "WEST",
    CANVAS: "CANVAS",
    DOWNSTREAM: "DOWNSTREAM",
    UNKNOWN: "UNKNOWN"
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
    DOWNSTREAM_HELD: "DOWNSTREAM_HELD",
    CANVAS_F13_HELD: "CANVAS_F13_HELD"
  });

  const NEWS_GATES = Object.freeze({
    NORTH: "NORTH",
    EAST: "EAST",
    SOUTH: "SOUTH",
    WEST: "WEST",
    CANVAS: "CANVAS",
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
    correctedLaw: "two-cycle Runtime Table law",
    cycleOne: "North -> East -> West -> South -> North",
    cycleTwo: "North -> East -> South -> West -> Canvas",
    canvasF13: "Canvas F13 evidence receiver; allowed before F21 and forbidden from claiming READY",
    f21: "North-only completion latch after Canvas F13 evidence returns",
    downstream: "route, canvas, and Hearth-specific consumers after North F21 latch"
  });

  const PRIMARY_ROTATION = Object.freeze([
    {
      id: "C1_NORTH_START",
      gear: "GEAR_C1_NORTH_START",
      cycleNumber: 1,
      cycleRoute: CYCLE.ONE,
      cardinal: CARDINAL.NORTH,
      file: PRIMARY_GATES.north,
      fibonacci: "F1",
      news: NEWS_GATES.NORTH,
      label: "Cycle 1 North start"
    },
    {
      id: "C1_EAST_PRIMARY",
      gear: "GEAR_C1_EAST_PRIMARY",
      cycleNumber: 1,
      cycleRoute: CYCLE.ONE,
      cardinal: CARDINAL.EAST,
      file: PRIMARY_GATES.east,
      fibonacci: "F3",
      news: NEWS_GATES.EAST,
      label: "Cycle 1 East primary"
    },
    {
      id: "C1_WEST_PRIMARY",
      gear: "GEAR_C1_WEST_PRIMARY",
      cycleNumber: 1,
      cycleRoute: CYCLE.ONE,
      cardinal: CARDINAL.WEST,
      file: PRIMARY_GATES.west,
      fibonacci: "F5",
      news: NEWS_GATES.WEST,
      label: "Cycle 1 West primary"
    },
    {
      id: "C1_SOUTH_RETURN",
      gear: "GEAR_C1_SOUTH_RETURN",
      cycleNumber: 1,
      cycleRoute: CYCLE.ONE,
      cardinal: CARDINAL.SOUTH,
      file: PRIMARY_GATES.south,
      fibonacci: "F8",
      news: NEWS_GATES.SOUTH,
      label: "Cycle 1 South return"
    },
    {
      id: "C1_NORTH_RETURN_LATCH",
      gear: "GEAR_C1_NORTH_RETURN_LATCH",
      cycleNumber: 1,
      cycleRoute: CYCLE.ONE,
      cardinal: CARDINAL.NORTH,
      file: PRIMARY_GATES.north,
      fibonacci: "F8N",
      news: NEWS_GATES.NORTH,
      label: "Cycle 1 North return latch"
    },
    {
      id: "C2_NORTH_START",
      gear: "GEAR_C2_NORTH_START",
      cycleNumber: 2,
      cycleRoute: CYCLE.TWO,
      cardinal: CARDINAL.NORTH,
      file: PRIMARY_GATES.north,
      fibonacci: "F13",
      news: NEWS_GATES.NORTH,
      label: "Cycle 2 North start"
    },
    {
      id: "C2_EAST_PRIMARY",
      gear: "GEAR_C2_EAST_PRIMARY",
      cycleNumber: 2,
      cycleRoute: CYCLE.TWO,
      cardinal: CARDINAL.EAST,
      file: PRIMARY_GATES.east,
      fibonacci: "F13E",
      news: NEWS_GATES.EAST,
      label: "Cycle 2 East primary"
    },
    {
      id: "C2_SOUTH_PRIMARY",
      gear: "GEAR_C2_SOUTH_PRIMARY",
      cycleNumber: 2,
      cycleRoute: CYCLE.TWO,
      cardinal: CARDINAL.SOUTH,
      file: PRIMARY_GATES.south,
      fibonacci: "F13S",
      news: NEWS_GATES.SOUTH,
      label: "Cycle 2 South primary"
    },
    {
      id: "C2_WEST_CANVAS_RELEASE_AUDIT",
      gear: "GEAR_C2_WEST_CANVAS_RELEASE_AUDIT",
      cycleNumber: 2,
      cycleRoute: CYCLE.TWO,
      cardinal: CARDINAL.WEST,
      file: PRIMARY_GATES.west,
      fibonacci: "F13W",
      news: NEWS_GATES.WEST,
      label: "Cycle 2 West canvas-release audit"
    },
    {
      id: "C2_CANVAS_F13_EVIDENCE",
      gear: "GEAR_C2_CANVAS_F13_EVIDENCE",
      cycleNumber: 2,
      cycleRoute: CYCLE.TWO,
      cardinal: CARDINAL.CANVAS,
      file: DOWNSTREAM_GATES.canvas,
      fibonacci: "F13C",
      news: NEWS_GATES.CANVAS,
      label: "Canvas F13 evidence"
    },
    {
      id: "F21_NORTH_NEWS_LATCH",
      gear: "GEAR_F21_NORTH_NEWS_LATCH",
      cycleNumber: 2,
      cycleRoute: CYCLE.TWO,
      cardinal: CARDINAL.NORTH,
      file: PRIMARY_GATES.north,
      fibonacci: "F21",
      news: NEWS_GATES.F21,
      label: "F21 North NEWS latch"
    },
    {
      id: "DOWNSTREAM_RELEASE",
      gear: "GEAR_DOWNSTREAM_RELEASE",
      cycleNumber: 2,
      cycleRoute: CYCLE.TWO,
      cardinal: CARDINAL.DOWNSTREAM,
      file: DOWNSTREAM_GATES.hearthIndex,
      fibonacci: "F21_RELEASE",
      news: NEWS_GATES.DOWNSTREAM,
      label: "Downstream release"
    }
  ]);

  const PRIMARY_EVENTS = Object.freeze({
    EAST: [
      "EAST_PRIMARY_GATE_READY",
      "EAST_PRIMARY_ALIGNMENT_READY",
      "EAST_PRIMARY_NEWS_FIBONACCI_READY",
      "RUNTIME_TABLE_EAST_READY",
      "PRIMARY_EAST_GATE_ACCEPTED",
      "EAST_STEP1_COMPLETE",
      "EAST_STEP1_HANDOFF_ACCEPTED_BY_WEST_METHOD"
    ],
    SOUTH: [
      "SOUTH_PRIMARY_GATE_READY",
      "SOUTH_PRIMARY_OUTPUT_SPREAD_READY",
      "SOUTH_PRIMARY_RELEASE_PACKET_READY",
      "RUNTIME_TABLE_SOUTH_READY",
      "PRIMARY_SOUTH_GATE_ACCEPTED",
      "CYCLE_1_NORTH_RETURN",
      "CYCLE_2_WEST_HANDOFF",
      "SOUTH_VISIBLE_COMPLETION_READY"
    ],
    WEST: [
      "WEST_PRIMARY_GATE_READY",
      "WEST_PRIMARY_AUDIT_READY",
      "WEST_PRIMARY_ADMISSIBILITY_READY",
      "RUNTIME_TABLE_WEST_READY",
      "PRIMARY_WEST_GATE_ACCEPTED",
      "WEST_CANVAS_RELEASE_APPROVED",
      "CANVAS_RELEASE_APPROVED_BY_WEST"
    ],
    CANVAS: [
      "CANVAS_READY",
      "CANVAS_GOVERNED_RELEASE_ACCEPTED",
      "FIRST_FRAME_DETECTED",
      "VISIBLE_CONTENT_PROOF_PASSED",
      "DEGRADED_VISIBLE_CONTENT_ACCEPTED",
      "INSPECT_MODE_READY",
      "DEGRADED_INSPECT_MODE_ACCEPTED",
      "F13_CANVAS_EVIDENCE_RETURNED"
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
    "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE",
    "READY_DEGRADED_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE"
  ]);

  const GLOBALS = Object.freeze({
    east: [
      "LAB_RUNTIME_TABLE_EAST",
      "RUNTIME_TABLE_EAST",
      "DEXTER_LAB_RUNTIME_TABLE_EAST",
      "LAB_CARDINAL_RUNTIME_TABLE_EAST",
      "LAB_CHECKPOINT_GOVERNOR_EAST",
      "HEARTH_EAST_FIBONACCI_MAGNIFIER",
      "DEXTER_LAB.runtimeTableEast",
      "DEXTER_LAB.cardinalRuntimeTableEast",
      "DEXTER_LAB.checkpointGovernorEast",
      "DEXTER_LAB.hearthEastFibonacciMagnifier"
    ],
    south: [
      "LAB_RUNTIME_TABLE_SOUTH_PRIMARY_GATE",
      "LAB_RUNTIME_TABLE_SOUTH",
      "RUNTIME_TABLE_SOUTH",
      "DEXTER_LAB_RUNTIME_TABLE_SOUTH",
      "LAB_CARDINAL_RUNTIME_TABLE_SOUTH",
      "LAB_VISIBLE_STATE_COMPOSER_SOUTH",
      "HEARTH_RUNTIME_TABLE_SOUTH",
      "HEARTH_SOUTH",
      "HEARTH_VISIBLE_STATE_COMPOSER",
      "DEXTER_LAB.runtimeTableSouth",
      "DEXTER_LAB.cardinalRuntimeTableSouth",
      "DEXTER_LAB.south",
      "DEXTER_LAB.visibleStateComposer",
      "DEXTER_LAB.transmissionVisibleStateComposer",
      "DEXTER_LAB.southPrimaryGate"
    ],
    west: [
      "LAB_RUNTIME_TABLE_WEST",
      "RUNTIME_TABLE_WEST",
      "DEXTER_LAB_RUNTIME_TABLE_WEST",
      "LAB_CARDINAL_RUNTIME_TABLE_WEST",
      "LAB_GAP_CLASSIFIER_WEST",
      "LAB_TRANSMISSION_GAP_CLASSIFIER_WEST",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.cardinalRuntimeTableWest",
      "DEXTER_LAB.gapClassifierWest",
      "DEXTER_LAB.transmissionGapClassifierWest"
    ],
    canvas: [
      "HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER",
      "HEARTH_CANVAS_PHYSICAL_CARRIER_F13_PROOF_PARENT",
      "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION",
      "HEARTH_CANVAS_TRANSISTOR_GATE",
      "HEARTH_CANVAS_SPLIT_ADAPTER",
      "HEARTH_CANVAS_NORTH",
      "HEARTH_CANVAS_AUTHORITY",
      "HEARTH_CANVAS_EVIDENCE",
      "HEARTH_CANVAS",
      "HEARTH.canvasParentGovernedF13EvidenceReceiver",
      "HEARTH.canvasNorth",
      "HEARTH.canvasSplitAdapter",
      "HEARTH.canvasTransistorGate",
      "HEARTH.canvasEvidence",
      "HEARTH.canvas",
      "DEXTER_LAB.hearthCanvasParentGovernedF13EvidenceReceiver",
      "DEXTER_LAB.hearthCanvasNorth",
      "DEXTER_LAB.hearthCanvasEvidence"
    ]
  });

  const MAX_LOG = 180;

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "north-two-cycle-canvas-f13-release-distributor",
    cardinalRole: CARDINAL.NORTH,

    primaryGateRegistryActive: true,
    primaryGateFilesLocked: true,
    twoCycleRuntimeLawActive: true,
    cycleOneRoute: CYCLE.ONE,
    cycleTwoRoute: CYCLE.TWO,
    canvasF13ReleaseBeforeF21Active: true,
    canvasF13IsNotDownstreamRelease: true,
    downstreamReleaseHeldUntilF21Latch: true,
    northMacroOnly: true,
    microTuningDelegatesDownstream: true,

    activeStageId: "C1_EAST_PRIMARY",
    activeGear: "GEAR_C1_EAST_PRIMARY",
    activeCycleNumber: 1,
    activeCycleRoute: CYCLE.ONE,
    activeCardinal: CARDINAL.EAST,
    activeFileGate: PRIMARY_GATES.east,
    activeFibonacci: "F3",
    activeNewsGate: NEWS_GATES.EAST,
    activeProgress: 0,

    observed: {
      eastAuthorityObserved: false,
      southAuthorityObserved: false,
      westAuthorityObserved: false,
      canvasParentObserved: false,
      canvasReceiptObserved: false,
      canvasEastApiReady: false,
      canvasWestApiReady: false,
      canvasSouthApiReady: false,
      allCanvasChildrenApiReady: false
    },

    cycleOne: {
      northStarted: true,
      eastReceived: false,
      eastAccepted: false,
      westReceived: false,
      westAccepted: false,
      southReceived: false,
      southAccepted: false,
      northReturnReceived: false,
      northReturnValidated: false,
      complete: false,
      degradedCompatibilityClose: false
    },

    cycleTwo: {
      startAuthorized: false,
      eastReceived: false,
      eastAccepted: false,
      southReceived: false,
      southAccepted: false,
      westReceived: false,
      westAccepted: false,
      westAuditObserved: false,
      westAuditAccepted: false,
      westCanvasReleaseApproved: false,
      canvasF13ReleaseAuthorized: false,
      canvasF13ReleasePacketReady: false,
      canvasF13ReleaseHeldReason: "WAITING_CYCLE_TWO_WEST_AUDIT",
      canvasF13EvidenceReceived: false,
      canvasF13EvidenceStrict: false,
      canvasF13EvidenceDegraded: false,
      canvasF13EvidenceComplete: false,
      canvasF13HardFail: false,
      complete: false
    },

    f21EligibilityReceived: false,
    f21EligibilityAccepted: false,
    f21EligibilityRejected: false,
    f21EligibilityValidation: null,
    f21LatchMode: "WAITING_CANVAS_F13_EVIDENCE",
    f21EligibleForNorth: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,

    downstreamReleaseAuthorized: false,
    downstreamReleaseTarget: "",
    canvasReleaseAuthorized: false,
    canvasReleaseRequiresWestAudit: true,
    canvasReleaseRequiresNorthOrWestEvidence: true,
    readyTextAllowed: false,

    completedStages: ["C1_NORTH_START"],
    degradedStages: [],
    blockedStages: [],
    stageLedger: [],

    firstFailedCoordinate: "WAITING_EAST_PRIMARY_GATE",
    recommendedNextOwner: CARDINAL.EAST,
    recommendedNextFile: PRIMARY_GATES.east,
    recommendedNextRenewalTarget: PRIMARY_GATES.east,
    postgameStatus: "TWO_CYCLE_NORTH_READY",

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
    if (value === undefined || value === null || value === "") return [];
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

  function trim(list, max = MAX_LOG) {
    if (Array.isArray(list) && list.length > max) {
      list.splice(0, list.length - max);
    }
  }

  function readPath(path) {
    const parts = String(path || "").split(".");
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function firstGlobal(names) {
    for (const name of names || []) {
      const found = readPath(name);
      if (found) return found;
    }
    return null;
  }

  function readDataset(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
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

    if (authority.contract || authority.receipt || authority.version) {
      return authority;
    }

    return null;
  }

  function scanFieldDeep(input, fields, maxDepth = 7) {
    const wanted = new Set(asArray(fields));
    const seen = typeof WeakSet !== "undefined" ? new WeakSet() : null;
    const queue = [{ value: input, depth: 0 }];

    while (queue.length) {
      const item = queue.shift();
      const value = item.value;

      if (!isObject(value) || item.depth > maxDepth) continue;
      if (seen && seen.has(value)) continue;
      if (seen) seen.add(value);

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

  function getAnyNumber(input, fields, fallback = 0) {
    return safeNumber(scanFieldDeep(input, fields), fallback);
  }

  function getAnyString(input, fields, fallback = "") {
    const value = scanFieldDeep(input, fields);
    return value === undefined || value === null ? fallback : String(value);
  }

  function normalizePayload(input = {}) {
    const base = isObject(input) ? input : {};
    const detail = isObject(base.detail) ? base.detail : {};
    const snapshot = isObject(base.snapshot) ? base.snapshot : isObject(detail.snapshot) ? detail.snapshot : {};
    const release = isObject(base.releasePacket) ? base.releasePacket : {};
    const receipt = isObject(base.receiptPacket) ? base.receiptPacket : {};

    return {
      ...snapshot,
      ...detail,
      ...release,
      ...receipt,
      ...base,
      detail,
      snapshot,
      releasePacket: release,
      receiptPacket: receipt
    };
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
      getAnyString(packet, ["primaryFileGate"], "") ||
      getAnyString(packet, ["activeFileGate"], "")
    );
  }

  function packetContract(input = {}) {
    return getAnyString(input, ["contract"], "");
  }

  function normalizeCycleRoute(value = "") {
    const text = safeString(value).toUpperCase().replace(/\s+/g, "");

    if (
      text.includes(CYCLE.ONE) ||
      text.includes("NORTH->EAST->WEST->SOUTH->NORTH") ||
      text.includes("NORTH→EAST→WEST→SOUTH→NORTH")
    ) {
      return CYCLE.ONE;
    }

    if (
      text.includes(CYCLE.TWO) ||
      text.includes("NORTH->EAST->SOUTH->WEST->CANVAS") ||
      text.includes("NORTH→EAST→SOUTH→WEST→CANVAS")
    ) {
      return CYCLE.TWO;
    }

    return "";
  }

  function packetCycleRoute(input = {}) {
    return normalizeCycleRoute(
      getAnyString(input, ["cycleRoute", "activeCycleRoute", "routeCycle"], "")
    );
  }

  function packetCycleNumber(input = {}) {
    const packet = normalizePayload(input);
    const n = getAnyNumber(packet, ["cycleNumber", "activeCycleNumber"], 0);
    if (n === 1 || n === 2) return n;

    const route = packetCycleRoute(packet);
    if (route === CYCLE.ONE) return 1;
    if (route === CYCLE.TWO) return 2;

    return 0;
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

    if (card === CARDINAL.EAST && file === PRIMARY_GATES.east) return true;
    if (card === CARDINAL.SOUTH && file === PRIMARY_GATES.south) return true;
    if (card === CARDINAL.WEST && file === PRIMARY_GATES.west) return true;
    if (primaryCardinal === card && getAnyBool(packet, ["primaryGateReady", "primaryRuntimeTableGate"], false)) return true;

    if (card === CARDINAL.EAST && /RUNTIME_TABLE_EAST|EAST_PRIMARY|EAST_STEP/i.test(contract)) return true;
    if (card === CARDINAL.SOUTH && /RUNTIME_TABLE_SOUTH|SOUTH_PRIMARY|VISIBLE_STATE_COMPOSER/i.test(contract)) return true;
    if (card === CARDINAL.WEST && /RUNTIME_TABLE_WEST|WEST_PRIMARY|GAP_CLASSIFIER|AUDIT/i.test(contract)) return true;

    return false;
  }

  function isCanvasPacket(input = {}) {
    const file = packetFile(input);
    const contract = packetContract(input);
    if (file === DOWNSTREAM_GATES.canvas) return true;
    if (/HEARTH_CANVAS|CANVAS_F13|CANVAS_PARENT/i.test(contract)) return true;
    return hasEvent(input, PRIMARY_EVENTS.CANVAS);
  }

  function isDownstreamPacket(input = {}) {
    const file = packetFile(input);
    if (Object.values(DOWNSTREAM_GATES).includes(file) && file !== DOWNSTREAM_GATES.canvas) return true;
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
    trim(list);
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

  function completeStage(stageId, options = {}) {
    const stage = stageById(stageId);
    if (!stage) return getHeldResponse("UNKNOWN_PRIMARY_STAGE", "complete-stage-unknown", { stageId });

    if (!state.completedStages.includes(stage.id)) state.completedStages.push(stage.id);
    if (options.degraded === true && !state.degradedStages.includes(stage.id)) state.degradedStages.push(stage.id);

    record("admit", "PRIMARY_STAGE_COMPLETE", {
      stageId: stage.id,
      degraded: options.degraded === true,
      reason: options.reason || ""
    });

    recomputeActiveStage();
    publishAll();

    return {
      accepted: true,
      action: options.degraded === true ? CHECKPOINT_EVENT_ACTIONS.DEGRADED_FORWARD : CHECKPOINT_EVENT_ACTIONS.ADMIT,
      completedStage: stage.id,
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      visualPassClaimed: false
    };
  }

  function refreshStageLedger() {
    state.stageLedger = PRIMARY_ROTATION.map((stage) => ({
      id: stage.id,
      gear: stage.gear,
      cycleNumber: stage.cycleNumber,
      cycleRoute: stage.cycleRoute,
      cardinal: stage.cardinal,
      file: stage.file,
      fibonacci: stage.fibonacci,
      news: stage.news,
      label: stage.label,
      complete: state.completedStages.includes(stage.id),
      degraded: state.degradedStages.includes(stage.id),
      blocked: state.blockedStages.includes(stage.id),
      active: state.activeStageId === stage.id
    }));

    return state.stageLedger;
  }

  function readAuthority(cardinal) {
    const key = String(cardinal || "").toLowerCase();
    const authority = firstGlobal(GLOBALS[key] || []);
    const receipt = readReceipt(authority) || {};

    return {
      authority,
      receipt,
      observed: Boolean(authority || (receipt && receipt.contract)),
      file:
        key === "east" ? PRIMARY_GATES.east :
        key === "south" ? PRIMARY_GATES.south :
        key === "west" ? PRIMARY_GATES.west :
        key === "canvas" ? DOWNSTREAM_GATES.canvas :
        ""
    };
  }

  function readCanvasChild(key) {
    const names = {
      east: [
        "HEARTH_CANVAS_EAST",
        "HEARTH.canvasEast",
        "HEARTH.canvasEastMaterialAtlasSourceMachine",
        "DEXTER_LAB.hearthCanvasEast",
        "DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachine"
      ],
      west: [
        "HEARTH_CANVAS_WEST",
        "HEARTH.canvasWest",
        "DEXTER_LAB.hearthCanvasWest"
      ],
      south: [
        "HEARTH_CANVAS_SOUTH",
        "HEARTH.canvasSouth",
        "DEXTER_LAB.hearthCanvasSouth"
      ]
    };

    return firstGlobal(names[key] || []);
  }

  function westAuditOk(packet = {}) {
    const input = normalizePayload(packet);
    const decision = getAnyString(input, ["decision", "auditDecision", "westDecision"], "");

    return Boolean(
      getAnyBool(input, ["auditPassed", "admissibilityReady", "westPrimaryReady"], false) ||
      getAnyBool(input, ["westAuditAccepted", "westAuditApproved", "westCanvasReleaseApproved"], false) ||
      getAnyBool(input, ["canvasReleaseApprovedByWest", "canvasReleaseAuthorized", "forwardAllowed"], false) ||
      getAnyBool(input, ["canDegradeForward", "westDegradedForwardApproved"], false) ||
      decision.includes("FULL_PASS") ||
      decision.includes("DEGRADED_FORWARD") ||
      decision.includes("ADMIT")
    );
  }

  function refreshObservedAuthorities() {
    const east = readAuthority("east");
    const south = readAuthority("south");
    const west = readAuthority("west");
    const canvas = readAuthority("canvas");
    const canvasReceipt = canvas.receipt || {};

    const canvasEast = readCanvasChild("east");
    const canvasWest = readCanvasChild("west");
    const canvasSouth = readCanvasChild("south");

    state.observed.eastAuthorityObserved = east.observed;
    state.observed.southAuthorityObserved = south.observed;
    state.observed.westAuthorityObserved = west.observed;
    state.observed.canvasParentObserved = canvas.observed;
    state.observed.canvasReceiptObserved = Boolean(canvasReceipt && canvasReceipt.contract);
    state.observed.canvasEastApiReady = Boolean(canvasEast || safeBool(canvasReceipt.canvasEastReady, false));
    state.observed.canvasWestApiReady = Boolean(canvasWest || safeBool(canvasReceipt.canvasWestReady, false));
    state.observed.canvasSouthApiReady = Boolean(canvasSouth || safeBool(canvasReceipt.canvasSouthReady, false));
    state.observed.allCanvasChildrenApiReady = Boolean(
      state.observed.canvasEastApiReady &&
      state.observed.canvasWestApiReady &&
      state.observed.canvasSouthApiReady
    );

    if (!state.cycleOne.complete && east.observed && west.observed && south.observed) {
      state.cycleOne.eastReceived = true;
      state.cycleOne.eastAccepted = true;
      state.cycleOne.westReceived = true;
      state.cycleOne.westAccepted = true;
      state.cycleOne.southReceived = true;
      state.cycleOne.southAccepted = true;
      state.cycleOne.northReturnReceived = true;
      state.cycleOne.northReturnValidated = true;
      state.cycleOne.complete = true;
      state.cycleOne.degradedCompatibilityClose = true;
      state.cycleTwo.startAuthorized = true;

      [
        "C1_EAST_PRIMARY",
        "C1_WEST_PRIMARY",
        "C1_SOUTH_RETURN",
        "C1_NORTH_RETURN_LATCH",
        "C2_NORTH_START"
      ].forEach((id) => {
        if (!state.completedStages.includes(id)) state.completedStages.push(id);
      });

      if (!state.degradedStages.includes("C1_NORTH_RETURN_LATCH")) {
        state.degradedStages.push("C1_NORTH_RETURN_LATCH");
      }

      record("admit", "CYCLE_ONE_COMPATIBILITY_CLOSED_FROM_OBSERVED_PRIMARY_AUTHORITIES", {
        eastObserved: east.observed,
        westObserved: west.observed,
        southObserved: south.observed
      });
    }

    if (state.cycleTwo.startAuthorized) {
      if (east.observed && !state.cycleTwo.eastAccepted) {
        state.cycleTwo.eastReceived = true;
        state.cycleTwo.eastAccepted = true;
        if (!state.completedStages.includes("C2_EAST_PRIMARY")) state.completedStages.push("C2_EAST_PRIMARY");
      }

      if (south.observed && !state.cycleTwo.southAccepted) {
        state.cycleTwo.southReceived = true;
        state.cycleTwo.southAccepted = true;
        if (!state.completedStages.includes("C2_SOUTH_PRIMARY")) state.completedStages.push("C2_SOUTH_PRIMARY");
      }

      if (west.observed) {
        state.cycleTwo.westAuditObserved = true;

        if (westAuditOk(west.receipt || west.authority || {})) {
          state.cycleTwo.westReceived = true;
          state.cycleTwo.westAccepted = true;
          state.cycleTwo.westAuditAccepted = true;
          state.cycleTwo.westCanvasReleaseApproved = true;

          if (!state.completedStages.includes("C2_WEST_CANVAS_RELEASE_AUDIT")) {
            state.completedStages.push("C2_WEST_CANVAS_RELEASE_AUDIT");
          }

          authorizeCanvasF13Release({
            sourceFile: PRIMARY_GATES.west,
            receivedFrom: CARDINAL.WEST,
            cycleNumber: 2,
            cycleRoute: CYCLE.TWO,
            westAuditObserved: true,
            westAuditAccepted: true,
            westCanvasReleaseApproved: true
          }, "observed-west-audit-compatible");
        }
      }
    }

    const visibleEvidence = Boolean(
      safeBool(canvasReceipt.f13CanvasEvidenceComplete, false) ||
      safeBool(canvasReceipt.f13VisibleEvidenceAvailable, false) ||
      safeBool(canvasReceipt.visibleContentProof, false) ||
      safeBool(canvasReceipt.visibleContentSoftGap, false) ||
      safeBool(canvasReceipt.visibleForwardProgress, false) ||
      safeBool(canvasReceipt.visiblePlanetAvailable, false)
    );

    if (canvas.observed && visibleEvidence && !state.cycleTwo.canvasF13EvidenceReceived) {
      acceptCanvasF13Evidence(canvasReceipt, "observed-canvas-f13-receipt");
    }

    recomputeActiveStage();

    return { east, south, west, canvas };
  }

  function cycleOneComplete() {
    return Boolean(
      state.cycleOne.eastAccepted &&
      state.cycleOne.westAccepted &&
      state.cycleOne.southAccepted &&
      state.cycleOne.northReturnValidated
    );
  }

  function cycleTwoPrimaryReadyForCanvasRelease() {
    return Boolean(
      state.cycleTwo.startAuthorized &&
      state.cycleTwo.eastAccepted &&
      state.cycleTwo.southAccepted &&
      state.cycleTwo.westAccepted &&
      state.cycleTwo.westAuditAccepted
    );
  }

  function canvasF13EvidenceComplete() {
    return Boolean(
      state.cycleTwo.canvasF13EvidenceReceived &&
      !state.cycleTwo.canvasF13HardFail &&
      (
        state.cycleTwo.canvasF13EvidenceStrict ||
        state.cycleTwo.canvasF13EvidenceDegraded ||
        state.cycleTwo.canvasF13EvidenceComplete
      )
    );
  }

  function primaryCycleComplete() {
    return Boolean(cycleOneComplete() && cycleTwoPrimaryReadyForCanvasRelease());
  }

  function recomputeActiveStage() {
    state.cycleOne.complete = cycleOneComplete();
    if (state.cycleOne.complete) state.cycleTwo.startAuthorized = true;

    if (!state.cycleOne.eastAccepted) setActiveStageLocal("C1_EAST_PRIMARY");
    else if (!state.cycleOne.westAccepted) setActiveStageLocal("C1_WEST_PRIMARY");
    else if (!state.cycleOne.southAccepted) setActiveStageLocal("C1_SOUTH_RETURN");
    else if (!state.cycleOne.northReturnValidated) setActiveStageLocal("C1_NORTH_RETURN_LATCH");
    else if (!state.cycleTwo.eastAccepted) setActiveStageLocal("C2_EAST_PRIMARY");
    else if (!state.cycleTwo.southAccepted) setActiveStageLocal("C2_SOUTH_PRIMARY");
    else if (!state.cycleTwo.westAccepted || !state.cycleTwo.westAuditAccepted) setActiveStageLocal("C2_WEST_CANVAS_RELEASE_AUDIT");
    else if (!state.cycleTwo.canvasF13ReleaseAuthorized) setActiveStageLocal("C2_WEST_CANVAS_RELEASE_AUDIT");
    else if (!canvasF13EvidenceComplete()) setActiveStageLocal("C2_CANVAS_F13_EVIDENCE");
    else if (!state.completionLatched) setActiveStageLocal("F21_NORTH_NEWS_LATCH");
    else setActiveStageLocal("DOWNSTREAM_RELEASE");

    state.canvasReleaseAuthorized = state.cycleTwo.canvasF13ReleaseAuthorized;
    state.downstreamReleaseAuthorized = state.completionLatched === true;

    if (state.activeStageId === "C1_EAST_PRIMARY") setRecommendation(CARDINAL.EAST, PRIMARY_GATES.east, "WAITING_EAST_PRIMARY_GATE");
    else if (state.activeStageId === "C1_WEST_PRIMARY") setRecommendation(CARDINAL.WEST, PRIMARY_GATES.west, "WAITING_CYCLE_ONE_WEST_PRIMARY_GATE");
    else if (state.activeStageId === "C1_SOUTH_RETURN") setRecommendation(CARDINAL.SOUTH, PRIMARY_GATES.south, "WAITING_CYCLE_ONE_SOUTH_RETURN");
    else if (state.activeStageId === "C1_NORTH_RETURN_LATCH") setRecommendation(CARDINAL.NORTH, PRIMARY_GATES.north, "WAITING_CYCLE_ONE_NORTH_RETURN_LATCH");
    else if (state.activeStageId === "C2_EAST_PRIMARY") setRecommendation(CARDINAL.EAST, PRIMARY_GATES.east, "WAITING_CYCLE_TWO_EAST_PRIMARY_GATE");
    else if (state.activeStageId === "C2_SOUTH_PRIMARY") setRecommendation(CARDINAL.SOUTH, PRIMARY_GATES.south, "WAITING_CYCLE_TWO_SOUTH_PRIMARY_GATE");
    else if (state.activeStageId === "C2_WEST_CANVAS_RELEASE_AUDIT") setRecommendation(CARDINAL.WEST, PRIMARY_GATES.west, "WAITING_CYCLE_TWO_WEST_CANVAS_RELEASE_AUDIT");
    else if (state.activeStageId === "C2_CANVAS_F13_EVIDENCE") setRecommendation(CARDINAL.CANVAS, DOWNSTREAM_GATES.canvas, "WAITING_CANVAS_F13_EVIDENCE");
    else if (state.activeStageId === "F21_NORTH_NEWS_LATCH") setRecommendation(CARDINAL.NORTH, PRIMARY_GATES.north, "WAITING_F21_NORTH_NEWS_LATCH");
    else setRecommendation(CARDINAL.DOWNSTREAM, DOWNSTREAM_GATES.hearthIndex, "NONE_DOWNSTREAM_RELEASE_AUTHORIZED");

    state.postgameStatus =
      state.completionLatched
        ? state.degradedCompletionLatched
          ? "PRIMARY_GATES_COMPLETE_CANVAS_F13_DEGRADED_F21_LATCHED"
          : "PRIMARY_GATES_COMPLETE_CANVAS_F13_STRICT_F21_LATCHED"
        : state.cycleTwo.canvasF13ReleaseAuthorized && !canvasF13EvidenceComplete()
          ? "CANVAS_F13_RELEASE_AUTHORIZED_WAITING_EVIDENCE"
          : state.cycleTwo.startAuthorized
            ? "CYCLE_TWO_ACTIVE"
            : "CYCLE_ONE_ACTIVE";

    refreshStageLedger();
    state.updatedAt = nowIso();
  }

  function setActiveStageLocal(stageId) {
    const stage = stageById(stageId);
    if (!stage) return;

    state.activeStageId = stage.id;
    state.activeGear = stage.gear;
    state.activeCycleNumber = stage.cycleNumber;
    state.activeCycleRoute = stage.cycleRoute;
    state.activeCardinal = stage.cardinal;
    state.activeFileGate = stage.file;
    state.activeFibonacci = stage.fibonacci;
    state.activeNewsGate = stage.news;
    state.activeProgress = state.completedStages.includes(stage.id) ? 100 : stage.id === "C2_CANVAS_F13_EVIDENCE" ? 72 : 50;
  }

  function setRecommendation(owner, file, coordinate) {
    state.firstFailedCoordinate = coordinate;
    state.recommendedNextOwner = owner;
    state.recommendedNextFile = file;
    state.recommendedNextRenewalTarget = file;
  }

  function getHeldResponse(firstFailedCoordinate, reason = "held", extra = {}) {
    setRecommendation(
      extra.recommendedNextOwner || state.activeCardinal || CARDINAL.NORTH,
      extra.recommendedNextFile || state.activeFileGate || PRIMARY_GATES.north,
      firstFailedCoordinate
    );

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
      activeCycleNumber: state.activeCycleNumber,
      activeCycleRoute: state.activeCycleRoute,
      activeFileGate: state.activeFileGate,
      activeProgress: state.activeProgress,
      pageResponsive: true,
      hardBlock: false,
      visualPassClaimed: false,
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
      visualPassClaimed: false,
      ...clonePlain(extra)
    };

    record("archive", "EVENT_ARCHIVED", response);
    publishAll();

    return response;
  }

  function getBlockResponse(firstFailedCoordinate, reason = "blocked", extra = {}) {
    setRecommendation(
      extra.recommendedNextOwner || state.activeCardinal || CARDINAL.NORTH,
      extra.recommendedNextFile || state.activeFileGate || PRIMARY_GATES.north,
      firstFailedCoordinate
    );

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
      visualPassClaimed: false,
      ...clonePlain(extra)
    };

    record("block", "PRIMARY_GATE_BLOCKED", response);
    publishAll();

    return response;
  }

  function inferCycleForCardinal(cardinal, packet = {}) {
    const input = normalizePayload(packet);
    const explicit = packetCycleNumber(input);
    if (explicit === 1 || explicit === 2) return explicit;

    const route = packetCycleRoute(input);
    if (route === CYCLE.ONE) return 1;
    if (route === CYCLE.TWO) return 2;

    if (state.cycleOne.complete || state.cycleTwo.startAuthorized) return 2;

    return 1;
  }

  function acceptEastPrimaryGate(packet = {}) {
    const input = normalizePayload(packet);

    if (!isPrimaryGatePacket(input, CARDINAL.EAST) && !hasEvent(input, PRIMARY_EVENTS.EAST)) {
      return getHeldResponse("WAITING_EAST_PRIMARY_GATE_FILE", "east-primary-file-gate-required", {
        gapClass: GAP_CLASS.PRIMARY_GATE_FILE_MISMATCH,
        receivedFile: packetFile(input),
        recommendedNextOwner: CARDINAL.EAST,
        recommendedNextFile: PRIMARY_GATES.east,
        recommendedNextRenewalTarget: PRIMARY_GATES.east
      });
    }

    const cycle = inferCycleForCardinal(CARDINAL.EAST, input);

    if (cycle === 1) {
      state.cycleOne.eastReceived = true;
      state.cycleOne.eastAccepted = true;
      if (!state.completedStages.includes("C1_EAST_PRIMARY")) state.completedStages.push("C1_EAST_PRIMARY");
    } else {
      state.cycleTwo.startAuthorized = true;
      state.cycleTwo.eastReceived = true;
      state.cycleTwo.eastAccepted = true;
      if (!state.completedStages.includes("C2_EAST_PRIMARY")) state.completedStages.push("C2_EAST_PRIMARY");
    }

    recomputeActiveStage();

    const response = {
      accepted: true,
      action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
      stageAccepted: cycle === 1 ? "C1_EAST_PRIMARY" : "C2_EAST_PRIMARY",
      cycleNumber: cycle,
      cycleRoute: cycle === 1 ? CYCLE.ONE : CYCLE.TWO,
      event: eventName(input) || "EAST_PRIMARY_GATE_READY",
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      pageResponsive: true,
      hardBlock: false,
      visualPassClaimed: false
    };

    record("admit", "EAST_PRIMARY_GATE_ACCEPTED", response);
    publishAll();

    return response;
  }

  function acceptSouthPrimaryGate(packet = {}) {
    const input = normalizePayload(packet);

    if (!isPrimaryGatePacket(input, CARDINAL.SOUTH) && !hasEvent(input, PRIMARY_EVENTS.SOUTH)) {
      return getHeldResponse("WAITING_SOUTH_PRIMARY_GATE_FILE", "south-primary-file-gate-required", {
        gapClass: GAP_CLASS.PRIMARY_GATE_FILE_MISMATCH,
        receivedFile: packetFile(input),
        recommendedNextOwner: CARDINAL.SOUTH,
        recommendedNextFile: PRIMARY_GATES.south,
        recommendedNextRenewalTarget: PRIMARY_GATES.south
      });
    }

    const cycle = inferCycleForCardinal(CARDINAL.SOUTH, input);
    const releasePacketOk = Boolean(
      getAnyBool(input, ["releasePacketReady", "outputSpreadReady", "southPrimaryReady", "proofBodyComposed"], false) ||
      hasEvent(input, PRIMARY_EVENTS.SOUTH)
    );

    if (cycle === 1) {
      state.cycleOne.southReceived = true;
      state.cycleOne.southAccepted = true;
      state.cycleOne.northReturnReceived = true;
      state.cycleOne.northReturnValidated = true;
      state.cycleOne.complete = true;
      state.cycleTwo.startAuthorized = true;

      [
        "C1_SOUTH_RETURN",
        "C1_NORTH_RETURN_LATCH",
        "C2_NORTH_START"
      ].forEach((id) => {
        if (!state.completedStages.includes(id)) state.completedStages.push(id);
      });
    } else {
      state.cycleTwo.startAuthorized = true;
      state.cycleTwo.southReceived = true;
      state.cycleTwo.southAccepted = true;
      if (!state.completedStages.includes("C2_SOUTH_PRIMARY")) state.completedStages.push("C2_SOUTH_PRIMARY");
      if (!releasePacketOk && !state.degradedStages.includes("C2_SOUTH_PRIMARY")) state.degradedStages.push("C2_SOUTH_PRIMARY");
    }

    recomputeActiveStage();

    const response = {
      accepted: true,
      action: releasePacketOk ? CHECKPOINT_EVENT_ACTIONS.ADMIT : CHECKPOINT_EVENT_ACTIONS.DEGRADED_FORWARD,
      stageAccepted: cycle === 1 ? "C1_SOUTH_RETURN" : "C2_SOUTH_PRIMARY",
      cycleNumber: cycle,
      cycleRoute: cycle === 1 ? CYCLE.ONE : CYCLE.TWO,
      releasePacketOk,
      event: eventName(input) || "SOUTH_PRIMARY_GATE_READY",
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      pageResponsive: true,
      hardBlock: false,
      visualPassClaimed: false
    };

    record("admit", "SOUTH_PRIMARY_GATE_ACCEPTED", response);
    publishAll();

    return response;
  }

  function acceptWestPrimaryGate(packet = {}) {
    const input = normalizePayload(packet);

    if (!isPrimaryGatePacket(input, CARDINAL.WEST) && !hasEvent(input, PRIMARY_EVENTS.WEST)) {
      return getHeldResponse("WAITING_WEST_PRIMARY_GATE_FILE", "west-primary-file-gate-required", {
        gapClass: GAP_CLASS.PRIMARY_GATE_FILE_MISMATCH,
        receivedFile: packetFile(input),
        recommendedNextOwner: CARDINAL.WEST,
        recommendedNextFile: PRIMARY_GATES.west,
        recommendedNextRenewalTarget: PRIMARY_GATES.west
      });
    }

    const cycle = inferCycleForCardinal(CARDINAL.WEST, input);
    const auditOk = westAuditOk(input);

    if (cycle === 1) {
      state.cycleOne.westReceived = true;
      state.cycleOne.westAccepted = true;
      if (!state.completedStages.includes("C1_WEST_PRIMARY")) state.completedStages.push("C1_WEST_PRIMARY");
    } else {
      state.cycleTwo.startAuthorized = true;
      state.cycleTwo.westReceived = true;
      state.cycleTwo.westAccepted = true;
      state.cycleTwo.westAuditObserved = true;
      state.cycleTwo.westAuditAccepted = auditOk;
      state.cycleTwo.westCanvasReleaseApproved = auditOk;

      if (!state.completedStages.includes("C2_WEST_CANVAS_RELEASE_AUDIT")) {
        state.completedStages.push("C2_WEST_CANVAS_RELEASE_AUDIT");
      }

      if (!auditOk && !state.degradedStages.includes("C2_WEST_CANVAS_RELEASE_AUDIT")) {
        state.degradedStages.push("C2_WEST_CANVAS_RELEASE_AUDIT");
      }

      if (auditOk) authorizeCanvasF13Release(input, "west-primary-gate-accepted");
    }

    recomputeActiveStage();

    const response = {
      accepted: true,
      action: auditOk || cycle === 1 ? CHECKPOINT_EVENT_ACTIONS.ADMIT : CHECKPOINT_EVENT_ACTIONS.DEGRADED_FORWARD,
      stageAccepted: cycle === 1 ? "C1_WEST_PRIMARY" : "C2_WEST_CANVAS_RELEASE_AUDIT",
      cycleNumber: cycle,
      cycleRoute: cycle === 1 ? CYCLE.ONE : CYCLE.TWO,
      auditOk,
      canvasF13ReleaseAuthorized: state.cycleTwo.canvasF13ReleaseAuthorized,
      event: eventName(input) || "WEST_PRIMARY_GATE_READY",
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      pageResponsive: true,
      hardBlock: false,
      visualPassClaimed: false
    };

    record("admit", "WEST_PRIMARY_GATE_ACCEPTED", response);
    publishAll();

    return response;
  }

  function receiveCycleOneSouthReturn(packet = {}) {
    const input = normalizePayload(packet);

    state.cycleOne.southReceived = true;
    state.cycleOne.southAccepted = true;
    state.cycleOne.northReturnReceived = true;
    state.cycleOne.northReturnValidated = true;
    state.cycleOne.complete = true;
    state.cycleTwo.startAuthorized = true;

    [
      "C1_SOUTH_RETURN",
      "C1_NORTH_RETURN_LATCH",
      "C2_NORTH_START"
    ].forEach((id) => {
      if (!state.completedStages.includes(id)) state.completedStages.push(id);
    });

    recomputeActiveStage();

    const response = {
      accepted: true,
      action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
      event: eventName(input) || "CYCLE_1_NORTH_RETURN",
      cycleNumber: 1,
      cycleRoute: CYCLE.ONE,
      cycleOneComplete: true,
      cycleTwoStartAuthorized: true,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      visualPassClaimed: false
    };

    record("admit", "CYCLE_ONE_SOUTH_RETURN_ACCEPTED_BY_NORTH", response);
    publishAll();

    return response;
  }

  function authorizeCycleTwoStart(packet = {}, source = "authorizeCycleTwoStart") {
    const input = normalizePayload(packet);

    if (!state.cycleOne.complete && !cycleOneComplete()) {
      return getHeldResponse("WAITING_CYCLE_ONE_NORTH_RETURN", "cycle-two-start-held-until-cycle-one-return", {
        source,
        recommendedNextOwner: CARDINAL.SOUTH,
        recommendedNextFile: PRIMARY_GATES.south,
        recommendedNextRenewalTarget: PRIMARY_GATES.south
      });
    }

    state.cycleTwo.startAuthorized = true;

    if (!state.completedStages.includes("C2_NORTH_START")) {
      state.completedStages.push("C2_NORTH_START");
    }

    recomputeActiveStage();

    const response = {
      accepted: true,
      action: CHECKPOINT_EVENT_ACTIONS.RELEASE,
      source,
      event: eventName(input) || "CYCLE_TWO_START_AUTHORIZED",
      cycleNumber: 2,
      cycleRoute: CYCLE.TWO,
      cycleTwoStartAuthorized: true,
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      recommendedNextFile: state.recommendedNextFile,
      visualPassClaimed: false
    };

    record("admit", "CYCLE_TWO_START_AUTHORIZED_BY_NORTH", response);
    publishAll();

    return response;
  }

  function authorizeCanvasF13Release(packet = {}, source = "authorizeCanvasF13Release") {
    const input = normalizePayload(packet);

    const lawfulCycle = Boolean(
      state.cycleTwo.startAuthorized &&
      state.cycleTwo.eastAccepted &&
      state.cycleTwo.southAccepted
    );

    const westAuditObserved = Boolean(
      state.cycleTwo.westAuditObserved ||
      getAnyBool(input, ["westAuditObserved", "westAuditAccepted", "westAuditApproved", "westCanvasReleaseApproved"], false) ||
      packetPrimaryCardinal(input) === CARDINAL.WEST ||
      packetFile(input) === PRIMARY_GATES.west
    );

    const westApproved = Boolean(
      state.cycleTwo.westAuditAccepted ||
      state.cycleTwo.westCanvasReleaseApproved ||
      westAuditOk(input)
    );

    const noHardFail = !getAnyBool(input, ["visibleContentHardFail", "f13HardFail"], false);

    const authorized = Boolean(lawfulCycle && westAuditObserved && westApproved && noHardFail);

    if (!authorized) {
      const reason = !lawfulCycle
        ? "WAITING_CYCLE_TWO_EAST_SOUTH"
        : !westAuditObserved
          ? "WAITING_WEST_AUDIT_OBSERVATION"
          : !westApproved
            ? "WAITING_WEST_CANVAS_RELEASE_APPROVAL"
            : "VISIBLE_CONTENT_HARD_FAIL_BLOCKS_CANVAS_RELEASE";

      state.cycleTwo.canvasF13ReleaseAuthorized = false;
      state.cycleTwo.canvasF13ReleasePacketReady = false;
      state.cycleTwo.canvasF13ReleaseHeldReason = reason;
      recomputeActiveStage();

      return getHeldResponse(reason, "canvas-f13-release-held", {
        source,
        cycleNumber: 2,
        cycleRoute: CYCLE.TWO,
        lawfulCycle,
        westAuditObserved,
        westApproved,
        noHardFail,
        recommendedNextOwner: !lawfulCycle ? CARDINAL.SOUTH : CARDINAL.WEST,
        recommendedNextFile: !lawfulCycle ? PRIMARY_GATES.south : PRIMARY_GATES.west,
        recommendedNextRenewalTarget: !lawfulCycle ? PRIMARY_GATES.south : PRIMARY_GATES.west
      });
    }

    state.cycleTwo.westReceived = true;
    state.cycleTwo.westAccepted = true;
    state.cycleTwo.westAuditObserved = true;
    state.cycleTwo.westAuditAccepted = true;
    state.cycleTwo.westCanvasReleaseApproved = true;
    state.cycleTwo.canvasF13ReleaseAuthorized = true;
    state.cycleTwo.canvasF13ReleasePacketReady = true;
    state.cycleTwo.canvasF13ReleaseHeldReason = "NONE_CANVAS_F13_RELEASE_AUTHORIZED";
    state.canvasReleaseAuthorized = true;

    if (!state.completedStages.includes("C2_WEST_CANVAS_RELEASE_AUDIT")) {
      state.completedStages.push("C2_WEST_CANVAS_RELEASE_AUDIT");
    }

    recomputeActiveStage();

    const response = {
      accepted: true,
      action: CHECKPOINT_EVENT_ACTIONS.RELEASE,
      source,
      event: eventName(input) || "CANVAS_F13_RELEASE_AUTHORIZED",
      cycleNumber: 2,
      cycleRoute: CYCLE.TWO,
      receivedFrom: CARDINAL.WEST,
      handoffTo: CARDINAL.CANVAS,
      canvasReleaseAuthorized: true,
      canvasF13ReleaseAuthorized: true,
      westAuditObserved: true,
      westAuditAccepted: true,
      westCanvasReleaseApproved: true,
      northCanvasReleaseAuthorized: true,
      canvasReleasePacket: composeCanvasF13ReleasePacket(),
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    record("admit", "CANVAS_F13_RELEASE_AUTHORIZED_BY_NORTH", response);
    publishAll();

    return response;
  }

  function composeCanvasF13ReleasePacket(input = {}) {
    const extra = normalizePayload(input);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "CANVAS_F13_RELEASE_PACKET",
      sourceFile: PRIMARY_GATES.west,
      destinationFile: DOWNSTREAM_GATES.canvas,
      targetFile: DOWNSTREAM_GATES.canvas,

      cycleNumber: 2,
      activeCycleNumber: 2,
      cycleRoute: CYCLE.TWO,
      activeCycleRoute: CYCLE.TWO,
      receivedFrom: CARDINAL.WEST,
      returnTo: CARDINAL.NORTH,
      handoffTo: CARDINAL.CANVAS,
      activeCardinal: CARDINAL.CANVAS,
      activeFibonacci: "F13",
      activeFibonacciRank: 13,
      activeNEWSGate: NEWS_GATES.CANVAS,
      activeNewsGate: NEWS_GATES.CANVAS,

      westAuditObserved: true,
      westAuditAccepted: true,
      westCanvasReleaseApproved: true,
      canvasReleaseApprovedByWest: true,
      northCanvasReleaseAuthorized: true,
      canvasReleaseAuthorized: true,
      canvasReleaseReceived: true,
      releaseAuthorized: true,

      currentParentIdentityAccepted: true,
      currentParentIdentityMismatch: false,
      staleParentDetected: false,

      canvasReleasePacketReady: state.cycleTwo.canvasF13ReleasePacketReady,
      canvasF13ReleaseAuthorized: state.cycleTwo.canvasF13ReleaseAuthorized,
      canvasF13IsNotF21: true,
      canvasF13IsNotDownstreamRelease: true,
      f21ClaimedByNorthOnly: false,
      readyTextClaimedByNorthOnly: false,

      firstFailedCoordinate: state.cycleTwo.canvasF13ReleaseAuthorized
        ? "NONE_CANVAS_F13_RELEASE_AUTHORIZED"
        : state.cycleTwo.canvasF13ReleaseHeldReason,
      recommendedNextFile: state.cycleTwo.canvasF13ReleaseAuthorized ? DOWNSTREAM_GATES.canvas : PRIMARY_GATES.west,
      recommendedNextRenewalTarget: state.cycleTwo.canvasF13ReleaseAuthorized ? DOWNSTREAM_GATES.canvas : PRIMARY_GATES.west,

      detail: clonePlain(extra),
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      composedAt: nowIso()
    };
  }

  function acceptCanvasF13Evidence(packet = {}, source = "acceptCanvasF13Evidence") {
    const input = normalizePayload(packet);

    const explicitEvidence = Boolean(
      hasEvent(input, PRIMARY_EVENTS.CANVAS) ||
      isCanvasPacket(input) ||
      getAnyBool(input, ["f13CanvasEvidenceComplete", "f13VisibleEvidenceAvailable", "visiblePlanetProofValid"], false) ||
      getAnyBool(input, ["visibleContentProof", "visibleContentStrictProof", "visibleContentSoftGap", "visibleForwardProgress", "visibleContentAdmissible", "visiblePlanetAvailable"], false)
    );

    if (!explicitEvidence) {
      return getHeldResponse("WAITING_CANVAS_F13_EVIDENCE_PACKET", "canvas-f13-evidence-packet-required", {
        source,
        recommendedNextOwner: CARDINAL.CANVAS,
        recommendedNextFile: DOWNSTREAM_GATES.canvas,
        recommendedNextRenewalTarget: DOWNSTREAM_GATES.canvas
      });
    }

    const hardFail = getAnyBool(input, ["visibleContentHardFail", "f13HardFail"], false);
    const strict = Boolean(
      getAnyBool(input, ["f13CanvasEvidenceStrict", "visibleContentStrictProof", "visibleContentProof"], false) && !hardFail
    );
    const degraded = Boolean(
      !strict &&
      !hardFail &&
      (
        getAnyBool(input, ["f13CanvasEvidenceDegraded", "visibleContentSoftGap", "visibleForwardProgress", "visibleContentAdmissible", "visiblePlanetAvailable"], false) ||
        getAnyBool(input, ["f13CanvasEvidenceComplete", "f13VisibleEvidenceAvailable"], false)
      )
    );

    state.cycleTwo.canvasF13EvidenceReceived = true;
    state.cycleTwo.canvasF13EvidenceStrict = strict;
    state.cycleTwo.canvasF13EvidenceDegraded = degraded;
    state.cycleTwo.canvasF13EvidenceComplete = Boolean((strict || degraded) && !hardFail);
    state.cycleTwo.canvasF13HardFail = hardFail;
    state.cycleTwo.complete = Boolean(state.cycleTwo.canvasF13EvidenceComplete);

    if (state.cycleTwo.canvasF13EvidenceComplete && !state.completedStages.includes("C2_CANVAS_F13_EVIDENCE")) {
      state.completedStages.push("C2_CANVAS_F13_EVIDENCE");
    }

    if (degraded && !state.degradedStages.includes("C2_CANVAS_F13_EVIDENCE")) {
      state.degradedStages.push("C2_CANVAS_F13_EVIDENCE");
    }

    recomputeActiveStage();

    const response = {
      accepted: state.cycleTwo.canvasF13EvidenceComplete,
      action: hardFail
        ? CHECKPOINT_EVENT_ACTIONS.HELD
        : degraded
          ? CHECKPOINT_EVENT_ACTIONS.DEGRADED_FORWARD
          : CHECKPOINT_EVENT_ACTIONS.ADMIT,
      source,
      event: eventName(input) || "F13_CANVAS_EVIDENCE_RETURNED",
      cycleNumber: 2,
      cycleRoute: CYCLE.TWO,
      canvasF13EvidenceReceived: true,
      canvasF13EvidenceStrict: strict,
      canvasF13EvidenceDegraded: degraded,
      canvasF13EvidenceComplete: state.cycleTwo.canvasF13EvidenceComplete,
      canvasF13HardFail: hardFail,
      f21EligibleForNorth: state.cycleTwo.canvasF13EvidenceComplete,
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    record(state.cycleTwo.canvasF13EvidenceComplete ? "admit" : "held", "CANVAS_F13_EVIDENCE_RECEIVED_BY_NORTH", response);
    publishAll();

    return response;
  }

  function validateF21Eligibility(packet = {}) {
    const input = normalizePayload(packet);

    const explicitEligibility = Boolean(
      hasEvent(input, PRIMARY_EVENTS.F21) ||
      getAnyBool(input, ["f21EligibleForNorth", "f21EligibilitySubmittedToNorth", "primaryGateCycleEligible"], false)
    );

    const canvasEvidenceFromPacket = Boolean(
      getAnyBool(input, ["f13CanvasEvidenceComplete", "f13VisibleEvidenceAvailable", "visiblePlanetProofValid"], false) ||
      getAnyBool(input, ["visibleContentProof", "visibleContentStrictProof", "visibleContentSoftGap", "visibleForwardProgress", "visibleContentAdmissible", "visiblePlanetAvailable"], false)
    );

    const noHardFail = !(
      state.cycleTwo.canvasF13HardFail ||
      getAnyBool(input, ["visibleContentHardFail", "f13HardFail"], false)
    );

    const canvasEvidenceOk = Boolean(canvasF13EvidenceComplete() || (canvasEvidenceFromPacket && noHardFail));
    const primaryCycleOk = Boolean(cycleOneComplete() && state.cycleTwo.canvasF13ReleaseAuthorized);

    const full = Boolean(explicitEligibility && primaryCycleOk && canvasEvidenceOk && noHardFail && state.cycleTwo.canvasF13EvidenceStrict);
    const degraded = Boolean(explicitEligibility && primaryCycleOk && canvasEvidenceOk && noHardFail && !full);
    const ok = full || degraded;

    let firstFailedCoordinate = "NONE_F21_FULL_ELIGIBLE";
    if (!explicitEligibility) firstFailedCoordinate = "WAITING_F21_ELIGIBILITY_SUBMISSION";
    else if (!cycleOneComplete()) firstFailedCoordinate = "WAITING_CYCLE_ONE_COMPLETION";
    else if (!state.cycleTwo.canvasF13ReleaseAuthorized) firstFailedCoordinate = "WAITING_CANVAS_F13_RELEASE";
    else if (!canvasEvidenceOk) firstFailedCoordinate = "WAITING_CANVAS_F13_EVIDENCE";
    else if (!noHardFail) firstFailedCoordinate = "VISIBLE_CONTENT_HARD_FAIL";

    return {
      ok,
      full,
      degraded,
      missing: [
        explicitEligibility ? "" : "explicitEligibility",
        primaryCycleOk ? "" : "primaryCycleAndCanvasRelease",
        canvasEvidenceOk ? "" : "canvasF13Evidence",
        noHardFail ? "" : "noHardFail"
      ].filter(Boolean),
      evidence: {
        explicitEligibility,
        primaryCycleOk,
        cycleOneComplete: cycleOneComplete(),
        canvasF13ReleaseAuthorized: state.cycleTwo.canvasF13ReleaseAuthorized,
        canvasEvidenceOk,
        noHardFail,
        event: eventName(input),
        file: packetFile(input)
      },
      firstFailedCoordinate,
      latchMode: full ? "FULL" : degraded ? "DEGRADED" : "WAITING_CANVAS_F13_EVIDENCE",
      acceptedAt: ok ? nowIso() : ""
    };
  }

  function latchF21FromSouthEligibility(packet = {}, source = "latchF21FromSouthEligibility") {
    const input = normalizePayload(packet);
    const validation = validateF21Eligibility(input);

    state.f21EligibilityReceived = true;
    state.f21EligibilityValidation = validation;

    if (!validation.ok) {
      state.f21EligibilityRejected = true;
      state.f21EligibilityAccepted = false;
      state.f21EligibleForNorth = false;
      state.f21LatchMode = validation.latchMode || "WAITING_CANVAS_F13_EVIDENCE";

      const target =
        validation.firstFailedCoordinate === "WAITING_CANVAS_F13_RELEASE" ? PRIMARY_GATES.west :
        validation.firstFailedCoordinate === "WAITING_CANVAS_F13_EVIDENCE" ? DOWNSTREAM_GATES.canvas :
        validation.firstFailedCoordinate === "WAITING_CYCLE_ONE_COMPLETION" ? PRIMARY_GATES.south :
        PRIMARY_GATES.north;

      return getHeldResponse(validation.firstFailedCoordinate, "north-f21-eligibility-held", {
        source,
        validation,
        recommendedNextOwner:
          target === PRIMARY_GATES.west ? CARDINAL.WEST :
          target === DOWNSTREAM_GATES.canvas ? CARDINAL.CANVAS :
          target === PRIMARY_GATES.south ? CARDINAL.SOUTH :
          CARDINAL.NORTH,
        recommendedNextFile: target,
        recommendedNextRenewalTarget: target
      });
    }

    state.f21EligibilityAccepted = true;
    state.f21EligibilityRejected = false;
    state.f21EligibleForNorth = true;
    state.f21LatchMode = validation.full ? "FULL_LATCHED_BY_NORTH" : "DEGRADED_LATCHED_BY_NORTH";
    state.completionLatched = true;
    state.finalCompletionLatched = true;
    state.degradedCompletionLatched = validation.degraded === true;
    state.downstreamReleaseAuthorized = true;
    state.downstreamReleaseTarget = DOWNSTREAM_GATES.hearthIndex;
    state.readyTextAllowed = true;

    if (!state.completedStages.includes("F21_NORTH_NEWS_LATCH")) {
      state.completedStages.push("F21_NORTH_NEWS_LATCH");
    }

    if (!state.completedStages.includes("DOWNSTREAM_RELEASE")) {
      state.completedStages.push("DOWNSTREAM_RELEASE");
    }

    if (validation.degraded && !state.degradedStages.includes("F21_NORTH_NEWS_LATCH")) {
      state.degradedStages.push("F21_NORTH_NEWS_LATCH");
    }

    state.firstFailedCoordinate = validation.full
      ? "NONE_F21_FULL_LATCHED_BY_NORTH_TWO_CYCLE_DISTRIBUTOR"
      : "NONE_F21_DEGRADED_LATCHED_BY_NORTH_TWO_CYCLE_DISTRIBUTOR";

    state.recommendedNextOwner = CARDINAL.DOWNSTREAM;
    state.recommendedNextFile = DOWNSTREAM_GATES.hearthIndex;
    state.recommendedNextRenewalTarget = DOWNSTREAM_GATES.hearthIndex;

    recomputeActiveStage();

    const response = {
      accepted: true,
      action: validation.full ? CHECKPOINT_EVENT_ACTIONS.LATCH : CHECKPOINT_EVENT_ACTIONS.DEGRADED_FORWARD,
      source,
      completionLatched: true,
      finalCompletionLatched: true,
      degradedCompletionLatched: validation.degraded === true,
      f21LatchMode: state.f21LatchMode,
      downstreamReleaseAuthorized: true,
      downstreamReleaseTarget: state.downstreamReleaseTarget,
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

    record("admit", "F21_LATCHED_BY_NORTH_TWO_CYCLE_DISTRIBUTOR", response);
    publishAll();

    return response;
  }

  function receivePrimaryGateEvent(packet = {}, source = "receiveEvent") {
    const input = normalizePayload(packet);

    if (hasEvent(input, PRIMARY_EVENTS.F21) || getAnyBool(input, ["f21EligibleForNorth", "primaryGateCycleEligible"], false)) {
      return latchF21FromSouthEligibility(input, source);
    }

    if (isCanvasPacket(input)) {
      return acceptCanvasF13Evidence(input, source);
    }

    if (isPrimaryGatePacket(input, CARDINAL.WEST) || hasEvent(input, PRIMARY_EVENTS.WEST)) {
      return acceptWestPrimaryGate(input);
    }

    if (isPrimaryGatePacket(input, CARDINAL.SOUTH) || hasEvent(input, PRIMARY_EVENTS.SOUTH)) {
      if (packetCycleNumber(input) === 1 || packetCycleRoute(input) === CYCLE.ONE || hasEvent(input, ["CYCLE_1_NORTH_RETURN"])) {
        return receiveCycleOneSouthReturn(input);
      }

      return acceptSouthPrimaryGate(input);
    }

    if (isPrimaryGatePacket(input, CARDINAL.EAST) || hasEvent(input, PRIMARY_EVENTS.EAST)) {
      return acceptEastPrimaryGate(input);
    }

    if (isDownstreamPacket(input)) {
      if (!state.downstreamReleaseAuthorized) {
        return getHeldResponse("DOWNSTREAM_RELEASE_WAITING_F21_NORTH_LATCH", "downstream-event-received-before-f21-latch", {
          gapClass: GAP_CLASS.DOWNSTREAM_HELD,
          source,
          event: eventName(input),
          receivedFile: packetFile(input),
          recommendedNextOwner: state.cycleTwo.canvasF13ReleaseAuthorized ? CARDINAL.CANVAS : CARDINAL.WEST,
          recommendedNextFile: state.cycleTwo.canvasF13ReleaseAuthorized ? DOWNSTREAM_GATES.canvas : PRIMARY_GATES.west,
          recommendedNextRenewalTarget: state.cycleTwo.canvasF13ReleaseAuthorized ? DOWNSTREAM_GATES.canvas : PRIMARY_GATES.west
        });
      }

      return getArchiveResponse("downstream-event-after-release-archived", {
        source,
        event: eventName(input),
        receivedFile: packetFile(input)
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
        gapClass: validation.ok ? GAP_CLASS.NONE : GAP_CLASS.CANVAS_F13_HELD,
        checkpointId: "F21_NORTH_TWO_CYCLE_LATCH",
        event: name || "F21_ELIGIBILITY_PACKET",
        validation,
        activeStageId: state.activeStageId,
        activeFileGate: state.activeFileGate
      };
    }

    if (isCanvasPacket(input)) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
        gapClass: GAP_CLASS.NONE,
        checkpointId: "CANVAS_F13_EVIDENCE",
        event: name,
        activeStageId: state.activeStageId,
        activeFileGate: state.activeFileGate
      };
    }

    if (isPrimaryGatePacket(input, CARDINAL.WEST) || hasEvent(input, PRIMARY_EVENTS.WEST)) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
        gapClass: GAP_CLASS.NONE,
        checkpointId: "WEST_PRIMARY_GATE",
        event: name,
        activeStageId: state.activeStageId,
        activeFileGate: state.activeFileGate
      };
    }

    if (isPrimaryGatePacket(input, CARDINAL.SOUTH) || hasEvent(input, PRIMARY_EVENTS.SOUTH)) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
        gapClass: GAP_CLASS.NONE,
        checkpointId: "SOUTH_PRIMARY_GATE",
        event: name,
        activeStageId: state.activeStageId,
        activeFileGate: state.activeFileGate
      };
    }

    if (isPrimaryGatePacket(input, CARDINAL.EAST) || hasEvent(input, PRIMARY_EVENTS.EAST)) {
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
        checkpointId: "DOWNSTREAM_HELD_UNTIL_F21_LATCH",
        event: name,
        activeStageId: state.activeStageId,
        activeFileGate: state.activeFileGate,
        recommendedNextFile: state.recommendedNextFile
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

    const northGateReady = true;
    const eastGateReady = Boolean(state.cycleOne.eastAccepted && state.cycleTwo.eastAccepted);
    const southGateReady = Boolean(state.cycleOne.southAccepted && state.cycleTwo.southAccepted);
    const westGateReady = Boolean(state.cycleOne.westAccepted && state.cycleTwo.westAccepted);
    const canvasGateReady = Boolean(canvasF13EvidenceComplete() || getAnyBool(input, ["f13CanvasEvidenceComplete"], false));
    const f21GateReady = Boolean(state.completionLatched || getAnyBool(input, ["f21EligibleForNorth"], false));

    const newsGatePassedBeforeF21 = Boolean(
      northGateReady &&
      eastGateReady &&
      southGateReady &&
      westGateReady &&
      canvasGateReady
    );

    const newsGateDegradedBeforeF21 = Boolean(
      newsGatePassedBeforeF21 ||
      (
        northGateReady &&
        cycleOneComplete() &&
        state.cycleTwo.canvasF13ReleaseAuthorized &&
        !state.cycleTwo.canvasF13HardFail
      )
    );

    return {
      northGateReady,
      eastGateReady,
      southGateReady,
      westGateReady,
      canvasGateReady,
      f21GateReady,
      primaryGateCycleComplete: primaryCycleComplete(),
      canvasF13ReleaseAuthorized: state.cycleTwo.canvasF13ReleaseAuthorized,
      canvasF13EvidenceComplete: canvasF13EvidenceComplete(),
      newsGatePassedBeforeF21,
      newsGateDegradedBeforeF21,
      degradedForwardAvailable: newsGateDegradedBeforeF21 && !newsGatePassedBeforeF21,
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
      activeCycleNumber: state.activeCycleNumber,
      activeCycleRoute: state.activeCycleRoute,
      activeCardinal: state.activeCardinal,
      activeFileGate: state.activeFileGate,
      activeFibonacci: state.activeFibonacci,
      activeNewsGate: state.activeNewsGate,
      activeProgress: state.activeProgress,
      primaryGateRegistryActive: true,
      primaryGateFilesLocked: true,
      twoCycleRuntimeLawActive: true,
      oneActiveGearAtATime: true,
      updatedAt: nowIso()
    };
  }

  function setActiveStage(stageId, reason = "setActiveStage") {
    const stage = stageById(stageId);
    if (!stage) return getHeldResponse("UNKNOWN_PRIMARY_STAGE", "set-active-stage-unknown", { stageId, reason });

    setActiveStageLocal(stageId);
    refreshStageLedger();

    record("receipt", "ACTIVE_PRIMARY_STAGE_SET", { stageId, reason });
    publishAll();

    return getActiveGateState();
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

  function createPrimaryGateRegistry() {
    refreshObservedAuthorities();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      registryContract: "LAB_RUNTIME_TABLE_TWO_CYCLE_PRIMARY_GATE_REGISTRY_v1",
      registryReceipt: "LAB_RUNTIME_TABLE_TWO_CYCLE_PRIMARY_GATE_REGISTRY_RECEIPT_v1",
      authority: "north-two-cycle-primary-gate-registry",
      primaryGates: clonePlain(PRIMARY_GATES),
      downstreamGates: clonePlain(DOWNSTREAM_GATES),
      rotation: clonePlain(PRIMARY_ROTATION),
      language: clonePlain(NORTH_LANGUAGE),
      cycleOne: clonePlain(state.cycleOne),
      cycleTwo: clonePlain(state.cycleTwo),
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      completedStages: state.completedStages.slice(),
      degradedStages: state.degradedStages.slice(),
      blockedStages: state.blockedStages.slice(),
      canvasF13ReleaseAuthorized: state.cycleTwo.canvasF13ReleaseAuthorized,
      canvasF13EvidenceComplete: canvasF13EvidenceComplete(),
      downstreamReleaseAuthorized: state.downstreamReleaseAuthorized,
      nextPrimaryOwner: state.recommendedNextOwner,
      nextPrimaryTarget: state.recommendedNextFile,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function createChronologicalFibonacciPlan() {
    refreshObservedAuthorities();

    return PRIMARY_ROTATION.map((stage, index) => ({
      id: stage.id,
      rank: index + 1,
      gear: stage.gear,
      cycleNumber: stage.cycleNumber,
      cycleRoute: stage.cycleRoute,
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

  function createNewsFibonacciCheckpointPlan() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "north-two-cycle-news-fibonacci-plan",
      sequence: createChronologicalFibonacciPlan(),
      newsGates: clonePlain(NEWS_GATES),
      primaryGates: clonePlain(PRIMARY_GATES),
      downstreamGates: clonePlain(DOWNSTREAM_GATES),
      primaryGateRegistryActive: true,
      primaryGateFilesLocked: true,
      twoCycleRuntimeLawActive: true,
      oneActiveGearAtATime: true,
      canvasF13ReleaseBeforeF21Active: true,
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
        childCount: local.registrations.length
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
        twoCycleRuntimeLawActive: true,
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
          twoCycleRuntimeLawActive: true,
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
        twoCycleRuntimeLawActive: true,
        canvasF13ReleaseBeforeF21Active: true,
        downstreamReleaseRequiresF21Latch: true,
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
    refreshObservedAuthorities();

    const goalProfile = input.goalProfile || options.goalProfile || createGoalProfile(options.profile || "universal-planet-channel-expression");
    const imageRendered = safeBool(input.imageRendered, safeBool(input.renderMetadata && input.renderMetadata.imageRendered, false));
    const wideProbeCount = Array.isArray(input.probeSamples) ? input.probeSamples.length : 0;
    const minWideProbe = safeNumber(goalProfile.tolerances && goalProfile.tolerances.minimumWideProbePoints, 25);

    const checkpoints = [
      {
        id: "TWO_CYCLE_RUNTIME_LAW_CHECK",
        name: "Two-Cycle Runtime Law Check",
        status: COHERENCE_STATUS.PASS,
        observed: "North is using Cycle 1 and Cycle 2 separately.",
        nonBlocking: false,
        at: nowIso()
      },
      {
        id: "CYCLE_ONE_RETURN_CHECK",
        name: "Cycle 1 Return Check",
        status: cycleOneComplete() ? COHERENCE_STATUS.PASS : COHERENCE_STATUS.WARNING,
        observed: cycleOneComplete() ? "Cycle 1 returned through North." : "Cycle 1 still awaiting return closure.",
        nonBlocking: true,
        at: nowIso()
      },
      {
        id: "CANVAS_F13_RELEASE_CHECK",
        name: "Canvas F13 Release Check",
        status: state.cycleTwo.canvasF13ReleaseAuthorized ? COHERENCE_STATUS.PASS : COHERENCE_STATUS.WARNING,
        observed: state.cycleTwo.canvasF13ReleaseAuthorized ? "Canvas F13 release authorized before F21." : "Canvas F13 release still held.",
        nonBlocking: true,
        at: nowIso()
      },
      {
        id: "CANVAS_F13_EVIDENCE_CHECK",
        name: "Canvas F13 Evidence Check",
        status: canvasF13EvidenceComplete() ? COHERENCE_STATUS.PASS : COHERENCE_STATUS.WARNING,
        observed: canvasF13EvidenceComplete() ? "Canvas F13 evidence returned." : "Canvas F13 evidence not complete.",
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
      authority: "lab-triple-g-coherence-diagnostic-north-two-cycle-distributor",
      goalProfileId: goalProfile.id,
      goalProfile: clonePlain(goalProfile),
      constructionReady: true,
      imageRendered,
      coherentExpressionPass: false,
      coherenceScore: failedCheckpoints.length ? 72 : canvasF13EvidenceComplete() ? 88 : state.cycleTwo.canvasF13ReleaseAuthorized ? 84 : 78,
      coherenceStatus: failedCheckpoints.length ? COHERENCE_STATUS.FAIL : COHERENCE_STATUS.WARNING,
      checkpoints,
      failedCheckpoints: failedCheckpoints.map((item) => item.id),
      warningCheckpoints: checkpoints.filter((item) => item.status === COHERENCE_STATUS.WARNING).map((item) => item.id),
      heldCheckpoints: heldCheckpoints.map((item) => item.id),
      nextStrategy: [`Complete next gate: ${state.recommendedNextFile}`],
      twoCycleRuntimeLawActive: true,
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
          twoCycleRuntimeLawActive: true,
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
      loadingOptimizationContract: "LAB_UNIVERSAL_PLANET_LOADING_OPTIMIZATION_PLAN_TWO_CYCLE_PRIMARY_GATE_v1",
      loadingOptimizationReceipt: "LAB_UNIVERSAL_PLANET_LOADING_OPTIMIZATION_PLAN_TWO_CYCLE_PRIMARY_GATE_RECEIPT_v1",
      authority: "north-two-cycle-loading-optimization",
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
      twoCycleRuntimeLawActive: true,
      canvasF13ReleaseBeforeF21Active: true,
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
    refreshObservedAuthorities();

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
      planContract: "LAB_UNIVERSAL_PLANET_PROCEDURAL_VISUAL_CARRIER_PLAN_TWO_CYCLE_PRIMARY_GATE_v1",
      planReceipt: "LAB_UNIVERSAL_PLANET_PROCEDURAL_VISUAL_CARRIER_PLAN_TWO_CYCLE_PRIMARY_GATE_RECEIPT_v1",
      authority: "north-two-cycle-visual-carrier-plan",
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
      atlasStartAuthorized: state.cycleTwo.canvasF13ReleaseAuthorized,
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
      twoCycleRuntimeLawActive: true,
      canvasF13ReleaseAuthorized: state.cycleTwo.canvasF13ReleaseAuthorized,
      canvasF13EvidenceComplete: canvasF13EvidenceComplete(),
      downstreamReleaseAuthorized: state.downstreamReleaseAuthorized,
      childFailureDoesNotEraseVisualization: true,
      wideProbeBlocksFirstVisibleRender: false,
      singleAnchorIsLocalProofOnly: true,
      coherentExpressionEligible: true,
      coherentExpressionPass: false,
      visualPassClaimed: false,
      recommendedCheckpointSessionFactory: "createHearthTransmissionSession",
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
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
    state.activeStageId = "C1_EAST_PRIMARY";
    state.activeGear = "GEAR_C1_EAST_PRIMARY";
    state.activeCycleNumber = 1;
    state.activeCycleRoute = CYCLE.ONE;
    state.activeCardinal = CARDINAL.EAST;
    state.activeFileGate = PRIMARY_GATES.east;
    state.activeFibonacci = "F3";
    state.activeNewsGate = NEWS_GATES.EAST;
    state.activeProgress = 0;

    state.completedStages = ["C1_NORTH_START"];
    state.degradedStages = [];
    state.blockedStages = [];

    state.cycleOne.eastReceived = false;
    state.cycleOne.eastAccepted = false;
    state.cycleOne.westReceived = false;
    state.cycleOne.westAccepted = false;
    state.cycleOne.southReceived = false;
    state.cycleOne.southAccepted = false;
    state.cycleOne.northReturnReceived = false;
    state.cycleOne.northReturnValidated = false;
    state.cycleOne.complete = false;
    state.cycleOne.degradedCompatibilityClose = false;

    state.cycleTwo.startAuthorized = false;
    state.cycleTwo.eastReceived = false;
    state.cycleTwo.eastAccepted = false;
    state.cycleTwo.southReceived = false;
    state.cycleTwo.southAccepted = false;
    state.cycleTwo.westReceived = false;
    state.cycleTwo.westAccepted = false;
    state.cycleTwo.westAuditObserved = false;
    state.cycleTwo.westAuditAccepted = false;
    state.cycleTwo.westCanvasReleaseApproved = false;
    state.cycleTwo.canvasF13ReleaseAuthorized = false;
    state.cycleTwo.canvasF13ReleasePacketReady = false;
    state.cycleTwo.canvasF13ReleaseHeldReason = "WAITING_CYCLE_TWO_WEST_AUDIT";
    state.cycleTwo.canvasF13EvidenceReceived = false;
    state.cycleTwo.canvasF13EvidenceStrict = false;
    state.cycleTwo.canvasF13EvidenceDegraded = false;
    state.cycleTwo.canvasF13EvidenceComplete = false;
    state.cycleTwo.canvasF13HardFail = false;
    state.cycleTwo.complete = false;

    state.f21EligibilityReceived = false;
    state.f21EligibilityAccepted = false;
    state.f21EligibilityRejected = false;
    state.f21EligibilityValidation = null;
    state.f21LatchMode = "WAITING_CANVAS_F13_EVIDENCE";
    state.f21EligibleForNorth = false;
    state.completionLatched = false;
    state.finalCompletionLatched = false;
    state.degradedCompletionLatched = false;

    state.downstreamReleaseAuthorized = false;
    state.downstreamReleaseTarget = "";
    state.canvasReleaseAuthorized = false;
    state.readyTextAllowed = false;

    state.firstFailedCoordinate = "WAITING_EAST_PRIMARY_GATE";
    state.recommendedNextOwner = CARDINAL.EAST;
    state.recommendedNextFile = PRIMARY_GATES.east;
    state.recommendedNextRenewalTarget = PRIMARY_GATES.east;
    state.postgameStatus = "TWO_CYCLE_NORTH_READY";
    state.updatedAt = nowIso();

    refreshStageLedger();
    record("receipt", "TWO_CYCLE_PRIMARY_GATE_REGISTRY_RESET", { reason });
    publishAll();

    return getReceipt();
  }

  function createCheckpointSession(_sequenceInput = null, options = {}) {
    const sessionId = options.sessionId || options.id || "HEARTH-NORTH-TWO-CYCLE-CANVAS-F13-RELEASE";

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      checkpointSessionContract: "LAB_RUNTIME_TABLE_NORTH_TWO_CYCLE_SESSION_v1",
      checkpointSessionReceipt: "LAB_RUNTIME_TABLE_NORTH_TWO_CYCLE_SESSION_RECEIPT_v1",
      sessionId,
      route: options.route || ROUTE,
      persistentNorthSession: true,
      primaryGateRegistryActive: true,
      primaryGateFilesLocked: true,
      twoCycleRuntimeLawActive: true,

      acceptEastPrimary,
      receiveEastPrimary,
      acceptEastPrimaryGate,
      acceptEastHandoff,
      receiveEastHandoff,

      acceptSouthPrimary,
      receiveSouthPrimary,
      acceptSouthPrimaryGate,
      acceptSouthSpread,
      receiveCycleOneSouthReturn,

      acceptWestPrimary,
      receiveWestPrimary,
      acceptWestPrimaryGate,
      acceptWestHandoff,
      receiveWestHandoff,
      acceptWestIntake,
      receiveWestIntake,

      authorizeCycleTwoStart,
      authorizeCanvasF13Release,
      composeCanvasF13ReleasePacket,
      acceptCanvasF13Evidence,

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
    sessionId: "HEARTH-NORTH-TWO-CYCLE-CANVAS-F13-RELEASE",
    route: ROUTE,
    file: FILE,
    cardinalRole: CARDINAL.NORTH,

    acceptEastPrimary,
    receiveEastPrimary,
    acceptEastPrimaryGate,
    acceptEastHandoff,
    receiveEastHandoff,

    acceptSouthPrimary,
    receiveSouthPrimary,
    acceptSouthPrimaryGate,
    acceptSouthSpread,
    receiveCycleOneSouthReturn,

    acceptWestPrimary,
    receiveWestPrimary,
    acceptWestPrimaryGate,
    acceptWestHandoff,
    receiveWestHandoff,
    acceptWestIntake,
    receiveWestIntake,

    authorizeCycleTwoStart,
    authorizeCanvasF13Release,
    composeCanvasF13ReleasePacket,
    acceptCanvasF13Evidence,

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
    refreshObservedAuthorities();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "north-two-cycle-cardinal-receipt",
      primaryGateRegistryActive: true,
      primaryGateFilesLocked: true,
      twoCycleRuntimeLawActive: true,
      northLoaded: true,
      eastPrimaryFileGate: PRIMARY_GATES.east,
      southPrimaryFileGate: PRIMARY_GATES.south,
      westPrimaryFileGate: PRIMARY_GATES.west,
      canvasFileGate: DOWNSTREAM_GATES.canvas,
      cycleOneRoute: CYCLE.ONE,
      cycleTwoRoute: CYCLE.TWO,
      canvasF13ReleaseAuthorized: state.cycleTwo.canvasF13ReleaseAuthorized,
      canvasF13EvidenceComplete: canvasF13EvidenceComplete(),
      downstreamReleaseAuthorized: state.downstreamReleaseAuthorized,
      nextPrimaryOwner: state.recommendedNextOwner,
      nextPrimaryTarget: state.recommendedNextFile,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    refreshObservedAuthorities();
    refreshStageLedger();

    const news = evaluateNewsGateState();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "lab-runtime-table-north-two-cycle-canvas-f13-release-distributor",
      destinationFile: FILE,
      file: FILE,
      route: ROUTE,
      status: "active",
      role: state.role,
      cardinalRole: CARDINAL.NORTH,

      primaryGateRegistryActive: true,
      primaryGateFilesLocked: true,
      fileGatesPrimary: true,
      twoCycleRuntimeLawActive: true,
      cycleOneRoute: CYCLE.ONE,
      cycleTwoRoute: CYCLE.TWO,
      canvasF13ReleaseBeforeF21Active: true,
      canvasF13IsNotDownstreamRelease: true,
      downstreamReleaseHeldUntilF21Latch: true,
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
      activeCycleNumber: state.activeCycleNumber,
      activeCycleRoute: state.activeCycleRoute,
      activeCardinal: state.activeCardinal,
      activeFileGate: state.activeFileGate,
      activeFibonacci: state.activeFibonacci,
      activeNewsGate: state.activeNewsGate,
      activeProgress: state.activeProgress,

      observed: clonePlain(state.observed),
      cycleOne: clonePlain(state.cycleOne),
      cycleTwo: clonePlain(state.cycleTwo),

      completedStages: state.completedStages.slice(),
      degradedStages: state.degradedStages.slice(),
      blockedStages: state.blockedStages.slice(),

      northPrimaryReady: true,
      eastPrimaryReceived: state.cycleOne.eastReceived || state.cycleTwo.eastReceived,
      eastPrimaryAccepted: state.cycleOne.eastAccepted && state.cycleTwo.eastAccepted,
      southPrimaryReceived: state.cycleOne.southReceived || state.cycleTwo.southReceived,
      southPrimaryAccepted: state.cycleOne.southAccepted && state.cycleTwo.southAccepted,
      westPrimaryReceived: state.cycleOne.westReceived || state.cycleTwo.westReceived,
      westPrimaryAccepted: state.cycleOne.westAccepted && state.cycleTwo.westAccepted,
      primaryCycleComplete: primaryCycleComplete(),

      cycleOneComplete: cycleOneComplete(),
      cycleTwoStartAuthorized: state.cycleTwo.startAuthorized,
      cycleTwoPrimaryReadyForCanvasRelease: cycleTwoPrimaryReadyForCanvasRelease(),

      westAuditObserved: state.cycleTwo.westAuditObserved,
      westAuditAccepted: state.cycleTwo.westAuditAccepted,
      westCanvasReleaseApproved: state.cycleTwo.westCanvasReleaseApproved,

      canvasReleaseAuthorized: state.cycleTwo.canvasF13ReleaseAuthorized,
      canvasF13ReleaseAuthorized: state.cycleTwo.canvasF13ReleaseAuthorized,
      canvasF13ReleasePacketReady: state.cycleTwo.canvasF13ReleasePacketReady,
      canvasF13ReleaseHeldReason: state.cycleTwo.canvasF13ReleaseHeldReason,
      canvasReleasePacket: composeCanvasF13ReleasePacket(),

      canvasF13EvidenceReceived: state.cycleTwo.canvasF13EvidenceReceived,
      canvasF13EvidenceStrict: state.cycleTwo.canvasF13EvidenceStrict,
      canvasF13EvidenceDegraded: state.cycleTwo.canvasF13EvidenceDegraded,
      canvasF13EvidenceComplete: canvasF13EvidenceComplete(),
      canvasF13HardFail: state.cycleTwo.canvasF13HardFail,

      f21EligibilityReceived: state.f21EligibilityReceived,
      f21EligibilityAccepted: state.f21EligibilityAccepted,
      f21EligibilityRejected: state.f21EligibilityRejected,
      f21EligibilityValidation: clonePlain(state.f21EligibilityValidation),
      f21EligibleForNorth: state.f21EligibleForNorth,
      f21LatchMode: state.f21LatchMode,
      completionLatched: state.completionLatched,
      finalCompletionLatched: state.finalCompletionLatched,
      degradedCompletionLatched: state.degradedCompletionLatched,
      readyTextAllowed: state.readyTextAllowed,

      newsGateState: news,
      northGateReady: news.northGateReady,
      eastGateReady: news.eastGateReady,
      southGateReady: news.southGateReady,
      westGateReady: news.westGateReady,
      canvasGateReady: news.canvasGateReady,
      newsGatePassedBeforeF21: news.newsGatePassedBeforeF21,
      newsGateDegradedBeforeF21: news.newsGateDegradedBeforeF21,

      downstreamReleaseAuthorized: state.downstreamReleaseAuthorized,
      downstreamReleaseTarget: state.downstreamReleaseTarget,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

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
        "authorizeCanvasF13Release",
        "composeCanvasF13ReleasePacket",
        "acceptCanvasF13Evidence",
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
        "two-cycle-runtime-law",
        "primary-file-gate-map",
        "north-macro-distribution",
        "cycle-one-return-latch",
        "cycle-two-start-authorization",
        "Canvas F13 release authorization",
        "F21 North latch validation",
        "downstream release authorization"
      ],

      transmissionReceipt: {
        contract: CONTRACT,
        receipt: RECEIPT,
        file: FILE,
        route: ROUTE,
        activeStageId: state.activeStageId,
        activeGear: state.activeGear,
        activeCycleNumber: state.activeCycleNumber,
        activeCycleRoute: state.activeCycleRoute,
        activeFileGate: state.activeFileGate,
        activeProgress: state.activeProgress,
        cycleOneComplete: cycleOneComplete(),
        cycleTwoStartAuthorized: state.cycleTwo.startAuthorized,
        canvasF13ReleaseAuthorized: state.cycleTwo.canvasF13ReleaseAuthorized,
        canvasF13EvidenceComplete: canvasF13EvidenceComplete(),
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
      `- ${stage.id} :: cycle=${stage.cycleNumber} :: ${stage.cardinal} :: file=${stage.file} :: complete=${stage.complete} :: degraded=${stage.degraded} :: active=${stage.active}`
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
      "LAB_RUNTIME_TABLE_NORTH_TWO_CYCLE_CANVAS_F13_RELEASE_DISTRIBUTOR_RECEIPT",
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
      `twoCycleRuntimeLawActive=${r.twoCycleRuntimeLawActive}`,
      `cycleOneRoute=${r.cycleOneRoute}`,
      `cycleTwoRoute=${r.cycleTwoRoute}`,
      `canvasF13ReleaseBeforeF21Active=${r.canvasF13ReleaseBeforeF21Active}`,
      `canvasF13IsNotDownstreamRelease=${r.canvasF13IsNotDownstreamRelease}`,
      `downstreamReleaseHeldUntilF21Latch=${r.downstreamReleaseHeldUntilF21Latch}`,
      "",
      `cycleOneComplete=${r.cycleOneComplete}`,
      `cycleTwoStartAuthorized=${r.cycleTwoStartAuthorized}`,
      `cycleTwoPrimaryReadyForCanvasRelease=${r.cycleTwoPrimaryReadyForCanvasRelease}`,
      "",
      `activeStageId=${r.activeStageId}`,
      `activeGear=${r.activeGear}`,
      `activeCycleNumber=${r.activeCycleNumber}`,
      `activeCycleRoute=${r.activeCycleRoute}`,
      `activeCardinal=${r.activeCardinal}`,
      `activeFileGate=${r.activeFileGate}`,
      `activeFibonacci=${r.activeFibonacci}`,
      `activeNewsGate=${r.activeNewsGate}`,
      `activeProgress=${r.activeProgress}`,
      "",
      "STAGE_LEDGER",
      stages,
      "",
      `westAuditObserved=${r.westAuditObserved}`,
      `westAuditAccepted=${r.westAuditAccepted}`,
      `westCanvasReleaseApproved=${r.westCanvasReleaseApproved}`,
      "",
      `canvasReleaseAuthorized=${r.canvasReleaseAuthorized}`,
      `canvasF13ReleaseAuthorized=${r.canvasF13ReleaseAuthorized}`,
      `canvasF13ReleasePacketReady=${r.canvasF13ReleasePacketReady}`,
      `canvasF13ReleaseHeldReason=${r.canvasF13ReleaseHeldReason}`,
      `canvasF13EvidenceReceived=${r.canvasF13EvidenceReceived}`,
      `canvasF13EvidenceStrict=${r.canvasF13EvidenceStrict}`,
      `canvasF13EvidenceDegraded=${r.canvasF13EvidenceDegraded}`,
      `canvasF13EvidenceComplete=${r.canvasF13EvidenceComplete}`,
      `canvasF13HardFail=${r.canvasF13HardFail}`,
      "",
      `f21EligibilityReceived=${r.f21EligibilityReceived}`,
      `f21EligibilityAccepted=${r.f21EligibilityAccepted}`,
      `f21EligibilityRejected=${r.f21EligibilityRejected}`,
      `f21EligibleForNorth=${r.f21EligibleForNorth}`,
      `f21LatchMode=${r.f21LatchMode}`,
      `completionLatched=${r.completionLatched}`,
      `finalCompletionLatched=${r.finalCompletionLatched}`,
      `degradedCompletionLatched=${r.degradedCompletionLatched}`,
      `readyTextAllowed=${r.readyTextAllowed}`,
      "",
      `northGateReady=${r.northGateReady}`,
      `eastGateReady=${r.eastGateReady}`,
      `southGateReady=${r.southGateReady}`,
      `westGateReady=${r.westGateReady}`,
      `canvasGateReady=${r.canvasGateReady}`,
      `newsGatePassedBeforeF21=${r.newsGatePassedBeforeF21}`,
      `newsGateDegradedBeforeF21=${r.newsGateDegradedBeforeF21}`,
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
    CYCLE,
    CARDINAL,
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
    receiveCycleOneSouthReturn,

    acceptWestPrimary,
    receiveWestPrimary,
    acceptWestPrimaryGate,
    acceptWestHandoff,
    receiveWestHandoff,
    acceptWestIntake,
    receiveWestIntake,

    authorizeCycleTwoStart,
    authorizeCanvasF13Release,
    composeCanvasF13ReleasePacket,
    acceptCanvasF13Evidence,

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
    twoCycleRuntimeLawActive: true,
    cycleOneRoute: CYCLE.ONE,
    cycleTwoRoute: CYCLE.TWO,
    canvasF13ReleaseBeforeF21Active: true,
    canvasF13IsNotDownstreamRelease: true,
    downstreamReleaseHeldUntilF21Latch: true,
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
    get activeCycleNumber() {
      return state.activeCycleNumber;
    },
    get activeCycleRoute() {
      return state.activeCycleRoute;
    },
    get primaryCycleComplete() {
      return primaryCycleComplete();
    },
    get canvasF13ReleaseAuthorized() {
      return state.cycleTwo.canvasF13ReleaseAuthorized;
    },
    get canvasF13EvidenceComplete() {
      return canvasF13EvidenceComplete();
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
    dataset.twoCycleRuntimeLawActive = "true";
    dataset.cycleOneRoute = CYCLE.ONE;
    dataset.cycleTwoRoute = CYCLE.TWO;
    dataset.canvasF13ReleaseBeforeF21Active = "true";
    dataset.canvasF13IsNotDownstreamRelease = "true";
    dataset.downstreamReleaseHeldUntilF21Latch = "true";
    dataset.northMacroOnly = "true";
    dataset.microTuningDelegatesDownstream = "true";

    dataset.primaryNorthFileGate = PRIMARY_GATES.north;
    dataset.primaryEastFileGate = PRIMARY_GATES.east;
    dataset.primarySouthFileGate = PRIMARY_GATES.south;
    dataset.primaryWestFileGate = PRIMARY_GATES.west;
    dataset.canvasF13FileGate = DOWNSTREAM_GATES.canvas;

    dataset.activeStageId = state.activeStageId;
    dataset.activeGear = state.activeGear;
    dataset.activeCycleNumber = String(state.activeCycleNumber);
    dataset.activeCycleRoute = state.activeCycleRoute;
    dataset.activeCardinal = state.activeCardinal;
    dataset.activeFileGate = state.activeFileGate;
    dataset.activeFibonacci = state.activeFibonacci;
    dataset.activeNewsGate = state.activeNewsGate;
    dataset.activeProgress = String(state.activeProgress);

    dataset.cycleOneComplete = String(cycleOneComplete());
    dataset.cycleTwoStartAuthorized = String(state.cycleTwo.startAuthorized);
    dataset.cycleTwoPrimaryReadyForCanvasRelease = String(cycleTwoPrimaryReadyForCanvasRelease());

    dataset.eastPrimaryAccepted = String(state.cycleOne.eastAccepted && state.cycleTwo.eastAccepted);
    dataset.southPrimaryAccepted = String(state.cycleOne.southAccepted && state.cycleTwo.southAccepted);
    dataset.westPrimaryAccepted = String(state.cycleOne.westAccepted && state.cycleTwo.westAccepted);
    dataset.primaryCycleComplete = String(primaryCycleComplete());

    dataset.westAuditObserved = String(state.cycleTwo.westAuditObserved);
    dataset.westAuditAccepted = String(state.cycleTwo.westAuditAccepted);
    dataset.westCanvasReleaseApproved = String(state.cycleTwo.westCanvasReleaseApproved);

    dataset.canvasReleaseAuthorized = String(state.cycleTwo.canvasF13ReleaseAuthorized);
    dataset.canvasF13ReleaseAuthorized = String(state.cycleTwo.canvasF13ReleaseAuthorized);
    dataset.canvasF13ReleasePacketReady = String(state.cycleTwo.canvasF13ReleasePacketReady);
    dataset.canvasF13ReleaseHeldReason = state.cycleTwo.canvasF13ReleaseHeldReason;
    dataset.canvasF13EvidenceReceived = String(state.cycleTwo.canvasF13EvidenceReceived);
    dataset.canvasF13EvidenceComplete = String(canvasF13EvidenceComplete());
    dataset.canvasF13HardFail = String(state.cycleTwo.canvasF13HardFail);

    dataset.f21EligibilityReceived = String(state.f21EligibilityReceived);
    dataset.f21EligibilityAccepted = String(state.f21EligibilityAccepted);
    dataset.f21EligibilityRejected = String(state.f21EligibilityRejected);
    dataset.f21EligibleForNorth = String(state.f21EligibleForNorth);
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
    root.DEXTER_LAB.northTwoCycleCanvasF13ReleaseDistributor = api;
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
    root.LAB_RUNTIME_TABLE_NORTH_TWO_CYCLE_DISTRIBUTOR = api;

    root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE = api;
    root.HEARTH_NORTH_COMMAND_TABLE = api;
    root.HEARTH_NORTH_COMMAND = api;
    root.HEARTH_LOCAL_COMMAND_RUNTIME_TABLE = api;
    root.HEARTH.northCommandRuntimeTable = api;
    root.HEARTH.northPrimaryGateRegistry = api;
    root.HEARTH.primaryGateRegistry = api;
    root.HEARTH.northTwoCycleCanvasF13ReleaseDistributor = api;

    root.HEARTH_CHECKPOINT_SESSION = transmissionSession;
    root.HEARTH_RUNTIME_CHECKPOINT_SESSION = transmissionSession;
    root.LAB_HEARTH_CHECKPOINT_SESSION = transmissionSession;
    root.LAB_CHECKPOINT_SESSION = transmissionSession;

    root.HEARTH_NORTH_TRANSMISSION_SESSION = transmissionSession;
    root.HEARTH_NORTH_PRIMARY_GATE_SESSION = transmissionSession;
    root.HEARTH_NORTH_TWO_CYCLE_SESSION = transmissionSession;

    const receiptLight = getTransmissionReceipt();

    root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT = receiptLight;
    root.HEARTH_NORTH_CYCLICAL_CHECKPOINT_RECEIPT = receiptLight;
    root.LAB_RUNTIME_TABLE_NORTH_TRANSMISSION_RECEIPT = receiptLight;
    root.LAB_RUNTIME_TABLE_NORTH_PRIMARY_GATE_RECEIPT = receiptLight;
    root.LAB_RUNTIME_TABLE_NORTH_TWO_CYCLE_RECEIPT = receiptLight;

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

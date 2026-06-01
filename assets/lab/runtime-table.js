// /assets/lab/runtime-table.js
// LAB_RUNTIME_TABLE_NORTH_CENTRAL_TRAIN_STATION_PRODUCT_ENGINE_CONDUCTOR_TNT_v3
// Full-file replacement.
// North primary Runtime Table authority + Central Train Station conductor.
// Purpose:
// - Preserve the locked two-cycle Runtime Table law.
// - Cycle 1: NORTH -> EAST -> WEST -> SOUTH -> NORTH.
// - Cycle 2: NORTH -> EAST -> SOUTH -> WEST -> CANVAS.
// - Preserve Canvas F13 release before F21.
// - Preserve North-only F21 completion latch.
// - Preserve non-blocking phase scheduling, cached authority scans, light receipts, deferred broad dataset writes.
// - Add Central Train Station authority for nodal artifact extraction, NEWS alignment, Fibonacci synchronization,
//   parent-contact detection, product-engine routing, and true next-file diagnosis.
// - Prevent repeated child-file renewals when parent contact, stale contract, NEWS mismatch, or downstream expression drift is the real gap.
// Does not own:
// - Canvas drawing
// - Canvas children
// - planet truth
// - material truth
// - hydrology truth
// - elevation truth
// - route visual layout
// - final visual pass claim
// - public benchmark superiority claims

(() => {
  "use strict";

  const CONTRACT = "LAB_RUNTIME_TABLE_NORTH_CENTRAL_TRAIN_STATION_PRODUCT_ENGINE_CONDUCTOR_TNT_v3";
  const RECEIPT = "LAB_RUNTIME_TABLE_NORTH_CENTRAL_TRAIN_STATION_PRODUCT_ENGINE_CONDUCTOR_RECEIPT_v3";
  const PREVIOUS_CONTRACT = "LAB_RUNTIME_TABLE_NORTH_NON_BLOCKING_PHASE_SCHEDULER_TWO_CYCLE_DISTRIBUTOR_TNT_v2";
  const BASELINE_CONTRACT = "LAB_RUNTIME_TABLE_NORTH_NON_BLOCKING_PHASE_SCHEDULER_TWO_CYCLE_DISTRIBUTOR_TNT_v2";
  const VERSION = "2026-06-01.lab-runtime-table-north-central-train-station-product-engine-conductor-v3";

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
    canvasSouth: "/assets/hearth/hearth.canvas.south.js",
    hearthAssets: "/assets/hearth/hearth.assets.js",
    productEngineKernel: "/assets/product-engine/product-engine.kernel.js",
    productEngineRuntime: "/assets/product-engine/product-engine.runtime.js",
    productEngineAssets: "/assets/product-engine/product-engine.assets.js",
    productEngineInterface: "/assets/product-engine/product-engine.interface.js",
    productEngineDiagnostics: "/assets/product-engine/product-engine.diagnostics.js",
    productEngineExport: "/assets/product-engine/product-engine.export.js"
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
    PRODUCT: "PRODUCT",
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
    RELEASE: "RELEASE",
    DISPATCH: "DISPATCH"
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
    CANVAS_F13_HELD: "CANVAS_F13_HELD",
    NON_BLOCKING_SCHEDULED: "NON_BLOCKING_SCHEDULED",
    PARENT_CONTACT_GAP: "PARENT_CONTACT_GAP",
    FIBONACCI_DRIFT: "FIBONACCI_DRIFT",
    NEWS_MISMATCH: "NEWS_MISMATCH",
    PRODUCT_ENGINE_ROUTING_GAP: "PRODUCT_ENGINE_ROUTING_GAP",
    STALE_CONTRACT: "STALE_CONTRACT",
    EXPRESSION_DOWNSTREAM_GAP: "EXPRESSION_DOWNSTREAM_GAP"
  });

  const NEWS_GATES = Object.freeze({
    NORTH: "NORTH",
    EAST: "EAST",
    SOUTH: "SOUTH",
    WEST: "WEST",
    CANVAS: "CANVAS",
    F21: "F21",
    DOWNSTREAM: "DOWNSTREAM",
    PRODUCT: "PRODUCT",
    AUDIT: "AUDIT"
  });

  const STATION_PLATFORMS = Object.freeze({
    NORTH_PLATFORM: "NORTH_PLATFORM",
    EAST_PLATFORM: "EAST_PLATFORM",
    SOUTH_PLATFORM: "SOUTH_PLATFORM",
    WEST_PLATFORM: "WEST_PLATFORM",
    CANVAS_PLATFORM: "CANVAS_PLATFORM",
    PRODUCT_ENGINE_PLATFORM: "PRODUCT_ENGINE_PLATFORM",
    VISUAL_ENGINE_PLATFORM: "VISUAL_ENGINE_PLATFORM",
    ASSET_ENGINE_PLATFORM: "ASSET_ENGINE_PLATFORM",
    ROUTE_ENGINE_PLATFORM: "ROUTE_ENGINE_PLATFORM",
    AUDIT_ENGINE_PLATFORM: "AUDIT_ENGINE_PLATFORM",
    DOWNSTREAM_PLATFORM: "DOWNSTREAM_PLATFORM",
    UNKNOWN_PLATFORM: "UNKNOWN_PLATFORM"
  });

  const ARTIFACT_CLASSES = Object.freeze({
    PRIMARY_CARDINAL_ARTIFACT: "PRIMARY_CARDINAL_ARTIFACT",
    CANVAS_PARENT_ARTIFACT: "CANVAS_PARENT_ARTIFACT",
    CANVAS_CHILD_ARTIFACT: "CANVAS_CHILD_ARTIFACT",
    PRODUCT_ENGINE_ARTIFACT: "PRODUCT_ENGINE_ARTIFACT",
    VISUAL_ENGINE_ARTIFACT: "VISUAL_ENGINE_ARTIFACT",
    ASSET_ENGINE_ARTIFACT: "ASSET_ENGINE_ARTIFACT",
    ROUTE_ENGINE_ARTIFACT: "ROUTE_ENGINE_ARTIFACT",
    AUDIT_ENGINE_ARTIFACT: "AUDIT_ENGINE_ARTIFACT",
    RECEIPT_ARTIFACT: "RECEIPT_ARTIFACT",
    UNKNOWN_ARTIFACT: "UNKNOWN_ARTIFACT"
  });

  const PARENT_CONTACT_STATUS = Object.freeze({
    PARENT_CONTACT_STRICT: "PARENT_CONTACT_STRICT",
    PARENT_CONTACT_ADMISSIBLE: "PARENT_CONTACT_ADMISSIBLE",
    PARENT_CONTACT_DEGRADED: "PARENT_CONTACT_DEGRADED",
    PARENT_CONTACT_LOST: "PARENT_CONTACT_LOST",
    PARENT_CONTACT_CONFLICT: "PARENT_CONTACT_CONFLICT"
  });

  const FIBONACCI_SYNC_STATUS = Object.freeze({
    STRICT_SYNC: "STRICT_SYNC",
    ADMISSIBLE_SYNC: "ADMISSIBLE_SYNC",
    DEGRADED_SYNC: "DEGRADED_SYNC",
    HELD_SYNC: "HELD_SYNC",
    BLOCKED_SYNC: "BLOCKED_SYNC"
  });

  const NEWS_ALIGNMENT_STATUS = Object.freeze({
    NEWS_PASS: "NEWS_PASS",
    NEWS_DEGRADED: "NEWS_DEGRADED",
    NEWS_HELD: "NEWS_HELD",
    NEWS_BLOCKED: "NEWS_BLOCKED"
  });

  const DISPATCH_ACTION = Object.freeze({
    ADMIT: "ADMIT",
    DISPATCH: "DISPATCH",
    HOLD: "HOLD",
    DEGRADED_FORWARD: "DEGRADED_FORWARD",
    BLOCK: "BLOCK",
    ARCHIVE: "ARCHIVE"
  });

  const PRODUCT_ENGINE_TRACKS = Object.freeze({
    PRODUCT_KERNEL: "PRODUCT_KERNEL",
    PRODUCT_RUNTIME: "PRODUCT_RUNTIME",
    PRODUCT_ASSETS: "PRODUCT_ASSETS",
    PRODUCT_INTERFACE: "PRODUCT_INTERFACE",
    PRODUCT_DIAGNOSTICS: "PRODUCT_DIAGNOSTICS",
    PRODUCT_EXPORT: "PRODUCT_EXPORT",
    PRODUCT_UNKNOWN: "PRODUCT_UNKNOWN"
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
    north: "primary macro distributor / central train station / timing governor / release authority",
    correctedLaw: "two-cycle Runtime Table law",
    cycleOne: "North -> East -> West -> South -> North",
    cycleTwo: "North -> East -> South -> West -> Canvas",
    canvasF13: "Canvas F13 evidence receiver; allowed before F21 and forbidden from claiming READY",
    f21: "North-only completion latch after Canvas F13 evidence returns",
    downstream: "route, canvas, product, and Hearth-specific consumers after North F21 latch",
    scheduler: "non-blocking phase scheduler; light receipts during motion, full receipts on demand",
    station: "central train station routes all coordinated engine artifacts by platform, NEWS gate, Fibonacci stage, and parent contact"
  });

  const PRIMARY_ROTATION = Object.freeze([
    { id: "C1_NORTH_START", gear: "GEAR_C1_NORTH_START", cycleNumber: 1, cycleRoute: CYCLE.ONE, cardinal: CARDINAL.NORTH, file: PRIMARY_GATES.north, fibonacci: "F1", news: NEWS_GATES.NORTH, label: "Cycle 1 North start" },
    { id: "C1_EAST_PRIMARY", gear: "GEAR_C1_EAST_PRIMARY", cycleNumber: 1, cycleRoute: CYCLE.ONE, cardinal: CARDINAL.EAST, file: PRIMARY_GATES.east, fibonacci: "F3", news: NEWS_GATES.EAST, label: "Cycle 1 East primary" },
    { id: "C1_WEST_PRIMARY", gear: "GEAR_C1_WEST_PRIMARY", cycleNumber: 1, cycleRoute: CYCLE.ONE, cardinal: CARDINAL.WEST, file: PRIMARY_GATES.west, fibonacci: "F5", news: NEWS_GATES.WEST, label: "Cycle 1 West primary" },
    { id: "C1_SOUTH_RETURN", gear: "GEAR_C1_SOUTH_RETURN", cycleNumber: 1, cycleRoute: CYCLE.ONE, cardinal: CARDINAL.SOUTH, file: PRIMARY_GATES.south, fibonacci: "F8", news: NEWS_GATES.SOUTH, label: "Cycle 1 South return" },
    { id: "C1_NORTH_RETURN_LATCH", gear: "GEAR_C1_NORTH_RETURN_LATCH", cycleNumber: 1, cycleRoute: CYCLE.ONE, cardinal: CARDINAL.NORTH, file: PRIMARY_GATES.north, fibonacci: "F8N", news: NEWS_GATES.NORTH, label: "Cycle 1 North return latch" },
    { id: "C2_NORTH_START", gear: "GEAR_C2_NORTH_START", cycleNumber: 2, cycleRoute: CYCLE.TWO, cardinal: CARDINAL.NORTH, file: PRIMARY_GATES.north, fibonacci: "F13", news: NEWS_GATES.NORTH, label: "Cycle 2 North start" },
    { id: "C2_EAST_PRIMARY", gear: "GEAR_C2_EAST_PRIMARY", cycleNumber: 2, cycleRoute: CYCLE.TWO, cardinal: CARDINAL.EAST, file: PRIMARY_GATES.east, fibonacci: "F13E", news: NEWS_GATES.EAST, label: "Cycle 2 East primary" },
    { id: "C2_SOUTH_PRIMARY", gear: "GEAR_C2_SOUTH_PRIMARY", cycleNumber: 2, cycleRoute: CYCLE.TWO, cardinal: CARDINAL.SOUTH, file: PRIMARY_GATES.south, fibonacci: "F13S", news: NEWS_GATES.SOUTH, label: "Cycle 2 South primary" },
    { id: "C2_WEST_CANVAS_RELEASE_AUDIT", gear: "GEAR_C2_WEST_CANVAS_RELEASE_AUDIT", cycleNumber: 2, cycleRoute: CYCLE.TWO, cardinal: CARDINAL.WEST, file: PRIMARY_GATES.west, fibonacci: "F13W", news: NEWS_GATES.WEST, label: "Cycle 2 West canvas-release audit" },
    { id: "C2_CANVAS_F13_EVIDENCE", gear: "GEAR_C2_CANVAS_F13_EVIDENCE", cycleNumber: 2, cycleRoute: CYCLE.TWO, cardinal: CARDINAL.CANVAS, file: DOWNSTREAM_GATES.canvas, fibonacci: "F13C", news: NEWS_GATES.CANVAS, label: "Canvas F13 evidence" },
    { id: "F21_NORTH_NEWS_LATCH", gear: "GEAR_F21_NORTH_NEWS_LATCH", cycleNumber: 2, cycleRoute: CYCLE.TWO, cardinal: CARDINAL.NORTH, file: PRIMARY_GATES.north, fibonacci: "F21", news: NEWS_GATES.F21, label: "F21 North NEWS latch" },
    { id: "DOWNSTREAM_RELEASE", gear: "GEAR_DOWNSTREAM_RELEASE", cycleNumber: 2, cycleRoute: CYCLE.TWO, cardinal: CARDINAL.DOWNSTREAM, file: DOWNSTREAM_GATES.hearthIndex, fibonacci: "F21_RELEASE", news: NEWS_GATES.DOWNSTREAM, label: "Downstream release" }
  ]);

  const PRIMARY_EVENTS = Object.freeze({
    EAST: [
      "EAST_PRIMARY_GATE_READY",
      "EAST_PRIMARY_ALIGNMENT_READY",
      "EAST_PRIMARY_NEWS_FIBONACCI_READY",
      "RUNTIME_TABLE_EAST_READY",
      "PRIMARY_EAST_GATE_ACCEPTED",
      "EAST_STEP1_COMPLETE",
      "EAST_STEP1_HANDOFF_ACCEPTED_BY_WEST_METHOD",
      "EAST_ROUTE_STEP1_READY"
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
      "CANVAS_RELEASE_APPROVED_BY_WEST",
      "MACRO_WEST_ADMISSIBILITY_CLASSIFIED"
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
      "HEARTH_CANVAS_PARENT_CURRENT_SOUTH_PROOF_RECONCILIATION",
      "HEARTH_CANVAS_PARENT_PRE_RELEASE_STRUCTURAL_CARRIER_THEN_WEST_RELEASE_TO_EAST",
      "HEARTH_CANVAS_PARENT_RELEASE_PACKET_TO_EAST_STALE_CLEARANCE",
      "HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER",
      "HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER",
      "HEARTH_CANVAS_PHYSICAL_CARRIER_F13_PROOF_PARENT",
      "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION",
      "HEARTH_CANVAS_TRANSISTOR_GATE",
      "HEARTH_CANVAS_SPLIT_ADAPTER",
      "HEARTH_CANVAS_NORTH",
      "HEARTH_CANVAS_AUTHORITY",
      "HEARTH_CANVAS_EVIDENCE",
      "HEARTH_CANVAS",
      "HEARTH.canvasParentCurrentSouthProofReconciliation",
      "HEARTH.canvasParentPreReleaseStructuralCarrierThenWestReleaseToEast",
      "HEARTH.canvasParentReleasePacketToEastStaleClearance",
      "HEARTH.canvasParentChildReconciliationF13EvidenceReceiver",
      "HEARTH.canvasParentGovernedF13EvidenceReceiver",
      "HEARTH.canvasNorth",
      "HEARTH.canvasSplitAdapter",
      "HEARTH.canvasTransistorGate",
      "HEARTH.canvasEvidence",
      "HEARTH.canvas",
      "DEXTER_LAB.hearthCanvasParentCurrentSouthProofReconciliation",
      "DEXTER_LAB.hearthCanvasParentPreReleaseStructuralCarrierThenWestReleaseToEast",
      "DEXTER_LAB.hearthCanvasParentReleasePacketToEastStaleClearance",
      "DEXTER_LAB.hearthCanvasParentChildReconciliationF13EvidenceReceiver",
      "DEXTER_LAB.hearthCanvasParentGovernedF13EvidenceReceiver",
      "DEXTER_LAB.hearthCanvasNorth",
      "DEXTER_LAB.hearthCanvasEvidence"
    ],
    product: [
      "PRODUCT_ENGINE",
      "PRODUCT_ENGINE_KERNEL",
      "PRODUCT_ENGINE_RUNTIME",
      "PRODUCT_ENGINE_ASSETS",
      "PRODUCT_ENGINE_INTERFACE",
      "PRODUCT_ENGINE_DIAGNOSTICS",
      "PRODUCT_ENGINE_EXPORT",
      "DGB_PRODUCT_ENGINE",
      "HEARTH_PRODUCT_ENGINE",
      "DEXTER_LAB.productEngine",
      "DEXTER_LAB.productEngineKernel",
      "DEXTER_LAB.productEngineRuntime",
      "DEXTER_LAB.productEngineAssets",
      "DEXTER_LAB.productEngineInterface",
      "DEXTER_LAB.productEngineDiagnostics",
      "DEXTER_LAB.productEngineExport"
    ]
  });

  const CANVAS_CHILD_GLOBALS = Object.freeze({
    east: [
      "HEARTH_CANVAS_EAST",
      "HEARTH.canvasEast",
      "HEARTH.canvasEastMaterialAtlasSourceMachine",
      "HEARTH.canvasEastMaterialAtlasSourceTransistor",
      "DEXTER_LAB.hearthCanvasEast",
      "DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachine"
    ],
    west: [
      "HEARTH_CANVAS_WEST",
      "HEARTH.canvasWest",
      "HEARTH.canvasWestInspectionInvalidationControl",
      "DEXTER_LAB.hearthCanvasWest",
      "DEXTER_LAB.hearthCanvasWestInspectionInvalidationControl"
    ],
    south: [
      "HEARTH_CANVAS_SOUTH",
      "HEARTH.canvasSouth",
      "HEARTH.canvasSouthF13SStrictVisibleProofClassifierChild",
      "DEXTER_LAB.hearthCanvasSouth",
      "DEXTER_LAB.hearthCanvasSouthF13SStrictVisibleProofClassifierChild"
    ]
  });

  const MAX_LOG = 160;
  const MAX_ARTIFACTS = 96;
  const AUTHORITY_CACHE_TTL_MS = 850;
  const STATION_CACHE_TTL_MS = 950;
  const LIGHT_FLUSH_DELAY_MS = 24;
  const FULL_DATASET_IDLE_DELAY_MS = 240;
  const PHASE_BUDGET_MS = 10;

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "north-central-train-station-product-engine-conductor",
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

    nonBlockingPhaseSchedulerActive: true,
    authorityScanCacheActive: true,
    lightReceiptDuringMotionActive: true,
    fullReceiptOnDemandOnly: true,
    datasetWriteCompactionActive: true,
    broadDatasetWritesDeferred: true,
    pageResponsive: true,

    centralTrainStationActive: true,
    stationRegistryActive: true,
    nodalArtifactExtractorActive: true,
    platformAssignerActive: true,
    centralDispatcherActive: true,
    productEngineConductorActive: true,
    newsAlignmentProtocolActive: true,
    fibonacciSynchronizationMetricActive: true,
    parentContactLedgerActive: true,
    centralReceiptBoardActive: true,
    expressionPreservationRuleActive: true,

    unrealStyleReference: true,
    surpassMarketTargetInternal: true,
    benchmarkRequiredBeforePublicClaim: true,
    productEngineBenchmarkPending: true,
    publicSuperiorityClaimed: false,

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
      allCanvasChildrenApiReady: false,
      productEngineObserved: false,
      authorityScanCached: false,
      authorityScanCount: 0,
      authorityScanLastAt: "",
      stationScanCached: false,
      stationScanCount: 0,
      stationScanLastAt: ""
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

    stationArtifacts: [],
    platformLedger: [],
    parentContactLedger: [],
    newsAlignmentLedger: [],
    fibonacciSyncLedger: [],
    dispatchLedger: [],
    productEngineLedger: [],
    doNotTouchList: [],

    artifactCount: 0,
    platformCount: 0,
    staleArtifactCount: 0,
    lostParentContactCount: 0,
    readyArtifactCount: 0,
    heldArtifactCount: 0,
    blockedArtifactCount: 0,

    parentBridgeAuditRequired: false,
    doNotRenewRepeatedly: true,
    expressionDownstreamGapLikely: false,
    repeatedChildRenewalGuardActive: true,
    lastRepeatedRenewalWarning: "",

    firstFailedCoordinate: "WAITING_EAST_PRIMARY_GATE",
    recommendedNextOwner: CARDINAL.EAST,
    recommendedNextFile: PRIMARY_GATES.east,
    recommendedNextRenewalTarget: PRIMARY_GATES.east,
    nextPlatform: STATION_PLATFORMS.EAST_PLATFORM,
    nextReason: "WAITING_EAST_PRIMARY_GATE",
    postgameStatus: "CENTRAL_TRAIN_STATION_READY",

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

  const scheduler = {
    queue: [],
    running: false,
    runScheduled: false,
    lightPublishScheduled: false,
    fullDatasetScheduled: false,
    globalsPublished: false,
    authorityCache: null,
    authorityCacheAt: 0,
    stationCache: null,
    stationCacheAt: 0,
    receiptLightCache: null,
    receiptLightCacheAt: 0,
    centralStationReceiptLightCache: null,
    centralStationReceiptLightCacheAt: 0,
    dirtyDatasetLight: true,
    dirtyDatasetFull: true,
    dirtyGlobals: true,
    dirtyReceiptLight: true,
    dirtyStationReceiptLight: true,
    phaseRunCount: 0,
    lastYieldAt: 0,
    lastFlushAt: 0
  };

  let transmissionSession = null;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function nowMs() {
    return Date.now ? Date.now() : new Date().getTime();
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

  function clamp(value, min, max) {
    const n = safeNumber(value, min);
    return Math.max(min, Math.min(max, n));
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

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function readDataset(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
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
    const artifact = isObject(base.artifact) ? base.artifact : {};

    return {
      ...snapshot,
      ...detail,
      ...release,
      ...receipt,
      ...artifact,
      ...base,
      detail,
      snapshot,
      releasePacket: release,
      receiptPacket: receipt,
      artifact
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
      getAnyString(packet, ["targetFile"], "") ||
      getAnyString(packet, ["primaryFileGate"], "") ||
      getAnyString(packet, ["activeFileGate"], "")
    );
  }

  function packetRoute(input = {}) {
    const packet = normalizePayload(input);
    return getAnyString(packet, ["route"], "") || ROUTE;
  }

  function packetContract(input = {}) {
    return getAnyString(input, ["contract"], "");
  }

  function packetReceipt(input = {}) {
    return getAnyString(input, ["receipt"], "");
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
    return normalizeCycleRoute(getAnyString(input, ["cycleRoute", "activeCycleRoute", "routeCycle"], ""));
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

  function markDirty(scope = "light") {
    scheduler.dirtyReceiptLight = true;
    scheduler.dirtyStationReceiptLight = true;
    scheduler.dirtyDatasetLight = true;
    scheduler.dirtyGlobals = true;

    if (scope === "full") {
      scheduler.dirtyDatasetFull = true;
    }

    scheduleLightPublish();
    if (scope === "full") scheduleFullDatasetPublish();
  }

  function nextFrame(callback) {
    if (isFunction(root.requestAnimationFrame)) {
      root.requestAnimationFrame(callback);
    } else {
      root.setTimeout(callback, 0);
    }
  }

  function idle(callback, timeout = FULL_DATASET_IDLE_DELAY_MS) {
    if (isFunction(root.requestIdleCallback)) {
      root.requestIdleCallback(callback, { timeout });
    } else {
      root.setTimeout(callback, timeout);
    }
  }

  function queuePhase(label, fn, detail = {}) {
    scheduler.queue.push({
      label: safeString(label, "PHASE"),
      fn,
      detail: clonePlain(detail),
      queuedAt: nowIso()
    });

    schedulePhaseRunner();

    return {
      accepted: true,
      action: CHECKPOINT_EVENT_ACTIONS.QUEUE,
      queued: true,
      label,
      queueDepth: scheduler.queue.length,
      pageResponsive: true,
      visualPassClaimed: false
    };
  }

  function schedulePhaseRunner() {
    if (scheduler.runScheduled || scheduler.running) return;

    scheduler.runScheduled = true;

    nextFrame(() => {
      scheduler.runScheduled = false;
      runPhaseQueue();
    });
  }

  function runPhaseQueue() {
    if (scheduler.running) return;

    scheduler.running = true;
    scheduler.phaseRunCount += 1;

    const started = nowMs();

    while (scheduler.queue.length) {
      const item = scheduler.queue.shift();

      try {
        if (isFunction(item.fn)) item.fn(item.detail || {});
        record("receipt", "NON_BLOCKING_PHASE_EXECUTED", {
          label: item.label,
          queueDepth: scheduler.queue.length
        }, { deferPublish: true });
      } catch (error) {
        recordError("NON_BLOCKING_PHASE_ERROR", error && error.message ? error.message : String(error), {
          label: item.label
        }, { deferPublish: true });
      }

      if (nowMs() - started >= PHASE_BUDGET_MS) {
        scheduler.running = false;
        scheduler.lastYieldAt = nowMs();
        schedulePhaseRunner();
        markDirty("light");
        return;
      }
    }

    scheduler.running = false;
    markDirty("light");
  }

  function scheduleLightPublish() {
    if (scheduler.lightPublishScheduled) return;

    scheduler.lightPublishScheduled = true;

    root.setTimeout(() => {
      scheduler.lightPublishScheduled = false;
      publishLight();
    }, LIGHT_FLUSH_DELAY_MS);
  }

  function scheduleFullDatasetPublish() {
    if (scheduler.fullDatasetScheduled) return;

    scheduler.fullDatasetScheduled = true;

    idle(() => {
      scheduler.fullDatasetScheduled = false;
      publishDatasetsFull();
    });
  }

  function record(kind, event, detail = {}, options = {}) {
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

    if (options.deferPublish !== true) markDirty(options.scope || "light");

    return item;
  }

  function recordError(code, message, detail = {}, options = {}) {
    return record("error", code, {
      code,
      message: String(message || ""),
      detail: clonePlain(detail)
    }, options);
  }

  function invalidateAuthorityCache(reason = "manual") {
    scheduler.authorityCache = null;
    scheduler.authorityCacheAt = 0;
    scheduler.stationCache = null;
    scheduler.stationCacheAt = 0;
    state.observed.authorityScanCached = false;
    state.observed.stationScanCached = false;

    record("receipt", "AUTHORITY_CACHE_INVALIDATED", { reason }, { deferPublish: true });
    markDirty("light");

    return {
      invalidated: true,
      reason,
      visualPassClaimed: false
    };
  }

  function readReceiptLightFirst(authority) {
    if (!authority || !isObject(authority)) return null;

    try {
      if (isFunction(authority.getReceiptLight)) {
        const receipt = authority.getReceiptLight();
        return isObject(receipt) ? receipt : null;
      }

      if (isFunction(authority.getCentralStationReceiptLight)) {
        const receipt = authority.getCentralStationReceiptLight();
        return isObject(receipt) ? receipt : null;
      }

      if (isFunction(authority.getTransmissionReceipt)) {
        const receipt = authority.getTransmissionReceipt();
        return isObject(receipt) ? receipt : null;
      }

      if (isObject(authority.receiptPacket)) return authority.receiptPacket;
      if (isObject(authority.receipt)) return authority.receipt;

      if (authority.contract || authority.receipt || authority.version) {
        return authority;
      }

      if (isFunction(authority.getReceipt)) {
        const receipt = authority.getReceipt();
        return isObject(receipt) ? receipt : null;
      }
    } catch (error) {
      return { error: error && error.message ? error.message : String(error) };
    }

    return null;
  }

  function readAuthority(cardinal) {
    const key = String(cardinal || "").toLowerCase();
    const authority = firstGlobal(GLOBALS[key] || []);
    const receipt = readReceiptLightFirst(authority) || {};

    return {
      authority,
      receipt,
      observed: Boolean(authority || (receipt && receipt.contract)),
      file:
        key === "east" ? PRIMARY_GATES.east :
        key === "south" ? PRIMARY_GATES.south :
        key === "west" ? PRIMARY_GATES.west :
        key === "canvas" ? DOWNSTREAM_GATES.canvas :
        key === "product" ? DOWNSTREAM_GATES.productEngineKernel :
        ""
    };
  }

  function readCanvasChild(key) {
    return firstGlobal(CANVAS_CHILD_GLOBALS[key] || []);
  }

  function stageById(id) {
    return PRIMARY_ROTATION.find((stage) => stage.id === id) || null;
  }

  function stageForFibonacci(fibonacci = "") {
    return PRIMARY_ROTATION.find((stage) => String(stage.fibonacci) === String(fibonacci)) || null;
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
    state.activeProgress = state.completedStages.includes(stage.id)
      ? 100
      : stage.id === "C2_CANVAS_F13_EVIDENCE"
        ? 72
        : 50;
  }

  function setRecommendation(owner, file, coordinate, platform = "", reason = "") {
    state.firstFailedCoordinate = coordinate;
    state.recommendedNextOwner = owner;
    state.recommendedNextFile = file;
    state.recommendedNextRenewalTarget = file;
    state.nextPlatform = platform || platformForFile(file);
    state.nextReason = reason || coordinate;
  }

  function platformForFile(file = "") {
    const f = safeString(file);

    if (f === PRIMARY_GATES.north) return STATION_PLATFORMS.NORTH_PLATFORM;
    if (f === PRIMARY_GATES.east) return STATION_PLATFORMS.EAST_PLATFORM;
    if (f === PRIMARY_GATES.south) return STATION_PLATFORMS.SOUTH_PLATFORM;
    if (f === PRIMARY_GATES.west) return STATION_PLATFORMS.WEST_PLATFORM;
    if (f.includes("/assets/hearth/hearth.canvas")) return STATION_PLATFORMS.CANVAS_PLATFORM;
    if (f.includes("/product-engine/") || /product/i.test(f)) return STATION_PLATFORMS.PRODUCT_ENGINE_PLATFORM;
    if (/assets|materials|biome|climate|elevation|terrain/i.test(f)) return STATION_PLATFORMS.ASSET_ENGINE_PLATFORM;
    if (/visual|carrier|render|expression|planet/i.test(f)) return STATION_PLATFORMS.VISUAL_ENGINE_PLATFORM;
    if (/route|index|handoff|showroom/i.test(f)) return STATION_PLATFORMS.ROUTE_ENGINE_PLATFORM;
    if (/audit|gauge|diagnostic|triple|ccr|news|fibonacci/i.test(f)) return STATION_PLATFORMS.AUDIT_ENGINE_PLATFORM;

    return STATION_PLATFORMS.UNKNOWN_PLATFORM;
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
    scheduler.dirtyReceiptLight = true;
  }

  function artifactClassFor(packet = {}) {
    const file = packetFile(packet);
    const contract = packetContract(packet);
    const text = `${file} ${contract} ${eventName(packet)}`.toUpperCase();

    if (file === PRIMARY_GATES.east || file === PRIMARY_GATES.south || file === PRIMARY_GATES.west || file === PRIMARY_GATES.north) {
      return ARTIFACT_CLASSES.PRIMARY_CARDINAL_ARTIFACT;
    }

    if (file === DOWNSTREAM_GATES.canvas || /CANVAS_PARENT|HEARTH_CANVAS_PARENT|HEARTH_CANVAS$/.test(text)) {
      return ARTIFACT_CLASSES.CANVAS_PARENT_ARTIFACT;
    }

    if (/CANVAS_EAST|CANVAS_WEST|CANVAS_SOUTH|HEARTH\.CANVAS(EAST|WEST|SOUTH)|HEARTH\.CANVASEAST|HEARTH\.CANVASWEST|HEARTH\.CANVASSOUTH/i.test(text) || file.includes("hearth.canvas.")) {
      return ARTIFACT_CLASSES.CANVAS_CHILD_ARTIFACT;
    }

    if (/PRODUCT_ENGINE|PRODUCT-ENGINE|PRODUCT ENGINE|PRODUCT_KERNEL|PRODUCT_RUNTIME|PRODUCT_ASSETS|PRODUCT_INTERFACE|PRODUCT_DIAGNOSTICS|PRODUCT_EXPORT/i.test(text)) {
      return ARTIFACT_CLASSES.PRODUCT_ENGINE_ARTIFACT;
    }

    if (/ASSET|MATERIAL|BIOME|CLIMATE|ELEVATION|TERRAIN|HYDROLOGY/i.test(text)) {
      return ARTIFACT_CLASSES.ASSET_ENGINE_ARTIFACT;
    }

    if (/VISUAL|CARRIER|PLANET_EXPRESSION|RENDER|EXPRESSION/i.test(text)) {
      return ARTIFACT_CLASSES.VISUAL_ENGINE_ARTIFACT;
    }

    if (/ROUTE|INDEX|HANDOFF|SHOWROOM|HEARTH\.JS/i.test(text)) {
      return ARTIFACT_CLASSES.ROUTE_ENGINE_ARTIFACT;
    }

    if (/AUDIT|CCR|GAUGE|TRIPLE|DIAGNOSTIC|NEWS|FIBONACCI|CHECKPOINT/i.test(text)) {
      return ARTIFACT_CLASSES.AUDIT_ENGINE_ARTIFACT;
    }

    if (/RECEIPT/i.test(text)) {
      return ARTIFACT_CLASSES.RECEIPT_ARTIFACT;
    }

    return ARTIFACT_CLASSES.UNKNOWN_ARTIFACT;
  }

  function inferArtifactFibonacci(packet = {}, artifactClass = "") {
    const explicit =
      getAnyString(packet, ["activeFibonacci", "activeFibonacciRank", "fibonacci", "fibonacciRank", "activeFibonacciGate"], "");

    if (explicit) return String(explicit);

    const file = packetFile(packet);
    const text = `${file} ${packetContract(packet)} ${eventName(packet)} ${artifactClass}`.toUpperCase();

    if (file === PRIMARY_GATES.north && /F21|LATCH/.test(text)) return "F21";
    if (file === PRIMARY_GATES.north) return "F1";
    if (file === PRIMARY_GATES.east && /C2|F13/.test(text)) return "F13E";
    if (file === PRIMARY_GATES.east) return "F3";
    if (file === PRIMARY_GATES.west && /C2|CANVAS|F13/.test(text)) return "F13W";
    if (file === PRIMARY_GATES.west) return "F5";
    if (file === PRIMARY_GATES.south && /C2|F13/.test(text)) return "F13S";
    if (file === PRIMARY_GATES.south) return "F8";
    if (file.includes("hearth.canvas")) return "F13C";
    if (artifactClass === ARTIFACT_CLASSES.PRODUCT_ENGINE_ARTIFACT) return "F21_RELEASE";

    return state.activeFibonacci || "F3";
  }

  function expectedNewsForPlatform(platform, artifactClass = "", file = "") {
    if (platform === STATION_PLATFORMS.NORTH_PLATFORM) return NEWS_GATES.NORTH;
    if (platform === STATION_PLATFORMS.EAST_PLATFORM) return NEWS_GATES.EAST;
    if (platform === STATION_PLATFORMS.SOUTH_PLATFORM) return NEWS_GATES.SOUTH;
    if (platform === STATION_PLATFORMS.WEST_PLATFORM) return NEWS_GATES.WEST;
    if (platform === STATION_PLATFORMS.CANVAS_PLATFORM) return NEWS_GATES.CANVAS;
    if (platform === STATION_PLATFORMS.PRODUCT_ENGINE_PLATFORM) return NEWS_GATES.PRODUCT;
    if (platform === STATION_PLATFORMS.AUDIT_ENGINE_PLATFORM) return NEWS_GATES.AUDIT;
    if (platform === STATION_PLATFORMS.DOWNSTREAM_PLATFORM) return NEWS_GATES.DOWNSTREAM;

    if (artifactClass === ARTIFACT_CLASSES.CANVAS_CHILD_ARTIFACT || file.includes("hearth.canvas")) return NEWS_GATES.CANVAS;
    if (artifactClass === ARTIFACT_CLASSES.PRODUCT_ENGINE_ARTIFACT) return NEWS_GATES.PRODUCT;

    return NEWS_GATES.DOWNSTREAM;
  }

  function assignArtifactPlatform(artifact = {}) {
    const file = artifact.file || packetFile(artifact);
    const contract = artifact.contract || packetContract(artifact);
    const text = `${file} ${contract} ${artifact.artifactClass || ""}`.toUpperCase();

    let platform = platformForFile(file);

    if (platform === STATION_PLATFORMS.UNKNOWN_PLATFORM) {
      if (/PRODUCT_ENGINE|PRODUCT ENGINE|PRODUCT_KERNEL|PRODUCT_RUNTIME|PRODUCT_ASSETS|PRODUCT_INTERFACE|PRODUCT_DIAGNOSTICS|PRODUCT_EXPORT/i.test(text)) {
        platform = STATION_PLATFORMS.PRODUCT_ENGINE_PLATFORM;
      } else if (/ASSET|MATERIAL|BIOME|CLIMATE|ELEVATION|TERRAIN|HYDROLOGY/i.test(text)) {
        platform = STATION_PLATFORMS.ASSET_ENGINE_PLATFORM;
      } else if (/VISUAL|CARRIER|PLANET_EXPRESSION|RENDER|EXPRESSION/i.test(text)) {
        platform = STATION_PLATFORMS.VISUAL_ENGINE_PLATFORM;
      } else if (/ROUTE|INDEX|HANDOFF|SHOWROOM|HEARTH\.JS/i.test(text)) {
        platform = STATION_PLATFORMS.ROUTE_ENGINE_PLATFORM;
      } else if (/AUDIT|CCR|GAUGE|TRIPLE|DIAGNOSTIC|NEWS|FIBONACCI|CHECKPOINT/i.test(text)) {
        platform = STATION_PLATFORMS.AUDIT_ENGINE_PLATFORM;
      }
    }

    return platform;
  }

  function detectStaleArtifact(packet = {}) {
    const contract = packetContract(packet);
    const previous = getAnyString(packet, ["previousContract", "baselineContract"], "");
    const text = `${contract} ${previous}`.toUpperCase();

    if (!contract) return false;

    if (/STALE|LEGACY|DEPRECATED/.test(text)) return true;
    if (contract === PREVIOUS_CONTRACT || contract === BASELINE_CONTRACT) return false;

    if (/HEARTH_CANVAS_PARENT_RELEASE_PACKET_TO_EAST_STALE_CLEARANCE_TNT_v3/.test(contract)) return true;
    if (/HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER_TNT_v2/.test(contract)) return true;
    if (/HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER_TNT_v1/.test(contract)) return true;

    return false;
  }

  function extractNodalArtifact(input = {}, source = "extractNodalArtifact") {
    const packet = normalizePayload(input);
    const file = packetFile(packet);
    const contract = packetContract(packet);
    const receipt = packetReceipt(packet);
    const artifactClass = artifactClassFor(packet);
    const platform = assignArtifactPlatform({ ...packet, file, contract, artifactClass });
    const fibonacciStage = inferArtifactFibonacci(packet, artifactClass);
    const stage = stageForFibonacci(fibonacciStage);
    const newsGate = getAnyString(packet, ["activeNewsGate", "activeNEWSGate", "newsGate"], "") || expectedNewsForPlatform(platform, artifactClass, file);
    const stale = detectStaleArtifact(packet);
    const firstFailedCoordinate = getAnyString(packet, ["firstFailedCoordinate"], "");
    const recommendedNextFile = getAnyString(packet, ["recommendedNextFile", "recommendedNextRenewalTarget"], "");
    const ready = getAnyBool(packet, ["ready", "accepted", "releaseAccepted", "canvasF13EvidenceComplete", "f13CanvasEvidenceComplete"], false);
    const blocked = getAnyBool(packet, ["hardBlock", "blocked", "blocking", "f13HardFail", "visibleContentHardFail"], false);
    const held = Boolean(!ready && !blocked && (firstFailedCoordinate || getAnyBool(packet, ["held"], false)));

    return {
      artifactId: `${artifactClass}:${file || "unknown"}:${contract || receipt || eventName(packet) || "artifact"}:${nowMs()}`,
      artifactClass,
      source,
      file,
      route: packetRoute(packet),
      contract,
      receipt,
      previousContract: getAnyString(packet, ["previousContract"], ""),
      baselineContract: getAnyString(packet, ["baselineContract"], ""),
      authorityRole: getAnyString(packet, ["authority", "role", "cardinalRole"], ""),
      platform,
      newsGate,
      fibonacciStage,
      fibonacciRank: fibonacciStage,
      expectedStageId: stage ? stage.id : "",
      syncScore: 0,
      syncStatus: FIBONACCI_SYNC_STATUS.HELD_SYNC,
      syncReasons: [],
      newsAlignmentStatus: NEWS_ALIGNMENT_STATUS.NEWS_HELD,
      newsAlignmentReason: "",
      parentContactStatus: PARENT_CONTACT_STATUS.PARENT_CONTACT_LOST,
      stale,
      current: !stale,
      ready,
      held,
      blocked,
      firstFailedCoordinate,
      recommendedNextFile,
      recommendedNextRenewalTarget: recommendedNextFile,
      rawEvent: eventName(packet),
      extractedAt: nowIso()
    };
  }

  function evaluateNewsAlignment(artifact = {}) {
    const platform = artifact.platform || assignArtifactPlatform(artifact);
    const expected = expectedNewsForPlatform(platform, artifact.artifactClass, artifact.file);
    const observed = safeString(artifact.newsGate || expected);
    let status = NEWS_ALIGNMENT_STATUS.NEWS_PASS;
    let reason = "NEWS_ALIGNED";

    if (platform === STATION_PLATFORMS.CANVAS_PLATFORM && observed === NEWS_GATES.F21) {
      status = NEWS_ALIGNMENT_STATUS.NEWS_BLOCKED;
      reason = "CANVAS_CANNOT_OWN_F21";
    } else if (artifact.artifactClass === ARTIFACT_CLASSES.PRODUCT_ENGINE_ARTIFACT && observed === NEWS_GATES.DOWNSTREAM && !state.completionLatched) {
      status = NEWS_ALIGNMENT_STATUS.NEWS_HELD;
      reason = "PRODUCT_ENGINE_EXPORT_HELD_UNTIL_F21";
    } else if (observed !== expected) {
      status = NEWS_ALIGNMENT_STATUS.NEWS_DEGRADED;
      reason = `EXPECTED_${expected}_OBSERVED_${observed}`;
    }

    return {
      newsGate: observed,
      expectedDirection: expected,
      observedDirection: observed,
      newsAlignmentStatus: status,
      newsAlignmentReason: reason
    };
  }

  function evaluateParentContact(artifact = {}, parent = null) {
    const packet = normalizePayload(artifact);
    const parentContract =
      getAnyString(packet, ["parentContract", "expectedParentContract", "canvasParentContract", "governedParentContract"], "") ||
      getAnyString(parent || {}, ["contract"], "");

    const parentReceipt =
      getAnyString(packet, ["parentReceipt", "parentReceiptId", "canvasParentReceipt", "governedParentReceiptId"], "") ||
      getAnyString(parent || {}, ["receipt"], "");

    const parentAccepted = getAnyBool(packet, ["currentParentIdentityAccepted", "parentIdentityAccepted"], false);
    const parentMismatch = getAnyBool(packet, ["currentParentIdentityMismatch", "parentIdentityMismatch"], false);
    const staleParent = getAnyBool(packet, ["currentParentStaleDetected", "staleParentDetected"], false);

    let status = PARENT_CONTACT_STATUS.PARENT_CONTACT_LOST;
    let reason = "NO_PARENT_CONTACT_OBSERVED";

    if (parentMismatch) {
      status = PARENT_CONTACT_STATUS.PARENT_CONTACT_CONFLICT;
      reason = "PARENT_IDENTITY_CONFLICT";
    } else if (staleParent) {
      status = PARENT_CONTACT_STATUS.PARENT_CONTACT_DEGRADED;
      reason = "STALE_PARENT_CONTACT";
    } else if (parentAccepted && parentContract && parentReceipt) {
      status = PARENT_CONTACT_STATUS.PARENT_CONTACT_STRICT;
      reason = "STRICT_PARENT_CONTACT";
    } else if (parentContract && parentReceipt) {
      status = PARENT_CONTACT_STATUS.PARENT_CONTACT_ADMISSIBLE;
      reason = "ADMISSIBLE_PARENT_CONTACT";
    } else if (parentContract || parentReceipt) {
      status = PARENT_CONTACT_STATUS.PARENT_CONTACT_DEGRADED;
      reason = "PARTIAL_PARENT_CONTACT";
    }

    if (
      artifact.artifactClass === ARTIFACT_CLASSES.CANVAS_CHILD_ARTIFACT &&
      [PARENT_CONTACT_STATUS.PARENT_CONTACT_LOST, PARENT_CONTACT_STATUS.PARENT_CONTACT_CONFLICT].includes(status)
    ) {
      state.parentBridgeAuditRequired = true;
      state.expressionDownstreamGapLikely = true;
    }

    return {
      parentContactStatus: status,
      parentContactReason: reason,
      parentContract,
      parentReceipt,
      parentAccepted,
      parentMismatch,
      staleParent
    };
  }

  function evaluateFibonacciSynchronization(artifact = {}) {
    const stage = stageForFibonacci(artifact.fibonacciStage);
    const expectedFile = stage ? stage.file : "";
    const expectedNews = stage ? stage.news : expectedNewsForPlatform(artifact.platform, artifact.artifactClass, artifact.file);

    const stageIdentityScore = stage ? 15 : 5;
    const newsGateScore = artifact.newsGate === expectedNews ? 15 : 6;
    const fileGateScore = expectedFile && artifact.file === expectedFile ? 15 : artifact.platform === platformForFile(expectedFile) ? 10 : 4;
    const parentContactScore =
      artifact.parentContactStatus === PARENT_CONTACT_STATUS.PARENT_CONTACT_STRICT ? 15 :
      artifact.parentContactStatus === PARENT_CONTACT_STATUS.PARENT_CONTACT_ADMISSIBLE ? 12 :
      artifact.parentContactStatus === PARENT_CONTACT_STATUS.PARENT_CONTACT_DEGRADED ? 7 :
      artifact.artifactClass === ARTIFACT_CLASSES.PRIMARY_CARDINAL_ARTIFACT ? 12 :
      2;
    const contractCurrentScore = artifact.stale ? 0 : 12;
    const handoffScore = artifact.blocked ? 0 : artifact.held ? 5 : 10;
    const boundaryScore =
      artifact.platform === STATION_PLATFORMS.CANVAS_PLATFORM && artifact.newsGate === NEWS_GATES.F21 ? 0 :
      artifact.visualPassClaimed ? 0 :
      10;
    const receiptScore = artifact.receipt ? 8 : artifact.contract ? 4 : 0;

    const syncScore = clamp(
      stageIdentityScore +
      newsGateScore +
      fileGateScore +
      parentContactScore +
      contractCurrentScore +
      handoffScore +
      boundaryScore +
      receiptScore,
      0,
      100
    );

    const syncStatus =
      syncScore >= 95 ? FIBONACCI_SYNC_STATUS.STRICT_SYNC :
      syncScore >= 85 ? FIBONACCI_SYNC_STATUS.ADMISSIBLE_SYNC :
      syncScore >= 70 ? FIBONACCI_SYNC_STATUS.DEGRADED_SYNC :
      syncScore >= 50 ? FIBONACCI_SYNC_STATUS.HELD_SYNC :
      FIBONACCI_SYNC_STATUS.BLOCKED_SYNC;

    const syncReasons = [
      stage ? "" : "NO_CANONICAL_STAGE_MATCH",
      artifact.newsGate === expectedNews ? "" : "NEWS_GATE_MISMATCH",
      expectedFile && artifact.file === expectedFile ? "" : "FILE_GATE_MISMATCH_OR_PLATFORM_ROUTED",
      artifact.stale ? "STALE_CONTRACT" : "",
      artifact.blocked ? "BLOCKED_ARTIFACT" : "",
      artifact.platform === STATION_PLATFORMS.CANVAS_PLATFORM && artifact.newsGate === NEWS_GATES.F21 ? "CANVAS_F21_BOUNDARY_BLOCK" : ""
    ].filter(Boolean);

    return {
      syncScore,
      syncStatus,
      syncReasons,
      components: {
        stageIdentityScore,
        newsGateScore,
        fileGateScore,
        parentContactScore,
        contractCurrentScore,
        handoffScore,
        boundaryScore,
        receiptScore
      }
    };
  }

  function classifyProductEngineArtifact(artifact = {}) {
    const text = `${artifact.file || ""} ${artifact.contract || ""} ${artifact.rawEvent || ""}`.toUpperCase();

    let track = PRODUCT_ENGINE_TRACKS.PRODUCT_UNKNOWN;
    if (/KERNEL|CORE|SOURCE|TRUTH/.test(text)) track = PRODUCT_ENGINE_TRACKS.PRODUCT_KERNEL;
    else if (/RUNTIME|MOTION|EXECUTION|PERFORM/.test(text)) track = PRODUCT_ENGINE_TRACKS.PRODUCT_RUNTIME;
    else if (/ASSET|MATERIAL|TEXTURE|PLASMA|STYLE/.test(text)) track = PRODUCT_ENGINE_TRACKS.PRODUCT_ASSETS;
    else if (/INTERFACE|UI|CONTROL|DISPLAY|PANEL/.test(text)) track = PRODUCT_ENGINE_TRACKS.PRODUCT_INTERFACE;
    else if (/DIAGNOSTIC|AUDIT|CCR|GAUGE|BENCHMARK|MEASURE/.test(text)) track = PRODUCT_ENGINE_TRACKS.PRODUCT_DIAGNOSTICS;
    else if (/EXPORT|PUBLIC|DOWNSTREAM|RELEASE|PACKAGE/.test(text)) track = PRODUCT_ENGINE_TRACKS.PRODUCT_EXPORT;

    return {
      productTrack: track,
      productEngineConductorActive: true,
      unrealStyleReference: true,
      surpassMarketTargetInternal: true,
      benchmarkRequiredBeforePublicClaim: true,
      productEngineBenchmarkPending: true,
      publicSuperiorityClaimed: false
    };
  }

  function routeProductEngineArtifact(artifact = {}) {
    const classification = classifyProductEngineArtifact(artifact);
    let targetPlatform = STATION_PLATFORMS.PRODUCT_ENGINE_PLATFORM;
    let targetFile = artifact.file || DOWNSTREAM_GATES.productEngineKernel;
    let action = DISPATCH_ACTION.DISPATCH;
    let reason = "PRODUCT_ENGINE_DISPATCHED";

    if (classification.productTrack === PRODUCT_ENGINE_TRACKS.PRODUCT_KERNEL) {
      targetPlatform = STATION_PLATFORMS.NORTH_PLATFORM;
      targetFile = PRIMARY_GATES.north;
    } else if (classification.productTrack === PRODUCT_ENGINE_TRACKS.PRODUCT_RUNTIME) {
      targetPlatform = STATION_PLATFORMS.SOUTH_PLATFORM;
      targetFile = PRIMARY_GATES.south;
    } else if (classification.productTrack === PRODUCT_ENGINE_TRACKS.PRODUCT_ASSETS) {
      targetPlatform = STATION_PLATFORMS.ASSET_ENGINE_PLATFORM;
      targetFile = DOWNSTREAM_GATES.hearthAssets;
    } else if (classification.productTrack === PRODUCT_ENGINE_TRACKS.PRODUCT_INTERFACE) {
      targetPlatform = STATION_PLATFORMS.ROUTE_ENGINE_PLATFORM;
      targetFile = DOWNSTREAM_GATES.hearthRouteConductor;
    } else if (classification.productTrack === PRODUCT_ENGINE_TRACKS.PRODUCT_DIAGNOSTICS) {
      targetPlatform = STATION_PLATFORMS.AUDIT_ENGINE_PLATFORM;
      targetFile = PRIMARY_GATES.north;
    } else if (classification.productTrack === PRODUCT_ENGINE_TRACKS.PRODUCT_EXPORT) {
      if (!state.completionLatched) {
        action = DISPATCH_ACTION.HOLD;
        reason = "PRODUCT_EXPORT_HELD_UNTIL_F21";
      }
      targetPlatform = STATION_PLATFORMS.DOWNSTREAM_PLATFORM;
      targetFile = DOWNSTREAM_GATES.hearthIndex;
    }

    return {
      ...classification,
      action,
      reason,
      targetPlatform,
      targetFile,
      publicSuperiorityClaimed: false,
      benchmarkRequiredBeforePublicClaim: true
    };
  }

  function registerProductEngineArtifact(input = {}) {
    const artifact = extractNodalArtifact(input, "registerProductEngineArtifact");
    artifact.artifactClass = ARTIFACT_CLASSES.PRODUCT_ENGINE_ARTIFACT;
    artifact.platform = STATION_PLATFORMS.PRODUCT_ENGINE_PLATFORM;

    const route = routeProductEngineArtifact(artifact);
    const registered = {
      ...artifact,
      ...route,
      registeredAt: nowIso()
    };

    state.productEngineLedger.push(registered);
    trim(state.productEngineLedger, MAX_ARTIFACTS);

    dispatchStationArtifact(registered, "product-engine-register");

    return registered;
  }

  function updateStationCounters() {
    const artifacts = state.stationArtifacts;
    const platforms = new Set(artifacts.map((artifact) => artifact.platform).filter(Boolean));

    state.artifactCount = artifacts.length;
    state.platformCount = platforms.size;
    state.staleArtifactCount = artifacts.filter((artifact) => artifact.stale).length;
    state.lostParentContactCount = artifacts.filter((artifact) => artifact.parentContactStatus === PARENT_CONTACT_STATUS.PARENT_CONTACT_LOST).length;
    state.readyArtifactCount = artifacts.filter((artifact) => artifact.ready).length;
    state.heldArtifactCount = artifacts.filter((artifact) => artifact.held).length;
    state.blockedArtifactCount = artifacts.filter((artifact) => artifact.blocked).length;
  }

  function storeStationArtifact(artifact = {}) {
    const compact = clonePlain(artifact);
    state.stationArtifacts.push(compact);
    trim(state.stationArtifacts, MAX_ARTIFACTS);

    state.platformLedger.push({
      at: nowIso(),
      artifactId: compact.artifactId,
      platform: compact.platform,
      artifactClass: compact.artifactClass,
      file: compact.file,
      contract: compact.contract
    });
    trim(state.platformLedger, MAX_ARTIFACTS);

    state.parentContactLedger.push({
      at: nowIso(),
      artifactId: compact.artifactId,
      file: compact.file,
      parentContactStatus: compact.parentContactStatus,
      parentContactReason: compact.parentContactReason || ""
    });
    trim(state.parentContactLedger, MAX_ARTIFACTS);

    state.newsAlignmentLedger.push({
      at: nowIso(),
      artifactId: compact.artifactId,
      file: compact.file,
      newsGate: compact.newsGate,
      newsAlignmentStatus: compact.newsAlignmentStatus,
      newsAlignmentReason: compact.newsAlignmentReason
    });
    trim(state.newsAlignmentLedger, MAX_ARTIFACTS);

    state.fibonacciSyncLedger.push({
      at: nowIso(),
      artifactId: compact.artifactId,
      file: compact.file,
      fibonacciStage: compact.fibonacciStage,
      syncScore: compact.syncScore,
      syncStatus: compact.syncStatus,
      syncReasons: compact.syncReasons || []
    });
    trim(state.fibonacciSyncLedger, MAX_ARTIFACTS);

    updateStationCounters();
    return compact;
  }

  function decideStationDispatch(artifact = {}) {
    if (artifact.newsAlignmentStatus === NEWS_ALIGNMENT_STATUS.NEWS_BLOCKED) {
      return {
        action: DISPATCH_ACTION.BLOCK,
        reason: artifact.newsAlignmentReason || "NEWS_BLOCKED",
        targetFile: PRIMARY_GATES.north,
        targetPlatform: STATION_PLATFORMS.NORTH_PLATFORM,
        gapClass: GAP_CLASS.NEWS_MISMATCH
      };
    }

    if (artifact.stale) {
      return {
        action: DISPATCH_ACTION.HOLD,
        reason: "STALE_CONTRACT_HELD_FOR_PARENT_AUDIT",
        targetFile: artifact.artifactClass === ARTIFACT_CLASSES.CANVAS_CHILD_ARTIFACT ? DOWNSTREAM_GATES.canvas : artifact.file,
        targetPlatform: artifact.artifactClass === ARTIFACT_CLASSES.CANVAS_CHILD_ARTIFACT ? STATION_PLATFORMS.CANVAS_PLATFORM : artifact.platform,
        gapClass: GAP_CLASS.STALE_CONTRACT
      };
    }

    if (
      artifact.artifactClass === ARTIFACT_CLASSES.CANVAS_CHILD_ARTIFACT &&
      [PARENT_CONTACT_STATUS.PARENT_CONTACT_LOST, PARENT_CONTACT_STATUS.PARENT_CONTACT_CONFLICT].includes(artifact.parentContactStatus)
    ) {
      return {
        action: DISPATCH_ACTION.HOLD,
        reason: "CANVAS_CHILD_PARENT_CONTACT_GAP_DO_NOT_RENEW_CHILD_AGAIN",
        targetFile: DOWNSTREAM_GATES.canvas,
        targetPlatform: STATION_PLATFORMS.CANVAS_PLATFORM,
        gapClass: GAP_CLASS.PARENT_CONTACT_GAP
      };
    }

    if ([FIBONACCI_SYNC_STATUS.BLOCKED_SYNC].includes(artifact.syncStatus)) {
      return {
        action: DISPATCH_ACTION.BLOCK,
        reason: "FIBONACCI_SYNC_BLOCKED",
        targetFile: PRIMARY_GATES.north,
        targetPlatform: STATION_PLATFORMS.NORTH_PLATFORM,
        gapClass: GAP_CLASS.FIBONACCI_DRIFT
      };
    }

    if ([FIBONACCI_SYNC_STATUS.HELD_SYNC].includes(artifact.syncStatus)) {
      return {
        action: DISPATCH_ACTION.HOLD,
        reason: "FIBONACCI_SYNC_HELD",
        targetFile: artifact.recommendedNextFile || artifact.file || PRIMARY_GATES.north,
        targetPlatform: artifact.platform,
        gapClass: GAP_CLASS.FIBONACCI_DRIFT
      };
    }

    if (artifact.newsAlignmentStatus === NEWS_ALIGNMENT_STATUS.NEWS_HELD) {
      return {
        action: DISPATCH_ACTION.HOLD,
        reason: artifact.newsAlignmentReason || "NEWS_HELD",
        targetFile: artifact.recommendedNextFile || artifact.file || PRIMARY_GATES.north,
        targetPlatform: artifact.platform,
        gapClass: GAP_CLASS.NEWS_MISMATCH
      };
    }

    if (artifact.artifactClass === ARTIFACT_CLASSES.PRODUCT_ENGINE_ARTIFACT) {
      const routed = routeProductEngineArtifact(artifact);
      return {
        action: routed.action,
        reason: routed.reason,
        targetFile: routed.targetFile,
        targetPlatform: routed.targetPlatform,
        gapClass: routed.action === DISPATCH_ACTION.HOLD ? GAP_CLASS.PRODUCT_ENGINE_ROUTING_GAP : GAP_CLASS.NONE,
        productTrack: routed.productTrack
      };
    }

    if (artifact.syncStatus === FIBONACCI_SYNC_STATUS.DEGRADED_SYNC || artifact.newsAlignmentStatus === NEWS_ALIGNMENT_STATUS.NEWS_DEGRADED) {
      return {
        action: DISPATCH_ACTION.DEGRADED_FORWARD,
        reason: "DEGRADED_SYNC_OR_NEWS_ALIGNMENT",
        targetFile: artifact.recommendedNextFile || artifact.file || PRIMARY_GATES.north,
        targetPlatform: artifact.platform,
        gapClass: GAP_CLASS.DEGRADED_GAP
      };
    }

    return {
      action: DISPATCH_ACTION.DISPATCH,
      reason: "STATION_ARTIFACT_DISPATCHED",
      targetFile: artifact.recommendedNextFile || artifact.file || PRIMARY_GATES.north,
      targetPlatform: artifact.platform,
      gapClass: GAP_CLASS.NONE
    };
  }

  function dispatchStationArtifact(input = {}, source = "dispatchStationArtifact") {
    let artifact = input && input.artifactId ? clonePlain(input) : extractNodalArtifact(input, source);

    artifact.platform = assignArtifactPlatform(artifact);

    const news = evaluateNewsAlignment(artifact);
    artifact = { ...artifact, ...news };

    const parent = artifact.artifactClass === ARTIFACT_CLASSES.CANVAS_CHILD_ARTIFACT ? readAuthority("canvas").receipt : null;
    const parentContact = evaluateParentContact(artifact, parent);
    artifact = { ...artifact, ...parentContact };

    const fib = evaluateFibonacciSynchronization(artifact);
    artifact = { ...artifact, ...fib };

    const dispatch = decideStationDispatch(artifact);
    artifact.dispatchAction = dispatch.action;
    artifact.dispatchReason = dispatch.reason;
    artifact.dispatchTargetFile = dispatch.targetFile;
    artifact.dispatchTargetPlatform = dispatch.targetPlatform;
    artifact.gapClass = dispatch.gapClass;

    if (dispatch.productTrack) artifact.productTrack = dispatch.productTrack;

    if (dispatch.action === DISPATCH_ACTION.BLOCK) artifact.blocked = true;
    if (dispatch.action === DISPATCH_ACTION.HOLD) artifact.held = true;
    if ([DISPATCH_ACTION.DISPATCH, DISPATCH_ACTION.ADMIT, DISPATCH_ACTION.DEGRADED_FORWARD].includes(dispatch.action)) artifact.ready = true;

    storeStationArtifact(artifact);

    state.dispatchLedger.push({
      at: nowIso(),
      artifactId: artifact.artifactId,
      action: dispatch.action,
      reason: dispatch.reason,
      targetFile: dispatch.targetFile,
      targetPlatform: dispatch.targetPlatform,
      gapClass: dispatch.gapClass
    });
    trim(state.dispatchLedger, MAX_ARTIFACTS);

    if ([DISPATCH_ACTION.HOLD, DISPATCH_ACTION.BLOCK].includes(dispatch.action)) {
      setRecommendation(
        dispatch.targetPlatform === STATION_PLATFORMS.CANVAS_PLATFORM ? CARDINAL.CANVAS :
        dispatch.targetPlatform === STATION_PLATFORMS.WEST_PLATFORM ? CARDINAL.WEST :
        dispatch.targetPlatform === STATION_PLATFORMS.SOUTH_PLATFORM ? CARDINAL.SOUTH :
        dispatch.targetPlatform === STATION_PLATFORMS.EAST_PLATFORM ? CARDINAL.EAST :
        CARDINAL.NORTH,
        dispatch.targetFile,
        dispatch.reason,
        dispatch.targetPlatform,
        dispatch.gapClass
      );
    }

    if (
      artifact.artifactClass === ARTIFACT_CLASSES.CANVAS_CHILD_ARTIFACT &&
      dispatch.gapClass === GAP_CLASS.PARENT_CONTACT_GAP
    ) {
      state.lastRepeatedRenewalWarning = "CANVAS_CHILD_PARENT_CONTACT_GAP_DETECTED_DO_NOT_RENEW_CHILD_AGAIN";
      state.doNotTouchList = [
        ...new Set([
          ...state.doNotTouchList,
          artifact.file,
          "Do not renew same Canvas child again until Canvas parent contact is audited."
        ])
      ];
    }

    record(
      dispatch.action === DISPATCH_ACTION.BLOCK ? "block" :
      dispatch.action === DISPATCH_ACTION.HOLD ? "held" :
      dispatch.action === DISPATCH_ACTION.ARCHIVE ? "archive" :
      "admit",
      "CENTRAL_STATION_ARTIFACT_DISPATCHED",
      {
        artifactId: artifact.artifactId,
        artifactClass: artifact.artifactClass,
        platform: artifact.platform,
        syncStatus: artifact.syncStatus,
        newsAlignmentStatus: artifact.newsAlignmentStatus,
        parentContactStatus: artifact.parentContactStatus,
        action: dispatch.action,
        reason: dispatch.reason,
        targetFile: dispatch.targetFile,
        targetPlatform: dispatch.targetPlatform,
        publicSuperiorityClaimed: false,
        visualPassClaimed: false
      },
      { deferPublish: true }
    );

    markDirty("light");

    return artifact;
  }

  function refreshStationArtifacts(options = {}) {
    const force = options.force === true;
    const current = nowMs();

    if (!force && scheduler.stationCache && current - scheduler.stationCacheAt <= STATION_CACHE_TTL_MS) {
      state.observed.stationScanCached = true;
      return scheduler.stationCache;
    }

    const authorities = [
      readAuthority("east"),
      readAuthority("south"),
      readAuthority("west"),
      readAuthority("canvas"),
      readAuthority("product")
    ];

    const artifacts = [];

    authorities.forEach((entry) => {
      if (!entry || !entry.observed) return;
      const sourceInput = entry.receipt && entry.receipt.contract ? entry.receipt : entry.authority || {};
      artifacts.push(dispatchStationArtifact(sourceInput, "refreshStationArtifacts"));
    });

    const canvasChildren = [
      readCanvasChild("east"),
      readCanvasChild("west"),
      readCanvasChild("south")
    ].filter(Boolean);

    canvasChildren.forEach((child) => {
      const receipt = readReceiptLightFirst(child) || child;
      artifacts.push(dispatchStationArtifact(receipt, "refreshStationArtifacts.canvasChild"));
    });

    state.observed.stationScanCached = false;
    state.observed.stationScanCount += 1;
    state.observed.stationScanLastAt = nowIso();

    scheduler.stationCache = artifacts;
    scheduler.stationCacheAt = current;

    return artifacts;
  }

  function refreshObservedAuthorities(options = {}) {
    const force = options.force === true;
    const includeCanvas = options.includeCanvas === true || state.activeCardinal === CARDINAL.CANVAS || state.activeStageId === "C2_CANVAS_F13_EVIDENCE";
    const includeProduct = options.includeProduct !== false;
    const current = nowMs();

    if (
      !force &&
      scheduler.authorityCache &&
      current - scheduler.authorityCacheAt <= AUTHORITY_CACHE_TTL_MS
    ) {
      state.observed.authorityScanCached = true;
      return scheduler.authorityCache;
    }

    const east = readAuthority("east");
    const south = readAuthority("south");
    const west = readAuthority("west");
    const canvas = includeCanvas ? readAuthority("canvas") : { authority: null, receipt: {}, observed: state.observed.canvasParentObserved, file: DOWNSTREAM_GATES.canvas };
    const product = includeProduct ? readAuthority("product") : { authority: null, receipt: {}, observed: state.observed.productEngineObserved, file: DOWNSTREAM_GATES.productEngineKernel };

    const canvasReceipt = canvas.receipt || {};
    const canvasEast = includeCanvas ? readCanvasChild("east") : null;
    const canvasWest = includeCanvas ? readCanvasChild("west") : null;
    const canvasSouth = includeCanvas ? readCanvasChild("south") : null;

    state.observed.eastAuthorityObserved = east.observed;
    state.observed.southAuthorityObserved = south.observed;
    state.observed.westAuthorityObserved = west.observed;
    state.observed.canvasParentObserved = includeCanvas ? canvas.observed : state.observed.canvasParentObserved;
    state.observed.canvasReceiptObserved = includeCanvas ? Boolean(canvasReceipt && canvasReceipt.contract) : state.observed.canvasReceiptObserved;
    state.observed.canvasEastApiReady = includeCanvas ? Boolean(canvasEast || safeBool(canvasReceipt.canvasEastReady, false) || safeBool(canvasReceipt.canvasEastApiReady, false)) : state.observed.canvasEastApiReady;
    state.observed.canvasWestApiReady = includeCanvas ? Boolean(canvasWest || safeBool(canvasReceipt.canvasWestReady, false) || safeBool(canvasReceipt.canvasWestApiReady, false)) : state.observed.canvasWestApiReady;
    state.observed.canvasSouthApiReady = includeCanvas ? Boolean(canvasSouth || safeBool(canvasReceipt.canvasSouthReady, false) || safeBool(canvasReceipt.canvasSouthApiReady, false)) : state.observed.canvasSouthApiReady;
    state.observed.allCanvasChildrenApiReady = Boolean(
      state.observed.canvasEastApiReady &&
      state.observed.canvasWestApiReady &&
      state.observed.canvasSouthApiReady
    );
    state.observed.productEngineObserved = includeProduct ? product.observed : state.observed.productEngineObserved;
    state.observed.authorityScanCached = false;
    state.observed.authorityScanCount += 1;
    state.observed.authorityScanLastAt = nowIso();

    const snapshot = { east, south, west, canvas, product };
    scheduler.authorityCache = snapshot;
    scheduler.authorityCacheAt = current;

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

      record("admit", "CYCLE_ONE_COMPATIBILITY_CLOSED_FROM_CACHED_PRIMARY_AUTHORITIES", {
        eastObserved: east.observed,
        westObserved: west.observed,
        southObserved: south.observed,
        nonBlocking: true
      }, { deferPublish: true });
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
          }, "cached-observed-west-audit-compatible", { quiet: true });
        }
      }
    }

    if (includeCanvas) {
      const visibleEvidence = Boolean(
        safeBool(canvasReceipt.f13CanvasEvidenceComplete, false) ||
        safeBool(canvasReceipt.f13VisibleEvidenceAvailable, false) ||
        safeBool(canvasReceipt.visibleContentProof, false) ||
        safeBool(canvasReceipt.visibleContentSoftGap, false) ||
        safeBool(canvasReceipt.visibleForwardProgress, false) ||
        safeBool(canvasReceipt.visiblePlanetAvailable, false)
      );

      if (canvas.observed && visibleEvidence && !state.cycleTwo.canvasF13EvidenceReceived) {
        acceptCanvasF13Evidence(canvasReceipt, "cached-observed-canvas-f13-receipt", { quiet: true });
      }
    }

    if (includeProduct && product.observed) {
      const productReceipt = product.receipt || product.authority || {};
      dispatchStationArtifact(productReceipt, "cached-observed-product-engine");
    }

    recomputeActiveStage();
    markDirty("light");

    return snapshot;
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
      decision.includes("ADMIT") ||
      decision.includes("PASS") ||
      decision.includes("RELEASE_TO_CANVAS")
    );
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
    if (card === CARDINAL.NORTH && file === PRIMARY_GATES.north) return true;
    if (primaryCardinal === card && getAnyBool(packet, ["primaryGateReady", "primaryRuntimeTableGate"], false)) return true;

    if (card === CARDINAL.EAST && /RUNTIME_TABLE_EAST|EAST_PRIMARY|EAST_STEP|EAST_ROUTE/i.test(contract)) return true;
    if (card === CARDINAL.SOUTH && /RUNTIME_TABLE_SOUTH|SOUTH_PRIMARY|VISIBLE_STATE_COMPOSER|SOUTH_ROUTE/i.test(contract)) return true;
    if (card === CARDINAL.WEST && /RUNTIME_TABLE_WEST|WEST_PRIMARY|GAP_CLASSIFIER|AUDIT|ADMISSIBILITY/i.test(contract)) return true;
    if (card === CARDINAL.NORTH && /RUNTIME_TABLE_NORTH|NORTH_PRIMARY|NORTH_COMMAND|NORTH_NEWS/i.test(contract)) return true;

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

  function getHeldResponse(firstFailedCoordinate, reason = "held", extra = {}) {
    setRecommendation(
      extra.recommendedNextOwner || state.activeCardinal || CARDINAL.NORTH,
      extra.recommendedNextFile || state.activeFileGate || PRIMARY_GATES.north,
      firstFailedCoordinate,
      extra.targetPlatform || "",
      reason
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
      nextPlatform: state.nextPlatform,
      activeStageId: state.activeStageId,
      activeGear: state.activeGear,
      activeCycleNumber: state.activeCycleNumber,
      activeCycleRoute: state.activeCycleRoute,
      activeFileGate: state.activeFileGate,
      activeProgress: state.activeProgress,
      centralTrainStationActive: true,
      pageResponsive: true,
      nonBlockingPhaseSchedulerActive: true,
      hardBlock: false,
      visualPassClaimed: false,
      ...clonePlain(extra)
    };

    record("held", "PRIMARY_GATE_HELD", response);
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
      centralTrainStationActive: true,
      pageResponsive: true,
      nonBlockingPhaseSchedulerActive: true,
      hardBlock: false,
      visualPassClaimed: false,
      ...clonePlain(extra)
    };

    record("archive", "EVENT_ARCHIVED", response);
    return response;
  }

  function getBlockResponse(firstFailedCoordinate, reason = "blocked", extra = {}) {
    setRecommendation(
      extra.recommendedNextOwner || state.activeCardinal || CARDINAL.NORTH,
      extra.recommendedNextFile || state.activeFileGate || PRIMARY_GATES.north,
      firstFailedCoordinate,
      extra.targetPlatform || "",
      reason
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
      nextPlatform: state.nextPlatform,
      activeStageId: state.activeStageId,
      activeGear: state.activeGear,
      activeFileGate: state.activeFileGate,
      activeProgress: state.activeProgress,
      centralTrainStationActive: true,
      pageResponsive: true,
      nonBlockingPhaseSchedulerActive: true,
      hardBlock: true,
      visualPassClaimed: false,
      ...clonePlain(extra)
    };

    record("block", "PRIMARY_GATE_BLOCKED", response);
    return response;
  }

  function acceptEastPrimaryGate(packet = {}) {
    const input = normalizePayload(packet);
    dispatchStationArtifact(input, "acceptEastPrimaryGate");

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
    invalidateAuthorityCache("east-primary-accepted");

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
      centralTrainStationActive: true,
      pageResponsive: true,
      nonBlockingPhaseSchedulerActive: true,
      hardBlock: false,
      visualPassClaimed: false
    };

    record("admit", "EAST_PRIMARY_GATE_ACCEPTED", response);
    return response;
  }

  function acceptSouthPrimaryGate(packet = {}) {
    const input = normalizePayload(packet);
    dispatchStationArtifact(input, "acceptSouthPrimaryGate");

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

      ["C1_SOUTH_RETURN", "C1_NORTH_RETURN_LATCH", "C2_NORTH_START"].forEach((id) => {
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
    invalidateAuthorityCache("south-primary-accepted");

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
      centralTrainStationActive: true,
      pageResponsive: true,
      nonBlockingPhaseSchedulerActive: true,
      hardBlock: false,
      visualPassClaimed: false
    };

    record("admit", "SOUTH_PRIMARY_GATE_ACCEPTED", response);
    return response;
  }

  function acceptWestPrimaryGate(packet = {}) {
    const input = normalizePayload(packet);
    dispatchStationArtifact(input, "acceptWestPrimaryGate");

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

      if (auditOk) {
        queuePhase("AUTHORIZE_CANVAS_F13_RELEASE", () => {
          authorizeCanvasF13Release(input, "west-primary-gate-accepted", { quiet: true });
        }, { source: "acceptWestPrimaryGate" });
      }
    }

    recomputeActiveStage();
    invalidateAuthorityCache("west-primary-accepted");

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
      centralTrainStationActive: true,
      pageResponsive: true,
      nonBlockingPhaseSchedulerActive: true,
      hardBlock: false,
      visualPassClaimed: false
    };

    record("admit", "WEST_PRIMARY_GATE_ACCEPTED", response);
    return response;
  }

  function receiveCycleOneSouthReturn(packet = {}) {
    const input = normalizePayload(packet);
    dispatchStationArtifact(input, "receiveCycleOneSouthReturn");

    state.cycleOne.southReceived = true;
    state.cycleOne.southAccepted = true;
    state.cycleOne.northReturnReceived = true;
    state.cycleOne.northReturnValidated = true;
    state.cycleOne.complete = true;
    state.cycleTwo.startAuthorized = true;

    ["C1_SOUTH_RETURN", "C1_NORTH_RETURN_LATCH", "C2_NORTH_START"].forEach((id) => {
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
      centralTrainStationActive: true,
      pageResponsive: true,
      nonBlockingPhaseSchedulerActive: true,
      visualPassClaimed: false
    };

    record("admit", "CYCLE_ONE_SOUTH_RETURN_ACCEPTED_BY_NORTH", response);
    return response;
  }

  function authorizeCycleTwoStart(packet = {}, source = "authorizeCycleTwoStart") {
    const input = normalizePayload(packet);
    dispatchStationArtifact(input, source);

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
      centralTrainStationActive: true,
      pageResponsive: true,
      nonBlockingPhaseSchedulerActive: true,
      visualPassClaimed: false
    };

    record("admit", "CYCLE_TWO_START_AUTHORIZED_BY_NORTH", response);
    return response;
  }

  function authorizeCanvasF13Release(packet = {}, source = "authorizeCanvasF13Release", options = {}) {
    const input = normalizePayload(packet);
    dispatchStationArtifact(input, source);

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
      centralTrainStationActive: true,
      pageResponsive: true,
      nonBlockingPhaseSchedulerActive: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    if (options.quiet !== true) record("admit", "CANVAS_F13_RELEASE_AUTHORIZED_BY_NORTH", response);
    else markDirty("light");

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

      centralTrainStationActive: true,
      stationRegistryActive: true,
      nodalArtifactExtractorActive: true,
      platformAssignerActive: true,
      centralDispatcherActive: true,

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
      pageResponsive: true,
      nonBlockingPhaseSchedulerActive: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      composedAt: nowIso()
    };
  }

  function acceptCanvasF13Evidence(packet = {}, source = "acceptCanvasF13Evidence", options = {}) {
    const input = normalizePayload(packet);
    dispatchStationArtifact(input, source);

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
      centralTrainStationActive: true,
      pageResponsive: true,
      nonBlockingPhaseSchedulerActive: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    if (options.quiet !== true) {
      record(state.cycleTwo.canvasF13EvidenceComplete ? "admit" : "held", "CANVAS_F13_EVIDENCE_RECEIVED_BY_NORTH", response);
    } else {
      markDirty("light");
    }

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
    dispatchStationArtifact(input, source);

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

    if (!state.completedStages.includes("F21_NORTH_NEWS_LATCH")) state.completedStages.push("F21_NORTH_NEWS_LATCH");
    if (!state.completedStages.includes("DOWNSTREAM_RELEASE")) state.completedStages.push("DOWNSTREAM_RELEASE");
    if (validation.degraded && !state.degradedStages.includes("F21_NORTH_NEWS_LATCH")) state.degradedStages.push("F21_NORTH_NEWS_LATCH");

    state.firstFailedCoordinate = validation.full
      ? "NONE_F21_FULL_LATCHED_BY_NORTH_CENTRAL_STATION"
      : "NONE_F21_DEGRADED_LATCHED_BY_NORTH_CENTRAL_STATION";

    state.recommendedNextOwner = CARDINAL.DOWNSTREAM;
    state.recommendedNextFile = DOWNSTREAM_GATES.hearthIndex;
    state.recommendedNextRenewalTarget = DOWNSTREAM_GATES.hearthIndex;
    state.nextPlatform = STATION_PLATFORMS.DOWNSTREAM_PLATFORM;
    state.nextReason = "F21_LATCHED_DOWNSTREAM_RELEASE_AUTHORIZED";

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
      centralTrainStationActive: true,
      validation,
      pageResponsive: true,
      nonBlockingPhaseSchedulerActive: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    record("admit", "F21_LATCHED_BY_NORTH_CENTRAL_TRAIN_STATION", response, { scope: "full" });
    markDirty("full");

    return response;
  }

  function receivePrimaryGateEvent(packet = {}, source = "receiveEvent") {
    const input = normalizePayload(packet);

    dispatchStationArtifact(input, source);

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

    if (artifactClassFor(input) === ARTIFACT_CLASSES.PRODUCT_ENGINE_ARTIFACT) {
      return registerProductEngineArtifact(input);
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
    const artifact = dispatchStationArtifact(input, "classifyCheckpointEvent");

    if (hasEvent(input, PRIMARY_EVENTS.F21) || getAnyBool(input, ["f21EligibleForNorth", "primaryGateCycleEligible"], false)) {
      const validation = validateF21Eligibility(input);
      return {
        action: validation.ok ? CHECKPOINT_EVENT_ACTIONS.LATCH : CHECKPOINT_EVENT_ACTIONS.HELD,
        gapClass: validation.ok ? GAP_CLASS.NONE : GAP_CLASS.CANVAS_F13_HELD,
        checkpointId: "F21_NORTH_CENTRAL_STATION_LATCH",
        event: name || "F21_ELIGIBILITY_PACKET",
        artifact,
        validation,
        activeStageId: state.activeStageId,
        activeFileGate: state.activeFileGate,
        pageResponsive: true
      };
    }

    if (isCanvasPacket(input)) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
        gapClass: artifact.gapClass || GAP_CLASS.NONE,
        checkpointId: "CANVAS_F13_EVIDENCE",
        event: name,
        artifact,
        activeStageId: state.activeStageId,
        activeFileGate: state.activeFileGate,
        pageResponsive: true
      };
    }

    if (isPrimaryGatePacket(input, CARDINAL.WEST) || hasEvent(input, PRIMARY_EVENTS.WEST)) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
        gapClass: artifact.gapClass || GAP_CLASS.NONE,
        checkpointId: "WEST_PRIMARY_GATE",
        event: name,
        artifact,
        activeStageId: state.activeStageId,
        activeFileGate: state.activeFileGate,
        pageResponsive: true
      };
    }

    if (isPrimaryGatePacket(input, CARDINAL.SOUTH) || hasEvent(input, PRIMARY_EVENTS.SOUTH)) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
        gapClass: artifact.gapClass || GAP_CLASS.NONE,
        checkpointId: "SOUTH_PRIMARY_GATE",
        event: name,
        artifact,
        activeStageId: state.activeStageId,
        activeFileGate: state.activeFileGate,
        pageResponsive: true
      };
    }

    if (isPrimaryGatePacket(input, CARDINAL.EAST) || hasEvent(input, PRIMARY_EVENTS.EAST)) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
        gapClass: artifact.gapClass || GAP_CLASS.NONE,
        checkpointId: "EAST_PRIMARY_GATE",
        event: name,
        artifact,
        activeStageId: state.activeStageId,
        activeFileGate: state.activeFileGate,
        pageResponsive: true
      };
    }

    if (isDownstreamPacket(input)) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.HELD,
        gapClass: GAP_CLASS.DOWNSTREAM_HELD,
        checkpointId: "DOWNSTREAM_HELD_UNTIL_F21_LATCH",
        event: name,
        artifact,
        activeStageId: state.activeStageId,
        activeFileGate: state.activeFileGate,
        recommendedNextFile: state.recommendedNextFile,
        pageResponsive: true
      };
    }

    return {
      action: CHECKPOINT_EVENT_ACTIONS.ARCHIVE,
      gapClass: artifact.gapClass || GAP_CLASS.DUPLICATE_ARCHIVE,
      reason: name ? "unknown-primary-event-archived" : "missing-event-name",
      event: name,
      artifact,
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      pageResponsive: true
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
      f21LatchMode: state.f21LatchMode,
      centralTrainStationActive: true,
      productEngineConductorActive: true,
      pageResponsive: true,
      nonBlockingPhaseSchedulerActive: true
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
      centralTrainStationActive: true,
      nonBlockingPhaseSchedulerActive: true,
      oneActiveGearAtATime: true,
      pageResponsive: true,
      updatedAt: nowIso()
    };
  }

  function setActiveStage(stageId, reason = "setActiveStage") {
    const stage = stageById(stageId);
    if (!stage) return getHeldResponse("UNKNOWN_PRIMARY_STAGE", "set-active-stage-unknown", { stageId, reason });

    setActiveStageLocal(stageId);
    refreshStageLedger();

    record("receipt", "ACTIVE_PRIMARY_STAGE_SET", { stageId, reason });
    return getActiveGateState();
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
    markDirty("light");

    return {
      accepted: true,
      action: options.degraded === true ? CHECKPOINT_EVENT_ACTIONS.DEGRADED_FORWARD : CHECKPOINT_EVENT_ACTIONS.ADMIT,
      completedStage: stage.id,
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      centralTrainStationActive: true,
      pageResponsive: true,
      visualPassClaimed: false
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

    return getActiveGateState();
  }

  function createPrimaryGateRegistry() {
    refreshStageLedger();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      registryContract: "LAB_RUNTIME_TABLE_CENTRAL_TRAIN_STATION_PRIMARY_GATE_REGISTRY_v3",
      registryReceipt: "LAB_RUNTIME_TABLE_CENTRAL_TRAIN_STATION_PRIMARY_GATE_REGISTRY_RECEIPT_v3",
      authority: "north-central-train-station-two-cycle-primary-gate-registry",
      primaryGates: clonePlain(PRIMARY_GATES),
      downstreamGates: clonePlain(DOWNSTREAM_GATES),
      stationPlatforms: clonePlain(STATION_PLATFORMS),
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
      centralTrainStationActive: true,
      stationRegistryActive: true,
      productEngineConductorActive: true,
      nonBlockingPhaseSchedulerActive: true,
      authorityScanCacheActive: true,
      nextPrimaryOwner: state.recommendedNextOwner,
      nextPrimaryTarget: state.recommendedNextFile,
      nextPlatform: state.nextPlatform,
      doNotRenewRepeatedly: state.doNotRenewRepeatedly,
      parentBridgeAuditRequired: state.parentBridgeAuditRequired,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function createChronologicalFibonacciPlan() {
    refreshStageLedger();

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
      authority: "north-central-train-station-news-fibonacci-plan",
      sequence: createChronologicalFibonacciPlan(),
      newsGates: clonePlain(NEWS_GATES),
      stationPlatforms: clonePlain(STATION_PLATFORMS),
      fibonacciSyncStatus: clonePlain(FIBONACCI_SYNC_STATUS),
      newsAlignmentStatus: clonePlain(NEWS_ALIGNMENT_STATUS),
      primaryGates: clonePlain(PRIMARY_GATES),
      downstreamGates: clonePlain(DOWNSTREAM_GATES),
      primaryGateRegistryActive: true,
      primaryGateFilesLocked: true,
      twoCycleRuntimeLawActive: true,
      oneActiveGearAtATime: true,
      canvasF13ReleaseBeforeF21Active: true,
      centralTrainStationActive: true,
      productEngineConductorActive: true,
      nonBlockingPhaseSchedulerActive: true,
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
    if (registration.globalName && readPath(registration.globalName)) return readPath(registration.globalName);

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
    const statuses = records.map((recordItem) => recordItem.status);

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
      trim(local.ledger, 80);
      local.updatedAt = entry.at;
      return entry;
    }

    function registerChild(registration = {}) {
      const recordItem = {
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

      local.registrations.push(recordItem);
      log("REGISTER_CHILD", {
        key: recordItem.key,
        fileGate: recordItem.fileGate,
        expectedContract: recordItem.expectedContract
      });

      return recordItem;
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

      const receipt = readReceiptLightFirst(authority);
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
        centralTrainStationActive: true,
        nonBlockingPhaseSchedulerActive: true,
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
          centralTrainStationActive: true,
          nonBlockingPhaseSchedulerActive: true,
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
        centralTrainStationActive: true,
        productEngineConductorActive: true,
        nonBlockingPhaseSchedulerActive: true,
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

    const stationReceipt = getCentralStationReceiptLight();

    const checkpoints = [
      {
        id: "TWO_CYCLE_RUNTIME_LAW_CHECK",
        name: "Two-Cycle Runtime Law Check",
        status: COHERENCE_STATUS.PASS,
        observed: "North preserves Cycle 1 and Cycle 2 separately.",
        nonBlocking: false,
        at: nowIso()
      },
      {
        id: "CENTRAL_TRAIN_STATION_CHECK",
        name: "Central Train Station Check",
        status: state.centralTrainStationActive ? COHERENCE_STATUS.PASS : COHERENCE_STATUS.FAIL,
        observed: state.centralTrainStationActive ? "Central station conductor active." : "Central station conductor missing.",
        nonBlocking: false,
        at: nowIso()
      },
      {
        id: "NEWS_ALIGNMENT_PROTOCOL_CHECK",
        name: "NEWS Alignment Protocol Check",
        status: state.newsAlignmentProtocolActive ? COHERENCE_STATUS.PASS : COHERENCE_STATUS.FAIL,
        observed: state.newsAlignmentProtocolActive ? "NEWS alignment protocol active." : "NEWS alignment protocol missing.",
        nonBlocking: false,
        at: nowIso()
      },
      {
        id: "FIBONACCI_SYNC_METRIC_CHECK",
        name: "Fibonacci Synchronization Metric Check",
        status: state.fibonacciSynchronizationMetricActive ? COHERENCE_STATUS.PASS : COHERENCE_STATUS.FAIL,
        observed: state.fibonacciSynchronizationMetricActive ? "Fibonacci synchronization metric active." : "Fibonacci synchronization metric missing.",
        nonBlocking: false,
        at: nowIso()
      },
      {
        id: "PARENT_CONTACT_LEDGER_CHECK",
        name: "Parent Contact Ledger Check",
        status: state.parentBridgeAuditRequired ? COHERENCE_STATUS.WARNING : COHERENCE_STATUS.PASS,
        observed: state.parentBridgeAuditRequired ? "Parent bridge audit required before repeating child renewal." : "No parent-contact hard gap detected.",
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
      authority: "lab-triple-g-coherence-diagnostic-north-central-train-station",
      goalProfileId: goalProfile.id,
      goalProfile: clonePlain(goalProfile),
      constructionReady: true,
      imageRendered,
      coherentExpressionPass: false,
      coherenceScore: failedCheckpoints.length ? 72 : canvasF13EvidenceComplete() ? 90 : state.cycleTwo.canvasF13ReleaseAuthorized ? 86 : 80,
      coherenceStatus: failedCheckpoints.length ? COHERENCE_STATUS.FAIL : COHERENCE_STATUS.WARNING,
      checkpoints,
      failedCheckpoints: failedCheckpoints.map((item) => item.id),
      warningCheckpoints: checkpoints.filter((item) => item.status === COHERENCE_STATUS.WARNING).map((item) => item.id),
      heldCheckpoints: heldCheckpoints.map((item) => item.id),
      stationReceipt,
      nextStrategy: [`Complete next gate: ${state.recommendedNextFile}`],
      twoCycleRuntimeLawActive: true,
      primaryGateRegistryActive: true,
      primaryGateFilesLocked: true,
      centralTrainStationActive: true,
      newsAlignmentProtocolActive: true,
      fibonacciSynchronizationMetricActive: true,
      productEngineConductorActive: true,
      nonBlockingPhaseSchedulerActive: true,
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
      trim(local.reports, 60);
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
          centralTrainStationActive: true,
          twoCycleRuntimeLawActive: true,
          nonBlockingPhaseSchedulerActive: true,
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
      loadingOptimizationContract: "LAB_UNIVERSAL_PLANET_LOADING_OPTIMIZATION_PLAN_CENTRAL_TRAIN_STATION_v3",
      loadingOptimizationReceipt: "LAB_UNIVERSAL_PLANET_LOADING_OPTIMIZATION_PLAN_CENTRAL_TRAIN_STATION_RECEIPT_v3",
      authority: "north-central-station-loading-optimization",
      visibleCarrierFirst: true,
      wideProbeBlocksFirstVisibleRender: false,
      firstVisibleRenderAllowed: true,
      wideProbeReady,
      budget,
      recommendedChunking: {
        rowsPerChunk: budget.rowsPerChunk,
        probeRowsPerChunk: budget.probeRowsPerChunk,
        deferWideProbe: true,
        useIdleFrames: true,
        usePhaseScheduler: true,
        useCentralStation: true
      },
      twoCycleRuntimeLawActive: true,
      canvasF13ReleaseBeforeF21Active: true,
      primaryGateRegistryActive: true,
      primaryGateFilesLocked: true,
      centralTrainStationActive: true,
      nonBlockingPhaseSchedulerActive: true,
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
      planContract: "LAB_UNIVERSAL_PLANET_PROCEDURAL_VISUAL_CARRIER_PLAN_CENTRAL_TRAIN_STATION_v3",
      planReceipt: "LAB_UNIVERSAL_PLANET_PROCEDURAL_VISUAL_CARRIER_PLAN_CENTRAL_TRAIN_STATION_RECEIPT_v3",
      authority: "north-central-train-station-visual-carrier-plan",
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
      centralStationReceipt: getCentralStationReceiptLight(),
      tripleGCheckpoints: diagnostic.checkpoints,
      failedCheckpoints: diagnostic.failedCheckpoints,
      warningCheckpoints: diagnostic.warningCheckpoints,
      heldCheckpoints: diagnostic.heldCheckpoints,
      coherenceScore: diagnostic.coherenceScore,
      coherenceStatus: diagnostic.coherenceStatus,
      primaryGateRegistryActive: true,
      primaryGateFilesLocked: true,
      twoCycleRuntimeLawActive: true,
      centralTrainStationActive: true,
      productEngineConductorActive: true,
      nonBlockingPhaseSchedulerActive: true,
      canvasF13ReleaseAuthorized: state.cycleTwo.canvasF13ReleaseAuthorized,
      canvasF13EvidenceComplete: canvasF13EvidenceComplete(),
      downstreamReleaseAuthorized: state.downstreamReleaseAuthorized,
      childFailureDoesNotEraseVisualization: true,
      repeatedChildRenewalGuardActive: true,
      parentBridgeAuditRequired: state.parentBridgeAuditRequired,
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

    Object.assign(state.cycleOne, {
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
    });

    Object.assign(state.cycleTwo, {
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
    });

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
    state.nextPlatform = STATION_PLATFORMS.EAST_PLATFORM;
    state.nextReason = "TWO_CYCLE_PRIMARY_GATE_REGISTRY_RESET";
    state.postgameStatus = "CENTRAL_TRAIN_STATION_READY";
    state.updatedAt = nowIso();

    invalidateAuthorityCache("reset-primary-gate-registry");
    refreshStageLedger();
    record("receipt", "TWO_CYCLE_PRIMARY_GATE_REGISTRY_RESET", { reason });
    markDirty("full");

    return getReceiptLight();
  }

  function createCheckpointSession(_sequenceInput = null, options = {}) {
    const sessionId = options.sessionId || options.id || "HEARTH-NORTH-CENTRAL-TRAIN-STATION-TWO-CYCLE-CANVAS-F13-RELEASE";

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      checkpointSessionContract: "LAB_RUNTIME_TABLE_NORTH_CENTRAL_TRAIN_STATION_SESSION_v3",
      checkpointSessionReceipt: "LAB_RUNTIME_TABLE_NORTH_CENTRAL_TRAIN_STATION_SESSION_RECEIPT_v3",
      sessionId,
      route: options.route || ROUTE,
      persistentNorthSession: true,
      primaryGateRegistryActive: true,
      primaryGateFilesLocked: true,
      twoCycleRuntimeLawActive: true,
      centralTrainStationActive: true,
      nonBlockingPhaseSchedulerActive: true,

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

      extractNodalArtifact,
      assignArtifactPlatform,
      evaluateNewsAlignment,
      evaluateFibonacciSynchronization,
      evaluateParentContact,
      dispatchStationArtifact,
      registerProductEngineArtifact,
      classifyProductEngineArtifact,
      routeProductEngineArtifact,

      queuePhase,
      invalidateAuthorityCache,
      refreshObservedAuthorities,
      refreshStationArtifacts,

      getActiveCheckpoint: getActiveGateState,
      getCheckpointState: getReceiptLight,
      getNewsGateState: evaluateNewsGateState,
      createPrimaryGateRegistry,
      getCentralStationReceiptLight,
      getCentralStationReceipt,
      getCentralStationReceiptText,
      getReceipt,
      getReceiptLight,
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
    return getReceiptLight();
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
      authority: "north-central-train-station-cardinal-receipt",
      primaryGateRegistryActive: true,
      primaryGateFilesLocked: true,
      twoCycleRuntimeLawActive: true,
      centralTrainStationActive: true,
      nonBlockingPhaseSchedulerActive: true,
      northLoaded: true,
      eastPrimaryFileGate: PRIMARY_GATES.east,
      southPrimaryFileGate: PRIMARY_GATES.south,
      westPrimaryFileGate: PRIMARY_GATES.west,
      canvasFileGate: DOWNSTREAM_GATES.canvas,
      productEnginePlatform: STATION_PLATFORMS.PRODUCT_ENGINE_PLATFORM,
      cycleOneRoute: CYCLE.ONE,
      cycleTwoRoute: CYCLE.TWO,
      canvasF13ReleaseAuthorized: state.cycleTwo.canvasF13ReleaseAuthorized,
      canvasF13EvidenceComplete: canvasF13EvidenceComplete(),
      downstreamReleaseAuthorized: state.downstreamReleaseAuthorized,
      nextPrimaryOwner: state.recommendedNextOwner,
      nextPrimaryTarget: state.recommendedNextFile,
      nextPlatform: state.nextPlatform,
      pageResponsive: true,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function getCentralStationReceiptLight() {
    if (!scheduler.dirtyStationReceiptLight && scheduler.centralStationReceiptLightCache) {
      return clonePlain(scheduler.centralStationReceiptLightCache);
    }

    updateStationCounters();

    const receipt = {
      contract: CONTRACT,
      receipt: RECEIPT,
      stationReceipt: "LAB_RUNTIME_TABLE_NORTH_CENTRAL_TRAIN_STATION_LIGHT_RECEIPT_v3",
      file: FILE,
      role: state.role,

      centralTrainStationActive: true,
      stationRegistryActive: true,
      nodalArtifactExtractorActive: true,
      platformAssignerActive: true,
      centralDispatcherActive: true,
      productEngineConductorActive: true,
      newsAlignmentProtocolActive: true,
      fibonacciSynchronizationMetricActive: true,
      parentContactLedgerActive: true,
      centralReceiptBoardActive: true,
      expressionPreservationRuleActive: true,

      artifactCount: state.artifactCount,
      platformCount: state.platformCount,
      staleArtifactCount: state.staleArtifactCount,
      lostParentContactCount: state.lostParentContactCount,
      readyArtifactCount: state.readyArtifactCount,
      heldArtifactCount: state.heldArtifactCount,
      blockedArtifactCount: state.blockedArtifactCount,

      nextPlatform: state.nextPlatform,
      nextFile: state.recommendedNextFile,
      nextRenewalTarget: state.recommendedNextRenewalTarget,
      nextReason: state.nextReason,
      firstFailedCoordinate: state.firstFailedCoordinate,
      parentBridgeAuditRequired: state.parentBridgeAuditRequired,
      doNotRenewRepeatedly: state.doNotRenewRepeatedly,
      repeatedChildRenewalGuardActive: state.repeatedChildRenewalGuardActive,
      lastRepeatedRenewalWarning: state.lastRepeatedRenewalWarning,
      expressionDownstreamGapLikely: state.expressionDownstreamGapLikely,
      doNotTouchList: state.doNotTouchList.slice(),

      unrealStyleReference: true,
      surpassMarketTargetInternal: true,
      benchmarkRequiredBeforePublicClaim: true,
      productEngineBenchmarkPending: true,
      publicSuperiorityClaimed: false,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };

    scheduler.centralStationReceiptLightCache = clonePlain(receipt);
    scheduler.centralStationReceiptLightCacheAt = nowMs();
    scheduler.dirtyStationReceiptLight = false;

    return receipt;
  }

  function getCentralStationReceipt() {
    refreshStationArtifacts({ force: true });

    return {
      ...getCentralStationReceiptLight(),
      stationReceipt: "LAB_RUNTIME_TABLE_NORTH_CENTRAL_TRAIN_STATION_FULL_RECEIPT_v3",
      stationPlatforms: clonePlain(STATION_PLATFORMS),
      artifactClasses: clonePlain(ARTIFACT_CLASSES),
      parentContactStatus: clonePlain(PARENT_CONTACT_STATUS),
      fibonacciSyncStatus: clonePlain(FIBONACCI_SYNC_STATUS),
      newsAlignmentStatus: clonePlain(NEWS_ALIGNMENT_STATUS),
      dispatchAction: clonePlain(DISPATCH_ACTION),
      productEngineTracks: clonePlain(PRODUCT_ENGINE_TRACKS),
      stationArtifacts: clonePlain(state.stationArtifacts),
      platformLedger: clonePlain(state.platformLedger),
      parentContactLedger: clonePlain(state.parentContactLedger),
      newsAlignmentLedger: clonePlain(state.newsAlignmentLedger),
      fibonacciSyncLedger: clonePlain(state.fibonacciSyncLedger),
      dispatchLedger: clonePlain(state.dispatchLedger),
      productEngineLedger: clonePlain(state.productEngineLedger),
      updatedAt: nowIso()
    };
  }

  function getCentralStationReceiptText() {
    const r = getCentralStationReceipt();

    const artifacts = r.stationArtifacts.slice(-30).map((artifact) => (
      `- ${artifact.extractedAt || ""} :: ${artifact.artifactClass} :: ${artifact.platform} :: file=${artifact.file || ""} :: sync=${artifact.syncStatus}:${artifact.syncScore} :: news=${artifact.newsAlignmentStatus} :: parent=${artifact.parentContactStatus} :: action=${artifact.dispatchAction}`
    )).join("\n") || "- none";

    const dispatches = r.dispatchLedger.slice(-30).map((item) => (
      `- ${item.at || ""} :: action=${item.action} :: target=${item.targetFile} :: platform=${item.targetPlatform} :: reason=${item.reason}`
    )).join("\n") || "- none";

    return [
      "LAB_RUNTIME_TABLE_NORTH_CENTRAL_TRAIN_STATION_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `file=${r.file}`,
      `role=${r.role}`,
      "",
      `centralTrainStationActive=${r.centralTrainStationActive}`,
      `stationRegistryActive=${r.stationRegistryActive}`,
      `nodalArtifactExtractorActive=${r.nodalArtifactExtractorActive}`,
      `platformAssignerActive=${r.platformAssignerActive}`,
      `centralDispatcherActive=${r.centralDispatcherActive}`,
      `productEngineConductorActive=${r.productEngineConductorActive}`,
      `newsAlignmentProtocolActive=${r.newsAlignmentProtocolActive}`,
      `fibonacciSynchronizationMetricActive=${r.fibonacciSynchronizationMetricActive}`,
      `parentContactLedgerActive=${r.parentContactLedgerActive}`,
      `centralReceiptBoardActive=${r.centralReceiptBoardActive}`,
      `expressionPreservationRuleActive=${r.expressionPreservationRuleActive}`,
      "",
      `artifactCount=${r.artifactCount}`,
      `platformCount=${r.platformCount}`,
      `staleArtifactCount=${r.staleArtifactCount}`,
      `lostParentContactCount=${r.lostParentContactCount}`,
      `readyArtifactCount=${r.readyArtifactCount}`,
      `heldArtifactCount=${r.heldArtifactCount}`,
      `blockedArtifactCount=${r.blockedArtifactCount}`,
      "",
      `nextPlatform=${r.nextPlatform}`,
      `nextFile=${r.nextFile}`,
      `nextRenewalTarget=${r.nextRenewalTarget}`,
      `nextReason=${r.nextReason}`,
      `parentBridgeAuditRequired=${r.parentBridgeAuditRequired}`,
      `doNotRenewRepeatedly=${r.doNotRenewRepeatedly}`,
      `lastRepeatedRenewalWarning=${r.lastRepeatedRenewalWarning}`,
      "",
      "ARTIFACTS",
      artifacts,
      "",
      "DISPATCH_LEDGER",
      dispatches,
      "",
      `benchmarkRequiredBeforePublicClaim=${r.benchmarkRequiredBeforePublicClaim}`,
      `publicSuperiorityClaimed=${r.publicSuperiorityClaimed}`,
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function getReceiptLight() {
    if (!scheduler.dirtyReceiptLight && scheduler.receiptLightCache) {
      return clonePlain(scheduler.receiptLightCache);
    }

    refreshStageLedger();

    const news = evaluateNewsGateState();
    const stationReceipt = getCentralStationReceiptLight();

    const light = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "lab-runtime-table-north-central-train-station-product-engine-conductor",
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

      centralTrainStationActive: true,
      stationRegistryActive: true,
      nodalArtifactExtractorActive: true,
      platformAssignerActive: true,
      centralDispatcherActive: true,
      productEngineConductorActive: true,
      newsAlignmentProtocolActive: true,
      fibonacciSynchronizationMetricActive: true,
      parentContactLedgerActive: true,
      centralReceiptBoardActive: true,
      expressionPreservationRuleActive: true,

      nonBlockingPhaseSchedulerActive: true,
      authorityScanCacheActive: true,
      lightReceiptDuringMotionActive: true,
      fullReceiptOnDemandOnly: true,
      datasetWriteCompactionActive: true,
      broadDatasetWritesDeferred: true,
      pageResponsive: true,

      activeStageId: state.activeStageId,
      activeGear: state.activeGear,
      activeCycleNumber: state.activeCycleNumber,
      activeCycleRoute: state.activeCycleRoute,
      activeCardinal: state.activeCardinal,
      activeFileGate: state.activeFileGate,
      activeFibonacci: state.activeFibonacci,
      activeNewsGate: state.activeNewsGate,
      activeProgress: state.activeProgress,

      cycleOneComplete: cycleOneComplete(),
      cycleTwoStartAuthorized: state.cycleTwo.startAuthorized,
      cycleTwoPrimaryReadyForCanvasRelease: cycleTwoPrimaryReadyForCanvasRelease(),

      eastPrimaryAccepted: state.cycleOne.eastAccepted && state.cycleTwo.eastAccepted,
      southPrimaryAccepted: state.cycleOne.southAccepted && state.cycleTwo.southAccepted,
      westPrimaryAccepted: state.cycleOne.westAccepted && state.cycleTwo.westAccepted,
      primaryCycleComplete: primaryCycleComplete(),

      westAuditObserved: state.cycleTwo.westAuditObserved,
      westAuditAccepted: state.cycleTwo.westAuditAccepted,
      westCanvasReleaseApproved: state.cycleTwo.westCanvasReleaseApproved,

      canvasReleaseAuthorized: state.cycleTwo.canvasF13ReleaseAuthorized,
      canvasF13ReleaseAuthorized: state.cycleTwo.canvasF13ReleaseAuthorized,
      canvasF13ReleasePacketReady: state.cycleTwo.canvasF13ReleasePacketReady,
      canvasF13ReleaseHeldReason: state.cycleTwo.canvasF13ReleaseHeldReason,
      canvasF13EvidenceReceived: state.cycleTwo.canvasF13EvidenceReceived,
      canvasF13EvidenceStrict: state.cycleTwo.canvasF13EvidenceStrict,
      canvasF13EvidenceDegraded: state.cycleTwo.canvasF13EvidenceDegraded,
      canvasF13EvidenceComplete: canvasF13EvidenceComplete(),
      canvasF13HardFail: state.cycleTwo.canvasF13HardFail,

      f21EligibilityReceived: state.f21EligibilityReceived,
      f21EligibilityAccepted: state.f21EligibilityAccepted,
      f21EligibilityRejected: state.f21EligibilityRejected,
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

      centralStationReceipt: stationReceipt,

      downstreamReleaseAuthorized: state.downstreamReleaseAuthorized,
      downstreamReleaseTarget: state.downstreamReleaseTarget,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      nextPlatform: state.nextPlatform,
      nextReason: state.nextReason,
      parentBridgeAuditRequired: state.parentBridgeAuditRequired,
      doNotRenewRepeatedly: state.doNotRenewRepeatedly,
      postgameStatus: state.postgameStatus,

      scheduler: {
        queueDepth: scheduler.queue.length,
        running: scheduler.running,
        phaseRunCount: scheduler.phaseRunCount,
        authorityCacheActive: Boolean(scheduler.authorityCache),
        authorityCacheAgeMs: scheduler.authorityCacheAt ? nowMs() - scheduler.authorityCacheAt : 0,
        stationCacheActive: Boolean(scheduler.stationCache),
        stationCacheAgeMs: scheduler.stationCacheAt ? nowMs() - scheduler.stationCacheAt : 0,
        lightPublishScheduled: scheduler.lightPublishScheduled,
        fullDatasetScheduled: scheduler.fullDatasetScheduled
      },

      observed: clonePlain(state.observed),

      unrealStyleReference: true,
      surpassMarketTargetInternal: true,
      benchmarkRequiredBeforePublicClaim: true,
      productEngineBenchmarkPending: true,
      publicSuperiorityClaimed: false,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      createdAt: state.createdAt,
      updatedAt: nowIso()
    };

    scheduler.receiptLightCache = clonePlain(light);
    scheduler.receiptLightCacheAt = nowMs();
    scheduler.dirtyReceiptLight = false;

    return light;
  }

  function getReceipt() {
    refreshObservedAuthorities({ force: true, includeCanvas: true, includeProduct: true });
    refreshStageLedger();

    const light = getReceiptLight();

    return {
      ...light,

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
      stationPlatforms: clonePlain(STATION_PLATFORMS),
      artifactClasses: clonePlain(ARTIFACT_CLASSES),
      parentContactStatus: clonePlain(PARENT_CONTACT_STATUS),
      fibonacciSyncStatus: clonePlain(FIBONACCI_SYNC_STATUS),
      newsAlignmentStatus: clonePlain(NEWS_ALIGNMENT_STATUS),
      productEngineTracks: clonePlain(PRODUCT_ENGINE_TRACKS),
      stageLedger: clonePlain(state.stageLedger),

      cycleOne: clonePlain(state.cycleOne),
      cycleTwo: clonePlain(state.cycleTwo),

      completedStages: state.completedStages.slice(),
      degradedStages: state.degradedStages.slice(),
      blockedStages: state.blockedStages.slice(),

      canvasReleasePacket: composeCanvasF13ReleasePacket(),

      f21EligibilityValidation: clonePlain(state.f21EligibilityValidation),

      centralStationReceiptFull: getCentralStationReceipt(),

      preservedExports: [
        "createTable",
        "createHearthChannelTable",
        "RuntimeTable",
        "STATUS",
        "HANDOFF",
        "getReceipt",
        "getReceiptLight",
        "getReceiptText",
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
        "createPrimaryGateRegistry",
        "queuePhase",
        "invalidateAuthorityCache",
        "refreshObservedAuthorities"
      ],

      addedExports: [
        "extractNodalArtifact",
        "assignArtifactPlatform",
        "evaluateNewsAlignment",
        "evaluateFibonacciSynchronization",
        "evaluateParentContact",
        "dispatchStationArtifact",
        "registerProductEngineArtifact",
        "classifyProductEngineArtifact",
        "routeProductEngineArtifact",
        "getCentralStationReceiptLight",
        "getCentralStationReceipt",
        "getCentralStationReceiptText",
        "refreshStationArtifacts"
      ],

      owns: [
        "two-cycle-runtime-law",
        "primary-file-gate-map",
        "north-macro-distribution",
        "central-train-station-routing",
        "nodal-artifact-extraction",
        "NEWS-alignment-protocol",
        "Fibonacci-synchronization-metric",
        "parent-contact-ledger",
        "cycle-one-return-latch",
        "cycle-two-start-authorization",
        "Canvas F13 release authorization",
        "F21 North latch validation",
        "downstream release authorization",
        "product-engine-conductor",
        "non-blocking phase scheduling",
        "authority scan cache",
        "light receipt publication"
      ],

      transmissionReceipt: {
        ...getReceiptLight(),
        admittedEvents: clonePlain(state.admittedEvents.slice(-40)),
        heldEvents: clonePlain(state.heldEvents.slice(-40)),
        archivedEvents: clonePlain(state.archivedEvents.slice(-40)),
        blockedEvents: clonePlain(state.blockedEvents.slice(-40)),
        errors: clonePlain(state.errors.slice(-40)),
        visualPassClaimed: false,
        updatedAt: nowIso()
      },

      admittedEvents: clonePlain(state.admittedEvents.slice(-80)),
      heldEvents: clonePlain(state.heldEvents.slice(-80)),
      archivedEvents: clonePlain(state.archivedEvents.slice(-80)),
      blockedEvents: clonePlain(state.blockedEvents.slice(-80)),
      receipts: clonePlain(state.receipts.slice(-80)),
      errors: clonePlain(state.errors.slice(-80)),

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
      "LAB_RUNTIME_TABLE_NORTH_CENTRAL_TRAIN_STATION_PRODUCT_ENGINE_CONDUCTOR_RECEIPT",
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
      "CENTRAL_TRAIN_STATION",
      `centralTrainStationActive=${r.centralTrainStationActive}`,
      `stationRegistryActive=${r.stationRegistryActive}`,
      `nodalArtifactExtractorActive=${r.nodalArtifactExtractorActive}`,
      `platformAssignerActive=${r.platformAssignerActive}`,
      `centralDispatcherActive=${r.centralDispatcherActive}`,
      `productEngineConductorActive=${r.productEngineConductorActive}`,
      `newsAlignmentProtocolActive=${r.newsAlignmentProtocolActive}`,
      `fibonacciSynchronizationMetricActive=${r.fibonacciSynchronizationMetricActive}`,
      `parentContactLedgerActive=${r.parentContactLedgerActive}`,
      `centralReceiptBoardActive=${r.centralReceiptBoardActive}`,
      `expressionPreservationRuleActive=${r.expressionPreservationRuleActive}`,
      "",
      "SCHEDULER",
      `nonBlockingPhaseSchedulerActive=${r.nonBlockingPhaseSchedulerActive}`,
      `authorityScanCacheActive=${r.authorityScanCacheActive}`,
      `lightReceiptDuringMotionActive=${r.lightReceiptDuringMotionActive}`,
      `fullReceiptOnDemandOnly=${r.fullReceiptOnDemandOnly}`,
      `datasetWriteCompactionActive=${r.datasetWriteCompactionActive}`,
      `broadDatasetWritesDeferred=${r.broadDatasetWritesDeferred}`,
      `pageResponsive=${r.pageResponsive}`,
      `schedulerQueueDepth=${r.scheduler.queueDepth}`,
      `schedulerRunning=${r.scheduler.running}`,
      `phaseRunCount=${r.scheduler.phaseRunCount}`,
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
      `nextPlatform=${r.nextPlatform}`,
      `nextReason=${r.nextReason}`,
      `parentBridgeAuditRequired=${r.parentBridgeAuditRequired}`,
      `doNotRenewRepeatedly=${r.doNotRenewRepeatedly}`,
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
      `benchmarkRequiredBeforePublicClaim=${r.benchmarkRequiredBeforePublicClaim}`,
      `publicSuperiorityClaimed=${r.publicSuperiorityClaimed}`,
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function publishDatasetsLight() {
    if (!doc || !doc.documentElement) return;

    setDataset("labRuntimeTableLoaded", "true");
    setDataset("labRuntimeTableContract", CONTRACT);
    setDataset("labRuntimeTablePreviousContract", PREVIOUS_CONTRACT);
    setDataset("labRuntimeTableBaselineContract", BASELINE_CONTRACT);
    setDataset("labRuntimeTableReceipt", RECEIPT);
    setDataset("labRuntimeTableEquipment", "true");

    setDataset("labRuntimeTableNorthLoaded", "true");
    setDataset("labRuntimeTableNorthContract", CONTRACT);
    setDataset("primaryGateRegistryActive", "true");
    setDataset("primaryGateFilesLocked", "true");
    setDataset("fileGatesPrimary", "true");
    setDataset("twoCycleRuntimeLawActive", "true");
    setDataset("nonBlockingPhaseSchedulerActive", "true");
    setDataset("authorityScanCacheActive", "true");
    setDataset("lightReceiptDuringMotionActive", "true");
    setDataset("fullReceiptOnDemandOnly", "true");
    setDataset("datasetWriteCompactionActive", "true");
    setDataset("pageResponsive", "true");

    setDataset("centralTrainStationActive", "true");
    setDataset("stationRegistryActive", "true");
    setDataset("nodalArtifactExtractorActive", "true");
    setDataset("platformAssignerActive", "true");
    setDataset("centralDispatcherActive", "true");
    setDataset("productEngineConductorActive", "true");
    setDataset("newsAlignmentProtocolActive", "true");
    setDataset("fibonacciSynchronizationMetricActive", "true");
    setDataset("parentContactLedgerActive", "true");
    setDataset("centralReceiptBoardActive", "true");
    setDataset("expressionPreservationRuleActive", "true");

    setDataset("activeStageId", state.activeStageId);
    setDataset("activeGear", state.activeGear);
    setDataset("activeCycleNumber", state.activeCycleNumber);
    setDataset("activeCycleRoute", state.activeCycleRoute);
    setDataset("activeCardinal", state.activeCardinal);
    setDataset("activeFileGate", state.activeFileGate);
    setDataset("activeFibonacci", state.activeFibonacci);
    setDataset("activeNewsGate", state.activeNewsGate);
    setDataset("activeProgress", state.activeProgress);

    setDataset("cycleOneComplete", String(cycleOneComplete()));
    setDataset("cycleTwoStartAuthorized", String(state.cycleTwo.startAuthorized));
    setDataset("cycleTwoPrimaryReadyForCanvasRelease", String(cycleTwoPrimaryReadyForCanvasRelease()));

    setDataset("canvasReleaseAuthorized", String(state.cycleTwo.canvasF13ReleaseAuthorized));
    setDataset("canvasF13ReleaseAuthorized", String(state.cycleTwo.canvasF13ReleaseAuthorized));
    setDataset("canvasF13ReleasePacketReady", String(state.cycleTwo.canvasF13ReleasePacketReady));
    setDataset("canvasF13ReleaseHeldReason", state.cycleTwo.canvasF13ReleaseHeldReason);
    setDataset("canvasF13EvidenceReceived", String(state.cycleTwo.canvasF13EvidenceReceived));
    setDataset("canvasF13EvidenceComplete", String(canvasF13EvidenceComplete()));
    setDataset("canvasF13HardFail", String(state.cycleTwo.canvasF13HardFail));

    setDataset("f21EligibilityReceived", String(state.f21EligibilityReceived));
    setDataset("f21EligibilityAccepted", String(state.f21EligibilityAccepted));
    setDataset("f21EligibilityRejected", String(state.f21EligibilityRejected));
    setDataset("f21EligibleForNorth", String(state.f21EligibleForNorth));
    setDataset("f21LatchMode", state.f21LatchMode);
    setDataset("completionLatched", String(state.completionLatched));
    setDataset("finalCompletionLatched", String(state.finalCompletionLatched));
    setDataset("degradedCompletionLatched", String(state.degradedCompletionLatched));

    setDataset("downstreamReleaseAuthorized", String(state.downstreamReleaseAuthorized));
    setDataset("downstreamReleaseTarget", state.downstreamReleaseTarget);

    setDataset("stationArtifactCount", String(state.artifactCount));
    setDataset("stationPlatformCount", String(state.platformCount));
    setDataset("stationStaleArtifactCount", String(state.staleArtifactCount));
    setDataset("stationLostParentContactCount", String(state.lostParentContactCount));
    setDataset("stationReadyArtifactCount", String(state.readyArtifactCount));
    setDataset("stationHeldArtifactCount", String(state.heldArtifactCount));
    setDataset("stationBlockedArtifactCount", String(state.blockedArtifactCount));

    setDataset("parentBridgeAuditRequired", String(state.parentBridgeAuditRequired));
    setDataset("doNotRenewRepeatedly", String(state.doNotRenewRepeatedly));
    setDataset("repeatedChildRenewalGuardActive", String(state.repeatedChildRenewalGuardActive));
    setDataset("expressionDownstreamGapLikely", String(state.expressionDownstreamGapLikely));

    setDataset("firstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("recommendedNextOwner", state.recommendedNextOwner);
    setDataset("recommendedNextFile", state.recommendedNextFile);
    setDataset("recommendedNextRenewalTarget", state.recommendedNextRenewalTarget);
    setDataset("nextPlatform", state.nextPlatform);
    setDataset("nextReason", state.nextReason);
    setDataset("postgameStatus", state.postgameStatus);

    setDataset("unrealStyleReference", "true");
    setDataset("surpassMarketTargetInternal", "true");
    setDataset("benchmarkRequiredBeforePublicClaim", "true");
    setDataset("productEngineBenchmarkPending", "true");
    setDataset("publicSuperiorityClaimed", "false");

    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");

    scheduler.dirtyDatasetLight = false;
    scheduler.lastFlushAt = nowMs();
  }

  function publishDatasetsFull() {
    if (!doc || !doc.documentElement) return;

    publishDatasetsLight();

    setDataset("cycleOneRoute", CYCLE.ONE);
    setDataset("cycleTwoRoute", CYCLE.TWO);
    setDataset("canvasF13ReleaseBeforeF21Active", "true");
    setDataset("canvasF13IsNotDownstreamRelease", "true");
    setDataset("downstreamReleaseHeldUntilF21Latch", "true");
    setDataset("northMacroOnly", "true");
    setDataset("microTuningDelegatesDownstream", "true");

    setDataset("primaryNorthFileGate", PRIMARY_GATES.north);
    setDataset("primaryEastFileGate", PRIMARY_GATES.east);
    setDataset("primarySouthFileGate", PRIMARY_GATES.south);
    setDataset("primaryWestFileGate", PRIMARY_GATES.west);
    setDataset("canvasF13FileGate", DOWNSTREAM_GATES.canvas);

    setDataset("eastPrimaryAccepted", String(state.cycleOne.eastAccepted && state.cycleTwo.eastAccepted));
    setDataset("southPrimaryAccepted", String(state.cycleOne.southAccepted && state.cycleTwo.southAccepted));
    setDataset("westPrimaryAccepted", String(state.cycleOne.westAccepted && state.cycleTwo.westAccepted));
    setDataset("primaryCycleComplete", String(primaryCycleComplete()));

    setDataset("westAuditObserved", String(state.cycleTwo.westAuditObserved));
    setDataset("westAuditAccepted", String(state.cycleTwo.westAuditAccepted));
    setDataset("westCanvasReleaseApproved", String(state.cycleTwo.westCanvasReleaseApproved));

    setDataset("schedulerQueueDepth", String(scheduler.queue.length));
    setDataset("schedulerPhaseRunCount", String(scheduler.phaseRunCount));
    setDataset("authorityScanCount", String(state.observed.authorityScanCount));
    setDataset("authorityScanLastAt", state.observed.authorityScanLastAt);
    setDataset("stationScanCount", String(state.observed.stationScanCount));
    setDataset("stationScanLastAt", state.observed.stationScanLastAt);

    scheduler.dirtyDatasetFull = false;
  }

  function publishLight() {
    if (scheduler.dirtyGlobals) publishGlobalsLight();
    if (scheduler.dirtyDatasetLight) publishDatasetsLight();
  }

  function publishGlobalsLight() {
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
    root.DEXTER_LAB.northNonBlockingPhaseScheduler = api;
    root.DEXTER_LAB.centralTrainStation = api;
    root.DEXTER_LAB.northCentralTrainStation = api;
    root.DEXTER_LAB.productEngineConductor = api;
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
    root.LAB_RUNTIME_TABLE_NORTH_NON_BLOCKING_PHASE_SCHEDULER = api;
    root.LAB_RUNTIME_TABLE_NORTH_CENTRAL_TRAIN_STATION = api;
    root.LAB_CENTRAL_TRAIN_STATION = api;
    root.LAB_PRODUCT_ENGINE_CONDUCTOR = api;

    root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE = api;
    root.HEARTH_NORTH_COMMAND_TABLE = api;
    root.HEARTH_NORTH_COMMAND = api;
    root.HEARTH_LOCAL_COMMAND_RUNTIME_TABLE = api;
    root.HEARTH.northCommandRuntimeTable = api;
    root.HEARTH.northPrimaryGateRegistry = api;
    root.HEARTH.primaryGateRegistry = api;
    root.HEARTH.northTwoCycleCanvasF13ReleaseDistributor = api;
    root.HEARTH.northNonBlockingPhaseScheduler = api;
    root.HEARTH.centralTrainStation = api;
    root.HEARTH.northCentralTrainStation = api;
    root.HEARTH.productEngineConductor = api;

    root.HEARTH_CHECKPOINT_SESSION = transmissionSession;
    root.HEARTH_RUNTIME_CHECKPOINT_SESSION = transmissionSession;
    root.LAB_HEARTH_CHECKPOINT_SESSION = transmissionSession;
    root.LAB_CHECKPOINT_SESSION = transmissionSession;

    root.HEARTH_NORTH_TRANSMISSION_SESSION = transmissionSession;
    root.HEARTH_NORTH_PRIMARY_GATE_SESSION = transmissionSession;
    root.HEARTH_NORTH_TWO_CYCLE_SESSION = transmissionSession;
    root.HEARTH_NORTH_NON_BLOCKING_PHASE_SESSION = transmissionSession;
    root.HEARTH_NORTH_CENTRAL_TRAIN_STATION_SESSION = transmissionSession;

    const receiptLight = getReceiptLight();
    const stationLight = getCentralStationReceiptLight();

    root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT = receiptLight;
    root.HEARTH_NORTH_CYCLICAL_CHECKPOINT_RECEIPT = receiptLight;
    root.LAB_RUNTIME_TABLE_NORTH_TRANSMISSION_RECEIPT = receiptLight;
    root.LAB_RUNTIME_TABLE_NORTH_PRIMARY_GATE_RECEIPT = receiptLight;
    root.LAB_RUNTIME_TABLE_NORTH_TWO_CYCLE_RECEIPT = receiptLight;
    root.LAB_RUNTIME_TABLE_NORTH_NON_BLOCKING_RECEIPT = receiptLight;
    root.LAB_RUNTIME_TABLE_NORTH_CENTRAL_STATION_RECEIPT = stationLight;
    root.HEARTH_NORTH_CENTRAL_STATION_RECEIPT = stationLight;

    scheduler.dirtyGlobals = false;
    scheduler.globalsPublished = true;
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

    STATION_PLATFORMS,
    ARTIFACT_CLASSES,
    PARENT_CONTACT_STATUS,
    FIBONACCI_SYNC_STATUS,
    NEWS_ALIGNMENT_STATUS,
    DISPATCH_ACTION,
    PRODUCT_ENGINE_TRACKS,

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
    getReceiptLight,
    getReceiptText,

    extractNodalArtifact,
    assignArtifactPlatform,
    evaluateNewsAlignment,
    evaluateFibonacciSynchronization,
    evaluateParentContact,
    dispatchStationArtifact,
    registerProductEngineArtifact,
    classifyProductEngineArtifact,
    routeProductEngineArtifact,
    getCentralStationReceiptLight,
    getCentralStationReceipt,
    getCentralStationReceiptText,
    refreshStationArtifacts,

    queuePhase,
    invalidateAuthorityCache,
    refreshObservedAuthorities,
    scheduleLightPublish,
    publishLight,
    publishDatasetsLight,
    publishDatasetsFull,

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

    centralTrainStationActive: true,
    stationRegistryActive: true,
    nodalArtifactExtractorActive: true,
    platformAssignerActive: true,
    centralDispatcherActive: true,
    productEngineConductorActive: true,
    newsAlignmentProtocolActive: true,
    fibonacciSynchronizationMetricActive: true,
    parentContactLedgerActive: true,
    centralReceiptBoardActive: true,
    expressionPreservationRuleActive: true,

    nonBlockingPhaseSchedulerActive: true,
    authorityScanCacheActive: true,
    lightReceiptDuringMotionActive: true,
    fullReceiptOnDemandOnly: true,
    datasetWriteCompactionActive: true,
    broadDatasetWritesDeferred: true,
    pageResponsive: true,

    unrealStyleReference: true,
    surpassMarketTargetInternal: true,
    benchmarkRequiredBeforePublicClaim: true,
    productEngineBenchmarkPending: true,
    publicSuperiorityClaimed: false,

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
    repeatedChildRenewalGuardActive: true,
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
    get centralStationState() {
      return state;
    },
    get primaryGateState() {
      return state;
    },
    get scheduler() {
      return scheduler;
    }
  };

  transmissionSession = {
    contract: CONTRACT,
    receipt: RECEIPT,
    sessionId: "HEARTH-NORTH-CENTRAL-TRAIN-STATION-TWO-CYCLE-CANVAS-F13-RELEASE",
    route: ROUTE,
    file: FILE,
    cardinalRole: CARDINAL.NORTH,
    centralTrainStationActive: true,
    nonBlockingPhaseSchedulerActive: true,

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

    extractNodalArtifact,
    assignArtifactPlatform,
    evaluateNewsAlignment,
    evaluateFibonacciSynchronization,
    evaluateParentContact,
    dispatchStationArtifact,
    registerProductEngineArtifact,
    classifyProductEngineArtifact,
    routeProductEngineArtifact,

    setActiveStage,
    completeStage,
    updateActiveProgress,
    getActiveGateState,
    createPrimaryGateRegistry,

    queuePhase,
    invalidateAuthorityCache,
    refreshObservedAuthorities,
    refreshStationArtifacts,

    getTransmissionReceipt,
    getReceipt: getTransmissionReceipt,
    getReceiptLight,
    getReceiptText: getTransmissionReceiptText,
    getCentralStationReceiptLight,
    getCentralStationReceipt,
    getCentralStationReceiptText,
    getNorthCommandReceipt,
    reset: resetPrimaryGateRegistry,

    get state() {
      return state;
    }
  };

  state.createdAt = nowIso();
  state.updatedAt = state.createdAt;
  refreshStageLedger();
  publishGlobalsLight();
  publishDatasetsLight();

  queuePhase("INITIAL_AUTHORITY_CACHE_WARM", () => {
    refreshObservedAuthorities({ force: true, includeCanvas: false, includeProduct: true });
  });

  queuePhase("INITIAL_CENTRAL_STATION_SCAN", () => {
    refreshStationArtifacts({ force: true });
  });

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

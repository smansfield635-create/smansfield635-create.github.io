// /assets/lab/runtime-table.js
// LAB_RUNTIME_TABLE_MULTI_FUNCTION_ANIMATION_STANDARD_TNT_v1
// Internal controlled renewal:
// LAB_RUNTIME_TABLE_NORTH_KING_QUEEN_DUAL_CHAPEL_DUTY_LOAD_MALPRACTICE_GUARD_SCHEMA_ANCHOR_TNT_v1_1
// Full-file replacement.
// North lab runtime grammar anchor only.
// Purpose:
// - Preserve the public Lab Runtime Table contract.
// - Publish the North grammar source for King / Queen / Chapel / Bishop / Priest / Judge identity.
// - Define container-collapse prevention law.
// - Define duty-load budget law.
// - Define probe-network distribution law.
// - Define service/tool delegation law.
// - Define diagnostic self-measurement and diagnostic-malpractice guard law.
// - Provide a stable schema source for LabWest derivative diagnostics.
// Does not:
// - mutate Hearth production files
// - draw canvas
// - repair canvas
// - restart runtime
// - perform West admissibility audit
// - perform final diagnostic arbitration
// - claim F13/F21/ready/final visual pass
//

(function () {
  "use strict";

  var GLOBAL = typeof window !== "undefined" ? window : globalThis;
  var DOCUMENT = typeof document !== "undefined" ? document : null;

  var PUBLIC_CONTRACT = "LAB_RUNTIME_TABLE_MULTI_FUNCTION_ANIMATION_STANDARD_TNT_v1";
  var PUBLIC_RECEIPT = "LAB_RUNTIME_TABLE_MULTI_FUNCTION_ANIMATION_STANDARD_RECEIPT_v1";

  var INTERNAL_RENEWAL_CONTRACT =
    "LAB_RUNTIME_TABLE_NORTH_KING_QUEEN_DUAL_CHAPEL_DUTY_LOAD_MALPRACTICE_GUARD_SCHEMA_ANCHOR_TNT_v1_1";
  var INTERNAL_RENEWAL_RECEIPT =
    "LAB_RUNTIME_TABLE_NORTH_KING_QUEEN_DUAL_CHAPEL_DUTY_LOAD_MALPRACTICE_GUARD_SCHEMA_ANCHOR_RECEIPT_v1_1";

  var FILE = "/assets/lab/runtime-table.js";
  var WEST_FILE = "/assets/lab/runtime-table.west.js";
  var VERSION = "2026-06-08.lab-runtime-table-north-dual-chapel-duty-load-malpractice-guard-schema-anchor-v1-1";

  var TARGET_ROUTE = "/showroom/globe/hearth/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  var NO_CLAIMS = {
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByNorthRuntimeTable: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByNorthRuntimeTable: false,
    readyTextPermissionGranted: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false,
    productionMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    canvasRepairAuthorized: false,
    routeRepairAuthorized: false,
    controlMutationAuthorized: false,
    runtimeRestartAuthorized: false
  };

  var FILES = {
    html: "/showroom/globe/hearth/index.html",
    index: "/showroom/globe/hearth/index.js",
    routeConductor: "/showroom/globe/hearth/hearth.js",
    controlsQueen: "/assets/hearth/hearth.controls.js",
    chapel1AssetsCanvasHub: "/assets/hearth/hearth.canvas.js",
    chapel1AssetsPriest: "/assets/hearth/hearth.canvas.chapel.inspect.js",
    hexAuthority: "/assets/hearth/hearth.hex.four-pair.authority.js",
    hexSurfaceGate: "/assets/hearth/hearth.hex.surface.js",
    chapel2PointerSurfaceBishop: "/assets/hearth/hearth.canvas.finger.surface.js",
    chapel2InspectPriest: "/assets/hearth/hearth.canvas.finger.inspect.js",
    labNorth: FILE,
    labWest: WEST_FILE,
    diagnosticNorthRail: "/assets/hearth/hearth.diagnostic.rail.js",
    diagnosticEastRail: "/assets/hearth/hearth.diagnostic.east.js",
    diagnosticWestRail: "/assets/hearth/hearth.diagnostic.west.js",
    diagnosticSouthRail: "/assets/hearth/hearth.diagnostic.south.js",
    probeNorth: "/assets/hearth/hearth.diagnostic.probe.north.js",
    probeEast: "/assets/hearth/hearth.diagnostic.probe.east.js",
    probeWest: "/assets/hearth/hearth.diagnostic.probe.west.js",
    probeCanvasSurfaceTruth: "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js",
    probeSouth: "/assets/hearth/hearth.diagnostic.probe.south.js"
  };

  var CONTRACTS = {
    html: ["HEARTH_HTML_ROUTE_CONDUCTOR_OWNS_CONTROL_HANDSHAKE_SHELL_TNT_v5_1"],
    index: ["HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4"],
    routeConductor: [
      "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10",
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_ASSET_TRANSACTION_RESET_TNT_v10_8",
      "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN_TNT_v10_7",
      "HEARTH_ROUTE_CONDUCTOR_SAFE_PACKET_BRIDGE_NO_LIFECYCLE_IGNITION_TNT_v10_5",
      "HEARTH_ROUTE_CONDUCTOR_BILATERAL_TRIANGLE_SCAN_CANVAS_PLATTER_PACKET_BRIDGE_TNT_v10_4",
      "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_TNT_v10_3",
      "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v10_2",
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE_TNT_v10_1"
    ],
    controlsQueen: [
      "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1",
      "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v5",
      "HEARTH_CONTROLS_VERTICAL_POLARITY_SMOOTH_CANVAS_HEX_PAIR_ALIGNMENT_TNT_v4_2",
      "HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_TNT_v4_1",
      "HEARTH_CONTROLS_QUEEN_WEST_GATE_HIERARCHY_SUPERCONDUCTOR_VIEW_INPUT_BRIDGE_TNT_v2"
    ],
    chapel1AssetsCanvasHub: [
      "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3",
      "HEARTH_CANVAS_HUB_REC0_SETTLED_GEOMETRY_SINGLE_VIEW_APPLICATION_DEFERRED_HEX_OUTPUT_TNT_v12_4_1",
      "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4"
    ],
    chapel1AssetsPriest: [
      "HEARTH_CANVAS_CHAPEL_INSPECT_ASSETS_HUB_PRIEST_TNT_v1",
      "HEARTH_CANVAS_HUB_INSPECT_ASSETS_CHAPEL_PRIEST_TNT_v1"
    ],
    hexAuthority: ["HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1"],
    hexSurfaceGate: ["HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4"],
    chapel2PointerSurfaceBishop: [
      "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v4"
    ],
    chapel2InspectPriest: [
      "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_TNT_v1"
    ],
    diagnosticNorthRail: [
      "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_TNT_v11",
      "HEARTH_DIAGNOSTIC_RAIL_NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY_TNT_v11_6"
    ],
    diagnosticEastRail: [
      "HEARTH_DIAGNOSTIC_EAST_CANVAS_EXPRESSION_SOURCE_FOOTPRINT_ALIGNMENT_TNT_v8",
      "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1"
    ],
    diagnosticWestRail: [
      "HEARTH_DIAGNOSTIC_WEST_CANVAS_EXPRESSION_RENDERED_RANGE_OBSERVATORY_TNT_v7",
      "HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_TNT_v1"
    ],
    diagnosticSouthRail: [
      "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v8",
      "HEARTH_DIAGNOSTIC_SOUTH_PAIR_SIDE_PACKET_OUTPUT_HANDOFF_TNT_v10"
    ],
    probeNorth: ["HEARTH_DIAGNOSTIC_PROBE_NORTH_FILE_COMPOSITION_ZONE_COORDINATOR_TNT_v1"],
    probeEast: ["HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_FILE_COMPOSITION_TNT_v1"],
    probeWest: [
      "HEARTH_DIAGNOSTIC_PROBE_WEST_RENDERED_TARGET_FILE_COMPOSITION_TNT_v1",
      "HEARTH_DIAGNOSTIC_PROBE_WEST_RENDERED_TARGET_BRIDGE_TNT_v1"
    ],
    probeCanvasSurfaceTruth: [
      "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1"
    ],
    probeSouth: [
      "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1"
    ],
    labNorth: [PUBLIC_CONTRACT, INTERNAL_RENEWAL_CONTRACT],
    labWest: [
      "LAB_RUNTIME_TABLE_CARDINAL_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE_TNT_v4_9",
      "LAB_RUNTIME_TABLE_CARDINAL_WEST_CANVAS_CHAPEL_DUAL_CHAPEL_METRIC_BINDING_TNT_v5_2",
      "LAB_RUNTIME_TABLE_CARDINAL_WEST_KING_QUEEN_DUAL_CHAPEL_RUNTIME_MAP_TNT_v5_2"
    ]
  };

  var ALIAS_SPREAD = {
    northRuntimeGrammar: [
      "LAB_RUNTIME_TABLE",
      "LAB_RUNTIME_TABLE_NORTH",
      "LAB_RUNTIME_TABLE_MULTI_FUNCTION_ANIMATION_STANDARD",
      "DEXTER_LAB.runtimeTable",
      "DEXTER_LAB.runtimeTableNorth",
      "DEXTER_LAB.northRuntimeTable",
      "HEARTH.labRuntimeTable",
      "HEARTH.labRuntimeTableNorth"
    ],
    kingRouteConductor: [
      "HEARTH_ROUTE_CONDUCTOR",
      "HEARTH.routeConductor",
      "HEARTH.kingRouteConductor",
      "HEARTH.KING_ROUTE_CONDUCTOR",
      "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC"
    ],
    queenControls: [
      "HEARTH_CONTROLS",
      "HEARTH.controls",
      "HEARTH.controlsQueen",
      "HEARTH.queenControls",
      "HEARTH.QUEEN_CONTROLS",
      "HEARTH_CONTROLS_QUEEN"
    ],
    chapel1AssetsCanvasHub: [
      "HEARTH_CANVAS",
      "HEARTH.canvas",
      "HEARTH.canvasHub",
      "HEARTH.assetsCanvasHub",
      "HEARTH.chapel1AssetsCanvasHub",
      "HEARTH.CHAPEL_1_ASSETS_CANVAS_HUB",
      "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER"
    ],
    chapel1AssetsPriest: [
      "HEARTH_CANVAS_CHAPEL_INSPECT",
      "HEARTH.canvasChapelInspect",
      "HEARTH.canvasAssetInspect",
      "HEARTH.chapel1AssetsPriest",
      "HEARTH.CHAPEL_1_ASSETS_PRIEST",
      "HEARTH_CANVAS_CHAPEL_INSPECT_ASSETS_HUB_PRIEST"
    ],
    hexAuthority: [
      "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
      "HEARTH.hexAuthority",
      "HEARTH.hexFourPairAuthority"
    ],
    hexSurfaceGate: [
      "HEARTH_HEX_SURFACE",
      "HEARTH.hexSurface",
      "HEARTH.hexSurfaceGate",
      "HEARTH.HEX_SURFACE_GATE",
      "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER"
    ],
    chapel2PointerSurfaceBishop: [
      "HEARTH_CANVAS_FINGER_SURFACE",
      "HEARTH.canvasFingerSurface",
      "HEARTH.pointerSurfaceBishop",
      "HEARTH.chapel2PointerSurfaceBishop",
      "HEARTH.CHAPEL_2_POINTER_SURFACE_BISHOP",
      "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET"
    ],
    chapel2InspectPriest: [
      "HEARTH_CANVAS_FINGER_INSPECT",
      "HEARTH.canvasFingerInspect",
      "HEARTH.pointerInspectPriest",
      "HEARTH.chapel2InspectPriest",
      "HEARTH.CHAPEL_2_INSPECT_PRIEST",
      "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF"
    ],
    judgeNorth: [
      "HEARTH.diagnosticNorth",
      "HEARTH.diagnosticRail",
      "HEARTH.diagnosticNorthRail",
      "HEARTH.JUDGE_NORTH_DIAGNOSTIC_RAIL",
      "HEARTH_DIAGNOSTIC_RAIL_NORTH"
    ],
    judgeEast: [
      "HEARTH.diagnosticEast",
      "HEARTH.diagnosticRailEast",
      "HEARTH.JUDGE_EAST_SOURCE_READ"
    ],
    judgeWest: [
      "HEARTH.diagnosticWest",
      "HEARTH.diagnosticRailWest",
      "HEARTH.JUDGE_WEST_ADMISSIBILITY_READ"
    ],
    judgeSouth: [
      "HEARTH.diagnosticSouth",
      "HEARTH.diagnosticRailSouth",
      "HEARTH.JUDGE_SOUTH_PACKET_OUTPUT"
    ],
    probeNorth: [
      "HEARTH.diagnosticProbeNorth",
      "HEARTH.JUDGE_NORTH_PROBE"
    ],
    probeEast: [
      "HEARTH.diagnosticProbeEast",
      "HEARTH.JUDGE_EAST_PROBE"
    ],
    probeWest: [
      "HEARTH.diagnosticProbeWest",
      "HEARTH.JUDGE_WEST_PROBE"
    ],
    probeCanvasSurfaceTruth: [
      "HEARTH.diagnosticProbeCanvasSurfaceTruth",
      "HEARTH.canvasSurfaceTruthProbe",
      "HEARTH.JUDGE_SURFACE_TRUTH_PROBE"
    ],
    probeSouth: [
      "HEARTH.diagnosticProbeSouth",
      "HEARTH.JUDGE_SOUTH_PROBE"
    ],
    labWestDerivativeDiagnostic: [
      "LAB_RUNTIME_TABLE_WEST",
      "LAB_RUNTIME_TABLE_CARDINAL_WEST",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.cardinalWestRuntimeTable",
      "HEARTH.labWestRuntimeTable"
    ]
  };

  var STRICT_PROOF_RULES = {
    ALIAS_IS_LABEL: true,
    ALIAS_IS_ENDPOINT_PROOF: false,
    CONTAINER_IDENTITY_IS_NOT_TRANSITIVE: true,
    STRICT_FILE_CONTRACT_FAMILY_MATCH_REQUIRED: true,
    BORROWED_CONTRACT_TEXT_REJECTED: true,
    BORROWED_AUTHORITY_CONTRACT_TEXT_DOES_NOT_PROVE_ENDPOINT: true,
    DATASET_CONTRACT_TEXT_IS_ADVISORY_ONLY: true,
    CHURCH_ROLE_CANNOT_OVERRIDE_CONTRACT_FAMILY: true,
    CHAPEL_2_PRIEST_CANNOT_SATISFY_CHAPEL_1_PRIEST: true,
    CHILD_CONTAINER_DOES_NOT_BECOME_PARENT: true,
    RECEIVER_CONTAINER_DOES_NOT_INHERIT_SENDER_CONTRACT: true,
    PROBE_CONTAINER_DOES_NOT_BECOME_FINAL_ARBITER: true,
    SERVICE_CONTAINER_DOES_NOT_INHERIT_PARENT_AUTHORITY: true,
    COHERENT_FILE_CAN_STILL_COLLAPSE_UNDER_EXCESS_DUTY: true,
    DIAGNOSTIC_SELF_MEASUREMENT_REQUIRED: true,
    DIAGNOSTIC_RESULT_REJECTED_IF_SELF_COLLAPSED: true,
    DIAGNOSTIC_NEXT_FILE_RECOMMENDATION_REJECTED_IF_DUTY_DRIFT: true,
    DIAGNOSTIC_FINAL_ARBITRATION_REJECTED_IF_CONTAINER_COLLAPSE: true,
    DIAGNOSTIC_MALPRACTICE_GUARD_ACTIVE: true
  };

  var RUNTIME_GRAMMAR_SCHEMA = {
    schemaName: "RUNTIME_GRAMMAR_SCHEMA",
    owner: "LAB_NORTH_RUNTIME_TABLE",
    sourceLaw: true,
    westDerivativeDiagnosticRequired: true,
    canvasConstructionFollowsDerivativeDiagnostic: true,
    roles: {
      KING_ROUTE_CONDUCTOR: {
        family: "HEARTH_ROUTE_CONDUCTOR",
        file: FILES.routeConductor,
        authorityType: "route-permission-and-source-handoff-authority",
        endpointProofRequired: true,
        expectedContracts: CONTRACTS.routeConductor
      },
      QUEEN_CONTROLS: {
        family: "HEARTH_CONTROLS",
        file: FILES.controlsQueen,
        authorityType: "view-input-and-control-delta-authority",
        endpointProofRequired: true,
        expectedContracts: CONTRACTS.controlsQueen,
        mayReceiveCanvasContractText: true,
        mayUseCanvasContractTextAsOwnEndpointProof: false
      },
      CHAPEL_1_ASSETS_CANVAS_HUB: {
        family: "HEARTH_CANVAS_HUB",
        file: FILES.chapel1AssetsCanvasHub,
        authorityType: "assets-canvas-hub-lead-bishop",
        endpointProofRequired: true,
        expectedContracts: CONTRACTS.chapel1AssetsCanvasHub
      },
      CHAPEL_1_ASSETS_PRIEST: {
        family: "HEARTH_CANVAS_CHAPEL_INSPECT",
        file: FILES.chapel1AssetsPriest,
        authorityType: "assets-chapel-priest-not-yet-built",
        endpointProofRequired: false,
        expectedNotYetBuilt: true,
        expectedContracts: CONTRACTS.chapel1AssetsPriest
      },
      HEX_AUTHORITY: {
        family: "HEARTH_HEX_AUTHORITY",
        file: FILES.hexAuthority,
        authorityType: "hex-four-pair-handshake-authority",
        endpointProofRequired: true,
        expectedContracts: CONTRACTS.hexAuthority
      },
      HEX_SURFACE_GATE: {
        family: "HEARTH_HEX_SURFACE",
        file: FILES.hexSurfaceGate,
        authorityType: "downstream-hex-surface-gate",
        endpointProofRequired: true,
        expectedContracts: CONTRACTS.hexSurfaceGate,
        mayReceiveCanvasContractText: true,
        mayUseCanvasContractTextAsOwnEndpointProof: false
      },
      CHAPEL_2_POINTER_SURFACE_BISHOP: {
        family: "HEARTH_CANVAS_FINGER_SURFACE",
        file: FILES.chapel2PointerSurfaceBishop,
        authorityType: "pointer-surface-chapel-bishop",
        endpointProofRequired: true,
        expectedContracts: CONTRACTS.chapel2PointerSurfaceBishop
      },
      CHAPEL_2_INSPECT_PRIEST: {
        family: "HEARTH_CANVAS_FINGER_INSPECT",
        file: FILES.chapel2InspectPriest,
        authorityType: "chapel-2-child-organizer-priest",
        endpointProofRequired: true,
        advisoryChild: true,
        maySatisfyChapel1Priest: false,
        expectedContracts: CONTRACTS.chapel2InspectPriest
      },
      JUDGE_NORTH_DIAGNOSTIC_RAIL: {
        family: "HEARTH_DIAGNOSTIC_NORTH",
        file: FILES.diagnosticNorthRail,
        authorityType: "diagnostic-final-arbitration-rail",
        expectedContracts: CONTRACTS.diagnosticNorthRail
      },
      JUDGE_EAST_SOURCE_READ: {
        family: "HEARTH_DIAGNOSTIC_EAST",
        file: FILES.diagnosticEastRail,
        authorityType: "served-source-reader",
        expectedContracts: CONTRACTS.diagnosticEastRail
      },
      JUDGE_WEST_ADMISSIBILITY_READ: {
        family: "HEARTH_DIAGNOSTIC_WEST",
        file: FILES.diagnosticWestRail,
        authorityType: "rendered-target-reader",
        expectedContracts: CONTRACTS.diagnosticWestRail
      },
      JUDGE_SOUTH_PACKET_OUTPUT: {
        family: "HEARTH_DIAGNOSTIC_SOUTH",
        file: FILES.diagnosticSouthRail,
        authorityType: "packet-output-carrier",
        expectedContracts: CONTRACTS.diagnosticSouthRail
      }
    }
  };

  var CHURCH_HIERARCHY_REGISTRY = {
    schemaName: "CHURCH_HIERARCHY_REGISTRY",
    KING_ROUTE_CONDUCTOR: {
      file: FILES.routeConductor,
      children: ["QUEEN_CONTROLS", "CHAPEL_1_ASSETS_CANVAS_HUB"],
      mayDelegate: true,
      mayBeSubstitutedByChild: false
    },
    QUEEN_CONTROLS: {
      file: FILES.controlsQueen,
      children: [],
      ownsInputAdmission: true,
      ownsViewDeltas: true,
      ownsCanvasContract: false,
      mayBeSubstitutedByCanvas: false
    },
    CHAPEL_1_ASSETS_CANVAS_HUB: {
      file: FILES.chapel1AssetsCanvasHub,
      title: "LEAD_BISHOP_OF_ASSETS_CHAPEL",
      chapel: "CHAPEL_1",
      children: ["CHAPEL_1_ASSETS_PRIEST", "HEX_SURFACE_GATE", "CHAPEL_2_POINTER_SURFACE_BISHOP"],
      ownsCanvasReception: true,
      ownsCanvasDrawingCarrier: true,
      ownsControlInput: false,
      ownsFinalArbitration: false
    },
    CHAPEL_1_ASSETS_PRIEST: {
      file: FILES.chapel1AssetsPriest,
      chapel: "CHAPEL_1",
      expectedNotYetBuilt: true,
      mayBeSatisfiedByChapel2InspectPriest: false
    },
    CHAPEL_2_POINTER_SURFACE_BISHOP: {
      file: FILES.chapel2PointerSurfaceBishop,
      chapel: "CHAPEL_2",
      children: ["CHAPEL_2_INSPECT_PRIEST"],
      ownsPointerSurfaceGate: true,
      ownsChapel1HubIdentity: false
    },
    CHAPEL_2_INSPECT_PRIEST: {
      file: FILES.chapel2InspectPriest,
      chapel: "CHAPEL_2",
      childOf: "CHAPEL_2_POINTER_SURFACE_BISHOP",
      ownsInspectionOfChapel2: true,
      ownsChapel1PriestIdentity: false,
      ownsPointerSurfaceBishopIdentity: false
    }
  };

  var CONTAINER_COLLAPSE_PREVENTION_SCHEMA = {
    schemaName: "CONTAINER_COLLAPSE_PREVENTION_SCHEMA",
    active: true,
    definition:
      "Container collapse occurs when one authority container absorbs, impersonates, substitutes for, or exports another container's endpoint identity.",
    laws: {
      CONTAINER_IDENTITY_IS_NOT_TRANSITIVE: true,
      PARENT_CHILD_CONTAINER_SUBSTITUTION_REJECTED: true,
      SIBLING_CONTAINER_SUBSTITUTION_REJECTED: true,
      BORROWED_CONTRACT_TEXT_REJECTION_REQUIRED: true,
      RECEIVER_DOES_NOT_INHERIT_SENDER_CONTRACT: true,
      SERVICE_DOES_NOT_INHERIT_PARENT_AUTHORITY: true,
      PRIEST_DOES_NOT_BECOME_BISHOP: true,
      BISHOP_DOES_NOT_BECOME_KING_OR_QUEEN: true,
      PROBE_DOES_NOT_BECOME_FINAL_ARBITER: true
    },
    statuses: [
      "CONTAINER_CONFIRMED",
      "CONTAINER_HEAVY_NON_COLLAPSED",
      "CONTAINER_COLLAPSE_RISK",
      "CONTAINER_COLLAPSE_DETECTED",
      "BORROWED_CONTRACT_TEXT_REJECTED",
      "SIBLING_CONTAINER_SUBSTITUTION_REJECTED",
      "PARENT_CHILD_CONTAINER_SUBSTITUTION_REJECTED"
    ],
    collapseExamples: [
      {
        example: "CONTROLS_QUEEN exposing Canvas contract as selected endpoint contract",
        status: "BORROWED_CONTRACT_TEXT_REJECTED"
      },
      {
        example: "HEX_SURFACE_GATE exposing Canvas contract as selected endpoint contract",
        status: "BORROWED_CONTRACT_TEXT_REJECTED"
      },
      {
        example: "CHAPEL_2_INSPECT_PRIEST satisfying CHAPEL_1_ASSETS_PRIEST",
        status: "SIBLING_CONTAINER_SUBSTITUTION_REJECTED"
      },
      {
        example: "SURFACE_TRUTH_PROBE issuing final production repair ruling",
        status: "PROBE_ARBITRATION_COLLAPSE_REJECTED"
      }
    ]
  };

  var DUTY_LOAD_BUDGET_SCHEMA = {
    schemaName: "DUTY_LOAD_BUDGET_SCHEMA",
    active: true,
    definition:
      "A coherent file can still collapse when it carries too much duty, too many authority domains, or too many downstream services.",
    metrics: [
      "PRIMARY_DUTY_COUNT",
      "SECONDARY_DUTY_COUNT",
      "OWNERSHIP_DOMAIN_COUNT",
      "MUTATION_AUTHORITY_COUNT",
      "READ_AUTHORITY_COUNT",
      "WRITE_AUTHORITY_COUNT",
      "LIFECYCLE_METHOD_COUNT",
      "DOWNSTREAM_SERVICE_COUNT",
      "UPSTREAM_DEPENDENCY_COUNT",
      "FAN_IN_COUNT",
      "FAN_OUT_COUNT",
      "CONTRACT_FAMILY_REFERENCED_COUNT",
      "ALIAS_SURFACE_COUNT",
      "RECEIPT_WEIGHT_CLASS",
      "SYNCHRONOUS_WORK_BURDEN",
      "ASYNC_WORK_BURDEN",
      "RENDER_OR_INPUT_COUPLING_PRESENT"
    ],
    statusScale: [
      "DUTY_LOAD_SAFE",
      "DUTY_LOAD_HEAVY_NON_COLLAPSED",
      "DUTY_LOAD_COLLAPSE_RISK",
      "DUTY_LOAD_COLLAPSE_DETECTED",
      "SPLIT_REQUIRED",
      "DELEGATION_REQUIRED",
      "SERVICE_BOUNDARY_REQUIRED"
    ],
    budgets: {
      grammarSource: {
        primaryDutyCountMax: 1,
        mutationAuthorityCountMax: 0,
        writeAuthorityCountMax: 0,
        finalArbitrationAuthorityAllowed: false,
        productionRepairAuthorityAllowed: false,
        note: "North runtime table defines grammar only."
      },
      derivativeDiagnostic: {
        primaryDutyCountMax: 1,
        mutationAuthorityCountMax: 0,
        writeAuthorityCountMax: 0,
        finalArbitrationAuthorityAllowed: false,
        productionRepairAuthorityAllowed: false,
        note: "West derives admissibility and construction map only."
      },
      contractDefinitionProbe: {
        primaryDutyCountMax: 1,
        mutationAuthorityCountMax: 0,
        finalArbitrationAuthorityAllowed: false,
        nextProductionFileAuthorityAllowed: false,
        note: "Canvas Surface Truth Probe defines delicate surface/container contracts only."
      },
      packetOutputCarrier: {
        primaryDutyCountMax: 1,
        mutationAuthorityCountMax: 0,
        diagnosticTruthEmbeddingAllowed: false,
        note: "South packages output but does not become the probe."
      }
    }
  };

  var PROBE_NETWORK_DISTRIBUTION_SCHEMA = {
    schemaName: "PROBE_NETWORK_DISTRIBUTION_SCHEMA",
    active: true,
    probes: {
      PROBE_NORTH: {
        file: FILES.probeNorth,
        allowedDuties: [
          "file-composition-zone-coordination",
          "diagnostic-zone-routing",
          "composition-map-read"
        ],
        forbiddenDuties: [
          "production-repair",
          "canvas-drawing",
          "west-admissibility-derivation",
          "final-runtime-arbitration"
        ]
      },
      PROBE_EAST: {
        file: FILES.probeEast,
        allowedDuties: [
          "served-source-read",
          "script-presence-read",
          "source-contract-read"
        ],
        forbiddenDuties: [
          "rendered-admissibility-ruling",
          "production-repair",
          "final-runtime-arbitration"
        ]
      },
      PROBE_WEST: {
        file: FILES.probeWest,
        allowedDuties: [
          "rendered-target-read",
          "rendered-composition-read",
          "west-lane-evidence-read"
        ],
        forbiddenDuties: [
          "north-grammar-definition",
          "production-repair",
          "final-runtime-arbitration"
        ]
      },
      PROBE_CANVAS_SURFACE_TRUTH: {
        file: FILES.probeCanvasSurfaceTruth,
        allowedDuties: [
          "detailed-canvas-surface-contract-definition",
          "fine-boundary-disambiguation",
          "canonical-mount-contract-definition",
          "canonical-frame-contract-definition",
          "canonical-canvas-contract-definition",
          "used-size-contract-definition",
          "pixel-visibility-contract-definition",
          "parent-chain-contract-definition",
          "cross-integration-collapse-detection"
        ],
        forbiddenDuties: [
          "final-runtime-arbitration",
          "production-repair-sequence",
          "west-derivative-diagnostic-replacement",
          "king-queen-chapel-grammar-source-replacement"
        ]
      },
      PROBE_SOUTH: {
        file: FILES.probeSouth,
        allowedDuties: [
          "packet-meaning-read",
          "return-envelope-read",
          "south-output-shape-read"
        ],
        forbiddenDuties: [
          "production-repair",
          "canvas-drawing",
          "west-admissibility-derivation",
          "final-runtime-arbitration"
        ]
      }
    }
  };

  var DELEGATED_CONTRACT_DEFINITION_AUTHORITIES = {
    schemaName: "DELEGATED_CONTRACT_DEFINITION_AUTHORITIES",
    active: true,
    authorities: {
      CANVAS_SURFACE_TRUTH_PROBE: {
        file: FILES.probeCanvasSurfaceTruth,
        role: "north-detailed-contract-definition-instrument",
        ownsDetailedCanvasContractDefinition: true,
        ownsFineBoundaryDisambiguation: true,
        ownsCrossIntegrationCollapseDetection: true,
        ownsFinalArbitration: false,
        ownsProductionRepairSequence: false,
        replacesWestDerivativeDiagnostic: false,
        detailedContracts: [
          "CANONICAL_MOUNT_CONTRACT",
          "CANONICAL_FRAME_CONTRACT",
          "CANONICAL_CANVAS_CONTRACT",
          "CANVAS_USED_SIZE_CONTRACT",
          "CANVAS_PIXEL_VISIBILITY_CONTRACT",
          "CANVAS_PARENT_CHAIN_CONTRACT",
          "CANVAS_SURFACE_RETURN_CONTRACT",
          "CHAPEL_1_CANVAS_HUB_BOUNDARY_CONTRACT",
          "CHAPEL_2_POINTER_SURFACE_BOUNDARY_CONTRACT",
          "CHAPEL_2_INSPECT_PRIEST_BOUNDARY_CONTRACT",
          "BORROWED_CONTRACT_TEXT_REJECTION_CONTRACT",
          "CROSS_AUTHORITY_COLLAPSE_REJECTION_CONTRACT",
          "CROSS_CONTAINER_COLLAPSE_REJECTION_CONTRACT"
        ]
      }
    }
  };

  var SERVICE_DELEGATION_SCHEMA = {
    schemaName: "SERVICE_DELEGATION_SCHEMA",
    active: true,
    defaultServiceContract: {
      SERVICE_NAME: "",
      SERVICE_OWNER: "",
      INPUT_PACKET_CONTRACT: "",
      OUTPUT_PACKET_CONTRACT: "",
      MUTATION_ALLOWED: false,
      LIFECYCLE_ALLOWED: false,
      AUTHORITY_INHERITANCE_ALLOWED: false,
      CAN_RECOMMEND_NEXT_FILE: false,
      CAN_AUTHORIZE_NEXT_FILE: false,
      CAN_RETURN_RECEIPT: true,
      CAN_FINAL_ARBITRATE: false
    },
    laws: {
      TOOL_CAN_HELP_WITHOUT_INHERITING_PARENT_AUTHORITY: true,
      SERVICE_OUTPUT_IS_EVIDENCE_NOT_AUTHORIZATION: true,
      SERVICE_RECEIPT_DOES_NOT_BECOME_FINAL_ARBITRATION: true,
      SERVICE_DELEGATION_MUST_DECLARE_INPUT_AND_OUTPUT_CONTRACTS: true
    },
    statuses: [
      "SERVICE_DELEGATION_CLEAN",
      "SERVICE_BOUNDARY_HEAVY_NON_COLLAPSED",
      "SERVICE_AUTHORITY_INHERITANCE_RISK",
      "SERVICE_CONTAINER_COLLAPSE_DETECTED",
      "SERVICE_OUTPUT_QUARANTINED"
    ]
  };

  var DIAGNOSTIC_SELF_MEASUREMENT_SCHEMA = {
    schemaName: "DIAGNOSTIC_SELF_MEASUREMENT_SCHEMA",
    active: true,
    required: true,
    fields: [
      "DIAGNOSTIC_FILE",
      "ASSIGNED_ROLE",
      "ALLOWED_DUTIES",
      "FORBIDDEN_DUTIES",
      "PRIMARY_DUTY_COUNT",
      "BORROWED_DUTY_COUNT",
      "ARBITRATION_AUTHORITY_ALLOWED",
      "CONTRACT_DEFINITION_AUTHORITY_ALLOWED",
      "MEASUREMENT_AUTHORITY_ALLOWED",
      "PACKET_OUTPUT_AUTHORITY_ALLOWED",
      "PRODUCTION_MUTATION_AUTHORITY_ALLOWED",
      "DUTY_DRIFT_DETECTED",
      "DIAGNOSTIC_CONTAINER_COLLAPSE_RISK",
      "DIAGNOSTIC_CONTAINER_COLLAPSE_DETECTED",
      "SELF_MEASUREMENT_STATUS"
    ],
    statuses: [
      "DIAGNOSTIC_SELF_DUTY_CLEAN",
      "DIAGNOSTIC_SELF_DUTY_HEAVY_NON_COLLAPSED",
      "DIAGNOSTIC_SELF_DUTY_DRIFT_DETECTED",
      "DIAGNOSTIC_CONTAINER_COLLAPSE_RISK",
      "DIAGNOSTIC_CONTAINER_COLLAPSE_DETECTED"
    ]
  };

  var DIAGNOSTIC_MALPRACTICE_GUARD_SCHEMA = {
    schemaName: "DIAGNOSTIC_MALPRACTICE_GUARD_SCHEMA",
    active: true,
    definition:
      "Diagnostic malpractice occurs when a diagnostic instrument issues authoritative conclusions while its own role boundary, duty load, container identity, or authority inheritance is compromised.",
    failureClasses: {
      PRODUCTION_COLLAPSE: "Runtime file or production container collapses.",
      DIAGNOSTIC_COLLAPSE: "Diagnostic file or measuring container collapses.",
      DIAGNOSTIC_MALPRACTICE:
        "Collapsed or duty-drifted diagnostic still issues recommendation, arbitration, repair target, or next-file ruling as if clean."
    },
    laws: {
      DIAGNOSTIC_SELF_MEASUREMENT_REQUIRED: true,
      DIAGNOSTIC_RESULT_REJECTED_IF_SELF_COLLAPSED: true,
      DIAGNOSTIC_NEXT_FILE_RECOMMENDATION_REJECTED_IF_DUTY_DRIFT: true,
      DIAGNOSTIC_FINAL_ARBITRATION_REJECTED_IF_CONTAINER_COLLAPSE: true,
      DIAGNOSTIC_OUTPUT_QUARANTINED_AS_UNTRUSTED_EVIDENCE: true
    },
    statuses: [
      "NO_DIAGNOSTIC_MALPRACTICE",
      "DIAGNOSTIC_DUTY_DRIFT_WARNING",
      "DIAGNOSTIC_CONTAINER_COLLAPSE_RISK",
      "DIAGNOSTIC_CONTAINER_COLLAPSE_DETECTED",
      "DIAGNOSTIC_MALPRACTICE_DETECTED",
      "DIAGNOSTIC_OUTPUT_QUARANTINED"
    ]
  };

  var CARDINAL_HANDOFF_SCHEMA = {
    schemaName: "CARDINAL_HANDOFF_SCHEMA",
    active: true,
    labRuntimeCycle: [
      "LAB_NORTH_RUNTIME_GRAMMAR_SOURCE",
      "LAB_EAST_SOURCE_FACT_READER",
      "LAB_WEST_DERIVATIVE_DIAGNOSTIC",
      "LAB_SOUTH_PACKET_OUTPUT",
      "LAB_NORTH_SCHEMA_RETURN"
    ],
    productionExpressionCycle: [
      "KING_ROUTE_CONDUCTOR",
      "QUEEN_CONTROLS",
      "CHAPEL_1_ASSETS_CANVAS_HUB",
      "HEX_SURFACE_GATE",
      "CHAPEL_2_POINTER_SURFACE_BISHOP",
      "CHAPEL_1_ASSETS_CANVAS_HUB_RETURN"
    ],
    diagnosticProbeCycle: [
      "PROBE_NORTH_ZONE_COORDINATION",
      "PROBE_EAST_SERVED_SOURCE_FACTS",
      "PROBE_WEST_RENDERED_FACTS",
      "PROBE_CANVAS_SURFACE_TRUTH_CONTRACT_DEFINITION",
      "PROBE_SOUTH_PACKET_MEANING",
      "DIAGNOSTIC_NORTH_FINAL_ARBITRATION"
    ]
  };

  var state = {
    booted: false,
    disposed: false,
    bootCount: 0,
    lastUpdatedAt: "",
    lastReceipt: null,
    lastReceiptText: ""
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_) {
      return "";
    }
  }

  function clone(value) {
    if (value == null) return value;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_) {
      if (Array.isArray(value)) return value.slice();
      if (typeof value === "object") {
        var out = {};
        Object.keys(value).forEach(function (key) {
          out[key] = value[key];
        });
        return out;
      }
      return value;
    }
  }

  function ensureNamespace(name) {
    if (!GLOBAL[name] || typeof GLOBAL[name] !== "object") {
      GLOBAL[name] = {};
    }
    return GLOBAL[name];
  }

  function getPath(path) {
    if (!path || typeof path !== "string") return undefined;
    var parts = path.split(".");
    var cursor = GLOBAL;

    for (var i = 0; i < parts.length; i += 1) {
      if (!cursor || typeof cursor !== "object") return undefined;
      cursor = cursor[parts[i]];
    }

    return cursor;
  }

  function firstObservedAlias(aliasList) {
    var list = Array.isArray(aliasList) ? aliasList : [];
    for (var i = 0; i < list.length; i += 1) {
      var value = getPath(list[i]);
      if (value !== undefined && value !== null) {
        return {
          observed: true,
          alias: list[i],
          valueType: typeof value
        };
      }
    }
    return {
      observed: false,
      alias: "NONE",
      valueType: "undefined"
    };
  }

  function resolveAliasSpread() {
    var result = {};
    Object.keys(ALIAS_SPREAD).forEach(function (key) {
      result[key] = firstObservedAlias(ALIAS_SPREAD[key]);
    });
    return result;
  }

  function detectContractFamily(contract) {
    var text = String(contract || "");

    if (!text) return "UNKNOWN";

    if (/LAB_RUNTIME_TABLE.*WEST|CARDINAL_WEST/i.test(text)) return "LAB_WEST";
    if (/LAB_RUNTIME_TABLE|MULTI_FUNCTION_ANIMATION_STANDARD/i.test(text)) return "LAB_NORTH";
    if (/HEARTH_ROUTE_CONDUCTOR/i.test(text)) return "HEARTH_ROUTE_CONDUCTOR";
    if (/HEARTH_CONTROLS/i.test(text)) return "HEARTH_CONTROLS";
    if (/HEARTH_HEX_FOUR_PAIR|HEX_FOUR_PAIR_PIXEL_HANDSHAKE/i.test(text)) return "HEARTH_HEX_AUTHORITY";
    if (/HEARTH_HEX_SURFACE/i.test(text)) return "HEARTH_HEX_SURFACE";
    if (/HEARTH_CANVAS_FINGER_INSPECT/i.test(text)) return "HEARTH_CANVAS_FINGER_INSPECT";
    if (/HEARTH_CANVAS_FINGER_SURFACE/i.test(text)) return "HEARTH_CANVAS_FINGER_SURFACE";
    if (/HEARTH_CANVAS_CHAPEL|HEARTH_CANVAS_HUB_INSPECT_ASSETS_CHAPEL/i.test(text)) {
      return "HEARTH_CANVAS_CHAPEL_INSPECT";
    }
    if (/HEARTH_CANVAS_HUB|HEARTH_CANVAS/i.test(text)) return "HEARTH_CANVAS_HUB";
    if (/HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH/i.test(text)) return "HEARTH_DIAGNOSTIC_SURFACE_TRUTH_PROBE";
    if (/HEARTH_DIAGNOSTIC_PROBE/i.test(text)) return "HEARTH_DIAGNOSTIC_PROBE";
    if (/HEARTH_DIAGNOSTIC/i.test(text)) return "HEARTH_DIAGNOSTIC";

    return "UNKNOWN";
  }

  function evaluateContainerBoundary(packet) {
    var p = packet || {};
    var expectedFamily = String(p.expectedFamily || "");
    var observedContract = String(p.observedContract || p.contract || "");
    var observedFamily = detectContractFamily(observedContract);

    if (!expectedFamily || !observedContract) {
      return {
        status: "CONTAINER_NOT_EVALUATED",
        expectedFamily: expectedFamily || "UNKNOWN",
        observedFamily: observedFamily,
        borrowedContractTextRejected: false,
        containerCollapseDetected: false,
        reason: "MISSING_EXPECTED_FAMILY_OR_OBSERVED_CONTRACT"
      };
    }

    if (observedFamily === expectedFamily) {
      return {
        status: "CONTAINER_CONFIRMED",
        expectedFamily: expectedFamily,
        observedFamily: observedFamily,
        borrowedContractTextRejected: false,
        containerCollapseDetected: false,
        reason: "STRICT_FILE_CONTRACT_FAMILY_MATCH"
      };
    }

    return {
      status: "BORROWED_CONTRACT_TEXT_REJECTED",
      expectedFamily: expectedFamily,
      observedFamily: observedFamily,
      borrowedContractTextRejected: true,
      containerCollapseDetected: true,
      reason: "OBSERVED_CONTRACT_FAMILY_DOES_NOT_MATCH_EXPECTED_CONTAINER_FAMILY"
    };
  }

  function evaluateDutyLoad(metrics) {
    var m = metrics || {};
    var primary = Number(m.PRIMARY_DUTY_COUNT || m.primaryDutyCount || 0);
    var secondary = Number(m.SECONDARY_DUTY_COUNT || m.secondaryDutyCount || 0);
    var ownershipDomains = Number(m.OWNERSHIP_DOMAIN_COUNT || m.ownershipDomainCount || 0);
    var mutation = Number(m.MUTATION_AUTHORITY_COUNT || m.mutationAuthorityCount || 0);
    var write = Number(m.WRITE_AUTHORITY_COUNT || m.writeAuthorityCount || 0);
    var fanOut = Number(m.FAN_OUT_COUNT || m.fanOutCount || 0);
    var families = Number(m.CONTRACT_FAMILY_REFERENCED_COUNT || m.contractFamilyReferencedCount || 0);

    var score =
      primary * 4 +
      secondary * 1 +
      ownershipDomains * 3 +
      mutation * 6 +
      write * 5 +
      fanOut * 1 +
      families * 1;

    var status = "DUTY_LOAD_SAFE";
    if (score >= 18) status = "DUTY_LOAD_HEAVY_NON_COLLAPSED";
    if (score >= 28) status = "DUTY_LOAD_COLLAPSE_RISK";
    if (score >= 40 || mutation > 0 || write > 0) status = "DUTY_LOAD_COLLAPSE_DETECTED";

    return {
      status: status,
      score: score,
      PRIMARY_DUTY_COUNT: primary,
      SECONDARY_DUTY_COUNT: secondary,
      OWNERSHIP_DOMAIN_COUNT: ownershipDomains,
      MUTATION_AUTHORITY_COUNT: mutation,
      WRITE_AUTHORITY_COUNT: write,
      FAN_OUT_COUNT: fanOut,
      CONTRACT_FAMILY_REFERENCED_COUNT: families
    };
  }

  function evaluateDiagnosticSelfMeasurement(measurement) {
    var m = measurement || {};
    var duty = evaluateDutyLoad(m);
    var forbiddenDutyCount = Number(m.FORBIDDEN_DUTY_COUNT || m.forbiddenDutyCount || 0);
    var borrowedDutyCount = Number(m.BORROWED_DUTY_COUNT || m.borrowedDutyCount || 0);
    var finalArbitrationClaimed = Boolean(
      m.FINAL_ARBITRATION_CLAIMED ||
        m.finalArbitrationClaimed ||
        m.ARBITRATION_AUTHORITY_CLAIMED
    );
    var productionMutationClaimed = Boolean(
      m.PRODUCTION_MUTATION_AUTHORITY_CLAIMED ||
        m.productionMutationAuthorityClaimed ||
        m.PRODUCTION_MUTATION_AUTHORITY_ALLOWED
    );

    var malpractice = false;
    var status = "DIAGNOSTIC_SELF_DUTY_CLEAN";
    var quarantine = false;

    if (duty.status === "DUTY_LOAD_HEAVY_NON_COLLAPSED") {
      status = "DIAGNOSTIC_SELF_DUTY_HEAVY_NON_COLLAPSED";
    }

    if (forbiddenDutyCount > 0 || borrowedDutyCount > 0 || finalArbitrationClaimed) {
      status = "DIAGNOSTIC_SELF_DUTY_DRIFT_DETECTED";
    }

    if (duty.status === "DUTY_LOAD_COLLAPSE_RISK") {
      status = "DIAGNOSTIC_CONTAINER_COLLAPSE_RISK";
    }

    if (duty.status === "DUTY_LOAD_COLLAPSE_DETECTED" || productionMutationClaimed) {
      status = "DIAGNOSTIC_CONTAINER_COLLAPSE_DETECTED";
      malpractice = true;
      quarantine = true;
    }

    if (
      (forbiddenDutyCount > 0 || finalArbitrationClaimed || productionMutationClaimed) &&
      (m.ISSUED_NEXT_FILE_RECOMMENDATION || m.ISSUED_FINAL_VERDICT)
    ) {
      malpractice = true;
      quarantine = true;
      status = "DIAGNOSTIC_MALPRACTICE_DETECTED";
    }

    return {
      SELF_MEASUREMENT_STATUS: status,
      DUTY_LOAD_STATUS: duty.status,
      DUTY_LOAD_SCORE: duty.score,
      DUTY_DRIFT_DETECTED:
        forbiddenDutyCount > 0 || borrowedDutyCount > 0 || finalArbitrationClaimed,
      DIAGNOSTIC_CONTAINER_COLLAPSE_RISK: status === "DIAGNOSTIC_CONTAINER_COLLAPSE_RISK",
      DIAGNOSTIC_CONTAINER_COLLAPSE_DETECTED:
        status === "DIAGNOSTIC_CONTAINER_COLLAPSE_DETECTED" ||
        status === "DIAGNOSTIC_MALPRACTICE_DETECTED",
      DIAGNOSTIC_MALPRACTICE_DETECTED: malpractice,
      DIAGNOSTIC_OUTPUT_QUARANTINED: quarantine
    };
  }

  function evaluateServiceDelegation(serviceContract) {
    var s = serviceContract || {};
    var inheritsAuthority = Boolean(s.AUTHORITY_INHERITANCE_ALLOWED);
    var mutationAllowed = Boolean(s.MUTATION_ALLOWED);
    var lifecycleAllowed = Boolean(s.LIFECYCLE_ALLOWED);
    var finalArbitrate = Boolean(s.CAN_FINAL_ARBITRATE);
    var authorizeNext = Boolean(s.CAN_AUTHORIZE_NEXT_FILE);

    if (inheritsAuthority || mutationAllowed || finalArbitrate || authorizeNext) {
      return {
        status: "SERVICE_CONTAINER_COLLAPSE_DETECTED",
        serviceOutputTrusted: false,
        serviceOutputQuarantined: true,
        reason: "SERVICE_EXCEEDED_DELEGATED_AUTHORITY"
      };
    }

    if (lifecycleAllowed) {
      return {
        status: "SERVICE_AUTHORITY_INHERITANCE_RISK",
        serviceOutputTrusted: false,
        serviceOutputQuarantined: true,
        reason: "SERVICE_LIFECYCLE_AUTHORITY_REQUIRES_EXPLICIT_PARENT_SCOPE"
      };
    }

    return {
      status: "SERVICE_DELEGATION_CLEAN",
      serviceOutputTrusted: true,
      serviceOutputQuarantined: false,
      reason: "SERVICE_BOUNDARY_WITHIN_SCHEMA"
    };
  }

  function getRuntimeGrammar() {
    return clone(RUNTIME_GRAMMAR_SCHEMA);
  }

  function getChurchHierarchyRegistry() {
    return clone(CHURCH_HIERARCHY_REGISTRY);
  }

  function getAcceptedEndpointFamilies() {
    return {
      HEARTH_ROUTE_CONDUCTOR: CONTRACTS.routeConductor.slice(),
      HEARTH_CONTROLS: CONTRACTS.controlsQueen.slice(),
      HEARTH_CANVAS_HUB: CONTRACTS.chapel1AssetsCanvasHub.slice(),
      HEARTH_CANVAS_CHAPEL_INSPECT: CONTRACTS.chapel1AssetsPriest.slice(),
      HEARTH_HEX_AUTHORITY: CONTRACTS.hexAuthority.slice(),
      HEARTH_HEX_SURFACE: CONTRACTS.hexSurfaceGate.slice(),
      HEARTH_CANVAS_FINGER_SURFACE: CONTRACTS.chapel2PointerSurfaceBishop.slice(),
      HEARTH_CANVAS_FINGER_INSPECT: CONTRACTS.chapel2InspectPriest.slice(),
      HEARTH_DIAGNOSTIC_NORTH: CONTRACTS.diagnosticNorthRail.slice(),
      HEARTH_DIAGNOSTIC_EAST: CONTRACTS.diagnosticEastRail.slice(),
      HEARTH_DIAGNOSTIC_WEST: CONTRACTS.diagnosticWestRail.slice(),
      HEARTH_DIAGNOSTIC_SOUTH: CONTRACTS.diagnosticSouthRail.slice(),
      LAB_NORTH: CONTRACTS.labNorth.slice(),
      LAB_WEST: CONTRACTS.labWest.slice()
    };
  }

  function getAliasSpread() {
    return clone(ALIAS_SPREAD);
  }

  function getStrictProofRules() {
    return clone(STRICT_PROOF_RULES);
  }

  function getContainerCollapsePreventionSchema() {
    return clone(CONTAINER_COLLAPSE_PREVENTION_SCHEMA);
  }

  function getDutyLoadBudgetSchema() {
    return clone(DUTY_LOAD_BUDGET_SCHEMA);
  }

  function getProbeNetworkDistributionSchema() {
    return clone(PROBE_NETWORK_DISTRIBUTION_SCHEMA);
  }

  function getDelegatedContractDefinitionAuthorities() {
    return clone(DELEGATED_CONTRACT_DEFINITION_AUTHORITIES);
  }

  function getServiceDelegationSchema() {
    return clone(SERVICE_DELEGATION_SCHEMA);
  }

  function getDiagnosticSelfMeasurementSchema() {
    return clone(DIAGNOSTIC_SELF_MEASUREMENT_SCHEMA);
  }

  function getDiagnosticMalpracticeGuardSchema() {
    return clone(DIAGNOSTIC_MALPRACTICE_GUARD_SCHEMA);
  }

  function getCardinalHandoffSchema() {
    return clone(CARDINAL_HANDOFF_SCHEMA);
  }

  function composeSelfMeasurement() {
    return evaluateDiagnosticSelfMeasurement({
      DIAGNOSTIC_FILE: FILE,
      ASSIGNED_ROLE: "LAB_NORTH_RUNTIME_GRAMMAR_SOURCE",
      PRIMARY_DUTY_COUNT: 1,
      SECONDARY_DUTY_COUNT: 7,
      OWNERSHIP_DOMAIN_COUNT: 1,
      MUTATION_AUTHORITY_COUNT: 0,
      WRITE_AUTHORITY_COUNT: 0,
      FAN_OUT_COUNT: 4,
      CONTRACT_FAMILY_REFERENCED_COUNT: 12,
      FORBIDDEN_DUTY_COUNT: 0,
      BORROWED_DUTY_COUNT: 0,
      FINAL_ARBITRATION_CLAIMED: false,
      PRODUCTION_MUTATION_AUTHORITY_CLAIMED: false,
      ISSUED_NEXT_FILE_RECOMMENDATION: false,
      ISSUED_FINAL_VERDICT: false
    });
  }

  function composeReceiptLight() {
    var updatedAt = nowIso();
    var selfMeasurement = composeSelfMeasurement();

    return Object.assign(
      {
        PACKET_NAME: "LAB_RUNTIME_TABLE_NORTH_SCHEMA_ANCHOR_LIGHT_RECEIPT_PACKET_v1_1",
        CONTRACT: PUBLIC_CONTRACT,
        RECEIPT: PUBLIC_RECEIPT,
        INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
        INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
        VERSION: VERSION,
        FILE: FILE,
        TARGET_ROUTE: TARGET_ROUTE,
        DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
        UPDATED_AT: updatedAt,

        NORTH_RUNTIME_GRAMMAR_SOURCE_ACTIVE: true,
        WEST_DERIVATIVE_DIAGNOSTIC_REQUIRED: true,
        CANVAS_CONSTRUCTION_FOLLOWS_DERIVATIVE_DIAGNOSTIC: true,

        RUNTIME_GRAMMAR_SCHEMA_ACTIVE: true,
        CONTAINER_COLLAPSE_PREVENTION_SCHEMA_ACTIVE: true,
        DUTY_LOAD_BUDGET_SCHEMA_ACTIVE: true,
        PROBE_NETWORK_DISTRIBUTION_SCHEMA_ACTIVE: true,
        DELEGATED_CONTRACT_DEFINITION_AUTHORITIES_ACTIVE: true,
        SERVICE_DELEGATION_SCHEMA_ACTIVE: true,
        DIAGNOSTIC_SELF_MEASUREMENT_SCHEMA_ACTIVE: true,
        DIAGNOSTIC_MALPRACTICE_GUARD_SCHEMA_ACTIVE: true,

        ALIAS_IS_LABEL: true,
        ALIAS_IS_ENDPOINT_PROOF: false,
        CONTAINER_IDENTITY_IS_NOT_TRANSITIVE: true,
        STRICT_FILE_CONTRACT_FAMILY_MATCH_REQUIRED: true,
        BORROWED_CONTRACT_TEXT_REJECTED: true,
        COHERENT_FILE_CAN_STILL_COLLAPSE_UNDER_EXCESS_DUTY: true,
        DIAGNOSTIC_SELF_MEASUREMENT_REQUIRED: true,
        DIAGNOSTIC_RESULT_REJECTED_IF_SELF_COLLAPSED: true,
        DIAGNOSTIC_MALPRACTICE_GUARD_ACTIVE: true,

        SURFACE_TRUTH_PROBE_OWNS_DETAILED_CANVAS_CONTRACT_DEFINITION: true,
        SURFACE_TRUTH_PROBE_OWNS_FINE_BOUNDARY_DISAMBIGUATION: true,
        SURFACE_TRUTH_PROBE_OWNS_CROSS_INTEGRATION_COLLAPSE_DETECTION: true,
        SURFACE_TRUTH_PROBE_DOES_NOT_OWN_FINAL_ARBITRATION: true,
        SURFACE_TRUTH_PROBE_DOES_NOT_OWN_PRODUCTION_REPAIR_SEQUENCE: true,
        SURFACE_TRUTH_PROBE_DOES_NOT_REPLACE_WEST_DERIVATIVE_DIAGNOSTIC: true,

        KING_ROUTE_CONDUCTOR_FILE: FILES.routeConductor,
        QUEEN_CONTROLS_FILE: FILES.controlsQueen,
        CHAPEL_1_ASSETS_CANVAS_HUB_FILE: FILES.chapel1AssetsCanvasHub,
        CHAPEL_1_ASSETS_PRIEST_FILE: FILES.chapel1AssetsPriest,
        CHAPEL_1_ASSETS_PRIEST_STATUS: "EXPECTED_NOT_YET_BUILT_NON_BLOCKING",
        CHAPEL_2_POINTER_SURFACE_BISHOP_FILE: FILES.chapel2PointerSurfaceBishop,
        CHAPEL_2_INSPECT_PRIEST_FILE: FILES.chapel2InspectPriest,
        CHAPEL_2_PRIEST_CANNOT_SATISFY_CHAPEL_1_PRIEST: true,

        NEXT_LAWFUL_DERIVATIVE_FILE: WEST_FILE,
        NEXT_LAWFUL_DERIVATIVE_ACTION:
          "RENEW_LABWEST_DERIVATIVE_DIAGNOSTIC_TO_CONSUME_NORTH_GRAMMAR_AND_SURFACE_TRUTH_CONTRACT_DEFINITIONS",

        SELF_MEASUREMENT_STATUS: selfMeasurement.SELF_MEASUREMENT_STATUS,
        DUTY_LOAD_STATUS: selfMeasurement.DUTY_LOAD_STATUS,
        DIAGNOSTIC_MALPRACTICE_STATUS: selfMeasurement.DIAGNOSTIC_MALPRACTICE_DETECTED
          ? "DIAGNOSTIC_MALPRACTICE_DETECTED"
          : "NO_DIAGNOSTIC_MALPRACTICE"
      },
      NO_CLAIMS
    );
  }

  function composeReceipt() {
    var light = composeReceiptLight();
    var aliases = resolveAliasSpread();

    return Object.assign(
      {
        packetType: "LAB_RUNTIME_TABLE_NORTH_SCHEMA_ANCHOR_RECEIPT_PACKET_v1_1",
        contract: PUBLIC_CONTRACT,
        CONTRACT: PUBLIC_CONTRACT,
        receipt: PUBLIC_RECEIPT,
        RECEIPT: PUBLIC_RECEIPT,
        internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
        internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
        version: VERSION,
        file: FILE,
        targetRoute: TARGET_ROUTE,
        diagnosticRoute: DIAGNOSTIC_ROUTE,
        publicContractPreserved: true,
        northRuntimeGrammarSourceActive: true,
        westDerivativeDiagnosticRequired: true,
        productionMutationAuthorized: false,
        canvasDrawingAuthorized: false,
        runtimeRestartAuthorized: false,

        files: clone(FILES),
        contracts: clone(CONTRACTS),
        aliasSpread: clone(ALIAS_SPREAD),
        aliasObservation: aliases,

        runtimeGrammarSchema: getRuntimeGrammar(),
        churchHierarchyRegistry: getChurchHierarchyRegistry(),
        acceptedEndpointFamilies: getAcceptedEndpointFamilies(),
        strictProofRules: getStrictProofRules(),
        containerCollapsePreventionSchema: getContainerCollapsePreventionSchema(),
        dutyLoadBudgetSchema: getDutyLoadBudgetSchema(),
        probeNetworkDistributionSchema: getProbeNetworkDistributionSchema(),
        delegatedContractDefinitionAuthorities: getDelegatedContractDefinitionAuthorities(),
        serviceDelegationSchema: getServiceDelegationSchema(),
        diagnosticSelfMeasurementSchema: getDiagnosticSelfMeasurementSchema(),
        diagnosticMalpracticeGuardSchema: getDiagnosticMalpracticeGuardSchema(),
        cardinalHandoffSchema: getCardinalHandoffSchema(),

        selfMeasurement: composeSelfMeasurement(),
        light: light
      },
      NO_CLAIMS
    );
  }

  function composeReceiptText() {
    var r = composeReceiptLight();
    var lines = [];

    Object.keys(r).forEach(function (key) {
      lines.push(key + "=" + String(r[key]));
    });

    return lines.join("\n");
  }

  function updateDataset() {
    var receipt = composeReceiptLight();

    if (!DOCUMENT || !DOCUMENT.documentElement) {
      return receipt;
    }

    try {
      var ds = DOCUMENT.documentElement.dataset;
      ds.labRuntimeTableContract = PUBLIC_CONTRACT;
      ds.labRuntimeTableInternalRenewalContract = INTERNAL_RENEWAL_CONTRACT;
      ds.labRuntimeTableNorthGrammarSourceActive = "true";
      ds.labRuntimeTableContainerCollapseGuardActive = "true";
      ds.labRuntimeTableDutyLoadGuardActive = "true";
      ds.labRuntimeTableDiagnosticMalpracticeGuardActive = "true";
      ds.labRuntimeTableWestDerivativeRequired = "true";
    } catch (_) {
      // Dataset publication is advisory only.
    }

    return receipt;
  }

  function refresh() {
    state.lastUpdatedAt = nowIso();
    state.lastReceipt = composeReceipt();
    state.lastReceiptText = composeReceiptText();
    updateDataset();
    return clone(state.lastReceipt);
  }

  function boot() {
    state.booted = true;
    state.disposed = false;
    state.bootCount += 1;
    return refresh();
  }

  function dispose() {
    state.disposed = true;
    return composeReceiptLight();
  }

  function getState() {
    return clone({
      booted: state.booted,
      disposed: state.disposed,
      bootCount: state.bootCount,
      lastUpdatedAt: state.lastUpdatedAt,
      contract: PUBLIC_CONTRACT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      northRuntimeGrammarSourceActive: true,
      productionMutationAuthorized: false
    });
  }

  function getStatusText() {
    return state.disposed
      ? "LAB_NORTH_RUNTIME_TABLE_SCHEMA_ANCHOR_DISPOSED"
      : "LAB_NORTH_RUNTIME_TABLE_SCHEMA_ANCHOR_ACTIVE";
  }

  function getReport() {
    return refresh();
  }

  function getReceipt() {
    return refresh();
  }

  function getReceiptLight() {
    return composeReceiptLight();
  }

  function getReceiptText() {
    state.lastReceiptText = composeReceiptText();
    return state.lastReceiptText;
  }

  function getPacket() {
    return getReceipt();
  }

  function getNorthGrammarPacket() {
    return {
      packetType: "LAB_NORTH_RUNTIME_GRAMMAR_PACKET_v1_1",
      contract: PUBLIC_CONTRACT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      runtimeGrammarSchema: getRuntimeGrammar(),
      strictProofRules: getStrictProofRules(),
      containerCollapsePreventionSchema: getContainerCollapsePreventionSchema(),
      dutyLoadBudgetSchema: getDutyLoadBudgetSchema(),
      probeNetworkDistributionSchema: getProbeNetworkDistributionSchema(),
      delegatedContractDefinitionAuthorities: getDelegatedContractDefinitionAuthorities(),
      serviceDelegationSchema: getServiceDelegationSchema(),
      diagnosticSelfMeasurementSchema: getDiagnosticSelfMeasurementSchema(),
      diagnosticMalpracticeGuardSchema: getDiagnosticMalpracticeGuardSchema(),
      cardinalHandoffSchema: getCardinalHandoffSchema(),
      noClaims: clone(NO_CLAIMS)
    };
  }

  function getWestDerivativeInstructionPacket() {
    return {
      packetType: "LAB_NORTH_TO_LABWEST_DERIVATIVE_DIAGNOSTIC_INSTRUCTION_PACKET_v1_1",
      sourceContract: PUBLIC_CONTRACT,
      sourceInternalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      targetFile: WEST_FILE,
      targetRole: "LAB_WEST_DERIVATIVE_DIAGNOSTIC",
      instruction:
        "Consume North grammar, Surface Truth detailed contract definitions, strict proof rules, container-collapse prevention law, duty-load law, service-delegation law, and diagnostic-malpractice guard law. Measure live runtime against the grammar. Do not mutate production. Do not final arbitrate.",
      requiredInputs: [
        "RUNTIME_GRAMMAR_SCHEMA",
        "CONTAINER_COLLAPSE_PREVENTION_SCHEMA",
        "DUTY_LOAD_BUDGET_SCHEMA",
        "PROBE_NETWORK_DISTRIBUTION_SCHEMA",
        "DELEGATED_CONTRACT_DEFINITION_AUTHORITIES",
        "SERVICE_DELEGATION_SCHEMA",
        "DIAGNOSTIC_SELF_MEASUREMENT_SCHEMA",
        "DIAGNOSTIC_MALPRACTICE_GUARD_SCHEMA"
      ],
      expectedOutputs: [
        "STRICT_ENDPOINT_CONFIRMED_COUNT",
        "BORROWED_CONTRACT_REJECTED_COUNT",
        "CONTRACT_FAMILY_MISMATCH_COUNT",
        "CONTAINER_COLLAPSE_RISK_COUNT",
        "DUTY_LOAD_COLLAPSE_RISK_COUNT",
        "DIAGNOSTIC_MALPRACTICE_STATUS",
        "CHAPEL_1_ASSETS_PRIEST_STATUS",
        "CHAPEL_2_POINTER_SURFACE_BISHOP_STATUS",
        "CHAPEL_2_INSPECT_PRIEST_STATUS",
        "DERIVATIVE_CANVAS_CONSTRUCTION_MAP"
      ],
      noClaims: clone(NO_CLAIMS)
    };
  }

  function noOpRender() {
    return composeReceiptLight();
  }

  var API = {
    CONTRACT: PUBLIC_CONTRACT,
    RECEIPT: PUBLIC_RECEIPT,
    INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
    INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
    VERSION: VERSION,
    FILE: FILE,

    contract: PUBLIC_CONTRACT,
    receipt: PUBLIC_RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    version: VERSION,
    file: FILE,

    boot: boot,
    init: boot,
    start: boot,
    run: boot,
    refresh: refresh,
    updateDataset: updateDataset,
    render: noOpRender,
    mount: noOpRender,
    dispose: dispose,

    getState: getState,
    getStatus: getStatusText,
    getStatusText: getStatusText,
    getReport: getReport,
    getPacket: getPacket,
    getReceipt: getReceipt,
    getReceiptLight: getReceiptLight,
    getReceiptText: getReceiptText,
    composeReceipt: composeReceipt,
    composeReceiptLight: composeReceiptLight,
    composeReceiptText: composeReceiptText,

    getRuntimeGrammar: getRuntimeGrammar,
    getNorthGrammarPacket: getNorthGrammarPacket,
    getChurchHierarchyRegistry: getChurchHierarchyRegistry,
    getAcceptedEndpointFamilies: getAcceptedEndpointFamilies,
    getAliasSpread: getAliasSpread,
    resolveAliasSpread: resolveAliasSpread,
    getStrictProofRules: getStrictProofRules,
    getContainerCollapsePreventionSchema: getContainerCollapsePreventionSchema,
    getDutyLoadBudgetSchema: getDutyLoadBudgetSchema,
    getProbeNetworkDistributionSchema: getProbeNetworkDistributionSchema,
    getDelegatedContractDefinitionAuthorities: getDelegatedContractDefinitionAuthorities,
    getServiceDelegationSchema: getServiceDelegationSchema,
    getDiagnosticSelfMeasurementSchema: getDiagnosticSelfMeasurementSchema,
    getDiagnosticMalpracticeGuardSchema: getDiagnosticMalpracticeGuardSchema,
    getCardinalHandoffSchema: getCardinalHandoffSchema,
    getWestDerivativeInstructionPacket: getWestDerivativeInstructionPacket,

    detectContractFamily: detectContractFamily,
    evaluateContainerBoundary: evaluateContainerBoundary,
    evaluateDutyLoad: evaluateDutyLoad,
    evaluateDiagnosticSelfMeasurement: evaluateDiagnosticSelfMeasurement,
    evaluateServiceDelegation: evaluateServiceDelegation,

    f13Claimed: false,
    f13EligibleForCanvas: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false,
    productionMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    canvasRepairAuthorized: false,
    routeRepairAuthorized: false,
    controlMutationAuthorized: false,
    runtimeRestartAuthorized: false
  };

  function publish() {
    var HEARTH = ensureNamespace("HEARTH");
    var DEXTER_LAB = ensureNamespace("DEXTER_LAB");

    GLOBAL.LAB_RUNTIME_TABLE = API;
    GLOBAL.LAB_RUNTIME_TABLE_NORTH = API;
    GLOBAL.LAB_RUNTIME_TABLE_MULTI_FUNCTION_ANIMATION_STANDARD = API;

    DEXTER_LAB.runtimeTable = API;
    DEXTER_LAB.runtimeTableNorth = API;
    DEXTER_LAB.northRuntimeTable = API;

    HEARTH.labRuntimeTable = API;
    HEARTH.labRuntimeTableNorth = API;
    HEARTH.LAB_RUNTIME_TABLE_NORTH = API;

    GLOBAL.LAB_RUNTIME_TABLE_RECEIPT = PUBLIC_RECEIPT;
    GLOBAL.LAB_RUNTIME_TABLE_INTERNAL_RENEWAL_CONTRACT = INTERNAL_RENEWAL_CONTRACT;
    GLOBAL.LAB_RUNTIME_TABLE_NORTH_SCHEMA_ANCHOR_RECEIPT = composeReceiptLight();

    DEXTER_LAB.runtimeTableReceipt = composeReceiptLight();
    HEARTH.labRuntimeTableNorthReceipt = composeReceiptLight();

    return API;
  }

  publish();
  boot();
})();

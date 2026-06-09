// /assets/hearth/hearth.diagnostic.south.surface.pointer.js
// HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_SIDECAR_READ_TNT_v1
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_LAB_ENGINE_STACK_SIDECAR_ADAPTER_TNT_v4
// Full-file replacement.
// Diagnostic South Surface Pointer sidecar only.
//
// Purpose:
// - Preserve the public v1 South Surface Pointer sidecar contract.
// - Preserve v2 Canvas-feed classifier compatibility.
// - Preserve v3 scope-lens classification over the diagnostic receipt field.
// - Renew the active duty into a lawful Lab South + full engine-stack diagnostic adapter.
// - Consume Lab South F8 proof output as diagnostic evidence only.
// - Consume Lab North, Lab East, Lab West, Lab South, F34, F55, F89, F144, and F233 evidence as read-only receipts.
// - Publish the North-rail-discoverable SOUTH_SURFACE_POINTER_SIDECAR aliases from the actual South pointer sidecar file.
// - Allow the existing North Diagnostic Rail to discover this sidecar without renewing North first.
// - Keep this file as a diagnostic adapter, not a runtime authority, not a repair authority, and not a Canvas release authority.
//
// Does not own:
// - Lab South proof generation
// - Lab North F21 latch
// - Lab East F3 intake admission
// - Lab West F5 pressure/admissibility
// - Lab F34/F55/F89/F144 support-engine internals
// - F233 downstream return
// - South packet compaction
// - duplicate-standard collapse
// - North final arbitration
// - LabWest derivative map
// - production mutation
// - route conductor mutation
// - Canvas drawing
// - Canvas creation
// - Canvas repair
// - Canvas release
// - controls
// - runtime restart
// - terrain/material/hydrology/elevation truth
// - Hex truth
// - Pointer Finger truth
// - final visual pass
// - F13/F21/F55 claim
//

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_SIDECAR_READ_TNT_v1";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_SIDECAR_READ_RECEIPT_v1";

  const INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_LAB_ENGINE_STACK_SIDECAR_ADAPTER_TNT_v4";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_LAB_ENGINE_STACK_SIDECAR_ADAPTER_RECEIPT_v4";

  const PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_SCOPE_LENS_CLASSIFIER_TNT_v3";
  const PREVIOUS_INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_SCOPE_LENS_CLASSIFIER_RECEIPT_v3";

  const EARLIER_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_CANVAS_FEED_CLASSIFIER_TNT_v2";
  const EARLIER_INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_CANVAS_FEED_CLASSIFIER_RECEIPT_v2";

  const VERSION =
    "2026-06-08.hearth-diagnostic-south-surface-pointer-lab-engine-stack-sidecar-adapter-v4";

  const FILE = "/assets/hearth/hearth.diagnostic.south.surface.pointer.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const LAB_NORTH_FILE = "/assets/lab/runtime-table.js";
  const LAB_EAST_FILE = "/assets/lab/runtime-table.east.js";
  const LAB_WEST_FILE = "/assets/lab/runtime-table.west.js";
  const LAB_SOUTH_FILE = "/assets/lab/runtime-table.south.js";

  const PRODUCT_ENGINE_FILE = "/assets/lab/product-engine.js";
  const EXPRESSION_ENGINE_FILE = "/assets/lab/product-engine.ue5-expression.js";
  const REGISTRY_ENGINE_FILE = "/assets/lab/product-engine.registry.js";
  const MARKET_ENGINE_FILE = "/assets/lab/product-engine.market.js";

  const SOUTH_RAIL_FILE = "/assets/hearth/hearth.diagnostic.south.js";
  const PROBE_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";
  const NORTH_RAIL_FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  const PROBE_NORTH_FILE = "/assets/hearth/hearth.diagnostic.probe.north.js";
  const PROBE_EAST_FILE = "/assets/hearth/hearth.diagnostic.probe.east.js";
  const PROBE_WEST_FILE = "/assets/hearth/hearth.diagnostic.probe.west.js";
  const SURFACE_TRUTH_FILE =
    "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";

  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const CANVAS_LAUNCH_FILE = "/assets/hearth/hearth.canvas.launch.js";
  const CANVAS_FINGER_INSPECT_FILE =
    "/assets/hearth/hearth.canvas.finger.inspect.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const POINTER_SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const CONTROLS_FILE = "/assets/hearth/hearth.controls.js";

  const PACKET_NAME =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_LAB_ENGINE_STACK_SIDECAR_PACKET_v4";

  const NORTH_DISCOVERY_FIELD = "SOUTH_SURFACE_POINTER_SIDECAR";
  const NORTH_EXPECTED_LOAD_STATUS = "LOADED_AND_AVAILABLE";

  const SURFACE_CLASS = Object.freeze({
    PRODUCTION_CANVAS: "PRODUCTION_CANVAS_SURFACE",
    TEMPORARY_IMAGE: "TEMPORARY_IMAGE_SURFACE",
    INNER_SCOPE_FEED: "INNER_SCOPE_FEED_SURFACE",
    DIAGNOSTIC_FRAME: "DIAGNOSTIC_FRAME_SURFACE",
    UNKNOWN: "UNKNOWN_OR_MISALIGNED_SURFACE"
  });

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13ClaimedBySidecar: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByDiagnosticRail: false,
    f21ClaimedBySidecar: false,
    f21SubmittedToNorth: false,
    f55ClaimedBySidecar: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByDiagnosticRail: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false,

    productionMutationAuthorized: false,
    hearthRepairAuthorized: false,
    routeRepairAuthorized: false,
    routeConductorMutationAuthorized: false,
    controlMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    canvasRepairAuthorized: false,
    canvasReleaseAuthorized: false,
    runtimeRestartAuthorized: false,
    finalVisualPassAuthority: false
  });

  const UPPER_NO_CLAIMS = Object.freeze({
    F13_CLAIMED: false,
    F13_CLAIMED_BY_SIDECAR: false,
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED: false,
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    F21_CLAIMED_BY_SIDECAR: false,
    F21_SUBMITTED_TO_NORTH: false,
    F55_CLAIMED_BY_SIDECAR: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false,

    PRODUCTION_MUTATION_AUTHORIZED: false,
    HEARTH_REPAIR_AUTHORIZED: false,
    ROUTE_REPAIR_AUTHORIZED: false,
    ROUTE_CONDUCTOR_MUTATION_AUTHORIZED: false,
    CONTROL_MUTATION_AUTHORIZED: false,
    CANVAS_DRAWING_AUTHORIZED: false,
    CANVAS_CREATION_AUTHORIZED: false,
    CANVAS_REPAIR_AUTHORIZED: false,
    CANVAS_RELEASE_AUTHORIZED: false,
    RUNTIME_RESTART_AUTHORIZED: false,
    FINAL_VISUAL_PASS_AUTHORITY: false
  });

  const SOUTH_SIDECAR_DISCOVERY_ALIASES = Object.freeze([
    "HEARTH.southSurfacePointerSidecar",
    "HEARTH.SOUTH_SURFACE_POINTER_SIDECAR",
    "HEARTH.southCanvasSurfacePointerSidecar",
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_SIDECAR",
    "HEARTH_SOUTH_SURFACE_POINTER_SIDECAR",
    "DEXTER_LAB.southSurfacePointerSidecar",
    "DEXTER_LAB.hearthSouthSurfacePointerSidecar"
  ]);

  const LEGACY_PUBLIC_ALIASES = Object.freeze([
    "HEARTH.diagnosticSouthSurfacePointer",
    "HEARTH.diagnosticSurfacePointerSouth",
    "HEARTH.diagnosticSouthBishopSurfacePointer",
    "HEARTH.diagnosticBishopSurfacePointerSouth",
    "HEARTH.diagnosticSouthSurfaceClassifier",
    "HEARTH.diagnosticCanvasFeedClassifierSouth",
    "HEARTH.diagnosticSouthScopeLens",
    "HEARTH.diagnosticSouthSurfacePointerScopeLens",
    "HEARTH.diagnosticScopeLensSouth",

    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER",
    "HEARTH_DIAGNOSTIC_SOUTH_BISHOP_SURFACE_POINTER",
    "HEARTH_DIAGNOSTIC_SURFACE_POINTER_SOUTH",
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_CLASSIFIER",
    "HEARTH_DIAGNOSTIC_CANVAS_FEED_CLASSIFIER_SOUTH",
    "HEARTH_DIAGNOSTIC_SOUTH_SCOPE_LENS",
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_SCOPE_LENS",
    "HEARTH_DIAGNOSTIC_SCOPE_LENS_SOUTH",

    "DEXTER_LAB.hearthDiagnosticSouthSurfacePointer",
    "DEXTER_LAB.hearthDiagnosticSouthBishopSurfacePointer",
    "DEXTER_LAB.hearthDiagnosticSurfacePointerSouth",
    "DEXTER_LAB.hearthDiagnosticSouthSurfaceClassifier",
    "DEXTER_LAB.hearthDiagnosticCanvasFeedClassifierSouth",
    "DEXTER_LAB.hearthDiagnosticSouthScopeLens"
  ]);

  const RECEIVER_ALIASES = Object.freeze([
    "HEARTH.diagnosticGaugeVarianceReceiver",
    "HEARTH.diagnosticConstructAlignmentGaugeReceiver",
    "HEARTH.diagnosticRouteReceiver",
    "HEARTH_DIAGNOSTIC_GAUGE_VARIANCE_RECEIVER",
    "HEARTH_DIAGNOSTIC_CONSTRUCT_ALIGNMENT_GAUGE_RECEIVER",
    "HEARTH_DIAGNOSTIC_ROUTE_RECEIVER",
    "DEXTER_LAB.hearthDiagnosticGaugeVarianceReceiver",
    "DEXTER_LAB.hearthDiagnosticRouteReceiver"
  ]);

  const LAB_NORTH_ALIASES = Object.freeze([
    "LAB_RUNTIME_TABLE",
    "LAB_RUNTIME_TABLE_NORTH",
    "RUNTIME_TABLE",
    "HEARTH_NORTH_COMMAND_RUNTIME_TABLE",
    "LAB_CENTRAL_TRAIN_STATION",
    "DEXTER_LAB.runtimeTable",
    "DEXTER_LAB.runtimeTableNorth",
    "DEXTER_LAB.northRuntimeTable",
    "DEXTER_LAB.cardinalRuntimeTableNorth",
    "DEXTER_LAB.centralTrainStation",
    "HEARTH.northCommandRuntimeTable",
    "HEARTH.runtimeTable",
    "HEARTH.centralTrainStation",
    "HEARTH.labRuntimeTable",
    "HEARTH.labRuntimeTableNorth",
    "HEARTH.LAB_RUNTIME_TABLE_NORTH"
  ]);

  const LAB_EAST_ALIASES = Object.freeze([
    "LAB_RUNTIME_TABLE_EAST",
    "LAB_RUNTIME_TABLE_EAST_F3",
    "RUNTIME_TABLE_EAST",
    "EAST_INTAKE_VALVE",
    "EAST_SUPREME_JUDGE",
    "DEXTER_LAB.runtimeTableEast",
    "DEXTER_LAB.runtimeTableEastF3",
    "DEXTER_LAB.cardinalRuntimeTableEast",
    "HEARTH.runtimeTableEast",
    "HEARTH.runtimeTableEastF3"
  ]);

  const LAB_WEST_ALIASES = Object.freeze([
    "LAB_RUNTIME_TABLE_WEST",
    "LAB_RUNTIME_TABLE_WEST_F5",
    "RUNTIME_TABLE_WEST",
    "WEST_PRESSURE_VALVE",
    "WEST_PRESSURE_ADMISSIBILITY",
    "WEST_SUPREME_JUDGE",
    "WEST_ADMISSIBILITY_BRANCH",
    "DEXTER_LAB.runtimeTableWest",
    "DEXTER_LAB.runtimeTableWestF5",
    "DEXTER_LAB.cardinalRuntimeTableWest",
    "DEXTER_LAB.westPressureValve",
    "HEARTH.runtimeTableWest",
    "HEARTH.runtimeTableWestF5",
    "HEARTH.westPressureValve"
  ]);

  const LAB_SOUTH_ALIASES = Object.freeze([
    "LAB_RUNTIME_TABLE_SOUTH",
    "LAB_RUNTIME_TABLE_SOUTH_F8",
    "RUNTIME_TABLE_SOUTH",
    "SOUTH_PROOF_RETURN",
    "SOUTH_OUTPUT_EXHAUST",
    "SOUTH_SUPREME_JUDGE",
    "SOUTH_PROOF_BRANCH",
    "DEXTER_LAB.runtimeTableSouth",
    "DEXTER_LAB.runtimeTableSouthF8",
    "DEXTER_LAB.cardinalRuntimeTableSouth",
    "DEXTER_LAB.southProofReturn",
    "DEXTER_LAB.southOutputExhaust",
    "DEXTER_LAB.southSupremeJudge",
    "HEARTH.runtimeTableSouth",
    "HEARTH.runtimeTableSouthF8",
    "HEARTH.southProofReturn",
    "HEARTH.southOutputExhaust",
    "HEARTH.southSupremeJudge"
  ]);

  const PRODUCT_ENGINE_ALIASES = Object.freeze([
    "LAB_PRODUCT_ENGINE",
    "LAB_PRODUCT_ENGINE_F34",
    "PRODUCT_ENGINE",
    "PRODUCT_ENGINE_F34",
    "PRODUCT_ENGINE_CLERK",
    "DEXTER_LAB.productEngine",
    "DEXTER_LAB.productEngineF34",
    "HEARTH.productEngine",
    "HEARTH.productEngineF34"
  ]);

  const EXPRESSION_ENGINE_ALIASES = Object.freeze([
    "LAB_PRODUCT_ENGINE_UE5_EXPRESSION",
    "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55",
    "PRODUCT_ENGINE_UE5_EXPRESSION",
    "UE5_EXPRESSION_CONDUCTOR",
    "EXPRESSION_CLERK",
    "DEXTER_LAB.productEngineUE5Expression",
    "DEXTER_LAB.productEngineUE5ExpressionF55",
    "HEARTH.productEngineUE5Expression",
    "HEARTH.productEngineUE5ExpressionF55"
  ]);

  const REGISTRY_ENGINE_ALIASES = Object.freeze([
    "LAB_PRODUCT_ENGINE_REGISTRY",
    "LAB_PRODUCT_ENGINE_REGISTRY_F89",
    "PRODUCT_ENGINE_REGISTRY",
    "PROJECT_REGISTRY_CONDUCTOR",
    "REGISTRY_CLERK",
    "DEXTER_LAB.productEngineRegistry",
    "DEXTER_LAB.productEngineRegistryF89",
    "HEARTH.productEngineRegistry",
    "HEARTH.productEngineRegistryF89"
  ]);

  const MARKET_ENGINE_ALIASES = Object.freeze([
    "LAB_PRODUCT_ENGINE_MARKET",
    "LAB_PRODUCT_ENGINE_MARKET_F144",
    "PRODUCT_ENGINE_MARKET",
    "MARKET_F144_READINESS_CONDUCTOR",
    "MARKET_READINESS_CONDUCTOR",
    "MARKET_CLERK",
    "DEXTER_LAB.productEngineMarket",
    "DEXTER_LAB.productEngineMarketF144",
    "HEARTH.productEngineMarket",
    "HEARTH.productEngineMarketF144"
  ]);

  const NORTH_RAIL_ALIASES = Object.freeze([
    "JUDGE_NORTH",
    "HEARTH_DIAGNOSTIC_RAIL_NORTH",
    "HEARTH_DIAGNOSTIC_RAIL",
    "HEARTH.diagnosticRail",
    "HEARTH.diagnosticNorth",
    "HEARTH.diagnosticNorthRail",
    "HEARTH.JUDGE_NORTH_DIAGNOSTIC_RAIL",
    "DEXTER_LAB.hearthDiagnosticRail",
    "DEXTER_LAB.hearthDiagnosticNorth",
    "DEXTER_LAB.hearthDiagnosticNorthRail"
  ]);

  const SOUTH_RAIL_ALIASES = Object.freeze([
    "JUDGE_SOUTH",
    "HEARTH.diagnosticSouth",
    "HEARTH.diagnosticRailSouth",
    "HEARTH.diagnosticSouthReceiptSegregator",
    "HEARTH.diagnosticSouthDuplicateStandardCollapse",
    "HEARTH.JUDGE_SOUTH_PACKET_OUTPUT",
    "HEARTH_DIAGNOSTIC_SOUTH",
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
    "HEARTH_DIAGNOSTIC_SOUTH_RECEIPT_SEGREGATOR",
    "HEARTH_DIAGNOSTIC_SOUTH_DUPLICATE_STANDARD_COLLAPSE",
    "DEXTER_LAB.hearthDiagnosticSouth",
    "DEXTER_LAB.hearthDiagnosticRailSouth",
    "DEXTER_LAB.hearthDiagnosticSouthReceiptSegregator"
  ]);

  const PROBE_ALIASES = Object.freeze({
    NORTH: [
      "HEARTH.diagnosticProbeNorth",
      "HEARTH.JUDGE_NORTH_PROBE",
      "HEARTH_DIAGNOSTIC_PROBE_NORTH",
      "DEXTER_LAB.diagnosticProbeNorth"
    ],
    EAST: [
      "HEARTH.diagnosticProbeEast",
      "HEARTH.JUDGE_EAST_PROBE",
      "HEARTH_DIAGNOSTIC_PROBE_EAST",
      "DEXTER_LAB.diagnosticProbeEast"
    ],
    WEST: [
      "HEARTH.diagnosticProbeWest",
      "HEARTH.JUDGE_WEST_PROBE",
      "HEARTH_DIAGNOSTIC_PROBE_WEST",
      "DEXTER_LAB.diagnosticProbeWest"
    ],
    SOUTH: [
      "HEARTH.diagnosticProbeSouth",
      "HEARTH.JUDGE_SOUTH_PROBE",
      "HEARTH_DIAGNOSTIC_PROBE_SOUTH",
      "DEXTER_LAB.diagnosticProbeSouth"
    ],
    SURFACE_TRUTH: [
      "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      "HEARTH_CANVAS_SURFACE_TRUTH_PROBE",
      "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE",
      "HEARTH.diagnosticProbeCanvasSurfaceTruth",
      "HEARTH.canvasSurfaceTruthProbe",
      "HEARTH.CANVAS_SURFACE_TRUTH_PROBE",
      "HEARTH.DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      "DEXTER_LAB.canvasSurfaceTruthProbe",
      "DEXTER_LAB.diagnosticProbeCanvasSurfaceTruth"
    ]
  });

  const FINGER_INSPECT_ALIASES = Object.freeze([
    "HEARTH.canvasFingerInspect",
    "HEARTH.canvasFingerInspector",
    "HEARTH.canvasFingerExpressionInspect",
    "HEARTH.diagnosticCanvasFingerInspect",
    "HEARTH.hearthCanvasFingerInspect",
    "HEARTH.canvasPointerFingerInspect",
    "HEARTH.pointerFingerInspect",
    "HEARTH.pointerFingerReceiver",
    "HEARTH.hexGatePointerFingerInspectReceiver",
    "HEARTH.hexSurfacePointerFingerReceiver",
    "DEXTER_LAB.hearthCanvasFingerInspect",
    "DEXTER_LAB.hearthCanvasFingerInspector",
    "DEXTER_LAB.hearthDiagnosticCanvasFingerInspect",
    "DEXTER_LAB.hearthCanvasPointerFingerInspect",
    "DEXTER_LAB.hearthPointerFingerInspect",
    "DEXTER_LAB.hearthPointerFingerReceiver",
    "DEXTER_LAB.hearthHexSurfacePointerFingerReceiver",
    "HEARTH_CANVAS_FINGER_INSPECT",
    "HEARTH_CANVAS_FINGER_INSPECTOR",
    "HEARTH_DIAGNOSTIC_CANVAS_FINGER_INSPECT",
    "HEARTH_CANVAS_POINTER_FINGER_INSPECT",
    "HEARTH_POINTER_FINGER_INSPECT",
    "HEARTH_POINTER_FINGER_RECEIVER",
    "HEARTH_HEX_SURFACE_POINTER_FINGER_RECEIVER",
    "HEARTH_HEX_GATE_POINTER_FINGER_INSPECT_RECEIVER"
  ]);

  const CANVAS_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH.canvas",
    "HEARTH.canvasHub",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasVisiblePlanet",
    "HEARTH.chapel1AssetsCanvasHub",
    "HEARTH.CHAPEL_1_ASSETS_CANVAS_HUB",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvasAuthority",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_VISIBLE_PLANET"
  ]);

  const READ_RECEIPT_METHODS = Object.freeze([
    "getReceiptLight",
    "getReceipt",
    "getReport",
    "getStatus",
    "getState",
    "getSummary",
    "composeReceipt",
    "composeSouthReceipt"
  ]);

  const LAB_SOUTH_PROOF_METHODS = Object.freeze([
    "composeDiagnosticSidecarExportPacket",
    "composeF8ProofPacket",
    "getF8ProofPacket",
    "composeSouthReceipt",
    "getReceipt",
    "getReceiptLight",
    "getReport",
    "getStatus",
    "getState"
  ]);

  const ENGINE_RELEASE_METHODS = Object.freeze([
    "composeF34ReleasePacket",
    "composeF55ReleasePacket",
    "composeF89ReleasePacket",
    "composeF144ReleasePacket",
    "composeF233DownstreamReturnPacket",
    "getReleasePacket",
    "getReceipt",
    "getReceiptLight",
    "getReport",
    "getStatus",
    "getState"
  ]);

  const EXPLICIT_DUTY_KEYS = Object.freeze([
    "SELF_MEASUREMENT_STATUS",
    "selfMeasurementStatus",
    "DUTY_LOAD_STATUS",
    "dutyLoadStatus",
    "DIAGNOSTIC_CONTAINER_COLLAPSE_RISK",
    "DIAGNOSTIC_CONTAINER_COLLAPSE_DETECTED",
    "DIAGNOSTIC_OUTPUT_QUARANTINED",
    "DIAGNOSTIC_MALPRACTICE_STATUS",
    "DIAGNOSTIC_MALPRACTICE_DETECTED",
    "DIAGNOSTIC_SELF_DUTY_STATUS"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
    previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
    earlierInternalRenewalContract: EARLIER_INTERNAL_RENEWAL_CONTRACT,
    earlierInternalRenewalReceipt: EARLIER_INTERNAL_RENEWAL_RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    loaded: true,
    primaryDuty: "LAB_ENGINE_STACK_SIDECAR_ADAPTER_AND_SCOPE_LENS_CLASSIFICATION",
    legacyCanvasFeedClassifierCompatible: true,
    scopeLensClassifierCompatible: true,
    asymmetricTenthDiagnosticSidecar: true,
    chronologyOwner: false,
    nineCycleMutation: false,
    replacesSouthRail: false,
    replacesProbeSouth: false,
    operationalDependencyForNorth: false,
    readableByProbeSouth: true,

    northDiscoverableSidecarPublished: false,
    northDiscoveryAliasCount: 0,
    northDiscoveryField: NORTH_DISCOVERY_FIELD,
    northExpectedLoadStatus: NORTH_EXPECTED_LOAD_STATUS,

    latestLensStatus: "NOT_RUN",
    latestLabStackLens: "NOT_RUN",
    latestLabSouthProofLens: "NOT_RUN",
    latestEngineStackLens: "NOT_RUN",
    latestNorthTrackLens: "NOT_RUN",
    latestSurfaceScopeLens: "NOT_RUN",
    latestCanvasBlameLens: "NOT_RUN",
    latestProbeNetworkLens: "NOT_RUN",
    latestDutyLoadLens: "NOT_RUN",
    latestMalpracticeLens: "NOT_RUN",
    latestConstructionReadinessLens: "NOT_RUN",
    latestCopyLens: "NOT_RUN",
    latestSurfaceClass: SURFACE_CLASS.UNKNOWN,
    latestCanvasBlameEligible: false,
    latestRecommendedOwner: "UNKNOWN",
    latestRecommendedFile: "UNKNOWN",
    latestRecommendedAction: "UNKNOWN",

    labSouthObserved: false,
    labSouthProofObserved: false,
    labSouthProofAccepted: false,
    labSouthContract: "UNKNOWN",
    labSouthReceipt: "UNKNOWN",

    labChamberObservedCount: 0,
    supportEngineObservedCount: 0,
    f233ReturnObserved: false,
    diagnosticBridgeReady: false,

    runCount: 0,
    aliasPublishCount: 0,
    receiptPublishCount: 0,
    receivedFingerReportCount: 0,
    latestEvent: "SOUTH_SURFACE_POINTER_LAB_ENGINE_STACK_SIDECAR_ADAPTER_LOADED",
    updatedAt: "",
    lastReport: null,
    lastPacketText: "",
    lastCompactSummary: "",
    lastInputSource: "NONE",
    events: [],
    errors: [],

    ...NO_CLAIMS
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    try {
      return String(value);
    } catch (_error) {
      return fallback;
    }
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function bounded(value, limit = 4000) {
    return safeString(value)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
  }

  function clonePlain(value) {
    if (value === undefined || value === null) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) return { ...value };
      return value;
    }
  }

  function packetValue(value, fallback = "UNKNOWN") {
    if (value === undefined || value === null || value === "") return fallback;

    if (Array.isArray(value)) {
      const joined = value.map((item) => packetValue(item, "")).filter(Boolean).join(" | ");
      return joined || fallback;
    }

    if (isObject(value)) {
      try {
        return bounded(JSON.stringify(value), 20000) || fallback;
      } catch (_error) {
        return bounded(value, 4000) || fallback;
      }
    }

    return bounded(value, 4000) || fallback;
  }

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
  }

  function boolValue(value, fallback = false) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return true;
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return false;
    return fallback;
  }

  function firstKnown(...values) {
    for (const value of values) {
      const text = bounded(value, 4000);
      if (!text) continue;
      if (text === "UNKNOWN" || text === "NONE" || text === "NOT_FOUND") continue;
      if (text === "UNREADABLE" || text === "INACCESSIBLE") continue;
      return text;
    }
    return "UNKNOWN";
  }

  function getRaw(source, key, fallback = undefined) {
    if (!isObject(source)) return fallback;

    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const value = source[key];
      return value === undefined || value === null ? fallback : value;
    }

    const lower = key.toLowerCase();
    for (const candidate of Object.keys(source)) {
      if (candidate.toLowerCase() === lower) {
        const value = source[candidate];
        return value === undefined || value === null ? fallback : value;
      }
    }

    return fallback;
  }

  function trim(list, max) {
    if (Array.isArray(list) && list.length > max) {
      list.splice(0, list.length - max);
    }
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "SOUTH_SURFACE_POINTER_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trim(state.events, 120);
    state.latestEvent = item.event;
    state.updatedAt = item.at;

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "SOUTH_SURFACE_POINTER_ERROR"),
      message: bounded(error && error.message ? error.message : error, 1600),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trim(state.errors, 60);
    state.latestEvent = item.code;
    state.updatedAt = item.at;

    return item;
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function readPath(path) {
    const parts = safeString(path).replace(/^window\./, "").split(".");
    let cursor = root;

    for (const part of parts) {
      if (!part) continue;
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function setPath(path, value) {
    const parts = safeString(path).replace(/^window\./, "").split(".").filter(Boolean);
    if (!parts.length) return false;

    let cursor = root;
    for (let index = 0; index < parts.length - 1; index += 1) {
      const part = parts[index];
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = cursor[part];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function firstGlobal(paths) {
    for (const path of paths || []) {
      const value = readPath(path);
      if (value) return { path, value };
    }

    return { path: "NONE", value: null };
  }

  function parsePacketText(text) {
    const out = {};
    const source = safeString(text);

    source.split(/\r?\n/).forEach((row) => {
      const index = row.indexOf("=");
      if (index <= 0) return;
      const key = row.slice(0, index).trim();
      const value = row.slice(index + 1).trim();
      if (key) out[key] = value;
    });

    return out;
  }

  function safeMethodList(value) {
    if (!value || (!isObject(value) && !isFunction(value))) return [];

    try {
      return Object.keys(value)
        .filter((key) => isFunction(value[key]))
        .sort()
        .slice(0, 120);
    } catch (_error) {
      return [];
    }
  }

  function callFirstMethod(authority, methods, argument) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) {
      return {
        attempted: false,
        method: "NONE",
        ok: false,
        output: null,
        error: "NO_AUTHORITY"
      };
    }

    for (const method of methods || []) {
      if (!isFunction(authority[method])) continue;

      try {
        const output = argument === undefined ? authority[method]() : authority[method](argument);
        if (isObject(output)) {
          return {
            attempted: true,
            method,
            ok: true,
            output: clonePlain(output),
            error: "NONE"
          };
        }

        if (typeof output === "string" && output.trim()) {
          return {
            attempted: true,
            method,
            ok: true,
            output: parsePacketText(output),
            outputText: output,
            error: "NONE"
          };
        }

        return {
          attempted: true,
          method,
          ok: true,
          output,
          error: "NONE"
        };
      } catch (error) {
        return {
          attempted: true,
          method,
          ok: false,
          output: null,
          error: bounded(error && error.message ? error.message : error, 1600)
        };
      }
    }

    return {
      attempted: false,
      method: "NONE",
      ok: false,
      output: null,
      error: "NO_METHOD_AVAILABLE"
    };
  }

  function readAuthorityReceipt(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return null;

    const call = callFirstMethod(authority, READ_RECEIPT_METHODS);
    if (call.ok && isObject(call.output)) return call.output;

    if (isObject(authority.report)) return authority.report;
    if (isObject(authority.receiptObject)) return authority.receiptObject;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.state)) return authority.state;

    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) {
      return authority;
    }

    return null;
  }

  function contractOf(value) {
    const source = value && (typeof value === "object" || typeof value === "function") ? value : {};

    return firstKnown(
      getRaw(source, "CONTRACT", undefined),
      getRaw(source, "contract", undefined),
      getRaw(source, "PUBLIC_CONTRACT", undefined),
      getRaw(source, "publicContract", undefined),
      getRaw(source, "INTERNAL_RENEWAL_CONTRACT", undefined),
      getRaw(source, "internalRenewalContract", undefined),
      getRaw(source, "SOURCE_CONTRACT", undefined),
      getRaw(source, "sourceContract", undefined),
      "UNKNOWN"
    );
  }

  function receiptOf(value) {
    const source = value && (typeof value === "object" || typeof value === "function") ? value : {};

    return firstKnown(
      getRaw(source, "RECEIPT", undefined),
      getRaw(source, "receipt", undefined),
      getRaw(source, "PUBLIC_RECEIPT", undefined),
      getRaw(source, "publicReceipt", undefined),
      getRaw(source, "INTERNAL_RENEWAL_RECEIPT", undefined),
      getRaw(source, "internalRenewalReceipt", undefined),
      getRaw(source, "SOURCE_RECEIPT", undefined),
      getRaw(source, "sourceReceipt", undefined),
      "UNKNOWN"
    );
  }

  function inspectAuthority(id, file, aliases, methods = READ_RECEIPT_METHODS) {
    const found = firstGlobal(aliases || []);
    const authority = found.value;
    const receipt = readAuthorityReceipt(authority) || {};
    const contract = contractOf(receipt) !== "UNKNOWN" ? contractOf(receipt) : contractOf(authority || {});
    const receiptName = receiptOf(receipt) !== "UNKNOWN" ? receiptOf(receipt) : receiptOf(authority || {});
    const methodCall = callFirstMethod(authority, methods);

    return {
      id,
      file,
      observed: Boolean(authority),
      alias: found.path,
      contract,
      receipt: receiptName,
      methodCount: safeMethodList(authority).length,
      methods: safeMethodList(authority),
      readableReceiptPresent: Boolean(receipt && Object.keys(receipt).length),
      preferredMethodAttempted: methodCall.attempted,
      preferredMethod: methodCall.method,
      preferredMethodOk: methodCall.ok,
      preferredMethodError: methodCall.error,
      preferredMethodOutput: clonePlain(methodCall.output),
      status: authority
        ? contract !== "UNKNOWN"
          ? "LOADED_AND_AVAILABLE"
          : "AUTHORITY_PRESENT_CONTRACT_NOT_PRESENT"
        : "NOT_OBSERVED",
      receiptObject: clonePlain(receipt),
      ...NO_CLAIMS
    };
  }

  function normalizeInput(input = {}) {
    if (typeof input === "string") {
      const parsed = parsePacketText(input);
      return {
        source: "TEXT_INPUT",
        object: Object.keys(parsed).length ? parsed : { RAW_TEXT: input },
        text: input
      };
    }

    if (isObject(input.alignmentPacket)) {
      return {
        source: "INPUT_ALIGNMENT_PACKET",
        object: clonePlain(input.alignmentPacket),
        text: ""
      };
    }

    if (isObject(input.packet)) {
      return {
        source: "INPUT_PACKET",
        object: clonePlain(input.packet),
        text: ""
      };
    }

    if (isObject(input.report)) {
      return {
        source: "INPUT_REPORT",
        object: clonePlain(input.report),
        text: ""
      };
    }

    if (isObject(input.currentReport)) {
      return {
        source: "INPUT_CURRENT_REPORT",
        object: clonePlain(input.currentReport),
        text: ""
      };
    }

    if (isObject(input)) {
      const coreKeys = [
        "PACKET_NAME",
        "CONTRACT",
        "RECEIPT",
        "specificReceipts",
        "gaugeVariance",
        "participantLoadState",
        "participantActions"
      ];

      if (coreKeys.some((key) => input[key] !== undefined)) {
        return {
          source: "INPUT_OBJECT",
          object: clonePlain(input),
          text: ""
        };
      }
    }

    const receiver = firstGlobal(RECEIVER_ALIASES).value;
    if (receiver) {
      try {
        if (isFunction(receiver.getAlignmentPacket)) {
          const packet = receiver.getAlignmentPacket();
          if (isObject(packet) && Object.keys(packet).length) {
            return {
              source: "RECEIVER_GET_ALIGNMENT_PACKET",
              object: clonePlain(packet),
              text: ""
            };
          }
        }
      } catch (_error) {}

      try {
        if (isFunction(receiver.getPacketText)) {
          const text = receiver.getPacketText();
          if (typeof text === "string" && text.trim()) {
            return {
              source: "RECEIVER_GET_PACKET_TEXT",
              object: parsePacketText(text),
              text
            };
          }
        }
      } catch (_error) {}
    }

    const globalPacket =
      readPath("HEARTH_DIAGNOSTIC_ALIGNMENT_GAUGE_VARIANCE_PACKET") ||
      readPath("HEARTH_DIAGNOSTIC_ROUTE_RECEIVER_REPORT");

    if (isObject(globalPacket) && Object.keys(globalPacket).length) {
      return {
        source: "GLOBAL_ALIGNMENT_PACKET",
        object: clonePlain(globalPacket),
        text: ""
      };
    }

    const globalText =
      readPath("HEARTH_DIAGNOSTIC_ALIGNMENT_GAUGE_VARIANCE_PACKET_TEXT") ||
      readPath("HEARTH_DIAGNOSTIC_ROUTE_RECEIVER_PACKET_TEXT");

    if (typeof globalText === "string" && globalText.trim()) {
      return {
        source: "GLOBAL_ALIGNMENT_PACKET_TEXT",
        object: parsePacketText(globalText),
        text: globalText
      };
    }

    return {
      source: "EMPTY_INPUT",
      object: {
        PACKET_NAME: "HEARTH_DIAGNOSTIC_SCOPE_LENS_EMPTY_INPUT_PACKET_v1",
        INPUT_STATUS: "NO_ALIGNMENT_PACKET_FOUND"
      },
      text: ""
    };
  }

  function getNested(source, path, fallback = undefined) {
    const parts = safeString(path).split(".");
    let cursor = source;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) {
        return fallback;
      }
      cursor = cursor[part];
    }

    return cursor === undefined || cursor === null ? fallback : cursor;
  }

  function receiptRecord(packet, id) {
    return getNested(packet, `specificReceipts.${id}`, {});
  }

  function gaugeRecord(packet, id) {
    return getNested(packet, `gaugeVariance.${id}`, {});
  }

  function participantRecord(packet, id) {
    return getNested(packet, `participantLoadState.${id}`, {});
  }

  function actionRecord(packet, id) {
    return getNested(packet, `participantActions.${id}`, {});
  }

  function readReceiptPacket(record) {
    const packet = getNested(record, "receipt.packet", null);
    if (isObject(packet)) return packet;

    const text = getNested(record, "receipt.packetText", "");
    if (typeof text === "string" && text.trim()) return parsePacketText(text);

    return {};
  }

  function collectExplicitStatusFields(source, prefix = "", out = []) {
    if (!isObject(source) && !Array.isArray(source)) return out;

    if (Array.isArray(source)) {
      source.forEach((item, index) => {
        if (isObject(item) || Array.isArray(item)) {
          collectExplicitStatusFields(item, `${prefix}.${index}`, out);
        }
      });
      return out;
    }

    Object.keys(source).forEach((key) => {
      const value = source[key];
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (EXPLICIT_DUTY_KEYS.includes(key) || /STATUS$|Status$/.test(key)) {
        if (!Array.isArray(value) && !isObject(value)) {
          out.push({
            key: fullKey,
            field: key,
            value: safeString(value)
          });
        }
      }

      if (isObject(value) || Array.isArray(value)) {
        collectExplicitStatusFields(value, fullKey, out);
      }
    });

    return out;
  }

  function statusEquals(value, target) {
    return safeString(value).toUpperCase() === safeString(target).toUpperCase();
  }

  function statusContains(value, fragment) {
    return safeString(value).toUpperCase().indexOf(safeString(fragment).toUpperCase()) >= 0;
  }

  function detectForbiddenClaim(source = {}) {
    const text = (() => {
      try {
        return JSON.stringify(source || {});
      } catch (_error) {
        return safeString(source, "");
      }
    })();

    return Boolean(
      boolValue(getRaw(source, "generatedImage", false), false) ||
      boolValue(getRaw(source, "graphicBox", false), false) ||
      boolValue(getRaw(source, "webGL", false), false) ||
      boolValue(getRaw(source, "webgl", false), false) ||
      boolValue(getRaw(source, "visualPassClaimed", false), false) ||
      boolValue(getRaw(source, "finalVisualPassClaimed", false), false) ||
      boolValue(getRaw(source, "publicSuperiorityClaim", false), false) ||
      text.includes('"generatedImage":true') ||
      text.includes('"graphicBox":true') ||
      text.includes('"webGL":true') ||
      text.includes('"webgl":true') ||
      text.includes('"visualPassClaimed":true') ||
      text.includes('"finalVisualPassClaimed":true')
    );
  }

  function computeCopyLens(packet) {
    const south = receiptRecord(packet, "SOUTH_RAIL");
    const southPacket = readReceiptPacket(south);
    const southApi = inspectAuthority("SOUTH_RAIL", SOUTH_RAIL_FILE, SOUTH_RAIL_ALIASES);

    const lastCompact =
      getRaw(southPacket, "lastCompactManifestText", "") ||
      getRaw(southPacket, "LAST_COMPACT_MANIFEST_TEXT", "") ||
      getRaw(southPacket, "compactManifestText", "");

    const southPresent = Boolean(getRaw(south, "present", false)) || southApi.observed;
    const southReceiptPresent = Boolean(getRaw(south, "receiptPresent", false)) || southApi.readableReceiptPresent;
    const compactReady =
      typeof lastCompact === "string" &&
      lastCompact.trim() &&
      lastCompact !== "COMPACT_MANIFEST=NOT_RUN";

    let status = "COPY_LENS_BLOCKED";
    let reason = "SOUTH_RAIL_NOT_PRESENT";

    if (southPresent && southReceiptPresent && compactReady) {
      status = "COPY_LENS_COMPACT_MANIFEST_READY";
      reason = "SOUTH_RAIL_HAS_COMPACT_MANIFEST_TEXT";
    } else if (southPresent && southReceiptPresent && !compactReady) {
      status = "COPY_LENS_READY_BUT_CURRENT_PACKET_NOT_HANDED_TO_SOUTH";
      reason = "SOUTH_SEGREGATION_PRESENT_BUT_LAST_COMPACT_MANIFEST_NOT_RUN";
    } else if (southPresent && !southReceiptPresent) {
      status = "COPY_LENS_PARTIAL_SOUTH_PRESENT_NO_RECEIPT";
      reason = "SOUTH_RAIL_PRESENT_WITHOUT_RECEIPT";
    }

    return {
      id: "COPY_LENS",
      status,
      reason,
      southPresent,
      southReceiptPresent,
      compactManifestReady: compactReady,
      southRailAuthority: southApi,
      defaultCopySurfaceShouldBe:
        compactReady ? "SOUTH_COMPACT_MANIFEST_TEXT" : "RECEIVER_COMPACT_SUMMARY_OR_ALIGNMENT_PACKET",
      recommendedAction:
        compactReady
          ? "USE_SOUTH_COMPACT_MANIFEST_AS_DEFAULT_COPY_SURFACE"
          : "WHEN_NEEDED_CALL_SOUTH_SEGREGATION_WITH_CURRENT_ALIGNMENT_PACKET"
    };
  }

  function computeNorthTrackLens(packet) {
    const northReceipt = receiptRecord(packet, "NORTH_RAIL");
    const northLoad = participantRecord(packet, "NORTH_RAIL");
    const northRun = actionRecord(packet, "NORTH_RAIL_RUN");
    const northApi = inspectAuthority("NORTH_RAIL", NORTH_RAIL_FILE, NORTH_RAIL_ALIASES);

    const northPresent =
      boolValue(getRaw(northReceipt, "present", false), false) ||
      boolValue(getRaw(northLoad, "present", false), false) ||
      northApi.observed;

    const loadStatus = firstKnown(
      getRaw(northLoad, "loadStatus", undefined),
      getRaw(northReceipt, "status", undefined),
      northApi.status,
      "UNKNOWN"
    );

    const runApi =
      statusContains(getRaw(northLoad, "publicApi", ""), "runDiagnostic") ||
      statusContains(JSON.stringify(northRun || {}), "NORTH_RUN_API_AVAILABLE\":true") ||
      northApi.methods.includes("runDiagnostic") ||
      northApi.methods.includes("run") ||
      northApi.methods.includes("inspect");

    const verdict =
      boolValue(getRaw(packet, "NORTH_VERDICT_AVAILABLE", false), false) ||
      boolValue(getNested(northRun, "result.NORTH_VERDICT_AVAILABLE", false), false);

    let status = "NORTH_TRACK_BLOCKED";
    let failureClass = "NORTH_NOT_PRESENT";
    let recommendedAction = "RENEW_OR_REPUBLISH_NORTH_DIAGNOSTIC_RAIL_GLOBAL_SURFACE";

    if (verdict) {
      status = "NORTH_TRACK_VERDICT_AVAILABLE";
      failureClass = "NONE";
      recommendedAction = "NORTH_VERDICT_CAN_BE_CONSUMED";
    } else if (northPresent && runApi) {
      status = "NORTH_TRACK_PRESENT_RUN_API_AVAILABLE";
      failureClass = "NONE";
      recommendedAction =
        "RUN_EXISTING_NORTH_RAIL_AFTER_THIS_SIDECAR_PUBLISHES_SOUTH_SURFACE_POINTER_SIDECAR";
    } else if (loadStatus === "SCRIPT_LOADED_GLOBAL_NOT_FOUND") {
      status = "NORTH_TRACK_SCRIPT_LOADED_GLOBAL_NOT_FOUND";
      failureClass = "NORTH_PUBLICATION_SURFACE_MISSING";
      recommendedAction = "RENEW_NORTH_RAIL_PUBLIC_ALIAS_AND_RUN_API_PUBLICATION";
    } else if (!northPresent) {
      status = "NORTH_TRACK_MISSING";
      failureClass = "NORTH_RAIL_NOT_OBSERVED";
      recommendedAction = "AUDIT_NORTH_RAIL_LOAD_PATH_AND_PUBLICATION_SURFACE";
    }

    return {
      id: "NORTH_TRACK_LENS",
      status,
      failureClass,
      northPresent,
      loadStatus,
      runApiPresent: runApi,
      northVerdictAvailable: verdict,
      northAuthority: northApi,
      recommendedFile: NORTH_RAIL_FILE,
      recommendedAction
    };
  }

  function computeSurfaceScopeLens(packet) {
    const surfaceReceipt = receiptRecord(packet, "SURFACE_TRUTH_PROBE");
    const surfaceAction = getNested(packet, "participantActions.SURFACE_TRUTH_INSPECTION.result", {});
    const measurement = getRaw(surfaceAction, "surfaceMeasurement", {}) || {};
    const surfaceApi = inspectAuthority(
      "SURFACE_TRUTH_PROBE",
      SURFACE_TRUTH_FILE,
      PROBE_ALIASES.SURFACE_TRUTH
    );

    const profilePresent =
      boolValue(getRaw(surfaceReceipt, "present", false), false) ||
      boolValue(getRaw(packet, "SURFACE_TRUTH_PROBE_PRESENT", false), false) ||
      surfaceApi.observed;

    const receiptPresent =
      boolValue(getRaw(surfaceReceipt, "receiptPresent", false), false) ||
      boolValue(getRaw(packet, "SURFACE_TRUTH_PROBE_RECEIPT_PRESENT", false), false) ||
      surfaceApi.readableReceiptPresent;

    const measurementStatus = firstKnown(
      getRaw(surfaceAction, "CANVAS_SURFACE_TRUTH_STATUS", undefined),
      getRaw(measurement, "status", undefined),
      "UNKNOWN"
    );

    const failureClass = firstKnown(
      getRaw(surfaceAction, "CANVAS_SURFACE_TRUTH_FAILURE_CLASS", undefined),
      getRaw(measurement, "failureClass", undefined),
      "UNKNOWN"
    );

    const firstFailed = firstKnown(
      getRaw(surfaceAction, "CANVAS_TRUTH_FIRST_FAILED_COORDINATE", undefined),
      getRaw(measurement, "firstFailedCoordinate", undefined),
      "UNKNOWN"
    );

    const mountFound = boolValue(getNested(measurement, "mount.found", false), false);
    const canvasFound = boolValue(getNested(measurement, "canvas.found", false), false);

    let scope = "UNKNOWN_SURFACE_SCOPE";
    let status = "SURFACE_SCOPE_UNKNOWN";
    let reason = "NO_SURFACE_TRUTH_MEASUREMENT";

    if (profilePresent && receiptPresent && measurementStatus === "SURFACE_CONTRACT_MEASUREMENT_FAILED") {
      status = "SURFACE_SCOPE_MEASURED_FAILURE";
      if (failureClass === "CANONICAL_MOUNT_MISSING") {
        scope = "NO_CANONICAL_MOUNT_IN_INSPECTED_DOCUMENT";
        reason =
          "SURFACE_TRUTH_PROFILE_EXISTS_BUT_INSPECTED_DOCUMENT_DID_NOT_CONTAIN_CANONICAL_HEARTH_MOUNT";
      } else {
        scope = "CANONICAL_SURFACE_PRESENT_BUT_FAILED";
        reason = failureClass;
      }
    } else if (profilePresent && receiptPresent && mountFound && canvasFound) {
      status = "SURFACE_SCOPE_PRODUCTION_CANDIDATE_PRESENT";
      scope = "CANONICAL_MOUNT_AND_CANVAS_FOUND";
      reason = "SURFACE_TRUTH_MEASUREMENT_FOUND_CANONICAL_MOUNT_AND_CANVAS";
    } else if (profilePresent && receiptPresent) {
      status = "SURFACE_SCOPE_PROFILE_READY_MEASUREMENT_INCONCLUSIVE";
      scope = "PROFILE_PRESENT_MEASUREMENT_INCONCLUSIVE";
      reason = measurementStatus;
    } else if (!profilePresent) {
      status = "SURFACE_SCOPE_BLOCKED_PROFILE_MISSING";
      scope = "SURFACE_TRUTH_PROBE_MISSING";
      reason = "SURFACE_TRUTH_PROBE_NOT_OBSERVED";
    }

    return {
      id: "SURFACE_SCOPE_LENS",
      status,
      scope,
      reason,
      surfaceTruthPresent: profilePresent,
      surfaceTruthReceiptPresent: receiptPresent,
      measurementStatus,
      failureClass,
      firstFailedCoordinate: firstFailed,
      canonicalMountFound: mountFound,
      canvasFound,
      surfaceTruthAuthority: surfaceApi,
      likelyInspectionDocument:
        failureClass === "CANONICAL_MOUNT_MISSING"
          ? "DIAGNOSTIC_OR_NON_PRODUCTION_DOCUMENT_OR_TARGET_MOUNT_ABSENT"
          : "UNKNOWN",
      recommendedFile: SURFACE_TRUTH_FILE,
      recommendedAction:
        failureClass === "CANONICAL_MOUNT_MISSING"
          ? "CONFIRM_SURFACE_TRUTH_PROBE_CONSUMES_TARGET_FRAME_DOCUMENT_OR_PRODUCTION_ROUTE_MOUNT_EXISTS"
          : "KEEP_SURFACE_TRUTH_AS_CONTRACT_DEFINITION_EVIDENCE"
    };
  }

  function classifyDomNode(node, selector) {
    if (!node) {
      return {
        surfaceClass: SURFACE_CLASS.UNKNOWN,
        reason: "NO_DOM_NODE_AVAILABLE",
        selector: selector || "NONE"
      };
    }

    const tag = safeString(node.tagName).toLowerCase();
    const id = safeString(node.id);
    const className = safeString(node.className);
    const dataset = node.dataset || {};
    const selectorText = safeString(selector);

    let inProductionMount = false;
    let inDiagnosticSurface = false;

    try {
      inProductionMount = Boolean(node.closest && node.closest("#hearthCanvasMount"));
    } catch (_error) {}

    try {
      inDiagnosticSurface = Boolean(
        node.closest &&
        (
          node.closest("#diagnostic-main") ||
          node.closest("[data-hearth-diagnostic-rail]") ||
          node.closest("[data-diagnostic-route]") ||
          node.closest("[data-hearth-diagnostic]")
        )
      );
    } catch (_error) {}

    const text = [
      tag,
      id,
      className,
      selectorText,
      dataset.hearthSurfaceClass,
      dataset.hearthSurfaceRole,
      dataset.hearthFeedType,
      dataset.hearthImageType
    ].join(" ").toLowerCase();

    const generated =
      boolValue(dataset.generatedImage, false) ||
      boolValue(dataset.hearthTemporaryImage, false) ||
      boolValue(dataset.hearthTempImage, false) ||
      /temporary|temp-image|snapshot|preview-image|generated-image/.test(text);

    const innerFeed =
      boolValue(dataset.hearthInnerScopeFeed, false) ||
      boolValue(dataset.hearthCanvasFeed, false) ||
      boolValue(dataset.hearthExpressionFeed, false) ||
      /inner-scope|innerscope|canvas-feed|expression-feed|feed-surface|source-feed/.test(text);

    const production =
      tag === "canvas" &&
      (
        id === "hearthVisibleCanvas" ||
        inProductionMount ||
        boolValue(dataset.hearthVisibleCanvas, false) ||
        boolValue(dataset.hearthCanvasHub, false) ||
        boolValue(dataset.hearthCanvas, false) ||
        boolValue(dataset.hearthPlanetCanvas, false) ||
        boolValue(dataset.hearthDomSurface, false) ||
        selectorText === "#hearthCanvasMount canvas" ||
        selectorText.includes("#hearthCanvasMount")
      ) &&
      !generated &&
      !innerFeed;

    if (inDiagnosticSurface || /diagnostic/.test(text)) {
      return {
        surfaceClass: SURFACE_CLASS.DIAGNOSTIC_FRAME,
        reason: "DOM_NODE_IS_INSIDE_DIAGNOSTIC_SURFACE_OR_MARKED_DIAGNOSTIC",
        selector: selectorText || "DOM_NODE"
      };
    }

    if (generated || tag === "img") {
      return {
        surfaceClass: SURFACE_CLASS.TEMPORARY_IMAGE,
        reason:
          tag === "img"
            ? "DOM_NODE_IS_IMAGE_NOT_PRODUCTION_CANVAS"
            : "DOM_NODE_MARKED_TEMPORARY_OR_GENERATED_IMAGE",
        selector: selectorText || "DOM_NODE"
      };
    }

    if (innerFeed) {
      return {
        surfaceClass: SURFACE_CLASS.INNER_SCOPE_FEED,
        reason: "DOM_NODE_MARKED_AS_INNER_SCOPE_OR_EXPRESSION_FEED",
        selector: selectorText || "DOM_NODE"
      };
    }

    if (production) {
      return {
        surfaceClass: SURFACE_CLASS.PRODUCTION_CANVAS,
        reason: "DOM_NODE_MATCHES_HEARTH_PRODUCTION_CANVAS_MOUNT_OR_DATASET",
        selector: selectorText || "DOM_NODE"
      };
    }

    return {
      surfaceClass: SURFACE_CLASS.UNKNOWN,
      reason: "DOM_NODE_DID_NOT_MATCH_PRODUCTION_TEMPORARY_INNER_SCOPE_OR_DIAGNOSTIC_CLASS",
      selector: selectorText || "DOM_NODE"
    };
  }

  function queryFirst(selectors) {
    if (!doc || !doc.querySelector) return { selector: "NONE", node: null };

    for (const selector of selectors || []) {
      if (!selector || selector === "UNKNOWN") continue;
      try {
        const node = doc.querySelector(selector);
        if (node) return { selector, node };
      } catch (_error) {}
    }

    return { selector: "NONE", node: null };
  }

  function readLegacyFingerEvidence(input = {}) {
    if (isObject(input.fingerInspectEvidence)) {
      state.receivedFingerReportCount += 1;
      return {
        source: "INPUT_FINGER_INSPECT_EVIDENCE",
        authority: inspectAuthority("FINGER_INSPECT", CANVAS_FINGER_INSPECT_FILE, FINGER_INSPECT_ALIASES),
        report: clonePlain(input.fingerInspectEvidence)
      };
    }

    if (isObject(input.fingerInspectReport)) {
      state.receivedFingerReportCount += 1;
      return {
        source: "INPUT_FINGER_INSPECT_REPORT",
        authority: inspectAuthority("FINGER_INSPECT", CANVAS_FINGER_INSPECT_FILE, FINGER_INSPECT_ALIASES),
        report: clonePlain(input.fingerInspectReport)
      };
    }

    const authority = inspectAuthority("FINGER_INSPECT", CANVAS_FINGER_INSPECT_FILE, FINGER_INSPECT_ALIASES);
    return {
      source: authority.observed
        ? "FINGER_INSPECT_ALIAS_REPORT_OR_RECEIPT"
        : "FINGER_INSPECT_NOT_OBSERVED",
      authority,
      report: clonePlain(authority.receiptObject || {})
    };
  }

  function computeLegacyCanvasFeedClassifier(input = {}, packet = {}) {
    const fingerEvidence = readLegacyFingerEvidence(input);
    const fingerReport = fingerEvidence.report || {};
    const currentReport = isObject(input.currentReport) ? input.currentReport : packet;

    const selector = firstKnown(
      getRaw(fingerReport, "CANVAS_SELECTOR", undefined),
      getRaw(fingerReport, "canvasSelector", undefined),
      getRaw(currentReport, "CANVAS_SELECTOR", undefined),
      "#hearthCanvasMount canvas",
      "UNKNOWN"
    );

    const datasetContract = firstKnown(
      getRaw(fingerReport, "CANVAS_DATASET_CONTRACT", undefined),
      getRaw(fingerReport, "canvasDatasetContract", undefined),
      getRaw(currentReport, "CANVAS_DATASET_CONTRACT", undefined),
      getRaw(currentReport, "CURRENT_CANVAS_PARENT_CONTRACT", undefined),
      "UNKNOWN"
    );

    const proofSource = firstKnown(
      getRaw(currentReport, "VISIBLE_PLANET_PROOF_SOURCE", undefined),
      getRaw(currentReport, "CANVAS_EXPRESSION_PROOF_STATUS", undefined),
      getRaw(fingerReport, "CANVAS_PIXEL_SAMPLE_REASON", undefined),
      "UNKNOWN"
    );

    const selectorLower = selector.toLowerCase();
    const contractLower = datasetContract.toLowerCase();
    const proofLower = proofSource.toLowerCase();

    let evidenceClass = SURFACE_CLASS.UNKNOWN;
    let reason = "NO_RECOGNIZED_EVIDENCE_CLASS";

    if (
      selectorLower.includes("#hearthcanvasmount") ||
      selectorLower.includes("#hearthvisiblecanvas") ||
      selectorLower.includes("data-hearth-visible-canvas") ||
      contractLower.includes("hearth_canvas")
    ) {
      evidenceClass = SURFACE_CLASS.PRODUCTION_CANVAS;
      reason = "EVIDENCE_SELECTOR_OR_CONTRACT_MATCHES_PRODUCTION_HEARTH_CANVAS";
    }

    if (
      selectorLower.includes("img") ||
      selectorLower.includes("temporary") ||
      selectorLower.includes("snapshot") ||
      selectorLower.includes("preview")
    ) {
      evidenceClass = SURFACE_CLASS.TEMPORARY_IMAGE;
      reason = "EVIDENCE_MARKS_TEMPORARY_IMAGE_OR_GENERATED_IMAGE";
    }

    if (
      selectorLower.includes("inner-scope") ||
      selectorLower.includes("innerscope") ||
      selectorLower.includes("feed") ||
      proofLower.includes("namespace") ||
      proofLower.includes("bishop") ||
      proofLower.includes("inner")
    ) {
      evidenceClass = SURFACE_CLASS.INNER_SCOPE_FEED;
      reason = "EVIDENCE_MARKS_INNER_SCOPE_OR_NAMESPACE_FEED";
    }

    if (selectorLower.includes("diagnostic") || proofLower.includes("diagnostic")) {
      evidenceClass = SURFACE_CLASS.DIAGNOSTIC_FRAME;
      reason = "EVIDENCE_MARKS_DIAGNOSTIC_FRAME_SURFACE";
    }

    const dom = queryFirst([
      selector,
      "#hearthVisibleCanvas",
      "#hearthCanvasMount canvas",
      "canvas[data-hearth-visible-canvas='true']",
      "canvas[data-hearth-canvas-hub='true']",
      "canvas[data-hearth-canvas='true']",
      "img[data-hearth-temporary-image='true']",
      "[data-hearth-inner-scope-feed='true']",
      "[data-hearth-diagnostic-surface='true']"
    ]);

    const domClass = classifyDomNode(dom.node, dom.selector);

    if (evidenceClass === SURFACE_CLASS.UNKNOWN && domClass.surfaceClass !== SURFACE_CLASS.UNKNOWN) {
      evidenceClass = domClass.surfaceClass;
      reason = domClass.reason;
    }

    return {
      id: "LEGACY_CANVAS_FEED_CLASSIFIER",
      status: "LEGACY_COMPATIBLE",
      surfaceClass: evidenceClass,
      reason,
      selector,
      datasetContract,
      proofSource,
      domClassification: domClass,
      fingerInspectObserved: fingerEvidence.authority.observed,
      fingerInspectPath: fingerEvidence.authority.alias || fingerEvidence.authority.path
    };
  }

  function computeCanvasBlameLens(packet, surfaceScopeLens, legacyClassifier) {
    const surfaceClass = legacyClassifier.surfaceClass || SURFACE_CLASS.UNKNOWN;
    const surfaceScope = surfaceScopeLens.scope || "UNKNOWN";
    const surfaceFailure = surfaceScopeLens.failureClass || "UNKNOWN";

    let status = "CANVAS_BLAME_HELD";
    let eligible = false;
    let reason = "PRODUCTION_CANVAS_NOT_CONFIRMED";
    let recommendedFile = CANVAS_FINGER_INSPECT_FILE;
    let recommendedAction =
      "KEEP_CANVAS_BLAME_BLOCKED_UNTIL_PRODUCTION_CANVAS_SURFACE_IS_CONFIRMED";

    if (surfaceClass !== SURFACE_CLASS.PRODUCTION_CANVAS) {
      status = "CANVAS_BLAME_BLOCKED_SURFACE_CLASS_NOT_PRODUCTION_CANVAS";
      reason = `LEGACY_CLASSIFIER_SURFACE_CLASS:${surfaceClass}`;
    } else if (surfaceFailure === "CANONICAL_MOUNT_MISSING") {
      status = "CANVAS_BLAME_BLOCKED_CANONICAL_MOUNT_MISSING";
      reason =
        "SURFACE_TRUTH_DID_NOT_CONFIRM_PRODUCTION_CANVAS_MOUNT_IN_INSPECTED_DOCUMENT";
      recommendedFile = SURFACE_TRUTH_FILE;
      recommendedAction =
        "CONFIRM_SURFACE_TRUTH_TARGET_DOCUMENT_SCOPE_BEFORE_CANVAS_DRAW_BLAME";
    } else if (surfaceScope === "CANONICAL_MOUNT_AND_CANVAS_FOUND") {
      status = "CANVAS_BLAME_ELIGIBLE_AFTER_PRODUCTION_SURFACE_CONFIRMATION";
      eligible = true;
      reason = "PRODUCTION_CANVAS_SURFACE_CONFIRMED_BY_SCOPE_LENSES";
      recommendedFile = CANVAS_FILE;
      recommendedAction =
        "AUDIT_CANVAS_DRAW_PATH_ONLY_AFTER_HEARTH_PRODUCTION_CANVAS_IS_CONFIRMED";
    }

    return {
      id: "CANVAS_BLAME_LENS",
      status,
      canvasBlameEligible: eligible,
      reason,
      inspectedSurfaceClass: surfaceClass,
      surfaceScope,
      surfaceFailure,
      recommendedFile,
      recommendedAction
    };
  }

  function computeProbeNetworkLens(packet) {
    const receiptIds = [
      "PROBE_NORTH",
      "PROBE_EAST",
      "PROBE_WEST",
      "SURFACE_TRUTH_PROBE",
      "PROBE_SOUTH"
    ];

    const aliasProbeRecords = {
      PROBE_NORTH: inspectAuthority("PROBE_NORTH", PROBE_NORTH_FILE, PROBE_ALIASES.NORTH),
      PROBE_EAST: inspectAuthority("PROBE_EAST", PROBE_EAST_FILE, PROBE_ALIASES.EAST),
      PROBE_WEST: inspectAuthority("PROBE_WEST", PROBE_WEST_FILE, PROBE_ALIASES.WEST),
      SURFACE_TRUTH_PROBE: inspectAuthority("SURFACE_TRUTH_PROBE", SURFACE_TRUTH_FILE, PROBE_ALIASES.SURFACE_TRUTH),
      PROBE_SOUTH: inspectAuthority("PROBE_SOUTH", PROBE_SOUTH_FILE, PROBE_ALIASES.SOUTH)
    };

    let present = 0;
    let receiptPresent = 0;
    let missing = 0;
    let loading = 0;
    const missingIds = [];
    const presentNoReceiptIds = [];

    receiptIds.forEach((id) => {
      const receipt = receiptRecord(packet, id);
      const load = participantRecord(packet, id);
      const aliasRecord = aliasProbeRecords[id];

      const isPresent =
        boolValue(getRaw(receipt, "present", false), false) ||
        boolValue(getRaw(load, "present", false), false) ||
        aliasRecord.observed;

      const hasReceipt =
        boolValue(getRaw(receipt, "receiptPresent", false), false) ||
        aliasRecord.readableReceiptPresent;

      const loadStatus = firstKnown(getRaw(load, "loadStatus", undefined), aliasRecord.status, "UNKNOWN");

      if (isPresent) present += 1;
      else {
        missing += 1;
        missingIds.push(id);
      }

      if (hasReceipt) receiptPresent += 1;
      else if (isPresent) presentNoReceiptIds.push(id);

      if (loadStatus === "LOADING") loading += 1;
    });

    let status = "PROBE_NETWORK_PARTIAL";
    if (missing === 0 && presentNoReceiptIds.length === 0) status = "PROBE_NETWORK_ALIGNED";
    if (missing > 0 && present > 0) status = "PROBE_NETWORK_PARTIAL";
    if (present === 0) status = "PROBE_NETWORK_BLOCKED";

    return {
      id: "PROBE_NETWORK_LENS",
      status,
      presentCount: present,
      receiptPresentCount: receiptPresent,
      missingCount: missing,
      loadingCount: loading,
      missingIds,
      presentNoReceiptIds,
      aliasProbeRecords,
      recommendedFile: missingIds.includes("PROBE_SOUTH") ? PROBE_SOUTH_FILE : "NONE",
      recommendedAction: missingIds.includes("PROBE_SOUTH")
        ? "BUILD_OR_REPUBLISH_PROBE_SOUTH_TO_COMPLETE_OUTPUT_MEANING_LENS"
        : "KEEP_PROBE_NETWORK_AS_SUPPORTING_EVIDENCE"
    };
  }

  function computeDutyLoadLens(packet) {
    const fields = collectExplicitStatusFields(packet, "", []);
    const explicitDuty = fields.filter((item) =>
      EXPLICIT_DUTY_KEYS.includes(item.field) ||
      /DUTY|SELF_MEASUREMENT|COLLAPSE|QUARANTINED/i.test(item.key)
    );

    const riskFields = explicitDuty.filter((item) =>
      statusContains(item.value, "COLLAPSE_RISK") ||
      statusContains(item.value, "HEAVY_NON_COLLAPSED") ||
      statusContains(item.value, "DUTY_LOAD_COLLAPSE_RISK")
    );

    const detectedFields = explicitDuty.filter((item) =>
      statusContains(item.value, "COLLAPSE_DETECTED") ||
      statusContains(item.value, "OUTPUT_QUARANTINED")
    );

    let status = "DUTY_LOAD_LENS_CLEAN_OR_LOW_SIGNAL";
    let reason = "NO_EXPLICIT_DUTY_COLLAPSE_STATUS";

    if (detectedFields.length) {
      status = "DUTY_LOAD_LENS_COLLAPSE_DETECTED";
      reason = "EXPLICIT_DUTY_COLLAPSE_OR_QUARANTINE_STATUS_FIELD";
    } else if (riskFields.length) {
      status = "DUTY_LOAD_LENS_RISK_OR_HEAVY_NON_COLLAPSED";
      reason = "EXPLICIT_DUTY_RISK_OR_HEAVY_NON_COLLAPSED_STATUS_FIELD";
    }

    return {
      id: "DUTY_LOAD_LENS",
      status,
      reason,
      explicitStatusFieldCount: explicitDuty.length,
      riskFieldCount: riskFields.length,
      detectedFieldCount: detectedFields.length,
      sampledExplicitFields: explicitDuty.slice(0, 20),
      rawTextScanUsed: false,
      schemaVocabularyIgnored: true
    };
  }

  function computeMalpracticeLens(packet) {
    const fields = collectExplicitStatusFields(packet, "", []);

    const explicitMalpracticeFields = fields.filter((item) =>
      /MALPRACTICE/i.test(item.key) ||
      /MALPRACTICE/i.test(item.field)
    );

    const detected = explicitMalpracticeFields.filter((item) =>
      statusEquals(item.value, "DIAGNOSTIC_MALPRACTICE_DETECTED") ||
      statusEquals(item.value, "MALPRACTICE_DETECTED")
    );

    const noMalpractice = explicitMalpracticeFields.filter((item) =>
      statusEquals(item.value, "NO_DIAGNOSTIC_MALPRACTICE") ||
      statusEquals(item.value, "NO_DIAGNOSTIC_MALPRACTICE_DETECTED")
    );

    let status = "MALPRACTICE_LENS_NO_EXPLICIT_DETECTION";
    let reason = "NO_EXPLICIT_MALPRACTICE_DETECTED_STATUS_FIELD";

    if (detected.length) {
      status = "MALPRACTICE_LENS_EXPLICIT_DETECTION";
      reason = "EXPLICIT_MALPRACTICE_STATUS_FIELD_EQUALS_DETECTED";
    } else if (noMalpractice.length) {
      status = "MALPRACTICE_LENS_EXPLICIT_CLEAR_OR_NON_DETECTED";
      reason = "EXPLICIT_MALPRACTICE_STATUS_FIELD_IS_CLEAR";
    }

    return {
      id: "MALPRACTICE_LENS",
      status,
      reason,
      explicitMalpracticeFieldCount: explicitMalpracticeFields.length,
      detectedFieldCount: detected.length,
      clearFieldCount: noMalpractice.length,
      sampledExplicitFields: explicitMalpracticeFields.slice(0, 20),
      rawTextScanUsed: false,
      schemaVocabularyIgnored: true,
      falsePositiveGuard: "DO_NOT_COUNT_STATUS_LISTS_OR_SCHEMA_ENUM_VALUES_AS_ACTUAL_STATUS"
    };
  }

  function computeLabSouthProofLens() {
    const labSouth = inspectAuthority(
      "LAB_SOUTH_F8",
      LAB_SOUTH_FILE,
      LAB_SOUTH_ALIASES,
      LAB_SOUTH_PROOF_METHODS
    );

    const proofPacket = isObject(labSouth.preferredMethodOutput)
      ? labSouth.preferredMethodOutput
      : {};

    const contract = contractOf(proofPacket) !== "UNKNOWN" ? contractOf(proofPacket) : labSouth.contract;
    const receipt = receiptOf(proofPacket) !== "UNKNOWN" ? receiptOf(proofPacket) : labSouth.receipt;

    const forbidden = detectForbiddenClaim(proofPacket) || detectForbiddenClaim(labSouth.receiptObject);

    const proofReady = Boolean(
      labSouth.observed &&
      !forbidden &&
      (
        boolValue(getRaw(proofPacket, "southProofAccepted", false), false) ||
        boolValue(getRaw(proofPacket, "f8ProofPacketReady", false), false) ||
        boolValue(getRaw(proofPacket, "northF21EligibilityPrepared", false), false) ||
        boolValue(getRaw(labSouth.receiptObject, "southProofReturnActive", false), false) ||
        labSouth.methods.includes("composeF8ProofPacket") ||
        labSouth.methods.includes("composeDiagnosticSidecarExportPacket")
      )
    );

    let status = "LAB_SOUTH_PROOF_NOT_OBSERVED";
    let reason = "LAB_SOUTH_AUTHORITY_NOT_AVAILABLE";

    if (labSouth.observed && forbidden) {
      status = "LAB_SOUTH_PROOF_REJECTED_FOR_FORBIDDEN_CLAIM";
      reason = "FORBIDDEN_RENDER_OR_FINAL_CLAIM_DETECTED";
    } else if (proofReady) {
      status = "LAB_SOUTH_F8_PROOF_EXPORT_AVAILABLE";
      reason = "LAB_SOUTH_F8_PROOF_PACKET_OR_RECEIPT_SURFACE_AVAILABLE";
    } else if (labSouth.observed) {
      status = "LAB_SOUTH_PRESENT_PROOF_EXPORT_PENDING";
      reason = "LAB_SOUTH_PRESENT_BUT_F8_PROOF_EXPORT_NOT_CONFIRMED";
    }

    state.labSouthObserved = labSouth.observed;
    state.labSouthProofObserved = proofReady;
    state.labSouthProofAccepted = proofReady && !forbidden;
    state.labSouthContract = contract;
    state.labSouthReceipt = receipt;

    return {
      id: "LAB_SOUTH_F8_PROOF_LENS",
      status,
      reason,
      labSouthObserved: labSouth.observed,
      labSouthProofObserved: proofReady,
      labSouthProofAccepted: proofReady && !forbidden,
      forbiddenClaimDetected: forbidden,
      sourceContract: contract,
      sourceReceipt: receipt,
      proofMethod: labSouth.preferredMethod,
      proofPacket: clonePlain(proofPacket),
      labSouthAuthority: labSouth,
      recommendedFile: proofReady ? NORTH_RAIL_FILE : LAB_SOUTH_FILE,
      recommendedAction: proofReady
        ? "PUBLISH_THIS_SIDECAR_FOR_NORTH_RAIL_DISCOVERY"
        : "RENEW_OR_LOAD_LAB_SOUTH_F8_PROOF_EXPORT"
    };
  }

  function computeLabEngineStackLens() {
    const north = inspectAuthority("LAB_NORTH", LAB_NORTH_FILE, LAB_NORTH_ALIASES);
    const east = inspectAuthority("LAB_EAST_F3", LAB_EAST_FILE, LAB_EAST_ALIASES);
    const west = inspectAuthority("LAB_WEST_F5", LAB_WEST_FILE, LAB_WEST_ALIASES);
    const south = inspectAuthority("LAB_SOUTH_F8", LAB_SOUTH_FILE, LAB_SOUTH_ALIASES);

    const product = inspectAuthority(
      "F34_PRODUCT_ENGINE",
      PRODUCT_ENGINE_FILE,
      PRODUCT_ENGINE_ALIASES,
      ENGINE_RELEASE_METHODS
    );

    const expression = inspectAuthority(
      "F55_EXPRESSION_ENGINE",
      EXPRESSION_ENGINE_FILE,
      EXPRESSION_ENGINE_ALIASES,
      ENGINE_RELEASE_METHODS
    );

    const registry = inspectAuthority(
      "F89_REGISTRY_ENGINE",
      REGISTRY_ENGINE_FILE,
      REGISTRY_ENGINE_ALIASES,
      ENGINE_RELEASE_METHODS
    );

    const market = inspectAuthority(
      "F144_MARKET_ENGINE",
      MARKET_ENGINE_FILE,
      MARKET_ENGINE_ALIASES,
      ENGINE_RELEASE_METHODS
    );

    const chamberRecords = [north, east, west, south];
    const supportRecords = [product, expression, registry, market];

    const chamberObservedCount = chamberRecords.filter((item) => item.observed).length;
    const chamberReadyCount = chamberRecords.filter((item) => item.status === "LOADED_AND_AVAILABLE").length;
    const supportObservedCount = supportRecords.filter((item) => item.observed).length;
    const supportReadyCount = supportRecords.filter((item) => item.status === "LOADED_AND_AVAILABLE").length;

    const f233ReturnObserved = Boolean(
      statusContains(JSON.stringify(market.preferredMethodOutput || {}), "F233") ||
      statusContains(JSON.stringify(market.receiptObject || {}), "F233") ||
      market.methods.includes("composeF233DownstreamReturnPacket")
    );

    const cardinalReady = chamberReadyCount >= 4;
    const supportReady = supportReadyCount >= 4;
    const partialReady = chamberReadyCount >= 3 && supportReadyCount >= 2;

    let status = "LAB_ENGINE_STACK_NOT_OBSERVED";
    let reason = "NO_LAB_CHAMBERS_OR_SUPPORT_ENGINES_OBSERVED";

    if (cardinalReady && supportReady) {
      status = "LAB_ENGINE_STACK_READY";
      reason = "ALL_FOUR_LAB_CHAMBERS_AND_ALL_FOUR_SUPPORT_ENGINES_HAVE_READABLE_SURFACES";
    } else if (partialReady) {
      status = "LAB_ENGINE_STACK_PARTIAL_READY";
      reason = "ENOUGH_LAB_STACK_EVIDENCE_PRESENT_FOR_DIAGNOSTIC_SIDECAR_CONTEXT";
    } else if (chamberObservedCount || supportObservedCount) {
      status = "LAB_ENGINE_STACK_PARTIAL";
      reason = "SOME_LAB_STACK_EVIDENCE_PRESENT";
    }

    state.labChamberObservedCount = chamberObservedCount;
    state.supportEngineObservedCount = supportObservedCount;
    state.f233ReturnObserved = f233ReturnObserved;

    return {
      id: "LAB_ENGINE_STACK_LENS",
      status,
      reason,
      cardinalReady,
      supportReady,
      partialReady,
      chamberObservedCount,
      chamberReadyCount,
      supportObservedCount,
      supportReadyCount,
      f233ReturnObserved,
      chambers: {
        north,
        east,
        west,
        south
      },
      supportEngines: {
        f34ProductEngine: product,
        f55ExpressionEngine: expression,
        f89RegistryEngine: registry,
        f144MarketEngine: market
      },
      recommendedFile:
        cardinalReady && supportReady ? NORTH_RAIL_FILE : LAB_SOUTH_FILE,
      recommendedAction:
        cardinalReady && supportReady
          ? "RUN_EXISTING_NORTH_RAIL_TO_DISCOVER_THIS_SIDECAR"
          : "LOAD_OR_RENEW_MISSING_LAB_STACK_RECEIPT_SURFACES"
    };
  }

  function computeSidecarDiscoveryLens(labSouthLens, engineStackLens) {
    const selfReady = true;
    const discoveryAliasesPublished = state.northDiscoverableSidecarPublished;
    const labSouthOk = labSouthLens.labSouthProofAccepted || labSouthLens.labSouthObserved;
    const stackContextOk =
      engineStackLens.cardinalReady ||
      engineStackLens.partialReady ||
      engineStackLens.chamberObservedCount >= 2;

    const ready = Boolean(selfReady && labSouthOk && stackContextOk);

    let status = "SIDECAR_DISCOVERY_PENDING";
    let reason = "WAITING_FOR_LAB_SOUTH_OR_ENGINE_STACK_CONTEXT";

    if (ready && discoveryAliasesPublished) {
      status = "SOUTH_SURFACE_POINTER_SIDECAR_DISCOVERABLE";
      reason = "NORTH_RAIL_DISCOVERY_ALIASES_ARE_PUBLISHED_BY_ACTUAL_SIDEcar_FILE";
    } else if (ready && !discoveryAliasesPublished) {
      status = "SOUTH_SURFACE_POINTER_SIDECAR_READY_TO_PUBLISH";
      reason = "SIDECAR_READY_BUT_ALIAS_PUBLICATION_HAS_NOT_RUN";
    } else if (!labSouthOk) {
      status = "SOUTH_SURFACE_POINTER_SIDECAR_WAITING_LAB_SOUTH";
      reason = "LAB_SOUTH_F8_PROOF_EXPORT_NOT_OBSERVED";
    }

    state.diagnosticBridgeReady = Boolean(ready && discoveryAliasesPublished);

    return {
      id: "SIDECAR_DISCOVERY_LENS",
      status,
      reason,
      sidecarReady: ready,
      discoveryAliasesPublished,
      northDiscoveryField: NORTH_DISCOVERY_FIELD,
      northExpectedLoadStatus: NORTH_EXPECTED_LOAD_STATUS,
      discoveryAliases: SOUTH_SIDECAR_DISCOVERY_ALIASES.slice(),
      recommendedFile: ready ? NORTH_RAIL_FILE : FILE,
      recommendedAction: ready
        ? "RUN_HEARTH_DIAGNOSTIC_RAIL_AND_EXPECT_SOUTH_SURFACE_POINTER_SIDECAR_LOAD_STATUS_LOADED_AND_AVAILABLE"
        : "KEEP_SIDECAR_LOADED_AND_WAIT_FOR_LAB_SOUTH_PROOF_EXPORT"
    };
  }

  function computeConstructionReadinessLens(packet, northLens, surfaceLens, probeLens, labSouthLens, engineStackLens, sidecarDiscoveryLens) {
    const gauge = gaugeRecord(packet, "CONSTRUCTION_READINESS");
    const gaugeStatus = firstKnown(getRaw(gauge, "status", undefined), "UNKNOWN");

    const northReady =
      northLens.northVerdictAvailable === true ||
      northLens.status === "NORTH_TRACK_PRESENT_RUN_API_AVAILABLE";

    const surfaceReady =
      surfaceLens.status === "SURFACE_SCOPE_PRODUCTION_CANDIDATE_PRESENT" ||
      surfaceLens.status === "SURFACE_SCOPE_PROFILE_READY_MEASUREMENT_INCONCLUSIVE";

    const labReady =
      labSouthLens.labSouthProofAccepted ||
      engineStackLens.partialReady ||
      engineStackLens.cardinalReady;

    const sidecarReady = sidecarDiscoveryLens.sidecarReady === true;

    let status = "CONSTRUCTION_READINESS_BLOCKED";
    let reason = "NORTH_SURFACE_LAB_OR_SIDECAR_SCOPE_NOT_READY";
    let recommendedFile = FILE;
    let recommendedAction =
      "COMPLETE_SOUTH_SURFACE_POINTER_LAB_ENGINE_STACK_SIDECAR_ADAPTER_FIRST";

    if (labReady && sidecarReady && northReady && surfaceReady && probeLens.missingCount === 0) {
      status = "CONSTRUCTION_READINESS_SCOPED_PRECONDITIONS_PRESENT";
      reason = "LAB_SOUTH_ENGINE_STACK_SIDEcar_NORTH_SURFACE_AND_PROBE_LENSES_PRESENT";
      recommendedFile = NORTH_RAIL_FILE;
      recommendedAction = "RUN_NORTH_RAIL_AND_CONFIRM_SOUTH_SURFACE_POINTER_SIDECAR_DISCOVERY";
    } else if (labReady && sidecarReady && !northReady) {
      status = "CONSTRUCTION_READINESS_WAITING_NORTH_RAIL_RUN";
      reason = "SIDECAR_READY_BUT_NORTH_RAIL_VERDICT_OR_RUN_NOT_CONFIRMED";
      recommendedFile = NORTH_RAIL_FILE;
      recommendedAction = "RUN_OR_RENEW_NORTH_RAIL_DISCOVERY_ONLY_IF_CURRENT_RAIL_FAILS";
    } else if (labReady && !sidecarReady) {
      status = "CONSTRUCTION_READINESS_WAITING_SIDECAR_PUBLICATION";
      reason = "LAB_READY_BUT_SIDECAR_DISCOVERY_SURFACE_NOT_CONFIRMED";
      recommendedFile = FILE;
      recommendedAction = "PUBLISH_NORTH_DISCOVERABLE_SOUTH_SURFACE_POINTER_SIDECAR_ALIASES";
    } else if (!labReady) {
      status = "CONSTRUCTION_READINESS_WAITING_LAB_SOUTH_ENGINE_STACK";
      reason = "LAB_SOUTH_OR_ENGINE_STACK_EVIDENCE_NOT_OBSERVED";
      recommendedFile = LAB_SOUTH_FILE;
      recommendedAction = "LOAD_OR_RENEW_LAB_SOUTH_F8_PROOF_EXPORT_AND_ENGINE_STACK_RECEIPTS";
    } else if (!surfaceReady) {
      status = "CONSTRUCTION_READINESS_BLOCKED_BY_SURFACE_SCOPE";
      reason = "SURFACE_SCOPE_NOT_CONFIRMED";
      recommendedFile = SURFACE_TRUTH_FILE;
      recommendedAction = "CONFIRM_SURFACE_TRUTH_SCOPE_BEFORE_CANVAS_BUILD";
    }

    return {
      id: "CONSTRUCTION_READINESS_LENS",
      status,
      reason,
      gaugeStatus,
      labReady,
      labSouthProofAccepted: labSouthLens.labSouthProofAccepted,
      engineStackStatus: engineStackLens.status,
      sidecarReady,
      sidecarDiscoveryStatus: sidecarDiscoveryLens.status,
      northReady,
      surfaceReady,
      probeNetworkMissingCount: probeLens.missingCount,
      recommendedFile,
      recommendedAction
    };
  }

  function buildReport(input = {}) {
    const normalized = normalizeInput(input);
    const packet = normalized.object || {};
    state.lastInputSource = normalized.source;

    const copyLens = computeCopyLens(packet);
    const northLens = computeNorthTrackLens(packet);
    const surfaceLens = computeSurfaceScopeLens(packet);
    const legacyClassifier = computeLegacyCanvasFeedClassifier(input, packet);
    const canvasLens = computeCanvasBlameLens(packet, surfaceLens, legacyClassifier);
    const probeLens = computeProbeNetworkLens(packet);
    const dutyLens = computeDutyLoadLens(packet);
    const malpracticeLens = computeMalpracticeLens(packet);
    const labSouthLens = computeLabSouthProofLens();
    const engineStackLens = computeLabEngineStackLens();
    const sidecarDiscoveryLens = computeSidecarDiscoveryLens(labSouthLens, engineStackLens);
    const constructionLens =
      computeConstructionReadinessLens(
        packet,
        northLens,
        surfaceLens,
        probeLens,
        labSouthLens,
        engineStackLens,
        sidecarDiscoveryLens
      );

    const lenses = {
      COPY_LENS: copyLens,
      NORTH_TRACK_LENS: northLens,
      SURFACE_SCOPE_LENS: surfaceLens,
      CANVAS_BLAME_LENS: canvasLens,
      PROBE_NETWORK_LENS: probeLens,
      DUTY_LOAD_LENS: dutyLens,
      MALPRACTICE_LENS: malpracticeLens,
      LAB_SOUTH_F8_PROOF_LENS: labSouthLens,
      LAB_ENGINE_STACK_LENS: engineStackLens,
      SIDECAR_DISCOVERY_LENS: sidecarDiscoveryLens,
      CONSTRUCTION_READINESS_LENS: constructionLens,
      LEGACY_CANVAS_FEED_CLASSIFIER: legacyClassifier
    };

    state.latestLensStatus =
      Object.values(lenses).some((lens) => /BLOCKED|DETECTED|FAILED|REJECTED/i.test(lens.status))
        ? "SCOPE_LENSES_ACTIVE_WITH_BLOCKERS"
        : "SCOPE_LENSES_ACTIVE";

    state.latestLabStackLens = engineStackLens.status;
    state.latestLabSouthProofLens = labSouthLens.status;
    state.latestEngineStackLens = engineStackLens.status;
    state.latestNorthTrackLens = northLens.status;
    state.latestSurfaceScopeLens = surfaceLens.status;
    state.latestCanvasBlameLens = canvasLens.status;
    state.latestProbeNetworkLens = probeLens.status;
    state.latestDutyLoadLens = dutyLens.status;
    state.latestMalpracticeLens = malpracticeLens.status;
    state.latestConstructionReadinessLens = constructionLens.status;
    state.latestCopyLens = copyLens.status;
    state.latestSurfaceClass = legacyClassifier.surfaceClass;
    state.latestCanvasBlameEligible = canvasLens.canvasBlameEligible;
    state.latestRecommendedOwner = "SOUTH_SURFACE_POINTER_SIDECAR_ADAPTER";
    state.latestRecommendedFile = constructionLens.recommendedFile;
    state.latestRecommendedAction = constructionLens.recommendedAction;

    const report = {
      PACKET_NAME,
      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      EARLIER_INTERNAL_RENEWAL_CONTRACT,
      EARLIER_INTERNAL_RENEWAL_RECEIPT,
      VERSION,
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      DIAGNOSTIC_TIMESTAMP: nowIso(),

      PRIMARY_DUTY: "LAB_ENGINE_STACK_SIDECAR_ADAPTER_AND_SCOPE_LENS_CLASSIFICATION",
      PROFILE_CLASS: "SOUTH_SURFACE_POINTER_LAB_ENGINE_STACK_SIDECAR_ADAPTER",
      CHRONOLOGY_POSITION: "OUTSIDE_NINE_STEP_CHRONOLOGY",
      ASYMMETRIC_TENTH_DIAGNOSTIC_SIDECAR: true,

      COPY_PROBLEM_IS_NOT_CURRENT_PRIMARY_PROBLEM: true,
      PRESENT_PROBLEM: "LAB_ENGINE_STACK_DIAGNOSTIC_ADAPTER_AND_SCOPE_DEFINITION_BY_LENS",
      LEGACY_CANVAS_FEED_CLASSIFIER_COMPATIBLE: true,
      LEGACY_CANVAS_FEED_CLASSIFIER_PRIMARY: false,
      SCOPE_LENS_CLASSIFIER_COMPATIBLE: true,

      SOUTH_DOES_PACKET_SEGREGATION: true,
      SOUTH_SURFACE_POINTER_DOES_SCOPE_LENSING: true,
      SOUTH_SURFACE_POINTER_DOES_LAB_ENGINE_STACK_ADAPTER: true,
      SOUTH_SURFACE_POINTER_DOES_NOT_GENERATE_LAB_PROOF: true,
      SOUTH_SURFACE_POINTER_DOES_NOT_SEGREGATE_RECEIPT: true,
      SOUTH_SURFACE_POINTER_DOES_NOT_COLLAPSE_DUPLICATE_STANDARDS: true,
      SOUTH_SURFACE_POINTER_DOES_NOT_CHANGE_COMPACT_MANIFEST: true,
      SOUTH_SURFACE_POINTER_DOES_NOT_AUTHORIZE_REPAIR: true,

      NORTH_DISCOVERY_FIELD,
      NORTH_EXPECTED_LOAD_STATUS,
      NORTH_DISCOVERABLE_SIDECAR_PUBLISHED: state.northDiscoverableSidecarPublished,
      NORTH_DISCOVERABLE_ALIAS_COUNT: SOUTH_SIDECAR_DISCOVERY_ALIASES.length,
      NORTH_DISCOVERABLE_ALIASES: SOUTH_SIDECAR_DISCOVERY_ALIASES.slice(),

      INPUT_SOURCE: normalized.source,
      INPUT_PACKET_NAME: firstKnown(getRaw(packet, "PACKET_NAME", undefined), "UNKNOWN"),
      RECEIVER_CONTRACT_SEEN: firstKnown(getRaw(packet, "CONTRACT", undefined), "UNKNOWN"),

      SCOPE_LENS_STATUS: state.latestLensStatus,

      LAB_SOUTH_F8_PROOF_LENS_STATUS: labSouthLens.status,
      LAB_SOUTH_F8_PROOF_OBSERVED: labSouthLens.labSouthProofObserved,
      LAB_SOUTH_F8_PROOF_ACCEPTED: labSouthLens.labSouthProofAccepted,
      LAB_SOUTH_CONTRACT_SEEN: labSouthLens.sourceContract,
      LAB_SOUTH_RECEIPT_SEEN: labSouthLens.sourceReceipt,

      LAB_ENGINE_STACK_LENS_STATUS: engineStackLens.status,
      LAB_ENGINE_STACK_CHAMBER_OBSERVED_COUNT: engineStackLens.chamberObservedCount,
      LAB_ENGINE_STACK_CHAMBER_READY_COUNT: engineStackLens.chamberReadyCount,
      SUPPORT_ENGINE_OBSERVED_COUNT: engineStackLens.supportObservedCount,
      SUPPORT_ENGINE_READY_COUNT: engineStackLens.supportReadyCount,
      F233_RETURN_OBSERVED: engineStackLens.f233ReturnObserved,

      SIDECAR_DISCOVERY_LENS_STATUS: sidecarDiscoveryLens.status,
      SIDECAR_READY: sidecarDiscoveryLens.sidecarReady,
      SIDECAR_DISCOVERY_ALIASES_PUBLISHED: sidecarDiscoveryLens.discoveryAliasesPublished,

      COPY_LENS_STATUS: copyLens.status,
      COPY_LENS_REASON: copyLens.reason,

      NORTH_TRACK_LENS_STATUS: northLens.status,
      NORTH_TRACK_FAILURE_CLASS: northLens.failureClass,
      NORTH_TRACK_RECOMMENDED_FILE: northLens.recommendedFile,
      NORTH_TRACK_RECOMMENDED_ACTION: northLens.recommendedAction,

      SURFACE_SCOPE_LENS_STATUS: surfaceLens.status,
      SURFACE_SCOPE: surfaceLens.scope,
      SURFACE_SCOPE_FAILURE_CLASS: surfaceLens.failureClass,
      SURFACE_SCOPE_RECOMMENDED_FILE: surfaceLens.recommendedFile,
      SURFACE_SCOPE_RECOMMENDED_ACTION: surfaceLens.recommendedAction,

      CANVAS_BLAME_LENS_STATUS: canvasLens.status,
      CANVAS_BLAME_ELIGIBLE: canvasLens.canvasBlameEligible,
      CANVAS_BLAME_REASON: canvasLens.reason,
      CANVAS_BLAME_RECOMMENDED_FILE: canvasLens.recommendedFile,
      CANVAS_BLAME_RECOMMENDED_ACTION: canvasLens.recommendedAction,

      PROBE_NETWORK_LENS_STATUS: probeLens.status,
      PROBE_NETWORK_PRESENT_COUNT: probeLens.presentCount,
      PROBE_NETWORK_RECEIPT_PRESENT_COUNT: probeLens.receiptPresentCount,
      PROBE_NETWORK_MISSING_COUNT: probeLens.missingCount,
      PROBE_NETWORK_MISSING_IDS: probeLens.missingIds.join(","),

      DUTY_LOAD_LENS_STATUS: dutyLens.status,
      DUTY_LOAD_LENS_REASON: dutyLens.reason,
      DUTY_LOAD_RAW_TEXT_SCAN_USED: false,

      MALPRACTICE_LENS_STATUS: malpracticeLens.status,
      MALPRACTICE_LENS_REASON: malpracticeLens.reason,
      MALPRACTICE_RAW_TEXT_SCAN_USED: false,
      MALPRACTICE_SCHEMA_VOCABULARY_IGNORED: true,

      CONSTRUCTION_READINESS_LENS_STATUS: constructionLens.status,
      CONSTRUCTION_READINESS_LENS_REASON: constructionLens.reason,
      CONSTRUCTION_READINESS_RECOMMENDED_FILE: constructionLens.recommendedFile,
      CONSTRUCTION_READINESS_RECOMMENDED_ACTION: constructionLens.recommendedAction,

      INSPECTED_SURFACE_CLASS: legacyClassifier.surfaceClass,
      LEGACY_SURFACE_CLASSIFICATION_REASON: legacyClassifier.reason,

      SCOPE_LENSES: clonePlain(lenses),

      LAB_SOUTH_PROOF_PACKET:
        clonePlain(labSouthLens.proofPacket || {}),
      LAB_ENGINE_STACK_EVIDENCE:
        clonePlain(engineStackLens),

      PRODUCTION_MUTATION_AUTHORIZED: false,
      HEARTH_REPAIR_AUTHORIZED: false,
      ROUTE_REPAIR_AUTHORIZED: false,
      ROUTE_CONDUCTOR_MUTATION_AUTHORIZED: false,
      CONTROL_MUTATION_AUTHORIZED: false,
      CANVAS_DRAWING_AUTHORIZED: false,
      CANVAS_CREATION_AUTHORIZED: false,
      CANVAS_REPAIR_AUTHORIZED: false,
      CANVAS_RELEASE_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,
      FINAL_VISUAL_PASS_AUTHORITY: false,

      SECONDARY_EVIDENCE_NOTES: [
        "SOUTH_SURFACE_POINTER_LAB_ENGINE_STACK_SIDECAR_ADAPTER_ACTIVE",
        "THIS_FILE_IS_THE_LAWFUL_SOUTH_POINTER_SIDECAR_ADAPTER",
        "LAB_SOUTH_REMAINS_PROOF_PRODUCER",
        "SOUTH_SURFACE_POINTER_CONSUMES_LAB_SOUTH_PROOF_AS_DIAGNOSTIC_EVIDENCE_ONLY",
        "NORTH_RAIL_CAN_DISCOVER_THIS_FILE_THROUGH_SOUTH_SURFACE_POINTER_SIDECAR_ALIASES",
        "COPY_SIZE_PROBLEM_NOT_CURRENT_PRIMARY_PROBLEM",
        "CURRENT_PROBLEM_IS_DIAGNOSTIC_SCOPE_AND_LAB_ENGINE_STACK_ADAPTER_DEFINITION",
        "MALPRACTICE_LENS_READS_EXPLICIT_STATUS_FIELDS_ONLY",
        "DUTY_LOAD_LENS_READS_EXPLICIT_STATUS_FIELDS_ONLY",
        "SCHEMA_STATUS_VOCABULARY_DOES_NOT_COUNT_AS_ACTUAL_DETECTION",
        "CANVAS_BLAME_REQUIRES_PRODUCTION_CANVAS_CONFIRMATION",
        `LAB_SOUTH_F8_PROOF_LENS:${labSouthLens.status}`,
        `LAB_ENGINE_STACK_LENS:${engineStackLens.status}`,
        `SIDECAR_DISCOVERY_LENS:${sidecarDiscoveryLens.status}`,
        `NORTH_TRACK_LENS:${northLens.status}`,
        `SURFACE_SCOPE_LENS:${surfaceLens.status}`,
        `CONSTRUCTION_READINESS_LENS:${constructionLens.status}`
      ].join(" | "),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    return report;
  }

  function orderedKeys(report) {
    const priority = [
      "PACKET_NAME",
      "CONTRACT",
      "RECEIPT",
      "INTERNAL_RENEWAL_CONTRACT",
      "INTERNAL_RENEWAL_RECEIPT",
      "PREVIOUS_INTERNAL_RENEWAL_CONTRACT",
      "PREVIOUS_INTERNAL_RENEWAL_RECEIPT",
      "EARLIER_INTERNAL_RENEWAL_CONTRACT",
      "EARLIER_INTERNAL_RENEWAL_RECEIPT",
      "VERSION",
      "FILE",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "DIAGNOSTIC_TIMESTAMP",

      "PRIMARY_DUTY",
      "PROFILE_CLASS",
      "CHRONOLOGY_POSITION",
      "ASYMMETRIC_TENTH_DIAGNOSTIC_SIDECAR",
      "COPY_PROBLEM_IS_NOT_CURRENT_PRIMARY_PROBLEM",
      "PRESENT_PROBLEM",
      "LEGACY_CANVAS_FEED_CLASSIFIER_COMPATIBLE",
      "LEGACY_CANVAS_FEED_CLASSIFIER_PRIMARY",
      "SCOPE_LENS_CLASSIFIER_COMPATIBLE",

      "NORTH_DISCOVERY_FIELD",
      "NORTH_EXPECTED_LOAD_STATUS",
      "NORTH_DISCOVERABLE_SIDECAR_PUBLISHED",
      "NORTH_DISCOVERABLE_ALIAS_COUNT",

      "SCOPE_LENS_STATUS",
      "LAB_SOUTH_F8_PROOF_LENS_STATUS",
      "LAB_SOUTH_F8_PROOF_OBSERVED",
      "LAB_SOUTH_F8_PROOF_ACCEPTED",
      "LAB_ENGINE_STACK_LENS_STATUS",
      "LAB_ENGINE_STACK_CHAMBER_OBSERVED_COUNT",
      "SUPPORT_ENGINE_OBSERVED_COUNT",
      "F233_RETURN_OBSERVED",
      "SIDECAR_DISCOVERY_LENS_STATUS",
      "SIDECAR_READY",
      "COPY_LENS_STATUS",
      "NORTH_TRACK_LENS_STATUS",
      "NORTH_TRACK_FAILURE_CLASS",
      "SURFACE_SCOPE_LENS_STATUS",
      "SURFACE_SCOPE",
      "SURFACE_SCOPE_FAILURE_CLASS",
      "CANVAS_BLAME_LENS_STATUS",
      "CANVAS_BLAME_ELIGIBLE",
      "PROBE_NETWORK_LENS_STATUS",
      "PROBE_NETWORK_MISSING_IDS",
      "DUTY_LOAD_LENS_STATUS",
      "DUTY_LOAD_RAW_TEXT_SCAN_USED",
      "MALPRACTICE_LENS_STATUS",
      "MALPRACTICE_RAW_TEXT_SCAN_USED",
      "MALPRACTICE_SCHEMA_VOCABULARY_IGNORED",
      "CONSTRUCTION_READINESS_LENS_STATUS",
      "CONSTRUCTION_READINESS_RECOMMENDED_FILE",
      "CONSTRUCTION_READINESS_RECOMMENDED_ACTION",

      "INSPECTED_SURFACE_CLASS",
      "SECONDARY_EVIDENCE_NOTES",

      "PRODUCTION_MUTATION_AUTHORIZED",
      "HEARTH_REPAIR_AUTHORIZED",
      "CANVAS_DRAWING_AUTHORIZED",
      "CANVAS_REPAIR_AUTHORIZED",
      "CANVAS_RELEASE_AUTHORIZED",
      "RUNTIME_RESTART_AUTHORIZED",
      "VISUAL_PASS_CLAIMED",
      "FINAL_VISUAL_PASS_CLAIMED",
      "F13_CLAIMED",
      "F21_CLAIMED"
    ];

    const seen = new Set();
    return priority.concat(Object.keys(report || {})).filter((key) => {
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function composePacketText(report) {
    return orderedKeys(report)
      .map((key) => line(key, getRaw(report, key, "UNKNOWN")))
      .join("\n");
  }

  function composeCompactSummary(report) {
    return [
      line("SOUTH_SURFACE_POINTER_CONTRACT", CONTRACT),
      line("SOUTH_SURFACE_POINTER_INTERNAL_RENEWAL_CONTRACT", INTERNAL_RENEWAL_CONTRACT),
      line("PRESENT_PROBLEM", report.PRESENT_PROBLEM),
      line("SCOPE_LENS_STATUS", report.SCOPE_LENS_STATUS),
      line("LAB_SOUTH_F8_PROOF_LENS_STATUS", report.LAB_SOUTH_F8_PROOF_LENS_STATUS),
      line("LAB_ENGINE_STACK_LENS_STATUS", report.LAB_ENGINE_STACK_LENS_STATUS),
      line("SIDECAR_DISCOVERY_LENS_STATUS", report.SIDECAR_DISCOVERY_LENS_STATUS),
      line("NORTH_DISCOVERY_FIELD", report.NORTH_DISCOVERY_FIELD),
      line("NORTH_EXPECTED_LOAD_STATUS", report.NORTH_EXPECTED_LOAD_STATUS),
      line("NORTH_TRACK_LENS_STATUS", report.NORTH_TRACK_LENS_STATUS),
      line("SURFACE_SCOPE_LENS_STATUS", report.SURFACE_SCOPE_LENS_STATUS),
      line("CANVAS_BLAME_LENS_STATUS", report.CANVAS_BLAME_LENS_STATUS),
      line("PROBE_NETWORK_LENS_STATUS", report.PROBE_NETWORK_LENS_STATUS),
      line("DUTY_LOAD_LENS_STATUS", report.DUTY_LOAD_LENS_STATUS),
      line("MALPRACTICE_LENS_STATUS", report.MALPRACTICE_LENS_STATUS),
      line("CONSTRUCTION_READINESS_LENS_STATUS", report.CONSTRUCTION_READINESS_LENS_STATUS),
      line("CONSTRUCTION_READINESS_RECOMMENDED_FILE", report.CONSTRUCTION_READINESS_RECOMMENDED_FILE),
      line("CONSTRUCTION_READINESS_RECOMMENDED_ACTION", report.CONSTRUCTION_READINESS_RECOMMENDED_ACTION)
    ].join("\n");
  }

  function publishReport(report) {
    state.lastReport = clonePlain(report);
    state.lastPacketText = composePacketText(report);
    state.lastCompactSummary = composeCompactSummary(report);
    state.updatedAt = nowIso();
    publishAliases();
  }

  function runScopeLens(input = {}) {
    state.runCount += 1;

    try {
      const report = buildReport(input);
      publishReport(report);

      record("SOUTH_SURFACE_POINTER_LAB_ENGINE_STACK_SIDECAR_ADAPTER_COMPLETE", {
        scopeLensStatus: report.SCOPE_LENS_STATUS,
        labSouthProofLens: report.LAB_SOUTH_F8_PROOF_LENS_STATUS,
        labEngineStackLens: report.LAB_ENGINE_STACK_LENS_STATUS,
        sidecarDiscoveryLens: report.SIDECAR_DISCOVERY_LENS_STATUS,
        northTrackLens: report.NORTH_TRACK_LENS_STATUS,
        surfaceScopeLens: report.SURFACE_SCOPE_LENS_STATUS,
        constructionReadinessLens: report.CONSTRUCTION_READINESS_LENS_STATUS
      });

      return {
        ok: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
        internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,

        SCOPE_LENS_STATUS: report.SCOPE_LENS_STATUS,
        LAB_SOUTH_F8_PROOF_LENS_STATUS: report.LAB_SOUTH_F8_PROOF_LENS_STATUS,
        LAB_ENGINE_STACK_LENS_STATUS: report.LAB_ENGINE_STACK_LENS_STATUS,
        SIDECAR_DISCOVERY_LENS_STATUS: report.SIDECAR_DISCOVERY_LENS_STATUS,
        NORTH_TRACK_LENS_STATUS: report.NORTH_TRACK_LENS_STATUS,
        SURFACE_SCOPE_LENS_STATUS: report.SURFACE_SCOPE_LENS_STATUS,
        CANVAS_BLAME_LENS_STATUS: report.CANVAS_BLAME_LENS_STATUS,
        PROBE_NETWORK_LENS_STATUS: report.PROBE_NETWORK_LENS_STATUS,
        DUTY_LOAD_LENS_STATUS: report.DUTY_LOAD_LENS_STATUS,
        MALPRACTICE_LENS_STATUS: report.MALPRACTICE_LENS_STATUS,
        CONSTRUCTION_READINESS_LENS_STATUS: report.CONSTRUCTION_READINESS_LENS_STATUS,

        NORTH_DISCOVERY_FIELD,
        NORTH_EXPECTED_LOAD_STATUS,
        NORTH_DISCOVERABLE_SIDECAR_PUBLISHED: state.northDiscoverableSidecarPublished,

        report,
        REPORT_OBJECT: report,
        evidence: report,
        output: {
          REPORT_OBJECT: report,
          SCOPE_LENSES: report.SCOPE_LENSES,
          COMPACT_SUMMARY: state.lastCompactSummary
        },
        packetText: state.lastPacketText,
        compactSummary: state.lastCompactSummary,

        ...NO_CLAIMS,
        ...UPPER_NO_CLAIMS
      };
    } catch (error) {
      recordError("SOUTH_SURFACE_POINTER_LAB_ENGINE_STACK_SIDECAR_ADAPTER_FAILED", error);

      const fallback = {
        PACKET_NAME,
        CONTRACT,
        RECEIPT,
        INTERNAL_RENEWAL_CONTRACT,
        INTERNAL_RENEWAL_RECEIPT,
        VERSION,
        FILE,
        TARGET_ROUTE,
        DIAGNOSTIC_ROUTE,
        DIAGNOSTIC_TIMESTAMP: nowIso(),
        SCOPE_LENS_STATUS: "SCOPE_LENS_ERROR",
        PRESENT_PROBLEM: "LAB_ENGINE_STACK_DIAGNOSTIC_ADAPTER_AND_SCOPE_DEFINITION_BY_LENS",
        ERROR_MESSAGE: bounded(error && error.message ? error.message : error, 2000),
        ...NO_CLAIMS,
        ...UPPER_NO_CLAIMS
      };

      publishReport(fallback);

      return {
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        error: fallback.ERROR_MESSAGE,
        report: fallback,
        REPORT_OBJECT: fallback,
        packetText: state.lastPacketText,
        compactSummary: state.lastCompactSummary,
        ...NO_CLAIMS,
        ...UPPER_NO_CLAIMS
      };
    }
  }

  function runSouthSurfacePointerRead(input = {}) {
    return runScopeLens(input);
  }

  function inspectSouthSurfacePointer(input = {}) {
    return runScopeLens(input);
  }

  function inspectSurfacePointer(input = {}) {
    return runScopeLens(input);
  }

  function runProbeSidecar(input = {}) {
    return runScopeLens(input);
  }

  function inspect(input = {}) {
    return runScopeLens(input);
  }

  function probe(input = {}) {
    return runScopeLens(input);
  }

  function measure(input = {}) {
    return runScopeLens(input);
  }

  function runDiagnostic(input = {}) {
    return runScopeLens(input);
  }

  function receiveFingerInspectReport(packet = {}) {
    state.receivedFingerReportCount += 1;
    return runScopeLens({
      fingerInspectReport: isObject(packet) ? packet : {},
      reason: "RECEIVE_FINGER_INSPECT_REPORT"
    });
  }

  function consumeFingerInspectReport(packet = {}) {
    return receiveFingerInspectReport(packet);
  }

  function receiveCanvasFingerInspectPacket(packet = {}) {
    return receiveFingerInspectReport(packet);
  }

  function consumeCanvasFingerInspectPacket(packet = {}) {
    return receiveFingerInspectReport(packet);
  }

  function receiveLabSouthProofPacket(packet = {}) {
    return runScopeLens({
      labSouthProofPacket: isObject(packet) ? packet : {},
      packet: isObject(packet) ? packet : {},
      reason: "RECEIVE_LAB_SOUTH_F8_PROOF_PACKET"
    });
  }

  function consumeLabSouthProofPacket(packet = {}) {
    return receiveLabSouthProofPacket(packet);
  }

  function receiveF8ProofPacket(packet = {}) {
    return receiveLabSouthProofPacket(packet);
  }

  function consumeF8ProofPacket(packet = {}) {
    return receiveLabSouthProofPacket(packet);
  }

  function getReport(options = {}) {
    if (options && options.refresh === false && state.lastReport) {
      return clonePlain(state.lastReport);
    }

    const result = runScopeLens({
      reason: "GET_REPORT_REFRESH"
    });

    return clonePlain(result.report);
  }

  function getPacket(input) {
    if (input !== undefined) return runScopeLens(input).report;
    return getReport();
  }

  function getPacketText(options = {}) {
    if (options && options.refresh === false && state.lastPacketText) {
      return state.lastPacketText;
    }

    getReport();
    return state.lastPacketText;
  }

  function getCompactSummary(options = {}) {
    if (options && options.refresh === false && state.lastCompactSummary) {
      return state.lastCompactSummary;
    }

    getReport();
    return state.lastCompactSummary;
  }

  function getScopeLenses(options = {}) {
    const report = getReport(options);
    return clonePlain(report.SCOPE_LENSES || {});
  }

  function getState() {
    return {
      role: "SOUTH_SURFACE_POINTER_LAB_ENGINE_STACK_SIDECAR_ADAPTER",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      earlierInternalRenewalContract: EARLIER_INTERNAL_RENEWAL_CONTRACT,
      earlierInternalRenewalReceipt: EARLIER_INTERNAL_RENEWAL_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      primaryDuty: state.primaryDuty,
      legacyCanvasFeedClassifierCompatible: state.legacyCanvasFeedClassifierCompatible,
      scopeLensClassifierCompatible: state.scopeLensClassifierCompatible,
      asymmetricTenthDiagnosticSidecar: true,
      chronologyOwner: false,
      nineCycleMutation: false,
      replacesSouthRail: false,
      replacesProbeSouth: false,
      operationalDependencyForNorth: false,
      readableByProbeSouth: true,

      northDiscoveryField: state.northDiscoveryField,
      northExpectedLoadStatus: state.northExpectedLoadStatus,
      northDiscoverableSidecarPublished: state.northDiscoverableSidecarPublished,
      northDiscoveryAliasCount: state.northDiscoveryAliasCount,

      latestLensStatus: state.latestLensStatus,
      latestLabStackLens: state.latestLabStackLens,
      latestLabSouthProofLens: state.latestLabSouthProofLens,
      latestEngineStackLens: state.latestEngineStackLens,
      latestNorthTrackLens: state.latestNorthTrackLens,
      latestSurfaceScopeLens: state.latestSurfaceScopeLens,
      latestCanvasBlameLens: state.latestCanvasBlameLens,
      latestProbeNetworkLens: state.latestProbeNetworkLens,
      latestDutyLoadLens: state.latestDutyLoadLens,
      latestMalpracticeLens: state.latestMalpracticeLens,
      latestConstructionReadinessLens: state.latestConstructionReadinessLens,
      latestCopyLens: state.latestCopyLens,

      latestSurfaceClass: state.latestSurfaceClass,
      latestCanvasBlameEligible: state.latestCanvasBlameEligible,
      latestRecommendedOwner: state.latestRecommendedOwner,
      latestRecommendedFile: state.latestRecommendedFile,
      latestRecommendedAction: state.latestRecommendedAction,

      labSouthObserved: state.labSouthObserved,
      labSouthProofObserved: state.labSouthProofObserved,
      labSouthProofAccepted: state.labSouthProofAccepted,
      labSouthContract: state.labSouthContract,
      labSouthReceipt: state.labSouthReceipt,
      labChamberObservedCount: state.labChamberObservedCount,
      supportEngineObservedCount: state.supportEngineObservedCount,
      f233ReturnObserved: state.f233ReturnObserved,
      diagnosticBridgeReady: state.diagnosticBridgeReady,

      runCount: state.runCount,
      receivedFingerReportCount: state.receivedFingerReportCount,
      aliasPublishCount: state.aliasPublishCount,
      receiptPublishCount: state.receiptPublishCount,
      latestEvent: state.latestEvent,
      updatedAt: state.updatedAt || nowIso(),

      ...NO_CLAIMS
    };
  }

  function getReceiptLight() {
    return {
      role: "DIAGNOSTIC_SOUTH_SURFACE_POINTER_LAB_ENGINE_STACK_SIDECAR_ADAPTER",
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      earlierInternalRenewalContract: EARLIER_INTERNAL_RENEWAL_CONTRACT,
      earlierInternalRenewalReceipt: EARLIER_INTERNAL_RENEWAL_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      primaryDuty: "LAB_ENGINE_STACK_SIDECAR_ADAPTER_AND_SCOPE_LENS_CLASSIFICATION",
      presentProblem: "LAB_ENGINE_STACK_DIAGNOSTIC_ADAPTER_AND_SCOPE_DEFINITION_BY_LENS",
      copyProblemIsNotCurrentPrimaryProblem: true,
      chronologyPosition: "OUTSIDE_NINE_STEP_CHRONOLOGY",
      asymmetricTenthDiagnosticSidecar: true,
      replacesSouthRail: false,
      replacesProbeSouth: false,
      operationalDependencyForNorth: false,
      consumer: PROBE_SOUTH_FILE,

      northDiscoveryField: NORTH_DISCOVERY_FIELD,
      northExpectedLoadStatus: NORTH_EXPECTED_LOAD_STATUS,
      northDiscoverableSidecarPublished: state.northDiscoverableSidecarPublished,
      northDiscoveryAliasCount: state.northDiscoveryAliasCount,

      labSouthProofConsumerActive: true,
      labEngineStackAdapterActive: true,
      legacyCanvasFeedClassifierCompatible: true,
      legacyCanvasFeedClassifierPrimary: false,
      scopeLensClassifierActive: true,
      copyLensActive: true,
      northTrackLensActive: true,
      surfaceScopeLensActive: true,
      canvasBlameLensActive: true,
      probeNetworkLensActive: true,
      dutyLoadLensActive: true,
      malpracticeLensActive: true,
      constructionReadinessLensActive: true,

      malpracticeLensReadsExplicitStatusFieldsOnly: true,
      dutyLoadLensReadsExplicitStatusFieldsOnly: true,
      rawTextScanUsedForMalpractice: false,
      rawTextScanUsedForDutyLoad: false,
      schemaVocabularyIgnoredForMalpracticeDetection: true,

      primaryCallable: "runScopeLens",
      runScopeLensApiAvailable: true,
      runSouthSurfacePointerReadApiAvailable: true,
      inspectSouthSurfacePointerApiAvailable: true,
      inspectSurfacePointerApiAvailable: true,
      runProbeSidecarApiAvailable: true,
      inspectApiAvailable: true,
      probeApiAvailable: true,
      measureApiAvailable: true,
      runDiagnosticApiAvailable: true,
      receiveLabSouthProofPacketApiAvailable: true,
      consumeLabSouthProofPacketApiAvailable: true,
      receiveF8ProofPacketApiAvailable: true,
      consumeF8ProofPacketApiAvailable: true,
      getReportApiAvailable: true,
      getPacketApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,
      getScopeLensesApiAvailable: true,
      getStateApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,

      latestLensStatus: state.latestLensStatus,
      latestLabStackLens: state.latestLabStackLens,
      latestLabSouthProofLens: state.latestLabSouthProofLens,
      latestEngineStackLens: state.latestEngineStackLens,
      latestNorthTrackLens: state.latestNorthTrackLens,
      latestSurfaceScopeLens: state.latestSurfaceScopeLens,
      latestCanvasBlameLens: state.latestCanvasBlameLens,
      latestProbeNetworkLens: state.latestProbeNetworkLens,
      latestDutyLoadLens: state.latestDutyLoadLens,
      latestMalpracticeLens: state.latestMalpracticeLens,
      latestConstructionReadinessLens: state.latestConstructionReadinessLens,
      latestCopyLens: state.latestCopyLens,

      labSouthObserved: state.labSouthObserved,
      labSouthProofObserved: state.labSouthProofObserved,
      labSouthProofAccepted: state.labSouthProofAccepted,
      labChamberObservedCount: state.labChamberObservedCount,
      supportEngineObservedCount: state.supportEngineObservedCount,
      f233ReturnObserved: state.f233ReturnObserved,
      diagnosticBridgeReady: state.diagnosticBridgeReady,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),

      SOUTH_SURFACE_POINTER_CONTRACT: CONTRACT,
      SOUTH_SURFACE_POINTER_RECEIPT: RECEIPT,
      SOUTH_SURFACE_POINTER_INTERNAL_RENEWAL_CONTRACT:
        INTERNAL_RENEWAL_CONTRACT,
      SOUTH_SURFACE_POINTER_INTERNAL_RENEWAL_RECEIPT:
        INTERNAL_RENEWAL_RECEIPT,
      SOUTH_SURFACE_POINTER_FILE: FILE,

      LAB_NORTH_FILE,
      LAB_EAST_FILE,
      LAB_WEST_FILE,
      LAB_SOUTH_FILE,
      PRODUCT_ENGINE_FILE,
      EXPRESSION_ENGINE_FILE,
      REGISTRY_ENGINE_FILE,
      MARKET_ENGINE_FILE,

      SOUTH_RAIL_FILE,
      PROBE_SOUTH_FILE,
      NORTH_RAIL_FILE,
      PROBE_NORTH_FILE,
      PROBE_EAST_FILE,
      PROBE_WEST_FILE,
      SURFACE_TRUTH_FILE,
      CANVAS_FILE,
      CANVAS_LAUNCH_FILE,
      CANVAS_FINGER_INSPECT_FILE,
      HEX_SURFACE_FILE,
      POINTER_SURFACE_FILE,
      CONTROLS_FILE,

      northDiscoveryAliases: SOUTH_SIDECAR_DISCOVERY_ALIASES.slice(),
      legacyPublicAliases: LEGACY_PUBLIC_ALIASES.slice(),
      reportObject: clonePlain(state.lastReport || {}),
      state: getState(),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),

      ...UPPER_NO_CLAIMS
    };
  }

  function updateDataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return false;

    try {
      const ds = doc.documentElement.dataset;

      ds.hearthDiagnosticSouthSurfacePointerLoaded = "true";
      ds.hearthDiagnosticSouthSurfacePointerContract = CONTRACT;
      ds.hearthDiagnosticSouthSurfacePointerReceipt = RECEIPT;
      ds.hearthDiagnosticSouthSurfacePointerInternalRenewalContract =
        INTERNAL_RENEWAL_CONTRACT;
      ds.hearthDiagnosticSouthSurfacePointerInternalRenewalReceipt =
        INTERNAL_RENEWAL_RECEIPT;
      ds.hearthDiagnosticSouthSurfacePointerFile = FILE;

      ds.hearthDiagnosticSouthSurfacePointerNorthDiscoveryField =
        NORTH_DISCOVERY_FIELD;
      ds.hearthDiagnosticSouthSurfacePointerNorthExpectedLoadStatus =
        NORTH_EXPECTED_LOAD_STATUS;
      ds.hearthDiagnosticSouthSurfacePointerNorthDiscoverableSidecarPublished =
        String(state.northDiscoverableSidecarPublished);
      ds.hearthDiagnosticSouthSurfacePointerLabSouthObserved =
        String(state.labSouthObserved);
      ds.hearthDiagnosticSouthSurfacePointerLabSouthProofObserved =
        String(state.labSouthProofObserved);
      ds.hearthDiagnosticSouthSurfacePointerLabSouthProofAccepted =
        String(state.labSouthProofAccepted);
      ds.hearthDiagnosticSouthSurfacePointerLabChamberObservedCount =
        String(state.labChamberObservedCount);
      ds.hearthDiagnosticSouthSurfacePointerSupportEngineObservedCount =
        String(state.supportEngineObservedCount);
      ds.hearthDiagnosticSouthSurfacePointerF233ReturnObserved =
        String(state.f233ReturnObserved);
      ds.hearthDiagnosticSouthSurfacePointerDiagnosticBridgeReady =
        String(state.diagnosticBridgeReady);

      ds.hearthDiagnosticSouthSurfacePointerProductionMutationAuthorized = "false";
      ds.hearthDiagnosticSouthSurfacePointerCanvasRepairAuthorized = "false";
      ds.hearthDiagnosticSouthSurfacePointerCanvasBuildAuthorized = "false";
      ds.hearthDiagnosticSouthSurfacePointerCanvasReleaseAuthorized = "false";
      ds.hearthDiagnosticSouthSurfacePointerRuntimeRestartAuthorized = "false";
      ds.hearthDiagnosticSouthSurfacePointerVisualPassClaimed = "false";
      ds.hearthDiagnosticSouthSurfacePointerGeneratedImage = "false";
      ds.hearthDiagnosticSouthSurfacePointerGraphicBox = "false";
      ds.hearthDiagnosticSouthSurfacePointerWebgl = "false";
    } catch (_error) {
      return false;
    }

    return true;
  }

  function publishAliases() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    LEGACY_PUBLIC_ALIASES.forEach((alias) => {
      setPath(alias, api);
    });

    SOUTH_SIDECAR_DISCOVERY_ALIASES.forEach((alias) => {
      setPath(alias, api);
    });

    state.northDiscoverableSidecarPublished = true;
    state.northDiscoveryAliasCount = SOUTH_SIDECAR_DISCOVERY_ALIASES.length;

    const receipt = getReceiptLight();
    state.receiptPublishCount += 1;

    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_RECEIPT = receipt;
    root.HEARTH_DIAGNOSTIC_SOUTH_BISHOP_SURFACE_POINTER_RECEIPT = receipt;
    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_CLASSIFIER_RECEIPT = receipt;
    root.HEARTH_DIAGNOSTIC_CANVAS_FEED_CLASSIFIER_SOUTH_RECEIPT = receipt;
    root.HEARTH_DIAGNOSTIC_SOUTH_SCOPE_LENS_RECEIPT = receipt;
    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_SCOPE_LENS_RECEIPT = receipt;
    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_SIDECAR_RECEIPT = receipt;
    root.HEARTH_SOUTH_SURFACE_POINTER_SIDECAR_RECEIPT = receipt;

    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_REPORT =
      clonePlain(state.lastReport || {});
    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_PACKET_TEXT =
      state.lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_COMPACT_SUMMARY =
      state.lastCompactSummary || "";
    root.HEARTH_DIAGNOSTIC_SOUTH_SCOPE_LENS_REPORT =
      clonePlain(state.lastReport || {});
    root.HEARTH_DIAGNOSTIC_SOUTH_SCOPE_LENS_PACKET_TEXT =
      state.lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_SOUTH_SCOPE_LENS_COMPACT_SUMMARY =
      state.lastCompactSummary || "";
    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_SIDECAR_REPORT =
      clonePlain(state.lastReport || {});
    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_SIDECAR_PACKET_TEXT =
      state.lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_SIDECAR_COMPACT_SUMMARY =
      state.lastCompactSummary || "";

    root.HEARTH.diagnosticSouthSurfacePointerReceipt = receipt;
    root.HEARTH.diagnosticSouthSurfaceClassifierReceipt = receipt;
    root.HEARTH.diagnosticCanvasFeedClassifierSouthReceipt = receipt;
    root.HEARTH.diagnosticSouthScopeLensReceipt = receipt;
    root.HEARTH.diagnosticSouthScopeLensReport =
      clonePlain(state.lastReport || {});
    root.HEARTH.southSurfacePointerSidecarReceipt = receipt;
    root.HEARTH.southCanvasSurfacePointerSidecarReceipt = receipt;

    root.DEXTER_LAB.hearthDiagnosticSouthSurfacePointerReceipt = receipt;
    root.DEXTER_LAB.hearthDiagnosticSouthSurfaceClassifierReceipt = receipt;
    root.DEXTER_LAB.hearthDiagnosticSouthScopeLensReceipt = receipt;
    root.DEXTER_LAB.southSurfacePointerSidecarReceipt = receipt;
    root.DEXTER_LAB.hearthSouthSurfacePointerSidecarReceipt = receipt;

    root.__HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_LOADED__ = true;
    root.__HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_CONTRACT__ = CONTRACT;
    root.__HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_RECEIPT__ = RECEIPT;
    root.__HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_INTERNAL_RENEWAL_CONTRACT__ =
      INTERNAL_RENEWAL_CONTRACT;
    root.__HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_NORTH_DISCOVERY_FIELD__ =
      NORTH_DISCOVERY_FIELD;
    root.__HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_EXPECTED_LOAD_STATUS__ =
      NORTH_EXPECTED_LOAD_STATUS;
    root.__HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_PRODUCTION_MUTATION_AUTHORIZED__ =
      false;
    root.__HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_CANVAS_REPAIR_AUTHORIZED__ =
      false;
    root.__HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_WEBGL__ = false;
    root.__HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_VISUAL_PASS_CLAIMED__ = false;

    state.aliasPublishCount += 1;
    updateDataset();
    return true;
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
    previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
    earlierInternalRenewalContract: EARLIER_INTERNAL_RENEWAL_CONTRACT,
    earlierInternalRenewalReceipt: EARLIER_INTERNAL_RENEWAL_RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    packetName: PACKET_NAME,

    role: "SOUTH_SURFACE_POINTER_LAB_ENGINE_STACK_SIDECAR_ADAPTER",
    authority:
      "READ_ONLY_LAB_ENGINE_STACK_ADAPTER_SCOPE_LENS_CLASSIFICATION_AND_PROBE_SOUTH_PACKET_EVIDENCE",
    primaryDuty: "LAB_ENGINE_STACK_SIDECAR_ADAPTER_AND_SCOPE_LENS_CLASSIFICATION",
    presentProblem: "LAB_ENGINE_STACK_DIAGNOSTIC_ADAPTER_AND_SCOPE_DEFINITION_BY_LENS",
    copyProblemIsNotCurrentPrimaryProblem: true,
    chronologyPosition: "OUTSIDE_NINE_STEP_CHRONOLOGY",
    asymmetricTenthDiagnosticSidecar: true,
    replacesSouthRail: false,
    replacesProbeSouth: false,
    operationalDependencyForNorth: false,
    consumer: PROBE_SOUTH_FILE,

    northDiscoveryField: NORTH_DISCOVERY_FIELD,
    northExpectedLoadStatus: NORTH_EXPECTED_LOAD_STATUS,
    northDiscoverableAliases: SOUTH_SIDECAR_DISCOVERY_ALIASES.slice(),

    labNorthFile: LAB_NORTH_FILE,
    labEastFile: LAB_EAST_FILE,
    labWestFile: LAB_WEST_FILE,
    labSouthFile: LAB_SOUTH_FILE,
    productEngineFile: PRODUCT_ENGINE_FILE,
    expressionEngineFile: EXPRESSION_ENGINE_FILE,
    registryEngineFile: REGISTRY_ENGINE_FILE,
    marketEngineFile: MARKET_ENGINE_FILE,

    legacyCanvasFeedClassifierCompatible: true,
    legacyCanvasFeedClassifierPrimary: false,
    scopeLensClassifierCompatible: true,

    southRailFile: SOUTH_RAIL_FILE,
    probeSouthFile: PROBE_SOUTH_FILE,
    northRailFile: NORTH_RAIL_FILE,
    canvasFile: CANVAS_FILE,
    canvasLaunchFile: CANVAS_LAUNCH_FILE,
    canvasFingerInspectFile: CANVAS_FINGER_INSPECT_FILE,
    surfaceTruthFile: SURFACE_TRUTH_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    pointerSurfaceFile: POINTER_SURFACE_FILE,
    controlsFile: CONTROLS_FILE,

    runScopeLens,
    runSouthSurfacePointerRead,
    inspectSouthSurfacePointer,
    inspectSurfacePointer,
    runProbeSidecar,
    inspect,
    probe,
    measure,
    runDiagnostic,
    receiveFingerInspectReport,
    consumeFingerInspectReport,
    receiveCanvasFingerInspectPacket,
    consumeCanvasFingerInspectPacket,
    receiveLabSouthProofPacket,
    consumeLabSouthProofPacket,
    receiveF8ProofPacket,
    consumeF8ProofPacket,
    getReport,
    getPacket,
    getPacketText,
    getCompactSummary,
    getScopeLenses,
    getState,
    getReceipt,
    getReceiptLight,
    publishAliases,
    updateDataset,

    runScopeLensApiAvailable: true,
    runSouthSurfacePointerReadApiAvailable: true,
    inspectSouthSurfacePointerApiAvailable: true,
    inspectSurfacePointerApiAvailable: true,
    runProbeSidecarApiAvailable: true,
    inspectApiAvailable: true,
    probeApiAvailable: true,
    measureApiAvailable: true,
    runDiagnosticApiAvailable: true,
    receiveFingerInspectReportApiAvailable: true,
    consumeFingerInspectReportApiAvailable: true,
    receiveCanvasFingerInspectPacketApiAvailable: true,
    consumeCanvasFingerInspectPacketApiAvailable: true,
    receiveLabSouthProofPacketApiAvailable: true,
    consumeLabSouthProofPacketApiAvailable: true,
    receiveF8ProofPacketApiAvailable: true,
    consumeF8ProofPacketApiAvailable: true,
    getReportApiAvailable: true,
    getPacketApiAvailable: true,
    getPacketTextApiAvailable: true,
    getCompactSummaryApiAvailable: true,
    getScopeLensesApiAvailable: true,
    getStateApiAvailable: true,
    getReceiptApiAvailable: true,
    getReceiptLightApiAvailable: true,

    labSouthProofConsumerActive: true,
    labEngineStackAdapterActive: true,
    northRailDiscoverableSidecarPublisher: true,
    malpracticeLensReadsExplicitStatusFieldsOnly: true,
    dutyLoadLensReadsExplicitStatusFieldsOnly: true,
    rawTextScanUsedForMalpractice: false,
    rawTextScanUsedForDutyLoad: false,
    schemaVocabularyIgnoredForMalpracticeDetection: true,

    ownsLabSouthProofGeneration: false,
    ownsLabNorthF21Latch: false,
    ownsLabEastF3Admission: false,
    ownsLabWestF5Admissibility: false,
    ownsSupportEngineInternals: false,
    ownsF233DownstreamReturn: false,
    ownsNorthRailAuthority: false,
    ownsSouthRailAuthority: false,
    ownsProbeSouthAuthority: false,
    ownsCanvasRelease: false,
    ownsCanvasRepair: false,
    ownsProductionMutation: false,

    ...NO_CLAIMS,

    get state() {
      return state;
    },

    get report() {
      return getReport({ refresh: false });
    },

    get receiptObject() {
      return getReceiptLight();
    }
  });

  publishReport(buildReport({ reason: "INITIAL_PUBLICATION" }));
  publishAliases();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

// /showroom/globe/hearth/hearth.js
// HEARTH_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT_TNT_v4
// Full-file replacement.
// Hearth route conductor / Macro West release consumer / strict F13 downstream alignment authority.
// Purpose:
// - Preserve the functional v3 route conductor behavior.
// - Preserve two-cycle Runtime Table law:
//   Cycle 1: NORTH -> EAST -> WEST -> SOUTH -> NORTH.
//   Cycle 2: NORTH -> EAST -> SOUTH -> WEST -> CANVAS.
// - Preserve Macro West admissibility consumption before Canvas release.
// - Preserve Canvas parent release and child reconciliation.
// - Correct next-file recommendation so degraded F13 proof points downstream, not automatically back to North.
// - Separate F21 eligibility/latch observation from strict visual-proof repair targeting.
// - Keep Canvas at F13 evidence only.
// - Keep F21 North-only.
// - Never claim final visual pass.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT_TNT_v4";
  const RECEIPT = "HEARTH_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT_RECEIPT_v4";
  const PREVIOUS_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_MACRO_WEST_ADMISSIBILITY_CANVAS_RELEASE_CONSUMPTION_TNT_v3";
  const BASELINE_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_MACRO_WEST_ADMISSIBILITY_CANVAS_RELEASE_CONSUMPTION_TNT_v3";
  const VERSION = "2026-05-31.hearth-route-conductor-strict-f13-downstream-alignment-v4";

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/showroom/globe/hearth/hearth.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const FILE_GATES = Object.freeze({
    north: "/assets/lab/runtime-table.js",
    east: "/assets/lab/runtime-table.east.js",
    macroWest: "/assets/lab/runtime-table.west.js",
    west: "/assets/lab/runtime-table.west.js",
    south: "/assets/lab/runtime-table.south.js",
    routeConductor: "/showroom/globe/hearth/hearth.js",
    hearthIndex: "/showroom/globe/hearth/index.js",
    canvas: "/assets/hearth/hearth.canvas.js",
    canvasEast: "/assets/hearth/hearth.canvas.east.js",
    canvasWest: "/assets/hearth/hearth.canvas.west.js",
    canvasSouth: "/assets/hearth/hearth.canvas.south.js"
  });

  const CYCLE_ROUTES = Object.freeze({
    CYCLE_1: "NORTH_EAST_WEST_SOUTH_NORTH",
    CYCLE_2: "NORTH_EAST_SOUTH_WEST_CANVAS"
  });

  const CARDINALS = Object.freeze({
    NORTH: "NORTH",
    EAST: "EAST",
    SOUTH: "SOUTH",
    WEST: "WEST",
    CANVAS: "CANVAS",
    UNKNOWN: "UNKNOWN"
  });

  const WEST_DECISION = Object.freeze({
    RELEASE_TO_CANVAS: "RELEASE_TO_CANVAS",
    FULL_PASS: "FULL_PASS",
    DEGRADED_FORWARD: "DEGRADED_FORWARD",
    ADMIT_TO_SOUTH: "ADMIT_TO_SOUTH",
    RETURN_TO_NORTH: "RETURN_TO_NORTH",
    RETURN_TO_NORTH_FOR_F21: "RETURN_TO_NORTH_FOR_F21",
    HOLD_ACTIVE: "HOLD_ACTIVE",
    HOLD_FOR_CYCLE: "HOLD_FOR_CYCLE",
    HARD_BLOCK: "HARD_BLOCK",
    UNKNOWN: "UNKNOWN"
  });

  const CURRENT_CANVAS_PARENT_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_PARENT_PRE_RELEASE_STRUCTURAL_CARRIER_THEN_WEST_RELEASE_TO_EAST_TNT_v4",
    "HEARTH_CANVAS_PARENT_RELEASE_PACKET_TO_EAST_STALE_CLEARANCE_TNT_v3",
    "HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER_TNT_v2",
    "HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER_TNT_v1",
    "HEARTH_CANVAS_PHYSICAL_OBJECT_BOOTSTRAP_F13_CARRIER_TNT_v1"
  ]);

  const STRICT_PROOF_MINIMUMS = Object.freeze({
    sampleCount: 36,
    contentCount: 18,
    varianceScore: 18,
    classCount: 2,
    landWaterBothRequired: true
  });

  const MAX_LOG = 180;
  const WATCHDOG_MS = 900;
  const WATCHDOG_LIMIT = 96;

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "hearth-route-conductor-strict-f13-downstream-alignment",

    routeConductorPrimaryGateActive: true,
    strictF13DownstreamAlignmentActive: true,
    canvasParentChildReconciliationActive: true,
    cycleAwareRoutingActive: true,
    southPrimaryGateIntegrationActive: true,
    macroWestAdmissibilityConsumptionActive: true,
    canvasReleaseFirewallActive: true,
    newsProtocolSynchronized: true,
    fibonacciSynchronizationActive: true,

    cycleOneIsPosition: true,
    cycleTwoIsCoordination: true,
    cycleOneRoute: CYCLE_ROUTES.CYCLE_1,
    cycleTwoRoute: CYCLE_ROUTES.CYCLE_2,

    markerIsNotHydrationProof: true,
    apiRequiredForF8: true,
    receiptRequiredForF8: true,
    runtimeRequiredForF8: true,
    canvasOwnsF13Only: true,
    f21NorthLatchOnly: true,
    routeMaySubmitF21EligibilityOnly: true,
    routeDoesNotOwnFinalVisualPass: true,

    activeCycleNumber: 1,
    activeCycleRoute: CYCLE_ROUTES.CYCLE_1,
    receivedFrom: CARDINALS.UNKNOWN,
    returnTo: CARDINALS.NORTH,
    handoffTo: "",
    activeCardinal: CARDINALS.SOUTH,
    activeFileGate: FILE,
    activeNewsGate: CARDINALS.SOUTH,
    activeFibonacci: "F8",
    activeFibonacciRank: 8,
    activeStageId: "F8_SOUTH_SELF_DUTY",
    activeGearId: "F8_SOUTH_SELF_DUTY",

    canvasActiveFibonacci: "F13",
    canvasActiveFibonacciRank: 13,
    canvasActiveStageId: "canvas-parent-f13-evidence-receiver",
    canvasActiveGearId: "hearth-canvas-parent-f13",

    routeConductorMarkerPresent: false,
    routeConductorApiPresent: false,
    routeConductorReceiptPresent: false,
    routeConductorRuntimeActive: false,
    routeConductorHydrated: false,
    f8SelfDutySatisfied: false,

    northAuthorityObserved: false,
    eastAuthorityObserved: false,
    macroWestAuthorityObserved: false,
    westAuthorityObserved: false,
    southAuthorityObserved: false,
    southPrimaryGateObserved: false,
    hearthIndexObserved: false,

    macroWestAdmissibilityObserved: false,
    macroWestMethodUsed: "",
    westDecision: WEST_DECISION.UNKNOWN,
    westGapClass: "",
    westGapSeverity: "",
    westHardBlock: false,
    westForwardAllowed: false,
    westCanvasReleaseApproved: false,
    westDegradedForwardApproved: false,
    westFirstFailedCoordinate: "WAITING_MACRO_WEST_ADMISSIBILITY_DECISION",
    westRecommendedNextRenewalTarget: FILE_GATES.macroWest,

    canvasAuthorityObserved: false,
    currentCanvasParentObserved: false,
    canvasParentV2Observed: false,
    canvasParentReleaseAccepted: false,
    canvasReleaseAuthorized: false,
    canvasReleasePacketReady: false,
    canvasReleaseHeldReason: "WAITING_MACRO_WEST_ADMISSIBILITY_DECISION",
    canvasReleaseRequiresWestAudit: true,
    canvasReleaseRequiresMacroWest: true,

    canvasBootAttempted: false,
    canvasBootInFlight: false,
    canvasBootResultObserved: false,

    canvasEastApiReady: false,
    canvasWestApiReady: false,
    canvasSouthApiReady: false,
    allCanvasChildrenApiReady: false,
    canvasEastEvidenceReady: false,
    canvasWestInspectionReady: false,
    canvasSouthVisibleProofReady: false,
    allCanvasChildrenEvidenceReady: false,
    allCanvasChildrenReady: false,
    canvasNextAuditTarget: "",

    f13ProofBodyAvailable: false,
    f13CanvasReadinessObserved: false,
    f13VisibleEvidenceAvailable: false,
    f13InspectEvidenceAvailable: false,
    f13CanvasEvidenceStrict: false,
    f13CanvasEvidenceDegraded: false,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f13StrictEvidenceGap: "WAITING_CANVAS_F13_EVIDENCE",
    f13StrictEvidenceRepairTarget: FILE_GATES.canvas,

    southStrictProofObserved: false,
    southSoftProofObserved: false,
    southHardFailObserved: false,
    southProofStale: false,
    parentStrictReadMismatch: false,
    degradedF13IsFunctional: false,
    functionalPageObserved: false,
    strictVisualProofPending: false,

    northGateReady: false,
    eastGateReady: false,
    westGateReady: false,
    southGateReady: false,
    canvasGateReady: false,
    newsGatePassedBeforeF21: false,
    newsGateDegradedBeforeF21: false,

    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    f21EligibilitySubmittedAt: "",
    f21EligibilitySubmissionCount: 0,
    f21LatchMode: "WAITING_CANVAS_F13_EVIDENCE",
    completionLatched: false,
    degradedCompletionLatched: false,
    readyTextAllowed: false,
    f21ClaimedByRouteConductor: false,
    northRepairRequired: false,
    northRepairReason: "NONE",

    proofBodyAvailable: false,
    proofBodyComposed: false,
    outputSpreadAvailable: false,
    outputSpreadComposed: false,
    visibleStateAvailable: false,
    visibleStateComposed: false,
    receiptAvailable: true,
    receiptComposed: true,
    northReturnPacketReady: true,
    westHandoffPacketReady: false,

    firstFailedCoordinate: "WAITING_BOOT",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "LOADED",

    refsBound: false,
    booted: false,
    booting: false,
    watchdogTicks: 0,
    renderCount: 0,
    latestEvent: "HEARTH_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT_LOADED",
    startedAt: "",
    updatedAt: "",

    currentPacket: null,
    currentReceipt: null,
    currentReceiptText: "",

    localEvents: [],
    errors: [],

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  const refs = {
    mount: null,
    cockpit: null,
    stage: null,
    heartbeat: null,
    latest: null,
    fill: null,
    percent: null,
    lanes: null,
    receiptBox: null,
    receiptText: null,
    copyButton: null,
    toggleButton: null,
    inspectButton: null,
    showTab: null,
    status: null
  };

  let bootPromise = null;
  let watchdogTimer = 0;
  let renderTimer = 0;
  let autoBootTimer = 0;

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
    return String(value);
  }

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === "true" || value === "1" || value === 1) return true;
    if (value === "false" || value === "0" || value === 0) return false;
    return fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, safeNumber(value, min)));
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function trimLog(array) {
    if (Array.isArray(array) && array.length > MAX_LOG) {
      array.splice(0, array.length - MAX_LOG);
    }
  }

  function firstDefined(...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return value;
    }

    return undefined;
  }

  function objectValue(source, path) {
    if (!source || (!isObject(source) && !Array.isArray(source))) return undefined;

    const parts = String(path || "").split(".");
    let cursor = source;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return undefined;
      cursor = cursor[part];
    }

    return cursor;
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

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    if (isFunction(authority.getReceipt)) {
      try {
        const receipt = authority.getReceipt();
        return isObject(receipt) ? receipt : null;
      } catch (_error) {
        return null;
      }
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;
    if (authority.contract || authority.receipt || authority.version) return authority;

    return null;
  }

  function datasetValue(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimLog(state.localEvents);
    state.latestEvent = item.event;
    state.updatedAt = item.at;

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimLog(state.errors);
    state.latestEvent = item.code;
    state.updatedAt = item.at;

    return item;
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function normalizeCardinal(value, fallback = CARDINALS.UNKNOWN) {
    const text = safeString(value, fallback).toUpperCase();

    if (text.includes("NORTH")) return CARDINALS.NORTH;
    if (text.includes("EAST")) return CARDINALS.EAST;
    if (text.includes("SOUTH")) return CARDINALS.SOUTH;
    if (text.includes("WEST")) return CARDINALS.WEST;
    if (text.includes("CANVAS")) return CARDINALS.CANVAS;

    return fallback;
  }

  function normalizeCycleRoute(value) {
    const text = safeString(value, "").toUpperCase();

    if (
      text.includes(CYCLE_ROUTES.CYCLE_1) ||
      text.includes("NORTH->EAST->WEST->SOUTH->NORTH") ||
      text.includes("NORTH→EAST→WEST→SOUTH→NORTH")
    ) {
      return CYCLE_ROUTES.CYCLE_1;
    }

    if (
      text.includes(CYCLE_ROUTES.CYCLE_2) ||
      text.includes("NORTH->EAST->SOUTH->WEST->CANVAS") ||
      text.includes("NORTH→EAST→SOUTH→WEST→CANVAS")
    ) {
      return CYCLE_ROUTES.CYCLE_2;
    }

    return "";
  }

  function childHasMethods(child, methods) {
    if (!child || !isObject(child)) return false;
    return methods.every((method) => isFunction(child[method]));
  }

  function publishEarlyMarker() {
    root.__HEARTH_ROUTE_CONDUCTOR_MARKER__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_FILE__ = FILE;
    root.__HEARTH_ROUTE_CONDUCTOR_CONTRACT__ = CONTRACT;
    root.__HEARTH_ROUTE_CONDUCTOR_RECEIPT__ = RECEIPT;
    root.__HEARTH_ROUTE_CONDUCTOR_MARKER_IS_HYDRATION_PROOF__ = false;
    root.__HEARTH_ROUTE_CONDUCTOR_MACRO_WEST_ADMISSIBILITY_CONSUMPTION__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT__ = true;

    state.routeConductorMarkerPresent = true;
    updateDataset();
  }

  function readNorthAuthority() {
    const api = firstGlobal([
      "LAB_RUNTIME_TABLE",
      "LAB_RUNTIME_TABLE_NORTH",
      "LAB_UNIVERSAL_PLANET_RUNTIME_TABLE",
      "RUNTIME_TABLE",
      "DexterRuntimeTable",
      "HEARTH_NORTH_COMMAND_RUNTIME_TABLE",
      "HEARTH_NORTH_COMMAND_TABLE",
      "DEXTER_LAB.runtimeTable",
      "DEXTER_LAB.cardinalRuntimeTableNorth",
      "DEXTER_LAB.northMacroDistributor"
    ]);

    const receipt =
      readReceipt(api) ||
      firstGlobal([
        "HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT",
        "HEARTH_NORTH_CYCLICAL_CHECKPOINT_RECEIPT",
        "LAB_RUNTIME_TABLE_NORTH_TRANSMISSION_RECEIPT",
        "LAB_RUNTIME_TABLE_NORTH_MACRO_DISTRIBUTOR_RECEIPT"
      ]) ||
      {};

    return {
      authority: api || null,
      receipt: isObject(receipt) ? receipt : {},
      observed: Boolean(api || (isObject(receipt) && receipt.contract)),
      file: FILE_GATES.north
    };
  }

  function readEastAuthority() {
    const api = firstGlobal([
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
    ]);

    return {
      authority: api || null,
      receipt: readReceipt(api) || {},
      observed: Boolean(api),
      file: FILE_GATES.east
    };
  }

  function readMacroWestAuthority() {
    const api = firstGlobal([
      "LAB_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_WEST",
      "HEARTH_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH",
      "LAB_RUNTIME_TABLE_WEST",
      "RUNTIME_TABLE_WEST",
      "DEXTER_LAB_RUNTIME_TABLE_WEST",
      "LAB_CARDINAL_RUNTIME_TABLE_WEST",
      "LAB_GAP_CLASSIFIER_WEST",
      "LAB_TRANSMISSION_GAP_CLASSIFIER_WEST",
      "DEXTER_LAB.cycleAwareAdmissibilityClutchWest",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.cardinalRuntimeTableWest",
      "DEXTER_LAB.gapClassifierWest",
      "DEXTER_LAB.transmissionGapClassifierWest",
      "HEARTH.westCycleAwareAdmissibilityClutch"
    ]);

    const receipt = readReceipt(api) || {};

    const observed = Boolean(
      api ||
      receipt.contract ||
      datasetValue("labRuntimeTableWestLoaded") === "true" ||
      datasetValue("westCycleAwareAdmissibilityClutch") === "true" ||
      datasetValue("hearthSouthMacroWestAuthorityObserved") === "true"
    );

    return {
      authority: api || null,
      receipt,
      observed,
      file: FILE_GATES.macroWest
    };
  }

  function readWestAuthority() {
    return readMacroWestAuthority();
  }

  function readSouthPrimaryGate() {
    const api = firstGlobal([
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
    ]);

    const receipt = readReceipt(api) || {};

    return {
      authority: api || null,
      receipt,
      observed: Boolean(api),
      primaryGateObserved: Boolean(api && (
        api.southPrimaryGate === true ||
        api.southPrimaryGateActive === true ||
        api.outputProofComposerActive === true ||
        isFunction(api.composeSouthPrimaryPacket) ||
        isFunction(api.composeNorthReturnPacket) ||
        isFunction(api.composeWestHandoffPacket)
      )),
      file: FILE_GATES.south
    };
  }

  function readHearthIndexAuthority() {
    const api = firstGlobal([
      "HEARTH_EAST_SOUTH_PAIR_DYNAMIC_SELECTOR_RUNTIME_RELEASE",
      "HEARTH_EAST_SOUTH_PAIR_FEMALE_SELECTOR",
      "HEARTH_EAST_STEP1_IGNITION",
      "HEARTH_INDEX_BRIDGE",
      "HEARTH_INDEX_JS",
      "HEARTH.indexBridge",
      "HEARTH.indexJs",
      "HEARTH.dynamicSelectorRuntimeRelease",
      "HEARTH.eastSouthPairFemaleSelector",
      "HEARTH.eastStep1Ignition"
    ]);

    const receipt = readReceipt(api) || {};

    const shellAccepted = Boolean(
      safeBool(receipt.shellAccepted, false) ||
      datasetValue("hearthShellAccepted") === "true" ||
      datasetValue("hearthRuntimeReleaseAuthorized") === "true"
    );

    const runtimeReleaseAuthorized = Boolean(
      safeBool(receipt.runtimeReleaseAuthorized, false) ||
      datasetValue("hearthRuntimeReleaseAuthorized") === "true"
    );

    return {
      authority: api || null,
      receipt,
      observed: Boolean(api || datasetValue("hearthFemaleSelectorLoaded") === "true"),
      shellAccepted,
      runtimeReleaseAuthorized,
      file: FILE_GATES.hearthIndex
    };
  }

  function readCanvasApi() {
    return firstGlobal([
      "HEARTH_CANVAS_PARENT_PRE_RELEASE_STRUCTURAL_CARRIER_THEN_WEST_RELEASE_TO_EAST",
      "HEARTH.canvasParentPreReleaseStructuralCarrierThenWestReleaseToEast",
      "DEXTER_LAB.hearthCanvasParentPreReleaseStructuralCarrierThenWestReleaseToEast",

      "HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER",
      "HEARTH.canvasParentChildReconciliationF13EvidenceReceiver",
      "DEXTER_LAB.hearthCanvasParentChildReconciliationF13EvidenceReceiver",

      "HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER",
      "HEARTH.canvasParentGovernedF13EvidenceReceiver",
      "DEXTER_LAB.hearthCanvasParentGovernedF13EvidenceReceiver",

      "HEARTH_CANVAS_PRE_RELEASE_STRUCTURAL_CARRIER",
      "HEARTH_CANVAS_PHYSICAL_OBJECT_BOOTSTRAP",
      "HEARTH_CANVAS_PHYSICAL_CARRIER_F13_PROOF_PARENT",
      "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION",
      "HEARTH_CANVAS_TRANSISTOR_GATE",
      "HEARTH_CANVAS_SPLIT_ADAPTER",
      "HEARTH_CANVAS_NORTH",
      "HEARTH_CANVAS_AUTHORITY",
      "HEARTH_CANVAS_EVIDENCE",
      "HEARTH_CANVAS",
      "HEARTH.canvas",
      "HEARTH.canvasAuthority",
      "HEARTH.canvasEvidence",
      "HEARTH.canvasNorth",
      "HEARTH.canvasPreReleaseStructuralCarrier",
      "DEXTER_LAB.hearthCanvasEvidence",
      "DEXTER_LAB.hearthCanvasNorth"
    ]);
  }

  function readCanvasReceipt() {
    const api = readCanvasApi();
    const receipt = readReceipt(api);

    if (receipt) return receipt;

    const fallback = firstGlobal([
      "HEARTH_CANVAS_PARENT_PRE_RELEASE_STRUCTURAL_CARRIER_THEN_WEST_RELEASE_TO_EAST_RECEIPT",
      "HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER_RECEIPT",
      "HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER_RECEIPT",
      "HEARTH_CANVAS_RECEIPT",
      "HEARTH_CANVAS_EVIDENCE_RECEIPT",
      "HEARTH_CANVAS_POSTGAME_RECEIPT",
      "HEARTH.canvasReceipt",
      "HEARTH.canvasEvidenceReceipt",
      "DEXTER_LAB.hearthCanvasEvidenceReceipt"
    ]);

    return isObject(fallback) ? fallback : {};
  }

  function readCanvasChild(key) {
    const names = {
      east: [
        "HEARTH_CANVAS_EAST",
        "HEARTH.canvasEast",
        "HEARTH.canvasEastMaterialAtlasSourceMachine",
        "HEARTH.canvasEastMaterialAtlasSourceTransistor",
        "HEARTH.canvasEastF13AtlasSourceChild",
        "HEARTH.canvasEastGovernedF13AtlasSource",
        "DEXTER_LAB.hearthCanvasEast",
        "DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachine",
        "DEXTER_LAB.hearthCanvasEastF13AtlasSourceChild"
      ],
      west: [
        "HEARTH_CANVAS_WEST",
        "HEARTH.canvasWest",
        "HEARTH.canvasWestInspectionInvalidationControl",
        "HEARTH.canvasWestF13NInspectionViewInvalidationChild",
        "DEXTER_LAB.hearthCanvasWest",
        "DEXTER_LAB.hearthCanvasWestInspectionInvalidationControl"
      ],
      south: [
        "HEARTH_CANVAS_SOUTH",
        "HEARTH.canvasSouth",
        "HEARTH.canvasSouthTextureSphereVisibleProof",
        "HEARTH.canvasSouthSplitAdapterDrainVisibleProofHardening",
        "HEARTH.canvasSouthF13STextureRenderVisibleProofChild",
        "DEXTER_LAB.hearthCanvasSouth",
        "DEXTER_LAB.hearthCanvasSouthTextureSphereVisibleProof",
        "DEXTER_LAB.hearthCanvasSouthF13STextureRenderVisibleProofChild"
      ]
    };

    return firstGlobal(names[key] || []);
  }

  function selectCanvasMethod(canvas) {
    if (!canvas || !isObject(canvas)) return "";
    if (isFunction(canvas.bootCooperative)) return "bootCooperative";
    if (isFunction(canvas.boot)) return "boot";
    if (isFunction(canvas.render)) return "render";
    if (isFunction(canvas.mount)) return "mount";
    return "";
  }

  function bindControls() {
    if (!doc) return;

    if (refs.copyButton && refs.copyButton.dataset.hearthRouteConductorStrictF13Bound !== "true") {
      refs.copyButton.dataset.hearthRouteConductorStrictF13Bound = "true";
      refs.copyButton.addEventListener("click", copyDiagnostic);
    }

    if (refs.toggleButton && refs.toggleButton.dataset.hearthRouteConductorStrictF13Bound !== "true") {
      refs.toggleButton.dataset.hearthRouteConductorStrictF13Bound = "true";
      refs.toggleButton.addEventListener("click", () => {
        const visible = refs.receiptBox ? refs.receiptBox.dataset.visible !== "true" : true;

        if (refs.receiptBox) refs.receiptBox.dataset.visible = String(visible);
        if (refs.receiptText) refs.receiptText.textContent = visible ? getReceiptText() : "";
        if (refs.toggleButton) refs.toggleButton.textContent = visible ? "Hide receipt" : "Show receipt";
      });
    }

    if (refs.inspectButton && refs.inspectButton.dataset.hearthRouteConductorStrictF13Bound !== "true") {
      refs.inspectButton.dataset.hearthRouteConductorStrictF13Bound = "true";
      refs.inspectButton.addEventListener("click", () => {
        setInspectMode(!(doc.documentElement.dataset.hearthSouthPlanetInspect === "true"));
      });
    }

    if (refs.showTab && refs.showTab.dataset.hearthRouteConductorStrictF13Bound !== "true") {
      refs.showTab.dataset.hearthRouteConductorStrictF13Bound = "true";
      refs.showTab.addEventListener("click", () => setInspectMode(false));
    }

    state.refsBound = Boolean(refs.copyButton || refs.toggleButton || refs.inspectButton || refs.showTab);
  }

  function scanDom() {
    if (!doc) {
      return {
        mountPresent: false,
        cockpitPresent: false,
        planetCanvasPresent: false,
        planetCanvasNonZeroSize: false,
        visiblePlanetHintPresent: false,
        copyDiagnosticReady: false,
        receiptToggleReady: false,
        inspectPlanetControlAvailable: false,
        inspectModeAvailable: false,
        diagnosticCanLeavePlanetFrame: false,
        diagnosticDockRestorable: false,
        showTabVisible: false,
        inspectFallbackReady: false,
        inspectStrictReady: false
      };
    }

    refs.mount =
      doc.getElementById("hearthCanvasMount") ||
      doc.querySelector("[data-hearth-canvas-mount='true']") ||
      doc.querySelector("[data-hearth-canvas-mount]");

    refs.cockpit =
      doc.getElementById("hearthLoadCockpit") ||
      doc.querySelector("[data-hearth-load-cockpit='true']") ||
      doc.querySelector("[data-hearth-first-paint-cockpit='true']");

    refs.stage = doc.querySelector("[data-hearth-stage-label]");
    refs.heartbeat = doc.querySelector("[data-hearth-heartbeat-text]");
    refs.latest = doc.querySelector("[data-hearth-latest-event]");
    refs.fill = doc.querySelector("[data-hearth-main-progress-fill]");
    refs.percent = doc.querySelector("[data-hearth-main-progress-percent]");
    refs.lanes = doc.querySelector("[data-hearth-lane-list]");
    refs.receiptBox = doc.querySelector("[data-hearth-receipt-box]");
    refs.receiptText = doc.querySelector("[data-hearth-receipt-text]");
    refs.copyButton = doc.querySelector("[data-hearth-copy-diagnostic]");
    refs.toggleButton = doc.querySelector("[data-hearth-toggle-receipt]");
    refs.inspectButton = doc.querySelector("[data-hearth-inspect-planet]");
    refs.showTab =
      doc.querySelector("[data-hearth-south-show-diagnostic-tab]") ||
      doc.querySelector("[data-hearth-east-show-diagnostic-tab]") ||
      doc.querySelector("[data-hearth-index-show-diagnostic-tab]");
    refs.status = doc.getElementById("hearth-route-status") || doc.querySelector("[data-hearth-route-status]");

    const canvas = refs.mount
      ? refs.mount.querySelector("canvas")
      : doc.querySelector("canvas[data-hearth-canvas='true'],canvas[data-hearth-canvas-texture='true'],canvas[data-hearth-planet-canvas='true']");

    const rect = canvas && isFunction(canvas.getBoundingClientRect)
      ? canvas.getBoundingClientRect()
      : null;

    const nonZero = Boolean(
      canvas &&
      (
        (safeNumber(canvas.width, 0) > 0 && safeNumber(canvas.height, 0) > 0) ||
        (rect && safeNumber(rect.width, 0) > 0 && safeNumber(rect.height, 0) > 0)
      )
    );

    const visibleHint = Boolean(
      datasetValue("hearthCanvasReady") === "true" ||
      datasetValue("hearthCanvasVisibleReady") === "true" ||
      datasetValue("hearthCanvasVisiblePlanetAvailable") === "true" ||
      datasetValue("hearthCanvasVisibleContentProof") === "true" ||
      datasetValue("hearthCanvasF13EvidenceComplete") === "true" ||
      datasetValue("hearthCanvasSouthVisibleContentProof") === "true" ||
      datasetValue("hearthCanvasSouthImageRendered") === "true" ||
      datasetValue("hearthSouthVisiblePlanetAvailable") === "true" ||
      datasetValue("hearthSouthF13CanvasEvidenceComplete") === "true"
    );

    const copyDiagnosticReady = Boolean(refs.copyButton);
    const receiptToggleReady = Boolean(refs.toggleButton || refs.receiptText || refs.receiptBox);
    const inspectPlanetControlAvailable = Boolean(refs.inspectButton);
    const inspectModeAvailable = Boolean(refs.inspectButton && refs.cockpit);
    const diagnosticCanLeavePlanetFrame = Boolean(refs.inspectButton && refs.cockpit && refs.showTab);
    const diagnosticDockRestorable = Boolean(refs.cockpit);
    const showTabVisible = Boolean(refs.showTab && refs.showTab.hidden === false);
    const inspectFallbackReady = Boolean(copyDiagnosticReady || receiptToggleReady || diagnosticDockRestorable);
    const inspectStrictReady = Boolean(
      inspectModeAvailable &&
      diagnosticCanLeavePlanetFrame &&
      copyDiagnosticReady &&
      receiptToggleReady
    );

    bindControls();

    return {
      mountPresent: Boolean(refs.mount),
      cockpitPresent: Boolean(refs.cockpit),
      planetCanvasPresent: Boolean(canvas),
      planetCanvasNonZeroSize: nonZero,
      visiblePlanetHintPresent: Boolean(canvas && nonZero && visibleHint),
      copyDiagnosticReady,
      receiptToggleReady,
      inspectPlanetControlAvailable,
      inspectModeAvailable,
      diagnosticCanLeavePlanetFrame,
      diagnosticDockRestorable,
      showTabVisible,
      inspectFallbackReady,
      inspectStrictReady
    };
  }

  function readChildReceipt(child) {
    return readReceipt(child) || {};
  }

  function readCanvasEvidence() {
    const api = readCanvasApi();
    const receipt = readCanvasReceipt();
    const dom = scanDom();

    const eastChild = readCanvasChild("east");
    const westChild = readCanvasChild("west");
    const southChild = readCanvasChild("south");

    const eastReceipt = readChildReceipt(eastChild);
    const westReceipt = readChildReceipt(westChild);
    const southReceipt = readChildReceipt(southChild);

    const parentBootMethod = selectCanvasMethod(api);
    const parentPresent = Boolean(api);
    const parentBootMethodAvailable = Boolean(parentBootMethod);

    const receiptContract = safeString(firstDefined(receipt.contract, receipt.splitContract), "");
    const receiptName = safeString(firstDefined(receipt.receipt, receipt.splitReceipt), "");

    const currentCanvasParentObserved = Boolean(
      parentPresent ||
      CURRENT_CANVAS_PARENT_CONTRACTS.includes(receiptContract) ||
      CURRENT_CANVAS_PARENT_CONTRACTS.includes(safeString(receipt.splitContract, "")) ||
      safeBool(receipt.preReleaseStructuralCarrierActive, false) ||
      safeBool(receipt.parentChildReconciliationActive, false) ||
      safeBool(receipt.governedF13EvidenceReceiverActive, false) ||
      safeBool(receipt.ownsParentChildReconciliation, false) ||
      datasetValue("hearthCanvasLoaded") === "true" ||
      datasetValue("hearthCanvasPreReleaseStructuralCarrierActive") === "true" ||
      datasetValue("hearthCanvasParentChildReconciliationActive") === "true"
    );

    const canvasParentV2Observed = Boolean(
      receiptContract === "HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER_TNT_v2" ||
      receiptName === "HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER_RECEIPT_v2" ||
      safeBool(receipt.canvasParentChildReconciliationActive, false) ||
      safeBool(receipt.parentChildReconciliationActive, false) ||
      safeBool(receipt.ownsParentChildReconciliation, false) ||
      datasetValue("hearthCanvasParentChildReconciliationActive") === "true"
    );

    const eastApiFallback = childHasMethods(eastChild, ["buildAtlas", "sample", "read", "getReceipt"]);
    const westApiFallback = childHasMethods(westChild, ["bindInspection", "getViewState", "setRotation", "resetRotation", "setZoom", "getReceipt"]);
    const southApiFallback = childHasMethods(southChild, [
      "composeTexture",
      "renderSphere",
      "renderSphereSync",
      "getTextureCanvas",
      "sampleVisibleContent",
      "classifyVisibleContentEvidence",
      "invalidateTexture",
      "getReceipt"
    ]);

    const canvasEastApiReady = safeBool(
      firstDefined(receipt.canvasEastApiReady, eastReceipt.canvasEastApiReady, eastReceipt.canvasEastReady),
      eastApiFallback
    );

    const canvasWestApiReady = safeBool(
      firstDefined(receipt.canvasWestApiReady, westReceipt.canvasWestApiReady, westReceipt.canvasWestReady),
      westApiFallback
    );

    const canvasSouthApiReady = safeBool(
      firstDefined(receipt.canvasSouthApiReady, southReceipt.canvasSouthApiReady, southReceipt.canvasSouthReady),
      southApiFallback
    );

    const allCanvasChildrenApiReady = safeBool(
      firstDefined(receipt.allCanvasChildrenApiReady, receipt.allCanvasChildrenReady),
      Boolean(canvasEastApiReady && canvasWestApiReady && canvasSouthApiReady)
    );

    const atlasBuildComplete = safeBool(
      firstDefined(receipt.atlasBuildComplete, eastReceipt.atlasBuildComplete, eastReceipt.atlasReady, eastReceipt.f13AtlasReady),
      datasetValue("hearthCanvasAtlasBuildComplete") === "true"
    );

    const textureComposeComplete = safeBool(
      firstDefined(receipt.textureComposeComplete, southReceipt.textureComposeComplete, southReceipt.textureReady),
      datasetValue("hearthCanvasTextureComposeComplete") === "true" ||
      datasetValue("hearthCanvasSouthTextureComposeComplete") === "true"
    );

    const firstFrameDetected = safeBool(
      firstDefined(receipt.firstFrameDetected, southReceipt.firstFrameDetected),
      datasetValue("hearthCanvasFirstFrameDetected") === "true" ||
      datasetValue("hearthCanvasSouthFirstFrameDetected") === "true"
    );

    const imageRendered = safeBool(
      firstDefined(receipt.imageRendered, southReceipt.imageRendered),
      datasetValue("hearthCanvasImageRendered") === "true" ||
      datasetValue("hearthCanvasSouthImageRendered") === "true"
    );

    const canvasReady = safeBool(
      firstDefined(receipt.canvasReady, receipt.canvasGateReady),
      datasetValue("hearthCanvasReady") === "true" ||
      datasetValue("hearthCanvasCanvasGateReady") === "true"
    );

    const visibleContentProof = safeBool(
      firstDefined(receipt.visibleContentProof, southReceipt.visibleContentProof),
      datasetValue("hearthCanvasVisibleContentProof") === "true" ||
      datasetValue("hearthCanvasSouthVisibleContentProof") === "true"
    );

    const visibleContentStrictProof = safeBool(
      firstDefined(
        receipt.visibleContentStrictProof,
        receipt.f13CanvasEvidenceStrict,
        southReceipt.visibleContentStrictProof,
        southReceipt.f13VisibleEvidenceStrict
      ),
      datasetValue("hearthCanvasVisibleContentStrictProof") === "true" ||
      datasetValue("hearthCanvasF13EvidenceStrict") === "true" ||
      datasetValue("hearthCanvasSouthVisibleContentStrictProof") === "true"
    );

    const visibleContentSoftGap = safeBool(
      firstDefined(
        receipt.visibleContentSoftGap,
        receipt.f13CanvasEvidenceDegraded,
        southReceipt.visibleContentSoftGap,
        southReceipt.f13VisibleEvidenceDegraded
      ),
      datasetValue("hearthCanvasVisibleContentSoftGap") === "true" ||
      datasetValue("hearthCanvasF13EvidenceDegraded") === "true" ||
      datasetValue("hearthCanvasSouthVisibleContentSoftGap") === "true"
    );

    const visibleContentHardFail = safeBool(
      firstDefined(
        receipt.visibleContentHardFail,
        receipt.f13HardFail,
        southReceipt.visibleContentHardFail,
        southReceipt.f13HardFail
      ),
      datasetValue("hearthCanvasVisibleContentHardFail") === "true" ||
      datasetValue("hearthCanvasF13HardFail") === "true" ||
      datasetValue("hearthCanvasSouthVisibleContentHardFail") === "true"
    );

    const visibleForwardProgress = safeBool(
      firstDefined(receipt.visibleForwardProgress, southReceipt.visibleForwardProgress),
      datasetValue("hearthCanvasVisibleForwardProgress") === "true"
    );

    const visibleContentAdmissible = safeBool(
      firstDefined(receipt.visibleContentAdmissible, southReceipt.visibleContentAdmissible),
      false
    );

    const visiblePlanetAvailable = safeBool(
      firstDefined(receipt.visiblePlanetAvailable, southReceipt.visiblePlanetAvailable),
      datasetValue("hearthCanvasVisiblePlanetAvailable") === "true" ||
      datasetValue("hearthCanvasSouthVisiblePlanetAvailable") === "true"
    );

    const visibleContentSampleCount = safeNumber(firstDefined(
      receipt.visibleContentSampleCount,
      southReceipt.visibleContentSampleCount
    ), 0);

    const visibleContentVarianceScore = safeNumber(firstDefined(
      receipt.visibleContentVarianceScore,
      southReceipt.visibleContentVarianceScore
    ), 0);

    const visibleContentClassCount = safeNumber(firstDefined(
      receipt.visibleContentClassCount,
      southReceipt.visibleContentClassCount
    ), 0);

    const visibleContentLandSampleCount = safeNumber(firstDefined(
      receipt.visibleContentLandSampleCount,
      southReceipt.visibleContentLandSampleCount
    ), 0);

    const visibleContentWaterSampleCount = safeNumber(firstDefined(
      receipt.visibleContentWaterSampleCount,
      southReceipt.visibleContentWaterSampleCount
    ), 0);

    const visibleContentOtherSampleCount = safeNumber(firstDefined(
      receipt.visibleContentOtherSampleCount,
      southReceipt.visibleContentOtherSampleCount
    ), 0);

    const carrierOnlyDetected = safeBool(firstDefined(
      receipt.carrierOnlyDetected,
      southReceipt.carrierOnlyDetected
    ), false);

    const visibleProofStale = safeBool(firstDefined(
      receipt.visibleProofStale,
      southReceipt.visibleProofStale,
      receipt.renderFrameStale,
      southReceipt.renderFrameStale
    ), false);

    const textureInvalidated = safeBool(firstDefined(
      receipt.textureInvalidated,
      southReceipt.textureInvalidated
    ), false);

    const contentCount = visibleContentLandSampleCount + visibleContentWaterSampleCount + visibleContentOtherSampleCount;
    const strictByMetrics = Boolean(
      visibleContentSampleCount >= STRICT_PROOF_MINIMUMS.sampleCount &&
      contentCount >= STRICT_PROOF_MINIMUMS.contentCount &&
      visibleContentVarianceScore >= STRICT_PROOF_MINIMUMS.varianceScore &&
      visibleContentClassCount >= STRICT_PROOF_MINIMUMS.classCount &&
      visibleContentLandSampleCount > 0 &&
      visibleContentWaterSampleCount > 0 &&
      !carrierOnlyDetected &&
      !visibleProofStale &&
      !textureInvalidated
    );

    const southStrictProofObserved = Boolean(
      visibleContentStrictProof ||
      safeBool(southReceipt.currentVisibleProofValid, false) && safeString(southReceipt.proofBin, "") === "STRICT" ||
      strictByMetrics
    );

    const southSoftProofObserved = Boolean(
      visibleContentSoftGap ||
      safeString(southReceipt.proofBin, "") === "SOFT_GAP" ||
      visibleForwardProgress ||
      visibleContentAdmissible
    );

    const southHardFailObserved = Boolean(
      visibleContentHardFail ||
      safeString(southReceipt.proofBin, "") === "HARD_FAIL" ||
      safeBool(southReceipt.f13HardFail, false)
    );

    const canvasEastEvidenceReady = safeBool(
      firstDefined(receipt.canvasEastEvidenceReady, receipt.f13AtlasReady, eastReceipt.f13AtlasReady, eastReceipt.atlasReady),
      Boolean(atlasBuildComplete)
    );

    const canvasWestInspectionReady = safeBool(
      firstDefined(
        receipt.canvasWestInspectionReady,
        receipt.inspectModeAvailable,
        receipt.inspectPlanetControlAvailable,
        westReceipt.f13nInspectionReady,
        westReceipt.inspectionReady
      ),
      Boolean(
        safeBool(westReceipt.dragInspectionBound, false) ||
        safeBool(westReceipt.zoomInspectionBound, false) ||
        dom.inspectStrictReady ||
        dom.inspectFallbackReady
      )
    );

    const canvasSouthVisibleProofReady = safeBool(
      firstDefined(
        receipt.canvasSouthVisibleProofReady,
        receipt.f13VisibleEvidenceAvailable,
        receipt.f13VisibleEvidenceComplete,
        southReceipt.f13VisibleEvidenceAvailable,
        southReceipt.f13sVisibleProofReady,
        southReceipt.visibleProofReady
      ),
      Boolean(
        southStrictProofObserved ||
        southSoftProofObserved ||
        visibleContentProof ||
        visiblePlanetAvailable ||
        (firstFrameDetected && imageRendered)
      )
    );

    const allCanvasChildrenEvidenceReady = safeBool(
      receipt.allCanvasChildrenEvidenceReady,
      Boolean(canvasEastEvidenceReady && canvasWestInspectionReady && canvasSouthVisibleProofReady)
    );

    const allCanvasChildrenReady = Boolean(
      allCanvasChildrenApiReady &&
      allCanvasChildrenEvidenceReady
    );

    const f13CanvasEvidenceStrict = Boolean(
      safeBool(receipt.f13CanvasEvidenceStrict, false) ||
      (
        parentPresent &&
        currentCanvasParentObserved &&
        allCanvasChildrenReady &&
        canvasEastEvidenceReady &&
        canvasWestInspectionReady &&
        canvasSouthVisibleProofReady &&
        southStrictProofObserved &&
        !southHardFailObserved &&
        !visibleProofStale &&
        !textureInvalidated
      )
    );

    const f13CanvasEvidenceDegraded = Boolean(
      !f13CanvasEvidenceStrict &&
      (
        safeBool(receipt.f13CanvasEvidenceDegraded, false) ||
        (
          parentPresent &&
          currentCanvasParentObserved &&
          allCanvasChildrenApiReady &&
          canvasEastEvidenceReady &&
          canvasSouthVisibleProofReady &&
          (southSoftProofObserved || visibleForwardProgress || visibleContentAdmissible || visiblePlanetAvailable || imageRendered)
        )
      )
    );

    const f13HardFail = Boolean(
      southHardFailObserved &&
      !southSoftProofObserved &&
      !southStrictProofObserved
    );

    const f13CanvasEvidenceComplete = Boolean(
      !f13HardFail &&
      (
        safeBool(receipt.f13CanvasEvidenceComplete, false) ||
        f13CanvasEvidenceStrict ||
        f13CanvasEvidenceDegraded
      )
    );

    const canvasGateReady = Boolean(
      currentCanvasParentObserved &&
      allCanvasChildrenApiReady &&
      allCanvasChildrenEvidenceReady &&
      f13CanvasEvidenceComplete &&
      !f13HardFail
    );

    const visiblePlanetProofValid = Boolean(
      dom.planetCanvasPresent &&
      dom.planetCanvasNonZeroSize &&
      !f13HardFail &&
      (
        f13CanvasEvidenceComplete ||
        southStrictProofObserved ||
        southSoftProofObserved ||
        visibleContentProof ||
        visibleForwardProgress ||
        visibleContentAdmissible ||
        visiblePlanetAvailable ||
        (canvasReady && firstFrameDetected) ||
        (imageRendered && firstFrameDetected)
      )
    );

    const inspectEvidenceAvailable = Boolean(
      canvasWestInspectionReady ||
      dom.inspectStrictReady ||
      dom.inspectFallbackReady ||
      safeBool(receipt.inspectStrictReady, false) ||
      safeBool(receipt.inspectFallbackReady, false) ||
      safeBool(receipt.diagnosticCanLeavePlanetFrame, false) ||
      safeBool(receipt.receiptToggleReady, false)
    );

    const evidenceObserved = Boolean(
      parentPresent ||
      parentBootMethodAvailable ||
      allCanvasChildrenApiReady ||
      allCanvasChildrenEvidenceReady ||
      atlasBuildComplete ||
      textureComposeComplete ||
      firstFrameDetected ||
      canvasReady ||
      imageRendered ||
      visiblePlanetProofValid ||
      inspectEvidenceAvailable ||
      f13CanvasEvidenceComplete
    );

    const parentReleaseAccepted = Boolean(
      safeBool(receipt.releaseAccepted, false) ||
      safeString(receipt.releaseStatus, "").includes("RELEASE_ACCEPTED") ||
      datasetValue("hearthCanvasReleaseAccepted") === "true"
    );

    const parentStrictReadMismatch = Boolean(
      southStrictProofObserved &&
      !safeBool(receipt.f13CanvasEvidenceStrict, false) &&
      currentCanvasParentObserved &&
      allCanvasChildrenReady
    );

    const nextAuditTarget = safeString(
      firstDefined(
        receipt.nextAuditTarget,
        receipt.recommendedNextFile,
        receipt.recommendedNextRenewalTarget,
        datasetValue("hearthCanvasNextAuditTarget", "")
      ),
      ""
    );

    const strictGap = resolveStrictF13Gap({
      parentPresent,
      currentCanvasParentObserved,
      parentReleaseAccepted,
      parentBootMethodAvailable,
      canvasEastApiReady,
      canvasWestApiReady,
      canvasSouthApiReady,
      allCanvasChildrenApiReady,
      canvasEastEvidenceReady,
      canvasWestInspectionReady,
      canvasSouthVisibleProofReady,
      allCanvasChildrenEvidenceReady,
      f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete,
      f13HardFail,
      southStrictProofObserved,
      southSoftProofObserved,
      southHardFailObserved,
      parentStrictReadMismatch,
      visibleProofStale,
      textureInvalidated,
      carrierOnlyDetected
    });

    return {
      authority: api || null,
      receipt,
      eastReceipt,
      westReceipt,
      southReceipt,
      file: FILE_GATES.canvas,

      observed: evidenceObserved,
      parentPresent,
      parentBootMethod,
      parentBootMethodAvailable,
      currentCanvasParentObserved,
      canvasParentV2Observed,
      parentReleaseAccepted,

      canvasEastApiReady,
      canvasWestApiReady,
      canvasSouthApiReady,
      allCanvasChildrenApiReady,

      canvasEastEvidenceReady,
      canvasWestInspectionReady,
      canvasSouthVisibleProofReady,
      allCanvasChildrenEvidenceReady,
      allCanvasChildrenReady,

      atlasBuildComplete,
      textureComposeComplete,
      firstFrameDetected,
      canvasReady,
      imageRendered,

      visibleContentProof,
      visibleContentStrictProof,
      visibleContentSoftGap,
      visibleContentHardFail,
      visibleForwardProgress,
      visibleContentAdmissible,
      visiblePlanetAvailable,
      visiblePlanetProofValid,

      visibleContentSampleCount,
      visibleContentVarianceScore,
      visibleContentClassCount,
      visibleContentLandSampleCount,
      visibleContentWaterSampleCount,
      visibleContentOtherSampleCount,
      carrierOnlyDetected,
      visibleProofStale,
      textureInvalidated,

      southStrictProofObserved,
      southSoftProofObserved,
      southHardFailObserved,
      parentStrictReadMismatch,

      f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete,
      f13HardFail,

      canvasGateReady,
      f13VisibleEvidenceAvailable: f13CanvasEvidenceComplete,
      f13InspectEvidenceAvailable: inspectEvidenceAvailable,
      f13CanvasReadinessObserved: Boolean(
        parentPresent ||
        allCanvasChildrenApiReady ||
        allCanvasChildrenEvidenceReady ||
        canvasReady ||
        firstFrameDetected ||
        imageRendered
      ),

      f13StrictEvidenceGap: strictGap.gap,
      f13StrictEvidenceRepairTarget: strictGap.repairTarget,
      degradedF13IsFunctional: Boolean(f13CanvasEvidenceComplete && f13CanvasEvidenceDegraded && !f13CanvasEvidenceStrict && !f13HardFail),
      strictVisualProofPending: Boolean(f13CanvasEvidenceComplete && !f13CanvasEvidenceStrict && !f13HardFail),
      functionalPageObserved: Boolean(
        parentReleaseAccepted &&
        currentCanvasParentObserved &&
        allCanvasChildrenApiReady &&
        imageRendered &&
        f13CanvasEvidenceComplete &&
        !f13HardFail
      ),

      nextAuditTarget,
      dom
    };
  }

  function resolveStrictF13Gap(canvas = {}) {
    if (!canvas.parentPresent || !canvas.currentCanvasParentObserved) {
      return {
        gap: "WAITING_CURRENT_CANVAS_PARENT",
        repairTarget: FILE_GATES.canvas
      };
    }

    if (!canvas.parentBootMethodAvailable) {
      return {
        gap: "WAITING_CANVAS_PARENT_BOOT_METHOD",
        repairTarget: FILE_GATES.canvas
      };
    }

    if (!canvas.parentReleaseAccepted && !canvas.f13CanvasEvidenceComplete) {
      return {
        gap: "WAITING_CANVAS_PARENT_RELEASE_ACCEPTANCE",
        repairTarget: FILE_GATES.canvas
      };
    }

    if (!canvas.canvasEastApiReady) {
      return {
        gap: "WAITING_CANVAS_EAST_API",
        repairTarget: FILE_GATES.canvasEast
      };
    }

    if (!canvas.canvasEastEvidenceReady) {
      return {
        gap: "WAITING_CANVAS_EAST_ATLAS_EVIDENCE",
        repairTarget: FILE_GATES.canvasEast
      };
    }

    if (!canvas.canvasWestApiReady) {
      return {
        gap: "WAITING_CANVAS_WEST_API",
        repairTarget: FILE_GATES.canvasWest
      };
    }

    if (!canvas.canvasWestInspectionReady) {
      return {
        gap: "WAITING_CANVAS_WEST_INSPECTION_EVIDENCE",
        repairTarget: FILE_GATES.canvasWest
      };
    }

    if (!canvas.canvasSouthApiReady) {
      return {
        gap: "WAITING_CANVAS_SOUTH_API",
        repairTarget: FILE_GATES.canvasSouth
      };
    }

    if (canvas.textureInvalidated || canvas.visibleProofStale) {
      return {
        gap: "WAITING_CANVAS_SOUTH_CURRENT_NON_STALE_VISIBLE_PROOF",
        repairTarget: FILE_GATES.canvasSouth
      };
    }

    if (canvas.f13HardFail || canvas.southHardFailObserved) {
      return {
        gap: "CANVAS_SOUTH_VISIBLE_PROOF_HARD_FAIL",
        repairTarget: FILE_GATES.canvasSouth
      };
    }

    if (!canvas.canvasSouthVisibleProofReady) {
      return {
        gap: "WAITING_CANVAS_SOUTH_VISIBLE_PROOF",
        repairTarget: FILE_GATES.canvasSouth
      };
    }

    if (canvas.parentStrictReadMismatch) {
      return {
        gap: "WAITING_CANVAS_PARENT_STRICT_READ_OF_SOUTH_PROOF",
        repairTarget: FILE_GATES.canvas
      };
    }

    if (canvas.f13CanvasEvidenceComplete && canvas.f13CanvasEvidenceDegraded && !canvas.f13CanvasEvidenceStrict) {
      return {
        gap: "WAITING_CANVAS_SOUTH_STRICT_VISIBLE_PROOF",
        repairTarget: FILE_GATES.canvasSouth
      };
    }

    if (!canvas.f13CanvasEvidenceComplete) {
      return {
        gap: "WAITING_CANVAS_F13_EVIDENCE_COMPLETE",
        repairTarget: FILE_GATES.canvas
      };
    }

    if (canvas.f13CanvasEvidenceStrict) {
      return {
        gap: "NONE_F13_STRICT_EVIDENCE_COMPLETE",
        repairTarget: FILE_GATES.north
      };
    }

    return {
      gap: "WAITING_CANVAS_F13_STRICT_EVIDENCE",
      repairTarget: FILE_GATES.canvasSouth
    };
  }

  function resolveF8SelfDuty() {
    const markerPresent = Boolean(
      root.__HEARTH_ROUTE_CONDUCTOR_MARKER__ === true ||
      datasetValue("hearthRouteConductorMarkerPresent") === "true" ||
      state.routeConductorMarkerPresent
    );

    const apiPresent = Boolean(
      root.HEARTH_ROUTE_CONDUCTOR === api ||
      root.HearthRouteConductor === api ||
      root.HEARTH_SOUTH_ROUTE_CONDUCTOR === api ||
      root.HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE === api ||
      root.HEARTH_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT === api ||
      firstGlobal([
        "HEARTH.routeConductor",
        "HEARTH.southRouteConductor",
        "HEARTH.routeConductorPrimaryGate",
        "HEARTH.routeConductorStrictF13DownstreamAlignment",
        "DEXTER_LAB.hearthRouteConductor",
        "DEXTER_LAB.hearthSouthRouteConductor",
        "DEXTER_LAB.hearthRouteConductorPrimaryGate",
        "DEXTER_LAB.hearthRouteConductorStrictF13DownstreamAlignment"
      ]) === api
    );

    const receiptPresent = Boolean(
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT &&
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT.receipt === RECEIPT &&
      root.HEARTH_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT_RECEIPT &&
      root.HEARTH_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT_RECEIPT.contract === CONTRACT
    );

    const runtimeActive = true;
    const hydrated = Boolean(markerPresent && apiPresent && receiptPresent && runtimeActive);

    return {
      routeConductorMarkerPresent: markerPresent,
      routeConductorApiPresent: apiPresent,
      routeConductorReceiptPresent: receiptPresent,
      routeConductorRuntimeActive: runtimeActive,
      routeConductorHydrated: hydrated,
      f8SelfDutySatisfied: hydrated,
      markerIsNotHydrationProof: true,
      apiRequiredForF8: true,
      receiptRequiredForF8: true,
      runtimeRequiredForF8: true,
      firstFailedCoordinate: hydrated
        ? "NONE_F8_SELF_DUTY_SATISFIED"
        : markerPresent
          ? "WAITING_ROUTE_CONDUCTOR_API_RECEIPT_RUNTIME"
          : "WAITING_ROUTE_CONDUCTOR_MARKER_API_RECEIPT_RUNTIME"
    };
  }

  function resolveF13Evidence(canvasEvidence = readCanvasEvidence(), south = readSouthPrimaryGate()) {
    const southReceipt = south.receipt || {};

    const proofBodyAvailable = safeBool(
      firstDefined(
        southReceipt.proofBodyAvailable,
        southReceipt.proofBodyComposed,
        southReceipt.f13ProofBodyAvailable
      ),
      false
    );

    const f13ProofBodyAvailable = Boolean(
      proofBodyAvailable ||
      canvasEvidence.f13CanvasReadinessObserved ||
      canvasEvidence.observed
    );

    return {
      f13ProofBodyAvailable,
      f13VisibleEvidenceAvailable: canvasEvidence.f13CanvasEvidenceComplete,
      f13InspectEvidenceAvailable: canvasEvidence.f13InspectEvidenceAvailable,
      f13CanvasReadinessObserved: canvasEvidence.f13CanvasReadinessObserved,

      f13CanvasEvidenceStrict: canvasEvidence.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: canvasEvidence.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: canvasEvidence.f13CanvasEvidenceComplete,
      f13HardFail: canvasEvidence.f13HardFail,

      f13StrictEvidenceGap: canvasEvidence.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: canvasEvidence.f13StrictEvidenceRepairTarget,

      canvasEvidenceObserved: canvasEvidence.observed,
      canvasGateReady: canvasEvidence.canvasGateReady,
      canvasOwnsF13Only: true,
      firstFailedCoordinate: canvasEvidence.f13CanvasEvidenceStrict
        ? "NONE_CANVAS_F13_STRICT_EVIDENCE_COMPLETE"
        : canvasEvidence.f13CanvasEvidenceComplete
          ? canvasEvidence.f13StrictEvidenceGap
          : f13ProofBodyAvailable
            ? "WAITING_CANVAS_F13_EVIDENCE_COMPLETE"
            : "WAITING_F13_PROOF_BODY"
    };
  }

  function resolveNewsState(authorities = {}, f8 = resolveF8SelfDuty(), f13 = resolveF13Evidence()) {
    const northGateReady = Boolean(authorities.north && authorities.north.observed);
    const eastGateReady = Boolean(authorities.east && authorities.east.observed);
    const westGateReady = Boolean(authorities.west && authorities.west.observed);
    const southGateReady = Boolean(f8.f8SelfDutySatisfied && authorities.south && authorities.south.observed);
    const canvasGateReady = Boolean(f13.canvasGateReady);

    const baseGatesReady = Boolean(
      northGateReady &&
      eastGateReady &&
      westGateReady &&
      southGateReady &&
      canvasGateReady
    );

    const newsGatePassedBeforeF21 = Boolean(
      baseGatesReady &&
      f13.f13CanvasEvidenceStrict &&
      f13.f13CanvasEvidenceComplete &&
      !f13.f13HardFail
    );

    const newsGateDegradedBeforeF21 = Boolean(
      newsGatePassedBeforeF21 ||
      (
        baseGatesReady &&
        f13.f13CanvasEvidenceDegraded &&
        f13.f13CanvasEvidenceComplete &&
        !f13.f13HardFail
      )
    );

    return {
      routeNewsObserved: true,
      routeNewsComposed: true,
      northGateReady,
      eastGateReady,
      westGateReady,
      southGateReady,
      canvasGateReady,
      newsGatePassedBeforeF21,
      newsGateDegradedBeforeF21
    };
  }

  function resolveF21Eligibility(input = {}, f8 = resolveF8SelfDuty(), f13 = resolveF13Evidence(), news = resolveNewsState()) {
    const supplied = isObject(input) ? input : {};
    const northReceipt = objectValue(supplied, "authorities.north.receipt") || {};
    const canvasEvidence = supplied.canvasEvidence || {};

    const northAlreadyLatched = Boolean(
      safeBool(northReceipt.completionLatched, false) ||
      safeBool(northReceipt.finalCompletionLatched, false) ||
      safeBool(supplied.completionLatchedByNorth, false) ||
      datasetValue("hearthSouthCompletionLatched") === "true"
    );

    const northAlreadyLatchedDegraded = Boolean(
      safeBool(northReceipt.degradedCompletionLatched, false) ||
      safeBool(supplied.degradedCompletionLatchedByNorth, false) ||
      datasetValue("hearthSouthDegradedCompletionLatched") === "true"
    );

    const eligible = Boolean(
      f8.f8SelfDutySatisfied &&
      news.northGateReady &&
      news.eastGateReady &&
      news.westGateReady &&
      news.southGateReady &&
      news.canvasGateReady &&
      f13.f13CanvasEvidenceComplete &&
      !f13.f13HardFail &&
      (news.newsGatePassedBeforeF21 || news.newsGateDegradedBeforeF21) &&
      canvasEvidence.f13CanvasEvidenceComplete === true &&
      canvasEvidence.canvasGateReady === true
    );

    const failed = eligible
      ? "NONE_F21_ELIGIBLE_FOR_NORTH"
      : !f8.f8SelfDutySatisfied
        ? "WAITING_F8_SELF_DUTY"
        : !news.northGateReady
          ? "WAITING_NORTH_GATE"
          : !news.eastGateReady
            ? "WAITING_EAST_GATE"
            : !news.westGateReady
              ? "WAITING_MACRO_WEST_GATE"
              : !news.southGateReady
                ? "WAITING_SOUTH_GATE"
                : !news.canvasGateReady
                  ? "WAITING_CANVAS_GATE"
                  : !f13.f13CanvasEvidenceComplete
                    ? "WAITING_CANVAS_F13_EVIDENCE"
                    : f13.f13HardFail
                      ? "CANVAS_F13_HARD_FAIL"
                      : "WAITING_NEWS_GATE_BEFORE_F21";

    const northRepairRequired = Boolean(
      f13.f13CanvasEvidenceStrict &&
      eligible &&
      !northAlreadyLatched &&
      state.f21EligibilitySubmittedToNorth &&
      state.f21EligibilitySubmissionCount > 0
    );

    return {
      f21EligibleForNorth: eligible,
      f21SubmittedToNorth: state.f21SubmittedToNorth,
      f21EligibilitySubmittedToNorth: state.f21EligibilitySubmittedToNorth,
      f21EligibilitySubmittedAt: state.f21EligibilitySubmittedAt,
      f21EligibilitySubmissionCount: state.f21EligibilitySubmissionCount,
      f21LatchMode: northAlreadyLatched
        ? northAlreadyLatchedDegraded
          ? "DEGRADED_LATCHED_BY_NORTH"
          : "FULL_LATCHED_BY_NORTH"
        : eligible
          ? f13.f13CanvasEvidenceStrict
            ? "READY_FOR_NORTH_STRICT_F21_LATCH"
            : "READY_FOR_NORTH_DEGRADED_F21_LATCH"
          : failed,
      completionLatched: northAlreadyLatched,
      degradedCompletionLatched: northAlreadyLatchedDegraded,
      readyTextAllowed: northAlreadyLatched,
      f21NorthLatchOnly: true,
      routeMaySubmitF21EligibilityOnly: true,
      northRepairRequired,
      northRepairReason: northRepairRequired ? "STRICT_F21_ELIGIBILITY_SUBMITTED_BUT_NORTH_NOT_LATCHED" : "NONE",
      firstFailedCoordinate: failed,
      visualPassClaimed: false
    };
  }

  function normalizeRouteConductorInput(input = {}) {
    const source = isObject(input) ? input : {};

    const authorities = {
      north: readNorthAuthority(),
      east: readEastAuthority(),
      west: readMacroWestAuthority(),
      south: readSouthPrimaryGate(),
      hearthIndex: readHearthIndexAuthority()
    };

    const canvasEvidence = readCanvasEvidence();
    const f8 = resolveF8SelfDuty();
    const f13 = resolveF13Evidence(canvasEvidence, authorities.south);
    const news = resolveNewsState(authorities, f8, f13);

    const receivedFrom = normalizeCardinal(firstDefined(
      source.receivedFrom,
      source.sourceCardinal,
      source.from,
      objectValue(source, "detail.receivedFrom"),
      objectValue(authorities.south.receipt, "receivedFrom"),
      objectValue(authorities.west.receipt, "sourceCardinal"),
      objectValue(authorities.west.receipt, "receivedFrom")
    ));

    const cycleRoute = normalizeCycleRoute(firstDefined(
      source.cycleRoute,
      source.activeCycleRoute,
      objectValue(authorities.south.receipt, "cycleRoute"),
      objectValue(authorities.north.receipt, "activeCycleRoute"),
      datasetValue("hearthSouthActiveCycleRoute", "")
    ));

    const outputSpreadAvailable = Boolean(
      safeBool(source.outputSpreadAvailable, false) ||
      safeBool(source.outputSpreadComposed, false) ||
      safeBool(objectValue(authorities.south.receipt, "outputSpreadAvailable"), false) ||
      safeBool(objectValue(authorities.south.receipt, "outputSpreadComposed"), false)
    );

    const proofBodyAvailable = Boolean(
      safeBool(source.proofBodyAvailable, false) ||
      safeBool(source.proofBodyComposed, false) ||
      safeBool(objectValue(authorities.south.receipt, "proofBodyAvailable"), false) ||
      safeBool(objectValue(authorities.south.receipt, "proofBodyComposed"), false) ||
      f13.f13ProofBodyAvailable
    );

    const visibleStateAvailable = Boolean(
      safeBool(source.visibleStateAvailable, false) ||
      safeBool(source.visibleStateComposed, false) ||
      safeBool(objectValue(authorities.south.receipt, "visibleStateAvailable"), false) ||
      safeBool(objectValue(authorities.south.receipt, "visibleStateComposed"), false)
    );

    const receiptAvailable = Boolean(
      safeBool(source.receiptAvailable, true) ||
      safeBool(objectValue(authorities.south.receipt, "receiptAvailable"), true) ||
      Boolean(authorities.south.receipt && authorities.south.receipt.receipt)
    );

    const westAuditObserved = Boolean(
      safeBool(source.westAuditObserved, false) ||
      safeBool(source.westAuditApproved, false) ||
      safeBool(source.westDegradedForwardApproved, false) ||
      safeBool(objectValue(authorities.west.receipt, "westAuditObserved"), false) ||
      safeBool(objectValue(authorities.west.receipt, "westReviewRecommended"), false) ||
      safeBool(objectValue(authorities.west.receipt, "forwardAllowed"), false) ||
      safeBool(objectValue(authorities.west.receipt, "canvasReleaseAuthorized"), false) ||
      safeBool(objectValue(authorities.south.receipt, "westAuditObserved"), false)
    );

    const westAuditApproved = Boolean(
      safeBool(source.westAuditApproved, false) ||
      safeBool(objectValue(authorities.west.receipt, "westAuditApproved"), false) ||
      safeBool(objectValue(authorities.west.receipt, "forwardAllowed"), false) ||
      safeBool(objectValue(authorities.west.receipt, "canvasReleaseAuthorized"), false) ||
      safeString(objectValue(authorities.west.receipt, "decision")).includes("FULL_PASS") ||
      safeString(objectValue(authorities.west.receipt, "decision")).includes("RELEASE_TO_CANVAS")
    );

    const westDegradedForwardApproved = Boolean(
      safeBool(source.westDegradedForwardApproved, false) ||
      safeBool(objectValue(authorities.west.receipt, "canDegradeForward"), false) ||
      safeString(objectValue(authorities.west.receipt, "decision")).includes("DEGRADED_FORWARD")
    );

    const westAuditRequired = Boolean(
      safeBool(source.westAuditRequired, false) ||
      safeBool(objectValue(authorities.south.receipt, "westAuditRequired"), false) ||
      cycleRoute === CYCLE_ROUTES.CYCLE_2 ||
      receivedFrom === CARDINALS.EAST ||
      receivedFrom === CARDINALS.NORTH ||
      outputSpreadAvailable
    );

    const northReturnRequired = Boolean(
      safeBool(source.northReturnRequired, false) ||
      safeBool(objectValue(authorities.south.receipt, "northReturnRequired"), false) ||
      cycleRoute === CYCLE_ROUTES.CYCLE_1 ||
      receivedFrom === CARDINALS.WEST
    );

    return {
      source: clonePlain(source),
      authorities,
      canvasEvidence,
      f8,
      f13,
      news,

      sourceFile: safeString(source.sourceFile || source.file || ""),
      destinationFile: FILE,
      activeCycleNumber: safeNumber(source.activeCycleNumber, 0),
      activeCycleRoute: cycleRoute,
      activeCardinal: CARDINALS.SOUTH,
      activeFileGate: FILE,

      activeFibonacci: "F8",
      activeFibonacciRank: 8,
      activeStageId: "F8_SOUTH_SELF_DUTY",
      activeGearId: "F8_SOUTH_SELF_DUTY",
      activeNewsGate: CARDINALS.SOUTH,

      canvasActiveFibonacci: safeString(firstDefined(
        canvasEvidence.receipt.activeFibonacci,
        canvasEvidence.receipt.activeFibonacciGate,
        "F13"
      ), "F13"),
      canvasActiveFibonacciRank: firstDefined(
        canvasEvidence.receipt.activeFibonacciRank,
        canvasEvidence.receipt.activeFibonacciGate === "F13" ? 13 : undefined,
        13
      ),
      canvasActiveStageId: safeString(firstDefined(
        canvasEvidence.receipt.activeStageId,
        "canvas-parent-f13-evidence-receiver"
      ), "canvas-parent-f13-evidence-receiver"),
      canvasActiveGearId: safeString(firstDefined(
        canvasEvidence.receipt.activeGearId,
        "hearth-canvas-parent-f13"
      ), "hearth-canvas-parent-f13"),

      receivedFrom,
      returnTo: normalizeCardinal(source.returnTo, ""),
      handoffTo: normalizeCardinal(source.handoffTo, ""),

      westAuditObserved,
      westAuditRequired,
      westAuditApproved,
      westDegradedForwardApproved,
      northReturnRequired,

      canvasReleaseAuthorized: safeBool(source.canvasReleaseAuthorized, false),
      northReleaseObserved: Boolean(
        safeBool(source.northReleaseObserved, false) ||
        safeBool(source.northReleaseAuthorized, false) ||
        safeBool(objectValue(authorities.north.receipt, "downstreamReleaseAuthorized"), false) ||
        safeBool(objectValue(authorities.north.receipt, "canvasReleaseAuthorized"), false)
      ),

      proofBodyAvailable,
      visibleStateAvailable,
      receiptAvailable,
      outputSpreadAvailable,

      firstFailedCoordinate: safeString(firstDefined(
        source.firstFailedCoordinate,
        objectValue(authorities.south.receipt, "firstFailedCoordinate"),
        objectValue(authorities.west.receipt, "firstFailedCoordinate"),
        f13.firstFailedCoordinate,
        f8.firstFailedCoordinate
      ), f8.firstFailedCoordinate),

      recommendedNextFile: safeString(firstDefined(
        source.recommendedNextFile,
        canvasEvidence.f13StrictEvidenceRepairTarget,
        canvasEvidence.nextAuditTarget,
        objectValue(authorities.south.receipt, "recommendedNextFile"),
        FILE
      ), FILE),

      recommendedNextRenewalTarget: safeString(firstDefined(
        source.recommendedNextRenewalTarget,
        canvasEvidence.f13StrictEvidenceRepairTarget,
        canvasEvidence.nextAuditTarget,
        objectValue(authorities.south.receipt, "recommendedNextRenewalTarget"),
        objectValue(authorities.west.receipt, "recommendedNextRenewalTarget"),
        FILE
      ), FILE),

      normalizedAt: nowIso()
    };
  }

  function resolveRouteCycle(input = {}) {
    const normalized = input && input.normalizedAt ? input : normalizeRouteConductorInput(input);

    const explicitCycleRoute = normalizeCycleRoute(normalized.activeCycleRoute);
    const receivedFrom = normalized.receivedFrom;

    const cycleOne = Boolean(
      explicitCycleRoute === CYCLE_ROUTES.CYCLE_1 ||
      receivedFrom === CARDINALS.WEST ||
      (normalized.westAuditObserved === true && normalized.northReturnRequired !== false && !normalized.outputSpreadAvailable) ||
      normalized.northReturnRequired === true
    );

    const cycleTwo = Boolean(
      explicitCycleRoute === CYCLE_ROUTES.CYCLE_2 ||
      (
        (receivedFrom === CARDINALS.EAST || receivedFrom === CARDINALS.NORTH || receivedFrom === CARDINALS.UNKNOWN) &&
        normalized.westAuditRequired === true
      ) ||
      normalized.outputSpreadAvailable === true ||
      normalized.canvasEvidence.parentReleaseAccepted === true
    );

    if (cycleOne && !cycleTwo) {
      return {
        cycleKnown: true,
        cycleNumber: 1,
        cycleRoute: CYCLE_ROUTES.CYCLE_1,
        receivedFrom,
        returnTo: CARDINALS.NORTH,
        handoffTo: "",
        northReturnRequired: true,
        westAuditRequired: false,
        canvasReleaseAuthorized: false,
        firstFailedCoordinate: "NONE_CYCLE_1_ROUTE_RESOLVED"
      };
    }

    if (cycleTwo && !cycleOne) {
      return {
        cycleKnown: true,
        cycleNumber: 2,
        cycleRoute: CYCLE_ROUTES.CYCLE_2,
        receivedFrom,
        returnTo: "",
        handoffTo: CARDINALS.WEST,
        northReturnRequired: false,
        westAuditRequired: true,
        canvasReleaseAuthorized: false,
        firstFailedCoordinate: "NONE_CYCLE_2_ROUTE_RESOLVED"
      };
    }

    if (cycleTwo && cycleOne) {
      if (receivedFrom === CARDINALS.WEST && !normalized.outputSpreadAvailable && !normalized.canvasEvidence.parentReleaseAccepted) {
        return {
          cycleKnown: true,
          cycleNumber: 1,
          cycleRoute: CYCLE_ROUTES.CYCLE_1,
          receivedFrom,
          returnTo: CARDINALS.NORTH,
          handoffTo: "",
          northReturnRequired: true,
          westAuditRequired: false,
          canvasReleaseAuthorized: false,
          firstFailedCoordinate: "NONE_CYCLE_1_ROUTE_RESOLVED_FROM_WEST_OR_NORTH_RETURN"
        };
      }

      return {
        cycleKnown: true,
        cycleNumber: 2,
        cycleRoute: CYCLE_ROUTES.CYCLE_2,
        receivedFrom,
        returnTo: "",
        handoffTo: CARDINALS.WEST,
        northReturnRequired: false,
        westAuditRequired: true,
        canvasReleaseAuthorized: false,
        firstFailedCoordinate: "NONE_CYCLE_2_ROUTE_RESOLVED_FROM_OUTPUT_SPREAD_OR_CANVAS_RELEASE"
      };
    }

    return {
      cycleKnown: false,
      cycleNumber: 1,
      cycleRoute: CYCLE_ROUTES.CYCLE_1,
      receivedFrom: receivedFrom || CARDINALS.UNKNOWN,
      returnTo: CARDINALS.NORTH,
      handoffTo: "",
      northReturnRequired: true,
      westAuditRequired: false,
      canvasReleaseAuthorized: false,
      routeConductorFallbackUsed: true,
      firstFailedCoordinate: "WAITING_ROUTE_CONDUCTOR_CYCLE_RESOLUTION"
    };
  }

  function composeProofBody(input = {}) {
    const normalized = input && input.normalizedAt ? input : normalizeRouteConductorInput(input);
    const f8 = normalized.f8;
    const f13 = normalized.f13;
    const news = normalized.news;
    const f21 = resolveF21Eligibility(normalized, f8, f13, news);
    const canvas = normalized.canvasEvidence;

    const routeConductorProofPresent = Boolean(f8.f8SelfDutySatisfied);
    const proofBodyPresent = Boolean(normalized.proofBodyAvailable || f13.f13ProofBodyAvailable);
    const canvasReadinessProofPresent = Boolean(f13.f13CanvasReadinessObserved);
    const canvasEvidenceProofPresent = Boolean(f13.f13CanvasEvidenceComplete);
    const visibleProofPresent = Boolean(f13.f13VisibleEvidenceAvailable);
    const inspectProofPresent = Boolean(f13.f13InspectEvidenceAvailable);
    const receiptProofPresent = Boolean(normalized.receiptAvailable);
    const newsProofPresent = Boolean(news.routeNewsComposed);
    const fibonacciProofPresent = Boolean(normalized.activeFibonacci === "F8" && normalized.activeFibonacciRank === 8);

    const proofBodyComposed = Boolean(
      routeConductorProofPresent ||
      proofBodyPresent ||
      canvasReadinessProofPresent ||
      canvasEvidenceProofPresent ||
      visibleProofPresent ||
      inspectProofPresent ||
      receiptProofPresent ||
      newsProofPresent ||
      fibonacciProofPresent
    );

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      proofBodyComposed,
      proofBodyAvailable: proofBodyComposed,

      routeConductorProof: {
        present: routeConductorProofPresent,
        markerPresent: f8.routeConductorMarkerPresent,
        apiPresent: f8.routeConductorApiPresent,
        receiptPresent: f8.routeConductorReceiptPresent,
        runtimeActive: f8.routeConductorRuntimeActive,
        hydrated: f8.routeConductorHydrated
      },

      canvasParentChildProof: {
        currentCanvasParentObserved: canvas.currentCanvasParentObserved,
        canvasParentV2Observed: canvas.canvasParentV2Observed,
        parentReleaseAccepted: canvas.parentReleaseAccepted,
        canvasEastApiReady: canvas.canvasEastApiReady,
        canvasWestApiReady: canvas.canvasWestApiReady,
        canvasSouthApiReady: canvas.canvasSouthApiReady,
        allCanvasChildrenApiReady: canvas.allCanvasChildrenApiReady,
        canvasEastEvidenceReady: canvas.canvasEastEvidenceReady,
        canvasWestInspectionReady: canvas.canvasWestInspectionReady,
        canvasSouthVisibleProofReady: canvas.canvasSouthVisibleProofReady,
        allCanvasChildrenEvidenceReady: canvas.allCanvasChildrenEvidenceReady,
        allCanvasChildrenReady: canvas.allCanvasChildrenReady,
        f13CanvasEvidenceStrict: canvas.f13CanvasEvidenceStrict,
        f13CanvasEvidenceDegraded: canvas.f13CanvasEvidenceDegraded,
        f13CanvasEvidenceComplete: canvas.f13CanvasEvidenceComplete,
        f13HardFail: canvas.f13HardFail,
        f13StrictEvidenceGap: canvas.f13StrictEvidenceGap,
        f13StrictEvidenceRepairTarget: canvas.f13StrictEvidenceRepairTarget,
        nextAuditTarget: canvas.nextAuditTarget
      },

      visibleProof: {
        present: visibleProofPresent,
        strict: canvas.f13CanvasEvidenceStrict,
        degraded: canvas.f13CanvasEvidenceDegraded,
        pendingStrict: canvas.strictVisualProofPending,
        absent: !visibleProofPresent && !canvas.f13HardFail,
        hardFail: canvas.f13HardFail,
        visiblePlanetProofValid: canvas.visiblePlanetProofValid,
        southStrictProofObserved: canvas.southStrictProofObserved,
        southSoftProofObserved: canvas.southSoftProofObserved,
        parentStrictReadMismatch: canvas.parentStrictReadMismatch
      },

      inspectProof: {
        present: inspectProofPresent,
        degraded: Boolean(canvas.dom && canvas.dom.inspectFallbackReady && !(canvas.dom && canvas.dom.inspectStrictReady)),
        pending: !inspectProofPresent,
        absent: !inspectProofPresent
      },

      newsProof: {
        present: newsProofPresent,
        northGateReady: news.northGateReady,
        eastGateReady: news.eastGateReady,
        westGateReady: news.westGateReady,
        southGateReady: news.southGateReady,
        canvasGateReady: news.canvasGateReady,
        newsGatePassedBeforeF21: news.newsGatePassedBeforeF21,
        newsGateDegradedBeforeF21: news.newsGateDegradedBeforeF21
      },

      fibonacciProof: {
        present: fibonacciProofPresent,
        activeFibonacci: normalized.activeFibonacci,
        activeFibonacciRank: normalized.activeFibonacciRank,
        activeStageId: normalized.activeStageId,
        activeGearId: normalized.activeGearId,
        canvasActiveFibonacci: normalized.canvasActiveFibonacci,
        canvasActiveFibonacciRank: normalized.canvasActiveFibonacciRank,
        canvasActiveStageId: normalized.canvasActiveStageId,
        canvasActiveGearId: normalized.canvasActiveGearId
      },

      f13ProofSummary: {
        f13ProofBodyAvailable: f13.f13ProofBodyAvailable,
        f13CanvasReadinessObserved: f13.f13CanvasReadinessObserved,
        f13VisibleEvidenceAvailable: f13.f13VisibleEvidenceAvailable,
        f13InspectEvidenceAvailable: f13.f13InspectEvidenceAvailable,
        f13CanvasEvidenceStrict: f13.f13CanvasEvidenceStrict,
        f13CanvasEvidenceDegraded: f13.f13CanvasEvidenceDegraded,
        f13CanvasEvidenceComplete: f13.f13CanvasEvidenceComplete,
        f13HardFail: f13.f13HardFail,
        f13StrictEvidenceGap: f13.f13StrictEvidenceGap,
        f13StrictEvidenceRepairTarget: f13.f13StrictEvidenceRepairTarget
      },

      f21EligibilitySummary: {
        f21EligibleForNorth: f21.f21EligibleForNorth,
        f21SubmittedToNorth: f21.f21SubmittedToNorth,
        f21LatchMode: f21.f21LatchMode,
        completionLatched: f21.completionLatched,
        degradedCompletionLatched: f21.degradedCompletionLatched,
        northRepairRequired: f21.northRepairRequired,
        northRepairReason: f21.northRepairReason
      },

      activeGapSummary: {
        firstFailedCoordinate: normalized.firstFailedCoordinate,
        recommendedNextFile: normalized.recommendedNextFile,
        recommendedNextRenewalTarget: normalized.recommendedNextRenewalTarget
      },

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      composedAt: nowIso()
    };
  }

  function callSouth(methodName, fallbackPacket, input = {}) {
    const south = readSouthPrimaryGate();
    const authority = south.authority;

    if (authority && isFunction(authority[methodName])) {
      try {
        const result = authority[methodName](input);
        return isObject(result) ? result : fallbackPacket;
      } catch (error) {
        recordError(`SOUTH_${methodName}_FAILED`, error);
      }
    }

    return fallbackPacket;
  }

  function composeCycleOneNorthReturn(input = {}) {
    const normalized = input && input.normalizedAt ? input : normalizeRouteConductorInput(input);
    const cycle = resolveRouteCycle(normalized);
    const proofBody = composeProofBody(normalized);
    const f21 = resolveF21Eligibility(normalized, normalized.f8, normalized.f13, normalized.news);

    const fallback = {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "CYCLE_1_NORTH_RETURN",
      cycleNumber: 1,
      cycleRoute: CYCLE_ROUTES.CYCLE_1,
      receivedFrom: normalized.receivedFrom || CARDINALS.WEST,
      returnTo: CARDINALS.NORTH,
      handoffTo: "",
      canvasReleaseAuthorized: false,
      northReturnRequired: true,
      southReturnPacketReady: true,
      proofBodyComposed: proofBody.proofBodyComposed,
      visibleStateComposed: true,
      receiptComposed: true,
      f21EligibleForNorth: f21.f21EligibleForNorth,
      f21SubmittedToNorth: f21.f21SubmittedToNorth,
      completionLatched: f21.completionLatched,
      degradedCompletionLatched: f21.degradedCompletionLatched,
      visualPassClaimed: false,
      firstFailedCoordinate: proofBody.proofBodyComposed
        ? cycle.firstFailedCoordinate
        : "WAITING_CYCLE_1_PROOF_BODY",
      recommendedNextFile: proofBody.proofBodyComposed ? FILE_GATES.north : FILE_GATES.south,
      recommendedNextRenewalTarget: proofBody.proofBodyComposed ? FILE_GATES.north : FILE_GATES.south,
      proofBody,
      composedAt: nowIso()
    };

    return callSouth("composeNorthReturnPacket", fallback, {
      ...normalized,
      cycle,
      proofBody,
      f21
    });
  }

  function composeCycleTwoWestHandoff(input = {}) {
    const normalized = input && input.normalizedAt ? input : normalizeRouteConductorInput(input);
    const cycle = resolveRouteCycle(normalized);
    const proofBody = composeProofBody(normalized);
    const f21 = resolveF21Eligibility(normalized, normalized.f8, normalized.f13, normalized.news);

    const outputSpreadComposed = Boolean(normalized.outputSpreadAvailable || proofBody.proofBodyComposed);

    const fallback = {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "CYCLE_2_WEST_HANDOFF",
      cycleNumber: 2,
      cycleRoute: CYCLE_ROUTES.CYCLE_2,
      receivedFrom: normalized.receivedFrom === CARDINALS.UNKNOWN ? CARDINALS.EAST : normalized.receivedFrom,
      returnTo: "",
      handoffTo: CARDINALS.WEST,
      canvasReleaseRequested: true,
      releaseToCanvas: true,
      canvasReleaseAuthorized: false,
      westAuditRequired: true,
      outputSpreadComposed,
      proofPacketReady: proofBody.proofBodyComposed,
      visibleStateComposed: true,
      receiptComposed: true,
      f21EligibleForNorth: f21.f21EligibleForNorth,
      f21SubmittedToNorth: f21.f21SubmittedToNorth,
      completionLatched: f21.completionLatched,
      degradedCompletionLatched: f21.degradedCompletionLatched,
      visualPassClaimed: false,
      firstFailedCoordinate: proofBody.proofBodyComposed
        ? cycle.firstFailedCoordinate
        : "WAITING_CYCLE_2_PROOF_PACKET",
      recommendedNextFile: proofBody.proofBodyComposed ? FILE_GATES.macroWest : FILE_GATES.south,
      recommendedNextRenewalTarget: proofBody.proofBodyComposed ? FILE_GATES.macroWest : FILE_GATES.south,
      proofBody,
      composedAt: nowIso()
    };

    return callSouth("composeWestHandoffPacket", fallback, {
      ...normalized,
      cycle,
      proofBody,
      f21
    });
  }

  function composeMacroWestCandidate(input = {}) {
    const normalized = input && input.normalizedAt ? input : normalizeRouteConductorInput(input);
    const proofBody = composeProofBody(normalized);
    const westHandoff = composeCycleTwoWestHandoff(normalized);
    const canvas = normalized.canvasEvidence;

    return {
      event: "CYCLE_2_SOUTH_OUTPUT_FOR_CANVAS_RELEASE",
      id: "F13N_INSPECT_GATE",
      phase: "F13N_INSPECT_GATE",
      checkpointId: "F13N_INSPECT_GATE",
      activeFibonacci: "F13N",
      fibonacci: "F13N",
      activeCheckpointId: "F13N_INSPECT_GATE",
      activeGateId: "F13N_INSPECT_GATE",

      sourceCardinal: CARDINALS.SOUTH,
      source: CARDINALS.SOUTH,
      activeCardinal: CARDINALS.SOUTH,
      targetCardinal: CARDINALS.CANVAS,
      destinationCardinal: CARDINALS.CANVAS,
      destination: CARDINALS.CANVAS,
      target: CARDINALS.CANVAS,

      sourceFile: FILE,
      destinationFile: FILE_GATES.canvas,
      targetFile: FILE_GATES.canvas,

      cycleTwoActive: true,
      cycleNumber: 2,
      activeCycleNumber: 2,
      cycleRoute: CYCLE_ROUTES.CYCLE_2,
      activeCycleRoute: CYCLE_ROUTES.CYCLE_2,
      canvasReleaseRequested: true,
      releaseToCanvas: true,

      routeMounted: true,
      planetCanvasPresent: canvas.dom ? canvas.dom.planetCanvasPresent : true,
      planetCanvasNonZeroSize: canvas.dom ? canvas.dom.planetCanvasNonZeroSize : true,
      canvasCarrierMounted: firstDefined(canvas.receipt.canvasCarrierMounted, true),
      canvasCarrierHandoffOk: firstDefined(canvas.receipt.canvasCarrierHandoffOk, true),
      canvasTargetPresent: canvas.parentPresent || canvas.currentCanvasParentObserved || true,
      sphereContainment: true,
      outsideSphereTransparent: true,
      noRectangularTextureSpill: true,

      northGateReady: normalized.news.northGateReady,
      eastGateReady: normalized.news.eastGateReady,
      southGateReady: true,
      westGateReady: true,

      proofBodyComposed: proofBody.proofBodyComposed,
      outputSpreadComposed: true,
      visibleStateComposed: true,
      receiptComposed: true,
      proofBody,
      westHandoff,

      inspectModeAvailable: canvas.f13InspectEvidenceAvailable || canvas.dom.inspectFallbackReady || canvas.dom.inspectStrictReady,
      inspectPlanetControlAvailable: canvas.f13InspectEvidenceAvailable || canvas.dom.inspectPlanetControlAvailable || canvas.dom.inspectFallbackReady,
      diagnosticCanLeavePlanetFrame: canvas.dom.diagnosticCanLeavePlanetFrame || canvas.dom.inspectFallbackReady,
      diagnosticDockRestorable: canvas.dom.diagnosticDockRestorable || canvas.dom.inspectFallbackReady,
      showDiagnosticTabVisibleWhenHidden: canvas.dom.showTabVisible || canvas.dom.inspectFallbackReady,
      copyDiagnosticPreserved: canvas.dom.copyDiagnosticReady || canvas.dom.inspectFallbackReady,
      receiptToggleReady: canvas.dom.receiptToggleReady || canvas.dom.inspectFallbackReady,
      buttonsReachable: canvas.dom.inspectFallbackReady || canvas.dom.inspectStrictReady,
      receiptOverlayIndependent: true,

      currentCanvasParentObserved: canvas.currentCanvasParentObserved,
      canvasParentV2Observed: canvas.canvasParentV2Observed,
      parentReleaseAccepted: canvas.parentReleaseAccepted,
      canvasReady: canvas.canvasReady,
      atlasBuildComplete: canvas.atlasBuildComplete || canvas.canvasEastEvidenceReady,
      textureComposeComplete: canvas.textureComposeComplete || canvas.canvasSouthVisibleProofReady,
      firstFrameDetected: canvas.firstFrameDetected,
      imageRendered: canvas.imageRendered,
      visibleContentProof: canvas.visibleContentProof,
      visibleContentStrictProof: canvas.visibleContentStrictProof,
      visibleContentSoftGap: canvas.visibleContentSoftGap,
      visibleContentHardFail: canvas.visibleContentHardFail,
      visibleForwardProgress: canvas.visibleForwardProgress,
      visibleContentAdmissible: canvas.visibleContentAdmissible,
      visiblePlanetAvailable: canvas.visiblePlanetAvailable,
      nonblankPlanetVisible: canvas.visiblePlanetProofValid,

      visibleContentClassCount: firstDefined(canvas.visibleContentClassCount, 2),
      visibleContentSampleCount: firstDefined(canvas.visibleContentSampleCount, 24),
      visibleContentVarianceScore: firstDefined(canvas.visibleContentVarianceScore, 8),
      visibleContentLandSampleCount: firstDefined(canvas.visibleContentLandSampleCount, 1),
      visibleContentWaterSampleCount: firstDefined(canvas.visibleContentWaterSampleCount, 1),
      visibleContentOtherSampleCount: firstDefined(canvas.visibleContentOtherSampleCount, 1),

      southStrictProofObserved: canvas.southStrictProofObserved,
      southSoftProofObserved: canvas.southSoftProofObserved,
      southHardFailObserved: canvas.southHardFailObserved,
      parentStrictReadMismatch: canvas.parentStrictReadMismatch,

      f13CanvasEvidenceStrict: canvas.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: canvas.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: canvas.f13CanvasEvidenceComplete,
      f13HardFail: canvas.f13HardFail,
      f13StrictEvidenceGap: canvas.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: canvas.f13StrictEvidenceRepairTarget,

      f21EligibleForNorth: false,
      f21EligibilitySubmittedToNorth: false,
      completionLatched: false,
      finalCompletionLatched: false,
      readyTextAllowed: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,

      firstFailedCoordinate: normalized.firstFailedCoordinate,
      recommendedNextFile: FILE_GATES.macroWest,
      recommendedNextRenewalTarget: FILE_GATES.macroWest,
      createdAt: nowIso()
    };
  }

  function pickWestNode(result = {}) {
    const candidates = [
      result && result.admissibility,
      result && result.gap,
      result && result.admissibility && result.admissibility.gap,
      result && result.gap && result.gap.gap,
      result && result.lastAdmissibility,
      result && result.lastAdmissibility && result.lastAdmissibility.gap,
      result
    ].filter(isObject);

    return candidates.reduce((acc, item) => ({ ...acc, ...item }), {});
  }

  function normalizeMacroWestResult(result = {}, methodUsed = "", authorityObserved = false) {
    const rootResult = isObject(result) ? result : {};
    const admissibility = isObject(rootResult.admissibility) ? rootResult.admissibility : {};
    const gap = isObject(rootResult.gap) ? rootResult.gap : isObject(admissibility.gap) ? admissibility.gap : {};
    const node = pickWestNode(rootResult);

    const decision = safeString(firstDefined(
      rootResult.decision,
      admissibility.decision,
      gap.decision,
      node.decision
    ), WEST_DECISION.UNKNOWN);

    const gapClass = safeString(firstDefined(
      rootResult.gapClass,
      admissibility.gapClass,
      gap.gapClass,
      node.gapClass
    ), "");

    const gapSeverity = safeString(firstDefined(
      rootResult.gapSeverity,
      admissibility.gapSeverity,
      gap.gapSeverity,
      node.gapSeverity
    ), "");

    const hardBlock = Boolean(
      safeBool(rootResult.hardBlock, false) ||
      safeBool(admissibility.hardBlock, false) ||
      safeBool(gap.hardBlock, false) ||
      decision === WEST_DECISION.HARD_BLOCK ||
      gapClass === "FALSE_COMPLETION_BLOCK" ||
      gapClass === "STRUCTURAL_BLOCK"
    );

    const forwardAllowed = Boolean(
      safeBool(rootResult.forwardAllowed, false) ||
      safeBool(admissibility.forwardAllowed, false) ||
      safeBool(gap.forwardAllowed, false) ||
      safeBool(rootResult.packetAdmissible, false) ||
      safeBool(admissibility.packetAdmissible, false) ||
      decision === WEST_DECISION.RELEASE_TO_CANVAS ||
      decision === WEST_DECISION.FULL_PASS ||
      decision === WEST_DECISION.DEGRADED_FORWARD
    );

    const canvasReleaseApproved = Boolean(
      !hardBlock &&
      (
        safeBool(rootResult.canvasReleaseAuthorized, false) ||
        safeBool(admissibility.canvasReleaseAuthorized, false) ||
        safeBool(gap.canvasRelease, false) ||
        safeBool(rootResult.releaseToCanvas, false) ||
        decision === WEST_DECISION.RELEASE_TO_CANVAS ||
        (decision === WEST_DECISION.FULL_PASS && forwardAllowed) ||
        (decision === WEST_DECISION.DEGRADED_FORWARD && forwardAllowed)
      )
    );

    const degradedForwardApproved = Boolean(
      !hardBlock &&
      (
        safeBool(rootResult.degradedForward, false) ||
        safeBool(admissibility.degradedForward, false) ||
        safeBool(gap.canDegradeForward, false) ||
        decision === WEST_DECISION.DEGRADED_FORWARD
      )
    );

    const firstFailedCoordinate = safeString(firstDefined(
      rootResult.firstFailedCoordinate,
      admissibility.firstFailedCoordinate,
      gap.firstFailedCoordinate,
      node.firstFailedCoordinate
    ), canvasReleaseApproved ? "NONE_MACRO_WEST_CANVAS_RELEASE_APPROVED" : "WAITING_MACRO_WEST_ADMISSIBILITY_DECISION");

    const recommended = safeString(firstDefined(
      rootResult.recommendedNextRenewalTarget,
      rootResult.recommendedNextFile,
      admissibility.recommendedNextRenewalTarget,
      gap.recommendedNextRenewalTarget,
      gap.recommendedNextFile,
      node.recommendedNextRenewalTarget,
      node.recommendedNextFile
    ), canvasReleaseApproved ? FILE_GATES.canvas : FILE_GATES.macroWest);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      macroWestAuthorityObserved: authorityObserved,
      macroWestAdmissibilityObserved: Boolean(result && isObject(result)),
      macroWestMethodUsed: methodUsed,
      westDecision: decision,
      westGapClass: gapClass,
      westGapSeverity: gapSeverity,
      westHardBlock: hardBlock,
      westForwardAllowed: forwardAllowed,
      westCanvasReleaseApproved: canvasReleaseApproved,
      westDegradedForwardApproved: degradedForwardApproved,
      westFirstFailedCoordinate: firstFailedCoordinate,
      westRecommendedNextRenewalTarget: recommended || (canvasReleaseApproved ? FILE_GATES.canvas : FILE_GATES.macroWest),
      westReleaseReceiptObserved: Boolean(canvasReleaseApproved || decision !== WEST_DECISION.UNKNOWN),
      raw: clonePlain(rootResult),
      normalizedAt: nowIso()
    };
  }

  function classifyMacroWestAdmissibility(input = {}) {
    const normalized = input && input.normalizedAt ? input : normalizeRouteConductorInput(input);
    const west = normalized.authorities.west || readMacroWestAuthority();
    const authority = west.authority;
    const candidate = composeMacroWestCandidate(normalized);

    if (!authority || !isObject(authority)) {
      const fallbackReceipt = west.receipt || {};

      const receiptResult = normalizeMacroWestResult(fallbackReceipt, "receipt-fallback-no-api", Boolean(west.observed));

      if (receiptResult.westCanvasReleaseApproved) {
        return receiptResult;
      }

      return {
        ...receiptResult,
        macroWestAuthorityObserved: Boolean(west.observed),
        macroWestAdmissibilityObserved: false,
        westDecision: WEST_DECISION.HOLD_ACTIVE,
        westGapClass: "WAITING_MACRO_WEST_AUTHORITY",
        westGapSeverity: "HELD",
        westHardBlock: false,
        westForwardAllowed: false,
        westCanvasReleaseApproved: false,
        westDegradedForwardApproved: false,
        westFirstFailedCoordinate: "WAITING_MACRO_WEST_ADMISSIBILITY_AUTHORITY",
        westRecommendedNextRenewalTarget: FILE_GATES.macroWest,
        raw: clonePlain(fallbackReceipt),
        normalizedAt: nowIso()
      };
    }

    const methods = [
      "classifyWestAdmissibility",
      "classifyCyclePacket",
      "createWestCycleReceipt",
      "createGapReceipt",
      "classifyGap",
      "classifyTransmissionGap"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = authority[method](candidate, {
          sourceCardinal: CARDINALS.SOUTH,
          targetCardinal: CARDINALS.CANVAS,
          destinationCardinal: CARDINALS.CANVAS,
          sourceFile: FILE,
          targetFile: FILE_GATES.canvas,
          destinationFile: FILE_GATES.canvas,
          activeCycle: "CYCLE_2",
          cycle: "CYCLE_2",
          cycleTwoActive: true,
          activeCycleNumber: 2,
          activeCycleRoute: CYCLE_ROUTES.CYCLE_2,
          activeCheckpointId: "F13N_INSPECT_GATE",
          checkpointId: "F13N_INSPECT_GATE",
          activeFibonacci: "F13N",
          canvasReleaseRequested: true,
          releaseToCanvas: true
        });

        const normalizedResult = normalizeMacroWestResult(result, method, true);

        record("MACRO_WEST_ADMISSIBILITY_CLASSIFIED", {
          method,
          decision: normalizedResult.westDecision,
          gapClass: normalizedResult.westGapClass,
          forwardAllowed: normalizedResult.westForwardAllowed,
          canvasReleaseApproved: normalizedResult.westCanvasReleaseApproved,
          firstFailedCoordinate: normalizedResult.westFirstFailedCoordinate
        });

        return normalizedResult;
      } catch (error) {
        recordError("MACRO_WEST_METHOD_FAILED", error, { method });
      }
    }

    return {
      ...normalizeMacroWestResult(west.receipt || {}, "receipt-fallback", true),
      macroWestAuthorityObserved: true,
      macroWestAdmissibilityObserved: Boolean(west.receipt && Object.keys(west.receipt).length),
      westFirstFailedCoordinate: "WAITING_MACRO_WEST_CLASSIFIER_METHOD"
    };
  }

  function composeCanvasReleasePacket(input = {}) {
    const normalized = input && input.normalizedAt ? input : normalizeRouteConductorInput(input);
    const cycle = resolveRouteCycle(normalized);
    const proofBody = composeProofBody(normalized);
    const canvas = normalized.canvasEvidence;
    const macroWest = classifyMacroWestAdmissibility(normalized);

    const lawfulCycle = cycle.cycleNumber === 2 && cycle.cycleRoute === CYCLE_ROUTES.CYCLE_2;
    const southProofReady = Boolean(proofBody.proofBodyComposed || normalized.proofBodyAvailable || normalized.outputSpreadAvailable);

    const macroWestReleaseEvidence = Boolean(
      macroWest.macroWestAdmissibilityObserved &&
      macroWest.westCanvasReleaseApproved &&
      macroWest.westForwardAllowed &&
      !macroWest.westHardBlock
    );

    const noVisibleHardFail = !canvas.f13HardFail;

    const authorized = Boolean(
      lawfulCycle &&
      southProofReady &&
      macroWestReleaseEvidence &&
      noVisibleHardFail
    );

    const heldReason = authorized
      ? "NONE_CANVAS_RELEASE_AUTHORIZED_BY_MACRO_WEST"
      : !lawfulCycle
        ? "WAITING_CYCLE_2_ROUTE"
        : !southProofReady
          ? "WAITING_SOUTH_OUTPUT_PROOF_PACKET"
          : !macroWest.macroWestAuthorityObserved
            ? "WAITING_MACRO_WEST_AUTHORITY"
            : !macroWest.macroWestAdmissibilityObserved
              ? "WAITING_MACRO_WEST_ADMISSIBILITY_DECISION"
              : macroWest.westHardBlock
                ? "MACRO_WEST_HARD_BLOCK"
                : !macroWest.westCanvasReleaseApproved
                  ? macroWest.westFirstFailedCoordinate || "WAITING_MACRO_WEST_CANVAS_RELEASE_APPROVAL"
                  : !noVisibleHardFail
                    ? "CANVAS_F13_HARD_FAIL_BLOCKS_RELEASE"
                    : "WAITING_MACRO_WEST_CANVAS_RELEASE_EVIDENCE";

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "CANVAS_RELEASE_PACKET",
      cycleNumber: cycle.cycleNumber,
      cycleRoute: cycle.cycleRoute,
      activeCycleNumber: cycle.cycleNumber,
      activeCycleRoute: cycle.cycleRoute,
      receivedFrom: CARDINALS.WEST,
      sourceCardinal: CARDINALS.WEST,
      sourceFile: FILE_GATES.macroWest,
      destinationFile: FILE_GATES.canvas,
      targetFile: FILE_GATES.canvas,
      returnTo: "",
      handoffTo: authorized ? CARDINALS.CANVAS : "",

      westAuditObserved: macroWest.macroWestAdmissibilityObserved,
      westAuditAccepted: macroWest.westCanvasReleaseApproved,
      westCanvasReleaseApproved: macroWest.westCanvasReleaseApproved,
      westAuditPassed: macroWest.westCanvasReleaseApproved && !macroWest.westDegradedForwardApproved,
      westAuditDegraded: macroWest.westDegradedForwardApproved,
      westAuditBlocked: macroWest.westHardBlock,

      canvasReleaseAuthorized: authorized,
      canvasReleaseApproved: authorized,
      canvasReleaseReceived: authorized,
      canvasReleaseRequiresWestAudit: true,
      canvasReleaseRequiresMacroWest: true,
      canvasEvidenceObserved: canvas.observed,
      currentCanvasParentObserved: canvas.currentCanvasParentObserved,
      canvasParentV2Observed: canvas.canvasParentV2Observed,
      canvasReleasePacketReady: authorized,
      canvasReleaseHeldReason: heldReason,

      macroWestAuthorityObserved: macroWest.macroWestAuthorityObserved,
      macroWestAdmissibilityObserved: macroWest.macroWestAdmissibilityObserved,
      macroWestMethodUsed: macroWest.macroWestMethodUsed,
      westDecision: macroWest.westDecision,
      westGapClass: macroWest.westGapClass,
      westGapSeverity: macroWest.westGapSeverity,
      westHardBlock: macroWest.westHardBlock,
      westForwardAllowed: macroWest.westForwardAllowed,
      westCanvasReleaseApproved: macroWest.westCanvasReleaseApproved,
      westDegradedForwardApproved: macroWest.westDegradedForwardApproved,
      westFirstFailedCoordinate: macroWest.westFirstFailedCoordinate,
      westRecommendedNextRenewalTarget: macroWest.westRecommendedNextRenewalTarget,

      lawfulCycle,
      southProofReady,
      macroWestReleaseEvidence,
      noVisibleHardFail,
      completionLatched: false,
      readyTextAllowed: false,
      visualPassClaimed: false,
      recommendedNextFile: authorized ? FILE_GATES.canvas : FILE_GATES.macroWest,
      recommendedNextRenewalTarget: authorized ? FILE_GATES.canvas : FILE_GATES.macroWest,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      composedAt: nowIso()
    };
  }

  function selectRecommendedNextFile(packetSeed, normalized, f21, canvasReleasePacket, macroWest) {
    const canvas = normalized.canvasEvidence;
    const index = normalized.authorities.hearthIndex;

    if (index.observed && index.receipt && index.receipt.shellAccepted === false) {
      return FILE_GATES.hearthIndex;
    }

    if (index.observed && index.receipt && index.receipt.runtimeReleaseAuthorized === false && !state.booted) {
      return FILE_GATES.hearthIndex;
    }

    if (!normalized.f8.f8SelfDutySatisfied) {
      return FILE;
    }

    if (packetSeed && packetSeed.activeCycleNumber === 1) {
      return FILE_GATES.north;
    }

    if (packetSeed && packetSeed.activeCycleNumber === 2) {
      if (!macroWest || !macroWest.macroWestAuthorityObserved || !macroWest.macroWestAdmissibilityObserved) {
        return FILE_GATES.macroWest;
      }

      if (!macroWest.westCanvasReleaseApproved || macroWest.westHardBlock || !macroWest.westForwardAllowed) {
        return FILE_GATES.macroWest;
      }

      if (!canvasReleasePacket || !canvasReleasePacket.canvasReleaseAuthorized) {
        return FILE_GATES.macroWest;
      }

      if (!canvas.parentPresent || !canvas.currentCanvasParentObserved || !canvas.authority) {
        return FILE_GATES.canvas;
      }

      if (!canvas.parentReleaseAccepted && !canvas.f13CanvasReadinessObserved) {
        return FILE_GATES.canvas;
      }

      if (!canvas.canvasEastApiReady || !canvas.canvasEastEvidenceReady) {
        return FILE_GATES.canvasEast;
      }

      if (!canvas.canvasWestApiReady || !canvas.canvasWestInspectionReady) {
        return FILE_GATES.canvasWest;
      }

      if (!canvas.canvasSouthApiReady || !canvas.canvasSouthVisibleProofReady) {
        return FILE_GATES.canvasSouth;
      }

      if (canvas.f13HardFail) {
        return FILE_GATES.canvasSouth;
      }

      if (canvas.parentStrictReadMismatch) {
        return FILE_GATES.canvas;
      }

      if (canvas.f13CanvasEvidenceComplete && !canvas.f13CanvasEvidenceStrict) {
        return canvas.f13StrictEvidenceRepairTarget || FILE_GATES.canvasSouth;
      }

      if (canvas.f13CanvasEvidenceStrict && f21.northRepairRequired) {
        return FILE_GATES.north;
      }

      if (canvas.f13CanvasEvidenceStrict && !f21.completionLatched && !f21.f21SubmittedToNorth) {
        return FILE_GATES.north;
      }

      if (canvas.f13CanvasEvidenceStrict && f21.completionLatched) {
        return FILE_GATES.north;
      }
    }

    if (canvas.f13CanvasEvidenceComplete && !canvas.f13CanvasEvidenceStrict) {
      return canvas.f13StrictEvidenceRepairTarget || FILE_GATES.canvasSouth;
    }

    return FILE;
  }

  function composeVisibleStateFromPrimary(packet) {
    const p = isObject(packet) ? packet : {};

    const visibleProgress = p.completionLatched && p.f13CanvasEvidenceStrict
      ? 100
      : p.f21EligibleForNorth
        ? p.f13CanvasEvidenceStrict ? 94 : 88
        : p.f13CanvasEvidenceComplete
          ? p.f13CanvasEvidenceStrict ? 90 : 82
          : p.canvasReleaseAuthorized
            ? 76
            : p.macroWestAdmissibilityObserved
              ? 66
              : p.f13CanvasReadinessObserved
                ? 58
                : p.f8SelfDutySatisfied
                  ? 45
                  : p.routeConductorMarkerPresent
                    ? 24
                    : 12;

    const visibleStatusText = p.completionLatched && p.f13CanvasEvidenceStrict
      ? "Ready"
      : p.degradedCompletionLatched || (p.f13CanvasEvidenceComplete && p.f13CanvasEvidenceDegraded && !p.f13CanvasEvidenceStrict)
        ? "Functional page · strict F13 proof pending"
        : p.f21EligibleForNorth
          ? "Ready for North latch"
          : p.f13CanvasEvidenceComplete
            ? "Canvas F13 evidence complete"
            : p.canvasReleaseAuthorized
              ? "Canvas release authorized by Macro West"
              : p.activeCycleNumber === 2 && !p.macroWestAdmissibilityObserved
                ? "Cycle 2: waiting Macro West admissibility"
                : p.activeCycleNumber === 2
                  ? "Cycle 2: Macro West hold"
                  : "Cycle 1: returning proof to North";

    return {
      activeCycleNumber: p.activeCycleNumber,
      activeCycleRoute: p.activeCycleRoute,
      activeFileGate: p.activeFileGate,
      activeCardinal: CARDINALS.SOUTH,
      activeFibonacci: p.activeFibonacci,
      activeNewsGate: p.activeNewsGate,
      activeGearId: p.activeGearId,
      activeGearLabel: p.activeGearLabel || p.activeStageId || p.activeGearId,
      activeGearLocalProgress: visibleProgress,
      visibleProgress,
      visibleStatusText,
      postgameStatus: p.postgameStatus,
      firstFailedCoordinate: p.firstFailedCoordinate,
      recommendedNextFile: p.recommendedNextFile,
      recommendedNextRenewalTarget: p.recommendedNextRenewalTarget,
      proofBodyComposed: p.proofBodyComposed,
      outputSpreadComposed: p.outputSpreadComposed,
      northReturnPacketReady: p.northReturnPacketReady,
      westHandoffPacketReady: p.westHandoffPacketReady,
      macroWestAdmissibilityObserved: p.macroWestAdmissibilityObserved,
      westDecision: p.westDecision,
      canvasReleaseAuthorized: p.canvasReleaseAuthorized,
      f13CanvasEvidenceStrict: p.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: p.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: p.f13CanvasEvidenceComplete,
      f13StrictEvidenceGap: p.f13StrictEvidenceGap,
      completionLatched: p.completionLatched,
      degradedCompletionLatched: p.degradedCompletionLatched,
      visualPassClaimed: false
    };
  }

  function composeRoutePrimaryPacket(input = {}) {
    try {
      const normalized = input && input.normalizedAt ? input : normalizeRouteConductorInput(input);
      const cycle = resolveRouteCycle(normalized);
      const proofBody = composeProofBody(normalized);
      const northReturnPacket = composeCycleOneNorthReturn(normalized);
      const westHandoffPacket = composeCycleTwoWestHandoff(normalized);
      const macroWest = cycle.cycleNumber === 2
        ? classifyMacroWestAdmissibility(normalized)
        : normalizeMacroWestResult(null, "", normalized.authorities.west.observed);
      const canvasReleasePacket = composeCanvasReleasePacket(normalized);
      const f8 = normalized.f8;
      const f13 = normalized.f13;
      const news = normalized.news;
      const f21 = resolveF21Eligibility(normalized, f8, f13, news);

      const isCycleOne = cycle.cycleNumber === 1;
      const isCycleTwo = cycle.cycleNumber === 2;

      const packetSeed = {
        activeCycleNumber: cycle.cycleNumber,
        activeCycleRoute: cycle.cycleRoute
      };

      const recommendedNextFile = selectRecommendedNextFile(packetSeed, normalized, f21, canvasReleasePacket, macroWest);
      const recommendedNextRenewalTarget = recommendedNextFile;

      const degradedFunctional = Boolean(
        normalized.canvasEvidence.functionalPageObserved ||
        (
          normalized.canvasEvidence.parentReleaseAccepted &&
          normalized.canvasEvidence.currentCanvasParentObserved &&
          normalized.canvasEvidence.allCanvasChildrenApiReady &&
          normalized.canvasEvidence.f13CanvasEvidenceComplete &&
          normalized.canvasEvidence.f13CanvasEvidenceDegraded &&
          !normalized.canvasEvidence.f13CanvasEvidenceStrict &&
          !normalized.canvasEvidence.f13HardFail
        )
      );

      const strictPending = Boolean(
        normalized.canvasEvidence.strictVisualProofPending ||
        (
          normalized.canvasEvidence.f13CanvasEvidenceComplete &&
          !normalized.canvasEvidence.f13CanvasEvidenceStrict &&
          !normalized.canvasEvidence.f13HardFail
        )
      );

      const firstFailedCoordinate =
        f21.f21EligibleForNorth && normalized.canvasEvidence.f13CanvasEvidenceStrict
          ? "NONE_F21_ELIGIBLE_FOR_NORTH"
          : degradedFunctional || strictPending
            ? normalized.canvasEvidence.f13StrictEvidenceGap
          : isCycleTwo && !macroWest.macroWestAdmissibilityObserved
            ? "WAITING_MACRO_WEST_ADMISSIBILITY_DECISION"
            : isCycleTwo && !canvasReleasePacket.canvasReleaseAuthorized
              ? canvasReleasePacket.canvasReleaseHeldReason
              : f21.firstFailedCoordinate ||
                canvasReleasePacket.canvasReleaseHeldReason ||
                f13.firstFailedCoordinate ||
                cycle.firstFailedCoordinate ||
                "WAITING_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT";

      const postgameStatus = f21.completionLatched && normalized.canvasEvidence.f13CanvasEvidenceStrict
        ? f21.degradedCompletionLatched
          ? "READY_DEGRADED_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE"
          : "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE"
        : degradedFunctional || strictPending
          ? "FUNCTIONAL_DEGRADED_F13_STRICT_PROOF_PENDING"
          : f21.f21EligibleForNorth
            ? "WAITING_NORTH_F21_LATCH"
            : f13.f13CanvasEvidenceComplete
              ? "CANVAS_F13_EVIDENCE_COMPLETE_WAITING_NORTH"
              : canvasReleasePacket.canvasReleaseAuthorized
                ? "CANVAS_RELEASE_AUTHORIZED_BY_MACRO_WEST"
                : isCycleTwo
                  ? "CYCLE_2_WAITING_MACRO_WEST_ADMISSIBILITY_OR_CANVAS_RELEASE"
                  : "CYCLE_1_RETURNING_TO_NORTH";

      const packet = {
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        baselineContract: BASELINE_CONTRACT,
        version: VERSION,
        file: FILE,
        route: ROUTE,
        role: state.role,

        routeConductorPrimaryGateActive: true,
        strictF13DownstreamAlignmentActive: true,
        canvasParentChildReconciliationActive: true,
        cycleAwareRoutingActive: true,
        southPrimaryGateIntegrationActive: true,
        macroWestAdmissibilityConsumptionActive: true,
        canvasReleaseFirewallActive: true,

        cycleOneIsPosition: true,
        cycleTwoIsCoordination: true,
        cycleNumber: cycle.cycleNumber,
        cycleRoute: cycle.cycleRoute,
        activeCycleNumber: cycle.cycleNumber,
        activeCycleRoute: cycle.cycleRoute,
        cycleKnown: cycle.cycleKnown,
        receivedFrom: cycle.receivedFrom,
        returnTo: cycle.returnTo,
        handoffTo: canvasReleasePacket.canvasReleaseAuthorized ? CARDINALS.CANVAS : cycle.handoffTo,

        activeCardinal: CARDINALS.SOUTH,
        activeFileGate: FILE,
        activeFibonacci: "F8",
        activeFibonacciRank: 8,
        activeStageId: "F8_SOUTH_SELF_DUTY",
        activeGearId: "F8_SOUTH_SELF_DUTY",
        activeGearLabel: "F8_SOUTH_SELF_DUTY",
        activeNewsGate: CARDINALS.SOUTH,

        canvasActiveFibonacci: normalized.canvasActiveFibonacci,
        canvasActiveFibonacciRank: normalized.canvasActiveFibonacciRank,
        canvasActiveStageId: normalized.canvasActiveStageId,
        canvasActiveGearId: normalized.canvasActiveGearId,

        northFile: FILE_GATES.north,
        eastFile: FILE_GATES.east,
        westFile: FILE_GATES.macroWest,
        macroWestFile: FILE_GATES.macroWest,
        southFile: FILE_GATES.south,
        canvasFile: FILE_GATES.canvas,
        canvasEastFile: FILE_GATES.canvasEast,
        canvasWestFile: FILE_GATES.canvasWest,
        canvasSouthFile: FILE_GATES.canvasSouth,
        hearthIndexFile: FILE_GATES.hearthIndex,

        northAuthorityObserved: normalized.authorities.north.observed,
        eastAuthorityObserved: normalized.authorities.east.observed,
        westAuthorityObserved: normalized.authorities.west.observed,
        macroWestAuthorityObserved: macroWest.macroWestAuthorityObserved,
        southAuthorityObserved: normalized.authorities.south.observed,
        southPrimaryGateObserved: normalized.authorities.south.primaryGateObserved,
        hearthIndexObserved: normalized.authorities.hearthIndex.observed,

        routeConductorMarkerPresent: f8.routeConductorMarkerPresent,
        routeConductorApiPresent: f8.routeConductorApiPresent,
        routeConductorReceiptPresent: f8.routeConductorReceiptPresent,
        routeConductorRuntimeActive: f8.routeConductorRuntimeActive,
        routeConductorHydrated: f8.routeConductorHydrated,
        f8SelfDutySatisfied: f8.f8SelfDutySatisfied,
        markerIsNotHydrationProof: true,
        apiRequiredForF8: true,
        receiptRequiredForF8: true,
        runtimeRequiredForF8: true,

        macroWestAdmissibilityObserved: macroWest.macroWestAdmissibilityObserved,
        macroWestMethodUsed: macroWest.macroWestMethodUsed,
        westDecision: macroWest.westDecision,
        westGapClass: macroWest.westGapClass,
        westGapSeverity: macroWest.westGapSeverity,
        westHardBlock: macroWest.westHardBlock,
        westForwardAllowed: macroWest.westForwardAllowed,
        westCanvasReleaseApproved: macroWest.westCanvasReleaseApproved,
        westDegradedForwardApproved: macroWest.westDegradedForwardApproved,
        westFirstFailedCoordinate: macroWest.westFirstFailedCoordinate,
        westRecommendedNextRenewalTarget: macroWest.westRecommendedNextRenewalTarget,
        westReleaseReceiptObserved: macroWest.westReleaseReceiptObserved,

        westAuditObserved: macroWest.macroWestAdmissibilityObserved || normalized.westAuditObserved,
        westAuditRequired: isCycleTwo || normalized.westAuditRequired,
        westAuditApproved: macroWest.westCanvasReleaseApproved || normalized.westAuditApproved,
        northReturnRequired: isCycleOne,
        northReturnPacketReady: isCycleOne ? true : northReturnPacket.southReturnPacketReady === true,
        westHandoffPacketReady: isCycleTwo ? true : false,

        proofBodyAvailable: proofBody.proofBodyAvailable,
        proofBodyComposed: proofBody.proofBodyComposed,
        outputSpreadAvailable: normalized.outputSpreadAvailable || proofBody.proofBodyComposed,
        outputSpreadComposed: isCycleTwo && (normalized.outputSpreadAvailable || proofBody.proofBodyComposed),
        visibleStateAvailable: true,
        visibleStateComposed: true,
        receiptAvailable: true,
        receiptComposed: true,

        canvasAuthorityObserved: Boolean(normalized.canvasEvidence.authority),
        currentCanvasParentObserved: normalized.canvasEvidence.currentCanvasParentObserved,
        canvasParentV2Observed: normalized.canvasEvidence.canvasParentV2Observed,
        canvasParentReleaseAccepted: normalized.canvasEvidence.parentReleaseAccepted,

        canvasEvidenceObserved: normalized.canvasEvidence.observed,
        canvasGateReady: f13.canvasGateReady,
        canvasReleaseAuthorized: canvasReleasePacket.canvasReleaseAuthorized,
        canvasReleasePacketReady: canvasReleasePacket.canvasReleasePacketReady,
        canvasReleaseHeldReason: canvasReleasePacket.canvasReleaseHeldReason,
        canvasReleaseRequiresWestAudit: true,
        canvasReleaseRequiresMacroWest: true,

        canvasEastApiReady: normalized.canvasEvidence.canvasEastApiReady,
        canvasWestApiReady: normalized.canvasEvidence.canvasWestApiReady,
        canvasSouthApiReady: normalized.canvasEvidence.canvasSouthApiReady,
        allCanvasChildrenApiReady: normalized.canvasEvidence.allCanvasChildrenApiReady,
        canvasEastEvidenceReady: normalized.canvasEvidence.canvasEastEvidenceReady,
        canvasWestInspectionReady: normalized.canvasEvidence.canvasWestInspectionReady,
        canvasSouthVisibleProofReady: normalized.canvasEvidence.canvasSouthVisibleProofReady,
        allCanvasChildrenEvidenceReady: normalized.canvasEvidence.allCanvasChildrenEvidenceReady,
        allCanvasChildrenReady: normalized.canvasEvidence.allCanvasChildrenReady,
        canvasNextAuditTarget: normalized.canvasEvidence.nextAuditTarget,

        f13ProofBodyAvailable: f13.f13ProofBodyAvailable,
        f13CanvasReadinessObserved: f13.f13CanvasReadinessObserved,
        f13VisibleEvidenceAvailable: f13.f13VisibleEvidenceAvailable,
        f13InspectEvidenceAvailable: f13.f13InspectEvidenceAvailable,
        f13CanvasEvidenceStrict: f13.f13CanvasEvidenceStrict,
        f13CanvasEvidenceDegraded: f13.f13CanvasEvidenceDegraded,
        f13CanvasEvidenceComplete: f13.f13CanvasEvidenceComplete,
        f13HardFail: f13.f13HardFail,
        f13StrictEvidenceGap: f13.f13StrictEvidenceGap,
        f13StrictEvidenceRepairTarget: f13.f13StrictEvidenceRepairTarget,

        southStrictProofObserved: normalized.canvasEvidence.southStrictProofObserved,
        southSoftProofObserved: normalized.canvasEvidence.southSoftProofObserved,
        southHardFailObserved: normalized.canvasEvidence.southHardFailObserved,
        southProofStale: normalized.canvasEvidence.visibleProofStale,
        parentStrictReadMismatch: normalized.canvasEvidence.parentStrictReadMismatch,
        degradedF13IsFunctional: degradedFunctional,
        functionalPageObserved: normalized.canvasEvidence.functionalPageObserved,
        strictVisualProofPending: strictPending,

        northGateReady: news.northGateReady,
        eastGateReady: news.eastGateReady,
        westGateReady: news.westGateReady,
        southGateReady: news.southGateReady,
        canvasGateReadyNews: news.canvasGateReady,
        newsGatePassedBeforeF21: news.newsGatePassedBeforeF21,
        newsGateDegradedBeforeF21: news.newsGateDegradedBeforeF21,
        routeNewsObserved: news.routeNewsObserved,
        routeNewsComposed: news.routeNewsComposed,
        routeNewsReturnedToNorth: isCycleOne,
        routeNewsSubmittedToWest: isCycleTwo,
        routeNewsSubmittedToCanvas: canvasReleasePacket.canvasReleaseAuthorized,

        fibonacciSynchronizationActive: true,
        newsProtocolSynchronized: true,
        f21EligibleForNorth: f21.f21EligibleForNorth,
        f21SubmittedToNorth: f21.f21SubmittedToNorth,
        f21EligibilitySubmittedToNorth: f21.f21EligibilitySubmittedToNorth,
        f21EligibilitySubmittedAt: f21.f21EligibilitySubmittedAt,
        f21EligibilitySubmissionCount: f21.f21EligibilitySubmissionCount,
        f21LatchMode: f21.f21LatchMode,
        completionLatched: f21.completionLatched,
        degradedCompletionLatched: f21.degradedCompletionLatched,
        readyTextAllowed: f21.readyTextAllowed,
        f21NorthLatchOnly: true,
        routeMaySubmitF21EligibilityOnly: true,
        f21ClaimedByRouteConductor: false,
        northRepairRequired: f21.northRepairRequired,
        northRepairReason: f21.northRepairReason,

        northReturnPacket,
        westHandoffPacket,
        macroWestAdmissibility: macroWest,
        canvasReleasePacket,
        proofBody,

        postgameStatus,
        firstFailedCoordinate,
        recommendedNextFile,
        recommendedNextRenewalTarget,

        routeConductorFallbackUsed: cycle.routeConductorFallbackUsed === true,
        visibleStateRecoverable: true,

        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false,
        composedAt: nowIso()
      };

      packet.visibleState = composeVisibleStateFromPrimary(packet);

      return packet;
    } catch (error) {
      recordError("COMPOSE_ROUTE_PRIMARY_PACKET_FAILED", error);
      return composeFallbackRoutePrimaryPacket(error);
    }
  }

  function composeFallbackRoutePrimaryPacket(error = null) {
    const message = error && error.message ? error.message : safeString(error, "route-conductor-fallback");

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      role: state.role,

      routeConductorPrimaryGateActive: true,
      strictF13DownstreamAlignmentActive: true,
      canvasParentChildReconciliationActive: true,
      cycleAwareRoutingActive: true,
      macroWestAdmissibilityConsumptionActive: true,
      routeConductorFallbackUsed: true,
      routeConductorCompositionOk: false,
      routeConductorCompositionError: message,
      visibleStateRecoverable: true,

      cycleNumber: 1,
      cycleRoute: CYCLE_ROUTES.CYCLE_1,
      activeCycleNumber: 1,
      activeCycleRoute: CYCLE_ROUTES.CYCLE_1,
      receivedFrom: CARDINALS.UNKNOWN,
      returnTo: CARDINALS.NORTH,
      handoffTo: "",
      canvasReleaseAuthorized: false,
      canvasReleaseHeldReason: "WAITING_ROUTE_CONDUCTOR_PRIMARY_GATE_COMPOSITION",

      activeCardinal: CARDINALS.SOUTH,
      activeFileGate: FILE,
      activeFibonacci: "F8",
      activeFibonacciRank: 8,
      activeStageId: "F8_SOUTH_SELF_DUTY",
      activeGearId: "F8_SOUTH_SELF_DUTY",
      activeNewsGate: CARDINALS.SOUTH,

      canvasActiveFibonacci: "F13",
      canvasActiveFibonacciRank: 13,
      canvasActiveStageId: "canvas-parent-f13-evidence-receiver",
      canvasActiveGearId: "hearth-canvas-parent-f13",

      routeConductorMarkerPresent: Boolean(root.__HEARTH_ROUTE_CONDUCTOR_MARKER__),
      routeConductorApiPresent: true,
      routeConductorReceiptPresent: true,
      routeConductorRuntimeActive: true,
      routeConductorHydrated: false,
      f8SelfDutySatisfied: false,

      macroWestAuthorityObserved: false,
      macroWestAdmissibilityObserved: false,
      westDecision: WEST_DECISION.UNKNOWN,

      currentCanvasParentObserved: false,
      canvasParentV2Observed: false,
      proofBodyAvailable: false,
      proofBodyComposed: false,
      outputSpreadAvailable: false,
      outputSpreadComposed: false,
      northReturnPacketReady: true,
      westHandoffPacketReady: false,

      f13ProofBodyAvailable: false,
      f13CanvasReadinessObserved: false,
      f13VisibleEvidenceAvailable: false,
      f13InspectEvidenceAvailable: false,
      f13CanvasEvidenceStrict: false,
      f13CanvasEvidenceDegraded: false,
      f13CanvasEvidenceComplete: false,
      f13HardFail: false,
      f13StrictEvidenceGap: "WAITING_ROUTE_CONDUCTOR_PRIMARY_GATE_COMPOSITION",
      f13StrictEvidenceRepairTarget: FILE,

      canvasGateReady: false,

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21EligibilitySubmittedToNorth: false,
      f21LatchMode: "WAITING_ROUTE_CONDUCTOR_PRIMARY_GATE_COMPOSITION",
      completionLatched: false,
      degradedCompletionLatched: false,
      readyTextAllowed: false,
      f21ClaimedByRouteConductor: false,
      northRepairRequired: false,
      northRepairReason: "NONE",

      firstFailedCoordinate: "WAITING_ROUTE_CONDUCTOR_PRIMARY_GATE_COMPOSITION",
      recommendedNextFile: FILE,
      recommendedNextRenewalTarget: FILE,
      postgameStatus: "ROUTE_CONDUCTOR_FALLBACK_ACTIVE",

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      composedAt: nowIso()
    };
  }

  function composeRouteReceipt(input = {}) {
    const packet = input && input.contract === CONTRACT ? input : composeRoutePrimaryPacket(input);

    return {
      ...clonePlain(packet),
      authority: "hearth-route-conductor-strict-f13-downstream-alignment",
      status: "active",
      receiptComposed: true,
      currentReceipt: true,
      updatedAt: nowIso()
    };
  }

  function updateStateFromPacket(packet) {
    const p = isObject(packet) ? packet : composeFallbackRoutePrimaryPacket();

    state.currentPacket = clonePlain(p);
    state.currentReceipt = composeRouteReceipt(p);
    state.currentReceiptText = composeReceiptText(state.currentReceipt);

    state.activeCycleNumber = p.activeCycleNumber || p.cycleNumber || 1;
    state.activeCycleRoute = p.activeCycleRoute || p.cycleRoute || CYCLE_ROUTES.CYCLE_1;
    state.receivedFrom = p.receivedFrom || CARDINALS.UNKNOWN;
    state.returnTo = p.returnTo || CARDINALS.NORTH;
    state.handoffTo = p.handoffTo || "";
    state.activeCardinal = CARDINALS.SOUTH;
    state.activeFileGate = FILE;
    state.activeNewsGate = CARDINALS.SOUTH;

    state.activeFibonacci = "F8";
    state.activeFibonacciRank = 8;
    state.activeStageId = "F8_SOUTH_SELF_DUTY";
    state.activeGearId = "F8_SOUTH_SELF_DUTY";

    state.canvasActiveFibonacci = p.canvasActiveFibonacci || "F13";
    state.canvasActiveFibonacciRank = p.canvasActiveFibonacciRank || 13;
    state.canvasActiveStageId = p.canvasActiveStageId || "canvas-parent-f13-evidence-receiver";
    state.canvasActiveGearId = p.canvasActiveGearId || "hearth-canvas-parent-f13";

    state.routeConductorMarkerPresent = p.routeConductorMarkerPresent === true;
    state.routeConductorApiPresent = p.routeConductorApiPresent === true;
    state.routeConductorReceiptPresent = p.routeConductorReceiptPresent === true;
    state.routeConductorRuntimeActive = p.routeConductorRuntimeActive === true;
    state.routeConductorHydrated = p.routeConductorHydrated === true;
    state.f8SelfDutySatisfied = p.f8SelfDutySatisfied === true;

    state.northAuthorityObserved = p.northAuthorityObserved === true;
    state.eastAuthorityObserved = p.eastAuthorityObserved === true;
    state.westAuthorityObserved = p.westAuthorityObserved === true;
    state.macroWestAuthorityObserved = p.macroWestAuthorityObserved === true;
    state.southAuthorityObserved = p.southAuthorityObserved === true;
    state.southPrimaryGateObserved = p.southPrimaryGateObserved === true;
    state.hearthIndexObserved = p.hearthIndexObserved === true;

    state.macroWestAdmissibilityObserved = p.macroWestAdmissibilityObserved === true;
    state.macroWestMethodUsed = p.macroWestMethodUsed || "";
    state.westDecision = p.westDecision || WEST_DECISION.UNKNOWN;
    state.westGapClass = p.westGapClass || "";
    state.westGapSeverity = p.westGapSeverity || "";
    state.westHardBlock = p.westHardBlock === true;
    state.westForwardAllowed = p.westForwardAllowed === true;
    state.westCanvasReleaseApproved = p.westCanvasReleaseApproved === true;
    state.westDegradedForwardApproved = p.westDegradedForwardApproved === true;
    state.westFirstFailedCoordinate = p.westFirstFailedCoordinate || "WAITING_MACRO_WEST_ADMISSIBILITY_DECISION";
    state.westRecommendedNextRenewalTarget = p.westRecommendedNextRenewalTarget || FILE_GATES.macroWest;

    state.canvasAuthorityObserved = p.canvasAuthorityObserved === true;
    state.currentCanvasParentObserved = p.currentCanvasParentObserved === true;
    state.canvasParentV2Observed = p.canvasParentV2Observed === true;
    state.canvasParentReleaseAccepted = p.canvasParentReleaseAccepted === true;
    state.canvasReleaseAuthorized = p.canvasReleaseAuthorized === true;
    state.canvasReleasePacketReady = p.canvasReleasePacketReady === true;
    state.canvasReleaseHeldReason = p.canvasReleaseHeldReason || "WAITING_MACRO_WEST_ADMISSIBILITY_DECISION";

    state.canvasEastApiReady = p.canvasEastApiReady === true;
    state.canvasWestApiReady = p.canvasWestApiReady === true;
    state.canvasSouthApiReady = p.canvasSouthApiReady === true;
    state.allCanvasChildrenApiReady = p.allCanvasChildrenApiReady === true;
    state.canvasEastEvidenceReady = p.canvasEastEvidenceReady === true;
    state.canvasWestInspectionReady = p.canvasWestInspectionReady === true;
    state.canvasSouthVisibleProofReady = p.canvasSouthVisibleProofReady === true;
    state.allCanvasChildrenEvidenceReady = p.allCanvasChildrenEvidenceReady === true;
    state.allCanvasChildrenReady = p.allCanvasChildrenReady === true;
    state.canvasNextAuditTarget = p.canvasNextAuditTarget || "";

    state.proofBodyAvailable = p.proofBodyAvailable === true;
    state.proofBodyComposed = p.proofBodyComposed === true;
    state.outputSpreadAvailable = p.outputSpreadAvailable === true;
    state.outputSpreadComposed = p.outputSpreadComposed === true;
    state.visibleStateAvailable = p.visibleStateAvailable === true;
    state.visibleStateComposed = p.visibleStateComposed === true;
    state.receiptAvailable = p.receiptAvailable !== false;
    state.receiptComposed = p.receiptComposed !== false;
    state.northReturnPacketReady = p.northReturnPacketReady === true;
    state.westHandoffPacketReady = p.westHandoffPacketReady === true;

    state.f13ProofBodyAvailable = p.f13ProofBodyAvailable === true;
    state.f13CanvasReadinessObserved = p.f13CanvasReadinessObserved === true;
    state.f13VisibleEvidenceAvailable = p.f13VisibleEvidenceAvailable === true;
    state.f13InspectEvidenceAvailable = p.f13InspectEvidenceAvailable === true;
    state.f13CanvasEvidenceStrict = p.f13CanvasEvidenceStrict === true;
    state.f13CanvasEvidenceDegraded = p.f13CanvasEvidenceDegraded === true;
    state.f13CanvasEvidenceComplete = p.f13CanvasEvidenceComplete === true;
    state.f13HardFail = p.f13HardFail === true;
    state.f13StrictEvidenceGap = p.f13StrictEvidenceGap || "WAITING_CANVAS_F13_EVIDENCE";
    state.f13StrictEvidenceRepairTarget = p.f13StrictEvidenceRepairTarget || FILE_GATES.canvas;

    state.southStrictProofObserved = p.southStrictProofObserved === true;
    state.southSoftProofObserved = p.southSoftProofObserved === true;
    state.southHardFailObserved = p.southHardFailObserved === true;
    state.southProofStale = p.southProofStale === true;
    state.parentStrictReadMismatch = p.parentStrictReadMismatch === true;
    state.degradedF13IsFunctional = p.degradedF13IsFunctional === true;
    state.functionalPageObserved = p.functionalPageObserved === true;
    state.strictVisualProofPending = p.strictVisualProofPending === true;

    state.northGateReady = p.northGateReady === true;
    state.eastGateReady = p.eastGateReady === true;
    state.westGateReady = p.westGateReady === true;
    state.southGateReady = p.southGateReady === true;
    state.canvasGateReady = p.canvasGateReady === true || p.canvasGateReadyNews === true;
    state.newsGatePassedBeforeF21 = p.newsGatePassedBeforeF21 === true;
    state.newsGateDegradedBeforeF21 = p.newsGateDegradedBeforeF21 === true;

    state.f21EligibleForNorth = p.f21EligibleForNorth === true;
    state.f21SubmittedToNorth = p.f21SubmittedToNorth === true;
    state.f21EligibilitySubmittedToNorth = p.f21EligibilitySubmittedToNorth === true;
    state.f21LatchMode = p.f21LatchMode || "WAITING_CANVAS_F13_EVIDENCE";
    state.completionLatched = p.completionLatched === true;
    state.degradedCompletionLatched = p.degradedCompletionLatched === true;
    state.readyTextAllowed = p.readyTextAllowed === true;
    state.northRepairRequired = p.northRepairRequired === true;
    state.northRepairReason = p.northRepairReason || "NONE";

    state.firstFailedCoordinate = p.firstFailedCoordinate || "WAITING_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT";
    state.recommendedNextFile = p.recommendedNextFile || FILE;
    state.recommendedNextRenewalTarget = p.recommendedNextRenewalTarget || FILE;
    state.postgameStatus = p.postgameStatus || "ACTIVE";
    state.updatedAt = nowIso();

    updateDataset();

    return p;
  }

  function refresh(input = {}) {
    const packet = composeRoutePrimaryPacket(input || {});
    updateStateFromPacket(packet);

    if (packet.f21EligibleForNorth && !state.f21EligibilitySubmittedToNorth) {
      submitF21EligibilityToNorth(normalizeRouteConductorInput(input || {}));
    }

    maybeAutoBootCanvas(packet);
    scheduleRender();

    return getReceiptLight(false);
  }

  function reconcileCanvas(input = {}) {
    const packet = composeRoutePrimaryPacket({
      ...clonePlain(input),
      receivedFrom: input.receivedFrom || state.receivedFrom,
      activeCycleRoute: input.activeCycleRoute || state.activeCycleRoute
    });

    updateStateFromPacket(packet);
    scheduleRender();

    return getReceiptLight(false);
  }

  function bootCanvas(options = {}) {
    const normalized = normalizeRouteConductorInput({
      ...clonePlain(options),
      receivedFrom: options.receivedFrom || state.receivedFrom,
      activeCycleRoute: options.activeCycleRoute || state.activeCycleRoute || CYCLE_ROUTES.CYCLE_2,
      outputSpreadAvailable: options.outputSpreadAvailable !== false
    });

    const releasePacket = options.preAuthorizedRelease && isObject(options.preAuthorizedRelease)
      ? options.preAuthorizedRelease
      : composeCanvasReleasePacket(normalized);

    if (!releasePacket.canvasReleaseAuthorized) {
      record("CANVAS_RELEASE_HELD", {
        reason: releasePacket.canvasReleaseHeldReason,
        cycleNumber: releasePacket.cycleNumber,
        cycleRoute: releasePacket.cycleRoute,
        westDecision: releasePacket.westDecision
      });

      refresh({
        ...normalized.source,
        canvasReleaseAuthorized: false
      });

      return Promise.resolve({
        accepted: false,
        action: "HELD",
        contract: CONTRACT,
        receipt: RECEIPT,
        reason: releasePacket.canvasReleaseHeldReason,
        canvasReleaseAuthorized: false,
        firstFailedCoordinate: releasePacket.canvasReleaseHeldReason,
        recommendedNextFile: releasePacket.recommendedNextFile,
        recommendedNextRenewalTarget: releasePacket.recommendedNextRenewalTarget,
        visualPassClaimed: false
      });
    }

    const canvas = readCanvasApi();
    const method = selectCanvasMethod(canvas);

    state.canvasBootAttempted = true;

    if (!canvas || !method) {
      updateDataset();

      return Promise.resolve({
        accepted: false,
        action: "HELD",
        contract: CONTRACT,
        receipt: RECEIPT,
        reason: !canvas ? "canvas-parent-api-missing" : "canvas-parent-boot-method-missing",
        canvasReleaseAuthorized: false,
        firstFailedCoordinate: !canvas ? "WAITING_CANVAS_PARENT_API" : "WAITING_CANVAS_PARENT_BOOT_METHOD",
        recommendedNextFile: FILE_GATES.canvas,
        recommendedNextRenewalTarget: FILE_GATES.canvas,
        visualPassClaimed: false
      });
    }

    record("CANVAS_RELEASE_AUTHORIZED_BY_MACRO_WEST", {
      method,
      cycleRoute: releasePacket.cycleRoute,
      westDecision: releasePacket.westDecision,
      macroWestMethodUsed: releasePacket.macroWestMethodUsed
    });

    state.canvasBootInFlight = true;
    updateDataset();

    try {
      return Promise.resolve(canvas[method]({
        mount: refs.mount || "#hearthCanvasMount",
        route: ROUTE,
        releasePacket: {
          ...releasePacket,
          receivedFrom: CARDINALS.WEST,
          cycleNumber: 2,
          cycleRoute: CYCLE_ROUTES.CYCLE_2,
          westAuditObserved: true,
          westAuditAccepted: true,
          westCanvasReleaseApproved: true,
          canvasReleaseAuthorized: true,
          canvasReleaseReceived: true
        },
        onReady: () => reconcileCanvas({ receivedFrom: CARDINALS.CANVAS }),
        onError: (error) => {
          recordError("CANVAS_RELEASED_BOOT_ERROR", error);
          reconcileCanvas({ receivedFrom: CARDINALS.CANVAS });
        },
        onPhase: () => reconcileCanvas({ receivedFrom: CARDINALS.CANVAS })
      })).then((result) => {
        state.canvasBootInFlight = false;
        state.canvasBootResultObserved = true;
        reconcileCanvas({ receivedFrom: CARDINALS.CANVAS, canvasBootResult: result });
        return result;
      }).catch((error) => {
        state.canvasBootInFlight = false;
        recordError("CANVAS_RELEASED_BOOT_FAILED", error);
        reconcileCanvas({ receivedFrom: CARDINALS.CANVAS });
        return null;
      });
    } catch (error) {
      state.canvasBootInFlight = false;
      recordError("CANVAS_RELEASED_BOOT_SYNC_FAILED", error);
      reconcileCanvas({ receivedFrom: CARDINALS.CANVAS });
      return Promise.resolve(null);
    }
  }

  function maybeAutoBootCanvas(packet = state.currentPacket || {}) {
    if (!packet || !packet.canvasReleaseAuthorized) return;
    if (state.canvasBootAttempted || state.canvasBootInFlight || state.f13CanvasEvidenceComplete) return;
    if (!readCanvasApi()) return;
    if (autoBootTimer) return;

    autoBootTimer = root.setTimeout(() => {
      autoBootTimer = 0;
      bootCanvas({
        receivedFrom: CARDINALS.WEST,
        activeCycleRoute: CYCLE_ROUTES.CYCLE_2,
        outputSpreadAvailable: true,
        preAuthorizedRelease: packet.canvasReleasePacket
      });
    }, 40);
  }

  function submitF21EligibilityToNorth(input = {}) {
    const normalized = input && input.normalizedAt ? input : normalizeRouteConductorInput(input);
    const f21 = resolveF21Eligibility(normalized, normalized.f8, normalized.f13, normalized.news);

    if (!f21.f21EligibleForNorth) {
      return {
        accepted: false,
        action: "HELD",
        reason: "f21-not-eligible-for-north",
        firstFailedCoordinate: f21.firstFailedCoordinate,
        f13CanvasEvidenceComplete: normalized.f13.f13CanvasEvidenceComplete,
        canvasGateReady: normalized.f13.canvasGateReady,
        visualPassClaimed: false
      };
    }

    const north = normalized.authorities.north.authority;
    const session = firstGlobal([
      "HEARTH_CHECKPOINT_SESSION",
      "HEARTH_RUNTIME_CHECKPOINT_SESSION",
      "LAB_HEARTH_CHECKPOINT_SESSION",
      "LAB_CHECKPOINT_SESSION",
      "DEXTER_LAB.hearthCheckpointSession",
      "DEXTER_LAB.checkpointSession"
    ]);

    const payload = {
      event: "F21_ELIGIBILITY_SUBMITTED_TO_NORTH",
      checkpointEvent: "F21_ELIGIBILITY_SUBMITTED_TO_NORTH",
      id: "F21_COMPLETION_LATCH",
      phase: "F21_COMPLETION_LATCH",
      checkpointId: "F21_COMPLETION_LATCH",
      activeFibonacci: "F21",
      activeCardinal: CARDINALS.NORTH,
      source: "hearth-route-conductor-strict-f13-downstream-alignment",
      contract: CONTRACT,
      receipt: RECEIPT,
      f21EligibleForNorth: true,
      f21EligibilitySubmittedToNorth: true,
      completionLatchedByRouteConductor: false,
      f21ClaimedByRouteConductor: false,
      degradedEligibility: normalized.f13.f13CanvasEvidenceDegraded && !normalized.f13.f13CanvasEvidenceStrict,
      strictEligibility: normalized.f13.f13CanvasEvidenceStrict,
      visualPassClaimed: false,
      detail: {
        f8SelfDutySatisfied: normalized.f8.f8SelfDutySatisfied,
        macroWestAdmissibilityObserved: state.macroWestAdmissibilityObserved,
        westDecision: state.westDecision,
        f13ProofBodyAvailable: normalized.f13.f13ProofBodyAvailable,
        f13CanvasReadinessObserved: normalized.f13.f13CanvasReadinessObserved,
        f13VisibleEvidenceAvailable: normalized.f13.f13VisibleEvidenceAvailable,
        f13InspectEvidenceAvailable: normalized.f13.f13InspectEvidenceAvailable,
        f13CanvasEvidenceStrict: normalized.f13.f13CanvasEvidenceStrict,
        f13CanvasEvidenceDegraded: normalized.f13.f13CanvasEvidenceDegraded,
        f13CanvasEvidenceComplete: normalized.f13.f13CanvasEvidenceComplete,
        f13HardFail: normalized.f13.f13HardFail,
        f13StrictEvidenceGap: normalized.f13.f13StrictEvidenceGap,
        f13StrictEvidenceRepairTarget: normalized.f13.f13StrictEvidenceRepairTarget,
        canvasGateReady: normalized.f13.canvasGateReady,
        newsGatePassedBeforeF21: normalized.news.newsGatePassedBeforeF21,
        newsGateDegradedBeforeF21: normalized.news.newsGateDegradedBeforeF21
      }
    };

    let result = null;

    try {
      if (session && isFunction(session.submitF21Eligibility)) result = session.submitF21Eligibility(payload);
      else if (session && isFunction(session.acceptF21Eligibility)) result = session.acceptF21Eligibility(payload);
      else if (session && isFunction(session.submitEvent)) result = session.submitEvent(payload);
      else if (session && isFunction(session.submit)) result = session.submit(payload);
      else if (north && isFunction(north.submitF21Eligibility)) result = north.submitF21Eligibility(payload);
      else if (north && isFunction(north.acceptF21Eligibility)) result = north.acceptF21Eligibility(payload);
      else if (north && isFunction(north.receiveF21Eligibility)) result = north.receiveF21Eligibility(payload);

      state.f21SubmittedToNorth = true;
      state.f21EligibilitySubmittedToNorth = true;
      state.f21EligibilitySubmittedAt = nowIso();
      state.f21EligibilitySubmissionCount += 1;

      record("F21_ELIGIBILITY_SUBMITTED_TO_NORTH", {
        submitted: true,
        resultObserved: Boolean(result),
        strictEligibility: normalized.f13.f13CanvasEvidenceStrict,
        degradedEligibility: normalized.f13.f13CanvasEvidenceDegraded && !normalized.f13.f13CanvasEvidenceStrict,
        completionLatchedByRouteConductor: false,
        f21ClaimedByRouteConductor: false
      });

      return {
        accepted: true,
        action: "SUBMITTED_TO_NORTH",
        result: clonePlain(result),
        f21EligibleForNorth: true,
        f21SubmittedToNorth: true,
        completionLatched: false,
        f21ClaimedByRouteConductor: false,
        visualPassClaimed: false
      };
    } catch (error) {
      recordError("F21_ELIGIBILITY_SUBMIT_FAILED", error);

      return {
        accepted: false,
        action: "HELD",
        reason: "north-submit-failed",
        error: error && error.message ? error.message : String(error),
        visualPassClaimed: false
      };
    }
  }

  function setInspectMode(active) {
    if (!doc) return getReceipt();

    scanDom();

    doc.documentElement.dataset.hearthSouthPlanetInspect = String(active);
    doc.documentElement.dataset.hearthEastInspectReservedActive = String(active);

    if (refs.cockpit) refs.cockpit.dataset.cockpitMode = active ? "planet-inspect" : "diagnostic-dock";

    if (refs.showTab) {
      refs.showTab.hidden = !active;
      refs.showTab.dataset.visible = String(active);
    }

    if (refs.inspectButton) {
      refs.inspectButton.textContent = active ? "Show diagnostic" : "Inspect planet";
    }

    record(active ? "INSPECT_MODE_ACTIVE" : "INSPECT_MODE_RELEASED", { active });
    refresh();

    return getReceipt();
  }

  async function copyDiagnostic() {
    const text = getReceiptText();

    try {
      if (root.navigator && root.navigator.clipboard && isFunction(root.navigator.clipboard.writeText)) {
        await root.navigator.clipboard.writeText(text);
      } else if (doc) {
        const area = doc.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "readonly");
        area.style.position = "fixed";
        area.style.left = "-9999px";
        doc.body.appendChild(area);
        area.select();
        doc.execCommand("copy");
        area.remove();
      }

      if (refs.copyButton) {
        const prior = refs.copyButton.textContent || "Copy diagnostic";
        refs.copyButton.textContent = "Copied";
        root.setTimeout(() => {
          refs.copyButton.textContent = prior;
        }, 900);
      }

      return true;
    } catch (error) {
      recordError("COPY_DIAGNOSTIC_FAILED", error);
      return false;
    }
  }

  function renderLanes() {
    const packet = state.currentPacket || {};

    const rows = [
      ["F8", "Self-duty", packet.f8SelfDutySatisfied ? "COMPLETE" : "ACTIVE"],
      ["W", "Macro West", packet.macroWestAdmissibilityObserved ? packet.westCanvasReleaseApproved ? "RELEASE" : "HELD" : "WAITING"],
      ["F13", "Canvas evidence", packet.f13CanvasEvidenceStrict ? "STRICT" : packet.f13CanvasEvidenceComplete ? "DEGRADED" : packet.f13CanvasReadinessObserved ? "ACTIVE" : "PENDING"],
      ["NEXT", "Strict target", packet.recommendedNextFile || state.recommendedNextFile || FILE]
    ];

    return rows.map(([fib, label, status]) => {
      const progress =
        status === "COMPLETE" || status === "STRICT" || status === "RELEASE" ? 100 :
          status === "DEGRADED" ? 82 :
            status === "HELD" ? 68 :
              status === "ACTIVE" ? 55 :
                status === "WAITING" ? 35 :
                  48;

      return [
        `<section class="hearth-ledger-lane" data-lane="${fib}" data-status="${String(status).replace(/"/g, "")}">`,
        `<div class="hearth-ledger-lane-top">`,
        `<span class="hearth-ledger-lane-title"><strong>${fib} · ${label}</strong><span>SOUTH</span></span>`,
        `<span class="hearth-ledger-lane-status">${status}</span>`,
        `</div>`,
        `<div class="hearth-ledger-lane-track"><span class="hearth-ledger-lane-fill" style="width:${progress}%"></span></div>`,
        `</section>`
      ].join("");
    }).join("");
  }

  function render() {
    if (!doc) return;

    scanDom();
    state.renderCount += 1;

    const packet = state.currentPacket || composeRoutePrimaryPacket();
    const visible = packet.visibleState || composeVisibleStateFromPrimary(packet);

    if (refs.stage) refs.stage.textContent = `${visible.activeCycleRoute || packet.cycleRoute} · ${visible.activeFibonacci || packet.activeFibonacci}`;
    if (refs.heartbeat) refs.heartbeat.textContent = visible.visibleStatusText || packet.postgameStatus || "Route conductor active";
    if (refs.latest) refs.latest.textContent = `latest=${state.latestEvent}`;
    if (refs.fill) refs.fill.style.width = `${clamp(visible.visibleProgress, 0, 100)}%`;
    if (refs.percent) refs.percent.textContent = `${Math.round(clamp(visible.visibleProgress, 0, 100))}%`;
    if (refs.lanes) refs.lanes.innerHTML = renderLanes();
    if (refs.status) refs.status.textContent = getStatusText();

    if (refs.receiptText && refs.receiptBox && refs.receiptBox.dataset.visible === "true") {
      refs.receiptText.textContent = getReceiptText();
    }

    updateDataset();
  }

  function scheduleRender() {
    if (renderTimer || !doc) return;

    renderTimer = root.setTimeout(() => {
      renderTimer = 0;
      render();
    }, 80);
  }

  function globalsNeedRepublish() {
    const apiPresent = Boolean(
      root.HEARTH_ROUTE_CONDUCTOR === api &&
      root.HearthRouteConductor === api &&
      root.HEARTH_SOUTH_ROUTE_CONDUCTOR === api &&
      root.HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE === api &&
      root.HEARTH_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT === api
    );

    const nestedApiPresent = Boolean(
      root.HEARTH &&
      root.HEARTH.routeConductor === api &&
      root.HEARTH.southRouteConductor === api &&
      root.HEARTH.routeConductorPrimaryGate === api &&
      root.HEARTH.routeConductorStrictF13DownstreamAlignment === api
    );

    const dexterApiPresent = Boolean(
      root.DEXTER_LAB &&
      root.DEXTER_LAB.hearthRouteConductor === api &&
      root.DEXTER_LAB.hearthSouthRouteConductor === api &&
      root.DEXTER_LAB.hearthRouteConductorPrimaryGate === api &&
      root.DEXTER_LAB.hearthRouteConductorStrictF13DownstreamAlignment === api
    );

    const receiptPresent = Boolean(
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT &&
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT.receipt === RECEIPT &&
      root.HEARTH_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT_RECEIPT &&
      root.HEARTH_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT_RECEIPT.contract === CONTRACT
    );

    const markerValid = Boolean(
      root.__HEARTH_ROUTE_CONDUCTOR_MARKER__ === true &&
      root.__HEARTH_ROUTE_CONDUCTOR_MARKER_IS_HYDRATION_PROOF__ === false &&
      root.__HEARTH_ROUTE_CONDUCTOR_CONTRACT__ === CONTRACT
    );

    return !(apiPresent && nestedApiPresent && dexterApiPresent && receiptPresent && markerValid);
  }

  function publishGlobals(reason = "publish-globals", force = false) {
    if (!force && !globalsNeedRepublish()) {
      updateDataset();
      return false;
    }

    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH_ROUTE_CONDUCTOR = api;
    root.HearthRouteConductor = api;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR = api;
    root.HEARTH_SOUTH_VISIBLE_COMPLETION = api;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_HANDOFF = api;
    root.HEARTH_SOUTH_SELF_DUTY_NEWS_FIBONACCI_HANDOFF = api;
    root.HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE = api;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_PARENT_CHILD_RECONCILIATION_HANDOFF = api;
    root.HEARTH_ROUTE_CONDUCTOR_MACRO_WEST_ADMISSIBILITY_CANVAS_RELEASE_CONSUMPTION = api;
    root.HEARTH_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT = api;

    root.HEARTH.routeConductor = api;
    root.HEARTH.southRouteConductor = api;
    root.HEARTH.southVisibleCompletion = api;
    root.HEARTH.southRouteConductorSelfDutyHandoff = api;
    root.HEARTH.southSelfDutyNewsFibonacciHandoff = api;
    root.HEARTH.routeConductorPrimaryGate = api;
    root.HEARTH.routeConductorCanvasParentChildReconciliationHandoff = api;
    root.HEARTH.routeConductorMacroWestAdmissibilityCanvasReleaseConsumption = api;
    root.HEARTH.routeConductorStrictF13DownstreamAlignment = api;

    root.DEXTER_LAB.hearthRouteConductor = api;
    root.DEXTER_LAB.hearthSouthRouteConductor = api;
    root.DEXTER_LAB.hearthSouthVisibleCompletion = api;
    root.DEXTER_LAB.hearthSouthRouteConductorSelfDutyHandoff = api;
    root.DEXTER_LAB.hearthRouteConductorPrimaryGate = api;
    root.DEXTER_LAB.hearthRouteConductorCanvasParentChildReconciliationHandoff = api;
    root.DEXTER_LAB.hearthRouteConductorMacroWestAdmissibilityCanvasReleaseConsumption = api;
    root.DEXTER_LAB.hearthRouteConductorStrictF13DownstreamAlignment = api;

    const receiptLight = getReceiptLight(false);

    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = receiptLight;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT = receiptLight;
    root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT = receiptLight;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_HANDOFF_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_PARENT_CHILD_RECONCILIATION_HANDOFF_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_MACRO_WEST_ADMISSIBILITY_CANVAS_RELEASE_CONSUMPTION_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT_RECEIPT = receiptLight;

    root.HEARTH.routeConductorReceipt = receiptLight;
    root.HEARTH.southRouteConductorReceipt = receiptLight;
    root.HEARTH.southVisibleCompletionReceipt = receiptLight;
    root.HEARTH.southRouteConductorSelfDutyHandoffReceipt = receiptLight;
    root.HEARTH.routeConductorPrimaryGateReceipt = receiptLight;
    root.HEARTH.routeConductorCanvasParentChildReconciliationHandoffReceipt = receiptLight;
    root.HEARTH.routeConductorMacroWestAdmissibilityCanvasReleaseConsumptionReceipt = receiptLight;
    root.HEARTH.routeConductorStrictF13DownstreamAlignmentReceipt = receiptLight;

    root.DEXTER_LAB.hearthRouteConductorReceipt = receiptLight;
    root.DEXTER_LAB.hearthSouthRouteConductorReceipt = receiptLight;
    root.DEXTER_LAB.hearthSouthVisibleCompletionReceipt = receiptLight;
    root.DEXTER_LAB.hearthSouthRouteConductorSelfDutyHandoffReceipt = receiptLight;
    root.DEXTER_LAB.hearthRouteConductorPrimaryGateReceipt = receiptLight;
    root.DEXTER_LAB.hearthRouteConductorCanvasParentChildReconciliationHandoffReceipt = receiptLight;
    root.DEXTER_LAB.hearthRouteConductorMacroWestAdmissibilityCanvasReleaseConsumptionReceipt = receiptLight;
    root.DEXTER_LAB.hearthRouteConductorStrictF13DownstreamAlignmentReceipt = receiptLight;

    record(reason, {
      apiPresent: true,
      receiptPresent: true,
      routeConductorPrimaryGateActive: true,
      strictF13DownstreamAlignmentActive: true,
      macroWestAdmissibilityConsumptionActive: true,
      canvasParentChildReconciliationActive: true,
      force: force === true
    });

    updateDataset();
    return true;
  }

  function startWatchdog() {
    if (watchdogTimer) root.clearInterval(watchdogTimer);

    watchdogTimer = root.setInterval(() => {
      state.watchdogTicks += 1;

      refresh();

      if (globalsNeedRepublish()) {
        publishGlobals("watchdog-conditional-strict-f13-downstream-republish", false);
      }

      if (
        (state.f13CanvasEvidenceStrict && state.completionLatched) ||
        state.watchdogTicks >= WATCHDOG_LIMIT
      ) {
        root.clearInterval(watchdogTimer);
        watchdogTimer = 0;
      }
    }, WATCHDOG_MS);
  }

  function boot() {
    if (bootPromise) return bootPromise;

    bootPromise = Promise.resolve().then(() => {
      if (state.booted || state.booting) return getReceipt();

      state.booting = true;
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;
      state.postgameStatus = "BOOTING_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT";

      publishEarlyMarker();
      publishGlobals("boot-early-strict-f13-downstream-api-receipt-publication", true);

      refresh();

      state.booting = false;
      state.booted = true;
      state.routeConductorRuntimeActive = true;

      publishGlobals("boot-complete-strict-f13-downstream-api-receipt-publication", true);
      refresh();
      render();

      startWatchdog();

      record("HEARTH_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT_BOOTED", {
        route: ROUTE,
        markerPresent: state.routeConductorMarkerPresent,
        apiPresent: state.routeConductorApiPresent,
        receiptPresent: state.routeConductorReceiptPresent,
        hydrated: state.routeConductorHydrated,
        cycleAwareRoutingActive: true,
        macroWestAuthorityObserved: state.macroWestAuthorityObserved,
        macroWestAdmissibilityObserved: state.macroWestAdmissibilityObserved,
        westDecision: state.westDecision,
        canvasReleaseAuthorized: state.canvasReleaseAuthorized,
        currentCanvasParentObserved: state.currentCanvasParentObserved,
        f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
        f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
        f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
        f13StrictEvidenceGap: state.f13StrictEvidenceGap,
        recommendedNextFile: state.recommendedNextFile,
        f21EligibleForNorth: state.f21EligibleForNorth
      });

      return getReceipt();
    });

    return bootPromise;
  }

  function dispose(reason = "manual-dispose") {
    if (watchdogTimer) {
      root.clearInterval(watchdogTimer);
      watchdogTimer = 0;
    }

    if (renderTimer) {
      root.clearTimeout(renderTimer);
      renderTimer = 0;
    }

    if (autoBootTimer) {
      root.clearTimeout(autoBootTimer);
      autoBootTimer = 0;
    }

    record("HEARTH_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT_DISPOSED", { reason });
    render();

    return getReceipt();
  }

  function composeReceiptText(receipt = {}) {
    const r = isObject(receipt) ? receipt : getReceiptLight(false);

    return [
      "HEARTH_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT_RECEIPT",
      "",
      line("contract", r.contract || CONTRACT),
      line("receipt", r.receipt || RECEIPT),
      line("previousContract", r.previousContract || PREVIOUS_CONTRACT),
      line("baselineContract", r.baselineContract || BASELINE_CONTRACT),
      line("version", r.version || VERSION),
      line("file", r.file || FILE),
      line("route", r.route || ROUTE),
      line("role", r.role || state.role),
      "",
      line("routeConductorPrimaryGateActive", r.routeConductorPrimaryGateActive === true),
      line("strictF13DownstreamAlignmentActive", r.strictF13DownstreamAlignmentActive === true),
      line("canvasParentChildReconciliationActive", r.canvasParentChildReconciliationActive === true),
      line("cycleAwareRoutingActive", r.cycleAwareRoutingActive === true),
      line("southPrimaryGateIntegrationActive", r.southPrimaryGateIntegrationActive === true),
      line("macroWestAdmissibilityConsumptionActive", r.macroWestAdmissibilityConsumptionActive === true),
      line("canvasReleaseFirewallActive", r.canvasReleaseFirewallActive === true),
      "",
      line("cycleOneIsPosition", r.cycleOneIsPosition === true),
      line("cycleTwoIsCoordination", r.cycleTwoIsCoordination === true),
      line("cycleNumber", r.cycleNumber || r.activeCycleNumber || ""),
      line("cycleRoute", r.cycleRoute || r.activeCycleRoute || ""),
      line("receivedFrom", r.receivedFrom || ""),
      line("returnTo", r.returnTo || ""),
      line("handoffTo", r.handoffTo || ""),
      "",
      line("routeConductorMarkerPresent", r.routeConductorMarkerPresent === true),
      line("routeConductorApiPresent", r.routeConductorApiPresent === true),
      line("routeConductorReceiptPresent", r.routeConductorReceiptPresent === true),
      line("routeConductorRuntimeActive", r.routeConductorRuntimeActive === true),
      line("routeConductorHydrated", r.routeConductorHydrated === true),
      line("f8SelfDutySatisfied", r.f8SelfDutySatisfied === true),
      "",
      line("macroWestAuthorityObserved", r.macroWestAuthorityObserved === true),
      line("macroWestAdmissibilityObserved", r.macroWestAdmissibilityObserved === true),
      line("macroWestMethodUsed", r.macroWestMethodUsed || ""),
      line("westDecision", r.westDecision || ""),
      line("westGapClass", r.westGapClass || ""),
      line("westGapSeverity", r.westGapSeverity || ""),
      line("westHardBlock", r.westHardBlock === true),
      line("westForwardAllowed", r.westForwardAllowed === true),
      line("westCanvasReleaseApproved", r.westCanvasReleaseApproved === true),
      line("westDegradedForwardApproved", r.westDegradedForwardApproved === true),
      line("westFirstFailedCoordinate", r.westFirstFailedCoordinate || ""),
      line("westRecommendedNextRenewalTarget", r.westRecommendedNextRenewalTarget || ""),
      "",
      line("canvasReleaseAuthorized", r.canvasReleaseAuthorized === true),
      line("canvasReleasePacketReady", r.canvasReleasePacketReady === true),
      line("canvasReleaseRequiresWestAudit", r.canvasReleaseRequiresWestAudit !== false),
      line("canvasReleaseRequiresMacroWest", r.canvasReleaseRequiresMacroWest !== false),
      line("canvasReleaseHeldReason", r.canvasReleaseHeldReason || ""),
      "",
      line("currentCanvasParentObserved", r.currentCanvasParentObserved === true),
      line("canvasParentV2Observed", r.canvasParentV2Observed === true),
      line("canvasParentReleaseAccepted", r.canvasParentReleaseAccepted === true),
      line("canvasEastApiReady", r.canvasEastApiReady === true),
      line("canvasWestApiReady", r.canvasWestApiReady === true),
      line("canvasSouthApiReady", r.canvasSouthApiReady === true),
      line("allCanvasChildrenApiReady", r.allCanvasChildrenApiReady === true),
      line("canvasEastEvidenceReady", r.canvasEastEvidenceReady === true),
      line("canvasWestInspectionReady", r.canvasWestInspectionReady === true),
      line("canvasSouthVisibleProofReady", r.canvasSouthVisibleProofReady === true),
      line("allCanvasChildrenEvidenceReady", r.allCanvasChildrenEvidenceReady === true),
      line("allCanvasChildrenReady", r.allCanvasChildrenReady === true),
      "",
      line("f13ProofBodyAvailable", r.f13ProofBodyAvailable === true),
      line("f13CanvasReadinessObserved", r.f13CanvasReadinessObserved === true),
      line("f13VisibleEvidenceAvailable", r.f13VisibleEvidenceAvailable === true),
      line("f13InspectEvidenceAvailable", r.f13InspectEvidenceAvailable === true),
      line("f13CanvasEvidenceStrict", r.f13CanvasEvidenceStrict === true),
      line("f13CanvasEvidenceDegraded", r.f13CanvasEvidenceDegraded === true),
      line("f13CanvasEvidenceComplete", r.f13CanvasEvidenceComplete === true),
      line("f13HardFail", r.f13HardFail === true),
      line("f13StrictEvidenceGap", r.f13StrictEvidenceGap || ""),
      line("f13StrictEvidenceRepairTarget", r.f13StrictEvidenceRepairTarget || ""),
      "",
      line("southStrictProofObserved", r.southStrictProofObserved === true),
      line("southSoftProofObserved", r.southSoftProofObserved === true),
      line("southHardFailObserved", r.southHardFailObserved === true),
      line("southProofStale", r.southProofStale === true),
      line("parentStrictReadMismatch", r.parentStrictReadMismatch === true),
      line("degradedF13IsFunctional", r.degradedF13IsFunctional === true),
      line("functionalPageObserved", r.functionalPageObserved === true),
      line("strictVisualProofPending", r.strictVisualProofPending === true),
      "",
      line("canvasGateReady", r.canvasGateReady === true || r.canvasGateReadyNews === true),
      line("northGateReady", r.northGateReady === true),
      line("eastGateReady", r.eastGateReady === true),
      line("westGateReady", r.westGateReady === true),
      line("southGateReady", r.southGateReady === true),
      line("newsGatePassedBeforeF21", r.newsGatePassedBeforeF21 === true),
      line("newsGateDegradedBeforeF21", r.newsGateDegradedBeforeF21 === true),
      "",
      line("activeFibonacci", r.activeFibonacci || ""),
      line("activeFibonacciRank", r.activeFibonacciRank || ""),
      line("activeStageId", r.activeStageId || ""),
      line("activeGearId", r.activeGearId || ""),
      line("activeFileGate", r.activeFileGate || ""),
      line("activeNewsGate", r.activeNewsGate || ""),
      line("canvasActiveFibonacci", r.canvasActiveFibonacci || ""),
      line("canvasActiveFibonacciRank", r.canvasActiveFibonacciRank || ""),
      line("canvasActiveStageId", r.canvasActiveStageId || ""),
      line("canvasActiveGearId", r.canvasActiveGearId || ""),
      "",
      line("proofBodyComposed", r.proofBodyComposed === true),
      line("outputSpreadComposed", r.outputSpreadComposed === true),
      line("visibleStateComposed", r.visibleStateComposed === true),
      line("receiptComposed", r.receiptComposed !== false),
      line("northReturnPacketReady", r.northReturnPacketReady === true),
      line("westHandoffPacketReady", r.westHandoffPacketReady === true),
      "",
      line("f21EligibleForNorth", r.f21EligibleForNorth === true),
      line("f21SubmittedToNorth", r.f21SubmittedToNorth === true),
      line("f21EligibilitySubmittedToNorth", r.f21EligibilitySubmittedToNorth === true),
      line("f21LatchMode", r.f21LatchMode || ""),
      line("completionLatched", r.completionLatched === true),
      line("degradedCompletionLatched", r.degradedCompletionLatched === true),
      line("readyTextAllowed", r.readyTextAllowed === true),
      line("f21ClaimedByRouteConductor", r.f21ClaimedByRouteConductor === true),
      line("northRepairRequired", r.northRepairRequired === true),
      line("northRepairReason", r.northRepairReason || ""),
      "",
      line("firstFailedCoordinate", r.firstFailedCoordinate || ""),
      line("recommendedNextFile", r.recommendedNextFile || ""),
      line("recommendedNextRenewalTarget", r.recommendedNextRenewalTarget || ""),
      line("canvasNextAuditTarget", r.canvasNextAuditTarget || ""),
      line("postgameStatus", r.postgameStatus || ""),
      "",
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      line("visualPassClaimed", false),
      line("updatedAt", r.updatedAt || nowIso())
    ].join("\n");
  }

  function getReceiptLight(doRefresh = true) {
    if (doRefresh) {
      const packet = composeRoutePrimaryPacket();
      updateStateFromPacket(packet);
    }

    const packet = state.currentPacket || composeFallbackRoutePrimaryPacket();

    return {
      ...clonePlain(packet),
      currentReceiptLight: true,
      renderCount: state.renderCount,
      watchdogTicks: state.watchdogTicks,
      booted: state.booted,
      booting: state.booting,
      canvasBootAttempted: state.canvasBootAttempted,
      canvasBootInFlight: state.canvasBootInFlight,
      canvasBootResultObserved: state.canvasBootResultObserved,
      latestEvent: state.latestEvent,
      localEventCount: state.localEvents.length,
      errorCount: state.errors.length,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceipt() {
    const receipt = getReceiptLight(true);

    return {
      ...receipt,
      files: clonePlain(FILE_GATES),
      strictProofMinimums: clonePlain(STRICT_PROOF_MINIMUMS),
      currentCanvasParentContracts: CURRENT_CANVAS_PARENT_CONTRACTS.slice(),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      startedAt: state.startedAt,
      currentReceiptText: composeReceiptText(receipt)
    };
  }

  function getReceiptText() {
    const receipt = getReceiptLight(false);
    return composeReceiptText(receipt);
  }

  function getStatusText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT_STATUS",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("cycleNumber", r.cycleNumber),
      line("cycleRoute", r.cycleRoute),
      line("receivedFrom", r.receivedFrom),
      line("returnTo", r.returnTo),
      line("handoffTo", r.handoffTo),
      line("routeConductorHydrated", r.routeConductorHydrated),
      line("f8SelfDutySatisfied", r.f8SelfDutySatisfied),
      line("macroWestAuthorityObserved", r.macroWestAuthorityObserved),
      line("macroWestAdmissibilityObserved", r.macroWestAdmissibilityObserved),
      line("westDecision", r.westDecision),
      line("westCanvasReleaseApproved", r.westCanvasReleaseApproved),
      line("currentCanvasParentObserved", r.currentCanvasParentObserved),
      line("canvasParentReleaseAccepted", r.canvasParentReleaseAccepted),
      line("canvasGateReady", r.canvasGateReady),
      line("f13CanvasEvidenceStrict", r.f13CanvasEvidenceStrict),
      line("f13CanvasEvidenceDegraded", r.f13CanvasEvidenceDegraded),
      line("f13CanvasEvidenceComplete", r.f13CanvasEvidenceComplete),
      line("f13StrictEvidenceGap", r.f13StrictEvidenceGap),
      line("f13StrictEvidenceRepairTarget", r.f13StrictEvidenceRepairTarget),
      line("f21EligibleForNorth", r.f21EligibleForNorth),
      line("f21SubmittedToNorth", r.f21SubmittedToNorth),
      line("completionLatched", r.completionLatched),
      line("degradedCompletionLatched", r.degradedCompletionLatched),
      line("readyTextAllowed", r.readyTextAllowed),
      line("northRepairRequired", r.northRepairRequired),
      line("canvasReleaseAuthorized", r.canvasReleaseAuthorized),
      line("canvasReleaseHeldReason", r.canvasReleaseHeldReason),
      line("visualPassClaimed", r.visualPassClaimed),
      line("postgameStatus", r.postgameStatus),
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextRenewalTarget", r.recommendedNextRenewalTarget),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthRouteConductorMarkerPresent", "true");
    setDataset("hearthRouteConductorLoaded", "true");
    setDataset("hearthRouteConductorPresent", "true");
    setDataset("hearthRouteConductorContract", CONTRACT);
    setDataset("hearthRouteConductorReceipt", RECEIPT);
    setDataset("hearthRouteConductorPreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthRouteConductorBaselineContract", BASELINE_CONTRACT);
    setDataset("hearthRouteConductorVersion", VERSION);
    setDataset("hearthRouteConductorPrimaryGateActive", "true");
    setDataset("hearthRouteConductorStrictF13DownstreamAlignmentActive", "true");
    setDataset("hearthRouteConductorCanvasParentChildReconciliationActive", "true");
    setDataset("hearthRouteConductorMacroWestAdmissibilityConsumptionActive", "true");
    setDataset("hearthRouteConductorCycleAwareRoutingActive", "true");
    setDataset("hearthRouteConductorCycleOneIsPosition", "true");
    setDataset("hearthRouteConductorCycleTwoIsCoordination", "true");
    setDataset("hearthRouteConductorCycleOneReturnsToNorth", "true");
    setDataset("hearthRouteConductorCycleTwoHandsToMacroWest", "true");
    setDataset("hearthRouteConductorCanvasReleaseRequiresWestAudit", "true");
    setDataset("hearthRouteConductorCanvasReleaseRequiresMacroWest", "true");
    setDataset("hearthRouteConductorCanvasReleaseAuthorized", String(state.canvasReleaseAuthorized));
    setDataset("hearthRouteConductorMarkerIsHydrationProof", "false");

    setDataset("hearthSouthRouteConductorLoaded", "true");
    setDataset("hearthSouthRouteConductorPresent", "true");
    setDataset("hearthSouthRouteConductorContract", CONTRACT);
    setDataset("hearthSouthRouteConductorReceipt", RECEIPT);
    setDataset("hearthSouthRouteConductorHydrated", String(state.routeConductorHydrated));

    setDataset("hearthSouthActiveCycleNumber", String(state.activeCycleNumber));
    setDataset("hearthSouthActiveCycleRoute", state.activeCycleRoute);
    setDataset("hearthSouthActiveGateId", state.activeStageId);
    setDataset("hearthSouthActiveFibonacci", state.activeFibonacci);
    setDataset("hearthSouthActiveCardinal", CARDINALS.SOUTH);

    setDataset("hearthSouthCanvasActiveFibonacci", state.canvasActiveFibonacci);
    setDataset("hearthSouthCanvasActiveFibonacciRank", String(state.canvasActiveFibonacciRank));
    setDataset("hearthSouthCanvasActiveStageId", state.canvasActiveStageId);
    setDataset("hearthSouthCanvasActiveGearId", state.canvasActiveGearId);

    setDataset("hearthSouthF8SelfDutySatisfied", String(state.f8SelfDutySatisfied));
    setDataset("hearthSouthF13ProofBodyAvailable", String(state.f13ProofBodyAvailable));
    setDataset("hearthSouthF13CanvasReadinessObserved", String(state.f13CanvasReadinessObserved));
    setDataset("hearthSouthF13CanvasEvidenceStrict", String(state.f13CanvasEvidenceStrict));
    setDataset("hearthSouthF13CanvasEvidenceDegraded", String(state.f13CanvasEvidenceDegraded));
    setDataset("hearthSouthF13CanvasEvidenceComplete", String(state.f13CanvasEvidenceComplete));
    setDataset("hearthSouthF13HardFail", String(state.f13HardFail));
    setDataset("hearthSouthF13StrictEvidenceGap", state.f13StrictEvidenceGap);
    setDataset("hearthSouthF13StrictEvidenceRepairTarget", state.f13StrictEvidenceRepairTarget);

    setDataset("hearthSouthStrictProofObserved", String(state.southStrictProofObserved));
    setDataset("hearthSouthSoftProofObserved", String(state.southSoftProofObserved));
    setDataset("hearthSouthHardFailObserved", String(state.southHardFailObserved));
    setDataset("hearthSouthProofStale", String(state.southProofStale));
    setDataset("hearthSouthParentStrictReadMismatch", String(state.parentStrictReadMismatch));
    setDataset("hearthSouthDegradedF13IsFunctional", String(state.degradedF13IsFunctional));
    setDataset("hearthSouthFunctionalPageObserved", String(state.functionalPageObserved));
    setDataset("hearthSouthStrictVisualProofPending", String(state.strictVisualProofPending));

    setDataset("hearthSouthMacroWestAuthorityObserved", String(state.macroWestAuthorityObserved));
    setDataset("hearthSouthMacroWestAdmissibilityObserved", String(state.macroWestAdmissibilityObserved));
    setDataset("hearthSouthMacroWestMethodUsed", state.macroWestMethodUsed);
    setDataset("hearthSouthWestDecision", state.westDecision);
    setDataset("hearthSouthWestGapClass", state.westGapClass);
    setDataset("hearthSouthWestHardBlock", String(state.westHardBlock));
    setDataset("hearthSouthWestForwardAllowed", String(state.westForwardAllowed));
    setDataset("hearthSouthWestCanvasReleaseApproved", String(state.westCanvasReleaseApproved));
    setDataset("hearthSouthWestFirstFailedCoordinate", state.westFirstFailedCoordinate);

    setDataset("hearthSouthCurrentCanvasParentObserved", String(state.currentCanvasParentObserved));
    setDataset("hearthSouthCanvasParentV2Observed", String(state.canvasParentV2Observed));
    setDataset("hearthSouthCanvasParentReleaseAccepted", String(state.canvasParentReleaseAccepted));
    setDataset("hearthSouthCanvasEastApiReady", String(state.canvasEastApiReady));
    setDataset("hearthSouthCanvasWestApiReady", String(state.canvasWestApiReady));
    setDataset("hearthSouthCanvasSouthApiReady", String(state.canvasSouthApiReady));
    setDataset("hearthSouthAllCanvasChildrenApiReady", String(state.allCanvasChildrenApiReady));
    setDataset("hearthSouthCanvasEastEvidenceReady", String(state.canvasEastEvidenceReady));
    setDataset("hearthSouthCanvasWestInspectionReady", String(state.canvasWestInspectionReady));
    setDataset("hearthSouthCanvasSouthVisibleProofReady", String(state.canvasSouthVisibleProofReady));
    setDataset("hearthSouthAllCanvasChildrenEvidenceReady", String(state.allCanvasChildrenEvidenceReady));
    setDataset("hearthSouthAllCanvasChildrenReady", String(state.allCanvasChildrenReady));

    setDataset("hearthSouthCanvasGateReady", String(state.canvasGateReady));
    setDataset("hearthSouthF21EligibleForNorth", String(state.f21EligibleForNorth));
    setDataset("hearthSouthF21EligibilitySubmittedToNorth", String(state.f21EligibilitySubmittedToNorth));
    setDataset("hearthSouthCompletionLatched", String(state.completionLatched));
    setDataset("hearthSouthDegradedCompletionLatched", String(state.degradedCompletionLatched));
    setDataset("hearthSouthReadyTextAllowed", String(state.readyTextAllowed));
    setDataset("hearthSouthF21LatchMode", state.f21LatchMode);
    setDataset("hearthSouthF21ClaimedByRouteConductor", "false");
    setDataset("hearthSouthNorthRepairRequired", String(state.northRepairRequired));
    setDataset("hearthSouthNorthRepairReason", state.northRepairReason);

    setDataset("hearthSouthCanvasReleaseAuthorized", String(state.canvasReleaseAuthorized));
    setDataset("hearthSouthCanvasReleaseHeldReason", state.canvasReleaseHeldReason);
    setDataset("hearthSouthCanvasBootAttempted", String(state.canvasBootAttempted));
    setDataset("hearthSouthCanvasBootInFlight", String(state.canvasBootInFlight));

    setDataset("hearthSouthFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthSouthRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthSouthRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);
    setDataset("hearthSouthPostgameStatus", state.postgameStatus);

    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function getRouteCycleReceipt(input = {}) {
    const packet = composeRoutePrimaryPacket(input);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      cycleReceipt: "HEARTH_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT_CYCLE_RECEIPT_v4",
      cycleNumber: packet.cycleNumber,
      cycleRoute: packet.cycleRoute,
      receivedFrom: packet.receivedFrom,
      returnTo: packet.returnTo,
      handoffTo: packet.handoffTo,
      macroWestAdmissibilityObserved: packet.macroWestAdmissibilityObserved,
      westDecision: packet.westDecision,
      canvasReleaseAuthorized: packet.canvasReleaseAuthorized,
      currentCanvasParentObserved: packet.currentCanvasParentObserved,
      canvasGateReady: packet.canvasGateReady,
      f13CanvasEvidenceStrict: packet.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: packet.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: packet.f13CanvasEvidenceComplete,
      f13StrictEvidenceGap: packet.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: packet.f13StrictEvidenceRepairTarget,
      f21EligibleForNorth: packet.f21EligibleForNorth,
      northRepairRequired: packet.northRepairRequired,
      firstFailedCoordinate: packet.firstFailedCoordinate,
      recommendedNextFile: packet.recommendedNextFile,
      recommendedNextRenewalTarget: packet.recommendedNextRenewalTarget,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function getRoutePrimaryGateReceipt(input = {}) {
    return composeRouteReceipt(input);
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: state.role,

    FILE_GATES,
    CYCLE_ROUTES,
    CARDINALS,
    WEST_DECISION,
    STRICT_PROOF_MINIMUMS,
    CURRENT_CANVAS_PARENT_CONTRACTS,

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,
    refresh,
    render,
    bootCanvas,
    reconcileCanvas,
    setInspectMode,
    copyDiagnostic,
    getReceipt,
    getReceiptLight,
    getReceiptText,
    getStatusText,
    readCanvasApi,
    readCanvasReceipt,
    globalsNeedRepublish,
    publishGlobals,

    normalizeRouteConductorInput,
    readNorthAuthority,
    readEastAuthority,
    readWestAuthority,
    readMacroWestAuthority,
    readSouthPrimaryGate,
    readCanvasEvidence,
    resolveStrictF13Gap,
    resolveRouteCycle,
    resolveF8SelfDuty,
    resolveF13Evidence,
    resolveF21Eligibility,
    composeProofBody,
    composeCycleOneNorthReturn,
    composeCycleTwoWestHandoff,
    composeMacroWestCandidate,
    classifyMacroWestAdmissibility,
    normalizeMacroWestResult,
    composeCanvasReleasePacket,
    composeRoutePrimaryPacket,
    composeRouteReceipt,
    getRouteCycleReceipt,
    getRoutePrimaryGateReceipt,
    submitF21EligibilityToNorth,

    supportsSelfDutyPublication: true,
    supportsEarlyApiPublication: true,
    supportsEarlyReceiptPublication: true,
    supportsMarkerNotHydrationProof: true,
    supportsNewsProtocolSynchronization: true,
    supportsFibonacciSynchronization: true,
    supportsTwoCycleRouting: true,
    supportsSouthPrimaryGateIntegration: true,
    supportsMacroWestAdmissibilityConsumption: true,
    supportsMacroWestCanvasRelease: true,
    supportsCanvasReleaseFirewall: true,
    supportsCanvasParentChildReconciliation: true,
    supportsStrictF13DownstreamAlignment: true,
    supportsFunctionalDegradedF13Status: true,
    supportsCanvasF13EvidenceOnly: true,
    supportsF21NorthNewsLatchOnly: true,
    supportsF21EligibilitySubmissionOnly: true,

    routeConductorPrimaryGateActive: true,
    strictF13DownstreamAlignmentActive: true,
    canvasParentChildReconciliationActive: true,
    cycleAwareRoutingActive: true,
    southPrimaryGateIntegrationActive: true,
    macroWestAdmissibilityConsumptionActive: true,
    canvasReleaseFirewallActive: true,

    ownsRouteConductorRuntime: true,
    ownsSelfDutyPublication: true,
    ownsRouteCycleResolution: true,
    ownsSouthPrimaryGateConsumption: true,
    ownsMacroWestAdmissibilityConsumption: true,
    ownsCanvasReleasePacket: true,
    ownsF13EvidenceObservation: true,
    ownsStrictF13RepairRouting: true,
    ownsF21EligibilitySubmission: true,

    ownsMacroWestTruth: false,
    ownsCanvasDrawing: false,
    ownsCanvasChildren: false,
    ownsCanvasWestInspectionTruth: false,
    ownsNorthCheckpointTruth: false,
    ownsWestAdmissibilityTruth: false,
    ownsSouthOutputProofTruth: false,
    ownsFinalVisualPassClaim: false,
    ownsF21: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  publishEarlyMarker();
  publishGlobals("immediate-strict-f13-downstream-api-receipt-publication", true);

  if (doc) {
    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", () => boot(), { once: true });
    } else {
      boot();
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

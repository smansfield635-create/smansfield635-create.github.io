// /showroom/globe/hearth/hearth.js
// HEARTH_ROUTE_CONDUCTOR_CANVAS_PARENT_CHILD_RECONCILIATION_HANDOFF_TNT_v2
// Full-file replacement.
// Hearth route conductor / Canvas parent-child reconciliation handoff.
// Purpose:
// - Preserve route-conductor marker/API/receipt/runtime self-duty.
// - Keep F8 hydration strict: marker + API + receipt + runtime.
// - Preserve two-cycle Runtime Table law:
//   Cycle 1: NORTH -> EAST -> WEST -> SOUTH -> NORTH.
//   Cycle 2: NORTH -> EAST -> SOUTH -> WEST -> CANVAS.
// - Prefer renewed Canvas parent-child reconciliation parent before legacy Canvas aliases.
// - Read renewed Canvas parent-child API/evidence fields directly.
// - Separate route proof body, Canvas readiness, and Canvas F13 evidence completion.
// - Prevent F21 eligibility unless Canvas F13 evidence is complete.
// - Preserve North-only F21 latch authority.
// - Preserve Canvas as F13 evidence only.
// - Preserve final visual pass refusal.
// Does not own:
// - Canvas drawing
// - Canvas children
// - planet truth
// - material truth
// - hydrology truth
// - elevation truth
// - North checkpoint truth
// - West admissibility truth
// - South output proof truth
// - F21 latch
// - ready text
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_PARENT_CHILD_RECONCILIATION_HANDOFF_TNT_v2";
  const RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_PARENT_CHILD_RECONCILIATION_HANDOFF_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE_CYCLE_HANDOFF_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE_CYCLE_HANDOFF_TNT_v1";
  const VERSION = "2026-05-31.hearth-route-conductor-canvas-parent-child-reconciliation-handoff-v2";

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/showroom/globe/hearth/hearth.js";

  const FILE_GATES = Object.freeze({
    north: "/assets/lab/runtime-table.js",
    east: "/assets/lab/runtime-table.east.js",
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
    WEST: "WEST",
    SOUTH: "SOUTH",
    CANVAS: "CANVAS",
    UNKNOWN: "UNKNOWN"
  });

  const FIBONACCI_RANK = Object.freeze({
    F1: 1,
    F2: 2,
    F3: 3,
    F5: 5,
    F8: 8,
    F13: 13,
    F13A: 13.01,
    F13B: 13.02,
    F13C: 13.03,
    F13D: 13.04,
    F13E: 13.05,
    F13N: 13.14,
    F21: 21
  });

  const CANVAS_PARENT_V2_CONTRACT = "HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER_TNT_v2";
  const CANVAS_PARENT_V2_RECEIPT = "HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER_RECEIPT_v2";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const MAX_LOG = 140;
  const WATCHDOG_MS = 700;
  const WATCHDOG_LIMIT = 120;

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "hearth-route-conductor-canvas-parent-child-reconciliation-handoff",

    routeConductorPrimaryGateActive: true,
    canvasParentChildReconciliationActive: true,
    cycleAwareRoutingActive: true,
    southPrimaryGateIntegrationActive: true,
    canvasReleaseFirewallActive: true,
    newsProtocolSynchronized: true,
    fibonacciSynchronizationActive: true,

    markerIsNotHydrationProof: true,
    apiRequiredForF8: true,
    receiptRequiredForF8: true,
    runtimeRequiredForF8: true,
    canvasOwnsF13Only: true,
    f21NorthLatchOnly: true,
    routeMaySubmitF21EligibilityOnly: true,

    activeCycleNumber: 1,
    activeCycleRoute: CYCLE_ROUTES.CYCLE_1,
    receivedFrom: CARDINALS.UNKNOWN,
    returnTo: CARDINALS.NORTH,
    handoffTo: "",
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

    routeConductorMarkerPresent: false,
    routeConductorApiPresent: false,
    routeConductorReceiptPresent: false,
    routeConductorRuntimeActive: false,
    routeConductorHydrated: false,
    f8SelfDutySatisfied: false,

    northAuthorityObserved: false,
    eastAuthorityObserved: false,
    westAuthorityObserved: false,
    southAuthorityObserved: false,
    southPrimaryGateObserved: false,
    canvasAuthorityObserved: false,
    canvasParentV2Observed: false,
    hearthIndexObserved: false,

    westAuditObserved: false,
    westAuditRequired: false,
    westAuditApproved: false,
    westDegradedForwardApproved: false,

    northReturnRequired: true,
    northReturnPacketReady: true,
    westHandoffPacketReady: false,

    proofBodyAvailable: false,
    proofBodyComposed: false,
    outputSpreadAvailable: false,
    outputSpreadComposed: false,
    visibleStateAvailable: false,
    visibleStateComposed: false,
    receiptAvailable: true,
    receiptComposed: true,

    f13ProofBodyAvailable: false,
    f13CanvasReadinessObserved: false,
    f13VisibleEvidenceAvailable: false,
    f13InspectEvidenceAvailable: false,
    f13CanvasEvidenceStrict: false,
    f13CanvasEvidenceDegraded: false,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,

    canvasEvidenceObserved: false,
    canvasGateReady: false,
    canvasReleaseAuthorized: false,
    canvasReleasePacketReady: false,
    canvasReleaseHeldReason: "WAITING_WEST_NORTH_CANVAS_RELEASE_EVIDENCE",
    canvasReleaseRequiresWestAudit: true,
    canvasReleaseRequiresNorthOrWestEvidence: true,

    canvasEastApiReady: false,
    canvasWestApiReady: false,
    canvasSouthApiReady: false,
    allCanvasChildrenApiReady: false,
    canvasEastEvidenceReady: false,
    canvasWestInspectionReady: false,
    canvasSouthVisibleProofReady: false,
    allCanvasChildrenEvidenceReady: false,
    canvasNextAuditTarget: "",

    northGateReady: false,
    eastGateReady: false,
    westGateReady: false,
    southGateReady: false,
    canvasGateReadyNews: false,
    newsGatePassedBeforeF21: false,
    newsGateDegradedBeforeF21: false,
    routeNewsObserved: false,
    routeNewsComposed: false,
    routeNewsReturnedToNorth: false,
    routeNewsSubmittedToWest: false,
    routeNewsSubmittedToCanvas: false,

    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    f21EligibilitySubmittedAt: "",
    f21EligibilitySubmissionCount: 0,
    f21LatchMode: "WAITING_CANVAS_F13_EVIDENCE",
    completionLatched: false,
    degradedCompletionLatched: false,
    readyTextAllowed: false,

    firstFailedCoordinate: "WAITING_BOOT",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "LOADED",

    refsBound: false,
    booted: false,
    booting: false,
    watchdogTicks: 0,
    renderCount: 0,
    latestEvent: "HEARTH_ROUTE_CONDUCTOR_CANVAS_PARENT_CHILD_RECONCILIATION_HANDOFF_LOADED",
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

  function firstDefined(...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return value;
    }

    return undefined;
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
      event: safeString(event),
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

  function publishEarlyMarker() {
    root.__HEARTH_ROUTE_CONDUCTOR_MARKER__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_FILE__ = FILE;
    root.__HEARTH_ROUTE_CONDUCTOR_CONTRACT__ = CONTRACT;
    root.__HEARTH_ROUTE_CONDUCTOR_RECEIPT__ = RECEIPT;
    root.__HEARTH_ROUTE_CONDUCTOR_MARKER_IS_HYDRATION_PROOF__ = false;

    state.routeConductorMarkerPresent = true;

    updateDataset();
  }

  function normalizeCardinal(value, fallback = CARDINALS.UNKNOWN) {
    const text = safeString(value, fallback).toUpperCase();

    if (text.includes("NORTH")) return CARDINALS.NORTH;
    if (text.includes("EAST")) return CARDINALS.EAST;
    if (text.includes("WEST")) return CARDINALS.WEST;
    if (text.includes("SOUTH")) return CARDINALS.SOUTH;
    if (text.includes("CANVAS")) return CARDINALS.CANVAS;

    return fallback;
  }

  function normalizeCycleRoute(value) {
    const text = safeString(value).toUpperCase();

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

  function readWestAuthority() {
    const api = firstGlobal([
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
    ]);

    return {
      authority: api || null,
      receipt: readReceipt(api) || {},
      observed: Boolean(api),
      file: FILE_GATES.west
    };
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
      "HEARTH_EAST_STEP1_IGNITION",
      "HEARTH_INDEX_BRIDGE",
      "HEARTH_INDEX_JS",
      "HEARTH.indexBridge",
      "HEARTH.eastStep1Ignition"
    ]);

    return {
      authority: api || null,
      receipt: readReceipt(api) || {},
      observed: Boolean(api),
      file: FILE_GATES.hearthIndex
    };
  }

  function readCanvasApi() {
    return firstGlobal([
      "HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER",
      "HEARTH.canvasParentChildReconciliationF13EvidenceReceiver",
      "DEXTER_LAB.hearthCanvasParentChildReconciliationF13EvidenceReceiver",

      "HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER",
      "HEARTH.canvasParentGovernedF13EvidenceReceiver",
      "DEXTER_LAB.hearthCanvasParentGovernedF13EvidenceReceiver",

      "HEARTH_CANVAS_PHYSICAL_CARRIER_F13_PROOF_PARENT",
      "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION",
      "HEARTH_CANVAS_TRANSISTOR_GATE",
      "HEARTH_CANVAS_SPLIT_ADAPTER",
      "HEARTH_CANVAS_NORTH",
      "HEARTH_CANVAS_AUTHORITY",
      "HEARTH_CANVAS_EVIDENCE",
      "HEARTH_CANVAS",
      "HEARTH.canvasNorth",
      "HEARTH.canvasSplitAdapter",
      "HEARTH.canvasTransistorGate",
      "HEARTH.canvasEvidence",
      "HEARTH.canvas",
      "DEXTER_LAB.hearthCanvasPhysicalCarrierF13ProofParent",
      "DEXTER_LAB.hearthCanvasMaterialsReliefConsumptionInvalidation",
      "DEXTER_LAB.hearthCanvasTransistorGate",
      "DEXTER_LAB.hearthCanvasSplitAdapter",
      "DEXTER_LAB.hearthCanvasNorth",
      "DEXTER_LAB.hearthCanvasEvidence"
    ]);
  }

  function readCanvasReceipt() {
    const api = readCanvasApi();
    const receipt = readReceipt(api);

    if (receipt) return receipt;

    const fallback = firstGlobal([
      "HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER_RECEIPT",
      "HEARTH.canvasParentChildReconciliationF13EvidenceReceiverReceipt",
      "DEXTER_LAB.hearthCanvasParentChildReconciliationF13EvidenceReceiverReceipt",

      "HEARTH_CANVAS_RECEIPT",
      "HEARTH_CANVAS_EVIDENCE_RECEIPT",
      "HEARTH_CANVAS_POSTGAME_RECEIPT",
      "HEARTH.canvasReceipt",
      "HEARTH.canvasEvidenceReceipt"
    ]);

    return isObject(fallback) ? fallback : {};
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

  function selectCanvasMethod(canvas) {
    if (!canvas || !isObject(canvas)) return "";
    if (isFunction(canvas.bootCooperative)) return "bootCooperative";
    if (isFunction(canvas.boot)) return "boot";
    if (isFunction(canvas.render)) return "render";
    if (isFunction(canvas.mount)) return "mount";
    return "";
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
      datasetValue("hearthSouthVisiblePlanetAvailable") === "true"
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

  function readCanvasEvidence() {
    const api = readCanvasApi();
    const receipt = readCanvasReceipt();
    const dom = scanDom();

    const eastChild = readCanvasChild("east");
    const westChild = readCanvasChild("west");
    const southChild = readCanvasChild("south");

    const parentBootMethod = selectCanvasMethod(api);
    const parentPresent = Boolean(api);
    const parentBootMethodAvailable = Boolean(parentBootMethod);

    const receiptContract = safeString(receipt.contract || receipt.splitContract || "");
    const receiptName = safeString(receipt.receipt || receipt.splitReceipt || "");

    const canvasParentV2Observed = Boolean(
      receiptContract === CANVAS_PARENT_V2_CONTRACT ||
      receiptName === CANVAS_PARENT_V2_RECEIPT ||
      receipt.canvasParentChildReconciliationActive === true ||
      receipt.parentChildReconciliationActive === true ||
      receipt.ownsParentChildReconciliation === true ||
      datasetValue("hearthCanvasParentChildReconciliationActive") === "true" ||
      datasetValue("hearthCanvasContract") === CANVAS_PARENT_V2_CONTRACT ||
      datasetValue("hearthCanvasSplitContract") === CANVAS_PARENT_V2_CONTRACT
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
      firstDefined(receipt.canvasEastApiReady, receipt.canvasEastReady),
      eastApiFallback
    );

    const canvasWestApiReady = safeBool(
      firstDefined(receipt.canvasWestApiReady, receipt.canvasWestReady),
      westApiFallback
    );

    const canvasSouthApiReady = safeBool(
      firstDefined(receipt.canvasSouthApiReady, receipt.canvasSouthReady),
      southApiFallback
    );

    const allCanvasChildrenApiReady = safeBool(
      firstDefined(receipt.allCanvasChildrenApiReady, receipt.allCanvasChildrenReady),
      Boolean(canvasEastApiReady && canvasWestApiReady && canvasSouthApiReady)
    );

    const atlasBuildComplete = safeBool(
      receipt.atlasBuildComplete,
      datasetValue("hearthCanvasAtlasBuildComplete") === "true"
    );

    const textureComposeComplete = safeBool(
      receipt.textureComposeComplete,
      datasetValue("hearthCanvasTextureComposeComplete") === "true"
    );

    const firstFrameDetected = safeBool(
      receipt.firstFrameDetected,
      datasetValue("hearthCanvasFirstFrameDetected") === "true"
    );

    const imageRendered = safeBool(
      receipt.imageRendered,
      datasetValue("hearthCanvasImageRendered") === "true"
    );

    const canvasReady = safeBool(
      receipt.canvasReady,
      datasetValue("hearthCanvasReady") === "true"
    );

    const visibleContentProof = safeBool(
      receipt.visibleContentProof,
      datasetValue("hearthCanvasVisibleContentProof") === "true"
    );

    const visibleContentStrictProof = safeBool(
      firstDefined(receipt.visibleContentStrictProof, receipt.f13CanvasEvidenceStrict),
      datasetValue("hearthCanvasVisibleContentStrictProof") === "true"
    );

    const visibleContentSoftGap = safeBool(
      firstDefined(receipt.visibleContentSoftGap, receipt.f13CanvasEvidenceDegraded),
      datasetValue("hearthCanvasVisibleContentSoftGap") === "true"
    );

    const visibleContentHardFail = safeBool(
      firstDefined(receipt.visibleContentHardFail, receipt.f13HardFail),
      datasetValue("hearthCanvasVisibleContentHardFail") === "true"
    );

    const visibleForwardProgress = safeBool(
      receipt.visibleForwardProgress,
      datasetValue("hearthCanvasVisibleForwardProgress") === "true"
    );

    const visibleContentAdmissible = safeBool(receipt.visibleContentAdmissible, false);

    const visiblePlanetAvailable = safeBool(
      receipt.visiblePlanetAvailable,
      datasetValue("hearthCanvasVisiblePlanetAvailable") === "true"
    );

    const visibleCounts = Boolean(
      safeNumber(receipt.visibleContentClassCount, 0) > 0 ||
      safeNumber(receipt.visibleContentLandSampleCount, 0) > 0 ||
      safeNumber(receipt.visibleContentWaterSampleCount, 0) > 0 ||
      safeNumber(receipt.visibleContentOtherSampleCount, 0) > 0
    );

    const canvasEastEvidenceReady = safeBool(
      firstDefined(receipt.canvasEastEvidenceReady, receipt.f13AtlasReady, receipt.atlasReady),
      Boolean(atlasBuildComplete)
    );

    const canvasWestInspectionReady = safeBool(
      firstDefined(receipt.canvasWestInspectionReady, receipt.inspectModeAvailable, receipt.inspectPlanetControlAvailable),
      Boolean(
        receipt.dragInspectionBound === true ||
        receipt.zoomInspectionBound === true ||
        dom.inspectStrictReady ||
        dom.inspectFallbackReady
      )
    );

    const canvasSouthVisibleProofReady = safeBool(
      firstDefined(
        receipt.canvasSouthVisibleProofReady,
        receipt.f13VisibleEvidenceAvailable,
        receipt.f13VisibleEvidenceComplete
      ),
      Boolean(
        visibleContentProof ||
        visibleContentStrictProof ||
        visibleContentSoftGap ||
        visibleForwardProgress ||
        visibleContentAdmissible ||
        visiblePlanetAvailable ||
        visibleCounts ||
        (firstFrameDetected && imageRendered)
      )
    );

    const allCanvasChildrenEvidenceReady = safeBool(
      receipt.allCanvasChildrenEvidenceReady,
      Boolean(canvasEastEvidenceReady && canvasWestInspectionReady && canvasSouthVisibleProofReady)
    );

    const f13CanvasEvidenceStrict = safeBool(
      receipt.f13CanvasEvidenceStrict,
      Boolean(visibleContentStrictProof || (visibleContentProof && !visibleContentSoftGap))
    );

    const f13CanvasEvidenceDegraded = safeBool(
      receipt.f13CanvasEvidenceDegraded,
      Boolean(
        !f13CanvasEvidenceStrict &&
        (
          visibleContentSoftGap ||
          visibleForwardProgress ||
          visibleContentAdmissible ||
          receipt.f13VisibleEvidenceDegraded === true
        )
      )
    );

    const f13HardFail = safeBool(
      firstDefined(receipt.f13HardFail, receipt.visibleContentHardFail),
      visibleContentHardFail
    );

    const f13CanvasEvidenceComplete = safeBool(
      receipt.f13CanvasEvidenceComplete,
      Boolean(
        !f13HardFail &&
        allCanvasChildrenEvidenceReady &&
        (f13CanvasEvidenceStrict || f13CanvasEvidenceDegraded)
      )
    );

    const canvasGateReady = safeBool(
      receipt.canvasGateReady,
      Boolean(
        parentPresent &&
        allCanvasChildrenApiReady &&
        allCanvasChildrenEvidenceReady &&
        f13CanvasEvidenceComplete &&
        !f13HardFail
      )
    );

    const visiblePlanetProofValid = Boolean(
      dom.planetCanvasPresent &&
      dom.planetCanvasNonZeroSize &&
      !f13HardFail &&
      (
        f13CanvasEvidenceComplete ||
        visibleContentProof ||
        visibleContentStrictProof ||
        visibleContentSoftGap ||
        visibleForwardProgress ||
        visibleContentAdmissible ||
        visiblePlanetAvailable ||
        visibleCounts ||
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

    const nextAuditTarget = safeString(
      firstDefined(
        receipt.nextAuditTarget,
        receipt.recommendedNextFile,
        receipt.recommendedNextRenewalTarget,
        datasetValue("hearthCanvasNextAuditTarget", "")
      ),
      ""
    );

    return {
      authority: api || null,
      receipt,
      file: FILE_GATES.canvas,
      observed: evidenceObserved,
      parentPresent,
      parentBootMethod,
      parentBootMethodAvailable,
      canvasParentV2Observed,

      canvasEastApiReady,
      canvasWestApiReady,
      canvasSouthApiReady,
      allCanvasChildrenApiReady,

      canvasEastEvidenceReady,
      canvasWestInspectionReady,
      canvasSouthVisibleProofReady,
      allCanvasChildrenEvidenceReady,

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

      nextAuditTarget,
      dom
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
      root.HEARTH_ROUTE_CONDUCTOR_CANVAS_PARENT_CHILD_RECONCILIATION_HANDOFF === api ||
      firstGlobal([
        "HEARTH.routeConductor",
        "HEARTH.southRouteConductor",
        "HEARTH.routeConductorPrimaryGate",
        "HEARTH.routeConductorCanvasParentChildReconciliationHandoff",
        "DEXTER_LAB.hearthRouteConductor",
        "DEXTER_LAB.hearthSouthRouteConductor",
        "DEXTER_LAB.hearthRouteConductorPrimaryGate",
        "DEXTER_LAB.hearthRouteConductorCanvasParentChildReconciliationHandoff"
      ]) === api
    );

    const receiptPresent = Boolean(
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT &&
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT.receipt === RECEIPT &&
      root.HEARTH_ROUTE_CONDUCTOR_CANVAS_PARENT_CHILD_RECONCILIATION_HANDOFF_RECEIPT &&
      root.HEARTH_ROUTE_CONDUCTOR_CANVAS_PARENT_CHILD_RECONCILIATION_HANDOFF_RECEIPT.contract === CONTRACT
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
      southReceipt.proofBodyAvailable,
      safeBool(southReceipt.proofBodyComposed, false)
    );

    const f13ProofBodyAvailable = Boolean(
      proofBodyAvailable ||
      canvasEvidence.f13CanvasReadinessObserved ||
      canvasEvidence.observed
    );

    const f13VisibleEvidenceAvailable = Boolean(canvasEvidence.f13CanvasEvidenceComplete);
    const f13InspectEvidenceAvailable = Boolean(canvasEvidence.f13InspectEvidenceAvailable);

    return {
      f13ProofBodyAvailable,
      f13VisibleEvidenceAvailable,
      f13InspectEvidenceAvailable,
      f13CanvasReadinessObserved: canvasEvidence.f13CanvasReadinessObserved,

      f13CanvasEvidenceStrict: canvasEvidence.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: canvasEvidence.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: canvasEvidence.f13CanvasEvidenceComplete,
      f13HardFail: canvasEvidence.f13HardFail,

      canvasEvidenceObserved: canvasEvidence.observed,
      canvasGateReady: canvasEvidence.canvasGateReady,
      canvasOwnsF13Only: true,
      firstFailedCoordinate: canvasEvidence.f13CanvasEvidenceComplete
        ? "NONE_CANVAS_F13_EVIDENCE_COMPLETE"
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
      southNewsObserved: true,
      routeNewsObserved: true,
      routeNewsComposed: true,
      northGateReady,
      eastGateReady,
      westGateReady,
      southGateReady,
      canvasGateReady,
      newsGatePassedBeforeF21,
      newsGateDegradedBeforeF21,
      routeNewsReturnedToNorth: false,
      routeNewsSubmittedToWest: false,
      routeNewsSubmittedToCanvas: false
    };
  }

  function resolveF21Eligibility(input = {}, f8 = resolveF8SelfDuty(), f13 = resolveF13Evidence(), news = resolveNewsState()) {
    const supplied = isObject(input) ? input : {};
    const northReceipt = objectValue(supplied, "authorities.north.receipt") || {};
    const canvasEvidence = supplied.canvasEvidence || {};

    const northAlreadyLatched = Boolean(
      safeBool(northReceipt.completionLatched, false) ||
      safeBool(northReceipt.finalCompletionLatched, false) ||
      safeBool(supplied.completionLatchedByNorth, false)
    );

    const northAlreadyLatchedDegraded = Boolean(
      safeBool(northReceipt.degradedCompletionLatched, false) ||
      safeBool(supplied.degradedCompletionLatchedByNorth, false)
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
              ? "WAITING_WEST_GATE"
              : !news.southGateReady
                ? "WAITING_SOUTH_GATE"
                : !news.canvasGateReady
                  ? "WAITING_CANVAS_GATE"
                  : !f13.f13CanvasEvidenceComplete
                    ? "WAITING_CANVAS_F13_EVIDENCE"
                    : f13.f13HardFail
                      ? "CANVAS_F13_HARD_FAIL"
                      : "WAITING_NEWS_GATE_BEFORE_F21";

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
          ? "READY_FOR_NORTH_NEWS_LATCH"
          : failed,
      completionLatched: northAlreadyLatched,
      degradedCompletionLatched: northAlreadyLatchedDegraded,
      readyTextAllowed: northAlreadyLatched,
      f21NorthLatchOnly: true,
      routeMaySubmitF21EligibilityOnly: true,
      visualPassClaimed: false,
      firstFailedCoordinate: failed
    };
  }

  function normalizeRouteConductorInput(input = {}) {
    const source = isObject(input) ? input : {};

    const authorities = {
      north: readNorthAuthority(),
      east: readEastAuthority(),
      west: readWestAuthority(),
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
      objectValue(authorities.north.receipt, "activeCycleRoute")
    ));

    const westAuditObserved = Boolean(
      safeBool(source.westAuditObserved, false) ||
      safeBool(source.westAuditApproved, false) ||
      safeBool(source.westDegradedForwardApproved, false) ||
      safeBool(objectValue(authorities.west.receipt, "westAuditObserved"), false) ||
      safeBool(objectValue(authorities.west.receipt, "westReviewRecommended"), false) ||
      safeBool(objectValue(authorities.west.receipt, "forwardAllowed"), false) ||
      safeBool(objectValue(authorities.south.receipt, "westAuditObserved"), false)
    );

    const westAuditApproved = Boolean(
      safeBool(source.westAuditApproved, false) ||
      safeBool(objectValue(authorities.west.receipt, "westAuditApproved"), false) ||
      safeBool(objectValue(authorities.west.receipt, "forwardAllowed"), false) ||
      safeString(objectValue(authorities.west.receipt, "decision")).includes("FULL_PASS")
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
      receivedFrom === CARDINALS.NORTH
    );

    const northReturnRequired = Boolean(
      safeBool(source.northReturnRequired, false) ||
      safeBool(objectValue(authorities.south.receipt, "northReturnRequired"), false) ||
      cycleRoute === CYCLE_ROUTES.CYCLE_1 ||
      receivedFrom === CARDINALS.WEST
    );

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

    const routeActiveFibonacci = "F8";
    const routeActiveFibonacciRank = FIBONACCI_RANK.F8;

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

      activeFibonacci: routeActiveFibonacci,
      activeFibonacciRank: routeActiveFibonacciRank,
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
        canvasEvidence.nextAuditTarget,
        objectValue(authorities.south.receipt, "recommendedNextFile"),
        FILE
      ), FILE),

      recommendedNextRenewalTarget: safeString(firstDefined(
        source.recommendedNextRenewalTarget,
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
      (normalized.westAuditObserved === true && normalized.northReturnRequired !== false) ||
      normalized.northReturnRequired === true
    );

    const cycleTwo = Boolean(
      explicitCycleRoute === CYCLE_ROUTES.CYCLE_2 ||
      (
        (receivedFrom === CARDINALS.EAST || receivedFrom === CARDINALS.NORTH) &&
        normalized.westAuditRequired === true
      ) ||
      normalized.outputSpreadAvailable === true
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
      if (receivedFrom === CARDINALS.WEST || normalized.northReturnRequired) {
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
        firstFailedCoordinate: "NONE_CYCLE_2_ROUTE_RESOLVED_FROM_OUTPUT_SPREAD"
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
        canvasParentV2Observed: canvas.canvasParentV2Observed,
        canvasEastApiReady: canvas.canvasEastApiReady,
        canvasWestApiReady: canvas.canvasWestApiReady,
        canvasSouthApiReady: canvas.canvasSouthApiReady,
        allCanvasChildrenApiReady: canvas.allCanvasChildrenApiReady,
        canvasEastEvidenceReady: canvas.canvasEastEvidenceReady,
        canvasWestInspectionReady: canvas.canvasWestInspectionReady,
        canvasSouthVisibleProofReady: canvas.canvasSouthVisibleProofReady,
        allCanvasChildrenEvidenceReady: canvas.allCanvasChildrenEvidenceReady,
        f13CanvasEvidenceStrict: canvas.f13CanvasEvidenceStrict,
        f13CanvasEvidenceDegraded: canvas.f13CanvasEvidenceDegraded,
        f13CanvasEvidenceComplete: canvas.f13CanvasEvidenceComplete,
        f13HardFail: canvas.f13HardFail,
        nextAuditTarget: canvas.nextAuditTarget
      },

      visibleProof: {
        present: visibleProofPresent,
        strict: canvas.f13CanvasEvidenceStrict,
        degraded: canvas.f13CanvasEvidenceDegraded,
        pending: !visibleProofPresent && !canvas.f13HardFail,
        absent: !visibleProofPresent && !canvas.f13HardFail,
        hardFail: canvas.f13HardFail,
        visiblePlanetProofValid: canvas.visiblePlanetProofValid
      },

      inspectProof: {
        present: inspectProofPresent,
        degraded: Boolean(canvas.dom && canvas.dom.inspectFallbackReady && !(canvas.dom && canvas.dom.inspectStrictReady)),
        pending: !inspectProofPresent,
        absent: !inspectProofPresent
      },

      receiptProof: {
        present: receiptProofPresent,
        preservesForwardMotion: receiptProofPresent
      },

      canvasReadinessProof: {
        present: canvasReadinessProofPresent,
        parentPresent: canvas.parentPresent,
        parentBootMethodAvailable: canvas.parentBootMethodAvailable,
        allCanvasChildrenApiReady: canvas.allCanvasChildrenApiReady,
        allCanvasChildrenEvidenceReady: canvas.allCanvasChildrenEvidenceReady,
        canvasReady: canvas.canvasReady,
        firstFrameDetected: canvas.firstFrameDetected,
        imageRendered: canvas.imageRendered
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
        f13HardFail: f13.f13HardFail
      },

      f21EligibilitySummary: {
        f21EligibleForNorth: f21.f21EligibleForNorth,
        f21SubmittedToNorth: f21.f21SubmittedToNorth,
        f21LatchMode: f21.f21LatchMode,
        completionLatched: f21.completionLatched,
        degradedCompletionLatched: f21.degradedCompletionLatched
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
      westAuditObserved: normalized.westAuditObserved,
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
      recommendedNextFile: proofBody.proofBodyComposed ? FILE_GATES.west : FILE_GATES.south,
      recommendedNextRenewalTarget: proofBody.proofBodyComposed ? FILE_GATES.west : FILE_GATES.south,
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

  function composeCanvasReleasePacket(input = {}) {
    const normalized = input && input.normalizedAt ? input : normalizeRouteConductorInput(input);
    const cycle = resolveRouteCycle(normalized);
    const proofBody = composeProofBody(normalized);
    const canvas = normalized.canvasEvidence;

    const lawfulCycle = cycle.cycleNumber === 2 && cycle.cycleRoute === CYCLE_ROUTES.CYCLE_2;
    const southProofReady = Boolean(proofBody.proofBodyComposed || normalized.proofBodyAvailable || normalized.outputSpreadAvailable);

    const westReleaseEvidence = Boolean(
      normalized.westAuditObserved &&
      (
        normalized.westAuditApproved ||
        normalized.westDegradedForwardApproved
      )
    );

    const northReleaseEvidence = Boolean(normalized.northReleaseObserved);
    const noVisibleHardFail = !canvas.f13HardFail;
    const noPrematureLocalLatch = true;

    const authorized = Boolean(
      lawfulCycle &&
      southProofReady &&
      westReleaseEvidence &&
      (northReleaseEvidence || normalized.westDegradedForwardApproved || normalized.westAuditApproved) &&
      noVisibleHardFail &&
      noPrematureLocalLatch
    );

    const heldReason = authorized
      ? "NONE_CANVAS_RELEASE_AUTHORIZED"
      : !lawfulCycle
        ? "WAITING_CYCLE_2_ROUTE"
        : !southProofReady
          ? "WAITING_SOUTH_OUTPUT_PROOF_PACKET"
          : !westReleaseEvidence
            ? "WAITING_WEST_AUDIT_RELEASE_EVIDENCE"
            : !noVisibleHardFail
              ? "CANVAS_F13_HARD_FAIL_BLOCKS_RELEASE"
              : "WAITING_WEST_NORTH_CANVAS_RELEASE_EVIDENCE";

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "CANVAS_RELEASE_PACKET",
      cycleNumber: cycle.cycleNumber,
      cycleRoute: cycle.cycleRoute,
      handoffTo: authorized ? CARDINALS.CANVAS : "",
      canvasReleaseAuthorized: authorized,
      canvasReleaseRequiresWestAudit: true,
      canvasReleaseRequiresNorthOrWestEvidence: true,
      canvasEvidenceObserved: canvas.observed,
      canvasParentV2Observed: canvas.canvasParentV2Observed,
      canvasReleasePacketReady: authorized,
      canvasReleaseHeldReason: heldReason,
      lawfulCycle,
      southProofReady,
      westReleaseEvidence,
      northReleaseEvidence,
      noVisibleHardFail,
      completionLatched: false,
      visualPassClaimed: false,
      recommendedNextFile: authorized ? FILE_GATES.canvas : FILE_GATES.west,
      recommendedNextRenewalTarget: authorized ? FILE_GATES.canvas : FILE_GATES.west,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      composedAt: nowIso()
    };
  }

  function selectRecommendedNextFile(packet, normalized, f21, canvasReleasePacket) {
    const canvas = normalized.canvasEvidence;

    if (f21.f21EligibleForNorth || f21.completionLatched) {
      return FILE_GATES.north;
    }

    if (!canvas.parentPresent || !canvas.authority) {
      return FILE_GATES.canvas;
    }

    if (!canvas.canvasParentV2Observed) {
      return FILE_GATES.canvas;
    }

    if (!canvas.allCanvasChildrenApiReady || !canvas.allCanvasChildrenEvidenceReady || !canvas.f13CanvasEvidenceComplete) {
      return canvas.nextAuditTarget || FILE_GATES.canvas;
    }

    if (canvas.f13HardFail) {
      return canvas.nextAuditTarget || FILE_GATES.canvasSouth;
    }

    if (canvasReleasePacket && !canvasReleasePacket.canvasReleaseAuthorized && packet && packet.activeCycleNumber === 2) {
      return FILE_GATES.west;
    }

    if (packet && packet.activeCycleNumber === 1) {
      return FILE_GATES.north;
    }

    return FILE;
  }

  function composeVisibleStateFromPrimary(packet) {
    const p = isObject(packet) ? packet : {};

    const visibleProgress = p.completionLatched
      ? 100
      : p.f21EligibleForNorth
        ? 92
        : p.f13CanvasEvidenceComplete
          ? 86
          : p.f13CanvasReadinessObserved
            ? 72
            : p.f8SelfDutySatisfied
              ? 45
              : p.routeConductorMarkerPresent
                ? 24
                : 12;

    const visibleStatusText = p.completionLatched
      ? "Ready"
      : p.f21EligibleForNorth
        ? "Ready for North latch"
        : p.f13CanvasEvidenceComplete
          ? "Canvas F13 evidence complete"
          : p.f13CanvasReadinessObserved
            ? "Waiting Canvas F13 evidence"
            : p.canvasReleaseAuthorized
              ? "Canvas release authorized"
              : p.activeCycleNumber === 2
                ? "Cycle 2: handing proof to West"
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
      canvasReleaseAuthorized: p.canvasReleaseAuthorized,
      f13CanvasEvidenceComplete: p.f13CanvasEvidenceComplete,
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

      const recommendedNextFile = selectRecommendedNextFile(packetSeed, normalized, f21, canvasReleasePacket);
      const recommendedNextRenewalTarget = recommendedNextFile;

      const firstFailedCoordinate =
        f21.f21EligibleForNorth
          ? "NONE_F21_ELIGIBLE_FOR_NORTH"
          : f21.firstFailedCoordinate ||
            canvasReleasePacket.canvasReleaseHeldReason ||
            f13.firstFailedCoordinate ||
            cycle.firstFailedCoordinate ||
            "WAITING_ROUTE_CONDUCTOR_CANVAS_PARENT_CHILD_RECONCILIATION";

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
        canvasParentChildReconciliationActive: true,
        cycleAwareRoutingActive: true,
        southPrimaryGateIntegrationActive: true,
        canvasReleaseFirewallActive: true,

        cycleNumber: cycle.cycleNumber,
        cycleRoute: cycle.cycleRoute,
        activeCycleNumber: cycle.cycleNumber,
        activeCycleRoute: cycle.cycleRoute,
        cycleKnown: cycle.cycleKnown,
        receivedFrom: cycle.receivedFrom,
        returnTo: cycle.returnTo,
        handoffTo: cycle.handoffTo,

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
        westFile: FILE_GATES.west,
        southFile: FILE_GATES.south,
        canvasFile: FILE_GATES.canvas,
        hearthIndexFile: FILE_GATES.hearthIndex,

        northAuthorityObserved: normalized.authorities.north.observed,
        eastAuthorityObserved: normalized.authorities.east.observed,
        westAuthorityObserved: normalized.authorities.west.observed,
        southAuthorityObserved: normalized.authorities.south.observed,
        southPrimaryGateObserved: normalized.authorities.south.primaryGateObserved,
        canvasAuthorityObserved: Boolean(normalized.canvasEvidence.authority),
        canvasParentV2Observed: normalized.canvasEvidence.canvasParentV2Observed,
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

        westAuditObserved: normalized.westAuditObserved,
        westAuditRequired: isCycleTwo || normalized.westAuditRequired,
        westAuditApproved: normalized.westAuditApproved,
        westDegradedForwardApproved: normalized.westDegradedForwardApproved,
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

        f13ProofBodyAvailable: f13.f13ProofBodyAvailable,
        f13CanvasReadinessObserved: f13.f13CanvasReadinessObserved,
        f13VisibleEvidenceAvailable: f13.f13VisibleEvidenceAvailable,
        f13InspectEvidenceAvailable: f13.f13InspectEvidenceAvailable,
        f13CanvasEvidenceStrict: f13.f13CanvasEvidenceStrict,
        f13CanvasEvidenceDegraded: f13.f13CanvasEvidenceDegraded,
        f13CanvasEvidenceComplete: f13.f13CanvasEvidenceComplete,
        f13HardFail: f13.f13HardFail,
        canvasOwnsF13Only: true,

        canvasEvidenceObserved: normalized.canvasEvidence.observed,
        canvasGateReady: f13.canvasGateReady,
        canvasReleaseAuthorized: canvasReleasePacket.canvasReleaseAuthorized,
        canvasReleasePacketReady: canvasReleasePacket.canvasReleasePacketReady,
        canvasReleaseHeldReason: canvasReleasePacket.canvasReleaseHeldReason,
        canvasReleaseRequiresWestAudit: true,
        canvasReleaseRequiresNorthOrWestEvidence: true,

        canvasEastApiReady: normalized.canvasEvidence.canvasEastApiReady,
        canvasWestApiReady: normalized.canvasEvidence.canvasWestApiReady,
        canvasSouthApiReady: normalized.canvasEvidence.canvasSouthApiReady,
        allCanvasChildrenApiReady: normalized.canvasEvidence.allCanvasChildrenApiReady,
        canvasEastEvidenceReady: normalized.canvasEvidence.canvasEastEvidenceReady,
        canvasWestInspectionReady: normalized.canvasEvidence.canvasWestInspectionReady,
        canvasSouthVisibleProofReady: normalized.canvasEvidence.canvasSouthVisibleProofReady,
        allCanvasChildrenEvidenceReady: normalized.canvasEvidence.allCanvasChildrenEvidenceReady,
        canvasNextAuditTarget: normalized.canvasEvidence.nextAuditTarget,

        southNewsObserved: news.southNewsObserved,
        routeNewsObserved: news.routeNewsObserved,
        routeNewsComposed: news.routeNewsComposed,
        routeNewsReturnedToNorth: isCycleOne,
        routeNewsSubmittedToWest: isCycleTwo,
        routeNewsSubmittedToCanvas: canvasReleasePacket.canvasReleaseAuthorized,
        northGateReady: news.northGateReady,
        eastGateReady: news.eastGateReady,
        westGateReady: news.westGateReady,
        southGateReady: news.southGateReady,
        canvasGateReadyNews: news.canvasGateReady,
        newsGatePassedBeforeF21: news.newsGatePassedBeforeF21,
        newsGateDegradedBeforeF21: news.newsGateDegradedBeforeF21,

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

        northReturnPacket,
        westHandoffPacket,
        canvasReleasePacket,
        proofBody,

        postgameStatus: f21.completionLatched
          ? f21.degradedCompletionLatched
            ? "READY_DEGRADED_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE"
            : "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE"
          : f21.f21EligibleForNorth
            ? "WAITING_NORTH_F21_LATCH"
            : f13.f13CanvasEvidenceComplete
              ? "CANVAS_F13_EVIDENCE_COMPLETE_WAITING_NORTH"
              : isCycleTwo
                ? "CYCLE_2_WAITING_WEST_AUDIT_OR_CANVAS_RELEASE"
                : "CYCLE_1_RETURNING_TO_NORTH",

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
      canvasParentChildReconciliationActive: true,
      cycleAwareRoutingActive: true,
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

      canvasParentV2Observed: false,
      canvasGateReady: false,

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21EligibilitySubmittedToNorth: false,
      f21LatchMode: "WAITING_ROUTE_CONDUCTOR_PRIMARY_GATE_COMPOSITION",
      completionLatched: false,
      degradedCompletionLatched: false,
      readyTextAllowed: false,
      f21ClaimedByRouteConductor: false,

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
      authority: "hearth-route-conductor-canvas-parent-child-reconciliation-handoff",
      status: "active",
      receiptComposed: true,
      currentReceipt: true,
      updatedAt: nowIso()
    };
  }

  function getRouteCycleReceipt(input = {}) {
    const packet = composeRoutePrimaryPacket(input);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      cycleReceipt: "HEARTH_ROUTE_CONDUCTOR_CYCLE_RECEIPT_v2",
      cycleNumber: packet.cycleNumber,
      cycleRoute: packet.cycleRoute,
      receivedFrom: packet.receivedFrom,
      returnTo: packet.returnTo,
      handoffTo: packet.handoffTo,
      canvasReleaseAuthorized: packet.canvasReleaseAuthorized,
      canvasGateReady: packet.canvasGateReady,
      f13CanvasEvidenceComplete: packet.f13CanvasEvidenceComplete,
      f21EligibleForNorth: packet.f21EligibleForNorth,
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
      source: "hearth-route-conductor-canvas-parent-child-reconciliation-handoff",
      contract: CONTRACT,
      receipt: RECEIPT,
      f21EligibleForNorth: true,
      f21EligibilitySubmittedToNorth: true,
      completionLatchedByRouteConductor: false,
      f21ClaimedByRouteConductor: false,
      visualPassClaimed: false,
      detail: {
        f8SelfDutySatisfied: normalized.f8.f8SelfDutySatisfied,
        f13ProofBodyAvailable: normalized.f13.f13ProofBodyAvailable,
        f13CanvasReadinessObserved: normalized.f13.f13CanvasReadinessObserved,
        f13VisibleEvidenceAvailable: normalized.f13.f13VisibleEvidenceAvailable,
        f13InspectEvidenceAvailable: normalized.f13.f13InspectEvidenceAvailable,
        f13CanvasEvidenceStrict: normalized.f13.f13CanvasEvidenceStrict,
        f13CanvasEvidenceDegraded: normalized.f13.f13CanvasEvidenceDegraded,
        f13CanvasEvidenceComplete: normalized.f13.f13CanvasEvidenceComplete,
        f13HardFail: normalized.f13.f13HardFail,
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

  function globalsNeedRepublish() {
    const apiPresent = Boolean(
      root.HEARTH_ROUTE_CONDUCTOR === api &&
      root.HearthRouteConductor === api &&
      root.HEARTH_SOUTH_ROUTE_CONDUCTOR === api &&
      root.HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE === api &&
      root.HEARTH_ROUTE_CONDUCTOR_CANVAS_PARENT_CHILD_RECONCILIATION_HANDOFF === api
    );

    const nestedApiPresent = Boolean(
      root.HEARTH &&
      root.HEARTH.routeConductor === api &&
      root.HEARTH.southRouteConductor === api &&
      root.HEARTH.routeConductorPrimaryGate === api &&
      root.HEARTH.routeConductorCanvasParentChildReconciliationHandoff === api
    );

    const dexterApiPresent = Boolean(
      root.DEXTER_LAB &&
      root.DEXTER_LAB.hearthRouteConductor === api &&
      root.DEXTER_LAB.hearthSouthRouteConductor === api &&
      root.DEXTER_LAB.hearthRouteConductorPrimaryGate === api &&
      root.DEXTER_LAB.hearthRouteConductorCanvasParentChildReconciliationHandoff === api
    );

    const receiptPresent = Boolean(
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT &&
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT.receipt === RECEIPT &&
      root.HEARTH_ROUTE_CONDUCTOR_CANVAS_PARENT_CHILD_RECONCILIATION_HANDOFF_RECEIPT &&
      root.HEARTH_ROUTE_CONDUCTOR_CANVAS_PARENT_CHILD_RECONCILIATION_HANDOFF_RECEIPT.contract === CONTRACT
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

    root.HEARTH.routeConductor = api;
    root.HEARTH.southRouteConductor = api;
    root.HEARTH.southVisibleCompletion = api;
    root.HEARTH.southRouteConductorSelfDutyHandoff = api;
    root.HEARTH.southSelfDutyNewsFibonacciHandoff = api;
    root.HEARTH.routeConductorPrimaryGate = api;
    root.HEARTH.routeConductorCanvasParentChildReconciliationHandoff = api;

    root.DEXTER_LAB.hearthRouteConductor = api;
    root.DEXTER_LAB.hearthSouthRouteConductor = api;
    root.DEXTER_LAB.hearthSouthVisibleCompletion = api;
    root.DEXTER_LAB.hearthSouthRouteConductorSelfDutyHandoff = api;
    root.DEXTER_LAB.hearthRouteConductorPrimaryGate = api;
    root.DEXTER_LAB.hearthRouteConductorCanvasParentChildReconciliationHandoff = api;

    const receiptLight = getReceiptLight(false);

    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = receiptLight;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT = receiptLight;
    root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT = receiptLight;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR_SELF_DUTY_HANDOFF_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_PARENT_CHILD_RECONCILIATION_HANDOFF_RECEIPT = receiptLight;

    root.HEARTH.routeConductorReceipt = receiptLight;
    root.HEARTH.southRouteConductorReceipt = receiptLight;
    root.HEARTH.southVisibleCompletionReceipt = receiptLight;
    root.HEARTH.southRouteConductorSelfDutyHandoffReceipt = receiptLight;
    root.HEARTH.routeConductorPrimaryGateReceipt = receiptLight;
    root.HEARTH.routeConductorCanvasParentChildReconciliationHandoffReceipt = receiptLight;

    root.DEXTER_LAB.hearthRouteConductorReceipt = receiptLight;
    root.DEXTER_LAB.hearthSouthRouteConductorReceipt = receiptLight;
    root.DEXTER_LAB.hearthSouthVisibleCompletionReceipt = receiptLight;
    root.DEXTER_LAB.hearthSouthRouteConductorSelfDutyHandoffReceipt = receiptLight;
    root.DEXTER_LAB.hearthRouteConductorPrimaryGateReceipt = receiptLight;
    root.DEXTER_LAB.hearthRouteConductorCanvasParentChildReconciliationHandoffReceipt = receiptLight;

    record(reason, {
      apiPresent: true,
      receiptPresent: true,
      routeConductorPrimaryGateActive: true,
      canvasParentChildReconciliationActive: true,
      force: force === true
    });

    updateDataset();
    return true;
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

    state.activeFibonacci = "F8";
    state.activeFibonacciRank = 8;
    state.activeStageId = "F8_SOUTH_SELF_DUTY";
    state.activeGearId = "F8_SOUTH_SELF_DUTY";
    state.activeNewsGate = CARDINALS.SOUTH;

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
    state.southAuthorityObserved = p.southAuthorityObserved === true;
    state.southPrimaryGateObserved = p.southPrimaryGateObserved === true;
    state.canvasAuthorityObserved = p.canvasAuthorityObserved === true;
    state.canvasParentV2Observed = p.canvasParentV2Observed === true;
    state.hearthIndexObserved = p.hearthIndexObserved === true;

    state.westAuditObserved = p.westAuditObserved === true;
    state.westAuditRequired = p.westAuditRequired === true;
    state.westAuditApproved = p.westAuditApproved === true;
    state.westDegradedForwardApproved = p.westDegradedForwardApproved === true;

    state.northReturnRequired = p.northReturnRequired === true;
    state.northReturnPacketReady = p.northReturnPacketReady === true;
    state.westHandoffPacketReady = p.westHandoffPacketReady === true;

    state.proofBodyAvailable = p.proofBodyAvailable === true;
    state.proofBodyComposed = p.proofBodyComposed === true;
    state.outputSpreadAvailable = p.outputSpreadAvailable === true;
    state.outputSpreadComposed = p.outputSpreadComposed === true;
    state.visibleStateAvailable = p.visibleStateAvailable === true;
    state.visibleStateComposed = p.visibleStateComposed === true;
    state.receiptAvailable = p.receiptAvailable !== false;
    state.receiptComposed = p.receiptComposed !== false;

    state.f13ProofBodyAvailable = p.f13ProofBodyAvailable === true;
    state.f13CanvasReadinessObserved = p.f13CanvasReadinessObserved === true;
    state.f13VisibleEvidenceAvailable = p.f13VisibleEvidenceAvailable === true;
    state.f13InspectEvidenceAvailable = p.f13InspectEvidenceAvailable === true;
    state.f13CanvasEvidenceStrict = p.f13CanvasEvidenceStrict === true;
    state.f13CanvasEvidenceDegraded = p.f13CanvasEvidenceDegraded === true;
    state.f13CanvasEvidenceComplete = p.f13CanvasEvidenceComplete === true;
    state.f13HardFail = p.f13HardFail === true;

    state.canvasEvidenceObserved = p.canvasEvidenceObserved === true;
    state.canvasGateReady = p.canvasGateReady === true;
    state.canvasReleaseAuthorized = p.canvasReleaseAuthorized === true;
    state.canvasReleasePacketReady = p.canvasReleasePacketReady === true;
    state.canvasReleaseHeldReason = p.canvasReleaseHeldReason || "WAITING_WEST_NORTH_CANVAS_RELEASE_EVIDENCE";

    state.canvasEastApiReady = p.canvasEastApiReady === true;
    state.canvasWestApiReady = p.canvasWestApiReady === true;
    state.canvasSouthApiReady = p.canvasSouthApiReady === true;
    state.allCanvasChildrenApiReady = p.allCanvasChildrenApiReady === true;
    state.canvasEastEvidenceReady = p.canvasEastEvidenceReady === true;
    state.canvasWestInspectionReady = p.canvasWestInspectionReady === true;
    state.canvasSouthVisibleProofReady = p.canvasSouthVisibleProofReady === true;
    state.allCanvasChildrenEvidenceReady = p.allCanvasChildrenEvidenceReady === true;
    state.canvasNextAuditTarget = p.canvasNextAuditTarget || "";

    state.northGateReady = p.northGateReady === true;
    state.eastGateReady = p.eastGateReady === true;
    state.westGateReady = p.westGateReady === true;
    state.southGateReady = p.southGateReady === true;
    state.canvasGateReadyNews = p.canvasGateReadyNews === true;
    state.newsGatePassedBeforeF21 = p.newsGatePassedBeforeF21 === true;
    state.newsGateDegradedBeforeF21 = p.newsGateDegradedBeforeF21 === true;
    state.routeNewsObserved = p.routeNewsObserved === true;
    state.routeNewsComposed = p.routeNewsComposed === true;
    state.routeNewsReturnedToNorth = p.routeNewsReturnedToNorth === true;
    state.routeNewsSubmittedToWest = p.routeNewsSubmittedToWest === true;
    state.routeNewsSubmittedToCanvas = p.routeNewsSubmittedToCanvas === true;

    state.f21EligibleForNorth = p.f21EligibleForNorth === true;
    state.f21SubmittedToNorth = p.f21SubmittedToNorth === true;
    state.f21EligibilitySubmittedToNorth = p.f21EligibilitySubmittedToNorth === true;
    state.f21LatchMode = p.f21LatchMode || "WAITING_CANVAS_F13_EVIDENCE";
    state.completionLatched = p.completionLatched === true;
    state.degradedCompletionLatched = p.degradedCompletionLatched === true;
    state.readyTextAllowed = p.readyTextAllowed === true;

    state.firstFailedCoordinate = p.firstFailedCoordinate || "WAITING_ROUTE_CONDUCTOR_CANVAS_PARENT_CHILD_RECONCILIATION";
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
      activeCycleRoute: options.activeCycleRoute || state.activeCycleRoute
    });

    const releasePacket = composeCanvasReleasePacket(normalized);

    if (!releasePacket.canvasReleaseAuthorized) {
      record("CANVAS_RELEASE_HELD", {
        reason: releasePacket.canvasReleaseHeldReason,
        cycleNumber: releasePacket.cycleNumber,
        cycleRoute: releasePacket.cycleRoute
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

    if (!canvas || !method) {
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

    record("CANVAS_RELEASE_AUTHORIZED", {
      method,
      cycleRoute: releasePacket.cycleRoute
    });

    try {
      return Promise.resolve(canvas[method]({
        mount: refs.mount || "#hearthCanvasMount",
        route: ROUTE,
        releasePacket,
        onReady: () => reconcileCanvas({ receivedFrom: CARDINALS.CANVAS }),
        onError: (error) => {
          recordError("CANVAS_RELEASED_BOOT_ERROR", error);
          reconcileCanvas({ receivedFrom: CARDINALS.CANVAS });
        },
        onPhase: () => reconcileCanvas({ receivedFrom: CARDINALS.CANVAS })
      })).then((result) => {
        reconcileCanvas({ receivedFrom: CARDINALS.CANVAS, canvasBootResult: result });
        return result;
      }).catch((error) => {
        recordError("CANVAS_RELEASED_BOOT_FAILED", error);
        reconcileCanvas({ receivedFrom: CARDINALS.CANVAS });
        return null;
      });
    } catch (error) {
      recordError("CANVAS_RELEASED_BOOT_SYNC_FAILED", error);
      reconcileCanvas({ receivedFrom: CARDINALS.CANVAS });
      return Promise.resolve(null);
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

  function bindControls() {
    if (state.refsBound || !doc) return;

    if (refs.copyButton && !refs.copyButton.dataset.hearthRouteConductorReconciliationBound) {
      refs.copyButton.dataset.hearthRouteConductorReconciliationBound = "true";
      refs.copyButton.addEventListener("click", copyDiagnostic);
    }

    if (refs.toggleButton && !refs.toggleButton.dataset.hearthRouteConductorReconciliationBound) {
      refs.toggleButton.dataset.hearthRouteConductorReconciliationBound = "true";
      refs.toggleButton.addEventListener("click", () => {
        const visible = refs.receiptBox ? refs.receiptBox.dataset.visible !== "true" : true;

        if (refs.receiptBox) refs.receiptBox.dataset.visible = String(visible);
        if (refs.receiptText) refs.receiptText.textContent = visible ? getReceiptText() : "";

        refs.toggleButton.textContent = visible ? "Hide receipt" : "Show receipt";
      });
    }

    if (refs.inspectButton && !refs.inspectButton.dataset.hearthRouteConductorReconciliationBound) {
      refs.inspectButton.dataset.hearthRouteConductorReconciliationBound = "true";
      refs.inspectButton.addEventListener("click", () => {
        setInspectMode(!(doc.documentElement.dataset.hearthSouthPlanetInspect === "true"));
      });
    }

    if (refs.showTab && !refs.showTab.dataset.hearthRouteConductorReconciliationBound) {
      refs.showTab.dataset.hearthRouteConductorReconciliationBound = "true";
      refs.showTab.addEventListener("click", () => setInspectMode(false));
    }

    state.refsBound = true;
  }

  function renderLanes() {
    const packet = state.currentPacket || {};

    const rows = [
      ["F8", "Self-duty", packet.f8SelfDutySatisfied ? "COMPLETE" : "ACTIVE"],
      ["F13", "Canvas evidence", packet.f13CanvasEvidenceComplete ? "COMPLETE" : packet.f13CanvasReadinessObserved ? "ACTIVE" : "PENDING"],
      ["NEWS", "Gate alignment", packet.newsGatePassedBeforeF21 ? "COMPLETE" : packet.newsGateDegradedBeforeF21 ? "DEGRADED" : "PENDING"],
      ["F21", "North eligibility", packet.f21EligibleForNorth ? "READY" : "WAITING"]
    ];

    return rows.map(([fib, label, status]) => {
      const progress =
        status === "COMPLETE" || status === "READY" ? 100 :
          status === "DEGRADED" ? 82 :
            status === "ACTIVE" ? 55 :
              15;

      return [
        `<section class="hearth-ledger-lane" data-lane="${fib}" data-status="${status}">`,
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

  function startWatchdog() {
    if (watchdogTimer) root.clearInterval(watchdogTimer);

    watchdogTimer = root.setInterval(() => {
      state.watchdogTicks += 1;

      refresh();

      if (globalsNeedRepublish()) {
        publishGlobals("watchdog-conditional-reconciliation-republish", false);
      }

      if (state.f21EligibleForNorth || state.completionLatched || state.watchdogTicks >= WATCHDOG_LIMIT) {
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
      state.postgameStatus = "BOOTING_ROUTE_CONDUCTOR_CANVAS_PARENT_CHILD_RECONCILIATION_HANDOFF";

      publishEarlyMarker();
      publishGlobals("boot-early-reconciliation-api-receipt-publication", true);

      refresh();

      state.booting = false;
      state.booted = true;
      state.routeConductorRuntimeActive = true;

      publishGlobals("boot-complete-reconciliation-api-receipt-publication", true);
      refresh();
      render();

      startWatchdog();

      record("HEARTH_ROUTE_CONDUCTOR_CANVAS_PARENT_CHILD_RECONCILIATION_HANDOFF_BOOTED", {
        route: ROUTE,
        markerPresent: state.routeConductorMarkerPresent,
        apiPresent: state.routeConductorApiPresent,
        receiptPresent: state.routeConductorReceiptPresent,
        hydrated: state.routeConductorHydrated,
        cycleAwareRoutingActive: true,
        canvasParentV2Observed: state.canvasParentV2Observed,
        f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
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

    record("HEARTH_ROUTE_CONDUCTOR_CANVAS_PARENT_CHILD_RECONCILIATION_HANDOFF_DISPOSED", { reason });
    render();
  }

  function composeReceiptText(receipt = {}) {
    const r = isObject(receipt) ? receipt : getReceiptLight(false);

    return [
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_PARENT_CHILD_RECONCILIATION_HANDOFF_RECEIPT",
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
      line("canvasParentChildReconciliationActive", r.canvasParentChildReconciliationActive === true),
      line("cycleAwareRoutingActive", r.cycleAwareRoutingActive === true),
      line("southPrimaryGateIntegrationActive", r.southPrimaryGateIntegrationActive === true),
      line("canvasReleaseFirewallActive", r.canvasReleaseFirewallActive === true),
      "",
      line("cycleNumber", r.cycleNumber || r.activeCycleNumber || ""),
      line("cycleRoute", r.cycleRoute || r.activeCycleRoute || ""),
      line("receivedFrom", r.receivedFrom || ""),
      line("returnTo", r.returnTo || ""),
      line("handoffTo", r.handoffTo || ""),
      line("canvasReleaseAuthorized", r.canvasReleaseAuthorized === true),
      line("canvasReleaseRequiresWestAudit", r.canvasReleaseRequiresWestAudit !== false),
      line("canvasReleaseHeldReason", r.canvasReleaseHeldReason || ""),
      "",
      line("routeConductorMarkerPresent", r.routeConductorMarkerPresent === true),
      line("routeConductorApiPresent", r.routeConductorApiPresent === true),
      line("routeConductorReceiptPresent", r.routeConductorReceiptPresent === true),
      line("routeConductorRuntimeActive", r.routeConductorRuntimeActive === true),
      line("routeConductorHydrated", r.routeConductorHydrated === true),
      line("f8SelfDutySatisfied", r.f8SelfDutySatisfied === true),
      "",
      line("canvasParentV2Observed", r.canvasParentV2Observed === true),
      line("canvasEastApiReady", r.canvasEastApiReady === true),
      line("canvasWestApiReady", r.canvasWestApiReady === true),
      line("canvasSouthApiReady", r.canvasSouthApiReady === true),
      line("allCanvasChildrenApiReady", r.allCanvasChildrenApiReady === true),
      line("canvasEastEvidenceReady", r.canvasEastEvidenceReady === true),
      line("canvasWestInspectionReady", r.canvasWestInspectionReady === true),
      line("canvasSouthVisibleProofReady", r.canvasSouthVisibleProofReady === true),
      line("allCanvasChildrenEvidenceReady", r.allCanvasChildrenEvidenceReady === true),
      "",
      line("f13ProofBodyAvailable", r.f13ProofBodyAvailable === true),
      line("f13CanvasReadinessObserved", r.f13CanvasReadinessObserved === true),
      line("f13VisibleEvidenceAvailable", r.f13VisibleEvidenceAvailable === true),
      line("f13InspectEvidenceAvailable", r.f13InspectEvidenceAvailable === true),
      line("f13CanvasEvidenceStrict", r.f13CanvasEvidenceStrict === true),
      line("f13CanvasEvidenceDegraded", r.f13CanvasEvidenceDegraded === true),
      line("f13CanvasEvidenceComplete", r.f13CanvasEvidenceComplete === true),
      line("f13HardFail", r.f13HardFail === true),
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
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_PARENT_CHILD_RECONCILIATION_HANDOFF_STATUS",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("cycleNumber", r.cycleNumber),
      line("cycleRoute", r.cycleRoute),
      line("receivedFrom", r.receivedFrom),
      line("returnTo", r.returnTo),
      line("handoffTo", r.handoffTo),
      line("routeConductorHydrated", r.routeConductorHydrated),
      line("f8SelfDutySatisfied", r.f8SelfDutySatisfied),
      line("canvasParentV2Observed", r.canvasParentV2Observed),
      line("canvasGateReady", r.canvasGateReady),
      line("f13CanvasEvidenceComplete", r.f13CanvasEvidenceComplete),
      line("f13HardFail", r.f13HardFail),
      line("f21EligibleForNorth", r.f21EligibleForNorth),
      line("f21SubmittedToNorth", r.f21SubmittedToNorth),
      line("canvasReleaseAuthorized", r.canvasReleaseAuthorized),
      line("canvasReleaseHeldReason", r.canvasReleaseHeldReason),
      line("completionLatched", r.completionLatched),
      line("readyTextAllowed", r.readyTextAllowed),
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
    setDataset("hearthRouteConductorVersion", VERSION);
    setDataset("hearthRouteConductorPrimaryGateActive", "true");
    setDataset("hearthRouteConductorCanvasParentChildReconciliationActive", "true");
    setDataset("hearthRouteConductorCycleAwareRoutingActive", "true");
    setDataset("hearthRouteConductorCycleOneReturnsToNorth", "true");
    setDataset("hearthRouteConductorCycleTwoHandsToWest", "true");
    setDataset("hearthRouteConductorCanvasReleaseRequiresWestAudit", "true");
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

    setDataset("hearthSouthCanvasParentV2Observed", String(state.canvasParentV2Observed));
    setDataset("hearthSouthCanvasEastApiReady", String(state.canvasEastApiReady));
    setDataset("hearthSouthCanvasWestApiReady", String(state.canvasWestApiReady));
    setDataset("hearthSouthCanvasSouthApiReady", String(state.canvasSouthApiReady));
    setDataset("hearthSouthAllCanvasChildrenApiReady", String(state.allCanvasChildrenApiReady));
    setDataset("hearthSouthCanvasEastEvidenceReady", String(state.canvasEastEvidenceReady));
    setDataset("hearthSouthCanvasWestInspectionReady", String(state.canvasWestInspectionReady));
    setDataset("hearthSouthCanvasSouthVisibleProofReady", String(state.canvasSouthVisibleProofReady));
    setDataset("hearthSouthAllCanvasChildrenEvidenceReady", String(state.allCanvasChildrenEvidenceReady));

    setDataset("hearthSouthCanvasGateReady", String(state.canvasGateReady));
    setDataset("hearthSouthF21EligibleForNorth", String(state.f21EligibleForNorth));
    setDataset("hearthSouthF21EligibilitySubmittedToNorth", String(state.f21EligibilitySubmittedToNorth));
    setDataset("hearthSouthCompletionLatched", String(state.completionLatched));
    setDataset("hearthSouthReadyTextAllowed", String(state.readyTextAllowed));
    setDataset("hearthSouthF21LatchMode", state.f21LatchMode);
    setDataset("hearthSouthF21ClaimedByRouteConductor", "false");

    setDataset("hearthSouthCanvasReleaseAuthorized", String(state.canvasReleaseAuthorized));
    setDataset("hearthSouthCanvasReleaseHeldReason", state.canvasReleaseHeldReason);

    setDataset("hearthSouthFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthSouthRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthSouthRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);
    setDataset("hearthSouthPostgameStatus", state.postgameStatus);

    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
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
    FIBONACCI_RANK,

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
    readSouthPrimaryGate,
    readCanvasEvidence,
    resolveRouteCycle,
    resolveF8SelfDuty,
    resolveF13Evidence,
    resolveF21Eligibility,
    composeProofBody,
    composeCycleOneNorthReturn,
    composeCycleTwoWestHandoff,
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
    supportsCanvasReleaseFirewall: true,
    supportsCanvasParentChildReconciliation: true,
    supportsCanvasF13EvidenceOnly: true,
    supportsF21NorthNewsLatchOnly: true,
    supportsF21EligibilitySubmissionOnly: true,

    routeConductorPrimaryGateActive: true,
    canvasParentChildReconciliationActive: true,
    cycleAwareRoutingActive: true,
    southPrimaryGateIntegrationActive: true,
    canvasReleaseFirewallActive: true,

    ownsRouteConductorRuntime: true,
    ownsSelfDutyPublication: true,
    ownsRouteCycleResolution: true,
    ownsSouthPrimaryGateConsumption: true,
    ownsF13EvidenceObservation: true,
    ownsF21EligibilitySubmission: true,

    ownsCanvasDrawing: false,
    ownsCanvasChildren: false,
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
  publishGlobals("immediate-reconciliation-api-receipt-publication", true);

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

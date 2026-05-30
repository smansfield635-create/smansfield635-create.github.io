// /assets/hearth/hearth.west.index-handoff.table.js
// HEARTH_WEST_INDEX_HANDOFF_ADMISSIBILITY_TABLE_TNT_v1
// Full-file replacement.
// West authority only.
// Purpose:
// - Receive East Step 1 handoff.
// - Validate admissibility without mutating East, North, South, Runtime Table, canvas, or source-stack truth.
// - Normalize East / West / North / South receipts into a cycle-ready handoff record.
// - Publish West-to-North intake for the North command runtime table.
// - Preserve soft-gap forward progress while hard-blocking only kill conditions.
// Does not own:
// - East Step 1 ignition / first paint / mount / cockpit creation
// - North command runtime table / checkpoint law / NEWS Fibonacci governance
// - South visible completion / canvas coordination / visible proof / F21 latch
// - canvas pixel drawing
// - source-stack truth
// - final diagnostic receipt authority
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_WEST_INDEX_HANDOFF_ADMISSIBILITY_TABLE_TNT_v1";
  const RECEIPT = "HEARTH_WEST_INDEX_HANDOFF_ADMISSIBILITY_TABLE_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_EAST_STEP1_IGNITION_FIRST_PAINT_CYCLE_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_DIRECTIONAL_CYCLICAL_CHECKPOINT_GOVERNANCE_PRECODE_FINAL_DRAFT_v1";
  const VERSION = "2026-05-29.hearth-west-index-handoff-admissibility-table-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const ROUTE = "/showroom/globe/hearth/";
  const EAST_FILE = "/showroom/globe/hearth/index.js";
  const WEST_FILE = "/assets/hearth/hearth.west.index-handoff.table.js";
  const NORTH_FILE = "/assets/hearth/hearth.north.command.runtime-table.js";
  const SOUTH_FILE = "/showroom/globe/hearth/hearth.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const STATUS_ID = "hearth-route-status";

  const CYCLE_ORDER = "EAST -> WEST -> NORTH -> SOUTH -> CHECKPOINT -> EAST";

  const ADMISSIBILITY_CHECKS = Object.freeze([
    { key: "eastReceiptPresent", label: "East Step 1 receipt present", required: true },
    { key: "eastOwnsStep1", label: "East owns Step 1", required: true },
    { key: "step1Ignited", label: "Step 1 ignited", required: true },
    { key: "step1Ready", label: "Step 1 ready", required: true },
    { key: "mountReady", label: "Mount ready", required: true },
    { key: "firstPaintReady", label: "First paint ready", required: true },
    { key: "cockpitReady", label: "Cockpit ready", required: true },
    { key: "sharedLedgerPresent", label: "Shared ledger present", required: true },
    { key: "scriptOrderVisible", label: "Script order visible", required: true },
    { key: "noForbiddenVisualClaims", label: "No forbidden visual claims", required: true },
    { key: "noRuntimeTableMutation", label: "No Runtime Table mutation by West", required: true },
    { key: "noCanvasMutation", label: "No canvas mutation by West", required: true }
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: WEST_FILE,
    route: ROUTE,
    role: "west-index-handoff-admissibility-table",

    cycleOrder: CYCLE_ORDER,
    direction: "WEST",
    previousDirection: "EAST",
    nextDirection: "NORTH",

    eastFile: EAST_FILE,
    westFile: WEST_FILE,
    northFile: NORTH_FILE,
    southFile: SOUTH_FILE,
    canvasFile: CANVAS_FILE,

    ownsEast: false,
    ownsWest: true,
    ownsNorth: false,
    ownsSouth: false,

    ownsStep1: false,
    ownsStep1HandoffAdmissibility: true,
    ownsReceiptNormalization: true,
    ownsWestToNorthIntakePublication: true,

    ownsFirstPaintSurvival: false,
    ownsMountCreation: false,
    ownsInitialCockpitCreation: false,
    ownsNorthRuntimeTable: false,
    ownsCheckpointLaw: false,
    ownsNewsFibonacciGovernance: false,
    ownsCanvasCoordination: false,
    ownsCanvasDrawing: false,
    ownsVisiblePlanetProof: false,
    ownsInspectModeTruth: false,
    ownsCompletionLatch: false,
    ownsFinalDiagnosticReceipt: false,
    ownsFinalVisualPassClaim: false,

    eastReceiptPresent: false,
    eastReceiptSource: "",
    eastContract: "",
    eastReceiptName: "",
    eastStep: "",
    eastStepName: "",
    eastStep1Ignited: false,
    eastStep1Ready: false,
    eastFirstPaintReady: false,
    eastMountReady: false,
    eastCockpitReady: false,
    eastSharedLedgerPresent: false,
    eastScriptOrderVisible: false,
    eastPartialReceiptAvailable: false,

    step1Accepted: false,
    step1HandoffAccepted: false,
    handoffAdmissible: false,
    westGateReady: false,
    step1HandoffAcceptedAt: "",

    northIntakePublished: false,
    northIntakeAccepted: false,
    northIntakeAcceptedAt: "",
    northGlobalPresent: false,
    northReceiptPresent: false,
    northContract: "",
    northReceiptError: "",

    southGlobalPresent: false,
    southReceiptPresent: false,
    southContract: "",
    southReceiptError: "",

    gapAssessmentFast: true,
    hardBlockMode: false,
    softGapGovernor: true,
    forwardProgressAllowedWithGaps: true,
    hardBlocked: false,
    hardBlockReason: "",
    softGapCount: 0,
    hardBlockCount: 0,

    admissibilityScore: 0,
    admissibilityRequiredScore: ADMISSIBILITY_CHECKS.length,
    admissibilityChecksPassed: [],
    admissibilityChecksFailed: [],

    normalizedReceiptsReady: false,
    normalizedEastReceipt: null,
    normalizedWestReceipt: null,
    normalizedNorthReceipt: null,
    normalizedSouthReceipt: null,

    sharedLedgerPresent: false,
    sharedLedgerMutation: false,
    runtimeTableMutation: false,
    canvasMutation: false,
    sourceAuthorityHeld: true,
    climateRouteRetired: true,

    currentStage: "F5",
    highestStage: "F5",
    fibonacciStage: "F5",
    displayProgress: 48,
    latestEvent: "WEST_HANDOFF_TABLE_LOADED",
    postgameStatus: "WEST_LOADED_NOT_BOOTED",
    firstFailedCoordinate: "WEST_HANDOFF_NOT_STARTED",
    recommendedNextRenewalTarget: WEST_FILE,

    localEvents: [],
    softGapEvents: [],
    hardBlockEvents: [],
    errors: [],

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    startedAt: "",
    updatedAt: ""
  };

  let bootStarted = false;
  let heartbeatTimer = 0;
  let watchdogTimer = 0;

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

  function bool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    return fallback;
  }

  function clonePlain(value) {
    if (!isObject(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function getGlobal(names) {
    for (const name of names) {
      if (root[name]) return root[name];
    }
    return null;
  }

  function getLedger() {
    return root.HEARTH_LOAD_LEDGER || null;
  }

  function getEastReceipt() {
    return (
      root.HEARTH_EAST_STEP1_HANDOFF_RECEIPT ||
      root.HEARTH_INDEX_STEP1_HANDOFF_RECEIPT ||
      root.HEARTH_EAST_STEP1_IGNITION_RECEIPT ||
      root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR_RECEIPT ||
      null
    );
  }

  function getNorthApi() {
    return getGlobal([
      "HEARTH_NORTH_COMMAND_RUNTIME_TABLE",
      "HEARTH_NORTH_COMMAND_TABLE",
      "HEARTH_NORTH_COMMAND"
    ]);
  }

  function getNorthReceipt() {
    return (
      root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT ||
      root.HEARTH_NORTH_CYCLICAL_CHECKPOINT_RECEIPT ||
      null
    );
  }

  function getSouthApi() {
    return getGlobal([
      "HEARTH_SOUTH_VISIBLE_COMPLETION",
      "HEARTH_SOUTH_VISIBLE_COMPLETION_CYCLE_CONSUMER",
      "HEARTH_ROUTE_CONDUCTOR",
      "HearthRouteConductor"
    ]);
  }

  function getSouthReceipt() {
    return (
      root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT ||
      root.HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR_RECEIPT ||
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT ||
      null
    );
  }

  function recordLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event,
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    if (state.localEvents.length > 220) {
      state.localEvents.splice(0, state.localEvents.length - 220);
    }

    state.latestEvent = event;
    state.updatedAt = item.at;
    return item;
  }

  function recordSoftGap(code, message, detail = {}) {
    const item = {
      at: nowIso(),
      code,
      hardBlocked: false,
      forwardProgressAllowed: true,
      message: String(message || ""),
      detail: clonePlain(detail)
    };

    state.softGapEvents.push(item);
    if (state.softGapEvents.length > 160) {
      state.softGapEvents.splice(0, state.softGapEvents.length - 160);
    }

    state.softGapCount += 1;
    state.forwardProgressAllowedWithGaps = true;
    state.softGapGovernor = true;
    state.latestEvent = code;
    state.updatedAt = item.at;

    return item;
  }

  function recordHardBlock(code, message, detail = {}) {
    const item = {
      at: nowIso(),
      code,
      hardBlocked: true,
      forwardProgressAllowed: false,
      message: String(message || ""),
      detail: clonePlain(detail)
    };

    state.hardBlockEvents.push(item);
    if (state.hardBlockEvents.length > 80) {
      state.hardBlockEvents.splice(0, state.hardBlockEvents.length - 80);
    }

    state.hardBlockCount += 1;
    state.hardBlocked = true;
    state.hardBlockMode = true;
    state.hardBlockReason = `${code}: ${message}`;
    state.forwardProgressAllowedWithGaps = false;
    state.latestEvent = code;
    state.updatedAt = item.at;

    return item;
  }

  function recordError(code, message, detail = {}) {
    const item = {
      at: nowIso(),
      code,
      message: String(message || ""),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    if (state.errors.length > 80) {
      state.errors.splice(0, state.errors.length - 80);
    }

    return item;
  }

  function ledgerPush(event = {}) {
    const ledger = getLedger();

    state.sharedLedgerPresent = Boolean(ledger);
    if (!ledger || !isFunction(ledger.push)) return null;

    try {
      return ledger.push({
        id: event.id || event.event || "WEST_EVENT",
        stage: event.stage || "F5",
        lane: event.lane || "westHandoff",
        status: event.status || "",
        owner: "WEST",
        file: WEST_FILE,
        message: event.message || "",
        detail: clonePlain(event.detail || {}),
        progress: event.progress ?? 48
      });
    } catch (error) {
      recordError("WEST_LEDGER_PUSH_FAILED", error && error.message ? error.message : String(error));
      return null;
    }
  }

  function ledgerSetLane(key, next = {}) {
    const ledger = getLedger();

    state.sharedLedgerPresent = Boolean(ledger);
    if (!ledger || !isFunction(ledger.setLane)) return null;

    try {
      return ledger.setLane(key, {
        status: next.status || "READY",
        progress: next.progress ?? 48,
        event: next.event || "WEST_HANDOFF_EVENT",
        stage: next.stage || "F5",
        owner: "WEST",
        file: WEST_FILE,
        message: next.message || "",
        detail: clonePlain(next.detail || {})
      });
    } catch (error) {
      recordError("WEST_LEDGER_SET_LANE_FAILED", error && error.message ? error.message : String(error), { key });
      return null;
    }
  }

  function normalizeReceipt(source, receipt) {
    if (!receipt || !isObject(receipt)) return null;

    return {
      source,
      contract: String(receipt.contract || ""),
      receipt: String(receipt.receipt || ""),
      file: String(receipt.file || receipt.destinationFile || ""),
      route: String(receipt.route || ""),
      role: String(receipt.role || ""),
      cycleOrder: String(receipt.cycleOrder || CYCLE_ORDER),
      currentStage: String(receipt.currentStage || receipt.fibonacciStage || ""),
      status: String(receipt.postgameStatus || receipt.status || ""),
      firstFailedCoordinate: String(receipt.firstFailedCoordinate || ""),
      recommendedNextRenewalTarget: String(receipt.recommendedNextRenewalTarget || ""),
      generatedImage: bool(receipt.generatedImage, false),
      graphicBox: bool(receipt.graphicBox, false),
      webGL: bool(receipt.webGL, false),
      visualPassClaimed: bool(receipt.visualPassClaimed, false),
      updatedAt: String(receipt.updatedAt || nowIso()),
      raw: clonePlain(receipt)
    };
  }

  function hasForbiddenVisualClaim(receipt) {
    if (!receipt || !isObject(receipt)) return false;

    return Boolean(
      bool(receipt.generatedImage, false) ||
      bool(receipt.graphicBox, false) ||
      bool(receipt.webGL, false) ||
      bool(receipt.visualPassClaimed, false)
    );
  }

  function validateEastHandoff(receipt) {
    state.admissibilityChecksPassed = [];
    state.admissibilityChecksFailed = [];
    state.admissibilityScore = 0;

    const checks = {
      eastReceiptPresent: Boolean(receipt && isObject(receipt)),
      eastOwnsStep1: bool(receipt?.eastOwnsStep1, bool(receipt?.ownsStep1, false)) || receipt?.owner === "EAST",
      step1Ignited: bool(receipt?.step1Ignited, false),
      step1Ready: bool(receipt?.step1Ready, false),
      mountReady: bool(receipt?.mountReady, false),
      firstPaintReady: bool(receipt?.firstPaintReady, false),
      cockpitReady: bool(receipt?.cockpitReady, bool(receipt?.loadingScreenReady, false)),
      sharedLedgerPresent: bool(receipt?.sharedLedgerPresent, false),
      scriptOrderVisible: bool(receipt?.scriptOrderVisible, true),
      noForbiddenVisualClaims: !hasForbiddenVisualClaim(receipt),
      noRuntimeTableMutation: state.runtimeTableMutation === false,
      noCanvasMutation: state.canvasMutation === false
    };

    ADMISSIBILITY_CHECKS.forEach((check) => {
      const passed = Boolean(checks[check.key]);

      if (passed) {
        state.admissibilityChecksPassed.push(check.key);
        state.admissibilityScore += 1;
      } else {
        state.admissibilityChecksFailed.push(check.key);
      }
    });

    if (!checks.eastReceiptPresent) {
      recordSoftGap("EAST_STEP1_HANDOFF_NOT_PRESENT", "West is waiting for East Step 1 handoff.", {
        expectedReceipt: "HEARTH_EAST_STEP1_HANDOFF_RECEIPT"
      });
      return false;
    }

    if (!checks.noForbiddenVisualClaims) {
      recordHardBlock("FORBIDDEN_VISUAL_CLAIM_IN_EAST_HANDOFF", "East handoff contains a forbidden visual claim.", {
        generatedImage: receipt.generatedImage,
        graphicBox: receipt.graphicBox,
        webGL: receipt.webGL,
        visualPassClaimed: receipt.visualPassClaimed
      });
      return false;
    }

    if (state.runtimeTableMutation || state.canvasMutation) {
      recordHardBlock("WEST_AUTHORITY_MUTATION_DETECTED", "West may not mutate Runtime Table or canvas.", {
        runtimeTableMutation: state.runtimeTableMutation,
        canvasMutation: state.canvasMutation
      });
      return false;
    }

    if (state.admissibilityChecksFailed.length > 0) {
      recordSoftGap("EAST_STEP1_HANDOFF_INCOMPLETE", "East Step 1 handoff is present but not fully admissible yet.", {
        failed: state.admissibilityChecksFailed.slice()
      });
      return false;
    }

    return true;
  }

  function ingestEastReceipt(receipt, source = "method") {
    const eastReceipt = receipt && isObject(receipt) ? receipt : getEastReceipt();

    state.eastReceiptPresent = Boolean(eastReceipt);
    state.eastReceiptSource = source;

    if (!eastReceipt || !isObject(eastReceipt)) {
      state.step1Accepted = false;
      state.step1HandoffAccepted = false;
      state.handoffAdmissible = false;
      state.westGateReady = false;
      deriveFailureCoordinate();
      publishGlobals();
      return false;
    }

    state.eastContract = String(eastReceipt.contract || "");
    state.eastReceiptName = String(eastReceipt.receipt || "");
    state.eastStep = String(eastReceipt.step || "");
    state.eastStepName = String(eastReceipt.stepName || "");
    state.eastStep1Ignited = bool(eastReceipt.step1Ignited, false);
    state.eastStep1Ready = bool(eastReceipt.step1Ready, false);
    state.eastFirstPaintReady = bool(eastReceipt.firstPaintReady, false);
    state.eastMountReady = bool(eastReceipt.mountReady, false);
    state.eastCockpitReady = bool(eastReceipt.cockpitReady, bool(eastReceipt.loadingScreenReady, false));
    state.eastSharedLedgerPresent = bool(eastReceipt.sharedLedgerPresent, false);
    state.eastScriptOrderVisible = bool(eastReceipt.scriptOrderVisible, true);
    state.eastPartialReceiptAvailable = bool(eastReceipt.partialReceiptAvailable, false);

    state.normalizedEastReceipt = normalizeReceipt("EAST", eastReceipt);

    const admissible = validateEastHandoff(eastReceipt);

    state.handoffAdmissible = admissible;
    state.step1Accepted = admissible;
    state.step1HandoffAccepted = admissible;
    state.westGateReady = admissible;

    if (admissible && !state.step1HandoffAcceptedAt) {
      state.step1HandoffAcceptedAt = nowIso();
    }

    if (admissible) {
      state.postgameStatus = "WEST_HANDOFF_ADMISSIBLE";
      state.firstFailedCoordinate = "NONE_WEST_HANDOFF_ADMISSIBLE";
      state.recommendedNextRenewalTarget = NORTH_FILE;

      ledgerSetLane("westHandoff", {
        status: "ADMISSIBLE",
        progress: 55,
        event: "WEST_ACCEPTED_EAST_STEP1_HANDOFF",
        stage: "F5",
        message: "West accepted East Step 1 handoff and normalized receipt for North."
      });

      ledgerPush({
        id: "WEST_ACCEPTED_EAST_STEP1_HANDOFF",
        stage: "F5",
        lane: "westHandoff",
        status: "ADMISSIBLE",
        message: "East Step 1 handoff accepted by West.",
        progress: 55,
        detail: {
          eastContract: state.eastContract,
          acceptedAt: state.step1HandoffAcceptedAt
        }
      });

      publishNorthIntake();
    } else {
      deriveFailureCoordinate();

      ledgerSetLane("westHandoff", {
        status: state.hardBlocked ? "HARD_BLOCKED" : "SOFT_GAP",
        progress: 48,
        event: state.hardBlocked ? "WEST_HARD_BLOCKED_EAST_HANDOFF" : "WEST_WAITING_EAST_HANDOFF",
        stage: "F5",
        message: state.hardBlocked
          ? state.hardBlockReason
          : "West is waiting for a complete East Step 1 handoff."
      });
    }

    publishGlobals();
    return admissible;
  }

  function acceptStep1Handoff(receipt) {
    const accepted = ingestEastReceipt(receipt, "acceptStep1Handoff");
    return accepted ? getReceiptLight() : false;
  }

  function receiveEastStep1(receipt) {
    const accepted = ingestEastReceipt(receipt, "receiveEastStep1");
    return accepted ? getReceiptLight() : false;
  }

  function publishNorthIntake() {
    const intake = getWestToNorthIntakeReceipt();

    root.HEARTH_WEST_TO_NORTH_HANDOFF_RECEIPT = intake;
    root.HEARTH_WEST_TO_NORTH_INTAKE_RECEIPT = intake;

    state.northIntakePublished = true;

    const north = getNorthApi();

    state.northGlobalPresent = Boolean(north);

    if (!north) {
      recordSoftGap("NORTH_COMMAND_TABLE_NOT_PRESENT", "West intake is published; North command table is not present yet.", {
        northFile: NORTH_FILE
      });
      publishGlobals();
      return false;
    }

    state.northContract = String(north.contract || "");
    state.normalizedNorthReceipt = normalizeReceipt("NORTH", getNorthReceipt());
    state.northReceiptPresent = Boolean(state.normalizedNorthReceipt);

    const method =
      isFunction(north.acceptWestHandoff) ? "acceptWestHandoff" :
        isFunction(north.receiveWestHandoff) ? "receiveWestHandoff" :
          isFunction(north.acceptWestIntake) ? "acceptWestIntake" :
            isFunction(north.receiveWestIntake) ? "receiveWestIntake" :
              "";

    if (!method) {
      recordSoftGap("NORTH_ACCEPT_METHOD_NOT_PRESENT", "North is present, but no West-intake method is exposed yet.", {
        northContract: state.northContract
      });
      publishGlobals();
      return false;
    }

    try {
      const result = north[method](intake);
      state.northIntakeAccepted = Boolean(result !== false);
      state.northIntakeAcceptedAt = state.northIntakeAccepted ? nowIso() : "";

      recordLocal("WEST_TO_NORTH_INTAKE_SENT", {
        method,
        accepted: state.northIntakeAccepted,
        result: clonePlain(result)
      });

      ledgerSetLane("northCommand", {
        status: state.northIntakeAccepted ? "INTAKE_ACCEPTED" : "INTAKE_SENT",
        progress: state.northIntakeAccepted ? 62 : 55,
        event: state.northIntakeAccepted ? "NORTH_ACCEPTED_WEST_INTAKE" : "WEST_SENT_NORTH_INTAKE",
        stage: "F8",
        message: state.northIntakeAccepted
          ? "North accepted West normalized intake."
          : "West sent normalized intake to North."
      });

      publishGlobals();
      return state.northIntakeAccepted;
    } catch (error) {
      const message = error && error.message ? error.message : String(error);
      state.northReceiptError = message;
      recordError("NORTH_INTAKE_METHOD_FAILED", message, { method });
      publishGlobals();
      return false;
    }
  }

  function getWestToNorthIntakeReceipt() {
    return {
      contract: CONTRACT,
      receipt: "HEARTH_WEST_TO_NORTH_HANDOFF_RECEIPT_v1",
      sourceReceipt: RECEIPT,
      version: VERSION,
      owner: "WEST",
      file: WEST_FILE,
      route: ROUTE,
      cycleOrder: CYCLE_ORDER,

      previousDirection: "EAST",
      currentDirection: "WEST",
      nextDirection: "NORTH",

      stepReceived: 1,
      stepNormalized: 2,
      nextStep: 3,

      step1Accepted: state.step1Accepted,
      step1HandoffAccepted: state.step1HandoffAccepted,
      handoffAdmissible: state.handoffAdmissible,
      westGateReady: state.westGateReady,
      step1HandoffAcceptedAt: state.step1HandoffAcceptedAt,

      eastFile: EAST_FILE,
      westFile: WEST_FILE,
      northFile: NORTH_FILE,
      southFile: SOUTH_FILE,

      admissibilityScore: state.admissibilityScore,
      admissibilityRequiredScore: state.admissibilityRequiredScore,
      admissibilityChecksPassed: state.admissibilityChecksPassed.slice(),
      admissibilityChecksFailed: state.admissibilityChecksFailed.slice(),

      normalizedEastReceipt: clonePlain(state.normalizedEastReceipt),
      normalizedWestReceipt: clonePlain(state.normalizedWestReceipt),

      hardBlocked: state.hardBlocked,
      hardBlockMode: state.hardBlockMode,
      hardBlockReason: state.hardBlockReason,
      forwardProgressAllowedWithGaps: state.forwardProgressAllowedWithGaps,
      softGapGovernor: state.softGapGovernor,

      westOwnsReceiptNormalization: true,
      westOwnsHandoffAdmissibility: true,
      westOwnsNorthRuntimeTable: false,
      westOwnsCanvas: false,
      westOwnsFinalCompletion: false,

      runtimeTableMutation: false,
      canvasMutation: false,
      sourceAuthorityHeld: true,
      climateRouteRetired: true,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      publishedAt: nowIso()
    };
  }

  function reconcileReceipts() {
    const east = getEastReceipt();
    const north = getNorthReceipt();
    const south = getSouthReceipt();
    const northApi = getNorthApi();
    const southApi = getSouthApi();

    if (east && isObject(east) && !state.step1Accepted) {
      ingestEastReceipt(east, "reconcileReceipts");
    } else if (east && isObject(east)) {
      state.normalizedEastReceipt = normalizeReceipt("EAST", east);
    }

    state.northGlobalPresent = Boolean(northApi);
    state.southGlobalPresent = Boolean(southApi);

    if (northApi) state.northContract = String(northApi.contract || "");
    if (southApi) state.southContract = String(southApi.contract || "");

    state.normalizedNorthReceipt = normalizeReceipt("NORTH", north);
    state.normalizedSouthReceipt = normalizeReceipt("SOUTH", south);

    state.northReceiptPresent = Boolean(state.normalizedNorthReceipt);
    state.southReceiptPresent = Boolean(state.normalizedSouthReceipt);

    state.normalizedWestReceipt = normalizeReceipt("WEST", getReceiptLight());
    state.normalizedReceiptsReady = Boolean(state.normalizedEastReceipt && state.normalizedWestReceipt);

    if (state.step1Accepted && !state.northIntakePublished) {
      publishNorthIntake();
    }

    deriveFailureCoordinate();
  }

  function deriveFailureCoordinate() {
    if (state.hardBlocked) {
      state.firstFailedCoordinate = state.hardBlockReason || "WEST_HARD_BLOCKED";
      state.recommendedNextRenewalTarget = WEST_FILE;
      state.postgameStatus = "WEST_HARD_BLOCKED";
      return;
    }

    if (!state.eastReceiptPresent) {
      state.firstFailedCoordinate = "WAITING_EAST_STEP1_HANDOFF";
      state.recommendedNextRenewalTarget = EAST_FILE;
      state.postgameStatus = "WEST_WAITING_EAST_HANDOFF";
      return;
    }

    if (!state.handoffAdmissible) {
      state.firstFailedCoordinate = "WAITING_EAST_HANDOFF_ADMISSIBILITY";
      state.recommendedNextRenewalTarget = EAST_FILE;
      state.postgameStatus = "WEST_HANDOFF_SOFT_GAP";
      return;
    }

    if (!state.northIntakePublished) {
      state.firstFailedCoordinate = "WAITING_WEST_TO_NORTH_INTAKE_PUBLICATION";
      state.recommendedNextRenewalTarget = WEST_FILE;
      state.postgameStatus = "WEST_READY_TO_PUBLISH_NORTH_INTAKE";
      return;
    }

    if (!state.northGlobalPresent) {
      state.firstFailedCoordinate = "WAITING_NORTH_COMMAND_RUNTIME_TABLE";
      state.recommendedNextRenewalTarget = NORTH_FILE;
      state.postgameStatus = "WEST_INTAKE_PUBLISHED_NORTH_PENDING";
      return;
    }

    if (!state.northIntakeAccepted) {
      state.firstFailedCoordinate = "WAITING_NORTH_INTAKE_ACCEPTANCE";
      state.recommendedNextRenewalTarget = NORTH_FILE;
      state.postgameStatus = "WEST_WAITING_NORTH_ACCEPTANCE";
      return;
    }

    state.firstFailedCoordinate = "NONE_WEST_HANDOFF_NORMALIZED";
    state.recommendedNextRenewalTarget = NORTH_FILE;
    state.postgameStatus = "WEST_HANDOFF_NORMALIZED_NORTH_ACCEPTED";
  }

  function computeProgress() {
    let progress = 48;

    if (state.eastReceiptPresent) progress = Math.max(progress, 50);
    if (state.handoffAdmissible) progress = Math.max(progress, 55);
    if (state.northIntakePublished) progress = Math.max(progress, 58);
    if (state.northGlobalPresent) progress = Math.max(progress, 62);
    if (state.northIntakeAccepted) progress = Math.max(progress, 68);
    if (state.southGlobalPresent) progress = Math.max(progress, 72);

    state.displayProgress = Math.min(98, progress);
    return state.displayProgress;
  }

  function publishStatusNode() {
    if (!doc) return;

    const node =
      doc.getElementById(STATUS_ID) ||
      doc.querySelector("[data-hearth-route-status]");

    if (!node) return;

    node.textContent = [
      "Hearth West handoff admissibility table active.",
      `Contract ${CONTRACT}`,
      `Receipt ${RECEIPT}`,
      `File ${WEST_FILE}`,
      `Cycle ${CYCLE_ORDER}`,
      `East receipt present ${state.eastReceiptPresent}`,
      `Handoff admissible ${state.handoffAdmissible}`,
      `West gate ready ${state.westGateReady}`,
      `North intake published ${state.northIntakePublished}`,
      `North intake accepted ${state.northIntakeAccepted}`,
      `Hard blocked ${state.hardBlocked}`,
      `First failed coordinate ${state.firstFailedCoordinate}`,
      `Recommended next renewal target ${state.recommendedNextRenewalTarget}`,
      "Runtime Table mutation false",
      "Canvas mutation false",
      "Generated image false",
      "GraphicBox false",
      "WebGL false",
      "Visual pass claimed false",
      `Updated ${state.updatedAt || nowIso()}`
    ].join("\n");
  }

  function publishDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthWestHandoffTableLoaded = "true";
    dataset.hearthWestHandoffTableContract = CONTRACT;
    dataset.hearthWestHandoffTableReceipt = RECEIPT;
    dataset.hearthWestHandoffTableVersion = VERSION;
    dataset.hearthCycleWest = "true";
    dataset.hearthCycleOrder = CYCLE_ORDER;

    dataset.hearthEastFile = EAST_FILE;
    dataset.hearthWestFile = WEST_FILE;
    dataset.hearthNorthFile = NORTH_FILE;
    dataset.hearthSouthFile = SOUTH_FILE;

    dataset.hearthWestOwnsHandoffAdmissibility = "true";
    dataset.hearthWestOwnsReceiptNormalization = "true";
    dataset.hearthWestOwnsNorthRuntimeTable = "false";
    dataset.hearthWestOwnsCanvas = "false";
    dataset.hearthWestOwnsFinalCompletion = "false";

    dataset.hearthEastReceiptPresent = String(state.eastReceiptPresent);
    dataset.hearthStep1Accepted = String(state.step1Accepted);
    dataset.hearthStep1HandoffAccepted = String(state.step1HandoffAccepted);
    dataset.hearthHandoffAdmissible = String(state.handoffAdmissible);
    dataset.hearthWestGateReady = String(state.westGateReady);

    dataset.hearthNorthIntakePublished = String(state.northIntakePublished);
    dataset.hearthNorthIntakeAccepted = String(state.northIntakeAccepted);
    dataset.hearthNorthGlobalPresent = String(state.northGlobalPresent);
    dataset.hearthSouthGlobalPresent = String(state.southGlobalPresent);

    dataset.hearthWestHardBlocked = String(state.hardBlocked);
    dataset.hearthWestHardBlockReason = state.hardBlockReason;
    dataset.hearthWestForwardProgressAllowedWithGaps = String(state.forwardProgressAllowedWithGaps);
    dataset.hearthWestSoftGapGovernor = String(state.softGapGovernor);

    dataset.hearthWestFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthWestRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    dataset.hearthRuntimeTableMutation = "false";
    dataset.hearthCanvasMutation = "false";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function publishGlobals() {
    state.normalizedWestReceipt = normalizeReceipt("WEST", getReceiptLight());

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.westIndexHandoffTable = api;
    root.HEARTH.westHandoffAdmissibility = api;

    root.HEARTH_WEST_INDEX_HANDOFF_TABLE = api;
    root.HEARTH_WEST_HANDOFF_ADMISSIBILITY = api;
    root.HEARTH_WEST_CYCLE_HANDOFF = api;

    root.HEARTH_WEST_INDEX_HANDOFF_TABLE_RECEIPT = getReceiptLight();
    root.HEARTH_WEST_HANDOFF_ADMISSIBILITY_RECEIPT = root.HEARTH_WEST_INDEX_HANDOFF_TABLE_RECEIPT;
    root.HEARTH_WEST_TO_NORTH_HANDOFF_RECEIPT = getWestToNorthIntakeReceipt();
    root.HEARTH_WEST_TO_NORTH_INTAKE_RECEIPT = root.HEARTH_WEST_TO_NORTH_HANDOFF_RECEIPT;

    root.__HEARTH_EAST_STEP1_FILE__ = EAST_FILE;
    root.__HEARTH_WEST_HANDOFF_FILE__ = WEST_FILE;
    root.__HEARTH_NORTH_COMMAND_FILE__ = NORTH_FILE;
    root.__HEARTH_SOUTH_VISIBLE_COMPLETION_FILE__ = SOUTH_FILE;

    publishDataset();
    publishStatusNode();
  }

  function getReceiptLight() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: WEST_FILE,
      route: ROUTE,
      role: state.role,
      cycleOrder: CYCLE_ORDER,

      direction: "WEST",
      previousDirection: "EAST",
      nextDirection: "NORTH",

      step1Accepted: state.step1Accepted,
      step1HandoffAccepted: state.step1HandoffAccepted,
      handoffAdmissible: state.handoffAdmissible,
      westGateReady: state.westGateReady,
      step1HandoffAcceptedAt: state.step1HandoffAcceptedAt,

      eastReceiptPresent: state.eastReceiptPresent,
      eastContract: state.eastContract,
      eastStep1Ignited: state.eastStep1Ignited,
      eastStep1Ready: state.eastStep1Ready,
      eastFirstPaintReady: state.eastFirstPaintReady,
      eastMountReady: state.eastMountReady,
      eastCockpitReady: state.eastCockpitReady,
      eastSharedLedgerPresent: state.eastSharedLedgerPresent,
      eastScriptOrderVisible: state.eastScriptOrderVisible,

      northIntakePublished: state.northIntakePublished,
      northIntakeAccepted: state.northIntakeAccepted,
      northIntakeAcceptedAt: state.northIntakeAcceptedAt,
      northGlobalPresent: state.northGlobalPresent,
      northReceiptPresent: state.northReceiptPresent,
      northContract: state.northContract,

      southGlobalPresent: state.southGlobalPresent,
      southReceiptPresent: state.southReceiptPresent,
      southContract: state.southContract,

      admissibilityScore: state.admissibilityScore,
      admissibilityRequiredScore: state.admissibilityRequiredScore,
      admissibilityChecksPassed: state.admissibilityChecksPassed.slice(),
      admissibilityChecksFailed: state.admissibilityChecksFailed.slice(),

      normalizedReceiptsReady: state.normalizedReceiptsReady,

      gapAssessmentFast: true,
      hardBlockMode: state.hardBlockMode,
      softGapGovernor: state.softGapGovernor,
      forwardProgressAllowedWithGaps: state.forwardProgressAllowedWithGaps,
      hardBlocked: state.hardBlocked,
      hardBlockReason: state.hardBlockReason,
      softGapCount: state.softGapCount,
      hardBlockCount: state.hardBlockCount,

      sharedLedgerPresent: state.sharedLedgerPresent,
      sharedLedgerMutation: false,
      runtimeTableMutation: false,
      canvasMutation: false,
      sourceAuthorityHeld: true,
      climateRouteRetired: true,

      currentStage: state.currentStage,
      highestStage: state.highestStage,
      fibonacciStage: state.fibonacciStage,
      displayProgress: computeProgress(),
      latestEvent: state.latestEvent,
      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      startedAt: state.startedAt,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    reconcileReceipts();

    return {
      ...getReceiptLight(),

      ownsEast: false,
      ownsWest: true,
      ownsNorth: false,
      ownsSouth: false,

      ownsStep1: false,
      ownsStep1HandoffAdmissibility: true,
      ownsReceiptNormalization: true,
      ownsWestToNorthIntakePublication: true,

      ownsFirstPaintSurvival: false,
      ownsMountCreation: false,
      ownsInitialCockpitCreation: false,
      ownsNorthRuntimeTable: false,
      ownsCheckpointLaw: false,
      ownsNewsFibonacciGovernance: false,
      ownsCanvasCoordination: false,
      ownsCanvasDrawing: false,
      ownsVisiblePlanetProof: false,
      ownsInspectModeTruth: false,
      ownsCompletionLatch: false,
      ownsFinalDiagnosticReceipt: false,
      ownsFinalVisualPassClaim: false,

      eastFile: EAST_FILE,
      westFile: WEST_FILE,
      northFile: NORTH_FILE,
      southFile: SOUTH_FILE,
      canvasFile: CANVAS_FILE,

      normalizedEastReceipt: clonePlain(state.normalizedEastReceipt),
      normalizedWestReceipt: clonePlain(state.normalizedWestReceipt),
      normalizedNorthReceipt: clonePlain(state.normalizedNorthReceipt),
      normalizedSouthReceipt: clonePlain(state.normalizedSouthReceipt),
      westToNorthIntakeReceipt: getWestToNorthIntakeReceipt(),

      localEvents: clonePlain(state.localEvents),
      softGapEvents: clonePlain(state.softGapEvents),
      hardBlockEvents: clonePlain(state.hardBlockEvents),
      errors: clonePlain(state.errors)
    };
  }

  function getReceiptText() {
    const receipt = getReceipt();

    const checksPassed = receipt.admissibilityChecksPassed.map((item) => `- ${item}`).join("\n") || "- none";
    const checksFailed = receipt.admissibilityChecksFailed.map((item) => `- ${item}`).join("\n") || "- none";

    const softGaps = receipt.softGapEvents.map((event) => (
      `- ${event.at || ""} :: ${event.code || ""} :: hardBlocked=${event.hardBlocked}; forwardProgressAllowed=${event.forwardProgressAllowed}; ${event.message || ""}`
    )).join("\n") || "- none";

    const hardBlocks = receipt.hardBlockEvents.map((event) => (
      `- ${event.at || ""} :: ${event.code || ""} :: hardBlocked=${event.hardBlocked}; ${event.message || ""}`
    )).join("\n") || "- none";

    const localEvents = receipt.localEvents.map((event) => (
      `- ${event.at || ""} :: ${event.event || ""} :: ${JSON.stringify(event.detail || {})}`
    )).join("\n") || "- none";

    const errors = receipt.errors.map((error) => (
      `- ${error.at || ""} :: ${error.code || ""} :: ${error.message || ""}`
    )).join("\n") || "- none";

    return [
      "HEARTH_WEST_INDEX_HANDOFF_ADMISSIBILITY_TABLE_RECEIPT",
      "",
      `contract=${receipt.contract}`,
      `receipt=${receipt.receipt}`,
      `previousContract=${receipt.previousContract}`,
      `baselineContract=${receipt.baselineContract}`,
      `version=${receipt.version}`,
      `file=${receipt.file}`,
      `route=${receipt.route}`,
      `role=${receipt.role}`,
      `cycleOrder=${receipt.cycleOrder}`,
      "",
      `direction=${receipt.direction}`,
      `previousDirection=${receipt.previousDirection}`,
      `nextDirection=${receipt.nextDirection}`,
      "",
      `ownsEast=${receipt.ownsEast}`,
      `ownsWest=${receipt.ownsWest}`,
      `ownsNorth=${receipt.ownsNorth}`,
      `ownsSouth=${receipt.ownsSouth}`,
      "",
      `ownsStep1=${receipt.ownsStep1}`,
      `ownsStep1HandoffAdmissibility=${receipt.ownsStep1HandoffAdmissibility}`,
      `ownsReceiptNormalization=${receipt.ownsReceiptNormalization}`,
      `ownsWestToNorthIntakePublication=${receipt.ownsWestToNorthIntakePublication}`,
      "",
      `ownsFirstPaintSurvival=${receipt.ownsFirstPaintSurvival}`,
      `ownsMountCreation=${receipt.ownsMountCreation}`,
      `ownsInitialCockpitCreation=${receipt.ownsInitialCockpitCreation}`,
      `ownsNorthRuntimeTable=${receipt.ownsNorthRuntimeTable}`,
      `ownsCheckpointLaw=${receipt.ownsCheckpointLaw}`,
      `ownsNewsFibonacciGovernance=${receipt.ownsNewsFibonacciGovernance}`,
      `ownsCanvasCoordination=${receipt.ownsCanvasCoordination}`,
      `ownsCanvasDrawing=${receipt.ownsCanvasDrawing}`,
      `ownsVisiblePlanetProof=${receipt.ownsVisiblePlanetProof}`,
      `ownsInspectModeTruth=${receipt.ownsInspectModeTruth}`,
      `ownsCompletionLatch=${receipt.ownsCompletionLatch}`,
      `ownsFinalDiagnosticReceipt=${receipt.ownsFinalDiagnosticReceipt}`,
      `ownsFinalVisualPassClaim=${receipt.ownsFinalVisualPassClaim}`,
      "",
      `eastFile=${receipt.eastFile}`,
      `westFile=${receipt.westFile}`,
      `northFile=${receipt.northFile}`,
      `southFile=${receipt.southFile}`,
      `canvasFile=${receipt.canvasFile}`,
      "",
      `eastReceiptPresent=${receipt.eastReceiptPresent}`,
      `eastContract=${receipt.eastContract}`,
      `eastStep1Ignited=${receipt.eastStep1Ignited}`,
      `eastStep1Ready=${receipt.eastStep1Ready}`,
      `eastFirstPaintReady=${receipt.eastFirstPaintReady}`,
      `eastMountReady=${receipt.eastMountReady}`,
      `eastCockpitReady=${receipt.eastCockpitReady}`,
      `eastSharedLedgerPresent=${receipt.eastSharedLedgerPresent}`,
      `eastScriptOrderVisible=${receipt.eastScriptOrderVisible}`,
      "",
      `step1Accepted=${receipt.step1Accepted}`,
      `step1HandoffAccepted=${receipt.step1HandoffAccepted}`,
      `handoffAdmissible=${receipt.handoffAdmissible}`,
      `westGateReady=${receipt.westGateReady}`,
      `step1HandoffAcceptedAt=${receipt.step1HandoffAcceptedAt}`,
      "",
      `northIntakePublished=${receipt.northIntakePublished}`,
      `northIntakeAccepted=${receipt.northIntakeAccepted}`,
      `northIntakeAcceptedAt=${receipt.northIntakeAcceptedAt}`,
      `northGlobalPresent=${receipt.northGlobalPresent}`,
      `northReceiptPresent=${receipt.northReceiptPresent}`,
      `northContract=${receipt.northContract}`,
      "",
      `southGlobalPresent=${receipt.southGlobalPresent}`,
      `southReceiptPresent=${receipt.southReceiptPresent}`,
      `southContract=${receipt.southContract}`,
      "",
      `admissibilityScore=${receipt.admissibilityScore}`,
      `admissibilityRequiredScore=${receipt.admissibilityRequiredScore}`,
      "",
      "ADMISSIBILITY_CHECKS_PASSED",
      checksPassed,
      "",
      "ADMISSIBILITY_CHECKS_FAILED",
      checksFailed,
      "",
      `normalizedReceiptsReady=${receipt.normalizedReceiptsReady}`,
      "",
      `gapAssessmentFast=${receipt.gapAssessmentFast}`,
      `hardBlockMode=${receipt.hardBlockMode}`,
      `softGapGovernor=${receipt.softGapGovernor}`,
      `forwardProgressAllowedWithGaps=${receipt.forwardProgressAllowedWithGaps}`,
      `hardBlocked=${receipt.hardBlocked}`,
      `hardBlockReason=${receipt.hardBlockReason}`,
      `softGapCount=${receipt.softGapCount}`,
      `hardBlockCount=${receipt.hardBlockCount}`,
      "",
      `sharedLedgerPresent=${receipt.sharedLedgerPresent}`,
      `sharedLedgerMutation=${receipt.sharedLedgerMutation}`,
      `runtimeTableMutation=${receipt.runtimeTableMutation}`,
      `canvasMutation=${receipt.canvasMutation}`,
      `sourceAuthorityHeld=${receipt.sourceAuthorityHeld}`,
      `climateRouteRetired=${receipt.climateRouteRetired}`,
      "",
      `currentStage=${receipt.currentStage}`,
      `highestStage=${receipt.highestStage}`,
      `fibonacciStage=${receipt.fibonacciStage}`,
      `displayProgress=${receipt.displayProgress}`,
      `latestEvent=${receipt.latestEvent}`,
      `postgameStatus=${receipt.postgameStatus}`,
      `firstFailedCoordinate=${receipt.firstFailedCoordinate}`,
      `recommendedNextRenewalTarget=${receipt.recommendedNextRenewalTarget}`,
      "",
      "SOFT_GAP_EVENTS",
      softGaps,
      "",
      "HARD_BLOCK_EVENTS",
      hardBlocks,
      "",
      "LOCAL_EVENTS",
      localEvents,
      "",
      "ERRORS",
      errors,
      "",
      `generatedImage=${receipt.generatedImage}`,
      `graphicBox=${receipt.graphicBox}`,
      `webGL=${receipt.webGL}`,
      `visualPassClaimed=${receipt.visualPassClaimed}`,
      "",
      `startedAt=${receipt.startedAt}`,
      `updatedAt=${receipt.updatedAt}`
    ].join("\n");
  }

  function boot() {
    if (bootStarted) {
      publishGlobals();
      return getReceipt();
    }

    bootStarted = true;
    state.startedAt = nowIso();
    state.updatedAt = state.startedAt;
    state.postgameStatus = "WEST_BOOTING";
    state.firstFailedCoordinate = "WEST_CHECKING_EAST_HANDOFF";
    state.recommendedNextRenewalTarget = EAST_FILE;

    state.sharedLedgerPresent = Boolean(getLedger());

    ledgerSetLane("westHandoff", {
      status: "ACTIVE",
      progress: 48,
      event: "WEST_HANDOFF_ADMISSIBILITY_ACTIVE",
      stage: "F5",
      message: "West handoff admissibility table active."
    });

    const eastReceipt = getEastReceipt();
    if (eastReceipt) {
      ingestEastReceipt(eastReceipt, "boot-existing-east-receipt");
    } else {
      recordSoftGap("EAST_STEP1_HANDOFF_NOT_PRESENT", "West booted before East Step 1 handoff was available.", {
        expectedReceipt: "HEARTH_EAST_STEP1_HANDOFF_RECEIPT"
      });
      deriveFailureCoordinate();
    }

    reconcileReceipts();
    publishGlobals();

    startHeartbeat();
    startWatchdog();

    return getReceipt();
  }

  function startHeartbeat() {
    if (heartbeatTimer) root.clearInterval(heartbeatTimer);

    heartbeatTimer = root.setInterval(() => {
      reconcileReceipts();
      if (state.step1Accepted) publishNorthIntake();
      publishGlobals();
    }, 1000);
  }

  function startWatchdog() {
    if (watchdogTimer) root.clearInterval(watchdogTimer);

    let ticks = 0;

    watchdogTimer = root.setInterval(() => {
      ticks += 1;

      reconcileReceipts();

      if (!state.eastReceiptPresent) {
        recordSoftGap("WEST_WAITING_FOR_EAST_HANDOFF", "West remains ready; East handoff is still pending.", {
          ticks
        });
      }

      if (state.step1Accepted && !state.northIntakeAccepted) {
        publishNorthIntake();
      }

      publishGlobals();

      if (ticks >= 80 || state.northIntakeAccepted) {
        root.clearInterval(watchdogTimer);
        watchdogTimer = 0;
      }
    }, 500);
  }

  function dispose(reason = "manual-dispose") {
    if (heartbeatTimer) {
      root.clearInterval(heartbeatTimer);
      heartbeatTimer = 0;
    }

    if (watchdogTimer) {
      root.clearInterval(watchdogTimer);
      watchdogTimer = 0;
    }

    recordLocal("WEST_HANDOFF_TABLE_DISPOSED", { reason });
    publishGlobals();
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    route: ROUTE,
    file: WEST_FILE,
    role: "west-index-handoff-admissibility-table",

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,

    acceptStep1Handoff,
    receiveEastStep1,
    publishNorthIntake,
    reconcileReceipts,
    getWestToNorthIntakeReceipt,
    getReceipt,
    getReceiptText,

    supportsDirectionalCycle: true,
    supportsWestHandoffAdmissibility: true,
    supportsReceiptNormalization: true,
    supportsWestToNorthIntakePublication: true,
    supportsSoftGapGovernor: true,
    supportsHardBlockKillConditions: true,

    ownsEast: false,
    ownsWest: true,
    ownsNorth: false,
    ownsSouth: false,
    ownsStep1: false,
    ownsStep1HandoffAdmissibility: true,
    ownsReceiptNormalization: true,
    ownsNorthRuntimeTable: false,
    ownsCheckpointLaw: false,
    ownsCanvasCoordination: false,
    ownsCanvasDrawing: false,
    ownsVisiblePlanetProof: false,
    ownsCompletionLatch: false,
    ownsFinalVisualPassClaim: false,

    eastFile: EAST_FILE,
    westFile: WEST_FILE,
    northFile: NORTH_FILE,
    southFile: SOUTH_FILE,
    canvasFile: CANVAS_FILE,

    runtimeTableMutation: false,
    canvasMutation: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  publishGlobals();

  if (doc) {
    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", () => {
        boot();
      }, { once: true });
    } else {
      boot();
    }
  } else {
    boot();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

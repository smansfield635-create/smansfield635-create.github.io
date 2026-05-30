// /assets/hearth/hearth.west.index-handoff.table.js
// HEARTH_WEST_INDEX_HANDOFF_QUIET_REGISTRATION_NORTH_INTAKE_TNT_v2
// Full-file replacement.
// West authority only.
// Purpose:
// - Register West handoff capability quietly.
// - Receive East Step 1 handoff.
// - Validate and normalize East handoff once.
// - Publish durable North-readable intake receipts.
// - Attempt North intake once when requested or when North is already present.
// - Expose retryNorthIntake() without heartbeat/watchdog loops.
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

  const CONTRACT = "HEARTH_WEST_INDEX_HANDOFF_QUIET_REGISTRATION_NORTH_INTAKE_TNT_v2";
  const RECEIPT = "HEARTH_WEST_INDEX_HANDOFF_QUIET_REGISTRATION_NORTH_INTAKE_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "HEARTH_WEST_INDEX_HANDOFF_ADMISSIBILITY_TABLE_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_DIRECTIONAL_CYCLICAL_CHECKPOINT_GOVERNANCE_PRECODE_FINAL_DRAFT_v1";
  const VERSION = "2026-05-29.hearth-west-quiet-registration-north-intake-v2";

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
  const CHECKPOINT_EVENT = "INDEX_HANDOFF_ACCEPTED";
  const CHECKPOINT_CANDIDATE = "S2_INDEX_HANDOFF_ACCEPTED";
  const CHECKPOINT_STAGE = "F8";

  const ADMISSIBILITY_CHECKS = Object.freeze([
    "eastReceiptPresent",
    "eastOwnsStep1",
    "step1Ignited",
    "step1Ready",
    "mountReady",
    "firstPaintReady",
    "cockpitReady",
    "sharedLedgerPresent",
    "scriptOrderVisible",
    "noForbiddenVisualClaims",
    "noRuntimeTableMutation",
    "noCanvasMutation"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: WEST_FILE,
    route: ROUTE,
    role: "west-index-handoff-quiet-registration-north-intake",

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

    quietRegistration: true,
    autoBoot: false,
    heartbeatLoop: false,
    watchdogLoop: false,
    repeatedNorthRetry: false,
    oneShotNorthIntake: true,
    manualRetryAvailable: true,

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

    westAccepted: false,
    eastStep1Accepted: false,
    step1Accepted: false,
    step1HandoffAccepted: false,
    handoffAdmissible: false,
    westGateReady: false,
    northIntakeReady: false,
    step1HandoffAcceptedAt: "",

    recommendedNextOwner: "EAST",
    recommendedNextFile: EAST_FILE,
    checkpointCandidate: CHECKPOINT_CANDIDATE,
    checkpointEvent: CHECKPOINT_EVENT,
    checkpointStage: CHECKPOINT_STAGE,
    northExpectedAction: "ACCEPT_INDEX_HANDOFF",

    northIntakePublished: false,
    northIntakeAccepted: false,
    northIntakeAcceptedAt: "",
    northIntakeMethod: "",
    northAcceptMethodPresent: false,
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
    latestEvent: "WEST_QUIET_REGISTRATION_READY",
    postgameStatus: "WEST_REGISTERED_QUIET",
    firstFailedCoordinate: "WAITING_EAST_STEP1_HANDOFF",
    recommendedNextRenewalTarget: EAST_FILE,

    localEvents: [],
    softGapEvents: [],
    hardBlockEvents: [],
    errors: [],

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    registeredAt: "",
    updatedAt: ""
  };

  let northAttemptedForCurrentHandoff = false;
  let disposed = false;

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

  function recordLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event,
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    if (state.localEvents.length > 160) {
      state.localEvents.splice(0, state.localEvents.length - 160);
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
    if (state.softGapEvents.length > 100) {
      state.softGapEvents.splice(0, state.softGapEvents.length - 100);
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
    if (state.hardBlockEvents.length > 60) {
      state.hardBlockEvents.splice(0, state.hardBlockEvents.length - 60);
    }

    state.hardBlockCount += 1;
    state.hardBlocked = true;
    state.hardBlockMode = true;
    state.hardBlockReason = `${code}: ${message}`;
    state.forwardProgressAllowedWithGaps = false;
    state.firstFailedCoordinate = `WEST_HARD_BLOCK_${code}`;
    state.recommendedNextOwner = "WEST";
    state.recommendedNextFile = WEST_FILE;
    state.recommendedNextRenewalTarget = WEST_FILE;
    state.postgameStatus = "WEST_HARD_BLOCKED";
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

    state.updatedAt = item.at;
    return item;
  }

  function getEastReceipt() {
    return (
      root.HEARTH_EAST_STEP1_HANDOFF_RECEIPT ||
      root.HEARTH_INDEX_STEP1_HANDOFF_RECEIPT ||
      root.HEARTH_EAST_STEP1_IGNITION_RECEIPT ||
      root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR_RECEIPT ||
      root.HEARTH_INDEX_BRIDGE_RECEIPT ||
      root.HEARTH_INDEX_JS_RECEIPT ||
      null
    );
  }

  function getNorthApi() {
    return getGlobal([
      "HEARTH_NORTH_COMMAND_RUNTIME_TABLE",
      "HEARTH_NORTH_COMMAND_TABLE",
      "HEARTH_NORTH_COMMAND",
      "HEARTH_LOCAL_COMMAND_RUNTIME_TABLE"
    ]) || (root.HEARTH && root.HEARTH.northCommandRuntimeTable) || null;
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
    ]) || (root.HEARTH && root.HEARTH.southVisibleCompletion) || null;
  }

  function getSouthReceipt() {
    return (
      root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT ||
      root.HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR_RECEIPT ||
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT ||
      null
    );
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

  function readEastTruth(receipt) {
    const eastOwnsStep1 =
      bool(receipt.eastOwnsStep1, false) ||
      bool(receipt.ownsStep1, false) ||
      receipt.owner === "EAST" ||
      receipt.direction === "EAST" ||
      receipt.role === "east-step1-ignition-first-paint-cycle";

    const step1Ignited =
      bool(receipt.step1Ignited, false) ||
      bool(receipt.indexJsStartsProcess, false) ||
      bool(receipt.firstPaintReady, false) ||
      bool(receipt.firstPaintCockpitReady, false);

    const step1Ready =
      bool(receipt.step1Ready, false) ||
      bool(receipt.firstPaintReady, false) ||
      bool(receipt.firstPaintCockpitReady, false) ||
      bool(receipt.loadingScreenReady, false) ||
      bool(receipt.mountReady, false);

    const mountReady =
      bool(receipt.mountReady, false) ||
      bool(receipt.mountCreatedByIndex, false) ||
      bool(receipt.firstPaintCockpitReady, false);

    const firstPaintReady =
      bool(receipt.firstPaintReady, false) ||
      bool(receipt.firstPaintCockpitReady, false) ||
      bool(receipt.loadingScreenReady, false);

    const cockpitReady =
      bool(receipt.cockpitReady, false) ||
      bool(receipt.firstPaintCockpitReady, false) ||
      bool(receipt.loadingScreenReady, false);

    const sharedLedgerPresent =
      bool(receipt.sharedLedgerPresent, false) ||
      bool(receipt.loadLedgerPresent, false) ||
      Boolean(root.HEARTH_LOAD_LEDGER);

    const scriptOrderVisible =
      bool(receipt.scriptOrderVisible, true) !== false;

    return {
      eastOwnsStep1,
      step1Ignited,
      step1Ready,
      mountReady,
      firstPaintReady,
      cockpitReady,
      sharedLedgerPresent,
      scriptOrderVisible
    };
  }

  function validateEastHandoff(receipt) {
    state.admissibilityChecksPassed = [];
    state.admissibilityChecksFailed = [];
    state.admissibilityScore = 0;

    const truth = readEastTruth(receipt);

    const checks = {
      eastReceiptPresent: Boolean(receipt && isObject(receipt)),
      eastOwnsStep1: truth.eastOwnsStep1,
      step1Ignited: truth.step1Ignited,
      step1Ready: truth.step1Ready,
      mountReady: truth.mountReady,
      firstPaintReady: truth.firstPaintReady,
      cockpitReady: truth.cockpitReady,
      sharedLedgerPresent: truth.sharedLedgerPresent,
      scriptOrderVisible: truth.scriptOrderVisible,
      noForbiddenVisualClaims: !hasForbiddenVisualClaim(receipt),
      noRuntimeTableMutation: state.runtimeTableMutation === false,
      noCanvasMutation: state.canvasMutation === false
    };

    ADMISSIBILITY_CHECKS.forEach((key) => {
      if (checks[key]) {
        state.admissibilityChecksPassed.push(key);
        state.admissibilityScore += 1;
      } else {
        state.admissibilityChecksFailed.push(key);
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

    const killMissing = [
      "eastReceiptPresent",
      "eastOwnsStep1",
      "step1Ignited",
      "mountReady",
      "firstPaintReady",
      "cockpitReady"
    ].filter((key) => !checks[key]);

    if (killMissing.length > 0) {
      recordSoftGap("EAST_STEP1_HANDOFF_INCOMPLETE", "East Step 1 handoff is present but not fully admissible yet.", {
        failed: state.admissibilityChecksFailed.slice(),
        killMissing
      });
      return false;
    }

    return true;
  }

  function applyEastReceipt(receipt, source = "method") {
    const eastReceipt = receipt && isObject(receipt) ? receipt : getEastReceipt();

    state.eastReceiptPresent = Boolean(eastReceipt);
    state.eastReceiptSource = source;

    if (!eastReceipt || !isObject(eastReceipt)) {
      state.westAccepted = false;
      state.eastStep1Accepted = false;
      state.step1Accepted = false;
      state.step1HandoffAccepted = false;
      state.handoffAdmissible = false;
      state.westGateReady = false;
      state.northIntakeReady = false;
      deriveFailureCoordinate();
      publishGlobals();
      return false;
    }

    const truth = readEastTruth(eastReceipt);

    state.eastContract = String(eastReceipt.contract || "");
    state.eastReceiptName = String(eastReceipt.receipt || "");
    state.eastStep = String(eastReceipt.step || "");
    state.eastStepName = String(eastReceipt.stepName || "");
    state.eastStep1Ignited = truth.step1Ignited;
    state.eastStep1Ready = truth.step1Ready;
    state.eastFirstPaintReady = truth.firstPaintReady;
    state.eastMountReady = truth.mountReady;
    state.eastCockpitReady = truth.cockpitReady;
    state.eastSharedLedgerPresent = truth.sharedLedgerPresent;
    state.eastScriptOrderVisible = truth.scriptOrderVisible;
    state.eastPartialReceiptAvailable = bool(eastReceipt.partialReceiptAvailable, false);
    state.normalizedEastReceipt = normalizeReceipt("EAST", eastReceipt);

    const admissible = validateEastHandoff(eastReceipt);

    state.westAccepted = admissible;
    state.eastStep1Accepted = admissible;
    state.step1Accepted = admissible;
    state.step1HandoffAccepted = admissible;
    state.handoffAdmissible = admissible;
    state.westGateReady = admissible;
    state.northIntakeReady = admissible;

    if (admissible && !state.step1HandoffAcceptedAt) {
      state.step1HandoffAcceptedAt = nowIso();
    }

    if (admissible) {
      state.currentStage = "F5";
      state.highestStage = "F5";
      state.fibonacciStage = "F5";
      state.displayProgress = Math.max(state.displayProgress, 55);
      state.postgameStatus = "WEST_HANDOFF_ADMISSIBLE";
      state.firstFailedCoordinate = "WEST_READY_FOR_NORTH_INTAKE";
      state.recommendedNextOwner = "NORTH";
      state.recommendedNextFile = NORTH_FILE;
      state.recommendedNextRenewalTarget = NORTH_FILE;
      recordLocal("WEST_ACCEPTED_EAST_STEP1_HANDOFF", {
        source,
        eastContract: state.eastContract,
        acceptedAt: state.step1HandoffAcceptedAt
      });

      publishNorthIntake({ reason: "east-handoff-accepted", force: false });
    } else {
      deriveFailureCoordinate();
    }

    publishGlobals();
    return admissible;
  }

  function checkpointPayload(intake) {
    return {
      event: CHECKPOINT_EVENT,
      id: CHECKPOINT_EVENT,
      checkpointEvent: CHECKPOINT_EVENT,
      checkpointCandidate: CHECKPOINT_CANDIDATE,
      checkpointStage: CHECKPOINT_STAGE,
      fibonacciStage: CHECKPOINT_STAGE,

      owner: "WEST",
      from: "WEST",
      to: "NORTH",
      route: ROUTE,
      file: WEST_FILE,
      contract: CONTRACT,
      receipt: RECEIPT,
      cycleOrder: CYCLE_ORDER,

      westAccepted: true,
      eastStep1Accepted: true,
      step1Accepted: true,
      step1HandoffAccepted: true,
      handoffAdmissible: true,
      westGateReady: true,
      northIntakeReady: true,

      recommendedNextOwner: "NORTH",
      recommendedNextFile: NORTH_FILE,
      detail: clonePlain(intake || getWestToNorthIntakeReceipt())
    };
  }

  function tryNorthMethod(north, method, payload) {
    if (!north || !isFunction(north[method])) return { tried: false, accepted: false, result: null };

    try {
      const result = north[method](payload);
      const accepted = result !== false && !(isObject(result) && result.action === "HARD_BLOCK");
      return { tried: true, accepted, result };
    } catch (error) {
      const message = error && error.message ? error.message : String(error);
      recordError("NORTH_INTAKE_METHOD_FAILED", message, { method });
      return { tried: true, accepted: false, result: null, error: message };
    }
  }

  function attemptNorthIntake(reason = "one-shot") {
    if (disposed) return false;

    const intake = getWestToNorthIntakeReceipt();
    const north = getNorthApi();

    state.northGlobalPresent = Boolean(north);

    if (!state.northIntakePublished) {
      state.northIntakePublished = true;
    }

    if (!north) {
      state.northAcceptMethodPresent = false;
      state.northIntakeAccepted = false;
      state.northIntakeMethod = "";
      state.firstFailedCoordinate = "WAITING_NORTH_COMMAND_RUNTIME_TABLE";
      state.recommendedNextOwner = "NORTH";
      state.recommendedNextFile = NORTH_FILE;
      state.recommendedNextRenewalTarget = NORTH_FILE;
      state.postgameStatus = "WEST_SOFT_FAIL_NORTH_NOT_PRESENT";
      recordSoftGap("NORTH_COMMAND_TABLE_NOT_PRESENT", "West intake is published; North command table is not present yet.", {
        reason,
        northFile: NORTH_FILE
      });
      publishGlobals();
      return false;
    }

    state.northContract = String(north.contract || "");
    state.northReceiptPresent = Boolean(getNorthReceipt());
    state.normalizedNorthReceipt = normalizeReceipt("NORTH", getNorthReceipt());

    const directMethods = [
      ["acceptWestHandoff", intake],
      ["receiveWestHandoff", intake],
      ["acceptWestIntake", intake],
      ["receiveWestIntake", intake],
      ["acceptCheckpointEvent", checkpointPayload(intake)],
      ["receiveCheckpointEvent", checkpointPayload(intake)],
      ["submitEvent", checkpointPayload(intake)],
      ["receiveEvent", checkpointPayload(intake)]
    ];

    for (const [method, payload] of directMethods) {
      const attempt = tryNorthMethod(north, method, payload);

      if (!attempt.tried) continue;

      state.northAcceptMethodPresent = true;
      state.northIntakeMethod = method;

      if (attempt.accepted) {
        markNorthAccepted(method, attempt.result, reason);
        return true;
      }

      state.northIntakeAccepted = false;
      state.firstFailedCoordinate = "WAITING_NORTH_INTAKE_ACCEPTANCE";
      state.recommendedNextOwner = "NORTH";
      state.recommendedNextFile = NORTH_FILE;
      state.recommendedNextRenewalTarget = NORTH_FILE;
      state.postgameStatus = "WEST_SOFT_FAIL_NORTH_REJECTED_OR_HELD";
      recordSoftGap("NORTH_INTAKE_NOT_ACCEPTED", "North intake method was present but did not accept the intake.", {
        method,
        result: clonePlain(attempt.result),
        reason
      });
      publishGlobals();
      return false;
    }

    if (isFunction(north.createHearthCheckpointSession)) {
      state.northAcceptMethodPresent = true;
      state.northIntakeMethod = "createHearthCheckpointSession.submitEvent";

      try {
        const session = north.createHearthCheckpointSession({
          sessionId: "HEARTH-WEST-TO-NORTH-HANDOFF-SESSION",
          requestedBy: CONTRACT,
          westFile: WEST_FILE,
          northFile: NORTH_FILE,
          isolatedSession: false
        });

        if (session && isFunction(session.submitEvent)) {
          const result = session.submitEvent(checkpointPayload(intake));
          const accepted = result !== false && !(isObject(result) && result.action === "HARD_BLOCK");

          if (accepted) {
            markNorthAccepted("createHearthCheckpointSession.submitEvent", result, reason);
            return true;
          }

          state.northIntakeAccepted = false;
          state.firstFailedCoordinate = "WAITING_NORTH_INTAKE_ACCEPTANCE";
          state.recommendedNextOwner = "NORTH";
          state.recommendedNextFile = NORTH_FILE;
          state.recommendedNextRenewalTarget = NORTH_FILE;
          state.postgameStatus = "WEST_SOFT_FAIL_NORTH_SESSION_HELD";
          recordSoftGap("NORTH_SESSION_INTAKE_NOT_ACCEPTED", "North session accepted creation but did not accept the West checkpoint event.", {
            result: clonePlain(result),
            reason
          });
          publishGlobals();
          return false;
        }
      } catch (error) {
        const message = error && error.message ? error.message : String(error);
        state.northReceiptError = message;
        recordError("NORTH_SESSION_INTAKE_FAILED", message, { reason });
        publishGlobals();
        return false;
      }
    }

    state.northAcceptMethodPresent = false;
    state.northIntakeAccepted = false;
    state.northIntakeMethod = "";
    state.firstFailedCoordinate = "WAITING_NORTH_ACCEPT_METHOD";
    state.recommendedNextOwner = "NORTH";
    state.recommendedNextFile = NORTH_FILE;
    state.recommendedNextRenewalTarget = NORTH_FILE;
    state.postgameStatus = "WEST_SOFT_FAIL_NORTH_ACCEPT_METHOD_MISSING";
    recordSoftGap("NORTH_ACCEPT_METHOD_NOT_PRESENT", "North is present, but no compatible West-intake method is exposed.", {
      northContract: state.northContract,
      reason
    });
    publishGlobals();
    return false;
  }

  function markNorthAccepted(method, result, reason) {
    state.northAcceptMethodPresent = true;
    state.northIntakeAccepted = true;
    state.northIntakeAcceptedAt = nowIso();
    state.northIntakeMethod = method;
    state.currentStage = "F8";
    state.highestStage = "F8";
    state.fibonacciStage = "F8";
    state.displayProgress = Math.max(state.displayProgress, 68);
    state.firstFailedCoordinate = "NONE_WEST_HANDOFF_NORMALIZED_NORTH_ACCEPTED";
    state.recommendedNextOwner = "NORTH";
    state.recommendedNextFile = NORTH_FILE;
    state.recommendedNextRenewalTarget = NORTH_FILE;
    state.postgameStatus = "WEST_PASS_NORTH_ACCEPTED";

    recordLocal("NORTH_ACCEPTED_WEST_INTAKE", {
      method,
      reason,
      result: clonePlain(result)
    });

    publishGlobals();
  }

  function publishNorthIntake(options = {}) {
    if (disposed) return false;

    const force = Boolean(options.force);
    const reason = options.reason || "publishNorthIntake";

    if (!state.handoffAdmissible) {
      deriveFailureCoordinate();
      publishGlobals();
      return false;
    }

    state.northIntakePublished = true;
    state.northIntakeReady = true;
    state.recommendedNextOwner = "NORTH";
    state.recommendedNextFile = NORTH_FILE;
    state.recommendedNextRenewalTarget = NORTH_FILE;
    state.postgameStatus = "WEST_TO_NORTH_INTAKE_PUBLISHED";
    state.displayProgress = Math.max(state.displayProgress, 58);

    root.HEARTH_WEST_TO_NORTH_HANDOFF_RECEIPT = getWestToNorthIntakeReceipt();
    root.HEARTH_WEST_TO_NORTH_INTAKE_RECEIPT = root.HEARTH_WEST_TO_NORTH_HANDOFF_RECEIPT;

    recordLocal("WEST_TO_NORTH_INTAKE_PUBLISHED", {
      reason,
      force
    });

    if (force || !northAttemptedForCurrentHandoff) {
      northAttemptedForCurrentHandoff = true;
      return attemptNorthIntake(reason);
    }

    publishGlobals();
    return state.northIntakeAccepted;
  }

  function retryNorthIntake(reason = "manual-retry") {
    northAttemptedForCurrentHandoff = false;
    return publishNorthIntake({ reason, force: true });
  }

  function getWestToNorthIntakeReceipt() {
    return {
      contract: CONTRACT,
      receipt: "HEARTH_WEST_TO_NORTH_HANDOFF_RECEIPT_v2",
      sourceReceipt: RECEIPT,
      version: VERSION,
      owner: "WEST",
      file: WEST_FILE,
      route: ROUTE,
      role: state.role,
      cycleOrder: CYCLE_ORDER,

      previousDirection: "EAST",
      currentDirection: "WEST",
      nextDirection: "NORTH",

      stepReceived: 1,
      stepNormalized: 2,
      nextStep: 3,

      westAccepted: state.westAccepted,
      eastStep1Accepted: state.eastStep1Accepted,
      step1Accepted: state.step1Accepted,
      step1HandoffAccepted: state.step1HandoffAccepted,
      handoffAdmissible: state.handoffAdmissible,
      westGateReady: state.westGateReady,
      northIntakeReady: state.northIntakeReady,
      step1HandoffAcceptedAt: state.step1HandoffAcceptedAt,

      recommendedNextOwner: "NORTH",
      recommendedNextFile: NORTH_FILE,
      checkpointCandidate: CHECKPOINT_CANDIDATE,
      checkpointEvent: CHECKPOINT_EVENT,
      checkpointStage: CHECKPOINT_STAGE,
      northExpectedAction: "ACCEPT_INDEX_HANDOFF",

      northIntakePublished: state.northIntakePublished,
      northIntakeAccepted: state.northIntakeAccepted,
      northIntakeAcceptedAt: state.northIntakeAcceptedAt,
      northIntakeMethod: state.northIntakeMethod,
      northAcceptMethodPresent: state.northAcceptMethodPresent,
      northGlobalPresent: state.northGlobalPresent,
      northReceiptPresent: state.northReceiptPresent,

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

      quietRegistration: true,
      autoBoot: false,
      heartbeatLoop: false,
      watchdogLoop: false,
      repeatedNorthRetry: false,
      oneShotNorthIntake: true,
      manualRetryAvailable: true,

      westOwnsReceiptNormalization: true,
      westOwnsHandoffAdmissibility: true,
      westOwnsNorthRuntimeTable: false,
      westOwnsCanvas: false,
      westOwnsFinalCompletion: false,

      runtimeTableMutation: false,
      canvasMutation: false,
      sharedLedgerMutation: false,
      sourceAuthorityHeld: true,
      climateRouteRetired: true,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      publishedAt: nowIso()
    };
  }

  function acceptStep1Handoff(receipt) {
    const accepted = applyEastReceipt(receipt, "acceptStep1Handoff");
    return accepted ? getWestToNorthIntakeReceipt() : false;
  }

  function receiveEastStep1(receipt) {
    const accepted = applyEastReceipt(receipt, "receiveEastStep1");
    return accepted ? getWestToNorthIntakeReceipt() : false;
  }

  function acceptEastStep1(receipt) {
    const accepted = applyEastReceipt(receipt, "acceptEastStep1");
    return accepted ? getWestToNorthIntakeReceipt() : false;
  }

  function normalizeEastHandoff(receipt) {
    const accepted = applyEastReceipt(receipt, "normalizeEastHandoff");
    return accepted ? getWestToNorthIntakeReceipt() : false;
  }

  function refreshPassiveReceipts() {
    const north = getNorthApi();
    const south = getSouthApi();

    state.northGlobalPresent = Boolean(north);
    state.southGlobalPresent = Boolean(south);

    if (north) state.northContract = String(north.contract || "");
    if (south) state.southContract = String(south.contract || "");

    state.northReceiptPresent = Boolean(getNorthReceipt());
    state.southReceiptPresent = Boolean(getSouthReceipt());

    state.normalizedNorthReceipt = normalizeReceipt("NORTH", getNorthReceipt());
    state.normalizedSouthReceipt = normalizeReceipt("SOUTH", getSouthReceipt());
    state.normalizedWestReceipt = normalizeReceipt("WEST", getReceiptLight());
    state.normalizedReceiptsReady = Boolean(state.normalizedEastReceipt && state.normalizedWestReceipt);
  }

  function passiveScanExistingEastOnce(reason = "passive-existing-east-scan") {
    if (disposed) return false;

    const east = getEastReceipt();

    if (!east || !isObject(east)) {
      state.eastReceiptPresent = false;
      deriveFailureCoordinate();
      publishGlobals();
      return false;
    }

    return applyEastReceipt(east, reason);
  }

  function deriveFailureCoordinate() {
    if (state.hardBlocked) {
      state.firstFailedCoordinate = state.hardBlockReason || "WEST_HARD_BLOCKED";
      state.recommendedNextOwner = "WEST";
      state.recommendedNextFile = WEST_FILE;
      state.recommendedNextRenewalTarget = WEST_FILE;
      state.postgameStatus = "WEST_HARD_BLOCKED";
      return;
    }

    if (!state.eastReceiptPresent) {
      state.firstFailedCoordinate = "WAITING_EAST_STEP1_HANDOFF";
      state.recommendedNextOwner = "EAST";
      state.recommendedNextFile = EAST_FILE;
      state.recommendedNextRenewalTarget = EAST_FILE;
      state.postgameStatus = "WEST_REGISTERED_WAITING_EAST";
      return;
    }

    if (!state.handoffAdmissible) {
      state.firstFailedCoordinate = "WAITING_EAST_HANDOFF_ADMISSIBILITY";
      state.recommendedNextOwner = "EAST";
      state.recommendedNextFile = EAST_FILE;
      state.recommendedNextRenewalTarget = EAST_FILE;
      state.postgameStatus = "WEST_SOFT_FAIL_EAST_HANDOFF_INCOMPLETE";
      return;
    }

    if (!state.northIntakePublished) {
      state.firstFailedCoordinate = "WAITING_WEST_TO_NORTH_INTAKE_PUBLICATION";
      state.recommendedNextOwner = "WEST";
      state.recommendedNextFile = WEST_FILE;
      state.recommendedNextRenewalTarget = WEST_FILE;
      state.postgameStatus = "WEST_READY_TO_PUBLISH_NORTH_INTAKE";
      return;
    }

    if (!state.northGlobalPresent) {
      state.firstFailedCoordinate = "WAITING_NORTH_COMMAND_RUNTIME_TABLE";
      state.recommendedNextOwner = "NORTH";
      state.recommendedNextFile = NORTH_FILE;
      state.recommendedNextRenewalTarget = NORTH_FILE;
      state.postgameStatus = "WEST_SOFT_FAIL_NORTH_NOT_PRESENT";
      return;
    }

    if (!state.northAcceptMethodPresent) {
      state.firstFailedCoordinate = "WAITING_NORTH_ACCEPT_METHOD";
      state.recommendedNextOwner = "NORTH";
      state.recommendedNextFile = NORTH_FILE;
      state.recommendedNextRenewalTarget = NORTH_FILE;
      state.postgameStatus = "WEST_SOFT_FAIL_NORTH_ACCEPT_METHOD_MISSING";
      return;
    }

    if (!state.northIntakeAccepted) {
      state.firstFailedCoordinate = "WAITING_NORTH_INTAKE_ACCEPTANCE";
      state.recommendedNextOwner = "NORTH";
      state.recommendedNextFile = NORTH_FILE;
      state.recommendedNextRenewalTarget = NORTH_FILE;
      state.postgameStatus = "WEST_SOFT_FAIL_NORTH_INTAKE_HELD";
      return;
    }

    state.firstFailedCoordinate = "NONE_WEST_HANDOFF_NORMALIZED_NORTH_ACCEPTED";
    state.recommendedNextOwner = "NORTH";
    state.recommendedNextFile = NORTH_FILE;
    state.recommendedNextRenewalTarget = NORTH_FILE;
    state.postgameStatus = "WEST_PASS_NORTH_ACCEPTED";
  }

  function computeProgress() {
    let progress = 48;

    if (state.eastReceiptPresent) progress = Math.max(progress, 50);
    if (state.handoffAdmissible) progress = Math.max(progress, 55);
    if (state.northIntakePublished) progress = Math.max(progress, 58);
    if (state.northGlobalPresent) progress = Math.max(progress, 62);
    if (state.northAcceptMethodPresent) progress = Math.max(progress, 64);
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
      "Hearth West quiet handoff registration active.",
      `Contract ${CONTRACT}`,
      `Receipt ${RECEIPT}`,
      `Previous ${PREVIOUS_CONTRACT}`,
      `File ${WEST_FILE}`,
      `Cycle ${CYCLE_ORDER}`,
      `Quiet registration true`,
      `Auto boot false`,
      `Heartbeat loop false`,
      `Watchdog loop false`,
      `Repeated North retry false`,
      `East receipt present ${state.eastReceiptPresent}`,
      `West accepted ${state.westAccepted}`,
      `East Step 1 accepted ${state.eastStep1Accepted}`,
      `Handoff admissible ${state.handoffAdmissible}`,
      `West gate ready ${state.westGateReady}`,
      `North intake ready ${state.northIntakeReady}`,
      `North intake published ${state.northIntakePublished}`,
      `North global present ${state.northGlobalPresent}`,
      `North accept method present ${state.northAcceptMethodPresent}`,
      `North intake accepted ${state.northIntakeAccepted}`,
      `North intake method ${state.northIntakeMethod}`,
      `Checkpoint event ${CHECKPOINT_EVENT}`,
      `Checkpoint candidate ${CHECKPOINT_CANDIDATE}`,
      `Hard blocked ${state.hardBlocked}`,
      `First failed coordinate ${state.firstFailedCoordinate}`,
      `Recommended next owner ${state.recommendedNextOwner}`,
      `Recommended next file ${state.recommendedNextFile}`,
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

    dataset.hearthWestQuietRegistration = "true";
    dataset.hearthWestAutoBoot = "false";
    dataset.hearthWestHeartbeatLoop = "false";
    dataset.hearthWestWatchdogLoop = "false";
    dataset.hearthWestRepeatedNorthRetry = "false";
    dataset.hearthWestOneShotNorthIntake = "true";
    dataset.hearthWestManualRetryAvailable = "true";

    dataset.hearthWestOwnsHandoffAdmissibility = "true";
    dataset.hearthWestOwnsReceiptNormalization = "true";
    dataset.hearthWestOwnsNorthRuntimeTable = "false";
    dataset.hearthWestOwnsCanvas = "false";
    dataset.hearthWestOwnsFinalCompletion = "false";

    dataset.hearthWestAccepted = String(state.westAccepted);
    dataset.hearthEastStep1Accepted = String(state.eastStep1Accepted);
    dataset.hearthStep1Accepted = String(state.step1Accepted);
    dataset.hearthStep1HandoffAccepted = String(state.step1HandoffAccepted);
    dataset.hearthHandoffAdmissible = String(state.handoffAdmissible);
    dataset.hearthWestGateReady = String(state.westGateReady);
    dataset.hearthNorthIntakeReady = String(state.northIntakeReady);

    dataset.hearthNorthIntakePublished = String(state.northIntakePublished);
    dataset.hearthNorthIntakeAccepted = String(state.northIntakeAccepted);
    dataset.hearthNorthAcceptMethodPresent = String(state.northAcceptMethodPresent);
    dataset.hearthNorthIntakeMethod = state.northIntakeMethod;
    dataset.hearthNorthGlobalPresent = String(state.northGlobalPresent);
    dataset.hearthSouthGlobalPresent = String(state.southGlobalPresent);

    dataset.hearthCheckpointEvent = CHECKPOINT_EVENT;
    dataset.hearthCheckpointCandidate = CHECKPOINT_CANDIDATE;
    dataset.hearthCheckpointStage = CHECKPOINT_STAGE;

    dataset.hearthWestHardBlocked = String(state.hardBlocked);
    dataset.hearthWestHardBlockReason = state.hardBlockReason;
    dataset.hearthWestForwardProgressAllowedWithGaps = String(state.forwardProgressAllowedWithGaps);
    dataset.hearthWestSoftGapGovernor = String(state.softGapGovernor);

    dataset.hearthWestFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthWestRecommendedNextOwner = state.recommendedNextOwner;
    dataset.hearthWestRecommendedNextFile = state.recommendedNextFile;
    dataset.hearthWestRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    dataset.hearthRuntimeTableMutation = "false";
    dataset.hearthCanvasMutation = "false";
    dataset.hearthSharedLedgerMutation = "false";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function publishGlobals() {
    refreshPassiveReceipts();

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
    deriveFailureCoordinate();

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

      quietRegistration: true,
      autoBoot: false,
      heartbeatLoop: false,
      watchdogLoop: false,
      repeatedNorthRetry: false,
      oneShotNorthIntake: true,
      manualRetryAvailable: true,

      westAccepted: state.westAccepted,
      eastStep1Accepted: state.eastStep1Accepted,
      step1Accepted: state.step1Accepted,
      step1HandoffAccepted: state.step1HandoffAccepted,
      handoffAdmissible: state.handoffAdmissible,
      westGateReady: state.westGateReady,
      northIntakeReady: state.northIntakeReady,
      step1HandoffAcceptedAt: state.step1HandoffAcceptedAt,

      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      checkpointCandidate: CHECKPOINT_CANDIDATE,
      checkpointEvent: CHECKPOINT_EVENT,
      checkpointStage: CHECKPOINT_STAGE,
      northExpectedAction: "ACCEPT_INDEX_HANDOFF",

      eastReceiptPresent: state.eastReceiptPresent,
      eastReceiptSource: state.eastReceiptSource,
      eastContract: state.eastContract,
      eastReceiptName: state.eastReceiptName,
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
      northIntakeMethod: state.northIntakeMethod,
      northAcceptMethodPresent: state.northAcceptMethodPresent,
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

      sharedLedgerPresent: Boolean(root.HEARTH_LOAD_LEDGER),
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

      registeredAt: state.registeredAt,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
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
      "HEARTH_WEST_INDEX_HANDOFF_QUIET_REGISTRATION_NORTH_INTAKE_RECEIPT",
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
      `quietRegistration=${receipt.quietRegistration}`,
      `autoBoot=${receipt.autoBoot}`,
      `heartbeatLoop=${receipt.heartbeatLoop}`,
      `watchdogLoop=${receipt.watchdogLoop}`,
      `repeatedNorthRetry=${receipt.repeatedNorthRetry}`,
      `oneShotNorthIntake=${receipt.oneShotNorthIntake}`,
      `manualRetryAvailable=${receipt.manualRetryAvailable}`,
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
      `ownsNorthRuntimeTable=${receipt.ownsNorthRuntimeTable}`,
      `ownsCheckpointLaw=${receipt.ownsCheckpointLaw}`,
      `ownsCanvasDrawing=${receipt.ownsCanvasDrawing}`,
      `ownsVisiblePlanetProof=${receipt.ownsVisiblePlanetProof}`,
      `ownsCompletionLatch=${receipt.ownsCompletionLatch}`,
      `ownsFinalVisualPassClaim=${receipt.ownsFinalVisualPassClaim}`,
      "",
      `eastFile=${receipt.eastFile}`,
      `westFile=${receipt.westFile}`,
      `northFile=${receipt.northFile}`,
      `southFile=${receipt.southFile}`,
      `canvasFile=${receipt.canvasFile}`,
      "",
      `eastReceiptPresent=${receipt.eastReceiptPresent}`,
      `eastReceiptSource=${receipt.eastReceiptSource}`,
      `eastContract=${receipt.eastContract}`,
      `eastReceiptName=${receipt.eastReceiptName}`,
      `eastStep1Ignited=${receipt.eastStep1Ignited}`,
      `eastStep1Ready=${receipt.eastStep1Ready}`,
      `eastFirstPaintReady=${receipt.eastFirstPaintReady}`,
      `eastMountReady=${receipt.eastMountReady}`,
      `eastCockpitReady=${receipt.eastCockpitReady}`,
      `eastSharedLedgerPresent=${receipt.eastSharedLedgerPresent}`,
      `eastScriptOrderVisible=${receipt.eastScriptOrderVisible}`,
      "",
      `westAccepted=${receipt.westAccepted}`,
      `eastStep1Accepted=${receipt.eastStep1Accepted}`,
      `step1Accepted=${receipt.step1Accepted}`,
      `step1HandoffAccepted=${receipt.step1HandoffAccepted}`,
      `handoffAdmissible=${receipt.handoffAdmissible}`,
      `westGateReady=${receipt.westGateReady}`,
      `northIntakeReady=${receipt.northIntakeReady}`,
      `step1HandoffAcceptedAt=${receipt.step1HandoffAcceptedAt}`,
      "",
      `recommendedNextOwner=${receipt.recommendedNextOwner}`,
      `recommendedNextFile=${receipt.recommendedNextFile}`,
      `checkpointCandidate=${receipt.checkpointCandidate}`,
      `checkpointEvent=${receipt.checkpointEvent}`,
      `checkpointStage=${receipt.checkpointStage}`,
      `northExpectedAction=${receipt.northExpectedAction}`,
      "",
      `northIntakePublished=${receipt.northIntakePublished}`,
      `northIntakeAccepted=${receipt.northIntakeAccepted}`,
      `northIntakeAcceptedAt=${receipt.northIntakeAcceptedAt}`,
      `northIntakeMethod=${receipt.northIntakeMethod}`,
      `northAcceptMethodPresent=${receipt.northAcceptMethodPresent}`,
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
      `registeredAt=${receipt.registeredAt}`,
      `updatedAt=${receipt.updatedAt}`
    ].join("\n");
  }

  function dispose(reason = "manual-dispose") {
    disposed = true;
    recordLocal("WEST_QUIET_HANDOFF_DISPOSED", { reason });
    publishGlobals();
    return getReceiptLight();
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    route: ROUTE,
    file: WEST_FILE,
    role: "west-index-handoff-quiet-registration-north-intake",

    acceptStep1Handoff,
    receiveEastStep1,
    acceptEastStep1,
    normalizeEastHandoff,

    publishNorthIntake,
    retryNorthIntake,
    getWestToNorthIntakeReceipt,
    getReceipt,
    getReceiptText,
    dispose,

    boot: passiveScanExistingEastOnce,
    start: passiveScanExistingEastOnce,
    init: passiveScanExistingEastOnce,
    run: passiveScanExistingEastOnce,

    supportsDirectionalCycle: true,
    supportsWestHandoffAdmissibility: true,
    supportsReceiptNormalization: true,
    supportsWestToNorthIntakePublication: true,
    supportsSoftGapGovernor: true,
    supportsHardBlockKillConditions: true,
    supportsQuietRegistration: true,
    supportsOneShotNorthIntake: true,
    supportsManualRetry: true,

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

    quietRegistration: true,
    autoBoot: false,
    heartbeatLoop: false,
    watchdogLoop: false,
    repeatedNorthRetry: false,
    oneShotNorthIntake: true,
    manualRetryAvailable: true,

    runtimeTableMutation: false,
    canvasMutation: false,
    sharedLedgerMutation: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  state.registeredAt = nowIso();
  state.updatedAt = state.registeredAt;

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.westIndexHandoffTable = api;
  root.HEARTH.westHandoffAdmissibility = api;

  root.HEARTH_WEST_INDEX_HANDOFF_TABLE = api;
  root.HEARTH_WEST_HANDOFF_ADMISSIBILITY = api;
  root.HEARTH_WEST_CYCLE_HANDOFF = api;

  publishGlobals();
  passiveScanExistingEastOnce("quiet-registration-existing-east-receipt-scan");

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

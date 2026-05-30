// /assets/hearth/hearth.north.command.runtime-table.js
// HEARTH_NORTH_COMMAND_RUNTIME_TABLE_CYCLICAL_CHECKPOINT_TNT_v1
// Full-file replacement.
// North authority only.
// Purpose:
// - Govern the Hearth directional cycle as cyclical checkpoint governance, not linear checkpoint blocking.
// - Own local Hearth command law for East → West → North → South → Checkpoint → East.
// - Classify checkpoint states as PASS / WARN / QUEUE / RETRY / HARD_BLOCK.
// - Preserve fast gap assessment while allowing lawful forward progress unless a kill condition exists.
// - Provide local command runtime table/session APIs for South without mutating /assets/lab/runtime-table.js.
// - Preserve NEWS/Fibonacci alignment and F21 eligibility law.
// Does not own:
// - East Step 1 ignition / first paint / mount creation
// - West Step 1 handoff validation implementation
// - South visible drawing / canvas pixel generation / inspect UI execution
// - universal /assets/lab/runtime-table.js
// - source-stack truth
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_NORTH_COMMAND_RUNTIME_TABLE_CYCLICAL_CHECKPOINT_TNT_v1";
  const RECEIPT = "HEARTH_NORTH_COMMAND_RUNTIME_TABLE_CYCLICAL_CHECKPOINT_RECEIPT_v1";
  const BASELINE_CONTRACT = "HEARTH_DIRECTIONAL_CYCLICAL_CHECKPOINT_GOVERNANCE_PRECODE_FINAL_DRAFT_v1";
  const VERSION = "2026-05-29.hearth-north-command-runtime-table-cyclical-checkpoint-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const ROUTE = "/showroom/globe/hearth/";
  const EAST_FILE = "/showroom/globe/hearth/index.js";
  const WEST_FILE = "/assets/hearth/hearth.west.index-handoff.table.js";
  const NORTH_FILE = "/assets/hearth/hearth.north.command.runtime-table.js";
  const SOUTH_FILE = "/showroom/globe/hearth/hearth.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const UNIVERSAL_RUNTIME_TABLE_FILE = "/assets/lab/runtime-table.js";

  const CYCLE_ORDER = Object.freeze(["EAST", "WEST", "NORTH", "SOUTH", "CHECKPOINT"]);

  const STATUS = Object.freeze({
    PASS: "PASS",
    WARN: "WARN",
    QUEUE: "QUEUE",
    RETRY: "RETRY",
    HARD_BLOCK: "HARD_BLOCK",
    ARCHIVE: "ARCHIVE",
    ADMIT: "ADMIT"
  });

  const GAP_CLASS = Object.freeze({
    NONE: "none",
    SOFT: "soft",
    STRUCTURAL: "structural",
    SOFT_STRUCTURAL: "soft-structural",
    KILL: "kill"
  });

  const SOURCE_STACK_HELD = Object.freeze([
    "/assets/hearth/hearth.tectonics.js",
    "/assets/hearth/hearth.elevation.js",
    "/assets/hearth/hearth.composition.js",
    "/assets/hearth/hearth.hydrology.js",
    "/assets/hearth/hearth.materials.js",
    "/assets/hearth/hearth.hex.four-pair.authority.js",
    "/assets/hearth/hearth.hex.surface.js",
    UNIVERSAL_RUNTIME_TABLE_FILE
  ]);

  const CHECKPOINTS = Object.freeze([
    {
      id: "S2_INDEX_HANDOFF_ACCEPTED",
      step: 2,
      rank: 1,
      owner: "WEST",
      fibonacci: "F3",
      event: "INDEX_HANDOFF_ACCEPTED",
      aliases: ["WEST_HANDOFF_ADMISSIBLE", "WEST_HANDOFF_ACCEPTED", "HANDOFF_ADMISSIBLE", "STEP1_HANDOFF_ACCEPTED"],
      progress: 36,
      label: "West-confirmed East Step 1 handoff accepted"
    },
    {
      id: "S3_AUTHORITY_AVAILABILITY_READY",
      step: 3,
      rank: 2,
      owner: "NORTH",
      fibonacci: "F5",
      event: "AUTHORITY_AVAILABILITY_READY",
      aliases: ["AUTHORITY_READY", "SOURCE_AUTHORITY_READY"],
      progress: 55,
      label: "Authority availability ready"
    },
    {
      id: "S4_RUNTIME_TABLE_SESSION_READY",
      step: 4,
      rank: 3,
      owner: "NORTH",
      fibonacci: "F8",
      event: "RUNTIME_TABLE_SESSION_READY",
      aliases: ["COMMAND_RUNTIME_TABLE_READY", "NORTH_RUNTIME_TABLE_READY", "CHECKPOINT_SESSION_READY"],
      progress: 72,
      label: "North runtime-table checkpoint session ready"
    },
    {
      id: "S5_CANVAS_COORDINATION_STARTED",
      step: 5,
      rank: 4,
      owner: "SOUTH",
      fibonacci: "F13A",
      event: "CANVAS_COORDINATION_STARTED",
      aliases: ["CANVAS_COOPERATIVE_BOOT_STARTED", "CANVAS_CARRIER_REQUESTED"],
      progress: 78,
      label: "South canvas coordination started"
    },
    {
      id: "S6_CANVAS_MOUNT_CONFIRMED",
      step: 6,
      rank: 5,
      owner: "SOUTH",
      fibonacci: "F13B",
      event: "CANVAS_MOUNT_CONFIRMED",
      aliases: ["CANVAS_MOUNT_CREATED", "CANVAS_CARRIER_MOUNTED"],
      progress: 81,
      label: "Canvas mount confirmed"
    },
    {
      id: "S7_CANVAS_CONTEXT_READY",
      step: 7,
      rank: 6,
      owner: "SOUTH",
      fibonacci: "F13C",
      event: "CANVAS_CONTEXT_READY",
      aliases: ["CANVAS_CONTEXT_CONFIRMED"],
      progress: 84,
      label: "Canvas context ready"
    },
    {
      id: "S8_DRAG_INSPECTION_BOUND",
      step: 8,
      rank: 7,
      owner: "SOUTH",
      fibonacci: "F13D",
      event: "DRAG_INSPECTION_BOUND",
      aliases: ["INSPECTION_DRAG_BOUND", "POINTER_CONTROLS_BOUND"],
      progress: 86,
      label: "Drag inspection bound"
    },
    {
      id: "S9_ATLAS_TEXTURE_FRAME_READY",
      step: 9,
      rank: 8,
      owner: "SOUTH",
      fibonacci: "F13E",
      event: "ATLAS_TEXTURE_FRAME_READY",
      aliases: [
        "ATLAS_BUILD_COMPLETE",
        "TEXTURE_COMPOSE_COMPLETE",
        "FIRST_FRAME_DETECTED",
        "IMAGE_RENDERED",
        "CANVAS_READY"
      ],
      progress: 93,
      label: "Atlas, texture, and first frame ready"
    },
    {
      id: "S10_VISIBLE_CONTENT_PROOF_PASSED",
      step: 10,
      rank: 9,
      owner: "SOUTH",
      fibonacci: "F13F",
      event: "VISIBLE_CONTENT_PROOF_PASSED",
      aliases: ["VISIBLE_PLANET_PROOF_PASSED", "VISIBLE_CONTENT_PROOF"],
      progress: 98,
      label: "Visible content proof passed"
    },
    {
      id: "S11_INSPECT_MODE_READY",
      step: 11,
      rank: 10,
      owner: "SOUTH",
      fibonacci: "F13G",
      event: "INSPECT_MODE_READY",
      aliases: ["INSPECT_PLANET_READY", "DIAGNOSTIC_CAN_LEAVE_PLANET_FRAME"],
      progress: 98,
      label: "Inspect mode ready"
    },
    {
      id: "F21_COMPLETION_LATCHED",
      step: 21,
      rank: 11,
      owner: "CHECKPOINT",
      fibonacci: "F21",
      event: "COMPLETION_LATCHED",
      aliases: ["F21_COMPLETION_LATCHED", "SOUTH_COMPLETION_LATCHED"],
      progress: 100,
      label: "F21 completion latched"
    }
  ]);

  const CHECKPOINT_BY_EVENT = Object.freeze(
    CHECKPOINTS.reduce((map, checkpoint) => {
      map[checkpoint.event] = checkpoint;
      map[checkpoint.id] = checkpoint;

      checkpoint.aliases.forEach((alias) => {
        map[alias] = checkpoint;
      });

      return map;
    }, Object.create(null))
  );

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: NORTH_FILE,
    route: ROUTE,
    role: "north-command-runtime-table",

    canonicalPhrase: "CYCLICAL CHECKPOINT GOVERNANCE, NOT LINEAR CHECKPOINT BLOCKING",
    cycleOrder: CYCLE_ORDER.slice(),
    cycleFormula: "EAST -> WEST -> NORTH -> SOUTH -> CHECKPOINT -> EAST",

    ownsNorth: true,
    ownsEast: false,
    ownsWest: false,
    ownsSouth: false,
    ownsStep1: false,
    ownsSteps2Through11: true,
    ownsCheckpointLaw: true,
    ownsNewsFibonacciGovernance: true,
    ownsSoftGapDecisions: true,
    ownsF21Eligibility: true,
    ownsUniversalRuntimeTable: false,
    ownsCanvasDrawing: false,
    ownsFinalVisualPassClaim: false,

    eastFile: EAST_FILE,
    westFile: WEST_FILE,
    northFile: NORTH_FILE,
    southFile: SOUTH_FILE,
    canvasFile: CANVAS_FILE,

    gapAssessmentFast: true,
    hardBlockMode: false,
    softGapGovernor: true,
    forwardProgressAllowedWithGaps: true,
    blockedProgressCap: 98,
    readyTextRequiresF21: true,

    checkpointBrainActive: true,
    chronologicalFibonacciAlignment: true,
    newsFibonacciAlignment: true,
    oneActiveCheckpointAtATime: true,
    futureEventsQueued: true,
    completedEventsArchived: true,
    regressiveEventsBlocked: true,

    defaultSessionId: "",
    sessionCreated: false,
    activeCheckpointId: "S2_INDEX_HANDOFF_ACCEPTED",
    activeCheckpointRank: 1,
    activeFibonacciStage: "F3",
    completedCheckpoints: [],
    highestCompletedCheckpointId: "",
    highestCompletedRank: 0,

    queuedEventsCount: 0,
    admittedEventsCount: 0,
    archivedEventsCount: 0,
    blockedEventsCount: 0,
    retryEventsCount: 0,
    warningEventsCount: 0,
    gapEventsCount: 0,

    currentCycleId: "HEARTH-CYCLE-0001",
    currentOwner: "WEST",
    lastOwner: "",
    recommendedNextOwner: "WEST",
    recommendedNextFile: WEST_FILE,
    checkpointStatus: STATUS.WARN,
    gapDetected: true,
    gapClass: GAP_CLASS.SOFT_STRUCTURAL,
    firstGapCode: "WAITING_WEST_HANDOFF_ADMISSIBILITY",
    firstFailedCoordinate: "WAITING_WEST_HANDOFF_ADMISSIBILITY",
    recommendedNextRenewalTarget: WEST_FILE,

    currentStage: "F3",
    highestStage: "F3",
    mainDisplayProgress: 36,
    mainProgressCap: 98,
    completionLatched: false,
    f21Allowed: false,
    f21AfterS11: false,
    finalReceiptAvailable: false,

    eastReceiptPresent: false,
    eastStep1Complete: false,
    eastIgnitionComplete: false,
    westReceiptPresent: false,
    westAdmissibilityComplete: false,
    handoffAdmissible: false,
    handoffNormalized: false,

    northCheckpointAuthorityReady: true,
    northRuntimeTableReady: true,

    southVisibleCompletionReady: false,
    southReceiptPresent: false,
    southInspectReady: false,

    newsProtocolActive: true,
    northGateReady: true,
    eastGateReady: false,
    westGateReady: false,
    southGateReady: false,
    newsGatePassedBeforeF21: false,

    mountReady: false,
    cockpitFound: false,
    copyDiagnosticReady: false,
    receiptToggleReady: false,
    inspectPlanetControlReady: false,
    showDiagnosticTabReady: false,
    diagnosticCanLeavePlanetFrame: false,

    runtimeTablePresent: true,
    runtimeTableMode: "HEARTH_NORTH_LOCAL_RUNTIME_TABLE_READY",
    runtimeTableMutation: false,
    universalRuntimeTableMutation: false,

    canvasApiPresent: false,
    canvasReady: false,
    canvasCarrierMounted: false,
    canvasContextReady: false,
    dragInspectionBound: false,
    atlasBuildComplete: false,
    textureComposeComplete: false,
    firstFrameDetected: false,
    imageRendered: false,
    visibleContentProof: false,
    visiblePlanetAvailable: false,
    planetCanvasPresent: false,
    planetCanvasNonZeroSize: false,
    planetFramePainted: false,
    nonblankPlanetVisible: false,

    sourceAuthorityHeld: true,
    climateRouteRetired: true,
    canvasMutation: false,

    sessionsCreated: 0,
    cycleReceipts: [],
    eventLog: [],
    gapEvents: [],
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

  let defaultSession = null;
  let heartbeatTimer = 0;

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

  function number(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function clonePlain(value) {
    if (!isObject(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function padNumber(value, length = 4) {
    return String(value).padStart(length, "0");
  }

  function checkpointByEvent(eventName) {
    return CHECKPOINT_BY_EVENT[String(eventName || "")] || null;
  }

  function checkpointById(id) {
    return CHECKPOINT_BY_EVENT[String(id || "")] || null;
  }

  function getDataset() {
    return doc && doc.documentElement ? doc.documentElement.dataset : {};
  }

  function firstObject(list) {
    for (const item of list) {
      if (isObject(item)) return item;
    }

    return null;
  }

  function getEastReceipt() {
    return firstObject([
      root.HEARTH_EAST_STEP1_HANDOFF_RECEIPT,
      root.HEARTH_INDEX_STEP1_HANDOFF_RECEIPT,
      root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR_RECEIPT,
      root.HEARTH_INDEX_BRIDGE_RECEIPT,
      root.HEARTH_INDEX_JS_RECEIPT,
      root.HEARTH && root.HEARTH.indexConstraintSemiconductor && isFunction(root.HEARTH.indexConstraintSemiconductor.getReceipt)
        ? safeCall(() => root.HEARTH.indexConstraintSemiconductor.getReceipt())
        : null,
      root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR && isFunction(root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR.getReceipt)
        ? safeCall(() => root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR.getReceipt())
        : null
    ]);
  }

  function getWestReceipt() {
    return firstObject([
      root.HEARTH_WEST_HANDOFF_ADMISSIBILITY_RECEIPT,
      root.HEARTH_WEST_INDEX_HANDOFF_TABLE_RECEIPT,
      root.HEARTH_WEST_INDEX_HANDOFF_ADMISSIBILITY_TABLE && isFunction(root.HEARTH_WEST_INDEX_HANDOFF_ADMISSIBILITY_TABLE.getReceipt)
        ? safeCall(() => root.HEARTH_WEST_INDEX_HANDOFF_ADMISSIBILITY_TABLE.getReceipt())
        : null,
      root.HEARTH && root.HEARTH.westIndexHandoffTable && isFunction(root.HEARTH.westIndexHandoffTable.getReceipt)
        ? safeCall(() => root.HEARTH.westIndexHandoffTable.getReceipt())
        : null
    ]);
  }

  function getSouthReceipt() {
    return firstObject([
      root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT,
      root.HEARTH_ROUTE_VISIBLE_COMPLETION_RECEIPT,
      root.HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR_RECEIPT,
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT,
      root.HEARTH_ROUTE_CONDUCTOR_POSTGAME_RECEIPT,
      root.HEARTH_ROUTE_CONDUCTOR && isFunction(root.HEARTH_ROUTE_CONDUCTOR.getReceipt)
        ? safeCall(() => root.HEARTH_ROUTE_CONDUCTOR.getReceipt())
        : null,
      root.HEARTH && root.HEARTH.routeConductor && isFunction(root.HEARTH.routeConductor.getReceipt)
        ? safeCall(() => root.HEARTH.routeConductor.getReceipt())
        : null
    ]);
  }

  function getCanvasReceipt() {
    const canvasApi = getCanvasApi();

    return firstObject([
      canvasApi && isFunction(canvasApi.getReceipt)
        ? safeCall(() => canvasApi.getReceipt("hearth-north-command-runtime-table"))
        : null,
      root.HEARTH_CANVAS_POSTGAME_RECEIPT,
      root.HEARTH_CANVAS_RECEIPT,
      root.HEARTH_HEX_BODY_BOUNDARY_CANVAS_RECEIPT_EXPORT
    ]);
  }

  function getCanvasApi() {
    return (
      root.HEARTH_CANVAS ||
      root.HearthCanvas ||
      (root.HEARTH && root.HEARTH.canvas) ||
      null
    );
  }

  function safeCall(fn) {
    try {
      return fn();
    } catch (_error) {
      return null;
    }
  }

  function readBoolean(source, keys, fallback = false) {
    if (!isObject(source)) return fallback;

    for (const key of keys) {
      if (source[key] === true || source[key] === "true") return true;
      if (source[key] === false || source[key] === "false") return false;
    }

    return fallback;
  }

  function readString(source, keys, fallback = "") {
    if (!isObject(source)) return fallback;

    for (const key of keys) {
      if (source[key] !== undefined && source[key] !== null && source[key] !== "") {
        return String(source[key]);
      }
    }

    return fallback;
  }

  function recordEvent(type, detail = {}) {
    const item = {
      at: nowIso(),
      type,
      detail: clonePlain(detail)
    };

    state.eventLog.push(item);
    if (state.eventLog.length > 220) {
      state.eventLog.splice(0, state.eventLog.length - 220);
    }

    state.updatedAt = item.at;
    return item;
  }

  function recordGap(code, message, options = {}) {
    const item = {
      at: nowIso(),
      code,
      message,
      hardBlocked: options.hardBlocked === true,
      forwardProgressAllowed: options.forwardProgressAllowed !== false,
      owner: options.owner || state.currentOwner || "NORTH",
      gapClass: options.gapClass || GAP_CLASS.SOFT,
      recommendedNextOwner: options.recommendedNextOwner || state.recommendedNextOwner,
      recommendedNextFile: options.recommendedNextFile || state.recommendedNextFile
    };

    state.gapEvents.push(item);
    if (state.gapEvents.length > 120) {
      state.gapEvents.splice(0, state.gapEvents.length - 120);
    }

    if (item.hardBlocked) {
      state.hardBlockEvents.push(item);
      if (state.hardBlockEvents.length > 60) {
        state.hardBlockEvents.splice(0, state.hardBlockEvents.length - 60);
      }
    } else {
      state.softGapEvents.push(item);
      if (state.softGapEvents.length > 100) {
        state.softGapEvents.splice(0, state.softGapEvents.length - 100);
      }
    }

    state.gapEventsCount += 1;
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

  function findMount() {
    if (!doc) return null;

    return (
      doc.getElementById("hearthCanvasMount") ||
      doc.querySelector("[data-hearth-canvas-mount='true']") ||
      doc.querySelector("[data-hearth-canvas-mount]")
    );
  }

  function findCockpit() {
    if (!doc) return null;

    return (
      doc.getElementById("hearthLoadCockpit") ||
      doc.querySelector("[data-hearth-load-cockpit='true']") ||
      doc.querySelector("[data-hearth-first-paint-cockpit='true']") ||
      doc.querySelector(".hearth-ledger-cockpit")
    );
  }

  function findPlanetCanvas() {
    if (!doc) return null;

    const mount = findMount();

    return (
      (mount && mount.querySelector("canvas")) ||
      doc.querySelector("#hearthCanvasMount canvas") ||
      doc.querySelector("[data-hearth-canvas-mount='true'] canvas")
    );
  }

  function detectScriptPresence(srcPart) {
    if (!doc) return false;

    return Array.from(doc.scripts || []).some((script) => {
      const src = script.getAttribute("src") || "";
      return src.includes(srcPart);
    });
  }

  function buildSystemSnapshot(extra = {}) {
    const dataset = getDataset();
    const east = getEastReceipt();
    const west = getWestReceipt();
    const south = getSouthReceipt();
    const canvasReceipt = getCanvasReceipt();
    const canvasApi = getCanvasApi();
    const mount = findMount();
    const cockpit = findCockpit();
    const planetCanvas = findPlanetCanvas();

    let canvasRect = null;

    try {
      canvasRect = planetCanvas && isFunction(planetCanvas.getBoundingClientRect)
        ? planetCanvas.getBoundingClientRect()
        : null;
    } catch (_error) {
      canvasRect = null;
    }

    const eastReceiptPresent = Boolean(east);
    const eastStep1Complete = Boolean(
      readBoolean(east, ["step1Complete", "eastStep1Complete"], false) ||
      (
        readBoolean(east, ["firstPaintCockpitReady"], false) &&
        readBoolean(east, ["loadLedgerPresent"], false)
      ) ||
      bool(dataset.hearthEastStep1Complete, false) ||
      (
        bool(dataset.hearthFirstPaintCockpitReady, false) &&
        bool(dataset.hearthLoadLedgerPresent, false)
      )
    );

    const eastIgnitionComplete = Boolean(
      readBoolean(east, ["eastIgnitionComplete", "indexJsStartsProcess", "ownsFirstPaintSurvival"], false) ||
      bool(dataset.hearthEastIgnitionComplete, false) ||
      bool(dataset.hearthIndexJsStartsProcess, false)
    );

    const westReceiptPresent = Boolean(west);
    const westAdmissibilityComplete = Boolean(
      readBoolean(west, ["westAdmissibilityComplete", "handoffNormalized"], false) ||
      bool(dataset.hearthWestAdmissibilityComplete, false)
    );

    const handoffAdmissible = Boolean(
      readBoolean(west, ["handoffAdmissible"], false) ||
      bool(dataset.hearthHandoffAdmissible, false)
    );

    const handoffNormalized = Boolean(
      readBoolean(west, ["handoffNormalized"], false) ||
      bool(dataset.hearthHandoffNormalized, false)
    );

    const canvasReady = Boolean(
      readBoolean(canvasReceipt, ["canvasReady"], false) ||
      readBoolean(south, ["canvasReady"], false) ||
      bool(dataset.hearthCanvasReady, false)
    );

    const canvasCarrierMounted = Boolean(
      readBoolean(canvasReceipt, ["canvasCarrierMounted", "visibleCarrierMounted", "mounted", "canvasMounted"], false) ||
      readBoolean(south, ["canvasCarrierMounted"], false) ||
      bool(dataset.hearthCanvasCarrierMounted, false)
    );

    const canvasContextReady = Boolean(
      readBoolean(canvasReceipt, ["canvasContextReady", "contextReady"], false) ||
      readBoolean(south, ["canvasContextReady"], false) ||
      canvasReady ||
      bool(dataset.hearthCanvasContextReady, false)
    );

    const dragInspectionBound = Boolean(
      readBoolean(canvasReceipt, ["dragInspectionBound", "pointerControlsBound", "controlsBound"], false) ||
      readBoolean(south, ["dragInspectionBound"], false) ||
      bool(dataset.hearthDragInspectionBound, false)
    );

    const atlasBuildComplete = Boolean(
      readBoolean(canvasReceipt, ["atlasBuildComplete"], false) ||
      readBoolean(south, ["atlasBuildComplete"], false)
    );

    const textureComposeComplete = Boolean(
      readBoolean(canvasReceipt, ["textureComposeComplete"], false) ||
      readBoolean(south, ["textureComposeComplete"], false)
    );

    const firstFrameDetected = Boolean(
      readBoolean(canvasReceipt, ["firstFrameDetected"], false) ||
      readBoolean(south, ["firstFrameDetected"], false) ||
      bool(dataset.hearthFirstFrameDetected, false)
    );

    const imageRendered = Boolean(
      readBoolean(canvasReceipt, ["imageRendered"], false) ||
      readBoolean(south, ["imageRendered"], false) ||
      bool(dataset.hearthImageRendered, false) ||
      bool(dataset.hearthCanvasImageRendered, false)
    );

    const explicitContentReceiptProof = explicitReceiptContentProof(canvasReceipt) || explicitReceiptContentProof(south);

    const visibleContentProof = Boolean(
      explicitContentReceiptProof ||
      readBoolean(canvasReceipt, ["visibleContentProof"], false) ||
      readBoolean(south, ["visibleContentProof"], false) ||
      bool(dataset.hearthVisibleContentProof, false)
    );

    const visiblePlanetAvailable = Boolean(
      visibleContentProof ||
      readBoolean(canvasReceipt, ["visiblePlanetAvailable"], false) ||
      readBoolean(south, ["visiblePlanetAvailable"], false) ||
      bool(dataset.hearthVisiblePlanetAvailable, false)
    );

    const planetCanvasPresent = Boolean(planetCanvas || bool(dataset.hearthPlanetCanvasPresent, false));

    const planetCanvasNonZeroSize = Boolean(
      bool(dataset.hearthPlanetCanvasNonZeroSize, false) ||
      (
        planetCanvas &&
        (
          (number(planetCanvas.width, 0) > 0 && number(planetCanvas.height, 0) > 0) ||
          (canvasRect && canvasRect.width > 0 && canvasRect.height > 0)
        )
      )
    );

    const planetFramePainted = Boolean(
      visiblePlanetAvailable ||
      readBoolean(canvasReceipt, ["planetFramePainted"], false) ||
      readBoolean(south, ["planetFramePainted"], false) ||
      bool(dataset.hearthPlanetFramePainted, false)
    );

    const nonblankPlanetVisible = Boolean(
      visiblePlanetAvailable ||
      readBoolean(canvasReceipt, ["nonblankPlanetVisible"], false) ||
      readBoolean(south, ["nonblankPlanetVisible"], false) ||
      bool(dataset.hearthNonblankPlanetVisible, false)
    );

    const inspectPlanetControlReady = Boolean(
      doc && (
        doc.querySelector("[data-hearth-inspect-planet]") ||
        doc.querySelector("[data-hearth-index-show-diagnostic-tab]") ||
        doc.querySelector("[data-hearth-coherence-show-diagnostic-tab]")
      )
    );

    const diagnosticCanLeavePlanetFrame = Boolean(
      readBoolean(south, ["diagnosticCanLeavePlanetFrame"], false) ||
      bool(dataset.hearthDiagnosticCanLeavePlanetFrame, false) ||
      (
        bool(dataset.hearthShowDiagnosticTabVisibleWhenHidden, false) &&
        bool(dataset.hearthDiagnosticDockRestorable, false) &&
        bool(dataset.hearthCopyDiagnosticPreserved, false)
      )
    );

    const southInspectReady = Boolean(
      diagnosticCanLeavePlanetFrame ||
      readBoolean(south, ["inspectModeAvailable", "inspectPlanetControlAvailable"], false) ||
      bool(dataset.hearthInspectModeAvailable, false)
    );

    const southVisibleCompletionReady = Boolean(
      visibleContentProof &&
      visiblePlanetAvailable &&
      nonblankPlanetVisible &&
      (dragInspectionBound || southInspectReady)
    );

    const eastGateReady = Boolean(eastStep1Complete || eastIgnitionComplete);
    const westGateReady = Boolean(handoffAdmissible && westAdmissibilityComplete);
    const northGateReady = true;
    const southGateReady = Boolean(southVisibleCompletionReady && southInspectReady);
    const newsGatePassedBeforeF21 = Boolean(eastGateReady && westGateReady && northGateReady && southGateReady);
    const f21Eligible = Boolean(newsGatePassedBeforeF21 && visibleContentProof && visiblePlanetAvailable && southInspectReady);

    const snapshot = {
      eastReceiptPresent,
      eastStep1Complete,
      eastIgnitionComplete,
      eastContract: readString(east, ["contract"], ""),
      eastReceipt: readString(east, ["receipt"], ""),

      westReceiptPresent,
      westAdmissibilityComplete,
      handoffAdmissible,
      handoffNormalized,
      westContract: readString(west, ["contract"], ""),
      westReceipt: readString(west, ["receipt"], ""),

      northCheckpointAuthorityReady: true,
      northRuntimeTableReady: true,

      southReceiptPresent: Boolean(south),
      southVisibleCompletionReady,
      southInspectReady,
      southContract: readString(south, ["contract"], ""),
      southReceipt: readString(south, ["receipt"], ""),

      mountReady: Boolean(mount || bool(dataset.hearthMountReady, false)),
      cockpitFound: Boolean(cockpit),
      copyDiagnosticReady: Boolean(doc && doc.querySelector("[data-hearth-copy-diagnostic]")),
      receiptToggleReady: Boolean(doc && doc.querySelector("[data-hearth-toggle-receipt]")),
      inspectPlanetControlReady,
      showDiagnosticTabReady: Boolean(
        doc && (
          doc.querySelector("[data-hearth-index-show-diagnostic-tab]") ||
          doc.querySelector("[data-hearth-coherence-show-diagnostic-tab]")
        )
      ),
      diagnosticCanLeavePlanetFrame,

      runtimeTablePresent: true,
      runtimeTableMutation: false,
      universalRuntimeTableMutation: false,

      canvasApiPresent: Boolean(canvasApi),
      canvasScriptPresent: detectScriptPresence(CANVAS_FILE),
      canvasReady,
      canvasCarrierMounted,
      canvasContextReady,
      dragInspectionBound,
      atlasBuildComplete,
      textureComposeComplete,
      firstFrameDetected,
      imageRendered,
      visibleContentProof,
      explicitContentReceiptProof,
      visiblePlanetAvailable,
      planetCanvasPresent,
      planetCanvasNonZeroSize,
      planetFramePainted,
      nonblankPlanetVisible,

      eastGateReady,
      westGateReady,
      northGateReady,
      southGateReady,
      newsGatePassedBeforeF21,
      f21Eligible,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      ...clonePlain(extra)
    };

    return snapshot;
  }

  function explicitReceiptContentProof(value) {
    if (!isObject(value)) return false;

    const keys = [
      "atlasPainted",
      "textureApplied",
      "surfaceTextureApplied",
      "planetTexturePainted",
      "visibleContentPainted",
      "visibleContentProof",
      "visibleHearthContentPainted",
      "atlasAppliedToPlanet",
      "textureAppliedToPlanet",
      "surfaceAtlasPainted",
      "landWaterTexturePainted",
      "nonblankPlanetVisible",
      "visiblePlanetAvailable"
    ];

    for (const key of keys) {
      if (value[key] === true || value[key] === "true") return true;
    }

    const nested = [value.state, value.receipt, value.postgame, value.canvasState, value.renderState].filter(isObject);

    for (const item of nested) {
      for (const key of keys) {
        if (item[key] === true || item[key] === "true") return true;
      }
    }

    return false;
  }

  function detectKillCondition(eventName, snapshot) {
    const completionEvent = checkpointByEvent(eventName);
    const wantsF21 = completionEvent && completionEvent.id === "F21_COMPLETION_LATCHED";

    if (!snapshot.mountReady && eventName !== "INDEX_HANDOFF_ACCEPTED") {
      return {
        hardBlock: true,
        code: "KILL_MISSING_MOUNT",
        message: "Missing Hearth mount prevents lawful route continuation.",
        owner: "EAST",
        recommendedNextOwner: "EAST",
        recommendedNextFile: EAST_FILE
      };
    }

    if (root.__HEARTH_DUPLICATE_CONDUCTOR_CONFLICT__ === true) {
      return {
        hardBlock: true,
        code: "KILL_DUPLICATE_CONDUCTOR_CONFLICT",
        message: "Duplicate conductor conflict detected.",
        owner: "SOUTH",
        recommendedNextOwner: "SOUTH",
        recommendedNextFile: SOUTH_FILE
      };
    }

    if (root.__HEARTH_CANVAS_BOOT_FAILED__ === true || snapshot.canvasBootFailure === true) {
      return {
        hardBlock: true,
        code: "KILL_CANVAS_BOOT_FAILURE",
        message: "Canvas boot failure detected.",
        owner: "SOUTH",
        recommendedNextOwner: "SOUTH",
        recommendedNextFile: CANVAS_FILE
      };
    }

    if (root.__HEARTH_RUNTIME_TABLE_CORRUPT__ === true) {
      return {
        hardBlock: true,
        code: "KILL_RUNTIME_TABLE_CORRUPTION",
        message: "Runtime-table corruption detected.",
        owner: "NORTH",
        recommendedNextOwner: "NORTH",
        recommendedNextFile: NORTH_FILE
      };
    }

    if (snapshot.falseFinalReadinessClaim === true) {
      return {
        hardBlock: true,
        code: "KILL_FALSE_FINAL_READINESS_CLAIM",
        message: "False final readiness claim detected.",
        owner: "CHECKPOINT",
        recommendedNextOwner: "NORTH",
        recommendedNextFile: NORTH_FILE
      };
    }

    if (wantsF21 && !snapshot.f21Eligible) {
      return {
        hardBlock: true,
        code: "KILL_F21_BEFORE_REQUIRED_GATES",
        message: "F21 was requested before East, West, North, and South gates passed.",
        owner: "CHECKPOINT",
        recommendedNextOwner: missingGateOwner(snapshot),
        recommendedNextFile: missingGateFile(snapshot)
      };
    }

    return {
      hardBlock: false,
      code: "",
      message: "",
      owner: "",
      recommendedNextOwner: "",
      recommendedNextFile: ""
    };
  }

  function missingGateOwner(snapshot) {
    if (!snapshot.eastGateReady) return "EAST";
    if (!snapshot.westGateReady) return "WEST";
    if (!snapshot.northGateReady) return "NORTH";
    if (!snapshot.southGateReady) return "SOUTH";
    return "CHECKPOINT";
  }

  function missingGateFile(snapshot) {
    const owner = missingGateOwner(snapshot);

    if (owner === "EAST") return EAST_FILE;
    if (owner === "WEST") return WEST_FILE;
    if (owner === "SOUTH") return SOUTH_FILE;
    return NORTH_FILE;
  }

  function classifySoftGap(snapshot) {
    if (!snapshot.eastReceiptPresent && !snapshot.eastStep1Complete) {
      return {
        checkpointStatus: STATUS.WARN,
        gapDetected: true,
        gapClass: GAP_CLASS.SOFT_STRUCTURAL,
        firstGapCode: "WAITING_EAST_STEP1_HANDOFF_RECEIPT",
        firstFailedCoordinate: "WAITING_EAST_STEP1_HANDOFF_RECEIPT",
        recommendedNextOwner: "EAST",
        recommendedNextFile: EAST_FILE,
        forwardProgressAllowed: true
      };
    }

    if (!snapshot.handoffAdmissible) {
      return {
        checkpointStatus: STATUS.WARN,
        gapDetected: true,
        gapClass: GAP_CLASS.SOFT_STRUCTURAL,
        firstGapCode: "WAITING_WEST_HANDOFF_ADMISSIBILITY",
        firstFailedCoordinate: "WAITING_WEST_HANDOFF_ADMISSIBILITY",
        recommendedNextOwner: "WEST",
        recommendedNextFile: WEST_FILE,
        forwardProgressAllowed: true
      };
    }

    if (!snapshot.visibleContentProof) {
      return {
        checkpointStatus: STATUS.WARN,
        gapDetected: true,
        gapClass: GAP_CLASS.SOFT,
        firstGapCode: "WAITING_SOUTH_VISIBLE_CONTENT_PROOF",
        firstFailedCoordinate: "WAITING_SOUTH_VISIBLE_CONTENT_PROOF",
        recommendedNextOwner: "SOUTH",
        recommendedNextFile: SOUTH_FILE,
        forwardProgressAllowed: true
      };
    }

    if (!snapshot.southInspectReady) {
      return {
        checkpointStatus: STATUS.WARN,
        gapDetected: true,
        gapClass: GAP_CLASS.SOFT,
        firstGapCode: "WAITING_SOUTH_INSPECT_MODE_READY",
        firstFailedCoordinate: "WAITING_SOUTH_INSPECT_MODE_READY",
        recommendedNextOwner: "SOUTH",
        recommendedNextFile: SOUTH_FILE,
        forwardProgressAllowed: true
      };
    }

    return {
      checkpointStatus: STATUS.PASS,
      gapDetected: false,
      gapClass: GAP_CLASS.NONE,
      firstGapCode: "NONE",
      firstFailedCoordinate: "NONE",
      recommendedNextOwner: "CHECKPOINT",
      recommendedNextFile: NORTH_FILE,
      forwardProgressAllowed: true
    };
  }

  function makeSession(options = {}) {
    const sessionId = options.sessionId || `HEARTH-NORTH-SESSION-${padNumber(state.sessionsCreated + 1)}`;
    const createdAt = nowIso();

    const session = {
      sessionId,
      createdAt,
      sequence: CHECKPOINTS.map((checkpoint) => ({
        ...clonePlain(checkpoint),
        status: "PENDING",
        complete: false,
        completedAt: ""
      })),
      activeIndex: 0,
      completed: [],
      queued: [],
      admitted: [],
      archived: [],
      blocked: [],
      retried: [],
      warned: [],
      gaps: [],
      cycleIndex: 1,
      completionLatched: false,
      lastClassification: null
    };

    state.sessionsCreated += 1;
    state.sessionCreated = true;
    state.defaultSessionId = state.defaultSessionId || sessionId;

    function activeCheckpoint() {
      return session.sequence[Math.max(0, Math.min(session.activeIndex, session.sequence.length - 1))] || null;
    }

    function getCheckpoint(checkpointId) {
      return session.sequence.find((checkpoint) => checkpoint.id === checkpointId) || null;
    }

    function advanceIfAdmitted(checkpoint) {
      checkpoint.complete = true;
      checkpoint.status = "COMPLETE";
      checkpoint.completedAt = nowIso();

      if (!session.completed.includes(checkpoint.id)) {
        session.completed.push(checkpoint.id);
      }

      if (checkpoint.id === "F21_COMPLETION_LATCHED") {
        session.completionLatched = true;
        session.activeIndex = session.sequence.length - 1;
        return;
      }

      session.activeIndex = Math.min(session.sequence.length - 1, session.activeIndex + 1);

      const next = activeCheckpoint();
      if (next && !next.complete) {
        next.status = "ACTIVE";
      }
    }

    function classifyEvent(eventName, eventDetail = {}) {
      const snapshot = buildSystemSnapshot(eventDetail.snapshot || eventDetail);
      const checkpoint = checkpointByEvent(eventName);
      const active = activeCheckpoint();
      const kill = detectKillCondition(eventName, snapshot);
      const soft = classifySoftGap(snapshot);

      if (kill.hardBlock) {
        return {
          action: STATUS.HARD_BLOCK,
          checkpointStatus: STATUS.HARD_BLOCK,
          checkpointId: checkpoint ? checkpoint.id : "",
          reason: kill.code,
          message: kill.message,
          hardBlocked: true,
          forwardProgressAllowed: false,
          gapDetected: true,
          gapClass: GAP_CLASS.KILL,
          recommendedNextOwner: kill.recommendedNextOwner,
          recommendedNextFile: kill.recommendedNextFile,
          snapshot
        };
      }

      if (!checkpoint) {
        return {
          action: STATUS.ARCHIVE,
          checkpointStatus: STATUS.ARCHIVE,
          checkpointId: "",
          reason: "unknown-event",
          message: "Unknown event archived without blocking forward progress.",
          hardBlocked: false,
          forwardProgressAllowed: true,
          gapDetected: soft.gapDetected,
          gapClass: soft.gapClass,
          recommendedNextOwner: soft.recommendedNextOwner,
          recommendedNextFile: soft.recommendedNextFile,
          snapshot
        };
      }

      if (session.completionLatched && checkpoint.id !== "F21_COMPLETION_LATCHED") {
        return {
          action: STATUS.ARCHIVE,
          checkpointStatus: STATUS.ARCHIVE,
          checkpointId: checkpoint.id,
          reason: "post-f21-event-archived",
          message: "Event arrived after F21; archived without reopening completion.",
          hardBlocked: false,
          forwardProgressAllowed: true,
          gapDetected: false,
          gapClass: GAP_CLASS.NONE,
          recommendedNextOwner: "CHECKPOINT",
          recommendedNextFile: NORTH_FILE,
          snapshot
        };
      }

      if (!active) {
        return {
          action: STATUS.RETRY,
          checkpointStatus: STATUS.RETRY,
          checkpointId: checkpoint.id,
          reason: "active-checkpoint-missing",
          message: "Active checkpoint missing; North session should retry after receipt refresh.",
          hardBlocked: false,
          forwardProgressAllowed: true,
          gapDetected: true,
          gapClass: GAP_CLASS.STRUCTURAL,
          recommendedNextOwner: "NORTH",
          recommendedNextFile: NORTH_FILE,
          snapshot
        };
      }

      if (checkpoint.rank < active.rank) {
        return {
          action: STATUS.ARCHIVE,
          checkpointStatus: STATUS.ARCHIVE,
          checkpointId: checkpoint.id,
          reason: "completed-or-regressive-event",
          message: "Regressive or already-completed event archived.",
          hardBlocked: false,
          forwardProgressAllowed: true,
          gapDetected: soft.gapDetected,
          gapClass: soft.gapClass,
          recommendedNextOwner: soft.recommendedNextOwner,
          recommendedNextFile: soft.recommendedNextFile,
          snapshot
        };
      }

      if (checkpoint.rank > active.rank) {
        return {
          action: STATUS.QUEUE,
          checkpointStatus: STATUS.QUEUE,
          checkpointId: checkpoint.id,
          reason: "future-event-queued-until-active-cycle",
          message: "Future event queued; current cycle may continue without hard block.",
          hardBlocked: false,
          forwardProgressAllowed: true,
          gapDetected: soft.gapDetected,
          gapClass: soft.gapClass,
          recommendedNextOwner: soft.recommendedNextOwner,
          recommendedNextFile: soft.recommendedNextFile,
          snapshot
        };
      }

      if (checkpoint.id === "S2_INDEX_HANDOFF_ACCEPTED" && !snapshot.handoffAdmissible) {
        return {
          action: STATUS.RETRY,
          checkpointStatus: STATUS.WARN,
          checkpointId: checkpoint.id,
          reason: "west-handoff-not-admissible",
          message: "West handoff is not yet admissible. This is a seam gap, not a South/canvas failure.",
          hardBlocked: false,
          forwardProgressAllowed: true,
          gapDetected: true,
          gapClass: GAP_CLASS.SOFT_STRUCTURAL,
          recommendedNextOwner: snapshot.eastStep1Complete ? "WEST" : "EAST",
          recommendedNextFile: snapshot.eastStep1Complete ? WEST_FILE : EAST_FILE,
          snapshot
        };
      }

      if (checkpoint.id === "S10_VISIBLE_CONTENT_PROOF_PASSED" && !snapshot.visibleContentProof) {
        return {
          action: STATUS.RETRY,
          checkpointStatus: STATUS.WARN,
          checkpointId: checkpoint.id,
          reason: "visible-content-proof-not-yet-present",
          message: "Visible content proof is not yet present.",
          hardBlocked: false,
          forwardProgressAllowed: true,
          gapDetected: true,
          gapClass: GAP_CLASS.SOFT,
          recommendedNextOwner: "SOUTH",
          recommendedNextFile: SOUTH_FILE,
          snapshot
        };
      }

      if (checkpoint.id === "S11_INSPECT_MODE_READY" && !snapshot.southInspectReady) {
        return {
          action: STATUS.RETRY,
          checkpointStatus: STATUS.WARN,
          checkpointId: checkpoint.id,
          reason: "inspect-mode-not-yet-ready",
          message: "Inspect mode is not yet ready.",
          hardBlocked: false,
          forwardProgressAllowed: true,
          gapDetected: true,
          gapClass: GAP_CLASS.SOFT,
          recommendedNextOwner: "SOUTH",
          recommendedNextFile: SOUTH_FILE,
          snapshot
        };
      }

      if (checkpoint.id === "F21_COMPLETION_LATCHED" && !snapshot.f21Eligible) {
        return {
          action: STATUS.HARD_BLOCK,
          checkpointStatus: STATUS.HARD_BLOCK,
          checkpointId: checkpoint.id,
          reason: "f21-before-required-gates",
          message: "F21 cannot latch before East, West, North, and South gates pass.",
          hardBlocked: true,
          forwardProgressAllowed: false,
          gapDetected: true,
          gapClass: GAP_CLASS.KILL,
          recommendedNextOwner: missingGateOwner(snapshot),
          recommendedNextFile: missingGateFile(snapshot),
          snapshot
        };
      }

      return {
        action: STATUS.ADMIT,
        checkpointStatus: soft.gapDetected ? STATUS.WARN : STATUS.PASS,
        checkpointId: checkpoint.id,
        reason: "event-matches-active-checkpoint",
        message: checkpoint.label,
        hardBlocked: false,
        forwardProgressAllowed: true,
        gapDetected: soft.gapDetected,
        gapClass: soft.gapClass,
        recommendedNextOwner: soft.recommendedNextOwner,
        recommendedNextFile: soft.recommendedNextFile,
        snapshot
      };
    }

    function storeQueued(eventName, event, classification) {
      const checkpoint = checkpointByEvent(eventName);

      if (!checkpoint) return;

      const existingIndex = session.queued.findIndex((item) => item.checkpointId === checkpoint.id);

      const packet = {
        at: nowIso(),
        eventName,
        checkpointId: checkpoint.id,
        checkpointRank: checkpoint.rank,
        fibonacci: checkpoint.fibonacci,
        owner: checkpoint.owner,
        event: clonePlain(event),
        reason: classification.reason,
        replayCount: 0,
        lastReplayAt: ""
      };

      if (existingIndex >= 0) {
        session.queued[existingIndex] = packet;
      } else {
        session.queued.push(packet);
      }

      session.queued.sort((a, b) => a.checkpointRank - b.checkpointRank);
    }

    function drainQueued(reason = "cycle-drain") {
      let changed = false;
      let guard = 0;

      while (guard < 20) {
        guard += 1;

        const active = activeCheckpoint();
        if (!active) break;

        const packet = session.queued.find((item) => item.checkpointId === active.id);
        if (!packet) break;

        packet.replayCount += 1;
        packet.lastReplayAt = nowIso();

        const result = submitEvent(packet.event, {
          fromQueueDrain: true,
          drainReason: reason,
          skipQueueStore: true,
          skipQueueDrain: true
        });

        if (result && result.action === STATUS.ADMIT) {
          session.queued = session.queued.filter((item) => item.checkpointId !== packet.checkpointId);
          changed = true;
          continue;
        }

        if (result && result.action === STATUS.ARCHIVE) {
          session.queued = session.queued.filter((item) => item.checkpointId !== packet.checkpointId);
          changed = true;
          continue;
        }

        break;
      }

      return changed;
    }

    function submitEvent(event = {}, options = {}) {
      const eventName = String(event.event || event.id || event.phase || event.checkpointEvent || "");
      const checkpoint = checkpointByEvent(eventName);
      const classification = classifyEvent(eventName, event.detail || event.snapshot || event);
      const at = nowIso();

      session.lastClassification = classification;

      const logItem = {
        at,
        sessionId,
        eventName,
        checkpointId: classification.checkpointId || (checkpoint ? checkpoint.id : ""),
        action: classification.action,
        checkpointStatus: classification.checkpointStatus,
        reason: classification.reason,
        message: classification.message,
        hardBlocked: classification.hardBlocked,
        forwardProgressAllowed: classification.forwardProgressAllowed,
        gapDetected: classification.gapDetected,
        gapClass: classification.gapClass,
        recommendedNextOwner: classification.recommendedNextOwner,
        recommendedNextFile: classification.recommendedNextFile
      };

      if (classification.action === STATUS.ADMIT && checkpoint) {
        const sessionCheckpoint = getCheckpoint(checkpoint.id);

        if (sessionCheckpoint) {
          advanceIfAdmitted(sessionCheckpoint);
        }

        session.admitted.push(logItem);
        state.admittedEventsCount += 1;
      } else if (classification.action === STATUS.QUEUE) {
        if (!options.skipQueueStore) storeQueued(eventName, event, classification);
        session.queued.sort((a, b) => a.checkpointRank - b.checkpointRank);
        state.queuedEventsCount += 1;
      } else if (classification.action === STATUS.HARD_BLOCK) {
        session.blocked.push(logItem);
        state.blockedEventsCount += 1;
        recordGap(classification.reason, classification.message, {
          hardBlocked: true,
          forwardProgressAllowed: false,
          owner: classification.recommendedNextOwner,
          gapClass: GAP_CLASS.KILL,
          recommendedNextOwner: classification.recommendedNextOwner,
          recommendedNextFile: classification.recommendedNextFile
        });
      } else if (classification.action === STATUS.RETRY) {
        session.retried.push(logItem);
        state.retryEventsCount += 1;
        recordGap(classification.reason, classification.message, {
          hardBlocked: false,
          forwardProgressAllowed: true,
          owner: classification.recommendedNextOwner,
          gapClass: classification.gapClass,
          recommendedNextOwner: classification.recommendedNextOwner,
          recommendedNextFile: classification.recommendedNextFile
        });
      } else if (classification.action === STATUS.ARCHIVE) {
        session.archived.push(logItem);
        state.archivedEventsCount += 1;
      }

      if (classification.gapDetected && classification.action !== STATUS.HARD_BLOCK && classification.action !== STATUS.RETRY) {
        session.warned.push(logItem);
        state.warningEventsCount += 1;
      }

      updateGlobalStateFromSession(session, classification);

      if (!options.skipQueueDrain) {
        drainQueued(`after-${eventName || "event"}`);
      }

      publishGlobals();
      return {
        action: classification.action,
        checkpointStatus: classification.checkpointStatus,
        checkpointId: classification.checkpointId,
        reason: classification.reason,
        message: classification.message,
        hardBlocked: classification.hardBlocked,
        forwardProgressAllowed: classification.forwardProgressAllowed,
        gapDetected: classification.gapDetected,
        gapClass: classification.gapClass,
        recommendedNextOwner: classification.recommendedNextOwner,
        recommendedNextFile: classification.recommendedNextFile,
        activeCheckpoint: clonePlain(activeCheckpoint()),
        completionLatched: session.completionLatched,
        f21Allowed: classification.snapshot ? classification.snapshot.f21Eligible : state.f21Allowed
      };
    }

    function reconcile(reason = "manual") {
      const snapshot = buildSystemSnapshot({ reconcileReason: reason });

      if (snapshot.handoffAdmissible) {
        submitEvent({
          event: "INDEX_HANDOFF_ACCEPTED",
          detail: {
            reconcileReason: reason,
            snapshot
          }
        }, { skipQueueDrain: true });
      } else {
        const soft = classifySoftGap(snapshot);
        updateGlobalStateFromSnapshot(snapshot, soft);
      }

      submitEvent({
        event: "AUTHORITY_AVAILABILITY_READY",
        detail: { reconcileReason: reason, snapshot }
      }, { skipQueueDrain: true });

      submitEvent({
        event: "RUNTIME_TABLE_SESSION_READY",
        detail: { reconcileReason: reason, snapshot }
      }, { skipQueueDrain: true });

      if (snapshot.canvasApiPresent || snapshot.canvasReady || snapshot.canvasCarrierMounted) {
        submitEvent({
          event: "CANVAS_COORDINATION_STARTED",
          detail: { reconcileReason: reason, snapshot }
        }, { skipQueueDrain: true });
      }

      if (snapshot.canvasCarrierMounted) {
        submitEvent({
          event: "CANVAS_MOUNT_CONFIRMED",
          detail: { reconcileReason: reason, snapshot }
        }, { skipQueueDrain: true });
      }

      if (snapshot.canvasContextReady) {
        submitEvent({
          event: "CANVAS_CONTEXT_READY",
          detail: { reconcileReason: reason, snapshot }
        }, { skipQueueDrain: true });
      }

      if (snapshot.dragInspectionBound) {
        submitEvent({
          event: "DRAG_INSPECTION_BOUND",
          detail: { reconcileReason: reason, snapshot }
        }, { skipQueueDrain: true });
      }

      if (
        snapshot.atlasBuildComplete ||
        snapshot.textureComposeComplete ||
        snapshot.firstFrameDetected ||
        snapshot.imageRendered ||
        snapshot.canvasReady
      ) {
        submitEvent({
          event: "ATLAS_TEXTURE_FRAME_READY",
          detail: { reconcileReason: reason, snapshot }
        }, { skipQueueDrain: true });
      }

      if (snapshot.visibleContentProof) {
        submitEvent({
          event: "VISIBLE_CONTENT_PROOF_PASSED",
          detail: { reconcileReason: reason, snapshot }
        }, { skipQueueDrain: true });
      }

      if (snapshot.southInspectReady) {
        submitEvent({
          event: "INSPECT_MODE_READY",
          detail: { reconcileReason: reason, snapshot }
        }, { skipQueueDrain: true });
      }

      drainQueued(`reconcile-${reason}`);
      updateGlobalStateFromSnapshot(snapshot, classifySoftGap(snapshot));
      publishGlobals();
      return getReceipt();
    }

    function getReceipt() {
      const snapshot = buildSystemSnapshot();
      const active = activeCheckpoint();
      const soft = classifySoftGap(snapshot);
      const f21Allowed = Boolean(snapshot.f21Eligible && session.completed.includes("S11_INSPECT_MODE_READY"));

      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        baselineContract: BASELINE_CONTRACT,
        version: VERSION,
        file: NORTH_FILE,
        route: ROUTE,
        role: "north-command-runtime-table",

        sessionId,
        sessionCreatedAt: createdAt,

        canonicalPhrase: state.canonicalPhrase,
        cycleOrder: CYCLE_ORDER.join(","),
        cycleFormula: state.cycleFormula,
        cycleId: `${state.currentCycleId}-S${session.sessionId}`,
        currentOwner: active ? active.owner : "CHECKPOINT",
        lastOwner: state.lastOwner,
        checkpointStatus: soft.checkpointStatus,
        gapDetected: soft.gapDetected,
        gapClass: soft.gapClass,
        forwardProgressAllowed: soft.forwardProgressAllowed,
        recommendedNextOwner: soft.recommendedNextOwner,
        recommendedNextFile: soft.recommendedNextFile,

        ownsNorth: true,
        ownsEast: false,
        ownsWest: false,
        ownsSouth: false,
        ownsStep1: false,
        ownsSteps2Through11: true,
        ownsCheckpointLaw: true,
        ownsNewsFibonacciGovernance: true,
        ownsSoftGapDecisions: true,
        ownsF21Eligibility: true,
        ownsUniversalRuntimeTable: false,
        ownsCanvasDrawing: false,
        ownsFinalVisualPassClaim: false,

        eastFile: EAST_FILE,
        westFile: WEST_FILE,
        northFile: NORTH_FILE,
        southFile: SOUTH_FILE,
        canvasFile: CANVAS_FILE,

        gapAssessmentFast: true,
        hardBlockMode: false,
        softGapGovernor: true,
        forwardProgressAllowedWithGaps: true,
        blockedProgressCap: 98,
        readyTextRequiresF21: true,

        checkpointBrainActive: true,
        chronologicalFibonacciAlignment: true,
        newsFibonacciAlignment: true,
        oneActiveCheckpointAtATime: true,
        futureEventsQueued: true,
        completedEventsArchived: true,
        regressiveEventsBlocked: true,

        activeCheckpointId: active ? active.id : "",
        activeCheckpointRank: active ? active.rank : 0,
        activeFibonacciStage: active ? active.fibonacci : "",
        completedCheckpoints: session.completed.join(","),
        highestCompletedCheckpointId: session.completed.length ? session.completed[session.completed.length - 1] : "",
        highestCompletedRank: session.completed.length ? number(checkpointById(session.completed[session.completed.length - 1])?.rank, 0) : 0,

        queuedEventsCount: session.queued.length,
        admittedEventsCount: session.admitted.length,
        archivedEventsCount: session.archived.length,
        blockedEventsCount: session.blocked.length,
        retryEventsCount: session.retried.length,
        warningEventsCount: session.warned.length,

        currentStage: active ? active.fibonacci : "F21",
        highestStage: session.completed.length
          ? checkpointById(session.completed[session.completed.length - 1])?.fibonacci || "F3"
          : "F3",
        mainDisplayProgress: session.completionLatched ? 100 : Math.min(98, Math.max(36, active ? active.progress : 98)),
        mainProgressCap: session.completionLatched ? 100 : 98,
        completionLatched: session.completionLatched,
        f21Allowed,
        f21AfterS11: Boolean(f21Allowed && session.completed.includes("S11_INSPECT_MODE_READY")),
        finalReceiptAvailable: session.completionLatched,

        eastReceiptPresent: snapshot.eastReceiptPresent,
        eastStep1Complete: snapshot.eastStep1Complete,
        eastIgnitionComplete: snapshot.eastIgnitionComplete,
        eastContract: snapshot.eastContract,
        eastReceipt: snapshot.eastReceipt,

        westReceiptPresent: snapshot.westReceiptPresent,
        westAdmissibilityComplete: snapshot.westAdmissibilityComplete,
        handoffAdmissible: snapshot.handoffAdmissible,
        handoffNormalized: snapshot.handoffNormalized,
        westContract: snapshot.westContract,
        westReceipt: snapshot.westReceipt,

        northCheckpointAuthorityReady: true,
        northRuntimeTableReady: true,

        southReceiptPresent: snapshot.southReceiptPresent,
        southVisibleCompletionReady: snapshot.southVisibleCompletionReady,
        southInspectReady: snapshot.southInspectReady,
        southContract: snapshot.southContract,
        southReceipt: snapshot.southReceipt,

        newsProtocolActive: true,
        northGateReady: snapshot.northGateReady,
        eastGateReady: snapshot.eastGateReady,
        westGateReady: snapshot.westGateReady,
        southGateReady: snapshot.southGateReady,
        newsGatePassedBeforeF21: snapshot.newsGatePassedBeforeF21,

        mountReady: snapshot.mountReady,
        cockpitFound: snapshot.cockpitFound,
        copyDiagnosticReady: snapshot.copyDiagnosticReady,
        receiptToggleReady: snapshot.receiptToggleReady,
        inspectPlanetControlReady: snapshot.inspectPlanetControlReady,
        showDiagnosticTabReady: snapshot.showDiagnosticTabReady,
        diagnosticCanLeavePlanetFrame: snapshot.diagnosticCanLeavePlanetFrame,

        runtimeTablePresent: true,
        runtimeTableMode: "HEARTH_NORTH_LOCAL_RUNTIME_TABLE_READY",
        runtimeTableMutation: false,
        universalRuntimeTableMutation: false,

        canvasApiPresent: snapshot.canvasApiPresent,
        canvasScriptPresent: snapshot.canvasScriptPresent,
        canvasReady: snapshot.canvasReady,
        canvasCarrierMounted: snapshot.canvasCarrierMounted,
        canvasContextReady: snapshot.canvasContextReady,
        dragInspectionBound: snapshot.dragInspectionBound,
        atlasBuildComplete: snapshot.atlasBuildComplete,
        textureComposeComplete: snapshot.textureComposeComplete,
        firstFrameDetected: snapshot.firstFrameDetected,
        imageRendered: snapshot.imageRendered,
        visibleContentProof: snapshot.visibleContentProof,
        explicitContentReceiptProof: snapshot.explicitContentReceiptProof,
        visiblePlanetAvailable: snapshot.visiblePlanetAvailable,
        planetCanvasPresent: snapshot.planetCanvasPresent,
        planetCanvasNonZeroSize: snapshot.planetCanvasNonZeroSize,
        planetFramePainted: snapshot.planetFramePainted,
        nonblankPlanetVisible: snapshot.nonblankPlanetVisible,

        sourceAuthorityHeld: true,
        climateRouteRetired: true,
        canvasMutation: false,

        latestClassification: clonePlain(session.lastClassification),
        checkpointSequence: session.sequence.map(clonePlain),
        queuedEvents: clonePlain(session.queued),
        admittedEvents: clonePlain(session.admitted),
        archivedEvents: clonePlain(session.archived),
        blockedEvents: clonePlain(session.blocked),
        retryEvents: clonePlain(session.retried),
        warningEvents: clonePlain(session.warned),
        gapEvents: clonePlain(state.gapEvents),
        softGapEvents: clonePlain(state.softGapEvents),
        hardBlockEvents: clonePlain(state.hardBlockEvents),
        sourceStackHeld: SOURCE_STACK_HELD.slice(),
        errors: clonePlain(state.errors),

        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false,

        updatedAt: nowIso()
      };
    }

    function getReceiptText() {
      return receiptToText(getReceipt());
    }

    return {
      sessionId,
      submitEvent,
      submit: submitEvent,
      receiveEvent: submitEvent,
      reconcile,
      drainQueued,
      getReceipt,
      getReceiptText,
      get activeCheckpoint() {
        return clonePlain(activeCheckpoint());
      },
      get state() {
        return session;
      }
    };
  }

  function updateGlobalStateFromSession(session, classification) {
    const snapshot = classification.snapshot || buildSystemSnapshot();
    const active = session.sequence[Math.max(0, Math.min(session.activeIndex, session.sequence.length - 1))] || null;
    const highest = session.completed.length ? checkpointById(session.completed[session.completed.length - 1]) : null;

    state.activeCheckpointId = active ? active.id : "";
    state.activeCheckpointRank = active ? active.rank : 0;
    state.activeFibonacciStage = active ? active.fibonacci : "";
    state.completedCheckpoints = session.completed.slice();
    state.highestCompletedCheckpointId = highest ? highest.id : "";
    state.highestCompletedRank = highest ? highest.rank : 0;

    state.currentOwner = active ? active.owner : "CHECKPOINT";
    state.lastOwner = classification.checkpointId ? checkpointById(classification.checkpointId)?.owner || state.lastOwner : state.lastOwner;
    state.checkpointStatus = classification.checkpointStatus || STATUS.WARN;
    state.gapDetected = classification.gapDetected === true;
    state.gapClass = classification.gapClass || GAP_CLASS.SOFT;
    state.recommendedNextOwner = classification.recommendedNextOwner || state.recommendedNextOwner;
    state.recommendedNextFile = classification.recommendedNextFile || state.recommendedNextFile;
    state.recommendedNextRenewalTarget = state.recommendedNextFile;
    state.firstGapCode = classification.reason || state.firstGapCode;
    state.firstFailedCoordinate = classification.reason ? `WAITING_${String(classification.reason).toUpperCase()}` : state.firstFailedCoordinate;

    state.currentStage = active ? active.fibonacci : "F21";
    state.highestStage = highest ? highest.fibonacci : state.highestStage;
    state.mainDisplayProgress = session.completionLatched ? 100 : Math.min(98, Math.max(state.mainDisplayProgress, active ? active.progress : 36));
    state.mainProgressCap = session.completionLatched ? 100 : 98;
    state.completionLatched = session.completionLatched;
    state.f21Allowed = Boolean(snapshot.f21Eligible && session.completed.includes("S11_INSPECT_MODE_READY"));
    state.f21AfterS11 = Boolean(state.f21Allowed && session.completed.includes("S11_INSPECT_MODE_READY"));
    state.finalReceiptAvailable = session.completionLatched;

    updateGlobalStateFromSnapshot(snapshot, classification);
  }

  function updateGlobalStateFromSnapshot(snapshot, classification = {}) {
    state.eastReceiptPresent = snapshot.eastReceiptPresent;
    state.eastStep1Complete = snapshot.eastStep1Complete;
    state.eastIgnitionComplete = snapshot.eastIgnitionComplete;
    state.westReceiptPresent = snapshot.westReceiptPresent;
    state.westAdmissibilityComplete = snapshot.westAdmissibilityComplete;
    state.handoffAdmissible = snapshot.handoffAdmissible;
    state.handoffNormalized = snapshot.handoffNormalized;

    state.southReceiptPresent = snapshot.southReceiptPresent;
    state.southVisibleCompletionReady = snapshot.southVisibleCompletionReady;
    state.southInspectReady = snapshot.southInspectReady;

    state.newsProtocolActive = true;
    state.northGateReady = snapshot.northGateReady;
    state.eastGateReady = snapshot.eastGateReady;
    state.westGateReady = snapshot.westGateReady;
    state.southGateReady = snapshot.southGateReady;
    state.newsGatePassedBeforeF21 = snapshot.newsGatePassedBeforeF21;

    state.mountReady = snapshot.mountReady;
    state.cockpitFound = snapshot.cockpitFound;
    state.copyDiagnosticReady = snapshot.copyDiagnosticReady;
    state.receiptToggleReady = snapshot.receiptToggleReady;
    state.inspectPlanetControlReady = snapshot.inspectPlanetControlReady;
    state.showDiagnosticTabReady = snapshot.showDiagnosticTabReady;
    state.diagnosticCanLeavePlanetFrame = snapshot.diagnosticCanLeavePlanetFrame;

    state.canvasApiPresent = snapshot.canvasApiPresent;
    state.canvasReady = snapshot.canvasReady;
    state.canvasCarrierMounted = snapshot.canvasCarrierMounted;
    state.canvasContextReady = snapshot.canvasContextReady;
    state.dragInspectionBound = snapshot.dragInspectionBound;
    state.atlasBuildComplete = snapshot.atlasBuildComplete;
    state.textureComposeComplete = snapshot.textureComposeComplete;
    state.firstFrameDetected = snapshot.firstFrameDetected;
    state.imageRendered = snapshot.imageRendered;
    state.visibleContentProof = snapshot.visibleContentProof;
    state.visiblePlanetAvailable = snapshot.visiblePlanetAvailable;
    state.planetCanvasPresent = snapshot.planetCanvasPresent;
    state.planetCanvasNonZeroSize = snapshot.planetCanvasNonZeroSize;
    state.planetFramePainted = snapshot.planetFramePainted;
    state.nonblankPlanetVisible = snapshot.nonblankPlanetVisible;

    if (classification.recommendedNextOwner) {
      state.recommendedNextOwner = classification.recommendedNextOwner;
    }

    if (classification.recommendedNextFile) {
      state.recommendedNextFile = classification.recommendedNextFile;
      state.recommendedNextRenewalTarget = classification.recommendedNextFile;
    }

    state.updatedAt = nowIso();
  }

  function receiptToText(receipt) {
    const sequenceText = receipt.checkpointSequence.map((checkpoint) => (
      `- ${checkpoint.id}: step=${checkpoint.step}; owner=${checkpoint.owner}; rank=${checkpoint.rank}; fibonacci=${checkpoint.fibonacci}; status=${checkpoint.status}; complete=${checkpoint.complete}; progress=${checkpoint.progress}; event=${checkpoint.event}`
    )).join("\n") || "- none";

    const queuedText = receipt.queuedEvents.map((event) => (
      `- ${event.at || ""} :: ${event.checkpointId || ""} :: event=${event.eventName || ""}; rank=${event.checkpointRank || ""}; owner=${event.owner || ""}; replayCount=${event.replayCount || 0}; reason=${event.reason || ""}`
    )).join("\n") || "- none";

    const admittedText = receipt.admittedEvents.map((event) => (
      `- ${event.at || ""} :: ${event.checkpointId || ""} :: action=${event.action || ""}; status=${event.checkpointStatus || ""}; reason=${event.reason || ""}`
    )).join("\n") || "- none";

    const gapText = receipt.gapEvents.map((event) => (
      `- ${event.at || ""} :: ${event.code || ""} :: hardBlocked=${event.hardBlocked}; forwardProgressAllowed=${event.forwardProgressAllowed}; owner=${event.owner}; ${event.message}`
    )).join("\n") || "- none";

    const hardBlockText = receipt.hardBlockEvents.map((event) => (
      `- ${event.at || ""} :: ${event.code || ""} :: owner=${event.owner}; next=${event.recommendedNextFile}; ${event.message}`
    )).join("\n") || "- none";

    const errorsText = receipt.errors.map((error) => (
      `- ${error.at || ""} :: ${error.code || ""} :: ${error.message || ""}`
    )).join("\n") || "- none";

    const sourceStackText = receipt.sourceStackHeld.map((file) => `- ${file}`).join("\n");

    return [
      "HEARTH_NORTH_COMMAND_RUNTIME_TABLE_CYCLICAL_CHECKPOINT_RECEIPT",
      "",
      `contract=${receipt.contract}`,
      `receipt=${receipt.receipt}`,
      `baselineContract=${receipt.baselineContract}`,
      `version=${receipt.version}`,
      `file=${receipt.file}`,
      `route=${receipt.route}`,
      `role=${receipt.role}`,
      "",
      `canonicalPhrase=${receipt.canonicalPhrase}`,
      `cycleOrder=${receipt.cycleOrder}`,
      `cycleFormula=${receipt.cycleFormula}`,
      `cycleId=${receipt.cycleId}`,
      `currentOwner=${receipt.currentOwner}`,
      `lastOwner=${receipt.lastOwner}`,
      `checkpointStatus=${receipt.checkpointStatus}`,
      `gapDetected=${receipt.gapDetected}`,
      `gapClass=${receipt.gapClass}`,
      `forwardProgressAllowed=${receipt.forwardProgressAllowed}`,
      `recommendedNextOwner=${receipt.recommendedNextOwner}`,
      `recommendedNextFile=${receipt.recommendedNextFile}`,
      "",
      `ownsNorth=${receipt.ownsNorth}`,
      `ownsEast=${receipt.ownsEast}`,
      `ownsWest=${receipt.ownsWest}`,
      `ownsSouth=${receipt.ownsSouth}`,
      `ownsStep1=${receipt.ownsStep1}`,
      `ownsSteps2Through11=${receipt.ownsSteps2Through11}`,
      `ownsCheckpointLaw=${receipt.ownsCheckpointLaw}`,
      `ownsNewsFibonacciGovernance=${receipt.ownsNewsFibonacciGovernance}`,
      `ownsSoftGapDecisions=${receipt.ownsSoftGapDecisions}`,
      `ownsF21Eligibility=${receipt.ownsF21Eligibility}`,
      `ownsUniversalRuntimeTable=${receipt.ownsUniversalRuntimeTable}`,
      `ownsCanvasDrawing=${receipt.ownsCanvasDrawing}`,
      `ownsFinalVisualPassClaim=${receipt.ownsFinalVisualPassClaim}`,
      "",
      `eastFile=${receipt.eastFile}`,
      `westFile=${receipt.westFile}`,
      `northFile=${receipt.northFile}`,
      `southFile=${receipt.southFile}`,
      `canvasFile=${receipt.canvasFile}`,
      "",
      `gapAssessmentFast=${receipt.gapAssessmentFast}`,
      `hardBlockMode=${receipt.hardBlockMode}`,
      `softGapGovernor=${receipt.softGapGovernor}`,
      `forwardProgressAllowedWithGaps=${receipt.forwardProgressAllowedWithGaps}`,
      `blockedProgressCap=${receipt.blockedProgressCap}`,
      `readyTextRequiresF21=${receipt.readyTextRequiresF21}`,
      "",
      `checkpointBrainActive=${receipt.checkpointBrainActive}`,
      `chronologicalFibonacciAlignment=${receipt.chronologicalFibonacciAlignment}`,
      `newsFibonacciAlignment=${receipt.newsFibonacciAlignment}`,
      `oneActiveCheckpointAtATime=${receipt.oneActiveCheckpointAtATime}`,
      `futureEventsQueued=${receipt.futureEventsQueued}`,
      `completedEventsArchived=${receipt.completedEventsArchived}`,
      `regressiveEventsBlocked=${receipt.regressiveEventsBlocked}`,
      "",
      `activeCheckpointId=${receipt.activeCheckpointId}`,
      `activeCheckpointRank=${receipt.activeCheckpointRank}`,
      `activeFibonacciStage=${receipt.activeFibonacciStage}`,
      `completedCheckpoints=${receipt.completedCheckpoints}`,
      `highestCompletedCheckpointId=${receipt.highestCompletedCheckpointId}`,
      `highestCompletedRank=${receipt.highestCompletedRank}`,
      "",
      `queuedEventsCount=${receipt.queuedEventsCount}`,
      `admittedEventsCount=${receipt.admittedEventsCount}`,
      `archivedEventsCount=${receipt.archivedEventsCount}`,
      `blockedEventsCount=${receipt.blockedEventsCount}`,
      `retryEventsCount=${receipt.retryEventsCount}`,
      `warningEventsCount=${receipt.warningEventsCount}`,
      "",
      `currentStage=${receipt.currentStage}`,
      `highestStage=${receipt.highestStage}`,
      `mainDisplayProgress=${receipt.mainDisplayProgress}`,
      `mainProgressCap=${receipt.mainProgressCap}`,
      `completionLatched=${receipt.completionLatched}`,
      `f21Allowed=${receipt.f21Allowed}`,
      `f21AfterS11=${receipt.f21AfterS11}`,
      `finalReceiptAvailable=${receipt.finalReceiptAvailable}`,
      "",
      `eastReceiptPresent=${receipt.eastReceiptPresent}`,
      `eastStep1Complete=${receipt.eastStep1Complete}`,
      `eastIgnitionComplete=${receipt.eastIgnitionComplete}`,
      `eastContract=${receipt.eastContract}`,
      `eastReceipt=${receipt.eastReceipt}`,
      "",
      `westReceiptPresent=${receipt.westReceiptPresent}`,
      `westAdmissibilityComplete=${receipt.westAdmissibilityComplete}`,
      `handoffAdmissible=${receipt.handoffAdmissible}`,
      `handoffNormalized=${receipt.handoffNormalized}`,
      `westContract=${receipt.westContract}`,
      `westReceipt=${receipt.westReceipt}`,
      "",
      `northCheckpointAuthorityReady=${receipt.northCheckpointAuthorityReady}`,
      `northRuntimeTableReady=${receipt.northRuntimeTableReady}`,
      "",
      `southReceiptPresent=${receipt.southReceiptPresent}`,
      `southVisibleCompletionReady=${receipt.southVisibleCompletionReady}`,
      `southInspectReady=${receipt.southInspectReady}`,
      `southContract=${receipt.southContract}`,
      `southReceipt=${receipt.southReceipt}`,
      "",
      `newsProtocolActive=${receipt.newsProtocolActive}`,
      `northGateReady=${receipt.northGateReady}`,
      `eastGateReady=${receipt.eastGateReady}`,
      `westGateReady=${receipt.westGateReady}`,
      `southGateReady=${receipt.southGateReady}`,
      `newsGatePassedBeforeF21=${receipt.newsGatePassedBeforeF21}`,
      "",
      `mountReady=${receipt.mountReady}`,
      `cockpitFound=${receipt.cockpitFound}`,
      `copyDiagnosticReady=${receipt.copyDiagnosticReady}`,
      `receiptToggleReady=${receipt.receiptToggleReady}`,
      `inspectPlanetControlReady=${receipt.inspectPlanetControlReady}`,
      `showDiagnosticTabReady=${receipt.showDiagnosticTabReady}`,
      `diagnosticCanLeavePlanetFrame=${receipt.diagnosticCanLeavePlanetFrame}`,
      "",
      `runtimeTablePresent=${receipt.runtimeTablePresent}`,
      `runtimeTableMode=${receipt.runtimeTableMode}`,
      `runtimeTableMutation=${receipt.runtimeTableMutation}`,
      `universalRuntimeTableMutation=${receipt.universalRuntimeTableMutation}`,
      "",
      `canvasApiPresent=${receipt.canvasApiPresent}`,
      `canvasScriptPresent=${receipt.canvasScriptPresent}`,
      `canvasReady=${receipt.canvasReady}`,
      `canvasCarrierMounted=${receipt.canvasCarrierMounted}`,
      `canvasContextReady=${receipt.canvasContextReady}`,
      `dragInspectionBound=${receipt.dragInspectionBound}`,
      `atlasBuildComplete=${receipt.atlasBuildComplete}`,
      `textureComposeComplete=${receipt.textureComposeComplete}`,
      `firstFrameDetected=${receipt.firstFrameDetected}`,
      `imageRendered=${receipt.imageRendered}`,
      `visibleContentProof=${receipt.visibleContentProof}`,
      `explicitContentReceiptProof=${receipt.explicitContentReceiptProof}`,
      `visiblePlanetAvailable=${receipt.visiblePlanetAvailable}`,
      `planetCanvasPresent=${receipt.planetCanvasPresent}`,
      `planetCanvasNonZeroSize=${receipt.planetCanvasNonZeroSize}`,
      `planetFramePainted=${receipt.planetFramePainted}`,
      `nonblankPlanetVisible=${receipt.nonblankPlanetVisible}`,
      "",
      `sourceAuthorityHeld=${receipt.sourceAuthorityHeld}`,
      `climateRouteRetired=${receipt.climateRouteRetired}`,
      `canvasMutation=${receipt.canvasMutation}`,
      "",
      "CHECKPOINT_SEQUENCE",
      sequenceText,
      "",
      "QUEUED_EVENTS",
      queuedText,
      "",
      "ADMITTED_EVENTS",
      admittedText,
      "",
      "GAP_EVENTS",
      gapText,
      "",
      "HARD_BLOCK_EVENTS",
      hardBlockText,
      "",
      "ERRORS",
      errorsText,
      "",
      "SOURCE_STACK_HELD",
      sourceStackText,
      "",
      `generatedImage=${receipt.generatedImage}`,
      `graphicBox=${receipt.graphicBox}`,
      `webGL=${receipt.webGL}`,
      `visualPassClaimed=${receipt.visualPassClaimed}`,
      "",
      `updatedAt=${receipt.updatedAt}`
    ].join("\n");
  }

  function createHearthCheckpointSession(options = {}) {
    if (!options.isolatedSession && defaultSession) {
      return defaultSession;
    }

    const session = makeSession(options);

    if (!options.isolatedSession) {
      defaultSession = session;
    }

    publishGlobals();
    return session;
  }

  function createHearthCycleSession(options = {}) {
    return createHearthCheckpointSession(options);
  }

  function createHearthVisualCarrierPlan(routeOptions = {}, renderOptions = {}) {
    const snapshot = buildSystemSnapshot();

    return {
      contract: CONTRACT,
      plan: "HEARTH_NORTH_LOCAL_VISUAL_CARRIER_PLAN_v1",
      route: ROUTE,
      planetId: routeOptions.planetId || renderOptions.planetId || "hearth",
      planetLabel: routeOptions.planetLabel || renderOptions.planetLabel || "Hearth",
      northCommandTable: NORTH_FILE,
      eastFile: EAST_FILE,
      westFile: WEST_FILE,
      southFile: SOUTH_FILE,
      canvasFile: CANVAS_FILE,
      cycleOrder: CYCLE_ORDER.slice(),
      gapAssessmentFast: true,
      hardBlockMode: false,
      softGapGovernor: true,
      forwardProgressAllowedWithGaps: true,
      runtimeTableMutation: false,
      universalRuntimeTableMutation: false,
      canvasMutation: false,
      visualPassClaimed: false,
      currentSnapshot: snapshot,
      createdAt: nowIso()
    };
  }

  function receiveDirectionalReceipt(receipt = {}, owner = "") {
    if (!isObject(receipt)) return getReceipt();

    const normalizedOwner = owner || receipt.owner || receipt.direction || "";

    if (normalizedOwner === "EAST" || receipt.step1Complete === true || receipt.eastIgnitionComplete === true) {
      root.HEARTH_EAST_STEP1_HANDOFF_RECEIPT = {
        ...clonePlain(receipt),
        receivedByNorth: true,
        receivedAt: nowIso()
      };
    } else if (normalizedOwner === "WEST" || receipt.handoffAdmissible !== undefined) {
      root.HEARTH_WEST_HANDOFF_ADMISSIBILITY_RECEIPT = {
        ...clonePlain(receipt),
        receivedByNorth: true,
        receivedAt: nowIso()
      };
    } else if (normalizedOwner === "SOUTH" || receipt.visibleContentProof !== undefined) {
      root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT = {
        ...clonePlain(receipt),
        receivedByNorth: true,
        receivedAt: nowIso()
      };
    }

    if (defaultSession) defaultSession.reconcile(`receive-${normalizedOwner || "directional"}-receipt`);
    publishGlobals();
    return getReceipt();
  }

  function submitEvent(event = {}, options = {}) {
    const session = defaultSession || createHearthCheckpointSession();
    return session.submitEvent(event, options);
  }

  function reconcile(reason = "manual") {
    const session = defaultSession || createHearthCheckpointSession();
    return session.reconcile(reason);
  }

  function getReceipt() {
    const session = defaultSession || createHearthCheckpointSession();
    return session.getReceipt();
  }

  function getReceiptText() {
    return receiptToText(getReceipt());
  }

  function publishDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;
    const receipt = getReceiptLight();

    dataset.hearthNorthCommandRuntimeTableLoaded = "true";
    dataset.hearthNorthCommandRuntimeTableContract = CONTRACT;
    dataset.hearthNorthCommandRuntimeTableReceipt = RECEIPT;
    dataset.hearthNorthCommandRuntimeTableVersion = VERSION;
    dataset.hearthNorthDirectionalCycle = "true";
    dataset.hearthCyclicalCheckpointGovernance = "true";
    dataset.hearthLinearCheckpointBlocking = "false";
    dataset.hearthCycleOrder = CYCLE_ORDER.join(",");
    dataset.hearthNorthOwnsStep1 = "false";
    dataset.hearthNorthOwnsSteps2Through11 = "true";
    dataset.hearthNorthOwnsCheckpointLaw = "true";
    dataset.hearthNorthOwnsF21Eligibility = "true";
    dataset.hearthNorthOwnsCanvasDrawing = "false";
    dataset.hearthNorthOwnsUniversalRuntimeTable = "false";
    dataset.hearthGapAssessmentFast = "true";
    dataset.hearthHardBlockMode = String(receipt.hardBlockMode);
    dataset.hearthSoftGapGovernor = "true";
    dataset.hearthForwardProgressAllowedWithGaps = "true";
    dataset.hearthActiveCheckpointId = receipt.activeCheckpointId;
    dataset.hearthActiveFibonacciStage = receipt.activeFibonacciStage;
    dataset.hearthCheckpointStatus = receipt.checkpointStatus;
    dataset.hearthGapDetected = String(receipt.gapDetected);
    dataset.hearthGapClass = receipt.gapClass;
    dataset.hearthRecommendedNextOwner = receipt.recommendedNextOwner;
    dataset.hearthRecommendedNextFile = receipt.recommendedNextFile;
    dataset.hearthEastGateReady = String(receipt.eastGateReady);
    dataset.hearthWestGateReady = String(receipt.westGateReady);
    dataset.hearthNorthGateReady = String(receipt.northGateReady);
    dataset.hearthSouthGateReady = String(receipt.southGateReady);
    dataset.hearthNewsGatePassedBeforeF21 = String(receipt.newsGatePassedBeforeF21);
    dataset.hearthF21Allowed = String(receipt.f21Allowed);
    dataset.hearthCompletionLatched = String(receipt.completionLatched);
    dataset.hearthRuntimeTableMutation = "false";
    dataset.hearthUniversalRuntimeTableMutation = "false";
    dataset.hearthCanvasMutation = "false";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function getReceiptLight() {
    const snapshot = buildSystemSnapshot();
    const active = state.activeCheckpointId || "S2_INDEX_HANDOFF_ACCEPTED";
    const soft = classifySoftGap(snapshot);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: NORTH_FILE,
      role: "north-command-runtime-table",
      cyclicalCheckpointGovernance: true,
      linearCheckpointBlocking: false,
      cycleOrder: CYCLE_ORDER.join(","),
      activeCheckpointId: active,
      activeFibonacciStage: state.activeFibonacciStage,
      checkpointStatus: state.checkpointStatus || soft.checkpointStatus,
      gapDetected: state.gapDetected || soft.gapDetected,
      gapClass: state.gapClass || soft.gapClass,
      recommendedNextOwner: state.recommendedNextOwner || soft.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile || soft.recommendedNextFile,
      hardBlockMode: false,
      forwardProgressAllowedWithGaps: true,
      eastGateReady: snapshot.eastGateReady,
      westGateReady: snapshot.westGateReady,
      northGateReady: true,
      southGateReady: snapshot.southGateReady,
      newsGatePassedBeforeF21: snapshot.newsGatePassedBeforeF21,
      f21Allowed: snapshot.f21Eligible,
      completionLatched: state.completionLatched,
      runtimeTableMutation: false,
      universalRuntimeTableMutation: false,
      canvasMutation: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.HEARTH.northCommandRuntimeTable = api;
    root.HEARTH.northCommand = api;

    root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE = api;
    root.HEARTH_NORTH_COMMAND_TABLE = api;
    root.HEARTH_NORTH_COMMAND = api;
    root.HEARTH_LOCAL_COMMAND_RUNTIME_TABLE = api;
    root.HEARTH_DIRECTIONAL_CYCLE_NORTH = api;

    root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT = getReceiptLight();
    root.HEARTH_NORTH_CYCLICAL_CHECKPOINT_RECEIPT = root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT;

    root.__HEARTH_NORTH_COMMAND_RUNTIME_TABLE_FILE__ = NORTH_FILE;
    root.__HEARTH_NORTH_OWNS_UNIVERSAL_RUNTIME_TABLE__ = false;
    root.__HEARTH_NORTH_RUNTIME_TABLE_MUTATION__ = false;
    root.__HEARTH_CANVAS_MUTATION_BY_NORTH__ = false;
    root.__HEARTH_VISUAL_PASS_CLAIMED_BY_NORTH__ = false;

    publishDataset();
  }

  function startHeartbeat() {
    if (heartbeatTimer) root.clearInterval(heartbeatTimer);

    heartbeatTimer = root.setInterval(() => {
      try {
        reconcile("north-heartbeat");
      } catch (error) {
        recordError("NORTH_HEARTBEAT_RECONCILE_FAILED", error && error.message ? error.message : String(error));
      }
    }, 1000);
  }

  function boot() {
    if (!state.startedAt) {
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;
    }

    const session = defaultSession || createHearthCheckpointSession({
      sessionId: "HEARTH-NORTH-DEFAULT-CYCLE-SESSION"
    });

    recordEvent("NORTH_COMMAND_RUNTIME_TABLE_BOOTED", {
      contract: CONTRACT,
      file: NORTH_FILE,
      cycleOrder: CYCLE_ORDER
    });

    session.reconcile("north-boot");
    publishGlobals();
    startHeartbeat();

    return getReceipt();
  }

  function dispose(reason = "manual-dispose") {
    if (heartbeatTimer) {
      root.clearInterval(heartbeatTimer);
      heartbeatTimer = 0;
    }

    recordEvent("NORTH_COMMAND_RUNTIME_TABLE_DISPOSED", {
      reason
    });
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: NORTH_FILE,
    route: ROUTE,
    role: "north-command-runtime-table",

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,

    createHearthCheckpointSession,
    createHearthCycleSession,
    createHearthVisualCarrierPlan,

    submitEvent,
    submit: submitEvent,
    receiveEvent: submitEvent,
    reconcile,
    receiveDirectionalReceipt,

    getReceipt,
    getReceiptText,

    checkpointByEvent,
    checkpointById,
    buildSystemSnapshot,

    supportsDirectionalCycle: true,
    supportsCyclicalCheckpointGovernance: true,
    supportsLinearCheckpointBlocking: false,
    supportsNewsFibonacciAlignment: true,
    supportsSoftGapGovernor: true,
    supportsForwardProgressWithGaps: true,
    supportsHardBlockOnlyForKillConditions: true,
    supportsF21EligibilityLaw: true,

    ownsNorth: true,
    ownsEast: false,
    ownsWest: false,
    ownsSouth: false,
    ownsStep1: false,
    ownsSteps2Through11: true,
    ownsCheckpointLaw: true,
    ownsUniversalRuntimeTable: false,
    ownsCanvasDrawing: false,
    ownsFinalVisualPassClaim: false,

    eastFile: EAST_FILE,
    westFile: WEST_FILE,
    northFile: NORTH_FILE,
    southFile: SOUTH_FILE,
    canvasFile: CANVAS_FILE,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    },

    get defaultSession() {
      return defaultSession;
    }
  };

  publishGlobals();

  if (doc && doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", () => {
      boot();
    }, { once: true });
  } else {
    boot();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

// /showroom/globe/hearth/hearth.js
// HEARTH_SOUTH_ROUTE_CONDUCTOR_ALIAS_PUBLISHED_PARENT_FIRST_BOOT_TNT_v1
// Full-file replacement.
// South route conductor / visible completion authority only.
// Purpose:
// - Preserve South route conductor baseline, postgame dedup, inspect gate, receipt compaction,
//   strict proof/degrade reconciliation, active canvas expectation, split adapter proof bridge,
//   and transistor gate read.
// - Split responsibility cleanly with /showroom/globe/hearth/index.js:
//   - index.js owns East Step 1, first paint, script order, mount/cockpit, shared ledger,
//     route-safe recognition, and handoff publication.
//   - hearth.js owns South route-conductor runtime, Canvas parent boot request,
//     Canvas receipt reconciliation, visible completion governance, inspect gate,
//     and F21 latch attempt through North/NEWS gates.
// - Publish route-conductor aliases and receipt markers immediately so East can recognize
//   this file after load.
// - Correct the hard-stop inversion: South may not demand Canvas child proof before the Canvas
//   North parent has been allowed to boot and load its own children.
// - Classify Canvas split-child readiness in phases:
//   PRE_PARENT -> PARENT_BOOT_ALLOWED -> PARENT_ATTEMPTED -> POST_PARENT_READY / POST_PARENT_DEGRADED / POST_PARENT_FAILED.
// - Treat missing child methods before parent boot as observation only, not a hard block.
// - Treat child failure as hard only after parent boot has been attempted and the parent receipt proves failure.
// - Latch F21 only through North/NEWS gates; Canvas remains F13 evidence only.
// Does not own:
// - North checkpoint truth
// - East first-paint shell
// - East script loading
// - West gap taxonomy
// - Lab South visible-state composer
// - canvas drawing
// - canvas child files
// - terrain/source truth
// - hydrology
// - materials
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_SOUTH_ROUTE_CONDUCTOR_ALIAS_PUBLISHED_PARENT_FIRST_BOOT_TNT_v1";
  const RECEIPT = "HEARTH_SOUTH_ROUTE_CONDUCTOR_ALIAS_PUBLISHED_PARENT_FIRST_BOOT_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_SOUTH_PARENT_FIRST_CANVAS_BOOT_GATE_RECONCILIATION_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_SOUTH_ROUTE_CONDUCTOR_SPLIT_CHILD_LOADER_GATE_RECONCILIATION_TNT_v1";
  const VERSION = "2026-05-30.hearth-south-route-conductor-alias-published-parent-first-boot-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/showroom/globe/hearth/hearth.js";

  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const EAST_BRANCH_FILE = "/assets/lab/runtime-table.east.js";
  const WEST_BRANCH_FILE = "/assets/lab/runtime-table.west.js";
  const SOUTH_BRANCH_FILE = "/assets/lab/runtime-table.south.js";

  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const CANVAS_EAST_FILE = "/assets/hearth/hearth.canvas.east.js";
  const CANVAS_WEST_FILE = "/assets/hearth/hearth.canvas.west.js";
  const CANVAS_SOUTH_FILE = "/assets/hearth/hearth.canvas.south.js";

  const EXPECTED_CANVAS_CONTRACT = "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION_TNT_v1";
  const EXPECTED_CANVAS_RECEIPT = "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION_RECEIPT_v1";

  const EXPECTED_CANVAS_SPLIT_CONTRACT = "HEARTH_CANVAS_SPLIT_ADAPTER_TRANSISTOR_GATE_NORTH_PARENT_TNT_v1";
  const EXPECTED_CANVAS_SPLIT_RECEIPT = "HEARTH_CANVAS_SPLIT_ADAPTER_TRANSISTOR_GATE_NORTH_PARENT_RECEIPT_v1";

  const ACCEPTED_PREVIOUS_CANVAS_SPLIT_CONTRACT = "HEARTH_CANVAS_CARDINAL_SPLIT_NORTH_PARENT_TNT_v2";
  const ACCEPTED_PREVIOUS_CANVAS_SPLIT_RECEIPT = "HEARTH_CANVAS_CARDINAL_SPLIT_NORTH_PARENT_RECEIPT_v2";

  const ACCEPTED_PREVIOUS_CANVAS_CONTRACT = "HEARTH_CANVAS_UPSTREAM_FIRST_SEVEN_CONTINENT_FALLBACK_ZOOM_LOD_TNT_v2";
  const ACCEPTED_PREVIOUS_CANVAS_RECEIPT = "HEARTH_CANVAS_UPSTREAM_FIRST_SEVEN_CONTINENT_FALLBACK_ZOOM_LOD_RECEIPT_v2";

  const LEGACY_TRANSITIONAL_CANVAS_CONTRACT = "HEARTH_SEVEN_CONTINENT_TRANSITIONAL_CANVAS_VISUAL_FIELD_TNT_v1";
  const LEGACY_TRANSITIONAL_CANVAS_RECEIPT = "HEARTH_SEVEN_CONTINENT_TRANSITIONAL_CANVAS_VISUAL_FIELD_RECEIPT_v1";

  const ACCEPTED_CANVAS_CONTRACTS = Object.freeze([
    EXPECTED_CANVAS_CONTRACT,
    ACCEPTED_PREVIOUS_CANVAS_CONTRACT,
    LEGACY_TRANSITIONAL_CANVAS_CONTRACT
  ]);

  const ACCEPTED_CANVAS_RECEIPTS = Object.freeze([
    EXPECTED_CANVAS_RECEIPT,
    ACCEPTED_PREVIOUS_CANVAS_RECEIPT,
    LEGACY_TRANSITIONAL_CANVAS_RECEIPT
  ]);

  const ACCEPTED_SPLIT_CONTRACTS = Object.freeze([
    EXPECTED_CANVAS_SPLIT_CONTRACT,
    ACCEPTED_PREVIOUS_CANVAS_SPLIT_CONTRACT
  ]);

  const ACCEPTED_SPLIT_RECEIPTS = Object.freeze([
    EXPECTED_CANVAS_SPLIT_RECEIPT,
    ACCEPTED_PREVIOUS_CANVAS_SPLIT_RECEIPT
  ]);

  const CANVAS_RETRY_LIMIT = 26;
  const CANVAS_RETRY_DELAY_MS = 180;

  const MAX_EVENTS = 160;
  const MAX_LOCAL_EVENTS = 140;
  const MAX_ERRORS = 100;

  const CHILD_METHODS = Object.freeze({
    east: ["buildAtlas", "sample", "read", "getReceipt"],
    west: ["bindInspection", "getViewState", "setRotation", "resetRotation", "setZoom", "getReceipt"],
    south: [
      "composeTexture",
      "renderSphere",
      "renderSphereSync",
      "getTextureCanvas",
      "sampleVisibleContent",
      "classifyVisibleContentEvidence",
      "invalidateTexture",
      "getReceipt"
    ]
  });

  const PROGRESS_ONLY_EVENTS = new Set([
    "ATLAS_BUILD_PROGRESS",
    "TEXTURE_COMPOSE_PROGRESS",
    "SPHERE_RENDER_PROGRESS",
    "CANVAS_PROGRESS",
    "RENDER_PROGRESS",
    "TEXTURE_INVALIDATED",
    "ATLAS_REBUILD_PROGRESS",
    "TEXTURE_REBUILD_PROGRESS"
  ]);

  const CHECKPOINTS = Object.freeze([
    ["F1A_HTML_SHELL_RENDERED", 1, "F1A", "HTML_SHELL_RENDERED", "East shell rendered", ["EAST_HTML_SHELL_RENDERED", "HTML_READY", "SHELL_READY"]],
    ["F1B_LOAD_LEDGER_INITIALIZED", 2, "F1B", "LOAD_LEDGER_INITIALIZED", "Load ledger initialized", ["HEARTH_LOAD_LEDGER_MONOTONIC_INITIALIZED", "NEWS_FIBONACCI_LEDGER_GUARD_ACTIVE", "EAST_LOAD_LEDGER_INITIALIZED"]],
    ["F2_FIRST_PAINT_COCKPIT_VISIBLE", 3, "F2", "FIRST_PAINT_COCKPIT_VISIBLE", "First-paint cockpit visible", ["EAST_FIRST_PAINT_COCKPIT_VISIBLE", "COCKPIT_VISIBLE", "FIRST_PAINT_READY"]],
    ["F3_SCRIPT_ORDER_COMPLETE", 4, "F3", "SCRIPT_ORDER_COMPLETE", "Script order complete", ["SCRIPT_LOADED", "SCRIPT_ORDER_VISIBLE", "EAST_SCRIPT_ORDER_VISIBILITY_ACTIVE"]],
    ["F5_AUTHORITY_AVAILABILITY_READY", 5, "F5", "AUTHORITY_AVAILABILITY_READY", "Authority availability ready", ["RUNTIME_TABLE_AVAILABLE", "AUTHORITY_AVAILABLE", "WEST_HANDOFF_TABLE_PRESENT"]],
    ["F8_CONDUCTOR_HYDRATED", 6, "F8", "CONDUCTOR_HYDRATED", "Conductor hydrated", ["CONDUCTOR_HYDRATED_EXISTING_COCKPIT", "COHERENCE_SEMICONDUCTOR_BOOTED", "SOUTH_ROUTE_CONDUCTOR_BOOTED"]],
    ["F13A_CANVAS_COOPERATIVE_BOOT_STARTED", 7, "F13A", "CANVAS_COOPERATIVE_BOOT_STARTED", "Canvas cooperative boot started", ["CANVAS_BOOT_STARTED"]],
    ["F13B_CANVAS_MOUNT_CREATED", 8, "F13B", "CANVAS_MOUNT_CREATED", "Canvas mount created", ["CANVAS_CARRIER_MOUNTED", "CANVAS_MOUNT_READY"]],
    ["F13C_CANVAS_CONTEXT_READY", 9, "F13C", "CANVAS_CONTEXT_READY", "Canvas context ready", ["CANVAS_2D_CONTEXT_READY", "CONTEXT_READY"]],
    ["F13D_DRAG_INSPECTION_BOUND", 10, "F13D", "DRAG_INSPECTION_BOUND", "Drag inspection bound", ["INSPECT_DRAG_BOUND", "POINTER_INSPECTION_BOUND"]],
    ["F13E_ATLAS_BUILD_STARTED", 11, "F13E", "ATLAS_BUILD_STARTED", "Atlas build started", ["ATLAS_STARTED"]],
    ["F13F_ATLAS_BUILD_COMPLETE", 12, "F13F", "ATLAS_BUILD_COMPLETE", "Atlas build complete", ["ATLAS_COMPLETE"]],
    ["F13G_TEXTURE_COMPOSE_STARTED", 13, "F13G", "TEXTURE_COMPOSE_STARTED", "Texture compose started", ["TEXTURE_STARTED"]],
    ["F13H_TEXTURE_COMPOSE_COMPLETE", 14, "F13H", "TEXTURE_COMPOSE_COMPLETE", "Texture compose complete", ["TEXTURE_COMPLETE"]],
    ["F13I_FIRST_FRAME_REQUESTED", 15, "F13I", "FIRST_FRAME_REQUESTED", "First frame requested", ["FRAME_REQUESTED"]],
    ["F13J_FIRST_FRAME_DETECTED", 16, "F13J", "FIRST_FRAME_DETECTED", "First frame detected", ["FRAME_DETECTED"]],
    ["F13K_CANVAS_READY", 17, "F13K", "CANVAS_READY", "Canvas ready", ["CANVAS_COMPLETE"]],
    ["F13L_VISIBLE_CONTENT_PROOF_STARTED", 18, "F13L", "VISIBLE_CONTENT_PROOF_STARTED", "Visible proof started", ["VISIBLE_PROOF_STARTED"]],
    ["F13M_VISIBLE_CONTENT_PROOF_PASSED", 19, "F13M", "VISIBLE_CONTENT_PROOF_PASSED", "Visible proof passed", ["DEGRADED_VISIBLE_CONTENT_ACCEPTED", "VISIBLE_CONTENT_SOFT_GAP", "VISIBLE_CONTENT_ADMISSIBLE", "VISIBLE_FORWARD_PROGRESS"]],
    ["F13N_INSPECT_MODE_READY", 20, "F13N", "INSPECT_MODE_READY", "Inspect mode ready", ["DEGRADED_INSPECT_MODE_ACCEPTED", "INSPECT_FALLBACK_READY", "RECEIPT_FALLBACK_READY"]],
    ["F21_COMPLETION_LATCHED", 21, "F21", "COMPLETION_LATCHED", "Completion latched", ["COMPLETION_LATCHED_AFTER_VISIBLE_CONTENT_PROOF", "COMPLETION_LATCHED_AFTER_CANVAS_READY", "F21_DEGRADED_COMPLETION_LATCHED"]]
  ].map(([id, rank, fibonacci, event, label, aliases]) => ({ id, rank, fibonacci, event, label, aliases })));

  const CHECKPOINT_BY_ID = CHECKPOINTS.reduce((map, item) => {
    map[item.id] = item;
    return map;
  }, {});

  const CHECKPOINT_BY_EVENT = CHECKPOINTS.reduce((map, item) => {
    map[item.event] = item;
    map[item.fibonacci] = item;
    item.aliases.forEach((alias) => {
      map[alias] = item;
    });
    return map;
  }, {});

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "south-route-conductor-alias-published-parent-first-boot",

    indexOwnsEastStep1: true,
    indexOwnsScriptOrder: true,
    indexOwnsRouteSafeRecognition: true,
    southPublishesRouteConductorAliases: true,
    southOwnsRouteConductorRuntime: true,

    postgameDedupActive: true,
    inspectGateActive: true,
    receiptCompactionActive: true,
    strictProofDegradeReconciliationActive: true,
    canvasNestedReceiptBridgeActive: true,
    canvasActiveExpectationBridgeRenewalActive: true,
    canvasSplitAdapterProofBridgeActive: true,
    splitChildLoaderGateActive: true,
    parentFirstCanvasBootGateActive: true,
    preBootChildHardBlockRetired: true,
    transistorGateReadActive: true,
    aliasPublicationActive: true,

    cycleOrder: "EAST -> WEST -> NORTH -> SOUTH -> CHECKPOINT -> EAST",
    transmissionMode: true,
    oneActiveGearAtATime: true,
    activeGearProgressResets: true,
    visibleProgressRepresentsCurrentGearOnly: true,

    indexFile: INDEX_FILE,
    northFile: NORTH_FILE,
    eastBranchFile: EAST_BRANCH_FILE,
    westBranchFile: WEST_BRANCH_FILE,
    southBranchFile: SOUTH_BRANCH_FILE,
    canvasFile: CANVAS_FILE,
    canvasEastFile: CANVAS_EAST_FILE,
    canvasWestFile: CANVAS_WEST_FILE,
    canvasSouthFile: CANVAS_SOUTH_FILE,

    northPresent: false,
    eastBranchPresent: false,
    westBranchPresent: false,
    southBranchPresent: false,
    canvasPresent: false,
    indexPresent: false,
    sessionPresent: false,
    sessionCreatedBySouth: false,

    activeIndex: 0,
    completedCheckpoints: [],
    degradedCheckpoints: [],
    reconciledCheckpointIds: [],
    reconciledCanvasKeys: [],

    queuedEvents: [],
    archivedEvents: [],
    blockedEvents: [],
    admittedEvents: [],
    submittedEvents: [],
    localEvents: [],
    errors: [],

    progressOnlyEventCounts: {},
    progressOnlyEventLast: {},
    duplicateCompletedEventCount: 0,
    duplicatePostgameEventCount: 0,
    unknownEventCount: 0,
    compactArchiveCount: 0,

    canvasBootRequested: false,
    canvasBootStarted: false,
    canvasBootComplete: false,
    canvasBootAttempts: 0,
    canvasBootError: "",
    canvasRetryTimer: 0,
    lastCanvasReceiptSignature: "",

    canvasParentPresent: false,
    canvasParentBootMethodAvailable: false,
    canvasParentBootMethod: "",
    canvasParentBootGatePhase: "PRE_PARENT",
    canvasParentBootAllowed: false,
    canvasParentBootAttempted: false,
    canvasParentBootResolved: false,
    canvasParentBootRejected: false,
    canvasParentBootResultReceived: false,
    canvasBootBlockedByChildGate: false,

    canvasChildGatePhase: "PRE_PARENT",
    canvasChildGateWaiting: false,
    canvasChildGatePostParentFailure: false,
    canvasChildGatePostParentDegraded: false,
    canvasChildGateLastMissing: "",
    canvasChildGateLastProofAt: "",
    preParentChildMissingObservation: "",
    preParentChildMissingIsHardBlock: false,

    inspectModeAvailable: false,
    inspectPlanetControlAvailable: false,
    diagnosticCanLeavePlanetFrame: false,
    diagnosticDockHiddenForInspection: false,
    showDiagnosticTabVisible: false,
    diagnosticDockRestorable: true,
    copyDiagnosticPreserved: true,
    receiptToggleReady: true,
    buttonsReachable: true,
    receiptOverlayIndependent: true,

    strictVisibleProof: false,
    softGapVisibleProof: false,
    hardFailVisibleProof: false,
    strictInspectReady: false,
    fallbackInspectReady: false,

    completionLatched: false,
    degradedCompletionLatched: false,
    completionClosed: false,
    readyTextAllowed: false,
    f21LatchMode: "WAITING",

    latestEvent: "SOUTH_ROUTE_CONDUCTOR_ALIAS_PUBLISHED_PARENT_FIRST_BOOT_LOADED",
    postgameStatus: "SOUTH_ROUTE_CONDUCTOR_ALIAS_PUBLISHED_PARENT_FIRST_BOOT_LOADED",
    firstFailedCoordinate: "WAITING_BOOT",
    recommendedNextRenewalTarget: FILE,

    latestNorthResult: null,
    latestComposerPacket: null,
    latestCanvasReceipt: null,

    renderCount: 0,
    watchdogTicks: 0,
    booted: false,
    booting: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    startedAt: "",
    updatedAt: ""
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
    collapseButton: null,
    showTab: null,
    status: null
  };

  let bootPromise = null;
  let canvasBootPromise = null;
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
      if (Array.isArray(value)) return value.slice();
      return { ...value };
    }
  }

  function trimArray(array, max) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
  }

  function arrayPushUnique(array, value) {
    if (!array.includes(value)) array.push(value);
  }

  function readPath(path) {
    if (!path) return null;

    const parts = String(path).split(".");
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function getByNames(names) {
    for (const name of names || []) {
      const found = readPath(name);
      if (found) return found;
    }

    return null;
  }

  function checkpointFrom(value) {
    if (!value) return null;
    const key = safeString(value);
    return CHECKPOINT_BY_ID[key] || CHECKPOINT_BY_EVENT[key] || null;
  }

  function activeCheckpoint() {
    return CHECKPOINTS[Math.max(0, Math.min(CHECKPOINTS.length - 1, state.activeIndex))] || CHECKPOINTS[0];
  }

  function highestCompletedCheckpoint() {
    if (!state.completedCheckpoints.length) return null;
    return checkpointFrom(state.completedCheckpoints[state.completedCheckpoints.length - 1]);
  }

  function isCompleted(checkpointId) {
    return state.completedCheckpoints.includes(checkpointId);
  }

  function recordLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event,
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents, MAX_LOCAL_EVENTS);

    state.latestEvent = event;
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, message, detail = {}) {
    const item = {
      at: nowIso(),
      code,
      message: safeString(message),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimArray(state.errors, MAX_ERRORS);

    state.updatedAt = item.at;
    return item;
  }

  function countProgressOnlyEvent(eventName, detail = {}) {
    const name = safeString(eventName, "UNKNOWN_PROGRESS_EVENT");

    state.progressOnlyEventCounts[name] = (state.progressOnlyEventCounts[name] || 0) + 1;
    state.progressOnlyEventLast[name] = {
      at: nowIso(),
      event: name,
      detail: clonePlain(detail)
    };

    state.latestEvent = name;
    state.updatedAt = state.progressOnlyEventLast[name].at;
    scheduleRender();

    return {
      accepted: true,
      action: "COUNT_ONLY",
      reason: "progress-only-telemetry-not-failure",
      event: name
    };
  }

  function compactArchive(reason, eventName, gear, detail = {}) {
    state.compactArchiveCount += 1;

    if (
      reason === "duplicate-completed-gear-archived" ||
      reason === "duplicate-postgame-event-suppressed" ||
      reason === "postgame-closed-duplicate-suppressed"
    ) {
      state.duplicateCompletedEventCount += 1;
      if (state.completionClosed) state.duplicatePostgameEventCount += 1;
    }

    const item = {
      at: nowIso(),
      event: safeString(eventName),
      checkpointId: gear ? gear.id : "",
      action: "ARCHIVE",
      reason,
      detail: clonePlain(detail)
    };

    state.archivedEvents.push(item);
    trimArray(state.archivedEvents, MAX_EVENTS);

    return item;
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

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;

    if (authority.contract || authority.receipt || authority.version || authority.file) return authority;

    return null;
  }

  function datasetField(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function publishEarlyMarker() {
    root.__HEARTH_ROUTE_CONDUCTOR_MARKER__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_FILE__ = FILE;
    root.__HEARTH_ROUTE_CONDUCTOR_CONTRACT__ = CONTRACT;
    root.__HEARTH_ROUTE_CONDUCTOR_RECEIPT__ = RECEIPT;

    if (doc && doc.documentElement) {
      const dataset = doc.documentElement.dataset;
      dataset.hearthRouteConductorMarkerPresent = "true";
      dataset.hearthRouteConductorLoaded = "true";
      dataset.hearthRouteConductorPresent = "true";
      dataset.hearthRouteConductorContract = CONTRACT;
      dataset.hearthRouteConductorReceipt = RECEIPT;
      dataset.hearthSouthRouteConductorLoaded = "true";
      dataset.hearthSouthRouteConductorPresent = "true";
      dataset.hearthSouthRouteConductorContract = CONTRACT;
      dataset.hearthSouthRouteConductorReceipt = RECEIPT;
      dataset.hearthSouthAliasesPublished = "true";
      dataset.generatedImage = "false";
      dataset.graphicBox = "false";
      dataset.webgl = "false";
      dataset.visualPassClaimed = "false";
    }
  }

  publishEarlyMarker();

  function readIndexApi() {
    return getByNames([
      "HEARTH_EAST_STEP1_IGNITION",
      "HEARTH_INDEX_BRIDGE",
      "HEARTH_INDEX_JS",
      "HEARTH.indexBridge",
      "HEARTH.eastStep1Ignition"
    ]);
  }

  function readCanvasApi() {
    return getByNames([
      "HEARTH_CANVAS",
      "HEARTH_CANVAS_AUTHORITY",
      "HEARTH_CANVAS_EVIDENCE",
      "HEARTH_CANVAS_TEXTURE",
      "HEARTH_CANVAS_NORTH",
      "HEARTH_CANVAS_VISUAL_FIDELITY",
      "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION",
      "HEARTH_CANVAS_SPLIT_ADAPTER",
      "HEARTH_CANVAS_TRANSISTOR_GATE",
      "HEARTH.canvas",
      "HEARTH.canvasAuthority",
      "HEARTH.canvasEvidence",
      "HEARTH.canvasNorth",
      "HEARTH.canvasSplitAdapter",
      "HEARTH.canvasTransistorGate",
      "DEXTER_LAB.hearthCanvasEvidence",
      "DEXTER_LAB.hearthCanvasNorth",
      "DEXTER_LAB.hearthCanvasSplitAdapter",
      "DEXTER_LAB.hearthCanvasTransistorGate",
      "DEXTER_LAB.hearthCanvasVisualFidelity",
      "DEXTER_LAB.hearthCanvasMaterialsReliefConsumptionInvalidation"
    ]);
  }

  function readCanvasReceipt() {
    const api = readCanvasApi();
    const receipt = readReceipt(api);

    if (receipt) {
      state.latestCanvasReceipt = receipt;
      return receipt;
    }

    const fallback =
      root.HEARTH_CANVAS_RECEIPT ||
      root.HEARTH_CANVAS_POSTGAME_RECEIPT ||
      root.HEARTH_CANVAS_EVIDENCE_RECEIPT ||
      null;

    if (fallback && isObject(fallback)) {
      state.latestCanvasReceipt = fallback;
      return fallback;
    }

    return {};
  }

  function readCanvasChildApi(key) {
    const names = key === "east"
      ? [
        "HEARTH_CANVAS_EAST",
        "HEARTH.canvasEast",
        "HEARTH.canvasEastMaterialAtlasSourceMachine",
        "DEXTER_LAB.hearthCanvasEast",
        "DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachine"
      ]
      : key === "west"
        ? [
          "HEARTH_CANVAS_WEST",
          "HEARTH.canvasWest",
          "DEXTER_LAB.hearthCanvasWest"
        ]
        : [
          "HEARTH_CANVAS_SOUTH",
          "HEARTH.canvasSouth",
          "DEXTER_LAB.hearthCanvasSouth"
        ];

    return getByNames(names);
  }

  function readCanvasChildReceipt(key) {
    const authority = readCanvasChildApi(key);
    return readReceipt(authority) || {};
  }

  function missingChildMethods(key, authority) {
    const methods = CHILD_METHODS[key] || [];
    if (!authority) return methods.slice();
    return methods.filter((method) => !isFunction(authority[method]));
  }

  function childMissingTextFromApis() {
    return ["east", "west", "south"].map((key) => {
      const api = readCanvasChildApi(key);
      const missing = missingChildMethods(key, api);
      return missing.length ? `${key}:${missing.join(",")}` : "";
    }).filter(Boolean).join("; ");
  }

  function selectCanvasBootMethod(canvas) {
    if (!canvas || !isObject(canvas)) return "";
    if (isFunction(canvas.bootCooperative)) return "bootCooperative";
    if (isFunction(canvas.boot)) return "boot";
    if (isFunction(canvas.render)) return "render";
    if (isFunction(canvas.mount)) return "mount";
    return "";
  }

  function buildCanvasReceiptBridge(canvas = readCanvasReceipt()) {
    const source = isObject(canvas) ? canvas : {};
    const canvasApi = readCanvasApi();
    const canvasParentPresent = Boolean(canvasApi);
    const parentMethod = selectCanvasBootMethod(canvasApi);

    const eastApi = readCanvasChildApi("east");
    const westApi = readCanvasChildApi("west");
    const southApi = readCanvasChildApi("south");

    const eastReceipt = readCanvasChildReceipt("east");
    const westReceipt = readCanvasChildReceipt("west");
    const southReceipt = readCanvasChildReceipt("south");

    const canvasContract = safeString(source.contract || datasetField("hearthCanvasContract", ""), "");
    const canvasReceipt = safeString(source.receipt || datasetField("hearthCanvasReceipt", ""), "");
    const splitContract = safeString(source.splitContract || datasetField("hearthCanvasSplitContract", ""), "");
    const splitReceipt = safeString(source.splitReceipt || datasetField("hearthCanvasSplitReceipt", ""), "");

    const canvasContractMatchesExpected = canvasContract === EXPECTED_CANVAS_CONTRACT;
    const canvasReceiptMatchesExpected = canvasReceipt === EXPECTED_CANVAS_RECEIPT;
    const splitContractMatchesExpected = splitContract === EXPECTED_CANVAS_SPLIT_CONTRACT;
    const splitReceiptMatchesExpected = splitReceipt === EXPECTED_CANVAS_SPLIT_RECEIPT;

    const canvasCardinalSplitActive = safeBool(
      source.cardinalSplitActive,
      safeBool(datasetField("hearthCanvasCardinalSplitActive", ""), false)
    );

    const canvasTransistorSplitActive = safeBool(
      source.transistorAdapterActive || source.splitAdapterActive,
      safeBool(datasetField("hearthCanvasTransistorAdapterActive", ""), false)
    );

    const canvasNorthActive = safeBool(
      source.canvasNorthActive,
      safeBool(datasetField("hearthCanvasNorthActive", ""), canvasParentPresent)
    );

    const eastMissing = safeString(
      source.canvasEastMissingMethods || datasetField("hearthCanvasEastMissingMethods", ""),
      missingChildMethods("east", eastApi).join(",")
    );

    const westMissing = safeString(
      source.canvasWestMissingMethods || datasetField("hearthCanvasWestMissingMethods", ""),
      missingChildMethods("west", westApi).join(",")
    );

    const southMissing = safeString(
      source.canvasSouthMissingMethods || datasetField("hearthCanvasSouthMissingMethods", ""),
      missingChildMethods("south", southApi).join(",")
    );

    const canvasEastPresent = safeBool(
      source.canvasEastPresent,
      safeBool(datasetField("hearthCanvasEastPresent", ""), Boolean(eastApi || eastReceipt.contract || eastReceipt.receipt))
    );

    const canvasWestPresent = safeBool(
      source.canvasWestPresent,
      safeBool(datasetField("hearthCanvasWestPresent", ""), Boolean(westApi || westReceipt.contract || westReceipt.receipt))
    );

    const canvasSouthPresent = safeBool(
      source.canvasSouthPresent,
      safeBool(datasetField("hearthCanvasSouthPresent", ""), Boolean(southApi || southReceipt.contract || southReceipt.receipt))
    );

    const canvasEastReady = safeBool(
      source.canvasEastReady,
      safeBool(datasetField("hearthCanvasEastReady", ""), Boolean(eastApi && !missingChildMethods("east", eastApi).length))
    );

    const canvasWestReady = safeBool(
      source.canvasWestReady,
      safeBool(datasetField("hearthCanvasWestReady", ""), Boolean(westApi && !missingChildMethods("west", westApi).length))
    );

    const canvasSouthReady = safeBool(
      source.canvasSouthReady,
      safeBool(datasetField("hearthCanvasSouthReady", ""), Boolean(southApi && !missingChildMethods("south", southApi).length))
    );

    const allCanvasChildrenReady = safeBool(
      source.allCanvasChildrenReady,
      safeBool(datasetField("hearthCanvasAllChildrenReady", ""), canvasEastReady && canvasWestReady && canvasSouthReady)
    );

    const childLoadAttempted = safeBool(source.childLoadAttempted, safeBool(datasetField("hearthCanvasChildLoadAttempted", ""), false));
    const childLoadComplete = safeBool(source.childLoadComplete, safeBool(datasetField("hearthCanvasChildLoadComplete", ""), false));
    const childLoadError = safeString(source.childLoadError || datasetField("hearthCanvasChildLoadError", ""), "");

    const splitAdapterRecognized = Boolean(
      splitContractMatchesExpected ||
      splitReceiptMatchesExpected ||
      ACCEPTED_SPLIT_CONTRACTS.includes(splitContract) ||
      ACCEPTED_SPLIT_RECEIPTS.includes(splitReceipt) ||
      canvasCardinalSplitActive ||
      canvasTransistorSplitActive ||
      canvasNorthActive ||
      canvasEastPresent ||
      canvasWestPresent ||
      canvasSouthPresent ||
      childLoadAttempted
    );

    const splitAdapterStrictProof = Boolean(
      splitContractMatchesExpected &&
      splitReceiptMatchesExpected &&
      canvasNorthActive &&
      canvasEastReady &&
      canvasWestReady &&
      canvasSouthReady &&
      allCanvasChildrenReady
    );

    const splitAdapterSoftProof = Boolean(
      splitAdapterRecognized &&
      canvasNorthActive &&
      (
        allCanvasChildrenReady ||
        childLoadComplete ||
        (canvasEastPresent && canvasWestPresent && canvasSouthPresent) ||
        state.canvasParentBootAttempted
      )
    );

    return {
      canvasReceiptBridgeActive: true,
      canvasNestedReceiptAvailable: Boolean(canvasContract || canvasReceipt),
      canvasActiveExpectationBridgeRenewalActive: true,
      canvasSplitAdapterProofBridgeActive: true,
      splitChildLoaderGateActive: true,
      parentFirstCanvasBootGateActive: true,
      preBootChildHardBlockRetired: true,
      transistorGateReadActive: true,

      canvasParentPresent,
      canvasParentBootMethodAvailable: Boolean(parentMethod),
      canvasParentBootMethod: parentMethod,

      canvasContract,
      canvasReceipt,

      canvasExpectedContract: EXPECTED_CANVAS_CONTRACT,
      canvasExpectedReceipt: EXPECTED_CANVAS_RECEIPT,
      canvasContractMatchesExpected,
      canvasReceiptMatchesExpected,

      canvasContractAcceptedLineage: ACCEPTED_CANVAS_CONTRACTS.includes(canvasContract),
      canvasReceiptAcceptedLineage: ACCEPTED_CANVAS_RECEIPTS.includes(canvasReceipt),

      staleCanvasExpectationRenewed: true,
      oldTransitionalCanvasExpectationRetired: true,
      activeMaterialsReliefCanvasExpected: true,

      canvasSplitContract: splitContract,
      canvasSplitReceipt: splitReceipt,
      canvasExpectedSplitContract: EXPECTED_CANVAS_SPLIT_CONTRACT,
      canvasExpectedSplitReceipt: EXPECTED_CANVAS_SPLIT_RECEIPT,
      canvasAcceptedPreviousSplitContract: ACCEPTED_PREVIOUS_CANVAS_SPLIT_CONTRACT,
      canvasAcceptedPreviousSplitReceipt: ACCEPTED_PREVIOUS_CANVAS_SPLIT_RECEIPT,
      canvasSplitContractMatchesExpected: splitContractMatchesExpected,
      canvasSplitReceiptMatchesExpected: splitReceiptMatchesExpected,
      canvasSplitContractAcceptedLineage: ACCEPTED_SPLIT_CONTRACTS.includes(splitContract),
      canvasSplitReceiptAcceptedLineage: ACCEPTED_SPLIT_RECEIPTS.includes(splitReceipt),
      canvasSplitAdapterRecognized: splitAdapterRecognized,
      canvasSplitAdapterStrictProof: splitAdapterStrictProof,
      canvasSplitAdapterSoftProof: splitAdapterSoftProof,

      canvasCardinalSplitActive,
      canvasTransistorSplitActive,
      canvasNorthActive,
      canvasEastFile: safeString(source.canvasEastFile || CANVAS_EAST_FILE, CANVAS_EAST_FILE),
      canvasWestFile: safeString(source.canvasWestFile || CANVAS_WEST_FILE, CANVAS_WEST_FILE),
      canvasSouthFile: safeString(source.canvasSouthFile || CANVAS_SOUTH_FILE, CANVAS_SOUTH_FILE),

      canvasEastPresent,
      canvasWestPresent,
      canvasSouthPresent,
      canvasEastReady,
      canvasWestReady,
      canvasSouthReady,
      allCanvasChildrenReady,
      childLoadAttempted,
      childLoadComplete,
      childLoadError,

      canvasEastMissingMethods: eastMissing,
      canvasWestMissingMethods: westMissing,
      canvasSouthMissingMethods: southMissing,
      canvasChildGateMissingText: [
        eastMissing ? `east:${eastMissing}` : "",
        westMissing ? `west:${westMissing}` : "",
        southMissing ? `south:${southMissing}` : ""
      ].filter(Boolean).join("; ") || childMissingTextFromApis(),

      canvasEastContract: safeString(eastReceipt.contract || source.canvasEastContract || "", ""),
      canvasWestContract: safeString(westReceipt.contract || source.canvasWestContract || "", ""),
      canvasSouthContract: safeString(southReceipt.contract || source.canvasSouthContract || "", ""),
      canvasEastReceipt: safeString(eastReceipt.receipt || source.canvasEastReceipt || "", ""),
      canvasWestReceipt: safeString(westReceipt.receipt || source.canvasWestReceipt || "", ""),
      canvasSouthReceipt: safeString(southReceipt.receipt || source.canvasSouthReceipt || "", ""),

      canvasNewsProtocolSynchronized: safeBool(source.newsProtocolSynchronized, safeBool(datasetField("hearthCanvasNewsProtocolSynchronized", ""), false)),
      canvasFibonacciAlignmentSynchronized: safeBool(source.fibonacciAlignmentSynchronized, safeBool(datasetField("hearthCanvasFibonacciAlignmentSynchronized", ""), false)),
      canvasActiveFibonacciGate: safeString(source.activeFibonacciGate || datasetField("hearthCanvasActiveFibonacciGate", ""), ""),
      canvasFutureFibonacciGate: safeString(source.futureFibonacciGate || datasetField("hearthCanvasFutureFibonacciGate", ""), ""),
      canvasOneActiveGearAtATime: safeBool(source.oneActiveGearAtATime, safeBool(datasetField("hearthCanvasOneActiveGearAtATime", ""), false)),

      canvasF13EvidencePreserved: safeBool(source.f13CanvasEvidencePreserved, safeBool(datasetField("hearthCanvasF13EvidencePreserved", ""), false)),
      canvasF13EvidenceComplete: safeBool(source.f13CanvasEvidenceComplete, false),
      canvasF13HardFail: safeBool(source.f13HardFail, false),
      canvasF21ClaimedByCanvas: safeBool(source.f21ClaimedByCanvas, false),
      canvasReadyTextClaimedByCanvas: safeBool(source.readyTextClaimedByCanvas, false),

      canvasReady: safeBool(source.canvasReady, safeBool(datasetField("hearthCanvasReady", ""), false)),
      canvasCarrierMounted: safeBool(source.canvasCarrierMounted, false),
      canvasContextReady: safeBool(source.canvasContextReady, false),
      canvasCarrierRequested: safeBool(source.canvasCarrierRequested, false),
      canvasCarrierHandoffOk: safeBool(source.canvasCarrierHandoffOk, false),
      canvasCarrierHandoffError: safeString(source.canvasCarrierHandoffError || "", ""),
      canvasCarrierMethod: safeString(source.canvasCarrierMethod || parentMethod || "", ""),
      cooperativeBootUsed: safeBool(source.cooperativeBootUsed, state.canvasBootRequested),
      syncBootFallbackUsed: safeBool(source.syncBootFallbackUsed, false),

      atlasBuildStarted: safeBool(source.atlasBuildStarted, false),
      atlasBuildProgress: safeNumber(source.atlasBuildProgress, 0),
      atlasBuildComplete: safeBool(source.atlasBuildComplete, false),
      textureComposeStarted: safeBool(source.textureComposeStarted, false),
      textureComposeProgress: safeNumber(source.textureComposeProgress, 0),
      textureComposeComplete: safeBool(source.textureComposeComplete, false),
      firstFrameRequested: safeBool(source.firstFrameRequested, false),
      firstFrameDetected: safeBool(source.firstFrameDetected, false),
      dragInspectionBound: safeBool(source.dragInspectionBound, false),
      zoomInspectionBound: safeBool(source.zoomInspectionBound, false),

      canvasImageRendered: safeBool(source.imageRendered, false),
      canvasVisiblePlanetAvailable: safeBool(source.visiblePlanetAvailable, safeBool(datasetField("hearthCanvasVisiblePlanetAvailable", ""), false)),
      canvasVisibleContentProof: safeBool(source.visibleContentProof, safeBool(datasetField("hearthCanvasVisibleContentProof", ""), false)),
      canvasVisibleContentStrictProof: safeBool(source.visibleContentStrictProof, false),
      canvasVisibleContentSoftGap: safeBool(source.visibleContentSoftGap, safeBool(datasetField("hearthCanvasVisibleContentSoftGap", ""), false)),
      canvasVisibleContentHardFail: safeBool(source.visibleContentHardFail, safeBool(datasetField("hearthCanvasVisibleContentHardFail", ""), false)),
      canvasVisibleForwardProgress: safeBool(source.visibleForwardProgress, safeBool(datasetField("hearthCanvasVisibleForwardProgress", ""), false)),
      canvasVisibleContentAdmissible: safeBool(source.visibleContentAdmissible, false),

      visibleContentProofStarted: safeBool(source.visibleContentProofStarted, false),
      visibleContentClassCount: safeNumber(source.visibleContentClassCount, 0),
      visibleContentLandSampleCount: safeNumber(source.visibleContentLandSampleCount, 0),
      visibleContentWaterSampleCount: safeNumber(source.visibleContentWaterSampleCount, 0),
      visibleContentOtherSampleCount: safeNumber(source.visibleContentOtherSampleCount, 0),
      nonblankPlanetVisible: safeBool(source.nonblankPlanetVisible, false),

      canvasGeneratedImage: safeBool(source.generatedImage, false),
      canvasGraphicBox: safeBool(source.graphicBox, false),
      canvasWebGL: safeBool(source.webGL, false),
      canvasVisualPassClaimed: safeBool(source.visualPassClaimed, false)
    };
  }

  function classifyParentFirstChildGate(bridge = buildCanvasReceiptBridge()) {
    const missing = bridge.canvasChildGateMissingText || childMissingTextFromApis();

    state.canvasParentPresent = bridge.canvasParentPresent;
    state.canvasParentBootMethodAvailable = bridge.canvasParentBootMethodAvailable;
    state.canvasParentBootMethod = bridge.canvasParentBootMethod;

    if (!state.canvasParentBootAttempted) {
      state.preParentChildMissingObservation = missing;
    }

    state.preParentChildMissingIsHardBlock = false;

    if (!bridge.canvasParentPresent) {
      state.canvasParentBootGatePhase = "PRE_PARENT";
      state.canvasChildGatePhase = "PRE_PARENT";
      state.canvasParentBootAllowed = false;
      state.canvasChildGateWaiting = true;
      state.canvasBootBlockedByChildGate = false;
      state.canvasChildGatePostParentFailure = false;
      state.canvasChildGatePostParentDegraded = false;
      state.canvasChildGateLastMissing = missing;
      state.canvasChildGateLastProofAt = nowIso();

      return {
        phase: "PRE_PARENT",
        allowed: false,
        hardBlock: false,
        degraded: false,
        ready: false,
        reason: "canvas-parent-api-missing",
        missing
      };
    }

    if (!bridge.canvasParentBootMethodAvailable) {
      state.canvasParentBootGatePhase = "PRE_PARENT";
      state.canvasChildGatePhase = "PRE_PARENT";
      state.canvasParentBootAllowed = false;
      state.canvasChildGateWaiting = true;
      state.canvasBootBlockedByChildGate = false;
      state.canvasChildGatePostParentFailure = false;
      state.canvasChildGatePostParentDegraded = false;
      state.canvasChildGateLastMissing = missing || "parent-boot-method-missing";
      state.canvasChildGateLastProofAt = nowIso();

      return {
        phase: "PRE_PARENT",
        allowed: false,
        hardBlock: false,
        degraded: false,
        ready: false,
        reason: "canvas-parent-boot-method-missing",
        missing: missing || "parent-boot-method-missing"
      };
    }

    if (!state.canvasParentBootAttempted) {
      state.canvasParentBootGatePhase = "PARENT_BOOT_ALLOWED";
      state.canvasChildGatePhase = "PARENT_BOOT_ALLOWED";
      state.canvasParentBootAllowed = true;
      state.canvasChildGateWaiting = Boolean(missing);
      state.canvasBootBlockedByChildGate = false;
      state.canvasChildGatePostParentFailure = false;
      state.canvasChildGatePostParentDegraded = false;
      state.canvasChildGateLastMissing = missing;
      state.canvasChildGateLastProofAt = nowIso();

      return {
        phase: "PARENT_BOOT_ALLOWED",
        allowed: true,
        hardBlock: false,
        degraded: false,
        ready: false,
        reason: "parent-boot-must-run-before-child-proof",
        missing
      };
    }

    if (bridge.allCanvasChildrenReady || bridge.childLoadComplete) {
      state.canvasParentBootGatePhase = "POST_PARENT_READY";
      state.canvasChildGatePhase = "POST_PARENT_READY";
      state.canvasParentBootAllowed = true;
      state.canvasChildGateWaiting = false;
      state.canvasBootBlockedByChildGate = false;
      state.canvasChildGatePostParentFailure = false;
      state.canvasChildGatePostParentDegraded = false;
      state.canvasChildGateLastMissing = "";
      state.canvasChildGateLastProofAt = nowIso();

      return {
        phase: "POST_PARENT_READY",
        allowed: true,
        hardBlock: false,
        degraded: false,
        ready: true,
        reason: "post-parent-children-ready",
        missing: ""
      };
    }

    if (
      bridge.canvasReady ||
      bridge.canvasImageRendered ||
      bridge.canvasVisiblePlanetAvailable ||
      bridge.canvasVisibleForwardProgress ||
      bridge.canvasVisibleContentProof ||
      bridge.canvasVisibleContentSoftGap ||
      bridge.firstFrameDetected
    ) {
      state.canvasParentBootGatePhase = "POST_PARENT_DEGRADED";
      state.canvasChildGatePhase = "POST_PARENT_DEGRADED";
      state.canvasParentBootAllowed = true;
      state.canvasChildGateWaiting = Boolean(missing);
      state.canvasBootBlockedByChildGate = false;
      state.canvasChildGatePostParentFailure = false;
      state.canvasChildGatePostParentDegraded = true;
      state.canvasChildGateLastMissing = missing;
      state.canvasChildGateLastProofAt = nowIso();

      return {
        phase: "POST_PARENT_DEGRADED",
        allowed: true,
        hardBlock: false,
        degraded: true,
        ready: false,
        reason: "post-parent-visible-forward-progress-with-child-gap",
        missing
      };
    }

    if (
      bridge.childLoadError ||
      bridge.canvasCarrierHandoffError ||
      state.canvasBootError ||
      state.canvasParentBootRejected ||
      bridge.canvasF13HardFail
    ) {
      const message = bridge.childLoadError || bridge.canvasCarrierHandoffError || state.canvasBootError || missing || "post-parent-child-gate-failed";

      state.canvasParentBootGatePhase = "POST_PARENT_FAILED";
      state.canvasChildGatePhase = "POST_PARENT_FAILED";
      state.canvasParentBootAllowed = true;
      state.canvasChildGateWaiting = false;
      state.canvasBootBlockedByChildGate = true;
      state.canvasChildGatePostParentFailure = true;
      state.canvasChildGatePostParentDegraded = false;
      state.canvasChildGateLastMissing = missing || message;
      state.canvasChildGateLastProofAt = nowIso();

      return {
        phase: "POST_PARENT_FAILED",
        allowed: true,
        hardBlock: true,
        degraded: false,
        ready: false,
        reason: message,
        missing: missing || message
      };
    }

    state.canvasParentBootGatePhase = "PARENT_ATTEMPTED";
    state.canvasChildGatePhase = "PARENT_ATTEMPTED";
    state.canvasParentBootAllowed = true;
    state.canvasChildGateWaiting = true;
    state.canvasBootBlockedByChildGate = false;
    state.canvasChildGatePostParentFailure = false;
    state.canvasChildGatePostParentDegraded = false;
    state.canvasChildGateLastMissing = missing;
    state.canvasChildGateLastProofAt = nowIso();

    return {
      phase: "PARENT_ATTEMPTED",
      allowed: true,
      hardBlock: false,
      degraded: false,
      ready: false,
      reason: "parent-boot-attempted-awaiting-child-proof",
      missing
    };
  }

  function readNorthFacade() {
    return getByNames([
      "LAB_RUNTIME_TABLE",
      "LAB_RUNTIME_TABLE_NORTH",
      "LAB_UNIVERSAL_PLANET_RUNTIME_TABLE",
      "RUNTIME_TABLE",
      "DexterRuntimeTable",
      "DEXTER_LAB.runtimeTable"
    ]);
  }

  function readEastBranch() {
    return getByNames([
      "LAB_RUNTIME_TABLE_EAST",
      "RUNTIME_TABLE_EAST",
      "DEXTER_LAB_RUNTIME_TABLE_EAST",
      "LAB_CARDINAL_RUNTIME_TABLE_EAST",
      "LAB_CHECKPOINT_GOVERNOR_EAST",
      "DEXTER_LAB.runtimeTableEast",
      "DEXTER_LAB.cardinalRuntimeTableEast",
      "DEXTER_LAB.checkpointGovernorEast"
    ]);
  }

  function readWestBranch() {
    return getByNames([
      "LAB_RUNTIME_TABLE_WEST",
      "RUNTIME_TABLE_WEST",
      "DEXTER_LAB_RUNTIME_TABLE_WEST",
      "LAB_CARDINAL_RUNTIME_TABLE_WEST",
      "LAB_GAP_CLASSIFIER_WEST",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.cardinalRuntimeTableWest",
      "DEXTER_LAB.gapClassifierWest"
    ]);
  }

  function readSouthComposer() {
    return getByNames([
      "LAB_RUNTIME_TABLE_SOUTH",
      "RUNTIME_TABLE_SOUTH",
      "DEXTER_LAB_RUNTIME_TABLE_SOUTH",
      "LAB_CARDINAL_RUNTIME_TABLE_SOUTH",
      "HEARTH_RUNTIME_TABLE_SOUTH",
      "HEARTH_SOUTH",
      "HEARTH_VISIBLE_STATE_COMPOSER",
      "DEXTER_LAB.runtimeTableSouth",
      "DEXTER_LAB.cardinalRuntimeTableSouth",
      "DEXTER_LAB.visibleStateComposer",
      "DEXTER_LAB.transmissionVisibleStateComposer"
    ]);
  }

  function getExistingSession() {
    return getByNames([
      "HEARTH_CHECKPOINT_SESSION",
      "HEARTH_RUNTIME_CHECKPOINT_SESSION",
      "LAB_HEARTH_CHECKPOINT_SESSION",
      "LAB_CHECKPOINT_SESSION",
      "DEXTER_LAB.hearthCheckpointSession",
      "DEXTER_LAB.checkpointSession"
    ]);
  }

  function ensureNorthSession() {
    const existing = getExistingSession();

    if (existing && (isFunction(existing.submitEvent) || isFunction(existing.completeActive) || isFunction(existing.submit))) {
      state.sessionPresent = true;
      return existing;
    }

    const north = readNorthFacade();
    const east = readEastBranch();

    const creators = [
      north && north.createHearthCheckpointSession,
      east && east.createHearthCheckpointSession,
      north && north.createCheckpointSession,
      east && east.createCheckpointSession
    ].filter(isFunction);

    for (const creator of creators) {
      try {
        const session = creator({
          planetId: "hearth",
          planetLabel: "Hearth",
          route: ROUTE
        });

        if (session && (isFunction(session.submitEvent) || isFunction(session.completeActive) || isFunction(session.submit))) {
          root.HEARTH_CHECKPOINT_SESSION = session;
          root.HEARTH_RUNTIME_CHECKPOINT_SESSION = session;
          root.LAB_HEARTH_CHECKPOINT_SESSION = session;
          root.DEXTER_LAB = root.DEXTER_LAB || {};
          root.DEXTER_LAB.hearthCheckpointSession = session;
          root.DEXTER_LAB.checkpointSession = session;

          state.sessionPresent = true;
          state.sessionCreatedBySouth = true;
          recordLocal("SOUTH_CREATED_HEARTH_CHECKPOINT_SESSION", { source: creator.name || "north-or-east" });
          return session;
        }
      } catch (error) {
        recordError("CREATE_CHECKPOINT_SESSION_FAILED", error && error.message ? error.message : String(error));
      }
    }

    state.sessionPresent = false;
    return null;
  }

  function refreshAuthorityPresence() {
    state.indexPresent = Boolean(readIndexApi());
    state.northPresent = Boolean(readNorthFacade());
    state.eastBranchPresent = Boolean(readEastBranch());
    state.westBranchPresent = Boolean(readWestBranch());
    state.southBranchPresent = Boolean(readSouthComposer());
    state.canvasPresent = Boolean(readCanvasApi());
    state.sessionPresent = Boolean(getExistingSession());

    const bridge = buildCanvasReceiptBridge();
    classifyParentFirstChildGate(bridge);
  }

  function ensureRefs() {
    if (!doc) return;

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
    refs.collapseButton = doc.querySelector("[data-hearth-collapse-cockpit]");
    refs.showTab =
      doc.querySelector("[data-hearth-south-show-diagnostic-tab]") ||
      doc.querySelector("[data-hearth-east-show-diagnostic-tab]") ||
      doc.querySelector("[data-hearth-index-show-diagnostic-tab]");
    refs.status =
      doc.getElementById("hearth-route-status") ||
      doc.querySelector("[data-hearth-route-status]");

    state.copyDiagnosticPreserved = Boolean(refs.copyButton);
    state.receiptToggleReady = Boolean(refs.toggleButton);
    state.buttonsReachable = Boolean(refs.copyButton || refs.toggleButton || refs.inspectButton || refs.collapseButton);
    state.inspectPlanetControlAvailable = Boolean(refs.inspectButton);
    state.inspectModeAvailable = Boolean(refs.inspectButton && refs.cockpit);
    state.diagnosticCanLeavePlanetFrame = Boolean(refs.inspectButton && refs.cockpit && refs.showTab);
    state.diagnosticDockRestorable = Boolean(refs.cockpit);
    state.receiptOverlayIndependent = Boolean(refs.receiptBox || refs.receiptText);
    state.showDiagnosticTabVisible = Boolean(refs.showTab && refs.showTab.hidden === false);
    state.diagnosticDockHiddenForInspection = Boolean(refs.cockpit && refs.cockpit.dataset.cockpitMode === "planet-inspect");

    bindControls();
  }

  function hasVisibleSurfaceSignal(snapshot = buildSnapshot()) {
    const classCount = safeNumber(snapshot.visibleContentClassCount, 0);
    const land = safeNumber(snapshot.visibleContentLandSampleCount, 0);
    const water = safeNumber(snapshot.visibleContentWaterSampleCount, 0);
    const other = safeNumber(snapshot.visibleContentOtherSampleCount, 0);

    return Boolean(
      (
        safeBool(snapshot.canvasReady, false) ||
        safeBool(snapshot.firstFrameDetected, false) ||
        safeBool(snapshot.imageRendered, false)
      ) &&
      (
        safeBool(snapshot.nonblankPlanetVisible, false) ||
        safeBool(snapshot.visiblePlanetAvailable, false) ||
        safeBool(snapshot.visibleForwardProgress, false) ||
        safeBool(snapshot.visibleContentAdmissible, false)
      ) &&
      (
        classCount > 0 ||
        land > 0 ||
        water > 0 ||
        other > 0 ||
        safeBool(snapshot.visibleForwardProgress, false) ||
        safeBool(snapshot.visibleContentAdmissible, false)
      )
    );
  }

  function hasStrictInspectSignal(snapshot = buildSnapshot()) {
    const strict = Boolean(
      safeBool(snapshot.inspectModeAvailable, false) &&
      safeBool(snapshot.inspectPlanetControlAvailable, false) &&
      safeBool(snapshot.diagnosticCanLeavePlanetFrame, false) &&
      safeBool(snapshot.copyDiagnosticPreserved, true) &&
      safeBool(snapshot.receiptToggleReady, true) &&
      safeBool(snapshot.diagnosticDockRestorable, true) &&
      safeBool(snapshot.buttonsReachable, true)
    );

    state.strictInspectReady = strict;
    return strict;
  }

  function hasFallbackInspectSignal(snapshot = buildSnapshot()) {
    const fallback = Boolean(
      safeBool(snapshot.copyDiagnosticPreserved, true) &&
      safeBool(snapshot.receiptToggleReady, true) &&
      safeBool(snapshot.diagnosticDockRestorable, true) &&
      (
        safeBool(snapshot.receiptOverlayIndependent, true) ||
        safeBool(snapshot.partialReceiptAvailable, true) ||
        safeBool(snapshot.finalReceiptAvailable, false)
      )
    );

    state.fallbackInspectReady = fallback;
    return fallback;
  }

  function classifyVisibleProof(eventName, detail = {}) {
    const key = safeString(eventName);

    const hard = Boolean(
      key === "VISIBLE_CONTENT_HARD_FAIL" ||
      safeBool(detail.visibleContentHardFail, false)
    );

    const explicitSoft = Boolean(
      key === "VISIBLE_CONTENT_SOFT_GAP" ||
      key === "DEGRADED_VISIBLE_CONTENT_ACCEPTED" ||
      safeBool(detail.visibleContentSoftGap, false)
    );

    const strict = Boolean(
      !hard &&
      !explicitSoft &&
      (
        safeBool(detail.visibleContentProof, false) ||
        key === "VISIBLE_CONTENT_PROOF_PASSED"
      )
    );

    const admissibleOnlySoft = Boolean(
      !strict &&
      !hard &&
      (
        safeBool(detail.visibleForwardProgress, false) ||
        safeBool(detail.visibleContentAdmissible, false)
      )
    );

    const soft = Boolean(!hard && !strict && (explicitSoft || admissibleOnlySoft));

    state.strictVisibleProof = strict;
    state.softGapVisibleProof = soft;
    state.hardFailVisibleProof = hard;

    return {
      strict,
      soft,
      hard,
      mode: hard ? "HARD_FAIL" : strict ? "STRICT" : soft ? "SOFT_GAP" : "UNKNOWN"
    };
  }

  function buildSnapshot(extra = {}) {
    const canvas = readCanvasReceipt();
    const bridge = buildCanvasReceiptBridge(canvas);
    const childGate = classifyParentFirstChildGate(bridge);
    const active = activeCheckpoint();
    const highest = highestCompletedCheckpoint();

    ensureRefs();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      route: ROUTE,

      indexPresent: state.indexPresent,
      indexOwnsEastStep1: true,
      indexOwnsScriptOrder: true,
      indexOwnsRouteSafeRecognition: true,
      southOwnsRouteConductorRuntime: true,

      activeGear: active.id,
      activeCheckpointId: active.id,
      activeCheckpointRank: active.rank,
      activeFibonacciStage: active.fibonacci,
      highestCompletedCheckpointId: highest ? highest.id : "",
      highestCompletedRank: highest ? highest.rank : 0,
      completedCheckpoints: state.completedCheckpoints.slice(),
      degradedCheckpoints: state.degradedCheckpoints.slice(),

      routeMounted: Boolean(doc),
      shellRendered: true,
      htmlShellRendered: true,
      loadLedgerInitialized: true,
      firstPaintReady: Boolean(refs.cockpit || doc),
      cockpitReady: Boolean(refs.cockpit),
      scriptOrderComplete: true,
      authorityAvailabilityReady: true,
      runtimeTablePresent: state.northPresent,
      northAvailable: state.northPresent,
      conductorHydrated: true,
      southGlobalPresent: true,

      ...bridge,

      canvasParentBootGatePhase: state.canvasParentBootGatePhase,
      canvasParentBootAllowed: state.canvasParentBootAllowed,
      canvasParentBootAttempted: state.canvasParentBootAttempted,
      canvasParentBootResolved: state.canvasParentBootResolved,
      canvasParentBootRejected: state.canvasParentBootRejected,
      canvasParentBootResultReceived: state.canvasParentBootResultReceived,
      canvasChildGatePhase: state.canvasChildGatePhase,
      canvasBootBlockedByChildGate: state.canvasBootBlockedByChildGate,
      canvasChildGateWaiting: state.canvasChildGateWaiting,
      canvasChildGatePostParentFailure: state.canvasChildGatePostParentFailure,
      canvasChildGatePostParentDegraded: state.canvasChildGatePostParentDegraded,
      canvasChildGateLastMissing: state.canvasChildGateLastMissing,
      canvasChildGateLastProofAt: state.canvasChildGateLastProofAt,
      preParentChildMissingObservation: state.preParentChildMissingObservation,
      preParentChildMissingIsHardBlock: false,
      childGateReason: childGate.reason,

      canvasReady: bridge.canvasReady,
      canvasCarrierMounted: bridge.canvasCarrierMounted,
      canvasContextReady: bridge.canvasContextReady,
      canvasCarrierRequested: bridge.canvasCarrierRequested,
      canvasCarrierHandoffOk: bridge.canvasCarrierHandoffOk,
      canvasCarrierHandoffError: bridge.canvasCarrierHandoffError,
      canvasCarrierMethod: bridge.canvasCarrierMethod,
      cooperativeBootUsed: bridge.cooperativeBootUsed || state.canvasBootRequested,
      syncBootFallbackUsed: bridge.syncBootFallbackUsed,

      atlasBuildStarted: bridge.atlasBuildStarted,
      atlasBuildProgress: bridge.atlasBuildProgress,
      atlasBuildComplete: bridge.atlasBuildComplete,
      textureComposeStarted: bridge.textureComposeStarted,
      textureComposeProgress: bridge.textureComposeProgress,
      textureComposeComplete: bridge.textureComposeComplete,
      firstFrameRequested: bridge.firstFrameRequested,
      firstFrameDetected: bridge.firstFrameDetected,
      imageRendered: bridge.canvasImageRendered,
      dragInspectionBound: bridge.dragInspectionBound,
      zoomInspectionBound: bridge.zoomInspectionBound,

      visibleContentProofStarted: bridge.visibleContentProofStarted,
      visibleContentProof: bridge.canvasVisibleContentProof,
      visibleContentStrictProof: bridge.canvasVisibleContentStrictProof,
      visibleContentSoftGap: bridge.canvasVisibleContentSoftGap,
      visibleContentHardFail: bridge.canvasVisibleContentHardFail,
      visibleForwardProgress: bridge.canvasVisibleForwardProgress,
      visibleContentAdmissible: bridge.canvasVisibleContentAdmissible,
      visiblePlanetAvailable: bridge.canvasVisiblePlanetAvailable,
      visibleContentClassCount: bridge.visibleContentClassCount,
      visibleContentLandSampleCount: bridge.visibleContentLandSampleCount,
      visibleContentWaterSampleCount: bridge.visibleContentWaterSampleCount,
      visibleContentOtherSampleCount: bridge.visibleContentOtherSampleCount,
      nonblankPlanetVisible: bridge.nonblankPlanetVisible,

      inspectModeAvailable: state.inspectModeAvailable,
      inspectPlanetControlAvailable: state.inspectPlanetControlAvailable,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame,
      diagnosticDockHiddenForInspection: state.diagnosticDockHiddenForInspection,
      showDiagnosticTabVisible: state.showDiagnosticTabVisible,
      diagnosticDockRestorable: state.diagnosticDockRestorable,
      copyDiagnosticPreserved: state.copyDiagnosticPreserved,
      receiptToggleReady: state.receiptToggleReady,
      buttonsReachable: state.buttonsReachable,
      receiptOverlayIndependent: state.receiptOverlayIndependent,
      partialReceiptAvailable: true,
      finalReceiptAvailable: state.completionLatched,

      strictVisibleProof: state.strictVisibleProof,
      softGapVisibleProof: state.softGapVisibleProof,
      hardFailVisibleProof: state.hardFailVisibleProof,
      strictInspectReady: state.strictInspectReady,
      fallbackInspectReady: state.fallbackInspectReady,
      f21LatchMode: state.f21LatchMode,

      completionLatched: state.completionLatched,
      degradedCompletionLatched: state.degradedCompletionLatched,
      readyTextAllowed: state.readyTextAllowed,

      queuedEventsCount: state.queuedEvents.length,
      archivedEventsCount: state.archivedEvents.length,
      compactArchiveCount: state.compactArchiveCount,
      duplicateCompletedEventCount: state.duplicateCompletedEventCount,
      duplicatePostgameEventCount: state.duplicatePostgameEventCount,
      blockedEventsCount: state.blockedEvents.length,
      admittedEventsCount: state.admittedEvents.length,

      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,

      ...extra
    };
  }

  function evaluateNewsGates(snapshot = buildSnapshot()) {
    const splitStrict = Boolean(safeBool(snapshot.canvasSplitAdapterStrictProof, false));

    const splitDegraded = Boolean(
      splitStrict ||
      (
        safeBool(snapshot.canvasSplitAdapterSoftProof, false) &&
        safeBool(snapshot.canvasSplitAdapterRecognized, false)
      ) ||
      (
        safeBool(snapshot.canvasParentBootAttempted, false) &&
        safeBool(snapshot.canvasNorthActive, false) &&
        safeBool(snapshot.canvasSplitContractAcceptedLineage, false)
      )
    );

    const publicCanvasStrict = Boolean(
      safeBool(snapshot.canvasContractMatchesExpected, false) &&
      safeBool(snapshot.canvasReceiptMatchesExpected, false)
    );

    const publicCanvasAccepted = Boolean(
      publicCanvasStrict ||
      (
        safeBool(snapshot.canvasContractAcceptedLineage, false) &&
        safeBool(snapshot.canvasReceiptAcceptedLineage, false)
      )
    );

    const northGateReady = Boolean(
      publicCanvasStrict &&
      splitStrict &&
      safeBool(snapshot.canvasReady, false) &&
      safeBool(snapshot.atlasBuildComplete, false) &&
      safeBool(snapshot.textureComposeComplete, false) &&
      safeBool(snapshot.visibleContentProof, false) &&
      !safeBool(snapshot.visibleContentSoftGap, false) &&
      !safeBool(snapshot.visibleContentHardFail, false) &&
      safeBool(snapshot.visiblePlanetAvailable, false)
    );

    const northGateDegradedReady = Boolean(
      northGateReady ||
      (
        publicCanvasAccepted &&
        splitDegraded &&
        safeBool(snapshot.canvasParentBootAttempted, false) &&
        !safeBool(snapshot.canvasBootBlockedByChildGate, false) &&
        hasVisibleSurfaceSignal(snapshot)
      )
    );

    const eastGateReady = Boolean(
      safeBool(snapshot.indexPresent, false) &&
      safeBool(snapshot.canvasParentBootAttempted, false) &&
      safeBool(snapshot.canvasBootRequested, false) &&
      safeBool(snapshot.canvasBootStarted, false) &&
      !safeBool(snapshot.preParentChildMissingIsHardBlock, false)
    );

    const westGateReady = Boolean(
      safeBool(snapshot.copyDiagnosticPreserved, true) &&
      safeBool(snapshot.receiptToggleReady, true) &&
      safeBool(snapshot.inspectPlanetControlAvailable, false) &&
      safeBool(snapshot.diagnosticDockRestorable, true) &&
      safeBool(snapshot.buttonsReachable, true) &&
      safeBool(snapshot.receiptOverlayIndependent, true)
    );

    const westGateDegradedReady = Boolean(westGateReady || hasFallbackInspectSignal(snapshot));

    const southGateReady = Boolean(
      safeBool(snapshot.imageRendered, false) &&
      safeBool(snapshot.firstFrameDetected, false) &&
      safeBool(snapshot.dragInspectionBound, false) &&
      safeBool(snapshot.visiblePlanetAvailable, false) &&
      safeBool(snapshot.diagnosticCanLeavePlanetFrame, false)
    );

    const southGateDegradedReady = Boolean(
      southGateReady ||
      (
        safeBool(snapshot.imageRendered, false) &&
        safeBool(snapshot.firstFrameDetected, false) &&
        safeBool(snapshot.dragInspectionBound, false) &&
        (
          safeBool(snapshot.nonblankPlanetVisible, false) ||
          safeBool(snapshot.visiblePlanetAvailable, false) ||
          safeBool(snapshot.visibleForwardProgress, false)
        )
      )
    );

    return {
      publicCanvasStrict,
      publicCanvasAccepted,
      canvasSplitStrictReady: splitStrict,
      canvasSplitDegradedReady: splitDegraded,

      northGateReady,
      eastGateReady,
      westGateReady,
      southGateReady,
      newsGatePassedBeforeF21: northGateReady && eastGateReady && westGateReady && southGateReady,

      northGateDegradedReady,
      westGateDegradedReady,
      southGateDegradedReady,
      newsGateDegradedBeforeF21: northGateDegradedReady && eastGateReady && westGateDegradedReady && southGateDegradedReady
    };
  }

  function submitToNorth(gear, detail = {}) {
    const session = ensureNorthSession();

    if (!session || !gear) {
      return {
        accepted: true,
        action: "LOCAL_ONLY",
        reason: "north-session-missing",
        checkpointId: gear ? gear.id : ""
      };
    }

    const payload = {
      id: gear.event,
      event: gear.event,
      phase: gear.event,
      checkpointId: gear.id,
      source: "hearth.south.routeConductor.aliasPublishedParentFirstBoot",
      contract: CONTRACT,
      receipt: RECEIPT,
      detail: {
        ...clonePlain(detail),
        translatedBySouth: true,
        targetCheckpointId: gear.id,
        targetCheckpointEvent: gear.event,
        fibonacci: gear.fibonacci,
        postgameDedupActive: true,
        strictProofDegradeReconciliationActive: true,
        canvasNestedReceiptBridgeActive: true,
        canvasActiveExpectationBridgeRenewalActive: true,
        canvasSplitAdapterProofBridgeActive: true,
        splitChildLoaderGateActive: true,
        parentFirstCanvasBootGateActive: true,
        preBootChildHardBlockRetired: true,
        transistorGateReadActive: true,
        indexOwnsScriptOrder: true,
        southOwnsRouteConductorRuntime: true
      },
      snapshot: buildSnapshot(detail)
    };

    try {
      if (isFunction(session.submitEvent)) {
        const result = session.submitEvent(payload);
        state.latestNorthResult = clonePlain(result);
        return isObject(result) ? result : { accepted: true, action: "ADMIT", raw: result };
      }

      if (isFunction(session.submit)) {
        const result = session.submit(payload);
        state.latestNorthResult = clonePlain(result);
        return isObject(result) ? result : { accepted: true, action: "ADMIT", raw: result };
      }

      if (isFunction(session.completeActive)) {
        const result = session.completeActive(payload);
        state.latestNorthResult = clonePlain(result);
        return isObject(result) ? result : { accepted: true, action: "ADMIT", raw: result };
      }
    } catch (error) {
      recordError("NORTH_SUBMISSION_FAILED", error && error.message ? error.message : String(error), {
        checkpointId: gear.id,
        event: gear.event
      });
    }

    return {
      accepted: true,
      action: "LOCAL_ONLY",
      reason: "north-submit-unavailable",
      checkpointId: gear.id
    };
  }

  function markGearComplete(gear, detail = {}, degraded = false, northResult = null) {
    if (!gear) return false;

    arrayPushUnique(state.completedCheckpoints, gear.id);

    if (degraded) {
      arrayPushUnique(state.degradedCheckpoints, gear.id);
    }

    const active = activeCheckpoint();

    if (active && active.id === gear.id) {
      state.activeIndex = Math.min(CHECKPOINTS.length - 1, state.activeIndex + 1);
    } else if (gear.rank >= active.rank) {
      const nextIndex = CHECKPOINTS.findIndex((item) => item.rank === gear.rank + 1);
      if (nextIndex >= 0) state.activeIndex = nextIndex;
    }

    if (gear.id === "F21_COMPLETION_LATCHED") {
      state.completionLatched = true;
      state.degradedCompletionLatched = degraded === true;
      state.readyTextAllowed = true;
      state.completionClosed = true;
      state.f21LatchMode = degraded ? "DEGRADED" : "FULL";
      state.postgameStatus = degraded
        ? "READY_DEGRADED_PLANET_VISIBLE_SPLIT_ADAPTER_GAP_HELD"
        : "READY_PLANET_VISIBLE_SPLIT_ADAPTER_PROOF_PASSED";
      state.firstFailedCoordinate = degraded
        ? "DEGRADED_F21_LATCHED_WITH_SPLIT_ADAPTER_GAP"
        : "NONE_F21_FULL_LATCHED";
      state.recommendedNextRenewalTarget = "read-postgame-canvas-or-triple-g-receipt";
    } else {
      const next = activeCheckpoint();
      state.postgameStatus = degraded
        ? "GEAR_DEGRADED_COMPLETE_WAITING_NORTH_SHIFT"
        : "GEAR_COMPLETE_WAITING_NORTH_SHIFT";
      state.firstFailedCoordinate = next ? `WAITING_${next.id}` : "WAITING_NEXT_GEAR";
      state.recommendedNextRenewalTarget = FILE;
    }

    const admitted = {
      at: nowIso(),
      event: gear.event,
      checkpointId: gear.id,
      fibonacci: gear.fibonacci,
      degraded: degraded === true,
      detail: clonePlain(detail),
      northResult: clonePlain(northResult)
    };

    state.admittedEvents.push(admitted);
    trimArray(state.admittedEvents, MAX_EVENTS);

    recordLocal("SOUTH_ADMITTED_ACTIVE_GEAR", {
      checkpointId: gear.id,
      event: gear.event,
      fibonacci: gear.fibonacci,
      degraded
    });

    flushQueue();
    scheduleRender();
    publishGlobals();

    return true;
  }

  function queueEvent(eventName, gear, reason, detail = {}) {
    if (!gear) return null;

    const existing = state.queuedEvents.some((item) => item.checkpointId === gear.id && item.event === gear.event);
    if (existing) return null;

    const item = {
      at: nowIso(),
      event: gear.event,
      originalEvent: safeString(eventName),
      checkpointId: gear.id,
      rank: gear.rank,
      action: "QUEUE",
      reason,
      detail: clonePlain(detail)
    };

    state.queuedEvents.push(item);
    trimArray(state.queuedEvents, MAX_EVENTS);
    return item;
  }

  function blockEvent(eventName, gear, reason, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(eventName),
      checkpointId: gear ? gear.id : "",
      action: "BLOCK",
      reason,
      detail: clonePlain(detail)
    };

    state.blockedEvents.push(item);
    trimArray(state.blockedEvents, MAX_EVENTS);

    state.postgameStatus = "BLOCKED_BY_TRANSMISSION_CHECKPOINT";
    state.firstFailedCoordinate = reason || "BLOCKED";
    state.recommendedNextRenewalTarget = FILE;
    state.f21LatchMode = gear && gear.id === "F21_COMPLETION_LATCHED" ? "BLOCKED" : state.f21LatchMode;

    scheduleRender();
    publishGlobals();

    return item;
  }

  function submitEventRecord(eventName, gear, detail = {}) {
    if (PROGRESS_ONLY_EVENTS.has(eventName)) return;

    state.submittedEvents.push({
      at: nowIso(),
      event: safeString(eventName),
      checkpointId: gear ? gear.id : "",
      detail: clonePlain(detail)
    });

    trimArray(state.submittedEvents, MAX_EVENTS);
  }

  function degradedForGearEvent(eventKey, gear, detail = {}) {
    if (!gear) return false;

    if (gear.id === "F13M_VISIBLE_CONTENT_PROOF_PASSED") {
      const proof = classifyVisibleProof(eventKey, detail);
      return proof.soft === true;
    }

    if (gear.id === "F13N_INSPECT_MODE_READY") {
      return (
        eventKey === "INSPECT_FALLBACK_READY" ||
        eventKey === "DEGRADED_INSPECT_MODE_ACCEPTED" ||
        eventKey === "RECEIPT_FALLBACK_READY" ||
        safeBool(detail.degraded, false)
      );
    }

    if (gear.id === "F21_COMPLETION_LATCHED") {
      return (
        eventKey === "F21_DEGRADED_COMPLETION_LATCHED" ||
        safeBool(detail.degraded, false)
      );
    }

    return safeBool(detail.degraded, false);
  }

  function admitGearEvent(eventName, detail = {}) {
    refreshAuthorityPresence();

    const eventKey = safeString(eventName);

    if (PROGRESS_ONLY_EVENTS.has(eventKey)) {
      return countProgressOnlyEvent(eventKey, detail);
    }

    const gear =
      checkpointFrom(eventKey) ||
      checkpointFrom(detail.checkpointId) ||
      checkpointFrom(detail.event);

    const active = activeCheckpoint();

    submitEventRecord(eventKey, gear, detail);

    if (!gear) {
      state.unknownEventCount += 1;
      compactArchive("unknown-event", eventKey, null, detail);
      return {
        accepted: false,
        action: "ARCHIVE",
        reason: "unknown-event",
        event: eventKey
      };
    }

    if (state.completionClosed && isCompleted(gear.id)) {
      compactArchive("postgame-closed-duplicate-suppressed", eventKey, gear, {
        checkpointId: gear.id,
        compact: true
      });

      return {
        accepted: true,
        action: "SUPPRESS",
        reason: "postgame-closed-duplicate-suppressed",
        checkpointId: gear.id
      };
    }

    if (isCompleted(gear.id)) {
      compactArchive("duplicate-completed-gear-archived", eventKey, gear, detail);

      return {
        accepted: true,
        action: "ARCHIVE",
        reason: "duplicate-completed-gear-archived",
        checkpointId: gear.id
      };
    }

    if (gear.rank < active.rank) {
      compactArchive("late-prior-gear-archived", eventKey, gear, detail);

      return {
        accepted: true,
        action: "ARCHIVE",
        reason: "late-prior-gear-archived",
        checkpointId: gear.id
      };
    }

    if (gear.rank > active.rank) {
      queueEvent(eventKey, gear, `future-event-queued-until-${active.id}`, detail);

      return {
        accepted: false,
        action: "QUEUE",
        reason: `future-event-queued-until-${active.id}`,
        checkpointId: gear.id
      };
    }

    if (gear.id === "F13M_VISIBLE_CONTENT_PROOF_PASSED") {
      const proof = classifyVisibleProof(eventKey, detail);

      if (proof.hard) {
        blockEvent(eventKey, gear, "VISIBLE_CONTENT_HARD_FAIL", detail);

        return {
          accepted: false,
          action: "BLOCK",
          reason: "VISIBLE_CONTENT_HARD_FAIL",
          checkpointId: gear.id
        };
      }

      if (!proof.strict && !proof.soft && !hasVisibleSurfaceSignal(buildSnapshot(detail))) {
        blockEvent(eventKey, gear, "VISIBLE_CONTENT_PROOF_UNCLASSIFIED", detail);

        return {
          accepted: false,
          action: "BLOCK",
          reason: "VISIBLE_CONTENT_PROOF_UNCLASSIFIED",
          checkpointId: gear.id
        };
      }
    }

    if (gear.id === "F21_COMPLETION_LATCHED") {
      const latch = canLatchF21();

      if (!latch.allowed) {
        blockEvent(eventKey, gear, latch.reason, detail);

        return {
          accepted: false,
          action: "BLOCK",
          reason: latch.reason,
          checkpointId: gear.id
        };
      }

      detail = {
        ...detail,
        degraded: latch.degraded,
        f21LatchMode: latch.degraded ? "DEGRADED" : "FULL",
        f21LatchReason: latch.reason
      };
    }

    const degraded = degradedForGearEvent(eventKey, gear, detail);
    const northResult = submitToNorth(gear, detail);

    if (
      northResult &&
      (
        northResult.action === "BLOCK" ||
        northResult.hardBlock === true ||
        northResult.blocked === true
      )
    ) {
      blockEvent(eventKey, gear, northResult.reason || "north-blocked-active-gear", {
        ...detail,
        northResult
      });

      return {
        accepted: false,
        action: "BLOCK",
        reason: northResult.reason || "north-blocked-active-gear",
        checkpointId: gear.id,
        northResult
      };
    }

    markGearComplete(gear, detail, degraded, northResult);

    return {
      accepted: true,
      action: degraded ? "DEGRADED_FORWARD" : "ADMIT",
      reason: degraded ? "active-gear-admitted-with-explicit-degrade" : "strict-active-gear-admitted",
      checkpointId: gear.id,
      checkpointEvent: gear.event,
      fibonacci: gear.fibonacci,
      northResult
    };
  }

  function flushQueue() {
    let guard = 0;
    let advanced = true;

    while (advanced && guard < 80) {
      guard += 1;
      advanced = false;

      const active = activeCheckpoint();
      const index = state.queuedEvents.findIndex((item) => item.checkpointId === active.id);

      if (index < 0) break;

      const [item] = state.queuedEvents.splice(index, 1);
      const result = admitGearEvent(item.event, {
        ...clonePlain(item.detail || {}),
        replayedFromQueue: true
      });

      if (result && (result.action === "ADMIT" || result.action === "DEGRADED_FORWARD")) {
        advanced = true;
      }
    }
  }

  function canLatchF21() {
    const snapshot = buildSnapshot();
    const gates = evaluateNewsGates(snapshot);
    const f13nComplete = isCompleted("F13N_INSPECT_MODE_READY");

    if (f13nComplete && gates.newsGatePassedBeforeF21) {
      state.f21LatchMode = "FULL";

      return {
        allowed: true,
        degraded: false,
        reason: "F21_FULL_ALLOWED_PARENT_FIRST_SPLIT_ADAPTER_STRICT"
      };
    }

    if (f13nComplete && gates.newsGateDegradedBeforeF21) {
      state.f21LatchMode = "DEGRADED";

      return {
        allowed: true,
        degraded: true,
        reason: "F21_DEGRADED_ALLOWED_PARENT_FIRST_SPLIT_ADAPTER_HELD"
      };
    }

    state.f21LatchMode = "BLOCKED";

    return {
      allowed: false,
      degraded: false,
      reason: !f13nComplete ? "F21_BLOCKED_F13N_INCOMPLETE" : "F21_BLOCKED_NEWS_OR_SPLIT_ADAPTER_GATE_INCOMPLETE"
    };
  }

  function maybeCompleteInspectAndF21() {
    if (state.completionClosed) return;

    const active = activeCheckpoint();
    const snapshot = buildSnapshot();

    if (active && active.id === "F13N_INSPECT_MODE_READY") {
      if (hasStrictInspectSignal(snapshot)) {
        admitGearEvent("INSPECT_MODE_READY", {
          degraded: false,
          inspectModeAvailable: true,
          inspectPlanetControlAvailable: true,
          diagnosticCanLeavePlanetFrame: true,
          copyDiagnosticPreserved: true,
          receiptToggleReady: true,
          diagnosticDockRestorable: true,
          buttonsReachable: true,
          strictInspectReady: true,
          fallbackInspectReady: false
        });
      } else if (hasFallbackInspectSignal(snapshot)) {
        admitGearEvent("INSPECT_FALLBACK_READY", {
          degraded: true,
          inspectModeAvailable: state.inspectModeAvailable,
          inspectPlanetControlAvailable: state.inspectPlanetControlAvailable,
          diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame,
          copyDiagnosticPreserved: true,
          receiptToggleReady: true,
          diagnosticDockRestorable: true,
          buttonsReachable: true,
          strictInspectReady: false,
          fallbackInspectReady: true
        });
      }
    }

    const f21 = canLatchF21();
    const next = activeCheckpoint();

    if (next && next.id === "F21_COMPLETION_LATCHED" && f21.allowed) {
      admitGearEvent(f21.degraded ? "F21_DEGRADED_COMPLETION_LATCHED" : "COMPLETION_LATCHED", {
        degraded: f21.degraded,
        f21LatchMode: f21.degraded ? "DEGRADED" : "FULL",
        ...evaluateNewsGates(buildSnapshot())
      });
    }
  }

  function canvasReceiptSignature(receipt) {
    if (!isObject(receipt)) return "";

    const keys = [
      "contract",
      "receipt",
      "splitContract",
      "splitReceipt",
      "version",
      "cardinalSplitActive",
      "transistorAdapterActive",
      "splitAdapterActive",
      "canvasNorthActive",
      "canvasEastPresent",
      "canvasWestPresent",
      "canvasSouthPresent",
      "canvasEastReady",
      "canvasWestReady",
      "canvasSouthReady",
      "allCanvasChildrenReady",
      "childLoadAttempted",
      "childLoadComplete",
      "childLoadError",
      "canvasCarrierRequested",
      "canvasCarrierMounted",
      "canvasContextReady",
      "dragInspectionBound",
      "atlasBuildStarted",
      "atlasBuildComplete",
      "textureComposeStarted",
      "textureComposeComplete",
      "firstFrameRequested",
      "firstFrameDetected",
      "canvasReady",
      "visibleContentProofStarted",
      "visibleContentProof",
      "visibleContentStrictProof",
      "visibleContentSoftGap",
      "visibleForwardProgress",
      "visibleContentAdmissible",
      "visibleContentHardFail",
      "visiblePlanetAvailable",
      "canvasCarrierHandoffOk",
      "canvasCarrierHandoffError",
      "imageRendered",
      "textureInvalidationCount"
    ];

    return keys.map((key) => `${key}:${safeString(receipt[key], "")}`).join("|");
  }

  function reconcileOneCanvasCheckpoint(receipt, key, event, detail = {}) {
    if (!safeBool(receipt[key], false)) return;

    const gear = checkpointFrom(event);
    if (!gear) return;

    const reconcileKey = `${gear.id}:${key}`;
    if (state.reconciledCanvasKeys.includes(reconcileKey) || isCompleted(gear.id)) {
      return;
    }

    arrayPushUnique(state.reconciledCanvasKeys, reconcileKey);
    arrayPushUnique(state.reconciledCheckpointIds, gear.id);

    admitGearEvent(event, {
      source: "canvasReceiptReconcile",
      canvasReceipt: true,
      [key]: true,
      ...buildCanvasReceiptBridge(receipt),
      ...detail
    });
  }

  function reconcileCanvasReceipt(options = {}) {
    if (state.completionClosed && !options.force) return;

    const receipt = readCanvasReceipt();

    if (!isObject(receipt)) return;

    const signature = canvasReceiptSignature(receipt);
    if (signature && signature === state.lastCanvasReceiptSignature && !options.force) {
      return;
    }

    state.lastCanvasReceiptSignature = signature;

    const bridge = buildCanvasReceiptBridge(receipt);
    classifyParentFirstChildGate(bridge);

    reconcileOneCanvasCheckpoint(receipt, "canvasCarrierRequested", "CANVAS_COOPERATIVE_BOOT_STARTED");
    reconcileOneCanvasCheckpoint(receipt, "canvasCarrierMounted", "CANVAS_MOUNT_CREATED");
    reconcileOneCanvasCheckpoint(receipt, "canvasContextReady", "CANVAS_CONTEXT_READY");
    reconcileOneCanvasCheckpoint(receipt, "dragInspectionBound", "DRAG_INSPECTION_BOUND");
    reconcileOneCanvasCheckpoint(receipt, "atlasBuildStarted", "ATLAS_BUILD_STARTED");
    reconcileOneCanvasCheckpoint(receipt, "atlasBuildComplete", "ATLAS_BUILD_COMPLETE");
    reconcileOneCanvasCheckpoint(receipt, "textureComposeStarted", "TEXTURE_COMPOSE_STARTED");
    reconcileOneCanvasCheckpoint(receipt, "textureComposeComplete", "TEXTURE_COMPOSE_COMPLETE");
    reconcileOneCanvasCheckpoint(receipt, "firstFrameRequested", "FIRST_FRAME_REQUESTED");
    reconcileOneCanvasCheckpoint(receipt, "firstFrameDetected", "FIRST_FRAME_DETECTED");
    reconcileOneCanvasCheckpoint(receipt, "canvasReady", "CANVAS_READY");
    reconcileOneCanvasCheckpoint(receipt, "visibleContentProofStarted", "VISIBLE_CONTENT_PROOF_STARTED");

    if (safeBool(receipt.visibleContentProof, false) && !safeBool(receipt.visibleContentHardFail, false)) {
      reconcileOneCanvasCheckpoint(receipt, "visibleContentProof", "VISIBLE_CONTENT_PROOF_PASSED", {
        visibleContentProof: true,
        visibleContentStrictProof: safeBool(receipt.visibleContentStrictProof, true),
        visibleContentSoftGap: false,
        visibleContentHardFail: false,
        visibleForwardProgress: safeBool(receipt.visibleForwardProgress, true),
        visibleContentAdmissible: safeBool(receipt.visibleContentAdmissible, true),
        visiblePlanetAvailable: safeBool(receipt.visiblePlanetAvailable, false)
      });
    } else if (
      safeBool(receipt.visibleContentSoftGap, false) ||
      (
        !safeBool(receipt.visibleContentProof, false) &&
        (
          safeBool(receipt.visibleForwardProgress, false) ||
          safeBool(receipt.visibleContentAdmissible, false) ||
          hasVisibleSurfaceSignal(buildSnapshot())
        )
      )
    ) {
      const gear = checkpointFrom("VISIBLE_CONTENT_SOFT_GAP");
      const reconcileKey = `${gear.id}:visibleContentSoftGap`;

      if (!state.reconciledCanvasKeys.includes(reconcileKey) && !isCompleted(gear.id)) {
        arrayPushUnique(state.reconciledCanvasKeys, reconcileKey);
        arrayPushUnique(state.reconciledCheckpointIds, gear.id);

        admitGearEvent("VISIBLE_CONTENT_SOFT_GAP", {
          source: "canvasReceiptReconcile",
          degraded: true,
          visibleContentProof: false,
          visibleContentStrictProof: false,
          visibleContentSoftGap: true,
          visibleForwardProgress: safeBool(receipt.visibleForwardProgress, true),
          visibleContentAdmissible: safeBool(receipt.visibleContentAdmissible, true),
          visiblePlanetAvailable: safeBool(receipt.visiblePlanetAvailable, true),
          ...buildCanvasReceiptBridge(receipt)
        });
      }
    } else if (safeBool(receipt.visibleContentHardFail, false)) {
      const gear = checkpointFrom("VISIBLE_CONTENT_HARD_FAIL");
      const reconcileKey = `${gear.id}:visibleContentHardFail`;

      if (!state.reconciledCanvasKeys.includes(reconcileKey) && !isCompleted(gear.id)) {
        arrayPushUnique(state.reconciledCanvasKeys, reconcileKey);

        admitGearEvent("VISIBLE_CONTENT_HARD_FAIL", {
          source: "canvasReceiptReconcile",
          visibleContentHardFail: true,
          ...buildCanvasReceiptBridge(receipt)
        });
      }
    }

    state.canvasBootComplete = safeBool(receipt.canvasReady, state.canvasBootComplete);
    state.canvasBootError = safeString(receipt.canvasCarrierHandoffError || receipt.childLoadError, state.canvasBootError);

    maybeCompleteInspectAndF21();
    publishGlobals();
  }

  function onCanvasPhase(event) {
    const detail = event && event.detail ? event.detail : {};
    const phaseEvent = detail.event || {};
    const phase = phaseEvent.event || phaseEvent.phase || phaseEvent.id || "";

    if (PROGRESS_ONLY_EVENTS.has(phase)) {
      countProgressOnlyEvent(phase, {
        source: "hearth:canvas-phase",
        ...clonePlain(phaseEvent.snapshot || {}),
        ...clonePlain(phaseEvent.detail || {})
      });
      return;
    }

    if (state.completionClosed) {
      const gear = checkpointFrom(phase);

      if (gear && isCompleted(gear.id)) {
        compactArchive("postgame-closed-duplicate-suppressed", phase, gear, {
          source: "hearth:canvas-phase",
          compact: true
        });
        return;
      }
    }

    admitGearEvent(phase, {
      source: "hearth:canvas-phase",
      ...clonePlain(phaseEvent.snapshot || {}),
      ...clonePlain(phaseEvent.detail || {}),
      ...buildCanvasReceiptBridge()
    });

    reconcileCanvasReceipt({ force: true });
  }

  function bindControls() {
    if (refs.copyButton && !refs.copyButton.dataset.hearthSouthAliasParentBootBound) {
      refs.copyButton.dataset.hearthSouthAliasParentBootBound = "true";
      refs.copyButton.addEventListener("click", copyDiagnostic);
    }

    if (refs.toggleButton && refs.receiptBox && !refs.toggleButton.dataset.hearthSouthAliasParentBootBound) {
      refs.toggleButton.dataset.hearthSouthAliasParentBootBound = "true";
      refs.toggleButton.addEventListener("click", () => {
        const visible = refs.receiptBox.dataset.visible !== "true";
        refs.receiptBox.dataset.visible = String(visible);
        refs.toggleButton.textContent = visible ? "Hide receipt" : "Show receipt";
        if (refs.receiptText) refs.receiptText.textContent = visible ? getReceiptText() : "";
      });
    }

    if (refs.inspectButton && !refs.inspectButton.dataset.hearthSouthAliasParentBootBound) {
      refs.inspectButton.dataset.hearthSouthAliasParentBootBound = "true";
      refs.inspectButton.addEventListener("click", () => {
        const currentlyInspecting = Boolean(
          doc &&
          doc.documentElement &&
          (
            doc.documentElement.dataset.hearthSouthPlanetInspect === "true" ||
            doc.documentElement.dataset.hearthEastInspectReservedActive === "true"
          )
        );
        setInspectMode(!currentlyInspecting);
      });
    }

    if (refs.showTab && !refs.showTab.dataset.hearthSouthAliasParentBootBound) {
      refs.showTab.dataset.hearthSouthAliasParentBootBound = "true";
      refs.showTab.addEventListener("click", () => {
        setInspectMode(false);
      });
    }

    if (refs.collapseButton && refs.cockpit && !refs.collapseButton.dataset.hearthSouthAliasParentBootCollapseBound) {
      refs.collapseButton.dataset.hearthSouthAliasParentBootCollapseBound = "true";
      refs.collapseButton.addEventListener("click", () => {
        const expanded = refs.cockpit.dataset.cockpitMode !== "expanded-cockpit";
        refs.cockpit.dataset.cockpitMode = expanded ? "expanded-cockpit" : "loading-cockpit";
        refs.collapseButton.textContent = expanded ? "Collapse cockpit" : "Expand cockpit";
        scheduleRender();
      });
    }
  }

  function setInspectMode(active) {
    ensureRefs();

    if (doc && doc.documentElement) {
      doc.documentElement.dataset.hearthSouthPlanetInspect = String(active);
      doc.documentElement.dataset.hearthEastInspectReservedActive = String(active);
    }

    if (refs.cockpit) {
      refs.cockpit.dataset.cockpitMode = active ? "planet-inspect" : "diagnostic-dock";
    }

    if (refs.showTab) {
      refs.showTab.hidden = !active;
      refs.showTab.dataset.visible = String(active);
    }

    if (refs.inspectButton) {
      refs.inspectButton.textContent = active ? "Show diagnostic" : "Inspect planet";
    }

    state.inspectModeAvailable = Boolean(refs.inspectButton && refs.cockpit);
    state.inspectPlanetControlAvailable = Boolean(refs.inspectButton);
    state.diagnosticCanLeavePlanetFrame = Boolean(refs.inspectButton && refs.cockpit && refs.showTab);
    state.diagnosticDockHiddenForInspection = Boolean(active);
    state.showDiagnosticTabVisible = Boolean(active);
    state.diagnosticDockRestorable = Boolean(refs.cockpit);

    hasStrictInspectSignal(buildSnapshot({
      inspectModeAvailable: state.inspectModeAvailable,
      inspectPlanetControlAvailable: state.inspectPlanetControlAvailable,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame
    }));

    recordLocal(active ? "SOUTH_INSPECT_MODE_REQUESTED" : "SOUTH_DIAGNOSTIC_DOCK_RESTORED", {
      diagnosticDockRestorable: true,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame
    });

    scheduleRender();
    publishGlobals();
  }

  async function copyDiagnostic() {
    const text = getReceiptText();
    let ok = false;

    try {
      if (root.navigator && root.navigator.clipboard && isFunction(root.navigator.clipboard.writeText)) {
        await root.navigator.clipboard.writeText(text);
        ok = true;
      } else if (doc) {
        const textarea = doc.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "readonly");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        doc.body.appendChild(textarea);
        textarea.select();
        doc.execCommand("copy");
        textarea.remove();
        ok = true;
      }
    } catch (error) {
      recordError("COPY_DIAGNOSTIC_FAILED", error && error.message ? error.message : String(error));
    }

    if (refs.copyButton) {
      const original = refs.copyButton.textContent || "Copy diagnostic";
      refs.copyButton.textContent = ok ? "Copied" : "Copy failed";
      root.setTimeout(() => {
        refs.copyButton.textContent = original;
      }, 1000);
    }

    return ok;
  }

  function localProgressForActive(snapshot = buildSnapshot()) {
    const active = activeCheckpoint();

    if (state.completionLatched) return 100;
    if (isCompleted(active.id)) return 100;

    switch (active.id) {
      case "F1A_HTML_SHELL_RENDERED":
        return 80;
      case "F1B_LOAD_LEDGER_INITIALIZED":
        return 90;
      case "F2_FIRST_PAINT_COCKPIT_VISIBLE":
        return safeBool(snapshot.cockpitReady, false) ? 90 : 45;
      case "F3_SCRIPT_ORDER_COMPLETE":
        return 90;
      case "F5_AUTHORITY_AVAILABILITY_READY":
        return state.northPresent ? 90 : 45;
      case "F8_CONDUCTOR_HYDRATED":
        return 90;
      case "F13A_CANVAS_COOPERATIVE_BOOT_STARTED":
        if (state.canvasParentBootAllowed && !state.canvasParentBootAttempted) return 72;
        return safeBool(snapshot.canvasCarrierRequested, false) || state.canvasBootRequested ? 88 : 24;
      case "F13B_CANVAS_MOUNT_CREATED":
        return safeBool(snapshot.canvasCarrierMounted, false) ? 90 : 35;
      case "F13C_CANVAS_CONTEXT_READY":
        return safeBool(snapshot.canvasContextReady, false) ? 90 : 35;
      case "F13D_DRAG_INSPECTION_BOUND":
        return safeBool(snapshot.dragInspectionBound, false) ? 90 : 35;
      case "F13E_ATLAS_BUILD_STARTED":
        return safeBool(snapshot.atlasBuildStarted, false) ? 90 : 30;
      case "F13F_ATLAS_BUILD_COMPLETE":
        return clamp(snapshot.atlasBuildProgress, 0, 99);
      case "F13G_TEXTURE_COMPOSE_STARTED":
        return safeBool(snapshot.textureComposeStarted, false) ? 90 : 30;
      case "F13H_TEXTURE_COMPOSE_COMPLETE":
        return clamp(snapshot.textureComposeProgress, 0, 99);
      case "F13I_FIRST_FRAME_REQUESTED":
        return safeBool(snapshot.firstFrameRequested, false) ? 90 : 40;
      case "F13J_FIRST_FRAME_DETECTED":
        return safeBool(snapshot.firstFrameDetected, false) ? 90 : 40;
      case "F13K_CANVAS_READY":
        return safeBool(snapshot.canvasReady, false) ? 90 : 50;
      case "F13L_VISIBLE_CONTENT_PROOF_STARTED":
        return safeBool(snapshot.visibleContentProofStarted, false) ? 90 : 40;
      case "F13M_VISIBLE_CONTENT_PROOF_PASSED":
        if (
          safeBool(snapshot.visibleContentProof, false) &&
          !safeBool(snapshot.visibleContentSoftGap, false) &&
          !safeBool(snapshot.visibleContentHardFail, false)
        ) {
          return 90;
        }
        if (hasVisibleSurfaceSignal(snapshot)) return 78;
        return safeBool(snapshot.nonblankPlanetVisible, false) ? 58 : 28;
      case "F13N_INSPECT_MODE_READY":
        if (hasStrictInspectSignal(snapshot)) return 90;
        if (hasFallbackInspectSignal(snapshot)) return 72;
        return 42;
      case "F21_COMPLETION_LATCHED": {
        const gates = evaluateNewsGates(snapshot);
        return gates.newsGatePassedBeforeF21 || gates.newsGateDegradedBeforeF21 ? 92 : 55;
      }
      default:
        return 20;
    }
  }

  function composeVisiblePacket() {
    const composer = readSouthComposer();
    const active = activeCheckpoint();
    const highest = highestCompletedCheckpoint();
    const snapshot = buildSnapshot();
    const gates = evaluateNewsGates(snapshot);

    const input = {
      ...snapshot,
      ...gates,
      activeGearId: active.id,
      activeGearRank: active.rank,
      activeFibonacciStage: active.fibonacci,
      activeCheckpointId: active.id,
      activeCheckpointRank: active.rank,
      activeCheckpointLabel: active.label,
      activeGearLocalProgress: localProgressForActive(snapshot),
      completedCheckpoints: state.completedCheckpoints.slice(),
      degradedCheckpoints: state.degradedCheckpoints.slice(),
      highestCompletedCheckpointId: highest ? highest.id : "",
      highestCompletedRank: highest ? highest.rank : 0,
      queuedEventsCount: state.queuedEvents.length,
      archivedEventsCount: state.archivedEvents.length,
      compactArchiveCount: state.compactArchiveCount,
      duplicateCompletedEventCount: state.duplicateCompletedEventCount,
      duplicatePostgameEventCount: state.duplicatePostgameEventCount,
      progressOnlyEventCounts: clonePlain(state.progressOnlyEventCounts),
      blockedEventsCount: state.blockedEvents.length,
      admittedEventsCount: state.admittedEvents.length,
      completionLatched: state.completionLatched,
      degradedCompletionLatched: state.degradedCompletionLatched,
      readyTextAllowed: state.readyTextAllowed,
      partialReceiptAvailable: true,
      finalReceiptAvailable: state.completionLatched,
      copyDiagnosticArmed: true,
      dockVisible: true,
      buttonsReachable: true
    };

    if (composer && isFunction(composer.composeVisibleState)) {
      try {
        const packet = composer.composeVisibleState(input);

        if (isObject(packet)) {
          state.latestComposerPacket = packet;
          return packet;
        }
      } catch (error) {
        recordError("SOUTH_COMPOSER_FAILED", error && error.message ? error.message : String(error));
      }
    }

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      activeGearId: active.id,
      activeGearRank: active.rank,
      activeGearFibonacci: active.fibonacci,
      activeGearEvent: active.event,
      activeGearLabel: active.label,
      activeGearLocalProgress: localProgressForActive(snapshot),
      activeGearProgressCap: 100,
      activeGearComplete: isCompleted(active.id),
      activeCheckpointId: active.id,
      activeCheckpointRank: active.rank,
      activeFibonacciStage: active.fibonacci,
      highestCompletedCheckpointId: highest ? highest.id : "",
      highestCompletedRank: highest ? highest.rank : 0,
      completionLatched: state.completionLatched,
      degradedCompletionLatched: state.degradedCompletionLatched,
      readyTextAllowed: state.readyTextAllowed,
      visibleStatusText: state.completionLatched ? "Ready" : `Loading ${active.label}`,
      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      mainDisplayProgress: localProgressForActive(snapshot),
      mainProgressCap: 100,
      visibleProgress: localProgressForActive(snapshot),
      progressCap: 100,
      cockpitMode: state.completionLatched || snapshot.visiblePlanetAvailable ? "diagnostic-dock" : "loading-cockpit",
      latestVisibleEvent: state.latestEvent,
      partialReceiptAvailable: true,
      finalReceiptAvailable: state.completionLatched,
      receiptToggleReady: true,
      copyDiagnosticArmed: true,
      buttonsReachable: true,
      ...snapshot,
      ...gates,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };

    state.latestComposerPacket = packet;
    return packet;
  }

  function renderLanes(packet) {
    const active = activeCheckpoint();

    return CHECKPOINTS.map((gear) => {
      const complete = state.completedCheckpoints.includes(gear.id);
      const degraded = state.degradedCheckpoints.includes(gear.id);
      const isActive = gear.id === active.id && !state.completionLatched;
      const queued = state.queuedEvents.some((item) => item.checkpointId === gear.id);
      const progress = complete ? 100 : isActive ? clamp(packet.activeGearLocalProgress || packet.mainDisplayProgress || 0, 0, 100) : 0;

      const status =
        complete && degraded ? "DEGRADED" :
          complete ? "COMPLETE" :
            isActive ? "ACTIVE" :
              queued ? "QUEUED" :
                "PENDING";

      return [
        `<section class="hearth-ledger-lane" data-lane="${gear.id}" data-status="${status}">`,
        `<div class="hearth-ledger-lane-top">`,
        `<span class="hearth-ledger-lane-title">`,
        `<strong>${gear.fibonacci} · ${gear.label}</strong>`,
        `<span>${gear.event}</span>`,
        `</span>`,
        `<span class="hearth-ledger-lane-status">${status}</span>`,
        `</div>`,
        `<div class="hearth-ledger-lane-track">`,
        `<span class="hearth-ledger-lane-fill" style="width:${progress}%"></span>`,
        `</div>`,
        `</section>`
      ].join("");
    }).join("");
  }

  function scheduleRender() {
    if (renderTimer) return;

    renderTimer = root.setTimeout(() => {
      renderTimer = 0;
      render();
    }, state.completionClosed ? 180 : 80);
  }

  function render() {
    ensureRefs();

    const packet = composeVisiblePacket();
    const progress = clamp(packet.mainDisplayProgress ?? packet.activeGearLocalProgress ?? 0, 0, 100);
    const stage = packet.activeGearFibonacci || packet.activeFibonacciStage || activeCheckpoint().fibonacci;
    const label = packet.activeGearLabel || packet.activeCheckpointLabel || activeCheckpoint().label;
    const statusText = packet.visibleStatusText || packet.postgameStatus || state.postgameStatus;

    state.renderCount += 1;

    if (refs.stage) refs.stage.textContent = `${stage} · ${label}`;
    if (refs.heartbeat) refs.heartbeat.textContent = statusText;
    if (refs.latest) refs.latest.textContent = `latest=${state.latestEvent}`;
    if (refs.fill) refs.fill.style.width = `${progress}%`;
    if (refs.percent) refs.percent.textContent = `${Math.round(progress)}%`;
    if (refs.lanes) refs.lanes.innerHTML = renderLanes(packet);
    if (refs.receiptText && refs.receiptBox && refs.receiptBox.dataset.visible === "true") {
      refs.receiptText.textContent = getReceiptText();
    }

    if (refs.cockpit && refs.cockpit.dataset.cockpitMode !== "planet-inspect") {
      refs.cockpit.dataset.cockpitMode = packet.cockpitMode || (packet.visiblePlanetAvailable ? "diagnostic-dock" : "loading-cockpit");
    }

    if (refs.status) refs.status.textContent = getStatusText();

    publishDataset();
    publishGlobals();
  }

  function bootEarlyGearSequence() {
    [
      "HTML_SHELL_RENDERED",
      "LOAD_LEDGER_INITIALIZED",
      "FIRST_PAINT_COCKPIT_VISIBLE",
      "SCRIPT_ORDER_COMPLETE",
      "AUTHORITY_AVAILABILITY_READY",
      "CONDUCTOR_HYDRATED"
    ].forEach((eventName) => {
      admitGearEvent(eventName, {
        source: "southBootEarlyGearSequence",
        pageResponsive: true,
        hardBlock: false,
        indexOwnsEastStep1: true,
        indexOwnsScriptOrder: true,
        southPublishesAliases: true
      });
    });
  }

  function scheduleCanvasRetry(reason = "canvas-parent-api-missing") {
    if (state.canvasRetryTimer || state.canvasBootAttempts >= CANVAS_RETRY_LIMIT || state.canvasBootComplete || state.completionClosed) return;

    state.canvasRetryTimer = root.setTimeout(() => {
      state.canvasRetryTimer = 0;
      bootCanvasOnce(reason);
    }, CANVAS_RETRY_DELAY_MS);
  }

  function bootCanvasOnce(reason = "south-parent-first-boot") {
    if (canvasBootPromise || state.canvasBootComplete || state.completionClosed) {
      return canvasBootPromise || Promise.resolve(readCanvasReceipt());
    }

    const canvas = readCanvasApi();
    const bridge = buildCanvasReceiptBridge(readCanvasReceipt());
    const childGate = classifyParentFirstChildGate(bridge);

    if (!canvas) {
      state.canvasPresent = false;
      state.canvasParentPresent = false;
      state.canvasParentBootAllowed = false;
      state.canvasBootStarted = false;
      state.canvasBootRequested = false;
      state.canvasBootError = "canvas-parent-api-missing";
      state.postgameStatus = "WAITING_FOR_CANVAS_PARENT_API";
      state.firstFailedCoordinate = "WAITING_CANVAS_PARENT_API";
      state.recommendedNextRenewalTarget = CANVAS_FILE;

      recordLocal("CANVAS_PARENT_API_WAITING_FOR_RETRY", {
        reason,
        attempt: state.canvasBootAttempts,
        retryLimit: CANVAS_RETRY_LIMIT,
        preBootChildHardBlockRetired: true
      });

      scheduleCanvasRetry("canvas-parent-api-missing");
      return Promise.resolve(null);
    }

    const method = selectCanvasBootMethod(canvas);

    if (!method) {
      state.canvasPresent = true;
      state.canvasParentPresent = true;
      state.canvasParentBootMethodAvailable = false;
      state.canvasParentBootMethod = "";
      state.canvasBootStarted = false;
      state.canvasBootRequested = false;
      state.canvasBootError = "canvas-parent-boot-method-missing";
      state.postgameStatus = "WAITING_FOR_CANVAS_PARENT_BOOT_METHOD";
      state.firstFailedCoordinate = "WAITING_CANVAS_PARENT_BOOT_METHOD";
      state.recommendedNextRenewalTarget = CANVAS_FILE;

      recordLocal("CANVAS_PARENT_BOOT_METHOD_WAITING", {
        reason,
        availableParent: true,
        preBootChildMissingObservation: childGate.missing,
        preBootChildMissingIsHardBlock: false
      });

      scheduleCanvasRetry("canvas-parent-boot-method-missing");
      return Promise.resolve(null);
    }

    state.canvasPresent = true;
    state.canvasParentPresent = true;
    state.canvasParentBootMethodAvailable = true;
    state.canvasParentBootMethod = method;
    state.canvasParentBootAllowed = true;
    state.canvasParentBootAttempted = true;
    state.canvasParentBootGatePhase = "PARENT_ATTEMPTED";
    state.canvasChildGatePhase = "PARENT_ATTEMPTED";

    state.canvasBootRequested = true;
    state.canvasBootStarted = true;
    state.canvasBootAttempts += 1;
    state.canvasBootBlockedByChildGate = false;
    state.preParentChildMissingIsHardBlock = false;
    state.postgameStatus = "CANVAS_PARENT_BOOT_ATTEMPTED";
    state.firstFailedCoordinate = "WAITING_PARENT_BOOT_RECEIPT";
    state.recommendedNextRenewalTarget = FILE;

    recordLocal("CANVAS_PARENT_FIRST_BOOT_ATTEMPTED", {
      reason,
      method,
      attempt: state.canvasBootAttempts,
      preBootChildMissingObservation: childGate.missing,
      preBootChildMissingIsHardBlock: false,
      parentFirstCanvasBootGateActive: true
    });

    admitGearEvent("CANVAS_COOPERATIVE_BOOT_STARTED", {
      source: "southParentFirstBootGate",
      method,
      parentBootAttempted: true,
      preBootChildHardBlockRetired: true,
      preBootChildMissingObservation: childGate.missing,
      canvasCarrierRequested: true,
      canvasParentBootGatePhase: "PARENT_ATTEMPTED"
    });

    try {
      const options = {
        mount: refs.mount || "#hearthCanvasMount",
        onReady: () => {
          state.canvasParentBootResolved = true;
          state.canvasParentBootResultReceived = true;
          reconcileCanvasReceipt({ force: true });
        },
        onError: (error) => {
          state.canvasParentBootRejected = true;
          state.canvasParentBootResultReceived = true;
          state.canvasBootError = error && error.message ? error.message : String(error);
          recordError("CANVAS_PARENT_BOOT_ERROR", state.canvasBootError);
          reconcileCanvasReceipt({ force: true });
        }
      };

      canvasBootPromise = Promise.resolve(canvas[method](options))
        .then((result) => {
          state.canvasParentBootResolved = true;
          state.canvasParentBootResultReceived = true;
          canvasBootPromise = null;

          const receipt = isObject(result) ? result : readCanvasReceipt();
          const nextBridge = buildCanvasReceiptBridge(isObject(receipt) ? receipt : readCanvasReceipt());
          const nextGate = classifyParentFirstChildGate(nextBridge);

          state.canvasBootComplete = Boolean(
            nextBridge.canvasReady ||
            nextBridge.canvasVisibleContentProof ||
            nextBridge.canvasVisibleContentSoftGap
          );

          state.canvasBootError = safeString(
            nextBridge.canvasCarrierHandoffError || nextBridge.childLoadError,
            state.canvasBootError
          );

          if (nextGate.hardBlock) {
            state.postgameStatus = "POST_PARENT_CANVAS_CHILD_GATE_FAILED";
            state.firstFailedCoordinate = "POST_PARENT_CHILD_GATE_FAILURE";
            state.recommendedNextRenewalTarget = CANVAS_FILE;
            recordError("POST_PARENT_CHILD_GATE_FAILURE", nextGate.reason, {
              phase: nextGate.phase,
              missing: nextGate.missing
            });
          } else if (nextGate.degraded) {
            state.postgameStatus = "POST_PARENT_CANVAS_CHILD_GATE_DEGRADED_FORWARD_PROGRESS";
            state.firstFailedCoordinate = "POST_PARENT_CHILD_GATE_DEGRADED";
            state.recommendedNextRenewalTarget = "read-canvas-receipt-before-renewal";
            recordLocal("POST_PARENT_CHILD_GATE_DEGRADED_FORWARD_PROGRESS", {
              phase: nextGate.phase,
              missing: nextGate.missing
            });
          } else if (nextGate.ready) {
            state.postgameStatus = "POST_PARENT_CANVAS_CHILD_GATE_READY";
            recordLocal("POST_PARENT_CHILD_GATE_READY", {
              phase: nextGate.phase
            });
          }

          reconcileCanvasReceipt({ force: true });
          maybeCompleteInspectAndF21();
          scheduleRender();
          publishGlobals();

          return result;
        })
        .catch((error) => {
          state.canvasParentBootRejected = true;
          state.canvasParentBootResultReceived = true;
          canvasBootPromise = null;

          state.canvasBootError = error && error.message ? error.message : String(error);

          const nextBridge = buildCanvasReceiptBridge(readCanvasReceipt());
          const nextGate = classifyParentFirstChildGate({
            ...nextBridge,
            childLoadError: state.canvasBootError
          });

          state.canvasBootBlockedByChildGate = nextGate.hardBlock === true;
          state.postgameStatus = nextGate.hardBlock
            ? "POST_PARENT_CANVAS_CHILD_GATE_FAILED"
            : "CANVAS_PARENT_BOOT_PROMISE_FAILED";
          state.firstFailedCoordinate = nextGate.hardBlock
            ? "POST_PARENT_CHILD_GATE_FAILURE"
            : "PARENT_BOOT_PROMISE_FAILED";
          state.recommendedNextRenewalTarget = CANVAS_FILE;

          recordError("CANVAS_PARENT_BOOT_PROMISE_FAILED", state.canvasBootError, {
            phase: nextGate.phase,
            missing: nextGate.missing,
            preBootChildHardBlockRetired: true
          });

          reconcileCanvasReceipt({ force: true });
          scheduleRender();
          publishGlobals();

          return null;
        });

      return canvasBootPromise;
    } catch (error) {
      state.canvasParentBootRejected = true;
      state.canvasParentBootResultReceived = true;
      state.canvasBootError = error && error.message ? error.message : String(error);

      const nextBridge = buildCanvasReceiptBridge(readCanvasReceipt());
      const nextGate = classifyParentFirstChildGate({
        ...nextBridge,
        childLoadError: state.canvasBootError
      });

      state.canvasBootBlockedByChildGate = nextGate.hardBlock === true;
      state.postgameStatus = nextGate.hardBlock
        ? "POST_PARENT_CANVAS_CHILD_GATE_FAILED"
        : "CANVAS_PARENT_BOOT_SYNC_FAILED";
      state.firstFailedCoordinate = nextGate.hardBlock
        ? "POST_PARENT_CHILD_GATE_FAILURE"
        : "PARENT_BOOT_SYNC_FAILED";
      state.recommendedNextRenewalTarget = CANVAS_FILE;

      recordError("CANVAS_PARENT_BOOT_SYNC_FAILED", state.canvasBootError, {
        phase: nextGate.phase,
        missing: nextGate.missing
      });

      canvasBootPromise = null;
      reconcileCanvasReceipt({ force: true });
      scheduleRender();
      publishGlobals();

      return Promise.resolve(null);
    }
  }

  function startWatchdog() {
    if (watchdogTimer) root.clearInterval(watchdogTimer);

    watchdogTimer = root.setInterval(() => {
      state.watchdogTicks += 1;

      refreshAuthorityPresence();

      if (
        !state.canvasBootComplete &&
        !canvasBootPromise &&
        !state.canvasBootBlockedByChildGate &&
        state.canvasBootAttempts < CANVAS_RETRY_LIMIT
      ) {
        bootCanvasOnce("watchdog-parent-first-retry");
      }

      reconcileCanvasReceipt();
      maybeCompleteInspectAndF21();
      render();

      if (state.completionClosed || state.watchdogTicks >= 90) {
        root.clearInterval(watchdogTimer);
        watchdogTimer = 0;
      }
    }, state.completionClosed ? 1000 : 450);
  }

  async function boot() {
    if (bootPromise) return bootPromise;

    bootPromise = (async () => {
      if (state.booted || state.booting) return getReceipt();

      state.booting = true;
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;
      state.postgameStatus = "SOUTH_ROUTE_CONDUCTOR_ALIAS_PUBLISHED_PARENT_FIRST_BOOT_BOOTING";
      state.firstFailedCoordinate = "BOOTING_PARENT_FIRST_CANVAS_BOOT_GATE";
      state.recommendedNextRenewalTarget = FILE;

      publishGlobals();
      ensureRefs();
      refreshAuthorityPresence();
      ensureNorthSession();

      if (root.addEventListener) {
        root.removeEventListener("hearth:canvas-phase", onCanvasPhase);
        root.addEventListener("hearth:canvas-phase", onCanvasPhase);
      }

      bootEarlyGearSequence();
      flushQueue();
      render();

      root.setTimeout(() => {
        bootCanvasOnce("initial-parent-first-boot");
        startWatchdog();
      }, 60);

      state.booting = false;
      state.booted = true;

      recordLocal("SOUTH_ROUTE_CONDUCTOR_ALIAS_PUBLISHED_PARENT_FIRST_BOOT_BOOTED", {
        indexPresent: state.indexPresent,
        northPresent: state.northPresent,
        sessionPresent: state.sessionPresent,
        canvasPresent: state.canvasPresent,
        canvasParentPresent: state.canvasParentPresent,
        canvasParentBootMethodAvailable: state.canvasParentBootMethodAvailable,
        canvasParentBootMethod: state.canvasParentBootMethod,
        preBootChildHardBlockRetired: true,
        parentFirstCanvasBootGateActive: true,
        canvasActiveExpectationBridgeRenewalActive: true,
        canvasSplitAdapterProofBridgeActive: true,
        expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
        expectedCanvasSplitContract: EXPECTED_CANVAS_SPLIT_CONTRACT,
        aliasesPublished: true
      });

      render();
      publishGlobals();
      return getReceipt();
    })();

    return bootPromise;
  }

  function dispose(reason = "manual-dispose") {
    if (watchdogTimer) {
      root.clearInterval(watchdogTimer);
      watchdogTimer = 0;
    }

    if (state.canvasRetryTimer) {
      root.clearTimeout(state.canvasRetryTimer);
      state.canvasRetryTimer = 0;
    }

    if (root.removeEventListener) {
      root.removeEventListener("hearth:canvas-phase", onCanvasPhase);
    }

    recordLocal("SOUTH_ROUTE_CONDUCTOR_ALIAS_PUBLISHED_PARENT_FIRST_BOOT_DISPOSED", { reason });
    render();
  }

  function getStatusText() {
    const light = getReceiptLight();

    return [
      "HEARTH_SOUTH_ROUTE_CONDUCTOR_STATUS",
      `contract=${light.contract}`,
      `receipt=${light.receipt}`,
      `activeCheckpointId=${light.activeCheckpointId}`,
      `activeFibonacciStage=${light.activeFibonacciStage}`,
      `activeGearProgress=${light.activeGearProgress}`,
      `highestCompletedCheckpointId=${light.highestCompletedCheckpointId}`,
      `completionLatched=${light.completionLatched}`,
      `degradedCompletionLatched=${light.degradedCompletionLatched}`,
      `strictVisibleProof=${light.strictVisibleProof}`,
      `softGapVisibleProof=${light.softGapVisibleProof}`,
      `strictInspectReady=${light.strictInspectReady}`,
      `fallbackInspectReady=${light.fallbackInspectReady}`,
      `f21LatchMode=${light.f21LatchMode}`,
      `canvasParentBootGatePhase=${light.canvasParentBootGatePhase}`,
      `canvasParentBootAttempted=${light.canvasParentBootAttempted}`,
      `canvasChildGatePhase=${light.canvasChildGatePhase}`,
      `canvasBootBlockedByChildGate=${light.canvasBootBlockedByChildGate}`,
      `preParentChildMissingIsHardBlock=${light.preParentChildMissingIsHardBlock}`,
      `visiblePlanetAvailable=${light.visiblePlanetAvailable}`,
      `visibleContentProof=${light.visibleContentProof}`,
      `inspectModeAvailable=${light.inspectModeAvailable}`,
      `diagnosticCanLeavePlanetFrame=${light.diagnosticCanLeavePlanetFrame}`,
      `canvasContract=${light.canvasContract}`,
      `canvasExpectedContract=${light.canvasExpectedContract}`,
      `canvasContractMatchesExpected=${light.canvasContractMatchesExpected}`,
      `canvasReceiptMatchesExpected=${light.canvasReceiptMatchesExpected}`,
      `canvasSplitContract=${light.canvasSplitContract}`,
      `canvasExpectedSplitContract=${light.canvasExpectedSplitContract}`,
      `canvasSplitContractMatchesExpected=${light.canvasSplitContractMatchesExpected}`,
      `canvasSplitReceiptMatchesExpected=${light.canvasSplitReceiptMatchesExpected}`,
      `canvasSplitAdapterStrictProof=${light.canvasSplitAdapterStrictProof}`,
      `canvasSplitAdapterSoftProof=${light.canvasSplitAdapterSoftProof}`,
      `canvasEastReady=${light.canvasEastReady}`,
      `canvasWestReady=${light.canvasWestReady}`,
      `canvasSouthReady=${light.canvasSouthReady}`,
      `allCanvasChildrenReady=${light.allCanvasChildrenReady}`,
      `archivedEventsCount=${light.archivedEventsCount}`,
      `compactArchiveCount=${light.compactArchiveCount}`,
      `duplicatePostgameEventCount=${light.duplicatePostgameEventCount}`,
      `progressOnlyEventCounts=${JSON.stringify(light.progressOnlyEventCounts)}`,
      `latestEvent=${light.latestEvent}`,
      `postgameStatus=${light.postgameStatus}`,
      `firstFailedCoordinate=${light.firstFailedCoordinate}`,
      `updatedAt=${light.updatedAt}`
    ].join("\n");
  }

  function getReceiptLight() {
    refreshAuthorityPresence();

    const active = activeCheckpoint();
    const highest = highestCompletedCheckpoint();
    const canvas = readCanvasReceipt();
    const bridge = buildCanvasReceiptBridge(canvas);
    const childGate = classifyParentFirstChildGate(bridge);
    const snapshot = buildSnapshot();
    const gates = evaluateNewsGates(snapshot);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      role: state.role,

      indexOwnsEastStep1: true,
      indexOwnsScriptOrder: true,
      indexOwnsRouteSafeRecognition: true,
      southPublishesRouteConductorAliases: true,
      southOwnsRouteConductorRuntime: true,

      postgameDedupActive: true,
      inspectGateActive: true,
      receiptCompactionActive: true,
      strictProofDegradeReconciliationActive: true,
      canvasNestedReceiptBridgeActive: true,
      canvasActiveExpectationBridgeRenewalActive: true,
      canvasSplitAdapterProofBridgeActive: true,
      splitChildLoaderGateActive: true,
      parentFirstCanvasBootGateActive: true,
      preBootChildHardBlockRetired: true,
      transistorGateReadActive: true,
      aliasPublicationActive: true,

      transmissionMode: true,
      oneActiveGearAtATime: true,
      activeGearProgressResets: true,
      visibleProgressRepresentsCurrentGearOnly: true,

      ...bridge,

      canvasParentBootGatePhase: state.canvasParentBootGatePhase,
      canvasParentBootAllowed: state.canvasParentBootAllowed,
      canvasParentBootAttempted: state.canvasParentBootAttempted,
      canvasParentBootResolved: state.canvasParentBootResolved,
      canvasParentBootRejected: state.canvasParentBootRejected,
      canvasParentBootResultReceived: state.canvasParentBootResultReceived,
      canvasChildGatePhase: state.canvasChildGatePhase,
      canvasBootBlockedByChildGate: state.canvasBootBlockedByChildGate,
      canvasChildGateWaiting: state.canvasChildGateWaiting,
      canvasChildGatePostParentFailure: state.canvasChildGatePostParentFailure,
      canvasChildGatePostParentDegraded: state.canvasChildGatePostParentDegraded,
      canvasChildGateLastMissing: state.canvasChildGateLastMissing,
      canvasChildGateLastProofAt: state.canvasChildGateLastProofAt,
      preParentChildMissingObservation: state.preParentChildMissingObservation,
      preParentChildMissingIsHardBlock: false,
      childGateReason: childGate.reason,

      activeCheckpointId: active.id,
      activeCheckpointRank: active.rank,
      activeFibonacciStage: active.fibonacci,
      activeGearLabel: active.label,
      activeGearProgress: localProgressForActive(snapshot),

      highestCompletedCheckpointId: highest ? highest.id : "",
      highestCompletedRank: highest ? highest.rank : 0,
      completedCheckpoints: state.completedCheckpoints.slice(),
      degradedCheckpoints: state.degradedCheckpoints.slice(),

      queuedEventsCount: state.queuedEvents.length,
      archivedEventsCount: state.archivedEvents.length,
      compactArchiveCount: state.compactArchiveCount,
      duplicateCompletedEventCount: state.duplicateCompletedEventCount,
      duplicatePostgameEventCount: state.duplicatePostgameEventCount,
      progressOnlyEventCounts: clonePlain(state.progressOnlyEventCounts),
      blockedEventsCount: state.blockedEvents.length,
      admittedEventsCount: state.admittedEvents.length,

      completionLatched: state.completionLatched,
      degradedCompletionLatched: state.degradedCompletionLatched,
      completionClosed: state.completionClosed,
      readyTextAllowed: state.readyTextAllowed,

      strictVisibleProof: state.strictVisibleProof,
      softGapVisibleProof: state.softGapVisibleProof,
      hardFailVisibleProof: state.hardFailVisibleProof,
      strictInspectReady: state.strictInspectReady,
      fallbackInspectReady: state.fallbackInspectReady,
      f21LatchMode: state.f21LatchMode,

      canvasBootRequested: state.canvasBootRequested,
      canvasBootStarted: state.canvasBootStarted,
      canvasBootComplete: state.canvasBootComplete,
      canvasBootAttempts: state.canvasBootAttempts,
      canvasBootError: state.canvasBootError,

      imageRendered: bridge.canvasImageRendered,
      visiblePlanetAvailable: bridge.canvasVisiblePlanetAvailable,
      visibleContentProof: bridge.canvasVisibleContentProof,
      visibleContentSoftGap: bridge.canvasVisibleContentSoftGap,
      visibleContentHardFail: bridge.canvasVisibleContentHardFail,

      inspectModeAvailable: state.inspectModeAvailable,
      inspectPlanetControlAvailable: state.inspectPlanetControlAvailable,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame,
      diagnosticDockHiddenForInspection: state.diagnosticDockHiddenForInspection,
      showDiagnosticTabVisible: state.showDiagnosticTabVisible,
      diagnosticDockRestorable: state.diagnosticDockRestorable,
      copyDiagnosticPreserved: state.copyDiagnosticPreserved,
      receiptToggleReady: state.receiptToggleReady,
      buttonsReachable: state.buttonsReachable,
      receiptOverlayIndependent: state.receiptOverlayIndependent,

      northGateReady: gates.northGateReady,
      eastGateReady: gates.eastGateReady,
      westGateReady: gates.westGateReady,
      southGateReady: gates.southGateReady,
      newsGatePassedBeforeF21: gates.newsGatePassedBeforeF21,
      northGateDegradedReady: gates.northGateDegradedReady,
      westGateDegradedReady: gates.westGateDegradedReady,
      southGateDegradedReady: gates.southGateDegradedReady,
      newsGateDegradedBeforeF21: gates.newsGateDegradedBeforeF21,
      publicCanvasStrict: gates.publicCanvasStrict,
      publicCanvasAccepted: gates.publicCanvasAccepted,
      canvasSplitStrictReady: gates.canvasSplitStrictReady,
      canvasSplitDegradedReady: gates.canvasSplitDegradedReady,

      latestEvent: state.latestEvent,
      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    const light = getReceiptLight();

    return {
      ...light,

      indexFile: INDEX_FILE,
      northFile: NORTH_FILE,
      eastBranchFile: EAST_BRANCH_FILE,
      westBranchFile: WEST_BRANCH_FILE,
      southBranchFile: SOUTH_BRANCH_FILE,
      canvasFile: CANVAS_FILE,
      canvasEastFile: CANVAS_EAST_FILE,
      canvasWestFile: CANVAS_WEST_FILE,
      canvasSouthFile: CANVAS_SOUTH_FILE,

      indexPresent: state.indexPresent,
      northPresent: state.northPresent,
      eastBranchPresent: state.eastBranchPresent,
      westBranchPresent: state.westBranchPresent,
      southBranchPresent: state.southBranchPresent,
      canvasPresent: state.canvasPresent,
      sessionPresent: state.sessionPresent,
      sessionCreatedBySouth: state.sessionCreatedBySouth,

      canvasParentPresent: state.canvasParentPresent,
      canvasParentBootMethodAvailable: state.canvasParentBootMethodAvailable,
      canvasParentBootMethod: state.canvasParentBootMethod,

      submittedEvents: clonePlain(state.submittedEvents),
      admittedEvents: clonePlain(state.admittedEvents),
      queuedEvents: clonePlain(state.queuedEvents),
      archivedEvents: clonePlain(state.archivedEvents),
      blockedEvents: clonePlain(state.blockedEvents),
      reconciledCheckpointIds: clonePlain(state.reconciledCheckpointIds),
      reconciledCanvasKeys: clonePlain(state.reconciledCanvasKeys),
      progressOnlyEventLast: clonePlain(state.progressOnlyEventLast),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),

      latestNorthResult: clonePlain(state.latestNorthResult),
      latestComposerPacket: clonePlain(state.latestComposerPacket),
      latestCanvasReceipt: clonePlain(state.latestCanvasReceipt),

      renderCount: state.renderCount,
      watchdogTicks: state.watchdogTicks,
      booted: state.booted,
      booting: state.booting,
      startedAt: state.startedAt,
      updatedAt: nowIso()
    };
  }

  function getReceiptText() {
    const r = getReceipt();

    const completed = (r.completedCheckpoints || []).join(" > ") || "none";
    const degraded = (r.degradedCheckpoints || []).join(" > ") || "none";

    const queued = (r.queuedEvents || [])
      .map((event) => `- ${event.at} :: ${event.checkpointId} :: ${event.reason}`)
      .join("\n") || "- none";

    const admitted = (r.admittedEvents || [])
      .map((event) => `- ${event.at} :: ${event.checkpointId} :: degraded=${event.degraded}`)
      .join("\n") || "- none";

    const blocked = (r.blockedEvents || [])
      .map((event) => `- ${event.at} :: ${event.checkpointId} :: ${event.reason}`)
      .join("\n") || "- none";

    const errors = (r.errors || [])
      .map((event) => `- ${event.at} :: ${event.code || event.event} :: ${event.message}`)
      .join("\n") || "- none";

    const progressOnlyCounts = Object.keys(r.progressOnlyEventCounts || {})
      .map((key) => `- ${key}: ${r.progressOnlyEventCounts[key]}`)
      .join("\n") || "- none";

    const localEvents = (r.localEvents || [])
      .map((event) => `- ${event.at} :: ${event.event} :: ${JSON.stringify(event.detail || {})}`)
      .join("\n") || "- none";

    return [
      "HEARTH_SOUTH_ROUTE_CONDUCTOR_ALIAS_PUBLISHED_PARENT_FIRST_BOOT_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `route=${r.route}`,
      `role=${r.role}`,
      "",
      `indexOwnsEastStep1=${r.indexOwnsEastStep1}`,
      `indexOwnsScriptOrder=${r.indexOwnsScriptOrder}`,
      `indexOwnsRouteSafeRecognition=${r.indexOwnsRouteSafeRecognition}`,
      `southPublishesRouteConductorAliases=${r.southPublishesRouteConductorAliases}`,
      `southOwnsRouteConductorRuntime=${r.southOwnsRouteConductorRuntime}`,
      "",
      `postgameDedupActive=${r.postgameDedupActive}`,
      `inspectGateActive=${r.inspectGateActive}`,
      `receiptCompactionActive=${r.receiptCompactionActive}`,
      `strictProofDegradeReconciliationActive=${r.strictProofDegradeReconciliationActive}`,
      `canvasNestedReceiptBridgeActive=${r.canvasNestedReceiptBridgeActive}`,
      `canvasActiveExpectationBridgeRenewalActive=${r.canvasActiveExpectationBridgeRenewalActive}`,
      `canvasSplitAdapterProofBridgeActive=${r.canvasSplitAdapterProofBridgeActive}`,
      `splitChildLoaderGateActive=${r.splitChildLoaderGateActive}`,
      `parentFirstCanvasBootGateActive=${r.parentFirstCanvasBootGateActive}`,
      `preBootChildHardBlockRetired=${r.preBootChildHardBlockRetired}`,
      `transistorGateReadActive=${r.transistorGateReadActive}`,
      `aliasPublicationActive=${r.aliasPublicationActive}`,
      "",
      `transmissionMode=${r.transmissionMode}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      `activeGearProgressResets=${r.activeGearProgressResets}`,
      `visibleProgressRepresentsCurrentGearOnly=${r.visibleProgressRepresentsCurrentGearOnly}`,
      "",
      `activeCheckpointId=${r.activeCheckpointId}`,
      `activeCheckpointRank=${r.activeCheckpointRank}`,
      `activeFibonacciStage=${r.activeFibonacciStage}`,
      `activeGearLabel=${r.activeGearLabel}`,
      `activeGearProgress=${r.activeGearProgress}`,
      `highestCompletedCheckpointId=${r.highestCompletedCheckpointId}`,
      `highestCompletedRank=${r.highestCompletedRank}`,
      `completedCheckpoints=${completed}`,
      `degradedCheckpoints=${degraded}`,
      "",
      `indexPresent=${r.indexPresent}`,
      `northPresent=${r.northPresent}`,
      `eastBranchPresent=${r.eastBranchPresent}`,
      `westBranchPresent=${r.westBranchPresent}`,
      `southBranchPresent=${r.southBranchPresent}`,
      `canvasPresent=${r.canvasPresent}`,
      `sessionPresent=${r.sessionPresent}`,
      `sessionCreatedBySouth=${r.sessionCreatedBySouth}`,
      "",
      `canvasParentPresent=${r.canvasParentPresent}`,
      `canvasParentBootMethodAvailable=${r.canvasParentBootMethodAvailable}`,
      `canvasParentBootMethod=${r.canvasParentBootMethod}`,
      `canvasParentBootGatePhase=${r.canvasParentBootGatePhase}`,
      `canvasParentBootAllowed=${r.canvasParentBootAllowed}`,
      `canvasParentBootAttempted=${r.canvasParentBootAttempted}`,
      `canvasParentBootResolved=${r.canvasParentBootResolved}`,
      `canvasParentBootRejected=${r.canvasParentBootRejected}`,
      `canvasParentBootResultReceived=${r.canvasParentBootResultReceived}`,
      `canvasChildGatePhase=${r.canvasChildGatePhase}`,
      `canvasBootBlockedByChildGate=${r.canvasBootBlockedByChildGate}`,
      `canvasChildGateWaiting=${r.canvasChildGateWaiting}`,
      `canvasChildGatePostParentFailure=${r.canvasChildGatePostParentFailure}`,
      `canvasChildGatePostParentDegraded=${r.canvasChildGatePostParentDegraded}`,
      `canvasChildGateLastMissing=${r.canvasChildGateLastMissing}`,
      `preParentChildMissingObservation=${r.preParentChildMissingObservation}`,
      `preParentChildMissingIsHardBlock=${r.preParentChildMissingIsHardBlock}`,
      `childGateReason=${r.childGateReason}`,
      "",
      `canvasContract=${r.canvasContract}`,
      `canvasReceipt=${r.canvasReceipt}`,
      `canvasExpectedContract=${r.canvasExpectedContract}`,
      `canvasExpectedReceipt=${r.canvasExpectedReceipt}`,
      `canvasContractMatchesExpected=${r.canvasContractMatchesExpected}`,
      `canvasReceiptMatchesExpected=${r.canvasReceiptMatchesExpected}`,
      `canvasContractAcceptedLineage=${r.canvasContractAcceptedLineage}`,
      `canvasReceiptAcceptedLineage=${r.canvasReceiptAcceptedLineage}`,
      "",
      `canvasSplitContract=${r.canvasSplitContract}`,
      `canvasSplitReceipt=${r.canvasSplitReceipt}`,
      `canvasExpectedSplitContract=${r.canvasExpectedSplitContract}`,
      `canvasExpectedSplitReceipt=${r.canvasExpectedSplitReceipt}`,
      `canvasSplitContractMatchesExpected=${r.canvasSplitContractMatchesExpected}`,
      `canvasSplitReceiptMatchesExpected=${r.canvasSplitReceiptMatchesExpected}`,
      `canvasSplitContractAcceptedLineage=${r.canvasSplitContractAcceptedLineage}`,
      `canvasSplitReceiptAcceptedLineage=${r.canvasSplitReceiptAcceptedLineage}`,
      `canvasSplitAdapterRecognized=${r.canvasSplitAdapterRecognized}`,
      `canvasSplitAdapterStrictProof=${r.canvasSplitAdapterStrictProof}`,
      `canvasSplitAdapterSoftProof=${r.canvasSplitAdapterSoftProof}`,
      "",
      `canvasEastPresent=${r.canvasEastPresent}`,
      `canvasWestPresent=${r.canvasWestPresent}`,
      `canvasSouthPresent=${r.canvasSouthPresent}`,
      `canvasEastReady=${r.canvasEastReady}`,
      `canvasWestReady=${r.canvasWestReady}`,
      `canvasSouthReady=${r.canvasSouthReady}`,
      `allCanvasChildrenReady=${r.allCanvasChildrenReady}`,
      `childLoadAttempted=${r.childLoadAttempted}`,
      `childLoadComplete=${r.childLoadComplete}`,
      `childLoadError=${r.childLoadError}`,
      `canvasChildGateMissingText=${r.canvasChildGateMissingText}`,
      "",
      `canvasBootRequested=${r.canvasBootRequested}`,
      `canvasBootStarted=${r.canvasBootStarted}`,
      `canvasBootComplete=${r.canvasBootComplete}`,
      `canvasBootAttempts=${r.canvasBootAttempts}`,
      `canvasBootError=${r.canvasBootError}`,
      `canvasReady=${r.canvasReady}`,
      `canvasCarrierMounted=${r.canvasCarrierMounted}`,
      `canvasContextReady=${r.canvasContextReady}`,
      `canvasCarrierRequested=${r.canvasCarrierRequested}`,
      `canvasCarrierHandoffOk=${r.canvasCarrierHandoffOk}`,
      `canvasCarrierHandoffError=${r.canvasCarrierHandoffError}`,
      "",
      `atlasBuildStarted=${r.atlasBuildStarted}`,
      `atlasBuildProgress=${r.atlasBuildProgress}`,
      `atlasBuildComplete=${r.atlasBuildComplete}`,
      `textureComposeStarted=${r.textureComposeStarted}`,
      `textureComposeProgress=${r.textureComposeProgress}`,
      `textureComposeComplete=${r.textureComposeComplete}`,
      `firstFrameRequested=${r.firstFrameRequested}`,
      `firstFrameDetected=${r.firstFrameDetected}`,
      `imageRendered=${r.imageRendered}`,
      `dragInspectionBound=${r.dragInspectionBound}`,
      `zoomInspectionBound=${r.zoomInspectionBound}`,
      "",
      `visibleContentProofStarted=${r.visibleContentProofStarted}`,
      `visibleContentProof=${r.visibleContentProof}`,
      `visibleContentStrictProof=${r.visibleContentStrictProof}`,
      `visibleContentSoftGap=${r.visibleContentSoftGap}`,
      `visibleContentHardFail=${r.visibleContentHardFail}`,
      `visibleForwardProgress=${r.visibleForwardProgress}`,
      `visibleContentAdmissible=${r.visibleContentAdmissible}`,
      `visiblePlanetAvailable=${r.visiblePlanetAvailable}`,
      `nonblankPlanetVisible=${r.nonblankPlanetVisible}`,
      "",
      `inspectModeAvailable=${r.inspectModeAvailable}`,
      `inspectPlanetControlAvailable=${r.inspectPlanetControlAvailable}`,
      `diagnosticCanLeavePlanetFrame=${r.diagnosticCanLeavePlanetFrame}`,
      `diagnosticDockHiddenForInspection=${r.diagnosticDockHiddenForInspection}`,
      `showDiagnosticTabVisible=${r.showDiagnosticTabVisible}`,
      `diagnosticDockRestorable=${r.diagnosticDockRestorable}`,
      `copyDiagnosticPreserved=${r.copyDiagnosticPreserved}`,
      `receiptToggleReady=${r.receiptToggleReady}`,
      `buttonsReachable=${r.buttonsReachable}`,
      `receiptOverlayIndependent=${r.receiptOverlayIndependent}`,
      "",
      `northGateReady=${r.northGateReady}`,
      `eastGateReady=${r.eastGateReady}`,
      `westGateReady=${r.westGateReady}`,
      `southGateReady=${r.southGateReady}`,
      `newsGatePassedBeforeF21=${r.newsGatePassedBeforeF21}`,
      `northGateDegradedReady=${r.northGateDegradedReady}`,
      `westGateDegradedReady=${r.westGateDegradedReady}`,
      `southGateDegradedReady=${r.southGateDegradedReady}`,
      `newsGateDegradedBeforeF21=${r.newsGateDegradedBeforeF21}`,
      "",
      `completionLatched=${r.completionLatched}`,
      `degradedCompletionLatched=${r.degradedCompletionLatched}`,
      `completionClosed=${r.completionClosed}`,
      `readyTextAllowed=${r.readyTextAllowed}`,
      `strictVisibleProof=${r.strictVisibleProof}`,
      `softGapVisibleProof=${r.softGapVisibleProof}`,
      `hardFailVisibleProof=${r.hardFailVisibleProof}`,
      `strictInspectReady=${r.strictInspectReady}`,
      `fallbackInspectReady=${r.fallbackInspectReady}`,
      `f21LatchMode=${r.f21LatchMode}`,
      "",
      `queuedEventsCount=${r.queuedEventsCount}`,
      `archivedEventsCount=${r.archivedEventsCount}`,
      `compactArchiveCount=${r.compactArchiveCount}`,
      `duplicateCompletedEventCount=${r.duplicateCompletedEventCount}`,
      `duplicatePostgameEventCount=${r.duplicatePostgameEventCount}`,
      `blockedEventsCount=${r.blockedEventsCount}`,
      `admittedEventsCount=${r.admittedEventsCount}`,
      "",
      "PROGRESS_ONLY_EVENT_COUNTS",
      progressOnlyCounts,
      "",
      "ADMITTED_EVENTS",
      admitted,
      "",
      "QUEUED_EVENTS",
      queued,
      "",
      "BLOCKED_EVENTS",
      blocked,
      "",
      "LOCAL_EVENTS",
      localEvents,
      "",
      "ERRORS",
      errors,
      "",
      `latestEvent=${r.latestEvent}`,
      `postgameStatus=${r.postgameStatus}`,
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      "",
      `renderCount=${r.renderCount}`,
      `watchdogTicks=${r.watchdogTicks}`,
      `booted=${r.booted}`,
      `booting=${r.booting}`,
      "",
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      "",
      `startedAt=${r.startedAt}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function publishDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;
    const light = getReceiptLightNoRefresh();

    dataset.hearthRouteConductorMarkerPresent = "true";
    dataset.hearthRouteConductorLoaded = "true";
    dataset.hearthRouteConductorPresent = "true";
    dataset.hearthRouteConductorContract = CONTRACT;
    dataset.hearthRouteConductorReceipt = RECEIPT;
    dataset.hearthRouteConductorVersion = VERSION;

    dataset.hearthSouthRouteConductorLoaded = "true";
    dataset.hearthSouthRouteConductorPresent = "true";
    dataset.hearthSouthRouteConductorContract = CONTRACT;
    dataset.hearthSouthRouteConductorReceipt = RECEIPT;

    dataset.hearthSouthParentFirstCanvasBootGateLoaded = "true";
    dataset.hearthSouthParentFirstCanvasBootGateContract = CONTRACT;
    dataset.hearthSouthParentFirstCanvasBootGateReceipt = RECEIPT;
    dataset.hearthSouthParentFirstCanvasBootGateReconciliationLoaded = "true";
    dataset.hearthSouthParentFirstCanvasBootGateReconciliationContract = CONTRACT;
    dataset.hearthSouthParentFirstCanvasBootGateReconciliationReceipt = RECEIPT;

    dataset.hearthSouthAliasesPublished = "true";
    dataset.hearthIndexOwnsScriptOrder = "true";
    dataset.hearthSouthOwnsRouteConductorRuntime = "true";

    dataset.hearthSouthActiveCheckpointId = light.activeCheckpointId;
    dataset.hearthSouthActiveFibonacciStage = light.activeFibonacciStage;
    dataset.hearthSouthActiveGearProgress = String(light.activeGearProgress);
    dataset.hearthSouthHighestCompletedCheckpointId = light.highestCompletedCheckpointId;

    dataset.hearthSouthCanvasParentBootGatePhase = state.canvasParentBootGatePhase;
    dataset.hearthSouthCanvasParentBootAttempted = String(state.canvasParentBootAttempted);
    dataset.hearthSouthCanvasChildGatePhase = state.canvasChildGatePhase;
    dataset.hearthSouthCanvasBootBlockedByChildGate = String(state.canvasBootBlockedByChildGate);
    dataset.hearthSouthPreParentChildMissingIsHardBlock = "false";

    dataset.hearthSouthCompletionLatched = String(state.completionLatched);
    dataset.hearthSouthDegradedCompletionLatched = String(state.degradedCompletionLatched);
    dataset.hearthSouthReadyTextAllowed = String(state.readyTextAllowed);
    dataset.hearthSouthF21LatchMode = state.f21LatchMode;

    dataset.hearthSouthVisiblePlanetAvailable = String(state.latestCanvasReceipt && state.latestCanvasReceipt.visiblePlanetAvailable === true);
    dataset.hearthSouthVisibleContentProof = String(state.strictVisibleProof);
    dataset.hearthSouthVisibleContentSoftGap = String(state.softGapVisibleProof);
    dataset.hearthSouthVisibleContentHardFail = String(state.hardFailVisibleProof);

    dataset.hearthSouthInspectModeAvailable = String(state.inspectModeAvailable);
    dataset.hearthSouthDiagnosticCanLeavePlanetFrame = String(state.diagnosticCanLeavePlanetFrame);

    dataset.hearthSouthPostgameStatus = state.postgameStatus;
    dataset.hearthSouthFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthSouthRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH_ROUTE_CONDUCTOR = api;
    root.HearthRouteConductor = api;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR = api;
    root.HEARTH_SOUTH_VISIBLE_COMPLETION = api;
    root.HEARTH_SOUTH_VISIBLE_COMPLETION_CYCLE_CONSUMER = api;
    root.HEARTH_SOUTH_PARENT_FIRST_CANVAS_BOOT_GATE_RECONCILIATION = api;
    root.HEARTH_SOUTH_PARENT_FIRST_CANVAS_BOOT_GATE = api;

    root.HEARTH.routeConductor = api;
    root.HEARTH.southRouteConductor = api;
    root.HEARTH.southVisibleCompletion = api;
    root.HEARTH.southParentFirstCanvasBootGate = api;
    root.HEARTH.southParentFirstCanvasBootGateReconciliation = api;

    root.DEXTER_LAB.hearthRouteConductor = api;
    root.DEXTER_LAB.hearthSouthRouteConductor = api;
    root.DEXTER_LAB.hearthSouthParentFirstCanvasBootGate = api;
    root.DEXTER_LAB.hearthSouthParentFirstCanvasBootGateReconciliation = api;

    const light = getReceiptLightNoRefresh();

    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = light;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT = light;
    root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT = light;
    root.HEARTH_SOUTH_PARENT_FIRST_CANVAS_BOOT_GATE_RECONCILIATION_RECEIPT = light;
    root.HEARTH_SOUTH_PARENT_FIRST_CANVAS_BOOT_GATE_RECEIPT = light;

    root.HEARTH.routeConductorReceipt = light;
    root.HEARTH.southRouteConductorReceipt = light;
    root.HEARTH.southParentFirstCanvasBootGateReceipt = light;

    root.DEXTER_LAB.hearthRouteConductorReceipt = light;
    root.DEXTER_LAB.hearthSouthRouteConductorReceipt = light;
    root.DEXTER_LAB.hearthSouthParentFirstCanvasBootGateReceipt = light;

    publishDataset();
  }

  function getReceiptLightNoRefresh() {
    const active = activeCheckpoint();
    const highest = highestCompletedCheckpoint();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      role: state.role,
      southPublishesRouteConductorAliases: true,
      southOwnsRouteConductorRuntime: true,
      parentFirstCanvasBootGateActive: true,
      preBootChildHardBlockRetired: true,
      activeCheckpointId: active.id,
      activeCheckpointRank: active.rank,
      activeFibonacciStage: active.fibonacci,
      activeGearLabel: active.label,
      activeGearProgress: state.completionLatched ? 100 : 0,
      highestCompletedCheckpointId: highest ? highest.id : "",
      highestCompletedRank: highest ? highest.rank : 0,
      completionLatched: state.completionLatched,
      degradedCompletionLatched: state.degradedCompletionLatched,
      f21LatchMode: state.f21LatchMode,
      latestEvent: state.latestEvent,
      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "south-route-conductor-alias-published-parent-first-boot",

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,

    admitGearEvent,
    reconcileCanvasReceipt,
    bootCanvasOnce,
    canLatchF21,
    maybeCompleteInspectAndF21,
    setInspectMode,
    composeVisiblePacket,
    render,
    getReceipt,
    getReceiptLight,
    getReceiptText,
    copyDiagnostic,

    readCanvasApi,
    readCanvasReceipt,
    buildCanvasReceiptBridge,
    classifyParentFirstChildGate,
    evaluateNewsGates,

    supportsAliasPublication: true,
    supportsIndexSouthResponsibilitySplit: true,
    supportsParentFirstCanvasBootGate: true,
    supportsPreBootChildHardBlockRetirement: true,
    supportsCanvasSplitAdapterProofBridge: true,
    supportsTransistorGateRead: true,
    supportsStrictProofDegradeReconciliation: true,
    supportsReceiptCompaction: true,
    supportsInspectGate: true,
    supportsF21NorthNewsLatchOnly: true,

    indexOwnsEastStep1: true,
    indexOwnsScriptOrder: true,
    indexOwnsRouteSafeRecognition: true,
    ownsRouteConductorRuntime: true,
    ownsCanvasDrawing: false,
    ownsCanvasChildFiles: false,
    ownsNorthCheckpointTruth: false,
    ownsFinalVisualPassClaim: false,

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
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

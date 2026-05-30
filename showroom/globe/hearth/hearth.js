// /showroom/globe/hearth/hearth.js
// HEARTH_SOUTH_ROUTE_CONDUCTOR_SPLIT_CHILD_LOADER_GATE_RECONCILIATION_TNT_v1
// Full-file replacement.
// South route conductor / visible completion authority only.
// Purpose:
// - Preserve postgame dedup, inspect gate, diagnostic copy, receipt toggle, inspect planet,
//   diagnostic restoration, one-active-gear transmission semantics, and F21 restraint.
// - Renew the route conductor to accept the current Canvas North split-adapter transistor parent.
// - Preserve the previous cardinal split parent as accepted lineage.
// - Directly prove Canvas East / West / South child APIs from globals when the parent receipt is stale.
// - Gate canvas boot until required split-adapter child methods are available.
// - Clear stale boot promises after child-missing failures and retry lawfully.
// - Keep F13/F21 sequencing honest.
// Does not own:
// - North checkpoint truth
// - East first-paint shell
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

  const CONTRACT = "HEARTH_SOUTH_ROUTE_CONDUCTOR_SPLIT_CHILD_LOADER_GATE_RECONCILIATION_TNT_v1";
  const RECEIPT = "HEARTH_SOUTH_ROUTE_CONDUCTOR_SPLIT_CHILD_LOADER_GATE_RECONCILIATION_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_SOUTH_CANVAS_SPLIT_ADAPTER_PROOF_BRIDGE_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_SOUTH_CANVAS_SPLIT_ADAPTER_PROOF_BRIDGE_TNT_v1";
  const VERSION = "2026-05-30.hearth-south-route-conductor-split-child-loader-gate-reconciliation-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/showroom/globe/hearth/hearth.js";
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

  const ACCEPTED_PREVIOUS_SPLIT_CONTRACT = "HEARTH_CANVAS_CARDINAL_SPLIT_NORTH_PARENT_TNT_v2";
  const ACCEPTED_PREVIOUS_SPLIT_RECEIPT = "HEARTH_CANVAS_CARDINAL_SPLIT_NORTH_PARENT_RECEIPT_v2";

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
    ACCEPTED_PREVIOUS_SPLIT_CONTRACT
  ]);

  const ACCEPTED_SPLIT_RECEIPTS = Object.freeze([
    EXPECTED_CANVAS_SPLIT_RECEIPT,
    ACCEPTED_PREVIOUS_SPLIT_RECEIPT
  ]);

  const REQUIRED_CHILD_METHODS = Object.freeze({
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

  const CANVAS_RETRY_LIMIT = 26;
  const CANVAS_RETRY_DELAY_MS = 180;
  const MAX_EVENTS = 160;
  const MAX_LOCAL_EVENTS = 120;
  const MAX_ERRORS = 120;

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
    role: "south-route-conductor-split-child-loader-gate-reconciliation",

    postgameDedupActive: true,
    inspectGateActive: true,
    receiptCompactionActive: true,
    strictProofDegradeReconciliationActive: true,
    canvasNestedReceiptBridgeActive: true,
    canvasActiveExpectationBridgeRenewalActive: true,
    canvasSplitAdapterProofBridgeActive: true,
    splitChildLoaderGateActive: true,
    transistorGateReadActive: true,

    cycleOrder: "EAST -> WEST -> NORTH -> SOUTH -> CHECKPOINT -> EAST",
    transmissionMode: true,
    oneActiveGearAtATime: true,
    activeGearProgressResets: true,
    visibleProgressRepresentsCurrentGearOnly: true,

    northPresent: false,
    eastBranchPresent: false,
    westBranchPresent: false,
    southBranchPresent: false,
    canvasPresent: false,
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
    canvasBootBlockedByChildGate: false,
    canvasChildGateWaiting: false,
    canvasChildGateLastMissing: "",
    canvasChildGateLastProofAt: "",
    canvasRetryTimer: 0,
    lastCanvasReceiptSignature: "",
    lastChildProofSignature: "",

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

    latestEvent: "SOUTH_ROUTE_CONDUCTOR_SPLIT_CHILD_LOADER_GATE_RECONCILIATION_LOADED",
    postgameStatus: "SOUTH_ROUTE_CONDUCTOR_SPLIT_CHILD_LOADER_GATE_RECONCILIATION_LOADED",
    firstFailedCoordinate: "WAITING_BOOT",
    recommendedNextRenewalTarget: FILE,

    latestNorthResult: null,
    latestComposerPacket: null,
    latestCanvasReceipt: null,
    latestChildProof: null,

    renderCount: 0,
    ledgerWriteCount: 0,
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
      return Array.isArray(value) ? value.slice() : { ...value };
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

  function getByNames(names) {
    for (const name of names) {
      if (!name) continue;

      const parts = String(name).split(".");
      let cursor = root;

      for (const part of parts) {
        if (!cursor || cursor[part] === undefined || cursor[part] === null) {
          cursor = null;
          break;
        }
        cursor = cursor[part];
      }

      if (cursor) return cursor;
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

  function datasetField(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
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

    return null;
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
      "HEARTH.canvas",
      "HEARTH.canvasAuthority",
      "HEARTH.canvasEvidence",
      "HEARTH.canvasNorth",
      "DEXTER_LAB.hearthCanvasEvidence",
      "DEXTER_LAB.hearthCanvasNorth",
      "DEXTER_LAB.hearthCanvasVisualFidelity",
      "DEXTER_LAB.hearthCanvasMaterialsReliefConsumptionInvalidation"
    ]);
  }

  function readCanvasReceipt() {
    const apiRef = readCanvasApi();
    const receipt = readReceipt(apiRef);

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
          "HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE",
          "HEARTH_CANVAS_EAST_TRANSISTOR_SOURCE",
          "HEARTH.canvasEast",
          "HEARTH.canvasEastMaterialAtlasSourceMachine",
          "DEXTER_LAB.hearthCanvasEast",
          "DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachine"
        ]
      : key === "west"
        ? [
            "HEARTH_CANVAS_WEST",
            "HEARTH_CANVAS_WEST_INSPECTION_INVALIDATION_CONTROL",
            "HEARTH.canvasWest",
            "HEARTH.canvasWestInspectionInvalidationControl",
            "DEXTER_LAB.hearthCanvasWest",
            "DEXTER_LAB.hearthCanvasWestInspectionInvalidationControl"
          ]
        : [
            "HEARTH_CANVAS_SOUTH",
            "HEARTH_CANVAS_SOUTH_TEXTURE_SPHERE_VISIBLE_PROOF",
            "HEARTH_CANVAS_SOUTH_SPLIT_ADAPTER_DRAIN_VISIBLE_PROOF",
            "HEARTH.canvasSouth",
            "HEARTH.canvasSouthTextureSphereVisibleProof",
            "HEARTH.canvasSouthSplitAdapterDrainVisibleProof",
            "DEXTER_LAB.hearthCanvasSouth",
            "DEXTER_LAB.hearthCanvasSouthTextureSphereVisibleProof",
            "DEXTER_LAB.hearthCanvasSouthSplitAdapterDrainVisibleProof"
          ];

    return getByNames(names);
  }

  function readCanvasChildReceipt(key) {
    const authority = readCanvasChildApi(key);
    const receipt = readReceipt(authority);

    if (receipt) return receipt;

    return authority && isObject(authority)
      ? {
          contract: authority.contract || "",
          receipt: authority.receipt || "",
          version: authority.version || "",
          role: authority.role || ""
        }
      : {};
  }

  function childMethodProof(key) {
    const apiRef = readCanvasChildApi(key);
    const required = REQUIRED_CHILD_METHODS[key] || [];
    const missing = required.filter((method) => !apiRef || !isFunction(apiRef[method]));
    const ready = Boolean(apiRef && missing.length === 0);
    const receipt = readCanvasChildReceipt(key);

    return {
      key,
      apiPresent: Boolean(apiRef),
      ready,
      requiredMethods: required.slice(),
      missingMethods: missing,
      contract: safeString(receipt.contract || (apiRef && apiRef.contract) || "", ""),
      receipt: safeString(receipt.receipt || (apiRef && apiRef.receipt) || "", ""),
      version: safeString(receipt.version || (apiRef && apiRef.version) || "", ""),
      role: safeString(receipt.role || (apiRef && apiRef.role) || "", "")
    };
  }

  function buildChildProof() {
    const east = childMethodProof("east");
    const west = childMethodProof("west");
    const south = childMethodProof("south");

    const missing = [];
    [east, west, south].forEach((proof) => {
      if (!proof.ready) {
        missing.push(`${proof.key}:${proof.missingMethods.join(",") || "api"}`);
      }
    });

    const proof = {
      active: true,
      source: "route-conductor-direct-child-global-proof",
      east,
      west,
      south,
      canvasEastPresent: east.apiPresent,
      canvasWestPresent: west.apiPresent,
      canvasSouthPresent: south.apiPresent,
      canvasEastReady: east.ready,
      canvasWestReady: west.ready,
      canvasSouthReady: south.ready,
      allCanvasChildrenReady: east.ready && west.ready && south.ready,
      missingChildren: missing,
      missingChildrenText: missing.join("; "),
      provenAt: nowIso()
    };

    state.latestChildProof = proof;
    state.canvasChildGateLastProofAt = proof.provenAt;
    state.canvasChildGateLastMissing = proof.missingChildrenText;

    return proof;
  }

  function childProofSignature(proof) {
    if (!proof || !isObject(proof)) return "";
    return [
      proof.canvasEastReady,
      proof.canvasWestReady,
      proof.canvasSouthReady,
      proof.east && proof.east.contract,
      proof.west && proof.west.contract,
      proof.south && proof.south.contract,
      proof.missingChildrenText
    ].join("|");
  }

  function readNorthFacade() {
    return getByNames([
      "LAB_RUNTIME_TABLE",
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
    state.northPresent = Boolean(readNorthFacade());
    state.eastBranchPresent = Boolean(readEastBranch());
    state.westBranchPresent = Boolean(readWestBranch());
    state.southBranchPresent = Boolean(readSouthComposer());
    state.canvasPresent = Boolean(readCanvasApi());
    state.sessionPresent = Boolean(getExistingSession());
  }

  function buildCanvasReceiptBridge(canvas = readCanvasReceipt()) {
    const source = isObject(canvas) ? canvas : {};
    const canvasApi = readCanvasApi();
    const childProof = buildChildProof();

    const canvasContract = safeString(
      source.contract ||
      (canvasApi && canvasApi.contract) ||
      datasetField("hearthCanvasContract", ""),
      ""
    );

    const canvasReceipt = safeString(
      source.receipt ||
      (canvasApi && canvasApi.receipt) ||
      datasetField("hearthCanvasReceipt", ""),
      ""
    );

    const splitContract = safeString(
      source.splitContract ||
      source.parentSplitContract ||
      (canvasApi && (canvasApi.splitContract || canvasApi.parentSplitContract)) ||
      datasetField("hearthCanvasSplitContract", "") ||
      datasetField("hearthCanvasParentSplitContract", ""),
      ""
    );

    const splitReceipt = safeString(
      source.splitReceipt ||
      source.parentSplitReceipt ||
      (canvasApi && (canvasApi.splitReceipt || canvasApi.parentSplitReceipt)) ||
      datasetField("hearthCanvasSplitReceipt", "") ||
      datasetField("hearthCanvasParentSplitReceipt", ""),
      ""
    );

    const canvasContractMatchesExpected = canvasContract === EXPECTED_CANVAS_CONTRACT;
    const canvasReceiptMatchesExpected = canvasReceipt === EXPECTED_CANVAS_RECEIPT;

    const canvasContractAcceptedLineage = ACCEPTED_CANVAS_CONTRACTS.includes(canvasContract);
    const canvasReceiptAcceptedLineage = ACCEPTED_CANVAS_RECEIPTS.includes(canvasReceipt);

    const splitContractMatchesExpected = splitContract === EXPECTED_CANVAS_SPLIT_CONTRACT;
    const splitReceiptMatchesExpected = splitReceipt === EXPECTED_CANVAS_SPLIT_RECEIPT;
    const splitContractAcceptedLineage = ACCEPTED_SPLIT_CONTRACTS.includes(splitContract);
    const splitReceiptAcceptedLineage = ACCEPTED_SPLIT_RECEIPTS.includes(splitReceipt);

    const receiptCardinalSplitActive = safeBool(
      source.cardinalSplitActive,
      safeBool(datasetField("hearthCanvasCardinalSplitActive", ""), false)
    );

    const transistorSplitActive = Boolean(
      splitContractMatchesExpected ||
      safeBool(source.transistorAdapterActive, false) ||
      safeBool(source.splitAdapterTransistorMode, false) ||
      safeBool(datasetField("hearthCanvasSplitAdapterTransistorMode", ""), false)
    );

    const canvasCardinalSplitActive = Boolean(receiptCardinalSplitActive || transistorSplitActive || splitContractAcceptedLineage);

    const canvasNorthActive = Boolean(
      safeBool(source.canvasNorthActive, false) ||
      safeBool(source.canvasParentActive, false) ||
      safeBool(source.splitAdapterParentActive, false) ||
      safeBool(datasetField("hearthCanvasNorthActive", ""), false) ||
      Boolean(canvasApi)
    );

    const receiptEastPresent = safeBool(source.canvasEastPresent, safeBool(datasetField("hearthCanvasEastPresent", ""), false));
    const receiptWestPresent = safeBool(source.canvasWestPresent, safeBool(datasetField("hearthCanvasWestPresent", ""), false));
    const receiptSouthPresent = safeBool(source.canvasSouthPresent, safeBool(datasetField("hearthCanvasSouthPresent", ""), false));

    const receiptEastReady = safeBool(source.canvasEastReady, safeBool(datasetField("hearthCanvasEastReady", ""), false));
    const receiptWestReady = safeBool(source.canvasWestReady, safeBool(datasetField("hearthCanvasWestReady", ""), false));
    const receiptSouthReady = safeBool(source.canvasSouthReady, safeBool(datasetField("hearthCanvasSouthReady", ""), false));

    const canvasEastPresent = receiptEastPresent || childProof.canvasEastPresent;
    const canvasWestPresent = receiptWestPresent || childProof.canvasWestPresent;
    const canvasSouthPresent = receiptSouthPresent || childProof.canvasSouthPresent;

    const canvasEastReady = receiptEastReady || childProof.canvasEastReady;
    const canvasWestReady = receiptWestReady || childProof.canvasWestReady;
    const canvasSouthReady = receiptSouthReady || childProof.canvasSouthReady;

    const allCanvasChildrenReady = Boolean(
      safeBool(source.allCanvasChildrenReady, safeBool(datasetField("hearthCanvasAllChildrenReady", ""), false)) ||
      (canvasEastReady && canvasWestReady && canvasSouthReady)
    );

    const splitAdapterRecognized = Boolean(
      splitContractAcceptedLineage ||
      splitReceiptAcceptedLineage ||
      canvasCardinalSplitActive ||
      canvasNorthActive ||
      canvasEastPresent ||
      canvasWestPresent ||
      canvasSouthPresent
    );

    const splitAdapterStrictProof = Boolean(
      splitContractMatchesExpected &&
      splitReceiptMatchesExpected &&
      canvasCardinalSplitActive &&
      canvasNorthActive &&
      canvasEastReady &&
      canvasWestReady &&
      canvasSouthReady &&
      allCanvasChildrenReady
    );

    const splitAdapterSoftProof = Boolean(
      splitAdapterStrictProof ||
      (
        splitAdapterRecognized &&
        splitContractAcceptedLineage &&
        canvasNorthActive &&
        canvasEastPresent &&
        canvasWestPresent &&
        canvasSouthPresent &&
        (allCanvasChildrenReady || (canvasEastReady && canvasWestReady && canvasSouthReady))
      )
    );

    return {
      canvasReceiptBridgeActive: true,
      canvasNestedReceiptAvailable: Boolean(canvasContract || canvasReceipt),
      canvasActiveExpectationBridgeRenewalActive: true,
      canvasSplitAdapterProofBridgeActive: true,
      splitChildLoaderGateActive: true,
      transistorGateReadActive: true,

      canvasContract,
      canvasReceipt,

      canvasExpectedContract: EXPECTED_CANVAS_CONTRACT,
      canvasExpectedReceipt: EXPECTED_CANVAS_RECEIPT,
      canvasContractMatchesExpected,
      canvasReceiptMatchesExpected,
      canvasContractAcceptedLineage,
      canvasReceiptAcceptedLineage,

      canvasAcceptedPreviousContract: ACCEPTED_PREVIOUS_CANVAS_CONTRACT,
      canvasAcceptedPreviousReceipt: ACCEPTED_PREVIOUS_CANVAS_RECEIPT,
      canvasLegacyTransitionalContract: LEGACY_TRANSITIONAL_CANVAS_CONTRACT,
      canvasLegacyTransitionalReceipt: LEGACY_TRANSITIONAL_CANVAS_RECEIPT,
      staleCanvasExpectationRenewed: true,
      oldTransitionalCanvasExpectationRetired: true,
      activeMaterialsReliefCanvasExpected: true,

      canvasSplitContract: splitContract,
      canvasSplitReceipt: splitReceipt,
      canvasExpectedSplitContract: EXPECTED_CANVAS_SPLIT_CONTRACT,
      canvasExpectedSplitReceipt: EXPECTED_CANVAS_SPLIT_RECEIPT,
      canvasAcceptedPreviousSplitContract: ACCEPTED_PREVIOUS_SPLIT_CONTRACT,
      canvasAcceptedPreviousSplitReceipt: ACCEPTED_PREVIOUS_SPLIT_RECEIPT,
      canvasSplitContractMatchesExpected: splitContractMatchesExpected,
      canvasSplitReceiptMatchesExpected: splitReceiptMatchesExpected,
      canvasSplitContractAcceptedLineage: splitContractAcceptedLineage,
      canvasSplitReceiptAcceptedLineage: splitReceiptAcceptedLineage,
      canvasSplitAdapterRecognized: splitAdapterRecognized,
      canvasSplitAdapterStrictProof: splitAdapterStrictProof,
      canvasSplitAdapterSoftProof: splitAdapterSoftProof,

      canvasCardinalSplitActive,
      canvasTransistorSplitActive: transistorSplitActive,
      canvasNorthActive,

      canvasEastFile: CANVAS_EAST_FILE,
      canvasWestFile: CANVAS_WEST_FILE,
      canvasSouthFile: CANVAS_SOUTH_FILE,

      canvasEastPresent,
      canvasWestPresent,
      canvasSouthPresent,
      canvasEastReady,
      canvasWestReady,
      canvasSouthReady,
      allCanvasChildrenReady,

      canvasEastMissingMethods: childProof.east.missingMethods.slice(),
      canvasWestMissingMethods: childProof.west.missingMethods.slice(),
      canvasSouthMissingMethods: childProof.south.missingMethods.slice(),
      canvasChildGateMissing: childProof.missingChildren.slice(),
      canvasChildGateMissingText: childProof.missingChildrenText,

      canvasEastContract: safeString(childProof.east.contract || source.canvasEastContract || "", ""),
      canvasWestContract: safeString(childProof.west.contract || source.canvasWestContract || "", ""),
      canvasSouthContract: safeString(childProof.south.contract || source.canvasSouthContract || "", ""),
      canvasEastReceipt: safeString(childProof.east.receipt || source.canvasEastReceipt || "", ""),
      canvasWestReceipt: safeString(childProof.west.receipt || source.canvasWestReceipt || "", ""),
      canvasSouthReceipt: safeString(childProof.south.receipt || source.canvasSouthReceipt || "", ""),

      canvasPreviousContract: safeString(source.previousContract || datasetField("hearthCanvasPreviousContract", ""), ""),
      canvasBaselineContract: safeString(source.baselineContract || datasetField("hearthCanvasBaselineContract", ""), ""),
      canvasVersion: safeString(source.version || datasetField("hearthCanvasVersion", ""), ""),
      canvasFile: safeString(source.file || CANVAS_FILE, CANVAS_FILE),
      canvasRole: safeString(source.role || datasetField("hearthCanvasRole", ""), ""),

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
      canvasCarrierMounted: safeBool(source.canvasCarrierMounted, safeBool(datasetField("hearthCanvasCarrierMounted", ""), false)),
      canvasContextReady: safeBool(source.canvasContextReady, safeBool(datasetField("hearthCanvasContextReady", ""), false)),
      canvasCarrierRequested: safeBool(source.canvasCarrierRequested, safeBool(datasetField("hearthCanvasCarrierRequested", ""), false)),
      canvasCarrierHandoffOk: safeBool(source.canvasCarrierHandoffOk, false),
      canvasCarrierHandoffError: safeString(source.canvasCarrierHandoffError || "", ""),
      canvasCarrierMethod: safeString(source.canvasCarrierMethod || "", ""),
      cooperativeBootUsed: safeBool(source.cooperativeBootUsed, false),
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
      doc.querySelector("[data-hearth-east-show-diagnostic-tab]");
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
      safeBool(snapshot.canvasReady, false) &&
      safeBool(snapshot.firstFrameDetected, false) &&
      safeBool(snapshot.imageRendered, false) &&
      safeBool(snapshot.textureComposeComplete, false) &&
      (
        safeBool(snapshot.nonblankPlanetVisible, false) ||
        safeBool(snapshot.visiblePlanetAvailable, false)
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
    const active = activeCheckpoint();
    const highest = highestCompletedCheckpoint();

    ensureRefs();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      route: ROUTE,

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

      canvasBootRequested: state.canvasBootRequested,
      canvasBootStarted: state.canvasBootStarted,
      canvasBootComplete: state.canvasBootComplete,
      canvasBootAttempts: state.canvasBootAttempts,
      canvasBootError: state.canvasBootError,
      canvasBootBlockedByChildGate: state.canvasBootBlockedByChildGate,
      canvasChildGateWaiting: state.canvasChildGateWaiting,
      canvasChildGateLastMissing: state.canvasChildGateLastMissing,

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
        safeBool(snapshot.canvasReady, false) &&
        safeBool(snapshot.atlasBuildComplete, false) &&
        safeBool(snapshot.textureComposeComplete, false) &&
        hasVisibleSurfaceSignal(snapshot)
      )
    );

    const eastGateReady = Boolean(
      (
        safeBool(snapshot.cooperativeBootUsed, false) ||
        state.canvasBootRequested
      ) &&
      !safeBool(snapshot.syncBootFallbackUsed, false) &&
      (
        safeBool(snapshot.canvasCarrierRequested, false) ||
        state.canvasBootRequested
      ) &&
      (
        safeBool(snapshot.canvasCarrierHandoffOk, false) ||
        safeBool(snapshot.canvasReady, false) ||
        safeBool(snapshot.canvasCarrierMounted, false)
      )
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
          safeBool(snapshot.visiblePlanetAvailable, false)
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
      source: "hearth.south.splitChildLoaderGateReconciliation",
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
        transistorGateReadActive: true
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

    while (advanced && guard < 90) {
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
        reason: "F21_FULL_ALLOWED_SPLIT_ADAPTER_STRICT"
      };
    }

    if (f13nComplete && gates.newsGateDegradedBeforeF21) {
      state.f21LatchMode = "DEGRADED";
      return {
        allowed: true,
        degraded: true,
        reason: "F21_DEGRADED_ALLOWED_SPLIT_ADAPTER_HELD"
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
      "parentSplitContract",
      "parentSplitReceipt",
      "version",
      "cardinalSplitActive",
      "canvasNorthActive",
      "canvasEastPresent",
      "canvasWestPresent",
      "canvasSouthPresent",
      "canvasEastReady",
      "canvasWestReady",
      "canvasSouthReady",
      "allCanvasChildrenReady",
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
    if (state.reconciledCanvasKeys.includes(reconcileKey) || isCompleted(gear.id)) return;

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
    const bridge = buildCanvasReceiptBridge(receipt);

    if (!isObject(receipt)) return;

    const signature = `${canvasReceiptSignature(receipt)}|${childProofSignature(state.latestChildProof)}`;
    if (signature && signature === state.lastCanvasReceiptSignature && !options.force) return;

    state.lastCanvasReceiptSignature = signature;

    reconcileOneCanvasCheckpoint({ canvasCarrierRequested: state.canvasBootRequested || bridge.canvasCarrierRequested }, "canvasCarrierRequested", "CANVAS_COOPERATIVE_BOOT_STARTED");
    reconcileOneCanvasCheckpoint({ canvasCarrierMounted: bridge.canvasCarrierMounted }, "canvasCarrierMounted", "CANVAS_MOUNT_CREATED");
    reconcileOneCanvasCheckpoint({ canvasContextReady: bridge.canvasContextReady }, "canvasContextReady", "CANVAS_CONTEXT_READY");
    reconcileOneCanvasCheckpoint({ dragInspectionBound: bridge.dragInspectionBound }, "dragInspectionBound", "DRAG_INSPECTION_BOUND");
    reconcileOneCanvasCheckpoint({ atlasBuildStarted: bridge.atlasBuildStarted }, "atlasBuildStarted", "ATLAS_BUILD_STARTED");
    reconcileOneCanvasCheckpoint({ atlasBuildComplete: bridge.atlasBuildComplete }, "atlasBuildComplete", "ATLAS_BUILD_COMPLETE");
    reconcileOneCanvasCheckpoint({ textureComposeStarted: bridge.textureComposeStarted }, "textureComposeStarted", "TEXTURE_COMPOSE_STARTED");
    reconcileOneCanvasCheckpoint({ textureComposeComplete: bridge.textureComposeComplete }, "textureComposeComplete", "TEXTURE_COMPOSE_COMPLETE");
    reconcileOneCanvasCheckpoint({ firstFrameRequested: bridge.firstFrameRequested }, "firstFrameRequested", "FIRST_FRAME_REQUESTED");
    reconcileOneCanvasCheckpoint({ firstFrameDetected: bridge.firstFrameDetected }, "firstFrameDetected", "FIRST_FRAME_DETECTED");
    reconcileOneCanvasCheckpoint({ canvasReady: bridge.canvasReady }, "canvasReady", "CANVAS_READY");
    reconcileOneCanvasCheckpoint({ visibleContentProofStarted: bridge.visibleContentProofStarted }, "visibleContentProofStarted", "VISIBLE_CONTENT_PROOF_STARTED");

    if (bridge.canvasVisibleContentProof && !bridge.canvasVisibleContentHardFail) {
      reconcileOneCanvasCheckpoint({ visibleContentProof: true }, "visibleContentProof", "VISIBLE_CONTENT_PROOF_PASSED", {
        visibleContentProof: true,
        visibleContentStrictProof: bridge.canvasVisibleContentStrictProof !== false,
        visibleContentSoftGap: false,
        visibleContentHardFail: false,
        visibleForwardProgress: bridge.canvasVisibleForwardProgress || true,
        visibleContentAdmissible: bridge.canvasVisibleContentAdmissible || true,
        visiblePlanetAvailable: bridge.canvasVisiblePlanetAvailable
      });
    } else if (
      bridge.canvasVisibleContentSoftGap ||
      (
        !bridge.canvasVisibleContentProof &&
        (
          bridge.canvasVisibleForwardProgress ||
          bridge.canvasVisibleContentAdmissible ||
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
          visibleForwardProgress: bridge.canvasVisibleForwardProgress || true,
          visibleContentAdmissible: bridge.canvasVisibleContentAdmissible || true,
          visiblePlanetAvailable: bridge.canvasVisiblePlanetAvailable || true,
          ...bridge
        });
      }
    } else if (bridge.canvasVisibleContentHardFail) {
      const gear = checkpointFrom("VISIBLE_CONTENT_HARD_FAIL");
      const reconcileKey = `${gear.id}:visibleContentHardFail`;

      if (!state.reconciledCanvasKeys.includes(reconcileKey) && !isCompleted(gear.id)) {
        arrayPushUnique(state.reconciledCanvasKeys, reconcileKey);

        admitGearEvent("VISIBLE_CONTENT_HARD_FAIL", {
          source: "canvasReceiptReconcile",
          visibleContentHardFail: true,
          ...bridge
        });
      }
    }

    state.canvasBootComplete = safeBool(receipt.canvasReady, state.canvasBootComplete);
    if (bridge.canvasReady) state.canvasBootComplete = true;

    if (bridge.canvasCarrierHandoffError) {
      state.canvasBootError = bridge.canvasCarrierHandoffError;
    }

    maybeCompleteInspectAndF21();
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

    reconcileCanvasReceipt();
  }

  function bindControls() {
    if (refs.copyButton && !refs.copyButton.dataset.hearthSouthSplitChildLoaderGateBound) {
      refs.copyButton.dataset.hearthSouthSplitChildLoaderGateBound = "true";
      refs.copyButton.addEventListener("click", copyDiagnostic);
    }

    if (refs.toggleButton && refs.receiptBox && !refs.toggleButton.dataset.hearthSouthSplitChildLoaderGateBound) {
      refs.toggleButton.dataset.hearthSouthSplitChildLoaderGateBound = "true";
      refs.toggleButton.addEventListener("click", () => {
        const visible = refs.receiptBox.dataset.visible !== "true";
        refs.receiptBox.dataset.visible = String(visible);
        refs.toggleButton.textContent = visible ? "Hide receipt" : "Show receipt";
        if (refs.receiptText) refs.receiptText.textContent = visible ? getReceiptText() : "";
      });
    }

    if (refs.inspectButton && !refs.inspectButton.dataset.hearthSouthSplitChildLoaderGateBound) {
      refs.inspectButton.dataset.hearthSouthSplitChildLoaderGateBound = "true";
      refs.inspectButton.addEventListener("click", () => {
        const currentlyInspecting = Boolean(
          doc &&
          doc.documentElement &&
          doc.documentElement.dataset.hearthSouthPlanetInspect === "true"
        );
        setInspectMode(!currentlyInspecting);
      });
    }

    if (refs.showTab && !refs.showTab.dataset.hearthSouthSplitChildLoaderGateBound) {
      refs.showTab.dataset.hearthSouthSplitChildLoaderGateBound = "true";
      refs.showTab.addEventListener("click", () => {
        setInspectMode(false);
      });
    }

    if (refs.collapseButton && refs.cockpit && !refs.collapseButton.dataset.hearthSouthSplitChildLoaderGateBound) {
      refs.collapseButton.dataset.hearthSouthSplitChildLoaderGateBound = "true";
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
        return safeBool(snapshot.canvasCarrierRequested, false) || state.canvasBootRequested ? 82 : 24;
      case "F13B_CANVAS_MOUNT_CREATED":
        if (safeBool(snapshot.canvasCarrierMounted, false)) return 90;
        if (state.canvasChildGateWaiting) return 28;
        return 35;
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
      case "F21_COMPLETION_LATCHED":
        return canLatchF21().allowed ? 92 : 55;
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
        hardBlock: false
      });
    });
  }

  function scheduleCanvasRetry(reason = "canvas-api-missing") {
    if (state.canvasRetryTimer || state.canvasBootAttempts >= CANVAS_RETRY_LIMIT || state.canvasBootComplete) return;

    state.canvasRetryTimer = root.setTimeout(() => {
      state.canvasRetryTimer = 0;
      canvasBootPromise = null;
      bootCanvasOnce(reason);
    }, CANVAS_RETRY_DELAY_MS);
  }

  function childGateAllowsCanvasBoot() {
    const proof = buildChildProof();
    const signature = childProofSignature(proof);
    const changed = signature !== state.lastChildProofSignature;

    state.lastChildProofSignature = signature;

    if (changed) {
      recordLocal("CANVAS_CHILD_GATE_PROOF_REFRESHED", {
        eastReady: proof.canvasEastReady,
        westReady: proof.canvasWestReady,
        southReady: proof.canvasSouthReady,
        allCanvasChildrenReady: proof.allCanvasChildrenReady,
        missing: proof.missingChildrenText
      });
    }

    if (proof.allCanvasChildrenReady) {
      state.canvasBootBlockedByChildGate = false;
      state.canvasChildGateWaiting = false;
      state.canvasChildGateLastMissing = "";
      if (state.canvasBootError === "canvas-child-gate-waiting" || state.canvasBootError.includes("children unavailable")) {
        state.canvasBootError = "";
      }
      return true;
    }

    state.canvasBootBlockedByChildGate = true;
    state.canvasChildGateWaiting = true;
    state.canvasChildGateLastMissing = proof.missingChildrenText || "unknown-child-api-gap";
    state.canvasBootError = `canvas-child-gate-waiting: ${state.canvasChildGateLastMissing}`;
    state.postgameStatus = "WAITING_FOR_CANVAS_SPLIT_CHILDREN";
    state.firstFailedCoordinate = "WAITING_F13B_CANVAS_MOUNT_CREATED";
    state.recommendedNextRenewalTarget = FILE;

    recordLocal("CANVAS_CHILD_GATE_WAIT", {
      missing: state.canvasChildGateLastMissing,
      attempt: state.canvasBootAttempts,
      retryLimit: CANVAS_RETRY_LIMIT
    });

    return false;
  }

  function bootCanvasOnce(reason = "south-boot") {
    if (canvasBootPromise || state.canvasBootComplete) return canvasBootPromise || Promise.resolve(readCanvasReceipt());

    const canvas = readCanvasApi();

    if (!canvas) {
      state.canvasBootAttempts += 1;
      state.canvasPresent = false;
      state.canvasBootStarted = false;
      state.canvasBootRequested = false;
      state.canvasBootError = "canvas-api-missing";

      recordLocal("CANVAS_API_WAITING_FOR_RETRY", {
        reason,
        attempt: state.canvasBootAttempts,
        retryLimit: CANVAS_RETRY_LIMIT
      });

      scheduleCanvasRetry("canvas-api-missing");
      scheduleRender();
      return Promise.resolve(null);
    }

    state.canvasPresent = true;

    if (!childGateAllowsCanvasBoot()) {
      canvasBootPromise = null;
      scheduleCanvasRetry("canvas-child-gate-waiting");
      scheduleRender();
      return Promise.resolve(null);
    }

    state.canvasBootRequested = true;
    state.canvasBootStarted = true;
    state.canvasBootBlockedByChildGate = false;
    state.canvasChildGateWaiting = false;
    state.canvasBootError = "";
    state.canvasBootAttempts += 1;

    const options = {
      mount: refs.mount || "#hearthCanvasMount",
      source: "hearth.south.splitChildLoaderGateReconciliation",
      contract: CONTRACT,
      receipt: RECEIPT,
      childProof: clonePlain(state.latestChildProof),
      onReady: () => {
        state.canvasBootComplete = true;
        state.canvasBootError = "";
        reconcileCanvasReceipt({ force: true });
      },
      onError: (error) => {
        const message = error && error.message ? error.message : String(error || "");
        state.canvasBootError = message;
        recordError("CANVAS_BOOT_ERROR", message);

        if (message.includes("children unavailable") || message.includes("incomplete") || message.includes("east:")) {
          canvasBootPromise = null;
          state.canvasBootBlockedByChildGate = true;
          scheduleCanvasRetry("canvas-boot-child-missing-error");
        }
      }
    };

    try {
      let runner = null;
      let method = "";

      if (isFunction(canvas.bootCooperative)) {
        runner = canvas.bootCooperative;
        method = "bootCooperative";
      } else if (isFunction(canvas.boot)) {
        runner = canvas.boot;
        method = "boot";
      } else if (isFunction(canvas.render)) {
        runner = canvas.render;
        method = "render";
      }

      if (!runner) {
        state.canvasBootError = "canvas-boot-method-missing";
        recordError("CANVAS_BOOT_METHOD_MISSING", "Canvas API exists but exposes no bootCooperative, boot, or render method.");
        canvasBootPromise = null;
        scheduleCanvasRetry("canvas-boot-method-missing");
        return Promise.resolve(null);
      }

      recordLocal("CANVAS_BOOT_INVOKED_AFTER_CHILD_GATE_PASS", {
        reason,
        method,
        attempt: state.canvasBootAttempts,
        childProof: clonePlain(state.latestChildProof)
      });

      canvasBootPromise = Promise.resolve(runner.call(canvas, options))
        .then((result) => {
          state.canvasBootComplete = true;
          state.canvasBootError = "";
          canvasBootPromise = null;
          reconcileCanvasReceipt({ force: true });
          return result;
        })
        .catch((error) => {
          const message = error && error.message ? error.message : String(error || "");
          state.canvasBootError = message;
          recordError("CANVAS_BOOT_PROMISE_FAILED", message, { method });

          canvasBootPromise = null;

          if (message.includes("children unavailable") || message.includes("incomplete") || message.includes("east:")) {
            state.canvasBootBlockedByChildGate = true;
            state.canvasChildGateWaiting = true;
          }

          scheduleCanvasRetry("canvas-boot-promise-failed");
          scheduleRender();
          return null;
        });

      return canvasBootPromise;
    } catch (error) {
      const message = error && error.message ? error.message : String(error || "");
      state.canvasBootError = message;
      recordError("CANVAS_BOOT_SYNC_FAILED", message);
      canvasBootPromise = null;

      if (message.includes("children unavailable") || message.includes("incomplete") || message.includes("east:")) {
        state.canvasBootBlockedByChildGate = true;
        state.canvasChildGateWaiting = true;
      }

      scheduleCanvasRetry("canvas-boot-sync-failed");
      scheduleRender();
    }

    return Promise.resolve(null);
  }

  function startWatchdog() {
    if (watchdogTimer) root.clearInterval(watchdogTimer);

    watchdogTimer = root.setInterval(() => {
      state.watchdogTicks += 1;

      refreshAuthorityPresence();
      buildChildProof();

      if (!state.canvasBootComplete && !canvasBootPromise && state.canvasBootAttempts < CANVAS_RETRY_LIMIT) {
        bootCanvasOnce("watchdog-retry");
      }

      reconcileCanvasReceipt();
      maybeCompleteInspectAndF21();
      render();

      if (state.completionClosed || state.watchdogTicks >= 96) {
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
      state.postgameStatus = "SOUTH_ROUTE_CONDUCTOR_SPLIT_CHILD_LOADER_GATE_RECONCILIATION_BOOTING";
      state.firstFailedCoordinate = "BOOTING_SPLIT_CHILD_LOADER_GATE_RECONCILIATION";
      state.recommendedNextRenewalTarget = FILE;

      ensureRefs();
      refreshAuthorityPresence();
      ensureNorthSession();
      buildChildProof();

      if (root.addEventListener) {
        root.removeEventListener("hearth:canvas-phase", onCanvasPhase);
        root.addEventListener("hearth:canvas-phase", onCanvasPhase);
      }

      bootEarlyGearSequence();
      flushQueue();
      render();

      root.setTimeout(() => {
        bootCanvasOnce("initial-boot");
        startWatchdog();
      }, 80);

      state.booting = false;
      state.booted = true;

      recordLocal("SOUTH_ROUTE_CONDUCTOR_SPLIT_CHILD_LOADER_GATE_RECONCILIATION_BOOTED", {
        northPresent: state.northPresent,
        sessionPresent: state.sessionPresent,
        canvasPresent: state.canvasPresent,
        postgameDedupActive: true,
        inspectGateActive: true,
        strictProofDegradeReconciliationActive: true,
        canvasNestedReceiptBridgeActive: true,
        canvasActiveExpectationBridgeRenewalActive: true,
        canvasSplitAdapterProofBridgeActive: true,
        splitChildLoaderGateActive: true,
        expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
        expectedCanvasSplitContract: EXPECTED_CANVAS_SPLIT_CONTRACT,
        acceptedPreviousSplitContract: ACCEPTED_PREVIOUS_SPLIT_CONTRACT
      });

      render();
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

    canvasBootPromise = null;

    if (root.removeEventListener) {
      root.removeEventListener("hearth:canvas-phase", onCanvasPhase);
    }

    recordLocal("SOUTH_ROUTE_CONDUCTOR_SPLIT_CHILD_LOADER_GATE_RECONCILIATION_DISPOSED", { reason });
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
      `visiblePlanetAvailable=${light.visiblePlanetAvailable}`,
      `visibleContentProof=${light.visibleContentProof}`,
      `inspectModeAvailable=${light.inspectModeAvailable}`,
      `diagnosticCanLeavePlanetFrame=${light.diagnosticCanLeavePlanetFrame}`,
      `canvasReceiptBridgeActive=${light.canvasReceiptBridgeActive}`,
      `canvasActiveExpectationBridgeRenewalActive=${light.canvasActiveExpectationBridgeRenewalActive}`,
      `canvasSplitAdapterProofBridgeActive=${light.canvasSplitAdapterProofBridgeActive}`,
      `splitChildLoaderGateActive=${light.splitChildLoaderGateActive}`,
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
      `canvasEastPresent=${light.canvasEastPresent}`,
      `canvasEastReady=${light.canvasEastReady}`,
      `canvasWestReady=${light.canvasWestReady}`,
      `canvasSouthReady=${light.canvasSouthReady}`,
      `allCanvasChildrenReady=${light.allCanvasChildrenReady}`,
      `canvasBootBlockedByChildGate=${light.canvasBootBlockedByChildGate}`,
      `canvasChildGateLastMissing=${light.canvasChildGateLastMissing}`,
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

      postgameDedupActive: true,
      inspectGateActive: true,
      receiptCompactionActive: true,
      strictProofDegradeReconciliationActive: true,
      canvasNestedReceiptBridgeActive: true,
      canvasActiveExpectationBridgeRenewalActive: true,
      canvasSplitAdapterProofBridgeActive: true,
      splitChildLoaderGateActive: true,
      transistorGateReadActive: true,

      transmissionMode: true,
      oneActiveGearAtATime: true,
      activeGearProgressResets: true,
      visibleProgressRepresentsCurrentGearOnly: true,

      ...bridge,

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
      canvasBootBlockedByChildGate: state.canvasBootBlockedByChildGate,
      canvasChildGateWaiting: state.canvasChildGateWaiting,
      canvasChildGateLastMissing: state.canvasChildGateLastMissing,

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
    refreshAuthorityPresence();

    const active = activeCheckpoint();
    const highest = highestCompletedCheckpoint();
    const canvas = readCanvasReceipt();
    const bridge = buildCanvasReceiptBridge(canvas);
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

      postgameDedupActive: true,
      inspectGateActive: true,
      receiptCompactionActive: true,
      strictProofDegradeReconciliationActive: true,
      canvasNestedReceiptBridgeActive: true,
      canvasActiveExpectationBridgeRenewalActive: true,
      canvasSplitAdapterProofBridgeActive: true,
      splitChildLoaderGateActive: true,
      transistorGateReadActive: true,

      cycleOrder: state.cycleOrder,
      transmissionMode: true,
      oneActiveGearAtATime: true,
      activeGearProgressResets: true,
      visibleProgressRepresentsCurrentGearOnly: true,

      northFile: NORTH_FILE,
      eastBranchFile: EAST_BRANCH_FILE,
      westBranchFile: WEST_BRANCH_FILE,
      southBranchFile: SOUTH_BRANCH_FILE,
      canvasFile: CANVAS_FILE,
      canvasEastFile: CANVAS_EAST_FILE,
      canvasWestFile: CANVAS_WEST_FILE,
      canvasSouthFile: CANVAS_SOUTH_FILE,

      ...bridge,

      northPresent: state.northPresent,
      eastBranchPresent: state.eastBranchPresent,
      westBranchPresent: state.westBranchPresent,
      southBranchPresent: state.southBranchPresent,
      canvasPresent: state.canvasPresent,
      sessionPresent: state.sessionPresent,
      sessionCreatedBySouth: state.sessionCreatedBySouth,

      activeCheckpointId: active.id,
      activeCheckpointRank: active.rank,
      activeFibonacciStage: active.fibonacci,
      activeGearLabel: active.label,
      activeGearProgress: localProgressForActive(snapshot),
      activeGearPercent: localProgressForActive(snapshot),

      highestCompletedCheckpointId: highest ? highest.id : "",
      highestCompletedRank: highest ? highest.rank : 0,

      completedCheckpoints: state.completedCheckpoints.slice(),
      degradedCheckpoints: state.degradedCheckpoints.slice(),
      reconciledCheckpointIds: state.reconciledCheckpointIds.slice(),

      queuedEventsCount: state.queuedEvents.length,
      archivedEventsCount: state.archivedEvents.length,
      compactArchiveCount: state.compactArchiveCount,
      duplicateCompletedEventCount: state.duplicateCompletedEventCount,
      duplicatePostgameEventCount: state.duplicatePostgameEventCount,
      unknownEventCount: state.unknownEventCount,
      progressOnlyEventCounts: clonePlain(state.progressOnlyEventCounts),
      progressOnlyEventLast: clonePlain(state.progressOnlyEventLast),
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
      canvasBootBlockedByChildGate: state.canvasBootBlockedByChildGate,
      canvasChildGateWaiting: state.canvasChildGateWaiting,
      canvasChildGateLastMissing: state.canvasChildGateLastMissing,
      canvasChildGateLastProofAt: state.canvasChildGateLastProofAt,

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

      newsGateState: gates,

      latestEvent: state.latestEvent,
      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      renderCount: state.renderCount,
      ledgerWriteCount: state.ledgerWriteCount,
      watchdogTicks: state.watchdogTicks,

      submittedEvents: clonePlain(state.submittedEvents),
      admittedEvents: clonePlain(state.admittedEvents),
      queuedEvents: clonePlain(state.queuedEvents),
      archivedEvents: clonePlain(state.archivedEvents),
      blockedEvents: clonePlain(state.blockedEvents),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),

      latestNorthResult: clonePlain(state.latestNorthResult),
      latestComposerPacket: clonePlain(state.latestComposerPacket),
      latestCanvasReceipt: clonePlain(state.latestCanvasReceipt),
      latestChildProof: clonePlain(state.latestChildProof),

      ownsSouthRouteConductor: true,
      ownsVisibleCompletionCoordination: true,
      ownsCanvasReceiptBridge: true,
      ownsCanvasActiveExpectationBridgeRenewal: true,
      ownsCanvasSplitAdapterProofBridge: true,
      ownsSplitChildLoaderGate: true,
      ownsNorthCheckpointTruth: false,
      ownsEastFirstPaint: false,
      ownsWestGapTaxonomy: false,
      ownsCanvasDrawing: false,
      ownsCanvasChildren: false,
      ownsTerrainTruth: false,
      ownsFinalVisualPassClaim: false,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      startedAt: state.startedAt,
      updatedAt: nowIso()
    };
  }

  function listLines(items, formatter) {
    if (!Array.isArray(items) || !items.length) return "- none";
    return items.map(formatter).join("\n");
  }

  function progressOnlyLines(map) {
    const entries = Object.keys(map || {});
    if (!entries.length) return "- none";
    return entries.map((key) => `- ${key}: ${map[key]}`).join("\n");
  }

  function getReceiptText() {
    const receipt = getReceipt();

    return [
      "HEARTH_SOUTH_ROUTE_CONDUCTOR_SPLIT_CHILD_LOADER_GATE_RECONCILIATION_RECEIPT",
      "",
      `contract=${receipt.contract}`,
      `receipt=${receipt.receipt}`,
      `previousContract=${receipt.previousContract}`,
      `baselineContract=${receipt.baselineContract}`,
      `version=${receipt.version}`,
      `file=${receipt.file}`,
      `route=${receipt.route}`,
      `role=${receipt.role}`,
      "",
      `postgameDedupActive=${receipt.postgameDedupActive}`,
      `inspectGateActive=${receipt.inspectGateActive}`,
      `receiptCompactionActive=${receipt.receiptCompactionActive}`,
      `strictProofDegradeReconciliationActive=${receipt.strictProofDegradeReconciliationActive}`,
      `canvasNestedReceiptBridgeActive=${receipt.canvasNestedReceiptBridgeActive}`,
      `canvasActiveExpectationBridgeRenewalActive=${receipt.canvasActiveExpectationBridgeRenewalActive}`,
      `canvasSplitAdapterProofBridgeActive=${receipt.canvasSplitAdapterProofBridgeActive}`,
      `splitChildLoaderGateActive=${receipt.splitChildLoaderGateActive}`,
      `transistorGateReadActive=${receipt.transistorGateReadActive}`,
      "",
      `cycleOrder=${receipt.cycleOrder}`,
      `transmissionMode=${receipt.transmissionMode}`,
      `oneActiveGearAtATime=${receipt.oneActiveGearAtATime}`,
      `activeGearProgressResets=${receipt.activeGearProgressResets}`,
      `visibleProgressRepresentsCurrentGearOnly=${receipt.visibleProgressRepresentsCurrentGearOnly}`,
      "",
      `northFile=${receipt.northFile}`,
      `eastBranchFile=${receipt.eastBranchFile}`,
      `westBranchFile=${receipt.westBranchFile}`,
      `southBranchFile=${receipt.southBranchFile}`,
      `canvasFile=${receipt.canvasFile}`,
      `canvasEastFile=${receipt.canvasEastFile}`,
      `canvasWestFile=${receipt.canvasWestFile}`,
      `canvasSouthFile=${receipt.canvasSouthFile}`,
      "",
      "CANVAS_PUBLIC_CONTRACT_BRIDGE",
      `canvasReceiptBridgeActive=${receipt.canvasReceiptBridgeActive}`,
      `canvasNestedReceiptAvailable=${receipt.canvasNestedReceiptAvailable}`,
      `canvasActiveExpectationBridgeRenewalActive=${receipt.canvasActiveExpectationBridgeRenewalActive}`,
      `canvasContract=${receipt.canvasContract}`,
      `canvasReceipt=${receipt.canvasReceipt}`,
      `canvasExpectedContract=${receipt.canvasExpectedContract}`,
      `canvasExpectedReceipt=${receipt.canvasExpectedReceipt}`,
      `canvasContractMatchesExpected=${receipt.canvasContractMatchesExpected}`,
      `canvasReceiptMatchesExpected=${receipt.canvasReceiptMatchesExpected}`,
      `canvasContractAcceptedLineage=${receipt.canvasContractAcceptedLineage}`,
      `canvasReceiptAcceptedLineage=${receipt.canvasReceiptAcceptedLineage}`,
      `staleCanvasExpectationRenewed=${receipt.staleCanvasExpectationRenewed}`,
      `oldTransitionalCanvasExpectationRetired=${receipt.oldTransitionalCanvasExpectationRetired}`,
      `activeMaterialsReliefCanvasExpected=${receipt.activeMaterialsReliefCanvasExpected}`,
      "",
      "CANVAS_SPLIT_ADAPTER_PROOF_BRIDGE",
      `canvasSplitContract=${receipt.canvasSplitContract}`,
      `canvasSplitReceipt=${receipt.canvasSplitReceipt}`,
      `canvasExpectedSplitContract=${receipt.canvasExpectedSplitContract}`,
      `canvasExpectedSplitReceipt=${receipt.canvasExpectedSplitReceipt}`,
      `canvasAcceptedPreviousSplitContract=${receipt.canvasAcceptedPreviousSplitContract}`,
      `canvasAcceptedPreviousSplitReceipt=${receipt.canvasAcceptedPreviousSplitReceipt}`,
      `canvasSplitContractMatchesExpected=${receipt.canvasSplitContractMatchesExpected}`,
      `canvasSplitReceiptMatchesExpected=${receipt.canvasSplitReceiptMatchesExpected}`,
      `canvasSplitContractAcceptedLineage=${receipt.canvasSplitContractAcceptedLineage}`,
      `canvasSplitReceiptAcceptedLineage=${receipt.canvasSplitReceiptAcceptedLineage}`,
      `canvasSplitAdapterRecognized=${receipt.canvasSplitAdapterRecognized}`,
      `canvasSplitAdapterStrictProof=${receipt.canvasSplitAdapterStrictProof}`,
      `canvasSplitAdapterSoftProof=${receipt.canvasSplitAdapterSoftProof}`,
      `canvasCardinalSplitActive=${receipt.canvasCardinalSplitActive}`,
      `canvasTransistorSplitActive=${receipt.canvasTransistorSplitActive}`,
      `canvasNorthActive=${receipt.canvasNorthActive}`,
      "",
      "CANVAS_CHILD_LOADER_GATE",
      `canvasEastPresent=${receipt.canvasEastPresent}`,
      `canvasWestPresent=${receipt.canvasWestPresent}`,
      `canvasSouthPresent=${receipt.canvasSouthPresent}`,
      `canvasEastReady=${receipt.canvasEastReady}`,
      `canvasWestReady=${receipt.canvasWestReady}`,
      `canvasSouthReady=${receipt.canvasSouthReady}`,
      `allCanvasChildrenReady=${receipt.allCanvasChildrenReady}`,
      `canvasEastMissingMethods=${receipt.canvasEastMissingMethods.join(",")}`,
      `canvasWestMissingMethods=${receipt.canvasWestMissingMethods.join(",")}`,
      `canvasSouthMissingMethods=${receipt.canvasSouthMissingMethods.join(",")}`,
      `canvasChildGateMissingText=${receipt.canvasChildGateMissingText}`,
      `canvasEastContract=${receipt.canvasEastContract}`,
      `canvasWestContract=${receipt.canvasWestContract}`,
      `canvasSouthContract=${receipt.canvasSouthContract}`,
      `canvasEastReceipt=${receipt.canvasEastReceipt}`,
      `canvasWestReceipt=${receipt.canvasWestReceipt}`,
      `canvasSouthReceipt=${receipt.canvasSouthReceipt}`,
      "",
      "CANVAS_NEWS_FIBONACCI_ALIGNMENT",
      `canvasNewsProtocolSynchronized=${receipt.canvasNewsProtocolSynchronized}`,
      `canvasFibonacciAlignmentSynchronized=${receipt.canvasFibonacciAlignmentSynchronized}`,
      `canvasActiveFibonacciGate=${receipt.canvasActiveFibonacciGate}`,
      `canvasFutureFibonacciGate=${receipt.canvasFutureFibonacciGate}`,
      `canvasOneActiveGearAtATime=${receipt.canvasOneActiveGearAtATime}`,
      `canvasF13EvidencePreserved=${receipt.canvasF13EvidencePreserved}`,
      `canvasF13EvidenceComplete=${receipt.canvasF13EvidenceComplete}`,
      `canvasF13HardFail=${receipt.canvasF13HardFail}`,
      `canvasF21ClaimedByCanvas=${receipt.canvasF21ClaimedByCanvas}`,
      `canvasReadyTextClaimedByCanvas=${receipt.canvasReadyTextClaimedByCanvas}`,
      "",
      "CANVAS_VISIBLE_PROOF",
      `canvasReady=${receipt.canvasReady}`,
      `canvasImageRendered=${receipt.canvasImageRendered}`,
      `canvasVisiblePlanetAvailable=${receipt.canvasVisiblePlanetAvailable}`,
      `canvasVisibleContentProof=${receipt.canvasVisibleContentProof}`,
      `canvasVisibleContentStrictProof=${receipt.canvasVisibleContentStrictProof}`,
      `canvasVisibleContentSoftGap=${receipt.canvasVisibleContentSoftGap}`,
      `canvasVisibleContentHardFail=${receipt.canvasVisibleContentHardFail}`,
      `canvasVisibleForwardProgress=${receipt.canvasVisibleForwardProgress}`,
      `canvasGeneratedImage=${receipt.canvasGeneratedImage}`,
      `canvasGraphicBox=${receipt.canvasGraphicBox}`,
      `canvasWebGL=${receipt.canvasWebGL}`,
      `canvasVisualPassClaimed=${receipt.canvasVisualPassClaimed}`,
      "",
      "ROUTE_AUTHORITY_PRESENCE",
      `northPresent=${receipt.northPresent}`,
      `eastBranchPresent=${receipt.eastBranchPresent}`,
      `westBranchPresent=${receipt.westBranchPresent}`,
      `southBranchPresent=${receipt.southBranchPresent}`,
      `canvasPresent=${receipt.canvasPresent}`,
      `sessionPresent=${receipt.sessionPresent}`,
      `sessionCreatedBySouth=${receipt.sessionCreatedBySouth}`,
      "",
      "ACTIVE_GEAR",
      `activeCheckpointId=${receipt.activeCheckpointId}`,
      `activeCheckpointRank=${receipt.activeCheckpointRank}`,
      `activeFibonacciStage=${receipt.activeFibonacciStage}`,
      `activeGearLabel=${receipt.activeGearLabel}`,
      `activeGearProgress=${receipt.activeGearProgress}`,
      `activeGearPercent=${receipt.activeGearPercent}`,
      "",
      `highestCompletedCheckpointId=${receipt.highestCompletedCheckpointId}`,
      `highestCompletedRank=${receipt.highestCompletedRank}`,
      "",
      "COMPLETED_CHECKPOINTS",
      listLines(receipt.completedCheckpoints, (item) => `- ${item}`),
      "",
      "DEGRADED_CHECKPOINTS",
      listLines(receipt.degradedCheckpoints, (item) => `- ${item}`),
      "",
      "RECONCILED_CHECKPOINTS",
      listLines(receipt.reconciledCheckpointIds, (item) => `- ${item}`),
      "",
      `queuedEventsCount=${receipt.queuedEventsCount}`,
      `archivedEventsCount=${receipt.archivedEventsCount}`,
      `compactArchiveCount=${receipt.compactArchiveCount}`,
      `duplicateCompletedEventCount=${receipt.duplicateCompletedEventCount}`,
      `duplicatePostgameEventCount=${receipt.duplicatePostgameEventCount}`,
      `unknownEventCount=${receipt.unknownEventCount}`,
      `blockedEventsCount=${receipt.blockedEventsCount}`,
      `admittedEventsCount=${receipt.admittedEventsCount}`,
      "",
      "PROGRESS_ONLY_EVENT_COUNTS",
      progressOnlyLines(receipt.progressOnlyEventCounts),
      "",
      "COMPLETION_STATE",
      `completionLatched=${receipt.completionLatched}`,
      `degradedCompletionLatched=${receipt.degradedCompletionLatched}`,
      `completionClosed=${receipt.completionClosed}`,
      `readyTextAllowed=${receipt.readyTextAllowed}`,
      `strictVisibleProof=${receipt.strictVisibleProof}`,
      `softGapVisibleProof=${receipt.softGapVisibleProof}`,
      `hardFailVisibleProof=${receipt.hardFailVisibleProof}`,
      `strictInspectReady=${receipt.strictInspectReady}`,
      `fallbackInspectReady=${receipt.fallbackInspectReady}`,
      `f21LatchMode=${receipt.f21LatchMode}`,
      "",
      "CANVAS_BOOT",
      `canvasBootRequested=${receipt.canvasBootRequested}`,
      `canvasBootStarted=${receipt.canvasBootStarted}`,
      `canvasBootComplete=${receipt.canvasBootComplete}`,
      `canvasBootAttempts=${receipt.canvasBootAttempts}`,
      `canvasBootError=${receipt.canvasBootError}`,
      `canvasBootBlockedByChildGate=${receipt.canvasBootBlockedByChildGate}`,
      `canvasChildGateWaiting=${receipt.canvasChildGateWaiting}`,
      `canvasChildGateLastMissing=${receipt.canvasChildGateLastMissing}`,
      `canvasChildGateLastProofAt=${receipt.canvasChildGateLastProofAt}`,
      `imageRendered=${receipt.imageRendered}`,
      `visiblePlanetAvailable=${receipt.visiblePlanetAvailable}`,
      `visibleContentProof=${receipt.visibleContentProof}`,
      `visibleContentSoftGap=${receipt.visibleContentSoftGap}`,
      `visibleContentHardFail=${receipt.visibleContentHardFail}`,
      "",
      "INSPECT_GATE",
      `inspectModeAvailable=${receipt.inspectModeAvailable}`,
      `inspectPlanetControlAvailable=${receipt.inspectPlanetControlAvailable}`,
      `diagnosticCanLeavePlanetFrame=${receipt.diagnosticCanLeavePlanetFrame}`,
      `diagnosticDockHiddenForInspection=${receipt.diagnosticDockHiddenForInspection}`,
      `showDiagnosticTabVisible=${receipt.showDiagnosticTabVisible}`,
      `diagnosticDockRestorable=${receipt.diagnosticDockRestorable}`,
      `copyDiagnosticPreserved=${receipt.copyDiagnosticPreserved}`,
      `receiptToggleReady=${receipt.receiptToggleReady}`,
      `buttonsReachable=${receipt.buttonsReachable}`,
      `receiptOverlayIndependent=${receipt.receiptOverlayIndependent}`,
      "",
      "NEWS_GATE_STATE",
      `publicCanvasStrict=${receipt.newsGateState.publicCanvasStrict}`,
      `publicCanvasAccepted=${receipt.newsGateState.publicCanvasAccepted}`,
      `canvasSplitStrictReady=${receipt.newsGateState.canvasSplitStrictReady}`,
      `canvasSplitDegradedReady=${receipt.newsGateState.canvasSplitDegradedReady}`,
      `northGateReady=${receipt.newsGateState.northGateReady}`,
      `eastGateReady=${receipt.newsGateState.eastGateReady}`,
      `westGateReady=${receipt.newsGateState.westGateReady}`,
      `southGateReady=${receipt.newsGateState.southGateReady}`,
      `newsGatePassedBeforeF21=${receipt.newsGateState.newsGatePassedBeforeF21}`,
      `northGateDegradedReady=${receipt.newsGateState.northGateDegradedReady}`,
      `westGateDegradedReady=${receipt.newsGateState.westGateDegradedReady}`,
      `southGateDegradedReady=${receipt.newsGateState.southGateDegradedReady}`,
      `newsGateDegradedBeforeF21=${receipt.newsGateState.newsGateDegradedBeforeF21}`,
      "",
      `latestEvent=${receipt.latestEvent}`,
      `postgameStatus=${receipt.postgameStatus}`,
      `firstFailedCoordinate=${receipt.firstFailedCoordinate}`,
      `recommendedNextRenewalTarget=${receipt.recommendedNextRenewalTarget}`,
      "",
      `renderCount=${receipt.renderCount}`,
      `ledgerWriteCount=${receipt.ledgerWriteCount}`,
      `watchdogTicks=${receipt.watchdogTicks}`,
      "",
      "ADMITTED_EVENTS",
      listLines(receipt.admittedEvents, (item) => `- ${item.at} :: ${item.event} :: checkpoint=${item.checkpointId} :: fibonacci=${item.fibonacci} :: degraded=${item.degraded}`),
      "",
      "QUEUED_EVENTS",
      listLines(receipt.queuedEvents, (item) => `- ${item.at} :: ${item.event} :: checkpoint=${item.checkpointId} :: reason=${item.reason}`),
      "",
      "ARCHIVED_EVENTS_COMPACT_TAIL",
      listLines(receipt.archivedEvents, (item) => `- ${item.at} :: ${item.event} :: checkpoint=${item.checkpointId} :: reason=${item.reason}`),
      "",
      "BLOCKED_EVENTS",
      listLines(receipt.blockedEvents, (item) => `- ${item.at} :: ${item.event} :: checkpoint=${item.checkpointId} :: reason=${item.reason}`),
      "",
      "LOCAL_EVENTS_COMPACT_TAIL",
      listLines(receipt.localEvents, (item) => `- ${item.at} :: ${item.event} :: ${JSON.stringify(item.detail || {})}`),
      "",
      "ERRORS",
      listLines(receipt.errors, (item) => `- ${item.at} :: ${item.code} :: ${item.message}`),
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

  function publishDataset() {
    if (!doc || !doc.documentElement) return;

    const active = activeCheckpoint();
    const highest = highestCompletedCheckpoint();
    const dataset = doc.documentElement.dataset;
    const bridge = buildCanvasReceiptBridge();

    dataset.hearthSouthRouteConductorLoaded = "true";
    dataset.hearthSouthRouteConductorContract = CONTRACT;
    dataset.hearthSouthRouteConductorReceipt = RECEIPT;
    dataset.hearthSouthCanvasNestedReceiptBridge = "true";
    dataset.hearthSouthCanvasActiveExpectationBridgeRenewal = "true";
    dataset.hearthSouthCanvasSplitAdapterProofBridge = "true";
    dataset.hearthSouthSplitChildLoaderGate = "true";
    dataset.hearthSouthTransistorGateReadActive = "true";

    dataset.hearthTransmissionMode = "true";
    dataset.oneActiveGearAtATime = "true";
    dataset.activeGearProgressResets = "true";
    dataset.visibleProgressRepresentsCurrentGearOnly = "true";

    dataset.hearthActiveCheckpointId = active.id;
    dataset.hearthActiveCheckpointRank = String(active.rank);
    dataset.hearthActiveFibonacciStage = active.fibonacci;
    dataset.hearthHighestCompletedCheckpointId = highest ? highest.id : "";
    dataset.hearthCompletedCheckpoints = state.completedCheckpoints.join(",");
    dataset.hearthDegradedCheckpoints = state.degradedCheckpoints.join(",");

    dataset.hearthCompletionLatched = String(state.completionLatched);
    dataset.hearthDegradedCompletionLatched = String(state.degradedCompletionLatched);
    dataset.hearthReadyTextAllowed = String(state.readyTextAllowed);
    dataset.hearthCompletionClosed = String(state.completionClosed);

    dataset.hearthStrictVisibleProof = String(state.strictVisibleProof);
    dataset.hearthSoftGapVisibleProof = String(state.softGapVisibleProof);
    dataset.hearthHardFailVisibleProof = String(state.hardFailVisibleProof);
    dataset.hearthStrictInspectReady = String(state.strictInspectReady);
    dataset.hearthFallbackInspectReady = String(state.fallbackInspectReady);
    dataset.hearthF21LatchMode = state.f21LatchMode;

    dataset.hearthQueuedEventsCount = String(state.queuedEvents.length);
    dataset.hearthArchivedEventsCount = String(state.archivedEvents.length);
    dataset.hearthCompactArchiveCount = String(state.compactArchiveCount);
    dataset.hearthDuplicatePostgameEventCount = String(state.duplicatePostgameEventCount);
    dataset.hearthBlockedEventsCount = String(state.blockedEvents.length);
    dataset.hearthAdmittedEventsCount = String(state.admittedEvents.length);

    dataset.hearthInspectModeAvailable = String(state.inspectModeAvailable);
    dataset.hearthInspectPlanetControlAvailable = String(state.inspectPlanetControlAvailable);
    dataset.hearthDiagnosticCanLeavePlanetFrame = String(state.diagnosticCanLeavePlanetFrame);
    dataset.hearthDiagnosticDockHiddenForInspection = String(state.diagnosticDockHiddenForInspection);
    dataset.hearthDiagnosticDockRestorable = String(state.diagnosticDockRestorable);

    dataset.hearthFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    dataset.hearthSouthCanvasReceiptBridgeActive = String(bridge.canvasReceiptBridgeActive);
    dataset.hearthSouthCanvasNestedReceiptAvailable = String(bridge.canvasNestedReceiptAvailable);
    dataset.hearthSouthCanvasActiveExpectationBridgeRenewal = "true";
    dataset.hearthSouthCanvasSplitAdapterProofBridge = "true";
    dataset.hearthSouthSplitChildLoaderGate = "true";

    dataset.hearthSouthCanvasContract = bridge.canvasContract;
    dataset.hearthSouthCanvasReceipt = bridge.canvasReceipt;
    dataset.hearthSouthCanvasExpectedContract = bridge.canvasExpectedContract;
    dataset.hearthSouthCanvasExpectedReceipt = bridge.canvasExpectedReceipt;
    dataset.hearthSouthCanvasContractMatchesExpected = String(bridge.canvasContractMatchesExpected);
    dataset.hearthSouthCanvasReceiptMatchesExpected = String(bridge.canvasReceiptMatchesExpected);
    dataset.hearthSouthCanvasContractAcceptedLineage = String(bridge.canvasContractAcceptedLineage);
    dataset.hearthSouthCanvasReceiptAcceptedLineage = String(bridge.canvasReceiptAcceptedLineage);

    dataset.hearthSouthCanvasSplitContract = bridge.canvasSplitContract;
    dataset.hearthSouthCanvasSplitReceipt = bridge.canvasSplitReceipt;
    dataset.hearthSouthCanvasExpectedSplitContract = bridge.canvasExpectedSplitContract;
    dataset.hearthSouthCanvasExpectedSplitReceipt = bridge.canvasExpectedSplitReceipt;
    dataset.hearthSouthCanvasAcceptedPreviousSplitContract = bridge.canvasAcceptedPreviousSplitContract;
    dataset.hearthSouthCanvasAcceptedPreviousSplitReceipt = bridge.canvasAcceptedPreviousSplitReceipt;
    dataset.hearthSouthCanvasSplitContractMatchesExpected = String(bridge.canvasSplitContractMatchesExpected);
    dataset.hearthSouthCanvasSplitReceiptMatchesExpected = String(bridge.canvasSplitReceiptMatchesExpected);
    dataset.hearthSouthCanvasSplitContractAcceptedLineage = String(bridge.canvasSplitContractAcceptedLineage);
    dataset.hearthSouthCanvasSplitReceiptAcceptedLineage = String(bridge.canvasSplitReceiptAcceptedLineage);
    dataset.hearthSouthCanvasSplitAdapterRecognized = String(bridge.canvasSplitAdapterRecognized);
    dataset.hearthSouthCanvasSplitAdapterStrictProof = String(bridge.canvasSplitAdapterStrictProof);
    dataset.hearthSouthCanvasSplitAdapterSoftProof = String(bridge.canvasSplitAdapterSoftProof);

    dataset.hearthSouthCanvasCardinalSplitActive = String(bridge.canvasCardinalSplitActive);
    dataset.hearthSouthCanvasTransistorSplitActive = String(bridge.canvasTransistorSplitActive);
    dataset.hearthSouthCanvasNorthActive = String(bridge.canvasNorthActive);
    dataset.hearthSouthCanvasEastPresent = String(bridge.canvasEastPresent);
    dataset.hearthSouthCanvasWestPresent = String(bridge.canvasWestPresent);
    dataset.hearthSouthCanvasSouthPresent = String(bridge.canvasSouthPresent);
    dataset.hearthSouthCanvasEastReady = String(bridge.canvasEastReady);
    dataset.hearthSouthCanvasWestReady = String(bridge.canvasWestReady);
    dataset.hearthSouthCanvasSouthReady = String(bridge.canvasSouthReady);
    dataset.hearthSouthCanvasAllChildrenReady = String(bridge.allCanvasChildrenReady);
    dataset.hearthSouthCanvasChildGateMissingText = bridge.canvasChildGateMissingText;

    dataset.hearthSouthCanvasBootBlockedByChildGate = String(state.canvasBootBlockedByChildGate);
    dataset.hearthSouthCanvasChildGateWaiting = String(state.canvasChildGateWaiting);
    dataset.hearthSouthCanvasChildGateLastMissing = state.canvasChildGateLastMissing;

    dataset.hearthSouthCanvasNewsProtocolSynchronized = String(bridge.canvasNewsProtocolSynchronized);
    dataset.hearthSouthCanvasFibonacciAlignmentSynchronized = String(bridge.canvasFibonacciAlignmentSynchronized);
    dataset.hearthSouthCanvasActiveFibonacciGate = bridge.canvasActiveFibonacciGate;
    dataset.hearthSouthCanvasFutureFibonacciGate = bridge.canvasFutureFibonacciGate;
    dataset.hearthSouthCanvasF21ClaimedByCanvas = String(bridge.canvasF21ClaimedByCanvas);
    dataset.hearthSouthCanvasVisualPassClaimed = String(bridge.canvasVisualPassClaimed);

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.HEARTH.southRouteConductor = api;
    root.HEARTH.southVisibleCompletion = api;
    root.HEARTH.routeConductor = api;
    root.HEARTH.canvasNestedReceiptBridge = api;
    root.HEARTH.canvasActiveExpectationBridgeRenewal = api;
    root.HEARTH.canvasSplitAdapterProofBridge = api;
    root.HEARTH.splitChildLoaderGateReconciliation = api;

    root.HEARTH_SOUTH_VISIBLE_COMPLETION = api;
    root.HEARTH_SOUTH_VISIBLE_COMPLETION_CYCLE_CONSUMER = api;
    root.HEARTH_ROUTE_CONDUCTOR = api;
    root.HearthRouteConductor = api;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR = api;
    root.HEARTH_SOUTH_GEAR_ADMISSION_TRANSLATOR = api;
    root.HEARTH_SOUTH_POSTGAME_DEDUP_INSPECT_GATE = api;
    root.HEARTH_SOUTH_STRICT_PROOF_DEGRADE_RECONCILIATION = api;
    root.HEARTH_SOUTH_CANVAS_NESTED_RECEIPT_BRIDGE = api;
    root.HEARTH_SOUTH_CANVAS_ACTIVE_EXPECTATION_BRIDGE_RENEWAL = api;
    root.HEARTH_SOUTH_CANVAS_SPLIT_ADAPTER_PROOF_BRIDGE = api;
    root.HEARTH_SOUTH_SPLIT_CHILD_LOADER_GATE_RECONCILIATION = api;

    root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT = getReceiptLight();
    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT;
    root.HEARTH_SOUTH_GEAR_ADMISSION_TRANSLATOR_RECEIPT = root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT;
    root.HEARTH_SOUTH_POSTGAME_DEDUP_INSPECT_GATE_RECEIPT = root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT;
    root.HEARTH_SOUTH_STRICT_PROOF_DEGRADE_RECONCILIATION_RECEIPT = root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT;
    root.HEARTH_SOUTH_CANVAS_NESTED_RECEIPT_BRIDGE_RECEIPT = root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT;
    root.HEARTH_SOUTH_CANVAS_ACTIVE_EXPECTATION_BRIDGE_RENEWAL_RECEIPT = root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT;
    root.HEARTH_SOUTH_CANVAS_SPLIT_ADAPTER_PROOF_BRIDGE_RECEIPT = root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT;
    root.HEARTH_SOUTH_SPLIT_CHILD_LOADER_GATE_RECONCILIATION_RECEIPT = root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT;
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "south-route-conductor-split-child-loader-gate-reconciliation",

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,

    admitGearEvent,
    submitGearEvent: admitGearEvent,
    reconcileCanvasReceipt,
    bootCanvasOnce,
    buildChildProof,
    childGateAllowsCanvasBoot,
    classifyVisibleProof,
    hasStrictInspectSignal,
    hasFallbackInspectSignal,
    evaluateNewsGates,
    canLatchF21,
    buildCanvasReceiptBridge,
    getReceipt,
    getReceiptLight,
    getReceiptText,
    copyDiagnostic,
    setInspectMode,

    CHECKPOINTS,
    checkpointFrom,

    supportsGearAdmissionTranslation: true,
    supportsLegacyFibonacciEventTranslation: true,
    supportsOneActiveGearAtATime: true,
    supportsLocalGearProgress: true,
    supportsQueuedFutureF13Evidence: true,
    supportsSingleCanvasBoot: true,
    supportsDiagnosticCopy: true,
    supportsReceiptToggle: true,
    supportsInspectReservation: true,
    supportsPostgameDeduplication: true,
    supportsReceiptCompaction: true,
    supportsInspectGateTruth: true,
    supportsProgressOnlyCountTelemetry: true,
    supportsCanvasApiRetry: true,
    supportsStrictProofDegradeReconciliation: true,
    supportsStrictVisibleProofWithoutFalseDegrade: true,
    supportsStrictInspectModeWithoutFallbackDegrade: true,
    supportsFullF21WhenStrictNewsPasses: true,
    supportsCanvasNestedReceiptBridge: true,
    supportsCanvasContractProofExport: true,
    supportsCanvasNewsFibonacciSyncExport: true,
    supportsActiveCanvasExpectationBridgeRenewal: true,
    supportsStaleCanvasExpectationRenewal: true,
    supportsCanvasSplitAdapterProofBridge: true,
    supportsCardinalCanvasChildProof: true,
    supportsSplitChildLoaderGate: true,
    supportsDirectChildApiProof: true,
    supportsTransistorGateRead: true,
    supportsCanvasBootPromiseClearAfterChildFailure: true,

    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
    expectedCanvasReceipt: EXPECTED_CANVAS_RECEIPT,
    expectedCanvasSplitContract: EXPECTED_CANVAS_SPLIT_CONTRACT,
    expectedCanvasSplitReceipt: EXPECTED_CANVAS_SPLIT_RECEIPT,
    acceptedPreviousSplitContract: ACCEPTED_PREVIOUS_SPLIT_CONTRACT,
    acceptedPreviousSplitReceipt: ACCEPTED_PREVIOUS_SPLIT_RECEIPT,
    acceptedPreviousCanvasContract: ACCEPTED_PREVIOUS_CANVAS_CONTRACT,
    acceptedPreviousCanvasReceipt: ACCEPTED_PREVIOUS_CANVAS_RECEIPT,
    legacyTransitionalCanvasContract: LEGACY_TRANSITIONAL_CANVAS_CONTRACT,
    legacyTransitionalCanvasReceipt: LEGACY_TRANSITIONAL_CANVAS_RECEIPT,

    ownsSouthRouteConductor: true,
    ownsVisibleCompletionCoordination: true,
    ownsCanvasReceiptBridge: true,
    ownsCanvasActiveExpectationBridgeRenewal: true,
    ownsCanvasSplitAdapterProofBridge: true,
    ownsSplitChildLoaderGate: true,
    ownsNorthCheckpointTruth: false,
    ownsEastFirstPaint: false,
    ownsWestGapTaxonomy: false,
    ownsCanvasDrawing: false,
    ownsCanvasChildren: false,
    ownsTerrainTruth: false,
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
  publishDataset();

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

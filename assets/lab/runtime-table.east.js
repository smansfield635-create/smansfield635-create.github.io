// /assets/lab/runtime-table.east.js
// LAB_RUNTIME_TABLE_CARDINAL_EAST_NORTH_DIALECT_FIBONACCI_MAGNIFIER_TNT_v1
// Full-file replacement.
// Cardinal East authority only.
// Purpose:
// - Keep North Runtime Table / NEWS / Fibonacci language visible and governing.
// - Preserve useful under-the-hood timing / sequence / cycle structure without publicly reframing this file as a transmission map.
// - Make East a North-permitted Fibonacci micro-stage magnifier.
// - Classify event motion, aliases, false completion, future-stage pressure, duplicate-stage pressure, and progress-only telemetry.
// - Return North-compatible, West-compatible, and South-compatible packets.
// - Preserve legacy exports as non-governing compatibility wrappers.
// Does not own:
// - North public Runtime Table authority
// - active gate cursor
// - visible loader percentage
// - checkpoint closure
// - F21 latch
// - ready text
// - South visible proof
// - West admissibility judgment
// - canvas drawing
// - canvas child truth
// - route conductor runtime
// - planet truth
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_EAST_NORTH_DIALECT_FIBONACCI_MAGNIFIER_TNT_v1";
  const RECEIPT = "LAB_RUNTIME_TABLE_CARDINAL_EAST_NORTH_DIALECT_FIBONACCI_MAGNIFIER_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_EAST_TRANSMISSION_MOTION_TNT_v1";
  const BASELINE_CONTRACT = "RUNTIME_TABLE_NEWS_CARDINAL_FOUR_FILE_SPLIT_FINAL_DRAFT_PREWRITE_v1";
  const VERSION = "2026-05-31.lab-runtime-table-cardinal-east-north-dialect-fibonacci-magnifier-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const FILE = "/assets/lab/runtime-table.east.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const WEST_FILE = "/assets/lab/runtime-table.west.js";
  const SOUTH_FILE = "/assets/lab/runtime-table.south.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";

  const ACTIONS = Object.freeze({
    ADMIT_FOR_NORTH_REVIEW: "ADMIT_FOR_NORTH_REVIEW",
    HELD_FOR_NORTH_CONTEXT: "HELD_FOR_NORTH_CONTEXT",
    HELD_FOR_SOUTH_CONDUCTOR_BODY: "HELD_FOR_SOUTH_CONDUCTOR_BODY",
    QUEUE_FOR_ACTIVE_GATE: "QUEUE_FOR_ACTIVE_GATE",
    ARCHIVE_DUPLICATE_OR_PRIOR: "ARCHIVE_DUPLICATE_OR_PRIOR",
    ARCHIVE_PROGRESS_ONLY: "ARCHIVE_PROGRESS_ONLY",
    UNKNOWN_EVENT_ARCHIVE: "UNKNOWN_EVENT_ARCHIVE",
    BLOCK_FALSE_COMPLETION: "BLOCK_FALSE_COMPLETION",
    F21_PROPOSED_FOR_NORTH_REVIEW: "F21_PROPOSED_FOR_NORTH_REVIEW"
  });

  const LEGACY_ACTIONS = Object.freeze({
    ADMIT: "ADMIT",
    QUEUE: "QUEUE",
    ARCHIVE: "ARCHIVE",
    BLOCK: "BLOCK",
    HELD: "HELD",
    DEGRADED_FORWARD: "DEGRADED_FORWARD"
  });

  const GAP_CLASS = Object.freeze({
    NONE: "NONE",
    NORTH_CONTEXT_REQUIRED: "NORTH_CONTEXT_REQUIRED",
    SOUTH_CONDUCTOR_BODY_REQUIRED: "SOUTH_CONDUCTOR_BODY_REQUIRED",
    FUTURE_STAGE: "FUTURE_STAGE",
    DUPLICATE_OR_PRIOR_STAGE: "DUPLICATE_OR_PRIOR_STAGE",
    PROGRESS_ONLY: "PROGRESS_ONLY",
    UNKNOWN_NEUTRAL: "UNKNOWN_NEUTRAL",
    FALSE_COMPLETION_BLOCK: "FALSE_COMPLETION_BLOCK",
    F21_NORTH_REVIEW_REQUIRED: "F21_NORTH_REVIEW_REQUIRED"
  });

  const NEWS_GATES = Object.freeze({
    NORTH: "NORTH",
    EAST: "EAST",
    WEST: "WEST",
    SOUTH: "SOUTH",
    F21: "F21"
  });

  const MACRO_RANK = Object.freeze({
    F1: 1,
    F2: 2,
    F3: 3,
    F5: 5,
    F8: 8,
    F13: 13,
    F21: 21
  });

  const PROGRESS_ONLY_EVENTS = Object.freeze([
    "ATLAS_BUILD_PROGRESS",
    "TEXTURE_COMPOSE_PROGRESS",
    "WIDE_PROBE_PROGRESS",
    "RECONCILE_PROGRESS",
    "CANVAS_PROGRESS",
    "LOADING_PROGRESS",
    "GEAR_PROGRESS_TICK",
    "RENDER_PROGRESS",
    "SPHERE_RENDER_PROGRESS"
  ]);

  const FALSE_COMPLETION_TOKENS = Object.freeze([
    '"visualPassClaimed":true',
    "visualPassClaimed=true",
    '"readyTextAllowed":true',
    "readyTextAllowed=true",
    '"mainDisplayProgress":100',
    "mainDisplayProgress=100",
    '"visibleProgress":100',
    "visibleProgress=100",
    '"progress":100',
    "progress=100",
    "READY_PLANET_VISIBLE",
    "READY_DEGRADED_PLANET_VISIBLE",
    "COMPLETION_LATCHED",
    "F21_DEGRADED_COMPLETION_LATCHED"
  ]);

  const MICRO_STAGES = Object.freeze([
    stage("F1_EAST_ROUTE_SHELL", "F1", 1, "EAST", "Route shell", [
      "HTML_SHELL_RENDERED",
      "EAST_HTML_SHELL_RENDERED",
      "SHELL_READY",
      "HTML_READY"
    ]),

    stage("F2_EAST_FIRST_PAINT", "F2", 2, "EAST", "First paint", [
      "FIRST_PAINT_COCKPIT_VISIBLE",
      "EAST_FIRST_PAINT_COCKPIT_VISIBLE",
      "COCKPIT_VISIBLE",
      "FIRST_PAINT_READY"
    ]),

    stage("F3_EAST_SCRIPT_ORDER", "F3", 3, "EAST", "Script order", [
      "SCRIPT_ORDER_COMPLETE",
      "SCRIPT_LOADED",
      "SCRIPT_ORDER_VISIBLE",
      "EAST_SCRIPT_ORDER_VISIBILITY_ACTIVE"
    ]),

    stage("F5_NORTH_AUTHORITY", "F5", 5, "NORTH", "Authority availability", [
      "AUTHORITY_AVAILABILITY_READY",
      "RUNTIME_TABLE_AVAILABLE",
      "AUTHORITY_AVAILABLE",
      "NORTH_RUNTIME_TABLE_PRESENT",
      "WEST_HANDOFF_TABLE_PRESENT"
    ]),

    stage("F8_ROUTE_CONDUCTOR_HYDRATION", "F8", 8, "SOUTH", "Route conductor hydration", [
      "CONDUCTOR_HYDRATED",
      "SOUTH_ROUTE_CONDUCTOR_BOOTED",
      "COHERENCE_SEMICONDUCTOR_BOOTED",
      "ROUTE_CONDUCTOR_PRESENT",
      "CONDUCTOR_MARKER_PRESENT"
    ]),

    stage("F13A_CANVAS_PARENT_BOOT_REQUESTED", "F13", 13.01, "NORTH", "Canvas parent boot requested", [
      "CANVAS_COOPERATIVE_BOOT_STARTED",
      "CANVAS_BOOT_STARTED",
      "CANVAS_CARRIER_REQUESTED"
    ]),

    stage("F13B_CANVAS_CHILDREN_OBSERVED", "F13", 13.02, "EAST", "Canvas children observed", [
      "CANVAS_CHILDREN_READY",
      "ALL_CANVAS_CHILDREN_READY",
      "CANVAS_EAST_READY",
      "CANVAS_WEST_READY",
      "CANVAS_SOUTH_READY"
    ]),

    stage("F13C_CANVAS_CONTEXT_READY", "F13", 13.03, "SOUTH", "Canvas context ready", [
      "CANVAS_CONTEXT_READY",
      "CANVAS_2D_CONTEXT_READY",
      "CONTEXT_READY"
    ]),

    stage("F13D_INSPECTION_BOUND", "F13", 13.04, "WEST", "Inspection bound", [
      "DRAG_INSPECTION_BOUND",
      "INSPECT_DRAG_BOUND",
      "POINTER_INSPECTION_BOUND",
      "ZOOM_INSPECTION_BOUND"
    ]),

    stage("F13E_ATLAS_BUILD_STARTED", "F13", 13.05, "EAST", "Atlas build started", [
      "ATLAS_BUILD_STARTED",
      "ATLAS_STARTED"
    ]),

    stage("F13F_ATLAS_BUILD_COMPLETE", "F13", 13.06, "EAST", "Atlas build complete", [
      "ATLAS_BUILD_COMPLETE",
      "ATLAS_COMPLETE"
    ]),

    stage("F13G_TEXTURE_COMPOSE_STARTED", "F13", 13.07, "SOUTH", "Texture compose started", [
      "TEXTURE_COMPOSE_STARTED",
      "TEXTURE_STARTED"
    ]),

    stage("F13H_TEXTURE_COMPOSE_COMPLETE", "F13", 13.08, "SOUTH", "Texture compose complete", [
      "TEXTURE_COMPOSE_COMPLETE",
      "TEXTURE_COMPLETE"
    ]),

    stage("F13I_FIRST_FRAME_REQUESTED", "F13", 13.09, "SOUTH", "First frame requested", [
      "FIRST_FRAME_REQUESTED",
      "FRAME_REQUESTED"
    ]),

    stage("F13J_FIRST_FRAME_DETECTED", "F13", 13.10, "SOUTH", "First frame detected", [
      "FIRST_FRAME_DETECTED",
      "FRAME_DETECTED",
      "IMAGE_RENDERED"
    ]),

    stage("F13K_CANVAS_READY", "F13", 13.11, "SOUTH", "Canvas ready", [
      "CANVAS_READY",
      "CANVAS_COMPLETE"
    ]),

    stage("F13L_VISIBLE_PROOF_STARTED", "F13", 13.12, "SOUTH", "Visible proof started", [
      "VISIBLE_CONTENT_PROOF_STARTED",
      "VISIBLE_PROOF_STARTED"
    ]),

    stage("F13M_VISIBLE_PROOF_PASSED", "F13", 13.13, "SOUTH", "Visible proof passed", [
      "VISIBLE_CONTENT_PROOF_PASSED",
      "DEGRADED_VISIBLE_CONTENT_ACCEPTED",
      "VISIBLE_CONTENT_SOFT_GAP",
      "VISIBLE_CONTENT_ADMISSIBLE",
      "VISIBLE_FORWARD_PROGRESS",
      "SOUTH_VISIBLE_COMPLETION_READY"
    ]),

    stage("F13N_INSPECT_GATE_READY", "F13", 13.14, "WEST", "Inspect gate ready", [
      "INSPECT_MODE_READY",
      "DEGRADED_INSPECT_MODE_ACCEPTED",
      "INSPECT_FALLBACK_READY",
      "RECEIPT_FALLBACK_READY"
    ]),

    stage("F21_COMPLETION_LATCH_REQUESTED", "F21", 21, "NORTH", "Completion latch requested", [
      "COMPLETION_LATCHED",
      "COMPLETION_LATCHED_AFTER_VISIBLE_CONTENT_PROOF",
      "COMPLETION_LATCHED_AFTER_CANVAS_READY",
      "F21_DEGRADED_COMPLETION_LATCHED"
    ])
  ]);

  const STAGE_BY_EVENT = new Map();
  const STAGE_BY_ID = new Map();

  MICRO_STAGES.forEach((item) => {
    STAGE_BY_ID.set(item.id, item);
    STAGE_BY_EVENT.set(item.id, item);
    item.events.forEach((eventName) => STAGE_BY_EVENT.set(eventName, item));
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    role: "east-cardinal-fibonacci-magnifier-under-north-runtime-table",

    eastAuthority: true,
    eastUsesNorthDialect: true,
    eastFibonacciMagnifier: true,
    eastMicroStageClassifier: true,
    eastPublicTransmissionMapLanguage: false,
    northPermissionRequired: true,
    macroRuntimeTableOwnedByNorth: true,

    lastNorthContext: null,
    lastClassification: null,
    lastWestPacket: null,
    lastSouthPacket: null,
    lastNorthPacket: null,

    classifyCount: 0,
    progressOnlyCount: 0,
    falseCompletionBlockCount: 0,
    markerOnlyHoldCount: 0,
    unknownArchiveCount: 0,

    localEvents: [],
    errors: [],

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,
    startedAt: nowIso(),
    updatedAt: nowIso()
  };

  function stage(id, macroGate, rank, owner, label, events) {
    return {
      id,
      microStageId: id,
      macroGate,
      macroRank: MACRO_RANK[macroGate] || 0,
      rank,
      owner,
      label,
      events: events.slice(),
      requiresNorthMacroPermission: true,
      maySuggestCompletion: true,
      mayCloseGate: false,
      maySetVisibleProgress: false,
      maySetReadyText: false,
      mayClaimFinalVisualPass: false
    };
  }

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

  function asArray(value) {
    if (Array.isArray(value)) return value.slice();
    if (value === undefined || value === null) return [];
    return [value];
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === "true" || value === "1" || value === 1) return true;
    if (value === "false" || value === "0" || value === 0) return false;
    return fallback;
  }

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function trim(array, max = 120) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trim(state.localEvents);
    state.updatedAt = item.at;
    publishDataset();

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
    trim(state.errors);
    state.updatedAt = item.at;
    publishDataset();

    return item;
  }

  function readPath(path) {
    const parts = safeString(path).split(".");
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
      } catch (error) {
        recordError("READ_RECEIPT_FAILED", error);
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

  function normalizeEvent(event = {}) {
    const source = isObject(event) ? event : { event };
    const detail = isObject(source.detail) ? source.detail : {};
    const snapshot = isObject(source.snapshot) ? source.snapshot : {};

    const candidates = [
      source.microStageId,
      source.checkpointId,
      source.phase,
      source.id,
      source.event,
      source.checkpointEvent,
      source.checkpointCandidate,
      detail.microStageId,
      detail.checkpointId,
      detail.phase,
      detail.id,
      detail.event,
      detail.checkpointEvent,
      detail.checkpointCandidate,
      snapshot.microStageId,
      snapshot.checkpointId,
      snapshot.phase,
      snapshot.id,
      snapshot.event
    ].filter((item) => item !== undefined && item !== null && item !== "");

    const name = candidates.length ? safeString(candidates[0]) : "";

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      name,
      event: safeString(source.event || detail.event || source.id || detail.id || name),
      id: safeString(source.id || detail.id || source.checkpointId || detail.checkpointId || name),
      phase: safeString(source.phase || detail.phase || name),
      checkpointId: safeString(source.checkpointId || detail.checkpointId || name),
      candidates: candidates.map(String),
      detail: clonePlain(detail),
      snapshot: clonePlain(snapshot),
      raw: clonePlain(source),
      normalizedAt: nowIso()
    };
  }

  function mergeEvidence(event = {}, context = {}) {
    const normalized = normalizeEvent(event);
    return {
      ...clonePlain(context || {}),
      ...clonePlain(normalized.snapshot || {}),
      ...clonePlain(normalized.detail || {}),
      ...clonePlain(normalized.raw || {})
    };
  }

  function deriveMacroGate(value = "") {
    const text = safeString(value).toUpperCase();

    if (text.includes("F21") || text.includes("COMPLETION") || text.includes("LATCH")) return "F21";
    if (text.includes("F13") || text.includes("CANVAS") || text.includes("VISIBLE") || text.includes("ATLAS") || text.includes("TEXTURE") || text.includes("FRAME") || text.includes("INSPECT")) return "F13";
    if (text.includes("F8") || text.includes("CONDUCTOR") || text.includes("HYDRAT")) return "F8";
    if (text.includes("F5") || text.includes("AUTHORITY") || text.includes("RUNTIME_TABLE")) return "F5";
    if (text.includes("F3") || text.includes("SCRIPT")) return "F3";
    if (text.includes("F2") || text.includes("FIRST_PAINT") || text.includes("COCKPIT")) return "F2";
    if (text.includes("F1") || text.includes("SHELL") || text.includes("LEDGER")) return "F1";

    if (text.includes("SOUTH_OUTPUT") || text.includes("OUTPUT")) return "F13";
    if (text.includes("NORTH_RETURN") || text.includes("COMPLETE")) return "F21";
    if (text.includes("NORTH_ADMISSION") || text.includes("WEST_SYNCHRONIZER")) return "F8";
    if (text.includes("EAST_IGNITION")) return "F1";

    return "";
  }

  function readNorthContext(context = {}) {
    const supplied = isObject(context) ? context : {};

    const northApi = firstGlobal([
      "LAB_RUNTIME_TABLE",
      "LAB_RUNTIME_TABLE_NORTH",
      "LAB_UNIVERSAL_PLANET_RUNTIME_TABLE",
      "RUNTIME_TABLE",
      "DexterRuntimeTable",
      "HEARTH_NORTH_COMMAND_RUNTIME_TABLE",
      "HEARTH_NORTH_COMMAND_TABLE",
      "HEARTH_NORTH_TRANSMISSION_GOVERNOR",
      "DEXTER_LAB.runtimeTable",
      "DEXTER_LAB.cardinalRuntimeTableNorth",
      "DEXTER_LAB.northTransmissionGovernor"
    ]);

    const northReceipt =
      readReceipt(northApi) ||
      firstGlobal([
        "HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT",
        "HEARTH_NORTH_CYCLICAL_CHECKPOINT_RECEIPT",
        "LAB_RUNTIME_TABLE_NORTH_TRANSMISSION_RECEIPT"
      ]) ||
      {};

    const activeSource =
      supplied.northActiveGateId ||
      supplied.activeGateId ||
      supplied.activeCheckpointId ||
      supplied.activeFibonacci ||
      supplied.activeGear ||
      northReceipt.activeGateId ||
      northReceipt.activeCheckpointId ||
      northReceipt.activeFibonacci ||
      northReceipt.activeGear ||
      datasetValue("hearthSouthActiveFibonacci", "") ||
      datasetValue("activeGear", "");

    const activeMacroGate =
      supplied.northActiveMacroGate ||
      supplied.activeMacroGate ||
      deriveMacroGate(activeSource) ||
      deriveMacroGate(supplied.activeGateId) ||
      deriveMacroGate(supplied.activeCheckpointId) ||
      deriveMacroGate(northReceipt.activeGateId) ||
      "";

    const contextPresent = Boolean(
      supplied.northContextPresent === true ||
      supplied.northRuntimeTableObserved === true ||
      northApi ||
      northReceipt.contract ||
      activeMacroGate ||
      activeSource
    );

    const f21Allowed = Boolean(
      safeBool(supplied.f21Allowed, false) ||
      safeBool(supplied.f21AllowedByNorth, false) ||
      safeBool(supplied.newsGatePassedBeforeF21, false) ||
      safeBool(supplied.newsGateDegradedBeforeF21, false) ||
      safeBool(northReceipt.f21Allowed, false) ||
      safeBool(northReceipt.newsGatePassedBeforeF21, false) ||
      safeBool(northReceipt.newsGateDegradedBeforeF21, false)
    );

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      northRuntimeTableObserved: Boolean(northApi || northReceipt.contract),
      northContextPresent: contextPresent,
      northContract: safeString(northReceipt.contract || northApi && northApi.contract || ""),
      northReceipt: safeString(northReceipt.receipt || northApi && northApi.receipt || ""),
      northActiveGateId: safeString(northReceipt.activeGateId || supplied.activeGateId || supplied.northActiveGateId || ""),
      northActiveCheckpointId: safeString(northReceipt.activeCheckpointId || supplied.activeCheckpointId || ""),
      northActiveFibonacci: safeString(northReceipt.activeFibonacci || supplied.activeFibonacci || supplied.northActiveFibonacci || activeMacroGate),
      northActiveMacroGate: activeMacroGate,
      northActiveSource: safeString(activeSource),
      northPermissionConfirmed: Boolean(contextPresent && activeMacroGate),
      northOwnsRuntimeTable: true,
      northOwnsActiveGate: true,
      northOwnsVisibleProgress: true,
      northOwnsCheckpointAdmission: true,
      northOwnsF21Latch: true,
      northMustAdmit: true,
      completionLatched: Boolean(safeBool(supplied.completionLatched, false) || safeBool(northReceipt.finalCompletionLatched, false)),
      f21AllowedByNorth: f21Allowed,
      newsGatePassedBeforeF21: Boolean(safeBool(supplied.newsGatePassedBeforeF21, false) || safeBool(northReceipt.newsGatePassedBeforeF21, false)),
      newsGateDegradedBeforeF21: Boolean(safeBool(supplied.newsGateDegradedBeforeF21, false) || safeBool(northReceipt.newsGateDegradedBeforeF21, false)),
      readAt: nowIso()
    };

    state.lastNorthContext = clonePlain(packet);
    return packet;
  }

  function mapEventToStage(event = {}) {
    const normalized = typeof event === "string" ? normalizeEvent({ event }) : normalizeEvent(event);
    const candidates = normalized.candidates.length ? normalized.candidates : [normalized.name];

    for (const candidate of candidates) {
      const key = safeString(candidate);
      if (STAGE_BY_ID.has(key)) return STAGE_BY_ID.get(key);
      if (STAGE_BY_EVENT.has(key)) return STAGE_BY_EVENT.get(key);
    }

    return null;
  }

  function isProgressOnlyEvent(event = {}) {
    const normalized = typeof event === "string" ? normalizeEvent({ event }) : normalizeEvent(event);
    return normalized.candidates.some((candidate) => PROGRESS_ONLY_EVENTS.includes(candidate));
  }

  function stringifyForSafety(value) {
    try {
      return JSON.stringify(value || {});
    } catch (_error) {
      return String(value || "");
    }
  }

  function isFalseCompletionMutation(event = {}, context = {}) {
    const text = `${stringifyForSafety(event)} ${stringifyForSafety(context)}`;
    return FALSE_COMPLETION_TOKENS.some((token) => text.includes(token));
  }

  function classifyRouteConductorEvidence(evidence = {}) {
    const markerPresent = Boolean(
      safeBool(evidence.routeConductorMarkerPresent, false) ||
      safeBool(evidence.conductorMarkerPresent, false) ||
      safeBool(evidence.hearthRouteConductorMarkerPresent, false) ||
      root.__HEARTH_ROUTE_CONDUCTOR_MARKER__ === true ||
      datasetValue("hearthRouteConductorMarkerPresent", "") === "true"
    );

    const apiPresent = Boolean(
      safeBool(evidence.routeConductorApiPresent, false) ||
      safeBool(evidence.routeConductorGlobalPresent, false) ||
      firstGlobal([
        "HEARTH_ROUTE_CONDUCTOR",
        "HearthRouteConductor",
        "HEARTH_SOUTH_ROUTE_CONDUCTOR",
        "HEARTH.southRouteConductor",
        "DEXTER_LAB.hearthSouthRouteConductor"
      ])
    );

    const receiptPresent = Boolean(
      safeBool(evidence.routeConductorReceiptPresent, false) ||
      firstGlobal([
        "HEARTH_ROUTE_CONDUCTOR_RECEIPT",
        "HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT",
        "HEARTH.southRouteConductorReceipt",
        "DEXTER_LAB.hearthSouthRouteConductorReceipt"
      ])
    );

    const runtimeActive = Boolean(
      safeBool(evidence.routeConductorRuntimeActive, false) ||
      safeBool(evidence.southRuntimeActive, false) ||
      apiPresent
    );

    const hydrated = Boolean(markerPresent && apiPresent && receiptPresent && runtimeActive);

    return {
      routeConductorMarkerPresent: markerPresent,
      routeConductorApiPresent: apiPresent,
      routeConductorReceiptPresent: receiptPresent,
      routeConductorRuntimeActive: runtimeActive,
      routeConductorHydrated: hydrated,
      routeConductorMarkerOnly: markerPresent && !hydrated,
      classification: hydrated ? "F8_ROUTE_CONDUCTOR_HYDRATED" : markerPresent ? "F8_MARKER_ONLY_HELD" : "F8_CONDUCTOR_PENDING",
      firstFailedCoordinate: hydrated ? "NONE_F8_ROUTE_CONDUCTOR_HYDRATED" : markerPresent ? "WAITING_ROUTE_CONDUCTOR_API_RECEIPT_RUNTIME" : "WAITING_ROUTE_CONDUCTOR_MARKER_API_RECEIPT_RUNTIME",
      recommendedNextRenewalTarget: hydrated ? NORTH_FILE : ROUTE_CONDUCTOR_FILE
    };
  }

  function classifyVisibleProofEvidence(evidence = {}) {
    const canvasPresent = Boolean(
      safeBool(evidence.planetCanvasPresent, false) ||
      safeBool(evidence.canvasPresent, false) ||
      datasetValue("hearthSouthPlanetCanvasPresent", "") === "true"
    );

    const canvasNonZeroSize = Boolean(
      safeBool(evidence.planetCanvasNonZeroSize, false) ||
      safeBool(evidence.canvasNonZeroSize, false) ||
      datasetValue("hearthSouthPlanetCanvasNonZeroSize", "") === "true"
    );

    const visibleHint = Boolean(
      safeBool(evidence.visiblePlanetHintPresent, false) ||
      datasetValue("hearthSouthVisiblePlanetHintPresent", "") === "true"
    );

    const contentProof = Boolean(
      safeBool(evidence.visibleContentProof, false) ||
      safeBool(evidence.canvasVisibleContentProof, false) ||
      datasetValue("hearthSouthVisibleContentProof", "") === "true"
    );

    const strictProof = Boolean(
      safeBool(evidence.visibleContentStrictProof, false) ||
      safeBool(evidence.canvasVisibleContentStrictProof, false)
    );

    const softProof = Boolean(
      safeBool(evidence.visibleContentSoftGap, false) ||
      safeBool(evidence.visibleForwardProgress, false) ||
      safeBool(evidence.visibleContentAdmissible, false) ||
      datasetValue("hearthSouthVisibleContentSoftGap", "") === "true"
    );

    const hardFail = Boolean(
      safeBool(evidence.visibleContentHardFail, false) ||
      datasetValue("hearthSouthVisibleContentHardFail", "") === "true"
    );

    const firstFrameDetected = Boolean(
      safeBool(evidence.firstFrameDetected, false) ||
      datasetValue("hearthCanvasFirstFrameDetected", "") === "true"
    );

    const imageRendered = Boolean(
      safeBool(evidence.imageRendered, false) ||
      safeBool(evidence.canvasImageRendered, false) ||
      datasetValue("hearthCanvasImageRendered", "") === "true"
    );

    const visiblePlanetProofValid = Boolean(
      canvasPresent &&
      canvasNonZeroSize &&
      !hardFail &&
      (
        contentProof ||
        strictProof ||
        softProof ||
        (firstFrameDetected && imageRendered)
      )
    );

    return {
      planetCanvasPresent: canvasPresent,
      planetCanvasNonZeroSize: canvasNonZeroSize,
      visiblePlanetHintPresent: visibleHint,
      firstFrameDetected,
      imageRendered,
      visibleContentProof: contentProof,
      visibleContentStrictProof: strictProof,
      visibleContentSoftGap: softProof,
      visibleContentHardFail: hardFail,
      visiblePlanetProofValid,
      visibleHintIsProof: false,
      canvasPresenceIsProof: false,
      classification: visiblePlanetProofValid ? "F13_VISIBLE_PLANET_PROOF_VALID" : hardFail ? "F13_VISIBLE_PROOF_HARD_FAIL" : "F13_VISIBLE_PROOF_PENDING",
      firstFailedCoordinate: visiblePlanetProofValid ? "NONE_F13_VISIBLE_PLANET_PROOF_VALID" : hardFail ? "F13_VISIBLE_PROOF_HARD_FAIL" : "WAITING_F13_VISIBLE_PLANET_PROOF",
      recommendedNextRenewalTarget: visiblePlanetProofValid ? NORTH_FILE : CANVAS_FILE
    };
  }

  function macroCompare(targetMacro, activeMacro) {
    const target = MACRO_RANK[targetMacro] || 0;
    const active = MACRO_RANK[activeMacro] || 0;

    if (!target || !active) return 0;
    if (target === active) return 0;
    return target > active ? 1 : -1;
  }

  function f21Allowed(context) {
    return Boolean(
      context &&
      (
        context.f21AllowedByNorth ||
        context.f21Allowed ||
        context.newsGatePassedBeforeF21 ||
        context.newsGateDegradedBeforeF21
      )
    );
  }

  function basePacket(normalized, stageItem, northContext, evidence) {
    const route = classifyRouteConductorEvidence(evidence);
    const visible = classifyVisibleProofEvidence(evidence);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      role: state.role,

      eastAuthority: true,
      eastUsesNorthDialect: true,
      eastFibonacciMagnifier: true,
      eastMicroStageClassifier: true,
      eastPublicTransmissionMapLanguage: false,
      northPermissionRequired: true,
      macroRuntimeTableOwnedByNorth: true,

      normalizedEvent: clonePlain(normalized),
      targetStage: clonePlain(stageItem),
      targetMicroStageId: stageItem ? stageItem.id : "",
      targetMacroGate: stageItem ? stageItem.macroGate : "",
      targetOwner: stageItem ? stageItem.owner : "",
      northContext: clonePlain(northContext),

      routeConductor: route,
      visibleProof: visible,

      northMustAdmit: true,
      eastOwnsActiveGate: false,
      eastOwnsVisibleProgress: false,
      eastOwnsCheckpointClosure: false,
      eastOwnsF21Latch: false,
      eastOwnsFinalVisualPassClaim: false,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      classifiedAt: nowIso()
    };
  }

  function finalizeClassification(packet) {
    state.classifyCount += 1;
    state.lastClassification = clonePlain(packet);
    state.updatedAt = nowIso();

    if (packet.action === ACTIONS.ARCHIVE_PROGRESS_ONLY) state.progressOnlyCount += 1;
    if (packet.action === ACTIONS.BLOCK_FALSE_COMPLETION) state.falseCompletionBlockCount += 1;
    if (packet.action === ACTIONS.HELD_FOR_SOUTH_CONDUCTOR_BODY) state.markerOnlyHoldCount += 1;
    if (packet.action === ACTIONS.UNKNOWN_EVENT_ARCHIVE) state.unknownArchiveCount += 1;

    state.lastWestPacket = classifyForWest(packet);
    state.lastSouthPacket = classifyForSouth(packet);
    state.lastNorthPacket = classifyForNorth(packet);

    record("EAST_FIBONACCI_CLASSIFICATION", {
      action: packet.action,
      microStage: packet.targetMicroStageId,
      macroGate: packet.targetMacroGate,
      reason: packet.reason
    });

    publishDataset();
    return packet;
  }

  function createNewsFibonacciClassification(event = {}, context = {}) {
    const normalized = normalizeEvent(event);
    const evidence = mergeEvidence(event, context);
    const northContext = readNorthContext(evidence);
    const stageItem = mapEventToStage(normalized);
    const packet = basePacket(normalized, stageItem, northContext, evidence);

    if (isProgressOnlyEvent(normalized)) {
      return finalizeClassification({
        ...packet,
        action: ACTIONS.ARCHIVE_PROGRESS_ONLY,
        legacyAction: LEGACY_ACTIONS.ARCHIVE,
        gapClass: GAP_CLASS.PROGRESS_ONLY,
        reason: "progress-only-telemetry-archived-without-mutating-north-state",
        visibleUpdateAllowed: false,
        westReviewRecommended: false,
        southProofRequired: false,
        firstFailedCoordinate: "NONE_PROGRESS_ONLY_ARCHIVED",
        recommendedNextRenewalTarget: NORTH_FILE
      });
    }

    if (!stageItem) {
      const falseCompletion = isFalseCompletionMutation(event, context);

      return finalizeClassification({
        ...packet,
        action: falseCompletion ? ACTIONS.BLOCK_FALSE_COMPLETION : ACTIONS.UNKNOWN_EVENT_ARCHIVE,
        legacyAction: falseCompletion ? LEGACY_ACTIONS.BLOCK : LEGACY_ACTIONS.ARCHIVE,
        gapClass: falseCompletion ? GAP_CLASS.FALSE_COMPLETION_BLOCK : GAP_CLASS.UNKNOWN_NEUTRAL,
        reason: falseCompletion ? "unknown-event-contained-false-completion-language" : "unknown-event-archived-neutral",
        falseCompletionDetected: falseCompletion,
        visibleUpdateAllowed: false,
        westReviewRecommended: falseCompletion,
        southProofRequired: false,
        firstFailedCoordinate: falseCompletion ? "FALSE_COMPLETION_LANGUAGE_BLOCKED" : "NONE_UNKNOWN_EVENT_ARCHIVED",
        recommendedNextRenewalTarget: falseCompletion ? NORTH_FILE : FILE
      });
    }

    if (stageItem.macroGate === "F21") {
      if (!f21Allowed(northContext)) {
        return finalizeClassification({
          ...packet,
          action: ACTIONS.BLOCK_FALSE_COMPLETION,
          legacyAction: LEGACY_ACTIONS.BLOCK,
          gapClass: GAP_CLASS.FALSE_COMPLETION_BLOCK,
          reason: "f21-requires-north-news-latch-permission",
          f21Proposed: true,
          f21AllowedByNorth: false,
          f21BlockedByEastSafety: true,
          f21RequiresNorthNewsLatch: true,
          completionLatchedByEast: false,
          visibleUpdateAllowed: false,
          westReviewRecommended: true,
          southProofRequired: true,
          firstFailedCoordinate: "F21_BLOCKED_NORTH_PERMISSION_MISSING",
          recommendedNextRenewalTarget: NORTH_FILE
        });
      }

      return finalizeClassification({
        ...packet,
        action: ACTIONS.F21_PROPOSED_FOR_NORTH_REVIEW,
        legacyAction: LEGACY_ACTIONS.HELD,
        gapClass: GAP_CLASS.F21_NORTH_REVIEW_REQUIRED,
        reason: "f21-proposed-for-north-review-east-does-not-latch",
        f21Proposed: true,
        f21AllowedByNorth: true,
        f21BlockedByEastSafety: false,
        f21RequiresNorthNewsLatch: true,
        completionLatchedByEast: false,
        visibleUpdateAllowed: false,
        westReviewRecommended: true,
        southProofRequired: false,
        firstFailedCoordinate: "F21_READY_FOR_NORTH_NEWS_REVIEW",
        recommendedNextRenewalTarget: NORTH_FILE
      });
    }

    if (isFalseCompletionMutation(event, context)) {
      return finalizeClassification({
        ...packet,
        action: ACTIONS.BLOCK_FALSE_COMPLETION,
        legacyAction: LEGACY_ACTIONS.BLOCK,
        gapClass: GAP_CLASS.FALSE_COMPLETION_BLOCK,
        reason: "false-ready-100-f21-or-visual-pass-language-blocked-before-north-latch",
        falseCompletionDetected: true,
        visibleUpdateAllowed: false,
        westReviewRecommended: true,
        southProofRequired: false,
        firstFailedCoordinate: "FALSE_COMPLETION_LANGUAGE_BLOCKED",
        recommendedNextRenewalTarget: NORTH_FILE
      });
    }

    if (stageItem.macroGate === "F8" && packet.routeConductor.routeConductorMarkerOnly) {
      return finalizeClassification({
        ...packet,
        action: ACTIONS.HELD_FOR_SOUTH_CONDUCTOR_BODY,
        legacyAction: LEGACY_ACTIONS.HELD,
        gapClass: GAP_CLASS.SOUTH_CONDUCTOR_BODY_REQUIRED,
        reason: "route-conductor-marker-observed-but-api-receipt-runtime-body-missing",
        southMarkerObservedOnly: true,
        southRuntimeBodyObserved: false,
        southReceiptObserved: false,
        visibleUpdateAllowed: false,
        westReviewRecommended: true,
        southProofRequired: true,
        firstFailedCoordinate: "WAITING_ROUTE_CONDUCTOR_API_RECEIPT_RUNTIME",
        recommendedNextRenewalTarget: ROUTE_CONDUCTOR_FILE
      });
    }

    if (!northContext.northContextPresent || !northContext.northPermissionConfirmed) {
      return finalizeClassification({
        ...packet,
        action: ACTIONS.HELD_FOR_NORTH_CONTEXT,
        legacyAction: LEGACY_ACTIONS.HELD,
        gapClass: GAP_CLASS.NORTH_CONTEXT_REQUIRED,
        reason: "north-runtime-table-context-required-before-east-magnification-can-admit",
        northContextPresent: false,
        northPermissionConfirmed: false,
        classificationAdvisoryOnly: true,
        visibleUpdateAllowed: false,
        westReviewRecommended: true,
        southProofRequired: stageItem.owner === "SOUTH",
        firstFailedCoordinate: "WAITING_NORTH_RUNTIME_TABLE_ACTIVE_GATE_CONTEXT",
        recommendedNextRenewalTarget: NORTH_FILE
      });
    }

    const compare = macroCompare(stageItem.macroGate, northContext.northActiveMacroGate);

    if (compare > 0) {
      return finalizeClassification({
        ...packet,
        action: ACTIONS.QUEUE_FOR_ACTIVE_GATE,
        legacyAction: LEGACY_ACTIONS.QUEUE,
        gapClass: GAP_CLASS.FUTURE_STAGE,
        reason: "event-belongs-to-future-fibonacci-lane-under-north-runtime-table",
        futureStageDetected: true,
        visibleUpdateAllowed: false,
        westReviewRecommended: true,
        southProofRequired: stageItem.owner === "SOUTH",
        firstFailedCoordinate: `WAITING_NORTH_ACTIVE_GATE_${northContext.northActiveMacroGate || "UNKNOWN"}`,
        recommendedNextRenewalTarget: NORTH_FILE
      });
    }

    if (compare < 0) {
      return finalizeClassification({
        ...packet,
        action: ACTIONS.ARCHIVE_DUPLICATE_OR_PRIOR,
        legacyAction: LEGACY_ACTIONS.ARCHIVE,
        gapClass: GAP_CLASS.DUPLICATE_OR_PRIOR_STAGE,
        reason: "event-belongs-to-prior-fibonacci-lane-and-is-archived-without-mutation",
        duplicateStageDetected: true,
        visibleUpdateAllowed: false,
        westReviewRecommended: false,
        southProofRequired: false,
        firstFailedCoordinate: "NONE_PRIOR_STAGE_ARCHIVED",
        recommendedNextRenewalTarget: NORTH_FILE
      });
    }

    return finalizeClassification({
      ...packet,
      action: ACTIONS.ADMIT_FOR_NORTH_REVIEW,
      legacyAction: LEGACY_ACTIONS.ADMIT,
      gapClass: GAP_CLASS.NONE,
      reason: "event-belongs-inside-north-permitted-fibonacci-lane",
      northPermissionConfirmed: true,
      visibleUpdateAllowed: false,
      westReviewRecommended: true,
      southProofRequired: stageItem.owner === "SOUTH",
      firstFailedCoordinate: "NONE_EAST_CLASSIFICATION_READY_FOR_NORTH_REVIEW",
      recommendedNextRenewalTarget: stageItem.owner === "SOUTH" ? SOUTH_FILE : NORTH_FILE
    });
  }

  function classifyFibonacciStage(event = {}, context = {}) {
    return createNewsFibonacciClassification(event, context);
  }

  function classifyTransmissionEvent(event = {}, context = {}) {
    return createNewsFibonacciClassification(event, context);
  }

  function classifyCheckpointEvent(event = {}, sessionLike = {}) {
    const result = createNewsFibonacciClassification(event, sessionLike);

    return {
      action: result.legacyAction,
      eastAction: result.action,
      gapClass: result.gapClass,
      checkpointId: result.targetMicroStageId,
      checkpointRank: result.targetStage ? result.targetStage.rank : 0,
      activeCheckpointId: result.northContext ? result.northContext.northActiveGateId : "",
      activeFibonacci: result.northContext ? result.northContext.northActiveFibonacci : "",
      reason: result.reason,
      mayAdvance: result.action === ACTIONS.ADMIT_FOR_NORTH_REVIEW,
      maySetProgress: false,
      maySetReadyText: false,
      eastOwnsProgress: false,
      northMustDecide: true,
      visualUpdateAllowed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      rawClassification: result
    };
  }

  function classifyForWest(classificationOrEvent = {}, context = {}) {
    const packet = classificationOrEvent && classificationOrEvent.action
      ? classificationOrEvent
      : createNewsFibonacciClassification(classificationOrEvent, context);

    const westPacket = {
      contract: CONTRACT,
      receipt: RECEIPT,
      targetFile: WEST_FILE,
      sourceFile: FILE,
      westReviewRecommended: packet.westReviewRecommended === true,
      eventClass: packet.action,
      gapClass: packet.gapClass,
      frictionClass:
        packet.action === ACTIONS.BLOCK_FALSE_COMPLETION ? "HIGH_FALSE_COMPLETION_FRICTION" :
        packet.action === ACTIONS.HELD_FOR_SOUTH_CONDUCTOR_BODY ? "MEDIUM_MARKER_ONLY_FRICTION" :
        packet.action === ACTIONS.QUEUE_FOR_ACTIVE_GATE ? "FUTURE_STAGE_FRICTION" :
        packet.action === ACTIONS.ARCHIVE_DUPLICATE_OR_PRIOR ? "LOW_DUPLICATE_FRICTION" :
        "LOW_OR_NONE",
      viscosityClass:
        packet.gapClass === GAP_CLASS.NORTH_CONTEXT_REQUIRED ? "NORTH_CONTEXT_VISCOSITY" :
        packet.gapClass === GAP_CLASS.SOUTH_CONDUCTOR_BODY_REQUIRED ? "SOUTH_BODY_VISCOSITY" :
        packet.gapClass === GAP_CLASS.FALSE_COMPLETION_BLOCK ? "FALSE_COMPLETION_VISCOSITY" :
        "NORMAL_FLOW",
      falseCompletionDetected: packet.falseCompletionDetected === true || packet.f21BlockedByEastSafety === true,
      futureStageDetected: packet.futureStageDetected === true,
      duplicateStageDetected: packet.duplicateStageDetected === true,
      progressOnlyDetected: packet.action === ACTIONS.ARCHIVE_PROGRESS_ONLY,
      northMustDecide: true,
      eastOwnsAdmissibilityJudgment: false,
      westOwnsAdmissibilityJudgment: true,
      visualPassClaimed: false,
      generatedAt: nowIso()
    };

    state.lastWestPacket = clonePlain(westPacket);
    return westPacket;
  }

  function classifyForSouth(classificationOrEvent = {}, context = {}) {
    const packet = classificationOrEvent && classificationOrEvent.action
      ? classificationOrEvent
      : createNewsFibonacciClassification(classificationOrEvent, context);

    const southPacket = {
      contract: CONTRACT,
      receipt: RECEIPT,
      targetFile: packet.targetMacroGate === "F8" ? ROUTE_CONDUCTOR_FILE : SOUTH_FILE,
      canvasFile: CANVAS_FILE,
      sourceFile: FILE,
      southProofRequired: packet.southProofRequired === true,
      southMarkerObservedOnly: packet.southMarkerObservedOnly === true || packet.routeConductor.routeConductorMarkerOnly === true,
      southRuntimeBodyObserved: packet.routeConductor.routeConductorHydrated === true,
      southReceiptObserved: packet.routeConductor.routeConductorReceiptPresent === true,
      southVisibleProofObserved: packet.visibleProof.visiblePlanetProofValid === true,
      southVisibleProofPending: packet.targetMacroGate === "F13" && packet.visibleProof.visiblePlanetProofValid !== true,
      southProofMustBeProvidedBySouth: true,
      eastOwnsSouthProof: false,
      recommendedNextRenewalTarget: packet.recommendedNextRenewalTarget,
      firstFailedCoordinate: packet.firstFailedCoordinate,
      visualPassClaimed: false,
      generatedAt: nowIso()
    };

    state.lastSouthPacket = clonePlain(southPacket);
    return southPacket;
  }

  function classifyForNorth(classificationOrEvent = {}, context = {}) {
    const packet = classificationOrEvent && classificationOrEvent.action
      ? classificationOrEvent
      : createNewsFibonacciClassification(classificationOrEvent, context);

    const northPacket = {
      contract: CONTRACT,
      receipt: RECEIPT,
      targetFile: NORTH_FILE,
      sourceFile: FILE,
      northDialectPacket: true,
      runtimeTableLanguagePreserved: true,
      newsFibonacciAlignment: true,
      activeGateAdmissionRequest: packet.action === ACTIONS.ADMIT_FOR_NORTH_REVIEW,
      activeGateHoldRequest: [
        ACTIONS.HELD_FOR_NORTH_CONTEXT,
        ACTIONS.HELD_FOR_SOUTH_CONDUCTOR_BODY,
        ACTIONS.BLOCK_FALSE_COMPLETION
      ].includes(packet.action),
      activeGateArchiveRequest: [
        ACTIONS.ARCHIVE_DUPLICATE_OR_PRIOR,
        ACTIONS.ARCHIVE_PROGRESS_ONLY,
        ACTIONS.UNKNOWN_EVENT_ARCHIVE
      ].includes(packet.action),
      activeGateQueueRequest: packet.action === ACTIONS.QUEUE_FOR_ACTIVE_GATE,
      f21ReviewRequest: packet.action === ACTIONS.F21_PROPOSED_FOR_NORTH_REVIEW,
      microStageId: packet.targetMicroStageId,
      macroGate: packet.targetMacroGate,
      reason: packet.reason,
      firstFailedCoordinate: packet.firstFailedCoordinate,
      recommendedNextRenewalTarget: packet.recommendedNextRenewalTarget,
      northMustAdmit: true,
      eastOwnsCheckpointAdmission: false,
      eastOwnsF21Latch: false,
      visualPassClaimed: false,
      generatedAt: nowIso()
    };

    state.lastNorthPacket = clonePlain(northPacket);
    return northPacket;
  }

  function createChronologicalFibonacciPlan() {
    return MICRO_STAGES.map((item) => ({
      id: item.id,
      microStageId: item.id,
      macroGate: item.macroGate,
      fibonacci: item.id.split("_")[0],
      macroRank: item.macroRank,
      rank: item.rank,
      owner: item.owner,
      label: item.label,
      events: item.events.slice(),
      requiresNorthMacroPermission: true,
      eastOwnsCompletion: false,
      northMustAdmit: true,
      status: "PENDING",
      visualPassClaimed: false
    }));
  }

  function createNewsFibonacciCheckpointPlan() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "east-north-dialect-fibonacci-magnifier-plan",
      runtimeTableLanguagePreserved: true,
      newsProtocolSynchronized: true,
      fibonacciSynchronizationActive: true,
      eastFibonacciMagnifier: true,
      eastPublicTransmissionMapLanguage: false,
      northOwnsActiveGate: true,
      northOwnsCheckpointAdmission: true,
      northOwnsF21Latch: true,
      sequence: createChronologicalFibonacciPlan(),
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function createCheckpointSession(_sequenceInput = null, options = {}) {
    const sessionState = {
      sessionId: options.id || options.sessionId || `east-fibonacci-magnifier-${Math.random().toString(36).slice(2, 9)}`,
      route: options.route || "/showroom/globe/hearth/",
      planetId: options.planetId || "hearth",
      planetLabel: options.planetLabel || "Hearth",
      submittedCount: 0,
      latestClassification: null,
      createdAt: nowIso(),
      updatedAt: nowIso()
    };

    function submitEvent(event = {}, context = {}) {
      sessionState.submittedCount += 1;
      const classification = createNewsFibonacciClassification(event, {
        ...options,
        ...context
      });

      sessionState.latestClassification = clonePlain(classification);
      sessionState.updatedAt = nowIso();

      return {
        action: classification.legacyAction,
        eastAction: classification.action,
        gapClass: classification.gapClass,
        sessionId: sessionState.sessionId,
        northMustDecide: true,
        eastOwnsProgress: false,
        eastOwnsGearShift: false,
        eastOwnsCompletionLatch: false,
        visibleProgress: 0,
        progressCap: 0,
        readyTextAllowed: false,
        firstFailedCoordinate: classification.firstFailedCoordinate,
        recommendedNextRenewalTarget: classification.recommendedNextRenewalTarget,
        rawClassification: classification
      };
    }

    function submitMany(events = [], context = {}) {
      return asArray(events).map((event) => submitEvent(event, context));
    }

    function getReceipt() {
      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        checkpointSessionContract: "LAB_RUNTIME_TABLE_CARDINAL_EAST_NORTH_DIALECT_NON_GOVERNING_SESSION_v1",
        checkpointSessionReceipt: "LAB_RUNTIME_TABLE_CARDINAL_EAST_NORTH_DIALECT_NON_GOVERNING_SESSION_RECEIPT_v1",
        sessionId: sessionState.sessionId,
        route: sessionState.route,
        planetId: sessionState.planetId,
        planetLabel: sessionState.planetLabel,
        nonGoverningCompatibilityShell: true,
        eastFibonacciMagnifier: true,
        eastUsesNorthDialect: true,
        northOwnsActiveGate: true,
        northOwnsCheckpointAdmission: true,
        northOwnsF21Latch: true,
        eastOwnsProgress: false,
        eastOwnsGearShift: false,
        eastOwnsCompletionLatch: false,
        readyTextAllowed: false,
        submittedCount: sessionState.submittedCount,
        latestClassification: clonePlain(sessionState.latestClassification),
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false,
        createdAt: sessionState.createdAt,
        updatedAt: sessionState.updatedAt
      };
    }

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      sessionId: sessionState.sessionId,
      submitEvent,
      submitMany,
      completeActive: submitEvent,
      canAdvanceTo() {
        return false;
      },
      getActiveCheckpoint() {
        return null;
      },
      getCheckpointState() {
        return createChronologicalFibonacciPlan();
      },
      getNewsGateState() {
        return {
          northGateReady: false,
          eastGateReady: true,
          westGateReady: false,
          southGateReady: false,
          newsGatePassedBeforeF21: false,
          newsGateDegradedBeforeF21: false,
          northMustDecide: true,
          eastOwnsNewsFinalApproval: false
        };
      },
      getReceipt,
      getReceiptText() {
        const r = getReceipt();
        return [
          "LAB_RUNTIME_TABLE_CARDINAL_EAST_NORTH_DIALECT_NON_GOVERNING_SESSION_RECEIPT",
          "",
          `contract=${r.contract}`,
          `receipt=${r.receipt}`,
          `sessionId=${r.sessionId}`,
          `route=${r.route}`,
          `nonGoverningCompatibilityShell=${r.nonGoverningCompatibilityShell}`,
          `eastFibonacciMagnifier=${r.eastFibonacciMagnifier}`,
          `eastUsesNorthDialect=${r.eastUsesNorthDialect}`,
          `northOwnsActiveGate=${r.northOwnsActiveGate}`,
          `northOwnsCheckpointAdmission=${r.northOwnsCheckpointAdmission}`,
          `northOwnsF21Latch=${r.northOwnsF21Latch}`,
          `eastOwnsProgress=${r.eastOwnsProgress}`,
          `eastOwnsGearShift=${r.eastOwnsGearShift}`,
          `eastOwnsCompletionLatch=${r.eastOwnsCompletionLatch}`,
          `readyTextAllowed=${r.readyTextAllowed}`,
          `visualPassClaimed=${r.visualPassClaimed}`,
          `updatedAt=${r.updatedAt}`
        ].join("\n");
      },
      get state() {
        return sessionState;
      }
    };
  }

  function createHearthCheckpointSession(options = {}) {
    return createCheckpointSession(null, {
      planetId: "hearth",
      planetLabel: "Hearth",
      route: "/showroom/globe/hearth/",
      ...options
    });
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      destinationFile: FILE,
      northFile: NORTH_FILE,
      westFile: WEST_FILE,
      southFile: SOUTH_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      canvasFile: CANVAS_FILE,
      status: "active",
      role: state.role,

      eastAuthority: true,
      eastLoaded: true,
      eastFallbackUsed: false,
      eastUsesNorthDialect: true,
      eastFibonacciMagnifier: true,
      eastMicroStageClassifier: true,
      eastPublicTransmissionMapLanguage: false,
      northPermissionRequired: true,
      macroRuntimeTableOwnedByNorth: true,

      ownsEventNormalization: true,
      ownsEventAliasRecognition: true,
      ownsFibonacciMicroStageMapping: true,
      ownsNorthContextReading: true,
      ownsMicroStageClassification: true,
      ownsFalseCompletionWarning: true,
      ownsFutureStageQueueClassification: true,
      ownsDuplicateStageArchiveClassification: true,
      ownsProgressOnlyArchiveClassification: true,

      ownsNorthRuntimeTableAuthority: false,
      ownsActiveGateCursor: false,
      ownsVisibleLoaderPercentage: false,
      ownsCheckpointClosure: false,
      ownsF21Latch: false,
      ownsReadyText: false,
      ownsSouthVisibleProof: false,
      ownsWestAdmissibilityJudgment: false,
      ownsCanvasDrawing: false,
      ownsCanvasChildTruth: false,
      ownsRouteConductorRuntime: false,
      ownsPlanetTruth: false,
      ownsFinalVisualPassClaim: false,

      northContextPresent: Boolean(state.lastNorthContext && state.lastNorthContext.northContextPresent),
      northActiveMacroGate: state.lastNorthContext ? state.lastNorthContext.northActiveMacroGate : "",
      lastClassifiedMicroStage: state.lastClassification ? state.lastClassification.targetMicroStageId : "",
      lastClassificationAction: state.lastClassification ? state.lastClassification.action : "",
      lastClassificationReason: state.lastClassification ? state.lastClassification.reason : "",

      classifyCount: state.classifyCount,
      progressOnlyCount: state.progressOnlyCount,
      falseCompletionBlockCount: state.falseCompletionBlockCount,
      markerOnlyHoldCount: state.markerOnlyHoldCount,
      unknownArchiveCount: state.unknownArchiveCount,

      f21FirewallActive: true,
      completionLatchedByEast: false,
      visualPassClaimed: false,

      microFibonacciStageMap: createChronologicalFibonacciPlan(),
      exports: [
        "normalizeEvent",
        "readNorthContext",
        "classifyFibonacciStage",
        "classifyRouteConductorEvidence",
        "classifyVisibleProofEvidence",
        "isFalseCompletionMutation",
        "classifyForWest",
        "classifyForSouth",
        "classifyForNorth",
        "createNewsFibonacciClassification",
        "classifyTransmissionEvent",
        "classifyCheckpointEvent",
        "createChronologicalFibonacciPlan",
        "createNewsFibonacciCheckpointPlan",
        "createCheckpointSession",
        "createHearthCheckpointSession",
        "getReceipt"
      ],

      lastNorthContext: clonePlain(state.lastNorthContext),
      lastClassification: clonePlain(state.lastClassification),
      lastWestPacket: clonePlain(state.lastWestPacket),
      lastSouthPacket: clonePlain(state.lastSouthPacket),
      lastNorthPacket: clonePlain(state.lastNorthPacket),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      updatedAt: nowIso()
    };
  }

  function getReceiptText() {
    const r = getReceipt();

    const events = r.localEvents.length
      ? r.localEvents.map((item) => `- ${item.at} :: ${item.event} :: ${JSON.stringify(item.detail || {})}`).join("\n")
      : "- none";

    const errors = r.errors.length
      ? r.errors.map((item) => `- ${item.at} :: ${item.code} :: ${item.message}`).join("\n")
      : "- none";

    return [
      "LAB_RUNTIME_TABLE_CARDINAL_EAST_NORTH_DIALECT_FIBONACCI_MAGNIFIER_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `destinationFile=${r.destinationFile}`,
      `role=${r.role}`,
      "",
      `eastAuthority=${r.eastAuthority}`,
      `eastLoaded=${r.eastLoaded}`,
      `eastUsesNorthDialect=${r.eastUsesNorthDialect}`,
      `eastFibonacciMagnifier=${r.eastFibonacciMagnifier}`,
      `eastMicroStageClassifier=${r.eastMicroStageClassifier}`,
      `eastPublicTransmissionMapLanguage=${r.eastPublicTransmissionMapLanguage}`,
      `northPermissionRequired=${r.northPermissionRequired}`,
      `macroRuntimeTableOwnedByNorth=${r.macroRuntimeTableOwnedByNorth}`,
      "",
      `ownsEventNormalization=${r.ownsEventNormalization}`,
      `ownsEventAliasRecognition=${r.ownsEventAliasRecognition}`,
      `ownsFibonacciMicroStageMapping=${r.ownsFibonacciMicroStageMapping}`,
      `ownsNorthContextReading=${r.ownsNorthContextReading}`,
      `ownsMicroStageClassification=${r.ownsMicroStageClassification}`,
      "",
      `ownsNorthRuntimeTableAuthority=${r.ownsNorthRuntimeTableAuthority}`,
      `ownsActiveGateCursor=${r.ownsActiveGateCursor}`,
      `ownsVisibleLoaderPercentage=${r.ownsVisibleLoaderPercentage}`,
      `ownsCheckpointClosure=${r.ownsCheckpointClosure}`,
      `ownsF21Latch=${r.ownsF21Latch}`,
      `ownsReadyText=${r.ownsReadyText}`,
      `ownsSouthVisibleProof=${r.ownsSouthVisibleProof}`,
      `ownsWestAdmissibilityJudgment=${r.ownsWestAdmissibilityJudgment}`,
      `ownsCanvasDrawing=${r.ownsCanvasDrawing}`,
      `ownsRouteConductorRuntime=${r.ownsRouteConductorRuntime}`,
      `ownsFinalVisualPassClaim=${r.ownsFinalVisualPassClaim}`,
      "",
      `northContextPresent=${r.northContextPresent}`,
      `northActiveMacroGate=${r.northActiveMacroGate}`,
      `lastClassifiedMicroStage=${r.lastClassifiedMicroStage}`,
      `lastClassificationAction=${r.lastClassificationAction}`,
      `lastClassificationReason=${r.lastClassificationReason}`,
      "",
      `classifyCount=${r.classifyCount}`,
      `progressOnlyCount=${r.progressOnlyCount}`,
      `falseCompletionBlockCount=${r.falseCompletionBlockCount}`,
      `markerOnlyHoldCount=${r.markerOnlyHoldCount}`,
      `unknownArchiveCount=${r.unknownArchiveCount}`,
      `f21FirewallActive=${r.f21FirewallActive}`,
      `completionLatchedByEast=${r.completionLatchedByEast}`,
      "",
      "LOCAL_EVENTS",
      events,
      "",
      "ERRORS",
      errors,
      "",
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function publishDataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;

    const dataset = doc.documentElement.dataset;

    dataset.labRuntimeTableEastLoaded = "true";
    dataset.labRuntimeTableEastContract = CONTRACT;
    dataset.labRuntimeTableEastReceipt = RECEIPT;
    dataset.labRuntimeTableEastVersion = VERSION;

    dataset.eastUsesNorthDialect = "true";
    dataset.eastFibonacciMagnifier = "true";
    dataset.eastMicroStageClassifier = "true";
    dataset.eastPublicTransmissionMapLanguage = "false";
    dataset.eastNorthPermissionRequired = "true";
    dataset.northOwnsRuntimeTable = "true";
    dataset.northOwnsCheckpointAdmission = "true";
    dataset.northOwnsF21Latch = "true";

    dataset.eastOwnsActiveGate = "false";
    dataset.eastOwnsVisibleProgress = "false";
    dataset.eastOwnsF21Latch = "false";
    dataset.eastOwnsFinalVisualPassClaim = "false";

    dataset.eastF21FirewallActive = "true";
    dataset.newsFibonacciAlignment = "true";

    dataset.eastLastClassifiedMicroStage = state.lastClassification ? state.lastClassification.targetMicroStageId : "";
    dataset.eastLastClassificationAction = state.lastClassification ? state.lastClassification.action : "";
    dataset.eastLastClassificationReason = state.lastClassification ? state.lastClassification.reason : "";

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,

    ACTIONS,
    CHECKPOINT_EVENT_ACTIONS: LEGACY_ACTIONS,
    GAP_CLASS,
    NEWS_GATES,
    MICRO_STAGES,
    FIBONACCI_CHECKPOINTS: MICRO_STAGES,

    normalizeEvent,
    readNorthContext,
    classifyFibonacciStage,
    classifyRouteConductorEvidence,
    classifyVisibleProofEvidence,
    isFalseCompletionMutation,
    isProgressOnlyEvent,
    mapEventToStage,

    classifyForWest,
    classifyForSouth,
    classifyForNorth,
    createNewsFibonacciClassification,

    classifyTransmissionEvent,
    classifyCheckpointEvent,
    createChronologicalFibonacciPlan,
    createNewsFibonacciCheckpointPlan,
    createCheckpointSession,
    createHearthCheckpointSession,

    getReceipt,
    getReceiptText,

    eastAuthority: true,
    eastLoaded: true,
    eastFallbackUsed: false,
    eastUsesNorthDialect: true,
    eastFibonacciMagnifier: true,
    eastMicroStageClassifier: true,
    eastPublicTransmissionMapLanguage: false,
    northPermissionRequired: true,
    macroRuntimeTableOwnedByNorth: true,

    ownsActiveGateCursor: false,
    ownsVisibleProgress: false,
    ownsCheckpointClosure: false,
    ownsF21Latch: false,
    ownsReadyText: false,
    ownsSouthVisibleProof: false,
    ownsWestAdmissibilityJudgment: false,
    ownsCanvasDrawing: false,
    ownsRouteConductorRuntime: false,
    ownsFinalVisualPassClaim: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  root.DEXTER_LAB = root.DEXTER_LAB || {};
  root.HEARTH = root.HEARTH || {};

  root.DEXTER_LAB.runtimeTableEast = api;
  root.DEXTER_LAB.cardinalRuntimeTableEast = api;
  root.DEXTER_LAB.checkpointGovernorEast = api;
  root.DEXTER_LAB.hearthEastFibonacciMagnifier = api;

  root.LAB_RUNTIME_TABLE_EAST = api;
  root.RUNTIME_TABLE_EAST = api;
  root.DEXTER_LAB_RUNTIME_TABLE_EAST = api;
  root.LAB_CARDINAL_RUNTIME_TABLE_EAST = api;
  root.LAB_CHECKPOINT_GOVERNOR_EAST = api;
  root.HEARTH_EAST_FIBONACCI_MAGNIFIER = api;
  root.HEARTH.eastFibonacciMagnifier = api;

  publishDataset();
  record("EAST_NORTH_DIALECT_FIBONACCI_MAGNIFIER_LOADED", {
    file: FILE,
    contract: CONTRACT,
    eastUsesNorthDialect: true,
    eastPublicTransmissionMapLanguage: false
  });

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

// /assets/lab/runtime-table.west.js
// LAB_RUNTIME_TABLE_CARDINAL_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_TNT_v1
// Full-file replacement.
// Cardinal West authority.
// Purpose:
// - Establish West as the cycle-aware admissibility clutch for the Lab Runtime Table stream.
// - Preserve file-name gates as primary routing gates.
// - Audit Cycle 1 and Cycle 2 order.
// - Audit NEWS alignment and Fibonacci synchronization.
// - Classify gaps, holds, degraded-forward conditions, false completion, and Canvas release.
// - Release to Canvas only in Cycle 2 after South output passes West admissibility.
// - Return Cycle 1 South packets to North.
// - Preserve legacy West exports while renewing the authority model.

(() => {
  "use strict";

  const CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_TNT_v1";
  const RECEIPT = "LAB_RUNTIME_TABLE_CARDINAL_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_WEST_TRANSMISSION_GAP_CLASSIFIER_TNT_v1";
  const BASELINE_CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_WEST_TRANSMISSION_GAP_CLASSIFIER_TNT_v1";
  const VERSION = "2026-05-31.lab-runtime-table-west-cycle-aware-admissibility-clutch-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const FILE = "/assets/lab/runtime-table.west.js";

  const FILE_GATES = Object.freeze({
    north: "/assets/lab/runtime-table.js",
    east: "/assets/lab/runtime-table.east.js",
    west: "/assets/lab/runtime-table.west.js",
    south: "/assets/lab/runtime-table.south.js",
    routeConductor: "/showroom/globe/hearth/hearth.js",
    hearthIndex: "/showroom/globe/hearth/index.js",
    canvas: "/assets/hearth/hearth.canvas.js"
  });

  const CYCLES = Object.freeze({
    CYCLE_1: "CYCLE_1",
    CYCLE_2: "CYCLE_2",
    UNKNOWN: "UNKNOWN"
  });

  const CYCLE_PATHS = Object.freeze({
    CYCLE_1: Object.freeze(["NORTH", "EAST", "WEST", "SOUTH", "NORTH"]),
    CYCLE_2: Object.freeze(["NORTH", "EAST", "SOUTH", "WEST", "CANVAS"])
  });

  const CARDINALS = Object.freeze({
    NORTH: "NORTH",
    EAST: "EAST",
    WEST: "WEST",
    SOUTH: "SOUTH",
    CANVAS: "CANVAS",
    UNKNOWN: "UNKNOWN"
  });

  const GAP_CLASS = Object.freeze({
    NONE: "NONE",
    CYCLE_ORDER_HELD: "CYCLE_ORDER_HELD",
    ACTIVE_GATE_WAIT: "ACTIVE_GATE_WAIT",
    FUTURE_CYCLE_HELD: "FUTURE_CYCLE_HELD",
    PRIOR_PACKET_ARCHIVE: "PRIOR_PACKET_ARCHIVE",
    DUPLICATE_ARCHIVE: "DUPLICATE_ARCHIVE",
    PROGRESS_ONLY_ARCHIVE: "PROGRESS_ONLY_ARCHIVE",
    DEGRADED_GAP: "DEGRADED_GAP",
    STRUCTURAL_BLOCK: "STRUCTURAL_BLOCK",
    FALSE_COMPLETION_BLOCK: "FALSE_COMPLETION_BLOCK",
    NEWS_ALIGNMENT_HELD: "NEWS_ALIGNMENT_HELD",
    FIBONACCI_SYNC_HELD: "FIBONACCI_SYNC_HELD",
    CANVAS_RELEASE_HELD: "CANVAS_RELEASE_HELD",
    F21_NORTH_REVIEW_REQUIRED: "F21_NORTH_REVIEW_REQUIRED",
    UNKNOWN_ARCHIVE: "UNKNOWN_ARCHIVE"
  });

  const GAP_SEVERITY = Object.freeze({
    NONE: "NONE",
    INFO: "INFO",
    HELD: "HELD",
    DEGRADED: "DEGRADED",
    WARNING: "WARNING",
    SOFT_BLOCK: "SOFT_BLOCK",
    HARD_BLOCK: "HARD_BLOCK"
  });

  const GAP_DECISION = Object.freeze({
    FULL_PASS: "FULL_PASS",
    ADMIT_TO_SOUTH: "ADMIT_TO_SOUTH",
    RETURN_TO_NORTH: "RETURN_TO_NORTH",
    RELEASE_TO_CANVAS: "RELEASE_TO_CANVAS",
    RETURN_TO_NORTH_FOR_F21: "RETURN_TO_NORTH_FOR_F21",
    DEGRADED_FORWARD: "DEGRADED_FORWARD",
    HOLD_ACTIVE: "HOLD_ACTIVE",
    HOLD_FOR_CYCLE: "HOLD_FOR_CYCLE",
    ARCHIVE: "ARCHIVE",
    HARD_BLOCK: "HARD_BLOCK"
  });

  const CHECKPOINT_IDS = Object.freeze({
    F1: "F1_NORTH_MACRO_DISTRIBUTION",
    F2: "F2_EAST_ROUTE_ALIGNMENT",
    F3: "F3_EAST_SCRIPT_ORDER",
    F5: "F5_NORTH_AUTHORITY",
    F8: "F8_SOUTH_ROUTE_CONDUCTOR",
    F13A: "F13A_CANVAS_PARENT",
    F13B: "F13B_CANVAS_CHILDREN",
    F13C: "F13C_CANVAS_TEXTURE",
    F13D: "F13D_CANVAS_FRAME",
    F13E: "F13E_VISIBLE_PROOF",
    F13N: "F13N_INSPECT_GATE",
    F21: "F21_COMPLETION_LATCH"
  });

  const CHECKPOINT_SEQUENCE = Object.freeze([
    checkpoint(CHECKPOINT_IDS.F1, 1, "F1", "NORTH", "macro distribution"),
    checkpoint(CHECKPOINT_IDS.F2, 2, "F2", "EAST", "route alignment"),
    checkpoint(CHECKPOINT_IDS.F3, 3, "F3", "EAST", "script order"),
    checkpoint(CHECKPOINT_IDS.F5, 5, "F5", "NORTH", "authority availability"),
    checkpoint(CHECKPOINT_IDS.F8, 8, "F8", "SOUTH", "route conductor self-duty"),
    checkpoint(CHECKPOINT_IDS.F13A, 13.1, "F13A", "NORTH", "canvas parent"),
    checkpoint(CHECKPOINT_IDS.F13B, 13.2, "F13B", "EAST", "canvas children"),
    checkpoint(CHECKPOINT_IDS.F13C, 13.3, "F13C", "SOUTH", "canvas texture"),
    checkpoint(CHECKPOINT_IDS.F13D, 13.4, "F13D", "SOUTH", "canvas frame"),
    checkpoint(CHECKPOINT_IDS.F13E, 13.5, "F13E", "SOUTH", "visible proof"),
    checkpoint(CHECKPOINT_IDS.F13N, 13.9, "F13N", "WEST", "inspect gate"),
    checkpoint(CHECKPOINT_IDS.F21, 21, "F21", "NORTH", "completion latch")
  ]);

  const CHECKPOINT_BY_ID = Object.freeze(
    CHECKPOINT_SEQUENCE.reduce((acc, item) => {
      acc[item.id] = item;
      acc[item.fibonacci] = item;
      return acc;
    }, {})
  );

  const EVENT_TO_CHECKPOINT = Object.freeze({
    NORTH_MACRO_DISTRIBUTION_READY: CHECKPOINT_IDS.F1,
    EAST_ROUTE_ALIGNMENT_READY: CHECKPOINT_IDS.F2,
    EAST_GATE_ALIGNMENT_READY: CHECKPOINT_IDS.F2,
    SCRIPT_ORDER_COMPLETE: CHECKPOINT_IDS.F3,
    AUTHORITY_AVAILABILITY_READY: CHECKPOINT_IDS.F5,
    SOUTH_ROUTE_CONDUCTOR_READY: CHECKPOINT_IDS.F8,
    SOUTH_ROUTE_CONDUCTOR_HYDRATED: CHECKPOINT_IDS.F8,
    CANVAS_PARENT_READY: CHECKPOINT_IDS.F13A,
    CANVAS_CHILDREN_READY: CHECKPOINT_IDS.F13B,
    TEXTURE_COMPOSE_COMPLETE: CHECKPOINT_IDS.F13C,
    FIRST_FRAME_DETECTED: CHECKPOINT_IDS.F13D,
    IMAGE_RENDERED: CHECKPOINT_IDS.F13D,
    VISIBLE_CONTENT_PROOF_PASSED: CHECKPOINT_IDS.F13E,
    VISIBLE_PLANET_PROOF_VALID: CHECKPOINT_IDS.F13E,
    INSPECT_MODE_READY: CHECKPOINT_IDS.F13N,
    F21_COMPLETION_LATCH: CHECKPOINT_IDS.F21,
    F21_ELIGIBILITY_SUBMITTED_TO_NORTH: CHECKPOINT_IDS.F21,
    COMPLETION_LATCHED: CHECKPOINT_IDS.F21
  });

  const PROGRESS_ONLY_EVENTS = Object.freeze([
    "ATLAS_BUILD_PROGRESS",
    "TEXTURE_COMPOSE_PROGRESS",
    "WIDE_PROBE_PROGRESS",
    "RECONCILE_PROGRESS",
    "CANVAS_PROGRESS",
    "PHASE_PROGRESS",
    "GEAR_PROGRESS_TICK",
    "LOADING_PROGRESS",
    "RENDER_PROGRESS"
  ]);

  const FALSE_COMPLETION_TOKENS = Object.freeze([
    "\"visualPassClaimed\":true",
    "visualPassClaimed=true",
    "\"readyTextAllowed\":true",
    "readyTextAllowed=true",
    "\"completionLatched\":true",
    "completionLatched=true",
    "\"finalCompletionLatched\":true",
    "finalCompletionLatched=true",
    "\"mainDisplayProgress\":100",
    "mainDisplayProgress=100",
    "\"visibleProgress\":100",
    "visibleProgress=100",
    "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE",
    "READY_DEGRADED_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE",
    "F21_COMPLETION_LATCHED",
    "F21_DEGRADED_COMPLETION_LATCHED"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    role: "west-cycle-aware-admissibility-clutch",

    cycleAwareWestAuthority: true,
    cycleOneLawActive: true,
    cycleTwoLawActive: true,
    canvasCycleOneBlocked: true,
    canvasCycleTwoReleaseSupported: true,
    southReturnsToNorthInCycleOne: true,
    southPrecedesWestInCycleTwo: true,
    f21NorthLatchOnly: true,
    newsAlignmentAuditActive: true,
    fibonacciSynchronizationAuditActive: true,
    falseCompletionFirewallActive: true,

    classifyCount: 0,
    cycleOneCount: 0,
    cycleTwoCount: 0,
    canvasReleaseCount: 0,
    returnNorthCount: 0,
    falseCompletionBlockCount: 0,
    degradedForwardCount: 0,

    lastNorthContext: null,
    lastCyclePacket: null,
    lastAdmissibility: null,
    lastGapReceipt: null,
    localEvents: [],
    errors: [],

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    startedAt: nowIso(),
    updatedAt: nowIso()
  };

  function checkpoint(id, rank, fibonacci, owner, label) {
    return Object.freeze({
      id,
      rank,
      fibonacci,
      owner,
      label
    });
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
    if (value === 1 || value === "1" || value === "true") return true;
    if (value === 0 || value === "0" || value === "false") return false;
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

  function trim(list, max = 160) {
    if (Array.isArray(list) && list.length > max) {
      list.splice(0, list.length - max);
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
    for (const name of asArray(names)) {
      const value = readPath(name);
      if (value) return value;
    }
    return null;
  }

  function datasetValue(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
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

  function normalizeEvent(event = {}) {
    const source = isObject(event) ? event : { event };
    const detail = isObject(source.detail) ? source.detail : {};
    const snapshot = isObject(source.snapshot) ? source.snapshot : {};

    const merged = {
      ...snapshot,
      ...detail,
      ...source
    };

    const candidates = [
      merged.event,
      merged.id,
      merged.phase,
      merged.checkpointId,
      merged.checkpointEvent,
      merged.activeGateId,
      merged.activeFibonacci,
      merged.fibonacci
    ].filter((item) => item !== undefined && item !== null && item !== "");

    const name = candidates.length ? safeString(candidates[0]) : "";

    return {
      ...merged,
      name,
      event: safeString(merged.event || name),
      id: safeString(merged.id || merged.checkpointId || name),
      phase: safeString(merged.phase || name),
      checkpointId: safeString(merged.checkpointId || EVENT_TO_CHECKPOINT[name] || name),
      candidates: candidates.map(String),
      detail: clonePlain(detail),
      snapshot: clonePlain(snapshot),
      raw: clonePlain(source),
      normalizedAt: nowIso()
    };
  }

  function normalizeSnapshot(snapshot = {}, context = {}) {
    const event = context && context.event ? normalizeEvent(context.event) : {};
    return {
      ...event,
      ...(isObject(snapshot) ? snapshot : {})
    };
  }

  function stringifyForSafety(value) {
    try {
      return JSON.stringify(value || {});
    } catch (_error) {
      return String(value || "");
    }
  }

  function containsFalseCompletionLanguage(value = {}) {
    const text = stringifyForSafety(value);
    return FALSE_COMPLETION_TOKENS.some((token) => text.includes(token));
  }

  function eventNameFromContext(context = {}) {
    const event = normalizeEvent(context.event || {});
    return safeString(
      context.eventName ||
      event.event ||
      event.id ||
      event.phase ||
      ""
    );
  }

  function checkpointFromValue(value = "") {
    const text = safeString(value).toUpperCase();

    if (CHECKPOINT_BY_ID[text]) return CHECKPOINT_BY_ID[text];
    if (EVENT_TO_CHECKPOINT[text]) return CHECKPOINT_BY_ID[EVENT_TO_CHECKPOINT[text]] || null;

    if (text.includes("F21") || text.includes("COMPLETION") || text.includes("LATCH")) return CHECKPOINT_BY_ID[CHECKPOINT_IDS.F21];
    if (text.includes("F13N") || text.includes("INSPECT")) return CHECKPOINT_BY_ID[CHECKPOINT_IDS.F13N];
    if (text.includes("VISIBLE") || text.includes("PROOF")) return CHECKPOINT_BY_ID[CHECKPOINT_IDS.F13E];
    if (text.includes("FRAME") || text.includes("IMAGE_RENDERED")) return CHECKPOINT_BY_ID[CHECKPOINT_IDS.F13D];
    if (text.includes("TEXTURE")) return CHECKPOINT_BY_ID[CHECKPOINT_IDS.F13C];
    if (text.includes("CHILD")) return CHECKPOINT_BY_ID[CHECKPOINT_IDS.F13B];
    if (text.includes("CANVAS")) return CHECKPOINT_BY_ID[CHECKPOINT_IDS.F13A];
    if (text.includes("CONDUCTOR") || text.includes("HYDRAT")) return CHECKPOINT_BY_ID[CHECKPOINT_IDS.F8];
    if (text.includes("AUTHORITY") || text.includes("RUNTIME_TABLE")) return CHECKPOINT_BY_ID[CHECKPOINT_IDS.F5];
    if (text.includes("SCRIPT")) return CHECKPOINT_BY_ID[CHECKPOINT_IDS.F3];
    if (text.includes("FIRST") || text.includes("PAINT") || text.includes("EAST")) return CHECKPOINT_BY_ID[CHECKPOINT_IDS.F2];
    if (text.includes("NORTH") || text.includes("MACRO")) return CHECKPOINT_BY_ID[CHECKPOINT_IDS.F1];

    return null;
  }

  function checkpointIdFromContext(context = {}) {
    const event = normalizeEvent(context.event || {});
    const value =
      context.checkpointId ||
      context.activeGateId ||
      event.checkpointId ||
      event.activeGateId ||
      event.activeFibonacci ||
      event.fibonacci ||
      event.name ||
      "";

    const mapped = checkpointFromValue(value);
    return mapped ? mapped.id : safeString(value);
  }

  function activeCheckpointIdFromContext(context = {}, northContext = null) {
    const value =
      context.activeCheckpointId ||
      context.activeGateId ||
      context.activeFibonacci ||
      northContext && (
        northContext.activeCheckpointId ||
        northContext.activeGateId ||
        northContext.activeFibonacci
      ) ||
      datasetValue("activeGateId", "") ||
      datasetValue("activeFibonacci", "");

    const mapped = checkpointFromValue(value);
    return mapped ? mapped.id : safeString(value);
  }

  function checkpointRank(id) {
    const item = CHECKPOINT_BY_ID[id] || checkpointFromValue(id);
    return item ? item.rank : 0;
  }

  function isProgressOnlyEvent(eventOrName = "") {
    const name = typeof eventOrName === "string"
      ? eventOrName
      : eventNameFromContext({ event: eventOrName });

    return PROGRESS_ONLY_EVENTS.includes(safeString(name));
  }

  function detectCardinalFromFile(file = "") {
    const text = safeString(file).toLowerCase();

    if (!text) return "";
    if (text.includes("runtime-table.west") || text.includes("hearth.west")) return CARDINALS.WEST;
    if (text.includes("runtime-table.east") || text.includes("hearth/index")) return CARDINALS.EAST;
    if (text.includes("runtime-table.south") || text.endsWith("/hearth.js")) return CARDINALS.SOUTH;
    if (text.includes("runtime-table.js")) return CARDINALS.NORTH;
    if (text.includes("hearth.canvas")) return CARDINALS.CANVAS;

    return "";
  }

  function normalizeCardinal(value = "") {
    const text = safeString(value).toUpperCase();

    if (text.includes("NORTH")) return CARDINALS.NORTH;
    if (text.includes("EAST")) return CARDINALS.EAST;
    if (text.includes("WEST")) return CARDINALS.WEST;
    if (text.includes("SOUTH")) return CARDINALS.SOUTH;
    if (text.includes("CANVAS")) return CARDINALS.CANVAS;

    return "";
  }

  function detectPacketSource(packet = {}, context = {}) {
    const source =
      normalizeCardinal(packet.sourceCardinal) ||
      normalizeCardinal(packet.source) ||
      normalizeCardinal(packet.cardinal) ||
      normalizeCardinal(packet.activeCardinal) ||
      normalizeCardinal(context.sourceCardinal) ||
      normalizeCardinal(context.source) ||
      detectCardinalFromFile(packet.sourceFile) ||
      detectCardinalFromFile(context.sourceFile) ||
      detectCardinalFromFile(packet.file) ||
      CARDINALS.UNKNOWN;

    return source;
  }

  function detectPacketDestination(packet = {}, context = {}) {
    if (safeBool(packet.canvasReleaseRequested, false) || safeBool(packet.releaseToCanvas, false)) {
      return CARDINALS.CANVAS;
    }

    const destination =
      normalizeCardinal(packet.targetCardinal) ||
      normalizeCardinal(packet.destinationCardinal) ||
      normalizeCardinal(packet.target) ||
      normalizeCardinal(packet.destination) ||
      normalizeCardinal(context.targetCardinal) ||
      normalizeCardinal(context.destinationCardinal) ||
      detectCardinalFromFile(packet.targetFile) ||
      detectCardinalFromFile(packet.destinationFile) ||
      detectCardinalFromFile(context.targetFile) ||
      CARDINALS.UNKNOWN;

    return destination;
  }

  function readNorthCycleContext(context = {}) {
    const supplied = isObject(context) ? context : {};

    const northApi = firstGlobal([
      "LAB_RUNTIME_TABLE",
      "LAB_RUNTIME_TABLE_NORTH",
      "LAB_RUNTIME_TABLE_NORTH_MACRO_DISTRIBUTOR",
      "RUNTIME_TABLE",
      "DexterRuntimeTable",
      "HEARTH_NORTH_COMMAND_RUNTIME_TABLE",
      "HEARTH_NORTH_COMMAND_TABLE",
      "HEARTH_NORTH_MACRO_MICRO_TIMETABLE_SESSION",
      "DEXTER_LAB.runtimeTable",
      "DEXTER_LAB.cardinalRuntimeTableNorth",
      "DEXTER_LAB.northMacroDistributor"
    ]);

    const northReceipt =
      readReceipt(northApi) ||
      firstGlobal([
        "HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT",
        "HEARTH_NORTH_CYCLICAL_CHECKPOINT_RECEIPT",
        "LAB_RUNTIME_TABLE_NORTH_TRANSMISSION_RECEIPT",
        "LAB_RUNTIME_TABLE_NORTH_MACRO_DISTRIBUTOR_RECEIPT"
      ]) ||
      {};

    const activeGateSource =
      supplied.activeGateId ||
      supplied.activeStageId ||
      supplied.activeFibonacci ||
      northReceipt.activeGateId ||
      northReceipt.activeStageId ||
      northReceipt.activeFibonacci ||
      northReceipt.activeGear ||
      datasetValue("activeGateId", "") ||
      datasetValue("activeStageId", "") ||
      datasetValue("activeFibonacci", "");

    const checkpoint = checkpointFromValue(activeGateSource);

    const cycleValue =
      supplied.cycle ||
      supplied.activeCycle ||
      supplied.cycleId ||
      northReceipt.cycle ||
      northReceipt.activeCycle ||
      northReceipt.cycleId ||
      datasetValue("activeCycle", "") ||
      datasetValue("cycle", "");

    const cycle = detectCycleFromValue(cycleValue, supplied, northReceipt);

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      northRuntimeTableObserved: Boolean(northApi || northReceipt.contract),
      northContract: safeString(northReceipt.contract || northApi && northApi.contract || ""),
      northReceipt: safeString(northReceipt.receipt || northApi && northApi.receipt || ""),
      activeGateId: safeString(activeGateSource),
      activeCheckpointId: checkpoint ? checkpoint.id : safeString(activeGateSource),
      activeFibonacci: checkpoint ? checkpoint.fibonacci : safeString(activeGateSource),
      activeRank: checkpoint ? checkpoint.rank : checkpointRank(activeGateSource),
      activeCycle: cycle,
      cycleOneLawActive: true,
      cycleTwoLawActive: true,
      canvasCycleOneBlocked: true,
      canvasCycleTwoReleaseSupported: true,
      southReturnsToNorthInCycleOne: true,
      southPrecedesWestInCycleTwo: true,
      f21NorthLatchOnly: true,
      completionLatchedByNorth: Boolean(
        safeBool(supplied.completionLatchedByNorth, false) ||
        safeBool(northReceipt.completionLatched, false) ||
        safeBool(northReceipt.finalCompletionLatched, false)
      ),
      downstreamReleaseAuthorized: Boolean(
        safeBool(supplied.downstreamReleaseAuthorized, false) ||
        safeBool(northReceipt.downstreamReleaseAuthorized, false)
      ),
      readAt: nowIso()
    };

    state.lastNorthContext = clonePlain(packet);
    return packet;
  }

  function detectCycleFromValue(value = "", supplied = {}, northReceipt = {}) {
    const text = safeString(value).toUpperCase();

    if (text.includes("2") || text.includes("CYCLE_2") || text.includes("SECOND")) return CYCLES.CYCLE_2;
    if (text.includes("1") || text.includes("CYCLE_1") || text.includes("FIRST")) return CYCLES.CYCLE_1;

    if (
      safeBool(supplied.cycleTwoActive, false) ||
      safeBool(northReceipt.cycleTwoActive, false) ||
      safeBool(supplied.southPrecedesWest, false) ||
      safeBool(supplied.releaseToCanvas, false) ||
      safeBool(supplied.canvasReleaseRequested, false)
    ) {
      return CYCLES.CYCLE_2;
    }

    if (
      safeBool(supplied.cycleOneActive, false) ||
      safeBool(northReceipt.cycleOneActive, false) ||
      safeBool(supplied.southReturnsToNorth, false)
    ) {
      return CYCLES.CYCLE_1;
    }

    return CYCLES.CYCLE_1;
  }

  function detectCycle(packet = {}, context = {}) {
    const normalized = normalizeEvent(packet);
    const northContext = readNorthCycleContext(context);
    const source = detectPacketSource(normalized, context);
    const destination = detectPacketDestination(normalized, context);

    if (
      safeBool(normalized.cycleTwoActive, false) ||
      safeBool(context.cycleTwoActive, false) ||
      safeBool(normalized.releaseToCanvas, false) ||
      safeBool(normalized.canvasReleaseRequested, false) ||
      destination === CARDINALS.CANVAS ||
      (source === CARDINALS.SOUTH && destination === CARDINALS.WEST)
    ) {
      return CYCLES.CYCLE_2;
    }

    if (
      safeBool(normalized.cycleOneActive, false) ||
      safeBool(context.cycleOneActive, false) ||
      (source === CARDINALS.SOUTH && destination === CARDINALS.NORTH) ||
      (source === CARDINALS.WEST && destination === CARDINALS.SOUTH)
    ) {
      return CYCLES.CYCLE_1;
    }

    return northContext.activeCycle || CYCLES.CYCLE_1;
  }

  function assessActiveGear(snapshotInput = {}, context = {}) {
    const snapshot = normalizeSnapshot(snapshotInput, context);
    const northContext = readNorthCycleContext(context);
    const checkpointId = checkpointIdFromContext({ ...context, event: snapshot });
    const activeCheckpointId = activeCheckpointIdFromContext(context, northContext) || checkpointId;
    const checkpoint = CHECKPOINT_BY_ID[checkpointId] || checkpointFromValue(checkpointId);
    const active = CHECKPOINT_BY_ID[activeCheckpointId] || checkpointFromValue(activeCheckpointId) || checkpoint || null;

    const requestedRank = checkpoint ? checkpoint.rank : 0;
    const activeRank = active ? active.rank : 0;
    const rankDelta = requestedRank - activeRank;

    return {
      cycleAwareWestAuthority: true,
      activeGearGapAssessment: true,
      oneActiveGearAtATime: true,
      eventName: eventNameFromContext({ event: snapshot }),
      checkpointId: checkpoint ? checkpoint.id : safeString(checkpointId),
      activeCheckpointId: active ? active.id : safeString(activeCheckpointId),
      checkpointRank: requestedRank,
      activeRank,
      checkpointFibonacci: checkpoint ? checkpoint.fibonacci : "",
      activeFibonacci: active ? active.fibonacci : "",
      checkpointOwner: checkpoint ? checkpoint.owner : "",
      activeOwner: active ? active.owner : "",
      rankDelta,
      sameGear: Boolean(checkpoint && active && checkpoint.id === active.id),
      futureGear: Boolean(checkpoint && active && requestedRank > activeRank),
      pastGear: Boolean(checkpoint && active && requestedRank < activeRank),
      unknownGear: Boolean(!checkpoint),
      snapshot: clonePlain(snapshot)
    };
  }

  function fieldPresent(snapshot, key) {
    return snapshot && Object.prototype.hasOwnProperty.call(snapshot, key);
  }

  function assessStructuralCarrier(snapshot = {}, context = {}) {
    const active = assessActiveGear(snapshot, context);
    const failures = [];
    const heldUnknown = [];

    function requireWhen(key, defaultValue, requireForRank = 13) {
      const requiredNow = active.activeRank >= requireForRank;

      if (!fieldPresent(snapshot, key)) {
        if (requiredNow) heldUnknown.push(`${key}=missing`);
        return defaultValue;
      }

      const value = safeBool(snapshot[key], defaultValue);
      if (requiredNow && !value) failures.push(`${key}=false`);
      return value;
    }

    const routeMounted = requireWhen("routeMounted", true, 1);
    const planetCanvasPresent = requireWhen("planetCanvasPresent", true, 13);
    const planetCanvasNonZeroSize = requireWhen("planetCanvasNonZeroSize", true, 13);
    const canvasCarrierMounted = requireWhen("canvasCarrierMounted", true, 13);
    const canvasCarrierHandoffOk = requireWhen("canvasCarrierHandoffOk", true, 13);
    const canvasTargetPresent = requireWhen("canvasTargetPresent", true, 13);
    const sphereContainment = requireWhen("sphereContainment", true, 13);
    const outsideSphereTransparent = requireWhen("outsideSphereTransparent", true, 13);
    const noRectangularTextureSpill = requireWhen("noRectangularTextureSpill", true, 13);

    const canvasCarrierHandoffError = safeString(snapshot.canvasCarrierHandoffError, "");
    if (active.activeRank >= 13 && canvasCarrierHandoffError) {
      failures.push(`canvasCarrierHandoffError=${canvasCarrierHandoffError}`);
    }

    return {
      cycleAwareWestAuthority: true,
      activeCheckpointId: active.activeCheckpointId,
      activeRank: active.activeRank,
      carrierStructurallySafe: failures.length === 0,
      carrierStructurallyKnown: heldUnknown.length === 0,
      heldUnknown,
      failures,
      routeMounted,
      planetCanvasPresent,
      planetCanvasNonZeroSize,
      canvasCarrierMounted,
      canvasCarrierHandoffOk,
      canvasTargetPresent,
      canvasCarrierHandoffError,
      sphereContainment,
      outsideSphereTransparent,
      noRectangularTextureSpill,
      projectionSafe: Boolean(sphereContainment && outsideSphereTransparent && noRectangularTextureSpill),
      structuralCarrierSafeForCanvasRelease: Boolean(
        failures.length === 0 &&
        planetCanvasPresent &&
        planetCanvasNonZeroSize &&
        canvasCarrierMounted &&
        canvasCarrierHandoffOk &&
        canvasTargetPresent
      )
    };
  }

  function assessVisibleContent(snapshot = {}) {
    const samples = safeNumber(snapshot.visibleContentSampleCount, 0);
    const variance = safeNumber(snapshot.visibleContentVarianceScore, 0);
    const classCount = safeNumber(snapshot.visibleContentClassCount, 0);
    const land = safeNumber(snapshot.visibleContentLandSampleCount, 0);
    const water = safeNumber(snapshot.visibleContentWaterSampleCount, 0);
    const other = safeNumber(snapshot.visibleContentOtherSampleCount, 0);
    const carrier = safeNumber(snapshot.visibleContentCarrierSampleCount ?? snapshot.carrierSampleCount, 0);
    const content = land + water + other;

    const renderedBase = Boolean(
      safeBool(snapshot.canvasReady, false) ||
      (
        safeBool(snapshot.firstFrameDetected, false) &&
        safeBool(snapshot.imageRendered, false)
      )
    );

    const visibleContentProof = safeBool(snapshot.visibleContentProof, false);
    const visibleContentStrictProof = safeBool(snapshot.visibleContentStrictProof, false);
    const visiblePlanetProofValid = safeBool(snapshot.visiblePlanetProofValid, false);
    const nonblankPlanetVisible = safeBool(snapshot.nonblankPlanetVisible, false);
    const visiblePlanetAvailable = safeBool(snapshot.visiblePlanetAvailable, false);
    const visibleContentHardFail = safeBool(snapshot.visibleContentHardFail, false);
    const visibleContentSoftGap = safeBool(snapshot.visibleContentSoftGap, false);
    const carrierOnlyDetected = safeBool(snapshot.carrierOnlyDetected, false);

    const strongSurfaceSignal = Boolean(
      renderedBase &&
      !visibleContentHardFail &&
      (
        visiblePlanetProofValid ||
        visibleContentStrictProof ||
        (nonblankPlanetVisible && classCount >= 2 && content >= 12 && variance >= 4)
      )
    );

    const degradedForwardAvailable = Boolean(
      !strongSurfaceSignal &&
      !visibleContentHardFail &&
      renderedBase &&
      (
        visibleContentProof ||
        visibleContentSoftGap ||
        (nonblankPlanetVisible && (classCount >= 1 || content >= 6 || variance >= 2))
      )
    );

    return {
      fullPass: strongSurfaceSignal,
      degradedForwardAvailable,
      renderedBase,
      visibleContentProof,
      visibleContentStrictProof,
      visiblePlanetProofValid,
      nonblankPlanetVisible,
      visiblePlanetAvailable,
      visibleContentHardFail,
      visibleContentSoftGap,
      carrierOnlyDetected,
      samples,
      variance,
      classCount,
      land,
      water,
      other,
      carrier,
      content,
      firstFailedCoordinate: strongSurfaceSignal
        ? "NONE_VISIBLE_CONTENT_FULL_PASS"
        : degradedForwardAvailable
          ? "DEGRADED_VISIBLE_CONTENT_FORWARD_AVAILABLE"
          : visibleContentHardFail
            ? "VISIBLE_CONTENT_HARD_FAIL"
            : "WAITING_VISIBLE_CONTENT_PROOF"
    };
  }

  function assessInspectMode(snapshot = {}) {
    const inspectModeAvailable = safeBool(snapshot.inspectModeAvailable, false);
    const inspectPlanetControlAvailable = safeBool(snapshot.inspectPlanetControlAvailable, false);
    const diagnosticCanLeavePlanetFrame = safeBool(snapshot.diagnosticCanLeavePlanetFrame, false);
    const diagnosticDockRestorable = safeBool(snapshot.diagnosticDockRestorable, false);
    const showDiagnosticTabVisibleWhenHidden = safeBool(snapshot.showDiagnosticTabVisibleWhenHidden, false);
    const copyDiagnosticPreserved = safeBool(snapshot.copyDiagnosticPreserved, false);
    const receiptToggleReady = safeBool(snapshot.receiptToggleReady, false);
    const buttonsReachable = safeBool(snapshot.buttonsReachable, false);
    const receiptOverlayIndependent = safeBool(snapshot.receiptOverlayIndependent, true);

    const fullPass = Boolean(
      inspectModeAvailable &&
      inspectPlanetControlAvailable &&
      diagnosticCanLeavePlanetFrame &&
      diagnosticDockRestorable &&
      showDiagnosticTabVisibleWhenHidden &&
      copyDiagnosticPreserved &&
      receiptToggleReady &&
      buttonsReachable &&
      receiptOverlayIndependent
    );

    const degradedForwardAvailable = Boolean(
      !fullPass &&
      copyDiagnosticPreserved &&
      receiptToggleReady &&
      diagnosticDockRestorable
    );

    return {
      fullPass,
      degradedForwardAvailable,
      inspectModeAvailable,
      inspectPlanetControlAvailable,
      diagnosticCanLeavePlanetFrame,
      diagnosticDockRestorable,
      showDiagnosticTabVisibleWhenHidden,
      copyDiagnosticPreserved,
      receiptToggleReady,
      buttonsReachable,
      receiptOverlayIndependent,
      firstFailedCoordinate: fullPass
        ? "NONE_INSPECT_MODE_FULL_PASS"
        : degradedForwardAvailable
          ? "DEGRADED_INSPECT_MODE_RECEIPT_FALLBACK_AVAILABLE"
          : !inspectModeAvailable
            ? "WAITING_INSPECT_MODE_AVAILABLE"
            : !diagnosticCanLeavePlanetFrame
              ? "WAITING_DIAGNOSTIC_CAN_LEAVE_PLANET_FRAME"
              : "WAITING_INSPECT_GATE"
    };
  }

  function evaluateNewsAlignment(packet = {}, context = {}) {
    const normalized = normalizeEvent(packet);
    const cycle = detectCycle(normalized, context);
    const source = detectPacketSource(normalized, context);
    const destination = detectPacketDestination(normalized, context);

    const northReady = Boolean(
      safeBool(normalized.northGateReady, false) ||
      safeBool(context.northGateReady, false) ||
      state.lastNorthContext && state.lastNorthContext.northRuntimeTableObserved
    );

    const eastReady = Boolean(
      safeBool(normalized.eastGateReady, false) ||
      safeBool(normalized.eastGateAlignmentAccepted, false) ||
      safeBool(context.eastGateReady, false) ||
      source === CARDINALS.EAST
    );

    const southReady = Boolean(
      safeBool(normalized.southGateReady, false) ||
      safeBool(normalized.southSpreadAccepted, false) ||
      safeBool(normalized.southOutputReady, false) ||
      source === CARDINALS.SOUTH
    );

    const westAuditing = Boolean(source === CARDINALS.WEST || destination === CARDINALS.WEST || true);

    const canvasPendingRelease = Boolean(destination === CARDINALS.CANVAS || safeBool(normalized.canvasReleaseRequested, false));

    let expectedPosition = "";
    let passed = false;
    let degraded = false;
    let blocked = false;
    let firstNewsGap = "NONE";

    if (cycle === CYCLES.CYCLE_1) {
      expectedPosition = "NORTH_EAST_WEST_SOUTH_NORTH";
      passed = Boolean(northReady && eastReady && westAuditing && destination !== CARDINALS.CANVAS);
      degraded = Boolean(!passed && northReady && eastReady && westAuditing);
      blocked = destination === CARDINALS.CANVAS;
      firstNewsGap = blocked
        ? "CANVAS_NOT_AUTHORIZED_IN_CYCLE_ONE"
        : passed
          ? "NONE_NEWS_CYCLE_ONE_ALIGNED"
          : !northReady
            ? "WAITING_NEWS_NORTH"
            : !eastReady
              ? "WAITING_NEWS_EAST"
              : "WAITING_NEWS_CYCLE_ONE_ALIGNMENT";
    } else if (cycle === CYCLES.CYCLE_2) {
      expectedPosition = "NORTH_EAST_SOUTH_WEST_CANVAS";
      passed = Boolean(northReady && eastReady && southReady && westAuditing);
      degraded = Boolean(!passed && northReady && (southReady || eastReady) && westAuditing);
      blocked = false;
      firstNewsGap = passed
        ? "NONE_NEWS_CYCLE_TWO_ALIGNED"
        : !northReady
          ? "WAITING_NEWS_NORTH"
          : !eastReady
            ? "WAITING_NEWS_EAST"
            : !southReady
              ? "WAITING_NEWS_SOUTH"
              : "WAITING_NEWS_CYCLE_TWO_ALIGNMENT";
    } else {
      expectedPosition = "UNKNOWN";
      passed = false;
      degraded = false;
      blocked = false;
      firstNewsGap = "WAITING_CYCLE_DETECTION";
    }

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      newsAlignmentAuditActive: true,
      newsAlignmentPresent: true,
      cycle,
      source,
      destination,
      expectedPosition,
      northReady,
      eastReady,
      southReady,
      westAuditing,
      canvasPendingRelease,
      newsGatePassed: passed,
      newsGateDegraded: degraded,
      newsGateBlocked: blocked,
      firstNewsGap,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function evaluateFibonacciSynchronization(packet = {}, context = {}) {
    const normalized = normalizeEvent(packet);
    const northContext = readNorthCycleContext(context);
    const checkpointId = checkpointIdFromContext({ ...context, event: normalized });
    const activeCheckpointId = activeCheckpointIdFromContext(context, northContext) || checkpointId;

    const checkpoint = CHECKPOINT_BY_ID[checkpointId] || checkpointFromValue(checkpointId);
    const active = CHECKPOINT_BY_ID[activeCheckpointId] || checkpointFromValue(activeCheckpointId) || checkpoint;

    const expectedFibonacci = active ? active.fibonacci : "";
    const activeFibonacci = checkpoint ? checkpoint.fibonacci : safeString(normalized.activeFibonacci || normalized.fibonacci || "");

    const orderDelta = checkpoint && active ? checkpoint.rank - active.rank : 0;
    const orderValid = Boolean(checkpoint && active && orderDelta === 0);
    const futureDrift = Boolean(checkpoint && active && orderDelta > 0);
    const priorDrift = Boolean(checkpoint && active && orderDelta < 0);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      fibonacciSynchronizationAuditActive: true,
      fibonacciSynchronizationPresent: Boolean(checkpoint || activeFibonacci),
      activeFibonacci,
      expectedFibonacci,
      checkpointId: checkpoint ? checkpoint.id : safeString(checkpointId),
      activeCheckpointId: active ? active.id : safeString(activeCheckpointId),
      checkpointRank: checkpoint ? checkpoint.rank : 0,
      activeRank: active ? active.rank : 0,
      fibonacciOrderValid: orderValid,
      fibonacciCycleDrift: futureDrift ? "FUTURE" : priorDrift ? "PRIOR" : orderValid ? "NONE" : "UNKNOWN",
      firstFibonacciGap: orderValid
        ? "NONE_FIBONACCI_SYNCHRONIZED"
        : futureDrift
          ? "FUTURE_FIBONACCI_HELD"
          : priorDrift
            ? "PRIOR_FIBONACCI_ARCHIVE"
            : "WAITING_FIBONACCI_CONTEXT",
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function evaluateNewsGateState(snapshot = {}) {
    const carrier = assessStructuralCarrier(snapshot, {
      checkpointId: CHECKPOINT_IDS.F21,
      activeCheckpointId: CHECKPOINT_IDS.F21
    });
    const visible = assessVisibleContent(snapshot);
    const inspect = assessInspectMode(snapshot);

    const northGateReady = Boolean(
      carrier.carrierStructurallySafe &&
      safeBool(snapshot.canvasReady, false) &&
      safeBool(snapshot.atlasBuildComplete, false) &&
      safeBool(snapshot.textureComposeComplete, false) &&
      visible.fullPass
    );

    const northGateDegradedReady = Boolean(
      carrier.carrierStructurallySafe &&
      safeBool(snapshot.canvasReady, false) &&
      (visible.fullPass || visible.degradedForwardAvailable)
    );

    const eastGateReady = Boolean(
      safeBool(snapshot.eastGateReady, false) ||
      safeBool(snapshot.canvasCarrierRequested, false) ||
      safeBool(snapshot.canvasCarrierHandoffOk, false)
    );

    const southGateReady = Boolean(
      safeBool(snapshot.southGateReady, false) ||
      safeBool(snapshot.imageRendered, false) ||
      safeBool(snapshot.firstFrameDetected, false) ||
      visible.fullPass
    );

    const westGateReady = Boolean(inspect.fullPass || safeBool(snapshot.westAuditPassed, false));
    const westGateDegradedReady = Boolean(westGateReady || inspect.degradedForwardAvailable);

    const newsGatePassedBeforeF21 = Boolean(
      northGateReady &&
      eastGateReady &&
      southGateReady &&
      westGateReady
    );

    const newsGateDegradedBeforeF21 = Boolean(
      northGateDegradedReady &&
      eastGateReady &&
      southGateReady &&
      westGateDegradedReady
    );

    return {
      northGateReady,
      eastGateReady,
      southGateReady,
      westGateReady,
      newsGatePassedBeforeF21,
      northGateDegradedReady,
      westGateDegradedReady,
      southGateDegradedReady: southGateReady || visible.degradedForwardAvailable,
      newsGateDegradedBeforeF21,
      degradedForwardAvailable: newsGateDegradedBeforeF21 && !newsGatePassedBeforeF21,
      structuralCarrierSafe: carrier.carrierStructurallySafe,
      visibleContentFullPass: visible.fullPass,
      visibleContentDegradedForwardAvailable: visible.degradedForwardAvailable,
      inspectModeFullPass: inspect.fullPass,
      inspectModeDegradedForwardAvailable: inspect.degradedForwardAvailable,
      f21NorthLatchOnly: true
    };
  }

  function evidenceForGear(snapshotInput = {}, checkpointId = "") {
    const snapshot = normalizeSnapshot(snapshotInput, {});
    const checkpoint = CHECKPOINT_BY_ID[checkpointId] || checkpointFromValue(checkpointId);

    if (!checkpoint) {
      return {
        evidenceRequired: false,
        complete: false,
        degraded: false,
        missing: ["unknownCheckpoint"],
        values: {}
      };
    }

    if (checkpoint.rank < 13) {
      return {
        evidenceRequired: false,
        complete: true,
        degraded: false,
        missing: [],
        values: { earlyGateAcceptedByRuntimeTable: true }
      };
    }

    if (checkpoint.id === CHECKPOINT_IDS.F13E) {
      const visible = assessVisibleContent(snapshot);
      return {
        evidenceRequired: true,
        complete: visible.fullPass,
        degraded: visible.degradedForwardAvailable,
        missing: visible.fullPass || visible.degradedForwardAvailable ? [] : [visible.firstFailedCoordinate],
        values: visible
      };
    }

    if (checkpoint.id === CHECKPOINT_IDS.F13N) {
      const inspect = assessInspectMode(snapshot);
      return {
        evidenceRequired: true,
        complete: inspect.fullPass,
        degraded: inspect.degradedForwardAvailable,
        missing: inspect.fullPass || inspect.degradedForwardAvailable ? [] : [inspect.firstFailedCoordinate],
        values: inspect
      };
    }

    if (checkpoint.id === CHECKPOINT_IDS.F21) {
      const news = evaluateNewsGateState(snapshot);
      return {
        evidenceRequired: true,
        complete: news.newsGatePassedBeforeF21,
        degraded: news.newsGateDegradedBeforeF21,
        missing: news.newsGatePassedBeforeF21 || news.newsGateDegradedBeforeF21 ? [] : ["NEWS_GATE_INCOMPLETE"],
        values: news
      };
    }

    return {
      evidenceRequired: true,
      complete: true,
      degraded: false,
      missing: [],
      values: { checkpoint: checkpoint.id }
    };
  }

  function isPrematureCompletionEvent(eventOrContext = {}, checkpointId = "") {
    const event = eventOrContext && eventOrContext.event
      ? normalizeEvent(eventOrContext.event)
      : normalizeEvent(eventOrContext);

    const activeCheckpointId = safeString(checkpointId || event.checkpointId || event.id || "");
    const source = detectPacketSource(event, {});
    const destination = detectPacketDestination(event, {});
    const cycle = detectCycle(event, {});

    if (activeCheckpointId === CHECKPOINT_IDS.F21 && source === CARDINALS.NORTH) {
      return false;
    }

    if (safeBool(event.visualPassClaimed, false)) return true;
    if (safeBool(event.readyTextAllowed, false) && activeCheckpointId !== CHECKPOINT_IDS.F21) return true;
    if (safeBool(event.completionLatched, false) && source !== CARDINALS.NORTH) return true;
    if (safeBool(event.finalCompletionLatched, false) && source !== CARDINALS.NORTH) return true;
    if (safeNumber(event.mainDisplayProgress, 0) >= 100 && activeCheckpointId !== CHECKPOINT_IDS.F21) return true;
    if (cycle === CYCLES.CYCLE_1 && destination === CARDINALS.CANVAS) return true;

    return containsFalseCompletionLanguage(event);
  }

  function makeGap(config = {}) {
    const gapClass = config.gapClass || GAP_CLASS.NONE;
    const hardBlock = config.hardBlock === true;
    const canDegradeForward = config.canDegradeForward === true;

    let decision = config.decision || GAP_DECISION.HOLD_ACTIVE;

    if (gapClass === GAP_CLASS.NONE && !config.decision) decision = GAP_DECISION.FULL_PASS;
    if (hardBlock) decision = GAP_DECISION.HARD_BLOCK;
    if (canDegradeForward && !config.decision) decision = GAP_DECISION.DEGRADED_FORWARD;

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      westGapReceipt: "LAB_RUNTIME_TABLE_CARDINAL_WEST_CYCLE_AWARE_GAP_RECEIPT_v1",
      gapAssessed: true,
      westAuthority: true,
      cycleAwareWestAuthority: true,
      admissibilityClutchActive: true,
      oneActiveGearAtATime: true,

      cycle: config.cycle || CYCLES.UNKNOWN,
      source: config.source || CARDINALS.UNKNOWN,
      destination: config.destination || CARDINALS.UNKNOWN,
      gapClass,
      gapSeverity: config.gapSeverity || (hardBlock ? GAP_SEVERITY.HARD_BLOCK : canDegradeForward ? GAP_SEVERITY.DEGRADED : gapClass === GAP_CLASS.NONE ? GAP_SEVERITY.NONE : GAP_SEVERITY.HELD),
      decision,
      hardBlock,
      canDegradeForward,
      forwardAllowed: !hardBlock && (canDegradeForward || gapClass === GAP_CLASS.NONE || decision === GAP_DECISION.ADMIT_TO_SOUTH || decision === GAP_DECISION.RELEASE_TO_CANVAS || decision === GAP_DECISION.RETURN_TO_NORTH),
      shouldArchive: decision === GAP_DECISION.ARCHIVE,

      checkpointId: config.checkpointId || "",
      activeCheckpointId: config.activeCheckpointId || config.checkpointId || "",
      checkpointRank: config.checkpointRank || checkpointRank(config.checkpointId || ""),
      activeRank: config.activeRank || checkpointRank(config.activeCheckpointId || config.checkpointId || ""),
      eventName: config.eventName || "",
      firstFailedCoordinate: config.firstFailedCoordinate || "NONE",
      recommendedNextRenewalTarget: config.recommendedNextRenewalTarget || "none",
      reason: config.reason || "",
      observed: config.observed || "",
      math: config.math || "",
      detail: clonePlain(config.detail || {}),
      probableCause: asArray(config.probableCause),
      nextStrategy: asArray(config.nextStrategy),

      canvasRelease: config.canvasRelease === true,
      returnToNorth: config.returnToNorth === true,
      f21NorthLatchOnly: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function classifyCyclePacket(packet = {}, context = {}) {
    const normalized = normalizeEvent(packet);
    const cycle = detectCycle(normalized, context);
    const source = detectPacketSource(normalized, context);
    const destination = detectPacketDestination(normalized, context);
    const active = assessActiveGear(normalized, context);
    const news = evaluateNewsAlignment(normalized, context);
    const fibonacci = evaluateFibonacciSynchronization(normalized, context);

    const falseCompletion = isPrematureCompletionEvent(normalized, active.activeCheckpointId);

    if (isProgressOnlyEvent(normalized)) {
      return makeGap({
        gapClass: GAP_CLASS.PROGRESS_ONLY_ARCHIVE,
        gapSeverity: GAP_SEVERITY.INFO,
        decision: GAP_DECISION.ARCHIVE,
        cycle,
        source,
        destination,
        checkpointId: active.checkpointId,
        activeCheckpointId: active.activeCheckpointId,
        eventName: active.eventName,
        firstFailedCoordinate: "PROGRESS_ONLY_EVENT_ARCHIVED",
        recommendedNextRenewalTarget: "none",
        reason: "Progress-only packet archived without mutating the cycle.",
        detail: { active, news, fibonacci }
      });
    }

    if (falseCompletion) {
      return makeGap({
        gapClass: GAP_CLASS.FALSE_COMPLETION_BLOCK,
        gapSeverity: GAP_SEVERITY.HARD_BLOCK,
        decision: GAP_DECISION.HARD_BLOCK,
        hardBlock: true,
        cycle,
        source,
        destination,
        checkpointId: active.checkpointId,
        activeCheckpointId: active.activeCheckpointId,
        eventName: active.eventName,
        firstFailedCoordinate: cycle === CYCLES.CYCLE_1 && destination === CARDINALS.CANVAS
          ? "CANVAS_NOT_AUTHORIZED_IN_CYCLE_ONE"
          : "FALSE_COMPLETION_MUTATION_BLOCKED",
        recommendedNextRenewalTarget: FILE_GATES.west,
        reason: "False completion, premature F21, READY, 100%, visual pass, or Cycle 1 Canvas release was blocked.",
        detail: { active, news, fibonacci, normalized }
      });
    }

    if (!news.newsGatePassed && news.newsGateBlocked) {
      return makeGap({
        gapClass: GAP_CLASS.NEWS_ALIGNMENT_HELD,
        gapSeverity: GAP_SEVERITY.HELD,
        decision: GAP_DECISION.HOLD_FOR_CYCLE,
        cycle,
        source,
        destination,
        checkpointId: active.checkpointId,
        activeCheckpointId: active.activeCheckpointId,
        eventName: active.eventName,
        firstFailedCoordinate: news.firstNewsGap,
        recommendedNextRenewalTarget: FILE_GATES.west,
        reason: "NEWS alignment blocked this packet for the current cycle.",
        detail: { active, news, fibonacci }
      });
    }

    if (fibonacci.fibonacciCycleDrift === "FUTURE") {
      return makeGap({
        gapClass: GAP_CLASS.FUTURE_CYCLE_HELD,
        gapSeverity: GAP_SEVERITY.HELD,
        decision: GAP_DECISION.HOLD_FOR_CYCLE,
        cycle,
        source,
        destination,
        checkpointId: active.checkpointId,
        activeCheckpointId: active.activeCheckpointId,
        eventName: active.eventName,
        firstFailedCoordinate: fibonacci.firstFibonacciGap,
        recommendedNextRenewalTarget: FILE_GATES.north,
        reason: "Future Fibonacci packet held until North advances the active gate.",
        detail: { active, news, fibonacci }
      });
    }

    if (fibonacci.fibonacciCycleDrift === "PRIOR") {
      return makeGap({
        gapClass: GAP_CLASS.PRIOR_PACKET_ARCHIVE,
        gapSeverity: GAP_SEVERITY.INFO,
        decision: GAP_DECISION.ARCHIVE,
        cycle,
        source,
        destination,
        checkpointId: active.checkpointId,
        activeCheckpointId: active.activeCheckpointId,
        eventName: active.eventName,
        firstFailedCoordinate: fibonacci.firstFibonacciGap,
        recommendedNextRenewalTarget: "none",
        reason: "Prior Fibonacci packet archived without mutating the cycle.",
        detail: { active, news, fibonacci }
      });
    }

    if (cycle === CYCLES.CYCLE_1) {
      if (destination === CARDINALS.CANVAS || safeBool(normalized.canvasReleaseRequested, false)) {
        return makeGap({
          gapClass: GAP_CLASS.CANVAS_RELEASE_HELD,
          gapSeverity: GAP_SEVERITY.HELD,
          decision: GAP_DECISION.HOLD_FOR_CYCLE,
          cycle,
          source,
          destination,
          checkpointId: active.checkpointId,
          activeCheckpointId: active.activeCheckpointId,
          eventName: active.eventName,
          firstFailedCoordinate: "CANVAS_NOT_AUTHORIZED_IN_CYCLE_ONE",
          recommendedNextRenewalTarget: FILE_GATES.west,
          reason: "Canvas release is reserved for Cycle 2 after South output passes West admissibility.",
          detail: { active, news, fibonacci }
        });
      }

      if (source === CARDINALS.SOUTH || destination === CARDINALS.NORTH || safeBool(normalized.southReturnToNorth, false)) {
        return makeGap({
          gapClass: GAP_CLASS.NONE,
          gapSeverity: GAP_SEVERITY.NONE,
          decision: GAP_DECISION.RETURN_TO_NORTH,
          cycle,
          source,
          destination: CARDINALS.NORTH,
          checkpointId: active.checkpointId,
          activeCheckpointId: active.activeCheckpointId,
          eventName: active.eventName,
          firstFailedCoordinate: "NONE_CYCLE_ONE_SOUTH_RETURN_TO_NORTH",
          recommendedNextRenewalTarget: FILE_GATES.north,
          reason: "Cycle 1 South packet returns to North.",
          returnToNorth: true,
          detail: { active, news, fibonacci }
        });
      }

      return makeGap({
        gapClass: news.newsGatePassed || news.newsGateDegraded ? GAP_CLASS.NONE : GAP_CLASS.NEWS_ALIGNMENT_HELD,
        gapSeverity: news.newsGatePassed ? GAP_SEVERITY.NONE : news.newsGateDegraded ? GAP_SEVERITY.DEGRADED : GAP_SEVERITY.HELD,
        decision: news.newsGatePassed ? GAP_DECISION.ADMIT_TO_SOUTH : news.newsGateDegraded ? GAP_DECISION.DEGRADED_FORWARD : GAP_DECISION.HOLD_ACTIVE,
        canDegradeForward: news.newsGateDegraded && !news.newsGatePassed,
        cycle,
        source,
        destination: CARDINALS.SOUTH,
        checkpointId: active.checkpointId,
        activeCheckpointId: active.activeCheckpointId,
        eventName: active.eventName,
        firstFailedCoordinate: news.newsGatePassed ? "NONE_CYCLE_ONE_ADMIT_TO_SOUTH" : news.firstNewsGap,
        recommendedNextRenewalTarget: news.newsGatePassed ? FILE_GATES.south : FILE_GATES.west,
        reason: news.newsGatePassed
          ? "Cycle 1 packet admitted to South."
          : "Cycle 1 packet held or degraded while NEWS alignment settles.",
        detail: { active, news, fibonacci }
      });
    }

    if (cycle === CYCLES.CYCLE_2) {
      const carrier = assessStructuralCarrier(normalized, context);
      const visible = assessVisibleContent(normalized);
      const inspect = assessInspectMode(normalized);

      if (active.checkpointId === CHECKPOINT_IDS.F21 || safeBool(normalized.f21EligibleForNorth, false) || safeBool(normalized.f21EligibilitySubmittedToNorth, false)) {
        return makeGap({
          gapClass: GAP_CLASS.F21_NORTH_REVIEW_REQUIRED,
          gapSeverity: GAP_SEVERITY.HELD,
          decision: GAP_DECISION.RETURN_TO_NORTH_FOR_F21,
          cycle,
          source,
          destination: CARDINALS.NORTH,
          checkpointId: active.checkpointId,
          activeCheckpointId: active.activeCheckpointId,
          eventName: active.eventName,
          firstFailedCoordinate: "F21_RETURN_TO_NORTH_FOR_LATCH",
          recommendedNextRenewalTarget: FILE_GATES.north,
          reason: "F21 eligibility returned to North. West audits eligibility but does not latch.",
          returnToNorth: true,
          detail: { active, news, fibonacci, carrier, visible, inspect }
        });
      }

      if (source !== CARDINALS.SOUTH && destination === CARDINALS.CANVAS) {
        return makeGap({
          gapClass: GAP_CLASS.CANVAS_RELEASE_HELD,
          gapSeverity: GAP_SEVERITY.HELD,
          decision: GAP_DECISION.HOLD_FOR_CYCLE,
          cycle,
          source,
          destination,
          checkpointId: active.checkpointId,
          activeCheckpointId: active.activeCheckpointId,
          eventName: active.eventName,
          firstFailedCoordinate: "CANVAS_RELEASE_REQUIRES_SOUTH_SOURCE_IN_CYCLE_TWO",
          recommendedNextRenewalTarget: FILE_GATES.south,
          reason: "Cycle 2 Canvas release requires South output before West releases to Canvas.",
          detail: { active, news, fibonacci, carrier, visible, inspect }
        });
      }

      if (!carrier.structuralCarrierSafeForCanvasRelease && destination === CARDINALS.CANVAS) {
        return makeGap({
          gapClass: carrier.carrierStructurallySafe ? GAP_CLASS.CANVAS_RELEASE_HELD : GAP_CLASS.STRUCTURAL_BLOCK,
          gapSeverity: carrier.carrierStructurallySafe ? GAP_SEVERITY.HELD : GAP_SEVERITY.HARD_BLOCK,
          decision: carrier.carrierStructurallySafe ? GAP_DECISION.HOLD_ACTIVE : GAP_DECISION.HARD_BLOCK,
          hardBlock: !carrier.carrierStructurallySafe,
          cycle,
          source,
          destination,
          checkpointId: active.checkpointId,
          activeCheckpointId: active.activeCheckpointId,
          eventName: active.eventName,
          firstFailedCoordinate: carrier.carrierStructurallySafe ? "WAITING_CANVAS_RELEASE_TARGET" : "STRUCTURAL_CARRIER_UNSAFE_FOR_CANVAS",
          recommendedNextRenewalTarget: FILE_GATES.canvas,
          reason: carrier.carrierStructurallySafe
            ? "Canvas release target is not fully present yet."
            : "Structural carrier is unsafe for Canvas release.",
          detail: { active, news, fibonacci, carrier, visible, inspect }
        });
      }

      if (destination === CARDINALS.CANVAS || safeBool(normalized.canvasReleaseRequested, false) || safeBool(normalized.releaseToCanvas, false)) {
        return makeGap({
          gapClass: GAP_CLASS.NONE,
          gapSeverity: GAP_SEVERITY.NONE,
          decision: GAP_DECISION.RELEASE_TO_CANVAS,
          cycle,
          source,
          destination: CARDINALS.CANVAS,
          checkpointId: active.checkpointId,
          activeCheckpointId: active.activeCheckpointId,
          eventName: active.eventName,
          firstFailedCoordinate: "NONE_CYCLE_TWO_CANVAS_RELEASE_AUTHORIZED_BY_WEST",
          recommendedNextRenewalTarget: FILE_GATES.canvas,
          reason: "Cycle 2 South output passed West admissibility and may release to Canvas.",
          canvasRelease: true,
          detail: { active, news, fibonacci, carrier, visible, inspect }
        });
      }

      return makeGap({
        gapClass: GAP_CLASS.ACTIVE_GATE_WAIT,
        gapSeverity: GAP_SEVERITY.HELD,
        decision: GAP_DECISION.HOLD_ACTIVE,
        cycle,
        source,
        destination,
        checkpointId: active.checkpointId,
        activeCheckpointId: active.activeCheckpointId,
        eventName: active.eventName,
        firstFailedCoordinate: "WAITING_CYCLE_TWO_CANVAS_RELEASE_PACKET",
        recommendedNextRenewalTarget: FILE_GATES.south,
        reason: "Cycle 2 is active; West is waiting for South output release packet.",
        detail: { active, news, fibonacci, carrier, visible, inspect }
      });
    }

    return makeGap({
      gapClass: GAP_CLASS.UNKNOWN_ARCHIVE,
      gapSeverity: GAP_SEVERITY.INFO,
      decision: GAP_DECISION.ARCHIVE,
      cycle,
      source,
      destination,
      checkpointId: active.checkpointId,
      activeCheckpointId: active.activeCheckpointId,
      eventName: active.eventName,
      firstFailedCoordinate: "UNKNOWN_CYCLE_PACKET_ARCHIVED",
      recommendedNextRenewalTarget: "none",
      reason: "Unknown cycle packet archived without mutation.",
      detail: { active, news, fibonacci }
    });
  }

  function classifyWestAdmissibility(packet = {}, context = {}) {
    const gap = classifyCyclePacket(packet, context);

    const admissibility = {
      contract: CONTRACT,
      receipt: RECEIPT,
      westAdmissibilityReceipt: "LAB_RUNTIME_TABLE_CARDINAL_WEST_ADMISSIBILITY_RECEIPT_v1",
      cycleAwareWestAuthority: true,
      admissibilityClutchActive: true,
      packetAdmissible: [
        GAP_DECISION.ADMIT_TO_SOUTH,
        GAP_DECISION.RELEASE_TO_CANVAS,
        GAP_DECISION.RETURN_TO_NORTH,
        GAP_DECISION.RETURN_TO_NORTH_FOR_F21,
        GAP_DECISION.FULL_PASS,
        GAP_DECISION.DEGRADED_FORWARD
      ].includes(gap.decision),
      decision: gap.decision,
      gap,
      cycle: gap.cycle,
      source: gap.source,
      destination: gap.destination,
      canvasReleaseAuthorized: gap.decision === GAP_DECISION.RELEASE_TO_CANVAS,
      returnToNorthRequired: gap.decision === GAP_DECISION.RETURN_TO_NORTH || gap.decision === GAP_DECISION.RETURN_TO_NORTH_FOR_F21,
      southAdmitted: gap.decision === GAP_DECISION.ADMIT_TO_SOUTH,
      degradedForward: gap.decision === GAP_DECISION.DEGRADED_FORWARD,
      hardBlock: gap.hardBlock,
      f21NorthLatchOnly: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };

    state.classifyCount += 1;
    if (gap.cycle === CYCLES.CYCLE_1) state.cycleOneCount += 1;
    if (gap.cycle === CYCLES.CYCLE_2) state.cycleTwoCount += 1;
    if (admissibility.canvasReleaseAuthorized) state.canvasReleaseCount += 1;
    if (admissibility.returnToNorthRequired) state.returnNorthCount += 1;
    if (gap.gapClass === GAP_CLASS.FALSE_COMPLETION_BLOCK) state.falseCompletionBlockCount += 1;
    if (admissibility.degradedForward) state.degradedForwardCount += 1;

    state.lastAdmissibility = clonePlain(admissibility);
    state.updatedAt = nowIso();

    record("WEST_ADMISSIBILITY_CLASSIFIED", {
      cycle: admissibility.cycle,
      decision: admissibility.decision,
      gapClass: gap.gapClass,
      firstFailedCoordinate: gap.firstFailedCoordinate
    });

    publishAll();
    return admissibility;
  }

  function classifyTransmissionGap(snapshotInput = {}, context = {}) {
    return classifyCyclePacket(snapshotInput, context);
  }

  function classifyGap(snapshotInput = {}, context = {}) {
    return classifyTransmissionGap(snapshotInput, context);
  }

  function createWestCycleReceipt(packet = {}, context = {}) {
    const normalized = normalizeEvent(packet);
    const admissibility = classifyWestAdmissibility(normalized, context);
    const news = evaluateNewsAlignment(normalized, context);
    const fibonacci = evaluateFibonacciSynchronization(normalized, context);
    const carrier = assessStructuralCarrier(normalized, context);
    const visible = assessVisibleContent(normalized);
    const inspect = assessInspectMode(normalized);

    const receipt = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      destinationFile: FILE,
      westCycleReceipt: "LAB_RUNTIME_TABLE_CARDINAL_WEST_CYCLE_RECEIPT_v1",

      cycleAwareWestAuthority: true,
      cycleOneLawActive: true,
      cycleTwoLawActive: true,
      canvasCycleOneBlocked: true,
      canvasCycleTwoReleaseSupported: true,
      southReturnsToNorthInCycleOne: true,
      southPrecedesWestInCycleTwo: true,
      f21NorthLatchOnly: true,

      admissibility,
      newsAlignment: news,
      fibonacciSynchronization: fibonacci,
      structuralCarrier: carrier,
      visibleContent: visible,
      inspectMode: inspect,

      firstFailedCoordinate: admissibility.gap.firstFailedCoordinate,
      recommendedNextRenewalTarget: admissibility.gap.recommendedNextRenewalTarget,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };

    state.lastCyclePacket = clonePlain(receipt);
    state.updatedAt = receipt.updatedAt;
    publishAll();

    return receipt;
  }

  function createGapReceipt(snapshot = {}, context = {}) {
    const receipt = createWestCycleReceipt(snapshot, context);
    state.lastGapReceipt = clonePlain(receipt);
    return {
      ...receipt,
      westGapReceipt: "LAB_RUNTIME_TABLE_CARDINAL_WEST_CYCLE_AWARE_GAP_RECEIPT_v1",
      gap: receipt.admissibility.gap
    };
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      destinationFile: FILE,
      status: "active",
      role: state.role,

      cycleAwareWestAuthority: true,
      westAuthority: true,
      westLoaded: true,
      westFallbackUsed: false,

      fileGates: clonePlain(FILE_GATES),
      cyclePaths: clonePlain(CYCLE_PATHS),

      cycleOneLawActive: true,
      cycleTwoLawActive: true,
      canvasCycleOneBlocked: true,
      canvasCycleTwoReleaseSupported: true,
      southReturnsToNorthInCycleOne: true,
      southPrecedesWestInCycleTwo: true,
      f21NorthLatchOnly: true,
      newsAlignmentAuditActive: true,
      fibonacciSynchronizationAuditActive: true,
      falseCompletionFirewallActive: true,

      classifyCount: state.classifyCount,
      cycleOneCount: state.cycleOneCount,
      cycleTwoCount: state.cycleTwoCount,
      canvasReleaseCount: state.canvasReleaseCount,
      returnNorthCount: state.returnNorthCount,
      falseCompletionBlockCount: state.falseCompletionBlockCount,
      degradedForwardCount: state.degradedForwardCount,

      gapClasses: Object.values(GAP_CLASS),
      gapSeverities: Object.values(GAP_SEVERITY),
      gapDecisions: Object.values(GAP_DECISION),

      checkpointSequence: CHECKPOINT_SEQUENCE.map((item) => ({
        id: item.id,
        rank: item.rank,
        fibonacci: item.fibonacci,
        owner: item.owner,
        label: item.label
      })),

      exports: [
        "classifyGap",
        "classifyTransmissionGap",
        "classifyCyclePacket",
        "classifyWestAdmissibility",
        "createGapReceipt",
        "createWestCycleReceipt",
        "assessActiveGear",
        "evidenceForGear",
        "assessStructuralCarrier",
        "assessVisibleContent",
        "assessInspectMode",
        "evaluateNewsGateState",
        "evaluateNewsAlignment",
        "evaluateFibonacciSynchronization",
        "detectCycle",
        "readNorthCycleContext",
        "getReceipt",
        "getReceiptText"
      ],

      governingLaw: [
        "Cycle 1 route is North to East to West to South to North.",
        "Cycle 2 route is North to East to South to West to Canvas.",
        "Canvas release is blocked in Cycle 1.",
        "South returns to North in Cycle 1.",
        "South precedes West in Cycle 2.",
        "West releases to Canvas only in Cycle 2 after South output passes admissibility.",
        "F21 latch remains North-owned.",
        "West audits NEWS alignment and Fibonacci synchronization."
      ],

      lastNorthContext: clonePlain(state.lastNorthContext),
      lastCyclePacket: clonePlain(state.lastCyclePacket),
      lastAdmissibility: clonePlain(state.lastAdmissibility),
      lastGapReceipt: clonePlain(state.lastGapReceipt),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      startedAt: state.startedAt,
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

    const last = r.lastAdmissibility
      ? [
          `lastDecision=${r.lastAdmissibility.decision}`,
          `lastCycle=${r.lastAdmissibility.cycle}`,
          `lastGapClass=${r.lastAdmissibility.gap ? r.lastAdmissibility.gap.gapClass : ""}`,
          `lastFirstFailedCoordinate=${r.lastAdmissibility.gap ? r.lastAdmissibility.gap.firstFailedCoordinate : ""}`,
          `lastRecommendedNextRenewalTarget=${r.lastAdmissibility.gap ? r.lastAdmissibility.gap.recommendedNextRenewalTarget : ""}`
        ].join("\n")
      : "lastDecision=\nlastCycle=\nlastGapClass=\nlastFirstFailedCoordinate=\nlastRecommendedNextRenewalTarget=";

    return [
      "LAB_RUNTIME_TABLE_CARDINAL_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `destinationFile=${r.destinationFile}`,
      `status=${r.status}`,
      `role=${r.role}`,
      "",
      `cycleAwareWestAuthority=${r.cycleAwareWestAuthority}`,
      `cycleOneLawActive=${r.cycleOneLawActive}`,
      `cycleTwoLawActive=${r.cycleTwoLawActive}`,
      `canvasCycleOneBlocked=${r.canvasCycleOneBlocked}`,
      `canvasCycleTwoReleaseSupported=${r.canvasCycleTwoReleaseSupported}`,
      `southReturnsToNorthInCycleOne=${r.southReturnsToNorthInCycleOne}`,
      `southPrecedesWestInCycleTwo=${r.southPrecedesWestInCycleTwo}`,
      `f21NorthLatchOnly=${r.f21NorthLatchOnly}`,
      `newsAlignmentAuditActive=${r.newsAlignmentAuditActive}`,
      `fibonacciSynchronizationAuditActive=${r.fibonacciSynchronizationAuditActive}`,
      `falseCompletionFirewallActive=${r.falseCompletionFirewallActive}`,
      "",
      `classifyCount=${r.classifyCount}`,
      `cycleOneCount=${r.cycleOneCount}`,
      `cycleTwoCount=${r.cycleTwoCount}`,
      `canvasReleaseCount=${r.canvasReleaseCount}`,
      `returnNorthCount=${r.returnNorthCount}`,
      `falseCompletionBlockCount=${r.falseCompletionBlockCount}`,
      `degradedForwardCount=${r.degradedForwardCount}`,
      "",
      last,
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

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,

    FILE_GATES,
    CYCLES,
    CYCLE_PATHS,
    CARDINALS,
    GAP_CLASS,
    GAP_SEVERITY,
    GAP_DECISION,
    CHECKPOINT_IDS,
    CHECKPOINT_SEQUENCE,
    PROGRESS_ONLY_EVENTS,

    classifyGap,
    classifyTransmissionGap,
    classifyCyclePacket,
    classifyWestAdmissibility,
    createGapReceipt,
    createWestCycleReceipt,

    assessActiveGear,
    evidenceForGear,
    assessStructuralCarrier,
    assessVisibleContent,
    assessInspectMode,
    evaluateNewsGateState,
    evaluateNewsAlignment,
    evaluateFibonacciSynchronization,

    detectCycle,
    readNorthCycleContext,
    isProgressOnlyEvent,
    isPrematureCompletionEvent,

    getReceipt,
    getReceiptText,

    cycleAwareWestAuthority: true,
    westAuthority: true,
    westLoaded: true,
    westFallbackUsed: false,
    cycleOneLawActive: true,
    cycleTwoLawActive: true,
    canvasCycleOneBlocked: true,
    canvasCycleTwoReleaseSupported: true,
    southReturnsToNorthInCycleOne: true,
    southPrecedesWestInCycleTwo: true,
    f21NorthLatchOnly: true,
    newsAlignmentAuditActive: true,
    fibonacciSynchronizationAuditActive: true,
    falseCompletionFirewallActive: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  function publishDataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;

    const dataset = doc.documentElement.dataset;

    dataset.labRuntimeTableWestLoaded = "true";
    dataset.labRuntimeTableWestContract = CONTRACT;
    dataset.labRuntimeTableWestReceipt = RECEIPT;
    dataset.labRuntimeTableWestVersion = VERSION;

    dataset.westCycleAwareAdmissibilityClutch = "true";
    dataset.westCycleOneAuditActive = "true";
    dataset.westCycleTwoAuditActive = "true";
    dataset.canvasCycleOneBlocked = "true";
    dataset.canvasCycleTwoReleaseSupported = "true";
    dataset.southReturnsToNorthInCycleOne = "true";
    dataset.southPrecedesWestInCycleTwo = "true";
    dataset.f21NorthLatchOnly = "true";
    dataset.newsAlignmentAuditActive = "true";
    dataset.fibonacciSynchronizationAuditActive = "true";
    dataset.falseCompletionFirewallActive = "true";

    dataset.westClassifyCount = String(state.classifyCount);
    dataset.westCycleOneCount = String(state.cycleOneCount);
    dataset.westCycleTwoCount = String(state.cycleTwoCount);
    dataset.westCanvasReleaseCount = String(state.canvasReleaseCount);
    dataset.westReturnNorthCount = String(state.returnNorthCount);
    dataset.westFalseCompletionBlockCount = String(state.falseCompletionBlockCount);
    dataset.westDegradedForwardCount = String(state.degradedForwardCount);

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function publishAll() {
    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.HEARTH = root.HEARTH || {};

    root.DEXTER_LAB.runtimeTableWest = api;
    root.DEXTER_LAB.cardinalRuntimeTableWest = api;
    root.DEXTER_LAB.gapClassifierWest = api;
    root.DEXTER_LAB.transmissionGapClassifierWest = api;
    root.DEXTER_LAB.cycleAwareAdmissibilityClutchWest = api;

    root.LAB_RUNTIME_TABLE_WEST = api;
    root.RUNTIME_TABLE_WEST = api;
    root.DEXTER_LAB_RUNTIME_TABLE_WEST = api;
    root.LAB_CARDINAL_RUNTIME_TABLE_WEST = api;
    root.LAB_GAP_CLASSIFIER_WEST = api;
    root.LAB_TRANSMISSION_GAP_CLASSIFIER_WEST = api;
    root.LAB_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_WEST = api;

    root.HEARTH.westCycleAwareAdmissibilityClutch = api;
    root.HEARTH_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH = api;

    publishDataset();
  }

  publishAll();

  record("WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_LOADED", {
    file: FILE,
    contract: CONTRACT,
    cycleOneLawActive: true,
    cycleTwoLawActive: true,
    canvasCycleOneBlocked: true,
    canvasCycleTwoReleaseSupported: true
  });

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

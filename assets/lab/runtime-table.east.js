// /assets/lab/runtime-table.east.js
// LAB_RUNTIME_TABLE_EAST_F3_ENGINE_MECHANICS_INTAKE_VALVE_TNT_v1
// Full-file replacement.
// Runtime Table East / F3 intake valve / East Supreme Judge / admission branch.
// Purpose:
// - Stand up East as the F3 intake channel for the runtime-table v4 engine system.
// - Bind directly to runtime-table v4 mechanics: RT3D-X04_Y19_Z3.
// - Admit, normalize, classify, and receipt lawful intake packets.
// - Return F3 intake packets toward North and downstream F5 West pressure/admissibility.
// - Preserve the 3D engine lattice + 256 state binding model.
// - Treat architecture labels as secondary and engine mechanics/math as primary.
// - Avoid rendering, generated image claims, WebGL claims, GraphicBox claims, public superiority claims, and final visual pass claims.
// Does not own:
// - North F21 latch
// - West F5 pressure/admissibility
// - South F8 proof return
// - Canvas F13 evidence release
// - F34/F55/F89/F144 support-engine internals
// - F233 downstream return
// - route orchestration
// - planet truth
// - material/elevation/hydrology truth
// - actual rendering
// - generated image
// - GraphicBox
// - WebGL
// - public superiority claim
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "LAB_RUNTIME_TABLE_EAST_F3_ENGINE_MECHANICS_INTAKE_VALVE_TNT_v1";
  const RECEIPT = "LAB_RUNTIME_TABLE_EAST_F3_ENGINE_MECHANICS_INTAKE_VALVE_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "LAB_RUNTIME_TABLE_EAST_SOURCE_PENDING_RENEWAL";
  const BASELINE_CONTRACT = "LAB_RUNTIME_TABLE_COUNTY_ENGINE_MECHANICS_3D_LATTICE_256_STATE_SUPPORT_ENGINE_TNT_v4";
  const VERSION = "2026-06-08.lab-runtime-table-east-f3-engine-mechanics-intake-valve-v1";

  const FILE = "/assets/lab/runtime-table.east.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const WEST_FILE = "/assets/lab/runtime-table.west.js";
  const SOUTH_FILE = "/assets/lab/runtime-table.south.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";

  const F34_PRODUCT_ENGINE_FILE = "/assets/lab/product-engine.js";
  const F55_EXPRESSION_FILE = "/assets/lab/product-engine.ue5-expression.js";
  const F89_REGISTRY_FILE = "/assets/lab/product-engine.registry.js";
  const F144_MARKET_FILE = "/assets/lab/product-engine.market.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const FIBONACCI = Object.freeze({
    NORTH_ORIGIN: "F1",
    EAST_INTAKE: "F3",
    WEST_PRESSURE: "F5",
    SOUTH_PROOF: "F8",
    CANVAS_EVIDENCE: "F13",
    NORTH_LATCH: "F21",
    PRODUCT_ENGINE: "F34",
    UE5_EXPRESSION: "F55",
    PROJECT_REGISTRY: "F89",
    MARKET_READINESS: "F144",
    DOWNSTREAM_RETURN: "F233"
  });

  const NEWS_GATES = Object.freeze({
    NORTH: "NORTH",
    EAST: "EAST",
    WEST: "WEST",
    SOUTH: "SOUTH",
    CANVAS: "CANVAS",
    PRODUCT: "PRODUCT_ENGINE",
    EXPRESSION: "UE5_EXPRESSION",
    REGISTRY: "PROJECT_REGISTRY",
    MARKET: "MARKET_READINESS",
    DOWNSTREAM: "DOWNSTREAM_RETURN"
  });

  const STATUS = Object.freeze({
    HELD: "HELD",
    ACTIVE: "ACTIVE",
    READY: "READY",
    DEGRADED: "DEGRADED",
    BLOCKED: "BLOCKED",
    COMPLETE: "COMPLETE",
    REJECTED: "REJECTED"
  });

  const INTAKE_CLASS = Object.freeze({
    NORTH_IGNITION: "NORTH_IGNITION",
    EAST_PRIMARY: "EAST_PRIMARY",
    EAST_HANDOFF: "EAST_HANDOFF",
    DIAGNOSTIC_EVIDENCE: "DIAGNOSTIC_EVIDENCE",
    SUPPORT_ENGINE_SIGNAL: "SUPPORT_ENGINE_SIGNAL",
    ROUTE_SIGNAL: "ROUTE_SIGNAL",
    CANVAS_SIGNAL: "CANVAS_SIGNAL",
    GENERIC_INTAKE: "GENERIC_INTAKE"
  });

  const MECHANICAL_COORDINATE = Object.freeze({
    coordinateId: "RT3D-X04_Y19_Z3",
    enginePart: "VALVE",
    enginePartIndex: 4,
    systemCategory: "NINETEEN_PART_SYSTEM",
    systemCategoryIndex: 19,
    fibonacciStage: FIBONACCI.EAST_INTAKE,
    fibonacciRank: 3,
    fibonacciStation: "EAST_INTAKE",
    mechanicalRole: "EAST_INTAKE_CHANNEL",
    judicialRole: "EAST_SUPREME_JUDGE",
    authorityRole: "ADMISSION_BRANCH",
    mayJudgeIntake: true,
    mayLatchF21: false,
    mayAuditF5Pressure: false,
    mayReturnF8Proof: false,
    mayReleaseCanvasF13: false,
    mayRender: false,
    mayClaimPublicSuperiority: false
  });

  const WEST_HANDOFF_COORDINATE = Object.freeze({
    coordinateId: "RT3D-X06_Y19_Z5",
    enginePart: "COMPRESSION",
    enginePartIndex: 6,
    systemCategory: "NINETEEN_PART_SYSTEM",
    systemCategoryIndex: 19,
    fibonacciStage: FIBONACCI.WEST_PRESSURE,
    fibonacciRank: 5,
    fibonacciStation: "WEST_PRESSURE_ADMISSIBILITY",
    mechanicalRole: "WEST_PRESSURE_ADMISSIBILITY_TARGET",
    mayJudgeIntake: false,
    mayLatchF21: false,
    mayRender: false
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,

    eastRuntimeTableActive: true,
    eastRuntimeTableF3Only: true,
    eastSupremeJudgeActive: true,
    eastIntakeValveActive: true,
    intakeValveOpen: true,
    intakeValveStatus: STATUS.ACTIVE,

    engineMechanicsPrimary: true,
    mathPrimary: true,
    architectureLabelsSecondary: true,
    mechanicalCoordinate: MECHANICAL_COORDINATE,
    westHandoffCoordinate: WEST_HANDOFF_COORDINATE,

    northRuntimeObserved: false,
    northRuntimeAccepted: false,
    northRuntimeContract: "",
    northRuntimeReceipt: "",
    northF1IgnitionObserved: false,
    northF1IgnitionAccepted: false,
    northF21LatchObserved: false,
    northF21Latched: false,

    intakeRecords: [],
    intakeQueue: [],
    rejectedRecords: [],
    intakeRecordCount: 0,
    acceptedRecordCount: 0,
    rejectedRecordCount: 0,
    diagnosticEvidenceCount: 0,
    supportEngineSignalCount: 0,
    routeSignalCount: 0,
    canvasSignalCount: 0,

    lastAcceptedIntake: null,
    lastRejectedIntake: null,

    intakeGraphBuilt: false,
    intakeGraphReady: false,
    intakeGraphStatus: STATUS.HELD,
    intakeGraph: {
      records: [],
      recordsById: {},
      byClass: {},
      byState: {},
      edges: [],
      buildId: "",
      builtAt: ""
    },

    intakeQualityMetricActive: true,
    intakeQualityScore: 0,
    intakeCoverageScore: 0,
    intakeTraceScore: 0,
    intakeCoherenceScore: 0,

    f5WestHandoffAuthorized: false,
    f3IntakePacketReady: false,
    f3ActivationStatus: STATUS.ACTIVE,
    f3ActivationReason: "EAST_F3_INTAKE_VALVE_ACTIVE_WAITING_NORTH_OR_PACKET",

    westReceiptAccepted: false,
    westReceiptPacket: null,
    westRuntimeContract: "",
    westRuntimeReceipt: "",

    activeFibonacci: FIBONACCI.EAST_INTAKE,
    activeFibonacciRank: 3,
    activeNewsGate: NEWS_GATES.EAST,
    sourceFibonacciGate: FIBONACCI.NORTH_ORIGIN,
    futureFibonacciGate: FIBONACCI.WEST_PRESSURE,
    newsProtocolAligned: true,
    fibonacciSynchronizationMetricActive: true,
    fibonacciSynchronizationScore: 0,
    oneActiveGearAtATime: true,

    firstFailedCoordinate: "WAITING_NORTH_F1_OR_INTAKE_PACKET",
    recommendedNextFile: WEST_FILE,
    recommendedNextRenewalTarget: WEST_FILE,

    localEvents: [],
    errors: [],

    publicSuperiorityClaim: false,
    publicComparisonClaimAllowed: false,
    benchmarkRequiredBeforePublicClaim: true,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    createdAt: "",
    updatedAt: ""
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
    return String(value);
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true") return true;
    if (value === false || value === 0 || value === "0" || value === "false") return false;
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

  function trim(list, max = 240) {
    if (Array.isArray(list) && list.length > max) {
      list.splice(0, list.length - max);
    }
  }

  function makeId(value, fallback = "intake") {
    const raw = safeString(value || fallback, fallback)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return raw || fallback;
  }

  function stableStateIndex(value) {
    let text = "";

    try {
      text = JSON.stringify(value || {});
    } catch (_error) {
      text = safeString(value, "");
    }

    let hash = 0;
    for (let index = 0; index < text.length; index += 1) {
      hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0;
    }

    return Math.abs(hash) % 256;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
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

  function setPath(path, value) {
    const parts = String(path || "").split(".").filter(Boolean);
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

  function firstGlobal(names) {
    for (const name of names || []) {
      const found = readPath(name);
      if (found) return found;
    }
    return null;
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return {};

    try {
      if (isFunction(authority.getReceiptLight)) {
        const receipt = authority.getReceiptLight();
        if (isObject(receipt)) return receipt;
      }

      if (isFunction(authority.getReceipt)) {
        const receipt = authority.getReceipt();
        if (isObject(receipt)) return receipt;
      }
    } catch (error) {
      return { error: error && error.message ? error.message : String(error) };
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;
    if (authority.contract || authority.receipt || authority.version) return authority;

    return {};
  }

  function recordLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "LOCAL_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trim(state.localEvents);
    state.updatedAt = item.at;
    updateDataset();

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "RUNTIME_TABLE_EAST_F3_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trim(state.errors);
    state.updatedAt = item.at;
    updateDataset();

    return item;
  }

  function detectForbiddenClaim(packet = {}) {
    const text = (() => {
      try {
        return JSON.stringify(packet || {});
      } catch (_error) {
        return String(packet || "");
      }
    })();

    return Boolean(
      safeBool(packet.generatedImage, false) ||
      safeBool(packet.graphicBox, false) ||
      safeBool(packet.webGL, false) ||
      safeBool(packet.visualPassClaimed, false) ||
      safeBool(packet.publicSuperiorityClaim, false) ||
      safeBool(packet.publicComparisonClaimAllowed, false) ||
      text.includes('"generatedImage":true') ||
      text.includes('"graphicBox":true') ||
      text.includes('"webGL":true') ||
      text.includes('"visualPassClaimed":true') ||
      text.includes('"publicSuperiorityClaim":true') ||
      text.includes('"publicComparisonClaimAllowed":true') ||
      text.includes("visualPassClaimed=true")
    );
  }

  function readNorthRuntimeAuthority() {
    return firstGlobal([
      "LAB_RUNTIME_TABLE",
      "LAB_RUNTIME_TABLE_NORTH",
      "RUNTIME_TABLE",
      "HEARTH_NORTH_COMMAND_RUNTIME_TABLE",
      "LAB_CENTRAL_TRAIN_STATION",
      "DEXTER_LAB.runtimeTable",
      "DEXTER_LAB.cardinalRuntimeTableNorth",
      "DEXTER_LAB.centralTrainStation",
      "HEARTH.northCommandRuntimeTable",
      "HEARTH.runtimeTable",
      "HEARTH.centralTrainStation"
    ]);
  }

  function readNorthRuntimeReceipt() {
    const authority = readNorthRuntimeAuthority();
    const receipt = readReceipt(authority);

    if (receipt && Object.keys(receipt).length) {
      state.northRuntimeObserved = true;
      state.northRuntimeContract = safeString(receipt.contract, state.northRuntimeContract);
      state.northRuntimeReceipt = safeString(receipt.receipt, state.northRuntimeReceipt);

      state.northF1IgnitionObserved =
        safeBool(receipt.countyRuntimeEngineCenter, false) ||
        safeBool(receipt.northTimingGovernor, false) ||
        safeString(receipt.activeStage, "") === FIBONACCI.NORTH_ORIGIN ||
        safeString(receipt.activeFibonacci, "") === FIBONACCI.NORTH_ORIGIN ||
        state.northF1IgnitionObserved;

      state.northF21LatchObserved =
        safeBool(receipt.f21EligibilityAccepted, false) ||
        safeBool(receipt.f21Latched, false) ||
        state.northF21LatchObserved;

      state.northF21Latched = safeBool(receipt.f21Latched, state.northF21Latched);
    }

    return receipt || {};
  }

  function validateNorthRuntimeReceipt(packet = {}) {
    const input = isObject(packet) && Object.keys(packet).length ? packet : readNorthRuntimeReceipt();
    const noForbiddenClaim = !detectForbiddenClaim(input);

    const northRecognized = Boolean(
      safeBool(input.countyRuntimeEngineCenter, false) ||
      safeBool(input.northTimingGovernor, false) ||
      safeBool(input.threeDMechanicalLatticeBound, false) ||
      safeBool(input.stateLattice256Bound, false) ||
      safeString(input.contract || "").includes("RUNTIME_TABLE") ||
      safeString(input.receipt || "").includes("RUNTIME_TABLE") ||
      safeString(input.file || "") === NORTH_FILE
    );

    const f1Recognized = Boolean(
      safeString(input.activeStage, "") === FIBONACCI.NORTH_ORIGIN ||
      safeString(input.activeFibonacci, "") === FIBONACCI.NORTH_ORIGIN ||
      safeBool(input.countyRuntimeEngineCenter, false) ||
      safeBool(input.northTimingGovernor, false)
    );

    const ok = Boolean(noForbiddenClaim && (northRecognized || !Object.keys(input || {}).length));

    let reason = "NORTH_RUNTIME_RECEIPT_ACCEPTABLE_OR_OPTIONAL";
    if (!noForbiddenClaim) reason = "FORBIDDEN_CLAIM_DETECTED_IN_NORTH_RECEIPT";
    else if (Object.keys(input || {}).length && !northRecognized) reason = "UNRECOGNIZED_NORTH_RUNTIME_RECEIPT";

    return {
      ok,
      reason,
      noForbiddenClaim,
      northRecognized,
      f1Recognized,
      input: clonePlain(input)
    };
  }

  function acceptNorthRuntimeReceipt(packet = {}) {
    const validation = validateNorthRuntimeReceipt(packet);

    state.northRuntimeObserved = validation.northRecognized || state.northRuntimeObserved;
    state.northRuntimeAccepted = validation.ok;
    state.northF1IgnitionObserved = validation.f1Recognized || state.northF1IgnitionObserved;
    state.northF1IgnitionAccepted = validation.ok && validation.f1Recognized;

    if (validation.input.contract) state.northRuntimeContract = safeString(validation.input.contract);
    if (validation.input.receipt) state.northRuntimeReceipt = safeString(validation.input.receipt);

    recordLocal("NORTH_RUNTIME_RECEIPT_EVALUATED_BY_EAST_F3", {
      accepted: validation.ok,
      reason: validation.reason,
      northRecognized: validation.northRecognized,
      f1Recognized: validation.f1Recognized
    });

    computeFibonacciSynchronizationMetric();
    publishGlobals();

    return {
      accepted: validation.ok,
      eastF3ReceivedNorth: true,
      reason: validation.reason,
      northRuntimeObserved: state.northRuntimeObserved,
      northF1IgnitionAccepted: state.northF1IgnitionAccepted,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function receiveNorthRuntimeReceipt(packet = {}) {
    return acceptNorthRuntimeReceipt(packet);
  }

  function acceptNorthIgnition(packet = {}) {
    return acceptNorthRuntimeReceipt({
      ...clonePlain(packet),
      activeFibonacci: FIBONACCI.NORTH_ORIGIN,
      activeNewsGate: NEWS_GATES.NORTH,
      northIgnition: true
    });
  }

  function receiveNorthIgnition(packet = {}) {
    return acceptNorthIgnition(packet);
  }

  function acceptNorthF1(packet = {}) {
    return acceptNorthIgnition(packet);
  }

  function receiveNorthF1(packet = {}) {
    return acceptNorthIgnition(packet);
  }

  function classifyIntakePacket(packet = {}) {
    const input = isObject(packet) ? packet : { value: packet };
    const text = (() => {
      try {
        return JSON.stringify(input || {});
      } catch (_error) {
        return safeString(input, "");
      }
    })();

    const activeFibonacci = safeString(input.activeFibonacci || input.fibonacciStage || input.activeStage || "");
    const packetType = safeString(input.packetType || input.type || input.event || "");

    let intakeClass = INTAKE_CLASS.GENERIC_INTAKE;

    if (
      activeFibonacci === FIBONACCI.NORTH_ORIGIN ||
      packetType.includes("NORTH") ||
      packetType.includes("F1") ||
      safeBool(input.northIgnition, false)
    ) {
      intakeClass = INTAKE_CLASS.NORTH_IGNITION;
    } else if (
      packetType.includes("EAST_PRIMARY") ||
      safeBool(input.eastPrimary, false) ||
      safeBool(input.primary, false)
    ) {
      intakeClass = INTAKE_CLASS.EAST_PRIMARY;
    } else if (
      packetType.includes("EAST_HANDOFF") ||
      safeBool(input.eastHandoff, false) ||
      safeBool(input.handoff, false)
    ) {
      intakeClass = INTAKE_CLASS.EAST_HANDOFF;
    } else if (
      /DIAGNOSTIC|RECEIPT|EVIDENCE|PROBE|GAUGE/.test(text)
    ) {
      intakeClass = INTAKE_CLASS.DIAGNOSTIC_EVIDENCE;
    } else if (
      /F34|F55|F89|F144|F233|PRODUCT_ENGINE|UE5_EXPRESSION|REGISTRY|MARKET/.test(text)
    ) {
      intakeClass = INTAKE_CLASS.SUPPORT_ENGINE_SIGNAL;
    } else if (
      /ROUTE|HEARTH|SHOWROOM|GLOBE/.test(text)
    ) {
      intakeClass = INTAKE_CLASS.ROUTE_SIGNAL;
    } else if (
      /CANVAS|F13|VISUAL|CHAPEL|FINGER/.test(text)
    ) {
      intakeClass = INTAKE_CLASS.CANVAS_SIGNAL;
    }

    const stateIndex = clamp(
      input.stateIndex !== undefined ? input.stateIndex : stableStateIndex(input),
      0,
      255
    );

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      intakeClass,
      packetType,
      activeFibonacci,
      stateIndex,
      stateId: `ST_${stateIndex}`,
      forbiddenClaimDetected: detectForbiddenClaim(input),
      packet: clonePlain(input),
      classifiedAt: nowIso()
    };
  }

  function evaluateIntakePacket(packet = {}) {
    const classification = classifyIntakePacket(packet);
    const noForbiddenClaim = !classification.forbiddenClaimDetected;

    const activeFibonacci = safeString(
      packet.activeFibonacci || packet.fibonacciStage || packet.activeStage || "",
      ""
    );

    const stageAllowed = Boolean(
      !activeFibonacci ||
      activeFibonacci === FIBONACCI.NORTH_ORIGIN ||
      activeFibonacci === FIBONACCI.EAST_INTAKE ||
      activeFibonacci === "F1" ||
      activeFibonacci === "F3"
    );

    const valveOpen = Boolean(state.intakeValveOpen && state.eastIntakeValveActive);

    const accepted = Boolean(noForbiddenClaim && stageAllowed && valveOpen);

    let reason = "EAST_F3_INTAKE_ACCEPTED";
    if (!noForbiddenClaim) reason = "FORBIDDEN_CLAIM_DETECTED_BY_EAST_F3_INTAKE_VALVE";
    else if (!stageAllowed) reason = "INTAKE_STAGE_NOT_ADMISSIBLE_TO_EAST_F3";
    else if (!valveOpen) reason = "EAST_F3_INTAKE_VALVE_CLOSED";

    return {
      accepted,
      reason,
      classification,
      coordinate: clonePlain(MECHANICAL_COORDINATE),
      runtimeCondition: `${MECHANICAL_COORDINATE.coordinateId}::${classification.stateId}`,
      valveState: accepted ? "OPEN" : "CLOSED",
      nextRecommendedCoordinate: accepted ? WEST_HANDOFF_COORDINATE.coordinateId : MECHANICAL_COORDINATE.coordinateId,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      evaluatedAt: nowIso()
    };
  }

  function normalizeIntakeRecord(packet = {}, evaluation = null) {
    const result = evaluation || evaluateIntakePacket(packet);
    const source = isObject(packet) ? packet : { value: packet };
    const id = makeId(
      source.id ||
      source.packetId ||
      source.receipt ||
      source.contract ||
      `${result.classification.intakeClass}-${Date.now()}-${state.intakeRecords.length + state.rejectedRecords.length + 1}`,
      "east-intake"
    );

    return {
      id,
      recordId: id,
      intakeClass: result.classification.intakeClass,
      packetType: result.classification.packetType,
      sourceContract: safeString(source.contract || ""),
      sourceReceipt: safeString(source.receipt || ""),
      sourceFile: safeString(source.file || source.sourceFile || ""),
      sourceRoute: safeString(source.route || ""),
      activeFibonacci: safeString(source.activeFibonacci || source.fibonacciStage || source.activeStage || ""),
      stateId: result.classification.stateId,
      stateIndex: result.classification.stateIndex,
      coordinateId: MECHANICAL_COORDINATE.coordinateId,
      runtimeCondition: result.runtimeCondition,
      accepted: result.accepted,
      reason: result.reason,
      traceReady: Boolean(source.contract || source.receipt || source.file || source.route || source.sourceFile),
      deterministic: true,
      packet: clonePlain(source),
      publicSuperiorityClaim: false,
      publicComparisonClaimAllowed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      receivedAt: nowIso()
    };
  }

  function acceptIntakePacket(packet = {}) {
    const evaluation = evaluateIntakePacket(packet);
    const record = normalizeIntakeRecord(packet, evaluation);

    if (evaluation.accepted) {
      state.intakeRecords.push(record);
      state.intakeQueue.push(record);
      state.lastAcceptedIntake = clonePlain(record);

      if (record.intakeClass === INTAKE_CLASS.NORTH_IGNITION) {
        state.northF1IgnitionObserved = true;
        state.northF1IgnitionAccepted = true;
      }
    } else {
      state.rejectedRecords.push(record);
      state.lastRejectedIntake = clonePlain(record);
    }

    trim(state.intakeRecords);
    trim(state.intakeQueue);
    trim(state.rejectedRecords);

    rebuildIntakeGraph({ silent: true });
    computeFibonacciSynchronizationMetric();

    recordLocal("EAST_F3_INTAKE_PACKET_EVALUATED", {
      accepted: evaluation.accepted,
      reason: evaluation.reason,
      intakeClass: record.intakeClass,
      stateId: record.stateId,
      runtimeCondition: record.runtimeCondition
    });

    publishGlobals();

    return {
      accepted: evaluation.accepted,
      reason: evaluation.reason,
      record: clonePlain(record),
      intakeClass: record.intakeClass,
      runtimeCondition: record.runtimeCondition,
      f5WestHandoffAuthorized: state.f5WestHandoffAuthorized,
      recommendedNextFile: evaluation.accepted ? WEST_FILE : FILE,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function receiveIntakePacket(packet = {}) {
    return acceptIntakePacket(packet);
  }

  function submitIntakePacket(packet = {}) {
    return acceptIntakePacket(packet);
  }

  function acceptEastPrimary(packet = {}) {
    return acceptIntakePacket({
      ...clonePlain(packet),
      packetType: safeString(packet.packetType || "EAST_PRIMARY_PACKET"),
      eastPrimary: true,
      activeFibonacci: safeString(packet.activeFibonacci || FIBONACCI.EAST_INTAKE)
    });
  }

  function receiveEastPrimary(packet = {}) {
    return acceptEastPrimary(packet);
  }

  function acceptEastPrimaryGate(packet = {}) {
    return acceptEastPrimary(packet);
  }

  function acceptEastHandoff(packet = {}) {
    return acceptIntakePacket({
      ...clonePlain(packet),
      packetType: safeString(packet.packetType || "EAST_HANDOFF_PACKET"),
      eastHandoff: true,
      activeFibonacci: safeString(packet.activeFibonacci || FIBONACCI.EAST_INTAKE)
    });
  }

  function receiveEastHandoff(packet = {}) {
    return acceptEastHandoff(packet);
  }

  function acceptDiagnosticEvidence(packet = {}) {
    return acceptIntakePacket({
      ...clonePlain(packet),
      packetType: safeString(packet.packetType || "EAST_DIAGNOSTIC_EVIDENCE_PACKET"),
      diagnosticEvidence: true,
      activeFibonacci: safeString(packet.activeFibonacci || FIBONACCI.EAST_INTAKE)
    });
  }

  function acceptRouteSignal(packet = {}) {
    return acceptIntakePacket({
      ...clonePlain(packet),
      packetType: safeString(packet.packetType || "EAST_ROUTE_SIGNAL_PACKET"),
      routeSignal: true,
      activeFibonacci: safeString(packet.activeFibonacci || FIBONACCI.EAST_INTAKE)
    });
  }

  function acceptCanvasSignal(packet = {}) {
    return acceptIntakePacket({
      ...clonePlain(packet),
      packetType: safeString(packet.packetType || "EAST_CANVAS_SIGNAL_PACKET"),
      canvasSignal: true,
      activeFibonacci: safeString(packet.activeFibonacci || FIBONACCI.EAST_INTAKE)
    });
  }

  function rebuildIntakeGraph(options = {}) {
    const records = state.intakeRecords.slice();
    const recordsById = {};
    const byClass = {};
    const byState = {};
    const edges = [];

    records.forEach((record) => {
      recordsById[record.id] = record;

      byClass[record.intakeClass] = byClass[record.intakeClass] || [];
      byClass[record.intakeClass].push(record.id);

      byState[record.stateId] = byState[record.stateId] || [];
      byState[record.stateId].push(record.id);

      edges.push({
        from: MECHANICAL_COORDINATE.coordinateId,
        to: record.id,
        type: "east-valve-admitted-record",
        deterministic: true
      });

      if (record.sourceContract) {
        edges.push({
          from: record.id,
          to: makeId(`contract-${record.sourceContract}`),
          type: "record-to-contract",
          deterministic: true
        });
      }

      if (record.sourceReceipt) {
        edges.push({
          from: record.id,
          to: makeId(`receipt-${record.sourceReceipt}`),
          type: "record-to-receipt",
          deterministic: true
        });
      }
    });

    state.intakeGraph = {
      records,
      recordsById,
      byClass,
      byState,
      edges,
      buildId: `east-f3-intake-graph-${records.length}-${edges.length}`,
      builtAt: nowIso()
    };

    state.intakeGraphBuilt = true;
    state.intakeRecordCount = records.length;
    state.acceptedRecordCount = records.length;
    state.rejectedRecordCount = state.rejectedRecords.length;
    state.diagnosticEvidenceCount = records.filter((record) => record.intakeClass === INTAKE_CLASS.DIAGNOSTIC_EVIDENCE).length;
    state.supportEngineSignalCount = records.filter((record) => record.intakeClass === INTAKE_CLASS.SUPPORT_ENGINE_SIGNAL).length;
    state.routeSignalCount = records.filter((record) => record.intakeClass === INTAKE_CLASS.ROUTE_SIGNAL).length;
    state.canvasSignalCount = records.filter((record) => record.intakeClass === INTAKE_CLASS.CANVAS_SIGNAL).length;

    computeIntakeQualityMetric();

    state.intakeGraphReady = Boolean(
      state.intakeRecordCount > 0 &&
      state.intakeQualityScore >= 62
    );

    if (state.intakeGraphReady) {
      state.intakeGraphStatus = state.intakeQualityScore >= 80 ? STATUS.READY : STATUS.DEGRADED;
      state.f5WestHandoffAuthorized = true;
      state.f3IntakePacketReady = true;
      state.f3ActivationStatus = state.intakeGraphStatus;
      state.f3ActivationReason =
        state.intakeGraphStatus === STATUS.READY
          ? "EAST_F3_INTAKE_READY_FOR_WEST_F5"
          : "EAST_F3_INTAKE_DEGRADED_WEST_F5_HANDOFF_AVAILABLE";
      state.firstFailedCoordinate =
        state.intakeGraphStatus === STATUS.READY
          ? "NONE_EAST_F3_READY_WEST_F5_HANDOFF_AUTHORIZED"
          : "NONE_EAST_F3_DEGRADED_WEST_F5_HANDOFF_AVAILABLE";
      state.recommendedNextFile = WEST_FILE;
      state.recommendedNextRenewalTarget = WEST_FILE;
    } else {
      state.intakeGraphStatus = STATUS.HELD;
      state.f5WestHandoffAuthorized = false;
      state.f3IntakePacketReady = false;
      state.f3ActivationStatus = STATUS.HELD;
      state.f3ActivationReason = "WAITING_LAWFUL_EAST_F3_INTAKE";
      state.firstFailedCoordinate = "WAITING_LAWFUL_EAST_F3_INTAKE";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
    }

    computeFibonacciSynchronizationMetric();

    if (options.silent !== true) {
      recordLocal("EAST_F3_INTAKE_GRAPH_REBUILT", {
        intakeRecordCount: state.intakeRecordCount,
        rejectedRecordCount: state.rejectedRecordCount,
        intakeGraphStatus: state.intakeGraphStatus,
        intakeQualityScore: state.intakeQualityScore
      });
    }

    updateDataset();

    return clonePlain(state.intakeGraph);
  }

  function computeIntakeQualityMetric() {
    const records = state.intakeRecords || [];
    const count = Math.max(1, records.length);
    const acceptedRatio = records.length / Math.max(1, records.length + state.rejectedRecords.length);
    const traceRatio = records.filter((record) => record.traceReady).length / count;

    const classCoverage = [
      records.some((record) => record.intakeClass === INTAKE_CLASS.NORTH_IGNITION),
      records.some((record) => record.intakeClass === INTAKE_CLASS.EAST_PRIMARY),
      records.some((record) => record.intakeClass === INTAKE_CLASS.EAST_HANDOFF),
      records.some((record) => record.intakeClass === INTAKE_CLASS.DIAGNOSTIC_EVIDENCE),
      records.some((record) => record.intakeClass === INTAKE_CLASS.SUPPORT_ENGINE_SIGNAL),
      records.some((record) => record.intakeClass === INTAKE_CLASS.ROUTE_SIGNAL),
      records.some((record) => record.intakeClass === INTAKE_CLASS.CANVAS_SIGNAL)
    ].filter(Boolean).length / 7;

    state.intakeCoverageScore = clamp(Math.round(classCoverage * 100), 0, 100);
    state.intakeTraceScore = clamp(Math.round(traceRatio * 100), 0, 100);

    state.intakeCoherenceScore = clamp(
      Math.round(
        (acceptedRatio * 42) +
        (state.intakeTraceScore * 0.22) +
        (state.intakeCoverageScore * 0.20) +
        (state.intakeValveOpen ? 8 : 0) +
        (!state.publicSuperiorityClaim ? 8 : 0)
      ),
      0,
      100
    );

    state.intakeQualityScore = clamp(
      Math.round(
        (state.intakeCoherenceScore * 0.42) +
        (state.intakeTraceScore * 0.30) +
        (state.intakeCoverageScore * 0.28)
      ),
      0,
      100
    );

    return {
      intakeQualityScore: state.intakeQualityScore,
      intakeCoverageScore: state.intakeCoverageScore,
      intakeTraceScore: state.intakeTraceScore,
      intakeCoherenceScore: state.intakeCoherenceScore,
      publicSuperiorityClaim: false,
      publicComparisonClaimAllowed: false
    };
  }

  function computeFibonacciSynchronizationMetric() {
    const checks = [
      state.newsProtocolAligned,
      state.oneActiveGearAtATime,
      state.activeFibonacci === FIBONACCI.EAST_INTAKE,
      state.activeFibonacciRank === 3,
      state.activeNewsGate === NEWS_GATES.EAST,
      state.sourceFibonacciGate === FIBONACCI.NORTH_ORIGIN,
      state.futureFibonacciGate === FIBONACCI.WEST_PRESSURE,
      state.eastRuntimeTableActive,
      state.eastSupremeJudgeActive,
      state.eastIntakeValveActive,
      state.intakeValveOpen,
      state.engineMechanicsPrimary,
      state.mathPrimary,
      state.mechanicalCoordinate.coordinateId === "RT3D-X04_Y19_Z3",
      state.intakeGraphBuilt || state.northRuntimeObserved,
      !state.publicSuperiorityClaim,
      !state.publicComparisonClaimAllowed,
      !state.generatedImage,
      !state.graphicBox,
      !state.webGL,
      !state.visualPassClaimed
    ];

    const passed = checks.filter(Boolean).length;
    state.fibonacciSynchronizationScore = Math.round((passed / checks.length) * 100);
    state.updatedAt = nowIso();

    computeIntakeQualityMetric();

    return {
      score: state.fibonacciSynchronizationScore,
      passed,
      total: checks.length,
      activeFibonacci: FIBONACCI.EAST_INTAKE,
      activeFibonacciRank: 3,
      activeNewsGate: NEWS_GATES.EAST,
      sourceFibonacciGate: FIBONACCI.NORTH_ORIGIN,
      futureFibonacciGate: FIBONACCI.WEST_PRESSURE,
      publicSuperiorityClaim: false
    };
  }

  function evaluateNewsAlignment() {
    const metric = computeFibonacciSynchronizationMetric();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      newsAlignmentContract: "LAB_RUNTIME_TABLE_EAST_F3_NEWS_ALIGNMENT_PROTOCOL_v1",
      newsAlignmentReceipt: "LAB_RUNTIME_TABLE_EAST_F3_NEWS_ALIGNMENT_PROTOCOL_RECEIPT_v1",
      sequence: [
        {
          gate: NEWS_GATES.NORTH,
          fibonacci: FIBONACCI.NORTH_ORIGIN,
          file: NORTH_FILE,
          ready: state.northRuntimeObserved || state.northF1IgnitionObserved
        },
        {
          gate: NEWS_GATES.EAST,
          fibonacci: FIBONACCI.EAST_INTAKE,
          file: FILE,
          ready: state.intakeGraphReady || state.f3IntakePacketReady
        },
        {
          gate: NEWS_GATES.WEST,
          fibonacci: FIBONACCI.WEST_PRESSURE,
          file: WEST_FILE,
          ready: state.f5WestHandoffAuthorized
        }
      ],
      fibonacciSynchronizationScore: metric.score,
      f3Status: state.f3ActivationStatus,
      intakeGraphStatus: state.intakeGraphStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function setIntakeValveOpen(open, detail = {}) {
    state.intakeValveOpen = safeBool(open, true);
    state.intakeValveStatus = state.intakeValveOpen ? STATUS.ACTIVE : STATUS.HELD;

    recordLocal("EAST_F3_INTAKE_VALVE_STATE_CHANGED", {
      intakeValveOpen: state.intakeValveOpen,
      detail: clonePlain(detail)
    });

    computeFibonacciSynchronizationMetric();
    publishGlobals();

    return {
      intakeValveOpen: state.intakeValveOpen,
      intakeValveStatus: state.intakeValveStatus,
      changedAt: nowIso()
    };
  }

  function openIntakeValve(detail = {}) {
    return setIntakeValveOpen(true, detail);
  }

  function closeIntakeValve(detail = {}) {
    return setIntakeValveOpen(false, detail);
  }

  function composeF3IntakePacket(extra = {}) {
    const metric = computeFibonacciSynchronizationMetric();
    const readyForF5 = Boolean(state.f5WestHandoffAuthorized || state.intakeGraphStatus === STATUS.DEGRADED);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "EAST_F3_INTAKE_PACKET",
      sourceFile: FILE,
      targetFile: WEST_FILE,
      destinationFile: WEST_FILE,

      activeFibonacci: FIBONACCI.EAST_INTAKE,
      activeFibonacciRank: 3,
      activeNewsGate: NEWS_GATES.EAST,
      sourceFibonacciGate: FIBONACCI.NORTH_ORIGIN,
      futureFibonacciGate: FIBONACCI.WEST_PRESSURE,
      futureFibonacciRank: 5,

      mechanicalCoordinate: clonePlain(MECHANICAL_COORDINATE),
      westHandoffCoordinate: clonePlain(WEST_HANDOFF_COORDINATE),
      engineMechanicsPrimary: true,
      mathPrimary: true,
      architectureLabelsSecondary: true,

      eastRuntimeTableActive: true,
      eastRuntimeTableF3Only: true,
      eastSupremeJudgeActive: true,
      eastIntakeValveActive: true,
      intakeValveOpen: state.intakeValveOpen,
      intakeValveStatus: state.intakeValveStatus,

      northRuntimeObserved: state.northRuntimeObserved,
      northRuntimeAccepted: state.northRuntimeAccepted,
      northRuntimeContract: state.northRuntimeContract,
      northRuntimeReceipt: state.northRuntimeReceipt,
      northF1IgnitionObserved: state.northF1IgnitionObserved,
      northF1IgnitionAccepted: state.northF1IgnitionAccepted,
      northF21LatchObserved: state.northF21LatchObserved,
      northF21Latched: state.northF21Latched,

      intakeGraphBuilt: state.intakeGraphBuilt,
      intakeGraphReady: state.intakeGraphReady,
      intakeGraphStatus: state.intakeGraphStatus,
      intakeRecordCount: state.intakeRecordCount,
      acceptedRecordCount: state.acceptedRecordCount,
      rejectedRecordCount: state.rejectedRecordCount,
      diagnosticEvidenceCount: state.diagnosticEvidenceCount,
      supportEngineSignalCount: state.supportEngineSignalCount,
      routeSignalCount: state.routeSignalCount,
      canvasSignalCount: state.canvasSignalCount,

      intakeQualityScore: state.intakeQualityScore,
      intakeCoverageScore: state.intakeCoverageScore,
      intakeTraceScore: state.intakeTraceScore,
      intakeCoherenceScore: state.intakeCoherenceScore,

      intakeRecords: clonePlain(state.intakeRecords),
      intakeQueue: clonePlain(state.intakeQueue),
      rejectedRecords: clonePlain(state.rejectedRecords),
      intakeGraph: clonePlain(state.intakeGraph),

      f5WestHandoffAuthorized: readyForF5,
      f3IntakePacketReady: readyForF5,
      f3ActivationStatus: state.f3ActivationStatus,
      f3ActivationReason: state.f3ActivationReason,

      newsProtocolAligned: true,
      fibonacciSynchronizationMetricActive: true,
      fibonacciSynchronizationScore: metric.score,
      oneActiveGearAtATime: true,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      detail: clonePlain(extra),

      publicSuperiorityClaim: false,
      publicComparisonClaimAllowed: false,
      benchmarkRequiredBeforePublicClaim: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      composedAt: nowIso()
    };
  }

  function composeEastReceipt() {
    return getReceipt();
  }

  function readWestRuntimeAuthority() {
    return firstGlobal([
      "LAB_RUNTIME_TABLE_WEST",
      "LAB_RUNTIME_TABLE_WEST_F5",
      "RUNTIME_TABLE_WEST",
      "WEST_PRESSURE_ADMISSIBILITY",
      "WEST_PRESSURE_VALVE",
      "WEST_SUPREME_JUDGE",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.cardinalRuntimeTableWest",
      "DEXTER_LAB.westPressureValve",
      "HEARTH.runtimeTableWest",
      "HEARTH.westPressureValve"
    ]);
  }

  function submitF3IntakeToWest(extra = {}) {
    const west = readWestRuntimeAuthority();

    if (!west) {
      return {
        submitted: false,
        reason: "WEST_RUNTIME_TABLE_UNAVAILABLE",
        recommendedNextFile: WEST_FILE,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };
    }

    const packet = composeF3IntakePacket(extra);

    try {
      if (isFunction(west.acceptEastF3IntakePacket)) {
        return {
          submitted: true,
          method: "acceptEastF3IntakePacket",
          response: clonePlain(west.acceptEastF3IntakePacket(packet))
        };
      }

      if (isFunction(west.acceptEastPrimary)) {
        return {
          submitted: true,
          method: "acceptEastPrimary",
          response: clonePlain(west.acceptEastPrimary(packet))
        };
      }

      if (isFunction(west.acceptWestIntake)) {
        return {
          submitted: true,
          method: "acceptWestIntake",
          response: clonePlain(west.acceptWestIntake(packet))
        };
      }

      if (isFunction(west.receiveWestIntake)) {
        return {
          submitted: true,
          method: "receiveWestIntake",
          response: clonePlain(west.receiveWestIntake(packet))
        };
      }
    } catch (error) {
      recordError("EAST_F3_PACKET_SUBMISSION_TO_WEST_FAILED", error);
      return {
        submitted: false,
        reason: "EAST_F3_PACKET_SUBMISSION_TO_WEST_FAILED"
      };
    }

    return {
      submitted: false,
      reason: "WEST_RUNTIME_TABLE_F3_INTAKE_METHOD_UNAVAILABLE",
      recommendedNextFile: WEST_FILE
    };
  }

  function submitF3PacketToNorth(extra = {}) {
    const north = readNorthRuntimeAuthority();

    if (!north) {
      return {
        submitted: false,
        reason: "NORTH_RUNTIME_TABLE_UNAVAILABLE",
        recommendedNextFile: NORTH_FILE
      };
    }

    const packet = composeF3IntakePacket(extra);

    try {
      if (isFunction(north.acceptEastPrimary)) {
        return {
          submitted: true,
          method: "acceptEastPrimary",
          response: clonePlain(north.acceptEastPrimary(packet))
        };
      }

      if (isFunction(north.acceptEastPrimaryGate)) {
        return {
          submitted: true,
          method: "acceptEastPrimaryGate",
          response: clonePlain(north.acceptEastPrimaryGate(packet))
        };
      }

      if (isFunction(north.acceptEastHandoff)) {
        return {
          submitted: true,
          method: "acceptEastHandoff",
          response: clonePlain(north.acceptEastHandoff(packet))
        };
      }

      if (isFunction(north.submitEvent)) {
        return {
          submitted: true,
          method: "submitEvent",
          response: clonePlain(north.submitEvent(packet))
        };
      }
    } catch (error) {
      recordError("EAST_F3_PACKET_SUBMISSION_TO_NORTH_FAILED", error);
      return {
        submitted: false,
        reason: "EAST_F3_PACKET_SUBMISSION_TO_NORTH_FAILED"
      };
    }

    return {
      submitted: false,
      reason: "NORTH_RUNTIME_TABLE_EAST_INTAKE_METHOD_UNAVAILABLE",
      recommendedNextFile: NORTH_FILE
    };
  }

  function validateWestReceipt(packet = {}) {
    const input = isObject(packet) ? packet : {};
    const noForbiddenClaim = !detectForbiddenClaim(input);

    const westRecognized = Boolean(
      safeBool(input.westRuntimeTableActive, false) ||
      safeBool(input.westPressureValveActive, false) ||
      safeBool(input.westSupremeJudgeActive, false) ||
      safeString(input.activeFibonacci || "") === FIBONACCI.WEST_PRESSURE ||
      safeString(input.contract || "").includes("WEST") ||
      safeString(input.receipt || "").includes("WEST")
    );

    const ok = Boolean(noForbiddenClaim && westRecognized);

    let reason = "WEST_F5_RECEIPT_ACCEPTED";
    if (!noForbiddenClaim) reason = "FORBIDDEN_CLAIM_DETECTED_IN_WEST_RECEIPT";
    else if (!westRecognized) reason = "UNRECOGNIZED_WEST_F5_RECEIPT";

    return {
      ok,
      reason,
      noForbiddenClaim,
      westRecognized,
      input: clonePlain(input)
    };
  }

  function acceptWestReceipt(packet = {}) {
    const validation = validateWestReceipt(packet);

    state.westReceiptAccepted = validation.ok;
    state.westReceiptPacket = clonePlain(packet);

    if (validation.input.contract) state.westRuntimeContract = safeString(validation.input.contract);
    if (validation.input.receipt) state.westRuntimeReceipt = safeString(validation.input.receipt);

    recordLocal("WEST_F5_RECEIPT_RECEIVED_BY_EAST_F3", {
      accepted: validation.ok,
      reason: validation.reason,
      contract: state.westRuntimeContract
    });

    publishGlobals();

    return {
      accepted: validation.ok,
      eastF3ReceivedWest: true,
      reason: validation.reason,
      recommendedNextFile: validation.ok ? SOUTH_FILE : WEST_FILE,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function bindStateToMechanicalCoordinate(input = {}) {
    const stateIndex = clamp(
      input.stateIndex !== undefined ? input.stateIndex : stableStateIndex(input),
      0,
      255
    );

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      bindingType: "EAST_F3_MECHANICAL_COORDINATE_PLUS_STATE_256",
      coordinate: clonePlain(MECHANICAL_COORDINATE),
      state256: {
        stateId: `ST_${stateIndex}`,
        stateIndex,
        binary: stateIndex.toString(2).padStart(8, "0"),
        field: "STATE_MOTION_CONSTRAINT_POSSIBILITY",
        replacesMechanicalCoordinate: false
      },
      geometry: {
        filterId: `FL_${(stateIndex % 61) + 1}`,
        pressureShellId: `PS_${(stateIndex % 192) + 1}`,
        basinAnchorId: `BA_${(stateIndex % 9) + 1}`,
        geometryEnvelope: "GEOMETRY_TOTAL_451"
      },
      runtimeCondition: `${MECHANICAL_COORDINATE.coordinateId}::ST_${stateIndex}`,
      bound: true,
      boundAt: nowIso()
    };
  }

  function evaluateCoordinateState(input = {}) {
    const binding = bindStateToMechanicalCoordinate(input);
    const allowed = Boolean(
      state.intakeValveOpen &&
      state.eastIntakeValveActive &&
      !detectForbiddenClaim(input)
    );

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      coordinateId: MECHANICAL_COORDINATE.coordinateId,
      stateId: binding.state256.stateId,
      coordinateAllowed: true,
      stateAdmissible: binding.state256.stateIndex >= 0 && binding.state256.stateIndex <= 255,
      filterPassageAllowed: allowed,
      pressureWithinShell: true,
      basinAnchored: true,
      envelopeContained: true,
      runtimeExpressionAllowed: allowed,
      valveState: allowed ? "OPEN" : "CLOSED",
      evaluatedAt: nowIso()
    };
  }

  function getMechanicalCoordinatePacket() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      mechanicalCoordinate: clonePlain(MECHANICAL_COORDINATE),
      westHandoffCoordinate: clonePlain(WEST_HANDOFF_COORDINATE),
      runtimeCondition: `${MECHANICAL_COORDINATE.coordinateId}::ST_0`,
      enginePartDefinesFunction: true,
      fibonacciDefinesSequence: true,
      categoryDefinesScale: true,
      numbersSupportFunction: true,
      aliasesLocateOnly: true,
      namesDescribeOnly: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function getIntakeGraph() {
    return clonePlain(state.intakeGraph);
  }

  function getIntakeGraphSummary() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      intakeGraphBuilt: state.intakeGraphBuilt,
      intakeGraphReady: state.intakeGraphReady,
      intakeGraphStatus: state.intakeGraphStatus,
      intakeRecordCount: state.intakeRecordCount,
      acceptedRecordCount: state.acceptedRecordCount,
      rejectedRecordCount: state.rejectedRecordCount,
      diagnosticEvidenceCount: state.diagnosticEvidenceCount,
      supportEngineSignalCount: state.supportEngineSignalCount,
      routeSignalCount: state.routeSignalCount,
      canvasSignalCount: state.canvasSignalCount,
      intakeQualityScore: state.intakeQualityScore,
      intakeCoverageScore: state.intakeCoverageScore,
      intakeTraceScore: state.intakeTraceScore,
      intakeCoherenceScore: state.intakeCoherenceScore,
      updatedAt: nowIso()
    };
  }

  function getIntakeRecords(intakeClass = "") {
    const records = state.intakeRecords || [];
    if (!intakeClass) return clonePlain(records);
    return clonePlain(records.filter((record) => record.intakeClass === intakeClass));
  }

  function getRejectedRecords() {
    return clonePlain(state.rejectedRecords);
  }

  function findIntakeRecord(id) {
    const key = makeId(id, "");
    return clonePlain((state.intakeGraph.recordsById || {})[key] || null);
  }

  function getReceiptLight() {
    computeFibonacciSynchronizationMetric();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,

      eastRuntimeTableActive: true,
      eastRuntimeTableF3Only: true,
      eastSupremeJudgeActive: true,
      eastIntakeValveActive: true,
      intakeValveOpen: state.intakeValveOpen,
      intakeValveStatus: state.intakeValveStatus,

      engineMechanicsPrimary: true,
      mathPrimary: true,
      architectureLabelsSecondary: true,
      mechanicalCoordinateId: MECHANICAL_COORDINATE.coordinateId,
      enginePart: MECHANICAL_COORDINATE.enginePart,
      systemCategory: MECHANICAL_COORDINATE.systemCategory,
      fibonacciStation: MECHANICAL_COORDINATE.fibonacciStage,
      mechanicalRole: MECHANICAL_COORDINATE.mechanicalRole,
      judicialRole: MECHANICAL_COORDINATE.judicialRole,
      authorityRole: MECHANICAL_COORDINATE.authorityRole,

      northRuntimeObserved: state.northRuntimeObserved,
      northRuntimeAccepted: state.northRuntimeAccepted,
      northRuntimeContract: state.northRuntimeContract,
      northRuntimeReceipt: state.northRuntimeReceipt,
      northF1IgnitionObserved: state.northF1IgnitionObserved,
      northF1IgnitionAccepted: state.northF1IgnitionAccepted,
      northF21LatchObserved: state.northF21LatchObserved,
      northF21Latched: state.northF21Latched,

      intakeGraphBuilt: state.intakeGraphBuilt,
      intakeGraphReady: state.intakeGraphReady,
      intakeGraphStatus: state.intakeGraphStatus,
      intakeRecordCount: state.intakeRecordCount,
      acceptedRecordCount: state.acceptedRecordCount,
      rejectedRecordCount: state.rejectedRecordCount,
      diagnosticEvidenceCount: state.diagnosticEvidenceCount,
      supportEngineSignalCount: state.supportEngineSignalCount,
      routeSignalCount: state.routeSignalCount,
      canvasSignalCount: state.canvasSignalCount,

      intakeQualityMetricActive: true,
      intakeQualityScore: state.intakeQualityScore,
      intakeCoverageScore: state.intakeCoverageScore,
      intakeTraceScore: state.intakeTraceScore,
      intakeCoherenceScore: state.intakeCoherenceScore,

      f5WestHandoffAuthorized: state.f5WestHandoffAuthorized,
      f3IntakePacketReady: state.f3IntakePacketReady,
      f3ActivationStatus: state.f3ActivationStatus,
      f3ActivationReason: state.f3ActivationReason,

      westReceiptAccepted: state.westReceiptAccepted,
      westRuntimeContract: state.westRuntimeContract,
      westRuntimeReceipt: state.westRuntimeReceipt,

      newsProtocolAligned: true,
      fibonacciSynchronizationMetricActive: true,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      activeFibonacci: FIBONACCI.EAST_INTAKE,
      activeFibonacciRank: 3,
      activeNewsGate: NEWS_GATES.EAST,
      sourceFibonacciGate: FIBONACCI.NORTH_ORIGIN,
      futureFibonacciGate: FIBONACCI.WEST_PRESSURE,
      oneActiveGearAtATime: true,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      publicSuperiorityClaim: false,
      publicComparisonClaimAllowed: false,
      benchmarkRequiredBeforePublicClaim: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      createdAt: state.createdAt,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceipt() {
    const light = getReceiptLight();

    return {
      ...light,

      eastF3Receipt: true,
      eastSupremeJudgeReceipt: true,
      eastIntakeValveReceipt: true,

      eastRuntimeOwns: [
        "F3 East intake valve",
        "intake packet admission",
        "intake packet normalization",
        "intake classification",
        "256 state binding for intake records",
        "F5 West handoff packet"
      ],
      eastRuntimeDoesNotOwn: [
        "North F21 latch",
        "West F5 pressure/admissibility",
        "South F8 proof return",
        "Canvas F13 evidence release",
        "F34/F55/F89/F144 support-engine internals",
        "F233 downstream return",
        "route orchestration",
        "planet truth",
        "material truth",
        "elevation truth",
        "hydrology truth",
        "actual rendering",
        "generated image",
        "GraphicBox",
        "WebGL",
        "public superiority claim",
        "final visual pass claim"
      ],

      gates: {
        north: NORTH_FILE,
        east: FILE,
        west: WEST_FILE,
        south: SOUTH_FILE,
        canvas: CANVAS_FILE,
        productEngine: F34_PRODUCT_ENGINE_FILE,
        ue5Expression: F55_EXPRESSION_FILE,
        registry: F89_REGISTRY_FILE,
        market: F144_MARKET_FILE
      },

      intakeClasses: clonePlain(INTAKE_CLASS),
      fibonacciMap: clonePlain(FIBONACCI),
      newsGates: clonePlain(NEWS_GATES),
      mechanicalCoordinate: clonePlain(MECHANICAL_COORDINATE),
      westHandoffCoordinate: clonePlain(WEST_HANDOFF_COORDINATE),
      mechanicalCoordinatePacket: getMechanicalCoordinatePacket(),

      intakeGraph: getIntakeGraph(),
      intakeGraphSummary: getIntakeGraphSummary(),
      intakeRecords: getIntakeRecords(),
      rejectedRecords: getRejectedRecords(),

      intakeQuality: computeIntakeQualityMetric(),
      newsAlignment: evaluateNewsAlignment(),
      f3IntakePacket: composeF3IntakePacket(),
      westReceiptPacket: clonePlain(state.westReceiptPacket),

      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),

      publicSuperiorityClaim: false,
      publicComparisonClaimAllowed: false,
      benchmarkRequiredBeforePublicClaim: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function getReceiptText() {
    const r = getReceipt();

    const records = (r.intakeRecords || []).map((record) => (
      `- ${record.id} :: class=${record.intakeClass} :: state=${record.stateId} :: accepted=${record.accepted} :: traceReady=${record.traceReady} :: contract=${record.sourceContract || ""} :: receipt=${record.sourceReceipt || ""}`
    )).join("\n") || "- none";

    const rejected = (r.rejectedRecords || []).map((record) => (
      `- ${record.id} :: class=${record.intakeClass} :: state=${record.stateId} :: reason=${record.reason}`
    )).join("\n") || "- none";

    const events = (r.localEvents || []).slice(-48).map((item) => (
      `- ${item.at} :: ${item.event} :: ${JSON.stringify(item.detail || {})}`
    )).join("\n") || "- none";

    const errors = (r.errors || []).map((item) => (
      `- ${item.at} :: ${item.code} :: ${item.message}`
    )).join("\n") || "- none";

    return [
      "LAB_RUNTIME_TABLE_EAST_F3_ENGINE_MECHANICS_INTAKE_VALVE_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      "",
      `eastRuntimeTableActive=${r.eastRuntimeTableActive}`,
      `eastRuntimeTableF3Only=${r.eastRuntimeTableF3Only}`,
      `eastSupremeJudgeActive=${r.eastSupremeJudgeActive}`,
      `eastIntakeValveActive=${r.eastIntakeValveActive}`,
      `intakeValveOpen=${r.intakeValveOpen}`,
      `intakeValveStatus=${r.intakeValveStatus}`,
      "",
      `engineMechanicsPrimary=${r.engineMechanicsPrimary}`,
      `mathPrimary=${r.mathPrimary}`,
      `architectureLabelsSecondary=${r.architectureLabelsSecondary}`,
      `mechanicalCoordinateId=${r.mechanicalCoordinateId}`,
      `enginePart=${r.enginePart}`,
      `systemCategory=${r.systemCategory}`,
      `fibonacciStation=${r.fibonacciStation}`,
      `mechanicalRole=${r.mechanicalRole}`,
      `judicialRole=${r.judicialRole}`,
      `authorityRole=${r.authorityRole}`,
      "",
      `northRuntimeObserved=${r.northRuntimeObserved}`,
      `northRuntimeAccepted=${r.northRuntimeAccepted}`,
      `northRuntimeContract=${r.northRuntimeContract}`,
      `northRuntimeReceipt=${r.northRuntimeReceipt}`,
      `northF1IgnitionObserved=${r.northF1IgnitionObserved}`,
      `northF1IgnitionAccepted=${r.northF1IgnitionAccepted}`,
      `northF21LatchObserved=${r.northF21LatchObserved}`,
      `northF21Latched=${r.northF21Latched}`,
      "",
      `intakeGraphBuilt=${r.intakeGraphBuilt}`,
      `intakeGraphReady=${r.intakeGraphReady}`,
      `intakeGraphStatus=${r.intakeGraphStatus}`,
      `intakeRecordCount=${r.intakeRecordCount}`,
      `acceptedRecordCount=${r.acceptedRecordCount}`,
      `rejectedRecordCount=${r.rejectedRecordCount}`,
      `diagnosticEvidenceCount=${r.diagnosticEvidenceCount}`,
      `supportEngineSignalCount=${r.supportEngineSignalCount}`,
      `routeSignalCount=${r.routeSignalCount}`,
      `canvasSignalCount=${r.canvasSignalCount}`,
      "",
      `intakeQualityScore=${r.intakeQualityScore}`,
      `intakeCoverageScore=${r.intakeCoverageScore}`,
      `intakeTraceScore=${r.intakeTraceScore}`,
      `intakeCoherenceScore=${r.intakeCoherenceScore}`,
      "",
      `f5WestHandoffAuthorized=${r.f5WestHandoffAuthorized}`,
      `f3IntakePacketReady=${r.f3IntakePacketReady}`,
      `f3ActivationStatus=${r.f3ActivationStatus}`,
      `f3ActivationReason=${r.f3ActivationReason}`,
      "",
      `westReceiptAccepted=${r.westReceiptAccepted}`,
      `westRuntimeContract=${r.westRuntimeContract}`,
      `westRuntimeReceipt=${r.westRuntimeReceipt}`,
      "",
      `newsProtocolAligned=${r.newsProtocolAligned}`,
      `fibonacciSynchronizationMetricActive=${r.fibonacciSynchronizationMetricActive}`,
      `fibonacciSynchronizationScore=${r.fibonacciSynchronizationScore}`,
      `activeFibonacci=${r.activeFibonacci}`,
      `activeFibonacciRank=${r.activeFibonacciRank}`,
      `activeNewsGate=${r.activeNewsGate}`,
      `sourceFibonacciGate=${r.sourceFibonacciGate}`,
      `futureFibonacciGate=${r.futureFibonacciGate}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      "",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      "",
      "INTAKE_RECORDS",
      records,
      "",
      "REJECTED_RECORDS",
      rejected,
      "",
      "LOCAL_EVENTS",
      events,
      "",
      "ERRORS",
      errors,
      "",
      `publicSuperiorityClaim=${r.publicSuperiorityClaim}`,
      `publicComparisonClaimAllowed=${r.publicComparisonClaimAllowed}`,
      `benchmarkRequiredBeforePublicClaim=${r.benchmarkRequiredBeforePublicClaim}`,
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function updateDataset() {
    setDataset("labRuntimeTableEastLoaded", "true");
    setDataset("labRuntimeTableEastContract", CONTRACT);
    setDataset("labRuntimeTableEastReceipt", RECEIPT);
    setDataset("labRuntimeTableEastVersion", VERSION);
    setDataset("labRuntimeTableEastFile", FILE);

    setDataset("eastRuntimeTableActive", "true");
    setDataset("eastRuntimeTableF3Only", "true");
    setDataset("eastSupremeJudgeActive", "true");
    setDataset("eastIntakeValveActive", "true");
    setDataset("eastIntakeValveOpen", state.intakeValveOpen);
    setDataset("eastIntakeValveStatus", state.intakeValveStatus);

    setDataset("eastEngineMechanicsPrimary", "true");
    setDataset("eastMathPrimary", "true");
    setDataset("eastArchitectureLabelsSecondary", "true");
    setDataset("eastMechanicalCoordinateId", MECHANICAL_COORDINATE.coordinateId);
    setDataset("eastEnginePart", MECHANICAL_COORDINATE.enginePart);
    setDataset("eastSystemCategory", MECHANICAL_COORDINATE.systemCategory);
    setDataset("eastFibonacciStation", MECHANICAL_COORDINATE.fibonacciStage);
    setDataset("eastMechanicalRole", MECHANICAL_COORDINATE.mechanicalRole);
    setDataset("eastJudicialRole", MECHANICAL_COORDINATE.judicialRole);
    setDataset("eastAuthorityRole", MECHANICAL_COORDINATE.authorityRole);

    setDataset("eastNorthRuntimeObserved", state.northRuntimeObserved);
    setDataset("eastNorthRuntimeAccepted", state.northRuntimeAccepted);
    setDataset("eastNorthF1IgnitionObserved", state.northF1IgnitionObserved);
    setDataset("eastNorthF1IgnitionAccepted", state.northF1IgnitionAccepted);
    setDataset("eastNorthF21Latched", state.northF21Latched);

    setDataset("eastIntakeGraphBuilt", state.intakeGraphBuilt);
    setDataset("eastIntakeGraphReady", state.intakeGraphReady);
    setDataset("eastIntakeGraphStatus", state.intakeGraphStatus);
    setDataset("eastIntakeRecordCount", state.intakeRecordCount);
    setDataset("eastAcceptedRecordCount", state.acceptedRecordCount);
    setDataset("eastRejectedRecordCount", state.rejectedRecordCount);
    setDataset("eastDiagnosticEvidenceCount", state.diagnosticEvidenceCount);
    setDataset("eastSupportEngineSignalCount", state.supportEngineSignalCount);
    setDataset("eastRouteSignalCount", state.routeSignalCount);
    setDataset("eastCanvasSignalCount", state.canvasSignalCount);

    setDataset("eastIntakeQualityScore", state.intakeQualityScore);
    setDataset("eastIntakeCoverageScore", state.intakeCoverageScore);
    setDataset("eastIntakeTraceScore", state.intakeTraceScore);
    setDataset("eastIntakeCoherenceScore", state.intakeCoherenceScore);

    setDataset("eastF5WestHandoffAuthorized", state.f5WestHandoffAuthorized);
    setDataset("eastF3IntakePacketReady", state.f3IntakePacketReady);
    setDataset("eastF3ActivationStatus", state.f3ActivationStatus);
    setDataset("eastF3ActivationReason", state.f3ActivationReason);

    setDataset("eastNewsProtocolAligned", "true");
    setDataset("eastFibonacciSynchronizationMetricActive", "true");
    setDataset("eastFibonacciSynchronizationScore", state.fibonacciSynchronizationScore);
    setDataset("eastActiveFibonacci", FIBONACCI.EAST_INTAKE);
    setDataset("eastActiveFibonacciRank", "3");
    setDataset("eastActiveNewsGate", NEWS_GATES.EAST);
    setDataset("eastSourceFibonacciGate", FIBONACCI.NORTH_ORIGIN);
    setDataset("eastFutureFibonacciGate", FIBONACCI.WEST_PRESSURE);

    setDataset("eastFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("eastRecommendedNextFile", state.recommendedNextFile);
    setDataset("eastRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);

    setDataset("eastPublicSuperiorityClaim", "false");
    setDataset("eastPublicComparisonClaimAllowed", "false");
    setDataset("eastBenchmarkRequiredBeforePublicClaim", "true");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function publishGlobals() {
    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.HEARTH = root.HEARTH || {};

    root.LAB_RUNTIME_TABLE_EAST = api;
    root.LAB_RUNTIME_TABLE_EAST_F3 = api;
    root.RUNTIME_TABLE_EAST = api;
    root.EAST_INTAKE_VALVE = api;
    root.EAST_INTAKE_CHANNEL = api;
    root.EAST_SUPREME_JUDGE = api;
    root.EAST_ADMISSION_BRANCH = api;

    root.DEXTER_LAB.runtimeTableEast = api;
    root.DEXTER_LAB.runtimeTableEastF3 = api;
    root.DEXTER_LAB.cardinalRuntimeTableEast = api;
    root.DEXTER_LAB.eastIntakeValve = api;
    root.DEXTER_LAB.eastSupremeJudge = api;
    root.DEXTER_LAB.eastAdmissionBranch = api;

    root.HEARTH.runtimeTableEast = api;
    root.HEARTH.runtimeTableEastF3 = api;
    root.HEARTH.eastIntakeValve = api;
    root.HEARTH.eastSupremeJudge = api;
    root.HEARTH.eastAdmissionBranch = api;

    const light = getReceiptLight();

    root.LAB_RUNTIME_TABLE_EAST_RECEIPT = light;
    root.LAB_RUNTIME_TABLE_EAST_F3_RECEIPT = light;
    root.RUNTIME_TABLE_EAST_RECEIPT = light;
    root.EAST_INTAKE_VALVE_RECEIPT = light;
    root.EAST_SUPREME_JUDGE_RECEIPT = light;

    root.DEXTER_LAB.runtimeTableEastReceipt = light;
    root.HEARTH.runtimeTableEastReceipt = light;

    root.__LAB_RUNTIME_TABLE_EAST_LOADED__ = true;
    root.__LAB_RUNTIME_TABLE_EAST_CONTRACT__ = CONTRACT;
    root.__LAB_RUNTIME_TABLE_EAST_RECEIPT__ = RECEIPT;
    root.__LAB_RUNTIME_TABLE_EAST_F3_ONLY__ = true;
    root.__LAB_RUNTIME_TABLE_EAST_MECHANICAL_COORDINATE__ = MECHANICAL_COORDINATE.coordinateId;
    root.__LAB_RUNTIME_TABLE_EAST_PUBLIC_SUPERIORITY_CLAIM__ = false;
    root.__LAB_RUNTIME_TABLE_EAST_WEBGL__ = false;
    root.__LAB_RUNTIME_TABLE_EAST_VISUAL_PASS_CLAIMED__ = false;

    updateDataset();
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,

    FIBONACCI,
    NEWS_GATES,
    STATUS,
    INTAKE_CLASS,
    MECHANICAL_COORDINATE,
    WEST_HANDOFF_COORDINATE,

    readNorthRuntimeAuthority,
    readNorthRuntimeReceipt,
    validateNorthRuntimeReceipt,
    acceptNorthRuntimeReceipt,
    receiveNorthRuntimeReceipt,
    acceptNorthIgnition,
    receiveNorthIgnition,
    acceptNorthF1,
    receiveNorthF1,

    classifyIntakePacket,
    evaluateIntakePacket,
    normalizeIntakeRecord,
    acceptIntakePacket,
    receiveIntakePacket,
    submitIntakePacket,

    acceptEastPrimary,
    receiveEastPrimary,
    acceptEastPrimaryGate,
    acceptEastHandoff,
    receiveEastHandoff,
    acceptDiagnosticEvidence,
    acceptRouteSignal,
    acceptCanvasSignal,

    rebuildIntakeGraph,
    computeIntakeQualityMetric,
    computeFibonacciSynchronizationMetric,
    evaluateNewsAlignment,

    setIntakeValveOpen,
    openIntakeValve,
    closeIntakeValve,

    composeF3IntakePacket,
    composeEastReceipt,
    readWestRuntimeAuthority,
    submitF3IntakeToWest,
    submitF3PacketToNorth,

    validateWestReceipt,
    acceptWestReceipt,

    bindStateToMechanicalCoordinate,
    evaluateCoordinateState,
    getMechanicalCoordinatePacket,

    getIntakeGraph,
    getIntakeGraphSummary,
    getIntakeRecords,
    getRejectedRecords,
    findIntakeRecord,

    getReceiptLight,
    getReceipt,
    getReceiptText,
    publishGlobals,
    updateDataset,

    eastRuntimeTableActive: true,
    eastRuntimeTableF3Only: true,
    eastSupremeJudgeActive: true,
    eastIntakeValveActive: true,

    engineMechanicsPrimary: true,
    mathPrimary: true,
    architectureLabelsSecondary: true,

    ownsF3EastIntakeValve: true,
    ownsIntakePacketAdmission: true,
    ownsIntakePacketNormalization: true,
    ownsIntakeClassification: true,
    ownsState256BindingForIntakeRecords: true,
    ownsF5WestHandoffPacket: true,

    ownsNorthF21Latch: false,
    ownsWestF5PressureAdmissibility: false,
    ownsSouthF8ProofReturn: false,
    ownsCanvasF13EvidenceRelease: false,
    ownsSupportEngineInternals: false,
    ownsF233DownstreamReturn: false,
    ownsRouteOrchestration: false,
    ownsPlanetTruth: false,
    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
    ownsActualRendering: false,
    ownsGeneratedImage: false,
    ownsGraphicBox: false,
    ownsWebGL: false,
    ownsPublicSuperiorityClaim: false,
    ownsFinalVisualPassClaim: false,

    publicSuperiorityClaim: false,
    publicComparisonClaimAllowed: false,
    benchmarkRequiredBeforePublicClaim: true,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  state.createdAt = nowIso();
  state.updatedAt = state.createdAt;

  try {
    const northReceipt = readNorthRuntimeReceipt();
    if (northReceipt && Object.keys(northReceipt).length) {
      acceptNorthRuntimeReceipt(northReceipt);
    }
  } catch (error) {
    recordError("INITIAL_NORTH_RUNTIME_READ_FAILED", error);
  }

  try {
    computeFibonacciSynchronizationMetric();
  } catch (error) {
    recordError("INITIAL_EAST_F3_SYNC_METRIC_FAILED", error);
  }

  recordLocal("EAST_F3_ENGINE_MECHANICS_INTAKE_VALVE_LOADED", {
    file: FILE,
    contract: CONTRACT,
    mechanicalCoordinate: MECHANICAL_COORDINATE.coordinateId,
    targetFile: WEST_FILE,
    publicSuperiorityClaim: false
  });

  publishGlobals();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

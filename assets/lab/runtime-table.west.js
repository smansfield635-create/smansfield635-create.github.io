// /assets/lab/runtime-table.west.js
// LAB_RUNTIME_TABLE_WEST_F5_ENGINE_MECHANICS_PRESSURE_ADMISSIBILITY_TNT_v1
// Full-file replacement.
// Runtime Table West / F5 pressure admissibility / West Supreme Judge / compression branch.
// Purpose:
// - Stand up West as the F5 pressure/admissibility channel for the runtime-table v4 engine system.
// - Bind directly to runtime-table v4 mechanics: RT3D-X06_Y19_Z5.
// - Consume East F3 intake packets.
// - Apply pressure, admissibility, constraint, and boundary checks.
// - Return F5 pressure receipts toward North and F8 South proof/output.
// - Preserve the 3D engine lattice + 256 state binding model.
// - Treat architecture labels as secondary and engine mechanics/math as primary.
// - Avoid rendering, generated image claims, WebGL claims, GraphicBox claims, public superiority claims, and final visual pass claims.
// Does not own:
// - North F21 latch
// - East F3 intake admission
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

  const CONTRACT = "LAB_RUNTIME_TABLE_WEST_F5_ENGINE_MECHANICS_PRESSURE_ADMISSIBILITY_TNT_v1";
  const RECEIPT = "LAB_RUNTIME_TABLE_WEST_F5_ENGINE_MECHANICS_PRESSURE_ADMISSIBILITY_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "LAB_RUNTIME_TABLE_WEST_SOURCE_PENDING_RENEWAL";
  const BASELINE_CONTRACT = "LAB_RUNTIME_TABLE_COUNTY_ENGINE_MECHANICS_3D_LATTICE_256_STATE_SUPPORT_ENGINE_TNT_v4";
  const VERSION = "2026-06-08.lab-runtime-table-west-f5-engine-mechanics-pressure-admissibility-v1";

  const FILE = "/assets/lab/runtime-table.west.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const EAST_FILE = "/assets/lab/runtime-table.east.js";
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

  const PRESSURE_CLASS = Object.freeze({
    EAST_INTAKE_PRESSURE: "EAST_INTAKE_PRESSURE",
    DIAGNOSTIC_PRESSURE: "DIAGNOSTIC_PRESSURE",
    SUPPORT_ENGINE_PRESSURE: "SUPPORT_ENGINE_PRESSURE",
    ROUTE_PRESSURE: "ROUTE_PRESSURE",
    CANVAS_PRESSURE: "CANVAS_PRESSURE",
    CONSTRAINT_PRESSURE: "CONSTRAINT_PRESSURE",
    GENERIC_PRESSURE: "GENERIC_PRESSURE"
  });

  const MECHANICAL_COORDINATE = Object.freeze({
    coordinateId: "RT3D-X06_Y19_Z5",
    enginePart: "COMPRESSION",
    enginePartIndex: 6,
    systemCategory: "NINETEEN_PART_SYSTEM",
    systemCategoryIndex: 19,
    fibonacciStage: FIBONACCI.WEST_PRESSURE,
    fibonacciRank: 5,
    fibonacciStation: "WEST_PRESSURE_ADMISSIBILITY",
    mechanicalRole: "WEST_PRESSURE_ADMISSIBILITY",
    judicialRole: "WEST_SUPREME_JUDGE",
    authorityRole: "ADMISSIBILITY_BRANCH",
    mayJudgePressure: true,
    mayLatchF21: false,
    mayAdmitF3Intake: false,
    mayReturnF8Proof: false,
    mayReleaseCanvasF13: false,
    mayRender: false,
    mayClaimPublicSuperiority: false
  });

  const SOUTH_HANDOFF_COORDINATE = Object.freeze({
    coordinateId: "RT3D-X07_Y19_Z8",
    enginePart: "EXHAUST",
    enginePartIndex: 7,
    systemCategory: "NINETEEN_PART_SYSTEM",
    systemCategoryIndex: 19,
    fibonacciStage: FIBONACCI.SOUTH_PROOF,
    fibonacciRank: 8,
    fibonacciStation: "SOUTH_PROOF_EXHAUST_RETURN",
    mechanicalRole: "SOUTH_PROOF_RETURN_TARGET",
    mayJudgePressure: false,
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

    westRuntimeTableActive: true,
    westRuntimeTableF5Only: true,
    westSupremeJudgeActive: true,
    westPressureValveActive: true,
    westCompressionActive: true,
    pressureValveOpen: true,
    pressureValveStatus: STATUS.ACTIVE,

    engineMechanicsPrimary: true,
    mathPrimary: true,
    architectureLabelsSecondary: true,
    mechanicalCoordinate: MECHANICAL_COORDINATE,
    southHandoffCoordinate: SOUTH_HANDOFF_COORDINATE,

    eastRuntimeObserved: false,
    eastRuntimeAccepted: false,
    eastRuntimeContract: "",
    eastRuntimeReceipt: "",
    eastF3IntakeObserved: false,
    eastF3IntakeAccepted: false,

    pressureRecords: [],
    pressureQueue: [],
    rejectedRecords: [],
    pressureRecordCount: 0,
    admissibleRecordCount: 0,
    rejectedRecordCount: 0,
    diagnosticPressureCount: 0,
    supportEnginePressureCount: 0,
    routePressureCount: 0,
    canvasPressureCount: 0,
    constraintPressureCount: 0,

    lastAdmissiblePressure: null,
    lastRejectedPressure: null,

    pressureGraphBuilt: false,
    pressureGraphReady: false,
    pressureGraphStatus: STATUS.HELD,
    pressureGraph: {
      records: [],
      recordsById: {},
      byClass: {},
      byState: {},
      byPressureShell: {},
      edges: [],
      buildId: "",
      builtAt: ""
    },

    pressureQualityMetricActive: true,
    pressureQualityScore: 0,
    pressureCoverageScore: 0,
    pressureTraceScore: 0,
    pressureCoherenceScore: 0,
    admissibilityScore: 0,
    compressionScore: 0,
    boundaryScore: 0,

    f8SouthHandoffAuthorized: false,
    f5PressurePacketReady: false,
    f5ActivationStatus: STATUS.ACTIVE,
    f5ActivationReason: "WEST_F5_PRESSURE_VALVE_ACTIVE_WAITING_EAST_F3_INTAKE",

    southReceiptAccepted: false,
    southReceiptPacket: null,
    southRuntimeContract: "",
    southRuntimeReceipt: "",

    activeFibonacci: FIBONACCI.WEST_PRESSURE,
    activeFibonacciRank: 5,
    activeNewsGate: NEWS_GATES.WEST,
    sourceFibonacciGate: FIBONACCI.EAST_INTAKE,
    futureFibonacciGate: FIBONACCI.SOUTH_PROOF,
    newsProtocolAligned: true,
    fibonacciSynchronizationMetricActive: true,
    fibonacciSynchronizationScore: 0,
    oneActiveGearAtATime: true,

    firstFailedCoordinate: "WAITING_EAST_F3_INTAKE_PACKET",
    recommendedNextFile: SOUTH_FILE,
    recommendedNextRenewalTarget: SOUTH_FILE,

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

  function makeId(value, fallback = "pressure") {
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
      code: safeString(code, "RUNTIME_TABLE_WEST_F5_ERROR"),
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

  function readEastRuntimeAuthority() {
    return firstGlobal([
      "LAB_RUNTIME_TABLE_EAST",
      "LAB_RUNTIME_TABLE_EAST_F3",
      "RUNTIME_TABLE_EAST",
      "EAST_INTAKE_VALVE",
      "EAST_INTAKE_CHANNEL",
      "EAST_SUPREME_JUDGE",
      "EAST_ADMISSION_BRANCH",
      "DEXTER_LAB.runtimeTableEast",
      "DEXTER_LAB.runtimeTableEastF3",
      "DEXTER_LAB.cardinalRuntimeTableEast",
      "DEXTER_LAB.eastIntakeValve",
      "HEARTH.runtimeTableEast",
      "HEARTH.runtimeTableEastF3",
      "HEARTH.eastIntakeValve"
    ]);
  }

  function readEastF3IntakePacket() {
    const authority = readEastRuntimeAuthority();
    if (!authority) return {};

    try {
      if (isFunction(authority.composeF3IntakePacket)) {
        const packet = authority.composeF3IntakePacket();
        if (isObject(packet)) return packet;
      }

      if (isFunction(authority.getReceipt)) {
        const receipt = authority.getReceipt();
        if (isObject(receipt) && isObject(receipt.f3IntakePacket)) return receipt.f3IntakePacket;
      }

      return readReceipt(authority);
    } catch (error) {
      recordError("EAST_F3_INTAKE_PACKET_READ_FAILED", error);
      return {};
    }
  }

  function hasMeaningfulEastF3Packet(packet = {}) {
    if (!isObject(packet)) return false;

    return Boolean(
      packet.contract ||
      packet.receipt ||
      packet.packetType === "EAST_F3_INTAKE_PACKET" ||
      safeBool(packet.eastRuntimeTableActive, false) ||
      safeBool(packet.eastIntakeValveActive, false) ||
      safeBool(packet.f3IntakePacketReady, false) ||
      safeBool(packet.intakeGraphBuilt, false) ||
      Array.isArray(packet.intakeRecords)
    );
  }

  function validateEastF3IntakePacket(packet = {}) {
    const input = isObject(packet) ? packet : {};
    const noForbiddenClaim = !detectForbiddenClaim(input);
    const meaningful = hasMeaningfulEastF3Packet(input);

    const activeFibonacci = safeString(input.activeFibonacci || input.fibonacciStage || input.activeStage || "");
    const futureFibonacciGate = safeString(input.futureFibonacciGate || "");

    const correctStage = Boolean(
      !activeFibonacci ||
      activeFibonacci === FIBONACCI.EAST_INTAKE ||
      activeFibonacci === "F3"
    );

    const correctFuture = Boolean(
      !futureFibonacciGate ||
      futureFibonacciGate === FIBONACCI.WEST_PRESSURE ||
      futureFibonacciGate === "F5"
    );

    const intakeRecordsAcceptable = Boolean(
      Array.isArray(input.intakeRecords) ||
      Array.isArray(input.intakeQueue) ||
      isObject(input.intakeGraph)
    );

    const accepted = Boolean(
      noForbiddenClaim &&
      meaningful &&
      correctStage &&
      correctFuture &&
      intakeRecordsAcceptable
    );

    let reason = "EAST_F3_INTAKE_PACKET_ACCEPTED";
    if (!noForbiddenClaim) reason = "FORBIDDEN_CLAIM_DETECTED_IN_EAST_F3_PACKET";
    else if (!meaningful) reason = "EAST_F3_PACKET_NOT_MEANINGFUL";
    else if (!correctStage) reason = "EAST_F3_PACKET_WRONG_ACTIVE_FIBONACCI";
    else if (!correctFuture) reason = "EAST_F3_PACKET_WRONG_FUTURE_GATE";
    else if (!intakeRecordsAcceptable) reason = "EAST_F3_PACKET_MISSING_INTAKE_RECORD_SOURCE";

    return {
      accepted,
      reason,
      noForbiddenClaim,
      meaningful,
      correctStage,
      correctFuture,
      intakeRecordsAcceptable,
      input: clonePlain(input)
    };
  }

  function acceptEastF3IntakePacket(packet = {}) {
    const validation = validateEastF3IntakePacket(packet);

    if (validation.accepted) {
      state.eastRuntimeObserved = true;
      state.eastRuntimeAccepted = true;
      state.eastRuntimeContract = safeString(packet.contract, "");
      state.eastRuntimeReceipt = safeString(packet.receipt, "");
      state.eastF3IntakeObserved = true;
      state.eastF3IntakeAccepted = true;

      buildPressureGraph(packet);
    }

    recordLocal("EAST_F3_INTAKE_PACKET_EVALUATED_BY_WEST_F5", {
      accepted: validation.accepted,
      reason: validation.reason,
      intakeRecordsPresent: validation.intakeRecordsAcceptable
    });

    computeFibonacciSynchronizationMetric();
    publishGlobals();

    return {
      accepted: validation.accepted,
      westF5ReceivedEast: true,
      reason: validation.reason,
      pressureGraphBuilt: state.pressureGraphBuilt,
      pressureGraphReady: state.pressureGraphReady,
      f8SouthHandoffAuthorized: state.f8SouthHandoffAuthorized,
      recommendedNextFile: validation.accepted ? SOUTH_FILE : EAST_FILE,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function receiveEastF3IntakePacket(packet = {}) {
    return acceptEastF3IntakePacket(packet);
  }

  function submitEastF3IntakePacket(packet = {}) {
    return acceptEastF3IntakePacket(packet);
  }

  function acceptWestIntake(packet = {}) {
    return acceptEastF3IntakePacket(packet);
  }

  function receiveWestIntake(packet = {}) {
    return acceptWestIntake(packet);
  }

  function acceptEastPrimary(packet = {}) {
    return acceptEastF3IntakePacket(packet);
  }

  function receiveEastPrimary(packet = {}) {
    return acceptEastPrimary(packet);
  }

  function acceptWestPrimary(packet = {}) {
    return acceptPressurePacket({
      ...clonePlain(packet),
      packetType: safeString(packet.packetType || "WEST_PRIMARY_PRESSURE_PACKET"),
      activeFibonacci: safeString(packet.activeFibonacci || FIBONACCI.WEST_PRESSURE)
    });
  }

  function receiveWestPrimary(packet = {}) {
    return acceptWestPrimary(packet);
  }

  function classifyPressurePacket(packet = {}) {
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

    let pressureClass = PRESSURE_CLASS.GENERIC_PRESSURE;

    if (
      activeFibonacci === FIBONACCI.EAST_INTAKE ||
      packetType.includes("EAST_F3") ||
      safeBool(input.eastRuntimeTableActive, false) ||
      safeBool(input.eastIntakeValveActive, false)
    ) {
      pressureClass = PRESSURE_CLASS.EAST_INTAKE_PRESSURE;
    } else if (
      /DIAGNOSTIC|RECEIPT|EVIDENCE|PROBE|GAUGE/.test(text)
    ) {
      pressureClass = PRESSURE_CLASS.DIAGNOSTIC_PRESSURE;
    } else if (
      /F34|F55|F89|F144|F233|PRODUCT_ENGINE|UE5_EXPRESSION|REGISTRY|MARKET/.test(text)
    ) {
      pressureClass = PRESSURE_CLASS.SUPPORT_ENGINE_PRESSURE;
    } else if (
      /ROUTE|HEARTH|SHOWROOM|GLOBE/.test(text)
    ) {
      pressureClass = PRESSURE_CLASS.ROUTE_PRESSURE;
    } else if (
      /CANVAS|F13|VISUAL|CHAPEL|FINGER/.test(text)
    ) {
      pressureClass = PRESSURE_CLASS.CANVAS_PRESSURE;
    } else if (
      /CONSTRAINT|BOUNDARY|ADMISSIBLE|PRESSURE|FILTER|SHELL|BASIN/.test(text)
    ) {
      pressureClass = PRESSURE_CLASS.CONSTRAINT_PRESSURE;
    }

    const stateIndex = clamp(
      input.stateIndex !== undefined ? input.stateIndex : stableStateIndex(input),
      0,
      255
    );

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      pressureClass,
      packetType,
      activeFibonacci,
      stateIndex,
      stateId: `ST_${stateIndex}`,
      pressureShellId: `PS_${(stateIndex % 192) + 1}`,
      filterId: `FL_${(stateIndex % 61) + 1}`,
      basinAnchorId: `BA_${(stateIndex % 9) + 1}`,
      forbiddenClaimDetected: detectForbiddenClaim(input),
      packet: clonePlain(input),
      classifiedAt: nowIso()
    };
  }

  function pressureScoreForClassification(classification = {}, packet = {}) {
    const input = isObject(packet) ? packet : {};
    let score = 34;

    if (classification.pressureClass === PRESSURE_CLASS.EAST_INTAKE_PRESSURE) score += 18;
    if (classification.pressureClass === PRESSURE_CLASS.DIAGNOSTIC_PRESSURE) score += 12;
    if (classification.pressureClass === PRESSURE_CLASS.SUPPORT_ENGINE_PRESSURE) score += 12;
    if (classification.pressureClass === PRESSURE_CLASS.ROUTE_PRESSURE) score += 8;
    if (classification.pressureClass === PRESSURE_CLASS.CANVAS_PRESSURE) score += 8;
    if (classification.pressureClass === PRESSURE_CLASS.CONSTRAINT_PRESSURE) score += 14;

    if (input.contract) score += 8;
    if (input.receipt) score += 8;
    if (input.file || input.sourceFile) score += 6;
    if (input.route) score += 6;
    if (Array.isArray(input.intakeRecords) && input.intakeRecords.length) score += 10;
    if (safeBool(input.f3IntakePacketReady, false)) score += 8;

    return clamp(score, 0, 100);
  }

  function evaluatePressurePacket(packet = {}) {
    const classification = classifyPressurePacket(packet);
    const noForbiddenClaim = !classification.forbiddenClaimDetected;

    const activeFibonacci = safeString(
      packet.activeFibonacci || packet.fibonacciStage || packet.activeStage || "",
      ""
    );

    const stageAllowed = Boolean(
      !activeFibonacci ||
      activeFibonacci === FIBONACCI.EAST_INTAKE ||
      activeFibonacci === FIBONACCI.WEST_PRESSURE ||
      activeFibonacci === "F3" ||
      activeFibonacci === "F5"
    );

    const valveOpen = Boolean(state.pressureValveOpen && state.westPressureValveActive);
    const pressureScore = pressureScoreForClassification(classification, packet);
    const pressureWithinShell = pressureScore >= 55;
    const basinAnchored = true;
    const filterPassageAllowed = noForbiddenClaim && pressureScore >= 55;

    const accepted = Boolean(
      noForbiddenClaim &&
      stageAllowed &&
      valveOpen &&
      pressureWithinShell &&
      basinAnchored &&
      filterPassageAllowed
    );

    let reason = "WEST_F5_PRESSURE_ADMISSIBLE";
    if (!noForbiddenClaim) reason = "FORBIDDEN_CLAIM_DETECTED_BY_WEST_F5_PRESSURE_VALVE";
    else if (!stageAllowed) reason = "PRESSURE_STAGE_NOT_ADMISSIBLE_TO_WEST_F5";
    else if (!valveOpen) reason = "WEST_F5_PRESSURE_VALVE_CLOSED";
    else if (!pressureWithinShell) reason = "PRESSURE_BELOW_ADMISSIBLE_SHELL";
    else if (!filterPassageAllowed) reason = "FILTER_PASSAGE_BLOCKED";

    return {
      accepted,
      reason,
      classification,
      coordinate: clonePlain(MECHANICAL_COORDINATE),
      runtimeCondition: `${MECHANICAL_COORDINATE.coordinateId}::${classification.stateId}`,
      pressureScore,
      pressureWithinShell,
      filterPassageAllowed,
      basinAnchored,
      boundaryPass: noForbiddenClaim,
      compressionState: accepted ? "COMPRESSED_AND_ADMISSIBLE" : "HELD_OR_REJECTED",
      nextRecommendedCoordinate: accepted ? SOUTH_HANDOFF_COORDINATE.coordinateId : MECHANICAL_COORDINATE.coordinateId,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      evaluatedAt: nowIso()
    };
  }

  function normalizePressureRecord(packet = {}, evaluation = null) {
    const result = evaluation || evaluatePressurePacket(packet);
    const source = isObject(packet) ? packet : { value: packet };

    const id = makeId(
      source.id ||
      source.packetId ||
      source.receipt ||
      source.contract ||
      `${result.classification.pressureClass}-${Date.now()}-${state.pressureRecords.length + state.rejectedRecords.length + 1}`,
      "west-pressure"
    );

    return {
      id,
      recordId: id,
      pressureClass: result.classification.pressureClass,
      packetType: result.classification.packetType,
      sourceContract: safeString(source.contract || ""),
      sourceReceipt: safeString(source.receipt || ""),
      sourceFile: safeString(source.file || source.sourceFile || ""),
      sourceRoute: safeString(source.route || ""),
      activeFibonacci: safeString(source.activeFibonacci || source.fibonacciStage || source.activeStage || ""),
      stateId: result.classification.stateId,
      stateIndex: result.classification.stateIndex,
      filterId: result.classification.filterId,
      pressureShellId: result.classification.pressureShellId,
      basinAnchorId: result.classification.basinAnchorId,
      coordinateId: MECHANICAL_COORDINATE.coordinateId,
      runtimeCondition: result.runtimeCondition,
      pressureScore: result.pressureScore,
      pressureWithinShell: result.pressureWithinShell,
      filterPassageAllowed: result.filterPassageAllowed,
      basinAnchored: result.basinAnchored,
      boundaryPass: result.boundaryPass,
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

  function acceptPressurePacket(packet = {}) {
    const evaluation = evaluatePressurePacket(packet);
    const record = normalizePressureRecord(packet, evaluation);

    if (evaluation.accepted) {
      state.pressureRecords.push(record);
      state.pressureQueue.push(record);
      state.lastAdmissiblePressure = clonePlain(record);
    } else {
      state.rejectedRecords.push(record);
      state.lastRejectedPressure = clonePlain(record);
    }

    trim(state.pressureRecords);
    trim(state.pressureQueue);
    trim(state.rejectedRecords);

    rebuildPressureGraph({ silent: true });
    computeFibonacciSynchronizationMetric();

    recordLocal("WEST_F5_PRESSURE_PACKET_EVALUATED", {
      accepted: evaluation.accepted,
      reason: evaluation.reason,
      pressureClass: record.pressureClass,
      stateId: record.stateId,
      pressureScore: record.pressureScore,
      runtimeCondition: record.runtimeCondition
    });

    publishGlobals();

    return {
      accepted: evaluation.accepted,
      reason: evaluation.reason,
      record: clonePlain(record),
      pressureClass: record.pressureClass,
      runtimeCondition: record.runtimeCondition,
      f8SouthHandoffAuthorized: state.f8SouthHandoffAuthorized,
      recommendedNextFile: evaluation.accepted ? SOUTH_FILE : FILE,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function receivePressurePacket(packet = {}) {
    return acceptPressurePacket(packet);
  }

  function submitPressurePacket(packet = {}) {
    return acceptPressurePacket(packet);
  }

  function buildPressureGraph(packet = {}, options = {}) {
    const records = [];

    const intakeRecords = Array.isArray(packet.intakeRecords)
      ? packet.intakeRecords
      : Array.isArray(packet.intakeQueue)
        ? packet.intakeQueue
        : isObject(packet.intakeGraph) && Array.isArray(packet.intakeGraph.records)
          ? packet.intakeGraph.records
          : [];

    if (intakeRecords.length) {
      intakeRecords.forEach((item) => {
        const evaluation = evaluatePressurePacket({
          ...clonePlain(item),
          activeFibonacci: FIBONACCI.WEST_PRESSURE,
          packetType: safeString(item.packetType || "EAST_INTAKE_PRESSURE_SOURCE")
        });
        records.push(normalizePressureRecord(item, evaluation));
      });
    } else if (hasMeaningfulEastF3Packet(packet)) {
      const evaluation = evaluatePressurePacket(packet);
      records.push(normalizePressureRecord(packet, evaluation));
    }

    records.forEach((record) => {
      if (record.accepted) {
        state.pressureRecords.push(record);
        state.pressureQueue.push(record);
        state.lastAdmissiblePressure = clonePlain(record);
      } else {
        state.rejectedRecords.push(record);
        state.lastRejectedPressure = clonePlain(record);
      }
    });

    trim(state.pressureRecords);
    trim(state.pressureQueue);
    trim(state.rejectedRecords);

    return rebuildPressureGraph(options);
  }

  function rebuildPressureGraph(options = {}) {
    const records = state.pressureRecords.slice();
    const recordsById = {};
    const byClass = {};
    const byState = {};
    const byPressureShell = {};
    const edges = [];

    records.forEach((record) => {
      recordsById[record.id] = record;

      byClass[record.pressureClass] = byClass[record.pressureClass] || [];
      byClass[record.pressureClass].push(record.id);

      byState[record.stateId] = byState[record.stateId] || [];
      byState[record.stateId].push(record.id);

      byPressureShell[record.pressureShellId] = byPressureShell[record.pressureShellId] || [];
      byPressureShell[record.pressureShellId].push(record.id);

      edges.push({
        from: MECHANICAL_COORDINATE.coordinateId,
        to: record.id,
        type: "west-compression-admissible-record",
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

      if (record.accepted) {
        edges.push({
          from: record.id,
          to: SOUTH_HANDOFF_COORDINATE.coordinateId,
          type: "pressure-to-south-proof-target",
          deterministic: true
        });
      }
    });

    state.pressureGraph = {
      records,
      recordsById,
      byClass,
      byState,
      byPressureShell,
      edges,
      buildId: `west-f5-pressure-graph-${records.length}-${edges.length}`,
      builtAt: nowIso()
    };

    state.pressureGraphBuilt = true;
    state.pressureRecordCount = records.length;
    state.admissibleRecordCount = records.length;
    state.rejectedRecordCount = state.rejectedRecords.length;
    state.diagnosticPressureCount = records.filter((record) => record.pressureClass === PRESSURE_CLASS.DIAGNOSTIC_PRESSURE).length;
    state.supportEnginePressureCount = records.filter((record) => record.pressureClass === PRESSURE_CLASS.SUPPORT_ENGINE_PRESSURE).length;
    state.routePressureCount = records.filter((record) => record.pressureClass === PRESSURE_CLASS.ROUTE_PRESSURE).length;
    state.canvasPressureCount = records.filter((record) => record.pressureClass === PRESSURE_CLASS.CANVAS_PRESSURE).length;
    state.constraintPressureCount = records.filter((record) => record.pressureClass === PRESSURE_CLASS.CONSTRAINT_PRESSURE).length;

    computePressureQualityMetric();

    state.pressureGraphReady = Boolean(
      state.pressureRecordCount > 0 &&
      state.pressureQualityScore >= 62 &&
      state.boundaryScore >= 80
    );

    if (state.pressureGraphReady) {
      state.pressureGraphStatus = state.pressureQualityScore >= 80 ? STATUS.READY : STATUS.DEGRADED;
      state.f8SouthHandoffAuthorized = true;
      state.f5PressurePacketReady = true;
      state.f5ActivationStatus = state.pressureGraphStatus;
      state.f5ActivationReason =
        state.pressureGraphStatus === STATUS.READY
          ? "WEST_F5_PRESSURE_READY_FOR_SOUTH_F8"
          : "WEST_F5_PRESSURE_DEGRADED_SOUTH_F8_HANDOFF_AVAILABLE";
      state.firstFailedCoordinate =
        state.pressureGraphStatus === STATUS.READY
          ? "NONE_WEST_F5_READY_SOUTH_F8_HANDOFF_AUTHORIZED"
          : "NONE_WEST_F5_DEGRADED_SOUTH_F8_HANDOFF_AVAILABLE";
      state.recommendedNextFile = SOUTH_FILE;
      state.recommendedNextRenewalTarget = SOUTH_FILE;
    } else {
      state.pressureGraphStatus = STATUS.HELD;
      state.f8SouthHandoffAuthorized = false;
      state.f5PressurePacketReady = false;
      state.f5ActivationStatus = STATUS.HELD;
      state.f5ActivationReason = "WAITING_LAWFUL_WEST_F5_PRESSURE";
      state.firstFailedCoordinate = "WAITING_LAWFUL_WEST_F5_PRESSURE";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
    }

    computeFibonacciSynchronizationMetric();

    if (options.silent !== true) {
      recordLocal("WEST_F5_PRESSURE_GRAPH_REBUILT", {
        pressureRecordCount: state.pressureRecordCount,
        rejectedRecordCount: state.rejectedRecordCount,
        pressureGraphStatus: state.pressureGraphStatus,
        pressureQualityScore: state.pressureQualityScore
      });
    }

    updateDataset();

    return clonePlain(state.pressureGraph);
  }

  function computePressureQualityMetric() {
    const records = state.pressureRecords || [];
    const count = Math.max(1, records.length);
    const acceptedRatio = records.length / Math.max(1, records.length + state.rejectedRecords.length);
    const traceRatio = records.filter((record) => record.traceReady).length / count;
    const pressureRatio = records.filter((record) => record.pressureWithinShell).length / count;
    const filterRatio = records.filter((record) => record.filterPassageAllowed).length / count;
    const boundaryRatio = records.filter((record) => record.boundaryPass).length / count;

    const classCoverage = [
      records.some((record) => record.pressureClass === PRESSURE_CLASS.EAST_INTAKE_PRESSURE),
      records.some((record) => record.pressureClass === PRESSURE_CLASS.DIAGNOSTIC_PRESSURE),
      records.some((record) => record.pressureClass === PRESSURE_CLASS.SUPPORT_ENGINE_PRESSURE),
      records.some((record) => record.pressureClass === PRESSURE_CLASS.ROUTE_PRESSURE),
      records.some((record) => record.pressureClass === PRESSURE_CLASS.CANVAS_PRESSURE),
      records.some((record) => record.pressureClass === PRESSURE_CLASS.CONSTRAINT_PRESSURE)
    ].filter(Boolean).length / 6;

    state.pressureCoverageScore = clamp(Math.round(classCoverage * 100), 0, 100);
    state.pressureTraceScore = clamp(Math.round(traceRatio * 100), 0, 100);
    state.admissibilityScore = clamp(Math.round(((pressureRatio + filterRatio) / 2) * 100), 0, 100);
    state.compressionScore = clamp(Math.round(records.reduce((sum, record) => sum + safeNumber(record.pressureScore, 0), 0) / count), 0, 100);
    state.boundaryScore = clamp(Math.round(boundaryRatio * 100), 0, 100);

    state.pressureCoherenceScore = clamp(
      Math.round(
        (acceptedRatio * 28) +
        (state.admissibilityScore * 0.20) +
        (state.compressionScore * 0.18) +
        (state.pressureTraceScore * 0.14) +
        (state.pressureCoverageScore * 0.12) +
        (state.boundaryScore * 0.08)
      ),
      0,
      100
    );

    state.pressureQualityScore = clamp(
      Math.round(
        (state.pressureCoherenceScore * 0.34) +
        (state.admissibilityScore * 0.24) +
        (state.compressionScore * 0.18) +
        (state.pressureTraceScore * 0.12) +
        (state.pressureCoverageScore * 0.12)
      ),
      0,
      100
    );

    return {
      pressureQualityScore: state.pressureQualityScore,
      pressureCoverageScore: state.pressureCoverageScore,
      pressureTraceScore: state.pressureTraceScore,
      pressureCoherenceScore: state.pressureCoherenceScore,
      admissibilityScore: state.admissibilityScore,
      compressionScore: state.compressionScore,
      boundaryScore: state.boundaryScore,
      publicSuperiorityClaim: false,
      publicComparisonClaimAllowed: false
    };
  }

  function computeFibonacciSynchronizationMetric() {
    const checks = [
      state.newsProtocolAligned,
      state.oneActiveGearAtATime,
      state.activeFibonacci === FIBONACCI.WEST_PRESSURE,
      state.activeFibonacciRank === 5,
      state.activeNewsGate === NEWS_GATES.WEST,
      state.sourceFibonacciGate === FIBONACCI.EAST_INTAKE,
      state.futureFibonacciGate === FIBONACCI.SOUTH_PROOF,
      state.westRuntimeTableActive,
      state.westSupremeJudgeActive,
      state.westPressureValveActive,
      state.westCompressionActive,
      state.pressureValveOpen,
      state.engineMechanicsPrimary,
      state.mathPrimary,
      state.mechanicalCoordinate.coordinateId === "RT3D-X06_Y19_Z5",
      state.pressureGraphBuilt || state.eastRuntimeObserved,
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

    computePressureQualityMetric();

    return {
      score: state.fibonacciSynchronizationScore,
      passed,
      total: checks.length,
      activeFibonacci: FIBONACCI.WEST_PRESSURE,
      activeFibonacciRank: 5,
      activeNewsGate: NEWS_GATES.WEST,
      sourceFibonacciGate: FIBONACCI.EAST_INTAKE,
      futureFibonacciGate: FIBONACCI.SOUTH_PROOF,
      publicSuperiorityClaim: false
    };
  }

  function evaluateNewsAlignment() {
    const metric = computeFibonacciSynchronizationMetric();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      newsAlignmentContract: "LAB_RUNTIME_TABLE_WEST_F5_NEWS_ALIGNMENT_PROTOCOL_v1",
      newsAlignmentReceipt: "LAB_RUNTIME_TABLE_WEST_F5_NEWS_ALIGNMENT_PROTOCOL_RECEIPT_v1",
      sequence: [
        {
          gate: NEWS_GATES.EAST,
          fibonacci: FIBONACCI.EAST_INTAKE,
          file: EAST_FILE,
          ready: state.eastRuntimeObserved || state.eastF3IntakeObserved
        },
        {
          gate: NEWS_GATES.WEST,
          fibonacci: FIBONACCI.WEST_PRESSURE,
          file: FILE,
          ready: state.pressureGraphReady || state.f5PressurePacketReady
        },
        {
          gate: NEWS_GATES.SOUTH,
          fibonacci: FIBONACCI.SOUTH_PROOF,
          file: SOUTH_FILE,
          ready: state.f8SouthHandoffAuthorized
        }
      ],
      fibonacciSynchronizationScore: metric.score,
      f5Status: state.f5ActivationStatus,
      pressureGraphStatus: state.pressureGraphStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function setPressureValveOpen(open, detail = {}) {
    state.pressureValveOpen = safeBool(open, true);
    state.pressureValveStatus = state.pressureValveOpen ? STATUS.ACTIVE : STATUS.HELD;

    recordLocal("WEST_F5_PRESSURE_VALVE_STATE_CHANGED", {
      pressureValveOpen: state.pressureValveOpen,
      detail: clonePlain(detail)
    });

    computeFibonacciSynchronizationMetric();
    publishGlobals();

    return {
      pressureValveOpen: state.pressureValveOpen,
      pressureValveStatus: state.pressureValveStatus,
      changedAt: nowIso()
    };
  }

  function openPressureValve(detail = {}) {
    return setPressureValveOpen(true, detail);
  }

  function closePressureValve(detail = {}) {
    return setPressureValveOpen(false, detail);
  }

  function composeF5PressurePacket(extra = {}) {
    const metric = computeFibonacciSynchronizationMetric();
    const readyForF8 = Boolean(state.f8SouthHandoffAuthorized || state.pressureGraphStatus === STATUS.DEGRADED);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "WEST_F5_PRESSURE_ADMISSIBILITY_PACKET",
      sourceFile: FILE,
      targetFile: SOUTH_FILE,
      destinationFile: SOUTH_FILE,

      activeFibonacci: FIBONACCI.WEST_PRESSURE,
      activeFibonacciRank: 5,
      activeNewsGate: NEWS_GATES.WEST,
      sourceFibonacciGate: FIBONACCI.EAST_INTAKE,
      futureFibonacciGate: FIBONACCI.SOUTH_PROOF,
      futureFibonacciRank: 8,

      mechanicalCoordinate: clonePlain(MECHANICAL_COORDINATE),
      southHandoffCoordinate: clonePlain(SOUTH_HANDOFF_COORDINATE),
      engineMechanicsPrimary: true,
      mathPrimary: true,
      architectureLabelsSecondary: true,

      westRuntimeTableActive: true,
      westRuntimeTableF5Only: true,
      westSupremeJudgeActive: true,
      westPressureValveActive: true,
      westCompressionActive: true,
      pressureValveOpen: state.pressureValveOpen,
      pressureValveStatus: state.pressureValveStatus,

      eastRuntimeObserved: state.eastRuntimeObserved,
      eastRuntimeAccepted: state.eastRuntimeAccepted,
      eastRuntimeContract: state.eastRuntimeContract,
      eastRuntimeReceipt: state.eastRuntimeReceipt,
      eastF3IntakeObserved: state.eastF3IntakeObserved,
      eastF3IntakeAccepted: state.eastF3IntakeAccepted,

      pressureGraphBuilt: state.pressureGraphBuilt,
      pressureGraphReady: state.pressureGraphReady,
      pressureGraphStatus: state.pressureGraphStatus,
      pressureRecordCount: state.pressureRecordCount,
      admissibleRecordCount: state.admissibleRecordCount,
      rejectedRecordCount: state.rejectedRecordCount,
      diagnosticPressureCount: state.diagnosticPressureCount,
      supportEnginePressureCount: state.supportEnginePressureCount,
      routePressureCount: state.routePressureCount,
      canvasPressureCount: state.canvasPressureCount,
      constraintPressureCount: state.constraintPressureCount,

      pressureQualityScore: state.pressureQualityScore,
      pressureCoverageScore: state.pressureCoverageScore,
      pressureTraceScore: state.pressureTraceScore,
      pressureCoherenceScore: state.pressureCoherenceScore,
      admissibilityScore: state.admissibilityScore,
      compressionScore: state.compressionScore,
      boundaryScore: state.boundaryScore,

      pressureRecords: clonePlain(state.pressureRecords),
      pressureQueue: clonePlain(state.pressureQueue),
      rejectedRecords: clonePlain(state.rejectedRecords),
      pressureGraph: clonePlain(state.pressureGraph),

      f8SouthHandoffAuthorized: readyForF8,
      f5PressurePacketReady: readyForF8,
      f5ActivationStatus: state.f5ActivationStatus,
      f5ActivationReason: state.f5ActivationReason,

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

  function composeWestReceipt() {
    return getReceipt();
  }

  function readSouthRuntimeAuthority() {
    return firstGlobal([
      "LAB_RUNTIME_TABLE_SOUTH",
      "LAB_RUNTIME_TABLE_SOUTH_F8",
      "RUNTIME_TABLE_SOUTH",
      "SOUTH_PROOF_RETURN",
      "SOUTH_OUTPUT_EXHAUST",
      "SOUTH_SUPREME_JUDGE",
      "DEXTER_LAB.runtimeTableSouth",
      "DEXTER_LAB.cardinalRuntimeTableSouth",
      "DEXTER_LAB.southProofReturn",
      "HEARTH.runtimeTableSouth",
      "HEARTH.southProofReturn"
    ]);
  }

  function submitF5PressureToSouth(extra = {}) {
    const south = readSouthRuntimeAuthority();

    if (!south) {
      return {
        submitted: false,
        reason: "SOUTH_RUNTIME_TABLE_UNAVAILABLE",
        recommendedNextFile: SOUTH_FILE,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };
    }

    const packet = composeF5PressurePacket(extra);

    try {
      if (isFunction(south.acceptWestF5PressurePacket)) {
        return {
          submitted: true,
          method: "acceptWestF5PressurePacket",
          response: clonePlain(south.acceptWestF5PressurePacket(packet))
        };
      }

      if (isFunction(south.acceptWestPrimary)) {
        return {
          submitted: true,
          method: "acceptWestPrimary",
          response: clonePlain(south.acceptWestPrimary(packet))
        };
      }

      if (isFunction(south.acceptSouthPrimary)) {
        return {
          submitted: true,
          method: "acceptSouthPrimary",
          response: clonePlain(south.acceptSouthPrimary(packet))
        };
      }

      if (isFunction(south.receiveSouthPrimary)) {
        return {
          submitted: true,
          method: "receiveSouthPrimary",
          response: clonePlain(south.receiveSouthPrimary(packet))
        };
      }
    } catch (error) {
      recordError("WEST_F5_PACKET_SUBMISSION_TO_SOUTH_FAILED", error);
      return {
        submitted: false,
        reason: "WEST_F5_PACKET_SUBMISSION_TO_SOUTH_FAILED"
      };
    }

    return {
      submitted: false,
      reason: "SOUTH_RUNTIME_TABLE_F5_PRESSURE_METHOD_UNAVAILABLE",
      recommendedNextFile: SOUTH_FILE
    };
  }

  function submitF5PacketToNorth(extra = {}) {
    const north = firstGlobal([
      "LAB_RUNTIME_TABLE",
      "LAB_RUNTIME_TABLE_NORTH",
      "RUNTIME_TABLE",
      "DEXTER_LAB.runtimeTable",
      "HEARTH.northCommandRuntimeTable",
      "HEARTH.runtimeTable"
    ]);

    if (!north) {
      return {
        submitted: false,
        reason: "NORTH_RUNTIME_TABLE_UNAVAILABLE",
        recommendedNextFile: NORTH_FILE
      };
    }

    const packet = composeF5PressurePacket(extra);

    try {
      if (isFunction(north.acceptWestPrimary)) {
        return {
          submitted: true,
          method: "acceptWestPrimary",
          response: clonePlain(north.acceptWestPrimary(packet))
        };
      }

      if (isFunction(north.acceptWestPrimaryGate)) {
        return {
          submitted: true,
          method: "acceptWestPrimaryGate",
          response: clonePlain(north.acceptWestPrimaryGate(packet))
        };
      }

      if (isFunction(north.acceptWestHandoff)) {
        return {
          submitted: true,
          method: "acceptWestHandoff",
          response: clonePlain(north.acceptWestHandoff(packet))
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
      recordError("WEST_F5_PACKET_SUBMISSION_TO_NORTH_FAILED", error);
      return {
        submitted: false,
        reason: "WEST_F5_PACKET_SUBMISSION_TO_NORTH_FAILED"
      };
    }

    return {
      submitted: false,
      reason: "NORTH_RUNTIME_TABLE_WEST_PRESSURE_METHOD_UNAVAILABLE",
      recommendedNextFile: NORTH_FILE
    };
  }

  function validateSouthReceipt(packet = {}) {
    const input = isObject(packet) ? packet : {};
    const noForbiddenClaim = !detectForbiddenClaim(input);

    const southRecognized = Boolean(
      safeBool(input.southRuntimeTableActive, false) ||
      safeBool(input.southProofReturnActive, false) ||
      safeBool(input.southSupremeJudgeActive, false) ||
      safeString(input.activeFibonacci || "") === FIBONACCI.SOUTH_PROOF ||
      safeString(input.contract || "").includes("SOUTH") ||
      safeString(input.receipt || "").includes("SOUTH")
    );

    const ok = Boolean(noForbiddenClaim && southRecognized);

    let reason = "SOUTH_F8_RECEIPT_ACCEPTED";
    if (!noForbiddenClaim) reason = "FORBIDDEN_CLAIM_DETECTED_IN_SOUTH_RECEIPT";
    else if (!southRecognized) reason = "UNRECOGNIZED_SOUTH_F8_RECEIPT";

    return {
      ok,
      reason,
      noForbiddenClaim,
      southRecognized,
      input: clonePlain(input)
    };
  }

  function acceptSouthReceipt(packet = {}) {
    const validation = validateSouthReceipt(packet);

    state.southReceiptAccepted = validation.ok;
    state.southReceiptPacket = clonePlain(packet);

    if (validation.input.contract) state.southRuntimeContract = safeString(validation.input.contract);
    if (validation.input.receipt) state.southRuntimeReceipt = safeString(validation.input.receipt);

    recordLocal("SOUTH_F8_RECEIPT_RECEIVED_BY_WEST_F5", {
      accepted: validation.ok,
      reason: validation.reason,
      contract: state.southRuntimeContract
    });

    publishGlobals();

    return {
      accepted: validation.ok,
      westF5ReceivedSouth: true,
      reason: validation.reason,
      recommendedNextFile: validation.ok ? NORTH_FILE : SOUTH_FILE,
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
      bindingType: "WEST_F5_MECHANICAL_COORDINATE_PLUS_STATE_256",
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
    const pressureScore = pressureScoreForClassification(classifyPressurePacket(input), input);
    const allowed = Boolean(
      state.pressureValveOpen &&
      state.westPressureValveActive &&
      pressureScore >= 55 &&
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
      pressureWithinShell: pressureScore >= 55,
      pressureScore,
      basinAnchored: true,
      envelopeContained: true,
      runtimeExpressionAllowed: allowed,
      valveState: allowed ? "OPEN" : "CLOSED",
      compressionState: allowed ? "COMPRESSED_AND_ADMISSIBLE" : "HELD_OR_REJECTED",
      evaluatedAt: nowIso()
    };
  }

  function getMechanicalCoordinatePacket() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      mechanicalCoordinate: clonePlain(MECHANICAL_COORDINATE),
      southHandoffCoordinate: clonePlain(SOUTH_HANDOFF_COORDINATE),
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

  function getPressureGraph() {
    return clonePlain(state.pressureGraph);
  }

  function getPressureGraphSummary() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      pressureGraphBuilt: state.pressureGraphBuilt,
      pressureGraphReady: state.pressureGraphReady,
      pressureGraphStatus: state.pressureGraphStatus,
      pressureRecordCount: state.pressureRecordCount,
      admissibleRecordCount: state.admissibleRecordCount,
      rejectedRecordCount: state.rejectedRecordCount,
      diagnosticPressureCount: state.diagnosticPressureCount,
      supportEnginePressureCount: state.supportEnginePressureCount,
      routePressureCount: state.routePressureCount,
      canvasPressureCount: state.canvasPressureCount,
      constraintPressureCount: state.constraintPressureCount,
      pressureQualityScore: state.pressureQualityScore,
      pressureCoverageScore: state.pressureCoverageScore,
      pressureTraceScore: state.pressureTraceScore,
      pressureCoherenceScore: state.pressureCoherenceScore,
      admissibilityScore: state.admissibilityScore,
      compressionScore: state.compressionScore,
      boundaryScore: state.boundaryScore,
      updatedAt: nowIso()
    };
  }

  function getPressureRecords(pressureClass = "") {
    const records = state.pressureRecords || [];
    if (!pressureClass) return clonePlain(records);
    return clonePlain(records.filter((record) => record.pressureClass === pressureClass));
  }

  function getRejectedRecords() {
    return clonePlain(state.rejectedRecords);
  }

  function findPressureRecord(id) {
    const key = makeId(id, "");
    return clonePlain((state.pressureGraph.recordsById || {})[key] || null);
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

      westRuntimeTableActive: true,
      westRuntimeTableF5Only: true,
      westSupremeJudgeActive: true,
      westPressureValveActive: true,
      westCompressionActive: true,
      pressureValveOpen: state.pressureValveOpen,
      pressureValveStatus: state.pressureValveStatus,

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

      eastRuntimeObserved: state.eastRuntimeObserved,
      eastRuntimeAccepted: state.eastRuntimeAccepted,
      eastRuntimeContract: state.eastRuntimeContract,
      eastRuntimeReceipt: state.eastRuntimeReceipt,
      eastF3IntakeObserved: state.eastF3IntakeObserved,
      eastF3IntakeAccepted: state.eastF3IntakeAccepted,

      pressureGraphBuilt: state.pressureGraphBuilt,
      pressureGraphReady: state.pressureGraphReady,
      pressureGraphStatus: state.pressureGraphStatus,
      pressureRecordCount: state.pressureRecordCount,
      admissibleRecordCount: state.admissibleRecordCount,
      rejectedRecordCount: state.rejectedRecordCount,
      diagnosticPressureCount: state.diagnosticPressureCount,
      supportEnginePressureCount: state.supportEnginePressureCount,
      routePressureCount: state.routePressureCount,
      canvasPressureCount: state.canvasPressureCount,
      constraintPressureCount: state.constraintPressureCount,

      pressureQualityMetricActive: true,
      pressureQualityScore: state.pressureQualityScore,
      pressureCoverageScore: state.pressureCoverageScore,
      pressureTraceScore: state.pressureTraceScore,
      pressureCoherenceScore: state.pressureCoherenceScore,
      admissibilityScore: state.admissibilityScore,
      compressionScore: state.compressionScore,
      boundaryScore: state.boundaryScore,

      f8SouthHandoffAuthorized: state.f8SouthHandoffAuthorized,
      f5PressurePacketReady: state.f5PressurePacketReady,
      f5ActivationStatus: state.f5ActivationStatus,
      f5ActivationReason: state.f5ActivationReason,

      southReceiptAccepted: state.southReceiptAccepted,
      southRuntimeContract: state.southRuntimeContract,
      southRuntimeReceipt: state.southRuntimeReceipt,

      newsProtocolAligned: true,
      fibonacciSynchronizationMetricActive: true,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      activeFibonacci: FIBONACCI.WEST_PRESSURE,
      activeFibonacciRank: 5,
      activeNewsGate: NEWS_GATES.WEST,
      sourceFibonacciGate: FIBONACCI.EAST_INTAKE,
      futureFibonacciGate: FIBONACCI.SOUTH_PROOF,
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

      westF5Receipt: true,
      westSupremeJudgeReceipt: true,
      westPressureValveReceipt: true,

      westRuntimeOwns: [
        "F5 West pressure valve",
        "pressure packet evaluation",
        "admissibility classification",
        "constraint and boundary checking",
        "256 state pressure binding",
        "F8 South proof handoff packet"
      ],
      westRuntimeDoesNotOwn: [
        "North F21 latch",
        "East F3 intake admission",
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
        east: EAST_FILE,
        west: FILE,
        south: SOUTH_FILE,
        canvas: CANVAS_FILE,
        productEngine: F34_PRODUCT_ENGINE_FILE,
        ue5Expression: F55_EXPRESSION_FILE,
        registry: F89_REGISTRY_FILE,
        market: F144_MARKET_FILE
      },

      pressureClasses: clonePlain(PRESSURE_CLASS),
      fibonacciMap: clonePlain(FIBONACCI),
      newsGates: clonePlain(NEWS_GATES),
      mechanicalCoordinate: clonePlain(MECHANICAL_COORDINATE),
      southHandoffCoordinate: clonePlain(SOUTH_HANDOFF_COORDINATE),
      mechanicalCoordinatePacket: getMechanicalCoordinatePacket(),

      pressureGraph: getPressureGraph(),
      pressureGraphSummary: getPressureGraphSummary(),
      pressureRecords: getPressureRecords(),
      rejectedRecords: getRejectedRecords(),

      pressureQuality: computePressureQualityMetric(),
      newsAlignment: evaluateNewsAlignment(),
      f5PressurePacket: composeF5PressurePacket(),
      southReceiptPacket: clonePlain(state.southReceiptPacket),

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

    const records = (r.pressureRecords || []).map((record) => (
      `- ${record.id} :: class=${record.pressureClass} :: state=${record.stateId} :: score=${record.pressureScore} :: accepted=${record.accepted} :: shell=${record.pressureShellId} :: filter=${record.filterId} :: reason=${record.reason}`
    )).join("\n") || "- none";

    const rejected = (r.rejectedRecords || []).map((record) => (
      `- ${record.id} :: class=${record.pressureClass} :: state=${record.stateId} :: score=${record.pressureScore} :: reason=${record.reason}`
    )).join("\n") || "- none";

    const events = (r.localEvents || []).slice(-48).map((item) => (
      `- ${item.at} :: ${item.event} :: ${JSON.stringify(item.detail || {})}`
    )).join("\n") || "- none";

    const errors = (r.errors || []).map((item) => (
      `- ${item.at} :: ${item.code} :: ${item.message}`
    )).join("\n") || "- none";

    return [
      "LAB_RUNTIME_TABLE_WEST_F5_ENGINE_MECHANICS_PRESSURE_ADMISSIBILITY_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      "",
      `westRuntimeTableActive=${r.westRuntimeTableActive}`,
      `westRuntimeTableF5Only=${r.westRuntimeTableF5Only}`,
      `westSupremeJudgeActive=${r.westSupremeJudgeActive}`,
      `westPressureValveActive=${r.westPressureValveActive}`,
      `westCompressionActive=${r.westCompressionActive}`,
      `pressureValveOpen=${r.pressureValveOpen}`,
      `pressureValveStatus=${r.pressureValveStatus}`,
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
      `eastRuntimeObserved=${r.eastRuntimeObserved}`,
      `eastRuntimeAccepted=${r.eastRuntimeAccepted}`,
      `eastRuntimeContract=${r.eastRuntimeContract}`,
      `eastRuntimeReceipt=${r.eastRuntimeReceipt}`,
      `eastF3IntakeObserved=${r.eastF3IntakeObserved}`,
      `eastF3IntakeAccepted=${r.eastF3IntakeAccepted}`,
      "",
      `pressureGraphBuilt=${r.pressureGraphBuilt}`,
      `pressureGraphReady=${r.pressureGraphReady}`,
      `pressureGraphStatus=${r.pressureGraphStatus}`,
      `pressureRecordCount=${r.pressureRecordCount}`,
      `admissibleRecordCount=${r.admissibleRecordCount}`,
      `rejectedRecordCount=${r.rejectedRecordCount}`,
      `diagnosticPressureCount=${r.diagnosticPressureCount}`,
      `supportEnginePressureCount=${r.supportEnginePressureCount}`,
      `routePressureCount=${r.routePressureCount}`,
      `canvasPressureCount=${r.canvasPressureCount}`,
      `constraintPressureCount=${r.constraintPressureCount}`,
      "",
      `pressureQualityScore=${r.pressureQualityScore}`,
      `pressureCoverageScore=${r.pressureCoverageScore}`,
      `pressureTraceScore=${r.pressureTraceScore}`,
      `pressureCoherenceScore=${r.pressureCoherenceScore}`,
      `admissibilityScore=${r.admissibilityScore}`,
      `compressionScore=${r.compressionScore}`,
      `boundaryScore=${r.boundaryScore}`,
      "",
      `f8SouthHandoffAuthorized=${r.f8SouthHandoffAuthorized}`,
      `f5PressurePacketReady=${r.f5PressurePacketReady}`,
      `f5ActivationStatus=${r.f5ActivationStatus}`,
      `f5ActivationReason=${r.f5ActivationReason}`,
      "",
      `southReceiptAccepted=${r.southReceiptAccepted}`,
      `southRuntimeContract=${r.southRuntimeContract}`,
      `southRuntimeReceipt=${r.southRuntimeReceipt}`,
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
      "PRESSURE_RECORDS",
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
    setDataset("labRuntimeTableWestLoaded", "true");
    setDataset("labRuntimeTableWestContract", CONTRACT);
    setDataset("labRuntimeTableWestReceipt", RECEIPT);
    setDataset("labRuntimeTableWestVersion", VERSION);
    setDataset("labRuntimeTableWestFile", FILE);

    setDataset("westRuntimeTableActive", "true");
    setDataset("westRuntimeTableF5Only", "true");
    setDataset("westSupremeJudgeActive", "true");
    setDataset("westPressureValveActive", "true");
    setDataset("westCompressionActive", "true");
    setDataset("westPressureValveOpen", state.pressureValveOpen);
    setDataset("westPressureValveStatus", state.pressureValveStatus);

    setDataset("westEngineMechanicsPrimary", "true");
    setDataset("westMathPrimary", "true");
    setDataset("westArchitectureLabelsSecondary", "true");
    setDataset("westMechanicalCoordinateId", MECHANICAL_COORDINATE.coordinateId);
    setDataset("westEnginePart", MECHANICAL_COORDINATE.enginePart);
    setDataset("westSystemCategory", MECHANICAL_COORDINATE.systemCategory);
    setDataset("westFibonacciStation", MECHANICAL_COORDINATE.fibonacciStage);
    setDataset("westMechanicalRole", MECHANICAL_COORDINATE.mechanicalRole);
    setDataset("westJudicialRole", MECHANICAL_COORDINATE.judicialRole);
    setDataset("westAuthorityRole", MECHANICAL_COORDINATE.authorityRole);

    setDataset("westEastRuntimeObserved", state.eastRuntimeObserved);
    setDataset("westEastRuntimeAccepted", state.eastRuntimeAccepted);
    setDataset("westEastF3IntakeObserved", state.eastF3IntakeObserved);
    setDataset("westEastF3IntakeAccepted", state.eastF3IntakeAccepted);

    setDataset("westPressureGraphBuilt", state.pressureGraphBuilt);
    setDataset("westPressureGraphReady", state.pressureGraphReady);
    setDataset("westPressureGraphStatus", state.pressureGraphStatus);
    setDataset("westPressureRecordCount", state.pressureRecordCount);
    setDataset("westAdmissibleRecordCount", state.admissibleRecordCount);
    setDataset("westRejectedRecordCount", state.rejectedRecordCount);
    setDataset("westDiagnosticPressureCount", state.diagnosticPressureCount);
    setDataset("westSupportEnginePressureCount", state.supportEnginePressureCount);
    setDataset("westRoutePressureCount", state.routePressureCount);
    setDataset("westCanvasPressureCount", state.canvasPressureCount);
    setDataset("westConstraintPressureCount", state.constraintPressureCount);

    setDataset("westPressureQualityScore", state.pressureQualityScore);
    setDataset("westPressureCoverageScore", state.pressureCoverageScore);
    setDataset("westPressureTraceScore", state.pressureTraceScore);
    setDataset("westPressureCoherenceScore", state.pressureCoherenceScore);
    setDataset("westAdmissibilityScore", state.admissibilityScore);
    setDataset("westCompressionScore", state.compressionScore);
    setDataset("westBoundaryScore", state.boundaryScore);

    setDataset("westF8SouthHandoffAuthorized", state.f8SouthHandoffAuthorized);
    setDataset("westF5PressurePacketReady", state.f5PressurePacketReady);
    setDataset("westF5ActivationStatus", state.f5ActivationStatus);
    setDataset("westF5ActivationReason", state.f5ActivationReason);

    setDataset("westNewsProtocolAligned", "true");
    setDataset("westFibonacciSynchronizationMetricActive", "true");
    setDataset("westFibonacciSynchronizationScore", state.fibonacciSynchronizationScore);
    setDataset("westActiveFibonacci", FIBONACCI.WEST_PRESSURE);
    setDataset("westActiveFibonacciRank", "5");
    setDataset("westActiveNewsGate", NEWS_GATES.WEST);
    setDataset("westSourceFibonacciGate", FIBONACCI.EAST_INTAKE);
    setDataset("westFutureFibonacciGate", FIBONACCI.SOUTH_PROOF);

    setDataset("westFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("westRecommendedNextFile", state.recommendedNextFile);
    setDataset("westRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);

    setDataset("westPublicSuperiorityClaim", "false");
    setDataset("westPublicComparisonClaimAllowed", "false");
    setDataset("westBenchmarkRequiredBeforePublicClaim", "true");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function publishGlobals() {
    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.HEARTH = root.HEARTH || {};

    root.LAB_RUNTIME_TABLE_WEST = api;
    root.LAB_RUNTIME_TABLE_WEST_F5 = api;
    root.RUNTIME_TABLE_WEST = api;
    root.WEST_PRESSURE_VALVE = api;
    root.WEST_PRESSURE_ADMISSIBILITY = api;
    root.WEST_SUPREME_JUDGE = api;
    root.WEST_ADMISSIBILITY_BRANCH = api;

    root.DEXTER_LAB.runtimeTableWest = api;
    root.DEXTER_LAB.runtimeTableWestF5 = api;
    root.DEXTER_LAB.cardinalRuntimeTableWest = api;
    root.DEXTER_LAB.westPressureValve = api;
    root.DEXTER_LAB.westSupremeJudge = api;
    root.DEXTER_LAB.westAdmissibilityBranch = api;

    root.HEARTH.runtimeTableWest = api;
    root.HEARTH.runtimeTableWestF5 = api;
    root.HEARTH.westPressureValve = api;
    root.HEARTH.westSupremeJudge = api;
    root.HEARTH.westAdmissibilityBranch = api;

    const light = getReceiptLight();

    root.LAB_RUNTIME_TABLE_WEST_RECEIPT = light;
    root.LAB_RUNTIME_TABLE_WEST_F5_RECEIPT = light;
    root.RUNTIME_TABLE_WEST_RECEIPT = light;
    root.WEST_PRESSURE_VALVE_RECEIPT = light;
    root.WEST_SUPREME_JUDGE_RECEIPT = light;

    root.DEXTER_LAB.runtimeTableWestReceipt = light;
    root.HEARTH.runtimeTableWestReceipt = light;

    root.__LAB_RUNTIME_TABLE_WEST_LOADED__ = true;
    root.__LAB_RUNTIME_TABLE_WEST_CONTRACT__ = CONTRACT;
    root.__LAB_RUNTIME_TABLE_WEST_RECEIPT__ = RECEIPT;
    root.__LAB_RUNTIME_TABLE_WEST_F5_ONLY__ = true;
    root.__LAB_RUNTIME_TABLE_WEST_MECHANICAL_COORDINATE__ = MECHANICAL_COORDINATE.coordinateId;
    root.__LAB_RUNTIME_TABLE_WEST_PUBLIC_SUPERIORITY_CLAIM__ = false;
    root.__LAB_RUNTIME_TABLE_WEST_WEBGL__ = false;
    root.__LAB_RUNTIME_TABLE_WEST_VISUAL_PASS_CLAIMED__ = false;

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
    PRESSURE_CLASS,
    MECHANICAL_COORDINATE,
    SOUTH_HANDOFF_COORDINATE,

    readEastRuntimeAuthority,
    readEastF3IntakePacket,
    hasMeaningfulEastF3Packet,
    validateEastF3IntakePacket,
    acceptEastF3IntakePacket,
    receiveEastF3IntakePacket,
    submitEastF3IntakePacket,
    acceptWestIntake,
    receiveWestIntake,
    acceptEastPrimary,
    receiveEastPrimary,
    acceptWestPrimary,
    receiveWestPrimary,

    classifyPressurePacket,
    pressureScoreForClassification,
    evaluatePressurePacket,
    normalizePressureRecord,
    acceptPressurePacket,
    receivePressurePacket,
    submitPressurePacket,

    buildPressureGraph,
    rebuildPressureGraph,
    computePressureQualityMetric,
    computeFibonacciSynchronizationMetric,
    evaluateNewsAlignment,

    setPressureValveOpen,
    openPressureValve,
    closePressureValve,

    composeF5PressurePacket,
    composeWestReceipt,
    readSouthRuntimeAuthority,
    submitF5PressureToSouth,
    submitF5PacketToNorth,

    validateSouthReceipt,
    acceptSouthReceipt,

    bindStateToMechanicalCoordinate,
    evaluateCoordinateState,
    getMechanicalCoordinatePacket,

    getPressureGraph,
    getPressureGraphSummary,
    getPressureRecords,
    getRejectedRecords,
    findPressureRecord,

    getReceiptLight,
    getReceipt,
    getReceiptText,
    publishGlobals,
    updateDataset,

    westRuntimeTableActive: true,
    westRuntimeTableF5Only: true,
    westSupremeJudgeActive: true,
    westPressureValveActive: true,
    westCompressionActive: true,

    engineMechanicsPrimary: true,
    mathPrimary: true,
    architectureLabelsSecondary: true,

    ownsF5WestPressureValve: true,
    ownsPressurePacketEvaluation: true,
    ownsAdmissibilityClassification: true,
    ownsConstraintAndBoundaryChecking: true,
    ownsState256PressureBinding: true,
    ownsF8SouthProofHandoffPacket: true,

    ownsNorthF21Latch: false,
    ownsEastF3IntakeAdmission: false,
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
    const eastPacket = readEastF3IntakePacket();
    if (hasMeaningfulEastF3Packet(eastPacket)) {
      acceptEastF3IntakePacket(eastPacket);
    }
  } catch (error) {
    recordError("INITIAL_EAST_F3_PACKET_READ_FAILED", error);
  }

  try {
    computeFibonacciSynchronizationMetric();
  } catch (error) {
    recordError("INITIAL_WEST_F5_SYNC_METRIC_FAILED", error);
  }

  recordLocal("WEST_F5_ENGINE_MECHANICS_PRESSURE_ADMISSIBILITY_LOADED", {
    file: FILE,
    contract: CONTRACT,
    mechanicalCoordinate: MECHANICAL_COORDINATE.coordinateId,
    targetFile: SOUTH_FILE,
    publicSuperiorityClaim: false
  });

  publishGlobals();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

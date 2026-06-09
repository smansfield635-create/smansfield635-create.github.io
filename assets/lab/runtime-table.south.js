// /assets/lab/runtime-table.south.js
// LAB_RUNTIME_TABLE_SOUTH_F8_ENGINE_MECHANICS_PROOF_RETURN_TNT_v1
// Full-file replacement.
// Runtime Table South / F8 proof return / South Supreme Judge / output exhaust branch.
// Purpose:
// - Stand up South as the F8 proof/output return channel for the runtime-table v4 engine system.
// - Bind directly to runtime-table v4 mechanics: RT3D-X07_Y19_Z8.
// - Consume West F5 pressure/admissibility packets.
// - Convert admissible pressure records into proof records, output receipts, and North-return evidence.
// - Prepare F8 proof packets toward North F21 eligibility and optional Canvas F13 evidence intake.
// - Preserve the 3D engine lattice + 256 state binding model.
// - Treat architecture labels as secondary and engine mechanics/math as primary.
// - Avoid rendering, generated image claims, WebGL claims, GraphicBox claims, public superiority claims, and final visual pass claims.
// Does not own:
// - North F21 latch
// - East F3 intake admission
// - West F5 pressure/admissibility
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

  const CONTRACT = "LAB_RUNTIME_TABLE_SOUTH_F8_ENGINE_MECHANICS_PROOF_RETURN_TNT_v1";
  const RECEIPT = "LAB_RUNTIME_TABLE_SOUTH_F8_ENGINE_MECHANICS_PROOF_RETURN_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "LAB_RUNTIME_TABLE_SOUTH_SOURCE_PENDING_RENEWAL";
  const BASELINE_CONTRACT = "LAB_RUNTIME_TABLE_COUNTY_ENGINE_MECHANICS_3D_LATTICE_256_STATE_SUPPORT_ENGINE_TNT_v4";
  const VERSION = "2026-06-08.lab-runtime-table-south-f8-engine-mechanics-proof-return-v1";

  const FILE = "/assets/lab/runtime-table.south.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const EAST_FILE = "/assets/lab/runtime-table.east.js";
  const WEST_FILE = "/assets/lab/runtime-table.west.js";
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

  const PROOF_CLASS = Object.freeze({
    WEST_PRESSURE_PROOF: "WEST_PRESSURE_PROOF",
    DIAGNOSTIC_PROOF: "DIAGNOSTIC_PROOF",
    SUPPORT_ENGINE_PROOF: "SUPPORT_ENGINE_PROOF",
    ROUTE_PROOF: "ROUTE_PROOF",
    CANVAS_PROOF: "CANVAS_PROOF",
    CONSTRAINT_PROOF: "CONSTRAINT_PROOF",
    GENERIC_PROOF: "GENERIC_PROOF"
  });

  const MECHANICAL_COORDINATE = Object.freeze({
    coordinateId: "RT3D-X07_Y19_Z8",
    enginePart: "EXHAUST",
    enginePartIndex: 7,
    systemCategory: "NINETEEN_PART_SYSTEM",
    systemCategoryIndex: 19,
    fibonacciStage: FIBONACCI.SOUTH_PROOF,
    fibonacciRank: 8,
    fibonacciStation: "SOUTH_PROOF_EXHAUST_RETURN",
    mechanicalRole: "SOUTH_PROOF_RETURN",
    judicialRole: "SOUTH_SUPREME_JUDGE",
    authorityRole: "PROOF_RETURN_BRANCH",
    mayJudgeProof: true,
    mayLatchF21: false,
    mayAdmitF3Intake: false,
    mayAuditF5Pressure: false,
    mayReleaseCanvasF13: false,
    mayRender: false,
    mayClaimPublicSuperiority: false
  });

  const NORTH_ELIGIBILITY_COORDINATE = Object.freeze({
    coordinateId: "RT3D-X13_Y19_Z21",
    enginePart: "GOVERNOR",
    enginePartIndex: 13,
    systemCategory: "NINETEEN_PART_SYSTEM",
    systemCategoryIndex: 19,
    fibonacciStage: FIBONACCI.NORTH_LATCH,
    fibonacciRank: 21,
    fibonacciStation: "NORTH_COMPLETION_LATCH",
    mechanicalRole: "NORTH_F21_ELIGIBILITY_TARGET",
    mayJudgeProof: false,
    mayLatchF21: true,
    mayRender: false
  });

  const CANVAS_EVIDENCE_COORDINATE = Object.freeze({
    coordinateId: "RT3D-X18_Y19_Z13",
    enginePart: "AXLE",
    enginePartIndex: 18,
    systemCategory: "NINETEEN_PART_SYSTEM",
    systemCategoryIndex: 19,
    fibonacciStage: FIBONACCI.CANVAS_EVIDENCE,
    fibonacciRank: 13,
    fibonacciStation: "CANVAS_EVIDENCE_RELEASE_CHAMBER",
    mechanicalRole: "CANVAS_EVIDENCE_TARGET",
    mayJudgeProof: false,
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

    southRuntimeTableActive: true,
    southRuntimeTableF8Only: true,
    southSupremeJudgeActive: true,
    southProofReturnActive: true,
    southOutputExhaustActive: true,
    proofReturnOpen: true,
    proofReturnStatus: STATUS.ACTIVE,

    engineMechanicsPrimary: true,
    mathPrimary: true,
    architectureLabelsSecondary: true,
    mechanicalCoordinate: MECHANICAL_COORDINATE,
    northEligibilityCoordinate: NORTH_ELIGIBILITY_COORDINATE,
    canvasEvidenceCoordinate: CANVAS_EVIDENCE_COORDINATE,

    westRuntimeObserved: false,
    westRuntimeAccepted: false,
    westRuntimeContract: "",
    westRuntimeReceipt: "",
    westF5PressureObserved: false,
    westF5PressureAccepted: false,

    proofRecords: [],
    proofQueue: [],
    rejectedRecords: [],
    proofRecordCount: 0,
    returnedProofCount: 0,
    rejectedRecordCount: 0,
    diagnosticProofCount: 0,
    supportEngineProofCount: 0,
    routeProofCount: 0,
    canvasProofCount: 0,
    constraintProofCount: 0,

    lastReturnedProof: null,
    lastRejectedProof: null,

    proofGraphBuilt: false,
    proofGraphReady: false,
    proofGraphStatus: STATUS.HELD,
    proofGraph: {
      records: [],
      recordsById: {},
      byClass: {},
      byState: {},
      byProofQuality: {},
      edges: [],
      buildId: "",
      builtAt: ""
    },

    proofQualityMetricActive: true,
    proofQualityScore: 0,
    proofCoverageScore: 0,
    proofTraceScore: 0,
    proofCoherenceScore: 0,
    outputReturnScore: 0,
    evidenceScore: 0,
    boundaryScore: 0,

    northF21EligibilityPrepared: false,
    canvasF13EvidencePrepared: false,
    f8ProofPacketReady: false,
    f8ActivationStatus: STATUS.ACTIVE,
    f8ActivationReason: "SOUTH_F8_PROOF_RETURN_ACTIVE_WAITING_WEST_F5_PRESSURE",

    northReceiptAccepted: false,
    northReceiptPacket: null,
    northRuntimeContract: "",
    northRuntimeReceipt: "",
    northF21EligibilityAccepted: false,
    northF21Latched: false,

    canvasReceiptAccepted: false,
    canvasReceiptPacket: null,
    canvasContract: "",
    canvasReceipt: "",

    activeFibonacci: FIBONACCI.SOUTH_PROOF,
    activeFibonacciRank: 8,
    activeNewsGate: NEWS_GATES.SOUTH,
    sourceFibonacciGate: FIBONACCI.WEST_PRESSURE,
    futureFibonacciGate: FIBONACCI.NORTH_LATCH,
    secondaryFutureFibonacciGate: FIBONACCI.CANVAS_EVIDENCE,
    newsProtocolAligned: true,
    fibonacciSynchronizationMetricActive: true,
    fibonacciSynchronizationScore: 0,
    oneActiveGearAtATime: true,

    firstFailedCoordinate: "WAITING_WEST_F5_PRESSURE_PACKET",
    recommendedNextFile: NORTH_FILE,
    recommendedNextRenewalTarget: NORTH_FILE,

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

  function makeId(value, fallback = "proof") {
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
      code: safeString(code, "RUNTIME_TABLE_SOUTH_F8_ERROR"),
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

  function readWestRuntimeAuthority() {
    return firstGlobal([
      "LAB_RUNTIME_TABLE_WEST",
      "LAB_RUNTIME_TABLE_WEST_F5",
      "RUNTIME_TABLE_WEST",
      "WEST_PRESSURE_VALVE",
      "WEST_PRESSURE_ADMISSIBILITY",
      "WEST_SUPREME_JUDGE",
      "WEST_ADMISSIBILITY_BRANCH",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.runtimeTableWestF5",
      "DEXTER_LAB.cardinalRuntimeTableWest",
      "DEXTER_LAB.westPressureValve",
      "HEARTH.runtimeTableWest",
      "HEARTH.runtimeTableWestF5",
      "HEARTH.westPressureValve"
    ]);
  }

  function readWestF5PressurePacket() {
    const authority = readWestRuntimeAuthority();
    if (!authority) return {};

    try {
      if (isFunction(authority.composeF5PressurePacket)) {
        const packet = authority.composeF5PressurePacket();
        if (isObject(packet)) return packet;
      }

      if (isFunction(authority.getReceipt)) {
        const receipt = authority.getReceipt();
        if (isObject(receipt) && isObject(receipt.f5PressurePacket)) return receipt.f5PressurePacket;
      }

      return readReceipt(authority);
    } catch (error) {
      recordError("WEST_F5_PRESSURE_PACKET_READ_FAILED", error);
      return {};
    }
  }

  function hasMeaningfulWestF5Packet(packet = {}) {
    if (!isObject(packet)) return false;

    return Boolean(
      packet.contract ||
      packet.receipt ||
      packet.packetType === "WEST_F5_PRESSURE_ADMISSIBILITY_PACKET" ||
      safeBool(packet.westRuntimeTableActive, false) ||
      safeBool(packet.westPressureValveActive, false) ||
      safeBool(packet.f5PressurePacketReady, false) ||
      safeBool(packet.pressureGraphBuilt, false) ||
      Array.isArray(packet.pressureRecords)
    );
  }

  function validateWestF5PressurePacket(packet = {}) {
    const input = isObject(packet) ? packet : {};
    const noForbiddenClaim = !detectForbiddenClaim(input);
    const meaningful = hasMeaningfulWestF5Packet(input);

    const activeFibonacci = safeString(input.activeFibonacci || input.fibonacciStage || input.activeStage || "");
    const futureFibonacciGate = safeString(input.futureFibonacciGate || "");

    const correctStage = Boolean(
      !activeFibonacci ||
      activeFibonacci === FIBONACCI.WEST_PRESSURE ||
      activeFibonacci === "F5"
    );

    const correctFuture = Boolean(
      !futureFibonacciGate ||
      futureFibonacciGate === FIBONACCI.SOUTH_PROOF ||
      futureFibonacciGate === "F8"
    );

    const pressureRecordsAcceptable = Boolean(
      Array.isArray(input.pressureRecords) ||
      Array.isArray(input.pressureQueue) ||
      isObject(input.pressureGraph)
    );

    const accepted = Boolean(
      noForbiddenClaim &&
      meaningful &&
      correctStage &&
      correctFuture &&
      pressureRecordsAcceptable
    );

    let reason = "WEST_F5_PRESSURE_PACKET_ACCEPTED";
    if (!noForbiddenClaim) reason = "FORBIDDEN_CLAIM_DETECTED_IN_WEST_F5_PACKET";
    else if (!meaningful) reason = "WEST_F5_PACKET_NOT_MEANINGFUL";
    else if (!correctStage) reason = "WEST_F5_PACKET_WRONG_ACTIVE_FIBONACCI";
    else if (!correctFuture) reason = "WEST_F5_PACKET_WRONG_FUTURE_GATE";
    else if (!pressureRecordsAcceptable) reason = "WEST_F5_PACKET_MISSING_PRESSURE_RECORD_SOURCE";

    return {
      accepted,
      reason,
      noForbiddenClaim,
      meaningful,
      correctStage,
      correctFuture,
      pressureRecordsAcceptable,
      input: clonePlain(input)
    };
  }

  function acceptWestF5PressurePacket(packet = {}) {
    const validation = validateWestF5PressurePacket(packet);

    if (validation.accepted) {
      state.westRuntimeObserved = true;
      state.westRuntimeAccepted = true;
      state.westRuntimeContract = safeString(packet.contract, "");
      state.westRuntimeReceipt = safeString(packet.receipt, "");
      state.westF5PressureObserved = true;
      state.westF5PressureAccepted = true;

      buildProofGraph(packet);
    }

    recordLocal("WEST_F5_PRESSURE_PACKET_EVALUATED_BY_SOUTH_F8", {
      accepted: validation.accepted,
      reason: validation.reason,
      pressureRecordsPresent: validation.pressureRecordsAcceptable
    });

    computeFibonacciSynchronizationMetric();
    publishGlobals();

    return {
      accepted: validation.accepted,
      southF8ReceivedWest: true,
      reason: validation.reason,
      proofGraphBuilt: state.proofGraphBuilt,
      proofGraphReady: state.proofGraphReady,
      northF21EligibilityPrepared: state.northF21EligibilityPrepared,
      canvasF13EvidencePrepared: state.canvasF13EvidencePrepared,
      recommendedNextFile: validation.accepted ? NORTH_FILE : WEST_FILE,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function receiveWestF5PressurePacket(packet = {}) {
    return acceptWestF5PressurePacket(packet);
  }

  function submitWestF5PressurePacket(packet = {}) {
    return acceptWestF5PressurePacket(packet);
  }

  function acceptWestPrimary(packet = {}) {
    return acceptWestF5PressurePacket(packet);
  }

  function receiveWestPrimary(packet = {}) {
    return acceptWestPrimary(packet);
  }

  function acceptSouthPrimary(packet = {}) {
    return acceptProofPacket({
      ...clonePlain(packet),
      packetType: safeString(packet.packetType || "SOUTH_PRIMARY_PROOF_PACKET"),
      activeFibonacci: safeString(packet.activeFibonacci || FIBONACCI.SOUTH_PROOF)
    });
  }

  function receiveSouthPrimary(packet = {}) {
    return acceptSouthPrimary(packet);
  }

  function acceptSouthPrimaryGate(packet = {}) {
    return acceptSouthPrimary(packet);
  }

  function acceptSouthSpread(packet = {}) {
    return acceptProofPacket({
      ...clonePlain(packet),
      packetType: safeString(packet.packetType || "SOUTH_SPREAD_PROOF_PACKET"),
      activeFibonacci: safeString(packet.activeFibonacci || FIBONACCI.SOUTH_PROOF)
    });
  }

  function receiveCycleOneSouthReturn(packet = {}) {
    return acceptSouthPrimary(packet);
  }

  function classifyProofPacket(packet = {}) {
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

    let proofClass = PROOF_CLASS.GENERIC_PROOF;

    if (
      activeFibonacci === FIBONACCI.WEST_PRESSURE ||
      packetType.includes("WEST_F5") ||
      safeBool(input.westRuntimeTableActive, false) ||
      safeBool(input.westPressureValveActive, false)
    ) {
      proofClass = PROOF_CLASS.WEST_PRESSURE_PROOF;
    } else if (
      /DIAGNOSTIC|RECEIPT|EVIDENCE|PROBE|GAUGE/.test(text)
    ) {
      proofClass = PROOF_CLASS.DIAGNOSTIC_PROOF;
    } else if (
      /F34|F55|F89|F144|F233|PRODUCT_ENGINE|UE5_EXPRESSION|REGISTRY|MARKET/.test(text)
    ) {
      proofClass = PROOF_CLASS.SUPPORT_ENGINE_PROOF;
    } else if (
      /ROUTE|HEARTH|SHOWROOM|GLOBE/.test(text)
    ) {
      proofClass = PROOF_CLASS.ROUTE_PROOF;
    } else if (
      /CANVAS|F13|VISUAL|CHAPEL|FINGER/.test(text)
    ) {
      proofClass = PROOF_CLASS.CANVAS_PROOF;
    } else if (
      /CONSTRAINT|BOUNDARY|ADMISSIBLE|PRESSURE|FILTER|SHELL|BASIN|PROOF/.test(text)
    ) {
      proofClass = PROOF_CLASS.CONSTRAINT_PROOF;
    }

    const stateIndex = clamp(
      input.stateIndex !== undefined ? input.stateIndex : stableStateIndex(input),
      0,
      255
    );

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      proofClass,
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

  function proofScoreForClassification(classification = {}, packet = {}) {
    const input = isObject(packet) ? packet : {};
    let score = 34;

    if (classification.proofClass === PROOF_CLASS.WEST_PRESSURE_PROOF) score += 20;
    if (classification.proofClass === PROOF_CLASS.DIAGNOSTIC_PROOF) score += 12;
    if (classification.proofClass === PROOF_CLASS.SUPPORT_ENGINE_PROOF) score += 10;
    if (classification.proofClass === PROOF_CLASS.ROUTE_PROOF) score += 8;
    if (classification.proofClass === PROOF_CLASS.CANVAS_PROOF) score += 8;
    if (classification.proofClass === PROOF_CLASS.CONSTRAINT_PROOF) score += 12;

    if (input.contract) score += 8;
    if (input.receipt) score += 8;
    if (input.file || input.sourceFile) score += 6;
    if (input.route) score += 6;
    if (Array.isArray(input.pressureRecords) && input.pressureRecords.length) score += 10;
    if (safeBool(input.f5PressurePacketReady, false)) score += 8;
    if (safeBool(input.f8SouthHandoffAuthorized, false)) score += 6;
    if (safeNumber(input.pressureQualityScore, 0) >= 62) score += 6;

    return clamp(score, 0, 100);
  }

  function evaluateProofPacket(packet = {}) {
    const classification = classifyProofPacket(packet);
    const noForbiddenClaim = !classification.forbiddenClaimDetected;

    const activeFibonacci = safeString(
      packet.activeFibonacci || packet.fibonacciStage || packet.activeStage || "",
      ""
    );

    const stageAllowed = Boolean(
      !activeFibonacci ||
      activeFibonacci === FIBONACCI.WEST_PRESSURE ||
      activeFibonacci === FIBONACCI.SOUTH_PROOF ||
      activeFibonacci === "F5" ||
      activeFibonacci === "F8"
    );

    const proofOpen = Boolean(state.proofReturnOpen && state.southProofReturnActive);
    const proofScore = proofScoreForClassification(classification, packet);
    const evidenceReady = proofScore >= 55;
    const outputReturnReady = noForbiddenClaim && proofScore >= 55;
    const boundaryPass = noForbiddenClaim;

    const accepted = Boolean(
      noForbiddenClaim &&
      stageAllowed &&
      proofOpen &&
      evidenceReady &&
      outputReturnReady &&
      boundaryPass
    );

    let reason = "SOUTH_F8_PROOF_RETURN_ACCEPTED";
    if (!noForbiddenClaim) reason = "FORBIDDEN_CLAIM_DETECTED_BY_SOUTH_F8_PROOF_RETURN";
    else if (!stageAllowed) reason = "PROOF_STAGE_NOT_ADMISSIBLE_TO_SOUTH_F8";
    else if (!proofOpen) reason = "SOUTH_F8_PROOF_RETURN_CLOSED";
    else if (!evidenceReady) reason = "PROOF_EVIDENCE_BELOW_RETURN_THRESHOLD";
    else if (!outputReturnReady) reason = "OUTPUT_RETURN_NOT_READY";

    return {
      accepted,
      reason,
      classification,
      coordinate: clonePlain(MECHANICAL_COORDINATE),
      runtimeCondition: `${MECHANICAL_COORDINATE.coordinateId}::${classification.stateId}`,
      proofScore,
      evidenceReady,
      outputReturnReady,
      boundaryPass,
      proofState: accepted ? "PROOF_RETURNED" : "HELD_OR_REJECTED",
      nextRecommendedCoordinate: accepted ? NORTH_ELIGIBILITY_COORDINATE.coordinateId : MECHANICAL_COORDINATE.coordinateId,
      canvasEvidenceCoordinate: accepted ? CANVAS_EVIDENCE_COORDINATE.coordinateId : "",
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      evaluatedAt: nowIso()
    };
  }

  function normalizeProofRecord(packet = {}, evaluation = null) {
    const result = evaluation || evaluateProofPacket(packet);
    const source = isObject(packet) ? packet : { value: packet };

    const id = makeId(
      source.id ||
      source.packetId ||
      source.receipt ||
      source.contract ||
      `${result.classification.proofClass}-${Date.now()}-${state.proofRecords.length + state.rejectedRecords.length + 1}`,
      "south-proof"
    );

    return {
      id,
      recordId: id,
      proofClass: result.classification.proofClass,
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
      proofScore: result.proofScore,
      evidenceReady: result.evidenceReady,
      outputReturnReady: result.outputReturnReady,
      boundaryPass: result.boundaryPass,
      accepted: result.accepted,
      reason: result.reason,
      northF21Eligible: result.accepted,
      canvasF13EvidenceReady: result.accepted,
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

  function acceptProofPacket(packet = {}) {
    const evaluation = evaluateProofPacket(packet);
    const record = normalizeProofRecord(packet, evaluation);

    if (evaluation.accepted) {
      state.proofRecords.push(record);
      state.proofQueue.push(record);
      state.lastReturnedProof = clonePlain(record);
    } else {
      state.rejectedRecords.push(record);
      state.lastRejectedProof = clonePlain(record);
    }

    trim(state.proofRecords);
    trim(state.proofQueue);
    trim(state.rejectedRecords);

    rebuildProofGraph({ silent: true });
    computeFibonacciSynchronizationMetric();

    recordLocal("SOUTH_F8_PROOF_PACKET_EVALUATED", {
      accepted: evaluation.accepted,
      reason: evaluation.reason,
      proofClass: record.proofClass,
      stateId: record.stateId,
      proofScore: record.proofScore,
      runtimeCondition: record.runtimeCondition
    });

    publishGlobals();

    return {
      accepted: evaluation.accepted,
      reason: evaluation.reason,
      record: clonePlain(record),
      proofClass: record.proofClass,
      runtimeCondition: record.runtimeCondition,
      northF21EligibilityPrepared: state.northF21EligibilityPrepared,
      canvasF13EvidencePrepared: state.canvasF13EvidencePrepared,
      recommendedNextFile: evaluation.accepted ? NORTH_FILE : FILE,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function receiveProofPacket(packet = {}) {
    return acceptProofPacket(packet);
  }

  function submitProofPacket(packet = {}) {
    return acceptProofPacket(packet);
  }

  function buildProofGraph(packet = {}, options = {}) {
    const records = [];

    const pressureRecords = Array.isArray(packet.pressureRecords)
      ? packet.pressureRecords
      : Array.isArray(packet.pressureQueue)
        ? packet.pressureQueue
        : isObject(packet.pressureGraph) && Array.isArray(packet.pressureGraph.records)
          ? packet.pressureGraph.records
          : [];

    if (pressureRecords.length) {
      pressureRecords.forEach((item) => {
        const evaluation = evaluateProofPacket({
          ...clonePlain(item),
          activeFibonacci: FIBONACCI.SOUTH_PROOF,
          packetType: safeString(item.packetType || "WEST_PRESSURE_PROOF_SOURCE")
        });
        records.push(normalizeProofRecord(item, evaluation));
      });
    } else if (hasMeaningfulWestF5Packet(packet)) {
      const evaluation = evaluateProofPacket(packet);
      records.push(normalizeProofRecord(packet, evaluation));
    }

    records.forEach((record) => {
      if (record.accepted) {
        state.proofRecords.push(record);
        state.proofQueue.push(record);
        state.lastReturnedProof = clonePlain(record);
      } else {
        state.rejectedRecords.push(record);
        state.lastRejectedProof = clonePlain(record);
      }
    });

    trim(state.proofRecords);
    trim(state.proofQueue);
    trim(state.rejectedRecords);

    return rebuildProofGraph(options);
  }

  function rebuildProofGraph(options = {}) {
    const records = state.proofRecords.slice();
    const recordsById = {};
    const byClass = {};
    const byState = {};
    const byProofQuality = {};
    const edges = [];

    records.forEach((record) => {
      recordsById[record.id] = record;

      byClass[record.proofClass] = byClass[record.proofClass] || [];
      byClass[record.proofClass].push(record.id);

      byState[record.stateId] = byState[record.stateId] || [];
      byState[record.stateId].push(record.id);

      const qualityBucket = record.proofScore >= 80 ? "READY" : record.proofScore >= 62 ? "DEGRADED" : "HELD";
      byProofQuality[qualityBucket] = byProofQuality[qualityBucket] || [];
      byProofQuality[qualityBucket].push(record.id);

      edges.push({
        from: MECHANICAL_COORDINATE.coordinateId,
        to: record.id,
        type: "south-exhaust-proof-return-record",
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
          to: NORTH_ELIGIBILITY_COORDINATE.coordinateId,
          type: "proof-to-north-f21-eligibility",
          deterministic: true
        });

        edges.push({
          from: record.id,
          to: CANVAS_EVIDENCE_COORDINATE.coordinateId,
          type: "proof-to-canvas-f13-evidence-target",
          deterministic: true
        });
      }
    });

    state.proofGraph = {
      records,
      recordsById,
      byClass,
      byState,
      byProofQuality,
      edges,
      buildId: `south-f8-proof-graph-${records.length}-${edges.length}`,
      builtAt: nowIso()
    };

    state.proofGraphBuilt = true;
    state.proofRecordCount = records.length;
    state.returnedProofCount = records.length;
    state.rejectedRecordCount = state.rejectedRecords.length;
    state.diagnosticProofCount = records.filter((record) => record.proofClass === PROOF_CLASS.DIAGNOSTIC_PROOF).length;
    state.supportEngineProofCount = records.filter((record) => record.proofClass === PROOF_CLASS.SUPPORT_ENGINE_PROOF).length;
    state.routeProofCount = records.filter((record) => record.proofClass === PROOF_CLASS.ROUTE_PROOF).length;
    state.canvasProofCount = records.filter((record) => record.proofClass === PROOF_CLASS.CANVAS_PROOF).length;
    state.constraintProofCount = records.filter((record) => record.proofClass === PROOF_CLASS.CONSTRAINT_PROOF).length;

    computeProofQualityMetric();

    state.proofGraphReady = Boolean(
      state.proofRecordCount > 0 &&
      state.proofQualityScore >= 62 &&
      state.boundaryScore >= 80
    );

    if (state.proofGraphReady) {
      state.proofGraphStatus = state.proofQualityScore >= 80 ? STATUS.READY : STATUS.DEGRADED;
      state.northF21EligibilityPrepared = true;
      state.canvasF13EvidencePrepared = true;
      state.f8ProofPacketReady = true;
      state.f8ActivationStatus = state.proofGraphStatus;
      state.f8ActivationReason =
        state.proofGraphStatus === STATUS.READY
          ? "SOUTH_F8_PROOF_READY_FOR_NORTH_F21_AND_CANVAS_F13"
          : "SOUTH_F8_PROOF_DEGRADED_NORTH_F21_AND_CANVAS_F13_AVAILABLE";
      state.firstFailedCoordinate =
        state.proofGraphStatus === STATUS.READY
          ? "NONE_SOUTH_F8_READY_NORTH_F21_ELIGIBILITY_PREPARED"
          : "NONE_SOUTH_F8_DEGRADED_NORTH_F21_ELIGIBILITY_AVAILABLE";
      state.recommendedNextFile = NORTH_FILE;
      state.recommendedNextRenewalTarget = NORTH_FILE;
    } else {
      state.proofGraphStatus = STATUS.HELD;
      state.northF21EligibilityPrepared = false;
      state.canvasF13EvidencePrepared = false;
      state.f8ProofPacketReady = false;
      state.f8ActivationStatus = STATUS.HELD;
      state.f8ActivationReason = "WAITING_LAWFUL_SOUTH_F8_PROOF";
      state.firstFailedCoordinate = "WAITING_LAWFUL_SOUTH_F8_PROOF";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
    }

    computeFibonacciSynchronizationMetric();

    if (options.silent !== true) {
      recordLocal("SOUTH_F8_PROOF_GRAPH_REBUILT", {
        proofRecordCount: state.proofRecordCount,
        rejectedRecordCount: state.rejectedRecordCount,
        proofGraphStatus: state.proofGraphStatus,
        proofQualityScore: state.proofQualityScore
      });
    }

    updateDataset();

    return clonePlain(state.proofGraph);
  }

  function computeProofQualityMetric() {
    const records = state.proofRecords || [];
    const count = Math.max(1, records.length);
    const acceptedRatio = records.length / Math.max(1, records.length + state.rejectedRecords.length);
    const traceRatio = records.filter((record) => record.traceReady).length / count;
    const evidenceRatio = records.filter((record) => record.evidenceReady).length / count;
    const outputReturnRatio = records.filter((record) => record.outputReturnReady).length / count;
    const boundaryRatio = records.filter((record) => record.boundaryPass).length / count;

    const classCoverage = [
      records.some((record) => record.proofClass === PROOF_CLASS.WEST_PRESSURE_PROOF),
      records.some((record) => record.proofClass === PROOF_CLASS.DIAGNOSTIC_PROOF),
      records.some((record) => record.proofClass === PROOF_CLASS.SUPPORT_ENGINE_PROOF),
      records.some((record) => record.proofClass === PROOF_CLASS.ROUTE_PROOF),
      records.some((record) => record.proofClass === PROOF_CLASS.CANVAS_PROOF),
      records.some((record) => record.proofClass === PROOF_CLASS.CONSTRAINT_PROOF)
    ].filter(Boolean).length / 6;

    state.proofCoverageScore = clamp(Math.round(classCoverage * 100), 0, 100);
    state.proofTraceScore = clamp(Math.round(traceRatio * 100), 0, 100);
    state.evidenceScore = clamp(Math.round(evidenceRatio * 100), 0, 100);
    state.outputReturnScore = clamp(Math.round(outputReturnRatio * 100), 0, 100);
    state.boundaryScore = clamp(Math.round(boundaryRatio * 100), 0, 100);

    state.proofCoherenceScore = clamp(
      Math.round(
        (acceptedRatio * 26) +
        (state.evidenceScore * 0.20) +
        (state.outputReturnScore * 0.20) +
        (state.proofTraceScore * 0.14) +
        (state.proofCoverageScore * 0.12) +
        (state.boundaryScore * 0.08)
      ),
      0,
      100
    );

    state.proofQualityScore = clamp(
      Math.round(
        (state.proofCoherenceScore * 0.34) +
        (state.evidenceScore * 0.22) +
        (state.outputReturnScore * 0.20) +
        (state.proofTraceScore * 0.12) +
        (state.proofCoverageScore * 0.12)
      ),
      0,
      100
    );

    return {
      proofQualityScore: state.proofQualityScore,
      proofCoverageScore: state.proofCoverageScore,
      proofTraceScore: state.proofTraceScore,
      proofCoherenceScore: state.proofCoherenceScore,
      outputReturnScore: state.outputReturnScore,
      evidenceScore: state.evidenceScore,
      boundaryScore: state.boundaryScore,
      publicSuperiorityClaim: false,
      publicComparisonClaimAllowed: false
    };
  }

  function computeFibonacciSynchronizationMetric() {
    const checks = [
      state.newsProtocolAligned,
      state.oneActiveGearAtATime,
      state.activeFibonacci === FIBONACCI.SOUTH_PROOF,
      state.activeFibonacciRank === 8,
      state.activeNewsGate === NEWS_GATES.SOUTH,
      state.sourceFibonacciGate === FIBONACCI.WEST_PRESSURE,
      state.futureFibonacciGate === FIBONACCI.NORTH_LATCH,
      state.secondaryFutureFibonacciGate === FIBONACCI.CANVAS_EVIDENCE,
      state.southRuntimeTableActive,
      state.southSupremeJudgeActive,
      state.southProofReturnActive,
      state.southOutputExhaustActive,
      state.proofReturnOpen,
      state.engineMechanicsPrimary,
      state.mathPrimary,
      state.mechanicalCoordinate.coordinateId === "RT3D-X07_Y19_Z8",
      state.proofGraphBuilt || state.westRuntimeObserved,
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

    computeProofQualityMetric();

    return {
      score: state.fibonacciSynchronizationScore,
      passed,
      total: checks.length,
      activeFibonacci: FIBONACCI.SOUTH_PROOF,
      activeFibonacciRank: 8,
      activeNewsGate: NEWS_GATES.SOUTH,
      sourceFibonacciGate: FIBONACCI.WEST_PRESSURE,
      futureFibonacciGate: FIBONACCI.NORTH_LATCH,
      secondaryFutureFibonacciGate: FIBONACCI.CANVAS_EVIDENCE,
      publicSuperiorityClaim: false
    };
  }

  function evaluateNewsAlignment() {
    const metric = computeFibonacciSynchronizationMetric();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      newsAlignmentContract: "LAB_RUNTIME_TABLE_SOUTH_F8_NEWS_ALIGNMENT_PROTOCOL_v1",
      newsAlignmentReceipt: "LAB_RUNTIME_TABLE_SOUTH_F8_NEWS_ALIGNMENT_PROTOCOL_RECEIPT_v1",
      sequence: [
        {
          gate: NEWS_GATES.WEST,
          fibonacci: FIBONACCI.WEST_PRESSURE,
          file: WEST_FILE,
          ready: state.westRuntimeObserved || state.westF5PressureObserved
        },
        {
          gate: NEWS_GATES.SOUTH,
          fibonacci: FIBONACCI.SOUTH_PROOF,
          file: FILE,
          ready: state.proofGraphReady || state.f8ProofPacketReady
        },
        {
          gate: NEWS_GATES.CANVAS,
          fibonacci: FIBONACCI.CANVAS_EVIDENCE,
          file: CANVAS_FILE,
          ready: state.canvasF13EvidencePrepared
        },
        {
          gate: NEWS_GATES.NORTH,
          fibonacci: FIBONACCI.NORTH_LATCH,
          file: NORTH_FILE,
          ready: state.northF21EligibilityPrepared
        }
      ],
      fibonacciSynchronizationScore: metric.score,
      f8Status: state.f8ActivationStatus,
      proofGraphStatus: state.proofGraphStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function setProofReturnOpen(open, detail = {}) {
    state.proofReturnOpen = safeBool(open, true);
    state.proofReturnStatus = state.proofReturnOpen ? STATUS.ACTIVE : STATUS.HELD;

    recordLocal("SOUTH_F8_PROOF_RETURN_STATE_CHANGED", {
      proofReturnOpen: state.proofReturnOpen,
      detail: clonePlain(detail)
    });

    computeFibonacciSynchronizationMetric();
    publishGlobals();

    return {
      proofReturnOpen: state.proofReturnOpen,
      proofReturnStatus: state.proofReturnStatus,
      changedAt: nowIso()
    };
  }

  function openProofReturn(detail = {}) {
    return setProofReturnOpen(true, detail);
  }

  function closeProofReturn(detail = {}) {
    return setProofReturnOpen(false, detail);
  }

  function composeF8ProofPacket(extra = {}) {
    const metric = computeFibonacciSynchronizationMetric();
    const readyForNorth = Boolean(state.northF21EligibilityPrepared || state.proofGraphStatus === STATUS.DEGRADED);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "SOUTH_F8_PROOF_RETURN_PACKET",
      sourceFile: FILE,
      targetFile: NORTH_FILE,
      destinationFile: NORTH_FILE,

      activeFibonacci: FIBONACCI.SOUTH_PROOF,
      activeFibonacciRank: 8,
      activeNewsGate: NEWS_GATES.SOUTH,
      sourceFibonacciGate: FIBONACCI.WEST_PRESSURE,
      futureFibonacciGate: FIBONACCI.NORTH_LATCH,
      futureFibonacciRank: 21,
      secondaryFutureFibonacciGate: FIBONACCI.CANVAS_EVIDENCE,
      secondaryFutureFibonacciRank: 13,

      mechanicalCoordinate: clonePlain(MECHANICAL_COORDINATE),
      northEligibilityCoordinate: clonePlain(NORTH_ELIGIBILITY_COORDINATE),
      canvasEvidenceCoordinate: clonePlain(CANVAS_EVIDENCE_COORDINATE),
      engineMechanicsPrimary: true,
      mathPrimary: true,
      architectureLabelsSecondary: true,

      southRuntimeTableActive: true,
      southRuntimeTableF8Only: true,
      southSupremeJudgeActive: true,
      southProofReturnActive: true,
      southOutputExhaustActive: true,
      proofReturnOpen: state.proofReturnOpen,
      proofReturnStatus: state.proofReturnStatus,

      westRuntimeObserved: state.westRuntimeObserved,
      westRuntimeAccepted: state.westRuntimeAccepted,
      westRuntimeContract: state.westRuntimeContract,
      westRuntimeReceipt: state.westRuntimeReceipt,
      westF5PressureObserved: state.westF5PressureObserved,
      westF5PressureAccepted: state.westF5PressureAccepted,

      proofGraphBuilt: state.proofGraphBuilt,
      proofGraphReady: state.proofGraphReady,
      proofGraphStatus: state.proofGraphStatus,
      proofRecordCount: state.proofRecordCount,
      returnedProofCount: state.returnedProofCount,
      rejectedRecordCount: state.rejectedRecordCount,
      diagnosticProofCount: state.diagnosticProofCount,
      supportEngineProofCount: state.supportEngineProofCount,
      routeProofCount: state.routeProofCount,
      canvasProofCount: state.canvasProofCount,
      constraintProofCount: state.constraintProofCount,

      proofQualityScore: state.proofQualityScore,
      proofCoverageScore: state.proofCoverageScore,
      proofTraceScore: state.proofTraceScore,
      proofCoherenceScore: state.proofCoherenceScore,
      outputReturnScore: state.outputReturnScore,
      evidenceScore: state.evidenceScore,
      boundaryScore: state.boundaryScore,

      proofRecords: clonePlain(state.proofRecords),
      proofQueue: clonePlain(state.proofQueue),
      rejectedRecords: clonePlain(state.rejectedRecords),
      proofGraph: clonePlain(state.proofGraph),

      northF21EligibilityPrepared: readyForNorth,
      canvasF13EvidencePrepared: state.canvasF13EvidencePrepared,
      f8ProofPacketReady: readyForNorth,
      f8ActivationStatus: state.f8ActivationStatus,
      f8ActivationReason: state.f8ActivationReason,

      f21Eligible: readyForNorth,
      f21EligibleForNorth: readyForNorth,
      southProofAccepted: readyForNorth,
      canvasF13EvidenceReady: state.canvasF13EvidencePrepared,

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

  function composeCanvasF13EvidencePacket(extra = {}) {
    const proofPacket = composeF8ProofPacket(extra);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "SOUTH_F8_TO_CANVAS_F13_EVIDENCE_PACKET",
      sourceFile: FILE,
      targetFile: CANVAS_FILE,
      destinationFile: CANVAS_FILE,

      activeFibonacci: FIBONACCI.CANVAS_EVIDENCE,
      activeFibonacciRank: 13,
      activeNewsGate: NEWS_GATES.CANVAS,
      sourceFibonacciGate: FIBONACCI.SOUTH_PROOF,
      futureFibonacciGate: FIBONACCI.NORTH_LATCH,

      mechanicalCoordinate: clonePlain(CANVAS_EVIDENCE_COORDINATE),
      sourceMechanicalCoordinate: clonePlain(MECHANICAL_COORDINATE),

      southProofPacket: proofPacket,
      canvasF13EvidenceReady: state.canvasF13EvidencePrepared,
      canvasF13EvidenceComplete: state.canvasF13EvidencePrepared,
      canvasF13EvidenceDegraded: state.proofGraphStatus === STATUS.DEGRADED,

      ownsCanvasRelease: false,
      requestsCanvasEvidenceIntakeOnly: true,

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

  function composeSouthReceipt() {
    return getReceipt();
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

  function submitF8ProofToNorth(extra = {}) {
    const north = readNorthRuntimeAuthority();

    if (!north) {
      return {
        submitted: false,
        reason: "NORTH_RUNTIME_TABLE_UNAVAILABLE",
        recommendedNextFile: NORTH_FILE,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };
    }

    const packet = composeF8ProofPacket(extra);

    try {
      if (isFunction(north.acceptSouthPrimary)) {
        return {
          submitted: true,
          method: "acceptSouthPrimary",
          response: clonePlain(north.acceptSouthPrimary(packet))
        };
      }

      if (isFunction(north.acceptSouthPrimaryGate)) {
        return {
          submitted: true,
          method: "acceptSouthPrimaryGate",
          response: clonePlain(north.acceptSouthPrimaryGate(packet))
        };
      }

      if (isFunction(north.acceptSouthSpread)) {
        return {
          submitted: true,
          method: "acceptSouthSpread",
          response: clonePlain(north.acceptSouthSpread(packet))
        };
      }

      if (isFunction(north.receiveCycleOneSouthReturn)) {
        return {
          submitted: true,
          method: "receiveCycleOneSouthReturn",
          response: clonePlain(north.receiveCycleOneSouthReturn(packet))
        };
      }

      if (isFunction(north.acceptF21Eligibility)) {
        return {
          submitted: true,
          method: "acceptF21Eligibility",
          response: clonePlain(north.acceptF21Eligibility(packet))
        };
      }

      if (isFunction(north.submitF21Eligibility)) {
        return {
          submitted: true,
          method: "submitF21Eligibility",
          response: clonePlain(north.submitF21Eligibility(packet))
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
      recordError("SOUTH_F8_PROOF_SUBMISSION_TO_NORTH_FAILED", error);
      return {
        submitted: false,
        reason: "SOUTH_F8_PROOF_SUBMISSION_TO_NORTH_FAILED"
      };
    }

    return {
      submitted: false,
      reason: "NORTH_RUNTIME_TABLE_SOUTH_PROOF_METHOD_UNAVAILABLE",
      recommendedNextFile: NORTH_FILE
    };
  }

  function readCanvasAuthority() {
    return firstGlobal([
      "HEARTH.canvas",
      "HEARTH.canvasAuthority",
      "HEARTH_CANVAS",
      "HEARTH_CANVAS_AUTHORITY",
      "DEXTER_LAB.canvasAuthority"
    ]);
  }

  function submitCanvasF13Evidence(extra = {}) {
    const canvas = readCanvasAuthority();

    if (!canvas) {
      return {
        submitted: false,
        reason: "CANVAS_AUTHORITY_UNAVAILABLE",
        recommendedNextFile: CANVAS_FILE,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };
    }

    const packet = composeCanvasF13EvidencePacket(extra);

    try {
      if (isFunction(canvas.acceptSouthF8Evidence)) {
        return {
          submitted: true,
          method: "acceptSouthF8Evidence",
          response: clonePlain(canvas.acceptSouthF8Evidence(packet))
        };
      }

      if (isFunction(canvas.acceptF13Evidence)) {
        return {
          submitted: true,
          method: "acceptF13Evidence",
          response: clonePlain(canvas.acceptF13Evidence(packet))
        };
      }

      if (isFunction(canvas.receiveEvidence)) {
        return {
          submitted: true,
          method: "receiveEvidence",
          response: clonePlain(canvas.receiveEvidence(packet))
        };
      }
    } catch (error) {
      recordError("SOUTH_F8_CANVAS_F13_EVIDENCE_SUBMISSION_FAILED", error);
      return {
        submitted: false,
        reason: "SOUTH_F8_CANVAS_F13_EVIDENCE_SUBMISSION_FAILED"
      };
    }

    return {
      submitted: false,
      reason: "CANVAS_F13_EVIDENCE_METHOD_UNAVAILABLE",
      recommendedNextFile: CANVAS_FILE
    };
  }

  function validateNorthReceipt(packet = {}) {
    const input = isObject(packet) ? packet : {};
    const noForbiddenClaim = !detectForbiddenClaim(input);

    const northRecognized = Boolean(
      safeBool(input.countyRuntimeEngineCenter, false) ||
      safeBool(input.northTimingGovernor, false) ||
      safeBool(input.f21Latched, false) ||
      safeBool(input.f21EligibilityAccepted, false) ||
      safeString(input.contract || "").includes("RUNTIME_TABLE") ||
      safeString(input.receipt || "").includes("RUNTIME_TABLE")
    );

    const ok = Boolean(noForbiddenClaim && northRecognized);

    let reason = "NORTH_F21_RECEIPT_ACCEPTED";
    if (!noForbiddenClaim) reason = "FORBIDDEN_CLAIM_DETECTED_IN_NORTH_RECEIPT";
    else if (!northRecognized) reason = "UNRECOGNIZED_NORTH_F21_RECEIPT";

    return {
      ok,
      reason,
      noForbiddenClaim,
      northRecognized,
      input: clonePlain(input)
    };
  }

  function acceptNorthReceipt(packet = {}) {
    const validation = validateNorthReceipt(packet);

    state.northReceiptAccepted = validation.ok;
    state.northReceiptPacket = clonePlain(packet);

    if (validation.input.contract) state.northRuntimeContract = safeString(validation.input.contract);
    if (validation.input.receipt) state.northRuntimeReceipt = safeString(validation.input.receipt);

    state.northF21EligibilityAccepted =
      safeBool(validation.input.f21EligibilityAccepted, state.northF21EligibilityAccepted) ||
      safeBool(validation.input.f21Eligible, state.northF21EligibilityAccepted);

    state.northF21Latched = safeBool(validation.input.f21Latched, state.northF21Latched);

    recordLocal("NORTH_F21_RECEIPT_RECEIVED_BY_SOUTH_F8", {
      accepted: validation.ok,
      reason: validation.reason,
      contract: state.northRuntimeContract,
      northF21EligibilityAccepted: state.northF21EligibilityAccepted,
      northF21Latched: state.northF21Latched
    });

    publishGlobals();

    return {
      accepted: validation.ok,
      southF8ReceivedNorth: true,
      reason: validation.reason,
      recommendedNextFile: validation.ok ? CANVAS_FILE : NORTH_FILE,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function validateCanvasReceipt(packet = {}) {
    const input = isObject(packet) ? packet : {};
    const noForbiddenClaim = !detectForbiddenClaim(input);

    const canvasRecognized = Boolean(
      safeBool(input.canvasF13EvidenceAccepted, false) ||
      safeBool(input.canvasF13EvidenceComplete, false) ||
      safeBool(input.canvasAuthorityActive, false) ||
      safeString(input.activeFibonacci || "") === FIBONACCI.CANVAS_EVIDENCE ||
      safeString(input.contract || "").includes("CANVAS") ||
      safeString(input.receipt || "").includes("CANVAS")
    );

    const ok = Boolean(noForbiddenClaim && canvasRecognized);

    let reason = "CANVAS_F13_RECEIPT_ACCEPTED";
    if (!noForbiddenClaim) reason = "FORBIDDEN_CLAIM_DETECTED_IN_CANVAS_RECEIPT";
    else if (!canvasRecognized) reason = "UNRECOGNIZED_CANVAS_F13_RECEIPT";

    return {
      ok,
      reason,
      noForbiddenClaim,
      canvasRecognized,
      input: clonePlain(input)
    };
  }

  function acceptCanvasReceipt(packet = {}) {
    const validation = validateCanvasReceipt(packet);

    state.canvasReceiptAccepted = validation.ok;
    state.canvasReceiptPacket = clonePlain(packet);

    if (validation.input.contract) state.canvasContract = safeString(validation.input.contract);
    if (validation.input.receipt) state.canvasReceipt = safeString(validation.input.receipt);

    recordLocal("CANVAS_F13_RECEIPT_RECEIVED_BY_SOUTH_F8", {
      accepted: validation.ok,
      reason: validation.reason,
      contract: state.canvasContract
    });

    publishGlobals();

    return {
      accepted: validation.ok,
      southF8ReceivedCanvas: true,
      reason: validation.reason,
      recommendedNextFile: validation.ok ? NORTH_FILE : CANVAS_FILE,
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
      bindingType: "SOUTH_F8_MECHANICAL_COORDINATE_PLUS_STATE_256",
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
    const proofScore = proofScoreForClassification(classifyProofPacket(input), input);
    const allowed = Boolean(
      state.proofReturnOpen &&
      state.southProofReturnActive &&
      proofScore >= 55 &&
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
      proofScore,
      basinAnchored: true,
      envelopeContained: true,
      runtimeExpressionAllowed: allowed,
      exhaustState: allowed ? "PROOF_RETURNED" : "HELD_OR_REJECTED",
      evaluatedAt: nowIso()
    };
  }

  function getMechanicalCoordinatePacket() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      mechanicalCoordinate: clonePlain(MECHANICAL_COORDINATE),
      northEligibilityCoordinate: clonePlain(NORTH_ELIGIBILITY_COORDINATE),
      canvasEvidenceCoordinate: clonePlain(CANVAS_EVIDENCE_COORDINATE),
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

  function getProofGraph() {
    return clonePlain(state.proofGraph);
  }

  function getProofGraphSummary() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      proofGraphBuilt: state.proofGraphBuilt,
      proofGraphReady: state.proofGraphReady,
      proofGraphStatus: state.proofGraphStatus,
      proofRecordCount: state.proofRecordCount,
      returnedProofCount: state.returnedProofCount,
      rejectedRecordCount: state.rejectedRecordCount,
      diagnosticProofCount: state.diagnosticProofCount,
      supportEngineProofCount: state.supportEngineProofCount,
      routeProofCount: state.routeProofCount,
      canvasProofCount: state.canvasProofCount,
      constraintProofCount: state.constraintProofCount,
      proofQualityScore: state.proofQualityScore,
      proofCoverageScore: state.proofCoverageScore,
      proofTraceScore: state.proofTraceScore,
      proofCoherenceScore: state.proofCoherenceScore,
      outputReturnScore: state.outputReturnScore,
      evidenceScore: state.evidenceScore,
      boundaryScore: state.boundaryScore,
      updatedAt: nowIso()
    };
  }

  function getProofRecords(proofClass = "") {
    const records = state.proofRecords || [];
    if (!proofClass) return clonePlain(records);
    return clonePlain(records.filter((record) => record.proofClass === proofClass));
  }

  function getRejectedRecords() {
    return clonePlain(state.rejectedRecords);
  }

  function findProofRecord(id) {
    const key = makeId(id, "");
    return clonePlain((state.proofGraph.recordsById || {})[key] || null);
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

      southRuntimeTableActive: true,
      southRuntimeTableF8Only: true,
      southSupremeJudgeActive: true,
      southProofReturnActive: true,
      southOutputExhaustActive: true,
      proofReturnOpen: state.proofReturnOpen,
      proofReturnStatus: state.proofReturnStatus,

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

      westRuntimeObserved: state.westRuntimeObserved,
      westRuntimeAccepted: state.westRuntimeAccepted,
      westRuntimeContract: state.westRuntimeContract,
      westRuntimeReceipt: state.westRuntimeReceipt,
      westF5PressureObserved: state.westF5PressureObserved,
      westF5PressureAccepted: state.westF5PressureAccepted,

      proofGraphBuilt: state.proofGraphBuilt,
      proofGraphReady: state.proofGraphReady,
      proofGraphStatus: state.proofGraphStatus,
      proofRecordCount: state.proofRecordCount,
      returnedProofCount: state.returnedProofCount,
      rejectedRecordCount: state.rejectedRecordCount,
      diagnosticProofCount: state.diagnosticProofCount,
      supportEngineProofCount: state.supportEngineProofCount,
      routeProofCount: state.routeProofCount,
      canvasProofCount: state.canvasProofCount,
      constraintProofCount: state.constraintProofCount,

      proofQualityMetricActive: true,
      proofQualityScore: state.proofQualityScore,
      proofCoverageScore: state.proofCoverageScore,
      proofTraceScore: state.proofTraceScore,
      proofCoherenceScore: state.proofCoherenceScore,
      outputReturnScore: state.outputReturnScore,
      evidenceScore: state.evidenceScore,
      boundaryScore: state.boundaryScore,

      northF21EligibilityPrepared: state.northF21EligibilityPrepared,
      canvasF13EvidencePrepared: state.canvasF13EvidencePrepared,
      f8ProofPacketReady: state.f8ProofPacketReady,
      f8ActivationStatus: state.f8ActivationStatus,
      f8ActivationReason: state.f8ActivationReason,

      northReceiptAccepted: state.northReceiptAccepted,
      northRuntimeContract: state.northRuntimeContract,
      northRuntimeReceipt: state.northRuntimeReceipt,
      northF21EligibilityAccepted: state.northF21EligibilityAccepted,
      northF21Latched: state.northF21Latched,

      canvasReceiptAccepted: state.canvasReceiptAccepted,
      canvasContract: state.canvasContract,
      canvasReceipt: state.canvasReceipt,

      newsProtocolAligned: true,
      fibonacciSynchronizationMetricActive: true,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      activeFibonacci: FIBONACCI.SOUTH_PROOF,
      activeFibonacciRank: 8,
      activeNewsGate: NEWS_GATES.SOUTH,
      sourceFibonacciGate: FIBONACCI.WEST_PRESSURE,
      futureFibonacciGate: FIBONACCI.NORTH_LATCH,
      secondaryFutureFibonacciGate: FIBONACCI.CANVAS_EVIDENCE,
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

      southF8Receipt: true,
      southSupremeJudgeReceipt: true,
      southProofReturnReceipt: true,

      southRuntimeOwns: [
        "F8 South proof return",
        "proof packet evaluation",
        "output/exhaust receipt preparation",
        "North F21 eligibility packet preparation",
        "Canvas F13 evidence packet preparation",
        "256 state proof binding"
      ],
      southRuntimeDoesNotOwn: [
        "North F21 latch",
        "East F3 intake admission",
        "West F5 pressure/admissibility",
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
        west: WEST_FILE,
        south: FILE,
        canvas: CANVAS_FILE,
        productEngine: F34_PRODUCT_ENGINE_FILE,
        ue5Expression: F55_EXPRESSION_FILE,
        registry: F89_REGISTRY_FILE,
        market: F144_MARKET_FILE
      },

      proofClasses: clonePlain(PROOF_CLASS),
      fibonacciMap: clonePlain(FIBONACCI),
      newsGates: clonePlain(NEWS_GATES),
      mechanicalCoordinate: clonePlain(MECHANICAL_COORDINATE),
      northEligibilityCoordinate: clonePlain(NORTH_ELIGIBILITY_COORDINATE),
      canvasEvidenceCoordinate: clonePlain(CANVAS_EVIDENCE_COORDINATE),
      mechanicalCoordinatePacket: getMechanicalCoordinatePacket(),

      proofGraph: getProofGraph(),
      proofGraphSummary: getProofGraphSummary(),
      proofRecords: getProofRecords(),
      rejectedRecords: getRejectedRecords(),

      proofQuality: computeProofQualityMetric(),
      newsAlignment: evaluateNewsAlignment(),
      f8ProofPacket: composeF8ProofPacket(),
      canvasF13EvidencePacket: composeCanvasF13EvidencePacket(),
      northReceiptPacket: clonePlain(state.northReceiptPacket),
      canvasReceiptPacket: clonePlain(state.canvasReceiptPacket),

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

    const records = (r.proofRecords || []).map((record) => (
      `- ${record.id} :: class=${record.proofClass} :: state=${record.stateId} :: score=${record.proofScore} :: accepted=${record.accepted} :: evidenceReady=${record.evidenceReady} :: outputReturnReady=${record.outputReturnReady} :: reason=${record.reason}`
    )).join("\n") || "- none";

    const rejected = (r.rejectedRecords || []).map((record) => (
      `- ${record.id} :: class=${record.proofClass} :: state=${record.stateId} :: score=${record.proofScore} :: reason=${record.reason}`
    )).join("\n") || "- none";

    const events = (r.localEvents || []).slice(-48).map((item) => (
      `- ${item.at} :: ${item.event} :: ${JSON.stringify(item.detail || {})}`
    )).join("\n") || "- none";

    const errors = (r.errors || []).map((item) => (
      `- ${item.at} :: ${item.code} :: ${item.message}`
    )).join("\n") || "- none";

    return [
      "LAB_RUNTIME_TABLE_SOUTH_F8_ENGINE_MECHANICS_PROOF_RETURN_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      "",
      `southRuntimeTableActive=${r.southRuntimeTableActive}`,
      `southRuntimeTableF8Only=${r.southRuntimeTableF8Only}`,
      `southSupremeJudgeActive=${r.southSupremeJudgeActive}`,
      `southProofReturnActive=${r.southProofReturnActive}`,
      `southOutputExhaustActive=${r.southOutputExhaustActive}`,
      `proofReturnOpen=${r.proofReturnOpen}`,
      `proofReturnStatus=${r.proofReturnStatus}`,
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
      `westRuntimeObserved=${r.westRuntimeObserved}`,
      `westRuntimeAccepted=${r.westRuntimeAccepted}`,
      `westRuntimeContract=${r.westRuntimeContract}`,
      `westRuntimeReceipt=${r.westRuntimeReceipt}`,
      `westF5PressureObserved=${r.westF5PressureObserved}`,
      `westF5PressureAccepted=${r.westF5PressureAccepted}`,
      "",
      `proofGraphBuilt=${r.proofGraphBuilt}`,
      `proofGraphReady=${r.proofGraphReady}`,
      `proofGraphStatus=${r.proofGraphStatus}`,
      `proofRecordCount=${r.proofRecordCount}`,
      `returnedProofCount=${r.returnedProofCount}`,
      `rejectedRecordCount=${r.rejectedRecordCount}`,
      `diagnosticProofCount=${r.diagnosticProofCount}`,
      `supportEngineProofCount=${r.supportEngineProofCount}`,
      `routeProofCount=${r.routeProofCount}`,
      `canvasProofCount=${r.canvasProofCount}`,
      `constraintProofCount=${r.constraintProofCount}`,
      "",
      `proofQualityScore=${r.proofQualityScore}`,
      `proofCoverageScore=${r.proofCoverageScore}`,
      `proofTraceScore=${r.proofTraceScore}`,
      `proofCoherenceScore=${r.proofCoherenceScore}`,
      `outputReturnScore=${r.outputReturnScore}`,
      `evidenceScore=${r.evidenceScore}`,
      `boundaryScore=${r.boundaryScore}`,
      "",
      `northF21EligibilityPrepared=${r.northF21EligibilityPrepared}`,
      `canvasF13EvidencePrepared=${r.canvasF13EvidencePrepared}`,
      `f8ProofPacketReady=${r.f8ProofPacketReady}`,
      `f8ActivationStatus=${r.f8ActivationStatus}`,
      `f8ActivationReason=${r.f8ActivationReason}`,
      "",
      `northReceiptAccepted=${r.northReceiptAccepted}`,
      `northRuntimeContract=${r.northRuntimeContract}`,
      `northRuntimeReceipt=${r.northRuntimeReceipt}`,
      `northF21EligibilityAccepted=${r.northF21EligibilityAccepted}`,
      `northF21Latched=${r.northF21Latched}`,
      "",
      `canvasReceiptAccepted=${r.canvasReceiptAccepted}`,
      `canvasContract=${r.canvasContract}`,
      `canvasReceipt=${r.canvasReceipt}`,
      "",
      `newsProtocolAligned=${r.newsProtocolAligned}`,
      `fibonacciSynchronizationMetricActive=${r.fibonacciSynchronizationMetricActive}`,
      `fibonacciSynchronizationScore=${r.fibonacciSynchronizationScore}`,
      `activeFibonacci=${r.activeFibonacci}`,
      `activeFibonacciRank=${r.activeFibonacciRank}`,
      `activeNewsGate=${r.activeNewsGate}`,
      `sourceFibonacciGate=${r.sourceFibonacciGate}`,
      `futureFibonacciGate=${r.futureFibonacciGate}`,
      `secondaryFutureFibonacciGate=${r.secondaryFutureFibonacciGate}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      "",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      "",
      "PROOF_RECORDS",
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
    setDataset("labRuntimeTableSouthLoaded", "true");
    setDataset("labRuntimeTableSouthContract", CONTRACT);
    setDataset("labRuntimeTableSouthReceipt", RECEIPT);
    setDataset("labRuntimeTableSouthVersion", VERSION);
    setDataset("labRuntimeTableSouthFile", FILE);

    setDataset("southRuntimeTableActive", "true");
    setDataset("southRuntimeTableF8Only", "true");
    setDataset("southSupremeJudgeActive", "true");
    setDataset("southProofReturnActive", "true");
    setDataset("southOutputExhaustActive", "true");
    setDataset("southProofReturnOpen", state.proofReturnOpen);
    setDataset("southProofReturnStatus", state.proofReturnStatus);

    setDataset("southEngineMechanicsPrimary", "true");
    setDataset("southMathPrimary", "true");
    setDataset("southArchitectureLabelsSecondary", "true");
    setDataset("southMechanicalCoordinateId", MECHANICAL_COORDINATE.coordinateId);
    setDataset("southEnginePart", MECHANICAL_COORDINATE.enginePart);
    setDataset("southSystemCategory", MECHANICAL_COORDINATE.systemCategory);
    setDataset("southFibonacciStation", MECHANICAL_COORDINATE.fibonacciStage);
    setDataset("southMechanicalRole", MECHANICAL_COORDINATE.mechanicalRole);
    setDataset("southJudicialRole", MECHANICAL_COORDINATE.judicialRole);
    setDataset("southAuthorityRole", MECHANICAL_COORDINATE.authorityRole);

    setDataset("southWestRuntimeObserved", state.westRuntimeObserved);
    setDataset("southWestRuntimeAccepted", state.westRuntimeAccepted);
    setDataset("southWestF5PressureObserved", state.westF5PressureObserved);
    setDataset("southWestF5PressureAccepted", state.westF5PressureAccepted);

    setDataset("southProofGraphBuilt", state.proofGraphBuilt);
    setDataset("southProofGraphReady", state.proofGraphReady);
    setDataset("southProofGraphStatus", state.proofGraphStatus);
    setDataset("southProofRecordCount", state.proofRecordCount);
    setDataset("southReturnedProofCount", state.returnedProofCount);
    setDataset("southRejectedRecordCount", state.rejectedRecordCount);
    setDataset("southDiagnosticProofCount", state.diagnosticProofCount);
    setDataset("southSupportEngineProofCount", state.supportEngineProofCount);
    setDataset("southRouteProofCount", state.routeProofCount);
    setDataset("southCanvasProofCount", state.canvasProofCount);
    setDataset("southConstraintProofCount", state.constraintProofCount);

    setDataset("southProofQualityScore", state.proofQualityScore);
    setDataset("southProofCoverageScore", state.proofCoverageScore);
    setDataset("southProofTraceScore", state.proofTraceScore);
    setDataset("southProofCoherenceScore", state.proofCoherenceScore);
    setDataset("southOutputReturnScore", state.outputReturnScore);
    setDataset("southEvidenceScore", state.evidenceScore);
    setDataset("southBoundaryScore", state.boundaryScore);

    setDataset("southNorthF21EligibilityPrepared", state.northF21EligibilityPrepared);
    setDataset("southCanvasF13EvidencePrepared", state.canvasF13EvidencePrepared);
    setDataset("southF8ProofPacketReady", state.f8ProofPacketReady);
    setDataset("southF8ActivationStatus", state.f8ActivationStatus);
    setDataset("southF8ActivationReason", state.f8ActivationReason);

    setDataset("southNewsProtocolAligned", "true");
    setDataset("southFibonacciSynchronizationMetricActive", "true");
    setDataset("southFibonacciSynchronizationScore", state.fibonacciSynchronizationScore);
    setDataset("southActiveFibonacci", FIBONACCI.SOUTH_PROOF);
    setDataset("southActiveFibonacciRank", "8");
    setDataset("southActiveNewsGate", NEWS_GATES.SOUTH);
    setDataset("southSourceFibonacciGate", FIBONACCI.WEST_PRESSURE);
    setDataset("southFutureFibonacciGate", FIBONACCI.NORTH_LATCH);
    setDataset("southSecondaryFutureFibonacciGate", FIBONACCI.CANVAS_EVIDENCE);

    setDataset("southFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("southRecommendedNextFile", state.recommendedNextFile);
    setDataset("southRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);

    setDataset("southPublicSuperiorityClaim", "false");
    setDataset("southPublicComparisonClaimAllowed", "false");
    setDataset("southBenchmarkRequiredBeforePublicClaim", "true");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function publishGlobals() {
    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.HEARTH = root.HEARTH || {};

    root.LAB_RUNTIME_TABLE_SOUTH = api;
    root.LAB_RUNTIME_TABLE_SOUTH_F8 = api;
    root.RUNTIME_TABLE_SOUTH = api;
    root.SOUTH_PROOF_RETURN = api;
    root.SOUTH_OUTPUT_EXHAUST = api;
    root.SOUTH_SUPREME_JUDGE = api;
    root.SOUTH_PROOF_BRANCH = api;

    root.DEXTER_LAB.runtimeTableSouth = api;
    root.DEXTER_LAB.runtimeTableSouthF8 = api;
    root.DEXTER_LAB.cardinalRuntimeTableSouth = api;
    root.DEXTER_LAB.southProofReturn = api;
    root.DEXTER_LAB.southOutputExhaust = api;
    root.DEXTER_LAB.southSupremeJudge = api;

    root.HEARTH.runtimeTableSouth = api;
    root.HEARTH.runtimeTableSouthF8 = api;
    root.HEARTH.southProofReturn = api;
    root.HEARTH.southOutputExhaust = api;
    root.HEARTH.southSupremeJudge = api;

    const light = getReceiptLight();

    root.LAB_RUNTIME_TABLE_SOUTH_RECEIPT = light;
    root.LAB_RUNTIME_TABLE_SOUTH_F8_RECEIPT = light;
    root.RUNTIME_TABLE_SOUTH_RECEIPT = light;
    root.SOUTH_PROOF_RETURN_RECEIPT = light;
    root.SOUTH_SUPREME_JUDGE_RECEIPT = light;

    root.DEXTER_LAB.runtimeTableSouthReceipt = light;
    root.HEARTH.runtimeTableSouthReceipt = light;

    root.__LAB_RUNTIME_TABLE_SOUTH_LOADED__ = true;
    root.__LAB_RUNTIME_TABLE_SOUTH_CONTRACT__ = CONTRACT;
    root.__LAB_RUNTIME_TABLE_SOUTH_RECEIPT__ = RECEIPT;
    root.__LAB_RUNTIME_TABLE_SOUTH_F8_ONLY__ = true;
    root.__LAB_RUNTIME_TABLE_SOUTH_MECHANICAL_COORDINATE__ = MECHANICAL_COORDINATE.coordinateId;
    root.__LAB_RUNTIME_TABLE_SOUTH_PUBLIC_SUPERIORITY_CLAIM__ = false;
    root.__LAB_RUNTIME_TABLE_SOUTH_WEBGL__ = false;
    root.__LAB_RUNTIME_TABLE_SOUTH_VISUAL_PASS_CLAIMED__ = false;

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
    PROOF_CLASS,
    MECHANICAL_COORDINATE,
    NORTH_ELIGIBILITY_COORDINATE,
    CANVAS_EVIDENCE_COORDINATE,

    readWestRuntimeAuthority,
    readWestF5PressurePacket,
    hasMeaningfulWestF5Packet,
    validateWestF5PressurePacket,
    acceptWestF5PressurePacket,
    receiveWestF5PressurePacket,
    submitWestF5PressurePacket,
    acceptWestPrimary,
    receiveWestPrimary,

    acceptSouthPrimary,
    receiveSouthPrimary,
    acceptSouthPrimaryGate,
    acceptSouthSpread,
    receiveCycleOneSouthReturn,

    classifyProofPacket,
    proofScoreForClassification,
    evaluateProofPacket,
    normalizeProofRecord,
    acceptProofPacket,
    receiveProofPacket,
    submitProofPacket,

    buildProofGraph,
    rebuildProofGraph,
    computeProofQualityMetric,
    computeFibonacciSynchronizationMetric,
    evaluateNewsAlignment,

    setProofReturnOpen,
    openProofReturn,
    closeProofReturn,

    composeF8ProofPacket,
    composeCanvasF13EvidencePacket,
    composeSouthReceipt,

    readNorthRuntimeAuthority,
    submitF8ProofToNorth,
    readCanvasAuthority,
    submitCanvasF13Evidence,

    validateNorthReceipt,
    acceptNorthReceipt,
    validateCanvasReceipt,
    acceptCanvasReceipt,

    bindStateToMechanicalCoordinate,
    evaluateCoordinateState,
    getMechanicalCoordinatePacket,

    getProofGraph,
    getProofGraphSummary,
    getProofRecords,
    getRejectedRecords,
    findProofRecord,

    getReceiptLight,
    getReceipt,
    getReceiptText,
    publishGlobals,
    updateDataset,

    southRuntimeTableActive: true,
    southRuntimeTableF8Only: true,
    southSupremeJudgeActive: true,
    southProofReturnActive: true,
    southOutputExhaustActive: true,

    engineMechanicsPrimary: true,
    mathPrimary: true,
    architectureLabelsSecondary: true,

    ownsF8SouthProofReturn: true,
    ownsProofPacketEvaluation: true,
    ownsOutputExhaustReceiptPreparation: true,
    ownsNorthF21EligibilityPacketPreparation: true,
    ownsCanvasF13EvidencePacketPreparation: true,
    ownsState256ProofBinding: true,

    ownsNorthF21Latch: false,
    ownsEastF3IntakeAdmission: false,
    ownsWestF5PressureAdmissibility: false,
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
    const westPacket = readWestF5PressurePacket();
    if (hasMeaningfulWestF5Packet(westPacket)) {
      acceptWestF5PressurePacket(westPacket);
    }
  } catch (error) {
    recordError("INITIAL_WEST_F5_PACKET_READ_FAILED", error);
  }

  try {
    computeFibonacciSynchronizationMetric();
  } catch (error) {
    recordError("INITIAL_SOUTH_F8_SYNC_METRIC_FAILED", error);
  }

  recordLocal("SOUTH_F8_ENGINE_MECHANICS_PROOF_RETURN_LOADED", {
    file: FILE,
    contract: CONTRACT,
    mechanicalCoordinate: MECHANICAL_COORDINATE.coordinateId,
    northEligibilityCoordinate: NORTH_ELIGIBILITY_COORDINATE.coordinateId,
    canvasEvidenceCoordinate: CANVAS_EVIDENCE_COORDINATE.coordinateId,
    targetFile: NORTH_FILE,
    publicSuperiorityClaim: false
  });

  publishGlobals();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

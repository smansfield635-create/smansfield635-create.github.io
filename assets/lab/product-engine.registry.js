// /assets/lab/product-engine.registry.js
// LAB_PRODUCT_ENGINE_REGISTRY_F89_ENGINE_MECHANICS_PROJECT_REGISTRY_CONDUCTOR_TNT_v2
// Full-file replacement.
// Product Engine Registry F89 / project registry conductor / Registry Clerk.
// Purpose:
// - Consume F55 UE5 Expression release packet from /assets/lab/product-engine.ue5-expression.js.
// - Build deterministic project registry records from product, scene, expression, registry-ready, file, route, contract, and receipt evidence.
// - Bind directly to runtime-table v4 mechanics: RT3D-X14_Y19_Z89.
// - Prepare F144 market-readiness handoff packet for /assets/lab/product-engine.market.js.
// - Preserve F34 -> F55 -> F89 -> F144 -> F233 sequence.
// - Avoid rendering, generated image claims, WebGL claims, GraphicBox claims, public superiority claims, and final visual pass claims.
// Does not own:
// - F34 Product Engine authority
// - F55 Expression authority
// - F144 Market authority
// - F233 downstream return
// - North F21 latch
// - Canvas F13 evidence
// - actual rendering
// - route orchestration
// - planet truth
// - material/elevation/hydrology truth
// - generated image
// - GraphicBox
// - WebGL
// - public superiority claim
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "LAB_PRODUCT_ENGINE_REGISTRY_F89_ENGINE_MECHANICS_PROJECT_REGISTRY_CONDUCTOR_TNT_v2";
  const RECEIPT = "LAB_PRODUCT_ENGINE_REGISTRY_F89_ENGINE_MECHANICS_PROJECT_REGISTRY_CONDUCTOR_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "LAB_PRODUCT_ENGINE_REGISTRY_F89_PROJECT_CONDUCTOR_TNT_v1";
  const BASELINE_CONTRACT = "LAB_PRODUCT_ENGINE_REGISTRY_BASELINE_v1";
  const VERSION = "2026-06-08.lab-product-engine-registry-f89-engine-mechanics-project-registry-conductor-v2";

  const FILE = "/assets/lab/product-engine.registry.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const F34_PRODUCT_ENGINE_FILE = "/assets/lab/product-engine.js";
  const F55_EXPRESSION_FILE = "/assets/lab/product-engine.ue5-expression.js";
  const F144_MARKET_FILE = "/assets/lab/product-engine.market.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const FIBONACCI = Object.freeze({
    NORTH_LATCH: "F21",
    PRODUCT_ENGINE: "F34",
    UE5_EXPRESSION: "F55",
    PROJECT_REGISTRY: "F89",
    MARKET_READINESS: "F144",
    DOWNSTREAM_RETURN: "F233"
  });

  const NEWS_GATES = Object.freeze({
    NORTH: "NORTH",
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
    COMPLETE: "COMPLETE"
  });

  const REGISTRY_RECORD_TYPES = Object.freeze({
    PRODUCT_RECORD: "product-record",
    SCENE_RECORD: "scene-record",
    EXPRESSION_RECORD: "expression-record",
    FILE_RECORD: "file-record",
    ROUTE_RECORD: "route-record",
    CONTRACT_RECORD: "contract-record",
    RECEIPT_RECORD: "receipt-record",
    DIAGNOSTIC_RECORD: "diagnostic-record",
    MARKET_INPUT_RECORD: "market-input-record"
  });

  const MECHANICAL_COORDINATE = Object.freeze({
    coordinateId: "RT3D-X14_Y19_Z89",
    enginePart: "MANIFOLD",
    enginePartIndex: 14,
    systemCategory: "NINETEEN_PART_SYSTEM",
    systemCategoryIndex: 19,
    fibonacciStage: FIBONACCI.PROJECT_REGISTRY,
    fibonacciRank: 89,
    fibonacciStation: "REGISTRY_CLERK",
    mechanicalRole: "PROJECT_REGISTRY_CONDUCTOR",
    clerkRole: "REGISTRY_CLERK",
    chessRole: "ROOK",
    mayJudge: false,
    mayLatch: false,
    mayRender: false,
    mayClaimPublicSuperiority: false
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,

    registryEngineF89Active: true,
    registryEngineF89Only: true,
    registryClerkActive: true,
    projectRegistryConductorActive: true,

    engineMechanicsPrimary: true,
    mathPrimary: true,
    architectureLabelsSecondary: true,
    mechanicalCoordinate: MECHANICAL_COORDINATE,

    f55ExpressionObserved: false,
    f55ExpressionReleaseAccepted: false,
    f55ExpressionReleasePacket: null,
    f55Contract: "",
    f55Receipt: "",

    sceneGraphObserved: false,
    sceneGraphStatus: STATUS.HELD,
    sceneNodeCount: 0,
    expressionNodeCount: 0,
    incomingRegistryRecordNodeCount: 0,
    diagnosticEvidenceNodeCount: 0,

    registryGraphBuilt: false,
    registryGraphReady: false,
    registryGraphStatus: STATUS.HELD,
    registryRecordCount: 0,
    registryReadyRecordCount: 0,
    registryDegradedRecordCount: 0,
    registryBlockedRecordCount: 0,
    fileRecordCount: 0,
    routeRecordCount: 0,
    contractRecordCount: 0,
    receiptRecordCount: 0,
    productRecordCount: 0,
    expressionRecordCount: 0,
    marketInputRecordCount: 0,

    registryGraph: {
      records: [],
      recordsById: {},
      indexes: {
        byType: {},
        byFile: {},
        byRoute: {},
        byContract: {},
        byReceipt: {},
        byProduct: {},
        byStatus: {}
      },
      marketInputs: [],
      edges: [],
      buildId: "",
      builtAt: ""
    },

    registryQualityMetricActive: true,
    registryQualityScore: 0,
    registryCoverageScore: 0,
    registryTraceScore: 0,
    registryCoherenceScore: 0,
    marketInputReadinessScore: 0,

    f144MarketReleaseAuthorized: false,
    f89ReleasePacketReady: false,
    f89ActivationStatus: STATUS.ACTIVE,
    f89ActivationReason: "PROJECT_REGISTRY_F89_ACTIVE_WAITING_F55_EXPRESSION_RELEASE",

    f144MarketReceiptAccepted: false,
    f144MarketReceiptPacket: null,
    f144MarketContract: "",
    f144MarketReceipt: "",

    activeFibonacci: FIBONACCI.PROJECT_REGISTRY,
    activeFibonacciRank: 89,
    activeNewsGate: NEWS_GATES.REGISTRY,
    sourceFibonacciGate: FIBONACCI.UE5_EXPRESSION,
    futureFibonacciGate: FIBONACCI.MARKET_READINESS,
    newsProtocolAligned: true,
    fibonacciSynchronizationMetricActive: true,
    fibonacciSynchronizationScore: 0,
    oneActiveGearAtATime: true,

    firstFailedCoordinate: "WAITING_F55_EXPRESSION_RELEASE",
    recommendedNextFile: F55_EXPRESSION_FILE,
    recommendedNextRenewalTarget: F55_EXPRESSION_FILE,

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

  function trim(list, max = 180) {
    if (Array.isArray(list) && list.length > max) {
      list.splice(0, list.length - max);
    }
  }

  function makeId(value, fallback = "record") {
    const raw = safeString(value || fallback, fallback)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return raw || fallback;
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
      code: safeString(code, "PROJECT_REGISTRY_F89_ERROR"),
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

  function hasMeaningfulF55Release(packet = {}) {
    if (!isObject(packet)) return false;

    return Boolean(
      packet.contract ||
      packet.receipt ||
      packet.packetType === "UE5_EXPRESSION_F55_RELEASE_PACKET" ||
      safeBool(packet.expressionEngineF55Active, false) ||
      safeBool(packet.f55ReleasePacketReady, false) ||
      safeBool(packet.sceneGraphBuilt, false) ||
      Array.isArray(packet.expressionRecords) ||
      Array.isArray(packet.registryRecords)
    );
  }

  function readF55ExpressionAuthority() {
    return firstGlobal([
      "LAB_PRODUCT_ENGINE_UE5_EXPRESSION",
      "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55",
      "PRODUCT_ENGINE_UE5_EXPRESSION",
      "UE5_EXPRESSION_CONDUCTOR",
      "UE5_EXPRESSION_F55_CONDUCTOR",
      "EXPRESSION_CLERK",
      "DEXTER_LAB.productEngineUE5Expression",
      "DEXTER_LAB.productEngineUE5ExpressionF55",
      "DEXTER_LAB.ue5ExpressionConductor",
      "DEXTER_LAB.expressionClerk",
      "HEARTH.productEngineUE5Expression",
      "HEARTH.productEngineUE5ExpressionF55",
      "HEARTH.ue5ExpressionConductor",
      "HEARTH.expressionClerk"
    ]);
  }

  function readF55ExpressionRelease() {
    const authority = readF55ExpressionAuthority();
    if (!authority) return {};

    try {
      if (isFunction(authority.composeF55ReleasePacket)) {
        const packet = authority.composeF55ReleasePacket();
        if (isObject(packet)) return packet;
      }

      if (isFunction(authority.getReceipt)) {
        const receipt = authority.getReceipt();
        if (isObject(receipt) && isObject(receipt.f55ReleasePacket)) return receipt.f55ReleasePacket;
      }

      return readReceipt(authority);
    } catch (error) {
      recordError("F55_EXPRESSION_RELEASE_READ_FAILED", error);
      return {};
    }
  }

  function validateF55ExpressionRelease(packet = {}) {
    const input = isObject(packet) ? packet : {};
    const noForbiddenClaim = !detectForbiddenClaim(input);
    const meaningful = hasMeaningfulF55Release(input);

    const activeFibonacci = safeString(input.activeFibonacci || input.fibonacciStage || "");
    const futureFibonacciGate = safeString(input.futureFibonacciGate || "");

    const correctStage = Boolean(
      !activeFibonacci ||
      activeFibonacci === FIBONACCI.UE5_EXPRESSION ||
      activeFibonacci === "F55"
    );

    const correctFuture = Boolean(
      !futureFibonacciGate ||
      futureFibonacciGate === FIBONACCI.PROJECT_REGISTRY ||
      futureFibonacciGate === "F89"
    );

    const registryRecordsAcceptable = Boolean(
      Array.isArray(input.registryRecords) ||
      Array.isArray(input.expressionRecords) ||
      isObject(input.sceneGraph)
    );

    const accepted = Boolean(
      noForbiddenClaim &&
      meaningful &&
      correctStage &&
      correctFuture &&
      registryRecordsAcceptable
    );

    let reason = "F55_EXPRESSION_RELEASE_ACCEPTED";
    if (!noForbiddenClaim) reason = "FORBIDDEN_CLAIM_DETECTED_IN_F55_RELEASE";
    else if (!meaningful) reason = "F55_RELEASE_NOT_MEANINGFUL";
    else if (!correctStage) reason = "F55_RELEASE_WRONG_ACTIVE_FIBONACCI";
    else if (!correctFuture) reason = "F55_RELEASE_WRONG_FUTURE_GATE";
    else if (!registryRecordsAcceptable) reason = "F55_RELEASE_MISSING_REGISTRY_RECORD_SOURCE";

    return {
      accepted,
      reason,
      noForbiddenClaim,
      meaningful,
      correctStage,
      correctFuture,
      registryRecordsAcceptable,
      input: clonePlain(input)
    };
  }

  function acceptF55ExpressionRelease(packet = {}) {
    const validation = validateF55ExpressionRelease(packet);

    if (validation.accepted) {
      state.f55ExpressionObserved = true;
      state.f55ExpressionReleaseAccepted = true;
      state.f55ExpressionReleasePacket = clonePlain(packet);
      state.f55Contract = safeString(packet.contract, "");
      state.f55Receipt = safeString(packet.receipt, "");

      state.sceneGraphObserved = true;
      state.sceneGraphStatus = safeString(packet.sceneGraphStatus || STATUS.READY, STATUS.READY);
      state.sceneNodeCount = safeNumber(packet.sceneNodeCount, 0);
      state.expressionNodeCount = safeNumber(packet.expressionNodeCount, 0);
      state.incomingRegistryRecordNodeCount = safeNumber(packet.registryRecordNodeCount, 0);
      state.diagnosticEvidenceNodeCount = safeNumber(packet.diagnosticEvidenceNodeCount, 0);

      buildRegistryGraph(packet);
    }

    recordLocal("F55_EXPRESSION_RELEASE_EVALUATED_BY_PROJECT_REGISTRY_F89", {
      accepted: validation.accepted,
      reason: validation.reason,
      registryRecordSourcePresent: validation.registryRecordsAcceptable
    });

    computeFibonacciSynchronizationMetric();
    publishGlobals();

    return {
      accepted: validation.accepted,
      registryEngineF89ReceivedF55: true,
      reason: validation.reason,
      registryGraphBuilt: state.registryGraphBuilt,
      registryGraphReady: state.registryGraphReady,
      f144MarketReleaseAuthorized: state.f144MarketReleaseAuthorized,
      recommendedNextFile: validation.accepted ? F144_MARKET_FILE : F55_EXPRESSION_FILE,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function receiveF55ExpressionRelease(packet = {}) {
    return acceptF55ExpressionRelease(packet);
  }

  function submitF55ExpressionRelease(packet = {}) {
    return acceptF55ExpressionRelease(packet);
  }

  function getF55SourceProducts(packet = state.f55ExpressionReleasePacket || {}) {
    if (Array.isArray(packet.sceneGraph && packet.sceneGraph.products)) {
      return packet.sceneGraph.products;
    }

    if (Array.isArray(packet.products)) {
      return packet.products;
    }

    return [];
  }

  function getF55ExpressionRecords(packet = state.f55ExpressionReleasePacket || {}) {
    if (Array.isArray(packet.expressionRecords)) {
      return packet.expressionRecords;
    }

    if (isObject(packet.sceneGraph) && Array.isArray(packet.sceneGraph.expressionRecords)) {
      return packet.sceneGraph.expressionRecords;
    }

    return [];
  }

  function getF55RegistryRecords(packet = state.f55ExpressionReleasePacket || {}) {
    if (Array.isArray(packet.registryRecords)) {
      return packet.registryRecords;
    }

    if (isObject(packet.sceneGraph) && Array.isArray(packet.sceneGraph.registryRecords)) {
      return packet.sceneGraph.registryRecords;
    }

    return [];
  }

  function normalizeRegistryRecord(source = {}, fallbackType = REGISTRY_RECORD_TYPES.REGISTRY_RECORD, index = 0) {
    const recordType = safeString(source.recordType || source.type || fallbackType, fallbackType);
    const sourceProductId = safeString(source.sourceProductId || source.productId || source.id || `source-${index + 1}`);
    const id = makeId(
      source.registryRecordId ||
      source.recordId ||
      `${recordType}-${sourceProductId}-${index + 1}`,
      `${recordType}-${index + 1}`
    );

    const file = safeString(source.file || source.sourceFile || "");
    const route = safeString(source.route || "");
    const contract = safeString(source.contract || source.sourceContract || "");
    const receipt = safeString(source.receipt || source.sourceReceipt || "");

    const traceReady = safeBool(
      source.traceReady,
      Boolean(file || route || contract || receipt)
    );

    const registryReady = safeBool(
      source.registryReady,
      traceReady
    );

    const readinessScore = clamp(
      safeNumber(source.readinessScore ?? source.expressionReadinessScore ?? source.registryReadinessScore, 0) ||
      (
        (traceReady ? 34 : 0) +
        (registryReady ? 34 : 0) +
        (file ? 8 : 0) +
        (route ? 8 : 0) +
        (contract ? 8 : 0) +
        (receipt ? 8 : 0)
      ),
      0,
      100
    );

    const status =
      registryReady && readinessScore >= 78
        ? STATUS.READY
        : traceReady && readinessScore >= 55
          ? STATUS.DEGRADED
          : STATUS.HELD;

    return {
      id,
      recordId: id,
      recordType,
      sourceProductId,
      sourceExpressionRecordId: safeString(source.expressionRecordId || source.expressionNodeId || ""),
      sourceSceneNodeId: safeString(source.sceneNodeId || ""),
      sourceFile: file,
      file,
      route,
      contract,
      receipt,
      label: safeString(source.label || source.name || id),
      traceReady,
      registryReady,
      readinessScore,
      status,
      tags: Array.isArray(source.tags) ? source.tags.slice() : [],
      deterministic: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      publicSuperiorityClaim: false,
      createdAt: safeString(source.createdAt || nowIso()),
      updatedAt: nowIso()
    };
  }

  function createProductRecord(product = {}, index = 0) {
    const id = makeId(product.id || product.productId || product.name || `product-${index + 1}`, `product-${index + 1}`);

    return normalizeRegistryRecord({
      registryRecordId: `product-record-${id}`,
      recordType: REGISTRY_RECORD_TYPES.PRODUCT_RECORD,
      sourceProductId: id,
      label: safeString(product.label || product.name || id),
      file: safeString(product.file || ""),
      route: safeString(product.route || ""),
      contract: safeString(product.contract || ""),
      receipt: safeString(product.receipt || ""),
      readinessScore: clamp(product.readinessScore ?? 0, 0, 100),
      traceReady: Boolean(product.file || product.route || product.contract || product.receipt),
      registryReady: safeBool(product.receiptReady, Boolean(product.contract || product.receipt)),
      tags: Array.isArray(product.tags) ? product.tags.slice() : []
    }, REGISTRY_RECORD_TYPES.PRODUCT_RECORD, index);
  }

  function createExpressionRecordRecord(expressionRecord = {}, index = 0) {
    return normalizeRegistryRecord({
      ...clonePlain(expressionRecord),
      registryRecordId: `expression-record-${safeString(expressionRecord.expressionRecordId || expressionRecord.sourceProductId || index + 1)}`,
      recordType: REGISTRY_RECORD_TYPES.EXPRESSION_RECORD,
      sourceProductId: safeString(expressionRecord.sourceProductId || `expression-product-${index + 1}`),
      readinessScore: safeNumber(expressionRecord.expressionReadinessScore, 0),
      traceReady: true,
      registryReady: safeBool(expressionRecord.registryReady, false)
    }, REGISTRY_RECORD_TYPES.EXPRESSION_RECORD, index);
  }

  function createFileRecord(file, source = {}, index = 0) {
    return normalizeRegistryRecord({
      registryRecordId: `file-record-${file}`,
      recordType: REGISTRY_RECORD_TYPES.FILE_RECORD,
      sourceProductId: safeString(source.sourceProductId || source.id || `file-source-${index + 1}`),
      file,
      route: safeString(source.route || ""),
      contract: safeString(source.contract || ""),
      receipt: safeString(source.receipt || ""),
      traceReady: true,
      registryReady: true,
      readinessScore: 88
    }, REGISTRY_RECORD_TYPES.FILE_RECORD, index);
  }

  function createRouteRecord(route, source = {}, index = 0) {
    return normalizeRegistryRecord({
      registryRecordId: `route-record-${route}`,
      recordType: REGISTRY_RECORD_TYPES.ROUTE_RECORD,
      sourceProductId: safeString(source.sourceProductId || source.id || `route-source-${index + 1}`),
      file: safeString(source.file || ""),
      route,
      contract: safeString(source.contract || ""),
      receipt: safeString(source.receipt || ""),
      traceReady: true,
      registryReady: true,
      readinessScore: 84
    }, REGISTRY_RECORD_TYPES.ROUTE_RECORD, index);
  }

  function createContractRecord(contract, source = {}, index = 0) {
    return normalizeRegistryRecord({
      registryRecordId: `contract-record-${contract}`,
      recordType: REGISTRY_RECORD_TYPES.CONTRACT_RECORD,
      sourceProductId: safeString(source.sourceProductId || source.id || `contract-source-${index + 1}`),
      file: safeString(source.file || ""),
      route: safeString(source.route || ""),
      contract,
      receipt: safeString(source.receipt || ""),
      traceReady: true,
      registryReady: true,
      readinessScore: 90
    }, REGISTRY_RECORD_TYPES.CONTRACT_RECORD, index);
  }

  function createReceiptRecord(receipt, source = {}, index = 0) {
    return normalizeRegistryRecord({
      registryRecordId: `receipt-record-${receipt}`,
      recordType: REGISTRY_RECORD_TYPES.RECEIPT_RECORD,
      sourceProductId: safeString(source.sourceProductId || source.id || `receipt-source-${index + 1}`),
      file: safeString(source.file || ""),
      route: safeString(source.route || ""),
      contract: safeString(source.contract || ""),
      receipt,
      traceReady: true,
      registryReady: true,
      readinessScore: 90
    }, REGISTRY_RECORD_TYPES.RECEIPT_RECORD, index);
  }

  function createMarketInputRecord(record, index = 0) {
    return normalizeRegistryRecord({
      registryRecordId: `market-input-${record.id || index + 1}`,
      recordType: REGISTRY_RECORD_TYPES.MARKET_INPUT_RECORD,
      sourceProductId: safeString(record.sourceProductId || record.id || `market-input-${index + 1}`),
      file: record.file,
      route: record.route,
      contract: record.contract,
      receipt: record.receipt,
      readinessScore: clamp(
        (record.registryReady ? 36 : 0) +
        (record.traceReady ? 24 : 0) +
        (record.file || record.route ? 12 : 0) +
        (record.contract ? 12 : 0) +
        (record.receipt ? 12 : 0) +
        (record.status === STATUS.READY ? 4 : 0),
        0,
        100
      ),
      traceReady: record.traceReady,
      registryReady: record.registryReady,
      tags: ["market-input", record.recordType]
    }, REGISTRY_RECORD_TYPES.MARKET_INPUT_RECORD, index);
  }

  function addRecordUnique(recordsById, record) {
    if (!record || !record.id) return;
    if (!recordsById[record.id]) {
      recordsById[record.id] = record;
      return;
    }

    const existing = recordsById[record.id];
    if (safeNumber(record.readinessScore, 0) > safeNumber(existing.readinessScore, 0)) {
      recordsById[record.id] = record;
    }
  }

  function indexRecord(indexes, record) {
    if (!record || !record.id) return;

    const add = (bucket, key, id) => {
      if (!key) return;
      const safeKey = safeString(key);
      bucket[safeKey] = bucket[safeKey] || [];
      if (!bucket[safeKey].includes(id)) bucket[safeKey].push(id);
    };

    add(indexes.byType, record.recordType, record.id);
    add(indexes.byFile, record.file, record.id);
    add(indexes.byRoute, record.route, record.id);
    add(indexes.byContract, record.contract, record.id);
    add(indexes.byReceipt, record.receipt, record.id);
    add(indexes.byProduct, record.sourceProductId, record.id);
    add(indexes.byStatus, record.status, record.id);
  }

  function buildRegistryGraph(packet = state.f55ExpressionReleasePacket || {}, options = {}) {
    const products = getF55SourceProducts(packet);
    const expressionRecords = getF55ExpressionRecords(packet);
    const incomingRegistryRecords = getF55RegistryRecords(packet);

    const recordsById = {};
    const edges = [];

    products.forEach((product, index) => {
      addRecordUnique(recordsById, createProductRecord(product, index));
    });

    expressionRecords.forEach((record, index) => {
      addRecordUnique(recordsById, createExpressionRecordRecord(record, index));
    });

    incomingRegistryRecords.forEach((record, index) => {
      addRecordUnique(recordsById, normalizeRegistryRecord(record, REGISTRY_RECORD_TYPES.REGISTRY_RECORD, index));
    });

    const sourceRecords = Object.values(recordsById);

    sourceRecords.forEach((record, index) => {
      if (record.file) addRecordUnique(recordsById, createFileRecord(record.file, record, index));
      if (record.route) addRecordUnique(recordsById, createRouteRecord(record.route, record, index));
      if (record.contract) addRecordUnique(recordsById, createContractRecord(record.contract, record, index));
      if (record.receipt) addRecordUnique(recordsById, createReceiptRecord(record.receipt, record, index));
    });

    Object.values(recordsById).forEach((record) => {
      if (record.sourceProductId && record.recordType !== REGISTRY_RECORD_TYPES.PRODUCT_RECORD) {
        edges.push({
          from: `product-record-${record.sourceProductId}`,
          to: record.id,
          type: "product-to-registry-record",
          deterministic: true
        });
      }

      if (record.file) {
        edges.push({
          from: record.id,
          to: makeId(`file-record-${record.file}`),
          type: "record-to-file",
          deterministic: true
        });
      }

      if (record.contract) {
        edges.push({
          from: record.id,
          to: makeId(`contract-record-${record.contract}`),
          type: "record-to-contract",
          deterministic: true
        });
      }

      if (record.receipt) {
        edges.push({
          from: record.id,
          to: makeId(`receipt-record-${record.receipt}`),
          type: "record-to-receipt",
          deterministic: true
        });
      }
    });

    const records = Object.values(recordsById).sort((a, b) => {
      if (a.recordType !== b.recordType) return a.recordType.localeCompare(b.recordType);
      if (b.readinessScore !== a.readinessScore) return b.readinessScore - a.readinessScore;
      return a.id.localeCompare(b.id);
    });

    const marketInputs = records
      .filter((record) => record.registryReady || record.traceReady)
      .map((record, index) => createMarketInputRecord(record, index));

    const indexes = {
      byType: {},
      byFile: {},
      byRoute: {},
      byContract: {},
      byReceipt: {},
      byProduct: {},
      byStatus: {}
    };

    records.forEach((record) => indexRecord(indexes, record));
    marketInputs.forEach((record) => indexRecord(indexes, record));

    state.registryGraph = {
      records,
      recordsById,
      indexes,
      marketInputs,
      edges,
      buildId: `f89-registry-graph-${records.length}-${marketInputs.length}-${edges.length}`,
      builtAt: nowIso()
    };

    state.registryGraphBuilt = true;
    state.registryRecordCount = records.length;
    state.registryReadyRecordCount = records.filter((record) => record.status === STATUS.READY).length;
    state.registryDegradedRecordCount = records.filter((record) => record.status === STATUS.DEGRADED).length;
    state.registryBlockedRecordCount = records.filter((record) => record.status === STATUS.BLOCKED || record.status === STATUS.HELD).length;

    state.fileRecordCount = records.filter((record) => record.recordType === REGISTRY_RECORD_TYPES.FILE_RECORD).length;
    state.routeRecordCount = records.filter((record) => record.recordType === REGISTRY_RECORD_TYPES.ROUTE_RECORD).length;
    state.contractRecordCount = records.filter((record) => record.recordType === REGISTRY_RECORD_TYPES.CONTRACT_RECORD).length;
    state.receiptRecordCount = records.filter((record) => record.recordType === REGISTRY_RECORD_TYPES.RECEIPT_RECORD).length;
    state.productRecordCount = records.filter((record) => record.recordType === REGISTRY_RECORD_TYPES.PRODUCT_RECORD).length;
    state.expressionRecordCount = records.filter((record) => record.recordType === REGISTRY_RECORD_TYPES.EXPRESSION_RECORD).length;
    state.marketInputRecordCount = marketInputs.length;

    computeRegistryQualityMetric();

    state.registryGraphReady = Boolean(
      records.length > 0 &&
      state.registryQualityScore >= 80 &&
      state.marketInputRecordCount > 0
    );

    if (state.registryGraphReady) {
      state.registryGraphStatus = STATUS.READY;
      state.f144MarketReleaseAuthorized = true;
      state.f89ReleasePacketReady = true;
      state.f89ActivationStatus = STATUS.READY;
      state.f89ActivationReason = "PROJECT_REGISTRY_F89_READY_FOR_F144_MARKET";
      state.firstFailedCoordinate = "NONE_PROJECT_REGISTRY_F89_READY_F144_RELEASE_AUTHORIZED";
      state.recommendedNextFile = F144_MARKET_FILE;
      state.recommendedNextRenewalTarget = F144_MARKET_FILE;
    } else if (records.length > 0 && state.registryQualityScore >= 62) {
      state.registryGraphStatus = STATUS.DEGRADED;
      state.f144MarketReleaseAuthorized = true;
      state.f89ReleasePacketReady = true;
      state.f89ActivationStatus = STATUS.DEGRADED;
      state.f89ActivationReason = "PROJECT_REGISTRY_F89_DEGRADED_F144_RELEASE_AVAILABLE_WITH_BOUNDARIES";
      state.firstFailedCoordinate = "NONE_PROJECT_REGISTRY_F89_DEGRADED_F144_RELEASE_AVAILABLE";
      state.recommendedNextFile = F144_MARKET_FILE;
      state.recommendedNextRenewalTarget = F144_MARKET_FILE;
    } else {
      state.registryGraphStatus = STATUS.HELD;
      state.f144MarketReleaseAuthorized = false;
      state.f89ReleasePacketReady = false;
      state.f89ActivationStatus = STATUS.HELD;
      state.f89ActivationReason = "WAITING_F55_EXPRESSION_RELEASE_OR_REGISTRY_QUALITY";
      state.firstFailedCoordinate = "WAITING_F55_EXPRESSION_RELEASE_OR_REGISTRY_QUALITY";
      state.recommendedNextFile = F55_EXPRESSION_FILE;
      state.recommendedNextRenewalTarget = F55_EXPRESSION_FILE;
    }

    computeFibonacciSynchronizationMetric();

    if (options.silent !== true) {
      recordLocal("PROJECT_REGISTRY_F89_REGISTRY_GRAPH_BUILT", {
        registryRecordCount: state.registryRecordCount,
        marketInputRecordCount: state.marketInputRecordCount,
        edgeCount: edges.length,
        registryGraphStatus: state.registryGraphStatus,
        registryQualityScore: state.registryQualityScore
      });
    }

    updateDataset();

    return clonePlain(state.registryGraph);
  }

  function computeRegistryQualityMetric() {
    const records = state.registryGraph.records || [];
    const marketInputs = state.registryGraph.marketInputs || [];
    const recordCount = Math.max(1, records.length);
    const marketInputCount = Math.max(1, marketInputs.length);

    const readyRatio = records.filter((record) => record.status === STATUS.READY).length / recordCount;
    const degradedRatio = records.filter((record) => record.status === STATUS.DEGRADED).length / recordCount;
    const blockedRatio = records.filter((record) => record.status === STATUS.BLOCKED || record.status === STATUS.HELD).length / recordCount;

    const typeCoverage = [
      state.productRecordCount > 0,
      state.expressionRecordCount > 0,
      state.fileRecordCount > 0,
      state.contractRecordCount > 0,
      state.receiptRecordCount > 0,
      state.marketInputRecordCount > 0
    ].filter(Boolean).length / 6;

    state.registryCoverageScore = clamp(Math.round(typeCoverage * 100), 0, 100);

    state.registryTraceScore = clamp(
      Math.round(
        (
          records.filter((record) => record.traceReady).length / recordCount
        ) * 100
      ),
      0,
      100
    );

    state.registryCoherenceScore = clamp(
      Math.round(
        (readyRatio * 58) +
        (degradedRatio * 24) -
        (blockedRatio * 38) +
        (state.registryCoverageScore * 0.10) +
        (state.registryTraceScore * 0.10)
      ),
      0,
      100
    );

    state.registryQualityScore = clamp(
      Math.round(
        (state.registryCoherenceScore * 0.42) +
        (state.registryCoverageScore * 0.30) +
        (state.registryTraceScore * 0.28)
      ),
      0,
      100
    );

    state.marketInputReadinessScore = clamp(
      Math.round(
        (
          marketInputs.reduce((sum, record) => sum + safeNumber(record.readinessScore, 0), 0) / marketInputCount
        ) * 0.72 +
        state.registryTraceScore * 0.14 +
        state.registryCoverageScore * 0.14
      ),
      0,
      100
    );

    return {
      registryQualityScore: state.registryQualityScore,
      registryCoverageScore: state.registryCoverageScore,
      registryTraceScore: state.registryTraceScore,
      registryCoherenceScore: state.registryCoherenceScore,
      marketInputReadinessScore: state.marketInputReadinessScore,
      publicSuperiorityClaim: false,
      publicComparisonClaimAllowed: false
    };
  }

  function computeFibonacciSynchronizationMetric() {
    const checks = [
      state.newsProtocolAligned,
      state.oneActiveGearAtATime,
      state.activeFibonacci === FIBONACCI.PROJECT_REGISTRY,
      state.activeFibonacciRank === 89,
      state.activeNewsGate === NEWS_GATES.REGISTRY,
      state.sourceFibonacciGate === FIBONACCI.UE5_EXPRESSION,
      state.futureFibonacciGate === FIBONACCI.MARKET_READINESS,
      state.registryEngineF89Active,
      state.registryClerkActive,
      state.projectRegistryConductorActive,
      state.engineMechanicsPrimary,
      state.mathPrimary,
      state.mechanicalCoordinate.coordinateId === "RT3D-X14_Y19_Z89",
      state.f55ExpressionReleaseAccepted || state.f55ExpressionObserved,
      state.registryGraphBuilt,
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

    computeRegistryQualityMetric();

    return {
      score: state.fibonacciSynchronizationScore,
      passed,
      total: checks.length,
      activeFibonacci: FIBONACCI.PROJECT_REGISTRY,
      activeFibonacciRank: 89,
      activeNewsGate: NEWS_GATES.REGISTRY,
      sourceFibonacciGate: FIBONACCI.UE5_EXPRESSION,
      futureFibonacciGate: FIBONACCI.MARKET_READINESS,
      publicSuperiorityClaim: false
    };
  }

  function evaluateNewsAlignment() {
    const metric = computeFibonacciSynchronizationMetric();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      newsAlignmentContract: "LAB_PRODUCT_ENGINE_REGISTRY_F89_NEWS_ALIGNMENT_PROTOCOL_v2",
      newsAlignmentReceipt: "LAB_PRODUCT_ENGINE_REGISTRY_F89_NEWS_ALIGNMENT_PROTOCOL_RECEIPT_v2",
      sequence: [
        {
          gate: NEWS_GATES.EXPRESSION,
          fibonacci: FIBONACCI.UE5_EXPRESSION,
          file: F55_EXPRESSION_FILE,
          ready: state.f55ExpressionReleaseAccepted
        },
        {
          gate: NEWS_GATES.REGISTRY,
          fibonacci: FIBONACCI.PROJECT_REGISTRY,
          file: FILE,
          ready: state.registryGraphReady || state.registryGraphStatus === STATUS.DEGRADED
        },
        {
          gate: NEWS_GATES.MARKET,
          fibonacci: FIBONACCI.MARKET_READINESS,
          file: F144_MARKET_FILE,
          ready: state.f144MarketReleaseAuthorized
        },
        {
          gate: NEWS_GATES.DOWNSTREAM,
          fibonacci: FIBONACCI.DOWNSTREAM_RETURN,
          file: NORTH_FILE,
          ready: false
        }
      ],
      fibonacciSynchronizationScore: metric.score,
      f89Status: state.f89ActivationStatus,
      registryGraphStatus: state.registryGraphStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function readF144MarketAuthority() {
    return firstGlobal([
      "LAB_PRODUCT_ENGINE_MARKET",
      "LAB_PRODUCT_ENGINE_MARKET_F144",
      "PRODUCT_ENGINE_MARKET",
      "MARKET_F144_READINESS_CONDUCTOR",
      "DEXTER_LAB.productEngineMarket",
      "DEXTER_LAB.productEngineMarketF144",
      "DEXTER_LAB.marketF144ReadinessConductor",
      "HEARTH.productEngineMarket",
      "HEARTH.productEngineMarketF144",
      "HEARTH.marketF144ReadinessConductor"
    ]);
  }

  function composeF89ReleasePacket(extra = {}) {
    const metric = computeFibonacciSynchronizationMetric();
    const readyForF144 = Boolean(state.registryGraphReady || state.registryGraphStatus === STATUS.DEGRADED);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "PROJECT_REGISTRY_F89_RELEASE_PACKET",
      sourceFile: FILE,
      targetFile: F144_MARKET_FILE,
      destinationFile: F144_MARKET_FILE,

      activeFibonacci: FIBONACCI.PROJECT_REGISTRY,
      activeFibonacciRank: 89,
      activeNewsGate: NEWS_GATES.REGISTRY,
      sourceFibonacciGate: FIBONACCI.UE5_EXPRESSION,
      futureFibonacciGate: FIBONACCI.MARKET_READINESS,
      futureFibonacciRank: 144,

      mechanicalCoordinate: clonePlain(MECHANICAL_COORDINATE),
      engineMechanicsPrimary: true,
      mathPrimary: true,
      architectureLabelsSecondary: true,

      registryEngineF89Active: true,
      registryEngineF89Only: true,
      registryClerkActive: true,
      projectRegistryConductorActive: true,

      f55ExpressionReleaseAccepted: state.f55ExpressionReleaseAccepted,
      f55Contract: state.f55Contract,
      f55Receipt: state.f55Receipt,

      sceneGraphObserved: state.sceneGraphObserved,
      sceneGraphStatus: state.sceneGraphStatus,
      sceneNodeCount: state.sceneNodeCount,
      expressionNodeCount: state.expressionNodeCount,
      incomingRegistryRecordNodeCount: state.incomingRegistryRecordNodeCount,
      diagnosticEvidenceNodeCount: state.diagnosticEvidenceNodeCount,

      registryGraphBuilt: state.registryGraphBuilt,
      registryGraphReady: state.registryGraphReady,
      registryGraphStatus: state.registryGraphStatus,
      registryRecordCount: state.registryRecordCount,
      registryReadyRecordCount: state.registryReadyRecordCount,
      registryDegradedRecordCount: state.registryDegradedRecordCount,
      registryBlockedRecordCount: state.registryBlockedRecordCount,
      fileRecordCount: state.fileRecordCount,
      routeRecordCount: state.routeRecordCount,
      contractRecordCount: state.contractRecordCount,
      receiptRecordCount: state.receiptRecordCount,
      productRecordCount: state.productRecordCount,
      expressionRecordCount: state.expressionRecordCount,
      marketInputRecordCount: state.marketInputRecordCount,

      registryQualityScore: state.registryQualityScore,
      registryCoverageScore: state.registryCoverageScore,
      registryTraceScore: state.registryTraceScore,
      registryCoherenceScore: state.registryCoherenceScore,
      marketInputReadinessScore: state.marketInputReadinessScore,

      registryGraph: clonePlain(state.registryGraph),
      registryRecords: clonePlain(state.registryGraph.records),
      marketInputs: clonePlain(state.registryGraph.marketInputs),
      registryIndexes: clonePlain(state.registryGraph.indexes),

      f144MarketReleaseAuthorized: readyForF144,
      f89ReleasePacketReady: readyForF144,
      f89ActivationStatus: state.f89ActivationStatus,
      f89ActivationReason: state.f89ActivationReason,

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

  function composeF89Receipt() {
    return getReceipt();
  }

  function submitF89ReleaseToMarket(extra = {}) {
    const authority = readF144MarketAuthority();

    if (!authority || !isFunction(authority.acceptF89RegistryRelease)) {
      return {
        submitted: false,
        reason: "F144_MARKET_ACCEPT_F89_METHOD_UNAVAILABLE",
        recommendedNextFile: F144_MARKET_FILE,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };
    }

    try {
      const packet = composeF89ReleasePacket(extra);
      const response = authority.acceptF89RegistryRelease(packet);

      recordLocal("F89_RELEASE_SUBMITTED_TO_F144_MARKET", {
        submitted: true,
        accepted: Boolean(response && response.accepted !== false)
      });

      return {
        submitted: true,
        response: clonePlain(response),
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };
    } catch (error) {
      recordError("F89_RELEASE_SUBMISSION_TO_F144_MARKET_FAILED", error);

      return {
        submitted: false,
        reason: "F89_RELEASE_SUBMISSION_TO_F144_MARKET_FAILED",
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };
    }
  }

  function submitF89PacketToNorth(extra = {}) {
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
        reason: "NORTH_RUNTIME_TABLE_UNAVAILABLE"
      };
    }

    const packet = composeF89ReleasePacket(extra);

    try {
      if (isFunction(north.acceptF89RegistryPacket)) {
        return {
          submitted: true,
          response: clonePlain(north.acceptF89RegistryPacket(packet))
        };
      }

      if (isFunction(north.acceptSupportEnginePacket)) {
        return {
          submitted: true,
          response: clonePlain(north.acceptSupportEnginePacket(packet))
        };
      }

      if (isFunction(north.receiveSupportEnginePacket)) {
        return {
          submitted: true,
          response: clonePlain(north.receiveSupportEnginePacket(packet))
        };
      }
    } catch (error) {
      recordError("F89_PACKET_SUBMISSION_TO_NORTH_FAILED", error);
      return {
        submitted: false,
        reason: "F89_PACKET_SUBMISSION_TO_NORTH_FAILED"
      };
    }

    return {
      submitted: false,
      reason: "NORTH_RUNTIME_TABLE_SUPPORT_ENGINE_INTAKE_UNAVAILABLE"
    };
  }

  function validateF144MarketReceipt(packet = {}) {
    const input = isObject(packet) ? packet : {};
    const noForbiddenClaim = !detectForbiddenClaim(input);
    const f144Recognized = Boolean(
      safeBool(input.f144MarketReady, false) ||
      safeBool(input.marketReadinessBuilt, false) ||
      safeBool(input.marketF144ReadinessConductorActive, false) ||
      safeString(input.packetType, "").includes("F144") ||
      safeString(input.activeFibonacci || "", "") === FIBONACCI.MARKET_READINESS ||
      safeString(input.activeFibonacci || "", "") === "F144"
    );

    const ok = Boolean(noForbiddenClaim && f144Recognized);

    let reason = "F144_MARKET_RECEIPT_ACCEPTED";
    if (!noForbiddenClaim) reason = "FORBIDDEN_CLAIM_DETECTED_IN_F144_RECEIPT";
    else if (!f144Recognized) reason = "UNRECOGNIZED_F144_MARKET_RECEIPT";

    return {
      ok,
      reason,
      noForbiddenClaim,
      f144Recognized,
      input: clonePlain(input)
    };
  }

  function acceptF144MarketReceipt(packet = {}) {
    const validation = validateF144MarketReceipt(packet);

    state.f144MarketReceiptAccepted = validation.ok;
    state.f144MarketReceiptPacket = clonePlain(packet);

    if (validation.input.contract) state.f144MarketContract = safeString(validation.input.contract);
    if (validation.input.receipt) state.f144MarketReceipt = safeString(validation.input.receipt);

    recordLocal("F144_MARKET_RECEIPT_RECEIVED_BY_PROJECT_REGISTRY_F89", {
      accepted: validation.ok,
      reason: validation.reason,
      contract: state.f144MarketContract
    });

    publishGlobals();

    return {
      accepted: validation.ok,
      registryF89ReceivedF144: true,
      reason: validation.reason,
      recommendedNextFile: validation.ok ? NORTH_FILE : F144_MARKET_FILE,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function getMechanicalCoordinatePacket() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      mechanicalCoordinate: clonePlain(MECHANICAL_COORDINATE),
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

  function getRegistryGraph() {
    return clonePlain(state.registryGraph);
  }

  function getRegistryGraphSummary() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      registryGraphBuilt: state.registryGraphBuilt,
      registryGraphReady: state.registryGraphReady,
      registryGraphStatus: state.registryGraphStatus,
      registryRecordCount: state.registryRecordCount,
      registryReadyRecordCount: state.registryReadyRecordCount,
      registryDegradedRecordCount: state.registryDegradedRecordCount,
      registryBlockedRecordCount: state.registryBlockedRecordCount,
      fileRecordCount: state.fileRecordCount,
      routeRecordCount: state.routeRecordCount,
      contractRecordCount: state.contractRecordCount,
      receiptRecordCount: state.receiptRecordCount,
      productRecordCount: state.productRecordCount,
      expressionRecordCount: state.expressionRecordCount,
      marketInputRecordCount: state.marketInputRecordCount,
      registryQualityScore: state.registryQualityScore,
      registryCoverageScore: state.registryCoverageScore,
      registryTraceScore: state.registryTraceScore,
      registryCoherenceScore: state.registryCoherenceScore,
      marketInputReadinessScore: state.marketInputReadinessScore,
      updatedAt: nowIso()
    };
  }

  function getRegistryRecords(type = "") {
    const records = state.registryGraph.records || [];
    if (!type) return clonePlain(records);
    return clonePlain(records.filter((record) => record.recordType === type));
  }

  function getMarketInputs() {
    return clonePlain(state.registryGraph.marketInputs || []);
  }

  function getRegistryIndexes() {
    return clonePlain(state.registryGraph.indexes || {});
  }

  function findRegistryRecord(id) {
    const key = makeId(id, "");
    return clonePlain((state.registryGraph.recordsById || {})[key] || null);
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

      registryEngineF89Active: true,
      registryEngineF89Only: true,
      registryClerkActive: true,
      projectRegistryConductorActive: true,

      engineMechanicsPrimary: true,
      mathPrimary: true,
      architectureLabelsSecondary: true,
      mechanicalCoordinateId: MECHANICAL_COORDINATE.coordinateId,
      enginePart: MECHANICAL_COORDINATE.enginePart,
      systemCategory: MECHANICAL_COORDINATE.systemCategory,
      fibonacciStation: MECHANICAL_COORDINATE.fibonacciStage,
      mechanicalRole: MECHANICAL_COORDINATE.mechanicalRole,
      chessRole: MECHANICAL_COORDINATE.chessRole,

      f55ExpressionObserved: state.f55ExpressionObserved,
      f55ExpressionReleaseAccepted: state.f55ExpressionReleaseAccepted,
      f55Contract: state.f55Contract,
      f55Receipt: state.f55Receipt,

      sceneGraphObserved: state.sceneGraphObserved,
      sceneGraphStatus: state.sceneGraphStatus,
      sceneNodeCount: state.sceneNodeCount,
      expressionNodeCount: state.expressionNodeCount,
      incomingRegistryRecordNodeCount: state.incomingRegistryRecordNodeCount,
      diagnosticEvidenceNodeCount: state.diagnosticEvidenceNodeCount,

      registryGraphBuilt: state.registryGraphBuilt,
      registryGraphReady: state.registryGraphReady,
      registryGraphStatus: state.registryGraphStatus,
      registryRecordCount: state.registryRecordCount,
      registryReadyRecordCount: state.registryReadyRecordCount,
      registryDegradedRecordCount: state.registryDegradedRecordCount,
      registryBlockedRecordCount: state.registryBlockedRecordCount,
      fileRecordCount: state.fileRecordCount,
      routeRecordCount: state.routeRecordCount,
      contractRecordCount: state.contractRecordCount,
      receiptRecordCount: state.receiptRecordCount,
      productRecordCount: state.productRecordCount,
      expressionRecordCount: state.expressionRecordCount,
      marketInputRecordCount: state.marketInputRecordCount,

      registryQualityMetricActive: true,
      registryQualityScore: state.registryQualityScore,
      registryCoverageScore: state.registryCoverageScore,
      registryTraceScore: state.registryTraceScore,
      registryCoherenceScore: state.registryCoherenceScore,
      marketInputReadinessScore: state.marketInputReadinessScore,

      f144MarketReleaseAuthorized: state.f144MarketReleaseAuthorized,
      f89ReleasePacketReady: state.f89ReleasePacketReady,
      f89ActivationStatus: state.f89ActivationStatus,
      f89ActivationReason: state.f89ActivationReason,

      f144MarketReceiptAccepted: state.f144MarketReceiptAccepted,
      f144MarketContract: state.f144MarketContract,
      f144MarketReceipt: state.f144MarketReceipt,

      newsProtocolAligned: true,
      fibonacciSynchronizationMetricActive: true,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      activeFibonacci: FIBONACCI.PROJECT_REGISTRY,
      activeFibonacciRank: 89,
      activeNewsGate: NEWS_GATES.REGISTRY,
      sourceFibonacciGate: FIBONACCI.UE5_EXPRESSION,
      futureFibonacciGate: FIBONACCI.MARKET_READINESS,
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

      projectRegistryF89Receipt: true,
      registryClerkReceipt: true,

      registryEngineOwns: [
        "F89 project registry manifold",
        "F55 expression release consumption",
        "deterministic project registry records",
        "file / route / contract / receipt indexes",
        "market-input record preparation",
        "F144 market-readiness handoff packet"
      ],
      registryEngineDoesNotOwn: [
        "F34 Product Engine authority",
        "F55 Expression authority",
        "F144 Market authority",
        "F233 downstream return",
        "North F21 latch",
        "Canvas F13 evidence",
        "actual rendering",
        "route orchestration",
        "planet truth",
        "material truth",
        "elevation truth",
        "hydrology truth",
        "generated image",
        "GraphicBox",
        "WebGL",
        "public superiority claim",
        "final visual pass claim"
      ],

      gates: {
        north: NORTH_FILE,
        productEngine: F34_PRODUCT_ENGINE_FILE,
        ue5Expression: F55_EXPRESSION_FILE,
        registry: FILE,
        market: F144_MARKET_FILE,
        canvas: CANVAS_FILE
      },

      registryRecordTypes: clonePlain(REGISTRY_RECORD_TYPES),
      fibonacciMap: clonePlain(FIBONACCI),
      newsGates: clonePlain(NEWS_GATES),
      mechanicalCoordinate: clonePlain(MECHANICAL_COORDINATE),
      mechanicalCoordinatePacket: getMechanicalCoordinatePacket(),

      f55ExpressionReleasePacket: clonePlain(state.f55ExpressionReleasePacket),
      registryGraph: clonePlain(state.registryGraph),
      registryGraphSummary: getRegistryGraphSummary(),
      registryRecords: getRegistryRecords(),
      marketInputs: getMarketInputs(),
      registryIndexes: getRegistryIndexes(),

      registryQuality: computeRegistryQualityMetric(),
      newsAlignment: evaluateNewsAlignment(),
      f89ReleasePacket: composeF89ReleasePacket(),
      f144MarketReceiptPacket: clonePlain(state.f144MarketReceiptPacket),

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

    const records = (r.registryRecords || []).map((record) => (
      `- ${record.id} :: type=${record.recordType} :: product=${record.sourceProductId} :: status=${record.status} :: score=${record.readinessScore} :: file=${record.file || ""} :: route=${record.route || ""}`
    )).join("\n") || "- none";

    const marketInputs = (r.marketInputs || []).map((record) => (
      `- ${record.id} :: product=${record.sourceProductId} :: status=${record.status} :: score=${record.readinessScore} :: traceReady=${record.traceReady} :: registryReady=${record.registryReady}`
    )).join("\n") || "- none";

    const events = (r.localEvents || []).slice(-48).map((item) => (
      `- ${item.at} :: ${item.event} :: ${JSON.stringify(item.detail || {})}`
    )).join("\n") || "- none";

    const errors = (r.errors || []).map((item) => (
      `- ${item.at} :: ${item.code} :: ${item.message}`
    )).join("\n") || "- none";

    return [
      "LAB_PRODUCT_ENGINE_REGISTRY_F89_ENGINE_MECHANICS_PROJECT_REGISTRY_CONDUCTOR_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      "",
      `registryEngineF89Active=${r.registryEngineF89Active}`,
      `registryEngineF89Only=${r.registryEngineF89Only}`,
      `registryClerkActive=${r.registryClerkActive}`,
      `projectRegistryConductorActive=${r.projectRegistryConductorActive}`,
      "",
      `engineMechanicsPrimary=${r.engineMechanicsPrimary}`,
      `mathPrimary=${r.mathPrimary}`,
      `architectureLabelsSecondary=${r.architectureLabelsSecondary}`,
      `mechanicalCoordinateId=${r.mechanicalCoordinateId}`,
      `enginePart=${r.enginePart}`,
      `systemCategory=${r.systemCategory}`,
      `fibonacciStation=${r.fibonacciStation}`,
      `mechanicalRole=${r.mechanicalRole}`,
      `chessRole=${r.chessRole}`,
      "",
      `f55ExpressionObserved=${r.f55ExpressionObserved}`,
      `f55ExpressionReleaseAccepted=${r.f55ExpressionReleaseAccepted}`,
      `f55Contract=${r.f55Contract}`,
      `f55Receipt=${r.f55Receipt}`,
      "",
      `sceneGraphObserved=${r.sceneGraphObserved}`,
      `sceneGraphStatus=${r.sceneGraphStatus}`,
      `sceneNodeCount=${r.sceneNodeCount}`,
      `expressionNodeCount=${r.expressionNodeCount}`,
      `incomingRegistryRecordNodeCount=${r.incomingRegistryRecordNodeCount}`,
      `diagnosticEvidenceNodeCount=${r.diagnosticEvidenceNodeCount}`,
      "",
      `registryGraphBuilt=${r.registryGraphBuilt}`,
      `registryGraphReady=${r.registryGraphReady}`,
      `registryGraphStatus=${r.registryGraphStatus}`,
      `registryRecordCount=${r.registryRecordCount}`,
      `registryReadyRecordCount=${r.registryReadyRecordCount}`,
      `registryDegradedRecordCount=${r.registryDegradedRecordCount}`,
      `registryBlockedRecordCount=${r.registryBlockedRecordCount}`,
      `fileRecordCount=${r.fileRecordCount}`,
      `routeRecordCount=${r.routeRecordCount}`,
      `contractRecordCount=${r.contractRecordCount}`,
      `receiptRecordCount=${r.receiptRecordCount}`,
      `productRecordCount=${r.productRecordCount}`,
      `expressionRecordCount=${r.expressionRecordCount}`,
      `marketInputRecordCount=${r.marketInputRecordCount}`,
      "",
      `registryQualityScore=${r.registryQualityScore}`,
      `registryCoverageScore=${r.registryCoverageScore}`,
      `registryTraceScore=${r.registryTraceScore}`,
      `registryCoherenceScore=${r.registryCoherenceScore}`,
      `marketInputReadinessScore=${r.marketInputReadinessScore}`,
      "",
      `f144MarketReleaseAuthorized=${r.f144MarketReleaseAuthorized}`,
      `f89ReleasePacketReady=${r.f89ReleasePacketReady}`,
      `f89ActivationStatus=${r.f89ActivationStatus}`,
      `f89ActivationReason=${r.f89ActivationReason}`,
      "",
      `f144MarketReceiptAccepted=${r.f144MarketReceiptAccepted}`,
      `f144MarketContract=${r.f144MarketContract}`,
      `f144MarketReceipt=${r.f144MarketReceipt}`,
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
      "REGISTRY_RECORDS",
      records,
      "",
      "MARKET_INPUTS",
      marketInputs,
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
    setDataset("labProductEngineRegistryLoaded", "true");
    setDataset("labProductEngineRegistryContract", CONTRACT);
    setDataset("labProductEngineRegistryReceipt", RECEIPT);
    setDataset("labProductEngineRegistryVersion", VERSION);
    setDataset("labProductEngineRegistryFile", FILE);

    setDataset("registryF89Active", "true");
    setDataset("registryF89Only", "true");
    setDataset("registryClerkActive", "true");
    setDataset("projectRegistryConductorActive", "true");

    setDataset("registryEngineMechanicsPrimary", "true");
    setDataset("registryMathPrimary", "true");
    setDataset("registryArchitectureLabelsSecondary", "true");
    setDataset("registryMechanicalCoordinateId", MECHANICAL_COORDINATE.coordinateId);
    setDataset("registryEnginePart", MECHANICAL_COORDINATE.enginePart);
    setDataset("registrySystemCategory", MECHANICAL_COORDINATE.systemCategory);
    setDataset("registryFibonacciStation", MECHANICAL_COORDINATE.fibonacciStage);
    setDataset("registryMechanicalRole", MECHANICAL_COORDINATE.mechanicalRole);
    setDataset("registryChessRole", MECHANICAL_COORDINATE.chessRole);

    setDataset("registryF55ExpressionObserved", state.f55ExpressionObserved);
    setDataset("registryF55ExpressionReleaseAccepted", state.f55ExpressionReleaseAccepted);
    setDataset("registrySceneGraphObserved", state.sceneGraphObserved);
    setDataset("registrySceneGraphStatus", state.sceneGraphStatus);

    setDataset("registryGraphBuilt", state.registryGraphBuilt);
    setDataset("registryGraphReady", state.registryGraphReady);
    setDataset("registryGraphStatus", state.registryGraphStatus);
    setDataset("registryRecordCount", state.registryRecordCount);
    setDataset("registryReadyRecordCount", state.registryReadyRecordCount);
    setDataset("registryDegradedRecordCount", state.registryDegradedRecordCount);
    setDataset("registryBlockedRecordCount", state.registryBlockedRecordCount);
    setDataset("registryFileRecordCount", state.fileRecordCount);
    setDataset("registryRouteRecordCount", state.routeRecordCount);
    setDataset("registryContractRecordCount", state.contractRecordCount);
    setDataset("registryReceiptRecordCount", state.receiptRecordCount);
    setDataset("registryMarketInputRecordCount", state.marketInputRecordCount);

    setDataset("registryQualityScore", state.registryQualityScore);
    setDataset("registryCoverageScore", state.registryCoverageScore);
    setDataset("registryTraceScore", state.registryTraceScore);
    setDataset("registryCoherenceScore", state.registryCoherenceScore);
    setDataset("registryMarketInputReadinessScore", state.marketInputReadinessScore);

    setDataset("registryF144MarketReleaseAuthorized", state.f144MarketReleaseAuthorized);
    setDataset("registryF89ReleasePacketReady", state.f89ReleasePacketReady);
    setDataset("registryF89ActivationStatus", state.f89ActivationStatus);
    setDataset("registryF89ActivationReason", state.f89ActivationReason);

    setDataset("registryNewsProtocolAligned", "true");
    setDataset("registryFibonacciSynchronizationMetricActive", "true");
    setDataset("registryFibonacciSynchronizationScore", state.fibonacciSynchronizationScore);
    setDataset("registryActiveFibonacci", FIBONACCI.PROJECT_REGISTRY);
    setDataset("registryActiveFibonacciRank", "89");
    setDataset("registryActiveNewsGate", NEWS_GATES.REGISTRY);
    setDataset("registrySourceFibonacciGate", FIBONACCI.UE5_EXPRESSION);
    setDataset("registryFutureFibonacciGate", FIBONACCI.MARKET_READINESS);

    setDataset("registryFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("registryRecommendedNextFile", state.recommendedNextFile);
    setDataset("registryRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);

    setDataset("registryPublicSuperiorityClaim", "false");
    setDataset("registryPublicComparisonClaimAllowed", "false");
    setDataset("registryBenchmarkRequiredBeforePublicClaim", "true");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function publishGlobals() {
    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.HEARTH = root.HEARTH || {};

    root.LAB_PRODUCT_ENGINE_REGISTRY = api;
    root.LAB_PRODUCT_ENGINE_REGISTRY_F89 = api;
    root.PRODUCT_ENGINE_REGISTRY = api;
    root.PROJECT_REGISTRY_CONDUCTOR = api;
    root.PROJECT_REGISTRY_F89_CONDUCTOR = api;
    root.REGISTRY_CLERK = api;

    root.DEXTER_LAB.productEngineRegistry = api;
    root.DEXTER_LAB.productEngineRegistryF89 = api;
    root.DEXTER_LAB.projectRegistryConductor = api;
    root.DEXTER_LAB.registryClerk = api;

    root.HEARTH.productEngineRegistry = api;
    root.HEARTH.productEngineRegistryF89 = api;
    root.HEARTH.projectRegistryConductor = api;
    root.HEARTH.registryClerk = api;

    const light = getReceiptLight();

    root.LAB_PRODUCT_ENGINE_REGISTRY_RECEIPT = light;
    root.LAB_PRODUCT_ENGINE_REGISTRY_F89_RECEIPT = light;
    root.PRODUCT_ENGINE_REGISTRY_RECEIPT = light;
    root.PROJECT_REGISTRY_CONDUCTOR_RECEIPT = light;
    root.REGISTRY_CLERK_RECEIPT = light;

    root.DEXTER_LAB.productEngineRegistryReceipt = light;
    root.HEARTH.productEngineRegistryReceipt = light;

    root.__LAB_PRODUCT_ENGINE_REGISTRY_LOADED__ = true;
    root.__LAB_PRODUCT_ENGINE_REGISTRY_CONTRACT__ = CONTRACT;
    root.__LAB_PRODUCT_ENGINE_REGISTRY_RECEIPT__ = RECEIPT;
    root.__LAB_PRODUCT_ENGINE_REGISTRY_F89_ONLY__ = true;
    root.__LAB_PRODUCT_ENGINE_REGISTRY_MECHANICAL_COORDINATE__ = MECHANICAL_COORDINATE.coordinateId;
    root.__LAB_PRODUCT_ENGINE_REGISTRY_PUBLIC_SUPERIORITY_CLAIM__ = false;
    root.__LAB_PRODUCT_ENGINE_REGISTRY_WEBGL__ = false;
    root.__LAB_PRODUCT_ENGINE_REGISTRY_VISUAL_PASS_CLAIMED__ = false;

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
    REGISTRY_RECORD_TYPES,
    MECHANICAL_COORDINATE,

    readF55ExpressionAuthority,
    readF55ExpressionRelease,
    validateF55ExpressionRelease,
    acceptF55ExpressionRelease,
    receiveF55ExpressionRelease,
    submitF55ExpressionRelease,

    getF55SourceProducts,
    getF55ExpressionRecords,
    getF55RegistryRecords,
    normalizeRegistryRecord,
    createProductRecord,
    createExpressionRecordRecord,
    createFileRecord,
    createRouteRecord,
    createContractRecord,
    createReceiptRecord,
    createMarketInputRecord,
    buildRegistryGraph,

    computeRegistryQualityMetric,
    computeFibonacciSynchronizationMetric,
    evaluateNewsAlignment,

    readF144MarketAuthority,
    composeF89ReleasePacket,
    composeF89Receipt,
    submitF89ReleaseToMarket,
    submitF89PacketToNorth,

    validateF144MarketReceipt,
    acceptF144MarketReceipt,

    getMechanicalCoordinatePacket,
    getRegistryGraph,
    getRegistryGraphSummary,
    getRegistryRecords,
    getMarketInputs,
    getRegistryIndexes,
    findRegistryRecord,

    getReceiptLight,
    getReceipt,
    getReceiptText,
    publishGlobals,
    updateDataset,

    registryEngineF89Active: true,
    registryEngineF89Only: true,
    registryClerkActive: true,
    projectRegistryConductorActive: true,

    engineMechanicsPrimary: true,
    mathPrimary: true,
    architectureLabelsSecondary: true,

    ownsF89ProjectRegistryManifold: true,
    ownsF55ExpressionReleaseConsumption: true,
    ownsDeterministicProjectRegistryRecords: true,
    ownsFileRouteContractReceiptIndexes: true,
    ownsMarketInputRecordPreparation: true,
    ownsF144MarketReadinessHandoffPacket: true,

    ownsF34ProductEngineAuthority: false,
    ownsF55ExpressionAuthority: false,
    ownsF144MarketAuthority: false,
    ownsF233DownstreamReturn: false,
    ownsNorthF21Latch: false,
    ownsCanvasF13Evidence: false,
    ownsActualRendering: false,
    ownsRouteOrchestration: false,
    ownsPlanetTruth: false,
    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
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
    const f55Release = readF55ExpressionRelease();
    if (hasMeaningfulF55Release(f55Release)) {
      acceptF55ExpressionRelease(f55Release);
    }
  } catch (error) {
    recordError("INITIAL_F55_EXPRESSION_RELEASE_READ_FAILED", error);
  }

  try {
    computeFibonacciSynchronizationMetric();
  } catch (error) {
    recordError("INITIAL_F89_SYNC_METRIC_FAILED", error);
  }

  recordLocal("PROJECT_REGISTRY_F89_ENGINE_MECHANICS_CONDUCTOR_LOADED", {
    file: FILE,
    contract: CONTRACT,
    mechanicalCoordinate: MECHANICAL_COORDINATE.coordinateId,
    targetFile: F144_MARKET_FILE,
    publicSuperiorityClaim: false
  });

  publishGlobals();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

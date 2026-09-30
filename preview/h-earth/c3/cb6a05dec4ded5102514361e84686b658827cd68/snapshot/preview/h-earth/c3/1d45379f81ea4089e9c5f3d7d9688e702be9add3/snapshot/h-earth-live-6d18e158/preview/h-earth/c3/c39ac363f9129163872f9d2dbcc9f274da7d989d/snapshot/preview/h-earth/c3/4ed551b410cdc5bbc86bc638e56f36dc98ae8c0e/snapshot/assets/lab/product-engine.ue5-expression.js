// /assets/lab/product-engine.ue5-expression.js
// Rebuild target: F55 UE5 Expression replacement shell.
// Purpose: consume F34 release, build deterministic expression/scene records, hand off to F89.
// Scope: support-shell family only; no rendering, no WebGL, no public-superiority claim.

(() => {
  "use strict";

  const FILE = "/assets/lab/product-engine.ue5-expression.js";
  const CONTRACT = "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_REPLACEMENT_SHELL_v3";
  const RECEIPT = "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_REPLACEMENT_SHELL_RECEIPT_v3";
  const VERSION = "2026-06-22.f55-replacement-shell.v3";

  const F34_FILE = "/assets/lab/product-engine.js";
  const F89_FILE = "/assets/lab/product-engine.registry.js";
  const F144_FILE = "/assets/lab/product-engine.market.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const FIBONACCI = Object.freeze({
    PRODUCT_ENGINE: "F34",
    UE5_EXPRESSION: "F55",
    PROJECT_REGISTRY: "F89",
    MARKET_READINESS: "F144",
    DOWNSTREAM_RETURN: "F233",
    NORTH_LATCH: "F21"
  });

  const STATUS = Object.freeze({
    HELD: "HELD",
    ACTIVE: "ACTIVE",
    READY: "READY",
    DEGRADED: "DEGRADED",
    REJECTED: "REJECTED"
  });

  const NODE_TYPES = Object.freeze({
    PRODUCT: "PRODUCT_NODE",
    SCENE: "SCENE_NODE",
    EXPRESSION: "EXPRESSION_NODE",
    REGISTRY: "REGISTRY_RECORD_NODE",
    EVIDENCE: "DIAGNOSTIC_EVIDENCE_NODE"
  });

  const MECHANICAL_COORDINATE = Object.freeze({
    coordinateId: "RT3D-X10_Y19_Z55",
    enginePart: "GEARBOX",
    enginePartIndex: 10,
    systemCategory: "NINETEEN_PART_SYSTEM",
    systemCategoryIndex: 19,
    fibonacciStage: FIBONACCI.UE5_EXPRESSION,
    fibonacciRank: 55,
    fibonacciStation: "EXPRESSION_CLERK",
    mechanicalRole: "EXPRESSION_SCENE_GRAPH_MANIFOLD",
    clerkRole: "EXPRESSION_CLERK",
    mayJudge: false,
    mayLatch: false,
    mayRender: false,
    mayClaimPublicSuperiority: false
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,

    familyScope: "RUNTIME_REGISTRY_ROUTING_AND_EXPRESSION_PRECEDENT_REPLACEMENT_SHELL_FAMILY",
    thisFamilyIsEntireDiagnosticEngine: false,
    thisFamilyIsAllOfEngine1: false,
    replacesEngines2Through4: false,

    expressionEngineF55Active: true,
    expressionEngineF55Only: true,
    expressionClerkActive: true,
    sceneGraphConductorActive: true,

    foundationContractRequired: "DIAGNOSTIC_RUNTIME_SHELL_FOUNDATION_v1",
    baselineRuntimeFile: NORTH_FILE,

    mechanicalCoordinate: MECHANICAL_COORDINATE,
    engineMechanicsPrimary: true,
    mathPrimary: true,
    architectureLabelsSecondary: true,

    f34Observed: false,
    f34Accepted: false,
    f34Packet: null,
    f34Contract: "",
    f34Receipt: "",

    sceneGraphBuilt: false,
    sceneGraphReady: false,
    sceneGraphStatus: STATUS.HELD,
    sceneNodeCount: 0,
    expressionNodeCount: 0,
    registryRecordNodeCount: 0,
    diagnosticEvidenceNodeCount: 0,

    expressionQualityScore: 0,
    expressionCoverageScore: 0,
    expressionTraceScore: 0,
    expressionCoherenceScore: 0,

    f89ReleaseAuthorized: false,
    f55ReleasePacketReady: false,
    f55ActivationStatus: STATUS.ACTIVE,
    f55ActivationReason: "F55_ACTIVE_WAITING_F34_RELEASE",

    activeFibonacci: FIBONACCI.UE5_EXPRESSION,
    activeFibonacciRank: 55,
    sourceFibonacciGate: FIBONACCI.PRODUCT_ENGINE,
    futureFibonacciGate: FIBONACCI.PROJECT_REGISTRY,
    fibonacciSynchronizationScore: 0,
    oneActiveGearAtATime: true,

    sceneGraph: {
      nodes: {},
      edges: [],
      products: [],
      expressionRecords: [],
      registryRecords: [],
      buildId: "",
      builtAt: ""
    },

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
    try { return new Date().toISOString(); } catch (_) { return ""; }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function clone(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;
    try { return JSON.parse(JSON.stringify(value)); }
    catch (_) { return Array.isArray(value) ? value.slice() : { ...value }; }
  }

  function safeString(value, fallback = "") {
    return value === undefined || value === null ? fallback : String(value);
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

  function makeId(value, fallback = "node") {
    return safeString(value || fallback, fallback)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || fallback;
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

  function setPath(path, value) {
    const parts = safeString(path).split(".").filter(Boolean);
    if (!parts.length) return false;
    let cursor = root;
    for (let i = 0; i < parts.length - 1; i += 1) {
      if (!cursor[parts[i]] || typeof cursor[parts[i]] !== "object") cursor[parts[i]] = {};
      cursor = cursor[parts[i]];
    }
    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function firstGlobal(paths) {
    for (const path of paths || []) {
      const found = readPath(path);
      if (found) return found;
    }
    return null;
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return {};
    try {
      if (isFunction(authority.getReceiptLight)) return authority.getReceiptLight() || {};
      if (isFunction(authority.getReceipt)) return authority.getReceipt() || {};
    } catch (error) {
      return { error: safeString(error && error.message ? error.message : error) };
    }
    return authority.receiptPacket || authority.receipt || authority;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function recordLocal(event, detail = {}) {
    const item = { at: nowIso(), event: safeString(event, "LOCAL_EVENT"), detail: clone(detail) };
    state.localEvents.push(item);
    if (state.localEvents.length > 180) state.localEvents.shift();
    state.updatedAt = item.at;
    updateDataset();
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "F55_ERROR"),
      message: safeString(error && error.message ? error.message : error),
      detail: clone(detail)
    };
    state.errors.push(item);
    if (state.errors.length > 120) state.errors.shift();
    state.updatedAt = item.at;
    updateDataset();
    return item;
  }

  function detectForbiddenClaim(packet = {}) {
    const text = (() => {
      try { return JSON.stringify(packet || {}); } catch (_) { return String(packet || ""); }
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
      text.includes('"publicSuperiorityClaim":true')
    );
  }

  function readF34Authority() {
    return firstGlobal([
      "LAB_PRODUCT_ENGINE",
      "LAB_PRODUCT_ENGINE_F34",
      "PRODUCT_ENGINE",
      "PRODUCT_ENGINE_F34",
      "DEXTER_LAB.productEngine",
      "DEXTER_LAB.productEngineF34",
      "HEARTH.productEngine",
      "HEARTH.productEngineF34"
    ]);
  }

  function readF34Release() {
    const authority = readF34Authority();
    if (!authority) return {};
    try {
      if (isFunction(authority.composeF34ReleasePacket)) return authority.composeF34ReleasePacket() || {};
      const receipt = readReceipt(authority);
      return receipt.f34ReleasePacket || receipt;
    } catch (error) {
      recordError("F34_RELEASE_READ_FAILED", error);
      return {};
    }
  }

  function hasMeaningfulF34Release(packet = {}) {
    return Boolean(
      isObject(packet) &&
      (
        packet.contract ||
        packet.receipt ||
        packet.packetType === "PRODUCT_ENGINE_F34_RELEASE_PACKET" ||
        safeBool(packet.productEngineF34Active, false) ||
        safeBool(packet.f34ReleasePacketReady, false) ||
        safeBool(packet.productGraphBuilt, false) ||
        Array.isArray(packet.products) ||
        (isObject(packet.productGraph) && Array.isArray(packet.productGraph.products))
      )
    );
  }

  function validateF34Release(packet = {}) {
    const active = safeString(packet.activeFibonacci || packet.fibonacciStage || "");
    const future = safeString(packet.futureFibonacciGate || "");
    const productSource = Array.isArray(packet.products) ||
      (isObject(packet.productGraph) && Array.isArray(packet.productGraph.products));

    const accepted = Boolean(
      hasMeaningfulF34Release(packet) &&
      !detectForbiddenClaim(packet) &&
      (!active || active === FIBONACCI.PRODUCT_ENGINE || active === "F34") &&
      (!future || future === FIBONACCI.UE5_EXPRESSION || future === "F55") &&
      productSource
    );

    return {
      accepted,
      reason: accepted ? "F34_RELEASE_ACCEPTED" : "F34_RELEASE_REJECTED_OR_INCOMPLETE",
      productSource,
      forbiddenClaimDetected: detectForbiddenClaim(packet),
      input: clone(packet)
    };
  }

  function normalizeProduct(product = {}, index = 0) {
    const id = makeId(product.id || product.productId || product.name || `product-${index + 1}`);
    return {
      id,
      productId: safeString(product.productId || id),
      type: safeString(product.type || product.productType || "product-framework"),
      name: safeString(product.name || product.label || id),
      label: safeString(product.label || product.name || id),
      file: safeString(product.file || product.sourceFile || ""),
      route: safeString(product.route || ""),
      contract: safeString(product.contract || product.sourceContract || ""),
      receipt: safeString(product.receipt || product.sourceReceipt || ""),
      readinessScore: clamp(product.readinessScore ?? product.productQualityScore ?? 0, 0, 100),
      status: safeString(product.status || STATUS.DEGRADED),
      tags: Array.isArray(product.tags) ? product.tags.slice() : [],
      receiptReady: safeBool(product.receiptReady, Boolean(product.contract || product.receipt)),
      engineeringReady: safeBool(product.engineeringReady, false),
      productReady: safeBool(product.productReady, false),
      evidenceReady: safeBool(product.evidenceReady, false),
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      publicSuperiorityClaim: false
    };
  }

  function getF34Products(packet = state.f34Packet || {}) {
    if (Array.isArray(packet.products)) return packet.products.map(normalizeProduct);
    if (isObject(packet.productGraph) && Array.isArray(packet.productGraph.products)) {
      return packet.productGraph.products.map(normalizeProduct);
    }
    return [];
  }

  function expressionClass(product) {
    const text = `${product.type} ${product.name} ${(product.tags || []).join(" ")}`.toLowerCase();
    if (/runtime|engine/.test(text)) return "RUNTIME_ENGINE_EXPRESSION";
    if (/support|f34|f55|f89|f144/.test(text)) return "SUPPORT_ENGINE_EXPRESSION";
    if (/canvas|visual|surface|chapel/.test(text)) return "CANVAS_SURFACE_EXPRESSION";
    if (/diagnostic|receipt|evidence/.test(text)) return "DIAGNOSTIC_EVIDENCE_EXPRESSION";
    if (/market|license|demo|package/.test(text)) return "MARKET_PACKAGE_EXPRESSION";
    return "PRODUCT_FRAMEWORK_EXPRESSION";
  }

  function expressionMode(product) {
    const cls = expressionClass(product);
    if (cls === "RUNTIME_ENGINE_EXPRESSION") return "MECHANICAL_COORDINATE_PRESENTATION";
    if (cls === "SUPPORT_ENGINE_EXPRESSION") return "SUPPORT_HANDOFF_PRESENTATION";
    if (cls === "CANVAS_SURFACE_EXPRESSION") return "VISIBLE_CARRIER_PRESENTATION";
    if (cls === "DIAGNOSTIC_EVIDENCE_EXPRESSION") return "RECEIPT_EVIDENCE_PRESENTATION";
    if (cls === "MARKET_PACKAGE_EXPRESSION") return "READINESS_PACKAGE_PRESENTATION";
    return "PRODUCT_GRAPH_PRESENTATION";
  }

  function expressionScore(product) {
    return clamp(
      Math.round(
        product.readinessScore * 0.42 +
        (product.receiptReady ? 18 : 0) +
        (product.file || product.route ? 14 : 0) +
        (product.engineeringReady ? 12 : 0) +
        (product.productReady ? 8 : 0) +
        (product.evidenceReady ? 6 : 0)
      ),
      0,
      100
    );
  }

  function buildSceneGraph(packet = state.f34Packet || {}, options = {}) {
    const products = getF34Products(packet);
    const nodes = {};
    const edges = [];
    const expressionRecords = [];
    const registryRecords = [];

    products.forEach((product, index) => {
      const productNode = {
        id: makeId(`product-${product.id}`),
        nodeType: NODE_TYPES.PRODUCT,
        sourceProductId: product.id,
        label: product.label,
        file: product.file,
        route: product.route,
        readinessScore: product.readinessScore,
        deterministic: true
      };

      const sceneNode = {
        id: makeId(`scene-${product.id}`),
        nodeType: NODE_TYPES.SCENE,
        sourceProductId: product.id,
        expressionClass: expressionClass(product),
        transform: { position: [index, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        requiresUnrealRuntime: false,
        rendersNow: false,
        deterministic: true,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };

      const expressionNode = {
        id: makeId(`expression-${product.id}`),
        nodeType: NODE_TYPES.EXPRESSION,
        sourceProductId: product.id,
        sceneNodeId: sceneNode.id,
        expressionMode: expressionMode(product),
        expressionReadinessScore: expressionScore(product),
        registryReady: Boolean(product.receiptReady && expressionScore(product) >= 62),
        ownsRendering: false,
        rendersNow: false,
        deterministic: true,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false,
        publicSuperiorityClaim: false
      };

      const registryNode = {
        id: makeId(`registry-record-${product.id}`),
        nodeType: NODE_TYPES.REGISTRY,
        sourceProductId: product.id,
        sceneNodeId: sceneNode.id,
        expressionNodeId: expressionNode.id,
        recordType: "F55_EXPRESSION_REGISTRY_RECORD",
        file: product.file,
        route: product.route,
        contract: product.contract,
        receipt: product.receipt,
        traceReady: Boolean(product.file || product.route || product.contract || product.receipt),
        registryReady: expressionNode.registryReady,
        deterministic: true
      };

      nodes[productNode.id] = productNode;
      nodes[sceneNode.id] = sceneNode;
      nodes[expressionNode.id] = expressionNode;
      nodes[registryNode.id] = registryNode;

      edges.push({ from: productNode.id, to: sceneNode.id, type: "PRODUCT_TO_SCENE", deterministic: true });
      edges.push({ from: sceneNode.id, to: expressionNode.id, type: "SCENE_TO_EXPRESSION", deterministic: true });
      edges.push({ from: expressionNode.id, to: registryNode.id, type: "EXPRESSION_TO_REGISTRY_RECORD", deterministic: true });

      expressionRecords.push({
        expressionRecordId: expressionNode.id,
        sourceProductId: product.id,
        sceneNodeId: sceneNode.id,
        expressionMode: expressionNode.expressionMode,
        expressionClass: sceneNode.expressionClass,
        expressionReadinessScore: expressionNode.expressionReadinessScore,
        registryReady: expressionNode.registryReady,
        deterministic: true,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      });

      registryRecords.push({
        registryRecordId: registryNode.id,
        sourceProductId: product.id,
        file: product.file,
        route: product.route,
        contract: product.contract,
        receipt: product.receipt,
        traceReady: registryNode.traceReady,
        registryReady: registryNode.registryReady,
        deterministic: true
      });
    });

    state.sceneGraph = {
      nodes,
      edges,
      products,
      expressionRecords,
      registryRecords,
      buildId: `f55-scene-graph-${Object.keys(nodes).length}-${edges.length}`,
      builtAt: nowIso()
    };

    state.sceneGraphBuilt = true;
    state.sceneNodeCount = Object.values(nodes).filter((node) => node.nodeType === NODE_TYPES.SCENE).length;
    state.expressionNodeCount = expressionRecords.length;
    state.registryRecordNodeCount = registryRecords.length;
    state.diagnosticEvidenceNodeCount = products.filter((product) => /diagnostic|evidence/.test(product.type)).length;

    computeExpressionQuality();

    state.sceneGraphReady = Boolean(
      products.length > 0 &&
      state.expressionQualityScore >= 80 &&
      registryRecords.some((record) => record.registryReady)
    );

    if (state.sceneGraphReady) {
      state.sceneGraphStatus = STATUS.READY;
      state.f89ReleaseAuthorized = true;
      state.f55ReleasePacketReady = true;
      state.f55ActivationStatus = STATUS.READY;
      state.f55ActivationReason = "F55_SCENE_GRAPH_READY_FOR_F89";
    } else if (products.length > 0 && state.expressionQualityScore >= 62) {
      state.sceneGraphStatus = STATUS.DEGRADED;
      state.f89ReleaseAuthorized = true;
      state.f55ReleasePacketReady = true;
      state.f55ActivationStatus = STATUS.DEGRADED;
      state.f55ActivationReason = "F55_SCENE_GRAPH_DEGRADED_F89_RELEASE_AVAILABLE";
    } else {
      state.sceneGraphStatus = STATUS.HELD;
      state.f89ReleaseAuthorized = false;
      state.f55ReleasePacketReady = false;
      state.f55ActivationStatus = STATUS.HELD;
      state.f55ActivationReason = "WAITING_F34_PRODUCT_GRAPH_OR_EXPRESSION_QUALITY";
    }

    computeFibonacciSynchronization();

    if (options.silent !== true) {
      recordLocal("F55_SCENE_GRAPH_BUILT", {
        products: products.length,
        sceneNodes: state.sceneNodeCount,
        expressionNodes: state.expressionNodeCount,
        registryRecords: state.registryRecordNodeCount,
        status: state.sceneGraphStatus,
        quality: state.expressionQualityScore
      });
    }

    updateDataset();
    return clone(state.sceneGraph);
  }

  function computeExpressionQuality() {
    const products = state.sceneGraph.products || [];
    const expressionRecords = state.sceneGraph.expressionRecords || [];
    const registryRecords = state.sceneGraph.registryRecords || [];
    const denom = Math.max(1, products.length);

    const avg = expressionRecords.length
      ? expressionRecords.reduce((sum, record) => sum + safeNumber(record.expressionReadinessScore, 0), 0) / expressionRecords.length
      : 0;

    state.expressionCoverageScore = clamp(Math.round((expressionRecords.length / denom) * 100), 0, 100);
    state.expressionTraceScore = clamp(Math.round((registryRecords.filter((r) => r.traceReady).length / denom) * 100), 0, 100);
    state.expressionCoherenceScore = clamp(
      Math.round(avg * 0.52 + state.expressionCoverageScore * 0.22 + state.expressionTraceScore * 0.18 + (registryRecords.some((r) => r.registryReady) ? 8 : 0)),
      0,
      100
    );
    state.expressionQualityScore = clamp(
      Math.round(state.expressionCoherenceScore * 0.44 + state.expressionCoverageScore * 0.28 + state.expressionTraceScore * 0.28),
      0,
      100
    );

    return {
      expressionQualityScore: state.expressionQualityScore,
      expressionCoverageScore: state.expressionCoverageScore,
      expressionTraceScore: state.expressionTraceScore,
      expressionCoherenceScore: state.expressionCoherenceScore,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function computeFibonacciSynchronization() {
    const checks = [
      state.oneActiveGearAtATime,
      state.activeFibonacci === FIBONACCI.UE5_EXPRESSION,
      state.activeFibonacciRank === 55,
      state.sourceFibonacciGate === FIBONACCI.PRODUCT_ENGINE,
      state.futureFibonacciGate === FIBONACCI.PROJECT_REGISTRY,
      state.expressionEngineF55Active,
      state.expressionClerkActive,
      state.sceneGraphConductorActive,
      state.engineMechanicsPrimary,
      state.mathPrimary,
      state.mechanicalCoordinate.coordinateId === "RT3D-X10_Y19_Z55",
      state.f34Accepted || state.f34Observed,
      state.sceneGraphBuilt,
      !state.thisFamilyIsEntireDiagnosticEngine,
      !state.thisFamilyIsAllOfEngine1,
      !state.replacesEngines2Through4,
      !state.publicSuperiorityClaim,
      !state.publicComparisonClaimAllowed,
      !state.generatedImage,
      !state.graphicBox,
      !state.webGL,
      !state.visualPassClaimed
    ];

    state.fibonacciSynchronizationScore = Math.round((checks.filter(Boolean).length / checks.length) * 100);
    state.updatedAt = nowIso();
    return { score: state.fibonacciSynchronizationScore, passed: checks.filter(Boolean).length, total: checks.length };
  }

  function acceptF34Release(packet = {}) {
    const validation = validateF34Release(packet);

    if (validation.accepted) {
      state.f34Observed = true;
      state.f34Accepted = true;
      state.f34Packet = clone(packet);
      state.f34Contract = safeString(packet.contract);
      state.f34Receipt = safeString(packet.receipt);
      buildSceneGraph(packet, { silent: true });
    }

    recordLocal("F34_RELEASE_EVALUATED_BY_F55", {
      accepted: validation.accepted,
      reason: validation.reason
    });

    computeFibonacciSynchronization();
    publishGlobals();

    return {
      accepted: validation.accepted,
      reason: validation.reason,
      sceneGraphBuilt: state.sceneGraphBuilt,
      sceneGraphReady: state.sceneGraphReady,
      f89RegistryReleaseAuthorized: state.f89ReleaseAuthorized,
      recommendedNextFile: validation.accepted ? F89_FILE : F34_FILE,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function composeF55ReleasePacket(extra = {}) {
    computeFibonacciSynchronization();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "UE5_EXPRESSION_F55_RELEASE_PACKET",
      sourceFile: FILE,
      targetFile: F89_FILE,
      destinationFile: F89_FILE,

      activeFibonacci: FIBONACCI.UE5_EXPRESSION,
      activeFibonacciRank: 55,
      sourceFibonacciGate: FIBONACCI.PRODUCT_ENGINE,
      futureFibonacciGate: FIBONACCI.PROJECT_REGISTRY,
      futureFibonacciRank: 89,

      familyScope: state.familyScope,
      thisFamilyIsEntireDiagnosticEngine: false,
      thisFamilyIsAllOfEngine1: false,
      replacesEngines2Through4: false,

      mechanicalCoordinate: clone(MECHANICAL_COORDINATE),
      engineMechanicsPrimary: true,
      mathPrimary: true,
      architectureLabelsSecondary: true,

      f34ReleaseAccepted: state.f34Accepted,
      f34Contract: state.f34Contract,
      f34Receipt: state.f34Receipt,

      sceneGraphBuilt: state.sceneGraphBuilt,
      sceneGraphReady: state.sceneGraphReady,
      sceneGraphStatus: state.sceneGraphStatus,
      sceneNodeCount: state.sceneNodeCount,
      expressionNodeCount: state.expressionNodeCount,
      registryRecordNodeCount: state.registryRecordNodeCount,
      diagnosticEvidenceNodeCount: state.diagnosticEvidenceNodeCount,

      expressionQualityScore: state.expressionQualityScore,
      expressionCoverageScore: state.expressionCoverageScore,
      expressionTraceScore: state.expressionTraceScore,
      expressionCoherenceScore: state.expressionCoherenceScore,

      sceneGraph: clone(state.sceneGraph),
      expressionRecords: clone(state.sceneGraph.expressionRecords),
      registryRecords: clone(state.sceneGraph.registryRecords),

      f89RegistryReleaseAuthorized: state.f89ReleaseAuthorized,
      f55ReleasePacketReady: state.f55ReleasePacketReady,
      f55ActivationStatus: state.f55ActivationStatus,
      f55ActivationReason: state.f55ActivationReason,

      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      oneActiveGearAtATime: true,

      detail: clone(extra),

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

  function submitF55ReleaseToRegistry(extra = {}) {
    const registry = firstGlobal([
      "LAB_PRODUCT_ENGINE_REGISTRY",
      "LAB_PRODUCT_ENGINE_REGISTRY_F89",
      "PRODUCT_ENGINE_REGISTRY",
      "PROJECT_REGISTRY_CONDUCTOR",
      "DEXTER_LAB.productEngineRegistry",
      "HEARTH.productEngineRegistry"
    ]);

    if (!registry || !isFunction(registry.acceptF55ExpressionRelease)) {
      return { submitted: false, reason: "F89_REGISTRY_ACCEPT_F55_METHOD_UNAVAILABLE", recommendedNextFile: F89_FILE };
    }

    try {
      return { submitted: true, response: clone(registry.acceptF55ExpressionRelease(composeF55ReleasePacket(extra))) };
    } catch (error) {
      recordError("F55_RELEASE_TO_F89_FAILED", error);
      return { submitted: false, reason: "F55_RELEASE_TO_F89_FAILED" };
    }
  }

  function submitF55PacketToNorth(extra = {}) {
    const north = firstGlobal(["LAB_RUNTIME_TABLE", "RUNTIME_TABLE", "DEXTER_LAB.runtimeTable", "HEARTH.runtimeTable"]);
    if (!north) return { submitted: false, reason: "NORTH_RUNTIME_TABLE_UNAVAILABLE" };

    const packet = composeF55ReleasePacket(extra);
    try {
      if (isFunction(north.acceptF55ExpressionPacket)) return { submitted: true, response: clone(north.acceptF55ExpressionPacket(packet)) };
      if (isFunction(north.acceptSupportEnginePacket)) return { submitted: true, response: clone(north.acceptSupportEnginePacket(packet)) };
      if (isFunction(north.receiveSupportEnginePacket)) return { submitted: true, response: clone(north.receiveSupportEnginePacket(packet)) };
    } catch (error) {
      recordError("F55_PACKET_TO_NORTH_FAILED", error);
      return { submitted: false, reason: "F55_PACKET_TO_NORTH_FAILED" };
    }

    return { submitted: false, reason: "NORTH_SUPPORT_ENGINE_METHOD_UNAVAILABLE" };
  }

  function acceptF89RegistryReceipt(packet = {}) {
    const accepted = Boolean(
      isObject(packet) &&
      !detectForbiddenClaim(packet) &&
      (
        safeBool(packet.registryGraphBuilt, false) ||
        safeBool(packet.projectRegistryConductorActive, false) ||
        safeString(packet.activeFibonacci) === FIBONACCI.PROJECT_REGISTRY ||
        safeString(packet.packetType).includes("F89")
      )
    );

    recordLocal("F89_RECEIPT_RECEIVED_BY_F55", { accepted });

    return {
      accepted,
      reason: accepted ? "F89_REGISTRY_RECEIPT_ACCEPTED" : "F89_REGISTRY_RECEIPT_REJECTED",
      recommendedNextFile: accepted ? F144_FILE : F89_FILE,
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
      mechanicalCoordinate: clone(MECHANICAL_COORDINATE),
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

  function getReceiptLight() {
    computeFibonacciSynchronization();
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,

      familyScope: state.familyScope,
      thisFamilyIsEntireDiagnosticEngine: false,
      thisFamilyIsAllOfEngine1: false,
      replacesEngines2Through4: false,

      expressionEngineF55Active: true,
      expressionEngineF55Only: true,
      expressionClerkActive: true,
      sceneGraphConductorActive: true,

      mechanicalCoordinateId: MECHANICAL_COORDINATE.coordinateId,
      activeFibonacci: FIBONACCI.UE5_EXPRESSION,
      activeFibonacciRank: 55,
      sourceFibonacciGate: FIBONACCI.PRODUCT_ENGINE,
      futureFibonacciGate: FIBONACCI.PROJECT_REGISTRY,

      f34Observed: state.f34Observed,
      f34Accepted: state.f34Accepted,
      f34Contract: state.f34Contract,
      f34Receipt: state.f34Receipt,

      sceneGraphBuilt: state.sceneGraphBuilt,
      sceneGraphReady: state.sceneGraphReady,
      sceneGraphStatus: state.sceneGraphStatus,
      sceneNodeCount: state.sceneNodeCount,
      expressionNodeCount: state.expressionNodeCount,
      registryRecordNodeCount: state.registryRecordNodeCount,
      diagnosticEvidenceNodeCount: state.diagnosticEvidenceNodeCount,

      expressionQualityScore: state.expressionQualityScore,
      expressionCoverageScore: state.expressionCoverageScore,
      expressionTraceScore: state.expressionTraceScore,
      expressionCoherenceScore: state.expressionCoherenceScore,

      f89RegistryReleaseAuthorized: state.f89ReleaseAuthorized,
      f55ReleasePacketReady: state.f55ReleasePacketReady,
      f55ActivationStatus: state.f55ActivationStatus,
      f55ActivationReason: state.f55ActivationReason,

      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,

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
    return {
      ...getReceiptLight(),
      owns: [
        "F55 expression scene-graph manifold",
        "F34 product graph consumption",
        "deterministic scene records",
        "deterministic expression records",
        "registry-ready records",
        "F89 handoff packet"
      ],
      doesNotOwn: [
        "F34 Product Engine authority",
        "F89 Registry authority",
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
      nodeTypes: clone(NODE_TYPES),
      fibonacci: clone(FIBONACCI),
      mechanicalCoordinate: clone(MECHANICAL_COORDINATE),
      mechanicalCoordinatePacket: getMechanicalCoordinatePacket(),
      f34Packet: clone(state.f34Packet),
      sceneGraph: clone(state.sceneGraph),
      expressionRecords: clone(state.sceneGraph.expressionRecords),
      registryRecords: clone(state.sceneGraph.registryRecords),
      expressionQuality: computeExpressionQuality(),
      f55ReleasePacket: composeF55ReleasePacket(),
      localEvents: clone(state.localEvents),
      errors: clone(state.errors)
    };
  }

  function getReceiptText() {
    const r = getReceiptLight();
    return [
      "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_REPLACEMENT_SHELL_RECEIPT",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `familyScope=${r.familyScope}`,
      `thisFamilyIsEntireDiagnosticEngine=${r.thisFamilyIsEntireDiagnosticEngine}`,
      `thisFamilyIsAllOfEngine1=${r.thisFamilyIsAllOfEngine1}`,
      `replacesEngines2Through4=${r.replacesEngines2Through4}`,
      `mechanicalCoordinateId=${r.mechanicalCoordinateId}`,
      `activeFibonacci=${r.activeFibonacci}`,
      `f34Accepted=${r.f34Accepted}`,
      `sceneGraphBuilt=${r.sceneGraphBuilt}`,
      `sceneGraphStatus=${r.sceneGraphStatus}`,
      `expressionQualityScore=${r.expressionQualityScore}`,
      `f89RegistryReleaseAuthorized=${r.f89RegistryReleaseAuthorized}`,
      `fibonacciSynchronizationScore=${r.fibonacciSynchronizationScore}`,
      `publicSuperiorityClaim=${r.publicSuperiorityClaim}`,
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function updateDataset() {
    setDataset("labProductEngineUE5ExpressionLoaded", "true");
    setDataset("labProductEngineUE5ExpressionContract", CONTRACT);
    setDataset("labProductEngineUE5ExpressionReceipt", RECEIPT);
    setDataset("labProductEngineUE5ExpressionVersion", VERSION);
    setDataset("ue5ExpressionF55Only", "true");
    setDataset("ue5ExpressionMechanicalCoordinateId", MECHANICAL_COORDINATE.coordinateId);
    setDataset("ue5ExpressionSceneGraphBuilt", state.sceneGraphBuilt);
    setDataset("ue5ExpressionSceneGraphReady", state.sceneGraphReady);
    setDataset("ue5ExpressionSceneGraphStatus", state.sceneGraphStatus);
    setDataset("ue5ExpressionQualityScore", state.expressionQualityScore);
    setDataset("ue5ExpressionF89RegistryReleaseAuthorized", state.f89ReleaseAuthorized);
    setDataset("ue5ExpressionFibonacciSynchronizationScore", state.fibonacciSynchronizationScore);
    setDataset("ue5ExpressionPublicSuperiorityClaim", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function publishGlobals() {
    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.HEARTH = root.HEARTH || {};

    root.LAB_PRODUCT_ENGINE_UE5_EXPRESSION = api;
    root.LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55 = api;
    root.PRODUCT_ENGINE_UE5_EXPRESSION = api;
    root.UE5_EXPRESSION_CONDUCTOR = api;
    root.UE5_EXPRESSION_F55_CONDUCTOR = api;
    root.EXPRESSION_CLERK = api;

    setPath("DEXTER_LAB.productEngineUE5Expression", api);
    setPath("DEXTER_LAB.productEngineUE5ExpressionF55", api);
    setPath("DEXTER_LAB.ue5ExpressionConductor", api);
    setPath("HEARTH.productEngineUE5Expression", api);
    setPath("HEARTH.productEngineUE5ExpressionF55", api);
    setPath("HEARTH.ue5ExpressionConductor", api);

    const light = getReceiptLight();
    root.LAB_PRODUCT_ENGINE_UE5_EXPRESSION_RECEIPT = light;
    root.LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_RECEIPT = light;
    root.PRODUCT_ENGINE_UE5_EXPRESSION_RECEIPT = light;

    root.__LAB_PRODUCT_ENGINE_UE5_EXPRESSION_LOADED__ = true;
    root.__LAB_PRODUCT_ENGINE_UE5_EXPRESSION_CONTRACT__ = CONTRACT;
    root.__LAB_PRODUCT_ENGINE_UE5_EXPRESSION_RECEIPT__ = RECEIPT;
    root.__LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_ONLY__ = true;
    root.__LAB_PRODUCT_ENGINE_UE5_EXPRESSION_MECHANICAL_COORDINATE__ = MECHANICAL_COORDINATE.coordinateId;
    root.__LAB_PRODUCT_ENGINE_UE5_EXPRESSION_PUBLIC_SUPERIORITY_CLAIM__ = false;
    root.__LAB_PRODUCT_ENGINE_UE5_EXPRESSION_WEBGL__ = false;
    root.__LAB_PRODUCT_ENGINE_UE5_EXPRESSION_VISUAL_PASS_CLAIMED__ = false;

    updateDataset();
  }

  const api = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,

    FIBONACCI,
    STATUS,
    NODE_TYPES,
    MECHANICAL_COORDINATE,

    readF34Authority,
    readF34Release,
    hasMeaningfulF34Release,
    validateF34Release,
    acceptF34Release,
    receiveF34Release: acceptF34Release,
    submitF34Release: acceptF34Release,

    normalizeProduct,
    getF34Products,
    expressionClass,
    expressionMode,
    expressionScore,
    buildSceneGraph,
    computeExpressionQuality,
    computeFibonacciSynchronization,

    composeF55ReleasePacket,
    composeF55Receipt: getReceipt,
    submitF55ReleaseToRegistry,
    submitF55PacketToNorth,
    acceptF89RegistryReceipt,

    getMechanicalCoordinatePacket,
    getSceneGraph: () => clone(state.sceneGraph),
    getSceneGraphSummary: () => ({
      sceneGraphBuilt: state.sceneGraphBuilt,
      sceneGraphReady: state.sceneGraphReady,
      sceneGraphStatus: state.sceneGraphStatus,
      sceneNodeCount: state.sceneNodeCount,
      expressionNodeCount: state.expressionNodeCount,
      registryRecordNodeCount: state.registryRecordNodeCount,
      expressionQualityScore: state.expressionQualityScore
    }),
    getExpressionRecords: () => clone(state.sceneGraph.expressionRecords),
    getRegistryRecords: () => clone(state.sceneGraph.registryRecords),

    getReceiptLight,
    getReceipt,
    getReceiptText,
    publishGlobals,
    updateDataset,

    expressionEngineF55Active: true,
    expressionEngineF55Only: true,
    expressionClerkActive: true,
    sceneGraphConductorActive: true,

    ownsF55ExpressionSceneGraphManifold: true,
    ownsF34ProductGraphConsumption: true,
    ownsDeterministicSceneGraphRecords: true,
    ownsExpressionNodeRecords: true,
    ownsRegistryReadyExpressionRecords: true,
    ownsF89RegistryHandoffPacket: true,

    ownsF34ProductEngineAuthority: false,
    ownsF89RegistryAuthority: false,
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

    get state() { return state; }
  });

  state.createdAt = nowIso();
  state.updatedAt = state.createdAt;

  try {
    const f34 = readF34Release();
    if (hasMeaningfulF34Release(f34)) acceptF34Release(f34);
  } catch (error) {
    recordError("INITIAL_F34_RELEASE_READ_FAILED", error);
  }

  try {
    computeFibonacciSynchronization();
  } catch (error) {
    recordError("INITIAL_F55_SYNC_FAILED", error);
  }

  recordLocal("F55_REPLACEMENT_SHELL_LOADED", {
    file: FILE,
    contract: CONTRACT,
    mechanicalCoordinate: MECHANICAL_COORDINATE.coordinateId,
    targetFile: F89_FILE,
    publicSuperiorityClaim: false
  });

  publishGlobals();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

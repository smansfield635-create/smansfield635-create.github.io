// /assets/lab/product-engine.ue5-expression.js
// LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_ENGINE_MECHANICS_SCENE_GRAPH_CONDUCTOR_TNT_v2
// Full-file replacement.
// Product Engine UE5 Expression F55 / scene-graph conductor / Expression Clerk.
// Purpose:
// - Consume the F34 Product Engine release packet from /assets/lab/product-engine.js.
// - Build deterministic UE5-derived expression records without requiring Unreal Engine.
// - Convert product graph records into scene graph nodes, expression nodes, surface-carrier references, and registry-ready records.
// - Bind directly to runtime-table v4 mechanics: RT3D-X10_Y19_Z55.
// - Prepare F89 registry handoff packet for /assets/lab/product-engine.registry.js.
// - Preserve F34 -> F55 -> F89 -> F144 -> F233 sequence.
// - Avoid rendering, generated image claims, WebGL claims, GraphicBox claims, public superiority claims, and final visual pass claims.
// Does not own:
// - F34 Product Engine authority
// - F89 Registry authority
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

  const CONTRACT = "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_ENGINE_MECHANICS_SCENE_GRAPH_CONDUCTOR_TNT_v2";
  const RECEIPT = "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_ENGINE_MECHANICS_SCENE_GRAPH_CONDUCTOR_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_SCENE_GRAPH_CONDUCTOR_TNT_v1";
  const BASELINE_CONTRACT = "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_BASELINE_v1";
  const VERSION = "2026-06-08.lab-product-engine-ue5-expression-f55-engine-mechanics-scene-graph-conductor-v2";

  const FILE = "/assets/lab/product-engine.ue5-expression.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const F34_PRODUCT_ENGINE_FILE = "/assets/lab/product-engine.js";
  const F89_REGISTRY_FILE = "/assets/lab/product-engine.registry.js";
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

  const NODE_TYPES = Object.freeze({
    PRODUCT_NODE: "product-node",
    SCENE_NODE: "scene-node",
    EXPRESSION_NODE: "expression-node",
    SURFACE_CARRIER_NODE: "surface-carrier-node",
    REGISTRY_RECORD_NODE: "registry-record-node",
    DIAGNOSTIC_EVIDENCE_NODE: "diagnostic-evidence-node"
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
    chessRole: "BISHOP_STYLE_TRANSLATOR",
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

    expressionEngineF55Active: true,
    expressionEngineF55Only: true,
    expressionClerkActive: true,
    sceneGraphConductorActive: true,

    engineMechanicsPrimary: true,
    mathPrimary: true,
    architectureLabelsSecondary: true,
    mechanicalCoordinate: MECHANICAL_COORDINATE,

    f34ProductEngineObserved: false,
    f34ReleaseAccepted: false,
    f34ReleasePacket: null,
    f34Contract: "",
    f34Receipt: "",

    productGraphObserved: false,
    productGraphStatus: STATUS.HELD,
    productCount: 0,
    productReadyCount: 0,
    productDegradedCount: 0,
    productBlockedCount: 0,

    sceneGraphBuilt: false,
    sceneGraphReady: false,
    sceneGraphStatus: STATUS.HELD,
    sceneNodeCount: 0,
    expressionNodeCount: 0,
    registryRecordNodeCount: 0,
    diagnosticEvidenceNodeCount: 0,

    sceneGraph: {
      nodes: {},
      edges: [],
      products: [],
      expressionRecords: [],
      registryRecords: [],
      buildId: "",
      builtAt: ""
    },

    expressionQualityMetricActive: true,
    expressionQualityScore: 0,
    expressionCoverageScore: 0,
    expressionTraceScore: 0,
    expressionCoherenceScore: 0,

    f89RegistryReleaseAuthorized: false,
    f55ReleasePacketReady: false,
    f55ActivationStatus: STATUS.ACTIVE,
    f55ActivationReason: "UE5_EXPRESSION_F55_ACTIVE_WAITING_F34_PRODUCT_GRAPH",

    f89RegistryReceiptAccepted: false,
    f89RegistryReceiptPacket: null,
    f89RegistryContract: "",
    f89RegistryReceipt: "",

    activeFibonacci: FIBONACCI.UE5_EXPRESSION,
    activeFibonacciRank: 55,
    activeNewsGate: NEWS_GATES.EXPRESSION,
    sourceFibonacciGate: FIBONACCI.PRODUCT_ENGINE,
    futureFibonacciGate: FIBONACCI.PROJECT_REGISTRY,
    newsProtocolAligned: true,
    fibonacciSynchronizationMetricActive: true,
    fibonacciSynchronizationScore: 0,
    oneActiveGearAtATime: true,

    firstFailedCoordinate: "WAITING_F34_PRODUCT_GRAPH_RELEASE",
    recommendedNextFile: F34_PRODUCT_ENGINE_FILE,
    recommendedNextRenewalTarget: F34_PRODUCT_ENGINE_FILE,

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

  function makeId(value, fallback = "node") {
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
      code: safeString(code, "UE5_EXPRESSION_F55_ERROR"),
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

  function hasMeaningfulF34Release(packet = {}) {
    if (!isObject(packet)) return false;

    return Boolean(
      packet.contract ||
      packet.receipt ||
      packet.packetType === "PRODUCT_ENGINE_F34_RELEASE_PACKET" ||
      safeBool(packet.productEngineF34Active, false) ||
      safeBool(packet.productEngineF34Ready, false) ||
      safeBool(packet.f34ReleasePacketReady, false) ||
      safeBool(packet.productGraphBuilt, false) ||
      Array.isArray(packet.products)
    );
  }

  function readF34ProductEngineAuthority() {
    return firstGlobal([
      "LAB_PRODUCT_ENGINE",
      "LAB_PRODUCT_ENGINE_F34",
      "PRODUCT_ENGINE",
      "PRODUCT_ENGINE_F34",
      "PRODUCT_ENGINE_CLERK",
      "PRODUCT_ENGINE_AUTHORITY_SLOT",
      "DEXTER_LAB.productEngine",
      "DEXTER_LAB.productEngineF34",
      "DEXTER_LAB.productEngineClerk",
      "DEXTER_LAB.productEngineAuthoritySlot",
      "HEARTH.productEngine",
      "HEARTH.productEngineF34",
      "HEARTH.productEngineClerk",
      "HEARTH.productEngineAuthoritySlot"
    ]);
  }

  function readF34ProductEngineRelease() {
    const authority = readF34ProductEngineAuthority();
    if (!authority) return {};

    try {
      if (isFunction(authority.composeF34ReleasePacket)) {
        const packet = authority.composeF34ReleasePacket();
        if (isObject(packet)) return packet;
      }

      if (isFunction(authority.getReceipt)) {
        const receipt = authority.getReceipt();
        if (isObject(receipt) && isObject(receipt.f34ReleasePacket)) return receipt.f34ReleasePacket;
      }

      return readReceipt(authority);
    } catch (error) {
      recordError("F34_PRODUCT_ENGINE_RELEASE_READ_FAILED", error);
      return {};
    }
  }

  function validateF34Release(packet = {}) {
    const input = isObject(packet) ? packet : {};
    const noForbiddenClaim = !detectForbiddenClaim(input);
    const meaningful = hasMeaningfulF34Release(input);

    const activeFibonacci = safeString(input.activeFibonacci || input.fibonacciStage || "");
    const futureFibonacciGate = safeString(input.futureFibonacciGate || "");

    const correctStage = Boolean(
      !activeFibonacci ||
      activeFibonacci === FIBONACCI.PRODUCT_ENGINE ||
      activeFibonacci === "F34"
    );

    const correctFuture = Boolean(
      !futureFibonacciGate ||
      futureFibonacciGate === FIBONACCI.UE5_EXPRESSION ||
      futureFibonacciGate === "F55"
    );

    const productGraphAcceptable = Boolean(
      safeBool(input.productGraphBuilt, false) ||
      Array.isArray(input.products) ||
      isObject(input.productGraph)
    );

    const accepted = Boolean(
      noForbiddenClaim &&
      meaningful &&
      correctStage &&
      correctFuture &&
      productGraphAcceptable
    );

    let reason = "F34_PRODUCT_ENGINE_RELEASE_ACCEPTED";
    if (!noForbiddenClaim) reason = "FORBIDDEN_CLAIM_DETECTED_IN_F34_RELEASE";
    else if (!meaningful) reason = "F34_RELEASE_NOT_MEANINGFUL";
    else if (!correctStage) reason = "F34_RELEASE_WRONG_ACTIVE_FIBONACCI";
    else if (!correctFuture) reason = "F34_RELEASE_WRONG_FUTURE_GATE";
    else if (!productGraphAcceptable) reason = "F34_RELEASE_MISSING_PRODUCT_GRAPH";

    return {
      accepted,
      reason,
      noForbiddenClaim,
      meaningful,
      correctStage,
      correctFuture,
      productGraphAcceptable,
      input: clonePlain(input)
    };
  }

  function acceptF34Release(packet = {}) {
    const validation = validateF34Release(packet);

    if (validation.accepted) {
      state.f34ProductEngineObserved = true;
      state.f34ReleaseAccepted = true;
      state.f34ReleasePacket = clonePlain(packet);
      state.f34Contract = safeString(packet.contract, "");
      state.f34Receipt = safeString(packet.receipt, "");

      state.productGraphObserved = true;
      state.productGraphStatus = safeString(packet.productGraphStatus || STATUS.READY, STATUS.READY);
      state.productCount = safeNumber(packet.productCount || (Array.isArray(packet.products) ? packet.products.length : 0), 0);
      state.productReadyCount = safeNumber(packet.productReadyCount, 0);
      state.productDegradedCount = safeNumber(packet.productDegradedCount, 0);
      state.productBlockedCount = safeNumber(packet.productBlockedCount, 0);

      buildSceneGraph(packet);
    }

    recordLocal("F34_RELEASE_EVALUATED_BY_UE5_EXPRESSION_F55", {
      accepted: validation.accepted,
      reason: validation.reason,
      productCount: state.productCount
    });

    computeFibonacciSynchronizationMetric();
    publishGlobals();

    return {
      accepted: validation.accepted,
      expressionEngineF55ReceivedF34: true,
      reason: validation.reason,
      sceneGraphBuilt: state.sceneGraphBuilt,
      sceneGraphReady: state.sceneGraphReady,
      f89RegistryReleaseAuthorized: state.f89RegistryReleaseAuthorized,
      recommendedNextFile: validation.accepted ? F89_REGISTRY_FILE : F34_PRODUCT_ENGINE_FILE,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function receiveF34Release(packet = {}) {
    return acceptF34Release(packet);
  }

  function submitF34Release(packet = {}) {
    return acceptF34Release(packet);
  }

  function normalizeProductFromF34(product = {}, index = 0) {
    const source = isObject(product) ? product : {};
    const id = makeId(source.id || source.productId || source.name || `f34-product-${index + 1}`, `f34-product-${index + 1}`);

    return {
      id,
      productId: safeString(source.productId || id),
      type: safeString(source.type || source.productType || "product-framework"),
      name: safeString(source.name || source.label || id),
      label: safeString(source.label || source.name || id),
      file: safeString(source.file || source.sourceFile || ""),
      route: safeString(source.route || ""),
      contract: safeString(source.contract || source.sourceContract || ""),
      receipt: safeString(source.receipt || source.sourceReceipt || ""),
      readinessScore: clamp(source.readinessScore ?? source.productQualityScore ?? 0, 0, 100),
      status: safeString(source.status || STATUS.DEGRADED, STATUS.DEGRADED),
      priority: clamp(source.priority ?? 50, 0, 100),
      tags: Array.isArray(source.tags) ? source.tags.slice() : [],
      dependencies: Array.isArray(source.dependencies) ? source.dependencies.slice() : [],
      receiptReady: safeBool(source.receiptReady, Boolean(source.contract || source.receipt)),
      platformReady: safeBool(source.platformReady, false),
      engineeringReady: safeBool(source.engineeringReady, false),
      productReady: safeBool(source.productReady, false),
      expressionReady: safeBool(source.expressionReady, false),
      evidenceReady: safeBool(source.evidenceReady, false),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      publicSuperiorityClaim: false
    };
  }

  function getF34Products(packet = state.f34ReleasePacket || {}) {
    if (Array.isArray(packet.products)) {
      return packet.products.map(normalizeProductFromF34);
    }

    if (isObject(packet.productGraph) && Array.isArray(packet.productGraph.products)) {
      return packet.productGraph.products.map(normalizeProductFromF34);
    }

    return [];
  }

  function createSceneNode(product, index) {
    const nodeId = makeId(`scene-${product.id}`, `scene-${index + 1}`);

    return {
      id: nodeId,
      nodeType: NODE_TYPES.SCENE_NODE,
      sourceProductId: product.id,
      sourceProductType: product.type,
      label: `${product.label || product.name} Scene Node`,
      file: product.file,
      route: product.route,
      expressionClass: classifyExpressionClass(product),
      transform: {
        position: [index, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
      },
      deterministic: true,
      requiresUnrealRuntime: false,
      rendersNow: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      createdAt: nowIso()
    };
  }

  function createExpressionNode(product, sceneNode, index) {
    const nodeId = makeId(`expression-${product.id}`, `expression-${index + 1}`);

    return {
      id: nodeId,
      nodeType: NODE_TYPES.EXPRESSION_NODE,
      sourceProductId: product.id,
      sceneNodeId: sceneNode.id,
      label: `${product.label || product.name} Expression Node`,
      expressionMode: classifyExpressionMode(product),
      expressionReadinessScore: expressionReadinessScore(product),
      registryReady: product.receiptReady && product.readinessScore >= 62,
      deterministic: true,
      ownsRendering: false,
      rendersNow: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      publicSuperiorityClaim: false,
      createdAt: nowIso()
    };
  }

  function createRegistryRecordNode(product, sceneNode, expressionNode, index) {
    const nodeId = makeId(`registry-record-${product.id}`, `registry-record-${index + 1}`);

    return {
      id: nodeId,
      nodeType: NODE_TYPES.REGISTRY_RECORD_NODE,
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
      deterministic: true,
      createdAt: nowIso()
    };
  }

  function classifyExpressionClass(product) {
    const text = `${product.type} ${product.name} ${product.tags.join(" ")}`.toLowerCase();

    if (/runtime|engine/.test(text)) return "RUNTIME_ENGINE_EXPRESSION";
    if (/support|f34|f55|f89|f144/.test(text)) return "SUPPORT_ENGINE_EXPRESSION";
    if (/canvas|chapel|surface|visual/.test(text)) return "CANVAS_SURFACE_EXPRESSION";
    if (/diagnostic|receipt|evidence/.test(text)) return "DIAGNOSTIC_EVIDENCE_EXPRESSION";
    if (/market|license|demo|package/.test(text)) return "MARKET_PACKAGE_EXPRESSION";

    return "PRODUCT_FRAMEWORK_EXPRESSION";
  }

  function classifyExpressionMode(product) {
    const expressionClass = classifyExpressionClass(product);

    if (expressionClass === "RUNTIME_ENGINE_EXPRESSION") return "MECHANICAL_COORDINATE_PRESENTATION";
    if (expressionClass === "SUPPORT_ENGINE_EXPRESSION") return "SUPPORT_HANDOFF_PRESENTATION";
    if (expressionClass === "CANVAS_SURFACE_EXPRESSION") return "VISIBLE_CARRIER_PRESENTATION";
    if (expressionClass === "DIAGNOSTIC_EVIDENCE_EXPRESSION") return "RECEIPT_EVIDENCE_PRESENTATION";
    if (expressionClass === "MARKET_PACKAGE_EXPRESSION") return "READINESS_PACKAGE_PRESENTATION";

    return "PRODUCT_GRAPH_PRESENTATION";
  }

  function expressionReadinessScore(product) {
    return clamp(
      Math.round(
        (product.readinessScore * 0.40) +
        (product.receiptReady ? 18 : 0) +
        (product.file || product.route ? 14 : 0) +
        (product.engineeringReady ? 12 : 0) +
        (product.productReady ? 10 : 0) +
        (product.evidenceReady ? 6 : 0)
      ),
      0,
      100
    );
  }

  function buildSceneGraph(packet = state.f34ReleasePacket || {}, options = {}) {
    const products = getF34Products(packet);

    const nodes = {};
    const edges = [];
    const expressionRecords = [];
    const registryRecords = [];

    products.forEach((product, index) => {
      const productNodeId = makeId(`product-${product.id}`, `product-${index + 1}`);
      const productNode = {
        id: productNodeId,
        nodeType: NODE_TYPES.PRODUCT_NODE,
        sourceProductId: product.id,
        label: product.label || product.name,
        productType: product.type,
        file: product.file,
        route: product.route,
        readinessScore: product.readinessScore,
        status: product.status,
        deterministic: true
      };

      const sceneNode = createSceneNode(product, index);
      const expressionNode = createExpressionNode(product, sceneNode, index);
      const registryRecordNode = createRegistryRecordNode(product, sceneNode, expressionNode, index);

      nodes[productNode.id] = productNode;
      nodes[sceneNode.id] = sceneNode;
      nodes[expressionNode.id] = expressionNode;
      nodes[registryRecordNode.id] = registryRecordNode;

      edges.push({
        from: productNode.id,
        to: sceneNode.id,
        type: "product-to-scene",
        deterministic: true
      });

      edges.push({
        from: sceneNode.id,
        to: expressionNode.id,
        type: "scene-to-expression",
        deterministic: true
      });

      edges.push({
        from: expressionNode.id,
        to: registryRecordNode.id,
        type: "expression-to-registry-record",
        deterministic: true
      });

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
        registryRecordId: registryRecordNode.id,
        sourceProductId: product.id,
        file: product.file,
        route: product.route,
        contract: product.contract,
        receipt: product.receipt,
        traceReady: registryRecordNode.traceReady,
        registryReady: registryRecordNode.registryReady,
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
    state.sceneNodeCount = Object.values(nodes).filter((node) => node.nodeType === NODE_TYPES.SCENE_NODE).length;
    state.expressionNodeCount = Object.values(nodes).filter((node) => node.nodeType === NODE_TYPES.EXPRESSION_NODE).length;
    state.registryRecordNodeCount = registryRecords.length;
    state.diagnosticEvidenceNodeCount = products.filter((product) => product.type === "diagnostic-evidence").length;

    computeExpressionQualityMetric();

    state.sceneGraphReady = Boolean(
      products.length > 0 &&
      state.expressionQualityScore >= 80 &&
      registryRecords.some((record) => record.registryReady)
    );

    if (state.sceneGraphReady) {
      state.sceneGraphStatus = STATUS.READY;
      state.f89RegistryReleaseAuthorized = true;
      state.f55ReleasePacketReady = true;
      state.f55ActivationStatus = STATUS.READY;
      state.f55ActivationReason = "UE5_EXPRESSION_F55_SCENE_GRAPH_READY_FOR_F89_REGISTRY";
      state.firstFailedCoordinate = "NONE_UE5_EXPRESSION_F55_READY_F89_RELEASE_AUTHORIZED";
      state.recommendedNextFile = F89_REGISTRY_FILE;
      state.recommendedNextRenewalTarget = F89_REGISTRY_FILE;
    } else if (products.length > 0 && state.expressionQualityScore >= 62) {
      state.sceneGraphStatus = STATUS.DEGRADED;
      state.f89RegistryReleaseAuthorized = true;
      state.f55ReleasePacketReady = true;
      state.f55ActivationStatus = STATUS.DEGRADED;
      state.f55ActivationReason = "UE5_EXPRESSION_F55_SCENE_GRAPH_DEGRADED_F89_RELEASE_AVAILABLE_WITH_BOUNDARIES";
      state.firstFailedCoordinate = "NONE_UE5_EXPRESSION_F55_DEGRADED_F89_RELEASE_AVAILABLE";
      state.recommendedNextFile = F89_REGISTRY_FILE;
      state.recommendedNextRenewalTarget = F89_REGISTRY_FILE;
    } else {
      state.sceneGraphStatus = STATUS.HELD;
      state.f89RegistryReleaseAuthorized = false;
      state.f55ReleasePacketReady = false;
      state.f55ActivationStatus = STATUS.HELD;
      state.f55ActivationReason = "WAITING_F34_PRODUCT_GRAPH_OR_EXPRESSION_QUALITY";
      state.firstFailedCoordinate = "WAITING_F34_PRODUCT_GRAPH_OR_EXPRESSION_QUALITY";
      state.recommendedNextFile = F34_PRODUCT_ENGINE_FILE;
      state.recommendedNextRenewalTarget = F34_PRODUCT_ENGINE_FILE;
    }

    computeFibonacciSynchronizationMetric();

    if (options.silent !== true) {
      recordLocal("UE5_EXPRESSION_F55_SCENE_GRAPH_BUILT", {
        productCount: products.length,
        sceneNodeCount: state.sceneNodeCount,
        expressionNodeCount: state.expressionNodeCount,
        registryRecordNodeCount: state.registryRecordNodeCount,
        sceneGraphStatus: state.sceneGraphStatus,
        expressionQualityScore: state.expressionQualityScore
      });
    }

    updateDataset();

    return clonePlain(state.sceneGraph);
  }

  function computeExpressionQualityMetric() {
    const products = state.sceneGraph.products || [];
    const expressionRecords = state.sceneGraph.expressionRecords || [];
    const registryRecords = state.sceneGraph.registryRecords || [];

    const productCount = Math.max(1, products.length);
    const expressionCount = expressionRecords.length;
    const registryReadyCount = registryRecords.filter((record) => record.registryReady).length;
    const traceReadyCount = registryRecords.filter((record) => record.traceReady).length;

    state.expressionCoverageScore = clamp(
      Math.round((expressionCount / productCount) * 100),
      0,
      100
    );

    state.expressionTraceScore = clamp(
      Math.round((traceReadyCount / productCount) * 100),
      0,
      100
    );

    const avgExpressionReadiness = expressionRecords.length
      ? expressionRecords.reduce((sum, record) => sum + safeNumber(record.expressionReadinessScore, 0), 0) / expressionRecords.length
      : 0;

    state.expressionCoherenceScore = clamp(
      Math.round(
        (avgExpressionReadiness * 0.52) +
        (state.expressionCoverageScore * 0.20) +
        (state.expressionTraceScore * 0.18) +
        ((registryReadyCount / productCount) * 10)
      ),
      0,
      100
    );

    state.expressionQualityScore = clamp(
      Math.round(
        (state.expressionCoherenceScore * 0.44) +
        (state.expressionCoverageScore * 0.28) +
        (state.expressionTraceScore * 0.28)
      ),
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

  function computeFibonacciSynchronizationMetric() {
    const checks = [
      state.newsProtocolAligned,
      state.oneActiveGearAtATime,
      state.activeFibonacci === FIBONACCI.UE5_EXPRESSION,
      state.activeFibonacciRank === 55,
      state.activeNewsGate === NEWS_GATES.EXPRESSION,
      state.sourceFibonacciGate === FIBONACCI.PRODUCT_ENGINE,
      state.futureFibonacciGate === FIBONACCI.PROJECT_REGISTRY,
      state.expressionEngineF55Active,
      state.expressionClerkActive,
      state.sceneGraphConductorActive,
      state.engineMechanicsPrimary,
      state.mathPrimary,
      state.mechanicalCoordinate.coordinateId === "RT3D-X10_Y19_Z55",
      state.f34ReleaseAccepted || state.f34ProductEngineObserved,
      state.sceneGraphBuilt,
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

    computeExpressionQualityMetric();

    return {
      score: state.fibonacciSynchronizationScore,
      passed,
      total: checks.length,
      activeFibonacci: FIBONACCI.UE5_EXPRESSION,
      activeFibonacciRank: 55,
      activeNewsGate: NEWS_GATES.EXPRESSION,
      sourceFibonacciGate: FIBONACCI.PRODUCT_ENGINE,
      futureFibonacciGate: FIBONACCI.PROJECT_REGISTRY,
      publicSuperiorityClaim: false
    };
  }

  function evaluateNewsAlignment() {
    const metric = computeFibonacciSynchronizationMetric();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      newsAlignmentContract: "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_NEWS_ALIGNMENT_PROTOCOL_v2",
      newsAlignmentReceipt: "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_NEWS_ALIGNMENT_PROTOCOL_RECEIPT_v2",
      sequence: [
        {
          gate: NEWS_GATES.PRODUCT,
          fibonacci: FIBONACCI.PRODUCT_ENGINE,
          file: F34_PRODUCT_ENGINE_FILE,
          ready: state.f34ReleaseAccepted
        },
        {
          gate: NEWS_GATES.EXPRESSION,
          fibonacci: FIBONACCI.UE5_EXPRESSION,
          file: FILE,
          ready: state.sceneGraphReady || state.sceneGraphStatus === STATUS.DEGRADED
        },
        {
          gate: NEWS_GATES.REGISTRY,
          fibonacci: FIBONACCI.PROJECT_REGISTRY,
          file: F89_REGISTRY_FILE,
          ready: state.f89RegistryReleaseAuthorized
        },
        {
          gate: NEWS_GATES.MARKET,
          fibonacci: FIBONACCI.MARKET_READINESS,
          file: F144_MARKET_FILE,
          ready: false
        }
      ],
      fibonacciSynchronizationScore: metric.score,
      f55Status: state.f55ActivationStatus,
      sceneGraphStatus: state.sceneGraphStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function readF89RegistryAuthority() {
    return firstGlobal([
      "LAB_PRODUCT_ENGINE_REGISTRY",
      "LAB_PRODUCT_ENGINE_REGISTRY_F89",
      "PRODUCT_ENGINE_REGISTRY",
      "PROJECT_REGISTRY_CONDUCTOR",
      "DEXTER_LAB.productEngineRegistry",
      "DEXTER_LAB.productEngineRegistryF89",
      "DEXTER_LAB.projectRegistryConductor",
      "HEARTH.productEngineRegistry",
      "HEARTH.productEngineRegistryF89",
      "HEARTH.projectRegistryConductor"
    ]);
  }

  function composeF55ReleasePacket(extra = {}) {
    const metric = computeFibonacciSynchronizationMetric();
    const readyForF89 = Boolean(state.sceneGraphReady || state.sceneGraphStatus === STATUS.DEGRADED);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "UE5_EXPRESSION_F55_RELEASE_PACKET",
      sourceFile: FILE,
      targetFile: F89_REGISTRY_FILE,
      destinationFile: F89_REGISTRY_FILE,

      activeFibonacci: FIBONACCI.UE5_EXPRESSION,
      activeFibonacciRank: 55,
      activeNewsGate: NEWS_GATES.EXPRESSION,
      sourceFibonacciGate: FIBONACCI.PRODUCT_ENGINE,
      futureFibonacciGate: FIBONACCI.PROJECT_REGISTRY,
      futureFibonacciRank: 89,

      mechanicalCoordinate: clonePlain(MECHANICAL_COORDINATE),
      engineMechanicsPrimary: true,
      mathPrimary: true,
      architectureLabelsSecondary: true,

      expressionEngineF55Active: true,
      expressionEngineF55Only: true,
      expressionClerkActive: true,
      sceneGraphConductorActive: true,
      f34ReleaseAccepted: state.f34ReleaseAccepted,
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

      sceneGraph: clonePlain(state.sceneGraph),
      expressionRecords: clonePlain(state.sceneGraph.expressionRecords),
      registryRecords: clonePlain(state.sceneGraph.registryRecords),

      f89RegistryReleaseAuthorized: readyForF89,
      f55ReleasePacketReady: readyForF89,
      f55ActivationStatus: state.f55ActivationStatus,
      f55ActivationReason: state.f55ActivationReason,

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

  function composeF55Receipt() {
    return getReceipt();
  }

  function submitF55ReleaseToRegistry(extra = {}) {
    const authority = readF89RegistryAuthority();

    if (!authority || !isFunction(authority.acceptF55ExpressionRelease)) {
      return {
        submitted: false,
        reason: "F89_REGISTRY_ACCEPT_F55_METHOD_UNAVAILABLE",
        recommendedNextFile: F89_REGISTRY_FILE,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };
    }

    try {
      const packet = composeF55ReleasePacket(extra);
      const response = authority.acceptF55ExpressionRelease(packet);

      recordLocal("F55_RELEASE_SUBMITTED_TO_F89_REGISTRY", {
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
      recordError("F55_RELEASE_SUBMISSION_TO_F89_REGISTRY_FAILED", error);

      return {
        submitted: false,
        reason: "F55_RELEASE_SUBMISSION_TO_F89_REGISTRY_FAILED",
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };
    }
  }

  function submitF55PacketToNorth(extra = {}) {
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

    const packet = composeF55ReleasePacket(extra);

    try {
      if (isFunction(north.acceptF55ExpressionPacket)) {
        return {
          submitted: true,
          response: clonePlain(north.acceptF55ExpressionPacket(packet))
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
      recordError("F55_PACKET_SUBMISSION_TO_NORTH_FAILED", error);
      return {
        submitted: false,
        reason: "F55_PACKET_SUBMISSION_TO_NORTH_FAILED"
      };
    }

    return {
      submitted: false,
      reason: "NORTH_RUNTIME_TABLE_SUPPORT_ENGINE_INTAKE_UNAVAILABLE"
    };
  }

  function validateF89RegistryReceipt(packet = {}) {
    const input = isObject(packet) ? packet : {};
    const noForbiddenClaim = !detectForbiddenClaim(input);
    const f89Recognized = Boolean(
      safeBool(input.f89RegistryReady, false) ||
      safeBool(input.registryGraphBuilt, false) ||
      safeBool(input.projectRegistryConductorActive, false) ||
      safeString(input.packetType, "").includes("F89") ||
      safeString(input.activeFibonacci || "", "") === FIBONACCI.PROJECT_REGISTRY ||
      safeString(input.activeFibonacci || "", "") === "F89"
    );

    const ok = Boolean(noForbiddenClaim && f89Recognized);

    let reason = "F89_REGISTRY_RECEIPT_ACCEPTED";
    if (!noForbiddenClaim) reason = "FORBIDDEN_CLAIM_DETECTED_IN_F89_RECEIPT";
    else if (!f89Recognized) reason = "UNRECOGNIZED_F89_REGISTRY_RECEIPT";

    return {
      ok,
      reason,
      noForbiddenClaim,
      f89Recognized,
      input: clonePlain(input)
    };
  }

  function acceptF89RegistryReceipt(packet = {}) {
    const validation = validateF89RegistryReceipt(packet);

    state.f89RegistryReceiptAccepted = validation.ok;
    state.f89RegistryReceiptPacket = clonePlain(packet);

    if (validation.input.contract) state.f89RegistryContract = safeString(validation.input.contract);
    if (validation.input.receipt) state.f89RegistryReceipt = safeString(validation.input.receipt);

    recordLocal("F89_REGISTRY_RECEIPT_RECEIVED_BY_UE5_EXPRESSION_F55", {
      accepted: validation.ok,
      reason: validation.reason,
      contract: state.f89RegistryContract
    });

    publishGlobals();

    return {
      accepted: validation.ok,
      ue5ExpressionF55ReceivedF89: true,
      reason: validation.reason,
      recommendedNextFile: validation.ok ? F144_MARKET_FILE : F89_REGISTRY_FILE,
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

  function getSceneGraph() {
    return clonePlain(state.sceneGraph);
  }

  function getSceneGraphSummary() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
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
      updatedAt: nowIso()
    };
  }

  function getExpressionRecords() {
    return clonePlain(state.sceneGraph.expressionRecords || []);
  }

  function getRegistryRecords() {
    return clonePlain(state.sceneGraph.registryRecords || []);
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

      expressionEngineF55Active: true,
      expressionEngineF55Only: true,
      expressionClerkActive: true,
      sceneGraphConductorActive: true,

      engineMechanicsPrimary: true,
      mathPrimary: true,
      architectureLabelsSecondary: true,
      mechanicalCoordinateId: MECHANICAL_COORDINATE.coordinateId,
      enginePart: MECHANICAL_COORDINATE.enginePart,
      systemCategory: MECHANICAL_COORDINATE.systemCategory,
      fibonacciStation: MECHANICAL_COORDINATE.fibonacciStage,
      mechanicalRole: MECHANICAL_COORDINATE.mechanicalRole,
      chessRole: MECHANICAL_COORDINATE.chessRole,

      f34ProductEngineObserved: state.f34ProductEngineObserved,
      f34ReleaseAccepted: state.f34ReleaseAccepted,
      f34Contract: state.f34Contract,
      f34Receipt: state.f34Receipt,

      productGraphObserved: state.productGraphObserved,
      productGraphStatus: state.productGraphStatus,
      productCount: state.productCount,
      productReadyCount: state.productReadyCount,
      productDegradedCount: state.productDegradedCount,
      productBlockedCount: state.productBlockedCount,

      sceneGraphBuilt: state.sceneGraphBuilt,
      sceneGraphReady: state.sceneGraphReady,
      sceneGraphStatus: state.sceneGraphStatus,
      sceneNodeCount: state.sceneNodeCount,
      expressionNodeCount: state.expressionNodeCount,
      registryRecordNodeCount: state.registryRecordNodeCount,
      diagnosticEvidenceNodeCount: state.diagnosticEvidenceNodeCount,

      expressionQualityMetricActive: true,
      expressionQualityScore: state.expressionQualityScore,
      expressionCoverageScore: state.expressionCoverageScore,
      expressionTraceScore: state.expressionTraceScore,
      expressionCoherenceScore: state.expressionCoherenceScore,

      f89RegistryReleaseAuthorized: state.f89RegistryReleaseAuthorized,
      f55ReleasePacketReady: state.f55ReleasePacketReady,
      f55ActivationStatus: state.f55ActivationStatus,
      f55ActivationReason: state.f55ActivationReason,

      f89RegistryReceiptAccepted: state.f89RegistryReceiptAccepted,
      f89RegistryContract: state.f89RegistryContract,
      f89RegistryReceipt: state.f89RegistryReceipt,

      newsProtocolAligned: true,
      fibonacciSynchronizationMetricActive: true,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      activeFibonacci: FIBONACCI.UE5_EXPRESSION,
      activeFibonacciRank: 55,
      activeNewsGate: NEWS_GATES.EXPRESSION,
      sourceFibonacciGate: FIBONACCI.PRODUCT_ENGINE,
      futureFibonacciGate: FIBONACCI.PROJECT_REGISTRY,
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

      ue5ExpressionF55Receipt: true,
      expressionClerkReceipt: true,

      expressionEngineOwns: [
        "F55 expression scene-graph manifold",
        "F34 product graph consumption",
        "deterministic scene graph records",
        "expression-node records",
        "registry-ready expression records",
        "F89 registry handoff packet"
      ],
      expressionEngineDoesNotOwn: [
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

      gates: {
        north: NORTH_FILE,
        productEngine: F34_PRODUCT_ENGINE_FILE,
        ue5Expression: FILE,
        registry: F89_REGISTRY_FILE,
        market: F144_MARKET_FILE,
        canvas: CANVAS_FILE
      },

      nodeTypes: clonePlain(NODE_TYPES),
      fibonacciMap: clonePlain(FIBONACCI),
      newsGates: clonePlain(NEWS_GATES),
      mechanicalCoordinate: clonePlain(MECHANICAL_COORDINATE),
      mechanicalCoordinatePacket: getMechanicalCoordinatePacket(),

      f34ReleasePacket: clonePlain(state.f34ReleasePacket),
      sceneGraph: clonePlain(state.sceneGraph),
      sceneGraphSummary: getSceneGraphSummary(),
      expressionRecords: getExpressionRecords(),
      registryRecords: getRegistryRecords(),

      expressionQuality: computeExpressionQualityMetric(),
      newsAlignment: evaluateNewsAlignment(),
      f55ReleasePacket: composeF55ReleasePacket(),
      f89RegistryReceiptPacket: clonePlain(state.f89RegistryReceiptPacket),

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

    const records = (r.expressionRecords || []).map((record) => (
      `- ${record.expressionRecordId} :: product=${record.sourceProductId} :: mode=${record.expressionMode} :: score=${record.expressionReadinessScore} :: registryReady=${record.registryReady}`
    )).join("\n") || "- none";

    const registryRecords = (r.registryRecords || []).map((record) => (
      `- ${record.registryRecordId} :: product=${record.sourceProductId} :: traceReady=${record.traceReady} :: registryReady=${record.registryReady}`
    )).join("\n") || "- none";

    const events = (r.localEvents || []).slice(-48).map((item) => (
      `- ${item.at} :: ${item.event} :: ${JSON.stringify(item.detail || {})}`
    )).join("\n") || "- none";

    const errors = (r.errors || []).map((item) => (
      `- ${item.at} :: ${item.code} :: ${item.message}`
    )).join("\n") || "- none";

    return [
      "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_ENGINE_MECHANICS_SCENE_GRAPH_CONDUCTOR_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      "",
      `expressionEngineF55Active=${r.expressionEngineF55Active}`,
      `expressionEngineF55Only=${r.expressionEngineF55Only}`,
      `expressionClerkActive=${r.expressionClerkActive}`,
      `sceneGraphConductorActive=${r.sceneGraphConductorActive}`,
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
      `f34ProductEngineObserved=${r.f34ProductEngineObserved}`,
      `f34ReleaseAccepted=${r.f34ReleaseAccepted}`,
      `f34Contract=${r.f34Contract}`,
      `f34Receipt=${r.f34Receipt}`,
      "",
      `productGraphObserved=${r.productGraphObserved}`,
      `productGraphStatus=${r.productGraphStatus}`,
      `productCount=${r.productCount}`,
      `productReadyCount=${r.productReadyCount}`,
      `productDegradedCount=${r.productDegradedCount}`,
      `productBlockedCount=${r.productBlockedCount}`,
      "",
      `sceneGraphBuilt=${r.sceneGraphBuilt}`,
      `sceneGraphReady=${r.sceneGraphReady}`,
      `sceneGraphStatus=${r.sceneGraphStatus}`,
      `sceneNodeCount=${r.sceneNodeCount}`,
      `expressionNodeCount=${r.expressionNodeCount}`,
      `registryRecordNodeCount=${r.registryRecordNodeCount}`,
      `diagnosticEvidenceNodeCount=${r.diagnosticEvidenceNodeCount}`,
      "",
      `expressionQualityScore=${r.expressionQualityScore}`,
      `expressionCoverageScore=${r.expressionCoverageScore}`,
      `expressionTraceScore=${r.expressionTraceScore}`,
      `expressionCoherenceScore=${r.expressionCoherenceScore}`,
      "",
      `f89RegistryReleaseAuthorized=${r.f89RegistryReleaseAuthorized}`,
      `f55ReleasePacketReady=${r.f55ReleasePacketReady}`,
      `f55ActivationStatus=${r.f55ActivationStatus}`,
      `f55ActivationReason=${r.f55ActivationReason}`,
      "",
      `f89RegistryReceiptAccepted=${r.f89RegistryReceiptAccepted}`,
      `f89RegistryContract=${r.f89RegistryContract}`,
      `f89RegistryReceipt=${r.f89RegistryReceipt}`,
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
      "EXPRESSION_RECORDS",
      records,
      "",
      "REGISTRY_RECORDS",
      registryRecords,
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
    setDataset("labProductEngineUE5ExpressionLoaded", "true");
    setDataset("labProductEngineUE5ExpressionContract", CONTRACT);
    setDataset("labProductEngineUE5ExpressionReceipt", RECEIPT);
    setDataset("labProductEngineUE5ExpressionVersion", VERSION);
    setDataset("labProductEngineUE5ExpressionFile", FILE);

    setDataset("ue5ExpressionF55Active", "true");
    setDataset("ue5ExpressionF55Only", "true");
    setDataset("ue5ExpressionClerkActive", "true");
    setDataset("ue5ExpressionSceneGraphConductorActive", "true");

    setDataset("ue5ExpressionEngineMechanicsPrimary", "true");
    setDataset("ue5ExpressionMathPrimary", "true");
    setDataset("ue5ExpressionArchitectureLabelsSecondary", "true");
    setDataset("ue5ExpressionMechanicalCoordinateId", MECHANICAL_COORDINATE.coordinateId);
    setDataset("ue5ExpressionEnginePart", MECHANICAL_COORDINATE.enginePart);
    setDataset("ue5ExpressionSystemCategory", MECHANICAL_COORDINATE.systemCategory);
    setDataset("ue5ExpressionFibonacciStation", MECHANICAL_COORDINATE.fibonacciStage);
    setDataset("ue5ExpressionMechanicalRole", MECHANICAL_COORDINATE.mechanicalRole);
    setDataset("ue5ExpressionChessRole", MECHANICAL_COORDINATE.chessRole);

    setDataset("ue5ExpressionF34Observed", state.f34ProductEngineObserved);
    setDataset("ue5ExpressionF34ReleaseAccepted", state.f34ReleaseAccepted);
    setDataset("ue5ExpressionProductGraphObserved", state.productGraphObserved);
    setDataset("ue5ExpressionProductGraphStatus", state.productGraphStatus);
    setDataset("ue5ExpressionProductCount", state.productCount);

    setDataset("ue5ExpressionSceneGraphBuilt", state.sceneGraphBuilt);
    setDataset("ue5ExpressionSceneGraphReady", state.sceneGraphReady);
    setDataset("ue5ExpressionSceneGraphStatus", state.sceneGraphStatus);
    setDataset("ue5ExpressionSceneNodeCount", state.sceneNodeCount);
    setDataset("ue5ExpressionExpressionNodeCount", state.expressionNodeCount);
    setDataset("ue5ExpressionRegistryRecordNodeCount", state.registryRecordNodeCount);

    setDataset("ue5ExpressionQualityScore", state.expressionQualityScore);
    setDataset("ue5ExpressionCoverageScore", state.expressionCoverageScore);
    setDataset("ue5ExpressionTraceScore", state.expressionTraceScore);
    setDataset("ue5ExpressionCoherenceScore", state.expressionCoherenceScore);

    setDataset("ue5ExpressionF89RegistryReleaseAuthorized", state.f89RegistryReleaseAuthorized);
    setDataset("ue5ExpressionF55ReleasePacketReady", state.f55ReleasePacketReady);
    setDataset("ue5ExpressionF55ActivationStatus", state.f55ActivationStatus);
    setDataset("ue5ExpressionF55ActivationReason", state.f55ActivationReason);

    setDataset("ue5ExpressionNewsProtocolAligned", "true");
    setDataset("ue5ExpressionFibonacciSynchronizationMetricActive", "true");
    setDataset("ue5ExpressionFibonacciSynchronizationScore", state.fibonacciSynchronizationScore);
    setDataset("ue5ExpressionActiveFibonacci", FIBONACCI.UE5_EXPRESSION);
    setDataset("ue5ExpressionActiveFibonacciRank", "55");
    setDataset("ue5ExpressionActiveNewsGate", NEWS_GATES.EXPRESSION);
    setDataset("ue5ExpressionSourceFibonacciGate", FIBONACCI.PRODUCT_ENGINE);
    setDataset("ue5ExpressionFutureFibonacciGate", FIBONACCI.PROJECT_REGISTRY);

    setDataset("ue5ExpressionFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("ue5ExpressionRecommendedNextFile", state.recommendedNextFile);
    setDataset("ue5ExpressionRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);

    setDataset("ue5ExpressionPublicSuperiorityClaim", "false");
    setDataset("ue5ExpressionPublicComparisonClaimAllowed", "false");
    setDataset("ue5ExpressionBenchmarkRequiredBeforePublicClaim", "true");
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

    root.DEXTER_LAB.productEngineUE5Expression = api;
    root.DEXTER_LAB.productEngineUE5ExpressionF55 = api;
    root.DEXTER_LAB.ue5ExpressionConductor = api;
    root.DEXTER_LAB.expressionClerk = api;

    root.HEARTH.productEngineUE5Expression = api;
    root.HEARTH.productEngineUE5ExpressionF55 = api;
    root.HEARTH.ue5ExpressionConductor = api;
    root.HEARTH.expressionClerk = api;

    const light = getReceiptLight();

    root.LAB_PRODUCT_ENGINE_UE5_EXPRESSION_RECEIPT = light;
    root.LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_RECEIPT = light;
    root.PRODUCT_ENGINE_UE5_EXPRESSION_RECEIPT = light;
    root.UE5_EXPRESSION_CONDUCTOR_RECEIPT = light;
    root.EXPRESSION_CLERK_RECEIPT = light;

    root.DEXTER_LAB.productEngineUE5ExpressionReceipt = light;
    root.HEARTH.productEngineUE5ExpressionReceipt = light;

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
    NODE_TYPES,
    MECHANICAL_COORDINATE,

    readF34ProductEngineAuthority,
    readF34ProductEngineRelease,
    validateF34Release,
    acceptF34Release,
    receiveF34Release,
    submitF34Release,

    normalizeProductFromF34,
    getF34Products,
    createSceneNode,
    createExpressionNode,
    createRegistryRecordNode,
    classifyExpressionClass,
    classifyExpressionMode,
    expressionReadinessScore,
    buildSceneGraph,

    computeExpressionQualityMetric,
    computeFibonacciSynchronizationMetric,
    evaluateNewsAlignment,

    readF89RegistryAuthority,
    composeF55ReleasePacket,
    composeF55Receipt,
    submitF55ReleaseToRegistry,
    submitF55PacketToNorth,

    validateF89RegistryReceipt,
    acceptF89RegistryReceipt,

    getMechanicalCoordinatePacket,
    getSceneGraph,
    getSceneGraphSummary,
    getExpressionRecords,
    getRegistryRecords,

    getReceiptLight,
    getReceipt,
    getReceiptText,
    publishGlobals,
    updateDataset,

    expressionEngineF55Active: true,
    expressionEngineF55Only: true,
    expressionClerkActive: true,
    sceneGraphConductorActive: true,

    engineMechanicsPrimary: true,
    mathPrimary: true,
    architectureLabelsSecondary: true,

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

    get state() {
      return state;
    }
  };

  state.createdAt = nowIso();
  state.updatedAt = state.createdAt;

  try {
    const f34Release = readF34ProductEngineRelease();
    if (hasMeaningfulF34Release(f34Release)) {
      acceptF34Release(f34Release);
    }
  } catch (error) {
    recordError("INITIAL_F34_RELEASE_READ_FAILED", error);
  }

  try {
    computeFibonacciSynchronizationMetric();
  } catch (error) {
    recordError("INITIAL_F55_SYNC_METRIC_FAILED", error);
  }

  recordLocal("UE5_EXPRESSION_F55_ENGINE_MECHANICS_SCENE_GRAPH_CONDUCTOR_LOADED", {
    file: FILE,
    contract: CONTRACT,
    mechanicalCoordinate: MECHANICAL_COORDINATE.coordinateId,
    targetFile: F89_REGISTRY_FILE,
    publicSuperiorityClaim: false
  });

  publishGlobals();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

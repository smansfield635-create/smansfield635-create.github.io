// /assets/lab/product-engine.ue5-expression.js
// LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_SCENE_GRAPH_CONDUCTOR_TNT_v1
// Full-file replacement.
// Product Engine UE5-derived expression conductor.
// Purpose:
// - Consume Product Engine F34 release only.
// - Stand up F55 expression conductorship as a scene-graph / product-expression planner.
// - Translate product graph readiness into deterministic expression nodes.
// - Provide UE5-derived scene organization without depending on Unreal Engine.
// - Prepare F89 registry handoff after F55 expression receipt.
// - Preserve NEWS alignment protocol and Fibonacci synchronization metric.
// - Treat “surpass UE5 / market products” as an internal target metric, not a public superiority claim.
// Does not own:
// - North F21 latch
// - Product Engine F34 authority
// - Canvas F13 evidence
// - route orchestration
// - planet truth
// - material truth
// - elevation truth
// - hydrology truth
// - actual WebGL drawing
// - generated image
// - GraphicBox
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_SCENE_GRAPH_CONDUCTOR_TNT_v1";
  const RECEIPT = "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_SCENE_GRAPH_CONDUCTOR_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "NONE_UE5_EXPRESSION_FIRST_PUBLIC_F55_CONDUCTOR";
  const BASELINE_CONTRACT = "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_SCENE_GRAPH_CONDUCTOR_BASELINE_v1";
  const VERSION = "2026-06-01.lab-product-engine-ue5-expression-f55-scene-graph-conductor-v1";

  const FILE = "/assets/lab/product-engine.ue5-expression.js";
  const PRODUCT_ENGINE_FILE = "/assets/lab/product-engine.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const REGISTRY_FILE = "/assets/lab/product-engine.registry.js";
  const MARKET_FILE = "/assets/lab/product-engine.market.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const FIBONACCI = Object.freeze({
    NORTH_ORIGIN: "F1",
    EAST_FORMATION: "F3",
    WEST_AUDIT: "F5",
    SOUTH_RETURN: "F8",
    CANVAS_EVIDENCE: "F13",
    NORTH_LATCH: "F21",
    PRODUCT_ENGINE: "F34",
    UE5_EXPRESSION: "F55",
    PROJECT_REGISTRY: "F89",
    MARKET_READINESS: "F144"
  });

  const NEWS_GATES = Object.freeze({
    NORTH: "NORTH",
    CANVAS: "CANVAS",
    PRODUCT: "PRODUCT_ENGINE",
    EXPRESSION: "UE5_EXPRESSION",
    REGISTRY: "PROJECT_REGISTRY",
    MARKET: "MARKET_READINESS"
  });

  const NODE_TYPES = Object.freeze({
    IDENTITY: "identity",
    GEOMETRY: "geometry",
    MATERIAL: "material",
    MOTION: "motion",
    INTERACTION: "interaction",
    CAMERA: "camera",
    LIGHTING: "lighting",
    AUDIO: "audio",
    UI: "ui",
    RECEIPT: "receipt",
    OPTIMIZATION: "optimization",
    EXPORT: "export"
  });

  const STATUS = Object.freeze({
    HELD: "HELD",
    ACTIVE: "ACTIVE",
    READY: "READY",
    DEGRADED: "DEGRADED",
    BLOCKED: "BLOCKED"
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    role: "product-engine-ue5-expression-f55-scene-graph-conductor",

    f55ExpressionConductorActive: true,
    f55Only: true,
    productEngineF34Required: true,
    productEngineF34Observed: false,
    productEngineF34Accepted: false,
    productEngineContract: "",
    productEngineReceipt: "",
    productEngineReleasePacket: null,

    northF21Acknowledged: false,
    canvasF13EvidenceObserved: false,
    canvasF13EvidenceComplete: false,
    canvasF13EvidenceDegraded: false,

    ue5DerivedExpressionActive: true,
    unrealEngineDependency: false,
    unrealEngineRuntimeRequired: false,
    ue5ConceptualStandardConsumed: true,
    publicSuperiorityClaim: false,
    internalSurpassTargetMetricActive: true,

    deterministicSceneGraphActive: true,
    sceneGraphBuilt: false,
    sceneGraphReady: false,
    sceneGraphStatus: STATUS.HELD,
    sceneGraphNodeCount: 0,
    sceneGraphEdgeCount: 0,
    sceneGraphReadyNodeCount: 0,
    sceneGraphDegradedNodeCount: 0,
    sceneGraphBlockedNodeCount: 0,
    sceneGraph: {
      nodes: {},
      edges: [],
      products: [],
      buildId: "",
      builtAt: ""
    },

    expressionNodeRegistryActive: true,
    expressionNodes: {},
    expressionPlans: {},

    expressionQualityMetricActive: true,
    expressionQualityScore: 0,
    internalMarketSurpassTargetScore: 0,
    lodBudgetMetricActive: true,
    lodBudgetScore: 0,
    determinismScore: 100,
    receiptTraceScore: 0,

    projectRegistryGateReady: false,
    f89RegistryReleaseAuthorized: false,
    f89RegistryReceiptAccepted: false,

    newsProtocolAligned: true,
    fibonacciSynchronizationMetricActive: true,
    fibonacciSynchronizationScore: 0,
    activeFibonacci: FIBONACCI.UE5_EXPRESSION,
    activeFibonacciRank: 55,
    activeNewsGate: NEWS_GATES.EXPRESSION,
    sourceFibonacciGate: FIBONACCI.PRODUCT_ENGINE,
    futureFibonacciGate: FIBONACCI.PROJECT_REGISTRY,
    oneActiveGearAtATime: true,

    f55ActivationStatus: STATUS.HELD,
    f55ActivationReason: "WAITING_PRODUCT_ENGINE_F34_RELEASE",
    f55ReceiptReady: true,
    f55ReleasePacketReady: false,

    firstFailedCoordinate: "WAITING_PRODUCT_ENGINE_F34_RELEASE",
    recommendedNextFile: PRODUCT_ENGINE_FILE,
    recommendedNextRenewalTarget: PRODUCT_ENGINE_FILE,

    localEvents: [],
    errors: [],

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

  function trim(list, max = 140) {
    if (Array.isArray(list) && list.length > max) {
      list.splice(0, list.length - max);
    }
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
      code: safeString(code, "UE5_EXPRESSION_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trim(state.errors);
    state.updatedAt = item.at;
    updateDataset();

    return item;
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

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
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
      text.includes('"generatedImage":true') ||
      text.includes('"graphicBox":true') ||
      text.includes('"webGL":true') ||
      text.includes('"visualPassClaimed":true') ||
      text.includes("visualPassClaimed=true")
    );
  }

  function readProductEngineAuthority() {
    return firstGlobal([
      "LAB_PRODUCT_ENGINE",
      "LAB_PRODUCT_ENGINE_F34",
      "PRODUCT_ENGINE",
      "DEXTER_LAB.productEngine",
      "DEXTER_LAB.productEngineF34",
      "HEARTH.productEngine",
      "HEARTH.productEngineF34"
    ]);
  }

  function readProductEngineReceipt() {
    const authority = readProductEngineAuthority();
    const receipt = readReceipt(authority);

    if (receipt && Object.keys(receipt).length) {
      state.productEngineF34Observed = true;
      state.productEngineContract = safeString(receipt.contract, "");
      state.productEngineReceipt = safeString(receipt.receipt, "");
      state.northF21Acknowledged = safeBool(receipt.northF21Acknowledged, state.northF21Acknowledged);
      state.canvasF13EvidenceObserved = safeBool(receipt.canvasF13EvidenceObserved, state.canvasF13EvidenceObserved);
      state.canvasF13EvidenceComplete = safeBool(receipt.canvasF13EvidenceComplete, state.canvasF13EvidenceComplete);
      state.canvasF13EvidenceDegraded = safeBool(receipt.canvasF13EvidenceDegraded, state.canvasF13EvidenceDegraded);
    }

    return receipt || {};
  }

  function productEngineGraphFromReceipt(receipt = {}) {
    if (isObject(receipt.productGraph) && Array.isArray(receipt.productGraph.products)) {
      return receipt.productGraph.products.slice();
    }

    if (Array.isArray(receipt.products)) return receipt.products.slice();

    return [];
  }

  function validateF34Release(packet = {}) {
    const input = isObject(packet) && Object.keys(packet).length ? packet : readProductEngineReceipt();
    const noForbiddenClaim = !detectForbiddenClaim(input);

    const f34ReleasePacket = isObject(input.f34ReleasePacket) ? input.f34ReleasePacket : input;
    const activeFibonacci = safeString(f34ReleasePacket.activeFibonacci || input.activeFibonacci, "");
    const futureFibonacciGate = safeString(f34ReleasePacket.futureFibonacciGate || input.futureFibonacciGate, "");
    const productEngineReady = safeBool(f34ReleasePacket.productEngineF34Ready, safeBool(input.productEngineF34Ready, false));
    const productEngineActive = safeBool(f34ReleasePacket.productEngineF34Active, safeBool(input.productEngineActive, false));
    const releaseAuthorized = safeBool(f34ReleasePacket.ue5ExpressionReleaseAuthorized, false);
    const f34ReleasePacketReady = safeBool(input.f34ReleasePacketReady, safeBool(f34ReleasePacket.productEngineF34Active, false));

    const ok = Boolean(
      noForbiddenClaim &&
      (
        productEngineReady ||
        productEngineActive ||
        releaseAuthorized ||
        f34ReleasePacketReady
      ) &&
      (
        activeFibonacci === FIBONACCI.PRODUCT_ENGINE ||
        activeFibonacci === "F34" ||
        safeBool(input.productEngineF34Only, false)
      ) &&
      (
        futureFibonacciGate === FIBONACCI.UE5_EXPRESSION ||
        futureFibonacciGate === "F55" ||
        releaseAuthorized ||
        f34ReleasePacketReady
      )
    );

    let reason = "NONE_PRODUCT_ENGINE_F34_ACCEPTED";

    if (!noForbiddenClaim) reason = "FORBIDDEN_CLAIM_DETECTED_IN_PRODUCT_ENGINE_PACKET";
    else if (!productEngineReady && !productEngineActive && !releaseAuthorized && !f34ReleasePacketReady) {
      reason = "WAITING_PRODUCT_ENGINE_F34_RELEASE";
    } else if (activeFibonacci && activeFibonacci !== FIBONACCI.PRODUCT_ENGINE && activeFibonacci !== "F34") {
      reason = "PRODUCT_ENGINE_FIBONACCI_NOT_F34";
    } else if (futureFibonacciGate && futureFibonacciGate !== FIBONACCI.UE5_EXPRESSION && futureFibonacciGate !== "F55") {
      reason = "PRODUCT_ENGINE_FUTURE_GATE_NOT_F55";
    }

    return {
      ok,
      reason,
      input: clonePlain(input),
      f34ReleasePacket: clonePlain(f34ReleasePacket),
      products: productEngineGraphFromReceipt(input),
      activeFibonacci,
      futureFibonacciGate,
      productEngineReady,
      productEngineActive,
      releaseAuthorized,
      f34ReleasePacketReady,
      noForbiddenClaim
    };
  }

  function acceptF34Release(packet = {}) {
    const validation = validateF34Release(packet);

    state.productEngineF34Accepted = validation.ok;
    state.productEngineReleasePacket = clonePlain(validation.f34ReleasePacket);
    state.productEngineF34Observed = true;

    if (validation.input.contract) state.productEngineContract = safeString(validation.input.contract);
    if (validation.input.receipt) state.productEngineReceipt = safeString(validation.input.receipt);

    state.northF21Acknowledged = safeBool(validation.input.northF21Acknowledged, state.northF21Acknowledged);
    state.canvasF13EvidenceObserved = safeBool(validation.input.canvasF13EvidenceObserved, state.canvasF13EvidenceObserved);
    state.canvasF13EvidenceComplete = safeBool(validation.input.canvasF13EvidenceComplete, state.canvasF13EvidenceComplete);
    state.canvasF13EvidenceDegraded = safeBool(validation.input.canvasF13EvidenceDegraded, state.canvasF13EvidenceDegraded);

    if (validation.ok) {
      state.f55ActivationStatus = STATUS.ACTIVE;
      state.f55ActivationReason = "PRODUCT_ENGINE_F34_RELEASE_ACCEPTED_UE5_EXPRESSION_F55_ACTIVE";
      state.firstFailedCoordinate = "NONE_UE5_EXPRESSION_F55_ACTIVE";
      state.recommendedNextFile = REGISTRY_FILE;
      state.recommendedNextRenewalTarget = REGISTRY_FILE;

      validation.products.forEach((product) => registerProductExpression(product, { silent: true }));

      recordLocal("PRODUCT_ENGINE_F34_RELEASE_ACCEPTED_BY_UE5_EXPRESSION", {
        productCount: validation.products.length,
        productEngineContract: state.productEngineContract,
        f34ReleasePacketReady: validation.f34ReleasePacketReady
      });
    } else {
      state.f55ActivationStatus = STATUS.HELD;
      state.f55ActivationReason = validation.reason;
      state.firstFailedCoordinate = validation.reason;
      state.recommendedNextFile = PRODUCT_ENGINE_FILE;
      state.recommendedNextRenewalTarget = PRODUCT_ENGINE_FILE;

      recordLocal("PRODUCT_ENGINE_F34_RELEASE_HELD_BY_UE5_EXPRESSION", {
        reason: validation.reason
      });
    }

    buildSceneGraph({ silent: true });
    computeFibonacciSynchronizationMetric();
    publishGlobals();
    updateDataset();

    return {
      accepted: validation.ok,
      ue5ExpressionF55Active: validation.ok,
      reason: validation.reason,
      productCountImported: validation.products.length,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function makeId(value, fallback = "node") {
    const raw = safeString(value || fallback, fallback)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return raw || fallback;
  }

  function normalizeExpressionNode(definition = {}) {
    const source = isObject(definition) ? definition : {};
    const productId = makeId(source.productId || source.sourceProductId || source.product || "global", "global");
    const type = safeString(source.type || source.nodeType || NODE_TYPES.IDENTITY, NODE_TYPES.IDENTITY);
    const id = makeId(source.id || `${productId}-${type}-${Object.keys(state.expressionNodes).length + 1}`, `${productId}-${type}`);

    return {
      id,
      type,
      productId,
      label: safeString(source.label || source.name || id),
      role: safeString(source.role || type),
      file: safeString(source.file || ""),
      route: safeString(source.route || ""),
      contract: safeString(source.contract || ""),
      receipt: safeString(source.receipt || ""),
      priority: clamp(source.priority ?? 50, 0, 100),
      lodBand: clamp(source.lodBand ?? 2, 0, 5),
      deterministicSeed: safeNumber(source.deterministicSeed ?? id.length * 233, 0),
      geometryClass: safeString(source.geometryClass || "scene-graph-placeholder"),
      materialClass: safeString(source.materialClass || "receipt-bound-material"),
      motionClass: safeString(source.motionClass || "static-until-runtime-release"),
      interactionClass: safeString(source.interactionClass || "inspection-ready"),
      lightingClass: safeString(source.lightingClass || "neutral-expression-lighting"),
      cameraClass: safeString(source.cameraClass || "bounded-inspection-camera"),
      optimizationClass: safeString(source.optimizationClass || "lod-budgeted"),
      dependencies: Array.isArray(source.dependencies) ? source.dependencies.slice() : [],
      constraints: Array.isArray(source.constraints) ? source.constraints.slice() : [],
      platformReady: safeBool(source.platformReady, false),
      engineeringReady: safeBool(source.engineeringReady, false),
      expressionReady: safeBool(source.expressionReady, false),
      registryReady: safeBool(source.registryReady, false),
      receiptReady: safeBool(source.receiptReady, Boolean(source.contract || source.receipt)),
      ownsRendering: false,
      ownsWebGL: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      createdAt: safeString(source.createdAt || nowIso()),
      updatedAt: nowIso()
    };
  }

  function evaluateExpressionNode(node = {}) {
    const item = normalizeExpressionNode(node);
    const missing = [];

    if (!state.productEngineF34Accepted) missing.push("productEngineF34Accepted");
    if (!item.id) missing.push("id");
    if (!item.type) missing.push("type");
    if (!item.productId) missing.push("productId");
    if (!item.receiptReady) missing.push("receiptReady");
    if (!item.platformReady) missing.push("platformReady");
    if (!item.engineeringReady) missing.push("engineeringReady");

    const readinessScore = clamp(
      (state.productEngineF34Accepted ? 18 : 0) +
      (item.id ? 8 : 0) +
      (item.type ? 8 : 0) +
      (item.productId ? 8 : 0) +
      (item.receiptReady ? 12 : 0) +
      (item.platformReady ? 14 : 0) +
      (item.engineeringReady ? 14 : 0) +
      (item.expressionReady ? 10 : 0) +
      (item.dependencies.length >= 0 ? 4 : 0) +
      (item.lodBand >= 0 ? 4 : 0),
      0,
      100
    );

    const status =
      missing.includes("productEngineF34Accepted")
        ? STATUS.HELD
        : missing.includes("receiptReady")
          ? STATUS.BLOCKED
          : readinessScore >= 86
            ? STATUS.READY
            : readinessScore >= 62
              ? STATUS.DEGRADED
              : STATUS.HELD;

    return {
      ...item,
      readinessScore,
      status,
      missing,
      f55ExpressionNodeEvaluated: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      evaluatedAt: nowIso()
    };
  }

  function registerExpressionNode(definition = {}) {
    const evaluated = evaluateExpressionNode(definition);
    state.expressionNodes[evaluated.id] = evaluated;

    recordLocal("EXPRESSION_NODE_REGISTERED", {
      id: evaluated.id,
      productId: evaluated.productId,
      type: evaluated.type,
      status: evaluated.status,
      readinessScore: evaluated.readinessScore
    });

    buildSceneGraph({ silent: true });
    computeFibonacciSynchronizationMetric();
    publishGlobals();
    updateDataset();

    return evaluated;
  }

  function registerProductExpression(product = {}, options = {}) {
    const p = isObject(product) ? product : {};
    const productId = makeId(p.id || p.key || p.name || `product-${Object.keys(state.expressionNodes).length + 1}`, "product");
    const name = safeString(p.name || p.label || productId);

    const base = {
      productId,
      file: safeString(p.file || ""),
      route: safeString(p.route || ""),
      contract: safeString(p.contract || ""),
      receipt: safeString(p.receipt || ""),
      platformReady: safeBool(p.platformReady, false),
      engineeringReady: safeBool(p.engineeringReady, false),
      expressionReady: safeBool(p.expressionReady, false),
      registryReady: safeBool(p.registryReady, false),
      receiptReady: safeBool(p.receiptReady, Boolean(p.contract || p.receipt))
    };

    const nodes = [
      registerExpressionNode({
        ...base,
        id: `${productId}-identity`,
        label: `${name} Identity Node`,
        type: NODE_TYPES.IDENTITY,
        role: "product-identity-root",
        priority: 92,
        lodBand: 0
      }),
      registerExpressionNode({
        ...base,
        id: `${productId}-geometry`,
        label: `${name} Geometry Node`,
        type: NODE_TYPES.GEOMETRY,
        role: "bounded-product-form",
        priority: 84,
        lodBand: 1,
        dependencies: [`${productId}-identity`]
      }),
      registerExpressionNode({
        ...base,
        id: `${productId}-material`,
        label: `${name} Material Node`,
        type: NODE_TYPES.MATERIAL,
        role: "receipt-bound-material-expression",
        priority: 78,
        lodBand: 2,
        dependencies: [`${productId}-identity`, `${productId}-geometry`]
      }),
      registerExpressionNode({
        ...base,
        id: `${productId}-interaction`,
        label: `${name} Interaction Node`,
        type: NODE_TYPES.INTERACTION,
        role: "inspection-interaction-contract",
        priority: 72,
        lodBand: 2,
        dependencies: [`${productId}-identity`]
      }),
      registerExpressionNode({
        ...base,
        id: `${productId}-optimization`,
        label: `${name} Optimization Node`,
        type: NODE_TYPES.OPTIMIZATION,
        role: "lod-budget-stability",
        priority: 66,
        lodBand: 3,
        dependencies: [`${productId}-geometry`, `${productId}-material`]
      }),
      registerExpressionNode({
        ...base,
        id: `${productId}-receipt`,
        label: `${name} Receipt Node`,
        type: NODE_TYPES.RECEIPT,
        role: "audit-trace-export",
        priority: 60,
        lodBand: 5,
        dependencies: [`${productId}-identity`]
      })
    ];

    if (options.silent !== true) {
      recordLocal("PRODUCT_EXPRESSION_REGISTERED", {
        productId,
        nodeCount: nodes.length
      });
    }

    return nodes;
  }

  function evaluateAllExpressionNodes() {
    const evaluated = {};

    Object.keys(state.expressionNodes).forEach((id) => {
      evaluated[id] = evaluateExpressionNode(state.expressionNodes[id]);
    });

    state.expressionNodes = evaluated;

    return Object.values(state.expressionNodes);
  }

  function buildSceneGraph(options = {}) {
    const nodes = evaluateAllExpressionNodes();
    const edges = [];

    nodes.forEach((node) => {
      node.dependencies.forEach((dependency) => {
        edges.push({
          from: dependency,
          to: node.id,
          type: "dependency",
          productId: node.productId,
          deterministic: true
        });
      });
    });

    const sortedNodes = nodes.slice().sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      if (a.lodBand !== b.lodBand) return a.lodBand - b.lodBand;
      return a.id.localeCompare(b.id);
    });

    const products = Array.from(new Set(sortedNodes.map((node) => node.productId))).sort();

    state.sceneGraph = {
      nodes: sortedNodes.reduce((acc, node) => {
        acc[node.id] = node;
        return acc;
      }, {}),
      edges,
      products,
      buildId: `f55-scene-graph-${products.length}-${sortedNodes.length}-${edges.length}`,
      builtAt: nowIso()
    };

    state.sceneGraphBuilt = true;
    state.sceneGraphNodeCount = sortedNodes.length;
    state.sceneGraphEdgeCount = edges.length;
    state.sceneGraphReadyNodeCount = sortedNodes.filter((node) => node.status === STATUS.READY).length;
    state.sceneGraphDegradedNodeCount = sortedNodes.filter((node) => node.status === STATUS.DEGRADED).length;
    state.sceneGraphBlockedNodeCount = sortedNodes.filter((node) => node.status === STATUS.BLOCKED || node.status === STATUS.HELD).length;

    state.sceneGraphReady = Boolean(
      state.productEngineF34Accepted &&
      state.sceneGraphNodeCount > 0 &&
      state.sceneGraphBlockedNodeCount === 0
    );

    if (state.sceneGraphReady) {
      state.sceneGraphStatus = STATUS.READY;
      state.f55ActivationStatus = STATUS.READY;
      state.f55ActivationReason = "UE5_EXPRESSION_F55_SCENE_GRAPH_READY";
      state.f55ReleasePacketReady = true;
      state.f89RegistryReleaseAuthorized = true;
      state.projectRegistryGateReady = true;
      state.firstFailedCoordinate = "NONE_UE5_EXPRESSION_F55_SCENE_GRAPH_READY";
      state.recommendedNextFile = REGISTRY_FILE;
      state.recommendedNextRenewalTarget = REGISTRY_FILE;
    } else if (state.productEngineF34Accepted && state.sceneGraphNodeCount > 0) {
      state.sceneGraphStatus = STATUS.DEGRADED;
      state.f55ActivationStatus = STATUS.DEGRADED;
      state.f55ActivationReason = "UE5_EXPRESSION_F55_SCENE_GRAPH_DEGRADED";
      state.f55ReleasePacketReady = true;
      state.f89RegistryReleaseAuthorized = true;
      state.projectRegistryGateReady = true;
      state.firstFailedCoordinate = "NONE_UE5_EXPRESSION_F55_DEGRADED_REGISTRY_RELEASE_AVAILABLE";
      state.recommendedNextFile = REGISTRY_FILE;
      state.recommendedNextRenewalTarget = REGISTRY_FILE;
    } else {
      state.sceneGraphStatus = STATUS.HELD;
      state.f55ActivationStatus = STATUS.HELD;
      state.f55ActivationReason = state.productEngineF34Accepted ? "WAITING_EXPRESSION_NODES" : "WAITING_PRODUCT_ENGINE_F34_RELEASE";
      state.f55ReleasePacketReady = false;
      state.f89RegistryReleaseAuthorized = false;
      state.projectRegistryGateReady = false;
      state.firstFailedCoordinate = state.f55ActivationReason;
      state.recommendedNextFile = state.productEngineF34Accepted ? FILE : PRODUCT_ENGINE_FILE;
      state.recommendedNextRenewalTarget = state.recommendedNextFile;
    }

    computeExpressionQualityMetric();
    computeFibonacciSynchronizationMetric();

    if (options.silent !== true) {
      recordLocal("F55_SCENE_GRAPH_BUILT", {
        nodeCount: state.sceneGraphNodeCount,
        edgeCount: state.sceneGraphEdgeCount,
        ready: state.sceneGraphReady,
        status: state.sceneGraphStatus
      });
    }

    updateDataset();
    return clonePlain(state.sceneGraph);
  }

  function computeExpressionQualityMetric() {
    const nodeCount = Math.max(1, state.sceneGraphNodeCount);
    const readyRatio = state.sceneGraphReadyNodeCount / nodeCount;
    const degradedRatio = state.sceneGraphDegradedNodeCount / nodeCount;
    const blockedRatio = state.sceneGraphBlockedNodeCount / nodeCount;

    state.lodBudgetScore = clamp(
      62 +
      Math.min(20, state.sceneGraphNodeCount * 1.6) +
      Math.min(10, state.sceneGraphEdgeCount * 0.8) -
      Math.min(24, state.sceneGraphBlockedNodeCount * 4),
      0,
      100
    );

    state.receiptTraceScore = clamp(
      40 +
      Math.min(40, Object.values(state.expressionNodes).filter((node) => node.receiptReady).length * 6) +
      (state.productEngineF34Accepted ? 12 : 0) +
      (state.f55ReceiptReady ? 8 : 0),
      0,
      100
    );

    state.expressionQualityScore = clamp(
      Math.round(
        (readyRatio * 54) +
        (degradedRatio * 24) -
        (blockedRatio * 36) +
        (state.lodBudgetScore * 0.12) +
        (state.determinismScore * 0.08) +
        (state.receiptTraceScore * 0.10)
      ),
      0,
      100
    );

    state.internalMarketSurpassTargetScore = clamp(
      Math.round(
        (state.expressionQualityScore * 0.34) +
        (state.lodBudgetScore * 0.22) +
        (state.determinismScore * 0.18) +
        (state.receiptTraceScore * 0.16) +
        (state.fibonacciSynchronizationScore * 0.10)
      ),
      0,
      100
    );

    return {
      expressionQualityScore: state.expressionQualityScore,
      lodBudgetScore: state.lodBudgetScore,
      determinismScore: state.determinismScore,
      receiptTraceScore: state.receiptTraceScore,
      internalMarketSurpassTargetScore: state.internalMarketSurpassTargetScore,
      publicSuperiorityClaim: false
    };
  }

  function computeFibonacciSynchronizationMetric() {
    const checks = [
      state.newsProtocolAligned,
      state.oneActiveGearAtATime,
      state.activeFibonacci === FIBONACCI.UE5_EXPRESSION,
      state.sourceFibonacciGate === FIBONACCI.PRODUCT_ENGINE,
      state.futureFibonacciGate === FIBONACCI.PROJECT_REGISTRY,
      state.activeNewsGate === NEWS_GATES.EXPRESSION,
      state.productEngineF34Observed,
      state.productEngineF34Accepted,
      state.f55ExpressionConductorActive,
      state.ue5DerivedExpressionActive,
      state.sceneGraphBuilt,
      state.deterministicSceneGraphActive,
      state.expressionQualityMetricActive,
      state.lodBudgetMetricActive,
      state.f55ReceiptReady,
      !state.unrealEngineDependency,
      !state.publicSuperiorityClaim,
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
      futureFibonacciGate: FIBONACCI.PROJECT_REGISTRY
    };
  }

  function createExpressionPlan(input = {}) {
    const source = isObject(input) ? input : {};
    const graph = buildSceneGraph({ silent: true });

    const plan = {
      contract: CONTRACT,
      receipt: RECEIPT,
      planContract: "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_PLAN_v1",
      planReceipt: "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_PLAN_RECEIPT_v1",
      sourceFile: FILE,
      targetFile: REGISTRY_FILE,

      productEngineF34Accepted: state.productEngineF34Accepted,
      ue5ExpressionF55Current: state.sceneGraphBuilt,
      sceneGraphReady: state.sceneGraphReady,
      sceneGraphStatus: state.sceneGraphStatus,
      buildId: graph.buildId,
      nodeCount: state.sceneGraphNodeCount,
      edgeCount: state.sceneGraphEdgeCount,
      productCount: graph.products.length,

      expressionQualityScore: state.expressionQualityScore,
      lodBudgetScore: state.lodBudgetScore,
      internalMarketSurpassTargetScore: state.internalMarketSurpassTargetScore,
      publicSuperiorityClaim: false,

      executionMode: "plan-only-no-webgl-no-render-claim",
      deterministicSceneGraphActive: true,
      unrealEngineDependency: false,
      ue5ConceptualStandardConsumed: true,

      input: clonePlain(source),

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      createdAt: nowIso()
    };

    const id = safeString(source.id || source.planId || `expression-plan-${Object.keys(state.expressionPlans).length + 1}`);
    state.expressionPlans[id] = plan;

    updateDataset();
    return clonePlain(plan);
  }

  function evaluateNewsAlignment() {
    const metric = computeFibonacciSynchronizationMetric();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      newsAlignmentContract: "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_NEWS_ALIGNMENT_PROTOCOL_v1",
      newsAlignmentReceipt: "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_NEWS_ALIGNMENT_PROTOCOL_RECEIPT_v1",
      sequence: [
        {
          gate: NEWS_GATES.PRODUCT,
          fibonacci: FIBONACCI.PRODUCT_ENGINE,
          file: PRODUCT_ENGINE_FILE,
          ready: state.productEngineF34Accepted
        },
        {
          gate: NEWS_GATES.EXPRESSION,
          fibonacci: FIBONACCI.UE5_EXPRESSION,
          file: FILE,
          ready: state.sceneGraphBuilt
        },
        {
          gate: NEWS_GATES.REGISTRY,
          fibonacci: FIBONACCI.PROJECT_REGISTRY,
          file: REGISTRY_FILE,
          ready: state.f89RegistryReleaseAuthorized
        },
        {
          gate: NEWS_GATES.MARKET,
          fibonacci: FIBONACCI.MARKET_READINESS,
          file: MARKET_FILE,
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

  function composeF55Receipt() {
    return getReceipt();
  }

  function composeF55ReleasePacket(extra = {}) {
    const metric = computeFibonacciSynchronizationMetric();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "UE5_EXPRESSION_F55_RELEASE_PACKET",
      sourceFile: FILE,
      targetFile: REGISTRY_FILE,
      destinationFile: REGISTRY_FILE,

      activeFibonacci: FIBONACCI.UE5_EXPRESSION,
      activeFibonacciRank: 55,
      activeNewsGate: NEWS_GATES.EXPRESSION,
      sourceFibonacciGate: FIBONACCI.PRODUCT_ENGINE,
      futureFibonacciGate: FIBONACCI.PROJECT_REGISTRY,
      futureFibonacciRank: 89,

      productEngineF34Accepted: state.productEngineF34Accepted,
      ue5ExpressionF55Current: state.sceneGraphBuilt,
      expressionConductorReady: state.sceneGraphReady || state.sceneGraphStatus === STATUS.DEGRADED,
      f55ExpressionReady: state.sceneGraphReady || state.sceneGraphStatus === STATUS.DEGRADED,
      sceneGraphConductorReady: state.sceneGraphReady || state.sceneGraphStatus === STATUS.DEGRADED,
      f89RegistryReleaseAuthorized: state.f89RegistryReleaseAuthorized,

      sceneGraphBuilt: state.sceneGraphBuilt,
      sceneGraphReady: state.sceneGraphReady,
      sceneGraphStatus: state.sceneGraphStatus,
      sceneGraphNodeCount: state.sceneGraphNodeCount,
      sceneGraphEdgeCount: state.sceneGraphEdgeCount,
      expressionQualityScore: state.expressionQualityScore,
      internalMarketSurpassTargetScore: state.internalMarketSurpassTargetScore,
      publicSuperiorityClaim: false,

      newsProtocolAligned: true,
      fibonacciSynchronizationMetricActive: true,
      fibonacciSynchronizationScore: metric.score,
      oneActiveGearAtATime: true,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      detail: clonePlain(extra),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      composedAt: nowIso()
    };
  }

  function submitF55ReceiptToProductEngine() {
    const authority = readProductEngineAuthority();

    if (!authority || !isFunction(authority.acceptUE5ExpressionF55Receipt)) {
      return {
        submitted: false,
        reason: "PRODUCT_ENGINE_ACCEPT_METHOD_UNAVAILABLE",
        recommendedNextFile: PRODUCT_ENGINE_FILE,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };
    }

    try {
      const response = authority.acceptUE5ExpressionF55Receipt(composeF55ReleasePacket());
      recordLocal("F55_RECEIPT_SUBMITTED_TO_PRODUCT_ENGINE", {
        submitted: true
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
      recordError("F55_SUBMISSION_TO_PRODUCT_ENGINE_FAILED", error);
      return {
        submitted: false,
        reason: "F55_SUBMISSION_TO_PRODUCT_ENGINE_FAILED",
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };
    }
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
      role: state.role,

      f55ExpressionConductorActive: true,
      f55Only: true,
      productEngineF34Required: true,
      productEngineF34Observed: state.productEngineF34Observed,
      productEngineF34Accepted: state.productEngineF34Accepted,
      productEngineContract: state.productEngineContract,
      productEngineReceipt: state.productEngineReceipt,

      northF21Acknowledged: state.northF21Acknowledged,
      canvasF13EvidenceObserved: state.canvasF13EvidenceObserved,
      canvasF13EvidenceComplete: state.canvasF13EvidenceComplete,
      canvasF13EvidenceDegraded: state.canvasF13EvidenceDegraded,

      ue5DerivedExpressionActive: true,
      unrealEngineDependency: false,
      unrealEngineRuntimeRequired: false,
      ue5ConceptualStandardConsumed: true,
      publicSuperiorityClaim: false,
      internalSurpassTargetMetricActive: true,

      deterministicSceneGraphActive: true,
      expressionNodeRegistryActive: true,
      sceneGraphBuilt: state.sceneGraphBuilt,
      sceneGraphReady: state.sceneGraphReady,
      sceneGraphStatus: state.sceneGraphStatus,
      sceneGraphNodeCount: state.sceneGraphNodeCount,
      sceneGraphEdgeCount: state.sceneGraphEdgeCount,
      sceneGraphReadyNodeCount: state.sceneGraphReadyNodeCount,
      sceneGraphDegradedNodeCount: state.sceneGraphDegradedNodeCount,
      sceneGraphBlockedNodeCount: state.sceneGraphBlockedNodeCount,

      expressionQualityMetricActive: true,
      expressionQualityScore: state.expressionQualityScore,
      lodBudgetMetricActive: true,
      lodBudgetScore: state.lodBudgetScore,
      determinismScore: state.determinismScore,
      receiptTraceScore: state.receiptTraceScore,
      internalMarketSurpassTargetScore: state.internalMarketSurpassTargetScore,

      projectRegistryGateReady: state.projectRegistryGateReady,
      f89RegistryReleaseAuthorized: state.f89RegistryReleaseAuthorized,
      f89RegistryReceiptAccepted: state.f89RegistryReceiptAccepted,

      newsProtocolAligned: true,
      fibonacciSynchronizationMetricActive: true,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      activeFibonacci: FIBONACCI.UE5_EXPRESSION,
      activeFibonacciRank: 55,
      activeNewsGate: NEWS_GATES.EXPRESSION,
      sourceFibonacciGate: FIBONACCI.PRODUCT_ENGINE,
      futureFibonacciGate: FIBONACCI.PROJECT_REGISTRY,
      oneActiveGearAtATime: true,

      f55ActivationStatus: state.f55ActivationStatus,
      f55ActivationReason: state.f55ActivationReason,
      f55ReceiptReady: true,
      f55ReleasePacketReady: state.f55ReleasePacketReady,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

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

      ue5ExpressionReceipt: true,
      expressionConductorOwns: [
        "F55 expression conductorship",
        "deterministic scene graph",
        "product-expression node registry",
        "LOD budget metric",
        "expression quality metric",
        "internal market-surpass target metric",
        "F89 registry handoff packet",
        "NEWS/Fibonacci synchronization metric"
      ],
      expressionConductorDoesNotOwn: [
        "North F21 latch",
        "Product Engine F34 authority",
        "Canvas F13 evidence",
        "route orchestration",
        "planet truth",
        "material truth",
        "elevation truth",
        "hydrology truth",
        "actual WebGL drawing",
        "generated image",
        "GraphicBox",
        "final visual pass claim"
      ],

      gates: {
        north: NORTH_FILE,
        productEngine: PRODUCT_ENGINE_FILE,
        ue5Expression: FILE,
        registry: REGISTRY_FILE,
        market: MARKET_FILE
      },

      nodeTypes: clonePlain(NODE_TYPES),
      fibonacciMap: clonePlain(FIBONACCI),
      newsGates: clonePlain(NEWS_GATES),
      sceneGraph: clonePlain(state.sceneGraph),
      expressionNodes: clonePlain(Object.values(state.expressionNodes)),
      expressionPlans: clonePlain(Object.values(state.expressionPlans)),
      newsAlignment: evaluateNewsAlignment(),
      f55ReleasePacket: composeF55ReleasePacket(),
      productEngineReleasePacket: clonePlain(state.productEngineReleasePacket),

      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function getReceiptText() {
    const r = getReceipt();

    const nodes = (r.expressionNodes || []).map((node) => (
      `- ${node.id} :: product=${node.productId} :: type=${node.type} :: status=${node.status} :: score=${node.readinessScore}`
    )).join("\n") || "- none";

    const events = (r.localEvents || []).slice(-40).map((item) => (
      `- ${item.at} :: ${item.event} :: ${JSON.stringify(item.detail || {})}`
    )).join("\n") || "- none";

    const errors = (r.errors || []).map((item) => (
      `- ${item.at} :: ${item.code} :: ${item.message}`
    )).join("\n") || "- none";

    return [
      "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_SCENE_GRAPH_CONDUCTOR_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `role=${r.role}`,
      "",
      `f55ExpressionConductorActive=${r.f55ExpressionConductorActive}`,
      `f55Only=${r.f55Only}`,
      `productEngineF34Required=${r.productEngineF34Required}`,
      `productEngineF34Observed=${r.productEngineF34Observed}`,
      `productEngineF34Accepted=${r.productEngineF34Accepted}`,
      `productEngineContract=${r.productEngineContract}`,
      `productEngineReceipt=${r.productEngineReceipt}`,
      "",
      `northF21Acknowledged=${r.northF21Acknowledged}`,
      `canvasF13EvidenceObserved=${r.canvasF13EvidenceObserved}`,
      `canvasF13EvidenceComplete=${r.canvasF13EvidenceComplete}`,
      `canvasF13EvidenceDegraded=${r.canvasF13EvidenceDegraded}`,
      "",
      `ue5DerivedExpressionActive=${r.ue5DerivedExpressionActive}`,
      `unrealEngineDependency=${r.unrealEngineDependency}`,
      `unrealEngineRuntimeRequired=${r.unrealEngineRuntimeRequired}`,
      `ue5ConceptualStandardConsumed=${r.ue5ConceptualStandardConsumed}`,
      `publicSuperiorityClaim=${r.publicSuperiorityClaim}`,
      `internalSurpassTargetMetricActive=${r.internalSurpassTargetMetricActive}`,
      "",
      `deterministicSceneGraphActive=${r.deterministicSceneGraphActive}`,
      `sceneGraphBuilt=${r.sceneGraphBuilt}`,
      `sceneGraphReady=${r.sceneGraphReady}`,
      `sceneGraphStatus=${r.sceneGraphStatus}`,
      `sceneGraphNodeCount=${r.sceneGraphNodeCount}`,
      `sceneGraphEdgeCount=${r.sceneGraphEdgeCount}`,
      `sceneGraphReadyNodeCount=${r.sceneGraphReadyNodeCount}`,
      `sceneGraphDegradedNodeCount=${r.sceneGraphDegradedNodeCount}`,
      `sceneGraphBlockedNodeCount=${r.sceneGraphBlockedNodeCount}`,
      "",
      `expressionQualityScore=${r.expressionQualityScore}`,
      `lodBudgetScore=${r.lodBudgetScore}`,
      `determinismScore=${r.determinismScore}`,
      `receiptTraceScore=${r.receiptTraceScore}`,
      `internalMarketSurpassTargetScore=${r.internalMarketSurpassTargetScore}`,
      "",
      `projectRegistryGateReady=${r.projectRegistryGateReady}`,
      `f89RegistryReleaseAuthorized=${r.f89RegistryReleaseAuthorized}`,
      `f89RegistryReceiptAccepted=${r.f89RegistryReceiptAccepted}`,
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
      `f55ActivationStatus=${r.f55ActivationStatus}`,
      `f55ActivationReason=${r.f55ActivationReason}`,
      `f55ReceiptReady=${r.f55ReceiptReady}`,
      `f55ReleasePacketReady=${r.f55ReleasePacketReady}`,
      "",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      "",
      "EXPRESSION_NODES",
      nodes,
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

  function updateDataset() {
    setDataset("labProductEngineUE5ExpressionLoaded", "true");
    setDataset("labProductEngineUE5ExpressionContract", CONTRACT);
    setDataset("labProductEngineUE5ExpressionReceipt", RECEIPT);
    setDataset("labProductEngineUE5ExpressionVersion", VERSION);
    setDataset("labProductEngineUE5ExpressionFile", FILE);

    setDataset("ue5ExpressionF55Only", "true");
    setDataset("ue5ExpressionConductorActive", "true");
    setDataset("ue5ExpressionProductEngineF34Required", "true");
    setDataset("ue5ExpressionProductEngineF34Observed", state.productEngineF34Observed);
    setDataset("ue5ExpressionProductEngineF34Accepted", state.productEngineF34Accepted);

    setDataset("ue5ExpressionUnrealEngineDependency", "false");
    setDataset("ue5ExpressionUnrealEngineRuntimeRequired", "false");
    setDataset("ue5ExpressionConceptualStandardConsumed", "true");
    setDataset("ue5ExpressionPublicSuperiorityClaim", "false");
    setDataset("ue5ExpressionInternalSurpassTargetMetricActive", "true");

    setDataset("ue5ExpressionSceneGraphBuilt", state.sceneGraphBuilt);
    setDataset("ue5ExpressionSceneGraphReady", state.sceneGraphReady);
    setDataset("ue5ExpressionSceneGraphStatus", state.sceneGraphStatus);
    setDataset("ue5ExpressionSceneGraphNodeCount", state.sceneGraphNodeCount);
    setDataset("ue5ExpressionSceneGraphEdgeCount", state.sceneGraphEdgeCount);

    setDataset("ue5ExpressionQualityScore", state.expressionQualityScore);
    setDataset("ue5ExpressionLodBudgetScore", state.lodBudgetScore);
    setDataset("ue5ExpressionInternalMarketSurpassTargetScore", state.internalMarketSurpassTargetScore);

    setDataset("ue5ExpressionProjectRegistryGateReady", state.projectRegistryGateReady);
    setDataset("ue5ExpressionF89RegistryReleaseAuthorized", state.f89RegistryReleaseAuthorized);

    setDataset("ue5ExpressionNewsProtocolAligned", "true");
    setDataset("ue5ExpressionFibonacciSynchronizationMetricActive", "true");
    setDataset("ue5ExpressionFibonacciSynchronizationScore", state.fibonacciSynchronizationScore);
    setDataset("ue5ExpressionActiveFibonacci", FIBONACCI.UE5_EXPRESSION);
    setDataset("ue5ExpressionActiveFibonacciRank", "55");
    setDataset("ue5ExpressionActiveNewsGate", NEWS_GATES.EXPRESSION);
    setDataset("ue5ExpressionSourceFibonacciGate", FIBONACCI.PRODUCT_ENGINE);
    setDataset("ue5ExpressionFutureFibonacciGate", FIBONACCI.PROJECT_REGISTRY);

    setDataset("ue5ExpressionF55ActivationStatus", state.f55ActivationStatus);
    setDataset("ue5ExpressionF55ActivationReason", state.f55ActivationReason);
    setDataset("ue5ExpressionF55ReleasePacketReady", state.f55ReleasePacketReady);

    setDataset("ue5ExpressionFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("ue5ExpressionRecommendedNextFile", state.recommendedNextFile);
    setDataset("ue5ExpressionRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);

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

    root.DEXTER_LAB.productEngineUE5Expression = api;
    root.DEXTER_LAB.productEngineUE5ExpressionF55 = api;
    root.DEXTER_LAB.ue5ExpressionConductor = api;

    root.HEARTH.productEngineUE5Expression = api;
    root.HEARTH.productEngineUE5ExpressionF55 = api;
    root.HEARTH.ue5ExpressionConductor = api;

    const light = getReceiptLight();

    root.LAB_PRODUCT_ENGINE_UE5_EXPRESSION_RECEIPT = light;
    root.LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_RECEIPT = light;
    root.PRODUCT_ENGINE_UE5_EXPRESSION_RECEIPT = light;
    root.UE5_EXPRESSION_CONDUCTOR_RECEIPT = light;

    root.DEXTER_LAB.productEngineUE5ExpressionReceipt = light;
    root.HEARTH.productEngineUE5ExpressionReceipt = light;

    root.__LAB_PRODUCT_ENGINE_UE5_EXPRESSION_LOADED__ = true;
    root.__LAB_PRODUCT_ENGINE_UE5_EXPRESSION_CONTRACT__ = CONTRACT;
    root.__LAB_PRODUCT_ENGINE_UE5_EXPRESSION_RECEIPT__ = RECEIPT;
    root.__LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55_ONLY__ = true;
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
    NODE_TYPES,
    STATUS,

    readProductEngineAuthority,
    readProductEngineReceipt,
    validateF34Release,
    acceptF34Release,

    normalizeExpressionNode,
    evaluateExpressionNode,
    registerExpressionNode,
    registerProductExpression,
    evaluateAllExpressionNodes,
    buildSceneGraph,

    computeExpressionQualityMetric,
    computeFibonacciSynchronizationMetric,
    evaluateNewsAlignment,

    createExpressionPlan,
    composeF55Receipt,
    composeF55ReleasePacket,
    submitF55ReceiptToProductEngine,

    getReceiptLight,
    getReceipt,
    getReceiptText,
    publishGlobals,
    updateDataset,

    f55ExpressionConductorActive: true,
    f55Only: true,
    productEngineF34Required: true,
    ue5DerivedExpressionActive: true,
    unrealEngineDependency: false,
    unrealEngineRuntimeRequired: false,
    publicSuperiorityClaim: false,
    internalSurpassTargetMetricActive: true,

    ownsF55ExpressionConductorship: true,
    ownsDeterministicSceneGraph: true,
    ownsExpressionNodeRegistry: true,
    ownsLodBudgetMetric: true,
    ownsExpressionQualityMetric: true,
    ownsF89RegistryHandoffPacket: true,
    ownsNewsFibonacciSynchronizationMetric: true,

    ownsNorthF21Latch: false,
    ownsProductEngineF34Authority: false,
    ownsCanvasF13Evidence: false,
    ownsRouteOrchestration: false,
    ownsPlanetTruth: false,
    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
    ownsWebGL: false,
    ownsGeneratedImage: false,
    ownsGraphicBox: false,
    ownsFinalVisualPassClaim: false,

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
    const receipt = readProductEngineReceipt();
    acceptF34Release(receipt);
  } catch (error) {
    recordError("INITIAL_PRODUCT_ENGINE_F34_READ_FAILED", error);
    computeFibonacciSynchronizationMetric();
  }

  recordLocal("UE5_EXPRESSION_F55_SCENE_GRAPH_CONDUCTOR_LOADED", {
    file: FILE,
    contract: CONTRACT,
    productEngineFile: PRODUCT_ENGINE_FILE,
    registryFile: REGISTRY_FILE,
    f55Only: true,
    unrealEngineDependency: false,
    publicSuperiorityClaim: false
  });

  publishGlobals();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

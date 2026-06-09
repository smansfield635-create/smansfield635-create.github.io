// /assets/lab/product-engine.js
// LAB_PRODUCT_ENGINE_F34_ENGINE_MECHANICS_PRODUCT_GRAPH_CLERK_TNT_v1
// First construction.
// Product Engine F34 authority slot / product graph clerk.
// Purpose:
// - Stand up the missing F34 Product Engine file expected by F55/F89/F144 support engines.
// - Provide a deterministic product graph and F34 release packet for UE5 Expression F55.
// - Bind directly to runtime-table v4 mechanics: RT3D-X10_Y19_Z34.
// - Preserve Product Engine F34 -> UE5 Expression F55 -> Registry F89 -> Market F144 -> F233 return.
// - Treat market/surpass language as internal target language only.
// - Avoid public superiority claims, generated image claims, WebGL claims, GraphicBox claims, and final visual pass claims.
// Does not own:
// - North F21 latch
// - UE5 Expression F55 authority
// - Project Registry F89 authority
// - Market F144 authority
// - Canvas F13 evidence
// - route orchestration
// - planet truth
// - material truth
// - elevation truth
// - hydrology truth
// - actual rendering
// - generated image
// - GraphicBox
// - WebGL
// - public superiority claim
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "LAB_PRODUCT_ENGINE_F34_ENGINE_MECHANICS_PRODUCT_GRAPH_CLERK_TNT_v1";
  const RECEIPT = "LAB_PRODUCT_ENGINE_F34_ENGINE_MECHANICS_PRODUCT_GRAPH_CLERK_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "NONE_PRODUCT_ENGINE_F34_FIRST_CONSTRUCTION";
  const BASELINE_CONTRACT = "LAB_PRODUCT_ENGINE_F34_AUTHORITY_SLOT_BASELINE_v1";
  const VERSION = "2026-06-08.lab-product-engine-f34-engine-mechanics-product-graph-clerk-v1";

  const FILE = "/assets/lab/product-engine.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const UE5_EXPRESSION_FILE = "/assets/lab/product-engine.ue5-expression.js";
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
    MARKET_READINESS: "F144",
    DOWNSTREAM_RETURN: "F233"
  });

  const NEWS_GATES = Object.freeze({
    NORTH: "NORTH",
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
    COMPLETE: "COMPLETE"
  });

  const PRODUCT_TYPES = Object.freeze({
    RUNTIME_ENGINE: "runtime-engine",
    SUPPORT_ENGINE: "support-engine",
    CANVAS_EXPRESSION: "canvas-expression",
    DIAGNOSTIC_EVIDENCE: "diagnostic-evidence",
    PRODUCT_FRAMEWORK: "product-framework",
    DOCUMENTATION: "documentation",
    MARKET_PACKAGE: "market-package"
  });

  const MECHANICAL_COORDINATE = Object.freeze({
    coordinateId: "RT3D-X10_Y19_Z34",
    enginePart: "GEARBOX",
    enginePartIndex: 10,
    systemCategory: "NINETEEN_PART_SYSTEM",
    systemCategoryIndex: 19,
    fibonacciStage: FIBONACCI.PRODUCT_ENGINE,
    fibonacciRank: 34,
    fibonacciStation: "PRODUCT_ENGINE_SLOT",
    mechanicalRole: "PRODUCT_ENGINE_AUTHORITY_SLOT",
    clerkRole: "PRODUCT_ENGINE_CLERK",
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
    role: "product-engine-f34-engine-mechanics-product-graph-clerk",

    productEngineF34Active: true,
    productEngineF34Only: true,
    productEngineF34Ready: false,
    productEngineAuthoritySlotActive: true,
    firstConstruction: true,

    engineMechanicsPrimary: true,
    mathPrimary: true,
    architectureLabelsSecondary: true,
    mechanicalCoordinate: MECHANICAL_COORDINATE,

    northRuntimeObserved: false,
    northRuntimeAccepted: false,
    northRuntimeContract: "",
    northRuntimeReceipt: "",
    northF21Acknowledged: false,
    northF21Latched: false,
    canvasF13EvidenceObserved: false,
    canvasF13EvidenceComplete: false,
    canvasF13EvidenceDegraded: false,

    productGraphBuilt: false,
    productGraphReady: false,
    productGraphStatus: STATUS.HELD,
    productGraph: {
      products: [],
      nodes: {},
      edges: [],
      buildId: "",
      builtAt: ""
    },

    productCount: 0,
    productReadyCount: 0,
    productDegradedCount: 0,
    productBlockedCount: 0,
    productFrameworkCount: 0,
    supportEngineCount: 0,
    runtimeEngineCount: 0,
    canvasExpressionCount: 0,
    diagnosticEvidenceCount: 0,

    productQualityMetricActive: true,
    productQualityScore: 0,
    productCoverageScore: 0,
    productTraceScore: 0,
    productCoherenceScore: 0,
    internalMarketSurpassTargetScore: 0,
    publicSuperiorityClaim: false,
    publicComparisonClaimAllowed: false,
    benchmarkRequiredBeforePublicClaim: true,

    ue5ExpressionReleaseAuthorized: false,
    ue5ExpressionReceiptAccepted: false,
    ue5ExpressionReceiptPacket: null,
    ue5ExpressionContract: "",
    ue5ExpressionReceipt: "",

    f34ReleasePacketReady: false,
    f34ActivationStatus: STATUS.ACTIVE,
    f34ActivationReason: "PRODUCT_ENGINE_F34_FIRST_CONSTRUCTION_ACTIVE",
    f34ReceiptReady: true,

    newsProtocolAligned: true,
    fibonacciSynchronizationMetricActive: true,
    fibonacciSynchronizationScore: 0,
    activeFibonacci: FIBONACCI.PRODUCT_ENGINE,
    activeFibonacciRank: 34,
    activeNewsGate: NEWS_GATES.PRODUCT,
    sourceFibonacciGate: FIBONACCI.NORTH_LATCH,
    futureFibonacciGate: FIBONACCI.UE5_EXPRESSION,
    oneActiveGearAtATime: true,

    firstFailedCoordinate: "NONE_PRODUCT_ENGINE_F34_FIRST_CONSTRUCTION_ACTIVE",
    recommendedNextFile: UE5_EXPRESSION_FILE,
    recommendedNextRenewalTarget: UE5_EXPRESSION_FILE,

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

  function trim(list, max = 180) {
    if (Array.isArray(list) && list.length > max) {
      list.splice(0, list.length - max);
    }
  }

  function makeId(value, fallback = "product") {
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

  function hasMeaningfulReceipt(receipt = {}) {
    if (!isObject(receipt) || !Object.keys(receipt).length) return false;

    return Boolean(
      receipt.contract ||
      receipt.receipt ||
      receipt.version ||
      receipt.f21Latched ||
      receipt.f21EligibilityAccepted ||
      receipt.canvasF13EvidenceAccepted ||
      receipt.productEngineF34Ready ||
      receipt.f34ReleasePacketReady ||
      receipt.activeFibonacci
    );
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
      code: safeString(code, "PRODUCT_ENGINE_F34_ERROR"),
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
      "DEXTER_LAB.runtimeTable",
      "DEXTER_LAB.cardinalRuntimeTableNorth",
      "HEARTH.northCommandRuntimeTable",
      "HEARTH.runtimeTable"
    ]);
  }

  function readNorthRuntimeReceipt() {
    const authority = readNorthRuntimeAuthority();
    const receipt = readReceipt(authority);

    if (hasMeaningfulReceipt(receipt)) {
      state.northRuntimeObserved = true;
      state.northRuntimeContract = safeString(receipt.contract, "");
      state.northRuntimeReceipt = safeString(receipt.receipt, "");
      state.northF21Acknowledged = safeBool(receipt.f21Latched, state.northF21Acknowledged) ||
        safeBool(receipt.f21EligibilityAccepted, state.northF21Acknowledged);
      state.northF21Latched = safeBool(receipt.f21Latched, state.northF21Latched);
      state.canvasF13EvidenceObserved = safeBool(receipt.canvasF13EvidenceAccepted, state.canvasF13EvidenceObserved) ||
        safeBool(receipt.canvasF13EvidenceObserved, state.canvasF13EvidenceObserved);
      state.canvasF13EvidenceComplete = safeBool(receipt.canvasF13EvidenceComplete, state.canvasF13EvidenceComplete);
      state.canvasF13EvidenceDegraded = safeBool(receipt.canvasF13EvidenceDegraded, state.canvasF13EvidenceDegraded);
    }

    return receipt || {};
  }

  function validateNorthRuntimeReceipt(packet = {}) {
    const input = isObject(packet) && Object.keys(packet).length ? packet : readNorthRuntimeReceipt();
    const meaningful = hasMeaningfulReceipt(input);
    const noForbiddenClaim = !detectForbiddenClaim(input);

    const activeFibonacci = safeString(input.activeStage || input.activeFibonacci || "", "");
    const f21Accepted = Boolean(
      safeBool(input.f21Latched, false) ||
      safeBool(input.f21EligibilityAccepted, false) ||
      safeBool(input.northTimingGovernor, false) ||
      safeBool(input.countyRuntimeEngineCenter, false)
    );

    return {
      ok: Boolean(noForbiddenClaim && (meaningful ? true : true)),
      meaningful,
      noForbiddenClaim,
      northRuntimeObserved: meaningful,
      northF21Acknowledged: f21Accepted,
      activeFibonacci,
      input: clonePlain(input),
      reason: noForbiddenClaim ? "NORTH_RUNTIME_RECEIPT_ACCEPTABLE_OR_OPTIONAL" : "FORBIDDEN_CLAIM_DETECTED_IN_NORTH_RUNTIME_RECEIPT"
    };
  }

  function acceptNorthRuntimeReceipt(packet = {}) {
    const validation = validateNorthRuntimeReceipt(packet);

    if (validation.meaningful) {
      state.northRuntimeObserved = true;
      state.northRuntimeAccepted = validation.ok;
      state.northF21Acknowledged = validation.northF21Acknowledged;
      state.northF21Latched = safeBool(validation.input.f21Latched, state.northF21Latched);

      if (validation.input.contract) state.northRuntimeContract = safeString(validation.input.contract);
      if (validation.input.receipt) state.northRuntimeReceipt = safeString(validation.input.receipt);
    }

    recordLocal("NORTH_RUNTIME_RECEIPT_EVALUATED_BY_PRODUCT_ENGINE_F34", {
      ok: validation.ok,
      meaningful: validation.meaningful,
      northF21Acknowledged: state.northF21Acknowledged
    });

    computeFibonacciSynchronizationMetric();
    publishGlobals();

    return {
      accepted: validation.ok,
      observed: validation.meaningful,
      northF21Acknowledged: state.northF21Acknowledged,
      northF21Latched: state.northF21Latched,
      reason: validation.reason,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function normalizeProduct(definition = {}) {
    const source = isObject(definition) ? definition : {};
    const type = safeString(source.type || source.productType || PRODUCT_TYPES.PRODUCT_FRAMEWORK, PRODUCT_TYPES.PRODUCT_FRAMEWORK);
    const id = makeId(source.id || source.key || source.name || `${type}-${state.productGraph.products.length + 1}`, `${type}-product`);

    return {
      id,
      type,
      name: safeString(source.name || source.label || id),
      label: safeString(source.label || source.name || id),
      file: safeString(source.file || source.sourceFile || ""),
      route: safeString(source.route || ""),
      contract: safeString(source.contract || source.sourceContract || ""),
      receipt: safeString(source.receipt || source.sourceReceipt || ""),
      productId: id,
      projectId: makeId(source.projectId || source.project || "diamond-gate-bridge", "diamond-gate-bridge"),

      sourceFibonacciGate: safeString(source.sourceFibonacciGate || FIBONACCI.NORTH_LATCH),
      activeFibonacci: safeString(source.activeFibonacci || FIBONACCI.PRODUCT_ENGINE),
      futureFibonacciGate: safeString(source.futureFibonacciGate || FIBONACCI.UE5_EXPRESSION),

      priority: clamp(source.priority ?? 50, 0, 100),
      dependencies: Array.isArray(source.dependencies) ? source.dependencies.slice() : [],
      tags: Array.isArray(source.tags) ? source.tags.slice() : [],

      receiptReady: safeBool(source.receiptReady, Boolean(source.contract || source.receipt || source.sourceContract || source.sourceReceipt)),
      platformReady: safeBool(source.platformReady, false),
      engineeringReady: safeBool(source.engineeringReady, false),
      productReady: safeBool(source.productReady, false),
      expressionReady: safeBool(source.expressionReady, false),
      registryReady: safeBool(source.registryReady, false),
      marketReady: safeBool(source.marketReady, false),
      documentationReady: safeBool(source.documentationReady, false),
      evidenceReady: safeBool(source.evidenceReady, false),
      riskBoundaryReady: safeBool(source.riskBoundaryReady, true),

      internalOnly: safeBool(source.internalOnly, true),
      publicReady: safeBool(source.publicReady, false),

      ownsRendering: false,
      ownsTruth: false,
      ownsGeneratedImage: false,
      ownsGraphicBox: false,
      ownsWebGL: false,
      ownsFinalVisualPassClaim: false,
      publicSuperiorityClaim: false,
      publicComparisonClaimAllowed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      createdAt: safeString(source.createdAt || nowIso()),
      updatedAt: nowIso()
    };
  }

  function evaluateProduct(product = {}) {
    const item = normalizeProduct(product);
    const missing = [];

    if (!item.id) missing.push("id");
    if (!item.type) missing.push("type");
    if (!item.receiptReady) missing.push("receiptReady");
    if (!item.platformReady) missing.push("platformReady");
    if (!item.engineeringReady) missing.push("engineeringReady");
    if (!item.productReady) missing.push("productReady");

    const readinessScore = clamp(
      (item.id ? 8 : 0) +
      (item.type ? 8 : 0) +
      (item.file || item.route ? 8 : 0) +
      (item.receiptReady ? 14 : 0) +
      (item.platformReady ? 14 : 0) +
      (item.engineeringReady ? 14 : 0) +
      (item.productReady ? 14 : 0) +
      (item.expressionReady ? 8 : 0) +
      (item.documentationReady ? 6 : 0) +
      (item.evidenceReady ? 6 : 0),
      0,
      100
    );

    const status =
      missing.includes("receiptReady")
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
      f34ProductEvaluated: true,
      evaluatedAt: nowIso()
    };
  }

  function rebuildProductIndexes(products = state.productGraph.products) {
    state.productFrameworkCount = products.filter((item) => item.type === PRODUCT_TYPES.PRODUCT_FRAMEWORK).length;
    state.supportEngineCount = products.filter((item) => item.type === PRODUCT_TYPES.SUPPORT_ENGINE).length;
    state.runtimeEngineCount = products.filter((item) => item.type === PRODUCT_TYPES.RUNTIME_ENGINE).length;
    state.canvasExpressionCount = products.filter((item) => item.type === PRODUCT_TYPES.CANVAS_EXPRESSION).length;
    state.diagnosticEvidenceCount = products.filter((item) => item.type === PRODUCT_TYPES.DIAGNOSTIC_EVIDENCE).length;
  }

  function registerProduct(definition = {}, options = {}) {
    const evaluated = evaluateProduct(definition);
    const existingIndex = state.productGraph.products.findIndex((item) => item.id === evaluated.id);

    if (existingIndex >= 0) {
      state.productGraph.products[existingIndex] = evaluated;
    } else {
      state.productGraph.products.push(evaluated);
    }

    if (options.silent !== true) {
      recordLocal("PRODUCT_ENGINE_F34_PRODUCT_REGISTERED", {
        id: evaluated.id,
        type: evaluated.type,
        status: evaluated.status,
        readinessScore: evaluated.readinessScore
      });
    }

    buildProductGraph({ silent: true });
    computeFibonacciSynchronizationMetric();
    publishGlobals();

    return clonePlain(evaluated);
  }

  function seedCoreProducts(options = {}) {
    const coreProducts = [
      {
        id: "runtime-table-engine-mechanics",
        type: PRODUCT_TYPES.RUNTIME_ENGINE,
        name: "Runtime Table Engine Mechanics",
        file: NORTH_FILE,
        contract: "LAB_RUNTIME_TABLE_COUNTY_ENGINE_MECHANICS_3D_LATTICE_256_STATE_SUPPORT_ENGINE_TNT_v4",
        receipt: "LAB_RUNTIME_TABLE_COUNTY_ENGINE_MECHANICS_3D_LATTICE_256_STATE_SUPPORT_ENGINE_RECEIPT_v4",
        receiptReady: true,
        platformReady: true,
        engineeringReady: true,
        productReady: true,
        expressionReady: true,
        documentationReady: true,
        evidenceReady: true,
        priority: 100,
        tags: ["runtime", "engine-mechanics", "3d-lattice", "256-state"]
      },
      {
        id: "product-engine-support-stack",
        type: PRODUCT_TYPES.SUPPORT_ENGINE,
        name: "Product Engine Support Stack",
        file: FILE,
        contract: CONTRACT,
        receipt: RECEIPT,
        receiptReady: true,
        platformReady: true,
        engineeringReady: true,
        productReady: true,
        expressionReady: true,
        documentationReady: true,
        evidenceReady: true,
        priority: 98,
        tags: ["f34", "support-engine", "clerk"]
      },
      {
        id: "ue5-expression-scene-graph",
        type: PRODUCT_TYPES.SUPPORT_ENGINE,
        name: "UE5-Derived Expression Scene Graph",
        file: UE5_EXPRESSION_FILE,
        receiptReady: true,
        platformReady: true,
        engineeringReady: true,
        productReady: true,
        expressionReady: true,
        documentationReady: true,
        evidenceReady: true,
        priority: 94,
        tags: ["f55", "expression", "scene-graph"]
      },
      {
        id: "project-registry-conductor",
        type: PRODUCT_TYPES.SUPPORT_ENGINE,
        name: "Project Registry Conductor",
        file: REGISTRY_FILE,
        receiptReady: true,
        platformReady: true,
        engineeringReady: true,
        productReady: true,
        expressionReady: true,
        documentationReady: true,
        evidenceReady: true,
        priority: 92,
        tags: ["f89", "registry", "records"]
      },
      {
        id: "market-readiness-conductor",
        type: PRODUCT_TYPES.MARKET_PACKAGE,
        name: "Market Readiness Conductor",
        file: MARKET_FILE,
        receiptReady: true,
        platformReady: true,
        engineeringReady: true,
        productReady: true,
        expressionReady: true,
        documentationReady: true,
        evidenceReady: true,
        marketReady: false,
        priority: 90,
        tags: ["f144", "market-readiness", "risk-boundary"]
      },
      {
        id: "hearth-canvas-expression-carrier",
        type: PRODUCT_TYPES.CANVAS_EXPRESSION,
        name: "Hearth Canvas Expression Carrier",
        file: "/assets/hearth/hearth.canvas.js",
        route: "/showroom/globe/hearth/",
        receiptReady: true,
        platformReady: true,
        engineeringReady: true,
        productReady: true,
        expressionReady: true,
        documentationReady: false,
        evidenceReady: true,
        priority: 86,
        tags: ["canvas", "chapel", "visible-expression-carrier"]
      },
      {
        id: "diagnostic-receipt-evidence-stream",
        type: PRODUCT_TYPES.DIAGNOSTIC_EVIDENCE,
        name: "Diagnostic Receipt Evidence Stream",
        file: "/showroom/globe/hearth/diagnostic/index.html",
        receiptReady: true,
        platformReady: true,
        engineeringReady: true,
        productReady: true,
        expressionReady: false,
        documentationReady: true,
        evidenceReady: true,
        priority: 84,
        tags: ["diagnostic", "receipt", "evidence"]
      }
    ];

    coreProducts.forEach((product) => registerProduct(product, { silent: true }));

    if (options.silent !== true) {
      recordLocal("PRODUCT_ENGINE_F34_CORE_PRODUCTS_SEEDED", {
        productCount: coreProducts.length
      });
    }

    return listProducts();
  }

  function evaluateAllProducts() {
    const evaluated = state.productGraph.products.map((product) => evaluateProduct(product));
    state.productGraph.products = evaluated;
    return evaluated;
  }

  function buildProductGraph(options = {}) {
    const products = evaluateAllProducts();

    const nodes = {};
    const edges = [];

    products.forEach((product) => {
      nodes[product.id] = {
        id: product.id,
        type: product.type,
        label: product.label || product.name,
        file: product.file,
        route: product.route,
        readinessScore: product.readinessScore,
        status: product.status,
        priority: product.priority,
        deterministic: true
      };

      product.dependencies.forEach((dependency) => {
        edges.push({
          from: dependency,
          to: product.id,
          type: "dependency",
          deterministic: true
        });
      });

      if (product.file) {
        edges.push({
          from: makeId(product.file, "source-file"),
          to: product.id,
          type: "source-file",
          deterministic: true
        });
      }
    });

    const sortedProducts = products.slice().sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      if (a.type !== b.type) return a.type.localeCompare(b.type);
      return a.id.localeCompare(b.id);
    });

    state.productGraph = {
      products: sortedProducts,
      nodes,
      edges,
      buildId: `f34-product-graph-${sortedProducts.length}-${edges.length}`,
      builtAt: nowIso()
    };

    state.productGraphBuilt = true;
    state.productCount = sortedProducts.length;
    state.productReadyCount = sortedProducts.filter((item) => item.status === STATUS.READY).length;
    state.productDegradedCount = sortedProducts.filter((item) => item.status === STATUS.DEGRADED).length;
    state.productBlockedCount = sortedProducts.filter((item) => item.status === STATUS.BLOCKED || item.status === STATUS.HELD).length;

    rebuildProductIndexes(sortedProducts);
    computeProductGraphQualityMetric();

    state.productGraphReady = Boolean(
      state.productCount > 0 &&
      state.productBlockedCount === 0 &&
      state.productQualityScore >= 80
    );

    if (state.productGraphReady) {
      state.productGraphStatus = STATUS.READY;
      state.productEngineF34Ready = true;
      state.f34ActivationStatus = STATUS.READY;
      state.f34ActivationReason = "PRODUCT_ENGINE_F34_PRODUCT_GRAPH_READY";
      state.ue5ExpressionReleaseAuthorized = true;
      state.f34ReleasePacketReady = true;
      state.firstFailedCoordinate = "NONE_PRODUCT_ENGINE_F34_READY_UE5_F55_RELEASE_AUTHORIZED";
      state.recommendedNextFile = UE5_EXPRESSION_FILE;
      state.recommendedNextRenewalTarget = UE5_EXPRESSION_FILE;
    } else if (state.productCount > 0 && state.productQualityScore >= 62) {
      state.productGraphStatus = STATUS.DEGRADED;
      state.productEngineF34Ready = true;
      state.f34ActivationStatus = STATUS.DEGRADED;
      state.f34ActivationReason = "PRODUCT_ENGINE_F34_PRODUCT_GRAPH_DEGRADED_UE5_F55_RELEASE_AVAILABLE_WITH_BOUNDARIES";
      state.ue5ExpressionReleaseAuthorized = true;
      state.f34ReleasePacketReady = true;
      state.firstFailedCoordinate = "NONE_PRODUCT_ENGINE_F34_DEGRADED_UE5_F55_RELEASE_AVAILABLE";
      state.recommendedNextFile = UE5_EXPRESSION_FILE;
      state.recommendedNextRenewalTarget = UE5_EXPRESSION_FILE;
    } else {
      state.productGraphStatus = STATUS.HELD;
      state.productEngineF34Ready = false;
      state.f34ActivationStatus = STATUS.HELD;
      state.f34ActivationReason = "WAITING_PRODUCT_GRAPH_READY";
      state.ue5ExpressionReleaseAuthorized = false;
      state.f34ReleasePacketReady = false;
      state.firstFailedCoordinate = "WAITING_PRODUCT_GRAPH_READY";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
    }

    computeFibonacciSynchronizationMetric();

    if (options.silent !== true) {
      recordLocal("PRODUCT_ENGINE_F34_PRODUCT_GRAPH_BUILT", {
        productCount: state.productCount,
        edgeCount: edges.length,
        ready: state.productGraphReady,
        status: state.productGraphStatus,
        productQualityScore: state.productQualityScore
      });
    }

    updateDataset();

    return clonePlain(state.productGraph);
  }

  function computeProductGraphQualityMetric() {
    const count = Math.max(1, state.productCount || state.productGraph.products.length || 0);
    const products = state.productGraph.products || [];
    const readyRatio = products.filter((item) => item.status === STATUS.READY).length / count;
    const degradedRatio = products.filter((item) => item.status === STATUS.DEGRADED).length / count;
    const blockedRatio = products.filter((item) => item.status === STATUS.BLOCKED || item.status === STATUS.HELD).length / count;

    const typeCoverage = [
      state.runtimeEngineCount > 0,
      state.supportEngineCount > 0,
      state.canvasExpressionCount > 0,
      state.diagnosticEvidenceCount > 0,
      state.productFrameworkCount > 0
    ].filter(Boolean).length / 5;

    state.productCoverageScore = clamp(Math.round(typeCoverage * 100), 0, 100);

    state.productTraceScore = clamp(
      Math.round(
        34 +
        Math.min(32, products.filter((item) => item.receiptReady).length * 5) +
        Math.min(16, products.filter((item) => item.file || item.route).length * 2) +
        (state.productEngineAuthoritySlotActive ? 10 : 0) +
        (state.f34ReceiptReady ? 8 : 0)
      ),
      0,
      100
    );

    state.productCoherenceScore = clamp(
      Math.round(
        (readyRatio * 58) +
        (degradedRatio * 24) -
        (blockedRatio * 38) +
        (state.productCoverageScore * 0.10) +
        (state.productTraceScore * 0.10)
      ),
      0,
      100
    );

    state.productQualityScore = clamp(
      Math.round(
        (state.productCoherenceScore * 0.44) +
        (state.productCoverageScore * 0.28) +
        (state.productTraceScore * 0.28)
      ),
      0,
      100
    );

    state.internalMarketSurpassTargetScore = clamp(
      Math.round(
        (state.productQualityScore * 0.34) +
        (state.productCoverageScore * 0.20) +
        (state.productTraceScore * 0.20) +
        (state.productCoherenceScore * 0.16) +
        (state.fibonacciSynchronizationScore * 0.10)
      ),
      0,
      100
    );

    return {
      productQualityScore: state.productQualityScore,
      productCoverageScore: state.productCoverageScore,
      productTraceScore: state.productTraceScore,
      productCoherenceScore: state.productCoherenceScore,
      internalMarketSurpassTargetScore: state.internalMarketSurpassTargetScore,
      publicSuperiorityClaim: false,
      publicComparisonClaimAllowed: false
    };
  }

  function computeFibonacciSynchronizationMetric() {
    const checks = [
      state.newsProtocolAligned,
      state.oneActiveGearAtATime,
      state.activeFibonacci === FIBONACCI.PRODUCT_ENGINE,
      state.activeFibonacciRank === 34,
      state.activeNewsGate === NEWS_GATES.PRODUCT,
      state.sourceFibonacciGate === FIBONACCI.NORTH_LATCH,
      state.futureFibonacciGate === FIBONACCI.UE5_EXPRESSION,
      state.productEngineF34Active,
      state.productEngineAuthoritySlotActive,
      state.productGraphBuilt,
      state.f34ReceiptReady,
      state.engineMechanicsPrimary,
      state.mathPrimary,
      state.mechanicalCoordinate.coordinateId === "RT3D-X10_Y19_Z34",
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

    computeProductGraphQualityMetric();

    return {
      score: state.fibonacciSynchronizationScore,
      passed,
      total: checks.length,
      activeFibonacci: FIBONACCI.PRODUCT_ENGINE,
      activeFibonacciRank: 34,
      activeNewsGate: NEWS_GATES.PRODUCT,
      futureFibonacciGate: FIBONACCI.UE5_EXPRESSION,
      publicSuperiorityClaim: false
    };
  }

  function evaluateNewsAlignment() {
    const metric = computeFibonacciSynchronizationMetric();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      newsAlignmentContract: "LAB_PRODUCT_ENGINE_F34_NEWS_ALIGNMENT_PROTOCOL_v1",
      newsAlignmentReceipt: "LAB_PRODUCT_ENGINE_F34_NEWS_ALIGNMENT_PROTOCOL_RECEIPT_v1",
      sequence: [
        {
          gate: NEWS_GATES.NORTH,
          fibonacci: FIBONACCI.NORTH_LATCH,
          file: NORTH_FILE,
          ready: state.northRuntimeObserved || state.northF21Acknowledged
        },
        {
          gate: NEWS_GATES.PRODUCT,
          fibonacci: FIBONACCI.PRODUCT_ENGINE,
          file: FILE,
          ready: state.productEngineF34Ready || state.productGraphStatus === STATUS.DEGRADED
        },
        {
          gate: NEWS_GATES.EXPRESSION,
          fibonacci: FIBONACCI.UE5_EXPRESSION,
          file: UE5_EXPRESSION_FILE,
          ready: state.ue5ExpressionReleaseAuthorized
        },
        {
          gate: NEWS_GATES.REGISTRY,
          fibonacci: FIBONACCI.PROJECT_REGISTRY,
          file: REGISTRY_FILE,
          ready: false
        },
        {
          gate: NEWS_GATES.MARKET,
          fibonacci: FIBONACCI.MARKET_READINESS,
          file: MARKET_FILE,
          ready: false
        }
      ],
      fibonacciSynchronizationScore: metric.score,
      f34Status: state.f34ActivationStatus,
      productGraphStatus: state.productGraphStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function readUE5ExpressionAuthority() {
    return firstGlobal([
      "LAB_PRODUCT_ENGINE_UE5_EXPRESSION",
      "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55",
      "PRODUCT_ENGINE_UE5_EXPRESSION",
      "UE5_EXPRESSION_CONDUCTOR",
      "DEXTER_LAB.productEngineUE5Expression",
      "DEXTER_LAB.productEngineUE5ExpressionF55",
      "DEXTER_LAB.ue5ExpressionConductor",
      "HEARTH.productEngineUE5Expression",
      "HEARTH.productEngineUE5ExpressionF55",
      "HEARTH.ue5ExpressionConductor"
    ]);
  }

  function validateUE5ExpressionF55Receipt(packet = {}) {
    const input = isObject(packet) ? packet : {};
    const noForbiddenClaim = !detectForbiddenClaim(input);
    const activeFibonacci = safeString(input.activeFibonacci || input.fibonacciStage || "");
    const futureFibonacciGate = safeString(input.futureFibonacciGate || "");

    const f55Recognized = Boolean(
      safeBool(input.f55ExpressionConductorActive, false) ||
      safeBool(input.f55ExpressionReady, false) ||
      safeBool(input.sceneGraphBuilt, false) ||
      safeBool(input.sceneGraphConductorReady, false) ||
      safeString(input.packetType, "").includes("F55") ||
      activeFibonacci === FIBONACCI.UE5_EXPRESSION ||
      activeFibonacci === "F55"
    );

    const ok = Boolean(
      noForbiddenClaim &&
      f55Recognized &&
      (
        !activeFibonacci ||
        activeFibonacci === FIBONACCI.UE5_EXPRESSION ||
        activeFibonacci === "F55"
      ) &&
      (
        !futureFibonacciGate ||
        futureFibonacciGate === FIBONACCI.PROJECT_REGISTRY ||
        futureFibonacciGate === "F89"
      )
    );

    let reason = "UE5_EXPRESSION_F55_RECEIPT_ACCEPTED";
    if (!noForbiddenClaim) reason = "FORBIDDEN_CLAIM_DETECTED_IN_F55_RECEIPT";
    else if (!f55Recognized) reason = "UNRECOGNIZED_F55_RECEIPT";

    return {
      ok,
      reason,
      input: clonePlain(input),
      activeFibonacci,
      futureFibonacciGate,
      f55Recognized,
      noForbiddenClaim
    };
  }

  function acceptUE5ExpressionF55Receipt(packet = {}) {
    const validation = validateUE5ExpressionF55Receipt(packet);

    state.ue5ExpressionReceiptAccepted = validation.ok;
    state.ue5ExpressionReceiptPacket = clonePlain(packet);

    if (validation.input.contract) state.ue5ExpressionContract = safeString(validation.input.contract);
    if (validation.input.receipt) state.ue5ExpressionReceipt = safeString(validation.input.receipt);

    recordLocal("UE5_EXPRESSION_F55_RECEIPT_RECEIVED_BY_PRODUCT_ENGINE_F34", {
      accepted: validation.ok,
      reason: validation.reason,
      contract: state.ue5ExpressionContract
    });

    publishGlobals();

    return {
      accepted: validation.ok,
      productEngineF34ReceivedF55: true,
      reason: validation.reason,
      recommendedNextFile: validation.ok ? REGISTRY_FILE : UE5_EXPRESSION_FILE,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function submitF34ReleaseToUE5Expression(extra = {}) {
    const authority = readUE5ExpressionAuthority();

    if (!authority || !isFunction(authority.acceptF34Release)) {
      return {
        submitted: false,
        reason: "UE5_EXPRESSION_ACCEPT_F34_METHOD_UNAVAILABLE",
        recommendedNextFile: UE5_EXPRESSION_FILE,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };
    }

    try {
      const packet = composeF34ReleasePacket(extra);
      const response = authority.acceptF34Release(packet);

      recordLocal("F34_RELEASE_SUBMITTED_TO_UE5_EXPRESSION", {
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
      recordError("F34_RELEASE_SUBMISSION_TO_UE5_EXPRESSION_FAILED", error);
      return {
        submitted: false,
        reason: "F34_RELEASE_SUBMISSION_TO_UE5_EXPRESSION_FAILED",
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };
    }
  }

  function composeF34Receipt() {
    return getReceipt();
  }

  function composeF34ReleasePacket(extra = {}) {
    const metric = computeFibonacciSynchronizationMetric();
    const readyForF55 = Boolean(state.productEngineF34Ready || state.productGraphStatus === STATUS.DEGRADED);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "PRODUCT_ENGINE_F34_RELEASE_PACKET",
      sourceFile: FILE,
      targetFile: UE5_EXPRESSION_FILE,
      destinationFile: UE5_EXPRESSION_FILE,

      activeFibonacci: FIBONACCI.PRODUCT_ENGINE,
      activeFibonacciRank: 34,
      activeNewsGate: NEWS_GATES.PRODUCT,
      sourceFibonacciGate: FIBONACCI.NORTH_LATCH,
      futureFibonacciGate: FIBONACCI.UE5_EXPRESSION,
      futureFibonacciRank: 55,

      mechanicalCoordinate: clonePlain(MECHANICAL_COORDINATE),
      engineMechanicsPrimary: true,
      mathPrimary: true,
      architectureLabelsSecondary: true,

      productEngineF34Active: true,
      productEngineF34Only: true,
      productEngineF34Ready: readyForF55,
      productEngineActive: true,
      f34ReleasePacketReady: readyForF55,
      ue5ExpressionReleaseAuthorized: state.ue5ExpressionReleaseAuthorized,

      northRuntimeObserved: state.northRuntimeObserved,
      northF21Acknowledged: state.northF21Acknowledged,
      northF21Latched: state.northF21Latched,
      canvasF13EvidenceObserved: state.canvasF13EvidenceObserved,
      canvasF13EvidenceComplete: state.canvasF13EvidenceComplete,
      canvasF13EvidenceDegraded: state.canvasF13EvidenceDegraded,

      productGraphBuilt: state.productGraphBuilt,
      productGraphReady: state.productGraphReady,
      productGraphStatus: state.productGraphStatus,
      productCount: state.productCount,
      productReadyCount: state.productReadyCount,
      productDegradedCount: state.productDegradedCount,
      productBlockedCount: state.productBlockedCount,

      productQualityScore: state.productQualityScore,
      productCoverageScore: state.productCoverageScore,
      productTraceScore: state.productTraceScore,
      productCoherenceScore: state.productCoherenceScore,
      internalMarketSurpassTargetScore: state.internalMarketSurpassTargetScore,
      publicSuperiorityClaim: false,
      publicComparisonClaimAllowed: false,
      benchmarkRequiredBeforePublicClaim: true,

      productGraph: clonePlain(state.productGraph),
      products: clonePlain(state.productGraph.products),

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

  function getProduct(id) {
    const key = makeId(id, "");
    return clonePlain(state.productGraph.products.find((product) => product.id === key) || null);
  }

  function listProducts(type = "") {
    const products = state.productGraph.products || [];
    if (!type) return clonePlain(products);
    return clonePlain(products.filter((product) => product.type === type));
  }

  function getProductGraph() {
    return clonePlain(state.productGraph);
  }

  function getProductGraphSummary() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      productGraphBuilt: state.productGraphBuilt,
      productGraphReady: state.productGraphReady,
      productGraphStatus: state.productGraphStatus,
      productCount: state.productCount,
      productReadyCount: state.productReadyCount,
      productDegradedCount: state.productDegradedCount,
      productBlockedCount: state.productBlockedCount,
      productQualityScore: state.productQualityScore,
      productCoverageScore: state.productCoverageScore,
      productTraceScore: state.productTraceScore,
      productCoherenceScore: state.productCoherenceScore,
      updatedAt: nowIso()
    };
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

      productEngineF34Active: true,
      productEngineF34Only: true,
      productEngineF34Ready: state.productEngineF34Ready,
      productEngineAuthoritySlotActive: true,
      firstConstruction: true,

      engineMechanicsPrimary: true,
      mathPrimary: true,
      architectureLabelsSecondary: true,
      mechanicalCoordinateId: MECHANICAL_COORDINATE.coordinateId,
      enginePart: MECHANICAL_COORDINATE.enginePart,
      systemCategory: MECHANICAL_COORDINATE.systemCategory,
      fibonacciStation: MECHANICAL_COORDINATE.fibonacciStage,
      mechanicalRole: MECHANICAL_COORDINATE.mechanicalRole,

      northRuntimeObserved: state.northRuntimeObserved,
      northRuntimeAccepted: state.northRuntimeAccepted,
      northRuntimeContract: state.northRuntimeContract,
      northRuntimeReceipt: state.northRuntimeReceipt,
      northF21Acknowledged: state.northF21Acknowledged,
      northF21Latched: state.northF21Latched,
      canvasF13EvidenceObserved: state.canvasF13EvidenceObserved,
      canvasF13EvidenceComplete: state.canvasF13EvidenceComplete,
      canvasF13EvidenceDegraded: state.canvasF13EvidenceDegraded,

      productGraphBuilt: state.productGraphBuilt,
      productGraphReady: state.productGraphReady,
      productGraphStatus: state.productGraphStatus,
      productCount: state.productCount,
      productReadyCount: state.productReadyCount,
      productDegradedCount: state.productDegradedCount,
      productBlockedCount: state.productBlockedCount,
      productFrameworkCount: state.productFrameworkCount,
      supportEngineCount: state.supportEngineCount,
      runtimeEngineCount: state.runtimeEngineCount,
      canvasExpressionCount: state.canvasExpressionCount,
      diagnosticEvidenceCount: state.diagnosticEvidenceCount,

      productQualityMetricActive: true,
      productQualityScore: state.productQualityScore,
      productCoverageScore: state.productCoverageScore,
      productTraceScore: state.productTraceScore,
      productCoherenceScore: state.productCoherenceScore,
      internalMarketSurpassTargetScore: state.internalMarketSurpassTargetScore,
      publicSuperiorityClaim: false,
      publicComparisonClaimAllowed: false,
      benchmarkRequiredBeforePublicClaim: true,

      ue5ExpressionReleaseAuthorized: state.ue5ExpressionReleaseAuthorized,
      ue5ExpressionReceiptAccepted: state.ue5ExpressionReceiptAccepted,
      ue5ExpressionContract: state.ue5ExpressionContract,
      ue5ExpressionReceipt: state.ue5ExpressionReceipt,

      f34ReleasePacketReady: state.f34ReleasePacketReady,
      f34ActivationStatus: state.f34ActivationStatus,
      f34ActivationReason: state.f34ActivationReason,
      f34ReceiptReady: true,

      newsProtocolAligned: true,
      fibonacciSynchronizationMetricActive: true,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      activeFibonacci: FIBONACCI.PRODUCT_ENGINE,
      activeFibonacciRank: 34,
      activeNewsGate: NEWS_GATES.PRODUCT,
      sourceFibonacciGate: FIBONACCI.NORTH_LATCH,
      futureFibonacciGate: FIBONACCI.UE5_EXPRESSION,
      oneActiveGearAtATime: true,

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

      productEngineF34Receipt: true,
      productEngineClerkReceipt: true,
      productEngineOwns: [
        "F34 product engine authority slot",
        "deterministic product graph",
        "product readiness classification",
        "F55 expression handoff packet",
        "NEWS/Fibonacci synchronization metric",
        "internal target scoring without public superiority claim"
      ],
      productEngineDoesNotOwn: [
        "North F21 latch",
        "UE5 Expression F55 authority",
        "Project Registry F89 authority",
        "Market F144 authority",
        "Canvas F13 evidence",
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
        productEngine: FILE,
        ue5Expression: UE5_EXPRESSION_FILE,
        registry: REGISTRY_FILE,
        market: MARKET_FILE
      },

      productTypes: clonePlain(PRODUCT_TYPES),
      fibonacciMap: clonePlain(FIBONACCI),
      newsGates: clonePlain(NEWS_GATES),
      mechanicalCoordinate: clonePlain(MECHANICAL_COORDINATE),
      mechanicalCoordinatePacket: getMechanicalCoordinatePacket(),

      productGraph: clonePlain(state.productGraph),
      products: clonePlain(state.productGraph.products),
      productGraphSummary: getProductGraphSummary(),

      productQuality: computeProductGraphQualityMetric(),
      newsAlignment: evaluateNewsAlignment(),
      f34ReleasePacket: composeF34ReleasePacket(),
      ue5ExpressionReceiptPacket: clonePlain(state.ue5ExpressionReceiptPacket),

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

    const products = (r.products || []).map((product) => (
      `- ${product.id} :: type=${product.type} :: status=${product.status} :: score=${product.readinessScore} :: file=${product.file || ""}`
    )).join("\n") || "- none";

    const events = (r.localEvents || []).slice(-48).map((item) => (
      `- ${item.at} :: ${item.event} :: ${JSON.stringify(item.detail || {})}`
    )).join("\n") || "- none";

    const errors = (r.errors || []).map((item) => (
      `- ${item.at} :: ${item.code} :: ${item.message}`
    )).join("\n") || "- none";

    return [
      "LAB_PRODUCT_ENGINE_F34_ENGINE_MECHANICS_PRODUCT_GRAPH_CLERK_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `role=${r.role}`,
      "",
      `productEngineF34Active=${r.productEngineF34Active}`,
      `productEngineF34Only=${r.productEngineF34Only}`,
      `productEngineF34Ready=${r.productEngineF34Ready}`,
      `productEngineAuthoritySlotActive=${r.productEngineAuthoritySlotActive}`,
      `firstConstruction=${r.firstConstruction}`,
      "",
      `engineMechanicsPrimary=${r.engineMechanicsPrimary}`,
      `mathPrimary=${r.mathPrimary}`,
      `architectureLabelsSecondary=${r.architectureLabelsSecondary}`,
      `mechanicalCoordinateId=${r.mechanicalCoordinateId}`,
      `enginePart=${r.enginePart}`,
      `systemCategory=${r.systemCategory}`,
      `fibonacciStation=${r.fibonacciStation}`,
      `mechanicalRole=${r.mechanicalRole}`,
      "",
      `northRuntimeObserved=${r.northRuntimeObserved}`,
      `northRuntimeAccepted=${r.northRuntimeAccepted}`,
      `northRuntimeContract=${r.northRuntimeContract}`,
      `northRuntimeReceipt=${r.northRuntimeReceipt}`,
      `northF21Acknowledged=${r.northF21Acknowledged}`,
      `northF21Latched=${r.northF21Latched}`,
      `canvasF13EvidenceObserved=${r.canvasF13EvidenceObserved}`,
      `canvasF13EvidenceComplete=${r.canvasF13EvidenceComplete}`,
      `canvasF13EvidenceDegraded=${r.canvasF13EvidenceDegraded}`,
      "",
      `productGraphBuilt=${r.productGraphBuilt}`,
      `productGraphReady=${r.productGraphReady}`,
      `productGraphStatus=${r.productGraphStatus}`,
      `productCount=${r.productCount}`,
      `productReadyCount=${r.productReadyCount}`,
      `productDegradedCount=${r.productDegradedCount}`,
      `productBlockedCount=${r.productBlockedCount}`,
      `productFrameworkCount=${r.productFrameworkCount}`,
      `supportEngineCount=${r.supportEngineCount}`,
      `runtimeEngineCount=${r.runtimeEngineCount}`,
      `canvasExpressionCount=${r.canvasExpressionCount}`,
      `diagnosticEvidenceCount=${r.diagnosticEvidenceCount}`,
      "",
      `productQualityScore=${r.productQualityScore}`,
      `productCoverageScore=${r.productCoverageScore}`,
      `productTraceScore=${r.productTraceScore}`,
      `productCoherenceScore=${r.productCoherenceScore}`,
      `internalMarketSurpassTargetScore=${r.internalMarketSurpassTargetScore}`,
      `publicSuperiorityClaim=${r.publicSuperiorityClaim}`,
      `publicComparisonClaimAllowed=${r.publicComparisonClaimAllowed}`,
      `benchmarkRequiredBeforePublicClaim=${r.benchmarkRequiredBeforePublicClaim}`,
      "",
      `ue5ExpressionReleaseAuthorized=${r.ue5ExpressionReleaseAuthorized}`,
      `ue5ExpressionReceiptAccepted=${r.ue5ExpressionReceiptAccepted}`,
      `ue5ExpressionContract=${r.ue5ExpressionContract}`,
      `ue5ExpressionReceipt=${r.ue5ExpressionReceipt}`,
      "",
      `f34ReleasePacketReady=${r.f34ReleasePacketReady}`,
      `f34ActivationStatus=${r.f34ActivationStatus}`,
      `f34ActivationReason=${r.f34ActivationReason}`,
      `f34ReceiptReady=${r.f34ReceiptReady}`,
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
      "PRODUCTS",
      products,
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
    setDataset("labProductEngineLoaded", "true");
    setDataset("labProductEngineContract", CONTRACT);
    setDataset("labProductEngineReceipt", RECEIPT);
    setDataset("labProductEngineVersion", VERSION);
    setDataset("labProductEngineFile", FILE);

    setDataset("productEngineF34Active", "true");
    setDataset("productEngineF34Only", "true");
    setDataset("productEngineF34Ready", state.productEngineF34Ready);
    setDataset("productEngineAuthoritySlotActive", "true");
    setDataset("productEngineFirstConstruction", "true");

    setDataset("productEngineEngineMechanicsPrimary", "true");
    setDataset("productEngineMathPrimary", "true");
    setDataset("productEngineArchitectureLabelsSecondary", "true");
    setDataset("productEngineMechanicalCoordinateId", MECHANICAL_COORDINATE.coordinateId);
    setDataset("productEngineEnginePart", MECHANICAL_COORDINATE.enginePart);
    setDataset("productEngineSystemCategory", MECHANICAL_COORDINATE.systemCategory);
    setDataset("productEngineFibonacciStation", MECHANICAL_COORDINATE.fibonacciStage);
    setDataset("productEngineMechanicalRole", MECHANICAL_COORDINATE.mechanicalRole);

    setDataset("productEngineNorthRuntimeObserved", state.northRuntimeObserved);
    setDataset("productEngineNorthF21Acknowledged", state.northF21Acknowledged);
    setDataset("productEngineNorthF21Latched", state.northF21Latched);

    setDataset("productEngineProductGraphBuilt", state.productGraphBuilt);
    setDataset("productEngineProductGraphReady", state.productGraphReady);
    setDataset("productEngineProductGraphStatus", state.productGraphStatus);
    setDataset("productEngineProductCount", state.productCount);
    setDataset("productEngineProductReadyCount", state.productReadyCount);
    setDataset("productEngineProductDegradedCount", state.productDegradedCount);
    setDataset("productEngineProductBlockedCount", state.productBlockedCount);

    setDataset("productEngineProductQualityScore", state.productQualityScore);
    setDataset("productEngineProductCoverageScore", state.productCoverageScore);
    setDataset("productEngineProductTraceScore", state.productTraceScore);
    setDataset("productEngineProductCoherenceScore", state.productCoherenceScore);
    setDataset("productEngineInternalMarketSurpassTargetScore", state.internalMarketSurpassTargetScore);
    setDataset("productEnginePublicSuperiorityClaim", "false");
    setDataset("productEnginePublicComparisonClaimAllowed", "false");
    setDataset("productEngineBenchmarkRequiredBeforePublicClaim", "true");

    setDataset("productEngineUE5ExpressionReleaseAuthorized", state.ue5ExpressionReleaseAuthorized);
    setDataset("productEngineF34ReleasePacketReady", state.f34ReleasePacketReady);
    setDataset("productEngineF34ActivationStatus", state.f34ActivationStatus);
    setDataset("productEngineF34ActivationReason", state.f34ActivationReason);

    setDataset("productEngineNewsProtocolAligned", "true");
    setDataset("productEngineFibonacciSynchronizationMetricActive", "true");
    setDataset("productEngineFibonacciSynchronizationScore", state.fibonacciSynchronizationScore);
    setDataset("productEngineActiveFibonacci", FIBONACCI.PRODUCT_ENGINE);
    setDataset("productEngineActiveFibonacciRank", "34");
    setDataset("productEngineActiveNewsGate", NEWS_GATES.PRODUCT);
    setDataset("productEngineSourceFibonacciGate", FIBONACCI.NORTH_LATCH);
    setDataset("productEngineFutureFibonacciGate", FIBONACCI.UE5_EXPRESSION);

    setDataset("productEngineFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("productEngineRecommendedNextFile", state.recommendedNextFile);
    setDataset("productEngineRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);

    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function publishGlobals() {
    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.HEARTH = root.HEARTH || {};

    root.LAB_PRODUCT_ENGINE = api;
    root.LAB_PRODUCT_ENGINE_F34 = api;
    root.PRODUCT_ENGINE = api;
    root.PRODUCT_ENGINE_F34 = api;
    root.PRODUCT_ENGINE_CLERK = api;
    root.PRODUCT_ENGINE_AUTHORITY_SLOT = api;

    root.DEXTER_LAB.productEngine = api;
    root.DEXTER_LAB.productEngineF34 = api;
    root.DEXTER_LAB.productEngineClerk = api;
    root.DEXTER_LAB.productEngineAuthoritySlot = api;

    root.HEARTH.productEngine = api;
    root.HEARTH.productEngineF34 = api;
    root.HEARTH.productEngineClerk = api;
    root.HEARTH.productEngineAuthoritySlot = api;

    const light = getReceiptLight();

    root.LAB_PRODUCT_ENGINE_RECEIPT = light;
    root.LAB_PRODUCT_ENGINE_F34_RECEIPT = light;
    root.PRODUCT_ENGINE_RECEIPT = light;
    root.PRODUCT_ENGINE_F34_RECEIPT = light;
    root.PRODUCT_ENGINE_CLERK_RECEIPT = light;

    root.DEXTER_LAB.productEngineReceipt = light;
    root.HEARTH.productEngineReceipt = light;

    root.__LAB_PRODUCT_ENGINE_LOADED__ = true;
    root.__LAB_PRODUCT_ENGINE_CONTRACT__ = CONTRACT;
    root.__LAB_PRODUCT_ENGINE_RECEIPT__ = RECEIPT;
    root.__LAB_PRODUCT_ENGINE_F34_ONLY__ = true;
    root.__LAB_PRODUCT_ENGINE_F34_MECHANICAL_COORDINATE__ = MECHANICAL_COORDINATE.coordinateId;
    root.__LAB_PRODUCT_ENGINE_PUBLIC_SUPERIORITY_CLAIM__ = false;
    root.__LAB_PRODUCT_ENGINE_WEBGL__ = false;
    root.__LAB_PRODUCT_ENGINE_VISUAL_PASS_CLAIMED__ = false;

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
    PRODUCT_TYPES,
    MECHANICAL_COORDINATE,

    readNorthRuntimeAuthority,
    readNorthRuntimeReceipt,
    validateNorthRuntimeReceipt,
    acceptNorthRuntimeReceipt,

    normalizeProduct,
    evaluateProduct,
    registerProduct,
    seedCoreProducts,
    evaluateAllProducts,
    buildProductGraph,
    computeProductGraphQualityMetric,
    computeFibonacciSynchronizationMetric,
    evaluateNewsAlignment,

    readUE5ExpressionAuthority,
    validateUE5ExpressionF55Receipt,
    acceptUE5ExpressionF55Receipt,
    submitF34ReleaseToUE5Expression,

    composeF34Receipt,
    composeF34ReleasePacket,
    getMechanicalCoordinatePacket,

    getProduct,
    listProducts,
    getProductGraph,
    getProductGraphSummary,

    getReceiptLight,
    getReceipt,
    getReceiptText,
    publishGlobals,
    updateDataset,

    productEngineF34Active: true,
    productEngineF34Only: true,
    productEngineAuthoritySlotActive: true,
    firstConstruction: true,

    engineMechanicsPrimary: true,
    mathPrimary: true,
    architectureLabelsSecondary: true,

    ownsProductEngineF34AuthoritySlot: true,
    ownsDeterministicProductGraph: true,
    ownsProductReadinessClassification: true,
    ownsF55ExpressionHandoffPacket: true,
    ownsNewsFibonacciSynchronizationMetric: true,

    ownsNorthF21Latch: false,
    ownsUE5ExpressionF55Authority: false,
    ownsProjectRegistryF89Authority: false,
    ownsMarketF144Authority: false,
    ownsCanvasF13Evidence: false,
    ownsRouteOrchestration: false,
    ownsPlanetTruth: false,
    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
    ownsRendering: false,
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
    if (hasMeaningfulReceipt(northReceipt)) {
      acceptNorthRuntimeReceipt(northReceipt);
    }
  } catch (error) {
    recordError("INITIAL_NORTH_RUNTIME_READ_FAILED", error);
  }

  try {
    seedCoreProducts({ silent: true });
    buildProductGraph({ silent: true });
    computeFibonacciSynchronizationMetric();
  } catch (error) {
    recordError("INITIAL_PRODUCT_GRAPH_BUILD_FAILED", error);
  }

  recordLocal("PRODUCT_ENGINE_F34_FIRST_CONSTRUCTION_LOADED", {
    file: FILE,
    contract: CONTRACT,
    mechanicalCoordinate: MECHANICAL_COORDINATE.coordinateId,
    targetFile: UE5_EXPRESSION_FILE,
    firstConstruction: true,
    publicSuperiorityClaim: false
  });

  publishGlobals();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

// /assets/lab/product-engine.registry.js
// LAB_PRODUCT_ENGINE_REGISTRY_F89_PROJECT_CONDUCTOR_TNT_v1
// Full-file replacement.
// Product Engine F89 project registry conductor.
// Purpose:
// - Consume UE5 Expression F55 release.
// - Build the F89 project registry as a deterministic conductor map for the whole project.
// - Register engines, routes, products, expression nodes, files, evidence packets, and downstream market-readiness targets.
// - Preserve Product Engine F34 -> UE5 Expression F55 -> Registry F89 -> Market F144 sequence.
// - Preserve NEWS alignment protocol and Fibonacci synchronization metric.
// - Prepare F144 Market Readiness handoff without claiming public superiority, final visual pass, generated image, WebGL, or GraphicBox.
// Does not own:
// - North F21 latch
// - Product Engine F34 authority
// - UE5 Expression F55 authority
// - Canvas F13 evidence
// - route orchestration
// - planet truth
// - material truth
// - elevation truth
// - hydrology truth
// - actual rendering
// - public market claim
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "LAB_PRODUCT_ENGINE_REGISTRY_F89_PROJECT_CONDUCTOR_TNT_v1";
  const RECEIPT = "LAB_PRODUCT_ENGINE_REGISTRY_F89_PROJECT_CONDUCTOR_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "NONE_PROJECT_REGISTRY_FIRST_PUBLIC_F89_CONDUCTOR";
  const BASELINE_CONTRACT = "LAB_PRODUCT_ENGINE_REGISTRY_F89_PROJECT_CONDUCTOR_BASELINE_v1";
  const VERSION = "2026-06-01.lab-product-engine-registry-f89-project-conductor-v1";

  const FILE = "/assets/lab/product-engine.registry.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const PRODUCT_ENGINE_FILE = "/assets/lab/product-engine.js";
  const UE5_EXPRESSION_FILE = "/assets/lab/product-engine.ue5-expression.js";
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

  const ENTRY_TYPES = Object.freeze({
    ENGINE: "engine",
    ROUTE: "route",
    FILE: "file",
    PRODUCT: "product",
    EXPRESSION_NODE: "expression-node",
    RECEIPT: "receipt",
    MARKET_TARGET: "market-target",
    PROJECT: "project",
    EVIDENCE: "evidence"
  });

  const STATUS = Object.freeze({
    HELD: "HELD",
    ACTIVE: "ACTIVE",
    READY: "READY",
    DEGRADED: "DEGRADED",
    BLOCKED: "BLOCKED"
  });

  const CORE_PROJECT_FILES = Object.freeze([
    NORTH_FILE,
    PRODUCT_ENGINE_FILE,
    UE5_EXPRESSION_FILE,
    FILE,
    MARKET_FILE,
    "/showroom/globe/hearth/hearth.js",
    "/assets/hearth/hearth.canvas.js",
    "/assets/hearth/hearth.canvas.east.js",
    "/assets/hearth/hearth.canvas.west.js",
    "/assets/hearth/hearth.canvas.south.js"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    role: "product-engine-registry-f89-project-conductor",

    f89RegistryConductorActive: true,
    f89Only: true,
    f55ExpressionRequired: true,
    f55ExpressionObserved: false,
    f55ExpressionAccepted: false,
    f55ExpressionContract: "",
    f55ExpressionReceipt: "",
    f55ReleasePacket: null,

    productEngineF34Observed: false,
    productEngineF34Accepted: false,
    northF21Acknowledged: false,
    canvasF13EvidenceObserved: false,
    canvasF13EvidenceComplete: false,
    canvasF13EvidenceDegraded: false,

    registryBuilt: false,
    registryReady: false,
    registryStatus: STATUS.HELD,
    registryEntryCount: 0,
    registryReadyEntryCount: 0,
    registryDegradedEntryCount: 0,
    registryBlockedEntryCount: 0,
    registryProjectCount: 0,
    registryProductCount: 0,
    registryEngineCount: 0,
    registryRouteCount: 0,
    registryFileCount: 0,
    registryExpressionNodeCount: 0,
    registryEvidenceCount: 0,

    registry: {
      entries: {},
      projects: {},
      products: {},
      engines: {},
      routes: {},
      files: {},
      expressionNodes: {},
      evidence: {},
      edges: [],
      buildId: "",
      builtAt: ""
    },

    deterministicRegistryActive: true,
    projectConductorMapActive: true,
    registryIndexActive: true,
    receiptTraceActive: true,

    registryQualityMetricActive: true,
    registryQualityScore: 0,
    registryCoverageScore: 0,
    registryTraceScore: 0,
    registryCoherenceScore: 0,
    internalMarketSurpassTargetScore: 0,
    publicSuperiorityClaim: false,

    f144MarketReadinessGateReady: false,
    f144MarketReleaseAuthorized: false,
    f144MarketReceiptAccepted: false,

    newsProtocolAligned: true,
    fibonacciSynchronizationMetricActive: true,
    fibonacciSynchronizationScore: 0,
    activeFibonacci: FIBONACCI.PROJECT_REGISTRY,
    activeFibonacciRank: 89,
    activeNewsGate: NEWS_GATES.REGISTRY,
    sourceFibonacciGate: FIBONACCI.UE5_EXPRESSION,
    futureFibonacciGate: FIBONACCI.MARKET_READINESS,
    oneActiveGearAtATime: true,

    f89ActivationStatus: STATUS.HELD,
    f89ActivationReason: "WAITING_UE5_EXPRESSION_F55_RELEASE",
    f89ReceiptReady: true,
    f89ReleasePacketReady: false,

    firstFailedCoordinate: "WAITING_UE5_EXPRESSION_F55_RELEASE",
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

  function trim(list, max = 160) {
    if (Array.isArray(list) && list.length > max) {
      list.splice(0, list.length - max);
    }
  }

  function makeId(value, fallback = "entry") {
    const raw = safeString(value || fallback, fallback)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return raw || fallback;
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
      code: safeString(code, "PROJECT_REGISTRY_ERROR"),
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
      safeBool(packet.publicSuperiorityClaim, false) ||
      text.includes('"generatedImage":true') ||
      text.includes('"graphicBox":true') ||
      text.includes('"webGL":true') ||
      text.includes('"visualPassClaimed":true') ||
      text.includes('"publicSuperiorityClaim":true') ||
      text.includes("visualPassClaimed=true")
    );
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

  function readUE5ExpressionReceipt() {
    const authority = readUE5ExpressionAuthority();
    const receipt = readReceipt(authority);

    if (receipt && Object.keys(receipt).length) {
      state.f55ExpressionObserved = true;
      state.f55ExpressionContract = safeString(receipt.contract, "");
      state.f55ExpressionReceipt = safeString(receipt.receipt, "");
      state.productEngineF34Observed = safeBool(receipt.productEngineF34Observed, state.productEngineF34Observed);
      state.productEngineF34Accepted = safeBool(receipt.productEngineF34Accepted, state.productEngineF34Accepted);
      state.northF21Acknowledged = safeBool(receipt.northF21Acknowledged, state.northF21Acknowledged);
      state.canvasF13EvidenceObserved = safeBool(receipt.canvasF13EvidenceObserved, state.canvasF13EvidenceObserved);
      state.canvasF13EvidenceComplete = safeBool(receipt.canvasF13EvidenceComplete, state.canvasF13EvidenceComplete);
      state.canvasF13EvidenceDegraded = safeBool(receipt.canvasF13EvidenceDegraded, state.canvasF13EvidenceDegraded);
    }

    return receipt || {};
  }

  function expressionNodesFromReceipt(receipt = {}) {
    if (Array.isArray(receipt.expressionNodes)) return receipt.expressionNodes.slice();

    if (isObject(receipt.sceneGraph) && isObject(receipt.sceneGraph.nodes)) {
      return Object.values(receipt.sceneGraph.nodes);
    }

    return [];
  }

  function expressionProductsFromReceipt(receipt = {}) {
    if (isObject(receipt.sceneGraph) && Array.isArray(receipt.sceneGraph.products)) {
      return receipt.sceneGraph.products.map((id) => ({ id, name: id }));
    }

    const nodes = expressionNodesFromReceipt(receipt);
    const ids = Array.from(new Set(nodes.map((node) => safeString(node.productId, "")).filter(Boolean)));

    return ids.map((id) => ({ id, name: id }));
  }

  function validateF55Release(packet = {}) {
    const input = isObject(packet) && Object.keys(packet).length ? packet : readUE5ExpressionReceipt();
    const releasePacket = isObject(input.f55ReleasePacket) ? input.f55ReleasePacket : input;

    const noForbiddenClaim = !detectForbiddenClaim(input);
    const activeFibonacci = safeString(releasePacket.activeFibonacci || input.activeFibonacci, "");
    const futureFibonacciGate = safeString(releasePacket.futureFibonacciGate || input.futureFibonacciGate, "");

    const f55Ready = Boolean(
      safeBool(releasePacket.f55ExpressionReady, false) ||
      safeBool(releasePacket.expressionConductorReady, false) ||
      safeBool(releasePacket.sceneGraphConductorReady, false) ||
      safeBool(input.sceneGraphReady, false) ||
      safeBool(input.sceneGraphBuilt, false) ||
      safeBool(input.f55ReleasePacketReady, false)
    );

    const registryReleaseAuthorized = Boolean(
      safeBool(releasePacket.f89RegistryReleaseAuthorized, false) ||
      safeBool(input.f89RegistryReleaseAuthorized, false) ||
      safeBool(input.projectRegistryGateReady, false)
    );

    const ok = Boolean(
      noForbiddenClaim &&
      f55Ready &&
      registryReleaseAuthorized &&
      (
        activeFibonacci === FIBONACCI.UE5_EXPRESSION ||
        activeFibonacci === "F55" ||
        safeBool(input.f55Only, false)
      ) &&
      (
        futureFibonacciGate === FIBONACCI.PROJECT_REGISTRY ||
        futureFibonacciGate === "F89" ||
        registryReleaseAuthorized
      )
    );

    let reason = "NONE_UE5_EXPRESSION_F55_ACCEPTED";

    if (!noForbiddenClaim) reason = "FORBIDDEN_CLAIM_DETECTED_IN_F55_PACKET";
    else if (!f55Ready) reason = "WAITING_UE5_EXPRESSION_F55_READY";
    else if (!registryReleaseAuthorized) reason = "WAITING_F89_REGISTRY_RELEASE_AUTHORIZATION";
    else if (activeFibonacci && activeFibonacci !== FIBONACCI.UE5_EXPRESSION && activeFibonacci !== "F55") {
      reason = "UE5_EXPRESSION_FIBONACCI_NOT_F55";
    } else if (futureFibonacciGate && futureFibonacciGate !== FIBONACCI.PROJECT_REGISTRY && futureFibonacciGate !== "F89") {
      reason = "UE5_EXPRESSION_FUTURE_GATE_NOT_F89";
    }

    return {
      ok,
      reason,
      input: clonePlain(input),
      f55ReleasePacket: clonePlain(releasePacket),
      expressionNodes: expressionNodesFromReceipt(input),
      products: expressionProductsFromReceipt(input),
      activeFibonacci,
      futureFibonacciGate,
      f55Ready,
      registryReleaseAuthorized,
      noForbiddenClaim
    };
  }

  function acceptF55Release(packet = {}) {
    const validation = validateF55Release(packet);

    state.f55ExpressionAccepted = validation.ok;
    state.f55ReleasePacket = clonePlain(validation.f55ReleasePacket);
    state.f55ExpressionObserved = true;

    if (validation.input.contract) state.f55ExpressionContract = safeString(validation.input.contract);
    if (validation.input.receipt) state.f55ExpressionReceipt = safeString(validation.input.receipt);

    state.productEngineF34Observed = safeBool(validation.input.productEngineF34Observed, state.productEngineF34Observed);
    state.productEngineF34Accepted = safeBool(validation.input.productEngineF34Accepted, state.productEngineF34Accepted);
    state.northF21Acknowledged = safeBool(validation.input.northF21Acknowledged, state.northF21Acknowledged);
    state.canvasF13EvidenceObserved = safeBool(validation.input.canvasF13EvidenceObserved, state.canvasF13EvidenceObserved);
    state.canvasF13EvidenceComplete = safeBool(validation.input.canvasF13EvidenceComplete, state.canvasF13EvidenceComplete);
    state.canvasF13EvidenceDegraded = safeBool(validation.input.canvasF13EvidenceDegraded, state.canvasF13EvidenceDegraded);

    if (validation.ok) {
      state.f89ActivationStatus = STATUS.ACTIVE;
      state.f89ActivationReason = "UE5_EXPRESSION_F55_RELEASE_ACCEPTED_PROJECT_REGISTRY_F89_ACTIVE";
      state.firstFailedCoordinate = "NONE_PROJECT_REGISTRY_F89_ACTIVE";
      state.recommendedNextFile = MARKET_FILE;
      state.recommendedNextRenewalTarget = MARKET_FILE;

      seedCoreRegistryEntries({ silent: true });

      validation.products.forEach((product) => {
        registerRegistryEntry({
          type: ENTRY_TYPES.PRODUCT,
          id: product.id || product.key || product.name,
          label: product.name || product.label || product.id,
          sourceFile: UE5_EXPRESSION_FILE,
          sourceFibonacciGate: FIBONACCI.UE5_EXPRESSION,
          activeFibonacci: FIBONACCI.PROJECT_REGISTRY,
          receiptReady: true,
          platformReady: true,
          engineeringReady: true,
          expressionReady: true,
          registryReady: true,
          marketReady: false
        }, { silent: true });
      });

      validation.expressionNodes.forEach((node) => {
        registerRegistryEntry({
          type: ENTRY_TYPES.EXPRESSION_NODE,
          id: node.id,
          label: node.label || node.id,
          productId: node.productId,
          sourceFile: UE5_EXPRESSION_FILE,
          sourceContract: node.contract || validation.input.contract || "",
          sourceReceipt: node.receipt || validation.input.receipt || "",
          sourceFibonacciGate: FIBONACCI.UE5_EXPRESSION,
          activeFibonacci: FIBONACCI.PROJECT_REGISTRY,
          receiptReady: true,
          platformReady: safeBool(node.platformReady, true),
          engineeringReady: safeBool(node.engineeringReady, true),
          expressionReady: safeBool(node.expressionReady, true),
          registryReady: true,
          marketReady: false,
          dependencies: Array.isArray(node.dependencies) ? node.dependencies.slice() : []
        }, { silent: true });
      });

      recordLocal("UE5_EXPRESSION_F55_RELEASE_ACCEPTED_BY_PROJECT_REGISTRY", {
        productCount: validation.products.length,
        expressionNodeCount: validation.expressionNodes.length,
        f55ExpressionContract: state.f55ExpressionContract
      });
    } else {
      state.f89ActivationStatus = STATUS.HELD;
      state.f89ActivationReason = validation.reason;
      state.firstFailedCoordinate = validation.reason;
      state.recommendedNextFile = UE5_EXPRESSION_FILE;
      state.recommendedNextRenewalTarget = UE5_EXPRESSION_FILE;

      recordLocal("UE5_EXPRESSION_F55_RELEASE_HELD_BY_PROJECT_REGISTRY", {
        reason: validation.reason
      });
    }

    buildProjectRegistry({ silent: true });
    computeFibonacciSynchronizationMetric();
    publishGlobals();
    updateDataset();

    return {
      accepted: validation.ok,
      projectRegistryF89Active: validation.ok,
      reason: validation.reason,
      productsImported: validation.products.length,
      expressionNodesImported: validation.expressionNodes.length,
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

  function normalizeRegistryEntry(definition = {}) {
    const source = isObject(definition) ? definition : {};
    const type = safeString(source.type || source.entryType || ENTRY_TYPES.PROJECT, ENTRY_TYPES.PROJECT);
    const id = makeId(source.id || source.key || source.name || `${type}-${Object.keys(state.registry.entries).length + 1}`, `${type}-entry`);
    const sourceFile = safeString(source.sourceFile || source.file || "");

    return {
      id,
      type,
      label: safeString(source.label || source.name || id),
      productId: makeId(source.productId || source.product || id, id),
      projectId: makeId(source.projectId || source.project || "diamond-gate-bridge", "diamond-gate-bridge"),
      route: safeString(source.route || ""),
      file: sourceFile,
      sourceFile,
      targetFile: safeString(source.targetFile || ""),
      sourceContract: safeString(source.sourceContract || source.contract || ""),
      sourceReceipt: safeString(source.sourceReceipt || source.receipt || ""),
      sourceFibonacciGate: safeString(source.sourceFibonacciGate || FIBONACCI.UE5_EXPRESSION),
      activeFibonacci: safeString(source.activeFibonacci || FIBONACCI.PROJECT_REGISTRY),
      futureFibonacciGate: safeString(source.futureFibonacciGate || FIBONACCI.MARKET_READINESS),
      priority: clamp(source.priority ?? 50, 0, 100),
      dependencies: Array.isArray(source.dependencies) ? source.dependencies.slice() : [],
      tags: Array.isArray(source.tags) ? source.tags.slice() : [],
      receiptReady: safeBool(source.receiptReady, Boolean(source.sourceContract || source.sourceReceipt || source.contract || source.receipt)),
      platformReady: safeBool(source.platformReady, false),
      engineeringReady: safeBool(source.engineeringReady, false),
      expressionReady: safeBool(source.expressionReady, false),
      registryReady: safeBool(source.registryReady, false),
      marketReady: safeBool(source.marketReady, false),
      publicReady: safeBool(source.publicReady, false),
      internalOnly: safeBool(source.internalOnly, true),
      ownsRendering: false,
      ownsTruth: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      createdAt: safeString(source.createdAt || nowIso()),
      updatedAt: nowIso()
    };
  }

  function evaluateRegistryEntry(entry = {}) {
    const item = normalizeRegistryEntry(entry);
    const missing = [];

    if (!state.f55ExpressionAccepted) missing.push("f55ExpressionAccepted");
    if (!item.id) missing.push("id");
    if (!item.type) missing.push("type");
    if (!item.receiptReady) missing.push("receiptReady");
    if (!item.platformReady) missing.push("platformReady");
    if (!item.engineeringReady) missing.push("engineeringReady");
    if (!item.registryReady) missing.push("registryReady");

    const readinessScore = clamp(
      (state.f55ExpressionAccepted ? 16 : 0) +
      (item.id ? 8 : 0) +
      (item.type ? 8 : 0) +
      (item.file || item.route ? 8 : 0) +
      (item.receiptReady ? 12 : 0) +
      (item.platformReady ? 12 : 0) +
      (item.engineeringReady ? 12 : 0) +
      (item.expressionReady ? 10 : 0) +
      (item.registryReady ? 12 : 0) +
      (item.futureFibonacciGate === FIBONACCI.MARKET_READINESS ? 8 : 0),
      0,
      100
    );

    const status =
      missing.includes("f55ExpressionAccepted")
        ? STATUS.HELD
        : missing.includes("receiptReady")
          ? STATUS.BLOCKED
          : readinessScore >= 88
            ? STATUS.READY
            : readinessScore >= 64
              ? STATUS.DEGRADED
              : STATUS.HELD;

    return {
      ...item,
      readinessScore,
      status,
      missing,
      f89RegistryEntryEvaluated: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      evaluatedAt: nowIso()
    };
  }

  function registerRegistryEntry(definition = {}, options = {}) {
    const evaluated = evaluateRegistryEntry(definition);
    state.registry.entries[evaluated.id] = evaluated;

    if (evaluated.type === ENTRY_TYPES.PROJECT) state.registry.projects[evaluated.id] = evaluated;
    if (evaluated.type === ENTRY_TYPES.PRODUCT) state.registry.products[evaluated.id] = evaluated;
    if (evaluated.type === ENTRY_TYPES.ENGINE) state.registry.engines[evaluated.id] = evaluated;
    if (evaluated.type === ENTRY_TYPES.ROUTE) state.registry.routes[evaluated.id] = evaluated;
    if (evaluated.type === ENTRY_TYPES.FILE) state.registry.files[evaluated.id] = evaluated;
    if (evaluated.type === ENTRY_TYPES.EXPRESSION_NODE) state.registry.expressionNodes[evaluated.id] = evaluated;
    if (evaluated.type === ENTRY_TYPES.EVIDENCE || evaluated.type === ENTRY_TYPES.RECEIPT) {
      state.registry.evidence[evaluated.id] = evaluated;
    }

    if (options.silent !== true) {
      recordLocal("REGISTRY_ENTRY_REGISTERED", {
        id: evaluated.id,
        type: evaluated.type,
        status: evaluated.status,
        readinessScore: evaluated.readinessScore
      });
    }

    buildProjectRegistry({ silent: true });
    computeFibonacciSynchronizationMetric();
    publishGlobals();
    updateDataset();

    return evaluated;
  }

  function seedCoreRegistryEntries(options = {}) {
    registerRegistryEntry({
      id: "diamond-gate-bridge-project",
      type: ENTRY_TYPES.PROJECT,
      label: "Diamond Gate Bridge Project",
      sourceFile: FILE,
      sourceContract: CONTRACT,
      sourceReceipt: RECEIPT,
      receiptReady: true,
      platformReady: true,
      engineeringReady: true,
      expressionReady: true,
      registryReady: true,
      marketReady: false,
      priority: 100
    }, { silent: true });

    registerRegistryEntry({
      id: "north-runtime-table-engine",
      type: ENTRY_TYPES.ENGINE,
      label: "North Runtime Table Engine",
      sourceFile: NORTH_FILE,
      sourceFibonacciGate: FIBONACCI.NORTH_LATCH,
      receiptReady: true,
      platformReady: true,
      engineeringReady: true,
      expressionReady: true,
      registryReady: true,
      marketReady: false,
      priority: 96
    }, { silent: true });

    registerRegistryEntry({
      id: "product-engine-f34",
      type: ENTRY_TYPES.ENGINE,
      label: "Product Engine F34",
      sourceFile: PRODUCT_ENGINE_FILE,
      sourceFibonacciGate: FIBONACCI.PRODUCT_ENGINE,
      receiptReady: true,
      platformReady: true,
      engineeringReady: true,
      expressionReady: true,
      registryReady: true,
      marketReady: false,
      priority: 94
    }, { silent: true });

    registerRegistryEntry({
      id: "ue5-expression-f55",
      type: ENTRY_TYPES.ENGINE,
      label: "UE5 Expression F55",
      sourceFile: UE5_EXPRESSION_FILE,
      sourceFibonacciGate: FIBONACCI.UE5_EXPRESSION,
      sourceContract: state.f55ExpressionContract,
      sourceReceipt: state.f55ExpressionReceipt,
      receiptReady: true,
      platformReady: true,
      engineeringReady: true,
      expressionReady: true,
      registryReady: true,
      marketReady: false,
      priority: 92
    }, { silent: true });

    CORE_PROJECT_FILES.forEach((file, index) => {
      registerRegistryEntry({
        id: `file-${makeId(file, `file-${index + 1}`)}`,
        type: ENTRY_TYPES.FILE,
        label: file,
        sourceFile: file,
        receiptReady: true,
        platformReady: true,
        engineeringReady: true,
        expressionReady: file.includes("canvas") || file.includes("product") || file.includes("runtime"),
        registryReady: true,
        marketReady: false,
        priority: 70 - index
      }, { silent: true });
    });

    if (options.silent !== true) {
      recordLocal("CORE_PROJECT_REGISTRY_ENTRIES_SEEDED", {
        fileCount: CORE_PROJECT_FILES.length
      });
    }
  }

  function evaluateAllRegistryEntries() {
    const current = Object.values(state.registry.entries);
    const evaluated = {};

    current.forEach((entry) => {
      const next = evaluateRegistryEntry(entry);
      evaluated[next.id] = next;
    });

    state.registry.entries = evaluated;

    state.registry.projects = {};
    state.registry.products = {};
    state.registry.engines = {};
    state.registry.routes = {};
    state.registry.files = {};
    state.registry.expressionNodes = {};
    state.registry.evidence = {};

    Object.values(evaluated).forEach((entry) => {
      if (entry.type === ENTRY_TYPES.PROJECT) state.registry.projects[entry.id] = entry;
      if (entry.type === ENTRY_TYPES.PRODUCT) state.registry.products[entry.id] = entry;
      if (entry.type === ENTRY_TYPES.ENGINE) state.registry.engines[entry.id] = entry;
      if (entry.type === ENTRY_TYPES.ROUTE) state.registry.routes[entry.id] = entry;
      if (entry.type === ENTRY_TYPES.FILE) state.registry.files[entry.id] = entry;
      if (entry.type === ENTRY_TYPES.EXPRESSION_NODE) state.registry.expressionNodes[entry.id] = entry;
      if (entry.type === ENTRY_TYPES.EVIDENCE || entry.type === ENTRY_TYPES.RECEIPT) {
        state.registry.evidence[entry.id] = entry;
      }
    });

    return Object.values(state.registry.entries);
  }

  function buildProjectRegistry(options = {}) {
    const entries = evaluateAllRegistryEntries();

    const edges = [];

    entries.forEach((entry) => {
      entry.dependencies.forEach((dependency) => {
        edges.push({
          from: dependency,
          to: entry.id,
          type: "dependency",
          entryType: entry.type,
          deterministic: true
        });
      });

      if (entry.sourceFile) {
        edges.push({
          from: makeId(entry.sourceFile, "source-file"),
          to: entry.id,
          type: "source-file",
          deterministic: true
        });
      }
    });

    const sortedEntries = entries.slice().sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      if (a.type !== b.type) return a.type.localeCompare(b.type);
      return a.id.localeCompare(b.id);
    });

    state.registry.entries = sortedEntries.reduce((acc, entry) => {
      acc[entry.id] = entry;
      return acc;
    }, {});

    state.registry.edges = edges;
    state.registry.buildId = `f89-project-registry-${sortedEntries.length}-${edges.length}`;
    state.registry.builtAt = nowIso();

    state.registryBuilt = true;
    state.registryEntryCount = sortedEntries.length;
    state.registryReadyEntryCount = sortedEntries.filter((entry) => entry.status === STATUS.READY).length;
    state.registryDegradedEntryCount = sortedEntries.filter((entry) => entry.status === STATUS.DEGRADED).length;
    state.registryBlockedEntryCount = sortedEntries.filter((entry) => entry.status === STATUS.BLOCKED || entry.status === STATUS.HELD).length;

    state.registryProjectCount = Object.keys(state.registry.projects).length;
    state.registryProductCount = Object.keys(state.registry.products).length;
    state.registryEngineCount = Object.keys(state.registry.engines).length;
    state.registryRouteCount = Object.keys(state.registry.routes).length;
    state.registryFileCount = Object.keys(state.registry.files).length;
    state.registryExpressionNodeCount = Object.keys(state.registry.expressionNodes).length;
    state.registryEvidenceCount = Object.keys(state.registry.evidence).length;

    state.registryReady = Boolean(
      state.f55ExpressionAccepted &&
      state.registryEntryCount > 0 &&
      state.registryBlockedEntryCount === 0
    );

    if (state.registryReady) {
      state.registryStatus = STATUS.READY;
      state.f89ActivationStatus = STATUS.READY;
      state.f89ActivationReason = "PROJECT_REGISTRY_F89_READY";
      state.f89ReleasePacketReady = true;
      state.f144MarketReadinessGateReady = true;
      state.f144MarketReleaseAuthorized = true;
      state.firstFailedCoordinate = "NONE_PROJECT_REGISTRY_F89_READY_MARKET_F144_RELEASE_AUTHORIZED";
      state.recommendedNextFile = MARKET_FILE;
      state.recommendedNextRenewalTarget = MARKET_FILE;
    } else if (state.f55ExpressionAccepted && state.registryEntryCount > 0) {
      state.registryStatus = STATUS.DEGRADED;
      state.f89ActivationStatus = STATUS.DEGRADED;
      state.f89ActivationReason = "PROJECT_REGISTRY_F89_DEGRADED_MARKET_F144_RELEASE_AVAILABLE";
      state.f89ReleasePacketReady = true;
      state.f144MarketReadinessGateReady = true;
      state.f144MarketReleaseAuthorized = true;
      state.firstFailedCoordinate = "NONE_PROJECT_REGISTRY_F89_DEGRADED_MARKET_F144_RELEASE_AVAILABLE";
      state.recommendedNextFile = MARKET_FILE;
      state.recommendedNextRenewalTarget = MARKET_FILE;
    } else {
      state.registryStatus = STATUS.HELD;
      state.f89ActivationStatus = STATUS.HELD;
      state.f89ActivationReason = state.f55ExpressionAccepted ? "WAITING_REGISTRY_ENTRIES" : "WAITING_UE5_EXPRESSION_F55_RELEASE";
      state.f89ReleasePacketReady = false;
      state.f144MarketReadinessGateReady = false;
      state.f144MarketReleaseAuthorized = false;
      state.firstFailedCoordinate = state.f89ActivationReason;
      state.recommendedNextFile = state.f55ExpressionAccepted ? FILE : UE5_EXPRESSION_FILE;
      state.recommendedNextRenewalTarget = state.recommendedNextFile;
    }

    computeRegistryQualityMetric();
    computeFibonacciSynchronizationMetric();

    if (options.silent !== true) {
      recordLocal("PROJECT_REGISTRY_F89_BUILT", {
        entryCount: state.registryEntryCount,
        edgeCount: edges.length,
        ready: state.registryReady,
        status: state.registryStatus
      });
    }

    updateDataset();
    return clonePlain(state.registry);
  }

  function computeRegistryQualityMetric() {
    const entryCount = Math.max(1, state.registryEntryCount);
    const readyRatio = state.registryReadyEntryCount / entryCount;
    const degradedRatio = state.registryDegradedEntryCount / entryCount;
    const blockedRatio = state.registryBlockedEntryCount / entryCount;

    const typeCoverage = [
      state.registryProjectCount > 0,
      state.registryProductCount > 0,
      state.registryEngineCount > 0,
      state.registryFileCount > 0,
      state.registryExpressionNodeCount > 0
    ].filter(Boolean).length / 5;

    state.registryCoverageScore = clamp(Math.round(typeCoverage * 100), 0, 100);

    state.registryTraceScore = clamp(
      Math.round(
        35 +
        Math.min(30, state.registryEntryCount * 1.8) +
        Math.min(20, state.registry.edges.length * 0.8) +
        (state.f55ExpressionAccepted ? 15 : 0)
      ),
      0,
      100
    );

    state.registryCoherenceScore = clamp(
      Math.round(
        (readyRatio * 56) +
        (degradedRatio * 24) -
        (blockedRatio * 42) +
        (state.registryCoverageScore * 0.10) +
        (state.registryTraceScore * 0.10)
      ),
      0,
      100
    );

    state.registryQualityScore = clamp(
      Math.round(
        (state.registryCoherenceScore * 0.48) +
        (state.registryCoverageScore * 0.26) +
        (state.registryTraceScore * 0.26)
      ),
      0,
      100
    );

    state.internalMarketSurpassTargetScore = clamp(
      Math.round(
        (state.registryQualityScore * 0.36) +
        (state.registryCoverageScore * 0.20) +
        (state.registryTraceScore * 0.20) +
        (state.registryCoherenceScore * 0.14) +
        (state.fibonacciSynchronizationScore * 0.10)
      ),
      0,
      100
    );

    return {
      registryQualityScore: state.registryQualityScore,
      registryCoverageScore: state.registryCoverageScore,
      registryTraceScore: state.registryTraceScore,
      registryCoherenceScore: state.registryCoherenceScore,
      internalMarketSurpassTargetScore: state.internalMarketSurpassTargetScore,
      publicSuperiorityClaim: false
    };
  }

  function computeFibonacciSynchronizationMetric() {
    const checks = [
      state.newsProtocolAligned,
      state.oneActiveGearAtATime,
      state.activeFibonacci === FIBONACCI.PROJECT_REGISTRY,
      state.sourceFibonacciGate === FIBONACCI.UE5_EXPRESSION,
      state.futureFibonacciGate === FIBONACCI.MARKET_READINESS,
      state.activeNewsGate === NEWS_GATES.REGISTRY,
      state.f55ExpressionObserved,
      state.f55ExpressionAccepted,
      state.f89RegistryConductorActive,
      state.deterministicRegistryActive,
      state.projectConductorMapActive,
      state.registryIndexActive,
      state.receiptTraceActive,
      state.registryBuilt,
      state.f89ReceiptReady,
      !state.publicSuperiorityClaim,
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
      futureFibonacciGate: FIBONACCI.MARKET_READINESS
    };
  }

  function evaluateNewsAlignment() {
    const metric = computeFibonacciSynchronizationMetric();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      newsAlignmentContract: "LAB_PRODUCT_ENGINE_REGISTRY_F89_NEWS_ALIGNMENT_PROTOCOL_v1",
      newsAlignmentReceipt: "LAB_PRODUCT_ENGINE_REGISTRY_F89_NEWS_ALIGNMENT_PROTOCOL_RECEIPT_v1",
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
          file: UE5_EXPRESSION_FILE,
          ready: state.f55ExpressionAccepted
        },
        {
          gate: NEWS_GATES.REGISTRY,
          fibonacci: FIBONACCI.PROJECT_REGISTRY,
          file: FILE,
          ready: state.registryBuilt
        },
        {
          gate: NEWS_GATES.MARKET,
          fibonacci: FIBONACCI.MARKET_READINESS,
          file: MARKET_FILE,
          ready: state.f144MarketReleaseAuthorized
        }
      ],
      fibonacciSynchronizationScore: metric.score,
      f89Status: state.f89ActivationStatus,
      registryStatus: state.registryStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function composeF89Receipt() {
    return getReceipt();
  }

  function composeF89ReleasePacket(extra = {}) {
    const metric = computeFibonacciSynchronizationMetric();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "PROJECT_REGISTRY_F89_RELEASE_PACKET",
      sourceFile: FILE,
      targetFile: MARKET_FILE,
      destinationFile: MARKET_FILE,

      activeFibonacci: FIBONACCI.PROJECT_REGISTRY,
      activeFibonacciRank: 89,
      activeNewsGate: NEWS_GATES.REGISTRY,
      sourceFibonacciGate: FIBONACCI.UE5_EXPRESSION,
      futureFibonacciGate: FIBONACCI.MARKET_READINESS,
      futureFibonacciRank: 144,

      f55ExpressionAccepted: state.f55ExpressionAccepted,
      projectRegistryF89Current: state.registryBuilt,
      projectRegistryReady: state.registryReady || state.registryStatus === STATUS.DEGRADED,
      registryConductorReady: state.registryReady || state.registryStatus === STATUS.DEGRADED,
      f144MarketReleaseAuthorized: state.f144MarketReleaseAuthorized,

      registryBuilt: state.registryBuilt,
      registryReady: state.registryReady,
      registryStatus: state.registryStatus,
      registryEntryCount: state.registryEntryCount,
      registryProjectCount: state.registryProjectCount,
      registryProductCount: state.registryProductCount,
      registryEngineCount: state.registryEngineCount,
      registryFileCount: state.registryFileCount,
      registryExpressionNodeCount: state.registryExpressionNodeCount,

      registryQualityScore: state.registryQualityScore,
      registryCoverageScore: state.registryCoverageScore,
      registryTraceScore: state.registryTraceScore,
      registryCoherenceScore: state.registryCoherenceScore,
      internalMarketSurpassTargetScore: state.internalMarketSurpassTargetScore,
      publicSuperiorityClaim: false,

      newsProtocolAligned: true,
      fibonacciSynchronizationMetricActive: true,
      fibonacciSynchronizationScore: metric.score,
      oneActiveGearAtATime: true,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      registry: clonePlain(state.registry),
      detail: clonePlain(extra),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      composedAt: nowIso()
    };
  }

  function submitF89ReceiptToUE5Expression() {
    const authority = readUE5ExpressionAuthority();

    if (!authority || !isFunction(authority.acceptProjectRegistryF89Receipt)) {
      return {
        submitted: false,
        reason: "UE5_EXPRESSION_ACCEPT_METHOD_UNAVAILABLE",
        recommendedNextFile: UE5_EXPRESSION_FILE,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };
    }

    try {
      const response = authority.acceptProjectRegistryF89Receipt(composeF89ReleasePacket());
      recordLocal("F89_RECEIPT_SUBMITTED_TO_UE5_EXPRESSION", {
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
      recordError("F89_SUBMISSION_TO_UE5_EXPRESSION_FAILED", error);
      return {
        submitted: false,
        reason: "F89_SUBMISSION_TO_UE5_EXPRESSION_FAILED",
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };
    }
  }

  function getRegistryEntry(id) {
    const key = makeId(id, "");
    return clonePlain(state.registry.entries[key] || null);
  }

  function listRegistryEntries(type = "") {
    const entries = Object.values(state.registry.entries);
    if (!type) return clonePlain(entries);
    return clonePlain(entries.filter((entry) => entry.type === type));
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

      f89RegistryConductorActive: true,
      f89Only: true,
      f55ExpressionRequired: true,
      f55ExpressionObserved: state.f55ExpressionObserved,
      f55ExpressionAccepted: state.f55ExpressionAccepted,
      f55ExpressionContract: state.f55ExpressionContract,
      f55ExpressionReceipt: state.f55ExpressionReceipt,

      productEngineF34Observed: state.productEngineF34Observed,
      productEngineF34Accepted: state.productEngineF34Accepted,
      northF21Acknowledged: state.northF21Acknowledged,
      canvasF13EvidenceObserved: state.canvasF13EvidenceObserved,
      canvasF13EvidenceComplete: state.canvasF13EvidenceComplete,
      canvasF13EvidenceDegraded: state.canvasF13EvidenceDegraded,

      deterministicRegistryActive: true,
      projectConductorMapActive: true,
      registryIndexActive: true,
      receiptTraceActive: true,
      registryBuilt: state.registryBuilt,
      registryReady: state.registryReady,
      registryStatus: state.registryStatus,
      registryEntryCount: state.registryEntryCount,
      registryReadyEntryCount: state.registryReadyEntryCount,
      registryDegradedEntryCount: state.registryDegradedEntryCount,
      registryBlockedEntryCount: state.registryBlockedEntryCount,

      registryProjectCount: state.registryProjectCount,
      registryProductCount: state.registryProductCount,
      registryEngineCount: state.registryEngineCount,
      registryRouteCount: state.registryRouteCount,
      registryFileCount: state.registryFileCount,
      registryExpressionNodeCount: state.registryExpressionNodeCount,
      registryEvidenceCount: state.registryEvidenceCount,

      registryQualityMetricActive: true,
      registryQualityScore: state.registryQualityScore,
      registryCoverageScore: state.registryCoverageScore,
      registryTraceScore: state.registryTraceScore,
      registryCoherenceScore: state.registryCoherenceScore,
      internalMarketSurpassTargetScore: state.internalMarketSurpassTargetScore,
      publicSuperiorityClaim: false,

      f144MarketReadinessGateReady: state.f144MarketReadinessGateReady,
      f144MarketReleaseAuthorized: state.f144MarketReleaseAuthorized,
      f144MarketReceiptAccepted: state.f144MarketReceiptAccepted,

      newsProtocolAligned: true,
      fibonacciSynchronizationMetricActive: true,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      activeFibonacci: FIBONACCI.PROJECT_REGISTRY,
      activeFibonacciRank: 89,
      activeNewsGate: NEWS_GATES.REGISTRY,
      sourceFibonacciGate: FIBONACCI.UE5_EXPRESSION,
      futureFibonacciGate: FIBONACCI.MARKET_READINESS,
      oneActiveGearAtATime: true,

      f89ActivationStatus: state.f89ActivationStatus,
      f89ActivationReason: state.f89ActivationReason,
      f89ReceiptReady: true,
      f89ReleasePacketReady: state.f89ReleasePacketReady,

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

      projectRegistryReceipt: true,
      registryConductorOwns: [
        "F89 project registry conductorship",
        "deterministic project registry",
        "engine registry",
        "route registry",
        "file registry",
        "product registry",
        "expression-node registry",
        "receipt trace index",
        "F144 market-readiness handoff packet",
        "NEWS/Fibonacci synchronization metric"
      ],
      registryConductorDoesNotOwn: [
        "North F21 latch",
        "Product Engine F34 authority",
        "UE5 Expression F55 authority",
        "Canvas F13 evidence",
        "route orchestration",
        "planet truth",
        "material truth",
        "elevation truth",
        "hydrology truth",
        "actual rendering",
        "public market claim",
        "generated image",
        "GraphicBox",
        "WebGL",
        "final visual pass claim"
      ],

      gates: {
        north: NORTH_FILE,
        productEngine: PRODUCT_ENGINE_FILE,
        ue5Expression: UE5_EXPRESSION_FILE,
        registry: FILE,
        market: MARKET_FILE
      },

      entryTypes: clonePlain(ENTRY_TYPES),
      fibonacciMap: clonePlain(FIBONACCI),
      newsGates: clonePlain(NEWS_GATES),
      registry: clonePlain(state.registry),
      registryEntries: clonePlain(Object.values(state.registry.entries)),
      newsAlignment: evaluateNewsAlignment(),
      f89ReleasePacket: composeF89ReleasePacket(),
      f55ReleasePacket: clonePlain(state.f55ReleasePacket),

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

    const entries = (r.registryEntries || []).map((entry) => (
      `- ${entry.id} :: type=${entry.type} :: status=${entry.status} :: score=${entry.readinessScore} :: file=${entry.file || entry.sourceFile || ""}`
    )).join("\n") || "- none";

    const events = (r.localEvents || []).slice(-48).map((item) => (
      `- ${item.at} :: ${item.event} :: ${JSON.stringify(item.detail || {})}`
    )).join("\n") || "- none";

    const errors = (r.errors || []).map((item) => (
      `- ${item.at} :: ${item.code} :: ${item.message}`
    )).join("\n") || "- none";

    return [
      "LAB_PRODUCT_ENGINE_REGISTRY_F89_PROJECT_CONDUCTOR_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `role=${r.role}`,
      "",
      `f89RegistryConductorActive=${r.f89RegistryConductorActive}`,
      `f89Only=${r.f89Only}`,
      `f55ExpressionRequired=${r.f55ExpressionRequired}`,
      `f55ExpressionObserved=${r.f55ExpressionObserved}`,
      `f55ExpressionAccepted=${r.f55ExpressionAccepted}`,
      `f55ExpressionContract=${r.f55ExpressionContract}`,
      `f55ExpressionReceipt=${r.f55ExpressionReceipt}`,
      "",
      `productEngineF34Observed=${r.productEngineF34Observed}`,
      `productEngineF34Accepted=${r.productEngineF34Accepted}`,
      `northF21Acknowledged=${r.northF21Acknowledged}`,
      `canvasF13EvidenceObserved=${r.canvasF13EvidenceObserved}`,
      `canvasF13EvidenceComplete=${r.canvasF13EvidenceComplete}`,
      `canvasF13EvidenceDegraded=${r.canvasF13EvidenceDegraded}`,
      "",
      `deterministicRegistryActive=${r.deterministicRegistryActive}`,
      `projectConductorMapActive=${r.projectConductorMapActive}`,
      `registryIndexActive=${r.registryIndexActive}`,
      `receiptTraceActive=${r.receiptTraceActive}`,
      `registryBuilt=${r.registryBuilt}`,
      `registryReady=${r.registryReady}`,
      `registryStatus=${r.registryStatus}`,
      `registryEntryCount=${r.registryEntryCount}`,
      `registryReadyEntryCount=${r.registryReadyEntryCount}`,
      `registryDegradedEntryCount=${r.registryDegradedEntryCount}`,
      `registryBlockedEntryCount=${r.registryBlockedEntryCount}`,
      "",
      `registryProjectCount=${r.registryProjectCount}`,
      `registryProductCount=${r.registryProductCount}`,
      `registryEngineCount=${r.registryEngineCount}`,
      `registryRouteCount=${r.registryRouteCount}`,
      `registryFileCount=${r.registryFileCount}`,
      `registryExpressionNodeCount=${r.registryExpressionNodeCount}`,
      `registryEvidenceCount=${r.registryEvidenceCount}`,
      "",
      `registryQualityScore=${r.registryQualityScore}`,
      `registryCoverageScore=${r.registryCoverageScore}`,
      `registryTraceScore=${r.registryTraceScore}`,
      `registryCoherenceScore=${r.registryCoherenceScore}`,
      `internalMarketSurpassTargetScore=${r.internalMarketSurpassTargetScore}`,
      `publicSuperiorityClaim=${r.publicSuperiorityClaim}`,
      "",
      `f144MarketReadinessGateReady=${r.f144MarketReadinessGateReady}`,
      `f144MarketReleaseAuthorized=${r.f144MarketReleaseAuthorized}`,
      `f144MarketReceiptAccepted=${r.f144MarketReceiptAccepted}`,
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
      `f89ActivationStatus=${r.f89ActivationStatus}`,
      `f89ActivationReason=${r.f89ActivationReason}`,
      `f89ReceiptReady=${r.f89ReceiptReady}`,
      `f89ReleasePacketReady=${r.f89ReleasePacketReady}`,
      "",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      "",
      "REGISTRY_ENTRIES",
      entries,
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
    setDataset("labProductEngineRegistryLoaded", "true");
    setDataset("labProductEngineRegistryContract", CONTRACT);
    setDataset("labProductEngineRegistryReceipt", RECEIPT);
    setDataset("labProductEngineRegistryVersion", VERSION);
    setDataset("labProductEngineRegistryFile", FILE);

    setDataset("productEngineRegistryF89Only", "true");
    setDataset("productEngineRegistryConductorActive", "true");
    setDataset("productEngineRegistryF55ExpressionRequired", "true");
    setDataset("productEngineRegistryF55ExpressionObserved", state.f55ExpressionObserved);
    setDataset("productEngineRegistryF55ExpressionAccepted", state.f55ExpressionAccepted);

    setDataset("productEngineRegistryBuilt", state.registryBuilt);
    setDataset("productEngineRegistryReady", state.registryReady);
    setDataset("productEngineRegistryStatus", state.registryStatus);
    setDataset("productEngineRegistryEntryCount", state.registryEntryCount);
    setDataset("productEngineRegistryProjectCount", state.registryProjectCount);
    setDataset("productEngineRegistryProductCount", state.registryProductCount);
    setDataset("productEngineRegistryEngineCount", state.registryEngineCount);
    setDataset("productEngineRegistryRouteCount", state.registryRouteCount);
    setDataset("productEngineRegistryFileCount", state.registryFileCount);
    setDataset("productEngineRegistryExpressionNodeCount", state.registryExpressionNodeCount);

    setDataset("productEngineRegistryQualityScore", state.registryQualityScore);
    setDataset("productEngineRegistryCoverageScore", state.registryCoverageScore);
    setDataset("productEngineRegistryTraceScore", state.registryTraceScore);
    setDataset("productEngineRegistryCoherenceScore", state.registryCoherenceScore);
    setDataset("productEngineRegistryInternalMarketSurpassTargetScore", state.internalMarketSurpassTargetScore);
    setDataset("productEngineRegistryPublicSuperiorityClaim", "false");

    setDataset("productEngineRegistryF144MarketGateReady", state.f144MarketReadinessGateReady);
    setDataset("productEngineRegistryF144MarketReleaseAuthorized", state.f144MarketReleaseAuthorized);

    setDataset("productEngineRegistryNewsProtocolAligned", "true");
    setDataset("productEngineRegistryFibonacciSynchronizationMetricActive", "true");
    setDataset("productEngineRegistryFibonacciSynchronizationScore", state.fibonacciSynchronizationScore);
    setDataset("productEngineRegistryActiveFibonacci", FIBONACCI.PROJECT_REGISTRY);
    setDataset("productEngineRegistryActiveFibonacciRank", "89");
    setDataset("productEngineRegistryActiveNewsGate", NEWS_GATES.REGISTRY);
    setDataset("productEngineRegistrySourceFibonacciGate", FIBONACCI.UE5_EXPRESSION);
    setDataset("productEngineRegistryFutureFibonacciGate", FIBONACCI.MARKET_READINESS);

    setDataset("productEngineRegistryF89ActivationStatus", state.f89ActivationStatus);
    setDataset("productEngineRegistryF89ActivationReason", state.f89ActivationReason);
    setDataset("productEngineRegistryF89ReleasePacketReady", state.f89ReleasePacketReady);

    setDataset("productEngineRegistryFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("productEngineRegistryRecommendedNextFile", state.recommendedNextFile);
    setDataset("productEngineRegistryRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);

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

    root.DEXTER_LAB.productEngineRegistry = api;
    root.DEXTER_LAB.productEngineRegistryF89 = api;
    root.DEXTER_LAB.projectRegistryConductor = api;

    root.HEARTH.productEngineRegistry = api;
    root.HEARTH.productEngineRegistryF89 = api;
    root.HEARTH.projectRegistryConductor = api;

    const light = getReceiptLight();

    root.LAB_PRODUCT_ENGINE_REGISTRY_RECEIPT = light;
    root.LAB_PRODUCT_ENGINE_REGISTRY_F89_RECEIPT = light;
    root.PRODUCT_ENGINE_REGISTRY_RECEIPT = light;
    root.PROJECT_REGISTRY_CONDUCTOR_RECEIPT = light;

    root.DEXTER_LAB.productEngineRegistryReceipt = light;
    root.HEARTH.productEngineRegistryReceipt = light;

    root.__LAB_PRODUCT_ENGINE_REGISTRY_LOADED__ = true;
    root.__LAB_PRODUCT_ENGINE_REGISTRY_CONTRACT__ = CONTRACT;
    root.__LAB_PRODUCT_ENGINE_REGISTRY_RECEIPT__ = RECEIPT;
    root.__LAB_PRODUCT_ENGINE_REGISTRY_F89_ONLY__ = true;
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
    ENTRY_TYPES,
    STATUS,

    readUE5ExpressionAuthority,
    readUE5ExpressionReceipt,
    validateF55Release,
    acceptF55Release,

    normalizeRegistryEntry,
    evaluateRegistryEntry,
    registerRegistryEntry,
    seedCoreRegistryEntries,
    evaluateAllRegistryEntries,
    buildProjectRegistry,

    computeRegistryQualityMetric,
    computeFibonacciSynchronizationMetric,
    evaluateNewsAlignment,

    composeF89Receipt,
    composeF89ReleasePacket,
    submitF89ReceiptToUE5Expression,

    getRegistryEntry,
    listRegistryEntries,

    getReceiptLight,
    getReceipt,
    getReceiptText,
    publishGlobals,
    updateDataset,

    f89RegistryConductorActive: true,
    f89Only: true,
    f55ExpressionRequired: true,
    deterministicRegistryActive: true,
    projectConductorMapActive: true,
    registryIndexActive: true,
    receiptTraceActive: true,
    publicSuperiorityClaim: false,

    ownsF89ProjectRegistryConductorship: true,
    ownsDeterministicProjectRegistry: true,
    ownsEngineRegistry: true,
    ownsRouteRegistry: true,
    ownsFileRegistry: true,
    ownsProductRegistry: true,
    ownsExpressionNodeRegistry: true,
    ownsReceiptTraceIndex: true,
    ownsF144MarketHandoffPacket: true,
    ownsNewsFibonacciSynchronizationMetric: true,

    ownsNorthF21Latch: false,
    ownsProductEngineF34Authority: false,
    ownsUE5ExpressionF55Authority: false,
    ownsCanvasF13Evidence: false,
    ownsRouteOrchestration: false,
    ownsPlanetTruth: false,
    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
    ownsRendering: false,
    ownsPublicMarketClaim: false,
    ownsGeneratedImage: false,
    ownsGraphicBox: false,
    ownsWebGL: false,
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
    const receipt = readUE5ExpressionReceipt();
    acceptF55Release(receipt);
  } catch (error) {
    recordError("INITIAL_UE5_EXPRESSION_F55_READ_FAILED", error);
    computeFibonacciSynchronizationMetric();
  }

  recordLocal("PROJECT_REGISTRY_F89_CONDUCTOR_LOADED", {
    file: FILE,
    contract: CONTRACT,
    ue5ExpressionFile: UE5_EXPRESSION_FILE,
    marketFile: MARKET_FILE,
    f89Only: true,
    publicSuperiorityClaim: false
  });

  publishGlobals();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

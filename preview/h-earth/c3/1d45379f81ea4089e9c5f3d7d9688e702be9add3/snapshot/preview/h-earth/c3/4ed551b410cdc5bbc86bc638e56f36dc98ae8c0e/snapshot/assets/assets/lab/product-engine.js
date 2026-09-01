// /assets/lab/product-engine.js
// LAB_PRODUCT_ENGINE_F34_DOWNSTREAM_CONDUCTOR_TNT_v1
// Full-file replacement.
// Product Engine F34 downstream conductor.
// Purpose:
// - Stand up Product Engine as a post-F21 downstream conductor.
// - Consume North F21 release only; do not replace North.
// - Register product systems, conduct product readiness, and prepare UE5-derived expression handoff.
// - Publish NEWS alignment protocol and Fibonacci synchronization metric.
// - Keep Product Engine at F34; UE5-derived expression conductor remains F55.
// - Preserve project-wide deterministic conductorship without false visual-pass claims.
// Does not own:
// - North F21 latch
// - Canvas F13 evidence
// - route orchestration
// - planet truth
// - material truth
// - elevation truth
// - hydrology truth
// - WebGL
// - generated image
// - GraphicBox
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "LAB_PRODUCT_ENGINE_F34_DOWNSTREAM_CONDUCTOR_TNT_v1";
  const RECEIPT = "LAB_PRODUCT_ENGINE_F34_DOWNSTREAM_CONDUCTOR_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "NONE_PRODUCT_ENGINE_FIRST_PUBLIC_F34_CONDUCTOR";
  const BASELINE_CONTRACT = "LAB_PRODUCT_ENGINE_F34_DOWNSTREAM_CONDUCTOR_BASELINE_v1";
  const VERSION = "2026-06-01.lab-product-engine-f34-downstream-conductor-v1";

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
    role: "product-engine-f34-downstream-conductor",

    productEngineActive: true,
    productEngineF34Only: true,
    northF21Required: true,
    northF21Acknowledged: false,
    northReleasePacketAccepted: false,
    northReleasePacket: null,
    northContract: "",
    northReceipt: "",
    northCompletionLatched: false,
    northDegradedCompletionLatched: false,
    northDownstreamReleaseAuthorized: false,

    canvasF13EvidenceObserved: false,
    canvasF13EvidenceComplete: false,
    canvasF13EvidenceDegraded: false,

    productGraphActive: true,
    productCount: 0,
    productsReady: 0,
    productsDegraded: 0,
    productsBlocked: 0,
    products: {},

    ue5ExpressionGateReady: false,
    ue5ExpressionReceiptAccepted: false,
    ue5ExpressionContract: "",
    ue5ExpressionReceipt: "",
    ue5ExpressionF55Current: false,

    projectRegistryGateReady: false,
    projectRegistryReceiptAccepted: false,
    projectRegistryF89Current: false,

    marketReadinessGateReady: false,
    marketReadinessReceiptAccepted: false,
    marketF144Current: false,

    newsProtocolAligned: true,
    fibonacciSynchronizationMetricActive: true,
    fibonacciSynchronizationScore: 0,
    activeFibonacci: FIBONACCI.PRODUCT_ENGINE,
    activeFibonacciRank: 34,
    activeNewsGate: NEWS_GATES.PRODUCT,
    futureFibonacciGate: FIBONACCI.UE5_EXPRESSION,
    oneActiveGearAtATime: true,

    f34ActivationStatus: STATUS.HELD,
    f34ActivationReason: "WAITING_NORTH_F21_RELEASE",
    f34ReleasePacketReady: false,
    f34ReceiptReady: true,

    firstFailedCoordinate: "WAITING_NORTH_F21_RELEASE",
    recommendedNextFile: NORTH_FILE,
    recommendedNextRenewalTarget: NORTH_FILE,

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

  function trim(list, max = 120) {
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
      code: safeString(code, "PRODUCT_ENGINE_ERROR"),
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

      if (isFunction(authority.getTransmissionReceipt)) {
        const receipt = authority.getTransmissionReceipt();
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

  function datasetValue(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function readNorthAuthority() {
    return firstGlobal([
      "LAB_RUNTIME_TABLE_NORTH",
      "LAB_RUNTIME_TABLE",
      "RUNTIME_TABLE",
      "DexterRuntimeTable",
      "HEARTH_NORTH_COMMAND_RUNTIME_TABLE",
      "HEARTH.northCommandRuntimeTable",
      "HEARTH.northTwoCycleCanvasF13ReleaseDistributor",
      "DEXTER_LAB.runtimeTable",
      "DEXTER_LAB.cardinalRuntimeTableNorth",
      "DEXTER_LAB.northTwoCycleCanvasF13ReleaseDistributor"
    ]);
  }

  function readNorthReceipt() {
    const authority = readNorthAuthority();
    const receipt = readReceipt(authority);

    if (receipt && Object.keys(receipt).length) {
      state.northContract = safeString(receipt.contract, "");
      state.northReceipt = safeString(receipt.receipt, "");
      state.northCompletionLatched = safeBool(receipt.completionLatched, false);
      state.northDegradedCompletionLatched = safeBool(receipt.degradedCompletionLatched, false);
      state.northDownstreamReleaseAuthorized = safeBool(receipt.downstreamReleaseAuthorized, false);
      state.canvasF13EvidenceObserved = safeBool(receipt.canvasF13EvidenceReceived, state.canvasF13EvidenceObserved);
      state.canvasF13EvidenceComplete = safeBool(receipt.canvasF13EvidenceComplete, state.canvasF13EvidenceComplete);
      state.canvasF13EvidenceDegraded = safeBool(receipt.canvasF13EvidenceDegraded, state.canvasF13EvidenceDegraded);
    }

    return receipt || {};
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
      text.includes('"visualPassClaimed":true') ||
      text.includes("visualPassClaimed=true") ||
      text.includes('"generatedImage":true') ||
      text.includes('"graphicBox":true') ||
      text.includes('"webGL":true')
    );
  }

  function validateNorthF21Release(packet = {}) {
    const input = isObject(packet) ? packet : {};
    const receipt = Object.keys(input).length ? input : readNorthReceipt();

    const completionLatched = safeBool(receipt.completionLatched, false);
    const degradedCompletionLatched = safeBool(receipt.degradedCompletionLatched, false);
    const downstreamReleaseAuthorized = safeBool(receipt.downstreamReleaseAuthorized, false);
    const f21EligibleForNorth = safeBool(receipt.f21EligibleForNorth, false);
    const readyTextAllowed = safeBool(receipt.readyTextAllowed, false);

    const canvasEvidenceComplete = safeBool(receipt.canvasF13EvidenceComplete, false);
    const canvasEvidenceDegraded = safeBool(receipt.canvasF13EvidenceDegraded, false);
    const canvasEvidenceReceived = safeBool(receipt.canvasF13EvidenceReceived, false);

    const noForbiddenClaim = !detectForbiddenClaim(receipt);

    const northF21Ok = Boolean(
      noForbiddenClaim &&
      (
        downstreamReleaseAuthorized ||
        completionLatched ||
        degradedCompletionLatched ||
        f21EligibleForNorth ||
        readyTextAllowed
      ) &&
      (
        canvasEvidenceComplete ||
        canvasEvidenceDegraded ||
        canvasEvidenceReceived ||
        safeBool(receipt.newsGateDegradedBeforeF21, false)
      )
    );

    let reason = "NONE_NORTH_F21_RELEASE_ACCEPTABLE";

    if (!noForbiddenClaim) reason = "FORBIDDEN_CLAIM_DETECTED";
    else if (!completionLatched && !degradedCompletionLatched && !downstreamReleaseAuthorized && !f21EligibleForNorth && !readyTextAllowed) {
      reason = "WAITING_NORTH_F21_RELEASE";
    } else if (!canvasEvidenceComplete && !canvasEvidenceDegraded && !canvasEvidenceReceived && !safeBool(receipt.newsGateDegradedBeforeF21, false)) {
      reason = "WAITING_CANVAS_F13_EVIDENCE_BEFORE_PRODUCT_ENGINE";
    }

    return {
      ok: northF21Ok,
      reason,
      receipt: clonePlain(receipt),
      completionLatched,
      degradedCompletionLatched,
      downstreamReleaseAuthorized,
      f21EligibleForNorth,
      readyTextAllowed,
      canvasEvidenceComplete,
      canvasEvidenceDegraded,
      canvasEvidenceReceived,
      noForbiddenClaim
    };
  }

  function acceptNorthF21Release(packet = {}) {
    const validation = validateNorthF21Release(packet);

    state.northReleasePacket = clonePlain(validation.receipt);
    state.northF21Acknowledged = validation.ok;
    state.northReleasePacketAccepted = validation.ok;
    state.northCompletionLatched = validation.completionLatched;
    state.northDegradedCompletionLatched = validation.degradedCompletionLatched;
    state.northDownstreamReleaseAuthorized = validation.downstreamReleaseAuthorized;
    state.canvasF13EvidenceObserved = validation.canvasEvidenceReceived;
    state.canvasF13EvidenceComplete = validation.canvasEvidenceComplete;
    state.canvasF13EvidenceDegraded = validation.canvasEvidenceDegraded;

    if (validation.ok) {
      state.f34ActivationStatus = STATUS.ACTIVE;
      state.f34ActivationReason = "NORTH_F21_RELEASE_ACCEPTED_PRODUCT_ENGINE_F34_ACTIVE";
      state.f34ReleasePacketReady = true;
      state.firstFailedCoordinate = "NONE_PRODUCT_ENGINE_F34_ACTIVE";
      state.recommendedNextFile = UE5_EXPRESSION_FILE;
      state.recommendedNextRenewalTarget = UE5_EXPRESSION_FILE;
      recordLocal("NORTH_F21_RELEASE_ACCEPTED_BY_PRODUCT_ENGINE", {
        sourceContract: validation.receipt.contract || "",
        completionLatched: validation.completionLatched,
        degradedCompletionLatched: validation.degradedCompletionLatched,
        downstreamReleaseAuthorized: validation.downstreamReleaseAuthorized
      });
    } else {
      state.f34ActivationStatus = STATUS.HELD;
      state.f34ActivationReason = validation.reason;
      state.f34ReleasePacketReady = false;
      state.firstFailedCoordinate = validation.reason;
      state.recommendedNextFile = NORTH_FILE;
      state.recommendedNextRenewalTarget = NORTH_FILE;
      recordLocal("NORTH_F21_RELEASE_HELD_BY_PRODUCT_ENGINE", {
        reason: validation.reason
      });
    }

    computeFibonacciSynchronizationMetric();
    publishGlobals();
    updateDataset();

    return {
      accepted: validation.ok,
      productEngineF34Active: validation.ok,
      reason: validation.reason,
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

  function normalizeProduct(definition = {}) {
    const source = isObject(definition) ? definition : {};
    const id = safeString(source.id || source.key || source.slug || `product-${Object.keys(state.products).length + 1}`);
    const name = safeString(source.name || source.label || id);

    return {
      id,
      name,
      file: safeString(source.file || source.fileGate || ""),
      route: safeString(source.route || ""),
      contract: safeString(source.contract || ""),
      receipt: safeString(source.receipt || ""),
      category: safeString(source.category || "product"),
      active: source.active !== false,
      platformReady: safeBool(source.platformReady, false),
      engineeringReady: safeBool(source.engineeringReady, false),
      receiptReady: safeBool(source.receiptReady, Boolean(source.receipt || source.contract)),
      expressionReady: safeBool(source.expressionReady, false),
      registryReady: safeBool(source.registryReady, false),
      marketReady: safeBool(source.marketReady, false),
      score: clamp(source.score ?? 0, 0, 100),
      constraints: Array.isArray(source.constraints) ? source.constraints.slice() : [],
      notes: safeString(source.notes || ""),
      registeredAt: safeString(source.registeredAt || nowIso()),
      updatedAt: nowIso(),
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function evaluateProduct(product = {}) {
    const p = normalizeProduct(product);
    const missing = [];

    if (!p.active) missing.push("productInactive");
    if (!p.contract) missing.push("contract");
    if (!p.receiptReady) missing.push("receiptReady");
    if (!p.platformReady) missing.push("platformReady");
    if (!p.engineeringReady) missing.push("engineeringReady");

    const readinessScore = clamp(
      (p.active ? 16 : 0) +
      (p.contract ? 14 : 0) +
      (p.receiptReady ? 14 : 0) +
      (p.platformReady ? 16 : 0) +
      (p.engineeringReady ? 16 : 0) +
      (p.expressionReady ? 10 : 0) +
      (p.registryReady ? 8 : 0) +
      (p.marketReady ? 6 : 0),
      0,
      100
    );

    const status =
      missing.includes("contract") || missing.includes("receiptReady")
        ? STATUS.BLOCKED
        : readinessScore >= 86
          ? STATUS.READY
          : readinessScore >= 62
            ? STATUS.DEGRADED
            : STATUS.HELD;

    return {
      ...p,
      readinessScore,
      status,
      missing,
      productEngineF34Evaluated: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      evaluatedAt: nowIso()
    };
  }

  function registerProduct(definition = {}) {
    const evaluated = evaluateProduct(definition);
    state.products[evaluated.id] = evaluated;

    refreshProductCounts();
    computeFibonacciSynchronizationMetric();

    recordLocal("PRODUCT_REGISTERED", {
      id: evaluated.id,
      name: evaluated.name,
      status: evaluated.status,
      readinessScore: evaluated.readinessScore
    });

    publishGlobals();
    updateDataset();

    return evaluated;
  }

  function updateProduct(id, patch = {}) {
    const key = safeString(id, "");
    const existing = state.products[key];

    if (!existing) {
      return registerProduct({ id: key, ...patch });
    }

    const updated = evaluateProduct({
      ...existing,
      ...(isObject(patch) ? patch : {}),
      id: key,
      updatedAt: nowIso()
    });

    state.products[key] = updated;

    refreshProductCounts();
    computeFibonacciSynchronizationMetric();

    recordLocal("PRODUCT_UPDATED", {
      id: updated.id,
      status: updated.status,
      readinessScore: updated.readinessScore
    });

    publishGlobals();
    updateDataset();

    return updated;
  }

  function refreshProductCounts() {
    const products = Object.values(state.products);

    state.productCount = products.length;
    state.productsReady = products.filter((product) => product.status === STATUS.READY).length;
    state.productsDegraded = products.filter((product) => product.status === STATUS.DEGRADED).length;
    state.productsBlocked = products.filter((product) => product.status === STATUS.BLOCKED || product.status === STATUS.HELD).length;

    return {
      productCount: state.productCount,
      productsReady: state.productsReady,
      productsDegraded: state.productsDegraded,
      productsBlocked: state.productsBlocked
    };
  }

  function evaluateAllProducts() {
    const evaluated = {};

    Object.keys(state.products).forEach((id) => {
      evaluated[id] = evaluateProduct(state.products[id]);
    });

    state.products = evaluated;
    refreshProductCounts();
    computeFibonacciSynchronizationMetric();
    updateDataset();

    return Object.values(state.products);
  }

  function acceptUE5ExpressionF55Receipt(packet = {}) {
    const input = isObject(packet) ? packet : {};
    const noForbiddenClaim = !detectForbiddenClaim(input);
    const contract = safeString(input.contract || input.ue5ExpressionContract, "");
    const receipt = safeString(input.receipt || input.ue5ExpressionReceipt, "");

    const f55Current = Boolean(
      noForbiddenClaim &&
      state.northF21Acknowledged &&
      state.northReleasePacketAccepted &&
      contract &&
      receipt &&
      (
        safeBool(input.ue5ExpressionF55Current, false) ||
        safeBool(input.expressionConductorReady, false) ||
        safeBool(input.f55ExpressionReady, false) ||
        safeBool(input.sceneGraphConductorReady, false)
      )
    );

    state.ue5ExpressionGateReady = f55Current;
    state.ue5ExpressionReceiptAccepted = f55Current;
    state.ue5ExpressionContract = contract;
    state.ue5ExpressionReceipt = receipt;
    state.ue5ExpressionF55Current = f55Current;

    if (f55Current) {
      state.firstFailedCoordinate = "NONE_UE5_EXPRESSION_F55_ACCEPTED";
      state.recommendedNextFile = REGISTRY_FILE;
      state.recommendedNextRenewalTarget = REGISTRY_FILE;
      recordLocal("UE5_EXPRESSION_F55_RECEIPT_ACCEPTED", { contract, receipt });
    } else {
      state.firstFailedCoordinate = noForbiddenClaim ? "WAITING_UE5_EXPRESSION_F55_RECEIPT" : "FORBIDDEN_CLAIM_DETECTED_IN_UE5_EXPRESSION";
      state.recommendedNextFile = UE5_EXPRESSION_FILE;
      state.recommendedNextRenewalTarget = UE5_EXPRESSION_FILE;
      recordLocal("UE5_EXPRESSION_F55_RECEIPT_HELD", {
        contract,
        receipt,
        noForbiddenClaim
      });
    }

    computeFibonacciSynchronizationMetric();
    publishGlobals();
    updateDataset();

    return {
      accepted: f55Current,
      ue5ExpressionF55Current: f55Current,
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

  function acceptProjectRegistryF89Receipt(packet = {}) {
    const input = isObject(packet) ? packet : {};
    const noForbiddenClaim = !detectForbiddenClaim(input);

    const current = Boolean(
      noForbiddenClaim &&
      state.northF21Acknowledged &&
      state.ue5ExpressionF55Current &&
      safeString(input.contract, "") &&
      safeString(input.receipt, "") &&
      (
        safeBool(input.projectRegistryF89Current, false) ||
        safeBool(input.registryReady, false)
      )
    );

    state.projectRegistryGateReady = current;
    state.projectRegistryReceiptAccepted = current;
    state.projectRegistryF89Current = current;

    state.firstFailedCoordinate = current ? "NONE_PROJECT_REGISTRY_F89_ACCEPTED" : "WAITING_PROJECT_REGISTRY_F89_RECEIPT";
    state.recommendedNextFile = current ? MARKET_FILE : REGISTRY_FILE;
    state.recommendedNextRenewalTarget = state.recommendedNextFile;

    recordLocal(current ? "PROJECT_REGISTRY_F89_RECEIPT_ACCEPTED" : "PROJECT_REGISTRY_F89_RECEIPT_HELD", {
      contract: safeString(input.contract, ""),
      receipt: safeString(input.receipt, ""),
      noForbiddenClaim
    });

    computeFibonacciSynchronizationMetric();
    publishGlobals();
    updateDataset();

    return getReceiptLight();
  }

  function acceptMarketF144ReadinessReceipt(packet = {}) {
    const input = isObject(packet) ? packet : {};
    const noForbiddenClaim = !detectForbiddenClaim(input);

    const current = Boolean(
      noForbiddenClaim &&
      state.projectRegistryF89Current &&
      safeString(input.contract, "") &&
      safeString(input.receipt, "") &&
      (
        safeBool(input.marketF144Current, false) ||
        safeBool(input.marketReadinessReady, false) ||
        safeBool(input.releaseCandidateReady, false)
      )
    );

    state.marketReadinessGateReady = current;
    state.marketReadinessReceiptAccepted = current;
    state.marketF144Current = current;

    state.firstFailedCoordinate = current ? "NONE_MARKET_F144_READINESS_ACCEPTED" : "WAITING_MARKET_F144_READINESS_RECEIPT";
    state.recommendedNextFile = current ? NORTH_FILE : MARKET_FILE;
    state.recommendedNextRenewalTarget = state.recommendedNextFile;

    recordLocal(current ? "MARKET_F144_READINESS_RECEIPT_ACCEPTED" : "MARKET_F144_READINESS_RECEIPT_HELD", {
      contract: safeString(input.contract, ""),
      receipt: safeString(input.receipt, ""),
      noForbiddenClaim
    });

    computeFibonacciSynchronizationMetric();
    publishGlobals();
    updateDataset();

    return getReceiptLight();
  }

  function computeFibonacciSynchronizationMetric() {
    const checks = [
      state.newsProtocolAligned,
      state.oneActiveGearAtATime,
      state.activeFibonacci === FIBONACCI.PRODUCT_ENGINE,
      state.activeNewsGate === NEWS_GATES.PRODUCT,
      state.northF21Acknowledged,
      state.northReleasePacketAccepted,
      state.canvasF13EvidenceComplete || state.canvasF13EvidenceDegraded || state.canvasF13EvidenceObserved,
      state.productEngineActive,
      state.f34ReceiptReady,
      !state.generatedImage,
      !state.graphicBox,
      !state.webGL,
      !state.visualPassClaimed,
      state.productGraphActive,
      state.productCount >= 0,
      state.ue5ExpressionF55Current || state.futureFibonacciGate === FIBONACCI.UE5_EXPRESSION
    ];

    const passed = checks.filter(Boolean).length;
    state.fibonacciSynchronizationScore = Math.round((passed / checks.length) * 100);

    if (!state.northF21Acknowledged) {
      state.f34ActivationStatus = STATUS.HELD;
      state.f34ActivationReason = "WAITING_NORTH_F21_RELEASE";
    } else if (state.fibonacciSynchronizationScore >= 86) {
      state.f34ActivationStatus = STATUS.READY;
      state.f34ActivationReason = "PRODUCT_ENGINE_F34_SYNCHRONIZED";
    } else {
      state.f34ActivationStatus = STATUS.DEGRADED;
      state.f34ActivationReason = "PRODUCT_ENGINE_F34_SYNCHRONIZATION_DEGRADED";
    }

    state.updatedAt = nowIso();

    return {
      score: state.fibonacciSynchronizationScore,
      passed,
      total: checks.length,
      status: state.f34ActivationStatus,
      reason: state.f34ActivationReason
    };
  }

  function createProductGraph() {
    evaluateAllProducts();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      graphContract: "LAB_PRODUCT_ENGINE_F34_PRODUCT_GRAPH_v1",
      graphReceipt: "LAB_PRODUCT_ENGINE_F34_PRODUCT_GRAPH_RECEIPT_v1",
      productEngineF34Active: state.northF21Acknowledged,
      productCount: state.productCount,
      productsReady: state.productsReady,
      productsDegraded: state.productsDegraded,
      productsBlocked: state.productsBlocked,
      products: clonePlain(Object.values(state.products)),
      nextExpressionGate: UE5_EXPRESSION_FILE,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function composeF34ReleasePacket(extra = {}) {
    const metric = computeFibonacciSynchronizationMetric();

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
      futureFibonacciGate: FIBONACCI.UE5_EXPRESSION,
      futureFibonacciRank: 55,

      northF21Acknowledged: state.northF21Acknowledged,
      northReleasePacketAccepted: state.northReleasePacketAccepted,
      canvasF13EvidenceObserved: state.canvasF13EvidenceObserved,
      canvasF13EvidenceComplete: state.canvasF13EvidenceComplete,
      canvasF13EvidenceDegraded: state.canvasF13EvidenceDegraded,

      productEngineF34Active: state.northF21Acknowledged,
      productEngineF34Ready: state.f34ActivationStatus === STATUS.READY,
      productGraphActive: true,
      productCount: state.productCount,
      productsReady: state.productsReady,
      productsDegraded: state.productsDegraded,
      productsBlocked: state.productsBlocked,

      ue5ExpressionReleaseAuthorized: Boolean(state.northF21Acknowledged && metric.score >= 86),
      fibonacciSynchronizationMetricActive: true,
      fibonacciSynchronizationScore: metric.score,
      newsProtocolAligned: true,
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

  function evaluateNewsAlignment() {
    const metric = computeFibonacciSynchronizationMetric();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      newsAlignmentContract: "LAB_PRODUCT_ENGINE_F34_NEWS_ALIGNMENT_PROTOCOL_v1",
      newsAlignmentReceipt: "LAB_PRODUCT_ENGINE_F34_NEWS_ALIGNMENT_PROTOCOL_RECEIPT_v1",
      sequence: [
        { gate: NEWS_GATES.NORTH, fibonacci: FIBONACCI.NORTH_LATCH, file: NORTH_FILE, ready: state.northF21Acknowledged },
        { gate: NEWS_GATES.CANVAS, fibonacci: FIBONACCI.CANVAS_EVIDENCE, file: "/assets/hearth/hearth.canvas.js", ready: state.canvasF13EvidenceComplete || state.canvasF13EvidenceDegraded || state.canvasF13EvidenceObserved },
        { gate: NEWS_GATES.PRODUCT, fibonacci: FIBONACCI.PRODUCT_ENGINE, file: FILE, ready: state.f34ActivationStatus === STATUS.READY || state.f34ActivationStatus === STATUS.DEGRADED },
        { gate: NEWS_GATES.EXPRESSION, fibonacci: FIBONACCI.UE5_EXPRESSION, file: UE5_EXPRESSION_FILE, ready: state.ue5ExpressionF55Current },
        { gate: NEWS_GATES.REGISTRY, fibonacci: FIBONACCI.PROJECT_REGISTRY, file: REGISTRY_FILE, ready: state.projectRegistryF89Current },
        { gate: NEWS_GATES.MARKET, fibonacci: FIBONACCI.MARKET_READINESS, file: MARKET_FILE, ready: state.marketF144Current }
      ],
      fibonacciSynchronizationScore: metric.score,
      f34Status: state.f34ActivationStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function getReceiptLight() {
    computeFibonacciSynchronizationMetric();
    refreshProductCounts();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      role: state.role,

      productEngineActive: true,
      productEngineF34Only: true,
      northF21Required: true,
      northF21Acknowledged: state.northF21Acknowledged,
      northReleasePacketAccepted: state.northReleasePacketAccepted,
      northContract: state.northContract,
      northReceipt: state.northReceipt,
      northCompletionLatched: state.northCompletionLatched,
      northDegradedCompletionLatched: state.northDegradedCompletionLatched,
      northDownstreamReleaseAuthorized: state.northDownstreamReleaseAuthorized,

      canvasF13EvidenceObserved: state.canvasF13EvidenceObserved,
      canvasF13EvidenceComplete: state.canvasF13EvidenceComplete,
      canvasF13EvidenceDegraded: state.canvasF13EvidenceDegraded,

      f34ActivationStatus: state.f34ActivationStatus,
      f34ActivationReason: state.f34ActivationReason,
      f34ReleasePacketReady: state.f34ReleasePacketReady,
      f34ReceiptReady: true,

      productGraphActive: true,
      productCount: state.productCount,
      productsReady: state.productsReady,
      productsDegraded: state.productsDegraded,
      productsBlocked: state.productsBlocked,

      ue5ExpressionGateReady: state.ue5ExpressionGateReady,
      ue5ExpressionReceiptAccepted: state.ue5ExpressionReceiptAccepted,
      ue5ExpressionContract: state.ue5ExpressionContract,
      ue5ExpressionReceipt: state.ue5ExpressionReceipt,
      ue5ExpressionF55Current: state.ue5ExpressionF55Current,

      projectRegistryF89Current: state.projectRegistryF89Current,
      marketF144Current: state.marketF144Current,

      newsProtocolAligned: true,
      fibonacciSynchronizationMetricActive: true,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      activeFibonacci: FIBONACCI.PRODUCT_ENGINE,
      activeFibonacciRank: 34,
      activeNewsGate: NEWS_GATES.PRODUCT,
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
    return {
      ...getReceiptLight(),

      productEngineReceipt: true,
      productEngineOwns: [
        "post-F21 product conductorship",
        "F34 product graph",
        "product readiness scoring",
        "UE5-derived expression handoff preparation",
        "NEWS/Fibonacci synchronization metric",
        "product receipt surface"
      ],
      productEngineDoesNotOwn: [
        "North F21 latch",
        "Canvas F13 evidence",
        "route orchestration",
        "planet truth",
        "material truth",
        "elevation truth",
        "hydrology truth",
        "WebGL",
        "generated image",
        "GraphicBox",
        "final visual pass claim"
      ],

      gates: {
        north: NORTH_FILE,
        productEngine: FILE,
        ue5Expression: UE5_EXPRESSION_FILE,
        registry: REGISTRY_FILE,
        market: MARKET_FILE
      },

      fibonacciMap: clonePlain(FIBONACCI),
      newsGates: clonePlain(NEWS_GATES),
      newsAlignment: evaluateNewsAlignment(),
      f34ReleasePacket: composeF34ReleasePacket(),
      productGraph: createProductGraph(),

      products: clonePlain(Object.values(state.products)),
      northReleasePacket: clonePlain(state.northReleasePacket),

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
      `- ${product.id} :: ${product.name} :: status=${product.status} :: score=${product.readinessScore}`
    )).join("\n") || "- none";

    const events = (r.localEvents || []).slice(-40).map((item) => (
      `- ${item.at} :: ${item.event} :: ${JSON.stringify(item.detail || {})}`
    )).join("\n") || "- none";

    const errors = (r.errors || []).map((item) => (
      `- ${item.at} :: ${item.code} :: ${item.message}`
    )).join("\n") || "- none";

    return [
      "LAB_PRODUCT_ENGINE_F34_DOWNSTREAM_CONDUCTOR_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `role=${r.role}`,
      "",
      `productEngineActive=${r.productEngineActive}`,
      `productEngineF34Only=${r.productEngineF34Only}`,
      `northF21Required=${r.northF21Required}`,
      `northF21Acknowledged=${r.northF21Acknowledged}`,
      `northReleasePacketAccepted=${r.northReleasePacketAccepted}`,
      `northCompletionLatched=${r.northCompletionLatched}`,
      `northDegradedCompletionLatched=${r.northDegradedCompletionLatched}`,
      `northDownstreamReleaseAuthorized=${r.northDownstreamReleaseAuthorized}`,
      "",
      `canvasF13EvidenceObserved=${r.canvasF13EvidenceObserved}`,
      `canvasF13EvidenceComplete=${r.canvasF13EvidenceComplete}`,
      `canvasF13EvidenceDegraded=${r.canvasF13EvidenceDegraded}`,
      "",
      `f34ActivationStatus=${r.f34ActivationStatus}`,
      `f34ActivationReason=${r.f34ActivationReason}`,
      `f34ReleasePacketReady=${r.f34ReleasePacketReady}`,
      "",
      `productCount=${r.productCount}`,
      `productsReady=${r.productsReady}`,
      `productsDegraded=${r.productsDegraded}`,
      `productsBlocked=${r.productsBlocked}`,
      "",
      `ue5ExpressionGateReady=${r.ue5ExpressionGateReady}`,
      `ue5ExpressionReceiptAccepted=${r.ue5ExpressionReceiptAccepted}`,
      `ue5ExpressionF55Current=${r.ue5ExpressionF55Current}`,
      `projectRegistryF89Current=${r.projectRegistryF89Current}`,
      `marketF144Current=${r.marketF144Current}`,
      "",
      `newsProtocolAligned=${r.newsProtocolAligned}`,
      `fibonacciSynchronizationMetricActive=${r.fibonacciSynchronizationMetricActive}`,
      `fibonacciSynchronizationScore=${r.fibonacciSynchronizationScore}`,
      `activeFibonacci=${r.activeFibonacci}`,
      `activeFibonacciRank=${r.activeFibonacciRank}`,
      `activeNewsGate=${r.activeNewsGate}`,
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

    setDataset("productEngineF34Only", "true");
    setDataset("productEngineActive", "true");
    setDataset("productEngineNorthF21Required", "true");
    setDataset("productEngineNorthF21Acknowledged", state.northF21Acknowledged);
    setDataset("productEngineNorthReleasePacketAccepted", state.northReleasePacketAccepted);

    setDataset("productEngineCanvasF13EvidenceObserved", state.canvasF13EvidenceObserved);
    setDataset("productEngineCanvasF13EvidenceComplete", state.canvasF13EvidenceComplete);
    setDataset("productEngineCanvasF13EvidenceDegraded", state.canvasF13EvidenceDegraded);

    setDataset("productEngineF34ActivationStatus", state.f34ActivationStatus);
    setDataset("productEngineF34ActivationReason", state.f34ActivationReason);
    setDataset("productEngineF34ReleasePacketReady", state.f34ReleasePacketReady);

    setDataset("productEngineProductCount", state.productCount);
    setDataset("productEngineProductsReady", state.productsReady);
    setDataset("productEngineProductsDegraded", state.productsDegraded);
    setDataset("productEngineProductsBlocked", state.productsBlocked);

    setDataset("productEngineUE5ExpressionGateReady", state.ue5ExpressionGateReady);
    setDataset("productEngineUE5ExpressionF55Current", state.ue5ExpressionF55Current);
    setDataset("productEngineProjectRegistryF89Current", state.projectRegistryF89Current);
    setDataset("productEngineMarketF144Current", state.marketF144Current);

    setDataset("productEngineNewsProtocolAligned", "true");
    setDataset("productEngineFibonacciSynchronizationMetricActive", "true");
    setDataset("productEngineFibonacciSynchronizationScore", state.fibonacciSynchronizationScore);
    setDataset("productEngineActiveFibonacci", FIBONACCI.PRODUCT_ENGINE);
    setDataset("productEngineActiveFibonacciRank", "34");
    setDataset("productEngineActiveNewsGate", NEWS_GATES.PRODUCT);
    setDataset("productEngineFutureFibonacciGate", FIBONACCI.UE5_EXPRESSION);
    setDataset("productEngineOneActiveGearAtATime", "true");

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
    root.DEXTER_LAB.productEngine = api;
    root.DEXTER_LAB.productEngineF34 = api;
    root.HEARTH.productEngine = api;
    root.HEARTH.productEngineF34 = api;

    const light = getReceiptLight();

    root.LAB_PRODUCT_ENGINE_RECEIPT = light;
    root.LAB_PRODUCT_ENGINE_F34_RECEIPT = light;
    root.PRODUCT_ENGINE_RECEIPT = light;
    root.DEXTER_LAB.productEngineReceipt = light;
    root.HEARTH.productEngineReceipt = light;

    root.__LAB_PRODUCT_ENGINE_LOADED__ = true;
    root.__LAB_PRODUCT_ENGINE_CONTRACT__ = CONTRACT;
    root.__LAB_PRODUCT_ENGINE_RECEIPT__ = RECEIPT;
    root.__LAB_PRODUCT_ENGINE_F34_ONLY__ = true;
    root.__LAB_PRODUCT_ENGINE_F34_VISUAL_PASS_CLAIMED__ = false;

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

    readNorthAuthority,
    readNorthReceipt,
    validateNorthF21Release,
    acceptNorthF21Release,

    registerProduct,
    updateProduct,
    evaluateProduct,
    evaluateAllProducts,
    createProductGraph,

    acceptUE5ExpressionF55Receipt,
    acceptProjectRegistryF89Receipt,
    acceptMarketF144ReadinessReceipt,

    computeFibonacciSynchronizationMetric,
    evaluateNewsAlignment,
    composeF34ReleasePacket,

    getReceiptLight,
    getReceipt,
    getReceiptText,
    publishGlobals,
    updateDataset,

    productEngineActive: true,
    productEngineF34Only: true,
    northF21Required: true,
    ownsProductGraph: true,
    ownsProductReadinessScoring: true,
    ownsF34ReleasePacket: true,
    ownsUE5ExpressionHandoffPreparation: true,
    ownsNewsFibonacciSynchronizationMetric: true,

    ownsNorthF21Latch: false,
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
    readNorthReceipt();
    acceptNorthF21Release(readNorthReceipt());
  } catch (error) {
    recordError("INITIAL_NORTH_F21_READ_FAILED", error);
    computeFibonacciSynchronizationMetric();
  }

  recordLocal("PRODUCT_ENGINE_F34_DOWNSTREAM_CONDUCTOR_LOADED", {
    file: FILE,
    contract: CONTRACT,
    northFile: NORTH_FILE,
    ue5ExpressionFile: UE5_EXPRESSION_FILE,
    productEngineF34Only: true
  });

  publishGlobals();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

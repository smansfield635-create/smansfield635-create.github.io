// /assets/lab/product-engine.market.js
// LAB_PRODUCT_ENGINE_MARKET_F144_READINESS_CONDUCTOR_TNT_v1
// Full-file replacement.
// Product Engine F144 market-readiness conductor.
// Purpose:
// - Consume Product Engine Registry F89 release.
// - Convert the registry into market-readiness, offer-readiness, licensing-readiness, demo-readiness, documentation-readiness, evidence-readiness, and risk-boundary-readiness packets.
// - Preserve Product Engine F34 -> UE5 Expression F55 -> Registry F89 -> Market F144 sequence.
// - Preserve NEWS alignment protocol with Fibonacci synchronization metric.
// - Maintain an internal "surpass-market-engine" target score without making public superiority claims.
// - Produce F144 handoff packets for North/downstream release only after F89 registry evidence is accepted.
// Does not own:
// - North F21 latch
// - Product Engine F34 authority
// - UE5 Expression F55 authority
// - Project Registry F89 authority
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

  const CONTRACT = "LAB_PRODUCT_ENGINE_MARKET_F144_READINESS_CONDUCTOR_TNT_v1";
  const RECEIPT = "LAB_PRODUCT_ENGINE_MARKET_F144_READINESS_CONDUCTOR_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "NONE_MARKET_F144_FIRST_CONDUCTOR";
  const BASELINE_CONTRACT = "LAB_PRODUCT_ENGINE_MARKET_F144_READINESS_CONDUCTOR_BASELINE_v1";
  const VERSION = "2026-06-01.lab-product-engine-market-f144-readiness-conductor-v1";

  const FILE = "/assets/lab/product-engine.market.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const PRODUCT_ENGINE_FILE = "/assets/lab/product-engine.js";
  const UE5_EXPRESSION_FILE = "/assets/lab/product-engine.ue5-expression.js";
  const REGISTRY_FILE = "/assets/lab/product-engine.registry.js";

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
    DOWNSTREAM_RELEASE: "F233"
  });

  const NEWS_GATES = Object.freeze({
    NORTH: "NORTH",
    CANVAS: "CANVAS",
    PRODUCT: "PRODUCT_ENGINE",
    EXPRESSION: "UE5_EXPRESSION",
    REGISTRY: "PROJECT_REGISTRY",
    MARKET: "MARKET_READINESS",
    DOWNSTREAM: "DOWNSTREAM_RELEASE"
  });

  const MARKET_ITEM_TYPES = Object.freeze({
    OFFER: "offer",
    PRODUCT: "product",
    ENGINE: "engine",
    DEMO: "demo",
    DOCUMENTATION: "documentation",
    LICENSE: "license",
    EVIDENCE: "evidence",
    RISK_BOUNDARY: "risk-boundary",
    DISTRIBUTION: "distribution",
    IMPLEMENTATION: "implementation"
  });

  const STATUS = Object.freeze({
    HELD: "HELD",
    ACTIVE: "ACTIVE",
    READY: "READY",
    DEGRADED: "DEGRADED",
    BLOCKED: "BLOCKED"
  });

  const READINESS_BUCKETS = Object.freeze({
    PLATFORM: "platform",
    ENGINEERING: "engineering",
    DEMO: "demo",
    OFFER: "offer",
    DOCUMENTATION: "documentation",
    LICENSING: "licensing",
    EVIDENCE: "evidence",
    RISK: "risk",
    DISTRIBUTION: "distribution",
    IMPLEMENTATION: "implementation"
  });

  const INTERNAL_BENCHMARK_TARGETS = Object.freeze({
    deterministicRegistry: 100,
    receiptTraceability: 100,
    multiProductConductorship: 96,
    marketPackaging: 92,
    implementationReadiness: 90,
    riskBoundaryClarity: 94,
    documentationCompleteness: 88,
    demoClarity: 86,
    licensingClarity: 86,
    publicClaimSafety: 100
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    role: "product-engine-market-f144-readiness-conductor",

    f144MarketConductorActive: true,
    f144Only: true,
    f89RegistryRequired: true,
    f89RegistryObserved: false,
    f89RegistryAccepted: false,
    f89RegistryContract: "",
    f89RegistryReceipt: "",
    f89ReleasePacket: null,

    productEngineF34Accepted: false,
    ue5ExpressionF55Accepted: false,
    projectRegistryF89Accepted: false,
    northF21Acknowledged: false,
    canvasF13EvidenceObserved: false,
    canvasF13EvidenceComplete: false,
    canvasF13EvidenceDegraded: false,

    registryEntryCount: 0,
    registryReadyEntryCount: 0,
    registryDegradedEntryCount: 0,
    registryBlockedEntryCount: 0,
    registryProductCount: 0,
    registryEngineCount: 0,
    registryFileCount: 0,
    registryExpressionNodeCount: 0,
    registryQualityScore: 0,
    registryCoverageScore: 0,
    registryTraceScore: 0,
    registryCoherenceScore: 0,
    registryFibonacciSynchronizationScore: 0,

    marketMapBuilt: false,
    marketReady: false,
    marketStatus: STATUS.HELD,
    marketItemCount: 0,
    marketReadyItemCount: 0,
    marketDegradedItemCount: 0,
    marketBlockedItemCount: 0,

    platformReadinessScore: 0,
    engineeringReadinessScore: 0,
    demoReadinessScore: 0,
    offerReadinessScore: 0,
    documentationReadinessScore: 0,
    licensingReadinessScore: 0,
    evidenceReadinessScore: 0,
    riskBoundaryReadinessScore: 0,
    distributionReadinessScore: 0,
    implementationReadinessScore: 0,
    marketReadinessScore: 0,

    internalBenchmarkTargetActive: true,
    internalBenchmarkTargetName: "SURPASS_MARKET_ENGINE_INTERNAL_TARGET_ONLY",
    internalSurpassMarketEngineTargetScore: 0,
    internalSurpassTargetMet: false,
    publicSuperiorityClaim: false,
    publicComparisonClaimAllowed: false,

    marketMap: {
      items: {},
      offers: {},
      products: {},
      engines: {},
      demos: {},
      documentation: {},
      licenses: {},
      evidence: {},
      riskBoundaries: {},
      distribution: {},
      implementation: {},
      edges: [],
      buildId: "",
      builtAt: ""
    },

    f233DownstreamReleaseGateReady: false,
    f233DownstreamReleaseAuthorized: false,
    f233DownstreamTarget: "",
    northSubmissionAttempted: false,
    northSubmissionAccepted: false,

    newsProtocolAligned: true,
    fibonacciSynchronizationMetricActive: true,
    fibonacciSynchronizationScore: 0,
    activeFibonacci: FIBONACCI.MARKET_READINESS,
    activeFibonacciRank: 144,
    activeNewsGate: NEWS_GATES.MARKET,
    sourceFibonacciGate: FIBONACCI.PROJECT_REGISTRY,
    futureFibonacciGate: FIBONACCI.DOWNSTREAM_RELEASE,
    oneActiveGearAtATime: true,

    f144ActivationStatus: STATUS.HELD,
    f144ActivationReason: "WAITING_PROJECT_REGISTRY_F89_RELEASE",
    f144ReceiptReady: true,
    f144ReleasePacketReady: false,

    firstFailedCoordinate: "WAITING_PROJECT_REGISTRY_F89_RELEASE",
    recommendedNextFile: REGISTRY_FILE,
    recommendedNextRenewalTarget: REGISTRY_FILE,

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

  function makeId(value, fallback = "item") {
    const raw = safeString(value || fallback, fallback)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return raw || fallback;
  }

  function average(values) {
    const nums = values.map((value) => safeNumber(value, 0)).filter((value) => Number.isFinite(value));
    if (!nums.length) return 0;
    return Math.round(nums.reduce((sum, value) => sum + value, 0) / nums.length);
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
      code: safeString(code, "MARKET_F144_ERROR"),
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

  function readRegistryAuthority() {
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

  function readRegistryReceipt() {
    const authority = readRegistryAuthority();
    const receipt = readReceipt(authority);

    if (receipt && Object.keys(receipt).length) {
      state.f89RegistryObserved = true;
      state.f89RegistryContract = safeString(receipt.contract, "");
      state.f89RegistryReceipt = safeString(receipt.receipt, "");

      state.productEngineF34Accepted = safeBool(receipt.productEngineF34Accepted, state.productEngineF34Accepted);
      state.ue5ExpressionF55Accepted = safeBool(receipt.f55ExpressionAccepted, state.ue5ExpressionF55Accepted);
      state.projectRegistryF89Accepted = safeBool(receipt.registryReady, state.projectRegistryF89Accepted) || safeBool(receipt.projectRegistryReady, state.projectRegistryF89Accepted);
      state.northF21Acknowledged = safeBool(receipt.northF21Acknowledged, state.northF21Acknowledged);
      state.canvasF13EvidenceObserved = safeBool(receipt.canvasF13EvidenceObserved, state.canvasF13EvidenceObserved);
      state.canvasF13EvidenceComplete = safeBool(receipt.canvasF13EvidenceComplete, state.canvasF13EvidenceComplete);
      state.canvasF13EvidenceDegraded = safeBool(receipt.canvasF13EvidenceDegraded, state.canvasF13EvidenceDegraded);

      state.registryEntryCount = safeNumber(receipt.registryEntryCount, state.registryEntryCount);
      state.registryReadyEntryCount = safeNumber(receipt.registryReadyEntryCount, state.registryReadyEntryCount);
      state.registryDegradedEntryCount = safeNumber(receipt.registryDegradedEntryCount, state.registryDegradedEntryCount);
      state.registryBlockedEntryCount = safeNumber(receipt.registryBlockedEntryCount, state.registryBlockedEntryCount);
      state.registryProductCount = safeNumber(receipt.registryProductCount, state.registryProductCount);
      state.registryEngineCount = safeNumber(receipt.registryEngineCount, state.registryEngineCount);
      state.registryFileCount = safeNumber(receipt.registryFileCount, state.registryFileCount);
      state.registryExpressionNodeCount = safeNumber(receipt.registryExpressionNodeCount, state.registryExpressionNodeCount);
      state.registryQualityScore = safeNumber(receipt.registryQualityScore, state.registryQualityScore);
      state.registryCoverageScore = safeNumber(receipt.registryCoverageScore, state.registryCoverageScore);
      state.registryTraceScore = safeNumber(receipt.registryTraceScore, state.registryTraceScore);
      state.registryCoherenceScore = safeNumber(receipt.registryCoherenceScore, state.registryCoherenceScore);
      state.registryFibonacciSynchronizationScore = safeNumber(receipt.fibonacciSynchronizationScore, state.registryFibonacciSynchronizationScore);
    }

    return receipt || {};
  }

  function registryEntriesFromReceipt(receipt = {}) {
    if (Array.isArray(receipt.registryEntries)) return receipt.registryEntries.slice();

    if (isObject(receipt.registry) && isObject(receipt.registry.entries)) {
      return Object.values(receipt.registry.entries);
    }

    if (isObject(receipt.f89ReleasePacket) && isObject(receipt.f89ReleasePacket.registry) && isObject(receipt.f89ReleasePacket.registry.entries)) {
      return Object.values(receipt.f89ReleasePacket.registry.entries);
    }

    return [];
  }

  function validateF89Release(packet = {}) {
    const input = isObject(packet) && Object.keys(packet).length ? packet : readRegistryReceipt();
    const releasePacket = isObject(input.f89ReleasePacket) ? input.f89ReleasePacket : input;

    const noForbiddenClaim = !detectForbiddenClaim(input);
    const activeFibonacci = safeString(releasePacket.activeFibonacci || input.activeFibonacci, "");
    const futureFibonacciGate = safeString(releasePacket.futureFibonacciGate || input.futureFibonacciGate, "");

    const registryReady = Boolean(
      safeBool(releasePacket.projectRegistryReady, false) ||
      safeBool(releasePacket.registryConductorReady, false) ||
      safeBool(releasePacket.registryReady, false) ||
      safeBool(input.registryReady, false) ||
      safeString(input.registryStatus, "") === STATUS.READY ||
      safeString(input.registryStatus, "") === STATUS.DEGRADED
    );

    const marketReleaseAuthorized = Boolean(
      safeBool(releasePacket.f144MarketReleaseAuthorized, false) ||
      safeBool(input.f144MarketReleaseAuthorized, false) ||
      safeBool(input.f144MarketReadinessGateReady, false)
    );

    const ok = Boolean(
      noForbiddenClaim &&
      registryReady &&
      marketReleaseAuthorized &&
      (
        activeFibonacci === FIBONACCI.PROJECT_REGISTRY ||
        activeFibonacci === "F89" ||
        safeBool(input.f89Only, false)
      ) &&
      (
        futureFibonacciGate === FIBONACCI.MARKET_READINESS ||
        futureFibonacciGate === "F144" ||
        marketReleaseAuthorized
      )
    );

    let reason = "NONE_PROJECT_REGISTRY_F89_ACCEPTED";

    if (!noForbiddenClaim) reason = "FORBIDDEN_CLAIM_DETECTED_IN_F89_PACKET";
    else if (!registryReady) reason = "WAITING_PROJECT_REGISTRY_F89_READY";
    else if (!marketReleaseAuthorized) reason = "WAITING_MARKET_F144_RELEASE_AUTHORIZATION";
    else if (activeFibonacci && activeFibonacci !== FIBONACCI.PROJECT_REGISTRY && activeFibonacci !== "F89") {
      reason = "PROJECT_REGISTRY_FIBONACCI_NOT_F89";
    } else if (futureFibonacciGate && futureFibonacciGate !== FIBONACCI.MARKET_READINESS && futureFibonacciGate !== "F144") {
      reason = "PROJECT_REGISTRY_FUTURE_GATE_NOT_F144";
    }

    return {
      ok,
      reason,
      input: clonePlain(input),
      f89ReleasePacket: clonePlain(releasePacket),
      registryEntries: registryEntriesFromReceipt(input),
      activeFibonacci,
      futureFibonacciGate,
      registryReady,
      marketReleaseAuthorized,
      noForbiddenClaim
    };
  }

  function acceptF89Release(packet = {}) {
    const validation = validateF89Release(packet);

    state.f89RegistryAccepted = validation.ok;
    state.projectRegistryF89Accepted = validation.ok;
    state.f89ReleasePacket = clonePlain(validation.f89ReleasePacket);
    state.f89RegistryObserved = true;

    if (validation.input.contract) state.f89RegistryContract = safeString(validation.input.contract);
    if (validation.input.receipt) state.f89RegistryReceipt = safeString(validation.input.receipt);

    state.productEngineF34Accepted = safeBool(validation.input.productEngineF34Accepted, state.productEngineF34Accepted);
    state.ue5ExpressionF55Accepted = safeBool(validation.input.f55ExpressionAccepted, state.ue5ExpressionF55Accepted);
    state.northF21Acknowledged = safeBool(validation.input.northF21Acknowledged, state.northF21Acknowledged);
    state.canvasF13EvidenceObserved = safeBool(validation.input.canvasF13EvidenceObserved, state.canvasF13EvidenceObserved);
    state.canvasF13EvidenceComplete = safeBool(validation.input.canvasF13EvidenceComplete, state.canvasF13EvidenceComplete);
    state.canvasF13EvidenceDegraded = safeBool(validation.input.canvasF13EvidenceDegraded, state.canvasF13EvidenceDegraded);

    if (validation.ok) {
      state.f144ActivationStatus = STATUS.ACTIVE;
      state.f144ActivationReason = "PROJECT_REGISTRY_F89_RELEASE_ACCEPTED_MARKET_F144_ACTIVE";
      state.firstFailedCoordinate = "NONE_MARKET_F144_ACTIVE";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;

      seedMarketMapFromRegistry(validation.registryEntries, { silent: true });

      recordLocal("PROJECT_REGISTRY_F89_RELEASE_ACCEPTED_BY_MARKET_F144", {
        registryEntryCount: validation.registryEntries.length,
        f89RegistryContract: state.f89RegistryContract
      });
    } else {
      state.f144ActivationStatus = STATUS.HELD;
      state.f144ActivationReason = validation.reason;
      state.firstFailedCoordinate = validation.reason;
      state.recommendedNextFile = REGISTRY_FILE;
      state.recommendedNextRenewalTarget = REGISTRY_FILE;

      recordLocal("PROJECT_REGISTRY_F89_RELEASE_HELD_BY_MARKET_F144", {
        reason: validation.reason
      });
    }

    buildMarketMap({ silent: true });
    computeFibonacciSynchronizationMetric();
    publishGlobals();
    updateDataset();

    return {
      accepted: validation.ok,
      marketF144Active: validation.ok,
      reason: validation.reason,
      registryEntriesImported: validation.registryEntries.length,
      marketReady: state.marketReady,
      marketReadinessScore: state.marketReadinessScore,
      internalSurpassMarketEngineTargetScore: state.internalSurpassMarketEngineTargetScore,
      publicSuperiorityClaim: false,
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

  function normalizeMarketItem(definition = {}) {
    const source = isObject(definition) ? definition : {};
    const type = safeString(source.type || source.itemType || MARKET_ITEM_TYPES.OFFER, MARKET_ITEM_TYPES.OFFER);
    const id = makeId(source.id || source.key || source.name || `${type}-${Object.keys(state.marketMap.items).length + 1}`, `${type}-item`);

    return {
      id,
      type,
      label: safeString(source.label || source.name || id),
      productId: makeId(source.productId || source.product || id, id),
      projectId: makeId(source.projectId || source.project || "diamond-gate-bridge", "diamond-gate-bridge"),
      sourceRegistryId: safeString(source.sourceRegistryId || source.registryId || ""),
      sourceFile: safeString(source.sourceFile || source.file || ""),
      sourceContract: safeString(source.sourceContract || source.contract || ""),
      sourceReceipt: safeString(source.sourceReceipt || source.receipt || ""),
      sourceFibonacciGate: safeString(source.sourceFibonacciGate || FIBONACCI.PROJECT_REGISTRY),
      activeFibonacci: safeString(source.activeFibonacci || FIBONACCI.MARKET_READINESS),
      futureFibonacciGate: safeString(source.futureFibonacciGate || FIBONACCI.DOWNSTREAM_RELEASE),
      priority: clamp(source.priority ?? 50, 0, 100),

      platformReady: safeBool(source.platformReady, false),
      engineeringReady: safeBool(source.engineeringReady, false),
      demoReady: safeBool(source.demoReady, false),
      offerReady: safeBool(source.offerReady, false),
      documentationReady: safeBool(source.documentationReady, false),
      licensingReady: safeBool(source.licensingReady, false),
      evidenceReady: safeBool(source.evidenceReady, false),
      riskBoundaryReady: safeBool(source.riskBoundaryReady, false),
      distributionReady: safeBool(source.distributionReady, false),
      implementationReady: safeBool(source.implementationReady, false),

      receiptReady: safeBool(source.receiptReady, Boolean(source.sourceContract || source.sourceReceipt || source.contract || source.receipt)),
      registryReady: safeBool(source.registryReady, false),
      publicReady: safeBool(source.publicReady, false),
      internalOnly: safeBool(source.internalOnly, true),

      dependencies: Array.isArray(source.dependencies) ? source.dependencies.slice() : [],
      tags: Array.isArray(source.tags) ? source.tags.slice() : [],

      priceReady: safeBool(source.priceReady, false),
      packagingReady: safeBool(source.packagingReady, false),
      supportReady: safeBool(source.supportReady, false),
      onboardingReady: safeBool(source.onboardingReady, false),

      ownsRendering: false,
      ownsTruth: false,
      publicSuperiorityClaim: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      createdAt: safeString(source.createdAt || nowIso()),
      updatedAt: nowIso()
    };
  }

  function evaluateMarketItem(item = {}) {
    const next = normalizeMarketItem(item);
    const missing = [];

    if (!state.f89RegistryAccepted) missing.push("f89RegistryAccepted");
    if (!next.id) missing.push("id");
    if (!next.type) missing.push("type");
    if (!next.receiptReady) missing.push("receiptReady");
    if (!next.registryReady) missing.push("registryReady");
    if (!next.platformReady) missing.push("platformReady");
    if (!next.engineeringReady) missing.push("engineeringReady");
    if (!next.evidenceReady) missing.push("evidenceReady");
    if (!next.riskBoundaryReady) missing.push("riskBoundaryReady");

    const readinessScore = clamp(
      (state.f89RegistryAccepted ? 12 : 0) +
      (next.receiptReady ? 10 : 0) +
      (next.registryReady ? 10 : 0) +
      (next.platformReady ? 9 : 0) +
      (next.engineeringReady ? 9 : 0) +
      (next.demoReady ? 8 : 0) +
      (next.offerReady ? 8 : 0) +
      (next.documentationReady ? 8 : 0) +
      (next.licensingReady ? 7 : 0) +
      (next.evidenceReady ? 8 : 0) +
      (next.riskBoundaryReady ? 7 : 0) +
      (next.distributionReady ? 4 : 0),
      0,
      100
    );

    const status =
      missing.includes("f89RegistryAccepted")
        ? STATUS.HELD
        : missing.includes("receiptReady") || missing.includes("registryReady")
          ? STATUS.BLOCKED
          : readinessScore >= 88
            ? STATUS.READY
            : readinessScore >= 62
              ? STATUS.DEGRADED
              : STATUS.HELD;

    return {
      ...next,
      readinessScore,
      status,
      missing,
      f144MarketItemEvaluated: true,
      publicSuperiorityClaim: false,
      publicComparisonClaimAllowed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      evaluatedAt: nowIso()
    };
  }

  function registerMarketItem(definition = {}, options = {}) {
    const evaluated = evaluateMarketItem(definition);
    state.marketMap.items[evaluated.id] = evaluated;

    if (evaluated.type === MARKET_ITEM_TYPES.OFFER) state.marketMap.offers[evaluated.id] = evaluated;
    if (evaluated.type === MARKET_ITEM_TYPES.PRODUCT) state.marketMap.products[evaluated.id] = evaluated;
    if (evaluated.type === MARKET_ITEM_TYPES.ENGINE) state.marketMap.engines[evaluated.id] = evaluated;
    if (evaluated.type === MARKET_ITEM_TYPES.DEMO) state.marketMap.demos[evaluated.id] = evaluated;
    if (evaluated.type === MARKET_ITEM_TYPES.DOCUMENTATION) state.marketMap.documentation[evaluated.id] = evaluated;
    if (evaluated.type === MARKET_ITEM_TYPES.LICENSE) state.marketMap.licenses[evaluated.id] = evaluated;
    if (evaluated.type === MARKET_ITEM_TYPES.EVIDENCE) state.marketMap.evidence[evaluated.id] = evaluated;
    if (evaluated.type === MARKET_ITEM_TYPES.RISK_BOUNDARY) state.marketMap.riskBoundaries[evaluated.id] = evaluated;
    if (evaluated.type === MARKET_ITEM_TYPES.DISTRIBUTION) state.marketMap.distribution[evaluated.id] = evaluated;
    if (evaluated.type === MARKET_ITEM_TYPES.IMPLEMENTATION) state.marketMap.implementation[evaluated.id] = evaluated;

    if (options.silent !== true) {
      recordLocal("MARKET_ITEM_REGISTERED", {
        id: evaluated.id,
        type: evaluated.type,
        status: evaluated.status,
        readinessScore: evaluated.readinessScore
      });
    }

    buildMarketMap({ silent: true });
    computeFibonacciSynchronizationMetric();
    publishGlobals();
    updateDataset();

    return evaluated;
  }

  function marketTypeForRegistryType(registryType = "") {
    const type = safeString(registryType, "");

    if (type === "product") return MARKET_ITEM_TYPES.PRODUCT;
    if (type === "engine") return MARKET_ITEM_TYPES.ENGINE;
    if (type === "expression-node") return MARKET_ITEM_TYPES.DEMO;
    if (type === "file") return MARKET_ITEM_TYPES.IMPLEMENTATION;
    if (type === "receipt" || type === "evidence") return MARKET_ITEM_TYPES.EVIDENCE;
    if (type === "route") return MARKET_ITEM_TYPES.DISTRIBUTION;

    return MARKET_ITEM_TYPES.OFFER;
  }

  function seedMarketMapFromRegistry(entries = [], options = {}) {
    const sourceEntries = Array.isArray(entries) ? entries : [];

    sourceEntries.forEach((entry, index) => {
      const sourceType = safeString(entry.type, "");
      const marketType = marketTypeForRegistryType(sourceType);
      const readiness = safeNumber(entry.readinessScore, 0);
      const registryReady = safeString(entry.status, "") === STATUS.READY || safeString(entry.status, "") === STATUS.DEGRADED;

      registerMarketItem({
        id: `market-${entry.id || index}`,
        type: marketType,
        label: entry.label || entry.id || `Registry Item ${index + 1}`,
        productId: entry.productId || entry.id || `registry-product-${index + 1}`,
        sourceRegistryId: entry.id || "",
        sourceFile: entry.sourceFile || entry.file || REGISTRY_FILE,
        sourceContract: entry.sourceContract || entry.contract || "",
        sourceReceipt: entry.sourceReceipt || entry.receipt || "",
        sourceFibonacciGate: FIBONACCI.PROJECT_REGISTRY,
        activeFibonacci: FIBONACCI.MARKET_READINESS,
        futureFibonacciGate: FIBONACCI.DOWNSTREAM_RELEASE,
        priority: entry.priority || Math.max(40, 90 - index),

        receiptReady: safeBool(entry.receiptReady, readiness >= 50),
        registryReady,
        platformReady: safeBool(entry.platformReady, readiness >= 60),
        engineeringReady: safeBool(entry.engineeringReady, readiness >= 60),
        demoReady: safeBool(entry.expressionReady, readiness >= 72),
        offerReady: marketType === MARKET_ITEM_TYPES.PRODUCT || marketType === MARKET_ITEM_TYPES.OFFER || readiness >= 84,
        documentationReady: readiness >= 76,
        licensingReady: readiness >= 80,
        evidenceReady: readiness >= 70,
        riskBoundaryReady: true,
        distributionReady: readiness >= 80,
        implementationReady: readiness >= 74,
        packagingReady: readiness >= 80,
        supportReady: readiness >= 70,
        onboardingReady: readiness >= 70,

        dependencies: Array.isArray(entry.dependencies) ? entry.dependencies.slice() : [],
        tags: Array.isArray(entry.tags) ? entry.tags.slice() : []
      }, { silent: true });
    });

    registerMarketItem({
      id: "market-offer-product-engine-conductor",
      type: MARKET_ITEM_TYPES.OFFER,
      label: "Product Engine Conductor Offer",
      sourceFile: FILE,
      sourceContract: CONTRACT,
      sourceReceipt: RECEIPT,
      receiptReady: true,
      registryReady: state.f89RegistryAccepted,
      platformReady: true,
      engineeringReady: true,
      demoReady: state.marketItemCount > 0,
      offerReady: true,
      documentationReady: true,
      licensingReady: true,
      evidenceReady: true,
      riskBoundaryReady: true,
      distributionReady: true,
      implementationReady: true,
      priceReady: false,
      packagingReady: true,
      supportReady: true,
      onboardingReady: true,
      priority: 100
    }, { silent: true });

    registerMarketItem({
      id: "risk-boundary-no-public-superiority-claim",
      type: MARKET_ITEM_TYPES.RISK_BOUNDARY,
      label: "No Public Superiority Claim Boundary",
      sourceFile: FILE,
      sourceContract: CONTRACT,
      sourceReceipt: RECEIPT,
      receiptReady: true,
      registryReady: true,
      platformReady: true,
      engineeringReady: true,
      demoReady: true,
      offerReady: true,
      documentationReady: true,
      licensingReady: true,
      evidenceReady: true,
      riskBoundaryReady: true,
      distributionReady: true,
      implementationReady: true,
      priority: 99,
      tags: ["claim-boundary", "market-safety", "internal-target-only"]
    }, { silent: true });

    if (options.silent !== true) {
      recordLocal("MARKET_MAP_SEEDED_FROM_PROJECT_REGISTRY", {
        registryEntryCount: sourceEntries.length
      });
    }
  }

  function rebuildMarketIndexes() {
    state.marketMap.offers = {};
    state.marketMap.products = {};
    state.marketMap.engines = {};
    state.marketMap.demos = {};
    state.marketMap.documentation = {};
    state.marketMap.licenses = {};
    state.marketMap.evidence = {};
    state.marketMap.riskBoundaries = {};
    state.marketMap.distribution = {};
    state.marketMap.implementation = {};

    Object.values(state.marketMap.items).forEach((item) => {
      if (item.type === MARKET_ITEM_TYPES.OFFER) state.marketMap.offers[item.id] = item;
      if (item.type === MARKET_ITEM_TYPES.PRODUCT) state.marketMap.products[item.id] = item;
      if (item.type === MARKET_ITEM_TYPES.ENGINE) state.marketMap.engines[item.id] = item;
      if (item.type === MARKET_ITEM_TYPES.DEMO) state.marketMap.demos[item.id] = item;
      if (item.type === MARKET_ITEM_TYPES.DOCUMENTATION) state.marketMap.documentation[item.id] = item;
      if (item.type === MARKET_ITEM_TYPES.LICENSE) state.marketMap.licenses[item.id] = item;
      if (item.type === MARKET_ITEM_TYPES.EVIDENCE) state.marketMap.evidence[item.id] = item;
      if (item.type === MARKET_ITEM_TYPES.RISK_BOUNDARY) state.marketMap.riskBoundaries[item.id] = item;
      if (item.type === MARKET_ITEM_TYPES.DISTRIBUTION) state.marketMap.distribution[item.id] = item;
      if (item.type === MARKET_ITEM_TYPES.IMPLEMENTATION) state.marketMap.implementation[item.id] = item;
    });
  }

  function evaluateAllMarketItems() {
    const current = Object.values(state.marketMap.items);
    const evaluated = {};

    current.forEach((item) => {
      const next = evaluateMarketItem(item);
      evaluated[next.id] = next;
    });

    state.marketMap.items = evaluated;
    rebuildMarketIndexes();

    return Object.values(state.marketMap.items);
  }

  function computeMarketReadinessScores(items = Object.values(state.marketMap.items)) {
    const list = Array.isArray(items) ? items : [];

    function scoreFor(field) {
      if (!list.length) return 0;
      return Math.round((list.filter((item) => item[field] === true).length / list.length) * 100);
    }

    state.platformReadinessScore = scoreFor("platformReady");
    state.engineeringReadinessScore = scoreFor("engineeringReady");
    state.demoReadinessScore = scoreFor("demoReady");
    state.offerReadinessScore = scoreFor("offerReady");
    state.documentationReadinessScore = scoreFor("documentationReady");
    state.licensingReadinessScore = scoreFor("licensingReady");
    state.evidenceReadinessScore = scoreFor("evidenceReady");
    state.riskBoundaryReadinessScore = scoreFor("riskBoundaryReady");
    state.distributionReadinessScore = scoreFor("distributionReady");
    state.implementationReadinessScore = scoreFor("implementationReady");

    state.marketReadinessScore = average([
      state.platformReadinessScore,
      state.engineeringReadinessScore,
      state.demoReadinessScore,
      state.offerReadinessScore,
      state.documentationReadinessScore,
      state.licensingReadinessScore,
      state.evidenceReadinessScore,
      state.riskBoundaryReadinessScore,
      state.distributionReadinessScore,
      state.implementationReadinessScore
    ]);

    state.internalSurpassMarketEngineTargetScore = average([
      state.marketReadinessScore,
      state.registryQualityScore,
      state.registryCoverageScore,
      state.registryTraceScore,
      state.registryCoherenceScore,
      state.fibonacciSynchronizationScore,
      state.riskBoundaryReadinessScore,
      INTERNAL_BENCHMARK_TARGETS.publicClaimSafety
    ]);

    state.internalSurpassTargetMet = Boolean(
      state.internalSurpassMarketEngineTargetScore >= 90 &&
      state.riskBoundaryReadinessScore >= 90 &&
      state.fibonacciSynchronizationScore >= 90 &&
      !state.publicSuperiorityClaim
    );

    return {
      platformReadinessScore: state.platformReadinessScore,
      engineeringReadinessScore: state.engineeringReadinessScore,
      demoReadinessScore: state.demoReadinessScore,
      offerReadinessScore: state.offerReadinessScore,
      documentationReadinessScore: state.documentationReadinessScore,
      licensingReadinessScore: state.licensingReadinessScore,
      evidenceReadinessScore: state.evidenceReadinessScore,
      riskBoundaryReadinessScore: state.riskBoundaryReadinessScore,
      distributionReadinessScore: state.distributionReadinessScore,
      implementationReadinessScore: state.implementationReadinessScore,
      marketReadinessScore: state.marketReadinessScore,
      internalSurpassMarketEngineTargetScore: state.internalSurpassMarketEngineTargetScore,
      internalSurpassTargetMet: state.internalSurpassTargetMet,
      publicSuperiorityClaim: false
    };
  }

  function buildMarketMap(options = {}) {
    const items = evaluateAllMarketItems();

    const edges = [];

    items.forEach((item) => {
      item.dependencies.forEach((dependency) => {
        edges.push({
          from: dependency,
          to: item.id,
          type: "dependency",
          deterministic: true
        });
      });

      if (item.sourceRegistryId) {
        edges.push({
          from: item.sourceRegistryId,
          to: item.id,
          type: "registry-source",
          deterministic: true
        });
      }

      if (item.sourceFile) {
        edges.push({
          from: makeId(item.sourceFile, "source-file"),
          to: item.id,
          type: "source-file",
          deterministic: true
        });
      }
    });

    const sortedItems = items.slice().sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      if (a.type !== b.type) return a.type.localeCompare(b.type);
      return a.id.localeCompare(b.id);
    });

    state.marketMap.items = sortedItems.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});

    rebuildMarketIndexes();

    state.marketMap.edges = edges;
    state.marketMap.buildId = `f144-market-map-${sortedItems.length}-${edges.length}`;
    state.marketMap.builtAt = nowIso();

    state.marketMapBuilt = true;
    state.marketItemCount = sortedItems.length;
    state.marketReadyItemCount = sortedItems.filter((item) => item.status === STATUS.READY).length;
    state.marketDegradedItemCount = sortedItems.filter((item) => item.status === STATUS.DEGRADED).length;
    state.marketBlockedItemCount = sortedItems.filter((item) => item.status === STATUS.BLOCKED || item.status === STATUS.HELD).length;

    computeMarketReadinessScores(sortedItems);

    state.marketReady = Boolean(
      state.f89RegistryAccepted &&
      state.marketItemCount > 0 &&
      state.marketBlockedItemCount === 0 &&
      state.marketReadinessScore >= 88
    );

    if (state.marketReady) {
      state.marketStatus = STATUS.READY;
      state.f144ActivationStatus = STATUS.READY;
      state.f144ActivationReason = "MARKET_F144_READY_DOWNSTREAM_RELEASE_AVAILABLE";
      state.f144ReleasePacketReady = true;
      state.f233DownstreamReleaseGateReady = true;
      state.f233DownstreamReleaseAuthorized = true;
      state.f233DownstreamTarget = NORTH_FILE;
      state.firstFailedCoordinate = "NONE_MARKET_F144_READY_DOWNSTREAM_RELEASE_AVAILABLE";
      state.recommendedNextFile = NORTH_FILE;
      state.recommendedNextRenewalTarget = NORTH_FILE;
    } else if (state.f89RegistryAccepted && state.marketItemCount > 0 && state.marketReadinessScore >= 62) {
      state.marketStatus = STATUS.DEGRADED;
      state.f144ActivationStatus = STATUS.DEGRADED;
      state.f144ActivationReason = "MARKET_F144_DEGRADED_DOWNSTREAM_RELEASE_AVAILABLE_WITH_BOUNDARIES";
      state.f144ReleasePacketReady = true;
      state.f233DownstreamReleaseGateReady = true;
      state.f233DownstreamReleaseAuthorized = true;
      state.f233DownstreamTarget = NORTH_FILE;
      state.firstFailedCoordinate = "NONE_MARKET_F144_DEGRADED_DOWNSTREAM_RELEASE_AVAILABLE_WITH_BOUNDARIES";
      state.recommendedNextFile = NORTH_FILE;
      state.recommendedNextRenewalTarget = NORTH_FILE;
    } else {
      state.marketStatus = STATUS.HELD;
      state.f144ActivationStatus = STATUS.HELD;
      state.f144ActivationReason = state.f89RegistryAccepted ? "WAITING_MARKET_READY_ITEMS" : "WAITING_PROJECT_REGISTRY_F89_RELEASE";
      state.f144ReleasePacketReady = false;
      state.f233DownstreamReleaseGateReady = false;
      state.f233DownstreamReleaseAuthorized = false;
      state.f233DownstreamTarget = "";
      state.firstFailedCoordinate = state.f144ActivationReason;
      state.recommendedNextFile = state.f89RegistryAccepted ? FILE : REGISTRY_FILE;
      state.recommendedNextRenewalTarget = state.recommendedNextFile;
    }

    computeFibonacciSynchronizationMetric();

    if (options.silent !== true) {
      recordLocal("MARKET_F144_MAP_BUILT", {
        itemCount: state.marketItemCount,
        edgeCount: edges.length,
        marketReady: state.marketReady,
        marketStatus: state.marketStatus,
        marketReadinessScore: state.marketReadinessScore
      });
    }

    updateDataset();
    return clonePlain(state.marketMap);
  }

  function computeFibonacciSynchronizationMetric() {
    const checks = [
      state.newsProtocolAligned,
      state.oneActiveGearAtATime,
      state.activeFibonacci === FIBONACCI.MARKET_READINESS,
      state.sourceFibonacciGate === FIBONACCI.PROJECT_REGISTRY,
      state.futureFibonacciGate === FIBONACCI.DOWNSTREAM_RELEASE,
      state.activeNewsGate === NEWS_GATES.MARKET,
      state.f89RegistryObserved,
      state.f89RegistryAccepted,
      state.f144MarketConductorActive,
      state.marketMapBuilt,
      state.f144ReceiptReady,
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

    computeMarketReadinessScores();

    return {
      score: state.fibonacciSynchronizationScore,
      passed,
      total: checks.length,
      activeFibonacci: FIBONACCI.MARKET_READINESS,
      activeFibonacciRank: 144,
      activeNewsGate: NEWS_GATES.MARKET,
      futureFibonacciGate: FIBONACCI.DOWNSTREAM_RELEASE,
      publicSuperiorityClaim: false
    };
  }

  function evaluateNewsAlignment() {
    const metric = computeFibonacciSynchronizationMetric();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      newsAlignmentContract: "LAB_PRODUCT_ENGINE_MARKET_F144_NEWS_ALIGNMENT_PROTOCOL_v1",
      newsAlignmentReceipt: "LAB_PRODUCT_ENGINE_MARKET_F144_NEWS_ALIGNMENT_PROTOCOL_RECEIPT_v1",
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
          ready: state.ue5ExpressionF55Accepted
        },
        {
          gate: NEWS_GATES.REGISTRY,
          fibonacci: FIBONACCI.PROJECT_REGISTRY,
          file: REGISTRY_FILE,
          ready: state.f89RegistryAccepted
        },
        {
          gate: NEWS_GATES.MARKET,
          fibonacci: FIBONACCI.MARKET_READINESS,
          file: FILE,
          ready: state.marketReady || state.marketStatus === STATUS.DEGRADED
        },
        {
          gate: NEWS_GATES.DOWNSTREAM,
          fibonacci: FIBONACCI.DOWNSTREAM_RELEASE,
          file: NORTH_FILE,
          ready: state.f233DownstreamReleaseAuthorized
        }
      ],
      fibonacciSynchronizationScore: metric.score,
      f144Status: state.f144ActivationStatus,
      marketStatus: state.marketStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function getInternalBenchmarkProfile() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      benchmarkProfile: "INTERNAL_SURPASS_MARKET_ENGINE_TARGET_ONLY_v1",
      targetLanguage: "Internal readiness target only; no public superiority claim.",
      benchmarkTargets: clonePlain(INTERNAL_BENCHMARK_TARGETS),
      observedScores: {
        deterministicRegistry: state.f89RegistryAccepted ? 100 : 0,
        receiptTraceability: state.registryTraceScore,
        multiProductConductorship: state.registryCoverageScore,
        marketPackaging: state.offerReadinessScore,
        implementationReadiness: state.implementationReadinessScore,
        riskBoundaryClarity: state.riskBoundaryReadinessScore,
        documentationCompleteness: state.documentationReadinessScore,
        demoClarity: state.demoReadinessScore,
        licensingClarity: state.licensingReadinessScore,
        publicClaimSafety: state.publicSuperiorityClaim ? 0 : 100
      },
      internalSurpassMarketEngineTargetScore: state.internalSurpassMarketEngineTargetScore,
      internalSurpassTargetMet: state.internalSurpassTargetMet,
      publicSuperiorityClaim: false,
      publicComparisonClaimAllowed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function composeMarketReadinessSummary() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      marketReadinessSummary: true,
      marketReady: state.marketReady,
      marketStatus: state.marketStatus,
      marketReadinessScore: state.marketReadinessScore,
      platformReadinessScore: state.platformReadinessScore,
      engineeringReadinessScore: state.engineeringReadinessScore,
      demoReadinessScore: state.demoReadinessScore,
      offerReadinessScore: state.offerReadinessScore,
      documentationReadinessScore: state.documentationReadinessScore,
      licensingReadinessScore: state.licensingReadinessScore,
      evidenceReadinessScore: state.evidenceReadinessScore,
      riskBoundaryReadinessScore: state.riskBoundaryReadinessScore,
      distributionReadinessScore: state.distributionReadinessScore,
      implementationReadinessScore: state.implementationReadinessScore,
      internalBenchmark: getInternalBenchmarkProfile(),
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      publicSuperiorityClaim: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function composeF144ReleasePacket(extra = {}) {
    const metric = computeFibonacciSynchronizationMetric();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "MARKET_F144_READINESS_RELEASE_PACKET",
      sourceFile: FILE,
      targetFile: NORTH_FILE,
      destinationFile: NORTH_FILE,

      activeFibonacci: FIBONACCI.MARKET_READINESS,
      activeFibonacciRank: 144,
      activeNewsGate: NEWS_GATES.MARKET,
      sourceFibonacciGate: FIBONACCI.PROJECT_REGISTRY,
      futureFibonacciGate: FIBONACCI.DOWNSTREAM_RELEASE,
      futureFibonacciRank: 233,

      f89RegistryAccepted: state.f89RegistryAccepted,
      marketMapBuilt: state.marketMapBuilt,
      marketReady: state.marketReady,
      marketStatus: state.marketStatus,
      marketReadinessScore: state.marketReadinessScore,
      f233DownstreamReleaseAuthorized: state.f233DownstreamReleaseAuthorized,

      marketItemCount: state.marketItemCount,
      marketReadyItemCount: state.marketReadyItemCount,
      marketDegradedItemCount: state.marketDegradedItemCount,
      marketBlockedItemCount: state.marketBlockedItemCount,

      readinessScores: {
        platform: state.platformReadinessScore,
        engineering: state.engineeringReadinessScore,
        demo: state.demoReadinessScore,
        offer: state.offerReadinessScore,
        documentation: state.documentationReadinessScore,
        licensing: state.licensingReadinessScore,
        evidence: state.evidenceReadinessScore,
        riskBoundary: state.riskBoundaryReadinessScore,
        distribution: state.distributionReadinessScore,
        implementation: state.implementationReadinessScore,
        market: state.marketReadinessScore
      },

      internalBenchmarkTargetActive: true,
      internalSurpassMarketEngineTargetScore: state.internalSurpassMarketEngineTargetScore,
      internalSurpassTargetMet: state.internalSurpassTargetMet,
      publicSuperiorityClaim: false,
      publicComparisonClaimAllowed: false,

      newsProtocolAligned: true,
      fibonacciSynchronizationMetricActive: true,
      fibonacciSynchronizationScore: metric.score,
      oneActiveGearAtATime: true,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      marketMap: clonePlain(state.marketMap),
      marketReadinessSummary: composeMarketReadinessSummary(),
      detail: clonePlain(extra),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      composedAt: nowIso()
    };
  }

  function submitF144ReceiptToNorth() {
    state.northSubmissionAttempted = true;

    const north = firstGlobal([
      "HEARTH_CHECKPOINT_SESSION",
      "HEARTH_RUNTIME_CHECKPOINT_SESSION",
      "LAB_HEARTH_CHECKPOINT_SESSION",
      "LAB_CHECKPOINT_SESSION",
      "LAB_RUNTIME_TABLE",
      "LAB_RUNTIME_TABLE_NORTH",
      "DEXTER_LAB.runtimeTable",
      "DEXTER_LAB.hearthCheckpointSession",
      "DEXTER_LAB.checkpointSession",
      "HEARTH.northCommandRuntimeTable"
    ]);

    const packet = composeF144ReleasePacket({
      submittedToNorth: true
    });

    if (!north) {
      state.northSubmissionAccepted = false;
      recordLocal("F144_NORTH_SUBMISSION_HELD", {
        reason: "NORTH_AUTHORITY_UNAVAILABLE"
      });

      updateDataset();

      return {
        submitted: false,
        accepted: false,
        reason: "NORTH_AUTHORITY_UNAVAILABLE",
        recommendedNextFile: NORTH_FILE,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };
    }

    const methods = ["acceptF21Eligibility", "receiveF21Eligibility", "submitF21Eligibility", "submitEvent", "receiveEvent", "submit"];

    for (const method of methods) {
      if (!isFunction(north[method])) continue;

      try {
        const response = north[method]({
          ...packet,
          event: "F144_MARKET_READINESS_PACKET",
          checkpointEvent: "F144_MARKET_READINESS_PACKET",
          f21EligibleForNorth: false,
          marketF144Ready: state.marketReady || state.marketStatus === STATUS.DEGRADED,
          f233DownstreamReleaseAuthorized: state.f233DownstreamReleaseAuthorized
        });

        state.northSubmissionAccepted = Boolean(response && response.accepted !== false);
        recordLocal("F144_RECEIPT_SUBMITTED_TO_NORTH", {
          method,
          accepted: state.northSubmissionAccepted
        });

        updateDataset();

        return {
          submitted: true,
          accepted: state.northSubmissionAccepted,
          method,
          response: clonePlain(response),
          generatedImage: false,
          graphicBox: false,
          webGL: false,
          visualPassClaimed: false
        };
      } catch (error) {
        recordError("F144_NORTH_SUBMISSION_METHOD_FAILED", error, { method });
      }
    }

    state.northSubmissionAccepted = false;
    updateDataset();

    return {
      submitted: false,
      accepted: false,
      reason: "NORTH_ACCEPT_METHOD_UNAVAILABLE",
      recommendedNextFile: NORTH_FILE,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function getMarketItem(id) {
    const key = makeId(id, "");
    return clonePlain(state.marketMap.items[key] || null);
  }

  function listMarketItems(type = "") {
    const items = Object.values(state.marketMap.items);
    if (!type) return clonePlain(items);
    return clonePlain(items.filter((item) => item.type === type));
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

      f144MarketConductorActive: true,
      f144Only: true,
      f89RegistryRequired: true,
      f89RegistryObserved: state.f89RegistryObserved,
      f89RegistryAccepted: state.f89RegistryAccepted,
      f89RegistryContract: state.f89RegistryContract,
      f89RegistryReceipt: state.f89RegistryReceipt,

      productEngineF34Accepted: state.productEngineF34Accepted,
      ue5ExpressionF55Accepted: state.ue5ExpressionF55Accepted,
      projectRegistryF89Accepted: state.projectRegistryF89Accepted,
      northF21Acknowledged: state.northF21Acknowledged,
      canvasF13EvidenceObserved: state.canvasF13EvidenceObserved,
      canvasF13EvidenceComplete: state.canvasF13EvidenceComplete,
      canvasF13EvidenceDegraded: state.canvasF13EvidenceDegraded,

      registryEntryCount: state.registryEntryCount,
      registryReadyEntryCount: state.registryReadyEntryCount,
      registryDegradedEntryCount: state.registryDegradedEntryCount,
      registryBlockedEntryCount: state.registryBlockedEntryCount,
      registryProductCount: state.registryProductCount,
      registryEngineCount: state.registryEngineCount,
      registryFileCount: state.registryFileCount,
      registryExpressionNodeCount: state.registryExpressionNodeCount,
      registryQualityScore: state.registryQualityScore,
      registryCoverageScore: state.registryCoverageScore,
      registryTraceScore: state.registryTraceScore,
      registryCoherenceScore: state.registryCoherenceScore,
      registryFibonacciSynchronizationScore: state.registryFibonacciSynchronizationScore,

      marketMapBuilt: state.marketMapBuilt,
      marketReady: state.marketReady,
      marketStatus: state.marketStatus,
      marketItemCount: state.marketItemCount,
      marketReadyItemCount: state.marketReadyItemCount,
      marketDegradedItemCount: state.marketDegradedItemCount,
      marketBlockedItemCount: state.marketBlockedItemCount,

      platformReadinessScore: state.platformReadinessScore,
      engineeringReadinessScore: state.engineeringReadinessScore,
      demoReadinessScore: state.demoReadinessScore,
      offerReadinessScore: state.offerReadinessScore,
      documentationReadinessScore: state.documentationReadinessScore,
      licensingReadinessScore: state.licensingReadinessScore,
      evidenceReadinessScore: state.evidenceReadinessScore,
      riskBoundaryReadinessScore: state.riskBoundaryReadinessScore,
      distributionReadinessScore: state.distributionReadinessScore,
      implementationReadinessScore: state.implementationReadinessScore,
      marketReadinessScore: state.marketReadinessScore,

      internalBenchmarkTargetActive: true,
      internalBenchmarkTargetName: state.internalBenchmarkTargetName,
      internalSurpassMarketEngineTargetScore: state.internalSurpassMarketEngineTargetScore,
      internalSurpassTargetMet: state.internalSurpassTargetMet,
      publicSuperiorityClaim: false,
      publicComparisonClaimAllowed: false,

      f233DownstreamReleaseGateReady: state.f233DownstreamReleaseGateReady,
      f233DownstreamReleaseAuthorized: state.f233DownstreamReleaseAuthorized,
      f233DownstreamTarget: state.f233DownstreamTarget,
      northSubmissionAttempted: state.northSubmissionAttempted,
      northSubmissionAccepted: state.northSubmissionAccepted,

      newsProtocolAligned: true,
      fibonacciSynchronizationMetricActive: true,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      activeFibonacci: FIBONACCI.MARKET_READINESS,
      activeFibonacciRank: 144,
      activeNewsGate: NEWS_GATES.MARKET,
      sourceFibonacciGate: FIBONACCI.PROJECT_REGISTRY,
      futureFibonacciGate: FIBONACCI.DOWNSTREAM_RELEASE,
      oneActiveGearAtATime: true,

      f144ActivationStatus: state.f144ActivationStatus,
      f144ActivationReason: state.f144ActivationReason,
      f144ReceiptReady: true,
      f144ReleasePacketReady: state.f144ReleasePacketReady,

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

      marketF144Receipt: true,
      marketConductorOwns: [
        "F144 market-readiness conductorship",
        "market map",
        "offer-readiness scoring",
        "demo-readiness scoring",
        "documentation-readiness scoring",
        "licensing-readiness scoring",
        "evidence-readiness scoring",
        "risk-boundary-readiness scoring",
        "distribution-readiness scoring",
        "implementation-readiness scoring",
        "internal benchmark target scoring",
        "F233 downstream-release handoff packet",
        "NEWS/Fibonacci synchronization metric"
      ],
      marketConductorDoesNotOwn: [
        "North F21 latch",
        "Product Engine F34 authority",
        "UE5 Expression F55 authority",
        "Project Registry F89 authority",
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
        productEngine: PRODUCT_ENGINE_FILE,
        ue5Expression: UE5_EXPRESSION_FILE,
        registry: REGISTRY_FILE,
        market: FILE
      },

      marketItemTypes: clonePlain(MARKET_ITEM_TYPES),
      readinessBuckets: clonePlain(READINESS_BUCKETS),
      fibonacciMap: clonePlain(FIBONACCI),
      newsGates: clonePlain(NEWS_GATES),
      internalBenchmarkTargets: clonePlain(INTERNAL_BENCHMARK_TARGETS),

      marketMap: clonePlain(state.marketMap),
      marketItems: clonePlain(Object.values(state.marketMap.items)),
      marketReadinessSummary: composeMarketReadinessSummary(),
      internalBenchmarkProfile: getInternalBenchmarkProfile(),
      newsAlignment: evaluateNewsAlignment(),
      f144ReleasePacket: composeF144ReleasePacket(),
      f89ReleasePacket: clonePlain(state.f89ReleasePacket),

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

    const items = (r.marketItems || []).map((item) => (
      `- ${item.id} :: type=${item.type} :: status=${item.status} :: score=${item.readinessScore} :: source=${item.sourceRegistryId || item.sourceFile || ""}`
    )).join("\n") || "- none";

    const events = (r.localEvents || []).slice(-48).map((item) => (
      `- ${item.at} :: ${item.event} :: ${JSON.stringify(item.detail || {})}`
    )).join("\n") || "- none";

    const errors = (r.errors || []).map((item) => (
      `- ${item.at} :: ${item.code} :: ${item.message}`
    )).join("\n") || "- none";

    return [
      "LAB_PRODUCT_ENGINE_MARKET_F144_READINESS_CONDUCTOR_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `role=${r.role}`,
      "",
      `f144MarketConductorActive=${r.f144MarketConductorActive}`,
      `f144Only=${r.f144Only}`,
      `f89RegistryRequired=${r.f89RegistryRequired}`,
      `f89RegistryObserved=${r.f89RegistryObserved}`,
      `f89RegistryAccepted=${r.f89RegistryAccepted}`,
      `f89RegistryContract=${r.f89RegistryContract}`,
      `f89RegistryReceipt=${r.f89RegistryReceipt}`,
      "",
      `productEngineF34Accepted=${r.productEngineF34Accepted}`,
      `ue5ExpressionF55Accepted=${r.ue5ExpressionF55Accepted}`,
      `projectRegistryF89Accepted=${r.projectRegistryF89Accepted}`,
      `northF21Acknowledged=${r.northF21Acknowledged}`,
      `canvasF13EvidenceObserved=${r.canvasF13EvidenceObserved}`,
      `canvasF13EvidenceComplete=${r.canvasF13EvidenceComplete}`,
      `canvasF13EvidenceDegraded=${r.canvasF13EvidenceDegraded}`,
      "",
      `registryEntryCount=${r.registryEntryCount}`,
      `registryReadyEntryCount=${r.registryReadyEntryCount}`,
      `registryDegradedEntryCount=${r.registryDegradedEntryCount}`,
      `registryBlockedEntryCount=${r.registryBlockedEntryCount}`,
      `registryProductCount=${r.registryProductCount}`,
      `registryEngineCount=${r.registryEngineCount}`,
      `registryFileCount=${r.registryFileCount}`,
      `registryExpressionNodeCount=${r.registryExpressionNodeCount}`,
      `registryQualityScore=${r.registryQualityScore}`,
      `registryCoverageScore=${r.registryCoverageScore}`,
      `registryTraceScore=${r.registryTraceScore}`,
      `registryCoherenceScore=${r.registryCoherenceScore}`,
      `registryFibonacciSynchronizationScore=${r.registryFibonacciSynchronizationScore}`,
      "",
      `marketMapBuilt=${r.marketMapBuilt}`,
      `marketReady=${r.marketReady}`,
      `marketStatus=${r.marketStatus}`,
      `marketItemCount=${r.marketItemCount}`,
      `marketReadyItemCount=${r.marketReadyItemCount}`,
      `marketDegradedItemCount=${r.marketDegradedItemCount}`,
      `marketBlockedItemCount=${r.marketBlockedItemCount}`,
      "",
      `platformReadinessScore=${r.platformReadinessScore}`,
      `engineeringReadinessScore=${r.engineeringReadinessScore}`,
      `demoReadinessScore=${r.demoReadinessScore}`,
      `offerReadinessScore=${r.offerReadinessScore}`,
      `documentationReadinessScore=${r.documentationReadinessScore}`,
      `licensingReadinessScore=${r.licensingReadinessScore}`,
      `evidenceReadinessScore=${r.evidenceReadinessScore}`,
      `riskBoundaryReadinessScore=${r.riskBoundaryReadinessScore}`,
      `distributionReadinessScore=${r.distributionReadinessScore}`,
      `implementationReadinessScore=${r.implementationReadinessScore}`,
      `marketReadinessScore=${r.marketReadinessScore}`,
      "",
      `internalBenchmarkTargetActive=${r.internalBenchmarkTargetActive}`,
      `internalBenchmarkTargetName=${r.internalBenchmarkTargetName}`,
      `internalSurpassMarketEngineTargetScore=${r.internalSurpassMarketEngineTargetScore}`,
      `internalSurpassTargetMet=${r.internalSurpassTargetMet}`,
      `publicSuperiorityClaim=${r.publicSuperiorityClaim}`,
      `publicComparisonClaimAllowed=${r.publicComparisonClaimAllowed}`,
      "",
      `f233DownstreamReleaseGateReady=${r.f233DownstreamReleaseGateReady}`,
      `f233DownstreamReleaseAuthorized=${r.f233DownstreamReleaseAuthorized}`,
      `f233DownstreamTarget=${r.f233DownstreamTarget}`,
      `northSubmissionAttempted=${r.northSubmissionAttempted}`,
      `northSubmissionAccepted=${r.northSubmissionAccepted}`,
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
      `f144ActivationStatus=${r.f144ActivationStatus}`,
      `f144ActivationReason=${r.f144ActivationReason}`,
      `f144ReceiptReady=${r.f144ReceiptReady}`,
      `f144ReleasePacketReady=${r.f144ReleasePacketReady}`,
      "",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      "",
      "MARKET_ITEMS",
      items,
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
    setDataset("labProductEngineMarketLoaded", "true");
    setDataset("labProductEngineMarketContract", CONTRACT);
    setDataset("labProductEngineMarketReceipt", RECEIPT);
    setDataset("labProductEngineMarketVersion", VERSION);
    setDataset("labProductEngineMarketFile", FILE);

    setDataset("productEngineMarketF144Only", "true");
    setDataset("productEngineMarketConductorActive", "true");
    setDataset("productEngineMarketF89RegistryRequired", "true");
    setDataset("productEngineMarketF89RegistryObserved", state.f89RegistryObserved);
    setDataset("productEngineMarketF89RegistryAccepted", state.f89RegistryAccepted);

    setDataset("productEngineMarketMapBuilt", state.marketMapBuilt);
    setDataset("productEngineMarketReady", state.marketReady);
    setDataset("productEngineMarketStatus", state.marketStatus);
    setDataset("productEngineMarketItemCount", state.marketItemCount);
    setDataset("productEngineMarketReadyItemCount", state.marketReadyItemCount);
    setDataset("productEngineMarketDegradedItemCount", state.marketDegradedItemCount);
    setDataset("productEngineMarketBlockedItemCount", state.marketBlockedItemCount);

    setDataset("productEngineMarketReadinessScore", state.marketReadinessScore);
    setDataset("productEngineMarketPlatformReadinessScore", state.platformReadinessScore);
    setDataset("productEngineMarketEngineeringReadinessScore", state.engineeringReadinessScore);
    setDataset("productEngineMarketDemoReadinessScore", state.demoReadinessScore);
    setDataset("productEngineMarketOfferReadinessScore", state.offerReadinessScore);
    setDataset("productEngineMarketDocumentationReadinessScore", state.documentationReadinessScore);
    setDataset("productEngineMarketLicensingReadinessScore", state.licensingReadinessScore);
    setDataset("productEngineMarketEvidenceReadinessScore", state.evidenceReadinessScore);
    setDataset("productEngineMarketRiskBoundaryReadinessScore", state.riskBoundaryReadinessScore);
    setDataset("productEngineMarketDistributionReadinessScore", state.distributionReadinessScore);
    setDataset("productEngineMarketImplementationReadinessScore", state.implementationReadinessScore);

    setDataset("productEngineMarketInternalBenchmarkTargetActive", "true");
    setDataset("productEngineMarketInternalSurpassMarketEngineTargetScore", state.internalSurpassMarketEngineTargetScore);
    setDataset("productEngineMarketInternalSurpassTargetMet", state.internalSurpassTargetMet);
    setDataset("productEngineMarketPublicSuperiorityClaim", "false");
    setDataset("productEngineMarketPublicComparisonClaimAllowed", "false");

    setDataset("productEngineMarketF233DownstreamReleaseGateReady", state.f233DownstreamReleaseGateReady);
    setDataset("productEngineMarketF233DownstreamReleaseAuthorized", state.f233DownstreamReleaseAuthorized);
    setDataset("productEngineMarketF233DownstreamTarget", state.f233DownstreamTarget);

    setDataset("productEngineMarketNewsProtocolAligned", "true");
    setDataset("productEngineMarketFibonacciSynchronizationMetricActive", "true");
    setDataset("productEngineMarketFibonacciSynchronizationScore", state.fibonacciSynchronizationScore);
    setDataset("productEngineMarketActiveFibonacci", FIBONACCI.MARKET_READINESS);
    setDataset("productEngineMarketActiveFibonacciRank", "144");
    setDataset("productEngineMarketActiveNewsGate", NEWS_GATES.MARKET);
    setDataset("productEngineMarketSourceFibonacciGate", FIBONACCI.PROJECT_REGISTRY);
    setDataset("productEngineMarketFutureFibonacciGate", FIBONACCI.DOWNSTREAM_RELEASE);

    setDataset("productEngineMarketF144ActivationStatus", state.f144ActivationStatus);
    setDataset("productEngineMarketF144ActivationReason", state.f144ActivationReason);
    setDataset("productEngineMarketF144ReleasePacketReady", state.f144ReleasePacketReady);

    setDataset("productEngineMarketFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("productEngineMarketRecommendedNextFile", state.recommendedNextFile);
    setDataset("productEngineMarketRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);

    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function publishGlobals() {
    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.HEARTH = root.HEARTH || {};

    root.LAB_PRODUCT_ENGINE_MARKET = api;
    root.LAB_PRODUCT_ENGINE_MARKET_F144 = api;
    root.PRODUCT_ENGINE_MARKET = api;
    root.MARKET_F144_READINESS_CONDUCTOR = api;

    root.DEXTER_LAB.productEngineMarket = api;
    root.DEXTER_LAB.productEngineMarketF144 = api;
    root.DEXTER_LAB.marketF144ReadinessConductor = api;

    root.HEARTH.productEngineMarket = api;
    root.HEARTH.productEngineMarketF144 = api;
    root.HEARTH.marketF144ReadinessConductor = api;

    const light = getReceiptLight();

    root.LAB_PRODUCT_ENGINE_MARKET_RECEIPT = light;
    root.LAB_PRODUCT_ENGINE_MARKET_F144_RECEIPT = light;
    root.PRODUCT_ENGINE_MARKET_RECEIPT = light;
    root.MARKET_F144_READINESS_CONDUCTOR_RECEIPT = light;

    root.DEXTER_LAB.productEngineMarketReceipt = light;
    root.HEARTH.productEngineMarketReceipt = light;

    root.__LAB_PRODUCT_ENGINE_MARKET_LOADED__ = true;
    root.__LAB_PRODUCT_ENGINE_MARKET_CONTRACT__ = CONTRACT;
    root.__LAB_PRODUCT_ENGINE_MARKET_RECEIPT__ = RECEIPT;
    root.__LAB_PRODUCT_ENGINE_MARKET_F144_ONLY__ = true;
    root.__LAB_PRODUCT_ENGINE_MARKET_PUBLIC_SUPERIORITY_CLAIM__ = false;
    root.__LAB_PRODUCT_ENGINE_MARKET_WEBGL__ = false;
    root.__LAB_PRODUCT_ENGINE_MARKET_VISUAL_PASS_CLAIMED__ = false;

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
    MARKET_ITEM_TYPES,
    STATUS,
    READINESS_BUCKETS,
    INTERNAL_BENCHMARK_TARGETS,

    readRegistryAuthority,
    readRegistryReceipt,
    validateF89Release,
    acceptF89Release,

    normalizeMarketItem,
    evaluateMarketItem,
    registerMarketItem,
    seedMarketMapFromRegistry,
    rebuildMarketIndexes,
    evaluateAllMarketItems,
    buildMarketMap,

    computeMarketReadinessScores,
    computeFibonacciSynchronizationMetric,
    evaluateNewsAlignment,
    getInternalBenchmarkProfile,
    composeMarketReadinessSummary,
    composeF144ReleasePacket,
    submitF144ReceiptToNorth,

    getMarketItem,
    listMarketItems,

    getReceiptLight,
    getReceipt,
    getReceiptText,
    publishGlobals,
    updateDataset,

    f144MarketConductorActive: true,
    f144Only: true,
    f89RegistryRequired: true,
    internalBenchmarkTargetActive: true,
    internalBenchmarkTargetName: "SURPASS_MARKET_ENGINE_INTERNAL_TARGET_ONLY",
    publicSuperiorityClaim: false,
    publicComparisonClaimAllowed: false,

    ownsF144MarketReadinessConductorship: true,
    ownsMarketMap: true,
    ownsOfferReadinessScoring: true,
    ownsDemoReadinessScoring: true,
    ownsDocumentationReadinessScoring: true,
    ownsLicensingReadinessScoring: true,
    ownsEvidenceReadinessScoring: true,
    ownsRiskBoundaryReadinessScoring: true,
    ownsDistributionReadinessScoring: true,
    ownsImplementationReadinessScoring: true,
    ownsInternalBenchmarkTargetScoring: true,
    ownsF233DownstreamHandoffPacket: true,
    ownsNewsFibonacciSynchronizationMetric: true,

    ownsNorthF21Latch: false,
    ownsProductEngineF34Authority: false,
    ownsUE5ExpressionF55Authority: false,
    ownsProjectRegistryF89Authority: false,
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
    const registryReceipt = readRegistryReceipt();
    acceptF89Release(registryReceipt);
  } catch (error) {
    recordError("INITIAL_PROJECT_REGISTRY_F89_READ_FAILED", error);
    computeFibonacciSynchronizationMetric();
  }

  recordLocal("MARKET_F144_READINESS_CONDUCTOR_LOADED", {
    file: FILE,
    contract: CONTRACT,
    registryFile: REGISTRY_FILE,
    northFile: NORTH_FILE,
    f144Only: true,
    internalBenchmarkTargetActive: true,
    publicSuperiorityClaim: false
  });

  publishGlobals();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

// /assets/lab/product-engine.market.js
// LAB_PRODUCT_ENGINE_MARKET_F144_ENGINE_MECHANICS_READINESS_CONDUCTOR_TNT_v2
// Full-file replacement.
// Product Engine Market F144 / readiness conductor / Market Clerk.
// Purpose:
// - Consume F89 Project Registry release packet from /assets/lab/product-engine.registry.js.
// - Build deterministic market-readiness records from registry records, market inputs, file, route, contract, receipt, risk, demo, documentation, licensing, distribution, and implementation evidence.
// - Bind directly to runtime-table v4 mechanics: RT3D-X10_Y19_Z144.
// - Prepare F233 downstream return packet for /assets/lab/runtime-table.js.
// - Preserve F34 -> F55 -> F89 -> F144 -> F233 sequence.
// - Treat market/surpass language as internal target language only.
// - Avoid rendering, generated image claims, WebGL claims, GraphicBox claims, public superiority claims, and final visual pass claims.
// Does not own:
// - F34 Product Engine authority
// - F55 Expression authority
// - F89 Registry authority
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

  const CONTRACT = "LAB_PRODUCT_ENGINE_MARKET_F144_ENGINE_MECHANICS_READINESS_CONDUCTOR_TNT_v2";
  const RECEIPT = "LAB_PRODUCT_ENGINE_MARKET_F144_ENGINE_MECHANICS_READINESS_CONDUCTOR_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "LAB_PRODUCT_ENGINE_MARKET_F144_READINESS_CONDUCTOR_TNT_v1";
  const BASELINE_CONTRACT = "LAB_PRODUCT_ENGINE_MARKET_BASELINE_v1";
  const VERSION = "2026-06-08.lab-product-engine-market-f144-engine-mechanics-readiness-conductor-v2";

  const FILE = "/assets/lab/product-engine.market.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const F34_PRODUCT_ENGINE_FILE = "/assets/lab/product-engine.js";
  const F55_EXPRESSION_FILE = "/assets/lab/product-engine.ue5-expression.js";
  const F89_REGISTRY_FILE = "/assets/lab/product-engine.registry.js";
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

  const READINESS_BUCKETS = Object.freeze({
    DEMO: "demo-readiness",
    DOCUMENTATION: "documentation-readiness",
    LICENSE: "license-readiness",
    DISTRIBUTION: "distribution-readiness",
    IMPLEMENTATION: "implementation-readiness",
    RISK: "risk-boundary-readiness",
    SUPPORT: "support-readiness",
    MARKET_PACKAGE: "market-package-readiness"
  });

  const MECHANICAL_COORDINATE = Object.freeze({
    coordinateId: "RT3D-X10_Y19_Z144",
    enginePart: "GEARBOX",
    enginePartIndex: 10,
    systemCategory: "NINETEEN_PART_SYSTEM",
    systemCategoryIndex: 19,
    fibonacciStage: FIBONACCI.MARKET_READINESS,
    fibonacciRank: 144,
    fibonacciStation: "MARKET_CLERK",
    mechanicalRole: "MARKET_READINESS_OUTPUT_MANIFOLD",
    clerkRole: "MARKET_CLERK",
    chessRole: "KNIGHT",
    mayJudge: false,
    mayLatch: false,
    mayRender: false,
    mayClaimPublicSuperiority: false
  });

  const DOWNSTREAM_COORDINATE = Object.freeze({
    coordinateId: "RT3D-X14_Y19_Z233",
    enginePart: "MANIFOLD",
    enginePartIndex: 14,
    systemCategory: "NINETEEN_PART_SYSTEM",
    systemCategoryIndex: 19,
    fibonacciStage: FIBONACCI.DOWNSTREAM_RETURN,
    fibonacciRank: 233,
    fibonacciStation: "DOWNSTREAM_RETURN",
    mechanicalRole: "F233_DOWNSTREAM_RETURN_PACKET",
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

    marketEngineF144Active: true,
    marketEngineF144Only: true,
    marketClerkActive: true,
    marketReadinessConductorActive: true,

    engineMechanicsPrimary: true,
    mathPrimary: true,
    architectureLabelsSecondary: true,
    mechanicalCoordinate: MECHANICAL_COORDINATE,
    downstreamCoordinate: DOWNSTREAM_COORDINATE,

    f89RegistryObserved: false,
    f89RegistryReleaseAccepted: false,
    f89RegistryReleasePacket: null,
    f89Contract: "",
    f89Receipt: "",

    registryGraphObserved: false,
    registryGraphStatus: STATUS.HELD,
    registryRecordCount: 0,
    marketInputRecordCount: 0,
    registryQualityScore: 0,
    marketInputReadinessScore: 0,

    marketReadinessBuilt: false,
    marketReadinessReady: false,
    marketReadinessStatus: STATUS.HELD,
    marketReadinessRecordCount: 0,
    marketReadyRecordCount: 0,
    marketDegradedRecordCount: 0,
    marketBlockedRecordCount: 0,

    demoReadinessScore: 0,
    documentationReadinessScore: 0,
    licenseReadinessScore: 0,
    distributionReadinessScore: 0,
    implementationReadinessScore: 0,
    riskBoundaryScore: 0,
    supportReadinessScore: 0,
    marketPackageScore: 0,
    marketReadinessScore: 0,
    marketTraceScore: 0,
    marketCoverageScore: 0,
    marketCoherenceScore: 0,

    internalMarketSurpassTargetScore: 0,
    publicSuperiorityClaim: false,
    publicComparisonClaimAllowed: false,
    benchmarkRequiredBeforePublicClaim: true,

    marketReadiness: {
      records: [],
      recordsById: {},
      buckets: {},
      package: {},
      riskBoundaries: [],
      demoPlan: {},
      licensePlan: {},
      documentationPlan: {},
      distributionPlan: {},
      implementationPlan: {},
      downstreamReturn: {},
      buildId: "",
      builtAt: ""
    },

    f233ReturnAuthorized: false,
    f144ReleasePacketReady: false,
    f233ReturnPacketReady: false,
    f144ActivationStatus: STATUS.ACTIVE,
    f144ActivationReason: "MARKET_F144_ACTIVE_WAITING_F89_REGISTRY_RELEASE",

    northRuntimeReceiptAccepted: false,
    northRuntimeReceiptPacket: null,
    northRuntimeContract: "",
    northRuntimeReceipt: "",

    activeFibonacci: FIBONACCI.MARKET_READINESS,
    activeFibonacciRank: 144,
    activeNewsGate: NEWS_GATES.MARKET,
    sourceFibonacciGate: FIBONACCI.PROJECT_REGISTRY,
    futureFibonacciGate: FIBONACCI.DOWNSTREAM_RETURN,
    newsProtocolAligned: true,
    fibonacciSynchronizationMetricActive: true,
    fibonacciSynchronizationScore: 0,
    oneActiveGearAtATime: true,

    firstFailedCoordinate: "WAITING_F89_REGISTRY_RELEASE",
    recommendedNextFile: F89_REGISTRY_FILE,
    recommendedNextRenewalTarget: F89_REGISTRY_FILE,

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

  function makeId(value, fallback = "market-record") {
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

  function hasMeaningfulF89Release(packet = {}) {
    if (!isObject(packet)) return false;

    return Boolean(
      packet.contract ||
      packet.receipt ||
      packet.packetType === "PROJECT_REGISTRY_F89_RELEASE_PACKET" ||
      safeBool(packet.registryEngineF89Active, false) ||
      safeBool(packet.f89ReleasePacketReady, false) ||
      safeBool(packet.registryGraphBuilt, false) ||
      Array.isArray(packet.marketInputs) ||
      Array.isArray(packet.registryRecords)
    );
  }

  function readF89RegistryAuthority() {
    return firstGlobal([
      "LAB_PRODUCT_ENGINE_REGISTRY",
      "LAB_PRODUCT_ENGINE_REGISTRY_F89",
      "PRODUCT_ENGINE_REGISTRY",
      "PROJECT_REGISTRY_CONDUCTOR",
      "PROJECT_REGISTRY_F89_CONDUCTOR",
      "REGISTRY_CLERK",
      "DEXTER_LAB.productEngineRegistry",
      "DEXTER_LAB.productEngineRegistryF89",
      "DEXTER_LAB.projectRegistryConductor",
      "DEXTER_LAB.registryClerk",
      "HEARTH.productEngineRegistry",
      "HEARTH.productEngineRegistryF89",
      "HEARTH.projectRegistryConductor",
      "HEARTH.registryClerk"
    ]);
  }

  function readF89RegistryRelease() {
    const authority = readF89RegistryAuthority();
    if (!authority) return {};

    try {
      if (isFunction(authority.composeF89ReleasePacket)) {
        const packet = authority.composeF89ReleasePacket();
        if (isObject(packet)) return packet;
      }

      if (isFunction(authority.getReceipt)) {
        const receipt = authority.getReceipt();
        if (isObject(receipt) && isObject(receipt.f89ReleasePacket)) return receipt.f89ReleasePacket;
      }

      return readReceipt(authority);
    } catch (error) {
      recordError("F89_REGISTRY_RELEASE_READ_FAILED", error);
      return {};
    }
  }

  function validateF89RegistryRelease(packet = {}) {
    const input = isObject(packet) ? packet : {};
    const noForbiddenClaim = !detectForbiddenClaim(input);
    const meaningful = hasMeaningfulF89Release(input);

    const activeFibonacci = safeString(input.activeFibonacci || input.fibonacciStage || "");
    const futureFibonacciGate = safeString(input.futureFibonacciGate || "");

    const correctStage = Boolean(
      !activeFibonacci ||
      activeFibonacci === FIBONACCI.PROJECT_REGISTRY ||
      activeFibonacci === "F89"
    );

    const correctFuture = Boolean(
      !futureFibonacciGate ||
      futureFibonacciGate === FIBONACCI.MARKET_READINESS ||
      futureFibonacciGate === "F144"
    );

    const marketInputsAcceptable = Boolean(
      Array.isArray(input.marketInputs) ||
      Array.isArray(input.registryRecords) ||
      isObject(input.registryGraph)
    );

    const accepted = Boolean(
      noForbiddenClaim &&
      meaningful &&
      correctStage &&
      correctFuture &&
      marketInputsAcceptable
    );

    let reason = "F89_REGISTRY_RELEASE_ACCEPTED";
    if (!noForbiddenClaim) reason = "FORBIDDEN_CLAIM_DETECTED_IN_F89_RELEASE";
    else if (!meaningful) reason = "F89_RELEASE_NOT_MEANINGFUL";
    else if (!correctStage) reason = "F89_RELEASE_WRONG_ACTIVE_FIBONACCI";
    else if (!correctFuture) reason = "F89_RELEASE_WRONG_FUTURE_GATE";
    else if (!marketInputsAcceptable) reason = "F89_RELEASE_MISSING_MARKET_INPUT_SOURCE";

    return {
      accepted,
      reason,
      noForbiddenClaim,
      meaningful,
      correctStage,
      correctFuture,
      marketInputsAcceptable,
      input: clonePlain(input)
    };
  }

  function acceptF89RegistryRelease(packet = {}) {
    const validation = validateF89RegistryRelease(packet);

    if (validation.accepted) {
      state.f89RegistryObserved = true;
      state.f89RegistryReleaseAccepted = true;
      state.f89RegistryReleasePacket = clonePlain(packet);
      state.f89Contract = safeString(packet.contract, "");
      state.f89Receipt = safeString(packet.receipt, "");

      state.registryGraphObserved = true;
      state.registryGraphStatus = safeString(packet.registryGraphStatus || STATUS.READY, STATUS.READY);
      state.registryRecordCount = safeNumber(packet.registryRecordCount, 0);
      state.marketInputRecordCount = safeNumber(packet.marketInputRecordCount || (Array.isArray(packet.marketInputs) ? packet.marketInputs.length : 0), 0);
      state.registryQualityScore = clamp(packet.registryQualityScore, 0, 100);
      state.marketInputReadinessScore = clamp(packet.marketInputReadinessScore, 0, 100);

      buildMarketReadiness(packet);
    }

    recordLocal("F89_REGISTRY_RELEASE_EVALUATED_BY_MARKET_F144", {
      accepted: validation.accepted,
      reason: validation.reason,
      marketInputSourcePresent: validation.marketInputsAcceptable
    });

    computeFibonacciSynchronizationMetric();
    publishGlobals();

    return {
      accepted: validation.accepted,
      marketEngineF144ReceivedF89: true,
      reason: validation.reason,
      marketReadinessBuilt: state.marketReadinessBuilt,
      marketReadinessReady: state.marketReadinessReady,
      f233ReturnAuthorized: state.f233ReturnAuthorized,
      recommendedNextFile: validation.accepted ? NORTH_FILE : F89_REGISTRY_FILE,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function receiveF89RegistryRelease(packet = {}) {
    return acceptF89RegistryRelease(packet);
  }

  function submitF89RegistryRelease(packet = {}) {
    return acceptF89RegistryRelease(packet);
  }

  function getF89MarketInputs(packet = state.f89RegistryReleasePacket || {}) {
    if (Array.isArray(packet.marketInputs)) return packet.marketInputs;

    if (isObject(packet.registryGraph) && Array.isArray(packet.registryGraph.marketInputs)) {
      return packet.registryGraph.marketInputs;
    }

    if (Array.isArray(packet.registryRecords)) return packet.registryRecords;

    if (isObject(packet.registryGraph) && Array.isArray(packet.registryGraph.records)) {
      return packet.registryGraph.records;
    }

    return [];
  }

  function getF89RegistryRecords(packet = state.f89RegistryReleasePacket || {}) {
    if (Array.isArray(packet.registryRecords)) return packet.registryRecords;

    if (isObject(packet.registryGraph) && Array.isArray(packet.registryGraph.records)) {
      return packet.registryGraph.records;
    }

    return [];
  }

  function scorePresence(value, weight) {
    return value ? weight : 0;
  }

  function normalizeMarketInput(source = {}, index = 0) {
    const id = makeId(source.id || source.recordId || source.registryRecordId || `market-input-${index + 1}`, `market-input-${index + 1}`);
    const recordType = safeString(source.recordType || source.type || "market-input-record");

    const file = safeString(source.file || source.sourceFile || "");
    const route = safeString(source.route || "");
    const contract = safeString(source.contract || source.sourceContract || "");
    const receipt = safeString(source.receipt || source.sourceReceipt || "");
    const sourceProductId = safeString(source.sourceProductId || source.productId || id);

    const traceReady = safeBool(source.traceReady, Boolean(file || route || contract || receipt));
    const registryReady = safeBool(source.registryReady, traceReady);
    const baseScore = clamp(source.readinessScore ?? source.registryReadinessScore ?? source.marketInputReadinessScore ?? 0, 0, 100);

    const demoReadiness = clamp(
      Math.round(
        baseScore * 0.34 +
        scorePresence(file || route, 18) +
        scorePresence(contract || receipt, 16) +
        scorePresence(registryReady, 18) +
        scorePresence(traceReady, 14)
      ),
      0,
      100
    );

    const documentationReadiness = clamp(
      Math.round(
        scorePresence(contract, 24) +
        scorePresence(receipt, 24) +
        scorePresence(file || route, 18) +
        baseScore * 0.24 +
        scorePresence(traceReady, 10)
      ),
      0,
      100
    );

    const licenseReadiness = clamp(
      Math.round(
        scorePresence(contract, 34) +
        scorePresence(receipt, 20) +
        scorePresence(registryReady, 18) +
        baseScore * 0.20 +
        scorePresence(traceReady, 8)
      ),
      0,
      100
    );

    const distributionReadiness = clamp(
      Math.round(
        scorePresence(file || route, 26) +
        scorePresence(registryReady, 22) +
        scorePresence(receipt, 16) +
        baseScore * 0.24 +
        scorePresence(traceReady, 12)
      ),
      0,
      100
    );

    const implementationReadiness = clamp(
      Math.round(
        scorePresence(file, 22) +
        scorePresence(route, 16) +
        scorePresence(contract, 14) +
        scorePresence(receipt, 14) +
        baseScore * 0.26 +
        scorePresence(registryReady, 8)
      ),
      0,
      100
    );

    const riskBoundaryReadiness = clamp(
      Math.round(
        scorePresence(!source.publicSuperiorityClaim, 18) +
        scorePresence(!source.publicComparisonClaimAllowed, 18) +
        scorePresence(!source.generatedImage, 12) +
        scorePresence(!source.graphicBox, 12) +
        scorePresence(!source.webGL, 12) +
        scorePresence(!source.visualPassClaimed, 12) +
        scorePresence(traceReady, 8) +
        scorePresence(registryReady, 8)
      ),
      0,
      100
    );

    const supportReadiness = clamp(
      Math.round(
        scorePresence(traceReady, 18) +
        scorePresence(registryReady, 18) +
        scorePresence(contract, 16) +
        scorePresence(receipt, 16) +
        baseScore * 0.22 +
        scorePresence(file || route, 10)
      ),
      0,
      100
    );

    const marketPackageReadiness = clamp(
      Math.round(
        demoReadiness * 0.16 +
        documentationReadiness * 0.16 +
        licenseReadiness * 0.14 +
        distributionReadiness * 0.14 +
        implementationReadiness * 0.14 +
        riskBoundaryReadiness * 0.14 +
        supportReadiness * 0.12
      ),
      0,
      100
    );

    const status =
      marketPackageReadiness >= 84 && riskBoundaryReadiness >= 80
        ? STATUS.READY
        : marketPackageReadiness >= 62 && riskBoundaryReadiness >= 70
          ? STATUS.DEGRADED
          : STATUS.HELD;

    return {
      id,
      marketInputId: id,
      sourceRecordType: recordType,
      sourceProductId,
      file,
      route,
      contract,
      receipt,
      traceReady,
      registryReady,

      demoReadiness,
      documentationReadiness,
      licenseReadiness,
      distributionReadiness,
      implementationReadiness,
      riskBoundaryReadiness,
      supportReadiness,
      marketPackageReadiness,

      readinessScore: marketPackageReadiness,
      status,
      bucket: status === STATUS.READY ? "READY_FOR_MARKET_PACKAGE" : status === STATUS.DEGRADED ? "DEGRADED_MARKET_PACKAGE" : "HELD_MARKET_PACKAGE",

      tags: Array.isArray(source.tags) ? source.tags.slice() : [],
      deterministic: true,
      internalOnly: true,

      publicSuperiorityClaim: false,
      publicComparisonClaimAllowed: false,
      benchmarkRequiredBeforePublicClaim: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      createdAt: safeString(source.createdAt || nowIso()),
      updatedAt: nowIso()
    };
  }

  function groupByBucket(records) {
    const buckets = {
      [READINESS_BUCKETS.DEMO]: [],
      [READINESS_BUCKETS.DOCUMENTATION]: [],
      [READINESS_BUCKETS.LICENSE]: [],
      [READINESS_BUCKETS.DISTRIBUTION]: [],
      [READINESS_BUCKETS.IMPLEMENTATION]: [],
      [READINESS_BUCKETS.RISK]: [],
      [READINESS_BUCKETS.SUPPORT]: [],
      [READINESS_BUCKETS.MARKET_PACKAGE]: []
    };

    records.forEach((record) => {
      buckets[READINESS_BUCKETS.DEMO].push({
        id: record.id,
        score: record.demoReadiness,
        status: record.demoReadiness >= 80 ? STATUS.READY : record.demoReadiness >= 62 ? STATUS.DEGRADED : STATUS.HELD
      });

      buckets[READINESS_BUCKETS.DOCUMENTATION].push({
        id: record.id,
        score: record.documentationReadiness,
        status: record.documentationReadiness >= 80 ? STATUS.READY : record.documentationReadiness >= 62 ? STATUS.DEGRADED : STATUS.HELD
      });

      buckets[READINESS_BUCKETS.LICENSE].push({
        id: record.id,
        score: record.licenseReadiness,
        status: record.licenseReadiness >= 80 ? STATUS.READY : record.licenseReadiness >= 62 ? STATUS.DEGRADED : STATUS.HELD
      });

      buckets[READINESS_BUCKETS.DISTRIBUTION].push({
        id: record.id,
        score: record.distributionReadiness,
        status: record.distributionReadiness >= 80 ? STATUS.READY : record.distributionReadiness >= 62 ? STATUS.DEGRADED : STATUS.HELD
      });

      buckets[READINESS_BUCKETS.IMPLEMENTATION].push({
        id: record.id,
        score: record.implementationReadiness,
        status: record.implementationReadiness >= 80 ? STATUS.READY : record.implementationReadiness >= 62 ? STATUS.DEGRADED : STATUS.HELD
      });

      buckets[READINESS_BUCKETS.RISK].push({
        id: record.id,
        score: record.riskBoundaryReadiness,
        status: record.riskBoundaryReadiness >= 80 ? STATUS.READY : record.riskBoundaryReadiness >= 70 ? STATUS.DEGRADED : STATUS.HELD
      });

      buckets[READINESS_BUCKETS.SUPPORT].push({
        id: record.id,
        score: record.supportReadiness,
        status: record.supportReadiness >= 80 ? STATUS.READY : record.supportReadiness >= 62 ? STATUS.DEGRADED : STATUS.HELD
      });

      buckets[READINESS_BUCKETS.MARKET_PACKAGE].push({
        id: record.id,
        score: record.marketPackageReadiness,
        status: record.status
      });
    });

    return buckets;
  }

  function average(records, field) {
    if (!records.length) return 0;
    return clamp(
      Math.round(records.reduce((sum, record) => sum + safeNumber(record[field], 0), 0) / records.length),
      0,
      100
    );
  }

  function createDemoPlan(records) {
    return {
      planType: "DEMO_PLAN",
      recordCount: records.length,
      demoReadyCount: records.filter((record) => record.demoReadiness >= 80).length,
      demoReadinessScore: average(records, "demoReadiness"),
      demoMode: "internal deterministic walkthrough",
      requiresRendering: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function createDocumentationPlan(records) {
    return {
      planType: "DOCUMENTATION_PLAN",
      recordCount: records.length,
      documentationReadyCount: records.filter((record) => record.documentationReadiness >= 80).length,
      documentationReadinessScore: average(records, "documentationReadiness"),
      requiredMaterials: ["contracts", "receipts", "file index", "route index", "risk boundary notes"],
      publicComparisonClaimAllowed: false
    };
  }

  function createLicensePlan(records) {
    return {
      planType: "LICENSE_PLAN",
      recordCount: records.length,
      licenseReadyCount: records.filter((record) => record.licenseReadiness >= 80).length,
      licenseReadinessScore: average(records, "licenseReadiness"),
      licenseMode: "internal license-preparation profile",
      publicSuperiorityClaim: false,
      benchmarkRequiredBeforePublicClaim: true
    };
  }

  function createDistributionPlan(records) {
    return {
      planType: "DISTRIBUTION_PLAN",
      recordCount: records.length,
      distributionReadyCount: records.filter((record) => record.distributionReadiness >= 80).length,
      distributionReadinessScore: average(records, "distributionReadiness"),
      channelMode: "private package and route handoff",
      publicLaunchClaim: false
    };
  }

  function createImplementationPlan(records) {
    return {
      planType: "IMPLEMENTATION_PLAN",
      recordCount: records.length,
      implementationReadyCount: records.filter((record) => record.implementationReadiness >= 80).length,
      implementationReadinessScore: average(records, "implementationReadiness"),
      implementationMode: "engineering integration sequence",
      downstreamTarget: NORTH_FILE
    };
  }

  function createRiskBoundaries(records) {
    return [
      {
        boundary: "NO_PUBLIC_SUPERIORITY_CLAIM",
        pass: true,
        score: 100
      },
      {
        boundary: "NO_PUBLIC_COMPARISON_WITHOUT_BENCHMARK",
        pass: true,
        score: 100
      },
      {
        boundary: "NO_GENERATED_IMAGE_CLAIM",
        pass: records.every((record) => !record.generatedImage),
        score: records.every((record) => !record.generatedImage) ? 100 : 0
      },
      {
        boundary: "NO_GRAPHICBOX_CLAIM",
        pass: records.every((record) => !record.graphicBox),
        score: records.every((record) => !record.graphicBox) ? 100 : 0
      },
      {
        boundary: "NO_WEBGL_CLAIM",
        pass: records.every((record) => !record.webGL),
        score: records.every((record) => !record.webGL) ? 100 : 0
      },
      {
        boundary: "NO_VISUAL_PASS_CLAIM",
        pass: records.every((record) => !record.visualPassClaimed),
        score: records.every((record) => !record.visualPassClaimed) ? 100 : 0
      },
      {
        boundary: "TRACEABILITY_REQUIRED",
        pass: records.some((record) => record.traceReady),
        score: records.some((record) => record.traceReady) ? 100 : 0
      }
    ];
  }

  function buildMarketPackage(records) {
    return {
      packageType: "F144_MARKET_READINESS_PACKAGE",
      internalOnly: true,
      recordCount: records.length,
      readyRecordCount: records.filter((record) => record.status === STATUS.READY).length,
      degradedRecordCount: records.filter((record) => record.status === STATUS.DEGRADED).length,
      heldRecordCount: records.filter((record) => record.status === STATUS.HELD).length,
      demoReadinessScore: average(records, "demoReadiness"),
      documentationReadinessScore: average(records, "documentationReadiness"),
      licenseReadinessScore: average(records, "licenseReadiness"),
      distributionReadinessScore: average(records, "distributionReadiness"),
      implementationReadinessScore: average(records, "implementationReadiness"),
      riskBoundaryScore: average(records, "riskBoundaryReadiness"),
      supportReadinessScore: average(records, "supportReadiness"),
      marketPackageScore: average(records, "marketPackageReadiness"),
      publicSuperiorityClaim: false,
      publicComparisonClaimAllowed: false,
      benchmarkRequiredBeforePublicClaim: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function buildMarketReadiness(packet = state.f89RegistryReleasePacket || {}, options = {}) {
    const marketInputs = getF89MarketInputs(packet).map(normalizeMarketInput);
    const registryRecords = getF89RegistryRecords(packet);

    const recordsById = {};
    marketInputs.forEach((record) => {
      recordsById[record.id] = record;
    });

    const records = Object.values(recordsById).sort((a, b) => {
      if (b.marketPackageReadiness !== a.marketPackageReadiness) return b.marketPackageReadiness - a.marketPackageReadiness;
      return a.id.localeCompare(b.id);
    });

    const buckets = groupByBucket(records);
    const riskBoundaries = createRiskBoundaries(records);
    const packageProfile = buildMarketPackage(records);

    state.marketReadiness = {
      records,
      recordsById,
      buckets,
      package: packageProfile,
      riskBoundaries,
      demoPlan: createDemoPlan(records),
      licensePlan: createLicensePlan(records),
      documentationPlan: createDocumentationPlan(records),
      distributionPlan: createDistributionPlan(records),
      implementationPlan: createImplementationPlan(records),
      downstreamReturn: {},
      registryRecords: clonePlain(registryRecords),
      buildId: `f144-market-readiness-${records.length}-${registryRecords.length}`,
      builtAt: nowIso()
    };

    state.marketReadinessBuilt = true;
    state.marketReadinessRecordCount = records.length;
    state.marketReadyRecordCount = records.filter((record) => record.status === STATUS.READY).length;
    state.marketDegradedRecordCount = records.filter((record) => record.status === STATUS.DEGRADED).length;
    state.marketBlockedRecordCount = records.filter((record) => record.status === STATUS.HELD || record.status === STATUS.BLOCKED).length;

    computeMarketReadinessMetrics();

    const allRiskPass = riskBoundaries.every((boundary) => boundary.pass);
    state.marketReadinessReady = Boolean(
      records.length > 0 &&
      state.marketReadinessScore >= 80 &&
      state.riskBoundaryScore >= 80 &&
      allRiskPass
    );

    if (state.marketReadinessReady) {
      state.marketReadinessStatus = STATUS.READY;
      state.f233ReturnAuthorized = true;
      state.f144ReleasePacketReady = true;
      state.f233ReturnPacketReady = true;
      state.f144ActivationStatus = STATUS.READY;
      state.f144ActivationReason = "MARKET_F144_READY_FOR_F233_DOWNSTREAM_RETURN";
      state.firstFailedCoordinate = "NONE_MARKET_F144_READY_F233_RETURN_AUTHORIZED";
      state.recommendedNextFile = NORTH_FILE;
      state.recommendedNextRenewalTarget = NORTH_FILE;
    } else if (records.length > 0 && state.marketReadinessScore >= 62 && state.riskBoundaryScore >= 70) {
      state.marketReadinessStatus = STATUS.DEGRADED;
      state.f233ReturnAuthorized = true;
      state.f144ReleasePacketReady = true;
      state.f233ReturnPacketReady = true;
      state.f144ActivationStatus = STATUS.DEGRADED;
      state.f144ActivationReason = "MARKET_F144_DEGRADED_F233_RETURN_AVAILABLE_WITH_BOUNDARIES";
      state.firstFailedCoordinate = "NONE_MARKET_F144_DEGRADED_F233_RETURN_AVAILABLE";
      state.recommendedNextFile = NORTH_FILE;
      state.recommendedNextRenewalTarget = NORTH_FILE;
    } else {
      state.marketReadinessStatus = STATUS.HELD;
      state.f233ReturnAuthorized = false;
      state.f144ReleasePacketReady = false;
      state.f233ReturnPacketReady = false;
      state.f144ActivationStatus = STATUS.HELD;
      state.f144ActivationReason = "WAITING_F89_REGISTRY_RELEASE_OR_MARKET_READINESS";
      state.firstFailedCoordinate = "WAITING_F89_REGISTRY_RELEASE_OR_MARKET_READINESS";
      state.recommendedNextFile = F89_REGISTRY_FILE;
      state.recommendedNextRenewalTarget = F89_REGISTRY_FILE;
    }

    state.marketReadiness.downstreamReturn = composeF233DownstreamReturnPacket({ preview: true });
    computeFibonacciSynchronizationMetric();

    if (options.silent !== true) {
      recordLocal("MARKET_F144_READINESS_BUILT", {
        recordCount: state.marketReadinessRecordCount,
        marketReadinessStatus: state.marketReadinessStatus,
        marketReadinessScore: state.marketReadinessScore,
        riskBoundaryScore: state.riskBoundaryScore,
        f233ReturnAuthorized: state.f233ReturnAuthorized
      });
    }

    updateDataset();

    return clonePlain(state.marketReadiness);
  }

  function computeMarketReadinessMetrics() {
    const records = state.marketReadiness.records || [];
    const count = Math.max(1, records.length);

    state.demoReadinessScore = average(records, "demoReadiness");
    state.documentationReadinessScore = average(records, "documentationReadiness");
    state.licenseReadinessScore = average(records, "licenseReadiness");
    state.distributionReadinessScore = average(records, "distributionReadiness");
    state.implementationReadinessScore = average(records, "implementationReadiness");
    state.riskBoundaryScore = average(records, "riskBoundaryReadiness");
    state.supportReadinessScore = average(records, "supportReadiness");
    state.marketPackageScore = average(records, "marketPackageReadiness");

    const readyRatio = records.filter((record) => record.status === STATUS.READY).length / count;
    const degradedRatio = records.filter((record) => record.status === STATUS.DEGRADED).length / count;
    const blockedRatio = records.filter((record) => record.status === STATUS.HELD || record.status === STATUS.BLOCKED).length / count;

    const bucketCoverage = [
      state.demoReadinessScore > 0,
      state.documentationReadinessScore > 0,
      state.licenseReadinessScore > 0,
      state.distributionReadinessScore > 0,
      state.implementationReadinessScore > 0,
      state.riskBoundaryScore > 0,
      state.supportReadinessScore > 0,
      state.marketPackageScore > 0
    ].filter(Boolean).length / 8;

    state.marketCoverageScore = clamp(Math.round(bucketCoverage * 100), 0, 100);

    state.marketTraceScore = clamp(
      Math.round((records.filter((record) => record.traceReady).length / count) * 100),
      0,
      100
    );

    state.marketCoherenceScore = clamp(
      Math.round(
        (readyRatio * 52) +
        (degradedRatio * 24) -
        (blockedRatio * 38) +
        (state.marketCoverageScore * 0.12) +
        (state.marketTraceScore * 0.12) +
        (state.riskBoundaryScore * 0.10)
      ),
      0,
      100
    );

    state.marketReadinessScore = clamp(
      Math.round(
        (state.marketPackageScore * 0.24) +
        (state.marketCoherenceScore * 0.20) +
        (state.riskBoundaryScore * 0.18) +
        (state.marketCoverageScore * 0.14) +
        (state.marketTraceScore * 0.12) +
        (state.supportReadinessScore * 0.12)
      ),
      0,
      100
    );

    state.internalMarketSurpassTargetScore = clamp(
      Math.round(
        (state.marketReadinessScore * 0.26) +
        (state.marketPackageScore * 0.18) +
        (state.registryQualityScore * 0.16) +
        (state.marketInputReadinessScore * 0.14) +
        (state.riskBoundaryScore * 0.14) +
        (state.fibonacciSynchronizationScore * 0.12)
      ),
      0,
      100
    );

    return {
      marketReadinessScore: state.marketReadinessScore,
      marketPackageScore: state.marketPackageScore,
      marketCoverageScore: state.marketCoverageScore,
      marketTraceScore: state.marketTraceScore,
      marketCoherenceScore: state.marketCoherenceScore,
      riskBoundaryScore: state.riskBoundaryScore,
      internalMarketSurpassTargetScore: state.internalMarketSurpassTargetScore,
      publicSuperiorityClaim: false,
      publicComparisonClaimAllowed: false
    };
  }

  function computeFibonacciSynchronizationMetric() {
    const checks = [
      state.newsProtocolAligned,
      state.oneActiveGearAtATime,
      state.activeFibonacci === FIBONACCI.MARKET_READINESS,
      state.activeFibonacciRank === 144,
      state.activeNewsGate === NEWS_GATES.MARKET,
      state.sourceFibonacciGate === FIBONACCI.PROJECT_REGISTRY,
      state.futureFibonacciGate === FIBONACCI.DOWNSTREAM_RETURN,
      state.marketEngineF144Active,
      state.marketClerkActive,
      state.marketReadinessConductorActive,
      state.engineMechanicsPrimary,
      state.mathPrimary,
      state.mechanicalCoordinate.coordinateId === "RT3D-X10_Y19_Z144",
      state.f89RegistryReleaseAccepted || state.f89RegistryObserved,
      state.marketReadinessBuilt,
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

    computeMarketReadinessMetrics();

    return {
      score: state.fibonacciSynchronizationScore,
      passed,
      total: checks.length,
      activeFibonacci: FIBONACCI.MARKET_READINESS,
      activeFibonacciRank: 144,
      activeNewsGate: NEWS_GATES.MARKET,
      sourceFibonacciGate: FIBONACCI.PROJECT_REGISTRY,
      futureFibonacciGate: FIBONACCI.DOWNSTREAM_RETURN,
      publicSuperiorityClaim: false
    };
  }

  function evaluateNewsAlignment() {
    const metric = computeFibonacciSynchronizationMetric();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      newsAlignmentContract: "LAB_PRODUCT_ENGINE_MARKET_F144_NEWS_ALIGNMENT_PROTOCOL_v2",
      newsAlignmentReceipt: "LAB_PRODUCT_ENGINE_MARKET_F144_NEWS_ALIGNMENT_PROTOCOL_RECEIPT_v2",
      sequence: [
        {
          gate: NEWS_GATES.REGISTRY,
          fibonacci: FIBONACCI.PROJECT_REGISTRY,
          file: F89_REGISTRY_FILE,
          ready: state.f89RegistryReleaseAccepted
        },
        {
          gate: NEWS_GATES.MARKET,
          fibonacci: FIBONACCI.MARKET_READINESS,
          file: FILE,
          ready: state.marketReadinessReady || state.marketReadinessStatus === STATUS.DEGRADED
        },
        {
          gate: NEWS_GATES.DOWNSTREAM,
          fibonacci: FIBONACCI.DOWNSTREAM_RETURN,
          file: NORTH_FILE,
          ready: state.f233ReturnAuthorized
        }
      ],
      fibonacciSynchronizationScore: metric.score,
      f144Status: state.f144ActivationStatus,
      marketReadinessStatus: state.marketReadinessStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
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

  function composeF144MarketReadinessPacket(extra = {}) {
    const metric = computeFibonacciSynchronizationMetric();
    const readyForF233 = Boolean(state.marketReadinessReady || state.marketReadinessStatus === STATUS.DEGRADED);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "MARKET_F144_READINESS_PACKET",
      sourceFile: FILE,
      targetFile: NORTH_FILE,
      destinationFile: NORTH_FILE,

      activeFibonacci: FIBONACCI.MARKET_READINESS,
      activeFibonacciRank: 144,
      activeNewsGate: NEWS_GATES.MARKET,
      sourceFibonacciGate: FIBONACCI.PROJECT_REGISTRY,
      futureFibonacciGate: FIBONACCI.DOWNSTREAM_RETURN,
      futureFibonacciRank: 233,

      mechanicalCoordinate: clonePlain(MECHANICAL_COORDINATE),
      downstreamCoordinate: clonePlain(DOWNSTREAM_COORDINATE),
      engineMechanicsPrimary: true,
      mathPrimary: true,
      architectureLabelsSecondary: true,

      marketEngineF144Active: true,
      marketEngineF144Only: true,
      marketClerkActive: true,
      marketReadinessConductorActive: true,

      f89RegistryReleaseAccepted: state.f89RegistryReleaseAccepted,
      f89Contract: state.f89Contract,
      f89Receipt: state.f89Receipt,

      registryGraphObserved: state.registryGraphObserved,
      registryGraphStatus: state.registryGraphStatus,
      registryRecordCount: state.registryRecordCount,
      marketInputRecordCount: state.marketInputRecordCount,
      registryQualityScore: state.registryQualityScore,
      marketInputReadinessScore: state.marketInputReadinessScore,

      marketReadinessBuilt: state.marketReadinessBuilt,
      marketReadinessReady: state.marketReadinessReady,
      marketReadinessStatus: state.marketReadinessStatus,
      marketReadinessRecordCount: state.marketReadinessRecordCount,
      marketReadyRecordCount: state.marketReadyRecordCount,
      marketDegradedRecordCount: state.marketDegradedRecordCount,
      marketBlockedRecordCount: state.marketBlockedRecordCount,

      demoReadinessScore: state.demoReadinessScore,
      documentationReadinessScore: state.documentationReadinessScore,
      licenseReadinessScore: state.licenseReadinessScore,
      distributionReadinessScore: state.distributionReadinessScore,
      implementationReadinessScore: state.implementationReadinessScore,
      riskBoundaryScore: state.riskBoundaryScore,
      supportReadinessScore: state.supportReadinessScore,
      marketPackageScore: state.marketPackageScore,
      marketReadinessScore: state.marketReadinessScore,
      marketTraceScore: state.marketTraceScore,
      marketCoverageScore: state.marketCoverageScore,
      marketCoherenceScore: state.marketCoherenceScore,
      internalMarketSurpassTargetScore: state.internalMarketSurpassTargetScore,

      marketReadiness: clonePlain(state.marketReadiness),
      marketRecords: clonePlain(state.marketReadiness.records),
      riskBoundaries: clonePlain(state.marketReadiness.riskBoundaries),
      demoPlan: clonePlain(state.marketReadiness.demoPlan),
      documentationPlan: clonePlain(state.marketReadiness.documentationPlan),
      licensePlan: clonePlain(state.marketReadiness.licensePlan),
      distributionPlan: clonePlain(state.marketReadiness.distributionPlan),
      implementationPlan: clonePlain(state.marketReadiness.implementationPlan),

      f233ReturnAuthorized: readyForF233,
      f144ReleasePacketReady: readyForF233,
      f233ReturnPacketReady: readyForF233,
      f144ActivationStatus: state.f144ActivationStatus,
      f144ActivationReason: state.f144ActivationReason,

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

  function composeF233DownstreamReturnPacket(extra = {}) {
    const readiness = composeF144MarketReadinessPacket(extra);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "F233_DOWNSTREAM_RETURN_PACKET",
      sourceFile: FILE,
      targetFile: NORTH_FILE,
      destinationFile: NORTH_FILE,

      activeFibonacci: FIBONACCI.DOWNSTREAM_RETURN,
      activeFibonacciRank: 233,
      activeNewsGate: NEWS_GATES.DOWNSTREAM,
      sourceFibonacciGate: FIBONACCI.MARKET_READINESS,
      futureFibonacciGate: FIBONACCI.NORTH_LATCH,

      mechanicalCoordinate: clonePlain(DOWNSTREAM_COORDINATE),
      sourceMechanicalCoordinate: clonePlain(MECHANICAL_COORDINATE),

      f144MarketReadinessPacket: readiness,
      f144MarketReady: state.marketReadinessReady,
      f144MarketDegradedReturnAvailable: state.marketReadinessStatus === STATUS.DEGRADED,
      f233ReturnAuthorized: state.f233ReturnAuthorized,
      f233ReturnPacketReady: state.f233ReturnPacketReady,

      northRuntimeShouldAccept: Boolean(state.f233ReturnAuthorized || state.f233ReturnPacketReady),
      recommendedNorthMethodOrder: [
        "receiveF233DownstreamReturnPacket",
        "acceptF144MarketReadinessPacket",
        "acceptSupportEnginePacket",
        "receiveSupportEnginePacket",
        "submitSupportEnginePacket"
      ],

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

  function composeF144Receipt() {
    return getReceipt();
  }

  function submitF144PacketToNorth(extra = {}) {
    const north = readNorthRuntimeAuthority();

    if (!north) {
      return {
        submitted: false,
        reason: "NORTH_RUNTIME_TABLE_UNAVAILABLE",
        recommendedNextFile: NORTH_FILE
      };
    }

    const packet = composeF144MarketReadinessPacket(extra);

    try {
      if (isFunction(north.acceptF144MarketReadinessPacket)) {
        return {
          submitted: true,
          method: "acceptF144MarketReadinessPacket",
          response: clonePlain(north.acceptF144MarketReadinessPacket(packet))
        };
      }

      if (isFunction(north.acceptSupportEnginePacket)) {
        return {
          submitted: true,
          method: "acceptSupportEnginePacket",
          response: clonePlain(north.acceptSupportEnginePacket(packet))
        };
      }

      if (isFunction(north.receiveSupportEnginePacket)) {
        return {
          submitted: true,
          method: "receiveSupportEnginePacket",
          response: clonePlain(north.receiveSupportEnginePacket(packet))
        };
      }
    } catch (error) {
      recordError("F144_PACKET_SUBMISSION_TO_NORTH_FAILED", error);
      return {
        submitted: false,
        reason: "F144_PACKET_SUBMISSION_TO_NORTH_FAILED"
      };
    }

    return {
      submitted: false,
      reason: "NORTH_RUNTIME_TABLE_F144_INTAKE_UNAVAILABLE"
    };
  }

  function submitF233ReturnToNorth(extra = {}) {
    const north = readNorthRuntimeAuthority();

    if (!north) {
      return {
        submitted: false,
        reason: "NORTH_RUNTIME_TABLE_UNAVAILABLE",
        recommendedNextFile: NORTH_FILE
      };
    }

    const packet = composeF233DownstreamReturnPacket(extra);

    try {
      if (isFunction(north.receiveF233DownstreamReturnPacket)) {
        return {
          submitted: true,
          method: "receiveF233DownstreamReturnPacket",
          response: clonePlain(north.receiveF233DownstreamReturnPacket(packet))
        };
      }

      if (isFunction(north.acceptF144MarketReadinessPacket)) {
        return {
          submitted: true,
          method: "acceptF144MarketReadinessPacket",
          response: clonePlain(north.acceptF144MarketReadinessPacket(packet))
        };
      }

      if (isFunction(north.acceptSupportEnginePacket)) {
        return {
          submitted: true,
          method: "acceptSupportEnginePacket",
          response: clonePlain(north.acceptSupportEnginePacket(packet))
        };
      }

      if (isFunction(north.receiveSupportEnginePacket)) {
        return {
          submitted: true,
          method: "receiveSupportEnginePacket",
          response: clonePlain(north.receiveSupportEnginePacket(packet))
        };
      }
    } catch (error) {
      recordError("F233_RETURN_SUBMISSION_TO_NORTH_FAILED", error);
      return {
        submitted: false,
        reason: "F233_RETURN_SUBMISSION_TO_NORTH_FAILED"
      };
    }

    return {
      submitted: false,
      reason: "NORTH_RUNTIME_TABLE_F233_INTAKE_UNAVAILABLE"
    };
  }

  function validateNorthRuntimeReceipt(packet = {}) {
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

    let reason = "NORTH_RUNTIME_RECEIPT_ACCEPTED";
    if (!noForbiddenClaim) reason = "FORBIDDEN_CLAIM_DETECTED_IN_NORTH_RECEIPT";
    else if (!northRecognized) reason = "UNRECOGNIZED_NORTH_RUNTIME_RECEIPT";

    return {
      ok,
      reason,
      noForbiddenClaim,
      northRecognized,
      input: clonePlain(input)
    };
  }

  function acceptNorthRuntimeReceipt(packet = {}) {
    const validation = validateNorthRuntimeReceipt(packet);

    state.northRuntimeReceiptAccepted = validation.ok;
    state.northRuntimeReceiptPacket = clonePlain(packet);

    if (validation.input.contract) state.northRuntimeContract = safeString(validation.input.contract);
    if (validation.input.receipt) state.northRuntimeReceipt = safeString(validation.input.receipt);

    recordLocal("NORTH_RUNTIME_RECEIPT_RECEIVED_BY_MARKET_F144", {
      accepted: validation.ok,
      reason: validation.reason,
      contract: state.northRuntimeContract
    });

    publishGlobals();

    return {
      accepted: validation.ok,
      marketF144ReceivedNorth: true,
      reason: validation.reason,
      recommendedNextFile: validation.ok ? NORTH_FILE : FILE,
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
      downstreamCoordinate: clonePlain(DOWNSTREAM_COORDINATE),
      runtimeCondition: `${MECHANICAL_COORDINATE.coordinateId}::ST_0`,
      downstreamRuntimeCondition: `${DOWNSTREAM_COORDINATE.coordinateId}::ST_0`,
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

  function getMarketReadiness() {
    return clonePlain(state.marketReadiness);
  }

  function getMarketReadinessSummary() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      marketReadinessBuilt: state.marketReadinessBuilt,
      marketReadinessReady: state.marketReadinessReady,
      marketReadinessStatus: state.marketReadinessStatus,
      marketReadinessRecordCount: state.marketReadinessRecordCount,
      marketReadyRecordCount: state.marketReadyRecordCount,
      marketDegradedRecordCount: state.marketDegradedRecordCount,
      marketBlockedRecordCount: state.marketBlockedRecordCount,
      demoReadinessScore: state.demoReadinessScore,
      documentationReadinessScore: state.documentationReadinessScore,
      licenseReadinessScore: state.licenseReadinessScore,
      distributionReadinessScore: state.distributionReadinessScore,
      implementationReadinessScore: state.implementationReadinessScore,
      riskBoundaryScore: state.riskBoundaryScore,
      supportReadinessScore: state.supportReadinessScore,
      marketPackageScore: state.marketPackageScore,
      marketReadinessScore: state.marketReadinessScore,
      marketTraceScore: state.marketTraceScore,
      marketCoverageScore: state.marketCoverageScore,
      marketCoherenceScore: state.marketCoherenceScore,
      internalMarketSurpassTargetScore: state.internalMarketSurpassTargetScore,
      publicSuperiorityClaim: false,
      publicComparisonClaimAllowed: false,
      updatedAt: nowIso()
    };
  }

  function getMarketRecords(bucket = "") {
    const records = state.marketReadiness.records || [];
    if (!bucket) return clonePlain(records);
    return clonePlain(records.filter((record) => record.bucket === bucket));
  }

  function getRiskBoundaries() {
    return clonePlain(state.marketReadiness.riskBoundaries || []);
  }

  function getReadinessBuckets() {
    return clonePlain(state.marketReadiness.buckets || {});
  }

  function findMarketRecord(id) {
    const key = makeId(id, "");
    return clonePlain((state.marketReadiness.recordsById || {})[key] || null);
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

      marketEngineF144Active: true,
      marketEngineF144Only: true,
      marketClerkActive: true,
      marketReadinessConductorActive: true,

      engineMechanicsPrimary: true,
      mathPrimary: true,
      architectureLabelsSecondary: true,
      mechanicalCoordinateId: MECHANICAL_COORDINATE.coordinateId,
      enginePart: MECHANICAL_COORDINATE.enginePart,
      systemCategory: MECHANICAL_COORDINATE.systemCategory,
      fibonacciStation: MECHANICAL_COORDINATE.fibonacciStage,
      mechanicalRole: MECHANICAL_COORDINATE.mechanicalRole,
      chessRole: MECHANICAL_COORDINATE.chessRole,
      downstreamCoordinateId: DOWNSTREAM_COORDINATE.coordinateId,

      f89RegistryObserved: state.f89RegistryObserved,
      f89RegistryReleaseAccepted: state.f89RegistryReleaseAccepted,
      f89Contract: state.f89Contract,
      f89Receipt: state.f89Receipt,

      registryGraphObserved: state.registryGraphObserved,
      registryGraphStatus: state.registryGraphStatus,
      registryRecordCount: state.registryRecordCount,
      marketInputRecordCount: state.marketInputRecordCount,
      registryQualityScore: state.registryQualityScore,
      marketInputReadinessScore: state.marketInputReadinessScore,

      marketReadinessBuilt: state.marketReadinessBuilt,
      marketReadinessReady: state.marketReadinessReady,
      marketReadinessStatus: state.marketReadinessStatus,
      marketReadinessRecordCount: state.marketReadinessRecordCount,
      marketReadyRecordCount: state.marketReadyRecordCount,
      marketDegradedRecordCount: state.marketDegradedRecordCount,
      marketBlockedRecordCount: state.marketBlockedRecordCount,

      demoReadinessScore: state.demoReadinessScore,
      documentationReadinessScore: state.documentationReadinessScore,
      licenseReadinessScore: state.licenseReadinessScore,
      distributionReadinessScore: state.distributionReadinessScore,
      implementationReadinessScore: state.implementationReadinessScore,
      riskBoundaryScore: state.riskBoundaryScore,
      supportReadinessScore: state.supportReadinessScore,
      marketPackageScore: state.marketPackageScore,
      marketReadinessScore: state.marketReadinessScore,
      marketTraceScore: state.marketTraceScore,
      marketCoverageScore: state.marketCoverageScore,
      marketCoherenceScore: state.marketCoherenceScore,
      internalMarketSurpassTargetScore: state.internalMarketSurpassTargetScore,

      f233ReturnAuthorized: state.f233ReturnAuthorized,
      f144ReleasePacketReady: state.f144ReleasePacketReady,
      f233ReturnPacketReady: state.f233ReturnPacketReady,
      f144ActivationStatus: state.f144ActivationStatus,
      f144ActivationReason: state.f144ActivationReason,

      northRuntimeReceiptAccepted: state.northRuntimeReceiptAccepted,
      northRuntimeContract: state.northRuntimeContract,
      northRuntimeReceipt: state.northRuntimeReceipt,

      newsProtocolAligned: true,
      fibonacciSynchronizationMetricActive: true,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      activeFibonacci: FIBONACCI.MARKET_READINESS,
      activeFibonacciRank: 144,
      activeNewsGate: NEWS_GATES.MARKET,
      sourceFibonacciGate: FIBONACCI.PROJECT_REGISTRY,
      futureFibonacciGate: FIBONACCI.DOWNSTREAM_RETURN,
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

      marketF144Receipt: true,
      marketClerkReceipt: true,

      marketEngineOwns: [
        "F144 market readiness output manifold",
        "F89 registry release consumption",
        "deterministic market readiness records",
        "demo / documentation / license / distribution / implementation readiness",
        "risk boundary enforcement",
        "F233 downstream return packet"
      ],
      marketEngineDoesNotOwn: [
        "F34 Product Engine authority",
        "F55 Expression authority",
        "F89 Registry authority",
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
        registry: F89_REGISTRY_FILE,
        market: FILE,
        canvas: CANVAS_FILE
      },

      readinessBuckets: clonePlain(READINESS_BUCKETS),
      fibonacciMap: clonePlain(FIBONACCI),
      newsGates: clonePlain(NEWS_GATES),
      mechanicalCoordinate: clonePlain(MECHANICAL_COORDINATE),
      downstreamCoordinate: clonePlain(DOWNSTREAM_COORDINATE),
      mechanicalCoordinatePacket: getMechanicalCoordinatePacket(),

      f89RegistryReleasePacket: clonePlain(state.f89RegistryReleasePacket),
      marketReadiness: getMarketReadiness(),
      marketReadinessSummary: getMarketReadinessSummary(),
      marketRecords: getMarketRecords(),
      readinessBucketRecords: getReadinessBuckets(),
      riskBoundaries: getRiskBoundaries(),

      marketReadinessMetrics: computeMarketReadinessMetrics(),
      newsAlignment: evaluateNewsAlignment(),
      f144MarketReadinessPacket: composeF144MarketReadinessPacket(),
      f233DownstreamReturnPacket: composeF233DownstreamReturnPacket(),
      northRuntimeReceiptPacket: clonePlain(state.northRuntimeReceiptPacket),

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

    const records = (r.marketRecords || []).map((record) => (
      `- ${record.id} :: status=${record.status} :: score=${record.marketPackageReadiness} :: risk=${record.riskBoundaryReadiness} :: demo=${record.demoReadiness} :: docs=${record.documentationReadiness} :: license=${record.licenseReadiness} :: distribution=${record.distributionReadiness} :: implementation=${record.implementationReadiness}`
    )).join("\n") || "- none";

    const risk = (r.riskBoundaries || []).map((boundary) => (
      `- ${boundary.boundary} :: pass=${boundary.pass} :: score=${boundary.score}`
    )).join("\n") || "- none";

    const events = (r.localEvents || []).slice(-48).map((item) => (
      `- ${item.at} :: ${item.event} :: ${JSON.stringify(item.detail || {})}`
    )).join("\n") || "- none";

    const errors = (r.errors || []).map((item) => (
      `- ${item.at} :: ${item.code} :: ${item.message}`
    )).join("\n") || "- none";

    return [
      "LAB_PRODUCT_ENGINE_MARKET_F144_ENGINE_MECHANICS_READINESS_CONDUCTOR_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      "",
      `marketEngineF144Active=${r.marketEngineF144Active}`,
      `marketEngineF144Only=${r.marketEngineF144Only}`,
      `marketClerkActive=${r.marketClerkActive}`,
      `marketReadinessConductorActive=${r.marketReadinessConductorActive}`,
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
      `downstreamCoordinateId=${r.downstreamCoordinateId}`,
      "",
      `f89RegistryObserved=${r.f89RegistryObserved}`,
      `f89RegistryReleaseAccepted=${r.f89RegistryReleaseAccepted}`,
      `f89Contract=${r.f89Contract}`,
      `f89Receipt=${r.f89Receipt}`,
      "",
      `registryGraphObserved=${r.registryGraphObserved}`,
      `registryGraphStatus=${r.registryGraphStatus}`,
      `registryRecordCount=${r.registryRecordCount}`,
      `marketInputRecordCount=${r.marketInputRecordCount}`,
      `registryQualityScore=${r.registryQualityScore}`,
      `marketInputReadinessScore=${r.marketInputReadinessScore}`,
      "",
      `marketReadinessBuilt=${r.marketReadinessBuilt}`,
      `marketReadinessReady=${r.marketReadinessReady}`,
      `marketReadinessStatus=${r.marketReadinessStatus}`,
      `marketReadinessRecordCount=${r.marketReadinessRecordCount}`,
      `marketReadyRecordCount=${r.marketReadyRecordCount}`,
      `marketDegradedRecordCount=${r.marketDegradedRecordCount}`,
      `marketBlockedRecordCount=${r.marketBlockedRecordCount}`,
      "",
      `demoReadinessScore=${r.demoReadinessScore}`,
      `documentationReadinessScore=${r.documentationReadinessScore}`,
      `licenseReadinessScore=${r.licenseReadinessScore}`,
      `distributionReadinessScore=${r.distributionReadinessScore}`,
      `implementationReadinessScore=${r.implementationReadinessScore}`,
      `riskBoundaryScore=${r.riskBoundaryScore}`,
      `supportReadinessScore=${r.supportReadinessScore}`,
      `marketPackageScore=${r.marketPackageScore}`,
      `marketReadinessScore=${r.marketReadinessScore}`,
      `marketTraceScore=${r.marketTraceScore}`,
      `marketCoverageScore=${r.marketCoverageScore}`,
      `marketCoherenceScore=${r.marketCoherenceScore}`,
      `internalMarketSurpassTargetScore=${r.internalMarketSurpassTargetScore}`,
      "",
      `f233ReturnAuthorized=${r.f233ReturnAuthorized}`,
      `f144ReleasePacketReady=${r.f144ReleasePacketReady}`,
      `f233ReturnPacketReady=${r.f233ReturnPacketReady}`,
      `f144ActivationStatus=${r.f144ActivationStatus}`,
      `f144ActivationReason=${r.f144ActivationReason}`,
      "",
      `northRuntimeReceiptAccepted=${r.northRuntimeReceiptAccepted}`,
      `northRuntimeContract=${r.northRuntimeContract}`,
      `northRuntimeReceipt=${r.northRuntimeReceipt}`,
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
      "MARKET_RECORDS",
      records,
      "",
      "RISK_BOUNDARIES",
      risk,
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
    setDataset("labProductEngineMarketLoaded", "true");
    setDataset("labProductEngineMarketContract", CONTRACT);
    setDataset("labProductEngineMarketReceipt", RECEIPT);
    setDataset("labProductEngineMarketVersion", VERSION);
    setDataset("labProductEngineMarketFile", FILE);

    setDataset("marketF144Active", "true");
    setDataset("marketF144Only", "true");
    setDataset("marketClerkActive", "true");
    setDataset("marketReadinessConductorActive", "true");

    setDataset("marketEngineMechanicsPrimary", "true");
    setDataset("marketMathPrimary", "true");
    setDataset("marketArchitectureLabelsSecondary", "true");
    setDataset("marketMechanicalCoordinateId", MECHANICAL_COORDINATE.coordinateId);
    setDataset("marketDownstreamCoordinateId", DOWNSTREAM_COORDINATE.coordinateId);
    setDataset("marketEnginePart", MECHANICAL_COORDINATE.enginePart);
    setDataset("marketSystemCategory", MECHANICAL_COORDINATE.systemCategory);
    setDataset("marketFibonacciStation", MECHANICAL_COORDINATE.fibonacciStage);
    setDataset("marketMechanicalRole", MECHANICAL_COORDINATE.mechanicalRole);
    setDataset("marketChessRole", MECHANICAL_COORDINATE.chessRole);

    setDataset("marketF89RegistryObserved", state.f89RegistryObserved);
    setDataset("marketF89RegistryReleaseAccepted", state.f89RegistryReleaseAccepted);
    setDataset("marketRegistryGraphObserved", state.registryGraphObserved);
    setDataset("marketRegistryGraphStatus", state.registryGraphStatus);
    setDataset("marketRegistryRecordCount", state.registryRecordCount);
    setDataset("marketInputRecordCount", state.marketInputRecordCount);

    setDataset("marketReadinessBuilt", state.marketReadinessBuilt);
    setDataset("marketReadinessReady", state.marketReadinessReady);
    setDataset("marketReadinessStatus", state.marketReadinessStatus);
    setDataset("marketReadinessRecordCount", state.marketReadinessRecordCount);
    setDataset("marketReadyRecordCount", state.marketReadyRecordCount);
    setDataset("marketDegradedRecordCount", state.marketDegradedRecordCount);
    setDataset("marketBlockedRecordCount", state.marketBlockedRecordCount);

    setDataset("marketDemoReadinessScore", state.demoReadinessScore);
    setDataset("marketDocumentationReadinessScore", state.documentationReadinessScore);
    setDataset("marketLicenseReadinessScore", state.licenseReadinessScore);
    setDataset("marketDistributionReadinessScore", state.distributionReadinessScore);
    setDataset("marketImplementationReadinessScore", state.implementationReadinessScore);
    setDataset("marketRiskBoundaryScore", state.riskBoundaryScore);
    setDataset("marketSupportReadinessScore", state.supportReadinessScore);
    setDataset("marketPackageScore", state.marketPackageScore);
    setDataset("marketReadinessScore", state.marketReadinessScore);
    setDataset("marketTraceScore", state.marketTraceScore);
    setDataset("marketCoverageScore", state.marketCoverageScore);
    setDataset("marketCoherenceScore", state.marketCoherenceScore);
    setDataset("marketInternalSurpassTargetScore", state.internalMarketSurpassTargetScore);

    setDataset("marketF233ReturnAuthorized", state.f233ReturnAuthorized);
    setDataset("marketF144ReleasePacketReady", state.f144ReleasePacketReady);
    setDataset("marketF233ReturnPacketReady", state.f233ReturnPacketReady);
    setDataset("marketF144ActivationStatus", state.f144ActivationStatus);
    setDataset("marketF144ActivationReason", state.f144ActivationReason);

    setDataset("marketNewsProtocolAligned", "true");
    setDataset("marketFibonacciSynchronizationMetricActive", "true");
    setDataset("marketFibonacciSynchronizationScore", state.fibonacciSynchronizationScore);
    setDataset("marketActiveFibonacci", FIBONACCI.MARKET_READINESS);
    setDataset("marketActiveFibonacciRank", "144");
    setDataset("marketActiveNewsGate", NEWS_GATES.MARKET);
    setDataset("marketSourceFibonacciGate", FIBONACCI.PROJECT_REGISTRY);
    setDataset("marketFutureFibonacciGate", FIBONACCI.DOWNSTREAM_RETURN);

    setDataset("marketFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("marketRecommendedNextFile", state.recommendedNextFile);
    setDataset("marketRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);

    setDataset("marketPublicSuperiorityClaim", "false");
    setDataset("marketPublicComparisonClaimAllowed", "false");
    setDataset("marketBenchmarkRequiredBeforePublicClaim", "true");
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
    root.MARKET_READINESS_CONDUCTOR = api;
    root.MARKET_CLERK = api;

    root.DEXTER_LAB.productEngineMarket = api;
    root.DEXTER_LAB.productEngineMarketF144 = api;
    root.DEXTER_LAB.marketF144ReadinessConductor = api;
    root.DEXTER_LAB.marketReadinessConductor = api;
    root.DEXTER_LAB.marketClerk = api;

    root.HEARTH.productEngineMarket = api;
    root.HEARTH.productEngineMarketF144 = api;
    root.HEARTH.marketF144ReadinessConductor = api;
    root.HEARTH.marketReadinessConductor = api;
    root.HEARTH.marketClerk = api;

    const light = getReceiptLight();

    root.LAB_PRODUCT_ENGINE_MARKET_RECEIPT = light;
    root.LAB_PRODUCT_ENGINE_MARKET_F144_RECEIPT = light;
    root.PRODUCT_ENGINE_MARKET_RECEIPT = light;
    root.MARKET_F144_READINESS_CONDUCTOR_RECEIPT = light;
    root.MARKET_CLERK_RECEIPT = light;

    root.DEXTER_LAB.productEngineMarketReceipt = light;
    root.HEARTH.productEngineMarketReceipt = light;

    root.__LAB_PRODUCT_ENGINE_MARKET_LOADED__ = true;
    root.__LAB_PRODUCT_ENGINE_MARKET_CONTRACT__ = CONTRACT;
    root.__LAB_PRODUCT_ENGINE_MARKET_RECEIPT__ = RECEIPT;
    root.__LAB_PRODUCT_ENGINE_MARKET_F144_ONLY__ = true;
    root.__LAB_PRODUCT_ENGINE_MARKET_MECHANICAL_COORDINATE__ = MECHANICAL_COORDINATE.coordinateId;
    root.__LAB_PRODUCT_ENGINE_MARKET_DOWNSTREAM_COORDINATE__ = DOWNSTREAM_COORDINATE.coordinateId;
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
    STATUS,
    READINESS_BUCKETS,
    MECHANICAL_COORDINATE,
    DOWNSTREAM_COORDINATE,

    readF89RegistryAuthority,
    readF89RegistryRelease,
    validateF89RegistryRelease,
    acceptF89RegistryRelease,
    receiveF89RegistryRelease,
    submitF89RegistryRelease,

    getF89MarketInputs,
    getF89RegistryRecords,
    normalizeMarketInput,
    groupByBucket,
    createDemoPlan,
    createDocumentationPlan,
    createLicensePlan,
    createDistributionPlan,
    createImplementationPlan,
    createRiskBoundaries,
    buildMarketPackage,
    buildMarketReadiness,

    computeMarketReadinessMetrics,
    computeFibonacciSynchronizationMetric,
    evaluateNewsAlignment,

    readNorthRuntimeAuthority,
    composeF144MarketReadinessPacket,
    composeF233DownstreamReturnPacket,
    composeF144Receipt,
    submitF144PacketToNorth,
    submitF233ReturnToNorth,

    validateNorthRuntimeReceipt,
    acceptNorthRuntimeReceipt,

    getMechanicalCoordinatePacket,
    getMarketReadiness,
    getMarketReadinessSummary,
    getMarketRecords,
    getRiskBoundaries,
    getReadinessBuckets,
    findMarketRecord,

    getReceiptLight,
    getReceipt,
    getReceiptText,
    publishGlobals,
    updateDataset,

    marketEngineF144Active: true,
    marketEngineF144Only: true,
    marketClerkActive: true,
    marketReadinessConductorActive: true,

    engineMechanicsPrimary: true,
    mathPrimary: true,
    architectureLabelsSecondary: true,

    ownsF144MarketReadinessOutputManifold: true,
    ownsF89RegistryReleaseConsumption: true,
    ownsDeterministicMarketReadinessRecords: true,
    ownsDemoDocumentationLicenseDistributionImplementationReadiness: true,
    ownsRiskBoundaryEnforcement: true,
    ownsF233DownstreamReturnPacket: true,

    ownsF34ProductEngineAuthority: false,
    ownsF55ExpressionAuthority: false,
    ownsF89RegistryAuthority: false,
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
    const f89Release = readF89RegistryRelease();
    if (hasMeaningfulF89Release(f89Release)) {
      acceptF89RegistryRelease(f89Release);
    }
  } catch (error) {
    recordError("INITIAL_F89_REGISTRY_RELEASE_READ_FAILED", error);
  }

  try {
    computeFibonacciSynchronizationMetric();
  } catch (error) {
    recordError("INITIAL_F144_SYNC_METRIC_FAILED", error);
  }

  recordLocal("MARKET_F144_ENGINE_MECHANICS_READINESS_CONDUCTOR_LOADED", {
    file: FILE,
    contract: CONTRACT,
    mechanicalCoordinate: MECHANICAL_COORDINATE.coordinateId,
    downstreamCoordinate: DOWNSTREAM_COORDINATE.coordinateId,
    targetFile: NORTH_FILE,
    publicSuperiorityClaim: false
  });

  publishGlobals();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

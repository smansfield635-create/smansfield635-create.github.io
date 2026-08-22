// /assets/lab/product-engine.market.js
// LAB_PRODUCT_ENGINE_MARKET_F144_REPLACEMENT_SHELL_v3

(() => {
  "use strict";

  const FILE = "/assets/lab/product-engine.market.js";
  const CONTRACT = "LAB_PRODUCT_ENGINE_MARKET_F144_REPLACEMENT_SHELL_v3";
  const RECEIPT = "LAB_PRODUCT_ENGINE_MARKET_F144_REPLACEMENT_SHELL_RECEIPT_v3";
  const VERSION = "2026-06-22.f144-replacement-shell.v3";

  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const F89_FILE = "/assets/lab/product-engine.registry.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const FIBONACCI = Object.freeze({
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

    marketEngineF144Active: true,
    marketEngineF144Only: true,
    marketClerkActive: true,
    marketReadinessConductorActive: true,

    mechanicalCoordinate: MECHANICAL_COORDINATE,
    engineMechanicsPrimary: true,
    mathPrimary: true,
    architectureLabelsSecondary: true,

    f89Observed: false,
    f89Accepted: false,
    f89Packet: null,
    f89Contract: "",
    f89Receipt: "",

    marketReadinessBuilt: false,
    marketReadinessReady: false,
    marketReadinessStatus: STATUS.HELD,
    marketRecordCount: 0,
    marketReadyRecordCount: 0,
    marketDegradedRecordCount: 0,
    marketHeldRecordCount: 0,

    marketReadinessScore: 0,
    marketTraceScore: 0,
    marketCoverageScore: 0,
    marketCoherenceScore: 0,
    riskBoundaryScore: 0,
    internalMarketSurpassTargetScore: 0,

    f233ReturnAuthorized: false,
    f144PacketReady: false,
    f233PacketReady: false,
    f144ActivationStatus: STATUS.ACTIVE,
    f144ActivationReason: "F144_ACTIVE_WAITING_F89_RELEASE",

    activeFibonacci: FIBONACCI.MARKET_READINESS,
    activeFibonacciRank: 144,
    sourceFibonacciGate: FIBONACCI.PROJECT_REGISTRY,
    futureFibonacciGate: FIBONACCI.DOWNSTREAM_RETURN,
    fibonacciSynchronizationScore: 0,
    oneActiveGearAtATime: true,

    marketReadiness: {
      records: [],
      recordsById: {},
      riskBoundaries: [],
      package: {},
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

  function makeId(value, fallback = "market-record") {
    return safeString(value || fallback, fallback)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || fallback;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
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

  function firstGlobal(paths) {
    for (const path of paths || []) {
      const found = readPath(path);
      if (found) return found;
    }
    return null;
  }

  function recordLocal(event, detail = {}) {
    const item = { at: nowIso(), event: safeString(event), detail: clone(detail) };
    state.localEvents.push(item);
    if (state.localEvents.length > 180) state.localEvents.shift();
    state.updatedAt = item.at;
    updateDataset();
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "F144_ERROR"),
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

  function readF89Authority() {
    return firstGlobal([
      "LAB_PRODUCT_ENGINE_REGISTRY",
      "LAB_PRODUCT_ENGINE_REGISTRY_F89",
      "PRODUCT_ENGINE_REGISTRY",
      "PROJECT_REGISTRY_CONDUCTOR",
      "DEXTER_LAB.productEngineRegistry",
      "HEARTH.productEngineRegistry"
    ]);
  }

  function readF89Release() {
    const authority = readF89Authority();
    if (!authority) return {};
    try {
      if (isFunction(authority.composeF89ReleasePacket)) return authority.composeF89ReleasePacket() || {};
      if (isFunction(authority.getReceipt)) {
        const receipt = authority.getReceipt() || {};
        return receipt.f89ReleasePacket || receipt;
      }
      return authority.receiptPacket || authority.receipt || authority;
    } catch (error) {
      recordError("F89_RELEASE_READ_FAILED", error);
      return {};
    }
  }

  function hasMeaningfulF89Release(packet = {}) {
    return Boolean(
      isObject(packet) &&
      (
        packet.contract ||
        packet.receipt ||
        packet.packetType === "PROJECT_REGISTRY_F89_RELEASE_PACKET" ||
        safeBool(packet.registryEngineF89Active, false) ||
        safeBool(packet.f89ReleasePacketReady, false) ||
        safeBool(packet.registryGraphBuilt, false) ||
        Array.isArray(packet.marketInputs) ||
        Array.isArray(packet.registryRecords) ||
        (isObject(packet.registryGraph) && Array.isArray(packet.registryGraph.records))
      )
    );
  }

  function validateF89Release(packet = {}) {
    const active = safeString(packet.activeFibonacci || packet.fibonacciStage || "");
    const future = safeString(packet.futureFibonacciGate || "");

    const accepted = Boolean(
      hasMeaningfulF89Release(packet) &&
      !detectForbiddenClaim(packet) &&
      (!active || active === FIBONACCI.PROJECT_REGISTRY || active === "F89") &&
      (!future || future === FIBONACCI.MARKET_READINESS || future === "F144") &&
      (
        Array.isArray(packet.marketInputs) ||
        Array.isArray(packet.registryRecords) ||
        isObject(packet.registryGraph)
      )
    );

    return {
      accepted,
      reason: accepted ? "F89_RELEASE_ACCEPTED" : "F89_RELEASE_REJECTED_OR_INCOMPLETE",
      forbiddenClaimDetected: detectForbiddenClaim(packet),
      input: clone(packet)
    };
  }

  function getF89MarketInputs(packet = state.f89Packet || {}) {
    if (Array.isArray(packet.marketInputs)) return packet.marketInputs;
    if (Array.isArray(packet.registryRecords)) return packet.registryRecords;
    if (isObject(packet.registryGraph) && Array.isArray(packet.registryGraph.marketInputs)) return packet.registryGraph.marketInputs;
    if (isObject(packet.registryGraph) && Array.isArray(packet.registryGraph.records)) return packet.registryGraph.records;
    return [];
  }

  function normalizeMarketInput(source = {}, index = 0) {
    const id = makeId(source.id || source.recordId || source.registryRecordId || `market-input-${index + 1}`);
    const file = safeString(source.file || source.sourceFile || "");
    const route = safeString(source.route || "");
    const contract = safeString(source.contract || source.sourceContract || "");
    const receipt = safeString(source.receipt || source.sourceReceipt || "");

    const traceReady = safeBool(source.traceReady, Boolean(file || route || contract || receipt));
    const registryReady = safeBool(source.registryReady, traceReady);
    const baseScore = clamp(source.readinessScore ?? source.registryReadinessScore ?? 0, 0, 100);

    const riskBoundaryScore = clamp(
      (safeBool(source.publicSuperiorityClaim, false) ? 0 : 18) +
      (safeBool(source.publicComparisonClaimAllowed, false) ? 0 : 18) +
      (safeBool(source.generatedImage, false) ? 0 : 12) +
      (safeBool(source.graphicBox, false) ? 0 : 12) +
      (safeBool(source.webGL, false) ? 0 : 12) +
      (safeBool(source.visualPassClaimed, false) ? 0 : 12) +
      (traceReady ? 8 : 0) +
      (registryReady ? 8 : 0),
      0,
      100
    );

    const demoScore = clamp(Math.round(baseScore * 0.35 + (file || route ? 20 : 0) + (traceReady ? 20 : 0) + (registryReady ? 20 : 0)), 0, 100);
    const docsScore = clamp(Math.round(baseScore * 0.25 + (contract ? 25 : 0) + (receipt ? 25 : 0) + (file || route ? 15 : 0) + (traceReady ? 10 : 0)), 0, 100);
    const licenseScore = clamp(Math.round(baseScore * 0.22 + (contract ? 34 : 0) + (receipt ? 22 : 0) + (registryReady ? 14 : 0) + (traceReady ? 8 : 0)), 0, 100);
    const distributionScore = clamp(Math.round(baseScore * 0.25 + (file || route ? 28 : 0) + (receipt ? 18 : 0) + (registryReady ? 18 : 0) + (traceReady ? 11 : 0)), 0, 100);
    const implementationScore = clamp(Math.round(baseScore * 0.25 + (file ? 22 : 0) + (route ? 16 : 0) + (contract ? 14 : 0) + (receipt ? 14 : 0) + (registryReady ? 9 : 0)), 0, 100);

    const packageScore = clamp(
      Math.round(
        demoScore * 0.16 +
        docsScore * 0.16 +
        licenseScore * 0.15 +
        distributionScore * 0.15 +
        implementationScore * 0.15 +
        riskBoundaryScore * 0.15 +
        (traceReady ? 8 : 0)
      ),
      0,
      100
    );

    const status =
      packageScore >= 84 && riskBoundaryScore >= 80
        ? STATUS.READY
        : packageScore >= 62 && riskBoundaryScore >= 70
          ? STATUS.DEGRADED
          : STATUS.HELD;

    return {
      id,
      sourceProductId: safeString(source.sourceProductId || source.productId || id),
      file,
      route,
      contract,
      receipt,
      traceReady,
      registryReady,
      demoScore,
      documentationScore: docsScore,
      licenseScore,
      distributionScore,
      implementationScore,
      riskBoundaryScore,
      packageScore,
      readinessScore: packageScore,
      status,
      deterministic: true,
      internalOnly: true,
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

  function average(records, field) {
    if (!records.length) return 0;
    return clamp(Math.round(records.reduce((sum, record) => sum + safeNumber(record[field], 0), 0) / records.length), 0, 100);
  }

  function buildRiskBoundaries(records) {
    return [
      { boundary: "NO_PUBLIC_SUPERIORITY_CLAIM", pass: true, score: 100 },
      { boundary: "NO_PUBLIC_COMPARISON_WITHOUT_BENCHMARK", pass: true, score: 100 },
      { boundary: "NO_GENERATED_IMAGE_CLAIM", pass: records.every((r) => !r.generatedImage), score: records.every((r) => !r.generatedImage) ? 100 : 0 },
      { boundary: "NO_GRAPHICBOX_CLAIM", pass: records.every((r) => !r.graphicBox), score: records.every((r) => !r.graphicBox) ? 100 : 0 },
      { boundary: "NO_WEBGL_CLAIM", pass: records.every((r) => !r.webGL), score: records.every((r) => !r.webGL) ? 100 : 0 },
      { boundary: "NO_VISUAL_PASS_CLAIM", pass: records.every((r) => !r.visualPassClaimed), score: records.every((r) => !r.visualPassClaimed) ? 100 : 0 },
      { boundary: "TRACEABILITY_REQUIRED", pass: records.some((r) => r.traceReady), score: records.some((r) => r.traceReady) ? 100 : 0 }
    ];
  }

  function computeMarketMetrics() {
    const records = state.marketReadiness.records || [];
    const count = Math.max(1, records.length);

    state.riskBoundaryScore = average(records, "riskBoundaryScore");
    state.marketTraceScore = clamp(Math.round((records.filter((r) => r.traceReady).length / count) * 100), 0, 100);
    state.marketCoverageScore = records.length ? 100 : 0;

    const readyRatio = records.filter((r) => r.status === STATUS.READY).length / count;
    const degradedRatio = records.filter((r) => r.status === STATUS.DEGRADED).length / count;
    const heldRatio = records.filter((r) => r.status === STATUS.HELD).length / count;

    state.marketCoherenceScore = clamp(
      Math.round(readyRatio * 52 + degradedRatio * 24 - heldRatio * 38 + state.marketTraceScore * 0.14 + state.riskBoundaryScore * 0.14),
      0,
      100
    );

    state.marketReadinessScore = clamp(
      Math.round(
        average(records, "packageScore") * 0.30 +
        state.marketCoherenceScore * 0.24 +
        state.riskBoundaryScore * 0.20 +
        state.marketTraceScore * 0.14 +
        state.marketCoverageScore * 0.12
      ),
      0,
      100
    );

    state.internalMarketSurpassTargetScore = clamp(
      Math.round(state.marketReadinessScore * 0.46 + state.riskBoundaryScore * 0.24 + state.fibonacciSynchronizationScore * 0.30),
      0,
      100
    );

    return {
      marketReadinessScore: state.marketReadinessScore,
      marketTraceScore: state.marketTraceScore,
      marketCoverageScore: state.marketCoverageScore,
      marketCoherenceScore: state.marketCoherenceScore,
      riskBoundaryScore: state.riskBoundaryScore,
      internalMarketSurpassTargetScore: state.internalMarketSurpassTargetScore,
      publicSuperiorityClaim: false,
      publicComparisonClaimAllowed: false
    };
  }

  function buildMarketReadiness(packet = state.f89Packet || {}, options = {}) {
    const records = getF89MarketInputs(packet).map(normalizeMarketInput);
    const recordsById = {};
    records.forEach((record) => { recordsById[record.id] = record; });

    const riskBoundaries = buildRiskBoundaries(records);

    state.marketReadiness = {
      records,
      recordsById,
      riskBoundaries,
      package: {
        packageType: "F144_MARKET_READINESS_PACKAGE",
        internalOnly: true,
        recordCount: records.length,
        readyRecordCount: records.filter((r) => r.status === STATUS.READY).length,
        degradedRecordCount: records.filter((r) => r.status === STATUS.DEGRADED).length,
        heldRecordCount: records.filter((r) => r.status === STATUS.HELD).length,
        publicSuperiorityClaim: false,
        publicComparisonClaimAllowed: false,
        benchmarkRequiredBeforePublicClaim: true,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      },
      buildId: `f144-market-${records.length}`,
      builtAt: nowIso()
    };

    state.marketReadinessBuilt = true;
    state.marketRecordCount = records.length;
    state.marketReadyRecordCount = records.filter((r) => r.status === STATUS.READY).length;
    state.marketDegradedRecordCount = records.filter((r) => r.status === STATUS.DEGRADED).length;
    state.marketHeldRecordCount = records.filter((r) => r.status === STATUS.HELD).length;

    computeMarketMetrics();

    const riskPass = riskBoundaries.every((boundary) => boundary.pass);
    if (records.length && state.marketReadinessScore >= 80 && state.riskBoundaryScore >= 80 && riskPass) {
      state.marketReadinessReady = true;
      state.marketReadinessStatus = STATUS.READY;
      state.f233ReturnAuthorized = true;
      state.f144PacketReady = true;
      state.f233PacketReady = true;
      state.f144ActivationStatus = STATUS.READY;
      state.f144ActivationReason = "F144_READY_FOR_F233_DOWNSTREAM_RETURN";
    } else if (records.length && state.marketReadinessScore >= 62 && state.riskBoundaryScore >= 70) {
      state.marketReadinessReady = false;
      state.marketReadinessStatus = STATUS.DEGRADED;
      state.f233ReturnAuthorized = true;
      state.f144PacketReady = true;
      state.f233PacketReady = true;
      state.f144ActivationStatus = STATUS.DEGRADED;
      state.f144ActivationReason = "F144_DEGRADED_F233_RETURN_AVAILABLE";
    } else {
      state.marketReadinessReady = false;
      state.marketReadinessStatus = STATUS.HELD;
      state.f233ReturnAuthorized = false;
      state.f144PacketReady = false;
      state.f233PacketReady = false;
      state.f144ActivationStatus = STATUS.HELD;
      state.f144ActivationReason = "WAITING_F89_RELEASE_OR_MARKET_READINESS";
    }

    computeFibonacciSynchronization();

    if (options.silent !== true) {
      recordLocal("F144_MARKET_READINESS_BUILT", {
        records: records.length,
        status: state.marketReadinessStatus,
        score: state.marketReadinessScore
      });
    }

    updateDataset();
    return clone(state.marketReadiness);
  }

  function computeFibonacciSynchronization() {
    const checks = [
      state.oneActiveGearAtATime,
      state.activeFibonacci === FIBONACCI.MARKET_READINESS,
      state.activeFibonacciRank === 144,
      state.sourceFibonacciGate === FIBONACCI.PROJECT_REGISTRY,
      state.futureFibonacciGate === FIBONACCI.DOWNSTREAM_RETURN,
      state.marketEngineF144Active,
      state.marketClerkActive,
      state.marketReadinessConductorActive,
      state.engineMechanicsPrimary,
      state.mathPrimary,
      state.mechanicalCoordinate.coordinateId === "RT3D-X10_Y19_Z144",
      state.f89Accepted || state.f89Observed,
      state.marketReadinessBuilt,
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

  function acceptF89RegistryRelease(packet = {}) {
    const validation = validateF89Release(packet);

    if (validation.accepted) {
      state.f89Observed = true;
      state.f89Accepted = true;
      state.f89Packet = clone(packet);
      state.f89Contract = safeString(packet.contract);
      state.f89Receipt = safeString(packet.receipt);
      buildMarketReadiness(packet, { silent: true });
    }

    recordLocal("F89_RELEASE_EVALUATED_BY_F144", {
      accepted: validation.accepted,
      reason: validation.reason
    });

    computeFibonacciSynchronization();
    publishGlobals();

    return {
      accepted: validation.accepted,
      reason: validation.reason,
      marketReadinessBuilt: state.marketReadinessBuilt,
      marketReadinessReady: state.marketReadinessReady,
      f233ReturnAuthorized: state.f233ReturnAuthorized,
      recommendedNextFile: validation.accepted ? NORTH_FILE : F89_FILE,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function composeF144MarketReadinessPacket(extra = {}) {
    computeFibonacciSynchronization();
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "MARKET_F144_READINESS_PACKET",
      sourceFile: FILE,
      targetFile: NORTH_FILE,
      destinationFile: NORTH_FILE,

      activeFibonacci: FIBONACCI.MARKET_READINESS,
      activeFibonacciRank: 144,
      sourceFibonacciGate: FIBONACCI.PROJECT_REGISTRY,
      futureFibonacciGate: FIBONACCI.DOWNSTREAM_RETURN,
      futureFibonacciRank: 233,

      familyScope: state.familyScope,
      thisFamilyIsEntireDiagnosticEngine: false,
      thisFamilyIsAllOfEngine1: false,
      replacesEngines2Through4: false,

      mechanicalCoordinate: clone(MECHANICAL_COORDINATE),
      marketReadinessBuilt: state.marketReadinessBuilt,
      marketReadinessReady: state.marketReadinessReady,
      marketReadinessStatus: state.marketReadinessStatus,
      marketReadinessScore: state.marketReadinessScore,
      riskBoundaryScore: state.riskBoundaryScore,
      marketTraceScore: state.marketTraceScore,
      marketCoverageScore: state.marketCoverageScore,
      marketCoherenceScore: state.marketCoherenceScore,
      internalMarketSurpassTargetScore: state.internalMarketSurpassTargetScore,
      marketReadiness: clone(state.marketReadiness),
      f233ReturnAuthorized: state.f233ReturnAuthorized,
      f144PacketReady: state.f144PacketReady,
      f233PacketReady: state.f233PacketReady,
      f144ActivationStatus: state.f144ActivationStatus,
      f144ActivationReason: state.f144ActivationReason,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
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

  function composeF233DownstreamReturnPacket(extra = {}) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "F233_DOWNSTREAM_RETURN_PACKET",
      sourceFile: FILE,
      targetFile: NORTH_FILE,
      destinationFile: NORTH_FILE,

      activeFibonacci: FIBONACCI.DOWNSTREAM_RETURN,
      activeFibonacciRank: 233,
      sourceFibonacciGate: FIBONACCI.MARKET_READINESS,
      futureFibonacciGate: FIBONACCI.NORTH_LATCH,

      f144MarketReadinessPacket: composeF144MarketReadinessPacket(extra),
      f233ReturnAuthorized: state.f233ReturnAuthorized,
      f233PacketReady: state.f233PacketReady,
      northRuntimeShouldAccept: Boolean(state.f233ReturnAuthorized || state.f233PacketReady),

      recommendedNorthMethodOrder: [
        "receiveF233DownstreamReturnPacket",
        "acceptF144MarketReadinessPacket",
        "acceptSupportEnginePacket",
        "receiveSupportEnginePacket"
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

  function submitF233ReturnToNorth(extra = {}) {
    const north = firstGlobal(["LAB_RUNTIME_TABLE", "RUNTIME_TABLE", "DEXTER_LAB.runtimeTable", "HEARTH.runtimeTable"]);
    if (!north) return { submitted: false, reason: "NORTH_RUNTIME_TABLE_UNAVAILABLE" };

    const packet = composeF233DownstreamReturnPacket(extra);
    try {
      if (isFunction(north.receiveF233DownstreamReturnPacket)) return { submitted: true, response: clone(north.receiveF233DownstreamReturnPacket(packet)) };
      if (isFunction(north.acceptF144MarketReadinessPacket)) return { submitted: true, response: clone(north.acceptF144MarketReadinessPacket(packet)) };
      if (isFunction(north.acceptSupportEnginePacket)) return { submitted: true, response: clone(north.acceptSupportEnginePacket(packet)) };
      if (isFunction(north.receiveSupportEnginePacket)) return { submitted: true, response: clone(north.receiveSupportEnginePacket(packet)) };
    } catch (error) {
      recordError("F233_RETURN_TO_NORTH_FAILED", error);
      return { submitted: false, reason: "F233_RETURN_TO_NORTH_FAILED" };
    }

    return { submitted: false, reason: "NORTH_F233_INTAKE_METHOD_UNAVAILABLE" };
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
      marketEngineF144Active: true,
      marketEngineF144Only: true,
      marketClerkActive: true,
      marketReadinessConductorActive: true,
      mechanicalCoordinateId: MECHANICAL_COORDINATE.coordinateId,
      activeFibonacci: FIBONACCI.MARKET_READINESS,
      activeFibonacciRank: 144,
      sourceFibonacciGate: FIBONACCI.PROJECT_REGISTRY,
      futureFibonacciGate: FIBONACCI.DOWNSTREAM_RETURN,
      f89Observed: state.f89Observed,
      f89Accepted: state.f89Accepted,
      marketReadinessBuilt: state.marketReadinessBuilt,
      marketReadinessReady: state.marketReadinessReady,
      marketReadinessStatus: state.marketReadinessStatus,
      marketRecordCount: state.marketRecordCount,
      marketReadinessScore: state.marketReadinessScore,
      riskBoundaryScore: state.riskBoundaryScore,
      f233ReturnAuthorized: state.f233ReturnAuthorized,
      f144PacketReady: state.f144PacketReady,
      f233PacketReady: state.f233PacketReady,
      f144ActivationStatus: state.f144ActivationStatus,
      f144ActivationReason: state.f144ActivationReason,
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
        "F144 market readiness output manifold",
        "F89 registry release consumption",
        "deterministic market readiness records",
        "risk boundary enforcement",
        "F233 downstream return packet"
      ],
      doesNotOwn: [
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
      fibonacci: clone(FIBONACCI),
      mechanicalCoordinate: clone(MECHANICAL_COORDINATE),
      mechanicalCoordinatePacket: getMechanicalCoordinatePacket(),
      f89Packet: clone(state.f89Packet),
      marketReadiness: clone(state.marketReadiness),
      marketReadinessMetrics: computeMarketMetrics(),
      f144MarketReadinessPacket: composeF144MarketReadinessPacket(),
      f233DownstreamReturnPacket: composeF233DownstreamReturnPacket(),
      localEvents: clone(state.localEvents),
      errors: clone(state.errors)
    };
  }

  function getReceiptText() {
    const r = getReceiptLight();
    return [
      "LAB_PRODUCT_ENGINE_MARKET_F144_REPLACEMENT_SHELL_RECEIPT",
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
      `f89Accepted=${r.f89Accepted}`,
      `marketReadinessBuilt=${r.marketReadinessBuilt}`,
      `marketReadinessStatus=${r.marketReadinessStatus}`,
      `marketReadinessScore=${r.marketReadinessScore}`,
      `riskBoundaryScore=${r.riskBoundaryScore}`,
      `f233ReturnAuthorized=${r.f233ReturnAuthorized}`,
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
    setDataset("labProductEngineMarketLoaded", "true");
    setDataset("labProductEngineMarketContract", CONTRACT);
    setDataset("labProductEngineMarketReceipt", RECEIPT);
    setDataset("labProductEngineMarketVersion", VERSION);
    setDataset("marketF144Only", "true");
    setDataset("marketMechanicalCoordinateId", MECHANICAL_COORDINATE.coordinateId);
    setDataset("marketReadinessBuilt", state.marketReadinessBuilt);
    setDataset("marketReadinessReady", state.marketReadinessReady);
    setDataset("marketReadinessStatus", state.marketReadinessStatus);
    setDataset("marketReadinessScore", state.marketReadinessScore);
    setDataset("marketRiskBoundaryScore", state.riskBoundaryScore);
    setDataset("marketF233ReturnAuthorized", state.f233ReturnAuthorized);
    setDataset("marketFibonacciSynchronizationScore", state.fibonacciSynchronizationScore);
    setDataset("marketPublicSuperiorityClaim", "false");
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
    root.MARKET_CLERK = api;

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

    root.__LAB_PRODUCT_ENGINE_MARKET_LOADED__ = true;
    root.__LAB_PRODUCT_ENGINE_MARKET_CONTRACT__ = CONTRACT;
    root.__LAB_PRODUCT_ENGINE_MARKET_RECEIPT__ = RECEIPT;
    root.__LAB_PRODUCT_ENGINE_MARKET_F144_ONLY__ = true;
    root.__LAB_PRODUCT_ENGINE_MARKET_MECHANICAL_COORDINATE__ = MECHANICAL_COORDINATE.coordinateId;
    root.__LAB_PRODUCT_ENGINE_MARKET_PUBLIC_SUPERIORITY_CLAIM__ = false;
    root.__LAB_PRODUCT_ENGINE_MARKET_WEBGL__ = false;
    root.__LAB_PRODUCT_ENGINE_MARKET_VISUAL_PASS_CLAIMED__ = false;

    updateDataset();
  }

  const api = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,

    FIBONACCI,
    STATUS,
    MECHANICAL_COORDINATE,

    readF89Authority,
    readF89Release,
    hasMeaningfulF89Release,
    validateF89Release,
    acceptF89RegistryRelease,
    receiveF89RegistryRelease: acceptF89RegistryRelease,
    submitF89RegistryRelease: acceptF89RegistryRelease,

    getF89MarketInputs,
    normalizeMarketInput,
    buildMarketReadiness,
    buildRiskBoundaries,
    computeMarketMetrics,
    computeFibonacciSynchronization,

    composeF144MarketReadinessPacket,
    composeF233DownstreamReturnPacket,
    composeF144Receipt: getReceipt,
    submitF233ReturnToNorth,

    getMechanicalCoordinatePacket,
    getMarketReadiness: () => clone(state.marketReadiness),
    getMarketReadinessSummary: () => ({
      marketReadinessBuilt: state.marketReadinessBuilt,
      marketReadinessReady: state.marketReadinessReady,
      marketReadinessStatus: state.marketReadinessStatus,
      marketRecordCount: state.marketRecordCount,
      marketReadinessScore: state.marketReadinessScore,
      riskBoundaryScore: state.riskBoundaryScore,
      f233ReturnAuthorized: state.f233ReturnAuthorized
    }),
    getMarketRecords: () => clone(state.marketReadiness.records),
    getRiskBoundaries: () => clone(state.marketReadiness.riskBoundaries),

    getReceiptLight,
    getReceipt,
    getReceiptText,
    publishGlobals,
    updateDataset,

    marketEngineF144Active: true,
    marketEngineF144Only: true,
    marketClerkActive: true,
    marketReadinessConductorActive: true,

    ownsF144MarketReadinessOutputManifold: true,
    ownsF89RegistryReleaseConsumption: true,
    ownsDeterministicMarketReadinessRecords: true,
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

    get state() { return state; }
  });

  state.createdAt = nowIso();
  state.updatedAt = state.createdAt;

  try {
    const f89 = readF89Release();
    if (hasMeaningfulF89Release(f89)) acceptF89RegistryRelease(f89);
  } catch (error) {
    recordError("INITIAL_F89_RELEASE_READ_FAILED", error);
  }

  try {
    computeFibonacciSynchronization();
  } catch (error) {
    recordError("INITIAL_F144_SYNC_FAILED", error);
  }

  recordLocal("F144_REPLACEMENT_SHELL_LOADED", {
    file: FILE,
    contract: CONTRACT,
    mechanicalCoordinate: MECHANICAL_COORDINATE.coordinateId,
    targetFile: NORTH_FILE,
    publicSuperiorityClaim: false
  });

  publishGlobals();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

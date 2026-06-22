"use strict";

/*
  product-engine.registry.js

  Replacement-shell descendant of:
  DIAGNOSTIC_RUNTIME_SHELL_FOUNDATION_v1
  AUDRALIA_RUNTIME_TABLE_v1

  Purpose:
  Define the product/runtime registry shell.

  Boundary:
  This file registers files, routes, artifacts, contracts, and receipts.
  It does not own product-engine authority.
  It does not validate telemetry integrity.
  It does not evaluate the kernel.
  It does not render website output.
  It does not authorize production, deployment, or public release.
*/

const AUDRALIA_PRODUCT_ENGINE_REGISTRY_v1 = (() => {
  const FOUNDATION_ID = "DIAGNOSTIC_RUNTIME_SHELL_FOUNDATION_v1";
  const RUNTIME_TABLE_ID = "AUDRALIA_RUNTIME_TABLE_v1";

  const FOUNDATION =
    typeof globalThis !== "undefined" &&
    globalThis.DIAGNOSTIC_RUNTIME_SHELL_FOUNDATION_v1
      ? globalThis.DIAGNOSTIC_RUNTIME_SHELL_FOUNDATION_v1
      : typeof require === "function"
        ? require("./runtime-shell.foundation.js")
        : null;

  const RUNTIME_TABLE =
    typeof globalThis !== "undefined" &&
    globalThis.AUDRALIA_RUNTIME_TABLE_v1
      ? globalThis.AUDRALIA_RUNTIME_TABLE_v1
      : typeof require === "function"
        ? require("./runtime-table.js")
        : null;

  const META = Object.freeze({
    artifactId: "AUDRALIA_PRODUCT_ENGINE_REGISTRY_v1",
    filename: "product-engine.registry.js",
    artifactClass: "PRODUCT_ENGINE_REGISTRY_REPLACEMENT_SHELL",
    payloadVersion: "1.0.0-replacement-shell-descendant",
    status: "DRAFT_FOR_REVIEW_ONLY",

    foundationId: FOUNDATION_ID,
    runtimeTableId: RUNTIME_TABLE_ID,
    foundationRequired: true,
    runtimeTableRequired: true,

    official: false,
    canonical: false,
    admissionEffect: "NONE",
    governingEffect: "NONE",
    kernelModified: false,
    deploymentAuthorized: false,
    productionAuthorized: false,
    publicReleaseAuthorized: false,

    registryBoundary: Object.freeze({
      registryRole: "FILE_ROUTE_ARTIFACT_CONTRACT_AND_RECEIPT_INDEX",
      thisFileIsProductEngineRoot: false,
      thisFileIsEntireDiagnosticEngine: false,
      thisFileIsAllOfEngine1: false,
      thisFileReplacesRuntimeTable: false,
      thisFileReplacesEngine2TelemetryIntegrity: false,
      thisFileReplacesEngines2Through4: false,
      thisFileValidatesTelemetryIntegrity: false,
      thisFileEvaluatesKernel: false,
      thisFileRendersWebsiteOutput: false,
      thisFileAuthorizesProduction: false,
      rule:
        "The registry indexes runtime artifacts and receipts. It does not become the product-engine root, evaluate diagnostics, validate telemetry, render output, or authorize release."
    }),

    legacyPrecedentUse: Object.freeze({
      sourcePrecedent: "/assets/lab/product-engine.registry.js",
      preservedAsPrecedent: Object.freeze([
        "project registry conductor concept",
        "file registry",
        "route registry",
        "contract registry",
        "receipt registry",
        "artifact registration",
        "market-input preparation precedent",
        "lookup/index functions",
        "forbidden-claim rejection",
        "non-rendering protections"
      ]),
      notPreservedAsControllingAuthority: Object.freeze([
        "Fibonacci as mandatory runtime law",
        "mechanical-coordinate governance",
        "Registry Clerk authority",
        "Product Engine ownership",
        "Expression ownership",
        "Market authority",
        "North latch authority",
        "Canvas evidence ownership",
        "planet or Hearth ownership",
        "public superiority claims"
      ]),
      rule:
        "Legacy registry structure supplies registry-shell clues, not dependency authority."
    })
  });

  const STATUS = Object.freeze({
    READY: "READY",
    HELD: "HELD",
    DEGRADED: "DEGRADED",
    REJECTED: "REJECTED"
  });

  const RECORD_TYPES = Object.freeze({
    FILE: "FILE",
    ROUTE: "ROUTE",
    ARTIFACT: "ARTIFACT",
    CONTRACT: "CONTRACT",
    RECEIPT: "RECEIPT",
    EXPORT: "EXPORT",
    DEPENDENCY: "DEPENDENCY",
    MARKET_INPUT: "MARKET_INPUT"
  });

  const FAILURE_STATES = Object.freeze([
    "FOUNDATION_UNAVAILABLE",
    "RUNTIME_TABLE_UNAVAILABLE",
    "INVALID_REGISTRY_RECORD",
    "FORBIDDEN_CLAIM_DETECTED",
    "DUPLICATE_RECORD_CONFLICT",
    "UNKNOWN_RECORD_TYPE"
  ]);

  const state = {
    registryStatus: STATUS.READY,
    records: [],
    rejectedRecords: [],
    receipts: [],
    indexes: {
      byType: {},
      byFile: {},
      byRoute: {},
      byArtifact: {},
      byContract: {},
      byReceipt: {},
      byStatus: {}
    },
    createdAt: nowIso(),
    updatedAt: nowIso()
  };

  function nowIso() {
    return new Date().toISOString();
  }

  function required(condition, code) {
    if (!condition) throw new Error(code);
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function freezeClone(value) {
    return Object.freeze(clone(value));
  }

  function makeId(value, fallback) {
    const raw = String(value || fallback || "record")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    return raw || fallback || "record";
  }

  function foundationAvailable() {
    return Boolean(FOUNDATION && typeof FOUNDATION.validateDescendantDeclaration === "function");
  }

  function runtimeTableAvailable() {
    return Boolean(RUNTIME_TABLE && typeof RUNTIME_TABLE.inspectSync === "function");
  }

  function containsForbiddenClaim(packet) {
    const text = JSON.stringify(packet || {});
    return [
      '"official":true',
      '"canonical":true',
      '"kernelModified":true',
      '"deploymentAuthorized":true',
      '"productionAuthorized":true',
      '"publicReleaseAuthorized":true',
      '"thisFileIsProductEngineRoot":true',
      '"thisFileIsEntireDiagnosticEngine":true',
      '"thisFileIsAllOfEngine1":true',
      '"thisFileValidatesTelemetryIntegrity":true',
      '"thisFileEvaluatesKernel":true',
      '"thisFileRendersWebsiteOutput":true',
      '"thisFileAuthorizesProduction":true',
      '"generatedImage":true',
      '"graphicBox":true',
      '"webGL":true',
      '"visualPassClaimed":true',
      '"publicSuperiorityClaim":true'
    ].some(fragment => text.includes(fragment));
  }

  function makeReceipt(input) {
    const receipt = Object.freeze({
      receiptId:
        "PRODUCT_ENGINE_REGISTRY_RECEIPT_" +
        String(Date.now()) +
        "_" +
        Math.random().toString(36).slice(2, 10).toUpperCase(),
      artifactId: META.artifactId,
      foundationId: META.foundationId,
      runtimeTableId: META.runtimeTableId,
      accepted: input.accepted === true,
      recordType: input.recordType || "",
      recordId: input.recordId || "",
      outputStatus: input.outputStatus || "",
      failureReasons: Object.freeze(input.failureReasons || []),
      timestamp: nowIso(),

      kernelModified: false,
      productionAuthorized: false,
      deploymentAuthorized: false,
      publicReleaseAuthorized: false
    });

    state.receipts.push(receipt);
    state.updatedAt = receipt.timestamp;
    return receipt;
  }

  function normalizeRecord(input) {
    const source = isObject(input) ? input : { value: input };
    const recordType = String(source.recordType || source.type || RECORD_TYPES.ARTIFACT).toUpperCase();

    required(
      Object.values(RECORD_TYPES).includes(recordType),
      "UNKNOWN_RECORD_TYPE"
    );

    const recordId = makeId(
      source.recordId ||
        source.artifactId ||
        source.file ||
        source.route ||
        source.contract ||
        source.receipt ||
        `${recordType}_${state.records.length + state.rejectedRecords.length + 1}`,
      `${recordType}_${state.records.length + state.rejectedRecords.length + 1}`
    );

    return Object.freeze({
      recordId,
      recordType,
      artifactId: source.artifactId || "",
      file: source.file || source.filename || "",
      route: source.route || routeFromFile(source.file || source.filename || ""),
      contract: source.contract || source.contractId || "",
      receipt: source.receipt || source.receiptId || "",
      exportName: source.exportName || "",
      dependencyId: source.dependencyId || source.foundationId || "",
      status: source.status || STATUS.READY,
      description: source.description || "",
      source: freezeClone(source),
      forbiddenClaimDetected: containsForbiddenClaim(source),
      registeredAt: nowIso(),

      official: false,
      canonical: false,
      kernelModified: false,
      productionAuthorized: false,
      deploymentAuthorized: false,
      publicReleaseAuthorized: false
    });
  }

  function routeFromFile(file) {
    const value = String(file || "");
    if (!value) return "";
    return value
      .replace(/^\/?assets\/lab\//, "")
      .replace(/\.js$/, "")
      .replace(/[^a-zA-Z0-9._-]+/g, "-");
  }

  function indexRecord(record) {
    const add = (bucket, key, id) => {
      if (!key) return;
      const normalized = String(key);
      bucket[normalized] = bucket[normalized] || [];
      if (!bucket[normalized].includes(id)) bucket[normalized].push(id);
    };

    add(state.indexes.byType, record.recordType, record.recordId);
    add(state.indexes.byFile, record.file, record.recordId);
    add(state.indexes.byRoute, record.route, record.recordId);
    add(state.indexes.byArtifact, record.artifactId, record.recordId);
    add(state.indexes.byContract, record.contract, record.recordId);
    add(state.indexes.byReceipt, record.receipt, record.recordId);
    add(state.indexes.byStatus, record.status, record.recordId);
  }

  function register(input) {
    let record;

    try {
      record = normalizeRecord(input);
    } catch (error) {
      return makeReceipt({
        accepted: false,
        recordType: "",
        recordId: "",
        outputStatus: error.message || "INVALID_REGISTRY_RECORD",
        failureReasons: [error.message || "INVALID_REGISTRY_RECORD"]
      });
    }

    if (record.forbiddenClaimDetected) {
      state.rejectedRecords.push(record);
      return makeReceipt({
        accepted: false,
        recordType: record.recordType,
        recordId: record.recordId,
        outputStatus: "FORBIDDEN_CLAIM_DETECTED",
        failureReasons: ["FORBIDDEN_CLAIM_DETECTED"]
      });
    }

    const existing = state.records.find(item => item.recordId === record.recordId);

    if (existing) {
      state.rejectedRecords.push(record);
      return makeReceipt({
        accepted: false,
        recordType: record.recordType,
        recordId: record.recordId,
        outputStatus: "DUPLICATE_RECORD_CONFLICT",
        failureReasons: ["DUPLICATE_RECORD_CONFLICT"]
      });
    }

    state.records.push(record);
    indexRecord(record);
    state.updatedAt = nowIso();

    return makeReceipt({
      accepted: true,
      recordType: record.recordType,
      recordId: record.recordId,
      outputStatus: "REGISTERED",
      failureReasons: []
    });
  }

  function registerFile(file, extra) {
    return register({
      ...(extra || {}),
      recordType: RECORD_TYPES.FILE,
      file,
      route: routeFromFile(file)
    });
  }

  function registerRoute(route, extra) {
    return register({
      ...(extra || {}),
      recordType: RECORD_TYPES.ROUTE,
      route
    });
  }

  function registerArtifact(artifactId, extra) {
    return register({
      ...(extra || {}),
      recordType: RECORD_TYPES.ARTIFACT,
      artifactId
    });
  }

  function registerContract(contract, extra) {
    return register({
      ...(extra || {}),
      recordType: RECORD_TYPES.CONTRACT,
      contract
    });
  }

  function registerReceipt(receipt, extra) {
    return register({
      ...(extra || {}),
      recordType: RECORD_TYPES.RECEIPT,
      receipt
    });
  }

  function registerDependency(dependencyId, extra) {
    return register({
      ...(extra || {}),
      recordType: RECORD_TYPES.DEPENDENCY,
      dependencyId
    });
  }

  function getRecord(recordId) {
    return freezeClone(
      state.records.find(record => record.recordId === recordId) || null
    );
  }

  function lookupByType(recordType) {
    const ids = state.indexes.byType[String(recordType || "").toUpperCase()] || [];
    return freezeClone(ids.map(id => state.records.find(record => record.recordId === id)).filter(Boolean));
  }

  function lookupByFile(file) {
    const ids = state.indexes.byFile[String(file || "")] || [];
    return freezeClone(ids.map(id => state.records.find(record => record.recordId === id)).filter(Boolean));
  }

  function lookupByRoute(route) {
    const ids = state.indexes.byRoute[String(route || "")] || [];
    return freezeClone(ids.map(id => state.records.find(record => record.recordId === id)).filter(Boolean));
  }

  function lookupByContract(contract) {
    const ids = state.indexes.byContract[String(contract || "")] || [];
    return freezeClone(ids.map(id => state.records.find(record => record.recordId === id)).filter(Boolean));
  }

  function lookupByReceipt(receipt) {
    const ids = state.indexes.byReceipt[String(receipt || "")] || [];
    return freezeClone(ids.map(id => state.records.find(record => record.recordId === id)).filter(Boolean));
  }

  function createMarketInputRecords() {
    return freezeClone(
      state.records
        .filter(record =>
          record.recordType === RECORD_TYPES.FILE ||
          record.recordType === RECORD_TYPES.ROUTE ||
          record.recordType === RECORD_TYPES.ARTIFACT ||
          record.recordType === RECORD_TYPES.CONTRACT ||
          record.recordType === RECORD_TYPES.RECEIPT
        )
        .map(record => ({
          recordType: RECORD_TYPES.MARKET_INPUT,
          sourceRecordId: record.recordId,
          file: record.file,
          route: record.route,
          artifactId: record.artifactId,
          contract: record.contract,
          receipt: record.receipt,
          readinessStatus: record.status,
          productionAuthorized: false,
          deploymentAuthorized: false,
          publicReleaseAuthorized: false
        }))
    );
  }

  function seedKnownRuntimeFamily() {
    const files = [
      "runtime-shell.foundation.js",
      "runtime-table.js",
      "runtime-table.east.js",
      "runtime-table.south.js",
      "runtime-table.west.js",
      "product-engine.registry.js"
    ];

    return Object.freeze({
      seeded: true,
      receipts: Object.freeze(files.map(file => registerFile(file, {
        description: "Known replacement-shell family file."
      })))
    });
  }

  function validateFoundationCompatibility() {
    required(foundationAvailable(), "FOUNDATION_UNAVAILABLE");

    const result = FOUNDATION.validateDescendantDeclaration({
      filename: META.filename,
      artifactId: META.artifactId,
      foundationId: META.foundationId,
      kernelModified: META.kernelModified,
      productionAuthorized: META.productionAuthorized,
      deploymentAuthorized: META.deploymentAuthorized,
      publicReleaseAuthorized: META.publicReleaseAuthorized
    });

    required(result && result.pass === true, "FOUNDATION_COMPATIBILITY_FAILURE");

    return Object.freeze({
      pass: true,
      foundationId: META.foundationId
    });
  }

  function validateRuntimeTableCompatibility() {
    required(runtimeTableAvailable(), "RUNTIME_TABLE_UNAVAILABLE");
    required(
      RUNTIME_TABLE.artifactId === META.runtimeTableId,
      "RUNTIME_TABLE_ID_MISMATCH"
    );

    return Object.freeze({
      pass: true,
      runtimeTableId: META.runtimeTableId
    });
  }

  function inspectSync() {
    return Object.freeze({
      artifactId: META.artifactId,
      filename: META.filename,
      status: META.status,
      foundationAvailable: foundationAvailable(),
      runtimeTableAvailable: runtimeTableAvailable(),
      recordCount: state.records.length,
      rejectedRecordCount: state.rejectedRecords.length,
      receiptCount: state.receipts.length,
      registryBoundary: META.registryBoundary,
      official: META.official,
      canonical: META.canonical,
      kernelModified: META.kernelModified,
      productionAuthorized: META.productionAuthorized,
      deploymentAuthorized: META.deploymentAuthorized,
      publicReleaseAuthorized: META.publicReleaseAuthorized,
      shortestTrueRead:
        "Product-engine registry shell. It indexes files, routes, artifacts, contracts, and receipts. It is not the product-engine root, does not validate telemetry, does not evaluate the kernel, and does not authorize release."
    });
  }

  function validateSync() {
    required(META.official === false, "OFFICIAL_STATUS_FORBIDDEN");
    required(META.canonical === false, "CANONICAL_STATUS_FORBIDDEN");
    required(META.admissionEffect === "NONE", "ADMISSION_EFFECT_FORBIDDEN");
    required(META.governingEffect === "NONE", "GOVERNING_EFFECT_FORBIDDEN");
    required(META.kernelModified === false, "KERNEL_MODIFICATION_FORBIDDEN");
    required(META.productionAuthorized === false, "PRODUCTION_AUTHORIZATION_FORBIDDEN");
    required(META.deploymentAuthorized === false, "DEPLOYMENT_AUTHORIZATION_FORBIDDEN");
    required(META.publicReleaseAuthorized === false, "PUBLIC_RELEASE_AUTHORIZATION_FORBIDDEN");

    required(META.registryBoundary.thisFileIsProductEngineRoot === false, "REGISTRY_PRODUCT_ENGINE_ROOT_CLAIM_FORBIDDEN");
    required(META.registryBoundary.thisFileIsEntireDiagnosticEngine === false, "REGISTRY_FALSE_COMPLETION_CLAIM_FORBIDDEN");
    required(META.registryBoundary.thisFileIsAllOfEngine1 === false, "REGISTRY_ENGINE_1_TOTALITY_CLAIM_FORBIDDEN");
    required(META.registryBoundary.thisFileReplacesRuntimeTable === false, "REGISTRY_RUNTIME_TABLE_REPLACEMENT_CLAIM_FORBIDDEN");
    required(META.registryBoundary.thisFileReplacesEngine2TelemetryIntegrity === false, "REGISTRY_ENGINE_2_REPLACEMENT_CLAIM_FORBIDDEN");
    required(META.registryBoundary.thisFileReplacesEngines2Through4 === false, "REGISTRY_ENGINE_2_THROUGH_4_REPLACEMENT_CLAIM_FORBIDDEN");
    required(META.registryBoundary.thisFileValidatesTelemetryIntegrity === false, "REGISTRY_TELEMETRY_VALIDATION_CLAIM_FORBIDDEN");
    required(META.registryBoundary.thisFileEvaluatesKernel === false, "REGISTRY_KERNEL_EVALUATION_CLAIM_FORBIDDEN");
    required(META.registryBoundary.thisFileRendersWebsiteOutput === false, "REGISTRY_RENDERING_CLAIM_FORBIDDEN");
    required(META.registryBoundary.thisFileAuthorizesProduction === false, "REGISTRY_PRODUCTION_AUTHORIZATION_CLAIM_FORBIDDEN");

    validateFoundationCompatibility();
    validateRuntimeTableCompatibility();

    return Object.freeze({
      pass: true,
      artifactId: META.artifactId,
      filename: META.filename,
      foundationId: META.foundationId,
      runtimeTableId: META.runtimeTableId,
      registryBoundaryPreserved: true,
      recordIndexingPreserved: true,
      releaseAuthorityDenied: true,
      kernelModified: false,
      productionAuthorized: false,
      deploymentAuthorized: false,
      publicReleaseAuthorized: false
    });
  }

  return Object.freeze({
    ...META,
    STATUS,
    RECORD_TYPES,
    FAILURE_STATES,
    normalizeRecord,
    register,
    registerFile,
    registerRoute,
    registerArtifact,
    registerContract,
    registerReceipt,
    registerDependency,
    getRecord,
    lookupByType,
    lookupByFile,
    lookupByRoute,
    lookupByContract,
    lookupByReceipt,
    createMarketInputRecords,
    seedKnownRuntimeFamily,
    validateFoundationCompatibility,
    validateRuntimeTableCompatibility,
    inspectSync,
    validateSync,
    get state() {
      return state;
    }
  });
})();

if (typeof globalThis !== "undefined") {
  globalThis.AUDRALIA_PRODUCT_ENGINE_REGISTRY_v1 =
    AUDRALIA_PRODUCT_ENGINE_REGISTRY_v1;
  globalThis.PRODUCT_ENGINE_REGISTRY =
    AUDRALIA_PRODUCT_ENGINE_REGISTRY_v1;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = AUDRALIA_PRODUCT_ENGINE_REGISTRY_v1;
}

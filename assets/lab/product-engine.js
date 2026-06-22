"use strict";

/*
  product-engine.js

  Replacement-shell descendant of:
  DIAGNOSTIC_RUNTIME_SHELL_FOUNDATION_v1
  AUDRALIA_RUNTIME_TABLE_v1
  AUDRALIA_PRODUCT_ENGINE_REGISTRY_v1

  Purpose:
  Define the bounded product-engine shell.

  Boundary:
  This file defines product-engine identity, product registration, graph receipts,
  and registry handoff hooks. It is not the hidden root of the diagnostic track.
  It does not validate telemetry integrity, evaluate the kernel, render output,
  or authorize production, deployment, or public release.
*/

const AUDRALIA_PRODUCT_ENGINE_v1 = (() => {
  const FOUNDATION_ID = "DIAGNOSTIC_RUNTIME_SHELL_FOUNDATION_v1";
  const RUNTIME_TABLE_ID = "AUDRALIA_RUNTIME_TABLE_v1";
  const REGISTRY_ID = "AUDRALIA_PRODUCT_ENGINE_REGISTRY_v1";

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

  const REGISTRY =
    typeof globalThis !== "undefined" &&
    globalThis.AUDRALIA_PRODUCT_ENGINE_REGISTRY_v1
      ? globalThis.AUDRALIA_PRODUCT_ENGINE_REGISTRY_v1
      : typeof require === "function"
        ? require("./product-engine.registry.js")
        : null;

  const META = Object.freeze({
    artifactId: "AUDRALIA_PRODUCT_ENGINE_v1",
    filename: "product-engine.js",
    artifactClass: "PRODUCT_ENGINE_REPLACEMENT_SHELL",
    payloadVersion: "1.0.0-replacement-shell-descendant",
    status: "DRAFT_FOR_REVIEW_ONLY",

    foundationId: FOUNDATION_ID,
    runtimeTableId: RUNTIME_TABLE_ID,
    registryId: REGISTRY_ID,

    official: false,
    canonical: false,
    admissionEffect: "NONE",
    governingEffect: "NONE",
    kernelModified: false,
    deploymentAuthorized: false,
    productionAuthorized: false,
    publicReleaseAuthorized: false,

    productEngineBoundary: Object.freeze({
      thisFileIsProductEngineShell: true,
      thisFileIsHiddenRoot: false,
      thisFileIsEntireDiagnosticEngine: false,
      thisFileIsAllOfEngine1: false,
      thisFileReplacesRuntimeTable: false,
      thisFileReplacesRegistry: false,
      thisFileReplacesEngine2TelemetryIntegrity: false,
      thisFileReplacesEngines2Through4: false,
      thisFileValidatesTelemetryIntegrity: false,
      thisFileEvaluatesKernel: false,
      thisFileRendersWebsiteOutput: false,
      thisFileAuthorizesProduction: false,
      rule:
        "The product engine defines bounded product graph identity and registry hooks only. It does not become the root of the runtime family or the diagnostic engine."
    })
  });

  const STATUS = Object.freeze({
    READY: "READY",
    HELD: "HELD",
    DEGRADED: "DEGRADED",
    REJECTED: "REJECTED"
  });

  const PRODUCT_TYPES = Object.freeze({
    RUNTIME_SHELL: "RUNTIME_SHELL",
    SUPPORT_SHELL: "SUPPORT_SHELL",
    REGISTRY_SHELL: "REGISTRY_SHELL",
    EXPRESSION_SHELL: "EXPRESSION_SHELL",
    MARKET_SHELL: "MARKET_SHELL",
    DOCUMENTATION: "DOCUMENTATION",
    DIAGNOSTIC_INTERFACE: "DIAGNOSTIC_INTERFACE"
  });

  const state = {
    products: [],
    rejectedProducts: [],
    receipts: [],
    graphBuilt: false,
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
    const raw = String(value || fallback || "product")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    return raw || fallback || "product";
  }

  function foundationAvailable() {
    return Boolean(FOUNDATION && typeof FOUNDATION.validateDescendantDeclaration === "function");
  }

  function runtimeTableAvailable() {
    return Boolean(RUNTIME_TABLE && typeof RUNTIME_TABLE.inspectSync === "function");
  }

  function registryAvailable() {
    return Boolean(REGISTRY && typeof REGISTRY.registerArtifact === "function");
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
      '"thisFileIsHiddenRoot":true',
      '"thisFileIsEntireDiagnosticEngine":true',
      '"thisFileIsAllOfEngine1":true',
      '"thisFileReplacesRuntimeTable":true',
      '"thisFileReplacesRegistry":true',
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
        "PRODUCT_ENGINE_RECEIPT_" +
        String(Date.now()) +
        "_" +
        Math.random().toString(36).slice(2, 10).toUpperCase(),
      artifactId: META.artifactId,
      foundationId: META.foundationId,
      runtimeTableId: META.runtimeTableId,
      registryId: META.registryId,
      accepted: input.accepted === true,
      productId: input.productId || "",
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

  function normalizeProduct(input) {
    const source = isObject(input) ? input : { value: input };
    const productType = String(source.productType || source.type || PRODUCT_TYPES.SUPPORT_SHELL).toUpperCase();

    required(
      Object.values(PRODUCT_TYPES).includes(productType),
      "UNKNOWN_PRODUCT_TYPE"
    );

    const productId = makeId(
      source.productId || source.artifactId || source.file || source.name,
      `${productType}_${state.products.length + state.rejectedProducts.length + 1}`
    );

    return Object.freeze({
      productId,
      productType,
      name: source.name || productId,
      artifactId: source.artifactId || productId,
      file: source.file || source.filename || "",
      route: source.route || "",
      contract: source.contract || source.contractId || "",
      receipt: source.receipt || source.receiptId || "",
      description: source.description || "",
      status: source.status || STATUS.READY,
      source: freezeClone(source),
      forbiddenClaimDetected: containsForbiddenClaim(source),
      registeredAt: nowIso(),

      official: false,
      canonical: false,
      kernelModified: false,
      productionAuthorized: false,
      deploymentAuthorized: false,
      publicReleaseAuthorized: false,
      rendersOutput: false,
      evaluatesKernel: false,
      validatesTelemetryIntegrity: false
    });
  }

  function registerProduct(input) {
    let product;

    try {
      product = normalizeProduct(input);
    } catch (error) {
      return makeReceipt({
        accepted: false,
        outputStatus: error.message || "INVALID_PRODUCT",
        failureReasons: [error.message || "INVALID_PRODUCT"]
      });
    }

    if (product.forbiddenClaimDetected) {
      state.rejectedProducts.push(product);
      return makeReceipt({
        accepted: false,
        productId: product.productId,
        outputStatus: "FORBIDDEN_CLAIM_DETECTED",
        failureReasons: ["FORBIDDEN_CLAIM_DETECTED"]
      });
    }

    const existing = state.products.find(item => item.productId === product.productId);

    if (existing) {
      state.rejectedProducts.push(product);
      return makeReceipt({
        accepted: false,
        productId: product.productId,
        outputStatus: "DUPLICATE_PRODUCT_CONFLICT",
        failureReasons: ["DUPLICATE_PRODUCT_CONFLICT"]
      });
    }

    state.products.push(product);
    state.updatedAt = nowIso();

    if (registryAvailable()) {
      REGISTRY.registerArtifact(product.artifactId, {
        file: product.file,
        route: product.route,
        contract: product.contract,
        receipt: product.receipt,
        description: product.description
      });
    }

    return makeReceipt({
      accepted: true,
      productId: product.productId,
      outputStatus: "PRODUCT_REGISTERED",
      failureReasons: []
    });
  }

  function seedKnownProducts() {
    const entries = [
      {
        productId: "runtime_shell_foundation",
        productType: PRODUCT_TYPES.RUNTIME_SHELL,
        artifactId: FOUNDATION_ID,
        file: "runtime-shell.foundation.js",
        description: "Neutral runtime shell foundation."
      },
      {
        productId: "runtime_table",
        productType: PRODUCT_TYPES.RUNTIME_SHELL,
        artifactId: RUNTIME_TABLE_ID,
        file: "runtime-table.js",
        description: "Runtime routing and handoff table shell."
      },
      {
        productId: "runtime_table_east",
        productType: PRODUCT_TYPES.SUPPORT_SHELL,
        file: "runtime-table.east.js",
        description: "East intake branch shell."
      },
      {
        productId: "runtime_table_west",
        productType: PRODUCT_TYPES.SUPPORT_SHELL,
        file: "runtime-table.west.js",
        description: "West pressure branch shell."
      },
      {
        productId: "runtime_table_south",
        productType: PRODUCT_TYPES.SUPPORT_SHELL,
        file: "runtime-table.south.js",
        description: "South return branch shell."
      },
      {
        productId: "product_engine_registry",
        productType: PRODUCT_TYPES.REGISTRY_SHELL,
        artifactId: REGISTRY_ID,
        file: "product-engine.registry.js",
        description: "Product-engine registry shell."
      },
      {
        productId: "product_engine",
        productType: PRODUCT_TYPES.SUPPORT_SHELL,
        artifactId: META.artifactId,
        file: "product-engine.js",
        description: "Bounded product-engine shell."
      }
    ];

    return Object.freeze({
      seeded: true,
      receipts: Object.freeze(entries.map(registerProduct))
    });
  }

  function buildProductGraph() {
    const nodes = state.products.map(product => ({
      productId: product.productId,
      productType: product.productType,
      artifactId: product.artifactId,
      file: product.file,
      route: product.route,
      status: product.status
    }));

    const edges = state.products
      .filter(product => product.file)
      .map(product => ({
        from: META.artifactId,
        to: product.productId,
        relation: "REGISTERS_PRODUCT_FILE",
        file: product.file
      }));

    state.graphBuilt = true;
    state.updatedAt = nowIso();

    return Object.freeze({
      artifactId: META.artifactId,
      graphBuilt: true,
      productCount: state.products.length,
      rejectedProductCount: state.rejectedProducts.length,
      nodes: Object.freeze(nodes),
      edges: Object.freeze(edges),
      builtAt: state.updatedAt,

      kernelModified: false,
      productionAuthorized: false,
      deploymentAuthorized: false,
      publicReleaseAuthorized: false
    });
  }

  function composeRegistryHandoff() {
    return Object.freeze({
      packetType: "PRODUCT_ENGINE_TO_REGISTRY_HANDOFF",
      sourceArtifactId: META.artifactId,
      targetArtifactId: META.registryId,
      productGraph: buildProductGraph(),
      products: freezeClone(state.products),
      acceptedProductCount: state.products.length,
      rejectedProductCount: state.rejectedProducts.length,

      kernelModified: false,
      productionAuthorized: false,
      deploymentAuthorized: false,
      publicReleaseAuthorized: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      timestamp: nowIso()
    });
  }

  function submitRegistryHandoff() {
    if (!registryAvailable()) {
      return makeReceipt({
        accepted: false,
        outputStatus: "REGISTRY_UNAVAILABLE",
        failureReasons: ["REGISTRY_UNAVAILABLE"]
      });
    }

    const packet = composeRegistryHandoff();

    const receipts = packet.products.map(product =>
      REGISTRY.registerArtifact(product.artifactId, {
        file: product.file,
        route: product.route,
        contract: product.contract,
        receipt: product.receipt,
        description: product.description
      })
    );

    return Object.freeze({
      accepted: true,
      artifactId: META.artifactId,
      targetArtifactId: META.registryId,
      registryReceipts: Object.freeze(receipts),
      timestamp: nowIso(),
      productionAuthorized: false,
      deploymentAuthorized: false,
      publicReleaseAuthorized: false
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

  function validateRegistryCompatibility() {
    required(registryAvailable(), "REGISTRY_UNAVAILABLE");
    required(
      REGISTRY.artifactId === META.registryId,
      "REGISTRY_ID_MISMATCH"
    );

    return Object.freeze({
      pass: true,
      registryId: META.registryId
    });
  }

  function inspectSync() {
    return Object.freeze({
      artifactId: META.artifactId,
      filename: META.filename,
      status: META.status,
      foundationAvailable: foundationAvailable(),
      runtimeTableAvailable: runtimeTableAvailable(),
      registryAvailable: registryAvailable(),
      productCount: state.products.length,
      rejectedProductCount: state.rejectedProducts.length,
      receiptCount: state.receipts.length,
      graphBuilt: state.graphBuilt,
      productEngineBoundary: META.productEngineBoundary,
      official: META.official,
      canonical: META.canonical,
      kernelModified: META.kernelModified,
      productionAuthorized: META.productionAuthorized,
      deploymentAuthorized: META.deploymentAuthorized,
      publicReleaseAuthorized: META.publicReleaseAuthorized,
      shortestTrueRead:
        "Product-engine shell. It registers bounded product graph records and hands them to the registry. It is not the runtime root, not the diagnostic engine, and not a telemetry/kernel/rendering authority."
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

    required(META.productEngineBoundary.thisFileIsHiddenRoot === false, "PRODUCT_ENGINE_HIDDEN_ROOT_CLAIM_FORBIDDEN");
    required(META.productEngineBoundary.thisFileIsEntireDiagnosticEngine === false, "PRODUCT_ENGINE_FALSE_COMPLETION_CLAIM_FORBIDDEN");
    required(META.productEngineBoundary.thisFileIsAllOfEngine1 === false, "PRODUCT_ENGINE_ENGINE_1_TOTALITY_CLAIM_FORBIDDEN");
    required(META.productEngineBoundary.thisFileReplacesRuntimeTable === false, "PRODUCT_ENGINE_RUNTIME_TABLE_REPLACEMENT_CLAIM_FORBIDDEN");
    required(META.productEngineBoundary.thisFileReplacesRegistry === false, "PRODUCT_ENGINE_REGISTRY_REPLACEMENT_CLAIM_FORBIDDEN");
    required(META.productEngineBoundary.thisFileReplacesEngine2TelemetryIntegrity === false, "PRODUCT_ENGINE_ENGINE_2_REPLACEMENT_CLAIM_FORBIDDEN");
    required(META.productEngineBoundary.thisFileValidatesTelemetryIntegrity === false, "PRODUCT_ENGINE_TELEMETRY_VALIDATION_CLAIM_FORBIDDEN");
    required(META.productEngineBoundary.thisFileEvaluatesKernel === false, "PRODUCT_ENGINE_KERNEL_EVALUATION_CLAIM_FORBIDDEN");
    required(META.productEngineBoundary.thisFileRendersWebsiteOutput === false, "PRODUCT_ENGINE_RENDERING_CLAIM_FORBIDDEN");
    required(META.productEngineBoundary.thisFileAuthorizesProduction === false, "PRODUCT_ENGINE_PRODUCTION_AUTHORIZATION_CLAIM_FORBIDDEN");

    validateFoundationCompatibility();
    validateRuntimeTableCompatibility();
    validateRegistryCompatibility();

    return Object.freeze({
      pass: true,
      artifactId: META.artifactId,
      filename: META.filename,
      foundationId: META.foundationId,
      runtimeTableId: META.runtimeTableId,
      registryId: META.registryId,
      productEngineBoundaryPreserved: true,
      registryHandoffPreserved: true,
      hiddenRootDenied: true,
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
    PRODUCT_TYPES,
    registerProduct,
    seedKnownProducts,
    buildProductGraph,
    composeRegistryHandoff,
    submitRegistryHandoff,
    validateFoundationCompatibility,
    validateRuntimeTableCompatibility,
    validateRegistryCompatibility,
    inspectSync,
    validateSync,
    get state() {
      return state;
    }
  });
})();

if (typeof globalThis !== "undefined") {
  globalThis.AUDRALIA_PRODUCT_ENGINE_v1 = AUDRALIA_PRODUCT_ENGINE_v1;
  globalThis.PRODUCT_ENGINE = AUDRALIA_PRODUCT_ENGINE_v1;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = AUDRALIA_PRODUCT_ENGINE_v1;
}

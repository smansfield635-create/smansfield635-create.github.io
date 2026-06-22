"use strict";

const DIAGNOSTIC_RUNTIME_SHELL_FOUNDATION_v1 = (() => {
  const META = Object.freeze({
    artifactId: "DIAGNOSTIC_RUNTIME_SHELL_FOUNDATION_v1",
    filename: "runtime-shell.foundation.js",
    artifactClass: "NEUTRAL_REPLACEMENT_SHELL_FOUNDATION",
    payloadVersion: "1.0.0-draft.1",
    status: "DRAFT_FOR_REVIEW_ONLY",
    official: false,
    canonical: false,
    admissionEffect: "NONE",
    kernelModified: false,
    deploymentAuthorized: false,
    productionAuthorized: false,
    publicReleaseAuthorized: false
  });

  const FOUNDATION_CHAIN = Object.freeze([
    "AUDRALIA_FOUNDATIONAL_UNIVERSAL_DIAGNOSTIC_MATHEMATICS_KERNEL_PACKET_v2",
    "AUDRALIA_TELEMETRY_INTEGRITY_STANDARD_v1_1_DRAFT",
    "AUDRALIA_FOUR_ENGINE_RESPONSIBILITY_STANDARD_v1",
    "AUDRALIA_PRODUCTION_STANDARD_COLLABORATIVE_FOUNDATIONAL_BASE_CARRIER_v1"
  ]);

  const LEGACY_PRECEDENT_POLICY = Object.freeze({
    legacyFilenamesProvideReconstructionClues: true,
    legacyFilenamesProvideDependencyAuthority: false,
    productEngineMayNotBecomeHiddenRoot: true,
    runtimeTableMayNotBecomeHiddenRoot: true,
    overMapProductEngineOrRuntimeTableToEngine1: false,
    controllingCaution:
      "Do not over-map product-engine/runtime-table directly onto Engine 1. Treat them as precedent for shell design, routing, registry, handoff, and expression structure."
  });

  const DESCENDANT_ORDER = Object.freeze([
    "runtime-table.js",
    "runtime-table.east.js",
    "runtime-table.south.js",
    "runtime-table.west.js",
    "product-engine.registry.js",
    "product-engine.js",
    "product-engine.market.js",
    "product-engine.3d-model.*",
    "product-engine.ue5-expression.*"
  ]);

  const REQUIRED_CONTRACTS = Object.freeze({
    identityRegistryRules: Object.freeze([
      "artifactIdRequired",
      "artifactClassRequired",
      "versionRequired",
      "statusRequired",
      "ownerOrEngineBoundaryRequired",
      "legacyPrecedentMayBeReferencedButNotInheritedAsAuthority"
    ]),

    runtimeTableRules: Object.freeze([
      "runtimeEntriesMustDeclareRouteId",
      "runtimeEntriesMustDeclareSource",
      "runtimeEntriesMustDeclareTarget",
      "runtimeEntriesMustDeclareAllowedStates",
      "runtimeEntriesMustDeclareFailureStates",
      "runtimeEntriesMayNotModifyKernel",
      "runtimeEntriesMayNotAuthorizeProduction"
    ]),

    routingRules: Object.freeze([
      "routingMustUseDeclaredSourceAndTarget",
      "routingMustRejectUnknownTarget",
      "routingMustRejectUnsupportedProfile",
      "routingMustPreserveFailureStates",
      "routingMustNotBypassIntegrityReview",
      "routingMustEmitReceipt"
    ]),

    handoffRules: Object.freeze([
      "engine1MayHandoffOnlyToEngine2",
      "engine2MayHandoffAdmissibleTelemetryOnlyToEngine3",
      "engine2FailureStatesMayHandoffDirectlyToEngine4ForBoundedDisplay",
      "engine3MayHandoffDiagnosticResultOnlyToEngine4",
      "engine4MayDisplayOnlyReceivedBoundedStatus",
      "noEngineMayOverrideAnotherEngine"
    ]),

    receiptRules: Object.freeze([
      "receiptIdRequired",
      "sourceRequired",
      "targetRequired",
      "timestampRequired",
      "inputStatusRequired",
      "outputStatusRequired",
      "failureReasonsRequiredWhenFailure",
      "kernelModificationFlagMustRemainFalse"
    ]),

    stateTransitionRules: Object.freeze([
      "UNKNOWN_TO_INTAKE_RECEIVED",
      "INTAKE_RECEIVED_TO_INTEGRITY_REVIEW",
      "INTEGRITY_REVIEW_TO_ADMISSIBLE",
      "INTEGRITY_REVIEW_TO_INADMISSIBLE",
      "ADMISSIBLE_TO_KERNEL_EVALUATION",
      "KERNEL_EVALUATION_TO_RESULT_READY",
      "FAILURE_TO_BOUNDED_DISPLAY"
    ]),

    forbiddenClaims: Object.freeze([
      "OFFICIAL_STATUS",
      "CANONICAL_STATUS",
      "ADMISSION_EFFECT",
      "KERNEL_MODIFICATION",
      "PRODUCTION_AUTHORIZATION",
      "DEPLOYMENT_AUTHORIZATION",
      "PUBLIC_RELEASE_AUTHORIZATION",
      "EMPIRICAL_VALIDITY_CLAIM",
      "MEDICAL_DIAGNOSIS_CLAIM",
      "LEGAL_DETERMINATION_CLAIM",
      "AVAILABLE_SUBSET_DENOMINATOR_SUBSTITUTION",
      "SILENT_IMPUTATION",
      "SILENT_INFERENCE",
      "SILENT_CARRY_FORWARD"
    ]),

    validationExpectations: Object.freeze([
      "validateAuthorityBoundary",
      "validateFoundationChain",
      "validateLegacyPrecedentPolicy",
      "validateDescendantDeclaration",
      "validateRoutingDeclaration",
      "validateHandoffDeclaration",
      "validateReceiptDeclaration",
      "validateForbiddenClaims"
    ]),

    exportImportDiscipline: Object.freeze([
      "CommonJSExportPermitted",
      "GlobalThisExportPermitted",
      "NoImplicitDependencyRoot",
      "DescendantsMustImportOrDeclareFoundationCompatibility",
      "DescendantsMustNotMutateFoundation"
    ])
  });

  const FAILURE_STATES = Object.freeze([
    "UNEVALUABLE",
    "INTEGRITY_FAILURE",
    "PROFILE_NOT_ACTIVATED",
    "PROFILE_NOT_SUPPORTED",
    "INADMISSIBLE",
    "UNSUPPORTED_ROUTE",
    "UNKNOWN_TARGET",
    "FORBIDDEN_CLAIM_DETECTED"
  ]);

  function freezeClone(value) {
    return Object.freeze(JSON.parse(JSON.stringify(value)));
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function required(condition, code) {
    if (!condition) throw new Error(code);
  }

  function hasForbiddenClaim(object) {
    const text = JSON.stringify(object || {});
    return REQUIRED_CONTRACTS.forbiddenClaims.some(claim => text.includes(claim + ":true"));
  }

  function createReceipt(input) {
    required(input && typeof input === "object", "RECEIPT_INPUT_REQUIRED");
    required(input.source, "RECEIPT_SOURCE_REQUIRED");
    required(input.target, "RECEIPT_TARGET_REQUIRED");
    required(input.inputStatus, "RECEIPT_INPUT_STATUS_REQUIRED");
    required(input.outputStatus, "RECEIPT_OUTPUT_STATUS_REQUIRED");

    return Object.freeze({
      receiptId:
        "DRSF_RECEIPT_" +
        String(Date.now()) +
        "_" +
        Math.random().toString(36).slice(2, 10).toUpperCase(),
      foundationId: META.artifactId,
      source: input.source,
      target: input.target,
      timestamp: input.timestamp || nowIso(),
      inputStatus: input.inputStatus,
      outputStatus: input.outputStatus,
      failureReasons: Object.freeze(input.failureReasons || []),
      kernelModified: false,
      productionAuthorized: false,
      deploymentAuthorized: false,
      publicReleaseAuthorized: false
    });
  }

  function validateDescendantDeclaration(descendant) {
    required(descendant && typeof descendant === "object", "DESCENDANT_REQUIRED");
    required(descendant.filename, "DESCENDANT_FILENAME_REQUIRED");
    required(descendant.artifactId, "DESCENDANT_ARTIFACT_ID_REQUIRED");
    required(descendant.foundationId === META.artifactId, "FOUNDATION_ID_MISMATCH");
    required(descendant.kernelModified !== true, "DESCENDANT_KERNEL_MODIFICATION_FORBIDDEN");
    required(descendant.productionAuthorized !== true, "DESCENDANT_PRODUCTION_AUTHORIZATION_FORBIDDEN");
    required(descendant.deploymentAuthorized !== true, "DESCENDANT_DEPLOYMENT_AUTHORIZATION_FORBIDDEN");
    required(descendant.publicReleaseAuthorized !== true, "DESCENDANT_PUBLIC_RELEASE_AUTHORIZATION_FORBIDDEN");
    required(!hasForbiddenClaim(descendant), "DESCENDANT_FORBIDDEN_CLAIM_DETECTED");

    return Object.freeze({
      pass: true,
      descendant: descendant.filename,
      foundationId: META.artifactId
    });
  }

  function validateRoute(route) {
    required(route && typeof route === "object", "ROUTE_REQUIRED");
    required(route.routeId, "ROUTE_ID_REQUIRED");
    required(route.source, "ROUTE_SOURCE_REQUIRED");
    required(route.target, "ROUTE_TARGET_REQUIRED");
    required(Array.isArray(route.allowedStates), "ROUTE_ALLOWED_STATES_REQUIRED");
    required(Array.isArray(route.failureStates), "ROUTE_FAILURE_STATES_REQUIRED");
    required(route.kernelModified !== true, "ROUTE_KERNEL_MODIFICATION_FORBIDDEN");
    required(route.productionAuthorized !== true, "ROUTE_PRODUCTION_AUTHORIZATION_FORBIDDEN");

    return Object.freeze({
      pass: true,
      routeId: route.routeId,
      source: route.source,
      target: route.target
    });
  }

  function inspectSync() {
    return Object.freeze({
      artifactId: META.artifactId,
      filename: META.filename,
      status: META.status,
      official: META.official,
      canonical: META.canonical,
      kernelModified: META.kernelModified,
      productionAuthorized: META.productionAuthorized,
      descendantCount: DESCENDANT_ORDER.length,
      controllingCaution: LEGACY_PRECEDENT_POLICY.controllingCaution,
      shortestTrueRead:
        "Neutral runtime-shell foundation for replacement-shell construction. Legacy filenames are precedent clues, not dependency authority."
    });
  }

  function validateSync() {
    required(META.official === false, "OFFICIAL_STATUS_FORBIDDEN");
    required(META.canonical === false, "CANONICAL_STATUS_FORBIDDEN");
    required(META.admissionEffect === "NONE", "ADMISSION_EFFECT_FORBIDDEN");
    required(META.kernelModified === false, "KERNEL_MODIFICATION_FORBIDDEN");
    required(META.productionAuthorized === false, "PRODUCTION_AUTHORIZATION_FORBIDDEN");
    required(META.deploymentAuthorized === false, "DEPLOYMENT_AUTHORIZATION_FORBIDDEN");
    required(META.publicReleaseAuthorized === false, "PUBLIC_RELEASE_AUTHORIZATION_FORBIDDEN");

    required(
      LEGACY_PRECEDENT_POLICY.legacyFilenamesProvideReconstructionClues === true,
      "LEGACY_CLUE_POLICY_MISSING"
    );

    required(
      LEGACY_PRECEDENT_POLICY.legacyFilenamesProvideDependencyAuthority === false,
      "LEGACY_DEPENDENCY_AUTHORITY_FORBIDDEN"
    );

    required(
      LEGACY_PRECEDENT_POLICY.productEngineMayNotBecomeHiddenRoot === true,
      "PRODUCT_ENGINE_HIDDEN_ROOT_PROTECTION_MISSING"
    );

    required(
      LEGACY_PRECEDENT_POLICY.runtimeTableMayNotBecomeHiddenRoot === true,
      "RUNTIME_TABLE_HIDDEN_ROOT_PROTECTION_MISSING"
    );

    required(
      Array.isArray(DESCENDANT_ORDER) && DESCENDANT_ORDER.length === 9,
      "DESCENDANT_ORDER_MISMATCH"
    );

    required(
      DESCENDANT_ORDER[0] === "runtime-table.js",
      "FIRST_DESCENDANT_ORDER_FAILURE"
    );

    required(
      REQUIRED_CONTRACTS.handoffRules.includes("noEngineMayOverrideAnotherEngine"),
      "ENGINE_OVERRIDE_PROTECTION_MISSING"
    );

    return Object.freeze({
      pass: true,
      artifactId: META.artifactId,
      filename: META.filename,
      status: META.status,
      foundationChainPreserved: true,
      legacyPrecedentPolicyPreserved: true,
      descendantOrderPreserved: true,
      forbiddenClaimsPreserved: true,
      kernelModified: false,
      productionAuthorized: false,
      deploymentAuthorized: false,
      publicReleaseAuthorized: false
    });
  }

  return Object.freeze({
    ...META,
    foundationChain: FOUNDATION_CHAIN,
    legacyPrecedentPolicy: LEGACY_PRECEDENT_POLICY,
    descendantOrder: DESCENDANT_ORDER,
    requiredContracts: REQUIRED_CONTRACTS,
    failureStates: FAILURE_STATES,
    createReceipt,
    validateDescendantDeclaration,
    validateRoute,
    inspectSync,
    validateSync,
    freezeClone
  });
})();

if (typeof globalThis !== "undefined") {
  globalThis.DIAGNOSTIC_RUNTIME_SHELL_FOUNDATION_v1 =
    DIAGNOSTIC_RUNTIME_SHELL_FOUNDATION_v1;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = DIAGNOSTIC_RUNTIME_SHELL_FOUNDATION_v1;
}

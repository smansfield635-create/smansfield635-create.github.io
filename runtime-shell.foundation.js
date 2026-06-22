"use strict";

const DIAGNOSTIC_RUNTIME_SHELL_FOUNDATION_v1 = (() => {
  const META = Object.freeze({
    artifactId: "DIAGNOSTIC_RUNTIME_SHELL_FOUNDATION_v1",
    filename: "runtime-shell.foundation.js",
    artifactClass: "NEUTRAL_REPLACEMENT_SHELL_FOUNDATION",
    payloadVersion: "1.1.0-draft.2-scope-hardened",
    status: "DRAFT_FOR_REVIEW_ONLY",

    official: false,
    canonical: false,
    admissionEffect: "NONE",
    governingEffect: "NONE",
    kernelModified: false,
    deploymentAuthorized: false,
    productionAuthorized: false,
    publicReleaseAuthorized: false,

    fourEngineScopeBoundary: Object.freeze({
      thisFamilyScope:
        "RUNTIME_REGISTRY_ROUTING_AND_EXPRESSION_PRECEDENT_REPLACEMENT_SHELL_FAMILY",
      thisFamilyIsEntireDiagnosticEngine: false,
      thisFamilyIsAllOfEngine1: false,
      thisFamilyReplacesEngines2Through4: false,
      remainingEngineFamiliesRequired: Object.freeze([
        "ENGINE_2_TELEMETRY_INTEGRITY_ADMISSIBILITY_AND_VALIDATION_FAMILY",
        "ENGINE_3_KERNEL_MATHEMATICS_COLLAPSE_EVALUATION_FAMILY",
        "ENGINE_4_PRESENTATION_BOUNDED_DISPLAY_AND_EXPRESSION_FAMILY"
      ]),
      rule:
        "This foundation starts the first replacement-shell family only. It does not complete the four-engine diagnostic architecture."
    })
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
      "Do not over-map product-engine/runtime-table directly onto Engine 1. Treat them as precedent for shell design, routing, registry, handoff, and expression structure.",
    governingPremise:
      "Legacy filenames provide reconstruction clues, not dependency authority."
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

  const FAILURE_STATES = Object.freeze([
    "UNEVALUABLE",
    "INTEGRITY_FAILURE",
    "PROFILE_NOT_ACTIVATED",
    "PROFILE_NOT_SUPPORTED",
    "INADMISSIBLE",
    "UNSUPPORTED_ROUTE",
    "UNKNOWN_TARGET",
    "FORBIDDEN_CLAIM_DETECTED",
    "SCOPE_FALSE_COMPLETION_CLAIM_FORBIDDEN"
  ]);

  const REQUIRED_CONTRACTS = Object.freeze({
    identityRegistryRules: Object.freeze([
      "artifactIdRequired",
      "artifactClassRequired",
      "versionRequired",
      "statusRequired",
      "ownerOrEngineBoundaryRequired",
      "foundationCompatibilityRequired",
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
      "GOVERNING_EFFECT",
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
      "SILENT_CARRY_FORWARD",
      "ENTIRE_DIAGNOSTIC_ENGINE_CLAIM",
      "ALL_ENGINE_1_CLAIM",
      "ENGINE_2_THROUGH_4_REPLACEMENT_CLAIM"
    ]),

    validationExpectations: Object.freeze([
      "validateAuthorityBoundary",
      "validateFourEngineScopeBoundary",
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

  function required(condition, code) {
    if (!condition) throw new Error(code);
  }

  function freezeClone(value) {
    return Object.freeze(JSON.parse(JSON.stringify(value)));
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function containsForbiddenBooleanClaim(object) {
    const text = JSON.stringify(object || {});
    return [
      '"official":true',
      '"canonical":true',
      '"kernelModified":true',
      '"deploymentAuthorized":true',
      '"productionAuthorized":true',
      '"publicReleaseAuthorized":true',
      '"thisFamilyIsEntireDiagnosticEngine":true',
      '"thisFamilyIsAllOfEngine1":true',
      '"thisFamilyReplacesEngines2Through4":true'
    ].some(fragment => text.includes(fragment));
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
    required(!containsForbiddenBooleanClaim(descendant), "DESCENDANT_FORBIDDEN_CLAIM_DETECTED");

    return Object.freeze({
      pass: true,
      descendant: descendant.filename,
      foundationId: META.artifactId,
      familyScope: META.fourEngineScopeBoundary.thisFamilyScope
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
    required(!containsForbiddenBooleanClaim(route), "ROUTE_FORBIDDEN_CLAIM_DETECTED");

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
      admissionEffect: META.admissionEffect,
      kernelModified: META.kernelModified,
      productionAuthorized: META.productionAuthorized,
      deploymentAuthorized: META.deploymentAuthorized,
      publicReleaseAuthorized: META.publicReleaseAuthorized,
      fourEngineScopeBoundary: META.fourEngineScopeBoundary,
      descendantCount: DESCENDANT_ORDER.length,
      controllingCaution: LEGACY_PRECEDENT_POLICY.controllingCaution,
      shortestTrueRead:
        "Neutral runtime-shell foundation for the first replacement-shell family only. Legacy filenames are precedent clues, not dependency authority. This does not complete the four-engine diagnostic architecture."
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

    required(
      META.fourEngineScopeBoundary?.thisFamilyIsEntireDiagnosticEngine === false,
      "SCOPE_FALSE_COMPLETION_CLAIM_FORBIDDEN"
    );

    required(
      META.fourEngineScopeBoundary?.thisFamilyIsAllOfEngine1 === false,
      "SCOPE_ENGINE_1_TOTALITY_CLAIM_FORBIDDEN"
    );

    required(
      META.fourEngineScopeBoundary?.thisFamilyReplacesEngines2Through4 === false,
      "SCOPE_ENGINE_2_THROUGH_4_REPLACEMENT_CLAIM_FORBIDDEN"
    );

    required(
      Array.isArray(META.fourEngineScopeBoundary.remainingEngineFamiliesRequired) &&
        META.fourEngineScopeBoundary.remainingEngineFamiliesRequired.length === 3,
      "REMAINING_ENGINE_FAMILIES_REQUIRED_DECLARATION_MISSING"
    );

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
      LEGACY_PRECEDENT_POLICY.overMapProductEngineOrRuntimeTableToEngine1 === false,
      "PRODUCT_ENGINE_RUNTIME_TABLE_ENGINE_1_OVERMAP_FORBIDDEN"
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

    required(
      !containsForbiddenBooleanClaim(META),
      "META_FORBIDDEN_BOOLEAN_CLAIM_DETECTED"
    );

    return Object.freeze({
      pass: true,
      artifactId: META.artifactId,
      filename: META.filename,
      status: META.status,
      foundationChainPreserved: true,
      legacyPrecedentPolicyPreserved: true,
      fourEngineScopeBoundaryPreserved: true,
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

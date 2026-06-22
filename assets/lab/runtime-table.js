"use strict";

/*
  runtime-table.js

  Replacement-shell descendant of:
  DIAGNOSTIC_RUNTIME_SHELL_FOUNDATION_v1

  Purpose:
  Define the neutral runtime route table and handoff gate for the first
  replacement-shell family.

  Boundary:
  This file does not complete the diagnostic engine.
  This file is not all of Engine 1.
  This file does not replace Engines 2 through 4.
  This file does not evaluate the kernel.
  This file does not validate telemetry integrity.
  This file does not render website output.
*/

const AUDRALIA_RUNTIME_TABLE_v1 = (() => {
  const FOUNDATION_ID = "DIAGNOSTIC_RUNTIME_SHELL_FOUNDATION_v1";

  const FOUNDATION =
    typeof globalThis !== "undefined" &&
    globalThis.DIAGNOSTIC_RUNTIME_SHELL_FOUNDATION_v1
      ? globalThis.DIAGNOSTIC_RUNTIME_SHELL_FOUNDATION_v1
      : typeof require === "function"
        ? require("./runtime-shell.foundation.js")
        : null;

  const META = Object.freeze({
    artifactId: "AUDRALIA_RUNTIME_TABLE_v1",
    filename: "runtime-table.js",
    artifactClass: "RUNTIME_ROUTE_TABLE_AND_HANDOFF_GATE",
    payloadVersion: "1.0.0-replacement-shell-descendant",
    status: "DRAFT_FOR_REVIEW_ONLY",

    foundationId: FOUNDATION_ID,
    foundationRequired: true,
    descendantOfNeutralRuntimeShellFoundation: true,

    official: false,
    canonical: false,
    admissionEffect: "NONE",
    governingEffect: "NONE",
    kernelModified: false,
    deploymentAuthorized: false,
    productionAuthorized: false,
    publicReleaseAuthorized: false,

    scopeBoundary: Object.freeze({
      thisFileIsEntireDiagnosticEngine: false,
      thisFileIsAllOfEngine1: false,
      thisFileReplacesEngines2Through4: false,
      thisFileEvaluatesKernel: false,
      thisFileValidatesTelemetryIntegrity: false,
      thisFileRendersWebsiteOutput: false,
      rule:
        "This file defines runtime routes, transition gates, and handoff receipts only."
    }),

    legacyPrecedentUse: Object.freeze({
      sourcePrecedent: "/assets/lab/runtime-table.js",
      preservedAsPrecedent: Object.freeze([
        "routing table concept",
        "status vocabulary",
        "failure-state preservation",
        "receipt emission",
        "alias and registry precedent",
        "stage and gate sequencing precedent",
        "support-engine anchor precedent",
        "non-rendering protections",
        "handoff discipline",
        "export and global compatibility pattern"
      ]),
      notPreservedAsControllingAuthority: Object.freeze([
        "North as runtime authority",
        "county-engine framing",
        "judge clerk chess chapel labels as governing logic",
        "Fibonacci as mandatory runtime law",
        "canvas hearth planet ownership",
        "product-engine dependency authority",
        "kernel evaluation claims",
        "public superiority claims"
      ]),
      rule:
        "Legacy runtime-table structure supplies reconstruction clues, not dependency authority."
    })
  });

  const STATUS = Object.freeze({
    UNKNOWN: "UNKNOWN",
    HELD: "HELD",
    READY: "READY",
    ACTIVE: "ACTIVE",
    COMPLETE: "COMPLETE",
    BLOCKED: "BLOCKED",
    DEGRADED: "DEGRADED",
    FAILED: "FAILED"
  });

  const FAILURE_STATES = Object.freeze([
    "UNEVALUABLE",
    "INTEGRITY_FAILURE",
    "PROFILE_NOT_ACTIVATED",
    "PROFILE_NOT_SUPPORTED",
    "INADMISSIBLE",
    "UNSUPPORTED_ROUTE",
    "UNKNOWN_TARGET",
    "FORBIDDEN_CLAIM_DETECTED",
    "FOUNDATION_UNAVAILABLE",
    "INVALID_TRANSITION"
  ]);

  const ROUTE_TARGETS = Object.freeze({
    ENGINE_1: "ENGINE_1_OBSERVATION_AND_INTAKE",
    ENGINE_2: "ENGINE_2_TELEMETRY_INTEGRITY_AND_PROFILE_VALIDATION",
    ENGINE_3: "ENGINE_3_DIAGNOSTIC_KERNEL_EVALUATION",
    ENGINE_4: "ENGINE_4_PRESENTATION_AND_WEBSITE_DELIVERY"
  });

  const ROUTES = Object.freeze([
    Object.freeze({
      routeId: "ENGINE_1_TO_ENGINE_2",
      source: ROUTE_TARGETS.ENGINE_1,
      target: ROUTE_TARGETS.ENGINE_2,
      purpose: "Submit intake telemetry for admissibility, integrity, provenance, missingness, freshness, lineage, and profile review.",
      allowedInputStates: Object.freeze([
        "INTAKE_RECEIVED",
        "PROFILE_REQUESTED",
        "SOURCE_DECLARED"
      ]),
      allowedOutputStates: Object.freeze([
        "INTEGRITY_REVIEW_PENDING",
        "PROFILE_NOT_SUPPORTED",
        "PROFILE_NOT_ACTIVATED",
        "INTEGRITY_FAILURE",
        "UNEVALUABLE"
      ]),
      failureStates: FAILURE_STATES,
      kernelEvaluationPermitted: false,
      telemetryIntegrityOverridePermitted: false,
      renderingPermitted: false,
      productionAuthorizationPermitted: false
    }),

    Object.freeze({
      routeId: "ENGINE_2_TO_ENGINE_3",
      source: ROUTE_TARGETS.ENGINE_2,
      target: ROUTE_TARGETS.ENGINE_3,
      purpose: "Forward only admissible and profile-activated telemetry to diagnostic kernel evaluation.",
      allowedInputStates: Object.freeze([
        "ADMISSIBLE",
        "PROFILE_ACTIVATED",
        "INTEGRITY_REVIEW_COMPLETE"
      ]),
      requiredInputState: "ADMISSIBLE",
      allowedOutputStates: Object.freeze([
        "KERNEL_EVALUATION_PENDING",
        "EVALUATION_READY"
      ]),
      failureStates: FAILURE_STATES,
      kernelEvaluationPermitted: false,
      telemetryIntegrityOverridePermitted: false,
      renderingPermitted: false,
      productionAuthorizationPermitted: false
    }),

    Object.freeze({
      routeId: "ENGINE_2_TO_ENGINE_4_FAILURE_DISPLAY",
      source: ROUTE_TARGETS.ENGINE_2,
      target: ROUTE_TARGETS.ENGINE_4,
      purpose: "Forward integrity/profile failure states directly to bounded website display without kernel evaluation.",
      allowedInputStates: Object.freeze([
        "UNEVALUABLE",
        "INTEGRITY_FAILURE",
        "PROFILE_NOT_ACTIVATED",
        "PROFILE_NOT_SUPPORTED",
        "INADMISSIBLE"
      ]),
      allowedOutputStates: Object.freeze([
        "BOUNDED_FAILURE_DISPLAY_PENDING"
      ]),
      failureStates: FAILURE_STATES,
      kernelEvaluationPermitted: false,
      telemetryIntegrityOverridePermitted: false,
      renderingPermitted: false,
      productionAuthorizationPermitted: false
    }),

    Object.freeze({
      routeId: "ENGINE_3_TO_ENGINE_4",
      source: ROUTE_TARGETS.ENGINE_3,
      target: ROUTE_TARGETS.ENGINE_4,
      purpose: "Forward bounded diagnostic result to website delivery.",
      allowedInputStates: Object.freeze([
        "COLLAPSE_QUALIFIED",
        "COLLAPSE_NOT_QUALIFIED",
        "EVALUATION_COMPLETE",
        "UNEVALUABLE"
      ]),
      allowedOutputStates: Object.freeze([
        "RESULT_DISPLAY_PENDING",
        "BOUNDED_RESULT_READY"
      ]),
      failureStates: FAILURE_STATES,
      kernelEvaluationPermitted: false,
      telemetryIntegrityOverridePermitted: false,
      renderingPermitted: false,
      productionAuthorizationPermitted: false
    })
  ]);

  const state = {
    routeTableStatus: STATUS.READY,
    receipts: [],
    rejections: [],
    createdAt: nowIso(),
    updatedAt: nowIso()
  };

  function nowIso() {
    return new Date().toISOString();
  }

  function required(condition, code) {
    if (!condition) throw new Error(code);
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function freezeClone(value) {
    return Object.freeze(clone(value));
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function getRoute(routeId) {
    return ROUTES.find(route => route.routeId === routeId) || null;
  }

  function knownTarget(target) {
    return Object.values(ROUTE_TARGETS).includes(target);
  }

  function foundationAvailable() {
    return Boolean(FOUNDATION && typeof FOUNDATION.validateDescendantDeclaration === "function");
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
      foundationId: META.foundationId,
      foundationResult: freezeClone(result)
    });
  }

  function validateRouteDeclaration(route) {
    required(isObject(route), "ROUTE_REQUIRED");
    required(route.routeId, "ROUTE_ID_REQUIRED");
    required(route.source, "ROUTE_SOURCE_REQUIRED");
    required(route.target, "ROUTE_TARGET_REQUIRED");
    required(knownTarget(route.source), "UNKNOWN_ROUTE_SOURCE");
    required(knownTarget(route.target), "UNKNOWN_ROUTE_TARGET");
    required(Array.isArray(route.allowedInputStates), "ROUTE_ALLOWED_INPUT_STATES_REQUIRED");
    required(Array.isArray(route.allowedOutputStates), "ROUTE_ALLOWED_OUTPUT_STATES_REQUIRED");
    required(Array.isArray(route.failureStates), "ROUTE_FAILURE_STATES_REQUIRED");
    required(route.kernelEvaluationPermitted === false, "ROUTE_KERNEL_EVALUATION_CLAIM_FORBIDDEN");
    required(route.telemetryIntegrityOverridePermitted === false, "ROUTE_INTEGRITY_OVERRIDE_FORBIDDEN");
    required(route.productionAuthorizationPermitted === false, "ROUTE_PRODUCTION_AUTHORIZATION_FORBIDDEN");

    if (FOUNDATION && typeof FOUNDATION.validateRoute === "function") {
      FOUNDATION.validateRoute({
        routeId: route.routeId,
        source: route.source,
        target: route.target,
        allowedStates: route.allowedInputStates,
        failureStates: route.failureStates,
        kernelModified: false,
        productionAuthorized: false
      });
    }

    return Object.freeze({
      pass: true,
      routeId: route.routeId
    });
  }

  function validateRouteTable() {
    required(Array.isArray(ROUTES), "ROUTES_ARRAY_REQUIRED");
    required(ROUTES.length === 4, "ROUTE_COUNT_MISMATCH");

    ROUTES.forEach(validateRouteDeclaration);

    required(getRoute("ENGINE_1_TO_ENGINE_2"), "ENGINE_1_TO_ENGINE_2_ROUTE_MISSING");
    required(getRoute("ENGINE_2_TO_ENGINE_3"), "ENGINE_2_TO_ENGINE_3_ROUTE_MISSING");
    required(getRoute("ENGINE_2_TO_ENGINE_4_FAILURE_DISPLAY"), "ENGINE_2_TO_ENGINE_4_FAILURE_ROUTE_MISSING");
    required(getRoute("ENGINE_3_TO_ENGINE_4"), "ENGINE_3_TO_ENGINE_4_ROUTE_MISSING");

    return Object.freeze({
      pass: true,
      routeCount: ROUTES.length
    });
  }

  function createReceipt(input) {
    const packet = Object.freeze({
      receiptId:
        "RUNTIME_TABLE_RECEIPT_" +
        String(Date.now()) +
        "_" +
        Math.random().toString(36).slice(2, 10).toUpperCase(),
      artifactId: META.artifactId,
      foundationId: META.foundationId,
      routeId: input.routeId,
      source: input.source,
      target: input.target,
      inputStatus: input.inputStatus,
      outputStatus: input.outputStatus,
      accepted: input.accepted === true,
      failureReasons: Object.freeze(input.failureReasons || []),
      timestamp: nowIso(),

      kernelModified: false,
      productionAuthorized: false,
      deploymentAuthorized: false,
      publicReleaseAuthorized: false
    });

    state.receipts.push(packet);
    state.updatedAt = packet.timestamp;

    return packet;
  }

  function rejectRoute(routeId, reason, detail) {
    const rejection = Object.freeze({
      rejected: true,
      routeId: routeId || "",
      reason,
      detail: freezeClone(detail || {}),
      timestamp: nowIso(),
      kernelModified: false,
      productionAuthorized: false,
      deploymentAuthorized: false,
      publicReleaseAuthorized: false
    });

    state.rejections.push(rejection);
    state.updatedAt = rejection.timestamp;

    return rejection;
  }

  function evaluateHandoff(input) {
    if (!isObject(input)) {
      return rejectRoute("", "HANDOFF_INPUT_REQUIRED", {});
    }

    const route = getRoute(input.routeId);

    if (!route) {
      return rejectRoute(input.routeId, "UNSUPPORTED_ROUTE", input);
    }

    if (!knownTarget(route.target)) {
      return rejectRoute(input.routeId, "UNKNOWN_TARGET", input);
    }

    const inputStatus = String(input.inputStatus || "");

    if (!route.allowedInputStates.includes(inputStatus)) {
      return rejectRoute(input.routeId, "INVALID_TRANSITION", {
        inputStatus,
        allowedInputStates: route.allowedInputStates
      });
    }

    if (route.requiredInputState && inputStatus !== route.requiredInputState) {
      return rejectRoute(input.routeId, "REQUIRED_INPUT_STATE_NOT_MET", {
        requiredInputState: route.requiredInputState,
        inputStatus
      });
    }

    const outputStatus =
      input.outputStatus ||
      route.allowedOutputStates[0] ||
      "ROUTE_ACCEPTED";

    if (!route.allowedOutputStates.includes(outputStatus)) {
      return rejectRoute(input.routeId, "INVALID_OUTPUT_STATE", {
        outputStatus,
        allowedOutputStates: route.allowedOutputStates
      });
    }

    return createReceipt({
      routeId: route.routeId,
      source: route.source,
      target: route.target,
      inputStatus,
      outputStatus,
      accepted: true,
      failureReasons: []
    });
  }

  function preserveFailureState(input) {
    required(isObject(input), "FAILURE_INPUT_REQUIRED");

    const failureState = String(input.failureState || input.inputStatus || "");

    required(
      FAILURE_STATES.includes(failureState),
      "UNKNOWN_FAILURE_STATE"
    );

    return Object.freeze({
      preserved: true,
      failureState,
      target:
        input.target ||
        ROUTE_TARGETS.ENGINE_4,
      boundedDisplayPermitted: true,
      kernelEvaluationPermitted: false,
      timestamp: nowIso()
    });
  }

  function inspectSync() {
    return Object.freeze({
      artifactId: META.artifactId,
      filename: META.filename,
      status: META.status,
      foundationId: META.foundationId,
      foundationAvailable: foundationAvailable(),
      routeCount: ROUTES.length,
      routes: ROUTES.map(route => route.routeId),
      scopeBoundary: META.scopeBoundary,
      official: META.official,
      canonical: META.canonical,
      kernelModified: META.kernelModified,
      productionAuthorized: META.productionAuthorized,
      deploymentAuthorized: META.deploymentAuthorized,
      publicReleaseAuthorized: META.publicReleaseAuthorized,
      shortestTrueRead:
        "Runtime route table and handoff gate descendant. Defines routes and receipts only; does not validate telemetry, evaluate the kernel, render output, or complete the diagnostic engine."
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
      META.scopeBoundary.thisFileIsEntireDiagnosticEngine === false,
      "RUNTIME_TABLE_FALSE_COMPLETION_CLAIM_FORBIDDEN"
    );

    required(
      META.scopeBoundary.thisFileIsAllOfEngine1 === false,
      "RUNTIME_TABLE_ENGINE_1_TOTALITY_CLAIM_FORBIDDEN"
    );

    required(
      META.scopeBoundary.thisFileReplacesEngines2Through4 === false,
      "RUNTIME_TABLE_ENGINE_2_THROUGH_4_REPLACEMENT_CLAIM_FORBIDDEN"
    );

    required(
      META.scopeBoundary.thisFileEvaluatesKernel === false,
      "RUNTIME_TABLE_KERNEL_EVALUATION_CLAIM_FORBIDDEN"
    );

    required(
      META.scopeBoundary.thisFileValidatesTelemetryIntegrity === false,
      "RUNTIME_TABLE_TELEMETRY_VALIDATION_CLAIM_FORBIDDEN"
    );

    required(
      META.scopeBoundary.thisFileRendersWebsiteOutput === false,
      "RUNTIME_TABLE_RENDERING_CLAIM_FORBIDDEN"
    );

    validateFoundationCompatibility();
    validateRouteTable();

    return Object.freeze({
      pass: true,
      artifactId: META.artifactId,
      filename: META.filename,
      foundationId: META.foundationId,
      routeTablePreserved: true,
      handoffGatePreserved: true,
      failureStatePreservation: true,
      scopeBoundaryPreserved: true,
      kernelModified: false,
      productionAuthorized: false,
      deploymentAuthorized: false,
      publicReleaseAuthorized: false
    });
  }

  return Object.freeze({
    ...META,
    STATUS,
    FAILURE_STATES,
    ROUTE_TARGETS,
    ROUTES,
    getRoute,
    evaluateHandoff,
    preserveFailureState,
    createReceipt,
    validateFoundationCompatibility,
    validateRouteDeclaration,
    validateRouteTable,
    inspectSync,
    validateSync,
    get state() {
      return state;
    }
  });
})();

if (typeof globalThis !== "undefined") {
  globalThis.AUDRALIA_RUNTIME_TABLE_v1 = AUDRALIA_RUNTIME_TABLE_v1;
  globalThis.RUNTIME_TABLE = AUDRALIA_RUNTIME_TABLE_v1;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = AUDRALIA_RUNTIME_TABLE_v1;
}

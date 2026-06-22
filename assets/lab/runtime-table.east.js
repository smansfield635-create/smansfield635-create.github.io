"use strict";

/*
  runtime-table.east.js

  Replacement-shell descendant of:
  DIAGNOSTIC_RUNTIME_SHELL_FOUNDATION_v1
  AUDRALIA_RUNTIME_TABLE_v1

  Purpose:
  Define the East intake branch shell.

  Boundary:
  This file supports intake-side routing only.
  It does not validate telemetry integrity.
  It does not evaluate the kernel.
  It does not render website output.
  It does not complete Engine 1 or the four-engine architecture.
*/

const AUDRALIA_RUNTIME_TABLE_EAST_v1 = (() => {
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
    artifactId: "AUDRALIA_RUNTIME_TABLE_EAST_v1",
    filename: "runtime-table.east.js",
    artifactClass: "RUNTIME_TABLE_EAST_INTAKE_BRANCH_SHELL",
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

    branchBoundary: Object.freeze({
      branch: "EAST",
      branchRole: "INTAKE_FORMATION_AND_PROFILE_REQUEST_BRANCH",
      thisFileIsEntireDiagnosticEngine: false,
      thisFileIsAllOfEngine1: false,
      thisFileReplacesRuntimeTable: false,
      thisFileReplacesEngines2Through4: false,
      thisFileValidatesTelemetryIntegrity: false,
      thisFileEvaluatesKernel: false,
      thisFileRendersWebsiteOutput: false,
      rule:
        "East receives and normalizes intake packets for routing. It does not determine telemetry admissibility, evaluate collapse, or render final results."
    }),

    legacyPrecedentUse: Object.freeze({
      sourcePrecedent: "/assets/lab/runtime-table.east.js",
      preservedAsPrecedent: Object.freeze([
        "east intake branch",
        "intake packet classification",
        "intake receipt emission",
        "handoff toward runtime table",
        "failure preservation",
        "non-rendering protections",
        "forbidden-claim rejection"
      ]),
      notPreservedAsControllingAuthority: Object.freeze([
        "East Supreme Judge authority",
        "Fibonacci as mandatory runtime law",
        "mechanical-coordinate governance",
        "256 state lattice claims",
        "North authority dependency",
        "West/South/Canvas ownership",
        "planet or Hearth ownership",
        "public superiority claims"
      ]),
      rule:
        "Legacy East structure supplies intake-branch clues, not dependency authority."
    })
  });

  const STATUS = Object.freeze({
    READY: "READY",
    HELD: "HELD",
    ACCEPTED: "ACCEPTED",
    REJECTED: "REJECTED",
    BLOCKED: "BLOCKED"
  });

  const INTAKE_CLASS = Object.freeze({
    PROFILE_REQUEST: "PROFILE_REQUEST",
    USER_INPUT: "USER_INPUT",
    SOURCE_DECLARATION: "SOURCE_DECLARATION",
    OBSERVED_VALUE_DECLARATION: "OBSERVED_VALUE_DECLARATION",
    DERIVED_VALUE_DECLARATION: "DERIVED_VALUE_DECLARATION",
    ROUTE_REQUEST: "ROUTE_REQUEST",
    GENERIC_INTAKE: "GENERIC_INTAKE"
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
    "RUNTIME_TABLE_UNAVAILABLE",
    "INVALID_INTAKE_PACKET"
  ]);

  const state = {
    branchStatus: STATUS.READY,
    intakeRecords: [],
    rejectedRecords: [],
    receipts: [],
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

  function foundationAvailable() {
    return Boolean(FOUNDATION && typeof FOUNDATION.validateDescendantDeclaration === "function");
  }

  function runtimeTableAvailable() {
    return Boolean(RUNTIME_TABLE && typeof RUNTIME_TABLE.evaluateHandoff === "function");
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
      '"thisFileIsEntireDiagnosticEngine":true',
      '"thisFileIsAllOfEngine1":true',
      '"thisFileValidatesTelemetryIntegrity":true',
      '"thisFileEvaluatesKernel":true',
      '"thisFileRendersWebsiteOutput":true',
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
        "RUNTIME_TABLE_EAST_RECEIPT_" +
        String(Date.now()) +
        "_" +
        Math.random().toString(36).slice(2, 10).toUpperCase(),
      artifactId: META.artifactId,
      foundationId: META.foundationId,
      runtimeTableId: META.runtimeTableId,
      branch: "EAST",
      accepted: input.accepted === true,
      intakeClass: input.intakeClass || "",
      inputStatus: input.inputStatus || "",
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

  function classifyIntake(packet) {
    const input = isObject(packet) ? packet : { value: packet };
    const text = JSON.stringify(input);

    let intakeClass = INTAKE_CLASS.GENERIC_INTAKE;

    if (input.profileRequested || input.profileId || input.domainProfile) {
      intakeClass = INTAKE_CLASS.PROFILE_REQUEST;
    } else if (input.sourceIdentity || input.sourceId || input.sourceSystem) {
      intakeClass = INTAKE_CLASS.SOURCE_DECLARATION;
    } else if (input.observed === true || input.observedOrDerivedStatus === "OBSERVED") {
      intakeClass = INTAKE_CLASS.OBSERVED_VALUE_DECLARATION;
    } else if (input.derived === true || input.observedOrDerivedStatus === "DERIVED") {
      intakeClass = INTAKE_CLASS.DERIVED_VALUE_DECLARATION;
    } else if (input.routeId || /ENGINE_1_TO_ENGINE_2|ROUTE_REQUEST/.test(text)) {
      intakeClass = INTAKE_CLASS.ROUTE_REQUEST;
    } else if (input.fieldValues || input.userInput || input.value !== undefined) {
      intakeClass = INTAKE_CLASS.USER_INPUT;
    }

    return Object.freeze({
      intakeClass,
      forbiddenClaimDetected: containsForbiddenClaim(input),
      packet: freezeClone(input),
      classifiedAt: nowIso()
    });
  }

  function normalizeIntake(packet) {
    const classification = classifyIntake(packet);
    const input = classification.packet;

    return Object.freeze({
      recordId:
        "EAST_INTAKE_" +
        String(Date.now()) +
        "_" +
        Math.random().toString(36).slice(2, 8).toUpperCase(),
      artifactId: META.artifactId,
      branch: "EAST",
      intakeClass: classification.intakeClass,
      profileRequested: input.profileRequested || input.profileId || input.domainProfile || "",
      sourceIdentity: input.sourceIdentity || input.sourceId || input.sourceSystem || "",
      fieldIdentity: input.fieldIdentity || input.fieldId || "",
      observedOrDerivedStatus: input.observedOrDerivedStatus || "",
      timestampOrTemporalScope: input.timestamp || input.timestampOrTemporalScope || "",
      rawPacket: freezeClone(input),
      forbiddenClaimDetected: classification.forbiddenClaimDetected,
      normalizedAt: nowIso(),

      kernelModified: false,
      productionAuthorized: false,
      deploymentAuthorized: false,
      publicReleaseAuthorized: false
    });
  }

  function acceptIntake(packet) {
    const record = normalizeIntake(packet);

    if (record.forbiddenClaimDetected) {
      state.rejectedRecords.push(record);
      return makeReceipt({
        accepted: false,
        intakeClass: record.intakeClass,
        inputStatus: "INTAKE_REJECTED",
        outputStatus: "FORBIDDEN_CLAIM_DETECTED",
        failureReasons: ["FORBIDDEN_CLAIM_DETECTED"]
      });
    }

    state.intakeRecords.push(record);
    state.updatedAt = nowIso();

    return makeReceipt({
      accepted: true,
      intakeClass: record.intakeClass,
      inputStatus: "INTAKE_RECEIVED",
      outputStatus: "PROFILE_REQUESTED",
      failureReasons: []
    });
  }

  function routeToEngine2(packet) {
    const receipt = acceptIntake(packet);

    if (receipt.accepted !== true) return receipt;

    if (!runtimeTableAvailable()) {
      return makeReceipt({
        accepted: false,
        intakeClass: receipt.intakeClass,
        inputStatus: "INTAKE_RECEIVED",
        outputStatus: "RUNTIME_TABLE_UNAVAILABLE",
        failureReasons: ["RUNTIME_TABLE_UNAVAILABLE"]
      });
    }

    return RUNTIME_TABLE.evaluateHandoff({
      routeId: "ENGINE_1_TO_ENGINE_2",
      inputStatus: "INTAKE_RECEIVED",
      outputStatus: "INTEGRITY_REVIEW_PENDING"
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
      branch: META.branchBoundary.branch,
      branchRole: META.branchBoundary.branchRole,
      foundationAvailable: foundationAvailable(),
      runtimeTableAvailable: runtimeTableAvailable(),
      intakeRecordCount: state.intakeRecords.length,
      rejectedRecordCount: state.rejectedRecords.length,
      receiptCount: state.receipts.length,
      scopeBoundary: META.branchBoundary,
      official: META.official,
      canonical: META.canonical,
      kernelModified: META.kernelModified,
      productionAuthorized: META.productionAuthorized,
      deploymentAuthorized: META.deploymentAuthorized,
      publicReleaseAuthorized: META.publicReleaseAuthorized,
      shortestTrueRead:
        "East intake branch shell. It normalizes intake and routes toward Engine 2 through the runtime table. It does not validate telemetry, evaluate the kernel, render output, or complete Engine 1."
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

    required(META.branchBoundary.thisFileIsEntireDiagnosticEngine === false, "EAST_FALSE_COMPLETION_CLAIM_FORBIDDEN");
    required(META.branchBoundary.thisFileIsAllOfEngine1 === false, "EAST_ENGINE_1_TOTALITY_CLAIM_FORBIDDEN");
    required(META.branchBoundary.thisFileReplacesRuntimeTable === false, "EAST_RUNTIME_TABLE_REPLACEMENT_CLAIM_FORBIDDEN");
    required(META.branchBoundary.thisFileReplacesEngines2Through4 === false, "EAST_ENGINE_2_THROUGH_4_REPLACEMENT_CLAIM_FORBIDDEN");
    required(META.branchBoundary.thisFileValidatesTelemetryIntegrity === false, "EAST_TELEMETRY_VALIDATION_CLAIM_FORBIDDEN");
    required(META.branchBoundary.thisFileEvaluatesKernel === false, "EAST_KERNEL_EVALUATION_CLAIM_FORBIDDEN");
    required(META.branchBoundary.thisFileRendersWebsiteOutput === false, "EAST_RENDERING_CLAIM_FORBIDDEN");

    validateFoundationCompatibility();
    validateRuntimeTableCompatibility();

    return Object.freeze({
      pass: true,
      artifactId: META.artifactId,
      filename: META.filename,
      foundationId: META.foundationId,
      runtimeTableId: META.runtimeTableId,
      branchBoundaryPreserved: true,
      intakeBranchPreserved: true,
      routeToEngine2Preserved: true,
      kernelModified: false,
      productionAuthorized: false,
      deploymentAuthorized: false,
      publicReleaseAuthorized: false
    });
  }

  return Object.freeze({
    ...META,
    STATUS,
    INTAKE_CLASS,
    FAILURE_STATES,
    classifyIntake,
    normalizeIntake,
    acceptIntake,
    routeToEngine2,
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
  globalThis.AUDRALIA_RUNTIME_TABLE_EAST_v1 = AUDRALIA_RUNTIME_TABLE_EAST_v1;
  globalThis.RUNTIME_TABLE_EAST = AUDRALIA_RUNTIME_TABLE_EAST_v1;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = AUDRALIA_RUNTIME_TABLE_EAST_v1;
}

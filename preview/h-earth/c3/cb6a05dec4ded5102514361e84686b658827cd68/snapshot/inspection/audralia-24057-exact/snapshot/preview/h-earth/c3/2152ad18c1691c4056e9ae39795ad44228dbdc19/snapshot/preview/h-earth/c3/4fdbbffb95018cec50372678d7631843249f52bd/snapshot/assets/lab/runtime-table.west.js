"use strict";

/*
  runtime-table.west.js

  Replacement-shell descendant of:
  DIAGNOSTIC_RUNTIME_SHELL_FOUNDATION_v1
  AUDRALIA_RUNTIME_TABLE_v1

  Purpose:
  Define the West pressure/admissibility branch shell.

  Boundary:
  This file supports bounded pressure/admissibility routing only.
  It does not validate telemetry integrity as Engine 2.
  It does not evaluate the kernel.
  It does not render website output.
  It does not complete Engine 1 or the four-engine architecture.
*/

const AUDRALIA_RUNTIME_TABLE_WEST_v1 = (() => {
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
    artifactId: "AUDRALIA_RUNTIME_TABLE_WEST_v1",
    filename: "runtime-table.west.js",
    artifactClass: "RUNTIME_TABLE_WEST_PRESSURE_ADMISSIBILITY_BRANCH_SHELL",
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
      branch: "WEST",
      branchRole: "PRESSURE_ADMISSIBILITY_PRECEDENT_AND_HANDOFF_BRANCH",
      thisFileIsEntireDiagnosticEngine: false,
      thisFileIsAllOfEngine1: false,
      thisFileReplacesRuntimeTable: false,
      thisFileReplacesEngine2TelemetryIntegrity: false,
      thisFileReplacesEngines2Through4: false,
      thisFileValidatesTelemetryIntegrity: false,
      thisFileEvaluatesKernel: false,
      thisFileRendersWebsiteOutput: false,
      rule:
        "West preserves pressure/admissibility precedent and prepares bounded handoff. It does not perform Engine 2 telemetry integrity validation, determine collapse, or render final results."
    }),

    legacyPrecedentUse: Object.freeze({
      sourcePrecedent: "/assets/lab/runtime-table.west.js",
      preservedAsPrecedent: Object.freeze([
        "west pressure/admissibility branch",
        "pressure packet classification",
        "bounded admissibility precedent",
        "handoff toward South return",
        "receipt emission",
        "failure preservation",
        "non-rendering protections",
        "forbidden-claim rejection"
      ]),
      notPreservedAsControllingAuthority: Object.freeze([
        "West Supreme Judge authority",
        "Fibonacci as mandatory runtime law",
        "mechanical-coordinate governance",
        "256 state lattice claims",
        "Engine 2 telemetry-integrity ownership",
        "South proof ownership",
        "North latch authority",
        "Canvas release authority",
        "planet or Hearth ownership",
        "public superiority claims"
      ]),
      rule:
        "Legacy West structure supplies pressure-branch clues, not dependency authority."
    })
  });

  const STATUS = Object.freeze({
    READY: "READY",
    HELD: "HELD",
    ACCEPTED: "ACCEPTED",
    REJECTED: "REJECTED",
    BLOCKED: "BLOCKED"
  });

  const PRESSURE_CLASS = Object.freeze({
    INTAKE_PRESSURE: "INTAKE_PRESSURE",
    PROFILE_PRESSURE: "PROFILE_PRESSURE",
    SOURCE_PRESSURE: "SOURCE_PRESSURE",
    MISSINGNESS_PRESSURE: "MISSINGNESS_PRESSURE",
    INTEGRITY_PRECHECK_PRESSURE: "INTEGRITY_PRECHECK_PRESSURE",
    FAILURE_PRESSURE: "FAILURE_PRESSURE",
    GENERIC_PRESSURE: "GENERIC_PRESSURE"
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
    "INVALID_PRESSURE_PACKET"
  ]);

  const state = {
    branchStatus: STATUS.READY,
    pressureRecords: [],
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
      '"thisFileReplacesEngine2TelemetryIntegrity":true',
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
        "RUNTIME_TABLE_WEST_RECEIPT_" +
        String(Date.now()) +
        "_" +
        Math.random().toString(36).slice(2, 10).toUpperCase(),
      artifactId: META.artifactId,
      foundationId: META.foundationId,
      runtimeTableId: META.runtimeTableId,
      branch: "WEST",
      accepted: input.accepted === true,
      pressureClass: input.pressureClass || "",
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

  function classifyPressure(packet) {
    const input = isObject(packet) ? packet : { value: packet };

    let pressureClass = PRESSURE_CLASS.GENERIC_PRESSURE;

    if (input.inputStatus === "INTAKE_RECEIVED" || input.intakeClass || input.fieldValues) {
      pressureClass = PRESSURE_CLASS.INTAKE_PRESSURE;
    } else if (input.profileRequested || input.profileId || input.domainProfile) {
      pressureClass = PRESSURE_CLASS.PROFILE_PRESSURE;
    } else if (input.sourceIdentity || input.sourceId || input.sourceSystem) {
      pressureClass = PRESSURE_CLASS.SOURCE_PRESSURE;
    } else if (input.missingnessStatus || input.missingRequiredTelemetry) {
      pressureClass = PRESSURE_CLASS.MISSINGNESS_PRESSURE;
    } else if (input.validationStatus || input.provenanceStatus || input.lineageStatus) {
      pressureClass = PRESSURE_CLASS.INTEGRITY_PRECHECK_PRESSURE;
    } else if (input.failureState || FAILURE_STATES.includes(input.inputStatus)) {
      pressureClass = PRESSURE_CLASS.FAILURE_PRESSURE;
    }

    return Object.freeze({
      pressureClass,
      forbiddenClaimDetected: containsForbiddenClaim(input),
      packet: freezeClone(input),
      classifiedAt: nowIso()
    });
  }

  function normalizePressure(packet) {
    const classification = classifyPressure(packet);
    const input = classification.packet;

    return Object.freeze({
      recordId:
        "WEST_PRESSURE_" +
        String(Date.now()) +
        "_" +
        Math.random().toString(36).slice(2, 8).toUpperCase(),
      artifactId: META.artifactId,
      branch: "WEST",
      pressureClass: classification.pressureClass,
      sourceStatus: input.inputStatus || "",
      profileRequested: input.profileRequested || input.profileId || input.domainProfile || "",
      sourceIdentity: input.sourceIdentity || input.sourceId || input.sourceSystem || "",
      pressureStatus: input.pressureStatus || "",
      admissibilityPrecheckStatus: input.admissibilityPrecheckStatus || "",
      failureReasons: Object.freeze(input.failureReasons || []),
      rawPacket: freezeClone(input),
      forbiddenClaimDetected: classification.forbiddenClaimDetected,
      normalizedAt: nowIso(),

      engine2TelemetryIntegrityValidated: false,
      kernelModified: false,
      productionAuthorized: false,
      deploymentAuthorized: false,
      publicReleaseAuthorized: false
    });
  }

  function acceptPressure(packet) {
    const record = normalizePressure(packet);

    if (record.forbiddenClaimDetected) {
      state.rejectedRecords.push(record);
      return makeReceipt({
        accepted: false,
        pressureClass: record.pressureClass,
        inputStatus: "PRESSURE_REJECTED",
        outputStatus: "FORBIDDEN_CLAIM_DETECTED",
        failureReasons: ["FORBIDDEN_CLAIM_DETECTED"]
      });
    }

    state.pressureRecords.push(record);
    state.updatedAt = nowIso();

    return makeReceipt({
      accepted: true,
      pressureClass: record.pressureClass,
      inputStatus: record.sourceStatus || "PRESSURE_RECEIVED",
      outputStatus: "PRESSURE_HANDOFF_READY",
      failureReasons: []
    });
  }

  function routeIntakeTowardEngine2(packet) {
    const receipt = acceptPressure(packet);

    if (receipt.accepted !== true) return receipt;

    if (!runtimeTableAvailable()) {
      return makeReceipt({
        accepted: false,
        pressureClass: receipt.pressureClass,
        inputStatus: "PRESSURE_RECEIVED",
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

  function routeAdmissibleTowardEngine3(packet) {
    const receipt = acceptPressure(packet);

    if (receipt.accepted !== true) return receipt;

    if (!runtimeTableAvailable()) {
      return makeReceipt({
        accepted: false,
        pressureClass: receipt.pressureClass,
        inputStatus: "PRESSURE_RECEIVED",
        outputStatus: "RUNTIME_TABLE_UNAVAILABLE",
        failureReasons: ["RUNTIME_TABLE_UNAVAILABLE"]
      });
    }

    return RUNTIME_TABLE.evaluateHandoff({
      routeId: "ENGINE_2_TO_ENGINE_3",
      inputStatus: "ADMISSIBLE",
      outputStatus: "KERNEL_EVALUATION_PENDING"
    });
  }

  function routeFailureTowardSouth(packet) {
    const receipt = acceptPressure(packet);

    if (receipt.accepted !== true) return receipt;

    return Object.freeze({
      accepted: true,
      artifactId: META.artifactId,
      route: "WEST_TO_SOUTH_FAILURE_RETURN_PRECEDENT",
      source: "WEST",
      target: "SOUTH",
      inputStatus: packet.inputStatus || packet.failureState || "UNEVALUABLE",
      outputStatus: "BOUNDED_RETURN_READY",
      failureReasons: Object.freeze(packet.failureReasons || []),
      timestamp: nowIso(),

      kernelModified: false,
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

  function inspectSync() {
    return Object.freeze({
      artifactId: META.artifactId,
      filename: META.filename,
      status: META.status,
      branch: META.branchBoundary.branch,
      branchRole: META.branchBoundary.branchRole,
      foundationAvailable: foundationAvailable(),
      runtimeTableAvailable: runtimeTableAvailable(),
      pressureRecordCount: state.pressureRecords.length,
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
        "West pressure/admissibility branch shell. It preserves pressure and admissibility-routing precedent but does not replace Engine 2 telemetry integrity, evaluate the kernel, render output, or complete Engine 1."
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

    required(META.branchBoundary.thisFileIsEntireDiagnosticEngine === false, "WEST_FALSE_COMPLETION_CLAIM_FORBIDDEN");
    required(META.branchBoundary.thisFileIsAllOfEngine1 === false, "WEST_ENGINE_1_TOTALITY_CLAIM_FORBIDDEN");
    required(META.branchBoundary.thisFileReplacesRuntimeTable === false, "WEST_RUNTIME_TABLE_REPLACEMENT_CLAIM_FORBIDDEN");
    required(META.branchBoundary.thisFileReplacesEngine2TelemetryIntegrity === false, "WEST_ENGINE_2_REPLACEMENT_CLAIM_FORBIDDEN");
    required(META.branchBoundary.thisFileReplacesEngines2Through4 === false, "WEST_ENGINE_2_THROUGH_4_REPLACEMENT_CLAIM_FORBIDDEN");
    required(META.branchBoundary.thisFileValidatesTelemetryIntegrity === false, "WEST_TELEMETRY_VALIDATION_CLAIM_FORBIDDEN");
    required(META.branchBoundary.thisFileEvaluatesKernel === false, "WEST_KERNEL_EVALUATION_CLAIM_FORBIDDEN");
    required(META.branchBoundary.thisFileRendersWebsiteOutput === false, "WEST_RENDERING_CLAIM_FORBIDDEN");

    validateFoundationCompatibility();
    validateRuntimeTableCompatibility();

    return Object.freeze({
      pass: true,
      artifactId: META.artifactId,
      filename: META.filename,
      foundationId: META.foundationId,
      runtimeTableId: META.runtimeTableId,
      branchBoundaryPreserved: true,
      westPressureBranchPreserved: true,
      engine2NonReplacementBoundaryPreserved: true,
      southFailureReturnPrecedentPreserved: true,
      kernelModified: false,
      productionAuthorized: false,
      deploymentAuthorized: false,
      publicReleaseAuthorized: false
    });
  }

  return Object.freeze({
    ...META,
    STATUS,
    PRESSURE_CLASS,
    FAILURE_STATES,
    classifyPressure,
    normalizePressure,
    acceptPressure,
    routeIntakeTowardEngine2,
    routeAdmissibleTowardEngine3,
    routeFailureTowardSouth,
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
  globalThis.AUDRALIA_RUNTIME_TABLE_WEST_v1 = AUDRALIA_RUNTIME_TABLE_WEST_v1;
  globalThis.RUNTIME_TABLE_WEST = AUDRALIA_RUNTIME_TABLE_WEST_v1;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = AUDRALIA_RUNTIME_TABLE_WEST_v1;
}

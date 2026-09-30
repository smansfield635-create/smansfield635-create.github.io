"use strict";

/*
  runtime-table.south.js

  Replacement-shell descendant of:
  DIAGNOSTIC_RUNTIME_SHELL_FOUNDATION_v1
  AUDRALIA_RUNTIME_TABLE_v1

  Purpose:
  Define the South return branch shell.

  Boundary:
  This file supports bounded return/proof-state routing only.
  It does not validate telemetry integrity.
  It does not evaluate the kernel.
  It does not render website output.
  It does not complete Engine 1 or the four-engine architecture.
*/

const AUDRALIA_RUNTIME_TABLE_SOUTH_v1 = (() => {
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
    artifactId: "AUDRALIA_RUNTIME_TABLE_SOUTH_v1",
    filename: "runtime-table.south.js",
    artifactClass: "RUNTIME_TABLE_SOUTH_RETURN_BRANCH_SHELL",
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
      branch: "SOUTH",
      branchRole: "BOUNDED_RETURN_PROOF_AND_FAILURE_PROPAGATION_BRANCH",
      thisFileIsEntireDiagnosticEngine: false,
      thisFileIsAllOfEngine1: false,
      thisFileReplacesRuntimeTable: false,
      thisFileReplacesEngines2Through4: false,
      thisFileValidatesTelemetryIntegrity: false,
      thisFileEvaluatesKernel: false,
      thisFileRendersWebsiteOutput: false,
      thisFileAuthorizesCanvasRelease: false,
      rule:
        "South preserves bounded return states, proof packets, and failure propagation. It does not determine admissibility, evaluate collapse, latch final authority, or render results."
    }),

    legacyPrecedentUse: Object.freeze({
      sourcePrecedent: "/assets/lab/runtime-table.south.js",
      preservedAsPrecedent: Object.freeze([
        "south proof/return branch",
        "proof packet preparation",
        "bounded return receipt emission",
        "failure-state propagation",
        "north-return precedent",
        "canvas-evidence handoff precedent",
        "non-rendering protections",
        "forbidden-claim rejection"
      ]),
      notPreservedAsControllingAuthority: Object.freeze([
        "South Supreme Judge authority",
        "Fibonacci as mandatory runtime law",
        "mechanical-coordinate governance",
        "256 state lattice claims",
        "North F21 latch authority",
        "Canvas release authority",
        "West admissibility ownership",
        "planet or Hearth ownership",
        "public superiority claims"
      ]),
      rule:
        "Legacy South structure supplies return-branch clues, not dependency authority."
    })
  });

  const STATUS = Object.freeze({
    READY: "READY",
    HELD: "HELD",
    ACCEPTED: "ACCEPTED",
    REJECTED: "REJECTED",
    BLOCKED: "BLOCKED"
  });

  const RETURN_CLASS = Object.freeze({
    INTEGRITY_FAILURE_RETURN: "INTEGRITY_FAILURE_RETURN",
    PROFILE_FAILURE_RETURN: "PROFILE_FAILURE_RETURN",
    INADMISSIBLE_RETURN: "INADMISSIBLE_RETURN",
    UNEVALUABLE_RETURN: "UNEVALUABLE_RETURN",
    DIAGNOSTIC_RESULT_RETURN: "DIAGNOSTIC_RESULT_RETURN",
    CANVAS_EVIDENCE_REQUEST: "CANVAS_EVIDENCE_REQUEST",
    GENERIC_RETURN: "GENERIC_RETURN"
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
    "INVALID_RETURN_PACKET"
  ]);

  const state = {
    branchStatus: STATUS.READY,
    returnRecords: [],
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
      '"thisFileAuthorizesCanvasRelease":true',
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
        "RUNTIME_TABLE_SOUTH_RECEIPT_" +
        String(Date.now()) +
        "_" +
        Math.random().toString(36).slice(2, 10).toUpperCase(),
      artifactId: META.artifactId,
      foundationId: META.foundationId,
      runtimeTableId: META.runtimeTableId,
      branch: "SOUTH",
      accepted: input.accepted === true,
      returnClass: input.returnClass || "",
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

  function classifyReturn(packet) {
    const input = isObject(packet) ? packet : { value: packet };
    const text = JSON.stringify(input);

    let returnClass = RETURN_CLASS.GENERIC_RETURN;

    if (input.failureState === "INTEGRITY_FAILURE" || input.inputStatus === "INTEGRITY_FAILURE") {
      returnClass = RETURN_CLASS.INTEGRITY_FAILURE_RETURN;
    } else if (
      input.failureState === "PROFILE_NOT_ACTIVATED" ||
      input.failureState === "PROFILE_NOT_SUPPORTED" ||
      input.inputStatus === "PROFILE_NOT_ACTIVATED" ||
      input.inputStatus === "PROFILE_NOT_SUPPORTED"
    ) {
      returnClass = RETURN_CLASS.PROFILE_FAILURE_RETURN;
    } else if (input.failureState === "INADMISSIBLE" || input.inputStatus === "INADMISSIBLE") {
      returnClass = RETURN_CLASS.INADMISSIBLE_RETURN;
    } else if (input.failureState === "UNEVALUABLE" || input.inputStatus === "UNEVALUABLE") {
      returnClass = RETURN_CLASS.UNEVALUABLE_RETURN;
    } else if (
      input.inputStatus === "COLLAPSE_QUALIFIED" ||
      input.inputStatus === "COLLAPSE_NOT_QUALIFIED" ||
      input.inputStatus === "EVALUATION_COMPLETE"
    ) {
      returnClass = RETURN_CLASS.DIAGNOSTIC_RESULT_RETURN;
    } else if (input.canvasF13EvidenceReady || /CANVAS|F13|EVIDENCE_REQUEST/.test(text)) {
      returnClass = RETURN_CLASS.CANVAS_EVIDENCE_REQUEST;
    }

    return Object.freeze({
      returnClass,
      forbiddenClaimDetected: containsForbiddenClaim(input),
      packet: freezeClone(input),
      classifiedAt: nowIso()
    });
  }

  function normalizeReturn(packet) {
    const classification = classifyReturn(packet);
    const input = classification.packet;

    return Object.freeze({
      recordId:
        "SOUTH_RETURN_" +
        String(Date.now()) +
        "_" +
        Math.random().toString(36).slice(2, 8).toUpperCase(),
      artifactId: META.artifactId,
      branch: "SOUTH",
      returnClass: classification.returnClass,
      sourceStatus: input.inputStatus || input.failureState || "",
      boundedDisplayStatus: input.boundedDisplayStatus || "",
      resultStatus: input.resultStatus || "",
      failureReasons: Object.freeze(input.failureReasons || []),
      rawPacket: freezeClone(input),
      forbiddenClaimDetected: classification.forbiddenClaimDetected,
      normalizedAt: nowIso(),

      kernelModified: false,
      productionAuthorized: false,
      deploymentAuthorized: false,
      publicReleaseAuthorized: false
    });
  }

  function acceptReturn(packet) {
    const record = normalizeReturn(packet);

    if (record.forbiddenClaimDetected) {
      state.rejectedRecords.push(record);
      return makeReceipt({
        accepted: false,
        returnClass: record.returnClass,
        inputStatus: "RETURN_REJECTED",
        outputStatus: "FORBIDDEN_CLAIM_DETECTED",
        failureReasons: ["FORBIDDEN_CLAIM_DETECTED"]
      });
    }

    state.returnRecords.push(record);
    state.updatedAt = nowIso();

    return makeReceipt({
      accepted: true,
      returnClass: record.returnClass,
      inputStatus: record.sourceStatus || "RETURN_RECEIVED",
      outputStatus: "BOUNDED_RETURN_READY",
      failureReasons: []
    });
  }

  function routeFailureToEngine4(packet) {
    const receipt = acceptReturn(packet);

    if (receipt.accepted !== true) return receipt;

    if (!runtimeTableAvailable()) {
      return makeReceipt({
        accepted: false,
        returnClass: receipt.returnClass,
        inputStatus: "RETURN_RECEIVED",
        outputStatus: "RUNTIME_TABLE_UNAVAILABLE",
        failureReasons: ["RUNTIME_TABLE_UNAVAILABLE"]
      });
    }

    const status =
      packet.failureState ||
      packet.inputStatus ||
      "UNEVALUABLE";

    return RUNTIME_TABLE.evaluateHandoff({
      routeId: "ENGINE_2_TO_ENGINE_4_FAILURE_DISPLAY",
      inputStatus: status,
      outputStatus: "BOUNDED_FAILURE_DISPLAY_PENDING"
    });
  }

  function routeResultToEngine4(packet) {
    const receipt = acceptReturn(packet);

    if (receipt.accepted !== true) return receipt;

    if (!runtimeTableAvailable()) {
      return makeReceipt({
        accepted: false,
        returnClass: receipt.returnClass,
        inputStatus: "RETURN_RECEIVED",
        outputStatus: "RUNTIME_TABLE_UNAVAILABLE",
        failureReasons: ["RUNTIME_TABLE_UNAVAILABLE"]
      });
    }

    const status =
      packet.inputStatus ||
      packet.resultStatus ||
      "EVALUATION_COMPLETE";

    return RUNTIME_TABLE.evaluateHandoff({
      routeId: "ENGINE_3_TO_ENGINE_4",
      inputStatus: status,
      outputStatus: "RESULT_DISPLAY_PENDING"
    });
  }

  function prepareCanvasEvidenceRequest(packet) {
    const record = normalizeReturn({
      ...packet,
      canvasF13EvidenceReady: true
    });

    if (record.forbiddenClaimDetected) {
      state.rejectedRecords.push(record);
      return makeReceipt({
        accepted: false,
        returnClass: record.returnClass,
        inputStatus: "CANVAS_EVIDENCE_REQUEST_REJECTED",
        outputStatus: "FORBIDDEN_CLAIM_DETECTED",
        failureReasons: ["FORBIDDEN_CLAIM_DETECTED"]
      });
    }

    state.returnRecords.push(record);

    return Object.freeze({
      accepted: true,
      artifactId: META.artifactId,
      requestType: "CANVAS_EVIDENCE_REQUEST_ONLY",
      authorizesCanvasRelease: false,
      returnRecord: freezeClone(record),
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
      returnRecordCount: state.returnRecords.length,
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
        "South return branch shell. It preserves bounded return, failure, proof, and evidence-request records. It does not validate telemetry, evaluate the kernel, render output, latch final authority, or complete Engine 1."
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

    required(META.branchBoundary.thisFileIsEntireDiagnosticEngine === false, "SOUTH_FALSE_COMPLETION_CLAIM_FORBIDDEN");
    required(META.branchBoundary.thisFileIsAllOfEngine1 === false, "SOUTH_ENGINE_1_TOTALITY_CLAIM_FORBIDDEN");
    required(META.branchBoundary.thisFileReplacesRuntimeTable === false, "SOUTH_RUNTIME_TABLE_REPLACEMENT_CLAIM_FORBIDDEN");
    required(META.branchBoundary.thisFileReplacesEngines2Through4 === false, "SOUTH_ENGINE_2_THROUGH_4_REPLACEMENT_CLAIM_FORBIDDEN");
    required(META.branchBoundary.thisFileValidatesTelemetryIntegrity === false, "SOUTH_TELEMETRY_VALIDATION_CLAIM_FORBIDDEN");
    required(META.branchBoundary.thisFileEvaluatesKernel === false, "SOUTH_KERNEL_EVALUATION_CLAIM_FORBIDDEN");
    required(META.branchBoundary.thisFileRendersWebsiteOutput === false, "SOUTH_RENDERING_CLAIM_FORBIDDEN");
    required(META.branchBoundary.thisFileAuthorizesCanvasRelease === false, "SOUTH_CANVAS_RELEASE_AUTHORIZATION_CLAIM_FORBIDDEN");

    validateFoundationCompatibility();
    validateRuntimeTableCompatibility();

    return Object.freeze({
      pass: true,
      artifactId: META.artifactId,
      filename: META.filename,
      foundationId: META.foundationId,
      runtimeTableId: META.runtimeTableId,
      branchBoundaryPreserved: true,
      southReturnBranchPreserved: true,
      failureRoutePreserved: true,
      resultRoutePreserved: true,
      canvasEvidenceRequestBoundaryPreserved: true,
      kernelModified: false,
      productionAuthorized: false,
      deploymentAuthorized: false,
      publicReleaseAuthorized: false
    });
  }

  return Object.freeze({
    ...META,
    STATUS,
    RETURN_CLASS,
    FAILURE_STATES,
    classifyReturn,
    normalizeReturn,
    acceptReturn,
    routeFailureToEngine4,
    routeResultToEngine4,
    prepareCanvasEvidenceRequest,
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
  globalThis.AUDRALIA_RUNTIME_TABLE_SOUTH_v1 = AUDRALIA_RUNTIME_TABLE_SOUTH_v1;
  globalThis.RUNTIME_TABLE_SOUTH = AUDRALIA_RUNTIME_TABLE_SOUTH_v1;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = AUDRALIA_RUNTIME_TABLE_SOUTH_v1;
}

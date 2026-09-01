#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PROTOCOL,
  PROTOCOL_VERSION,
  createReceipt,
  verifyReceipt
} from "../../../infrastructure/lineage-receipt-protocol-v1/javascript/lineage_receipt_protocol_v1.mjs";
import {
  validateAiEvidenceTransformation,
  validateAuthorityTransition,
  validateBoundaryMetadata,
  validateRuntimeCaptureOrder,
  validateSemanticDecision
} from "./conformance-core.v1.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const value = (flag, fallback = null) => {
  const index = args.indexOf(flag);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};
const outputPath = value("--output");
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(here, relative), "utf8"));

const contracts = readJson("contracts.v1.json");
const validSemantic = readJson("fixtures/valid-semantic-decision.v1.json");
const invalidUnknownEdge = readJson("fixtures/invalid-unknown-edge.v1.json");
const invalidAiInflation = readJson("fixtures/invalid-ai-claim-inflation.v1.json");
const invalidTeardown = readJson("fixtures/invalid-teardown-before-capture.v1.json");

const checks = [];
function requireCheck(name, condition, detail = "") {
  checks.push({ name, pass: Boolean(condition), detail });
  if (!condition) throw new Error(`${name}${detail ? `:${detail}` : ""}`);
}

async function main() {
  const semanticValid = validateSemanticDecision(validSemantic, contracts);
  requireCheck("VALID_SEMANTIC_DECISION_ACCEPTED", semanticValid.valid, semanticValid.issues.join(","));

  const unknownEdge = validateSemanticDecision(invalidUnknownEdge, contracts);
  requireCheck(
    "UNKNOWN_EDGE_REJECTED",
    !unknownEdge.valid && unknownEdge.issues.includes("SEMANTIC_EDGE_REQUIRES_ASSERTED"),
    unknownEdge.issues.join(",")
  );

  const aiInvalid = validateAiEvidenceTransformation(invalidAiInflation, contracts);
  requireCheck(
    "AI_CLAIM_INFLATION_REJECTED",
    !aiInvalid.valid &&
      aiInvalid.issues.includes("AI_CLAIM_CEILING_VIOLATION") &&
      aiInvalid.issues.includes("AI_UNAUTHORIZED_ASSERTION") &&
      aiInvalid.issues.includes("AI_UNRESOLVED_STATE_SUPPRESSED"),
    aiInvalid.issues.join(",")
  );

  const runtimeInvalid = validateRuntimeCaptureOrder(invalidTeardown, contracts);
  requireCheck(
    "TEARDOWN_BEFORE_CAPTURE_REJECTED",
    !runtimeInvalid.valid &&
      runtimeInvalid.issues.includes("TEARDOWN_BEFORE_CAPTURE") &&
      runtimeInvalid.issues.includes("TEARDOWN_BEFORE_PERSISTENCE"),
    runtimeInvalid.issues.join(",")
  );

  const invalidTransition = validateAuthorityTransition({
    previousState: "UNKNOWN",
    nextState: "ASSERTED",
    authorityReceiptId: null,
    sourceEvidenceReceiptIds: [],
    standingChanged: false,
    standingAuthorityReceiptId: null,
    claimCeilingChanged: false,
    claimCeilingAuthorityReceiptId: null
  }, contracts);
  requireCheck(
    "UNAUTHORIZED_ASSERTION_TRANSITION_REJECTED",
    !invalidTransition.valid &&
      invalidTransition.issues.includes("AUTHORITY_TRANSITION_REQUIRES_AUTHORITY_RECEIPT") &&
      invalidTransition.issues.includes("AUTHORITY_TRANSITION_TO_ASSERTED_REQUIRES_EVIDENCE"),
    invalidTransition.issues.join(",")
  );

  const validTransition = validateAuthorityTransition({
    previousState: "UNKNOWN",
    nextState: "ASSERTED",
    authorityReceiptId: "LRP:AUTHORITY-001",
    sourceEvidenceReceiptIds: ["LRP:EVIDENCE-001"],
    standingChanged: false,
    standingAuthorityReceiptId: null,
    claimCeilingChanged: false,
    claimCeilingAuthorityReceiptId: null
  }, contracts);
  requireCheck("AUTHORIZED_ASSERTION_TRANSITION_ACCEPTED", validTransition.valid, validTransition.issues.join(","));

  const validAi = validateAiEvidenceTransformation({
    schemaVersion: "AI_EVIDENCE_CONFORMANCE_PROFILE_v1",
    transformationId: "AI_POSITIVE_001",
    inputAuthority: {
      sourceReceiptIds: ["LRP:SOURCE-UNKNOWN-001"],
      sourceRelationStates: ["UNKNOWN"],
      permittedOutputClaimClasses: ["HYPOTHESIS"],
      preserveUnresolvedStates: true
    },
    output: {
      mutatesSourceReceipt: false,
      claims: [{
        claimId: "HYPOTHESIS_001",
        claimClass: "HYPOTHESIS",
        epistemicMode: "HYPOTHESIS",
        relationState: "UNKNOWN",
        sourceReceiptIds: ["LRP:SOURCE-UNKNOWN-001"],
        authorizedTransitionReceiptId: null,
        suppressesUnresolvedState: false
      }]
    }
  }, contracts);
  requireCheck("BOUNDED_AI_HYPOTHESIS_ACCEPTED", validAi.valid, validAi.issues.join(","));

  const validRuntime = validateRuntimeCaptureOrder({
    schemaVersion: "RUNTIME_CAPTURE_ORDER_PROFILE_v1",
    captureId: "RUNTIME_POSITIVE_001",
    failureObserved: true,
    capturePayloadPresent: true,
    sealedReceiptPresent: true,
    persistedArtifactPresent: true,
    events: [
      { sequence: 1, type: "FAILURE_OBSERVED" },
      { sequence: 2, type: "CAPTURED" },
      { sequence: 3, type: "SEALED" },
      { sequence: 4, type: "PERSISTED" },
      { sequence: 5, type: "TEARDOWN" }
    ]
  }, contracts);
  requireCheck("TEARDOWN_SAFE_CAPTURE_ACCEPTED", validRuntime.valid, validRuntime.issues.join(","));

  const boundary = validateBoundaryMetadata({
    lrpv1CoreMutationPerformed: false,
    subjectSystemMutationPerformed: false,
    scientificClaimUpgradePerformed: false,
    graphContractConstructed: false
  }, contracts);
  requireCheck("NON_DUPLICATION_BOUNDARY_ACCEPTED", boundary.valid, boundary.issues.join(","));

  const subjectHead = process.env.EXPECTED_HEAD || process.env.GITHUB_SHA || "LOCAL_UNBOUND";
  const summary = {
    schema: "SEMANTIC_EVIDENCE_CONFORMANCE_VERIFICATION_SUMMARY_v1",
    result: "PASS",
    operationId: "ESTATE_SEMANTIC_EVIDENCE_CONFORMANCE_SUPPORT_v1",
    subjectHead,
    preSealChecksPassed: checks.filter((check) => check.pass).length,
    preSealChecksFailed: checks.filter((check) => !check.pass).length,
    negativeFixturesRejected: 4,
    lrpv1Protocol: PROTOCOL,
    lrpv1Version: PROTOCOL_VERSION,
    lrpv1CoreMutationPerformed: false,
    subjectSystemMutationPerformed: false,
    scientificClaimUpgradePerformed: false,
    graphContractConstructed: false,
    tabletCoveragePathsTouched: false
  };

  const lrpReceipt = await createReceipt(summary);
  const lrpVerification = await verifyReceipt(lrpReceipt);
  requireCheck("LRPV1_SUMMARY_RECEIPT_VALID", lrpVerification.state === "VALID", lrpVerification.reasons.join(","));

  const tampered = JSON.parse(JSON.stringify(lrpReceipt));
  tampered.payload.result = "FAIL";
  const tamperVerification = await verifyReceipt(tampered);
  requireCheck(
    "LRPV1_TAMPER_REJECTED",
    tamperVerification.state === "INVALID" && tamperVerification.reasons.includes("LINEAGE_DIGEST_MISMATCH"),
    tamperVerification.reasons.join(",")
  );

  const receipt = {
    schema: "SEMANTIC_EVIDENCE_CONFORMANCE_VERIFICATION_RECEIPT_v1",
    result: "PASS",
    operationId: "ESTATE_SEMANTIC_EVIDENCE_CONFORMANCE_SUPPORT_v1",
    candidateHead: subjectHead,
    contractSchema: contracts.schema,
    relationStates: contracts.relationResolution.states,
    finalChecksPassed: checks.filter((check) => check.pass).length,
    finalChecksFailed: checks.filter((check) => !check.pass).length,
    checks,
    negativeFixtureResults: {
      unknownEdge,
      aiClaimInflation: aiInvalid,
      teardownBeforeCapture: runtimeInvalid,
      unauthorizedAssertionTransition: invalidTransition
    },
    lrpv1: {
      protocol: PROTOCOL,
      protocolVersion: PROTOCOL_VERSION,
      receipt: lrpReceipt,
      verification: lrpVerification,
      deliberateTamperVerification: tamperVerification
    },
    boundaries: {
      lrpv1CoreMutationPerformed: false,
      estateValidationCoreReplaced: false,
      repositoryAiRouterModified: false,
      subjectSystemMutationPerformed: false,
      scientificClaimUpgradePerformed: false,
      graphContractConstructed: false,
      tabletCoveragePathsTouched: false,
      externalValidationClaimed: false,
      certificationOrAccreditationClaimed: false
    }
  };

  const serialized = `${JSON.stringify(receipt, null, 2)}\n`;
  if (outputPath) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, serialized);
  } else {
    process.stdout.write(serialized);
  }
}

main().catch((error) => {
  const failure = {
    schema: "SEMANTIC_EVIDENCE_CONFORMANCE_VERIFICATION_RECEIPT_v1",
    result: "FAIL_CLOSED",
    operationId: "ESTATE_SEMANTIC_EVIDENCE_CONFORMANCE_SUPPORT_v1",
    error: String(error?.message || error),
    checks
  };
  const serialized = `${JSON.stringify(failure, null, 2)}\n`;
  if (outputPath) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, serialized);
  } else {
    process.stderr.write(serialized);
  }
  process.exit(1);
});

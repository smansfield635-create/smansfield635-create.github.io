#!/usr/bin/env node
import fs from 'node:fs';

const policyPath = '.github/ai-router/page-mutation-proportionality-policy.v1.json';
const policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
const q = policy.qualificationRouting;

const checks = {
  schema: q?.schema === 'QUALIFICATION_PROPORTIONALITY_POLICY_v1',
  activeFailClosed: q?.status === 'ACTIVE_FAIL_CLOSED',
  separationLaw: q?.separationLaw === 'FILESYSTEM_OWNERSHIP_IS_NOT_PRODUCT_SEMANTICS_IS_NOT_QUALIFICATION_SCOPE',
  awardsNamespaceOnly: q?.awardsUnderHEarth?.namespaceQualification === 'BOUNDED_H_EARTH_PATH_REGISTRY_PREFLIGHT',
  awardsNotFullHEarth: q?.awardsUnderHEarth?.fullHEarthEngineQualificationByDirectoryLocation === false,
  awardsOwnVerifier: q?.awardsUnderHEarth?.behavioralQualification === 'AWARDS_PRODUCT_SPECIFIC_VERIFIER',
  oneRelevantIntegrationCheck: q?.awardsUnderHEarth?.integrationQualification === 'ONE_RELEVANT_AWARDS_H_EARTH_INTEGRATION_SANITY_CHECK',
  byteIdenticalContinuity: q?.byteIdenticalRebind?.whenCandidateBlobsIdentical === 'CONTINUITY_VERIFICATION',
  noDesignRestart: q?.byteIdenticalRebind?.designRestartRequired === false,
  noScientificRestart: q?.byteIdenticalRebind?.scientificRestartRequired === false,
  historicalNonGating: q?.historicalFailureLaw === 'WORKFLOW_FAILURE_BEFORE_CANDIDATE_INSPECTION_IS_EVIDENCE_ONLY_NOT_A_GATE',
  trueCrossSubsystemGateRetained: q?.crossSubsystemChange?.retainRelevantCrossSubsystemGate === true,
  directoryAloneNotCrossSubsystem: q?.crossSubsystemChange?.directoryLocationAloneCreatesCrossSubsystemChange === false,
  ambiguityFailsClosed: q?.ambiguityDisposition === 'FAIL_CLOSED_TO_BROADER_RELEVANT_QUALIFICATION',
  prerequisiteConvergence: q?.prerequisiteConvergence?.reuseEstablishedBoundedPathFamilyRegistration === true,
  releaseSeparate: Array.isArray(q?.sequence) && q.sequence.at(-1) === 'RELEASE_SEPARATELY',
  exactProofLadder: JSON.stringify(q?.proofLadder) === JSON.stringify([
    'EXACT_BASE',
    'EXACT_DECLARED_DIFF',
    'PATH_AUTHORITY_VALID',
    'PRODUCT_SPECIFIC_VERIFIER',
    'ONE_RELEVANT_INTEGRATION_CHECK',
    'PASS_CLOSED'
  ]),
  authorityStillProportionalOnly: policy.authorityEffect === 'PROPORTIONAL_ROUTING_ONLY'
};

const result = Object.values(checks).every(Boolean) ? 'PASS_CLOSED' : 'FAIL_CLOSED';
const receipt = {
  schema: 'QUALIFICATION_PROPORTIONALITY_SELF_TEST_RECEIPT_v1',
  result,
  policyPath,
  checkCount: Object.keys(checks).length,
  checks,
  proves: [
    'AWARDS_UNDER_H_EARTH_IS_NOT_FULL_H_EARTH_ENGINE_CHANGE',
    'BYTE_IDENTICAL_REBIND_USES_CONTINUITY',
    'HISTORICAL_FAILURE_BEFORE_CANDIDATE_INSPECTION_IS_NON_GATING',
    'TRUE_CROSS_SUBSYSTEM_CHANGE_RETAINS_CROSS_SUBSYSTEM_GATE',
    'AMBIGUITY_FAILS_CLOSED'
  ],
  authorityCreated: false,
  productMutationAuthorized: false,
  deploymentOrPublicationAuthorized: false
};

process.stdout.write(JSON.stringify(receipt, null, 2) + '\n');
process.exit(result === 'PASS_CLOSED' ? 0 : 1);

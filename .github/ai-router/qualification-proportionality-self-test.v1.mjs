#!/usr/bin/env node
import fs from 'node:fs';

const POLICY_PATH = new URL('./page-mutation-proportionality-policy.v1.json', import.meta.url);
const policy = JSON.parse(fs.readFileSync(POLICY_PATH, 'utf8'));
const q = policy.qualificationRouting;

function assert(condition, code) {
  if (!condition) {
    const error = new Error(code);
    error.code = code;
    throw error;
  }
}

function evaluateCase(name, fn) {
  try {
    fn();
    return { name, result: 'PASS' };
  } catch (error) {
    return { name, result: 'FAIL', errorCode: error.code || error.message };
  }
}

const cases = [
  evaluateCase('AWARDS_UNDER_H_EARTH_IS_NOT_FULL_H_EARTH_ENGINE_CHANGE', () => {
    assert(q.awardsUnderHEarth.pathFamily === 'showroom/globe/h-earth/awards/**', 'AWARDS_PATH_FAMILY_DRIFT');
    assert(q.awardsUnderHEarth.fullHEarthEngineQualificationImpliedByPathNesting === false, 'PATH_NESTING_CONFLATED_WITH_ENGINE_SCOPE');
    assert(q.awardsUnderHEarth.qualificationScope === 'AWARDS_ONLY_UNLESS_DECLARED_DIFF_CROSSES_A_REAL_H_EARTH_ENGINE_DEPENDENCY', 'AWARDS_QUALIFICATION_SCOPE_DRIFT');
    assert(q.awardsUnderHEarth.hEarthRegistryAndPreflightRole === 'BOUNDED_NAMESPACE_AND_PATH_AUTHORITY_CHECK', 'H_EARTH_PREFLIGHT_ROLE_DRIFT');
    assert(q.awardsUnderHEarth.requiredProductVerifier === 'AWARDS_SPECIFIC_VERIFIER', 'AWARDS_VERIFIER_NOT_PRIMARY');
    assert(q.awardsUnderHEarth.requiredIntegrationCheckCount === 1, 'AWARDS_INTEGRATION_CHECK_COUNT_DRIFT');
  }),

  evaluateCase('BYTE_IDENTICAL_REBIND_USES_CONTINUITY', () => {
    assert(q.rebindLaw.byteIdenticalCandidateWithUnchangedRelevantDependencies === 'CONTINUITY_VERIFICATION', 'BYTE_IDENTICAL_REBIND_NOT_CONTINUITY');
    assert(q.rebindLaw.designOrScientificRestartRequired === false, 'BYTE_IDENTICAL_REBIND_RESTARTS_DESIGN');
  }),

  evaluateCase('HISTORICAL_FAILURE_BEFORE_CANDIDATE_INSPECTION_IS_NON_GATING', () => {
    assert(q.historicalFailureBeforeCandidateInspectionDisposition === 'EVIDENCE_ONLY_NON_GATING', 'IRRELEVANT_HISTORY_STILL_GATES');
    assert(q.gateSelectionLaw === 'A_CHECK_MAY_GATE_ONLY_IF_THE_CURRENT_CANDIDATE_CAN_CAUSE_ITS_FAILURE_CLASS_AND_THE_CHECK_INSPECTS_THAT_DEPENDENCY_OR_SURFACE', 'DISCRIMINATING_GATE_LAW_DRIFT');
  }),

  evaluateCase('TRUE_CROSS_SUBSYSTEM_CHANGE_RETAINS_CROSS_SUBSYSTEM_GATE', () => {
    assert(q.crossSubsystemLaw.realDependencyCrossed === 'RETAIN_RELEVANT_CROSS_SUBSYSTEM_INTEGRATION_GATES', 'TRUE_CROSS_SUBSYSTEM_GATE_DROPPED');
    assert(q.crossSubsystemLaw.directoryNestingAloneCreatesDependency === false, 'DIRECTORY_NESTING_CREATES_FALSE_DEPENDENCY');
  }),

  evaluateCase('AMBIGUITY_FAILS_CLOSED', () => {
    assert(q.ambiguityDisposition === 'FAIL_CLOSED_RUNTIME_OR_AUTHORITY', 'AMBIGUITY_NOT_FAIL_CLOSED');
    assert(policy.ambiguityDisposition === 'RUNTIME_OR_AUTHORITY', 'ROUTER_AMBIGUITY_CONTRACT_DRIFT');
    assert(policy.mixedPathDisposition === 'RUNTIME_OR_AUTHORITY', 'MIXED_PATH_CONTRACT_DRIFT');
  })
];

const structuralChecks = [
  q?.schema === 'QUALIFICATION_PROPORTIONALITY_POLICY_v1',
  JSON.stringify(q.governingSequence) === JSON.stringify([
    'CLASSIFY_CHANGE',
    'ROUTE_EXACT_PATH_AUTHORITY',
    'ONE_ADMISSION_IF_REQUIRED',
    'RUN_ONLY_DISCRIMINATING_CHECKS',
    'MERGE',
    'RELEASE_SEPARATELY'
  ]),
  q.separationLaw === 'FILESYSTEM_OWNERSHIP_NE_PRODUCT_SEMANTICS_NE_QUALIFICATION_SCOPE',
  JSON.stringify(q.proofLadder) === JSON.stringify([
    'EXACT_BASE',
    'EXACT_DECLARED_DIFF',
    'PATH_AUTHORITY_VALID',
    'PRODUCT_SPECIFIC_VERIFIER',
    'ONE_RELEVANT_INTEGRATION_CHECK',
    'PASS_CLOSED'
  ]),
  q.mergeIsRelease === false,
  policy.runtimeAuthorityCannotBeCreatedByProportionalClassification === true,
  policy.proportionalClassificationCannotBypassExactDiffVerification === true,
  policy.authorityEffect === 'PROPORTIONAL_ROUTING_ONLY'
];

const allCasesPass = cases.every(x => x.result === 'PASS');
const structuralPass = structuralChecks.every(Boolean);
const receipt = {
  schema: 'QUALIFICATION_PROPORTIONALITY_SELF_TEST_RECEIPT_v1',
  result: allCasesPass && structuralPass ? 'PASS_CLOSED' : 'FAIL_CLOSED',
  caseCount: cases.length,
  cases,
  structuralCheckCount: structuralChecks.length,
  structuralChecks,
  policyPath: '.github/ai-router/page-mutation-proportionality-policy.v1.json',
  authorityCreated: false,
  productMutationPerformed: false,
  publicationOrDeploymentAuthorized: false
};

process.stdout.write(JSON.stringify(receipt, null, 2) + '\n');
process.exit(receipt.result === 'PASS_CLOSED' ? 0 : 1);

import assert from 'node:assert/strict';
import {
  EXPECTED_HC03_CANDIDATE,
  evaluateCarrierIdentity,
  writeReceipt
} from './carrier-identity-gate.v1.mjs';

const EXECUTION_HEAD = 'dedfdcf8c53207234791193144dc47f3d46caeb0';
const OTHER_HEAD = '01da797ff4d46f0b1514dc06a5179818b14b3dfa';

const base = {
  candidateHead: EXPECTED_HC03_CANDIDATE,
  expectedCandidateHead: EXPECTED_HC03_CANDIDATE,
  executionHead: EXECUTION_HEAD,
  evidenceSourceHead: EXECUTION_HEAD,
  wrapperDeclaredHead: EXECUTION_HEAD,
  precheckContractIdentity: 'HC03_GENERIC_BROWSER_PRECHECK_v1',
  verifierCapabilityIdentity: 'RUN8E_PLAYWRIGHT_CHROMIUM_MATRIX_TECHNICAL_CAPABILITY_v1',
  authorityLineage: ['L2_HC03_EXACT_CANDIDATE_BROWSER_VERIFICATION_REQUEST_v1'],
  browserCapability: {
    technicalReuseOnly: true,
    authorityReuse: false,
    workflowId: 320949283,
    workflowPath: '.github/workflows/h-earth-run8e-public-route-validation.yml',
    browserEngine: 'PLAYWRIGHT_CHROMIUM'
  },
  wrapperUsedAsAuthority: false,
  precheckUsedAsAuthority: false,
  capabilityReuseAcknowledged: true,
  authorityReuseAcknowledged: false,
  freshReceiptRequired: true,
  receiptIdentity: 'L2_HC03_CANDIDATE_BOUND_BROWSER_RECEIPT_v1'
};

const cases = [];

function run(id, input, expectedResult, expectedCode = null) {
  const receipt = evaluateCarrierIdentity(input);
  assert.equal(receipt.result, expectedResult, `${id}: unexpected result`);
  if (expectedCode !== null) {
    if (receipt.result === 'STOP') {
      assert.equal(receipt.errorCode, expectedCode, `${id}: unexpected error`);
    } else {
      assert.equal(
        receipt.diagnostics.some((item) => item.code === expectedCode),
        true,
        `${id}: expected diagnostic missing`
      );
    }
  }
  cases.push({ id, result: receipt.result, expectedCode, receipt });
  return receipt;
}

run('EXACT_CANDIDATE_CAPABILITY_REUSE', base, 'ROUTE_ADMISSIBLE');
run('B10_AUTHORITY_REUSE_REJECTED', { ...base, authorityLineage: ['H_EARTH_B10'] }, 'STOP', 'AUTHORITY_LINEAGE_SUPERSEDED');
run('RUN7I_AUTHORITY_REUSE_REJECTED', { ...base, authorityLineage: ['RUN7I'] }, 'STOP', 'AUTHORITY_LINEAGE_SUPERSEDED');
run('HISTORICAL_HEAD_AUTHORITY_REUSE_REJECTED', { ...base, authorityLineage: ['36933be2d4d1a4de7229766ff5b9b89f99ee8e3a'] }, 'STOP', 'AUTHORITY_LINEAGE_SUPERSEDED');
run('CANDIDATE_MISMATCH_FAILS_CLOSED', { ...base, candidateHead: OTHER_HEAD }, 'STOP', 'CANDIDATE_HEAD_MISMATCH');
const stale = run('STALE_WRAPPER_DIAGNOSED_NOT_CANDIDATE_DEFECT', { ...base, wrapperDeclaredHead: OTHER_HEAD }, 'ROUTE_ADMISSIBLE_WITH_DIAGNOSTIC', 'CARRIER_STALE_IDENTITY');
assert.equal(stale.candidateDefectEstablished, false);
const obsolete = run('OBSOLETE_PRECHECK_DIAGNOSED_NOT_CANDIDATE_DEFECT', { ...base, precheckContractIdentity: 'RUN7I_SOURCE_PRECHECK', precheckUsedAsAuthority: false }, 'ROUTE_ADMISSIBLE_WITH_DIAGNOSTIC', 'PRECHECK_SCHEMA_OBSOLETE');
assert.equal(obsolete.candidateDefectEstablished, false);
run('OBSOLETE_PRECHECK_CANNOT_GATE_CURRENT_CANDIDATE', { ...base, precheckContractIdentity: 'RUN7I_SOURCE_PRECHECK', precheckUsedAsAuthority: true }, 'STOP', 'PRECHECK_SCHEMA_OBSOLETE');
run('STALE_WRAPPER_CANNOT_CREATE_AUTHORITY', { ...base, wrapperDeclaredHead: OTHER_HEAD, wrapperUsedAsAuthority: true }, 'STOP', 'CARRIER_STALE_IDENTITY');
run('AMBIGUOUS_AUTHORITY_LINEAGE_FAILS_CLOSED', { ...base, authorityLineage: null }, 'STOP', 'AMBIGUOUS_STOP');
run('TECHNICAL_CAPABILITY_WITH_AUTHORITY_REUSE_REJECTED', { ...base, browserCapability: { ...base.browserCapability, authorityReuse: true } }, 'STOP', 'BROWSER_CAPABILITY_UNAVAILABLE');

const receipt = {
  schema: 'L2_HC03_BROWSER_VERIFIER_ROUTING_SELF_TEST_RECEIPT_v1',
  result: 'PASS_CLOSED',
  exactCandidateHead: EXPECTED_HC03_CANDIDATE,
  caseCount: cases.length,
  passedCaseCount: cases.length,
  capabilityReuseProven: true,
  authorityNoninheritanceProven: true,
  candidateMismatchFailsClosed: true,
  staleWrapperSeparatedFromCandidateDefect: true,
  obsoletePrecheckSeparatedFromCandidateDefect: true,
  mergeAuthorityCreated: false,
  hEarthMutationAuthorityCreated: false,
  lawsAuthorityCreated: false,
  cases
};

const outputArgIndex = process.argv.indexOf('--output');
if (outputArgIndex >= 0) {
  const output = process.argv[outputArgIndex + 1];
  if (!output) throw new Error('--output requires a file');
  writeReceipt(output, receipt);
}
console.log(JSON.stringify(receipt, null, 2));

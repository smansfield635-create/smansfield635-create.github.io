import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseArgs } from 'node:util';
import { evaluateApplicability, getStandardMetadata } from './applicability-gate.v1.mjs';
import { evaluateEvidenceCrosswalk } from './evidence-crosswalk.v1.mjs';

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: { output: { type: 'string' } },
  strict: true
});

const cases = [];
const run = (id, fn) => {
  try {
    fn();
    cases.push({ id, result: 'PASS' });
  } catch (error) {
    cases.push({ id, result: 'FAIL', error: error.message });
  }
};
const req = (standardId, instrumentType, attributes = {}) => ({
  schema: 'L2_EXTERNAL_STANDARD_APPLICABILITY_REQUEST_v1',
  standardId,
  instrumentType,
  attributes
});

run('ISO25010_SOFTWARE_PRODUCT_APPLIES', () => {
  assert.equal(evaluateApplicability(req('ISO_IEC_25010_2023', 'SOFTWARE_PRODUCT')).applicability, 'APPLICABLE');
});
run('ISO25023_REVISION_WATCH_PRESERVED', () => {
  const receipt = evaluateApplicability(req('ISO_IEC_25023_2016_REVISION_WATCH', 'SOFTWARE_PRODUCT', { quantitativeQualityEvaluation: true }));
  assert.equal(receipt.result, 'PASS');
  assert.equal(receipt.revisionWatch, true);
});
run('29119_TEST_HARNESS_APPLIES', () => {
  assert.equal(evaluateApplicability(req('ISO_IEC_IEEE_29119_2_2021', 'SOFTWARE_TEST_HARNESS')).applicability, 'APPLICABLE');
});
run('IEEE1012_REQUIRES_VV_ACTIVITY', () => {
  assert.equal(evaluateApplicability(req('IEEE_1012_2024', 'SOFTWARE_TEST_HARNESS', { verificationOrValidationActivity: true })).applicability, 'APPLICABLE');
  assert.equal(evaluateApplicability(req('IEEE_1012_2024', 'SOFTWARE_TEST_HARNESS', { verificationOrValidationActivity: false })).applicability, 'NOT_APPLICABLE');
});
run('12207_LIFECYCLE_APPLIES', () => {
  assert.equal(evaluateApplicability(req('ISO_IEC_IEEE_12207_2026', 'SOFTWARE_LIFECYCLE_SYSTEM')).applicability, 'APPLICABLE');
});
run('SSDF_SECURE_DEVELOPMENT_APPLIES', () => {
  assert.equal(evaluateApplicability(req('NIST_SP_800_218_V1_1_FINAL', 'SECURE_SOFTWARE_DEVELOPMENT_SYSTEM')).applicability, 'APPLICABLE');
});
run('ISO10012_REQUIRES_MEASUREMENT_MANAGEMENT', () => {
  assert.equal(evaluateApplicability(req('ISO_10012_2026', 'QUANTITATIVE_MEASUREMENT_SYSTEM', { measurementManagementSystem: true })).applicability, 'APPLICABLE');
  assert.equal(evaluateApplicability(req('ISO_10012_2026', 'DETERMINISTIC_SCORE')).applicability, 'NOT_APPLICABLE');
});
run('ISO17025_GENERIC_SOFTWARE_CANNOT_INHERIT_LAB_COMPLIANCE_SCOPE', () => {
  const receipt = evaluateApplicability(req('ISO_IEC_17025_2017', 'SOFTWARE_TEST_HARNESS'));
  assert.equal(receipt.applicability, 'PRINCIPLE_LEVEL_ONLY');
  assert.match(receipt.laboratoryBoundary, /NO_LABORATORY_COMPLIANCE/);
});
run('ISO17025_LAB_CONTEXT_APPLIES', () => {
  assert.equal(evaluateApplicability(req('ISO_IEC_17025_2017', 'TEST_OR_CALIBRATION_LABORATORY_PROCESS', { laboratoryContext: true })).applicability, 'APPLICABLE');
});
run('GUM_DETERMINISTIC_SCORE_WITHHELD', () => {
  assert.equal(evaluateApplicability(req('JCGM_100_2008_AMD1_2026', 'DETERMINISTIC_SCORE', { outputClassification: 'DETERMINISTIC_SCORE' })).applicability, 'NOT_APPLICABLE');
});
run('GUM_TRUE_MEASURAND_APPLIES', () => {
  const receipt = evaluateApplicability(req('JCGM_100_2008_AMD1_2026', 'QUANTITATIVE_MEASUREMENT_SYSTEM', { outputClassification: 'MEASUREMENT_RESULT', hasDefinedMeasurand: true }));
  assert.equal(receipt.applicability, 'APPLICABLE');
});
run('GUM_AMBIGUOUS_MEASURAND_FAILS_CLOSED', () => {
  const receipt = evaluateApplicability(req('JCGM_100_2008_AMD1_2026', 'QUANTITATIVE_MEASUREMENT_SYSTEM'));
  assert.equal(receipt.result, 'STOP');
  assert.equal(receipt.errorCode, 'APPLICABILITY_AMBIGUOUS');
});
run('UNKNOWN_STANDARD_FAILS_CLOSED', () => {
  assert.equal(evaluateApplicability(req('NOT_A_STANDARD', 'SOFTWARE_PRODUCT')).errorCode, 'STANDARD_IDENTITY_UNKNOWN');
});
run('NONCURRENT_UNWATCHED_STANDARD_STATUS_FAILS_CLOSED', () => {
  const base = getStandardMetadata('ISO_IEC_25010_2023');
  const registry = { standards: [{ ...base, status: 'WITHDRAWN' }] };
  const receipt = evaluateApplicability(req('ISO_IEC_25010_2023', 'SOFTWARE_PRODUCT'), { registry });
  assert.equal(receipt.errorCode, 'STANDARD_STATUS_NOT_CURRENT_OR_EXPLICITLY_WATCHED');
});
run('INVALID_DISPOSITION_FAILS_CLOSED', () => {
  const applicabilityReceipt = evaluateApplicability(req('ISO_IEC_25010_2023', 'SOFTWARE_PRODUCT'));
  const receipt = evaluateEvidenceCrosswalk({ schema: 'L2_EXTERNAL_STANDARD_EVIDENCE_CROSSWALK_REQUEST_v1', applicabilityReceipt, requirementThemeId: 'QUALITY_MODEL_COVERAGE', disposition: 'PASS', evidence: [] });
  assert.equal(receipt.errorCode, 'EVIDENCE_DISPOSITION_INVALID');
});
run('EVIDENCED_REQUIRES_EVIDENCE', () => {
  const applicabilityReceipt = evaluateApplicability(req('ISO_IEC_IEEE_29119_2_2021', 'SOFTWARE_TEST_HARNESS'));
  const receipt = evaluateEvidenceCrosswalk({ schema: 'L2_EXTERNAL_STANDARD_EVIDENCE_CROSSWALK_REQUEST_v1', applicabilityReceipt, requirementThemeId: 'TEST_PROCESS_TRACEABILITY', disposition: 'EVIDENCED', evidence: [] });
  assert.equal(receipt.errorCode, 'EVIDENCE_DISPOSITION_INVALID');
});
run('COMPLIANCE_OVERCLAIM_FAILS_CLOSED', () => {
  const applicabilityReceipt = evaluateApplicability(req('ISO_IEC_25010_2023', 'SOFTWARE_PRODUCT'));
  const receipt = evaluateEvidenceCrosswalk({ schema: 'L2_EXTERNAL_STANDARD_EVIDENCE_CROSSWALK_REQUEST_v1', applicabilityReceipt, requirementThemeId: 'QUALITY_MODEL_COVERAGE', disposition: 'PARTIAL', evidence: [], claimLanguage: 'ISO compliant' });
  assert.equal(receipt.errorCode, 'COMPLIANCE_OVERCLAIM_ATTEMPTED');
});
run('COPYRIGHTED_CLAUSE_TEXT_REPLICATION_FAILS_CLOSED', () => {
  const applicabilityReceipt = evaluateApplicability(req('ISO_IEC_25010_2023', 'SOFTWARE_PRODUCT'));
  const receipt = evaluateEvidenceCrosswalk({ schema: 'L2_EXTERNAL_STANDARD_EVIDENCE_CROSSWALK_REQUEST_v1', applicabilityReceipt, requirementThemeId: 'QUALITY_MODEL_COVERAGE', disposition: 'PARTIAL', evidence: [], clauseText: 'prohibited' });
  assert.equal(receipt.errorCode, 'CLAUSE_TEXT_REPLICATION_ATTEMPTED');
});
run('VALID_PARTIAL_CROSSWALK_PRESERVES_BOUNDED_CLAIM', () => {
  const applicabilityReceipt = evaluateApplicability(req('IEEE_1012_2024', 'VV_SYSTEM', { verificationOrValidationActivity: true }));
  const receipt = evaluateEvidenceCrosswalk({ schema: 'L2_EXTERNAL_STANDARD_EVIDENCE_CROSSWALK_REQUEST_v1', applicabilityReceipt, requirementThemeId: 'INDEPENDENCE_AND_INTEGRITY_LEVEL_TREATMENT', disposition: 'PARTIAL', evidence: [{ id: 'fresh-verifier-separation' }], claimLanguage: 'benchmark evidence only' });
  assert.equal(receipt.result, 'PASS');
  assert.equal(receipt.fullStandardConformanceDetermined, false);
});
run('NOT_APPLICABLE_MUST_MATCH_APPLICABILITY', () => {
  const applicabilityReceipt = evaluateApplicability(req('ISO_10012_2026', 'SOFTWARE_PRODUCT'));
  const receipt = evaluateEvidenceCrosswalk({ schema: 'L2_EXTERNAL_STANDARD_EVIDENCE_CROSSWALK_REQUEST_v1', applicabilityReceipt, requirementThemeId: 'MEASUREMENT_MANAGEMENT', disposition: 'NOT_APPLICABLE', evidence: [] });
  assert.equal(receipt.result, 'PASS');
});

const failed = cases.filter(item => item.result !== 'PASS');
const receipt = {
  schema: 'L2_EXTERNAL_STANDARDS_BENCHMARK_SELF_TEST_RECEIPT_v1',
  result: failed.length === 0 ? 'PASS_CLOSED' : 'FAIL_CLOSED',
  caseCount: cases.length,
  passCount: cases.length - failed.length,
  failCount: failed.length,
  cases,
  complianceClaimAuthorized: false,
  certificationClaimAuthorized: false,
  accreditationClaimAuthorized: false,
  copyrightedClauseTextStored: false,
  authorityCreated: false
};
if (values.output) fs.writeFileSync(values.output, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(receipt, null, 2));
if (failed.length) process.exitCode = 1;

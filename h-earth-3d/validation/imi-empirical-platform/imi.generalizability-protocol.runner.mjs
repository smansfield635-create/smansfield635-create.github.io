import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { canonicalDigest } from '../../tools/instrument-platform/platform-core.mjs';

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function assert(condition, code) {
  if (!condition) throw new Error(code);
}

const repositoryRoot = process.cwd();
const outputDir = argValue('--output-dir', '/tmp/imi-generalizability-protocol');
const planPath = path.join(repositoryRoot, 'h-earth-3d/control-plane/imi-empirical-platform/IMI_SCOPE_GENERALIZABILITY_AND_PRACTICAL_VALUE_FIVE_PHASE_PLAN_v1.json');
const protocolPath = path.join(repositoryRoot, 'h-earth-3d/tools/imi-empirical-platform/generalizability/imi-generalizability-protocol.v1.json');
const receiptPath = path.join(repositoryRoot, 'h-earth-3d/tools/imi-empirical-platform/studies/runs/IMI_GENERALIZABILITY_PROTOCOL_v1/imi-generalizability-protocol-receipt.v1.json');

const [plan, protocol, receipt] = await Promise.all(
  [planPath, protocolPath, receiptPath].map(async (filePath) => JSON.parse(await readFile(filePath, 'utf8')))
);

const phase1 = plan.phases?.find((phase) => phase.phase === 1);
const phase2 = plan.phases?.find((phase) => phase.phase === 2);
const phase3 = plan.phases?.find((phase) => phase.phase === 3);

assert(phase1?.status === 'PASS_CLOSED', 'PHASE_1_NOT_CLOSED');
assert(phase2?.operation === 'IMI_GENERALIZABILITY_PROTOCOL_v1', 'PHASE_2_OPERATION_MISMATCH');
assert(phase2?.status === 'PASS_CLOSED', 'PHASE_2_NOT_CLOSED');
assert(phase2?.result === 'PASS_CLOSED_PHASE_2_GENERALIZABILITY_PROTOCOL', 'PHASE_2_RESULT_MISMATCH');
assert(phase3?.status === 'AUTHORIZED_NOT_EXECUTED', 'PHASE_3_STATUS_MISMATCH');
assert(plan.currentProgramState === 'PHASE_2_PASS_CLOSED_PHASE_3_PARALLEL_EXTERNAL_TESTS_AUTHORIZED_NOT_EXECUTED', 'PROGRAM_STATE_MISMATCH');
assert(plan.currentDecision === 'STOP_AFTER_PHASE_2_CLOSE_PHASE_3_AUTHORIZED_NOT_EXECUTED', 'PROGRAM_STOP_MISMATCH');

assert(protocol.schemaVersion === 'IMI_GENERALIZABILITY_PROTOCOL_v1', 'PROTOCOL_SCHEMA_MISMATCH');
assert(protocol.operation === 'IMI_GENERALIZABILITY_PROTOCOL_v1', 'PROTOCOL_OPERATION_MISMATCH');
assert(protocol.status === 'FROZEN', 'PROTOCOL_NOT_FROZEN');
assert(protocol.domainAdmissionStandard?.mandatoryCriteria?.length === 10, 'DOMAIN_ADMISSION_CRITERIA_COUNT_MISMATCH');
assert(protocol.preregisteredCrossDomainHypotheses?.length === 6, 'HYPOTHESIS_COUNT_MISMATCH');
assert(protocol.replicationGrid?.length === 4, 'REPLICATION_GRID_COUNT_MISMATCH');
assert(protocol.heldOutDataRequirements?.mandatoryRules?.length === 10, 'HELD_OUT_RULE_COUNT_MISMATCH');
assert(protocol.independentReproductionStandard?.requiredOutputs?.length === 12, 'REPRODUCTION_OUTPUT_COUNT_MISMATCH');
assert(protocol.phase3Gate?.authorizedTracks?.length === 4, 'PHASE_3_TRACK_COUNT_MISMATCH');
assert(protocol.phase3Gate?.phase4NotAuthorized === true, 'PHASE_4_BOUNDARY_MISSING');
assert(protocol.phase3Gate?.phase5NotAuthorized === true, 'PHASE_5_BOUNDARY_MISSING');

const requiredBoundaries = {
  protocolConstructionOnly: true,
  newDataInspected: false,
  newDataTestsExecuted: false,
  existingRoutesRetuned: false,
  rawCrossRouteScoreComparisonAuthorized: false,
  universalMultiplicativeSuperiorityClaimed: false,
  universalPredictiveValidityClaimed: false,
  causalClaimsAuthorized: false,
  clinicalDiagnosticUseAuthorized: false,
  decisionUtilityClaimed: false,
  finalInstrumentValidationClaimed: false,
  mainMergeAuthorized: false,
  publicReleaseAuthorized: false
};

for (const [key, expected] of Object.entries(requiredBoundaries)) {
  assert(protocol.boundaries?.[key] === expected, `PROTOCOL_BOUNDARY_MISMATCH:${key}`);
  assert(receipt.boundaries?.[key] === expected, `RECEIPT_BOUNDARY_MISMATCH:${key}`);
}

const protocolDigest = canonicalDigest(protocol);
const planDigest = canonicalDigest(plan);
assert(receipt.protocolDigest === protocolDigest, 'PROTOCOL_DIGEST_MISMATCH');
assert(receipt.planDigest === planDigest, 'PLAN_DIGEST_MISMATCH');
assert(receipt.protocolStatus === 'FROZEN', 'RECEIPT_PROTOCOL_STATUS_MISMATCH');
assert(receipt.phase3Authorized === true && receipt.phase3Executed === false, 'PHASE_3_AUTHORITY_BOUNDARY_MISMATCH');
assert(receipt.result === 'PASS_CLOSED_PHASE_2_GENERALIZABILITY_PROTOCOL', 'RECEIPT_RESULT_MISMATCH');

const { receiptDigest, ...receiptBody } = receipt;
assert(receiptDigest === canonicalDigest(receiptBody), 'RECEIPT_DIGEST_MISMATCH');

const result = {
  schemaVersion: 'IMI_GENERALIZABILITY_PROTOCOL_VERIFICATION_RESULT_v1',
  operation: 'IMI_GENERALIZABILITY_PROTOCOL_v1',
  result: 'PASS_CLOSED_PHASE_2_GENERALIZABILITY_PROTOCOL',
  protocolDigest,
  planDigest,
  receiptDigest,
  domainAdmissionCriterionCount: protocol.domainAdmissionStandard.mandatoryCriteria.length,
  preregisteredHypothesisCount: protocol.preregisteredCrossDomainHypotheses.length,
  replicationTrackCount: protocol.replicationGrid.length,
  heldOutMandatoryRuleCount: protocol.heldOutDataRequirements.mandatoryRules.length,
  independentReproductionOutputCount: protocol.independentReproductionStandard.requiredOutputs.length,
  phase3Authorized: true,
  phase3Executed: false,
  phase4Authorized: false,
  phase5Authorized: false,
  boundaries: requiredBoundaries
};

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, 'imi-generalizability-protocol.v1.json'), `${JSON.stringify(protocol, null, 2)}\n`, 'utf8');
await writeFile(path.join(outputDir, 'imi-generalizability-protocol-receipt.v1.json'), `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
await writeFile(path.join(outputDir, 'imi-generalizability-protocol-verification-result.v1.json'), `${JSON.stringify(result, null, 2)}\n`, 'utf8');

console.log(JSON.stringify(result, null, 2));

import { parseArgs, required, emit, readJson, fail } from './assignment-core.mjs';
import { selfTest } from './assignment-self-test.mjs';

const args = parseArgs(process.argv.slice(2));
const builderReceipt = readJson(required(args, 'builder-receipt'));
const suppliedFingerprint = required(args, 'builder-fingerprint');
const builderHead = required(args, 'builder-head');
const builderHolder = required(args, 'builder-holder');
const verifierHolder = required(args, 'verifier-holder');
const baseHead = required(args, 'base-head');
if (builderHolder === verifierHolder) fail('BUILDER_VERIFIER_HOLDER_COLLISION');
if (builderReceipt.schema !== 'METHODS_INFORMATION_BENCHMARK_GENERIC_FIRST_ASSIGNMENT_INFRASTRUCTURE_SELF_TEST_RECEIPT_v1') fail('BUILDER_RECEIPT_SCHEMA_MISMATCH');
if (!builderReceipt.pass || builderReceipt.productionAssignmentPerformed || builderReceipt.permanentRoleAuthorityActivated) fail('BUILDER_RECEIPT_NOT_PASS_CLOSED');
if (builderReceipt.executionHolder !== builderHolder) fail('BUILDER_HOLDER_MISMATCH');
if (builderReceipt.candidateHead !== builderHead) fail('BUILDER_HEAD_MISMATCH');
if (builderReceipt.infrastructureFingerprint !== suppliedFingerprint) fail('BUILDER_FINGERPRINT_ARGUMENT_MISMATCH');
const verifierSelfTest = selfTest(builderHead, baseHead, verifierHolder);
const fingerprintMatch = verifierSelfTest.infrastructureFingerprint === suppliedFingerprint;
const result = {
  schema: 'METHODS_INFORMATION_BENCHMARK_GENERIC_FIRST_ASSIGNMENT_INFRASTRUCTURE_VERIFICATION_RECEIPT_v1',
  executingFunction: 'GENERIC_FIRST_ASSIGNMENT_INFRASTRUCTURE_VERIFIER',
  executionHolder: verifierHolder, builderExecutionHolder: builderHolder,
  distinctExecutionHolders: verifierHolder !== builderHolder,
  candidateHead: builderHead, baseHead,
  builderFingerprint: suppliedFingerprint,
  verifierFingerprint: verifierSelfTest.infrastructureFingerprint,
  fingerprintMatch, selfTestMatch: verifierSelfTest.pass,
  productionAssignmentPerformed: false, permanentRoleAuthorityActivated: false,
  roleIdentityBound: false, operationIdentityBound: false,
  repairPerformed: false, candidateMutationPerformed: false,
  productMutationPerformed: false, mergePerformed: false,
  pass: fingerprintMatch && verifierSelfTest.pass
};
emit(result, args.output);
if (!result.pass) process.exitCode = 1;

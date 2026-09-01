#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stable, fail, readJson, writeJson, parseArgs, hashObject } from './lib.v1.mjs';

function assertFalseFields(receipt, fields, prefix) {
  for (const field of fields) if (receipt[field] !== false) fail(`${prefix}_${field.toUpperCase()}_NOT_FALSE`);
}

export function terminateBootstrapAuthority({ builder, verifier, policy }) {
  if (policy.schema !== 'REPOSITORY_AUTHORIZED_TOOLSET_AND_AI_ROOM_TRANSPORT_BOOTSTRAP_TERMINATION_POLICY_v1') fail('TERMINATION_POLICY_SCHEMA_MISMATCH');
  if (builder.schema !== policy.requiredBuilderSchema || builder.result !== policy.requiredBuilderResult) fail('BUILDER_CERTIFICATION_NOT_ACCEPTABLE');
  if (verifier.schema !== policy.requiredVerifierSchema || verifier.result !== policy.requiredVerifierResult) fail('VERIFIER_CERTIFICATION_NOT_ACCEPTABLE');
  if (builder.expectedHead !== verifier.expectedHead) fail('TERMINATION_HEAD_MISMATCH');
  if (verifier.distinctExecutionHolders !== true || verifier.builderExecutionHolder === verifier.verifierExecutionHolder) fail('TERMINATION_HOLDERS_NOT_DISTINCT');
  if (verifier.packageFingerprintMatch !== true || builder.packageFingerprint !== verifier.builderPackageFingerprint || builder.packageFingerprint !== verifier.verifierPackageFingerprint) fail('TERMINATION_PACKAGE_FINGERPRINT_MISMATCH');
  if (builder.negativeFixtureCount !== builder.negativeFixturesPassed || verifier.negativeFixtureCount !== verifier.negativeFixturesPassed) fail('TERMINATION_NEGATIVE_FIXTURES_NOT_CLOSED');
  if (builder.commandExecutionPassed !== true || builder.receiptValidationPassed !== true || builder.continuationGatePassed !== true) fail('TERMINATION_POSITIVE_CHAIN_NOT_CLOSED');
  assertFalseFields(builder, ['productMutationPerformed', 'roleActivationPerformed', 'methodsAuditExecuted', 'mergePerformed', 'permanentTransportActivated'], 'BUILDER');
  assertFalseFields(verifier, ['repairPerformed', 'productMutationPerformed', 'roleActivationPerformed', 'methodsAuditExecuted', 'mergePerformed', 'permanentTransportActivated'], 'VERIFIER');
  if (policy.residualBootstrapAuthorityAllowed !== false || policy.permanentTransportActivatedByTermination !== false || policy.activationRequiresSeparateRatification !== true) fail('TERMINATION_POLICY_AUTHORITY_BOUNDARY_INVALID');
  return stable({
    schema: 'BOOTSTRAP_AUTHORITY_TERMINATION_RECEIPT_v1',
    bootstrapId: policy.bootstrapId,
    exactCertifiedHead: builder.expectedHead,
    builderCertificationDigest: hashObject(builder),
    verifierCertificationDigest: hashObject(verifier),
    packageFingerprint: builder.packageFingerprint,
    temporaryBuilderAuthorityActive: false,
    temporaryVerifierAuthorityActive: false,
    residualBootstrapAuthority: false,
    productMutationPerformed: false,
    roleActivationPerformed: false,
    methodsAuditExecuted: false,
    mergePerformed: false,
    permanentTransportActivated: false,
    activationRequiresSeparateRatification: true,
    result: policy.terminationResult
  });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const receipt = terminateBootstrapAuthority({
    builder: readJson(args.builder),
    verifier: readJson(args.verifier),
    policy: readJson(args.policy)
  });
  writeJson(args.output, receipt);
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) main();

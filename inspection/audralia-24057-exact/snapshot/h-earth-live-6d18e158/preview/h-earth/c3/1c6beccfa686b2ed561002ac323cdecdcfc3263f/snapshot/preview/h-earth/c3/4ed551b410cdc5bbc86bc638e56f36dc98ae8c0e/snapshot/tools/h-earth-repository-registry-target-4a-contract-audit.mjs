import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const p = 'h-earth-3d/registry/';
const identity = read(p + 'h-earth.repository-registry.validator-contract.identity-boundary.json');
const input = read(p + 'h-earth.repository-registry.validator-contract.input.json');
const receipt = read(p + 'h-earth.repository-registry.validator-contract.receipt.json');
const dispositions = read(p + 'h-earth.repository-registry.validator-contract.dispositions.json');
const failures = read(p + 'h-earth.repository-registry.validator-contract.failures.json');
const criticality = read(p + 'h-earth.repository-registry.validator-contract.criticality.json');
const algorithm = read(p + 'h-earth.repository-registry.validator-contract.algorithm.json');

const contractId = 'H_EARTH_REPOSITORY_REGISTRY_PACKAGE_AWARE_VALIDATOR_CONTRACT_v1';
const requiredInput = ['operationId','operationClass','requestedAction','requestedMutation','requestedPaths','declaredAffectedNodeIds','declaredAffectedRelationIds','declaredCompositeUnitIds','assertedOccurrences','assertedAuthority','assertedLifecycleTransitions','assertedCardinalRoles','instructionSources','evidenceReferences','requestedDispositionContext'];
const requiredReceipt = ['receiptId','contractIdentity','registryIdentity','operationIdentity','resolvedPaths','resolvedOccurrences','affectedNodes','affectedRelations','affectedCompositeUnits','cardinalParticipation','authorityProjection','evidenceProjection','lifecycleProjection','unresolvedFields','permittedMutations','prohibitedMutations','requiredValidations','stoppingBoundaries','failureCodes','derivationTrace','finalDisposition'];
const expectedSteps = ['VALIDATE_INPUT_SHAPE','VERIFY_REGISTRY_IDENTITY','RESOLVE_PATHS_AND_OCCURRENCES','RESOLVE_AFFECTED_NODES','EXPAND_RELATIONS_AND_COMPOSITES','PROJECT_CARDINAL_STRUCTURE','PROJECT_AUTHORITY_AND_EVIDENCE','PROJECT_LIFECYCLE','COMPARE_DECLARED_AND_DERIVED_SCOPE','EVALUATE_MUTATION_LIMITS','EVALUATE_STOPPING_BOUNDARIES','CLASSIFY_FAILURES','CALCULATE_FINAL_DISPOSITION','EMIT_DETERMINISTIC_RECEIPT'];
const all = [identity,input,receipt,dispositions,failures,criticality,algorithm];
const codes = failures.catalog.map((entry) => entry.failureCode);
const checks = {
  contractIdentityConsistent: all.every((item) => item.contractId === contractId && item.contractVersion === 1),
  candidateStatusPreserved: all.every((item) => item.status === 'COMPLETE_CANDIDATE_NOT_ACCEPTED' && item.accepted === false && item.canonical === false),
  exactRegistryIdentityLocked: identity.sourceRegistry.candidateGitBlobSha === '10ab7b203e03fde419e526d0cce2c0af42860911',
  exactInstructionIdentityLocked: identity.sourceInstruction.instructionId === 'H_EARTH_REPOSITORY_REGISTRY_GITHUB_TOOL_INSTRUCTION_v1',
  inputSchemaClosed: input.schema.additionalProperties === false,
  inputRequiredFieldsExact: JSON.stringify(input.schema.required) === JSON.stringify(requiredInput),
  inputUnknownFieldsRejected: input.unknownFieldHandling === 'UNKNOWN_FIELDS_REJECTED',
  inputNullsRejected: input.nullHandling === 'NULL_VALUES_PROHIBITED',
  inputDuplicatesRejected: input.duplicateHandling === 'ARRAY_DUPLICATES_REJECTED',
  receiptSchemaClosed: receipt.schema.additionalProperties === false,
  receiptRequiredFieldsExact: JSON.stringify(receipt.schema.required) === JSON.stringify(requiredReceipt),
  dispositionSetExact: JSON.stringify(Object.keys(dispositions.dispositions).sort()) === JSON.stringify(['BLOCK','PASS','REVIEW_REQUIRED','STOP']),
  dispositionPrecedenceExact: JSON.stringify(dispositions.precedence) === JSON.stringify(['STOP','BLOCK','REVIEW_REQUIRED','PASS']),
  noImplicitPass: dispositions.noImplicitPass === true,
  failureCodesUnique: codes.length === new Set(codes).size,
  failureClassSetExact: failures.failureClasses.length === 12,
  failureFieldsComplete: failures.catalog.every((entry) => ['failureCode','failureClass','defaultDisposition','criticality','requiredEvidence','resolutionRequirement','mayBeOverridden','overrideAuthorityRequired'].every((key) => Object.hasOwn(entry, key))),
  failureDispositionClosed: failures.catalog.every((entry) => ['PASS','REVIEW_REQUIRED','BLOCK','STOP'].includes(entry.defaultDisposition)),
  failureCriticalityClosed: failures.catalog.every((entry) => ['CRITICAL','NONCRITICAL','CONTEXT_DEPENDENT'].includes(entry.criticality)),
  overrideLawComplete: failures.catalog.every((entry) => entry.mayBeOverridden ? entry.overrideAuthorityRequired !== 'NONE' : entry.overrideAuthorityRequired === 'NONE'),
  criticalityCoverageExact: JSON.stringify(Object.keys(criticality.failureCodeCriticality).sort()) === JSON.stringify([...codes].sort()),
  criticalityValuesMatchCatalog: failures.catalog.every((entry) => criticality.failureCodeCriticality[entry.failureCode] === entry.criticality),
  decisionStepCount: algorithm.orderedSteps.length === 14,
  decisionSequenceContiguous: algorithm.orderedSteps.every((entry, index) => entry.sequence === index + 1),
  decisionOrderExact: JSON.stringify(algorithm.orderedSteps.map((entry) => entry.step)) === JSON.stringify(expectedSteps),
  engineIndependent: algorithm.engineIndependent === true,
  noEngineClaim: algorithm.noImplementationClaim.validatorEngineInstalled === false,
  noFixtureClaim: algorithm.noImplementationClaim.fixturesInstalled === false,
  noComprehensionAuditClaim: algorithm.noImplementationClaim.comprehensionAuditExecuted === false,
  noWorkflowEnforcementClaim: algorithm.noImplementationClaim.workflowEnforcementInstalled === false,
  noMutationAuthority: identity.boundaries.mutationAuthorityCreated === false,
  noMergeAuthority: identity.boundaries.mergeAuthorityCreated === false,
  mainUnchangedBoundary: identity.boundaries.mainChanged === false
};
const failedChecks = Object.entries(checks).filter(([, value]) => !value).map(([key]) => key);
const output = {
  auditId: 'H_EARTH_REPOSITORY_REGISTRY_TARGET_4A_CONTRACT_AUDIT_v1',
  result: failedChecks.length === 0 ? 'PASS' : 'FAIL',
  checks,
  totalChecks: Object.keys(checks).length,
  passedChecks: Object.values(checks).filter(Boolean).length,
  failedChecks,
  counts: {inputRequiredFields: requiredInput.length, receiptRequiredFields: requiredReceipt.length, dispositions: 4, failureClasses: failures.failureClasses.length, failureCodes: codes.length, decisionSteps: algorithm.orderedSteps.length},
  boundaries: {validatorEngineInstalled:false,fixturesInstalled:false,portabilityReferencePackageInstalled:false,systemicComprehensionAuditExecuted:false,workflowEnforcementInstalled:false,mutationAuthorityCreated:false,mergeAuthorityCreated:false,canonicalizationAuthorityCreated:false,mainChanged:false}
};
process.stdout.write(JSON.stringify(output, null, 2) + '\n');
if (failedChecks.length > 0) process.exitCode = 1;

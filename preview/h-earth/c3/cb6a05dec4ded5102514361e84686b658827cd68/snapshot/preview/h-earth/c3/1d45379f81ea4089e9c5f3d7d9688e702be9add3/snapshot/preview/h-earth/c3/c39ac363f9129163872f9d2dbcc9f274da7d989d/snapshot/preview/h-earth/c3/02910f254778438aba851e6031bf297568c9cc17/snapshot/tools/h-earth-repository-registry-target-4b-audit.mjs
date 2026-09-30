import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  deriveHEarthRepositoryRegistryOperationScopePreview,
  validateHEarthRepositoryRegistryOperation,
  H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE
} from '../h-earth-3d/registry/h-earth.repository-registry.validator-engine.js';
import { loadHEarthRepositoryRegistryValidatorDependencies } from '../h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const hashObject = (relativePath) => execFileSync('git', ['hash-object', relativePath], { cwd: root, encoding: 'utf8' }).trim();
const dependencies = loadHEarthRepositoryRegistryValidatorDependencies();
const instructionId = 'H_EARTH_REPOSITORY_REGISTRY_GITHUB_TOOL_INSTRUCTION_v1';
const seedPath = '/showroom/globe/h-earth/render/geometry-kernel.north.js';
const receiptRequired = dependencies.contracts.receipt.schema.required;

const seed = {
  operationId: 'TARGET_4B_VALID_READ_ONLY_OPERATION',
  operationClass: 'READ_ONLY_INSPECTION',
  requestedAction: 'INSPECT_H_EARTH_ARCHITECTURE',
  requestedMutation: false,
  requestedPaths: [seedPath],
  declaredAffectedNodeIds: [],
  declaredAffectedRelationIds: [],
  declaredCompositeUnitIds: [],
  assertedOccurrences: [],
  assertedAuthority: [],
  assertedLifecycleTransitions: [],
  assertedCardinalRoles: [],
  instructionSources: [instructionId],
  evidenceReferences: [],
  requestedDispositionContext: {
    allowReviewRequired: true,
    requireExactOccurrenceForReadOnly: false,
    separateAuthorityAvailable: false
  }
};

const preview = deriveHEarthRepositoryRegistryOperationScopePreview(seed);
assert.equal(preview.valid, true);
assert.equal(preview.dependenciesVerified, true);
assert.ok(preview.affectedNodeIds.length > 0);
assert.ok(preview.affectedRelationIds.length > 0);
assert.ok(preview.affectedCompositeUnitIds.length > 0);

const complete = {
  ...seed,
  declaredAffectedNodeIds: [...preview.affectedNodeIds],
  declaredAffectedRelationIds: [...preview.affectedRelationIds],
  declaredCompositeUnitIds: [...preview.affectedCompositeUnitIds]
};
const positiveA = validateHEarthRepositoryRegistryOperation(complete);
const positiveB = validateHEarthRepositoryRegistryOperation(structuredClone(complete));

const exactOccurrence = preview.occurrence.resolvedOccurrences.find((occurrence) => occurrence.path === seedPath);
assert.ok(exactOccurrence);
const mutation = validateHEarthRepositoryRegistryOperation({
  ...complete,
  operationId: 'TARGET_4B_BOUNDED_MUTATION_REJECTION',
  operationClass: 'BOUNDED_MUTATION_PROPOSAL',
  requestedAction: 'UPDATE_SOURCE_FILE',
  requestedMutation: true,
  assertedOccurrences: [{
    path: exactOccurrence.path,
    commitSha: exactOccurrence.commitSha,
    gitBlobSha: exactOccurrence.gitBlobSha,
    refName: exactOccurrence.refName
  }]
});

const adapterOverclaim = validateHEarthRepositoryRegistryOperation({
  ...complete,
  operationId: 'TARGET_4B_ADAPTER_AUTHORITY_OVERCLAIM',
  operationClass: 'AUTHORITY_CHANGE_PROPOSAL',
  requestedAction: 'PROMOTE_GATE_B_ADAPTER_TO_ADMISSION_AUTHORITY',
  assertedAuthority: [{
    nodeId: 'H_EARTH_GATE_B_WEST_ADAPTER_FILE',
    authorityClass: 'ADMISSION_AUTHORITY',
    authorityClaim: 'ADMISSION_AUTHORITY'
  }]
});

const cardinalPromotion = validateHEarthRepositoryRegistryOperation({
  ...complete,
  operationId: 'TARGET_4B_CANDIDATE_CARDINAL_PROMOTION',
  operationClass: 'AUTHORITY_CHANGE_PROPOSAL',
  requestedAction: 'PROMOTE_GATE_B_CARDINAL_ROLE',
  assertedCardinalRoles: [{
    nodeId: 'H_EARTH_GATE_B_PROVIDER_FILE',
    cardinalRole: 'SOUTH',
    cardinalStatus: 'ACCEPTED'
  }]
});

const malformed = validateHEarthRepositoryRegistryOperation({});
const kernelRoles = new Set(positiveA.receipt.cardinalParticipation
  .filter((record) => record.cardinalStatus === 'EXPLICIT')
  .map((record) => record.cardinalRole));

const checks = {
  dependencyIdentityVerified: dependencies.identityVerified,
  registryStructureAuditPass: dependencies.registryFacade.auditHEarthRepositoryRegistryStructure().pass,
  engineIdentityExact: H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE.identity.engineId === 'H_EARTH_REPOSITORY_REGISTRY_PACKAGE_AWARE_VALIDATOR_ENGINE_v1',
  engineCandidateOnly: H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE.identity.accepted === false && H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE.identity.canonical === false,
  previewValid: preview.valid,
  previewHasNodes: preview.affectedNodeIds.length > 0,
  previewHasRelations: preview.affectedRelationIds.length > 0,
  previewHasComposites: preview.affectedCompositeUnitIds.length > 0,
  positiveDispositionPass: positiveA.receipt.finalDisposition === 'PASS',
  positiveHasNoFailures: positiveA.receipt.failureCodes.length === 0,
  positiveScopeExact: positiveA.diagnostics.comparison.exactMatch === true,
  positiveTraceFourteenSteps: positiveA.receipt.derivationTrace.length === 14,
  positiveTraceOrderExact: positiveA.receipt.derivationTrace.every((entry, index) => entry.sequence === index + 1),
  positiveReceiptFieldsExact: JSON.stringify(Object.keys(positiveA.receipt).sort()) === JSON.stringify([...receiptRequired].sort()),
  positiveReceiptDeterministic: JSON.stringify(positiveA.receipt) === JSON.stringify(positiveB.receipt),
  positiveReceiptFrozen: Object.isFrozen(positiveA.receipt) && Object.isFrozen(positiveA.receipt.derivationTrace),
  positiveKernelNorth: kernelRoles.has('NORTH'),
  positiveKernelEast: kernelRoles.has('EAST'),
  positiveKernelSouth: kernelRoles.has('SOUTH'),
  positiveKernelWest: kernelRoles.has('WEST'),
  mutationDispositionBlock: mutation.receipt.finalDisposition === 'BLOCK',
  mutationAuthorityRejected: mutation.receipt.failureCodes.includes('MUTATION_AUTHORITY_NOT_ESTABLISHED'),
  mutationScopeRejected: mutation.receipt.failureCodes.includes('MUTATION_SCOPE_EXCEEDS_AUTHORITY'),
  mutationStoppingBoundaryEnforced: mutation.receipt.failureCodes.includes('STOPPING_BOUNDARY_BYPASSED'),
  adapterOverclaimBlocked: adapterOverclaim.receipt.finalDisposition === 'BLOCK',
  adapterAuthorityPreserved: adapterOverclaim.receipt.failureCodes.includes('ORCHESTRATION_PROMOTED_TO_ADMISSION_AUTHORITY'),
  cardinalPromotionBlocked: cardinalPromotion.receipt.finalDisposition === 'BLOCK',
  candidateCardinalStatusPreserved: cardinalPromotion.receipt.failureCodes.includes('CANDIDATE_CARDINAL_ROLE_PROMOTED'),
  malformedDispositionStop: malformed.receipt.finalDisposition === 'STOP',
  malformedScopeFailurePresent: malformed.receipt.failureCodes.includes('OPERATION_SCOPE_UNRESOLVED'),
  malformedTraceStillComplete: malformed.receipt.derivationTrace.length === 14,
  engineCreatesNoMutationAuthority: H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE.boundary.mutationAuthorityCreated === false,
  engineCreatesNoMergeAuthority: H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE.boundary.mergeAuthorityCreated === false,
  engineCreatesNoWorkflowEnforcement: H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE.boundary.workflowEnforcementInstalled === false
};

const failedChecks = Object.entries(checks).filter(([, value]) => value !== true).map(([name]) => name);
const engineFiles = [
  'h-earth-3d/registry/h-earth.repository-registry.validator-engine.identity.js',
  'h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  'h-earth-3d/registry/h-earth.repository-registry.validator-engine.input.js',
  'h-earth-3d/registry/h-earth.repository-registry.validator-engine.occurrences.js',
  'h-earth-3d/registry/h-earth.repository-registry.validator-engine.scope.js',
  'h-earth-3d/registry/h-earth.repository-registry.validator-engine.composites.js',
  'h-earth-3d/registry/h-earth.repository-registry.validator-engine.cardinals.js',
  'h-earth-3d/registry/h-earth.repository-registry.validator-engine.governance.js',
  'h-earth-3d/registry/h-earth.repository-registry.validator-engine.compare.js',
  'h-earth-3d/registry/h-earth.repository-registry.validator-engine.boundaries.js',
  'h-earth-3d/registry/h-earth.repository-registry.validator-engine.decision.js',
  'h-earth-3d/registry/h-earth.repository-registry.validator-engine.js'
];

const output = {
  receiptId: 'H_EARTH_REPOSITORY_REGISTRY_TARGET_4B_ENGINE_EXECUTION_RECEIPT_v1',
  targetNumber: 4,
  targetSubtarget: '4B-13',
  result: failedChecks.length === 0 ? 'PASS' : 'FAIL',
  branch: process.env.GITHUB_REF_NAME ?? 'agent/h-earth-repository-registry-installation-001',
  executedCommit: process.env.GITHUB_SHA ?? 'LOCAL_UNSPECIFIED',
  executionEnvironment: process.env.GITHUB_ACTIONS === 'true' ? 'BOUNDED_GITHUB_ACTION_ACTUAL_BRANCH_CHECKOUT' : 'LOCAL_NODE',
  audit: {
    auditId: 'H_EARTH_REPOSITORY_REGISTRY_TARGET_4B_ENGINE_SELF_AUDIT_v1',
    checks,
    totalChecks: Object.keys(checks).length,
    passedChecks: Object.values(checks).filter((value) => value === true).length,
    failedChecks
  },
  executionResults: {
    positiveDisposition: positiveA.receipt.finalDisposition,
    positiveAffectedNodeCount: positiveA.receipt.affectedNodes.length,
    positiveAffectedRelationCount: positiveA.receipt.affectedRelations.length,
    positiveCompositeCount: positiveA.receipt.affectedCompositeUnits.length,
    positiveCardinalRecordCount: positiveA.receipt.cardinalParticipation.length,
    mutationDisposition: mutation.receipt.finalDisposition,
    mutationFailureCodes: mutation.receipt.failureCodes,
    adapterOverclaimDisposition: adapterOverclaim.receipt.finalDisposition,
    adapterOverclaimFailureCodes: adapterOverclaim.receipt.failureCodes,
    cardinalPromotionDisposition: cardinalPromotion.receipt.finalDisposition,
    cardinalPromotionFailureCodes: cardinalPromotion.receipt.failureCodes,
    malformedDisposition: malformed.receipt.finalDisposition,
    malformedFailureCodes: malformed.receipt.failureCodes
  },
  gitBlobs: Object.fromEntries(engineFiles.map((relativePath) => [relativePath, hashObject(relativePath)])),
  protectedIdentities: {
    target2RegistryGitBlob: hashObject('h-earth-3d/registry/h-earth.repository-registry.candidate.js'),
    target3InstructionGitBlob: hashObject('h-earth-3d/registry/h-earth.repository-registry.tool-instruction.json'),
    target4AContractGitBlob: hashObject('h-earth-3d/registry/h-earth.repository-registry.validator-contract.json')
  },
  boundaries: {
    validatorEngineExecuted: true,
    fixturesInstalled: false,
    portabilityReferencePackageInstalled: false,
    systemicComprehensionAuditExecuted: false,
    workflowEnforcementInstalled: false,
    mutationAuthorityCreated: false,
    mergeAuthorityCreated: false,
    canonicalizationAuthorityCreated: false,
    mainChanged: false
  }
};

process.stdout.write(JSON.stringify(output, null, 2) + '\n');
if (failedChecks.length > 0) process.exitCode = 1;

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  H_EARTH_LIFECYCLE_STATE_MACHINE,
  H_EARTH_LIFECYCLE_STATES,
  H_EARTH_LIFECYCLE_TRANSITIONS,
  evaluateHEarthLifecycleTransitionProposal,
  getHEarthLifecycleStateMachineReceipt,
  getHEarthLifecycleTransitionDefinition,
  isHEarthLifecycleTransitionPermitted
} from '../h-earth-3d/control-plane/step-1/h-earth.lifecycle-transition.state-machine.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readText = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const readJson = (relativePath) => JSON.parse(readText(relativePath));
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const committedBlob = (relativePath) => execFileSync('git', ['rev-parse', `HEAD:${relativePath}`], {
  cwd: root,
  encoding: 'utf8'
}).trim();
const hashWorkingFile = (relativePath) => execFileSync('git', ['hash-object', relativePath], {
  cwd: root,
  encoding: 'utf8'
}).trim();
const remoteMain = () => {
  try {
    return execFileSync('git', ['ls-remote', 'origin', 'refs/heads/main'], {
      cwd: root,
      encoding: 'utf8'
    }).trim().split(/\s+/)[0];
  } catch {
    return 'UNRESOLVED';
  }
};

const paths = {
  identity: 'h-earth-3d/control-plane/step-1/h-earth.lifecycle-control-plane.step-1.identity-and-boundary.json',
  stateSchema: 'h-earth-3d/control-plane/step-1/h-earth.lifecycle-transition.state-schema.json',
  preconditionSchema: 'h-earth-3d/control-plane/step-1/h-earth.lifecycle-transition.precondition-schema.json',
  postconditionSchema: 'h-earth-3d/control-plane/step-1/h-earth.lifecycle-transition.postcondition-schema.json',
  contract: 'h-earth-3d/control-plane/step-1/h-earth.successor-activation.transition-contract.json',
  stateMachine: 'h-earth-3d/control-plane/step-1/h-earth.lifecycle-transition.state-machine.js',
  fixtures: 'h-earth-3d/control-plane/step-1/h-earth.lifecycle-transition.fixtures.json',
  bootstrap: 'h-earth-3d/registry/h-earth.repository-registry.bootstrap.json',
  activeCandidate: 'h-earth-3d/registry/h-earth.repository-registry.candidate.js',
  successorCandidate: 'h-earth-3d/registry/candidates/h-earth.repository-registry.successor.candidate.js',
  successorIdentity: 'h-earth-3d/registry/candidates/h-earth.repository-registry.successor.identity.json',
  acceptanceDeclaration: 'h-earth-3d/registry/finalization/h-earth.repository-registry.user-acceptance-declaration.json',
  acceptanceCustody: 'h-earth-3d/registry/h-earth.repository-registry.user-acceptance-custody-receipt.json',
  completionReceipt: 'h-earth-3d/registry/h-earth.repository-registry.target-4f-completion-receipt.json'
};

const identity = readJson(paths.identity);
const stateSchema = readJson(paths.stateSchema);
const preconditionSchema = readJson(paths.preconditionSchema);
const postconditionSchema = readJson(paths.postconditionSchema);
const contract = readJson(paths.contract);
const fixtureSuite = readJson(paths.fixtures);
const bootstrap = readJson(paths.bootstrap);
const successorIdentity = readJson(paths.successorIdentity);
const stateMachineSource = readText(paths.stateMachine);
const observedMain = remoteMain();

const expectedStateOrder = [
  'CANDIDATE',
  'VALIDATED',
  'ACCEPTED',
  'ACTIVE',
  'SUPERSEDED',
  'RETIRED'
];
const expectedTransitionIds = [
  'CANDIDATE_TO_VALIDATED',
  'VALIDATED_TO_ACCEPTED',
  'ACCEPTED_TO_ACTIVE',
  'ACTIVE_TO_SUPERSEDED',
  'SUPERSEDED_TO_RETIRED'
];
const expectedTransitionPairs = [
  ['CANDIDATE', 'VALIDATED'],
  ['VALIDATED', 'ACCEPTED'],
  ['ACCEPTED', 'ACTIVE'],
  ['ACTIVE', 'SUPERSEDED'],
  ['SUPERSEDED', 'RETIRED']
];

const checks = {};
const check = (name, condition) => {
  checks[name] = Boolean(condition);
};

for (const [name, relativePath] of Object.entries(paths)) {
  check(`pathExists_${name}`, exists(relativePath));
}

check('identityArtifactExact', identity.artifactId === 'H_EARTH_REPOSITORY_LIFECYCLE_CONTROL_PLANE_SUCCESSOR_ACTIVATION_TRANSITION_CONTRACT_CANDIDATE_v1');
check('identityStepExact', identity.step === 1 && identity.checkpoint === '1A_IDENTITY_AND_BOUNDARY');
check('identityCandidateOnly', identity.status === 'COMPLETE_CANDIDATE_NOT_ACCEPTED_NOT_ACTIVE');
check('identityStateOrderExact', JSON.stringify(identity.lifecycleStateOrder) === JSON.stringify(expectedStateOrder));
check('identityDefinitionOnly', identity.firstControlledOperation?.definitionOnly === true && identity.firstControlledOperation?.executionAuthorized === false);
check('identityWithholdsAllOperationalAuthority', Object.entries(identity.boundaries ?? {}).every(([name, value]) => name === 'mainChanged' ? value === false : value === false));
check('identityStopsAtStep1', identity.stoppingCondition?.advanceBeyondStep1 === false);

check('stateSchemaDraftExact', stateSchema.$schema === 'https://json-schema.org/draft/2020-12/schema');
check('stateSchemaStateEnumExact', JSON.stringify(stateSchema.properties?.state?.enum) === JSON.stringify(expectedStateOrder));
check('stateSchemaHistoricalProvenanceRequired', stateSchema.properties?.historicalProvenancePreserved?.const === true);
check('stateSchemaNonAuthorizing', stateSchema['x-h-earth-boundaries']?.schemaCreatesActivationAuthority === false && stateSchema['x-h-earth-boundaries']?.schemaCreatesMutationAuthority === false);

check('preconditionSchemaDraftExact', preconditionSchema.$schema === 'https://json-schema.org/draft/2020-12/schema');
check('preconditionSchemaRequiresParentCommit', preconditionSchema.required?.includes('expectedParentCommit'));
check('preconditionSchemaRequiresActors', ['requestingActorClass', 'approvingAuthorityClass', 'executingActorClass'].every((entry) => preconditionSchema.required?.includes(entry)));
check('preconditionSchemaRequiresPathAndBlobScope', preconditionSchema.required?.includes('authorizedPathSet') && preconditionSchema.required?.includes('expectedInputBlobs'));
check('preconditionSchemaRequiresApprovalExecutionReplay', preconditionSchema.properties?.approvalBindingRequired?.const === true && preconditionSchema.properties?.executionAuthorityRequired?.const === true && preconditionSchema.properties?.replayProtectionRequired?.const === true);
check('preconditionSchemaNonExecuting', preconditionSchema['x-h-earth-boundaries']?.schemaMayExecuteTransition === false && preconditionSchema['x-h-earth-boundaries']?.schemaMayMutateRepository === false);

check('postconditionSchemaDraftExact', postconditionSchema.$schema === 'https://json-schema.org/draft/2020-12/schema');
check('postconditionSchemaRequiresExactResultIdentity', postconditionSchema.required?.includes('resultCommit') && postconditionSchema.required?.includes('resultParentCommit') && postconditionSchema.required?.includes('resultBlobSet'));
check('postconditionSchemaRequiresHistoryAndSupersession', postconditionSchema.properties?.historicalPredecessorPreserved?.const === true && postconditionSchema.properties?.supersessionRelationRecorded?.const === true);
check('postconditionSchemaRequiresReplayConsumption', postconditionSchema.properties?.decisionConsumed?.const === true && postconditionSchema.properties?.replayNonceConsumed?.const === true);
check('postconditionSchemaRecoveryDispositionsPresent', ['SUSPEND_RESULT', 'ROLLBACK_REQUIRED'].every((entry) => postconditionSchema.properties?.postconditionResult?.enum?.includes(entry)));
check('postconditionSchemaNonAuthorizing', postconditionSchema['x-h-earth-boundaries']?.schemaMayApplyRollback === false && postconditionSchema['x-h-earth-boundaries']?.schemaMayCreateCanonicalAuthority === false);

check('contractIdentityExact', contract.contractId === 'H_EARTH_REPOSITORY_LIFECYCLE_CONTROL_PLANE_SUCCESSOR_ACTIVATION_TRANSITION_CONTRACT_v1');
check('contractStatusCandidateOnly', contract.status === 'COMPLETE_CANDIDATE_NOT_ACCEPTED_NOT_ACTIVE');
check('contractAcceptedMainExact', contract.controllingBaseline?.acceptedMainCommit === '465596de77ef0a28a7f779e06851130f4768e445');
check('remoteMainMatchesAcceptedMain', observedMain === contract.controllingBaseline?.acceptedMainCommit);
check('contractAcceptedBootstrapBlobExact', committedBlob(paths.bootstrap) === 'e422e814a29e024df91e8410687ab29ffe63c382');
check('contractActiveCandidateBlobExact', committedBlob(paths.activeCandidate) === '10ab7b203e03fde419e526d0cce2c0af42860911');
check('contractSuccessorCandidateBlobExact', committedBlob(paths.successorCandidate) === '8cf7a1cce76c4381f9c5f017cc3a132d8ecea308');
check('contractSuccessorIdentityBlobExact', committedBlob(paths.successorIdentity) === 'a5d6ae2f64c7f8ac868aef70aa895bf9979be202');
check('contractAcceptanceDeclarationBlobExact', committedBlob(paths.acceptanceDeclaration) === 'b49e328d6a7a18b267800db234cab12f2a7dd61b');
check('contractAcceptanceCustodyBlobExact', committedBlob(paths.acceptanceCustody) === '78139d26c6f2e9a2b725f77ae7885c273fd97506');
check('contractCompletionReceiptBlobExact', committedBlob(paths.completionReceipt) === '22a997a1082ecc4b7c9c9b35d1675516c68e4efc');
check('bootstrapAcceptedNoncanonical', bootstrap.status === 'COMPLETE_VERIFIED_ACCEPTED_NONCANONICAL' && bootstrap.accepted === true && bootstrap.canonical === false);
check('successorIdentityExact', successorIdentity.successorId === 'H_EARTH_REPOSITORY_REGISTRY_SUCCESSOR_CANDIDATE_v2' && successorIdentity.registryVersion === '1.0.0-candidate.2' && successorIdentity.contentDigest === 'a168f5a814f23f508d1c019867b707b30ec2ea8f1e0ae3125be6594e701f07e8');
check('successorStillUnacceptedInactive', successorIdentity.status === 'COMPLETE_CANDIDATE_NOT_ACCEPTED_NOT_CANONICAL_NOT_ACTIVE' && successorIdentity.acceptedBootstrapChanged === false && successorIdentity.activeRegistryChanged === false && successorIdentity.canonical === false);
check('contractStateOrderExact', JSON.stringify(contract.stateMachine?.states) === JSON.stringify(expectedStateOrder));
check('contractTransitionIdsExact', JSON.stringify(contract.stateMachine?.permittedTransitions?.map((entry) => entry.transitionId)) === JSON.stringify(expectedTransitionIds));
check('contractTransitionPairsExact', JSON.stringify(contract.stateMachine?.permittedTransitions?.map((entry) => [entry.sourceState, entry.targetState])) === JSON.stringify(expectedTransitionPairs));
check('contractEveryTransitionHasActorClasses', contract.stateMachine?.permittedTransitions?.every((entry) => Object.keys(entry.actorClasses ?? {}).length === 4));
check('contractEveryTransitionHasEvidence', contract.stateMachine?.permittedTransitions?.every((entry) => Array.isArray(entry.requiredEvidenceClasses) && entry.requiredEvidenceClasses.length > 0));
check('contractEveryTransitionNonExecuting', contract.stateMachine?.permittedTransitions?.every((entry) => entry.executionMutationAuthorized === false));
check('contractNoStateSkipping', !isHEarthLifecycleTransitionPermitted('CANDIDATE', 'ACCEPTED') && !isHEarthLifecycleTransitionPermitted('CANDIDATE', 'ACTIVE') && !isHEarthLifecycleTransitionPermitted('VALIDATED', 'ACTIVE'));
check('contractActivationSequenceUncollapsed', JSON.stringify(contract.firstControlledOperation?.transitionSequence) === JSON.stringify(['VALIDATED_TO_ACCEPTED', 'ACCEPTED_TO_ACTIVE']) && contract.firstControlledOperation?.sequenceMayBeCollapsed === false);
check('contractAtomicArtifactSetComplete', ['BOOTSTRAP', 'ACTIVE_REGISTRY_REFERENCE', 'SUCCESSOR_IDENTITY', 'PREVIOUS_ACTIVE_IDENTITY', 'SUPERSESSION_RELATION', 'ACTIVATION_RECEIPT', 'RECOVERY_CHECKPOINT'].every((entry) => contract.atomicArtifactSet?.some((artifact) => artifact.artifactClass === entry)));
check('contractUnresolvedPathsExplicit', contract.authorizedPathLaw?.unresolvedFuturePaths?.length === 4 && contract.authorizedPathLaw?.unresolvedPathsMayBeInventedByExecutor === false);
check('contractActorBindingsDeferred', contract.actorBinding?.actorClassesDefined === true && contract.actorBinding?.actualRequestingActorBound === false && contract.actorBinding?.actualApprovingAuthorityBound === false && contract.actorBinding?.actualExecutingActorBound === false);
check('contractReplayLawComplete', contract.replayLaw?.uniqueDecisionIdRequired === true && contract.replayLaw?.uniqueNonceRequired === true && contract.replayLaw?.decisionExpirationRequired === true && contract.replayLaw?.consumedDecisionMayBeReused === false);
check('contractFailureLawContainsCriticalStops', ['MISSING_APPROVAL', 'REPLAYED_DECISION', 'PARENT_COMMIT_MISMATCH', 'INPUT_BLOB_MISMATCH', 'AUTHORIZED_PATH_SET_MISMATCH'].every((entry) => contract.failureDispositions?.[entry] === 'STOP_WITHOUT_MUTATION'));
check('contractWithholdsOperationalAuthority', Object.values(contract.boundaries ?? {}).every((value) => value === false));
check('contractStopsAtStep1', contract.stoppingCondition?.executionAuthorized === false && contract.stoppingCondition?.advanceBeyondStep1 === false);

const machineReceipt = getHEarthLifecycleStateMachineReceipt();
check('stateMachineStatesExact', JSON.stringify(H_EARTH_LIFECYCLE_STATES) === JSON.stringify(expectedStateOrder));
check('stateMachineTransitionIdsExact', JSON.stringify(H_EARTH_LIFECYCLE_TRANSITIONS.map((entry) => entry.transitionId)) === JSON.stringify(expectedTransitionIds));
check('stateMachineTransitionCountExact', machineReceipt.transitionCount === 5);
check('stateMachineDeepFrozen', Object.isFrozen(H_EARTH_LIFECYCLE_STATE_MACHINE) && Object.isFrozen(H_EARTH_LIFECYCLE_STATES) && Object.isFrozen(H_EARTH_LIFECYCLE_TRANSITIONS));
check('stateMachineReadOnlyExact', machineReceipt.readOnly === true && machineReceipt.repositoryMutationCapability === false && machineReceipt.approvalIssuanceCapability === false && machineReceipt.executionAuthorityCapability === false && machineReceipt.activationCapability === false && machineReceipt.canonicalizationCapability === false);
check('stateMachineDefinitionLookupExact', getHEarthLifecycleTransitionDefinition('ACCEPTED_TO_ACTIVE')?.resultingAuthority === 'ACTIVE_NONCANONICAL_REGISTRY_SUCCESSOR');
check('stateMachineSourceHasNoMutationImports', !stateMachineSource.includes("node:fs") && !stateMachineSource.includes("node:child_process") && !stateMachineSource.includes('fetch('));
check('stateMachineWorkingAndCommittedBlobMatch', hashWorkingFile(paths.stateMachine) === committedBlob(paths.stateMachine));

const mergeProposal = (base, override = {}) => ({
  ...base,
  ...override,
  actorBindings: {
    ...(base.actorBindings ?? {}),
    ...(override.actorBindings ?? {})
  },
  replay: {
    ...(base.replay ?? {}),
    ...(override.replay ?? {})
  }
});

const fixtureResults = fixtureSuite.fixtures.map((fixture, index) => {
  const transition = getHEarthLifecycleTransitionDefinition(fixture.transitionId);
  const evidenceClasses = fixture.evidenceMode === 'ALL_REQUIRED'
    ? [...(transition?.requiredEvidenceClasses ?? [])]
    : fixture.evidenceMode === 'OMIT_LAST_REQUIRED'
      ? [...(transition?.requiredEvidenceClasses ?? [])].slice(0, -1)
      : [];
  const base = {
    ...fixtureSuite.commonProposal,
    proposalId: fixture.fixtureId,
    transitionId: fixture.transitionId,
    sourceState: fixture.sourceState ?? transition?.sourceState,
    targetState: fixture.targetState ?? transition?.targetState,
    evidenceClasses,
    replay: {
      ...fixtureSuite.commonProposal.replay,
      decisionId: `FIXTURE_DECISION_${String(index + 1).padStart(3, '0')}`,
      nonce: `FIXTURE_NONCE_${String(index + 1).padStart(3, '0')}`
    }
  };
  const proposal = mergeProposal(base, fixture.overrides ?? {});
  if (fixture.sourceState) proposal.sourceState = fixture.sourceState;
  if (fixture.targetState) proposal.targetState = fixture.targetState;
  const receiptA = evaluateHEarthLifecycleTransitionProposal(proposal);
  const receiptB = evaluateHEarthLifecycleTransitionProposal(proposal);
  const expectedCodesPresent = fixture.expectedFailureCodes.every((entry) => receiptA.failureCodes.includes(entry));
  const pass = receiptA.disposition === fixture.expectedDisposition
    && expectedCodesPresent
    && JSON.stringify(receiptA) === JSON.stringify(receiptB)
    && receiptA.transitionMayExecute === false
    && receiptA.mutationMayProceed === false
    && receiptA.acceptanceCreated === false
    && receiptA.activationCreated === false
    && receiptA.canonicalizationCreated === false;
  return {
    fixtureId: fixture.fixtureId,
    expectedDisposition: fixture.expectedDisposition,
    observedDisposition: receiptA.disposition,
    expectedFailureCodes: fixture.expectedFailureCodes,
    observedFailureCodes: receiptA.failureCodes,
    deterministic: JSON.stringify(receiptA) === JSON.stringify(receiptB),
    pass
  };
});

const positiveCount = fixtureResults.filter((entry) => entry.expectedDisposition === 'CONTRACT_SATISFIED_PENDING_SEPARATE_AUTHORITY').length;
const stopCount = fixtureResults.filter((entry) => entry.expectedDisposition === 'STOP').length;
check('fixtureSuiteIdentityExact', fixtureSuite.fixtureSuiteId === 'H_EARTH_REPOSITORY_LIFECYCLE_CONTROL_PLANE_STEP_1_FIXTURE_SUITE_v1');
check('fixtureCountExact', fixtureResults.length === fixtureSuite.expectedCounts?.total && fixtureResults.length === 19);
check('fixturePositiveCountExact', positiveCount === fixtureSuite.expectedCounts?.positive && positiveCount === 5);
check('fixtureNegativeCountExact', stopCount === fixtureSuite.expectedCounts?.negative && stopCount === 14);
check('allFixturesPass', fixtureResults.every((entry) => entry.pass));
check('allFixturesDeterministic', fixtureResults.every((entry) => entry.deterministic));
check('allPositiveFixturesRemainNonexecuting', fixtureResults.filter((entry) => entry.expectedDisposition !== 'STOP').every((entry) => entry.observedDisposition === 'CONTRACT_SATISFIED_PENDING_SEPARATE_AUTHORITY'));
check('allNegativeFixturesStop', fixtureResults.filter((entry) => entry.expectedDisposition === 'STOP').every((entry) => entry.observedDisposition === 'STOP'));

const failedChecks = Object.entries(checks)
  .filter(([, value]) => value !== true)
  .map(([name]) => name)
  .sort();

const receipt = {
  receiptId: 'H_EARTH_REPOSITORY_LIFECYCLE_CONTROL_PLANE_STEP_1_AUDIT_RECEIPT_v1',
  programId: 'H_EARTH_REPOSITORY_LIFECYCLE_CONTROL_PLANE_v1',
  step: 1,
  checkpoint: '1F_STATIC_AND_EXECUTED_AUDIT',
  result: failedChecks.length === 0 ? 'PASS' : 'FAIL',
  status: failedChecks.length === 0
    ? 'COMPLETE_VERIFIED_CANDIDATE_NOT_ACCEPTED_NOT_ACTIVE'
    : 'INCOMPLETE_STOPPED_ON_AUDIT_FAILURE',
  executedCommit: process.env.GITHUB_SHA ?? 'LOCAL_UNSPECIFIED',
  executionEnvironment: process.env.GITHUB_ACTIONS === 'true'
    ? 'BOUNDED_GITHUB_ACTION_ACTUAL_CHECKOUT'
    : 'LOCAL_NODE',
  observedMainCommit: observedMain,
  totalChecks: Object.keys(checks).length,
  passedChecks: Object.values(checks).filter(Boolean).length,
  failedChecks,
  checks,
  fixtureExecution: {
    total: fixtureResults.length,
    passed: fixtureResults.filter((entry) => entry.pass).length,
    failed: fixtureResults.filter((entry) => !entry.pass).length,
    results: fixtureResults
  },
  artifactIdentities: Object.fromEntries(
    Object.entries(paths)
      .filter(([name]) => ['identity', 'stateSchema', 'preconditionSchema', 'postconditionSchema', 'contract', 'stateMachine', 'fixtures'].includes(name))
      .map(([name, relativePath]) => [name, {
        path: `/${relativePath}`,
        gitBlobSha: committedBlob(relativePath)
      }])
  ),
  boundaries: {
    step1ContractComplete: failedChecks.length === 0,
    actorIdentityBindingsEstablished: false,
    approvalDecisionIssued: false,
    transitionExecutionAuthorityEstablished: false,
    successorAccepted: false,
    successorActivated: false,
    bootstrapChanged: false,
    activeRegistryChanged: false,
    mainChanged: false,
    canonicalizationAuthorityEstablished: false,
    sourceAuthorityCreated: false,
    mutationAuthorityCreated: false,
    deploymentAuthorityCreated: false,
    productionAuthorityCreated: false
  },
  stoppingCondition: {
    step1Complete: failedChecks.length === 0,
    advanceBeyondStep1: false,
    nextAuthorizedStep: failedChecks.length === 0
      ? 'USER_ACCEPTANCE_BOUNDARY_FOR_STEP_1_CANDIDATE'
      : 'STOP_AND_REPORT'
  }
};

fs.mkdirSync(path.join(root, 'artifacts'), { recursive: true });
fs.writeFileSync(
  path.join(root, 'artifacts/h-earth-lifecycle-control-plane-step-1-audit-receipt.json'),
  `${JSON.stringify(receipt, null, 2)}\n`,
  'utf8'
);
process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
if (failedChecks.length > 0) process.exitCode = 1;

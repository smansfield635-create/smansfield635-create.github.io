import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { runAutomaticHEarthPreflight } from '../h-earth-3d/registry/activation/h-earth.repository-registry.auto-preflight.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readText = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const readJson = (relativePath) => JSON.parse(readText(relativePath));
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const hashObject = (relativePath) => execFileSync('git', ['hash-object', relativePath], {
  cwd: root,
  encoding: 'utf8'
}).trim();
const hashCommittedObject = (relativePath) => execFileSync('git', ['rev-parse', `HEAD:${relativePath}`], {
  cwd: root,
  encoding: 'utf8'
}).trim();
const readCommittedText = (relativePath) => execFileSync('git', ['show', `HEAD:${relativePath}`], {
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 32 * 1024 * 1024
});
const execJson = (relativePath, extraEnv = {}) => JSON.parse(execFileSync(
  process.execPath,
  ['--experimental-default-type=module', relativePath],
  {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    env: { ...process.env, ...extraEnv }
  }
));
const relative = (value) => value.startsWith('/') ? value.slice(1) : value;
const tryGit = (...args) => {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
};
const readGitHubEvent = () => {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath || !fs.existsSync(eventPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(eventPath, 'utf8'));
  } catch {
    return {};
  }
};

const ACCEPTED_MAIN_COMMIT = '465596de77ef0a28a7f779e06851130f4768e445';
const HISTORICAL_MAIN_BASELINE = '3890dfc7165ae3481cd119d1f9c935e93c336f17';
const EVALUATION_BRANCH = 'agent/h-earth-gate-b-post-guardrail-evaluation-001';
const ACCEPTED_BOOTSTRAP_GIT_BLOB = 'e422e814a29e024df91e8410687ab29ffe63c382';
const ACCEPTANCE_DECLARATION_GIT_BLOB = 'b49e328d6a7a18b267800db234cab12f2a7dd61b';
const ACCEPTANCE_CUSTODY_GIT_BLOB = '78139d26c6f2e9a2b725f77ae7885c273fd97506';
const COMPLETION_RECEIPT_GIT_BLOB = '22a997a1082ecc4b7c9c9b35d1675516c68e4efc';

const identity = readJson('h-earth-3d/registry/finalization/h-earth.repository-registry.target-4f.identity-boundary.json');
const ledger = readJson('h-earth-3d/registry/finalization/h-earth.repository-registry.target-4f.target-ledger.json');
const manifest = readJson('h-earth-3d/registry/finalization/h-earth.repository-registry.target-4f.protected-identity-manifest.json');
const auditContract = readJson('h-earth-3d/registry/finalization/h-earth.repository-registry.target-4f.audit-contract.json');
const bootstrap = readJson('h-earth-3d/registry/h-earth.repository-registry.bootstrap.json');
const acceptanceDeclaration = readJson('h-earth-3d/registry/finalization/h-earth.repository-registry.user-acceptance-declaration.json');
const acceptanceCustody = readJson('h-earth-3d/registry/h-earth.repository-registry.user-acceptance-custody-receipt.json');
const completionReceipt = readJson('h-earth-3d/registry/h-earth.repository-registry.target-4f-completion-receipt.json');
const deferral = readJson('h-earth-3d/registry/portability/h-earth.repository-registry.target-4d.deferral-and-critical-path-reclassification.json');
const target4ECompletion = readJson('h-earth-3d/registry/h-earth.repository-registry.target-4e-completion-receipt.json');
const permanentWorkflow = readText('.github/workflows/h-earth-repository-registry-preflight.yml');
const rootAgents = readText('AGENTS.md');
const hEarthAgents = readText('h-earth-3d/AGENTS.md');
const showroomAgents = readText('showroom/globe/h-earth/AGENTS.md');

const target4A = execJson('tools/h-earth-repository-registry-target-4a-contract-audit.mjs');
const target4B = execJson('tools/h-earth-repository-registry-target-4b-audit.mjs');
const protectedTarget4EReceiptPath = 'h-earth-3d/registry/h-earth.repository-registry.target-4e-receipt.json';
const protectedTarget4EReceiptText = readCommittedText(protectedTarget4EReceiptPath);
let target4E;
try {
  target4E = execJson('tools/h-earth-repository-registry-target-4e-audit.mjs', {
    TARGET_BRANCH: process.env.TARGET_BRANCH ?? 'agent/h-earth-repository-registry-installation-001',
    TARGET_COMMIT: process.env.TARGET_COMMIT ?? process.env.GITHUB_SHA ?? 'LOCAL_UNSPECIFIED'
  });
} finally {
  fs.writeFileSync(path.join(root, protectedTarget4EReceiptPath), protectedTarget4EReceiptText, 'utf8');
}

const registeredA = runAutomaticHEarthPreflight({
  paths: ['/showroom/globe/h-earth/render/geometry-kernel.north.js'],
  taskText: 'Inspect the north geometry source before reviewing its behavior.',
  mutationIntent: false
});
const registeredB = runAutomaticHEarthPreflight({
  paths: ['/showroom/globe/h-earth/render/geometry-kernel.north.js'],
  taskText: 'Inspect the north geometry source before reviewing its behavior.',
  mutationIntent: false
});
const unregistered = runAutomaticHEarthPreflight({
  paths: ['/showroom/globe/h-earth/render/future-unregistered-source.js'],
  taskText: 'Add a future H-Earth renderer source.',
  mutationIntent: true
});
const outside = runAutomaticHEarthPreflight({
  paths: ['/README.md'],
  taskText: 'Review the repository readme.',
  mutationIntent: false
});
const mutationIntent = runAutomaticHEarthPreflight({
  paths: ['/showroom/globe/h-earth/render/geometry-kernel.north.js'],
  taskText: 'Change the north geometry source.',
  mutationIntent: true
});

const protectedResults = Object.fromEntries(Object.entries(manifest.protectedIdentities).map(([name, entry]) => {
  const actualGitBlobSha = hashCommittedObject(relative(entry.path));
  return [name, {
    path: entry.path,
    expectedGitBlobSha: entry.gitBlobSha,
    actualGitBlobSha,
    exact: actualGitBlobSha === entry.gitBlobSha
  }];
}));
const trackedFiles = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
const githubEvent = readGitHubEvent();
const eventBaseCommit = githubEvent.pull_request?.base?.sha ?? null;
const remoteMainCommit = tryGit('rev-parse', 'origin/main') ?? tryGit('ls-remote', 'origin', 'refs/heads/main')?.split(/\s+/)[0] ?? null;
const observedMainCommit = eventBaseCommit ?? remoteMainCommit ?? 'UNRESOLVED';
const executionBranch = process.env.TARGET_BRANCH ?? process.env.GITHUB_HEAD_REF ?? process.env.GITHUB_REF_NAME ?? 'LOCAL_UNSPECIFIED';

const checks = {
  identityExact: identity.identityId === 'H_EARTH_REPOSITORY_REGISTRY_TARGET_4F_FINALIZATION_IDENTITY_AND_BOUNDARY_v1',
  identityHistoricalCandidateStatePreserved: identity.accepted === false && identity.canonical === false,
  identityHistoricalAcceptanceBoundaryPreserved: identity.requiredTerminalState.userAcceptance === false,
  identityHistoricalMergeBoundaryPreserved: identity.requiredTerminalState.mergeAuthorized === false && identity.boundaries.pr61MayBeMerged === false,
  ledgerIdentityExact: ledger.ledgerId === 'H_EARTH_REPOSITORY_REGISTRY_TARGET_4F_COMPLETE_TARGET_LEDGER_v1',
  ledgerHasSevenEntries: ledger.entries.length === 7,
  ledgerTargetOrderExact: JSON.stringify(ledger.entries.map((entry) => entry.target)) === JSON.stringify(['2','3','4A','4B','4C','4D','4E']),
  ledger4DDeferredNonblocking: ledger.entries.find((entry) => entry.target === '4D')?.status === 'OPTIONAL_DEFERRED_GENERALIZATION_LANE' && ledger.reconciliation.hEarthCriticalPathBlocked === false,
  ledgerHistoricalPreAcceptanceStatePreserved: ledger.reconciliation.userAcceptanceEstablished === false && ledger.reconciliation.mergeAuthorityEstablished === false,
  manifestIdentityExact: manifest.manifestId === 'H_EARTH_REPOSITORY_REGISTRY_TARGET_4F_PROTECTED_IDENTITY_MANIFEST_v1',
  manifestProtectedIdentitiesExact: Object.values(protectedResults).every((entry) => entry.exact),
  manifestIdentityBoundaryExact: hashObject('h-earth-3d/registry/finalization/h-earth.repository-registry.target-4f.identity-boundary.json') === manifest.finalizationArtifacts.identityBoundary.gitBlobSha,
  manifestTargetLedgerExact: hashObject('h-earth-3d/registry/finalization/h-earth.repository-registry.target-4f.target-ledger.json') === manifest.finalizationArtifacts.targetLedger.gitBlobSha,
  manifestHistoricalBootstrapBaselinesPreserved: manifest.finalizationArtifacts.bootstrapBefore4FExecution.gitBlobSha === '7c14d57452280e60d5ff7f7f9c465868d4782764' && manifest.finalizationArtifacts.bootstrapFinal.gitBlobSha === '3bad5a83bd83f063a4c5593fca5c66d264b4c745',
  auditContractIdentityExact: auditContract.contractId === 'H_EARTH_REPOSITORY_REGISTRY_TARGET_4F_FINAL_INTEGRATED_AUDIT_CONTRACT_v1',
  auditContractHistoricalMainBaselinePreserved: auditContract.execution.expectedMainCommit === HISTORICAL_MAIN_BASELINE,
  auditContractWithholdsAuthority: Object.values(auditContract.boundaries).every((value) => value === false),
  acceptedBootstrapGitBlobExact: hashObject('h-earth-3d/registry/h-earth.repository-registry.bootstrap.json') === ACCEPTED_BOOTSTRAP_GIT_BLOB,
  bootstrapAcceptedNoncanonical: bootstrap.status === 'COMPLETE_VERIFIED_ACCEPTED_NONCANONICAL' && bootstrap.accepted === true && bootstrap.canonical === false && bootstrap.controlsRepositoryScope === false,
  bootstrapAutomaticModeExact: bootstrap.toolUseMode === 'AUTOMATIC_H_EARTH_SCOPED_READ_ONLY_FOR_COMPATIBLE_REPOSITORY_ENTRYPOINTS',
  bootstrap4DDeferred: bootstrap.portabilityAssessment.status === 'OPTIONAL_DEFERRED_GENERALIZATION_LANE' && bootstrap.portabilityAssessment.hEarthCriticalPathBlocked === false,
  bootstrap4EComplete: bootstrap.automaticActivationAndSystemicComprehension.target4EComplete === true,
  bootstrapAcceptanceBoundaryExact: bootstrap.stoppingCondition.target4FComplete === true && bootstrap.stoppingCondition.candidatePackageComplete === true && bootstrap.stoppingCondition.userAcceptanceEstablished === true && bootstrap.stoppingCondition.nextAuthorizedSubtarget === 'MERGE_AUTHORIZATION_BOUNDARY',
  acceptanceDeclarationGitBlobExact: hashObject('h-earth-3d/registry/finalization/h-earth.repository-registry.user-acceptance-declaration.json') === ACCEPTANCE_DECLARATION_GIT_BLOB,
  acceptanceDeclarationExact: acceptanceDeclaration.accepted === true && acceptanceDeclaration.canonical === false && acceptanceDeclaration.acceptanceStatement === 'I accept.' && acceptanceDeclaration.acceptedPackage?.completionReceiptGitBlobSha === COMPLETION_RECEIPT_GIT_BLOB,
  acceptanceCustodyGitBlobExact: hashObject('h-earth-3d/registry/h-earth.repository-registry.user-acceptance-custody-receipt.json') === ACCEPTANCE_CUSTODY_GIT_BLOB,
  acceptanceCustodyExact: acceptanceCustody.result === 'PASS' && acceptanceCustody.status === 'COMPLETE_VERIFIED_ACCEPTED_NONCANONICAL' && acceptanceCustody.acceptance?.accepted === true && acceptanceCustody.acceptance?.canonical === false,
  completionReceiptGitBlobExact: hashObject('h-earth-3d/registry/h-earth.repository-registry.target-4f-completion-receipt.json') === COMPLETION_RECEIPT_GIT_BLOB,
  completionReceiptExact: completionReceipt.result === 'PASS' && completionReceipt.finalAudit?.passedChecks === 53 && completionReceipt.finalAudit?.failedChecks === 0 && completionReceipt.targetStatus?.candidatePackageComplete === true,
  deferralExact: deferral.reclassification.remainingTarget4DStatus === 'OPTIONAL_DEFERRED_GENERALIZATION_LANE' && deferral.reclassification.target4BPortabilityRefactorRequiredForHEarth === false,
  target4ECompletionExact: target4ECompletion.result === 'PASS' && target4ECompletion.boundaries.target4EComplete === true,
  target4APass: target4A.result === 'PASS' && target4A.passedChecks === auditContract.requiredRegressions.target4AContractAudit,
  target4BPass: target4B.result === 'PASS' && target4B.audit.passedChecks === auditContract.requiredRegressions.target4BEngineAudit,
  target4EPass: target4E.result === 'PASS',
  target4EStaticPass: target4E.staticActivationAudit.result === 'PASS' && target4E.staticActivationAudit.passedChecks === auditContract.requiredRegressions.target4EStaticActivationAudit,
  target4CStaticRegressionPass: target4E.target4CRegression.staticPassedChecks === auditContract.requiredRegressions.target4CStaticAudit,
  target4CFixtureRegressionPass: target4E.target4CRegression.passedFixtureCount === auditContract.requiredRegressions.target4CFixtureExecution && target4E.target4CRegression.failedFixtureCount === 0,
  target4ESystemicPass: target4E.systemicExecution.passedScenarioCount === auditContract.requiredRegressions.target4ESystemicScenarioExecution && target4E.systemicExecution.failedScenarioCount === 0,
  target4EUnprompted: target4E.systemicExecution.allTasksUnprompted === true,
  target4EDeterministic: target4E.systemicExecution.allReceiptsDeterministic === true,
  rootAgentEntrypointPresent: rootAgents.includes('automatically execute the H-Earth registry preflight') && rootAgents.includes('The user does not need to request registry or validator use') && rootAgents.includes('h-earth-repository-registry-auto-preflight.mjs'),
  scopedAgentEntrypointsPreserved: hEarthAgents.includes('load `registry/h-earth.repository-registry.bootstrap.json` first') && showroomAgents.includes('Gate B West adapter is orchestration only'),
  permanentWorkflowPresent: exists('.github/workflows/h-earth-repository-registry-preflight.yml'),
  permanentWorkflowReadOnly: permanentWorkflow.includes('contents: read'),
  permanentWorkflowPullAndPush: permanentWorkflow.includes('pull_request:') && permanentWorkflow.includes('push:'),
  registeredPathActivates: registeredA.activationStatus === 'ACTIVATED' && registeredA.finalDisposition === 'PASS',
  registeredPathCompleteTrace: registeredA.validatorReceipt.derivationTrace.length === 14,
  unregisteredPathStops: unregistered.activationStatus === 'ACTIVATED' && unregistered.finalDisposition === 'STOP',
  unregisteredPathUnresolvedCodes: unregistered.validatorReceipt.failureCodes.includes('REQUESTED_PATH_UNRESOLVED') && unregistered.validatorReceipt.failureCodes.includes('OPERATION_SCOPE_UNRESOLVED'),
  outsidePathNotApplicable: outside.activationStatus === 'NOT_APPLICABLE' && outside.finalDisposition === 'NOT_APPLICABLE',
  mutationIntentNeverAuthorized: mutationIntent.mutationIntentDetected === true && mutationIntent.mutationMayProceed === false && mutationIntent.continuation === 'SEPARATE_MUTATION_AUTHORITY_REQUIRED_BEFORE_CHANGE',
  activationReceiptsDeterministic: JSON.stringify(registeredA) === JSON.stringify(registeredB),
  oldTarget4BWorkflowAbsent: !exists('.github/workflows/h-earth-repository-registry-target-4b.yml'),
  oldTarget4CWorkflowAbsent: !exists('.github/workflows/h-earth-repository-registry-target-4c.yml'),
  oldTarget4EBoundedWorkflowAbsent: !exists('.github/workflows/h-earth-repository-registry-target-4e-bounded-audit.yml'),
  temporaryTriggerResidueAbsent: trackedFiles.every((file) => !file.includes('target-4e-unregistered') && !file.endsWith('/new-shoreline-module.js')),
  mainCommitMatchesAcceptedMerge: observedMainCommit === ACCEPTED_MAIN_COMMIT,
  executionBranchExact: executionBranch === EVALUATION_BRANCH,
  executionEnvironmentBounded: process.env.GITHUB_ACTIONS === 'true'
};

const failedChecks = Object.entries(checks).filter(([, value]) => value !== true).map(([name]) => name).sort();
const output = {
  receiptId: 'H_EARTH_REPOSITORY_REGISTRY_TARGET_4F_FINAL_INTEGRATED_EXECUTION_RECEIPT_v1',
  targetNumber: 4,
  targetSubtarget: '4F-POST_ACCEPTANCE_REVALIDATION',
  result: failedChecks.length === 0 ? 'PASS' : 'FAIL',
  branch: executionBranch,
  executedCommit: process.env.TARGET_COMMIT ?? process.env.GITHUB_SHA ?? 'LOCAL_UNSPECIFIED',
  executionEnvironment: process.env.GITHUB_ACTIONS === 'true' ? 'BOUNDED_GITHUB_ACTION_ACTUAL_BRANCH_CHECKOUT' : 'LOCAL_NODE',
  audit: {
    auditId: 'H_EARTH_REPOSITORY_REGISTRY_TARGET_4F_FINAL_INTEGRATED_AUDIT_POST_ACCEPTANCE_v2',
    checks,
    totalChecks: Object.keys(checks).length,
    passedChecks: Object.values(checks).filter((value) => value === true).length,
    failedChecks
  },
  regressions: {
    target4A: { result: target4A.result, passedChecks: target4A.passedChecks, failedChecks: target4A.failedChecks.length },
    target4B: { result: target4B.result, passedChecks: target4B.audit.passedChecks, failedChecks: target4B.audit.failedChecks.length },
    target4C: {
      staticResult: target4E.target4CRegression.staticResult,
      staticPassedChecks: target4E.target4CRegression.staticPassedChecks,
      fixtureResult: target4E.target4CRegression.fixtureResult,
      passedFixtureCount: target4E.target4CRegression.passedFixtureCount,
      failedFixtureCount: target4E.target4CRegression.failedFixtureCount
    },
    target4E: {
      result: target4E.result,
      staticPassedChecks: target4E.staticActivationAudit.passedChecks,
      passedScenarioCount: target4E.systemicExecution.passedScenarioCount,
      failedScenarioCount: target4E.systemicExecution.failedScenarioCount,
      allTasksUnprompted: target4E.systemicExecution.allTasksUnprompted,
      allReceiptsDeterministic: target4E.systemicExecution.allReceiptsDeterministic
    }
  },
  activationIntegrity: {
    registeredDisposition: registeredA.finalDisposition,
    registeredAffectedNodeCount: registeredA.validatorReceipt.affectedNodes.length,
    unregisteredDisposition: unregistered.finalDisposition,
    unregisteredFailureCodes: unregistered.validatorReceipt.failureCodes,
    outsideDisposition: outside.finalDisposition,
    mutationIntentDisposition: mutationIntent.finalDisposition,
    mutationMayProceed: mutationIntent.mutationMayProceed,
    deterministic: JSON.stringify(registeredA) === JSON.stringify(registeredB)
  },
  protectedIdentities: protectedResults,
  repositoryState: {
    historicalInstallationBranch: auditContract.execution.installationBranch,
    executionBranch,
    historicalExpectedMainCommit: HISTORICAL_MAIN_BASELINE,
    expectedAcceptedMainCommit: ACCEPTED_MAIN_COMMIT,
    observedMainCommit,
    permanentAutomaticWorkflowPresent: exists('.github/workflows/h-earth-repository-registry-preflight.yml'),
    oldTemporaryWorkflowsAbsent: checks.oldTarget4BWorkflowAbsent && checks.oldTarget4CWorkflowAbsent && checks.oldTarget4EBoundedWorkflowAbsent,
    temporaryTriggerResidueAbsent: checks.temporaryTriggerResidueAbsent
  },
  boundaries: {
    candidatePackageCompleteAfterFinalization: failedChecks.length === 0,
    userAcceptanceEstablished: bootstrap.accepted === true,
    acceptedPackageMergedOnMain: observedMainCommit === ACCEPTED_MAIN_COMMIT,
    mergeAuthorityCreatedByThisAudit: false,
    canonicalizationAuthorityCreated: false,
    sourceAuthorityCreated: false,
    mutationAuthorityCreated: false,
    runtimeAuthorityCreated: false,
    rendererAuthorityCreated: false,
    deploymentAuthorityCreated: false,
    productionAuthorityCreated: false,
    allExternalToolsControlled: false,
    portabilityClaimCreated: false
  },
  stoppingCondition: {
    finalIntegratedAuditPass: failedChecks.length === 0,
    successorValidationMayContinue: failedChecks.length === 0,
    nextAuthorizedSubtarget: failedChecks.length === 0 ? 'SUCCESSOR_REGISTRY_VALIDATION_CONTINUATION' : 'STOP_AND_REPORT'
  }
};

fs.writeFileSync(
  path.join(root, 'h-earth-3d/registry/h-earth.repository-registry.target-4f-receipt.json'),
  JSON.stringify(output, null, 2) + '\n',
  'utf8'
);
process.stdout.write(JSON.stringify(output, null, 2) + '\n');
if (failedChecks.length > 0) process.exitCode = 1;

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

const identity = readJson('h-earth-3d/registry/finalization/h-earth.repository-registry.target-4f.identity-boundary.json');
const ledger = readJson('h-earth-3d/registry/finalization/h-earth.repository-registry.target-4f.target-ledger.json');
const manifest = readJson('h-earth-3d/registry/finalization/h-earth.repository-registry.target-4f.protected-identity-manifest.json');
const auditContract = readJson('h-earth-3d/registry/finalization/h-earth.repository-registry.target-4f.audit-contract.json');
const bootstrap = readJson('h-earth-3d/registry/h-earth.repository-registry.bootstrap.json');
const deferral = readJson('h-earth-3d/registry/portability/h-earth.repository-registry.target-4d.deferral-and-critical-path-reclassification.json');
const target4ECompletion = readJson('h-earth-3d/registry/h-earth.repository-registry.target-4e-completion-receipt.json');
const permanentWorkflow = readText('.github/workflows/h-earth-repository-registry-preflight.yml');
const rootAgents = readText('AGENTS.md');
const hEarthAgents = readText('h-earth-3d/AGENTS.md');
const showroomAgents = readText('showroom/globe/h-earth/AGENTS.md');

const target2 = execJson('tools/h-earth-repository-registry-audit.mjs');
const target3 = execJson('tools/h-earth-repository-registry-target-3-audit.mjs');
const target4A = execJson('tools/h-earth-repository-registry-target-4a-contract-audit.mjs');
const target4B = execJson('tools/h-earth-repository-registry-target-4b-audit.mjs');
const protectedTarget4EReceiptPath = 'h-earth-3d/registry/h-earth.repository-registry.target-4e-receipt.json';
const protectedTarget4EReceiptText = readText(protectedTarget4EReceiptPath);
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
  const actualGitBlobSha = hashObject(relative(entry.path));
  return [name, {
    path: entry.path,
    expectedGitBlobSha: entry.gitBlobSha,
    actualGitBlobSha,
    exact: actualGitBlobSha === entry.gitBlobSha
  }];
}));
const trackedFiles = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
const originMain = execFileSync('git', ['rev-parse', 'origin/main'], { cwd: root, encoding: 'utf8' }).trim();
const expectedMain = auditContract.execution.expectedMainCommit;

const checks = {
  identityExact: identity.identityId === 'H_EARTH_REPOSITORY_REGISTRY_TARGET_4F_FINALIZATION_IDENTITY_AND_BOUNDARY_v1',
  identityCandidateOnly: identity.accepted === false && identity.canonical === false,
  identityWithholdsAcceptance: identity.requiredTerminalState.userAcceptance === false,
  identityWithholdsMerge: identity.requiredTerminalState.mergeAuthorized === false && identity.boundaries.pr61MayBeMerged === false,
  ledgerIdentityExact: ledger.ledgerId === 'H_EARTH_REPOSITORY_REGISTRY_TARGET_4F_COMPLETE_TARGET_LEDGER_v1',
  ledgerHasSevenEntries: ledger.entries.length === 7,
  ledgerTargetOrderExact: JSON.stringify(ledger.entries.map((entry) => entry.target)) === JSON.stringify(['2','3','4A','4B','4C','4D','4E']),
  ledger4DDeferredNonblocking: ledger.entries.find((entry) => entry.target === '4D')?.status === 'OPTIONAL_DEFERRED_GENERALIZATION_LANE' && ledger.reconciliation.hEarthCriticalPathBlocked === false,
  ledgerWithholdsAcceptance: ledger.reconciliation.userAcceptanceEstablished === false && ledger.reconciliation.mergeAuthorityEstablished === false,
  manifestIdentityExact: manifest.manifestId === 'H_EARTH_REPOSITORY_REGISTRY_TARGET_4F_PROTECTED_IDENTITY_MANIFEST_v1',
  manifestProtectedIdentitiesExact: Object.values(protectedResults).every((entry) => entry.exact),
  manifestIdentityBoundaryExact: hashObject('h-earth-3d/registry/finalization/h-earth.repository-registry.target-4f.identity-boundary.json') === manifest.finalizationArtifacts.identityBoundary.gitBlobSha,
  manifestTargetLedgerExact: hashObject('h-earth-3d/registry/finalization/h-earth.repository-registry.target-4f.target-ledger.json') === manifest.finalizationArtifacts.targetLedger.gitBlobSha,
  manifestBootstrapBaselineExact: hashObject('h-earth-3d/registry/h-earth.repository-registry.bootstrap.json') === manifest.finalizationArtifacts.bootstrapBefore4FExecution.gitBlobSha,
  auditContractIdentityExact: auditContract.contractId === 'H_EARTH_REPOSITORY_REGISTRY_TARGET_4F_FINAL_INTEGRATED_AUDIT_CONTRACT_v1',
  auditContractWithholdsAuthority: Object.values(auditContract.boundaries).every((value) => value === false),
  bootstrapCandidateOnly: bootstrap.accepted === false && bootstrap.canonical === false && bootstrap.controlsRepositoryScope === false,
  bootstrapAutomaticModeExact: bootstrap.toolUseMode === 'AUTOMATIC_H_EARTH_SCOPED_READ_ONLY_FOR_COMPATIBLE_REPOSITORY_ENTRYPOINTS',
  bootstrap4DDeferred: bootstrap.portabilityAssessment.status === 'OPTIONAL_DEFERRED_GENERALIZATION_LANE' && bootstrap.portabilityAssessment.hEarthCriticalPathBlocked === false,
  bootstrap4EComplete: bootstrap.automaticActivationAndSystemicComprehension.target4EComplete === true,
  bootstrapNext4F1: bootstrap.stoppingCondition.nextAuthorizedSubtarget === '4F-1',
  deferralExact: deferral.reclassification.remainingTarget4DStatus === 'OPTIONAL_DEFERRED_GENERALIZATION_LANE' && deferral.reclassification.target4BPortabilityRefactorRequiredForHEarth === false,
  target4ECompletionExact: target4ECompletion.result === 'PASS' && target4ECompletion.boundaries.target4EComplete === true,
  target2Pass: target2.result === 'PASS' && target2.passedChecks === auditContract.requiredRegressions.target2InstallationAudit,
  target3Pass: target3.result === 'PASS' && target3.passedChecks === auditContract.requiredRegressions.target3InstructionAudit,
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
  mainCommitUnchanged: originMain === expectedMain,
  executionBranchExact: (process.env.TARGET_BRANCH ?? 'agent/h-earth-repository-registry-installation-001') === auditContract.execution.installationBranch,
  executionEnvironmentBounded: process.env.GITHUB_ACTIONS === 'true'
};

const failedChecks = Object.entries(checks).filter(([, value]) => value !== true).map(([name]) => name).sort();
const output = {
  receiptId: 'H_EARTH_REPOSITORY_REGISTRY_TARGET_4F_FINAL_INTEGRATED_EXECUTION_RECEIPT_v1',
  targetNumber: 4,
  targetSubtarget: '4F-7',
  result: failedChecks.length === 0 ? 'PASS' : 'FAIL',
  branch: process.env.TARGET_BRANCH ?? 'agent/h-earth-repository-registry-installation-001',
  executedCommit: process.env.TARGET_COMMIT ?? process.env.GITHUB_SHA ?? 'LOCAL_UNSPECIFIED',
  executionEnvironment: process.env.GITHUB_ACTIONS === 'true' ? 'BOUNDED_GITHUB_ACTION_ACTUAL_BRANCH_CHECKOUT' : 'LOCAL_NODE',
  audit: {
    auditId: 'H_EARTH_REPOSITORY_REGISTRY_TARGET_4F_FINAL_INTEGRATED_AUDIT_v1',
    checks,
    totalChecks: Object.keys(checks).length,
    passedChecks: Object.values(checks).filter((value) => value === true).length,
    failedChecks
  },
  regressions: {
    target2: { result: target2.result, passedChecks: target2.passedChecks, failedChecks: target2.failedChecks.length },
    target3: { result: target3.result, passedChecks: target3.passedChecks, failedChecks: target3.failedChecks.length },
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
    installationBranch: auditContract.execution.installationBranch,
    expectedMainCommit: expectedMain,
    observedMainCommit: originMain,
    permanentAutomaticWorkflowPresent: exists('.github/workflows/h-earth-repository-registry-preflight.yml'),
    oldTemporaryWorkflowsAbsent: checks.oldTarget4BWorkflowAbsent && checks.oldTarget4CWorkflowAbsent && checks.oldTarget4EBoundedWorkflowAbsent,
    temporaryTriggerResidueAbsent: checks.temporaryTriggerResidueAbsent
  },
  boundaries: {
    candidatePackageCompleteAfterFinalization: failedChecks.length === 0,
    userAcceptanceEstablished: false,
    mergeAuthorityCreated: false,
    canonicalizationAuthorityCreated: false,
    mainActivationCreated: false,
    allExternalToolsControlled: false,
    portabilityClaimCreated: false
  },
  stoppingCondition: {
    finalIntegratedAuditPass: failedChecks.length === 0,
    advanceBeyondTarget4F7: false,
    nextAuthorizedSubtarget: failedChecks.length === 0 ? '4F-8' : 'STOP_AND_REPORT'
  }
};

fs.writeFileSync(
  path.join(root, 'h-earth-3d/registry/h-earth.repository-registry.target-4f-receipt.json'),
  JSON.stringify(output, null, 2) + '\n',
  'utf8'
);
process.stdout.write(JSON.stringify(output, null, 2) + '\n');
if (failedChecks.length > 0) process.exitCode = 1;

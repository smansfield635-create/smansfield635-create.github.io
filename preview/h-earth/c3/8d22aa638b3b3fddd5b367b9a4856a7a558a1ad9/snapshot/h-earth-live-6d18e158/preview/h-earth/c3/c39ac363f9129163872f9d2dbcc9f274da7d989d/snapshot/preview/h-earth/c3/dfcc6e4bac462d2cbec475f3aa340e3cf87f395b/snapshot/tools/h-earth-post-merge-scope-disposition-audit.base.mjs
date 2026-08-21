import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  evaluateHEarthLifecycleTransitionProposal,
  getHEarthLifecycleTransitionDefinition
} from '../h-earth-3d/control-plane/step-1/h-earth.lifecycle-transition.state-machine.js';
import { runAutomaticHEarthPreflight } from '../h-earth-3d/registry/activation/h-earth.repository-registry.auto-preflight.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const relative = (value) => value.startsWith('/') ? value.slice(1) : value;
const readText = (value) => fs.readFileSync(path.join(root, relative(value)), 'utf8');
const readJson = (value) => JSON.parse(readText(value));
const exists = (value) => fs.existsSync(path.join(root, relative(value)));
const committedBlob = (value) => execFileSync('git', ['rev-parse', `HEAD:${relative(value)}`], {
  cwd: root,
  encoding: 'utf8'
}).trim();
const execJson = (value) => JSON.parse(execFileSync(process.execPath, [relative(value)], {
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024
}));
const remoteSha = (ref) => {
  const output = execFileSync('git', ['ls-remote', 'origin', ref], { cwd: root, encoding: 'utf8' }).trim();
  return output ? output.split(/\s+/)[0] : null;
};
const commitDescendsFrom = (descendantSha, ancestorSha) => {
  if (!descendantSha || !ancestorSha) return false;
  try {
    execFileSync('git', ['cat-file', '-e', `${descendantSha}^{commit}`], {
      cwd: root,
      stdio: 'ignore'
    });
    execFileSync('git', ['cat-file', '-e', `${ancestorSha}^{commit}`], {
      cwd: root,
      stdio: 'ignore'
    });
    execFileSync('git', ['merge-base', '--is-ancestor', ancestorSha, descendantSha], {
      cwd: root,
      stdio: 'ignore'
    });
    return true;
  } catch {
    return false;
  }
};

const SOURCE_MERGE = 'ee7324734bb687e71ebb3ee93ff23e6353feb5fe';
const STABILIZATION_MERGE = '08cf54db77dc48e23de8874953561bc2964551ba';
const ARCHIVE_REF = 'refs/heads/archive/h-earth-pr79-42-file-delta-20260723';
const MAIN_REF = 'refs/heads/main';
const STABILIZATION_BRANCH = 'agent/h-earth-post-merge-scope-disposition-001';

const ledger = readJson('/h-earth-3d/control-plane/post-merge-disposition/h-earth.pr79-42-file-delta.ledger.json');
const table = readJson('/h-earth-3d/control-plane/post-merge-disposition/h-earth.pr79-42-file-scope-disposition.table.json');
const plan = readJson('/h-earth-3d/control-plane/post-merge-disposition/h-earth.pr79-corrective-action-plan.json');
const reclassification = readJson('/h-earth-3d/control-plane/post-merge-disposition/h-earth.successor-registry-evidence-lane.reclassification.json');
const manifest = readJson('/h-earth-3d/control-plane/post-merge-disposition/h-earth.pr79-retained-state.identity-manifest.json');
const correctiveReceipt = readJson('/h-earth-3d/control-plane/post-merge-disposition/h-earth.pr79-corrective-action.receipt.json');
const fixtureSuite = readJson('/h-earth-3d/control-plane/step-1/h-earth.lifecycle-transition.fixtures.json');

const checks = {};
const check = (name, condition) => { checks[name] = Boolean(condition); };

check('ledgerIdentityExact', ledger.ledgerId === 'H_EARTH_PR79_POST_MERGE_42_FILE_EXACT_DELTA_LEDGER_v1');
check('ledgerPathCountExact', ledger.summary?.pathCount === 42 && ledger.rows?.length === 42);
check('ledgerDeltaCountsExact', ledger.summary?.added === 40 && ledger.summary?.modified === 2 && ledger.summary?.deleted === 0);
check('tableIdentityExact', table.tableId === 'H_EARTH_PR79_POST_MERGE_42_FILE_SCOPE_DISPOSITION_TABLE_v1');
check('tableRowCountExact', table.rows?.length === 42);
check('tableDispositionCountsExact', JSON.stringify(table.dispositionCounts) === JSON.stringify({ ISOLATE: 18, RETAIN: 17, RECLASSIFY: 6, REVERT: 1, SUPERSEDE: 0 }));
check('tableNoUnresolvedRows', table.exitState?.unresolvedDispositionCount === 0 && table.exitState?.all42RowsClassified === true);
check('planExact', plan.expectedRetainedDeltaPathCount === 24 && plan.expectedRemovedDeltaPathCount === 18 && plan.expectedRestoredLegacyPathCount === 1);
check('correctiveReceiptComplete', correctiveReceipt.exitState?.allCorrectiveActionsComplete === true && correctiveReceipt.isolatedPathCount === 18);
check('reclassificationExact', reclassification.paths?.length === 6 && reclassification.classification === 'NONACTIVE_NONACCEPTED_NONCANONICAL_SUCCESSOR_REGISTRY_EVIDENCE_LANE');

const dispositionIndex = table.columns.indexOf('DISPOSITION');
const pathIndex = table.columns.indexOf('PATH');
const isolatedPaths = table.rows.filter((row) => row[dispositionIndex] === 'ISOLATE').map((row) => row[pathIndex]);
const observedMainCommit = remoteSha(MAIN_REF);
check('isolatedPathCountExact', isolatedPaths.length === 18);
check('allIsolatedPathsAbsent', isolatedPaths.every((repositoryPath) => !exists(repositoryPath)));
check('archiveBranchPreservesOriginalMerge', remoteSha(ARCHIVE_REF) === SOURCE_MERGE);
check('mainContainsStabilizationMerge', commitDescendsFrom(observedMainCommit, STABILIZATION_MERGE));

const retainedResults = Object.entries(manifest.retainedStep1Paths).map(([repositoryPath, expected]) => ({
  repositoryPath,
  expected,
  actual: committedBlob(repositoryPath)
}));
const reclassifiedResults = Object.entries(manifest.reclassifiedSuccessorEvidencePaths).map(([repositoryPath, expected]) => ({
  repositoryPath,
  expected,
  actual: committedBlob(repositoryPath)
}));
check('retainedStep1PathCountExact', retainedResults.length === 17);
check('retainedStep1BlobsExact', retainedResults.every((entry) => entry.actual === entry.expected));
check('reclassifiedPathCountExact', reclassifiedResults.length === 6);
check('reclassifiedBlobsExact', reclassifiedResults.every((entry) => entry.actual === entry.expected));
check('target4FPreMergeBlobRestored', committedBlob(manifest.revertedLegacyPath.path) === manifest.revertedLegacyPath.preMergeGitBlobSha);
check('bootstrapUnchanged', committedBlob('/h-earth-3d/registry/h-earth.repository-registry.bootstrap.json') === manifest.protectedUnchangedIdentities['/h-earth-3d/registry/h-earth.repository-registry.bootstrap.json']);
check('baseRegistryCandidateUnchanged', committedBlob('/h-earth-3d/registry/h-earth.repository-registry.candidate.js') === manifest.protectedUnchangedIdentities['/h-earth-3d/registry/h-earth.repository-registry.candidate.js']);
check('loaderUsesBoundedStep1Overlay', readText('/h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js').includes("./accepted-amendments/h-earth.repository-registry.step-1-scope-reconciliation.js"));

const preflightPaths = Object.keys(manifest.retainedStep1Paths).filter((repositoryPath) =>
  repositoryPath.startsWith('/h-earth-3d/control-plane/step-1/') ||
  repositoryPath === '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.step-1-scope-reconciliation.js'
);
const preflight = runAutomaticHEarthPreflight({
  paths: preflightPaths,
  taskText: 'Audit the retained Step 1 repository-admission state after the bounded 42-file disposition.',
  mutationIntent: false
});
check('retainedStatePreflightPass', preflight.finalDisposition === 'PASS');
check('retainedStatePreflightNoFailures', preflight.validatorReceipt?.failureCodes?.length === 0);
check('preflightRemainsReadOnly', preflight.mutationMayProceed === false && preflight.boundaries?.mutationAuthorityCreated === false);

const amendmentAudit = execJson('/tools/h-earth-repository-registry-compositor-route-amendment-audit.mjs');
const successorAudit = execJson('/tools/h-earth-repository-registry-successor-v2-audit.mjs');
check('amendmentAuditPass', amendmentAudit.result === 'PASS' && amendmentAudit.failedChecks === 0);
check('successorAuditPass', successorAudit.result === 'PASS' && successorAudit.failedCheckCount === 0);
check('successorRemainsNonactive', successorAudit.boundaries?.acceptedBootstrapChanged === false && successorAudit.boundaries?.activeRegistryChanged === false && successorAudit.boundaries?.canonicalizationCreated === false);

execFileSync(process.execPath, ['tools/h-earth-registry-successor-build.mjs'], {
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024
});
let deterministicRebuild = true;
try {
  execFileSync('git', ['diff', '--quiet', '--',
    'h-earth-3d/registry/candidates/h-earth.repository-registry.successor.candidate.js',
    'h-earth-3d/registry/candidates/h-earth.repository-registry.successor.identity.json'
  ], { cwd: root });
} catch {
  deterministicRebuild = false;
}
check('successorRebuildDeterministic', deterministicRebuild);

const mergeProposal = (base, override = {}) => ({
  ...base,
  ...override,
  actorBindings: { ...(base.actorBindings ?? {}), ...(override.actorBindings ?? {}) },
  replay: { ...(base.replay ?? {}), ...(override.replay ?? {}) }
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
      decisionId: `DISPOSITION_FIXTURE_DECISION_${String(index + 1).padStart(3, '0')}`,
      nonce: `DISPOSITION_FIXTURE_NONCE_${String(index + 1).padStart(3, '0')}`
    }
  };
  const proposal = mergeProposal(base, fixture.overrides ?? {});
  if (fixture.sourceState) proposal.sourceState = fixture.sourceState;
  if (fixture.targetState) proposal.targetState = fixture.targetState;
  const receiptA = evaluateHEarthLifecycleTransitionProposal(proposal);
  const receiptB = evaluateHEarthLifecycleTransitionProposal(proposal);
  const pass = receiptA.disposition === fixture.expectedDisposition
    && fixture.expectedFailureCodes.every((entry) => receiptA.failureCodes.includes(entry))
    && JSON.stringify(receiptA) === JSON.stringify(receiptB)
    && receiptA.transitionMayExecute === false
    && receiptA.mutationMayProceed === false
    && receiptA.acceptanceCreated === false
    && receiptA.activationCreated === false
    && receiptA.canonicalizationCreated === false;
  return { fixtureId: fixture.fixtureId, pass, disposition: receiptA.disposition, failureCodes: receiptA.failureCodes };
});
check('fixtureCountExact', fixtureResults.length === 19);
check('all19FixturesPass', fixtureResults.every((entry) => entry.pass));

const failedChecks = Object.entries(checks).filter(([, value]) => value !== true).map(([name]) => name).sort();
const receipt = {
  receiptId: 'H_EARTH_PR79_POST_MERGE_SCOPE_DISPOSITION_RETAINED_STATE_AUDIT_RECEIPT_v2',
  operation: 'POST_MERGE_42_FILE_SCOPE_DISPOSITION',
  checkpoint: 'DISPOSITION_5_RETAINED_STATE_CONTINUITY_AUDIT',
  result: failedChecks.length === 0 ? 'PASS' : 'FAIL',
  branch: process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || STABILIZATION_BRANCH,
  executedCommit: process.env.GITHUB_SHA ?? 'LOCAL_UNSPECIFIED',
  totalChecks: Object.keys(checks).length,
  passedChecks: Object.values(checks).filter(Boolean).length,
  failedChecks,
  checks,
  retainedResults,
  reclassifiedResults,
  isolatedPaths,
  fixtureExecution: {
    total: fixtureResults.length,
    passed: fixtureResults.filter((entry) => entry.pass).length,
    failed: fixtureResults.filter((entry) => !entry.pass).length,
    results: fixtureResults
  },
  preflight: {
    disposition: preflight.finalDisposition,
    failureCodes: preflight.validatorReceipt?.failureCodes ?? [],
    mutationMayProceed: preflight.mutationMayProceed
  },
  successorAudits: {
    amendment: amendmentAudit.result,
    successor: successorAudit.result,
    deterministicRebuild
  },
  repositoryState: {
    sourceMergeCommit: SOURCE_MERGE,
    stabilizationMergeCommit: STABILIZATION_MERGE,
    observedMainCommit,
    mainContainsStabilizationMerge: checks.mainContainsStabilizationMerge,
    archiveBranchCommit: remoteSha(ARCHIVE_REF),
    isolatedPathCount: isolatedPaths.length,
    retainedStep1PathCount: retainedResults.length,
    reclassifiedSuccessorPathCount: reclassifiedResults.length,
    target4FRestoredBlob: committedBlob(manifest.revertedLegacyPath.path)
  },
  boundaries: {
    laterMainAdvancementPermitted: true,
    repositoryMutationAuthorityCreated: false,
    mainChangedByThisAudit: false,
    successorAccepted: false,
    successorActivated: false,
    bootstrapChanged: false,
    baseRegistryCandidateChanged: false,
    canonicalizationAuthorityEstablished: false,
    actorBindingsEstablished: false,
    transitionExecutionAuthorityEstablished: false
  },
  exitState: {
    auditsPass: failedChecks.length === 0,
    retainedStateContinuityEstablished: failedChecks.length === 0,
    obsoleteMainEqualityAssertionRetired: true
  }
};

fs.mkdirSync(path.join(root, 'artifacts'), { recursive: true });
fs.writeFileSync(
  path.join(root, 'artifacts/h-earth-post-merge-scope-disposition-audit-receipt.json'),
  `${JSON.stringify(receipt, null, 2)}\n`,
  'utf8'
);
process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
if (failedChecks.length > 0) process.exitCode = 1;

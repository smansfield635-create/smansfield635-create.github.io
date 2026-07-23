import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { runHEarthRepositoryRegistryTarget4EStaticAudit } from './h-earth-repository-registry-target-4e-static-audit.mjs';
import { runHEarthRepositoryRegistryTarget4CStaticAudit } from './h-earth-repository-registry-target-4c-static-audit.mjs';
import { runHEarthRepositoryRegistryTarget4CFixtureSuite } from '../h-earth-3d/registry/fixtures/h-earth.repository-registry.fixture-suite.runner.js';
import { runHEarthRepositoryRegistryTarget4ESystemicScenarios } from '../h-earth-3d/registry/activation/h-earth.repository-registry.target-4e.runner.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const systemicReceiptsDirectory = path.join(root, 'h-earth-3d/registry/activation/receipts');
const hashObject = (relativePath) => execFileSync('git', ['hash-object', relativePath], { cwd: root, encoding: 'utf8' }).trim();

function runTarget4BRegression() {
  const output = execFileSync(
    process.execPath,
    ['--experimental-default-type=module', 'tools/h-earth-repository-registry-target-4b-audit.mjs'],
    { cwd: root, encoding: 'utf8', env: process.env }
  );
  return JSON.parse(output);
}

const staticActivationAudit = runHEarthRepositoryRegistryTarget4EStaticAudit();
const target4BRegression = staticActivationAudit.result === 'PASS' ? runTarget4BRegression() : null;
const target4CStaticRegression = staticActivationAudit.result === 'PASS'
  ? runHEarthRepositoryRegistryTarget4CStaticAudit()
  : null;
const target4CFixtureRegression = target4CStaticRegression?.result === 'PASS'
  ? runHEarthRepositoryRegistryTarget4CFixtureSuite({ writeIndividualReceipts: false })
  : null;
const systemicExecution = target4CFixtureRegression?.finalResult === 'PASS'
  ? runHEarthRepositoryRegistryTarget4ESystemicScenarios({
      writeReceipts: true,
      receiptsDirectory: systemicReceiptsDirectory
    })
  : null;

const passed = staticActivationAudit.result === 'PASS' &&
  target4BRegression?.result === 'PASS' &&
  target4CStaticRegression?.result === 'PASS' &&
  target4CFixtureRegression?.finalResult === 'PASS' &&
  systemicExecution?.finalResult === 'PASS';

const output = {
  receiptId: 'H_EARTH_REPOSITORY_REGISTRY_TARGET_4E_AUTOMATIC_ACTIVATION_AND_SYSTEMIC_COMPREHENSION_RECEIPT_v1',
  targetNumber: 4,
  targetSubtarget: '4E-13',
  result: passed ? 'PASS' : 'FAIL',
  branch: process.env.TARGET_BRANCH ?? process.env.GITHUB_REF_NAME ?? 'agent/h-earth-repository-registry-installation-001',
  executedCommit: process.env.TARGET_COMMIT ?? process.env.GITHUB_SHA ?? 'LOCAL_UNSPECIFIED',
  executionEnvironment: process.env.GITHUB_ACTIONS === 'true'
    ? 'BOUNDED_GITHUB_ACTION_ACTUAL_BRANCH_CHECKOUT'
    : 'LOCAL_NODE',
  staticActivationAudit,
  target4BRegression: target4BRegression && {
    result: target4BRegression.result,
    totalChecks: target4BRegression.audit.totalChecks,
    passedChecks: target4BRegression.audit.passedChecks,
    failedChecks: target4BRegression.audit.failedChecks
  },
  target4CRegression: target4CStaticRegression && target4CFixtureRegression && {
    staticResult: target4CStaticRegression.result,
    staticTotalChecks: target4CStaticRegression.totalChecks,
    staticPassedChecks: target4CStaticRegression.passedChecks,
    staticFailedChecks: target4CStaticRegression.failedChecks,
    fixtureResult: target4CFixtureRegression.finalResult,
    executedFixtureCount: target4CFixtureRegression.executedFixtureCount,
    passedFixtureCount: target4CFixtureRegression.passedFixtureCount,
    failedFixtureCount: target4CFixtureRegression.failedFixtureCount
  },
  systemicExecution,
  componentGitBlobs: {
    rootAgentEntrypoint: hashObject('AGENTS.md'),
    activationIdentityBoundary: hashObject('h-earth-3d/registry/activation/h-earth.repository-registry.target-4e.identity-boundary.json'),
    target4DDeferral: hashObject('h-earth-3d/registry/portability/h-earth.repository-registry.target-4d.deferral-and-critical-path-reclassification.json'),
    activationContract: hashObject('h-earth-3d/registry/activation/h-earth.repository-registry.automatic-preflight.contract.json'),
    activationModule: hashObject('h-earth-3d/registry/activation/h-earth.repository-registry.auto-preflight.js'),
    automaticCli: hashObject('tools/h-earth-repository-registry-auto-preflight.mjs'),
    automaticWorkflow: hashObject('.github/workflows/h-earth-repository-registry-preflight.yml'),
    scenarioManifest: hashObject('h-earth-3d/registry/activation/h-earth.repository-registry.target-4e.scenarios.json'),
    scenarioRunner: hashObject('h-earth-3d/registry/activation/h-earth.repository-registry.target-4e.runner.js'),
    staticAudit: hashObject('tools/h-earth-repository-registry-target-4e-static-audit.mjs'),
    executionHarness: hashObject('tools/h-earth-repository-registry-target-4e-audit.mjs')
  },
  protectedIdentities: {
    target2RegistryGitBlob: hashObject('h-earth-3d/registry/h-earth.repository-registry.candidate.js'),
    target3InstructionGitBlob: hashObject('h-earth-3d/registry/h-earth.repository-registry.tool-instruction.json'),
    target4AContractGitBlob: hashObject('h-earth-3d/registry/h-earth.repository-registry.validator-contract.json'),
    target4BEngineGitBlob: hashObject('h-earth-3d/registry/h-earth.repository-registry.validator-engine.js'),
    target4CCompletionReceiptGitBlob: hashObject('h-earth-3d/registry/h-earth.repository-registry.target-4c-completion-receipt.json'),
    target4DBlockerReceiptGitBlob: hashObject('h-earth-3d/registry/h-earth.repository-registry.target-4d-blocker-receipt.json')
  },
  activationClassification: {
    repositoryRootAgentEntrypointInstalled: true,
    automaticWorkflowCandidateInstalled: true,
    automaticWorkflowActiveOnMain: false,
    compatibleAgentUserPromptRequired: false,
    githubChangeUserPromptRequiredAfterWorkflowActivation: false,
    allExternalToolsControlled: false
  },
  boundaries: {
    mutationAuthorityCreated: false,
    mergeAuthorityCreated: false,
    canonicalizationAuthorityCreated: false,
    branchProtectionCreated: false,
    workflowActiveOnMainBeforeMerge: false,
    portabilityGeneralizationPerformed: false,
    runtimeActivationCreated: false,
    rendererActivationCreated: false,
    productionClaimCreated: false,
    mainChanged: false
  }
};

fs.writeFileSync(
  path.join(root, 'h-earth-3d/registry/h-earth.repository-registry.target-4e-receipt.json'),
  `${JSON.stringify(output, null, 2)}\n`,
  'utf8'
);
process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
if (!passed) process.exitCode = 1;

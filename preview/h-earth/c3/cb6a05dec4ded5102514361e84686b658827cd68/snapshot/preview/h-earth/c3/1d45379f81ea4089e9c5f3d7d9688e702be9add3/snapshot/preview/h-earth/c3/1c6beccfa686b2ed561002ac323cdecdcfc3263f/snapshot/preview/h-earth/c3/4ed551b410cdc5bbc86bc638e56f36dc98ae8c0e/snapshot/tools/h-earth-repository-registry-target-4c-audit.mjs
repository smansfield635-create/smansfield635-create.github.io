import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { runHEarthRepositoryRegistryTarget4CStaticAudit } from './h-earth-repository-registry-target-4c-static-audit.mjs';
import { runHEarthRepositoryRegistryTarget4CFixtureSuite } from '../h-earth-3d/registry/fixtures/h-earth.repository-registry.fixture-suite.runner.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const receiptsDirectory = path.join(root, 'h-earth-3d/registry/fixtures/receipts');
const hashObject = (relativePath) => execFileSync('git', ['hash-object', relativePath], { cwd: root, encoding: 'utf8' }).trim();
const staticAudit = runHEarthRepositoryRegistryTarget4CStaticAudit();
const suite = staticAudit.result === 'PASS'
  ? runHEarthRepositoryRegistryTarget4CFixtureSuite({ writeIndividualReceipts: true, receiptsDirectory })
  : null;
const passed = staticAudit.result === 'PASS' && suite?.finalResult === 'PASS';

const output = {
  receiptId: 'H_EARTH_REPOSITORY_REGISTRY_TARGET_4C_FIXTURE_EXECUTION_RECEIPT_v1',
  targetNumber: 4,
  targetSubtarget: '4C-13',
  result: passed ? 'PASS' : 'FAIL',
  branch: process.env.TARGET_BRANCH ?? process.env.GITHUB_REF_NAME ?? 'agent/h-earth-repository-registry-installation-001',
  executedCommit: process.env.TARGET_COMMIT ?? process.env.GITHUB_SHA ?? 'UNSPECIFIED',
  executionEnvironment: process.env.GITHUB_ACTIONS === 'true'
    ? 'BOUNDED_GITHUB_ACTION_ACTUAL_BRANCH_CHECKOUT'
    : 'LOCAL_NODE',
  staticAudit,
  fixtureExecution: suite,
  gitBlobs: {
    suiteIdentity: hashObject('h-earth-3d/registry/fixtures/h-earth.repository-registry.fixture-suite.identity.js'),
    fixtureContract: hashObject('h-earth-3d/registry/fixtures/h-earth.repository-registry.fixture-suite.contract.json'),
    completeOperationBuilder: hashObject('h-earth-3d/registry/fixtures/h-earth.repository-registry.fixture-suite.builder.js'),
    fixtureManifest: hashObject('h-earth-3d/registry/fixtures/h-earth.repository-registry.fixture-suite.fixtures.js'),
    expectedOutcomeOracle: hashObject('h-earth-3d/registry/fixtures/h-earth.repository-registry.fixture-suite.oracle.json'),
    fixtureRunner: hashObject('h-earth-3d/registry/fixtures/h-earth.repository-registry.fixture-suite.runner.js'),
    staticAudit: hashObject('tools/h-earth-repository-registry-target-4c-static-audit.mjs'),
    executionHarness: hashObject('tools/h-earth-repository-registry-target-4c-audit.mjs')
  },
  protectedIdentities: {
    target2RegistryGitBlob: hashObject('h-earth-3d/registry/h-earth.repository-registry.candidate.js'),
    target3InstructionGitBlob: hashObject('h-earth-3d/registry/h-earth.repository-registry.tool-instruction.json'),
    target4AContractGitBlob: hashObject('h-earth-3d/registry/h-earth.repository-registry.validator-contract.json'),
    target4BEngineGitBlob: hashObject('h-earth-3d/registry/h-earth.repository-registry.validator-engine.js')
  },
  boundaries: {
    fixtureSuiteExecuted: suite !== null,
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
if (!passed) process.exitCode = 1;

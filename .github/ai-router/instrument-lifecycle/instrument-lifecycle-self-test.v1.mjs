#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyRunSignal, observeRepository } from './instrument-lifecycle-gate.v1.mjs';

const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]))
    : value;
const write = (file, text) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, text); };

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'instrument-lifecycle-'));
  write(path.join(root, '.github/workflows/registered.yml'), 'name: registered\non:\n  push:\npermissions:\n  contents: read\njobs:\n  x:\n    runs-on: ubuntu-latest\n    steps:\n      - run: true\n');
  write(path.join(root, '.github/workflows/unregistered-write.yml'), 'name: write\non:\n  push:\npermissions:\n  contents: write\njobs:\n  x:\n    runs-on: ubuntu-latest\n    steps:\n      - run: true\n');
  write(path.join(root, '.github/workflows/unregistered-read.yml'), 'name: read\non:\n  workflow_dispatch:\npermissions:\n  contents: read\njobs:\n  x:\n    runs-on: ubuntu-latest\n    steps:\n      - run: true\n');
  write(path.join(root, '.github/workflows/historical.yml'), 'name: historical\non:\n  pull_request:\npermissions:\n  contents: write\njobs:\n  x:\n    runs-on: ubuntu-latest\n    steps:\n      - run: true\n');
  write(path.join(root, '.github/workflows/compat.yml'), 'name: compat\non:\n  pull_request:\npermissions:\n  contents: read\njobs:\n  x:\n    runs-on: ubuntu-latest\n    steps:\n      - run: true\n');
  return root;
}

export function runSelfTest() {
  const root = fixture();
  const registry = {
    schema: 'REPOSITORY_INSTRUMENT_LIFECYCLE_REGISTRY_v1',
    defaultUnregisteredReadOnlyState: 'REVIEW_REQUIRED',
    defaultUnregisteredWriteCapableState: 'QUARANTINED',
    records: [
      { workflowPath: '.github/workflows/historical.yml', state: 'HISTORICAL_PINNED', currentAuthority: false, physicalRetirementAuthorized: false },
      { workflowPath: '.github/workflows/compat.yml', state: 'ACTIVE_COMPATIBILITY', currentAuthority: true, protected: true, physicalRetirementAuthorized: false }
    ]
  };
  const router = {
    schema: 'REPOSITORY_AI_ROUTER_REGISTRY_v1',
    routerInfrastructure: { ownedExactPaths: ['.github/workflows/registered.yml'] },
    projects: []
  };
  const protectedRegistry = {
    schema: 'REPOSITORY_PROTECTED_LIVE_OPERATIONS_v1',
    records: [{ id: 'LIVE', workflowPaths: ['.github/workflows/compat.yml'] }]
  };
  const observed = observeRepository({ repoRoot: root, registry, router, protectedRegistry });
  const byPath = new Map(observed.workflows.map(item => [item.workflowPath, item]));
  const assertions = [
    ['REGISTERED_CURRENT', byPath.get('.github/workflows/registered.yml')?.state === 'ACTIVE_CURRENT'],
    ['UNREGISTERED_WRITE_QUARANTINED', byPath.get('.github/workflows/unregistered-write.yml')?.state === 'QUARANTINED'],
    ['UNREGISTERED_READ_REVIEW', byPath.get('.github/workflows/unregistered-read.yml')?.state === 'REVIEW_REQUIRED'],
    ['HISTORICAL_EXPLICIT', byPath.get('.github/workflows/historical.yml')?.state === 'HISTORICAL_PINNED'],
    ['COMPAT_PROTECTED', byPath.get('.github/workflows/compat.yml')?.state === 'ACTIVE_COMPATIBILITY' && byPath.get('.github/workflows/compat.yml')?.protected === true],
    ['NO_JOBS_SIGNAL', classifyRunSignal({ conclusion: 'failure', jobCount: 0 }) === 'NO_JOBS_FALSE_DANGER'],
    ['EXPECTED_NEGATIVE_SIGNAL', classifyRunSignal({ conclusion: 'failure', jobCount: 1, expectedNegative: true }) === 'EXPECTED_NEGATIVE'],
    ['FAIL_CLOSED_SIGNAL', classifyRunSignal({ conclusion: 'failure', jobCount: 1, failClosedProtection: true }) === 'FAIL_CLOSED_PROTECTION'],
    ['STALE_SIGNAL', classifyRunSignal({ conclusion: 'failure', jobCount: 1, staleTarget: true }) === 'STALE_TARGET'],
    ['INFRA_SIGNAL', classifyRunSignal({ conclusion: 'failure', jobCount: 1, infrastructureFailure: true }) === 'INFRASTRUCTURE_FAILURE'],
    ['TRUE_REGRESSION_SIGNAL', classifyRunSignal({ conclusion: 'failure', jobCount: 1 }) === 'TRUE_REGRESSION'],
    ['NO_ENFORCEMENT', observed.enforcementAuthorized === false && observed.physicalRetirementPerformed === false],
    ['SYSTEM_GAP_REMAINS_OPEN', observed.systemGapClosed === false]
  ];
  const failed = assertions.filter(([, pass]) => !pass).map(([id]) => id);
  fs.rmSync(root, { recursive: true, force: true });
  return stable({
    schema: 'INSTRUMENT_LIFECYCLE_SELF_TEST_RECEIPT_v1',
    result: failed.length ? 'FAIL' : 'PASS',
    scenarioCount: assertions.length,
    passedCount: assertions.length - failed.length,
    failedCount: failed.length,
    failed,
    repositoryMutationPerformed: false,
    existingWorkflowTriggerMutationPerformed: false,
    workflowDeactivationPerformed: false,
    physicalRetirementPerformed: false
  });
}

function outputArg(argv) {
  const index = argv.indexOf('--output');
  return index >= 0 ? argv[index + 1] : null;
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  try {
    const receipt = runSelfTest();
    const output = outputArg(process.argv.slice(2));
    if (output) {
      fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
      fs.writeFileSync(path.resolve(output), JSON.stringify(receipt, null, 2) + '\n');
    } else {
      process.stdout.write(JSON.stringify(receipt, null, 2) + '\n');
    }
    if (receipt.result !== 'PASS') process.exitCode = 1;
  } catch (error) {
    process.stderr.write(JSON.stringify({ schema: 'INSTRUMENT_LIFECYCLE_SELF_TEST_FAILURE_v1', error: error.message }) + '\n');
    process.exitCode = 1;
  }
}

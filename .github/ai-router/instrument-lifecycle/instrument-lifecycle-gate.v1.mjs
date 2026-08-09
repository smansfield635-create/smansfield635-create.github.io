#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const STATES = Object.freeze([
  'ACTIVE_CURRENT',
  'ACTIVE_COMPATIBILITY',
  'HISTORICAL_PINNED',
  'SUPERSEDED',
  'QUARANTINED',
  'REVIEW_REQUIRED'
]);

const WRITE_PERMISSION = /^\s*(actions|checks|contents|deployments|id-token|issues|packages|pages|pull-requests|security-events|statuses):\s*write\s*(?:#.*)?$/m;
const TRIGGERS = Object.freeze(['push','pull_request','pull_request_target','issue_comment','workflow_dispatch','workflow_call','schedule']);
const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]))
    : value;
const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  fs.writeFileSync(path.resolve(file), JSON.stringify(stable(value), null, 2) + '\n');
};
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!key?.startsWith('--') || value === undefined) throw new Error(`ARGUMENT_INVALID:${key}`);
    out[key.slice(2)] = value;
  }
  for (const required of ['repo-root','registry','router','protected','output']) {
    if (!out[required]) throw new Error(`ARGUMENT_MISSING:${required}`);
  }
  return out;
}

function workflowFiles(repoRoot) {
  const dir = path.join(repoRoot, '.github', 'workflows');
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isFile() && /\.ya?ml$/i.test(entry.name))
    .map(entry => `.github/workflows/${entry.name}`)
    .sort();
}

function routerWorkflowSet(router) {
  const exact = new Set();
  for (const value of router?.routerInfrastructure?.ownedExactPaths ?? []) {
    if (String(value).startsWith('.github/workflows/')) exact.add(String(value));
  }
  for (const project of router?.projects ?? []) {
    for (const value of project?.ownedExactPaths ?? []) {
      if (String(value).startsWith('.github/workflows/')) exact.add(String(value));
    }
  }
  return exact;
}

function triggerNames(text) {
  const found = [];
  for (const trigger of TRIGGERS) {
    const pattern = new RegExp(`^\\s*${trigger.replace('-', '\\-')}:`, 'm');
    if (pattern.test(text)) found.push(trigger);
  }
  return found;
}

export function classifyRunSignal(input = {}) {
  if (Number(input.jobCount) === 0 && input.conclusion === 'failure') return 'NO_JOBS_FALSE_DANGER';
  if (input.notApplicable === true) return 'NOT_APPLICABLE';
  if (input.expectedNegative === true) return 'EXPECTED_NEGATIVE';
  if (input.failClosedProtection === true) return 'FAIL_CLOSED_PROTECTION';
  if (input.staleTarget === true) return 'STALE_TARGET';
  if (input.infrastructureFailure === true) return 'INFRASTRUCTURE_FAILURE';
  if (input.conclusion === 'failure') return 'TRUE_REGRESSION';
  return 'UNKNOWN_REVIEW_REQUIRED';
}

export function observeRepository({ repoRoot, registry, router, protectedRegistry }) {
  if (registry?.schema !== 'REPOSITORY_INSTRUMENT_LIFECYCLE_REGISTRY_v1') throw new Error('REGISTRY_SCHEMA_MISMATCH');
  if (router?.schema !== 'REPOSITORY_AI_ROUTER_REGISTRY_v1') throw new Error('ROUTER_SCHEMA_MISMATCH');
  if (protectedRegistry?.schema !== 'REPOSITORY_PROTECTED_LIVE_OPERATIONS_v1') throw new Error('PROTECTED_REGISTRY_SCHEMA_MISMATCH');

  const explicit = new Map((registry.records ?? []).map(record => [record.workflowPath, record]));
  const routed = routerWorkflowSet(router);
  const protectedPaths = new Set((protectedRegistry.records ?? []).flatMap(record => record.workflowPaths ?? []));
  const workflows = workflowFiles(repoRoot).map(workflowPath => {
    const text = fs.readFileSync(path.join(repoRoot, workflowPath), 'utf8');
    const writeCapable = WRITE_PERMISSION.test(text);
    const routerRegistered = routed.has(workflowPath);
    const record = explicit.get(workflowPath) ?? null;
    let state;
    let derivation;
    if (record) {
      state = record.state;
      derivation = 'EXPLICIT_REGISTRY';
    } else if (routerRegistered) {
      state = 'ACTIVE_CURRENT';
      derivation = 'ROUTER_REGISTERED';
    } else if (writeCapable) {
      state = registry.defaultUnregisteredWriteCapableState ?? 'QUARANTINED';
      derivation = 'UNREGISTERED_WRITE_CAPABLE';
    } else {
      state = registry.defaultUnregisteredReadOnlyState ?? 'REVIEW_REQUIRED';
      derivation = 'UNREGISTERED_READ_ONLY';
    }
    if (!STATES.includes(state)) throw new Error(`STATE_INVALID:${workflowPath}:${state}`);
    const isProtected = protectedPaths.has(workflowPath) || record?.protected === true;
    if (isProtected && ['HISTORICAL_PINNED','SUPERSEDED','QUARANTINED'].includes(state)) {
      throw new Error(`PROTECTED_WORKFLOW_UNSAFE_CLASSIFICATION:${workflowPath}:${state}`);
    }
    const currentAuthority = record
      ? record.currentAuthority === true
      : routerRegistered && state === 'ACTIVE_CURRENT';
    return stable({
      workflowPath,
      state,
      derivation,
      currentAuthority,
      protected: isProtected,
      routerRegistered,
      writeCapable,
      triggers: triggerNames(text),
      physicalRetirementAuthorized: record?.physicalRetirementAuthorized === true
    });
  });

  const countByState = Object.fromEntries(STATES.map(state => [state, workflows.filter(item => item.state === state).length]));
  const writeCapableUnregistered = workflows.filter(item => item.writeCapable && !item.routerRegistered).length;
  const protectedCount = workflows.filter(item => item.protected).length;
  const historicalCount = workflows.filter(item => item.state === 'HISTORICAL_PINNED').length;
  const reviewRequiredCount = workflows.filter(item => ['REVIEW_REQUIRED','QUARANTINED'].includes(item.state)).length;
  return stable({
    schema: 'INSTRUMENT_LIFECYCLE_OBSERVATION_RECEIPT_v1',
    result: 'PASS_OBSERVATION',
    phase: 'OBSERVATION_ONLY',
    workflowCount: workflows.length,
    countByState,
    writeCapableUnregistered,
    protectedCount,
    historicalCount,
    reviewRequiredCount,
    systemGapClosed: false,
    enforcementAuthorized: false,
    existingWorkflowTriggerMutationAuthorized: false,
    existingWorkflowPermissionMutationAuthorized: false,
    workflowDeactivationAuthorized: false,
    physicalRetirementPerformed: false,
    repositoryMutationPerformedByGate: false,
    workflows
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = path.resolve(args['repo-root']);
  const receipt = observeRepository({
    repoRoot,
    registry: readJson(path.resolve(repoRoot, args.registry)),
    router: readJson(path.resolve(repoRoot, args.router)),
    protectedRegistry: readJson(path.resolve(repoRoot, args.protected))
  });
  writeJson(args.output, receipt);
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) main().catch(error => {
  process.stderr.write(JSON.stringify({ schema: 'INSTRUMENT_LIFECYCLE_GATE_FAILURE_v1', error: error.message }) + '\n');
  process.exitCode = 1;
});

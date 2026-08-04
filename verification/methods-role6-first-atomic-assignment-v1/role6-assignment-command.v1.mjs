#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import {
  prepareAssignmentTransaction,
  readJson,
  ASSIGNMENT_PATHS
} from '../../control-plane/methods-information-benchmark/assignment-successor-gap-closure/first-assignment-compare-and-swap-executor.v2.mjs';

const SUBJECT_HEAD = 'ce40519190a9048c1e0cef682108c34b0a7f8055';
const ASSIGNMENT_BASE = 'cfc2dc915ae84fd6349832500165a40a5dd0ddb8';
const ASSIGNMENT_ID = '8c4d0f0fb1b3068764e476c4';
const AUTHORIZATION_SHA256 = '4f2a24c7b6a0bdf46e9d83a41ec27eae605016c12a451b109b26ee97ed5fdfc0';
const APPROVAL_SHA256 = '415318812af834cc3be2c9658aca03696ab1d7f92cb6c94a193ffd2bb7306769';
const TRANSACTION_HOLDER = 'MIB_ROLE6_FIRST_ASSIGNMENT_HOLDER_20260804_1802_6BB3D2454E65D0254CD93ED7';
const TRANSACTION_TIME = '2026-08-04T18:12:00-05:00';
const INPUT_ROOT = 'verification/methods-role6-first-atomic-assignment-v1';
const PACKET = 'control-plane/methods-information-benchmark/role6-developmental-baseline-successor/methods-role6-developmental-baseline-successor.packet.v1.json';

function fail(code, detail = null) {
  const error = new Error(detail ? `${code}:${detail}` : code);
  error.code = code;
  error.detail = detail;
  throw error;
}

function args(values) {
  const out = {};
  for (let i = 0; i < values.length; i += 2) {
    if (!values[i]?.startsWith('--') || values[i + 1] == null) fail('ARGUMENT_INVALID', values[i]);
    out[values[i].slice(2)] = values[i + 1];
  }
  return out;
}

function git(root, values) {
  return cp.execFileSync('git', ['-C', root, ...values], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
}

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
  return value;
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true });
  fs.writeFileSync(path.resolve(filePath), `${JSON.stringify(stable(value), null, 2)}\n`);
}

export function executeAssignmentValidation({ root, expectedToolingHead, subjectAssignmentHead, executionHolder }) {
  const actualHead = git(root, ['rev-parse', 'HEAD^{commit}']);
  if (actualHead !== expectedToolingHead) fail('EXACT_TOOLING_HEAD_MISMATCH', `${expectedToolingHead}:${actualHead}`);
  if (subjectAssignmentHead !== SUBJECT_HEAD) fail('ASSIGNMENT_SUBJECT_HEAD_MISMATCH', subjectAssignmentHead);
  cp.execFileSync('git', ['-C', root, 'merge-base', '--is-ancestor', SUBJECT_HEAD, actualHead]);

  const changed = git(root, ['diff', '--name-only', ASSIGNMENT_BASE, SUBJECT_HEAD]).split(/\r?\n/).filter(Boolean).sort();
  const expectedPaths = [...ASSIGNMENT_PATHS].sort();
  if (JSON.stringify(changed) !== JSON.stringify(expectedPaths)) fail('ASSIGNMENT_CHANGED_PATH_SET_MISMATCH');

  const authorization = readJson(path.join(root, INPUT_ROOT, 'authorization.v2.json'));
  const result = prepareAssignmentTransaction({
    ledger: readJson(path.join(root, INPUT_ROOT, 'initial-ledger.v1.json')),
    nonceState: readJson(path.join(root, INPUT_ROOT, 'nonce-state.v1.json')),
    eligibility: readJson(path.join(root, INPUT_ROOT, 'activation-eligibility.receipt.v2.json')),
    packet: readJson(path.join(root, PACKET)),
    authorization,
    approval: readJson(path.join(root, INPUT_ROOT, 'approval.receipt.v1.json')),
    pathManifest: readJson(path.join(root, INPUT_ROOT, 'assignment-path-manifest.v1.json')),
    holderExecutionId: TRANSACTION_HOLDER,
    now: TRANSACTION_TIME
  });

  if (result.assignmentId !== ASSIGNMENT_ID) fail('ASSIGNMENT_ID_MISMATCH');
  if (result.authorizationSha256 !== AUTHORIZATION_SHA256) fail('AUTHORIZATION_HASH_MISMATCH');
  if (result.approvalSha256 !== APPROVAL_SHA256) fail('APPROVAL_HASH_MISMATCH');

  const outputBlobMap = [];
  for (const filePath of ASSIGNMENT_PATHS) {
    const expectedBytes = Buffer.from(`${JSON.stringify(result.outputs[filePath], null, 2)}\n`, 'utf8');
    const committedBytes = cp.execFileSync('git', ['-C', root, 'show', `${SUBJECT_HEAD}:${filePath}`], { maxBuffer: 64 * 1024 * 1024 });
    if (!expectedBytes.equals(committedBytes)) fail('ASSIGNMENT_OUTPUT_BYTE_MISMATCH', filePath);
    outputBlobMap.push({
      path: filePath,
      gitBlob: git(root, ['rev-parse', `${SUBJECT_HEAD}:${filePath}`]),
      sha256: sha256(committedBytes)
    });
  }

  if (git(root, ['status', '--porcelain=v1', '--untracked-files=all'])) fail('TOOLING_WORKTREE_DIRTY');

  return stable({
    schema: 'METHODS_ROLE_6_FIRST_ATOMIC_ASSIGNMENT_COMMAND_PAYLOAD_RECEIPT_v1',
    result: 'PASS_CLOSED_ROLE_6_ASSIGNMENT_VALIDATED_AND_ACTIVE',
    commandAction: 'VALIDATE_EXISTING_IMMUTABLE_ASSIGNMENT_TRANSACTION',
    executionHolder,
    exactToolingHead: actualHead,
    subjectAssignmentHead: SUBJECT_HEAD,
    assignmentBase: ASSIGNMENT_BASE,
    assignmentId: ASSIGNMENT_ID,
    authorizationSha256: AUTHORIZATION_SHA256,
    approvalSha256: APPROVAL_SHA256,
    transactionHolder: TRANSACTION_HOLDER,
    exactChangedPaths: ASSIGNMENT_PATHS,
    outputBlobMap,
    role6AssignmentValidated: true,
    assignmentAuthorityActive: true,
    operationScopedAuthority: true,
    generalRoleAuthority: false,
    canonicalRoleId: 'ROLE_6_REQUIREMENTS_AND_CAUSAL_AUTHORITY',
    canonicalAuditOperationId: 'METHODS_FORMAL_RECORD_TYPE_DEPENDENCY_THREE_ANCHOR_AND_DEVELOPMENTAL_BASELINE_AUDIT_v1',
    returnRequired: true,
    postTerminationRoleState: 'INACTIVE',
    residualGeneralRoleAuthorityAllowed: false,
    assignmentPerformedByThisCommand: false,
    substantiveAuditOutputsCreated: false,
    productMutationPerformed: false,
    mergePerformed: false,
    repairPerformed: false,
    privateStateDependency: false
  });
}

function main() {
  const options = args(process.argv.slice(2));
  const root = path.resolve(options.root ?? '.');
  const receipt = executeAssignmentValidation({
    root,
    expectedToolingHead: options['expected-tooling-head'],
    subjectAssignmentHead: options['subject-assignment-head'],
    executionHolder: options['execution-holder']
  });
  writeJson(options.output, receipt);
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  try {
    main();
  } catch (error) {
    const options = (() => { try { return args(process.argv.slice(2)); } catch { return {}; } })();
    const failure = stable({
      schema: 'METHODS_ROLE_6_FIRST_ATOMIC_ASSIGNMENT_COMMAND_PAYLOAD_RECEIPT_v1',
      result: 'FAIL_CLOSED',
      errorCode: error.code ?? 'UNEXPECTED_ASSIGNMENT_COMMAND_ERROR',
      detail: error.detail ?? error.message,
      role6AssignmentValidated: false,
      assignmentAuthorityActive: false,
      generalRoleAuthority: false,
      substantiveAuditOutputsCreated: false,
      productMutationPerformed: false,
      mergePerformed: false
    });
    if (options.output) writeJson(options.output, failure);
    else process.stderr.write(`${JSON.stringify(failure, null, 2)}\n`);
    process.exitCode = 1;
  }
}

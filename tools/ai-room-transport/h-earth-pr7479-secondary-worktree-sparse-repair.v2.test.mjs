import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { sanitizeNativeChildError } from './h-earth-pr7479-secondary-worktree-sparse-repair.v2.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const acceptedPath = path.join(here, 'h-earth-pr7479-native-child-failure-diagnostic.v1.mjs');
const correctedPath = path.join(here, 'h-earth-pr7479-secondary-worktree-sparse-repair.v2.mjs');
const accepted = fs.readFileSync(acceptedPath, 'utf8');
const corrected = fs.readFileSync(correctedPath, 'utf8');
const frozenHead = '299d68d211576cef59cab228d4fe13b1f823ad43';

function git(root, ...args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, 'git ' + args.join(' ') + ': ' + result.stderr);
  return result.stdout.trim();
}

test('v2 differs from immutable Gen3393 source by exactly one bounded checkout repair', () => {
  const injected = [
    '    // Gen3406: the detached subject must not inherit the transport\'s sparse index.',
    '    // Expand only this disposable subject worktree before running the native preflight.',
    "    git(subjectRoot, ['sparse-checkout', 'disable']);",
    '    if (!fs.existsSync(path.join(subjectRoot, NATIVE_TOOL_PATH)) ||',
    '        !fs.existsSync(path.join(subjectRoot, ACTIVATION_PATH))) {',
    "      fail('SUBJECT_NATIVE_MODULES_NOT_MATERIALIZED');",
    '    }',
    ''
  ].join('\n');
  assert.equal(corrected.split(injected).length, 2);
  assert.equal(corrected.replace(injected, ''), accepted);
  const verifyHead = corrected.indexOf("if (exact !== subjectHead) fail('SUBJECT_WORKTREE_HEAD_MISMATCH'");
  const expand = corrected.indexOf("git(subjectRoot, ['sparse-checkout', 'disable'])");
  const native = corrected.indexOf("nativeExecution = run('node', nativeArgs");
  assert.ok(verifyHead >= 0 && verifyHead < expand && expand < native);
});

test('real sparse-checkout inheritance is repaired in the secondary worktree only', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'h-earth-gen3406-worktree-'));
  const primary = path.join(temp, 'primary');
  const secondary = path.join(temp, 'secondary');
  const primaryRegistry = path.join(primary, 'h-earth-3d', 'registry', 'y.js');
  const secondaryRegistry = path.join(secondary, 'h-earth-3d', 'registry', 'y.js');
  try {
    fs.mkdirSync(primary, { recursive: true });
    git(primary, 'init', '-q');
    git(primary, 'config', 'user.email', 'fixture@example.invalid');
    git(primary, 'config', 'user.name', 'Fixture');
    fs.mkdirSync(path.join(primary, 'tools', 'ai-room-transport'), { recursive: true });
    fs.mkdirSync(path.dirname(primaryRegistry), { recursive: true });
    fs.writeFileSync(path.join(primary, 'tools', 'ai-room-transport', 'x.js'), 'export default 1;\n');
    fs.writeFileSync(primaryRegistry, 'export default 2;\n');
    git(primary, 'add', '.');
    git(primary, 'commit', '-qm', 'Gen3406 fixed sparse inheritance fixture');
    git(primary, 'sparse-checkout', 'init', '--cone');
    git(primary, 'sparse-checkout', 'set', 'tools/ai-room-transport', '.github/ai-toolset-transport', '.github/live-qualification');
    assert.equal(fs.existsSync(primaryRegistry), false);
    git(primary, 'worktree', 'add', '--detach', secondary, 'HEAD');
    assert.equal(fs.existsSync(secondaryRegistry), false);
    assert.equal(git(primary, 'config', '--bool', 'core.sparseCheckout'), 'true');
    assert.equal(git(secondary, 'config', '--bool', 'core.sparseCheckout'), 'true');

    git(secondary, 'sparse-checkout', 'disable');

    assert.equal(fs.existsSync(secondaryRegistry), true);
    assert.equal(fs.existsSync(primaryRegistry), false);
    assert.equal(git(primary, 'config', '--bool', 'core.sparseCheckout'), 'true');
    assert.equal(git(secondary, 'config', '--bool', 'core.sparseCheckout'), 'false');
    assert.equal(git(primary, 'status', '--porcelain=v1', '--untracked-files=all'), '');
    assert.equal(git(secondary, 'status', '--porcelain=v1', '--untracked-files=all'), '');
    assert.equal(git(primary, 'rev-parse', 'HEAD'), git(secondary, 'rev-parse', 'HEAD'));
  } finally {
    if (fs.existsSync(primary) && fs.existsSync(secondary)) {
      spawnSync('git', ['worktree', 'remove', '--force', secondary], { cwd: primary, encoding: 'utf8' });
    }
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('frozen subject, native tool identity and read-only boundaries are unchanged', () => {
  for (const anchor of [
    "const FROZEN_SUBJECT_HEAD = '" + frozenHead + "'",
    "const NATIVE_TOOL_BLOB = 'f31ee516dff631da3d7f734a5751748ed051412f'",
    "const ACTIVATION_BLOB = '785730730fc10cd6351999207c61ef483094c06f'",
    "'--experimental-default-type=module'",
    "nativeExecution = run('node', nativeArgs, { cwd: subjectRoot, env: process.env })",
    "fail('NATIVE_PREFLIGHT_RECEIPT_MISSING', {",
    'productMutationPerformed: false',
    'constructionAuthorityGranted: false',
    'mergePerformed: false',
    'deploymentPerformed: false',
    'releasePerformed: false'
  ]) assert.ok(corrected.includes(anchor), 'missing immutable contract anchor: ' + anchor);
});

test('missing receipt remains fail closed and raw child output remains hidden', () => {
  for (const anchor of [
    'childExitStatus: nativeExecution.status',
    "childProcessError: nativeExecution.error ? sanitizeNativeChildError('Error: '+nativeExecution.error,160) : null",
    'childStderrPresent: Boolean(nativeExecution.stderr)',
    'childStderrExcerpt: sanitizeNativeChildError(nativeExecution.stderr,512)'
  ]) assert.ok(corrected.includes(anchor));
  assert.equal(corrected.includes('childStdout:'), false);
  assert.equal(corrected.includes('childStderrRaw:'), false);
  const sample = 'Error [ERR_MODULE_NOT_FOUND]: Cannot load /home/runner/private/file.js from owner@example.com';
  const sanitized = sanitizeNativeChildError(sample, 512);
  assert.ok(sanitized.includes('ERR_MODULE_NOT_FOUND'));
  assert.ok(sanitized.includes('[PATH]'));
  assert.ok(sanitized.includes('[ADDRESS]'));
  assert.ok(!sanitized.includes('/home/runner'));
  assert.ok(!sanitized.includes('owner@example.com'));
});

test('invalid PR7479 subject is rejected before checkout or native execution', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'h-earth-gen3406-neg-'));
  try {
    const output = path.join(temp, 'failure.json');
    const result = spawnSync(process.execPath, [
      correctedPath,
      '--subject-head', '0'.repeat(40),
      '--paths-base64', Buffer.from(JSON.stringify(['h-earth-3d/validation/h-earth.east-a-environmental-identity.v1.test.mjs'])).toString('base64'),
      '--execution-holder', 'H_EARTH_GEN3406_NEGATIVE',
      '--output', output
    ], { cwd: temp, encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    const receipt = JSON.parse(fs.readFileSync(output, 'utf8'));
    assert.equal(receipt.result, 'FAIL_CLOSED');
    assert.equal(receipt.errorCode, 'PR7479_SUBJECT_HEAD_MISMATCH');
    assert.equal(receipt.productMutationPerformed, false);
    assert.equal(receipt.mergePerformed, false);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

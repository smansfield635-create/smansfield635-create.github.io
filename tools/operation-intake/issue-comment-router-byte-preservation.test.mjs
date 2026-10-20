import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

// Execute the actual workflow shell, replacing only its outbound gh call.
const workflow = fs.readFileSync(new URL('../../.github/workflows/issue-comment-router-v1.yml', import.meta.url), 'utf8');
const script = workflow.split('        run: |\n')[1].split('\n').map(line => line.replace(/^          /, '')).join('\n');
function dispatch(body, association = 'OWNER') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'router-bytes-'));
  try {
    fs.writeFileSync(path.join(dir, 'gh'), '#!/bin/sh\nexit 0\n', {mode: 0o755});
    execFileSync('bash', ['-c', script], {env: {...process.env, PATH: dir + ':' + process.env.PATH, RUNNER_TEMP: dir, BODY: body, ASSOCIATION: association, ISSUE_NUMBER: '6254', REPO: 'owner/repo'}, stdio: 'pipe'});
    const file = path.join(dir, 'dispatch.json');
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : null;
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
}
for (const ending of ['', '\n', '\n\n', '\r\n']) {
  test('preserves exact canonical payload ending ' + JSON.stringify(ending), () => {
    const body = 'CANONICAL_OPERATION_INTAKE_REQUEST_V1\n' + JSON.stringify({text: 'palm 🌴 — "quoted" \\ slash', escaped: '\n'}) + ending;
    const result = dispatch(body);
    assert.deepEqual(Buffer.from(result.inputs.request_json), Buffer.from(body));
    assert.equal(result.inputs.router_callback_issue, '6254');
    assert.equal(result.inputs.router_callback_repository, 'owner/repo');
    assert.equal(result.ref, 'main');
  });
}
test('untrusted source is not dispatched', () => {
  assert.equal(dispatch('CANONICAL_OPERATION_INTAKE_REQUEST_V1\n{}\n', 'NONE'), null);
});
test('unregistered marker is not dispatched', () => {
  assert.equal(dispatch('UNREGISTERED_REQUEST\n{}\n'), null);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { buildManifestFromFile, sha256 } from './bounded-binary-file-ingress.v1.mjs';

const fixture = Buffer.from([0,255,1,2,3,128,64,10,98,111,117,110,100,101,100,45,98,105,110,97,114,121,45,102,105,108,101,45,105,110,103,114,101,115,115,0,118,49]);

test('sha256 is deterministic for binary bytes', () => {
  assert.equal(sha256(fixture), crypto.createHash('sha256').update(fixture).digest('hex'));
});

test('fails closed without token before network mutation', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'bbfi-'));
  const source = path.join(dir, 'fixture.bin');
  await fs.writeFile(source, fixture);
  await assert.rejects(
    buildManifestFromFile({
      sourcePath: source,
      repository: 'owner/repo',
      targetBranch: 'transfer/test',
      expectedTargetHead: 'a'.repeat(40),
      destinationPath: 'verification/fixture.bin',
      token: ''
    }),
    (error) => error.code === 'GITHUB_TOKEN_MISSING'
  );
});

test('rejects protected/non-transfer target branch', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'bbfi-'));
  const source = path.join(dir, 'fixture.bin');
  await fs.writeFile(source, fixture);
  await assert.rejects(
    buildManifestFromFile({
      sourcePath: source,
      repository: 'owner/repo',
      targetBranch: 'main',
      expectedTargetHead: 'a'.repeat(40),
      destinationPath: 'verification/fixture.bin',
      token: 'x'
    }),
    (error) => error.code === 'TARGET_BRANCH_INVALID'
  );
});

test('rejects unsafe destination path', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'bbfi-'));
  const source = path.join(dir, 'fixture.bin');
  await fs.writeFile(source, fixture);
  await assert.rejects(
    buildManifestFromFile({
      sourcePath: source,
      repository: 'owner/repo',
      targetBranch: 'transfer/test',
      expectedTargetHead: 'a'.repeat(40),
      destinationPath: '../escape.bin',
      token: 'x'
    }),
    (error) => error.code === 'DESTINATION_PATH_INVALID'
  );
});

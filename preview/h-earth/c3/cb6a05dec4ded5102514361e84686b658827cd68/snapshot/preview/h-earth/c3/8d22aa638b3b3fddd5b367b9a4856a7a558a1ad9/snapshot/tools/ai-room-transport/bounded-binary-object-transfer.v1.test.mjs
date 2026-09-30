import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AUTHORIZED_ACTOR,
  INVOCATION_ISSUE,
  REQUEST_MARKER,
  SCHEMA_MANIFEST,
  gitBlobSha,
  parseRequestComment,
  reconstructFromChunks,
  requestFromIssueEvent,
  sha256,
  validateManifest
} from './bounded-binary-object-transfer.v1.mjs';

const repository = 'smansfield635-create/smansfield635-create.github.io';
const chunks = [
  Buffer.from([0, 1, 2, 3, 255, 254, 128]),
  Buffer.from('binary-transfer-fixture\0with-nul\n', 'utf8'),
  Buffer.from([9, 8, 7, 6, 5, 4, 3, 2, 1])
];
const full = Buffer.concat(chunks);

function fixtureManifest() {
  return {
    schema: SCHEMA_MANIFEST,
    repository,
    targetBranch: 'transfer/binary-fixture-v1',
    expectedTargetHead: 'a'.repeat(40),
    destinationPath: 'verification/binary-transfer/fixture.bin',
    totalBytes: full.length,
    sha256: sha256(full),
    chunks: chunks.map((bytes, index) => ({ index, blobSha: gitBlobSha(bytes), bytes: bytes.length, sha256: sha256(bytes) }))
  };
}

async function loader(chunk) {
  return chunks[chunk.index];
}

function expectCode(fn, code) {
  return assert.rejects(Promise.resolve().then(fn), (error) => error?.code === code);
}

test('valid manifest reconstructs byte-exact payload', async () => {
  const manifest = fixtureManifest();
  validateManifest(manifest, repository);
  const result = await reconstructFromChunks(manifest, loader);
  assert.deepEqual(result, full);
  assert.equal(sha256(result), manifest.sha256);
  assert.equal(gitBlobSha(Buffer.from('abc')), 'f2ba8f84ab5c1bce84a7b441cb1959cfc7093b7f');
});

test('wrong chunk SHA-256 fails closed', async () => {
  const manifest = fixtureManifest();
  manifest.chunks[1].sha256 = '0'.repeat(64);
  await expectCode(() => reconstructFromChunks(manifest, loader), 'CHUNK_SHA256_MISMATCH');
});

test('wrong chunk byte length fails closed', async () => {
  const manifest = fixtureManifest();
  manifest.chunks[1].bytes += 1;
  manifest.totalBytes += 1;
  await expectCode(() => reconstructFromChunks(manifest, loader), 'CHUNK_BYTE_LENGTH_MISMATCH');
});

test('wrong chunk Git blob identity fails closed', async () => {
  const manifest = fixtureManifest();
  manifest.chunks[0].blobSha = '1'.repeat(40);
  await expectCode(() => reconstructFromChunks(manifest, loader), 'CHUNK_GIT_BLOB_MISMATCH');
});

test('non-contiguous chunk ordering fails closed', () => {
  const manifest = fixtureManifest();
  manifest.chunks[1].index = 2;
  assert.throws(() => validateManifest(manifest), (error) => error?.code === 'CHUNK_ORDER_INVALID');
});

test('wrong final SHA-256 fails closed', async () => {
  const manifest = fixtureManifest();
  manifest.sha256 = 'f'.repeat(64);
  await expectCode(() => reconstructFromChunks(manifest, loader), 'FINAL_SHA256_MISMATCH');
});

test('wrong declared total fails before reconstruction', () => {
  const manifest = fixtureManifest();
  manifest.totalBytes += 1;
  assert.throws(() => validateManifest(manifest), (error) => error?.code === 'DECLARED_BYTE_TOTAL_MISMATCH');
});

test('direct deployment branches are rejected', () => {
  for (const branch of ['main', 'master', 'gh-pages']) {
    const manifest = fixtureManifest();
    manifest.targetBranch = branch;
    assert.throws(() => validateManifest(manifest), (error) => ['TARGET_BRANCH_INVALID', 'PROTECTED_BRANCH_PROHIBITED'].includes(error?.code));
  }
});

test('non-transfer branches are rejected', () => {
  const manifest = fixtureManifest();
  manifest.targetBranch = 'feature/not-authorized';
  assert.throws(() => validateManifest(manifest), (error) => error?.code === 'TARGET_BRANCH_INVALID');
});

test('unsafe destination traversal and .git paths are rejected', () => {
  for (const path of ['../asset.bin', 'a/../asset.bin', '/asset.bin', '.git/config', 'a//b.bin']) {
    const manifest = fixtureManifest();
    manifest.destinationPath = path;
    assert.throws(() => validateManifest(manifest), (error) => error?.code === 'DESTINATION_PATH_INVALID');
  }
});

test('repository binding rejects cross-repository request', () => {
  const manifest = fixtureManifest();
  assert.throws(() => validateManifest(manifest, 'other/repository'), (error) => error?.code === 'REPOSITORY_MISMATCH');
});

test('request comment parser requires exact marker', () => {
  const manifest = fixtureManifest();
  const parsed = parseRequestComment(`${REQUEST_MARKER}\n${JSON.stringify(manifest)}`);
  assert.equal(parsed.sha256, manifest.sha256);
  assert.throws(() => parseRequestComment(`OTHER_MARKER\n${JSON.stringify(manifest)}`), (error) => error?.code === 'REQUEST_MARKER_MISSING');
});

test('issue event requires dedicated issue and owner actor', async () => {
  const manifest = fixtureManifest();
  const event = {
    issue: { number: INVOCATION_ISSUE },
    comment: { user: { login: AUTHORIZED_ACTOR }, body: `${REQUEST_MARKER}\n${JSON.stringify(manifest)}` },
    repository: { full_name: repository }
  };
  const accepted = await requestFromIssueEvent(event, repository);
  assert.equal(accepted.destinationPath, manifest.destinationPath);

  await expectCode(() => requestFromIssueEvent({ ...event, issue: { number: INVOCATION_ISSUE + 1 } }, repository), 'INVOCATION_ISSUE_MISMATCH');
  await expectCode(() => requestFromIssueEvent({ ...event, comment: { ...event.comment, user: { login: 'someone-else' } } }, repository), 'ACTOR_UNAUTHORIZED');
});

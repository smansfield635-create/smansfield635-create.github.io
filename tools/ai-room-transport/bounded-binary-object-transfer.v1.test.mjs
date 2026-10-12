import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AUTHORIZED_ACTOR,
  INVOCATION_ISSUE,
  PACKET_INGRESS_REQUEST_MARKER,
  PACKET_MARKER,
  REQUEST_MARKER,
  SCHEMA_MANIFEST,
  SCHEMA_PACKET,
  SCHEMA_PACKET_MANIFEST,
  gitBlobSha,
  packetIngressRequestFromIssueEvent,
  parsePacketComment,
  parseRequestComment,
  reconstructFromChunks,
  reconstructFromPackets,
  requestFromIssueEvent,
  sha256,
  validateManifest,
  validatePacketManifest
} from './bounded-binary-object-transfer.v1.mjs';

const repository = 'smansfield635-create/smansfield635-create.github.io';
const chunks = [
  Buffer.from([0, 1, 2, 3, 255, 254, 128]),
  Buffer.from('binary-transfer-fixture\0with-nul\n', 'utf8'),
  Buffer.from([9, 8, 7, 6, 5, 4, 3, 2, 1])
];
const full = Buffer.concat(chunks);
const transferId = 'packet-fixture-v1';

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

function fixturePackets() {
  return chunks.map((bytes, index) => ({
    schema: SCHEMA_PACKET,
    transferId,
    index,
    bytes: bytes.length,
    sha256: sha256(bytes),
    dataBase64: bytes.toString('base64')
  }));
}

function fixturePacketManifest() {
  return {
    schema: SCHEMA_PACKET_MANIFEST,
    repository,
    transferId,
    targetBranch: 'transfer/binary-packet-fixture-v1',
    expectedTargetHead: 'b'.repeat(40),
    destinationPath: 'verification/binary-transfer/packet-fixture.bin',
    totalBytes: full.length,
    sha256: sha256(full),
    packets: chunks.map((bytes, index) => ({ index, commentId: 1000 + index, bytes: bytes.length, sha256: sha256(bytes) }))
  };
}

async function loader(chunk) {
  return chunks[chunk.index];
}

async function packetLoader(reference) {
  return fixturePackets()[reference.index];
}

function expectCode(fn, code) {
  return assert.rejects(Promise.resolve().then(fn), (error) => error?.code === code);
}

test('valid legacy manifest reconstructs byte-exact payload', async () => {
  const manifest = fixtureManifest();
  validateManifest(manifest, repository);
  const result = await reconstructFromChunks(manifest, loader);
  assert.deepEqual(result, full);
  assert.equal(sha256(result), manifest.sha256);
  assert.equal(gitBlobSha(Buffer.from('abc')), 'f2ba8f84ab5c1bce84a7b441cb1959cfc7093b7f');
});

test('wrong legacy chunk SHA-256 fails closed', async () => {
  const manifest = fixtureManifest();
  manifest.chunks[1].sha256 = '0'.repeat(64);
  await expectCode(() => reconstructFromChunks(manifest, loader), 'CHUNK_SHA256_MISMATCH');
});

test('wrong legacy chunk byte length fails closed', async () => {
  const manifest = fixtureManifest();
  manifest.chunks[1].bytes += 1;
  manifest.totalBytes += 1;
  await expectCode(() => reconstructFromChunks(manifest, loader), 'CHUNK_BYTE_LENGTH_MISMATCH');
});

test('wrong legacy chunk Git blob identity fails closed', async () => {
  const manifest = fixtureManifest();
  manifest.chunks[0].blobSha = '1'.repeat(40);
  await expectCode(() => reconstructFromChunks(manifest, loader), 'CHUNK_GIT_BLOB_MISMATCH');
});

test('non-contiguous legacy chunk ordering fails closed', () => {
  const manifest = fixtureManifest();
  manifest.chunks[1].index = 2;
  assert.throws(() => validateManifest(manifest), (error) => error?.code === 'CHUNK_ORDER_INVALID');
});

test('wrong legacy final SHA-256 fails closed', async () => {
  const manifest = fixtureManifest();
  manifest.sha256 = 'f'.repeat(64);
  await expectCode(() => reconstructFromChunks(manifest, loader), 'FINAL_SHA256_MISMATCH');
});

test('wrong legacy declared total fails before reconstruction', () => {
  const manifest = fixtureManifest();
  manifest.totalBytes += 1;
  assert.throws(() => validateManifest(manifest), (error) => error?.code === 'DECLARED_BYTE_TOTAL_MISMATCH');
});

test('direct deployment branches are rejected in both modes', () => {
  for (const branch of ['main', 'master', 'gh-pages']) {
    const legacy = fixtureManifest();
    legacy.targetBranch = branch;
    assert.throws(() => validateManifest(legacy), (error) => ['TARGET_BRANCH_INVALID', 'PROTECTED_BRANCH_PROHIBITED'].includes(error?.code));
    const packet = fixturePacketManifest();
    packet.targetBranch = branch;
    assert.throws(() => validatePacketManifest(packet), (error) => ['TARGET_BRANCH_INVALID', 'PROTECTED_BRANCH_PROHIBITED'].includes(error?.code));
  }
});

test('non-transfer branches are rejected in both modes', () => {
  const legacy = fixtureManifest();
  legacy.targetBranch = 'feature/not-authorized';
  assert.throws(() => validateManifest(legacy), (error) => error?.code === 'TARGET_BRANCH_INVALID');
  const packet = fixturePacketManifest();
  packet.targetBranch = 'feature/not-authorized';
  assert.throws(() => validatePacketManifest(packet), (error) => error?.code === 'TARGET_BRANCH_INVALID');
});

test('unsafe destination traversal and .git paths are rejected in both modes', () => {
  for (const destinationPath of ['../asset.bin', 'a/../asset.bin', '/asset.bin', '.git/config', 'a//b.bin']) {
    const legacy = fixtureManifest();
    legacy.destinationPath = destinationPath;
    assert.throws(() => validateManifest(legacy), (error) => error?.code === 'DESTINATION_PATH_INVALID');
    const packet = fixturePacketManifest();
    packet.destinationPath = destinationPath;
    assert.throws(() => validatePacketManifest(packet), (error) => error?.code === 'DESTINATION_PATH_INVALID');
  }
});

test('repository binding rejects cross-repository request in both modes', () => {
  assert.throws(() => validateManifest(fixtureManifest(), 'other/repository'), (error) => error?.code === 'REPOSITORY_MISMATCH');
  assert.throws(() => validatePacketManifest(fixturePacketManifest(), 'other/repository'), (error) => error?.code === 'REPOSITORY_MISMATCH');
});

test('legacy request comment parser requires exact marker', () => {
  const manifest = fixtureManifest();
  const parsed = parseRequestComment(`${REQUEST_MARKER}\n${JSON.stringify(manifest)}`);
  assert.equal(parsed.sha256, manifest.sha256);
  assert.throws(() => parseRequestComment(`OTHER_MARKER\n${JSON.stringify(manifest)}`), (error) => error?.code === 'REQUEST_MARKER_MISSING');
});

test('legacy issue event requires dedicated issue and owner actor', async () => {
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

test('valid owner packet manifest reconstructs byte-exact payload', async () => {
  const manifest = fixturePacketManifest();
  validatePacketManifest(manifest, repository);
  const result = await reconstructFromPackets(manifest, packetLoader);
  assert.deepEqual(result, full);
  assert.equal(sha256(result), manifest.sha256);
  assert.equal(gitBlobSha(result), gitBlobSha(full));
});

test('packet parser requires exact inert packet marker', () => {
  const packet = fixturePackets()[0];
  const parsed = parsePacketComment(`${PACKET_MARKER}\n${JSON.stringify(packet)}`);
  assert.equal(parsed.index, 0);
  assert.throws(() => parsePacketComment(`OTHER_MARKER\n${JSON.stringify(packet)}`), (error) => error?.code === 'PACKET_MARKER_MISSING');
});

test('duplicate packet comment IDs fail closed', () => {
  const manifest = fixturePacketManifest();
  manifest.packets[1].commentId = manifest.packets[0].commentId;
  assert.throws(() => validatePacketManifest(manifest), (error) => error?.code === 'PACKET_COMMENT_DUPLICATE');
});

test('missing or out-of-order packet declarations fail closed', async () => {
  const missing = fixturePacketManifest();
  await expectCode(() => reconstructFromPackets(missing, async (reference) => reference.index === 1 ? null : packetLoader(reference)), 'PACKET_MISSING');

  const outOfOrder = fixturePacketManifest();
  outOfOrder.packets[1].index = 2;
  assert.throws(() => validatePacketManifest(outOfOrder), (error) => error?.code === 'PACKET_ORDER_INVALID');
});

test('packet payload corruption fails SHA binding', async () => {
  const manifest = fixturePacketManifest();
  const packets = fixturePackets();
  const corrupt = Buffer.from(chunks[1]);
  corrupt[0] ^= 0xff;
  packets[1] = { ...packets[1], dataBase64: corrupt.toString('base64') };
  await expectCode(() => reconstructFromPackets(manifest, async (reference) => packets[reference.index]), 'PACKET_SHA256_MISMATCH');
});

test('packet declaration mismatch and non-canonical base64 fail closed', async () => {
  const manifest = fixturePacketManifest();
  const packets = fixturePackets();
  packets[1] = { ...packets[1], bytes: packets[1].bytes + 1 };
  await expectCode(() => reconstructFromPackets(manifest, async (reference) => packets[reference.index]), 'PACKET_DECLARED_BYTES_MISMATCH');

  const malformedPackets = fixturePackets();
  malformedPackets[0] = { ...malformedPackets[0], dataBase64: `${malformedPackets[0].dataBase64}\n` };
  await expectCode(() => reconstructFromPackets(manifest, async (reference) => malformedPackets[reference.index]), 'PACKET_BASE64_INVALID');
});

test('wrong packet final SHA-256 fails closed', async () => {
  const manifest = fixturePacketManifest();
  manifest.sha256 = 'f'.repeat(64);
  await expectCode(() => reconstructFromPackets(manifest, packetLoader), 'FINAL_SHA256_MISMATCH');
});

test('packet ingress final request requires dedicated issue and owner actor', async () => {
  const manifest = fixturePacketManifest();
  const event = {
    issue: { number: INVOCATION_ISSUE },
    comment: { user: { login: AUTHORIZED_ACTOR }, body: `${PACKET_INGRESS_REQUEST_MARKER}\n${JSON.stringify(manifest)}` },
    repository: { full_name: repository }
  };
  const accepted = await packetIngressRequestFromIssueEvent(event, repository);
  assert.equal(accepted.transferId, transferId);
  await expectCode(() => packetIngressRequestFromIssueEvent({ ...event, issue: { number: INVOCATION_ISSUE + 1 } }, repository), 'INVOCATION_ISSUE_MISMATCH');
  await expectCode(() => packetIngressRequestFromIssueEvent({ ...event, comment: { ...event.comment, user: { login: 'someone-else' } } }, repository), 'ACTOR_UNAUTHORIZED');
});

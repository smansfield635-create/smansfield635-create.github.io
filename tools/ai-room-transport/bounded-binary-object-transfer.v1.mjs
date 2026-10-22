#!/usr/bin/env node
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

export const SCHEMA_MANIFEST = 'BOUNDED_BINARY_OBJECT_TRANSFER_MANIFEST_v1';
export const SCHEMA_PACKET = 'BOUNDED_BINARY_PACKET_v1';
export const SCHEMA_PACKET_MANIFEST = 'BOUNDED_BINARY_PACKET_INGRESS_MANIFEST_v1';
export const SCHEMA_RECEIPT = 'BOUNDED_BINARY_OBJECT_TRANSFER_RECEIPT_v1';
export const REQUEST_MARKER = 'BOUNDED_BINARY_OBJECT_TRANSFER_REQUEST_V1';
export const PACKET_MARKER = 'BOUNDED_BINARY_PACKET_V1';
export const PACKET_INGRESS_REQUEST_MARKER = 'BOUNDED_BINARY_PACKET_INGRESS_REQUEST_V1';
export const INVOCATION_ISSUE = 1323;
export const AUTHORIZED_ACTOR = 'smansfield635-create';
export const MAX_PACKET_BYTES = 32768;
export const MAX_PACKET_COUNT = 4096;

function fail(code, message, details = {}) {
  const error = new Error(message);
  error.code = code;
  error.details = details;
  throw error;
}

export function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

export function gitBlobSha(bytes) {
  const header = Buffer.from(`blob ${bytes.length}\0`, 'utf8');
  return crypto.createHash('sha1').update(header).update(bytes).digest('hex');
}

function isHex(value, length) {
  return typeof value === 'string' && new RegExp(`^[0-9a-f]{${length}}$`, 'i').test(value);
}

function assertSafeDestination(path) {
  if (typeof path !== 'string' || path.length === 0 || path.length > 1024) fail('DESTINATION_PATH_INVALID', 'destinationPath is required');
  if (path.startsWith('/') || path.includes('\\') || path.split('/').some((part) => part === '..' || part === '.' || part === '')) {
    fail('DESTINATION_PATH_INVALID', 'destinationPath must be a normalized repository-relative path');
  }
  if (path === '.git' || path.startsWith('.git/')) fail('DESTINATION_PATH_INVALID', '.git paths are prohibited');
}

function assertTransferTarget(manifest, expectedRepository = null) {
  if (typeof manifest.repository !== 'string' || !manifest.repository.includes('/')) fail('REPOSITORY_INVALID', 'repository must be owner/name');
  if (expectedRepository && manifest.repository !== expectedRepository) fail('REPOSITORY_MISMATCH', 'manifest repository does not match workflow repository');
  if (typeof manifest.targetBranch !== 'string' || !manifest.targetBranch.startsWith('transfer/')) fail('TARGET_BRANCH_INVALID', 'targetBranch must start with transfer/');
  if (['main', 'master', 'gh-pages'].includes(manifest.targetBranch)) fail('PROTECTED_BRANCH_PROHIBITED', 'protected deployment branches are prohibited');
  if (!isHex(manifest.expectedTargetHead, 40)) fail('TARGET_HEAD_INVALID', 'expectedTargetHead must be a 40-hex commit SHA');
  assertSafeDestination(manifest.destinationPath);
  if (!Number.isSafeInteger(manifest.totalBytes) || manifest.totalBytes < 0) fail('TOTAL_BYTES_INVALID', 'totalBytes must be a non-negative safe integer');
  if (!isHex(manifest.sha256, 64)) fail('FINAL_SHA256_INVALID', 'sha256 must be 64 hex characters');
}

export function validateManifest(manifest, expectedRepository = null) {
  if (!manifest || manifest.schema !== SCHEMA_MANIFEST) fail('MANIFEST_SCHEMA_INVALID', `schema must be ${SCHEMA_MANIFEST}`);
  assertTransferTarget(manifest, expectedRepository);
  if (!Array.isArray(manifest.chunks) || manifest.chunks.length < 1 || manifest.chunks.length > 4096) fail('CHUNKS_INVALID', 'chunks must contain 1..4096 entries');
  let expectedIndex = 0;
  for (const chunk of manifest.chunks) {
    if (!chunk || chunk.index !== expectedIndex) fail('CHUNK_ORDER_INVALID', `expected chunk index ${expectedIndex}`);
    if (!isHex(chunk.blobSha, 40)) fail('CHUNK_BLOB_SHA_INVALID', `chunk ${expectedIndex} blobSha invalid`);
    if (!Number.isSafeInteger(chunk.bytes) || chunk.bytes < 0) fail('CHUNK_BYTES_INVALID', `chunk ${expectedIndex} bytes invalid`);
    if (!isHex(chunk.sha256, 64)) fail('CHUNK_SHA256_INVALID', `chunk ${expectedIndex} sha256 invalid`);
    expectedIndex += 1;
  }
  const declaredBytes = manifest.chunks.reduce((sum, chunk) => sum + chunk.bytes, 0);
  if (declaredBytes !== manifest.totalBytes) fail('DECLARED_BYTE_TOTAL_MISMATCH', 'chunk byte declarations do not equal totalBytes', { declaredBytes, totalBytes: manifest.totalBytes });
  return manifest;
}

function validTransferId(value) {
  return typeof value === 'string' && /^[A-Za-z0-9._:-]{1,128}$/.test(value);
}

export function validatePacketManifest(manifest, expectedRepository = null) {
  if (!manifest || manifest.schema !== SCHEMA_PACKET_MANIFEST) fail('PACKET_MANIFEST_SCHEMA_INVALID', `schema must be ${SCHEMA_PACKET_MANIFEST}`);
  assertTransferTarget(manifest, expectedRepository);
  if (!validTransferId(manifest.transferId)) fail('TRANSFER_ID_INVALID', 'transferId must be 1..128 safe identifier characters');
  if (!Array.isArray(manifest.packets) || manifest.packets.length < 1 || manifest.packets.length > MAX_PACKET_COUNT) {
    fail('PACKETS_INVALID', `packets must contain 1..${MAX_PACKET_COUNT} entries`);
  }
  const commentIds = new Set();
  let expectedIndex = 0;
  for (const packet of manifest.packets) {
    if (!packet || packet.index !== expectedIndex) fail('PACKET_ORDER_INVALID', `expected packet index ${expectedIndex}`);
    if (!Number.isSafeInteger(packet.commentId) || packet.commentId <= 0) fail('PACKET_COMMENT_ID_INVALID', `packet ${expectedIndex} commentId invalid`);
    if (commentIds.has(packet.commentId)) fail('PACKET_COMMENT_DUPLICATE', `packet comment ${packet.commentId} is duplicated`);
    commentIds.add(packet.commentId);
    if (!Number.isSafeInteger(packet.bytes) || packet.bytes < 1 || packet.bytes > MAX_PACKET_BYTES) {
      fail('PACKET_BYTES_INVALID', `packet ${expectedIndex} bytes must be 1..${MAX_PACKET_BYTES}`);
    }
    if (!isHex(packet.sha256, 64)) fail('PACKET_SHA256_INVALID', `packet ${expectedIndex} sha256 invalid`);
    expectedIndex += 1;
  }
  const declaredBytes = manifest.packets.reduce((sum, packet) => sum + packet.bytes, 0);
  if (declaredBytes !== manifest.totalBytes) fail('DECLARED_BYTE_TOTAL_MISMATCH', 'packet byte declarations do not equal totalBytes', { declaredBytes, totalBytes: manifest.totalBytes });
  return manifest;
}

export function validatePacket(packet) {
  if (!packet || packet.schema !== SCHEMA_PACKET) fail('PACKET_SCHEMA_INVALID', `schema must be ${SCHEMA_PACKET}`);
  if (!validTransferId(packet.transferId)) fail('TRANSFER_ID_INVALID', 'packet transferId invalid');
  if (!Number.isSafeInteger(packet.index) || packet.index < 0) fail('PACKET_INDEX_INVALID', 'packet index invalid');
  if (!Number.isSafeInteger(packet.bytes) || packet.bytes < 1 || packet.bytes > MAX_PACKET_BYTES) fail('PACKET_BYTES_INVALID', `packet bytes must be 1..${MAX_PACKET_BYTES}`);
  if (!isHex(packet.sha256, 64)) fail('PACKET_SHA256_INVALID', 'packet sha256 invalid');
  if (typeof packet.dataBase64 !== 'string' || packet.dataBase64.length === 0) fail('PACKET_BASE64_INVALID', 'packet dataBase64 missing');
  return packet;
}

function decodeCanonicalBase64(value) {
  if (typeof value !== 'string' || value.length === 0 || value.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(value)) {
    fail('PACKET_BASE64_INVALID', 'packet dataBase64 is not canonical base64');
  }
  const bytes = Buffer.from(value, 'base64');
  if (bytes.toString('base64') !== value) fail('PACKET_BASE64_INVALID', 'packet dataBase64 is not canonical base64');
  return bytes;
}

export async function reconstructFromChunks(manifest, loadChunk) {
  validateManifest(manifest);
  const parts = [];
  for (const chunk of manifest.chunks) {
    const bytes = Buffer.from(await loadChunk(chunk));
    if (bytes.length !== chunk.bytes) fail('CHUNK_BYTE_LENGTH_MISMATCH', `chunk ${chunk.index} byte length mismatch`, { expected: chunk.bytes, actual: bytes.length });
    const actualSha256 = sha256(bytes);
    if (actualSha256 !== chunk.sha256.toLowerCase()) fail('CHUNK_SHA256_MISMATCH', `chunk ${chunk.index} SHA-256 mismatch`, { expected: chunk.sha256, actual: actualSha256 });
    const actualBlobSha = gitBlobSha(bytes);
    if (actualBlobSha !== chunk.blobSha.toLowerCase()) fail('CHUNK_GIT_BLOB_MISMATCH', `chunk ${chunk.index} Git blob identity mismatch`, { expected: chunk.blobSha, actual: actualBlobSha });
    parts.push(bytes);
  }
  const assembled = Buffer.concat(parts);
  if (assembled.length !== manifest.totalBytes) fail('FINAL_BYTE_LENGTH_MISMATCH', 'assembled byte length mismatch', { expected: manifest.totalBytes, actual: assembled.length });
  const actualSha256 = sha256(assembled);
  if (actualSha256 !== manifest.sha256.toLowerCase()) fail('FINAL_SHA256_MISMATCH', 'assembled SHA-256 mismatch', { expected: manifest.sha256, actual: actualSha256 });
  return assembled;
}

export async function reconstructFromPackets(manifest, loadPacket) {
  validatePacketManifest(manifest);
  const parts = [];
  for (const reference of manifest.packets) {
    const packet = await loadPacket(reference);
    if (!packet) fail('PACKET_MISSING', `packet ${reference.index} could not be loaded`);
    validatePacket(packet);
    if (packet.transferId !== manifest.transferId) fail('PACKET_TRANSFER_ID_MISMATCH', `packet ${reference.index} transferId mismatch`);
    if (packet.index !== reference.index) fail('PACKET_INDEX_MISMATCH', `packet ${reference.index} index mismatch`, { expected: reference.index, actual: packet.index });
    if (packet.bytes !== reference.bytes) fail('PACKET_DECLARED_BYTES_MISMATCH', `packet ${reference.index} byte declaration mismatch`, { expected: reference.bytes, actual: packet.bytes });
    if (packet.sha256.toLowerCase() !== reference.sha256.toLowerCase()) fail('PACKET_DECLARED_SHA256_MISMATCH', `packet ${reference.index} SHA-256 declaration mismatch`);
    const bytes = decodeCanonicalBase64(packet.dataBase64);
    if (bytes.length !== reference.bytes) fail('PACKET_BYTE_LENGTH_MISMATCH', `packet ${reference.index} byte length mismatch`, { expected: reference.bytes, actual: bytes.length });
    const actualSha256 = sha256(bytes);
    if (actualSha256 !== reference.sha256.toLowerCase()) fail('PACKET_SHA256_MISMATCH', `packet ${reference.index} SHA-256 mismatch`, { expected: reference.sha256, actual: actualSha256 });
    parts.push(bytes);
  }
  const assembled = Buffer.concat(parts);
  if (assembled.length !== manifest.totalBytes) fail('FINAL_BYTE_LENGTH_MISMATCH', 'assembled byte length mismatch', { expected: manifest.totalBytes, actual: assembled.length });
  const actualSha256 = sha256(assembled);
  if (actualSha256 !== manifest.sha256.toLowerCase()) fail('FINAL_SHA256_MISMATCH', 'assembled SHA-256 mismatch', { expected: manifest.sha256, actual: actualSha256 });
  return assembled;
}

function parseMarkedJson(body, marker, missingCode, invalidCode) {
  if (typeof body !== 'string') fail('REQUEST_BODY_INVALID', 'comment body missing');
  const trimmed = body.trim();
  if (!trimmed.startsWith(`${marker}\n`)) fail(missingCode, 'request marker missing');
  const jsonText = trimmed.slice(marker.length).trim();
  try { return JSON.parse(jsonText); } catch { fail(invalidCode, 'request JSON could not be parsed'); }
}

export function parseRequestComment(body) {
  return parseMarkedJson(body, REQUEST_MARKER, 'REQUEST_MARKER_MISSING', 'REQUEST_JSON_INVALID');
}

export function parsePacketComment(body) {
  return validatePacket(parseMarkedJson(body, PACKET_MARKER, 'PACKET_MARKER_MISSING', 'PACKET_JSON_INVALID'));
}

export function parsePacketIngressRequestComment(body) {
  return parseMarkedJson(body, PACKET_INGRESS_REQUEST_MARKER, 'PACKET_INGRESS_REQUEST_MARKER_MISSING', 'PACKET_INGRESS_REQUEST_JSON_INVALID');
}

async function githubJson(url, { token, method = 'GET', body = undefined } = {}) {
  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'bounded-binary-object-transfer-v1'
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const text = await response.text();
  let payload = null;
  if (text) {
    try { payload = JSON.parse(text); } catch { payload = text; }
  }
  if (!response.ok) fail('GITHUB_API_FAILURE', `${method} ${url} returned ${response.status}`, { status: response.status, payload });
  return payload;
}

function apiBase(repository) {
  return `https://api.github.com/repos/${repository}`;
}

async function assertExactTransferHead(manifest, token) {
  const base = apiBase(manifest.repository);
  const ref = await githubJson(`${base}/git/ref/heads/${encodeURIComponent(manifest.targetBranch)}`, { token });
  const currentHead = ref?.object?.sha;
  if (currentHead !== manifest.expectedTargetHead) fail('TARGET_HEAD_MISMATCH', 'target branch head differs from authorized expected head', { expected: manifest.expectedTargetHead, actual: currentHead });
  return base;
}

async function commitAssembledBytes({ manifest, assembled, token, ingressMode, unitCount }) {
  const base = await assertExactTransferHead(manifest, token);
  const expectedFinalBlobSha = gitBlobSha(assembled);
  const finalBlob = await githubJson(`${base}/git/blobs`, { token, method: 'POST', body: { content: assembled.toString('base64'), encoding: 'base64' } });
  if (!isHex(finalBlob?.sha, 40)) fail('FINAL_BLOB_CREATE_FAILED', 'GitHub did not return final blob SHA');
  if (finalBlob.sha.toLowerCase() !== expectedFinalBlobSha) {
    fail('FINAL_GIT_BLOB_IDENTITY_MISMATCH', 'created final Git blob identity does not match reconstructed bytes', { expected: expectedFinalBlobSha, actual: finalBlob.sha });
  }
  const finalReadback = await githubJson(`${base}/git/blobs/${finalBlob.sha}`, { token });
  if (finalReadback?.encoding !== 'base64' || typeof finalReadback?.content !== 'string') fail('FINAL_BLOB_READBACK_ENCODING_INVALID', 'final blob readback is not base64');
  const finalReadbackBytes = Buffer.from(finalReadback.content.replace(/\s/g, ''), 'base64');
  if (finalReadbackBytes.length !== manifest.totalBytes || sha256(finalReadbackBytes) !== manifest.sha256.toLowerCase() || gitBlobSha(finalReadbackBytes) !== expectedFinalBlobSha) {
    fail('FINAL_BLOB_READBACK_MISMATCH', 'final unreferenced blob readback does not match expected bytes/hash/blob identity');
  }

  const parentCommit = await githubJson(`${base}/git/commits/${manifest.expectedTargetHead}`, { token });
  const baseTreeSha = parentCommit?.tree?.sha;
  if (!isHex(baseTreeSha, 40)) fail('BASE_TREE_UNRESOLVED', 'could not resolve target head tree');
  const tree = await githubJson(`${base}/git/trees`, {
    token,
    method: 'POST',
    body: { base_tree: baseTreeSha, tree: [{ path: manifest.destinationPath, mode: '100644', type: 'blob', sha: finalBlob.sha }] }
  });
  const commit = await githubJson(`${base}/git/commits`, {
    token,
    method: 'POST',
    body: { message: `Bounded binary transfer: ${manifest.destinationPath}`, tree: tree.sha, parents: [manifest.expectedTargetHead] }
  });

  const preUpdateRef = await githubJson(`${base}/git/ref/heads/${encodeURIComponent(manifest.targetBranch)}`, { token });
  if (preUpdateRef?.object?.sha !== manifest.expectedTargetHead) fail('TARGET_HEAD_RACED', 'target branch moved before CAS update', { expected: manifest.expectedTargetHead, actual: preUpdateRef?.object?.sha });
  await githubJson(`${base}/git/refs/heads/${encodeURIComponent(manifest.targetBranch)}`, { token, method: 'PATCH', body: { sha: commit.sha, force: false } });

  const postRef = await githubJson(`${base}/git/ref/heads/${encodeURIComponent(manifest.targetBranch)}`, { token });
  if (postRef?.object?.sha !== commit.sha) fail('TARGET_REF_READBACK_MISMATCH', 'target branch readback does not match created commit');
  const destination = await githubJson(`${base}/contents/${manifest.destinationPath.split('/').map(encodeURIComponent).join('/')}?ref=${commit.sha}`, { token });
  if (destination?.sha !== finalBlob.sha || destination?.size !== manifest.totalBytes) fail('DESTINATION_READBACK_IDENTITY_MISMATCH', 'destination file identity/size does not match final blob');

  return {
    schema: SCHEMA_RECEIPT,
    disposition: 'PASS',
    ingressMode,
    repository: manifest.repository,
    targetBranch: manifest.targetBranch,
    targetHeadBefore: manifest.expectedTargetHead,
    targetHeadAfter: commit.sha,
    destinationPath: manifest.destinationPath,
    totalBytes: manifest.totalBytes,
    sha256: manifest.sha256.toLowerCase(),
    finalBlobSha: finalBlob.sha.toLowerCase(),
    unitCount,
    exactTargetHeadGuard: true,
    nonMainTargetGuard: true,
    finalGitBlobIdentityVerified: true,
    finalBlobReadbackVerified: true,
    destinationReadbackVerified: true,
    repositoryMainMutationAuthorized: false,
    productSemanticAuthorityCreated: false
  };
}

export async function executeTransfer({ manifest, token, expectedRepository }) {
  validateManifest(manifest, expectedRepository);
  if (!token) fail('GITHUB_TOKEN_MISSING', 'GitHub token missing');
  const base = await assertExactTransferHead(manifest, token);
  const assembled = await reconstructFromChunks(manifest, async (chunk) => {
    const blob = await githubJson(`${base}/git/blobs/${chunk.blobSha}`, { token });
    if (blob?.encoding !== 'base64' || typeof blob?.content !== 'string') fail('CHUNK_BLOB_ENCODING_INVALID', `chunk ${chunk.index} blob response is not base64`);
    return Buffer.from(blob.content.replace(/\s/g, ''), 'base64');
  });
  const receipt = await commitAssembledBytes({ manifest, assembled, token, ingressMode: 'EXISTING_GIT_BLOB_CHUNKS', unitCount: manifest.chunks.length });
  return { ...receipt, chunkCount: manifest.chunks.length };
}

export async function executePacketIngress({ manifest, token, expectedRepository }) {
  validatePacketManifest(manifest, expectedRepository);
  if (!token) fail('GITHUB_TOKEN_MISSING', 'GitHub token missing');
  await assertExactTransferHead(manifest, token);
  const base = apiBase(manifest.repository);
  const assembled = await reconstructFromPackets(manifest, async (reference) => {
    let comment;
    try {
      comment = await githubJson(`${base}/issues/comments/${reference.commentId}`, { token });
    } catch (error) {
      fail('PACKET_COMMENT_FETCH_FAILED', `packet ${reference.index} comment could not be fetched`, { commentId: reference.commentId, cause: error.code || 'GITHUB_API_FAILURE' });
    }
    if (comment?.user?.login !== AUTHORIZED_ACTOR) fail('PACKET_ACTOR_UNAUTHORIZED', `packet ${reference.index} comment actor is not authorized`);
    if (comment?.issue_url !== `${base}/issues/${INVOCATION_ISSUE}`) fail('PACKET_ISSUE_MISMATCH', `packet ${reference.index} comment is not on issue #${INVOCATION_ISSUE}`);
    return parsePacketComment(comment.body);
  });
  const receipt = await commitAssembledBytes({ manifest, assembled, token, ingressMode: 'OWNER_AUTHENTICATED_PACKET_COMMENTS', unitCount: manifest.packets.length });
  return { ...receipt, transferId: manifest.transferId, packetCount: manifest.packets.length };
}

function assertInvocationEvent(event, expectedRepository) {
  if (event?.issue?.number !== INVOCATION_ISSUE) fail('INVOCATION_ISSUE_MISMATCH', `requests are accepted only on issue #${INVOCATION_ISSUE}`);
  if (event?.comment?.user?.login !== AUTHORIZED_ACTOR) fail('ACTOR_UNAUTHORIZED', 'request comment actor is not authorized');
  if (event?.repository?.full_name !== expectedRepository) fail('EVENT_REPOSITORY_MISMATCH', 'event repository mismatch');
}

export async function requestFromIssueEvent(event, expectedRepository) {
  assertInvocationEvent(event, expectedRepository);
  const request = parseRequestComment(event.comment.body);
  return validateManifest(request, expectedRepository);
}

export async function packetIngressRequestFromIssueEvent(event, expectedRepository) {
  assertInvocationEvent(event, expectedRepository);
  const request = parsePacketIngressRequestComment(event.comment.body);
  return validatePacketManifest(request, expectedRepository);
}

async function cli() {
  const args = process.argv.slice(2);
  const get = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
  const eventPath = get('--event');
  const receiptPath = get('--receipt');
  const expectedRepository = get('--repository') || process.env.GITHUB_REPOSITORY;
  if (!eventPath || !receiptPath || !expectedRepository) fail('CLI_ARGUMENT_MISSING', '--event, --receipt, and repository are required');
  const event = JSON.parse(await fs.readFile(eventPath, 'utf8'));
  const body = String(event?.comment?.body || '').trim();
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  let receipt;
  if (body.startsWith(`${PACKET_INGRESS_REQUEST_MARKER}\n`)) {
    const manifest = await packetIngressRequestFromIssueEvent(event, expectedRepository);
    receipt = await executePacketIngress({ manifest, token, expectedRepository });
  } else {
    const manifest = await requestFromIssueEvent(event, expectedRepository);
    receipt = await executeTransfer({ manifest, token, expectedRepository });
  }
  await fs.writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
  process.stdout.write(`${JSON.stringify(receipt)}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  cli().catch((error) => {
    const receipt = { schema: SCHEMA_RECEIPT, disposition: 'FAIL_CLOSED', code: error.code || 'UNEXPECTED_ERROR', message: error.message, details: error.details || {} };
    process.stderr.write(`${JSON.stringify(receipt)}\n`);
    process.exitCode = 1;
  });
}

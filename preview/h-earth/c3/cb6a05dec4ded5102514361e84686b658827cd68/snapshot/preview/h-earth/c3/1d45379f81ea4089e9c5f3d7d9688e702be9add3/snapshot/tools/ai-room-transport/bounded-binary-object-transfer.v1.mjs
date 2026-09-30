#!/usr/bin/env node
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

export const SCHEMA_MANIFEST = 'BOUNDED_BINARY_OBJECT_TRANSFER_MANIFEST_v1';
export const SCHEMA_RECEIPT = 'BOUNDED_BINARY_OBJECT_TRANSFER_RECEIPT_v1';
export const REQUEST_MARKER = 'BOUNDED_BINARY_OBJECT_TRANSFER_REQUEST_V1';
export const INVOCATION_ISSUE = 1323;
export const AUTHORIZED_ACTOR = 'smansfield635-create';

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

export function validateManifest(manifest, expectedRepository = null) {
  if (!manifest || manifest.schema !== SCHEMA_MANIFEST) fail('MANIFEST_SCHEMA_INVALID', `schema must be ${SCHEMA_MANIFEST}`);
  if (typeof manifest.repository !== 'string' || !manifest.repository.includes('/')) fail('REPOSITORY_INVALID', 'repository must be owner/name');
  if (expectedRepository && manifest.repository !== expectedRepository) fail('REPOSITORY_MISMATCH', 'manifest repository does not match workflow repository');
  if (typeof manifest.targetBranch !== 'string' || !manifest.targetBranch.startsWith('transfer/')) fail('TARGET_BRANCH_INVALID', 'targetBranch must start with transfer/');
  if (['main', 'master', 'gh-pages'].includes(manifest.targetBranch)) fail('PROTECTED_BRANCH_PROHIBITED', 'protected deployment branches are prohibited');
  if (!isHex(manifest.expectedTargetHead, 40)) fail('TARGET_HEAD_INVALID', 'expectedTargetHead must be a 40-hex commit SHA');
  assertSafeDestination(manifest.destinationPath);
  if (!Number.isSafeInteger(manifest.totalBytes) || manifest.totalBytes < 0) fail('TOTAL_BYTES_INVALID', 'totalBytes must be a non-negative safe integer');
  if (!isHex(manifest.sha256, 64)) fail('FINAL_SHA256_INVALID', 'sha256 must be 64 hex characters');
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

export function parseRequestComment(body) {
  if (typeof body !== 'string') fail('REQUEST_BODY_INVALID', 'comment body missing');
  const trimmed = body.trim();
  if (!trimmed.startsWith(`${REQUEST_MARKER}\n`)) fail('REQUEST_MARKER_MISSING', 'request marker missing');
  const jsonText = trimmed.slice(REQUEST_MARKER.length).trim();
  let request;
  try { request = JSON.parse(jsonText); } catch { fail('REQUEST_JSON_INVALID', 'request JSON could not be parsed'); }
  return request;
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

export async function executeTransfer({ manifest, token, expectedRepository }) {
  validateManifest(manifest, expectedRepository);
  if (!token) fail('GITHUB_TOKEN_MISSING', 'GitHub token missing');
  const base = apiBase(manifest.repository);
  const ref = await githubJson(`${base}/git/ref/heads/${encodeURIComponent(manifest.targetBranch)}`, { token });
  const currentHead = ref?.object?.sha;
  if (currentHead !== manifest.expectedTargetHead) fail('TARGET_HEAD_MISMATCH', 'target branch head differs from authorized expected head', { expected: manifest.expectedTargetHead, actual: currentHead });

  const assembled = await reconstructFromChunks(manifest, async (chunk) => {
    const blob = await githubJson(`${base}/git/blobs/${chunk.blobSha}`, { token });
    if (blob?.encoding !== 'base64' || typeof blob?.content !== 'string') fail('CHUNK_BLOB_ENCODING_INVALID', `chunk ${chunk.index} blob response is not base64`);
    return Buffer.from(blob.content.replace(/\s/g, ''), 'base64');
  });

  const finalBlob = await githubJson(`${base}/git/blobs`, { token, method: 'POST', body: { content: assembled.toString('base64'), encoding: 'base64' } });
  if (!isHex(finalBlob?.sha, 40)) fail('FINAL_BLOB_CREATE_FAILED', 'GitHub did not return final blob SHA');
  const finalReadback = await githubJson(`${base}/git/blobs/${finalBlob.sha}`, { token });
  const finalReadbackBytes = Buffer.from(String(finalReadback.content || '').replace(/\s/g, ''), 'base64');
  if (finalReadbackBytes.length !== manifest.totalBytes || sha256(finalReadbackBytes) !== manifest.sha256.toLowerCase()) {
    fail('FINAL_BLOB_READBACK_MISMATCH', 'final unreferenced blob readback does not match expected bytes/hash');
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
    repository: manifest.repository,
    targetBranch: manifest.targetBranch,
    targetHeadBefore: manifest.expectedTargetHead,
    targetHeadAfter: commit.sha,
    destinationPath: manifest.destinationPath,
    totalBytes: manifest.totalBytes,
    sha256: manifest.sha256.toLowerCase(),
    finalBlobSha: finalBlob.sha,
    chunkCount: manifest.chunks.length,
    exactTargetHeadGuard: true,
    nonMainTargetGuard: true,
    finalBlobReadbackVerified: true,
    destinationReadbackVerified: true,
    repositoryMainMutationAuthorized: false,
    productSemanticAuthorityCreated: false
  };
}

export async function requestFromIssueEvent(event, expectedRepository) {
  if (event?.issue?.number !== INVOCATION_ISSUE) fail('INVOCATION_ISSUE_MISMATCH', `requests are accepted only on issue #${INVOCATION_ISSUE}`);
  if (event?.comment?.user?.login !== AUTHORIZED_ACTOR) fail('ACTOR_UNAUTHORIZED', 'request comment actor is not authorized');
  if (event?.repository?.full_name !== expectedRepository) fail('EVENT_REPOSITORY_MISMATCH', 'event repository mismatch');
  const request = parseRequestComment(event.comment.body);
  return validateManifest(request, expectedRepository);
}

async function cli() {
  const args = process.argv.slice(2);
  const get = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
  const eventPath = get('--event');
  const receiptPath = get('--receipt');
  const expectedRepository = get('--repository') || process.env.GITHUB_REPOSITORY;
  if (!eventPath || !receiptPath || !expectedRepository) fail('CLI_ARGUMENT_MISSING', '--event, --receipt, and repository are required');
  const event = JSON.parse(await fs.readFile(eventPath, 'utf8'));
  const manifest = await requestFromIssueEvent(event, expectedRepository);
  const receipt = await executeTransfer({ manifest, token: process.env.GITHUB_TOKEN || process.env.GH_TOKEN, expectedRepository });
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

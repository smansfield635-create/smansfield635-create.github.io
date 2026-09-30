#!/usr/bin/env node
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

export const SCHEMA = 'BOUNDED_BINARY_OBJECT_TRANSFER_MANIFEST_v1';
export const DEFAULT_CHUNK_SIZE = 524288;

export function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function fail(code, message, details = {}) {
  const error = new Error(message);
  error.code = code;
  error.details = details;
  throw error;
}

function assertHex(value, length, code, label) {
  if (typeof value !== 'string' || !new RegExp(`^[0-9a-f]{${length}}$`, 'i').test(value)) {
    fail(code, `${label} must be ${length} hex characters`);
  }
}

function assertDestination(path) {
  if (typeof path !== 'string' || !path || path.startsWith('/') || path.includes('\\') || path.split('/').some((p) => !p || p === '.' || p === '..')) {
    fail('DESTINATION_PATH_INVALID', 'destination must be a normalized repository-relative path');
  }
}

async function githubJson(url, { token, method = 'GET', body } = {}) {
  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      'User-Agent': 'bounded-binary-file-ingress-v1'
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

export async function buildManifestFromFile({ sourcePath, repository, targetBranch, expectedTargetHead, destinationPath, token, chunkSize = DEFAULT_CHUNK_SIZE }) {
  if (!sourcePath) fail('SOURCE_PATH_REQUIRED', 'sourcePath is required');
  if (typeof repository !== 'string' || !repository.includes('/')) fail('REPOSITORY_INVALID', 'repository must be owner/name');
  if (typeof targetBranch !== 'string' || !targetBranch.startsWith('transfer/')) fail('TARGET_BRANCH_INVALID', 'targetBranch must start with transfer/');
  assertHex(expectedTargetHead, 40, 'TARGET_HEAD_INVALID', 'expectedTargetHead');
  assertDestination(destinationPath);
  if (!token) fail('GITHUB_TOKEN_MISSING', 'GitHub token is required');
  if (!Number.isSafeInteger(chunkSize) || chunkSize < 65536 || chunkSize > 1048576) fail('CHUNK_SIZE_INVALID', 'chunkSize must be between 64 KiB and 1 MiB');

  const source = await fs.readFile(sourcePath);
  const chunks = [];
  const base = `https://api.github.com/repos/${repository}`;

  for (let offset = 0, index = 0; offset < source.length; offset += chunkSize, index += 1) {
    const bytes = source.subarray(offset, Math.min(offset + chunkSize, source.length));
    const created = await githubJson(`${base}/git/blobs`, {
      token,
      method: 'POST',
      body: { content: bytes.toString('base64'), encoding: 'base64' }
    });
    assertHex(created?.sha, 40, 'CHUNK_BLOB_CREATE_FAILED', `chunk ${index} blob SHA`);
    chunks.push({ index, blobSha: created.sha.toLowerCase(), bytes: bytes.length, sha256: sha256(bytes) });
  }

  return {
    schema: SCHEMA,
    repository,
    targetBranch,
    expectedTargetHead: expectedTargetHead.toLowerCase(),
    destinationPath,
    totalBytes: source.length,
    sha256: sha256(source),
    chunks
  };
}

async function cli() {
  const args = process.argv.slice(2);
  const get = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
  const sourcePath = get('--source');
  const repository = get('--repository');
  const targetBranch = get('--target-branch');
  const expectedTargetHead = get('--expected-target-head');
  const destinationPath = get('--destination');
  const output = get('--output');
  const chunkSizeArg = get('--chunk-size');
  if (!output) fail('OUTPUT_REQUIRED', '--output is required');
  const manifest = await buildManifestFromFile({
    sourcePath,
    repository,
    targetBranch,
    expectedTargetHead,
    destinationPath,
    token: process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
    chunkSize: chunkSizeArg ? Number(chunkSizeArg) : DEFAULT_CHUNK_SIZE
  });
  await fs.writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  process.stdout.write(`${JSON.stringify(manifest)}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  cli().catch((error) => {
    process.stderr.write(`${JSON.stringify({ disposition: 'FAIL_CLOSED', code: error.code || 'UNEXPECTED_ERROR', message: error.message, details: error.details || {} })}\n`);
    process.exitCode = 1;
  });
}

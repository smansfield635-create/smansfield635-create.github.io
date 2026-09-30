#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const TARGETS = Object.freeze({
  index: 'index.html',
  runtime: 'assets/compass/compass.readiness-context-v1.js',
  manifest: '.github/ai-router/publication-surfaces/compass-gen1862.json'
});
const TARGET_PATHS = Object.freeze(Object.values(TARGETS).sort());
const ASSET_PATH = '/assets/compass/compass.readiness-context-v1.js';
const STATIC_SECTION_ANCHOR = 'id="chapter-studio"';
const STATIC_START = '<div class="compass-chapter-disclosure__body"><p>';
const STATIC_END = '</p><p class="compass-chapter-closing">';
const RUNTIME_SECTION_ANCHOR = 'if(studio){studio.innerHTML=`';
const RUNTIME_START = '<div class=\\"compass-chapter-disclosure__body\\"><p>';
const RUNTIME_END = '</p><p class=\\"compass-chapter-closing\\">';

function fail(code, detail = null) {
  const receipt = { schema: 'COMPASS_STUDIO_COPY_SYNC_RECEIPT_v1', result: 'FAIL_CLOSED', errorCode: code, detail };
  process.stderr.write(`${JSON.stringify(receipt, null, 2)}\n`);
  process.exit(1);
}

function parse(argv) {
  const out = { mode: null, root: process.cwd(), textFile: null, base: null, head: null };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--apply') out.mode = out.mode ? fail('MODE_AMBIGUOUS') : 'APPLY';
    else if (token === '--verify') out.mode = out.mode ? fail('MODE_AMBIGUOUS') : 'VERIFY';
    else if (token === '--root') out.root = path.resolve(argv[++i] ?? '');
    else if (token === '--text-file') out.textFile = path.resolve(argv[++i] ?? '');
    else if (token === '--base') out.base = argv[++i] ?? null;
    else if (token === '--head') out.head = argv[++i] ?? null;
    else if (token === '--help') {
      process.stdout.write([
        'Usage:',
        '  node tools/compass-studio-copy-sync.mjs --apply --text-file <paragraph.txt> [--root <repo>]',
        '  node tools/compass-studio-copy-sync.mjs --verify [--text-file <paragraph.txt>] [--base <sha> --head <sha>] [--root <repo>]',
        '',
        'Apply is transactional and refuses a dirty worktree. It synchronizes the Studio paragraph in index.html and the runtime owner, derives the readiness-context cache token from the resulting git-blob SHA, and propagates that identity into index.html and the Compass publication manifest.'
      ].join('\n') + '\n');
      process.exit(0);
    } else fail('UNKNOWN_ARGUMENT', token);
  }
  if (!out.mode) fail('MODE_REQUIRED');
  if (out.mode === 'APPLY' && !out.textFile) fail('TEXT_FILE_REQUIRED');
  if ((out.base && !out.head) || (!out.base && out.head)) fail('BASE_HEAD_PAIR_REQUIRED');
  return out;
}

function runGit(root, args, { allowFailure = false } = {}) {
  const result = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8' });
  if (result.status !== 0 && !allowFailure) fail('GIT_COMMAND_FAILED', { args, stderr: result.stderr, stdout: result.stdout });
  return result;
}

function read(root, relative) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) fail('MISSING_REQUIRED_FILE', relative);
  return fs.readFileSync(file, 'utf8');
}

function count(haystack, needle) {
  let n = 0;
  for (let i = 0; (i = haystack.indexOf(needle, i)) !== -1; i += needle.length) n += 1;
  return n;
}

function extractBetween(content, sectionAnchor, startMarker, endMarker, label) {
  if (count(content, sectionAnchor) !== 1) fail(`${label}_SECTION_ANCHOR_COUNT_INVALID`, count(content, sectionAnchor));
  const sectionPos = content.indexOf(sectionAnchor);
  const startPos = content.indexOf(startMarker, sectionPos);
  if (startPos < 0) fail(`${label}_START_MARKER_MISSING`);
  const valueStart = startPos + startMarker.length;
  const endPos = content.indexOf(endMarker, valueStart);
  if (endPos < 0) fail(`${label}_END_MARKER_MISSING`);
  return { value: content.slice(valueStart, endPos), valueStart, endPos };
}

function replaceBetween(content, sectionAnchor, startMarker, endMarker, replacement, label) {
  const hit = extractBetween(content, sectionAnchor, startMarker, endMarker, label);
  return content.slice(0, hit.valueStart) + replacement + content.slice(hit.endPos);
}

function htmlEscapePlainText(value) {
  const normalized = String(value).replaceAll('\r\n', '\n').trim();
  if (!normalized) fail('EMPTY_PARAGRAPH');
  if (normalized.includes('\n')) fail('MULTILINE_PARAGRAPH_NOT_ALLOWED');
  return normalized.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function gitBlobSha(text) {
  const body = Buffer.from(text, 'utf8');
  return crypto.createHash('sha1').update(Buffer.from(`blob ${body.length}\0`)).update(body).digest('hex');
}

function paragraphSha256(escapedText) {
  return crypto.createHash('sha256').update(Buffer.from(escapedText, 'utf8')).digest('hex');
}

function findIndexIdentity(indexContent) {
  const re = /\/assets\/compass\/compass\.readiness-context-v1\.js\?v=([^"'&\s>]+)&cb=([0-9a-f]{16})/g;
  const matches = [...indexContent.matchAll(re)];
  if (matches.length !== 1) fail('INDEX_ASSET_IDENTITY_COUNT_INVALID', matches.length);
  return { full: matches[0][0], version: matches[0][1], token: matches[0][2], index: matches[0].index };
}

function replaceIndexIdentity(indexContent, token) {
  const hit = findIndexIdentity(indexContent);
  const replacement = `${ASSET_PATH}?v=${hit.version}&cb=${token}`;
  return indexContent.slice(0, hit.index) + replacement + indexContent.slice(hit.index + hit.full.length);
}

function parseManifest(content) {
  try { return JSON.parse(content); }
  catch (error) { fail('MANIFEST_JSON_INVALID', String(error)); }
}

function findManifestIdentity(manifest) {
  const hits = [];
  for (let checkIndex = 0; checkIndex < (manifest.checks ?? []).length; checkIndex += 1) {
    const includes = manifest.checks[checkIndex]?.includes;
    if (!Array.isArray(includes)) continue;
    for (let includeIndex = 0; includeIndex < includes.length; includeIndex += 1) {
      const value = String(includes[includeIndex]);
      if (value.startsWith(`${ASSET_PATH}?`)) hits.push({ checkIndex, includeIndex, value });
    }
  }
  if (hits.length !== 1) fail('MANIFEST_ASSET_IDENTITY_COUNT_INVALID', hits.length);
  const m = hits[0].value.match(/^\/assets\/compass\/compass\.readiness-context-v1\.js\?v=([^&\s]+)&cb=([0-9a-f]{16})$/);
  if (!m) fail('MANIFEST_ASSET_IDENTITY_INVALID', hits[0].value);
  return { ...hits[0], version: m[1], token: m[2] };
}

function setManifestIdentity(manifest, version, token) {
  const hit = findManifestIdentity(manifest);
  if (hit.version !== version) fail('INDEX_MANIFEST_VERSION_MISMATCH', { index: version, manifest: hit.version });
  manifest.checks[hit.checkIndex].includes[hit.includeIndex] = `${ASSET_PATH}?v=${version}&cb=${token}`;
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

function getChangedPaths(root, base = null, head = null) {
  const args = base && head ? ['diff', '--name-only', base, head, '--'] : ['diff', '--name-only', 'HEAD', '--'];
  return runGit(root, args).stdout.split(/\r?\n/).filter(Boolean).sort();
}

function assertExactTargetDiff(paths) {
  if (JSON.stringify(paths) !== JSON.stringify(TARGET_PATHS)) fail('CHANGED_PATH_SET_INVALID', { expected: TARGET_PATHS, actual: paths });
}

function verifyState(root, { expectedEscaped = null, base = null, head = null, requireTargetDiff = false } = {}) {
  const index = read(root, TARGETS.index);
  const runtime = read(root, TARGETS.runtime);
  const manifestText = read(root, TARGETS.manifest);
  const staticCopy = extractBetween(index, STATIC_SECTION_ANCHOR, STATIC_START, STATIC_END, 'STATIC').value;
  const runtimeCopy = extractBetween(runtime, RUNTIME_SECTION_ANCHOR, RUNTIME_START, RUNTIME_END, 'RUNTIME').value;
  if (staticCopy !== runtimeCopy) fail('STATIC_RUNTIME_COPY_MISMATCH', { staticCopy, runtimeCopy });
  if (expectedEscaped !== null && staticCopy !== expectedEscaped) fail('EXPECTED_COPY_MISMATCH', { expected: expectedEscaped, actual: staticCopy });

  const indexIdentity = findIndexIdentity(index);
  const manifest = parseManifest(manifestText);
  const manifestIdentity = findManifestIdentity(manifest);
  if (indexIdentity.full !== manifestIdentity.value) fail('INDEX_MANIFEST_IDENTITY_MISMATCH', { index: indexIdentity.full, manifest: manifestIdentity.value });

  const runtimeBlobSha = gitBlobSha(runtime);
  const derivedToken = runtimeBlobSha.slice(0, 16);
  if (indexIdentity.token !== derivedToken) fail('CACHE_TOKEN_NOT_RUNTIME_BLOB_PREFIX', { expected: derivedToken, actual: indexIdentity.token, runtimeBlobSha });

  let changedPaths = null;
  if (requireTargetDiff || (base && head)) {
    changedPaths = getChangedPaths(root, base, head);
    assertExactTargetDiff(changedPaths);
  }

  return {
    staticCopy,
    runtimeBlobSha,
    cacheToken: derivedToken,
    assetIdentity: indexIdentity.full,
    changedPaths
  };
}

const args = parse(process.argv.slice(2));
const root = args.root;
runGit(root, ['rev-parse', '--show-toplevel']);

let expectedEscaped = null;
if (args.textFile) {
  if (!fs.existsSync(args.textFile)) fail('TEXT_FILE_MISSING', args.textFile);
  expectedEscaped = htmlEscapePlainText(fs.readFileSync(args.textFile, 'utf8'));
}

if (args.mode === 'APPLY') {
  const status = runGit(root, ['status', '--porcelain']).stdout.trim();
  if (status) fail('DIRTY_WORKTREE', status.split(/\r?\n/));

  const originalIndex = read(root, TARGETS.index);
  const originalRuntime = read(root, TARGETS.runtime);
  const originalManifestText = read(root, TARGETS.manifest);
  const currentStatic = extractBetween(originalIndex, STATIC_SECTION_ANCHOR, STATIC_START, STATIC_END, 'STATIC').value;
  const currentRuntime = extractBetween(originalRuntime, RUNTIME_SECTION_ANCHOR, RUNTIME_START, RUNTIME_END, 'RUNTIME').value;
  if (currentStatic !== currentRuntime) fail('PREEXISTING_STATIC_RUNTIME_COPY_MISMATCH', { staticCopy: currentStatic, runtimeCopy: currentRuntime });
  if (currentStatic === expectedEscaped) fail('NO_COPY_CHANGE');

  const nextRuntime = replaceBetween(originalRuntime, RUNTIME_SECTION_ANCHOR, RUNTIME_START, RUNTIME_END, expectedEscaped, 'RUNTIME');
  const runtimeBlobSha = gitBlobSha(nextRuntime);
  const token = runtimeBlobSha.slice(0, 16);

  let nextIndex = replaceBetween(originalIndex, STATIC_SECTION_ANCHOR, STATIC_START, STATIC_END, expectedEscaped, 'STATIC');
  const currentIndexIdentity = findIndexIdentity(nextIndex);
  nextIndex = replaceIndexIdentity(nextIndex, token);

  const manifest = parseManifest(originalManifestText);
  const nextManifest = setManifestIdentity(manifest, currentIndexIdentity.version, token);

  // Transaction boundary: all preconditions and all resulting bytes are computed before the first write.
  fs.writeFileSync(path.join(root, TARGETS.runtime), nextRuntime, 'utf8');
  fs.writeFileSync(path.join(root, TARGETS.index), nextIndex, 'utf8');
  fs.writeFileSync(path.join(root, TARGETS.manifest), nextManifest, 'utf8');

  const verified = verifyState(root, { expectedEscaped, requireTargetDiff: true });
  process.stdout.write(`${JSON.stringify({
    schema: 'COMPASS_STUDIO_COPY_SYNC_RECEIPT_v1',
    result: 'PASS_CLOSED',
    mode: 'APPLY',
    paragraphSha256: paragraphSha256(expectedEscaped),
    runtimeGitBlobSha: verified.runtimeBlobSha,
    cacheToken: verified.cacheToken,
    assetIdentity: verified.assetIdentity,
    changedPaths: verified.changedPaths,
    proofs: {
      PREEXISTING_STATIC_RUNTIME_COPY_MATCH: true,
      STATIC_RUNTIME_COPY_MATCH: true,
      INDEX_MANIFEST_ASSET_IDENTITY_MATCH: true,
      CACHE_TOKEN_EQUALS_RUNTIME_GIT_BLOB_PREFIX: true,
      EXACT_THREE_FILE_DIFF: true,
      NO_UNRELATED_DIFF: true
    }
  }, null, 2)}\n`);
} else {
  const verified = verifyState(root, { expectedEscaped, base: args.base, head: args.head, requireTargetDiff: Boolean(args.base && args.head) });
  process.stdout.write(`${JSON.stringify({
    schema: 'COMPASS_STUDIO_COPY_SYNC_RECEIPT_v1',
    result: 'PASS_CLOSED',
    mode: 'VERIFY',
    paragraphSha256: paragraphSha256(verified.staticCopy),
    runtimeGitBlobSha: verified.runtimeBlobSha,
    cacheToken: verified.cacheToken,
    assetIdentity: verified.assetIdentity,
    changedPaths: verified.changedPaths,
    proofs: {
      STATIC_RUNTIME_COPY_MATCH: true,
      INDEX_MANIFEST_ASSET_IDENTITY_MATCH: true,
      CACHE_TOKEN_EQUALS_RUNTIME_GIT_BLOB_PREFIX: true,
      EXACT_THREE_FILE_DIFF: verified.changedPaths ? true : null,
      NO_UNRELATED_DIFF: verified.changedPaths ? true : null
    }
  }, null, 2)}\n`);
}

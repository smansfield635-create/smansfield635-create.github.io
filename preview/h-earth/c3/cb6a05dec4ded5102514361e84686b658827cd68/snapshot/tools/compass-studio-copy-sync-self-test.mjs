#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

const tool = path.resolve(process.argv[2] ?? new URL('./compass-studio-copy-sync.mjs', import.meta.url).pathname);

function run(cwd, args, expect = 0) {
  const result = spawnSync(process.execPath, [tool, ...args], { cwd, encoding: 'utf8' });
  if (result.status !== expect) {
    throw new Error(`unexpected status ${result.status} != ${expect}\nstdout=${result.stdout}\nstderr=${result.stderr}`);
  }
  return result;
}

function git(cwd, args) {
  const result = spawnSync('git', ['-C', cwd, ...args], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
  return result.stdout.trim();
}

function gitBlobSha(text) {
  const body = Buffer.from(text, 'utf8');
  return crypto.createHash('sha1').update(Buffer.from(`blob ${body.length}\0`)).update(body).digest('hex');
}

function makeRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'compass-studio-sync-'));
  fs.mkdirSync(path.join(root, 'assets/compass'), { recursive: true });
  fs.mkdirSync(path.join(root, '.github/ai-router/publication-surfaces'), { recursive: true });

  const old = 'Old studio paragraph.';
  const runtime = `(()=>{\nfunction installChapterAuthority(){if(studio){studio.innerHTML=\`<p class=\\"compass-chapter-identifier\\">THE STUDIO</p><h3>One independent studio.</h3><details><div class=\\"compass-chapter-disclosure__body\\"><p>${old}</p><p class=\\"compass-chapter-closing\\">This website does not merely describe the studio. It is the studio in operation.</p></div></details>\`;}}\n})();\n`;
  const token = gitBlobSha(runtime).slice(0, 16);
  const identity = `/assets/compass/compass.readiness-context-v1.js?v=compass-runtime-copy-owner-repair-gen1876&cb=${token}`;
  const index = `<section id=\"chapter-studio\"><details><div class=\"compass-chapter-disclosure__body\"><p>${old}</p><p class=\"compass-chapter-closing\">This website does not merely describe the studio. It is the studio in operation.</p></div></details></section>\n<script src=\"${identity}\"></script>\n`;
  const manifest = {
    schema: 'PUBLICATION_SURFACE_VERIFICATION_v1',
    surfaceId: 'compass-gen1862',
    checks: [{ path: '/', includes: [identity], excludes: [] }]
  };

  fs.writeFileSync(path.join(root, 'index.html'), index);
  fs.writeFileSync(path.join(root, 'assets/compass/compass.readiness-context-v1.js'), runtime);
  fs.writeFileSync(path.join(root, '.github/ai-router/publication-surfaces/compass-gen1862.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  git(root, ['init', '-q']);
  git(root, ['config', 'user.email', 'test@example.invalid']);
  git(root, ['config', 'user.name', 'Compass Self Test']);
  git(root, ['add', '.']);
  git(root, ['commit', '-qm', 'fixture']);
  return root;
}

const root = makeRepo();
const textFile = path.join(os.tmpdir(), `paragraph-${path.basename(root)}.txt`);
fs.writeFileSync(textFile, 'New studio paragraph with & meaning — still one paragraph.\n');

const apply = run(root, ['--apply', '--text-file', textFile]);
const receipt = JSON.parse(apply.stdout);
assert.equal(receipt.result, 'PASS_CLOSED');
assert.deepEqual(receipt.changedPaths, [
  '.github/ai-router/publication-surfaces/compass-gen1862.json',
  'assets/compass/compass.readiness-context-v1.js',
  'index.html'
]);
assert.equal(receipt.proofs.EXACT_THREE_FILE_DIFF, true);
assert.match(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), /New studio paragraph with &amp; meaning/);
assert.match(fs.readFileSync(path.join(root, 'assets/compass/compass.readiness-context-v1.js'), 'utf8'), /New studio paragraph with &amp; meaning/);

const verify = run(root, ['--verify', '--text-file', textFile]);
assert.equal(JSON.parse(verify.stdout).result, 'PASS_CLOSED');

const secondApply = run(root, ['--apply', '--text-file', textFile], 1);
assert.match(secondApply.stderr, /DIRTY_WORKTREE/);

const base = git(root, ['rev-parse', 'HEAD']);
git(root, ['add', '.']);
git(root, ['commit', '-qm', 'candidate']);
const head = git(root, ['rev-parse', 'HEAD']);
const verifyCommitted = run(root, ['--verify', '--text-file', textFile, '--base', base, '--head', head]);
assert.equal(JSON.parse(verifyCommitted.stdout).proofs.EXACT_THREE_FILE_DIFF, true);

const manifestPath = path.join(root, '.github/ai-router/publication-surfaces/compass-gen1862.json');
fs.writeFileSync(manifestPath, fs.readFileSync(manifestPath, 'utf8').replace(receipt.cacheToken, '0000000000000000'));
const tampered = run(root, ['--verify'], 1);
assert.match(tampered.stderr, /INDEX_MANIFEST_IDENTITY_MISMATCH/);

console.log(JSON.stringify({ result: 'COMPASS_STUDIO_COPY_SYNC_SELF_TEST_PASS' }, null, 2));

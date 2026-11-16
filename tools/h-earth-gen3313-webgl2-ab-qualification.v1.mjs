#!/usr/bin/env node
// Gen3318: read-only exact-head WebGL2 comparison; never publishes or edits product source.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';

const TOOLING_MAIN = 'cc82e9ee59985217a083b43414385d6098bddbaf';
const BASELINE_HEAD = '13409ec444f6c92b0ed37ddcada3bdc45c0d6d0b';
const CANDIDATE_HEAD = '371998ecceee8bdba7328c93c74d5a6a3aeb8f7d';
const BASELINE_BLOB = '3471d386d720382b1b55b146fef6fa0af61f0d36';
const CANDIDATE_BLOB = '1cdb91cb7bbcf9f6d0c4b66f5f576cbb36b48636';
const COMPARATOR_BLOB = 'e6d9efbb6015ea49f415ccc179232d08428d35ea';
const RENDERER = 'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
const TOOL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COMPARATOR = path.join(TOOL_ROOT, 'tools/h-earth-ground-material-comparison.v1.mjs');
const PROFILE = 'GEN3313_OWNER_FRAME_V1';
const EVIDENCE_SCHEMA = 'H_EARTH_GEN3313_WEBGL2_AB_EVIDENCE_v1';

function requireOne(source, before, after) {
  if (source.split(before).length !== 2) throw Error('BOUND_COMPARATOR_ANCHOR_NOT_UNIQUE: ' + before.slice(0, 80));
  return source.replace(before, after);
}
function exactGit(dir, args) {
  return execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8' }).trim();
}
function sourceBinding() {
  if (exactGit(TOOL_ROOT, ['hash-object', 'tools/h-earth-ground-material-comparison.v1.mjs']) !== COMPARATOR_BLOB)
    throw Error('COMPARATOR_BLOB_DRIFT');
  let s = fs.readFileSync(COMPARATOR, 'utf8');
  const patches = [
    ["baseline:'bcfb0650077323851f01f51d712c7f8b8ac39220'", "baseline:'" + BASELINE_HEAD + "'"],
    ["candidate:'7610827598eaadf4fbb92e7ec8b9371c8cd08581'", "candidate:'" + CANDIDATE_HEAD + "'"],
    ["baseline:'85ee835060d5106a670077a5f4352b7ad202b49b'", "baseline:'" + BASELINE_BLOB + "'"],
    ["candidate:'9fe90b5c0e58fb3a121c910cb0110a0846bf07bc'", "candidate:'" + CANDIDATE_BLOB + "'"],
    ["  {name:'coast-control',x:0,z:-110,yaw:170,pitch:-8}\n].map",
     "  {name:'coast-control',x:0,z:-110,yaw:170,pitch:-8},\n" +
     "  {name:'grove-second-control',x:-141,z:-226,yaw:0,pitch:16},\n" +
     "  {name:'inland-boundary-control',x:-200,z:-728,y:18.361431,yaw:0,pitch:-14,diagnosticObserver:true}\n].map"]
  ];
  for (const [before, after] of patches) s = requireOne(s, before, after);
  // The archived Gen3142 owner projection is not a valid Gen3313 invariant.
  // Retain real paired camera/projection parity; do not claim screenshot equivalence.
  const ownerStart = "  if(pose.owner){\n    for(const k of ['x','y','z']){";
  const ownerEnd = "  if(!view.pixelPatch";
  const a = s.indexOf(ownerStart), b = s.indexOf(ownerEnd, a);
  if (a < 0 || b < a || s.indexOf(ownerStart, a + 1) !== -1) throw Error('HISTORIC_OWNER_FRAME_GUARD_DRIFT');
  s = s.slice(0, a) + "  if(pose.owner && !Number.isFinite(cam.position.x))throw Error('OWNER_CAMERA_NOT_FINITE');\n" + s.slice(b);
  const importOld = "from './h-earth-groundcover-factor-overlay.mjs'";
  const importNew = 'from ' + JSON.stringify(pathToFileURL(path.join(TOOL_ROOT, 'tools/h-earth-groundcover-factor-overlay.mjs')).href);
  s = requireOne(s, importOld, importNew);
  // Generated comparator executes outside node_modules ancestry: bind both Playwright imports.
  const playwrightOld = "await import('playwright')";
  const playwrightNew = 'await import(' + JSON.stringify(pathToFileURL(path.join(TOOL_ROOT, 'node_modules/playwright/index.mjs')).href) + ')';
  if (s.split(playwrightOld).length !== 3) throw Error('PLAYWRIGHT_IMPORT_ANCHOR_DRIFT');
  s = s.split(playwrightOld).join(playwrightNew);
  s = s.replaceAll('GEN3142', 'GEN3313').replaceAll('Gen3142', 'Gen3313').replaceAll('gen3142', 'gen3313');
  if (!s.includes("profile:'GEN3313_OWNER_FRAME_V1'") || !s.includes('export async function runGen3313'))
    throw Error('GEN3313_ADAPTATION_INCOMPLETE');
  return s;
}
function args(v) {
  const out = {};
  for (let i = 0; i < v.length; i += 2) {
    if (!v[i].startsWith('--') || !v[i + 1]) throw Error('ARGUMENT_PAIR_REQUIRED');
    out[v[i]] = v[i + 1];
  }
  return out;
}
function inspect(dir, head, blob) {
  if (exactGit(dir, ['rev-parse', 'HEAD']) !== head) throw Error('EXACT_CANDIDATE_SHA_MISMATCH');
  if (exactGit(dir, ['hash-object', RENDERER]) !== blob) throw Error('EXACT_RENDERER_BLOB_MISMATCH');
  if (exactGit(dir, ['status', '--porcelain']).length !== 0) throw Error('PRODUCT_CHECKOUT_DIRTY');
}
function persist(dest, value) {
  fs.mkdirSync(dest, { recursive: true });
  fs.writeFileSync(path.join(dest, 'gen3313-webgl2-evidence.json'), JSON.stringify(value, null, 2) + '\n');
}
const baseRecord = {
  schema: EVIDENCE_SCHEMA, baselineHead: BASELINE_HEAD, candidateHead: CANDIDATE_HEAD,
  baselineRendererBlob: BASELINE_BLOB, candidateRendererBlob: CANDIDATE_BLOB,
  toolingMain: TOOLING_MAIN, comparatorSourceBlob: COMPARATOR_BLOB,
  gen3142HistoricalOwnerProjectionApplied: false, exactOwnerScreenshotMatchProven: false,
  physicalAndroidEquivalenceProven: false, ownerKeep: false,
  productMutationPerformed: false, workflowMutationPerformed: false,
  mergePerformed: false, deploymentPerformed: false, publicationPerformed: false
};
async function main() {
  if (process.argv.length === 3 && process.argv[2] === '--self-test') {
    const s = sourceBinding();
    if (s.includes("baseline:'bcfb0650077323851f01f51d712c7f8b8ac39220'")) throw Error('OLD_BASELINE_RETAINED');
    if (!s.includes('inland-boundary-control') || !s.includes('grove-second-control')) throw Error('CONTROLS_MISSING');
    process.stdout.write(JSON.stringify({ schema: EVIDENCE_SCHEMA, result: 'SOURCE_BINDING_SELF_TEST_PASS_NOT_WEBGL2', baselineHead: BASELINE_HEAD, candidateHead: CANDIDATE_HEAD }) + '\n');
    return;
  }
  const a = args(process.argv.slice(2)), out = a['--output'];
  if (!out || !a['--baseline-dir'] || !a['--candidate-dir']) throw Error('EXACT_THREE_ARGS_REQUIRED');
  const record = { ...baseRecord, result: 'INCOMPLETE_OR_FAILED', errors: [] };
  persist(out, record);
  try {
    const source = sourceBinding();
    inspect(a['--baseline-dir'], BASELINE_HEAD, BASELINE_BLOB);
    inspect(a['--candidate-dir'], CANDIDATE_HEAD, CANDIDATE_BLOB);
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gen3313-webgl2-'));
    const derived = path.join(tmp, 'bound-comparator.mjs');
    fs.writeFileSync(derived, source);
    process.env.H_EARTH_COMPARISON_PROFILE = PROFILE;
    const comparator = await import(pathToFileURL(derived).href);
    await comparator.runGen3313([
      '--baseline-dir', a['--baseline-dir'],
      '--candidate-dir', a['--candidate-dir'],
      '--output', out
    ]);
    const captured = JSON.parse(fs.readFileSync(path.join(out, 'receipt.json'), 'utf8'));
    if (captured.result !== 'MATCHED_OWNER_FRAME_CAPTURED_VISUAL_DISPOSITION_PENDING') throw Error('CAPTURE_NOT_COMPLETE');
    if (captured.views?.length !== 14 || captured.comparisons?.length !== 7) throw Error('PAIRED_CONTROL_SET_INCOMPLETE');
    for (const view of captured.views) {
      if (!view.glVersion?.includes('WebGL 2.0') || view.glError !== 0 ||
          view.contextLost !== false || !view.imageSha256 || !view.framebufferPresentations)
        throw Error('WEBGL2_CAPTURE_NOT_QUALIFIED:' + view.label + ':' + view.pose?.name);
    }
    inspect(a['--baseline-dir'], BASELINE_HEAD, BASELINE_BLOB);
    inspect(a['--candidate-dir'], CANDIDATE_HEAD, CANDIDATE_BLOB);
    record.result = 'WEBGL2_AB_CAPTURED_OWNER_VISUAL_DISPOSITION_PENDING';
    record.webgl2PixelsRendered = true;
    record.cases = captured.comparisons;
    record.frames = captured.views.map(x => ({label:x.label,pose:x.pose?.name,glVersion:x.glVersion,glError:x.glError,image:x.image,imageSha256:x.imageSha256}));
  } catch (error) {
    record.errors.push(String(error?.stack ?? error));
    throw error;
  } finally {
    persist(out, record);
  }
}
main().catch(e => { console.error(e); process.exitCode = 1; });

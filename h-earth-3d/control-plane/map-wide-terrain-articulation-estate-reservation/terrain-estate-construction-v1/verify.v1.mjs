#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE,
  evaluateHEarthMapWideEnvironmentTerrainCandidate,
  sampleHEarthMapWideEnvironmentTerrainCandidate
} from '../../../terrain/h-earth.terrain-estate-construction-v1.candidate.js';
import { evaluateHEarthMapWideEnvironmentPrecinct } from '../../../zones/h-earth.gratitude-region-mirror-manor-precinct.v1.js';
import { evaluateHEarthMapWideEnvironmentPresentation } from '../../../environment/h-earth.gratitude-region-mirror-manor-estate.v1.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const CONTROL = 'h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/terrain-estate-construction-v1';
const GOVERNING_HEAD = '3f51f0cd159df33571905c6cb14253ebdd137e3b';
const LOCK_GENERATION = 422;
const SCOPE_HASH = '205da80d5647b2323d970d0232c425ef47ebb653e5fc2f0a981aa8896681cdb3';
const POSITIVE_REFERENCE = '97003e9de386a8962fb46d0b370005b900a167d6';
const RECEIPTS = new Set([
  `${CONTROL}/receipts/builder.receipt.v1.json`,
  `${CONTROL}/receipts/fresh-role3.receipt.v1.json`,
  `${CONTROL}/receipts/role5-integrated-environment.receipt.v1.json`,
  `${CONTROL}/receipts/user-differential.receipt.v1.json`,
  `${CONTROL}/receipts/operation-closure.receipt.v1.json`
]);

const stable = (value) => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]))
    : value;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const text = (value) => JSON.stringify(stable(value), null, 2) + '\n';
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const sameSet = (a, b) => JSON.stringify([...new Set(a)].sort()) === JSON.stringify([...new Set(b)].sort());
const check = (checks, id, pass, detail = null) => { checks[id] = { pass: Boolean(pass), detail }; };

function parseArgs(argv) {
  const out = { role: 'BUILDER', output: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--role') out.role = argv[++i] ?? 'BUILDER';
    else if (argv[i] === '--output') out.output = argv[++i] ?? null;
    else throw new Error(`UNKNOWN_ARGUMENT:${argv[i]}`);
  }
  return out;
}

function readJson(repositoryPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, repositoryPath), 'utf8'));
}

function fingerprint(paths) {
  const hash = crypto.createHash('sha256');
  hash.update(`governing=${GOVERNING_HEAD}\nlock=${LOCK_GENERATION}\nscope=${SCOPE_HASH}\n`);
  for (const repositoryPath of [...paths].sort()) {
    const bytes = fs.readFileSync(path.join(ROOT, repositoryPath));
    hash.update(repositoryPath);
    hash.update('\0');
    hash.update(bytes);
    hash.update('\0');
  }
  return hash.digest('hex');
}

export async function runHEarthMapWideEnvironmentRedevelopmentVerification({ role = 'BUILDER', output = null } = {}) {
  const checks = {};
  const issues = [];
  const manifestPath = `${CONTROL}/changed-path-manifest.v1.json`;
  const manifest = readJson(manifestPath);
  const exactPaths = manifest.exactPaths;
  const head = git('rev-parse', 'HEAD');
  const mergeBase = git('merge-base', GOVERNING_HEAD, head);
  const changed = git('diff', '--name-only', `${GOVERNING_HEAD}..${head}`)
    .split('\n').map((v) => v.trim()).filter(Boolean);

  check(checks, 'GOVERNING_ANCESTRY', mergeBase === GOVERNING_HEAD, { mergeBase, governingHead: GOVERNING_HEAD });
  check(checks, 'EXACT_PATH_COUNT', Array.isArray(exactPaths) && exactPaths.length === 28, exactPaths?.length ?? null);
  check(checks, 'EXACT_28_PATH_DELTA', sameSet(changed, exactPaths) && changed.length === 28, { changedCount: changed.length });
  check(checks, 'ALL_PATHS_MATERIALIZED', exactPaths.every((p) => fs.existsSync(path.join(ROOT, p))));
  check(checks, 'NO_MANOR_GEOMETRY_PATH', !changed.some((p) => /mirror-manor-geometry|authoring\/h-earth\.mirror-manor/i.test(p)));
  check(checks, 'NO_OUTSIDE_LIVE_SURFACE', !changed.some((p) => p.startsWith('.github/') || /live-gpu-binding|persistent-live-renderer|navigation|water/i.test(p)));

  const terrain = evaluateHEarthMapWideEnvironmentTerrainCandidate();
  const precinct = evaluateHEarthMapWideEnvironmentPrecinct();
  const environment = evaluateHEarthMapWideEnvironmentPresentation();
  check(checks, 'TERRAIN_EVALUATION', terrain.eligible === true, terrain.issues);
  check(checks, 'PRECINCT_EVALUATION', precinct.result === 'PASS', precinct.issues);
  check(checks, 'ENVIRONMENT_EVALUATION', environment.result === 'PASS', environment.issues);

  const profile = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE;
  const virtual = profile.virtualNormalRelief;
  check(checks, 'POSITIVE_REFERENCE', profile.sourceIdentity?.commit === POSITIVE_REFERENCE, profile.sourceIdentity);
  check(checks, 'THREE_DIRECTIONAL_PHASES', virtual.directionalPhases?.length === 3, virtual.directionalPhases?.length);
  check(checks, 'RELIEF_AMPLITUDE_0_22', virtual.virtualReliefHeightAmplitude === 0.22, virtual.virtualReliefHeightAmplitude);
  check(checks, 'NORMAL_DEVIATION_22', virtual.maximumNormalDeviationDegrees === 22, virtual.maximumNormalDeviationDegrees);
  check(checks, 'RELIEF_FULL_120', virtual.distanceEnvelope?.fullInfluenceThrough === 120, virtual.distanceEnvelope);
  check(checks, 'RELIEF_ZERO_300', virtual.distanceEnvelope?.zeroInfluenceBy === 300, virtual.distanceEnvelope);

  const protectedSamples = [
    ['ESTATE', 80, -172],
    ['ENTRY', 0, -96],
    ['LOW_CORRIDOR', 112.41666666666667, -194.83333333333334]
  ].map(([id, x, z]) => ({ id, sample: sampleHEarthMapWideEnvironmentTerrainCandidate(x, z) }));
  for (const witness of protectedSamples) {
    check(checks, `${witness.id}_VALID`, witness.sample.valid === true, witness.sample.status);
    check(checks, `${witness.id}_ZERO_PRESENTATION_OFFSET`, Math.abs(witness.sample.presentationReliefOffset ?? Infinity) <= 1e-9, witness.sample.presentationReliefOffset);
    check(checks, `${witness.id}_RUN8B_TRUTH_UNCHANGED`, witness.sample.geometricElevationMutated === false);
    check(checks, `${witness.id}_NO_MANOR`, witness.sample.manorGeometryConstructed === false);
  }

  const proof = readJson(`${CONTROL}/proof-contract.v1.json`);
  check(checks, 'PROOF_CONTRACT_LOCK', proof.lockGeneration === LOCK_GENERATION && proof.scopeHash === SCOPE_HASH);
  const previewPaths = [
    'showroom/globe/h-earth/terrain-estate-construction-v1/index.html',
    'showroom/globe/h-earth/terrain-estate-construction-v1/app.mjs',
    'showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs',
    'showroom/globe/h-earth/terrain-estate-construction-v1/styles.css',
    'showroom/globe/h-earth/terrain-estate-construction-v1/observer.mjs'
  ];
  const previewText = previewPaths.map((p) => fs.readFileSync(path.join(ROOT, p), 'utf8')).join('\n');
  check(checks, 'PREVIEW_ALL_FILES_PRESENT', previewPaths.every((p) => fs.existsSync(path.join(ROOT, p))));
  check(checks, 'PREVIEW_NONPUBLIC_LABEL', /NONPUBLIC/i.test(previewText));
  check(checks, 'PREVIEW_NO_REMOTE_RUNTIME_DEPENDENCY', !/https?:\/\//i.test(previewText));
  check(checks, 'PREVIEW_WEBGL2', /webgl2/i.test(previewText));
  check(checks, 'PREVIEW_NO_MANOR_GEOMETRY', !/createManor|buildManor|manorMesh|manorGeometryConstructed\s*:\s*true/i.test(previewText));

  const failed = Object.entries(checks).filter(([, value]) => value.pass !== true);
  issues.push(...failed.map(([id]) => id));
  const constructionPaths = exactPaths.filter((p) => !RECEIPTS.has(p));
  const constructionFingerprint = fingerprint(constructionPaths);
  const receipt = stable({
    schema: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_VERIFICATION_RECEIPT_v1',
    result: issues.length === 0 ? 'PASS' : 'FAIL_CLOSED',
    verifierRole: role,
    operationId: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_v1',
    lockGeneration: LOCK_GENERATION,
    scopeHash: SCOPE_HASH,
    governingHead: GOVERNING_HEAD,
    candidateHead: head,
    exactPathCount: exactPaths.length,
    changedPathCount: changed.length,
    constructionFingerprint,
    fingerprintPathCount: constructionPaths.length,
    receiptFilesExcludedFromFingerprint: [...RECEIPTS].sort(),
    checks,
    issues
  });

  if (output) {
    fs.mkdirSync(output, { recursive: true });
    fs.writeFileSync(path.join(output, `${role.toLowerCase().replaceAll('_', '-')}.verification-receipt.v1.json`), text(receipt));
  }
  return receipt;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const receipt = await runHEarthMapWideEnvironmentRedevelopmentVerification(args);
  process.stdout.write(text(receipt));
  if (receipt.result !== 'PASS') process.exitCode = 1;
}

const invoked = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (invoked) main().catch((error) => {
  process.stderr.write(text({ schema: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_VERIFIER_FAILURE_v1', result: 'FAIL_CLOSED', error: error.message }));
  process.exitCode = 1;
});

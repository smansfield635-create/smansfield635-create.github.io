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
import { buildHEarthMapWideEnvironmentPreviewObserverReceipt } from '../../../../showroom/globe/h-earth/terrain-estate-construction-v1/observer.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const CONTROL = 'h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/terrain-estate-construction-v1';
const GOVERNING_HEAD = '3f51f0cd159df33571905c6cb14253ebdd137e3b';
const LOCK_GENERATION = 422;
const SCOPE_HASH = '205da80d5647b2323d970d0232c425ef47ebb653e5fc2f0a981aa8896681cdb3';
const POSITIVE_REFERENCE = '97003e9de386a8962fb46d0b370005b900a167d6';
const EXPECTED_RUN8B_BLOB = '0bd36eec01a75311bf6441d575bae5a057195bbc';
const RECEIPTS = new Set([
  `${CONTROL}/receipts/builder.receipt.v1.json`,
  `${CONTROL}/receipts/fresh-role3.receipt.v1.json`,
  `${CONTROL}/receipts/role5-integrated-environment.receipt.v1.json`,
  `${CONTROL}/receipts/user-differential.receipt.v1.json`,
  `${CONTROL}/receipts/operation-closure.receipt.v1.json`
]);
const EXCLUDED_MANOR_PATHS = new Set([
  `${CONTROL}/mirror-manor-geometry.contract.v1.json`,
  'h-earth-3d/authoring/h-earth.mirror-manor-geometry.v1.js'
]);

const stable = (value) => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]))
    : value;
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
  const manifest = readJson(`${CONTROL}/changed-path-manifest.v1.json`);
  const exactPaths = Array.isArray(manifest.paths)
    ? manifest.paths
    : Array.isArray(manifest.exactPaths)
      ? manifest.exactPaths
      : [];
  const sourceIdentity = readJson(`${CONTROL}/source-identity-manifest.v1.json`);
  const proof = readJson(`${CONTROL}/proof-contract.v1.json`);
  const estatePlan = readJson(`${CONTROL}/estate-site-plan.v1.json`);
  const invariants = readJson(`${CONTROL}/protected-invariants.v1.json`);
  const head = git('rev-parse', 'HEAD');
  const mergeBase = git('merge-base', GOVERNING_HEAD, head);
  const changed = git('diff', '--name-only', `${GOVERNING_HEAD}..${head}`)
    .split('\n').map((value) => value.trim()).filter(Boolean);
  const statuses = git('diff', '--name-status', `${GOVERNING_HEAD}..${head}`)
    .split('\n').map((value) => value.trim()).filter(Boolean);
  const run8bBlob = git('hash-object', 'h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js');

  check(checks, 'GOVERNING_ANCESTRY', mergeBase === GOVERNING_HEAD, { mergeBase, governingHead: GOVERNING_HEAD });
  check(checks, 'MANIFEST_SCHEMA', manifest.schema === 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_CHANGED_PATH_MANIFEST_v1');
  check(checks, 'MANIFEST_LOCK', manifest.lockGeneration === LOCK_GENERATION && manifest.scopeHash === SCOPE_HASH);
  check(checks, 'EXACT_PATH_COUNT', exactPaths.length === 28 && manifest.pathCount === 28, exactPaths.length);
  check(checks, 'EXACT_28_PATH_DELTA', sameSet(changed, exactPaths) && changed.length === 28, { changedCount: changed.length });
  check(checks, 'ADDED_ONLY_BRANCH_DELTA', statuses.every((line) => line.startsWith('A\t')), statuses.filter((line) => !line.startsWith('A\t')));
  check(checks, 'ALL_PATHS_MATERIALIZED', exactPaths.every((repositoryPath) => fs.existsSync(path.join(ROOT, repositoryPath))));
  check(checks, 'NO_MANOR_GEOMETRY_PATH', !changed.some((repositoryPath) => EXCLUDED_MANOR_PATHS.has(repositoryPath)));
  check(checks, 'NO_OUTSIDE_LIVE_SURFACE', !changed.some((repositoryPath) =>
    repositoryPath.startsWith('.github/') ||
    /live-gpu-binding|persistent-live-renderer|navigation|water/i.test(repositoryPath)
  ));
  check(checks, 'RUN8B_BLOB_EXACT', run8bBlob === EXPECTED_RUN8B_BLOB, run8bBlob);

  const terrain = evaluateHEarthMapWideEnvironmentTerrainCandidate();
  const precinct = evaluateHEarthMapWideEnvironmentPrecinct();
  const environment = evaluateHEarthMapWideEnvironmentPresentation();
  const previewObserver = buildHEarthMapWideEnvironmentPreviewObserverReceipt(null);
  check(checks, 'TERRAIN_EVALUATION', terrain.eligible === true, terrain.issues);
  check(checks, 'PRECINCT_EVALUATION', precinct.result === 'PASS', precinct.issues);
  check(checks, 'ENVIRONMENT_EVALUATION', environment.result === 'PASS', environment.issues);
  check(checks, 'PREVIEW_OBSERVER', previewObserver.result === 'PASS', previewObserver.checks);

  const profile = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE;
  const virtual = profile.virtualNormalRelief;
  check(checks, 'POSITIVE_REFERENCE', profile.sourceIdentity?.commit === POSITIVE_REFERENCE, profile.sourceIdentity);
  check(checks, 'POSITIVE_REFERENCE_NOT_MERGED_MAIN', profile.sourceIdentity?.classification === 'POSITIVE_DESIGN_SOURCE_NOT_MERGED_MAIN_NOT_AUTOMATIC_TRANSPLANT');
  check(checks, 'THREE_DIRECTIONAL_PHASES', virtual.directionalPhases?.length === 3, virtual.directionalPhases?.length);
  check(checks, 'RELIEF_AMPLITUDE_0_22', virtual.virtualReliefHeightAmplitude === 0.22, virtual.virtualReliefHeightAmplitude);
  check(checks, 'NORMAL_DEVIATION_22', virtual.maximumNormalDeviationDegrees === 22, virtual.maximumNormalDeviationDegrees);
  check(checks, 'RELIEF_FULL_120', virtual.distanceEnvelope?.fullInfluenceThrough === 120, virtual.distanceEnvelope);
  check(checks, 'RELIEF_ZERO_300', virtual.distanceEnvelope?.zeroInfluenceBy === 300, virtual.distanceEnvelope);

  const estateCenter = sampleHEarthMapWideEnvironmentTerrainCandidate(80, -172);
  const estatePadWitnesses = [
    sampleHEarthMapWideEnvironmentTerrainCandidate(70, -180),
    sampleHEarthMapWideEnvironmentTerrainCandidate(90, -180),
    sampleHEarthMapWideEnvironmentTerrainCandidate(70, -164),
    sampleHEarthMapWideEnvironmentTerrainCandidate(90, -164)
  ];
  const preparedElevations = [estateCenter, ...estatePadWitnesses].map((sample) => sample.presentationElevation);
  check(checks, 'ESTATE_VALID', estateCenter.valid === true, estateCenter.status);
  check(checks, 'ESTATE_PHYSICALLY_PREPARED',
    estateCenter.sitePreparation?.fullyPrepared === true &&
    estateCenter.presentationElevation < estateCenter.elevation - 0.5,
    estateCenter.sitePreparation
  );
  check(checks, 'ESTATE_BUILDABLE_PAD_LEVEL',
    estatePadWitnesses.every((sample) => sample.sitePreparation?.fullyPrepared === true) &&
    Math.max(...preparedElevations) - Math.min(...preparedElevations) <= 1e-6,
    preparedElevations
  );
  check(checks, 'ESTATE_PLAN_GRADING_AUTHORIZED',
    estatePlan.terrainTreatment?.gradingAuthorized === true &&
    estatePlan.terrainTreatment?.foundationAuthorized === false &&
    estatePlan.terrainTreatment?.buildingGeometryAuthorized === false,
    estatePlan.terrainTreatment
  );
  check(checks, 'ESTATE_OVERLAY_NOT_REQUIRED',
    estatePlan.terrainTreatment?.overlayRequiredForSiteLegibility === false &&
    invariants.estateSite?.siteMustRemainLegibleWithoutOverlay === true
  );

  const nonEstateProtectedSamples = [
    ['ENTRY', 0, -96],
    ['LOW_CORRIDOR', 112.41666666666667, -194.83333333333334]
  ].map(([id, x, z]) => ({ id, sample: sampleHEarthMapWideEnvironmentTerrainCandidate(x, z) }));
  for (const witness of nonEstateProtectedSamples) {
    check(checks, `${witness.id}_VALID`, witness.sample.valid === true, witness.sample.status);
    check(checks, `${witness.id}_ZERO_PRESENTATION_OFFSET`, Math.abs(witness.sample.presentationReliefOffset ?? Infinity) <= 1e-9, witness.sample.presentationReliefOffset);
    check(checks, `${witness.id}_RUN8B_TRUTH_UNCHANGED`, witness.sample.geometricElevationMutated === false);
    check(checks, `${witness.id}_NO_MANOR`, witness.sample.manorGeometryConstructed === false);
  }

  const reliefWitnesses = [
    sampleHEarthMapWideEnvironmentTerrainCandidate(-64, -274),
    sampleHEarthMapWideEnvironmentTerrainCandidate(-184, -212),
    sampleHEarthMapWideEnvironmentTerrainCandidate(196, -252)
  ];
  check(checks, 'MATERIAL_PRESENTATION_RELIEF', reliefWitnesses.some((sample) =>
    sample.valid === true && Math.abs(sample.presentationReliefOffset) >= 4
  ), reliefWitnesses.map((sample) => sample.presentationReliefOffset));

  const sourceRun8B = sourceIdentity.sources?.find((source) => source.id === 'CURRENT_RUN8B_TERRAIN_TRUTH');
  const sourcePositive = sourceIdentity.sources?.find((source) => source.id === 'POSITIVE_BANDLIMITED_RELIEF_REFERENCE');
  check(checks, 'SOURCE_RUN8B_EXACT', sourceRun8B?.commit === GOVERNING_HEAD && sourceRun8B?.gitBlobSha === EXPECTED_RUN8B_BLOB);
  check(checks, 'SOURCE_POSITIVE_EXACT', sourcePositive?.commit === POSITIVE_REFERENCE && sourcePositive?.mergedMain === false && sourcePositive?.automaticTransplant === false);
  check(checks, 'PROOF_CONTRACT_LOCK', proof.lockGeneration === LOCK_GENERATION && proof.scopeHash === SCOPE_HASH);

  const previewPaths = [
    'showroom/globe/h-earth/terrain-estate-construction-v1/index.html',
    'showroom/globe/h-earth/terrain-estate-construction-v1/app.mjs',
    'showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs',
    'showroom/globe/h-earth/terrain-estate-construction-v1/styles.css',
    'showroom/globe/h-earth/terrain-estate-construction-v1/observer.mjs'
  ];
  const previewPresent = previewPaths.every((repositoryPath) => fs.existsSync(path.join(ROOT, repositoryPath)));
  check(checks, 'PREVIEW_ALL_FILES_PRESENT', previewPresent);
  if (previewPresent) {
    const previewText = previewPaths.map((repositoryPath) => fs.readFileSync(path.join(ROOT, repositoryPath), 'utf8')).join('\n');
    const appText = fs.readFileSync(path.join(ROOT, previewPaths[1]), 'utf8');
    const rendererText = fs.readFileSync(path.join(ROOT, previewPaths[2]), 'utf8');
    const htmlText = fs.readFileSync(path.join(ROOT, previewPaths[0]), 'utf8');
    check(checks, 'PREVIEW_NONPUBLIC_LABEL', /NONPUBLIC|nonpublic/i.test(previewText));
    check(checks, 'PREVIEW_NO_REMOTE_RUNTIME_DEPENDENCY', !/(?:src|href)=["']https?:\/\//i.test(previewText));
    check(checks, 'PREVIEW_WEBGL2_EXECUTION', /getContext\(['"]webgl2['"]/.test(rendererText) && /createProgram\(/.test(rendererText));
    check(checks, 'PREVIEW_V2_NORMAL_RELIEF_EXECUTION',
      /perturbTerrainNormal\(/.test(rendererText) &&
      /limitTerrainNormalDeviation\(/.test(rendererText) &&
      /3\.306939635357677/.test(rendererText) &&
      /2\.7318196987737333/.test(rendererText) &&
      /2\.243994752564138/.test(rendererText) &&
      /microReliefSignal\*0\.22/.test(rendererText) &&
      /0\.9271838545667874/.test(rendererText) &&
      /0\.3746065934159120/.test(rendererText) &&
      /smoothstep\(120\.0,300\.0,distanceToCamera\)/.test(rendererText)
    );
    check(checks, 'PREVIEW_STABLE_SINGLE_POINTER_ORBIT',
      /CAMERA_LIMITS/.test(rendererText) &&
      /minimumPitch:\s*0\.46/.test(rendererText) &&
      /maximumPitch:\s*1\.49/.test(rendererText) &&
      /safeDelta/.test(appText) &&
      /renderer\.orbit/.test(appText)
    );
    check(checks, 'PREVIEW_MOBILE_PINCH_AND_PAN',
      /pointers\.size === 2/.test(appText) &&
      /zoomByFactor/.test(appText) &&
      /panScreen/.test(appText)
    );
    check(checks, 'PREVIEW_RECOVERY_VIEWS',
      /fitWorld\(/.test(rendererText) &&
      /focusEstate\(/.test(rendererText) &&
      /topView\(/.test(rendererText) &&
      /data-fit-world/.test(htmlText) &&
      /data-estate-focus/.test(htmlText) &&
      /data-top-view/.test(htmlText)
    );
    check(checks, 'PREVIEW_GUIDES_OFF_BY_DEFAULT',
      /showEstate:\s*false/.test(rendererText) &&
      /showEntry:\s*false/.test(rendererText) &&
      /data-toggle-estate>/.test(htmlText) &&
      /data-toggle-entry>/.test(htmlText)
    );
    check(checks, 'PREVIEW_HIGHER_INSPECTION_DENSITY', /columns:\s*129/.test(rendererText) && /rows:\s*97/.test(rendererText));
    check(checks, 'PREVIEW_INTERACTIVE_3D_PRESENTATION', /presentationElevation/.test(previewText) && /orbit\(/.test(previewText));
    check(checks, 'PREVIEW_NO_MANOR_GEOMETRY', !/createManor|buildManor|manorMesh|manorGeometryConstructed\s*:\s*true/i.test(previewText));
  }

  const failed = Object.entries(checks).filter(([, value]) => value.pass !== true);
  issues.push(...failed.map(([id]) => id));
  const constructionPaths = exactPaths.filter((repositoryPath) => !RECEIPTS.has(repositoryPath));
  const constructionFingerprint = constructionPaths.every((repositoryPath) => fs.existsSync(path.join(ROOT, repositoryPath)))
    ? fingerprint(constructionPaths)
    : null;
  const receipt = stable({
    schema: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_VERIFICATION_RECEIPT_v1',
    result: issues.length === 0 ? 'PASS' : 'FAIL_CLOSED',
    verifierRole: role,
    operationId: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_v1',
    successorRepairRevision: 1,
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
  process.stderr.write(text({
    schema: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_VERIFIER_FAILURE_v1',
    result: 'FAIL_CLOSED',
    error: error instanceof Error ? error.message : String(error)
  }));
  process.exitCode = 1;
});

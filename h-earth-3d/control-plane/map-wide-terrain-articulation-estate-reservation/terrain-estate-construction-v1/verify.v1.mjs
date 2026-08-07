#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE,
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY,
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
const REVISION = 3;

const RECEIPTS = new Set([
  `${CONTROL}/receipts/builder.receipt.v1.json`,
  `${CONTROL}/receipts/fresh-role3.receipt.v1.json`,
  `${CONTROL}/receipts/role5-integrated-environment.receipt.v1.json`,
  `${CONTROL}/receipts/user-differential.receipt.v1.json`,
  `${CONTROL}/receipts/operation-closure.receipt.v1.json`
]);
const EXCLUDED_GEOMETRY_PATHS = new Set([
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
  hash.update(`governing=${GOVERNING_HEAD}\nlock=${LOCK_GENERATION}\nscope=${SCOPE_HASH}\nrevision=${REVISION}\n`);
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
  const manifest = readJson(`${CONTROL}/changed-path-manifest.v1.json`);
  const sourceIdentity = readJson(`${CONTROL}/source-identity-manifest.v1.json`);
  const proof = readJson(`${CONTROL}/proof-contract.v1.json`);
  const estatePlan = readJson(`${CONTROL}/estate-site-plan.v1.json`);
  const invariants = readJson(`${CONTROL}/protected-invariants.v1.json`);
  const terrainManifest = readJson('h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.manifest.json');
  const exactPaths = Array.isArray(manifest.paths) ? manifest.paths : [];

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
  check(checks, 'NO_EXCLUDED_MANOR_PATH', !changed.some((repositoryPath) => EXCLUDED_GEOMETRY_PATHS.has(repositoryPath)));
  check(checks, 'NO_OUTSIDE_LIVE_SURFACE', !changed.some((repositoryPath) =>
    repositoryPath.startsWith('.github/') ||
    /live-gpu-binding|persistent-live-renderer|navigation/i.test(repositoryPath)
  ));
  check(checks, 'RUN8B_BLOB_EXACT', run8bBlob === EXPECTED_RUN8B_BLOB, run8bBlob);

  check(checks, 'REVISION_BINDINGS',
    proof.successorRepairRevision === REVISION &&
    invariants.successorRepairRevision === REVISION &&
    estatePlan.successorRepairRevision === REVISION &&
    terrainManifest.successorRepairRevision === REVISION
  );
  check(checks, 'PROOF_CONTRACT_LOCK', proof.lockGeneration === LOCK_GENERATION && proof.scopeHash === SCOPE_HASH);

  const terrain = evaluateHEarthMapWideEnvironmentTerrainCandidate();
  const precinct = evaluateHEarthMapWideEnvironmentPrecinct();
  const environment = evaluateHEarthMapWideEnvironmentPresentation();
  const previewObserver = buildHEarthMapWideEnvironmentPreviewObserverReceipt(null, null);
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
  check(checks, 'AUTHORING_RELIEF_SCALE_0_42', virtual.authoringInspectorScale === 0.42, virtual.authoringInspectorScale);

  const entry = sampleHEarthMapWideEnvironmentTerrainCandidate(0, -96);
  const atrium = sampleHEarthMapWideEnvironmentTerrainCandidate(80, -172);
  const saddle = sampleHEarthMapWideEnvironmentTerrainCandidate(112.41666666666667, -194.83333333333334);
  const hillInterface = sampleHEarthMapWideEnvironmentTerrainCandidate(136, -208);
  const vaultMass = sampleHEarthMapWideEnvironmentTerrainCandidate(152, -224);
  const reservoir = sampleHEarthMapWideEnvironmentTerrainCandidate(-44, -216);
  const waterfall = sampleHEarthMapWideEnvironmentTerrainCandidate(-48, -250);
  const cavern = sampleHEarthMapWideEnvironmentTerrainCandidate(-16, -236);
  const rearMountain = sampleHEarthMapWideEnvironmentTerrainCandidate(-64, -310);

  check(checks, 'ENTRY_ZERO_PRESENTATION_OFFSET', entry.valid === true && Math.abs(entry.presentationReliefOffset) <= 1e-9, entry.presentationReliefOffset);
  check(checks, 'ATRIUM_CROWN_PREPARED', (atrium.sitePreparation?.zoneWeights?.atrium ?? 0) > 0.9, atrium.sitePreparation);
  check(checks, 'ESTATE_SADDLE_RESERVED', (saddle.sitePreparation?.zoneWeights?.connectiveSpine ?? 0) > 0.9, saddle.sitePreparation);
  check(checks, 'LARGE_HILL_INTERFACE_PREPARED', (hillInterface.sitePreparation?.zoneWeights?.hillInterface ?? 0) > 0.9, hillInterface.sitePreparation);
  check(checks, 'SECRET_VAULT_NO_SURFACE_GEOMETRY',
    vaultMass.valid === true && vaultMass.vaultInteriorConstructed === false && vaultMass.manorGeometryConstructed === false &&
    estatePlan.hiddenVaultReserve?.surfaceExpression === 'NONE'
  );
  check(checks, 'RESERVOIR_ENCLOSED',
    (reservoir.hydrology?.reservoirWeight ?? 0) > 0.9 &&
    reservoir.hydrology?.enclosedReservoir === true &&
    reservoir.hydrology?.visibleDrainageToCoast === false
  );
  check(checks, 'WATERFALL_CORRIDOR_PRESENT', (waterfall.hydrology?.waterfallWeight ?? 0) > 0.5, waterfall.hydrology);
  check(checks, 'CAVERN_EXTERIOR_RESERVE_PRESENT',
    (cavern.hydrology?.cavernReserveWeight ?? 0) > 0.5 && cavern.cavernInteriorConstructed === false,
    cavern.hydrology
  );
  check(checks, 'REAR_MOUNTAIN_BOUNDARY_PRESENT', rearMountain.rearBoundaryBarrierOffset > 2, rearMountain.rearBoundaryBarrierOffset);
  check(checks, 'HYDROLOGY_MODEL_BINDING',
    H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.reservoir.enclosed === true &&
    H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.reservoir.visibleDrainageToCoast === false &&
    H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.hiddenInfrastructure.constructed === false
  );

  check(checks, 'ESTATE_PLAN_MULTI_HILL',
    estatePlan.estateExtent?.singleSquareOrRectangularFootprint === false &&
    estatePlan.estateExtent?.extendsAcrossBothHills === true &&
    estatePlan.atrium?.surfaceRole === 'HIGH_CROWN_ATRIUM_WITH_360_DEGREE_VIEW'
  );
  check(checks, 'INVARIANTS_SUPERSEDE_OLD_PAD',
    invariants.estateSite?.singleSquarePadIsFinalFootprint === false &&
    Array.isArray(invariants.supersededPriorAssumptions) &&
    invariants.supersededPriorAssumptions.includes('LOW_SADDLE_REQUIRED_TO_REMAIN_PERMANENTLY_EMPTY')
  );

  const sourceRun8B = sourceIdentity.sources?.find((source) => source.id === 'CURRENT_RUN8B_TERRAIN_TRUTH');
  const sourcePositive = sourceIdentity.sources?.find((source) => source.id === 'POSITIVE_BANDLIMITED_RELIEF_REFERENCE');
  check(checks, 'SOURCE_RUN8B_EXACT', sourceRun8B?.commit === GOVERNING_HEAD && sourceRun8B?.gitBlobSha === EXPECTED_RUN8B_BLOB);
  check(checks, 'SOURCE_POSITIVE_EXACT', sourcePositive?.commit === POSITIVE_REFERENCE && sourcePositive?.mergedMain === false && sourcePositive?.automaticTransplant === false);

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
    const htmlText = fs.readFileSync(path.join(ROOT, previewPaths[0]), 'utf8');
    const appText = fs.readFileSync(path.join(ROOT, previewPaths[1]), 'utf8');
    const rendererText = fs.readFileSync(path.join(ROOT, previewPaths[2]), 'utf8');

    check(checks, 'PREVIEW_NONPUBLIC_LABEL', /NONPUBLIC|nonpublic/i.test(previewText));
    check(checks, 'PREVIEW_NO_REMOTE_RUNTIME_DEPENDENCY', !/(?:src|href)=["']https?:\/\//i.test(previewText));
    check(checks, 'PREVIEW_WEBGL2_EXECUTION', /getContext\(['"]webgl2['"]/.test(rendererText) && /createProgram\(/.test(rendererText));
    check(checks, 'PREVIEW_ACCEPTED_V2_SOURCE_RELIEF',
      /SOURCE_RELIEF_AMPLITUDE=0\.22/.test(rendererText) &&
      /INSPECTOR_RELIEF_SCALE=0\.42/.test(rendererText) &&
      /0\.9271838545667874/.test(rendererText) &&
      /0\.3746065934159120/.test(rendererText) &&
      /smoothstep\(120\.0,300\.0,distanceToCamera\)/.test(rendererText)
    );
    check(checks, 'PREVIEW_SMOOTHER_STEEP_SURFACE_PRESENTATION',
      /steepSurfaceSuppression/.test(rendererText) &&
      /verticalScale:\s*1\.35/.test(rendererText)
    );
    check(checks, 'PREVIEW_HIGH_DENSITY_TERRAIN', /columns:\s*161/.test(rendererText) && /rows:\s*121/.test(rendererText));
    check(checks, 'PREVIEW_STATIC_WATER_CONTEXT',
      /buildWaterContextMesh\(/.test(rendererText) &&
      /WATER_VS/.test(rendererText) &&
      /reservoirTriangleCount/.test(rendererText) &&
      /waterfallTriangleCount/.test(rendererText) &&
      /oceanTriangleCount/.test(rendererText)
    );
    check(checks, 'PREVIEW_STABLE_SINGLE_POINTER_ORBIT',
      /minimumPitch:\s*0\.46/.test(rendererText) &&
      /maximumPitch:\s*1\.49/.test(rendererText) &&
      /safeDelta/.test(appText) &&
      /renderer\.orbit/.test(appText)
    );
    check(checks, 'PREVIEW_MOBILE_PINCH_AND_PAN',
      /pointers\.size === 2/.test(appText) && /zoomByFactor/.test(appText) && /panScreen/.test(appText)
    );
    check(checks, 'PREVIEW_FIT_WORLD_RECOVERY', /fitWorld\(/.test(rendererText) && /data-fit-world/.test(htmlText));
    check(checks, 'PREVIEW_GUIDE_RENDER_PATH_ABSENT',
      !/LINE_VS|LINE_FS|rectangleLine|drawLine|showEstate|showEntry/.test(rendererText) &&
      !/data-toggle-estate|data-toggle-entry/.test(htmlText)
    );
    check(checks, 'PREVIEW_NO_DEFERRED_GEOMETRY',
      !/createManor|buildManor|manorMesh|vaultInteriorConstructed\s*:\s*true|cavernInteriorConstructed\s*:\s*true/i.test(previewText)
    );
  }

  const failed = Object.entries(checks).filter(([, value]) => value.pass !== true);
  const issues = failed.map(([id]) => id);
  const constructionPaths = exactPaths.filter((repositoryPath) => !RECEIPTS.has(repositoryPath));
  const constructionFingerprint = constructionPaths.every((repositoryPath) => fs.existsSync(path.join(ROOT, repositoryPath)))
    ? fingerprint(constructionPaths)
    : null;

  const receipt = stable({
    schema: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_VERIFICATION_RECEIPT_v1',
    result: issues.length === 0 ? 'PASS' : 'FAIL_CLOSED',
    verifierRole: role,
    operationId: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_v1',
    successorRepairRevision: REVISION,
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
if (invoked) {
  main().catch((error) => {
    process.stderr.write(text({
      schema: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_VERIFIER_FAILURE_v1',
      result: 'FAIL_CLOSED',
      error: error instanceof Error ? error.message : String(error)
    }));
    process.exitCode = 1;
  });
}

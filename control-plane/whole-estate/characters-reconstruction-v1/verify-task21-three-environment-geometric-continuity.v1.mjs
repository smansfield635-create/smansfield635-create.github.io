#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const auditPath = 'control-plane/whole-estate/characters-reconstruction-v1/task21-three-environment-geometric-continuity-audit.v1.json';
const verifierPath = 'control-plane/whole-estate/characters-reconstruction-v1/verify-task21-three-environment-geometric-continuity.v1.mjs';
const expectedPaths = [auditPath, verifierPath].sort();
const expectedBase = '8f8b8224601d990f058dc91438a60a5b245a6539';
const donor = '9cf64161dfc647021ff3f3871d6655ac5400ae12';
const argument = (name, fallback) => {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
};
const requestedBase = argument('--base', expectedBase);
const requestedCandidate = argument('--candidate', 'HEAD');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const resolveCommit = (ref) => { try { return git('rev-parse', `${ref}^{commit}`); } catch { return null; } };
const blobAt = (ref, file) => { try { return git('rev-parse', `${ref}:${file}`); } catch { return null; } };
const show = (ref, file) => git('show', `${ref}:${file}`);
const checks = [];
const failures = [];
const record = (id, ok, detail = '', phase = 'AUDIT') => {
  const row = { id, ok, detail, phase };
  checks.push(row);
  if (!ok) failures.push(row);
};
const near = (left, right, tolerance = 1e-9) => Number.isFinite(left) && Number.isFinite(right) && Math.abs(left - right) <= tolerance;

const base = resolveCommit(requestedBase);
const candidate = resolveCommit(requestedCandidate);
record('REQUESTED_BASE_IS_GOVERNING_BASE', requestedBase === expectedBase, requestedBase, 'CUSTODY');
record('EXACT_GOVERNING_BASE_RESOLVES', base === expectedBase, base ?? 'UNRESOLVED', 'CUSTODY');
record('CANDIDATE_RESOLVES', Boolean(candidate), candidate ?? 'UNRESOLVED', 'CUSTODY');

let audit = null;
if (candidate) {
  try { audit = JSON.parse(show(candidate, auditPath)); }
  catch (error) { record('AUDIT_JSON_READABLE_AT_CANDIDATE', false, String(error), 'CUSTODY'); }
}
record('AUDIT_JSON_READABLE_AT_CANDIDATE', Boolean(audit), audit?.schema ?? 'UNREADABLE', 'CUSTODY');

if (base && candidate && audit) {
  const diffNames = git('diff', '--name-only', base, candidate).split(/\r?\n/).filter(Boolean).sort();
  record('EXACT_TWO_PATH_DELTA', JSON.stringify(diffNames) === JSON.stringify(expectedPaths), JSON.stringify(diffNames), 'MUTATION_BOUNDARY');
  record('NO_PRODUCT_PATH_MUTATION', diffNames.every((file) => file.startsWith('control-plane/whole-estate/characters-reconstruction-v1/')), JSON.stringify(diffNames), 'MUTATION_BOUNDARY');
  record('LOCK_GENERATION_1924', audit.admission?.lockGeneration === 1924, String(audit.admission?.lockGeneration), 'CUSTODY');
  record('OPERATION_ID_BOUND', audit.operationId === 'CHARACTERS_TASK21_THREE_ENVIRONMENT_GEOMETRIC_CONTINUITY_AUDIT_20260902_001', audit.operationId, 'CUSTODY');
  record('LOCK_SCOPE_BOUND', audit.admission?.lockScope === 'CHARACTERS:TASK21:THREE_ENVIRONMENT_GEOMETRIC_CONTINUITY_AUDIT:V1', audit.admission?.lockScope, 'CUSTODY');
  record('ALLOWED_PATHS_EXACT', JSON.stringify([...audit.admission.allowedPaths].sort()) === JSON.stringify(expectedPaths), JSON.stringify(audit.admission.allowedPaths), 'CUSTODY');

  const protectedSources = [
    ['CHARACTERS_INDEX', 'characters/index.html', 'e122d09cb9d41410492f16c5f33dc598d1710504'],
    ['CHARACTERS_APP', 'characters/app.mjs', '6f6d126cf4dbfc198ed950c917bfc1c3c44d345e'],
    ['CHARACTERS_NARRATIVE', 'characters/narrative-world-state.mjs', '946a10969803693c8163abb85d1fdf65ed8bcca2'],
    ['CHARACTERS_NIGHT', 'characters/night-renderer.mjs', 'cb0eaa23a9699985f7c69f5c17e916847a66ef0e']
  ];
  for (const [id, file, expected] of protectedSources) {
    record(`BASELINE_${id}_BASE`, blobAt(base, file) === expected, `${file}:${blobAt(base, file)}`, 'BASELINE');
    record(`BASELINE_${id}_CANDIDATE`, blobAt(candidate, file) === expected, `${file}:${blobAt(candidate, file)}`, 'BASELINE');
    record(`BASELINE_${id}_DONOR`, blobAt(donor, file) === expected, `${file}:${blobAt(donor, file)}`, 'BASELINE');
  }
  record('H_EARTH_EXPERIENCE_ANCHOR_BOUND', audit.protectedBaseline?.hEarthExperienceAnchor?.sha256 === '7757fb4fe731456b3058ec595369133f5c2136c99b282eb6b4df108600bca573', audit.protectedBaseline?.hEarthExperienceAnchor?.sha256, 'BASELINE');

  const sourceBlobs = [
    ['AUDRALIA_ROUTE', 'showroom/globe/audralia/index.html', '96bf20a3189182683bc94c08e2ad7c0dba740f07'],
    ['AUDRALIA_APP', 'inspection/audralia-24057-exact/snapshot/showroom/globe/audralia/weather-presentation-reconciliation/app.mjs', '64b962fcdb098ffa1f3149a434ad1bfcdc4e21d3'],
    ['AUDRALIA_SNAPSHOT_TRANSFER', 'inspection/audralia-24057-exact/snapshot/h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js', '50991dd777ccd015fd8a6d8eae7b4d02b4a8450c'],
    ['CURRENT_TRANSFER', 'h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js', 'a67a4e95f7634eb97a375ff103d95bdc81c64f0b'],
    ['CURRENT_TERRAIN', 'h-earth-3d/terrain/h-earth.terrain-field.js', 'f4f65b05ab303a11fb1d9c4e25de211fde73722a'],
    ['CURRENT_MANIFOLD', 'h-earth-3d/terrain/h-earth.world-manifold-domain.js', '09ceab4505c52c8bede19afb77343fc1f7ed2d7f'],
    ['H_EARTH_REDIRECT', 'showroom/globe/h-earth/index.html', '40573b1f3ae4221585685e30f170dd721d25797e'],
    ['H_EARTH_LIVE_SHELL', 'h-earth-live-6d18e158/showroom/globe/h-earth/index.html', 'f4fa5df980c639184352d978909532dc8f1bcbd8'],
    ['H_EARTH_LIVE_TERRAIN', 'h-earth-live-6d18e158/h-earth-3d/terrain/h-earth.terrain-field.js', 'f4f65b05ab303a11fb1d9c4e25de211fde73722a'],
    ['H_EARTH_LIVE_MANIFOLD', 'h-earth-live-6d18e158/h-earth-3d/terrain/h-earth.world-manifold-domain.js', '09ceab4505c52c8bede19afb77343fc1f7ed2d7f'],
    ['CHARACTERS_ADAPTER', 'characters/gratitude-geography.adapter.mjs', '8e094b2beed8117f6322ca18d9b592949998aac4']
  ];
  for (const [id, file, expected] of sourceBlobs) record(`SOURCE_${id}`, blobAt(base, file) === expected && blobAt(candidate, file) === expected, `${file}:${blobAt(candidate, file)}`, 'SOURCE_INVENTORY');
  record('MAP_AND_CURRENT_TRANSFERS_DISTINCT', blobAt(base, sourceBlobs[2][1]) !== blobAt(base, sourceBlobs[3][1]), `${blobAt(base, sourceBlobs[2][1])}:${blobAt(base, sourceBlobs[3][1])}`, 'SOURCE_INVENTORY');
  record('H_EARTH_LIVE_AND_CURRENT_TERRAIN_EXACT', blobAt(base, sourceBlobs[4][1]) === blobAt(base, sourceBlobs[8][1]), '', 'SOURCE_INVENTORY');
  record('H_EARTH_LIVE_AND_CURRENT_MANIFOLD_EXACT', blobAt(base, sourceBlobs[5][1]) === blobAt(base, sourceBlobs[9][1]), '', 'SOURCE_INVENTORY');

  const charactersApp = show(base, 'characters/app.mjs');
  const audraliaRoute = show(base, 'showroom/globe/audralia/index.html');
  const hEarthRedirect = show(base, 'showroom/globe/h-earth/index.html');
  record('CHARACTERS_RUNTIME_ADAPTER_BYPASS_PROVEN', !charactersApp.includes("./gratitude-geography.adapter.mjs") && /const COAST=/.test(charactersApp) && /function shorelineZ\(/.test(charactersApp) && /function terrainHeight\(/.test(charactersApp), '', 'IMPORT_GRAPH');
  record('AUDRALIA_ROUTE_SNAPSHOT_BINDING_PROVEN', audraliaRoute.includes('/inspection/audralia-24057-exact/snapshot/showroom/globe/audralia/weather-presentation-reconciliation/app.mjs'), '', 'IMPORT_GRAPH');
  record('H_EARTH_REDIRECT_BINDING_PROVEN', hEarthRedirect.includes('/h-earth-live-6d18e158/showroom/globe/h-earth/index.html'), '', 'IMPORT_GRAPH');

  record('EIGHT_STEPS_COMPLETE', audit.steps?.length === 8 && audit.steps.every((step, index) => step.number === index + 1 && step.status === 'COMPLETE'), JSON.stringify(audit.steps?.map(({ number, status }) => ({ number, status }))), 'COMPLETENESS');
  record('ELEVEN_LANDMARKS_REGISTERED', audit.landmarkRegistry?.length === 11, `count=${audit.landmarkRegistry?.length}`, 'LANDMARKS');
  record('EIGHT_SHARED_AND_THREE_LOCAL', audit.landmarkRegistry?.filter((item) => item.runtimeBinding === 'COORDINATE_DUPLICATED_LOCAL_TERRAIN').length === 8 && audit.landmarkRegistry?.filter((item) => item.runtimeBinding === 'UNRESOLVED_TO_SHARED_ADAPTER').length === 3, '', 'LANDMARKS');
  record('CONCORDANCE_COVERS_THREE_ENVIRONMENTS', audit.concordanceMatrix?.length >= 9 && audit.concordanceMatrix.every((row) => 'audraliaMap' in row && 'hEarth' in row && 'characters' in row), `count=${audit.concordanceMatrix?.length}`, 'CONCORDANCE');
  record('EIGHT_DISCREPANCIES_RECORDED', audit.discrepancyLedger?.length === 8, `count=${audit.discrepancyLedger?.length}`, 'DISCREPANCIES');
  record('CRITICAL_BLOCKERS_NOT_CLOSED', audit.discrepancyLedger?.filter((item) => item.severity === 'CRITICAL').length === 6 && audit.discrepancyLedger.filter((item) => item.severity === 'CRITICAL').every((item) => item.disposition !== 'RESOLVED'), '', 'DISCREPANCIES');
  record('EIGHT_DECISIONS_FROZEN', audit.decisionLog?.length === 8, `count=${audit.decisionLog?.length}`, 'DECISIONS');
  record('NO_PREMATURE_SOURCE_CANONICALIZATION', audit.decisionLog?.some((item) => item.id === 'DEC-003' && item.decision.includes('Do not choose')), '', 'DECISIONS');

  const spec = audit.frozenConstructionSpecification;
  record('STEP9_SPEC_FROZEN_AND_NOT_AUTHORIZED', spec?.status === 'FROZEN_NOT_AUTHORIZED_TO_EXECUTE', spec?.status, 'CONSTRUCTION_SPEC');
  record('STEP9_ENTRY_GATES_COMPLETE', spec?.entryPreconditions?.length === 6 && spec.entryPreconditions.some((item) => item.includes('registry preflight returns PASS')), `count=${spec?.entryPreconditions?.length}`, 'CONSTRUCTION_SPEC');
  record('SINGLE_GEOGRAPHY_SOURCE_REQUIRED', spec?.constructionShape?.some((item) => item.includes('one immutable geography-source binding')) && spec?.hardInvariants?.includes('NO_RUNTIME_LOCAL_SECOND_COASTLINE_OR_TERRAIN_EQUATION'), '', 'CONSTRUCTION_SPEC');
  record('EXACT_GEOMETRY_THRESHOLDS', spec?.quantitativeAcceptance?.shorelineWitnessToleranceWorldUnits === 1e-9 && spec?.quantitativeAcceptance?.terrainElevationWitnessToleranceWorldUnits === 1e-9 && spec?.quantitativeAcceptance?.sharedLandmarkXZToleranceWorldUnits === 1e-9, JSON.stringify(spec?.quantitativeAcceptance), 'CONSTRUCTION_SPEC');
  record('BROWSER_AND_OWNER_QUALIFICATION_REQUIRED', spec?.qualificationMatrix?.some((item) => item.includes('Desktop WebGL2')) && spec?.qualificationMatrix?.some((item) => item.includes('Phone-size WebGL2')) && spec?.qualificationMatrix?.some((item) => item.includes('Owner visual acceptance')), '', 'CONSTRUCTION_SPEC');
  record('ROLLBACK_ANCHORS_COMPLETE', spec?.rollbackAnchors?.charactersDonorCommit === donor && spec?.rollbackAnchors?.hEarthExperienceAnchorSha256 === '7757fb4fe731456b3058ec595369133f5c2136c99b282eb6b4df108600bca573', '', 'CONSTRUCTION_SPEC');
  record('STOP_CONDITIONS_PRESENT', spec?.stopConditions?.length === 8, `count=${spec?.stopConditions?.length}`, 'CONSTRUCTION_SPEC');

  const registry = audit.validationEvidence?.hEarthRegistryPreflight;
  record('REGISTRY_STOP_TRUTHFULLY_RECORDED', registry?.finalDisposition === 'STOP' && registry?.mutationMayProceed === false && registry?.failureCode === 'REQUESTED_PATH_UNRESOLVED', JSON.stringify(registry), 'VALIDATION');
  record('VALIDATOR_FAILURES_TRUTHFULLY_RECORDED', audit.validationEvidence?.audraliaCurrentConvergence?.result === 'FAIL' && audit.validationEvidence?.coordinateReconciliationHarness?.result === 'CRASH' && audit.validationEvidence?.mirrorManorReconciliation?.result === 'CRASH', '', 'VALIDATION');
  record('VISUAL_PARITY_NOT_CLAIMED', audit.validationEvidence?.publicBrowserObservation?.visualParityConclusion === 'INCONCLUSIVE' && audit.completion?.visualParityClaimed === false, '', 'VALIDATION');

  try {
    const cacheKey = `task21-${Date.now()}`;
    const currentModule = await import(`${pathToFileURL(path.join(root, 'h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js')).href}?${cacheKey}-current`);
    const mapModule = await import(`${pathToFileURL(path.join(root, 'inspection/audralia-24057-exact/snapshot/h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js')).href}?${cacheKey}-map`);
    const samples = [];
    for (let x = -1500; x <= 1480; x += 10) {
      const current = currentModule.resolveAudraliaGratitudeShorelineZ(x);
      const map = mapModule.resolveAudraliaGratitudeShorelineZ(x);
      samples.push({ x, current, map, absoluteDelta: Math.abs(map - current) });
    }
    const meanAbsoluteDelta = samples.reduce((sum, sample) => sum + sample.absoluteDelta, 0) / samples.length;
    const maximum = samples.reduce((left, right) => right.absoluteDelta > left.absoluteDelta ? right : left);
    const protectedCore = samples.filter((sample) => sample.x >= -256 && sample.x <= 256);
    record('MEASURED_299_SHORELINE_SAMPLES', samples.length === 299, `count=${samples.length}`, 'MEASUREMENT');
    record('MEASURED_MAP_CURRENT_MEAN_DELTA', near(meanAbsoluteDelta, audit.measurements.audraliaSnapshotVersusCurrentTransfer.shoreline.meanAbsoluteDelta, 1e-9), `${meanAbsoluteDelta}`, 'MEASUREMENT');
    record('MEASURED_MAP_CURRENT_MAX_DELTA', maximum.x === 840 && near(maximum.absoluteDelta, audit.measurements.audraliaSnapshotVersusCurrentTransfer.shoreline.maximumAbsoluteDelta, 1e-9), JSON.stringify(maximum), 'MEASUREMENT');
    record('MEASURED_PROTECTED_CORE_EXACT', protectedCore.length === 51 && protectedCore.every((sample) => near(sample.current, sample.map, 1e-9)), `count=${protectedCore.length}`, 'MEASUREMENT');
  } catch (error) {
    record('EXECUTABLE_TRANSFER_COMPARISON', false, String(error), 'MEASUREMENT');
  }

  try {
    const adapterModule = await import(`${pathToFileURL(path.join(root, 'characters/gratitude-geography.adapter.mjs')).href}?task21=${Date.now()}`);
    const manifoldModule = await import(`${pathToFileURL(path.join(root, 'h-earth-3d/terrain/h-earth.world-manifold-domain.js')).href}?task21=${Date.now()}`);
    const adapterReceipt = adapterModule.evaluateGratitudeGeographyCorrespondence();
    const manifoldReceipt = manifoldModule.evaluateHEarthWorldManifoldDomain();
    record('EXECUTABLE_CHARACTERS_ADAPTER_PASS', adapterReceipt.eligible === true && adapterReceipt.siteWitnessCount === 8, `${adapterReceipt.result}:${JSON.stringify(adapterReceipt.issues)}`, 'VALIDATION');
    record('EXECUTABLE_H_EARTH_MANIFOLD_PASS', manifoldReceipt.eligible === true, `${manifoldReceipt.status}:${JSON.stringify(manifoldReceipt.issues)}`, 'VALIDATION');
  } catch (error) {
    record('EXECUTABLE_READ_ONLY_CONTRACTS', false, String(error), 'VALIDATION');
  }

  record('COMPLETION_BOUNDARY_EXACT', JSON.stringify(audit.completion?.stepsCompleted) === JSON.stringify([1,2,3,4,5,6,7,8]) && audit.completion?.constructionStarted === false && audit.completion?.productPathsChanged?.length === 0, JSON.stringify(audit.completion), 'COMPLETENESS');
  record('NO_RELEASE_AUTHORITY', audit.authorityBoundary?.mergeAuthority === false && audit.authorityBoundary?.deploymentAuthority === false && audit.authorityBoundary?.publicationAuthority === false, JSON.stringify(audit.authorityBoundary), 'AUTHORITY');
}

const result = failures.length
  ? 'HELD_TASK21_STEPS_01_08_AUDIT_INVALID'
  : 'PASS_TASK21_STEPS_01_08_AUDIT_COMPLETE_CONSTRUCTION_HELD';
console.log(JSON.stringify({
  schema: 'CHARACTERS_TASK21_THREE_ENVIRONMENT_GEOMETRIC_CONTINUITY_VERIFICATION_RECEIPT_v1',
  result,
  operationId: audit?.operationId ?? null,
  base,
  candidate,
  checks,
  failures,
  findings: {
    criticalDiscrepanciesRemain: true,
    constructionAuthorized: false,
    visualParityClaimed: false
  },
  authority: {
    productMutation: false,
    merge: false,
    deployment: false,
    publication: false,
    ownerIntegratedAcceptanceRequired: true
  }
}, null, 2));
process.exit(failures.length ? 1 : 0);

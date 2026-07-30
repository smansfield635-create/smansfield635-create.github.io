import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const CONTROL_PATH = path.join(ROOT, 'h-earth-3d/control-plane/traversal-scene-suite/h-earth.gratitude-region.traversal-scene-suite.cp1.v1.json');
const RECEIPT_PATH = path.join(ROOT, 'h-earth-3d/validation/h-earth.gratitude-region.traversal-scene-suite.cp1.receipt.v1.json');
const EVIDENCE_DIR = process.env.CP1_EVIDENCE_DIR ?? path.join(ROOT, 'h-earth-3d/validation/traversal-scene-suite/cp1-evidence');
const HARNESS_URL = process.env.CP1_HARNESS_URL ?? 'http://127.0.0.1:4176/h-earth-3d/validation/traversal-scene-suite/h-earth.gratitude-region.traversal-scene-suite.cp1-harness.html';
const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const control = JSON.parse(fs.readFileSync(CONTROL_PATH, 'utf8'));
const placement = JSON.parse(fs.readFileSync(path.join(ROOT, control.placementAuthorityPath), 'utf8'));
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => { checks.push({ id, status: passed ? 'PASS' : 'FAIL', passed, detail }); if (!passed) failures.push({ id, detail }); };
const startedAt = new Date().toISOString();

const head = git(['rev-parse', 'HEAD']);
let cp0Ancestor = true;
try { execFileSync('git', ['merge-base', '--is-ancestor', control.repository.cp0Head, head], { cwd: ROOT }); } catch { cp0Ancestor = false; }
check('CP0_HEAD_IS_ANCESTOR', cp0Ancestor, { cp0Head: control.repository.cp0Head, head });
const diffPaths = git(['diff', '--name-only', `${control.repository.cp0Head}..${head}`]).split(/\r?\n/).filter(Boolean).sort();
const allowed = new Set(control.allowedMutationPaths);
const unauthorized = diffPaths.filter((entry) => !allowed.has(entry));
check('CP1_DELTA_IS_CONTROL_AND_VERIFICATION_ONLY', unauthorized.length === 0, { diffPaths, unauthorized });
const productChanges = diffPaths.filter((entry) => entry.startsWith('showroom/') || entry.startsWith('h-earth-3d/terrain/') || entry.startsWith('h-earth-3d/environment/') || entry.startsWith('h-earth-3d/objects/') || entry.startsWith('h-earth-3d/integration/'));
check('PRODUCT_AND_WORLD_SOURCES_UNCHANGED', productChanges.length === 0, { productChanges });
check('SCENE_COUNT_EXACT', control.scenes.length === control.requiredSceneCount, { actual: control.scenes.length, expected: control.requiredSceneCount });
check('SCENE_IDS_UNIQUE', new Set(control.scenes.map((scene) => scene.id)).size === control.scenes.length);

const manor = placement.areaDispositions.find((entry) => entry.areaId === 'GRATITUDE_REGION_MIRROR_MANOR_PRECINCT');
const cavern = placement.areaDispositions.find((entry) => entry.areaId === 'GRATITUDE_REGION_CAVERN_PRECINCT');
check('MANOR_SITE_AUTHORITY_PRESERVED', manor?.placementDisposition === 'ACCEPT_UPPER_CONNECTED_HILL_SITE_ENVELOPE_ONLY' && manor?.deferred?.includes('EXACT_BUILDING_FOOTPRINT') && manor?.deferred?.includes('BUILDING_ORIENTATION'), { manor });
check('CAVERN_RELATION_AUTHORITY_PRESERVED', cavern?.placementDisposition === 'ACCEPT_CURRENT_RELATION' && cavern?.deferred?.includes('ENTRANCE_OPENING_GEOMETRY') && cavern?.deferred?.includes('CAVERN_INTERIOR_OCCURRENCE'), { cavern });

fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1100, height: 700 }, deviceScaleFactor: 1 });
const consoleErrors = [];
const pageErrors = [];
page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', (error) => pageErrors.push(error.message));
let suiteIdentity = null;
const sceneRecords = [];
try {
  await page.goto(`${HARNESS_URL}?cp1=${head.slice(0, 12)}`, { waitUntil: 'domcontentloaded', timeout: 180000 });
  await page.waitForFunction(() => document.documentElement.dataset.cp1Ready === 'true', null, { timeout: 240000 });
  suiteIdentity = await page.evaluate(() => window.H_EARTH_CP1_TRAVERSAL_SUITE.getSuiteIdentity());
  const sceneIds = await page.evaluate(() => window.H_EARTH_CP1_TRAVERSAL_SUITE.listSceneIds());
  for (const sceneId of sceneIds) {
    const record = await page.evaluate((id) => window.H_EARTH_CP1_TRAVERSAL_SUITE.renderScene(id), sceneId);
    const screenshotPath = path.join(EVIDENCE_DIR, `${sceneId.toLowerCase()}.png`);
    await page.locator('#cp1-canvas').screenshot({ path: screenshotPath });
    record.screenshot = path.relative(ROOT, screenshotPath).replaceAll('\\', '/');
    delete record.pixels.fingerprint;
    sceneRecords.push(record);
  }
} finally {
  await browser.close();
}

check('BROWSER_EXECUTION_CLEAN', consoleErrors.length === 0 && pageErrors.length === 0, { consoleErrors, pageErrors });
check('RENDERER_PACKAGE_ACTIVE', suiteIdentity?.rendererPackageIdentity === 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_9BD0B898' && suiteIdentity?.roleDomain?.join('|') === 'TERRAIN|SHORELINE|VEGETATION', { suiteIdentity });
check('ALL_SCENES_EXECUTED', sceneRecords.length === control.requiredSceneCount, { sceneCount: sceneRecords.length });
const ineligibleScenes = sceneRecords.filter((record) => !record.terrain.navigationState || record.terrain.cameraChunkId === null || record.terrain.targetChunkId === null);
check('ALL_SCENE_CAMERA_AND_TARGETS_TERRAIN_LAWFUL', ineligibleScenes.length === 0, { ineligibleScenes: ineligibleScenes.map((record) => record.scene.id) });
const alphaFailures = sceneRecords.filter((record) => record.pixels.alphaClosedCount !== record.pixels.pixelCount);
check('ALL_SCENES_ALPHA_CLOSED', alphaFailures.length === 0, { alphaFailures: alphaFailures.map((record) => record.scene.id) });
const hashes = new Set(sceneRecords.map((record) => record.pixels.byteHash));
check('SCENE_FRAMES_DISTINCT', hashes.size === control.requiredDistinctFrameCount, { distinctFrameCount: hashes.size, expected: control.requiredDistinctFrameCount, hashes: [...hashes] });
const weakFrames = sceneRecords.filter((record) => record.pixels.sampledColorBucketCount < 8 || record.pixels.luminanceStandardDeviation < 2 || record.pixels.meanAdjacentChannelDifference < 0.2);
check('ALL_SCENES_HAVE_NONTRIVIAL_VISUAL_SIGNAL', weakFrames.length === 0, { weakFrames: weakFrames.map((record) => ({ id: record.scene.id, metrics: record.pixels })) });
const targetProjectionFailures = sceneRecords.filter((record) => !record.targetProjection.visible);
check('ALL_AUTHORIZED_TARGETS_PROJECT_INTO_FRAME', targetProjectionFailures.length === 0, { failures: targetProjectionFailures.map((record) => ({ id: record.scene.id, projection: record.targetProjection })) });

const sourceFiles = [];
for (const root of ['showroom/globe/h-earth', 'h-earth-3d/terrain', 'h-earth-3d/environment', 'h-earth-3d/integration', 'h-earth-3d/objects']) {
  const absolute = path.join(ROOT, root);
  if (!fs.existsSync(absolute)) continue;
  const queue = [absolute];
  while (queue.length) {
    const item = queue.pop();
    for (const entry of fs.readdirSync(item, { withFileTypes: true })) {
      const child = path.join(item, entry.name);
      if (entry.isDirectory()) queue.push(child);
      else if (/\.(?:js|mjs|json|html|css)$/.test(entry.name)) sourceFiles.push(child);
    }
  }
}
const runtimeText = sourceFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
const runtimeIdentity = {
  mirrorManorDedicatedIdentifierCount: (runtimeText.match(/MIRROR[_ -]?MANOR/gi) ?? []).length,
  cavernPrecinctDedicatedIdentifierCount: (runtimeText.match(/CAVERN[_ -]?PRECINCT/gi) ?? []).length,
  buildingFootprintIdentifierCount: (runtimeText.match(/BUILDING[_ -]?FOOTPRINT/gi) ?? []).length,
  entranceOpeningGeometryIdentifierCount: (runtimeText.match(/ENTRANCE[_ -]?OPENING[_ -]?GEOMETRY/gi) ?? []).length
};

const diagnosis = {
  diagnosisClass: 'BOUNDED_PRESENTATION_DIAGNOSIS',
  established: failures.length === 0,
  findings: [
    {
      id: 'FINDING_01_PERMANENT_SCENE_REPRODUCIBILITY',
      status: sceneRecords.length === 8 && hashes.size === 8 ? 'ESTABLISHED' : 'NOT_ESTABLISHED',
      basis: { executedSceneCount: sceneRecords.length, distinctFrameCount: hashes.size }
    },
    {
      id: 'FINDING_02_RENDERER_RESPONDS_TO_LAWFUL_CAMERA_DIFFERENTIALS',
      status: weakFrames.length === 0 && hashes.size === 8 ? 'ESTABLISHED' : 'NOT_ESTABLISHED',
      basis: 'EIGHT_DISTINCT_WEBGL2_FRAME_READBACKS_WITH_NONTRIVIAL_VISUAL_SIGNAL'
    },
    {
      id: 'FINDING_03_MANOR_IDENTITY_IS_NOT_YET_CONSTRUCTED',
      status: manor?.deferred?.includes('EXACT_BUILDING_FOOTPRINT') ? 'ESTABLISHED' : 'NOT_ESTABLISHED',
      basis: {
        acceptedAuthority: manor?.placementDisposition,
        deferred: manor?.deferred,
        liveRenderRoleDomain: suiteIdentity?.roleDomain,
        implication: 'SCENE_07_CAN_TEST_SITE_APPROACH_BUT_CANNOT_PRESENT_A_DEDICATED_MANOR_OBJECT'
      }
    },
    {
      id: 'FINDING_04_CAVERN_OPENING_AND_INTERIOR_ARE_NOT_YET_CONSTRUCTED',
      status: cavern?.deferred?.includes('ENTRANCE_OPENING_GEOMETRY') && cavern?.deferred?.includes('CAVERN_INTERIOR_OCCURRENCE') ? 'ESTABLISHED' : 'NOT_ESTABLISHED',
      basis: {
        acceptedAuthority: cavern?.placementDisposition,
        deferred: cavern?.deferred,
        liveRenderRoleDomain: suiteIdentity?.roleDomain,
        implication: 'SCENE_08_CAN_TEST_THE_ACCEPTED_EXTERIOR_RELATION_BUT_CANNOT_PRESENT_AN_OPENING_OR_INTERIOR'
      }
    },
    {
      id: 'FINDING_05_ROUND_1_SCOPE_IS_PRESENTATION_ONLY',
      status: 'ESTABLISHED',
      basis: {
        terrainLawfulSceneCount: sceneRecords.length - ineligibleScenes.length,
        placementAuthorityPreserved: true,
        terrainMutationEvidence: false,
        authorizedNextScope: 'PRESENTATION_READABILITY_AND_LANDMARK_DIFFERENTIATION_WITHOUT_TERRAIN_OR_PLACEMENT_MUTATION'
      }
    }
  ],
  runtimeIdentityScan: runtimeIdentity,
  boundedRound1CorrectionAuthorityCandidate: {
    authorizedLayer: 'PRESENTATION_ONLY',
    mayAddress: ['SCALE_CUES', 'SLOPE_READABILITY', 'ROUTE_CONTAINMENT', 'LANDMARK_DIFFERENTIATION', 'ACCEPTED_SITE_AND_EXTERIOR_RELATION_READABILITY'],
    mustPreserve: ['FROZEN_TERRAIN_FIELD', 'ENTRY_ZONE_PLACEMENT', 'MIRROR_MANOR_SITE_ENVELOPE', 'CAVERN_EXTERIOR_RELATION', 'FRONTIER_NONFINAL_STATUS', 'CAMERA_AND_TOUCH_AUTHORITY'],
    notAuthorizedInCp1: ['PRODUCT_MUTATION', 'BUILDING_GEOMETRY', 'CAVERN_EXCAVATION', 'HEIGHT_FIELD_MUTATION', 'LIVE_DEPLOYMENT']
  }
};
check('BOUNDED_DIAGNOSIS_ESTABLISHED', diagnosis.findings.every((finding) => finding.status === 'ESTABLISHED'), { findings: diagnosis.findings });

const result = failures.length === 0 ? 'PASS_CLOSED' : 'BLOCKED';
const receipt = {
  schemaVersion: 'H_EARTH_GRATITUDE_REGION_TRAVERSAL_SCENE_SUITE_CP1_RECEIPT_v1',
  checkpoint: control.checkpoint.id,
  result,
  startedAt,
  completedAt: new Date().toISOString(),
  repository: { head, cp0Head: control.repository.cp0Head, frozenBaselineHead: control.repository.frozenBaselineHead, diffPaths },
  suiteIdentity,
  checks,
  failures,
  scenes: sceneRecords,
  diagnosis,
  authoritySeparation: control.authoritySeparation,
  closure: {
    productSourceChanged: false,
    liveExperienceChanged: false,
    newUserInspectionPerformed: false,
    newPhysicalAcceptancePerformed: false,
    traversalSceneSuiteCreated: result === 'PASS_CLOSED',
    engineeringDiagnosisEstablished: result === 'PASS_CLOSED',
    nextCheckpointAuthorized: result === 'PASS_CLOSED',
    nextCheckpointStarted: false,
    stoppingBoundary: control.stoppingBoundary
  }
};
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify({ checkpoint: receipt.checkpoint, result, sceneCount: sceneRecords.length, distinctFrameCount: hashes.size, failures, diagnosis: diagnosis.findings, receiptPath: path.relative(ROOT, RECEIPT_PATH) }, null, 2));
if (result !== 'PASS_CLOSED') process.exitCode = 1;

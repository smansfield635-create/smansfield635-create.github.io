import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const CONTROL = path.join(ROOT, 'h-earth-3d/control-plane/traversal-scene-suite/h-earth.gratitude-region.traversal-scene-suite.cp0-baseline.v1.json');
const RECEIPT = path.join(ROOT, 'h-earth-3d/validation/h-earth.gratitude-region.traversal-scene-suite.cp0-baseline.receipt.v1.json');
const git = (args, binary = false) => execFileSync('git', args, { cwd: ROOT, encoding: binary ? null : 'utf8' });
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const blob = (bytes) => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
const clean = (value) => value.split('#')[0].split('?')[0];
const repoPath = (value) => value.replaceAll('\\', '/').replace(/^\/+/, '');

function resolveImport(source, specifier) {
  const value = clean(specifier);
  if (!value || /^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) return null;
  const base = value.startsWith('/') ? repoPath(value) : repoPath(path.posix.normalize(path.posix.join(path.posix.dirname(source), value)));
  const candidates = [base, `${base}.js`, `${base}.mjs`, `${base}.json`, path.posix.join(base, 'index.js')];
  for (const candidate of candidates) {
    const absolute = path.join(ROOT, candidate);
    if (absolute.startsWith(ROOT) && fs.existsSync(absolute) && fs.statSync(absolute).isFile()) return candidate;
  }
  return { source, specifier, unresolved: base };
}

function importsFor(source) {
  const text = fs.readFileSync(path.join(ROOT, source), 'utf8');
  const values = [];
  const patterns = source.endsWith('.html') ? [
    /<script\b[^>]*\btype=["']module["'][^>]*\bsrc=["']([^"']+)["'][^>]*>/gi,
    /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*\btype=["']module["'][^>]*>/gi,
    /<link\b[^>]*\brel=["'][^"']*stylesheet[^"']*["'][^>]*\bhref=["']([^"']+)["'][^>]*>/gi,
    /<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["'][^"']*stylesheet[^"']*["'][^>]*>/gi
  ] : source.endsWith('.css') ? [/@import\s+(?:url\(\s*)?["']([^"']+)["']/g] : [
    /\b(?:import|export)\s+(?:[^'";]*?\s+from\s+)?["']([^"']+)["']/g,
    /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) values.push(match[1]);
  }
  return [...new Set(values)].map((value) => resolveImport(source, value)).filter(Boolean);
}

function graph(roots) {
  const queue = [...roots];
  const seen = new Set();
  const edges = [];
  const unresolved = [];
  while (queue.length) {
    const source = repoPath(queue.shift());
    if (seen.has(source)) continue;
    seen.add(source);
    const absolute = path.join(ROOT, source);
    if (!fs.existsSync(absolute)) { unresolved.push({ source: null, unresolved: source }); continue; }
    for (const dependency of importsFor(source)) {
      if (typeof dependency === 'string') { edges.push({ from: source, to: dependency }); queue.push(dependency); }
      else unresolved.push(dependency);
    }
  }
  return { paths: [...seen].sort(), edges, unresolved };
}

function role(source) {
  if (source.endsWith('/index.html')) return 'PUBLIC_ENTRY_DOCUMENT';
  if (source.endsWith('.css')) return 'PUBLIC_STYLE_AUTHORITY';
  if (source.includes('final-spatial-placement-disposition')) return 'FINAL_PLACEMENT_AUTHORITY';
  if (source.includes('spatial-interaction-area-development')) return 'ORIGINAL_SPATIAL_AUTHORITY';
  if (source.includes('narrative-character-temporal-reconciliation')) return 'NARRATIVE_RECONCILIATION_AUTHORITY';
  if (source.includes('pointer-touch-intake')) return 'TOUCH_INPUT_AUTHORITY';
  if (source.includes('touch-control-lattice')) return 'GESTURE_CLASSIFICATION_AUTHORITY';
  if (source.endsWith('/navigation.js')) return 'NAVIGATION_AND_CAMERA_AUTHORITY';
  if (source.includes('live-gpu-binding')) return 'PROPOSAL_TO_GPU_BINDING';
  if (source.includes('live-renderer-contract')) return 'FRAME_PACKET_AUTHORITY';
  if (source.includes('persistent-live-renderer')) return 'WEBGL_PRESENTATION_AUTHORITY';
  if (source.includes('successor-terrain-field')) return 'TERRAIN_AUTHORITY';
  if (source.includes('public-live-gpu-integration')) return 'PUBLIC_RUNTIME_ORCHESTRATION';
  if (source.includes('live-render-package')) return 'LIVE_RENDER_PACKAGE_AUTHORITY';
  if (source.includes('gpu-upload-views')) return 'GPU_TRANSPORT_AUTHORITY';
  return 'RUNTIME_DEPENDENCY';
}

async function fetchBytes(url, attempts = 3) {
  let error;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { redirect: 'follow', headers: { 'cache-control': 'no-cache', 'user-agent': 'H-Earth-CP0-Baseline/1.0' } });
      return { response, bytes: Buffer.from(await response.arrayBuffer()), attempt };
    } catch (caught) {
      error = caught;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
  throw error;
}

export async function executeCp0Baseline() {
  const startedAt = new Date().toISOString();
  const control = JSON.parse(fs.readFileSync(CONTROL, 'utf8'));
  const checks = [];
  const failures = [];
  const check = (id, passed, detail = null) => { checks.push({ id, status: passed ? 'PASS' : 'FAIL', passed, detail }); if (!passed) failures.push({ id, detail }); };
  const baseline = control.repository.baselineMainHead;
  const head = git(['rev-parse', 'HEAD']).trim();
  const branch = process.env.GITHUB_REF_NAME || git(['branch', '--show-current']).trim();

  let ancestor = true;
  try { git(['merge-base', '--is-ancestor', baseline, head]); } catch { ancestor = false; }
  check('BASELINE_IS_ANCESTOR', ancestor, { baseline, head });

  const diffPaths = git(['diff', '--name-only', `${baseline}..${head}`]).split(/\r?\n/).map((v) => v.trim()).filter(Boolean).sort();
  const allowed = new Set(control.allowedCheckpointMutationPaths);
  const unauthorized = diffPaths.filter((value) => !allowed.has(value));
  check('DELTA_IS_CHECKPOINT_ONLY', unauthorized.length === 0, { diffPaths, unauthorized });
  const productChanges = diffPaths.filter((value) => value.startsWith('showroom/') || value.startsWith('h-earth-3d/terrain/') || value.startsWith('h-earth-3d/environment/') || value.startsWith('h-earth-3d/objects/'));
  check('PRODUCT_AND_WORLD_SOURCE_UNCHANGED', productChanges.length === 0, { productChanges });
  const sceneChanges = diffPaths.filter((value) => /\/scenes\//i.test(value) || /traversal-scene(?!-suite\/h-earth\.gratitude-region\.traversal-scene-suite\.cp0)/i.test(value));
  check('TRAVERSAL_SCENES_NOT_CREATED', sceneChanges.length === 0, { sceneChanges });

  const main = git(['ls-remote', 'origin', 'refs/heads/main']).trim().split(/\s+/)[0] || null;
  const rollback = git(['ls-remote', 'origin', `refs/heads/${control.repository.rollbackBranch}`]).trim().split(/\s+/)[0] || null;
  check('REMOTE_MAIN_EQUALS_BASELINE', main === baseline, { main, baseline });
  check('ROLLBACK_REF_EQUALS_BASELINE', rollback === control.repository.rollbackHead, { rollback, expected: control.repository.rollbackHead });

  const placementBytes = fs.readFileSync(path.join(ROOT, control.placementAuthority.path));
  const placement = JSON.parse(placementBytes.toString('utf8'));
  check('PLACEMENT_BLOB_EXACT', blob(placementBytes) === control.placementAuthority.gitBlob, { actual: blob(placementBytes), expected: control.placementAuthority.gitBlob });
  check('PLACEMENT_STATUS_CLOSED', placement.artifactIdentity?.status === control.placementAuthority.requiredStatus, { actual: placement.artifactIdentity?.status });
  const checkpointErrors = control.placementAuthority.requiredClosedCheckpoints.filter((id) => placement.closedCheckpointState?.[id] !== 'PASS_CLOSED_DO_NOT_REOPEN');
  check('FP00_THROUGH_FP05_CLOSED', checkpointErrors.length === 0, { checkpointErrors });

  const actualAreas = new Map((placement.areaDispositions || []).map((area) => [area.areaId, area]));
  const placementErrors = [];
  for (const expected of control.acceptedPlacementInventory) {
    const actual = actualAreas.get(expected.areaId);
    if (!actual) { placementErrors.push({ areaId: expected.areaId, issue: 'MISSING' }); continue; }
    if (actual.placementDisposition !== expected.placementDisposition) placementErrors.push({ areaId: expected.areaId, issue: 'DISPOSITION' });
    if (expected.areaId === 'GRATITUDE_REGION_ENTRY_ZONE' && (JSON.stringify(actual.finalBounds) !== JSON.stringify(expected.bounds) || JSON.stringify({ waypointId: actual.activeInitialState?.waypointId, x: actual.activeInitialState?.x, z: actual.activeInitialState?.z, yawDegrees: actual.activeInitialState?.yawDegrees, pitchDegrees: actual.activeInitialState?.pitchDegrees, verticalFovDegrees: actual.activeInitialState?.verticalFovDegrees }) !== JSON.stringify(expected.initialState))) placementErrors.push({ areaId: expected.areaId, issue: 'ENTRY_FACTS' });
    if (expected.areaId === 'GRATITUDE_REGION_MIRROR_MANOR_PRECINCT' && (JSON.stringify(actual.finalSiteCenter) !== JSON.stringify(expected.siteCenter) || JSON.stringify(actual.finalSiteBounds) !== JSON.stringify(expected.bounds))) placementErrors.push({ areaId: expected.areaId, issue: 'MANOR_FACTS' });
    if (expected.areaId === 'GRATITUDE_REGION_CAVERN_PRECINCT' && (JSON.stringify(actual.exteriorFace) !== JSON.stringify(expected.exteriorFace) || JSON.stringify(actual.apron) !== JSON.stringify(expected.apron) || JSON.stringify(actual.precinctCenter) !== JSON.stringify(expected.precinctCenter))) placementErrors.push({ areaId: expected.areaId, issue: 'CAVERN_FACTS' });
    if (expected.areaId === 'GRATITUDE_REGION_FRONTIER_PLAINS' && (actual.finalEnvelope !== null || actual.finalAnchor !== null)) placementErrors.push({ areaId: expected.areaId, issue: 'FRONTIER_FINALIZED' });
  }
  check('ACCEPTED_PLACEMENT_INVENTORY_EXACT', placementErrors.length === 0 && actualAreas.size === control.placementAuthority.requiredAreaCount, { placementErrors, areaCount: actualAreas.size });
  check('PAIR_MATRIX_PASSING', placement.pairRelationshipMatrix?.length === control.placementAuthority.requiredPairRelationshipCount && placement.pairRelationshipMatrix.every((value) => value.passed === true && value.status === 'PASS'), { count: placement.pairRelationshipMatrix?.length });
  check('PRESERVATION_LAWS_PASSING', placement.preservationLaws?.length === control.placementAuthority.requiredPreservationLawCount && placement.preservationLaws.every((value) => value.passed === true && value.status === 'PASS'), { count: placement.preservationLaws?.length });

  const physicalBytes = fs.readFileSync(path.join(ROOT, control.priorPhysicalEvidence.path));
  const physical = JSON.parse(physicalBytes.toString('utf8'));
  check('PRIOR_PHYSICAL_EVIDENCE_BLOB_EXACT', blob(physicalBytes) === control.priorPhysicalEvidence.gitBlob, { actual: blob(physicalBytes), expected: control.priorPhysicalEvidence.gitBlob });
  check('PRIOR_PHYSICAL_BOUNDARIES_REMAIN_OPEN', physical.acceptanceBoundary?.tabletEightOfEightFunctionalAcceptanceClosed === true && physical.acceptanceBoundary?.correctedTabletFluidityPhysicalAcceptanceClosed === true && physical.acceptanceBoundary?.physicalReleaseTerminationConfirmationRequired === true && physical.acceptanceBoundary?.portraitLandscapePhysicalAcceptanceRequired === true && physical.acceptanceBoundary?.cp4AcceptanceAuthorized === false, { acceptanceBoundary: physical.acceptanceBoundary });

  const runtimeGraph = graph(control.runtimeSourceRoots);
  check('RUNTIME_GRAPH_RESOLVED', runtimeGraph.unresolved.length === 0, { unresolved: runtimeGraph.unresolved });
  const authorityPaths = [...new Set([...runtimeGraph.paths, ...control.explicitAuthoritySources.map(repoPath)])].sort();
  const sourceInventory = [];
  const sourceErrors = [];
  for (const source of authorityPaths) {
    const absolute = path.join(ROOT, source);
    if (!fs.existsSync(absolute)) { sourceErrors.push({ source, issue: 'MISSING' }); continue; }
    const bytes = fs.readFileSync(absolute);
    let baseBytes;
    try { baseBytes = git(['show', `${baseline}:${source}`], true); } catch { sourceErrors.push({ source, issue: 'NOT_IN_BASELINE' }); continue; }
    const exact = Buffer.compare(bytes, baseBytes) === 0;
    if (!exact) sourceErrors.push({ source, issue: 'CHANGED' });
    sourceInventory.push({ path: source, role: role(source), bytes: bytes.length, gitBlob: blob(bytes), sha256: sha256(bytes), exactAgainstBaseline: exact });
  }
  check('SOURCE_INVENTORY_EXACT', sourceErrors.length === 0, { sourceCount: sourceInventory.length, sourceErrors });

  const runtimeFiles = [];
  const runtimeErrors = [];
  const origin = new URL(control.runtime.publicUrl).origin;
  for (const source of runtimeGraph.paths) {
    const local = fs.readFileSync(path.join(ROOT, source));
    const url = new URL(`/${source}`, origin);
    url.searchParams.set('cp0', baseline.slice(0, 12));
    try {
      const { response, bytes, attempt } = await fetchBytes(url.href);
      const exact = response.ok && Buffer.compare(local, bytes) === 0;
      const row = { path: source, url: url.href, finalUrl: response.url, status: response.status, attempt, localBytes: local.length, servedBytes: bytes.length, localSha256: sha256(local), servedSha256: sha256(bytes), exact, contentType: response.headers.get('content-type'), etag: response.headers.get('etag'), lastModified: response.headers.get('last-modified') };
      runtimeFiles.push(row);
      if (!exact) runtimeErrors.push(row);
    } catch (error) {
      const row = { path: source, url: url.href, exact: false, error: error instanceof Error ? error.message : String(error) };
      runtimeFiles.push(row); runtimeErrors.push(row);
    }
  }
  check('SERVED_RUNTIME_BYTES_EXACT', runtimeErrors.length === 0, { runtimeFileCount: runtimeFiles.length, runtimeErrors });
  const html = fs.readFileSync(path.join(ROOT, 'showroom/globe/h-earth/index.html'), 'utf8');
  const modules = [...html.matchAll(/<script\b[^>]*\btype=["']module["'][^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]);
  check('ONE_PUBLIC_MODULE_BOOTSTRAP', modules.length === 1 && modules[0].includes('public-live-gpu-integration.run8e-r3e.receipt.js'), { modules });

  const result = failures.length === 0 ? 'PASS_CLOSED' : 'BLOCKED';
  const receipt = {
    schemaVersion: 'H_EARTH_GRATITUDE_REGION_TRAVERSAL_SCENE_SUITE_CP0_BASELINE_RECEIPT_v1',
    checkpoint: 'CP0_EXACT_INTEGRATED_BASELINE_FREEZE',
    result,
    startedAt,
    completedAt: new Date().toISOString(),
    repository: { fullName: control.repository.fullName, baselineMainHead: baseline, remoteMainHead: main, checkpointBranch: branch, checkpointHead: head, rollbackBranch: control.repository.rollbackBranch, rollbackHead: rollback, diffPaths },
    separation: { perceptualJudgmentPerformed: false, engineeringDiagnosisPerformed: false, repositoryMutationClass: 'CONTROL_AND_VERIFICATION_ONLY', executedVerificationPerformed: true, newPhysicalAcceptancePerformed: false },
    rollbackInventory: { exactRollbackRefEstablished: rollback === control.repository.rollbackHead, restoreTargetCommit: control.repository.rollbackHead, restoreScope: 'COMPLETE_INTEGRATED_STATE_BEFORE_TRAVERSAL_SCENES' },
    sourceInventory,
    runtimeInventory: { publicUrl: control.runtime.publicUrl, verificationClass: control.runtime.acceptedExecutionClass, runtimeGraphFileCount: runtimeGraph.paths.length, runtimeGraphEdges: runtimeGraph.edges, runtimeFiles, exactServedSourceGraph: runtimeErrors.length === 0 },
    acceptedPlacementInventory: placement.areaDispositions,
    pairRelationshipMatrix: placement.pairRelationshipMatrix,
    preservationLaws: placement.preservationLaws,
    priorPhysicalEvidenceInventory: { classification: control.priorPhysicalEvidence.classification, samsungPhone: physical.physicalEvidence?.samsungPhone, androidTablet: physical.physicalEvidence?.androidTablet, acceptanceBoundary: physical.acceptanceBoundary },
    checks,
    failures,
    closure: { exactBaselineIdentified: ancestor && main === baseline, rollbackAuthorityEstablished: rollback === control.repository.rollbackHead, sourceInventoryComplete: sourceErrors.length === 0 && runtimeGraph.unresolved.length === 0, runtimeInventoryComplete: runtimeErrors.length === 0, acceptedPlacementInventoryComplete: placementErrors.length === 0, productSourceChanged: productChanges.length > 0, traversalSceneSuiteCreated: sceneChanges.length > 0, unresolvedBaselineGapCount: failures.length, checkpointResult: result, nextCheckpointAuthorized: false, stoppingBoundary: control.stoppingBoundary }
  };
  fs.writeFileSync(RECEIPT, `${JSON.stringify(receipt, null, 2)}\n`);
  return { receipt, receiptPath: RECEIPT };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { receipt } = await executeCp0Baseline();
  console.log(JSON.stringify({ checkpoint: receipt.checkpoint, result: receipt.result, failureCount: receipt.failures.length, sourceCount: receipt.sourceInventory.length, runtimeFileCount: receipt.runtimeInventory.runtimeGraphFileCount }, null, 2));
  if (receipt.result !== 'PASS_CLOSED') process.exitCode = 1;
}

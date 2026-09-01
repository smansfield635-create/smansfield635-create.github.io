import {
  buildHEarthC2R1CompleteWorldRenderPackage,
  evaluateHEarthC2R1CompleteWorldRenderPackage,
  H_EARTH_C2_R1_COMPLETE_WORLD_BINDING
} from './complete-world-render-package.js';
import { createHEarthC2R1CompleteWorldPersistentRenderer } from './complete-world-persistent-renderer.js';
import { installHEarthRun8ER3D2PointerTouchIntake } from '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js';
import { createHEarthRun8ER3AFrameUniformPacket } from '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js';
import { getHEarthRun8ER2CanonicalLiveRenderPackage } from '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js';

async function loadExactBindingCacheBase64() {
  const ledgerPath = '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/complete-world/h-earth.c2-r1.complete-world-operation-ledger.json';
  const role3Path = '/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/complete-world/h-earth.c2-r1.complete-world-role3-entry.json';
  const [ledgerResponse, role3Response] = await Promise.all([
    fetch(ledgerPath, { cache: 'no-store' }),
    fetch(role3Path, { cache: 'no-store' })
  ]);
  if (!ledgerResponse.ok || !role3Response.ok) {
    throw new Error(`EXACT_BINDING_CACHE_CARRIER_HTTP_FAILURE:${ledgerResponse.status}:${role3Response.status}`);
  }
  const [ledger, role3] = await Promise.all([ledgerResponse.json(), role3Response.json()]);
  const first = ledger?.exactBindingCacheCarrier;
  const second = role3?.exactBindingCacheCarrier;
  if (first?.partIndex !== 1 || second?.partIndex !== 2 ||
      first?.partCount !== 2 || second?.partCount !== 2 ||
      first?.encoding !== 'BASE64_GZIP_JSON' || second?.encoding !== 'BASE64_GZIP_JSON' ||
      typeof first?.value !== 'string' || typeof second?.value !== 'string') {
    throw new Error('EXACT_BINDING_CACHE_CARRIER_IDENTITY_INVALID');
  }
  return first.value + second.value;
}

const root = document.getElementById('complete-world-root');
const canvas = document.getElementById('complete-world-canvas');
const status = document.getElementById('complete-world-status');
const details = document.getElementById('complete-world-details');
const traceRows = [];
let traceSequence = 0;
const trace = (event, detail = null) => {
  const row = Object.freeze({
    sequence: ++traceSequence,
    event,
    performanceMilliseconds: Number(performance.now().toFixed(3)),
    detail
  });
  traceRows.push(row);
  console.info(`COMPLETE_WORLD_TRACE:${JSON.stringify(row)}`);
  return row;
};
window.__H_EARTH_COMPLETE_WORLD_TRACE__ = Object.freeze({ rows: traceRows, trace });

const viewport = () => {
  const width = Math.max(320, Math.round(canvas.clientWidth || 1280));
  const height = Math.max(180, Math.round(canvas.clientHeight || 720));
  const maximumPixels = 1280 * 720;
  const scale = Math.min(1, Math.sqrt(maximumPixels / (width * height)));
  return { width: Math.max(320, Math.round(width * scale)), height: Math.max(180, Math.round(height * scale)), pixelRatio: 1 };
};

let packageRecord = null;
let packageEvaluation = null;
let startupProgress = Object.freeze({
  phase: 'BOOTSTRAP',
  processedVertexCount: 0,
  vertexCount: 0,
  progressRatio: 0,
  counters: null
});
const startupApi = Object.freeze({
  ready: false,
  failed: false,
  building: true,
  getProgressReceipt: () => JSON.parse(JSON.stringify(startupProgress))
});
window.H_EARTH_C2_R1_COMPLETE_WORLD = startupApi;
root.dataset.ready = 'false';
root.dataset.failed = 'false';
root.dataset.building = 'true';

try {
  trace('PACKAGE_CONSTRUCTION_STARTED', {
    startupBudgetMilliseconds: H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.startup.browserBudgetMilliseconds,
    yieldEveryVertices: H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.startup.browserYieldEveryVertices
  });
  const canonicalPackage = getHEarthRun8ER2CanonicalLiveRenderPackage();
  const exactBindingCacheBase64 = await loadExactBindingCacheBase64();
  packageRecord = await buildHEarthC2R1CompleteWorldRenderPackage({
    canonicalPackage,
    exactBindingCacheBase64,
    exactBindingCacheArtifactDigest: 'sha256:0c01a65ce7a8304874fc9ec43ce1972a5f0e828b2ceb369c3d4faf603f1ff0d1',
    startupBudgetMilliseconds: H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.startup.browserBudgetMilliseconds,
    yieldEveryVertices: H_EARTH_C2_R1_COMPLETE_WORLD_BINDING.startup.browserYieldEveryVertices,
    onProgress(progressReceipt) {
      startupProgress = progressReceipt;
      const percent = Math.max(0, Math.min(100, Math.floor((progressReceipt.progressRatio ?? 0) * 100)));
      root.dataset.buildProgress = String(percent);
      status.textContent = progressReceipt.phase === 'COMPLETE_WORLD_DIGEST'
        ? 'Finalizing complete-world package identity'
        : `Constructing complete-world package · ${percent}%`;
      details.textContent = progressReceipt.counters
        ? `${progressReceipt.counters.boundTerrainVertexCount ?? 0} terrain vertices · ${progressReceipt.counters.boundShorelineVertexCount ?? 0} shoreline vertices`
        : 'Preparing canonical complete-world package';
    }
  });
  packageEvaluation = evaluateHEarthC2R1CompleteWorldRenderPackage(packageRecord, canonicalPackage);
  if (packageEvaluation.eligible !== true) {
    const rejection = new Error(`COMPLETE_WORLD_PACKAGE_EVALUATION_FAILED:${packageEvaluation.rootRejectionCode ?? packageEvaluation.issues.join(',')}`);
    rejection.packageRecord = packageRecord;
    rejection.packageEvaluation = packageEvaluation;
    throw rejection;
  }
  trace('PACKAGE_CONSTRUCTION_COMPLETED', {
    packageIdentity: packageRecord.packageIdentity,
    counters: packageRecord.completeWorldBinding.counters
  });

  const renderer = createHEarthC2R1CompleteWorldPersistentRenderer({ canvas, packageRecord, viewport: viewport() });
  await renderer.initialize();
  trace('RENDERER_INITIALIZED', renderer.getReceipt());

  let frameSequence = 0;
  let latestFrame = null;
  const intake = installHEarthRun8ER3D2PointerTouchIntake({
    surface: canvas,
    onProposal(proposalRecord, navigationState) {
      if (proposalRecord?.accepted !== true) return;
      frameSequence += 1;
      const packet = createHEarthRun8ER3AFrameUniformPacket({ navigationState, viewport: viewport(), frameSequence });
      latestFrame = renderer.renderFrame(packet);
      root.dataset.gestureUsed = 'true';
      status.textContent = `Complete-world candidate active · frame ${latestFrame.frameSequence} · navigation ${latestFrame.navigationSequence}`;
    }
  });

  frameSequence += 1;
  const initialPacket = createHEarthRun8ER3AFrameUniformPacket({ navigationState: intake.getNavigationState(), viewport: viewport(), frameSequence });
  latestFrame = renderer.renderFrame(initialPacket);
  trace('FIRST_VISIBLE_FRAME', latestFrame);

  const receipt = Object.freeze({
    receiptType: 'H_EARTH_C2_R1_COMPLETE_WORLD_ISOLATED_OCCURRENCE_RECEIPT_v2',
    eligible: true,
    status: 'COMPLETE_WORLD_ISOLATED_OCCURRENCE_READY_FOR_ROLE_3',
    objectId: 'H_EARTH:C2_R1:COASTAL_SUCCESSOR',
    executionHistoryId: 'H_EARTH:C2_R1:PR_418:HISTORY_001',
    activeEdgeId: 'H_EARTH:C2_R1:COASTAL_COMPONENT_TO_COMPLETE_WORLD_CANDIDATE',
    operationId: 'H_EARTH_C2_R1_COMPLETE_WORLD_INTEGRATION_001',
    correctiveOperationId: 'H_EARTH_C2_R1_COMPLETE_WORLD_REAL_PACKAGE_ADAPTER_CORRECTION_001',
    performanceCorrectionId: 'H_EARTH_C2_R1_COMPLETE_WORLD_STARTUP_PERFORMANCE_CORRECTION_001',
    packageIdentity: packageRecord.packageIdentity,
    packageContentDigest: packageRecord.contentDigest,
    packageBinding: packageRecord.completeWorldBinding,
    renderer: renderer.getReceipt(),
    intake: intake.getReceipt(),
    reviewEntry: location.pathname,
    boundaries: {
      isolatedNondefault: true,
      publicDefaultRouteMutated: false,
      mainMutated: false,
      role1SelfCertification: false,
      userDifferentialPerformed: false
    }
  });
  window.H_EARTH_C2_R1_COMPLETE_WORLD = Object.freeze({
    ready: true,
    failed: false,
    building: false,
    packageRecord,
    getProgressReceipt: () => JSON.parse(JSON.stringify(startupProgress)),
    getReceipt: () => JSON.parse(JSON.stringify({ ...receipt, renderer: renderer.getReceipt(), intake: intake.getReceipt() }))
  });
  root.dataset.ready = 'true';
  root.dataset.failed = 'false';
  root.dataset.building = 'false';
  root.dataset.buildProgress = '100';
  status.textContent = 'Complete-world candidate ready for independent Role 3 verification';
  details.textContent = `${packageRecord.completeWorldBinding.counters.boundTerrainVertexCount} terrain vertices and ${packageRecord.completeWorldBinding.counters.boundShorelineVertexCount} shoreline vertices bound in ${packageRecord.completeWorldBinding.counters.constructionMilliseconds} ms; noncoastal package preserved.`;
  window.dispatchEvent(new CustomEvent('h-earth-complete-world-ready', { detail: receipt }));
  trace('READY_EVENT_EMITTED', receipt);
} catch (error) {
  const failureReceipt = Object.freeze({
    receiptType: 'H_EARTH_C2_R1_COMPLETE_WORLD_RUNTIME_FAILURE_RECEIPT_v2',
    eligible: false,
    status: 'COMPLETE_WORLD_ISOLATED_OCCURRENCE_FAILED',
    objectId: 'H_EARTH:C2_R1:COASTAL_SUCCESSOR',
    executionHistoryId: 'H_EARTH:C2_R1:PR_418:HISTORY_001',
    activeEdgeId: 'H_EARTH:C2_R1:COASTAL_COMPONENT_TO_COMPLETE_WORLD_CANDIDATE',
    operationId: 'H_EARTH_C2_R1_COMPLETE_WORLD_STARTUP_PERFORMANCE_CORRECTION_001',
    rootRejectionCode: packageEvaluation?.rootRejectionCode ?? packageRecord?.rootRejectionCode ?? error?.message ?? 'COMPLETE_WORLD_RUNTIME_FAILURE',
    issues: packageEvaluation?.issues ?? packageRecord?.issues ?? [],
    counters: packageEvaluation?.counters ?? packageRecord?.counters ?? startupProgress?.counters ?? null,
    failureDiagnostics: packageEvaluation?.failureDiagnostics ?? packageRecord?.failureDiagnostics ?? [],
    startupProgress,
    error: { name: error?.name ?? 'Error', message: error?.message ?? String(error), stack: error?.stack ?? null },
    reviewEntry: location.pathname,
    boundaries: {
      closedComponentSourceMutated: false,
      rendererSourceMutated: false,
      publicDefaultRouteMutated: false,
      mainMutated: false,
      role1SelfCertification: false,
      userDifferentialPerformed: false
    }
  });
  window.H_EARTH_C2_R1_COMPLETE_WORLD = Object.freeze({
    ready: false,
    failed: true,
    building: false,
    getProgressReceipt: () => JSON.parse(JSON.stringify(startupProgress)),
    getFailureReceipt: () => JSON.parse(JSON.stringify(failureReceipt))
  });
  root.dataset.ready = 'false';
  root.dataset.failed = 'true';
  root.dataset.building = 'false';
  root.dataset.error = 'true';
  status.textContent = 'Complete-world candidate failed to initialize';
  details.textContent = failureReceipt.rootRejectionCode;
  trace('COMPLETE_WORLD_FAILURE', failureReceipt);
  window.dispatchEvent(new CustomEvent('h-earth-complete-world-failed', { detail: failureReceipt }));
  console.error(`COMPLETE_WORLD_FAILURE_RECEIPT:${JSON.stringify(failureReceipt)}`);
}

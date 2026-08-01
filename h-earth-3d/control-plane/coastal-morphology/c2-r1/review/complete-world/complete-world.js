import {
  buildHEarthC2R1CompleteWorldRenderPackage,
  evaluateHEarthC2R1CompleteWorldRenderPackage
} from './complete-world-render-package.js';
import { createHEarthC2R1CompleteWorldPersistentRenderer } from './complete-world-persistent-renderer.js';
import { installHEarthRun8ER3D2PointerTouchIntake } from '/showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js';
import { createHEarthRun8ER3AFrameUniformPacket } from '/showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js';
import { getHEarthRun8ER2CanonicalLiveRenderPackage } from '/showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js';

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

try {
  trace('PACKAGE_CONSTRUCTION_STARTED');
  const canonicalPackage = getHEarthRun8ER2CanonicalLiveRenderPackage();
  const packageRecord = await buildHEarthC2R1CompleteWorldRenderPackage({ canonicalPackage });
  const evaluation = evaluateHEarthC2R1CompleteWorldRenderPackage(packageRecord, canonicalPackage);
  if (evaluation.eligible !== true) throw new Error(`COMPLETE_WORLD_PACKAGE_EVALUATION_FAILED:${evaluation.issues.join(',')}`);
  trace('PACKAGE_CONSTRUCTION_COMPLETED', {
    packageIdentity: packageRecord.packageIdentity,
    counters: packageRecord.completeWorldBinding.counters
  });

  const renderer = createHEarthC2R1CompleteWorldPersistentRenderer({
    canvas,
    packageRecord,
    viewport: viewport()
  });
  await renderer.initialize();
  trace('RENDERER_INITIALIZED', renderer.getReceipt());

  let frameSequence = 0;
  let latestFrame = null;
  const intake = installHEarthRun8ER3D2PointerTouchIntake({
    surface: canvas,
    onProposal(proposalRecord, navigationState) {
      if (proposalRecord?.accepted !== true) return;
      frameSequence += 1;
      const packet = createHEarthRun8ER3AFrameUniformPacket({
        navigationState,
        viewport: viewport(),
        frameSequence
      });
      latestFrame = renderer.renderFrame(packet);
      root.dataset.gestureUsed = 'true';
      status.textContent = `Complete-world candidate active · frame ${latestFrame.frameSequence} · navigation ${latestFrame.navigationSequence}`;
    }
  });

  frameSequence += 1;
  const initialPacket = createHEarthRun8ER3AFrameUniformPacket({
    navigationState: intake.getNavigationState(),
    viewport: viewport(),
    frameSequence
  });
  latestFrame = renderer.renderFrame(initialPacket);
  trace('FIRST_VISIBLE_FRAME', latestFrame);

  const receipt = Object.freeze({
    receiptType: 'H_EARTH_C2_R1_COMPLETE_WORLD_ISOLATED_OCCURRENCE_RECEIPT',
    eligible: true,
    status: 'COMPLETE_WORLD_ISOLATED_OCCURRENCE_READY_FOR_ROLE_3',
    objectId: 'H_EARTH:C2_R1:COASTAL_SUCCESSOR',
    executionHistoryId: 'H_EARTH:C2_R1:PR_418:HISTORY_001',
    activeEdgeId: 'H_EARTH:C2_R1:COASTAL_COMPONENT_TO_COMPLETE_WORLD_CANDIDATE',
    operationId: 'H_EARTH_C2_R1_COMPLETE_WORLD_INTEGRATION_001',
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
    packageRecord,
    getReceipt: () => JSON.parse(JSON.stringify({ ...receipt, renderer: renderer.getReceipt(), intake: intake.getReceipt() }))
  });
  root.dataset.ready = 'true';
  status.textContent = 'Complete-world candidate ready for independent Role 3 verification';
  details.textContent = `${packageRecord.completeWorldBinding.counters.boundTerrainVertexCount} terrain vertices and ${packageRecord.completeWorldBinding.counters.boundShorelineVertexCount} shoreline vertices bound; noncoastal package preserved.`;
  window.dispatchEvent(new CustomEvent('h-earth-complete-world-ready', { detail: receipt }));
  trace('READY_EVENT_EMITTED', receipt);
} catch (error) {
  root.dataset.ready = 'false';
  root.dataset.error = 'true';
  status.textContent = 'Complete-world candidate failed to initialize';
  details.textContent = error?.stack || error?.message || String(error);
  trace('COMPLETE_WORLD_FAILURE', { message: error?.message || String(error), stack: error?.stack ?? null });
  console.error(error);
  throw error;
}

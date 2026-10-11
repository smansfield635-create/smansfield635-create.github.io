import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// VM linking instruments only the GPU boundary; the actual binding and actual
// pointer intake/navigation/terrain validator execute unchanged.
if (!vm.SourceTextModule) {
  const child = spawnSync(process.execPath, ['--experimental-vm-modules', fileURLToPath(import.meta.url)], { encoding: 'utf8' });
  process.stdout.write(child.stdout); process.stderr.write(child.stderr);
  process.exit(child.status ?? 1);
}
const root = new URL('../../', import.meta.url);
const intakeUrl = new URL('showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js', root);
const bindingUrl = new URL('showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js', root);
const navigationUrl = new URL('showroom/globe/h-earth/functional-landscape/navigation.js', root);
const { installHEarthRun8ER3D2PointerTouchIntake: install } = await import(intakeUrl);
const { evaluateHEarthFunctionalLandscapeNavigationState: evaluate, proposeHEarthFunctionalLandscapeNavigation: propose } = await import(navigationUrl);
let now = 0, rafId = 0;
const raf = new Map();
class Surface {
  constructor() { this.listeners = new Map(); this.style = {}; this.clientWidth = 1000; this.clientHeight = 1000; }
  addEventListener(type, callback) { this.listeners.set(type, callback); }
  removeEventListener(type) { this.listeners.delete(type); }
  setPointerCapture() {}
  releasePointerCapture() {}
  fire(type, pointerId = 1, clientX = 500, clientY = 500, more = {}) {
    this.listeners.get(type)?.({ pointerId, clientX, clientY, pointerType: 'touch', timeStamp: now, preventDefault() {}, ...more });
  }
}
const documentStub = new Surface(); documentStub.hidden = false; documentStub.visibilityState = 'visible';
documentStub.getElementById = () => null;
globalThis.HTMLElement = Surface;
globalThis.document = documentStub;
Object.defineProperty(globalThis, 'performance', { configurable: true, value: { now: () => now } });
globalThis.requestAnimationFrame = callback => { const id = ++rafId; raf.set(id, callback); return id; };
globalThis.cancelAnimationFrame = id => raf.delete(id);
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };
async function frame(time) { now = time; const callbacks = [...raf.values()]; raf.clear(); callbacks.forEach(callback => callback(time)); await flush(); }
function gesture(surface, action) {
  if (/TURN|PITCH/.test(action)) {
    surface.fire('pointerdown', 1);
    const dx = action === 'TURN_LEFT' ? -150 : action === 'TURN_RIGHT' ? 150 : 0;
    const dy = action === 'PITCH_UP' ? -150 : action === 'PITCH_DOWN' ? 150 : 0;
    surface.fire('pointermove', 1, 500 + dx, 500 + dy);
  } else {
    const inward = action === 'ZOOM_OUT';
    const left = inward ? 200 : 400, right = inward ? 800 : 600;
    surface.fire('pointerdown', 1, left, 500); surface.fire('pointerdown', 2, right, 500);
    if (action.startsWith('MOVE')) {
      const y = action === 'MOVE_FORWARD' ? 350 : 650;
      surface.fire('pointermove', 1, left, y); surface.fire('pointermove', 2, right, y);
    } else {
      surface.fire('pointermove', 1, inward ? 400 : 200, 500);
      surface.fire('pointermove', 2, inward ? 600 : 800, 500);
    }
  }
}
const samples = [];
async function exercise(action, interval, duration = 1000, onProposal = null) {
  now = 0; const surface = new Surface(); const records = [];
  const intake = install({ surface, onProposal: (record, state) => {
    assert.equal(record.afterStateId, state.stateId, 'proposal callback owns its exact state');
    assert.equal(evaluate(state).eligible, true, 'actual terrain/camera validator');
    records.push({ record, state }); onProposal?.(record, state);
  } });
  await frame(0); gesture(surface, action);
  const start = intake.getNavigationState();
  assert.equal(intake.getReceipt().activeIntent, action);
  for (let time = 0; time < duration;) { time = Math.min(duration, time + interval); await frame(time); }
  const end = intake.getNavigationState(); const receipt = intake.getReceipt();
  assert.ok(records.length > 0);
  assert.ok(records.every(({ record }) => record.accepted));
  assert.ok(records.every(({ record }) => record.frameFacts.appliedElapsedSeconds <= 0.05 + 1e-12));
  assert.equal(receipt.counters.acceptedNavigationProposalCount, records.length);
  surface.fire('pointerup', 1); surface.fire('pointerup', 2);
  await frame(duration + 5000); assert.equal(intake.getNavigationState().stateId, end.stateId, 'release stops movement');
  intake.destroy(); assert.equal(raf.size, 0);
  return { start, end, records, receipt };
}
const intervals = [16.7, 33, 50, 100, 150];
for (const action of ['TURN_LEFT','TURN_RIGHT','PITCH_UP','PITCH_DOWN','MOVE_FORWARD','MOVE_BACKWARD','ZOOM_IN','ZOOM_OUT']) {
  let reference = null;
  for (const interval of intervals) {
    const duration = /PITCH|ZOOM/.test(action) ? 300 : 1000;
    const result = await exercise(action, interval, duration);
    const delta = { yaw: result.end.yawDegrees - result.start.yawDegrees, pitch: result.end.pitchDegrees - result.start.pitchDegrees,
      fov: result.end.verticalFovDegrees - result.start.verticalFovDegrees, x: result.end.position.x - result.start.position.x, z: result.end.position.z - result.start.position.z };
    if (!reference) reference = delta;
    for (const key of Object.keys(delta)) assert.ok(Math.abs(delta[key] - reference[key]) < 1e-8, `${action}/${interval}/${key} frame interval parity`);
    if (action === 'TURN_RIGHT') assert.ok(Math.abs(delta.yaw - 72) < 1e-8);
    if (action === 'TURN_LEFT') assert.ok(Math.abs(delta.yaw + 72) < 1e-8);
    if (action.startsWith('MOVE')) assert.ok(Math.abs(Math.hypot(delta.x, delta.z) - 7.5) < 1e-8);
    samples.push({ action, frameIntervalMs: interval, durationMs: duration, delta, acceptedProposals: result.records.length });
  }
}
// Exact callback identity when multiple frames arrive before callbacks drain.
{
  now = 0; const surface = new Surface(); let callbacks = 0;
  const intake = install({ surface, onProposal: (record, state) => { assert.equal(record.afterStateId, state.stateId); callbacks++; } });
  await frame(0); gesture(surface, 'TURN_RIGHT');
  for (const time of [100, 200]) { now = time; const jobs = [...raf.values()]; raf.clear(); jobs.forEach(job => job(time)); }
  await flush(); assert.equal(callbacks, 4); intake.destroy();
}
// Contact changes, cancellation, suspension and long stalls cannot replay stale time.
for (const release of ['pointerup','pointercancel','lostpointercapture']) {
  now = 0; const surface = new Surface(); const intake = install({ surface });
  await frame(0); gesture(surface, 'TURN_RIGHT'); await frame(100);
  const state = intake.getNavigationState(); surface.fire(release); await frame(5000);
  assert.equal(intake.getNavigationState().stateId, state.stateId);
  gesture(surface, 'TURN_RIGHT'); await frame(5050);
  assert.ok(Math.abs(intake.getNavigationState().yawDegrees - state.yawDegrees - 3.6) < 1e-8, 'restart ignores pre-gesture idle time');
  intake.destroy(); assert.equal(surface.listeners.size, 0);
}
{
  now = 0; const surface = new Surface(); const intake = install({ surface });
  await frame(0); gesture(surface, 'TURN_RIGHT'); await frame(5000);
  assert.ok(Math.abs(intake.getNavigationState().yawDegrees - 10.8) < 1e-8, 'long stalls bounded to150ms');
  await frame(5050); assert.ok(Math.abs(intake.getNavigationState().yawDegrees - 14.4) < 1e-8, 'no accumulated stall backlog');
  surface.fire('pointermove', 1, 350, 500); await frame(5100);
  assert.ok(Math.abs(intake.getNavigationState().yawDegrees - 10.8) < 1e-8, 'reversal takes effect immediately');
  surface.fire('pointerdown', 2, 600, 500); const state = intake.getNavigationState(); await frame(5200);
  assert.equal(intake.getNavigationState().stateId, state.stateId, 'contact addition clears prior intent');
  documentStub.hidden = true; documentStub.visibilityState = 'hidden'; documentStub.fire('visibilitychange'); await frame(10000);
  documentStub.hidden = false; documentStub.visibilityState = 'visible'; documentStub.fire('visibilitychange'); await frame(11000);
  assert.equal(intake.getNavigationState().stateId, state.stateId, 'hidden/resume does not replay gesture');
  intake.destroy(); assert.equal(documentStub.listeners.size, 0);
}
// Actual navigation authority continues rejecting traversal outside the world.
const initial = (await exercise('TURN_RIGHT', 50, 50)).start;
const rejected = propose(initial, { action: 'SET_CAMERA_POSITION', position: { x: 1e8, z: 1e8 } });
assert.equal(rejected.ok, false); assert.equal(rejected.state.stateId, initial.stateId);

// Link the real binding to an instrumented GPU, without materializing vegetation
// in a controller test. Separate browser qualification exercises real WebGL.
let renders = 0, captures = 0, presents = 0, packetState = null;
const renderer = {
  initialize: async () => ({}), renderFrame: packet => { renders++; packetState = packet.navigationState; },
  presentColorFrame: () => { presents++; },
  captureColorFrame: () => { captures++; return { pngDataUrl: 'data:image/png;base64,test', summary: { byteHash: packetState.stateId } }; },
  getResourceReceipt: () => ({ packageUploadedOnce: true, resourceIdentityStable: true, noPostInitializationResourceCreation: true, noPostInitializationBufferUpload: true })
};
class Canvas {}
const context = vm.createContext({ URLSearchParams, HTMLElement: Surface, HTMLCanvasElement: Canvas, document: documentStub,
  performance: { now: () => now }, queueMicrotask, requestAnimationFrame, cancelAnimationFrame, console });
const stub = (exports) => new vm.SyntheticModule(Object.keys(exports), function () { for (const [key,value] of Object.entries(exports)) this.setExport(key,value); }, { context });
const packageStub = stub({ prepareHEarthRun8ER2CanonicalLiveRenderPackage: async () => ({}) });
const packetStub = stub({ createHEarthRun8ER3AFrameUniformPacket: ({ navigationState }) => ({ navigationState, camera: { position: navigationState.position, viewProjectionMatrix: [] }, verticalFovDegrees: navigationState.verticalFovDegrees, worldBuiltBecauseCameraMoved: false, successorTerrainCameraReconciled: true }) });
const rendererStub = stub({ createHEarthRun8ER3CPersistentRenderer: async () => renderer });
await rendererStub.link(() => {}); await rendererStub.evaluate();
const bindingModule = new vm.SourceTextModule(fs.readFileSync(bindingUrl,'utf8'), { context, identifier: bindingUrl.href, importModuleDynamically: async () => rendererStub });
await bindingModule.link(specifier => specifier.includes('live-render-package') ? packageStub : packetStub); await bindingModule.evaluate();
const frames = [];
const binding = await bindingModule.namespace.createHEarthRun8ER3D3LiveGpuBinding({ canvas: new Canvas(), initialNavigationState: initial, onFramePresented: frame => frames.push(frame) });
const baselineRenders = renders, baselineCaptures = captures;
const integrated = await exercise('TURN_RIGHT', 150, 150, (record,state) => binding.acceptNavigationState(record,state));
await flush();
assert.equal(integrated.records.length, 3); assert.equal(renders - baselineRenders, 1, 'three accepted substeps make one GPU draw');
assert.equal(binding.getReceipt().counters.navigationStateAcceptanceCount, 3);
assert.equal(frames.at(-1).navigationStateId, integrated.end.stateId);
assert.equal(captures, baselineCaptures, 'navigation has no readback/PNG capture');
assert.equal(presents, renders);
assert.throws(() => binding.acceptNavigationState({ accepted:true, afterStateId:'wrong' }, integrated.end), /MISMATCH/);
// Explicit capture while a valid substep is pending must use the matching state.
const one = integrated.records[0]; const beforeCapture = renders;
binding.acceptNavigationState(one.record, one.state);
binding.acceptNavigationState({ accepted:false }, integrated.end);
const evidence = binding.captureLatestEvidence('pending-capture');
assert.equal(evidence.navigationStateId, one.state.stateId);
assert.equal(evidence.colorSummary.byteHash, one.state.stateId);
await flush(); assert.equal(renders - beforeCapture, 1, 'explicit flush consumes queued presentation exactly once');
assert.equal(binding.getReceipt().counters.rejectedProposalCount, 1);
console.log(JSON.stringify({ status:'PASS', checkpoint:'CP3B_PRODUCT_INTEGRATION_CONTRACT', runtime:process.version,
  cases:samples.length, samples, actualNavigationAndTerrainValidator:true, callbackStateIdentity:'PASS', releaseCancelSuspensionAndStall:'PASS',
  integratedPresentation:{ acceptedSubsteps:3, gpuDraws:1, navigationReadbacks:0 }, androidAcceptance:'PENDING',
  productMutationPaths:['showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js','showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js'] },null,2));

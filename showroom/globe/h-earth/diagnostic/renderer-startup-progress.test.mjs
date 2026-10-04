import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const source = async path => readFile(new URL(path, root), 'utf8');

test('renderer construction and uploads expose measured chunk progress', async () => {
  const renderer = await source('render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js');
  assert.match(renderer, /export async function createHEarthRun8ER3CPersistentRenderer/);
  assert.match(renderer, /function\* createExposedWaterContactFieldSteps/);
  assert.match(renderer, /createExposedWaterContactFieldAsync/);
  assert.match(renderer, /CONTACT_TRIANGLES/);
  assert.match(renderer, /CONTACT_INTERSECTIONS/);
  assert.match(renderer, /CONTACT_VERTEX_SAMPLES/);
  assert.match(renderer, /await yieldControl\(\)/);
  assert.match(renderer, /await yieldToBrowserPaint\(\)/);
  assert.match(renderer, /bufferSubData\(target,start\*data\.BYTES_PER_ELEMENT,chunk\)/);
  assert.match(renderer, /totalStartupUploadBytes/);
  assert.match(renderer, /Math\.max\(lastStartupPercent/);
  assert.match(renderer, /progressCallback\(Object\.freeze\(\{phase,completed,total,unit,progress,status:label\}\)\)/);
});

test('binding waits for renderer preparation and initialization before presentation', async () => {
  const binding = await source('diagnostic/run8e-r3d/live-gpu-binding.js');
  assert.match(binding, /export async function createHEarthRun8ER3D3LiveGpuBinding/);
  assert.match(binding, /const renderer = await createHEarthRun8ER3CPersistentRenderer/);
  assert.match(binding, /const initialization = await renderer\.initialize\(initialPacket,\{onStartupProgress\}\)/);
  assert.ok(binding.indexOf('const initialization = await renderer.initialize') < binding.indexOf('presentNavigationState(initialNavigationState'));
});

test('public integration awaits binding before reading its receipt', async () => {
  const integration = await source('functional-landscape/public-live-gpu-integration.run8e-r3e.js');
  assert.match(integration, /binding = await createHEarthRun8ER3D3LiveGpuBinding/);
  assert.match(integration, /h-earth-renderer-startup-progress/);
  const startup = integration.indexOf('binding = await createHEarthRun8ER3D3LiveGpuBinding');
  assert.ok(startup >= 0 && startup < integration.indexOf('const bindingReceipt = binding.getReceipt()', startup));
});

test('loader follows measured events, stays monotonic, and reserves 100% for ready', async () => {
  const loader = await source('arrival-loader.js');
  assert.doesNotMatch(loader, /startBoundedActivity|activeCeiling|activityTimer/);
  assert.match(loader, /h-earth-renderer-startup-progress/);
  assert.match(loader, /Math\.max\(verifiedProgress,Math\.min\(99,detail\.progress\)\)/);
  assert.match(loader, /const readyPublished=receipt\.stages\.READY_PUBLISHED==='PASS'/);
  assert.match(loader, /displayedProgress=100/);
  assert.match(loader, /prefers-reduced-motion/);
  assert.match(loader, /setAttribute\('role','status'\)/);
});

test('contact-field work is deterministic and async execution yields after completed chunks', async () => {
  const renderer = await source('render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js');
  const start = renderer.indexOf('function* createExposedWaterContactFieldSteps');
  const end = renderer.indexOf('export const H_EARTH_RUN_8E_R3C_RENDERER_ID', start);
  assert.ok(start >= 0 && end > start);
  const helperSource = renderer.slice(start, end);
  const context = { performance: { now: () => 100 }, setTimeout };
  vm.runInNewContext(helperSource + ';globalThis.runtime={createExposedWaterContactFieldSteps,createExposedWaterContactFieldAsync};', context);
  const runtime = context.runtime;
  const views = { positions: new Float32Array([0,0,0, 10,0,0, 0,0,10, 0,-1,0, 10,1,0, 0,-1,10]), indices: new Uint32Array([0,1,2,3,4,5]) };
  const spans = [
    { role: 'TERRAIN', indexStart: 0, indexCount: 3 },
    { materialIntent: 'ONE_CONTINUOUS_OPEN_OCEAN_TO_GEOMETRIC_HORIZON', indexStart: 3, indexCount: 3 }
  ];
  const drain = () => {
    const iterator = runtime.createExposedWaterContactFieldSteps(views, spans), events = [];
    let step;
    do { step = iterator.next(); if (!step.done) events.push(step.value); } while (!step.done);
    return { events, result: { ...step.value, packageDistances: Array.from(step.value.packageDistances) } };
  };
  const first = drain(), second = drain();
  assert.deepEqual(first, second);
  assert.ok(first.result.stats.contactSegments > 0);
  assert.ok(first.events.some(event => event.phase === 'CONTACT_TRIANGLES' && event.completed === event.total));
  assert.ok(first.events.some(event => event.phase === 'CONTACT_INTERSECTIONS' && event.completed === event.total));
  assert.ok(first.events.some(event => event.phase === 'CONTACT_VERTEX_SAMPLES' && event.completed === event.total));
  let yields = 0;
  const progress = [];
  const result = await runtime.createExposedWaterContactFieldAsync(views, spans, {
    yieldControl: async () => { yields += 1; },
    onProgress: event => progress.push(event)
  });
  assert.equal(result.stats.contactSegments, first.result.stats.contactSegments);
  assert.deepEqual(Array.from(result.packageDistances), first.result.packageDistances);
  assert.ok(yields > 0);
  assert.ok(progress.every((event, index) => index === 0 || event.progress >= progress[index - 1].progress));
  assert.equal(progress.at(-1).phase, 'CONTACT_FIELD_COMPLETE');
});

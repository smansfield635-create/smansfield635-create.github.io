import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {performance} from 'node:perf_hooks';

const baselineHead = 'f64ce197d6bd54cd3627458fc138295e9913f761';
const path = 'h-earth-3d/terrain/h-earth.gen2514-qualified-terrain-field.js';
const root = new URL('../../', import.meta.url);
const baselineSource = execFileSync('git', ['show', `${baselineHead}:${path}`], {cwd: root, encoding: 'utf8'});
assert.equal(createHash('sha256').update(baselineSource).digest('hex'), 'ddd63b19a9fd07301ba9af248b64142d7807426d2070efe78828f601f3badb00');
const candidateSource = readFileSync(new URL(path, root), 'utf8');
let moduleSequence = 0;
function load(source, instrument = false, inspect = false) {
  if (inspect) {
    const marker = "  function slot(x, z) {";
    assert.equal(source.split(marker).length, 2);
    source = "const testCacheStorage = [];\n" + source.replace(marker, "  testCacheStorage.push({xs,zs,values});\n" + marker)
      + "\nexport {testCacheStorage};";
  }
  // Keep instrumentation inside the test module: production exposes no cache
  // mutation/diagnostics API. Count actual formula executions, not timing noise.
  if (instrument) {
    const marker = 'function evaluateRawElevation(worldX, worldZ) {';
    assert.equal(source.split(marker).length, 2);
    source = source.replace(marker, `let rawEvaluationCount = 0;\n${marker}\nrawEvaluationCount++;`)
      + '\nexport {rawEvaluationCount};';
  }
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}#${moduleSequence++}`);
}
const baseline = await load(baselineSource);
const candidate = await load(candidateSource);
function assertFrozenTree(value) {
  if (value === null || typeof value !== 'object') return;
  assert(Object.isFrozen(value));
  for (const child of Object.values(value)) assertFrozenTree(child);
}

test('exact baseline outputs across feature boundaries, domain and continuation', () => {
  const points = [];
  const xs = [-1024,-256,-250,-232,-220,-198,-170,-148,-125,-92,-82,-58,-52,-48,-18,0,18,48,52,72,86,118,119,132,148,198,220,232,256,1024];
  for (const x of xs) {
    const shoreline = baseline.getHEarthCanonicalShorelineZ(x);
    for (const distance of [-40,-18,-0.00001,0,0.00001,12,18,28,38,42,49,62,82,112,180,300]) points.push([x, shoreline-distance]);
  }
  let seed = 0x2795;
  const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2**32);
  for (let i=0;i<2048;i++) points.push([-1400+2800*random(), -1400+2400*random()]);
  points.push([Number.MIN_VALUE,-Number.MIN_VALUE],[Number.MAX_VALUE,Number.MAX_VALUE],[-Number.MAX_VALUE,-Number.MAX_VALUE]);
  for (const [x,z] of points) {
    assert.equal(candidate.sampleHEarthTerrainElevation(x,z), baseline.sampleHEarthTerrainElevation(x,z));
    const result = candidate.sampleHEarthTerrainField(x,z);
    assert.deepStrictEqual(result, baseline.sampleHEarthTerrainField(x,z));
    assertFrozenTree(result);
    assert.strictEqual(candidate.sampleHEarthTerrainField(x,z), result);
  }
  for (const name of ['H_EARTH_TERRAIN_FIELD','H_EARTH_GRATITUDE_COASTAL_SYSTEM','H_EARTH_INLAND_MOUNTAIN_WATERSHED_SYSTEM']) {
    assert.deepStrictEqual(candidate[name], baseline[name]);
    assertFrozenTree(candidate[name]);
  }
});

test('signed zeros and distinct adjacent IEEE coordinates never share a field record', async () => {
  const fresh = await load(candidateSource);
  const elevations = await load(candidateSource,true);
  for (const x of [0,-0]) for (const z of [0,-0]) {
    assert.equal(elevations.sampleHEarthTerrainElevation(x,z),baseline.sampleHEarthTerrainElevation(x,z));
    elevations.sampleHEarthTerrainElevation(x,z);
  }
  assert.equal(elevations.rawEvaluationCount,8);
  for (const bad of [NaN,Infinity,-Infinity,undefined,null,'4']) elevations.sampleHEarthTerrainElevation(bad,0);
  assert.equal(elevations.rawEvaluationCount,8);
  const records = [];
  for (const x of [0,-0]) for (const z of [0,-0]) {
    const result = fresh.sampleHEarthTerrainField(x,z);
    assert.deepStrictEqual(result, baseline.sampleHEarthTerrainField(x,z));
    assert(Object.is(result.world.x,x));
    assert(Object.is(result.world.z,z));
    assert(!records.includes(result));
    records.push(result);
    assert.strictEqual(fresh.sampleHEarthTerrainField(x,z),result);
  }
  const first = fresh.sampleHEarthTerrainField(1,-150);
  const adjacent = fresh.sampleHEarthTerrainField(1+Number.EPSILON,-150);
  assert.notStrictEqual(first,adjacent);
  assert.deepStrictEqual(adjacent,baseline.sampleHEarthTerrainField(1+Number.EPSILON,-150));
});

test('nonfinite rejection, nested rejection immutability, and valid mutation rejection survive', () => {
  for (const bad of [NaN,Infinity,-Infinity,undefined,null,'4']) for (const [x,z] of [[bad,1],[1,bad]]) {
    assert.equal(candidate.sampleHEarthTerrainElevation(x,z),baseline.sampleHEarthTerrainElevation(x,z));
    const result=candidate.sampleHEarthTerrainField(x,z);
    assert.deepStrictEqual(result,baseline.sampleHEarthTerrainField(x,z));
    assertFrozenTree(result);
  }
  const invalid={nested:{value:3}};
  const rejected=candidate.sampleHEarthTerrainField(invalid,0);
  assertFrozenTree(rejected);
  assert.throws(()=>{invalid.nested.value=4;},TypeError);
  const result=candidate.sampleHEarthTerrainField(50,-150);
  for (const child of [result.world,result.gradient,result.normal]) {
    assert.throws(()=>{child.x=999;},TypeError);
    assert.throws(()=>{child.extra=999;},TypeError);
  }
  assert.throws(()=>{result.elevation=999;},TypeError);
  assert.deepStrictEqual(candidate.sampleHEarthTerrainField(50,-150),baseline.sampleHEarthTerrainField(50,-150));
});

test('fixed cache stays bounded and collisions recompute exact immutable records', async () => {
  const fresh=await load(candidateSource,false,true);
  assert.equal(fresh.testCacheStorage.length,1);
  const storage=fresh.testCacheStorage[0];
  assert.equal(storage.values.length,16384);
  assert.equal(storage.xs.length,16384);
  assert.equal(storage.zs.length,16384);
  const oldest=fresh.sampleHEarthTerrainField(10,-100);
  const originalSlot=storage.values.indexOf(oldest);
  assert(originalSlot>=0);
  let collision;
  // Observe an actual replacement, rather than duplicating the production hash
  // to manufacture an alleged collision. Every generated coordinate is distinct.
  for(let i=1;i<=200000;i++) {
    const result=fresh.sampleHEarthTerrainField(10+i,-100-i);
    assert.strictEqual(fresh.sampleHEarthTerrainField(10+i,-100-i),result);
    if(storage.values[originalSlot]!==oldest) {collision=result;break;}
  }
  assert(collision,'Expected an observed collision in the bounded working set');
  assert.deepStrictEqual(collision,baseline.sampleHEarthTerrainField(collision.world.x,collision.world.z));
  const rebuilt=fresh.sampleHEarthTerrainField(10,-100);
  assert.notStrictEqual(rebuilt,oldest);
  assert.deepStrictEqual(rebuilt,oldest);
  assertFrozenTree(rebuilt);
  for(let i=0;i<32768;i++) fresh.sampleHEarthTerrainField(-40000-i,-30000-i);
  assert.equal(storage.values.length,16384);
  assert.equal(storage.xs.length,16384);
  assert.equal(storage.zs.length,16384);
  assert(storage.values.filter(Boolean).length<=16384);
});

test('repeated field requests avoid formula executions with unchanged elevation sampling', async () => {
  const fresh=await load(candidateSource,true);
  fresh.sampleHEarthTerrainField(50,-120);
  assert.equal(fresh.rawEvaluationCount,5);
  fresh.sampleHEarthTerrainField(50.5,-120);
  assert.equal(fresh.rawEvaluationCount,10);
  for(let i=0;i<10000;i++) fresh.sampleHEarthTerrainField(50,-120);
  assert.equal(fresh.rawEvaluationCount,10);
  // Scalar samples retain their original stateless computation path.
  fresh.sampleHEarthTerrainElevation(50,-120);
  fresh.sampleHEarthTerrainElevation(50,-120);
  assert.equal(fresh.rawEvaluationCount,12);
});

test('repeated full field requests remove formula work; report host CPU timing', async t => {
  const before=await load(baselineSource,true), after=await load(candidateSource,true);
  const points=Array.from({length:256},(_,i)=>[-160+(i%16)*4,-220+Math.floor(i/16)*4]);
  const run=mod=>{const start=performance.now(); for(let j=0;j<100;j++) for(const [x,z] of points) mod.sampleHEarthTerrainField(x,z); return performance.now()-start;};
  const baselineMs=run(before), candidateMs=run(after);
  assert.equal(before.rawEvaluationCount,128000);
  assert(after.rawEvaluationCount<before.rawEvaluationCount/20);
  t.diagnostic(JSON.stringify({samples:25600,baselineMs,candidateMs,baselineFormulaCalls:before.rawEvaluationCount,candidateFormulaCalls:after.rawEvaluationCount}));
});

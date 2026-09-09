import assert from 'node:assert/strict';
import {FRONTIER_CYCLE_MS, FRONTIER_PHASES, getFrontierCycleState, deterministicUnit} from './frontier-cycle1.state.mjs';
assert.equal(FRONTIER_CYCLE_MS,12000);
assert.deepEqual(FRONTIER_PHASES.map(x=>x.id),['QUIESCENT','AWAKEN','FLOW','ENERGY','TRANSFORMED','RESET']);
for(let i=0;i<=120;i+=1){
  const t=(i/120)*FRONTIER_CYCLE_MS;
  const a=getFrontierCycleState(t,false);
  const b=getFrontierCycleState(t+FRONTIER_CYCLE_MS,false);
  assert.equal(a.phase,b.phase);
  for(const key of ['awaken','flow','energy','transformed','reset','waterPulse','energyPulse','inspection','windowLevel']){
    assert.ok(Number.isFinite(a[key]));
    assert.ok(a[key]>=0&&a[key]<=1,`${key}:${a[key]}`);
    assert.equal(a[key],b[key],`cycle mismatch ${key}`);
  }
}
for(let i=0;i<50;i+=1) assert.equal(deterministicUnit(0x41d06a31,i),deterministicUnit(0x41d06a31,i));
const rm=getFrontierCycleState(0,true);
assert.equal(rm.phase,'TRANSFORMED');
assert.equal(rm.transformed,1);
console.log(JSON.stringify({result:'PASS',cycleMs:FRONTIER_CYCLE_MS,phaseCount:FRONTIER_PHASES.length,deterministicReplay:true,reducedMotion:'TRANSFORMED'}));

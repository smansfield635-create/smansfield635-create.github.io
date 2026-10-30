import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {fileURLToPath} from 'node:url';
import {POSES,WARMUP_POSE,CAPTURE_STEPS} from './qualify.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
// Exercise the actual production queue and placements from the frozen checkout;
// fake only asynchronous GLB completion, not its eligibility or queue behavior.
const collection=fs.readFileSync(path.join(root,'showroom/globe/h-earth/render/geometry-tree-collection.v1.js'),'utf8');
const jacaranda=fs.readFileSync(path.join(root,'showroom/globe/h-earth/render/geometry-jacaranda.v1.js'),'utf8');
const placementsSource=collection.match(/export const TREE_PLACEMENTS=([\s\S]*?\.map\(Object\.freeze\)\));/);
assert.ok(placementsSource,'production placement declaration must be identifiable');
const placements=new Function('return '+placementsSource[1])();
const queueStart=collection.indexOf('export function createCollectionLoadQueue(');
const queueEnd=collection.indexOf('export function createTreeCollection(',queueStart);
assert.ok(queueStart>=0&&queueEnd>queueStart,'production queue boundaries must be identifiable');
const createQueue=new Function(collection.slice(queueStart,queueEnd).replace('export ','')+';return createCollectionLoadQueue;')();
const jacarandaTargetSource=jacaranda.match(/export const JACARANDA_TARGET=(Object\.freeze\([^;]+\));/);
assert.ok(jacarandaTargetSource,'production original jacaranda target must be identifiable');
const jacarandaTarget=new Function('return '+jacarandaTargetSource[1])();
const idleIds=new Set(['COLLECTION_COASTAL_01','COLLECTION_COASTAL_02','COLLECTION_COASTAL_03','COLLECTION_SEARSIA']);
function recordedFixture(){
 let active=0,maxActive=0;const starts=[];
 const entries=placements.map(p=>{
  let state=idleIds.has(p.id)?'IDLE':'READY';
  return {p,overlay:{getReceipt:()=>({state,ready:state==='READY'}),start:async()=>{
   starts.push(p.id);active++;maxActive=Math.max(maxActive,active);state='LOADING';
   await Promise.resolve();state='READY';active--;
  }}};
 });
 return {entries,queue:createQueue(entries),starts,get maxActive(){return maxActive;}};
}
const finishMicrotasks=()=>new Promise(resolve=>setImmediate(resolve));

test('recorded five-ready four-idle state cannot load missing assets at the failed inland pose',async()=>{
 const f=recordedFixture();
 assert.equal(1+f.entries.filter(e=>e.overlay.getReceipt().ready).length,5);
 assert.equal(f.entries.filter(e=>e.overlay.getReceipt().state==='IDLE').length,4);
 for(let i=0;i<3;i++){assert.equal(f.queue.request(POSES[0]),false);await finishMicrotasks();}
 assert.deepEqual(f.starts,[]);
 assert.equal(f.queue.getReceipt().attemptedCount,0);
});

test('existing meadow pose puts all nine production anchors safely inside their native request radius',()=>{
 assert.equal(placements.length,8);
 for(const p of [...placements,jacarandaTarget]){
  assert.ok(Math.hypot(WARMUP_POSE.x-p.x,WARMUP_POSE.z-p.z)<160,'20m clearance from the 180m loading boundary');
 }
});

test('production queue loads the four recorded idle assets sequentially at warm-up and then stays settled',async()=>{
 const f=recordedFixture();
 for(let i=0;i<4;i++){
  assert.equal(f.queue.request(WARMUP_POSE),true);
  assert.equal(f.queue.request(WARMUP_POSE),false,'concurrent request remains blocked');
  await finishMicrotasks();
 }
 assert.equal(f.queue.request(WARMUP_POSE),false);
 assert.deepEqual([...f.starts].sort(),[...idleIds].sort());
 assert.equal(f.maxActive,1);
 assert.ok(f.entries.every(e=>e.overlay.getReceipt().ready));
 assert.equal(f.queue.getReceipt().settledCount,4);
 assert.equal(f.queue.getReceipt().loading,false);
 assert.deepEqual(f.queue.getReceipt().failures,{});
 for(const pose of POSES)assert.equal(f.queue.request(pose),false,'no new asset loading during captures');
 assert.equal(f.starts.length,4);
});

test('warm-up plan retains six frozen capture poses and contributes no extra screenshot',()=>{
 assert.ok(Object.isFrozen(POSES)&&POSES.every(Object.isFrozen));
 assert.ok(Object.isFrozen(CAPTURE_STEPS)&&CAPTURE_STEPS.every(Object.isFrozen));
 assert.equal(CAPTURE_STEPS.length,7);
 assert.deepEqual(CAPTURE_STEPS.filter(s=>!s.capture),[{pose:WARMUP_POSE,sequence:9999,capture:false}]);
 assert.equal(WARMUP_POSE,POSES.find(p=>p.name==='protected-meadow'));
 const captures=CAPTURE_STEPS.filter(s=>s.capture);
 assert.equal(captures.length*2,12);
 captures.forEach((s,i)=>{assert.equal(s.pose,POSES[i]);assert.equal(s.sequence,10001+i);});
 assert.equal(new Set(CAPTURE_STEPS.map(s=>s.sequence)).size,7);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {createCollectionLoadQueue} from '../showroom/globe/h-earth/render/geometry-tree-collection.v1.js';
const flush=()=>new Promise(resolve=>setImmediate(resolve));
function fixture(points,{blocked=()=>false}={}){
 let camera={x:0,z:0},pendingFrame=false,notifications=0,active=0,maxActive=0;const starts=[],controls=new Map();
 const entries=points.map(([id,x,z])=>{let state='IDLE';return {p:{id,x,z},overlay:{getReceipt:()=>({state}),start(){starts.push(id);state='LOADING';active++;maxActive=Math.max(active,maxActive);return new Promise((resolve,reject)=>controls.set(id,{finish(ok=true){active--;state=ok?'READY':'FALLBACK';resolve(ok);},reject(){active--;state='IDLE';reject(Error('failed '+id));}}));}}};});
 const queue=createCollectionLoadQueue(entries,{blocked,onSettled:()=>{notifications++;pendingFrame=true;}});
 return {queue,entries,starts,controls,get notifications(){return notifications;},get maxActive(){return maxActive;},move:p=>camera=p,frame(){pendingFrame=false;return queue.request(camera);},get pendingFrame(){return pendingFrame;}};
}
test('stationary completion-driven presenter finishes every eligible asset with bounded concurrency',async()=>{
 const h=fixture([['far',30,0],['near',1,0],['middle',10,0]]);assert.equal(h.frame(),true);
 for(const id of ['near','middle','far']){await flush();assert.equal(h.starts.at(-1),id);assert.equal(h.frame(),false);h.controls.get(id).finish();await flush();assert.equal(h.pendingFrame,true);h.frame();}
 await flush();assert.deepEqual(h.starts,['near','middle','far']);assert.equal(h.maxActive,1);assert.equal(h.notifications,3);assert.equal(h.pendingFrame,false);assert.equal(h.queue.getReceipt().settledCount,3);assert.equal(h.queue.loading,false);
});
test('original Jacaranda loading gate resumes on its settlement presentation',async()=>{
 let originalLoading=true;const h=fixture([['tree',0,0]],{blocked:()=>originalLoading});assert.equal(h.frame(),false);await flush();assert.deepEqual(h.starts,[]);
 originalLoading=false;assert.equal(h.frame(),true);await flush();assert.deepEqual(h.starts,['tree']);h.controls.get('tree').finish();await flush();assert.equal(h.notifications,1);
});
test('rejected asset is attempted once even when it leaves its receipt IDLE',async()=>{
 const h=fixture([['bad',0,0],['good',1,0]]);h.frame();await flush();h.controls.get('bad').reject();await flush();h.frame();await flush();assert.deepEqual(h.starts,['bad','good']);h.controls.get('good').finish();await flush();assert.equal(h.frame(),false);assert.equal(h.queue.getReceipt().failures.bad,'failed bad');assert.equal(h.notifications,2);
});
test('false-returning overlay failure still advances queue without retry',async()=>{
 const h=fixture([['bad',0,0],['good',1,0]]);h.frame();await flush();h.controls.get('bad').finish(false);await flush();h.frame();await flush();assert.deepEqual(h.starts,['bad','good']);h.controls.get('good').finish();await flush();assert.equal(h.frame(),false);
});
test('latest camera selects next asset and excludes distant or exact-radius candidates',async()=>{
 const h=fixture([['first',0,0],['old',10,0],['new',400,0],['boundary',580,0]]);h.frame();await flush();h.move({x:400,z:0});h.controls.get('first').finish();await flush();h.frame();await flush();assert.deepEqual(h.starts,['first','new']);h.controls.get('new').finish();await flush();assert.equal(h.frame(),false);assert.equal(h.queue.getReceipt().attemptedCount,2);
});
test('disposal during load prevents completion presentation and subsequent work',async()=>{
 const h=fixture([['first',0,0],['next',1,0]]);h.frame();await flush();h.queue.dispose();h.controls.get('first').finish();await flush();assert.equal(h.notifications,0);assert.equal(h.frame(),false);assert.equal(h.queue.getReceipt().disposed,true);assert.deepEqual(h.starts,['first']);
});
test('disposal before deferred start avoids any asset start',async()=>{
 const h=fixture([['first',0,0]]);h.frame();h.queue.dispose();await flush();assert.deepEqual(h.starts,[]);assert.equal(h.notifications,0);assert.equal(h.queue.loading,false);
});
test('invalid camera and entirely distant collection never start or notify',async()=>{
 const h=fixture([['far',1000,0]]);for(const camera of [null,{}, {x:NaN,z:0},{x:0,z:Infinity},{x:0,z:0}])assert.equal(h.queue.request(camera),false);await flush();assert.deepEqual(h.starts,[]);assert.equal(h.notifications,0);
});

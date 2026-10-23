import test from 'node:test';
import assert from 'node:assert/strict';
import {makeCavernLightVisibility} from '../showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js';
import {uploadStartupBuffer} from '../showroom/globe/h-earth/render/performance-scheduling.v1.js';
// Frozen pre-repair oracle, intentionally retains original allocation and arithmetic.
function legacyVisibility(meshes){
  const triangles=[];
  for(const mesh of meshes)for(let i=0;i<mesh.indices.length;i+=3){
    const [a,b,c]=[0,1,2].map(k=>Array.from(mesh.positions.slice(mesh.indices[i+k]*3,mesh.indices[i+k]*3+3)));
    triangles.push({a,e1:b.map((v,j)=>v-a[j]),e2:c.map((v,j)=>v-a[j])});
  }
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const dot=(a,b)=>a.reduce((n,v,j)=>n+v*b[j],0);
  return (origin,direction)=>{
    for(const {a,e1,e2} of triangles){
      const h=cross(direction,e2),det=dot(e1,h);if(Math.abs(det)<1e-10)continue;
      const s=origin.map((v,j)=>v-a[j]),u=dot(s,h)/det;if(u< -1e-7||u>1+1e-7)continue;
      const q=cross(s,e1),v=dot(direction,q)/det;if(v< -1e-7||u+v>1+1e-7)continue;
      const distance=dot(e2,q)/det;if(distance>1e-4)return 0;
    }
    return 1;
  };
}
let seed=12345;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const mesh={positions:new Float32Array(Array.from({length:300*9},()=>random()*20-10)),indices:Uint32Array.from({length:300*3},(_,i)=>i)};
const rays=Array.from({length:1500},()=>({origin:Array.from({length:3},()=>random()*30-15),direction:Array.from({length:3},()=>random()*2-1)}));
test('scalar cave visibility matches original for deterministic random triangles and rays',()=>{
 const expected=legacyVisibility([mesh]),actual=makeCavernLightVisibility([mesh]);for(const {origin,direction} of rays)assert.equal(actual(origin,direction),expected(origin,direction));
});
test('cave visibility preserves edge, determinant and minimum-distance tolerances',()=>{
 const m={positions:new Float64Array([0,0,0,1,0,0,0,1,0]),indices:new Uint32Array([0,1,2])},actual=makeCavernLightVisibility([m]),expected=legacyVisibility([m]);
 for(const x of [-1.00001e-7,-1e-7,-.99999e-7,0,.5,1,1+1e-7,1+1.00001e-7])for(const y of [0,.5,1])for(const z of [-1,-1.00001e-4,-1e-4,-.99999e-4,0,1])for(const dz of [0, .99999e-10,1e-10,1.00001e-10,1,-1])assert.equal(actual([x,y,z],[0,0,dz]),expected([x,y,z],[0,0,dz]));
 assert.equal(makeCavernLightVisibility([])([0,0,0],[0,0,1]),1);
});
test('same-input cave benchmark records CPU duration without hardware acceptance claim',t=>{
 const old=legacyVisibility([mesh]),fast=makeCavernLightVisibility([mesh]);let checksum=0;
 for(const ray of rays.slice(0,100)){old(ray.origin,ray.direction);fast(ray.origin,ray.direction);}
 const measure=fn=>{const start=performance.now();for(const ray of rays)checksum+=fn(ray.origin,ray.direction);return performance.now()-start;};
 const oldMs=measure(old),newMs=measure(fast);t.diagnostic(JSON.stringify({rays:rays.length,triangles:300,legacyMilliseconds:oldMs,scalarMilliseconds:newMs,checksum}));
});
for(const Type of [Uint8Array,Float32Array,Uint32Array])test(`startup ${Type.name} upload preserves exact bytes, offsets and byte-cap yields`,async()=>{
 const backing=new Type(800003);for(let i=0;i<backing.length;i++)backing[i]=i%197;
 const data=backing.subarray(3,800000),result=new Uint8Array(data.byteLength),offsets=[],progress=[];let yielded=0,bytesSinceYield=0;
 const receipt=await uploadStartupBuffer(data,{now:()=>0,maxBytes:524288,yieldControl:async()=>{assert.ok(bytesSinceYield<=524288);bytesSinceYield=0;yielded++;},upload:(offset,chunk)=>{assert.ok(chunk instanceof Type);offsets.push(offset);result.set(new Uint8Array(chunk.buffer,chunk.byteOffset,chunk.byteLength),offset);bytesSinceYield+=chunk.byteLength;assert.ok(bytesSinceYield<=524288);},onProgress:n=>progress.push(n)});
 assert.deepEqual(result,new Uint8Array(data.buffer,data.byteOffset,data.byteLength));assert.equal(receipt.uploadedBytes,data.byteLength);assert.equal(receipt.yieldCount,yielded);assert.equal(yielded,Math.ceil(data.byteLength/524288)-1);assert.equal(progress.at(-1),data.byteLength);assert.equal(offsets[0],0);for(let i=1;i<offsets.length;i++)assert.equal(offsets[i]-offsets[i-1],262144);
});
test('startup clock budget yields between calls and accounts for submission versus waits',async()=>{
 let clock=0,yields=0,calls=0;const events=[];
 const receipt=await uploadStartupBuffer(new Uint8Array(262144*3),{now:()=>clock,maxMilliseconds:4,yieldControl:async()=>{events.push('yield');yields++;clock+=10;},upload:()=>{events.push('upload');calls++;clock+=5;}});
 assert.deepEqual(events,['upload','yield','upload','yield','upload']);assert.equal(calls,3);assert.equal(yields,2);assert.equal(receipt.submissionMilliseconds,15);assert.equal(receipt.waitMilliseconds,20);assert.equal(receipt.maxAtomicMilliseconds,5);assert.equal(receipt.atomicOverrunPossible,true);
});
test('empty startup buffer submits and yields nothing',async()=>{
 const receipt=await uploadStartupBuffer(new Float32Array(),{upload:()=>assert.fail('upload'),yieldControl:async()=>assert.fail('yield'),now:()=>0});assert.equal(receipt.uploadedBytes,0);assert.equal(receipt.yieldCount,0);
});
test('invalid startup byte budget fails before submission',async()=>{
 await assert.rejects(uploadStartupBuffer(new Float32Array(10),{maxBytes:3,upload:()=>assert.fail('upload')}),/STARTUP_UPLOAD_BUDGET_INVALID/);
});
test('startup upload failure stops later chunks',async()=>{
 let calls=0;await assert.rejects(uploadStartupBuffer(new Uint8Array(900000),{now:()=>0,upload:()=>{calls++;throw Error('GL failure');},yieldControl:async()=>{}}),/GL failure/);assert.equal(calls,1);
});

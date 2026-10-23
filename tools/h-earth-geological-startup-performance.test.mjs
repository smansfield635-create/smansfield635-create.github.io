import test from 'node:test';
import assert from 'node:assert/strict';
import {createGeologicalTriangleSampler} from '../showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js';
// Frozen baseline oracle.
function legacySample(triangles,x,z){
  let top=null;
  for(const t of triangles){
    if(x<t.box[0]-1e-6||x>t.box[2]+1e-6||z<t.box[1]-1e-6||z>t.box[3]+1e-6)continue;
    const [a,b,c]=t.points,u=((b.z-c.z)*(x-c.x)+(c.x-b.x)*(z-c.z))/t.det,
      v=((c.z-a.z)*(x-c.x)+(a.x-c.x)*(z-c.z))/t.det,w=1-u-v;
    if(Math.min(u,v,w)<-1e-7)continue;
    const y=u*a.y+v*b.y+w*c.y;
    if(!top||y>top.y)top={y,role:t.role};
  }
  return top;
}
function triangle(points,role){const [a,b,c]=points;return {points,role,det:(b.z-c.z)*(a.x-c.x)+(c.x-b.x)*(a.z-c.z),box:[Math.min(...points.map(p=>p.x)),Math.min(...points.map(p=>p.z)),Math.max(...points.map(p=>p.x)),Math.max(...points.map(p=>p.z))]};}
function square(x,z,size,y,role){return [triangle([{x,y,z},{x:x+size,y,z},{x,y,z:z+size}],role),triangle([{x:x+size,y,z},{x:x+size,y,z:z+size},{x,y,z:z+size}],role)];}
let seed=859;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const triangles=Array.from({length:200},(_,i)=>triangle(Array.from({length:3},()=>({x:rand()*80-40,y:rand()*20-10,z:rand()*80-40})),`random${i}`));
test('spatial sampler exactly matches original for deterministic overlapping triangles',()=>{
 const samples=Array.from({length:2000},()=>[rand()*100-50,rand()*100-50]);
 for(const binSize of [1,8,31]){const sample=createGeologicalTriangleSampler(triangles,{binSize});for(const [x,z] of samples)assert.deepEqual(sample(x,z),legacySample(triangles,x,z));}
});
test('bin boundaries preserve expanded box and barycentric tolerances at negative and positive coordinates',()=>{
 const ts=[...square(-16,-8,8,1,'negative'),...square(0,0,8,2,'zero'),...square(8,8,8,3,'positive')],sample=createGeologicalTriangleSampler(ts);
 const eps=[-1.00001e-6,-1e-6,-.99999e-6,-1e-7,0,1e-7,.99999e-6,1e-6,1.00001e-6];
 for(const x0 of [-16,-8,0,8,16])for(const z0 of [-16,-8,0,8,16])for(const dx of eps)for(const dz of eps)assert.deepEqual(sample(x0+dx,z0+dz),legacySample(ts,x0+dx,z0+dz));
});
test('topmost overlap wins and exact height ties preserve original role order',()=>{
 const lower=square(-2,-2,4,1,'lower'),first=square(-2,-2,4,3,'first'),second=square(-2,-2,4,3,'second');
 for(const [ts,expectedRole] of [[[...lower,...first,...second],'first'],[[...second,...first,...lower],'second']]){
  const sample=createGeologicalTriangleSampler(ts);for(const p of [[0,0],[-2,-2],[2,2],[1,-1]])assert.deepEqual(sample(...p),legacySample(ts,...p));
  assert.equal(sample(0,0).role,expectedRole);
 }
});
test('near-degenerate nonzero triangles retain original numerical results',()=>{
 for(const det of [1.00001e-10,1e-9,-1.00001e-10,-1e-9]){
  const ts=[triangle([{x:-8,y:1,z:-8},{x:-7,y:2,z:-8},{x:-8,y:3,z:-8+det}],'thin')],sample=createGeologicalTriangleSampler(ts);
  for(const t of [0,.1,.5,.9,1])for(const e of [-1e-7,0,1e-7]){const x=-8+t,z=-8+det*(1-t)+e;assert.deepEqual(sample(x,z),legacySample(ts,x,z));}
 }
});
test('empty and distant samples remain null; invalid bin sizes fail',()=>{
 assert.equal(createGeologicalTriangleSampler([])(1,2),null);assert.equal(createGeologicalTriangleSampler(triangles)(1e6,-1e6),null);
 for(const binSize of [0,-1,NaN,Infinity])assert.throws(()=>createGeologicalTriangleSampler([],{binSize}),/GEOLOGICAL_SAMPLE_BIN_INVALID/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {buildCavernPalm} from '../../showroom/globe/h-earth/render/geometry-cavern-palms.v1.js';
const digest=p=>createHash('sha256').update(JSON.stringify(p.parts)).digest('hex');
test('all three parts pass public kernel construction and West admission',()=>{
 const p=buildCavernPalm();
 assert.equal(p.parts.length,3);
 for(const part of p.parts)assert.equal(part.valid,true);
 assert.equal(p.fronds.length,15);assert.equal(p.leafletCount,720);
 assert.ok(p.triangleCount<=9000);
 assert.equal(p.runtimeIntegrated,false);
});
test('fixed identity is byte deterministic and distinct identities vary crown form',()=>{
 assert.equal(digest(buildCavernPalm({id:'A'})),digest(buildCavernPalm({id:'A'})));
 assert.notDeepEqual(buildCavernPalm({id:'A'}).fronds.map(f=>f.tip),buildCavernPalm({id:'B'}).fronds.map(f=>f.tip));
});
test('successive trunk rings retain a continuous frame through the full curve',()=>{
 const vertices=buildCavernPalm().parts[0].geometry.vertices;
 let previous;
 for(let k=0;k<=96;k++){
  const a=vertices[k*16],b=vertices[k*16+8];
  const d=[a.x-b.x,a.y-b.y,a.z-b.z],n=Math.hypot(...d),axis=d.map(x=>x/n);
  if(previous)assert.ok(axis.reduce((s,x,i)=>s+x*previous[i],0)>.99);
  previous=axis;
 }
});
test('inward headings place opposite crowns across their own roots',()=>{
 const left=buildCavernPalm({heading:0}),right=buildCavernPalm({heading:Math.PI});
 assert.ok(left.crown[0]>0);assert.ok(right.crown[0]<0);
 assert.ok(Math.abs(left.crown[0]+right.crown[0])<1e-10);
 assert.equal(left.crown[1],left.parameters.height);
});
test('mature fronds droop while inner fronds rise from a compact crown',()=>{
 const p=buildCavernPalm();
 assert.ok(p.fronds.filter(f=>f.tier===0).every(f=>f.tip[1]<f.origin[1]));
 assert.ok(p.fronds.filter(f=>f.tier===1).every(f=>f.tip[1]-f.origin[1]>.8));
 assert.ok(p.fronds.filter(f=>f.tier===2).every(f=>f.tip[1]-f.origin[1]>2.4));
 assert.ok(p.fronds.every(f=>Math.abs(f.origin[1]-p.crown[1])<=.181));
});
test('invalid dimensions fail before geometry construction',()=>{
 for(const parameters of [{height:NaN},{height:0},{lean:100},{radius:0},{frondLength:Infinity}])assert.throws(()=>buildCavernPalm(parameters),/PALM_PARAMETERS_INVALID/);
});
test('frond ends taper and upper leaflets follow the rising stem',()=>{
 const p=buildCavernPalm(),v=p.parts[2].geometry.vertices;
 const length=i=>Math.hypot(v[i+1].x-v[i].x,v[i+1].y-v[i].y,v[i+1].z-v[i].z);
 for(let f=0;f<15;f++){
  const offset=f*48*4;
  assert.ok(length(offset+46*4)<length(offset+24*4)*.15);
  if(f>=10)assert.ok(v[offset+1].y>v[offset].y);
 }
});
test('all 720 leaflet bases lie on their actual frond stem segments',()=>{
 const p=buildCavernPalm(),stems=p.parts[1].geometry.vertices,leaves=p.parts[2].geometry.vertices;
 const xyz=v=>[v.x,v.y,v.z];
 for(let f=0;f<15;f++){
  const centers=Array.from({length:13},(_,k)=>{
   const ring=stems.slice(f*65+k*5,f*65+k*5+5).map(xyz);
   return [0,1,2].map(i=>ring.reduce((s,v)=>s+v[i],0)/5);
  });
  for(let leaf=0;leaf<48;leaf++){
   const root=xyz(leaves[(f*48+leaf)*4]);let distance=Infinity;
   for(let k=0;k<12;k++){
    const a=centers[k],d=centers[k+1].map((x,i)=>x-a[i]),r=root.map((x,i)=>x-a[i]);
    const t=Math.max(0,Math.min(1,r.reduce((s,x,i)=>s+x*d[i],0)/d.reduce((s,x)=>s+x*x,0)));
    distance=Math.min(distance,Math.hypot(...r.map((x,i)=>x-t*d[i])));
   }
   assert.ok(distance<1e-10,`detached leaflet ${f}:${leaf}: ${distance}`);
  }
 }
 assert.equal(p.parameters.radius,.36);
});

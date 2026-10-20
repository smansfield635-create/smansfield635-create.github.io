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
 assert.ok(p.fronds.filter(f=>f.tier===2).every(f=>f.tip[1]>f.origin[1]));
 assert.ok(p.fronds.every(f=>Math.abs(f.origin[1]-p.crown[1])<=.181));
});
test('invalid dimensions fail before geometry construction',()=>{
 for(const parameters of [{height:NaN},{height:0},{lean:100},{radius:0},{frondLength:Infinity}])assert.throws(()=>buildCavernPalm(parameters),/PALM_PARAMETERS_INVALID/);
});

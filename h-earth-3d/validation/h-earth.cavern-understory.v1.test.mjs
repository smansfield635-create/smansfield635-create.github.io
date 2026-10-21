import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import {buildCavernUnderstoryPlant} from '../../showroom/globe/h-earth/render/geometry-cavern-understory.v1.js';
import {buildCavernUnderstoryPlacement,createCavernThresholdSupport,CAVERN_THRESHOLD_PLACEMENTS} from '../../showroom/globe/h-earth/render/cavern-understory-placement.v1.js';
import {CAVERN_PALM_PLACEMENTS} from '../../showroom/globe/h-earth/render/cavern-palm-placement.v1.js';
import {constructGeologicalRuntimeBridge} from '../../showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js';
import {unprojectPlanetVertex} from '../terrain/h-earth.geological-formation-successor.v1.mjs';
const pkg=JSON.parse(zlib.gunzipSync(fs.readFileSync(new URL('../../showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',import.meta.url)))).canonical;
const model=constructGeologicalRuntimeBridge(pkg),before=model.meshes.map(p=>Buffer.from(p.mesh.positions.buffer).toString('base64'));
const cluster=buildCavernUnderstoryPlacement(model),thresholdSupport=createCavernThresholdSupport(model);
test('all four plant forms are deterministic, attached, and kernel-admitted',()=>{
 for(const kind of ['groundcover','broadleaf','fern','flower']){
  const args={id:'SPECIMEN_'+kind,kind,heading:.41,scale:1.1},a=buildCavernUnderstoryPlant(args);
  assert.deepEqual(a,buildCavernUnderstoryPlant(args));
  assert.ok(a.triangleCount>100&&a.triangleCount<600);
  for(const c of a.attachments)assert.deepEqual(c.stemTip,c.leafRoot);
  for(const p of a.parts){assert.equal(p.geometry.attributes.colors.length,p.geometry.vertices.length);assert.ok(p.geometry.vertices.every(v=>[v.x,v.y,v.z].every(Number.isFinite)));}
 }
 assert.throws(()=>buildCavernUnderstoryPlant({kind:'unknown'}),/PARAMETERS/);
 assert.throws(()=>buildCavernUnderstoryPlant({kind:'fern',scale:NaN}),/PARAMETERS/);
});
test('original cluster and bilateral threshold stay inside geometry and draw budgets',()=>{
 assert.equal(cluster.receipt.clusterCount,3);assert.equal(cluster.receipt.plantCount,35);
 assert.equal(new Set(cluster.receipt.placements.map(p=>p.kind)).size,4);
 assert.ok(cluster.receipt.triangleCount<=10000);assert.ok(cluster.receipt.gpuByteLength<=2097152);assert.ok(cluster.meshes.length<=3);
 assert.equal(cluster.receipt.perFrameGeneration,false);
 assert.deepEqual(model.meshes.map(p=>Buffer.from(p.mesh.positions.buffer).toString('base64')),before);
});
test('every rendered vertex has real dry terrain or floor support and clears palms',()=>{
 for(const part of cluster.meshes){
  for(let i=0;i<part.mesh.positions.length;i+=3){
   const q=unprojectPlanetVertex(...part.mesh.positions.slice(i,i+3)),ground=q.z<model.site.portalZ?model.sampleOutdoorAt(q.x,q.z):thresholdSupport(q.x,q.z),water=model.sampleWaterAt(q.x,q.z);
   assert.ok(ground&&Number.isFinite(q.y));assert.ok(q.y>=ground.y-.04,'buried foliage');
   assert.ok(!water||water.y<ground.y-.02);
   assert.ok(!CAVERN_PALM_PLACEMENTS.some(p=>Math.hypot(q.x-p.x,q.z-p.z)<p.radius*1.2+.079));
  }
  assert.ok(part.mesh.indices.every(i=>i<part.mesh.vertexCount));
 }
 for(const c of cluster.contacts){const hit=c.z<model.site.portalZ?model.sampleOutdoorAt(c.x,c.z):thresholdSupport(c.x,c.z);assert.ok(Math.abs(c.rootY-hit.y+.012)<1e-8);}
});
test('missing or submerged terrain prevents construction rather than floating plants',()=>{
 assert.throws(()=>buildCavernUnderstoryPlacement({...model,sampleOutdoorAt:()=>null}),/SUPPORT_MISSING/);
 assert.throws(()=>buildCavernUnderstoryPlacement({...model,sampleWaterAt:()=>({y:100})}),/SUBMERGED/);
});
test('repeated placement produces identical GPU payloads',()=>{
 const second=buildCavernUnderstoryPlacement(model);
 assert.deepEqual(second.receipt,cluster.receipt);
 for(let i=0;i<cluster.meshes.length;i++){assert.deepEqual(second.meshes[i].mesh.positions,cluster.meshes[i].mesh.positions);assert.deepEqual(second.meshes[i].mesh.indices,cluster.meshes[i].mesh.indices);}
});

const ORIGINAL_GPU_PREFIXES=[{"part": "STEMS", "vertices": 1562, "indices": 7956, "positions": "46fafa412493ca4df929fc74475638e796688483d4c5329a91e8c35748d1a9d3", "indexHash": "bca922946efa634bceadf4d36bc9a5b33fe7a30cea208beb7b0932b460393b2b", "colors": "2c797c1203b087e288eae7cc827098aab86f4ba9ef345d2be2fd084afb60f067"}, {"part": "FOLIAGE", "vertices": 1896, "indices": 5916, "positions": "3f95971acb44f0e551905366da94edec2a3131a1a9f1bf6fda534bbbe43818ec", "indexHash": "691f1c6289082480fb0493f20a370977620e59dc12f751991efa9be71ebf9203", "colors": "eb3c103603d566663558cdbc8dcb1b4f593aeb351cd1412f56a592cbd48ee228"}];
test('accepted original17 plants retain exact projected positions indices and colors',()=>{
 const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
 for(const expected of ORIGINAL_GPU_PREFIXES){const p=cluster.meshes.find(p=>p.part===expected.part);
  assert.equal(hash(Buffer.from(p.mesh.positions.slice(0,expected.vertices*3).buffer)),expected.positions);
  assert.equal(hash(Buffer.from(p.mesh.indices.slice(0,expected.indices).buffer)),expected.indexHash);
  assert.equal(hash(JSON.stringify(p.colors.slice(0,expected.vertices))),expected.colors);
 }
});
test('threshold is planted on both sides and through the central walking line',()=>{
 const roots=cluster.receipt.placements.slice(17);
 assert.equal(roots.length,18);assert.ok(roots.filter(p=>p.x<40).length>=8);assert.ok(roots.filter(p=>p.x>40).length>=8);
 assert.ok(roots.some(p=>p.kind==='flower'&&Math.abs(p.x-40)<.6));
 assert.ok(roots.some(p=>p.z>-260));assert.ok(roots.some(p=>p.z<-260));
 assert.equal(cluster.receipt.navigationModified,false);assert.equal(cluster.receipt.walkThroughBrush,true);
});
test('floor-only support crosses the seam and rejects unavailable floor',()=>{
 const sample=createCavernThresholdSupport(model);
 for(const x of [38.5,39.5,40.5,41.5])for(const z of [-260.05,-259.95,-259.5,-259])assert.ok(Number.isFinite(sample(x,z)?.y),x+','+z);
 const noFloor={...model,meshes:model.meshes.filter(p=>p.role!=='CAVERN_PHYSICAL_SHELL')};
 assert.equal(createCavernThresholdSupport(noFloor)(40,-259),null);
 assert.throws(()=>buildCavernUnderstoryPlacement(noFloor),/SUPPORT_MISSING/);
});

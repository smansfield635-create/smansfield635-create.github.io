import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import {buildCavernUnderstoryPlant} from '../../showroom/globe/h-earth/render/geometry-cavern-understory.v1.js';
import {buildCavernUnderstoryPlacement} from '../../showroom/globe/h-earth/render/cavern-understory-placement.v1.js';
import {CAVERN_PALM_PLACEMENTS} from '../../showroom/globe/h-earth/render/cavern-palm-placement.v1.js';
import {constructGeologicalRuntimeBridge} from '../../showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js';
import {unprojectPlanetVertex} from '../terrain/h-earth.geological-formation-successor.v1.mjs';
const pkg=JSON.parse(zlib.gunzipSync(fs.readFileSync(new URL('../../showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',import.meta.url)))).canonical;
const model=constructGeologicalRuntimeBridge(pkg),before=model.meshes.map(p=>Buffer.from(p.mesh.positions.buffer).toString('base64'));
const cluster=buildCavernUnderstoryPlacement(model);
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
test('one layered cluster stays inside independent geometry and draw budgets',()=>{
 assert.equal(cluster.receipt.clusterCount,1);assert.equal(cluster.receipt.plantCount,17);
 assert.equal(new Set(cluster.receipt.placements.map(p=>p.kind)).size,4);
 assert.ok(cluster.receipt.triangleCount<=10000);assert.ok(cluster.receipt.gpuByteLength<=2097152);assert.ok(cluster.meshes.length<=3);
 assert.equal(cluster.receipt.perFrameGeneration,false);
 assert.deepEqual(model.meshes.map(p=>Buffer.from(p.mesh.positions.buffer).toString('base64')),before);
});
test('every rendered vertex has real dry terrain support and clears palms and passage',()=>{
 for(const part of cluster.meshes){
  for(let i=0;i<part.mesh.positions.length;i+=3){
   const q=unprojectPlanetVertex(...part.mesh.positions.slice(i,i+3)),ground=model.sampleOutdoorAt(q.x,q.z),water=model.sampleWaterAt(q.x,q.z);
   assert.ok(ground&&Number.isFinite(q.y));assert.ok(q.y>=ground.y-.04,'buried foliage');
   assert.ok(!water||water.y<ground.y-.02);assert.ok(q.x<37.8,'passage occupied');
   assert.ok(!CAVERN_PALM_PLACEMENTS.some(p=>Math.hypot(q.x-p.x,q.z-p.z)<p.radius*1.2+.079));
  }
  assert.ok(part.mesh.indices.every(i=>i<part.mesh.vertexCount));
 }
 for(const c of cluster.contacts)assert.ok(Math.abs(c.rootY-model.sampleOutdoorAt(c.x,c.z).y+.012)<1e-8);
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

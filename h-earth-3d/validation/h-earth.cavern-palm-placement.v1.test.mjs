import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';import zlib from 'node:zlib';
import {constructGeologicalRuntimeBridge} from '../../showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js';
import {buildCavernPalmPlacement} from '../../showroom/globe/h-earth/render/cavern-palm-placement.v1.js';
import {unprojectPlanetVertex} from '../terrain/h-earth.geological-formation-successor.v1.mjs';
const pkg=JSON.parse(zlib.gunzipSync(fs.readFileSync(new URL('../../showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',import.meta.url))));
const model=constructGeologicalRuntimeBridge(pkg.canonical),before=model.meshes.map(p=>[p.mesh.vertexCount,p.mesh.triangleCount]),p=buildCavernPalmPlacement(model);
test('four grounded palms reuse accepted mesh without changing world surfaces',()=>{
 assert.equal(p.receipt.treeCount,4);assert.equal(p.meshes.length,12);assert.equal(p.receipt.triangleCount,26360);
 assert.deepEqual(model.meshes.map(p=>[p.mesh.vertexCount,p.mesh.triangleCount]),before);
 for(const root of p.receipt.placements){assert.ok(root.rootY<root.supportRange[0]);assert.ok(root.supportRange[1]-root.rootY<1.25);assert.ok(root.z<-260);}
});
test('staggered pairs lean inward and leave central walking column clear',()=>{
 const r=p.receipt.placements;
 assert.ok(r[0].height>r[1].height&&r[2].height>r[3].height);
 for(const root of r)assert.ok(Math.abs(root.crown[0]-40)<Math.abs(root.x-40));
 for(const part of p.meshes)for(let i=0;i<part.mesh.positions.length;i+=3){
  const q=unprojectPlanetVertex(...part.mesh.positions.slice(i,i+3));
  if(q.x>=38&&q.x<=42&&q.z>=-275&&q.z<=-260)assert.ok(q.y>14.3,'occupied approach walking column');
 }
});
test('all render vertices are finite and indices valid; palm palette retained',()=>{
 for(const part of p.meshes){assert.ok(part.mesh.positions.every(Number.isFinite));assert.ok(part.mesh.indices.every(i=>i<part.mesh.vertexCount));assert.equal(part.colors.length,part.mesh.vertexCount);}
});
test('missing support fails closed',()=>{
 assert.throws(()=>buildCavernPalmPlacement({...model,sampleOutdoorAt:()=>null}),/GROUND_CONTACT_MISSING/);
});

test('palms fit independent 2 MiB allowance while geology retains its 4 MiB limit',()=>{
 const bytes=parts=>parts.reduce((n,p)=>n+p.mesh.vertexCount*69+p.mesh.indices.byteLength,0);
 assert.ok(bytes(p.meshes)<2*1024*1024);assert.ok(bytes(model.meshes)<4*1024*1024);
});

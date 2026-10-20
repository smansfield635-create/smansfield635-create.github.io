import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';import zlib from 'node:zlib';import {createHash} from 'node:crypto';
import {constructGeologicalRuntimeBridge} from '../../showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js';
import {buildCavernEntranceIvy} from '../../showroom/globe/h-earth/render/cavern-entrance-ivy.v1.js';
import {unprojectPlanetVertex} from '../terrain/h-earth.geological-formation-successor.v1.mjs';
const pkg=JSON.parse(zlib.gunzipSync(fs.readFileSync(new URL('../../showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',import.meta.url))));
const model=constructGeologicalRuntimeBridge(pkg.canonical);
const digest=parts=>{const h=createHash('sha256');for(const p of parts){h.update(new Uint8Array(p.mesh.positions.buffer));h.update(new Uint8Array(p.mesh.indices.buffer));}return h.digest('hex');};
const before=digest(model.meshes),built=buildCavernEntranceIvy(model);
const distance=(a,b)=>Math.hypot(...a.map((v,k)=>v-b[k]));
test('kernel-admitted static ivy is bounded and leaves all geology bytes unchanged',()=>{
 assert.equal(digest(model.meshes),before);assert.equal(built.meshes.length,3);
 assert.equal(built.receipt.kernelAdmission,'PASS');assert.equal(built.receipt.perFrameGeneration,false);
 assert.ok(built.receipt.gpuByteLength<=1024*1024);assert.ok(built.receipt.leafCount>=250);
 for(const part of built.meshes){assert.ok(part.mesh.positions.every(Number.isFinite));assert.ok(part.mesh.indices.every(v=>v<part.mesh.vertexCount));assert.equal(part.colors.length,part.mesh.vertexCount);}
});
test('all vines start on actual ledge or parent stem and follow retained rock',()=>{
 const trails=new Map(built.diagnostics.trails.map(p=>[p.id,p]));
 for(const t of trails.values()){
  const root=t.points[0];
  if(t.parent){assert.deepEqual(root,trails.get(t.parent.trailId).points[t.parent.pointIndex]);}
  else assert.ok(Math.abs(root[1]-(model.originalTerrainElevationAt(root[0],model.site.portalZ)-.025))<1e-8);
  for(const p of t.points){assert.ok(Math.abs(model.formation.rockFaceFrontAt(p[0],p[1])-p[2]-.035)<1e-8);assert.equal(model.formation.lowerEntranceSeamAt(p[0],p[1]),false);}
 }
 assert.ok(new Set([...trails.values()].filter(t=>!t.parent).map(t=>t.points.length)).size>8);
});
test('every petiole begins on its actual stem segment and ends at the leaf base',()=>{
 const trails=new Map(built.diagnostics.trails.map(p=>[p.id,p]));
 for(const a of built.diagnostics.attachments){
  const p=trails.get(a.trailId).points,i=a.segmentIndex;
  assert.ok(distance(a.root,p[i].map((v,k)=>v+(p[i+1][k]-v)*a.t))<1e-10);
  assert.ok(distance(a.base,a.leafBase)<1e-10);assert.ok(distance(a.root,a.base)<.3);
 }
});
test('moss remains supported above the aperture and vegetation preserves walking clearance',()=>{
 for(const p of built.diagnostics.mossContacts){
  const z=model.formation.rockFaceFrontAt(p[0],p[1]);assert.ok(Number.isFinite(z));assert.ok(Math.abs(z-p[2]-.014)<1e-8);assert.equal(model.formation.lowerEntranceSeamAt(p[0],p[1]),false);
 }
 const moss=built.meshes[2].mesh;
 for(let i=0;i<moss.indices.length;i+=3){
  const tri=[0,1,2].map(k=>{const j=moss.indices[i+k]*3,q=unprojectPlanetVertex(...moss.positions.slice(j,j+3));return [q.x,q.y,q.z];});
  const probes=[...tri.map((a,k)=>a.map((v,j)=>(v+tri[(k+1)%3][j])/2)),[0,1,2].map(j=>tri.reduce((n,p)=>n+p[j],0)/3)];
  for(const p of probes){const z=model.formation.rockFaceFrontAt(p[0],p[1]);assert.ok(Number.isFinite(z));assert.ok(Math.abs(z-p[2]-.014)<.012,'moss triangle bridges or intersects relief');}
 }
 for(const part of built.meshes)for(let i=0;i<part.mesh.positions.length;i+=3){
  const p=unprojectPlanetVertex(...part.mesh.positions.slice(i,i+3));
  if(p.x>=38&&p.x<=42)assert.ok(p.y>14.3,'central walking headroom obstructed');
 }
});
test('same source repeats exactly and unsupported inputs fail closed',()=>{
 const second=buildCavernEntranceIvy(model);assert.equal(digest(second.meshes),digest(built.meshes));assert.deepEqual(second.receipt,built.receipt);
 assert.throws(()=>buildCavernEntranceIvy({}),/ACTUAL_CLIFF_REQUIRED/);
 assert.throws(()=>buildCavernEntranceIvy({...model,formation:{...model.formation,rockFaceFrontAt:()=>null}}),/EMPTY_SUPPORTED_GEOMETRY/);
});

test('cavern shadow projection covers actual foliage and preserves sunward depth including overhead sun',async()=>{
 const {buildCavernShadowMatrix}=await import('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js');
 const {buildCavernPalmPlacement}=await import('../../showroom/globe/h-earth/render/cavern-palm-placement.v1.js');
 const parts=[...built.meshes,...buildCavernPalmPlacement(model).meshes];
 for(const sun of [{x:.4,y:.8,z:.3},{x:0,y:1,z:0}]){
  const matrix=buildCavernShadowMatrix(parts.map(p=>p.mesh.positions),sun);
  assert.ok(matrix.every(Number.isFinite));
  const project=p=>[0,1,2].map(k=>matrix[k]*p[0]+matrix[4+k]*p[1]+matrix[8+k]*p[2]+matrix[12+k]);
  for(const p of parts)for(let i=0;i<p.mesh.positions.length;i+=3){const q=project(p.mesh.positions.slice(i,i+3));assert.ok(q.every(v=>Math.abs(v)<1),'actual caster outside shadow frustum');}
  const p=Array.from(parts[0].mesh.positions.slice(0,3)),n=Math.hypot(sun.x,sun.y,sun.z),toward=p.map((v,k)=>v+[sun.x,sun.y,sun.z][k]/n);
  assert.ok(project(toward)[2]<project(p)[2],'sunward geometry must be closer in depth map');
 }
 assert.throws(()=>buildCavernShadowMatrix([],{x:0,y:1,z:0}),/BOUNDS_INVALID/);
 assert.throws(()=>buildCavernShadowMatrix(parts.map(p=>p.mesh.positions),{x:0,y:0,z:0}),/DIRECTION_INVALID/);
});

// A fan center outside a concave leaf's visibility kernel reverses some faces
// and fills its notches. Test the submitted geometry rather than the outline.
test('lobed leaves retain consistent outward winding without overlapping sinus fans',()=>{
 const mesh=built.meshes[1].mesh;
 for(let i=0;i<mesh.indices.length;i+=3){
  const p=[0,1,2].map(k=>{const j=mesh.indices[i+k]*3;return unprojectPlanetVertex(...mesh.positions.slice(j,j+3));});
  const signedArea=(p[1].x-p[0].x)*(p[2].y-p[0].y)-(p[1].y-p[0].y)*(p[2].x-p[0].x);
  assert.ok(signedArea< -1e-7,'leaf fan triangle reverses across a sinus');
 }
});

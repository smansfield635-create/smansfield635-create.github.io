import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planP8NativeDrySandSedges,P8_SEDGE_ALLOCATION,P8_SEDGE_MATERIAL,P8_SEDGE_FOOTPRINT}
 from '../../showroom/globe/h-earth/render/p8-dry-sand-shoreline-sedge.v1.js';
const tile=(id,x,z)=>({id,minX:Math.floor(x/4)*4,minZ:Math.floor(z/4)*4,
 count:1,first:0,packed:new Float32Array([x,1,z,0]),rootIds:[id]});
const prior=[tile('P3',-100.25,-150.25)],p4=[tile('P4',-99.25,-151.25)],p6=[tile('P6',-98.25,-152.25)];
const accepted=()=>({y:1.5,slope:.23,sandDryContact:true});
const req=(contact,max=128)=>({installedTiles:prior,p4BankTiles:p4,
 p6DryTiles:p6,admitDrySandContact:contact,maximumAddedRoots:max});

test('P8 has bounded independent native dry-sand substrate policy',()=>{
 assert.deepEqual(P8_SEDGE_FOOTPRINT,{minX:-160,maxX:34,minZ:-185,maxZ:-113});
 assert.equal(P8_SEDGE_MATERIAL.sandMinExclusive,.12);
 assert.equal(P8_SEDGE_MATERIAL.sandMaxInclusive,1);
 assert.equal(P8_SEDGE_MATERIAL.slopeMax,.70);
 assert.equal(P8_SEDGE_MATERIAL.minimumWaterClearance,.15);
 assert.equal(P8_SEDGE_MATERIAL.minimumExposedContact,.75);
 assert.equal(P8_SEDGE_ALLOCATION.maximumRoots,80000);
 assert.equal(P8_SEDGE_ALLOCATION.maximumPackedBytes,1280000);
});

test('P8 deterministic physical sedges never reorder P3/P4/P6 source roots',async()=>{
 const before=[...prior,...p4,...p6].map(t=>t.packed.slice());
 const a=await planP8NativeDrySandSedges(req(accepted,192));
 const b=await planP8NativeDrySandSedges(req(accepted,192));
 assert.equal(a.receipt.schema,'H_EARTH_P8_NATIVE_EXPOSED_DRY_SAND_SEDGE_v1');
 assert.equal(a.receipt.addedRoots,192);
 assert.equal(a.receipt.addedGpuBytes,192*16);
 assert.ok(a.receipt.originalRootsObserved>=0);
 assert.deepEqual(a.tiles.map(t=>Array.from(t.packed)),b.tiles.map(t=>Array.from(t.packed)));
 [...prior,...p4,...p6].forEach((t,i)=>assert.deepEqual(t.packed,before[i]));
 const ids=a.tiles.flatMap(t=>t.rootIds);
 assert.equal(ids.length,new Set(ids).size);
 assert.equal(ids.length,a.receipt.addedRoots);
 let cursor=0;
 for(const t of a.tiles){
  assert.equal(t.first,cursor);cursor+=t.count;
  assert.ok(t.count>0&&t.count<=1600&&t.packed instanceof Float32Array);
  assert.equal(t.packed.length,t.count*4);
  assert.ok(t.packed.every(Number.isFinite));
  for(let i=0;i<t.count;i++){
   const x=t.packed[i*4],z=t.packed[i*4+2];
   assert.ok(x>=P8_SEDGE_FOOTPRINT.minX&&x<P8_SEDGE_FOOTPRINT.maxX);
   assert.ok(z>=P8_SEDGE_FOOTPRINT.minZ&&z<P8_SEDGE_FOOTPRINT.maxZ);
  }
 }
 assert.equal(cursor,192);
});

test('P8 completely fails closed on wet or unsupported sandy terrain',async()=>{
 let trials=0;
 const a=await planP8NativeDrySandSedges(req(()=>{trials++;return null;},128));
 assert.ok(trials>0);
 assert.equal(a.receipt.addedRoots,0);
 assert.equal(a.receipt.addedGpuBytes,0);
 assert.equal(a.tiles.length,0);
 assert.equal(a.receipt.rejected.contact,trials);
 assert.equal(a.receipt.contactTrials,trials);
});

test('P8 accepts only positive independently witnessed dry sand contact',async()=>{
 const witness=(x,z)=>x>0&&z>-141&&z<-117?accepted():null;
 const a=await planP8NativeDrySandSedges(req(witness,128));
 assert.ok(a.receipt.addedRoots>0);
 for(const t of a.tiles)for(let i=0;i<t.count;i++){
  const x=t.packed[i*4],z=t.packed[i*4+2];
  assert.ok(x>0&&z>-141&&z<-117);
 }
 assert.ok(a.receipt.rejected.contact>0);
});

test('P8 exclusion zones and plant spacing protect immutable woodland and corridor',async()=>{
 const a=await planP8NativeDrySandSedges(req(accepted,450));
 for(const t of a.tiles)for(let i=0;i<t.count;i++){
  const x=t.packed[i*4],z=t.packed[i*4+2];
  assert.ok(Math.hypot(x+139.40268,z+210.74617)>44-.75);
  assert.ok(Math.hypot(x-80,z+172)>31-.75);
 }
 assert.ok(a.receipt.addedRoots<=450);
 assert.ok(a.receipt.addedGpuBytes<=P8_SEDGE_ALLOCATION.maximumPackedBytes);
});

test('P8 rejects malformed and negative budgets and supports explicit zero',async()=>{
 await assert.rejects(planP8NativeDrySandSedges(),/P8_DRY_SAND_INPUT_INVALID/);
 await assert.rejects(planP8NativeDrySandSedges(req(accepted,-1)),/P8_DRY_SAND_INPUT_INVALID/);
 const a=await planP8NativeDrySandSedges(req(accepted,0));
 assert.equal(a.receipt.addedRoots,0);
 const bad=[{count:2,packed:new Float32Array(4),minX:-140,minZ:-180}];
 await assert.rejects(planP8NativeDrySandSedges({installedTiles:bad,p4BankTiles:[],p6DryTiles:[],
  admitDrySandContact:accepted,maximumAddedRoots:1}),/P8_PROTECTED_TILE_INVALID/);
});

test('P8 exact owner and page bind immutable module identities and separate GPU resource',()=>{
 const owner=readFileSync('showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js','utf8');
 const page=readFileSync('showroom/globe/h-earth/index.html','utf8');
 assert.ok(owner.includes('p8-dry-sand-shoreline-sedge.v1.js?rev=sha-a118a8675207'));
 assert.ok(owner.includes('hillside-bank-ecotone-roots.p6.v1.js?rev=sha-109db7bc3ba4'));
 assert.ok(page.includes('vegetation-single-owner.prototype.v1.js?rev=sha-9d27c336fb62'));
 for(const s of ['planP8NativeDrySandSedges','p6DryTiles:p6Ecotone.tiles',
  'p8FirstFailure:p8FirstFailureReceipt()','P8_SAND_GPU_UPLOAD',
  'p8SedgeGpuBytes:p8GpuBytes','p8SedgeSubmittedTriangles:',
  'uniform int uP8Sedge;','gl.uniform1i(u.uP8Sedge,1);',
  'p8Sedge.receipt.addedRoots','P8_SEDGE_ALLOCATION.maximumPackedBytes'])
  assert.ok(owner.includes(s),'missing P8 source boundary: '+s);
 assert.ok(owner.includes("if(beach.rawSandCoverage<0||beach.rawSandCoverage>.12)"));
 assert.ok(owner.includes("if(hit.slope>.75)"));
 assert.ok(owner.includes("if(geology.sampleWaterAt(x,z))"));
 assert.ok(owner.includes("if(geology.isPlannedWaterFootprint?.(x,z))"));
 for(const s of ['beach.rawSandCoverage>P8_SEDGE_MATERIAL.sandMinExclusive',
  'beach.interpolatedExposedContactDistance<P8_SEDGE_MATERIAL.minimumExposedContact',
  'hit.y<=water.y+P8_SEDGE_MATERIAL.minimumWaterClearance',
  'if(hit.slope>P8_SEDGE_MATERIAL.slopeMax)'])
  assert.ok(owner.includes(s),'missing actual dry sand gate: '+s);
});

test('P8 changes no prior P3/P4/P6/P7 draw counts, enables only independent four-blade sedges',()=>{
 const owner=readFileSync('showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js','utf8');
 const begin=owner.indexOf('function draw(packet)');
 const p4=owner.indexOf('if(p4Added){',begin),p6=owner.indexOf('if(p6Added){',begin),
  p8=owner.indexOf('if(p8Added){',begin),end=owner.indexOf('lastDraw=',p8);
 assert.ok(begin>0&&p4>begin&&p6>p4&&p8>p6&&end>p8);
 const chunks=[owner.slice(begin,p4),owner.slice(p4,p6),owner.slice(p6,p8),owner.slice(p8,end)];
 const count=(s,q)=>s.split(q).length-1;
 assert.equal(count(chunks[0],'gl.drawArraysInstanced(gl.TRIANGLES,0,6,range.count)'),2);
 assert.equal(count(chunks[1],'gl.drawArraysInstanced(gl.TRIANGLES,0,6,range.count)'),2);
 assert.equal(count(chunks[2],'gl.drawArraysInstanced(gl.TRIANGLES,0,24,range.count)'),2);
 assert.equal(count(chunks[3],'gl.drawArraysInstanced(gl.TRIANGLES,0,24,range.count)'),2);
 assert.ok(chunks[0].includes('gl.uniform1i(u.uP8Sedge,0);'));
 assert.ok(chunks[2].includes('gl.uniform1i(u.uP7Tuft,1);'));
 assert.ok(chunks[3].includes('gl.uniform1i(u.uP7Tuft,0);'));
 assert.ok(chunks[3].includes('gl.uniform1i(u.uP8Sedge,1);'));
 assert.ok(chunks[3].includes('gl.uniform1i(u.uP8Sedge,0);'));
});

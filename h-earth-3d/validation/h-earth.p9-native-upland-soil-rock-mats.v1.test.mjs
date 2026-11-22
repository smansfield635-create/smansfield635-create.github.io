import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {P9_UPLAND_ALLOCATION,P9_UPLAND_FOOTPRINT,P9_UPLAND_MATERIAL,planP9NativeUplandMats}
 from '../../showroom/globe/h-earth/render/p9-native-upland-soil-rock-mats.v1.js';
const original=(id,x,z)=>({id,minX:Math.floor(x/4)*4,minZ:Math.floor(z/4)*4,
 count:1,first:0,packed:new Float32Array([x,4,z,0]),rootIds:[id]});
const p3=[original('P3',-28,-209)],p4=[original('P4',-27,-207)],
 p6=[original('P6',-26,-205)],p8=[original('P8',-25,-203)];
const witness=(x,z)=>({y:Math.fround(30+.05*x),slope:.28,
 materialClass:x<48?'COASTAL_SOIL':'STONE_AND_SPARSE_SOIL',
 soilDepth:x<48?.35:.12,rockExposure:.36});
const arg=(admit,max=256)=>({installedTiles:p3,p4BankTiles:p4,p6DryTiles:p6,p8SandTiles:p8,
 admitNativeUplandContact:admit,maximumAddedRoots:max});
const rootList=tiles=>tiles.flatMap(t=>t.rootIds);

test('P9 source defines separately bounded genuine soil and rock upland cover',()=>{
 assert.deepEqual(P9_UPLAND_FOOTPRINT,{minX:-38,maxX:152,minZ:-235,maxZ:-95});
 assert.deepEqual([...P9_UPLAND_MATERIAL.allowedClasses],['COASTAL_SOIL','STONE_AND_SPARSE_SOIL']);
 assert.equal(P9_UPLAND_MATERIAL.coastalSoilMinDepth,.16);
 assert.equal(P9_UPLAND_MATERIAL.stoneSoilMinDepth,.035);
 assert.equal(P9_UPLAND_MATERIAL.rockExposureMax,.86);
 assert.equal(P9_UPLAND_MATERIAL.sandCoverageMax,.12);
 assert.equal(P9_UPLAND_MATERIAL.minimumWaterClearance,.15);
 assert.equal(P9_UPLAND_ALLOCATION.maximumRoots,110000);
 assert.equal(P9_UPLAND_ALLOCATION.maximumPackedBytes,1760000);
});
test('P9 deterministic physical rooted mats preserve all P3 P4 P6 and P8 arrays',async()=>{
 const old=[...p3,...p4,...p6,...p8].map(t=>t.packed.slice());
 const a=await planP9NativeUplandMats(arg(witness,512));
 const b=await planP9NativeUplandMats(arg(witness,512));
 assert.equal(a.receipt.schema,'H_EARTH_P9_NATIVE_UPLAND_SOIL_ROCK_MAT_v1');
 assert.equal(a.receipt.addedRoots,512);
 assert.equal(a.receipt.addedGpuBytes,512*16);
 assert.ok(a.receipt.materialRootCounts.COASTAL_SOIL>0);
 assert.ok(a.receipt.materialRootCounts.STONE_AND_SPARSE_SOIL>0);
 assert.deepEqual(a.tiles.map(t=>Array.from(t.packed)),b.tiles.map(t=>Array.from(t.packed)));
 assert.equal(rootList(a.tiles).length,new Set(rootList(a.tiles)).size);
 [...p3,...p4,...p6,...p8].forEach((t,i)=>assert.deepEqual(t.packed,old[i]));
});
test('P9 actual immutable root layout is monotonic, finite and material typed',async()=>{
 const {tiles,receipt}=await planP9NativeUplandMats(arg(witness,1024));
 let first=0,rock=0,soil=0;
 for(const t of tiles){
  assert.equal(t.first,first);first+=t.count;
  assert.ok(t.count>0&&t.count<=P9_UPLAND_ALLOCATION.maximumTileRoots);
  assert.equal(t.packed.length,t.count*4);
  for(let i=0;i<t.count;i++){
   const x=t.packed[i*4],y=t.packed[i*4+1],z=t.packed[i*4+2],ang=t.packed[i*4+3];
   assert.ok(x>=-38&&x<152&&z>=-235&&z<-95&&Number.isFinite(y));
   if(ang<0)rock++;else soil++;
  }
 }
 assert.equal(first,receipt.addedRoots);
 assert.equal(rock,receipt.materialRootCounts.STONE_AND_SPARSE_SOIL);
 assert.equal(soil,receipt.materialRootCounts.COASTAL_SOIL);
 assert.equal(receipt.addedGpuBytes,first*16);
});
test('P9 rejects wet, invalid or unsupported material rather than assuming soil',async()=>{
 let visits=0;
 const a=await planP9NativeUplandMats(arg(()=>{visits++;return null;},128));
 assert.ok(visits>0);
 assert.equal(a.receipt.addedRoots,0);
 assert.equal(a.receipt.contactTrials,visits);
 assert.equal(a.receipt.rejected.nativeMaterialOrGround,visits);
 assert.equal(a.tiles.length,0);
 for(const mk of [
  ()=>({...witness(0,0),materialClass:'WET_SAND'}),
  ()=>({...witness(0,0),soilDepth:.01}),
  ()=>({...witness(0,0),rockExposure:.99}),
  ()=>({...witness(0,0),slope:1.15}),
  ()=>({...witness(0,0),y:NaN})
 ]){const r=await planP9NativeUplandMats(arg(mk,128));assert.equal(r.receipt.addedRoots,0);}
});
test('P9 protected estate and previously occupied root cells are excluded',async()=>{
 const a=await planP9NativeUplandMats(arg(witness,2560));
 assert.ok(a.receipt.addedRoots>0);
 for(const t of a.tiles)for(let i=0;i<t.count;i++){
  const x=t.packed[i*4],z=t.packed[i*4+2];
  assert.ok(Math.hypot(x-80,z+172)>=30.3,'estate must remain untouched');
  assert.ok(Math.hypot(x+139.40268,z+210.74617)>=43,'protected woodland untouched');
 }
 assert.ok(a.receipt.addedGpuBytes<=1760000);
});
test('P9 is fail closed for malformed protected arrays and illegal budgets',async()=>{
 await assert.rejects(planP9NativeUplandMats(),/P9_UPLAND_INPUT_INVALID/);
 await assert.rejects(planP9NativeUplandMats(arg(witness,-1)),/P9_UPLAND_INPUT_INVALID/);
 const r=await planP9NativeUplandMats(arg(witness,0));
 assert.equal(r.receipt.addedRoots,0);
 const broken=[{count:2,minX:-20,minZ:-200,packed:new Float32Array(4)}];
 await assert.rejects(planP9NativeUplandMats({installedTiles:broken,p4BankTiles:[],p6DryTiles:[],p8SandTiles:[],
  admitNativeUplandContact:witness,maximumAddedRoots:1}),/P9_PROTECTED_TILE_INVALID/);
});
test('P9 binds exact material source and native water, sand and soil-depth predicates',()=>{
 const owner=readFileSync('showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js','utf8');
 const page=readFileSync('showroom/globe/h-earth/index.html','utf8');
 assert.ok(owner.includes('p9-native-upland-soil-rock-mats.v1.js?rev=sha-ad025cfb98fb'));
 assert.ok(owner.includes('p8-dry-sand-shoreline-sedge.v1.js?rev=sha-a118a8675207'));
 assert.ok(owner.includes('hillside-bank-ecotone-roots.p6.v1.js?rev=sha-109db7bc3ba4'));
 assert.ok(page.includes('vegetation-single-owner.prototype.v1.js?rev=sha-63dbdcdd9460'));
 for(const s of ['sampleHEarthRun8CSuccessorSurfaceMaterial(local.x,local.z)',
  'P9_UPLAND_MATERIAL.allowedClasses.includes(mat.surfaceClass)',
  'P9_UPLAND_MATERIAL.stoneSoilMinDepth',
  'P9_UPLAND_MATERIAL.coastalSoilMinDepth',
  'P9_UPLAND_MATERIAL.rockExposureMax',
  'beach.rawSandCoverage>P9_UPLAND_MATERIAL.sandCoverageMax',
  'hit.y<=water.y+P9_UPLAND_MATERIAL.minimumWaterClearance',
  'if(geology.sampleWaterAt(x,z))','if(geology.isPlannedWaterFootprint?.(x,z))',
  'if(!visibleSurface.admitGround(x,z,hit))','p9FirstFailure:p9FirstFailureReceipt()'])
  assert.ok(owner.includes(s),'native material gate missing: '+s);
 assert.ok(owner.includes('if(beach.rawSandCoverage<0||beach.rawSandCoverage>.12)'),'P6 unchanged');
 assert.ok(owner.includes('beach.rawSandCoverage>P8_SEDGE_MATERIAL.sandMinExclusive'),'P8 unchanged');
});
test('P9 changes no old P3 P4 P6 P7 or P8 vertex counts or shader modes',()=>{
 const owner=readFileSync('showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js','utf8');
 const start=owner.indexOf('function draw(packet)'),p4=owner.indexOf('if(p4Added){',start),
   p6=owner.indexOf('if(p6Added){',start),p8=owner.indexOf('if(p8Added){',start),
   p9=owner.indexOf('if(p9Added){',start),end=owner.indexOf('lastDraw=',p9);
 assert.ok(start>=0&&p4>start&&p6>p4&&p8>p6&&p9>p8&&end>p9);
 const pieces=[owner.slice(start,p4),owner.slice(p4,p6),owner.slice(p6,p8),owner.slice(p8,p9),owner.slice(p9,end)];
 const count=(src,needle)=>src.split(needle).length-1;
 assert.equal(count(pieces[0],'gl.drawArraysInstanced(gl.TRIANGLES,0,6,range.count)'),2);
 assert.equal(count(pieces[1],'gl.drawArraysInstanced(gl.TRIANGLES,0,6,range.count)'),2);
 assert.equal(count(pieces[2],'gl.drawArraysInstanced(gl.TRIANGLES,0,24,range.count)'),2);
 assert.equal(count(pieces[3],'gl.drawArraysInstanced(gl.TRIANGLES,0,24,range.count)'),2);
 assert.equal(count(pieces[4],'gl.drawArraysInstanced(gl.TRIANGLES,0,30,range.count)'),2);
 assert.ok(pieces[0].includes('gl.uniform1i(u.uP9Upland,0);'));
 assert.ok(pieces[4].includes('gl.uniform1i(u.uP9Upland,1);'));
 assert.ok(pieces[4].includes('gl.uniform1i(u.uP9Upland,0);'));
 assert.ok(pieces[4].includes('gl.uniform1i(u.uP8Sedge,0);'));
 assert.ok(owner.includes('p9UplandLeavesPerRoot:5'));
 assert.ok(owner.includes('p9UplandSubmittedTriangles:'));
});

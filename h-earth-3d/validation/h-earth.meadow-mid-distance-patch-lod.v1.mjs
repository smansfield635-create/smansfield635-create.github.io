#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {
  selectHEarthMeadowMidDistancePatchDraws,selectHEarthMeadowMidDistanceRepresentations,selectHEarthGlobalGroundCoverDraws
} from '../../showroom/globe/h-earth/render/landscape-groundcover.global-v1.js';

const cover={
  receipt:{instanceCount:2176},
  tiles:[
    {start:0,count:2048,minX:-64,maxX:-32,minZ:-352,maxZ:-320,ecoInstances:0},
    {start:2048,count:128,minX:0,maxX:32,minZ:0,maxZ:32,ecoInstances:0}
  ]
};
const selected=selectHEarthMeadowMidDistancePatchDraws(cover,{x:-45,z:-326});
assert.equal(selected.representation,'TERRAIN_ALIGNED_ALPHA_TEXTURED_PATCH_IMPOSTOR');
assert.equal(selected.sourcePopulationChanged,false);
assert.equal(selected.centerX,-45);
assert.equal(selected.centerZ,-326);
assert.equal(selected.pilotRadius,18);
assert.equal(selected.innerDistance,6);
assert.equal(selected.outerDistance,18);
assert.equal(selected.draws.length,1);
assert.equal(selected.draws[0].start,0);
assert.equal(selected.draws[0].count,1024);
assert.equal(selected.visibleInstanceCount,1024);
assert.ok(selected.draws.every(draw=>draw.patchLod===true));
assert.throws(
  ()=>selectHEarthMeadowMidDistancePatchDraws(cover,{x:-45,z:-326},{maximumDraws:0}),
  /MEADOW_PATCH_LOD_SELECTION_BUDGET_INVALID/
);
const moved=selectHEarthMeadowMidDistancePatchDraws(cover,{x:800,z:800});
assert.equal(moved.draws.length,0);
// Patch draws must be a subset of the actual fan draws: suppression cannot
// hide accepted records for which the patch pass has no representation.
const frozenCover=JSON.stringify(cover);
const sourceDraws=[{start:0,count:777,stride:2}];
const subset=selectHEarthMeadowMidDistancePatchDraws(cover,{x:-45,z:-326},{sourceDraws,maximumInstances:300});
assert.deepEqual(subset.draws.map(({start,count,stride})=>({start,count,stride})),[{start:0,count:300,stride:2}]);
assert.equal(sourceDraws[0].count,777);
assert.equal(JSON.stringify(cover),frozenCover);
assert.equal(selectHEarthMeadowMidDistancePatchDraws(cover,{x:-45,z:-326},{sourceDraws:[]}).visibleInstanceCount,0);

// A saturated frame must preserve every selected ID, especially near/outside.
const records=new Float32Array(4096*20);
for(let i=0;i<4096;i++){records[i*20+12]=-45;records[i*20+13]=-326+(i<100?2:i<200?12:40);records[i*20+15]=1;}
const dense={records,receipt:{instanceCount:4096},tiles:[{start:0,count:4096,minX:-46,maxX:-44,minZ:-326,maxZ:-286}],template:{positions:new Float32Array([0,0,0])}};
const plan=selectHEarthMeadowMidDistanceRepresentations(dense,{x:-45,z:-326});
const ids=draws=>new Set(draws.flatMap(d=>Array.from({length:d.count},(_,i)=>d.start+i*d.stride)));
const originalIds=ids(selectHEarthGlobalGroundCoverDraws(dense,{x:-45,z:-326}).draws);
const fanIds=ids(plan.fanDraws),patchIds=ids(plan.patchDraws);
assert.deepEqual(new Set([...fanIds,...patchIds]),originalIds);
assert.equal(plan.visibleInstanceCount,4096);
assert.ok(plan.drawCallCount<=64);
assert.equal(patchIds.size,100);
for(let i=0;i<4096;i++)if(i<100||i>=200){assert.ok(fanIds.has(i));assert.ok(!patchIds.has(i));}
// Alternating eligible anchors exhaust draw splits: safe original-draw fallback.
for(let i=0;i<4096;i++)records[i*20+13]=-326+(i%2?12:2);
const fallback=selectHEarthMeadowMidDistanceRepresentations(dense,{x:-45,z:-326});
assert.equal(fallback.patchDraws.length,0);
assert.deepEqual(ids(fallback.fanDraws),originalIds);

// Execute the real source's pure shader/atlas definitions. This tests exact
// substitutions and deterministic assets, not browser compilation or visuals.
const renderer=readFileSync(new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
const shaderStart=renderer.indexOf('const GLOBAL_COVER_VS =');
const shaderEnd=renderer.indexOf('const CLEARING_SHADOW_VS=',shaderStart);
assert.ok(shaderStart>=0&&shaderEnd>shaderStart);
const shader=vm.runInNewContext(renderer.slice(shaderStart,shaderEnd)+'\n({vs:GLOBAL_COVER_PATCH_LOD_VS,fs:GLOBAL_COVER_PATCH_SUPPRESSION_FS,patchVs:MEADOW_PATCH_LOD_VS,patchFs:MEADOW_PATCH_LOD_FS,atlas:buildMeadowPatchLodAtlas(),again:buildMeadowPatchLodAtlas()})');
assert.ok(shader.vs.includes('vMeadowPatchEnabled='));
assert.ok(shader.fs.includes('float fanFade=vMeadowPatchEnabled*meadowPatchFade('));
assert.ok(shader.patchFs.includes('float fade=meadowPatchFade('));
assert.ok(shader.patchVs.includes('vec3(transform.x,centerY,transform.y)'));
assert.ok(shader.patchVs.includes('vec3(xz0.x,rootY(instance,0),xz0.y)'));
assert.deepEqual([...shader.atlas],[...shader.again]);
assert.equal(shader.atlas.byteLength,262144);
let nonTransparent=0;
for(let y=0;y<256;y++)for(let x=0;x<256;x++){
  const alpha=shader.atlas[(y*256+x)*4+3];
  if(x%64<2||x%64>61||y%64<2||y%64>61)assert.equal(alpha,0,'atlas cell gutters remain transparent');
  if(alpha)nonTransparent++;
}
assert.ok(nonTransparent>0&&nonTransparent<65536);
console.log(JSON.stringify({
  schema:'H_EARTH_MEADOW_MIDDISTANCE_PATCH_LOD_TEST_v1',result:'PASS',
  coverage:'SYNTHETIC_SELECTION_AND_EXACT_SOURCE_SHADER_ASSET_CONTRACT',
  selectedTiles:selected.draws.length,selectedInstances:selected.visibleInstanceCount,
  sharedBudget:{maximumInstances:4096,maximumDraws:64},
  patchTextureBytes:shader.atlas.byteLength,atlasDeterministic:true,
  sourcePopulationChanged:false,browserQualification:'NOT_TESTED',
  actualTerrainRootQualification:'NOT_TESTED'
}));

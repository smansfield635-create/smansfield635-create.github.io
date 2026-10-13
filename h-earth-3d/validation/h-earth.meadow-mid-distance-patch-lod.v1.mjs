#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {selectHEarthMeadowMidDistanceRepresentations,selectHEarthGlobalGroundCoverDraws} from '../../showroom/globe/h-earth/render/landscape-groundcover.global-v1.js';
const records=new Float32Array(4096*20);
for(let i=0;i<4096;i++){records[i*20+12]=-45;records[i*20+13]=-326+(i%2?12:2);records[i*20+15]=1;}
const cover={records,receipt:{instanceCount:4096},tiles:[{start:0,count:4096,minX:-46,maxX:-44,minZ:-326,maxZ:-286}]};
const camera={x:-45,z:-326};
const before=createHash('sha256').update(records).digest('hex');
const plan=selectHEarthMeadowMidDistanceRepresentations(cover,camera);
assert.deepEqual(plan.draws,selectHEarthGlobalGroundCoverDraws(cover,camera).draws);
assert.equal(plan.meadowEligibleSelectedCount,4096);
assert.equal(plan.meadowReplacementInstanceCount,4096,'budget saturation must not disable the new representation');
assert.equal(plan.visibleInstanceCount,4096);
assert.equal(createHash('sha256').update(records).digest('hex'),before);
records[12]=1000;const outside=selectHEarthMeadowMidDistanceRepresentations(cover,camera);
assert.equal(outside.meadowReplacementInstanceCount,4095);
assert.deepEqual(outside.draws,plan.draws);

const renderer=readFileSync(new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
const start=renderer.indexOf('const GLOBAL_COVER_VS ='),end=renderer.indexOf('const CLEARING_SHADOW_VS=',start);
const actual=vm.runInNewContext(renderer.slice(start,end)+'\n({vs:GLOBAL_COVER_PATCH_LOD_VS,fs:GLOBAL_COVER_PATCH_SUPPRESSION_FS,atlas:buildMeadowPatchLodAtlas(),again:buildMeadowPatchLodAtlas()})');
assert.ok(actual.vs.includes('vMeadowMode>0.5&&local>=3'),'only upper vertices can move');
assert.ok(actual.fs.includes('if(blades.a<0.38)discard'),'transparent spaces replace opaque leaf silhouettes');
assert.ok(actual.vs.includes('distance(aTransform.xy,vec2(-45.0,-326.0))<=18.0'));
assert.ok(actual.fs.includes('distance(vWorldPosition.xz,vec2(-45.0,-326.0))>18.001'));
assert.equal(actual.atlas.byteLength,262144);
assert.deepEqual([...actual.atlas],[...actual.again]);
const cells=[];
for(let cell=0;cell<16;cell++){
 let occupied=0,low=0,tall=0;
 for(let y=0;y<64;y++)for(let x=0;x<64;x++){
  const alpha=actual.atlas[((Math.floor(cell/4)*64+y)*256+cell%4*64+x)*4+3];
  if(x<2||x>61||y<2||y>61)assert.equal(alpha,0);
  if(alpha){occupied++;if(y<32)low++;else tall++;}
 }
 assert.ok(occupied>100&&occupied<1600,'clump must contain blades and substantial transparent gaps');
 assert.ok(low>0&&tall>0,'each cell must contain short and tall structure');
 cells.push({cell,occupied,low,tall});
}
let actualCache=null;
const cacheArg=process.argv.indexOf('--cache');
if(cacheArg>=0){
 const cached=JSON.parse(gunzipSync(readFileSync(process.argv[cacheArg+1])));
 cached.records=Float32Array.from(cached.records);
 const recordDigest=createHash('sha256').update(cached.records).digest('hex');
 assert.equal(recordDigest,'045c775aedf39086daec21980365474e43cbd472d803c16097b4b8392de307a6');
 const selected=selectHEarthMeadowMidDistanceRepresentations(cached,camera);
 assert.deepEqual(selected.draws,selectHEarthGlobalGroundCoverDraws(cached,camera).draws);
 assert.ok(selected.meadowEligibleSelectedCount>0);
 assert.equal(selected.meadowReplacementInstanceCount,selected.meadowEligibleSelectedCount);
 actualCache={recordDigest,selectedInstances:selected.visibleInstanceCount,selectedDraws:selected.draws.length,eligibleSelected:selected.meadowEligibleSelectedCount,replacementInstances:selected.meadowReplacementInstanceCount};
}
console.log(JSON.stringify({schema:'H_EARTH_MEADOW_REPLACEMENT_PREVISUAL_TEST_v1',result:'PASS',syntheticBudgetSaturationReplacement:true,atlasBytes:actual.atlas.byteLength,cells,actualCache,browserQualification:'NOT_TESTED',perceptualAcceptance:'PENDING'}));

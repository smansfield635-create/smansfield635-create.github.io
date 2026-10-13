#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {buildHEarthMeadowPresentationRoots,selectHEarthMeadowMidDistanceRepresentations,selectHEarthGlobalGroundCoverDraws} from '../../showroom/globe/h-earth/render/landscape-groundcover.global-v1.js';
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
assert.ok(actual.vs.includes('uMeadowRoots'),'new contacts must read the terrain-qualified presentation sidecar');
assert.ok(actual.fs.includes('if(blades.a<0.38)discard'),'transparent spaces replace opaque leaf silhouettes');
assert.ok(actual.vs.includes('meadowOffset>=0'),'only sidecar-eligible original instances use new presentation');
assert.ok(actual.fs.includes('distance(vWorldPosition.xz,vec2(-45.0,-326.0))>18.001'));
assert.equal(actual.atlas.byteLength,262144);
assert.deepEqual([...actual.atlas],[...actual.again]);
const cells=[];
for(let cell=0;cell<4;cell++){
 let occupied=0,low=0,tall=0;
 for(let y=0;y<128;y++)for(let x=0;x<128;x++){
  const alpha=actual.atlas[((Math.floor(cell/2)*128+y)*256+cell%2*128+x)*4+3];
  if(x<2||x>125||y<2||y>125)assert.equal(alpha,0);
  if(alpha){occupied++;if(y<64)low++;else tall++;}
 }
 assert.ok(occupied>100&&occupied<6400,'clump must contain blades and substantial transparent gaps');
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
 actualCache={recordDigest,selectedInstances:selected.visibleInstanceCount,selectedDraws:selected.draws.length,candidateSelected:selected.meadowCandidateSelectedCount,boundaryPreserved:selected.meadowBoundaryPreservedCount,eligibleSelected:selected.meadowEligibleSelectedCount,replacementInstances:selected.meadowReplacementInstanceCount};
}
let presentation=null;
if(cacheArg>=0){
 const cached=JSON.parse(gunzipSync(readFileSync(process.argv[cacheArg+1])));cached.records=Float32Array.from(cached.records);
 const worldBytes=readFileSync(new URL('../../showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',import.meta.url));
 assert.equal(createHash('sha256').update(worldBytes).digest('hex'),'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a');
 const {raw}=JSON.parse(gunzipSync(worldBytes));
 const digest=createHash('sha256').update(cached.records).digest('hex');
 const sidecar=await buildHEarthMeadowPresentationRoots(cached,raw);
 assert.equal(createHash('sha256').update(cached.records).digest('hex'),digest,'original records remain byte-identical');
 assert.ok(sidecar.clumps.length>0);
 let maxError=0,maxRadius=0;
 for(const clump of sidecar.clumps)for(const root of clump.roots){
  const ids=raw.buffers.indices.slice(root.triangleId*3,root.triangleId*3+3);
  const tri=ids.map(i=>raw.buffers.positions.slice(i*3,i*3+3));
  const [a,b,c]=tri;const det=(b[2]-c[2])*(a[0]-c[0])+(c[0]-b[0])*(a[2]-c[2]);
  const u=((b[2]-c[2])*(root.x-c[0])+(c[0]-b[0])*(root.z-c[2]))/det,v=((c[2]-a[2])*(root.x-c[0])+(a[0]-c[0])*(root.z-c[2]))/det,w=1-u-v;
  assert.ok(Math.min(u,v,w)>=-1e-6,'new contact inside claimed actual terrain triangle');
  const error=Math.abs(root.y-(u*a[1]+v*b[1]+w*c[1]));maxError=Math.max(maxError,error);assert.ok(error<2e-5,'terrain-contact height');
  const radius=Math.hypot(root.x+45,root.z+326);maxRadius=Math.max(maxRadius,radius);assert.ok(radius<=18,'new contact remains inside pilot');
 }
 const templateBytes=['positions','normals','colors','rootInfo','indices'].reduce((n,k)=>n+sidecar.template[k].byteLength,0);
 const paddedRecordsBytes=Math.ceil(cached.records.length/4096)*16384,paddedSidecarBytes=Math.ceil(sidecar.pixels.length/4096)*16384,totalGpuBytes=templateBytes+paddedRecordsBytes+paddedSidecarBytes+actual.atlas.byteLength;
 assert.ok(totalGpuBytes<=8388608);assert.ok(cached.records.length/20<=65536);assert.ok(actualCache.selectedInstances<=4096);assert.ok(actualCache.selectedDraws<=64);
 const geometryCost={templateBytes,paddedRecordsBytes,paddedSidecarBytes,totalGpuBytes,selectedVertexInvocations:actualCache.selectedInstances*84,selectedSubmittedTriangles:actualCache.selectedInstances*72,priorSelectedVertexInvocations:actualCache.selectedInstances*28,priorSelectedSubmittedTriangles:actualCache.selectedInstances*24,geometryInvocationMultiplier:3,drawsAdded:0};
 presentation={geometryCost,receipt:sidecar.receipt,clumps:sidecar.clumps.length,independentContacts:sidecar.clumps.length*3,maxTerrainContactError:maxError,maxRootRadius:maxRadius,originalRecordsDigest:digest};
}
console.log(JSON.stringify({schema:'H_EARTH_MEADOW_REPLACEMENT_PREVISUAL_TEST_v1',result:'PASS',presentation,syntheticBudgetSaturationReplacement:true,atlasBytes:actual.atlas.byteLength,cells,actualCache,browserQualification:'NOT_TESTED',perceptualAcceptance:'PENDING'}));

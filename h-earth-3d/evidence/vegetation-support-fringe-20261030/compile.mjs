// Gen3010 isolated ASSET COMPILER. Exact mechanical derivation of the
// authenticated read-only dry-run: same proposals, plus staging-only output.
// Original dry-run remains unchanged and is checked by Git blob identity.
// Never writes into the repository or publishes generated assets.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync,gzipSync} from 'node:zlib';
import path from 'node:path';
import {GRASS_CONTINUITY_ALLOCATION as allocation} from '../../../showroom/globe/h-earth/render/grass-continuity-supplement.v1.js';
import {fileURLToPath} from 'node:url';
import {visibleSurface,groundAdmission,materials,cover,geology,habitatModule} from '../hillside-shoreline-continuity-v1/support-fixture.mjs';
import {HILLSIDE_SHORELINE,hillsideDensity,hillsideFringeWeight} from '../../../showroom/globe/h-earth/render/hillside-shoreline-field.v1.js';
import {buildCavernEntranceGrass} from '../../../showroom/globe/h-earth/render/cavern-entrance-grass.v1.js';
import {runtimePlantingBaselineTiles} from '../../../showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js';
import {oasisBankTiles} from '../../../showroom/globe/h-earth/render/oasis-bank-field.v1.js';
import {buildCavernPalmPlacement} from '../../../showroom/globe/h-earth/render/cavern-palm-placement.v1.js';

const ROOT=new URL('../../../',import.meta.url);
const ASSET='showroom/globe/h-earth/render/assets/precomputed-grass.v1.';
const sha=b=>createHash('sha256').update(b).digest('hex');
const read=p=>fs.readFileSync(new URL(p,ROOT));
const MANIFEST_SHA='9d452a0906094e6e5ed828753e547ef24269afa173896453637b77832c6c3edf';
const RAW_SHA='bb5bdea6223aaea0422bac76f73da46d0370e51d81b3fdb280c970c408879a97';
const COMPRESSED_SHA='4a2ff2a135984d67d68d3df7c3212236894c75b66826f256a60130c87b73e800';
const N=2858738,STRIDE=52,MAX_SAVED=2912956,MAX_TILE=1600,RUNTIME_COUNT=54218,OASIS_COUNT=1571,COMBINED_EXTRA=55789;
const BOUNDS=[140,-302,258,-244],STEP=.14,SEP=.075;
const f=Math.fround;
const hash=habitatModule.habitatHash;
const cell=(x,z)=>Math.floor(x)+':'+Math.floor(z);
const tile=(x,z)=>Math.floor(x/4)+':'+Math.floor(z/4);
const nearKey=(x,z)=>Math.floor(x/.08)+':'+Math.floor(z/.08);
const manifestBytes=read(ASSET+'json');
assert.equal(sha(manifestBytes),MANIFEST_SHA,'FROZEN_MANIFEST_CHANGED');
const manifest=JSON.parse(manifestBytes);
assert.equal(manifest.schema,'H_EARTH_PRECOMPUTED_GRASS_v1');
assert.equal(manifest.rootCount,N);
assert.equal(manifest.receipt?.contactCount,N);
assert.equal(manifest.stride,STRIDE);
assert.equal(manifest.rawSha256,RAW_SHA);
assert.equal(manifest.compressedSha256,COMPRESSED_SHA);
const compressed=read(ASSET+'bin.gz');
assert.equal(sha(compressed),COMPRESSED_SHA,'FROZEN_COMPRESSED_PACKET_CHANGED');
const raw=gunzipSync(compressed);
assert.equal(raw.length,manifest.rawBytes);
assert.equal(raw.length,N*STRIDE+manifest.habitat.width*manifest.habitat.height);
assert.equal(sha(raw),RAW_SHA,'FROZEN_ROOT_RECORD_BYTES_CHANGED');
const positions=new Map(),near=new Map(),counts=new Map(),tileCounts=new Map();
const overlaps=(x,z)=>x>=BOUNDS[0]-1&&x<=BOUNDS[2]+1&&z>=BOUNDS[1]-1&&z<=BOUNDS[3]+1;
function place(x,z){
 const c=cell(x,z),t=tile(x,z);
 counts.set(c,(counts.get(c)||0)+1);
 tileCounts.set(t,(tileCounts.get(t)||0)+1);
 if(!overlaps(x,z))return;
 const k=nearKey(x,z);
 if(!near.has(k))near.set(k,[]);
 near.get(k).push({x,z});
}
function tooNear(x,z){
 const ix=Math.floor(x/.08),iz=Math.floor(z/.08);
 for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){
  for(const p of near.get((ix+dx)+':'+(iz+dz))||[])
   if(Math.hypot(x-p.x,z-p.z)<SEP)return true;
 }
 return false;
}
const packedTiles=[];
let offset=0,baselineCount=0;
for(const t of manifest.tiles){
 assert(Number.isInteger(t.count)&&t.count>0&&t.count<=MAX_TILE);
 assert.equal(t.id,tile(t.minX,t.minZ),'TILE_ID_MISMATCH');
 const packed=new Float32Array(t.count*4);
 for(let i=0;i<t.count;i++){
  assert(offset+STRIDE<=N*STRIDE);
  const x=raw.readDoubleLE(offset),y=raw.readDoubleLE(offset+8);
  const z=raw.readDoubleLE(offset+16),angle=raw.readDoubleLE(offset+24);
  assert(x>=t.minX&&x<t.minX+4&&z>=t.minZ&&z<t.minZ+4,'ROOT_OUTSIDE_FROZEN_TILE');
  packed.set([f(x),f(y),f(z),f(angle)],i*4);
  place(x,z);
  offset+=STRIDE;baselineCount++;
 }
 packedTiles.push({...t,packed});
}
assert.equal(offset,N*STRIDE);
assert.equal(baselineCount,N);
const originalRecipeCount=manifest.tiles.reduce((sum,t)=>sum+t.baselineCount,0);
assert.equal(originalRecipeCount,1474843,'FROZEN_RUNTIME_RECIPE_PREFIX_CHANGED');
// Oasis banks are installed physical roots, but their baselineCount=0 protects
// the entrance planting recipe from unrelated offline additions.
const bankTiles=oasisBankTiles(N);
let oasisCount=0;
for(const t of bankTiles){
 assert.equal(t.baselineCount,0,'OASIS_BASELINE_MUST_BE_ZERO');
 assert.equal(t.packed.length,t.count*4,'OASIS_PACKED_COUNT_MISMATCH');
 for(let i=0;i<t.count;i++){
  place(t.packed[i*4],t.packed[i*4+2]);
  oasisCount++;
 }
}
assert.equal(oasisCount,OASIS_COUNT,'OASIS_BANK_IDENTITY_CHANGED');
const originalTileCounts=new Map(manifest.tiles.map(t=>[t.id,t.count]));
for(let x=148;x<=248;x+=4)assert.equal(originalTileCounts.get(tile(x,-276))||0,0,
 'UNEXPECTED_FROZEN_TILE_SUPPORT_CHANGED:'+x);
const nativeRuntime=await buildCavernEntranceGrass({
 existingTiles:runtimePlantingBaselineTiles([...packedTiles,...bankTiles]),
 visibleSurface:{...visibleSurface,admitGround:groundAdmission},
 geology,
 palms:buildCavernPalmPlacement(geology).receipt.placements
});
let runtimeCount=0;
for(const t of nativeRuntime.tiles)for(const p of t.roots){place(p.x,p.z);runtimeCount++;}
assert.equal(manifest.receipt?.terrainRuntimeBaseline?.rootCount,RUNTIME_COUNT,
 'FROZEN_RUNTIME_MANIFEST_REFERENCE_CHANGED');
assert.equal(runtimeCount,RUNTIME_COUNT,'RUNTIME_VEGETATION_IDENTITY_CHANGED');
assert.equal(nativeRuntime.receipt?.contactCount,runtimeCount,'RUNTIME_RECEIPT_MISMATCH');
const runtimeSnapshot=JSON.stringify(nativeRuntime,(key,value)=>/Ms$|Milliseconds$/.test(key)?undefined:value)+'\n';
const runtimeSha256=sha(Buffer.from(runtimeSnapshot));
assert.equal(runtimeSha256,manifest.receipt?.terrainRuntimeBaseline?.sha256,
 'FROZEN_NATIVE_RUNTIME_RECIPE_SHA_MISMATCH');
assert.equal(runtimeCount+oasisCount,COMBINED_EXTRA,'COMBINED_RUNTIME_AND_OASIS_IDENTITY_CHANGED');
const baselineTileCounts=new Map(tileCounts);
const rejection={};
const reject=code=>{rejection[code]=(rejection[code]||0)+1;return null;};
function witness(x,z){
 if(hillsideFringeWeight(x,z)<=0)return reject('NOT_IN_FRINGE');
 const s=visibleSurface.sample(x,z);
 if(!s)return reject('NO_NATIVE_TERRAIN');
 const water=visibleSurface.water.sample(x,z);
 if(water&&s.y<=water.y+.03)return reject('UNDER_WATER');
 if(!Number.isFinite(s.slope)||s.slope>1.6)return reject('UNSAFE_SLOPE');
 if(!groundAdmission(x,z,s))return reject('GROUND_ADMISSION');
 const beach=visibleSurface.beach.sample({x,z,support:s});
 if(!beach?.valid)return reject('BEACH_INVALID');
 if(beach.rawSandCoverage>.12||beach.interpolatedExposedContactDistance<=0)return reject('SAND_OR_WATER_CONTACT');
 const a=cover.inverseHEarthGroundCoverPoint(x,s.y,z);
 const m=materials.sampleHEarthRun8CSuccessorSurfaceMaterial(a.x,a.z);
 if(m?.valid!==true)return reject('INVALID_MATERIAL');
 if(!(m.surfaceClass==='STONE_AND_SPARSE_SOIL'?m.soilDepth>=.035:
   ['LOWLAND_SOIL','COASTAL_SOIL','DRY_SAND'].includes(m.surfaceClass)&&m.soilDepth>=.20))return reject('INSUFFICIENT_SOIL');
 const density=hillsideDensity({x,y:s.y,z,shaderSlope:beach.shaderSlope,
  contactDistance:beach.interpolatedExposedContactDistance,sandCoverage:beach.rawSandCoverage});
 if(!Number.isFinite(density)||density<=0)return reject('NO_POSITIVE_DENSITY');
 if(!Number.isInteger(s.triangleId)||s.triangleId<0)return reject('INVALID_NATIVE_TRIANGLE');
 return {x,z,y:s.y,slope:s.slope,triangleId:s.triangleId,density};
}
const proposedRecords=[];
let added=0,eligibleCells=0,shortCells=0,newEmptyRow=0,maxCombinedTile=0;
const seed=HILLSIDE_SHORELINE.seed,digest=createHash('sha256');
const additionsPerTile=new Map();
for(let cz=BOUNDS[1];cz<BOUNDS[3];cz++)for(let cx=BOUNDS[0];cx<BOUNDS[2];cx++){
 const base=witness(cx+.5,cz+.5);
 if(!base)continue;
 eligibleCells++;
 const d=base.density;
 assert(d>=0&&d<=52,'DENSITY_OUTSIDE_PHYSICAL_BUDGET');
 const quota=Math.floor(d)+(hash(cx,cz,seed)/4294967296<d%1?1:0);
 const k=cell(cx,cz),points=[];
 for(let iz=Math.floor(cz/STEP)-1;iz<=Math.ceil((cz+1)/STEP);iz++)
  for(let ix=Math.floor(cx/STEP)-1;ix<=Math.ceil((cx+1)/STEP);ix++){
   const x=f((ix+.5+(hash(ix,iz,seed+1)/4294967296-.5)*.76)*STEP);
   const z=f((iz+.5+(hash(ix,iz,seed+2)/4294967296-.5)*.76)*STEP);
   if(Math.floor(x)===cx&&Math.floor(z)===cz)
    points.push({x,z,ix,iz,rank:hash(ix,iz,seed+3)});
  }
 points.sort((a,b)=>a.rank-b.rank||a.iz-b.iz||a.ix-b.ix);
 for(const p of points){
  if((counts.get(k)||0)>=quota)break;
  if(tooNear(p.x,p.z)){reject('ROOT_PROXIMITY');continue;}
  const s=witness(p.x,p.z);
  if(!s)continue;
  const t=tile(p.x,p.z);
  if((tileCounts.get(t)||0)>=MAX_TILE)throw Error('COMBINED_TILE_BUDGET:'+t);
  if(N+added+1>MAX_SAVED)throw Error('SAVED_ROOT_BUDGET_EXCEEDED');
  const b=Buffer.alloc(STRIDE);
  const angle=f(hash(p.ix,p.iz,seed+4)/4294967296*Math.PI*2);
  [p.x,f(s.y),p.z,angle,s.slope].forEach((v,i)=>b.writeDoubleLE(v,i*8));
  b.writeUInt32LE(hash(p.ix,p.iz,seed+5),40);
  b.writeUInt32LE(s.triangleId,44);
  b.writeUInt32LE(2,48);
  digest.update(b);
  proposedRecords.push({tileId:t,bytes:b});
  additionsPerTile.set(t,(additionsPerTile.get(t)||0)+1);
  place(p.x,p.z);
  added++;
  if(p.x>=148&&p.x<252&&p.z>=-276&&p.z<-272)newEmptyRow++;
 }
 if((counts.get(k)||0)<quota)shortCells++;
}
for(const count of tileCounts.values())maxCombinedTile=Math.max(maxCombinedTile,count);
assert(added>0,'NO_NEW_ADMITTED_ROOTS');
assert(newEmptyRow>0,'CUT_OFF_ROW_NOT_REPAIRED');
assert(maxCombinedTile<=MAX_TILE);
const report={
 schema:'H_EARTH_GEN3010_ADDITIVE_FRINGE_DRY_RUN_v1',
 result:'SOURCE_ADMITTED_DRY_RUN_REQUIRES_ASSET_BUILD_AND_GPU_REVIEW',
 frozenManifestSha256:MANIFEST_SHA,frozenRawSha256:RAW_SHA,
 originalSavedRoots:N,originalRuntimeRecipePrefixRoots:originalRecipeCount,
 originalRuntimeRoots:runtimeCount,originalOasisBankRoots:oasisCount,
 originalCombinedExtraRoots:runtimeCount+oasisCount,
 nativeRuntimeSha256:runtimeSha256,proposedAddedRoots:added,
 proposedSavedRoots:N+added,proposedCombinedRoots:N+runtimeCount+oasisCount+added,
 originalTileCount:manifest.tiles.length,affectedTiles:additionsPerTile.size,
 proposedAddedRootsInPreviouslyEmptyRow:newEmptyRow,
 maximumCombinedTileRoots:maxCombinedTile,
 eligibleCells,shortCells,rejection,
 proposedRootRecordsSha256:digest.digest('hex'),
 priorSavedRootsReencoded:false,priorAtlasModified:false,
 terrainModified:false,waterModified:false,rendererModified:false,
 gpuEvidence:'NOT_RUN',ownerAcceptance:'NOT_CLAIMED'
};
await stageAdditiveAssets(report,proposedRecords);
process.stdout.write(JSON.stringify(report,null,2)+'\n');



function gitBlobSha(bytes) {
 return createHash('sha1').update(Buffer.concat([
  Buffer.from('blob '+bytes.length+'\0'),bytes
 ])).digest('hex');
}
async function stageAdditiveAssets(report,proposals) {
 const sourceBytes=fs.readFileSync(new URL('./dry-run.mjs',import.meta.url));
 assert.equal(gitBlobSha(sourceBytes),'a6bce7818721f968a93947bc13d2672a855e1a45',
  'ORIGINAL_GEN3010_NATIVE_DRY_RUN_SOURCE_CHANGED');
 const outputEnv=process.env.H_EARTH_GEN3010_STAGING_DIR;
 assert(typeof outputEnv==='string'&&path.isAbsolute(outputEnv),
  'EXPLICIT_ABSOLUTE_STAGING_DIR_REQUIRED');
 const output=fs.realpathSync(outputEnv),repository=fs.realpathSync(fileURLToPath(ROOT));
 assert(!output.startsWith(repository+path.sep)&&output!==repository,
  'STAGING_INSIDE_REPOSITORY_PROHIBITED');
 assert.equal(fs.readdirSync(output).length,0,'STAGING_DIRECTORY_NOT_EMPTY');
 assert.equal(report.schema,'H_EARTH_GEN3010_ADDITIVE_FRINGE_DRY_RUN_v1');
 assert.equal(report.result,'SOURCE_ADMITTED_DRY_RUN_REQUIRES_ASSET_BUILD_AND_GPU_REVIEW');
 assert.equal(report.originalSavedRoots,2858738);
 assert.equal(report.originalRuntimeRoots,54218);
 assert.equal(report.originalOasisBankRoots,1571);
 assert.equal(report.proposedAddedRoots,20960);
 assert.equal(report.proposedAddedRootsInPreviouslyEmptyRow,5000);
 assert.equal(report.proposedRootRecordsSha256,
  '64e435129dc5ca0b8bd38409339ec8393cfa8752d8aec6b98e6b7b5558dc3bf7');
 assert.equal(proposals.length,report.proposedAddedRoots);
 const proposalDigest=createHash('sha256');
 const byTile=new Map();
 for(const {tileId,bytes} of proposals){
  assert.equal(bytes.length,STRIDE,'ADDITION_RECORD_STRIDE');
  assert.equal(bytes.readUInt32LE(48),2,'ADDITION_REGION_NOT_SUPPLEMENT');
  assert.equal(tile(bytes.readDoubleLE(0),bytes.readDoubleLE(16)),tileId,
   'ADDITION_TILE_ID_INVALID');
  proposalDigest.update(bytes);
  if(!byTile.has(tileId))byTile.set(tileId,[]);
  byTile.get(tileId).push(bytes);
 }
 assert.equal(proposalDigest.digest('hex'),report.proposedRootRecordsSha256,
  'CENSUS_TO_BUILDER_PROPOSED_RECORD_DIGEST_DRIFT');
 const recordChunks=[],tiles=[],extraByOriginal=new Map();
 let inputOffset=0;
 const originalRecordsHash=createHash('sha256');
 for(const t of manifest.tiles){
  const count=t.count,bytes=raw.subarray(inputOffset,inputOffset+count*STRIDE);
  assert.equal(bytes.length,count*STRIDE,'ORIGINAL_TILE_RECORD_RANGE');
  originalRecordsHash.update(bytes);
  recordChunks.push(bytes);
  const extra=byTile.get(t.id)||[];
  assert(count+extra.length<=allocation.maximumTileRoots,'TILE_GPU_BUDGET');
  if(extra.length)recordChunks.push(...extra);
  extraByOriginal.set(t.id,extra.length);
  tiles.push({...t,count:count+extra.length});
  byTile.delete(t.id);
  inputOffset+=count*STRIDE;
 }
 assert.equal(inputOffset,N*STRIDE,'ORIGINAL_ROOT_PACKET_TRAVERSAL');
 assert.equal(originalRecordsHash.digest('hex'),sha(raw.subarray(0,N*STRIDE)),
  'ORIGINAL_RECORD_IDENTITY_DRIFT');
 const newTileEntries=[...byTile.entries()].sort((a,b)=>{
  const [ax,az]=a[0].split(':').map(Number),[bx,bz]=b[0].split(':').map(Number);
  return ax-bx||az-bz;
 });
 for(const [tileId,extra] of newTileEntries){
  const [ix,iz]=tileId.split(':').map(Number);
  assert(Number.isInteger(ix)&&Number.isInteger(iz),'NEW_TILE_ID_INVALID');
  assert(extra.length>0&&extra.length<=allocation.maximumTileRoots,'NEW_TILE_BUDGET');
  recordChunks.push(...extra);
  tiles.push({id:tileId,minX:ix*4,minZ:iz*4,count:extra.length,baselineCount:0});
 }
 const total=N+proposals.length;
 assert.equal(total,2879698,'CENSUS_NEW_SAVED_COUNT_DRIFT');
 assert(total<=MAX_SAVED&&total<=allocation.maximumRoots,'GLOBAL_ROOT_BUDGET');
 const atlas=raw.subarray(inputOffset);
 assert.equal(atlas.length,manifest.habitat.width*manifest.habitat.height,
  'FROZEN_ATLAS_BYTE_LENGTH');
 recordChunks.push(atlas);
 const nextRaw=Buffer.concat(recordChunks);
 assert.equal(nextRaw.length,total*STRIDE+atlas.length,'COMPILED_PACKET_LENGTH');
 assert(nextRaw.subarray(total*STRIDE).equals(atlas),'FROZEN_ATLAS_BYTES_CHANGED');
 let prior=0,current=0;
 for(const t of manifest.tiles){
  const len=t.count*STRIDE;
  assert(nextRaw.subarray(current,current+len).equals(raw.subarray(prior,prior+len)),
   'EXISTING_SAVED_ROOT_RECORD_CHANGED:'+t.id);
  prior+=len;
  current+=(t.count+(extraByOriginal.get(t.id)||0))*STRIDE;
 }
 assert.equal(prior,N*STRIDE);
 const packed=Buffer.alloc(total*16);
 let woodland=0,ravine=0;
 for(let i=0;i<total;i++){
  const at=i*STRIDE,region=nextRaw.readUInt32LE(at+48);
  assert(region===0||region===1||region===2,'INVALID_GRASS_REGION');
  if(region===0)woodland++;else ravine++;
  for(let k=0;k<4;k++){
   const v=Math.fround(nextRaw.readDoubleLE(at+k*8));
   assert(Number.isFinite(v),'NONFINITE_PACKED_ROOT');
   packed.writeFloatLE(v,i*16+k*4);
  }
 }
 assert(woodland<=allocation.maximumWoodlandRoots,'WOODLAND_GPU_BUDGET');
 assert(ravine<=allocation.maximumRavineRoots,'RAVINE_GPU_BUDGET');
 assert(packed.length<=allocation.maximumPackedBytes,'PACKED_BYTE_GPU_BUDGET');
 const compressed=gzipSync(nextRaw,{level:9});
 const manifestNext={
  ...manifest,
  rootCount:total,rawBytes:nextRaw.length,compressedBytes:compressed.length,
  rawSha256:sha(nextRaw),compressedSha256:sha(compressed),
  packedSha256:sha(packed),tiles,
  receipt:{...manifest.receipt,contactCount:total,tileCount:tiles.length,
   naturalGrassSupportFringe:{
    schema:'H_EARTH_GEN3010_FRINGE_ASSET_COMPILATION_v1',
    originalRootCount:N,addedRootCount:proposals.length,
    censusRecordsSha256:report.proposedRootRecordsSha256,
    addedInPreviouslyEmptyRow:report.proposedAddedRootsInPreviouslyEmptyRow,
    originalAtlasUnmodified:true,originalRootRecordsUnmodified:true
   }}
 };
 const manifestText=JSON.stringify(manifestNext)+'\n',manifestSha=sha(Buffer.from(manifestText));
 const loaderBytes=read('showroom/globe/h-earth/render/precomputed-grass.v1.js');
 assert.equal(gitBlobSha(loaderBytes),'02f2fe39ef6c1f8e1ba1a51398ca9fa0512e19f4',
  'FROZEN_GRASS_LOADER_CHANGED');
 let loader=loaderBytes.toString('utf8');
 const expectedManifestDeclaration="const MANIFEST_SHA256='9d452a0906094e6e5ed828753e547ef24269afa173896453637b77832c6c3edf';";
 assert.equal(loader.split(expectedManifestDeclaration).length,2,
  'LOADER_MANIFEST_IDENTITY_ANCHOR_CHANGED');
 assert.equal(loader.split('manifest.rootCount!==2858738').length,3,
  'LOADER_ROOT_COUNT_GUARDS_CHANGED');
 assert.equal(loader.split('manifest.receipt?.contactCount!==2858738').length,3,
  'LOADER_RECEIPT_GUARDS_CHANGED');
 loader=loader.replace(expectedManifestDeclaration,"const MANIFEST_SHA256='"+manifestSha+"';")
  .replaceAll('manifest.rootCount!==2858738','manifest.rootCount!==2879698')
  .replaceAll('manifest.receipt?.contactCount!==2858738',
   'manifest.receipt?.contactCount!==2879698');
 const receipt={
  schema:'H_EARTH_GEN3010_FRINGE_STAGED_ASSET_RECEIPT_v1',
  result:'CANDIDATE_ASSETS_STAGED_NEEDS_INDEPENDENT_QUALIFICATION',
  exactOriginalDryRunBlob:'a6bce7818721f968a93947bc13d2672a855e1a45',
  sourceCensusDigest:report.proposedRootRecordsSha256,
  originalSavedRoots:N,newSavedRoots:total,newRoots:proposals.length,
  originalTileCount:manifest.tiles.length,newTileCount:tiles.length,
  originalRawSha256:RAW_SHA,newRawSha256:manifestNext.rawSha256,
  originalCompressedSha256:COMPRESSED_SHA,
  newCompressedSha256:manifestNext.compressedSha256,
  manifestSha256:manifestSha,loaderSha256:sha(Buffer.from(loader)),
  packedSha256:manifestNext.packedSha256,
  packedBytes:packed.length,woodlandRoots:woodland,ravineRoots:ravine,
  maximumCombinedTileRoots:report.maximumCombinedTileRoots,
  originalRecordsByteIdentical:true,habitatAtlasByteIdentical:true,
  productionFilesChanged:false,gpuEvidence:'NOT_RUN',ownerAcceptance:'NOT_CLAIMED'
 };
 fs.writeFileSync(path.join(output,'precomputed-grass.v1.bin.gz'),compressed);
 fs.writeFileSync(path.join(output,'precomputed-grass.v1.json'),manifestText);
 fs.writeFileSync(path.join(output,'precomputed-grass.v1.js'),loader);
 fs.writeFileSync(path.join(output,'compiler-report.json'),JSON.stringify(receipt,null,2)+'\n');
 assert.equal(sha(gunzipSync(fs.readFileSync(path.join(output,'precomputed-grass.v1.bin.gz')))),
  manifestNext.rawSha256,'STAGED_COMPRESSED_ROUNDTRIP_FAILED');
 console.log('GEN3010_ASSET_COMPILE_STAGED',JSON.stringify(receipt));
}

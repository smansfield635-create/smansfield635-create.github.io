// Gen3010 READ-ONLY physical root admission and quota replay.
// Runs against the CURRENT pinned 2,858,738-root packet; never rewrites an asset.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
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
process.stdout.write(JSON.stringify(report,null,2)+'\n');

/** Independent Gen2698 source/census/terrain-contact/budget verification.
 * This is NOT a visual or owner-release acceptance.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {getHEarthRun8ER2ImmutableLiveRenderPackage} from '../../showroom/globe/h-earth/render/live-render-package.run8e-r2.js';
import {buildLargeP2BoulderPresentation,suppressLargeP2SourceRockTriangles,LARGE_P2_BOULDER_PRESENTATION} from '../../showroom/globe/h-earth/render/large-p2-boulder-presentation.v1.js';
import {sampleHEarthRun8CSuccessorSurfaceMaterial as materialAt} from '../environment/h-earth.gen2514-qualified-surface-material.run8c.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const digest=b=>createHash('sha256').update(b).digest('hex');
const sha=v=>digest(ArrayBuffer.isView(v)?Buffer.from(v.buffer,v.byteOffset,v.byteLength):Buffer.from(JSON.stringify(v)));
function independentCensus(raw){
 const old=raw.buffers.indices,tags=raw.clearingAttributes,span=raw.primitiveSpans.find(x=>x.primitiveId==='H_EARTH_LANDSCAPE_P2_ROCK');
 assert(span,'SOURCE_ROCK_SPAN_MISSING');
 const large=[],small=[],largeVertices=new Set(),smallVertices=new Set();
 for(let j=span.indexStart;j<span.indexStart+span.indexCount;j+=3){
   const v=[old[j],old[j+1],old[j+2]],t=v.map(i=>tags[i*3+2]);
   assert(t.every(x=>x===t[0]),'MIXED_ROCK_TAG');
   assert([0,3].includes(t[0]),'UNRECOGNIZED_ROCK_SOURCE_TAG');
   const dest=t[0]===0?large:small,set=t[0]===0?largeVertices:smallVertices;
   dest.push(j);v.forEach(i=>set.add(i));
 }
 assert.equal(large.length,336);assert.equal(small.length,224);
 assert.equal(largeVertices.size,224,'ORIGINAL_LARGE_14_BY_16_VERTICES');
 assert.equal(smallVertices.size,140,'PROTECTED_SMALL_14_BY_10_VERTICES');
 for(const i of largeVertices)assert(!smallVertices.has(i),'PROTECTED_SMALL_SHARES_OLD_LARGE_VERTEX');
 return{large,small};
}
function independentlySample(raw,x,z){
 const p=raw.buffers.positions,idx=raw.buffers.indices;
 for(const span of raw.primitiveSpans.filter(x=>x.role==='TERRAIN')){
   for(let j=span.indexStart;j<span.indexStart+span.indexCount;j+=3){
     const v=[0,1,2].map(k=>{const i=idx[j+k]*3;return[p[i],p[i+1],p[i+2]];});
     const[a,b,c]=v;if(x<Math.min(a[0],b[0],c[0])-1e-6||x>Math.max(a[0],b[0],c[0])+1e-6||z<Math.min(a[2],b[2],c[2])-1e-6||z>Math.max(a[2],b[2],c[2])+1e-6)continue;
     const d=(b[2]-c[2])*(a[0]-c[0])+(c[0]-b[0])*(a[2]-c[2]);
     if(Math.abs(d)<1e-10)continue;
     const u=((b[2]-c[2])*(x-c[0])+(c[0]-b[0])*(z-c[2]))/d;
     const v1=((c[2]-a[2])*(x-c[0])+(a[0]-c[0])*(z-c[2]))/d;
     const w=1-u-v1;if(Math.min(u,v1,w)>=-1e-8)return{y:Math.fround(u*a[1]+v1*b[1]+w*c[1]),triangleId:j/3};
   }
 }
 return null;
}
function audit(rock,raw,source){
 assert.equal(rock.receipt.rockCount,14);
 assert.equal(rock.receipt.suppressedTriangles,336);
 assert.equal(rock.receipt.protectedSmallTriangles,224);
 assert.equal(rock.records.length,14);
 assert.equal(rock.positions.length/3,868);
 assert.equal(rock.indices.length/3,1680);
 assert.equal(rock.suppressedTriangleOffsets.length,336);
 assert.deepEqual(rock.suppressedTriangleOffsets,source.large);
 assert.deepEqual(rock.protectedSmallTriangleOffsets,source.small);
 const old=raw.buffers.indices,next=suppressLargeP2SourceRockTriangles(old,rock);
 for(const j of source.large)assert(next[j]===old[j]&&next[j+1]===old[j]&&next[j+2]===old[j],'OLD_WEDGE_NOT_SUPPRESSED');
 for(const j of source.small)assert.deepEqual(Array.from(next.slice(j,j+3)),Array.from(old.slice(j,j+3)),'ACCEPTED_SMALL_ROCK_CHANGED');
 const center=[],height=[],radius=[];
 for(const r of rock.records){
   assert.equal(r.sourceTriangleOffsets.length,24);
   assert.equal(r.sourceVertexIndices.length,16);
   assert.equal(r.vertexCount,62);assert.equal(r.indexCount,360);
   assert.equal(r.terrainContactWitnesses.length,24,'TWO_BURIED_12_POINT_SUPPORT_RINGS_REQUIRED');
   for(const t of r.terrainContactWitnesses){
     assert(t.burial>=.018-1e-4,'BOULDER_FOOT_ABOVE_TERRAIN');
     const independent=independentlySample(raw,t.x,t.z);
     assert(independent,'BOULDER_FOOT_MISSING_SOURCE_TRIANGLE');
     assert(Math.abs(independent.y-t.terrainY)<1e-4,'BOULDER_TERRAIN_SAMPLE_DISAGREEMENT');
     assert.equal(independent.triangleId,t.triangleId,'BOULDER_TERRAIN_TRIANGLE_PROVENANCE');
   }
   const m=materialAt(r.authoredCenter.x,r.authoredCenter.z);
   assert.equal(m.valid,true);
   assert(!m.surfaceClass.includes('WATER')&&!m.surfaceClass.includes('SAND'),'BOULDER_IN_WRONG_HABITAT');
   assert.equal(r.context.surfaceClass,m.surfaceClass);
   assert(['LOWLAND_SOIL','COASTAL_SOIL','STONE_AND_SPARSE_SOIL'].includes(m.surfaceClass));
   assert(Math.max(m.rockExposure,m.drainageRetention,m.foothillTransition)>.03,'BOULDER_HAS_NO_CANONICAL_CONTEXT');
   center.push(r.presentationCenter);height.push(r.height);radius.push(r.radius);
 }
 // Shape and placement must differ in more than color or a common translation.
 assert(new Set(center.map(v=>Math.round(v.x)+':'+Math.round(v.z))).size===14,'DUPLICATE_BOULDER_LOCATIONS');
 assert(Math.max(...height)-Math.min(...height)>.35,'REPLACEMENT_FORMS_REPEATED_HEIGHT');
 assert(Math.max(...radius)-Math.min(...radius)>.45,'REPLACEMENT_FORMS_REPEATED_RADIUS');
 let minArea=Infinity;
 for(let i=0;i<center.length;i++)for(let j=i+1;j<center.length;j++)for(let k=j+1;k<center.length;k++){
   const a=center[i],b=center[j],c=center[k];
   minArea=Math.min(minArea,Math.abs((b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x)));
 }
 const mx=center.reduce((s,v)=>s+v.x,0)/14,mz=center.reduce((s,v)=>s+v.z,0)/14;
 const xx=center.reduce((s,v)=>s+(v.x-mx)**2,0),zz=center.reduce((s,v)=>s+(v.z-mz)**2,0),xz=center.reduce((s,v)=>s+(v.x-mx)*(v.z-mz),0);
 const correlation=Math.abs(xz/Math.sqrt(xx*zz));
 assert(correlation<.94,'BOULDER_GROUPS_ARE_LINEAR');
 const gpuBytes=(rock.positions.byteLength+rock.normals.byteLength+rock.baseColorsLinear.byteLength+rock.indices.byteLength+
   rock.positions.length/3*(16+1+1+2+1+4+4));
 assert(gpuBytes<=LARGE_P2_BOULDER_PRESENTATION.maximumGpuBytes,'BOULDER_GPU_ALLOCATION_OVER_BUDGET');
 const combinedGpuBytes=8211732+gpuBytes;
 assert(combinedGpuBytes<=8388608,'SHARED_MEADOW_SMALL_ROCK_BOULDER_GPU_OVER_BUDGET');
 for(let j=0;j<rock.indices.length;j+=3){
   const [a,b,c]=[rock.indices[j],rock.indices[j+1],rock.indices[j+2]].map(i=>[rock.positions[i*3],rock.positions[i*3+1],rock.positions[i*3+2]]);
   const area=Math.hypot((b[1]-a[1])*(c[2]-a[2])-(b[2]-a[2])*(c[1]-a[1]),(b[2]-a[2])*(c[0]-a[0])-(b[0]-a[0])*(c[2]-a[2]),(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]));
   assert(area>1e-7,'SCULPTED_BOULDER_DEGENERATE_TRIANGLE');
 }
 return{correlation,gpuBytes,combinedGpuBytes,placementCenters:center,rockHeights:height,rockRadii:radius,
   sourceLargeTriangles:336,sourceSmallTrianglesPreserved:224,independentTerrainContactWitnesses:336};
}
export function verifyHEarthLargeP2Boulders(raw){
 const before={positions:sha(raw.buffers.positions),indices:sha(raw.buffers.indices),colors:sha(raw.buffers.baseColorsLinear)};
 const source=independentCensus(raw);
 const boulders=buildLargeP2BoulderPresentation(raw);
 const evidence=audit(boulders,raw,source);
 const after={positions:sha(raw.buffers.positions),indices:sha(raw.buffers.indices),colors:sha(raw.buffers.baseColorsLinear)};
 assert.deepEqual(after,before,'CANONICAL_WORLD_SOURCE_MUTATED');
 const renderer=fs.readFileSync(path.join(root,'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'),'utf8');
 for(const needle of ['initializeLargeP2Boulders();','drawLargeP2Boulders(false);','drawLargeP2Boulders(true);','suppressLargeP2SourceRockTriangles('])assert(renderer.includes(needle),'LARGE_P2_RENDERER_PATH_NOT_CONNECTED:'+needle);
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.manifest.json'),'utf8'));
 assert.equal(manifest.binary.sha256,'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a');
 for(const sourcePath of ['showroom/globe/h-earth/render/large-p2-boulder-presentation.v1.js','showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js']){
   const actual=execFileSync('git',['hash-object',path.join(root,sourcePath)],{encoding:'utf8'}).trim();
   assert.equal(manifest.sourceBlobs[sourcePath],actual,'NEW_SOURCE_GIT_BLOB_NOT_PINNED');
 }
 assert.equal(execFileSync('git',['hash-object',path.join(root,'showroom/globe/h-earth/render/geometry-landscape-sector.p2.js')],{encoding:'utf8'}).trim(),'c26247dcb69cb52c968fcd3ef6c2626eaa577d03');
 assert.equal(execFileSync('git',['hash-object',path.join(root,'showroom/globe/h-earth/render/woodland-rock-presentation.v1.js')],{encoding:'utf8'}).trim(),'77e7038d27862a39c31676d1d9a1ee9a84d5f267');
 const receipt=JSON.parse(fs.readFileSync(path.join(root,'h-earth-3d/experience-anchor/receipts/h-earth-meadow-mid-distance-patch-lod-20261013.receipt.json'),'utf8'));
 assert(receipt.disposition==='PENDING'&&receipt.releaseAuthorized===false&&receipt.reviewedAgainstAnchor===false);
 return{schema:'H_EARTH_GEN2698_LARGE_P2_BOULDER_INDEPENDENT_SOURCE_GEOMETRY_v1',
   result:'SOURCE_GEOMETRY_PASS_BROWSER_AND_OWNER_PENDING',...evidence,ownerVisualAcceptance:false,
   originalWorldChanged:false,approvedSmallRocksChanged:false,meadowGrassChanged:false,
   actualWebglPixelsVerified:false,productionDeployed:false};
}
if(process.argv.includes('--verify')){
 const raw=getHEarthRun8ER2ImmutableLiveRenderPackage({deferVegetation:true});
 const result=verifyHEarthLargeP2Boulders(raw);
 console.log(JSON.stringify(result,null,2));
}

/** Independent GPU groundcover qualification; creates no per-plant CPU meshes. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {getHEarthRun8ER2ImmutableLiveRenderPackage,getHEarthRun8ER2VegetationWorldTruthPlan} from '../../showroom/globe/h-earth/render/live-render-package.run8e-r2.js';
import {sampleHEarthRun8CSuccessorSurfaceMaterial} from '../environment/h-earth.gen2514-qualified-surface-material.run8c.js';
import {sampleHEarthGen311PlacementStructureDisposition,H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY as estate} from '../environment/h-earth.gen2514-qualified-placement-authority.js';
import {H_EARTH_OASIS_FOLIAGE_SAMPLE as oasis,buildHEarthWoodlandGrassTuft,buildHEarthMeadowFineGrassTemplate} from '../../showroom/globe/h-earth/render/grass-lowland-trial.js?cb=gen2674-meadow-fine-20261012';
import {buildHEarthGlobalGroundCover,selectHEarthGlobalGroundCoverDraws,selectHEarthMeadowFineDraw,H_EARTH_MEADOW_CARPET_PILOT as meadow,H_EARTH_GLOBAL_GROUND_COVER as profile} from '../../showroom/globe/h-earth/render/landscape-groundcover.global-v1.js?cb=gen2674-meadow-fine-20261012';

const digest=v=>createHash('sha256').update(typeof v==='string'||Buffer.isBuffer(v)?v:JSON.stringify(v)).digest('hex');
const radius=420000;
function inverse(x,y,z){const h=Math.hypot(x,z),a=Math.atan2(h,y+radius),k=h?a*radius/h:0;return {x:x*k,z:z*k,y:Math.hypot(h,y+radius)-radius};}
function segmentDistance(x,z,a,b){const dx=b.x-a.x,dz=b.z-a.z,den=dx*dx+dz*dz,t=den?Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/den)):0;return Math.hypot(x-a.x-t*dx,z-a.z-t*dz);}
function rectangleDistance(x,z,b){return Math.hypot(x-Math.max(b.minX,Math.min(b.maxX,x)),z-Math.max(b.minZ,Math.min(b.maxZ,z)));}
function clear(x,z,margin=0){
 for(const b of [estate.manorCore,estate.gardens,estate.outbuildingProposal,estate.acceptedEnvelope])assert(rectangleDistance(x,z,b)>margin,'PROTECTED_ESTATE_OVERLAP');
 for(let i=1;i<estate.footRoute.length;i++)assert(segmentDistance(x,z,estate.footRoute[i-1],estate.footRoute[i])>estate.footRouteRadius+margin,'ESTATE_ROUTE_OVERLAP');
 assert(segmentDistance(x,z,{x:-145,z:-194},{x:-145,z:-230})>1.5+margin,'WOODLAND_WALKING_OVERLAP');
 const disposition=sampleHEarthGen311PlacementStructureDisposition(x,z);assert(!disposition.hardExclusions.length&&!disposition.planningHolds.length,'PROTECTED_HOLD_OVERLAP');
}
function preserved(x,z,margin=0){return Math.hypot((x+141)/33,(z+226)/32)<=1.25+margin/32||x>=oasis.minX-margin&&x<=oasis.maxX+margin&&z>=oasis.minZ-margin&&z<=oasis.maxZ+margin;}
function triangle(vertices,id,owner){const [a,b,c]=vertices,dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,ex=c.x-a.x,ey=c.y-a.y,ez=c.z-a.z,den=dx*ez-dz*ex,ny=dz*ex-dx*ez;return {vertices,id,owner,den,slope:Math.abs(ny)>1e-12?Math.hypot(dy*ez-dz*ey,dx*ey-dy*ex)/Math.abs(ny):Infinity,box:[Math.min(a.x,b.x,c.x),Math.min(a.z,b.z,c.z),Math.max(a.x,b.x,c.x),Math.max(a.z,b.z,c.z)]};}
function interpolate(t,x,z){if(Math.abs(t.den)<1e-12)return null;const [a,b,c]=t.vertices,bw=((x-a.x)*(c.z-a.z)-(z-a.z)*(c.x-a.x))/t.den,cw=((b.x-a.x)*(z-a.z)-(b.z-a.z)*(x-a.x))/t.den,aw=1-bw-cw;if(Math.min(aw,bw,cw)<-1e-7)return null;return {y:aw*a.y+bw*b.y+cw*c.y,slope:t.slope,triangle:t};}
function tree(values){if(!values.length)return null;const box=[Infinity,Infinity,-Infinity,-Infinity];for(const t of values){box[0]=Math.min(box[0],t.box[0]);box[1]=Math.min(box[1],t.box[1]);box[2]=Math.max(box[2],t.box[2]);box[3]=Math.max(box[3],t.box[3]);}if(values.length<=12)return {box,values};const axis=box[2]-box[0]>box[3]-box[1]?0:1;values.sort((a,b)=>(a.box[axis]+a.box[axis+2])-(b.box[axis]+b.box[axis+2])||a.id-b.id);const mid=values.length>>1;return {box,left:tree(values.slice(0,mid)),right:tree(values.slice(mid))};}
function candidates(node,x,z,out=[]){if(!node||x<node.box[0]-1e-7||z<node.box[1]-1e-7||x>node.box[2]+1e-7||z>node.box[3]+1e-7)return out;if(node.values)out.push(...node.values);else {candidates(node.left,x,z,out);candidates(node.right,x,z,out);}return out;}
function independentSurface(pkg,refinement=null){const terrain=[],water=[],patch=[];
 for(const span of pkg.primitiveSpans){const owner=span.role==='TERRAIN'?'NEAR':span.primitiveId.includes('FAR_LAND_CONTINUATION')?'FAR':span.primitiveId.includes('FAR_OCEAN_CONTINUATION')?'WATER':null;if(!owner)continue;for(let i=span.indexStart;i<span.indexStart+span.indexCount;i+=3){const vertices=[0,1,2].map(k=>{const j=pkg.buffers.indices[i+k]*3;return {x:Math.fround(pkg.buffers.positions[j]),y:Math.fround(pkg.buffers.positions[j+1]),z:Math.fround(pkg.buffers.positions[j+2])};});(owner==='WATER'?water:terrain).push(triangle(vertices,i/3,owner));}}
 if(refinement)for(let i=0;i<refinement.indices.length;i+=3){const vertices=[0,1,2].map(k=>{const j=refinement.indices[i+k]*3;return {x:Math.fround(refinement.positions[j]),y:Math.fround(refinement.positions[j+1]),z:Math.fround(refinement.positions[j+2])};});patch.push(triangle(vertices,i/3,'REFINEMENT'));}
 const terrainTree=tree(terrain.slice()),waterTree=tree(water.slice()),patchTree=tree(patch.slice());
 const find=(index,x,z)=>candidates(index,x,z).sort((a,b)=>a.id-b.id).map(t=>interpolate(t,x,z)).find(Boolean)??null;
 return {terrain,water,patch,land:(x,z)=>refinement&&x>refinement.clip[0]&&x<refinement.clip[1]&&z>refinement.clip[2]&&z<refinement.clip[3]?find(patchTree,x,z):find(terrainTree,x,z),ocean:(x,z)=>find(waterTree,x,z)};
}

function arrayDigest(a){return digest(Buffer.from(a.buffer,a.byteOffset,a.byteLength));}
function stableDigest(cover){return digest({records:arrayDigest(cover.records),tiles:cover.tiles,
 template:Object.fromEntries(Object.entries(cover.template).filter(([,v])=>ArrayBuffer.isView(v)).map(([k,v])=>[k,arrayDigest(v)])),
 meadowFine:cover.meadowFine?{records:arrayDigest(cover.meadowFine.records),
 template:Object.fromEntries(Object.entries(cover.meadowFine.template).filter(([,v])=>ArrayBuffer.isView(v)).map(([k,v])=>[k,arrayDigest(v)])),
 mask:arrayDigest(cover.meadowFine.soilCoverage.pixels),receipt:cover.meadowFine.receipt}:null});}
function shaderRoot(template,root,record){const f=Math.fround,i=template.rootVertices[root]*3,dx=f(template.positions[i]*record[15]),dz=f(template.positions[i+2]*record[15]),c=f(Math.cos(record[14])),s=f(Math.sin(record[14]));return {x:f(record[12]+f(f(dx*c)-f(dz*s))),z:f(record[13]+f(f(dx*s)+f(dz*c)))};}
function habitat(material,slope,tag=0){
 if(material?.valid!==true||slope>.35)return false;
 if(tag===4)return material.surfaceClass==='DRY_SAND'&&slope<=.18&&material.shorelineDistance>=16&&material.shorelineDistance<=34&&material.rockExposure<.28&&material.soilDepth>=.35;
 return material.surfaceClass==='STONE_AND_SPARSE_SOIL'?material.soilDepth>=.035:['LOWLAND_SOIL','COASTAL_SOIL'].includes(material.surfaceClass)&&material.soilDepth>=.20;
}
function ecoSite(x,z){
 if(Math.abs(x+141)<=72&&Math.abs(z+226)<=70)return'WOODLAND_EDGE';
 if(Math.abs(x)<=90&&Math.abs(z+96)<=72)return'COAST';
 if(Math.abs(x+45)<=82&&Math.abs(z+326)<=68)return'MEADOW';
 return null;
}
function zone(z){return z< -420?'INLAND':z< -220?'WOODLAND_AND_FOOTHILL':'COASTAL';}
function acceptedTemplate(template){const tuft=buildHEarthWoodlandGrassTuft({id:`${profile.id}:ACCEPTED_FAN_TEMPLATE`,x:0,z:0,bladeCount:4,pocket:'OLIVE',sample:(x,z)=>({x,y:0,z,triangleId:0,terrainPrimitiveId:'FLAT_TEMPLATE'}),eligible:()=>true,inside:()=>true});assert.equal(template.positions.length,84);assert.equal(template.normals.length,84);assert.equal(template.colors.length,112);assert.equal(template.rootInfo.length,112);assert.equal(template.rootVertices.length,12);assert.equal(template.indices.length,72);assert.deepEqual(Array.from(template.indices),tuft.geometry.indices,'ACCEPTED_TEMPLATE_INDEX_DRIFT');for(let i=0;i<28;i++){const p=tuft.geometry.vertices[i];assert.deepEqual(Array.from(template.positions.subarray(i*3,i*3+3)),[Math.fround(p.x),Math.fround(p.y),Math.fround(p.z)],'ACCEPTED_TEMPLATE_POSITION_DRIFT');const blade=Math.floor(i/7),local=i%7,root=blade*3+(local<3?local:local<6?local-3:1);assert.equal(template.rootInfo[i*4],root,'GPU_ROOT_MAPPING_DRIFT');
const ground=tuft.geometry.vertices[blade*7+(local<3?local:local<6?local-3:1)];
assert.equal(template.rootInfo[i*4+1],Math.fround(ground.x),'ECO_ROOT_LOCAL_X_DRIFT');
assert.equal(template.rootInfo[i*4+2],Math.fround(ground.z),'ECO_ROOT_LOCAL_Z_DRIFT');
}for(let root=0;root<12;root++){const v=template.rootVertices[root];assert.equal(v,Math.floor(root/3)*7+root%3);assert.equal(template.positions[v*3+1],0);}}

export async function verifyHEarthGlobalGroundCover(pkg,{refinement=null,onProgress=()=>{},orders=true,worldTruth=true}={}){
 const started=performance.now(),cover=await buildHEarthGlobalGroundCover(pkg,{refinement,onProgress}),source=independentSurface(pkg,refinement),stable=stableDigest(cover);
 assert(cover.records instanceof Float32Array);assert.equal(cover.records.length%20,0);const count=cover.records.length/20;assert.equal(count,cover.receipt.instanceCount);assert(count>0&&count<=65536);assert.equal(cover.records.byteLength,count*80);acceptedTemplate(cover.template);
 // Run the exact immutable published-world placement algorithm with only the new
 // independently sampled pilot disabled, then prove every approved tall record
 // is preserved, not just the aggregate population or root count.
 const tallOnly=await buildHEarthGlobalGroundCover(pkg,{refinement,compositionEnabled:false});
 assert.equal(tallOnly.receipt.instanceCount,61235,'PUBLISHED_TALL_RECORD_COUNT_DRIFT');
 const tallRecords=new Float32Array(tallOnly.records.length);let tallCursor=0;
 for(let i=0;i<count;i++){const role=cover.records[i*20+19];if(role<2){tallRecords.set(cover.records.subarray(i*20,i*20+20),tallCursor);tallCursor+=20;}}
 assert.equal(tallCursor,tallOnly.records.length,'PUBLISHED_TALL_FAN_COUNT_DRIFT');
 assert.equal(arrayDigest(tallRecords),arrayDigest(tallOnly.records),'PUBLISHED_TALL_FLOAT32_RECORDS_CHANGED');
 const publishedTallSha256=arrayDigest(tallRecords);
 const templateBytes=['positions','normals','colors','rootInfo','indices'].reduce((n,k)=>n+cover.template[k].byteLength,0);assert.equal(templateBytes,cover.receipt.templateGpuBytes);assert(cover.meadowFine,'MEADOW_FINE_PRESENTATION_MISSING');
 const fine=cover.meadowFine,ft=fine.template,fr=fine.receipt;
 assert.equal(ft.recipe,'SHORELINE_DERIVED_TWELVE_FINE_FOLDED_LEAVES_84_VERTICES_72_TRIANGLES_v1');
 assert.equal(ft.positions.length,252);assert.equal(ft.indices.length,216);assert.equal(ft.rootVertices.length,12);
 assert.equal(fr.fineInstanceCount,fine.records.length/20);assert(fr.fineInstanceCount>=320&&fr.fineInstanceCount<=800);
 assert(fr.lowCount>=180&&fr.middleCount>=50&&fr.tallCount>0);
 assert.equal(fr.rootCount,fr.fineInstanceCount*12);
 assert(fr.coveredSoilTexels>=150,'MEADOW_CARPET_NOT_CONNECTED');
 assert.equal(fine.soilCoverage.width,80);assert.equal(fine.soilCoverage.height,80);
 assert.equal(fine.soilCoverage.pixels.length,6400);
 assert.equal(cover.receipt.totalGpuBytes,templateBytes+cover.records.byteLength+fr.templateBytes+fr.instanceBytes+fr.maskBytes);assert(cover.receipt.totalGpuBytes<=8*1024*1024);assert.equal(cover.receipt.canonicalPopulationChanged,false);assert.equal(cover.receipt.cameraIndependent,true);
 assert.equal(cover.tiles.reduce((n,t)=>n+t.count,0),count);let cursor=0;for(const t of cover.tiles){assert.equal(t.start,cursor,'TILE_RECORD_GAP');assert(t.count>0);cursor+=t.count;}
 let roots=0,maxGroundError=0,maxActualSlope=0,waterChecked=0,mountainRoots=0,refinementRoots=0;
 const ids=new Set(),classes={},zones={},occupied=new Set(),materialCache=new Map(),primaryBins=new Map(),siteCensus={};let primaryFans=0,secondaryFans=0,lowFans=0,midFans=0,duneFans=0,maximumSecondaryCenterOffset=0;
 for(let i=0;i<count;i++){const r=cover.records.subarray(i*20,i*20+20);if(r[19]===0){const key=`${Math.floor(r[12]/.5)}:${Math.floor(r[13]/.5)}`;if(!primaryBins.has(key))primaryBins.set(key,[]);primaryBins.get(key).push({x:r[12],z:r[13]});}}
 for(let instance=0;instance<count;instance++){const record=cover.records.subarray(instance*20,instance*20+20);assert(Array.from(record).every(Number.isFinite));assert(record[15]>0&&record[16]>0);assert(record[17]>=0&&record[17]<=2);assert(record[18]>=0&&record[18]<=1);assert([0,1,2,3,4].includes(record[19]),'INVALID_ECOLOGICAL_ROLE_TAG');if(record[19]===0)primaryFans++;else if(record[19]===1){secondaryFans++;let nearest=Infinity;const bx=Math.floor(record[12]/.5),bz=Math.floor(record[13]/.5);for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++)for(const p of primaryBins.get(`${bx+dx}:${bz+dz}`)??[])nearest=Math.min(nearest,Math.hypot(record[12]-p.x,record[13]-p.z));assert(nearest<=.3002,'SECONDARY_FAN_NOT_OVERLAPPING_PRIMARY');maximumSecondaryCenterOffset=Math.max(maximumSecondaryCenterOffset,nearest);assert(record[15]>=1.25-1e-6&&record[15]<=1.8+1e-6&&record[16]>=1.08-1e-6&&record[16]<=1.45+1e-6,'SECONDARY_FAN_SCALE_DRIFT');}
else{
 const role=record[19],center=source.land(record[12],record[13]);
 assert(center,'ECOLOGICAL_INDEPENDENT_CENTER_MISSING');
 const authoredCenter=inverse(record[12],center.y,record[13]),site=ecoSite(authoredCenter.x,authoredCenter.z);
 assert(site,'ECOLOGICAL_FAN_OUTSIDE_ADMITTED_HABITAT_WINDOWS');
 if(role===4){
  assert.equal(site,'COAST','DUNE_PIONEER_OUTSIDE_COAST');
  assert(record[15]>=.86-1e-6&&record[15]<=1.11+1e-6&&record[16]>=.30-1e-6&&record[16]<=.48+1e-6,'DRY_SAND_PIONEER_SCALE');
  duneFans++;
 }else if(role===2){
  assert(record[15]>=1.25-1e-6&&record[15]<=1.67+1e-6&&record[16]>=.23-1e-6&&record[16]<=.40+1e-6,'LOW_MAT_SCALE');
  lowFans++;
 }else{
  assert(record[15]>=1.12-1e-6&&record[15]<=1.48+1e-6&&record[16]>=.61-1e-6&&record[16]<=.83+1e-6,'MEDIUM_CLUMP_SCALE');
  midFans++;
 }
 const c=siteCensus[site]??={low:0,mid:0,dune:0};
 c[role===2?'low':role===3?'mid':'dune']++;
 const bx=Math.floor(record[12]/.5),bz=Math.floor(record[13]/.5);
 for(let dz=-2;dz<=2;dz++)for(let dx=-2;dx<=2;dx++)for(const p of primaryBins.get(`${bx+dx}:${bz+dz}`)??[])
  assert(Math.hypot(record[12]-p.x,record[13]-p.z)>.0001,'ECOLOGICAL_PATCH_REUSED_TALL_CENTER');
}
const id=`${record[12]}:${record[13]}:${record[14]}:${record[15]}:${record[16]}`;assert(!ids.has(id),'DUPLICATE_WORLD_ROOT');ids.add(id);const center=source.land(record[12],record[13]);assert(center,'CENTER_SUPPORT_MISSING');const authored=inverse(record[12],center.y,record[13]);clear(authored.x,authored.z,1.2);assert(!preserved(authored.x,authored.z,1.2),'ACCEPTED_PATCH_OVERLAP');const zn=zone(authored.z);zones[zn]=(zones[zn]??0)+1;occupied.add(`${Math.floor((record[12]+384)/32)}:${Math.floor((record[13]+736)/32)}`);
  for(let root=0;root<12;root++){const p=shaderRoot(cover.template,root,record),hit=source.land(p.x,p.z);assert(hit,`GPU_ROOT_SUPPORT_MISSING:${instance}:${root}`);const error=Math.abs(record[root]-hit.y);maxGroundError=Math.max(maxGroundError,error);assert(error<=.0001,`GPU_ROOT_GROUNDING_ERROR:${instance}:${root}:${error}`);maxActualSlope=Math.max(maxActualSlope,hit.slope);assert(hit.slope<=.35+1e-12,'GPU_ROOT_ACTUAL_SLOPE_EXCEEDED');const a=inverse(p.x,hit.y,p.z);clear(a.x,a.z);assert(!preserved(a.x,a.z),'GPU_ROOT_ACCEPTED_PATCH_OVERLAP');const key=`${a.x}:${a.z}`,m=materialCache.get(key)??sampleHEarthRun8CSuccessorSurfaceMaterial(a.x,a.z);materialCache.set(key,m);assert(habitat(m,hit.slope,record[19]),'GPU_ROOT_SOURCE_HABITAT_EXCLUDED');classes[m.surfaceClass]=(classes[m.surfaceClass]??0)+1;if(m.surfaceClass==='STONE_AND_SPARSE_SOIL')mountainRoots++;if(hit.triangle.owner==='REFINEMENT')refinementRoots++;for(const obstacle of pkg.landscapeCoverFootprints??[])assert(Math.hypot(p.x-obstacle.x,p.z-obstacle.z)>=obstacle.radius-1e-7,'GPU_ROOT_OBSTACLE_OVERLAP');const w=source.ocean(p.x,p.z);if(w){assert(record[root]>=w.y-.0001,`GPU_ROOT_SUBMERGED:${instance}:${root}`);waterChecked++;}roots++;}
  materialCache.clear();
  if(instance%1024===0){onProgress({phase:'INDEPENDENT_ROOT_VERIFICATION',completed:instance,total:count});await new Promise(resolve=>setTimeout(resolve,0));}
 }
 assert(primaryFans>0&&secondaryFans>0,'BUSHIER_PATCH_LAYER_MISSING');
 assert(lowFans>0&&midFans>0,'LOW_MIDDLE_ECOLOGICAL_COMPOSITION_MISSING');
 assert.equal(primaryFans+secondaryFans,61235,'PUBLISHED_TALL_FAN_COUNT_CHANGED');
 assert.equal(primaryFans+secondaryFans+lowFans+midFans+duneFans,count,'ECOLOGICAL_POPULATION_NOT_ACCOUNTED');
 assert.equal(cover.receipt.primaryFanCount,primaryFans);
 assert.equal(cover.receipt.secondaryFanCount,secondaryFans);
 assert.equal(cover.receipt.bushyClumpCount,secondaryFans);
 assert.equal(cover.receipt.ecologicalLowCount,lowFans);
 assert.equal(cover.receipt.ecologicalMidCount,midFans);
 assert.equal(cover.receipt.ecologicalDuneCount,duneFans);
 assert.equal(cover.receipt.ecologicalPilotCount,lowFans+midFans+duneFans);
 assert(cover.receipt.ecologicalPilotCount<=4301,'ECO_PILOT_GLOBAL_EXTRA_BUDGET');
 for(const t of cover.tiles){
  let extras=0;for(let n=t.start;n<t.start+t.count;n++)if(cover.records[n*20+19]>=2)extras++;
  assert.equal(t.ecoInstances,extras,'ECO_TILE_CENSUS_DRIFT');
  assert(extras<=24,'ECO_TILE_OVER_CAP');
 }
 
 // Independent survey of every fine-leaf root using the separate validator's
 // terrain index and source-material sampler, not generator acceptance claims.
 let fineRootsChecked=0,fineMaximumHeightError=0;const fineCenters=new Set(),fineRootCells=new Set();
 for(let i=0;i<fr.fineInstanceCount;i++){
   const record=fine.records.subarray(i*20,i*20+20);
   assert(Array.from(record).every(Number.isFinite),'MEADOW_FINE_NONFINITE');
   assert(Math.hypot(record[12]-meadow.centerX,record[13]-meadow.centerZ)<meadow.radius,'MEADOW_FINE_CENTER_OUTSIDE');
   assert([0,1,2].includes(record[19]),'MEADOW_FINE_LAYER_INVALID');
   const key=`${record[12]}:${record[13]}`;assert(!fineCenters.has(key),'MEADOW_FINE_DUPLICATE');fineCenters.add(key);
   for(let root=0;root<12;root++){
     const point=shaderRoot(ft,root,record),hit=source.land(point.x,point.z);
     assert(hit,'MEADOW_FINE_SURFACE_MISSING');
     const error=Math.abs(hit.y-record[root]);fineMaximumHeightError=Math.max(fineMaximumHeightError,error);
     assert(error<=.0001,`MEADOW_FINE_FLOAT32_GROUND_DRIFT:${i}:${root}:${error}`);
     const authored=inverse(point.x,hit.y,point.z),m=sampleHEarthRun8CSuccessorSurfaceMaterial(authored.x,authored.z);
     assert(Math.hypot(point.x-meadow.centerX,point.z-meadow.centerZ)<meadow.radius,'MEADOW_FINE_ROOT_OUTSIDE');
     assert(hit.slope<=.32+1e-12,'MEADOW_FINE_STEEP');
     assert(m.valid&&['LOWLAND_SOIL','COASTAL_SOIL'].includes(m.surfaceClass)&&m.soilDepth>=.20&&(m.rockExposure??0)<=.48,'MEADOW_FINE_HABITAT');
     clear(authored.x,authored.z,.06);assert(!preserved(authored.x,authored.z,.06),'MEADOW_FINE_PRESERVED');
     for(const obstacle of pkg.landscapeCoverFootprints??[])assert(Math.hypot(point.x-obstacle.x,point.z-obstacle.z)>=obstacle.radius+.06-1e-7,'MEADOW_FINE_TREE');
     const sea=source.ocean(point.x,point.z);if(sea)assert(record[root]>=sea.y-.0001,'MEADOW_FINE_SUBMERGED');
     fineRootsChecked++;fineRootCells.add(`${Math.floor(point.x*2)}:${Math.floor(point.z*2)}`);
   }
   if(i%256===0)await new Promise(resolve=>setTimeout(resolve,0));
 }
 assert(fineRootCells.size>=150,'MEADOW_FINE_NOT_ENOUGH_ROOTS');
 const expectedFineTemplate=buildHEarthMeadowFineGrassTemplate();
 for(const name of ['positions','normals','colors','rootInfo','rootVertices','indices'])
   assert.equal(arrayDigest(ft[name]),arrayDigest(expectedFineTemplate[name]),'MEADOW_FINE_TEMPLATE_SOURCE_DRIFT:'+name);
 const coverage={eligibleBlocks:0,occupiedEligibleBlocks:0,excludedBlocks:0,zones:{}};
 for(let iz=0;iz<27;iz++)for(let ix=0;ix<24;ix++){const x=-384+ix*32+16,z=-736+iz*32+16,t=source.land(x,z);if(!t){coverage.excludedBlocks++;continue;}const a=inverse(x,t.y,z),m=sampleHEarthRun8CSuccessorSurfaceMaterial(a.x,a.z);let protectedPoint=false;try{clear(a.x,a.z,1.2);}catch{protectedPoint=true;}if(protectedPoint||preserved(a.x,a.z,1.2)||!habitat(m,t.slope)||(pkg.landscapeCoverFootprints??[]).some(o=>Math.hypot(x-o.x,z-o.z)<o.radius+1.2)){coverage.excludedBlocks++;continue;}coverage.eligibleBlocks++;if(occupied.has(`${ix}:${iz}`))coverage.occupiedEligibleBlocks++;const zn=zone(a.z),entry=coverage.zones[zn]??={eligibleBlocks:0,occupiedBlocks:0,instances:zones[zn]??0};entry.eligibleBlocks++;if(occupied.has(`${ix}:${iz}`))entry.occupiedBlocks++;}
 for(const [name,v] of Object.entries(coverage.zones))assert(v.instances>0,`ELIGIBLE_ZONE_EMPTY:${name}`);coverage.occupationRatio=coverage.eligibleBlocks?coverage.occupiedEligibleBlocks/coverage.eligibleBlocks:0;
 const cameras=[{x:0,y:10,z:-96},{x:-141,y:15,z:-226},{x:-45,y:10,z:-326},{x:150,y:45,z:-500},{x:370,y:20,z:-700},{x:10000,y:0,z:10000}];const visibility=[];
 for(const camera of cameras){const fineDraw=selectHEarthMeadowFineDraw(cover,camera,{maximumInstances:4096});
 const selected=selectHEarthGlobalGroundCoverDraws(cover,camera,{maximumInstances:4096-fineDraw.count,maximumDraws:fineDraw.count?63:64});
 assert(fineDraw.count+selected.visibleInstanceCount<=4096&&selected.draws.length+(fineDraw.count?1:0)<=64,'MEADOW_SHARED_DRAW_LIMIT');assert.equal(selected.storedInstanceCount,count);assert.equal(selected.populationChanged,false);assert(selected.draws.length<=64&&selected.visibleInstanceCount<=4096);assert.equal(selected.draws.reduce((n,d)=>n+d.count,0),selected.visibleInstanceCount);const seen=new Set();for(const d of selected.draws){assert(Number.isInteger(d.start)&&Number.isInteger(d.count)&&Number.isInteger(d.stride)&&d.stride>=1&&d.count>=1);assert(d.start>=0&&d.start+(d.count-1)*d.stride<count);const tile=cover.tiles.find(t=>t.start===d.start);assert(tile&&d.start+(d.count-1)*d.stride<tile.start+tile.count,'LOD_READS_NEIGHBOR_TILE');for(let i=0;i<d.count;i++){const n=d.start+i*d.stride;assert(!seen.has(n),'LOD_DUPLICATE_INSTANCE');seen.add(n);}}assert.deepEqual(selectHEarthGlobalGroundCoverDraws(cover,camera,{maximumInstances:4096-fineDraw.count,maximumDraws:fineDraw.count?63:64}),selected,'LOD_SELECTION_NONDETERMINISTIC');visibility.push({camera,visibleInstanceCount:selected.visibleInstanceCount+fineDraw.count,meadowFineVisibleCount:fineDraw.count,drawCallCount:selected.draws.length+(fineDraw.count?1:0),visiblePilotCount:[...seen].filter(n=>cover.records[n*20+19]>=2).length});}
 assert.equal(stableDigest(cover),stable,'CAMERA_LOD_MUTATED_WORLD');
 if(orders)for(const order of ['REVERSE','CHUNKED'])assert.equal(stableDigest(await buildHEarthGlobalGroundCover(pkg,{refinement,onProgress,order})),stable,`WORLD_GENERATION_ORDER_DRIFT:${order}`);
 // Independent final-byte proof for camera-first tile construction.
 // Neither accepted placements nor canonical packed tile ranges may change.
 const priorityCamera={x:-139.40267987050615,z:-194.5};
 const streamed=new Map();let firstPriorityTile=null,priorityTileCount=0;
 const priority=await buildHEarthGlobalGroundCover(pkg,{refinement,onProgress,order:'CAMERA_FIRST',priorityOrigin:priorityCamera,onTile:tile=>{
   const id=`${tile.ix}:${tile.iz}`;
   assert(!streamed.has(id),'CAMERA_FIRST_DUPLICATE_TILE');
   assert(tile.records instanceof Float32Array,'CAMERA_FIRST_TILE_NOT_FLOAT32');
   assert.equal(tile.records.length,tile.instanceCount*20,'CAMERA_FIRST_TILE_STRIDE_DRIFT');
   if(!firstPriorityTile)firstPriorityTile={ix:tile.ix,iz:tile.iz,instanceCount:tile.instanceCount,recordBytes:tile.records.byteLength};
   streamed.set(id,{count:tile.instanceCount,sha256:arrayDigest(tile.records)});
   priorityTileCount++;
 }});
 assert.equal(priorityTileCount,648,'CAMERA_FIRST_TILE_COUNT_MISMATCH');
 assert.deepEqual([firstPriorityTile.ix,firstPriorityTile.iz],[7,16],'CAMERA_FIRST_INITIAL_TILE_NOT_NEAREST');
 assert.equal(stableDigest(priority),stable,'CAMERA_FIRST_WORLD_RECORD_OR_TILE_DRIFT');
 assert.equal(arrayDigest(priority.records),arrayDigest(cover.records),'CAMERA_FIRST_FLOAT32_RECORD_DRIFT');
 for(const tile of priority.tiles){
   const ix=Math.round((tile.minX+384)/32),iz=Math.round((tile.minZ+736)/32),streamedTile=streamed.get(`${ix}:${iz}`);
   assert(streamedTile,'CAMERA_FIRST_TILE_STREAM_MISSING');
   assert.equal(tile.count,streamedTile.count,'CAMERA_FIRST_TILE_COUNT_CHANGED');
   assert.equal(arrayDigest(priority.records.subarray(tile.start*20,(tile.start+tile.count)*20)),streamedTile.sha256,'CAMERA_FIRST_TILE_STREAM_RECORD_MISMATCH');
 }
 const cameraFirstProof={camera:priorityCamera,firstPriorityTile,streamedTileCount:priorityTileCount,finalDigest:stable,finalFloat32RecordSha256:arrayDigest(priority.records),fullWorldPopulationsMatch:true,tileDataAvailableBeforeFullWorld:true,earlyGpuTilePresentationClaimed:false};
 let truth=null;if(worldTruth){const value=getHEarthRun8ER2VegetationWorldTruthPlan();assert.equal(value.instanceCount,27585);assert.equal(value.batches.length,108);assert.equal(value.droppedPlacementCount,0);truth={instanceCount:value.instanceCount,batchCount:value.batches.length,droppedPlacementCount:value.droppedPlacementCount};}
 const textureWidth=1024,textureHeight=Math.ceil(cover.records.length/4/textureWidth),fineTextureHeight=Math.ceil(fine.records.length/4/256),paddedGpuBytes=textureWidth*textureHeight*16+templateBytes+256*fineTextureHeight*16+fr.templateBytes+fr.maskBytes;assert(paddedGpuBytes<=8*1024*1024,'PADDED_TEXTURE_GPU_BUDGET_EXCEEDED');
 return {schema:'H_EARTH_GLOBAL_GROUND_COVER_INDEPENDENT_QUALIFICATION_v1',result:'PASS',cameraFirstProof,stableWorldSha256:stable,recordsSha256:arrayDigest(cover.records),storedInstances:count,primaryFans,secondaryFans,lowFans,midFans,duneFans,siteCensus,publishedTallSha256,maximumSecondaryCenterOffset,recordStrideBytes:80,templateVertices:28,templateTriangles:24,totalGpuBytes:cover.receipt.totalGpuBytes,paddedRgba32fTextureGpuBytes:paddedGpuBytes,meadowFine:{...fr,fineRootsChecked,fineMaximumHeightError,fineOccupiedHalfMeterCells:fineRootCells.size},roots,maxGroundError,maxActualSlope,waterChecked,mountainRoots,refinementRoots,classes,zones,coverage,visibility,generationOrders:orders?3:1,canonicalWorldTruth:truth,preparationReceipt:cover.receipt,elapsedMilliseconds:performance.now()-started,qualificationBoundaries:{actualBrowserInstancing:'SEPARATE_REQUIRED',shaderCompilation:'SEPARATE_REQUIRED',physicalDevicePerformance:'NOT_ESTABLISHED'},productMutationPerformed:false,mergePerformed:false,deploymentPerformed:false};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2),arg=k=>{const i=args.indexOf(k);return i<0?null:args[i+1];},root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
 const paths=['showroom/globe/h-earth/render/landscape-groundcover.global-v1.js','showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js','h-earth-3d/validation/h-earth.global-groundcover.v1.mjs'];const sourceDigests=Object.fromEntries(paths.map(p=>[p,digest(fs.readFileSync(path.join(root,p)))]));
 if(arg('--candidate-head')){assert(/^[a-f0-9]{40}$/.test(arg('--candidate-head')));assert(arg('--git-repository'));for(const [p,sha] of Object.entries(sourceDigests))assert.equal(sha,digest(execFileSync('git',['-C',arg('--git-repository'),'show',`${arg('--candidate-head')}:${p}`],{maxBuffer:32*1024*1024})),`EXACT_CANDIDATE_SOURCE_MISMATCH:${p}`);}
 const accepted=['showroom/globe/h-earth/render/grass-lowland-trial.js','showroom/globe/h-earth/render/geometry-landscape-sector.p2.js','showroom/globe/h-earth/render/geometry-landscape-cover.js'];if(arg('--baseline')){assert(arg('--git-repository'));const grass='showroom/globe/h-earth/render/grass-lowland-trial.js';
 const oldGrass=execFileSync('git',['-C',arg('--git-repository'),'show',`${arg('--baseline')}:${grass}`],{maxBuffer:32*1024*1024}).toString('utf8');
 assert(fs.readFileSync(path.join(root,grass),'utf8').startsWith(oldGrass),'PUBLISHED_SHORELINE_CHANGED');
 for(const p of accepted.filter(v=>v!==grass))assert.equal(digest(fs.readFileSync(path.join(root,p))),digest(execFileSync('git',['-C',arg('--git-repository'),'show',`${arg('--baseline')}:${p}`],{maxBuffer:32*1024*1024})),`ACCEPTED_OVERLAY_SOURCE_DRIFT:${p}`);}
 const start=performance.now(),pkg=getHEarthRun8ER2ImmutableLiveRenderPackage({deferVegetation:true}),rawPackageMilliseconds=performance.now()-start;
 let refinement=null;
 if(args.includes('--refinement-fixture')){const surface=independentSurface(pkg);let center=null;for(let z=-704;z<0&&!center;z+=32)for(let x=-352;x<352&&!center;x+=32){const hit=surface.land(x,z);if(!hit||hit.slope>.20)continue;const a=inverse(x,hit.y,z);let excluded=false;try{clear(a.x,a.z,12);}catch{excluded=true;}const m=sampleHEarthRun8CSuccessorSurfaceMaterial(a.x,a.z);if(!excluded&&!preserved(a.x,a.z,12)&&habitat(m,hit.slope))center={x,z,y:hit.y};}assert(center,'REFINEMENT_FIXTURE_SITE_MISSING');const {x,z,y}=center;refinement={positions:new Float32Array([x-8,y+.12,z-8,x+8,y+.12,z-8,x-8,y+.12,z+8,x+8,y+.12,z+8]),indices:new Uint32Array([0,2,1,1,2,3]),clip:[x-8,x+8,z-8,z+8]};}
 const report=await verifyHEarthGlobalGroundCover(pkg,{refinement,orders:!args.includes('--single-order'),worldTruth:!args.includes('--skip-world-truth'),onProgress:v=>{if(v.phase==='GLOBAL_COVER_COMPLETE'||v.phase==='INDEPENDENT_ROOT_VERIFICATION'&&v.completed%8192===0)process.stderr.write(JSON.stringify(v)+'\n');}});
 if(refinement){assert(report.refinementRoots>0,'REFINEMENT_FIXTURE_NOT_EXERCISED');report.refinementFixture={clip:refinement.clip,positions:Array.from(refinement.positions),indices:Array.from(refinement.indices),purpose:'FLOAT32_REPLACEMENT_SURFACE_OWNERSHIP_ONLY_NOT_PRODUCT_GEOMETRY'};}
 Object.assign(report,{executedHead:arg('--candidate-head'),baseline:arg('--baseline'),sourceDigests,rawPackageMilliseconds,acceptedOverlaySourcesUnchanged:Boolean(arg('--baseline'))});if(arg('--output'))fs.writeFileSync(arg('--output'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}


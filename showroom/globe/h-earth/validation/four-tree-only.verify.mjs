#!/usr/bin/env node
// H-Earth Gen2638: real original-vs-candidate construction, exact approved
// geometry retention, zero old woodland meshes, and non-tree continuity.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim();
const baseline='23eb1bb79c13b2d79e7006e2d9bf664ecf31aed2';
const treePath='showroom/globe/h-earth/render/geometry-woodland-tree-trial.js';
const builderPath='showroom/globe/h-earth/render/geometry-landscape-sector.p2.js';
const rendererPath='showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
const allowed=new Set(['P2_TREE_A_03','P2_TREE_A_06','P2_TREE_A_08','P2_TREE_A_11']);
const hash=value=>createHash('sha256').update(value).digest('hex');
const digest=obj=>hash(JSON.stringify(obj));
// Gen2651 source-bound optional grass-transition qualification. The original
// tree-only default continues to require exact non-tree byte identity.
const grassTransitionReceiptPath='h-earth-3d/experience-anchor/receipts/h-earth-woodland-grass-ecotone-20261010.receipt.json';
const grassTransitionFile=path.join(root,grassTransitionReceiptPath);
const scopedReceipt=fs.existsSync(grassTransitionFile)?JSON.parse(fs.readFileSync(grassTransitionFile,'utf8')):null;
const scopedGrassTransition=scopedReceipt?.operationId==='H_EARTH_WOODLAND_CLEARING_GRASS_ECOTONE_20261010_001'&&
  scopedReceipt?.referenceMaterial?.intentionalGrassTransition===true;
if(scopedReceipt&&!scopedGrassTransition)throw new Error('GRASS_TRANSITION_RECEIPT_NOT_AUTHORIZED');
if(scopedGrassTransition){
  const sourcePath='showroom/globe/h-earth/render/woodland-clearing-trial.js';
  const expected=scopedReceipt.experienceFiles?.find(f=>f.path===sourcePath)?.sha256;
  assert.equal(expected,hash(fs.readFileSync(path.join(root,sourcePath))),'GRASS_TRANSITION_EXACT_SHA_MISMATCH');
  assert.equal(scopedReceipt.referenceMaterial.originalGrassBlob,'db2c7d2e132743e0ced34444dd2272ac5eba24ce','GRASS_TRANSITION_ORIGINAL_SOURCE_ID_MISMATCH');
  assert.equal(scopedReceipt.referenceMaterial.parentMaterialHead,'46de47cd86b9215e0ae82f9b8e6e252331fa9bdc','GRASS_TRANSITION_MATERIAL_PARENT_MISMATCH');
  assert.equal(scopedReceipt.referenceMaterial.approvedFourTreeGeometryBlob,'c26247dcb69cb52c968fcd3ef6c2626eaa577d03','GRASS_TRANSITION_APPROVED_TREE_ID_MISMATCH');
  assert.equal(scopedReceipt.limits?.releaseEligible,false,'GRASS_TRANSITION_RELEASE_AUTHORITY_FORBIDDEN');
}

assert.equal(hash(fs.readFileSync(path.join(root,treePath))),'15ef7838a2c47ad0ef219b57da80373d8ba48ebb3bda271bcf7cdaa0c23a3e36','APPROVED_TREE_SOURCE_CHANGED');
const source=fs.readFileSync(path.join(root,builderPath),'utf8');
const renderer=fs.readFileSync(path.join(root,rendererPath),'utf8');
assert(source.includes('retainApprovedMesh(bark,\'bark\')')&&source.includes('retainApprovedMesh(foliage,\'canopy\')'),'APPROVED_MESH_FILTER_MISSING');
assert(renderer.includes('drawablePrimitives=batch.primitives.filter'),'DEFERRED_DRAW_FILTER_MISSING');
assert(renderer.includes("primitive?.metadata?.archetypeId!=='HIGHLAND_CONIFER_SAPLING'"),'DEFERRED_CONIFER_CLASS_NOT_EXCLUDED');
assert(renderer.includes('for(let pi=0;pi<drawablePrimitives.length;pi++)'),'DRAW_UPLOAD_USES_UNFILTERED_PRIMITIVES');
assert(renderer.includes('batch.instanceCount!==descriptor.count'),'CANONICAL_POPULATION_ACCOUNTING_CHANGED');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'h-earth-four-only-old-builder-'));
const copied=new Set();
function copyBaseline(rel){
 if(copied.has(rel))return;
 assert(!rel.startsWith('../')&&!path.isAbsolute(rel),'BASELINE_DEPENDENCY_ESCAPE');
 copied.add(rel);
 const bytes=execFileSync('git',['show',baseline+':'+rel],{cwd:root,maxBuffer:64*1024*1024});
 const dst=path.join(temp,rel);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.writeFileSync(dst,bytes);
 if(/\.m?js$/.test(rel))for(const m of bytes.toString('utf8').matchAll(/(?:from\s*|import\s*\()(['"])(\.[^'"]+)\1/g)){
  const dep=path.posix.normalize(path.posix.join(path.posix.dirname(rel),m[2].split('?')[0]));
  copyBaseline(dep);
 }
}
try {
 copyBaseline(builderPath);
 const {previewHEarthFunctionalLandscape}=await import(pathToFileURL(path.join(root,'showroom/globe/h-earth/render/landscape-preview.js')));
 const terrain=previewHEarthFunctionalLandscape().componentResults.terrain.primitive;
 const prior=(await import(pathToFileURL(path.join(temp,builderPath)))).buildHEarthLandscapeSector({terrainPrimitive:terrain});
 const current=(await import(pathToFileURL(path.join(root,builderPath)))).buildHEarthLandscapeSector({terrainPrimitive:terrain});
 assert.equal(prior.eligible,true,'PRIOR_SECTOR_INVALID');
 assert.equal(current.eligible,true,'FOUR_ONLY_SECTOR_INVALID:'+JSON.stringify(current.issues));
 const oldTrees=prior.manifest.filter(p=>p.kind==='TREE'),newTrees=current.manifest.filter(p=>p.kind==='TREE');
 assert.equal(newTrees.length,4,'TREE_CENSUS_NOT_FOUR');
 assert(oldTrees.length>newTrees.length,'OLD_WOODLAND_POPULATION_NOT_PRESENT_IN_BASELINE');
 assert.deepEqual(new Set(newTrees.map(p=>p.id)),allowed,'APPROVED_TREE_IDENTITIES_CHANGED');
 const primitive=(s,kind)=>{const p=s.primitives.find(p=>p.primitiveId==='H_EARTH_LANDSCAPE_P2_'+kind);assert(p,'MISSING_PRIMITIVE:'+kind);return p};
 function objectPart(s,obj,kind){
  const p=primitive(s,kind),prefix={BARK:'bark',CANOPY:'canopy'}[kind];
  const start=obj[prefix+'VertexStart'],count=obj[prefix+'VertexCount'];
  assert(Number.isInteger(start)&&Number.isInteger(count)&&count>0,'INVALID_APPROVED_TREE_SPAN:'+obj.id+':'+kind);
  const faces=[];
  for(let i=0;i<p.geometry.indices.length;i+=3){
   const face=p.geometry.indices.slice(i,i+3),inside=face.map(id=>id>=start&&id<start+count);
   assert(!(inside.some(Boolean)&&!inside.every(Boolean)),'CROSS_TREE_FACE:'+obj.id+':'+kind);
   if(inside.every(Boolean))faces.push(...face.map(id=>id-start));
  }
  return {vertices:p.geometry.vertices.slice(start,start+count),indices:faces,
    colors:p.renderMaterial.vertexRgba.slice(start,start+count),
    clearing:p.renderMaterial.clearingAttributes.slice(start,start+count)};
 }
 for(const id of allowed){
  const before=oldTrees.find(t=>t.id===id),after=newTrees.find(t=>t.id===id);
  assert(before&&after,'APPROVED_TREE_MISSING:'+id);
  for(const kind of ['BARK','CANOPY'])assert.equal(digest(objectPart(prior,before,kind)),digest(objectPart(current,after,kind)),'APPROVED_TREE_GEOMETRY_DRIFT:'+id+':'+kind);
 }
 // Strictly preserve rock vertices, indices, colors and manifest in ALL modes.
 for(const kind of ['ROCK']){
  const a=primitive(prior,kind),b=primitive(current,kind);
  assert.equal(digest(a.geometry.vertices),digest(b.geometry.vertices),'NON_TREE_VERTEX_DRIFT:'+kind);
  assert.equal(digest(a.geometry.indices),digest(b.geometry.indices),'NON_TREE_INDEX_DRIFT:'+kind);
  assert.equal(digest(a.renderMaterial.vertexRgba),digest(b.renderMaterial.vertexRgba),'NON_TREE_COLOR_DRIFT:'+kind);
 }
 let grassTransitionMetrics=null;
 if(scopedGrassTransition){
  // The admitted Gen2651 change is ONLY the published clearing's 8m grass
  // ecotone; all other grass objects remain intact after index rebasing.
  const grassOld=primitive(prior,'GRASS'),grassNew=primitive(current,'GRASS');
  const before=prior.manifest.filter(p=>p.kind==='GRASS');
  const after=current.manifest.filter(p=>p.kind==='GRASS');
  const oldMap=new Map(before.map(p=>[p.id,p])),newMap=new Map(after.map(p=>[p.id,p]));
  const B={minX:-155.40267987050615,maxX:-123.40267987050615,minZ:-226.74616902099837,maxZ:-194.74616902099837};
  const edge=m=>Math.min(m.x-B.minX,B.maxX-m.x,m.z-B.minZ,B.maxZ-m.z);
  const comparable=m=>{
   const {grassVertexStart,rootPoints,leafOrigins,...rest}=m;
   const normalize=arr=>arr?.map(({vertexIndex,...r})=>({vertexIndex:vertexIndex-grassVertexStart,...r}));
   return {...rest,...(rootPoints?{rootPoints:normalize(rootPoints)}:{}),...(leafOrigins?{leafOrigins:normalize(leafOrigins)}:{})};
  };
  let added=0,removed=0,preserved=0,maxChangedDistance=0;
  for(const [id,entry] of oldMap){
   const next=newMap.get(id);
   if(!next){removed++;assert(edge(entry)>=0&&edge(entry)<8.6,'GRASS_OUTSIDE_FEATHER_REMOVED:'+id);continue;}
   assert.equal(digest(comparable(entry)),digest(comparable(next)),'UNCHANGED_GRASS_METADATA_DRIFT:'+id);
   for(const [label,beforeData,afterData] of [
     ['VERTICES',grassOld.geometry.vertices,grassNew.geometry.vertices],
     ['COLORS',grassOld.renderMaterial.vertexRgba,grassNew.renderMaterial.vertexRgba],
     ['ATTRIBUTES',grassOld.renderMaterial.clearingAttributes,grassNew.renderMaterial.clearingAttributes]
   ])assert.equal(
     digest(beforeData.slice(entry.grassVertexStart,entry.grassVertexStart+entry.grassVertexCount)),
     digest(afterData.slice(next.grassVertexStart,next.grassVertexStart+next.grassVertexCount)),
     'UNCHANGED_GRASS_GEOMETRY_DRIFT:'+id+':'+label
   );
   preserved++;
  }
  for(const [id,entry] of newMap)if(!oldMap.has(id)){
   added++;
   assert(edge(entry)>=0&&edge(entry)<8.6,'GRASS_OUTSIDE_FEATHER_ADDED:'+id);
   assert(id.startsWith('MEADOW_COVER_'),'NON_NATIVE_GRASS_INJECTED:'+id);
  }
  // Source-measured deterministic limits, not a generalized permission for
  // arbitrary vegetation changes. All approved tree geometry was checked above.
  assert.equal(grassNew.geometry.vertices.length,54804,'GRASS_TRANSITION_VERTEX_COUNT_MISMATCH');
  assert.equal(grassNew.geometry.indices.length/3,41692,'GRASS_TRANSITION_TRIANGLE_COUNT_MISMATCH');
  assert.equal(current.diagnostics.triangleCount,60652,'SECTOR_TRIANGLE_COUNT_MISMATCH');
  assert.equal(after.filter(p=>p.id.startsWith('CLEARING_GRASS_')).length,501,'CLEARING_DENSITY_TAPER_MISMATCH');
  assert(added>0&&removed>0&&grassNew.geometry.indices.length<grassOld.geometry.indices.length,'GRASS_TRANSITION_BUDGET_NOT_BOUNDED');
  assert.equal(digest(prior.manifest.filter(p=>p.kind==='ROCK')),digest(current.manifest.filter(p=>p.kind==='ROCK')),'NON_GRASS_ROCK_MANIFEST_DRIFT');
  grassTransitionMetrics={scope:'GEN2651_INTENTIONAL_GRASS_ONLY',removed,added,preserved,vertices:grassNew.geometry.vertices.length,triangles:grassNew.geometry.indices.length/3,sectorTriangles:current.diagnostics.triangleCount,protection:'TREE_BARK_CANOPY_AND_ROCK_IDENTICAL'};
 }else{
  // Preserve original four-tree-only invariant exactly when no independently
  // admitted source-bound grass-transition receipt is provided.
  const grassA=primitive(prior,'GRASS'),grassB=primitive(current,'GRASS');
  assert.equal(digest(grassA.geometry.vertices),digest(grassB.geometry.vertices),'NON_TREE_VERTEX_DRIFT:GRASS');
  assert.equal(digest(grassA.geometry.indices),digest(grassB.geometry.indices),'NON_TREE_INDEX_DRIFT:GRASS');
  assert.equal(digest(grassA.renderMaterial.vertexRgba),digest(grassB.renderMaterial.vertexRgba),'NON_TREE_COLOR_DRIFT:GRASS');
  const oldOther=prior.manifest.filter(p=>p.kind!=='TREE');
  const newOther=current.manifest.filter(p=>p.kind!=='TREE');
  assert.equal(digest(oldOther),digest(newOther),'NON_TREE_MANIFEST_DRIFT');
 }
 const report={schema:'H_EARTH_FOUR_TREE_ONLY_VERIFICATION_v1',result:'PASS',
  sourceBaseline:baseline,approvedTreeIds:[...allowed],approvedCount:newTrees.length,
  oldVisibleTreeCount:0,oldConstructedTreeCount:oldTrees.length,
  approvedGeometryUnchanged:true,grassUnchanged:!scopedGrassTransition,rockUnchanged:true,
  intentionalGrassTransition:scopedGrassTransition,grassTransitionMetrics,
  deferredConiferGpuDrawExcluded:true,
  limits:['ACTUAL_BROWSER_GPU_SCREENSHOT_REQUIRED','PHONE_FRAME_TIMING_REQUIRES_DEVICE'],
  verifiedCandidate:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim()};
 console.log(JSON.stringify(report,null,2));
} finally {fs.rmSync(temp,{recursive:true,force:true});}

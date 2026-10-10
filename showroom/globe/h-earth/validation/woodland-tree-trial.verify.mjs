/** West delta qualification. Automated evidence does not grant physical acceptance. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
const arg=name=>process.argv[process.argv.indexOf(name)+1];
const baselineSha=process.argv.includes('--baseline')?arg('--baseline'):'89df5371e0afb4ae7f53aead80071fae613e1f46';
assert.equal(baselineSha,'89df5371e0afb4ae7f53aead80071fae613e1f46','ADMITTED_BASELINE_MISMATCH');
const sectorPath='showroom/globe/h-earth/render/geometry-landscape-sector.p2.js';
const allowedPaths=[sectorPath,'showroom/globe/h-earth/render/geometry-woodland-tree-trial.js','showroom/globe/h-earth/validation/woodland-tree-trial.verify.mjs','showroom/globe/h-earth/validation/woodland-tree-trial.record.json','h-earth-3d/experience-anchor/receipts/h-earth-woodland-tree-trial-20261008.receipt.json'];
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const same=(a,b,label)=>assert.equal(digest(a),digest(b),label);
const changed=[...git('diff','--name-only',baselineSha).trim().split('\n'),...git('ls-files','--others','--exclude-standard').trim().split('\n')].filter(Boolean);
assert(changed.every(p=>allowedPaths.includes(p)),`EXACT_SCOPE_MISMATCH:${changed.filter(p=>!allowedPaths.includes(p)).join(',')}`);
const candidateHead=git('rev-parse','HEAD').trim();
const sourcePaths=allowedPaths.filter(p=>p.endsWith('.js')||p.endsWith('.mjs'));
const sourceHashes=()=>Object.fromEntries(sourcePaths.map(p=>[p,createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex')]));
const frozenSourceSha256=sourceHashes();
const importStart=performance.now();
const {previewHEarthFunctionalLandscape}=await import(pathToFileURL(path.join(root,'showroom/globe/h-earth/render/landscape-preview.js')).href);
const {buildHEarthLandscapeSector}=await import(pathToFileURL(path.join(root,sectorPath)).href);
const terrain=previewHEarthFunctionalLandscape().componentResults.terrain.primitive;
const terrainBefore=digest(terrain),importAndTerrainMs=performance.now()-importStart;
const baselineText=git('show',`${baselineSha}:${sectorPath}`),temp=fs.mkdtempSync(path.join(os.tmpdir(),'hearth-tree-baseline-'));
let baseline,baselineMs;
try{
 const source=baselineText.replace(/from (['"])(\.[^'"]+)\1/g,(_,q,target)=>`from ${q}${new URL(target,pathToFileURL(path.join(root,sectorPath))).href}${q}`);
 const file=path.join(temp,'sector.mjs');fs.writeFileSync(file,source);
 const builder=(await import(pathToFileURL(file).href)).buildHEarthLandscapeSector;
 const start=performance.now();baseline=builder({terrainPrimitive:terrain});baselineMs=performance.now()-start;
}finally{fs.rmSync(temp,{recursive:true,force:true});}
console.log('Baseline geometry regenerated from admitted git identity.');
const start=performance.now(),sector=buildHEarthLandscapeSector({terrainPrimitive:terrain}),candidateMs=performance.now()-start;
for(const [name,s] of [['BASELINE',baseline],['CANDIDATE',sector]]){
 assert.equal(s.eligible,true,`${name}:${s.issues.join(',')}`);assert.equal(s.diagnostics.treeCount,65,`${name}_TREE_POPULATION`);
 assert.equal(s.diagnostics.grassTuftCount,1432,`${name}_GRASS_POPULATION`);assert.equal(s.primitives.length,4,`${name}_BATCH_COUNT`);
 assert(s.diagnostics.triangleCount<=64000,`${name}_SECTOR_BUDGET`);
}
const primitive=(s,name)=>s.primitives.find(p=>p.primitiveId===`H_EARTH_LANDSCAPE_P2_${name}`);
const normalizeManifest=p=>Object.fromEntries(Object.entries(p).filter(([k])=>!['barkVertexStart','barkVertexCount','canopyVertexStart','canopyVertexCount','treeVariation'].includes(k)));
const treePart=(s,t,name)=>{
 const p=primitive(s,name),prefix=name==='BARK'?'bark':'canopy',start=t[`${prefix}VertexStart`],count=t[`${prefix}VertexCount`],end=start+count,indices=[];
 for(let i=0;i<p.geometry.indices.length;i+=3){const face=p.geometry.indices.slice(i,i+3),touch=face.some(v=>v>=start&&v<end);if(touch){assert(face.every(v=>v>=start&&v<end),'CROSS_TREE_TRIANGLE');indices.push(...face.map(v=>v-start));}}
 return{vertices:p.geometry.vertices.slice(start,end),normals:p.geometry.normals.slice(start,end),colors:p.renderMaterial.vertexRgba.slice(start,end),indices};
};
const trees=sector.manifest.filter(p=>p.kind==='TREE'),oldTrees=new Map(baseline.manifest.filter(p=>p.kind==='TREE').map(p=>[p.id,p]));
assert.equal(trees.length,65,'TREE_MANIFEST_POPULATION');assert.equal(oldTrees.size,65,'BASELINE_TREE_ID_POPULATION');
assert.equal(new Set(trees.map(t=>t.id)).size,65,'DUPLICATE_TREE_ID');same(trees.map(t=>t.id).sort(),[...oldTrees.keys()].sort(),'TREE_ID_SET_DRIFT');
for(const [label,s] of [['BASELINE',baseline],['CANDIDATE',sector]])for(const name of ['BARK','CANOPY']){
 const p=primitive(s,name),prefix=name==='BARK'?'bark':'canopy',owners=new Int16Array(p.geometry.vertices.length).fill(-1),ranges=s.manifest.filter(t=>t.kind==='TREE');
 assert.equal(p.geometry.indices.length%3,0,`${label}_TRIANGLE_INDEX_MULTIPLE`);
 ranges.forEach((t,owner)=>{const start=t[`${prefix}VertexStart`],count=t[`${prefix}VertexCount`];assert(Number.isInteger(start)&&Number.isInteger(count)&&start>=0&&count>0&&start+count<=owners.length,`${label}_TREE_RANGE_INVALID:${t.id}`);for(let j=start;j<start+count;j++){assert.equal(owners[j],-1,`${label}_TREE_RANGE_OVERLAP:${t.id}`);owners[j]=owner;}});
 assert([...owners].every(owner=>owner>=0),`${label}_ORPHAN_TREE_VERTEX:${name}`);
 for(let j=0;j<p.geometry.indices.length;j+=3){const ids=p.geometry.indices.slice(j,j+3);assert(ids.every(v=>Number.isInteger(v)&&v>=0&&v<owners.length),`${label}_INVALID_GLOBAL_TREE_INDEX:${name}`);assert(ids.every(v=>owners[v]===owners[ids[0]]),`${label}_CROSS_TREE_TRIANGLE:${name}`);}
}
const summaries=[],shapeSignatures=new Set();let checkedTriangles=0;
for(const tree of trees){
 const old=oldTrees.get(tree.id);assert(old,'TREE_IDENTITY_CHANGED');same(normalizeManifest(tree),normalizeManifest(old),`TREE_MANIFEST_DRIFT:${tree.id}`);
 const parts=['BARK','CANOPY'].map(name=>treePart(sector,tree,name)),oldParts=['BARK','CANOPY'].map(name=>treePart(baseline,old,name));
 assert.notEqual(digest(parts),digest(oldParts),`TREE_GEOMETRY_UNCHANGED:${tree.id}`);
 assert.equal(tree.treeVariation?.recipe,'OPAQUE_CURVED_HIERARCHY_LIGHT_v1','TREE_RECIPE_IDENTITY');
 const triangles=parts.reduce((n,p)=>n+p.indices.length/3,0),oldTriangles=oldParts.reduce((n,p)=>n+p.indices.length/3,0),vertices=parts.reduce((n,p)=>n+p.vertices.length,0),oldVertices=oldParts.reduce((n,p)=>n+p.vertices.length,0);
 assert(triangles<=oldTriangles,`TREE_TRIANGLE_CEILING:${tree.id}`);assert(vertices<=oldVertices,`TREE_VERTEX_CEILING:${tree.id}`);
 same(parts[0].vertices.slice(0,6),oldParts[0].vertices.slice(0,6),`ROOT_RING_CHANGED:${tree.id}`);same(parts[0].colors.slice(0,6),oldParts[0].colors.slice(0,6),`ROOT_COLOR_CHANGED:${tree.id}`);same(tree.support,old.support,`ROOT_SUPPORT_CHANGED:${tree.id}`);assert(tree.support.minimumMeasuredBurial>=.12-1e-9,'ROOT_BURIAL');
 let horizontalExtent=0,maxY=-Infinity,minY=Infinity;
 for(const part of parts){
  assert.equal(part.colors.length,part.vertices.length,'COLOR_COUNT');assert.equal(part.normals.length,part.vertices.length,'NORMAL_COUNT');
  for(const v of [...part.vertices,...part.normals])assert(['x','y','z'].every(k=>Number.isFinite(v[k])),'NONFINITE_GEOMETRY');
  for(const v of part.vertices){horizontalExtent=Math.max(horizontalExtent,Math.hypot(v.x-tree.x,v.z-tree.z));maxY=Math.max(maxY,v.y);minY=Math.min(minY,v.y);}
  for(const c of part.colors)assert(c.length===4&&c[3]===255&&c.every(v=>Number.isInteger(v)&&v>=0&&v<=255),'NON_OPAQUE_VERTEX');
  for(let i=0;i<part.indices.length;i+=3){const ids=part.indices.slice(i,i+3);assert(ids.every(j=>Number.isInteger(j)&&j>=0&&j<part.vertices.length),'INVALID_INDEX');const [a,b,c]=ids.map(j=>part.vertices[j]),u=[b.x-a.x,b.y-a.y,b.z-a.z],v=[c.x-a.x,c.y-a.y,c.z-a.z],area=Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]);assert(area>1e-10,`DEGENERATE_TREE_TRIANGLE:${tree.id}`);checkedTriangles++;}
 }
 assert(horizontalExtent<=tree.crownRadius+1e-9,`ACCEPTED_HORIZONTAL_FOOTPRINT_EXCEEDED:${tree.id}`);
 const oldMax=Math.max(...oldParts.flatMap(p=>p.vertices.map(v=>v.y))),oldMin=Math.min(...oldParts.flatMap(p=>p.vertices.map(v=>v.y)));
 assert(maxY<=Math.max(oldMax,tree.y+tree.height)+1e-9,`HEIGHT_ENVELOPE_EXCEEDED:${tree.id}`);assert(minY>=oldMin-1e-9,`ROOT_ENVELOPE_EXCEEDED:${tree.id}`);
 const signature=digest(parts.map(p=>({vertices:p.vertices.map(v=>[Number(((v.x-tree.x)/tree.crownRadius).toFixed(6)),Number(((v.y-tree.y)/tree.height).toFixed(6)),Number(((v.z-tree.z)/tree.crownRadius).toFixed(6))]),indices:p.indices})));shapeSignatures.add(signature);
 summaries.push({id:tree.id,vertices,baselineVertices:oldVertices,triangles,baselineTriangles:oldTriangles,observableBytes:69*vertices+12*triangles,baselineObservableBytes:69*oldVertices+12*oldTriangles,horizontalExtent,signature});
}
assert.equal(shapeSignatures.size,65,'TREE_VARIATION_NOT_65_DISTINCT_FORMS');
const candidateTreeBytes=summaries.reduce((n,t)=>n+t.observableBytes,0),baselineTreeBytes=summaries.reduce((n,t)=>n+t.baselineObservableBytes,0);assert.equal(baselineTreeBytes,1337970,'FROZEN_BASELINE_TREE_STORAGE_MISMATCH');assert(candidateTreeBytes<=baselineTreeBytes,'TREE_STORAGE_CEILING');assert.equal(baseline.diagnostics.triangleCount,61044,'FROZEN_BASELINE_SECTOR_MISMATCH');
for(const name of ['ROCK','GRASS'])same(primitive(sector,name),primitive(baseline,name),`PRESERVED_${name}_DRIFT`);
same(sector.manifest.filter(p=>p.kind!=='TREE'),baseline.manifest.filter(p=>p.kind!=='TREE'),'GRASS_ROCK_MANIFEST_DRIFT');
same(Object.fromEntries(Object.entries(sector.diagnostics).filter(([k])=>k!=='triangleCount')),Object.fromEntries(Object.entries(baseline.diagnostics).filter(([k])=>k!=='triangleCount')),'ECOLOGICAL_DECISION_DRIFT');
assert.equal(digest(terrain),terrainBefore,'TERRAIN_INPUT_MUTATED');
console.log('Surrounding geometry, ecological decisions, support, and all-tree storage/triangle checks pass.');
const reverseStart=performance.now(),reverse=buildHEarthLandscapeSector({terrainPrimitive:terrain,reverseGenerationOrder:true,grassCellOrder:'CHUNKED'}),reverseMs=performance.now()-reverseStart;
same(reverse,sector,'REVERSE_CHUNKED_GENERATION_DRIFT');
assert.equal(git('rev-parse','HEAD').trim(),candidateHead,'CANDIDATE_HEAD_CHANGED_DURING_VERIFICATION');
same(sourceHashes(),frozenSourceSha256,'SOURCE_BYTES_CHANGED_DURING_VERIFICATION');
const report={schema:'H_EARTH_ALL_TREE_VARIATION_VERIFICATION_v1',status:'PASS',operationId:'H_EARTH_ALL_TREE_VARIATION_20261008',generation:2630,baseline:baselineSha,candidateHead,frozenSourceSha256,workingTreeClean:git('status','--porcelain').trim()==='',changedPaths:[...new Set(changed)].sort(),treeCount:65,distinctTreeForms:shapeSignatures.size,grassTuftCount:1432,baselineTreeBytes,candidateTreeBytes,perTree:summaries,baselineSectorTriangles:baseline.diagnostics.triangleCount,sectorTriangles:sector.diagnostics.triangleCount,sectorCeiling:64000,primitiveCount:4,checkedTriangles,terrainSha256:terrainBefore,baselineSectorSha256:digest(baseline),candidateSectorSha256:digest(sector),generationOrder:'FORWARD_EQUALS_REVERSED_AND_CHUNKED',timingsMs:{importAndTerrain:importAndTerrainMs,baselineSector:baselineMs,candidateSector:candidateMs,reverseSector:reverseMs},physicalDeviceAcceptance:'NOT_ESTABLISHED_BY_AUTOMATED_VERIFICATION'};
if(process.argv.includes('--output'))fs.writeFileSync(arg('--output'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));

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
const baselineSha=process.argv.includes('--baseline')?arg('--baseline'):'ea294bfe896502031d142982f0c87c9b82febfec';
assert.equal(baselineSha,'ea294bfe896502031d142982f0c87c9b82febfec','ADMITTED_BASELINE_MISMATCH');
const targetId='P2_TREE_A_11',sectorPath='showroom/globe/h-earth/render/geometry-landscape-sector.p2.js';
const allowedPaths=[sectorPath,'showroom/globe/h-earth/render/geometry-woodland-tree-trial.js','showroom/globe/h-earth/validation/woodland-tree-trial.verify.mjs','showroom/globe/h-earth/validation/woodland-tree-trial.record.json','h-earth-3d/experience-anchor/receipts/h-earth-woodland-tree-trial-20261008.receipt.json'];
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const same=(a,b,label)=>assert.equal(digest(a),digest(b),label);
const changed=[...git('diff','--name-only',baselineSha).trim().split('\n'),...git('ls-files','--others','--exclude-standard').trim().split('\n')].filter(Boolean);
assert(changed.every(p=>allowedPaths.includes(p)),`EXACT_SCOPE_MISMATCH:${changed.filter(p=>!allowedPaths.includes(p)).join(',')}`);
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
const normalizeManifest=p=>Object.fromEntries(Object.entries(p).filter(([k])=>!['barkVertexStart','barkVertexCount','canopyVertexStart','canopyVertexCount'].includes(k)));
const treePart=(s,t,name)=>{
 const p=primitive(s,name),prefix=name==='BARK'?'bark':'canopy',start=t[`${prefix}VertexStart`],count=t[`${prefix}VertexCount`],end=start+count,indices=[];
 for(let i=0;i<p.geometry.indices.length;i+=3){const face=p.geometry.indices.slice(i,i+3),touch=face.some(v=>v>=start&&v<end);if(touch){assert(face.every(v=>v>=start&&v<end),'CROSS_TREE_TRIANGLE');indices.push(...face.map(v=>v-start));}}
 return{vertices:p.geometry.vertices.slice(start,end),normals:p.geometry.normals.slice(start,end),colors:p.renderMaterial.vertexRgba.slice(start,end),indices};
};
const trees=sector.manifest.filter(p=>p.kind==='TREE'),oldTrees=new Map(baseline.manifest.filter(p=>p.kind==='TREE').map(p=>[p.id,p]));
for(const tree of trees){const old=oldTrees.get(tree.id);assert(old,'TREE_IDENTITY_CHANGED');same(normalizeManifest(tree),normalizeManifest(old),`TREE_MANIFEST_DRIFT:${tree.id}`);if(tree.id!==targetId)for(const name of ['BARK','CANOPY'])same(treePart(sector,tree,name),treePart(baseline,old,name),`NON_TARGET_GEOMETRY_DRIFT:${tree.id}:${name}`);}
const target=trees.find(p=>p.id===targetId),oldTarget=oldTrees.get(targetId);assert(target);
const parts=['BARK','CANOPY'].map(name=>treePart(sector,target,name)),oldParts=['BARK','CANOPY'].map(name=>treePart(baseline,oldTarget,name));
assert.notEqual(digest(parts),digest(oldParts),'TARGET_GEOMETRY_UNCHANGED');
const targetTriangles=parts.reduce((n,p)=>n+p.indices.length/3,0),baselineTargetTriangles=oldParts.reduce((n,p)=>n+p.indices.length/3,0);
assert.equal(baselineTargetTriangles,644,'BASELINE_TARGET_COST');assert(targetTriangles<=2000,'TARGET_BUDGET_EXCEEDED');
same(parts[0].vertices.slice(0,6),oldParts[0].vertices.slice(0,6),'ROOT_RING_CHANGED');same(target.support,oldTarget.support,'ROOT_SUPPORT_CHANGED');assert(target.support.minimumMeasuredBurial>=.12-1e-9,'ROOT_BURIAL');
let checkedTriangles=0;
for(const part of parts){
 assert.equal(part.colors.length,part.vertices.length,'COLOR_COUNT');assert.equal(part.normals.length,part.vertices.length,'NORMAL_COUNT');
 for(const v of [...part.vertices,...part.normals])assert(['x','y','z'].every(k=>Number.isFinite(v[k])),'NONFINITE_GEOMETRY');
 for(const c of part.colors)assert(c.length===4&&c[3]===255&&c.every(v=>Number.isInteger(v)&&v>=0&&v<=255),'NON_OPAQUE_VERTEX');
 for(let i=0;i<part.indices.length;i+=3){const ids=part.indices.slice(i,i+3);assert(ids.every(j=>Number.isInteger(j)&&j>=0&&j<part.vertices.length),'INVALID_INDEX');const [a,b,c]=ids.map(j=>part.vertices[j]),u=[b.x-a.x,b.y-a.y,b.z-a.z],v=[c.x-a.x,c.y-a.y,c.z-a.z],area=Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]);assert(area>1e-10,'DEGENERATE_TARGET_TRIANGLE');checkedTriangles++;}
}
for(const name of ['ROCK','GRASS'])same(primitive(sector,name),primitive(baseline,name),`PRESERVED_${name}_DRIFT`);
same(sector.manifest.filter(p=>p.kind!=='TREE'),baseline.manifest.filter(p=>p.kind!=='TREE'),'GRASS_ROCK_MANIFEST_DRIFT');
same(Object.fromEntries(Object.entries(sector.diagnostics).filter(([k])=>k!=='triangleCount')),Object.fromEntries(Object.entries(baseline.diagnostics).filter(([k])=>k!=='triangleCount')),'ECOLOGICAL_DECISION_DRIFT');
assert.equal(digest(terrain),terrainBefore,'TERRAIN_INPUT_MUTATED');
console.log('Surrounding geometry, ecological decisions, support, and target triangle checks pass.');
const reverseStart=performance.now(),reverse=buildHEarthLandscapeSector({terrainPrimitive:terrain,reverseGenerationOrder:true,grassCellOrder:'CHUNKED'}),reverseMs=performance.now()-reverseStart;
same(reverse,sector,'REVERSE_CHUNKED_GENERATION_DRIFT');
const report={schema:'H_EARTH_ONE_TREE_REALISM_VERIFICATION_v1',status:'PASS',baseline:baselineSha,candidateHead:git('rev-parse','HEAD').trim(),workingTreeClean:git('status','--porcelain').trim()==='',changedPaths:[...new Set(changed)].sort(),targetId,treeCount:65,grassTuftCount:1432,preservedTreeCount:64,baselineTargetTriangles,targetTriangles,sectorTriangles:sector.diagnostics.triangleCount,sectorCeiling:64000,primitiveCount:4,checkedTriangles,terrainSha256:terrainBefore,baselineSectorSha256:digest(baseline),candidateSectorSha256:digest(sector),generationOrder:'FORWARD_EQUALS_REVERSED_AND_CHUNKED',timingsMs:{importAndTerrain:importAndTerrainMs,baselineSector:baselineMs,candidateSector:candidateMs,reverseSector:reverseMs},physicalDeviceAcceptance:'NOT_ESTABLISHED_BY_AUTOMATED_VERIFICATION'};
if(process.argv.includes('--output'))fs.writeFileSync(arg('--output'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));

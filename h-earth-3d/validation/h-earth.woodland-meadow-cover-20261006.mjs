/** Exact bounded woodland–meadow delta qualification; physical acceptance is separate. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {previewHEarthFunctionalLandscape} from '../../showroom/globe/h-earth/render/landscape-preview.js';
import {buildHEarthLandscapeSector} from '../../showroom/globe/h-earth/render/geometry-landscape-sector.p2.js';
import {sampleHEarthRun8CSuccessorSurfaceMaterial} from '../environment/h-earth.gen2514-qualified-surface-material.run8c.js';
import {H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY as policy} from '../environment/h-earth.gen2514-qualified-placement-authority.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const spec=JSON.parse(fs.readFileSync(path.join(root,'h-earth-3d/environment/woodland-meadow-cover-20261006.spec.json'),'utf8'));
if(process.argv.includes('--baseline'))assert.equal(process.argv[process.argv.indexOf('--baseline')+1],spec.baseline,'BASELINE_ARGUMENT_MISMATCH');
const sectorPath='showroom/globe/h-earth/render/geometry-landscape-sector.p2.js';
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:20*1024*1024});
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const terrain=previewHEarthFunctionalLandscape().componentResults.terrain.primitive;
const sector=buildHEarthLandscapeSector({terrainPrimitive:terrain});
assert.equal(sector.eligible,true,sector.issues.join(','));
for(const options of [{reverseGenerationOrder:true},{grassCellOrder:'REVERSE'},{grassCellOrder:'CHUNKED'}])assert.equal(digest(buildHEarthLandscapeSector({terrainPrimitive:terrain,...options})),digest(sector),'GENERATION_ORDER_DRIFT');
const baselineText=git('show',`${spec.geometryBaseline}:${sectorPath}`);
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'hearth-ecotone-baseline-'));
let baseline;
try{
 const source=baselineText.replace(/from (['"])(\.[^'"]+)\1/g,(_,q,target)=>`from ${q}${new URL(target,pathToFileURL(path.join(root,sectorPath))).href}${q}`);
 const baselineFile=path.join(temp,'sector.mjs');fs.writeFileSync(baselineFile,source);
 baseline=(await import(pathToFileURL(baselineFile).href)).buildHEarthLandscapeSector({terrainPrimitive:terrain});
}finally{fs.rmSync(temp,{recursive:true,force:true});}
for(const name of ['BARK','CANOPY','ROCK']){const id=`H_EARTH_LANDSCAPE_P2_${name}`;assert.equal(digest(sector.primitives.find(p=>p.primitiveId===id)),digest(baseline.primitives.find(p=>p.primitiveId===id)),`PRESERVED_${name}_DRIFT`);}
assert.equal(digest(sector.manifest.filter(p=>p.kind!=='GRASS')),digest(baseline.manifest.filter(p=>p.kind!=='GRASS')),'TREE_ROCK_MANIFEST_DRIFT');
const cacheNormalize=s=>s.replaceAll('meadow-cover-20261006','ecotone-trial-20261006');
const recipePath='showroom/globe/h-earth/render/grass-lowland-trial.js';
for(const p of spec.exactAllowedPaths.filter(p=>(p.endsWith('.js')||p.endsWith('.html')||p.endsWith('h-earth.json'))&&p!==sectorPath&&p!==recipePath))assert.equal(cacheNormalize(fs.readFileSync(path.join(root,p),'utf8')),git('show',`${spec.baseline}:${p}`),`CACHE_ONLY_SOURCE_DRIFT:${p}`);
const current=cacheNormalize(fs.readFileSync(path.join(root,sectorPath),'utf8')),admitted=git('show',`${spec.baseline}:${sectorPath}`);
assert.equal(current.slice(0,current.indexOf(' // One authored ecotone')),admitted.slice(0,admitted.indexOf(' // One authored ecotone')),'NON_GRASS_PREFIX_DRIFT');
assert.equal(current.slice(current.indexOf(' const primitives=[];')),admitted.slice(admitted.indexOf(' const primitives=[];')),'NON_GRASS_SUFFIX_DRIFT');
const recipe=fs.readFileSync(path.join(root,recipePath),'utf8'),oldRecipe=git('show',`${spec.baseline}:${recipePath}`);
// Only inherited group-trial woodland height/width/bend and two-blade admission may differ.
const normalizeRecipe=s=>s.replace(/const shortLayer=.*?;\n    const heading=.*?;\n    const bend=.*?;/s,'WOODLAND_RECIPE').replace('[2,6,7,8,18]','[6,7,8,18]');
assert.equal(normalizeRecipe(recipe),normalizeRecipe(oldRecipe),'OASIS_OR_OTHER_RECIPE_SOURCE_DRIFT');
const changed=[...git('diff','--name-only').trim().split('\n'),...git('ls-files','--others','--exclude-standard').trim().split('\n')].filter(Boolean);
assert(changed.every(p=>spec.exactAllowedPaths.includes(p)),'EXACT_SCOPE_MISMATCH');
// Independent brute-force support search; no runtime bins/sampler are reused.
const triangles=[];for(let i=0;i<terrain.geometry.indices.length;i+=3){const t=terrain.geometry.indices.slice(i,i+3).map(j=>{const v=terrain.geometry.vertices[j];return{x:Math.fround(v.x),y:Math.fround(v.y),z:Math.fround(v.z)};});if(Math.max(...t.map(v=>v.x))<-174||Math.min(...t.map(v=>v.x))>-108||Math.max(...t.map(v=>v.z))<-258||Math.min(...t.map(v=>v.z))>-194)continue;triangles.push({t,index:i/3});}
const brute=(x,z)=>{for(const {t:[a,b,c],index} of triangles){const determinant=(b.z-c.z)*(a.x-c.x)+(c.x-b.x)*(a.z-c.z);if(Math.abs(determinant)<1e-10)continue;const u=((b.z-c.z)*(x-c.x)+(c.x-b.x)*(z-c.z))/determinant,v=((c.z-a.z)*(x-c.x)+(a.x-c.x)*(z-c.z))/determinant,w=1-u-v;if(Math.min(u,v,w)<-1e-7)continue;const cross=(b.x-a.x)*(c.z-a.z)-(c.x-a.x)*(b.z-a.z),dx=((b.y-a.y)*(c.z-a.z)-(c.y-a.y)*(b.z-a.z))/cross,dz=((b.x-a.x)*(c.y-a.y)-(c.x-a.x)*(b.y-a.y))/cross;return{y:u*a.y+v*b.y+w*c.y,index,slope:Math.hypot(dx,dz)};}return null;};
const routeDistance=(x,z)=>Math.hypot(x+145,z-Math.max(-230,Math.min(-194,z)));
const ellipse=(x,z)=>Math.hypot((x+141)/33,(z+226)/32);
const rectangles=[policy.manorCore,policy.gardens,policy.outbuildingProposal,policy.acceptedEnvelope,policy.viewProposal,policy.terrainBuffer].filter(Boolean);
const grass=sector.primitives.find(p=>p.primitiveId==='H_EARTH_LANDSCAPE_P2_GRASS');
for(const v of grass.geometry.vertices){assert(ellipse(v.x,v.z)<=1,'ELLIPSE_VERTEX_EXCLUSION');assert(routeDistance(v.x,v.z)>1.5,'WALKING_VERTEX_EXCLUSION');for(const b of rectangles)assert(!(v.x>=b.minX&&v.x<=b.maxX&&v.z>=b.minZ&&v.z<=b.maxZ),'ESTATE_VERTEX_EXCLUSION');}
let roots=0,maxGroundError=0,maxTipHeight=0;
const tufts=sector.manifest.filter(p=>p.kind==='GRASS');
for(const p of tufts){assert.equal(p.bladeCount,2);assert.equal(p.rootPoints.length,6);assert.equal(p.grassVertexCount,32);assert(routeDistance(p.x,p.z)>2.3);for(const witness of p.rootPoints){const v=grass.geometry.vertices[witness.vertexIndex],support=brute(v.x,v.z);assert(support,'ROOT_SUPPORT_MISSING');assert(support.slope<=.45,'ROOT_SLOPE_EXCEEDED');assert(['LOWLAND_SOIL','COASTAL_SOIL'].includes(sampleHEarthRun8CSuccessorSurfaceMaterial(v.x,v.z)?.surfaceClass),'ROOT_MATERIAL_EXCLUDED');for(const tree of sector.manifest.filter(p=>p.kind==='TREE'))assert(Math.hypot(v.x-tree.x,v.z-tree.z)>=(tree.trunkRadius??(.32+tree.height*.018))+.5,'ROOT_TRUNK_CLEARANCE');const error=Math.abs(v.y-support.y);maxGroundError=Math.max(maxGroundError,error);assert(error<=.0001,'ROOT_GROUNDING_ERROR');roots++;}for(let blade=0;blade<2;blade++){const start=p.grassVertexStart+blade*16,tip=grass.geometry.vertices[start+15],base=grass.geometry.vertices[start+1];maxTipHeight=Math.max(maxTipHeight,tip.y-base.y);assert(tip.y-base.y<=.827,'INHERITED_BLADE_HEIGHT_EXCEEDED');}}
assert.equal(tufts.length,spec.frozenRules.preflightAcceptedTufts,'FROZEN_PREFLIGHT_COUNT_MISMATCH');
const decisions=sector.diagnostics.grassTrial.decisions;
assert.equal(new Set(decisions.map(p=>p.id)).size,decisions.length);
assert.equal(decisions.filter(p=>p.accepted).length,tufts.length);
assert(decisions.every(p=>p.reason&&p.groundTriangle!==undefined&&p.surfaceClass!==undefined));
const profiles=[['CANOPY',p=>p.canopy>=.5],['OPEN',p=>p.canopy<.5&&p.edge>=.5],['FEATHER',p=>p.edge<.5]].map(([name,fn])=>{const a=decisions.filter(p=>p.eligible&&fn(p));return{name,eligibleCells:a.length,estimatedEligibleArea:a.length*9*Math.sqrt(3)/2,retainedTufts:a.filter(p=>p.accepted).length,meanTargetDensity:a.reduce((n,p)=>n+p.density,0)/a.length};});
assert(profiles[0].retainedTufts>=1,'NO_RETAINED_CANOPY_TUFT');assert(profiles[1].meanTargetDensity>profiles[0].meanTargetDensity,'CANOPY_OPEN_DENSITY_INVERSION');
const grassVertices=grass.geometry.vertices.length,grassTriangles=grass.geometry.indices.length/3,grassBufferBytes=grassVertices*69+grass.geometry.indices.length*4;
assert(tufts.length<=252);assert(grassVertices<=8064);assert(grassTriangles<=9072);assert(grassBufferBytes<=665280);assert(sector.diagnostics.triangleCount<=35748);
// Base package cost inherits untouched other geometry: only grass vertices/indices change.
const oldGrass=baseline.primitives.find(p=>p.primitiveId==='H_EARTH_LANDSCAPE_P2_GRASS'),deltaVertices=grassVertices-oldGrass.geometry.vertices.length,deltaTriangles=grassTriangles-oldGrass.geometry.indices.length/3;
const report={schema:'H_EARTH_WOODLAND_MEADOW_COVER_MECHANICAL_QUALIFICATION_v1',result:'PASS',executedHead:git('rev-parse','HEAD').trim(),trackedWorkingTreeClean:git('status','--porcelain','--untracked-files=no').trim()==='',baseline:spec.baseline,sectorDigest:digest(sector),terrainDigest:digest(terrain),decisionDigest:digest(decisions),acceptedTufts:tufts.length,blades:tufts.length*2,rootColumns:roots,maxGroundError,maxTipHeight,grassVertices,grassTriangles,grassBufferBytes,sectorTriangles:sector.diagnostics.triangleCount,baseVertices:47095+deltaVertices,baseTriangles:78918+deltaTriangles,baseStartupGeometryBufferBytes:4196571+deltaVertices*69+deltaTriangles*3*4,drawRangesUnchanged:9,profiles,decisionReasons:Object.fromEntries([...new Set(decisions.map(p=>p.reason))].map(reason=>[reason,decisions.filter(p=>p.reason===reason).length])),unchangedNonGrassGeometry:true,orderVariants:3,physicalDeviceAcceptance:'NOT_ESTABLISHED',browserReadinessQualification:'SEPARATE_REQUIRED'};
assert(report.baseVertices<=47095&&report.baseTriangles<=78918&&report.baseStartupGeometryBufferBytes<=4196571);
const output=process.argv[process.argv.indexOf('--output')+1];if(process.argv.includes('--output'))fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));

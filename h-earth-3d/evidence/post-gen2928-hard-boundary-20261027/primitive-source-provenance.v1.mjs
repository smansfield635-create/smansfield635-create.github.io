/** Gen2935 exact-production terrain primitive seam/provenance audit. Read-only.
 * Does not mutate the world, shader, main, vegetation or publisher.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHEarthRun8ER2DCanonicalGPUUploadViews} from '../../../showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const file=name=>path.join(ROOT,name);
const PUBLISHED_RENDERER_SHA='fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec';
const SOURCE_SHA='48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a';
const NEAR='H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_MOUNTAIN_NEUTRAL_PRIMITIVE_001';
const FAR='H_EARTH_WORLD_MANIFOLD:FAR_LAND_CONTINUATION';
const sourcePaths=Object.freeze([
 'showroom/globe/h-earth/index.html',
 'showroom/globe/h-earth/vegetation-prototype/route.js',
 'showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js',
 'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',
 'showroom/globe/h-earth/render/live-render-package.run8e-r2.js',
 'showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js',
 'showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js',
 'showroom/globe/h-earth/render/geometry-distant-context.js',
 'showroom/globe/h-earth/render/terrain-seam-normal.v1.js',
 'showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js',
 'h-earth-3d/terrain/h-earth.terrain-field.js'
]);
function assertCodeContracts(){
 const renderer=fs.readFileSync(file(sourcePaths[3]),'utf8');
 const geo=fs.readFileSync(file(sourcePaths[9]),'utf8');
 const near=fs.readFileSync(file(sourcePaths[6]),'utf8');
 const distant=fs.readFileSync(file(sourcePaths[7]),'utf8');
 const seam=fs.readFileSync(file(sourcePaths[8]),'utf8');
 const route=fs.readFileSync(file(sourcePaths[1]),'utf8');
 if(sha(renderer)!==PUBLISHED_RENDERER_SHA)throw Error('EXACT_PUBLISHED_GEN2928_SHADER_DRIFT');
 const needles=[
  "bool isExactFarLandSoilPrimitive=",
  "if(int(vPrimitiveIndex)==uGlobalCoverFarPrimitiveIndex){",
  "vec3 grass=mix(vec3(0.23,0.185,0.105)",
  "base=mix(base,grass,gentle*(0.22+0.30*cover));",
  "bool worldSoilTerrain=geologicalEarthRock||vRoleCode==1u||",
  "if(!geologicalEarthRock){",
  "if(vRoleCode==1u && uClipBaseTerrain==1 &&",
  "float groundcoverWeight=0.88*groundcoverPatch*"
 ];
 for(const needle of needles)if(!renderer.includes(needle))throw Error('PUBLISHED_SHADER_BRANCH_MISSING:'+needle);
 if(!near.includes('xMinimum:-384,xMaximum:384,zMinimum:-736,zMaximum:128'))throw Error('NEAR_WORLD_FOOTPRINT_CHANGED');
 if(!distant.includes('const box=hasNear?{minX:xs[0]'))throw Error('FAR_NEAR_CLIP_CHANGED');
 if(!seam.includes('output.coastDistances[id]')||!seam.includes('output.contactDistances[id]'))throw Error('SEAM_PRESENTATION_CHANGED');
 if(!geo.includes('const BOUNDS=Object.freeze({xMin:-304,xMax:96,zMin:-568,zMax:-224});'))throw Error('GEOLOGY_L_SHAPE_BOUNDS_DRIFT');
 if(!geo.includes("const channels=[['normals',3],['baseColorsLinear',4],['materialParameters',4],['coastDistances',1],['contactDistances',1]];"))throw Error('GEOLOGY_RIM_CHANNELS_DRIFT');
 if(!geo.includes('if(edge>=12)continue;'))throw Error('GEOLOGY_EDGE_FADE_DRIFT');
 return {rendererSha256:sha(renderer),sourcePaths:Object.fromEntries(sourcePaths.map(p=>[p,sha(fs.readFileSync(file(p)))])),
  nearFootprint:{xMin:-384,xMax:384,zMin:-736,zMax:128},
  replacementLShape:[{xMin:-120,xMax:96,zMin:-440,zMax:-224},{xMin:-304,xMax:96,zMin:-568,zMax:-440}],
  geologyRimReconciledChannels:['normals','baseColorsLinear','materialParameters','coastDistances','contactDistances'],
  nearFarReconciledChannels:['normals','coastDistances','contactDistances'],
  farOnlyShaderTint:true,
  baseTerrainMaterialRolePathDiffers:true,
  originalPublishedPublicRouteHasRefinementCall:route.includes('activateInitialRefinement(')};
}
function edgeList(indices,span){
 const edges=new Map();
 for(let k=span.indexStart;k<span.indexStart+span.indexCount;k+=3){
  const v=[indices[k],indices[k+1],indices[k+2]];
  for(let i=0;i<3;i++){
   const a=v[i],b=v[(i+1)%3],key=a<b?a+':'+b:b+':'+a;
   const old=edges.get(key);if(old)old.count++;else edges.set(key,{a,b,count:1});
  }
 }
 return [...edges.values()].filter(e=>e.count===1);
}
function point(arr,i){return [arr[i*3],arr[i*3+1],arr[i*3+2]];}
function nearestEdge(p,edges,positions){
 let best={residual:Infinity};
 for(const e of edges){
  const a=point(positions,e.a),b=point(positions,e.b),delta=b.map((v,i)=>v-a[i]);
  const length=delta.reduce((sum,v)=>sum+v*v,0);if(!length)continue;
  const t=Math.max(0,Math.min(1,p.reduce((sum,v,i)=>sum+(v-a[i])*delta[i],0)/length));
  const residual=Math.hypot(...p.map((v,i)=>v-a[i]-t*delta[i]));
  if(residual<best.residual)best={a:e.a,b:e.b,t,residual};
 }
 return best;
}
function projectedXZ(p){
 const h=Math.hypot(p[0],p[2]),theta=Math.atan2(h,p[1]+420000),q=h>1e-10?theta*420000/h:0;
 return {x:Number((p[0]*q).toFixed(4)),z:Number((p[2]*q).toFixed(4))};
}
function interp(a,i,j,t,stride){return Array.from({length:stride},(_,c)=>a[i*stride+c]*(1-t)+a[j*stride+c]*t);}
function delta(a,b){return Math.hypot(...a.map((v,i)=>v-b[i]));}
function seamProvenance(pkg,views){
 const spans=pkg.primitiveSpans;const near=spans.find(s=>s.primitiveId===NEAR),far=spans.find(s=>s.primitiveId===FAR);
 if(!near||!far)throw Error('SEAM_SPAN_NOT_FOUND');
 const nearEdges=edgeList(views.indices,near),farEdges=edgeList(views.indices,far),matches=[];
 const positions=views.positions;
 for(const v of new Set(farEdges.flatMap(e=>[e.a,e.b]))){
  const p=point(positions,v),edge=nearestEdge(p,nearEdges,positions);
  const eps=Math.max(1e-6,2*Math.max(...p.map(Math.abs))*2**-23);
  if(edge.residual>eps)continue;
  const nearColor=interp(views.baseColorsLinear,edge.a,edge.b,edge.t,4).slice(0,3);
  const farColor=Array.from(views.baseColorsLinear.slice(v*4,v*4+3));
  const nearParam=interp(views.materialParameters,edge.a,edge.b,edge.t,4);
  const farParam=Array.from(views.materialParameters.slice(v*4,v*4+4));
  const nearN=interp(views.normals,edge.a,edge.b,edge.t,3);
  const farN=point(views.normals,v);
  matches.push({source:projectedXZ(p),residual:edge.residual,roleNear:views.roleCodes[edge.a],roleFar:views.roleCodes[v],
   materialModelNear:views.materialModelCodes[edge.a],materialModelFar:views.materialModelCodes[v],
   surfaceClassNear:views.surfaceClassCodes[edge.a],surfaceClassFar:views.surfaceClassCodes[v],
   baseRgbLinearNear:nearColor,baseRgbLinearFar:farColor,baseLinearRgbDifference:delta(nearColor,farColor),
   materialParamDifference:delta(nearParam,farParam),
   nearNormal:nearN,farNormal:farN,nearNormalsDotFarFlipped:(nearN.reduce((sum,v,j)=>sum-v*farN[j],0)/(Math.hypot(...nearN)*Math.hypot(...farN)))});
 }
 if(matches.length<300)throw Error('SEAM_MATCHES_UNEXPECTEDLY_SPARSE:'+matches.length);
 const mean=x=>x.reduce((a,b)=>a+b,0)/x.length;
 const ranked=[...matches].sort((a,b)=>b.baseLinearRgbDifference-a.baseLinearRgbDifference);
 const group=Object.groupBy(matches,m=>m.source.x<=-383.99?'west':m.source.x>=383.99?'east':m.source.z<=-735.99?'south':m.source.z>=127.99?'north':'other');
 const summary=Object.fromEntries(Object.entries(group).map(([k,v])=>[k,{count:v.length,meanBaseLinearRgbDifference:mean(v.map(m=>m.baseLinearRgbDifference)),maxBaseLinearRgbDifference:Math.max(...v.map(m=>m.baseLinearRgbDifference)),meanMaterialParamDifference:mean(v.map(m=>m.materialParamDifference))}]));
 return {nearId:near.primitiveId,farId:far.primitiveId,nearRole:near.role,farRole:far.role,nearVertexCount:near.vertexCount,farVertexCount:far.vertexCount,
  nearBoundaryEdges:nearEdges.length,farBoundaryEdges:farEdges.length,matches:matches.length,
  roleCodePairs:[...new Set(matches.map(m=>m.roleNear+':'+m.roleFar))],
  surfaceCodePairs:[...new Set(matches.map(m=>m.surfaceClassNear+':'+m.surfaceClassFar))],
  materialCodePairs:[...new Set(matches.map(m=>m.materialModelNear+':'+m.materialModelFar))],
  baseColorDifference:{mean:mean(matches.map(m=>m.baseLinearRgbDifference)),max:ranked[0].baseLinearRgbDifference,nonzeroMoreThanPoint05:matches.filter(m=>m.baseLinearRgbDifference>.05).length},
  parameterDifference:{mean:mean(matches.map(m=>m.materialParamDifference)),max:Math.max(...matches.map(m=>m.materialParamDifference))},
  boundaryGroup:summary,
  highestRawBaseDifferences:ranked.slice(0,24).map(({source,baseLinearRgbDifference,materialParamDifference,roleNear,roleFar,surfaceClassNear,surfaceClassFar})=>({source,baseLinearRgbDifference,materialParamDifference,roleNear,roleFar,surfaceClassNear,surfaceClassFar})),
  directInterpretation:'Same geometric position, two different per-vertex input material/role paths. Reconciled normals, coast and contact alone do not establish source albedo continuity. Not final lit RGB; compare same-source GPU for perceptual defect.'};
}
function runtimeImportGraph(){
 const start='showroom/globe/h-earth/vegetation-prototype/route.js';
 const seen=new Set(),missing=[],edges=[],queue=[start];
 const rx=/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)['"]([^'"]+)['"]|new\s+URL\(\s*['"]([^'"]+)['"]\s*,\s*import\.meta\.url\s*\)/g;
 while(queue.length&&seen.size<1000){
  const p=queue.shift();if(seen.has(p))continue;seen.add(p);
  const pathname=file(p);if(!fs.existsSync(pathname)){missing.push(p);continue;}
  if(!/\.(?:js|mjs|html|json)$/.test(p))continue;
  const content=fs.readFileSync(pathname,'utf8');let m;
  while((m=rx.exec(content))){
   const spec=(m[1]||m[2]).split(/[?#]/)[0];
   if(!spec.startsWith('.')&&!spec.startsWith('/'))continue;
   const target=path.posix.normalize(spec.startsWith('/')?spec.slice(1):path.posix.join(path.posix.dirname(p),spec));
   if(target.startsWith('..'))continue;
   edges.push({from:p,to:target});
   if(fs.existsSync(file(target))&&!seen.has(target))queue.push(target);
  }
 }
 const scoped=Array.from(seen).filter(p=>p.startsWith('showroom/globe/h-earth/')||p.startsWith('h-earth-3d/'));
 return {entry:start,visitedModules:seen.size,HearthScopedModules:scoped.length,importEdges:edges.length,
  unresolvedImports:missing,tooMany:queue.length>0,
  importantPresent:sourcePaths.filter(p=>seen.has(p)),importantAbsent:sourcePaths.filter(p=>!seen.has(p)),
  provenanceStatus:'STATIC_IMPORT_EDGE_GRAPH_NOT_RUNTIME_IMPORTMAP_OR_DYNAMIC_EXPRESSION_PROOF'};
}
export function run(){
 const contracts=assertCodeContracts();
 const compressed=fs.readFileSync(file('showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz'));
 if(sha(compressed)!==SOURCE_SHA)throw Error('FROZEN_PRECOMPUTED_WORLD_HASH_MISMATCH');
 const record=JSON.parse(zlib.gunzipSync(compressed).toString('utf8'));
 const freeze=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){for(const item of Object.values(value))freeze(item);Object.freeze(value);}return value;};
 const pkg=freeze(record.canonical);if(!pkg?.primitiveSpans?.length)throw Error('CANONICAL_PACKAGE_ABSENT');
 const views=createHEarthRun8ER2DCanonicalGPUUploadViews(pkg,{enableWoodlandClearing:true});
 const seam=seamProvenance(pkg,views),graph=runtimeImportGraph();
 return {schema:'H_EARTH_GEN2935_SOURCE_PROVENANCE_NEAR_FAR_AND_GEOLOGY_v1',
  result:'ACTUAL_SOURCE_PRIMITIVE_MATERIAL_DISAGREEMENT_MEASURED',
  publishedHead:'cb57c275b95d0d48883bc4da4dcfcf17cbec5060',
  sourceAssetSha256:sha(compressed),
  rootReadOnly:true,productMutation:false,merged:false,published:false,
  contracts,seam,graph,materialCausality:'SOURCE_PRE_SOIL_INPUT_ONLY_NO_VISUAL_SEAM_PROOF',
  next:'First check a same-camera pixel transect on the source-defined near/far seam by intercepting only debug shader and retaining grass controls. Correct material sources only after actual lit RGB first-cause proof.'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2);if(args.length!==2||args[0]!=='--output')throw Error('OUTPUT_ARGUMENT_REQUIRED');
 const result=run(),target=path.resolve(args[1]);fs.mkdirSync(path.dirname(target),{recursive:true});
 fs.writeFileSync(target,JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({result:result.result,pairs:result.seam.matches,mean:result.seam.baseColorDifference.mean,max:result.seam.baseColorDifference.max,output:target}));
}

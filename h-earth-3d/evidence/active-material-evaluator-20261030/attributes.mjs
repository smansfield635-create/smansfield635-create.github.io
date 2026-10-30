import fs from 'node:fs';import path from 'node:path';import {pathToFileURL,fileURLToPath} from 'node:url';
import {sha,verifyBytes} from './evaluate.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const rendererPath='showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export function slices(renderer,manifest){
 const c0=renderer.indexOf('function* createExposedWaterContactFieldSteps('),c1=renderer.indexOf('\n\n\nasync function yieldToBrowserPaint',c0);
 const anchor=renderer.indexOf('for(const {role,part:treePart'),s0=renderer.indexOf('      const normals=new Float32Array(n*3);',anchor),s1=renderer.indexOf('\n      partTiming.rimReconciliationMilliseconds',s0);
 if([c0,c1,anchor,s0,s1].some(i=>i<0))throw Error('RENDERER_SLICE_BOUNDARY');
 const contactGenerator=renderer.slice(c0,c1),soilAttributes=renderer.slice(s0,s1);
 for(const [name,s] of Object.entries({contactGenerator,soilAttributes}))verifyBytes(Buffer.from(s),manifest.rendererSlices[name],name);
 return {contactGenerator,soilAttributes};
}
export function compileSlices(source){
 const contactFactory=new Function(source.contactGenerator+'\nreturn createExposedWaterContactFieldSteps;')();
 const build=new Function('model','role','mesh','uploadViews','coastDistances','contactField','unprojectPlanetVertex','sampleGeologicalMaterialExposure','reconcileGeologicalTerrainRim',
 'const n=mesh.vertexCount,positions=mesh.positions,indices=mesh.indices,partTiming={},meshStarted=performance.now();\n'+source.soilAttributes+'\nreturn renderedAttributes;');
 return {contact(views,spans){const it=contactFactory(views,spans,null);let step;do{step=it.next();}while(!step.done);return step.value;},soil(...args){if(!['ERODED_TERRAIN','MOUNTAIN_OVERBURDEN'].includes(args[1]))throw Error('SOIL_ROLE_REQUIRED');return build(...args);}};
}
export function summarize(a){let min=Infinity,max=-Infinity;for(const v of a){if(!Number.isFinite(v))throw Error('NONFINITE_ATTRIBUTE');min=Math.min(min,v);max=Math.max(max,v);}return {type:a.constructor.name,length:a.length,min,max,sha256:sha(Buffer.from(a.buffer,a.byteOffset,a.byteLength))};}
function changes(before,after,size){let vertices=0,maxAbsoluteDelta=0;for(let i=0;i<after.length;i+=size){let changed=false;for(let j=0;j<size;j++){const d=Math.abs(before[i+j]-after[i+j]);if(d)changed=true;maxAbsoluteDelta=Math.max(maxAbsoluteDelta,d);}if(changed)vertices++;}return {vertices,maxAbsoluteDelta};}
export async function reconstruct(sourceDir,meshDir,receiptFile,outDir){
 const old=JSON.parse(fs.readFileSync(path.join(here,'source-manifest.json'))),manifest=JSON.parse(fs.readFileSync(path.join(here,'attribute-manifest.json')));
 for(const [p,h] of Object.entries({...old.moduleHashes,...manifest.moduleHashes}))verifyBytes(fs.readFileSync(path.join(sourceDir,p)),h,p);
 const renderer=verifyBytes(fs.readFileSync(path.join(sourceDir,rendererPath)),old.rendererSha256,'renderer').toString();const native=compileSlices(slices(renderer,manifest));
 for(const [p,h] of Object.entries(old.meshHashes))verifyBytes(fs.readFileSync(path.join(meshDir,p)),h,p);
 const receipt=JSON.parse(verifyBytes(fs.readFileSync(receiptFile),old.captureReceiptSha256,'baseline capture'));
 if(receipt.views.some(v=>v.resources.refinementResourceCreated!==false))throw Error('CAPTURE_REFINEMENT_UNSUPPORTED');
 const importSource=p=>import(pathToFileURL(path.join(sourceDir,p)));
 const uploadModule=await importSource('showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js'),seamModule=await importSource('showroom/globe/h-earth/render/terrain-seam-normal.v1.js');
 const bridge=await importSource('showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js'),geo=await importSource('h-earth-3d/terrain/h-earth.geological-formation-successor.v1.mjs');
 const canonical=freeze(JSON.parse(fs.readFileSync(path.join(meshDir,'package.json'))));
 const raw=uploadModule.createHEarthRun8ER2DCanonicalGPUUploadViews(canonical,{enableWoodlandClearing:true});
 verifyBytes(Buffer.from(raw.positions.buffer),old.meshHashes['upload-positions.bin'],'reconstructed upload positions');verifyBytes(Buffer.from(raw.indices.buffer),old.meshHashes['upload-indices.bin'],'reconstructed upload indices');
 const coast=new Float32Array(raw.positions.length/3);
 for(const span of canonical.primitiveSpans){if(span.role!=='TERRAIN'&&span.primitiveId!=='H_EARTH_WORLD_MANIFOLD:FAR_LAND_CONTINUATION')continue;
  for(let i=span.vertexStart;i<span.vertexStart+span.vertexCount;i++){const x=raw.positions[i*3],y=raw.positions[i*3+1],z=raw.positions[i*3+2],h=Math.hypot(x,z),scale=h>Number.EPSILON?Math.atan2(h,y+420000)*420000/h:0;coast[i]=uploadModule.getHEarthSignedCoastDistanceMeters(x*scale,z*scale);}}
 const contact=native.contact(raw,canonical.primitiveSpans),stableStats={...contact.stats};delete stableStats.initializationMilliseconds;
 for(const [k,v] of Object.entries(stableStats)){const expected=receipt.views[0].resources.contactField[k];if(typeof v==='number'?Math.abs(v-expected)>1e-10:v!==expected)throw Error('CAPTURE_CONTACT_STAT:'+k);}
 const seam=seamModule.createTerrainSeamPresentation({...raw,coastDistances:coast,contactDistances:contact.packageDistances,primitiveSpans:canonical.primitiveSpans});
 if(JSON.stringify(seam.receipt)!==JSON.stringify(receipt.views[0].resources.terrainSeamPresentation))throw Error('CAPTURE_SEAM_RECEIPT');
 verifyBytes(Buffer.from(seam.normals.buffer),'7d31e73c97939ad978982aeb5191d3ae8b99582eb32300aff9d569cae7e24b1b','seam normals');verifyBytes(Buffer.from(seam.coastDistances.buffer),'7f99de4403127ddcc48affe5206003c93049e0d19d276981db794ea1fa8cf49b','seam coast');
 fs.mkdirSync(outDir,{recursive:true});const states={};
 function emit(name,attrs){const r={};for(const [key,a] of Object.entries(attrs)){const file=name+'.'+key+'.bin';fs.writeFileSync(path.join(outDir,file),Buffer.from(a.buffer,a.byteOffset,a.byteLength));r[key]={file,...summarize(a)};}states[name]=r;}
 const fields=['positions','indices','normals','baseColorsLinear','materialParameters','materialModelCodes','surfaceClassCodes','primitiveIndices','roleCodes'];const rawAttrs=Object.fromEntries(fields.map(k=>[k,raw[k]]));rawAttrs.coastDistances=coast;rawAttrs.contactDistances=contact.packageDistances;
 emit('raw-upload',rawAttrs);emit('base-gpu', {...rawAttrs,normals:seam.normals,coastDistances:seam.coastDistances,contactDistances:seam.contactDistances});
 const sourceHashes=Object.fromEntries(Object.entries(rawAttrs).map(([k,a])=>[k,summarize(a).sha256]));
 const model=bridge.constructGeologicalRuntimeBridge(canonical),rimChanges={},gpuCoastChanges={};
 if(model.retirement.triangleCount!==3058||model.meshes.length!==6)throw Error('GEOMETRY_CENSUS');
 for(const {role,mesh} of model.meshes.filter(p=>['ERODED_TERRAIN','MOUNTAIN_OVERBURDEN'].includes(p.role))){
   let before;const channels={normals:3,baseColorsLinear:4,materialParameters:4,coastDistances:1,contactDistances:1};
   const observeRim=(...args)=>{before=Object.fromEntries(Object.keys(channels).map(k=>[k,new Float32Array(args[3][k])]));bridge.reconcileGeologicalTerrainRim(...args);};
   const attrs=native.soil(model,role,mesh,raw,coast,contact,geo.unprojectPlanetVertex,bridge.sampleGeologicalMaterialExposure,observeRim);
   // Original renderer reads contactField.packageDistances, supplied unchanged above.
   const gpuCoast=seamModule.createGeologicalCoastPresentation(model,role,mesh,{roleCodes:raw.roleCodes,coastDistances:coast},attrs.coastDistances);
   const n=mesh.vertexCount,models=new Uint8Array(n),surfaces=new Uint8Array(n).fill(255),ids=new Uint16Array(n).fill(62000),roles=new Uint8Array(n).fill(1);
   const full={...attrs,materialModelCodes:models,surfaceClassCodes:surfaces,primitiveIndices:ids,roleCodes:roles};
   emit(role+'-support',full);emit(role+'-gpu',{...full,coastDistances:gpuCoast});
   rimChanges[role]=Object.fromEntries(Object.entries(channels).map(([key,size])=>[key,changes(before[key],attrs[key],size)]));gpuCoastChanges[role]=changes(attrs.coastDistances,gpuCoast,1);
 }
 for(const [k,a] of Object.entries(rawAttrs))if(summarize(a).sha256!==sourceHashes[k])throw Error('SOURCE_ARRAY_MUTATED:'+k);
 const report={schema:'H_EARTH_SOURCE_ATTRIBUTE_RECONSTRUCTION_v1',sourceHead:old.sourceHead,priorGeometryCommit:'854aed7bf1a59070a897aafad78acdba454c6b4f',rendererSha256:old.rendererSha256,rendererSlices:manifest.rendererSlices,result:'SOURCE_ATTRIBUTE_RECONSTRUCTION_PASS',contactStats:stableStats,seamReceipt:seam.receipt,states,rimChanges,gpuCoastChanges,rawSourceArraysUnchanged:true,
 limits:['Replays exact source arithmetic; not GPU hardware readback or complete shader equivalence.','Contact uses original unretired TERRAIN and open ocean with null refinement, exactly as captured; it is not a rebuilt active/freshwater contact field.','Generated initial coast/contact=140 is native behavior, not a substituted placeholder.','Base fields describe original indexed vertices before corrected atlas vertex duplication; duplicated attributes inherit these values, but corrected UV/atlas lookup is not reconstructed here.','Generated soil only; rock/water/vegetation material attributes not evaluated.','Full material coefficients remain unresolved: resident texture values, source derivatives and downstream composition still required.']};
 fs.writeFileSync(path.join(outDir,'attributes.json'),JSON.stringify(report,null,2)+'\n');return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const [source,mesh,receipt,out]=process.argv.slice(2);if(!out)throw Error('USAGE: attributes.mjs SOURCE MESH RECEIPT OUTPUT');const r=await reconstruct(...[source,mesh,receipt,out].map(p=>path.resolve(p)));console.log(JSON.stringify({result:r.result,contact:r.contactStats,rimChanges:r.rimChanges,gpuCoastChanges:r.gpuCoastChanges}));
}

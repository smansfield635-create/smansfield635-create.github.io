import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {pathToFileURL,fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export function verifyBytes(bytes,expected,label){if(sha(bytes)!==expected)throw Error('SOURCE_HASH_MISMATCH:'+label);return bytes;}
export function identity(){return {A:[1,1,1],B:[0,0,0]};}
export function compose(q,gain,bias){
 if(![q.A,q.B,gain,bias].every(a=>Array.isArray(a)&&a.length===3&&a.every(Number.isFinite)))throw Error('AFFINE_INPUT_INVALID');
 return {A:q.A.map((v,c)=>v*gain[c]),B:q.B.map((v,c)=>v*gain[c]+bias[c])};
}
export const apply=(q,P)=>q.A.map((a,c)=>a*P[c]+q.B[c]);
export function mixStage(q,target,weight){if(!Number.isFinite(weight)||weight<0||weight>1)throw Error('MASK_INVALID');return compose(q,[1-weight,1-weight,1-weight],target.map(v=>v*weight));}
export function siteBStage(q,earthVariation,exposure){
 if(![earthVariation,exposure].every(v=>Number.isFinite(v)&&v>=0&&v<=1))throw Error('SITE_B_OPERAND_INVALID');
 const t=exposure*.38,lo=[.93,.91,.88],hi=[1.04,1.02,.98];
 return compose(q,lo.map((v,c)=>1-t+t*(v+(hi[c]-v)*earthVariation)),[0,0,0]);
}
// Each operand must already be derived from the frozen shader and resident fields.
// This algebra evaluator never substitutes missing coverage with zero.
export function evaluateStages(stages,required){
 if(new Set(stages.map(s=>s.id)).size!==stages.length)throw Error('DUPLICATE_STAGE');
 if(stages.some(s=>!required.includes(s.id)))throw Error('UNDECLARED_STAGE');
 if(stages.some((s,i)=>i>0&&required.indexOf(stages[i-1].id)>required.indexOf(s.id)))throw Error('STAGE_ORDER');
 const missing=required.filter(id=>!stages.some(s=>s.id===id&&s.resolved===true));
 if(missing.length)return {status:'UNRESOLVED',missing,coefficients:null};
 let q=identity();for(const s of stages){if(!s.resolved)throw Error('UNRESOLVED_STAGE:'+s.id);q=compose(q,s.gain,s.bias);}return {status:'SUPPORTED_OPERANDS',coefficients:q};
}
export function roleClass(role){
 if(['ERODED_TERRAIN','MOUNTAIN_OVERBURDEN'].includes(role))return {primitive:62000,roleCode:1,correctionHook:true};
 if(['NATURAL_CLIFF_FACE','CAVERN_PHYSICAL_SHELL'].includes(role))return {primitive:62001,roleCode:role==='NATURAL_CLIFF_FACE'?1:5,correctionHook:false};
 if(['FRESHWATER_RIVER','OASIS_WATER'].includes(role))return {primitive:62000,roleCode:4,correctionHook:false};
 throw Error('UNCLASSIFIED_GENERATED_ROLE:'+role);
}
export async function evaluate(sourceDir,meshDir,receiptPath,outDir){
 const manifest=JSON.parse(fs.readFileSync(path.join(here,'source-manifest.json')));
 verifyBytes(fs.readFileSync(path.join(sourceDir,'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js')),manifest.rendererSha256,'renderer');
 for(const [p,h] of Object.entries(manifest.moduleHashes))verifyBytes(fs.readFileSync(path.join(sourceDir,p)),h,p);
 for(const [p,h] of Object.entries(manifest.meshHashes))verifyBytes(fs.readFileSync(path.join(meshDir,p)),h,p);
 const receipt=JSON.parse(verifyBytes(fs.readFileSync(receiptPath),manifest.captureReceiptSha256,'capture receipt'));
 const canonical=JSON.parse(fs.readFileSync(path.join(meshDir,'package.json')));
 const bridge=await import(pathToFileURL(path.join(sourceDir,'showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js')));
 const geo=await import(pathToFileURL(path.join(sourceDir,'h-earth-3d/terrain/h-earth.geological-formation-successor.v1.mjs')));
 const readTyped=(p,T)=>{const b=fs.readFileSync(path.join(meshDir,p));return new T(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength));};
 const upload=readTyped('upload-positions.bin',Float32Array),indices=readTyped('upload-indices.bin',Uint32Array);
 const model=bridge.constructGeologicalRuntimeBridge(canonical),retired=bridge.retireGeologicalBaseIndices(indices,model.retirement);
 const expected=receipt.views[0].resources.geologicalFormation;
 if(model.retirement.triangleCount!==expected.originalBaseTrianglesRetired||model.meshes.length!==expected.attachedMeshCount)throw Error('CAPTURE_GEOLOGY_CENSUS_MISMATCH');
 const offsets=new Set(model.retirement.triangleOffsets);
 for(let i=0;i<indices.length;i+=3){if(offsets.has(i)){if(retired[i]!==retired[i+1]||retired[i]!==retired[i+2])throw Error('RETIREMENT_NOT_DEGENERATE');}else for(let j=0;j<3;j++)if(indices[i+j]!==retired[i+j])throw Error('UNRETIRED_INDEX_CHANGED');}
 fs.mkdirSync(outDir,{recursive:true});
 const surfaces=[];let maxRoundTrip=0;
 function emit(name,positions,idx,classification){
   const local=new Float64Array(positions.length);
   for(let i=0;i<positions.length;i+=3){const p=geo.unprojectPlanetVertex(positions[i],positions[i+1],positions[i+2]);local.set([p.x,p.y,p.z],i);const q=geo.projectRegionVertex(p.x,p.y,p.z);maxRoundTrip=Math.max(maxRoundTrip,Math.abs(q.x-positions[i]),Math.abs(q.y-positions[i+1]),Math.abs(q.z-positions[i+2]));}
   const files={};for(const [kind,a] of Object.entries({local,upload:positions,indices:idx})){const file=name+'.'+kind+'.bin';const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength);fs.writeFileSync(path.join(outDir,file),b);files[kind]={file,sha256:sha(b),type:a.constructor.name};}
   surfaces.push({name,...classification,vertices:positions.length/3,triangles:idx.length/3,files});
 }
 for(const span of canonical.primitiveSpans){if(span.role==='TERRAIN'||span.primitiveId.endsWith('FAR_LAND_CONTINUATION')){
  const active=[];for(let i=span.indexStart;i<span.indexStart+span.indexCount;i+=3)if(retired[i]!==retired[i+1]&&retired[i]!==retired[i+2]&&retired[i+1]!==retired[i+2])active.push(...retired.subarray(i,i+3));
  emit(span.role==='TERRAIN'?'original-near':'original-far',upload,new Uint32Array(active),{role:span.role,roleCode:span.role==='TERRAIN'?1:canonical.buffers.roleCodes[indices[span.indexStart]],correctionHook:true,originalTriangles:span.triangleCount});
 }}
 for(const p of model.meshes)emit(p.role,p.mesh.positions,p.mesh.indices,{role:p.role,...roleClass(p.role)});
 if(maxRoundTrip>1e-6)throw Error('COORDINATE_ROUNDTRIP');
 const report={schema:'H_EARTH_ACTIVE_MATERIAL_EVALUATION_v1',sourceHead:manifest.sourceHead,scope:'SOURCE_GEOMETRY_AND_AFFINE_OPERANDS_NOT_FINAL_RENDERED_MATERIAL',retiredTriangles:offsets.size,generatedMeshes:model.meshes.length,maxCoordinateRoundTripError:maxRoundTrip,surfaces,retirementOffsetsSha256:sha(Buffer.from(model.retirement.triangleOffsets.buffer)),refinementCaptured:receipt.views[0].resources.refinementResourceCreated,
  materialStatus:evaluateStages([],['ecological-source-attributes','corrected-atlas','margin','manor','site-b','bank-sand','shoreline-root-texture','woodland-litter','habitat','bank-gravel']),
  limits:['Native unprojected vertex interpolation matches CPU authoring surface convention, not inverse projection of every GPU interpolated point.','Generated mesh positions match construction; renderer rim attributes, micro normals and later material fields remain unresolved.','Water/rock are retained as separate candidate layers, never silently chosen as terrain.','Dynamic refinement, nonterrain props, depth visibility, full material values and lighting are not reconstructed.','Captured refinement absence does not generalize to other camera states.']};
 fs.writeFileSync(path.join(outDir,'geometry.json'),JSON.stringify(report,null,2)+'\n');return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const [source,mesh,receipt,out]=process.argv.slice(2);if(!out)throw Error('USAGE: evaluate.mjs SOURCE_DIR MESH_DIR BASELINE_RECEIPT OUTPUT_DIR');
 const r=await evaluate(path.resolve(source),path.resolve(mesh),path.resolve(receipt),path.resolve(out));console.log(JSON.stringify({retired:r.retiredTriangles,meshes:r.generatedMeshes,surfaces:r.surfaces.map(s=>({name:s.name,triangles:s.triangles})),roundTrip:r.maxCoordinateRoundTripError}));
}

import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {pathToFileURL} from 'node:url';import {gunzipSync} from 'node:zlib';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';
import {applyHEarthVerifiedPlantingPackage} from '../showroom/globe/h-earth/render/live-render-package.run8e-r2.js';
import {unprojectPlanetVertex} from '../h-earth-3d/terrain/h-earth.geological-formation-successor.v1.mjs';
import {buildCavernPalmPlacement} from '../showroom/globe/h-earth/render/cavern-palm-placement.v1.js';
import {buildCavernEntranceIvy} from '../showroom/globe/h-earth/render/cavern-entrance-ivy.v1.js';
import {buildCavernUnderstoryPlacement} from '../showroom/globe/h-earth/render/cavern-understory-placement.v1.js';
import {buildOasisTreeGroup} from '../showroom/globe/h-earth/render/geometry-oasis-tree-group.v1.js';
const root=path.resolve(import.meta.dirname,'..'),relative='showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js';
const baselineHead='c0b25850ef567327f45eed020659d58e06066b36';
let old=execFileSync('git',['show',baselineHead+':'+relative],{cwd:root,encoding:'utf8'});
old=old.replace(/from\s*(['"])(\.[^'"]+)\1/g,(_,q,p)=>'from '+JSON.stringify(pathToFileURL(path.resolve(root,path.dirname(relative),p)).href));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'gratitude-profile-'));fs.writeFileSync(path.join(tmp,'baseline.mjs'),old);
const baseline=await import(pathToFileURL(path.join(tmp,'baseline.mjs'))),candidate=await import(pathToFileURL(path.join(root,relative)));
const packed=fs.readFileSync(path.join(root,'showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz'));
if(createHash('sha256').update(packed).digest('hex')!=='48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a')throw Error('PROFILE_SOURCE_DIGEST');
const v=JSON.parse(gunzipSync(packed));const canonical=applyHEarthVerifiedPlantingPackage(v.raw,{canonicalBase:v.canonical});
function hash(value){return createHash('sha256').update(JSON.stringify(value,(_,v)=>ArrayBuffer.isView(v)?Array.from(v):v)).digest('hex');}
function run(label,mod){const phases={},outputs={};const measure=(name,fn)=>{const t=performance.now(),v=fn();phases[name]=performance.now()-t;return v;};
 const model=measure('geologicalConstruction',()=>mod.constructGeologicalRuntimeBridge(canonical));outputs.geological=hash({meshes:model.meshes,retirement:model.retirement,route:model.route});
 for(const [name,fn] of Object.entries({palms:buildCavernPalmPlacement,ivy:buildCavernEntranceIvy,understory:buildCavernUnderstoryPlacement,oasis:buildOasisTreeGroup})){const result=measure(name,()=>fn(model,canonical));outputs[name]=hash(result);}
 const samples=[];measure('actualMeshColorAndExposure',()=>{for(const {role,mesh} of model.meshes)for(let i=0;i<mesh.vertexCount;i++){const p=unprojectPlanetVertex(...mesh.positions.subarray(i*3,i*3+3));samples.push([role,model.originalTerrainColorAt(p.x,p.z),['FRESHWATER_RIVER','OASIS_WATER'].includes(role)?null:mod.sampleGeologicalMaterialExposure(model,role,p.x,p.z)]);}});outputs.materialSamples=hash(samples);
 const result={label,phases,totalMilliseconds:Object.values(phases).reduce((a,b)=>a+b,0),outputs};console.error(JSON.stringify({label,phases,totalMilliseconds:result.totalMilliseconds}));return result;}
try{const before=run('baseline',baseline),after=run('candidate',candidate);if(JSON.stringify(before.outputs)!==JSON.stringify(after.outputs))throw Error('ACTUAL_SCENE_OUTPUT_DRIFT');console.log(JSON.stringify({schema:'GRATITUDE_ACTUAL_SCENE_CPU_COMPARISON_v1',baselineHead,scope:'ACTUAL_ACCEPTED_GEOMETRY_BUILDERS_AND_ALL_GEOLOGICAL_VERTEX_MATERIAL_SAMPLES; NO_GPU_OR_TABLET_CLAIM',exactOutputsMatch:true,before,after,speedup:before.totalMilliseconds/after.totalMilliseconds},null,2));}finally{fs.rmSync(tmp,{recursive:true,force:true});}

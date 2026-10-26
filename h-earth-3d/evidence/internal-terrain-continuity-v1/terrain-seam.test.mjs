import test from 'node:test';import assert from 'node:assert/strict';import crypto from 'node:crypto';
import {createGeologicalCoastPresentation} from '../../../showroom/globe/h-earth/render/terrain-seam-normal.v1.js';
import fs from 'node:fs';import zlib from 'node:zlib';import{constructGeologicalRuntimeBridge,reconcileGeologicalTerrainRim}from'../../../showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js';import{unprojectPlanetVertex}from'../../../h-earth-3d/terrain/h-earth.geological-formation-successor.v1.mjs';import{getHEarthSignedCoastDistanceMeters}from'../../../showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js';
const pkg=JSON.parse(zlib.gunzipSync(fs.readFileSync('showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz'))).canonical,b=pkg.buffers,model=constructGeologicalRuntimeBridge(pkg),positions=new Float32Array(b.positions),normals=new Float32Array(b.normals.map(x=>Number(x.toFixed(6)))),coast=new Float32Array(positions.length/3);
for(const s of pkg.primitiveSpans.filter(s=>s.role==='TERRAIN'||s.primitiveId.includes('FAR_LAND')))for(let i=s.vertexStart;i<s.vertexStart+s.vertexCount;i++){const[x,y,z]=positions.slice(i*3,i*3+3),h=Math.hypot(x,z),k=h>Number.EPSILON?Math.atan2(h,y+420000)*420000/h:0;coast[i]=getHEarthSignedCoastDistanceMeters(x*k,z*k);}
const renderer=fs.readFileSync('showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js','utf8'),fn=renderer.slice(renderer.indexOf('function* createExposedWaterContactFieldSteps('),renderer.indexOf('\n\nasync function yieldToBrowserPaint')),it=Function(fn+';return createExposedWaterContactFieldSteps;')()({positions,indices:new Uint32Array(b.indices)},pkg.primitiveSpans);let step;do{step=it.next();}while(!step.done);const contacts=step.value.packageDistances;
const source={positions,normals,indices:b.indices,baseColorsLinear:b.baseColorsLinear,materialParameters:b.materialParameters,roleCodes:b.roleCodes,coastDistances:coast,contactDistances:contacts};
const hash=x=>crypto.createHash('sha256').update(Buffer.from(x.buffer,x.byteOffset,x.byteLength)).digest('hex');
const summary=[];
for(const part of model.meshes.filter(p=>['ERODED_TERRAIN','MOUNTAIN_OVERBURDEN'].includes(p.role))){
 const n=part.mesh.vertexCount,attrs={normals:new Float32Array(n*3),baseColorsLinear:new Float32Array(n*4),materialParameters:new Float32Array(n*4),coastDistances:new Float32Array(n).fill(140),contactDistances:new Float32Array(n).fill(140)};
 reconcileGeologicalTerrainRim(model,part.role,part.mesh,attrs,source);
 const before=Object.fromEntries(Object.entries(attrs).map(([k,v])=>[k,hash(v)]));const start=performance.now();
 const out=createGeologicalCoastPresentation(model,part.role,part.mesh,source,attrs.coastDistances);const elapsed=performance.now()-start;
 let maxError=0,changed=0,relevant=0,minChangedCoast=Infinity;
 for(let i=0;i<n;i++){
  const p=unprojectPlanetVertex(...part.mesh.positions.slice(i*3,i*3+3)),q=model.originalTerrainContactAt(p.x,p.z),expected=q.ids.reduce((sum,id,j)=>sum+q.weights[j]*coast[id],0);
  maxError=Math.max(maxError,Math.abs(out[i]-expected));if(Math.abs(out[i]-attrs.coastDistances[i])>.01){changed++;minChangedCoast=Math.min(minChangedCoast,out[i],attrs.coastDistances[i]);if(expected<112)relevant++;}
 }
 test(part.role+' inherits canonical geographic coast without mutating shared data',()=>{assert.ok(maxError<.001);assert.ok(minChangedCoast>28, `beach coast gate unsaturated:${minChangedCoast}`);assert.notEqual(out,attrs.coastDistances);for(const[k,h]of Object.entries(before))assert.equal(hash(attrs[k]),h);assert.equal(out.byteLength,attrs.coastDistances.byteLength);});
 summary.push({role:part.role,vertices:n,changedVertices:changed,responseRelevantVertices:relevant,maxErrorMeters:maxError,minChangedCoast,startupMilliseconds:elapsed,temporaryCopyBytes:out.byteLength});
}
test('non-target roles preserve exact array identity',()=>{const a=new Float32Array([140]);assert.equal(createGeologicalCoastPresentation(null,'CAVERN_PHYSICAL_SHELL',null,null,a),a);});
test('invalid source fails closed',()=>assert.throws(()=>createGeologicalCoastPresentation({originalTerrainContactAt:()=>null},'ERODED_TERRAIN',{vertexCount:1,positions:[0,0,0]},source,new Float32Array(1)),/SOURCE/));
test('presentation is GPU-only and physical provider keeps original coast',()=>{assert.ok(renderer.includes('state.renderedAttributes.coastDistances=coast;'));assert.ok(renderer.includes('put(8,coastPresentation,1);put(9,contact,1);'));});
console.log(JSON.stringify({schema:'INTERNAL_COAST_PRESENTATION_QUALIFICATION_v1',summary,physicalAndroidPerformanceProven:false,visualAcceptance:false}));

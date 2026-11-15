import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeWebGLDevice} from './dgb.native-webgl-device.v1.mjs';
import {createNativeFramePipeline} from './dgb.native-frame-pipeline.v1.mjs';
import {createNativeSpatialScene} from './dgb.native-scene-spatial.v1.mjs';
import {createNativeMaterialLibrary} from './dgb.native-material-light.v1.mjs';
import {createCycleOneNativeBindings} from './dgb.native-asset-render-binding.v1.mjs';
import {makeAsset,restoreAsset,serializeAsset,exportStaticGlb} from './dgb.native-asset-bridge.v1.mjs';
import {sphere,capsule,smoothUnion,subtract,meshField,inspectMesh} from './dgb.native-volume.v1.mjs';
import {seedMeshFromSilhouette,silhouetteField} from './dgb.native-image-seed.v1.mjs';
const names=['sdf-sphere','sdf-branch','sdf-cavity','silhouette-circle-seed'];
const footprint=(w,h,inside)=>({width:w,height:h,mask:Array.from({length:w*h},(_,i)=>inside(i%w,Math.floor(i/w))?1:0)});
const asset=n=>{
 const mesh=n==='sdf-sphere'?meshField(sphere([0,0,0],.5),{resolution:16}):
  n==='sdf-branch'?meshField(smoothUnion(capsule([0,-.6,0],[0,.4,0],.32),capsule([0,0,0],[.65,.6,.15],.22),.22),{resolution:16}):
  n==='sdf-cavity'?meshField(subtract(sphere([0,0,0],.72),sphere([0,0,0],.3)),{resolution:18}):
  n==='silhouette-circle-seed'?seedMeshFromSilhouette(footprint(24,24,(x,y)=>(x-12)**2+(y-12)**2<45),{resolution:18}):null;
 if(!mesh)throw new Error('UNKNOWN_CONTROLLED_FIXTURE');
 return makeAsset({id:n,mesh,material:{baseColor:[.45,.68,.72,1]},source:{kind:n==='silhouette-circle-seed'?'SILHOUETTE_HEURISTIC_PRIOR':'ANALYTIC_SDF'}});
};
function fakeGL(){
 const log={gpuDraws:[],programs:[],meshes:[],enabled:[],uniforms:[]}; let next=0;
 const g={
   VERTEX_SHADER:35633,FRAGMENT_SHADER:35632,COMPILE_STATUS:35713,LINK_STATUS:35714,
   ARRAY_BUFFER:34962,ELEMENT_ARRAY_BUFFER:34963,STATIC_DRAW:35044,UNSIGNED_SHORT:5123,UNSIGNED_BYTE:5121,UNSIGNED_INT:5125,FLOAT:5126,TRIANGLES:4,
   COLOR_BUFFER_BIT:16384,DEPTH_BUFFER_BIT:256,DEPTH_TEST:2929,BLEND:3042,CULL_FACE:2884,CCW:2305,LEQUAL:515,
   TEXTURE0:33984,ACTIVE_TEXTURE:34016,TEXTURE_BINDING_2D:32873,ONE:1,ONE_MINUS_SRC_ALPHA:771,SRC_ALPHA:770,FUNC_ADD:32774,
   FRAMEBUFFER:36160,FRAMEBUFFER_BINDING:36006,MAX_TEXTURE_SIZE:3379,MAX_RENDERBUFFER_SIZE:34024,
   isContextLost:()=>false,getContextAttributes:()=>({depth:true}),
   createShader(type){return {id:++next,type}},shaderSource(shader,src){shader.src=src},compileShader(){},getShaderParameter(){return true},getShaderInfoLog(){return ''},deleteShader(){},
   createProgram(){const p={id:++next};log.programs.push(p);return p},attachShader(){},linkProgram(){},getProgramParameter(){return true},getProgramInfoLog(){return ''},deleteProgram(){},
   createBuffer(){return {id:++next}},bindBuffer(){},bufferData(){},deleteBuffer(){},
   useProgram(){},getAttribLocation(program,name){return ['aPosition','aNormal','aUV'].indexOf(name)},enableVertexAttribArray(x){log.enabled.push(x)},vertexAttribPointer(){},vertexAttribIPointer(){},disableVertexAttribArray(){},
   drawElements(mode,count,indexType,offset){log.gpuDraws.push({kind:'ELEMENTS',mode,count,indexType,offset})},drawArrays(mode,first,count){log.gpuDraws.push({kind:'ARRAYS',mode,count,first})},
   getUniformLocation(program,name){return {name,program}},uniformMatrix4fv(){},uniformMatrix3fv(){},uniform4fv(){},uniform3fv(){},uniform1f(){},uniform1i(){},
   bindFramebuffer(){},viewport(){},colorMask(){},disable(){},enable(){},depthMask(){},depthFunc(){},frontFace(){},cullFace(){},clearColor(){},clearDepth(){},clear(){},blendEquation(){},blendFuncSeparate(){},activeTexture(){},bindTexture(){},
   getParameter(x){if(x===this.MAX_TEXTURE_SIZE||x===this.MAX_RENDERBUFFER_SIZE)return 8192;if(x===this.ACTIVE_TEXTURE)return this.TEXTURE0;return null}
 };
 return {g,log};
}
function setup(){
 const {g,log}=fakeGL(),canvas={width:320,height:320,getContext(kind){assert.equal(kind,'webgl2');return g},addEventListener(){},removeEventListener(){}};
 const device=createNativeWebGLDevice(canvas,{backend:'WEBGL2'}),pipeline=createNativeFramePipeline(device),scene=createNativeSpatialScene(),library=createNativeMaterialLibrary(device);
 const camera=scene.createCamera({position:[0,0,8],projection:'ORTHOGRAPHIC',near:.1,far:80,aspect:1,orthoHeight:10});
 const bridge=createCycleOneNativeBindings({device,scene,materialLibrary:library,pipeline,cameraNode:camera});
 return {device,pipeline,scene,library,camera,bridge,gl:g,log};
}
for(const name of names)test('exact adopted E1 E2 E3 E4 execute draw contract for '+name,()=>{
 const {bridge,device,pipeline,library,log}=setup(),a=asset(name),before=serializeAsset(a);
 const bound=bridge.attach(a,{x:0,z:0,groundSampler:()=>({y:-.5})});assert.equal(bound.assetId,a.id);
 assert.equal(device.status().meshes,1);assert.equal(device.status().programs,1);
 assert.equal(bridge.render().submitted,1);assert.equal(pipeline.status().completedFrames,1);
 assert.equal(log.gpuDraws.length,1);assert.equal(log.gpuDraws[0].count,a.geometry.triangles.length);
 assert.equal(library.status().compiledPrograms,1);assert.equal(serializeAsset(a),before);
 assert.ok(device.status().estimatedTotalResourceBytes>0);
});
test('E1-E4 source path draws two assets retaining independent identity',()=>{
 const {bridge,pipeline,log,device}=setup();const a=asset('sdf-sphere'),b=asset('sdf-branch');
 bridge.attach(a,{x:-1,z:0,groundSampler:()=>({y:0})});bridge.attach(b,{x:1,z:0,groundSampler:()=>({y:0})});
 assert.equal(bridge.render().submitted,2);assert.equal(log.gpuDraws.length,2);assert.equal(pipeline.status().executed,2);assert.equal(device.status().meshes,2);
});
test('E1-E4 source path respects E3 culling and no visible draw',()=>{
 const {bridge,pipeline,log}=setup();bridge.attach(asset('sdf-sphere'),{x:1000,z:0,groundSampler:()=>({y:0})});
 assert.equal(bridge.render().submitted,0);assert.equal(log.gpuDraws.length,0);assert.equal(pipeline.status().completedFrames,1);
});

// Controlled geometry and source transport: no implicit animation loss or photo-to-3D claim.

test('native volume branch and cavity remain watertight and consistently wound',()=>{for(const n of ['sdf-sphere','sdf-branch','sdf-cavity']){const a=asset(n),c=a.geometryCensus;assert.equal(c.watertight,true,JSON.stringify(c));assert.equal(c.inconsistentWindingEdges,0);}});
test('silhouette-derived geometry is deterministic and source explicitly remains heuristic',()=>{const a=asset('silhouette-circle-seed'),b=asset('silhouette-circle-seed');assert.deepEqual(a.geometry.positions,b.geometry.positions);assert.deepEqual(a.source,{kind:'SILHOUETTE_HEURISTIC_PRIOR'});});
test('image boundary absence rejects rather than inventing source geometry',()=>{assert.throws(()=>silhouetteField(footprint(12,12,()=>false)),/MASK_NO_BOUNDARY/)});
test('static glTF 2.0 binary export preserves asset provenance and triangles',()=>{const a=asset('sdf-sphere'),glb=exportStaticGlb(a),dv=new DataView(glb.buffer,glb.byteOffset,glb.byteLength);assert.equal(dv.getUint32(0,true),0x46546c67);assert.equal(dv.getUint32(4,true),2);assert.equal(dv.getUint32(8,true),glb.length);const jsonLen=dv.getUint32(12,true),decoded=new TextDecoder().decode(glb.subarray(20,20+jsonLen)).trim(),body=JSON.parse(decoded);assert.equal(body.extras.dgbAssetId,a.id);assert.equal(body.accessors[3].count,a.geometry.triangles.length)});
test('64-pose metadata is not discarded by static binding or static GLB export',()=>{const a=asset('sdf-sphere'),animated=makeAsset({id:'sixty-four-pose-source',mesh:a.geometry,animation:{poseCount:64}}),{bridge}=setup();assert.throws(()=>exportStaticGlb(animated),/ANIMATION_EXPORT_UNSUPPORTED/);assert.throws(()=>bridge.attach(animated,{x:0,z:0,groundSampler:()=>({y:0})}),/ANIMATED_ASSET_GPU_BINDING_NOT_YET_SUPPORTED/);});
test('native asset survives deterministic serialize/restore and cannot be edited in place',()=>{const a=asset('sdf-sphere'),s=serializeAsset(a),b=restoreAsset(s);assert.equal(serializeAsset(b),s);assert.throws(()=>{a.geometry.positions[0]=99},TypeError);});
test('actual E1-E4 binding fails closed without terrain sample, before resource allocation',()=>{const {bridge,device}=setup();assert.throws(()=>bridge.attach(asset('sdf-sphere'),{x:0,z:0,groundSampler:()=>null}),/ACTUAL_TERRAIN_GROUND_MISSING/);assert.equal(device.status().meshes,0);});

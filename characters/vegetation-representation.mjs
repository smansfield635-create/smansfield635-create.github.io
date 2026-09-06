import {getCanonicalVegetationPopulation} from './vegetation-population.mjs';

const freeze=(value,seen=new WeakSet())=>{
  if(value===null||typeof value!=='object'||Object.isFrozen(value)||seen.has(value))return value;
  seen.add(value);
  for(const nested of Object.values(value))freeze(nested,seen);
  return Object.freeze(value);
};
const finite=value=>typeof value==='number'&&Number.isFinite(value);
const distance3=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);

export const CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT=freeze({
  schema:'MIRRORLAND_CAMERA_TRUE_INSTANCED_VEGETATION_REPRESENTATION_CONTRACT_v1',
  operationId:'MIRRORLAND_CANONICAL_ECOLOGY_CAMERA_TRUE_VEGETATION_20260905_003',
  stage:'V3_CAMERA_TRUE_INSTANCED_LOD',
  populationSource:'characters/vegetation-population.mjs#getCanonicalVegetationPopulation',
  canonicalPopulationMutable:false,
  lodAuthority:'CAMERA_DISTANCE',
  permittedLodAuthorities:freeze(['CAMERA_DISTANCE','PROJECTED_SCREEN_SIZE']),
  hysteresisRequired:true,
  hysteresis:freeze({
    nearMid:freeze({enterFar:320,enterNear:260}),
    midFar:freeze({enterFar:760,enterNear:640})
  }),
  representationClasses:freeze({
    NEAR_FIELD:freeze({
      samplingDensity:1,
      primitives:freeze(['TRUNK_INSTANCED','BRANCH_INSTANCED','CROWN_CLUSTER_INSTANCED']),
      canopyBlobAllowed:false
    }),
    MID_FIELD:freeze({
      samplingDensity:.56,
      primitives:freeze(['TRUNK_INSTANCED','REDUCED_BRANCH_INSTANCED','CROWN_CLUSTER_INSTANCED']),
      canopyBlobAllowed:false
    }),
    FAR_FIELD:freeze({
      samplingDensity:.20,
      primitives:freeze(['TRUNK_INSTANCED','CANOPY_BLOB_INSTANCED']),
      canopyBlobAllowed:true
    })
  }),
  canopyBlobAllowedOnly:freeze(['FAR_FIELD','INTERNAL_CROWN_OCCLUSION']),
  identityInputsProhibited:freeze(['DEVICE_CLASS','VIEWPORT_CLASS','REDUCED_MOTION']),
  representationOnly:true
});

export function classifyVegetationLod(distance,previousLod=null){
  if(!finite(distance)||distance<0)throw new Error('VEGETATION_LOD_DISTANCE_INVALID');
  const {nearMid,midFar}=CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT.hysteresis;

  if(previousLod==='NEAR_FIELD'){
    return distance>=nearMid.enterFar?'MID_FIELD':'NEAR_FIELD';
  }
  if(previousLod==='MID_FIELD'){
    if(distance<=nearMid.enterNear)return 'NEAR_FIELD';
    if(distance>=midFar.enterFar)return 'FAR_FIELD';
    return 'MID_FIELD';
  }
  if(previousLod==='FAR_FIELD'){
    return distance<=midFar.enterNear?'MID_FIELD':'FAR_FIELD';
  }

  if(distance<((nearMid.enterFar+nearMid.enterNear)/2))return 'NEAR_FIELD';
  if(distance<((midFar.enterFar+midFar.enterNear)/2))return 'MID_FIELD';
  return 'FAR_FIELD';
}

function previousLodMap(previousFrame){
  const out=new Map();
  for(const item of previousFrame?.representations||[])out.set(item.id,item.lod);
  return out;
}

export function buildVegetationRepresentationFrame({camera,previousFrame=null}={}){
  const eye=camera?.eye;
  if(!eye||![eye.x,eye.y,eye.z].every(finite))throw new Error('VEGETATION_CAMERA_EYE_REQUIRED');

  const population=getCanonicalVegetationPopulation();
  const prior=previousLodMap(previousFrame);
  const representations=population.instances.map(instance=>{
    const distance=distance3(instance.world,eye);
    const lod=classifyVegetationLod(distance,prior.get(instance.id)||null);
    const style=CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT.representationClasses[lod];
    return freeze({
      id:instance.id,
      canonicalWorld:instance.world,
      distance,
      lod,
      samplingDensity:style.samplingDensity,
      primitives:style.primitives,
      usesCanopyBlob:style.canopyBlobAllowed===true,
      occlusionRole:null
    });
  });

  return freeze({
    schema:'MIRRORLAND_CAMERA_TRUE_INSTANCED_VEGETATION_REPRESENTATION_FRAME_v1',
    operationId:CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT.operationId,
    stage:CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT.stage,
    lodAuthority:CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT.lodAuthority,
    hysteresisApplied:true,
    canonicalPopulationCount:population.instanceCount,
    representationCount:representations.length,
    canonicalPopulation:population,
    camera:freeze({eye:freeze({...eye}),look:camera?.look?freeze({...camera.look}):null}),
    representations:freeze(representations)
  });
}

function compile(gl,type,source){
  const shader=gl.createShader(type);
  gl.shaderSource(shader,source);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
    throw new Error(`VEGETATION_SHADER:${gl.getShaderInfoLog(shader)}`);
  }
  return shader;
}
function createProgram(gl,vs,fs){
  const program=gl.createProgram();
  gl.attachShader(program,compile(gl,gl.VERTEX_SHADER,vs));
  gl.attachShader(program,compile(gl,gl.FRAGMENT_SHADER,fs));
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
    throw new Error(`VEGETATION_PROGRAM:${gl.getProgramInfoLog(program)}`);
  }
  return program;
}
const VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aLocal;
layout(location=1) in vec3 aWorld;
layout(location=2) in float aScale;
uniform mat4 uVP;
void main(){
  vec3 p=aWorld+aLocal*aScale;
  gl_Position=uVP*vec4(p,1.0);
}`;
const FS=`#version 300 es
precision highp float;
uniform vec3 uTint;
out vec4 outColor;
void main(){outColor=vec4(uTint,1.0);}`;

const TRUNK_GEOMETRY=new Float32Array([
  -.10,0,0, .10,0,0, .08,1,0,
  -.10,0,0, .08,1,0, -.08,1,0
]);
const CROWN_GEOMETRY=new Float32Array([
  0,1.55,0, -.72,.72,0, .72,.72,0,
  0,1.55,0, 0,.72,-.72, 0,.72,.72
]);
const FAR_CANOPY_BLOB_GEOMETRY=new Float32Array([
  0,1.25,0, -.62,.58,0, .62,.58,0,
  0,1.25,0, 0,.58,-.62, 0,.58,.62
]);

function makePrimitive(gl,geometry){
  const vao=gl.createVertexArray();
  gl.bindVertexArray(vao);
  const local=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,local);
  gl.bufferData(gl.ARRAY_BUFFER,geometry,gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0,3,gl.FLOAT,false,12,0);

  const instances=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,instances);
  gl.bufferData(gl.ARRAY_BUFFER,0,gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1,3,gl.FLOAT,false,16,0);
  gl.vertexAttribDivisor(1,1);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2,1,gl.FLOAT,false,16,12);
  gl.vertexAttribDivisor(2,1);
  gl.bindVertexArray(null);
  return {vao,instances,vertexCount:geometry.length/3};
}

function instancePayload(frame,lod){
  const canonicalById=new Map(frame.canonicalPopulation.instances.map(item=>[item.id,item]));
  const data=[];
  for(const item of frame.representations){
    if(item.lod!==lod)continue;
    const source=canonicalById.get(item.id);
    data.push(source.world.x,source.world.y,source.world.z,.72+source.forestWeight*.48);
  }
  return new Float32Array(data);
}

export function createCameraTrueVegetationRenderer(gl){
  if(!gl||typeof gl.drawArraysInstanced!=='function')throw new Error('WEBGL2_INSTANCING_REQUIRED');
  const shader=createProgram(gl,VS,FS);
  const trunk=makePrimitive(gl,TRUNK_GEOMETRY);
  const crown=makePrimitive(gl,CROWN_GEOMETRY);
  const farCanopy=makePrimitive(gl,FAR_CANOPY_BLOB_GEOMETRY);
  const uVP=gl.getUniformLocation(shader,'uVP');
  const uTint=gl.getUniformLocation(shader,'uTint');

  const drawPrimitive=(primitive,payload,tint)=>{
    const count=payload.length/4;
    if(!count)return 0;
    gl.bindVertexArray(primitive.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER,primitive.instances);
    gl.bufferData(gl.ARRAY_BUFFER,payload,gl.DYNAMIC_DRAW);
    gl.uniform3fv(uTint,tint);
    gl.drawArraysInstanced(gl.TRIANGLES,0,primitive.vertexCount,count);
    return count;
  };

  return freeze({
    schema:'MIRRORLAND_CAMERA_TRUE_INSTANCED_VEGETATION_RENDERER_v1',
    draw({vp,camera,previousFrame=null}={}){
      if(!vp)throw new Error('VEGETATION_VP_REQUIRED');
      const frame=buildVegetationRepresentationFrame({camera,previousFrame});
      gl.useProgram(shader);
      gl.uniformMatrix4fv(uVP,false,vp);
      const near=instancePayload(frame,'NEAR_FIELD');
      const mid=instancePayload(frame,'MID_FIELD');
      const far=instancePayload(frame,'FAR_FIELD');

      let instanceDraws=0;
      instanceDraws+=drawPrimitive(trunk,near,[.22,.16,.10]);
      instanceDraws+=drawPrimitive(crown,near,[.12,.27,.17]);
      instanceDraws+=drawPrimitive(trunk,mid,[.20,.15,.10]);
      instanceDraws+=drawPrimitive(crown,mid,[.11,.23,.16]);
      instanceDraws+=drawPrimitive(trunk,far,[.18,.14,.10]);
      instanceDraws+=drawPrimitive(farCanopy,far,[.10,.19,.15]);

      gl.bindVertexArray(null);
      return freeze({frame,instanceDraws});
    }
  });
}

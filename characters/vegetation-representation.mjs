import {getCanonicalVegetationPopulation} from './vegetation-population.mjs';

const freeze=(value,seen=new WeakSet())=>{
  if(value===null||typeof value!=='object'||Object.isFrozen(value)||seen.has(value))return value;
  seen.add(value);
  for(const nested of Object.values(value))freeze(nested,seen);
  return Object.freeze(value);
};
const finite=value=>typeof value==='number'&&Number.isFinite(value);
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const distance3=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
const TAU=Math.PI*2;
const hash32=value=>{
  let n=value>>>0;
  n=(n^61)^(n>>>16);
  n=Math.imul(n,9);
  n=n^(n>>>4);
  n=Math.imul(n,0x27d4eb2d);
  return (n^(n>>>15))>>>0;
};
const hashString=value=>{
  let h=2166136261;
  for(const ch of String(value)){
    h^=ch.charCodeAt(0);
    h=Math.imul(h,16777619);
  }
  return h>>>0;
};
const rand=(seed,k=0)=>hash32(seed^Math.imul(k+1,0x9e3779b1))/4294967295;

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
      primitives:freeze([
        'TRUNK_INSTANCED',
        'MAJOR_BOUGH_INSTANCED',
        'IRREGULAR_TERMINAL_FOLIAGE_CLUSTER_INSTANCED',
        'ACTUAL_REUSABLE_LEAF_MESH_INSTANCED',
        'INTERNAL_CROWN_OCCLUSION_INSTANCED'
      ]),
      canopyBlobAllowed:false
    }),
    MID_FIELD:freeze({
      samplingDensity:.56,
      primitives:freeze([
        'TRUNK_INSTANCED',
        'REDUCED_BOUGH_INSTANCED',
        'SIMPLIFIED_CROSSED_FOLIAGE_SPRAY_INSTANCED',
        'INTERNAL_CROWN_OCCLUSION_INSTANCED'
      ]),
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

export const HIERARCHICAL_FOLIAGE_V5_REPRESENTATION_CONTRACT=freeze({
  schema:'MIRRORLAND_HIERARCHICAL_FOLIAGE_V5_REPRESENTATION_CONTRACT_v1',
  operationId:'MIRRORLAND_HIERARCHICAL_FOLIAGE_20260906_002',
  lockGeneration:1962,
  stage:'V5_HIERARCHICAL_FOLIAGE',
  canonicalPopulationSource:'characters/vegetation-population.mjs',
  cameraTrueLodSource:'CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT',
  hierarchy:freeze({
    NEAR_FIELD:freeze({
      macro:freeze(['TRUNK_INSTANCED','MAJOR_BOUGH_INSTANCED']),
      meso:freeze(['IRREGULAR_TERMINAL_FOLIAGE_CLUSTER_INSTANCED']),
      micro:freeze(['ACTUAL_REUSABLE_LEAF_MESH_INSTANCED']),
      externalCanopyBlob:false,
      internalOcclusionMass:true
    }),
    MID_FIELD:freeze({
      macro:freeze(['TRUNK_INSTANCED','REDUCED_BOUGH_INSTANCED']),
      meso:freeze(['SIMPLIFIED_CROSSED_FOLIAGE_SPRAY_INSTANCED']),
      micro:freeze([]),
      externalCanopyBlob:false,
      internalOcclusionMass:true
    }),
    FAR_FIELD:freeze({
      macro:freeze(['TRUNK_INSTANCED']),
      meso:freeze(['CANOPY_BLOB_INSTANCED']),
      micro:freeze([]),
      individualLeaves:false,
      externalCanopyBlob:true
    })
  }),
  budgets:freeze({
    nearLeaf:freeze({minimum:80,maximum:180,compactMaximum:140}),
    midCluster:freeze({minimum:20,maximum:50,compactMaximum:36}),
    farLeaf:0
  }),
  deterministicPlacement:true,
  compactChangesRepresentationDensityOnly:true,
  compactChangesCanonicalIdentity:false,
  sharedWind:false,
  foliageNightLighting:false
});

export const LIVE_MATERIAL_V6_REPRESENTATION_CONTRACT=freeze({
  schema:'MIRRORLAND_LIVE_MATERIAL_V6_REPRESENTATION_CONTRACT_v1',
  operationId:'MIRRORLAND_V6_LIVE_VEGETATION_MATERIAL_RECOVERY_20260908_001',
  lockGeneration:2018,
  stage:'V6_LIVE_VEGETATION_MATERIAL_RECOVERY',
  canonicalPopulationCount:818,
  canonicalIdentityMutable:false,
  cameraTrueLodPreserved:true,
  compactBudgets:freeze({nearLeafMaximum:155,midClusterMaximum:44}),
  farCanopyLayerCount:2,
  foliageNightLighting:true,
  depthResponse:true,
  materialSignals:freeze(['FACE_NORMAL','MOON_DIFFUSE','VIEW_RIM','HEIGHT_VARIATION','DISTANCE_HAZE']),
  upstreamIdentityInputsProhibited:freeze(['DEVICE_CLASS','VIEWPORT_CLASS','REDUCED_MOTION','CAMERA_STATE'])
});

export function resolveNearLeafBudget(forestWeight=0,compact=false){
  const weight=clamp(Number(forestWeight)||0,0,1);
  const maximum=compact?LIVE_MATERIAL_V6_REPRESENTATION_CONTRACT.compactBudgets.nearLeafMaximum:HIERARCHICAL_FOLIAGE_V5_REPRESENTATION_CONTRACT.budgets.nearLeaf.maximum;
  return Math.round(HIERARCHICAL_FOLIAGE_V5_REPRESENTATION_CONTRACT.budgets.nearLeaf.minimum+(maximum-HIERARCHICAL_FOLIAGE_V5_REPRESENTATION_CONTRACT.budgets.nearLeaf.minimum)*weight);
}

export function resolveMidClusterBudget(forestWeight=0,compact=false){
  const weight=clamp(Number(forestWeight)||0,0,1);
  const maximum=compact?LIVE_MATERIAL_V6_REPRESENTATION_CONTRACT.compactBudgets.midClusterMaximum:HIERARCHICAL_FOLIAGE_V5_REPRESENTATION_CONTRACT.budgets.midCluster.maximum;
  return Math.round(HIERARCHICAL_FOLIAGE_V5_REPRESENTATION_CONTRACT.budgets.midCluster.minimum+(maximum-HIERARCHICAL_FOLIAGE_V5_REPRESENTATION_CONTRACT.budgets.midCluster.minimum)*weight);
}

export function classifyVegetationLod(distance,previousLod=null){
  if(!finite(distance)||distance<0)throw new Error('VEGETATION_LOD_DISTANCE_INVALID');
  const {nearMid,midFar}=CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT.hysteresis;
  if(previousLod==='NEAR_FIELD')return distance>=nearMid.enterFar?'MID_FIELD':'NEAR_FIELD';
  if(previousLod==='MID_FIELD'){
    if(distance<=nearMid.enterNear)return 'NEAR_FIELD';
    if(distance>=midFar.enterFar)return 'FAR_FIELD';
    return 'MID_FIELD';
  }
  if(previousLod==='FAR_FIELD')return distance<=midFar.enterNear?'MID_FIELD':'FAR_FIELD';
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
      occlusionRole:lod==='FAR_FIELD'?null:'INTERNAL_CROWN_OCCLUSION'
    });
  });
  return freeze({
    schema:'MIRRORLAND_CAMERA_TRUE_INSTANCED_VEGETATION_REPRESENTATION_FRAME_v1',
    operationId:HIERARCHICAL_FOLIAGE_V5_REPRESENTATION_CONTRACT.operationId,
    stage:HIERARCHICAL_FOLIAGE_V5_REPRESENTATION_CONTRACT.stage,
    lodAuthority:CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT.lodAuthority,
    hysteresisApplied:true,
    canonicalPopulationCount:population.instanceCount,
    representationCount:representations.length,
    canonicalPopulation:population,
    camera:freeze({eye:freeze({...eye}),look:camera?.look?freeze({...camera.look}):null}),
    representations:freeze(representations)
  });
}

function treeMetrics(instance){
  const seed=hashString(instance.id);
  const weight=clamp(Number(instance.forestWeight)||0,0,1);
  const height=17+19*weight+5*rand(seed,1);
  const spread=height*(.22+.13*weight+.05*rand(seed,2));
  return freeze({
    seed,
    weight,
    height,
    spread,
    yaw:TAU*rand(seed,3),
    crownY:instance.world.y+height*(.66+.035*(rand(seed,4)-.5)),
    leanX:(rand(seed,5)-.5)*height*.07,
    leanZ:(rand(seed,6)-.5)*height*.07
  });
}

function compile(gl,type,source){
  const shader=gl.createShader(type);
  gl.shaderSource(shader,source);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(`VEGETATION_SHADER:${gl.getShaderInfoLog(shader)}`);
  return shader;
}
function createProgram(gl,vs,fs){
  const program=gl.createProgram();
  gl.attachShader(program,compile(gl,gl.VERTEX_SHADER,vs));
  gl.attachShader(program,compile(gl,gl.FRAGMENT_SHADER,fs));
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(`VEGETATION_PROGRAM:${gl.getProgramInfoLog(program)}`);
  return program;
}

const VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aLocal;
layout(location=1) in vec3 aWorld;
layout(location=2) in float aScale;
layout(location=3) in float aAngle;
uniform mat4 uVP;
out vec3 vWorld;
out vec3 vLocal;
out float vScale;
void main(){
  float c=cos(aAngle),s=sin(aAngle);
  vec3 q=aLocal*aScale;
  vec3 p=vec3(q.x*c-q.z*s,q.y,q.x*s+q.z*c)+aWorld;
  vWorld=p;
  vLocal=aLocal;
  vScale=aScale;
  gl_Position=uVP*vec4(p,1.0);
}`;
const FS=`#version 300 es
precision highp float;
in vec3 vWorld;
in vec3 vLocal;
in float vScale;
uniform vec3 uTint;
uniform vec3 uAccent;
uniform vec3 uEye;
uniform vec3 uMoonDirection;
uniform float uLunarIntensity;
uniform float uHorizonHaze;
uniform float uMaterialProfile;
uniform float uTime;
out vec4 outColor;
float hash21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
void main(){
  vec3 dx=dFdx(vWorld);
  vec3 dy=dFdy(vWorld);
  vec3 normal=normalize(cross(dx,dy));
  if(!gl_FrontFacing)normal=-normal;
  vec3 viewDirection=normalize(uEye-vWorld);
  vec3 moonDirection=normalize(uMoonDirection);
  float moonFace=.18+.82*abs(dot(normal,moonDirection));
  float viewRim=pow(1.0-abs(dot(normal,viewDirection)),2.15);
  float heightSignal=clamp(vLocal.y*.58+.48,0.0,1.0);
  float variation=hash21(floor(vWorld.xz*.115)+vec2(floor(vScale*3.0),uMaterialProfile*7.0));
  float foliage=step(1.5,uMaterialProfile);
  float occlusion=1.0-smoothstep(.0,.32,abs(uMaterialProfile-1.0));
  float lunar=clamp(uLunarIntensity,0.0,1.0);
  vec3 pigment=mix(uTint,uAccent,clamp(.12+.36*heightSignal+.24*variation+.16*moonFace,0.0,.82));
  float ambient=mix(.47,.56,foliage);
  float illumination=ambient+moonFace*(.18+.34*lunar)+viewRim*(.08+.16*lunar);
  illumination*=mix(.92,1.08,heightSignal);
  illumination*=mix(1.0,.62,occlusion);
  vec3 color=pigment*illumination+uAccent*viewRim*(.035+.075*lunar);
  float distanceToEye=distance(vWorld,uEye);
  float haze=smoothstep(780.0,2450.0,distanceToEye)*(.12+.20*clamp(uHorizonHaze,0.0,1.0));
  vec3 nocturnalHaze=vec3(.045,.072,.092)+uAccent*.035;
  color=mix(color,nocturnalHaze,haze);
  float stillness=1.0+.012*sin(uTime*.13+vWorld.x*.017+vWorld.z*.013);
  outColor=vec4(color*stillness,1.0);
}`;

export const TRUNK_GEOMETRY=new Float32Array([
  -.035,0,0, .035,0,0, .026,.62,0,
  -.035,0,0, .026,.62,0, -.026,.62,0,
  0,0,-.035, 0,.62,-.026, 0,0,.035,
  0,0,.035, 0,.62,-.026, 0,.62,.026
]);
export const MAJOR_BOUGH_GEOMETRY=new Float32Array([
  -.025,.43,0, .025,.45,0, -.30,.72,.09,
  .025,.45,0, .30,.76,-.07, -.30,.72,.09,
  0,.48,-.025, 0,.50,.025, .10,.80,.29,
  0,.50,.025, -.10,.74,-.31, .10,.80,.29,
  -.018,.54,0, .018,.56,0, -.22,.88,-.18,
  .018,.56,0, .24,.86,.17, -.22,.88,-.18
]);
export const REDUCED_BOUGH_GEOMETRY=new Float32Array([
  -.022,.46,0, .022,.48,0, -.25,.73,.06,
  .022,.48,0, .25,.76,-.05, -.25,.73,.06,
  0,.50,-.018, 0,.52,.018, .08,.78,.22,
  0,.52,.018, -.08,.75,-.22, .08,.78,.22
]);
export const MESO_CLUSTER_GEOMETRY=new Float32Array([
  0,.62,0, -.68,0,0, .26,.08,.18,
  0,.62,0, .26,.08,.18, .72,-.08,-.12,
  0,.62,0, .72,-.08,-.12, -.18,-.18,-.26,
  0,.62,0, -.18,-.18,-.26, -.68,0,0,
  0,.48,.26, -.50,-.04,.10, .44,-.10,.02,
  0,.48,-.26, .44,-.10,-.02, -.50,-.04,-.10
]);
export const MICRO_LEAF_GEOMETRY=new Float32Array([
  0,.58,0, -.24,0,0, 0,-.58,0,
  0,.58,0, 0,-.58,0, .24,0,0,
  0,.52,.03, 0,0,-.22, 0,-.52,.03,
  0,.52,.03, 0,-.52,.03, 0,0,.22
]);
export const MID_SPRAY_GEOMETRY=new Float32Array([
  0,.72,0, -.34,.08,0, 0,-.42,0,
  0,.72,0, 0,-.42,0, .34,.08,0,
  0,.62,.04, 0,.02,-.30, 0,-.40,.04,
  0,.62,.04, 0,-.40,.04, 0,.02,.30,
  -.08,.50,-.16, .08,.50,.16, 0,-.30,0
]);
export const INTERNAL_OCCLUSION_GEOMETRY=new Float32Array([
  0,.72,0, -.62,0,0, 0,0,.56,
  0,.72,0, 0,0,.56, .62,0,0,
  0,.72,0, .62,0,0, 0,0,-.56,
  0,.72,0, 0,0,-.56, -.62,0,0,
  0,-.54,0, 0,0,.56, -.62,0,0,
  0,-.54,0, .62,0,0, 0,0,.56,
  0,-.54,0, 0,0,-.56, .62,0,0,
  0,-.54,0, -.62,0,0, 0,0,-.56
]);
export const FAR_CANOPY_BLOB_GEOMETRY=new Float32Array([
  0,.84,0, -.76,.18,0, -.50,-.42,.38,
  0,.84,0, -.50,-.42,.38, .20,-.55,.60,
  0,.84,0, .20,-.55,.60, .72,-.12,.20,
  0,.84,0, .72,-.12,.20, .62,-.34,-.46,
  0,.84,0, .62,-.34,-.46, -.10,-.56,-.62,
  0,.84,0, -.10,-.56,-.62, -.76,.18,0
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
  gl.vertexAttribPointer(1,3,gl.FLOAT,false,20,0);
  gl.vertexAttribDivisor(1,1);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2,1,gl.FLOAT,false,20,12);
  gl.vertexAttribDivisor(2,1);
  gl.enableVertexAttribArray(3);
  gl.vertexAttribPointer(3,1,gl.FLOAT,false,20,16);
  gl.vertexAttribDivisor(3,1);
  gl.bindVertexArray(null);
  return {vao,instances,vertexCount:geometry.length/3};
}

const pushInstance=(data,x,y,z,scale,angle=0)=>data.push(x,y,z,scale,angle);
const sourceMap=frame=>new Map(frame.canonicalPopulation.instances.map(item=>[item.id,item]));

function buildTreePayload(frame,lod){
  const canonical=sourceMap(frame),data=[];
  for(const item of frame.representations){
    if(item.lod!==lod)continue;
    const source=canonical.get(item.id),metrics=treeMetrics(source);
    pushInstance(data,source.world.x+metrics.leanX*.18,source.world.y,source.world.z+metrics.leanZ*.18,metrics.height,metrics.yaw);
  }
  return new Float32Array(data);
}

function crownPosition(source,metrics,index,count,seedOffset=0){
  const lobeCount=5+(metrics.seed%3);
  const lobe=index%lobeCount;
  const lobeAngle=metrics.yaw+TAU*lobe/lobeCount+(rand(metrics.seed,seedOffset+lobe)-.5)*.38;
  const lobeRadius=metrics.spread*(.38+.18*rand(metrics.seed,seedOffset+17+lobe));
  const localAngle=TAU*rand(metrics.seed,seedOffset+101+index);
  const localRadius=metrics.spread*(.07+.22*Math.sqrt(rand(metrics.seed,seedOffset+211+index)));
  const radialBias=.84+.22*Math.sin((index+1)*1.71+rand(metrics.seed,seedOffset+301)*TAU);
  return {
    x:source.world.x+Math.cos(lobeAngle)*lobeRadius+Math.cos(localAngle)*localRadius*radialBias+metrics.leanX*.7,
    y:metrics.crownY+metrics.height*((rand(metrics.seed,seedOffset+401+index)-.5)*.29)+metrics.height*.035*Math.sin(lobe*1.9),
    z:source.world.z+Math.sin(lobeAngle)*lobeRadius+Math.sin(localAngle)*localRadius+metrics.leanZ*.7,
    angle:TAU*rand(metrics.seed,seedOffset+503+index)
  };
}

export function buildNearLeafPayload(frame,{compact=false}={}){
  const canonical=sourceMap(frame),data=[];
  for(const item of frame.representations){
    if(item.lod!=='NEAR_FIELD')continue;
    const source=canonical.get(item.id),metrics=treeMetrics(source);
    const count=resolveNearLeafBudget(source.forestWeight,compact);
    for(let i=0;i<count;i++){
      const p=crownPosition(source,metrics,i,count,700);
      const leafScale=.38+.54*rand(metrics.seed,1300+i);
      pushInstance(data,p.x,p.y,p.z,leafScale,p.angle);
    }
  }
  return new Float32Array(data);
}

function buildNearMesoPayload(frame,{compact=false}={}){
  const canonical=sourceMap(frame),data=[];
  for(const item of frame.representations){
    if(item.lod!=='NEAR_FIELD')continue;
    const source=canonical.get(item.id),metrics=treeMetrics(source);
    const count=(compact?12:18)+Math.round(metrics.weight*(compact?7:11));
    for(let i=0;i<count;i++){
      const p=crownPosition(source,metrics,i,count,1900);
      const clusterScale=1.65+1.40*metrics.weight+.75*rand(metrics.seed,2400+i);
      pushInstance(data,p.x,p.y,p.z,clusterScale,p.angle);
    }
  }
  return new Float32Array(data);
}

export function buildMidSprayPayload(frame,{compact=false}={}){
  const canonical=sourceMap(frame),data=[];
  for(const item of frame.representations){
    if(item.lod!=='MID_FIELD')continue;
    const source=canonical.get(item.id),metrics=treeMetrics(source);
    const count=resolveMidClusterBudget(source.forestWeight,compact);
    for(let i=0;i<count;i++){
      const p=crownPosition(source,metrics,i,count,3100);
      const sprayScale=1.34+1.54*metrics.weight+.72*rand(metrics.seed,3600+i);
      pushInstance(data,p.x,p.y,p.z,sprayScale,p.angle);
    }
  }
  return new Float32Array(data);
}

function buildInternalPayload(frame,lod){
  const canonical=sourceMap(frame),data=[];
  for(const item of frame.representations){
    if(item.lod!==lod)continue;
    const source=canonical.get(item.id),metrics=treeMetrics(source);
    const scale=metrics.spread*(lod==='NEAR_FIELD'?.44:.50);
    pushInstance(data,source.world.x+metrics.leanX*.7,metrics.crownY,source.world.z+metrics.leanZ*.7,scale,metrics.yaw);
  }
  return new Float32Array(data);
}

export function buildFarCanopyLayerPayload(frame,layer=0){
  if(layer!==0&&layer!==1)throw new Error('FAR_CANOPY_LAYER_INVALID');
  const canonical=sourceMap(frame),data=[];
  for(const item of frame.representations){
    if(item.lod!=='FAR_FIELD')continue;
    const source=canonical.get(item.id),metrics=treeMetrics(source);
    const offset=layer===0?0:metrics.spread*.24;
    const angle=metrics.yaw+(layer===0?0:1.72);
    const scale=metrics.spread*(layer===0?1.08:.74);
    pushInstance(
      data,
      source.world.x+metrics.leanX*.7+Math.cos(metrics.yaw+1.15)*offset,
      metrics.crownY+(layer===0?0:metrics.height*.075),
      source.world.z+metrics.leanZ*.7+Math.sin(metrics.yaw+1.15)*offset,
      scale,
      angle
    );
  }
  return new Float32Array(data);
}

export function createCameraTrueVegetationRenderer(gl,{compact=false}={}){
  if(!gl||typeof gl.drawArraysInstanced!=='function')throw new Error('WEBGL2_INSTANCING_REQUIRED');
  const shader=createProgram(gl,VS,FS);
  const trunk=makePrimitive(gl,TRUNK_GEOMETRY);
  const majorBough=makePrimitive(gl,MAJOR_BOUGH_GEOMETRY);
  const reducedBough=makePrimitive(gl,REDUCED_BOUGH_GEOMETRY);
  const mesoCluster=makePrimitive(gl,MESO_CLUSTER_GEOMETRY);
  const microLeaf=makePrimitive(gl,MICRO_LEAF_GEOMETRY);
  const midSpray=makePrimitive(gl,MID_SPRAY_GEOMETRY);
  const internalOcclusion=makePrimitive(gl,INTERNAL_OCCLUSION_GEOMETRY);
  const farCanopy=makePrimitive(gl,FAR_CANOPY_BLOB_GEOMETRY);
  const uVP=gl.getUniformLocation(shader,'uVP');
  const uTint=gl.getUniformLocation(shader,'uTint');
  const uAccent=gl.getUniformLocation(shader,'uAccent');
  const uEye=gl.getUniformLocation(shader,'uEye');
  const uMoonDirection=gl.getUniformLocation(shader,'uMoonDirection');
  const uLunarIntensity=gl.getUniformLocation(shader,'uLunarIntensity');
  const uHorizonHaze=gl.getUniformLocation(shader,'uHorizonHaze');
  const uMaterialProfile=gl.getUniformLocation(shader,'uMaterialProfile');
  const uTime=gl.getUniformLocation(shader,'uTime');

  const drawPrimitive=(primitive,payload,tint,accent,materialProfile)=>{
    const count=payload.length/5;
    if(!count)return 0;
    gl.bindVertexArray(primitive.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER,primitive.instances);
    gl.bufferData(gl.ARRAY_BUFFER,payload,gl.DYNAMIC_DRAW);
    gl.uniform3fv(uTint,tint);
    gl.uniform3fv(uAccent,accent);
    gl.uniform1f(uMaterialProfile,materialProfile);
    gl.drawArraysInstanced(gl.TRIANGLES,0,primitive.vertexCount,count);
    return count;
  };

  return freeze({
    schema:'MIRRORLAND_LIVE_MATERIAL_V6_RENDERER_v1',
    compact,
    draw({vp,camera,previousFrame=null,lighting={},time=0}={}){
      if(!vp)throw new Error('VEGETATION_VP_REQUIRED');
      const frame=buildVegetationRepresentationFrame({camera,previousFrame});
      const moon=lighting.moonDirection||[-.52,.76,.40];
      gl.useProgram(shader);
      gl.uniformMatrix4fv(uVP,false,vp);
      gl.uniform3f(uEye,camera.eye.x,camera.eye.y,camera.eye.z);
      gl.uniform3f(uMoonDirection,moon[0],moon[1],moon[2]);
      gl.uniform1f(uLunarIntensity,finite(lighting.lunarIntensity)?lighting.lunarIntensity:.72);
      gl.uniform1f(uHorizonHaze,finite(lighting.horizonHaze)?lighting.horizonHaze:.42);
      gl.uniform1f(uTime,finite(time)?time:0);

      const nearTrees=buildTreePayload(frame,'NEAR_FIELD');
      const midTrees=buildTreePayload(frame,'MID_FIELD');
      const farTrees=buildTreePayload(frame,'FAR_FIELD');
      const nearMeso=buildNearMesoPayload(frame,{compact});
      const nearLeaves=buildNearLeafPayload(frame,{compact});
      const midSprays=buildMidSprayPayload(frame,{compact});
      const nearInternal=buildInternalPayload(frame,'NEAR_FIELD');
      const midInternal=buildInternalPayload(frame,'MID_FIELD');
      const farCanopyPrimary=buildFarCanopyLayerPayload(frame,0);
      const farCanopySecondary=buildFarCanopyLayerPayload(frame,1);

      let instanceDraws=0;
      instanceDraws+=drawPrimitive(trunk,nearTrees,[.145,.090,.046],[.34,.235,.125],0);
      instanceDraws+=drawPrimitive(majorBough,nearTrees,[.135,.082,.043],[.31,.215,.115],.35);
      instanceDraws+=drawPrimitive(internalOcclusion,nearInternal,[.032,.100,.052],[.085,.225,.115],1);
      instanceDraws+=drawPrimitive(mesoCluster,nearMeso,[.070,.235,.118],[.225,.515,.270],2);
      instanceDraws+=drawPrimitive(microLeaf,nearLeaves,[.095,.305,.148],[.300,.635,.335],2.45);

      instanceDraws+=drawPrimitive(trunk,midTrees,[.135,.083,.044],[.30,.205,.110],0);
      instanceDraws+=drawPrimitive(reducedBough,midTrees,[.125,.078,.042],[.275,.190,.102],.35);
      instanceDraws+=drawPrimitive(internalOcclusion,midInternal,[.030,.092,.050],[.078,.205,.108],1);
      instanceDraws+=drawPrimitive(midSpray,midSprays,[.075,.245,.125],[.235,.535,.285],2.2);

      instanceDraws+=drawPrimitive(trunk,farTrees,[.120,.076,.042],[.255,.178,.098],0);
      instanceDraws+=drawPrimitive(farCanopy,farCanopyPrimary,[.050,.175,.088],[.175,.405,.215],3);
      instanceDraws+=drawPrimitive(farCanopy,farCanopySecondary,[.072,.225,.112],[.235,.485,.255],3);

      gl.bindVertexArray(null);
      return freeze({
        frame,
        instanceDraws,
        hierarchy:freeze({
          nearLeafInstances:nearLeaves.length/5,
          nearMesoInstances:nearMeso.length/5,
          midSprayInstances:midSprays.length/5,
          farLeafInstances:0,
          farCanopyInstances:farCanopyPrimary.length/5,
          farCanopyLayerInstances:farCanopySecondary.length/5,
          materialContract:LIVE_MATERIAL_V6_REPRESENTATION_CONTRACT.schema
        })
      });
    }
  });
}

import {sampleCanonicalVegetationEcology} from './vegetation-ecology.mjs';
import {getCanonicalVegetationPopulation} from './vegetation-population.mjs';
import {FOREST_SIGHTLINE_EXCLUSIONS} from './forest-system.mjs';

const freeze=(value,seen=new WeakSet())=>{
  if(value===null||typeof value!=='object'||Object.isFrozen(value)||seen.has(value))return value;
  seen.add(value);
  for(const nested of Object.values(value))freeze(nested,seen);
  return Object.freeze(value);
};
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const quantize=(value,digits=6)=>Number(Number(value).toFixed(digits));
const hash32=value=>{
  let n=value>>>0;
  n=(n^61)^(n>>>16);
  n=Math.imul(n,9);
  n=n^(n>>>4);
  n=Math.imul(n,0x27d4eb2d);
  return (n^(n>>>15))>>>0;
};
const rand=(seed,k=0)=>hash32(seed^Math.imul(k+1,0x9e3779b1))/4294967295;
const TAU=Math.PI*2;

export const UNDERSTORY_CLASSES=freeze([
  'GRASS_SEDGE',
  'LOW_SHRUB',
  'SAPLING_YOUNG_GROWTH',
  'REED_WET_MARGIN',
  'DEAD_SPARSE_GROUND',
  'FOREST_FLOOR_CLUSTER'
]);

const CLASS_SALT=freeze({
  GRASS_SEDGE:11,
  LOW_SHRUB:23,
  SAPLING_YOUNG_GROWTH:37,
  REED_WET_MARGIN:53,
  DEAD_SPARSE_GROUND:71,
  FOREST_FLOOR_CLUSTER:89
});

const GRID=freeze({
  columns:120,
  rows:88,
  insetFraction:.025,
  jitterFraction:.34,
  seed:1689746977
});

export const V4_UNDERSTORY_CONTRACT=freeze({
  schema:'MIRRORLAND_VEGETATION_V4_UNDERSTORY_RUNTIME_CONTRACT_v1',
  operationId:'MIRRORLAND_CANONICAL_ECOLOGY_CAMERA_TRUE_VEGETATION_20260905_003',
  stage:'V4_GROUND_AND_UNDERSTORY_CONTINUITY',
  predecessorBoundary:'V0_V3_PASS_CLOSED',
  targetBoundary:'GROUND_AND_UNDERSTORY_CONTINUITY_PASS',
  ecologySource:'characters/vegetation-ecology.mjs#sampleCanonicalVegetationEcology',
  treePopulationSource:'characters/vegetation-population.mjs#getCanonicalVegetationPopulation',
  sightlineSource:'characters/forest-system.mjs#FOREST_SIGHTLINE_EXCLUSIONS',
  geographyAuthorityCreated:false,
  populationIdentityDeviceInvariant:true,
  populationIdentityCameraInvariant:true,
  canonicalIdentityInputs:freeze(['ROW','COLUMN','FROZEN_SEED','CANONICAL_ECOLOGY']),
  prohibitedIdentityInputs:freeze(['DEVICE_CLASS','VIEWPORT_CLASS','CAMERA_STATE','REDUCED_MOTION','LOD']),
  grid:GRID,
  compactPresentationSampling:.55,
  v3CameraContextReused:true
});

function insideSightline(x,z){
  return FOREST_SIGHTLINE_EXCLUSIONS.some(item=>Math.hypot(x-item.x,z-item.z)<item.radius);
}

function classDensity(type,ecology){
  const forest=Number(ecology.biome?.forestWeight)||0;
  const river=Number(ecology.hydrology?.riverWeight)||0;
  const lake=Number(ecology.hydrology?.lakeWeight)||0;
  const wet=Math.max(river,lake);
  const drainage=ecology.hydrology?.drainageClass;
  const slopeClass=ecology.slopeClass;
  const curvatureClass=ecology.curvatureClass;
  const material=ecology.materialProfile;
  const biomeClass=ecology.biome?.class;
  const shore=Number(ecology.shorelineDistance);

  switch(type){
    case 'GRASS_SEDGE':
      if(drainage!=='LAND'||shore<6||slopeClass==='STEEP_NONCLIMBING')return 0;
      return clamp(.20+.30*forest+.22*wet+.18*(['LOWLAND_SOIL','COASTAL_SOIL','FOREST_SOIL'].includes(material)?1:0)-.12*(slopeClass==='MODERATE'?1:0),0,.92);
    case 'LOW_SHRUB':
      if(drainage!=='LAND'||shore<12||forest<.14||slopeClass==='STEEP_NONCLIMBING')return 0;
      return clamp(.08+.48*forest+.10*(curvatureClass==='CONCAVE'?1:0),0,.68);
    case 'SAPLING_YOUNG_GROWTH':
      if(drainage!=='LAND'||shore<18||forest<.28||!['LEVEL','GENTLE','MODERATE'].includes(slopeClass))return 0;
      return clamp(.04+.32*forest+.08*(biomeClass==='FOREST'?1:0),0,.46);
    case 'REED_WET_MARGIN':
      if(drainage!=='LAND'||shore<2||wet<.08||!['LEVEL','GENTLE'].includes(slopeClass))return 0;
      return clamp(.10+.82*wet,0,.96);
    case 'DEAD_SPARSE_GROUND':
      if(drainage!=='LAND'||shore<10||!['STONE_AND_SPARSE_SOIL','COASTAL_SOIL'].includes(material)||forest>=.36)return 0;
      return clamp(.10+.28*(material==='STONE_AND_SPARSE_SOIL'?1:0)+.16*(slopeClass==='MODERATE'?1:0),0,.52);
    case 'FOREST_FLOOR_CLUSTER':
      if(drainage!=='LAND'||shore<14||forest<.28||!(material==='FOREST_SOIL'||['WOODLAND','FOREST'].includes(biomeClass)))return 0;
      return clamp(.10+.62*forest+.08*(curvatureClass==='CONCAVE'?1:0),0,.88);
    default:return 0;
  }
}

function nearestTreeWithin(x,z,trees,minimum){
  const min2=minimum*minimum;
  for(const tree of trees){
    const dx=x-tree.world.x,dz=z-tree.world.z;
    if(dx*dx+dz*dz<min2)return true;
  }
  return false;
}

function selectClass(seed,ecology,trees){
  let selected=null;
  let selectedDensity=0;
  let selectedScore=-1;
  for(const type of UNDERSTORY_CLASSES){
    const density=classDensity(type,ecology);
    if(density<=0)continue;
    if(type==='SAPLING_YOUNG_GROWTH'&&nearestTreeWithin(ecology.world.x,ecology.world.z,trees,5))continue;
    const salt=CLASS_SALT[type];
    const score=density*(.84+.16*rand(seed,salt));
    if(score>selectedScore){selected=type;selectedDensity=density;selectedScore=score;}
  }
  if(!selected)return null;
  if(rand(seed,CLASS_SALT[selected]+101)>selectedDensity)return null;
  return {type:selected,density:selectedDensity};
}

function scaleFor(type,seed){
  switch(type){
    case 'GRASS_SEDGE':return .65+.70*rand(seed,151);
    case 'LOW_SHRUB':return .70+.70*rand(seed,151);
    case 'SAPLING_YOUNG_GROWTH':return 1.20+1.35*rand(seed,151);
    case 'REED_WET_MARGIN':return .80+.75*rand(seed,151);
    case 'DEAD_SPARSE_GROUND':return .70+1.10*rand(seed,151);
    case 'FOREST_FLOOR_CLUSTER':return .75+.80*rand(seed,151);
    default:return 1;
  }
}

let cachedPopulation=null;

function createUnderstoryPopulation(){
  const trees=getCanonicalVegetationPopulation();
  const envelope=trees.envelope;
  const width=envelope.xMaximum-envelope.xMinimum;
  const depth=envelope.zMaximum-envelope.zMinimum;
  const insetX=width*GRID.insetFraction;
  const insetZ=depth*GRID.insetFraction;
  const usableWidth=width-insetX*2;
  const usableDepth=depth-insetZ*2;
  const instances=[];
  const classCounts=Object.fromEntries(UNDERSTORY_CLASSES.map(type=>[type,0]));

  for(let row=0;row<GRID.rows;row++){
    for(let column=0;column<GRID.columns;column++){
      const seed=hash32(Math.imul(row+1,73856093)^Math.imul(column+1,19349663)^GRID.seed);
      const jitterX=(rand(seed,1)-.5)*2*GRID.jitterFraction;
      const jitterZ=(rand(seed,2)-.5)*2*GRID.jitterFraction;
      const u=clamp((column+.5+jitterX)/GRID.columns,0,1);
      const v=clamp((row+.5+jitterZ)/GRID.rows,0,1);
      const worldX=envelope.xMinimum+insetX+u*usableWidth;
      const worldZ=envelope.zMinimum+insetZ+v*usableDepth;
      if(insideSightline(worldX,worldZ))continue;
      const ecology=sampleCanonicalVegetationEcology(worldX,worldZ);
      if(ecology?.valid!==true)continue;
      const selected=selectClass(seed,ecology,trees.instances);
      if(!selected)continue;
      const type=selected.type;
      const instance=freeze({
        id:`understory-r${row}-c${column}-${type}`,
        lattice:freeze({row,column,seed}),
        type,
        world:freeze({x:quantize(ecology.world.x),y:quantize(ecology.world.y),z:quantize(ecology.world.z)}),
        yaw:quantize(TAU*rand(seed,181),12),
        scale:quantize(scaleFor(type,seed),12),
        density:quantize(selected.density,12),
        forestWeight:quantize(ecology.biome?.forestWeight||0,12),
        riverWeight:quantize(ecology.hydrology?.riverWeight||0,12),
        lakeWeight:quantize(ecology.hydrology?.lakeWeight||0,12),
        drainageClass:ecology.hydrology?.drainageClass,
        biomeClass:ecology.biome?.class,
        materialProfile:ecology.materialProfile,
        slopeClass:ecology.slopeClass,
        curvatureClass:ecology.curvatureClass,
        shorelineDistance:quantize(ecology.shorelineDistance,6),
        presentationSample:quantize(rand(seed,197),12),
        geographyAuthority:ecology.geographyAuthority,
        sourceContractId:ecology.sourceContractId
      });
      instances.push(instance);
      classCounts[type]++;
    }
  }

  return freeze({
    schema:'MIRRORLAND_VEGETATION_V4_UNDERSTORY_POPULATION_v1',
    operationId:V4_UNDERSTORY_CONTRACT.operationId,
    stage:V4_UNDERSTORY_CONTRACT.stage,
    targetBoundary:V4_UNDERSTORY_CONTRACT.targetBoundary,
    canonicalPopulation:true,
    deviceInvariant:true,
    cameraInvariant:true,
    frameId:trees.frameId,
    envelope:freeze({...envelope}),
    grid:GRID,
    instanceCount:instances.length,
    classCounts:freeze(classCounts),
    instances:freeze(instances)
  });
}

export function buildCanonicalUnderstoryPopulation(){
  if(!cachedPopulation)cachedPopulation=createUnderstoryPopulation();
  return cachedPopulation;
}

export function getCanonicalUnderstoryPopulation(_presentationContext=undefined){
  return buildCanonicalUnderstoryPopulation();
}

function compile(gl,type,source){
  const shader=gl.createShader(type);
  gl.shaderSource(shader,source);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(`UNDERSTORY_SHADER:${gl.getShaderInfoLog(shader)}`);
  return shader;
}
function createProgram(gl,vs,fs){
  const program=gl.createProgram();
  gl.attachShader(program,compile(gl,gl.VERTEX_SHADER,vs));
  gl.attachShader(program,compile(gl,gl.FRAGMENT_SHADER,fs));
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(`UNDERSTORY_PROGRAM:${gl.getProgramInfoLog(program)}`);
  return program;
}

const VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aLocal;
layout(location=1) in vec3 aWorld;
layout(location=2) in float aScale;
layout(location=3) in float aYaw;
uniform mat4 uVP;
uniform vec3 uEye;
uniform float uFar;
out float vFade;
out float vHeight;
void main(){
  float c=cos(aYaw),s=sin(aYaw);
  vec3 local=vec3(aLocal.x*c-aLocal.z*s,aLocal.y,aLocal.x*s+aLocal.z*c)*aScale;
  vec3 world=aWorld+local;
  float d=distance(world,uEye);
  vFade=1.0-smoothstep(uFar*.76,uFar,d);
  vHeight=clamp(aLocal.y,0.0,1.0);
  gl_Position=uVP*vec4(world,1.0);
}`;
const FS=`#version 300 es
precision highp float;
in float vFade;
in float vHeight;
uniform vec3 uTint;
out vec4 outColor;
void main(){
  if(vFade<.04)discard;
  vec3 c=uTint*(.76+.18*vHeight+.06*vFade);
  outColor=vec4(c,1.0);
}`;

const GEOMETRY=freeze({
  GRASS_SEDGE:new Float32Array([
    -.07,0,0,.07,0,0,0,.95,0,
    0,0,-.07,0,0,.07,0,.82,0,
    -.18,0,.06,-.05,0,.06,-.10,.68,.03
  ]),
  LOW_SHRUB:new Float32Array([
    -.55,0,0,.55,0,0,0,.72,0,
    0,0,-.50,0,0,.50,0,.68,0,
    -.38,.12,-.28,.38,.12,.28,0,.82,0
  ]),
  SAPLING_YOUNG_GROWTH:new Float32Array([
    -.055,0,0,.055,0,0,.04,.90,0,
    -.42,.66,0,.42,.66,0,0,1.55,0,
    0,.68,-.38,0,.68,.38,0,1.42,0
  ]),
  REED_WET_MARGIN:new Float32Array([
    -.035,0,-.18,.035,0,-.18,0,1.20,-.15,
    -.035,0,0,.035,0,0,0,1.42,.03,
    -.035,0,.18,.035,0,.18,0,1.08,.22
  ]),
  DEAD_SPARSE_GROUND:new Float32Array([
    -.025,0,-.20,.025,0,-.20,0,1.05,-.12,
    -.025,0,.14,.025,0,.14,.12,.78,.08,
    -.22,0,.02,-.16,0,.02,-.05,.58,.04
  ]),
  FOREST_FLOOR_CLUSTER:new Float32Array([
    -.62,0,0,.62,0,0,0,.30,.02,
    0,0,-.58,0,0,.58,.02,.26,0,
    -.46,0,-.32,.46,0,.32,0,.34,0
  ])
});

const TINT=freeze({
  GRASS_SEDGE:freeze([.105,.205,.145]),
  LOW_SHRUB:freeze([.075,.155,.105]),
  SAPLING_YOUNG_GROWTH:freeze([.085,.175,.115]),
  REED_WET_MARGIN:freeze([.125,.205,.145]),
  DEAD_SPARSE_GROUND:freeze([.19,.17,.135]),
  FOREST_FLOOR_CLUSTER:freeze([.065,.125,.085])
});

function eyeVector(eye){
  if(Array.isArray(eye)&&eye.length>=3)return eye;
  if(eye&&Number.isFinite(eye.x)&&Number.isFinite(eye.y)&&Number.isFinite(eye.z))return [eye.x,eye.y,eye.z];
  throw new Error('UNDERSTORY_CAMERA_EYE_REQUIRED');
}

function makePrimitive(gl,geometry,instances){
  const vao=gl.createVertexArray();
  gl.bindVertexArray(vao);
  const local=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,local);
  gl.bufferData(gl.ARRAY_BUFFER,geometry,gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0,3,gl.FLOAT,false,12,0);

  const payload=[];
  for(const item of instances)payload.push(item.world.x,item.world.y,item.world.z,item.scale,item.yaw);
  const instanceBuffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,instanceBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(payload),gl.STATIC_DRAW);
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
  return {vao,vertexCount:geometry.length/3,instanceCount:instances.length};
}

export function createUnderstoryRenderer(gl,{compact=false}={}){
  if(!gl||typeof gl.drawArraysInstanced!=='function')throw new Error('WEBGL2_INSTANCING_REQUIRED');
  const population=getCanonicalUnderstoryPopulation();
  const visible=population.instances.filter(item=>!compact||item.presentationSample<V4_UNDERSTORY_CONTRACT.compactPresentationSampling);
  const groups=Object.fromEntries(UNDERSTORY_CLASSES.map(type=>[type,visible.filter(item=>item.type===type)]));
  const primitives=Object.fromEntries(UNDERSTORY_CLASSES.map(type=>[type,makePrimitive(gl,GEOMETRY[type],groups[type])]));
  const shader=createProgram(gl,VS,FS);
  const uVP=gl.getUniformLocation(shader,'uVP');
  const uEye=gl.getUniformLocation(shader,'uEye');
  const uFar=gl.getUniformLocation(shader,'uFar');
  const uTint=gl.getUniformLocation(shader,'uTint');

  return freeze({
    schema:'MIRRORLAND_VEGETATION_V4_UNDERSTORY_RENDERER_v1',
    canonicalPopulation:population,
    compact:Boolean(compact),
    presentationCount:visible.length,
    draw({vp,eye}){
      if(!vp||vp.length!==16)throw new Error('UNDERSTORY_VP_REQUIRED');
      const e=eyeVector(eye);
      gl.useProgram(shader);
      gl.uniformMatrix4fv(uVP,false,vp);
      gl.uniform3f(uEye,e[0],e[1],e[2]);
      gl.uniform1f(uFar,compact?1800:2400);
      let drawCalls=0,instancesDrawn=0;
      for(const type of UNDERSTORY_CLASSES){
        const primitive=primitives[type];
        if(!primitive.instanceCount)continue;
        gl.uniform3fv(uTint,TINT[type]);
        gl.bindVertexArray(primitive.vao);
        gl.drawArraysInstanced(gl.TRIANGLES,0,primitive.vertexCount,primitive.instanceCount);
        drawCalls++;
        instancesDrawn+=primitive.instanceCount;
      }
      gl.bindVertexArray(null);
      return freeze({drawCalls,instancesDrawn,canonicalPopulationCount:population.instanceCount});
    }
  });
}

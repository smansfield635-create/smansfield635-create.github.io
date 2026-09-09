import {getCanonicalVegetationPopulation} from './vegetation-population.mjs';

const freeze=(value,seen=new WeakSet())=>{
  if(value===null||typeof value!=='object'||Object.isFrozen(value)||seen.has(value))return value;
  seen.add(value);
  for(const nested of Object.values(value))freeze(nested,seen);
  return Object.freeze(value);
};
const finite=value=>typeof value==='number'&&Number.isFinite(value);
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const quantize=(value,digits=6)=>Number(Number(value).toFixed(digits));
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

export const ENVIRONMENT_INTEGRATED_FOREST_V7_REPRESENTATION_CONTRACT=freeze({
  schema:'MIRRORLAND_ENVIRONMENT_INTEGRATED_FOREST_V7_REPRESENTATION_CONTRACT_v1',
  operationId:'MIRRORLAND_V7_ENVIRONMENT_INTEGRATED_FOREST_REPRESENTATION_20260909_001',
  lockGeneration:2031,
  stage:'V7_ENVIRONMENT_INTEGRATED_FOREST_REPRESENTATION',
  candidateBase:'5ef12350d1d6ef0926c9b1c39cfa183380946589',
  canonicalPopulationCount:818,
  canonicalIdentityMutable:false,
  canonicalWorldPositionMutable:false,
  standCellLattice:freeze({rows:5,columns:5}),
  standTopologyInputs:freeze([
    'CANONICAL_TREE_ID',
    'CANONICAL_WORLD_POSITION',
    'LATTICE_POSITION',
    'BIOME_CLASS',
    'MATERIAL_PROFILE',
    'FOREST_WEIGHT',
    'TERRAIN_ELEVATION',
    'TERRAIN_SLOPE',
    'SHORELINE_DISTANCE'
  ]),
  topologyIdentityInputsProhibited:freeze(['DEVICE_CLASS','VIEWPORT_CLASS','REDUCED_MOTION','CAMERA_STATE']),
  renderLodAuthority:'PROJECTED_SCREEN_COVERAGE',
  renderLodHysteresis:freeze({
    nearMid:freeze({leaveNearBelow:64,enterNearAt:78}),
    midFar:freeze({leaveMidBelow:24,enterMidAt:32})
  }),
  farRepresentation:'AGGREGATED_TERRAIN_FOLLOWING_STAND_MASS',
  farPerTreeCanopyBlobAllowed:false,
  midRepresentation:'OVERLAPPING_TREE_CROWNS_WITH_STAND_BRIDGE_MASS',
  environmentSignals:freeze(['FOREST_WEIGHT','TERRAIN_SLOPE','TERRAIN_ELEVATION','SHORELINE_DISTANCE','CAMERA_DEPTH','HORIZON_HAZE','LUNAR_LIGHTING']),
  mapAndCardInterface:freeze({
    export:'getForestStandMetadata',
    schema:'MIRRORLAND_FOREST_STAND_METADATA_v1',
    readOnly:true,
    consumerMutationIncluded:false
  }),
  visualPassRequired:false,
  representationOnly:true
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

export function classifyVegetationCoverageLod(projectedPixels,previousLod=null){
  if(!finite(projectedPixels)||projectedPixels<0)throw new Error('VEGETATION_PROJECTED_COVERAGE_INVALID');
  const {nearMid,midFar}=ENVIRONMENT_INTEGRATED_FOREST_V7_REPRESENTATION_CONTRACT.renderLodHysteresis;
  if(previousLod==='NEAR_FIELD')return projectedPixels<=nearMid.leaveNearBelow?'MID_FIELD':'NEAR_FIELD';
  if(previousLod==='MID_FIELD'){
    if(projectedPixels>=nearMid.enterNearAt)return 'NEAR_FIELD';
    if(projectedPixels<=midFar.leaveMidBelow)return 'FAR_FIELD';
    return 'MID_FIELD';
  }
  if(previousLod==='FAR_FIELD')return projectedPixels>=midFar.enterMidAt?'MID_FIELD':'FAR_FIELD';
  if(projectedPixels>=((nearMid.leaveNearBelow+nearMid.enterNearAt)/2))return 'NEAR_FIELD';
  if(projectedPixels>=((midFar.leaveMidBelow+midFar.enterMidAt)/2))return 'MID_FIELD';
  return 'FAR_FIELD';
}

function previousLodMap(previousFrame){
  const out=new Map();
  for(const item of previousFrame?.representations||[])out.set(item.id,item.lod);
  return out;
}

function previousStandLodMap(previousFrame){
  const out=new Map();
  for(const stand of previousFrame?.stands||[])out.set(stand.id,stand.renderLod);
  return out;
}

function projectedPixelHeight(height,distance,camera){
  const verticalFovRadians=finite(camera?.verticalFovRadians)?camera.verticalFovRadians:52*Math.PI/180;
  const viewportHeight=finite(camera?.viewportHeight)?camera.viewportHeight:900;
  return height/(2*Math.max(distance,1)*Math.tan(verticalFovRadians/2))*viewportHeight;
}

export function buildVegetationRepresentationFrame({camera,previousFrame=null}={}){
  const eye=camera?.eye;
  if(!eye||![eye.x,eye.y,eye.z].every(finite))throw new Error('VEGETATION_CAMERA_EYE_REQUIRED');
  const population=getCanonicalVegetationPopulation();
  const topology=getEnvironmentIntegratedForestTopology();
  const prior=previousLodMap(previousFrame);
  const priorStands=previousStandLodMap(previousFrame);
  const stands=topology.stands.map(stand=>{
    const distance=distance3(stand.canonicalCentroid,eye);
    const projectedCoverage=projectedPixelHeight(stand.meanTreeHeight,distance,camera);
    const renderLod=classifyVegetationCoverageLod(projectedCoverage,priorStands.get(stand.id)||null);
    return freeze({
      ...stand,
      distance,
      projectedCoverage,
      renderLod,
      depthBand:renderLod,
      hazeResponse:quantize(clamp((distance-460)/1990,0,1),6),
      lunarResponse:quantize(clamp(.52+.30*stand.environment.meanElevationNormalized-.16*stand.environment.meanSlopeNormalized,0,1),6)
    });
  });
  const standById=new Map(stands.map(stand=>[stand.id,stand]));
  const representations=population.instances.map(instance=>{
    const distance=distance3(instance.world,eye);
    const lod=classifyVegetationLod(distance,prior.get(instance.id)||null);
    const standId=topology.standIdByTreeId[instance.id];
    const stand=standById.get(standId);
    const style=CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT.representationClasses[stand.renderLod];
    return freeze({
      id:instance.id,
      canonicalWorld:instance.world,
      distance,
      lod,
      renderLod:stand.renderLod,
      standId,
      projectedCoverage:stand.projectedCoverage,
      samplingDensity:style.samplingDensity,
      primitives:style.primitives,
      usesCanopyBlob:false,
      standMassRole:stand.renderLod==='FAR_FIELD'?'AGGREGATED_STAND_MASS':stand.renderLod==='MID_FIELD'?'OVERLAPPING_CROWN_BRIDGE':null,
      occlusionRole:stand.renderLod==='FAR_FIELD'?null:'INTERNAL_CROWN_OCCLUSION'
    });
  });
  return freeze({
    schema:'MIRRORLAND_ENVIRONMENT_INTEGRATED_FOREST_V7_REPRESENTATION_FRAME_v1',
    operationId:ENVIRONMENT_INTEGRATED_FOREST_V7_REPRESENTATION_CONTRACT.operationId,
    stage:ENVIRONMENT_INTEGRATED_FOREST_V7_REPRESENTATION_CONTRACT.stage,
    lodAuthority:CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT.lodAuthority,
    renderLodAuthority:ENVIRONMENT_INTEGRATED_FOREST_V7_REPRESENTATION_CONTRACT.renderLodAuthority,
    hysteresisApplied:true,
    canonicalPopulationCount:population.instanceCount,
    representationCount:representations.length,
    standCount:stands.length,
    topologyDigest:topology.topologyDigest,
    canonicalPopulation:population,
    camera:freeze({eye:freeze({...eye}),look:camera?.look?freeze({...camera.look}):null}),
    stands:freeze(stands),
    mapCardMetadata:topology.mapCardMetadata,
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

const STAND_ROWS=ENVIRONMENT_INTEGRATED_FOREST_V7_REPRESENTATION_CONTRACT.standCellLattice.rows;
const STAND_COLUMNS=ENVIRONMENT_INTEGRATED_FOREST_V7_REPRESENTATION_CONTRACT.standCellLattice.columns;
let cachedForestTopology=null;

function dominantValue(instances,key){
  const counts=new Map();
  for(const instance of instances)counts.set(instance[key],(counts.get(instance[key])||0)+1);
  return [...counts].sort((a,b)=>b[1]-a[1]||String(a[0]).localeCompare(String(b[0])))[0]?.[0]??null;
}

function topologyDigest(stands){
  const source=stands.map(stand=>[
    stand.id,
    stand.memberIds,
    stand.canonicalCentroid,
    stand.environment.dominantBiomeClass,
    stand.environment.dominantMaterialProfile,
    stand.environment.meanForestWeight,
    stand.environment.meanSlope,
    stand.environment.minimumShorelineDistance
  ]);
  return `fnv1a32:${hashString(JSON.stringify(source)).toString(16).padStart(8,'0')}`;
}

function createEnvironmentIntegratedForestTopology(){
  const population=getCanonicalVegetationPopulation();
  const grouped=new Map();
  for(const instance of population.instances){
    const row=Math.floor(instance.lattice.row/STAND_ROWS);
    const column=Math.floor(instance.lattice.column/STAND_COLUMNS);
    const key=`${row}:${column}`;
    if(!grouped.has(key))grouped.set(key,{row,column,members:[]});
    grouped.get(key).members.push(instance);
  }
  const stands=[...grouped.values()]
    .sort((a,b)=>a.row-b.row||a.column-b.column)
    .map(group=>{
      const members=group.members.slice().sort((a,b)=>a.id.localeCompare(b.id));
      const metrics=members.map(treeMetrics);
      const mean=(values)=>values.reduce((sum,value)=>sum+value,0)/values.length;
      const xs=members.map(member=>member.world.x),ys=members.map(member=>member.world.y),zs=members.map(member=>member.world.z);
      const center=freeze({x:quantize(mean(xs)),y:quantize(mean(ys)),z:quantize(mean(zs))});
      const bounds=freeze({
        xMinimum:quantize(Math.min(...xs)),xMaximum:quantize(Math.max(...xs)),
        yMinimum:quantize(Math.min(...ys)),yMaximum:quantize(Math.max(...ys)),
        zMinimum:quantize(Math.min(...zs)),zMaximum:quantize(Math.max(...zs))
      });
      const meanHeight=mean(metrics.map(item=>item.height));
      const meanSpread=mean(metrics.map(item=>item.spread));
      const environment=freeze({
        dominantBiomeClass:dominantValue(members,'biomeClass'),
        dominantMaterialProfile:dominantValue(members,'materialProfile'),
        meanForestWeight:quantize(mean(members.map(item=>item.forestWeight)),6),
        meanSlope:quantize(mean(members.map(item=>item.slope)),6),
        meanSlopeNormalized:quantize(clamp(mean(members.map(item=>item.slope))/.7,0,1),6),
        meanElevation:quantize(mean(ys),6),
        meanElevationNormalized:quantize(clamp((mean(ys)+8)/145,0,1),6),
        minimumShorelineDistance:quantize(Math.min(...members.map(item=>item.shorelineDistance)),6),
        meanShorelineNormalized:quantize(clamp(mean(members.map(item=>item.shorelineDistance))/300,0,1),6)
      });
      const radialExtent=Math.max(...members.map(member=>Math.hypot(member.world.x-center.x,member.world.z-center.z)));
      return freeze({
        id:`stand-r${group.row}-c${group.column}`,
        lattice:freeze({row:group.row,column:group.column,rowSpan:STAND_ROWS,columnSpan:STAND_COLUMNS}),
        canonicalCentroid:center,
        canonicalBounds:bounds,
        radialExtent:quantize(radialExtent,6),
        meanTreeHeight:quantize(meanHeight,6),
        meanCrownSpread:quantize(meanSpread,6),
        meanCrownY:quantize(mean(metrics.map(item=>item.crownY)),6),
        treeCount:members.length,
        memberIds:freeze(members.map(member=>member.id)),
        environment
      });
    });
  const standIdByTreeId={};
  const memberships=[];
  const populationById=new Map(population.instances.map(instance=>[instance.id,instance]));
  for(const stand of stands){
    for(const treeId of stand.memberIds){
      const source=populationById.get(treeId);
      standIdByTreeId[treeId]=stand.id;
      memberships.push(freeze({treeId,standId:stand.id,canonicalWorld:source.world}));
    }
  }
  const digest=topologyDigest(stands);
  const mapCardMetadata=freeze({
    schema:'MIRRORLAND_FOREST_STAND_METADATA_v1',
    version:1,
    topologyDigest:digest,
    canonicalPopulationCount:population.instanceCount,
    standCount:stands.length,
    identityAuthority:'CANONICAL_TREE_POPULATION_READ_ONLY',
    coordinateAuthority:'DERIVED_FROM_CANONICAL_WORLD_POSITIONS',
    consumerMutationIncluded:false,
    stands:freeze(stands.map(stand=>freeze({
      id:stand.id,
      canonicalCentroid:stand.canonicalCentroid,
      canonicalBounds:stand.canonicalBounds,
      treeCount:stand.treeCount,
      memberIds:stand.memberIds,
      environment:stand.environment
    })))
  });
  return freeze({
    schema:'MIRRORLAND_ENVIRONMENT_INTEGRATED_FOREST_TOPOLOGY_v1',
    operationId:ENVIRONMENT_INTEGRATED_FOREST_V7_REPRESENTATION_CONTRACT.operationId,
    topologyDigest:digest,
    canonicalPopulationCount:population.instanceCount,
    standCount:stands.length,
    deviceInvariant:true,
    cameraInvariant:true,
    canonicalIdentityMutable:false,
    canonicalWorldPositionMutable:false,
    stands:freeze(stands),
    standIdByTreeId:freeze(standIdByTreeId),
    memberships:freeze(memberships),
    mapCardMetadata
  });
}

export function getEnvironmentIntegratedForestTopology(){
  if(!cachedForestTopology)cachedForestTopology=createEnvironmentIntegratedForestTopology();
  return cachedForestTopology;
}

export function getForestStandMetadata(){
  return getEnvironmentIntegratedForestTopology().mapCardMetadata;
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
layout(location=2) in vec3 aScale;
layout(location=3) in float aAngle;
layout(location=4) in vec4 aEnvironment;
uniform mat4 uVP;
out vec3 vWorld;
out vec3 vLocal;
out float vScale;
out vec4 vEnvironment;
void main(){
  float c=cos(aAngle),s=sin(aAngle);
  vec3 q=aLocal*aScale;
  vec3 p=vec3(q.x*c-q.z*s,q.y,q.x*s+q.z*c)+aWorld;
  vWorld=p;
  vLocal=aLocal;
  vScale=max(aScale.x,max(aScale.y,aScale.z));
  vEnvironment=aEnvironment;
  gl_Position=uVP*vec4(p,1.0);
}`;
const FS=`#version 300 es
precision highp float;
in vec3 vWorld;
in vec3 vLocal;
in float vScale;
in vec4 vEnvironment;
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
  float forestDensity=clamp(vEnvironment.x,0.0,1.0);
  float terrainSlope=clamp(vEnvironment.y,0.0,1.0);
  float terrainElevation=clamp(vEnvironment.z,0.0,1.0);
  float shorelineDepth=clamp(vEnvironment.w,0.0,1.0);
  float terrainTone=clamp(.18+.46*terrainElevation-.12*terrainSlope+.10*shorelineDepth,0.0,1.0);
  vec3 pigment=mix(uTint,uAccent,clamp(.08+.28*heightSignal+.19*variation+.15*moonFace+.18*forestDensity+.12*terrainTone,0.0,.86));
  float ambient=mix(.47,.56,foliage);
  float illumination=ambient+moonFace*(.18+.34*lunar)+viewRim*(.08+.16*lunar);
  illumination*=mix(.92,1.08,heightSignal);
  illumination*=mix(.89,1.08,terrainElevation)*mix(1.04,.91,terrainSlope);
  illumination*=mix(1.0,.62,occlusion);
  vec3 color=pigment*illumination+uAccent*viewRim*(.035+.075*lunar);
  float distanceToEye=distance(vWorld,uEye);
  float distanceHaze=smoothstep(620.0,2450.0,distanceToEye);
  float basinHaze=(1.0-terrainElevation)*(.04+.08*forestDensity);
  float coastHaze=(1.0-shorelineDepth)*.035;
  float haze=clamp(distanceHaze*(.12+.22*clamp(uHorizonHaze,0.0,1.0))+basinHaze+coastHaze,0.0,.48);
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
  gl.vertexAttribPointer(1,3,gl.FLOAT,false,44,0);
  gl.vertexAttribDivisor(1,1);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2,3,gl.FLOAT,false,44,12);
  gl.vertexAttribDivisor(2,1);
  gl.enableVertexAttribArray(3);
  gl.vertexAttribPointer(3,1,gl.FLOAT,false,44,24);
  gl.vertexAttribDivisor(3,1);
  gl.enableVertexAttribArray(4);
  gl.vertexAttribPointer(4,4,gl.FLOAT,false,44,28);
  gl.vertexAttribDivisor(4,1);
  gl.bindVertexArray(null);
  return {vao,instances,vertexCount:geometry.length/3};
}

export const VEGETATION_INSTANCE_STRIDE=11;
const environmentVector=source=>[
  clamp(Number(source.forestWeight)||0,0,1),
  clamp((Number(source.slope)||0)/.7,0,1),
  clamp(((Number(source.world?.y)||0)+8)/145,0,1),
  clamp((Number(source.shorelineDistance)||0)/300,0,1)
];
const standEnvironmentVector=stand=>[
  stand.environment.meanForestWeight,
  stand.environment.meanSlopeNormalized,
  stand.environment.meanElevationNormalized,
  stand.environment.meanShorelineNormalized
];
const pushInstance=(data,x,y,z,scale,angle=0,environment=[0,0,0,0])=>{
  const scales=Array.isArray(scale)?scale:[scale,scale,scale];
  data.push(x,y,z,scales[0],scales[1],scales[2],angle,environment[0],environment[1],environment[2],environment[3]);
};
const sourceMap=frame=>new Map(frame.canonicalPopulation.instances.map(item=>[item.id,item]));

function buildTreePayload(frame,lod){
  const canonical=sourceMap(frame),data=[];
  for(const item of frame.representations){
    if(item.renderLod!==lod)continue;
    const source=canonical.get(item.id),metrics=treeMetrics(source);
    pushInstance(data,source.world.x+metrics.leanX*.18,source.world.y,source.world.z+metrics.leanZ*.18,metrics.height,metrics.yaw,environmentVector(source));
  }
  return new Float32Array(data);
}

function buildFarStandTrunkPayload(frame){
  const canonical=sourceMap(frame),data=[];
  for(const stand of frame.stands){
    if(stand.renderLod!=='FAR_FIELD')continue;
    const representativeCount=Math.min(3,Math.max(1,Math.ceil(Math.sqrt(stand.treeCount)/1.8)));
    for(let index=0;index<representativeCount;index++){
      const memberIndex=Math.min(stand.memberIds.length-1,Math.floor((index+.5)*stand.memberIds.length/representativeCount));
      const source=canonical.get(stand.memberIds[memberIndex]),metrics=treeMetrics(source);
      pushInstance(data,source.world.x+metrics.leanX*.18,source.world.y,source.world.z+metrics.leanZ*.18,metrics.height,metrics.yaw,environmentVector(source));
    }
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
    if(item.renderLod!=='NEAR_FIELD')continue;
    const source=canonical.get(item.id),metrics=treeMetrics(source);
    const count=resolveNearLeafBudget(source.forestWeight,compact);
    for(let i=0;i<count;i++){
      const p=crownPosition(source,metrics,i,count,700);
      const leafScale=.38+.54*rand(metrics.seed,1300+i);
      pushInstance(data,p.x,p.y,p.z,leafScale,p.angle,environmentVector(source));
    }
  }
  return new Float32Array(data);
}

function buildNearMesoPayload(frame,{compact=false}={}){
  const canonical=sourceMap(frame),data=[];
  for(const item of frame.representations){
    if(item.renderLod!=='NEAR_FIELD')continue;
    const source=canonical.get(item.id),metrics=treeMetrics(source);
    const count=(compact?12:18)+Math.round(metrics.weight*(compact?7:11));
    for(let i=0;i<count;i++){
      const p=crownPosition(source,metrics,i,count,1900);
      const clusterScale=1.65+1.40*metrics.weight+.75*rand(metrics.seed,2400+i);
      pushInstance(data,p.x,p.y,p.z,clusterScale,p.angle,environmentVector(source));
    }
  }
  return new Float32Array(data);
}

export function buildMidSprayPayload(frame,{compact=false}={}){
  const canonical=sourceMap(frame),data=[];
  for(const item of frame.representations){
    if(item.renderLod!=='MID_FIELD')continue;
    const source=canonical.get(item.id),metrics=treeMetrics(source);
    const count=resolveMidClusterBudget(source.forestWeight,compact);
    for(let i=0;i<count;i++){
      const p=crownPosition(source,metrics,i,count,3100);
      const sprayScale=1.34+1.54*metrics.weight+.72*rand(metrics.seed,3600+i);
      pushInstance(data,p.x,p.y,p.z,sprayScale,p.angle,environmentVector(source));
    }
  }
  return new Float32Array(data);
}

function buildInternalPayload(frame,lod){
  const canonical=sourceMap(frame),data=[];
  for(const item of frame.representations){
    if(item.renderLod!==lod)continue;
    const source=canonical.get(item.id),metrics=treeMetrics(source);
    const scale=metrics.spread*(lod==='NEAR_FIELD'?.44:.50);
    pushInstance(data,source.world.x+metrics.leanX*.7,metrics.crownY,source.world.z+metrics.leanZ*.7,scale,metrics.yaw,environmentVector(source));
  }
  return new Float32Array(data);
}

function buildMidStandBridgePayload(frame){
  const data=[];
  for(const stand of frame.stands){
    if(stand.renderLod!=='MID_FIELD'||stand.treeCount<2)continue;
    const width=Math.max(stand.meanCrownSpread*1.8,(stand.canonicalBounds.xMaximum-stand.canonicalBounds.xMinimum)*.30+stand.meanCrownSpread);
    const depth=Math.max(stand.meanCrownSpread*1.8,(stand.canonicalBounds.zMaximum-stand.canonicalBounds.zMinimum)*.30+stand.meanCrownSpread);
    const height=stand.meanTreeHeight*.20;
    const seed=hashString(stand.id);
    pushInstance(data,stand.canonicalCentroid.x,stand.meanCrownY-stand.meanTreeHeight*.035,stand.canonicalCentroid.z,[width,height,depth],TAU*rand(seed,19),standEnvironmentVector(stand));
  }
  return new Float32Array(data);
}

export function buildFarCanopyLayerPayload(frame,layer=0){
  if(layer!==0&&layer!==1)throw new Error('FAR_CANOPY_LAYER_INVALID');
  const data=[];
  for(const stand of frame.stands){
    if(stand.renderLod!=='FAR_FIELD')continue;
    const seed=hashString(stand.id);
    const width=Math.max(stand.meanCrownSpread*2.2,(stand.canonicalBounds.xMaximum-stand.canonicalBounds.xMinimum)*.46+stand.meanCrownSpread*1.25);
    const depth=Math.max(stand.meanCrownSpread*2.2,(stand.canonicalBounds.zMaximum-stand.canonicalBounds.zMinimum)*.46+stand.meanCrownSpread*1.25);
    const height=stand.meanTreeHeight*(layer===0?.30:.22);
    const angle=TAU*rand(seed,layer===0?31:47)+(layer===0?0:1.37);
    const offset=layer===0?0:Math.min(width,depth)*.17;
    pushInstance(
      data,
      stand.canonicalCentroid.x+Math.cos(angle)*offset,
      stand.meanCrownY+(layer===0?0:stand.meanTreeHeight*.055),
      stand.canonicalCentroid.z+Math.sin(angle)*offset,
      [width*(layer===0?1:.72),height,depth*(layer===0?1:.72)],
      angle,
      standEnvironmentVector(stand)
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
    const count=payload.length/VEGETATION_INSTANCE_STRIDE;
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
    schema:'MIRRORLAND_ENVIRONMENT_INTEGRATED_FOREST_V7_RENDERER_v1',
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
      const farTrees=buildFarStandTrunkPayload(frame);
      const nearMeso=buildNearMesoPayload(frame,{compact});
      const nearLeaves=buildNearLeafPayload(frame,{compact});
      const midSprays=buildMidSprayPayload(frame,{compact});
      const nearInternal=buildInternalPayload(frame,'NEAR_FIELD');
      const midInternal=buildInternalPayload(frame,'MID_FIELD');
      const midStandBridges=buildMidStandBridgePayload(frame);
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
      instanceDraws+=drawPrimitive(farCanopy,midStandBridges,[.035,.125,.065],[.125,.315,.165],1.35);
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
          canonicalTreeSources:frame.canonicalPopulationCount,
          environmentIntegratedStands:frame.standCount,
          nearLeafInstances:nearLeaves.length/VEGETATION_INSTANCE_STRIDE,
          nearMesoInstances:nearMeso.length/VEGETATION_INSTANCE_STRIDE,
          midSprayInstances:midSprays.length/VEGETATION_INSTANCE_STRIDE,
          midStandBridgeInstances:midStandBridges.length/VEGETATION_INSTANCE_STRIDE,
          farLeafInstances:0,
          farRepresentativeTrunkInstances:farTrees.length/VEGETATION_INSTANCE_STRIDE,
          farCanopyInstances:farCanopyPrimary.length/VEGETATION_INSTANCE_STRIDE,
          farCanopyLayerInstances:farCanopySecondary.length/VEGETATION_INSTANCE_STRIDE,
          materialContract:LIVE_MATERIAL_V6_REPRESENTATION_CONTRACT.schema,
          representationContract:ENVIRONMENT_INTEGRATED_FOREST_V7_REPRESENTATION_CONTRACT.schema,
          topologyDigest:frame.topologyDigest
        })
      });
    }
  });
}

export function verifyEnvironmentIntegratedForestV7(){
  const checks=[];
  const check=(id,pass,detail=null)=>checks.push(freeze({id,result:pass?'PASS':'FAIL',detail}));
  const population=getCanonicalVegetationPopulation();
  const topology=getEnvironmentIntegratedForestTopology();
  const populationById=new Map(population.instances.map(instance=>[instance.id,instance]));
  const membershipIds=topology.memberships.map(item=>item.treeId);
  const standMemberIds=topology.stands.flatMap(stand=>stand.memberIds);

  check('CANONICAL_POPULATION_COUNT_818',population.instanceCount===818,population.instanceCount);
  check('CANONICAL_TREE_IDS_UNIQUE',new Set(population.instances.map(item=>item.id)).size===818);
  check('MEMBERSHIP_COUNT_818',membershipIds.length===818,membershipIds.length);
  check('ONE_STAND_MEMBERSHIP_PER_TREE',new Set(membershipIds).size===818&&new Set(standMemberIds).size===818&&standMemberIds.length===818);
  check('MEMBERSHIP_IDS_EQUAL_CANONICAL_IDS',membershipIds.every(id=>populationById.has(id))&&population.instances.every(item=>membershipIds.includes(item.id)));
  check('CANONICAL_WORLD_REFERENCES_PRESERVED',topology.memberships.every(item=>item.canonicalWorld===populationById.get(item.treeId)?.world));
  check('TOPOLOGY_CAMERA_DEVICE_INVARIANT',topology===getEnvironmentIntegratedForestTopology()&&topology.cameraInvariant===true&&topology.deviceInvariant===true);
  check('TOPOLOGY_DIGEST_STABLE',topology.topologyDigest===topologyDigest(topology.stands),topology.topologyDigest);
  check('STAND_AGGREGATION_BOUNDED',topology.standCount===74&&topology.standCount<population.instanceCount/4,{stands:topology.standCount,trees:population.instanceCount});
  check('ENVIRONMENT_SIGNALS_BOUND',topology.stands.every(stand=>[
    stand.environment.meanForestWeight,
    stand.environment.meanSlope,
    stand.environment.meanSlopeNormalized,
    stand.environment.meanElevation,
    stand.environment.meanElevationNormalized,
    stand.environment.minimumShorelineDistance,
    stand.environment.meanShorelineNormalized
  ].every(finite)));

  const orbitCamera={eye:{x:0,y:365,z:590},look:{x:70,y:24,z:-660},verticalFovRadians:52*Math.PI/180,viewportHeight:900};
  const frame=buildVegetationRepresentationFrame({camera:orbitCamera});
  const replay=buildVegetationRepresentationFrame({camera:orbitCamera,previousFrame:frame});
  check('REPRESENTATION_COUNT_818',frame.representationCount===818,frame.representationCount);
  check('REPRESENTATION_IDENTITIES_AND_POSITIONS_PRESERVED',frame.representations.every(item=>item.canonicalWorld===populationById.get(item.id)?.world));
  check('PROJECTED_SCREEN_COVERAGE_RENDER_LOD',frame.renderLodAuthority==='PROJECTED_SCREEN_COVERAGE');
  check('STAND_LOD_HYSTERESIS_STABLE',frame.stands.every((stand,index)=>stand.renderLod===replay.stands[index].renderLod));
  check('PER_TREE_FAR_CANOPY_BLOBS_DISABLED',frame.representations.every(item=>item.usesCanopyBlob===false));
  check('COVERAGE_HYSTERESIS_BOUNDARIES',
    classifyVegetationCoverageLod(90)==='NEAR_FIELD'&&
    classifyVegetationCoverageLod(70,'NEAR_FIELD')==='NEAR_FIELD'&&
    classifyVegetationCoverageLod(60,'NEAR_FIELD')==='MID_FIELD'&&
    classifyVegetationCoverageLod(26,'MID_FIELD')==='MID_FIELD'&&
    classifyVegetationCoverageLod(20,'MID_FIELD')==='FAR_FIELD'&&
    classifyVegetationCoverageLod(36,'FAR_FIELD')==='MID_FIELD'
  );

  const farFrame=buildVegetationRepresentationFrame({camera:{eye:{x:0,y:900,z:3600},look:{x:0,y:20,z:-600},verticalFovRadians:52*Math.PI/180,viewportHeight:900}});
  const farStands=farFrame.stands.filter(stand=>stand.renderLod==='FAR_FIELD');
  const farSources=farStands.reduce((sum,stand)=>sum+stand.treeCount,0);
  const farPrimary=buildFarCanopyLayerPayload(farFrame,0).length/VEGETATION_INSTANCE_STRIDE;
  const farSecondary=buildFarCanopyLayerPayload(farFrame,1).length/VEGETATION_INSTANCE_STRIDE;
  check('ALL_818_SOURCES_RETAINED_BY_FAR_STANDS',farSources===818,farSources);
  check('FAR_MASS_ONE_PER_STAND_PER_LAYER',farPrimary===farStands.length&&farSecondary===farStands.length,{farPrimary,farSecondary,farStands:farStands.length});
  check('FAR_SPECKLE_COUNT_COLLAPSED',farPrimary===74&&farPrimary<population.instanceCount/4,{farMasses:farPrimary,treeSources:population.instanceCount});

  const metadata=getForestStandMetadata();
  check('MAP_CARD_METADATA_READ_ONLY',Object.isFrozen(metadata)&&Object.isFrozen(metadata.stands)&&metadata.consumerMutationIncluded===false);
  check('MAP_CARD_METADATA_COMPLETE',metadata.canonicalPopulationCount===818&&metadata.standCount===74&&metadata.stands.every(stand=>stand.memberIds.length===stand.treeCount));
  check('MAP_CARD_METADATA_TOPOLOGY_BOUND',metadata.topologyDigest===topology.topologyDigest&&frame.mapCardMetadata===metadata);

  const result=checks.every(item=>item.result==='PASS')?'PASS':'FAIL';
  return freeze({
    schema:'MIRRORLAND_ENVIRONMENT_INTEGRATED_FOREST_V7_MECHANICAL_RECEIPT_v1',
    operationId:ENVIRONMENT_INTEGRATED_FOREST_V7_REPRESENTATION_CONTRACT.operationId,
    lockGeneration:ENVIRONMENT_INTEGRATED_FOREST_V7_REPRESENTATION_CONTRACT.lockGeneration,
    result,
    visualPass:'SKIPPED_BY_OWNER',
    canonicalPopulationCount:population.instanceCount,
    standCount:topology.standCount,
    topologyDigest:topology.topologyDigest,
    farStandMassesPerLayer:farPrimary,
    checks:freeze(checks)
  });
}

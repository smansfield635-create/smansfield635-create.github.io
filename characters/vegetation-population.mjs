import {GRATITUDE_DEVELOPMENT_FRAME} from './gratitude-geography.adapter.mjs';
import {
  VEGETATION_ECOLOGY_AUTHORITY,
  sampleCanonicalVegetationEcology
} from './vegetation-ecology.mjs';

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

const GRID=freeze({
  columns:60,
  rows:44,
  insetFraction:.025,
  jitterFraction:.34,
  minimumForestWeight:.08,
  minimumShorelineDistance:12
});

export const CANONICAL_VEGETATION_POPULATION_CONTRACT=freeze({
  schema:'MIRRORLAND_CANONICAL_VEGETATION_POPULATION_CONTRACT_v1',
  operationId:'MIRRORLAND_CANONICAL_ECOLOGY_CAMERA_TRUE_VEGETATION_20260905_003',
  stage:'V2_DEVICE_INVARIANT_CANONICAL_POPULATION',
  frameAuthority:'characters/gratitude-geography.adapter.mjs#GRATITUDE_DEVELOPMENT_FRAME',
  frameId:GRATITUDE_DEVELOPMENT_FRAME.frameId,
  ecologyAuthority:VEGETATION_ECOLOGY_AUTHORITY.schema,
  geographyDeterminesExistence:true,
  rendererDeterminesRepresentation:true,
  populationIdentityDeviceInvariant:true,
  populationIdentityCameraInvariant:true,
  runtimeIdentityInputs:freeze([]),
  prohibitedIdentityInputs:freeze(['DEVICE_CLASS','VIEWPORT_CLASS','CAMERA_STATE','REDUCED_MOTION','LOD']),
  representationDeferredTo:'V3_CAMERA_TRUE_INSTANCED_LOD',
  grid:GRID,
  fixedTargetCount:false
});

let cachedPopulation=null;

function createCanonicalPopulation(){
  const envelope=GRATITUDE_DEVELOPMENT_FRAME.envelope;
  const width=envelope.xMaximum-envelope.xMinimum;
  const depth=envelope.zMaximum-envelope.zMinimum;
  const instances=[];
  const insetX=width*GRID.insetFraction;
  const insetZ=depth*GRID.insetFraction;
  const usableWidth=width-insetX*2;
  const usableDepth=depth-insetZ*2;

  for(let row=0;row<GRID.rows;row++){
    for(let column=0;column<GRID.columns;column++){
      const seed=hash32(Math.imul(row+1,73856093)^Math.imul(column+1,19349663)^0x5a17c3d9);
      const jitterX=(rand(seed,1)-.5)*2*GRID.jitterFraction;
      const jitterZ=(rand(seed,2)-.5)*2*GRID.jitterFraction;
      const u=clamp((column+.5+jitterX)/GRID.columns,0,1);
      const v=clamp((row+.5+jitterZ)/GRID.rows,0,1);
      const worldX=envelope.xMinimum+insetX+u*usableWidth;
      const worldZ=envelope.zMinimum+insetZ+v*usableDepth;
      const ecology=sampleCanonicalVegetationEcology(worldX,worldZ);
      if(ecology?.valid!==true)continue;
      const forestWeight=Number(ecology.biome?.forestWeight)||0;
      if(forestWeight<GRID.minimumForestWeight)continue;
      if(ecology.hydrology?.drainageClass!=='LAND')continue;
      if(ecology.shorelineDistance<GRID.minimumShorelineDistance)continue;

      const occupancyProbability=clamp(.12+.88*forestWeight,0,.96);
      if(rand(seed,3)>occupancyProbability)continue;

      instances.push(freeze({
        id:`veg-r${row}-c${column}`,
        lattice:freeze({row,column,seed}),
        world:freeze({
          x:ecology.world.x,
          y:quantize(ecology.world.y),
          z:ecology.world.z
        }),
        forestWeight:quantize(forestWeight,12),
        biomeClass:ecology.biome.class,
        drainageClass:ecology.hydrology.drainageClass,
        materialProfile:ecology.materialProfile,
        slope:quantize(ecology.slope,12),
        slopeClass:ecology.slopeClass,
        shorelineDistance:quantize(ecology.shorelineDistance,6),
        geographyAuthority:ecology.geographyAuthority,
        sourceContractId:ecology.sourceContractId
      }));
    }
  }

  return freeze({
    schema:'MIRRORLAND_CANONICAL_VEGETATION_POPULATION_v1',
    operationId:CANONICAL_VEGETATION_POPULATION_CONTRACT.operationId,
    stage:CANONICAL_VEGETATION_POPULATION_CONTRACT.stage,
    frameId:GRATITUDE_DEVELOPMENT_FRAME.frameId,
    envelope:freeze({...envelope}),
    ecologyAuthority:VEGETATION_ECOLOGY_AUTHORITY.schema,
    canonicalPopulation:true,
    deviceInvariant:true,
    cameraInvariant:true,
    representationAssigned:false,
    lodAssigned:false,
    fixedTargetCount:false,
    instanceCount:instances.length,
    instances:freeze(instances)
  });
}

export function buildCanonicalVegetationPopulation(){
  if(!cachedPopulation)cachedPopulation=createCanonicalPopulation();
  return cachedPopulation;
}

export function getCanonicalVegetationPopulation(_presentationContext=undefined){
  return buildCanonicalVegetationPopulation();
}

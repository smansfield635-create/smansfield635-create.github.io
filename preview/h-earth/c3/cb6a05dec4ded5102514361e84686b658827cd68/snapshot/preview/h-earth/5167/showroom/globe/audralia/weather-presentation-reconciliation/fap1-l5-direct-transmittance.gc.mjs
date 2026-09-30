import {rayWeatherVolumeInterval} from './fap1-spatial-lod.gb.mjs';
import {sampleW5LocalDensity} from './fap1-w5-local-density.gb.mjs';

const freeze=value=>Object.freeze(value);
const length=v=>Math.hypot(...v);
const norm=v=>{const l=length(v)||1;return v.map(x=>x/l);};
const add=(a,b,s=1)=>a.map((v,i)=>v+b[i]*s);

export const FAP1_L5_DIRECT_TRANSMITTANCE_SCHEMA='FAP1_L5_DIRECT_SUN_TRANSMITTANCE_v1';
export const L5_EXTINCTION=0.018;
export const L5_QUALITY=freeze({
  INTERACTIVE:freeze({lightSteps:3}),
  REST:freeze({lightSteps:5}),
  CAPTURE:freeze({lightSteps:8})
});

export function sampleL5DirectSunTransmittance(object,worldPoint,sunDirection,{quality='REST',extinction=L5_EXTINCTION}={}){
  if(!object||object.authority!=='FAP1_DESCRIPTOR_ONLY')throw new Error('FAP1_L5_OBJECT_AUTHORITY_REQUIRED');
  const policy=L5_QUALITY[quality]??L5_QUALITY.REST;
  const direction=norm(sunDirection);
  const origin=add(worldPoint,direction,0.05);
  const interval=rayWeatherVolumeInterval(origin,direction,object);
  if(!interval)return freeze({schema:FAP1_L5_DIRECT_TRANSMITTANCE_SCHEMA,weatherId:object.ID_i,quality,lightSteps:policy.lightSteps,opticalDepth:0,transmittance:1,sampledLength:0,densitySamples:freeze([]),lightingModel:'DIRECT_SUN_TRANSMITTANCE_ONLY',multipleScattering:false,groundContribution:false});

  const count=policy.lightSteps,dt=interval.length/count;
  let opticalDepth=0;
  const densitySamples=[];
  for(let i=0;i<count;i++){
    const t=interval.enter+(i+.5)*dt;
    const density=sampleW5LocalDensity(object,add(origin,direction,t));
    densitySamples.push(density);
    opticalDepth+=density*dt*extinction;
  }
  const transmittance=Math.exp(-opticalDepth);
  return freeze({
    schema:FAP1_L5_DIRECT_TRANSMITTANCE_SCHEMA,
    weatherId:object.ID_i,
    persistentWeatherIdentity:true,
    quality,
    lightSteps:count,
    opticalDepth,
    transmittance,
    sampledLength:interval.length,
    densitySamples:freeze(densitySamples),
    lightingModel:'DIRECT_SUN_TRANSMITTANCE_ONLY',
    densityAuthority:'W5_FAP1_REFINEMENT',
    multipleScattering:false,
    skyAmbient:false,
    groundContribution:false,
    macroDensityMutation:false,
    morphologyMutation:false
  });
}

export function verifyL5DirectSunTransmittance(receipt){
  const failures=[];
  if(receipt?.weatherId==null)failures.push('WEATHER_ID_MISSING');
  if(receipt?.persistentWeatherIdentity!==true)failures.push('WEATHER_IDENTITY_NOT_PERSISTENT');
  if(!(receipt?.transmittance>=0&&receipt?.transmittance<=1))failures.push('TRANSMITTANCE_OUT_OF_RANGE');
  if(!(receipt?.opticalDepth>=0))failures.push('OPTICAL_DEPTH_INVALID');
  if(!Number.isInteger(receipt?.lightSteps)||receipt.lightSteps<1||receipt.lightSteps>8)failures.push('LIGHT_STEP_BUDGET_INVALID');
  if(receipt?.lightingModel!=='DIRECT_SUN_TRANSMITTANCE_ONLY')failures.push('LIGHTING_SCOPE_DRIFT');
  if(receipt?.multipleScattering!==false||receipt?.groundContribution!==false)failures.push('L5_SCOPE_EXPANSION_FORBIDDEN');
  if(receipt?.macroDensityMutation!==false||receipt?.morphologyMutation!==false)failures.push('DENSITY_OR_MORPHOLOGY_MUTATION_FORBIDDEN');
  return freeze({schema:'FAP1_L5_DIRECT_TRANSMITTANCE_INVARIANTS_v1',pass:failures.length===0,failures:freeze(failures),weatherId:receipt?.weatherId??null});
}

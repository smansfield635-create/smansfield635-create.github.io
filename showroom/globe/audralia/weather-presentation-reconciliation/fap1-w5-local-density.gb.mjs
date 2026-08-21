import {
  localCoordinates,
  weatherBrickAddress
} from './fap1-spatial-lod.gb.mjs';

const freeze=value=>Object.freeze(value);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a||1),0,1);return t*t*(3-2*t);};
const mix=(a,b,t)=>a+(b-a)*t;

export const FAP1_W5_LOCAL_DENSITY_SCHEMA='FAP1_W5_LOCAL_DENSITY_REFINEMENT_v1';
export const W5_GENERATION=1;
export const W5_BRICK_RESOLUTION=12;
export const W5_MAX_ACTIVE_OBJECTS=1;
export const W5_EMPTY_THRESHOLD=0.0025;

function hash32(value){
  let h=2166136261;
  for(const ch of String(value)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}
  return h>>>0;
}
function hashUnit(x,y,z,seed){
  let h=(hash32(seed)^Math.imul((x|0)+4099,374761393)^Math.imul((y|0)+8191,668265263)^Math.imul((z|0)+12289,2246822519))>>>0;
  h^=h>>>13;h=Math.imul(h,1274126177);h^=h>>>16;
  return (h>>>0)/4294967295;
}
function valueNoise3(x,y,z,seed){
  const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z),fx=x-ix,fy=y-iy,fz=z-iz;
  const sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy),sz=fz*fz*(3-2*fz);
  const n=(dx,dy,dz)=>hashUnit(ix+dx,iy+dy,iz+dz,seed);
  const x00=mix(n(0,0,0),n(1,0,0),sx),x10=mix(n(0,1,0),n(1,1,0),sx);
  const x01=mix(n(0,0,1),n(1,0,1),sx),x11=mix(n(0,1,1),n(1,1,1),sx);
  return mix(mix(x00,x10,sy),mix(x01,x11,sy),sz);
}
function fbm3(x,y,z,seed){
  let sum=0,amp=.58,norm=0,scale=1;
  for(let octave=0;octave<4;octave++){
    sum+=valueNoise3(x*scale,y*scale,z*scale,seed+octave*1013)*amp;
    norm+=amp;scale*=2.03;amp*=.48;
  }
  return sum/(norm||1);
}

function familyShape(genus,q,seed){
  const x=q[0],y=q[1],z=q[2],radial=Math.hypot(x,z),vertical=clamp((y+1)*.5,0,1);
  const broad=fbm3(x*1.8+3.1,y*1.6-1.7,z*1.8+2.4,seed);
  const erosion=fbm3(x*5.4-7.2,y*4.8+4.1,z*5.2-2.6,seed+97);
  const cavity=fbm3(x*2.7+11.0,y*3.1-5.0,z*2.4+8.0,seed+211);
  let envelope=1-clamp(x*x+y*y+z*z,0,1);
  envelope*=envelope;

  if(genus==='Cb'){
    const taper=mix(.92,.42,smooth(.05,.78,vertical));
    const tower=1-smooth(taper*.62,taper*1.08,radial);
    const anvilBand=smooth(.68,.78,vertical)*(1-smooth(.94,1,vertical));
    const anvil=(1-smooth(.58,1.28,radial))*anvilBand;
    envelope*=Math.max(tower,anvil*.78);
  }else if(genus==='Cu'){
    const taper=mix(1,.56,smooth(.08,.94,vertical));
    envelope*=1-smooth(taper*.65,taper*1.08,radial);
  }else if(genus==='Cs'||genus==='As'){
    envelope*=.72+.28*(1-Math.abs(y));
  }

  const mass=smooth(.31,.66,broad*.70+cavity*.30);
  const carved=mass*(.54+.46*smooth(.28,.72,erosion));
  const pocket=1-smooth(.38,.62,cavity);
  return clamp(envelope*carved*(1-.52*pocket),0,1);
}

export function sampleW5LocalDensity(object,worldPoint){
  if(!object||object.authority!=='FAP1_DESCRIPTOR_ONLY')throw new Error('FAP1_W5_OBJECT_AUTHORITY_REQUIRED');
  const q=localCoordinates(worldPoint,object);
  if(q[0]*q[0]+q[1]*q[1]+q[2]*q[2]>=1)return 0;
  const seed=Math.floor((object.W_i.seed??0)*100000)+hash32(object.ID_i)%100000;
  const shape=familyShape(object.W_i.genus,q,seed);
  const density=clamp((object.W_i.density??0)*(object.W_i.support??1)*shape,0,1.8);
  return density<W5_EMPTY_THRESHOLD?0:density;
}

export function chooseW5ActiveObject(spatialState){
  const candidates=(spatialState?.objects??[])
    .filter(entry=>entry.localPromoted===true&&entry.Q_i===true)
    .sort((a,b)=>a.distanceToVolume-b.distanceToVolume||a.object.ID_i.localeCompare(b.object.ID_i));
  return candidates.length?candidates[0]:null;
}

export function buildW5DensityBrick(object,{bx=0,by=0,bz=0,generation=W5_GENERATION,resolution=W5_BRICK_RESOLUTION}={}){
  if(!Number.isInteger(resolution)||resolution<4||resolution>32)throw new Error('FAP1_W5_BRICK_RESOLUTION_INVALID');
  const address=weatherBrickAddress(object,bx,by,bz,generation);
  const values=new Float32Array(resolution*resolution*resolution);
  const span=2/resolution;
  let occupied=0,maxDensity=0,sumDensity=0,index=0;
  for(let z=0;z<resolution;z++)for(let y=0;y<resolution;y++)for(let x=0;x<resolution;x++){
    const qx=-1+(x+.5)*span,qy=-1+(y+.5)*span,qz=-1+(z+.5)*span;
    const r=object.V_i.radii,center=object.V_i.center;
    const point=[
      center[0]+object.V_i.axisU[0]*qx*r[0]+object.V_i.axisUp[0]*qy*r[1]+object.V_i.axisV[0]*qz*r[2],
      center[1]+object.V_i.axisU[1]*qx*r[0]+object.V_i.axisUp[1]*qy*r[1]+object.V_i.axisV[1]*qz*r[2],
      center[2]+object.V_i.axisU[2]*qx*r[0]+object.V_i.axisUp[2]*qy*r[1]+object.V_i.axisV[2]*qz*r[2]
    ];
    const density=sampleW5LocalDensity(object,point);
    values[index++]=density;
    if(density>0){occupied++;sumDensity+=density;maxDensity=Math.max(maxDensity,density);}
  }
  return freeze({
    schema:FAP1_W5_LOCAL_DENSITY_SCHEMA,
    address,
    weatherId:object.ID_i,
    generation,
    resolution,
    sampleCount:values.length,
    occupiedSampleCount:occupied,
    occupancyFraction:occupied/values.length,
    meanOccupiedDensity:occupied?sumDensity/occupied:0,
    maxDensity,
    values,
    authority:'FAP1_DESCRIPTOR_REFINEMENT_ONLY',
    cameraCentered:false,
    persistentWeatherIdentity:true,
    lightingApplied:false,
    visibleRendererMutation:false
  });
}

export function createW5RefinementState(spatialState){
  const active=chooseW5ActiveObject(spatialState);
  if(!active)return freeze({schema:FAP1_W5_LOCAL_DENSITY_SCHEMA,active:false,activeWeatherId:null,brick:null,maxActiveObjects:W5_MAX_ACTIVE_OBJECTS,visibleRendererMutation:false,l5LightingActive:false});
  const brick=buildW5DensityBrick(active.object);
  return freeze({
    schema:FAP1_W5_LOCAL_DENSITY_SCHEMA,
    active:true,
    activeWeatherId:active.object.ID_i,
    distanceToVolume:active.distanceToVolume,
    inside:active.inside,
    alpha:active.alpha,
    brick,
    maxActiveObjects:W5_MAX_ACTIVE_OBJECTS,
    visibleRendererMutation:false,
    l5LightingActive:false
  });
}

export function verifyW5RefinementState(state){
  const failures=[];
  if(state?.active){
    if(!state.activeWeatherId)failures.push('ACTIVE_WEATHER_ID_MISSING');
    if(state.brick?.weatherId!==state.activeWeatherId)failures.push('BRICK_WEATHER_ID_MISMATCH');
    if(state.brick?.cameraCentered!==false)failures.push('CAMERA_CENTERED_LOCAL_VOLUME_FORBIDDEN');
    if(state.brick?.persistentWeatherIdentity!==true)failures.push('PERSISTENT_WEATHER_IDENTITY_MISSING');
    if(!(state.brick?.occupancyFraction>=0&&state.brick?.occupancyFraction<=1))failures.push('INVALID_OCCUPANCY_FRACTION');
  }
  if(state?.visibleRendererMutation!==false)failures.push('VISIBLE_RENDERER_MUTATION_FORBIDDEN_AT_GB_W5_DENSITY_STAGE');
  if(state?.l5LightingActive!==false)failures.push('L5_PREMATURE_ACTIVATION');
  return freeze({schema:'FAP1_W5_LOCAL_DENSITY_INVARIANTS_v1',pass:failures.length===0,failures:freeze(failures),activeWeatherId:state?.activeWeatherId??null});
}

import {
  localCoordinates,
  weatherBrickAddress
} from './fap1-spatial-lod.gb.mjs';

const freeze=value=>Object.freeze(value);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a||1),0,1);return t*t*(3-2*t);};
const mix=(a,b,t)=>a+(b-a)*t;
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];

export const FAP1_W5_LOCAL_DENSITY_SCHEMA='FAP1_W5_LOCAL_DENSITY_REFINEMENT_v6_MESO_BODY_DIFFERENTIATION';
export const W5_GENERATION=6;
export const W5_BRICK_RESOLUTION=16;
export const W5_MAX_ACTIVE_OBJECTS=1;
export const W5_EMPTY_THRESHOLD=0.0025;

function hash32(value){let h=2166136261;for(const ch of String(value)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function hashUnit(x,y,z,seed){let h=(hash32(seed)^Math.imul((x|0)+4099,374761393)^Math.imul((y|0)+8191,668265263)^Math.imul((z|0)+12289,2246822519))>>>0;h^=h>>>13;h=Math.imul(h,1274126177);h^=h>>>16;return(h>>>0)/4294967295;}
function valueNoise3(x,y,z,seed){const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z),fx=x-ix,fy=y-iy,fz=z-iz,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy),sz=fz*fz*(3-2*fz),n=(dx,dy,dz)=>hashUnit(ix+dx,iy+dy,iz+dz,seed),x00=mix(n(0,0,0),n(1,0,0),sx),x10=mix(n(0,1,0),n(1,1,0),sx),x01=mix(n(0,0,1),n(1,0,1),sx),x11=mix(n(0,1,1),n(1,1,1),sx);return mix(mix(x00,x10,sy),mix(x01,x11,sy),sz);}
function fbm3(x,y,z,seed){let sum=0,amp=.58,norm=0,scale=1;for(let octave=0;octave<4;octave++){sum+=valueNoise3(x*scale,y*scale,z*scale,seed+octave*1013)*amp;norm+=amp;scale*=2.03;amp*=.48;}return sum/(norm||1);}
function hash31(x,y,z){let px=x*.1031-Math.floor(x*.1031),py=y*.1031-Math.floor(y*.1031),pz=z*.1031-Math.floor(z*.1031);const d=px*(py+33.33)+py*(pz+33.33)+pz*(px+33.33);px+=d;py+=d;pz+=d;const value=(px+py)*pz;return value-Math.floor(value);}
function macroNoise3(x,y,z){const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z),fx=x-ix,fy=y-iy,fz=z-iz,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy),sz=fz*fz*(3-2*fz),n=(dx,dy,dz)=>hash31(ix+dx,iy+dy,iz+dz),a=mix(n(0,0,0),n(1,0,0),sx),b=mix(n(0,1,0),n(1,1,0),sx),c=mix(n(0,0,1),n(1,0,1),sx),d=mix(n(0,1,1),n(1,1,1),sx);return mix(mix(a,b,sy),mix(c,d,sy),sz);}
function macroFbm(x,y,z){let value=macroNoise3(x,y,z)*.62;value+=macroNoise3(x*2.07+5.3,y*2.07+1.7,z*2.07+9.2)*(.62*.48);return value;}
function verticalEnvelope(z){return smooth(0,.075,z)*(1-smooth(.86,1,z));}
function genusCode(genus){return({Ci:0,Cc:1,Cs:2,Ac:3,As:4,Ns:5,Sc:6,St:7,Cu:8,Cb:9})[genus]??8;}

function macroCoordinates(worldPoint,object){const d=[worldPoint[0]-object.V_i.center[0],worldPoint[1]-object.V_i.center[1],worldPoint[2]-object.V_i.center[2]],r=object.F_i?.macroRadii;if(!Array.isArray(r)||r.length!==3)throw new Error('FAP1_W5_MACRO_RADII_REQUIRED');return[dot(d,object.V_i.axisU)/r[0],dot(d,object.V_i.axisUp)/r[1],dot(d,object.V_i.axisV)/r[2]];}
function macroAnchorShape(object,q){
  const x=q[0],vertical=q[1],y=q[2],z=clamp((vertical+1)*.5,0,1),r=Math.hypot(x,y),macroRadii=object.F_i.macroRadii,fieldScale=clamp(Math.sqrt(Math.max(macroRadii[0]*macroRadii[2],1))/260,1,9),qx=x*fieldScale,qy=y*fieldScale,seed=object.W_i.seed??0,n=macroFbm(qx*2.15+seed*19,qy*2.15,z*3.2),v=verticalEnvelope(z),g=genusCode(object.W_i.genus);let shape=0;
  if(g<2.5){const veil=.5+.5*Math.sin(qx*1.55+qy*.72+seed*7+n*2.2);shape=(1-smooth(.70,1.08,r))*v*smooth(.32,.63,n+.12*veil)*.44;}
  else if(g<4.5){const cells=.5+.5*Math.sin(qx*2.7+n*2.4)*Math.cos(qy*2.3);shape=(1-smooth(.70,1.08,r))*v*smooth(.39,.66,n+.18*cells)*.60;}
  else if(g<7.5){const sheet=.5+.5*Math.sin(qx*1.35+qy*.47+seed*5);shape=(1-smooth(.70,1.08,r))*v*smooth(.35,.62,n+.10*sheet)*.68;}
  else if(g<8.5){const taper=mix(1,.48,smooth(.08,.95,z)),cell=.5+.5*Math.sin(qx*2.6+seed*9)*Math.cos(qy*2.35);shape=(1-smooth(taper*.65,taper*1.08,r))*v*smooth(.44,.66,n+.22*cell)*.88;}
  else{const taper=mix(.90,.39,smooth(.05,.72,z)),cell=.5+.5*Math.sin(qx*2.2+seed*7)*Math.cos(qy*2),tower=(1-smooth(taper*.62,taper*1.10,r))*v*smooth(.39,.62,n+.20*cell),anvilBand=smooth(.62,.76,z)*(1-smooth(.95,1,z)),anvil=(1-smooth(.48,1.32,r))*anvilBand*smooth(.34,.59,n+.14*cell)*.76;shape=Math.max(tower,anvil);if(object.weatherClass==='CYCLONE'){const eye=1-smooth(.10,.19,r),wall=smooth(.12,.22,r)*(1-smooth(.31,.46,r));shape=Math.max(shape,wall*.64*v);shape*=1-eye*.985;}}
  return clamp(shape,0,1.8);
}

function ellipsoidVoid(q,center,radii){
  const x=(q[0]-center[0])/radii[0],y=(q[1]-center[1])/radii[1],z=(q[2]-center[2])/radii[2],d=Math.hypot(x,y,z);
  return 1-smooth(.62,1.05,d);
}
function ellipsoidLobe(q,center,radii){
  const x=(q[0]-center[0])/radii[0],y=(q[1]-center[1])/radii[1],z=(q[2]-center[2])/radii[2],d=Math.hypot(x,y,z);
  return 1-smooth(.72,1.08,d);
}

function coherentCavityMask(object,q){
  const seed=hash32(object.ID_i)+Math.floor((object.W_i.seed??0)*100000);
  const u=(n)=>hashUnit(n,n*3+7,n*5+11,seed+n*101);
  const primary=[(u(1)-.5)*.20,(u(2)-.5)*.28,(u(3)-.5)*.22];
  const secondary=[(u(4)-.5)*.62,(u(5)-.5)*.42,(u(6)-.5)*.62];
  const deep=object.weatherClass==='DEEP_CONVECTION'||object.weatherClass==='CYCLONE';
  const pR=deep?[.34,.42,.36]:[.30,.34,.32],sR=deep?[.26,.32,.28]:[.22,.27,.24];
  const p=ellipsoidVoid(q,primary,pR),s=ellipsoidVoid(q,secondary,sR);
  return clamp(Math.max(p,s*.86),0,1);
}

function mesoscaleBodyMask(object,q){
  const seed=hash32(object.ID_i)+Math.floor((object.W_i.seed??0)*100000);
  const u=n=>hashUnit(n*7+3,n*11+5,n*13+9,seed+n*313);
  const jitter=(n,scale)=>(u(n)-.5)*scale;
  const deep=object.weatherClass==='DEEP_CONVECTION'||object.weatherClass==='CYCLONE';
  const low=object.weatherClass==='LOW_CUMULIFORM';
  if(deep){
    const a=ellipsoidLobe(q,[-.24+jitter(1,.10),-.05+jitter(2,.10),-.12+jitter(3,.12)],[.44,.72,.42]);
    const b=ellipsoidLobe(q,[.22+jitter(4,.12),.10+jitter(5,.12),.12+jitter(6,.12)],[.38,.62,.40]);
    const c=ellipsoidLobe(q,[jitter(7,.12),.38+jitter(8,.10),-.02+jitter(9,.14)],[.52,.36,.56]);
    return clamp(Math.max(a,b*.95,c*.82),0,1);
  }
  if(low){
    const a=ellipsoidLobe(q,[-.32+jitter(1,.12),-.10+jitter(2,.10),-.18+jitter(3,.12)],[.38,.44,.36]);
    const b=ellipsoidLobe(q,[.28+jitter(4,.12),-.02+jitter(5,.10),.10+jitter(6,.12)],[.34,.48,.38]);
    const c=ellipsoidLobe(q,[jitter(7,.14),.18+jitter(8,.10),.34+jitter(9,.12)],[.40,.42,.32]);
    const d=ellipsoidLobe(q,[.04+jitter(10,.14),-.18+jitter(11,.10),-.36+jitter(12,.12)],[.36,.38,.30]);
    return clamp(Math.max(a,b,c*.90,d*.84),0,1);
  }
  const a=ellipsoidLobe(q,[-.26+jitter(1,.14),jitter(2,.08),-.10+jitter(3,.14)],[.58,.42,.62]);
  const b=ellipsoidLobe(q,[.28+jitter(4,.14),jitter(5,.08),.18+jitter(6,.14)],[.54,.40,.58]);
  return clamp(Math.max(a,b*.92),0,1);
}

function localRefinementFactor(object,q){
  const seed=Math.floor((object.W_i.seed??0)*100000)+hash32(object.ID_i)%100000;
  const fine=fbm3(q[0]*7.8+4.3,q[1]*8.6-2.1,q[2]*7.4+6.4,seed+401);
  const lobe=fbm3(q[0]*3.3+1.7,q[1]*3.8-4.6,q[2]*3.1+2.9,seed+557);
  const cavity=fbm3(q[0]*2.15-8.2,q[1]*2.4+5.7,q[2]*2.05-1.9,seed+733);
  const signedFine=(fine-.5)*2,signedLobe=(lobe-.5)*2;
  const stochasticCavity=smooth(.64,.80,cavity);
  const coherentCavity=coherentCavityMask(object,q);
  const body=mesoscaleBodyMask(object,q);
  const bodyFactor=.72+.56*body;
  const radius=Math.hypot(q[0],q[1],q[2]);
  const boundaryLock=smooth(.64,.90,radius);
  let interior=clamp(bodyFactor+signedLobe*.28+signedFine*.17-stochasticCavity*.92,0,1.72);
  interior*=1-coherentCavity*.99;
  return mix(interior,1,boundaryLock);
}

export function sampleW5LocalDensity(object,worldPoint){
  if(!object||object.authority!=='FAP1_DESCRIPTOR_ONLY')throw new Error('FAP1_W5_OBJECT_AUTHORITY_REQUIRED');
  const localQ=localCoordinates(worldPoint,object);if(localQ[0]*localQ[0]+localQ[1]*localQ[1]+localQ[2]*localQ[2]>=1)return 0;
  const macroShape=macroAnchorShape(object,macroCoordinates(worldPoint,object));if(macroShape<=0)return 0;
  const refinement=localRefinementFactor(object,localQ),density=clamp((object.W_i.density??0)*(object.W_i.support??1)*macroShape*refinement,0,1.8);
  return density<W5_EMPTY_THRESHOLD?0:density;
}

export function chooseW5ActiveObject(spatialState){const candidates=(spatialState?.objects??[]).filter(entry=>entry.localPromoted===true&&entry.Q_i===true).sort((a,b)=>a.distanceToVolume-b.distanceToVolume||a.object.ID_i.localeCompare(b.object.ID_i));return candidates.length?candidates[0]:null;}
export function buildW5DensityBrick(object,{bx=0,by=0,bz=0,generation=W5_GENERATION,resolution=W5_BRICK_RESOLUTION}={}){
  if(!Number.isInteger(resolution)||resolution<4||resolution>32)throw new Error('FAP1_W5_BRICK_RESOLUTION_INVALID');
  const address=weatherBrickAddress(object,bx,by,bz,generation),values=new Float32Array(resolution*resolution*resolution),span=2/resolution;let occupied=0,maxDensity=0,sumDensity=0,index=0,insideVolumeSamples=0,insideOccupiedSamples=0;
  for(let z=0;z<resolution;z++)for(let y=0;y<resolution;y++)for(let x=0;x<resolution;x++){
    const qx=-1+(x+.5)*span,qy=-1+(y+.5)*span,qz=-1+(z+.5)*span,q2=qx*qx+qy*qy+qz*qz,r=object.V_i.radii,center=object.V_i.center,point=[center[0]+object.V_i.axisU[0]*qx*r[0]+object.V_i.axisUp[0]*qy*r[1]+object.V_i.axisV[0]*qz*r[2],center[1]+object.V_i.axisU[1]*qx*r[0]+object.V_i.axisUp[1]*qy*r[1]+object.V_i.axisV[1]*qz*r[2],center[2]+object.V_i.axisU[2]*qx*r[0]+object.V_i.axisUp[2]*qy*r[1]+object.V_i.axisV[2]*qz*r[2]],density=sampleW5LocalDensity(object,point);values[index++]=density;if(q2<1)insideVolumeSamples++;if(density>0){occupied++;sumDensity+=density;maxDensity=Math.max(maxDensity,density);if(q2<1)insideOccupiedSamples++;}}
  const insideEmptySamples=Math.max(0,insideVolumeSamples-insideOccupiedSamples);
  return freeze({schema:FAP1_W5_LOCAL_DENSITY_SCHEMA,address,weatherId:object.ID_i,generation,resolution,sampleCount:values.length,occupiedSampleCount:occupied,occupancyFraction:occupied/values.length,emptySampleFraction:1-occupied/values.length,insideVolumeSampleCount:insideVolumeSamples,insideOccupiedSampleCount:insideOccupiedSamples,insideEmptySampleCount:insideEmptySamples,interiorEmptySampleFraction:insideVolumeSamples?insideEmptySamples/insideVolumeSamples:0,meanOccupiedDensity:occupied?sumDensity/occupied:0,maxDensity,values,authority:'FAP1_DESCRIPTOR_REFINEMENT_ONLY',correspondenceBasis:'FAP1_PRESERVED_MACRO_COORDINATES_PLUS_MESO_BODY_DIFFERENTIATION',refinementCanCreateEmptyPockets:true,coherentObjectSpaceCavities:true,mesoscaleBodyDifferentiation:true,boundaryLockRadius:.90,cameraCentered:false,persistentWeatherIdentity:true,lightingApplied:false,visibleRendererMutation:false});
}
export function createW5RefinementState(spatialState){const active=chooseW5ActiveObject(spatialState);if(!active)return freeze({schema:FAP1_W5_LOCAL_DENSITY_SCHEMA,active:false,activeWeatherId:null,brick:null,maxActiveObjects:W5_MAX_ACTIVE_OBJECTS,visibleRendererMutation:false,l5LightingActive:false});const brick=buildW5DensityBrick(active.object);return freeze({schema:FAP1_W5_LOCAL_DENSITY_SCHEMA,active:true,activeWeatherId:active.object.ID_i,distanceToVolume:active.distanceToVolume,inside:active.inside,alpha:active.alpha,brick,maxActiveObjects:W5_MAX_ACTIVE_OBJECTS,visibleRendererMutation:false,l5LightingActive:false});}
export function verifyW5RefinementState(state){const failures=[];if(state?.active){if(!state.activeWeatherId)failures.push('ACTIVE_WEATHER_ID_MISSING');if(state.brick?.weatherId!==state.activeWeatherId)failures.push('BRICK_WEATHER_ID_MISMATCH');if(state.brick?.correspondenceBasis!=='FAP1_PRESERVED_MACRO_COORDINATES_PLUS_MESO_BODY_DIFFERENTIATION')failures.push('MACRO_CORRESPONDENCE_BASIS_MISSING');if(state.brick?.refinementCanCreateEmptyPockets!==true||state.brick?.coherentObjectSpaceCavities!==true||state.brick?.mesoscaleBodyDifferentiation!==true)failures.push('MESOSCALE_LOCAL_REFINEMENT_MISSING');if(state.brick?.cameraCentered!==false)failures.push('CAMERA_CENTERED_LOCAL_VOLUME_FORBIDDEN');if(state.brick?.persistentWeatherIdentity!==true)failures.push('PERSISTENT_WEATHER_IDENTITY_MISSING');if(!(state.brick?.occupancyFraction>=0&&state.brick?.occupancyFraction<=1))failures.push('INVALID_OCCUPANCY_FRACTION');if(!(state.brick?.interiorEmptySampleFraction>=0&&state.brick?.interiorEmptySampleFraction<=1))failures.push('INVALID_INTERIOR_EMPTY_FRACTION');}if(state?.visibleRendererMutation!==false)failures.push('VISIBLE_RENDERER_MUTATION_FORBIDDEN_AT_GB_W5_DENSITY_STAGE');if(state?.l5LightingActive!==false)failures.push('L5_PREMATURE_ACTIVATION');return freeze({schema:'FAP1_W5_LOCAL_DENSITY_INVARIANTS_v6_MESO_BODY_DIFFERENTIATION',pass:failures.length===0,failures:freeze(failures),activeWeatherId:state?.activeWeatherId??null});}

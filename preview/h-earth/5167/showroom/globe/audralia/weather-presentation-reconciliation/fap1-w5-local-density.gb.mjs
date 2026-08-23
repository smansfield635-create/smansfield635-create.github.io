import {
  localCoordinates,
  weatherBrickAddress
} from './fap1-spatial-lod.gb.mjs';

const freeze=value=>Object.freeze(value);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a||1),0,1);return t*t*(3-2*t);};
const mix=(a,b,t)=>a+(b-a)*t;
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];

export const FAP1_W5_LOCAL_DENSITY_SCHEMA='FAP1_W5_LOCAL_DENSITY_REFINEMENT_v7_DISTINCT_CLOUD_BODIES';
export const W5_GENERATION=7;
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

function ellipsoidField(q,center,radii,inner=.58,outer=1.04){const x=(q[0]-center[0])/radii[0],y=(q[1]-center[1])/radii[1],z=(q[2]-center[2])/radii[2],d=Math.hypot(x,y,z);return 1-smooth(inner,outer,d);}
function seeded(object,n){const seed=hash32(object.ID_i)+Math.floor((object.W_i.seed??0)*100000);return hashUnit(n*7+3,n*11+5,n*13+9,seed+n*313);}
function jitter(object,n,scale){return(seeded(object,n)-.5)*scale;}
function body(id,role,center,radii,densityScale=1){return freeze({id,role,center:freeze(center),radii:freeze(radii),densityScale,baseN:clamp(center[1]-radii[1],-1,1),topN:clamp(center[1]+radii[1],-1,1)});}

export function deriveW5CloudBodies(object){
  const j=(n,s)=>jitter(object,n,s),c=object.weatherClass;
  if(c==='LOW_CUMULIFORM')return freeze([
    body(`${object.ID_i}:B0`,'PRIMARY_COMPLEX',[-.38+j(1,.10),-.15+j(2,.08),-.18+j(3,.10)],[.30,.34,.30],1.08),
    body(`${object.ID_i}:B1`,'SECONDARY_COMPLEX',[.30+j(4,.10),.02+j(5,.10),.12+j(6,.10)],[.27,.40,.31],1.00),
    body(`${object.ID_i}:B2`,'HIGHER_CLUSTER',[-.02+j(7,.10),.30+j(8,.08),.38+j(9,.10)],[.31,.29,.25],.88),
    body(`${object.ID_i}:B3`,'LOWER_SATELLITE',[.10+j(10,.12),-.33+j(11,.07),-.42+j(12,.09)],[.23,.22,.22],.72)
  ]);
  if(c==='DEEP_CONVECTION')return freeze([
    body(`${object.ID_i}:B0`,'DOMINANT_TOWER',[-.25+j(1,.08),-.02+j(2,.07),-.13+j(3,.08)],[.30,.78,.30],1.18),
    body(`${object.ID_i}:B1`,'SUBSIDIARY_TOWER',[.28+j(4,.09),.03+j(5,.08),.15+j(6,.09)],[.25,.62,.28],1.02),
    body(`${object.ID_i}:B2`,'SHOULDER',[-.03+j(7,.10),.10+j(8,.08),.38+j(9,.10)],[.36,.37,.25],.86),
    body(`${object.ID_i}:B3`,'ANVIL',[.02+j(10,.08),.58+j(11,.06),-.02+j(12,.10)],[.54,.20,.57],.72)
  ]);
  if(c==='CYCLONE')return freeze([
    body(`${object.ID_i}:B0`,'EYEWALL_WEST',[-.31+j(1,.06),.00+j(2,.06),-.02+j(3,.06)],[.24,.66,.34],1.08),
    body(`${object.ID_i}:B1`,'EYEWALL_EAST',[.31+j(4,.06),.05+j(5,.06),.03+j(6,.06)],[.24,.62,.34],1.04),
    body(`${object.ID_i}:B2`,'RAINBAND_A',[-.10+j(7,.08),-.18+j(8,.06),.48+j(9,.08)],[.48,.28,.22],.78),
    body(`${object.ID_i}:B3`,'OUTFLOW',[.02+j(10,.08),.57+j(11,.05),-.03+j(12,.08)],[.60,.18,.61],.64)
  ]);
  if(c==='MID_FRONTAL')return freeze([
    body(`${object.ID_i}:B0`,'FRONTAL_STRATUM',[-.24+j(1,.08),-.05+j(2,.05),-.10+j(3,.08)],[.61,.31,.66],1.00),
    body(`${object.ID_i}:B1`,'OVERLAPPING_STRATUM',[.34+j(4,.08),.18+j(5,.05),.20+j(6,.08)],[.52,.25,.56],.84),
    body(`${object.ID_i}:B2`,'BROKEN_MARGIN',[-.02+j(7,.10),-.27+j(8,.05),.50+j(9,.08)],[.34,.18,.26],.58)
  ]);
  return freeze([
    body(`${object.ID_i}:B0`,'ICE_VEIL',[-.24+j(1,.10),.08+j(2,.06),-.12+j(3,.10)],[.62,.22,.66],.84),
    body(`${object.ID_i}:B1`,'ICE_LAYER',[.31+j(4,.10),.31+j(5,.06),.22+j(6,.10)],[.48,.17,.54],.64),
    body(`${object.ID_i}:B2`,'ICE_FILAMENT',[-.06+j(7,.12),-.20+j(8,.05),.47+j(9,.10)],[.30,.12,.38],.42)
  ]);
}

function bodyField(object,q){
  const bodies=deriveW5CloudBodies(object);let support=0;
  for(const b of bodies){const field=ellipsoidField(q,b.center,b.radii,.55,1.03)*b.densityScale;support=Math.max(support,field);}
  if(object.weatherClass==='MID_FRONTAL')support=Math.max(support,.22*ellipsoidField(q,[0,0,0],[.92,.40,.94],.45,1.08));
  if(object.weatherClass==='HIGH_ICE')support=Math.max(support,.13*ellipsoidField(q,[0,.08,0],[.96,.34,.96],.42,1.08));
  return clamp(support,0,1.45);
}

function coherentCavityMask(object,q){
  const deep=object.weatherClass==='DEEP_CONVECTION'||object.weatherClass==='CYCLONE';
  const p=[jitter(object,21,.18),jitter(object,22,.22),jitter(object,23,.18)],s=[jitter(object,24,.48),jitter(object,25,.34),jitter(object,26,.48)];
  const pR=deep?[.27,.35,.29]:[.25,.29,.27],sR=deep?[.22,.27,.24]:[.19,.23,.21];
  return clamp(Math.max(ellipsoidField(q,p,pR,.54,1.04),ellipsoidField(q,s,sR,.55,1.04)*.88),0,1);
}

function localRefinementFactor(object,q){
  const seed=Math.floor((object.W_i.seed??0)*100000)+hash32(object.ID_i)%100000;
  const fine=fbm3(q[0]*8.6+4.3,q[1]*9.4-2.1,q[2]*8.2+6.4,seed+401),lobe=fbm3(q[0]*4.2+1.7,q[1]*4.8-4.6,q[2]*4.0+2.9,seed+557),cavity=fbm3(q[0]*2.4-8.2,q[1]*2.7+5.7,q[2]*2.3-1.9,seed+733);
  const signedFine=(fine-.5)*2,signedLobe=(lobe-.5)*2,stochasticCavity=smooth(.65,.82,cavity),coherentCavity=coherentCavityMask(object,q),bodySupport=bodyField(object,q);
  const radius=Math.hypot(q[0],q[1],q[2]),boundaryLock=smooth(.72,.94,radius);
  let interior=bodySupport*(1+signedLobe*.24+signedFine*.14);
  interior*=1-stochasticCavity*.62;
  interior*=1-coherentCavity*.985;
  interior=clamp(interior,0,1.72);
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
  const address=weatherBrickAddress(object,bx,by,bz,generation),values=new Float32Array(resolution*resolution*resolution),span=2/resolution,bodies=deriveW5CloudBodies(object);let occupied=0,maxDensity=0,sumDensity=0,index=0,insideVolumeSamples=0,insideOccupiedSamples=0;
  for(let z=0;z<resolution;z++)for(let y=0;y<resolution;y++)for(let x=0;x<resolution;x++){
    const qx=-1+(x+.5)*span,qy=-1+(y+.5)*span,qz=-1+(z+.5)*span,q2=qx*qx+qy*qy+qz*qz,r=object.V_i.radii,center=object.V_i.center,point=[center[0]+object.V_i.axisU[0]*qx*r[0]+object.V_i.axisUp[0]*qy*r[1]+object.V_i.axisV[0]*qz*r[2],center[1]+object.V_i.axisU[1]*qx*r[0]+object.V_i.axisUp[1]*qy*r[1]+object.V_i.axisV[1]*qz*r[2],center[2]+object.V_i.axisU[2]*qx*r[0]+object.V_i.axisUp[2]*qy*r[1]+object.V_i.axisV[2]*qz*r[2]],density=sampleW5LocalDensity(object,point);values[index++]=density;if(q2<1)insideVolumeSamples++;if(density>0){occupied++;sumDensity+=density;maxDensity=Math.max(maxDensity,density);if(q2<1)insideOccupiedSamples++;}}
  const insideEmptySamples=Math.max(0,insideVolumeSamples-insideOccupiedSamples),verticalIntervals=bodies.map(b=>freeze({id:b.id,role:b.role,baseN:b.baseN,topN:b.topN}));
  return freeze({schema:FAP1_W5_LOCAL_DENSITY_SCHEMA,address,weatherId:object.ID_i,generation,resolution,sampleCount:values.length,occupiedSampleCount:occupied,occupancyFraction:occupied/values.length,emptySampleFraction:1-occupied/values.length,insideVolumeSampleCount:insideVolumeSamples,insideOccupiedSampleCount:insideOccupiedSamples,insideEmptySampleCount:insideEmptySamples,interiorEmptySampleFraction:insideVolumeSamples?insideEmptySamples/insideVolumeSamples:0,meanOccupiedDensity:occupied?sumDensity/occupied:0,maxDensity,values,authority:'FAP1_DESCRIPTOR_REFINEMENT_ONLY',correspondenceBasis:'FROZEN_FAP1_MACRO_BOUNDARY_PLUS_DISTINCT_W5_BODY_PARTITION',refinementCanCreateEmptyPockets:true,coherentObjectSpaceCavities:true,distinctCloudBodies:true,bodyCount:bodies.length,bodyRoles:freeze(bodies.map(b=>b.role)),verticalIntervals:freeze(verticalIntervals),bodyGapCapable:true,boundaryLockRadius:.94,cameraCentered:false,persistentWeatherIdentity:true,macroWeatherFrozen:true,lightingApplied:false,visibleRendererMutation:false});
}
export function createW5RefinementState(spatialState){const active=chooseW5ActiveObject(spatialState);if(!active)return freeze({schema:FAP1_W5_LOCAL_DENSITY_SCHEMA,active:false,activeWeatherId:null,brick:null,maxActiveObjects:W5_MAX_ACTIVE_OBJECTS,visibleRendererMutation:false,l5LightingActive:false});const brick=buildW5DensityBrick(active.object);return freeze({schema:FAP1_W5_LOCAL_DENSITY_SCHEMA,active:true,activeWeatherId:active.object.ID_i,distanceToVolume:active.distanceToVolume,inside:active.inside,alpha:active.alpha,brick,maxActiveObjects:W5_MAX_ACTIVE_OBJECTS,visibleRendererMutation:false,l5LightingActive:false});}
export function verifyW5RefinementState(state){const failures=[];if(state?.active){if(!state.activeWeatherId)failures.push('ACTIVE_WEATHER_ID_MISSING');if(state.brick?.weatherId!==state.activeWeatherId)failures.push('BRICK_WEATHER_ID_MISMATCH');if(state.brick?.correspondenceBasis!=='FROZEN_FAP1_MACRO_BOUNDARY_PLUS_DISTINCT_W5_BODY_PARTITION')failures.push('FROZEN_MACRO_CORRESPONDENCE_MISSING');if(state.brick?.distinctCloudBodies!==true||state.brick?.bodyGapCapable!==true)failures.push('DISTINCT_CLOUD_BODY_PARTITION_MISSING');if(!(state.brick?.bodyCount>=3))failures.push('INSUFFICIENT_CLOUD_BODY_COUNT');if(state.brick?.cameraCentered!==false)failures.push('CAMERA_CENTERED_LOCAL_VOLUME_FORBIDDEN');if(state.brick?.persistentWeatherIdentity!==true)failures.push('PERSISTENT_WEATHER_IDENTITY_MISSING');if(state.brick?.macroWeatherFrozen!==true)failures.push('MACRO_WEATHER_FREEZE_MISSING');if(!(state.brick?.occupancyFraction>=0&&state.brick?.occupancyFraction<=1))failures.push('INVALID_OCCUPANCY_FRACTION');if(!(state.brick?.interiorEmptySampleFraction>=0&&state.brick?.interiorEmptySampleFraction<=1))failures.push('INVALID_INTERIOR_EMPTY_FRACTION');}if(state?.visibleRendererMutation!==false)failures.push('VISIBLE_RENDERER_MUTATION_FORBIDDEN_AT_W5_DENSITY_STAGE');if(state?.l5LightingActive!==false)failures.push('L5_PREMATURE_ACTIVATION');return freeze({schema:'FAP1_W5_LOCAL_DENSITY_INVARIANTS_v7_DISTINCT_CLOUD_BODIES',pass:failures.length===0,failures:freeze(failures),activeWeatherId:state?.activeWeatherId??null});}

import {localCoordinates} from './fap1-spatial-lod.gb.mjs';
import {sampleW5LocalDensity,W5_EMPTY_THRESHOLD} from './fap1-w5-local-density.gb.mjs';

const freeze=value=>Object.freeze(value);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a||1),0,1);return t*t*(3-2*t);};
const mix=(a,b,t)=>a+(b-a)*t;

export const FAP1_W5_OVERLAP_CONTINUITY_SCHEMA='FAP1_W5_MACRO_LOCAL_OVERLAP_CONTINUITY_v1';
export const CONTINUITY_SAMPLE_RESOLUTION=15;
export const CONTINUITY_BOUNDARY_INNER_RADIUS=.68;
export const CONTINUITY_BOUNDARY_OUTER_RADIUS=.94;
export const CONTINUITY_MAX_NORMALIZED_MAE=.34;
export const CONTINUITY_MAX_BOUNDARY_MAE=.30;
export const CONTINUITY_MIN_MASS_RATIO=.62;
export const CONTINUITY_MAX_MASS_RATIO=1.38;

function hash31(x,y,z){
  let px=x*.1031-Math.floor(x*.1031),py=y*.1031-Math.floor(y*.1031),pz=z*.1031-Math.floor(z*.1031);
  const d=px*(py+33.33)+py*(pz+33.33)+pz*(px+33.33);
  px+=d;py+=d;pz+=d;
  const v=(px+py)*pz;
  return v-Math.floor(v);
}
function noise3(x,y,z){
  const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z),fx=x-ix,fy=y-iy,fz=z-iz;
  const sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy),sz=fz*fz*(3-2*fz);
  const n=(dx,dy,dz)=>hash31(ix+dx,iy+dy,iz+dz);
  const a=mix(n(0,0,0),n(1,0,0),sx),b=mix(n(0,1,0),n(1,1,0),sx);
  const c=mix(n(0,0,1),n(1,0,1),sx),d=mix(n(0,1,1),n(1,1,1),sx);
  return mix(mix(a,b,sy),mix(c,d,sy),sz);
}
function fbm(x,y,z){let value=noise3(x,y,z)*.62;value+=noise3(x*2.07+5.3,y*2.07+1.7,z*2.07+9.2)*(.62*.48);return value;}
function verticalEnvelope(z){return smooth(0,.075,z)*(1-smooth(.86,1,z));}
function genusCode(genus){return ({Ci:0,Cc:1,Cs:2,Ac:3,As:4,Ns:5,Sc:6,St:7,Cu:8,Cb:9})[genus]??8;}

export function sampleFAP1MacroDensity(object,worldPoint,{canonicalTimeHours=0}={}){
  if(!object||object.authority!=='FAP1_DESCRIPTOR_ONLY')throw new Error('FAP1_CONTINUITY_OBJECT_AUTHORITY_REQUIRED');
  const q=localCoordinates(worldPoint,object),x=q[0],vertical=q[1],y=q[2];
  if(x*x+vertical*vertical+y*y>=1)return 0;
  const z=clamp((vertical+1)*.5,0,1),r=Math.hypot(x,y),fieldScale=clamp(Math.sqrt(Math.max(object.V_i.radii[0]*object.V_i.radii[2],1))/260,1,9);
  const qx=x*fieldScale,qy=y*fieldScale,seed=object.W_i.seed??0,time=canonicalTimeHours;
  const n=fbm(qx*2.15+seed*19,qy*2.15+time*.018,z*3.2-time*.012),v=verticalEnvelope(z),g=genusCode(object.W_i.genus);
  let shape=0;
  if(g<2.5){const veil=.5+.5*Math.sin(qx*1.55+qy*.72+seed*7+n*2.2);shape=(1-smooth(.70,1.08,r))*v*smooth(.32,.63,n+.12*veil)*.44;}
  else if(g<4.5){const cells=.5+.5*Math.sin(qx*2.7+n*2.4)*Math.cos(qy*2.3-time*.012);shape=(1-smooth(.70,1.08,r))*v*smooth(.39,.66,n+.18*cells)*.60;}
  else if(g<7.5){const sheet=.5+.5*Math.sin(qx*1.35+qy*.47+seed*5);shape=(1-smooth(.70,1.08,r))*v*smooth(.35,.62,n+.10*sheet)*.68;}
  else if(g<8.5){const taper=mix(1,.48,smooth(.08,.95,z)),cell=.5+.5*Math.sin(qx*2.6+seed*9)*Math.cos(qy*2.35-time*.014);shape=(1-smooth(taper*.65,taper*1.08,r))*v*smooth(.44,.66,n+.22*cell)*.88;}
  else{
    const taper=mix(.90,.39,smooth(.05,.72,z)),cell=.5+.5*Math.sin(qx*2.2+seed*7)*Math.cos(qy*2-time*.012);
    const tower=(1-smooth(taper*.62,taper*1.10,r))*v*smooth(.39,.62,n+.20*cell);
    const anvilBand=smooth(.62,.76,z)*(1-smooth(.95,1,z));
    const anvil=(1-smooth(.48,1.32,r))*anvilBand*smooth(.34,.59,n+.14*cell)*.76;
    shape=Math.max(tower,anvil);
    if(g>8.5){const eye=1-smooth(.10,.19,r),wall=smooth(.12,.22,r)*(1-smooth(.31,.46,r));shape=Math.max(shape,wall*.64*v);shape*=1-eye*.985;}
  }
  const density=clamp(shape*(object.W_i.density??0)*(object.W_i.support??1),0,1.8);
  return density<W5_EMPTY_THRESHOLD?0:density;
}

function worldPointFromLocal(object,q){
  const r=object.V_i.radii,c=object.V_i.center;
  return [c[0]+object.V_i.axisU[0]*q[0]*r[0]+object.V_i.axisUp[0]*q[1]*r[1]+object.V_i.axisV[0]*q[2]*r[2],c[1]+object.V_i.axisU[1]*q[0]*r[0]+object.V_i.axisUp[1]*q[1]*r[1]+object.V_i.axisV[1]*q[2]*r[2],c[2]+object.V_i.axisU[2]*q[0]*r[0]+object.V_i.axisUp[2]*q[1]*r[1]+object.V_i.axisV[2]*q[2]*r[2]];
}

export function evaluateMacroLocalContinuity(object,{canonicalTimeHours=0,resolution=CONTINUITY_SAMPLE_RESOLUTION}={}){
  if(!Number.isInteger(resolution)||resolution<7||resolution>31)throw new Error('FAP1_CONTINUITY_RESOLUTION_INVALID');
  let count=0,boundaryCount=0,macroMass=0,localMass=0,absoluteError=0,boundaryError=0,occupiedAgreement=0;
  const span=2/resolution;
  for(let z=0;z<resolution;z++)for(let y=0;y<resolution;y++)for(let x=0;x<resolution;x++){
    const q=[-1+(x+.5)*span,-1+(y+.5)*span,-1+(z+.5)*span],radius=Math.hypot(...q);if(radius>=1)continue;
    const point=worldPointFromLocal(object,q),macro=sampleFAP1MacroDensity(object,point,{canonicalTimeHours}),local=sampleW5LocalDensity(object,point);
    macroMass+=macro;localMass+=local;absoluteError+=Math.abs(local-macro);
    if((macro>W5_EMPTY_THRESHOLD)===(local>W5_EMPTY_THRESHOLD))occupiedAgreement++;
    if(radius>=CONTINUITY_BOUNDARY_INNER_RADIUS&&radius<=CONTINUITY_BOUNDARY_OUTER_RADIUS){boundaryCount++;boundaryError+=Math.abs(local-macro);}count++;
  }
  const normalization=Math.max(.08,(macroMass+localMass)/(2*Math.max(count,1))),normalizedMae=(absoluteError/Math.max(count,1))/normalization,boundaryMae=(boundaryError/Math.max(boundaryCount,1))/normalization,massRatio=localMass/Math.max(macroMass,1e-9),occupancyAgreement=occupiedAgreement/Math.max(count,1);
  const pass=normalizedMae<=CONTINUITY_MAX_NORMALIZED_MAE&&boundaryMae<=CONTINUITY_MAX_BOUNDARY_MAE&&massRatio>=CONTINUITY_MIN_MASS_RATIO&&massRatio<=CONTINUITY_MAX_MASS_RATIO;
  return freeze({schema:FAP1_W5_OVERLAP_CONTINUITY_SCHEMA,weatherId:object.ID_i,persistentWeatherIdentity:true,sharedSamplePositions:true,sampleCount:count,boundarySampleCount:boundaryCount,macroMass,localMass,massRatio,normalizedMae,boundaryMae,occupancyAgreement,thresholds:freeze({maxNormalizedMae:CONTINUITY_MAX_NORMALIZED_MAE,maxBoundaryMae:CONTINUITY_MAX_BOUNDARY_MAE,minMassRatio:CONTINUITY_MIN_MASS_RATIO,maxMassRatio:CONTINUITY_MAX_MASS_RATIO}),pass,handoffAuthority:pass?'ELIGIBLE_FOR_BOUNDED_HANDOFF_CONSTRUCTION':'HELD',macroRendererMutation:false,localRendererMutation:false,l5LightingActive:false});
}

export function verifyMacroLocalContinuity(receipt){
  const failures=[];
  if(receipt?.persistentWeatherIdentity!==true)failures.push('WEATHER_IDENTITY_NOT_PERSISTENT');
  if(receipt?.sharedSamplePositions!==true)failures.push('NON_SHARED_SAMPLE_POSITIONS');
  if(!(receipt?.sampleCount>0))failures.push('NO_CONTINUITY_SAMPLES');
  if(!(receipt?.boundarySampleCount>0))failures.push('NO_BOUNDARY_SAMPLES');
  if(!(receipt?.normalizedMae<=CONTINUITY_MAX_NORMALIZED_MAE))failures.push('NORMALIZED_MAE_EXCEEDED');
  if(!(receipt?.boundaryMae<=CONTINUITY_MAX_BOUNDARY_MAE))failures.push('BOUNDARY_MAE_EXCEEDED');
  if(!(receipt?.massRatio>=CONTINUITY_MIN_MASS_RATIO&&receipt?.massRatio<=CONTINUITY_MAX_MASS_RATIO))failures.push('MASS_RATIO_OUT_OF_RANGE');
  if(receipt?.macroRendererMutation!==false||receipt?.localRendererMutation!==false)failures.push('RENDERER_MUTATION_FORBIDDEN');
  if(receipt?.l5LightingActive!==false)failures.push('L5_PREMATURE_ACTIVATION');
  return freeze({schema:'FAP1_W5_OVERLAP_CONTINUITY_INVARIANTS_v1',pass:failures.length===0,failures:freeze(failures),weatherId:receipt?.weatherId??null,handoffAuthority:failures.length?'HELD':'ELIGIBLE_FOR_BOUNDED_HANDOFF_CONSTRUCTION'});
}

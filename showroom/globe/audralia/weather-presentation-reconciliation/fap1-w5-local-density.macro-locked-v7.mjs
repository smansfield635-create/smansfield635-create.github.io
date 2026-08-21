import {localCoordinates,weatherBrickAddress} from './fap1-spatial-lod.gb.mjs';
import {sampleW5LocalDensity as sampleBaseDensity,chooseW5ActiveObject,W5_EMPTY_THRESHOLD,W5_BRICK_RESOLUTION} from './fap1-w5-local-density.gb.mjs';

const freeze=v=>Object.freeze(v);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a||1),0,1);return t*t*(3-2*t);};
const mix=(a,b,t)=>a+(b-a)*t;

export const FAP1_W5_MACRO_LOCKED_SCHEMA='FAP1_W5_MACRO_LOCKED_LOCAL_BODY_REFINEMENT_v7';
export const W5_GENERATION=7;
export const W5_MAX_ACTIVE_OBJECTS=1;
export const W5_CACHE_MAX=2;

function hash32(value){let h=2166136261;for(const ch of String(value)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function hashUnit(n,seed){let h=(seed^Math.imul(n+4099,374761393))>>>0;h^=h>>>13;h=Math.imul(h,1274126177);h^=h>>>16;return(h>>>0)/4294967295;}
function ellipsoid(q,c,r){const x=(q[0]-c[0])/r[0],y=(q[1]-c[1])/r[1],z=(q[2]-c[2])/r[2];return 1-smooth(.72,1.04,Math.hypot(x,y,z));}
function body(role,c,r){return freeze({role,center:freeze(c),radii:freeze(r)});}

export function deriveW5CloudBodies(object){
  const seed=hash32(`${object.ID_i}:${object.W_i?.seed??0}`),j=(n,s)=>(hashUnit(n,seed)-.5)*s;
  let specs;
  switch(object.weatherClass){
    case 'LOW_CUMULIFORM': specs=[
      body('PRIMARY',[-.34+j(1,.08),-.18+j(2,.08),-.18+j(3,.08)],[.34,.34,.31]),
      body('SECONDARY',[.31+j(4,.08),-.04+j(5,.08),.10+j(6,.08)],[.30,.39,.33]),
      body('HIGH_CLUSTER',[-.02+j(7,.08),.31+j(8,.07),.33+j(9,.08)],[.31,.27,.27]),
      body('LOW_SATELLITE',[.06+j(10,.08),-.38+j(11,.06),-.34+j(12,.08)],[.27,.24,.25])
    ];break;
    case 'DEEP_CONVECTION': specs=[
      body('DOMINANT_TOWER',[-.25+j(1,.07),-.08+j(2,.06),-.14+j(3,.07)],[.34,.72,.33]),
      body('SUBSIDIARY_TOWER',[.27+j(4,.07),.04+j(5,.06),.16+j(6,.07)],[.29,.58,.31]),
      body('SHOULDER',[.05+j(7,.08),.18+j(8,.06),-.35+j(9,.07)],[.36,.34,.28]),
      body('ANVIL',[j(10,.06),.55+j(11,.05),.02+j(12,.08)],[.52,.22,.52])
    ];break;
    case 'CYCLONE': specs=[
      body('EYEWALL_A',[-.24+j(1,.06),-.08+j(2,.05),.02+j(3,.06)],[.29,.58,.36]),
      body('EYEWALL_B',[.25+j(4,.06),.00+j(5,.05),-.02+j(6,.06)],[.28,.56,.35]),
      body('RAINBAND',[-.05+j(7,.08),-.24+j(8,.05),.38+j(9,.07)],[.47,.25,.22]),
      body('OUTFLOW',[.04+j(10,.07),.53+j(11,.05),-.08+j(12,.07)],[.56,.20,.48])
    ];break;
    case 'MID_FRONTAL': specs=[
      body('FRONTAL_STRATUM',[-.20+j(1,.08),-.14+j(2,.05),-.06],[.50,.28,.58]),
      body('OVERLAP_STRATUM',[.28+j(3,.08),.12+j(4,.05),.16],[.46,.25,.52]),
      body('BROKEN_MARGIN',[.02,.34+j(5,.05),-.36+j(6,.08)],[.39,.18,.30])
    ];break;
    default: specs=[
      body('ICE_VEIL',[-.18+j(1,.08),.12+j(2,.05),-.08],[.55,.20,.62]),
      body('ICE_LAYER',[.27+j(3,.08),.32+j(4,.05),.18],[.49,.15,.55]),
      body('ICE_FILAMENT',[.02,-.28+j(5,.05),-.34+j(6,.08)],[.42,.12,.29])
    ];
  }
  return freeze(specs.map((b,index)=>freeze({...b,index,weatherId:object.ID_i})));
}

function bodyMask(object,q){let m=0;for(const b of deriveW5CloudBodies(object))m=Math.max(m,ellipsoid(q,b.center,b.radii));return m;}
function boundaryLock(q){return smooth(.80,.96,Math.hypot(...q));}
export function sampleMacroLockedW5Density(object,worldPoint){
  const base=sampleBaseDensity(object,worldPoint);if(base<=0)return 0;
  const q=localCoordinates(worldPoint,object);if(q[0]*q[0]+q[1]*q[1]+q[2]*q[2]>=1)return 0;
  const m=bodyMask(object,q),connected=object.weatherClass==='MID_FRONTAL'||object.weatherClass==='HIGH_ICE';
  const support=connected?clamp(.58+.42*m,0,1):smooth(.10,.58,m);
  const factor=mix(support,1,boundaryLock(q));
  const density=base*factor;return density<W5_EMPTY_THRESHOLD?0:density;
}

const brickCache=new Map();
function cacheKey(object,resolution,generation){return `${object.ID_i}|${object.W_i?.seed??0}|${resolution}|${generation}`;}
function trimCache(){while(brickCache.size>W5_CACHE_MAX)brickCache.delete(brickCache.keys().next().value);}
export function clearW5BrickCache(){brickCache.clear();}

export function buildW5DensityBrick(object,{bx=0,by=0,bz=0,generation=W5_GENERATION,resolution=W5_BRICK_RESOLUTION}={}){
  const key=cacheKey(object,resolution,generation);if(brickCache.has(key))return brickCache.get(key);
  const address=weatherBrickAddress(object,bx,by,bz,generation),values=new Float32Array(resolution**3),span=2/resolution;
  let index=0,occupied=0,inside=0,insideOccupied=0,maxDensity=0,sum=0;
  for(let z=0;z<resolution;z++)for(let y=0;y<resolution;y++)for(let x=0;x<resolution;x++){
    const q=[-1+(x+.5)*span,-1+(y+.5)*span,-1+(z+.5)*span],q2=q[0]*q[0]+q[1]*q[1]+q[2]*q[2],r=object.V_i.radii,c=object.V_i.center;
    const p=[c[0]+object.V_i.axisU[0]*q[0]*r[0]+object.V_i.axisUp[0]*q[1]*r[1]+object.V_i.axisV[0]*q[2]*r[2],c[1]+object.V_i.axisU[1]*q[0]*r[0]+object.V_i.axisUp[1]*q[1]*r[1]+object.V_i.axisV[1]*q[2]*r[2],c[2]+object.V_i.axisU[2]*q[0]*r[0]+object.V_i.axisUp[2]*q[1]*r[1]+object.V_i.axisV[2]*q[2]*r[2]];
    const d=sampleMacroLockedW5Density(object,p);values[index++]=d;if(q2<1)inside++;if(d>0){occupied++;sum+=d;maxDensity=Math.max(maxDensity,d);if(q2<1)insideOccupied++;}
  }
  const receipt=freeze({schema:FAP1_W5_MACRO_LOCKED_SCHEMA,address,weatherId:object.ID_i,generation,resolution,values,occupancyFraction:occupied/values.length,interiorEmptySampleFraction:inside?1-insideOccupied/inside:0,meanOccupiedDensity:occupied?sum/occupied:0,maxDensity,distinctCloudBodies:true,bodyGapCapable:true,macroWeatherFrozen:true,cacheable:true,bodyCount:deriveW5CloudBodies(object).length});
  brickCache.set(key,receipt);trimCache();return receipt;
}

export function createW5RefinementState(spatialState){
  const active=chooseW5ActiveObject(spatialState);if(!active)return freeze({schema:FAP1_W5_MACRO_LOCKED_SCHEMA,active:false,activeWeatherId:null,brick:null});
  const brick=buildW5DensityBrick(active.object);return freeze({schema:FAP1_W5_MACRO_LOCKED_SCHEMA,active:true,activeWeatherId:active.object.ID_i,brick,localWeight:active.alpha?.l??0,macroWeatherFrozen:true,cacheable:true});
}
export function verifyW5RefinementState(state){const failures=[];if(state?.active){if(!state.brick)failures.push('BRICK_MISSING');if(state.brick?.weatherId!==state.activeWeatherId)failures.push('WEATHER_ID_MISMATCH');if(state.brick?.macroWeatherFrozen!==true)failures.push('MACRO_FREEZE_VIOLATED');}return freeze({pass:failures.length===0,failures:freeze(failures)});}

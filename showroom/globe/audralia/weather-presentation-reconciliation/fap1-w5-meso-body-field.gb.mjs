import {
  createW5RefinementState as createBaseW5RefinementState,
  verifyW5RefinementState as verifyBaseW5RefinementState,
  W5_EMPTY_THRESHOLD
} from './fap1-w5-local-density.gb.mjs';

const freeze=value=>Object.freeze(value);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a||1),0,1);return t*t*(3-2*t);};
const mix=(a,b,t)=>a+(b-a)*t;

export {W5_EMPTY_THRESHOLD};
export const FAP1_W5_MESO_BODY_SCHEMA='FAP1_W5_MESO_BODY_DIFFERENTIATION_v1';
export const W5_MESO_GENERATION=6;

function hash32(value){let h=2166136261;for(const ch of String(value)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function rand(seed,index){let x=(seed+Math.imul(index+1,0x9e3779b1))>>>0;x^=x>>>16;x=Math.imul(x,0x7feb352d);x^=x>>>15;x=Math.imul(x,0x846ca68b);x^=x>>>16;return(x>>>0)/4294967295;}
function ellipsoid(q,c,r){const x=(q[0]-c[0])/r[0],y=(q[1]-c[1])/r[1],z=(q[2]-c[2])/r[2],d=Math.hypot(x,y,z);return 1-smooth(.72,1.08,d);}
function bodyCount(weatherClass){if(weatherClass==='LOW_CUMULIFORM')return 7;if(weatherClass==='DEEP_CONVECTION')return 6;if(weatherClass==='CYCLONE')return 7;if(weatherClass==='MID_FRONTAL')return 5;if(weatherClass==='HIGH_ICE')return 4;return 5;}

function buildBodies(object){
  const cls=object.weatherClass,seed=hash32(`${object.ID_i}:MESO_BODY_FIELD`),count=bodyCount(cls),bodies=[];
  for(let i=0;i<count;i++){
    const a=rand(seed,i*11),b=rand(seed,i*11+1),c=rand(seed,i*11+2),d=rand(seed,i*11+3),e=rand(seed,i*11+4),f=rand(seed,i*11+5);
    let center=[(a-.5)*1.15,(b-.5)*.56,(c-.5)*1.15],radii=[.30+.18*d,.24+.16*e,.30+.18*f],role='BODY';
    if(cls==='LOW_CUMULIFORM'){
      center=[(a-.5)*1.22,(b-.5)*.34-.05,(c-.5)*1.22];
      radii=[.22+.13*d,.17+.12*e,.22+.13*f];
      role=i<3?'PRIMARY_COMPLEX':i<5?'SECONDARY_COMPLEX':'PERIPHERAL_FRAGMENT';
    }else if(cls==='DEEP_CONVECTION'){
      center=[(a-.5)*1.02,(b-.5)*.48-.04,(c-.5)*1.02];
      radii=i===0?[.30,.67,.30]:[.20+.10*d,.34+.28*e,.20+.10*f];
      role=i===0?'PRIMARY_TOWER':i<4?'SUBSIDIARY_TOWER':'SHOULDER';
    }else if(cls==='CYCLONE'){
      const angle=(i/count)*Math.PI*2+(a-.5)*.38,ring=.42+.20*b;
      center=[Math.cos(angle)*ring,(c-.5)*.28,Math.sin(angle)*ring];
      radii=[.22+.10*d,.34+.25*e,.22+.10*f];
      role='CONVECTIVE_BAND_BODY';
    }else if(cls==='MID_FRONTAL'){
      center=[(i-(count-1)/2)*.26+(a-.5)*.18,(b-.5)*.30,(c-.5)*.72];
      radii=[.42+.18*d,.18+.13*e,.28+.16*f];
      role=i===2?'FRONTAL_CORE':'FRONTAL_SEGMENT';
    }else if(cls==='HIGH_ICE'){
      center=[(i-(count-1)/2)*.30+(a-.5)*.20,(b-.5)*.20+.16,(c-.5)*.70];
      radii=[.48+.18*d,.12+.08*e,.27+.17*f];
      role='ICE_VEIL_SEGMENT';
    }
    bodies.push(freeze({index:i,center:freeze(center),radii:freeze(radii),role,baseOffset:center[1]-radii[1],topOffset:center[1]+radii[1]}));
  }
  return freeze(bodies);
}

function familySupport(object,q,bodies){
  const cls=object.weatherClass;
  let primary=0,secondary=0;
  for(const body of bodies){
    const support=ellipsoid(q,body.center,body.radii);
    if(body.role==='PRIMARY_TOWER'||body.role==='PRIMARY_COMPLEX'||body.role==='FRONTAL_CORE')primary=Math.max(primary,support);
    else secondary=Math.max(secondary,support);
  }
  let field=Math.max(primary,secondary*.92);
  if(cls==='DEEP_CONVECTION'){
    const anvil=smooth(.26,.54,q[1])*(1-smooth(.78,1.0,q[1]))*(1-smooth(.64,1.02,Math.hypot(q[0],q[2])));
    field=Math.max(field,anvil*.64);
  }else if(cls==='CYCLONE'){
    const radial=Math.hypot(q[0],q[2]),band=smooth(.22,.38,radial)*(1-smooth(.78,.96,radial));
    field=Math.max(field,band*.35);
  }else if(cls==='MID_FRONTAL'){
    const connective=(1-smooth(.52,.92,Math.abs(q[2])))*(1-smooth(.38,.72,Math.abs(q[1])));
    field=Math.max(field,connective*.34);
  }else if(cls==='HIGH_ICE'){
    const veil=(1-smooth(.42,.90,Math.abs(q[2])))*(1-smooth(.30,.72,Math.abs(q[1]-.12)));
    field=Math.max(field,veil*.26);
  }
  return clamp(field,0,1.35);
}

function bodyMultiplier(object,q,bodies){
  const support=familySupport(object,q,bodies),radius=Math.hypot(q[0],q[1],q[2]);
  const boundaryLock=smooth(.76,.94,radius);
  const gapThreshold=(object.weatherClass==='MID_FRONTAL'||object.weatherClass==='HIGH_ICE')?.14:.22;
  let interior=support<gapThreshold?0:clamp(.18+support*1.42,0,1.55);
  if(object.weatherClass==='DEEP_CONVECTION'){
    const lowerErosion=1-smooth(-.72,-.18,q[1]);
    interior*=1-lowerErosion*.38*(1-support);
  }
  return mix(interior,1,boundaryLock);
}

function transformBrick(baseBrick,object){
  const resolution=baseBrick.resolution,values=new Float32Array(baseBrick.values.length),bodies=buildBodies(object),span=2/resolution;
  let inside=0,insideEmpty=0,occupied=0,sum=0,maxDensity=0,index=0,gapColumns=0;
  for(let z=0;z<resolution;z++)for(let y=0;y<resolution;y++)for(let x=0;x<resolution;x++){
    const q=[-1+(x+.5)*span,-1+(y+.5)*span,-1+(z+.5)*span],q2=q[0]*q[0]+q[1]*q[1]+q[2]*q[2],base=baseBrick.values[index],mult=bodyMultiplier(object,q,bodies);
    let density=clamp(base*mult,0,1.8);if(density<W5_EMPTY_THRESHOLD)density=0;values[index]=density;
    if(q2<1){inside++;if(density<=0)insideEmpty++;}
    if(density>0){occupied++;sum+=density;maxDensity=Math.max(maxDensity,density);}
    index++;
  }
  for(let z=0;z<resolution;z++)for(let x=0;x<resolution;x++){
    let occupiedColumn=false;for(let y=0;y<resolution;y++){const idx=x+y*resolution+z*resolution*resolution;if(values[idx]>W5_EMPTY_THRESHOLD){occupiedColumn=true;break;}}
    if(!occupiedColumn)gapColumns++;
  }
  const originalMass=baseBrick.values.reduce((a,v)=>a+v,0),newMass=values.reduce((a,v)=>a+v,0),massRatio=newMass>0?originalMass/newMass:1;
  const correction=clamp(massRatio,.72,1.38);
  if(Math.abs(correction-1)>.001){for(let i=0;i<values.length;i++)values[i]=clamp(values[i]*correction,0,1.8);}
  return freeze({...baseBrick,
    schema:FAP1_W5_MESO_BODY_SCHEMA,
    generation:W5_MESO_GENERATION,
    address:String(baseBrick.address).replace(/:G\d+$/,`:G${W5_MESO_GENERATION}`),
    values,
    mesoBodyField:true,
    mesoBodyCount:bodies.length,
    mesoBodies:bodies,
    bodyOwnershipWeatherId:object.ID_i,
    bodyDifferentiationAuthority:'W5_ONLY_PARENT_FAP1_ID_PRESERVED',
    verticalIntervalsDifferentiated:new Set(bodies.map(b=>`${b.baseOffset.toFixed(3)}:${b.topOffset.toFixed(3)}`)).size>1,
    gapColumnFraction:gapColumns/(resolution*resolution),
    interiorEmptySampleFraction:inside?insideEmpty/inside:0,
    occupiedSampleCount:occupied,
    occupancyFraction:occupied/values.length,
    meanOccupiedDensity:occupied?sum/occupied:0,
    maxDensity,
    macroWeatherMutation:false,
    l5LightingMutation:false,
    noContinuousShellIntent:true,
    massCorrectionApplied:correction
  });
}

export function createW5RefinementState(spatialState){
  const base=createBaseW5RefinementState(spatialState);
  if(!base.active)return base;
  const entry=(spatialState?.objects??[]).find(x=>x.object?.ID_i===base.activeWeatherId);
  if(!entry?.object)throw new Error('FAP1_W5_MESO_ACTIVE_OBJECT_MISSING');
  const brick=transformBrick(base.brick,entry.object);
  return freeze({...base,schema:FAP1_W5_MESO_BODY_SCHEMA,brick,mesoBodyField:true,mesoBodyCount:brick.mesoBodyCount});
}

export function verifyW5RefinementState(state){
  const base=verifyBaseW5RefinementState(state);
  const failures=[...base.failures];
  if(state?.active){
    if(state.brick?.mesoBodyField!==true)failures.push('MESO_BODY_FIELD_MISSING');
    if(!(state.brick?.mesoBodyCount>=4))failures.push('MESO_BODY_COUNT_INSUFFICIENT');
    if(state.brick?.bodyOwnershipWeatherId!==state.activeWeatherId)failures.push('MESO_BODY_WEATHER_IDENTITY_MISMATCH');
    if(state.brick?.verticalIntervalsDifferentiated!==true)failures.push('MESO_VERTICAL_INTERVALS_NOT_DIFFERENTIATED');
    if(state.brick?.macroWeatherMutation!==false)failures.push('MACRO_WEATHER_MUTATION_FORBIDDEN');
    if(state.brick?.l5LightingMutation!==false)failures.push('L5_MUTATION_FORBIDDEN');
  }
  return freeze({schema:'FAP1_W5_MESO_BODY_INVARIANTS_v1',pass:failures.length===0,failures:freeze(failures),activeWeatherId:state?.activeWeatherId??null});
}

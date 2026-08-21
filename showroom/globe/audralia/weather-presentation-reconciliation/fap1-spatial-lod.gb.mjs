import {buildFAP1GPUWeatherPacket} from './fap1-gpu-weather-descriptors.mjs';

const freeze=value=>Object.freeze(value);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a||1),0,1);return t*t*(3-2*t);};
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const scale=(a,s)=>a.map(v=>v*s);
const length=v=>Math.hypot(...v);
const norm=v=>{const l=length(v)||1;return v.map(x=>x/l);};

export const FAP1_GB_SPATIAL_LOD_SCHEMA='FAP1_GB_WEATHER_OBJECT_SPATIAL_LOD_RECOVERY_v2_BOUNDED_LOCAL';
export const PLANET_RADIUS=6200;
export const PLANET_CENTER=freeze([0,-PLANET_RADIUS,0]);
export const NORTH=freeze([0,.5,-.8660254037844386]);
export const MERIDIAN=freeze([0,.8660254037844386,.5]);
export const EAST=freeze([1,0,0]);
export const MAX_LOCAL_VOLUMETRIC_OBJECTS=2;
export const VERTICAL_WORLD_SCALE=7.2;
export const VERTICAL_WORLD_FLOOR=10;

// W5 is a bounded refinement inside a persistent regional weather object.
// These are local representation ceilings, never replacements for the FAP1
// macro footprint retained in F_i/sourceDescriptor.
export const W5_LOCAL_HORIZONTAL_PROFILE=freeze({
  HIGH_ICE:freeze([900,540]),
  MID_FRONTAL:freeze([760,460]),
  LOW_CUMULIFORM:freeze([420,320]),
  DEEP_CONVECTION:freeze([360,320]),
  CYCLONE:freeze([520,420])
});

function radialAt(latitudeDeg,longitudeDeg){
  const lat=latitudeDeg*Math.PI/180,lon=longitudeDeg*Math.PI/180;
  const c=Math.cos(lat),s=Math.sin(lat),cl=Math.cos(lon),sl=Math.sin(lon);
  return norm([
    EAST[0]*c*sl+MERIDIAN[0]*c*cl+NORTH[0]*s,
    EAST[1]*c*sl+MERIDIAN[1]*c*cl+NORTH[1]*s,
    EAST[2]*c*sl+MERIDIAN[2]*c*cl+NORTH[2]*s
  ]);
}

function frameAt(latitudeDeg,longitudeDeg){
  const lat=latitudeDeg*Math.PI/180,lon=longitudeDeg*Math.PI/180;
  const s=Math.sin(lat),c=Math.cos(lat),sl=Math.sin(lon),cl=Math.cos(lon);
  const axisUp=radialAt(latitudeDeg,longitudeDeg);
  const axisU=norm([
    EAST[0]*cl-MERIDIAN[0]*sl,
    EAST[1]*cl-MERIDIAN[1]*sl,
    EAST[2]*cl-MERIDIAN[2]*sl
  ]);
  const axisV=norm([
    NORTH[0]*c-EAST[0]*s*sl-MERIDIAN[0]*s*cl,
    NORTH[1]*c-EAST[1]*s*sl-MERIDIAN[1]*s*cl,
    NORTH[2]*c-EAST[2]*s*sl-MERIDIAN[2]*s*cl
  ]);
  return freeze({axisU:freeze(axisU),axisV:freeze(axisV),axisUp:freeze(axisUp)});
}

function worldAltitude(km){return VERTICAL_WORLD_FLOOR+km*VERTICAL_WORLD_SCALE;}
function worldPosition(radial,altitude){const r=PLANET_RADIUS+altitude;return freeze([PLANET_CENTER[0]+radial[0]*r,PLANET_CENTER[1]+radial[1]*r,PLANET_CENTER[2]+radial[2]*r]);}
function boundedLocalRadii(system,verticalRadius){
  const profile=W5_LOCAL_HORIZONTAL_PROFILE[system.weatherClass]??[480,360];
  return freeze([Math.min(system.majorKm,profile[0]),verticalRadius,Math.min(system.minorKm,profile[1])]);
}

export function buildFAP1SpatialWeatherObjects({canonicalTimeHours=0,packet=null}={}){
  const source=packet??buildFAP1GPUWeatherPacket({canonicalTimeHours});
  if(source?.meteorologicalAuthority!=='FAP1_ONLY'||source?.rendererMayCreateWeather!==false)throw new Error('FAP1_GB_REQUIRES_FAP1_ONLY_PACKET');
  return freeze(source.systems.map(system=>{
    const frame=frameAt(system.latitudeDeg,system.longitudeDeg);
    const base=worldAltitude(system.baseKm),top=worldAltitude(system.topKm),centerAltitude=(base+top)*.5;
    const center=worldPosition(frame.axisUp,centerAltitude),verticalRadius=(top-base)*.5;
    const canonicalDensity=Number.isFinite(system.canonicalDensity)?system.canonicalDensity:system.density;
    const localRadii=boundedLocalRadii(system,verticalRadius);
    return freeze({
      ID_i:system.id,
      weatherClass:system.weatherClass,
      sourceDescriptor:system,
      F_i:freeze({latitudeDeg:system.latitudeDeg,longitudeDeg:system.longitudeDeg,majorKm:system.majorKm,minorKm:system.minorKm,macroRadii:freeze([system.majorKm,verticalRadius,system.minorKm])}),
      Z_i:freeze({base,top,centerAltitude}),
      W_i:freeze({density:canonicalDensity,canonicalDensity,representationContribution:system.representationContribution??1,seed:system.seed,genus:system.genus,ice:system.ice,precip:system.precip,support:system.support}),
      V_i:freeze({center,axisU:frame.axisU,axisV:frame.axisV,axisUp:frame.axisUp,radii:localRadii,representation:'W5_BOUNDED_LOCAL_REFINEMENT',macroFootprintPreserved:true}),
      authority:'FAP1_DESCRIPTOR_ONLY',
      representationLaw:'LOD_CHANGES_WEATHER_REPRESENTATION_NOT_WEATHER_STATE'
    });
  }));
}

export function localCoordinates(point,object){
  const d=sub(point,object.V_i.center),r=object.V_i.radii;
  return freeze([dot(d,object.V_i.axisU)/r[0],dot(d,object.V_i.axisUp)/r[1],dot(d,object.V_i.axisV)/r[2]]);
}

export function pointInsideWeatherVolume(point,object){const q=localCoordinates(point,object);return dot(q,q)<=1+1e-9;}

export function distanceToWeatherVolume(point,object){
  const delta=sub(point,object.V_i.center),physicalDistance=length(delta);
  if(physicalDistance<=1e-9)return 0;
  const q=localCoordinates(point,object),qLength=length(q);
  if(qLength<=1+1e-9)return 0;
  const ellipsoidRadiusAlongRay=physicalDistance/qLength;
  return Math.max(0,physicalDistance-ellipsoidRadiusAlongRay);
}

export function rayWeatherVolumeInterval(origin,direction,object){
  const d=sub(origin,object.V_i.center),r=object.V_i.radii,rd=norm(direction);
  const ro=[dot(d,object.V_i.axisU)/r[0],dot(d,object.V_i.axisUp)/r[1],dot(d,object.V_i.axisV)/r[2]];
  const rv=[dot(rd,object.V_i.axisU)/r[0],dot(rd,object.V_i.axisUp)/r[1],dot(rd,object.V_i.axisV)/r[2]];
  const a=dot(rv,rv),b=2*dot(ro,rv),c=dot(ro,ro)-1,disc=b*b-4*a*c;
  if(!(disc>=0)||a<=1e-12)return null;
  const root=Math.sqrt(disc),tA=(-b-root)/(2*a),tB=(-b+root)/(2*a),enter=Math.max(0,Math.min(tA,tB)),exit=Math.max(tA,tB);
  return exit>enter?freeze({enter,exit,length:exit-enter}):null;
}

export function lodWeights(distanceToVolume){
  const d=Math.max(0,distanceToVolume),local=1-smooth(720,1450,d),planetary=smooth(2400,4300,d),regional=Math.max(0,1-local-planetary),sum=local+regional+planetary||1;
  return freeze({p:planetary/sum,r:regional/sum,l:local/sum});
}

export function evaluateFAP1SpatialLOD(objects,camera){
  const forward=norm(camera.forward);
  const entries=objects.map(object=>{
    const toCenter=sub(object.V_i.center,camera.eye),distance=length(toCenter),distanceToVolume=distanceToWeatherVolume(camera.eye,object),inside=pointInsideWeatherVolume(camera.eye,object),forwardDot=distance>1e-9?dot(norm(toCenter),forward):1,Q_i=inside||(distanceToVolume<6900&&forwardDot>-.58);
    return {object,distance,distanceToVolume,inside,forwardDot,Q_i,weights:lodWeights(distanceToVolume)};
  });
  const candidates=entries.filter(x=>x.Q_i&&x.weights.l>.001).sort((a,b)=>a.distanceToVolume-b.distanceToVolume||a.object.ID_i.localeCompare(b.object.ID_i));
  const promoted=new Set(candidates.slice(0,MAX_LOCAL_VOLUMETRIC_OBJECTS).map(x=>x.object.ID_i));
  const resolved=entries.map(entry=>{
    let {p,r,l}=entry.weights;
    if(entry.Q_i&&l>.001&&!promoted.has(entry.object.ID_i)){r+=l;l=0;}
    if(!entry.Q_i){p=0;r=0;l=0;}
    const sum=p+r+l;if(entry.Q_i&&sum>0){p/=sum;r/=sum;l/=sum;}
    return freeze({...entry,alpha:freeze({p,r,l}),localPromoted:promoted.has(entry.object.ID_i)});
  });
  return freeze({schema:FAP1_GB_SPATIAL_LOD_SCHEMA,objects:freeze(resolved),activeLocalCount:promoted.size,maxLocalCount:MAX_LOCAL_VOLUMETRIC_OBJECTS,visibleRendererMutation:false,w5DensityActive:true,l5LightingActive:false});
}

export function weatherBrickAddress(object,bx,by,bz,generation=0){
  for(const v of [bx,by,bz,generation])if(!Number.isInteger(v))throw new Error('FAP1_GB_BRICK_ADDRESS_INTEGER_REQUIRED');
  return `${object.ID_i}:B${bx},${by},${bz}:G${generation}`;
}

export function verifyFAP1SpatialLOD(state,epsilon=1e-6){
  const failures=[];
  if(state.activeLocalCount>MAX_LOCAL_VOLUMETRIC_OBJECTS)failures.push('LOCAL_PROMOTION_CAP_EXCEEDED');
  const ids=new Set();
  for(const entry of state.objects){
    if(ids.has(entry.object.ID_i))failures.push(`DUPLICATE_ID:${entry.object.ID_i}`);ids.add(entry.object.ID_i);
    if(entry.object.authority!=='FAP1_DESCRIPTOR_ONLY')failures.push(`NON_FAP1_AUTHORITY:${entry.object.ID_i}`);
    if(entry.Q_i&&Math.abs(entry.alpha.p+entry.alpha.r+entry.alpha.l-1)>epsilon)failures.push(`LOD_SUM:${entry.object.ID_i}`);
    if(!entry.Q_i&&(entry.alpha.p!==0||entry.alpha.r!==0||entry.alpha.l!==0))failures.push(`IRRELEVANT_NONZERO_ALPHA:${entry.object.ID_i}`);
    if(!(entry.object.W_i.canonicalDensity>0))failures.push(`CANONICAL_DENSITY_MISSING:${entry.object.ID_i}`);
    if(entry.object.V_i?.representation!=='W5_BOUNDED_LOCAL_REFINEMENT')failures.push(`LOCAL_REFINEMENT_VOLUME_MISSING:${entry.object.ID_i}`);
    if(entry.object.V_i?.macroFootprintPreserved!==true)failures.push(`MACRO_FOOTPRINT_PRESERVATION_MISSING:${entry.object.ID_i}`);
  }
  return freeze({schema:'FAP1_GB_SPATIAL_LOD_INVARIANTS_v2_BOUNDED_LOCAL',pass:failures.length===0,failures:freeze(failures),w5DensityActive:true,visibleRendererMutation:false});
}

const freeze=value=>Object.freeze(value);
const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
const smooth=(a,b,value)=>{const t=clamp((value-a)/(b-a||1),0,1);return t*t*(3-2*t);};
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const scale=(a,s)=>a.map(v=>v*s);
const length=v=>Math.hypot(...v);
const norm=v=>{const l=length(v)||1;return v.map(x=>x/l);};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];

export const PROOF_SCHEMA='AUDRALIA_BOUNDED_CANONICAL_WEATHER_SPATIAL_LOD_PROOF_v1';
export const FUNCTIONAL_WORLD_AUTHORITY='9eb936918ce063cef6c6f5d800f39ae966f3d3aa';
export const FUNCTIONAL_VISUAL_PARENT='798d3b034ed9814574e5cbe189ef280eb857602e';
export const PLANET_RADIUS=6200;
export const PLANET_CENTER=freeze([0,-PLANET_RADIUS,0]);
export const MAX_LOCAL_VOLUMETRIC_OBJECTS=2;
export const LOCAL_CENTER_Z=-128;

export const CANONICAL_WEATHER_DEFINITIONS=freeze([
  freeze({
    id:'WX_GRATITUDE_SUMMIT_001',
    region:'AUDRALIA/GRATITUDE',
    footprint:freeze({centerU:126,centerV:-82,radiusU:142,radiusV:94}),
    vertical:freeze({requestedBase:34,clearance:8,thickness:58}),
    weather:freeze({class:'OROGRAPHIC_CUMULUS',density:.78,seed:.17,temperatureClass:'MOIST_UPLIFT'}),
    purpose:'SUMMIT_CLOUD_DEPTH_AND_TERRAIN_ORDERING_WITNESS'
  }),
  freeze({
    id:'WX_GRATITUDE_COASTAL_001',
    region:'AUDRALIA/GRATITUDE',
    footprint:freeze({centerU:-58,centerV:126,radiusU:230,radiusV:112}),
    vertical:freeze({requestedBase:66,clearance:18,thickness:48}),
    weather:freeze({class:'COASTAL_STRATOCUMULUS',density:.54,seed:.41,temperatureClass:'MARINE_BOUNDARY'}),
    purpose:'OFFSHORE_CLEAR_AIR_AND_LOW_CLOUD_WITNESS'
  }),
  freeze({
    id:'WX_GRATITUDE_HIGH_001',
    region:'AUDRALIA/GRATITUDE',
    footprint:freeze({centerU:-142,centerV:-154,radiusU:260,radiusV:126}),
    vertical:freeze({requestedBase:148,clearance:42,thickness:36}),
    weather:freeze({class:'HIGH_ALTOSTRATUS',density:.34,seed:.73,temperatureClass:'HIGH_LAYER'}),
    purpose:'DISTANT_CONCURRENT_WEATHER_AND_LOD_IDENTITY_WITNESS'
  })
]);

export function tangentDirection(u,v){
  const radius=Math.hypot(u,v);
  if(radius<1e-9)return[0,1,0];
  const angle=radius/PLANET_RADIUS,sine=Math.sin(angle),cosine=Math.cos(angle);
  return norm([sine*u/radius,cosine,sine*v/radius]);
}
export function surfacePosition(direction,elevation=0){
  const radius=PLANET_RADIUS+elevation;
  return [PLANET_CENTER[0]+direction[0]*radius,PLANET_CENTER[1]+direction[1]*radius,PLANET_CENTER[2]+direction[2]*radius];
}
export function tangentPosition(u,v,elevation=0){return surfacePosition(tangentDirection(u,v),elevation);}
export function frameAt(u,v){
  const up=tangentDirection(u,v);
  const u1=tangentPosition(u+1,v),u0=tangentPosition(u-1,v),v1=tangentPosition(u,v+1),v0=tangentPosition(u,v-1);
  const axisU=norm(sub(u1,u0));
  let axisV=norm(sub(v1,v0));
  if(dot(cross(axisU,axisV),up)<0)axisV=scale(axisV,-1);
  return freeze({axisU:freeze(axisU),axisV:freeze(axisV),axisUp:freeze(up)});
}

function terrainMaximumForFootprint(definition,sampleSurface){
  const f=definition.footprint;
  let maximum=-Infinity,validSamples=0;
  for(let iu=-3;iu<=3;iu++)for(let iv=-3;iv<=3;iv++){
    const du=iu/3,dv=iv/3;
    if(du*du+dv*dv>1.000001)continue;
    const sample=sampleSurface(f.centerU+du*f.radiusU,f.centerV+dv*f.radiusV);
    if(sample?.valid!==true||!Number.isFinite(sample.elevation))continue;
    maximum=Math.max(maximum,sample.elevation);validSamples++;
  }
  if(!Number.isFinite(maximum))maximum=0;
  return freeze({maximum,validSamples});
}

export function buildCanonicalWeatherObjects(sampleSurface){
  if(typeof sampleSurface!=='function')throw new Error('CANONICAL_WEATHER_SURFACE_SAMPLER_REQUIRED');
  return freeze(CANONICAL_WEATHER_DEFINITIONS.map(definition=>{
    const terrain=terrainMaximumForFootprint(definition,sampleSurface);
    const base=Math.max(definition.vertical.requestedBase,terrain.maximum+definition.vertical.clearance);
    const top=base+definition.vertical.thickness;
    const centerAltitude=(base+top)*.5;
    const f=definition.footprint,frame=frameAt(f.centerU,f.centerV);
    const center=tangentPosition(f.centerU,f.centerV,centerAltitude);
    const object=freeze({
      ID_i:definition.id,
      R_i:definition.region,
      F_i:freeze({...f}),
      Z_i:freeze({base,top,centerAltitude,terrainMaximum:terrain.maximum,clearance:base-terrain.maximum,terrainSampleCount:terrain.validSamples}),
      W_i:definition.weather,
      V_i:freeze({center:freeze(center),axisU:frame.axisU,axisV:frame.axisV,axisUp:frame.axisUp,radii:freeze([f.radiusU,(top-base)*.5,f.radiusV])}),
      purpose:definition.purpose,
      terrainClearanceIsRenderingGeometry:false
    });
    return object;
  }));
}

export function lodWeights(distanceToVolume){
  const d=Math.max(0,distanceToVolume);
  const local=1-smooth(720,1450,d);
  const planetary=smooth(2400,4300,d);
  const regional=Math.max(0,1-local-planetary);
  const sum=local+regional+planetary||1;
  return freeze({p:planetary/sum,r:regional/sum,l:local/sum});
}

export function pointInsideVolume(point,object){
  const d=sub(point,object.V_i.center),r=object.V_i.radii;
  const q=[dot(d,object.V_i.axisU)/r[0],dot(d,object.V_i.axisUp)/r[1],dot(d,object.V_i.axisV)/r[2]];
  return dot(q,q)<=1+1e-9;
}

export function rayVolumeInterval(origin,direction,object){
  const d=sub(origin,object.V_i.center),r=object.V_i.radii;
  const ro=[dot(d,object.V_i.axisU)/r[0],dot(d,object.V_i.axisUp)/r[1],dot(d,object.V_i.axisV)/r[2]];
  const rd=[dot(direction,object.V_i.axisU)/r[0],dot(direction,object.V_i.axisUp)/r[1],dot(direction,object.V_i.axisV)/r[2]];
  const a=dot(rd,rd),b=2*dot(ro,rd),c=dot(ro,ro)-1,disc=b*b-4*a*c;
  if(!(disc>=0)||a<=1e-12)return null;
  const root=Math.sqrt(disc),t0=(-b-root)/(2*a),t1=(-b+root)/(2*a),enter=Math.max(0,Math.min(t0,t1)),exit=Math.max(t0,t1);
  if(exit<=enter)return null;
  return freeze({enter,exit,length:exit-enter});
}

function hashWave(x,y,z,seed){return .5+.5*Math.sin(x*2.13+y*3.71+z*1.83+seed*19.7+Math.sin(x*1.17-z*.91+seed*7.1));}
function localDensityAt(object,point){
  const d=sub(point,object.V_i.center),r=object.V_i.radii;
  const q=[dot(d,object.V_i.axisU)/r[0],dot(d,object.V_i.axisUp)/r[1],dot(d,object.V_i.axisV)/r[2]];
  const radius2=dot(q,q);
  if(radius2>=1)return 0;
  const edge=(1-radius2)*(1-radius2),broad=.72+.28*hashWave(q[0]*2.2,q[1]*2.7,q[2]*2.0,object.W_i.seed),detail=.76+.24*hashWave(q[0]*5.1,q[1]*4.3,q[2]*4.8,object.W_i.seed+.37);
  return object.W_i.density*edge*broad*detail;
}
function regionalDensityAt(object,point){
  const d=sub(point,object.V_i.center),r=object.V_i.radii;
  const q=[dot(d,object.V_i.axisU)/r[0],dot(d,object.V_i.axisUp)/r[1],dot(d,object.V_i.axisV)/r[2]];
  const radius2=dot(q,q);if(radius2>=1)return 0;
  return object.W_i.density*(1-radius2)*(.78+.22*hashWave(q[0]*1.8,q[1]*1.5,q[2]*1.9,object.W_i.seed));
}
function planetaryDensityAt(object,point){
  const d=sub(point,object.V_i.center),r=object.V_i.radii;
  const q=[dot(d,object.V_i.axisU)/r[0],dot(d,object.V_i.axisUp)/r[1],dot(d,object.V_i.axisV)/r[2]];
  const radius2=dot(q,q);return radius2<1?object.W_i.density*(1-radius2)*.72:0;
}
function integrateDensity(object,ray,interval,samples,densityAt,scaleFactor){
  if(!interval)return 0;
  const step=interval.length/samples;let tau=0;
  for(let i=0;i<samples;i++){
    const t=interval.enter+(i+.5)*step,point=add(ray.origin,scale(ray.direction,t));
    tau+=densityAt(object,point)*step*scaleFactor;
  }
  return tau;
}

export function evaluateSpatialState(objects,camera){
  const forward=norm(camera.forward),entries=objects.map(object=>{
    const toCenter=sub(object.V_i.center,camera.eye),distance=length(toCenter),boundRadius=Math.max(...object.V_i.radii),distanceToVolume=Math.max(0,distance-boundRadius),inside=pointInsideVolume(camera.eye,object),forwardDot=distance>1e-9?dot(norm(toCenter),forward):1;
    const Q_i=inside||(distanceToVolume<6900&&forwardDot>-.58);
    return {object,distance,distanceToVolume,inside,forwardDot,Q_i,weights:lodWeights(distanceToVolume)};
  });
  const candidates=entries.filter(entry=>entry.Q_i&&entry.weights.l>.001).sort((a,b)=>a.distanceToVolume-b.distanceToVolume||a.object.ID_i.localeCompare(b.object.ID_i));
  const promoted=new Set(candidates.slice(0,MAX_LOCAL_VOLUMETRIC_OBJECTS).map(entry=>entry.object.ID_i));
  const resolved=entries.map(entry=>{
    let {p,r,l}=entry.weights;
    if(entry.Q_i&&l>.001&&!promoted.has(entry.object.ID_i)){r+=l;l=0;}
    if(!entry.Q_i){p=0;r=0;l=0;}
    const sum=p+r+l;
    if(entry.Q_i&&sum>0){p/=sum;r/=sum;l/=sum;}
    return freeze({...entry,alpha:freeze({p,r,l}),localPromoted:promoted.has(entry.object.ID_i)});
  });
  return freeze({objects:freeze(resolved),activeLocalCount:promoted.size,maxLocalCount:MAX_LOCAL_VOLUMETRIC_OBJECTS});
}

export function evaluateRayDiagnostics(spatialState,camera){
  const ray=freeze({origin:camera.eye,direction:norm(camera.forward)});
  const diagnostics=spatialState.objects.map(entry=>{
    const interval=rayVolumeInterval(ray.origin,ray.direction,entry.object),L_i=interval?.length??0;
    const tauP=integrateDensity(entry.object,ray,interval,4,planetaryDensityAt,.010);
    const tauR=integrateDensity(entry.object,ray,interval,8,regionalDensityAt,.012);
    const tauL=integrateDensity(entry.object,ray,interval,14,localDensityAt,.014);
    const tau_i=entry.Q_i?(entry.alpha.p*tauP+entry.alpha.r*tauR+entry.alpha.l*tauL):0;
    return freeze({
      ID_i:entry.object.ID_i,F_i:entry.object.F_i,Z_i:entry.object.Z_i,Q_i:entry.Q_i,
      alpha_i:entry.alpha,I_camera_i:entry.inside,L_i,tau_i,
      tauRepresentations:freeze({p:tauP,r:tauR,l:tauL}),
      localPromoted:entry.localPromoted,distanceToVolume:entry.distanceToVolume
    });
  });
  return freeze(diagnostics);
}

export function verifyProofInvariants(spatialState,rayDiagnostics,epsilon=1e-6){
  const failures=[];
  for(const state of spatialState.objects){
    if(state.Q_i){const sum=state.alpha.p+state.alpha.r+state.alpha.l;if(Math.abs(sum-1)>epsilon)failures.push(`${state.object.ID_i}:LOD_SUM:${sum}`);}
    else if(state.alpha.p!==0||state.alpha.r!==0||state.alpha.l!==0)failures.push(`${state.object.ID_i}:IRRELEVANT_NONZERO_ALPHA`);
    if(state.object.terrainClearanceIsRenderingGeometry!==false)failures.push(`${state.object.ID_i}:CLEARANCE_RENDERING_AUTHORITY`);
  }
  for(const diag of rayDiagnostics){
    if(diag.L_i<=epsilon&&Math.abs(diag.tau_i)>epsilon)failures.push(`${diag.ID_i}:TAU_WITHOUT_RAY_INTERSECTION`);
    if(diag.I_camera_i&&diag.Q_i!==true)failures.push(`${diag.ID_i}:CAMERA_INSIDE_NOT_RELEVANT`);
  }
  if(spatialState.activeLocalCount>spatialState.maxLocalCount)failures.push(`LOCAL_PROMOTION_CAP:${spatialState.activeLocalCount}`);
  const ids=new Set(spatialState.objects.map(x=>x.object.ID_i));
  if(ids.size!==spatialState.objects.length)failures.push('DUPLICATE_CANONICAL_ID');
  return freeze({schema:'AUDRALIA_CANONICAL_WEATHER_RUNTIME_INVARIANTS_v1',pass:failures.length===0,epsilon,failures:freeze(failures),activeLocalCount:spatialState.activeLocalCount,maxLocalCount:spatialState.maxLocalCount});
}

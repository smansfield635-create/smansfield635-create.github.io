import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE as TERRAIN,
  resolveHEarthMapWideShorelineZ
} from '../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js';

const freeze=value=>Object.freeze(value);
const clamp=(value,minimum,maximum)=>Math.min(maximum,Math.max(minimum,value));
const mix=(a,b,t)=>a+(b-a)*t;
const LOCAL_CENTER_Z=-128;
const PROTECTED_LOCAL_MIN=-320;
const PROTECTED_LOCAL_MAX=320;
const LOCAL_SAMPLE_STEP=2;
const MACRO_TARGET_CHORD=6;
const MACRO_MIN_SAMPLES=4;
const MACRO_MAX_SAMPLES=48;
const CURVE_ALPHA=.5;
const DISTANCE_CAP=900;
const DISTANCE_BIN=72;
const RAY_BIN=36;

const distance2=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const distanceToSegment=(point,a,b)=>{
  const du=b[0]-a[0],dv=b[1]-a[1],den=du*du+dv*dv||1;
  const t=clamp(((point[0]-a[0])*du+(point[1]-a[1])*dv)/den,0,1);
  const x=a[0]+du*t,z=a[1]+dv*t;
  return freeze({distance:Math.hypot(point[0]-x,point[1]-z),t,point:freeze([x,z])});
};
const orient=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
const onSegment=(a,b,p)=>Math.abs(orient(a,b,p))<1e-8&&p[0]>=Math.min(a[0],b[0])-1e-8&&p[0]<=Math.max(a[0],b[0])+1e-8&&p[1]>=Math.min(a[1],b[1])-1e-8&&p[1]<=Math.max(a[1],b[1])+1e-8;
function segmentsIntersect(a,b,c,d){
  const o1=orient(a,b,c),o2=orient(a,b,d),o3=orient(c,d,a),o4=orient(c,d,b);
  if(((o1>0&&o2<0)||(o1<0&&o2>0))&&((o3>0&&o4<0)||(o3<0&&o4>0)))return true;
  return onSegment(a,b,c)||onSegment(a,b,d)||onSegment(c,d,a)||onSegment(c,d,b);
}

function gratitudeShorelineZ(u){
  const x=clamp(u,-256,256),local=resolveHEarthMapWideShorelineZ(x);
  const macro=-58+19*Math.sin((u+170)/420)+11*Math.sin((u-260)/175)+8*Math.sin((u+30)/83);
  const q=clamp((Math.abs(u)-256)/(620-256),0,1),s=q*q*(3-2*q);
  return mix(local,macro,s);
}

const COAST_CONTROL_POINTS=freeze([
  [-1710,-270],[-1540,-20],[-1280,150],[-1010,170],[-770,95],[-590,235],[-430,145],
  [-384,gratitudeShorelineZ(-384)-LOCAL_CENTER_Z],[-320,gratitudeShorelineZ(-320)-LOCAL_CENTER_Z],
  [-256,gratitudeShorelineZ(-256)-LOCAL_CENTER_Z],[-192,gratitudeShorelineZ(-192)-LOCAL_CENTER_Z],
  [-96,gratitudeShorelineZ(-96)-LOCAL_CENTER_Z],[0,gratitudeShorelineZ(0)-LOCAL_CENTER_Z],
  [96,gratitudeShorelineZ(96)-LOCAL_CENTER_Z],[192,gratitudeShorelineZ(192)-LOCAL_CENTER_Z],
  [256,gratitudeShorelineZ(256)-LOCAL_CENTER_Z],[320,gratitudeShorelineZ(320)-LOCAL_CENTER_Z],
  [384,gratitudeShorelineZ(384)-LOCAL_CENTER_Z],[500,190],[690,105],[860,15],[1030,-105],
  [1180,-280],[1510,-390],[1490,-565],[1290,-680],[1430,-885],[1180,-965],[930,-1115],
  [1180,-1270],[990,-1460],[690,-1545],[470,-1830],[165,-1995],[-120,-1845],[-350,-1575],
  [-635,-1675],[-920,-1810],[-1190,-1595],[-1050,-1360],[-1405,-1235],[-1535,-965],
  [-1280,-825],[-1605,-705],[-1700,-505]
].map(point=>freeze(point)));

function knot(t,a,b){return t+Math.pow(Math.max(distance2(a,b),1e-9),CURVE_ALPHA);}
function interpolateParam(a,b,ta,tb,t){
  if(Math.abs(tb-ta)<1e-12)return freeze([a[0],a[1]]);
  const q=(t-ta)/(tb-ta);return freeze([mix(a[0],b[0],q),mix(a[1],b[1],q)]);
}
function catmullPoint(p0,p1,p2,p3,t){
  const t0=0,t1=knot(t0,p0,p1),t2=knot(t1,p1,p2),t3=knot(t2,p2,p3),tt=mix(t1,t2,t);
  const a1=interpolateParam(p0,p1,t0,t1,tt),a2=interpolateParam(p1,p2,t1,t2,tt),a3=interpolateParam(p2,p3,t2,t3,tt);
  const b1=interpolateParam(a1,a2,t0,t2,tt),b2=interpolateParam(a2,a3,t1,t3,tt);
  return interpolateParam(b1,b2,t1,t2,tt);
}
function segmentSamples(index){
  const n=COAST_CONTROL_POINTS.length,p0=COAST_CONTROL_POINTS[(index-1+n)%n],p1=COAST_CONTROL_POINTS[index],p2=COAST_CONTROL_POINTS[(index+1)%n],p3=COAST_CONTROL_POINTS[(index+2)%n];
  const length=distance2(p1,p2),count=clamp(Math.ceil(length/MACRO_TARGET_CHORD),MACRO_MIN_SAMPLES,MACRO_MAX_SAMPLES),allowed=clamp(.15*length,6,24);
  let samples=[];
  for(let i=0;i<count;i++)samples.push(catmullPoint(p0,p1,p2,p3,i/count));
  const violates=samples.some(point=>Math.min(distanceToSegment(point,p0,p1).distance,distanceToSegment(point,p1,p2).distance,distanceToSegment(point,p2,p3).distance)>allowed);
  if(violates){samples=[];for(let i=0;i<count;i++)samples.push(freeze([mix(p1[0],p2[0],i/count),mix(p1[1],p2[1],i/count)]));}
  return freeze({samples:freeze(samples),fallback:violates});
}
function dedupeLoop(points){
  const result=[];for(const point of points){const previous=result[result.length-1];if(!previous||distance2(previous,point)>1e-8)result.push(freeze([point[0],point[1]]));}
  if(result.length>1&&distance2(result[0],result[result.length-1])<1e-8)result.pop();return freeze(result);
}
function buildMainlandCandidate(forceLinear=false){
  const result=[],fallbackSegments=[];
  const appendSegment=index=>{
    const resolved=segmentSamples(index);if(resolved.fallback)fallbackSegments.push(index);
    if(forceLinear){const p1=COAST_CONTROL_POINTS[index],p2=COAST_CONTROL_POINTS[(index+1)%COAST_CONTROL_POINTS.length],count=clamp(Math.ceil(distance2(p1,p2)/MACRO_TARGET_CHORD),MACRO_MIN_SAMPLES,MACRO_MAX_SAMPLES);for(let i=0;i<count;i++)result.push(freeze([mix(p1[0],p2[0],i/count),mix(p1[1],p2[1],i/count)]));}
    else result.push(...resolved.samples);
  };
  for(let index=0;index<=7;index++)appendSegment(index);
  for(let u=PROTECTED_LOCAL_MIN;u<PROTECTED_LOCAL_MAX;u+=LOCAL_SAMPLE_STEP)result.push(freeze([u,resolveHEarthMapWideShorelineZ(u)-LOCAL_CENTER_Z]));
  for(let index=16;index<COAST_CONTROL_POINTS.length;index++)appendSegment(index);
  return freeze({loop:dedupeLoop(result),fallbackSegments:freeze(fallbackSegments)});
}
function hasSelfIntersection(loop){
  const bins=new Map(),n=loop.length;
  for(let i=0;i<n;i++){
    const a=loop[i],b=loop[(i+1)%n],minX=Math.min(a[0],b[0]),maxX=Math.max(a[0],b[0]),minZ=Math.min(a[1],b[1]),maxZ=Math.max(a[1],b[1]);
    const candidates=new Set();
    for(let x=Math.floor(minX/48);x<=Math.floor(maxX/48);x++)for(let z=Math.floor(minZ/48);z<=Math.floor(maxZ/48);z++)for(const prior of bins.get(`${x},${z}`)??[])candidates.add(prior);
    for(const j of candidates){if(j===i||Math.abs(j-i)===1||(i===n-1&&j===0)||(j===n-1&&i===0))continue;const c=loop[j],d=loop[(j+1)%n];if(segmentsIntersect(a,b,c,d))return true;}
    for(let x=Math.floor(minX/48);x<=Math.floor(maxX/48);x++)for(let z=Math.floor(minZ/48);z<=Math.floor(maxZ/48);z++){const key=`${x},${z}`,list=bins.get(key)??[];list.push(i);bins.set(key,list);}
  }
  return false;
}

const initialMainland=buildMainlandCandidate(false);
const MAINLAND_RESULT=hasSelfIntersection(initialMainland.loop)?buildMainlandCandidate(true):initialMainland;
const MAINLAND_LOOP=MAINLAND_RESULT.loop;

const BAR_MIGRATION=TERRAIN.coastline.sandbars;
const BAR_PHASES=freeze([.37,1.71,3.29]);
function barCenterPoint(bar,t,index){
  const length=bar.radius.x,angle=bar.rotation??0,dx=Math.cos(angle),dz=Math.sin(angle),nx=-dz,nz=dx,axis=(t-.5)*2*length,phase=BAR_PHASES[index%BAR_PHASES.length];
  const bend=bar.radius.z*(.52*Math.sin(Math.PI*t+phase)+.19*Math.sin(Math.PI*2*t-phase))*Math.sin(Math.PI*t);
  return freeze([bar.center.x+dx*axis+nx*bend,bar.center.z-LOCAL_CENTER_Z+dz*axis+nz*bend]);
}
function barWidth(bar,t,index){
  const phase=BAR_PHASES[index%BAR_PHASES.length],taper=Math.pow(Math.max(0,Math.sin(Math.PI*t)),.72),asym=.88+.16*t+.10*Math.sin(Math.PI*t+phase)+.06*Math.sin(3*Math.PI*t-phase);
  return Math.max(0,bar.radius.z*taper*clamp(asym,.72,1.18));
}
function buildSandbar(bar,index){
  const count=32,centerline=[];for(let i=0;i<=count;i++)centerline.push(barCenterPoint(bar,i/count,index));
  const right=[],left=[];
  for(let i=0;i<=count;i++){
    const t=i/count,p=centerline[i],before=centerline[Math.max(0,i-1)],after=centerline[Math.min(count,i+1)],tx=after[0]-before[0],tz=after[1]-before[1],length=Math.hypot(tx,tz)||1,nx=-tz/length,nz=tx/length,w=barWidth(bar,t,index);
    right.push(freeze([p[0]+nx*w,p[1]+nz*w]));left.push(freeze([p[0]-nx*w,p[1]-nz*w]));
  }
  const loop=[...right];for(let i=count-1;i>=1;i--)loop.push(left[i]);
  const resolvedLoop=dedupeLoop(loop),xs=resolvedLoop.map(point=>point[0]),zs=resolvedLoop.map(point=>point[1]);
  return freeze({id:bar.id,index,crestElevation:bar.crestElevation,centerline:freeze(centerline),loop:resolvedLoop,bounds:freeze({xMin:Math.min(...xs),xMax:Math.max(...xs),zMin:Math.min(...zs),zMax:Math.max(...zs)}),maximumHalfWidth:bar.radius.z,approximateHalfLength:bar.radius.x,rotation:bar.rotation??0});
}
const SANDBARS=freeze(BAR_MIGRATION.map((bar,index)=>buildSandbar(bar,index)));

function loopContains(loop,x,z,rayIndex=null){
  let inside=false;const candidates=rayIndex?.get(Math.floor(z/RAY_BIN))??null;
  const indices=candidates??loop.map((_,index)=>index);
  for(const i of indices){const a=loop[i],b=loop[(i+1)%loop.length];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/((b[1]-a[1])||1e-12)+a[0])inside=!inside;}
  return inside;
}
function buildRayIndex(loop){
  const map=new Map();for(let i=0;i<loop.length;i++){const a=loop[i],b=loop[(i+1)%loop.length],z0=Math.floor(Math.min(a[1],b[1])/RAY_BIN),z1=Math.floor(Math.max(a[1],b[1])/RAY_BIN);for(let z=z0;z<=z1;z++){const list=map.get(z)??[];list.push(i);map.set(z,list);}}
  return map;
}
function buildDistanceIndex(loop){
  const map=new Map();for(let i=0;i<loop.length;i++){const a=loop[i],b=loop[(i+1)%loop.length],x0=Math.floor(Math.min(a[0],b[0])/DISTANCE_BIN),x1=Math.floor(Math.max(a[0],b[0])/DISTANCE_BIN),z0=Math.floor(Math.min(a[1],b[1])/DISTANCE_BIN),z1=Math.floor(Math.max(a[1],b[1])/DISTANCE_BIN);for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){const key=`${x},${z}`,list=map.get(key)??[];list.push(i);map.set(key,list);}}
  return map;
}
const MAINLAND_RAY_INDEX=buildRayIndex(MAINLAND_LOOP);
const MAINLAND_DISTANCE_INDEX=buildDistanceIndex(MAINLAND_LOOP);
function indexedDistance(loop,index,x,z){
  const bx=Math.floor(x/DISTANCE_BIN),bz=Math.floor(z/DISTANCE_BIN),seen=new Set();let best=Infinity;
  for(let ring=0;ring<=Math.ceil(DISTANCE_CAP/DISTANCE_BIN);ring++){
    for(let dx=-ring;dx<=ring;dx++)for(let dz=-ring;dz<=ring;dz++){
      if(ring>0&&Math.abs(dx)!==ring&&Math.abs(dz)!==ring)continue;
      for(const i of index.get(`${bx+dx},${bz+dz}`)??[]){if(seen.has(i))continue;seen.add(i);best=Math.min(best,distanceToSegment([x,z],loop[i],loop[(i+1)%loop.length]).distance);}
    }
    if(best<Infinity&&best<Math.max(1,ring-1)*DISTANCE_BIN)return Math.min(best,DISTANCE_CAP);
  }
  return Math.min(best,DISTANCE_CAP);
}
function directLoopDistance(loop,x,z){let best=Infinity;for(let i=0;i<loop.length;i++)best=Math.min(best,distanceToSegment([x,z],loop[i],loop[(i+1)%loop.length]).distance);return best;}
function sampleSandbar(bar,x,z){
  const inside=loopContains(bar.loop,x,z),boundaryDistance=directLoopDistance(bar.loop,x,z);let centerDistance=Infinity,progress=.5;
  for(let i=0;i<bar.centerline.length-1;i++){const candidate=distanceToSegment([x,z],bar.centerline[i],bar.centerline[i+1]);if(candidate.distance<centerDistance){centerDistance=candidate.distance;progress=(i+candidate.t)/(bar.centerline.length-1);}}
  const width=barWidth(BAR_MIGRATION[bar.index],progress,bar.index),weight=inside?clamp(1-centerDistance/Math.max(width,1e-6),0,1):0;
  return freeze({id:bar.id,inside,boundaryDistance,centerDistance,progress,width,weight,crestElevation:bar.crestElevation});
}
function distanceToBounds(bounds,x,z){const dx=x<bounds.xMin?bounds.xMin-x:x>bounds.xMax?x-bounds.xMax:0,dz=z<bounds.zMin?bounds.zMin-z:z>bounds.zMax?z-bounds.zMax:0;return Math.hypot(dx,dz);}
function sampleCanonicalCoast(x,z){
  const mainland=loopContains(MAINLAND_LOOP,x,z,MAINLAND_RAY_INDEX);let distance=indexedDistance(MAINLAND_LOOP,MAINLAND_DISTANCE_INDEX,x,z),nearestComponent='MAINLAND',insideBar=null;
  for(const bar of SANDBARS){
    const lowerBound=distanceToBounds(bar.bounds,x,z);if(lowerBound>distance&&!insideBar)continue;
    const sample=sampleSandbar(bar,x,z);if(sample.inside&&!insideBar)insideBar=sample;if(sample.boundaryDistance<distance){distance=sample.boundaryDistance;nearestComponent=bar.id;}
  }
  const inside=mainland||Boolean(insideBar),component=insideBar?.id??(mainland?'MAINLAND':nearestComponent);
  return freeze({inside,distance,field:inside?distance:-distance,component,sandbar:insideBar,authority:'H_EARTH_OW01_CANONICAL_COAST_BOUNDARY_v1'});
}
function sampleCanonicalSandbar(x,z){
  let best=null,bestDistance=Infinity;for(const bar of SANDBARS){const lowerBound=distanceToBounds(bar.bounds,x,z);if(lowerBound>bestDistance)continue;const sample=sampleSandbar(bar,x,z);if(sample.boundaryDistance<bestDistance){best=sample;bestDistance=sample.boundaryDistance;}}return best;
}
function fnv1a(text){let hash=0x811c9dc5;for(let i=0;i<text.length;i++){hash^=text.charCodeAt(i);hash=Math.imul(hash,0x01000193)>>>0;}return hash>>>0;}
const HASH_INPUT=[...MAINLAND_LOOP,...SANDBARS.flatMap(bar=>bar.loop)].map(point=>`${point[0].toFixed(3)},${point[1].toFixed(3)}`).join('|');
export const BOUNDARY_IDENTITY_HASH=`fnv1a32:${fnv1a(HASH_INPUT).toString(16).padStart(8,'0')}`;
export const CANONICAL_COAST_MODEL=freeze({
  schema:'H_EARTH_OW01_CANONICAL_COAST_MODEL_v1',
  authority:'H_EARTH_OW01_CANONICAL_COAST_BOUNDARY_v1',
  boundaryIdentityHash:BOUNDARY_IDENTITY_HASH,
  mainlandLoop:MAINLAND_LOOP,
  detachedLandLoops:freeze(SANDBARS.map(bar=>bar.loop)),
  detachedSandbars:SANDBARS,
  authoringAnchorCount:COAST_CONTROL_POINTS.length,
  mainlandResolvedPointCount:MAINLAND_LOOP.length,
  macroInterpolation:'CENTRIPETAL_CATMULL_ROM_ALPHA_0_5_WITH_CORRIDOR_FALLBACK',
  protectedLocalInterval:freeze([PROTECTED_LOCAL_MIN,PROTECTED_LOCAL_MAX]),
  localCoastSampleStep:LOCAL_SAMPLE_STEP,
  macroTargetChord:MACRO_TARGET_CHORD,
  macroFallbackSegments:MAINLAND_RESULT.fallbackSegments,
  globalSelfIntersectionFallbackUsed:MAINLAND_RESULT!==initialMainland,
  rotatedEllipseCallsInCanonicalLandAuthority:0,
  sandbarRepresentation:'CURVED_VARIABLE_WIDTH_CENTERLINE',
  sandbarCount:SANDBARS.length,
  cameraDistanceCanChangeGeography:false
});
export {sampleCanonicalCoast,sampleCanonicalSandbar};
export default CANONICAL_COAST_MODEL;

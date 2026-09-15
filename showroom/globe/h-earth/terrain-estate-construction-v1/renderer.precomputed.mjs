import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE as TERRAIN,
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY as HYDRO,
  resolveHEarthMapWideReservoirBoundaryPoint,
  resolveHEarthMapWideShorelineZ,
  sampleHEarthMapWideEnvironmentTerrainCandidate as sampleTerrain
} from '/inspection/audralia-24057-exact/snapshot/h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';

export const AUDRALIA_PRECOMPUTED_RENDERER_GEOGRAPHY_BINDING=Object.freeze({
  schema:'AUDRALIA_CANONICAL_GEOGRAPHY_RENDERER_BINDING_v1',
  geographyPath:'/inspection/audralia-24057-exact/snapshot/h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js',
  geographyGitBlobSha:'50991dd777ccd015fd8a6d8eae7b4d02b4a8450c',
  terrainGitBlobSha:'f4f65b05ab303a11fb1d9c4e25de211fde73722a',
  contractId:'AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1',
  reconstructionRevision:5,
  retiredRev3Reachable:false
});

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const c01=v=>clamp(v,0,1);
const mix=(a,b,t)=>a+(b-a)*t;
const mix3=(a,b,t)=>a.map((v,i)=>mix(v,b[i],t));
const freeze=v=>Object.freeze(v);
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const scale=(a,s)=>a.map(v=>v*s);
const smooth=(a,b,v)=>{const t=c01((v-a)/(b-a||1));return t*t*(3-2*t);};

const OPERATION_ID='H_EARTH_AUDRALIA_OPEN_WORLD_SPATIAL_MIGRATION_v1';
const COHERENCE_OPERATION='H_EARTH_V2_COASTAL_INTEGRATION_AND_POSITIONAL_IDENTITY_CLOSURE';
const SURFACE_AUTHORITY='H_EARTH_GRATITUDE_CANONICAL_SURFACE_FIELD_v1';
const COAST_AUTHORITY='H_EARTH_OW01_CANONICAL_COAST_BOUNDARY_v1';
const PLANET_RADIUS=6200;
const PLANET_CENTER=freeze([0,-PLANET_RADIUS,0]);
const LOCAL_CENTER_Z=-128;
const CANONICAL_BOUNDS=freeze({uMin:-2180,uMax:2130,vMin:-2310,vMax:320});
const COASTAL_RENDER_MARGIN=256;
const COASTAL_RENDER_BOUNDS=freeze({uMin:CANONICAL_BOUNDS.uMin-COASTAL_RENDER_MARGIN,uMax:CANONICAL_BOUNDS.uMax+COASTAL_RENDER_MARGIN,vMin:CANONICAL_BOUNDS.vMin-COASTAL_RENDER_MARGIN,vMax:CANONICAL_BOUNDS.vMax+COASTAL_RENDER_MARGIN});
const LOCAL_DOMAIN=freeze({xMin:-256,xMax:256,zMin:-320,zMax:64,width:512,depth:384});
const CANONICAL_SOURCE_DOMAIN=freeze({xMin:TERRAIN.worldDomain.xMinimum,xMax:TERRAIN.worldDomain.xMaximum,zMin:TERRAIN.worldDomain.zMinimum,zMax:TERRAIN.worldDomain.zMaximum});
const LOCAL_FEATHER=150;
const COARSE_STEP=18;
const FINE_STEP=4;
const FINE_U_MIN=-340;
const FINE_U_MAX=340;
const FINE_V_MIN=-230;
const FINE_V_MAX=230;
const EDGE_ROOT_ITERATIONS=18;
const SHALLOW_FADE_START=96;
const SHALLOW_FADE_END=160;
const SHALLOW_OVERLAY_DISTANCE=228;
const MAX_TARGET_ARC=PLANET_RADIUS*Math.PI*.9;
const PROTECTED_LOCAL_MIN=-320;
const PROTECTED_LOCAL_MAX=320;
const LOCAL_SAMPLE_STEP=2;
const CANONICAL_COAST_SAMPLE_STEP=8;
const MACRO_TARGET_CHORD=6;
const MACRO_MIN_SAMPLES=4;
const MACRO_MAX_SAMPLES=48;
const CURVE_ALPHA=.5;
const DISTANCE_CAP=900;
const DISTANCE_BIN=72;
const RAY_BIN=36;
const CONTINENT_FOOTPRINT_AREA_TARGET=.70;
const CONTINENT_LINEAR_SCALE=Math.sqrt(CONTINENT_FOOTPRINT_AREA_TARGET);
const CONTINENT_SCALE_ANCHOR=freeze([0,-128]);
function scaleContinentalPoint(point){return freeze([CONTINENT_SCALE_ANCHOR[0]+(point[0]-CONTINENT_SCALE_ANCHOR[0])*CONTINENT_LINEAR_SCALE,CONTINENT_SCALE_ANCHOR[1]+(point[1]-CONTINENT_SCALE_ANCHOR[1])*CONTINENT_LINEAR_SCALE]);}
function scaleContinentalAnchors(anchors){return anchors.map(point=>scaleContinentalPoint(point));}

const distance2=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const distanceToSegment=(point,a,b)=>{const du=b[0]-a[0],dv=b[1]-a[1],den=du*du+dv*dv||1,t=clamp(((point[0]-a[0])*du+(point[1]-a[1])*dv)/den,0,1),x=a[0]+du*t,z=a[1]+dv*t;return freeze({distance:Math.hypot(point[0]-x,point[1]-z),t,point:freeze([x,z])});};
const orient=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
const onSegment=(a,b,p)=>Math.abs(orient(a,b,p))<1e-8&&p[0]>=Math.min(a[0],b[0])-1e-8&&p[0]<=Math.max(a[0],b[0])+1e-8&&p[1]>=Math.min(a[1],b[1])-1e-8&&p[1]<=Math.max(a[1],b[1])+1e-8;
function segmentsIntersect(a,b,c,d){const o1=orient(a,b,c),o2=orient(a,b,d),o3=orient(c,d,a),o4=orient(c,d,b);if(((o1>0&&o2<0)||(o1<0&&o2>0))&&((o3>0&&o4<0)||(o3<0&&o4>0)))return true;return onSegment(a,b,c)||onSegment(a,b,d)||onSegment(c,d,a)||onSegment(c,d,b);}
function gratitudeShorelineZ(u){return resolveHEarthMapWideShorelineZ(u);}
const COAST_CONTROL_POINTS_RAW=[
  [-520,-40],[-760,-80],[-980,-180],[-1180,-340],[-1500,-520],[-1660,-720],[-1500,-900],[-1260,-850],
  [-1080,-700],[-1180,-1010],[-1380,-1260],[-1510,-1490],[-1370,-1710],[-1080,-1880],[-760,-1990],[-470,-1910],
  [-190,-2050],[120,-2010],[390,-2160],[650,-2050],[760,-1850],[1040,-1700],[1370,-1800],[1650,-1600],
  [1760,-1360],[1580,-1260],[1350,-1220],[1140,-1100],[900,-1040],[690,-900],[560,-700],[760,-430],
  [CANONICAL_SOURCE_DOMAIN.xMax,gratitudeShorelineZ(CANONICAL_SOURCE_DOMAIN.xMax)-LOCAL_CENTER_Z],
  [CANONICAL_SOURCE_DOMAIN.xMin,gratitudeShorelineZ(CANONICAL_SOURCE_DOMAIN.xMin)-LOCAL_CENTER_Z],
  [-420,90]
];
const COAST_CONTROL_POINTS=freeze(COAST_CONTROL_POINTS_RAW.map((point,index)=>freeze(index===32||index===33?point:scaleContinentalPoint(point))));
function knot(t,a,b){return t+Math.pow(Math.max(distance2(a,b),1e-9),CURVE_ALPHA);}
function interpolateParam(a,b,ta,tb,t){if(Math.abs(tb-ta)<1e-12)return freeze([a[0],a[1]]);const q=(t-ta)/(tb-ta);return freeze([mix(a[0],b[0],q),mix(a[1],b[1],q)]);}
function catmullPoint(p0,p1,p2,p3,t){const t0=0,t1=knot(t0,p0,p1),t2=knot(t1,p1,p2),t3=knot(t2,p2,p3),tt=mix(t1,t2,t),a1=interpolateParam(p0,p1,t0,t1,tt),a2=interpolateParam(p1,p2,t1,t2,tt),a3=interpolateParam(p2,p3,t2,t3,tt),b1=interpolateParam(a1,a2,t0,t2,tt),b2=interpolateParam(a2,a3,t1,t3,tt);return interpolateParam(b1,b2,t1,t2,tt);}
function naturalizeOpenSamples(samples,p1,p2,index){if(index<24||index>31||samples.length<3)return samples;const dx=p2[0]-p1[0],dz=p2[1]-p1[1],length=Math.hypot(dx,dz)||1,nx=-dz/length,nz=dx/length,amplitude=clamp(length*.055,7,24);return samples.map((point,i)=>{const t=i/Math.max(1,samples.length-1),edge=Math.sin(Math.PI*t),wobble=(.62*Math.sin(index*1.91+t*9.7)+.25*Math.sin(index*3.17+t*18.3)+.13*Math.sin(index*.83+t*31.1))*amplitude*edge;return freeze([point[0]+nx*wobble,point[1]+nz*wobble]);});}
function segmentSamples(index){const n=COAST_CONTROL_POINTS.length,p0=COAST_CONTROL_POINTS[(index-1+n)%n],p1=COAST_CONTROL_POINTS[index],p2=COAST_CONTROL_POINTS[(index+1)%n],p3=COAST_CONTROL_POINTS[(index+2)%n],length=distance2(p1,p2),count=clamp(Math.ceil(length/MACRO_TARGET_CHORD),MACRO_MIN_SAMPLES,MACRO_MAX_SAMPLES),allowed=clamp(.15*length,6,24);let samples=[];for(let i=0;i<count;i++)samples.push(catmullPoint(p0,p1,p2,p3,i/count));const violates=samples.some(point=>Math.min(distanceToSegment(point,p0,p1).distance,distanceToSegment(point,p1,p2).distance,distanceToSegment(point,p2,p3).distance)>allowed);if(violates){samples=[];for(let i=0;i<count;i++)samples.push(freeze([mix(p1[0],p2[0],i/count),mix(p1[1],p2[1],i/count)]));}samples=naturalizeOpenSamples(samples,p1,p2,index);return freeze({samples:freeze(samples),fallback:violates});}
function dedupeLoop(points){const result=[];for(const point of points){const previous=result[result.length-1];if(!previous||distance2(previous,point)>1e-8)result.push(freeze([point[0],point[1]]));}if(result.length>1&&distance2(result[0],result[result.length-1])<1e-8)result.pop();return freeze(result);}
function buildMainlandCandidate(forceLinear=false){const result=[],fallbackSegments=[],appendSegment=index=>{const resolved=segmentSamples(index);if(resolved.fallback)fallbackSegments.push(index);if(forceLinear){const p1=COAST_CONTROL_POINTS[index],p2=COAST_CONTROL_POINTS[(index+1)%COAST_CONTROL_POINTS.length],count=clamp(Math.ceil(distance2(p1,p2)/MACRO_TARGET_CHORD),MACRO_MIN_SAMPLES,MACRO_MAX_SAMPLES),base=[];for(let i=0;i<count;i++)base.push(freeze([mix(p1[0],p2[0],i/count),mix(p1[1],p2[1],i/count)]));result.push(...naturalizeOpenSamples(base,p1,p2,index));}else result.push(...resolved.samples);};for(let index=0;index<32;index++)appendSegment(index);for(let u=CANONICAL_SOURCE_DOMAIN.xMax;u>CANONICAL_SOURCE_DOMAIN.xMin;u-=CANONICAL_COAST_SAMPLE_STEP)result.push(freeze([u,resolveHEarthMapWideShorelineZ(u)-LOCAL_CENTER_Z]));result.push(freeze([CANONICAL_SOURCE_DOMAIN.xMin,resolveHEarthMapWideShorelineZ(CANONICAL_SOURCE_DOMAIN.xMin)-LOCAL_CENTER_Z]));for(let index=33;index<COAST_CONTROL_POINTS.length;index++)appendSegment(index);return freeze({loop:dedupeLoop(result),fallbackSegments:freeze(fallbackSegments)});}
function hasSelfIntersection(loop){const bins=new Map(),n=loop.length;for(let i=0;i<n;i++){const a=loop[i],b=loop[(i+1)%n],minX=Math.min(a[0],b[0]),maxX=Math.max(a[0],b[0]),minZ=Math.min(a[1],b[1]),maxZ=Math.max(a[1],b[1]),candidates=new Set();for(let x=Math.floor(minX/48);x<=Math.floor(maxX/48);x++)for(let z=Math.floor(minZ/48);z<=Math.floor(maxZ/48);z++)for(const prior of bins.get(`${x},${z}`)??[])candidates.add(prior);for(const j of candidates){if(j===i||Math.abs(j-i)===1||(i===n-1&&j===0)||(j===n-1&&i===0))continue;const c=loop[j],d=loop[(j+1)%n];if(segmentsIntersect(a,b,c,d))return true;}for(let x=Math.floor(minX/48);x<=Math.floor(maxX/48);x++)for(let z=Math.floor(minZ/48);z<=Math.floor(maxZ/48);z++){const key=`${x},${z}`,list=bins.get(key)??[];list.push(i);bins.set(key,list);}}return false;}
const initialMainland=buildMainlandCandidate(false),MAINLAND_RESULT=hasSelfIntersection(initialMainland.loop)?buildMainlandCandidate(true):initialMainland,MAINLAND_LOOP=MAINLAND_RESULT.loop,BAR_MIGRATION=TERRAIN.coastline.sandbars,BAR_PHASES=freeze([.37,1.71,3.29]);
function barCenterPoint(bar,t,index){const length=bar.radius.x,angle=bar.rotation??0,dx=Math.cos(angle),dz=Math.sin(angle),nx=-dz,nz=dx,axis=(t-.5)*2*length,phase=BAR_PHASES[index%BAR_PHASES.length],bend=bar.radius.z*(.52*Math.sin(Math.PI*t+phase)+.19*Math.sin(Math.PI*2*t-phase))*Math.sin(Math.PI*t);return freeze([bar.center.x+dx*axis+nx*bend,bar.center.z-LOCAL_CENTER_Z+dz*axis+nz*bend]);}
function barWidth(bar,t,index){const phase=BAR_PHASES[index%BAR_PHASES.length],taper=Math.pow(Math.max(0,Math.sin(Math.PI*t)),.72),asym=.88+.16*t+.10*Math.sin(Math.PI*t+phase)+.06*Math.sin(3*Math.PI*t-phase);return Math.max(0,bar.radius.z*taper*clamp(asym,.72,1.18));}
function buildSandbar(bar,index){const count=32,centerline=[];for(let i=0;i<=count;i++)centerline.push(barCenterPoint(bar,i/count,index));const right=[],left=[];for(let i=0;i<=count;i++){const t=i/count,p=centerline[i],before=centerline[Math.max(0,i-1)],after=centerline[Math.min(count,i+1)],tx=after[0]-before[0],tz=after[1]-before[1],length=Math.hypot(tx,tz)||1,nx=-tz/length,nz=tx/length,w=barWidth(bar,t,index);right.push(freeze([p[0]+nx*w,p[1]+nz*w]));left.push(freeze([p[0]-nx*w,p[1]-nz*w]));}const loop=[...right];for(let i=count-1;i>=1;i--)loop.push(left[i]);const resolvedLoop=dedupeLoop(loop),xs=resolvedLoop.map(point=>point[0]),zs=resolvedLoop.map(point=>point[1]);return freeze({id:bar.id,index,crestElevation:bar.crestElevation,centerline:freeze(centerline),loop:resolvedLoop,bounds:freeze({xMin:Math.min(...xs),xMax:Math.max(...xs),zMin:Math.min(...zs),zMax:Math.max(...zs)}),maximumHalfWidth:bar.radius.z,approximateHalfLength:bar.radius.x,rotation:bar.rotation??0});}
const SANDBARS=freeze(BAR_MIGRATION.map((bar,index)=>buildSandbar(bar,index)));
function naturalizeClosedLoop(anchors,phase,targetChord=34,amplitude=18){const result=[];for(let i=0;i<anchors.length;i++){const a=anchors[i],b=anchors[(i+1)%anchors.length],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz)||1,nx=-dz/length,nz=dx/length,count=Math.max(2,Math.ceil(length/targetChord));for(let j=0;j<count;j++){const t=j/count,edge=Math.sin(Math.PI*t),baseX=mix(a[0],b[0],t),baseZ=mix(a[1],b[1],t),wobble=(.54*Math.sin(phase+i*1.73+t*10.9)+.29*Math.sin(phase*.71+i*2.41+t*21.7)+.17*Math.sin(phase*1.37+i*.89+t*37.1))*amplitude*edge;result.push(freeze([baseX+nx*wobble,baseZ+nz*wobble]));}}return freeze(dedupeLoop(result));}
const INLET_ISLAND_LOOPS=freeze([
  naturalizeClosedLoop(scaleContinentalAnchors([[700,-1045],[765,-1125],[880,-1150],[1005,-1105],[1080,-1015],[1010,-940],[920,-915],[855,-850],[750,-885],[685,-955]]),1.23,24,13),
  naturalizeClosedLoop(scaleContinentalAnchors([[430,-875],[455,-940],[530,-970],[610,-935],[645,-875],[590,-825],[555,-760],[480,-775],[405,-820]]),2.91,20,10)
]);
const OFFSHORE_ISLAND_LOOPS=freeze([
  naturalizeClosedLoop(scaleContinentalAnchors([[-1820,-1010],[-1760,-1100],[-1660,-1140],[-1570,-1090],[-1540,-1000],[-1620,-935],[-1725,-930],[-1795,-955]]),5.12,22,12),
  naturalizeClosedLoop(scaleContinentalAnchors([[-1610,-1510],[-1540,-1595],[-1435,-1620],[-1350,-1560],[-1365,-1470],[-1460,-1425],[-1560,-1450]]),6.47,20,11),
  naturalizeClosedLoop(scaleContinentalAnchors([[-1840,-1320],[-1800,-1380],[-1730,-1400],[-1675,-1350],[-1695,-1280],[-1770,-1260]]),7.73,18,9)
]);
const DETACHED_ISLAND_LOOPS=freeze([...INLET_ISLAND_LOOPS,...OFFSHORE_ISLAND_LOOPS]);
const GREAT_LAKE_LOOP=naturalizeClosedLoop(scaleContinentalAnchors([[-1010,-1330],[-955,-1490],[-840,-1590],[-705,-1625],[-610,-1680],[-470,-1640],[-360,-1695],[-225,-1620],[-135,-1500],[-175,-1385],[-105,-1250],[-190,-1135],[-330,-1095],[-455,-1015],[-590,-1050],[-715,-995],[-830,-1070],[-900,-1175],[-1035,-1225]]),4.37,30,19);
function loopContains(loop,x,z,rayIndex=null){let inside=false;const candidates=rayIndex?.get(Math.floor(z/RAY_BIN))??null,indices=candidates??loop.map((_,index)=>index);for(const i of indices){const a=loop[i],b=loop[(i+1)%loop.length];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/((b[1]-a[1])||1e-12)+a[0])inside=!inside;}return inside;}
function buildRayIndex(loop){const map=new Map();for(let i=0;i<loop.length;i++){const a=loop[i],b=loop[(i+1)%loop.length],z0=Math.floor(Math.min(a[1],b[1])/RAY_BIN),z1=Math.floor(Math.max(a[1],b[1])/RAY_BIN);for(let z=z0;z<=z1;z++){const list=map.get(z)??[];list.push(i);map.set(z,list);}}return map;}
function buildDistanceIndex(loop){const map=new Map();for(let i=0;i<loop.length;i++){const a=loop[i],b=loop[(i+1)%loop.length],x0=Math.floor(Math.min(a[0],b[0])/DISTANCE_BIN),x1=Math.floor(Math.max(a[0],b[0])/DISTANCE_BIN),z0=Math.floor(Math.min(a[1],b[1])/DISTANCE_BIN),z1=Math.floor(Math.max(a[1],b[1])/DISTANCE_BIN);for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){const key=`${x},${z}`,list=bins.get(key)??[];list.push(i);map.set(key,list);}}return map;}

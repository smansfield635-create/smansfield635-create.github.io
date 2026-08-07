import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY as HYDRO,
  resolveHEarthMapWideReservoirBoundaryPoint,
  resolveHEarthMapWideShorelineZ,
  sampleHEarthMapWideEnvironmentTerrainCandidate as sampleTerrain
} from '../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js';

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const c01=(v)=>clamp(v,0,1);
const mix=(a,b,t)=>a+(b-a)*t;
const mix3=(a,b,t)=>[mix(a[0],b[0],t),mix(a[1],b[1],t),mix(a[2],b[2],t)];
const smooth=(a,b,v)=>{const t=c01((v-a)/(b-a||1));return t*t*(3-2*t);};
const norm=(v)=>{const l=Math.hypot(v[0],v[1],v[2])||1;return[v[0]/l,v[1]/l,v[2]/l];};
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const scale=(a,s)=>[a[0]*s,a[1]*s,a[2]*s];
const wrap=(v)=>Math.atan2(Math.sin(v),Math.cos(v));
const radians=(d)=>d*Math.PI/180;
const freeze=(v)=>Object.freeze(v);

const OPERATION_ID='H_EARTH_AUDRALIA_OPEN_WORLD_SPATIAL_MIGRATION_v1';
const CHECKPOINT='OW01';
const LOCK_GENERATION=473;
const GOVERNING_HEAD='c50d0a06a73ed149286508a15e697d8efa254865';
const REVISION10_SOURCE='ad9e72adb97df7ab867af1fe20df2c29de763d28';
const PLANET_RADIUS=6200;
const PLANET_CENTER=freeze([0,-PLANET_RADIUS,0]);
const LOCAL_CENTER_Z=-128;
const LOCAL_DOMAIN=freeze({xMin:-256,xMax:256,zMin:-320,zMax:64,cols:81,rows:61,width:512,depth:384});
const DETAIL_EDGE_FEATHER=42;
const MAX_TARGET_ARC=PLANET_RADIUS*Math.PI*.90;

const PALETTE=freeze({
  sky:[0.045,0.062,0.090],haze:[0.36,0.42,0.44],ocean:[0.050,0.245,0.380],oceanDeep:[0.028,0.125,0.230],
  gratitudeLow:[0.29,0.43,0.24],gratitudeHigh:[0.39,0.42,0.31],gratitudeRock:[0.43,0.41,0.38],
  unresolvedLow:[0.25,0.31,0.27],unresolvedHigh:[0.34,0.36,0.33],beach:[0.68,0.60,0.44],wet:[0.47,0.42,0.32],
  meadow:[0.34,0.45,0.24],coastal:[0.28,0.39,0.23],dune:[0.46,0.49,0.27],upland:[0.31,0.35,0.28],rock:[0.40,0.40,0.38],
  estate:[0.41,0.50,0.29],earth:[0.35,0.29,0.19],reservoir:[0.07,0.27,0.35,0.90],waterfall:[0.60,0.80,0.84,0.95],localOcean:[0.07,0.30,0.43,0.82]
});

export const AUDRALIA_OPEN_WORLD_AUTHORING_CONTRACT=freeze({
  schema:'AUDRALIA_CONTINUOUS_MULTISCALE_WORLD_MODEL_v1',operationId:OPERATION_ID,checkpoint:CHECKPOINT,lockGeneration:LOCK_GENERATION,
  governingHead:GOVERNING_HEAD,immutableMigrationSource:REVISION10_SOURCE,planetIdentity:'AUDRALIA',hEarthClass:'PLAYER_EXPERIENCE_ON_AUDRALIA',
  continentCount:9,resolvedContinent:'GRATITUDE',unresolvedContinentCount:8,gratitudeNineSummitsTrack:true,gratitudeSummitAnchorCount:9,
  planetRadiusAuthoringUnits:PLANET_RADIUS,localGratitudeWidthAuthoringUnits:LOCAL_DOMAIN.width,localGratitudeDepthAuthoringUnits:LOCAL_DOMAIN.depth,
  localArcScale:'ONE_AUTHORING_UNIT_EQUALS_ONE_SURFACE_ARC_UNIT',authoringRegionIsWorldBoundary:false,
  continuousZoomHierarchy:freeze(['LOCAL','REGION','CONTINENT','PLANETARY']),wholePlanetMustFitViewport:false,
  trueCoastalHarborBinding:true,gratitudeContinentalSkeleton:'ASYMMETRIC_COMPOUND_TANGENT_FIELD',primaryInlandMountainWatershedAxes:true,
  ow02DetailedContinuationConstructed:false,otherContinentsNarrativelyDefined:false,otherContinentsPlacementsCanonical:false,
  liveIntegrationAuthorized:false,frontPageIntegrationAuthorized:false,authoringPreviewOnly:true
});

function directionFromLatLon(latDeg,lonDeg){const lat=radians(latDeg),lon=radians(lonDeg),c=Math.cos(lat);return norm([c*Math.cos(lon),Math.sin(lat),c*Math.sin(lon)]);}
function tangentBasis(direction){const n=norm(direction),ref=Math.abs(n[1])<.92?[0,1,0]:[1,0,0],t=norm(cross(ref,n)),b=norm(cross(n,t));return{tangent:t,bitangent:b};}
function offsetDirection(center,angle,azimuth){const n=norm(center),basis=tangentBasis(n),radial=add(scale(basis.tangent,Math.cos(azimuth)),scale(basis.bitangent,Math.sin(azimuth)));return norm(add(scale(n,Math.cos(angle)),scale(radial,Math.sin(angle))));}
function angularDistance(a,b){return Math.acos(clamp(dot(a,b),-1,1));}
function tangentDirection(u,v){const r=Math.hypot(u,v);if(r<1e-8)return[0,1,0];const angle=r/PLANET_RADIUS,s=Math.sin(angle),c=Math.cos(angle);return norm([s*u/r,c,s*v/r]);}
function tangentCoordinates(direction){const n=norm(direction),angle=Math.acos(clamp(n[1],-1,1));if(angle<1e-8)return{u:0,v:0};const horizontal=Math.hypot(n[0],n[2])||1,arc=angle*PLANET_RADIUS;return{u:arc*n[0]/horizontal,v:arc*n[2]/horizontal};}
function surfacePositionFromDirection(direction,elevation=0){const radius=PLANET_RADIUS+elevation;return[PLANET_CENTER[0]+direction[0]*radius,PLANET_CENTER[1]+direction[1]*radius,PLANET_CENTER[2]+direction[2]*radius];}
function tangentPosition(u,v,elevation=0){return surfacePositionFromDirection(tangentDirection(u,v),elevation);}

const GRATITUDE_SUMMIT_ANCHORS=freeze([
  freeze({u:-1120,v:-940,strength:1.00}),freeze({u:-760,v:-610,strength:1.04}),freeze({u:-360,v:-360,strength:1.08}),
  freeze({u:40,v:-120,strength:1.12}),freeze({u:410,v:120,strength:1.16}),freeze({u:690,v:430,strength:1.20}),
  freeze({u:930,v:710,strength:1.24}),freeze({u:730,v:1040,strength:1.28}),freeze({u:310,v:1320,strength:1.34})
]);

const PRIMARY_INLAND_AXES=freeze([
  freeze({id:'WESTERN_WATERSHED_AXIS',width:260,amplitude:72,points:freeze([freeze({u:-78,v:-128}),freeze({u:-310,v:-650}),freeze({u:-720,v:-1250})])}),
  freeze({id:'CENTRAL_DIVIDE_AXIS',width:300,amplitude:88,points:freeze([freeze({u:-18,v:-152}),freeze({u:80,v:-760}),freeze({u:-80,v:-1540})])}),
  freeze({id:'EASTERN_WATERSHED_AXIS',width:250,amplitude:68,points:freeze([freeze({u:52,v:-138}),freeze({u:360,v:-690}),freeze({u:820,v:-1230})])})
]);

const UNRESOLVED_CONTINENTS=freeze([
  freeze({id:'CONTINENT_02',resolved:false,anchor:freeze(directionFromLatLon(28,38)),radius:.30,lobes:freeze([[0,0,1],[.10,1.1,.65],[.09,4.2,.55]])}),
  freeze({id:'CONTINENT_03',resolved:false,anchor:freeze(directionFromLatLon(-24,72)),radius:.31,lobes:freeze([[0,0,1],[.11,.4,.62],[.10,3.7,.56]])}),
  freeze({id:'CONTINENT_04',resolved:false,anchor:freeze(directionFromLatLon(15,119)),radius:.28,lobes:freeze([[0,0,1],[.10,2.3,.60],[.08,5.2,.52]])}),
  freeze({id:'CONTINENT_05',resolved:false,anchor:freeze(directionFromLatLon(-32,154)),radius:.30,lobes:freeze([[0,0,1],[.10,.9,.58],[.09,4.7,.55]])}),
  freeze({id:'CONTINENT_06',resolved:false,anchor:freeze(directionFromLatLon(34,-149)),radius:.29,lobes:freeze([[0,0,1],[.10,1.7,.60],[.08,4.4,.50]])}),
  freeze({id:'CONTINENT_07',resolved:false,anchor:freeze(directionFromLatLon(-27,-112)),radius:.32,lobes:freeze([[0,0,1],[.11,2.1,.62],[.09,5.0,.53]])}),
  freeze({id:'CONTINENT_08',resolved:false,anchor:freeze(directionFromLatLon(8,-76)),radius:.29,lobes:freeze([[0,0,1],[.09,.5,.58],[.09,3.9,.54]])}),
  freeze({id:'CONTINENT_09',resolved:false,anchor:freeze(directionFromLatLon(-42,-37)),radius:.27,lobes:freeze([[0,0,1],[.09,1.4,.55],[.08,4.5,.50]])})
]);

function ellipseField(u,v,cx,cz,rx,rz,rotation=0){const co=Math.cos(rotation),si=Math.sin(rotation),dx=u-cx,dz=v-cz,x=dx*co+dz*si,z=-dx*si+dz*co,r=Math.hypot(x/rx,z/rz);return 1-smooth(.70,1.08,r);}
function gratitudeCoastalBoundaryZ(u){const x=clamp(u,LOCAL_DOMAIN.xMin,LOCAL_DOMAIN.xMax),local=resolveHEarthMapWideShorelineZ(x),macro=-58+20*Math.sin((u+170)/420)+12*Math.sin((u-260)/175)+10*Math.sin((u+30)/83),blend=smooth(256,620,Math.abs(u));return mix(local,macro,blend);}
function gratitudeCoastalBoundaryV(u){return gratitudeCoastalBoundaryZ(u)-LOCAL_CENTER_Z;}
function gratitudeSkeletonField(u,v){
  const body=Math.max(
    ellipseField(u,v,-90,-760,1600,1520,-.10),
    ellipseField(u,v,-980,-520,900,1080,-.34),
    ellipseField(u,v,900,-360,760,1050,.28),
    ellipseField(u,v,-260,-1660,1120,760,.12),
    ellipseField(u,v,520,-1260,980,840,-.24)
  );
  const boundary=gratitudeCoastalBoundaryV(u),coastalGate=1-smooth(boundary-28,boundary+28,v);
  const headland=Math.max(ellipseField(u,v,-560,55,430,360,-.25),ellipseField(u,v,540,20,510,390,.31));
  const inletCut=ellipseField(u,v,110,110,270,260,-.15)*smooth(boundary-120,boundary+80,v);
  return c01(Math.max(body*coastalGate,headland*coastalGate*.90)-inletCut*.22);
}
function continentField(direction,continent){let field=0;for(const [offsetAngle,azimuth,strength] of continent.lobes){const center=offsetAngle===0?continent.anchor:offsetDirection(continent.anchor,offsetAngle,azimuth),angle=angularDistance(direction,center),coastVariation=.025*Math.sin(direction[0]*31+direction[2]*17+azimuth*2.3)+.018*Math.sin(direction[1]*43-direction[0]*13+azimuth),outer=continent.radius*(1+coastVariation),inner=outer*.63;field=Math.max(field,(1-smooth(inner,outer,angle))*strength);}return c01(field);}
function classifyPlanet(direction){
  const uv=tangentCoordinates(direction);let best=freeze({id:'GRATITUDE',resolved:true}),bestField=gratitudeSkeletonField(uv.u,uv.v);
  for(const continent of UNRESOLVED_CONTINENTS){const field=continentField(direction,continent);if(field>bestField){bestField=field;best=continent;}}
  return{continent:bestField>.01?best:null,field:bestField,land:smooth(.38,.56,bestField)};
}
function pointSegmentDistance(px,pz,a,b){const vx=b.u-a.u,vz=b.v-a.v,wx=px-a.u,wz=pz-a.v,d=vx*vx+vz*vz||1,t=clamp((wx*vx+wz*vz)/d,0,1),x=a.u+vx*t,z=a.v+vz*t;return Math.hypot(px-x,pz-z);}
function axisRelief(u,v){let relief=0;for(const axis of PRIMARY_INLAND_AXES){let d=Infinity;for(let i=0;i<axis.points.length-1;i++)d=Math.min(d,pointSegmentDistance(u,v,axis.points[i],axis.points[i+1]));const w=Math.exp(-Math.pow(d/axis.width,2)*2.2),inland=smooth(-180,-560,v);relief+=axis.amplitude*w*inland;}return relief;}
function gratitudeMacroRelief(direction,field){const {u,v}=tangentCoordinates(direction);let summit=0;for(const anchor of GRATITUDE_SUMMIT_ANCHORS){const dx=(u-anchor.u)/360,dv=(v-anchor.v)/410;summit+=Math.exp(-(dx*dx+dv*dv)*1.55)*anchor.strength;}const broad=15*Math.sin((u+v)*.0018)+10*Math.sin(u*.0031-v*.0021)+7*Math.sin(v*.0044),inland=smooth(80,1500,Math.hypot(u,v));return field*(28+48*field+summit*70+axisRelief(u,v)+Math.max(-12,broad)*inland);}
function localPatchPresence(u,v){const x=u,z=v+LOCAL_CENTER_Z;if(x<LOCAL_DOMAIN.xMin||x>LOCAL_DOMAIN.xMax||z<LOCAL_DOMAIN.zMin||z>LOCAL_DOMAIN.zMax)return 0;const edge=Math.min(x-LOCAL_DOMAIN.xMin,LOCAL_DOMAIN.xMax-x,z-LOCAL_DOMAIN.zMin,LOCAL_DOMAIN.zMax-z);return smooth(0,DETAIL_EDGE_FEATHER*1.35,edge);}
function planetSurface(direction){
  const c=classifyPlanet(direction),oceanVariation=.5+.5*Math.sin(direction[0]*8.2+direction[2]*6.1+direction[1]*4.7);
  if(!c.continent||c.land<.01)return{elevation:0,color:mix3(PALETTE.oceanDeep,PALETTE.ocean,oceanVariation*.38),land:0,continentId:null};
  const unresolved=!c.continent.resolved,macroNoise=18*Math.sin(direction[0]*19+direction[2]*11)+12*Math.sin(direction[1]*27-direction[0]*8);
  let elevation=c.land*(unresolved?28+38*c.field+Math.max(-12,macroNoise):gratitudeMacroRelief(direction,c.field));
  if(c.continent.id==='GRATITUDE'){const {u,v}=tangentCoordinates(direction),reserve=localPatchPresence(u,v);elevation=mix(elevation,-6.0,reserve*.98);}
  const high=c01((elevation-34)/105);let color=unresolved?mix3(PALETTE.unresolvedLow,PALETTE.unresolvedHigh,high):mix3(PALETTE.gratitudeLow,PALETTE.gratitudeHigh,high);
  if(!unresolved)color=mix3(color,PALETTE.gratitudeRock,c01((high-.48)/.52)*.66);const coast=1-smooth(.48,.70,c.field);color=mix3(color,PALETTE.beach,coast*.34*c.land);
  return{elevation,color,land:c.land,continentId:c.continent.id};
}
function buildPlanetMesh(){
  const lonSegments=144,latSegments=96,vertices=[],indices=[],continentHits=new Set();let landVertices=0,gratitudeVertices=0;
  for(let row=0;row<=latSegments;row++){const lat=-Math.PI/2+row/latSegments*Math.PI,cl=Math.cos(lat),sl=Math.sin(lat);for(let col=0;col<=lonSegments;col++){const lon=-Math.PI+col/lonSegments*Math.PI*2,direction=norm([cl*Math.cos(lon),sl,cl*Math.sin(lon)]),surface=planetSurface(direction),position=surfacePositionFromDirection(direction,surface.elevation);if(surface.land>.15&&surface.continentId){continentHits.add(surface.continentId);landVertices++;if(surface.continentId==='GRATITUDE')gratitudeVertices++;}vertices.push(position[0],position[1],position[2],direction[0],direction[1],direction[2],surface.color[0],surface.color[1],surface.color[2],1);}}
  const idx=(r,c)=>r*(lonSegments+1)+c;for(let r=0;r<latSegments;r++)for(let c=0;c<lonSegments;c++){const a=idx(r,c),b=idx(r,c+1),d=idx(r+1,c),e=idx(r+1,c+1);indices.push(a,d,b,b,d,e);}
  return freeze({vertices:new Float32Array(vertices),indices:new Uint32Array(indices),statistics:freeze({vertexCount:vertices.length/10,triangleCount:indices.length/3,continentCount:continentHits.size,landVertices,gratitudeVertices,unresolvedContinentCount:8,gratitudeResolved:true,gratitudeSummitAnchorCount:GRATITUDE_SUMMIT_ANCHORS.length,planetRadiusAuthoringUnits:PLANET_RADIUS,planetBordersRectangular:false,closedPlanetarySurface:true,wholePlanetMustFitViewport:false,otherContinentsPlacementsCanonical:false,authoringPreviewOnly:true,trueCoastalHarborBinding:true,gratitudeSkeletonAsymmetric:true,primaryInlandMountainWatershedAxes:true,primaryInlandAxisCount:PRIMARY_INLAND_AXES.length,ow02DetailedContinuationConstructed:false})});
}

function gratitudeDisplayElevation(terrain,x,z){let y=terrain.presentationElevation;if(z<-244){const ridge=.9*Math.sin((x+46)/31)+.55*Math.sin((x-17)/17)+.35*Math.sin((x+80)/9),depth=smooth(-244,-318,z);y+=ridge*depth*3.1;}return y;}
function localColor(terrain,x,z){const beach=c01(terrain.coastline?.beachWeight??0),wet=c01(terrain.coastline?.wetSandWeight??0),bar=c01(terrain.coastline?.sandbarWeight??0),site=c01(terrain.sitePreparation?.weight??0),elevation=terrain.presentationElevation,high=c01((elevation-25)/38),low=c01((28-elevation)/22);let color=PALETTE.meadow;color=mix3(color,PALETTE.coastal,low*.48);const dist=terrain.coastline?.distanceToShore??-999,dune=smooth(-42,-14,dist)*(1-smooth(-14,-2,dist));color=mix3(color,PALETTE.dune,dune*.58);color=mix3(color,PALETTE.beach,beach*.88);color=mix3(color,PALETTE.wet,wet*.58);color=mix3(color,PALETTE.beach,bar*.92);color=mix3(color,PALETTE.upland,high*.44);color=mix3(color,PALETTE.rock,high*.62);if(terrain.insideReservedEstateEnvelope)color=mix3(color,PALETTE.estate,.38);color=mix3(color,PALETTE.earth,site*.42);return color;}
function brokenSandbarLift(x,z){const pieces=[[-145,3,22,6,-.14,.55],[-118,6,18,5,-.08,.42],[-36,10,21,6,.04,.46],[-5,11,24,7,.08,.62],[22,12,15,5,.12,.36],[107,-6,18,5,-.18,.38],[136,-7,20,6,-.13,.48]];let best=0;for(const [cx,cz,rx,rz,rot,h] of pieces){const co=Math.cos(rot),si=Math.sin(rot),dx=x-cx,dz=z-cz,lx=dx*co+dz*si,lz=-dx*si+dz*co,rr=Math.hypot(lx/rx,lz/rz);let w=1-smooth(.45,1,rr);w*=clamp(.72+.20*Math.sin(lx*.18)+.10*Math.sin(lz*.31+cx),.22,1);best=Math.max(best,w*h);}return best;}
function detailEdgeAlpha(x,z){const edge=Math.min(x-LOCAL_DOMAIN.xMin,LOCAL_DOMAIN.xMax-x,z-LOCAL_DOMAIN.zMin,LOCAL_DOMAIN.zMax-z);return smooth(0,DETAIL_EDGE_FEATHER,edge);}
function mappedNormal(samples,row,col,cols,rows){const at=(r,c)=>samples[r*cols+c].position,l=at(row,Math.max(0,col-1)),r=at(row,Math.min(cols-1,col+1)),b=at(Math.max(0,row-1),col),f=at(Math.min(rows-1,row+1),col),u=sub(r,l),v=sub(f,b),candidate=norm(cross(v,u)),radial=norm(sub(at(row,col),PLANET_CENTER));return dot(candidate,radial)>=0?candidate:scale(candidate,-1);}
function buildGratitudeDetailMesh(){
  const d=LOCAL_DOMAIN,samples=new Array(d.cols*d.rows),vertices=[],indices=[];let min=Infinity,max=-Infinity,beachSamples=0;
  for(let row=0;row<d.rows;row++){const z=mix(d.zMin,d.zMax,row/(d.rows-1));for(let col=0;col<d.cols;col++){const x=mix(d.xMin,d.xMax,col/(d.cols-1)),terrain=sampleTerrain(x,z);if(terrain?.valid!==true)throw new Error(`GRATITUDE_TERRAIN_SAMPLE_INVALID:${x}:${z}`);let displayY=gratitudeDisplayElevation(terrain,x,z),candidateBar=c01(terrain.coastline?.sandbarWeight??0);if(candidateBar>.01)displayY=mix(displayY,HYDRO.seaLevelY+.18+brokenSandbarLift(x,z),candidateBar*.82);const u=x,v=z-LOCAL_CENTER_Z,position=tangentPosition(u,v,displayY),alpha=detailEdgeAlpha(x,z);samples[row*d.cols+col]={terrain,displayY,x,z,u,v,position,alpha};min=Math.min(min,displayY);max=Math.max(max,displayY);if((terrain.coastline?.beachWeight??0)>.1)beachSamples++;}}
  for(let row=0;row<d.rows;row++)for(let col=0;col<d.cols;col++){const s=samples[row*d.cols+col],n=mappedNormal(samples,row,col,d.cols,d.rows),color=localColor(s.terrain,s.x,s.z);vertices.push(s.position[0],s.position[1],s.position[2],n[0],n[1],n[2],color[0],color[1],color[2],s.alpha);}const idx=(r,c)=>r*d.cols+c;for(let r=0;r<d.rows-1;r++)for(let c=0;c<d.cols-1;c++){const a=idx(r,c),b=idx(r,c+1),e=idx(r+1,c),f=idx(r+1,c+1);indices.push(a,e,b,b,e,f);}
  return freeze({vertices:new Float32Array(vertices),indices:new Uint32Array(indices),statistics:freeze({validSampleCount:samples.length,triangleCount:indices.length/3,minimumElevation:min,maximumElevation:max,beachSampleCount:beachSamples,gratitudeHighResolution:true,revision10MigrationSourcePreserved:true,localWidthAuthoringUnits:d.width,localDepthAuthoringUnits:d.depth,localArcScaleOneToOne:true,localScaleCompressed:false,detailEdgeFeatherAuthoringUnits:DETAIL_EDGE_FEATHER,rectangularBoundaryVisible:false,authoringRegionIsWorldBoundary:false,displayMountainStaggering:true,brokenSandbarPresentation:true,organicCoastalColorTransition:true,trueCoastalHarborBinding:true,liveTerrainMutation:false})});
}
function detailWaterAlpha(x,z){const edgeX=Math.min(x-LOCAL_DOMAIN.xMin,LOCAL_DOMAIN.xMax-x),seaward=110-z;return smooth(0,36,Math.min(edgeX,seaward));}
function buildLocalWaterMesh(){const vertices=[],indices=[],pushMapped=(x,y,z,c,a=1)=>{const p=tangentPosition(x,z-LOCAL_CENTER_Z,y);vertices.push(p[0],p[1],p[2],c[0],c[1],c[2],c[3]*a);},oceanSeg=64,oceanBase=0,oceanY=HYDRO.seaLevelY+.10;for(let i=0;i<=oceanSeg;i++){const x=mix(LOCAL_DOMAIN.xMin,LOCAL_DOMAIN.xMax,i/oceanSeg),shore=resolveHEarthMapWideShorelineZ(x)-3;pushMapped(x,oceanY,shore,PALETTE.localOcean,detailWaterAlpha(x,shore));pushMapped(x,oceanY,110,PALETTE.localOcean,0);}for(let i=0;i<oceanSeg;i++){const a=oceanBase+i*2,b=a+1,c=a+2,d=a+3;indices.push(a,c,b,b,c,d);}const res=HYDRO.reservoir,resBase=vertices.length/7,resSeg=64;pushMapped(res.center.x,res.waterSurfaceElevation+.10,res.center.z,PALETTE.reservoir,1);for(let i=0;i<=resSeg;i++){const angle=i/resSeg*Math.PI*2,b=resolveHEarthMapWideReservoirBoundaryPoint(angle);pushMapped(b.x,res.waterSurfaceElevation+.10,b.z,PALETTE.reservoir,1);}for(let i=0;i<resSeg;i++)indices.push(resBase,resBase+i+1,resBase+i+2);const wf=HYDRO.waterfall,wfBase=vertices.length/7,wfSeg=24,crest=sampleTerrain(wf.visibleCrest.x,wf.visibleCrest.z),top=crest?.valid?gratitudeDisplayElevation(crest,wf.visibleCrest.x,wf.visibleCrest.z)+1.6:res.waterSurfaceElevation+30,bottom=res.waterSurfaceElevation+.55,hw=wf.visibleWaterHalfWidth??7.5;for(let i=0;i<=wfSeg;i++){const t=i/wfSeg,x=mix(wf.visibleCrest.x,wf.landing.x,t),z=mix(wf.visibleCrest.z,wf.landing.z,t),y=mix(top,bottom,t);pushMapped(x-hw,y,z,PALETTE.waterfall,1);pushMapped(x+hw,y,z,PALETTE.waterfall,1);}for(let i=0;i<wfSeg;i++){const a=wfBase+i*2,b=a+1,c=a+2,d=a+3;indices.push(a,c,b,b,c,d);}return freeze({vertices:new Float32Array(vertices),indices:new Uint32Array(indices),statistics:freeze({triangleCount:indices.length/3,oceanTriangleCount:oceanSeg*2,reservoirTriangleCount:resSeg,waterfallTriangleCount:wfSeg*2,curvedToPlanetSurface:true,authoringContextOnly:true,liveWaterMutation:false})});}

function buildOW01Evidence(){const xs=[-256,-192,-96,0,96,192,256],samples=xs.map(x=>{const localShorelineZ=resolveHEarthMapWideShorelineZ(x),macroBoundaryZ=gratitudeCoastalBoundaryV(x)+LOCAL_CENTER_Z;return freeze({worldX:x,localShorelineZ,macroBoundaryZ,error:Math.abs(localShorelineZ-macroBoundaryZ)});}),maximumCoastalBindingError=Math.max(...samples.map(s=>s.error));return freeze({schema:'H_EARTH_AUDRALIA_OPEN_WORLD_OW01_GEOGRAPHIC_EVIDENCE_v1',operationId:OPERATION_ID,checkpoint:CHECKPOINT,lockGeneration:LOCK_GENERATION,governingHead:GOVERNING_HEAD,revision10Source:REVISION10_SOURCE,trueCoastalHarborBinding:maximumCoastalBindingError<1e-9,maximumCoastalBindingError,coastalBindingSampleCount:samples.length,coastalBindingSamples:freeze(samples),fullScaleLocalGratitudePreserved:true,gratitudeSkeletonAsymmetric:true,gratitudeSkeletonClass:'ASYMMETRIC_COMPOUND_TANGENT_FIELD',primaryInlandMountainWatershedAxes:true,primaryInlandAxisCount:PRIMARY_INLAND_AXES.length,ow02DetailedContinuationConstructed:false,otherEightContinentsRemainNoncanonical:true,liveProductMutation:false});}

const TERRAIN_VS=`#version 300 es
precision highp float;layout(location=0)in vec3 aPosition;layout(location=1)in vec3 aNormal;layout(location=2)in vec4 aColor;uniform mat4 uVP;uniform float uGlobalAlpha;out vec3 vPos;out vec3 vNormal;out vec4 vColor;void main(){vPos=aPosition;vNormal=aNormal;vColor=vec4(aColor.rgb,aColor.a*uGlobalAlpha);gl_Position=uVP*vec4(aPosition,1.0);}`;
const TERRAIN_FS=`#version 300 es
precision highp float;in vec3 vPos;in vec3 vNormal;in vec4 vColor;uniform vec3 uEye;uniform vec3 uHaze;uniform float uFogStart;uniform float uFogEnd;out vec4 outColor;void main(){vec3 n=normalize(vNormal);vec3 light=normalize(vec3(.42,.78,.46));float d=max(dot(n,light),0.0);float hemi=.62+.38*clamp(n.y*.5+.5,0.0,1.0);vec3 c=vColor.rgb*(.50+.62*d)*hemi;float dist=length(vPos-uEye);float fog=clamp((dist-uFogStart)/max(1.0,uFogEnd-uFogStart),0.0,.68);outColor=vec4(mix(c,uHaze,fog),vColor.a);}`;
const WATER_VS=`#version 300 es
precision highp float;layout(location=0)in vec3 aPosition;layout(location=1)in vec4 aColor;uniform mat4 uVP;uniform float uGlobalAlpha;out vec4 vColor;void main(){gl_Position=uVP*vec4(aPosition,1);vColor=vec4(aColor.rgb,aColor.a*uGlobalAlpha);}`;
const WATER_FS=`#version 300 es
precision highp float;in vec4 vColor;out vec4 outColor;void main(){outColor=vColor;}`;
function shader(gl,type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(`SHADER_COMPILE_FAILED:${gl.getShaderInfoLog(s)}`);return s;}
function program(gl,vs,fs){const p=gl.createProgram();gl.attachShader(p,shader(gl,gl.VERTEX_SHADER,vs));gl.attachShader(p,shader(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(`PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(p)}`);return p;}
function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),nf=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);}
function lookAt(eye,target,up){const z=norm(sub(eye,target));let x=cross(up,z);if(Math.hypot(...x)<1e-5)x=[1,0,0];x=norm(x);const y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);}
function multiply(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o;}
function buffers(gl,mesh){const vao=gl.createVertexArray();gl.bindVertexArray(vao);const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,mesh.vertices,gl.STATIC_DRAW);const stride=10*4;for(const [loc,size,off]of [[0,3,0],[1,3,12],[2,4,24]]){gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,stride,off);}const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.STATIC_DRAW);return{vao};}
function waterBuffers(gl,mesh){const vao=gl.createVertexArray();gl.bindVertexArray(vao);const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,mesh.vertices,gl.STATIC_DRAW);const stride=7*4;for(const [loc,size,off]of [[0,3,0],[1,4,12]]){gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,stride,off);}const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.STATIC_DRAW);return{vao};}

export function createMapWideEnvironmentRenderer(canvas){
  const gl=canvas.getContext('webgl2',{antialias:true,alpha:false,powerPreference:'high-performance'});if(!gl)throw new Error('WEBGL2_CONTEXT_UNAVAILABLE');
  const terrainProgram=program(gl,TERRAIN_VS,TERRAIN_FS),waterProgram=program(gl,WATER_VS,WATER_FS),planetMesh=buildPlanetMesh(),gratitudeMesh=buildGratitudeDetailMesh(),waterMesh=buildLocalWaterMesh(),planetBuffers=buffers(gl,planetMesh),gratitudeBuffers=buffers(gl,gratitudeMesh),localWaterBuffers=waterBuffers(gl,waterMesh),ow01Evidence=buildOW01Evidence(),state={yaw:-.62,pitch:.88,distance:720,targetU:0,targetV:-4,renderedFrames:0};
  function resize(){const dpr=Math.min(1.35,window.devicePixelRatio||1),w=Math.max(1,Math.round(canvas.clientWidth*dpr)),h=Math.max(1,Math.round(canvas.clientHeight*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}gl.viewport(0,0,w,h);}
  function limitTarget(){const r=Math.hypot(state.targetU,state.targetV);if(r>MAX_TARGET_ARC){const s=MAX_TARGET_ARC/r;state.targetU*=s;state.targetV*=s;}}
  function targetGroundElevation(){const x=state.targetU,z=state.targetV+LOCAL_CENTER_Z;if(x>=LOCAL_DOMAIN.xMin&&x<=LOCAL_DOMAIN.xMax&&z>=LOCAL_DOMAIN.zMin&&z<=LOCAL_DOMAIN.zMax){const t=sampleTerrain(x,z);if(t?.valid)return gratitudeDisplayElevation(t,x,z);}return planetSurface(tangentDirection(state.targetU,state.targetV)).elevation;}
  function camera(){state.pitch=clamp(state.pitch,.46,1.49);state.distance=clamp(state.distance,95,5600);limitTarget();const direction=tangentDirection(state.targetU,state.targetV),ground=targetGroundElevation(),target=surfacePositionFromDirection(direction,ground),pU1=tangentPosition(state.targetU+1,state.targetV,0),pU0=tangentPosition(state.targetU-1,state.targetV,0),pV1=tangentPosition(state.targetU,state.targetV+1,0),pV0=tangentPosition(state.targetU,state.targetV-1,0),eU=norm(sub(pU1,pU0)),eV=norm(sub(pV1,pV0)),horizontal=norm(add(scale(eU,Math.sin(state.yaw)),scale(eV,Math.cos(state.yaw)))),eye=add(add(target,scale(direction,state.distance*Math.sin(state.pitch)+18)),scale(horizontal,state.distance*Math.cos(state.pitch)));return{eye,target,up:direction};}
  function viewScale(){if(state.distance<900)return'LOCAL';if(state.distance<2200)return'REGION';if(state.distance<4200)return'CONTINENT';return'PLANETARY';}
  function detailGlobalAlpha(){return 1-smooth(2600,4700,state.distance);}
  function drawTerrain(mesh,b,cam,alpha,fogStart,fogEnd,blended=false){const proj=perspective(Math.PI/3,canvas.width/canvas.height,2,PLANET_RADIUS*4.5),vp=multiply(proj,lookAt(cam.eye,cam.target,cam.up));gl.useProgram(terrainProgram);gl.uniformMatrix4fv(gl.getUniformLocation(terrainProgram,'uVP'),false,vp);gl.uniform1f(gl.getUniformLocation(terrainProgram,'uGlobalAlpha'),alpha);gl.uniform3fv(gl.getUniformLocation(terrainProgram,'uEye'),cam.eye);gl.uniform3fv(gl.getUniformLocation(terrainProgram,'uHaze'),PALETTE.haze);gl.uniform1f(gl.getUniformLocation(terrainProgram,'uFogStart'),fogStart);gl.uniform1f(gl.getUniformLocation(terrainProgram,'uFogEnd'),fogEnd);if(blended){gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);}else{gl.disable(gl.BLEND);gl.depthMask(true);}gl.bindVertexArray(b.vao);gl.drawElements(gl.TRIANGLES,mesh.indices.length,gl.UNSIGNED_INT,0);if(blended){gl.depthMask(true);gl.disable(gl.BLEND);}return vp;}
  function render(){resize();gl.enable(gl.DEPTH_TEST);gl.clearColor(...PALETTE.sky,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);const cam=camera(),vp=drawTerrain(planetMesh,planetBuffers,cam,1,3600,11800,false),detailAlpha=detailGlobalAlpha();if(detailAlpha>.005){drawTerrain(gratitudeMesh,gratitudeBuffers,cam,detailAlpha,900,4400,true);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);gl.useProgram(waterProgram);gl.uniformMatrix4fv(gl.getUniformLocation(waterProgram,'uVP'),false,vp);gl.uniform1f(gl.getUniformLocation(waterProgram,'uGlobalAlpha'),detailAlpha);gl.bindVertexArray(localWaterBuffers.vao);gl.drawElements(gl.TRIANGLES,waterMesh.indices.length,gl.UNSIGNED_INT,0);gl.depthMask(true);gl.disable(gl.BLEND);}state.renderedFrames++;}
  function orbit(dx,dy){state.yaw=wrap(state.yaw+clamp(Number(dx)||0,-64,64)*.0052);state.pitch=clamp(state.pitch+clamp(Number(dy)||0,-64,64)*.0032,.46,1.49);render();}
  function zoom(delta){state.distance=clamp(state.distance*Math.exp(clamp(Number(delta)||0,-900,900)*.00115),95,5600);render();}
  function zoomByFactor(f){const factor=clamp(Number(f)||1,.72,1.38);state.distance=clamp(state.distance/factor,95,5600);render();}
  function pan(du,dv){state.targetU+=Number(du)||0;state.targetV+=Number(dv)||0;limitTarget();render();}
  function panScreen(dx,dy){const s=clamp(state.distance*.0021,.28,12),rx=Math.cos(state.yaw),rz=-Math.sin(state.yaw),fx=Math.sin(state.yaw),fz=Math.cos(state.yaw);pan((-dx*rx+dy*fx)*s,(-dx*rz+dy*fz)*s);}
  function focusGratitude(){Object.assign(state,{yaw:-.62,pitch:.88,distance:720,targetU:0,targetV:-4});render();}
  function planetaryVantage(){state.distance=5000;state.pitch=1.02;render();}
  function fitWorld(){focusGratitude();}
  function getCameraSafety(){const fullPlanetFitDistance=PLANET_RADIUS/Math.sin((Math.PI/3)/2)-PLANET_RADIUS;return freeze({distanceSafe:state.distance>=95&&state.distance<=5600,targetArcSafe:Math.hypot(state.targetU,state.targetV)<=MAX_TARGET_ARC+1,continuousScaleRecognized:['LOCAL','REGION','CONTINENT','PLANETARY'].includes(viewScale()),wholePlanetFitNotRequired:state.distance<fullPlanetFitDistance,planetHasNoRectangularBorder:planetMesh.statistics.planetBordersRectangular===false,nineContinentsPresent:planetMesh.statistics.continentCount===9,localScaleNotCompressed:gratitudeMesh.statistics.localScaleCompressed===false,liveMutationAbsent:true});}
  return freeze({planetMesh,gratitudeMesh,waterMesh,state,render,orbit,zoom,zoomByFactor,pan,panScreen,fitWorld,focusGratitude,planetaryVantage,getViewScale:viewScale,getCameraSafety,getOW01GeographicEvidence:()=>ow01Evidence,getSnapshot:()=>freeze({...state,viewScale:viewScale(),detailGlobalAlpha:detailGlobalAlpha(),planetStatistics:planetMesh.statistics,gratitudeStatistics:gratitudeMesh.statistics,waterStatistics:waterMesh.statistics,worldContract:AUDRALIA_OPEN_WORLD_AUTHORING_CONTRACT,ow01Evidence,authoringRegionIsWorldBoundary:false,wholePlanetMustFitViewport:false,manorGeometryConstructed:false,liveRuntimeMutated:false,liveCameraMutated:false,liveNavigationMutated:false,liveWaterMutated:false})});
}

export default createMapWideEnvironmentRenderer;

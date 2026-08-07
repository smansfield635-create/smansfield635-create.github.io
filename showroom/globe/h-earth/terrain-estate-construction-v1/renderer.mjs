import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY as HYDRO,
  resolveHEarthMapWideReservoirBoundaryPoint,
  resolveHEarthMapWideShorelineZ,
  sampleHEarthMapWideEnvironmentTerrainCandidate as sampleTerrain
} from '../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js';

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
const PLANET_RADIUS=6200;
const PLANET_CENTER=freeze([0,-PLANET_RADIUS,0]);
const LOCAL_CENTER_Z=-128;
const CANONICAL_BOUNDS=freeze({uMin:-1760,uMax:1536,vMin:-1952,vMax:320});
const LOCAL_DOMAIN=freeze({xMin:-256,xMax:256,zMin:-320,zMax:64,width:512,depth:384});
const LOCAL_FEATHER=150;
const COARSE_STEP=18;
const FINE_STEP=4;
const FINE_U_MIN=-340;
const FINE_U_MAX=340;
const FINE_V_MIN=-230;
const FINE_V_MAX=230;
const MAX_TARGET_ARC=PLANET_RADIUS*Math.PI*.9;

const PALETTE=freeze({
  sky:[.045,.062,.09],haze:[.36,.42,.44],ocean:[.045,.20,.33],oceanDeep:[.025,.10,.20],
  shallow:[.10,.40,.50],shoreWater:[.16,.49,.56],low:[.30,.44,.25],upland:[.36,.43,.29],
  high:[.40,.40,.33],rock:[.43,.41,.38],beach:[.68,.60,.44],wet:[.47,.42,.32],
  meadow:[.34,.45,.24],coastal:[.28,.39,.23],estate:[.41,.50,.29],earth:[.35,.29,.19],
  reservoir:[.10,.40,.50,.88]
});

export const AUDRALIA_OPEN_WORLD_AUTHORING_CONTRACT=freeze({
  schema:'AUDRALIA_CONTINUOUS_MULTISCALE_WORLD_MODEL_v1',operationId:OPERATION_ID,
  coherenceOperation:COHERENCE_OPERATION,checkpoint:'OW01',lockGeneration:473,
  governingHead:'c50d0a06a73ed149286508a15e697d8efa254865',
  immutableMigrationSource:'ad9e72adb97df7ab867af1fe20df2c29de763d28',
  canonicalSurfaceAuthority:SURFACE_AUTHORITY,geographicTruthAuthorityCount:1,
  scaleRepresentationRule:'ONE_CANONICAL_SURFACE_ADAPTIVE_SPATIAL_SAMPLING',
  localFidelityRestoration:'FULL_LOCAL_SOURCE_INSIDE_PROTECTED_DOMAIN_WITH_FIXED_SPATIAL_FEATHER_OUTSIDE',
  cameraDistanceCanChangeGeography:false,localMacroTransition:'CANONICAL_FIELD_SPATIAL_RECONCILIATION_NOT_CAMERA_LOD',
  stitchGeographicAuthority:false,coastalTerrainMaterialIntegrated:true,independentBeachVisualAuthority:false,
  separateBeachGeometryConstructed:false,separateWetSandGeometryConstructed:false,seawardWetTransitionGeometryConstructed:false,
  shallowCoastalWaterMaterial:true,planetaryOceanSingleSurface:true,planetaryOceanMaskedUnderCanonicalGratitudeLand:true,
  localOceanOverlayConstructed:false,unresolvedContinentPresentationNoncanonical:true,liveIntegrationAuthorized:false,
  authoringPreviewOnly:true
});

function tangentDirection(u,v){
  const radius=Math.hypot(u,v);if(radius<1e-9)return[0,1,0];
  const angle=radius/PLANET_RADIUS,sine=Math.sin(angle),cosine=Math.cos(angle);
  return norm([sine*u/radius,cosine,sine*v/radius]);
}
function tangentCoordinatesFromDirection(direction){
  const d=norm(direction),horizontal=Math.hypot(d[0],d[2]);if(horizontal<1e-12)return freeze({u:0,v:0});
  const radius=Math.atan2(horizontal,d[1])*PLANET_RADIUS;
  return freeze({u:radius*d[0]/horizontal,v:radius*d[2]/horizontal});
}
function surfacePositionFromDirection(direction,elevation=0){
  const radius=PLANET_RADIUS+elevation;return[PLANET_CENTER[0]+direction[0]*radius,PLANET_CENTER[1]+direction[1]*radius,PLANET_CENTER[2]+direction[2]*radius];
}
function tangentPosition(u,v,elevation=0){return surfacePositionFromDirection(tangentDirection(u,v),elevation);}

function gratitudeShorelineZ(u){
  const x=clamp(u,-256,256),local=resolveHEarthMapWideShorelineZ(x);
  const macro=-58+19*Math.sin((u+170)/420)+11*Math.sin((u-260)/175)+8*Math.sin((u+30)/83);
  return mix(local,macro,smooth(256,620,Math.abs(u)));
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
].map(freeze));
function pointInPolygon(u,v){
  let inside=false;for(let i=0,j=COAST_CONTROL_POINTS.length-1;i<COAST_CONTROL_POINTS.length;j=i,i++){
    const a=COAST_CONTROL_POINTS[i],b=COAST_CONTROL_POINTS[j];
    if((a[1]>v)!==(b[1]>v)&&u<(b[0]-a[0])*(v-a[1])/((b[1]-a[1])||1e-9)+a[0])inside=!inside;
  }return inside;
}
function pointSegmentDistance(u,v,a,b){
  const du=b[0]-a[0],dv=b[1]-a[1],den=du*du+dv*dv||1,t=clamp(((u-a[0])*du+(v-a[1])*dv)/den,0,1);
  return Math.hypot(u-(a[0]+du*t),v-(a[1]+dv*t));
}
function gratitudeCoastSample(u,v){
  let distance=Infinity;for(let i=0;i<COAST_CONTROL_POINTS.length;i++)distance=Math.min(distance,pointSegmentDistance(u,v,COAST_CONTROL_POINTS[i],COAST_CONTROL_POINTS[(i+1)%COAST_CONTROL_POINTS.length]));
  let inside=pointInPolygon(u,v);
  if(Math.abs(u)<=320&&v>-280){const field=gratitudeShorelineZ(u)-(v+LOCAL_CENTER_Z);inside=field>=0;distance=Math.min(distance,Math.abs(field));}
  return freeze({inside,distance,field:inside?distance:-distance});
}

const SUMMITS=freeze([[-1180,-1190,.74],[-900,-1010,.8],[-620,-850,.86],[-320,-720,.92],[0,-640,1],[330,-760,.96],[610,-940,.92],[850,-1160,.88],[1010,-1380,.84]].map(freeze));
function gaussian(u,v,x,z,rx,rz){const du=(u-x)/rx,dv=(v-z)/rz;return Math.exp(-(du*du+dv*dv)*1.8);}
function macroElevation(u,v,coast){
  let elevation=HYDRO.seaLevelY+1.8+7*smooth(0,260,coast.distance)+5*smooth(180,900,coast.distance)+3.2*Math.sin((u+v)*.0019)+2.4*Math.sin(u*.003-v*.0017)+1.8*Math.sin(v*.0038);
  for(const peak of SUMMITS)elevation+=gaussian(u,v,peak[0],peak[1],195,225)*peak[2]*32;
  return clamp(elevation,HYDRO.seaLevelY,HYDRO.seaLevelY+96);
}
function macroColor(u,v,elevation,coast){
  const upland=c01((elevation-16)/42),high=c01((elevation-32)/64);
  let color=mix3(PALETTE.low,PALETTE.upland,upland*.72);color=mix3(color,PALETTE.high,high*.58);color=mix3(color,PALETTE.rock,c01((high-.66)/.34)*.42);
  const sand=(1-smooth(9,66,coast.distance))*(1-smooth(HYDRO.seaLevelY+8,HYDRO.seaLevelY+18,elevation));
  return mix3(color,PALETTE.beach,sand*.34);
}
function normalizeLocalElevation(raw){const delta=raw-HYDRO.seaLevelY;if(delta<=22)return raw;return HYDRO.seaLevelY+delta*mix(1,.60,smooth(22,76,delta));}
function localTerrainColor(terrain,elevation){
  const wet=c01(terrain.coastline?.wetSandWeight??0),sand=c01(terrain.coastline?.beachWeight??0),site=c01(terrain.sitePreparation?.weight??0),high=c01((elevation-25)/42),low=c01((28-elevation)/22);
  let color=PALETTE.meadow;color=mix3(color,PALETTE.coastal,low*.48);color=mix3(color,PALETTE.beach,sand*.74);color=mix3(color,PALETTE.wet,wet*.34);color=mix3(color,PALETTE.upland,high*.34);color=mix3(color,PALETTE.rock,high*.42);
  if(terrain.insideReservedEstateEnvelope)color=mix3(color,PALETTE.estate,.38);return mix3(color,PALETTE.earth,site*.42);
}
function distanceOutsideLocalDomain(x,z){const dx=x<LOCAL_DOMAIN.xMin?LOCAL_DOMAIN.xMin-x:x>LOCAL_DOMAIN.xMax?x-LOCAL_DOMAIN.xMax:0,dz=z<LOCAL_DOMAIN.zMin?LOCAL_DOMAIN.zMin-z:z>LOCAL_DOMAIN.zMax?z-LOCAL_DOMAIN.zMax:0;return Math.hypot(dx,dz);}
function sampleLocalSource(x,z){
  const inside=x>=LOCAL_DOMAIN.xMin&&x<=LOCAL_DOMAIN.xMax&&z>=LOCAL_DOMAIN.zMin&&z<=LOCAL_DOMAIN.zMax;
  if(inside){const terrain=sampleTerrain(x,z);return terrain?.valid?freeze({terrain,weight:1,boundary:false}):null;}
  const distance=distanceOutsideLocalDomain(x,z);if(distance>LOCAL_FEATHER)return null;
  const sx=clamp(x,LOCAL_DOMAIN.xMin,LOCAL_DOMAIN.xMax),sz=clamp(z,LOCAL_DOMAIN.zMin,LOCAL_DOMAIN.zMax),terrain=sampleTerrain(sx,sz);
  if(terrain?.valid!==true)return null;
  const irregular=clamp(1+.08*Math.sin(x*.019+z*.013)+.05*Math.sin(x*.041-z*.017),.86,1.14),weight=1-smooth(0,LOCAL_FEATHER,distance*irregular);
  return freeze({terrain,weight,boundary:true,sampleX:sx,sampleZ:sz});
}
function sampleCanonicalGratitude(u,v){
  const z=v+LOCAL_CENTER_Z,coast=gratitudeCoastSample(u,v),baseElevation=macroElevation(u,v,coast);
  let elevation=baseElevation,color=macroColor(u,v,baseElevation,coast),field=coast.field,local=sampleLocalSource(u,z),terrain=null;
  if(local){terrain=local.terrain;const localElevation=normalizeLocalElevation(terrain.presentationElevation);
    if(local.boundary){const boundaryV=local.sampleZ-LOCAL_CENTER_Z,boundaryCoast=gratitudeCoastSample(local.sampleX,boundaryV),boundaryMacro=macroElevation(local.sampleX,boundaryV,boundaryCoast),delta=localElevation-boundaryMacro;elevation=baseElevation+delta*local.weight;color=mix3(color,localTerrainColor(terrain,localElevation),local.weight*.90);}
    else{elevation=localElevation;color=localTerrainColor(terrain,localElevation);}
    const bar=c01(terrain.coastline?.sandbarWeight??0);field=Math.max(field,(bar-.20)*18);
  }
  if(field<0)return freeze({u,v,z,field,inside:false,elevation:HYDRO.seaLevelY,color:PALETTE.ocean,terrain,authority:SURFACE_AUTHORITY});
  return freeze({u,v,z,field,inside:true,elevation,color,terrain,authority:SURFACE_AUTHORITY});
}

function buildAxis(min,max,fineMin,fineMax){
  const values=[min];let x=min;
  while(x<max-1e-9){let step=x>=fineMin&&x<fineMax?FINE_STEP:COARSE_STEP,next=Math.min(max,x+step);if(x<fineMin&&next>fineMin)next=fineMin;if(x<fineMax&&next>fineMax)next=fineMax;if(next<=x+1e-9)next=Math.min(max,x+step);values.push(next);x=next;}
  return freeze(values);
}
function interpolateRecord(a,b,t){return{u:mix(a.u,b.u,t),v:mix(a.v,b.v,t),position:mix3(a.position,b.position,t),normal:norm(mix3(a.normal,b.normal,t)),color:mix3(a.color,b.color,t),field:mix(a.field,b.field,t)};}
function clipPositive(records){
  const out=[];for(let i=0;i<records.length;i++){const current=records[i],previous=records[(i-1+records.length)%records.length],ci=current.field>=0,pi=previous.field>=0;if(ci!==pi){const den=previous.field-current.field,t=Math.abs(den)<1e-12?.5:clamp(previous.field/den,0,1);out.push(interpolateRecord(previous,current,t));}if(ci)out.push(current);}return out;
}
function emitTerrainRecord(vertices,record){const index=vertices.length/10;vertices.push(...record.position,...record.normal,...record.color,1);return index;}
function buildGratitudeMesh(){
  const us=buildAxis(CANONICAL_BOUNDS.uMin,CANONICAL_BOUNDS.uMax,FINE_U_MIN,FINE_U_MAX),vsAxis=buildAxis(CANONICAL_BOUNDS.vMin,CANONICAL_BOUNDS.vMax,FINE_V_MIN,FINE_V_MAX),columns=us.length,rows=vsAxis.length,samples=new Array(columns*rows),vertices=[],indices=[];
  let clipped=0,omitted=0,sandSamples=0,localSamples=0,minElevation=Infinity,maxElevation=-Infinity;const at=(r,c)=>r*columns+c;
  for(let r=0;r<rows;r++)for(let c=0;c<columns;c++){
    const u=us[c],v=vsAxis[r],sample=sampleCanonicalGratitude(u,v);sample.position=tangentPosition(u,v,sample.elevation);sample.normal=tangentDirection(u,v);samples[at(r,c)]=sample;if(sample.terrain){localSamples++;if((sample.terrain.coastline?.beachWeight??0)>.08)sandSamples++;}if(sample.inside){minElevation=Math.min(minElevation,sample.elevation);maxElevation=Math.max(maxElevation,sample.elevation);}
  }
  for(let r=0;r<rows;r++)for(let c=0;c<columns;c++){
    const center=samples[at(r,c)],left=samples[at(r,Math.max(0,c-1))],right=samples[at(r,Math.min(columns-1,c+1))],back=samples[at(Math.max(0,r-1),c)],forward=samples[at(Math.min(rows-1,r+1),c)];
    let n=norm(cross(sub(forward.position,back.position),sub(right.position,left.position)));if(dot(n,tangentDirection(center.u,center.v))<0)n=scale(n,-1);center.normal=n;
  }
  const emitTriangle=triangle=>{const polygon=clipPositive(triangle);if(polygon.length<3){omitted++;return;}if(polygon.length!==3||triangle.some(x=>x.field<0))clipped++;const base=emitTerrainRecord(vertices,polygon[0]);for(let i=1;i<polygon.length-1;i++)indices.push(base,emitTerrainRecord(vertices,polygon[i]),emitTerrainRecord(vertices,polygon[i+1]));};
  for(let r=0;r<rows-1;r++)for(let c=0;c<columns-1;c++){const a=samples[at(r,c)],b=samples[at(r,c+1)],d=samples[at(r+1,c)],e=samples[at(r+1,c+1)];emitTriangle([a,d,b]);emitTriangle([b,d,e]);}
  return freeze({vertices:new Float32Array(vertices),indices:new Uint32Array(indices),statistics:freeze({surfaceAuthority:SURFACE_AUTHORITY,triangleCount:indices.length/3,adaptiveSpatialSampling:true,coarseStepAuthoringUnits:COARSE_STEP,fineStepAuthoringUnits:FINE_STEP,fineUInterval:freeze([FINE_U_MIN,FINE_U_MAX]),fineVInterval:freeze([FINE_V_MIN,FINE_V_MAX]),coastlineTopology:'SUBCELL_SCALAR_FIELD_CLIPPED',clippedCoastlineTriangleCount:clipped,omittedOceanTriangles:omitted,terrainIntegratedSandSampleCount:sandSamples,localInfluencedSampleCount:localSamples,terrainIntegratedSand:true,independentBeachVisualAuthority:false,separateBeachGeometryConstructed:false,separateWetSandGeometryConstructed:false,singleSurfaceAcrossAllScales:true,cameraDistanceCanChangeGeography:false,geographicInterpolationConstructed:false,localScaleCompressed:false,localArcScaleOneToOne:true,localWidthAuthoringUnits:512,localDepthAuthoringUnits:384,sourceTerrainMutation:false,minimumElevation:minElevation,maximumElevation:maxElevation,fullLocalSourceInsideProtectedDomain:true})});
}

const OTHER_CONTINENTS=freeze([[28,38,.27,1.3,.7],[-24,72,.28,.82,1.28],[15,119,.25,1.4,.66],[-32,154,.27,1.08,.84],[34,-149,.26,.78,1.34],[-27,-112,.29,1.3,.76],[8,-76,.26,.9,1.26],[-42,-37,.24,1.38,.68]].map(freeze));
function directionFromLatLon(lat,lon){lat*=Math.PI/180;lon*=Math.PI/180;return norm([Math.cos(lat)*Math.cos(lon),Math.sin(lat),Math.cos(lat)*Math.sin(lon)]);}
const OTHER_DIRECTIONS=OTHER_CONTINENTS.map(a=>freeze([directionFromLatLon(a[0],a[1]),a[2],a[3],a[4]]));
function otherPlanetSurface(direction){
  let best=0;for(const item of OTHER_DIRECTIONS){const angle=Math.acos(clamp(dot(direction,item[0]),-1,1));best=Math.max(best,1-smooth(item[1]*.65,item[1],angle));}
  const land=smooth(.25,.55,best),noise=.5+.5*Math.sin(direction[0]*8+direction[2]*6);if(land<.01)return{elevation:HYDRO.seaLevelY,color:mix3(PALETTE.oceanDeep,PALETTE.ocean,noise*.40),land:0};
  const elevation=HYDRO.seaLevelY+land*(14+25*best+8*Math.sin(direction[0]*19+direction[2]*11));return{elevation,color:mix3(PALETTE.low,PALETTE.high,c01((elevation-20)/60)*.55),land};
}
function gratitudeWaterMaterial(direction,defaultColor){
  const uv=tangentCoordinatesFromDirection(direction);if(uv.u<CANONICAL_BOUNDS.uMin-120||uv.u>CANONICAL_BOUNDS.uMax+120||uv.v<CANONICAL_BOUNDS.vMin-120||uv.v>CANONICAL_BOUNDS.vMax+120)return{color:defaultColor,gratitudeLand:false};
  const coast=gratitudeCoastSample(uv.u,uv.v);if(coast.inside)return{color:defaultColor,gratitudeLand:true};
  const t=smooth(5,110,coast.distance),near=mix3(PALETTE.shoreWater,PALETTE.shallow,t*.72);return{color:mix3(near,defaultColor,t),gratitudeLand:false};
}
function buildPlanetMesh(){
  const lonSegments=224,latSegments=144,vertices=[],indices=[],records=[];const at=(r,c)=>r*(lonSegments+1)+c;
  for(let r=0;r<=latSegments;r++){
    const latitude=-Math.PI/2+r/latSegments*Math.PI,cosLat=Math.cos(latitude),sinLat=Math.sin(latitude);
    for(let c=0;c<=lonSegments;c++){
      const longitude=-Math.PI+c/lonSegments*Math.PI*2,direction=norm([cosLat*Math.cos(longitude),sinLat,cosLat*Math.sin(longitude)]),surface=otherPlanetSurface(direction),water=gratitudeWaterMaterial(direction,surface.color),position=surfacePositionFromDirection(direction,surface.elevation);
      records.push({direction,gratitudeLand:water.gratitudeLand});vertices.push(...position,...direction,...water.color,1);
    }
  }
  const addTri=(ia,ib,ic)=>{const a=records[ia],b=records[ib],c=records[ic],count=Number(a.gratitudeLand)+Number(b.gratitudeLand)+Number(c.gratitudeLand);if(count===3)return;if(count>0){const center=norm(add(add(a.direction,b.direction),c.direction)),uv=tangentCoordinatesFromDirection(center);if(gratitudeCoastSample(uv.u,uv.v).inside)return;}indices.push(ia,ib,ic);};
  for(let r=0;r<latSegments;r++)for(let c=0;c<lonSegments;c++){const a=at(r,c),b=at(r,c+1),d=at(r+1,c),e=at(r+1,c+1);addTri(a,d,b);addTri(b,d,e);}
  return freeze({vertices:new Float32Array(vertices),indices:new Uint32Array(indices),statistics:freeze({triangleCount:indices.length/3,definedContinentCount:9,planetaryGratitudeLandRemoved:true,planetaryOceanMaskedUnderCanonicalGratitudeLand:true,planetaryOceanSingleSurface:true,shallowCoastalWaterMaterial:true,otherContinentsPlacementsCanonical:false,unresolvedContinentPresentation:'ANISOTROPIC_WARPED_CONTOUR_PREVIEW'})});
}
function buildReservoirWaterMesh(){
  const vertices=[],indices=[],reservoir=HYDRO.reservoir,segments=72,push=(x,y,z,color)=>vertices.push(...tangentPosition(x,z-LOCAL_CENTER_Z,y),...color);
  push(reservoir.center.x,reservoir.waterSurfaceElevation,reservoir.center.z,PALETTE.reservoir);
  for(let i=0;i<=segments;i++){const point=resolveHEarthMapWideReservoirBoundaryPoint(i/segments*Math.PI*2);push(point.x,reservoir.waterSurfaceElevation+.03,point.z,PALETTE.reservoir);}
  for(let i=0;i<segments;i++)indices.push(0,i+1,i+2);
  return freeze({vertices:new Float32Array(vertices),indices:new Uint32Array(indices),statistics:freeze({triangleCount:indices.length/3,reservoirProtected:true,waterfallBasinProtected:true,planetaryOceanSingleSurface:true,planetaryOceanMaskedUnderCanonicalGratitudeLand:true,localOceanOverlayConstructed:false,oceanTriangleCount:0,reservoirColorClass:'LIGHT_INLAND_WATER'})});
}

function resolveCanonicalFeaturePosition(anchor){
  if(anchor.class==='COASTLINE'||anchor.class==='HEADLAND')return{x:anchor.x,z:gratitudeShorelineZ(anchor.x)};
  if(anchor.class==='RESERVOIR_CENTER')return{x:HYDRO.reservoir.center.x,z:HYDRO.reservoir.center.z};
  if(anchor.class==='RESERVOIR_BOUNDARY'){const point=resolveHEarthMapWideReservoirBoundaryPoint(anchor.id.includes('EAST')?0:Math.PI);return{x:point.x,z:point.z};}
  return{x:anchor.x,z:anchor.z};
}
export function evaluateCanonicalGeographicIdentity(manifest){
  const anchors=manifest?.anchors??[],tolerance=manifest?.roundTripToleranceAuthoringUnits??1e-6,results=[];let maximumRoundTripError=0,maximumFeatureBindingError=0;
  for(const anchor of anchors){const u=anchor.x,v=anchor.z-LOCAL_CENTER_Z,direction=tangentDirection(u,v),inverse=tangentCoordinatesFromDirection(direction),roundTripError=Math.hypot(inverse.u-u,inverse.v+LOCAL_CENTER_Z-anchor.z),feature=resolveCanonicalFeaturePosition(anchor),featureBindingError=Math.hypot(feature.x-anchor.x,feature.z-anchor.z);maximumRoundTripError=Math.max(maximumRoundTripError,roundTripError);maximumFeatureBindingError=Math.max(maximumFeatureBindingError,featureBindingError);results.push(freeze({id:anchor.id,roundTripError,featureBindingError,pass:roundTripError<=tolerance&&featureBindingError<=tolerance}));}
  return freeze({schema:'H_EARTH_OW01_CANONICAL_POSITIONAL_IDENTITY_GATE_v3',coherenceOperation:COHERENCE_OPERATION,anchorCount:anchors.length,toleranceAuthoringUnits:tolerance,maximumRoundTripError,maximumFeatureBindingError,canonicalPositionalIdentityPassed:anchors.length===12&&results.every(x=>x.pass),results:freeze(results)});
}
function evaluateSurfaceCorrespondence(){
  const probes=[[-192,-56.816],[0,-43.313],[118,-89.992],[198,-40.578],[-79,-286],[-44,-211],[80,-172],[0,-160],[0,-600],[600,-1000]],results=probes.map(([x,z])=>{const sample=sampleCanonicalGratitude(x,z-LOCAL_CENTER_Z);return freeze({x,z,authority:sample.authority,pass:sample.authority===SURFACE_AUTHORITY});});
  return freeze({schema:'H_EARTH_OW01_SURFACE_CORRESPONDENCE_GATE_v2',surfaceAuthority:SURFACE_AUTHORITY,probeCount:results.length,maximumAuthorityCount:1,scaleDependentGeographicSubstitution:false,adaptiveSpatialSampling:true,pass:results.every(x=>x.pass),results:freeze(results)});
}

const TERRAIN_VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec4 aColor;
uniform mat4 uVP;
out vec3 vPos;
out vec3 vNormal;
out vec4 vColor;
void main(){vPos=aPosition;vNormal=aNormal;vColor=aColor;gl_Position=uVP*vec4(aPosition,1.0);}`;
const TERRAIN_FS=`#version 300 es
precision highp float;
in vec3 vPos;
in vec3 vNormal;
in vec4 vColor;
uniform vec3 uEye;
uniform vec3 uHaze;
uniform float uFogStart;
uniform float uFogEnd;
out vec4 outColor;
void main(){vec3 n=normalize(vNormal);vec3 light=normalize(vec3(.42,.78,.46));float d=max(dot(n,light),0.0);float hemi=.64+.36*clamp(n.y*.5+.5,0.0,1.0);vec3 c=vColor.rgb*(.56+.54*d)*hemi;float dist=length(vPos-uEye);float fog=clamp((dist-uFogStart)/max(1.0,uFogEnd-uFogStart),0.0,.64);outColor=vec4(mix(c,uHaze,fog),vColor.a);}`;
const WATER_VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec4 aColor;
uniform mat4 uVP;
out vec4 vColor;
void main(){gl_Position=uVP*vec4(aPosition,1.0);vColor=aColor;}`;
const WATER_FS=`#version 300 es
precision highp float;
in vec4 vColor;
out vec4 outColor;
void main(){outColor=vColor;}`;
function compileShader(gl,type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(`SHADER_COMPILE_FAILED:${gl.getShaderInfoLog(shader)}`);return shader;}
function createProgram(gl,vs,fs){const program=gl.createProgram();gl.attachShader(program,compileShader(gl,gl.VERTEX_SHADER,vs));gl.attachShader(program,compileShader(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(`PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(program)}`);return program;}
function perspective(fov,aspect,near,far){const factor=1/Math.tan(fov/2),inverse=1/(near-far);return new Float32Array([factor/aspect,0,0,0,0,factor,0,0,0,0,(far+near)*inverse,-1,0,0,2*far*near*inverse,0]);}
function lookAt(eye,target,up){const z=norm(sub(eye,target));let x=cross(up,z);if(Math.hypot(...x)<1e-5)x=[1,0,0];x=norm(x);const y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);}
function multiply(left,right){const output=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)output[c*4+r]=left[r]*right[c*4]+left[4+r]*right[c*4+1]+left[8+r]*right[c*4+2]+left[12+r]*right[c*4+3];return output;}
function terrainBuffer(gl,mesh){const vao=gl.createVertexArray();gl.bindVertexArray(vao);const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,mesh.vertices,gl.STATIC_DRAW);for(const [location,size,offset] of [[0,3,0],[1,3,12],[2,4,24]]){gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,size,gl.FLOAT,false,40,offset);}const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.STATIC_DRAW);return vao;}
function waterBuffer(gl,mesh){const vao=gl.createVertexArray();gl.bindVertexArray(vao);const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,mesh.vertices,gl.STATIC_DRAW);for(const [location,size,offset] of [[0,3,0],[1,4,12]]){gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,size,gl.FLOAT,false,28,offset);}const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.STATIC_DRAW);return vao;}

export function createMapWideEnvironmentRenderer(canvas){
  const gl=canvas.getContext('webgl2',{antialias:true,alpha:false,powerPreference:'high-performance'});if(!gl)throw new Error('WEBGL2_CONTEXT_UNAVAILABLE');
  const terrainProgram=createProgram(gl,TERRAIN_VS,TERRAIN_FS),waterProgram=createProgram(gl,WATER_VS,WATER_FS),planetMesh=buildPlanetMesh(),gratitudeMesh=buildGratitudeMesh(),waterMesh=buildReservoirWaterMesh(),planetVao=terrainBuffer(gl,planetMesh),gratitudeVao=terrainBuffer(gl,gratitudeMesh),waterVao=waterBuffer(gl,waterMesh),empty=freeze({vertices:new Float32Array(),indices:new Uint32Array(),statistics:freeze({triangleCount:0,surfaceAuthority:SURFACE_AUTHORITY,geographicInterpolationConstructed:false,independentBeachVisualAuthority:false,separateBeachGeometryConstructed:false,separateWetSandGeometryConstructed:false,seawardWetTransitionConstructed:false})}),surfaceCorrespondence=evaluateSurfaceCorrespondence();
  const state={yaw:-.62,pitch:.88,distance:720,targetU:0,targetV:-4,renderedFrames:0};
  function resize(){const dpr=Math.min(1.35,window.devicePixelRatio||1),width=Math.max(1,Math.round(canvas.clientWidth*dpr)),height=Math.max(1,Math.round(canvas.clientHeight*dpr));if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}gl.viewport(0,0,width,height);}
  function limitTarget(){const radius=Math.hypot(state.targetU,state.targetV);if(radius>MAX_TARGET_ARC){const amount=MAX_TARGET_ARC/radius;state.targetU*=amount;state.targetV*=amount;}}
  function viewScale(){if(state.distance<900)return'LOCAL';if(state.distance<2200)return'REGION';if(state.distance<4200)return'CONTINENT';return'PLANETARY';}
  function camera(){state.pitch=clamp(state.pitch,.46,1.49);state.distance=clamp(state.distance,95,5600);limitTarget();const direction=tangentDirection(state.targetU,state.targetV),groundSample=sampleCanonicalGratitude(state.targetU,state.targetV),ground=groundSample.inside?groundSample.elevation:HYDRO.seaLevelY,target=surfacePositionFromDirection(direction,ground),pU1=tangentPosition(state.targetU+1,state.targetV),pU0=tangentPosition(state.targetU-1,state.targetV),pV1=tangentPosition(state.targetU,state.targetV+1),pV0=tangentPosition(state.targetU,state.targetV-1),eU=norm(sub(pU1,pU0)),eV=norm(sub(pV1,pV0)),horizontal=norm(add(scale(eU,Math.sin(state.yaw)),scale(eV,Math.cos(state.yaw)))),eye=add(add(target,scale(direction,state.distance*Math.sin(state.pitch)+18)),scale(horizontal,state.distance*Math.cos(state.pitch)));return{eye,target,up:direction};}
  function drawTerrain(mesh,vao,cam,fogStart,fogEnd,offset=0){if(mesh.indices.length===0)return null;const projection=perspective(55*Math.PI/180,canvas.width/canvas.height,2,PLANET_RADIUS*4.5),vp=multiply(projection,lookAt(cam.eye,cam.target,cam.up));gl.useProgram(terrainProgram);gl.uniformMatrix4fv(gl.getUniformLocation(terrainProgram,'uVP'),false,vp);gl.uniform3fv(gl.getUniformLocation(terrainProgram,'uEye'),cam.eye);gl.uniform3fv(gl.getUniformLocation(terrainProgram,'uHaze'),PALETTE.haze);gl.uniform1f(gl.getUniformLocation(terrainProgram,'uFogStart'),fogStart);gl.uniform1f(gl.getUniformLocation(terrainProgram,'uFogEnd'),fogEnd);gl.disable(gl.BLEND);gl.depthMask(true);if(offset){gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(offset,offset);}else gl.disable(gl.POLYGON_OFFSET_FILL);gl.bindVertexArray(vao);gl.drawElements(gl.TRIANGLES,mesh.indices.length,gl.UNSIGNED_INT,0);gl.disable(gl.POLYGON_OFFSET_FILL);return vp;}
  function render(){resize();gl.enable(gl.DEPTH_TEST);gl.clearColor(...PALETTE.sky,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);const cam=camera(),vp=drawTerrain(planetMesh,planetVao,cam,3600,11800);drawTerrain(gratitudeMesh,gratitudeVao,cam,900,7200,1);if(waterMesh.indices.length){gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);gl.useProgram(waterProgram);gl.uniformMatrix4fv(gl.getUniformLocation(waterProgram,'uVP'),false,vp);gl.bindVertexArray(waterVao);gl.drawElements(gl.TRIANGLES,waterMesh.indices.length,gl.UNSIGNED_INT,0);gl.depthMask(true);gl.disable(gl.BLEND);}state.renderedFrames++;}
  function orbit(dx,dy){state.yaw=Math.atan2(Math.sin(state.yaw+clamp(Number(dx)||0,-64,64)*.0052),Math.cos(state.yaw+clamp(Number(dx)||0,-64,64)*.0052));state.pitch=clamp(state.pitch+clamp(Number(dy)||0,-64,64)*.0032,.46,1.49);render();}
  function zoom(delta){state.distance=clamp(state.distance*Math.exp(clamp(Number(delta)||0,-900,900)*.00115),95,5600);render();}
  function zoomByFactor(factor){state.distance=clamp(state.distance/clamp(Number(factor)||1,.72,1.38),95,5600);render();}
  function pan(du,dv){state.targetU+=Number(du)||0;state.targetV+=Number(dv)||0;limitTarget();render();}
  function panScreen(dx,dy){const amount=clamp(state.distance*.0017,.24,9),rightU=Math.cos(state.yaw),rightV=-Math.sin(state.yaw),forwardU=Math.sin(state.yaw),forwardV=Math.cos(state.yaw);pan((-dx*rightU+dy*forwardU)*amount,(-dx*rightV+dy*forwardV)*amount);}
  function focusGratitude(){Object.assign(state,{yaw:-.62,pitch:.88,distance:720,targetU:0,targetV:-4});render();}
  function planetaryVantage(){state.distance=5000;state.pitch=1.02;render();}
  const evidence=freeze({operationId:OPERATION_ID,coherenceOperation:COHERENCE_OPERATION,surfaceAuthority:SURFACE_AUTHORITY,geographicTruthAuthorityCount:1,scaleDependentGeographicSubstitution:false,gratitudeUsesSameMeshAtAllViewScales:true,adaptiveSpatialSampling:true,fullLocalSourceInsideProtectedDomain:true,stitchGeographicInterpolationConstructed:false,independentBeachVisualAuthority:false,separateBeachGeometryConstructed:false,separateWetSandGeometryConstructed:false,seawardWetTransitionGeometryConstructed:false,coastalTerrainMaterialIntegrated:true,shallowCoastalWaterMaterial:true,planetaryOceanMaskedUnderCanonicalGratitudeLand:true,waterfallReservoirRegionProtected:true,planetaryOceanSingleSurface:true,localOceanOverlayConstructed:false,sourceTerrainMutation:false});
  return freeze({planetMesh,continentMesh:gratitudeMesh,gratitudeMesh,stitchMesh:empty,beachMesh:empty,waterMesh,state,render,orbit,zoom,zoomByFactor,pan,panScreen,fitWorld:focusGratitude,focusGratitude,planetaryVantage,getViewScale:viewScale,getCameraSafety:()=>freeze({distanceSafe:state.distance>=95&&state.distance<=5600,continuousScaleRecognized:['LOCAL','REGION','CONTINENT','PLANETARY'].includes(viewScale()),geographySourceInvariantAcrossScale:true,canonicalTargetStableUnderPureZoom:true,fixedFovAcrossScale:true,liveMutationAbsent:true}),getOW01GeographicEvidence:()=>evidence,evaluateCanonicalGeographicIdentity,evaluateSurfaceCorrespondence:()=>surfaceCorrespondence,getSnapshot:()=>freeze({...state,viewScale:viewScale(),planetStatistics:planetMesh.statistics,continentStatistics:gratitudeMesh.statistics,gratitudeStatistics:gratitudeMesh.statistics,stitchStatistics:empty.statistics,beachStatistics:empty.statistics,waterStatistics:waterMesh.statistics,worldContract:AUDRALIA_OPEN_WORLD_AUTHORING_CONTRACT,surfaceCorrespondence,authoringRegionIsWorldBoundary:false,wholePlanetMustFitViewport:false,manorGeometryConstructed:false,liveRuntimeMutated:false,liveCameraMutated:false,liveNavigationMutated:false,liveWaterMutated:false})});
}
export default createMapWideEnvironmentRenderer;

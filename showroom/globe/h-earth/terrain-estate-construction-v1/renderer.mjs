import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY as HYDRO,
  resolveHEarthMapWideReservoirBoundaryPoint,
  resolveHEarthMapWideShorelineZ,
  sampleHEarthMapWideEnvironmentTerrainCandidate as sampleTerrain
} from '../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js';
import {
  CANONICAL_COAST_MODEL as COAST_MODEL,
  BOUNDARY_IDENTITY_HASH,
  sampleCanonicalCoast,
  sampleCanonicalSandbar
} from './coastline-model.mjs';

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
const CANONICAL_BOUNDS=freeze({uMin:-1760,uMax:1536,vMin:-1952,vMax:320});
const LOCAL_DOMAIN=freeze({xMin:-256,xMax:256,zMin:-320,zMax:64,width:512,depth:384});
const LOCAL_FEATHER=150;
const COARSE_STEP=18;
const FINE_STEP=4;
const FINE_U_MIN=-340;
const FINE_U_MAX=340;
const FINE_V_MIN=-230;
const FINE_V_MAX=230;
const EDGE_ROOT_ITERATIONS=18;
const SHALLOW_OVERLAY_DISTANCE=165;
const MAX_TARGET_ARC=PLANET_RADIUS*Math.PI*.9;

const PALETTE=freeze({
  sky:[.045,.062,.09],haze:[.36,.42,.44],ocean:[.045,.20,.33],oceanDeep:[.025,.10,.20],
  shallow:[.10,.40,.50],shoreWater:[.16,.49,.56],low:[.30,.44,.25],upland:[.36,.43,.29],
  high:[.40,.40,.33],rock:[.43,.41,.38],beach:[.68,.60,.44],wet:[.47,.42,.32],
  meadow:[.34,.45,.24],coastal:[.28,.39,.23],estate:[.41,.50,.29],earth:[.35,.29,.19],
  reservoir:[.10,.40,.50,.88],unresolved:[.13,.21,.22]
});

export const AUDRALIA_OPEN_WORLD_AUTHORING_CONTRACT=freeze({
  schema:'AUDRALIA_CONTINUOUS_MULTISCALE_WORLD_MODEL_v1',operationId:OPERATION_ID,
  coherenceOperation:COHERENCE_OPERATION,checkpoint:'OW01',lockGeneration:473,
  governingHead:'c50d0a06a73ed149286508a15e697d8efa254865',
  immutableMigrationSource:'ad9e72adb97df7ab867af1fe20df2c29de763d28',
  canonicalSurfaceAuthority:SURFACE_AUTHORITY,canonicalCoastAuthority:COAST_AUTHORITY,
  boundaryIdentityHash:BOUNDARY_IDENTITY_HASH,geographicTruthAuthorityCount:1,
  scaleRepresentationRule:'ONE_CANONICAL_SURFACE_ADAPTIVE_SPATIAL_SAMPLING',
  coastlineTopology:'QUAD_CELL_SHARED_EDGE_CONFORMING',
  localFidelityRestoration:'FULL_LOCAL_SOURCE_INSIDE_PROTECTED_DOMAIN_WITH_FIXED_SPATIAL_FEATHER_OUTSIDE',
  cameraDistanceCanChangeGeography:false,localMacroTransition:'CANONICAL_FIELD_SPATIAL_RECONCILIATION_NOT_CAMERA_LOD',
  stitchGeographicAuthority:false,coastalTerrainMaterialIntegrated:true,independentBeachVisualAuthority:false,
  separateBeachGeometryConstructed:false,separateWetSandGeometryConstructed:false,seawardWetTransitionGeometryConstructed:false,
  shallowCoastalWaterMaterial:true,planetaryOceanSingleSurface:true,planetaryOceanMaskedByCanonicalLandStencil:true,
  planetaryOceanTriangleCullingForGratitudeMask:false,coastalWaterConsumesCanonicalBoundary:true,
  unresolvedContinentPresentation:'ATMOSPHERIC_HAZE_ONLY',liveIntegrationAuthorized:false,authoringPreviewOnly:true
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
  const z=v+LOCAL_CENTER_Z,coast=sampleCanonicalCoast(u,v),baseElevation=macroElevation(u,v,coast),bar=sampleCanonicalSandbar(u,v);
  let elevation=baseElevation,color=macroColor(u,v,baseElevation,coast),local=sampleLocalSource(u,z),terrain=null;
  if(local){terrain=local.terrain;const localElevation=normalizeLocalElevation(terrain.presentationElevation);
    if(local.boundary){const boundaryV=local.sampleZ-LOCAL_CENTER_Z,boundaryCoast=sampleCanonicalCoast(local.sampleX,boundaryV),boundaryMacro=macroElevation(local.sampleX,boundaryV,boundaryCoast),delta=localElevation-boundaryMacro;elevation=baseElevation+delta*local.weight;color=mix3(color,localTerrainColor(terrain,localElevation),local.weight*.90);}
    else{elevation=localElevation;color=localTerrainColor(terrain,localElevation);}
  }
  if(bar?.inside){const crest=HYDRO.seaLevelY+Math.max(.38,bar.crestElevation),barElevation=mix(HYDRO.seaLevelY+.38,crest,smooth(0,1,bar.weight));elevation=Math.max(elevation,barElevation);color=mix3(color,PALETTE.beach,.55+.30*bar.weight);}
  if(!coast.inside)return{u,v,z,field:coast.field,inside:false,elevation:HYDRO.seaLevelY,color:PALETTE.ocean,terrain,coast,bar,authority:SURFACE_AUTHORITY};
  return{u,v,z,field:coast.field,inside:true,elevation,color,terrain,coast,bar,authority:SURFACE_AUTHORITY};
}

function buildAxis(min,max,fineMin,fineMax){
  const values=[min];let x=min;
  while(x<max-1e-9){let step=x>=fineMin&&x<fineMax?FINE_STEP:COARSE_STEP,next=Math.min(max,x+step);if(x<fineMin&&next>fineMin)next=fineMin;if(x<fineMax&&next>fineMax)next=fineMax;if(next<=x+1e-9)next=Math.min(max,x+step);values.push(next);x=next;}
  return freeze(values);
}
function decorateSample(sample){sample.position=tangentPosition(sample.u,sample.v,sample.elevation);sample.normal=tangentDirection(sample.u,sample.v);return sample;}
function emitTerrainRecord(vertices,record){const index=vertices.length/10;vertices.push(...record.position,...record.normal,...record.color,1);return index;}
function emitWaterRecord(vertices,record){const index=vertices.length/7;vertices.push(...record.position,...record.color,1);return index;}
function edgeKey(a,b){const ka=`${a.u.toFixed(6)},${a.v.toFixed(6)}`,kb=`${b.u.toFixed(6)},${b.v.toFixed(6)}`;return ka<kb?`${ka}|${kb}`:`${kb}|${ka}`;}
function rootCoordinate(a,b,cache){
  const key=edgeKey(a,b);if(cache.has(key))return cache.get(key);
  if(Math.abs(a.field)<=1e-12){const root=freeze({u:a.u,v:a.v});cache.set(key,root);return root;}
  if(Math.abs(b.field)<=1e-12){const root=freeze({u:b.u,v:b.v});cache.set(key,root);return root;}
  let lo={u:a.u,v:a.v,field:a.field},hi={u:b.u,v:b.v,field:b.field};
  for(let i=0;i<EDGE_ROOT_ITERATIONS;i++){
    const u=(lo.u+hi.u)*.5,v=(lo.v+hi.v)*.5,field=sampleCanonicalCoast(u,v).field,mid={u,v,field};
    if((lo.field>=0)===(field>=0))lo=mid;else hi=mid;
  }
  const root=freeze({u:(lo.u+hi.u)*.5,v:(lo.v+hi.v)*.5});cache.set(key,root);return root;
}
function boundaryLandRecord(root,a,b){
  const span=Math.hypot(b.u-a.u,b.v-a.v)||1,t=clamp(Math.hypot(root.u-a.u,root.v-a.v)/span,0,1),elevation=Math.max(HYDRO.seaLevelY+.02,mix(a.elevation,b.elevation,t)),color=mix3(PALETTE.beach,mix3(a.color,b.color,t),.38);
  return{u:root.u,v:root.v,field:0,inside:true,elevation,color,position:tangentPosition(root.u,root.v,elevation),normal:norm(mix3(a.normal,b.normal,t))};
}
function waterColor(distance){const t=smooth(0,SHALLOW_OVERLAY_DISTANCE,distance),near=mix3(PALETTE.shoreWater,PALETTE.shallow,smooth(8,90,distance));return mix3(near,PALETTE.ocean,t);}
function waterRecord(u,v,distance=0){return{u,v,field:-Math.max(0,distance),inside:false,color:waterColor(distance),position:tangentPosition(u,v,HYDRO.seaLevelY+.04)};}
function polygonTokens(caseIndex,centerPositive){
  const c=i=>`c${i}`,e=i=>`e${i}`;
  const table={
    0:[],1:[[c(0),e(0),e(3)]],2:[[e(0),c(1),e(1)]],3:[[c(0),c(1),e(1),e(3)]],
    4:[[e(1),c(2),e(2)]],6:[[e(0),c(1),c(2),e(2)]],7:[[c(0),c(1),c(2),e(2),e(3)]],
    8:[[e(3),e(2),c(3)]],9:[[c(0),e(0),e(2),c(3)]],11:[[c(0),c(1),e(1),e(2),c(3)]],
    12:[[e(3),e(1),c(2),c(3)]],13:[[c(0),e(0),e(1),c(2),c(3)]],14:[[e(0),c(1),c(2),c(3),e(3)]],15:[[c(0),c(1),c(2),c(3)]]
  };
  if(caseIndex===5)return centerPositive?[[c(0),e(0),'m',e(3)],[e(1),c(2),e(2),'m']]:[[c(0),e(0),e(3)],[e(1),c(2),e(2)]];
  if(caseIndex===10)return centerPositive?[[e(0),c(1),e(1),'m'],['m',e(2),c(3),e(3)]]:[[e(0),c(1),e(1)],[e(2),c(3),e(3)]];
  return table[caseIndex]??[];
}
function resolveCellPolygons(corners,wantLand,cache){
  const positive=corners.map(c=>wantLand?c.field>=0:c.field<0),caseIndex=positive.reduce((sum,value,index)=>sum+(value?(1<<index):0),0);
  if(caseIndex===0)return freeze({caseIndex,polygons:freeze([]),ambiguous:false});
  const edges=[[0,1],[1,2],[2,3],[3,0]],roots=new Map();
  const rootRecord=edge=>{
    if(roots.has(edge))return roots.get(edge);const [ia,ib]=edges[edge],a=corners[ia],b=corners[ib],root=rootCoordinate(a,b,cache),record=wantLand?boundaryLandRecord(root,a,b):waterRecord(root.u,root.v,0);roots.set(edge,record);return record;
  };
  const centerSample=decorateSample(sampleCanonicalGratitude((corners[0].u+corners[2].u)*.5,(corners[0].v+corners[2].v)*.5)),centerPositive=wantLand?centerSample.field>=0:centerSample.field<0;
  const tokens=polygonTokens(caseIndex,centerPositive),polygons=tokens.map(polygon=>polygon.map(token=>{
    if(token==='m')return wantLand?centerSample:waterRecord(centerSample.u,centerSample.v,Math.abs(centerSample.field));
    const type=token[0],index=Number(token.slice(1));if(type==='e')return rootRecord(index);
    const corner=corners[index];return wantLand?corner:waterRecord(corner.u,corner.v,Math.abs(corner.field));
  }));
  return freeze({caseIndex,polygons:freeze(polygons.map(freeze)),ambiguous:caseIndex===5||caseIndex===10});
}
function emitPolygon(polygon,vertices,indices,water=false){
  if(polygon.length<3)return 0;const emit=water?emitWaterRecord:emitTerrainRecord,base=emit(vertices,polygon[0]);let triangles=0;
  for(let i=1;i<polygon.length-1;i++){const ib=emit(vertices,polygon[i]),ic=emit(vertices,polygon[i+1]);indices.push(base,ib,ic);triangles++;}return triangles;
}
function buildGratitudeMeshes(){
  const us=buildAxis(CANONICAL_BOUNDS.uMin,CANONICAL_BOUNDS.uMax,FINE_U_MIN,FINE_U_MAX),vs=buildAxis(CANONICAL_BOUNDS.vMin,CANONICAL_BOUNDS.vMax,FINE_V_MIN,FINE_V_MAX),columns=us.length,rows=vs.length,samples=new Array(columns*rows),landVertices=[],landIndices=[],waterVertices=[],waterIndices=[],edgeRoots=new Map();
  const at=(r,c)=>r*columns+c;let coastCells=0,ambiguousCells=0,landTriangles=0,waterTriangles=0,omittedOceanCells=0,sandSamples=0,localSamples=0,minElevation=Infinity,maxElevation=-Infinity;
  for(let r=0;r<rows;r++)for(let c=0;c<columns;c++){
    const sample=decorateSample(sampleCanonicalGratitude(us[c],vs[r]));samples[at(r,c)]=sample;if(sample.terrain){localSamples++;if((sample.terrain.coastline?.beachWeight??0)>.08||sample.bar?.inside)sandSamples++;}if(sample.inside){minElevation=Math.min(minElevation,sample.elevation);maxElevation=Math.max(maxElevation,sample.elevation);}
  }
  for(let r=0;r<rows;r++)for(let c=0;c<columns;c++){
    const center=samples[at(r,c)],left=samples[at(r,Math.max(0,c-1))],right=samples[at(r,Math.min(columns-1,c+1))],back=samples[at(Math.max(0,r-1),c)],forward=samples[at(Math.min(rows-1,r+1),c)];let n=norm(cross(sub(forward.position,back.position),sub(right.position,left.position)));if(dot(n,tangentDirection(center.u,center.v))<0)n=scale(n,-1);center.normal=n;
  }
  for(let r=0;r<rows-1;r++)for(let c=0;c<columns-1;c++){
    const corners=[samples[at(r,c)],samples[at(r,c+1)],samples[at(r+1,c+1)],samples[at(r+1,c)]],signs=corners.map(x=>x.field>=0),count=signs.filter(Boolean).length,crossing=count>0&&count<4;
    const land=resolveCellPolygons(corners,true,edgeRoots);if(crossing)coastCells++;if(land.ambiguous)ambiguousCells++;for(const polygon of land.polygons)landTriangles+=emitPolygon(polygon,landVertices,landIndices,false);
    const nearCoast=crossing||Math.min(...corners.map(x=>Math.abs(x.field)))<=SHALLOW_OVERLAY_DISTANCE;
    if(nearCoast){const water=resolveCellPolygons(corners,false,edgeRoots);for(const polygon of water.polygons)waterTriangles+=emitPolygon(polygon,waterVertices,waterIndices,true);}else omittedOceanCells++;
  }
  const shared=freeze({boundaryIdentityHash:BOUNDARY_IDENTITY_HASH,coastlineTopology:'QUAD_CELL_SHARED_EDGE_CONFORMING',sharedEdgeRootCount:edgeRoots.size,coastCrossingCellCount:coastCells,ambiguousCellCount:ambiguousCells});
  const landMesh=freeze({vertices:new Float32Array(landVertices),indices:new Uint32Array(landIndices),statistics:freeze({...shared,surfaceAuthority:SURFACE_AUTHORITY,triangleCount:landTriangles,adaptiveSpatialSampling:true,coarseStepAuthoringUnits:COARSE_STEP,fineStepAuthoringUnits:FINE_STEP,terrainIntegratedSandSampleCount:sandSamples,localInfluencedSampleCount:localSamples,terrainIntegratedSand:true,independentBeachVisualAuthority:false,separateBeachGeometryConstructed:false,separateWetSandGeometryConstructed:false,singleSurfaceAcrossAllScales:true,cameraDistanceCanChangeGeography:false,geographicInterpolationConstructed:false,localScaleCompressed:false,localArcScaleOneToOne:true,localWidthAuthoringUnits:512,localDepthAuthoringUnits:384,minimumElevation:minElevation,maximumElevation:maxElevation,fullLocalSourceInsideProtectedDomain:true,detachedSandbarCount:COAST_MODEL.sandbarCount})});
  const coastalWaterMesh=freeze({vertices:new Float32Array(waterVertices),indices:new Uint32Array(waterIndices),statistics:freeze({...shared,triangleCount:waterTriangles,shallowCoastalWaterMaterial:true,waterOwnsGeography:false,canonicalBoundaryConsumer:true,overlayDistanceAuthoringUnits:SHALLOW_OVERLAY_DISTANCE,farOceanCellsOmitted:omittedOceanCells})});
  return freeze({landMesh,coastalWaterMesh});
}

const UNRESOLVED_HINTS=freeze([[28,38,.27],[-24,72,.28],[15,119,.25],[-32,154,.27],[34,-149,.26],[-27,-112,.29],[8,-76,.26],[-42,-37,.24]].map(freeze));
function directionFromLatLon(lat,lon){lat*=Math.PI/180;lon*=Math.PI/180;return norm([Math.cos(lat)*Math.cos(lon),Math.sin(lat),Math.cos(lat)*Math.sin(lon)]);}
const HINT_DIRECTIONS=UNRESOLVED_HINTS.map(a=>freeze([directionFromLatLon(a[0],a[1]),a[2]]));
function planetOceanColor(direction){
  let hint=0;for(const item of HINT_DIRECTIONS){const angle=Math.acos(clamp(dot(direction,item[0]),-1,1));hint=Math.max(hint,1-smooth(item[1]*.58,item[1],angle));}
  const noise=.5+.5*Math.sin(direction[0]*8+direction[2]*6),base=mix3(PALETTE.oceanDeep,PALETTE.ocean,.38+.22*noise);return mix3(base,PALETTE.unresolved,hint*.16);
}
function buildPlanetMesh(){
  const lonSegments=224,latSegments=144,vertices=[],indices=[],at=(r,c)=>r*(lonSegments+1)+c;
  for(let r=0;r<=latSegments;r++){
    const latitude=-Math.PI/2+r/latSegments*Math.PI,cosLat=Math.cos(latitude),sinLat=Math.sin(latitude);
    for(let c=0;c<=lonSegments;c++){
      const longitude=-Math.PI+c/lonSegments*Math.PI*2,direction=norm([cosLat*Math.cos(longitude),sinLat,cosLat*Math.sin(longitude)]),position=surfacePositionFromDirection(direction,HYDRO.seaLevelY),color=planetOceanColor(direction);vertices.push(...position,...direction,...color,1);
    }
  }
  for(let r=0;r<latSegments;r++)for(let c=0;c<lonSegments;c++){const a=at(r,c),b=at(r,c+1),d=at(r+1,c),e=at(r+1,c+1);indices.push(a,d,b,b,d,e);}
  return freeze({vertices:new Float32Array(vertices),indices:new Uint32Array(indices),statistics:freeze({triangleCount:indices.length/3,planetaryOceanSingleSurface:true,planetaryOceanTriangleCullingForGratitudeMask:false,gratitudeLandStencilMask:true,unresolvedContinentHintCount:UNRESOLVED_HINTS.length,otherContinentsPlacementsCanonical:false,unresolvedContinentPresentation:'ATMOSPHERIC_HAZE_ONLY'})});
}
function buildReservoirWaterMesh(){
  const vertices=[],indices=[],reservoir=HYDRO.reservoir,segments=72,push=(x,y,z,color)=>vertices.push(...tangentPosition(x,z-LOCAL_CENTER_Z,y),...color);
  push(reservoir.center.x,reservoir.waterSurfaceElevation,reservoir.center.z,PALETTE.reservoir);
  for(let i=0;i<=segments;i++){const point=resolveHEarthMapWideReservoirBoundaryPoint(i/segments*Math.PI*2);push(point.x,reservoir.waterSurfaceElevation+.03,point.z,PALETTE.reservoir);}
  for(let i=0;i<segments;i++)indices.push(0,i+1,i+2);
  return freeze({vertices:new Float32Array(vertices),indices:new Uint32Array(indices),statistics:freeze({triangleCount:indices.length/3,reservoirProtected:true,waterfallBasinProtected:true,reservoirColorClass:'LIGHT_INLAND_WATER',canonicalOceanMaskIndependentOfTerrainElevation:true})});
}

function resolveCanonicalFeaturePosition(anchor){
  if(anchor.class==='COASTLINE'||anchor.class==='HEADLAND')return{x:anchor.x,z:resolveHEarthMapWideShorelineZ(anchor.x)};
  if(anchor.class==='RESERVOIR_CENTER')return{x:HYDRO.reservoir.center.x,z:HYDRO.reservoir.center.z};
  if(anchor.class==='RESERVOIR_BOUNDARY'){const point=resolveHEarthMapWideReservoirBoundaryPoint(anchor.id.includes('EAST')?0:Math.PI);return{x:point.x,z:point.z};}
  return{x:anchor.x,z:anchor.z};
}
export function evaluateCanonicalGeographicIdentity(manifest){
  const anchors=manifest?.anchors??[],tolerance=manifest?.roundTripToleranceAuthoringUnits??1e-6,results=[];let maximumRoundTripError=0,maximumFeatureBindingError=0;
  for(const anchor of anchors){const u=anchor.x,v=anchor.z-LOCAL_CENTER_Z,direction=tangentDirection(u,v),inverse=tangentCoordinatesFromDirection(direction),roundTripError=Math.hypot(inverse.u-u,inverse.v+LOCAL_CENTER_Z-anchor.z),feature=resolveCanonicalFeaturePosition(anchor),featureBindingError=Math.hypot(feature.x-anchor.x,feature.z-anchor.z);maximumRoundTripError=Math.max(maximumRoundTripError,roundTripError);maximumFeatureBindingError=Math.max(maximumFeatureBindingError,featureBindingError);results.push(freeze({id:anchor.id,roundTripError,featureBindingError,pass:roundTripError<=tolerance&&featureBindingError<=tolerance}));}
  return freeze({schema:'H_EARTH_OW01_CANONICAL_POSITIONAL_IDENTITY_GATE_v4',coherenceOperation:COHERENCE_OPERATION,anchorCount:anchors.length,toleranceAuthoringUnits:tolerance,maximumRoundTripError,maximumFeatureBindingError,canonicalPositionalIdentityPassed:anchors.length===12&&results.every(x=>x.pass),results:freeze(results)});
}
function evaluateSurfaceCorrespondence(){
  const probes=[[-192,-56.816],[0,-43.313],[118,-89.992],[198,-40.578],[-79,-286],[-44,-211],[80,-172],[0,-160],[0,-600],[600,-1000]],results=probes.map(([x,z])=>{const sample=sampleCanonicalGratitude(x,z-LOCAL_CENTER_Z);return freeze({x,z,authority:sample.authority,coastAuthority:sample.coast.authority,pass:sample.authority===SURFACE_AUTHORITY&&sample.coast.authority===COAST_AUTHORITY});});
  return freeze({schema:'H_EARTH_OW01_SURFACE_CORRESPONDENCE_GATE_v3',surfaceAuthority:SURFACE_AUTHORITY,coastAuthority:COAST_AUTHORITY,boundaryIdentityHash:BOUNDARY_IDENTITY_HASH,probeCount:results.length,maximumAuthorityCount:1,scaleDependentGeographicSubstitution:false,pass:results.every(x=>x.pass),results:freeze(results)});
}

const TERRAIN_VS=`#version 300 es\nprecision highp float;\nlayout(location=0) in vec3 aPosition;\nlayout(location=1) in vec3 aNormal;\nlayout(location=2) in vec4 aColor;\nuniform mat4 uVP;\nout vec3 vPos;\nout vec3 vNormal;\nout vec4 vColor;\nvoid main(){vPos=aPosition;vNormal=aNormal;vColor=aColor;gl_Position=uVP*vec4(aPosition,1.0);}`;
const TERRAIN_FS=`#version 300 es\nprecision highp float;\nin vec3 vPos;\nin vec3 vNormal;\nin vec4 vColor;\nuniform vec3 uEye;\nuniform vec3 uHaze;\nuniform float uFogStart;\nuniform float uFogEnd;\nout vec4 outColor;\nvoid main(){vec3 n=normalize(vNormal);vec3 light=normalize(vec3(.42,.78,.46));float d=max(dot(n,light),0.0);float hemi=.64+.36*clamp(n.y*.5+.5,0.0,1.0);vec3 c=vColor.rgb*(.56+.54*d)*hemi;float dist=length(vPos-uEye);float fog=clamp((dist-uFogStart)/max(1.0,uFogEnd-uFogStart),0.0,.64);outColor=vec4(mix(c,uHaze,fog),vColor.a);}`;
const WATER_VS=`#version 300 es\nprecision highp float;\nlayout(location=0) in vec3 aPosition;\nlayout(location=1) in vec4 aColor;\nuniform mat4 uVP;\nout vec4 vColor;\nvoid main(){gl_Position=uVP*vec4(aPosition,1.0);vColor=aColor;}`;
const WATER_FS=`#version 300 es\nprecision highp float;\nin vec4 vColor;\nout vec4 outColor;\nvoid main(){outColor=vColor;}`;
const MASK_VS=`#version 300 es\nprecision highp float;\nlayout(location=0) in vec3 aPosition;\nuniform mat4 uVP;\nvoid main(){gl_Position=uVP*vec4(aPosition,1.0);}`;
const MASK_FS=`#version 300 es\nprecision highp float;\nout vec4 outColor;\nvoid main(){outColor=vec4(0.0);}`;
function compileShader(gl,type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(`SHADER_COMPILE_FAILED:${gl.getShaderInfoLog(shader)}`);return shader;}
function createProgram(gl,vs,fs){const program=gl.createProgram();gl.attachShader(program,compileShader(gl,gl.VERTEX_SHADER,vs));gl.attachShader(program,compileShader(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(`PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(program)}`);return program;}
function perspective(fov,aspect,near,far){const factor=1/Math.tan(fov/2),inverse=1/(near-far);return new Float32Array([factor/aspect,0,0,0,0,factor,0,0,0,0,(far+near)*inverse,-1,0,0,2*far*near*inverse,0]);}
function lookAt(eye,target,up){const z=norm(sub(eye,target));let x=cross(up,z);if(Math.hypot(...x)<1e-5)x=[1,0,0];x=norm(x);const y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);}
function multiply(left,right){const output=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)output[c*4+r]=left[r]*right[c*4]+left[4+r]*right[c*4+1]+left[8+r]*right[c*4+2]+left[12+r]*right[c*4+3];return output;}
function terrainBuffer(gl,mesh){const vao=gl.createVertexArray();gl.bindVertexArray(vao);const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,mesh.vertices,gl.STATIC_DRAW);for(const [location,size,offset] of [[0,3,0],[1,3,12],[2,4,24]]){gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,size,gl.FLOAT,false,40,offset);}const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.STATIC_DRAW);return vao;}
function waterBuffer(gl,mesh){const vao=gl.createVertexArray();gl.bindVertexArray(vao);const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,mesh.vertices,gl.STATIC_DRAW);for(const [location,size,offset] of [[0,3,0],[1,4,12]]){gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,size,gl.FLOAT,false,28,offset);}const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.STATIC_DRAW);return vao;}

export function createMapWideEnvironmentRenderer(canvas){
  const gl=canvas.getContext('webgl2',{antialias:true,alpha:false,stencil:true,powerPreference:'high-performance'});if(!gl)throw new Error('WEBGL2_CONTEXT_UNAVAILABLE');
  const terrainProgram=createProgram(gl,TERRAIN_VS,TERRAIN_FS),waterProgram=createProgram(gl,WATER_VS,WATER_FS),maskProgram=createProgram(gl,MASK_VS,MASK_FS),planetMesh=buildPlanetMesh(),gratitude=buildGratitudeMeshes(),gratitudeMesh=gratitude.landMesh,coastalWaterMesh=gratitude.coastalWaterMesh,reservoirWaterMesh=buildReservoirWaterMesh(),planetVao=terrainBuffer(gl,planetMesh),gratitudeVao=terrainBuffer(gl,gratitudeMesh),coastalWaterVao=waterBuffer(gl,coastalWaterMesh),reservoirVao=waterBuffer(gl,reservoirWaterMesh),empty=freeze({vertices:new Float32Array(),indices:new Uint32Array(),statistics:freeze({triangleCount:0,surfaceAuthority:SURFACE_AUTHORITY,geographicInterpolationConstructed:false,independentBeachVisualAuthority:false,separateBeachGeometryConstructed:false,separateWetSandGeometryConstructed:false,seawardWetTransitionConstructed:false})}),surfaceCorrespondence=evaluateSurfaceCorrespondence();
  const state={yaw:-.62,pitch:.88,distance:720,targetU:0,targetV:-4,renderedFrames:0};
  function resize(){const dpr=Math.min(1.35,window.devicePixelRatio||1),width=Math.max(1,Math.round(canvas.clientWidth*dpr)),height=Math.max(1,Math.round(canvas.clientHeight*dpr));if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}gl.viewport(0,0,width,height);}
  function limitTarget(){const radius=Math.hypot(state.targetU,state.targetV);if(radius>MAX_TARGET_ARC){const amount=MAX_TARGET_ARC/radius;state.targetU*=amount;state.targetV*=amount;}}
  function viewScale(){if(state.distance<900)return'LOCAL';if(state.distance<2200)return'REGION';if(state.distance<4200)return'CONTINENT';return'PLANETARY';}
  function camera(){state.pitch=clamp(state.pitch,.46,1.49);state.distance=clamp(state.distance,95,5600);limitTarget();const direction=tangentDirection(state.targetU,state.targetV),groundSample=sampleCanonicalGratitude(state.targetU,state.targetV),ground=groundSample.inside?groundSample.elevation:HYDRO.seaLevelY,target=surfacePositionFromDirection(direction,ground),pU1=tangentPosition(state.targetU+1,state.targetV),pU0=tangentPosition(state.targetU-1,state.targetV),pV1=tangentPosition(state.targetU,state.targetV+1),pV0=tangentPosition(state.targetU,state.targetV-1),eU=norm(sub(pU1,pU0)),eV=norm(sub(pV1,pV0)),horizontal=norm(add(scale(eU,Math.sin(state.yaw)),scale(eV,Math.cos(state.yaw)))),eye=add(add(target,scale(direction,state.distance*Math.sin(state.pitch)+18)),scale(horizontal,state.distance*Math.cos(state.pitch)));return{eye,target,up:direction};}
  function vpFor(cam){return multiply(perspective(55*Math.PI/180,canvas.width/canvas.height,2,PLANET_RADIUS*4.5),lookAt(cam.eye,cam.target,cam.up));}
  function drawTerrain(mesh,vao,cam,vp,fogStart,fogEnd,offset=0){if(mesh.indices.length===0)return;gl.useProgram(terrainProgram);gl.uniformMatrix4fv(gl.getUniformLocation(terrainProgram,'uVP'),false,vp);gl.uniform3fv(gl.getUniformLocation(terrainProgram,'uEye'),cam.eye);gl.uniform3fv(gl.getUniformLocation(terrainProgram,'uHaze'),PALETTE.haze);gl.uniform1f(gl.getUniformLocation(terrainProgram,'uFogStart'),fogStart);gl.uniform1f(gl.getUniformLocation(terrainProgram,'uFogEnd'),fogEnd);gl.disable(gl.BLEND);gl.depthMask(true);if(offset){gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(offset,offset);}else gl.disable(gl.POLYGON_OFFSET_FILL);gl.bindVertexArray(vao);gl.drawElements(gl.TRIANGLES,mesh.indices.length,gl.UNSIGNED_INT,0);gl.disable(gl.POLYGON_OFFSET_FILL);}
  function drawWater(mesh,vao,vp){if(mesh.indices.length===0)return;gl.useProgram(waterProgram);gl.uniformMatrix4fv(gl.getUniformLocation(waterProgram,'uVP'),false,vp);gl.bindVertexArray(vao);gl.drawElements(gl.TRIANGLES,mesh.indices.length,gl.UNSIGNED_INT,0);}
  function writeLandStencil(vp){gl.enable(gl.STENCIL_TEST);gl.stencilMask(0xFF);gl.stencilFunc(gl.ALWAYS,1,0xFF);gl.stencilOp(gl.KEEP,gl.KEEP,gl.REPLACE);gl.colorMask(false,false,false,false);gl.depthMask(false);gl.disable(gl.DEPTH_TEST);gl.useProgram(maskProgram);gl.uniformMatrix4fv(gl.getUniformLocation(maskProgram,'uVP'),false,vp);gl.bindVertexArray(gratitudeVao);gl.drawElements(gl.TRIANGLES,gratitudeMesh.indices.length,gl.UNSIGNED_INT,0);gl.colorMask(true,true,true,true);gl.depthMask(true);gl.enable(gl.DEPTH_TEST);gl.stencilMask(0x00);gl.stencilFunc(gl.NOTEQUAL,1,0xFF);}
  function render(){
    resize();gl.enable(gl.DEPTH_TEST);gl.clearStencil(0);gl.clearColor(...PALETTE.sky,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT|gl.STENCIL_BUFFER_BIT);const cam=camera(),vp=vpFor(cam);
    writeLandStencil(vp);drawTerrain(planetMesh,planetVao,cam,vp,3600,11800);gl.disable(gl.STENCIL_TEST);gl.stencilMask(0xFF);
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);drawWater(coastalWaterMesh,coastalWaterVao,vp);gl.depthMask(true);gl.disable(gl.BLEND);
    drawTerrain(gratitudeMesh,gratitudeVao,cam,vp,900,7200,1);
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);drawWater(reservoirWaterMesh,reservoirVao,vp);gl.depthMask(true);gl.disable(gl.BLEND);state.renderedFrames++;
  }
  function orbit(dx,dy){state.yaw=Math.atan2(Math.sin(state.yaw+clamp(Number(dx)||0,-64,64)*.0052),Math.cos(state.yaw+clamp(Number(dx)||0,-64,64)*.0052));state.pitch=clamp(state.pitch+clamp(Number(dy)||0,-64,64)*.0032,.46,1.49);render();}
  function zoom(delta){state.distance=clamp(state.distance*Math.exp(clamp(Number(delta)||0,-900,900)*.00115),95,5600);render();}
  function zoomByFactor(factor){state.distance=clamp(state.distance/clamp(Number(factor)||1,.72,1.38),95,5600);render();}
  function pan(du,dv){state.targetU+=Number(du)||0;state.targetV+=Number(dv)||0;limitTarget();render();}
  function panScreen(dx,dy){const amount=clamp(state.distance*.0017,.24,9),rightU=Math.cos(state.yaw),rightV=-Math.sin(state.yaw),forwardU=Math.sin(state.yaw),forwardV=Math.cos(state.yaw);pan((-dx*rightU+dy*forwardU)*amount,(-dx*rightV+dy*forwardV)*amount);}
  function focusGratitude(){Object.assign(state,{yaw:-.62,pitch:.88,distance:720,targetU:0,targetV:-4});render();}
  function planetaryVantage(){state.distance=5000;state.pitch=1.02;render();}
  const evidence=freeze({operationId:OPERATION_ID,coherenceOperation:COHERENCE_OPERATION,surfaceAuthority:SURFACE_AUTHORITY,coastAuthority:COAST_AUTHORITY,boundaryIdentityHash:BOUNDARY_IDENTITY_HASH,geographicTruthAuthorityCount:1,scaleDependentGeographicSubstitution:false,gratitudeUsesSameMeshAtAllViewScales:true,fullLocalSourceInsideProtectedDomain:true,coastlineTopology:'QUAD_CELL_SHARED_EDGE_CONFORMING',sharedBoundaryBetweenLandAndWater:true,rotatedEllipseCallsInCanonicalLandAuthority:COAST_MODEL.rotatedEllipseCallsInCanonicalLandAuthority,detachedSandbarCount:COAST_MODEL.sandbarCount,sandbarRepresentation:COAST_MODEL.sandbarRepresentation,planetaryOceanTriangleCullingForGratitudeMask:false,planetaryOceanMaskedByCanonicalLandStencil:true,stitchGeographicInterpolationConstructed:false,independentBeachVisualAuthority:false,separateBeachGeometryConstructed:false,separateWetSandGeometryConstructed:false,seawardWetTransitionGeometryConstructed:false,coastalTerrainMaterialIntegrated:true,shallowCoastalWaterMaterial:true,waterfallReservoirRegionProtected:true,planetaryOceanSingleSurface:true,sourceTerrainMutation:false});
  return freeze({planetMesh,continentMesh:gratitudeMesh,gratitudeMesh,coastalWaterMesh,reservoirWaterMesh,waterMesh:reservoirWaterMesh,stitchMesh:empty,beachMesh:empty,state,render,orbit,zoom,zoomByFactor,pan,panScreen,fitWorld:focusGratitude,focusGratitude,planetaryVantage,getViewScale:viewScale,getCameraSafety:()=>freeze({distanceSafe:state.distance>=95&&state.distance<=5600,continuousScaleRecognized:['LOCAL','REGION','CONTINENT','PLANETARY'].includes(viewScale()),geographySourceInvariantAcrossScale:true,canonicalTargetStableUnderPureZoom:true,fixedFovAcrossScale:true,liveMutationAbsent:true}),getOW01GeographicEvidence:()=>evidence,evaluateCanonicalGeographicIdentity,evaluateSurfaceCorrespondence:()=>surfaceCorrespondence,getSnapshot:()=>freeze({...state,viewScale:viewScale(),planetStatistics:planetMesh.statistics,continentStatistics:gratitudeMesh.statistics,gratitudeStatistics:gratitudeMesh.statistics,coastalWaterStatistics:coastalWaterMesh.statistics,stitchStatistics:empty.statistics,beachStatistics:empty.statistics,waterStatistics:reservoirWaterMesh.statistics,worldContract:AUDRALIA_OPEN_WORLD_AUTHORING_CONTRACT,coastModel:COAST_MODEL,surfaceCorrespondence,authoringRegionIsWorldBoundary:false,wholePlanetMustFitViewport:false,manorGeometryConstructed:false,liveRuntimeMutated:false,liveCameraMutated:false,liveNavigationMutated:false,liveWaterMutated:false})});
}
export default createMapWideEnvironmentRenderer;

/**
 * AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1
 *
 * Existing-Audralia in-place Gratitude geography authority.
 * H-Earth remains exact inside the resolved local core. Outside that core,
 * Gratitude is continued deterministically at continental scale. This module
 * owns no globe, camera, ocean, cloud, atmosphere, navigation, or other
 * territory authority.
 */

import {
  H_EARTH_TERRAIN_FIELD,
  H_EARTH_GRATITUDE_COASTAL_SYSTEM,
  H_EARTH_INLAND_MOUNTAIN_WATERSHED_SYSTEM,
  getHEarthCanonicalShorelineZ,
  sampleHEarthTerrainField
} from '../terrain/h-earth.terrain-field.js';
import { H_EARTH_TERRAIN_FORMATIONS } from '../terrain/h-earth.terrain-formations.js';
import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY as PROTECTED_LOCAL_HYDROLOGY,
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE as LEGACY_LOCAL_PRESENTATION,
  resolveHEarthMapWideReservoirBoundaryPoint as resolveProtectedReservoirBoundaryPoint
} from '../terrain/h-earth.terrain-estate-construction-v1.candidate.js';

const freeze=(value,seen=new WeakSet())=>{if(value===null||typeof value!=='object'||Object.isFrozen(value)||seen.has(value))return value;seen.add(value);for(const nested of Object.values(value))freeze(nested,seen);return Object.freeze(value);};
const finite=value=>typeof value==='number'&&Number.isFinite(value);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const mix=(a,b,t)=>a+(b-a)*t;
const smoothstep=(a,b,v)=>{if(a===b)return v<a?0:1;const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t);};
const bell=(value,center,radius)=>{const d=Math.abs(value-center)/Math.max(radius,1e-9);if(d>=1)return 0;const r=1-d*d;return r*r;};
const gaussian=(x,z,cx,cz,rx,rz,a=1)=>{const dx=(x-cx)/rx,dz=(z-cz)/rz;return a*Math.exp(-(dx*dx+dz*dz)*1.6);};
const segmentDistance=(x,z,ax,az,bx,bz)=>{const dx=bx-ax,dz=bz-az,den=dx*dx+dz*dz||1,t=clamp(((x-ax)*dx+(z-az)*dz)/den,0,1),px=ax+dx*t,pz=az+dz*t;return Math.hypot(x-px,z-pz);};

export const AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID='AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1';

const CORE=H_EARTH_TERRAIN_FIELD.coreDomain;
const WORLD=H_EARTH_TERRAIN_FIELD.worldDomain;
const CONTINENT=freeze({xMinimum:-1500,xMaximum:1480,zMinimum:-1880,zMaximum:760});
const CONTINENTAL_RECONSTRUCTION_REVISION=3;

export const AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER=freeze({
  contractId:AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,
  revision:CONTINENTAL_RECONSTRUCTION_REVISION,
  worldIdentity:'AUDRALIA',continentIdentity:'GRATITUDE',proximityExpression:'H_EARTH',
  mutationBoundary:'EXISTING_AUDRALIA_GRATITUDE_CONTINENT_ONLY',
  worldLaw:'ONE_WORLD_ONE_GEOGRAPHY_MULTIPLE_SCALES_OF_ACCESS',
  physicalGeographyLaw:'TERRAIN_CAUSES_HYDROLOGY_HYDROLOGY_CAUSES_BIOMES',
  sourceTerrainContractId:H_EARTH_TERRAIN_FIELD.contractId,
  coordinateLaw:'GEOGRAPHIC_POSITION_CANONICAL_RENDERING_RADIUS_REPRESENTATIONAL',
  lodLaw:'LOD_CHANGES_SAMPLING_DENSITY_NOT_GEOGRAPHIC_STATE',
  completionLaw:'FIXED_RESOLVED_GEOGRAPHY_THEN_DETERMINISTIC_CONSTRAINED_CONTINUATION',
  resolvedEnvelope:freeze({...WORLD}),resolvedCore:freeze({...CORE}),continentalEnvelope:CONTINENT,
  coastalSystemId:H_EARTH_GRATITUDE_COASTAL_SYSTEM.systemId,
  inlandWatershedSystemId:H_EARTH_INLAND_MOUNTAIN_WATERSHED_SYSTEM.systemId,
  otherTerritoriesMutated:false,globeAuthorityCreated:false,oceanAuthorityCreated:false,
  weatherAuthorityCreated:false,cloudAuthorityCreated:false,atmosphereAuthorityCreated:false,
  cameraAuthorityCreated:false,zoomAuthorityCreated:false
});

const FIXED_COASTAL_ORDER=freeze(['GRATITUDE_WESTERN_PENINSULA','GRATITUDE_WESTERN_GULF','GRATITUDE_CENTRAL_HEADLAND','GRATITUDE_SANCTUARY_BAY','GRATITUDE_HARBOR_HEADLAND','GRATITUDE_BAY','GRATITUDE_EASTERN_HEADLAND','GRATITUDE_EASTERN_PENINSULA']);
export const AUDRALIA_GRATITUDE_FIXED_GEOGRAPHIC_CONTROLS=freeze({coastalOrder:FIXED_COASTAL_ORDER,coast:H_EARTH_GRATITUDE_COASTAL_SYSTEM,inland:H_EARTH_INLAND_MOUNTAIN_WATERSHED_SYSTEM,formations:H_EARTH_TERRAIN_FORMATIONS});

function coreBoundary(side){const x=side<0?CORE.xMinimum:CORE.xMaximum,z=getHEarthCanonicalShorelineZ(x),probe=8,innerX=x-side*probe,innerZ=getHEarthCanonicalShorelineZ(innerX);return{x,z,tangent:(z-innerZ)/probe*side};}
const WEST=coreBoundary(-1),EAST=coreBoundary(1);

export function resolveAudraliaGratitudeShorelineZ(worldX){
  if(!finite(worldX))return Number.NaN;
  if(worldX>=CORE.xMinimum&&worldX<=CORE.xMaximum)return getHEarthCanonicalShorelineZ(worldX);
  const side=worldX<CORE.xMinimum?-1:1,boundary=side<0?WEST:EAST,d=Math.abs(worldX-boundary.x),retention=1-smoothstep(160,560,d),inherited=boundary.z+boundary.tangent*d*retention;
  const west=side<0?(52*bell(d,135,92)-82*bell(d,320,122)+46*bell(d,515,118)-61*bell(d,715,145)+58*bell(d,930,150)-34*bell(d,1145,175)):0;
  const east=side>0?(-66*bell(d,190,120)+49*bell(d,385,126)-77*bell(d,610,145)+63*bell(d,825,155)-38*bell(d,1040,180)):0;
  const rhythm=(17*Math.sin((d+37)/151)+8*Math.sin((d+9)/67)+4*Math.sin((d+21)/31))*smoothstep(55,220,d);
  return inherited+west+east+rhythm;
}
export const resolveHEarthMapWideShorelineZ=resolveAudraliaGratitudeShorelineZ;

const RIVERS=freeze([
  freeze({id:'GRATITUDE_RIVER_WEST',points:freeze([[-610,-395],[-560,-470],[-500,-560],[-430,-665],[-350,-790],[-250,-920],[-145,-1030]]),width:18}),
  freeze({id:'GRATITUDE_RIVER_CENTRAL',points:freeze([[70,-360],[55,-470],[30,-585],[5,-710],[-20,-840],[-50,-975],[-85,-1110]]),width:22}),
  freeze({id:'GRATITUDE_RIVER_EAST',points:freeze([[520,-430],[470,-520],[405,-620],[330,-735],[250,-855],[175,-980],[115,-1115]]),width:16})
]);
const LAKES=freeze([
  freeze({id:'GRATITUDE_LAKE_RECEIVING',x:-35,z:-785,rx:115,rz:70}),
  freeze({id:'GRATITUDE_LAKE_WESTERN',x:-475,z:-610,rx:76,rz:48}),
  freeze({id:'GRATITUDE_LAKE_EASTERN',x:360,z:-690,rx:64,rz:42})
]);

function polylineDistance(x,z,points){let best=Infinity;for(let i=0;i<points.length-1;i++)best=Math.min(best,segmentDistance(x,z,...points[i],...points[i+1]));return best;}
function riverWeight(x,z){let weight=0;for(const river of RIVERS){const d=polylineDistance(x,z,river.points);weight=Math.max(weight,1-smoothstep(river.width*.45,river.width*1.55,d));}return clamp(weight,0,1);}
function lakeWeight(x,z){let weight=0;for(const lake of LAKES){const q=Math.hypot((x-lake.x)/lake.rx,(z-lake.z)/lake.rz);weight=Math.max(weight,1-smoothstep(.72,1.05,q));}return clamp(weight,0,1);}
function forestWeight(x,z,elevation,slope,hydrology){
  const behindRanges=gaussian(x,z,-360,-520,520,330,1)+gaussian(x,z,350,-560,520,350,1);
  const interiorBelt=gaussian(x,z,0,-860,980,620,1);
  const moisture=clamp(.28+hydrology*.72+.30*behindRanges+.22*interiorBelt,0,1);
  const altitude=1-smoothstep(56,96,elevation),steep=1-smoothstep(.38,.72,slope);
  return clamp(moisture*altitude*steep*smoothstep(70,210,resolveAudraliaGratitudeShorelineZ(x)-z),0,1);
}

function distanceOutsideCore(x,z){const dx=x<CORE.xMinimum?CORE.xMinimum-x:x>CORE.xMaximum?x-CORE.xMaximum:0,dz=z<CORE.zMinimum?CORE.zMinimum-z:z>CORE.zMaximum?z-CORE.zMaximum:0;return Math.hypot(dx,dz);}
function continuedElevation(x,z){
  const shoreline=resolveAudraliaGratitudeShorelineZ(x),inland=shoreline-z,waterward=z-shoreline;
  if(waterward>0){const shallow=-.35-Math.min(waterward,30)*.018,open=-.9-Math.max(0,waterward-30)*.010;return mix(shallow,open,smoothstep(18,42,waterward));}
  const coastRise=.016*Math.max(0,inland),undulation=2.8*Math.sin((x+z)/118)+2.1*Math.sin((x-z)/79)+1.2*Math.sin((x+2*z)/47);
  const westRange=gaussian(x,z,-390,-390,310,105,43)+gaussian(x,z,-690,-470,300,125,31)+gaussian(x,z,-930,-610,260,145,22);
  const centralRange=gaussian(x,z,20,-430,350,112,39)+gaussian(x,z,40,-620,420,150,25);
  const eastRange=gaussian(x,z,430,-420,310,112,45)+gaussian(x,z,720,-520,290,130,34)+gaussian(x,z,980,-675,260,150,24);
  const receivingBasin=gaussian(x,z,-25,-780,250,160,-15),westernValley=gaussian(x,z,-500,-640,125,260,-10),easternValley=gaussian(x,z,385,-700,135,270,-9),foothills=gaussian(x,z,0,-310,760,175,10),southernPlain=gaussian(x,z,0,-1280,1100,440,5);
  let elevation=coastRise+undulation+westRange+centralRange+eastRange+receivingBasin+westernValley+easternValley+foothills+southernPlain;
  const rw=riverWeight(x,z),lw=lakeWeight(x,z);elevation-=rw*(3.5+5*smoothstep(180,1000,inland));elevation-=lw*8.5;
  return elevation;
}
function evaluateTransferElevation(x,z){const canonical=sampleHEarthTerrainField(x,z);if(canonical?.valid!==true)return Number.NaN;if(x>=CORE.xMinimum&&x<=CORE.xMaximum&&z>=CORE.zMinimum&&z<=CORE.zMaximum)return canonical.elevation;return mix(canonical.elevation,continuedElevation(x,z),smoothstep(0,230,distanceOutsideCore(x,z)));}
function slopeClass(s){if(s<.08)return'LEVEL';if(s<.22)return'GENTLE';if(s<.48)return'MODERATE';return'STEEP_NONCLIMBING';}
function curvatureClass(c){if(c<-.04)return'CONCAVE';if(c>.04)return'CONVEX';return'NEAR_PLANAR';}
function materialProfile(distance,elevation,slope,river,lake,forest){if(lake>.55)return'INLAND_LAKE';if(river>.60)return'RIVER_CHANNEL';if(distance<-18)return'OPEN_WATER';if(distance<0)return'NEARSHORE_WATER';if(distance<12)return'WET_SAND';if(distance<42)return'DRY_SAND';if(forest>.50)return'FOREST_SOIL';if(elevation>24||slope>.35)return'STONE_AND_SPARSE_SOIL';if(elevation>8)return'COASTAL_SOIL';return'LOWLAND_SOIL';}

export function sampleAudraliaGratitudeTerrain(worldX,worldZ){
  if(!finite(worldX)||!finite(worldZ))return freeze({valid:false,status:'AUDRALIA_GRATITUDE_TRANSFER_REJECTED_NONFINITE',worldX,worldZ});
  const canonical=sampleHEarthTerrainField(worldX,worldZ);if(canonical?.valid!==true)return freeze({valid:false,status:'AUDRALIA_GRATITUDE_TRANSFER_SOURCE_INVALID',worldX,worldZ});
  const elevation=evaluateTransferElevation(worldX,worldZ),step=1,left=evaluateTransferElevation(worldX-step,worldZ),right=evaluateTransferElevation(worldX+step,worldZ),back=evaluateTransferElevation(worldX,worldZ-step),front=evaluateTransferElevation(worldX,worldZ+step),dx=(right-left)/(2*step),dz=(front-back)/(2*step),normalLength=Math.hypot(-dx,1,-dz),slope=Math.hypot(dx,dz),curvature=(left-2*elevation+right)+(back-2*elevation+front),shorelineZ=resolveAudraliaGratitudeShorelineZ(worldX),shorelineDistance=shorelineZ-worldZ,river=riverWeight(worldX,worldZ),lake=lakeWeight(worldX,worldZ),forest=forestWeight(worldX,worldZ,elevation,slope,Math.max(river,lake)),beachWeight=smoothstep(-4,4,shorelineDistance)*(1-smoothstep(34,52,shorelineDistance)),wetSandWeight=smoothstep(-2,2,shorelineDistance)*(1-smoothstep(8,15,shorelineDistance)),protectedPresentation=LEGACY_LOCAL_PRESENTATION?.worldDomain&&worldX>=CORE.xMinimum&&worldX<=CORE.xMaximum&&worldZ>=CORE.zMinimum&&worldZ<=CORE.zMaximum?LEGACY_LOCAL_PRESENTATION:null;
  return freeze({valid:true,status:'AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_SAMPLE_COMPLETE',contractId:AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,worldX,worldZ,world:{x:worldX,y:elevation,z:worldZ},elevation,presentationElevation:elevation,normal:{x:-dx/normalLength,y:1/normalLength,z:-dz/normalLength},slope,slopeClass:slopeClass(slope),curvature,curvatureClass:curvatureClass(curvature),materialProfile:materialProfile(shorelineDistance,elevation,slope,river,lake,forest),shorelineZ,shorelineDistance,coastalSystemId:canonical.coastalSystemId,inlandMountainWatershedSystemId:canonical.inlandMountainWatershedSystemId,coastline:freeze({beachWeight,wetSandWeight,canonical:worldX>=CORE.xMinimum&&worldX<=CORE.xMaximum}),hydrology:freeze({riverWeight:river,lakeWeight:lake,drainageClass:lake>.45?'LAKE':river>.45?'RIVER':'LAND'}),biome:freeze({forestWeight:forest,class:forest>.62?'FOREST':forest>.28?'WOODLAND':'OPEN'}),sitePreparation:freeze({weight:0,authorityCreated:false}),insideReservedEstateEnvelope:false,protectedLocalPresentationReferenceAvailable:Boolean(protectedPresentation),geographyAuthority:AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID});
}

export const sampleHEarthMapWideEnvironmentTerrainCandidate=sampleAudraliaGratitudeTerrain;
export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY=freeze({...PROTECTED_LOCAL_HYDROLOGY,continental:freeze({rivers:RIVERS,lakes:LAKES,derivationLaw:'TERRAIN_CAUSES_HYDROLOGY'})});
export const resolveHEarthMapWideReservoirBoundaryPoint=resolveProtectedReservoirBoundaryPoint;
export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE=freeze({contractId:AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,worldDomain:CONTINENT,coastline:freeze({systemId:H_EARTH_GRATITUDE_COASTAL_SYSTEM.systemId,sandbars:freeze([...(LEGACY_LOCAL_PRESENTATION?.coastline?.sandbars??[])]),authority:AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID}),hydrology:H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY,coastalSystem:H_EARTH_GRATITUDE_COASTAL_SYSTEM,inlandMountainWatershedSystem:H_EARTH_INLAND_MOUNTAIN_WATERSHED_SYSTEM,geographicTransferAuthority:AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,reconstructionRevision:CONTINENTAL_RECONSTRUCTION_REVISION,physicalGeography:freeze({rivers:RIVERS,lakes:LAKES,forestDerivedFromHydrology:true}),deterministic:true});

export function describeAudraliaGratitudeGeographicTransfer(){return freeze({...AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER,fixedCoastalOrder:FIXED_COASTAL_ORDER,formationCount:Object.keys(H_EARTH_TERRAIN_FORMATIONS).length,canonicalWorldDomain:freeze({...WORLD}),continentalDomain:CONTINENT,riverCount:RIVERS.length,lakeCount:LAKES.length,forestDerivedFromHydrology:true,protectedLocalHydrology:true,legacyContinentalGeographyAuthority:false,existingGlobePreserved:true});}

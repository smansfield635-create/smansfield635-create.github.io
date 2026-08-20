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
const gaussian=(x,z,cx,cz,rx,rz,a)=>{const dx=(x-cx)/rx,dz=(z-cz)/rz;return a*Math.exp(-(dx*dx+dz*dz)*1.6);};

export const AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID='AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1';

const CORE=H_EARTH_TERRAIN_FIELD.coreDomain;
const WORLD=H_EARTH_TERRAIN_FIELD.worldDomain;
const CONTINENTAL_RECONSTRUCTION_REVISION=2;

export const AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER=freeze({
  contractId:AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,
  revision:CONTINENTAL_RECONSTRUCTION_REVISION,
  worldIdentity:'AUDRALIA',
  continentIdentity:'GRATITUDE',
  proximityExpression:'H_EARTH',
  mutationBoundary:'EXISTING_AUDRALIA_GRATITUDE_CONTINENT_ONLY',
  worldLaw:'ONE_WORLD_ONE_GEOGRAPHY_MULTIPLE_SCALES_OF_ACCESS',
  sourceTerrainContractId:H_EARTH_TERRAIN_FIELD.contractId,
  sourceFormationContractId:'H_EARTH_TERRAIN_FORMATIONS_RUN_6B_v2_LATTICE_SEMANTIC_ALIGNMENT',
  coordinateLaw:'GEOGRAPHIC_POSITION_CANONICAL_RENDERING_RADIUS_REPRESENTATIONAL',
  lodLaw:'LOD_CHANGES_SAMPLING_DENSITY_NOT_GEOGRAPHIC_STATE',
  completionLaw:'FIXED_RESOLVED_GEOGRAPHY_THEN_DETERMINISTIC_CONSTRAINED_CONTINUATION',
  resolvedEnvelope:freeze({...WORLD}),
  resolvedCore:freeze({...CORE}),
  coastalSystemId:H_EARTH_GRATITUDE_COASTAL_SYSTEM.systemId,
  inlandWatershedSystemId:H_EARTH_INLAND_MOUNTAIN_WATERSHED_SYSTEM.systemId,
  otherContinentsCanonical:false,
  otherTerritoriesMutated:false,
  globeAuthorityCreated:false,
  oceanAuthorityCreated:false,
  weatherAuthorityCreated:false,
  cloudAuthorityCreated:false,
  atmosphereAuthorityCreated:false,
  cameraAuthorityCreated:false,
  zoomAuthorityCreated:false
});

const FIXED_COASTAL_ORDER=freeze([
  'GRATITUDE_WESTERN_PENINSULA','GRATITUDE_WESTERN_GULF','GRATITUDE_CENTRAL_HEADLAND',
  'GRATITUDE_SANCTUARY_BAY','GRATITUDE_HARBOR_HEADLAND','GRATITUDE_BAY',
  'GRATITUDE_EASTERN_HEADLAND','GRATITUDE_EASTERN_PENINSULA'
]);

export const AUDRALIA_GRATITUDE_FIXED_GEOGRAPHIC_CONTROLS=freeze({
  coastalOrder:FIXED_COASTAL_ORDER,
  coast:H_EARTH_GRATITUDE_COASTAL_SYSTEM,
  inland:H_EARTH_INLAND_MOUNTAIN_WATERSHED_SYSTEM,
  formations:H_EARTH_TERRAIN_FORMATIONS
});

function coreBoundary(side){
  const x=side<0?CORE.xMinimum:CORE.xMaximum;
  const z=getHEarthCanonicalShorelineZ(x);
  const probe=8;
  const innerX=x-side*probe;
  const innerZ=getHEarthCanonicalShorelineZ(innerX);
  return {x,z,tangent:(z-innerZ)/probe*side};
}

const WEST=coreBoundary(-1),EAST=coreBoundary(1);

/**
 * Keep the developed H-Earth coastline byte-for-byte in geographic meaning
 * across the resolved local core. Outside it, continue the same coastal
 * direction into large asymmetric continental structures rather than reverting
 * to a generic rounded continental edge.
 */
export function resolveAudraliaGratitudeShorelineZ(worldX){
  if(!finite(worldX))return Number.NaN;
  if(worldX>=CORE.xMinimum&&worldX<=CORE.xMaximum)return getHEarthCanonicalShorelineZ(worldX);
  const side=worldX<CORE.xMinimum?-1:1;
  const boundary=side<0?WEST:EAST;
  const d=Math.abs(worldX-boundary.x);
  const tangentRetention=1-smoothstep(170,620,d);
  const inherited=boundary.z+boundary.tangent*d*tangentRetention;

  // These are unnamed continuation forms, not new canonical territories.
  // They enlarge the morphology already established by the resolved coast.
  const westernPeninsula=side<0?38*bell(d,150,105):0;
  const westernGulf=side<0?-54*bell(d,345,150):0;
  const westernHeadland=side<0?31*bell(d,610,175):0;
  const easternBay=side>0?-48*bell(d,230,155):0;
  const easternHeadland=side>0?34*bell(d,470,170):0;
  const easternPeninsula=side>0?44*bell(d,720,190):0;
  const broadRhythm=18*Math.sin((d+43)/190)+9*Math.sin((d+11)/83);
  const envelope=smoothstep(70,250,d);
  return inherited+westernPeninsula+westernGulf+westernHeadland+easternBay+easternHeadland+easternPeninsula+broadRhythm*envelope;
}

export const resolveHEarthMapWideShorelineZ=resolveAudraliaGratitudeShorelineZ;

function distanceOutsideCore(x,z){
  const dx=x<CORE.xMinimum?CORE.xMinimum-x:x>CORE.xMaximum?x-CORE.xMaximum:0;
  const dz=z<CORE.zMinimum?CORE.zMinimum-z:z>CORE.zMaximum?z-CORE.zMaximum:0;
  return Math.hypot(dx,dz);
}

function continuedElevation(x,z){
  const shoreline=resolveAudraliaGratitudeShorelineZ(x);
  const inland=shoreline-z;
  const waterward=z-shoreline;
  if(waterward>0){
    const shallow=-0.35-Math.min(waterward,30)*0.018;
    const open=-0.9-Math.max(0,waterward-30)*0.010;
    return mix(shallow,open,smoothstep(18,42,waterward));
  }

  const coastRise=0.018*Math.max(0,inland);
  const continentalUndulation=2.6*Math.sin((x+z)/115)+1.7*Math.sin((x-z)/73);

  // Continue the established Gratitude range outward from the known ridge
  // sequence. The local canonical ridges remain untouched inside CORE.
  const ridgeWest1=gaussian(x,z,-330,-285,145,72,34);
  const ridgeWest2=gaussian(x,z,-545,-330,180,84,29);
  const ridgeWestShoulder=gaussian(x,z,-760,-360,215,98,22);
  const ridgeEast1=gaussian(x,z,330,-300,145,74,39);
  const ridgeEast2=gaussian(x,z,540,-350,185,88,34);
  const ridgeEastShoulder=gaussian(x,z,760,-395,220,110,25);
  const centralBackbone=gaussian(x,z,65,-330,250,92,30);
  const basin=gaussian(x,z,10,-250,150,82,-10);
  const westValley=gaussian(x,z,-410,-255,95,125,-8);
  const eastValley=gaussian(x,z,420,-275,105,130,-7);
  const foothill=gaussian(x,z,-40,-205,420,120,8);

  return coastRise+continentalUndulation+
    ridgeWest1+ridgeWest2+ridgeWestShoulder+
    ridgeEast1+ridgeEast2+ridgeEastShoulder+
    centralBackbone+basin+westValley+eastValley+foothill;
}

function evaluateTransferElevation(x,z){
  const canonical=sampleHEarthTerrainField(x,z);
  if(canonical?.valid!==true)return Number.NaN;
  if(x>=CORE.xMinimum&&x<=CORE.xMaximum&&z>=CORE.zMinimum&&z<=CORE.zMaximum)return canonical.elevation;
  const d=distanceOutsideCore(x,z);
  const weight=smoothstep(0,260,d);
  return mix(canonical.elevation,continuedElevation(x,z),weight);
}

function slopeClass(s){if(s<0.08)return'LEVEL';if(s<0.22)return'GENTLE';if(s<0.48)return'MODERATE';return'STEEP_NONCLIMBING';}
function curvatureClass(c){if(c<-0.04)return'CONCAVE';if(c>0.04)return'CONVEX';return'NEAR_PLANAR';}
function materialProfile(distance,elevation,slope){if(distance<-18)return'OPEN_WATER';if(distance<0)return'NEARSHORE_WATER';if(distance<12)return'WET_SAND';if(distance<42)return'DRY_SAND';if(elevation>24||slope>0.35)return'STONE_AND_SPARSE_SOIL';if(elevation>8)return'COASTAL_SOIL';return'LOWLAND_SOIL';}

export function sampleAudraliaGratitudeTerrain(worldX,worldZ){
  if(!finite(worldX)||!finite(worldZ))return freeze({valid:false,status:'AUDRALIA_GRATITUDE_TRANSFER_REJECTED_NONFINITE',worldX,worldZ});
  const canonical=sampleHEarthTerrainField(worldX,worldZ);
  if(canonical?.valid!==true)return freeze({valid:false,status:'AUDRALIA_GRATITUDE_TRANSFER_SOURCE_INVALID',worldX,worldZ});

  const elevation=evaluateTransferElevation(worldX,worldZ);
  const step=1;
  const left=evaluateTransferElevation(worldX-step,worldZ),right=evaluateTransferElevation(worldX+step,worldZ);
  const back=evaluateTransferElevation(worldX,worldZ-step),front=evaluateTransferElevation(worldX,worldZ+step);
  const dx=(right-left)/(2*step),dz=(front-back)/(2*step),normalLength=Math.hypot(-dx,1,-dz);
  const slope=Math.hypot(dx,dz),curvature=(left-2*elevation+right)+(back-2*elevation+front);
  const shorelineZ=resolveAudraliaGratitudeShorelineZ(worldX),shorelineDistance=shorelineZ-worldZ;
  const beachWeight=smoothstep(-4,4,shorelineDistance)*(1-smoothstep(34,52,shorelineDistance));
  const wetSandWeight=smoothstep(-2,2,shorelineDistance)*(1-smoothstep(8,15,shorelineDistance));
  const protectedPresentation=LEGACY_LOCAL_PRESENTATION?.worldDomain&&worldX>=CORE.xMinimum&&worldX<=CORE.xMaximum&&worldZ>=CORE.zMinimum&&worldZ<=CORE.zMaximum?LEGACY_LOCAL_PRESENTATION:null;

  return freeze({
    valid:true,
    status:'AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_SAMPLE_COMPLETE',
    contractId:AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,
    worldX,worldZ,
    world:{x:worldX,y:elevation,z:worldZ},
    elevation,presentationElevation:elevation,
    normal:{x:-dx/normalLength,y:1/normalLength,z:-dz/normalLength},
    slope,slopeClass:slopeClass(slope),curvature,curvatureClass:curvatureClass(curvature),
    materialProfile:materialProfile(shorelineDistance,elevation,slope),
    shorelineZ,shorelineDistance,
    coastalSystemId:canonical.coastalSystemId,
    inlandMountainWatershedSystemId:canonical.inlandMountainWatershedSystemId,
    coastline:freeze({beachWeight,wetSandWeight,canonical:worldX>=CORE.xMinimum&&worldX<=CORE.xMaximum}),
    sitePreparation:freeze({weight:0,authorityCreated:false}),
    insideReservedEstateEnvelope:false,
    protectedLocalPresentationReferenceAvailable:Boolean(protectedPresentation),
    geographyAuthority:AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID
  });
}

export const sampleHEarthMapWideEnvironmentTerrainCandidate=sampleAudraliaGratitudeTerrain;
export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY=PROTECTED_LOCAL_HYDROLOGY;
export const resolveHEarthMapWideReservoirBoundaryPoint=resolveProtectedReservoirBoundaryPoint;

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE=freeze({
  contractId:AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,
  worldDomain:freeze({...WORLD}),
  coastline:freeze({
    systemId:H_EARTH_GRATITUDE_COASTAL_SYSTEM.systemId,
    sandbars:freeze([...(LEGACY_LOCAL_PRESENTATION?.coastline?.sandbars??[])]),
    authority:AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID
  }),
  hydrology:PROTECTED_LOCAL_HYDROLOGY,
  coastalSystem:H_EARTH_GRATITUDE_COASTAL_SYSTEM,
  inlandMountainWatershedSystem:H_EARTH_INLAND_MOUNTAIN_WATERSHED_SYSTEM,
  geographicTransferAuthority:AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,
  reconstructionRevision:CONTINENTAL_RECONSTRUCTION_REVISION,
  deterministic:true
});

export function describeAudraliaGratitudeGeographicTransfer(){return freeze({
  ...AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER,
  fixedCoastalOrder:FIXED_COASTAL_ORDER,
  formationCount:Object.keys(H_EARTH_TERRAIN_FORMATIONS).length,
  canonicalWorldDomain:freeze({...WORLD}),
  protectedLocalHydrology:true,
  legacyContinentalGeographyAuthority:false,
  existingGlobePreserved:true
});}

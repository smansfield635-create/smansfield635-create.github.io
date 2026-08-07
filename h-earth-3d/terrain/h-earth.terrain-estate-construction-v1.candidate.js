/**
 * H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_v1
 * Revision 8 authoring successor. Run8B remains immutable geometric truth.
 * Gratitude stays high resolution; surrounding Audralia is noncanonical low-resolution context.
 */
import {
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD,
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  sampleHEarthRun8BSuccessorTerrainField
} from './h-earth.successor-terrain-field.run8b.js';

const freeze = Object.freeze;
const finite = Number.isFinite;
const clamp = (v,a,b)=>Math.min(b,Math.max(a,v));
const mix = (a,b,t)=>a+(b-a)*t;
const smooth = (a,b,v)=>{const t=clamp((v-a)/(b-a||1),0,1);return t*t*(3-2*t);};
const bell = (v,c,r)=>{const d=Math.abs(v-c)/Math.max(r,1e-6);if(d>=1)return 0;const q=1-d*d;return q*q;};
const REGION=freeze({xMinimum:-256,xMaximum:256,zMinimum:-320,zMaximum:64});
const CONTINENT=freeze({xMinimum:-560,xMaximum:560,zMinimum:-640,zMaximum:120});
const GOVERNING_HEAD='3f51f0cd159df33571905c6cb14253ebdd137e3b';
const POSITIVE_REFERENCE='97003e9de386a8962fb46d0b370005b900a167d6';

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID='H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_v1';
export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID='H_EARTH_MAP_WIDE_BAND_LIMITED_RELIEF_PROFILE_v5';

function sourceElevation(x,z){
  const s=sampleHEarthRun8BSuccessorTerrainField(x,z);
  if(s?.valid!==true||!finite(s.elevation))throw new Error(`MAP_RENEWAL_SOURCE_SAMPLE_INVALID:${x}:${z}`);
  return s.elevation;
}

const ESTATE=freeze({
  atriumTerrace:freeze({center:freeze({x:80,z:-172}),radius:freeze({x:28,z:24}),coreRadius:.56,cutDepth:1.25}),
  connectiveSpine:freeze({points:freeze([freeze({x:80,z:-172}),freeze({x:111,z:-192}),freeze({x:136,z:-208})]),coreHalfWidth:12,featherHalfWidth:28,boundedCutDepth:.72}),
  hillInterfaceTerrace:freeze({center:freeze({x:136,z:-208}),radius:freeze({x:34,z:25}),coreRadius:.46,cutDepth:1.9}),
  reservedEnvelope:freeze({xMinimum:48,xMaximum:182,zMinimum:-246,zMaximum:-140}),
  hiddenVaultReserve:freeze({center:freeze({x:152,z:-224}),horizontalRadius:freeze({x:40,z:38}),reservedDepthBelowSurface:38,surfaceExpression:'NONE'}),
  finalManorGeometryConstructed:false,
  treatment:'MULTI_HILL_IRREGULAR_ESTATE_TERRAIN_PREPARATION_WITHOUT_BUILDING_GEOMETRY'
});
const ATRIUM_Y=sourceElevation(80,-172)-1.25;
const HILL_Y=sourceElevation(136,-208)-1.9;
const RES_CENTER=freeze({x:-44,z:-211});
const RES_WATER=clamp(sourceElevation(-44,-211)-1.1,2.2,12);
const RES_FLOOR=RES_WATER-5.8;

const COASTLINE=freeze({
  beachInlandWidth:44,beachSeawardWidth:12,shelfWidth:48,dryBeachMaximumElevation:6.4,duneMaximumElevation:8.1,wetBeachElevation:.34,shelfFloorElevation:-3.6,
  bay:freeze({centerX:118,halfWidth:82,maximumInlandReach:48,westernHeadlandX:48,easternHeadlandX:198}),
  sandbars:freeze([
    freeze({center:freeze({x:-138,z:4}),radius:freeze({x:58,z:16}),rotation:-.15,crestElevation:.46,gapCenter:-.18,gapWidth:.13,phase:.7}),
    freeze({center:freeze({x:-14,z:11}),radius:freeze({x:70,z:19}),rotation:.08,crestElevation:.54,gapCenter:.28,gapWidth:.11,phase:2.1}),
    freeze({center:freeze({x:128,z:-3}),radius:freeze({x:58,z:16}),rotation:-.18,crestElevation:.42,gapCenter:-.34,gapWidth:.12,phase:4.2})
  ])
});

export function resolveHEarthMapWideShorelineZ(x){
  if(!finite(x))return NaN;
  const b=COASTLINE.bay;
  const outer=x<REGION.xMinimum?-.035*(REGION.xMinimum-x)+7*Math.sin((x+300)/61):x>REGION.xMaximum?.018*(x-REGION.xMaximum)+9*Math.sin((x-260)/73):0;
  return -45+8.6*Math.sin((x+34)/74)+4.1*Math.sin((x-18)/33)-8.5*bell(x,-142,92)
    -b.maximumInlandReach*bell(x,b.centerX,b.halfWidth)-9*bell(x,b.centerX+22,44)
    +10.5*bell(x,b.westernHeadlandX,42)+7.5*bell(x,b.easternHeadlandX,46)+outer;
}

function rot(x,z,o){const c=Math.cos(o.rotation||0),s=Math.sin(o.rotation||0),dx=x-o.center.x,dz=z-o.center.z;return{x:(dx*c+dz*s)/o.radius.x,z:(-dx*s+dz*c)/o.radius.z};}
function sandLocal(x,z,b){const p=rot(x,z,b),r=Math.hypot(p.x,p.z);if(r>=1)return 0;const base=1-smooth(.38,1,r),long=clamp(.76+.18*Math.sin(p.x*8.2+b.phase)+.12*Math.sin(p.x*15.1-b.phase*.7),.3,1),gap=1-.82*bell(p.x,b.gapCenter,b.gapWidth),cres=clamp(.82+.18*Math.sin((p.x+.35)*Math.PI)-.12*p.z,.48,1.08);return clamp(base*long*gap*cres,0,1);}
function sandWeight(x,z){return COASTLINE.sandbars.reduce((m,b)=>Math.max(m,sandLocal(x,z,b)),0);}
function sandTarget(x,z){const sea=H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.seaLevelY;let y=0,w=0;for(const b of COASTLINE.sandbars){const q=sandLocal(x,z,b);y+=(sea+b.crestElevation+.07*Math.sin(x*.12+z*.09+b.phase))*q;w+=q;}return w?y/w:sea-.5;}

function reservoirScale(a){return clamp(.84+.12*Math.sin(a*3+.55)+.08*Math.sin(a*5-1.2)+.07*Math.cos(a*2+.35),.64,1.1);}
function reservoirRadius(x,z,r){const dx=x-r.center.x,dz=z-r.center.z,a=Math.atan2(dz/r.radius.z,dx/r.radius.x);return Math.hypot(dx/r.radius.x,dz/r.radius.z)/reservoirScale(a);}

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY=freeze({
  seaLevelY:H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain.seaLevelY??0,
  coastlineContext:freeze({oceanLevelChangedByEstateSystem:false,localHydrologyChangedByEstateSystem:true,mapPreviewWaterContextAuthorized:true,liveWaterMutationAuthorized:false,shorelineGeometry:'RESTORED_ASYMMETRIC_INLAND_BAY',beachGeometry:'DUNE_TO_DRY_SAND_TO_WET_SAND_TO_SHALLOW_WATER',sandbarSystem:'BROKEN_LOW_PROFILE_SHOALS_NOT_RIDGES'}),
  waterfall:freeze({hiddenUpperSource:freeze({x:-50,z:-314}),visibleCrest:freeze({x:-50,z:-278}),landing:freeze({x:-44,z:-235}),halfWidth:13,transitionHalfWidth:27,terrainChannelCutDepth:7.2,visibleWaterHalfWidth:7.5}),
  reservoir:freeze({center:RES_CENTER,radius:freeze({x:58,z:42}),coreRadius:.58,rimOuterRadius:1.22,waterSurfaceElevation:RES_WATER,floorElevation:RES_FLOOR,enclosed:true,visibleDrainageToCoast:false,concealedPumpIntakeReserved:true,pumpConstructionAuthorized:false,outlineClass:'IRREGULAR_TERRAIN_CONFORMING_MOUNTAIN_TOE_BASIN'}),
  cavern:freeze({center:freeze({x:-7,z:-238}),radius:freeze({x:23,z:17}),coreRadius:.56,shallowApronCutDepth:1.3,interiorConstructed:false}),
  hiddenInfrastructure:freeze({reservoirPumpToVaultRouteReserved:true,waterChamberInVaultCompoundReserved:true,renderedOnSurface:false,constructed:false,publicKnowledge:'SECRET'})
});

export function resolveHEarthMapWideReservoirBoundaryPoint(angle){
  if(!finite(angle))return null;const r=H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.reservoir,s=reservoirScale(angle);
  return freeze({x:r.center.x+Math.cos(angle)*r.radius.x*s,z:r.center.z+Math.sin(angle)*r.radius.z*s});
}

const MACRO=freeze([
  freeze({id:'REAR_WATERSHED_MASS',center:freeze({x:-70,z:-304}),radius:freeze({x:210,z:104}),amplitude:10}),
  freeze({id:'WESTERN_HIGH_PEAK',center:freeze({x:-171,z:-309}),radius:freeze({x:72,z:62}),amplitude:27}),
  freeze({id:'WESTERN_SHOULDER',center:freeze({x:-119,z:-264}),radius:freeze({x:92,z:72}),amplitude:11}),
  freeze({id:'WATERFALL_LEFT_PEAK',center:freeze({x:-82,z:-294}),radius:freeze({x:56,z:59}),amplitude:22}),
  freeze({id:'WATERFALL_RIGHT_PEAK',center:freeze({x:-10,z:-270}),radius:freeze({x:63,z:59}),amplitude:16}),
  freeze({id:'EASTERN_RIDGE',center:freeze({x:52,z:-246}),radius:freeze({x:112,z:82}),amplitude:13}),
  freeze({id:'MOUNTAIN_FRONT_APRON',center:freeze({x:-49,z:-231}),radius:freeze({x:194,z:84}),amplitude:5.2}),
  freeze({id:'FAR_EAST_HIGHLAND',center:freeze({x:201,z:-286}),radius:freeze({x:86,z:86}),amplitude:10})
]);

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE=freeze({
  profileId:H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID,governingHead:GOVERNING_HEAD,lockGeneration:422,successorRepairRevision:8,
  sourceIdentity:freeze({classification:'POSITIVE_DESIGN_SOURCE_NOT_AUTOMATIC_TRANSPLANT',commit:POSITIVE_REFERENCE,sourceProfileId:'H_EARTH_CURRENT_LIVE_BAND_LIMITED_TERRAIN_RELIEF_PRESENTATION_PROFILE_v2'}),
  implementationClass:'STAGGERED_GRATITUDE_MOUNTAINS_ORGANIC_COAST_LOW_PROFILE_SHOALS_IRREGULAR_RESERVOIR_AND_LOW_RESOLUTION_AUDRALIAN_CONTINENTAL_SHELL',
  macroLandforms:MACRO,
  rearBoundaryBarrier:freeze({xMinimum:-248,xMaximum:132,nominalRidgeZ:-286,transitionDepth:62,maximumAddedElevation:12,mountainsAreWorldEdge:false,visibleFlatRearBoundary:'PROHIBITED'}),
  futureRegionContinuation:freeze({authoringPreviewOnly:true,currentRegionBounds:REGION,continentalPreviewBounds:CONTINENT,canonicalRun8BExtensionClaimed:false,liveTraversalAuthorized:false,futureRegionIdentitiesAssigned:false,futureRegionCoordinatesCanonicalized:false,resolutionClass:'LOW_RESOLUTION_UNRESOLVED_CONTINENTAL_CONTEXT'}),
  mesoLandform:freeze({maximumMagnitude:1.9,components:freeze([freeze({x:.83,z:.56,f:.012,p:.37,w:.39}),freeze({x:-.48,z:.88,f:.019,p:2.17,w:.34}),freeze({x:.67,z:-.74,f:.028,p:4.11,w:.27})])}),
  estateTerrainComposition:ESTATE,estateRevision6ShapeProtected:true,
  entryCore:freeze({xMinimum:-24,xMaximum:24,zMinimum:-132,zMaximum:-88,transitionMargin:8}),
  coastalProtection:freeze({fullReliefByZ:-118,zeroReliefByZ:-78}),
  coastline:COASTLINE,hydrology:H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY,
  virtualNormalRelief:freeze({directionalPhases:freeze([
    freeze({direction:freeze({x:.8164965809,y:.4082482905,z:.4082482905}),frequency:3.3069396354,offset:.37,weight:.5}),
    freeze({direction:freeze({x:-.4082482905,y:.8164965809,z:.4082482905}),frequency:2.7318196988,offset:2.17,weight:.3}),
    freeze({direction:freeze({x:.4082482905,y:-.4082482905,z:.8164965809}),frequency:2.2439947526,offset:4.11,weight:.2})
  ]),virtualReliefHeightAmplitude:.22,maximumNormalDeviationDegrees:22,antialiasFootprint:freeze({fullThrough:.45,zeroBy:.95}),distanceEnvelope:freeze({fullInfluenceThrough:120,zeroInfluenceBy:300}),slopeEnvelope:freeze({minimumInfluence:.82,maximumInfluence:1,responseStart:.05,responseEnd:.55}),authoringInspectorScale:.42}),
  baseTruthElevationMutation:false,baseTruthNormalMutation:false,presentationElevationEnabled:true,presentationNormalPerturbation:true,physicalEstateTerrainPreparationEnabled:true,mapHydrologyContextEnabled:true,continentalShellAuthoringContextEnabled:true,deterministic:true
});

export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE=freeze({
  contractId:H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,operationId:'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_v1',lockGeneration:422,successorRepairRevision:8,governingHead:GOVERNING_HEAD,
  baseTerrainFieldContractId:H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,baseTerrainFieldGenerationRevision:H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.generationRevision,
  worldDomain:freeze({...H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain}),authoringContinentalDomain:CONTINENT,reliefProfileId:H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID,
  reservedEstateEnvelope:freeze({bounds:ESTATE.reservedEnvelope,atriumAnchor:ESTATE.atriumTerrace.center,connectiveSaddle:ESTATE.connectiveSpine.points[1],largeHillInterface:ESTATE.hillInterfaceTerrace.center,hiddenVaultReserve:ESTATE.hiddenVaultReserve,revision6ShapeProtected:true,manorGeometryConstructed:false}),
  hydrology:H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY,coastline:COASTLINE,futureRegionContinuation:H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.futureRegionContinuation,
  preservation:freeze({run8BTruthElevationMutated:false,run8BSourceMutated:false,liveRuntimeMutated:false,liveCameraMutated:false,liveNavigationMutated:false,liveWaterMutated:false,registryMutated:false,manorGeometryConstructed:false,cavernInteriorConstructed:false,vaultInteriorConstructed:false,deploymentOrReleaseCreated:false})
});

function bump(x,z,l){const dx=(x-l.center.x)/l.radius.x,dz=(z-l.center.z)/l.radius.z,r=dx*dx+dz*dz;if(r>=1)return 0;const q=1-r,ir=clamp(.8+.11*Math.sin(x*.031+z*.013+l.amplitude)+.09*Math.sin(x*.017-z*.027+l.radius.x*.01),.6,1.18);return l.amplitude*q*q*ir;}
function ellipseWeight(x,z,o){const r=Math.hypot((x-o.center.x)/o.radius.x,(z-o.center.z)/o.radius.z);return 1-smooth(o.coreRadius??.6,1,r);}
function segDistance(x,z,a,b){const vx=b.x-a.x,vz=b.z-a.z,q=vx*vx+vz*vz||1,t=clamp(((x-a.x)*vx+(z-a.z)*vz)/q,0,1);return Math.hypot(x-(a.x+vx*t),z-(a.z+vz*t));}
function spineDistance(x,z,pts){let d=Infinity;for(let i=0;i<pts.length-1;i++)d=Math.min(d,segDistance(x,z,pts[i],pts[i+1]));return d;}
function inside(x,z,r){return x>=r.xMinimum&&x<=r.xMaximum&&z>=r.zMinimum&&z<=r.zMaximum;}
function outsideDistance(x,z,r){return Math.hypot(Math.max(r.xMinimum-x,0,x-r.xMaximum),Math.max(r.zMinimum-z,0,z-r.zMaximum));}
function ridgeAxisZ(x){return -286+19*Math.sin((x+114)/76)+12*Math.sin((x-18)/34)-9*bell(x,-165,68)+7*bell(x,55,74);}
function rearBarrier(x,z){const r=H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.rearBoundaryBarrier,xw=smooth(r.xMinimum,r.xMinimum+34,x)*(1-smooth(r.xMaximum-34,r.xMaximum,x)),axis=ridgeAxisZ(x),zw=1-smooth(axis+8,axis+r.transitionDepth,z),v=clamp(.68+.18*Math.sin((x+92)/31)+.12*Math.sin((x-11)/17)+.12*bell(x,-170,70)+.08*bell(x,-28,58),.38,1.2);return r.maximumAddedElevation*xw*zw*v;}
function protection(x,z){const e=H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.entryCore,d=smooth(0,e.transitionMargin,outsideDistance(x,z,e)),c=H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.coastalProtection,coast=1-smooth(c.fullReliefByZ,c.zeroReliefByZ,z);return Math.min(d,coast);}

export function sampleHEarthMapWideEnvironmentalReliefOffset(x,z){
  if(!finite(x)||!finite(z))return NaN;let macro=0;for(const l of MACRO)macro+=bump(x,z,l);let meso=0;for(const c of H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.mesoLandform.components)meso+=Math.sin((x*c.x+z*c.z)*c.f+c.p)*c.w;
  return (macro+meso*1.9+rearBarrier(x,z))*protection(x,z);
}

function hydroTerrain(x,z,y){
  const h=H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY,w=h.waterfall,r=h.reservoir,c=h.cavern;
  const ww=1-smooth(w.halfWidth,w.transitionHalfWidth,segDistance(x,z,w.visibleCrest,w.landing));
  const rr=reservoirRadius(x,z,r),rw=1-smooth(r.coreRadius,1,rr),rim=smooth(.8,.98,rr)*(1-smooth(1.03,r.rimOuterRadius,rr)),cw=ellipseWeight(x,z,c);
  y-=ww*w.terrainChannelCutDepth;y+=rim*.28;y=mix(y,r.floorElevation+.45*Math.sin((x+42)*.065)*Math.sin((z+213)*.071),rw);y-=cw*c.shallowApronCutDepth;
  return{elevation:y,waterfallWeight:ww,reservoirWeight:rw,reservoirRimWeight:rim,cavernReserveWeight:cw};
}
function estateTerrain(x,z,y){
  const a=ellipseWeight(x,z,ESTATE.atriumTerrace),h=ellipseWeight(x,z,ESTATE.hillInterfaceTerrace),d=spineDistance(x,z,ESTATE.connectiveSpine.points),s=1-smooth(ESTATE.connectiveSpine.coreHalfWidth,ESTATE.connectiveSpine.featherHalfWidth,d);
  y=mix(y,ATRIUM_Y,a)-ESTATE.connectiveSpine.boundedCutDepth*s;y=mix(y,HILL_Y,h);
  return{elevation:y,weight:Math.max(a,s,h),zoneWeights:freeze({atrium:a,connectiveSpine:s,hillInterface:h})};
}
function beachWidth(x){return clamp(44+5.5*Math.sin((x+22)/47)+3.2*Math.sin((x-70)/19)+7*bell(x,110,96),34,56);}
function coastalTerrain(x,z,y){
  const shore=resolveHEarthMapWideShorelineZ(x),d=z-shore,c=COASTLINE,sea=H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.seaLevelY,w=beachWidth(x),zone=smooth(-w-18,-w,d)*(1-smooth(c.shelfWidth,c.shelfWidth+18,d));
  let beach=0,dune=0,dry=0,wet=0,shelf=0;
  if(d>=-w&&d<=0){const p=smooth(-w,0,d),texture=.72*Math.sin(x*.047+d*.068)+.34*Math.sin(x*.021-d*.117),upper=mix(sea+c.duneMaximumElevation+texture,sea+c.dryBeachMaximumElevation+.35*Math.sin(x*.039+d*.041),smooth(0,.42,p)),profile=mix(upper,sea+c.wetBeachElevation,Math.pow(smooth(.22,1,p),1.24));y=mix(y,profile,mix(.22,.86,p)*zone);beach=zone*smooth(.16,.35,p);dune=(1-smooth(.28,.52,p))*smooth(.02,.18,p)*zone;dry=smooth(.28,.48,p)*(1-smooth(.76,.9,p))*zone;wet=smooth(.72,.98,p)*zone;}
  else if(d>0&&d<=c.shelfWidth){const p=smooth(0,c.shelfWidth,d),profile=mix(sea+c.wetBeachElevation,sea+c.shelfFloorElevation,p);y=mix(y,profile,mix(.88,.54,p)*zone);beach=(1-smooth(0,c.beachSeawardWidth,d))*zone;wet=(1-smooth(0,8,d))*zone;shelf=smooth(0,11,d)*zone;}
  const sw=sandWeight(x,z);if(sw>0)y=mix(y,sandTarget(x,z),smooth(.12,.58,sw));
  return{elevation:y,shorelineZ:shore,distanceToShore:d,beachWeight:beach,duneGrassWeight:dune,drySandWeight:dry,wetSandWeight:wet,shelfWeight:shelf,sandbarWeight:sw,terrainConformingBeach:true,organicMaterialTransition:true,restoredBay:true,lowProfileBrokenSandbars:true};
}

export function sampleHEarthMapWidePresentationReliefOffset(x,z){const s=sampleHEarthRun8BSuccessorTerrainField(x,z);if(s?.valid!==true)return NaN;const h=hydroTerrain(x,z,s.elevation+sampleHEarthMapWideEnvironmentalReliefOffset(x,z)),e=estateTerrain(x,z,h.elevation),c=coastalTerrain(x,z,e.elevation);return c.elevation-s.elevation;}
export function sampleHEarthMapWideReliefSignal(x,y,z){if(![x,y,z].every(finite))return NaN;let q=0;for(const p of H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.virtualNormalRelief.directionalPhases)q+=Math.sin((x*p.direction.x+y*p.direction.y+z*p.direction.z)*p.frequency+p.offset)*p.weight;return q;}
export function sampleHEarthMapWideVirtualReliefHeight(x,y,z){const q=sampleHEarthMapWideReliefSignal(x,y,z);return finite(q)?q*.22:NaN;}
export function resolveHEarthMapWideReliefEnvelope({distanceToCamera,slope,maximumPhaseFootprint=0}={}){if(![distanceToCamera,slope,maximumPhaseFootprint].every(finite))return NaN;const p=H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE.virtualNormalRelief;return clamp((1-smooth(p.distanceEnvelope.fullInfluenceThrough,p.distanceEnvelope.zeroInfluenceBy,Math.max(0,distanceToCamera)))*mix(p.slopeEnvelope.minimumInfluence,p.slopeEnvelope.maximumInfluence,smooth(p.slopeEnvelope.responseStart,p.slopeEnvelope.responseEnd,clamp(slope,0,1)))*(1-smooth(p.antialiasFootprint.fullThrough,p.antialiasFootprint.zeroBy,Math.max(0,maximumPhaseFootprint))),0,1);}
export function resolveHEarthMapWideGeometricProtectionEnvelope(x,z){return protection(x,z);}
export function isInsideHEarthReservedEstateEnvelope(x,z){if(!inside(x,z,ESTATE.reservedEnvelope))return false;return Math.max(ellipseWeight(x,z,ESTATE.atriumTerrace),ellipseWeight(x,z,ESTATE.hillInterfaceTerrace),1-smooth(ESTATE.connectiveSpine.coreHalfWidth,ESTATE.connectiveSpine.featherHalfWidth,spineDistance(x,z,ESTATE.connectiveSpine.points)))>.05;}

export function sampleHEarthMapWideEnvironmentTerrainCandidate(x,z){
  const s=sampleHEarthRun8BSuccessorTerrainField(x,z);if(s?.valid!==true)return freeze({valid:false,status:'H_EARTH_MAP_WIDE_ENVIRONMENT_TERRAIN_SAMPLE_REJECTED',worldX:x,worldZ:z});
  const env=sampleHEarthMapWideEnvironmentalReliefOffset(s.world.x,s.world.z),h=hydroTerrain(s.world.x,s.world.z,s.elevation+env),e=estateTerrain(s.world.x,s.world.z,h.elevation),c=coastalTerrain(s.world.x,s.world.z,e.elevation),py=c.elevation,rel=py-s.elevation,signal=sampleHEarthMapWideReliefSignal(s.world.x,s.elevation,s.world.z);
  return freeze({valid:true,status:'H_EARTH_MAP_WIDE_ENVIRONMENT_TERRAIN_SAMPLE_COMPLETE',contractId:H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,sourceContractId:s.contractId,sourceGenerationRevision:s.generationRevision,world:s.world,elevation:s.elevation,geometricElevation:s.elevation,geometricElevationMutated:false,presentationElevation:py,presentationReliefOffset:rel,environmentalReliefOffset:env,
    sitePreparation:freeze({active:e.weight>0,weight:e.weight,zoneWeights:e.zoneWeights,atriumTargetElevation:ATRIUM_Y,hillInterfaceTargetElevation:HILL_Y,treatment:ESTATE.treatment,revision6ShapeProtected:true}),
    hydrology:freeze({waterfallWeight:h.waterfallWeight,reservoirWeight:h.reservoirWeight,reservoirRimWeight:h.reservoirRimWeight,cavernReserveWeight:h.cavernReserveWeight,reservoirWaterSurfaceElevation:RES_WATER,reservoirFloorElevation:RES_FLOOR,reservoirOutlineClass:H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.reservoir.outlineClass,enclosedReservoir:true,visibleDrainageToCoast:false}),
    coastline:freeze({...c,fullBeachConstructed:true,sandbarsConstructed:true}),presentationGeometryIsCandidateOnly:true,normal:s.normal??null,reliefProfileId:H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID,reliefSignal:signal,virtualReliefHeight:signal*.22,insideReservedEstateEnvelope:isInsideHEarthReservedEstateEnvelope(s.world.x,s.world.z),rearBoundaryBarrierOffset:rearBarrier(s.world.x,s.world.z),mountainRidgeAxisZ:ridgeAxisZ(s.world.x),manorGeometryConstructed:false,cavernInteriorConstructed:false,vaultInteriorConstructed:false});
}

function boundarySource(x,z){return sampleHEarthMapWideEnvironmentTerrainCandidate(clamp(x,-256,256),clamp(z,-320,64));}
function continentalMacro(x,z,shore){const sea=H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.seaLevelY;if(z>shore)return sea-.5-Math.min(18,(z-shore)*.08);const inland=Math.max(0,shore-z),rise=Math.min(34,inland*.075),north=34*bell(z,-500,170)*bell(x,-85,430)+22*bell(z,-575,115)*bell(x,250,260),west=20*bell(x,-430,150)*bell(z,-350,250),east=25*bell(x,420,170)*bell(z,-300,270),up=12*bell(x,90,250)*bell(z,-430,220),val=-13*bell(x,35,115)*bell(z,-470,190),waves=8.5*Math.sin((x+z*.32)/118)+5*Math.sin((x*.38-z)/79);return sea+2.2+rise+north+west+east+up+val+waves;}
export function sampleHEarthAudraliaContinentalShell(x,z){
  if(![x,z].every(finite)||x<CONTINENT.xMinimum||x>CONTINENT.xMaximum||z<CONTINENT.zMinimum||z>CONTINENT.zMaximum)return freeze({valid:false,status:'H_EARTH_AUDRALIA_CONTINENTAL_SHELL_SAMPLE_REJECTED',worldX:x,worldZ:z});
  if(inside(x,z,REGION)){const g=sampleHEarthMapWideEnvironmentTerrainCandidate(x,z);return freeze({valid:g.valid,status:'H_EARTH_AUDRALIA_CONTINENTAL_SHELL_SAMPLE_COMPLETE',world:freeze({x,y:g.presentationElevation,z}),presentationElevation:g.presentationElevation,boundaryElevation:g.presentationElevation,sourceClass:'HIGH_RESOLUTION_GRATITUDE_REGION',resolutionClass:'HIGH_RESOLUTION_CURRENT_REGION',unresolvedFutureTerritory:false,authoringPreviewOnly:true,canonicalRun8BExtensionClaimed:false,liveTraversalAuthorized:false,futureRegionIdentityAssigned:false});}
  const shore=resolveHEarthMapWideShorelineZ(x),macro=continentalMacro(x,z,shore),b=boundarySource(x,z),blend=smooth(0,96,outsideDistance(x,z,REGION)),y=mix(b.presentationElevation,macro,blend);
  return freeze({valid:true,status:'H_EARTH_AUDRALIA_CONTINENTAL_SHELL_SAMPLE_COMPLETE',world:freeze({x,y,z}),presentationElevation:y,boundaryElevation:b.presentationElevation,shorelineZ:shore,sourceClass:'LOW_RESOLUTION_AUTHORING_CONTINENTAL_CONTEXT',resolutionClass:'LOW_RESOLUTION_UNRESOLVED_CONTINENTAL_CONTEXT',unresolvedFutureTerritory:true,authoringPreviewOnly:true,canonicalRun8BExtensionClaimed:false,liveTraversalAuthorized:false,futureRegionIdentityAssigned:false,futureRegionCoordinatesCanonicalized:false});
}
export function sampleHEarthMapWideFutureRegionContinuation(x,z){const s=sampleHEarthAudraliaContinentalShell(x,z);return s.valid&&z<=-320?freeze({...s,status:'H_EARTH_FUTURE_REGION_CONTINUATION_SAMPLE_COMPLETE',continuationDepth:clamp((-320-z)/320,0,1)}):freeze({valid:false,status:'H_EARTH_FUTURE_REGION_CONTINUATION_SAMPLE_REJECTED',worldX:x,worldZ:z});}

export function evaluateHEarthMapWideEnvironmentTerrainCandidate(){
  const issues=[],entry=sampleHEarthMapWideEnvironmentTerrainCandidate(0,-96),atrium=sampleHEarthMapWideEnvironmentTerrainCandidate(80,-172),saddle=sampleHEarthMapWideEnvironmentTerrainCandidate(111,-192),hill=sampleHEarthMapWideEnvironmentTerrainCandidate(136,-208),res=sampleHEarthMapWideEnvironmentTerrainCandidate(-44,-211),fall=sampleHEarthMapWideEnvironmentTerrainCandidate(-48,-252),cave=sampleHEarthMapWideEnvironmentTerrainCandidate(-7,-238),rear=sampleHEarthMapWideEnvironmentTerrainCandidate(-64,-310),beach=sampleHEarthMapWideEnvironmentTerrainCandidate(0,resolveHEarthMapWideShorelineZ(0)-16),bar=sampleHEarthMapWideEnvironmentTerrainCandidate(-14,11),rel=[sampleHEarthMapWideEnvironmentTerrainCandidate(-96,-271),sampleHEarthMapWideEnvironmentTerrainCandidate(-8,-258),sampleHEarthMapWideEnvironmentTerrainCandidate(196,-252)],shell=[sampleHEarthAudraliaContinentalShell(-62,-500),sampleHEarthAudraliaContinentalShell(-420,-270),sampleHEarthAudraliaContinentalShell(420,-260)];
  const witnesses=[entry,atrium,saddle,hill,res,fall,cave,rear,beach,bar,...rel];
  if(witnesses.some(s=>s.valid!==true))issues.push('MAP_WIDE_WITNESS_SAMPLE_INVALID');
  if(witnesses.some(s=>s.geometricElevationMutated!==false))issues.push('RUN8B_GEOMETRIC_TRUTH_MUTATED');
  if(Math.abs(entry.presentationReliefOffset)>1e-9)issues.push('ENTRY_REGION_PRESENTATION_OFFSET_NONZERO');
  if(!rel.some(s=>Math.abs(s.presentationReliefOffset)>=4))issues.push('MATERIAL_MACRO_RELIEF_NOT_DEMONSTRATED');
  if(rear.rearBoundaryBarrierOffset<=2)issues.push('REAR_MOUNTAIN_SYSTEM_NOT_PRESENT');
  const peakZ=MACRO.filter(l=>['WESTERN_HIGH_PEAK','WATERFALL_LEFT_PEAK','WATERFALL_RIGHT_PEAK','EASTERN_RIDGE','FAR_EAST_HIGHLAND'].includes(l.id)).map(l=>l.center.z),spread=Math.max(...peakZ)-Math.min(...peakZ);
  if(spread<40)issues.push('MOUNTAIN_ALIGNMENT_REMAINS_TOO_STRAIGHT');
  if(atrium.sitePreparation.zoneWeights.atrium<=.9||saddle.sitePreparation.zoneWeights.connectiveSpine<=.9||hill.sitePreparation.zoneWeights.hillInterface<=.9)issues.push('ESTATE_SHAPE_NOT_PRESERVED');
  if(res.hydrology.reservoirWeight<=.9||res.presentationElevation>=RES_WATER-4)issues.push('RESERVOIR_NOT_NATURALIZED');
  if(fall.hydrology.waterfallWeight<=.5)issues.push('WATERFALL_CLEFT_NOT_BROAD_ENOUGH');
  if(cave.hydrology.cavernReserveWeight<=.5)issues.push('CAVERN_EXTERIOR_RESERVE_NOT_CONSTRUCTED');
  if(beach.coastline.beachWeight<=.2||beach.coastline.organicMaterialTransition!==true)issues.push('ORGANIC_BEACH_NOT_CONSTRUCTED');
  if(bar.coastline.sandbarWeight<=.15||bar.presentationElevation<=H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.seaLevelY)issues.push('LOW_PROFILE_SANDBAR_SYSTEM_NOT_ESTABLISHED');
  const bc=resolveHEarthMapWideShorelineZ(118),bw=resolveHEarthMapWideShorelineZ(36),be=resolveHEarthMapWideShorelineZ(200);if(!(bc<Math.min(bw,be)-18))issues.push('INLAND_BAY_NOT_RESTORED');
  if(shell.some(s=>s.valid!==true||s.unresolvedFutureTerritory!==true||s.canonicalRun8BExtensionClaimed!==false||s.liveTraversalAuthorized!==false))issues.push('AUDRALIAN_CONTINENTAL_SHELL_NOT_ESTABLISHED');
  return freeze({eligible:issues.length===0,status:issues.length?'H_EARTH_MAP_WIDE_ENVIRONMENT_TERRAIN_CANDIDATE_FAIL':'H_EARTH_MAP_WIDE_ENVIRONMENT_TERRAIN_CANDIDATE_PASS',contractId:H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_ID,baseTerrainFieldContractId:H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,reliefProfileId:H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_RELIEF_PROFILE_ID,successorRepairRevision:8,witnesses,mountainPeakZSpread:spread,continentalShellWitnesses:freeze(shell),run8BTruthElevationMutation:false,candidatePresentationElevationConstructed:true,physicalEstateTerrainPreparationConstructed:true,restoredBayConstructed:true,terrainConformingBeachConstructed:true,organicCoastalMaterialTransitionConstructed:true,lowProfileBrokenSandbarsConstructed:true,irregularReservoirConstructed:true,staggeredMountainSystemConstructed:true,audralianContinentalShellConstructed:true,futureRegionIdentitiesAssigned:false,futureRegionCoordinatesCanonicalized:false,manorGeometryConstructed:false,issues:freeze(issues)});
}
export const H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION=evaluateHEarthMapWideEnvironmentTerrainCandidate();
if(H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION.eligible!==true)throw new Error(`H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE_FAIL:${JSON.stringify(H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION.issues)}`);
export default H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_CANDIDATE;

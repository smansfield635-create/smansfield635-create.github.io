import {resolveStandAt,STAND_PROFILES} from './vegetation-stand-topology.mjs';
import {resolveCompositionAt} from './vegetation-composition.mjs';

const freeze=(value,seen=new WeakSet())=>{
  if(value===null||typeof value!=='object'||Object.isFrozen(value)||seen.has(value))return value;
  seen.add(value);
  for(const nested of Object.values(value))freeze(nested,seen);
  return Object.freeze(value);
};
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const quantize=(value,digits=6)=>Number(Number(value).toFixed(digits));

export const SPATIAL_ZONES=freeze(['INTERIOR','EDGE','TRANSITION','OPENING']);
export const ZONE_CANOPY_MULTIPLIERS=freeze({INTERIOR:1,EDGE:.62,TRANSITION:.32,OPENING:0});

export const EDGE_ECOLOGY_CONTRACT=freeze({
  schema:'MIRRORLAND_EDGE_ECOLOGY_CONTRACT_v1',
  operationId:'MIRRORLAND_STAND_TOPOLOGY_EDGE_ECOLOGY_NEGATIVE_SPACE_20260906_002',
  stage:'EDGE_ECOLOGY',
  standSource:'characters/vegetation-stand-topology.mjs#resolveStandAt',
  compositionSource:'characters/vegetation-composition.mjs#resolveCompositionAt',
  zones:SPATIAL_ZONES,
  precedence:freeze(['COMPOSITION_HARD_OPEN','ECOLOGICAL_OPEN_STAND','COMPOSITION_FEATHER','STAND_EDGE','STAND_TRANSITION','STAND_INTERIOR']),
  openingCanopyAllowed:false,
  zoneCanopyMultipliers:ZONE_CANOPY_MULTIPLIERS
});

export function resolveVegetationEnvironment(worldX,worldZ){
  const stand=resolveStandAt(worldX,worldZ);
  const composition=resolveCompositionAt(worldX,worldZ);
  const profile=STAND_PROFILES[stand.standClass];
  let spatialZone='INTERIOR';
  let zoneReason='STAND_INTERIOR';
  if(composition.hardOpen){
    spatialZone='OPENING';
    zoneReason='COMPOSITION_HARD_OPEN';
  }else if(stand.standClass==='ECOLOGICAL_OPEN'||profile.canopyDensity<=0){
    spatialZone='OPENING';
    zoneReason='ECOLOGICAL_OPEN_STAND';
  }else if(composition.feather){
    spatialZone='TRANSITION';
    zoneReason='COMPOSITION_FEATHER';
  }else if(stand.boundaryDistance<=profile.edgeWidth){
    spatialZone='EDGE';
    zoneReason='STAND_EDGE';
  }else if(stand.boundaryDistance<=profile.edgeWidth+profile.transitionWidth){
    spatialZone='TRANSITION';
    zoneReason='STAND_TRANSITION';
  }

  let canopyMultiplier=ZONE_CANOPY_MULTIPLIERS[spatialZone];
  if(spatialZone==='TRANSITION'&&composition.feather){
    canopyMultiplier*=clamp(1-.55*composition.influence,.38,1);
  }
  const canopyDensity=clamp(profile.canopyDensity*canopyMultiplier,0,1);
  return freeze({
    standId:stand.standId,
    standClass:stand.standClass,
    standBoundaryDistance:stand.boundaryDistance,
    standProfile:profile,
    spatialZone,
    zoneReason,
    canopyMultiplier:quantize(canopyMultiplier,12),
    canopyDensity:quantize(canopyDensity,12),
    understoryProfile:profile.understoryProfile,
    compositionTerritoryId:composition.territoryId,
    compositionSiteId:composition.siteId,
    compositionBand:composition.band,
    compositionInfluence:composition.influence,
    hardOpen:composition.hardOpen,
    feather:composition.feather,
    standTopologyAuthority:stand.topologyAuthority,
    compositionAuthority:composition.compositionAuthority,
    edgeEcologyAuthority:EDGE_ECOLOGY_CONTRACT.schema
  });
}

import {resolveStep9Site,resolveStep9Camera} from './step9-regional-geography.mjs';

const freeze=(value,seen=new WeakSet())=>{
  if(value===null||typeof value!=='object'||Object.isFrozen(value)||seen.has(value))return value;
  seen.add(value);
  for(const nested of Object.values(value))freeze(nested,seen);
  return Object.freeze(value);
};
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const quantize=(value,digits=6)=>Number(Number(value).toFixed(digits));

export const COMPOSITION_TERRITORY_RULES=freeze({
  MIRROR_MANOR:freeze({purpose:'MIRROR_MANOR_APPROACH_AND_LANDMARK_BREATHING_SPACE',hardRadius:88,featherRadius:174,corridorHardHalfWidth:24,corridorFeatherHalfWidth:62}),
  WATERLINE_STATION:freeze({purpose:'WATERLINE_STATION_AND_SHORELINE_WINDOW',hardRadius:64,featherRadius:138,corridorHardHalfWidth:20,corridorFeatherHalfWidth:52}),
  WATCHFIRE_OVERLOOK:freeze({purpose:'WATCHFIRE_OVERLOOK_SIGHTLINE',hardRadius:58,featherRadius:126,corridorHardHalfWidth:18,corridorFeatherHalfWidth:48}),
  CROSSING:freeze({purpose:'CROSSING_TRAVEL_CORRIDOR',hardRadius:46,featherRadius:108,corridorHardHalfWidth:18,corridorFeatherHalfWidth:46}),
  SIGNAL_LANTERN_FIELD:freeze({purpose:'SIGNAL_LANTERN_FIELD_OPENING',hardRadius:46,featherRadius:106,corridorHardHalfWidth:16,corridorFeatherHalfWidth:42}),
  RESTORATION_BOUNDARY:freeze({purpose:'RESTORATION_BOUNDARY_BREATHING_SPACE',hardRadius:44,featherRadius:104,corridorHardHalfWidth:16,corridorFeatherHalfWidth:42}),
  BEYOND_MANOR:freeze({purpose:'BEYOND_MANOR_TRANSITION_WINDOW',hardRadius:44,featherRadius:102,corridorHardHalfWidth:16,corridorFeatherHalfWidth:40})
});

export const NEGATIVE_SPACE_COMPOSITION_CONTRACT=freeze({
  schema:'MIRRORLAND_NEGATIVE_SPACE_COMPOSITION_CONTRACT_v1',
  operationId:'MIRRORLAND_STAND_TOPOLOGY_EDGE_ECOLOGY_NEGATIVE_SPACE_20260906_002',
  stage:'NEGATIVE_SPACE_COMPOSITION',
  canonicalAnchorSource:'characters/step9-regional-geography.mjs#resolveStep9Site/resolveStep9Camera',
  territoriesFirstClass:true,
  hardOpenCoreRequired:true,
  featherBandRequired:true,
  approachCorridorRequired:true,
  destinationCoordinatesDuplicated:false,
  destinationCoordinatesMutable:false,
  rules:COMPOSITION_TERRITORY_RULES
});

let cachedTerritories=null;

function buildTerritories(){
  const territories=[];
  for(const [siteId,rule] of Object.entries(COMPOSITION_TERRITORY_RULES)){
    const site=resolveStep9Site(siteId);
    const camera=resolveStep9Camera(siteId);
    const anchor=freeze({x:quantize(site.world.x),z:quantize(site.world.z)});
    const cameraEye=freeze({x:quantize(camera.eye.x),z:quantize(camera.eye.z)});
    territories.push(freeze({
      id:`composition-${siteId.toLowerCase().replaceAll('_','-')}`,
      siteId,
      purpose:rule.purpose,
      anchor,
      cameraEye,
      hardRadius:rule.hardRadius,
      featherRadius:rule.featherRadius,
      corridor:freeze({
        a:cameraEye,
        b:anchor,
        hardHalfWidth:rule.corridorHardHalfWidth,
        featherHalfWidth:rule.corridorFeatherHalfWidth
      }),
      anchorSource:'STEP9_SITE_AND_CAMERA',
      canonicalGeographyReadOnly:true
    }));
  }
  return freeze(territories);
}

export function getCompositionTerritories(){
  if(!cachedTerritories)cachedTerritories=buildTerritories();
  return cachedTerritories;
}

function distanceToSegment(px,pz,a,b){
  const vx=b.x-a.x,vz=b.z-a.z;
  const wx=px-a.x,wz=pz-a.z;
  const len2=vx*vx+vz*vz;
  if(len2<=1e-9)return {distance:Math.hypot(px-a.x,pz-a.z),t:0};
  const t=clamp((wx*vx+wz*vz)/len2,0,1);
  const x=a.x+t*vx,z=a.z+t*vz;
  return {distance:Math.hypot(px-x,pz-z),t};
}

function evaluateTerritory(territory,x,z){
  const radialDistance=Math.hypot(x-territory.anchor.x,z-territory.anchor.z);
  const corridor=distanceToSegment(x,z,territory.corridor.a,territory.corridor.b);
  const radialHard=radialDistance<=territory.hardRadius;
  const corridorHard=corridor.distance<=territory.corridor.hardHalfWidth;
  const hardOpen=radialHard||corridorHard;
  const radialFeather=radialDistance<=territory.featherRadius;
  const corridorFeather=corridor.distance<=territory.corridor.featherHalfWidth;
  const feather=!hardOpen&&(radialFeather||corridorFeather);
  const radialInfluence=1-clamp((radialDistance-territory.hardRadius)/Math.max(1,territory.featherRadius-territory.hardRadius),0,1);
  const corridorInfluence=1-clamp((corridor.distance-territory.corridor.hardHalfWidth)/Math.max(1,territory.corridor.featherHalfWidth-territory.corridor.hardHalfWidth),0,1);
  return {
    territory,
    hardOpen,
    feather,
    radialDistance,
    corridorDistance:corridor.distance,
    corridorT:corridor.t,
    influence:hardOpen?1:Math.max(radialFeather?radialInfluence:0,corridorFeather?corridorInfluence:0)
  };
}

export function resolveCompositionAt(worldX,worldZ){
  let best=null;
  for(const territory of getCompositionTerritories()){
    const current=evaluateTerritory(territory,worldX,worldZ);
    if(!current.hardOpen&&!current.feather)continue;
    if(!best||(current.hardOpen&&!best.hardOpen)||(current.hardOpen===best.hardOpen&&current.influence>best.influence))best=current;
  }
  if(!best)return freeze({
    territoryId:null,
    siteId:null,
    purpose:null,
    band:'NONE',
    hardOpen:false,
    feather:false,
    influence:0,
    compositionAuthority:NEGATIVE_SPACE_COMPOSITION_CONTRACT.schema
  });
  return freeze({
    territoryId:best.territory.id,
    siteId:best.territory.siteId,
    purpose:best.territory.purpose,
    band:best.hardOpen?'HARD_OPEN':'FEATHER',
    hardOpen:best.hardOpen,
    feather:best.feather,
    influence:quantize(best.influence,12),
    radialDistance:quantize(best.radialDistance,6),
    corridorDistance:quantize(best.corridorDistance,6),
    corridorT:quantize(best.corridorT,12),
    compositionAuthority:NEGATIVE_SPACE_COMPOSITION_CONTRACT.schema
  });
}

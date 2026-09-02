/**
 * CHARACTERS_STEP9_GRATITUDE_HARBOR_REGIONAL_BRIDGE_v1
 *
 * Read-only regional bridge for the Characters experience. Geography comes
 * from the canonical Gratitude adapter. The Characters page owns nighttime
 * presentation and harbor-scale navigation only. Regional discovery may
 * extend beyond the currently playable H-Earth ground domain; that extension
 * grants no traversal authority. Character-card accessibility is deferred.
 */
import {
  GRATITUDE_GEOGRAPHY_ADAPTER_ID,
  GRATITUDE_DEVELOPMENT_FRAME,
  resolveGratitudeShoreline,
  sampleGratitudeWorld,
  resolveSiteAnchor,
  resolveCameraSiteAnchor,
  worldToMap
} from './gratitude-geography.adapter.mjs';

const freeze=(value,seen=new WeakSet())=>{if(value===null||typeof value!=='object'||Object.isFrozen(value)||seen.has(value))return value;seen.add(value);for(const nested of Object.values(value))freeze(nested,seen);return Object.freeze(value);};
const finite=value=>typeof value==='number'&&Number.isFinite(value);

export const STEP9_REGIONAL_BRIDGE_ID='CHARACTERS_STEP9_GRATITUDE_HARBOR_REGIONAL_BRIDGE_v1';
export const STEP9_SCALE_CONTRACT=freeze({
  planetary:'AUDRALIA_GLOBE',
  regional:'CHARACTERS_NIGHTTIME_GRATITUDE_HARBOR',
  ground:'H_EARTH',
  localNarrative:'FUTURE_CHARACTER_SCENE',
  game:'FUTURE_GAME_RUNTIME',
  regionalDiscoveryMayExceedPlayableGroundDomain:true,
  regionalContinuationGrantsTraversalAuthority:false,
  accessibilityStatusDeferredToCharacterCardBoundary:true,
  scenesConstructed:false,
  gameplayConstructed:false,
  directivesConstructed:false
});

const derived=(siteId,x,z,surveyOffset)=>freeze({siteId,x,z,surveyOffset,derivedLocalDestination:true,finalNarrativePlacement:false,traversalAuthorityGranted:false});
const LOCAL_DERIVED_DESTINATIONS=freeze({
  AUREN_LOCAL:derived('AUREN_LOCAL',250,-980,{x:170,y:120,z:280}),
  JEEVES_LOCAL:derived('JEEVES_LOCAL',520,-930,{x:160,y:88,z:280}),
  BEYOND_MANOR:derived('BEYOND_MANOR',-430,-940,{x:180,y:118,z:250})
});

export const STEP9_DESTINATION_BINDINGS=freeze({
  crossing:{siteId:'CROSSING',role:'WORLD_CONTEXT'},
  dextrion:{siteId:'DEXTRION_TRANSMISSION',role:'WORLD_CONTEXT'},
  alaric:{siteId:'WATCHFIRE_OVERLOOK',role:'CARDINAL_LOCALITY'},
  tarian:{siteId:'WATERLINE_STATION',role:'CARDINAL_LOCALITY'},
  manor:{siteId:'MIRROR_MANOR',role:'MAJOR_PLACE_CONTEXT'},
  elara:{siteId:'SIGNAL_LANTERN_FIELD',role:'CARDINAL_LOCALITY'},
  soren:{siteId:'RESTORATION_BOUNDARY',role:'CARDINAL_LOCALITY'},
  auren:{siteId:'AUREN_LOCAL',role:'LOCAL_DERIVED_DESTINATION'},
  jeeves:{siteId:'JEEVES_LOCAL',role:'LOCAL_DERIVED_DESTINATION'},
  clock:{siteId:'CLOCK',role:'INSTRUMENT_CONTEXT'},
  remote:{siteId:'BEYOND_MANOR',role:'LOCAL_DERIVED_DESTINATION'}
});

function resolveDerived(spec){
  const terrain=sampleGratitudeWorld(spec.x,spec.z).source;
  return freeze({
    siteId:spec.siteId,
    world:{x:spec.x,y:terrain.presentationElevation,z:spec.z},
    terrain,
    developmentOnly:true,
    derivedLocalDestination:true,
    finalNarrativePlacement:false,
    traversalAuthorityGranted:false
  });
}

export function resolveStep9Site(siteId){
  if(LOCAL_DERIVED_DESTINATIONS[siteId])return resolveDerived(LOCAL_DERIVED_DESTINATIONS[siteId]);
  const site=resolveSiteAnchor(siteId);
  return freeze({...site,traversalAuthorityGranted:false});
}

export function resolveStep9Camera(siteId){
  if(LOCAL_DERIVED_DESTINATIONS[siteId]){
    const spec=LOCAL_DERIVED_DESTINATIONS[siteId];
    const site=resolveDerived(spec);
    return freeze({siteId,worldReference:site.world,look:{...site.world},eye:{x:site.world.x+spec.surveyOffset.x,y:site.world.y+spec.surveyOffset.y,z:site.world.z+spec.surveyOffset.z},pathClass:'DESTINATION_DRIVEN_AUTHORED_CINEMATIC_SURVEY_PATH'});
  }
  return resolveCameraSiteAnchor(siteId);
}

export function step9ShorelineZ(worldX){return resolveGratitudeShoreline(worldX).world.z;}
export function step9TerrainHeight(worldX,worldZ){return sampleGratitudeWorld(worldX,worldZ).source.presentationElevation;}
export function step9MapPosition(siteId){const site=resolveStep9Site(siteId);return worldToMap(site.world,{clampToFrame:true});}
export function step9Frame(){return GRATITUDE_DEVELOPMENT_FRAME;}

export function evaluateStep9RegionalBridge(){
  const issues=[];
  if(GRATITUDE_GEOGRAPHY_ADAPTER_ID!=='CHARACTERS_GRATITUDE_GEOGRAPHY_ADAPTER_TASK19_v1')issues.push('GRATITUDE_ADAPTER_ID_DRIFT');
  if(STEP9_SCALE_CONTRACT.regionalDiscoveryMayExceedPlayableGroundDomain!==true)issues.push('REGIONAL_DISCOVERY_BOUNDARY_LOST');
  if(STEP9_SCALE_CONTRACT.regionalContinuationGrantsTraversalAuthority!==false)issues.push('TRAVERSAL_AUTHORITY_LEAK');
  if(STEP9_SCALE_CONTRACT.accessibilityStatusDeferredToCharacterCardBoundary!==true)issues.push('CARD_ACCESSIBILITY_BOUNDARY_LOST');
  if(STEP9_SCALE_CONTRACT.scenesConstructed!==false||STEP9_SCALE_CONTRACT.gameplayConstructed!==false)issues.push('STEP9_SCOPE_LEAK');
  for(const [destinationId,binding] of Object.entries(STEP9_DESTINATION_BINDINGS)){
    try{
      const site=resolveStep9Site(binding.siteId),camera=resolveStep9Camera(binding.siteId),map=step9MapPosition(binding.siteId);
      if(!finite(site.world.x)||!finite(site.world.y)||!finite(site.world.z))issues.push(`NONFINITE_SITE:${destinationId}`);
      if(!finite(camera.eye.x)||!finite(camera.eye.y)||!finite(camera.eye.z))issues.push(`NONFINITE_CAMERA:${destinationId}`);
      if(map.insideFrame!==true)issues.push(`MAP_OUTSIDE_REGIONAL_FRAME:${destinationId}`);
      if(site.traversalAuthorityGranted!==false)issues.push(`TRAVERSAL_AUTHORITY_LEAK:${destinationId}`);
    }catch(error){issues.push(`DESTINATION_RESOLUTION_FAILURE:${destinationId}:${error?.message||error}`);}
  }
  return freeze({contractId:STEP9_REGIONAL_BRIDGE_ID,status:issues.length?'FAIL':'PASS',issues,destinationCount:Object.keys(STEP9_DESTINATION_BINDINGS).length,geographyAuthority:'AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1',nighttimePresentationOwnedByCharacters:true,terrainEquationsOwnedByCharacters:false,shorelineCoordinatesOwnedByCharacters:false,scenesConstructed:false,gameplayConstructed:false});
}

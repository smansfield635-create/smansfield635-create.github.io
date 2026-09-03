/**
 * CHARACTERS_STEP9_GRATITUDE_HARBOR_REGIONAL_BRIDGE_v1
 *
 * Read-only regional bridge for the Characters experience. Canonical geography
 * comes from the Gratitude adapter. Characters may derive safe presentation
 * positions for narrative cameras, but canonical source coordinates are
 * retained separately and are never rewritten here.
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
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

export const STEP9_REGIONAL_BRIDGE_ID='CHARACTERS_STEP9_GRATITUDE_HARBOR_REGIONAL_BRIDGE_v1';
export const STEP9_SAFE_INTERIOR=freeze({minimumHorizontalInset:230});
export const STEP9_SCALE_CONTRACT=freeze({
  planetary:'AUDRALIA_GLOBE',
  regional:'CHARACTERS_NIGHTTIME_GRATITUDE_HARBOR',
  ground:'H_EARTH',
  localNarrative:'CHARACTER_SCENE_THRESHOLD',
  game:'FUTURE_GAME_RUNTIME',
  regionalDiscoveryMayExceedPlayableGroundDomain:true,
  regionalContinuationGrantsTraversalAuthority:false,
  accessibilityStatusDeferredToCharacterCardBoundary:false,
  scenesConstructed:false,
  gameplayConstructed:false,
  directivesConstructed:false,
  canonicalGeographyReadOnly:true,
  safeInteriorPresentationRequired:true
});

function safeWorld(world){
  const envelope=GRATITUDE_DEVELOPMENT_FRAME.envelope;
  const inset=STEP9_SAFE_INTERIOR.minimumHorizontalInset;
  const x=clamp(world.x,envelope.xMinimum+inset,envelope.xMaximum-inset);
  const z=clamp(world.z,envelope.zMinimum+inset,envelope.zMaximum-inset);
  const y=sampleGratitudeWorld(x,z).source.presentationElevation;
  return freeze({x,y,z});
}
function safeEye(eye){
  const envelope=GRATITUDE_DEVELOPMENT_FRAME.envelope;
  const inset=STEP9_SAFE_INTERIOR.minimumHorizontalInset;
  return freeze({...eye,x:clamp(eye.x,envelope.xMinimum+inset,envelope.xMaximum-inset),z:clamp(eye.z,envelope.zMinimum+inset,envelope.zMaximum-inset)});
}
function safe(world){
  const envelope=GRATITUDE_DEVELOPMENT_FRAME.envelope;
  const inset=STEP9_SAFE_INTERIOR.minimumHorizontalInset;
  return world.x>=envelope.xMinimum+inset&&world.x<=envelope.xMaximum-inset&&world.z>=envelope.zMinimum+inset&&world.z<=envelope.zMaximum-inset;
}

const derived=(siteId,x,z,surveyOffset)=>freeze({siteId,x,z,surveyOffset,derivedLocalDestination:true,finalNarrativePlacement:false,traversalAuthorityGranted:false});
const LOCAL_DERIVED_DESTINATIONS=freeze({
  AUREN_LOCAL:derived('AUREN_LOCAL',250,-900,{x:185,y:112,z:250}),
  JEEVES_LOCAL:derived('JEEVES_LOCAL',500,-880,{x:170,y:96,z:245}),
  BEYOND_MANOR:derived('BEYOND_MANOR',-430,-900,{x:205,y:126,z:240})
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

const PRESENTATION_CAMERA_TUNING=freeze({
  CROSSING:{radius:1.02,height:.92,lateral:-18},
  DEXTRION_TRANSMISSION:{radius:.94,height:.90,lateral:26},
  WATCHFIRE_OVERLOOK:{radius:1.00,height:.94,lateral:-26},
  WATERLINE_STATION:{radius:1.00,height:.90,lateral:28},
  MIRROR_MANOR:{radius:.98,height:.92,lateral:-34},
  SIGNAL_LANTERN_FIELD:{radius:.90,height:.90,lateral:24},
  RESTORATION_BOUNDARY:{radius:.88,height:.88,lateral:-24},
  CLOCK:{radius:.86,height:.88,lateral:20}
});

function resolveDerived(spec){
  const terrain=sampleGratitudeWorld(spec.x,spec.z).source;
  const canonicalWorld=freeze({x:spec.x,y:terrain.presentationElevation,z:spec.z});
  const world=safeWorld(canonicalWorld);
  return freeze({siteId:spec.siteId,world,canonicalWorld,terrain,developmentOnly:true,derivedLocalDestination:true,finalNarrativePlacement:false,traversalAuthorityGranted:false,presentationPlacement:'SAFE_INTERIOR_DERIVED'});
}

export function resolveStep9Site(siteId){
  if(LOCAL_DERIVED_DESTINATIONS[siteId])return resolveDerived(LOCAL_DERIVED_DESTINATIONS[siteId]);
  const site=resolveSiteAnchor(siteId);
  const canonicalWorld=freeze({...site.world});
  return freeze({...site,canonicalWorld,world:safeWorld(canonicalWorld),traversalAuthorityGranted:false,presentationPlacement:'SAFE_INTERIOR_DERIVED_FROM_CANONICAL'});
}

function tuneCanonicalCamera(siteId,camera){
  const tuning=PRESENTATION_CAMERA_TUNING[siteId];
  const canonicalLook=camera.look||camera.worldReference;
  const look=safeWorld(canonicalLook);
  const eye=camera.eye;
  if(!tuning)return freeze({...camera,canonicalEye:freeze({...eye}),canonicalLook:freeze({...canonicalLook}),look,worldReference:look,eye:safeEye(eye),pathClass:'SAFE_INTERIOR_DESTINATION_DRIVEN_AUTHORED_CINEMATIC_SURVEY_PATH'});
  const dx=eye.x-canonicalLook.x,dz=eye.z-canonicalLook.z;
  const len=Math.hypot(dx,dz)||1;
  const nx=dx/len,nz=dz/len;
  const tx=-nz,tz=nx;
  const radius=len*tuning.radius;
  const tuned={x:look.x+nx*radius+tx*tuning.lateral,y:look.y+(eye.y-canonicalLook.y)*tuning.height,z:look.z+nz*radius+tz*tuning.lateral};
  return freeze({...camera,canonicalEye:freeze({...eye}),canonicalLook:freeze({...canonicalLook}),look,worldReference:look,eye:safeEye(tuned),pathClass:'SAFE_INTERIOR_DESTINATION_DRIVEN_AUTHORED_CINEMATIC_SURVEY_PATH'});
}

export function resolveStep9Camera(siteId){
  if(LOCAL_DERIVED_DESTINATIONS[siteId]){
    const spec=LOCAL_DERIVED_DESTINATIONS[siteId];
    const site=resolveDerived(spec);
    const rawEye={x:site.world.x+spec.surveyOffset.x,y:site.world.y+spec.surveyOffset.y,z:site.world.z+spec.surveyOffset.z};
    return freeze({siteId,worldReference:site.world,look:{...site.world},eye:safeEye(rawEye),canonicalWorldReference:site.canonicalWorld,pathClass:'SAFE_INTERIOR_DESTINATION_DRIVEN_AUTHORED_CINEMATIC_SURVEY_PATH'});
  }
  return tuneCanonicalCamera(siteId,resolveCameraSiteAnchor(siteId));
}

export function step9ShorelineZ(worldX){return resolveGratitudeShoreline(worldX).world.z;}
export function step9TerrainHeight(worldX,worldZ){return sampleGratitudeWorld(worldX,worldZ).source.presentationElevation;}
export function step9MapPosition(siteId){const site=resolveStep9Site(siteId);return worldToMap(site.world,{clampToFrame:true});}
export function step9Frame(){return GRATITUDE_DEVELOPMENT_FRAME;}

export function evaluateStep9RegionalBridge(){
  const issues=[];
  if(GRATITUDE_GEOGRAPHY_ADAPTER_ID!=='CHARACTERS_GRATITUDE_GEOGRAPHY_ADAPTER_TASK19_v1')issues.push('GRATITUDE_ADAPTER_ID_DRIFT');
  if(STEP9_SCALE_CONTRACT.regionalContinuationGrantsTraversalAuthority!==false)issues.push('TRAVERSAL_AUTHORITY_LEAK');
  if(STEP9_SCALE_CONTRACT.canonicalGeographyReadOnly!==true)issues.push('CANONICAL_GEOGRAPHY_MUTATION_AUTHORITY_LEAK');
  for(const [destinationId,binding] of Object.entries(STEP9_DESTINATION_BINDINGS)){
    try{
      const site=resolveStep9Site(binding.siteId),camera=resolveStep9Camera(binding.siteId),map=step9MapPosition(binding.siteId);
      if(!finite(site.world.x)||!finite(site.world.y)||!finite(site.world.z))issues.push(`NONFINITE_SITE:${destinationId}`);
      if(!finite(camera.eye.x)||!finite(camera.eye.y)||!finite(camera.eye.z))issues.push(`NONFINITE_CAMERA:${destinationId}`);
      if(map.insideFrame!==true)issues.push(`MAP_OUTSIDE_REGIONAL_FRAME:${destinationId}`);
      if(site.traversalAuthorityGranted!==false)issues.push(`TRAVERSAL_AUTHORITY_LEAK:${destinationId}`);
      if(!safe(site.world)||!safe(camera.eye))issues.push(`SAFE_INTERIOR_CAMERA_ENVELOPE_FAILURE:${destinationId}`);
      if(!site.canonicalWorld)issues.push(`CANONICAL_WORLD_PROVENANCE_MISSING:${destinationId}`);
    }catch(error){issues.push(`DESTINATION_RESOLUTION_FAILURE:${destinationId}:${error?.message||error}`);}
  }
  return freeze({contractId:STEP9_REGIONAL_BRIDGE_ID,status:issues.length?'FAIL':'PASS',issues,destinationCount:Object.keys(STEP9_DESTINATION_BINDINGS).length,geographyAuthority:'AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1',nighttimePresentationOwnedByCharacters:true,terrainEquationsOwnedByCharacters:false,shorelineCoordinatesOwnedByCharacters:false,canonicalGeographyReadOnly:true,safeInteriorPresentation:true,scenesConstructed:false,gameplayConstructed:false});
}

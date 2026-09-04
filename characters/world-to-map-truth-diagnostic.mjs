import {
  GRATITUDE_DEVELOPMENT_ANCHOR_SPECS,
  GRATITUDE_DEVELOPMENT_FRAME,
  GRATITUDE_GEOGRAPHY_ADAPTER_ID,
  mapToWorld,
  resolveCoastlinePolyline,
  resolveMapSiteAnchor,
  worldToMap
} from './gratitude-geography.adapter.mjs';

const freeze=(value,seen=new WeakSet())=>{
  if(value===null||typeof value!=='object'||Object.isFrozen(value)||seen.has(value))return value;
  seen.add(value);for(const nested of Object.values(value))freeze(nested,seen);return Object.freeze(value);
};

export const WORLD_TO_MAP_TRUTH_DIAGNOSTIC_ID='MIRRORLAND_WORLD_TO_MAP_TRUTH_DIAGNOSTIC_v1';

export function buildWorldToMapTruthDiagnosticData({shorelineSampleCount=65}={}){
  const markers=Object.keys(GRATITUDE_DEVELOPMENT_ANCHOR_SPECS).map((siteId)=>{
    const resolved=resolveMapSiteAnchor(siteId);
    const inverse=mapToWorld(resolved.map);
    return freeze({
      siteId,
      kind:GRATITUDE_DEVELOPMENT_ANCHOR_SPECS[siteId].kind,
      world:resolved.world,
      map:resolved.map,
      inverse:{x:inverse.x,z:inverse.z},
      projectionSource:'resolveMapSiteAnchor -> worldToMap'
    });
  });
  const coastline=resolveCoastlinePolyline({sampleCount:shorelineSampleCount});
  const shoreline=coastline.points.map((point)=>freeze({
    ordinal:point.ordinal,
    world:point.world,
    map:point.map,
    projectionSource:'resolveCoastlinePolyline -> worldToMap'
  }));
  const orientationProbe=freeze({
    origin:worldToMap({x:0,z:0}),
    east:worldToMap({x:1,z:0}),
    north:worldToMap({x:0,z:-1}),
    declared:GRATITUDE_DEVELOPMENT_FRAME.mapFrame
  });
  return freeze({
    schema:'MIRRORLAND_WORLD_TO_MAP_TRUTH_DIAGNOSTIC_DATA_v1',
    diagnosticId:WORLD_TO_MAP_TRUTH_DIAGNOSTIC_ID,
    adapterId:GRATITUDE_GEOGRAPHY_ADAPTER_ID,
    frameId:GRATITUDE_DEVELOPMENT_FRAME.frameId,
    worldIdentity:GRATITUDE_DEVELOPMENT_FRAME.worldIdentity,
    continentIdentity:GRATITUDE_DEVELOPMENT_FRAME.continentIdentity,
    regionIdentity:GRATITUDE_DEVELOPMENT_FRAME.regionIdentity,
    transform:'worldToMap/mapToWorld',
    frame:GRATITUDE_DEVELOPMENT_FRAME,
    markerCount:markers.length,
    markers,
    shorelineSampleCount:shoreline.length,
    shoreline,
    orientationProbe,
    handPositionedMarkerCoordinates:false,
    independentShorelineIllustration:false
  });
}

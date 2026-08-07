import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION
} from '../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js';

const freeze=(v)=>Object.freeze(v);

export function buildHEarthMapWideEnvironmentPreviewObserverReceipt(renderer){
  const snapshot=renderer.getSnapshot();
  const planet=snapshot.planetStatistics;
  const gratitude=snapshot.gratitudeStatistics;
  const water=snapshot.waterStatistics;
  const camera=renderer.getCameraSafety();
  const checks={
    revision7TerrainSourceStillPasses:H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION.eligible===true,
    audraliaPlanetInspectable:planet?.closedPlanetarySurface===true,
    planetHasNoRectangularWorldBorder:planet?.planetBordersRectangular===false,
    exactlyNineContinents:planet?.continentCount===9,
    gratitudeOnlyResolvedContinent:planet?.gratitudeResolved===true&&planet?.unresolvedContinentCount===8,
    otherContinentsRemainNoncanonical:planet?.otherContinentsPlacementsCanonical===false,
    gratitudeNineSummitsTrackPresent:planet?.gratitudeSummitAnchorCount===9,
    gratitudeHighResolutionRegionRetained:gratitude?.gratitudeHighResolution===true&&gratitude?.revision7TerrainSourcePreserved===true,
    gratitudeDisplayRefinementsPresent:gratitude?.displayMountainStaggering===true&&gratitude?.brokenSandbarPresentation===true&&gratitude?.organicCoastalColorTransition===true,
    localWaterContextPresent:water?.oceanTriangleCount>0&&water?.reservoirTriangleCount>0&&water?.waterfallTriangleCount>0,
    planetAndGratitudeModesAvailable:typeof renderer.setMode==='function'&&typeof renderer.toggleMode==='function',
    cameraContractSafe:Object.values(camera).every(Boolean),
    manorGeometryConstructed:false,
    liveRuntimeMutated:false,
    liveCameraMutated:false,
    liveNavigationMutated:false,
    liveWaterMutated:false
  };
  const falseRequired=new Set(['manorGeometryConstructed','liveRuntimeMutated','liveCameraMutated','liveNavigationMutated','liveWaterMutated']);
  const result=Object.entries(checks).every(([k,v])=>falseRequired.has(k)?v===false:v===true)?'PASS':'FAIL_CLOSED';
  return freeze({
    schema:'AUDRALIA_NINE_CONTINENT_H_EARTH_GRATITUDE_PREVIEW_OBSERVER_RECEIPT_v1',
    result,
    operationId:'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_v1',
    inspectorRepairRevision:9,
    planetIdentity:'AUDRALIA',
    hEarthClass:'PLAYER_EXPERIENCE_ON_AUDRALIA',
    resolvedContinent:'GRATITUDE',
    continentCount:9,
    gratitudeSummitTrackCount:9,
    checks:freeze(checks),
    snapshot,
    boundaries:freeze({authoringPreviewOnly:true,userDifferentialRecorded:false,role5RatifiedForSuccessor:false,liveIntegrationAuthorized:false,mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false})
  });
}

export default buildHEarthMapWideEnvironmentPreviewObserverReceipt;

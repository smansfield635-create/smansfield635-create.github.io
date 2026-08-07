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
  const contract=snapshot.worldContract;
  const checks={
    revision7TerrainSourceStillPasses:H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION.eligible===true,
    continuousAudraliaWorldModel:contract?.schema==='AUDRALIA_CONTINUOUS_MULTISCALE_WORLD_MODEL_v1',
    authoringRegionNoLongerWorldBoundary:snapshot.authoringRegionIsWorldBoundary===false&&contract?.authoringRegionIsWorldBoundary===false,
    exactGratitudeScalePreserved:gratitude?.localScaleCompressed===false&&gratitude?.localArcScaleOneToOne===true&&gratitude?.localWidthAuthoringUnits===512&&gratitude?.localDepthAuthoringUnits===384,
    gratitudeDetailTileHasNoVisibleRectangle:gratitude?.rectangularBoundaryVisible===false&&gratitude?.detailEdgeFeatherAuthoringUnits>0,
    audraliaPlanetInspectable:planet?.closedPlanetarySurface===true,
    planetHasNoRectangularWorldBorder:planet?.planetBordersRectangular===false,
    wholePlanetFitNotRequired:planet?.wholePlanetMustFitViewport===false&&snapshot.wholePlanetMustFitViewport===false,
    exactlyNineContinents:planet?.continentCount===9,
    gratitudeOnlyResolvedContinent:planet?.gratitudeResolved===true&&planet?.unresolvedContinentCount===8,
    otherContinentsRemainNoncanonical:planet?.otherContinentsPlacementsCanonical===false,
    gratitudeNineSummitsTrackPresent:planet?.gratitudeSummitAnchorCount===9,
    continuousFourScaleHierarchy:Array.isArray(contract?.continuousZoomHierarchy)&&contract.continuousZoomHierarchy.join('|')==='LOCAL|REGION|CONTINENT|PLANETARY',
    localWaterCurvesWithPlanet:water?.curvedToPlanetSurface===true&&water?.oceanTriangleCount>0&&water?.reservoirTriangleCount>0&&water?.waterfallTriangleCount>0,
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
    schema:'AUDRALIA_CONTINUOUS_MULTISCALE_GRATITUDE_WORLD_PREVIEW_OBSERVER_RECEIPT_v1',
    result,
    operationId:'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_v1',
    inspectorRepairRevision:10,
    planetIdentity:'AUDRALIA',
    hEarthClass:'PLAYER_EXPERIENCE_ON_AUDRALIA',
    resolvedContinent:'GRATITUDE',
    continentCount:9,
    gratitudeSummitTrackCount:9,
    hierarchy:freeze(['AUDRALIA','GRATITUDE_CONTINENT','GRATITUDE_REGION','HIGH_RESOLUTION_LOCAL_TERRAIN']),
    checks:freeze(checks),
    snapshot,
    boundaries:freeze({authoringPreviewOnly:true,userDifferentialRecorded:false,role5RatifiedForSuccessor:false,liveIntegrationAuthorized:false,frontPageIntegrationAuthorized:false,mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false})
  });
}

export default buildHEarthMapWideEnvironmentPreviewObserverReceipt;

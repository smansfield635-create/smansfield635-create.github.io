import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION
} from '../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js';

const freeze = (value) => Object.freeze(value);
const REQUIRED_OPERATION = 'H_EARTH_AUDRALIA_OPEN_WORLD_SPATIAL_MIGRATION_v1';
const REQUIRED_HEAD = 'c50d0a06a73ed149286508a15e697d8efa254865';
const REQUIRED_SOURCE = 'ad9e72adb97df7ab867af1fe20df2c29de763d28';

export function buildHEarthMapWideEnvironmentPreviewObserverReceipt(renderer) {
  const snapshot = renderer.getSnapshot();
  const planet = snapshot.planetStatistics;
  const gratitude = snapshot.gratitudeStatistics;
  const water = snapshot.waterStatistics;
  const camera = renderer.getCameraSafety();
  const contract = snapshot.worldContract;
  const geography = renderer.getOW01GeographicEvidence();

  const checks = {
    sourceTerrainEvaluationStillPasses:
      H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION.eligible === true,
    exactOW01Operation:
      contract?.operationId === REQUIRED_OPERATION &&
      contract?.checkpoint === 'OW01' &&
      contract?.lockGeneration === 473,
    exactGoverningHead:
      contract?.governingHead === REQUIRED_HEAD &&
      geography?.governingHead === REQUIRED_HEAD,
    immutableRevision10Lineage:
      contract?.immutableMigrationSource === REQUIRED_SOURCE &&
      geography?.revision10Source === REQUIRED_SOURCE,
    continuousAudraliaWorldModel:
      contract?.schema === 'AUDRALIA_CONTINUOUS_MULTISCALE_WORLD_MODEL_v1',
    authoringRegionNoLongerWorldBoundary:
      snapshot.authoringRegionIsWorldBoundary === false &&
      contract?.authoringRegionIsWorldBoundary === false,
    exactGratitudeScalePreserved:
      gratitude?.localScaleCompressed === false &&
      gratitude?.localArcScaleOneToOne === true &&
      gratitude?.localWidthAuthoringUnits === 512 &&
      gratitude?.localDepthAuthoringUnits === 384 &&
      geography?.fullScaleLocalGratitudePreserved === true,
    trueCoastalHarborBinding:
      contract?.trueCoastalHarborBinding === true &&
      planet?.trueCoastalHarborBinding === true &&
      gratitude?.trueCoastalHarborBinding === true &&
      geography?.trueCoastalHarborBinding === true &&
      geography?.maximumCoastalBindingError < 1e-9 &&
      geography?.coastalBindingSampleCount >= 7,
    geometricBoundaryStitchConstructed:
      contract?.localMacroTransition === 'GEOMETRIC_STITCH_TO_SHARED_CONTINENTAL_SURFACE' &&
      contract?.geometricStitchWidthAuthoringUnits >= 64 &&
      gratitude?.geometricStitchWidthAuthoringUnits >= 64 &&
      gratitude?.boundaryPositionConvergesToMacro === true &&
      gratitude?.boundaryElevationMaximumError < 1e-9 &&
      geography?.geometricStitchConstructed === true &&
      geography?.detailBoundaryConvergesToMacro === true &&
      geography?.maximumBoundaryElevationError < 1e-9 &&
      geography?.planetSupportTracksLocalDetail === true,
    singleSurfaceOceanReconciled:
      contract?.planetaryOceanSingleSurface === true &&
      contract?.localOceanOverlayConstructed === false &&
      gratitude?.singleSurfaceOceanUsesPlanetaryMesh === true &&
      gratitude?.localOceanOverlayConstructed === false &&
      water?.planetaryOceanSingleSurface === true &&
      water?.localOceanOverlayConstructed === false &&
      water?.oceanTriangleCount === 0 &&
      geography?.planetaryOceanSingleSurface === true &&
      geography?.localOceanOverlayConstructed === false,
    gratitudeContinentalSkeletonAsymmetric:
      contract?.gratitudeContinentalSkeleton === 'ASYMMETRIC_COMPOUND_TANGENT_FIELD' &&
      planet?.gratitudeSkeletonAsymmetric === true &&
      geography?.gratitudeSkeletonAsymmetric === true,
    primaryInlandAxesBound:
      contract?.primaryInlandMountainWatershedAxes === true &&
      planet?.primaryInlandMountainWatershedAxes === true &&
      planet?.primaryInlandAxisCount === 3 &&
      geography?.primaryInlandAxisCount === 3,
    ow02ScopeNotLeaked:
      contract?.ow02DetailedContinuationConstructed === false &&
      planet?.ow02DetailedContinuationConstructed === false &&
      geography?.ow02DetailedContinuationConstructed === false,
    detailBoundaryDoesNotDefineWorld:
      gratitude?.rectangularBoundaryVisible === false &&
      gratitude?.authoringRegionIsWorldBoundary === false,
    audraliaPlanetInspectable:
      planet?.closedPlanetarySurface === true,
    planetHasNoRectangularWorldBorder:
      planet?.planetBordersRectangular === false,
    wholePlanetFitNotRequired:
      planet?.wholePlanetMustFitViewport === false &&
      snapshot.wholePlanetMustFitViewport === false,
    exactlyNineContinentsDefined:
      planet?.definedContinentCount === 9 &&
      planet?.unresolvedContinentCount === 8 &&
      planet?.gratitudeResolved === true,
    otherContinentsRemainNoncanonical:
      planet?.otherContinentsPlacementsCanonical === false &&
      contract?.otherContinentsPlacementsCanonical === false &&
      geography?.otherEightContinentsRemainNoncanonical === true,
    gratitudeNineSummitsTrackPresent:
      planet?.gratitudeSummitAnchorCount === 9 &&
      contract?.gratitudeSummitAnchorCount === 9,
    continuousFourScaleHierarchy:
      Array.isArray(contract?.continuousZoomHierarchy) &&
      contract.continuousZoomHierarchy.join('|') === 'LOCAL|REGION|CONTINENT|PLANETARY',
    localHydrologyStillCurvesWithPlanet:
      water?.curvedToPlanetSurface === true &&
      water?.reservoirTriangleCount > 0 &&
      water?.waterfallTriangleCount > 0,
    cameraContractSafe:
      Object.values(camera).every(Boolean),
    manorGeometryUnconstructed:
      snapshot.manorGeometryConstructed === false,
    liveRuntimeUnmutated:
      snapshot.liveRuntimeMutated === false,
    liveCameraUnmutated:
      snapshot.liveCameraMutated === false,
    liveNavigationUnmutated:
      snapshot.liveNavigationMutated === false,
    liveWaterUnmutated:
      snapshot.liveWaterMutated === false
  };

  const failedChecks = Object.entries(checks)
    .filter(([, value]) => value !== true)
    .map(([name]) => name);
  const result = failedChecks.length === 0 ? 'PASS' : 'FAIL_CLOSED';

  return freeze({
    schema: 'AUDRALIA_CONTINUOUS_MULTISCALE_GRATITUDE_WORLD_PREVIEW_OBSERVER_RECEIPT_v3',
    result,
    operationId: REQUIRED_OPERATION,
    checkpoint: 'OW01',
    lockGeneration: 473,
    governingHead: REQUIRED_HEAD,
    immutableRevision10Source: REQUIRED_SOURCE,
    planetIdentity: 'AUDRALIA',
    hEarthClass: 'PLAYER_EXPERIENCE_ON_AUDRALIA',
    resolvedContinent: 'GRATITUDE',
    continentCount: 9,
    gratitudeSummitTrackCount: 9,
    hierarchy: freeze(['AUDRALIA', 'GRATITUDE_CONTINENT', 'GRATITUDE_REGION', 'HIGH_RESOLUTION_LOCAL_TERRAIN']),
    checks: freeze(checks),
    failedChecks: freeze(failedChecks),
    geographicEvidence: geography,
    snapshot,
    boundaries: freeze({
      authoringPreviewOnly: true,
      userGeographicDifferentialRecorded: true,
      userDifferentialDisposition: 'MATERIAL_DIRECTIONAL_SUCCESS_WITH_BOUNDARY_CONTAMINATION_REPAIR_REQUIRED',
      repairRound: 'OW01_GEOMETRIC_STITCH_AND_SINGLE_SURFACE_WATER_RECONCILIATION',
      ow02Authorized: false,
      liveIntegrationAuthorized: false,
      frontPageIntegrationAuthorized: false,
      mergeAuthorized: false,
      deploymentAuthorized: false,
      releaseAuthorized: false
    })
  });
}

export default buildHEarthMapWideEnvironmentPreviewObserverReceipt;

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
  const continent = snapshot.continentStatistics;
  const gratitude = snapshot.gratitudeStatistics;
  const stitch = snapshot.stitchStatistics;
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
      gratitude?.trueCoastalHarborBinding === true &&
      geography?.trueCoastalHarborBinding === true &&
      geography?.maximumCoastalBindingError < 1e-9 &&
      geography?.coastalBindingSampleCount === 7,
    deliberateClosedCoastlineConstructed:
      contract?.gratitudeContinentalSkeleton === 'DELIBERATE_CLOSED_COASTLINE_CONTOUR_V1' &&
      contract?.gratitudeCoastlineIsUnionOfEllipses === false &&
      continent?.coastlineRepresentation === 'DELIBERATE_CLOSED_COASTLINE_CONTOUR_V1' &&
      continent?.coastlineUnionOfEllipses === false &&
      continent?.coastlineControlPointCount >= 30 &&
      continent?.coastlineSampleCount >= 180 &&
      geography?.coastlineRepresentation === 'DELIBERATE_CLOSED_COASTLINE_CONTOUR_V1' &&
      geography?.coastlineUnionOfEllipses === false &&
      geography?.coastlinePlanarArea > 1000000 &&
      geography?.coastlinePlanarPerimeter > 4000,
    planetaryGratitudeLandRemoved:
      contract?.planetaryGratitudeLandRemoved === true &&
      planet?.planetaryGratitudeLandRemoved === true &&
      planet?.planetaryGratitudeLandVertices === 0 &&
      geography?.planetaryGratitudeLandRemoved === true,
    separateContinentalMeshConstructed:
      contract?.gratitudeContinentalMeshSeparate === true &&
      continent?.continentalMeshSeparateFromPlanetaryBase === true &&
      continent?.triangleCount > 0 &&
      geography?.gratitudeContinentalMeshSeparate === true,
    continentalApertureClear:
      contract?.continentalApertureConstructed === true &&
      continent?.continentalApertureConstructed === true &&
      continent?.apertureClear === true &&
      continent?.apertureIntrusionTriangleCount === 0 &&
      geography?.continentalApertureConstructed === true &&
      geography?.continentalApertureClear === true &&
      geography?.continentalApertureIntrusionTriangleCount === 0,
    boundedExplicitStitchAnnulus:
      contract?.localMacroTransition === 'EXPLICIT_APERTURE_PLUS_SHARED_STITCH_ANNULUS' &&
      contract?.stitchWidthAuthoringUnits === 96 &&
      stitch?.explicitAnnulusConstructed === true &&
      stitch?.separateMesh === true &&
      stitch?.triangleCount > 0 &&
      stitch?.boundedTriangleEdges === true &&
      stitch?.maximumTriangleEdgeLength <= 80 &&
      stitch?.localBoundarySharedGeometrically === true &&
      stitch?.maximumLocalBoundaryPositionError < 1e-6 &&
      stitch?.outerBoundaryConvergesToMacro === true &&
      stitch?.maximumOuterBoundaryMacroElevationError < 1e-9 &&
      geography?.explicitStitchAnnulusConstructed === true &&
      geography?.stitchTrianglesBounded === true &&
      geography?.stitchMaximumTriangleEdgeLength <= 80 &&
      geography?.stitchLocalBoundarySharedGeometrically === true &&
      geography?.stitchOuterBoundaryConvergesToMacro === true,
    localTerrainTopologyClippedAtCoastline:
      contract?.localTerrainTopologyClippedAtCoastline === true &&
      gratitude?.topologyClippedAtCoastline === true &&
      gratitude?.transparentTerrainTriangleCount === 0 &&
      gratitude?.renderedTerrainTriangles > 0 &&
      gratitude?.omittedOceanTriangles > 0 &&
      geography?.localTerrainTopologyClippedAtCoastline === true &&
      geography?.localTransparentTerrainTriangleCount === 0,
    singleSurfaceOceanReconciled:
      contract?.planetaryOceanSingleSurface === true &&
      contract?.localOceanOverlayConstructed === false &&
      planet?.planetaryOceanSingleSurface === true &&
      gratitude?.singleSurfaceOceanUsesPlanetaryMesh === true &&
      gratitude?.localOceanOverlayConstructed === false &&
      water?.planetaryOceanSingleSurface === true &&
      water?.localOceanOverlayConstructed === false &&
      water?.oceanTriangleCount === 0 &&
      geography?.planetaryOceanSingleSurface === true &&
      geography?.localOceanOverlayConstructed === false,
    primaryInlandAxesBound:
      contract?.primaryInlandMountainWatershedAxes === true &&
      continent?.primaryInlandMountainWatershedAxes === true &&
      continent?.primaryInlandAxisCount === 3 &&
      geography?.primaryInlandAxisCount === 3,
    ow02ScopeNotLeaked:
      contract?.ow02DetailedContinuationConstructed === false &&
      continent?.ow02DetailedContinuationConstructed === false &&
      geography?.ow02DetailedContinuationConstructed === false,
    audraliaPlanetInspectable:
      planet?.closedPlanetarySurface === true,
    planetHasNoRectangularWorldBorder:
      planet?.planetBordersRectangular === false,
    wholePlanetFitNotRequired:
      planet?.wholePlanetMustFitViewport === false &&
      snapshot.wholePlanetMustFitViewport === false,
    exactlyNineContinentsDefined:
      planet?.definedContinentCount === 9 &&
      contract?.continentCount === 9 &&
      contract?.unresolvedContinentCount === 8,
    otherContinentsRemainNoncanonical:
      planet?.otherContinentsPlacementsCanonical === false &&
      contract?.otherContinentsPlacementsCanonical === false &&
      geography?.otherEightContinentsRemainNoncanonical === true,
    gratitudeNineSummitsTrackPresent:
      continent?.gratitudeSummitAnchorCount === 9 &&
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
    mechanicalPassCannotClaimUserAcceptance:
      contract?.mechanicalPassIsNotUserAcceptance === true &&
      geography?.mechanicalPassIsNotUserAcceptance === true,
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
  const mechanicalChecksPassed = failedChecks.length === 0;

  return freeze({
    schema: 'AUDRALIA_CONTINUOUS_MULTISCALE_GRATITUDE_WORLD_PREVIEW_OBSERVER_RECEIPT_v4',
    result: mechanicalChecksPassed ? 'MECHANICAL_PASS_AWAITING_USER' : 'FAIL_CLOSED',
    mechanicalChecksPassed,
    userAcceptanceEstablished: false,
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
    hierarchy: freeze(['AUDRALIA', 'GRATITUDE_CONTINENT', 'STITCH_ANNULUS', 'HIGH_RESOLUTION_LOCAL_TERRAIN']),
    checks: freeze(checks),
    failedChecks: freeze(failedChecks),
    geographicEvidence: geography,
    snapshot,
    boundaries: freeze({
      authoringPreviewOnly: true,
      userGeographicDifferentialRecorded: true,
      latestUserDifferentialDisposition: 'REGRESSION_ARCHITECTURE_RESET_ACTIVE',
      userAcceptanceEstablished: false,
      repairRound: 'OW01_SEPARATE_CONTINENT_APERTURE_AND_STITCH_ANNULUS',
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

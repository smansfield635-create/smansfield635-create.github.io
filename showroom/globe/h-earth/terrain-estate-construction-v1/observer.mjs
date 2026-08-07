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
  const beach = snapshot.beachStatistics;
  const water = snapshot.waterStatistics;
  const camera = renderer.getCameraSafety();
  const contract = snapshot.worldContract;
  const geography = renderer.getOW01GeographicEvidence();
  const relief = continent?.reliefStatistics;

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
      continent?.coastlineSampleCount >= 600 &&
      geography?.coastlineRepresentation === 'DELIBERATE_CLOSED_COASTLINE_CONTOUR_V1' &&
      geography?.coastlineUnionOfEllipses === false &&
      geography?.coastlinePlanarArea > 1000000 &&
      geography?.coastlinePlanarPerimeter > 4000,

    coastlineSubcellClippingConstructed:
      contract?.coastlineTopology === 'SUBCELL_SCALAR_FIELD_CLIPPED' &&
      continent?.coastlineTopology === 'SUBCELL_SCALAR_FIELD_CLIPPED' &&
      continent?.coastlineClipTriangleCount > 0 &&
      gratitude?.coastlineTopology === 'SUBCELL_SCALAR_FIELD_CLIPPED' &&
      gratitude?.clippedCoastlineTriangleCount > 0 &&
      geography?.coastlineTopology === 'SUBCELL_SCALAR_FIELD_CLIPPED' &&
      geography?.localCoastlineClipTriangleCount > 0,

    continuousCoastalRibbonConstructed:
      contract?.coastalRibbonReconstructed === true &&
      contract?.coastalRibbonLandwardEdgeContinuous === true &&
      beach?.coastalRibbonConstructed === true &&
      beach?.landwardEdgeContinuous === true &&
      beach?.seawardEdgeContinuous === true &&
      beach?.sharesHarborShorelineFunction === true &&
      beach?.segmentCount >= 300 &&
      beach?.lateralLayerCount >= 6 &&
      geography?.coastalRibbonConstructed === true &&
      geography?.coastalRibbonLandwardEdgeContinuous === true,

    diverseSandbarFieldConstructed:
      contract?.previewSandbarDiversityConstructed === true &&
      gratitude?.previewSandbarDiversityConstructed === true &&
      gratitude?.previewSandbarCount >= 12 &&
      geography?.previewSandbarDiversityConstructed === true &&
      geography?.previewSandbarCount >= 12,

    unresolvedContinentsRemainNoncanonicalButReadable:
      contract?.unresolvedContinentPresentationNoncanonical === true &&
      contract?.unresolvedContinentPresentation === 'ANISOTROPIC_WARPED_CONTOUR_PREVIEW' &&
      planet?.unresolvedContinentPresentation === 'ANISOTROPIC_WARPED_CONTOUR_PREVIEW' &&
      geography?.unresolvedContinentPresentation === 'ANISOTROPIC_WARPED_CONTOUR_PREVIEW' &&
      planet?.otherContinentsPlacementsCanonical === false &&
      contract?.otherContinentsPlacementsCanonical === false,

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

    alignedBoundedStitchAnnulus:
      contract?.localMacroTransition === 'ALIGNED_APERTURE_PLUS_SCALAR_CLIPPED_STITCH_ANNULUS' &&
      contract?.stitchWidthAuthoringUnits === 128 &&
      stitch?.explicitAnnulusConstructed === true &&
      stitch?.separateMesh === true &&
      stitch?.alignedRectangularGrid === true &&
      stitch?.scalarFieldCoastlineClipping === true &&
      stitch?.triangleCount > 0 &&
      stitch?.boundedTriangleEdges === true &&
      stitch?.maximumTriangleEdgeLength <= 40 &&
      stitch?.localBoundarySharedGeometrically === true &&
      stitch?.maximumLocalBoundaryPositionError < 1e-6 &&
      stitch?.outerBoundaryConvergesToMacro === true &&
      stitch?.maximumOuterBoundaryMacroElevationError < 1e-9 &&
      geography?.explicitStitchAnnulusConstructed === true &&
      geography?.stitchGridAligned === true &&
      geography?.stitchScalarFieldCoastlineClipping === true &&
      geography?.stitchTrianglesBounded === true &&
      geography?.stitchMaximumTriangleEdgeLength <= 40 &&
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

    localReliefNormalizationIsPreviewOnly:
      contract?.localPreviewReliefNormalizationApplied === true &&
      contract?.sourceTerrainMutation === false &&
      gratitude?.localPreviewReliefNormalizationApplied === true &&
      gratitude?.sourceTerrainMutation === false &&
      geography?.localPreviewReliefNormalizationApplied === true &&
      geography?.sourceTerrainMutation === false,

    continentalReliefHierarchyNormalized:
      contract?.continentalReliefHierarchy === 'COASTAL_PLAIN_INTERIOR_LOWLAND_BASIN_UPLAND_PLATEAU_DIVIDE_LOCALIZED_MOUNTAIN' &&
      contract?.mountainCoverageBounded === true &&
      continent?.continentalReliefHierarchy === 'COASTAL_PLAIN_INTERIOR_LOWLAND_BASIN_UPLAND_PLATEAU_DIVIDE_LOCALIZED_MOUNTAIN' &&
      relief?.lowlandMajority === true &&
      relief?.mountainCoverageBounded === true &&
      geography?.continentalReliefHierarchy === 'COASTAL_PLAIN_INTERIOR_LOWLAND_BASIN_UPLAND_PLATEAU_DIVIDE_LOCALIZED_MOUNTAIN' &&
      geography?.reliefLowlandMajority === true &&
      geography?.reliefMountainCoverageBounded === true,

    climateReadinessWithoutOW02Leak:
      contract?.climateReadyReliefHierarchy === true &&
      contract?.detailedClimateModelConstructed === false &&
      continent?.detailedClimateModelConstructed === false &&
      geography?.climateReadyReliefHierarchy === true &&
      geography?.detailedClimateModelConstructed === false &&
      contract?.ow02DetailedContinuationConstructed === false &&
      continent?.ow02DetailedContinuationConstructed === false &&
      geography?.ow02DetailedContinuationConstructed === false,

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
    schema: 'AUDRALIA_CONTINUOUS_MULTISCALE_GRATITUDE_WORLD_PREVIEW_OBSERVER_RECEIPT_v6',
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
    hierarchy: freeze([
      'AUDRALIA',
      'GRATITUDE_CONTINENT',
      'ALIGNED_STITCH_ANNULUS',
      'CONTINUOUS_COASTAL_RIBBON',
      'HIGH_RESOLUTION_LOCAL_TERRAIN'
    ]),
    checks: freeze(checks),
    failedChecks: freeze(failedChecks),
    geographicEvidence: geography,
    snapshot,
    boundaries: freeze({
      authoringPreviewOnly: true,
      userGeographicDifferentialRecorded: true,
      latestUserDifferentialDisposition:
        'MATERIAL_WORLD_CONTINUITY_SUCCESS_WITH_BOUNDED_COASTAL_AND_CONTINENT_REFINEMENT_REQUIRED',
      userAcceptanceEstablished: false,
      repairRound:
        'OW01_COASTAL_RIBBON_SANDBAR_DIVERSITY_AND_NONCANONICAL_CONTINENT_REFINEMENT',
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

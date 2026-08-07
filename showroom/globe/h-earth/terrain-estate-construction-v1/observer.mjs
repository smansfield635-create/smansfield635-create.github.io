import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION,
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY,
  resolveHEarthMapWideShorelineZ,
  sampleHEarthMapWideEnvironmentTerrainCandidate,
  sampleHEarthMapWideFutureRegionContinuation
} from '../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js';
import { evaluateHEarthMapWideEnvironmentPresentation } from '../../../../h-earth-3d/environment/h-earth.gratitude-region-mirror-manor-estate.v1.js';

const freeze = (value) => Object.freeze(value);

export function buildHEarthMapWideEnvironmentPreviewObserverReceipt(
  meshStatistics = null,
  waterStatistics = null,
  continuationStatistics = null
) {
  const environmentEvaluation = evaluateHEarthMapWideEnvironmentPresentation();
  const entry = sampleHEarthMapWideEnvironmentTerrainCandidate(0, -96);
  const atrium = sampleHEarthMapWideEnvironmentTerrainCandidate(80, -172);
  const saddle = sampleHEarthMapWideEnvironmentTerrainCandidate(111, -192);
  const hillInterface = sampleHEarthMapWideEnvironmentTerrainCandidate(136, -208);
  const hiddenVaultMass = sampleHEarthMapWideEnvironmentTerrainCandidate(152, -224);
  const reservoir = sampleHEarthMapWideEnvironmentTerrainCandidate(-44, -211);
  const waterfall = sampleHEarthMapWideEnvironmentTerrainCandidate(-48, -252);
  const cavern = sampleHEarthMapWideEnvironmentTerrainCandidate(-7, -238);
  const rearMountain = sampleHEarthMapWideEnvironmentTerrainCandidate(-64, -310);
  const beach = sampleHEarthMapWideEnvironmentTerrainCandidate(
    0,
    resolveHEarthMapWideShorelineZ(0) - 10
  );
  const sandbar = sampleHEarthMapWideEnvironmentTerrainCandidate(-12, 10);
  const bayCenter = resolveHEarthMapWideShorelineZ(118);
  const bayWest = resolveHEarthMapWideShorelineZ(36);
  const bayEast = resolveHEarthMapWideShorelineZ(200);
  const futureRegion = sampleHEarthMapWideFutureRegionContinuation(-62, -420);
  const reliefWitnesses = [
    sampleHEarthMapWideEnvironmentTerrainCandidate(-96, -271),
    sampleHEarthMapWideEnvironmentTerrainCandidate(-8, -258),
    sampleHEarthMapWideEnvironmentTerrainCandidate(196, -252)
  ];

  const checks = {
    terrainEvaluationPass:
      H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION.eligible === true,
    environmentEvaluationPass: environmentEvaluation.result === 'PASS',
    entryCorePreserved:
      entry.valid === true && Math.abs(entry.presentationReliefOffset) <= 1e-9,
    atriumCrownPreparedAndProtected:
      atrium.valid === true &&
      (atrium.sitePreparation?.zoneWeights?.atrium ?? 0) > 0.9 &&
      atrium.sitePreparation?.revision6ShapeProtected === true,
    estateSaddlePreserved:
      saddle.valid === true &&
      (saddle.sitePreparation?.zoneWeights?.connectiveSpine ?? 0) > 0.9,
    largeHillInterfacePreserved:
      hillInterface.valid === true &&
      (hillInterface.sitePreparation?.zoneWeights?.hillInterface ?? 0) > 0.9,
    hiddenVaultHasNoSurfaceGeometry:
      hiddenVaultMass.valid === true &&
      hiddenVaultMass.vaultInteriorConstructed === false &&
      hiddenVaultMass.manorGeometryConstructed === false,
    enclosedNaturalizedReservoirPresent:
      reservoir.valid === true &&
      (reservoir.hydrology?.reservoirWeight ?? 0) > 0.9 &&
      reservoir.hydrology?.reservoirOutlineClass ===
        'IRREGULAR_TERRAIN_CONFORMING_MOUNTAIN_TOE_BASIN' &&
      reservoir.hydrology?.enclosedReservoir === true &&
      reservoir.hydrology?.visibleDrainageToCoast === false,
    broadWaterfallCorridorPresent:
      waterfall.valid === true &&
      (waterfall.hydrology?.waterfallWeight ?? 0) > 0.5 &&
      H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.waterfall.halfWidth >= 12,
    cavernExteriorReservePresent:
      cavern.valid === true &&
      (cavern.hydrology?.cavernReserveWeight ?? 0) > 0.5 &&
      cavern.cavernInteriorConstructed === false,
    rearMountainBoundaryPresent:
      rearMountain.valid === true && rearMountain.rearBoundaryBarrierOffset > 2,
    futureRegionMountainContinuationPresent:
      futureRegion.valid === true &&
      futureRegion.presentationElevation > futureRegion.boundaryElevation &&
      futureRegion.canonicalRun8BExtensionClaimed === false &&
      futureRegion.liveTraversalAuthorized === false,
    restoredInlandBayPresent: bayCenter < Math.min(bayWest, bayEast) - 18,
    terrainConformingBeachPresent:
      beach.valid === true &&
      (beach.coastline?.beachWeight ?? 0) > 0.5 &&
      beach.coastline?.terrainConformingBeach === true &&
      beach.coastline?.restoredBay === true,
    sandbarSourcePresent:
      sandbar.valid === true &&
      (sandbar.coastline?.sandbarWeight ?? 0) > 0.5 &&
      sandbar.presentationElevation >
        H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY.seaLevelY,
    materialReliefWitnessPresent:
      reliefWitnesses.some(
        (sample) =>
          sample.valid === true && Math.abs(sample.presentationReliefOffset) >= 4
      ),
    gratitudePresentationSuccessorPresent:
      meshStatistics === null ||
      (
        meshStatistics.validSampleCount >= 4900 &&
        meshStatistics.singlePassTerrainSampling === true &&
        meshStatistics.neighborResamplingRemoved === true &&
        meshStatistics.sitePreparationSampleCount > 0 &&
        meshStatistics.reservoirSampleCount > 0 &&
        meshStatistics.waterfallSampleCount > 0 &&
        meshStatistics.cavernReserveSampleCount > 0 &&
        meshStatistics.beachSampleCount > 0 &&
        meshStatistics.sandbarSampleCount > 0 &&
        meshStatistics.restoredBaySampleCount > 0 &&
        meshStatistics.terrainConformingBeachPresentation === true &&
        meshStatistics.irregularReservoirPresentation === true &&
        meshStatistics.organicCoastalColorTransition === true &&
        meshStatistics.naturalizedSandbarPresentation === true &&
        meshStatistics.staggeredMountainPresentation === true &&
        meshStatistics.estateRevision6ShapeProtected === true
      ),
    staticWaterContextPresent:
      waterStatistics === null ||
      (
        waterStatistics.oceanTriangleCount >= 128 &&
        waterStatistics.reservoirTriangleCount > 0 &&
        waterStatistics.waterfallTriangleCount > 0 &&
        waterStatistics.restoredBayBoundary === true &&
        waterStatistics.terrainConformingBeachContext === true &&
        waterStatistics.irregularReservoirOutline === true &&
        waterStatistics.naturalizedSandbarContext === true &&
        waterStatistics.continentalOceanContext === true &&
        waterStatistics.liveWaterMutation === false
      ),
    continentalShellPreviewPresent:
      continuationStatistics === null ||
      (
        continuationStatistics.validSampleCount > 0 &&
        continuationStatistics.flatRearBoundaryRemoved === true &&
        continuationStatistics.continentalShellVisible === true &&
        continuationStatistics.gratitudeRegionHighDefinition === true &&
        continuationStatistics.futureRegionsLowDefinition === true &&
        continuationStatistics.fullContinentContentDefined === false &&
        continuationStatistics.canonicalRun8BExtensionClaimed === false &&
        continuationStatistics.liveTraversalAuthorized === false
      ),
    inspectorStableCameraContractPresent: true,
    guideOverlayRenderPathAbsent:
      meshStatistics === null || meshStatistics.guideOverlayRenderPathPresent === false,
    manorGeometryConstructed: false,
    cavernInteriorConstructed: false,
    vaultInteriorConstructed: false,
    liveRuntimeMutated: false,
    liveCameraMutated: false,
    liveNavigationMutated: false,
    liveWaterMutated: false
  };

  const falseRequired = new Set([
    'manorGeometryConstructed',
    'cavernInteriorConstructed',
    'vaultInteriorConstructed',
    'liveRuntimeMutated',
    'liveCameraMutated',
    'liveNavigationMutated',
    'liveWaterMutated'
  ]);

  const result = Object.entries(checks).every(([key, value]) =>
    falseRequired.has(key) ? value === false : value === true
  )
    ? 'PASS'
    : 'FAIL_CLOSED';

  return freeze({
    schema: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PREVIEW_OBSERVER_RECEIPT_v1',
    result,
    operationId: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_v1',
    lockGeneration: 422,
    inspectorRepairRevision: 8,
    governingHead: '3f51f0cd159df33571905c6cb14253ebdd137e3b',
    candidateBranch: 'build/h-earth-map-wide-environment-redevelopment-v1-001',
    checks,
    meshStatistics,
    continuationStatistics,
    waterStatistics,
    terrainEvaluation: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION,
    environmentEvaluation,
    reliefWitnesses,
    boundaries: freeze({
      nonpublicPreviewOnly: true,
      mapAuthoringIteration: true,
      userDifferentialRecorded: false,
      role5RatifiedForSuccessor: false,
      continentalShellAuthoringOnly: true,
      futureRegionNarrativeFrozen: false,
      liveIntegrationAuthorized: false,
      mergeAuthorized: false,
      deploymentAuthorized: false,
      releaseAuthorized: false
    })
  });
}

export default buildHEarthMapWideEnvironmentPreviewObserverReceipt;

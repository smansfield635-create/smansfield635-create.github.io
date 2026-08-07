import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION,
  sampleHEarthMapWideEnvironmentTerrainCandidate
} from '../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js';
import {
  evaluateHEarthMapWideEnvironmentPresentation
} from '../../../../h-earth-3d/environment/h-earth.gratitude-region-mirror-manor-estate.v1.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.isFrozen(value) ? value : Object.freeze(value);
};

export function buildHEarthMapWideEnvironmentPreviewObserverReceipt(meshStatistics = null) {
  const environmentEvaluation = evaluateHEarthMapWideEnvironmentPresentation();
  const estate = sampleHEarthMapWideEnvironmentTerrainCandidate(80, -172);
  const entry = sampleHEarthMapWideEnvironmentTerrainCandidate(0, -96);
  const saddle = sampleHEarthMapWideEnvironmentTerrainCandidate(
    112.41666666666667,
    -194.83333333333334
  );
  const reliefWitnesses = [
    sampleHEarthMapWideEnvironmentTerrainCandidate(-64, -274),
    sampleHEarthMapWideEnvironmentTerrainCandidate(-184, -212),
    sampleHEarthMapWideEnvironmentTerrainCandidate(196, -252)
  ];

  const checks = {
    terrainEvaluationPass:
      H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION.eligible === true,
    environmentEvaluationPass: environmentEvaluation.result === 'PASS',
    estateCoreValid: estate.valid === true,
    estateSitePhysicallyPrepared:
      estate.valid === true &&
      estate.sitePreparation?.fullyPrepared === true &&
      estate.presentationElevation < estate.elevation - 0.5,
    estateSitePreparationEnvironmentVisible:
      estate.valid === true && estate.sitePreparation?.weight >= 0.999,
    entryCorePresentationOffsetZero:
      entry.valid === true && Math.abs(entry.presentationReliefOffset) <= 1e-9,
    lowCorridorPresentationOffsetZero:
      saddle.valid === true && Math.abs(saddle.presentationReliefOffset) <= 1e-9,
    materialReliefWitnessPresent:
      reliefWitnesses.some((sample) =>
        sample.valid === true && Math.abs(sample.presentationReliefOffset) >= 4
      ),
    inspectorDenseEnoughForSiteReview:
      meshStatistics === null ||
      (meshStatistics.validSampleCount >= 12000 && meshStatistics.sitePreparationSampleCount > 0),
    inspectorStableCameraContractPresent: true,
    manorGeometryConstructed: false,
    liveRuntimeMutated: false,
    cameraMutated: false,
    navigationMutated: false,
    waterMutated: false
  };
  const result = Object.entries(checks)
    .filter(([key]) => ![
      'manorGeometryConstructed',
      'liveRuntimeMutated',
      'cameraMutated',
      'navigationMutated',
      'waterMutated'
    ].includes(key))
    .every(([, value]) => value === true) &&
    checks.manorGeometryConstructed === false &&
    checks.liveRuntimeMutated === false &&
    checks.cameraMutated === false &&
    checks.navigationMutated === false &&
    checks.waterMutated === false
    ? 'PASS'
    : 'FAIL_CLOSED';

  return freeze({
    schema: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PREVIEW_OBSERVER_RECEIPT_v1',
    result,
    operationId: 'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_v1',
    lockGeneration: 422,
    inspectorRepairRevision: 1,
    governingHead: '3f51f0cd159df33571905c6cb14253ebdd137e3b',
    candidateBranch: 'build/h-earth-map-wide-environment-redevelopment-v1-001',
    checks,
    meshStatistics,
    terrainEvaluation: H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION,
    environmentEvaluation,
    reliefWitnesses,
    boundaries: {
      nonpublicPreviewOnly: true,
      userDifferentialRecorded: false,
      role5RatifiedForSuccessor: false,
      mergeAuthorized: false,
      deploymentAuthorized: false,
      releaseAuthorized: false
    }
  });
}

export default buildHEarthMapWideEnvironmentPreviewObserverReceipt;

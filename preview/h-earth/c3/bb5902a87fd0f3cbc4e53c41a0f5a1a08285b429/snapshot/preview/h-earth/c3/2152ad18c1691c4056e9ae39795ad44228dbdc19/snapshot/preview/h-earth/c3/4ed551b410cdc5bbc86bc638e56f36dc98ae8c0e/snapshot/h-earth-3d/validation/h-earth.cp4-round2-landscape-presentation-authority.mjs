import crypto from 'node:crypto';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import authority from '../control-plane/post-cp2-round2/h-earth.cp4-round2-landscape-presentation-authority.v1.mjs';
import repetitionMetric from '../control-plane/post-cp2-round2/h-earth.cp4-multiscale-directional-repetition-metric.v1.mjs';

const BASE_HEAD = 'a1d5c69f89450f37144d06a2c80f6490dc9c7b33';
const EXPECTED_PATHS = Object.freeze([
  '.github/workflows/h-earth-cp4-round2-landscape-presentation-authority.yml',
  'h-earth-3d/control-plane/post-cp2-round2/h-earth.cp4-multiscale-directional-repetition-metric.v1.mjs',
  'h-earth-3d/control-plane/post-cp2-round2/h-earth.cp4-round2-landscape-presentation-authority.v1.mjs',
  'h-earth-3d/validation/h-earth.cp4-round2-landscape-presentation-authority.mjs'
]);

const stable = (value) =>
  value === null || typeof value !== 'object'
    ? JSON.stringify(value)
    : Array.isArray(value)
      ? `[${value.map(stable).join(',')}]`
      : `{${Object.keys(value)
          .sort()
          .map((key) => `${JSON.stringify(key)}:${stable(value[key])}`)
          .join(',')}}`;
const digest = (value) => crypto.createHash('sha256').update(stable(value)).digest('hex');
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const sortedUnique = (values) => [...new Set(values)].sort();
const exact = (left, right) => stable(left) === stable(right);
const isDeepFrozen = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return true;
  seen.add(value);
  if (!Object.isFrozen(value)) return false;
  return Object.values(value).every((member) => isDeepFrozen(member, seen));
};

function executeOnce() {
  const issues = [];
  const head = git('rev-parse', 'HEAD');
  const changedPaths = sortedUnique(
    git('diff', '--name-only', `${BASE_HEAD}..HEAD`).split('\n').filter(Boolean)
  );

  if (!exact(changedPaths, EXPECTED_PATHS)) {
    issues.push(`EXACT_PATH_SCOPE_MISMATCH:${changedPaths.join(',')}`);
  }
  if (changedPaths.some((path) => path.startsWith('showroom/'))) {
    issues.push('PRODUCT_PATH_CHANGED_DURING_CP4');
  }
  if (!isDeepFrozen(authority)) issues.push('AUTHORITY_NOT_DEEPLY_FROZEN');
  if (!isDeepFrozen(repetitionMetric)) issues.push('REPETITION_METRIC_NOT_DEEPLY_FROZEN');

  if (authority.schemaVersion !== 'H_EARTH_CP4_ROUND_2_LANDSCAPE_PRESENTATION_AUTHORITY_v1') {
    issues.push('AUTHORITY_IDENTITY_MISMATCH');
  }
  if (authority.checkpoint !== 4 || authority.status !== 'AUTHORIZED_NOT_IMPLEMENTED') {
    issues.push('CHECKPOINT_STATE_MISMATCH');
  }
  if (authority.controllingBasis.mainHeadAtAuthorization !== BASE_HEAD) {
    issues.push('CONTROLLING_BASE_MISMATCH');
  }
  if (authority.controllingBasis.acceptedDefaultFrameHash !== 'fnv1a32:cbeeeabc') {
    issues.push('ACCEPTED_CP2_FRAME_IDENTITY_MISMATCH');
  }
  if (authority.acceptedRound1Evidence.lowDifferentiationSceneCount !== 2) {
    issues.push('ACCEPTED_CP2_LOW_DIFFERENTIATION_COUNT_MISMATCH');
  }
  if (
    authority.round2Hypothesis.primary !==
    'MULTISCALE_TERRAIN_NATURALISM_PLUS_ANTI_REPETITION_PLUS_TEMPORAL_STABILITY'
  ) {
    issues.push('ROUND2_PRIMARY_HYPOTHESIS_MISMATCH');
  }

  const target = authority.mutationAuthority.engineeringProductTarget;
  if (
    target.path !==
      'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round2-candidate.js' ||
    target.status !== 'NEW_ISOLATED_CANDIDATE_FILE_ONLY'
  ) {
    issues.push('ENGINEERING_PRODUCT_TARGET_MISMATCH');
  }
  if (
    target.sourceBasis !== authority.controllingBasis.acceptedRendererPath ||
    target.path === target.sourceBasis
  ) {
    issues.push('ACCEPTED_RENDERER_IMMUTABILITY_FAILURE');
  }
  if (authority.mutationAuthority.laterLiveAdmissionCondition !==
      'PROHIBITED_UNTIL_ROUND2_PASS_ENGINEERING_AND_SEPARATE_ADMISSION_AUTHORIZATION') {
    issues.push('LIVE_ADMISSION_BOUNDARY_MISMATCH');
  }

  const requiredFrozen = [
    'TERRAIN_COORDINATES',
    'HEIGHTFIELD',
    'WORLD_GEOMETRY',
    'CAMERA_STATES',
    'CAMERA_MATRICES',
    'NAVIGATION_LAW',
    'TOUCH_CLASSIFICATION',
    'GESTURE_BEHAVIOR',
    'VEGETATION_TOPOLOGY',
    'ACCEPTED_CP2_RENDERER_SOURCE',
    'CURRENT_LIVE_DEFAULT_SELECTION'
  ];
  for (const item of requiredFrozen) {
    if (!authority.frozenAuthorities.includes(item)) issues.push(`MISSING_FROZEN_AUTHORITY:${item}`);
  }

  const requiredProhibitions = [
    'CAMERA_ID_CONDITIONALS',
    'SCENE_ID_CONDITIONALS',
    'SCREENSHOT_SPECIFIC_OVERLAYS',
    'TARGET_NAME_VISUAL_HACKS',
    'ENGINE_MIGRATION',
    'NEW_WORLD_GEOMETRY',
    'HEIGHTFIELD_MUTATION'
  ];
  for (const item of requiredProhibitions) {
    if (!authority.prohibitedTechniques.includes(item)) issues.push(`MISSING_PROHIBITION:${item}`);
  }

  const gates = authority.engineeringGates;
  if (
    gates.maximumLowDifferentiationScenes !== 2 ||
    gates.minimumAggregateColorRatioVersusCp1 !== 1.782301 ||
    gates.minimumAggregateEdgeRatioVersusCp1 !== 2.902555 ||
    gates.minimumAcceptedCp2PerSceneRetention !== 0.9 ||
    gates.scene07MinimumColorBuckets !== 14 ||
    gates.scene07MinimumEdgeSignal !== 0.12563 ||
    gates.scene08MinimumEdgeSignal !== 0.2
  ) {
    issues.push('FIXED_VISUAL_GATE_MISMATCH');
  }
  if (
    gates.fixedCameraRepeatedFrameHashesMustMatch !== true ||
    gates.repeatedMotionReplayFrameSequenceMustMatch !== true ||
    gates.candidateP95PresentationResponseMaximumRelativeToCp2 !== 1.2 ||
    gates.candidateMedianPresentationResponseMaximumRelativeToCp2 !== 1.15 ||
    gates.webglContextLossCount !== 0
  ) {
    issues.push('TEMPORAL_OR_PERFORMANCE_GATE_MISMATCH');
  }

  if (
    repetitionMetric.status !== 'FIXED_BEFORE_ROUND2_CANDIDATE_EXECUTION' ||
    repetitionMetric.computation.direction !== 'LOWER_IS_BETTER' ||
    repetitionMetric.gates.candidateAggregateMaximumRelativeToAcceptedCp2 !== 0.85 ||
    repetitionMetric.gates.candidatePerSceneMaximumRelativeToAcceptedCp2 !== 1.05 ||
    repetitionMetric.gates.gateMayBeWeakenedAfterExecution !== false
  ) {
    issues.push('ANTI_REPETITION_GATE_NOT_FIXED');
  }
  if (
    repetitionMetric.computation.gaussianSigmasPixels.length !== 3 ||
    repetitionMetric.computation.orientationsDegrees.length !== 8 ||
    repetitionMetric.computation.lagsPixels.length !== 8
  ) {
    issues.push('ANTI_REPETITION_METRIC_DOMAIN_MISMATCH');
  }

  const boundary = authority.checkpointBoundary;
  if (
    boundary.productMutationPerformed !== false ||
    boundary.implementationAuthorizedAfterCp4Merge !== true ||
    boundary.liveCandidateAuthorized !== false ||
    boundary.liveDefaultPromotionAuthorized !== false ||
    boundary.userAcceptancePredetermined !== false ||
    boundary.nextCheckpoint !== 5
  ) {
    issues.push('CHECKPOINT_BOUNDARY_OVERREACH');
  }

  return Object.freeze({
    receiptType: 'H_EARTH_CP4_ROUND_2_LANDSCAPE_PRESENTATION_AUTHORITY_RECEIPT_v1',
    result: issues.length === 0 ? 'CP4_ROUND2_AUTHORITY_PASS_CLOSED' : 'CP4_ROUND2_AUTHORITY_FAIL_STOPPED',
    eligible: issues.length === 0,
    baseHead: BASE_HEAD,
    executedHead: head,
    changedPaths,
    exactPathScope: exact(changedPaths, EXPECTED_PATHS),
    productPathsChanged: changedPaths.some((path) => path.startsWith('showroom/')),
    authorityDigest: digest(authority),
    repetitionMetricDigest: digest(repetitionMetric),
    primaryHypothesis: authority.round2Hypothesis.primary,
    engineeringProductTarget: target.path,
    acceptedRendererPreserved: target.path !== target.sourceBasis,
    frozenAuthorityCount: authority.frozenAuthorities.length,
    prohibitedTechniqueCount: authority.prohibitedTechniques.length,
    permanentSceneCount: authority.permanentSceneRoles.allScenes.length,
    regressionWitnessCount: authority.permanentSceneRoles.fullRegressionWitnesses.length,
    antiRepetitionAggregateMaximumRelativeToCp2:
      repetitionMetric.gates.candidateAggregateMaximumRelativeToAcceptedCp2,
    implementationAuthorizedAfterMerge: boundary.implementationAuthorizedAfterCp4Merge,
    liveCandidateAuthorized: boundary.liveCandidateAuthorized,
    nextCheckpoint: boundary.nextCheckpoint,
    issues: Object.freeze(issues)
  });
}

export function executeHEarthCp4Round2LandscapePresentationAuthority() {
  const first = executeOnce();
  const second = executeOnce();
  const deterministic = digest(first) === digest(second);
  const issues = [...first.issues];
  if (!deterministic) issues.push('NONDETERMINISTIC_AUTHORITY_EXECUTION');
  return Object.freeze({
    ...first,
    eligible: first.eligible && deterministic,
    result:
      first.eligible && deterministic
        ? 'CP4_ROUND2_AUTHORITY_PASS_CLOSED'
        : 'CP4_ROUND2_AUTHORITY_FAIL_STOPPED',
    deterministicRepeatExecution: deterministic,
    firstExecutionDigest: digest(first),
    secondExecutionDigest: digest(second),
    issues: Object.freeze(issues)
  });
}

const receipt = executeHEarthCp4Round2LandscapePresentationAuthority();
const outputPath = process.argv[2] ?? null;
if (outputPath) fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (!receipt.eligible) process.exitCode = 1;

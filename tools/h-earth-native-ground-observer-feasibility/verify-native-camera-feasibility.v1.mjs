import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import {
  evaluateHEarth3DCameraCapacity,
  evaluateHEarth3DCameraPose
} from '../../showroom/globe/h-earth/capacity.js';

import {
  H_EARTH_3D_COMPOSITOR_INITIAL_CAMERA_STATE,
  evaluateHEarth3DCompositorCameraState,
  resolveHEarth3DCompositorCameraPose
} from '../../showroom/globe/h-earth/compositor.js';

import {
  H_EARTH_NATIVE_CAMERA_FEASIBILITY_MANIFEST,
  H_EARTH_NATIVE_CAMERA_FEASIBILITY_DONORS,
  H_EARTH_NATIVE_CAMERA_ANCHOR_FRAMES,
  H_EARTH_NATIVE_CAMERA_ANCHORS,
  H_EARTH_NATIVE_CAMERA_STATES,
  H_EARTH_NATIVE_CAMERA_SPARSE_FRAMES,
  H_EARTH_NATIVE_CAMERA_SHARDS,
  H_EARTH_NATIVE_CAMERA_MANIFEST_SHA256,
  H_EARTH_NATIVE_CAMERA_STATE_SCHEMA,
  buildHEarthNativeCameraCanonicalManifestString
} from './native-camera-manifest.v1.mjs';

const REPRESENTABILITY_TOLERANCE = 1e-6;
const BASIS_TOLERANCE = 1e-9;
const failures = [];
const checks = [];

const pass = (id, details = null) => {
  checks.push({ id, passed: true, details });
};

const fail = (id, details = null) => {
  checks.push({ id, passed: false, details });
  failures.push({ id, details });
};

const check = (id, condition, details = null) => {
  if (condition) {
    pass(id, details);
  } else {
    fail(id, details);
  }
};

const approx = (left, right, tolerance = REPRESENTABILITY_TOLERANCE) =>
  Number.isFinite(left) &&
  Number.isFinite(right) &&
  Math.abs(left - right) <= tolerance;

const exactJson = (left, right) => JSON.stringify(left) === JSON.stringify(right);

const exactKeys = (value, expected) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const actual = Object.keys(value).sort();
  const required = [...expected].sort();
  return exactJson(actual, required);
};

const sha256 = (value) =>
  createHash('sha256').update(value, 'utf8').digest('hex');

const gitBlobSha1 = async (relativePath) => {
  const url = new URL(`../../${relativePath}`, import.meta.url);
  const bytes = await readFile(fileURLToPath(url));
  const header = Buffer.from(`blob ${bytes.byteLength}\0`, 'utf8');
  return createHash('sha1').update(header).update(bytes).digest('hex');
};

const round6 = (value) => Number(value.toFixed(6));
const smoothstep = (progress) => progress * progress * (3 - 2 * progress);

const independentExpectedState = (frame) => {
  if (frame === H_EARTH_NATIVE_CAMERA_ANCHORS.at(-1).frame) {
    return H_EARTH_NATIVE_CAMERA_ANCHORS.at(-1).cameraState;
  }

  for (let index = 0; index < H_EARTH_NATIVE_CAMERA_ANCHORS.length - 1; index += 1) {
    const left = H_EARTH_NATIVE_CAMERA_ANCHORS[index];
    const right = H_EARTH_NATIVE_CAMERA_ANCHORS[index + 1];

    if (frame >= left.frame && frame <= right.frame) {
      const progress = (frame - left.frame) / (right.frame - left.frame);
      const weight = smoothstep(progress);
      const interpolate = (a, b) => round6(a + (b - a) * weight);
      const zoomScale = interpolate(left.cameraState.zoomScale, right.cameraState.zoomScale);

      return {
        yawDegrees: interpolate(left.cameraState.yawDegrees, right.cameraState.yawDegrees),
        pitchDegrees: interpolate(left.cameraState.pitchDegrees, right.cameraState.pitchDegrees),
        zoomScale,
        target: {
          x: interpolate(left.cameraState.target.x, right.cameraState.target.x),
          y: 10.5,
          z: interpolate(left.cameraState.target.z, right.cameraState.target.z)
        },
        verticalFovDegrees: round6(56 * zoomScale),
        nearPlane: 0.25,
        farPlane: 512
      };
    }
  }

  throw new RangeError(`Frame ${frame} outside 720..959.`);
};

const expectedForward = (state) => {
  const yaw = state.yawDegrees * Math.PI / 180;
  const pitch = state.pitchDegrees * Math.PI / 180;
  const horizontal = Math.cos(pitch);
  const vector = {
    x: -Math.sin(yaw) * horizontal,
    y: -Math.sin(pitch),
    z: -Math.cos(yaw) * horizontal
  };
  const length = Math.hypot(vector.x, vector.y, vector.z);
  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length
  };
};

const donorResults = await Promise.all(
  Object.values(H_EARTH_NATIVE_CAMERA_FEASIBILITY_DONORS).map(async (donor) => ({
    path: donor.path,
    expected: donor.blob,
    actual: await gitBlobSha1(donor.path)
  }))
);

for (const donor of donorResults) {
  check(
    `DONOR_BLOB_MATCH_${donor.path}`,
    donor.actual === donor.expected,
    donor
  );
}

check(
  'MANIFEST_FRAME_COUNT_EXACT_240',
  H_EARTH_NATIVE_CAMERA_STATES.length === 240,
  H_EARTH_NATIVE_CAMERA_STATES.length
);

check(
  'MANIFEST_FRAME_RANGE_CONTIGUOUS_720_959',
  H_EARTH_NATIVE_CAMERA_STATES.every(
    (record, index) => record.frame === 720 + index
  )
);

check(
  'ANCHOR_FRAME_SET_EXACT',
  exactJson(H_EARTH_NATIVE_CAMERA_ANCHOR_FRAMES, [720, 780, 840, 900, 959])
);

check(
  'SPARSE_FRAME_SET_EXACT',
  exactJson(
    H_EARTH_NATIVE_CAMERA_SPARSE_FRAMES,
    Array.from({ length: 30 }, (_, index) => 720 + 8 * index)
  )
);

check(
  'EIGHT_SHARDS_EXACT',
  H_EARTH_NATIVE_CAMERA_SHARDS.length === 8 &&
  H_EARTH_NATIVE_CAMERA_SHARDS.every(
    (shard, index) =>
      shard.firstFrame === 720 + index * 30 &&
      shard.lastFrame === 749 + index * 30 &&
      shard.frameCount === 30
  )
);

const canonicalString = buildHEarthNativeCameraCanonicalManifestString();
const actualManifestSha256 = sha256(canonicalString);
check(
  'MANIFEST_SHA256_MATCH',
  actualManifestSha256 === H_EARTH_NATIVE_CAMERA_MANIFEST_SHA256,
  {
    expected: H_EARTH_NATIVE_CAMERA_MANIFEST_SHA256,
    actual: actualManifestSha256
  }
);

const firstAnchor = H_EARTH_NATIVE_CAMERA_ANCHORS[0];
const firstState = firstAnchor.cameraState;
const currentInitialState = H_EARTH_3D_COMPOSITOR_INITIAL_CAMERA_STATE;
check(
  'INITIAL_NATIVE_ANCHOR_BOUND_TO_CURRENT_COMPOSITOR',
  firstAnchor.source === 'CURRENT_COMPOSITOR_INITIAL_CAMERA_STATE_DERIVATION' &&
  approx(firstState.yawDegrees, currentInitialState.yawDegrees) &&
  approx(firstState.pitchDegrees, currentInitialState.pitchDegrees) &&
  firstState.zoomScale === currentInitialState.zoomScale &&
  exactJson(firstState.target, currentInitialState.target) &&
  firstState.verticalFovDegrees === currentInitialState.verticalFovDegrees &&
  firstState.nearPlane === currentInitialState.nearPlane &&
  firstState.farPlane === currentInitialState.farPlane,
  {
    source: firstAnchor.source,
    currentInitialState,
    authoredFirstState: firstState,
    predecessorAuthorityUsed: false
  }
);

check(
  'NATIVE_SCHEMA_EXACT_KEYS',
  exactJson(
    H_EARTH_NATIVE_CAMERA_STATE_SCHEMA.exactKeys,
    ['yawDegrees', 'pitchDegrees', 'zoomScale', 'target', 'verticalFovDegrees', 'nearPlane', 'farPlane']
  ) &&
  exactJson(H_EARTH_NATIVE_CAMERA_STATE_SCHEMA.targetExactKeys, ['x', 'y', 'z'])
);

let allStateSurfacesExact = true;
let allFinite = true;
let allIndependentInterpolationMatches = true;
let allCapacityExact = true;
let allCompositorExact = true;
let allPoseExact = true;
let allPoseCapacityEligible = true;
let allNativeSemanticsExact = true;
let allMonotone = true;

let previous = null;

for (let index = 0; index < H_EARTH_NATIVE_CAMERA_STATES.length; index += 1) {
  const record = H_EARTH_NATIVE_CAMERA_STATES[index];
  const state = record.cameraState;

  if (
    !exactKeys(state, H_EARTH_NATIVE_CAMERA_STATE_SCHEMA.exactKeys) ||
    !exactKeys(state.target, H_EARTH_NATIVE_CAMERA_STATE_SCHEMA.targetExactKeys)
  ) {
    allStateSurfacesExact = false;
  }

  const values = [
    state.yawDegrees,
    state.pitchDegrees,
    state.zoomScale,
    state.target.x,
    state.target.y,
    state.target.z,
    state.verticalFovDegrees,
    state.nearPlane,
    state.farPlane
  ];

  if (!values.every(Number.isFinite)) {
    allFinite = false;
  }

  if (!exactJson(state, independentExpectedState(record.frame))) {
    allIndependentInterpolationMatches = false;
  }

  const capacityEvaluation = evaluateHEarth3DCameraCapacity(state);
  if (
    capacityEvaluation.eligible !== true ||
    capacityEvaluation.adjustmentRequired !== false ||
    !exactJson(capacityEvaluation.normalizedCameraState, state)
  ) {
    allCapacityExact = false;
  }

  const compositorEvaluation = evaluateHEarth3DCompositorCameraState(state);
  if (
    compositorEvaluation.eligible !== true ||
    compositorEvaluation.adjusted !== false ||
    !exactJson(compositorEvaluation.cameraState, state)
  ) {
    allCompositorExact = false;
  }

  const pose = resolveHEarth3DCompositorCameraPose(state, index);
  if (!pose.eligible) {
    allPoseExact = false;
    allPoseCapacityEligible = false;
  } else {
    const forward = expectedForward(state);
    const expectedLookTarget = {
      x: state.target.x + forward.x * 16,
      y: state.target.y + forward.y * 16,
      z: state.target.z + forward.z * 16
    };

    if (
      !approx(pose.position.x, state.target.x) ||
      !approx(pose.position.y, 10.5) ||
      !approx(pose.position.z, state.target.z) ||
      !approx(pose.target.x, expectedLookTarget.x) ||
      !approx(pose.target.y, expectedLookTarget.y) ||
      !approx(pose.target.z, expectedLookTarget.z) ||
      !approx(pose.forward.x, forward.x, BASIS_TOLERANCE) ||
      !approx(pose.forward.y, forward.y, BASIS_TOLERANCE) ||
      !approx(pose.forward.z, forward.z, BASIS_TOLERANCE) ||
      !approx(pose.verticalFovDegrees, state.verticalFovDegrees) ||
      pose.nearPlane !== 0.25 ||
      pose.farPlane !== 512 ||
      !approx(pose.distance, 16)
    ) {
      allPoseExact = false;
    }

    const poseCapacity = evaluateHEarth3DCameraPose(pose);
    if (poseCapacity.eligible !== true) {
      allPoseCapacityEligible = false;
    }
  }

  if (
    state.target.y !== 10.5 ||
    Object.prototype.hasOwnProperty.call(state, 'position') ||
    Object.prototype.hasOwnProperty.call(state, 'up') ||
    !approx(state.verticalFovDegrees, 56 * state.zoomScale) ||
    state.nearPlane !== 0.25 ||
    state.farPlane !== 512
  ) {
    allNativeSemanticsExact = false;
  }

  if (previous) {
    if (
      state.target.x > previous.target.x + REPRESENTABILITY_TOLERANCE ||
      state.target.z > previous.target.z + REPRESENTABILITY_TOLERANCE ||
      state.yawDegrees > previous.yawDegrees + REPRESENTABILITY_TOLERANCE ||
      state.pitchDegrees > previous.pitchDegrees + REPRESENTABILITY_TOLERANCE ||
      state.zoomScale > previous.zoomScale + REPRESENTABILITY_TOLERANCE
    ) {
      allMonotone = false;
    }
  }

  previous = state;
}

check('ALL_STATE_KEY_SURFACES_EXACT', allStateSurfacesExact);
check('ALL_STATE_VALUES_FINITE', allFinite);
check('INDEPENDENT_INTERPOLATION_REPRODUCES_ALL_240_STATES', allIndependentInterpolationMatches);
check('CAPACITY_ROUND_TRIP_EXACT_NO_NORMALIZATION_DRIFT', allCapacityExact);
check('COMPOSITOR_ROUND_TRIP_EXACT_NO_LOCAL_ADJUSTMENT', allCompositorExact);
check('RESOLVED_POSE_MATCHES_NATIVE_GROUND_OBSERVER_SEMANTICS', allPoseExact);
check('ALL_RESOLVED_POSES_PASS_CAMERA_POSE_CAPACITY', allPoseCapacityEligible);
check('FIXED_EYE_HEIGHT_LOOK_DISTANCE_FOV_PLANES_PRESERVED', allNativeSemanticsExact);
check('PROGRESSIVE_NATIVE_PATH_MONOTONE', allMonotone);

for (const anchor of H_EARTH_NATIVE_CAMERA_ANCHORS) {
  const record = H_EARTH_NATIVE_CAMERA_STATES[anchor.frame - 720];
  check(
    `ANCHOR_${anchor.frame}_EXACT`,
    record?.frame === anchor.frame && exactJson(record.cameraState, anchor.cameraState)
  );
}

check(
  'NO_PREDECESSOR_FREE_POSITION_SEMANTICS',
  H_EARTH_NATIVE_CAMERA_FEASIBILITY_MANIFEST.predecessorFreePositionSemanticsReused === false &&
  H_EARTH_NATIVE_CAMERA_FEASIBILITY_MANIFEST.productRuntimeMutationRequired === false
);

const result = {
  schema: 'H_EARTH_NATIVE_CAMERA_FEASIBILITY_VERIFICATION_v1',
  result: failures.length === 0 ? 'PASS' : 'FAIL',
  checkCount: checks.length,
  passedCount: checks.filter((entry) => entry.passed).length,
  failureCount: failures.length,
  manifestSha256: actualManifestSha256,
  representabilityTolerance: REPRESENTABILITY_TOLERANCE,
  checks,
  failures
};

console.log(JSON.stringify(result, null, 2));

if (failures.length > 0) {
  process.exitCode = 1;
}

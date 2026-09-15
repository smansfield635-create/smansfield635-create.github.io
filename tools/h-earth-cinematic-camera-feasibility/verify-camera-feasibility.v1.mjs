import { createHash } from 'node:crypto';
import {
  H_EARTH_CINEMATIC_CAMERA_GOVERNING_HEAD,
  H_EARTH_CINEMATIC_CAMERA_MANIFEST,
  H_EARTH_CINEMATIC_CAMERA_MANIFEST_IDENTITY,
  H_EARTH_CINEMATIC_CAMERA_MANIFEST_SERIALIZED,
  H_EARTH_CINEMATIC_CAMERA_MANIFEST_SHA256,
  H_EARTH_CINEMATIC_CAMERA_POSES,
  H_EARTH_CINEMATIC_CAMERA_STATES,
  H_EARTH_CINEMATIC_CAMERA_WORLD_IDENTITY,
  H_EARTH_CINEMATIC_CAMERA_RENDERER_IDENTITY,
  H_EARTH_CINEMATIC_CAMERA_COMPOSITOR_IDENTITY
} from './camera-manifest.v1.mjs';

const TOLERANCES = Object.freeze({
  scalar: 1e-9,
  c1Derivative: 1e-10,
  progress: 1e-9,
  minimumPositionTargetSeparation: 4
});

const EXPECTED = Object.freeze({
  governingHead: '3c5b7ece95bb6d642e527737bb60647c032e29dd',
  frames: Object.freeze({ start: 720, end: 959, count: 240 }),
  poseFrames: Object.freeze([720, 780, 840, 900, 959]),
  viewport: Object.freeze({ width: 1280, height: 720 }),
  up: Object.freeze({ x: 0, y: 1, z: 0 }),
  verticalFovDegrees: 56,
  nearPlane: 0.25,
  farPlane: 512,
  positionBounds: Object.freeze({ xMin: -256, xMax: 256, yMin: -80, yMax: 120, zMin: -256, zMax: 256 }),
  targetBounds: Object.freeze({ xMin: -96, xMax: 96, yMin: -32, yMax: 32, zMin: -256, zMax: 24 }),
  worldIdentity: 'main@3c5b7ece95bb6d642e527737bb60647c032e29dd|admitted-geometry-frame@c45ed4482f0d653c4a51ea838c191f36e7769d26|region-summits@fcb090e5c1b46fa179a406e7b10688ab8bde7e68',
  rendererIdentity: 'renderer@799d37cec5244e6aa19b7d94dffe37e182b85884',
  compositorIdentity: 'compositor@3764f0d53b0564de7a5e983bd339dda75017bc82'
});

const SPARSE_FRAMES = Object.freeze(Array.from({ length: 30 }, (_, k) => 720 + 8 * k));
const SHARDS = Object.freeze(Array.from({ length: 8 }, (_, i) => Object.freeze({ start: 720 + 30 * i, end: 749 + 30 * i })));

const failures = [];
const checks = [];

const record = (id, passed, details = null) => {
  checks.push(Object.freeze({ id, passed: passed === true, details }));
  if (!passed) failures.push(Object.freeze({ id, details }));
};

const finiteVector = (v) => v && ['x', 'y', 'z'].every((axis) => Number.isFinite(v[axis]));
const equalScalar = (a, b, tolerance = TOLERANCES.scalar) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tolerance;
const equalVector = (a, b, tolerance = TOLERANCES.scalar) => finiteVector(a) && finiteVector(b) && ['x', 'y', 'z'].every((axis) => equalScalar(a[axis], b[axis], tolerance));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
const subtract = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
const canonicalize = (value) => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.keys(value).sort().reduce((out, key) => {
      out[key] = canonicalize(value[key]);
      return out;
    }, {});
  }
  return value;
};
const roundDeterministic = (value) => Number(value.toFixed(9));

const poseFrames = H_EARTH_CINEMATIC_CAMERA_POSES.map((pose) => pose.frame);
const valuesFor = (field, axis) => H_EARTH_CINEMATIC_CAMERA_POSES.map((pose) => pose[field][axis]);
const tangentAt = (values, index) => {
  if (index === 0) return (values[1] - values[0]) / (poseFrames[1] - poseFrames[0]);
  if (index === values.length - 1) {
    const last = values.length - 1;
    return (values[last] - values[last - 1]) / (poseFrames[last] - poseFrames[last - 1]);
  }
  return (values[index + 1] - values[index - 1]) / (poseFrames[index + 1] - poseFrames[index - 1]);
};

const interpolateExpected = (values, frame) => {
  if (frame === poseFrames[0]) return values[0];
  if (frame === poseFrames.at(-1)) return values.at(-1);
  let segment = 0;
  while (!(frame >= poseFrames[segment] && frame <= poseFrames[segment + 1])) segment += 1;
  const f0 = poseFrames[segment];
  const f1 = poseFrames[segment + 1];
  const span = f1 - f0;
  const t = (frame - f0) / span;
  const t2 = t * t;
  const t3 = t2 * t;
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;
  return roundDeterministic(
    h00 * values[segment] +
    h10 * span * tangentAt(values, segment) +
    h01 * values[segment + 1] +
    h11 * span * tangentAt(values, segment + 1)
  );
};

const hermiteDerivativeAt = (values, segment, t) => {
  const span = poseFrames[segment + 1] - poseFrames[segment];
  const dh00 = 6 * t * t - 6 * t;
  const dh10 = 3 * t * t - 4 * t + 1;
  const dh01 = -6 * t * t + 6 * t;
  const dh11 = 3 * t * t - 2 * t;
  const derivativeWithRespectToT =
    dh00 * values[segment] +
    dh10 * span * tangentAt(values, segment) +
    dh01 * values[segment + 1] +
    dh11 * span * tangentAt(values, segment + 1);
  return derivativeWithRespectToT / span;
};

record('GOVERNING_HEAD_EXACT', H_EARTH_CINEMATIC_CAMERA_GOVERNING_HEAD === EXPECTED.governingHead);
record('POSE_FRAME_SET_EXACT', JSON.stringify(poseFrames) === JSON.stringify(EXPECTED.poseFrames), poseFrames);
record('STATE_COUNT_EXACT_240', H_EARTH_CINEMATIC_CAMERA_STATES.length === EXPECTED.frames.count, H_EARTH_CINEMATIC_CAMERA_STATES.length);
record('STATE_FRAME_RANGE_CONTIGUOUS', H_EARTH_CINEMATIC_CAMERA_STATES.every((state, i) => state.frame === EXPECTED.frames.start + i) && H_EARTH_CINEMATIC_CAMERA_STATES.at(-1)?.frame === EXPECTED.frames.end);
record('VIEWPORT_EXACT_1280_720', H_EARTH_CINEMATIC_CAMERA_MANIFEST_IDENTITY.viewport.width === EXPECTED.viewport.width && H_EARTH_CINEMATIC_CAMERA_MANIFEST_IDENTITY.viewport.height === EXPECTED.viewport.height);
record('SPARSE_SET_EXACT', SPARSE_FRAMES.length === 30 && SPARSE_FRAMES[0] === 720 && SPARSE_FRAMES.at(-1) === 952 && SPARSE_FRAMES.every((frame, k) => frame === 720 + 8 * k), SPARSE_FRAMES);
record('SHARD_PARTITION_EXACT', SHARDS.length === 8 && SHARDS.every((shard, i) => shard.start === 720 + 30 * i && shard.end === 749 + 30 * i) && SHARDS[0].start === 720 && SHARDS.at(-1).end === 959, SHARDS);

const expectedSerialized = JSON.stringify(canonicalize(H_EARTH_CINEMATIC_CAMERA_MANIFEST));
const recomputedHash = createHash('sha256').update(expectedSerialized, 'utf8').digest('hex');
record('CANONICAL_SERIALIZATION_EXACT', expectedSerialized === H_EARTH_CINEMATIC_CAMERA_MANIFEST_SERIALIZED);
record('MANIFEST_SHA256_EXACT', recomputedHash === H_EARTH_CINEMATIC_CAMERA_MANIFEST_SHA256, { declared: H_EARTH_CINEMATIC_CAMERA_MANIFEST_SHA256, recomputed: recomputedHash });

const allFinite = H_EARTH_CINEMATIC_CAMERA_STATES.every((state) =>
  Number.isInteger(state.frame) && finiteVector(state.position) && finiteVector(state.target) && finiteVector(state.up) &&
  Number.isFinite(state.verticalFovDegrees) && Number.isFinite(state.nearPlane) && Number.isFinite(state.farPlane)
);
record('ALL_STATE_NUMBERS_FINITE', allFinite);

const fixedProjection = H_EARTH_CINEMATIC_CAMERA_STATES.every((state) =>
  equalVector(state.up, EXPECTED.up) &&
  equalScalar(state.verticalFovDegrees, EXPECTED.verticalFovDegrees) &&
  equalScalar(state.nearPlane, EXPECTED.nearPlane) &&
  equalScalar(state.farPlane, EXPECTED.farPlane) &&
  state.farPlane > state.nearPlane
);
record('FIXED_UP_FOV_PLANES_NO_LENS_ANIMATION_OR_ROLL', fixedProjection);

const identitiesExact = H_EARTH_CINEMATIC_CAMERA_STATES.every((state) =>
  state.worldIdentity === EXPECTED.worldIdentity &&
  state.rendererIdentity === EXPECTED.rendererIdentity &&
  state.compositorIdentity === EXPECTED.compositorIdentity
) && H_EARTH_CINEMATIC_CAMERA_WORLD_IDENTITY === EXPECTED.worldIdentity &&
  H_EARTH_CINEMATIC_CAMERA_RENDERER_IDENTITY === EXPECTED.rendererIdentity &&
  H_EARTH_CINEMATIC_CAMERA_COMPOSITOR_IDENTITY === EXPECTED.compositorIdentity;
record('DONOR_IDENTITIES_EXACT', identitiesExact);

const boundsValid = H_EARTH_CINEMATIC_CAMERA_STATES.every((state) =>
  state.position.x >= EXPECTED.positionBounds.xMin && state.position.x <= EXPECTED.positionBounds.xMax &&
  state.position.y >= EXPECTED.positionBounds.yMin && state.position.y <= EXPECTED.positionBounds.yMax &&
  state.position.z >= EXPECTED.positionBounds.zMin && state.position.z <= EXPECTED.positionBounds.zMax &&
  state.target.x >= EXPECTED.targetBounds.xMin && state.target.x <= EXPECTED.targetBounds.xMax &&
  state.target.y >= EXPECTED.targetBounds.yMin && state.target.y <= EXPECTED.targetBounds.yMax &&
  state.target.z >= EXPECTED.targetBounds.zMin && state.target.z <= EXPECTED.targetBounds.zMax
);
record('CAMERA_AND_TARGET_BOUNDS_VALID', boundsValid);

let minimumSeparation = Number.POSITIVE_INFINITY;
for (const state of H_EARTH_CINEMATIC_CAMERA_STATES) minimumSeparation = Math.min(minimumSeparation, distance(state.position, state.target));
record('POSITION_TARGET_SEPARATION_SUFFICIENT', minimumSeparation >= TOLERANCES.minimumPositionTargetSeparation, minimumSeparation);

let interpolationMatches = true;
for (const state of H_EARTH_CINEMATIC_CAMERA_STATES) {
  for (const field of ['position', 'target']) {
    for (const axis of ['x', 'y', 'z']) {
      const expected = interpolateExpected(valuesFor(field, axis), state.frame);
      if (!equalScalar(state[field][axis], expected)) interpolationMatches = false;
    }
  }
}
record('ALL_240_STATES_MATCH_INDEPENDENT_HERMITE_RECOMPUTATION', interpolationMatches);

let c1Continuous = true;
let maxC1Delta = 0;
for (const field of ['position', 'target']) {
  for (const axis of ['x', 'y', 'z']) {
    const values = valuesFor(field, axis);
    for (let anchorIndex = 1; anchorIndex < poseFrames.length - 1; anchorIndex += 1) {
      const left = hermiteDerivativeAt(values, anchorIndex - 1, 1);
      const right = hermiteDerivativeAt(values, anchorIndex, 0);
      const delta = Math.abs(left - right);
      maxC1Delta = Math.max(maxC1Delta, delta);
      if (delta > TOLERANCES.c1Derivative) c1Continuous = false;
    }
  }
}
record('C1_CONTINUITY_AT_INTERNAL_POSES', c1Continuous, { maxDerivativeDelta: maxC1Delta, tolerance: TOLERANCES.c1Derivative });

const monotoneProgress = (field) => {
  const first = H_EARTH_CINEMATIC_CAMERA_STATES[0][field];
  const last = H_EARTH_CINEMATIC_CAMERA_STATES.at(-1)[field];
  const route = subtract(last, first);
  const norm2 = dot(route, route);
  if (!(norm2 > 0)) return false;
  let previous = -Infinity;
  for (const state of H_EARTH_CINEMATIC_CAMERA_STATES) {
    const progress = dot(subtract(state[field], first), route) / norm2;
    if (progress + TOLERANCES.progress < previous) return false;
    previous = progress;
  }
  return true;
};
record('POSITION_PROGRESS_MONOTONE', monotoneProgress('position'));
record('TARGET_PROGRESS_MONOTONE', monotoneProgress('target'));

const noDirectionReversal = (field) => {
  const first = H_EARTH_CINEMATIC_CAMERA_STATES[0][field];
  const last = H_EARTH_CINEMATIC_CAMERA_STATES.at(-1)[field];
  const route = subtract(last, first);
  for (let i = 1; i < H_EARTH_CINEMATIC_CAMERA_STATES.length; i += 1) {
    const step = subtract(H_EARTH_CINEMATIC_CAMERA_STATES[i][field], H_EARTH_CINEMATIC_CAMERA_STATES[i - 1][field]);
    if (dot(step, route) < -TOLERANCES.progress) return false;
  }
  return true;
};
record('POSITION_NO_DIRECTION_REVERSAL', noDirectionReversal('position'));
record('TARGET_NO_DIRECTION_REVERSAL', noDirectionReversal('target'));

const poseBindingsExact = H_EARTH_CINEMATIC_CAMERA_POSES.every((pose) => {
  const state = H_EARTH_CINEMATIC_CAMERA_STATES[pose.frame - EXPECTED.frames.start];
  return state && equalVector(state.position, pose.position) && equalVector(state.target, pose.target) &&
    equalVector(state.up, pose.up) && equalScalar(state.verticalFovDegrees, pose.verticalFovDegrees) &&
    equalScalar(state.nearPlane, pose.nearPlane) && equalScalar(state.farPlane, pose.farPlane);
});
record('FIVE_POSES_BIND_EXACTLY_TO_MANIFEST_STATES', poseBindingsExact);

const receipt = Object.freeze({
  schema: 'H_EARTH_CINEMATIC_CAMERA_FEASIBILITY_MATHEMATICAL_RECEIPT_v1',
  operationId: H_EARTH_CINEMATIC_CAMERA_MANIFEST_IDENTITY.operationId,
  governingHead: H_EARTH_CINEMATIC_CAMERA_GOVERNING_HEAD,
  manifestSha256: H_EARTH_CINEMATIC_CAMERA_MANIFEST_SHA256,
  tolerances: TOLERANCES,
  result: failures.length === 0 ? 'PASS' : 'FAIL',
  checkCount: checks.length,
  checks,
  failures
});

process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
if (failures.length > 0) process.exitCode = 1;

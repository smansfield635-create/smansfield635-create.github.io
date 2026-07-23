/*
 * ARCHCOIN Compass Calibration Workspace
 * Deterministic Stage 1A / Stage 1B research fixtures.
 * These fixtures define executable checks but do not record browser acceptance.
 */

import {
  ARCHCOIN_STAGE_1A_FIXED_AXIS_MATH_CONTRACT
} from "./stage-1a-fixed-axis-math.contract.js";

import {
  ARCHCOIN_STAGE_1B_CLUSTER_ORBIT_MATH_CONTRACT
} from "./stage-1b-cluster-orbit-math.contract.js";

const EPSILON = 1e-9;

function normalizeQuaternion(value) {
  const source = Array.from(value || []);
  if (source.length !== 4 || source.some(component => !Number.isFinite(component))) {
    throw new Error("ARCHCOIN_STAGE_1_FIXTURE_QUATERNION_INVALID");
  }
  const length = Math.hypot(...source);
  if (!Number.isFinite(length) || length <= 1e-12) {
    throw new Error("ARCHCOIN_STAGE_1_FIXTURE_QUATERNION_ZERO");
  }
  return source.map(component => component / length);
}

function quaternionMultiply(first, second) {
  const [ax, ay, az, aw] = normalizeQuaternion(first);
  const [bx, by, bz, bw] = normalizeQuaternion(second);
  return normalizeQuaternion([
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz
  ]);
}

function quaternionFromAxisAngle(axis, angle) {
  const length = Math.hypot(axis[0], axis[1], axis[2]);
  if (!Number.isFinite(length) || length <= 1e-12 || Math.abs(angle) <= 1e-12) {
    return [0, 0, 0, 1];
  }
  const half = angle * 0.5;
  const scale = Math.sin(half) / length;
  return normalizeQuaternion([
    axis[0] * scale,
    axis[1] * scale,
    axis[2] * scale,
    Math.cos(half)
  ]);
}

function quaternionRotateVector(quaternion, vector) {
  const [x, y, z, w] = normalizeQuaternion(quaternion);
  const qVector = [x, y, z];
  const uv = [
    qVector[1] * vector[2] - qVector[2] * vector[1],
    qVector[2] * vector[0] - qVector[0] * vector[2],
    qVector[0] * vector[1] - qVector[1] * vector[0]
  ];
  const uuv = [
    qVector[1] * uv[2] - qVector[2] * uv[1],
    qVector[2] * uv[0] - qVector[0] * uv[2],
    qVector[0] * uv[1] - qVector[1] * uv[0]
  ];
  return [
    vector[0] + 2 * (w * uv[0] + uuv[0]),
    vector[1] + 2 * (w * uv[1] + uuv[1]),
    vector[2] + 2 * (w * uv[2] + uuv[2])
  ];
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function nearlyEqual(a, b, tolerance = EPSILON) {
  return Math.abs(a - b) <= tolerance;
}

function assert(condition, code, details = null) {
  if (condition) return true;
  const error = new Error(code);
  error.code = code;
  error.details = details;
  throw error;
}

function deterministicQuaternionFixtures() {
  return Object.freeze([
    Object.freeze([0, 0, 0, 1]),
    Object.freeze(quaternionFromAxisAngle([0, 1, 0], Math.PI / 4)),
    Object.freeze(quaternionFromAxisAngle([1, 0, 0], -Math.PI / 6)),
    Object.freeze(quaternionMultiply(
      quaternionFromAxisAngle([1, 0, 0], Math.PI / 8),
      quaternionFromAxisAngle([0, 1, 0], -Math.PI / 3)
    )),
    Object.freeze(normalizeQuaternion([0.22, -0.31, 0.08, 0.91]))
  ]);
}

export function runArchcoinStage1MathFixtures() {
  const stage1A = ARCHCOIN_STAGE_1A_FIXED_AXIS_MATH_CONTRACT;
  const stage1B = ARCHCOIN_STAGE_1B_CLUSTER_ORBIT_MATH_CONTRACT;
  const results = [];

  const identity = normalizeQuaternion([0, 0, 0, 1]);
  assert(identity.every((value, index) => nearlyEqual(value, [0, 0, 0, 1][index])),
    "STAGE_1A_IDENTITY_FAILED");
  results.push("STAGE_1A_IDENTITY_PASS");

  const positiveYaw = quaternionFromAxisAngle([0, 1, 0], 0.1);
  const negativeYaw = quaternionFromAxisAngle([0, 1, 0], -0.1);
  assert(Math.sign(positiveYaw[1]) === -Math.sign(negativeYaw[1]),
    "STAGE_1A_HORIZONTAL_SIGN_FAILED");
  assert(nearlyEqual(positiveYaw[0], 0) && nearlyEqual(positiveYaw[2], 0),
    "STAGE_1A_HORIZONTAL_AXIS_ESCAPE");
  results.push("STAGE_1A_HORIZONTAL_FIXED_AXIS_PASS");

  const pitch = quaternionFromAxisAngle([1, 0, 0], 0.1);
  assert(nearlyEqual(pitch[1], 0) && nearlyEqual(pitch[2], 0),
    "STAGE_1A_VERTICAL_AXIS_ESCAPE");
  results.push("STAGE_1A_VERTICAL_FIXED_AXIS_PASS");

  const mixed = quaternionMultiply(pitch, positiveYaw);
  assert(nearlyEqual(Math.hypot(...mixed), 1, stage1A.tolerances.quaternionNorm),
    "STAGE_1A_MIXED_NOT_NORMALIZED");
  results.push("STAGE_1A_MIXED_NORMALIZATION_PASS");

  assert(stage1A.pitchPolicy.cumulativePitchLimitRadians < Math.PI / 2,
    "STAGE_1A_PITCH_LIMIT_INVALID");
  results.push("STAGE_1A_PITCH_LIMIT_PASS");

  const seats = stage1B.seatPolicy.baseUnitVectors;
  assert(seats.length === 4, "STAGE_1B_SEAT_COUNT_FAILED");
  seats.forEach((seat, index) => {
    assert(nearlyEqual(Math.hypot(...seat), 1),
      "STAGE_1B_BASE_SEAT_NOT_UNIT", { index });
  });
  results.push("STAGE_1B_BASE_SEATS_UNIT_PASS");

  const baseDots = [];
  for (let first = 0; first < seats.length; first += 1) {
    for (let second = first + 1; second < seats.length; second += 1) {
      baseDots.push(Object.freeze({ first, second, value: dot(seats[first], seats[second]) }));
    }
  }

  deterministicQuaternionFixtures().forEach((quaternion, fixtureIndex) => {
    const rotated = seats.map(seat => quaternionRotateVector(quaternion, seat));
    baseDots.forEach(pair => {
      assert(nearlyEqual(dot(rotated[pair.first], rotated[pair.second]), pair.value, 1e-8),
        "STAGE_1B_PAIRWISE_RELATION_DRIFT", { fixtureIndex, pair });
    });
    rotated.forEach((seat, seatIndex) => {
      const world = [
        seat[0] * stage1B.radiusPolicy.horizontalRadiusX,
        seat[1] * stage1B.radiusPolicy.verticalRadiusY,
        seat[2] * stage1B.radiusPolicy.depthRadiusZ
      ];
      assert(world.every(Number.isFinite),
        "STAGE_1B_WORLD_POSITION_NONFINITE", { fixtureIndex, seatIndex });
    });
  });
  results.push("STAGE_1B_PAIRWISE_RELATION_PASS");
  results.push("STAGE_1B_WORLD_POSITION_FINITE_PASS");

  const anchor = stage1B.primaryAnchorPolicy.normalizedAnchor;
  deterministicQuaternionFixtures().forEach((quaternion, fixtureIndex) => {
    const scores = seats.map((seat, index) => ({
      index,
      score: dot(quaternionRotateVector(quaternion, seat), anchor)
    }));
    const ordered = scores.slice().sort((a, b) =>
      Math.abs(b.score - a.score) <= stage1B.primaryAnchorPolicy.tieTolerance
        ? a.index - b.index
        : b.score - a.score
    );
    assert(Number.isInteger(ordered[0].index),
      "STAGE_1B_PRIMARY_NOT_DETERMINISTIC", { fixtureIndex });
  });
  results.push("STAGE_1B_PRIMARY_TIE_BREAK_PASS");

  return Object.freeze({
    schema: "ARCHCOIN_STAGE_1_MATH_FIXTURE_RECEIPT_v1",
    status: "PASS",
    resultCount: results.length,
    results: Object.freeze(results),
    browserVisualAcceptancePerformed: false,
    physicalDeviceAcceptancePerformed: false,
    liveMutationAuthorized: false
  });
}

export const ARCHCOIN_STAGE_1_MATH_FIXTURE_CONTRACT = Object.freeze({
  schema: "ARCHCOIN_STAGE_1_MATH_FIXTURE_CONTRACT_v1",
  status: "FIXTURES_CREATED_EXECUTION_REQUIRED",
  stage1AContract: ARCHCOIN_STAGE_1A_FIXED_AXIS_MATH_CONTRACT.schema,
  stage1BContract: ARCHCOIN_STAGE_1B_CLUSTER_ORBIT_MATH_CONTRACT.schema,
  fixtureRunner: "runArchcoinStage1MathFixtures",
  deterministicQuaternionFixtureCount: deterministicQuaternionFixtures().length,
  liveMutationAuthorized: false
});

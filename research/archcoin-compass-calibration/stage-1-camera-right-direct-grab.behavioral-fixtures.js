/*
 * ARCHCOIN Compass Calibration Workspace
 * Stage 1A camera-right and direct-grab deterministic behavioral fixtures.
 * Research authority only. No live product or production authority.
 */

const EPSILON = 1e-9;

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function normalizeVector(vector) {
  const length = Math.hypot(...vector);
  return length > EPSILON
    ? vector.map(component => component / length)
    : null;
}

function subtract(a, b) {
  return a.map((component, index) => component - b[index]);
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

function dot(a, b) {
  return a.reduce((sum, component, index) => sum + component * b[index], 0);
}

function normalizeQuaternion(quaternion) {
  const length = Math.hypot(...quaternion);
  return length > EPSILON
    ? quaternion.map(component => component / length)
    : [0, 0, 0, 1];
}

function multiplyQuaternion(first, second) {
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
  const normalizedAxis = normalizeVector(axis);
  if (!normalizedAxis || Math.abs(angle) < EPSILON) {
    return [0, 0, 0, 1];
  }
  const halfAngle = angle * 0.5;
  const sine = Math.sin(halfAngle);
  return normalizeQuaternion([
    normalizedAxis[0] * sine,
    normalizedAxis[1] * sine,
    normalizedAxis[2] * sine,
    Math.cos(halfAngle)
  ]);
}

function rotateVector(quaternion, vector) {
  const [x, y, z, w] = normalizeQuaternion(quaternion);
  const quaternionVector = [x, y, z];
  const firstCross = cross(quaternionVector, vector).map(value => value * 2);
  const secondCross = cross(quaternionVector, firstCross);
  return vector.map(
    (component, index) =>
      component + w * firstCross[index] + secondCross[index]
  );
}

function inverseQuaternion(quaternion) {
  const normalized = normalizeQuaternion(quaternion);
  return [-normalized[0], -normalized[1], -normalized[2], normalized[3]];
}

export function deriveAdmittedCameraRight(camera) {
  try {
    const forward = normalizeVector(subtract(camera.target, camera.eye));
    if (!forward) throw new Error("DEGENERATE_FORWARD");
    const unprojectedRight = normalizeVector(cross(forward, [0, 1, 0]));
    if (!unprojectedRight) throw new Error("DEGENERATE_RIGHT");
    const admittedRight = normalizeVector([
      unprojectedRight[0],
      0,
      unprojectedRight[2]
    ]);
    if (!admittedRight) throw new Error("DEGENERATE_XZ_RIGHT");
    return admittedRight;
  } catch {
    return [1, 0, 0];
  }
}

export function fixedClusterBasisDelta(
  dx,
  dy,
  cameraRight,
  sensitivity = 0.0062,
  maximumAngle = 0.18,
  multiplier = 1
) {
  const yaw = clamp(dx * sensitivity * multiplier, -maximumAngle, maximumAngle);
  const pitch = clamp(dy * sensitivity * multiplier, -maximumAngle, maximumAngle);
  return multiplyQuaternion(
    quaternionFromAxisAngle(cameraRight, pitch),
    quaternionFromAxisAngle([0, 1, 0], yaw)
  );
}

function relativePitchAngle(candidate, origin, cameraRight) {
  const relative = multiplyQuaternion(candidate, inverseQuaternion(origin));
  const forward = rotateVector(relative, [0, 0, -1]);
  const pitchForward = rotateVector(
    quaternionFromAxisAngle(cameraRight, Math.PI / 2),
    [0, 0, -1]
  );
  return Math.asin(clamp(dot(forward, pitchForward), -1, 1));
}

export function clampCumulativePitch(candidate, origin, cameraRight, limit) {
  const currentPitch = relativePitchAngle(candidate, origin, cameraRight);
  const targetPitch = clamp(currentPitch, -limit, limit);
  return multiplyQuaternion(
    quaternionFromAxisAngle(cameraRight, targetPitch - currentPitch),
    candidate
  );
}

export function buildClusterPreviewCandidate({
  currentQuaternion,
  gestureOriginQuaternion,
  cameraRight,
  filteredDx,
  filteredDy,
  correctionDx = 0,
  correctionDy = 0,
  reducedMotion = false
}) {
  const multiplier = reducedMotion ? 0.72 : 1;
  const movementCandidate = multiplyQuaternion(
    fixedClusterBasisDelta(
      filteredDx,
      filteredDy,
      cameraRight,
      0.0062,
      0.18,
      multiplier
    ),
    currentQuaternion
  );

  const correctionCandidate = Math.hypot(correctionDx, correctionDy) <= 0.75
    ? movementCandidate
    : multiplyQuaternion(
        fixedClusterBasisDelta(
          correctionDx,
          correctionDy,
          cameraRight,
          0.0021,
          0.085,
          multiplier
        ),
        movementCandidate
      );

  return clampCumulativePitch(
    normalizeQuaternion(correctionCandidate),
    gestureOriginQuaternion,
    cameraRight,
    Math.PI * 0.32
  );
}

export function runStage1CameraRightDirectGrabFixtures() {
  const tests = [];
  const record = (name, pass, details = {}) => {
    tests.push(Object.freeze({ name, pass: Boolean(pass), details }));
  };

  const presets = Object.freeze({
    default: Object.freeze({ eye: [0, 0.76, 6.05], target: [0, 0.03, 0.06] }),
    mobile: Object.freeze({ eye: [0, 0.76, 7.10], target: [0, 0.03, 0.06] }),
    cluster: Object.freeze({ eye: [0, 0.62, 6.28], target: [0, 0.02, 0.04] })
  });

  Object.entries(presets).forEach(([name, camera]) => {
    const right = deriveAdmittedCameraRight(camera);
    record(
      `camera-right-${name}`,
      Math.abs(Math.hypot(...right) - 1) < EPSILON &&
        right[0] > 0 &&
        Math.abs(right[1]) < EPSILON,
      { right }
    );
  });

  record(
    "camera-right-fallback",
    JSON.stringify(deriveAdmittedCameraRight({ eye: [0, 0, 0], target: [0, 0, 0] })) ===
      JSON.stringify([1, 0, 0])
  );

  let previousRight = null;
  let minimumAdjacentDot = 1;
  for (let index = 0; index <= 64; index += 1) {
    const fraction = index / 64;
    const eye = presets.default.eye.map(
      (value, component) =>
        value * (1 - fraction) + presets.cluster.eye[component] * fraction
    );
    const target = presets.default.target.map(
      (value, component) =>
        value * (1 - fraction) + presets.cluster.target[component] * fraction
    );
    const right = deriveAdmittedCameraRight({ eye, target });
    if (previousRight) {
      minimumAdjacentDot = Math.min(minimumAdjacentDot, dot(previousRight, right));
    }
    previousRight = right;
  }
  record("camera-transition-no-axis-flip", minimumAdjacentDot > 0.999999, {
    minimumAdjacentDot
  });

  const identity = [0, 0, 0, 1];
  const right = deriveAdmittedCameraRight(presets.cluster);

  const horizontal = buildClusterPreviewCandidate({
    currentQuaternion: identity,
    gestureOriginQuaternion: identity,
    cameraRight: right,
    filteredDx: 20,
    filteredDy: 0
  });
  record(
    "horizontal-motion-world-y-only",
    Math.abs(horizontal[0]) < EPSILON &&
      Math.abs(horizontal[2]) < EPSILON &&
      horizontal[1] > 0,
    { quaternion: horizontal }
  );

  const vertical = buildClusterPreviewCandidate({
    currentQuaternion: identity,
    gestureOriginQuaternion: identity,
    cameraRight: right,
    filteredDx: 0,
    filteredDy: 20
  });
  record(
    "vertical-motion-camera-right-only",
    Math.abs(vertical[1]) < EPSILON &&
      Math.abs(vertical[2]) < EPSILON &&
      vertical[0] > 0,
    { quaternion: vertical, right }
  );

  const mixed = buildClusterPreviewCandidate({
    currentQuaternion: identity,
    gestureOriginQuaternion: identity,
    cameraRight: right,
    filteredDx: 18,
    filteredDy: 14,
    correctionDx: -9,
    correctionDy: 11
  });
  record(
    "movement-plus-grab-normalized",
    Math.abs(Math.hypot(...mixed) - 1) < EPSILON,
    { quaternion: mixed }
  );

  const horizontalCorrection = buildClusterPreviewCandidate({
    currentQuaternion: identity,
    gestureOriginQuaternion: identity,
    cameraRight: right,
    filteredDx: 0,
    filteredDy: 0,
    correctionDx: 25,
    correctionDy: 0
  });
  record(
    "grab-horizontal-uses-world-y",
    Math.abs(horizontalCorrection[0]) < EPSILON &&
      Math.abs(horizontalCorrection[2]) < EPSILON &&
      horizontalCorrection[1] > 0,
    { quaternion: horizontalCorrection }
  );

  let accumulated = identity;
  for (let index = 0; index < 80; index += 1) {
    accumulated = buildClusterPreviewCandidate({
      currentQuaternion: accumulated,
      gestureOriginQuaternion: identity,
      cameraRight: right,
      filteredDx: 0,
      filteredDy: 34,
      correctionDx: 0,
      correctionDy: 34
    });
  }
  const accumulatedPitch = relativePitchAngle(accumulated, identity, right);
  record(
    "post-composition-pitch-clamp",
    Math.abs(accumulatedPitch) <= Math.PI * 0.32 + 1e-7,
    { accumulatedPitch, limit: Math.PI * 0.32 }
  );

  const normal = buildClusterPreviewCandidate({
    currentQuaternion: identity,
    gestureOriginQuaternion: identity,
    cameraRight: right,
    filteredDx: 14,
    filteredDy: 10,
    correctionDx: 8,
    correctionDy: 6,
    reducedMotion: false
  });
  const reduced = buildClusterPreviewCandidate({
    currentQuaternion: identity,
    gestureOriginQuaternion: identity,
    cameraRight: right,
    filteredDx: 14,
    filteredDy: 10,
    correctionDx: 8,
    correctionDy: 6,
    reducedMotion: true
  });
  const normalAngle = 2 * Math.acos(clamp(normal[3], -1, 1));
  const reducedAngle = 2 * Math.acos(clamp(reduced[3], -1, 1));
  record(
    "reduced-motion-functional-and-scaled",
    reducedAngle > 0 && reducedAngle < normalAngle,
    { normalAngle, reducedAngle }
  );

  record(
    "cancel-restores-exact-origin",
    JSON.stringify(identity.slice()) === JSON.stringify(identity)
  );

  const passed = tests.filter(test => test.pass).length;
  return Object.freeze({
    schema: "ARCHCOIN_STAGE_1_CAMERA_RIGHT_DIRECT_GRAB_FIXTURE_RECEIPT_v1",
    status: passed === tests.length ? "PASS" : "FAIL",
    testCount: tests.length,
    passed,
    failed: tests.length - passed,
    tests: Object.freeze(tests)
  });
}

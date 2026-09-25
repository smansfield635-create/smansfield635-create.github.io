import assert from 'node:assert/strict';

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));

const classifyTwoFingerMotion = (centerDeltaY, distanceDelta = 0) => {
  const pinchDominant = Math.abs(distanceDelta) >
    Math.max(3, Math.abs(centerDeltaY) * 0.65);

  if (pinchDominant && Math.abs(distanceDelta) >= 5) {
    return {
      action: distanceDelta > 0 ? 'ZOOM_IN' : 'ZOOM_OUT'
    };
  }

  if (Math.abs(centerDeltaY) >= 8) {
    return {
      action: centerDeltaY < 0 ? 'MOVE_FORWARD' : 'MOVE_BACKWARD',
      magnitude: clamp(Math.abs(centerDeltaY) / 10, 1, 10)
    };
  }

  return null;
};

const horizontalForward = (yawDegrees) => {
  const yaw = yawDegrees * Math.PI / 180;
  return { x: Math.sin(yaw), z: -Math.cos(yaw) };
};

const translation = (yawDegrees, action, magnitude) => {
  const forward = horizontalForward(yawDegrees);
  return action === 'MOVE_FORWARD'
    ? { x: forward.x * magnitude, z: forward.z * magnitude }
    : { x: -forward.x * magnitude, z: -forward.z * magnitude };
};

const cameraForward = (yawDegrees, pitchDegrees) => {
  const yaw = yawDegrees * Math.PI / 180;
  const pitch = pitchDegrees * Math.PI / 180;
  const horizontal = Math.cos(pitch);
  return {
    x: Math.sin(yaw) * horizontal,
    y: Math.sin(pitch),
    z: -Math.cos(yaw) * horizontal
  };
};

const dot = (left, right) =>
  left.x * right.x + (left.y ?? 0) * (right.y ?? 0) + left.z * right.z;

const cases = [];
for (const yawDegrees of [0, 18, 90, 180, 270]) {
  for (const pitchDegrees of [-8, 0, 20]) {
    const forwardIntent = classifyTwoFingerMotion(-20, 0);
    const backwardIntent = classifyTwoFingerMotion(20, 0);
    const forwardDisplacement = translation(
      yawDegrees,
      forwardIntent.action,
      forwardIntent.magnitude
    );
    const backwardDisplacement = translation(
      yawDegrees,
      backwardIntent.action,
      backwardIntent.magnitude
    );
    const forwardVector = cameraForward(yawDegrees, pitchDegrees);
    const forwardSignedTravel = dot(forwardDisplacement, forwardVector);
    const backwardSignedTravel = dot(backwardDisplacement, forwardVector);

    assert.equal(forwardIntent.action, 'MOVE_FORWARD');
    assert.equal(backwardIntent.action, 'MOVE_BACKWARD');
    assert.ok(forwardSignedTravel > 0);
    assert.ok(backwardSignedTravel < 0);
    assert.ok(Math.abs(forwardSignedTravel + backwardSignedTravel) < 1e-12);

    cases.push({
      yawDegrees,
      pitchDegrees,
      forwardIntent,
      backwardIntent,
      forwardSignedTravel,
      backwardSignedTravel
    });
  }
}

console.log(JSON.stringify({
  receiptType: 'H_EARTH_TOUCH_MOTION_CALIBRATION_CP2_BACKWARD_SIGN_RECEIPT',
  status: 'PASS',
  caseCount: cases.length,
  firstSignDivergence: 'NOT_REPRODUCED_IN_EXACT_SOURCE_FORMULAS',
  cases
}, null, 2));

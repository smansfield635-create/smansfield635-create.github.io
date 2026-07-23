import assert from "node:assert/strict";
import {
  NEUTRAL_REFERENCE_PROFILE,
  createProfile,
  validateProfile
} from "../../assets/compass-model/compass.profiles.js";

const results = [];

function test(name, operation) {
  try {
    operation();
    results.push(Object.freeze({ name, status: "PASS" }));
  } catch (error) {
    results.push(Object.freeze({
      name,
      status: "FAIL",
      error: error?.code || error?.message || String(error)
    }));
  }
}

function expectCode(code, operation) {
  assert.throws(operation, error => error?.code === code);
}

test("PARTIAL_SMOOTHING_OVERRIDE_PRESERVES_TOUCH_AND_PEN", () => {
  const profile = createProfile({
    interactions: {
      smoothing: {
        mouse: 0.4
      }
    }
  });

  assert.equal(profile.interactions.smoothing.mouse, 0.4);
  assert.equal(profile.interactions.smoothing.touch, 0.42);
  assert.equal(profile.interactions.smoothing.pen, 0.5);
});

test("PARTIAL_PRESENTATION_OVERRIDE_PRESERVES_OTHER_PRESENTATION", () => {
  const profile = createProfile({
    world: {
      radiiByPresentation: {
        CONSTELLATION: [1.2, 1.1, 1]
      }
    }
  });

  assert.deepEqual(
    profile.world.radiiByPresentation.CONSTELLATION,
    [1.2, 1.1, 1]
  );
  assert.deepEqual(
    profile.world.radiiByPresentation.CLUSTER,
    [0.82, 0.82, 0.82]
  );
});

test("UNKNOWN_PROFILE_FIELD_REJECTED", () => {
  expectCode("COMPASS_PROFILE_UNKNOWN_FIELD", () =>
    createProfile({ unknownSection: true })
  );
});

test("UNKNOWN_NESTED_PROFILE_FIELD_REJECTED", () => {
  expectCode("COMPASS_PROFILE_UNKNOWN_FIELD", () =>
    createProfile({
      interactions: {
        unknownParameter: 1
      }
    })
  );
});

test("NEGATIVE_RADIUS_REJECTED", () => {
  expectCode("COMPASS_PROFILE_RADIUS_NONPOSITIVE", () =>
    createProfile({
      world: {
        radiiByPresentation: {
          CLUSTER: [0.82, -0.2, 0.82]
        }
      }
    })
  );
});

test("ZERO_PRIMARY_ANCHOR_REJECTED", () => {
  expectCode("COMPASS_PROFILE_PRIMARY_ANCHOR_INVALID", () =>
    createProfile({
      world: {
        primaryAnchorByPresentation: {
          CLUSTER: [0, 0, 0]
        }
      }
    })
  );
});

test("INCOMPLETE_DIRECT_PROFILE_SMOOTHING_REJECTED", () => {
  const candidate = structuredClone(NEUTRAL_REFERENCE_PROFILE);
  delete candidate.interactions.smoothing.pen;

  expectCode("COMPASS_PROFILE_SMOOTHING_KEYS_INVALID", () =>
    validateProfile(candidate)
  );
});

test("DRAG_THRESHOLD_MUST_EXCEED_TAP_THRESHOLD", () => {
  expectCode(
    "COMPASS_PROFILE_DRAG_THRESHOLD_NOT_ABOVE_TAP_THRESHOLD",
    () =>
      createProfile({
        interactions: {
          tapMaximumDistancePx: 8,
          dragActivationDistancePx: 8
        }
      })
  );
});

test("REDUCED_MOTION_MULTIPLIER_MUST_REMAIN_FUNCTIONAL", () => {
  expectCode(
    "COMPASS_PROFILE_REDUCED_MOTION_MULTIPLIER_OUT_OF_RANGE",
    () =>
      createProfile({
        interactions: {
          reducedMotionMultiplier: 0
        }
      })
  );
});

test("DEPTH_CONVENTION_REQUIRED", () => {
  expectCode("COMPASS_PROFILE_DEPTH_CONVENTION_INVALID", () =>
    createProfile({
      compositor: {
        depthConvention: "NEGATIVE_CAMERA_Z"
      }
    })
  );
});

test("OPTIONAL_CAPABILITIES_MUST_BE_BOOLEAN", () => {
  expectCode("COMPASS_PROFILE_OPTIONAL_CAPABILITY_INVALID", () =>
    createProfile({
      optionalCapabilities: {
        directGrab: "enabled"
      }
    })
  );
});

test("PROFILE_IS_DEEPLY_IMMUTABLE", () => {
  const profile = createProfile();

  assert.equal(Object.isFrozen(profile), true);
  assert.equal(Object.isFrozen(profile.world), true);
  assert.equal(Object.isFrozen(profile.world.radiiByPresentation), true);
  assert.equal(
    Object.isFrozen(profile.world.radiiByPresentation.CONSTELLATION),
    true
  );
  assert.equal(Object.isFrozen(profile.interactions.smoothing), true);
  assert.equal(Object.isFrozen(profile.compositor.camera.eye), true);

  assert.throws(() => {
    profile.world.radiiByPresentation.CONSTELLATION[0] = 99;
  }, TypeError);
});

const failed = results.filter(result => result.status === "FAIL");

export const PROFILE_AUTHORITY_FIXTURE_RESULT = Object.freeze({
  schema: "UNIVERSAL_COMPASS_PROFILE_AUTHORITY_FIXTURE_RESULT_v1",
  status: failed.length === 0 ? "PASS" : "FAIL",
  testCount: results.length,
  passed: results.length - failed.length,
  failed: failed.length,
  results: Object.freeze(results)
});

if (failed.length > 0) {
  console.error(JSON.stringify(PROFILE_AUTHORITY_FIXTURE_RESULT, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify(PROFILE_AUTHORITY_FIXTURE_RESULT, null, 2));
}

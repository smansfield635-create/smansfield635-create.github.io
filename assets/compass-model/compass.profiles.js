import {
  CANONICAL_PRESENTATIONS,
  DEPTH_CONVENTION,
  POINTER_KIND,
  PRESENTATION,
  assertContract,
  assertExactKeys,
  assertFiniteNumber,
  assertFiniteVector,
  assertNonZeroVector3,
  assertPlainRecord,
  deepFreeze,
  validateCameraRecord
} from "./compass.contracts.js";

const PROFILE_KEYS = Object.freeze([
  "id",
  "world",
  "interactions",
  "compositor",
  "optionalCapabilities"
]);

const WORLD_KEYS = Object.freeze([
  "radiiByPresentation",
  "primaryAnchorByPresentation"
]);

const INTERACTION_KEYS = Object.freeze([
  "radiansPerPixel",
  "maximumIncrementalAngle",
  "smoothing",
  "reducedMotionMultiplier",
  "tapMaximumDistancePx",
  "dragActivationDistancePx",
  "tapMaximumDurationMs"
]);

const COMPOSITOR_KEYS = Object.freeze([
  "camera",
  "centerDepth",
  "depthHysteresis",
  "depthConvention"
]);

const OPTIONAL_CAPABILITY_KEYS = Object.freeze([
  "directGrab",
  "ambientMotion",
  "centerParticipant",
  "panelDescent",
  "passageObject"
]);

const POINTER_SMOOTHING_KEYS = Object.freeze([
  POINTER_KIND.MOUSE,
  POINTER_KIND.TOUCH,
  POINTER_KIND.PEN
]);

const PRESENTATION_KEYS = Object.freeze(CANONICAL_PRESENTATIONS);

const DEFAULT_PROFILE_SOURCE = {
  id: "NEUTRAL_REFERENCE_PROFILE",
  world: {
    radiiByPresentation: {
      [PRESENTATION.CONSTELLATION]: [1, 1, 1],
      [PRESENTATION.CLUSTER]: [0.82, 0.82, 0.82]
    },
    primaryAnchorByPresentation: {
      [PRESENTATION.CONSTELLATION]: [0, 0.78, 0.625],
      [PRESENTATION.CLUSTER]: [0, 0.70, 0.714]
    }
  },
  interactions: {
    radiansPerPixel: 0.0058,
    maximumIncrementalAngle: 0.18,
    smoothing: {
      [POINTER_KIND.MOUSE]: 0.58,
      [POINTER_KIND.TOUCH]: 0.42,
      [POINTER_KIND.PEN]: 0.5
    },
    reducedMotionMultiplier: 0.72,
    tapMaximumDistancePx: 6,
    dragActivationDistancePx: 8,
    tapMaximumDurationMs: 420
  },
  compositor: {
    camera: {
      eye: [0, 0.7, 6],
      target: [0, 0, 0],
      near: 0.1,
      far: 60
    },
    centerDepth: 6,
    depthHysteresis: 0.025,
    depthConvention: DEPTH_CONVENTION.POSITIVE_CAMERA_FORWARD_DISTANCE
  },
  optionalCapabilities: {
    directGrab: false,
    ambientMotion: false,
    centerParticipant: false,
    panelDescent: false,
    passageObject: false
  }
};

function cloneValue(value) {
  return structuredClone(value);
}

function mergeSchemaAware(base, override, path = "profile") {
  assertPlainRecord(base, "COMPASS_PROFILE_BASE_RECORD_INVALID");
  assertPlainRecord(override, "COMPASS_PROFILE_OVERRIDE_RECORD_INVALID");

  Object.keys(override).forEach(key => {
    assertContract(
      Object.prototype.hasOwnProperty.call(base, key),
      "COMPASS_PROFILE_UNKNOWN_FIELD",
      `${path}.${key}`
    );
  });

  const merged = {};

  Object.keys(base).forEach(key => {
    const baseValue = base[key];
    const hasOverride = Object.prototype.hasOwnProperty.call(override, key);
    const overrideValue = override[key];

    if (
      hasOverride &&
      baseValue !== null &&
      overrideValue !== null &&
      typeof baseValue === "object" &&
      typeof overrideValue === "object" &&
      !Array.isArray(baseValue) &&
      !Array.isArray(overrideValue)
    ) {
      merged[key] = mergeSchemaAware(
        baseValue,
        overrideValue,
        `${path}.${key}`
      );
      return;
    }

    merged[key] = hasOverride
      ? cloneValue(overrideValue)
      : cloneValue(baseValue);
  });

  return merged;
}

function validatePresentationMap(record, code) {
  assertExactKeys(record, PRESENTATION_KEYS, code);
}

function validateWorld(world) {
  assertExactKeys(world, WORLD_KEYS, "COMPASS_PROFILE_WORLD_KEYS_INVALID");
  validatePresentationMap(
    world.radiiByPresentation,
    "COMPASS_PROFILE_RADII_PRESENTATIONS_INVALID"
  );
  validatePresentationMap(
    world.primaryAnchorByPresentation,
    "COMPASS_PROFILE_ANCHOR_PRESENTATIONS_INVALID"
  );

  CANONICAL_PRESENTATIONS.forEach(presentation => {
    const radii = assertFiniteVector(
      world.radiiByPresentation[presentation],
      3,
      "COMPASS_PROFILE_RADII_INVALID"
    );
    assertContract(
      radii.every(radius => radius > 0),
      "COMPASS_PROFILE_RADIUS_NONPOSITIVE",
      Object.freeze({ presentation, radii })
    );
    assertNonZeroVector3(
      world.primaryAnchorByPresentation[presentation],
      "COMPASS_PROFILE_PRIMARY_ANCHOR_INVALID"
    );
  });
}

function validateInteractions(interactions) {
  assertExactKeys(
    interactions,
    INTERACTION_KEYS,
    "COMPASS_PROFILE_INTERACTION_KEYS_INVALID"
  );
  assertExactKeys(
    interactions.smoothing,
    POINTER_SMOOTHING_KEYS,
    "COMPASS_PROFILE_SMOOTHING_KEYS_INVALID"
  );

  const radiansPerPixel = assertFiniteNumber(
    interactions.radiansPerPixel,
    "COMPASS_PROFILE_RADIANS_PER_PIXEL_INVALID"
  );
  const maximumIncrementalAngle = assertFiniteNumber(
    interactions.maximumIncrementalAngle,
    "COMPASS_PROFILE_MAXIMUM_ANGLE_INVALID"
  );
  const reducedMotionMultiplier = assertFiniteNumber(
    interactions.reducedMotionMultiplier,
    "COMPASS_PROFILE_REDUCED_MOTION_MULTIPLIER_INVALID"
  );
  const tapMaximumDistancePx = assertFiniteNumber(
    interactions.tapMaximumDistancePx,
    "COMPASS_PROFILE_TAP_DISTANCE_INVALID"
  );
  const dragActivationDistancePx = assertFiniteNumber(
    interactions.dragActivationDistancePx,
    "COMPASS_PROFILE_DRAG_DISTANCE_INVALID"
  );
  const tapMaximumDurationMs = assertFiniteNumber(
    interactions.tapMaximumDurationMs,
    "COMPASS_PROFILE_TAP_DURATION_INVALID"
  );

  assertContract(radiansPerPixel > 0, "COMPASS_PROFILE_RADIANS_PER_PIXEL_NONPOSITIVE");
  assertContract(
    maximumIncrementalAngle > 0 && maximumIncrementalAngle <= Math.PI,
    "COMPASS_PROFILE_MAXIMUM_ANGLE_OUT_OF_RANGE"
  );
  assertContract(
    reducedMotionMultiplier > 0 && reducedMotionMultiplier <= 1,
    "COMPASS_PROFILE_REDUCED_MOTION_MULTIPLIER_OUT_OF_RANGE"
  );
  assertContract(tapMaximumDistancePx >= 0, "COMPASS_PROFILE_TAP_DISTANCE_NEGATIVE");
  assertContract(
    dragActivationDistancePx > tapMaximumDistancePx,
    "COMPASS_PROFILE_DRAG_THRESHOLD_NOT_ABOVE_TAP_THRESHOLD"
  );
  assertContract(tapMaximumDurationMs > 0, "COMPASS_PROFILE_TAP_DURATION_NONPOSITIVE");

  POINTER_SMOOTHING_KEYS.forEach(kind => {
    const smoothing = assertFiniteNumber(
      interactions.smoothing[kind],
      "COMPASS_PROFILE_SMOOTHING_INVALID"
    );
    assertContract(
      smoothing > 0 && smoothing <= 1,
      "COMPASS_PROFILE_SMOOTHING_OUT_OF_RANGE",
      Object.freeze({ kind, smoothing })
    );
  });
}

function validateCompositor(compositor) {
  assertExactKeys(
    compositor,
    COMPOSITOR_KEYS,
    "COMPASS_PROFILE_COMPOSITOR_KEYS_INVALID"
  );
  validateCameraRecord(compositor.camera);

  const centerDepth = assertFiniteNumber(
    compositor.centerDepth,
    "COMPASS_PROFILE_CENTER_DEPTH_INVALID"
  );
  const depthHysteresis = assertFiniteNumber(
    compositor.depthHysteresis,
    "COMPASS_PROFILE_DEPTH_HYSTERESIS_INVALID"
  );

  assertContract(centerDepth > 0, "COMPASS_PROFILE_CENTER_DEPTH_NONPOSITIVE");
  assertContract(depthHysteresis >= 0, "COMPASS_PROFILE_DEPTH_HYSTERESIS_NEGATIVE");
  assertContract(
    compositor.depthConvention ===
      DEPTH_CONVENTION.POSITIVE_CAMERA_FORWARD_DISTANCE,
    "COMPASS_PROFILE_DEPTH_CONVENTION_INVALID",
    compositor.depthConvention
  );
}

function validateOptionalCapabilities(optionalCapabilities) {
  assertExactKeys(
    optionalCapabilities,
    OPTIONAL_CAPABILITY_KEYS,
    "COMPASS_PROFILE_OPTIONAL_CAPABILITY_KEYS_INVALID"
  );

  OPTIONAL_CAPABILITY_KEYS.forEach(key => {
    assertContract(
      typeof optionalCapabilities[key] === "boolean",
      "COMPASS_PROFILE_OPTIONAL_CAPABILITY_INVALID",
      key
    );
  });
}

export function validateProfile(profile) {
  assertExactKeys(profile, PROFILE_KEYS, "COMPASS_PROFILE_KEYS_INVALID");
  assertContract(
    typeof profile.id === "string" && profile.id.trim().length > 0,
    "COMPASS_PROFILE_ID_REQUIRED"
  );

  validateWorld(profile.world);
  validateInteractions(profile.interactions);
  validateCompositor(profile.compositor);
  validateOptionalCapabilities(profile.optionalCapabilities);

  return deepFreeze(cloneValue(profile));
}

export function createProfile(overrides = {}) {
  assertPlainRecord(overrides, "COMPASS_PROFILE_OVERRIDES_INVALID");
  return validateProfile(
    mergeSchemaAware(DEFAULT_PROFILE_SOURCE, overrides)
  );
}

export const NEUTRAL_REFERENCE_PROFILE = createProfile();

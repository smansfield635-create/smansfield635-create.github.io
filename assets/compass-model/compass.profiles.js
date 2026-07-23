import {
  POINTER_KIND,
  PRESENTATION,
  assertContract
} from "./compass.contracts.js";

const DEFAULT_PROFILE = Object.freeze({
  id: "NEUTRAL_REFERENCE_PROFILE",
  world: Object.freeze({
    radiiByPresentation: Object.freeze({
      [PRESENTATION.CONSTELLATION]: Object.freeze([1, 1, 1]),
      [PRESENTATION.CLUSTER]: Object.freeze([0.82, 0.82, 0.82])
    }),
    primaryAnchorByPresentation: Object.freeze({
      [PRESENTATION.CONSTELLATION]: Object.freeze([0, 0.78, 0.625]),
      [PRESENTATION.CLUSTER]: Object.freeze([0, 0.70, 0.714])
    })
  }),
  interactions: Object.freeze({
    radiansPerPixel: 0.0058,
    maximumIncrementalAngle: 0.18,
    smoothing: Object.freeze({
      [POINTER_KIND.MOUSE]: 0.58,
      [POINTER_KIND.TOUCH]: 0.42,
      [POINTER_KIND.PEN]: 0.5
    })
  }),
  compositor: Object.freeze({
    camera: Object.freeze({
      eye: Object.freeze([0, 0.7, 6]),
      target: Object.freeze([0, 0, 0]),
      near: 0.1,
      far: 60
    }),
    centerDepth: 6,
    depthHysteresis: 0.025
  }),
  optionalCapabilities: Object.freeze({
    directGrab: false,
    ambientMotion: false,
    centerParticipant: false,
    panelDescent: false,
    passageObject: false
  })
});

export function validateProfile(profile) {
  assertContract(profile && profile.id, "COMPASS_PROFILE_ID_REQUIRED");
  assertContract(
    profile.world && profile.interactions && profile.compositor,
    "COMPASS_PROFILE_SECTIONS_REQUIRED"
  );
  return Object.freeze(profile);
}

export function createProfile(overrides = {}) {
  return validateProfile({
    ...DEFAULT_PROFILE,
    ...overrides,
    world: {
      ...DEFAULT_PROFILE.world,
      ...(overrides.world || {})
    },
    interactions: {
      ...DEFAULT_PROFILE.interactions,
      ...(overrides.interactions || {})
    },
    compositor: {
      ...DEFAULT_PROFILE.compositor,
      ...(overrides.compositor || {})
    },
    optionalCapabilities: {
      ...DEFAULT_PROFILE.optionalCapabilities,
      ...(overrides.optionalCapabilities || {})
    }
  });
}

export const NEUTRAL_REFERENCE_PROFILE = createProfile();

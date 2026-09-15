const deepFreeze = (value) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const nested of Object.values(value)) deepFreeze(nested);
  return Object.freeze(value);
};

const roundDeterministic = (value) => Number(value.toFixed(9));

export const H_EARTH_CINEMATIC_CAMERA_MANIFEST_SCHEMA =
  'H_EARTH_CINEMATIC_CAMERA_MANIFEST_v1';

export const H_EARTH_CINEMATIC_CAMERA_OPERATION_ID =
  'H_EARTH_CINEMATIC_CAMERA_FEASIBILITY_20260915_001';

export const H_EARTH_CINEMATIC_CAMERA_GOVERNING_HEAD =
  '3c5b7ece95bb6d642e527737bb60647c032e29dd';

export const H_EARTH_CINEMATIC_CAMERA_WORLD_IDENTITY =
  'main@3c5b7ece95bb6d642e527737bb60647c032e29dd|admitted-geometry-frame@c45ed4482f0d653c4a51ea838c191f36e7769d26|region-summits@fcb090e5c1b46fa179a406e7b10688ab8bde7e68';

export const H_EARTH_CINEMATIC_CAMERA_RENDERER_IDENTITY =
  'renderer@799d37cec5244e6aa19b7d94dffe37e182b85884';

export const H_EARTH_CINEMATIC_CAMERA_COMPOSITOR_IDENTITY =
  'compositor@3764f0d53b0564de7a5e983bd339dda75017bc82';

const FIXED_UP = deepFreeze({ x: 0, y: 1, z: 0 });
const FIXED_VERTICAL_FOV_DEGREES = 56;
const FIXED_NEAR_PLANE = 0.25;
const FIXED_FAR_PLANE = 512;

export const H_EARTH_CINEMATIC_CAMERA_POSES = deepFreeze([
  {
    frame: 720,
    role: 'ENTRY',
    position: { x: 28, y: 10.5, z: -82 },
    target: { x: -34, y: 5.5, z: -214 },
    up: FIXED_UP,
    verticalFovDegrees: FIXED_VERTICAL_FOV_DEGREES,
    nearPlane: FIXED_NEAR_PLANE,
    farPlane: FIXED_FAR_PLANE
  },
  {
    frame: 780,
    role: 'APPROACH',
    position: { x: 22, y: 18, z: -108 },
    target: { x: -25, y: 7, z: -205 },
    up: FIXED_UP,
    verticalFovDegrees: FIXED_VERTICAL_FOV_DEGREES,
    nearPlane: FIXED_NEAR_PLANE,
    farPlane: FIXED_FAR_PLANE
  },
  {
    frame: 840,
    role: 'ASCENT',
    position: { x: 15, y: 27, z: -132 },
    target: { x: -16, y: 9, z: -196 },
    up: FIXED_UP,
    verticalFovDegrees: FIXED_VERTICAL_FOV_DEGREES,
    nearPlane: FIXED_NEAR_PLANE,
    farPlane: FIXED_FAR_PLANE
  },
  {
    frame: 900,
    role: 'SUMMIT_REVEAL',
    position: { x: 8, y: 36, z: -153 },
    target: { x: -8, y: 11, z: -187 },
    up: FIXED_UP,
    verticalFovDegrees: FIXED_VERTICAL_FOV_DEGREES,
    nearPlane: FIXED_NEAR_PLANE,
    farPlane: FIXED_FAR_PLANE
  },
  {
    frame: 959,
    role: 'SUMMIT_HOLD',
    position: { x: 2, y: 44, z: -168 },
    target: { x: 0, y: 12, z: -180 },
    up: FIXED_UP,
    verticalFovDegrees: FIXED_VERTICAL_FOV_DEGREES,
    nearPlane: FIXED_NEAR_PLANE,
    farPlane: FIXED_FAR_PLANE
  }
]);

const FRAME_KEYS = H_EARTH_CINEMATIC_CAMERA_POSES.map((pose) => pose.frame);

const tangentAt = (values, index) => {
  if (index === 0) {
    return (values[1] - values[0]) / (FRAME_KEYS[1] - FRAME_KEYS[0]);
  }
  if (index === values.length - 1) {
    const last = values.length - 1;
    return (values[last] - values[last - 1]) / (FRAME_KEYS[last] - FRAME_KEYS[last - 1]);
  }
  return (values[index + 1] - values[index - 1]) /
    (FRAME_KEYS[index + 1] - FRAME_KEYS[index - 1]);
};

const interpolateHermite = (values, frame) => {
  if (frame === FRAME_KEYS[0]) return values[0];
  if (frame === FRAME_KEYS[FRAME_KEYS.length - 1]) return values[values.length - 1];

  let segment = 0;
  while (!(frame >= FRAME_KEYS[segment] && frame <= FRAME_KEYS[segment + 1])) {
    segment += 1;
  }

  const frame0 = FRAME_KEYS[segment];
  const frame1 = FRAME_KEYS[segment + 1];
  const span = frame1 - frame0;
  const t = (frame - frame0) / span;
  const t2 = t * t;
  const t3 = t2 * t;

  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;

  const m0 = tangentAt(values, segment);
  const m1 = tangentAt(values, segment + 1);

  return roundDeterministic(
    h00 * values[segment] +
    h10 * span * m0 +
    h01 * values[segment + 1] +
    h11 * span * m1
  );
};

const interpolateVector = (field, frame) => {
  const coordinateValues = (axis) =>
    H_EARTH_CINEMATIC_CAMERA_POSES.map((pose) => pose[field][axis]);

  return deepFreeze({
    x: interpolateHermite(coordinateValues('x'), frame),
    y: interpolateHermite(coordinateValues('y'), frame),
    z: interpolateHermite(coordinateValues('z'), frame)
  });
};

const createState = (frame) => deepFreeze({
  frame,
  position: interpolateVector('position', frame),
  target: interpolateVector('target', frame),
  up: FIXED_UP,
  verticalFovDegrees: FIXED_VERTICAL_FOV_DEGREES,
  nearPlane: FIXED_NEAR_PLANE,
  farPlane: FIXED_FAR_PLANE,
  worldIdentity: H_EARTH_CINEMATIC_CAMERA_WORLD_IDENTITY,
  rendererIdentity: H_EARTH_CINEMATIC_CAMERA_RENDERER_IDENTITY,
  compositorIdentity: H_EARTH_CINEMATIC_CAMERA_COMPOSITOR_IDENTITY
});

export const H_EARTH_CINEMATIC_CAMERA_STATES = deepFreeze(
  Array.from({ length: 240 }, (_, index) => createState(720 + index))
);

export const H_EARTH_CINEMATIC_CAMERA_MANIFEST_IDENTITY = deepFreeze({
  schema: H_EARTH_CINEMATIC_CAMERA_MANIFEST_SCHEMA,
  operationId: H_EARTH_CINEMATIC_CAMERA_OPERATION_ID,
  governingHead: H_EARTH_CINEMATIC_CAMERA_GOVERNING_HEAD,
  branch: 'agent/h-earth-cinematic-camera-feasibility-20260915-001',
  masterFrameStart: 720,
  masterFrameEnd: 959,
  masterFrameCount: 240,
  fps: 30,
  viewport: { width: 1280, height: 720 },
  poseFrames: FRAME_KEYS,
  interpolation: 'PIECEWISE_CUBIC_HERMITE_C1_FRAME_PARAMETERIZED',
  numericRoundingDecimals: 9,
  fixedProjection: {
    up: FIXED_UP,
    verticalFovDegrees: FIXED_VERTICAL_FOV_DEGREES,
    nearPlane: FIXED_NEAR_PLANE,
    farPlane: FIXED_FAR_PLANE
  },
  worldIdentity: H_EARTH_CINEMATIC_CAMERA_WORLD_IDENTITY,
  rendererIdentity: H_EARTH_CINEMATIC_CAMERA_RENDERER_IDENTITY,
  compositorIdentity: H_EARTH_CINEMATIC_CAMERA_COMPOSITOR_IDENTITY
});

const canonicalize = (value) => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((output, key) => {
        output[key] = canonicalize(value[key]);
        return output;
      }, {});
  }
  return value;
};

export const H_EARTH_CINEMATIC_CAMERA_MANIFEST = deepFreeze({
  identity: H_EARTH_CINEMATIC_CAMERA_MANIFEST_IDENTITY,
  poses: H_EARTH_CINEMATIC_CAMERA_POSES,
  states: H_EARTH_CINEMATIC_CAMERA_STATES
});

export const H_EARTH_CINEMATIC_CAMERA_MANIFEST_SERIALIZED =
  JSON.stringify(canonicalize(H_EARTH_CINEMATIC_CAMERA_MANIFEST));

export const H_EARTH_CINEMATIC_CAMERA_MANIFEST_SHA256 =
  '0af6698f58c1ba6b142d53791a131af8725bdd8dab0a1ba4e07e9abde5e9fec1';

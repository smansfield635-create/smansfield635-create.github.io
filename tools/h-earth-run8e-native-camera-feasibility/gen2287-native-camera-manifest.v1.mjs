const deepFreeze = (value) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  for (const nested of Object.values(value)) {
    deepFreeze(nested);
  }

  return Object.freeze(value);
};

const round6 = (value) => Number(value.toFixed(6));
const smoothstep = (progress) => progress * progress * (3 - 2 * progress);

export const H_EARTH_NATIVE_CAMERA_FEASIBILITY_MANIFEST_SCHEMA =
  'H_EARTH_NATIVE_CAMERA_FEASIBILITY_MANIFEST_v1';

export const H_EARTH_NATIVE_CAMERA_FEASIBILITY_GOVERNING_HEAD =
  '3c5b7ece95bb6d642e527737bb60647c032e29dd';

export const H_EARTH_NATIVE_CAMERA_FEASIBILITY_DONORS = deepFreeze({
  compositor: {
    path: 'showroom/globe/h-earth/compositor.js',
    blob: '3764f0d53b0564de7a5e983bd339dda75017bc82'
  },
  capacity: {
    path: 'showroom/globe/h-earth/capacity.js',
    blob: '89e4622bb9c30b533a1d13d7db887ee53e7a46c8'
  },
  renderer: {
    path: 'showroom/globe/h-earth/renderer.js',
    blob: '799d37cec5244e6aa19b7d94dffe37e182b85884'
  }
});

export const H_EARTH_NATIVE_CAMERA_STATE_SCHEMA = deepFreeze({
  exactKeys: [
    'yawDegrees',
    'pitchDegrees',
    'zoomScale',
    'target',
    'verticalFovDegrees',
    'nearPlane',
    'farPlane'
  ],
  targetExactKeys: ['x', 'y', 'z'],
  semantics: {
    target:
      'COMPOSITOR_NATIVE_GROUND_OBSERVER_ANCHOR_INPUT_NOT_RESOLVED_LOOK_TARGET',
    eyeHeight:
      'FIXED_FROM_INITIAL_PROJECTION_POSITION_Y',
    eyeHeightValue: 10.5,
    lookDistance:
      'FIXED_MIN_INITIAL_DISTANCE_16_WORLD_UNITS',
    lookDistanceValue: 16,
    verticalFov:
      'INITIAL_56_DEGREES_MULTIPLIED_BY_ZOOM_SCALE_AND_CLAMPED_TO_CAPACITY',
    nearPlane:
      'FIXED_INITIAL_PROJECTION_VALUE',
    nearPlaneValue: 0.25,
    farPlane:
      'FIXED_INITIAL_PROJECTION_VALUE',
    farPlaneValue: 512,
    up:
      'RESOLVED_FROM_FIXED_WORLD_UP_AND_FORWARD_BASIS',
    arbitraryWorldPositionInputPermitted: false,
    predecessorFreePositionPoseReusePermitted: false
  },
  bounds: {
    yawDegrees: { minimum: -180, maximum: 180 },
    pitchDegrees: { minimum: -80, maximum: 80 },
    zoomScale: { minimum: 0.72, maximum: 1.42 },
    target: {
      x: { minimum: -96, maximum: 96 },
      y: { minimum: -32, maximum: 32 },
      z: { minimum: -256, maximum: 24 }
    },
    verticalFovDegrees: { minimum: 38, maximum: 68 }
  }
});

export const H_EARTH_NATIVE_CAMERA_ANCHOR_FRAMES =
  Object.freeze([720, 780, 840, 900, 959]);

export const H_EARTH_NATIVE_CAMERA_ANCHORS = deepFreeze([
  {
    frame: 720,
    source: 'CURRENT_COMPOSITOR_INITIAL_CAMERA_STATE_DERIVATION',
    cameraState: {
      yawDegrees: 25.159302,
      pitchDegrees: 1.963628,
      zoomScale: 1,
      target: { x: 28, y: 10.5, z: -82 },
      verticalFovDegrees: 56,
      nearPlane: 0.25,
      farPlane: 512
    }
  },
  {
    frame: 780,
    source: 'NATIVE_GROUND_OBSERVER_AUTHORED_APPROACH',
    cameraState: {
      yawDegrees: 8,
      pitchDegrees: -12,
      zoomScale: 0.96,
      target: { x: 22, y: 10.5, z: -102 },
      verticalFovDegrees: 53.76,
      nearPlane: 0.25,
      farPlane: 512
    }
  },
  {
    frame: 840,
    source: 'NATIVE_GROUND_OBSERVER_AUTHORED_APPROACH',
    cameraState: {
      yawDegrees: 5,
      pitchDegrees: -16,
      zoomScale: 0.92,
      target: { x: 14, y: 10.5, z: -122 },
      verticalFovDegrees: 51.52,
      nearPlane: 0.25,
      farPlane: 512
    }
  },
  {
    frame: 900,
    source: 'NATIVE_GROUND_OBSERVER_AUTHORED_APPROACH',
    cameraState: {
      yawDegrees: 2,
      pitchDegrees: -20,
      zoomScale: 0.88,
      target: { x: 6, y: 10.5, z: -142 },
      verticalFovDegrees: 49.28,
      nearPlane: 0.25,
      farPlane: 512
    }
  },
  {
    frame: 959,
    source: 'NATIVE_GROUND_OBSERVER_AUTHORED_APPROACH',
    cameraState: {
      yawDegrees: 0,
      pitchDegrees: -24,
      zoomScale: 0.84,
      target: { x: 0, y: 10.5, z: -160 },
      verticalFovDegrees: 47.04,
      nearPlane: 0.25,
      farPlane: 512
    }
  }
]);

const interpolateCameraState = (left, right, progress) => {
  const weight = smoothstep(progress);
  const interpolate = (a, b) => round6(a + (b - a) * weight);

  const zoomScale = interpolate(left.zoomScale, right.zoomScale);

  return deepFreeze({
    yawDegrees: interpolate(left.yawDegrees, right.yawDegrees),
    pitchDegrees: interpolate(left.pitchDegrees, right.pitchDegrees),
    zoomScale,
    target: {
      x: interpolate(left.target.x, right.target.x),
      y: 10.5,
      z: interpolate(left.target.z, right.target.z)
    },
    verticalFovDegrees: round6(56 * zoomScale),
    nearPlane: 0.25,
    farPlane: 512
  });
};

const buildCameraStateForFrame = (frame) => {
  if (frame === H_EARTH_NATIVE_CAMERA_ANCHORS.at(-1).frame) {
    return H_EARTH_NATIVE_CAMERA_ANCHORS.at(-1).cameraState;
  }

  for (let index = 0; index < H_EARTH_NATIVE_CAMERA_ANCHORS.length - 1; index += 1) {
    const left = H_EARTH_NATIVE_CAMERA_ANCHORS[index];
    const right = H_EARTH_NATIVE_CAMERA_ANCHORS[index + 1];

    if (frame >= left.frame && frame <= right.frame) {
      const progress = (frame - left.frame) / (right.frame - left.frame);
      return interpolateCameraState(left.cameraState, right.cameraState, progress);
    }
  }

  throw new RangeError(`Frame ${frame} is outside the frozen 720..959 manifest range.`);
};

export const H_EARTH_NATIVE_CAMERA_STATES = deepFreeze(
  Array.from({ length: 240 }, (_, offset) => {
    const frame = 720 + offset;
    return {
      frame,
      cameraState: buildCameraStateForFrame(frame)
    };
  })
);

export const H_EARTH_NATIVE_CAMERA_SPARSE_FRAMES =
  Object.freeze(Array.from({ length: 30 }, (_, index) => 720 + 8 * index));

export const H_EARTH_NATIVE_CAMERA_SHARDS = deepFreeze(
  Array.from({ length: 8 }, (_, index) => ({
    shard: index + 1,
    firstFrame: 720 + index * 30,
    lastFrame: 749 + index * 30,
    frameCount: 30
  }))
);

const fixed6 = (value) => Number(value).toFixed(6);

export function buildHEarthNativeCameraCanonicalManifestString() {
  const lines = [
    `schema=${H_EARTH_NATIVE_CAMERA_FEASIBILITY_MANIFEST_SCHEMA}`,
    `governingHead=${H_EARTH_NATIVE_CAMERA_FEASIBILITY_GOVERNING_HEAD}`,
    `compositorBlob=${H_EARTH_NATIVE_CAMERA_FEASIBILITY_DONORS.compositor.blob}`,
    `capacityBlob=${H_EARTH_NATIVE_CAMERA_FEASIBILITY_DONORS.capacity.blob}`,
    `rendererBlob=${H_EARTH_NATIVE_CAMERA_FEASIBILITY_DONORS.renderer.blob}`,
    'frameRange=720-959',
    'frameCount=240',
    'viewport=1280x720',
    'stateColumns=frame,yawDegrees,pitchDegrees,zoomScale,target.x,target.y,target.z,verticalFovDegrees,nearPlane,farPlane'
  ];

  for (const record of H_EARTH_NATIVE_CAMERA_STATES) {
    const state = record.cameraState;
    lines.push([
      record.frame,
      fixed6(state.yawDegrees),
      fixed6(state.pitchDegrees),
      fixed6(state.zoomScale),
      fixed6(state.target.x),
      fixed6(state.target.y),
      fixed6(state.target.z),
      fixed6(state.verticalFovDegrees),
      fixed6(state.nearPlane),
      fixed6(state.farPlane)
    ].join('|'));
  }

  return lines.join('\n');
}

export const H_EARTH_NATIVE_CAMERA_MANIFEST_SHA256 =
  '226fdb529f27e4f6f6dfe37b88effbdcbe0d9ff0f9e3c8e1723bfcf6db2e7c92';

export const H_EARTH_NATIVE_CAMERA_FEASIBILITY_MANIFEST = deepFreeze({
  schema: H_EARTH_NATIVE_CAMERA_FEASIBILITY_MANIFEST_SCHEMA,
  governingHead: H_EARTH_NATIVE_CAMERA_FEASIBILITY_GOVERNING_HEAD,
  donors: H_EARTH_NATIVE_CAMERA_FEASIBILITY_DONORS,
  viewport: { widthPx: 1280, heightPx: 720, pixelRatio: 1 },
  frameRange: { firstFrame: 720, lastFrame: 959, frameCount: 240, fps: 30 },
  nativeCameraStateSchema: H_EARTH_NATIVE_CAMERA_STATE_SCHEMA,
  anchorFrames: H_EARTH_NATIVE_CAMERA_ANCHOR_FRAMES,
  anchors: H_EARTH_NATIVE_CAMERA_ANCHORS,
  states: H_EARTH_NATIVE_CAMERA_STATES,
  sparseFrames: H_EARTH_NATIVE_CAMERA_SPARSE_FRAMES,
  shards: H_EARTH_NATIVE_CAMERA_SHARDS,
  canonicalSha256: H_EARTH_NATIVE_CAMERA_MANIFEST_SHA256,
  predecessorFreePositionSemanticsReused: false,
  productRuntimeMutationRequired: false
});

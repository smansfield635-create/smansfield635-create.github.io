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

export const H_EARTH_NATIVE_CAMERA_INTERPOLATION_LAW_ID =
  'RUN8E_ANCHOR_PRESERVING_MONOTONE_C1_HERMITE_V1';

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

const unwrapDegrees = (values) => {
  const unwrapped = [values[0]];

  for (let index = 1; index < values.length; index += 1) {
    let value = values[index];
    const previous = unwrapped[index - 1];

    while (value - previous > 180) value -= 360;
    while (value - previous < -180) value += 360;

    unwrapped.push(value);
  }

  return Object.freeze(unwrapped);
};

const segmentDurations = Object.freeze(
  H_EARTH_NATIVE_CAMERA_ANCHORS
    .slice(0, -1)
    .map((anchor, index) => H_EARTH_NATIVE_CAMERA_ANCHORS[index + 1].frame - anchor.frame)
);

const weightedHarmonicMean = (previousSecant, nextSecant, previousDuration, nextDuration) => {
  if (previousSecant * nextSecant <= 0) return 0;

  const weight1 = 2 * nextDuration + previousDuration;
  const weight2 = nextDuration + 2 * previousDuration;

  return (
    (weight1 + weight2) /
    (weight1 / previousSecant + weight2 / nextSecant)
  );
};

const buildTangents = (values) => {
  const secants = segmentDurations.map(
    (duration, index) => (values[index + 1] - values[index]) / duration
  );

  const tangents = [0];

  for (let index = 1; index < values.length - 1; index += 1) {
    tangents.push(
      weightedHarmonicMean(
        secants[index - 1],
        secants[index],
        segmentDurations[index - 1],
        segmentDurations[index]
      )
    );
  }

  tangents.push(0);
  return Object.freeze(tangents);
};

const yawDegreesUnwrapped = unwrapDegrees(
  H_EARTH_NATIVE_CAMERA_ANCHORS.map((anchor) => anchor.cameraState.yawDegrees)
);

const cameraSeries = deepFreeze({
  yawDegrees: {
    values: yawDegreesUnwrapped,
    tangents: buildTangents(yawDegreesUnwrapped)
  },
  pitchDegrees: {
    values: H_EARTH_NATIVE_CAMERA_ANCHORS.map((anchor) => anchor.cameraState.pitchDegrees),
    tangents: buildTangents(H_EARTH_NATIVE_CAMERA_ANCHORS.map((anchor) => anchor.cameraState.pitchDegrees))
  },
  zoomScale: {
    values: H_EARTH_NATIVE_CAMERA_ANCHORS.map((anchor) => anchor.cameraState.zoomScale),
    tangents: buildTangents(H_EARTH_NATIVE_CAMERA_ANCHORS.map((anchor) => anchor.cameraState.zoomScale))
  },
  targetX: {
    values: H_EARTH_NATIVE_CAMERA_ANCHORS.map((anchor) => anchor.cameraState.target.x),
    tangents: buildTangents(H_EARTH_NATIVE_CAMERA_ANCHORS.map((anchor) => anchor.cameraState.target.x))
  },
  targetZ: {
    values: H_EARTH_NATIVE_CAMERA_ANCHORS.map((anchor) => anchor.cameraState.target.z),
    tangents: buildTangents(H_EARTH_NATIVE_CAMERA_ANCHORS.map((anchor) => anchor.cameraState.target.z))
  }
});

export const H_EARTH_NATIVE_CAMERA_TANGENT_LEDGER = deepFreeze(
  H_EARTH_NATIVE_CAMERA_ANCHORS.map((anchor, index) => ({
    frame: anchor.frame,
    yawDegreesPerFrame: cameraSeries.yawDegrees.tangents[index],
    pitchDegreesPerFrame: cameraSeries.pitchDegrees.tangents[index],
    zoomScalePerFrame: cameraSeries.zoomScale.tangents[index],
    targetXPerFrame: cameraSeries.targetX.tangents[index],
    targetZPerFrame: cameraSeries.targetZ.tangents[index],
    verticalFovDegreesPerFrame: 56 * cameraSeries.zoomScale.tangents[index]
  }))
);

const interpolateHermite = (series, leftIndex, progress) => {
  const duration = segmentDurations[leftIndex];
  const value0 = series.values[leftIndex];
  const value1 = series.values[leftIndex + 1];
  const tangent0 = series.tangents[leftIndex];
  const tangent1 = series.tangents[leftIndex + 1];
  const u2 = progress * progress;
  const u3 = u2 * progress;
  const h00 = 2 * u3 - 3 * u2 + 1;
  const h10 = u3 - 2 * u2 + progress;
  const h01 = -2 * u3 + 3 * u2;
  const h11 = u3 - u2;

  return h00 * value0 + h10 * duration * tangent0 + h01 * value1 + h11 * duration * tangent1;
};

const interpolateCameraState = (leftIndex, progress) => {
  const zoomScale = round6(interpolateHermite(cameraSeries.zoomScale, leftIndex, progress));

  return deepFreeze({
    yawDegrees: round6(interpolateHermite(cameraSeries.yawDegrees, leftIndex, progress)),
    pitchDegrees: round6(interpolateHermite(cameraSeries.pitchDegrees, leftIndex, progress)),
    zoomScale,
    target: {
      x: round6(interpolateHermite(cameraSeries.targetX, leftIndex, progress)),
      y: 10.5,
      z: round6(interpolateHermite(cameraSeries.targetZ, leftIndex, progress))
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

    if (frame === left.frame) return left.cameraState;
    if (frame === right.frame) return right.cameraState;

    if (frame > left.frame && frame < right.frame) {
      const progress = (frame - left.frame) / (right.frame - left.frame);
      return interpolateCameraState(index, progress);
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
    `interpolationLaw=${H_EARTH_NATIVE_CAMERA_INTERPOLATION_LAW_ID}`,
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
  '555d1d815a834503c6ed97f27f330bae28341b242058663e371f36d7e056de16';

export const H_EARTH_NATIVE_CAMERA_FEASIBILITY_MANIFEST = deepFreeze({
  schema: H_EARTH_NATIVE_CAMERA_FEASIBILITY_MANIFEST_SCHEMA,
  governingHead: H_EARTH_NATIVE_CAMERA_FEASIBILITY_GOVERNING_HEAD,
  donors: H_EARTH_NATIVE_CAMERA_FEASIBILITY_DONORS,
  viewport: { widthPx: 1280, heightPx: 720, pixelRatio: 1 },
  frameRange: { firstFrame: 720, lastFrame: 959, frameCount: 240, fps: 30 },
  nativeCameraStateSchema: H_EARTH_NATIVE_CAMERA_STATE_SCHEMA,
  interpolationLawId: H_EARTH_NATIVE_CAMERA_INTERPOLATION_LAW_ID,
  tangentLedger: H_EARTH_NATIVE_CAMERA_TANGENT_LEDGER,
  anchorFrames: H_EARTH_NATIVE_CAMERA_ANCHOR_FRAMES,
  anchors: H_EARTH_NATIVE_CAMERA_ANCHORS,
  states: H_EARTH_NATIVE_CAMERA_STATES,
  sparseFrames: H_EARTH_NATIVE_CAMERA_SPARSE_FRAMES,
  shards: H_EARTH_NATIVE_CAMERA_SHARDS,
  canonicalSha256: H_EARTH_NATIVE_CAMERA_MANIFEST_SHA256,
  predecessorFreePositionSemanticsReused: false,
  productRuntimeMutationRequired: false
});

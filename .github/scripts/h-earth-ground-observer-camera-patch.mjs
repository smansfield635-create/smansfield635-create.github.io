import fs from 'node:fs';

const compositorPath = 'showroom/globe/h-earth/compositor.js';
const indexPath = 'showroom/globe/h-earth/index.js';

let compositor = fs.readFileSync(compositorPath, 'utf8');
let index = fs.readFileSync(indexPath, 'utf8');

function replaceExact(source, oldText, newText, label) {
  const first = source.indexOf(oldText);
  const last = source.lastIndexOf(oldText);
  if (first < 0 || first !== last) {
    throw new Error(`${label}_EXPECTED_EXACTLY_ONCE:first=${first}:last=${last}`);
  }
  return source.slice(0, first) + newText + source.slice(first + oldText.length);
}

function replaceBetween(source, startMarker, endMarker, newText, label) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0 || source.indexOf(startMarker, start + 1) >= 0) {
    throw new Error(`${label}_BOUNDARY_NOT_UNIQUE:start=${start}:end=${end}`);
  }
  return source.slice(0, start) + newText + '\n\n' + source.slice(end);
}

compositor = replaceExact(
  compositor,
  "'MODEL_A_EXACT_BACKED_AUTHORITY_CONSUMPTION_RENEWAL_CANDIDATE'",
  "'MODEL_A_GROUND_OBSERVER_CAMERA_AUTHORITY_RENEWAL_CANDIDATE'",
  'COMPOSITOR_STATUS'
);

const section06 = '\n\n/* ==========================================================================\n * 06 · PUBLIC SCHEMAS';
const observerConstants = `

const GROUND_OBSERVER_EYE_HEIGHT =
  clamp(
    INITIAL_POSITION.y,
    POSITION_BOUNDS.yMin,
    POSITION_BOUNDS.yMax
  );

const GROUND_OBSERVER_INITIAL_ANCHOR =
  createVector(
    clamp(
      INITIAL_POSITION.x,
      Math.max(
        TARGET_BOUNDS.xMin,
        POSITION_BOUNDS.xMin
      ),
      Math.min(
        TARGET_BOUNDS.xMax,
        POSITION_BOUNDS.xMax
      )
    ),
    GROUND_OBSERVER_EYE_HEIGHT,
    clamp(
      INITIAL_POSITION.z,
      Math.max(
        TARGET_BOUNDS.zMin,
        POSITION_BOUNDS.zMin
      ),
      Math.min(
        TARGET_BOUNDS.zMax,
        POSITION_BOUNDS.zMax
      )
    )
  );

const GROUND_OBSERVER_PITCH_BOUNDS =
  deepFreeze({
    minimum:
      Math.max(
        PITCH_BOUNDS.minimum,
        -85
      ),
    maximum:
      Math.min(
        PITCH_BOUNDS.maximum,
        85
      )
  });

const GROUND_OBSERVER_LOOK_DISTANCE =
  Math.max(
    INITIAL_DISTANCE,
    1
  );
`;

compositor = replaceExact(
  compositor,
  section06,
  observerConstants + section06,
  'GROUND_OBSERVER_CONSTANT_INSERTION'
);

const initialCameraStart =
  'export const H_EARTH_3D_COMPOSITOR_INITIAL_CAMERA_STATE =';
const initialCameraEnd =
  'export const H_EARTH_3D_COMPOSITOR_INITIAL_VIEWPORT_STATE =';
const initialCameraStartIndex = compositor.indexOf(initialCameraStart);
const initialCameraEndIndex = compositor.indexOf(initialCameraEnd, initialCameraStartIndex);
if (initialCameraStartIndex < 0 || initialCameraEndIndex < 0) {
  throw new Error('INITIAL_CAMERA_SECTION_NOT_FOUND');
}
let initialCameraSection = compositor.slice(initialCameraStartIndex, initialCameraEndIndex);
initialCameraSection = initialCameraSection.replaceAll(
  'INITIAL_TARGET.',
  'GROUND_OBSERVER_INITIAL_ANCHOR.'
);
if (!initialCameraSection.includes('GROUND_OBSERVER_INITIAL_ANCHOR.x')) {
  throw new Error('INITIAL_OBSERVER_ANCHOR_NOT_APPLIED');
}
compositor =
  compositor.slice(0, initialCameraStartIndex) +
  initialCameraSection +
  compositor.slice(initialCameraEndIndex);

compositor = replaceExact(
  compositor,
  "'INITIAL_DISTANCE_MULTIPLIED_BY_ZOOM_SCALE'",
  "'GROUND_OBSERVER_FIXED_EYE_HEIGHT_WITH_PINCH_FIELD_OF_VIEW_SCALING'",
  'DISTANCE_MODEL'
);

compositor = replaceExact(
  compositor,
  "'CONSUME_AUTHORITY_NORMALIZED_CAMERA_THEN_APPLY_COMPOSITOR_POSITION_BOUND_FITTING'",
  "'CONSUME_AUTHORITY_NORMALIZED_CAMERA_THEN_CLAMP_GROUND_OBSERVER_ANCHOR_AND_PITCH'",
  'POSITION_POLICY'
);

const clampTargetReplacement = `function clampTarget(target) {
  return createVector(
    clamp(
      target.x,
      Math.max(
        TARGET_BOUNDS.xMin,
        POSITION_BOUNDS.xMin
      ),
      Math.min(
        TARGET_BOUNDS.xMax,
        POSITION_BOUNDS.xMax
      )
    ),
    GROUND_OBSERVER_EYE_HEIGHT,
    clamp(
      target.z,
      Math.max(
        TARGET_BOUNDS.zMin,
        POSITION_BOUNDS.zMin
      ),
      Math.min(
        TARGET_BOUNDS.zMax,
        POSITION_BOUNDS.zMax
      )
    )
  );
}`;

compositor = replaceBetween(
  compositor,
  'function clampTarget(target) {',
  'function deriveCameraPosition({',
  clampTargetReplacement,
  'CLAMP_TARGET_FUNCTION'
);

const deriveCameraReplacement = `function deriveGroundObserverForward({
  yawDegrees,
  pitchDegrees
}) {
  const yawRadians =
    toRadians(
      normalizeAngleDegrees(
        yawDegrees
      )
    );

  const pitchRadians =
    toRadians(
      clamp(
        pitchDegrees,
        GROUND_OBSERVER_PITCH_BOUNDS.minimum,
        GROUND_OBSERVER_PITCH_BOUNDS.maximum
      )
    );

  const horizontalMagnitude =
    Math.cos(
      pitchRadians
    );

  return normalizeVector(
    createVector(
      -Math.sin(
        yawRadians
      ) *
        horizontalMagnitude,
      -Math.sin(
        pitchRadians
      ),
      -Math.cos(
        yawRadians
      ) *
        horizontalMagnitude
    )
  );
}

function deriveCameraPosition({
  yawDegrees,
  pitchDegrees,
  zoomScale,
  target
}) {
  const position =
    clampTarget(
      target
    );

  const forward =
    deriveGroundObserverForward({
      yawDegrees,
      pitchDegrees
    });

  const normalizedZoomScale =
    clamp(
      zoomScale,
      ZOOM_SCALE_BOUNDS.minimum,
      ZOOM_SCALE_BOUNDS.maximum
    );

  const effectiveVerticalFovDegrees =
    clamp(
      CAPACITY_INITIAL_PROJECTION
        .verticalFovDegrees *
        normalizedZoomScale,
      FOV_BOUNDS.minimum,
      FOV_BOUNDS.maximum
    );

  return {
    distance:
      GROUND_OBSERVER_LOOK_DISTANCE,
    position,
    lookTarget:
      addVector(
        position,
        scaleVector(
          forward,
          GROUND_OBSERVER_LOOK_DISTANCE
        )
      ),
    forward,
    effectiveVerticalFovDegrees
  };
}`;

compositor = replaceBetween(
  compositor,
  'function deriveCameraPosition({',
  'function isPositionWithinBounds(',
  deriveCameraReplacement,
  'DERIVE_CAMERA_POSITION_FUNCTION'
);

const fitReplacement = `function fitCameraToPositionBounds(
  candidate
) {
  const normalized = {
    ...candidate,
    yawDegrees:
      normalizeAngleDegrees(
        candidate.yawDegrees
      ),
    pitchDegrees:
      clamp(
        candidate.pitchDegrees,
        GROUND_OBSERVER_PITCH_BOUNDS.minimum,
        GROUND_OBSERVER_PITCH_BOUNDS.maximum
      ),
    target:
      clampTarget(
        candidate.target
      ),
    zoomScale:
      clamp(
        candidate.zoomScale,
        ZOOM_SCALE_BOUNDS.minimum,
        ZOOM_SCALE_BOUNDS.maximum
      )
  };

  const derived =
    deriveCameraPosition(
      normalized
    );

  if (
    !isPositionWithinBounds(
      derived.position
    )
  ) {
    return {
      eligible: false,
      issue:
        createCompositorIssue(
          'GROUND_OBSERVER_POSITION_OUTSIDE_NAVIGATION_BOUNDS',
          'The ground observer anchor cannot be resolved inside compositor navigation bounds.',
          {
            actual:
              derived.position,
            expected:
              cloneKnownPlain(
                POSITION_BOUNDS
              )
          }
        )
    };
  }

  const adjusted =
    !Object.is(
      normalized.yawDegrees,
      candidate.yawDegrees
    ) ||
    !Object.is(
      normalized.pitchDegrees,
      candidate.pitchDegrees
    ) ||
    !Object.is(
      normalized.zoomScale,
      candidate.zoomScale
    ) ||
    !vectorsEqual(
      normalized.target,
      candidate.target
    );

  return {
    eligible: true,
    adjusted,
    adjustment:
      adjusted
        ? 'GROUND_OBSERVER_ANCHOR_PITCH_OR_ZOOM_CLAMPED'
        : null,
    cameraState:
      normalized,
    derived
  };
}`;

compositor = replaceBetween(
  compositor,
  'function fitCameraToPositionBounds(',
  'function constructCompositorCameraStateFromNormalizedAuthority(',
  fitReplacement,
  'FIT_CAMERA_FUNCTION'
);

const poseStart = 'function resolveCompositorCameraPoseSnapshot(';
const poseEnd = 'export function resolveHEarth3DCompositorCameraPose(';
const poseStartIndex = compositor.indexOf(poseStart);
const poseEndIndex = compositor.indexOf(poseEnd, poseStartIndex);
if (poseStartIndex < 0 || poseEndIndex < 0) {
  throw new Error('CAMERA_POSE_SECTION_NOT_FOUND');
}
let poseSection = compositor.slice(poseStartIndex, poseEndIndex);
poseSection = replaceExact(
  poseSection,
  `  const target =
    cloneVector(
      evaluation
        .cameraState
        .target
    );`,
  `  const target =
    cloneVector(
      evaluation
        .derived
        .lookTarget
    );`,
  'POSE_LOOK_TARGET'
);
poseSection = replaceExact(
  poseSection,
  `    verticalFovDegrees:
      evaluation
        .cameraState
        .verticalFovDegrees,`,
  `    verticalFovDegrees:
      evaluation
        .derived
        .effectiveVerticalFovDegrees,`,
  'POSE_EFFECTIVE_FOV'
);
compositor =
  compositor.slice(0, poseStartIndex) +
  poseSection +
  compositor.slice(poseEndIndex);

index = replaceExact(
  index,
  "'H_EARTH_3D_TOUCH_CAMERA_ORBIT_AND_PINCH_DISTANCE_CONTROL_v1'",
  "'H_EARTH_3D_TOUCH_CAMERA_GROUND_OBSERVER_LOOK_AND_PINCH_FOV_CONTROL_v2'",
  'TOUCH_CONTROL_CONTRACT'
);
index = index.replaceAll(
  "'ONE_POINTER_ORBIT'",
  "'ONE_POINTER_GROUND_OBSERVER_LOOK'"
);
index = index.replaceAll(
  "'TWO_POINTER_PINCH_DISTANCE'",
  "'TWO_POINTER_PINCH_FIELD_OF_VIEW'"
);

for (const required of [
  'GROUND_OBSERVER_EYE_HEIGHT',
  'GROUND_OBSERVER_PITCH_BOUNDS',
  'GROUND_OBSERVER_FIXED_EYE_HEIGHT_WITH_PINCH_FIELD_OF_VIEW_SCALING',
  'deriveGroundObserverForward',
  'effectiveVerticalFovDegrees',
  'H_EARTH_3D_TOUCH_CAMERA_GROUND_OBSERVER_LOOK_AND_PINCH_FOV_CONTROL_v2'
]) {
  if (!(compositor + index).includes(required)) {
    throw new Error(`GROUND_OBSERVER_TRANSFORMATION_MISSING:${required}`);
  }
}

fs.writeFileSync(compositorPath, compositor, 'utf8');
fs.writeFileSync(indexPath, index, 'utf8');

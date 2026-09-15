import {
  H_EARTH_3D_COMPOSITOR_INTENT_TYPES,
  evaluateHEarth3DCompositorCameraState,
  resolveHEarth3DCompositorCameraPose
} from '../../showroom/globe/h-earth/compositor.js';

import {
  H_EARTH_NATIVE_CAMERA_FEASIBILITY_MANIFEST,
  H_EARTH_NATIVE_CAMERA_STATES
} from './native-camera-manifest.v1.mjs';

const deepFreeze = (value) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }
  for (const nested of Object.values(value)) {
    deepFreeze(nested);
  }
  return Object.freeze(value);
};

export const H_EARTH_NATIVE_CAMERA_FEASIBILITY_RUNTIME_SCHEMA =
  'H_EARTH_NATIVE_CAMERA_FEASIBILITY_RUNTIME_v1';

export function getHEarthNativeCameraManifestRecord(frame) {
  if (!Number.isInteger(frame) || frame < 720 || frame > 959) {
    return null;
  }
  return H_EARTH_NATIVE_CAMERA_STATES[frame - 720] ?? null;
}

export function resolveHEarthNativeCameraManifestPose(frame) {
  const record = getHEarthNativeCameraManifestRecord(frame);
  if (!record) {
    return deepFreeze({
      eligible: false,
      status: 'FRAME_OUTSIDE_NATIVE_CAMERA_MANIFEST',
      frame,
      issues: [{ code: 'FRAME_OUTSIDE_720_959' }]
    });
  }

  const localEvaluation = evaluateHEarth3DCompositorCameraState(record.cameraState);
  if (!localEvaluation.eligible || localEvaluation.adjusted) {
    return deepFreeze({
      eligible: false,
      status: 'NATIVE_CAMERA_STATE_NOT_EXACTLY_REPRESENTABLE',
      frame,
      issues: localEvaluation.issues ?? []
    });
  }

  const pose = resolveHEarth3DCompositorCameraPose(record.cameraState, frame - 720);
  if (!pose.eligible) {
    return deepFreeze({
      eligible: false,
      status: 'NATIVE_CAMERA_POSE_NOT_RESOLVED',
      frame,
      issues: pose.issues ?? []
    });
  }

  return deepFreeze({
    eligible: true,
    status: 'NATIVE_CAMERA_POSE_RESOLVED_READ_ONLY',
    frame,
    cameraIntentType: H_EARTH_3D_COMPOSITOR_INTENT_TYPES.setCameraState,
    cameraState: record.cameraState,
    resolvedPose: pose,
    manifestSha256: H_EARTH_NATIVE_CAMERA_FEASIBILITY_MANIFEST.canonicalSha256,
    mutationPerformed: false
  });
}

export function getHEarthNativeCameraFeasibilityRuntimeReceipt() {
  return deepFreeze({
    schema: H_EARTH_NATIVE_CAMERA_FEASIBILITY_RUNTIME_SCHEMA,
    result: 'READ_ONLY_MANIFEST_LOOKUP_RUNTIME_READY',
    frameRange: H_EARTH_NATIVE_CAMERA_FEASIBILITY_MANIFEST.frameRange,
    manifestSha256: H_EARTH_NATIVE_CAMERA_FEASIBILITY_MANIFEST.canonicalSha256,
    productRuntimeMutationPerformed: false,
    rendererMutationPerformed: false,
    compositorMutationPerformed: false,
    capacityMutationPerformed: false
  });
}

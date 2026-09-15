import {
  H_EARTH_NATIVE_CAMERA_ANCHOR_FRAMES,
  H_EARTH_NATIVE_CAMERA_MANIFEST_SHA256,
  H_EARTH_NATIVE_CAMERA_STATES
} from './gen2287-native-camera-manifest.v1.mjs';

import {
  resolveHEarth3DCompositorCameraPose
} from '../../showroom/globe/h-earth/compositor.js';

import {
  constructHEarthRun8ESuccessorEnvironmentFrame,
  evaluateHEarthRun8EFrame,
  prepareHEarthRun8ERenderPlan,
  rasterizeHEarthRun8ERenderPlan
} from '../../showroom/globe/h-earth/render/run8e-successor-environment.js';

export const H_EARTH_RUN8E_NATIVE_CAMERA_FEASIBILITY_RUNTIME_ID =
  'H_EARTH_RUN8E_NATIVE_CAMERA_CONSUMPTION_FEASIBILITY_v1';

export const H_EARTH_RUN8E_NATIVE_CAMERA_ANCHOR_FRAMES =
  Object.freeze([...H_EARTH_NATIVE_CAMERA_ANCHOR_FRAMES]);

const anchorSet = new Set(H_EARTH_RUN8E_NATIVE_CAMERA_ANCHOR_FRAMES);
const clone = (value) => JSON.parse(JSON.stringify(value));

export function getHEarthRun8ENativeCameraState(masterFrame) {
  if (!Number.isInteger(masterFrame) || masterFrame < 720 || masterFrame > 959) {
    throw new RangeError(`Master frame ${masterFrame} is outside 720..959.`);
  }
  const record = H_EARTH_NATIVE_CAMERA_STATES[masterFrame - 720];
  if (!record || record.frame !== masterFrame) {
    throw new Error(`Inherited Gen2287 state identity mismatch at frame ${masterFrame}.`);
  }
  return record;
}

export function renderHEarthRun8ENativeCameraFrame(
  masterFrame,
  {
    width = 1280,
    height = 720,
    pixelRatio = 1,
    timeOfDayHours = 15.25
  } = {}
) {
  const inherited = getHEarthRun8ENativeCameraState(masterFrame);
  const resolvedPose = resolveHEarth3DCompositorCameraPose(
    inherited.cameraState,
    masterFrame - 720
  );

  if (resolvedPose?.eligible !== true) {
    throw new Error(`Gen2287 resolved pose rejected at frame ${masterFrame}.`);
  }

  const camera = Object.freeze({
    position: Object.freeze({ ...resolvedPose.position }),
    target: Object.freeze({ ...resolvedPose.target }),
    up: Object.freeze({ ...resolvedPose.up }),
    verticalFovDegrees: resolvedPose.verticalFovDegrees,
    nearPlane: resolvedPose.nearPlane,
    farPlane: resolvedPose.farPlane,
    sourceCapacityContractId:
      'H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_3_GROUND_OBSERVER_CAMERA_CAPACITY_v5',
    cameraAuthority:
      'GEN2287_PROVEN_NATIVE_STATE_RESOLVED_BY_CURRENT_COMPOSITOR_READ_ONLY'
  });

  const viewport = Object.freeze({ width, height, pixelRatio });
  const frame = constructHEarthRun8ESuccessorEnvironmentFrame({
    camera,
    viewport,
    timeOfDayHours,
    frameOccurrenceId:
      `H_EARTH_RUN8E_NATIVE_CAMERA_MASTER_${String(masterFrame).padStart(4, '0')}`,
    transferOccurrenceId:
      `H_EARTH_RUN8E_NATIVE_CAMERA_PACKET_002_MASTER_${String(masterFrame).padStart(4, '0')}`
  });

  const frameEvaluation = evaluateHEarthRun8EFrame(frame);
  if (frameEvaluation?.eligible !== true) {
    throw new Error(
      `Run 8E frame rejected at ${masterFrame}: ${(frameEvaluation?.issues ?? frame?.issues ?? []).join(', ')}`
    );
  }

  const plan = prepareHEarthRun8ERenderPlan(frame, viewport);
  if (plan?.eligible !== true) {
    throw new Error(`Run 8E render plan rejected at ${masterFrame}: ${(plan?.issues ?? []).join(', ')}`);
  }

  const raster = rasterizeHEarthRun8ERenderPlan(plan, frame);
  if (raster?.ok !== true || raster?.alphaClosed !== true) {
    throw new Error(`Run 8E raster rejected at ${masterFrame}: ${raster?.status ?? 'UNKNOWN'}`);
  }

  return {
    runtimeId: H_EARTH_RUN8E_NATIVE_CAMERA_FEASIBILITY_RUNTIME_ID,
    masterFrame,
    inheritedManifestSha256: H_EARTH_NATIVE_CAMERA_MANIFEST_SHA256,
    inheritedCameraState: clone(inherited.cameraState),
    resolvedPose: clone({
      position: resolvedPose.position,
      target: resolvedPose.target,
      up: resolvedPose.up,
      verticalFovDegrees: resolvedPose.verticalFovDegrees,
      nearPlane: resolvedPose.nearPlane,
      farPlane: resolvedPose.farPlane,
      yawDegrees: resolvedPose.yawDegrees,
      pitchDegrees: resolvedPose.pitchDegrees,
      zoomScale: resolvedPose.zoomScale,
      distance: resolvedPose.distance
    }),
    worldFrameId: frame.frameId,
    worldContractId: frame.contractId,
    packet002TransferContractId: frame.transfer?.contractId ?? null,
    successorMountainIncluded: frame.neutralPackage?.successorMountainIncluded === true,
    primitiveCount: frame.primitiveCount,
    plannedTriangleCount: plan.triangles?.length ?? 0,
    rejectedFragmentCount: plan.rejected?.length ?? 0,
    writtenPixelCount: raster.writtenPixelCount,
    skyPixelCount: raster.skyPixelCount,
    alphaClosed: raster.alphaClosed,
    singlePhysicalDepthDomainExecuted: raster.singlePhysicalDepthDomainExecuted,
    width: raster.width,
    height: raster.height,
    rgba: raster.rgba
  };
}

export function renderHEarthRun8ENativeCameraAnchor(masterFrame, options = {}) {
  if (!anchorSet.has(masterFrame)) {
    throw new RangeError(`Frame ${masterFrame} is not one of the five frozen anchor frames.`);
  }
  return renderHEarthRun8ENativeCameraFrame(masterFrame, options);
}

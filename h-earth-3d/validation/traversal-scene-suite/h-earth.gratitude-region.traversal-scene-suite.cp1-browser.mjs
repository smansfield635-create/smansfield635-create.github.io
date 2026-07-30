import {
  createHEarthFunctionalLandscapeNavigationState,
  proposeHEarthFunctionalLandscapeNavigation,
  evaluateHEarthFunctionalLandscapeNavigationState,
  createHEarthFunctionalLandscapeCamera,
  resolveHEarthNavigableTerrainChunk
} from '../../../showroom/globe/h-earth/functional-landscape/navigation.js';
import { sampleHEarthTerrainField } from '../../terrain/h-earth.terrain-field.js';
import { sampleHEarthRun8BSuccessorTerrainField } from '../../terrain/h-earth.successor-terrain-field.run8b.js';
import { createHEarthRun8ER3D3LiveGpuBinding } from '../../../showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js';
import { getHEarthRun8ER2CanonicalLiveRenderPackage } from '../../../showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js';

const clone = (value) => JSON.parse(JSON.stringify(value));
const normalizeDegrees = (value) => {
  let result = value % 360;
  if (result > 180) result -= 360;
  if (result < -180) result += 360;
  return result;
};
const fnv = (bytes) => {
  let value = 0x811c9dc5;
  for (const byte of bytes) { value ^= byte; value = Math.imul(value, 0x01000193) >>> 0; }
  return `fnv1a32:${value.toString(16).padStart(8, '0')}`;
};

function apply(state, intent) {
  const result = proposeHEarthFunctionalLandscapeNavigation(state, intent);
  if (result?.ok !== true) throw new Error(`CP1_NAVIGATION_REJECTED:${intent.action}:${result?.status}:${result?.issues?.join(',')}`);
  return result.state;
}

function setYaw(state, desired) {
  let delta = normalizeDegrees(desired - state.yawDegrees);
  while (Math.abs(delta) > 1e-9) {
    const amount = Math.min(8, Math.abs(delta));
    state = apply(state, { action: delta > 0 ? 'TURN_RIGHT' : 'TURN_LEFT', degrees: amount });
    delta = normalizeDegrees(desired - state.yawDegrees);
  }
  return state;
}

function setPitch(state, desired) {
  while (Math.abs(desired - state.pitchDegrees) > 1e-9) {
    const delta = desired - state.pitchDegrees;
    state = apply(state, { action: delta > 0 ? 'PITCH_UP' : 'PITCH_DOWN', degrees: Math.min(8, Math.abs(delta)) });
    if ((state.pitchDegrees === 32 && desired > 32) || (state.pitchDegrees === -42 && desired < -42)) break;
  }
  return state;
}

function setFov(state, desired) {
  while (Math.abs(desired - state.verticalFovDegrees) > 1e-9) {
    const delta = desired - state.verticalFovDegrees;
    state = apply(state, { action: delta < 0 ? 'ZOOM_IN' : 'ZOOM_OUT', degrees: Math.min(6, Math.abs(delta)) });
  }
  return state;
}

function deriveAim(scene, positionedState) {
  if (scene.camera.aimPolicy !== 'TARGET_PRESENTATION_TERRAIN_POINT') {
    return {
      policy: 'EXPLICIT_CAMERA_ANGLES',
      yawDegrees: scene.camera.yawDegrees,
      pitchDegrees: scene.camera.pitchDegrees
    };
  }
  const presentationCameraSample = sampleHEarthRun8BSuccessorTerrainField(
    positionedState.position.x,
    positionedState.position.z
  );
  const presentationTargetSample = sampleHEarthRun8BSuccessorTerrainField(
    scene.target.x,
    scene.target.z
  );
  if (presentationCameraSample?.valid !== true || !Number.isFinite(presentationCameraSample.elevation)) {
    throw new Error(`CP1_PRESENTATION_CAMERA_TERRAIN_SAMPLE_INVALID:${scene.id}`);
  }
  if (presentationTargetSample?.valid !== true || !Number.isFinite(presentationTargetSample.elevation)) {
    throw new Error(`CP1_PRESENTATION_TARGET_TERRAIN_SAMPLE_INVALID:${scene.id}`);
  }
  const presentationCameraEyeElevation = presentationCameraSample.elevation + 2.25;
  const dx = scene.target.x - positionedState.position.x;
  const dz = scene.target.z - positionedState.position.z;
  const horizontalDistance = Math.hypot(dx, dz);
  if (horizontalDistance <= 1e-9) throw new Error(`CP1_TARGET_HORIZONTAL_DISTANCE_ZERO:${scene.id}`);
  return {
    policy: scene.camera.aimPolicy,
    yawDegrees: normalizeDegrees(Math.atan2(dx, -dz) * 180 / Math.PI),
    pitchDegrees: Math.atan2(
      presentationTargetSample.elevation - presentationCameraEyeElevation,
      horizontalDistance
    ) * 180 / Math.PI,
    presentationTargetElevation: presentationTargetSample.elevation,
    presentationCameraTerrainElevation: presentationCameraSample.elevation,
    presentationCameraEyeElevation,
    navigationCameraEyeElevation: positionedState.position.y,
    cameraReconciliationDelta: presentationCameraEyeElevation - positionedState.position.y,
    horizontalDistance
  };
}

function createSceneState(scene) {
  const initial = createHEarthFunctionalLandscapeNavigationState({ waypointId: 'COAST' });
  if (initial?.ok !== true) throw new Error('CP1_INITIAL_NAVIGATION_STATE_REJECTED');
  let state = initial.state;
  state = apply(state, { action: 'SET_CAMERA_POSITION', position: { x: scene.camera.x, y: null, z: scene.camera.z } });
  const aim = deriveAim(scene, state);
  state = setYaw(state, aim.yawDegrees);
  state = setPitch(state, aim.pitchDegrees);
  state = setFov(state, scene.camera.verticalFovDegrees);
  const evaluation = evaluateHEarthFunctionalLandscapeNavigationState(state);
  if (evaluation.eligible !== true) throw new Error(`CP1_SCENE_STATE_INELIGIBLE:${scene.id}:${evaluation.issues.join(',')}`);
  return { state, aim: { ...aim, resolvedYawDegrees: state.yawDegrees, resolvedPitchDegrees: state.pitchDegrees } };
}

function projectPoint(matrix, point) {
  const x = point.x, y = point.y, z = point.z;
  const clip = {
    x: matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12],
    y: matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13],
    z: matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14],
    w: matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15]
  };
  if (!Number.isFinite(clip.w) || Math.abs(clip.w) < 1e-9) return { clip, ndc: null, visible: false };
  const ndc = { x: clip.x / clip.w, y: clip.y / clip.w, z: clip.z / clip.w };
  return { clip, ndc, visible: clip.w > 0 && Math.abs(ndc.x) <= 1 && Math.abs(ndc.y) <= 1 && ndc.z >= -1 && ndc.z <= 1 };
}

function pixelMetrics(canvas) {
  const gl = canvas.getContext('webgl2');
  const width = canvas.width;
  const height = canvas.height;
  const bytes = new Uint8Array(width * height * 4);
  gl.finish();
  const preReadError = gl.getError();
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
  const readPixelsError = gl.getError();
  const pixelCount = width * height;
  let luminanceSum = 0;
  let luminanceSquareSum = 0;
  let alphaClosedCount = 0;
  let alphaMinimum = 255;
  let alphaMaximum = 0;
  let edgeSum = 0;
  let edgeCount = 0;
  const buckets = new Set();
  const rowMeansBottomUp = new Array(height).fill(0);
  for (let y = 0; y < height; y += 1) {
    let row = 0;
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const r = bytes[offset], g = bytes[offset + 1], b = bytes[offset + 2], a = bytes[offset + 3];
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      row += lum;
      luminanceSum += lum;
      luminanceSquareSum += lum * lum;
      if (a === 255) alphaClosedCount += 1;
      alphaMinimum = Math.min(alphaMinimum, a);
      alphaMaximum = Math.max(alphaMaximum, a);
      if ((x + y * width) % 31 === 0) buckets.add(`${r >> 4}:${g >> 4}:${b >> 4}`);
      if (x > 0) {
        const left = offset - 4;
        edgeSum += Math.abs(r - bytes[left]) + Math.abs(g - bytes[left + 1]) + Math.abs(b - bytes[left + 2]);
        edgeCount += 3;
      }
      if (y > 0) {
        const below = offset - width * 4;
        edgeSum += Math.abs(r - bytes[below]) + Math.abs(g - bytes[below + 1]) + Math.abs(b - bytes[below + 2]);
        edgeCount += 3;
      }
    }
    rowMeansBottomUp[y] = row / width;
  }
  let largestRowDelta = -1;
  let horizonBottomUp = null;
  for (let y = Math.floor(height * 0.1); y < Math.floor(height * 0.9); y += 1) {
    const delta = Math.abs(rowMeansBottomUp[y] - rowMeansBottomUp[y - 1]);
    if (delta > largestRowDelta) { largestRowDelta = delta; horizonBottomUp = y; }
  }
  const fingerprint = [];
  for (let gy = 0; gy < 18; gy += 1) {
    const y = Math.min(height - 1, Math.floor((gy + 0.5) * height / 18));
    for (let gx = 0; gx < 32; gx += 1) {
      const x = Math.min(width - 1, Math.floor((gx + 0.5) * width / 32));
      const offset = (y * width + x) * 4;
      fingerprint.push(bytes[offset], bytes[offset + 1], bytes[offset + 2]);
    }
  }
  const mean = luminanceSum / pixelCount;
  return {
    width,
    height,
    pixelCount,
    byteHash: fnv(bytes),
    fingerprintHash: fnv(fingerprint),
    fingerprint,
    preReadError,
    readPixelsError,
    alphaClosedCount,
    alphaMinimum,
    alphaMaximum,
    sampledColorBucketCount: buckets.size,
    meanLuminance: mean,
    luminanceStandardDeviation: Math.sqrt(Math.max(0, luminanceSquareSum / pixelCount - mean * mean)),
    meanAdjacentChannelDifference: edgeSum / Math.max(1, edgeCount),
    horizonCandidateRowFromTop: horizonBottomUp === null ? null : height - 1 - horizonBottomUp,
    horizonCandidateRowDelta: largestRowDelta,
    topQuarterMeanLuminance: rowMeansBottomUp.slice(Math.floor(height * 0.75)).reduce((a, b) => a + b, 0) / Math.max(1, height - Math.floor(height * 0.75)),
    bottomQuarterMeanLuminance: rowMeansBottomUp.slice(0, Math.ceil(height * 0.25)).reduce((a, b) => a + b, 0) / Math.max(1, Math.ceil(height * 0.25))
  };
}

function terrainFacts(scene, state, aim) {
  const cameraSample = sampleHEarthTerrainField(scene.camera.x, scene.camera.z);
  const targetSample = sampleHEarthTerrainField(scene.target.x, scene.target.z);
  const presentationCameraSample = sampleHEarthRun8BSuccessorTerrainField(scene.camera.x, scene.camera.z);
  const presentationTargetSample = sampleHEarthRun8BSuccessorTerrainField(scene.target.x, scene.target.z);
  const distance = Math.hypot(scene.target.x - scene.camera.x, scene.target.z - scene.camera.z);
  const elevationDelta = targetSample.elevation - cameraSample.elevation;
  return {
    cameraSample: clone(cameraSample),
    targetSample: clone(targetSample),
    presentationCameraSample: clone(presentationCameraSample),
    presentationTargetSample: clone(presentationTargetSample),
    presentationCameraReconciliationDelta: presentationCameraSample.elevation - cameraSample.elevation,
    presentationTargetReconciliationDelta: presentationTargetSample.elevation - targetSample.elevation,
    horizontalDistance: distance,
    elevationDelta,
    slopeDegrees: Math.atan2(elevationDelta, Math.max(distance, 1e-9)) * 180 / Math.PI,
    presentationElevationDelta: presentationTargetSample.elevation - presentationCameraSample.elevation,
    presentationSlopeDegrees: Math.atan2(
      presentationTargetSample.elevation - presentationCameraSample.elevation,
      Math.max(distance, 1e-9)
    ) * 180 / Math.PI,
    cameraChunkId: resolveHEarthNavigableTerrainChunk(scene.camera.x, scene.camera.z)?.chunkId ?? null,
    targetChunkId: resolveHEarthNavigableTerrainChunk(scene.target.x, scene.target.z)?.chunkId ?? null,
    targetNavigationRequirement: scene.target.navigationRequirement ?? 'TARGET_EXPECTED_INSIDE_NAVIGABLE_CHUNK',
    aim: clone(aim),
    navigationState: clone(state),
    camera: clone(createHEarthFunctionalLandscapeCamera(state))
  };
}

export async function createHEarthGratitudeRegionCp1Suite({ canvas, control } = {}) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new TypeError('CP1_CANVAS_REQUIRED');
  if (!control || control.schemaVersion !== 'H_EARTH_GRATITUDE_REGION_TRAVERSAL_SCENE_SUITE_CP1_v1') throw new TypeError('CP1_CONTROL_INVALID');
  const initial = createHEarthFunctionalLandscapeNavigationState({ waypointId: 'COAST' });
  if (initial?.ok !== true) throw new Error('CP1_BINDING_INITIAL_STATE_REJECTED');
  const binding = createHEarthRun8ER3D3LiveGpuBinding({ canvas, initialNavigationState: initial.state, viewport: control.viewport });
  const renderPackage = getHEarthRun8ER2CanonicalLiveRenderPackage();
  const sceneMap = new Map(control.scenes.map((scene) => [scene.id, scene]));
  let proposalSequence = 0;
  const records = [];

  const renderScene = (sceneId) => {
    const scene = sceneMap.get(sceneId);
    if (!scene) throw new Error(`CP1_SCENE_UNKNOWN:${sceneId}`);
    const created = createSceneState(scene);
    const state = created.state;
    proposalSequence += 1;
    const frame = binding.acceptNavigationState({
      accepted: true,
      sequence: proposalSequence,
      inputClass: 'CP1_DIAGNOSTIC_SCENE',
      afterStateId: state.stateId
    }, state);
    const evidence = binding.captureLatestEvidence(scene.id);
    const targetPresentationTerrain = sampleHEarthRun8BSuccessorTerrainField(scene.target.x, scene.target.z);
    const projection = projectPoint(frame.viewProjectionMatrix, {
      x: scene.target.x,
      y: targetPresentationTerrain.elevation,
      z: scene.target.z
    });
    const record = {
      scene: clone(scene),
      frame: clone(frame),
      evidence: clone(evidence),
      terrain: terrainFacts(scene, state, created.aim),
      targetProjection: projection,
      pixels: pixelMetrics(canvas)
    };
    records.push(record);
    return clone(record);
  };

  return Object.freeze({
    getSuiteIdentity: () => ({
      checkpoint: control.checkpoint.id,
      sceneCount: sceneMap.size,
      sceneAimLaw: control.sceneAimLaw,
      rendererPackageIdentity: renderPackage.packageIdentity,
      rendererPackageDigest: renderPackage.contentDigest,
      roleDomain: ['TERRAIN', 'SHORELINE', 'VEGETATION'],
      productMutation: false
    }),
    listSceneIds: () => [...sceneMap.keys()],
    renderScene,
    getRecords: () => clone(records),
    getBindingReceipt: () => binding.getReceipt()
  });
}

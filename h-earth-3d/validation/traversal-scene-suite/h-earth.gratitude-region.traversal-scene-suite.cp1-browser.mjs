import {
  createHEarthFunctionalLandscapeNavigationState,
  proposeHEarthFunctionalLandscapeNavigation,
  evaluateHEarthFunctionalLandscapeNavigationState,
  createHEarthFunctionalLandscapeCamera,
  resolveHEarthNavigableTerrainChunk
} from '../../../showroom/globe/h-earth/functional-landscape/navigation.js';
import { sampleHEarthTerrainField } from '../../terrain/h-earth.terrain-field.js';
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

function createSceneState(scene) {
  const initial = createHEarthFunctionalLandscapeNavigationState({ waypointId: 'COAST' });
  if (initial?.ok !== true) throw new Error('CP1_INITIAL_NAVIGATION_STATE_REJECTED');
  let state = initial.state;
  state = apply(state, { action: 'SET_CAMERA_POSITION', position: { x: scene.camera.x, y: null, z: scene.camera.z } });
  state = setYaw(state, scene.camera.yawDegrees);
  state = setPitch(state, scene.camera.pitchDegrees);
  state = setFov(state, scene.camera.verticalFovDegrees);
  const evaluation = evaluateHEarthFunctionalLandscapeNavigationState(state);
  if (evaluation.eligible !== true) throw new Error(`CP1_SCENE_STATE_INELIGIBLE:${scene.id}:${evaluation.issues.join(',')}`);
  return state;
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
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
  const pixelCount = width * height;
  let luminanceSum = 0;
  let luminanceSquareSum = 0;
  let alphaClosedCount = 0;
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
    alphaClosedCount,
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

function terrainFacts(scene, state) {
  const cameraSample = sampleHEarthTerrainField(scene.camera.x, scene.camera.z);
  const targetSample = sampleHEarthTerrainField(scene.target.x, scene.target.z);
  const distance = Math.hypot(scene.target.x - scene.camera.x, scene.target.z - scene.camera.z);
  const elevationDelta = targetSample.elevation - cameraSample.elevation;
  return {
    cameraSample: clone(cameraSample),
    targetSample: clone(targetSample),
    horizontalDistance: distance,
    elevationDelta,
    slopeDegrees: Math.atan2(elevationDelta, Math.max(distance, 1e-9)) * 180 / Math.PI,
    cameraChunkId: resolveHEarthNavigableTerrainChunk(scene.camera.x, scene.camera.z)?.chunkId ?? null,
    targetChunkId: resolveHEarthNavigableTerrainChunk(scene.target.x, scene.target.z)?.chunkId ?? null,
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
    const state = createSceneState(scene);
    proposalSequence += 1;
    const frame = binding.acceptNavigationState({
      accepted: true,
      sequence: proposalSequence,
      inputClass: 'CP1_DIAGNOSTIC_SCENE',
      afterStateId: state.stateId
    }, state);
    const evidence = binding.captureLatestEvidence(scene.id);
    const targetTerrain = sampleHEarthTerrainField(scene.target.x, scene.target.z);
    const projection = projectPoint(frame.viewProjectionMatrix, {
      x: scene.target.x,
      y: targetTerrain.elevation,
      z: scene.target.z
    });
    const record = {
      scene: clone(scene),
      frame: clone(frame),
      evidence: clone(evidence),
      terrain: terrainFacts(scene, state),
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

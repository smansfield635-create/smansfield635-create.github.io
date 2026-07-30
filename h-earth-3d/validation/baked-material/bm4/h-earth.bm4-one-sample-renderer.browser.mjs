import {
  createHEarthFunctionalLandscapeNavigationState,
  proposeHEarthFunctionalLandscapeNavigation,
  evaluateHEarthFunctionalLandscapeNavigationState,
  resolveHEarthNavigableTerrainChunk
} from '../../../../showroom/globe/h-earth/functional-landscape/navigation.js';
import { sampleHEarthRun8BSuccessorTerrainField } from '../../../terrain/h-earth.successor-terrain-field.run8b.js';
import { createHEarthRun8ER3AFrameUniformPacket } from '../../../../showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js';
import { createHEarthRun8ER3CPersistentRenderer as createAcceptedRenderer } from '../../../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js';
import {
  createHEarthRun8ER3CPersistentRenderer as createCandidateRenderer,
  H_EARTH_GRATITUDE_REGION_BM4_BAKED_MATERIAL_PROFILE_ID
} from '../../../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round2-baked-material-candidate.js';

const clone = (value) => JSON.parse(JSON.stringify(value));
const fnv = (bytes) => {
  let value = 0x811c9dc5;
  for (const byte of bytes) { value ^= byte; value = Math.imul(value, 0x01000193) >>> 0; }
  return `fnv1a32:${value.toString(16).padStart(8, '0')}`;
};
const exactBytes = (left, right) => left.length === right.length && left.every((value, index) => value === right[index]);
const normalizeDegrees = (value) => {
  let result = value % 360;
  if (result > 180) result -= 360;
  if (result < -180) result += 360;
  return result;
};
function apply(state, intent) {
  const result = proposeHEarthFunctionalLandscapeNavigation(state, intent);
  if (result?.ok !== true) throw new Error(`BM4_NAVIGATION_REJECTED:${intent.action}:${result?.status}:${result?.issues?.join(',')}`);
  return result.state;
}
function setYaw(state, desired) {
  let delta = normalizeDegrees(desired - state.yawDegrees);
  while (Math.abs(delta) > 1e-8) {
    const amount = Math.min(8, Math.abs(delta));
    state = apply(state, { action: delta > 0 ? 'TURN_RIGHT' : 'TURN_LEFT', degrees: amount });
    delta = normalizeDegrees(desired - state.yawDegrees);
  }
  return state;
}
function setPitch(state, desired) {
  const bounded = Math.max(-42, Math.min(32, desired));
  while (Math.abs(bounded - state.pitchDegrees) > 1e-8) {
    const delta = bounded - state.pitchDegrees;
    state = apply(state, { action: delta > 0 ? 'PITCH_UP' : 'PITCH_DOWN', degrees: Math.min(8, Math.abs(delta)) });
  }
  return state;
}
function setFov(state, desired) {
  while (Math.abs(desired - state.verticalFovDegrees) > 1e-8) {
    const delta = desired - state.verticalFovDegrees;
    state = apply(state, { action: delta < 0 ? 'ZOOM_IN' : 'ZOOM_OUT', degrees: Math.min(6, Math.abs(delta)) });
  }
  return state;
}
function stateForView(camera, target) {
  const initial = createHEarthFunctionalLandscapeNavigationState({ waypointId: 'COAST' });
  if (initial?.ok !== true) throw new Error('BM4_INITIAL_NAVIGATION_STATE_REJECTED');
  let state = apply(initial.state, { action: 'SET_CAMERA_POSITION', position: { x: camera.x, y: null, z: camera.z } });
  const cameraTerrain = sampleHEarthRun8BSuccessorTerrainField(camera.x, camera.z);
  const targetTerrain = sampleHEarthRun8BSuccessorTerrainField(target.x, target.z);
  if (cameraTerrain?.valid !== true || targetTerrain?.valid !== true) throw new Error('BM4_TERRAIN_SAMPLE_INVALID');
  const dx = target.x - camera.x;
  const dz = target.z - camera.z;
  const yaw = normalizeDegrees(Math.atan2(dx, -dz) * 180 / Math.PI);
  const pitch = Math.atan2(targetTerrain.elevation - (cameraTerrain.elevation + 2.25), Math.max(Math.hypot(dx, dz), 1e-8)) * 180 / Math.PI;
  state = setYaw(state, yaw);
  state = setPitch(state, pitch);
  state = setFov(state, camera.verticalFovDegrees);
  const evaluation = evaluateHEarthFunctionalLandscapeNavigationState(state);
  if (evaluation.eligible !== true) throw new Error(`BM4_SCENE_STATE_INELIGIBLE:${evaluation.issues.join(',')}`);
  return state;
}
function readRgba(canvas) {
  const gl = canvas.getContext('webgl2');
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.finish();
  const bytes = new Uint8Array(canvas.width * canvas.height * 4);
  gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
  const error = gl.getError();
  if (error !== gl.NO_ERROR) throw new Error(`BM4_COLOR_READBACK_ERROR:${error}`);
  return bytes;
}
function readDepthMask(renderer, canvas) {
  renderer.captureDepthSummary();
  const gl = canvas.getContext('webgl2');
  const rgba = new Uint8Array(canvas.width * canvas.height * 4);
  gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, rgba);
  const error = gl.getError();
  if (error !== gl.NO_ERROR) throw new Error(`BM4_DEPTH_READBACK_ERROR:${error}`);
  const mask = new Uint8Array(canvas.width * canvas.height);
  for (let index = 0; index < mask.length; index += 1) mask[index] = rgba[index * 4] > 0 ? 1 : 0;
  return mask;
}
function difference(left, right) {
  let changedPixels = 0;
  let absoluteRgb = 0;
  const pixels = left.length / 4;
  for (let offset = 0; offset < left.length; offset += 4) {
    const dr = Math.abs(left[offset] - right[offset]);
    const dg = Math.abs(left[offset + 1] - right[offset + 1]);
    const db = Math.abs(left[offset + 2] - right[offset + 2]);
    absoluteRgb += dr + dg + db;
    if (dr + dg + db > 9) changedPixels += 1;
  }
  return {
    changedPixelRatio: changedPixels / Math.max(1, pixels),
    meanAbsoluteRgbByteDelta: absoluteRgb / Math.max(1, pixels * 3)
  };
}

export async function createBM4OneSampleRendererSuite({ acceptedCanvas, candidateCanvas, authority }) {
  const viewport = authority.viewport;
  const initialState = stateForView(authority.scenes[0].camera, authority.scenes[0].target);
  let sequence = 1;
  const initialPacket = createHEarthRun8ER3AFrameUniformPacket({ navigationState: initialState, viewport, frameSequence: sequence });
  const acceptedRenderer = createAcceptedRenderer({ canvas: acceptedCanvas, width: viewport.width, height: viewport.height });
  const candidateRenderer = createCandidateRenderer({ canvas: candidateCanvas, width: viewport.width, height: viewport.height });
  const contextLoss = { accepted: 0, candidate: 0 };
  acceptedCanvas.addEventListener('webglcontextlost', () => { contextLoss.accepted += 1; });
  candidateCanvas.addEventListener('webglcontextlost', () => { contextLoss.candidate += 1; });
  acceptedRenderer.initialize(initialPacket);
  candidateRenderer.initialize(initialPacket);
  const records = [];
  for (const scene of authority.scenes) {
    const state = stateForView(scene.camera, scene.target);
    const packet = createHEarthRun8ER3AFrameUniformPacket({ navigationState: state, viewport, frameSequence: ++sequence });
    acceptedRenderer.renderFrame(packet);
    acceptedRenderer.presentColorFrame();
    const acceptedBytes = readRgba(acceptedCanvas);
    const acceptedDepth = readDepthMask(acceptedRenderer, acceptedCanvas);
    candidateRenderer.renderFrame(packet);
    candidateRenderer.presentColorFrame();
    const candidateBytes = readRgba(candidateCanvas);
    const candidateDepth = readDepthMask(candidateRenderer, candidateCanvas);
    candidateRenderer.renderFrame(packet);
    candidateRenderer.presentColorFrame();
    const repeatedBytes = readRgba(candidateCanvas);
    records.push({
      scene: clone(scene),
      cameraChunkId: resolveHEarthNavigableTerrainChunk(scene.camera.x, scene.camera.z)?.chunkId ?? null,
      acceptedHash: fnv(acceptedBytes),
      candidateHash: fnv(candidateBytes),
      repeatedCandidateHash: fnv(repeatedBytes),
      colorBytesExact: exactBytes(acceptedBytes, candidateBytes),
      depthMaskExact: exactBytes(acceptedDepth, candidateDepth),
      candidateFixedFrameExact: exactBytes(candidateBytes, repeatedBytes),
      difference: difference(acceptedBytes, candidateBytes)
    });
  }
  return clone({
    profile: candidateRenderer.getResourceReceipt().presentationProfileId,
    expectedProfile: H_EARTH_GRATITUDE_REGION_BM4_BAKED_MATERIAL_PROFILE_ID,
    scenes: records,
    contextLoss,
    receipts: {
      accepted: acceptedRenderer.getResourceReceipt(),
      candidate: candidateRenderer.getResourceReceipt()
    }
  });
}

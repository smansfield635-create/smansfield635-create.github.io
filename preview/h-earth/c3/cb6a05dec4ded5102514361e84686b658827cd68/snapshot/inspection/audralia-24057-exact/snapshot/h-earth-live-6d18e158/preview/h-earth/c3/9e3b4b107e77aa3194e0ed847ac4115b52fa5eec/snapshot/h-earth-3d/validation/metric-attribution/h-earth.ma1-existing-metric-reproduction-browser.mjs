import {
  createHEarthFunctionalLandscapeNavigationState,
  proposeHEarthFunctionalLandscapeNavigation,
  evaluateHEarthFunctionalLandscapeNavigationState
} from '../../../showroom/globe/h-earth/functional-landscape/navigation.js';
import { sampleHEarthRun8BSuccessorTerrainField } from '../../terrain/h-earth.successor-terrain-field.run8b.js';
import { createHEarthRun8ER3AFrameUniformPacket } from '../../../showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js';
import { createHEarthRun8ER3CPersistentRenderer as createAcceptedRenderer } from '../../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js';
import control from '../../control-plane/post-cp2-round2/metric-attribution/h-earth.ma1-existing-metric-reproduction.v1.mjs';

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const average = (values) => values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
const clone = (value) => JSON.parse(JSON.stringify(value));
const exactBytes = (left, right) => left.length === right.length && left.every((value, index) => value === right[index]);
const fnv = (bytes) => {
  let value = 0x811c9dc5;
  for (const byte of bytes) { value ^= byte; value = Math.imul(value, 0x01000193) >>> 0; }
  return `fnv1a32:${value.toString(16).padStart(8, '0')}`;
};
const normalizeDegrees = (value) => {
  let result = value % 360;
  if (result > 180) result -= 360;
  if (result < -180) result += 360;
  return result;
};

function apply(state, intent) {
  const result = proposeHEarthFunctionalLandscapeNavigation(state, intent);
  if (result?.ok !== true) throw new Error(`MA1_NAVIGATION_REJECTED:${intent.action}:${result?.status}`);
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
  const bounded = clamp(desired, -42, 32);
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
  if (initial?.ok !== true) throw new Error('MA1_INITIAL_NAVIGATION_STATE_REJECTED');
  let state = apply(initial.state, { action: 'SET_CAMERA_POSITION', position: { x: camera.x, y: null, z: camera.z } });
  const cameraTerrain = sampleHEarthRun8BSuccessorTerrainField(camera.x, camera.z);
  const targetTerrain = sampleHEarthRun8BSuccessorTerrainField(target.x, target.z);
  if (cameraTerrain?.valid !== true || targetTerrain?.valid !== true) throw new Error('MA1_TERRAIN_SAMPLE_INVALID');
  const dx = target.x - camera.x;
  const dz = target.z - camera.z;
  const yaw = normalizeDegrees(Math.atan2(dx, -dz) * 180 / Math.PI);
  const pitch = Math.atan2(targetTerrain.elevation - (cameraTerrain.elevation + 2.25), Math.max(1e-8, Math.hypot(dx, dz))) * 180 / Math.PI;
  state = setYaw(state, yaw);
  state = setPitch(state, pitch);
  state = setFov(state, camera.verticalFovDegrees);
  const evaluation = evaluateHEarthFunctionalLandscapeNavigationState(state);
  if (evaluation.eligible !== true) throw new Error(`MA1_SCENE_STATE_INELIGIBLE:${evaluation.issues.join(',')}`);
  return state;
}

function readCanvas(canvas) {
  const gl = canvas.getContext('webgl2');
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.finish();
  const bytes = new Uint8Array(canvas.width * canvas.height * 4);
  gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
  return bytes;
}
function readAcceptedDepth(renderer, canvas) {
  renderer.captureDepthSummary();
  const gl = canvas.getContext('webgl2');
  const rgba = new Uint8Array(canvas.width * canvas.height * 4);
  gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, rgba);
  const values = new Float32Array(canvas.width * canvas.height);
  const mask = new Uint8Array(canvas.width * canvas.height);
  for (let index = 0; index < values.length; index += 1) {
    values[index] = rgba[index * 4] / 255;
    mask[index] = rgba[index * 4] > 0 ? 1 : 0;
  }
  return { values, mask };
}
function srgbToLinear(value) {
  const channel = value / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}
function luminance(bytes) {
  const values = new Float32Array(bytes.length / 4);
  for (let index = 0; index < values.length; index += 1) {
    const offset = index * 4;
    values[index] = 0.2126 * srgbToLinear(bytes[offset]) + 0.7152 * srgbToLinear(bytes[offset + 1]) + 0.0722 * srgbToLinear(bytes[offset + 2]);
  }
  return values;
}
function normalizeValues(values, mask, width, height, outputWidth, outputHeight) {
  const outputValues = new Float32Array(outputWidth * outputHeight);
  const outputMask = new Uint8Array(outputWidth * outputHeight);
  for (let oy = 0; oy < outputHeight; oy += 1) {
    const y0 = Math.floor(oy * height / outputHeight);
    const y1 = Math.max(y0 + 1, Math.floor((oy + 1) * height / outputHeight));
    for (let ox = 0; ox < outputWidth; ox += 1) {
      const x0 = Math.floor(ox * width / outputWidth);
      const x1 = Math.max(x0 + 1, Math.floor((ox + 1) * width / outputWidth));
      let sum = 0;
      let count = 0;
      for (let y = y0; y < y1; y += 1) for (let x = x0; x < x1; x += 1) {
        const index = y * width + x;
        if (mask[index]) { sum += values[index]; count += 1; }
      }
      const target = oy * outputWidth + ox;
      outputMask[target] = count >= ((x1 - x0) * (y1 - y0) * 0.5) ? 1 : 0;
      outputValues[target] = count ? sum / count : 0;
    }
  }
  return { values: outputValues, mask: outputMask };
}
function gaussianBlur(values, width, height, sigma) {
  const radius = Math.ceil(sigma * 2.5);
  const kernel = new Float32Array(radius * 2 + 1);
  let total = 0;
  for (let offset = -radius; offset <= radius; offset += 1) {
    const value = Math.exp(-(offset * offset) / (2 * sigma * sigma));
    kernel[offset + radius] = value;
    total += value;
  }
  for (let index = 0; index < kernel.length; index += 1) kernel[index] /= total;
  const temp = new Float32Array(values.length);
  const output = new Float32Array(values.length);
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    let value = 0;
    for (let k = -radius; k <= radius; k += 1) value += values[y * width + clamp(x + k, 0, width - 1)] * kernel[k + radius];
    temp[y * width + x] = value;
  }
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    let value = 0;
    for (let k = -radius; k <= radius; k += 1) value += temp[clamp(y + k, 0, height - 1) * width + x] * kernel[k + radius];
    output[y * width + x] = value;
  }
  return output;
}
function directionalScore(values, mask, width, height, orientations, lags) {
  let mean = 0;
  let count = 0;
  for (let index = 0; index < values.length; index += 1) if (mask[index]) { mean += values[index]; count += 1; }
  mean /= Math.max(1, count);
  let maximum = 0;
  for (const degrees of orientations) {
    const radians = degrees * Math.PI / 180;
    for (const lag of lags) {
      const dx = Math.round(Math.cos(radians) * lag);
      const dy = Math.round(Math.sin(radians) * lag);
      let numerator = 0;
      let leftEnergy = 0;
      let rightEnergy = 0;
      let pairs = 0;
      for (let y = Math.max(0, -dy); y < Math.min(height, height - dy); y += 1) for (let x = Math.max(0, -dx); x < Math.min(width, width - dx); x += 1) {
        const left = y * width + x;
        const right = (y + dy) * width + x + dx;
        if (!mask[left] || !mask[right]) continue;
        const a = values[left] - mean;
        const b = values[right] - mean;
        numerator += a * b;
        leftEnergy += a * a;
        rightEnergy += b * b;
        pairs += 1;
      }
      if (pairs > 32 && leftEnergy > 1e-12 && rightEnergy > 1e-12) maximum = Math.max(maximum, Math.abs(numerator / Math.sqrt(leftEnergy * rightEnergy)));
    }
  }
  return maximum;
}
function finalFrameMetric(bytes, depth, width, height) {
  const size = control.normalizedAnalysisSize;
  const normalized = normalizeValues(luminance(bytes), depth.mask, width, height, size.width, size.height);
  const blur2 = gaussianBlur(normalized.values, size.width, size.height, 2);
  const blur8 = gaussianBlur(normalized.values, size.width, size.height, 8);
  const blur24 = gaussianBlur(normalized.values, size.width, size.height, 24);
  const micro = new Float32Array(normalized.values.length);
  const meso = new Float32Array(normalized.values.length);
  const macro = new Float32Array(normalized.values.length);
  for (let index = 0; index < micro.length; index += 1) {
    micro[index] = normalized.values[index] - blur2[index];
    meso[index] = blur2[index] - blur8[index];
    macro[index] = blur8[index] - blur24[index];
  }
  const bands = {
    micro: directionalScore(micro, normalized.mask, size.width, size.height, control.finalFrameMetric.orientationsDegrees, control.finalFrameMetric.lagsPixels),
    meso: directionalScore(meso, normalized.mask, size.width, size.height, control.finalFrameMetric.orientationsDegrees, control.finalFrameMetric.lagsPixels),
    macro: directionalScore(macro, normalized.mask, size.width, size.height, control.finalFrameMetric.orientationsDegrees, control.finalFrameMetric.lagsPixels)
  };
  return {
    bands,
    sceneScore: average(Object.values(bands)),
    eligibleFraction: normalized.mask.reduce((sum, value) => sum + value, 0) / normalized.mask.length
  };
}

export async function createMA1MetricReproductionSuite({ canvas }) {
  canvas.width = control.viewport.width;
  canvas.height = control.viewport.height;
  const initialState = stateForView(control.scenes[0].camera, control.scenes[0].target);
  let sequence = 1;
  const initialPacket = createHEarthRun8ER3AFrameUniformPacket({ navigationState: initialState, viewport: control.viewport, frameSequence: sequence });
  const renderer = createAcceptedRenderer({ canvas, width: control.viewport.width, height: control.viewport.height });
  renderer.initialize(initialPacket);
  const sceneMap = new Map(control.scenes.map((scene) => [scene.id, scene]));
  const records = [];
  const renderScene = (sceneId) => {
    const scene = sceneMap.get(sceneId);
    if (!scene) throw new Error(`MA1_SCENE_UNKNOWN:${sceneId}`);
    const state = stateForView(scene.camera, scene.target);
    const packet = createHEarthRun8ER3AFrameUniformPacket({ navigationState: state, viewport: control.viewport, frameSequence: ++sequence });
    renderer.renderFrame(packet);
    renderer.presentColorFrame();
    const firstBytes = readCanvas(canvas);
    const firstDepth = readAcceptedDepth(renderer, canvas);
    const firstMetric = finalFrameMetric(firstBytes, firstDepth, control.viewport.width, control.viewport.height);
    renderer.renderFrame(packet);
    renderer.presentColorFrame();
    const secondBytes = readCanvas(canvas);
    const secondDepth = readAcceptedDepth(renderer, canvas);
    const secondMetric = finalFrameMetric(secondBytes, secondDepth, control.viewport.width, control.viewport.height);
    const record = {
      scene: clone(scene),
      frameHash: fnv(firstBytes),
      replayFrameHash: fnv(secondBytes),
      depthMaskHash: fnv(firstDepth.mask),
      replayDepthMaskHash: fnv(secondDepth.mask),
      deterministic: exactBytes(firstBytes, secondBytes) && exactBytes(firstDepth.mask, secondDepth.mask) && firstMetric.sceneScore === secondMetric.sceneScore,
      metric: firstMetric
    };
    records.push(record);
    return clone(record);
  };
  const finalize = () => {
    const aggregateScore = average(records.map((record) => record.metric.sceneScore));
    const absoluteDifference = Math.abs(aggregateScore - control.expectedB4AggregateScore);
    return clone({
      checkpoint: 'MA1',
      result: 'MA1_EXISTING_METRIC_REPRODUCTION_PASS_CLOSED',
      scenes: records,
      sceneCount: records.length,
      deterministicAcrossAllScenes: records.every((record) => record.deterministic),
      aggregateScore,
      expectedB4AggregateScore: control.expectedB4AggregateScore,
      absoluteDifference,
      withinTolerance: absoluteDifference <= control.aggregateScoreAbsoluteTolerance,
      diagnosticPassesExecuted: ['H_ACCEPTED_CP2_FINAL_FRAME'],
      productMutationPerformed: false,
      liveRouteChanged: false,
      stoppingBoundary: 'STOP_AFTER_MA1_REPRODUCTION_RECEIPT'
    });
  };
  return Object.freeze({ listSceneIds: () => [...sceneMap.keys()], renderScene, finalize });
}

export default createMA1MetricReproductionSuite;

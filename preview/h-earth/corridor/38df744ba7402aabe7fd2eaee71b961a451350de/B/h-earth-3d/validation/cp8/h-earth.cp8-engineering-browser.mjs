import {
  createHEarthFunctionalLandscapeNavigationState,
  proposeHEarthFunctionalLandscapeNavigation,
  evaluateHEarthFunctionalLandscapeNavigationState,
  resolveHEarthNavigableTerrainChunk
} from '../../../showroom/globe/h-earth/functional-landscape/navigation.js';
import { sampleHEarthRun8BSuccessorTerrainField } from '../../terrain/h-earth.successor-terrain-field.run8b.js';
import { createHEarthRun8ER3AFrameUniformPacket } from '../../../showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js';
import { createHEarthRun8ER3CPersistentRenderer as createCp2Renderer } from '../../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js';
import {
  createHEarthRun8ER3CPersistentRenderer as createCandidateRenderer,
  H_EARTH_GRATITUDE_REGION_CP7E_CONTROL_FIELD_PROFILE_ID
} from '../../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round2-control-field-candidate.js';

const clone = (value) => JSON.parse(JSON.stringify(value));
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
const percentile = (values, fraction) => {
  const sorted = [...values].sort((a, b) => a - b);
  if (!sorted.length) return 0;
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * fraction) - 1))];
};
const median = (values) => percentile(values, 0.5);
const average = (values) => values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
const exactBytes = (left, right) => left.length === right.length && left.every((value, index) => value === right[index]);

function apply(state, intent) {
  const result = proposeHEarthFunctionalLandscapeNavigation(state, intent);
  if (result?.ok !== true) throw new Error(`CP8_NAVIGATION_REJECTED:${intent.action}:${result?.status}:${result?.issues?.join(',')}`);
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
  if (initial?.ok !== true) throw new Error('CP8_INITIAL_NAVIGATION_STATE_REJECTED');
  let state = apply(initial.state, { action: 'SET_CAMERA_POSITION', position: { x: camera.x, y: null, z: camera.z } });
  const cameraTerrain = sampleHEarthRun8BSuccessorTerrainField(camera.x, camera.z);
  const targetTerrain = sampleHEarthRun8BSuccessorTerrainField(target.x, target.z);
  if (cameraTerrain?.valid !== true || targetTerrain?.valid !== true) throw new Error('CP8_PRESENTATION_TERRAIN_SAMPLE_INVALID');
  const dx = target.x - camera.x;
  const dz = target.z - camera.z;
  const horizontal = Math.hypot(dx, dz);
  const yaw = normalizeDegrees(Math.atan2(dx, -dz) * 180 / Math.PI);
  const pitch = Math.atan2(targetTerrain.elevation - (cameraTerrain.elevation + 2.25), Math.max(horizontal, 1e-8)) * 180 / Math.PI;
  state = setYaw(state, yaw);
  state = setPitch(state, pitch);
  state = setFov(state, camera.verticalFovDegrees);
  const evaluation = evaluateHEarthFunctionalLandscapeNavigationState(state);
  if (evaluation.eligible !== true) throw new Error(`CP8_SCENE_STATE_INELIGIBLE:${evaluation.issues.join(',')}`);
  return state;
}
function projectPoint(matrix, point) {
  const { x, y, z } = point;
  const clip = {
    x: matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12],
    y: matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13],
    z: matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14],
    w: matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15]
  };
  if (!Number.isFinite(clip.w) || Math.abs(clip.w) < 1e-9) return { visible: false, clip, ndc: null };
  const ndc = { x: clip.x / clip.w, y: clip.y / clip.w, z: clip.z / clip.w };
  return { visible: clip.w > 0 && Math.abs(ndc.x) <= 1 && Math.abs(ndc.y) <= 1 && ndc.z >= -1 && ndc.z <= 1, clip, ndc };
}
function readRgba(canvas) {
  const gl = canvas.getContext('webgl2');
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.finish();
  const bytes = new Uint8Array(canvas.width * canvas.height * 4);
  gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
  const error = gl.getError();
  if (error !== gl.NO_ERROR) throw new Error(`CP8_COLOR_READBACK_ERROR:${error}`);
  return bytes;
}
function readDepthField(renderer, canvas) {
  renderer.captureDepthSummary();
  const gl = canvas.getContext('webgl2');
  const rgba = new Uint8Array(canvas.width * canvas.height * 4);
  gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, rgba);
  const error = gl.getError();
  if (error !== gl.NO_ERROR) throw new Error(`CP8_DEPTH_READBACK_ERROR:${error}`);
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
function pixelMetrics(bytes, width, height) {
  let luminanceSum = 0;
  let luminanceSquareSum = 0;
  let edgeSum = 0;
  let edgeCount = 0;
  let alphaClosedCount = 0;
  const buckets = new Set();
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const r = bytes[offset], g = bytes[offset + 1], b = bytes[offset + 2], a = bytes[offset + 3];
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      luminanceSum += luminance;
      luminanceSquareSum += luminance * luminance;
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
  }
  const pixelCount = width * height;
  const mean = luminanceSum / pixelCount;
  return {
    pixelCount,
    byteHash: fnv(bytes),
    sampledColorBucketCount: buckets.size,
    meanLuminance: mean,
    luminanceStandardDeviation: Math.sqrt(Math.max(0, luminanceSquareSum / pixelCount - mean * mean)),
    meanAdjacentChannelDifference: edgeSum / Math.max(1, edgeCount),
    alphaClosedCount
  };
}
function depthConditionedMask(depth, width, height, maximumGradient, dilation) {
  const exclusion = new Uint8Array(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      if (!depth.mask[index]) { exclusion[index] = 1; continue; }
      const center = depth.values[index];
      let gradient = 0;
      if (x > 0 && depth.mask[index - 1]) gradient = Math.max(gradient, Math.abs(center - depth.values[index - 1]));
      if (x + 1 < width && depth.mask[index + 1]) gradient = Math.max(gradient, Math.abs(center - depth.values[index + 1]));
      if (y > 0 && depth.mask[index - width]) gradient = Math.max(gradient, Math.abs(center - depth.values[index - width]));
      if (y + 1 < height && depth.mask[index + width]) gradient = Math.max(gradient, Math.abs(center - depth.values[index + width]));
      if (gradient > maximumGradient) exclusion[index] = 1;
    }
  }
  const dilated = new Uint8Array(exclusion);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!exclusion[y * width + x]) continue;
      for (let dy = -dilation; dy <= dilation; dy += 1) {
        for (let dx = -dilation; dx <= dilation; dx += 1) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) dilated[ny * width + nx] = 1;
        }
      }
    }
  }
  const mask = new Uint8Array(width * height);
  for (let index = 0; index < mask.length; index += 1) mask[index] = depth.mask[index] && !dilated[index] ? 1 : 0;
  return mask;
}
function normalizeValues(values, sourceMask, width, height, outputWidth = 256, outputHeight = 256) {
  const stride = width + 1;
  const sum = new Float64Array((width + 1) * (height + 1));
  const count = new Float64Array((width + 1) * (height + 1));
  for (let y = 0; y < height; y += 1) {
    let rowSum = 0;
    let rowCount = 0;
    for (let x = 0; x < width; x += 1) {
      const pixel = y * width + x;
      const eligible = sourceMask[pixel];
      rowSum += eligible ? values[pixel] : 0;
      rowCount += eligible;
      const target = (y + 1) * stride + x + 1;
      sum[target] = sum[y * stride + x + 1] + rowSum;
      count[target] = count[y * stride + x + 1] + rowCount;
    }
  }
  const outputValues = new Float32Array(outputWidth * outputHeight);
  const outputMask = new Uint8Array(outputWidth * outputHeight);
  const rectangle = (prefix, x0, y0, x1, y1) => prefix[y1 * stride + x1] - prefix[y0 * stride + x1] - prefix[y1 * stride + x0] + prefix[y0 * stride + x0];
  for (let oy = 0; oy < outputHeight; oy += 1) {
    const y0 = Math.floor(oy * height / outputHeight);
    const y1 = Math.max(y0 + 1, Math.floor((oy + 1) * height / outputHeight));
    for (let ox = 0; ox < outputWidth; ox += 1) {
      const x0 = Math.floor(ox * width / outputWidth);
      const x1 = Math.max(x0 + 1, Math.floor((ox + 1) * width / outputWidth));
      const eligibleCount = rectangle(count, x0, y0, x1, y1);
      const cell = oy * outputWidth + ox;
      outputMask[cell] = eligibleCount >= ((x1 - x0) * (y1 - y0) * 0.5) ? 1 : 0;
      outputValues[cell] = eligibleCount > 0 ? rectangle(sum, x0, y0, x1, y1) / eligibleCount : 0;
    }
  }
  return { values: outputValues, mask: outputMask, width: outputWidth, height: outputHeight };
}
function luminanceValues(bytes, logarithmic = false) {
  const values = new Float32Array(bytes.length / 4);
  for (let index = 0; index < values.length; index += 1) {
    const offset = index * 4;
    const luminance = 0.2126 * srgbToLinear(bytes[offset]) + 0.7152 * srgbToLinear(bytes[offset + 1]) + 0.0722 * srgbToLinear(bytes[offset + 2]);
    values[index] = logarithmic ? Math.log(Math.max(1e-4, luminance)) : luminance;
  }
  return values;
}
function gaussianKernel(sigma) {
  const radius = Math.ceil(sigma * 2.5);
  const kernel = new Float32Array(radius * 2 + 1);
  let total = 0;
  for (let offset = -radius; offset <= radius; offset += 1) {
    const value = Math.exp(-(offset * offset) / (2 * sigma * sigma));
    kernel[offset + radius] = value;
    total += value;
  }
  for (let index = 0; index < kernel.length; index += 1) kernel[index] /= total;
  return { kernel, radius };
}
function gaussianBlur(values, width, height, sigma) {
  const { kernel, radius } = gaussianKernel(sigma);
  const temporary = new Float32Array(values.length);
  const output = new Float32Array(values.length);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let value = 0;
      for (let k = -radius; k <= radius; k += 1) value += values[y * width + Math.max(0, Math.min(width - 1, x + k))] * kernel[k + radius];
      temporary[y * width + x] = value;
    }
  }
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let value = 0;
      for (let k = -radius; k <= radius; k += 1) value += temporary[Math.max(0, Math.min(height - 1, y + k)) * width + x] * kernel[k + radius];
      output[y * width + x] = value;
    }
  }
  return output;
}
function directionalCorrelationScore(values, mask, width, height, orientations, lags) {
  let meanValue = 0;
  let meanCount = 0;
  for (let index = 0; index < values.length; index += 1) if (mask[index]) { meanValue += values[index]; meanCount += 1; }
  meanValue /= Math.max(1, meanCount);
  const centered = new Float32Array(values.length);
  for (let index = 0; index < values.length; index += 1) centered[index] = values[index] - meanValue;
  let maximum = 0;
  for (const degrees of orientations) {
    const radians = degrees * Math.PI / 180;
    for (const lag of lags) {
      const dx = Math.round(Math.cos(radians) * lag);
      const dy = Math.round(Math.sin(radians) * lag);
      if (dx === 0 && dy === 0) continue;
      let numerator = 0, leftEnergy = 0, rightEnergy = 0, pairs = 0;
      const xStart = Math.max(0, -dx), xEnd = Math.min(width, width - dx);
      const yStart = Math.max(0, -dy), yEnd = Math.min(height, height - dy);
      for (let y = yStart; y < yEnd; y += 1) {
        for (let x = xStart; x < xEnd; x += 1) {
          const left = y * width + x;
          const right = (y + dy) * width + x + dx;
          if (!mask[left] || !mask[right]) continue;
          const a = centered[left], b = centered[right];
          numerator += a * b;
          leftEnergy += a * a;
          rightEnergy += b * b;
          pairs += 1;
        }
      }
      if (pairs > 32 && leftEnergy > 1e-12 && rightEnergy > 1e-12) maximum = Math.max(maximum, Math.abs(numerator / Math.sqrt(leftEnergy * rightEnergy)));
    }
  }
  return maximum;
}
function fullFrameRepetitionMetric(bytes, depthMask, width, height, control) {
  const normalized = normalizeValues(luminanceValues(bytes), depthMask, width, height, 256, 256);
  const eligibleFraction = normalized.mask.reduce((sum, value) => sum + value, 0) / normalized.mask.length;
  const blur2 = gaussianBlur(normalized.values, 256, 256, 2);
  const blur8 = gaussianBlur(normalized.values, 256, 256, 8);
  const blur24 = gaussianBlur(normalized.values, 256, 256, 24);
  const micro = new Float32Array(normalized.values.length);
  const meso = new Float32Array(normalized.values.length);
  const macro = new Float32Array(normalized.values.length);
  for (let index = 0; index < normalized.values.length; index += 1) {
    micro[index] = normalized.values[index] - blur2[index];
    meso[index] = blur2[index] - blur8[index];
    macro[index] = blur8[index] - blur24[index];
  }
  const scores = {
    micro: directionalCorrelationScore(micro, normalized.mask, 256, 256, control.fullFrameMetric.orientationsDegrees, control.fullFrameMetric.lagsPixels),
    meso: directionalCorrelationScore(meso, normalized.mask, 256, 256, control.fullFrameMetric.orientationsDegrees, control.fullFrameMetric.lagsPixels),
    macro: directionalCorrelationScore(macro, normalized.mask, 256, 256, control.fullFrameMetric.orientationsDegrees, control.fullFrameMetric.lagsPixels)
  };
  return { eligibleFraction, bands: scores, sceneScore: average(Object.values(scores)) };
}
function materialRepetitionMetric(bytes, sharedDepth, width, height, control) {
  const sourceMask = depthConditionedMask(sharedDepth, width, height, control.materialMetric.depthGradientMaximum, control.materialMetric.depthExclusionDilationPixels);
  const normalized = normalizeValues(luminanceValues(bytes, true), sourceMask, width, height, 256, 256);
  const eligibleFraction = normalized.mask.reduce((sum, value) => sum + value, 0) / normalized.mask.length;
  const carrier = gaussianBlur(normalized.values, 256, 256, control.materialMetric.carrierSigmaPixels);
  const residual = new Float32Array(normalized.values.length);
  for (let index = 0; index < residual.length; index += 1) residual[index] = normalized.values[index] - carrier[index];
  const blur2 = gaussianBlur(residual, 256, 256, control.materialMetric.residualSigmasPixels[0]);
  const blur8 = gaussianBlur(residual, 256, 256, control.materialMetric.residualSigmasPixels[1]);
  const blur18 = gaussianBlur(residual, 256, 256, control.materialMetric.residualSigmasPixels[2]);
  const micro = new Float32Array(residual.length);
  const meso = new Float32Array(residual.length);
  const broadMaterial = new Float32Array(residual.length);
  for (let index = 0; index < residual.length; index += 1) {
    micro[index] = residual[index] - blur2[index];
    meso[index] = blur2[index] - blur8[index];
    broadMaterial[index] = blur8[index] - blur18[index];
  }
  const bands = {
    micro: directionalCorrelationScore(micro, normalized.mask, 256, 256, control.materialMetric.orientationsDegrees, control.materialMetric.lagsPixels),
    meso: directionalCorrelationScore(meso, normalized.mask, 256, 256, control.materialMetric.orientationsDegrees, control.materialMetric.lagsPixels),
    broadMaterial: directionalCorrelationScore(broadMaterial, normalized.mask, 256, 256, control.materialMetric.orientationsDegrees, control.materialMetric.lagsPixels)
  };
  const weights = control.materialMetric.bandWeights;
  return {
    eligibleFraction,
    bands,
    sceneScore: bands.micro * weights.micro + bands.meso * weights.meso + bands.broadMaterial * weights.broadMaterial
  };
}
function lowDifferentiation(metrics) {
  return metrics.sampledColorBucketCount < 8 || metrics.luminanceStandardDeviation < 2 || metrics.meanAdjacentChannelDifference < 0.2;
}

export async function createCp8EngineeringSuite({ cp2Canvas, candidateCanvas, cp2MobileCanvas, candidateMobileCanvas, control }) {
  const viewport = control.viewport;
  const initialState = stateForView(control.scenes[0].camera, control.scenes[0].target);
  let sequence = 1;
  const initialPacket = createHEarthRun8ER3AFrameUniformPacket({ navigationState: initialState, viewport, frameSequence: sequence });
  const cp2Renderer = createCp2Renderer({ canvas: cp2Canvas, width: viewport.width, height: viewport.height });
  const candidateRenderer = createCandidateRenderer({ canvas: candidateCanvas, width: viewport.width, height: viewport.height });
  cp2Renderer.initialize(initialPacket);
  candidateRenderer.initialize(initialPacket);
  const sceneMap = new Map(control.scenes.map((scene) => [scene.id, scene]));
  const sceneRecords = [];
  const contextLoss = { cp2: 0, candidate: 0, cp2Mobile: 0, candidateMobile: 0 };
  cp2Canvas.addEventListener('webglcontextlost', () => { contextLoss.cp2 += 1; });
  candidateCanvas.addEventListener('webglcontextlost', () => { contextLoss.candidate += 1; });
  cp2MobileCanvas.addEventListener('webglcontextlost', () => { contextLoss.cp2Mobile += 1; });
  candidateMobileCanvas.addEventListener('webglcontextlost', () => { contextLoss.candidateMobile += 1; });

  const renderWith = (renderer, canvas, packet) => {
    const started = performance.now();
    renderer.renderFrame(packet);
    renderer.presentColorFrame();
    const responseMs = performance.now() - started;
    const bytes = readRgba(canvas);
    const metrics = pixelMetrics(bytes, canvas.width, canvas.height);
    const depth = readDepthField(renderer, canvas);
    return { responseMs, bytes, metrics, depth };
  };

  const renderScene = (sceneId) => {
    const scene = sceneMap.get(sceneId);
    if (!scene) throw new Error(`CP8_SCENE_UNKNOWN:${sceneId}`);
    const state = stateForView(scene.camera, scene.target);
    const packet = createHEarthRun8ER3AFrameUniformPacket({ navigationState: state, viewport, frameSequence: ++sequence });
    const targetTerrain = sampleHEarthRun8BSuccessorTerrainField(scene.target.x, scene.target.z);
    const projection = projectPoint(packet.camera.viewProjectionMatrix, { x: scene.target.x, y: targetTerrain.elevation, z: scene.target.z });
    const cp2 = renderWith(cp2Renderer, cp2Canvas, packet);
    const candidate = renderWith(candidateRenderer, candidateCanvas, packet);
    candidateRenderer.renderFrame(packet);
    candidateRenderer.presentColorFrame();
    const repeatedHash = fnv(readRgba(candidateCanvas));
    const depthMaskIdentity = exactBytes(cp2.depth.mask, candidate.depth.mask);
    const cp2Full = fullFrameRepetitionMetric(cp2.bytes, cp2.depth.mask, cp2Canvas.width, cp2Canvas.height, control);
    const candidateFull = fullFrameRepetitionMetric(candidate.bytes, cp2.depth.mask, candidateCanvas.width, candidateCanvas.height, control);
    const cp2Material = materialRepetitionMetric(cp2.bytes, cp2.depth, cp2Canvas.width, cp2Canvas.height, control);
    const candidateMaterial = materialRepetitionMetric(candidate.bytes, cp2.depth, candidateCanvas.width, candidateCanvas.height, control);
    const record = {
      scene: clone(scene),
      navigationStateId: state.stateId,
      cameraChunkId: resolveHEarthNavigableTerrainChunk(scene.camera.x, scene.camera.z)?.chunkId ?? null,
      targetProjection: projection,
      cp2: { metrics: cp2.metrics, fullFrameRepetition: cp2Full, materialRepetition: cp2Material, responseMs: cp2.responseMs },
      candidate: { metrics: candidate.metrics, fullFrameRepetition: candidateFull, materialRepetition: candidateMaterial, responseMs: candidate.responseMs, repeatedHash },
      fixedFrameDeterministic: repeatedHash === candidate.metrics.byteHash,
      depthMaskIdentity,
      fullFrameRepetitionRatio: candidateFull.sceneScore / Math.max(1e-9, cp2Full.sceneScore),
      materialRepetitionRatio: candidateMaterial.sceneScore / Math.max(1e-9, cp2Material.sceneScore),
      colorRetention: candidate.metrics.sampledColorBucketCount / Math.max(1, cp2.metrics.sampledColorBucketCount),
      edgeRetention: candidate.metrics.meanAdjacentChannelDifference / Math.max(1e-9, cp2.metrics.meanAdjacentChannelDifference)
    };
    sceneRecords.push(record);
    return clone(record);
  };

  const buildMotionPackets = (motionViewport) => {
    const start = sceneMap.get(control.motion.startScene);
    const end = sceneMap.get(control.motion.endScene);
    const packets = [];
    for (let index = 0; index < control.motion.frameCount; index += 1) {
      const t = index / Math.max(1, control.motion.frameCount - 1);
      const smooth = t * t * (3 - 2 * t);
      const camera = {
        x: start.camera.x + (end.camera.x - start.camera.x) * smooth,
        z: start.camera.z + (end.camera.z - start.camera.z) * smooth,
        verticalFovDegrees: start.camera.verticalFovDegrees + (end.camera.verticalFovDegrees - start.camera.verticalFovDegrees) * smooth
      };
      const target = {
        x: start.target.x + (end.target.x - start.target.x) * smooth,
        z: start.target.z + (end.target.z - start.target.z) * smooth
      };
      const state = stateForView(camera, target);
      packets.push(createHEarthRun8ER3AFrameUniformPacket({ navigationState: state, viewport: motionViewport, frameSequence: ++sequence }));
    }
    return packets;
  };
  const executeMotionPair = (acceptedRenderer, acceptedCanvas, comparedRenderer, comparedCanvas, motionViewport, captureReplay) => {
    const packets = buildMotionPackets(motionViewport);
    const replay = (renderer, canvas, captureHashes) => {
      const times = [];
      const hashes = [];
      for (const packet of packets) {
        const started = performance.now();
        renderer.renderFrame(packet);
        renderer.presentColorFrame();
        times.push(performance.now() - started);
        if (captureHashes) hashes.push(fnv(readRgba(canvas)));
      }
      return { times, hashes };
    };
    replay(acceptedRenderer, acceptedCanvas, false);
    replay(comparedRenderer, comparedCanvas, false);
    const acceptedPerformance = replay(acceptedRenderer, acceptedCanvas, false);
    const candidatePerformance = replay(comparedRenderer, comparedCanvas, false);
    const replayA = captureReplay ? replay(comparedRenderer, comparedCanvas, true) : { hashes: [] };
    const replayB = captureReplay ? replay(comparedRenderer, comparedCanvas, true) : { hashes: [] };
    return {
      frameCount: packets.length,
      deterministicReplay: captureReplay ? JSON.stringify(replayA.hashes) === JSON.stringify(replayB.hashes) : null,
      firstReplayHashes: replayA.hashes,
      secondReplayHashes: replayB.hashes,
      accepted: { medianMs: median(acceptedPerformance.times), p95Ms: percentile(acceptedPerformance.times, 0.95), samples: acceptedPerformance.times.length },
      candidate: { medianMs: median(candidatePerformance.times), p95Ms: percentile(candidatePerformance.times, 0.95), samples: candidatePerformance.times.length },
      medianRatio: median(candidatePerformance.times) / Math.max(0.0001, median(acceptedPerformance.times)),
      p95Ratio: percentile(candidatePerformance.times, 0.95) / Math.max(0.0001, percentile(acceptedPerformance.times, 0.95))
    };
  };

  const finalize = () => {
    const motion = executeMotionPair(cp2Renderer, cp2Canvas, candidateRenderer, candidateCanvas, viewport, true);
    const mobileState = stateForView(control.scenes[0].camera, control.scenes[0].target);
    const mobileInitial = createHEarthRun8ER3AFrameUniformPacket({ navigationState: mobileState, viewport: control.mobileViewport, frameSequence: ++sequence });
    const cp2MobileRenderer = createCp2Renderer({ canvas: cp2MobileCanvas, width: control.mobileViewport.width, height: control.mobileViewport.height });
    const candidateMobileRenderer = createCandidateRenderer({ canvas: candidateMobileCanvas, width: control.mobileViewport.width, height: control.mobileViewport.height });
    cp2MobileRenderer.initialize(mobileInitial);
    candidateMobileRenderer.initialize(mobileInitial);
    const mobileMotion = executeMotionPair(cp2MobileRenderer, cp2MobileCanvas, candidateMobileRenderer, candidateMobileCanvas, control.mobileViewport, false);
    const cp2Receipt = cp2Renderer.getResourceReceipt();
    const candidateReceipt = candidateRenderer.getResourceReceipt();
    const cp2MobileReceipt = cp2MobileRenderer.getResourceReceipt();
    const candidateMobileReceipt = candidateMobileRenderer.getResourceReceipt();
    const cp2ColorMean = average(sceneRecords.map((record) => record.cp2.metrics.sampledColorBucketCount));
    const candidateColorMean = average(sceneRecords.map((record) => record.candidate.metrics.sampledColorBucketCount));
    const cp2EdgeMean = average(sceneRecords.map((record) => record.cp2.metrics.meanAdjacentChannelDifference));
    const candidateEdgeMean = average(sceneRecords.map((record) => record.candidate.metrics.meanAdjacentChannelDifference));
    const cp2FullMean = average(sceneRecords.map((record) => record.cp2.fullFrameRepetition.sceneScore));
    const candidateFullMean = average(sceneRecords.map((record) => record.candidate.fullFrameRepetition.sceneScore));
    const cp2MaterialMean = average(sceneRecords.map((record) => record.cp2.materialRepetition.sceneScore));
    const candidateMaterialMean = average(sceneRecords.map((record) => record.candidate.materialRepetition.sceneScore));
    return clone({
      profile: candidateReceipt.presentationProfileId,
      scenes: sceneRecords,
      aggregates: {
        cp2ColorMean,
        candidateColorMean,
        candidateColorRatioVersusCp2: candidateColorMean / Math.max(1e-9, cp2ColorMean),
        candidateColorRatioVersusCp1: 1.876106 * candidateColorMean / Math.max(1e-9, cp2ColorMean),
        cp2EdgeMean,
        candidateEdgeMean,
        candidateEdgeRatioVersusCp2: candidateEdgeMean / Math.max(1e-9, cp2EdgeMean),
        candidateEdgeRatioVersusCp1: 3.055321 * candidateEdgeMean / Math.max(1e-9, cp2EdgeMean),
        cp2FullFrameRepetitionMean: cp2FullMean,
        candidateFullFrameRepetitionMean: candidateFullMean,
        fullFrameRepetitionRatio: candidateFullMean / Math.max(1e-9, cp2FullMean),
        cp2MaterialRepetitionMean: cp2MaterialMean,
        candidateMaterialRepetitionMean: candidateMaterialMean,
        materialRepetitionRatio: candidateMaterialMean / Math.max(1e-9, cp2MaterialMean),
        lowDifferentiationScenes: sceneRecords.filter((record) => lowDifferentiation(record.candidate.metrics)).map((record) => record.scene.id)
      },
      motion,
      mobileMotion,
      contextLoss,
      receipts: { cp2: cp2Receipt, candidate: candidateReceipt, cp2Mobile: cp2MobileReceipt, candidateMobile: candidateMobileReceipt }
    });
  };

  return Object.freeze({
    listSceneIds: () => [...sceneMap.keys()],
    renderScene,
    finalize,
    getSceneRecords: () => clone(sceneRecords),
    getIdentity: () => ({ checkpoint: 8, profile: H_EARTH_GRATITUDE_REGION_CP7E_CONTROL_FIELD_PROFILE_ID, sceneCount: sceneMap.size })
  });
}

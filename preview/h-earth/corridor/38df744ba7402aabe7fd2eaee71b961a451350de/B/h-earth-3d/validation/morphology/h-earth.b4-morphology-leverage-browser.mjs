import {
  createHEarthFunctionalLandscapeNavigationState,
  proposeHEarthFunctionalLandscapeNavigation,
  evaluateHEarthFunctionalLandscapeNavigationState
} from '../../../showroom/globe/h-earth/functional-landscape/navigation.js';
import { sampleHEarthRun8BSuccessorTerrainField } from '../../terrain/h-earth.successor-terrain-field.run8b.js';
import { createHEarthRun8ER3AFrameUniformPacket } from '../../../showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js';
import { createHEarthRun8ER3CPersistentRenderer as createAcceptedRenderer } from '../../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js';
import { getHEarthRun8ER2CanonicalLiveRenderPackage } from '../../../showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js';
import { createHEarthRun8ER2DCanonicalGPUUploadViews } from '../../../showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js';
import { buildHEarthB3TwoFixedMorphologyProbes } from '../../analysis/morphology/h-earth.b3-two-fixed-morphology-probes.v1.mjs';
import b2Authority from '../../control-plane/post-cp2-round2/morphology/h-earth.b2-protection-model.v1.mjs';
import b3Authority from '../../control-plane/post-cp2-round2/morphology/h-earth.b3-two-fixed-morphology-probes.v1.mjs';
import control from '../../control-plane/post-cp2-round2/morphology/h-earth.b4-morphology-leverage-classification.v1.mjs';

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
  if (result?.ok !== true) throw new Error(`B4_NAVIGATION_REJECTED:${intent.action}:${result?.status}`);
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
  if (initial?.ok !== true) throw new Error('B4_INITIAL_NAVIGATION_STATE_REJECTED');
  let state = apply(initial.state, { action: 'SET_CAMERA_POSITION', position: { x: camera.x, y: null, z: camera.z } });
  const cameraTerrain = sampleHEarthRun8BSuccessorTerrainField(camera.x, camera.z);
  const targetTerrain = sampleHEarthRun8BSuccessorTerrainField(target.x, target.z);
  if (cameraTerrain?.valid !== true || targetTerrain?.valid !== true) throw new Error('B4_TERRAIN_SAMPLE_INVALID');
  const dx = target.x - camera.x;
  const dz = target.z - camera.z;
  const yaw = normalizeDegrees(Math.atan2(dx, -dz) * 180 / Math.PI);
  const pitch = Math.atan2(targetTerrain.elevation - (cameraTerrain.elevation + 2.25), Math.max(1e-8, Math.hypot(dx, dz))) * 180 / Math.PI;
  state = setYaw(state, yaw);
  state = setPitch(state, pitch);
  state = setFov(state, camera.verticalFovDegrees);
  const evaluation = evaluateHEarthFunctionalLandscapeNavigationState(state);
  if (evaluation.eligible !== true) throw new Error(`B4_SCENE_STATE_INELIGIBLE:${evaluation.issues.join(',')}`);
  return state;
}

function extractShader(source, name) {
  const match = source.match(new RegExp('const ' + name + ' = `([\\s\\S]*?)`;'));
  if (!match) throw new Error(`B4_ACCEPTED_SHADER_NOT_FOUND:${name}`);
  return match[1];
}
function color3(value) {
  const array = Array.isArray(value) ? value : [0, 0, 0];
  const scale = array.some((entry) => entry > 1) ? 255 : 1;
  return array.slice(0, 3).map((entry) => clamp(Number(entry) / scale, 0, 1));
}
function bilinearSample(heights, grid, x, z) {
  const fx = clamp((x - b3Authority.grid.xMinimum) / b3Authority.grid.xSpacingWorldUnits, 0, grid.width - 1);
  const fz = clamp((z - b3Authority.grid.zMinimum) / b3Authority.grid.zSpacingWorldUnits, 0, grid.height - 1);
  const x0 = Math.floor(fx), z0 = Math.floor(fz);
  const x1 = Math.min(grid.width - 1, x0 + 1), z1 = Math.min(grid.height - 1, z0 + 1);
  const tx = fx - x0, tz = fz - z0;
  const a = heights[z0 * grid.width + x0] * (1 - tx) + heights[z0 * grid.width + x1] * tx;
  const b = heights[z1 * grid.width + x0] * (1 - tx) + heights[z1 * grid.width + x1] * tx;
  return a * (1 - tz) + b * tz;
}
function viewsForHeights(raw, heights, grid) {
  const views = {
    positions: new Float32Array(raw.positions),
    normals: new Float32Array(raw.normals),
    baseColorsLinear: new Float32Array(raw.baseColorsLinear),
    materialParameters: new Float32Array(raw.materialParameters),
    materialModelCodes: new Uint8Array(raw.materialModelCodes),
    surfaceClassCodes: new Uint8Array(raw.surfaceClassCodes),
    primitiveIndices: new Uint16Array(raw.primitiveIndices),
    roleCodes: new Uint8Array(raw.roleCodes),
    indices: new Uint32Array(raw.indices)
  };
  if (!heights) return views;
  const stepX = b3Authority.grid.xSpacingWorldUnits;
  const stepZ = b3Authority.grid.zSpacingWorldUnits;
  for (let vertex = 0; vertex < views.roleCodes.length; vertex += 1) {
    if (views.roleCodes[vertex] !== 1) continue;
    const offset = vertex * 3;
    const x = views.positions[offset];
    const z = views.positions[offset + 2];
    views.positions[offset + 1] = bilinearSample(heights, grid, x, z);
    const left = bilinearSample(heights, grid, x - stepX, z);
    const right = bilinearSample(heights, grid, x + stepX, z);
    const back = bilinearSample(heights, grid, x, z - stepZ);
    const front = bilinearSample(heights, grid, x, z + stepZ);
    const dx = (right - left) / (2 * stepX);
    const dz = (front - back) / (2 * stepZ);
    const length = Math.hypot(-dx, 1, -dz);
    views.normals[offset] = -dx / length;
    views.normals[offset + 1] = 1 / length;
    views.normals[offset + 2] = -dz / length;
  }
  return views;
}

function createDiagnosticRenderer({ canvas, width, height, shaders, uploadViews, renderPackage }) {
  canvas.width = width;
  canvas.height = height;
  const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: true, stencil: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  if (!gl) throw new Error('B4_WEBGL2_CONTEXT_UNAVAILABLE');
  const compile = (type, source, label) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(`B4_SHADER_COMPILE_FAILED:${label}:${gl.getShaderInfoLog(shader)}`);
    return shader;
  };
  const link = (vs, fs, label) => {
    const program = gl.createProgram();
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(`B4_PROGRAM_LINK_FAILED:${label}:${gl.getProgramInfoLog(program)}`);
    return program;
  };
  const geometryProgram = link(compile(gl.VERTEX_SHADER, shaders.VS, 'GV'), compile(gl.FRAGMENT_SHADER, shaders.FS, 'GF'), 'GP');
  const depthProgram = link(compile(gl.VERTEX_SHADER, shaders.DVS, 'DV'), compile(gl.FRAGMENT_SHADER, shaders.DFS, 'DF'), 'DP');
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const specs = [
    [uploadViews.positions, 0, 3, gl.FLOAT, false],
    [uploadViews.normals, 1, 3, gl.FLOAT, false],
    [uploadViews.baseColorsLinear, 2, 4, gl.FLOAT, false],
    [uploadViews.materialParameters, 3, 4, gl.FLOAT, false],
    [uploadViews.materialModelCodes, 4, 1, gl.UNSIGNED_BYTE, true],
    [uploadViews.surfaceClassCodes, 5, 1, gl.UNSIGNED_BYTE, true],
    [uploadViews.primitiveIndices, 6, 1, gl.UNSIGNED_SHORT, true],
    [uploadViews.roleCodes, 7, 1, gl.UNSIGNED_BYTE, true]
  ];
  for (const [data, location, size, type, integer] of specs) {
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); gl.enableVertexAttribArray(location);
    if (integer) gl.vertexAttribIPointer(location, size, type, 0, 0); else gl.vertexAttribPointer(location, size, type, false, 0, 0);
  }
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, uploadViews.indices, gl.STATIC_DRAW);
  const colorTexture = gl.createTexture();
  const depthTexture = gl.createTexture();
  const geometryFramebuffer = gl.createFramebuffer();
  gl.bindTexture(gl.TEXTURE_2D, colorTexture); gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, width, height); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.bindTexture(gl.TEXTURE_2D, depthTexture); gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT24, width, height); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.NONE);
  gl.bindFramebuffer(gl.FRAMEBUFFER, geometryFramebuffer); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTexture, 0); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0);
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error('B4_GEOMETRY_FRAMEBUFFER_INCOMPLETE');
  const depthColorTexture = gl.createTexture();
  const depthFramebuffer = gl.createFramebuffer();
  gl.bindTexture(gl.TEXTURE_2D, depthColorTexture); gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, width, height); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, depthColorTexture, 0);
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error('B4_DEPTH_FRAMEBUFFER_INCOMPLETE');
  const uniform = (program, name) => {
    const location = gl.getUniformLocation(program, name);
    if (location === null) throw new Error(`B4_UNIFORM_MISSING:${name}`);
    return location;
  };
  const uniforms = {
    viewProjection: uniform(geometryProgram, 'uViewProjection'), cameraPosition: uniform(geometryProgram, 'uCameraPosition'),
    sunDirection: uniform(geometryProgram, 'uSunDirection'), sunIntensity: uniform(geometryProgram, 'uSunIntensity'), sunColor: uniform(geometryProgram, 'uSunColor'),
    skyZenithColor: uniform(geometryProgram, 'uSkyZenithColor'), skyHorizonColor: uniform(geometryProgram, 'uSkyHorizonColor'), groundHazeColor: uniform(geometryProgram, 'uGroundHazeColor'),
    fogStartDistance: uniform(geometryProgram, 'uFogStartDistance'), fogFalloff: uniform(geometryProgram, 'uFogFalloff'), maximumFogFactor: uniform(geometryProgram, 'uMaximumFogFactor'),
    distanceDesaturationStrength: uniform(geometryProgram, 'uDistanceDesaturationStrength'), depth: uniform(depthProgram, 'uDepth')
  };
  let skyColor = [0, 0, 0];
  const initialize = (packet) => {
    const environment = packet.environmentUniforms;
    skyColor = color3(environment.skyHorizonColor).map((value, index) => Math.min(1, value * (index === 2 ? 0.92 : 0.88)));
    gl.useProgram(geometryProgram);
    gl.uniform3f(uniforms.sunDirection, environment.sunDirection.x, environment.sunDirection.y, environment.sunDirection.z);
    gl.uniform1f(uniforms.sunIntensity, environment.sunIntensity); gl.uniform3fv(uniforms.sunColor, color3(environment.sunColor));
    gl.uniform3fv(uniforms.skyZenithColor, color3(environment.skyZenithColor)); gl.uniform3fv(uniforms.skyHorizonColor, skyColor); gl.uniform3fv(uniforms.groundHazeColor, color3(environment.groundHazeColor));
    gl.uniform1f(uniforms.fogStartDistance, environment.fogStartDistance); gl.uniform1f(uniforms.fogFalloff, environment.fogFalloff); gl.uniform1f(uniforms.maximumFogFactor, environment.maximumFogFactor); gl.uniform1f(uniforms.distanceDesaturationStrength, environment.distanceDesaturationStrength);
  };
  const renderFrame = (packet) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, geometryFramebuffer); gl.viewport(0, 0, width, height); gl.clearColor(...skyColor, 1); gl.clearDepth(1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.CULL_FACE); gl.useProgram(geometryProgram); gl.bindVertexArray(vao);
    gl.uniformMatrix4fv(uniforms.viewProjection, false, new Float32Array(packet.camera.viewProjectionMatrix)); gl.uniform3f(uniforms.cameraPosition, packet.camera.position.x, packet.camera.position.y, packet.camera.position.z);
    for (const range of packet.drawRanges) {
      if (range.transparencyClass === 'TRANSLUCENT') { gl.enable(gl.BLEND); gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false); }
      else { gl.disable(gl.BLEND); gl.depthMask(true); }
      gl.drawElements(gl.TRIANGLES, range.indexCount, gl.UNSIGNED_INT, range.indexStart * 4);
    }
    gl.depthMask(true); gl.disable(gl.BLEND); gl.finish();
    const error = gl.getError(); if (error !== gl.NO_ERROR) throw new Error(`B4_DRAW_ERROR:${error}`);
  };
  const readColor = () => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, geometryFramebuffer); const bytes = new Uint8Array(width * height * 4); gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, bytes); return bytes;
  };
  const readDepth = () => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer); gl.viewport(0, 0, width, height); gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND); gl.useProgram(depthProgram); gl.bindVertexArray(null); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, depthTexture); gl.uniform1i(uniforms.depth, 0); gl.drawArrays(gl.TRIANGLES, 0, 3); gl.finish();
    const rgba = new Uint8Array(width * height * 4); gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, rgba);
    const values = new Float32Array(width * height); const mask = new Uint8Array(width * height);
    for (let index = 0; index < values.length; index += 1) { values[index] = rgba[index * 4] / 255; mask[index] = rgba[index * 4] > 0 ? 1 : 0; }
    return { values, mask };
  };
  const present = () => { gl.bindFramebuffer(gl.READ_FRAMEBUFFER, geometryFramebuffer); gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null); gl.blitFramebuffer(0, 0, width, height, 0, 0, width, height, gl.COLOR_BUFFER_BIT, gl.NEAREST); gl.bindFramebuffer(gl.FRAMEBUFFER, null); };
  return { initialize, renderFrame, readColor, readDepth, present, packageIdentity: renderPackage.packageIdentity };
}

function readCanvas(canvas) {
  const gl = canvas.getContext('webgl2'); gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.finish(); const bytes = new Uint8Array(canvas.width * canvas.height * 4); gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, bytes); return bytes;
}
function readAcceptedDepth(renderer, canvas) {
  renderer.captureDepthSummary();
  const gl = canvas.getContext('webgl2'); const rgba = new Uint8Array(canvas.width * canvas.height * 4); gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, rgba);
  const values = new Float32Array(canvas.width * canvas.height); const mask = new Uint8Array(canvas.width * canvas.height);
  for (let index = 0; index < values.length; index += 1) { values[index] = rgba[index * 4] / 255; mask[index] = rgba[index * 4] > 0 ? 1 : 0; }
  return { values, mask };
}
function srgbToLinear(value) { const channel = value / 255; return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4; }
function luminance(bytes) {
  const values = new Float32Array(bytes.length / 4);
  for (let index = 0; index < values.length; index += 1) { const offset = index * 4; values[index] = 0.2126 * srgbToLinear(bytes[offset]) + 0.7152 * srgbToLinear(bytes[offset + 1]) + 0.0722 * srgbToLinear(bytes[offset + 2]); }
  return values;
}
function normalizeValues(values, mask, width, height, outputWidth, outputHeight) {
  const outputValues = new Float32Array(outputWidth * outputHeight); const outputMask = new Uint8Array(outputWidth * outputHeight);
  for (let oy = 0; oy < outputHeight; oy += 1) {
    const y0 = Math.floor(oy * height / outputHeight), y1 = Math.max(y0 + 1, Math.floor((oy + 1) * height / outputHeight));
    for (let ox = 0; ox < outputWidth; ox += 1) {
      const x0 = Math.floor(ox * width / outputWidth), x1 = Math.max(x0 + 1, Math.floor((ox + 1) * width / outputWidth));
      let sum = 0, count = 0;
      for (let y = y0; y < y1; y += 1) for (let x = x0; x < x1; x += 1) { const index = y * width + x; if (mask[index]) { sum += values[index]; count += 1; } }
      const target = oy * outputWidth + ox; outputMask[target] = count >= ((x1 - x0) * (y1 - y0) * 0.5) ? 1 : 0; outputValues[target] = count ? sum / count : 0;
    }
  }
  return { values: outputValues, mask: outputMask };
}
function gaussianBlur(values, width, height, sigma) {
  const radius = Math.ceil(sigma * 2.5); const kernel = new Float32Array(radius * 2 + 1); let total = 0;
  for (let offset = -radius; offset <= radius; offset += 1) { const value = Math.exp(-(offset * offset) / (2 * sigma * sigma)); kernel[offset + radius] = value; total += value; }
  for (let index = 0; index < kernel.length; index += 1) kernel[index] /= total;
  const temp = new Float32Array(values.length), output = new Float32Array(values.length);
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) { let value = 0; for (let k = -radius; k <= radius; k += 1) value += values[y * width + clamp(x + k, 0, width - 1)] * kernel[k + radius]; temp[y * width + x] = value; }
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) { let value = 0; for (let k = -radius; k <= radius; k += 1) value += temp[clamp(y + k, 0, height - 1) * width + x] * kernel[k + radius]; output[y * width + x] = value; }
  return output;
}
function directionalScore(values, mask, width, height, orientations, lags) {
  let mean = 0, count = 0; for (let index = 0; index < values.length; index += 1) if (mask[index]) { mean += values[index]; count += 1; } mean /= Math.max(1, count);
  let maximum = 0;
  for (const degrees of orientations) {
    const radians = degrees * Math.PI / 180;
    for (const lag of lags) {
      const dx = Math.round(Math.cos(radians) * lag), dy = Math.round(Math.sin(radians) * lag); let numerator = 0, leftEnergy = 0, rightEnergy = 0, pairs = 0;
      for (let y = Math.max(0, -dy); y < Math.min(height, height - dy); y += 1) for (let x = Math.max(0, -dx); x < Math.min(width, width - dx); x += 1) {
        const left = y * width + x, right = (y + dy) * width + x + dx; if (!mask[left] || !mask[right]) continue; const a = values[left] - mean, b = values[right] - mean; numerator += a * b; leftEnergy += a * a; rightEnergy += b * b; pairs += 1;
      }
      if (pairs > 32 && leftEnergy > 1e-12 && rightEnergy > 1e-12) maximum = Math.max(maximum, Math.abs(numerator / Math.sqrt(leftEnergy * rightEnergy)));
    }
  }
  return maximum;
}
function finalFrameMetric(bytes, depth, width, height) {
  const size = control.normalizedAnalysisSize; const normalized = normalizeValues(luminance(bytes), depth.mask, width, height, size.width, size.height);
  const blur2 = gaussianBlur(normalized.values, size.width, size.height, 2), blur8 = gaussianBlur(normalized.values, size.width, size.height, 8), blur24 = gaussianBlur(normalized.values, size.width, size.height, 24);
  const micro = new Float32Array(normalized.values.length), meso = new Float32Array(normalized.values.length), macro = new Float32Array(normalized.values.length);
  for (let index = 0; index < micro.length; index += 1) { micro[index] = normalized.values[index] - blur2[index]; meso[index] = blur2[index] - blur8[index]; macro[index] = blur8[index] - blur24[index]; }
  const bands = {
    micro: directionalScore(micro, normalized.mask, size.width, size.height, control.finalFrameMetric.orientationsDegrees, control.finalFrameMetric.lagsPixels),
    meso: directionalScore(meso, normalized.mask, size.width, size.height, control.finalFrameMetric.orientationsDegrees, control.finalFrameMetric.lagsPixels),
    macro: directionalScore(macro, normalized.mask, size.width, size.height, control.finalFrameMetric.orientationsDegrees, control.finalFrameMetric.lagsPixels)
  };
  return { bands, sceneScore: average(Object.values(bands)), eligibleFraction: normalized.mask.reduce((sum, value) => sum + value, 0) / normalized.mask.length };
}
function boxMean(values, width, height, radius) {
  const output = new Float64Array(values.length);
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) { let sum = 0, count = 0; for (let dy = -radius; dy <= radius; dy += 1) for (let dx = -radius; dx <= radius; dx += 1) { const nx = clamp(x + dx, 0, width - 1), ny = clamp(y + dy, 0, height - 1); sum += values[ny * width + nx]; count += 1; } output[y * width + x] = sum / count; }
  return output;
}
function fixedCorrelation(values, width, height, dx, dy) {
  let leftMean = 0, rightMean = 0, pairs = 0;
  for (let y = Math.max(0, -dy); y < Math.min(height, height - dy); y += 1) for (let x = Math.max(0, -dx); x < Math.min(width, width - dx); x += 1) { leftMean += values[y * width + x]; rightMean += values[(y + dy) * width + x + dx]; pairs += 1; }
  leftMean /= pairs; rightMean /= pairs; let numerator = 0, leftEnergy = 0, rightEnergy = 0;
  for (let y = Math.max(0, -dy); y < Math.min(height, height - dy); y += 1) for (let x = Math.max(0, -dx); x < Math.min(width, width - dx); x += 1) { const a = values[y * width + x] - leftMean, b = values[(y + dy) * width + x + dx] - rightMean; numerator += a * b; leftEnergy += a * a; rightEnergy += b * b; }
  return Math.abs(numerator / Math.sqrt(Math.max(1e-12, leftEnergy * rightEnergy)));
}
function morphologyMetrics(heights, grid) {
  const trend = boxMean(heights, grid.width, grid.height, control.morphologyMetric.detrendRadiusCells); const residual = new Float64Array(heights.length); const slope = new Float64Array(heights.length);
  for (let y = 0; y < grid.height; y += 1) for (let x = 0; x < grid.width; x += 1) { const index = y * grid.width + x; residual[index] = heights[index] - trend[index]; const left = heights[y * grid.width + clamp(x - 1, 0, grid.width - 1)], right = heights[y * grid.width + clamp(x + 1, 0, grid.width - 1)]; slope[index] = (right - left) / (2 * grid.xSpacing); }
  const lag = control.morphologyMetric.dominantLagCells;
  const heightfieldDirectionalScore = fixedCorrelation(residual, grid.width, grid.height, lag, 0);
  const slopeFieldDirectionalScore = fixedCorrelation(slope, grid.width, grid.height, lag, 0);
  const local = boxMean(heights, grid.width, grid.height, lag); const ridge = new Float64Array(heights.length), valley = new Float64Array(heights.length); const bins = control.morphologyMetric.orientationBins; const ridgeHistogram = Array(bins).fill(0), valleyHistogram = Array(bins).fill(0);
  for (let y = 1; y < grid.height - 1; y += 1) for (let x = 1; x < grid.width - 1; x += 1) { const index = y * grid.width + x; const tpi = heights[index] - local[index]; const dx = heights[index + 1] - heights[index - 1], dz = heights[index + grid.width] - heights[index - grid.width]; const angle = (Math.atan2(dz, dx) + Math.PI * 2) % Math.PI; const bin = Math.min(bins - 1, Math.floor(angle / Math.PI * bins)); if (tpi > 0.35) { ridge[index] = 1; ridgeHistogram[bin] += 1; } if (tpi < -0.35) { valley[index] = 1; valleyHistogram[bin] += 1; } }
  const entropy = (histogram) => { const total = histogram.reduce((sum, value) => sum + value, 0); if (!total) return 0; let value = 0; for (const count of histogram) if (count) { const p = count / total; value -= p * Math.log(p); } return value / Math.log(histogram.length); };
  const spacing = (field) => { let best = { lagCells: 0, score: 0 }; for (const candidate of [2,3,4,6,8,12,16,24,32]) { const score = fixedCorrelation(field, grid.width, grid.height, candidate, 0); if (score > best.score) best = { lagCells: candidate, score }; } return best; };
  return { heightfieldDirectionalScore, slopeFieldDirectionalScore, ridgeOrientationEntropy: entropy(ridgeHistogram), valleyOrientationEntropy: entropy(valleyHistogram), dominantRidgeSpacing: spacing(ridge), dominantValleySpacing: spacing(valley) };
}

export async function createB4MorphologyLeverageSuite({ acceptedCanvas, baselineCanvas, probeACanvas, probeBCanvas }) {
  const built = buildHEarthB3TwoFixedMorphologyProbes(b3Authority, b2Authority);
  if (built.baselineDigest !== control.frozenDigests.baseline || built.protectionDigest !== control.frozenDigests.protection || built.guidanceDigest !== control.frozenDigests.guidance) throw new Error('B4_FROZEN_DIGEST_MISMATCH');
  const probeA = built.probes[0], probeB = built.probes[1];
  if (probeA.digest !== control.frozenDigests.probeA || probeB.digest !== control.frozenDigests.probeB) throw new Error('B4_PROBE_DIGEST_MISMATCH');
  const response = await fetch(control.acceptedRendererSourceUrl, { cache: 'no-store' });
  if (!response.ok) throw new Error(`B4_ACCEPTED_RENDERER_SOURCE_FETCH_FAILED:${response.status}`);
  const acceptedSource = await response.text();
  const shaders = { VS: extractShader(acceptedSource, 'VS'), FS: extractShader(acceptedSource, 'FS'), DVS: extractShader(acceptedSource, 'DVS'), DFS: extractShader(acceptedSource, 'DFS') };
  const renderPackage = getHEarthRun8ER2CanonicalLiveRenderPackage();
  const rawViews = createHEarthRun8ER2DCanonicalGPUUploadViews(renderPackage);
  const initialState = stateForView(control.scenes[0].camera, control.scenes[0].target); let sequence = 1;
  const initialPacket = createHEarthRun8ER3AFrameUniformPacket({ navigationState: initialState, viewport: control.viewport, frameSequence: sequence });
  const accepted = createAcceptedRenderer({ canvas: acceptedCanvas, width: control.viewport.width, height: control.viewport.height });
  const baseline = createDiagnosticRenderer({ canvas: baselineCanvas, width: control.viewport.width, height: control.viewport.height, shaders, uploadViews: viewsForHeights(rawViews, null, built.grid), renderPackage });
  const rendererA = createDiagnosticRenderer({ canvas: probeACanvas, width: control.viewport.width, height: control.viewport.height, shaders, uploadViews: viewsForHeights(rawViews, probeA.heights, built.grid), renderPackage });
  const rendererB = createDiagnosticRenderer({ canvas: probeBCanvas, width: control.viewport.width, height: control.viewport.height, shaders, uploadViews: viewsForHeights(rawViews, probeB.heights, built.grid), renderPackage });
  accepted.initialize(initialPacket); baseline.initialize(initialPacket); rendererA.initialize(initialPacket); rendererB.initialize(initialPacket);
  const sceneMap = new Map(control.scenes.map((scene) => [scene.id, scene])); const records = [];
  const renderScene = (sceneId) => {
    const scene = sceneMap.get(sceneId); if (!scene) throw new Error(`B4_SCENE_UNKNOWN:${sceneId}`);
    const state = stateForView(scene.camera, scene.target); const packet = createHEarthRun8ER3AFrameUniformPacket({ navigationState: state, viewport: control.viewport, frameSequence: ++sequence });
    accepted.renderFrame(packet); accepted.presentColorFrame(); const acceptedBytes = readCanvas(acceptedCanvas); const acceptedDepth = readAcceptedDepth(accepted, acceptedCanvas);
    baseline.renderFrame(packet); const baselineBytes = baseline.readColor(); const baselineDepth = baseline.readDepth(); baseline.present();
    rendererA.renderFrame(packet); const aBytes = rendererA.readColor(); const aDepth = rendererA.readDepth(); rendererA.present(); rendererA.renderFrame(packet); const aRepeatedHash = fnv(rendererA.readColor()); rendererA.present();
    rendererB.renderFrame(packet); const bBytes = rendererB.readColor(); const bDepth = rendererB.readDepth(); rendererB.present(); rendererB.renderFrame(packet); const bRepeatedHash = fnv(rendererB.readColor()); rendererB.present();
    const baselineMetric = finalFrameMetric(baselineBytes, baselineDepth, control.viewport.width, control.viewport.height); const aMetric = finalFrameMetric(aBytes, aDepth, control.viewport.width, control.viewport.height); const bMetric = finalFrameMetric(bBytes, bDepth, control.viewport.width, control.viewport.height);
    const record = {
      scene: clone(scene),
      acceptedRendererEquivalent: exactBytes(acceptedBytes, baselineBytes) && exactBytes(acceptedDepth.mask, baselineDepth.mask),
      acceptedHash: fnv(acceptedBytes), baselineHash: fnv(baselineBytes), probeAHash: fnv(aBytes), probeBHash: fnv(bBytes),
      probeADeterministic: aRepeatedHash === fnv(aBytes), probeBDeterministic: bRepeatedHash === fnv(bBytes),
      baseline: baselineMetric, probeA: aMetric, probeB: bMetric,
      probeAFinalFrameReduction: 1 - aMetric.sceneScore / Math.max(1e-12, baselineMetric.sceneScore),
      probeBFinalFrameReduction: 1 - bMetric.sceneScore / Math.max(1e-12, baselineMetric.sceneScore)
    };
    records.push(record); return clone(record);
  };
  const finalize = () => {
    const baselineMorphology = morphologyMetrics(built.baseline.heights, built.grid); const aMorphology = morphologyMetrics(probeA.heights, built.grid); const bMorphology = morphologyMetrics(probeB.heights, built.grid);
    const baselineFinal = average(records.map((record) => record.baseline.sceneScore));
    const summarizeProbe = (id, amplitude, morphology, key, digest) => {
      const finalScore = average(records.map((record) => record[key].sceneScore));
      return {
        probeId: id, amplitudeFractionOfLocalRelief: amplitude, digest,
        morphology,
        heightfieldDirectionalRepetitionReduction: 1 - morphology.heightfieldDirectionalScore / Math.max(1e-12, baselineMorphology.heightfieldDirectionalScore),
        slopeFieldDirectionalRepetitionReduction: 1 - morphology.slopeFieldDirectionalScore / Math.max(1e-12, baselineMorphology.slopeFieldDirectionalScore),
        finalFrameRepetitionScore: finalScore,
        finalFrameRepetitionReduction: 1 - finalScore / Math.max(1e-12, baselineFinal),
        improvedSceneCount: records.filter((record) => record[key].sceneScore < record.baseline.sceneScore).length
      };
    };
    const probes = [summarizeProbe(probeA.probeId, probeA.amplitudeFractionOfLocalRelief, aMorphology, 'probeA', probeA.digest), summarizeProbe(probeB.probeId, probeB.amplitudeFractionOfLocalRelief, bMorphology, 'probeB', probeB.digest)];
    const successful = probes.filter((probe) => probe.heightfieldDirectionalRepetitionReduction >= control.gates.heightfieldDirectionalRepetitionReductionMinimum && probe.finalFrameRepetitionReduction >= control.gates.finalFrameRepetitionReductionMinimum && probe.improvedSceneCount >= control.gates.improvedSceneMinimum).sort((left, right) => left.amplitudeFractionOfLocalRelief - right.amplitudeFractionOfLocalRelief);
    let disposition;
    if (successful.length) disposition = 'MORPHOLOGY_LEVERAGE_ESTABLISHED';
    else if (probes.every((probe) => probe.finalFrameRepetitionReduction < control.gates.leverageNotEstablishedBothProbeFinalFrameMaximumExclusive)) disposition = 'MORPHOLOGY_LEVERAGE_NOT_ESTABLISHED';
    else disposition = 'WEAK_OR_INCONCLUSIVE_LEVERAGE';
    return clone({
      checkpoint: 'B4', disposition,
      result: disposition === 'MORPHOLOGY_LEVERAGE_ESTABLISHED' ? 'B4_MORPHOLOGY_LEVERAGE_ESTABLISHED_PASS_CLOSED' : disposition === 'MORPHOLOGY_LEVERAGE_NOT_ESTABLISHED' ? 'B4_MORPHOLOGY_LEVERAGE_NOT_ESTABLISHED_STOP_CLOSED' : 'B4_WEAK_OR_INCONCLUSIVE_LEVERAGE_STOP_CLOSED',
      baseline: { digest: built.baselineDigest, morphology: baselineMorphology, finalFrameRepetitionScore: baselineFinal },
      probes,
      selectedProbe: successful[0]?.probeId ?? null,
      scenes: records,
      acceptedRendererEquivalentAcrossAllScenes: records.every((record) => record.acceptedRendererEquivalent),
      deterministicAcrossAllProbeFrames: records.every((record) => record.probeADeterministic && record.probeBDeterministic),
      b5Authorized: disposition === 'MORPHOLOGY_LEVERAGE_ESTABLISHED',
      liveRouteChanged: false,
      productMutationPerformed: false,
      stoppingBoundary: 'STOP_AFTER_CAUSAL_CLASSIFICATION'
    });
  };
  return Object.freeze({ listSceneIds: () => [...sceneMap.keys()], renderScene, finalize });
}

export default createB4MorphologyLeverageSuite;

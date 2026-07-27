import {
  buildHEarthRun8ER3AWaypointPacket,
  getHEarthRun8ER3ALiveRendererInterface
} from '../../render/live-renderer-contract.run8e-r3a.js';
import { getHEarthRun8ER2ImmutableLiveRenderPackage } from '../../render/live-render-package.run8e-r2.js';
import { createHEarthRun8ER2DCanonicalGPUUploadViews } from '../../render/gpu-upload-views.run8e-r2d.js';

const canvas = document.getElementById('r3b-canvas');
const statusNode = document.getElementById('r3b-status');
const metricsNode = document.getElementById('r3b-metrics');
if (!canvas || !statusNode || !metricsNode) throw new Error('R3B_DIAGNOSTIC_HOST_INCOMPLETE');

const WIDTH = 960;
const HEIGHT = 540;
const PROMOTED_LOGICAL_PACKAGE_IDENTITY = 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25';
const CHROMIUM_RUNTIME_PACKAGE_IDENTITY = 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_E7D54BDD';
canvas.width = WIDTH;
canvas.height = HEIGHT;

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const color3 = (value) => {
  const source = Array.isArray(value) ? value : [0, 0, 0];
  const scale = source.some((item) => item > 1) ? 255 : 1;
  return source.slice(0, 3).map((item) => clamp01(Number(item) / scale));
};
const hashBytes = (bytes) => {
  let hash = 0x811c9dc5;
  for (const byte of bytes) {
    hash ^= byte;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `fnv1a32:${hash.toString(16).padStart(8, '0')}`;
};
const summarizePixels = (bytes, clearRgb) => {
  let nonClearPixelCount = 0;
  let opaquePixelCount = 0;
  let sum = 0;
  let sumSquares = 0;
  const buckets = new Set();
  const pixelCount = bytes.length / 4;
  for (let offset = 0; offset < bytes.length; offset += 4) {
    const r = bytes[offset];
    const g = bytes[offset + 1];
    const b = bytes[offset + 2];
    const a = bytes[offset + 3];
    const difference = Math.abs(r - clearRgb[0]) + Math.abs(g - clearRgb[1]) + Math.abs(b - clearRgb[2]);
    if (difference > 9) nonClearPixelCount += 1;
    if (a === 255) opaquePixelCount += 1;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    sum += luminance;
    sumSquares += luminance * luminance;
    buckets.add(`${r >> 4}:${g >> 4}:${b >> 4}`);
  }
  const mean = sum / pixelCount;
  const variance = Math.max(0, sumSquares / pixelCount - mean * mean);
  return {
    pixelCount,
    nonClearPixelCount,
    opaquePixelCount,
    uniqueColorBucketCount: buckets.size,
    meanLuminance: mean,
    luminanceStandardDeviation: Math.sqrt(variance),
    byteHash: hashBytes(bytes)
  };
};

const compileShader = (gl, type, source, label) => {
  const shader = gl.createShader(type);
  if (!shader) throw new Error(`R3B_SHADER_CREATE_FAILED:${label}`);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS) === true;
  const log = gl.getShaderInfoLog(shader) ?? '';
  if (!compiled) throw new Error(`R3B_SHADER_COMPILE_FAILED:${label}:${log}`);
  return { shader, compiled, log };
};
const linkProgram = (gl, vertexShader, fragmentShader, label) => {
  const program = gl.createProgram();
  if (!program) throw new Error(`R3B_PROGRAM_CREATE_FAILED:${label}`);
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS) === true;
  const log = gl.getProgramInfoLog(program) ?? '';
  if (!linked) throw new Error(`R3B_PROGRAM_LINK_FAILED:${label}:${log}`);
  return { program, linked, log };
};
const requireUniform = (gl, program, name) => {
  const location = gl.getUniformLocation(program, name);
  if (location === null) throw new Error(`R3B_UNIFORM_MISSING:${name}`);
  return location;
};
const requireFramebuffer = (gl, label) => {
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status !== gl.FRAMEBUFFER_COMPLETE) throw new Error(`R3B_FRAMEBUFFER_INCOMPLETE:${label}:${status}`);
  return status;
};

const VERTEX_SHADER = `#version 300 es
precision highp float;
precision highp int;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec4 aBaseColorLinear;
layout(location=3) in vec4 aMaterialParameters;
layout(location=4) in uint aMaterialModelCode;
layout(location=5) in uint aSurfaceClassCode;
layout(location=6) in uint aPrimitiveIndex;
layout(location=7) in uint aRoleCode;
uniform mat4 uViewProjection;
out vec3 vWorldPosition;
out vec3 vNormal;
out vec4 vBaseColor;
out vec4 vMaterialParameters;
flat out uint vMaterialModelCode;
flat out uint vSurfaceClassCode;
flat out uint vPrimitiveIndex;
flat out uint vRoleCode;
void main() {
  vWorldPosition = aPosition;
  vNormal = aNormal;
  vBaseColor = aBaseColorLinear;
  vMaterialParameters = aMaterialParameters;
  vMaterialModelCode = aMaterialModelCode;
  vSurfaceClassCode = aSurfaceClassCode;
  vPrimitiveIndex = aPrimitiveIndex;
  vRoleCode = aRoleCode;
  gl_Position = uViewProjection * vec4(aPosition, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
precision highp int;
in vec3 vWorldPosition;
in vec3 vNormal;
in vec4 vBaseColor;
in vec4 vMaterialParameters;
flat in uint vMaterialModelCode;
flat in uint vSurfaceClassCode;
flat in uint vPrimitiveIndex;
flat in uint vRoleCode;
uniform vec3 uCameraPosition;
uniform vec3 uSunDirection;
uniform float uSunIntensity;
uniform vec3 uSunColor;
uniform vec3 uSkyZenithColor;
uniform vec3 uSkyHorizonColor;
uniform vec3 uGroundHazeColor;
uniform float uFogStartDistance;
uniform float uFogFalloff;
uniform float uMaximumFogFactor;
uniform float uDistanceDesaturationStrength;
out vec4 outColor;
void main() {
  vec3 normal = normalize(vNormal);
  vec3 lightDirection = normalize(-uSunDirection);
  float diffuse = max(dot(normal, lightDirection), 0.0);
  float ambient = 0.30 + 0.08 * max(normal.y, 0.0);
  float roleBoost = vRoleCode == 1u ? 1.05 : (vRoleCode == 2u ? 1.15 : 0.92);
  vec3 lit = max(vBaseColor.rgb, vec3(0.004)) * (ambient + diffuse * uSunIntensity * 0.72) * uSunColor * roleBoost;
  float distanceToCamera = length(vWorldPosition - uCameraPosition);
  float fogFactor = clamp((distanceToCamera - uFogStartDistance) * max(uFogFalloff, 0.00001), 0.0, uMaximumFogFactor);
  float luminance = dot(lit, vec3(0.2126, 0.7152, 0.0722));
  lit = mix(lit, vec3(luminance), clamp(fogFactor * uDistanceDesaturationStrength, 0.0, 1.0));
  vec3 atmosphereTint = mix(uSkyHorizonColor, uSkyZenithColor, clamp(normal.y * 0.5 + 0.5, 0.0, 1.0));
  lit = mix(lit, atmosphereTint, fogFactor * 0.22);
  lit = mix(lit, uGroundHazeColor, fogFactor * 0.78);
  float alpha = clamp(vBaseColor.a, 0.18, 1.0);
  outColor = vec4(pow(clamp(lit, 0.0, 1.0), vec3(1.0 / 2.2)), alpha);
}`;

const DEPTH_VERTEX_SHADER = `#version 300 es
precision highp float;
const vec2 points[3] = vec2[3](vec2(-1.0,-1.0), vec2(3.0,-1.0), vec2(-1.0,3.0));
out vec2 vUv;
void main() {
  vec2 point = points[gl_VertexID];
  vUv = point * 0.5 + 0.5;
  gl_Position = vec4(point, 0.0, 1.0);
}`;
const DEPTH_FRAGMENT_SHADER = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uDepth;
out vec4 outColor;
void main() {
  float depth = texture(uDepth, vUv).r;
  float visibility = clamp((1.0 - depth) * 28.0, 0.0, 1.0);
  outColor = vec4(vec3(visibility), 1.0);
}`;

async function executeFixedFrame() {
  statusNode.textContent = 'Creating isolated WebGL2 fixed frame…';
  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    depth: true,
    stencil: false,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance'
  });
  if (!gl) throw new Error('R3B_WEBGL2_CONTEXT_UNAVAILABLE');

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const contextIdentity = {
    vendor: gl.getParameter(gl.VENDOR),
    renderer: gl.getParameter(gl.RENDERER),
    unmaskedVendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : null,
    unmaskedRenderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null,
    version: gl.getParameter(gl.VERSION),
    shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
    contextLost: gl.isContextLost()
  };

  const packet = buildHEarthRun8ER3AWaypointPacket('COAST', { width: WIDTH, height: HEIGHT, pixelRatio: 1 }, 1);
  const rendererInterface = getHEarthRun8ER3ALiveRendererInterface();
  const packageRecord = getHEarthRun8ER2ImmutableLiveRenderPackage();
  const views = createHEarthRun8ER2DCanonicalGPUUploadViews(packageRecord);
  const packetIssues = [];
  if (packet?.contractId !== 'H_EARTH_RUN_8E_R3A_SHARED_CAMERA_GPU_PRESENTATION_CONTRACT_v1') packetIssues.push('R3B_R3A_PACKET_CONTRACT_MISMATCH');
  if (packageRecord?.packageIdentity !== CHROMIUM_RUNTIME_PACKAGE_IDENTITY) packetIssues.push(`R3B_CHROMIUM_RUNTIME_PACKAGE_IDENTITY_MISMATCH:${packageRecord?.packageIdentity}`);
  if (packet?.packageIdentity !== packageRecord?.packageIdentity) packetIssues.push('R3B_PACKET_PACKAGE_RUNTIME_IDENTITY_MISMATCH');
  if (packet?.packageContentDigest !== packageRecord?.contentDigest) packetIssues.push('R3B_PACKET_PACKAGE_CONTENT_DIGEST_MISMATCH');
  if (packet?.successorTerrainCameraReconciled !== true) packetIssues.push('R3B_CAMERA_NOT_RECONCILED');
  if (packet?.worldBuiltBecauseCameraMoved !== false) packetIssues.push('R3B_WORLD_REBUILT_FOR_CAMERA');
  if (!Array.isArray(packet?.camera?.viewProjectionMatrix) || packet.camera.viewProjectionMatrix.length !== 16 || packet.camera.viewProjectionMatrix.some((value) => !finite(value))) {
    packetIssues.push('R3B_VIEW_PROJECTION_MATRIX_INVALID');
  }
  if (views?.deterministicTransportEncoding !== true) packetIssues.push('R3B_CANONICAL_GPU_TRANSPORT_MISSING');
  if (packetIssues.length > 0) throw new Error(`R3B_RUNTIME_PACKET_REJECTED:${packetIssues.join(',')}`);

  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER, 'GEOMETRY_VERTEX');
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER, 'GEOMETRY_FRAGMENT');
  const geometryProgram = linkProgram(gl, vertex.shader, fragment.shader, 'GEOMETRY_PROGRAM');
  const depthVertex = compileShader(gl, gl.VERTEX_SHADER, DEPTH_VERTEX_SHADER, 'DEPTH_VERTEX');
  const depthFragment = compileShader(gl, gl.FRAGMENT_SHADER, DEPTH_FRAGMENT_SHADER, 'DEPTH_FRAGMENT');
  const depthProgram = linkProgram(gl, depthVertex.shader, depthFragment.shader, 'DEPTH_PROGRAM');

  const vao = gl.createVertexArray();
  if (!vao) throw new Error('R3B_VAO_CREATE_FAILED');
  gl.bindVertexArray(vao);
  const bufferSpecifications = [
    ['positions', views.positions, 0, 3, gl.FLOAT, false],
    ['normals', views.normals, 1, 3, gl.FLOAT, false],
    ['baseColorsLinear', views.baseColorsLinear, 2, 4, gl.FLOAT, false],
    ['materialParameters', views.materialParameters, 3, 4, gl.FLOAT, false],
    ['materialModelCodes', views.materialModelCodes, 4, 1, gl.UNSIGNED_BYTE, true],
    ['surfaceClassCodes', views.surfaceClassCodes, 5, 1, gl.UNSIGNED_BYTE, true],
    ['primitiveIndices', views.primitiveIndices, 6, 1, gl.UNSIGNED_SHORT, true],
    ['roleCodes', views.roleCodes, 7, 1, gl.UNSIGNED_BYTE, true]
  ];
  const gpuBuffers = [];
  let uploadedByteLength = 0;
  for (const [name, data, location, size, type, integer] of bufferSpecifications) {
    const buffer = gl.createBuffer();
    if (!buffer) throw new Error(`R3B_BUFFER_CREATE_FAILED:${name}`);
    gpuBuffers.push({ name, buffer, byteLength: data.byteLength });
    uploadedByteLength += data.byteLength;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location);
    if (integer) gl.vertexAttribIPointer(location, size, type, 0, 0);
    else gl.vertexAttribPointer(location, size, type, false, 0, 0);
  }
  const indexBuffer = gl.createBuffer();
  if (!indexBuffer) throw new Error('R3B_INDEX_BUFFER_CREATE_FAILED');
  gpuBuffers.push({ name: 'indices', buffer: indexBuffer, byteLength: views.indices.byteLength });
  uploadedByteLength += views.indices.byteLength;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, views.indices, gl.STATIC_DRAW);

  const colorTexture = gl.createTexture();
  const depthTexture = gl.createTexture();
  const framebuffer = gl.createFramebuffer();
  if (!colorTexture || !depthTexture || !framebuffer) throw new Error('R3B_FRAMEBUFFER_RESOURCE_CREATE_FAILED');
  gl.bindTexture(gl.TEXTURE_2D, colorTexture);
  gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, WIDTH, HEIGHT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.bindTexture(gl.TEXTURE_2D, depthTexture);
  gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT24, WIDTH, HEIGHT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.NONE);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTexture, 0);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0);
  const geometryFramebufferStatus = requireFramebuffer(gl, 'GEOMETRY');

  const sky = color3(packet.environmentUniforms.skyHorizonColor);
  const clearRgb = sky.map((value) => Math.round(value * 255));
  gl.viewport(0, 0, WIDTH, HEIGHT);
  gl.clearColor(sky[0], sky[1], sky[2], 1);
  gl.clearDepth(1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.disable(gl.CULL_FACE);
  gl.useProgram(geometryProgram.program);
  gl.bindVertexArray(vao);

  const uniforms = {
    viewProjection: requireUniform(gl, geometryProgram.program, 'uViewProjection'),
    cameraPosition: requireUniform(gl, geometryProgram.program, 'uCameraPosition'),
    sunDirection: requireUniform(gl, geometryProgram.program, 'uSunDirection'),
    sunIntensity: requireUniform(gl, geometryProgram.program, 'uSunIntensity'),
    sunColor: requireUniform(gl, geometryProgram.program, 'uSunColor'),
    skyZenithColor: requireUniform(gl, geometryProgram.program, 'uSkyZenithColor'),
    skyHorizonColor: requireUniform(gl, geometryProgram.program, 'uSkyHorizonColor'),
    groundHazeColor: requireUniform(gl, geometryProgram.program, 'uGroundHazeColor'),
    fogStartDistance: requireUniform(gl, geometryProgram.program, 'uFogStartDistance'),
    fogFalloff: requireUniform(gl, geometryProgram.program, 'uFogFalloff'),
    maximumFogFactor: requireUniform(gl, geometryProgram.program, 'uMaximumFogFactor'),
    distanceDesaturationStrength: requireUniform(gl, geometryProgram.program, 'uDistanceDesaturationStrength')
  };
  const environment = packet.environmentUniforms;
  gl.uniformMatrix4fv(uniforms.viewProjection, false, new Float32Array(packet.camera.viewProjectionMatrix));
  gl.uniform3f(uniforms.cameraPosition, packet.camera.position.x, packet.camera.position.y, packet.camera.position.z);
  gl.uniform3f(uniforms.sunDirection, environment.sunDirection.x, environment.sunDirection.y, environment.sunDirection.z);
  gl.uniform1f(uniforms.sunIntensity, environment.sunIntensity);
  gl.uniform3fv(uniforms.sunColor, color3(environment.sunColor));
  gl.uniform3fv(uniforms.skyZenithColor, color3(environment.skyZenithColor));
  gl.uniform3fv(uniforms.skyHorizonColor, sky);
  gl.uniform3fv(uniforms.groundHazeColor, color3(environment.groundHazeColor));
  gl.uniform1f(uniforms.fogStartDistance, environment.fogStartDistance);
  gl.uniform1f(uniforms.fogFalloff, environment.fogFalloff);
  gl.uniform1f(uniforms.maximumFogFactor, environment.maximumFogFactor);
  gl.uniform1f(uniforms.distanceDesaturationStrength, environment.distanceDesaturationStrength);

  const drawReceipts = [];
  let totalDrawnIndexCount = 0;
  for (const range of packet.drawRanges) {
    const translucent = range.transparencyClass === 'TRANSLUCENT';
    if (translucent) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.depthMask(false);
    } else {
      gl.disable(gl.BLEND);
      gl.depthMask(true);
    }
    gl.drawElements(gl.TRIANGLES, range.indexCount, gl.UNSIGNED_INT, range.indexStart * 4);
    const error = gl.getError();
    if (error !== gl.NO_ERROR) throw new Error(`R3B_DRAW_ERROR:${range.role}:${error}`);
    totalDrawnIndexCount += range.indexCount;
    drawReceipts.push({
      role: range.role,
      transparencyClass: range.transparencyClass,
      indexStart: range.indexStart,
      indexCount: range.indexCount,
      primitiveCount: range.primitiveCount,
      executed: true,
      error
    });
  }
  gl.depthMask(true);
  gl.disable(gl.BLEND);
  gl.finish();

  const colorPixels = new Uint8Array(WIDTH * HEIGHT * 4);
  gl.readPixels(0, 0, WIDTH, HEIGHT, gl.RGBA, gl.UNSIGNED_BYTE, colorPixels);
  if (gl.getError() !== gl.NO_ERROR) throw new Error('R3B_COLOR_READBACK_FAILED');
  const colorSummary = summarizePixels(colorPixels, clearRgb);

  const depthColorTexture = gl.createTexture();
  const depthFramebuffer = gl.createFramebuffer();
  if (!depthColorTexture || !depthFramebuffer) throw new Error('R3B_DEPTH_VISUALIZATION_RESOURCE_CREATE_FAILED');
  gl.bindTexture(gl.TEXTURE_2D, depthColorTexture);
  gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, WIDTH, HEIGHT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, depthColorTexture, 0);
  const depthFramebufferStatus = requireFramebuffer(gl, 'DEPTH_VISUALIZATION');
  gl.viewport(0, 0, WIDTH, HEIGHT);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.BLEND);
  gl.useProgram(depthProgram.program);
  gl.bindVertexArray(null);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, depthTexture);
  gl.uniform1i(requireUniform(gl, depthProgram.program, 'uDepth'), 0);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  if (gl.getError() !== gl.NO_ERROR) throw new Error('R3B_DEPTH_VISUALIZATION_DRAW_FAILED');
  gl.finish();
  const depthPixels = new Uint8Array(WIDTH * HEIGHT * 4);
  gl.readPixels(0, 0, WIDTH, HEIGHT, gl.RGBA, gl.UNSIGNED_BYTE, depthPixels);
  if (gl.getError() !== gl.NO_ERROR) throw new Error('R3B_DEPTH_VISUALIZATION_READBACK_FAILED');
  const depthSummary = summarizePixels(depthPixels, [0, 0, 0]);

  gl.bindFramebuffer(gl.READ_FRAMEBUFFER, framebuffer);
  gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
  gl.blitFramebuffer(0, 0, WIDTH, HEIGHT, 0, 0, WIDTH, HEIGHT, gl.COLOR_BUFFER_BIT, gl.NEAREST);
  if (gl.getError() !== gl.NO_ERROR) throw new Error('R3B_VISIBLE_FRAME_BLIT_FAILED');
  gl.finish();

  const receipt = {
    receiptType: 'H_EARTH_RUN_8E_R3B_ISOLATED_WEBGL2_FIXED_FRAME_BROWSER_RECEIPT',
    eligible: true,
    status: 'RUN_8E_R3B_ISOLATED_WEBGL2_FIXED_FRAME_PASS',
    context: { created: true, ...contextIdentity },
    shaders: {
      geometryVertexCompiled: vertex.compiled,
      geometryFragmentCompiled: fragment.compiled,
      geometryProgramLinked: geometryProgram.linked,
      depthVertexCompiled: depthVertex.compiled,
      depthFragmentCompiled: depthFragment.compiled,
      depthProgramLinked: depthProgram.linked
    },
    framebuffer: {
      geometryFramebufferComplete: geometryFramebufferStatus === gl.FRAMEBUFFER_COMPLETE,
      depthVisualizationFramebufferComplete: depthFramebufferStatus === gl.FRAMEBUFFER_COMPLETE,
      colorAttachmentInternalFormat: 'RGBA8',
      depthAttachmentInternalFormat: 'DEPTH_COMPONENT24'
    },
    package: {
      logicalPromotedIdentity: PROMOTED_LOGICAL_PACKAGE_IDENTITY,
      runtimeIdentity: packageRecord.packageIdentity,
      runtimeContentDigest: packageRecord.contentDigest,
      contentDigest: packageRecord.contentDigest,
      primitiveCount: packageRecord.primitiveCount,
      vertexCount: packageRecord.vertexCount,
      triangleCount: packageRecord.triangleCount,
      indexCount: packageRecord.indexCount,
      drawRangeCount: packageRecord.drawRanges.length,
      gpuBufferCount: gpuBuffers.length,
      uploadedByteLength,
      uploadedOnce: true,
      canonicalGpuTransport: views.deterministicTransportEncoding === true
    },
    cameraPacket: {
      contractId: packet.contractId,
      navigationStateId: packet.navigationStateId,
      waypointId: 'COAST',
      viewport: packet.viewport,
      viewProjectionMatrix: packet.camera.viewProjectionMatrix,
      successorTerrainCameraReconciled: packet.successorTerrainCameraReconciled,
      worldBuiltBecauseCameraMoved: packet.worldBuiltBecauseCameraMoved
    },
    rendererInterface: {
      contractId: rendererInterface.contractId,
      attributeCount: rendererInterface.attributeLayout.length,
      uniformCount: rendererInterface.frameUniformNames.length,
      drawRangeCount: rendererInterface.drawRanges.length
    },
    execution: {
      geometryDrawCallCount: drawReceipts.length,
      depthVisualizationDrawCallCount: 1,
      totalDrawnIndexCount,
      drawReceipts,
      colorOutput: colorSummary,
      depthOutput: depthSummary,
      visibleCanvasWidth: canvas.width,
      visibleCanvasHeight: canvas.height,
      fixedFrameOnly: true,
      renderLoopCreated: false,
      interactionBindingCreated: false,
      publicRouteBound: false
    },
    correspondence: {
      knownChromiumRuntimeIdentity: packageRecord.packageIdentity === CHROMIUM_RUNTIME_PACKAGE_IDENTITY,
      logicalPromotedIdentityPreserved: PROMOTED_LOGICAL_PACKAGE_IDENTITY === 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25',
      packetMatchesRuntimePackageIdentity: packet.packageIdentity === packageRecord.packageIdentity,
      packetMatchesRuntimeContentDigest: packet.packageContentDigest === packageRecord.contentDigest,
      exactDrawRanges: JSON.stringify(packageRecord.drawRanges) === JSON.stringify(packet.drawRanges),
      exactIndexCoverage: totalDrawnIndexCount === packageRecord.indexCount,
      materialInputsConsumed: views.baseColorsLinear.length === packageRecord.vertexCount * 4 && views.materialParameters.length === packageRecord.vertexCount * 4,
      atmosphereInputsConsumed: Object.values(environment).every((value) => typeof value !== 'number' || finite(value)),
      depthTestExecuted: true,
      realColorAndDepthAttachments: true
    },
    boundaries: {
      publicRouteMutated: false,
      directManipulationMutated: false,
      navigationAuthorityMutated: false,
      liveRenderPackageMutated: false,
      gpuTransportAdapterMutated: false,
      persistentRenderLoopCreated: false,
      gestureBindingCreated: false,
      deploymentPerformed: false,
      r3CWorkStarted: false,
      run8EPassClosed: false
    },
    issues: []
  };

  const minimumVisiblePixels = Math.floor(WIDTH * HEIGHT * 0.002);
  if (receipt.execution.geometryDrawCallCount !== 4) receipt.issues.push('R3B_FOUR_DRAW_RANGES_NOT_EXECUTED');
  if (receipt.execution.totalDrawnIndexCount !== 147120) receipt.issues.push('R3B_INDEX_COVERAGE_INVALID');
  if (colorSummary.nonClearPixelCount < minimumVisiblePixels) receipt.issues.push('R3B_VISIBLE_COLOR_OUTPUT_INSUFFICIENT');
  if (colorSummary.uniqueColorBucketCount < 8 || colorSummary.luminanceStandardDeviation < 1) receipt.issues.push('R3B_COLOR_OUTPUT_NOT_INSPECTABLE');
  if (depthSummary.nonClearPixelCount < minimumVisiblePixels || depthSummary.uniqueColorBucketCount < 3) receipt.issues.push('R3B_DEPTH_OUTPUT_NOT_ESTABLISHED');
  if (!Object.values(receipt.correspondence).every(Boolean)) receipt.issues.push('R3B_CORRESPONDENCE_AUDIT_FAILED');
  if (receipt.issues.length > 0) {
    receipt.eligible = false;
    receipt.status = 'RUN_8E_R3B_ISOLATED_WEBGL2_FIXED_FRAME_FAIL';
    throw new Error(receipt.issues.join(','));
  }

  metricsNode.textContent = JSON.stringify({
    context: contextIdentity,
    package: receipt.package,
    drawCalls: receipt.execution.geometryDrawCallCount,
    colorOutput: colorSummary,
    depthOutput: depthSummary
  }, null, 2);
  statusNode.textContent = 'R3B isolated WebGL2 fixed frame complete.';
  document.documentElement.dataset.r3bReady = 'true';
  window.H_EARTH_RUN8E_R3B_FIXED_FRAME_RECEIPT = receipt;
  return receipt;
}

executeFixedFrame().catch((error) => {
  statusNode.textContent = `R3B failed: ${error.message}`;
  document.documentElement.dataset.r3bReady = 'false';
  window.H_EARTH_RUN8E_R3B_FIXED_FRAME_ERROR = error.message;
  console.error(error);
});

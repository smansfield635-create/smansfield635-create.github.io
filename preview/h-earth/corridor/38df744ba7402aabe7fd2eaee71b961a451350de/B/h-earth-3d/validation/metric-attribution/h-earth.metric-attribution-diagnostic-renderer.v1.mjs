const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

export const exactBytes = (left, right) =>
  left.length === right.length && left.every((value, index) => value === right[index]);

export const hashBytes = (bytes) => {
  let value = 0x811c9dc5;
  for (const byte of bytes) {
    value ^= byte;
    value = Math.imul(value, 0x01000193) >>> 0;
  }
  return `fnv1a32:${value.toString(16).padStart(8, '0')}`;
};

const color3 = (value) => {
  const array = Array.isArray(value) ? value : [0, 0, 0];
  const scale = array.some((entry) => entry > 1) ? 255 : 1;
  return array.slice(0, 3).map((entry) => clamp(Number(entry) / scale, 0, 1));
};

export function extractAcceptedShaders(source) {
  const extract = (name) => {
    const match = source.match(new RegExp('const ' + name + ' = `([\\s\\S]*?)`;'));
    if (!match) throw new Error(`MA2_ACCEPTED_SHADER_NOT_FOUND:${name}`);
    return match[1];
  };
  return Object.freeze({
    VS: extract('VS'),
    FS: extract('FS'),
    DVS: extract('DVS'),
    DFS: extract('DFS')
  });
}

const DIAGNOSTIC_HEADER = `#version 300 es
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
`;

function buildFlatLightingMaterialShader(acceptedFragmentShader) {
  const startMarker = '  float ambient=0.26';
  const endMarker = '  outColor=vec4(lit,outputAlpha);';
  const start = acceptedFragmentShader.indexOf(startMarker);
  const end = acceptedFragmentShader.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw new Error('MA2_ACCEPTED_LIGHTING_TAIL_NOT_FOUND');
  const replacement = `  // MA2_FLAT_LIGHTING_REPLACEMENT_BEGIN\n  vec3 flatMaterial=base;\n  if(vRoleCode==1u){\n    flatMaterial*=mix(1.0,0.76,clamp(presentationContact,0.0,1.0));\n    flatMaterial+=base*clamp(presentationHighlight,0.0,1.0)*0.038;\n  }\n  flatMaterial=pow(clamp(flatMaterial,0.0,1.0),vec3(1.0/2.2));\n  outColor=vec4(flatMaterial,outputAlpha);\n  // MA2_FLAT_LIGHTING_REPLACEMENT_END`;
  return acceptedFragmentShader.slice(0, start) + replacement +
    acceptedFragmentShader.slice(end + endMarker.length);
}

export function createMetricAttributionPassShaders(acceptedFragmentShader) {
  const shaders = {
    A: `${DIAGNOSTIC_HEADER}
void main(){
  float elevation=clamp((vWorldPosition.y+16.0)/80.0,0.0,1.0);
  float value=vRoleCode==1u?elevation:0.0;
  outColor=vec4(vec3(value),1.0);
}`,
    B: `${DIAGNOSTIC_HEADER}
void main(){
  vec3 n=normalize(vNormal);
  float slope=1.0-clamp(n.y,0.0,1.0);
  float value=vRoleCode==1u?slope:0.0;
  outColor=vec4(vec3(value),1.0);
}`,
    C: `${DIAGNOSTIC_HEADER}
void main(){
  vec3 n=normalize(vNormal)*0.5+0.5;
  vec3 value=vRoleCode==1u?n:vec3(0.0);
  outColor=vec4(value,1.0);
}`,
    D: `${DIAGNOSTIC_HEADER}
void main(){
  float depthValue=clamp((1.0-gl_FragCoord.z)*28.0,0.0,1.0);
  outColor=vec4(vec3(depthValue),1.0);
}`,
    E: `${DIAGNOSTIC_HEADER}
void main(){
  vec3 n=normalize(vNormal);
  vec3 viewDirection=normalize(uCameraPosition-vWorldPosition);
  float silhouette=pow(1.0-abs(dot(n,viewDirection)),2.0);
  float normalEdge=clamp(length(fwidth(n))*5.5,0.0,1.0);
  float depthEdge=clamp(fwidth(gl_FragCoord.z)*900.0,0.0,1.0);
  float major=smoothstep(0.24,0.78,max(silhouette,max(normalEdge,depthEdge)));
  outColor=vec4(vec3(major),1.0);
}`,
    F: `${DIAGNOSTIC_HEADER}
void main(){
  vec3 n=normalize(vNormal);
  vec3 lightDirection=normalize(-uSunDirection);
  vec3 viewDirection=normalize(uCameraPosition-vWorldPosition);
  vec3 halfDirection=normalize(lightDirection+viewDirection);
  float diffuse=max(dot(n,lightDirection),0.0);
  float rim=pow(1.0-max(dot(n,viewDirection),0.0),2.2);
  float specular=pow(max(dot(n,halfDirection),0.0),24.0);
  float distanceToCamera=length(vWorldPosition-uCameraPosition);
  vec3 base=vec3(0.34);
  float ambient=0.26+0.16*clamp(n.y,0.0,1.0)+0.025;
  float directional=diffuse*uSunIntensity*(vRoleCode==1u?0.90:(vRoleCode==2u?0.74:0.82));
  vec3 lit=base*(ambient+directional)*uSunColor;
  lit+=base*rim*(vRoleCode==1u?0.18:0.10);
  lit+=uSunColor*specular*(vRoleCode==2u?0.36:0.07);
  float rawFog=clamp((distanceToCamera-uFogStartDistance)*max(uFogFalloff,0.00001),0.0,uMaximumFogFactor);
  float fog=rawFog*(vRoleCode==1u?0.54:0.68);
  float luminance=dot(lit,vec3(0.2126,0.7152,0.0722));
  lit=mix(lit,vec3(luminance),clamp(fog*uDistanceDesaturationStrength*0.48,0.0,0.58));
  vec3 atmosphere=mix(uSkyHorizonColor,uSkyZenithColor,clamp(n.y*0.5+0.5,0.0,1.0));
  vec3 haze=mix(uGroundHazeColor,atmosphere,0.44);
  lit=mix(lit,haze,fog*0.48);
  lit=pow(clamp(lit*1.12,0.0,1.0),vec3(1.0/2.2));
  outColor=vec4(lit,1.0);
}`,
    G: buildFlatLightingMaterialShader(acceptedFragmentShader),
    H: acceptedFragmentShader
  };
  return Object.freeze(shaders);
}

export function createMetricAttributionDiagnosticRenderer({
  canvas,
  width,
  height,
  vertexShader,
  fragmentShader,
  depthVertexShader,
  depthFragmentShader,
  uploadViews,
  renderPackage
}) {
  canvas.width = width;
  canvas.height = height;
  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    depth: true,
    stencil: false,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance'
  });
  if (!gl) throw new Error('MA2_WEBGL2_CONTEXT_UNAVAILABLE');

  const compile = (type, source, label) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error(`MA2_SHADER_CREATE_FAILED:${label}`);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(`MA2_SHADER_COMPILE_FAILED:${label}:${gl.getShaderInfoLog(shader)}`);
    }
    return shader;
  };
  const link = (vertex, fragment, label) => {
    const program = gl.createProgram();
    if (!program) throw new Error(`MA2_PROGRAM_CREATE_FAILED:${label}`);
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`MA2_PROGRAM_LINK_FAILED:${label}:${gl.getProgramInfoLog(program)}`);
    }
    return program;
  };

  const geometryProgram = link(
    compile(gl.VERTEX_SHADER, vertexShader, 'GV'),
    compile(gl.FRAGMENT_SHADER, fragmentShader, 'GF'),
    'GP'
  );
  const depthProgram = link(
    compile(gl.VERTEX_SHADER, depthVertexShader, 'DV'),
    compile(gl.FRAGMENT_SHADER, depthFragmentShader, 'DF'),
    'DP'
  );

  const vao = gl.createVertexArray();
  if (!vao) throw new Error('MA2_VERTEX_ARRAY_CREATE_FAILED');
  gl.bindVertexArray(vao);
  const specifications = [
    [uploadViews.positions, 0, 3, gl.FLOAT, false],
    [uploadViews.normals, 1, 3, gl.FLOAT, false],
    [uploadViews.baseColorsLinear, 2, 4, gl.FLOAT, false],
    [uploadViews.materialParameters, 3, 4, gl.FLOAT, false],
    [uploadViews.materialModelCodes, 4, 1, gl.UNSIGNED_BYTE, true],
    [uploadViews.surfaceClassCodes, 5, 1, gl.UNSIGNED_BYTE, true],
    [uploadViews.primitiveIndices, 6, 1, gl.UNSIGNED_SHORT, true],
    [uploadViews.roleCodes, 7, 1, gl.UNSIGNED_BYTE, true]
  ];
  for (const [data, location, size, type, integer] of specifications) {
    const buffer = gl.createBuffer();
    if (!buffer) throw new Error(`MA2_BUFFER_CREATE_FAILED:${location}`);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location);
    if (integer) gl.vertexAttribIPointer(location, size, type, 0, 0);
    else gl.vertexAttribPointer(location, size, type, false, 0, 0);
  }
  const indexBuffer = gl.createBuffer();
  if (!indexBuffer) throw new Error('MA2_INDEX_BUFFER_CREATE_FAILED');
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, uploadViews.indices, gl.STATIC_DRAW);

  const colorTexture = gl.createTexture();
  const depthTexture = gl.createTexture();
  const geometryFramebuffer = gl.createFramebuffer();
  if (!colorTexture || !depthTexture || !geometryFramebuffer) throw new Error('MA2_GEOMETRY_RESOURCE_CREATE_FAILED');
  gl.bindTexture(gl.TEXTURE_2D, colorTexture);
  gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, width, height);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.bindTexture(gl.TEXTURE_2D, depthTexture);
  gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT24, width, height);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.NONE);
  gl.bindFramebuffer(gl.FRAMEBUFFER, geometryFramebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTexture, 0);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0);
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    throw new Error('MA2_GEOMETRY_FRAMEBUFFER_INCOMPLETE');
  }

  const depthColorTexture = gl.createTexture();
  const depthFramebuffer = gl.createFramebuffer();
  if (!depthColorTexture || !depthFramebuffer) throw new Error('MA2_DEPTH_RESOURCE_CREATE_FAILED');
  gl.bindTexture(gl.TEXTURE_2D, depthColorTexture);
  gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, width, height);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, depthColorTexture, 0);
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    throw new Error('MA2_DEPTH_FRAMEBUFFER_INCOMPLETE');
  }

  const location = (program, name) => gl.getUniformLocation(program, name);
  const uniforms = {
    viewProjection: location(geometryProgram, 'uViewProjection'),
    cameraPosition: location(geometryProgram, 'uCameraPosition'),
    sunDirection: location(geometryProgram, 'uSunDirection'),
    sunIntensity: location(geometryProgram, 'uSunIntensity'),
    sunColor: location(geometryProgram, 'uSunColor'),
    skyZenithColor: location(geometryProgram, 'uSkyZenithColor'),
    skyHorizonColor: location(geometryProgram, 'uSkyHorizonColor'),
    groundHazeColor: location(geometryProgram, 'uGroundHazeColor'),
    fogStartDistance: location(geometryProgram, 'uFogStartDistance'),
    fogFalloff: location(geometryProgram, 'uFogFalloff'),
    maximumFogFactor: location(geometryProgram, 'uMaximumFogFactor'),
    distanceDesaturationStrength: location(geometryProgram, 'uDistanceDesaturationStrength'),
    depth: location(depthProgram, 'uDepth')
  };
  const set1f = (uniform, value) => { if (uniform !== null) gl.uniform1f(uniform, value); };
  const set3f = (uniform, x, y, z) => { if (uniform !== null) gl.uniform3f(uniform, x, y, z); };
  const set3fv = (uniform, value) => { if (uniform !== null) gl.uniform3fv(uniform, value); };

  let skyColor = [0, 0, 0];
  const initialize = (packet) => {
    const environment = packet.environmentUniforms;
    skyColor = color3(environment.skyHorizonColor).map((value, index) =>
      Math.min(1, value * (index === 2 ? 0.92 : 0.88)));
    gl.useProgram(geometryProgram);
    set3f(uniforms.sunDirection, environment.sunDirection.x, environment.sunDirection.y, environment.sunDirection.z);
    set1f(uniforms.sunIntensity, environment.sunIntensity);
    set3fv(uniforms.sunColor, color3(environment.sunColor));
    set3fv(uniforms.skyZenithColor, color3(environment.skyZenithColor));
    set3fv(uniforms.skyHorizonColor, skyColor);
    set3fv(uniforms.groundHazeColor, color3(environment.groundHazeColor));
    set1f(uniforms.fogStartDistance, environment.fogStartDistance);
    set1f(uniforms.fogFalloff, environment.fogFalloff);
    set1f(uniforms.maximumFogFactor, environment.maximumFogFactor);
    set1f(uniforms.distanceDesaturationStrength, environment.distanceDesaturationStrength);
  };

  const renderFrame = (packet) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, geometryFramebuffer);
    gl.viewport(0, 0, width, height);
    gl.clearColor(...skyColor, 1);
    gl.clearDepth(1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.disable(gl.CULL_FACE);
    gl.useProgram(geometryProgram);
    gl.bindVertexArray(vao);
    if (uniforms.viewProjection !== null) {
      gl.uniformMatrix4fv(uniforms.viewProjection, false, new Float32Array(packet.camera.viewProjectionMatrix));
    }
    set3f(uniforms.cameraPosition, packet.camera.position.x, packet.camera.position.y, packet.camera.position.z);
    for (const range of packet.drawRanges) {
      if (range.transparencyClass === 'TRANSLUCENT') {
        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthMask(false);
      } else {
        gl.disable(gl.BLEND);
        gl.depthMask(true);
      }
      gl.drawElements(gl.TRIANGLES, range.indexCount, gl.UNSIGNED_INT, range.indexStart * 4);
    }
    gl.depthMask(true);
    gl.disable(gl.BLEND);
    gl.finish();
    const error = gl.getError();
    if (error !== gl.NO_ERROR) throw new Error(`MA2_DRAW_ERROR:${error}`);
  };

  const readColor = () => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, geometryFramebuffer);
    const bytes = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
    return bytes;
  };

  const readDepth = () => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
    gl.viewport(0, 0, width, height);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.useProgram(depthProgram);
    gl.bindVertexArray(null);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    if (uniforms.depth !== null) gl.uniform1i(uniforms.depth, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.finish();
    const rgba = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, rgba);
    const values = new Float32Array(width * height);
    const mask = new Uint8Array(width * height);
    for (let index = 0; index < values.length; index += 1) {
      values[index] = rgba[index * 4] / 255;
      mask[index] = rgba[index * 4] > 0 ? 1 : 0;
    }
    return { values, mask };
  };

  const present = () => {
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, geometryFramebuffer);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
    gl.blitFramebuffer(0, 0, width, height, 0, 0, width, height, gl.COLOR_BUFFER_BIT, gl.NEAREST);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  };

  return Object.freeze({ initialize, renderFrame, readColor, readDepth, present });
}

export function readPresentedCanvas(canvas) {
  const gl = canvas.getContext('webgl2');
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.finish();
  const bytes = new Uint8Array(canvas.width * canvas.height * 4);
  gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
  return bytes;
}

export function readOfficialDepth(renderer, canvas) {
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

export function summarizeMaskedLuminance(bytes, mask) {
  let count = 0;
  let sum = 0;
  let squareSum = 0;
  for (let index = 0; index < mask.length; index += 1) {
    if (!mask[index]) continue;
    const offset = index * 4;
    const value = (0.2126 * bytes[offset] + 0.7152 * bytes[offset + 1] + 0.0722 * bytes[offset + 2]) / 255;
    count += 1;
    sum += value;
    squareSum += value * value;
  }
  const mean = sum / Math.max(1, count);
  return Object.freeze({
    eligiblePixelCount: count,
    mean,
    variance: Math.max(0, squareSum / Math.max(1, count) - mean * mean)
  });
}

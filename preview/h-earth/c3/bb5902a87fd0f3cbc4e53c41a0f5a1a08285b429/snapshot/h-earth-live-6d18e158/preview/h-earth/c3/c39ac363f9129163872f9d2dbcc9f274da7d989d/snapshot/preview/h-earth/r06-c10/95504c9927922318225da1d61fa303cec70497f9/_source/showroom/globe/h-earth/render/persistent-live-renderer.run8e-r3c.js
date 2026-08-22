/** H_EARTH_RUN_8E_R3C_PERSISTENT_WEBGL2_LIVE_RENDERER_v1 */
import { getHEarthRun8ER2CanonicalLiveRenderPackage } from './live-render-package.run8e-r2.canonical.js';
import { createHEarthRun8ER2DCanonicalGPUUploadViews } from './gpu-upload-views.run8e-r2d.js';
import { getHEarthRun8ER3ALiveRendererInterface } from './live-renderer-contract.run8e-r3a.js';

export const H_EARTH_RUN_8E_R3C_RENDERER_ID =
  'H_EARTH_RUN_8E_R3C_PERSISTENT_WEBGL2_LIVE_RENDERER_v1';

const LOGICAL_ID = 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_07F2FA1F';
const RUNTIME_ID = LOGICAL_ID;
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const color3 = (value) => {
  const array = Array.isArray(value) ? value : [0, 0, 0];
  const scale = array.some((entry) => entry > 1) ? 255 : 1;
  return array.slice(0, 3).map((entry) =>
    Math.min(1, Math.max(0, Number(entry) / scale)));
};
const hash = (bytes) => {
  let value = 0x811c9dc5;
  for (const byte of bytes) {
    value ^= byte;
    value = Math.imul(value, 0x01000193) >>> 0;
  }
  return `fnv1a32:${value.toString(16).padStart(8, '0')}`;
};
const summarize = (bytes, clear) => {
  let nonClearPixelCount = 0;
  let luminanceSum = 0;
  let luminanceSquareSum = 0;
  const buckets = new Set();
  const pixelCount = bytes.length / 4;
  for (let offset = 0; offset < bytes.length; offset += 4) {
    const red = bytes[offset];
    const green = bytes[offset + 1];
    const blue = bytes[offset + 2];
    if (
      Math.abs(red - clear[0]) +
      Math.abs(green - clear[1]) +
      Math.abs(blue - clear[2]) > 9
    ) {
      nonClearPixelCount += 1;
    }
    const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    luminanceSum += luminance;
    luminanceSquareSum += luminance * luminance;
    buckets.add(`${red >> 4}:${green >> 4}:${blue >> 4}`);
  }
  const meanLuminance = luminanceSum / pixelCount;
  return {
    pixelCount,
    nonClearPixelCount,
    uniqueColorBucketCount: buckets.size,
    meanLuminance,
    luminanceStandardDeviation: Math.sqrt(Math.max(
      0,
      luminanceSquareSum / pixelCount - meanLuminance * meanLuminance
    )),
    byteHash: hash(bytes)
  };
};

const VS = `#version 300 es
precision highp float;precision highp int;
layout(location=0)in vec3 aPosition;layout(location=1)in vec3 aNormal;layout(location=2)in vec4 aBaseColorLinear;layout(location=3)in vec4 aMaterialParameters;layout(location=4)in uint aMaterialModelCode;layout(location=5)in uint aSurfaceClassCode;layout(location=6)in uint aPrimitiveIndex;layout(location=7)in uint aRoleCode;
uniform mat4 uViewProjection;out vec3 vWorldPosition;out vec3 vNormal;out vec4 vBaseColor;out vec4 vMaterialParameters;flat out uint vMaterialModelCode;flat out uint vSurfaceClassCode;flat out uint vPrimitiveIndex;flat out uint vRoleCode;
void main(){vWorldPosition=aPosition;vNormal=aNormal;vBaseColor=aBaseColorLinear;vMaterialParameters=aMaterialParameters;vMaterialModelCode=aMaterialModelCode;vSurfaceClassCode=aSurfaceClassCode;vPrimitiveIndex=aPrimitiveIndex;vRoleCode=aRoleCode;gl_Position=uViewProjection*vec4(aPosition,1.0);}`;
const FS = `#version 300 es
precision highp float;precision highp int;
in vec3 vWorldPosition;in vec3 vNormal;in vec4 vBaseColor;in vec4 vMaterialParameters;flat in uint vMaterialModelCode;flat in uint vSurfaceClassCode;flat in uint vPrimitiveIndex;flat in uint vRoleCode;
uniform vec3 uCameraPosition;uniform vec3 uSunDirection;uniform float uSunIntensity;uniform vec3 uSunColor;uniform vec3 uSkyZenithColor;uniform vec3 uSkyHorizonColor;uniform vec3 uGroundHazeColor;uniform float uFogStartDistance;uniform float uFogFalloff;uniform float uMaximumFogFactor;uniform float uDistanceDesaturationStrength;out vec4 outColor;
void main(){vec3 n=normalize(vNormal),ld=normalize(-uSunDirection);float d=max(dot(n,ld),0.0),a=.30+.08*max(n.y,0.0),rb=vRoleCode==1u?1.05:(vRoleCode==2u?1.15:.92);vec3 lit=max(vBaseColor.rgb,vec3(.004))*(a+d*uSunIntensity*.72)*uSunColor*rb;float dist=length(vWorldPosition-uCameraPosition),fog=clamp((dist-uFogStartDistance)*max(uFogFalloff,.00001),0.0,uMaximumFogFactor),lum=dot(lit,vec3(.2126,.7152,.0722));lit=mix(lit,vec3(lum),clamp(fog*uDistanceDesaturationStrength,0.0,1.0));vec3 atm=mix(uSkyHorizonColor,uSkyZenithColor,clamp(n.y*.5+.5,0.0,1.0));lit=mix(lit,atm,fog*.22);lit=mix(lit,uGroundHazeColor,fog*.78);outColor=vec4(pow(clamp(lit,0.0,1.0),vec3(1.0/2.2)),clamp(vBaseColor.a,.18,1.0));}`;
const DVS = `#version 300 es
precision highp float;const vec2 p[3]=vec2[3](vec2(-1.,-1.),vec2(3.,-1.),vec2(-1.,3.));out vec2 vUv;void main(){vec2 q=p[gl_VertexID];vUv=q*.5+.5;gl_Position=vec4(q,0.,1.);}`;
const DFS = `#version 300 es
precision highp float;in vec2 vUv;uniform sampler2D uDepth;out vec4 outColor;void main(){float d=texture(uDepth,vUv).r,v=clamp((1.-d)*28.,0.,1.);outColor=vec4(vec3(v),1.);}`;

export function createHEarthRun8ER3CPersistentRenderer({
  canvas,
  width = 640,
  height = 360
} = {}) {
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new TypeError('R3C_CANVAS_REQUIRED');
  }
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
  if (!gl) throw new Error('R3C_WEBGL2_CONTEXT_UNAVAILABLE');

  let initialized = false;
  const counters = {
    contextCreationCount: 1,
    shaderCreateCount: 0,
    shaderCompileCount: 0,
    programCreateCount: 0,
    programLinkCount: 0,
    vertexArrayCreateCount: 0,
    bufferCreateCount: 0,
    bufferUploadCount: 0,
    uploadedByteLength: 0,
    textureCreateCount: 0,
    framebufferCreateCount: 0,
    postInitializationResourceCreationCount: 0,
    postInitializationBufferUploadCount: 0,
    frameCount: 0,
    visiblePresentationCount: 0,
    colorReadbackCount: 0,
    depthReadbackCount: 0,
    pngEncodingCount: 0,
    gpuFinishCount: 0,
    cameraUniformUpdateCount: 0,
    staticUniformUpdateCount: 0,
    geometryDrawCallCount: 0,
    totalDrawnIndexCount: 0,
    depthVisualizationDrawCallCount: 0
  };
  const resources = {};

  const markPostInitializationCreation = () => {
    if (initialized) counters.postInitializationResourceCreationCount += 1;
  };
  const createShader = (type, source, label) => {
    markPostInitializationCreation();
    counters.shaderCreateCount += 1;
    const shader = gl.createShader(type);
    if (!shader) throw new Error(`R3C_SHADER_CREATE_FAILED:${label}`);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    counters.shaderCompileCount += 1;
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(`R3C_SHADER_COMPILE_FAILED:${label}:${gl.getShaderInfoLog(shader)}`);
    }
    return shader;
  };
  const createProgram = (vertexShader, fragmentShader, label) => {
    markPostInitializationCreation();
    counters.programCreateCount += 1;
    const program = gl.createProgram();
    if (!program) throw new Error(`R3C_PROGRAM_CREATE_FAILED:${label}`);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    counters.programLinkCount += 1;
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`R3C_PROGRAM_LINK_FAILED:${label}:${gl.getProgramInfoLog(program)}`);
    }
    return program;
  };
  const createBuffer = () => {
    markPostInitializationCreation();
    counters.bufferCreateCount += 1;
    const buffer = gl.createBuffer();
    if (!buffer) throw new Error('R3C_BUFFER_CREATE_FAILED');
    return buffer;
  };
  const upload = (target, data) => {
    if (initialized) counters.postInitializationBufferUploadCount += 1;
    counters.bufferUploadCount += 1;
    counters.uploadedByteLength += data.byteLength;
    gl.bufferData(target, data, gl.STATIC_DRAW);
  };
  const createTexture = () => {
    markPostInitializationCreation();
    counters.textureCreateCount += 1;
    const texture = gl.createTexture();
    if (!texture) throw new Error('R3C_TEXTURE_CREATE_FAILED');
    return texture;
  };
  const createFramebuffer = () => {
    markPostInitializationCreation();
    counters.framebufferCreateCount += 1;
    const framebuffer = gl.createFramebuffer();
    if (!framebuffer) throw new Error('R3C_FRAMEBUFFER_CREATE_FAILED');
    return framebuffer;
  };
  const uniform = (program, name) => {
    const location = gl.getUniformLocation(program, name);
    if (location === null) throw new Error(`R3C_UNIFORM_MISSING:${name}`);
    return location;
  };
  const requireCompleteFramebuffer = (label) => {
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error(`R3C_FRAMEBUFFER_INCOMPLETE:${label}:${status}`);
    }
  };

  const renderPackage = getHEarthRun8ER2CanonicalLiveRenderPackage();
  const uploadViews = createHEarthRun8ER2DCanonicalGPUUploadViews(renderPackage);
  const rendererInterface = getHEarthRun8ER3ALiveRendererInterface();
  if (renderPackage.packageIdentity !== RUNTIME_ID) {
    throw new Error(`R3C_RUNTIME_PACKAGE_IDENTITY_MISMATCH:${renderPackage.packageIdentity}`);
  }
  if (uploadViews.deterministicTransportEncoding !== true) {
    throw new Error('R3C_CANONICAL_GPU_TRANSPORT_MISSING');
  }

  function initialize(packet) {
    if (initialized) throw new Error('R3C_RENDERER_ALREADY_INITIALIZED');
    if (
      packet.packageIdentity !== renderPackage.packageIdentity ||
      packet.packageContentDigest !== renderPackage.contentDigest
    ) {
      throw new Error('R3C_INITIAL_PACKET_PACKAGE_MISMATCH');
    }

    resources.geometryVertexShader = createShader(gl.VERTEX_SHADER, VS, 'GV');
    resources.geometryFragmentShader = createShader(gl.FRAGMENT_SHADER, FS, 'GF');
    resources.geometryProgram = createProgram(
      resources.geometryVertexShader,
      resources.geometryFragmentShader,
      'GP'
    );
    resources.depthVertexShader = createShader(gl.VERTEX_SHADER, DVS, 'DV');
    resources.depthFragmentShader = createShader(gl.FRAGMENT_SHADER, DFS, 'DF');
    resources.depthProgram = createProgram(
      resources.depthVertexShader,
      resources.depthFragmentShader,
      'DP'
    );

    markPostInitializationCreation();
    counters.vertexArrayCreateCount += 1;
    resources.vertexArray = gl.createVertexArray();
    gl.bindVertexArray(resources.vertexArray);

    const specifications = [
      ['positions', uploadViews.positions, 0, 3, gl.FLOAT, false],
      ['normals', uploadViews.normals, 1, 3, gl.FLOAT, false],
      ['baseColorsLinear', uploadViews.baseColorsLinear, 2, 4, gl.FLOAT, false],
      ['materialParameters', uploadViews.materialParameters, 3, 4, gl.FLOAT, false],
      ['materialModelCodes', uploadViews.materialModelCodes, 4, 1, gl.UNSIGNED_BYTE, true],
      ['surfaceClassCodes', uploadViews.surfaceClassCodes, 5, 1, gl.UNSIGNED_BYTE, true],
      ['primitiveIndices', uploadViews.primitiveIndices, 6, 1, gl.UNSIGNED_SHORT, true],
      ['roleCodes', uploadViews.roleCodes, 7, 1, gl.UNSIGNED_BYTE, true]
    ];
    resources.buffers = [];
    for (const [name, data, location, size, type, integer] of specifications) {
      const buffer = createBuffer();
      resources.buffers.push({ name, buffer, byteLength: data.byteLength });
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      upload(gl.ARRAY_BUFFER, data);
      gl.enableVertexAttribArray(location);
      if (integer) gl.vertexAttribIPointer(location, size, type, 0, 0);
      else gl.vertexAttribPointer(location, size, type, false, 0, 0);
    }
    resources.indexBuffer = createBuffer();
    resources.buffers.push({
      name: 'indices',
      buffer: resources.indexBuffer,
      byteLength: uploadViews.indices.byteLength
    });
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, resources.indexBuffer);
    upload(gl.ELEMENT_ARRAY_BUFFER, uploadViews.indices);

    resources.colorTexture = createTexture();
    resources.depthTexture = createTexture();
    resources.geometryFramebuffer = createFramebuffer();
    gl.bindTexture(gl.TEXTURE_2D, resources.colorTexture);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, width, height);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, resources.depthTexture);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT24, width, height);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.NONE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, resources.geometryFramebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      resources.colorTexture,
      0
    );
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.TEXTURE_2D,
      resources.depthTexture,
      0
    );
    requireCompleteFramebuffer('GEOMETRY');

    resources.depthColorTexture = createTexture();
    resources.depthFramebuffer = createFramebuffer();
    gl.bindTexture(gl.TEXTURE_2D, resources.depthColorTexture);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, width, height);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.bindFramebuffer(gl.FRAMEBUFFER, resources.depthFramebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      resources.depthColorTexture,
      0
    );
    requireCompleteFramebuffer('DEPTH');

    resources.uniforms = {
      viewProjection: uniform(resources.geometryProgram, 'uViewProjection'),
      cameraPosition: uniform(resources.geometryProgram, 'uCameraPosition'),
      sunDirection: uniform(resources.geometryProgram, 'uSunDirection'),
      sunIntensity: uniform(resources.geometryProgram, 'uSunIntensity'),
      sunColor: uniform(resources.geometryProgram, 'uSunColor'),
      skyZenithColor: uniform(resources.geometryProgram, 'uSkyZenithColor'),
      skyHorizonColor: uniform(resources.geometryProgram, 'uSkyHorizonColor'),
      groundHazeColor: uniform(resources.geometryProgram, 'uGroundHazeColor'),
      fogStartDistance: uniform(resources.geometryProgram, 'uFogStartDistance'),
      fogFalloff: uniform(resources.geometryProgram, 'uFogFalloff'),
      maximumFogFactor: uniform(resources.geometryProgram, 'uMaximumFogFactor'),
      distanceDesaturationStrength: uniform(
        resources.geometryProgram,
        'uDistanceDesaturationStrength'
      ),
      depth: uniform(resources.depthProgram, 'uDepth')
    };

    const environment = packet.environmentUniforms;
    resources.skyColor = color3(environment.skyHorizonColor);
    resources.clearColorBytes = resources.skyColor.map((entry) => Math.round(entry * 255));
    gl.useProgram(resources.geometryProgram);
    gl.uniform3f(
      resources.uniforms.sunDirection,
      environment.sunDirection.x,
      environment.sunDirection.y,
      environment.sunDirection.z
    );
    gl.uniform1f(resources.uniforms.sunIntensity, environment.sunIntensity);
    gl.uniform3fv(resources.uniforms.sunColor, color3(environment.sunColor));
    gl.uniform3fv(resources.uniforms.skyZenithColor, color3(environment.skyZenithColor));
    gl.uniform3fv(resources.uniforms.skyHorizonColor, resources.skyColor);
    gl.uniform3fv(resources.uniforms.groundHazeColor, color3(environment.groundHazeColor));
    gl.uniform1f(resources.uniforms.fogStartDistance, environment.fogStartDistance);
    gl.uniform1f(resources.uniforms.fogFalloff, environment.fogFalloff);
    gl.uniform1f(resources.uniforms.maximumFogFactor, environment.maximumFogFactor);
    gl.uniform1f(
      resources.uniforms.distanceDesaturationStrength,
      environment.distanceDesaturationStrength
    );
    counters.staticUniformUpdateCount = 10;
    initialized = true;
    return getResourceReceipt();
  }

  function renderFrame(packet) {
    if (!initialized) throw new Error('R3C_RENDERER_NOT_INITIALIZED');
    if (
      packet.packageIdentity !== renderPackage.packageIdentity ||
      packet.packageContentDigest !== renderPackage.contentDigest
    ) {
      throw new Error('R3C_FRAME_PACKET_PACKAGE_MISMATCH');
    }
    if (
      !Array.isArray(packet.camera.viewProjectionMatrix) ||
      packet.camera.viewProjectionMatrix.length !== 16 ||
      packet.camera.viewProjectionMatrix.some((value) => !finite(value))
    ) {
      throw new Error('R3C_VIEW_PROJECTION_INVALID');
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, resources.geometryFramebuffer);
    gl.viewport(0, 0, width, height);
    gl.clearColor(...resources.skyColor, 1);
    gl.clearDepth(1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.disable(gl.CULL_FACE);
    gl.useProgram(resources.geometryProgram);
    gl.bindVertexArray(resources.vertexArray);
    gl.uniformMatrix4fv(
      resources.uniforms.viewProjection,
      false,
      new Float32Array(packet.camera.viewProjectionMatrix)
    );
    gl.uniform3f(
      resources.uniforms.cameraPosition,
      packet.camera.position.x,
      packet.camera.position.y,
      packet.camera.position.z
    );
    counters.cameraUniformUpdateCount += 2;

    for (const range of packet.drawRanges) {
      if (range.transparencyClass === 'TRANSLUCENT') {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthMask(false);
      } else {
        gl.disable(gl.BLEND);
        gl.depthMask(true);
      }
      gl.drawElements(
        gl.TRIANGLES,
        range.indexCount,
        gl.UNSIGNED_INT,
        range.indexStart * 4
      );
      counters.geometryDrawCallCount += 1;
      counters.totalDrawnIndexCount += range.indexCount;
    }

    gl.depthMask(true);
    gl.disable(gl.BLEND);
    const error = gl.getError();
    if (error !== gl.NO_ERROR) throw new Error(`R3C_DRAW_ERROR:${error}`);
    counters.frameCount += 1;
  }

  function presentColorFrame() {
    if (!initialized) throw new Error('R3C_RENDERER_NOT_INITIALIZED');
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, resources.geometryFramebuffer);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
    gl.blitFramebuffer(
      0,
      0,
      width,
      height,
      0,
      0,
      width,
      height,
      gl.COLOR_BUFFER_BIT,
      gl.NEAREST
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    counters.visiblePresentationCount += 1;
    return Object.freeze({
      frameNumber: counters.frameCount,
      width,
      height
    });
  }

  function captureColorFrame(label, { includePng = true } = {}) {
    if (!initialized) throw new Error('R3C_RENDERER_NOT_INITIALIZED');
    gl.bindFramebuffer(gl.FRAMEBUFFER, resources.geometryFramebuffer);
    gl.finish();
    counters.gpuFinishCount += 1;
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    counters.colorReadbackCount += 1;
    const summary = summarize(pixels, resources.clearColorBytes);
    const pngDataUrl = includePng ? canvas.toDataURL('image/png') : null;
    if (includePng) counters.pngEncodingCount += 1;
    return Object.freeze({
      label,
      frameNumber: counters.frameCount,
      width,
      height,
      summary,
      pngDataUrl
    });
  }

  function captureDepthSummary() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, resources.depthFramebuffer);
    gl.viewport(0, 0, width, height);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.useProgram(resources.depthProgram);
    gl.bindVertexArray(null);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, resources.depthTexture);
    gl.uniform1i(resources.uniforms.depth, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    counters.depthVisualizationDrawCallCount += 1;
    gl.finish();
    counters.gpuFinishCount += 1;
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    counters.depthReadbackCount += 1;
    return summarize(pixels, [0, 0, 0]);
  }

  function getResourceReceipt() {
    const debugRenderer = gl.getExtension('WEBGL_debug_renderer_info');
    return {
      rendererId: H_EARTH_RUN_8E_R3C_RENDERER_ID,
      initialized,
      dimensions: { width, height },
      context: {
        created: true,
        lost: gl.isContextLost(),
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
        unmaskedVendor: debugRenderer
          ? gl.getParameter(debugRenderer.UNMASKED_VENDOR_WEBGL)
          : null,
        unmaskedRenderer: debugRenderer
          ? gl.getParameter(debugRenderer.UNMASKED_RENDERER_WEBGL)
          : null,
        version: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
      },
      package: {
        logicalPromotedIdentity: LOGICAL_ID,
        runtimeIdentity: renderPackage.packageIdentity,
        runtimeContentDigest: renderPackage.contentDigest,
        primitiveCount: renderPackage.primitiveCount,
        vertexCount: renderPackage.vertexCount,
        triangleCount: renderPackage.triangleCount,
        indexCount: renderPackage.indexCount,
        drawRangeCount: renderPackage.drawRanges.length,
        canonicalGpuTransport: uploadViews.deterministicTransportEncoding === true
      },
      rendererInterface: {
        contractId: rendererInterface.contractId,
        attributeCount: rendererInterface.attributeLayout.length,
        uniformCount: rendererInterface.frameUniformNames.length,
        drawRangeCount: rendererInterface.drawRanges.length
      },
      counters: { ...counters },
      persistentObjectCounts: {
        contexts: 1,
        programs: 2,
        shaders: 4,
        vertexArrays: 1,
        gpuBuffers: resources.buffers?.length ?? 0,
        textures: 3,
        framebuffers: 2
      },
      resourceIdentityStable:
        initialized &&
        resources.buffers?.length === 9 &&
        Boolean(
          resources.geometryProgram &&
          resources.depthProgram &&
          resources.vertexArray &&
          resources.geometryFramebuffer &&
          resources.depthFramebuffer
        ),
      packageUploadedOnce:
        counters.bufferUploadCount === 9 &&
        counters.postInitializationBufferUploadCount === 0,
      noPostInitializationResourceCreation:
        counters.postInitializationResourceCreationCount === 0,
      noPostInitializationBufferUpload:
        counters.postInitializationBufferUploadCount === 0
    };
  }

  return Object.freeze({
    rendererId: H_EARTH_RUN_8E_R3C_RENDERER_ID,
    initialize,
    renderFrame,
    presentColorFrame,
    captureColorFrame,
    captureDepthSummary,
    getResourceReceipt
  });
}

export default createHEarthRun8ER3CPersistentRenderer;

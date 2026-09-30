/** H_EARTH_C2_R1_COMPLETE_WORLD_PERSISTENT_WEBGL2_RENDERER_v1 */

const clone = value => JSON.parse(JSON.stringify(value));

const VERTEX_SHADER = `#version 300 es
precision highp float;precision highp int;
layout(location=0)in vec3 aPosition;
layout(location=1)in vec3 aNormal;
layout(location=2)in vec4 aBaseColorLinear;
layout(location=3)in vec4 aMaterialParameters;
layout(location=4)in uint aMaterialModelCode;
layout(location=5)in uint aSurfaceClassCode;
layout(location=6)in uint aPrimitiveIndex;
layout(location=7)in uint aRoleCode;
uniform mat4 uViewProjection;
out vec3 vWorldPosition;out vec3 vNormal;out vec4 vBaseColor;out vec4 vMaterialParameters;flat out uint vRoleCode;
void main(){vWorldPosition=aPosition;vNormal=aNormal;vBaseColor=aBaseColorLinear;vMaterialParameters=aMaterialParameters;vRoleCode=aRoleCode;gl_Position=uViewProjection*vec4(aPosition,1.0);}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;precision highp int;
in vec3 vWorldPosition;in vec3 vNormal;in vec4 vBaseColor;in vec4 vMaterialParameters;flat in uint vRoleCode;
uniform vec3 uCameraPosition;uniform vec3 uSunDirection;uniform float uSunIntensity;uniform vec3 uSunColor;uniform vec3 uSkyZenithColor;uniform vec3 uSkyHorizonColor;uniform vec3 uGroundHazeColor;uniform float uFogStartDistance;uniform float uFogFalloff;uniform float uMaximumFogFactor;uniform float uDistanceDesaturationStrength;out vec4 outColor;
void main(){vec3 n=normalize(vNormal),ld=normalize(-uSunDirection);float diffuse=max(dot(n,ld),0.0);float ambient=.30+.08*max(n.y,0.0);vec3 color=max(vBaseColor.rgb,vec3(.004))*(ambient+diffuse*uSunIntensity*.72)*uSunColor;float distanceToCamera=length(vWorldPosition-uCameraPosition);float fog=clamp((distanceToCamera-uFogStartDistance)*max(uFogFalloff,.00001),0.0,uMaximumFogFactor);float luminance=dot(color,vec3(.2126,.7152,.0722));color=mix(color,vec3(luminance),clamp(fog*uDistanceDesaturationStrength,0.0,1.0));vec3 atmosphere=mix(uSkyHorizonColor,uSkyZenithColor,clamp(n.y*.5+.5,0.0,1.0));color=mix(color,atmosphere,fog*.22);color=mix(color,uGroundHazeColor,fog*.78);if(vRoleCode==2u){color=mix(color,color+vec3(.03,.06,.075),clamp(vMaterialParameters.w,0.0,1.0)*.35);}outColor=vec4(pow(clamp(color,0.0,1.0),vec3(1.0/2.2)),clamp(vBaseColor.a,.18,1.0));}`;

function compile(gl, type, source, label) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error(`COMPLETE_WORLD_SHADER_CREATE_FAILED:${label}`);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(`COMPLETE_WORLD_SHADER_COMPILE_FAILED:${label}:${gl.getShaderInfoLog(shader)}`);
  }
  return shader;
}

function link(gl) {
  const program = gl.createProgram();
  if (!program) throw new Error('COMPLETE_WORLD_PROGRAM_CREATE_FAILED');
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER, 'VERTEX'));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER, 'FRAGMENT'));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`COMPLETE_WORLD_PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(program)}`);
  }
  return program;
}

export function createHEarthC2R1CompleteWorldPersistentRenderer({ canvas, packageRecord, viewport }) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new TypeError('COMPLETE_WORLD_CANVAS_REQUIRED');
  if (packageRecord?.eligible !== true) throw new TypeError('COMPLETE_WORLD_PACKAGE_REQUIRED');
  const width = Math.max(320, Math.round(Number(viewport?.width ?? canvas.clientWidth ?? 1280)));
  const height = Math.max(180, Math.round(Number(viewport?.height ?? canvas.clientHeight ?? 720)));
  canvas.width = width;
  canvas.height = height;
  const gl = canvas.getContext('webgl2', {
    alpha: false, antialias: true, depth: true, stencil: false,
    preserveDrawingBuffer: true, powerPreference: 'high-performance'
  });
  if (!gl) throw new Error('COMPLETE_WORLD_WEBGL2_CONTEXT_UNAVAILABLE');

  const uploadModulePromise = import('/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js');
  const counters = {
    contextCreationCount: 1,
    rendererInitializationCount: 0,
    bufferCreateCount: 0,
    bufferUploadCount: 0,
    uploadedByteLength: 0,
    postInitializationResourceCreationCount: 0,
    postInitializationBufferUploadCount: 0,
    frameCount: 0,
    visiblePresentationCount: 0,
    worldRebuildCount: 0,
    cssTransformPreviewCount: 0,
    bitmapPreviewApplicationCount: 0
  };
  let initialized = false;
  let program = null;
  let vao = null;
  let indexCount = 0;
  let latestFrame = null;

  const createBuffer = () => {
    if (initialized) counters.postInitializationResourceCreationCount += 1;
    counters.bufferCreateCount += 1;
    const buffer = gl.createBuffer();
    if (!buffer) throw new Error('COMPLETE_WORLD_BUFFER_CREATE_FAILED');
    return buffer;
  };
  const upload = (target, data) => {
    if (initialized) counters.postInitializationBufferUploadCount += 1;
    counters.bufferUploadCount += 1;
    counters.uploadedByteLength += data.byteLength;
    gl.bufferData(target, data, gl.STATIC_DRAW);
  };

  async function initialize() {
    if (initialized) throw new Error('COMPLETE_WORLD_RENDERER_ALREADY_INITIALIZED');
    const { createHEarthRun8ER2DCanonicalGPUUploadViews } = await uploadModulePromise;
    const uploadViews = createHEarthRun8ER2DCanonicalGPUUploadViews(packageRecord);
    program = link(gl);
    vao = gl.createVertexArray();
    if (!vao) throw new Error('COMPLETE_WORLD_VERTEX_ARRAY_CREATE_FAILED');
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
      const buffer = createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      upload(gl.ARRAY_BUFFER, data);
      gl.enableVertexAttribArray(location);
      if (integer) gl.vertexAttribIPointer(location, size, type, 0, 0);
      else gl.vertexAttribPointer(location, size, type, false, 0, 0);
    }
    const indexBuffer = createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    upload(gl.ELEMENT_ARRAY_BUFFER, uploadViews.indices);
    indexCount = uploadViews.indices.length;
    gl.bindVertexArray(null);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    initialized = true;
    counters.rendererInitializationCount += 1;
    return getReceipt();
  }

  const uniform = name => {
    const location = gl.getUniformLocation(program, name);
    if (location === null) throw new Error(`COMPLETE_WORLD_UNIFORM_MISSING:${name}`);
    return location;
  };

  function renderFrame(packet) {
    if (!initialized) throw new Error('COMPLETE_WORLD_RENDERER_NOT_INITIALIZED');
    const env = packet.environmentUniforms;
    gl.viewport(0, 0, width, height);
    gl.clearColor(env.skyHorizonColor[0], env.skyHorizonColor[1], env.skyHorizonColor[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniformMatrix4fv(uniform('uViewProjection'), false, packet.camera.viewProjectionMatrix);
    gl.uniform3f(uniform('uCameraPosition'), packet.camera.position.x, packet.camera.position.y, packet.camera.position.z);
    gl.uniform3f(uniform('uSunDirection'), env.sunDirection.x, env.sunDirection.y, env.sunDirection.z);
    gl.uniform1f(uniform('uSunIntensity'), env.sunIntensity);
    gl.uniform3fv(uniform('uSunColor'), env.sunColor);
    gl.uniform3fv(uniform('uSkyZenithColor'), env.skyZenithColor);
    gl.uniform3fv(uniform('uSkyHorizonColor'), env.skyHorizonColor);
    gl.uniform3fv(uniform('uGroundHazeColor'), env.groundHazeColor);
    gl.uniform1f(uniform('uFogStartDistance'), env.fogStartDistance);
    gl.uniform1f(uniform('uFogFalloff'), env.fogFalloff);
    gl.uniform1f(uniform('uMaximumFogFactor'), env.maximumFogFactor);
    gl.uniform1f(uniform('uDistanceDesaturationStrength'), env.distanceDesaturationStrength);
    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_INT, 0);
    gl.bindVertexArray(null);
    counters.frameCount += 1;
    counters.visiblePresentationCount += 1;
    latestFrame = {
      frameSequence: counters.frameCount,
      navigationSequence: packet.navigationSequence,
      cameraPosition: clone(packet.camera.position),
      packageIdentity: packageRecord.packageIdentity,
      presentedAt: performance.now()
    };
    return clone(latestFrame);
  }

  function getReceipt() {
    return clone({
      receiptType: 'H_EARTH_C2_R1_COMPLETE_WORLD_PERSISTENT_RENDERER_RECEIPT',
      eligible: initialized,
      status: initialized ? 'COMPLETE_WORLD_RENDERER_ACTIVE' : 'COMPLETE_WORLD_RENDERER_PENDING',
      packageIdentity: packageRecord.packageIdentity,
      packageContentDigest: packageRecord.contentDigest,
      viewport: { width, height, pixelRatio: 1 },
      counters,
      latestFrame,
      correspondence: {
        packageUploadedOnce: counters.rendererInitializationCount === 1 && counters.bufferUploadCount > 0,
        noPostInitializationResourceCreation: counters.postInitializationResourceCreationCount === 0,
        noPostInitializationBufferUpload: counters.postInitializationBufferUploadCount === 0,
        worldRebuildPerCameraMove: false,
        persistentRenderer: true,
        oneWebGL2Context: counters.contextCreationCount === 1
      },
      boundaries: {
        publicRendererSourceMutated: false,
        publicRouteBound: false,
        publicRouteMutated: false,
        mainMutated: false,
        bitmapPreviewApplied: false,
        cssTransformPreviewApplied: false
      }
    });
  }

  return Object.freeze({ initialize, renderFrame, getReceipt });
}

export default createHEarthC2R1CompleteWorldPersistentRenderer;

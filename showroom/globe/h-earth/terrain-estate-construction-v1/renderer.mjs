import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_ENVIRONMENT,
  sampleHEarthMapWideEnvironmentPresentation
} from '../../../../h-earth-3d/environment/h-earth.gratitude-region-mirror-manor-estate.v1.js';

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const mix = (left, right, amount) => left * (1 - amount) + right * amount;
const normalize = (vector) => {
  const length = Math.hypot(vector[0], vector[1], vector[2]) || 1;
  return [vector[0] / length, vector[1] / length, vector[2] / length];
};
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0]
];
const subtract = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];

export const PREVIEW_DOMAIN = Object.freeze({
  xMinimum: -256,
  xMaximum: 256,
  zMinimum: -320,
  zMaximum: 64,
  columns: 65,
  rows: 49
});

function perspective(fov, aspect, near, far) {
  const f = 1 / Math.tan(fov / 2);
  const nf = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0
  ]);
}

function lookAt(eye, target, up) {
  const z = normalize(subtract(eye, target));
  const x = normalize(cross(up, z));
  const y = cross(z, x);
  return new Float32Array([
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -x[0] * eye[0] - x[1] * eye[1] - x[2] * eye[2],
    -y[0] * eye[0] - y[1] * eye[1] - y[2] * eye[2],
    -z[0] * eye[0] - z[1] * eye[1] - z[2] * eye[2], 1
  ]);
}

function multiply(a, b) {
  const out = new Float32Array(16);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      out[column * 4 + row] =
        a[row] * b[column * 4] +
        a[4 + row] * b[column * 4 + 1] +
        a[8 + row] * b[column * 4 + 2] +
        a[12 + row] * b[column * 4 + 3];
    }
  }
  return out;
}

const TERRAIN_VS = `#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec3 aColor;
layout(location=3) in float aRelief;
uniform mat4 uViewProjection;
uniform float uVerticalScale;
uniform float uShowRelief;
out vec3 vWorldPosition;
out vec3 vNormal;
out vec3 vColor;
void main(){
  float y=aPosition.y+aRelief*uShowRelief;
  vec3 displayPosition=vec3(aPosition.x,y*uVerticalScale,aPosition.z);
  vWorldPosition=vec3(aPosition.x,y,aPosition.z);
  vNormal=normalize(vec3(aNormal.x,aNormal.y/max(uVerticalScale,0.0001),aNormal.z));
  vColor=aColor;
  gl_Position=uViewProjection*vec4(displayPosition,1.0);
}`;

const TERRAIN_FS = `#version 300 es
precision highp float;
in vec3 vWorldPosition;
in vec3 vNormal;
in vec3 vColor;
uniform vec3 uCameraPosition;
uniform vec3 uSunDirection;
uniform vec3 uGroundHaze;
out vec4 outColor;
vec3 perturbTerrainNormal(vec3 geometricNormal,vec3 worldPosition,float reliefHeight){
  vec3 positionDx=dFdx(worldPosition);
  vec3 positionDy=dFdy(worldPosition);
  float reliefDx=dFdx(reliefHeight);
  float reliefDy=dFdy(reliefHeight);
  vec3 surfaceGradient=reliefDx*cross(positionDy,geometricNormal)+reliefDy*cross(geometricNormal,positionDx);
  float determinant=dot(positionDx,cross(positionDy,geometricNormal));
  float orientation=determinant<0.0?-1.0:1.0;
  return normalize(abs(determinant)*geometricNormal-orientation*surfaceGradient);
}
vec3 limitTerrainNormalDeviation(vec3 geometricNormal,vec3 candidateNormal){
  const float COSINE_22_DEGREES=0.9271838545667874;
  const float SINE_22_DEGREES=0.3746065934159120;
  float correspondence=clamp(dot(geometricNormal,candidateNormal),-1.0,1.0);
  if(correspondence>=COSINE_22_DEGREES)return candidateNormal;
  vec3 tangent=candidateNormal-geometricNormal*correspondence;
  float tangentLength=length(tangent);
  if(tangentLength<0.00001)return geometricNormal;
  return normalize(geometricNormal*COSINE_22_DEGREES+tangent/tangentLength*SINE_22_DEGREES);
}
void main(){
  vec3 geometricNormal=normalize(vNormal);
  float slope=1.0-clamp(geometricNormal.y,0.0,1.0);
  float distanceToCamera=length(vWorldPosition-uCameraPosition);
  const vec3 MICRO_DIRECTION_A=vec3(0.8164965809277260,0.4082482904638630,0.4082482904638630);
  const vec3 MICRO_DIRECTION_B=vec3(-0.4082482904638630,0.8164965809277260,0.4082482904638630);
  const vec3 MICRO_DIRECTION_C=vec3(0.4082482904638630,-0.4082482904638630,0.8164965809277260);
  float microPhaseA=dot(vWorldPosition,MICRO_DIRECTION_A)*3.306939635357677+0.37;
  float microPhaseB=dot(vWorldPosition,MICRO_DIRECTION_B)*2.7318196987737333+2.17;
  float microPhaseC=dot(vWorldPosition,MICRO_DIRECTION_C)*2.243994752564138+4.11;
  float maximumMicroPhaseFootprint=max(fwidth(microPhaseA),max(fwidth(microPhaseB),fwidth(microPhaseC)));
  float microAntialiasEnvelope=1.0-smoothstep(0.45,0.95,maximumMicroPhaseFootprint);
  float microReliefSignal=sin(microPhaseA)*0.50+sin(microPhaseB)*0.30+sin(microPhaseC)*0.20;
  float microReliefHeight=microReliefSignal*0.22;
  float microDistanceEnvelope=1.0-smoothstep(120.0,300.0,distanceToCamera);
  float microSlopeEnvelope=mix(0.82,1.0,smoothstep(0.05,0.55,slope));
  float terrainReliefEnvelope=clamp(microDistanceEnvelope*microSlopeEnvelope*microAntialiasEnvelope,0.0,1.0);
  vec3 rawMicroreliefNormal=perturbTerrainNormal(geometricNormal,vWorldPosition,microReliefHeight);
  vec3 boundedMicroreliefNormal=limitTerrainNormalDeviation(geometricNormal,rawMicroreliefNormal);
  vec3 shadingNormal=normalize(mix(geometricNormal,boundedMicroreliefNormal,terrainReliefEnvelope));
  vec3 lightDirection=normalize(-uSunDirection);
  float diffuse=max(dot(shadingNormal,lightDirection),0.0);
  float hemisphere=0.48+0.52*clamp(shadingNormal.y*0.5+0.5,0.0,1.0);
  vec3 color=vColor*(0.42+0.68*diffuse)*hemisphere;
  float fog=clamp((distanceToCamera-240.0)/(610.0-240.0),0.0,0.72);
  color=mix(color,uGroundHaze,fog);
  outColor=vec4(color,1.0);
}`;

const LINE_VS = `#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
uniform mat4 uViewProjection;
uniform float uVerticalScale;
void main(){gl_Position=uViewProjection*vec4(aPosition.x,aPosition.y*uVerticalScale,aPosition.z,1.0);}`;
const LINE_FS = `#version 300 es
precision highp float;
uniform vec3 uColor;
out vec4 outColor;
void main(){outColor=vec4(uColor,1.0);}`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(`SHADER_COMPILE_FAILED:${gl.getShaderInfoLog(shader)}`);
  }
  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const program = gl.createProgram();
  gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertexSource));
  gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(program)}`);
  }
  return program;
}

function sampleNormal(x, z, spacing) {
  const left = sampleHEarthMapWideEnvironmentPresentation(clamp(x - spacing, -256, 256), z);
  const right = sampleHEarthMapWideEnvironmentPresentation(clamp(x + spacing, -256, 256), z);
  const back = sampleHEarthMapWideEnvironmentPresentation(x, clamp(z - spacing, -320, 64));
  const front = sampleHEarthMapWideEnvironmentPresentation(x, clamp(z + spacing, -320, 64));
  return normalize([
    left.presentationElevation - right.presentationElevation,
    spacing * 2,
    back.presentationElevation - front.presentationElevation
  ]);
}

export function buildMapWideEnvironmentMesh() {
  const { xMinimum, xMaximum, zMinimum, zMaximum, columns, rows } = PREVIEW_DOMAIN;
  const dx = (xMaximum - xMinimum) / (columns - 1);
  const dz = (zMaximum - zMinimum) / (rows - 1);
  const spacing = Math.min(dx, dz) * 0.5;
  const vertices = [];
  const indices = [];
  const wireIndices = [];
  let minimumElevation = Infinity;
  let maximumElevation = -Infinity;
  let minimumRelief = Infinity;
  let maximumRelief = -Infinity;
  let validSampleCount = 0;
  let estateSampleCount = 0;

  for (let row = 0; row < rows; row += 1) {
    const z = mix(zMinimum, zMaximum, row / (rows - 1));
    for (let column = 0; column < columns; column += 1) {
      const x = mix(xMinimum, xMaximum, column / (columns - 1));
      const environment = sampleHEarthMapWideEnvironmentPresentation(x, z);
      if (environment?.valid !== true) throw new Error(`ENVIRONMENT_SAMPLE_INVALID:${x}:${z}`);
      const terrain = environment.terrain;
      const normal = sampleNormal(x, z, spacing);
      vertices.push(
        x, terrain.elevation, z,
        normal[0], normal[1], normal[2],
        environment.baseColorLinear[0], environment.baseColorLinear[1], environment.baseColorLinear[2],
        terrain.presentationReliefOffset
      );
      validSampleCount += 1;
      minimumElevation = Math.min(minimumElevation, terrain.presentationElevation);
      maximumElevation = Math.max(maximumElevation, terrain.presentationElevation);
      minimumRelief = Math.min(minimumRelief, terrain.presentationReliefOffset);
      maximumRelief = Math.max(maximumRelief, terrain.presentationReliefOffset);
      if (environment.precinctClass === 'RESERVED_ESTATE_CORE') estateSampleCount += 1;
    }
  }

  const index = (row, column) => row * columns + column;
  for (let row = 0; row < rows - 1; row += 1) {
    for (let column = 0; column < columns - 1; column += 1) {
      const a = index(row, column);
      const b = index(row, column + 1);
      const c = index(row + 1, column);
      const d = index(row + 1, column + 1);
      indices.push(a, c, b, b, c, d);
      wireIndices.push(a, c, c, b, b, a, b, c, c, d, d, b);
    }
  }

  return Object.freeze({
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
    wireIndices: new Uint32Array(wireIndices),
    statistics: Object.freeze({
      validSampleCount,
      triangleCount: indices.length / 3,
      minimumElevation,
      maximumElevation,
      minimumRelief,
      maximumRelief,
      estateSampleCount,
      rendererClass: 'WEBGL2_PERSISTENT_NONPUBLIC_PREVIEW',
      v2VirtualNormalReliefExecutedInFragmentShader: true
    })
  });
}

function rectangleLine(bounds) {
  const corners = [
    [bounds.xMinimum, bounds.zMinimum],
    [bounds.xMaximum, bounds.zMinimum],
    [bounds.xMaximum, bounds.zMaximum],
    [bounds.xMinimum, bounds.zMaximum],
    [bounds.xMinimum, bounds.zMinimum]
  ];
  return new Float32Array(corners.flatMap(([x, z]) => {
    const sample = sampleHEarthMapWideEnvironmentPresentation(x, z);
    return [x, sample.presentationElevation + 1.2, z];
  }));
}

export function createMapWideEnvironmentRenderer(canvas) {
  const gl = canvas.getContext('webgl2', { antialias: true, alpha: false });
  if (!gl) throw new Error('WEBGL2_CONTEXT_UNAVAILABLE');
  const terrainProgram = createProgram(gl, TERRAIN_VS, TERRAIN_FS);
  const lineProgram = createProgram(gl, LINE_VS, LINE_FS);
  const mesh = buildMapWideEnvironmentMesh();

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);
  const stride = 10 * 4;
  for (const [location, size, offset] of [[0, 3, 0], [1, 3, 12], [2, 3, 24], [3, 1, 36]]) {
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride, offset);
  }
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);
  const wireBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wireBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.wireIndices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  const lineBuffer = gl.createBuffer();
  const estateLine = rectangleLine({ xMinimum: 64, xMaximum: 96, zMinimum: -188, zMaximum: -156 });
  const entryLine = rectangleLine({ xMinimum: -24, xMaximum: 24, zMinimum: -132, zMaximum: -88 });

  const state = {
    yaw: -0.62,
    pitch: 0.72,
    zoom: 1,
    targetX: 34,
    targetZ: -190,
    verticalScale: 2.15,
    showEstate: true,
    showEntry: true,
    showRelief: true,
    wireframe: false,
    renderedFrames: 0
  };

  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function camera() {
    const distance = 520 / state.zoom;
    const cosinePitch = Math.cos(state.pitch);
    const target = [state.targetX, 18 * state.verticalScale, state.targetZ];
    const eye = [
      target[0] + distance * cosinePitch * Math.sin(state.yaw),
      target[1] + distance * Math.sin(state.pitch),
      target[2] + distance * cosinePitch * Math.cos(state.yaw)
    ];
    return { eye, target };
  }

  function drawLine(data, color, viewProjection) {
    gl.useProgram(lineProgram);
    gl.uniformMatrix4fv(gl.getUniformLocation(lineProgram, 'uViewProjection'), false, viewProjection);
    gl.uniform1f(gl.getUniformLocation(lineProgram, 'uVerticalScale'), state.verticalScale);
    gl.uniform3fv(gl.getUniformLocation(lineProgram, 'uColor'), color);
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
    gl.drawArrays(gl.LINE_STRIP, 0, data.length / 3);
  }

  function render() {
    resize();
    const { eye, target } = camera();
    const projection = perspective(Math.PI / 3, canvas.width / canvas.height, 1, 1800);
    const view = lookAt(eye, target, [0, 1, 0]);
    const viewProjection = multiply(projection, view);
    const atmosphere = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_ENVIRONMENT.atmosphere;

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(atmosphere.skyZenith[0], atmosphere.skyZenith[1], atmosphere.skyZenith[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(terrainProgram);
    gl.uniformMatrix4fv(gl.getUniformLocation(terrainProgram, 'uViewProjection'), false, viewProjection);
    gl.uniform1f(gl.getUniformLocation(terrainProgram, 'uVerticalScale'), state.verticalScale);
    gl.uniform1f(gl.getUniformLocation(terrainProgram, 'uShowRelief'), state.showRelief ? 1 : 0);
    gl.uniform3fv(gl.getUniformLocation(terrainProgram, 'uCameraPosition'), [eye[0], eye[1] / state.verticalScale, eye[2]]);
    gl.uniform3fv(gl.getUniformLocation(terrainProgram, 'uSunDirection'), atmosphere.sunDirection);
    gl.uniform3fv(gl.getUniformLocation(terrainProgram, 'uGroundHaze'), atmosphere.groundHaze);
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_INT, 0);

    if (state.wireframe) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wireBuffer);
      gl.drawElements(gl.LINES, mesh.wireIndices.length, gl.UNSIGNED_INT, 0);
    }

    gl.disable(gl.DEPTH_TEST);
    if (state.showEstate) drawLine(estateLine, [0.96, 0.88, 0.55], viewProjection);
    if (state.showEntry) drawLine(entryLine, [0.52, 0.86, 0.94], viewProjection);
    state.renderedFrames += 1;
  }

  function orbit(deltaX, deltaY) {
    state.yaw += deltaX * 0.006;
    state.pitch = clamp(state.pitch + deltaY * 0.004, 0.18, 1.20);
    render();
  }

  function zoom(delta) {
    state.zoom = clamp(state.zoom * Math.exp(-delta * 0.0012), 0.52, 2.8);
    render();
  }

  function pan(deltaX, deltaZ) {
    state.targetX = clamp(state.targetX + deltaX, -220, 220);
    state.targetZ = clamp(state.targetZ + deltaZ, -300, 32);
    render();
  }

  function setOption(option, value) {
    if (!(option in state)) throw new Error(`UNKNOWN_RENDER_OPTION:${option}`);
    state[option] = value;
    render();
  }

  return Object.freeze({
    mesh,
    state,
    render,
    orbit,
    zoom,
    pan,
    setOption,
    getSnapshot: () => Object.freeze({
      ...state,
      webgl2: true,
      v2VirtualNormalReliefExecuted: true,
      statistics: mesh.statistics,
      manorGeometryConstructed: false,
      cameraScope: 'NONPUBLIC_PREVIEW_ONLY'
    })
  });
}

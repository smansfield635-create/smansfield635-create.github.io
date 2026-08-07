import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY,
  sampleHEarthMapWideEnvironmentTerrainCandidate
} from '../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js';

const PRESENTATION = Object.freeze({
  palette: Object.freeze({
    coastalLowland: [0.28, 0.38, 0.24],
    beachSand: [0.54, 0.47, 0.34],
    openMeadow: [0.35, 0.46, 0.25],
    estateMeadow: [0.42, 0.50, 0.29],
    preparedEarth: [0.35, 0.29, 0.19],
    reservoirBank: [0.30, 0.35, 0.23],
    cavernApproach: [0.28, 0.30, 0.25],
    upland: [0.31, 0.35, 0.29],
    highlandRock: [0.39, 0.39, 0.37],
    exposedStone: [0.31, 0.32, 0.31]
  }),
  water: Object.freeze({
    ocean: [0.07, 0.30, 0.43, 0.74],
    reservoir: [0.08, 0.28, 0.34, 0.82],
    waterfall: [0.56, 0.76, 0.80, 0.90]
  }),
  atmosphere: Object.freeze({
    skyZenith: [0.29, 0.50, 0.74],
    groundHaze: [0.54, 0.59, 0.53],
    sunDirection: [-0.38, -0.82, -0.43]
  })
});

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const clamp01 = (value) => clamp(value, 0, 1);
const mix = (left, right, amount) => left * (1 - amount) + right * amount;
const mix3 = (left, right, amount) => [
  mix(left[0], right[0], amount),
  mix(left[1], right[1], amount),
  mix(left[2], right[2], amount)
];
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
const wrapAngle = (value) => Math.atan2(Math.sin(value), Math.cos(value));

export const PREVIEW_DOMAIN = Object.freeze({
  xMinimum: -256,
  xMaximum: 256,
  zMinimum: -320,
  zMaximum: 64,
  columns: 81,
  rows: 61
});

const WORLD_CENTER = Object.freeze({ x: 0, z: -132 });
const CAMERA_LIMITS = Object.freeze({
  minimumPitch: 0.46,
  maximumPitch: 1.49,
  minimumDistance: 95,
  maximumDistance: 1600,
  worldFitDistance: 1180,
  maximumTargetX: 246,
  minimumTargetX: -246,
  maximumTargetZ: 54,
  minimumTargetZ: -310
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
  let x = cross(up, z);
  if (Math.hypot(...x) < 1e-5) x = [1, 0, 0];
  x = normalize(x);
  const y = cross(z, x);
  return new Float32Array([
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -x[0] * eye[0] - x[1] * eye[1] - x[2] * eye[2],
    -y[0] * eye[0] - y[1] * eye[1] - y[2] * eye[2],
    -z[0] * eye[0] - z[1] * eye[1] - z[2] * eye[2],
    1
  ]);
}

function multiply(a, b) {
  const output = new Float32Array(16);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      output[column * 4 + row] =
        a[row] * b[column * 4] +
        a[4 + row] * b[column * 4 + 1] +
        a[8 + row] * b[column * 4 + 2] +
        a[12 + row] * b[column * 4 + 3];
    }
  }
  return output;
}

const TERRAIN_VS = `#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec3 aColor;
layout(location=3) in float aRelief;
uniform mat4 uViewProjection;
uniform float uVerticalScale;
out vec3 vWorldPosition;
out vec3 vNormal;
out vec3 vColor;
void main(){
  float y=aPosition.y+aRelief;
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
  const vec3 A=vec3(0.8164965809277260,0.4082482904638630,0.4082482904638630);
  const vec3 B=vec3(-0.4082482904638630,0.8164965809277260,0.4082482904638630);
  const vec3 C=vec3(0.4082482904638630,-0.4082482904638630,0.8164965809277260);
  float phaseA=dot(vWorldPosition,A)*3.306939635357677+0.37;
  float phaseB=dot(vWorldPosition,B)*2.7318196987737333+2.17;
  float phaseC=dot(vWorldPosition,C)*2.243994752564138+4.11;
  float footprint=max(fwidth(phaseA),max(fwidth(phaseB),fwidth(phaseC)));
  float antialiasEnvelope=1.0-smoothstep(0.45,0.95,footprint);
  float reliefSignal=sin(phaseA)*0.50+sin(phaseB)*0.30+sin(phaseC)*0.20;
  float reliefHeight=reliefSignal*0.22*0.42;
  float distanceEnvelope=1.0-smoothstep(120.0,300.0,distanceToCamera);
  float slopeEnvelope=mix(0.82,1.0,smoothstep(0.05,0.55,slope));
  float steepSuppression=1.0-smoothstep(0.58,0.88,slope);
  float envelope=clamp(distanceEnvelope*slopeEnvelope*antialiasEnvelope*steepSuppression,0.0,1.0);
  vec3 bounded=limitTerrainNormalDeviation(geometricNormal,perturbTerrainNormal(geometricNormal,vWorldPosition,reliefHeight));
  vec3 shadingNormal=normalize(mix(geometricNormal,bounded,envelope));
  vec3 lightDirection=normalize(-uSunDirection);
  float diffuse=max(dot(shadingNormal,lightDirection),0.0);
  float hemisphere=0.50+0.50*clamp(shadingNormal.y*0.5+0.5,0.0,1.0);
  vec3 color=vColor*(0.46+0.64*diffuse)*hemisphere;
  float fog=clamp((distanceToCamera-280.0)/(690.0-280.0),0.0,0.68);
  outColor=vec4(mix(color,uGroundHaze,fog),1.0);
}`;

const WATER_VS = `#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec4 aColor;
uniform mat4 uViewProjection;
uniform float uVerticalScale;
out vec4 vColor;
void main(){
  vec3 displayPosition=vec3(aPosition.x,aPosition.y*uVerticalScale,aPosition.z);
  vColor=aColor;
  gl_Position=uViewProjection*vec4(displayPosition,1.0);
}`;

const WATER_FS = `#version 300 es
precision highp float;
in vec4 vColor;
out vec4 outColor;
void main(){outColor=vColor;}`;

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

function deterministicSignal(x, z) {
  const signal = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
  return signal - Math.floor(signal);
}

function terrainColor(terrain, x, z) {
  const palette = PRESENTATION.palette;
  const elevation = terrain.presentationElevation;
  const siteWeight = clamp01(terrain.sitePreparation?.weight ?? 0);
  const reservoirWeight = clamp01(terrain.hydrology?.reservoirWeight ?? 0);
  const cavernWeight = clamp01(terrain.hydrology?.cavernReserveWeight ?? 0);
  const slope = 1 - clamp01(terrain.normal?.y ?? 1);
  const coastalWeight = clamp01((z + 154) / 78);
  const beachWeight = clamp01(1 - Math.abs(elevation - 1.2) / 6.4) * coastalWeight;
  const highlandWeight = clamp01((elevation - 28) / 36);
  const lowlandWeight = clamp01((31 - elevation) / 22);

  let color = palette.openMeadow;
  color = mix3(color, palette.coastalLowland, lowlandWeight * 0.60);
  color = mix3(color, palette.beachSand, beachWeight * 0.90);
  color = mix3(color, palette.upland, highlandWeight * 0.50);
  color = mix3(color, palette.highlandRock, highlandWeight * 0.72);
  color = mix3(color, palette.exposedStone, clamp01(slope * 1.1));
  color = mix3(color, palette.reservoirBank, reservoirWeight * 0.66);
  color = mix3(color, palette.cavernApproach, cavernWeight * 0.42);
  if (terrain.insideReservedEstateEnvelope) {
    color = mix3(color, palette.estateMeadow, 0.44);
  }
  color = mix3(color, palette.preparedEarth, siteWeight * 0.58);

  const variation = (deterministicSignal(x, z) - 0.5) * 0.035 * (1 - siteWeight * 0.6);
  return color.map((component) => clamp01(component + variation));
}

function gridNormal(samples, row, column, columns, rows, dx, dz) {
  const index = (r, c) => r * columns + c;
  const left = samples[index(row, Math.max(0, column - 1))].presentationElevation;
  const right = samples[index(row, Math.min(columns - 1, column + 1))].presentationElevation;
  const back = samples[index(Math.max(0, row - 1), column)].presentationElevation;
  const front = samples[index(Math.min(rows - 1, row + 1), column)].presentationElevation;
  return normalize([
    (left - right) / Math.max(dx * 2, 1e-6),
    1,
    (back - front) / Math.max(dz * 2, 1e-6)
  ]);
}

export function buildMapWideEnvironmentMesh() {
  const { xMinimum, xMaximum, zMinimum, zMaximum, columns, rows } = PREVIEW_DOMAIN;
  const dx = (xMaximum - xMinimum) / (columns - 1);
  const dz = (zMaximum - zMinimum) / (rows - 1);
  const samples = new Array(columns * rows);
  const vertices = [];
  const indices = [];

  let minimumElevation = Infinity;
  let maximumElevation = -Infinity;
  let minimumRelief = Infinity;
  let maximumRelief = -Infinity;
  let validSampleCount = 0;
  let estateSampleCount = 0;
  let sitePreparationSampleCount = 0;
  let reservoirSampleCount = 0;
  let waterfallSampleCount = 0;
  let cavernReserveSampleCount = 0;

  for (let row = 0; row < rows; row += 1) {
    const z = mix(zMinimum, zMaximum, row / (rows - 1));
    for (let column = 0; column < columns; column += 1) {
      const x = mix(xMinimum, xMaximum, column / (columns - 1));
      const terrain = sampleHEarthMapWideEnvironmentTerrainCandidate(x, z);
      if (terrain?.valid !== true) {
        throw new Error(`TERRAIN_SAMPLE_INVALID:${x}:${z}`);
      }
      samples[row * columns + column] = terrain;
    }
  }

  for (let row = 0; row < rows; row += 1) {
    const z = mix(zMinimum, zMaximum, row / (rows - 1));
    for (let column = 0; column < columns; column += 1) {
      const x = mix(xMinimum, xMaximum, column / (columns - 1));
      const terrain = samples[row * columns + column];
      const normal = gridNormal(samples, row, column, columns, rows, dx, dz);
      const color = terrainColor(terrain, x, z);

      vertices.push(
        x, terrain.elevation, z,
        normal[0], normal[1], normal[2],
        color[0], color[1], color[2],
        terrain.presentationReliefOffset
      );

      validSampleCount += 1;
      minimumElevation = Math.min(minimumElevation, terrain.presentationElevation);
      maximumElevation = Math.max(maximumElevation, terrain.presentationElevation);
      minimumRelief = Math.min(minimumRelief, terrain.presentationReliefOffset);
      maximumRelief = Math.max(maximumRelief, terrain.presentationReliefOffset);
      if (terrain.insideReservedEstateEnvelope) estateSampleCount += 1;
      if ((terrain.sitePreparation?.weight ?? 0) > 0.01) sitePreparationSampleCount += 1;
      if ((terrain.hydrology?.reservoirWeight ?? 0) > 0.01) reservoirSampleCount += 1;
      if ((terrain.hydrology?.waterfallWeight ?? 0) > 0.01) waterfallSampleCount += 1;
      if ((terrain.hydrology?.cavernReserveWeight ?? 0) > 0.01) cavernReserveSampleCount += 1;
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
    }
  }

  return Object.freeze({
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
    statistics: Object.freeze({
      validSampleCount,
      triangleCount: indices.length / 3,
      minimumElevation,
      maximumElevation,
      minimumRelief,
      maximumRelief,
      estateSampleCount,
      sitePreparationSampleCount,
      reservoirSampleCount,
      waterfallSampleCount,
      cavernReserveSampleCount,
      rendererClass: 'WEBGL2_MOBILE_FIRST_PAINT_TERRAIN_INSPECTOR',
      worldInspectorRepairRevision: 5,
      firstPaintDependencyClass: 'TERRAIN_CANDIDATE_ONLY',
      environmentObserverDeferred: true,
      singlePassTerrainSampling: true,
      neighborResamplingRemoved: true,
      guideOverlayRenderPathPresent: false,
      v2VirtualNormalReliefExecutedInFragmentShader: true,
      inspectorVirtualReliefScale: 0.42,
      verticalScale: 1.35
    })
  });
}

function pushWaterVertex(vertices, x, y, z, color) {
  vertices.push(x, y, z, color[0], color[1], color[2], color[3]);
}

export function buildWaterContextMesh() {
  const vertices = [];
  const indices = [];
  const palette = PRESENTATION.water;
  const hydro = H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY;
  const addTriangle = (a, b, c) => indices.push(a, b, c);

  const oceanBase = vertices.length / 7;
  const oceanY = hydro.seaLevelY + 0.12;
  for (const [x, z] of [[-300, -145], [300, -145], [-300, 90], [300, 90]]) {
    pushWaterVertex(vertices, x, oceanY, z, palette.ocean);
  }
  addTriangle(oceanBase, oceanBase + 2, oceanBase + 1);
  addTriangle(oceanBase + 1, oceanBase + 2, oceanBase + 3);

  const reservoir = hydro.reservoir;
  const reservoirBase = vertices.length / 7;
  const reservoirSegments = 32;
  pushWaterVertex(
    vertices,
    reservoir.center.x,
    reservoir.waterSurfaceElevation + 0.12,
    reservoir.center.z,
    palette.reservoir
  );
  for (let index = 0; index <= reservoirSegments; index += 1) {
    const angle = index / reservoirSegments * Math.PI * 2;
    pushWaterVertex(
      vertices,
      reservoir.center.x + Math.cos(angle) * reservoir.radius.x * 0.82,
      reservoir.waterSurfaceElevation + 0.12,
      reservoir.center.z + Math.sin(angle) * reservoir.radius.z * 0.82,
      palette.reservoir
    );
  }
  for (let index = 0; index < reservoirSegments; index += 1) {
    addTriangle(reservoirBase, reservoirBase + index + 1, reservoirBase + index + 2);
  }

  const waterfall = hydro.waterfall;
  const waterfallBase = vertices.length / 7;
  const waterfallSegments = 20;
  const crest = sampleHEarthMapWideEnvironmentTerrainCandidate(
    waterfall.visibleCrest.x,
    waterfall.visibleCrest.z
  );
  const topY = crest?.valid === true
    ? crest.presentationElevation + 1.4
    : reservoir.waterSurfaceElevation + 28;
  const bottomY = reservoir.waterSurfaceElevation + 0.55;
  const halfWidth = 2.6;

  for (let index = 0; index <= waterfallSegments; index += 1) {
    const t = index / waterfallSegments;
    const x = mix(waterfall.visibleCrest.x, waterfall.landing.x, t);
    const z = mix(waterfall.visibleCrest.z, waterfall.landing.z, t);
    const y = mix(topY, bottomY, t);
    pushWaterVertex(vertices, x - halfWidth, y, z, palette.waterfall);
    pushWaterVertex(vertices, x + halfWidth, y, z, palette.waterfall);
  }
  for (let index = 0; index < waterfallSegments; index += 1) {
    const a = waterfallBase + index * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    addTriangle(a, c, b);
    addTriangle(b, c, d);
  }

  return Object.freeze({
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
    statistics: Object.freeze({
      triangleCount: indices.length / 3,
      oceanTriangleCount: 2,
      reservoirTriangleCount: reservoirSegments,
      waterfallTriangleCount: waterfallSegments * 2,
      authoringContextOnly: true,
      liveWaterMutation: false
    })
  });
}

function createIndexedMeshBuffers(gl, mesh, stride, attributes) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);
  for (const [location, size, offset] of attributes) {
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride, offset);
  }
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);
  return Object.freeze({ vao, vertexBuffer, indexBuffer });
}

export function createMapWideEnvironmentRenderer(canvas) {
  const gl = canvas.getContext('webgl2', {
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
  });
  if (!gl) throw new Error('WEBGL2_CONTEXT_UNAVAILABLE');

  const terrainProgram = createProgram(gl, TERRAIN_VS, TERRAIN_FS);
  const waterProgram = createProgram(gl, WATER_VS, WATER_FS);
  const mesh = buildMapWideEnvironmentMesh();
  const waterMesh = buildWaterContextMesh();
  const terrainBuffers = createIndexedMeshBuffers(
    gl,
    mesh,
    10 * 4,
    [[0, 3, 0], [1, 3, 12], [2, 3, 24], [3, 1, 36]]
  );
  const waterBuffers = createIndexedMeshBuffers(
    gl,
    waterMesh,
    7 * 4,
    [[0, 3, 0], [1, 4, 12]]
  );

  const state = {
    yaw: -0.62,
    pitch: 0.82,
    distance: CAMERA_LIMITS.worldFitDistance,
    targetX: WORLD_CENTER.x,
    targetZ: WORLD_CENTER.z,
    verticalScale: 1.35,
    renderedFrames: 0,
    cameraRecoveryCount: 0
  };

  function resize() {
    const dpr = Math.min(1.25, window.devicePixelRatio || 1);
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function clampCameraState() {
    const prior = `${state.pitch}|${state.distance}|${state.targetX}|${state.targetZ}`;
    state.pitch = clamp(state.pitch, CAMERA_LIMITS.minimumPitch, CAMERA_LIMITS.maximumPitch);
    state.distance = clamp(state.distance, CAMERA_LIMITS.minimumDistance, CAMERA_LIMITS.maximumDistance);
    state.targetX = clamp(state.targetX, CAMERA_LIMITS.minimumTargetX, CAMERA_LIMITS.maximumTargetX);
    state.targetZ = clamp(state.targetZ, CAMERA_LIMITS.minimumTargetZ, CAMERA_LIMITS.maximumTargetZ);
    state.yaw = wrapAngle(state.yaw);
    if (prior !== `${state.pitch}|${state.distance}|${state.targetX}|${state.targetZ}`) {
      state.cameraRecoveryCount += 1;
    }
  }

  function targetElevation() {
    const sample = sampleHEarthMapWideEnvironmentTerrainCandidate(state.targetX, state.targetZ);
    return sample?.valid === true && Number.isFinite(sample.presentationElevation)
      ? sample.presentationElevation
      : 18;
  }

  function camera() {
    clampCameraState();
    const targetY = targetElevation() * state.verticalScale;
    const cosinePitch = Math.cos(state.pitch);
    const target = [state.targetX, targetY, state.targetZ];
    const eye = [
      target[0] + state.distance * cosinePitch * Math.sin(state.yaw),
      target[1] + state.distance * Math.sin(state.pitch),
      target[2] + state.distance * cosinePitch * Math.cos(state.yaw)
    ];
    return { eye, target };
  }

  function render() {
    resize();
    const { eye, target } = camera();
    const projection = perspective(Math.PI / 3, canvas.width / canvas.height, 1, 2400);
    const view = lookAt(eye, target, [0, 1, 0]);
    const viewProjection = multiply(projection, view);
    const atmosphere = PRESENTATION.atmosphere;

    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.depthMask(true);
    gl.clearColor(
      atmosphere.skyZenith[0],
      atmosphere.skyZenith[1],
      atmosphere.skyZenith[2],
      1
    );
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(terrainProgram);
    gl.uniformMatrix4fv(
      gl.getUniformLocation(terrainProgram, 'uViewProjection'),
      false,
      viewProjection
    );
    gl.uniform1f(gl.getUniformLocation(terrainProgram, 'uVerticalScale'), state.verticalScale);
    gl.uniform3fv(
      gl.getUniformLocation(terrainProgram, 'uCameraPosition'),
      [eye[0], eye[1] / state.verticalScale, eye[2]]
    );
    gl.uniform3fv(
      gl.getUniformLocation(terrainProgram, 'uSunDirection'),
      atmosphere.sunDirection
    );
    gl.uniform3fv(
      gl.getUniformLocation(terrainProgram, 'uGroundHaze'),
      atmosphere.groundHaze
    );
    gl.bindVertexArray(terrainBuffers.vao);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, terrainBuffers.indexBuffer);
    gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_INT, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    gl.useProgram(waterProgram);
    gl.uniformMatrix4fv(
      gl.getUniformLocation(waterProgram, 'uViewProjection'),
      false,
      viewProjection
    );
    gl.uniform1f(gl.getUniformLocation(waterProgram, 'uVerticalScale'), state.verticalScale);
    gl.bindVertexArray(waterBuffers.vao);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, waterBuffers.indexBuffer);
    gl.drawElements(gl.TRIANGLES, waterMesh.indices.length, gl.UNSIGNED_INT, 0);
    gl.depthMask(true);
    gl.disable(gl.BLEND);

    state.renderedFrames += 1;
  }

  function orbit(deltaX, deltaY) {
    state.yaw = wrapAngle(state.yaw + clamp(Number(deltaX) || 0, -64, 64) * 0.0052);
    state.pitch = clamp(
      state.pitch + clamp(Number(deltaY) || 0, -64, 64) * 0.0032,
      CAMERA_LIMITS.minimumPitch,
      CAMERA_LIMITS.maximumPitch
    );
    render();
  }

  function zoom(delta) {
    state.distance = clamp(
      state.distance * Math.exp(clamp(Number(delta) || 0, -900, 900) * 0.00115),
      CAMERA_LIMITS.minimumDistance,
      CAMERA_LIMITS.maximumDistance
    );
    render();
  }

  function zoomByFactor(factor) {
    state.distance = clamp(
      state.distance / clamp(Number(factor) || 1, 0.75, 1.33),
      CAMERA_LIMITS.minimumDistance,
      CAMERA_LIMITS.maximumDistance
    );
    render();
  }

  function pan(deltaX, deltaZ) {
    state.targetX = clamp(
      state.targetX + (Number(deltaX) || 0),
      CAMERA_LIMITS.minimumTargetX,
      CAMERA_LIMITS.maximumTargetX
    );
    state.targetZ = clamp(
      state.targetZ + (Number(deltaZ) || 0),
      CAMERA_LIMITS.minimumTargetZ,
      CAMERA_LIMITS.maximumTargetZ
    );
    render();
  }

  function panScreen(deltaX, deltaY) {
    const scale = clamp(state.distance * 0.0021, 0.28, 2.2);
    const rightX = Math.cos(state.yaw);
    const rightZ = -Math.sin(state.yaw);
    const forwardX = Math.sin(state.yaw);
    const forwardZ = Math.cos(state.yaw);
    pan(
      (-deltaX * rightX + deltaY * forwardX) * scale,
      (-deltaX * rightZ + deltaY * forwardZ) * scale
    );
  }

  function fitWorld() {
    Object.assign(state, {
      yaw: -0.62,
      pitch: 0.82,
      distance: CAMERA_LIMITS.worldFitDistance,
      targetX: WORLD_CENTER.x,
      targetZ: WORLD_CENTER.z
    });
    render();
  }

  function getCameraSafety() {
    return Object.freeze({
      pitchWithinBounds:
        state.pitch >= CAMERA_LIMITS.minimumPitch &&
        state.pitch <= CAMERA_LIMITS.maximumPitch,
      distanceWithinBounds:
        state.distance >= CAMERA_LIMITS.minimumDistance &&
        state.distance <= CAMERA_LIMITS.maximumDistance,
      targetWithinWorld:
        state.targetX >= CAMERA_LIMITS.minimumTargetX &&
        state.targetX <= CAMERA_LIMITS.maximumTargetX &&
        state.targetZ >= CAMERA_LIMITS.minimumTargetZ &&
        state.targetZ <= CAMERA_LIMITS.maximumTargetZ,
      fitWorldAvailable: true,
      guideOverlayRenderPathAbsent: true,
      authoringWaterContextOnly: true
    });
  }

  return Object.freeze({
    mesh,
    waterMesh,
    state,
    render,
    orbit,
    zoom,
    zoomByFactor,
    pan,
    panScreen,
    fitWorld,
    getCameraSafety,
    getSnapshot: () => Object.freeze({
      ...state,
      webgl2: true,
      v2VirtualNormalReliefExecuted: true,
      statistics: mesh.statistics,
      waterStatistics: waterMesh.statistics,
      manorGeometryConstructed: false,
      cavernInteriorConstructed: false,
      vaultInteriorConstructed: false,
      liveWaterMutated: false,
      cameraScope: 'NONPUBLIC_PREVIEW_ONLY',
      guideOverlayRenderPathPresent: false,
      cameraSafety: getCameraSafety()
    })
  });
}

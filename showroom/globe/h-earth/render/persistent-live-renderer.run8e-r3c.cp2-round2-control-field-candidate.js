/**
 * H_EARTH_CP7_CONTROL_FIELD_MULTISCALE_NATURALISM_CANDIDATE_v1
 */
import {
  createHEarthRun8ER3CPersistentRenderer as createAcceptedCp2Renderer,
  H_EARTH_RUN_8E_R3C_RENDERER_ID
} from './persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js';
import {
  getHEarthTerrainControlField,
  H_EARTH_TERRAIN_CONTROL_FIELD_ID
} from './terrain-control-field.cp2-round2.v1.js';

export { H_EARTH_RUN_8E_R3C_RENDERER_ID };
export const H_EARTH_GRATITUDE_REGION_CP2_ROUND2_CONTROL_FIELD_PROFILE_ID =
  'H_EARTH_GRATITUDE_REGION_CP2_ROUND_2_CONTROL_FIELD_NATURALISM_PROFILE_v1';
export const H_EARTH_CP7_MAXIMUM_TERRAIN_CONTROL_TEXTURE_SAMPLES = 3;
export const H_EARTH_CP7_DYNAMIC_PROCEDURAL_OCTAVE_LOOPS = 0;
export const H_EARTH_CP7_LAWFUL_SHADER_INPUTS = Object.freeze([
  'vWorldPosition',
  'vNormal',
  'distanceToCamera',
  'fwidth',
  'uTerrainControl',
  'uTerrainControlDomain'
]);

const replaceOnce = (source, before, after, label) => {
  const index = source.indexOf(before);
  if (index < 0) throw new Error(`CP7_SHADER_TRANSFORM_MARKER_MISSING:${label}`);
  if (source.indexOf(before, index + before.length) >= 0) {
    throw new Error(`CP7_SHADER_TRANSFORM_MARKER_NONUNIQUE:${label}`);
  }
  return `${source.slice(0, index)}${after}${source.slice(index + before.length)}`;
};

function transformTerrainFragmentShader(source) {
  if (!source.includes('float strata=stableWave') || !source.includes('vRoleCode==1u')) {
    return source;
  }
  let transformed = source;

  transformed = replaceOnce(
    transformed,
`uniform float uDistanceDesaturationStrength;
out vec4 outColor;`,
`uniform float uDistanceDesaturationStrength;
uniform sampler2D uTerrainControl;
uniform vec4 uTerrainControlDomain;
out vec4 outColor;`,
    'CONTROL_FIELD_UNIFORMS'
  );

  transformed = replaceOnce(
    transformed,
`float ring(vec2 point,vec2 center,float innerRadius,float outerRadius,float feather){
  float radius=distance(point,center);
  float inner=smoothstep(innerRadius-feather,innerRadius+feather,radius);
  float outer=1.0-smoothstep(outerRadius-feather,outerRadius+feather,radius);
  return clamp(inner*outer,0.0,1.0);
}`,
`float ring(vec2 point,vec2 center,float innerRadius,float outerRadius,float feather){
  float radius=distance(point,center);
  float inner=smoothstep(innerRadius-feather,innerRadius+feather,radius);
  float outer=1.0-smoothstep(outerRadius-feather,outerRadius+feather,radius);
  return clamp(inner*outer,0.0,1.0);
}
vec2 terrainControlUv(vec2 world){
  vec2 minimum=uTerrainControlDomain.xy;
  vec2 maximum=uTerrainControlDomain.zw;
  return clamp((world-minimum)/max(maximum-minimum,vec2(0.0001)),vec2(0.001),vec2(0.999));
}`,
    'CONTROL_FIELD_HELPER'
  );

  transformed = replaceOnce(
    transformed,
`    float detailField=noise2(world*0.29+vec2(29.0,-17.0));
    float elevationMix=smoothstep(-1.0,34.0,vWorldPosition.y);`,
`    float detailField=noise2(world*0.29+vec2(29.0,-17.0));
    vec2 controlUv=terrainControlUv(world);
    vec4 terrainControl=texture(uTerrainControl,controlUv);
    vec2 downslope=terrainControl.rg*2.0-1.0;
    float downslopeLength=max(length(downslope),0.0001);
    downslope/=downslopeLength;
    vec2 crossSlope=vec2(-downslope.y,downslope.x);
    vec2 controlTexel=1.0/vec2(textureSize(uTerrainControl,0));
    vec4 flowForward=texture(uTerrainControl,clamp(controlUv+downslope*controlTexel*5.0,vec2(0.001),vec2(0.999)));
    vec4 flowCross=texture(uTerrainControl,clamp(controlUv+crossSlope*controlTexel*3.0,vec2(0.001),vec2(0.999)));
    float drainage=terrainControl.b;
    float landform=terrainControl.a*2.0-1.0;
    float flowDifference=flowForward.b-flowCross.b;
    float curvatureDifference=(flowForward.a-flowCross.a);
    float alongFlow=dot(world,downslope);
    float acrossFlow=dot(world,crossSlope);
    float boundedJitter=hash21(floor(world*0.027)+vec2(73.0,-41.0))-0.5;
    float controlBroad=clamp(drainage*0.54+(landform*0.5+0.5)*0.28+(flowForward.b)*0.18,0.0,1.0);
    float controlMeso=clamp(0.5+flowDifference*1.9+curvatureDifference*0.7,0.0,1.0);
    float controlMicro=clamp(0.5+curvatureDifference*1.4+boundedJitter*0.22,0.0,1.0);
    float elevationMix=smoothstep(-1.0,34.0,vWorldPosition.y);`,
    'CONTROL_FIELD_INPUTS'
  );

  transformed = replaceOnce(
    transformed,
`    float strata=stableWave(world.x*0.47+world.y*0.33+vWorldPosition.y*0.79+medium*3.2);
    float crossGrain=stableWave(world.x*0.83-world.y*0.61+broad*4.8);
    float faceBandA=stableWave(world.x*0.61+world.y*0.39+vWorldPosition.y*0.57+mesoField*4.1);
    float faceBandB=stableWave(world.x*1.07-world.y*0.73+vWorldPosition.y*0.31+macroField*5.3);
    float faceBandC=stableWave(world.x*1.71+world.y*1.23+vWorldPosition.y*0.18+detailField*2.7);
    float crestSignal=stableWave(world.x*0.22-world.y*0.16+vWorldPosition.y*0.88+macroField*2.1);
    float terraceSignal=stableWave(world.x*0.13+world.y*0.19+vWorldPosition.y*1.18+mesoField*1.6);`,
`    float strata=stableWave(alongFlow*0.43+acrossFlow*0.11+vWorldPosition.y*0.73+medium*2.4+controlBroad*5.1);
    float crossGrain=stableWave(acrossFlow*0.79-alongFlow*0.17+broad*3.6+controlMeso*4.7);
    float faceBandA=stableWave(alongFlow*0.57+acrossFlow*0.19+vWorldPosition.y*0.51+mesoField*3.2+controlMeso*5.4);
    float faceBandB=stableWave(acrossFlow*0.91-alongFlow*0.23+vWorldPosition.y*0.29+macroField*4.2+controlBroad*6.1);
    float faceBandC=stableWave((alongFlow+acrossFlow)*1.18+vWorldPosition.y*0.16+detailField*2.1+controlMicro*5.8);
    float crestSignal=stableWave(alongFlow*0.20-acrossFlow*0.08+vWorldPosition.y*0.82+macroField*1.8+controlBroad*4.3);
    float terraceSignal=stableWave(acrossFlow*0.17+alongFlow*0.07+vWorldPosition.y*1.08+mesoField*1.3+controlMeso*4.9);`,
    'CONTROL_ALIGNED_NESTED_SIGNALS'
  );

  transformed = replaceOnce(
    transformed,
`    float contourLine=contour(vWorldPosition.y);
    palette*=mix(1.0,0.56,contourLine*(0.30+0.47*slopeResponse));
    float slopeRake=stableWave(vWorldPosition.x*0.31+vWorldPosition.z*0.22+vWorldPosition.y*0.58);
    palette*=mix(0.84,1.16,slopeRake*(0.26+0.74*slopeResponse));`,
`    float contourLine=contour(vWorldPosition.y+(drainage-0.5)*4.2+landform*1.5+flowDifference*2.0);
    palette*=mix(1.0,0.56,contourLine*(0.30+0.47*slopeResponse));
    float slopeRake=stableWave(alongFlow*0.26+acrossFlow*0.12+vWorldPosition.y*0.50+controlMeso*3.4+controlMicro*1.7);
    palette*=mix(0.84,1.16,slopeRake*(0.26+0.74*slopeResponse));`,
    'CONTROL_ALIGNED_CONTOUR_AND_RAKE'
  );

  return transformed;
}

const cloneReceipt = (receipt, state) => ({
  ...receipt,
  presentationProfileId: H_EARTH_GRATITUDE_REGION_CP2_ROUND2_CONTROL_FIELD_PROFILE_ID,
  presentationProfile: {
    ...receipt.presentationProfile,
    round2ControlFieldNaturalism: true,
    precomputedTerrainStructureControl: true,
    directionalRepetitionReduction: true,
    slopeFlowAlignedStructure: true,
    bandLimitedMaterialSynthesis: true,
    distanceFilteredDetail: true,
    acceptedCp2ColorEdgeManorCavernAndContactTermsPreserved: true,
    acceptedCp2RendererSourceMutated: false,
    liveDefaultSelectionMutated: false,
    geometryMutation: false,
    terrainMutation: false,
    cameraMutation: false,
    touchMutation: false
  },
  counters: {
    ...receipt.counters,
    textureCreateCount: receipt.counters.textureCreateCount + (state.controlTexture ? 1 : 0),
    staticUniformUpdateCount: receipt.counters.staticUniformUpdateCount + (state.uniformsBound ? 2 : 0)
  },
  persistentObjectCounts: {
    ...receipt.persistentObjectCounts,
    textures: receipt.persistentObjectCounts.textures + (state.controlTexture ? 1 : 0)
  },
  controlField: state.fieldReceipt,
  controlFieldTexture: {
    created: Boolean(state.controlTexture),
    textureUnit: state.textureUnit,
    mipmapsGenerated: state.mipmapsGenerated,
    maximumSamplesPerTerrainFragment: H_EARTH_CP7_MAXIMUM_TERRAIN_CONTROL_TEXTURE_SAMPLES,
    dynamicProceduralOctaveLoops: H_EARTH_CP7_DYNAMIC_PROCEDURAL_OCTAVE_LOOPS,
    createdBeforeCandidateInitializationCompleted: state.createdBeforeInitializationCompleted,
    postInitializationCreationCount: state.postInitializationCreationCount
  },
  resourceIdentityStable:
    receipt.resourceIdentityStable === true &&
    Boolean(state.controlTexture && state.geometryProgram && state.uniformsBound),
  noPostInitializationResourceCreation:
    receipt.noPostInitializationResourceCreation === true &&
    state.postInitializationCreationCount === 0
});

function withTerrainShaderTransform(gl, operation) {
  const hadOwn = Object.prototype.hasOwnProperty.call(gl, 'shaderSource');
  const previousOwn = hadOwn ? gl.shaderSource : null;
  const nativeShaderSource = gl.shaderSource.bind(gl);
  Object.defineProperty(gl, 'shaderSource', {
    configurable: true,
    writable: true,
    value(shader, source) {
      return nativeShaderSource(shader, transformTerrainFragmentShader(String(source)));
    }
  });
  try {
    return operation();
  } finally {
    if (hadOwn) {
      Object.defineProperty(gl, 'shaderSource', {
        configurable: true,
        writable: true,
        value: previousOwn
      });
    } else {
      delete gl.shaderSource;
    }
  }
}

export function createHEarthRun8ER3CPersistentRenderer(options = {}) {
  const acceptedRenderer = createAcceptedCp2Renderer(options);
  const gl = options.canvas?.getContext?.('webgl2');
  if (!gl) throw new Error('CP7_CONTROL_FIELD_WEBGL2_CONTEXT_UNAVAILABLE');

  const state = {
    initialized: false,
    controlTexture: null,
    geometryProgram: null,
    controlSampler: null,
    controlDomain: null,
    textureUnit: 7,
    mipmapsGenerated: false,
    uniformsBound: false,
    createdBeforeInitializationCompleted: false,
    postInitializationCreationCount: 0,
    fieldReceipt: null
  };

  const bindControlField = () => {
    if (!state.controlTexture || !state.geometryProgram) {
      throw new Error('CP7_CONTROL_FIELD_RESOURCE_NOT_READY');
    }
    gl.useProgram(state.geometryProgram);
    gl.activeTexture(gl.TEXTURE0 + state.textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, state.controlTexture);
    gl.uniform1i(state.controlSampler, state.textureUnit);
    const domain = state.fieldReceipt.domain;
    gl.uniform4f(
      state.controlDomain,
      domain.xMinimum,
      domain.zMinimum,
      domain.xMaximum,
      domain.zMaximum
    );
    state.uniformsBound = true;
  };

  const initialize = (packet) => {
    if (state.initialized) throw new Error('CP7_CONTROL_FIELD_RENDERER_ALREADY_INITIALIZED');
    const field = getHEarthTerrainControlField();
    state.fieldReceipt = Object.freeze({
      fieldId: field.fieldId,
      sourceContractId: field.sourceContractId,
      width: field.width,
      height: field.height,
      channelCount: field.channelCount,
      storage: field.storage,
      baseByteLength: field.baseByteLength,
      mipmapsRequired: field.mipmapsRequired,
      domain: Object.freeze({ ...field.domain }),
      channels: Object.freeze({ ...field.channels }),
      minimumElevation: field.minimumElevation,
      maximumElevation: field.maximumElevation,
      maximumFlowAccumulation: field.maximumFlowAccumulation,
      canonicalByteDigest: field.canonicalByteDigest,
      deterministicGeneration: field.deterministicGeneration,
      immutablePrivateStorage: field.immutablePrivateStorage,
      generationDurationMs: field.generationDurationMs
    });

    state.controlTexture = gl.createTexture();
    if (!state.controlTexture) throw new Error('CP7_CONTROL_FIELD_TEXTURE_CREATE_FAILED');
    state.createdBeforeInitializationCompleted = true;
    gl.activeTexture(gl.TEXTURE0 + state.textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, state.controlTexture);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA8,
      field.width,
      field.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      field.bytes
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_2D);
    state.mipmapsGenerated = true;

    try {
      withTerrainShaderTransform(gl, () => acceptedRenderer.initialize(packet));
      state.geometryProgram = gl.getParameter(gl.CURRENT_PROGRAM);
      if (!state.geometryProgram) throw new Error('CP7_GEOMETRY_PROGRAM_NOT_CURRENT_AFTER_INITIALIZE');
      state.controlSampler = gl.getUniformLocation(state.geometryProgram, 'uTerrainControl');
      state.controlDomain = gl.getUniformLocation(state.geometryProgram, 'uTerrainControlDomain');
      if (state.controlSampler === null || state.controlDomain === null) {
        throw new Error('CP7_CONTROL_FIELD_UNIFORM_MISSING');
      }
      bindControlField();
      state.initialized = true;
      gl.activeTexture(gl.TEXTURE0);
      return cloneReceipt(acceptedRenderer.getResourceReceipt(), state);
    } catch (error) {
      if (state.controlTexture) gl.deleteTexture(state.controlTexture);
      state.controlTexture = null;
      throw error;
    }
  };

  const renderFrame = (packet) => {
    if (!state.initialized) throw new Error('CP7_CONTROL_FIELD_RENDERER_NOT_INITIALIZED');
    bindControlField();
    acceptedRenderer.renderFrame(packet);
    gl.activeTexture(gl.TEXTURE0);
  };
  const getResourceReceipt = () =>
    cloneReceipt(acceptedRenderer.getResourceReceipt(), state);

  return Object.freeze({
    rendererId: H_EARTH_RUN_8E_R3C_RENDERER_ID,
    presentationProfileId: H_EARTH_GRATITUDE_REGION_CP2_ROUND2_CONTROL_FIELD_PROFILE_ID,
    controlFieldId: H_EARTH_TERRAIN_CONTROL_FIELD_ID,
    initialize,
    renderFrame,
    presentColorFrame: acceptedRenderer.presentColorFrame,
    captureColorFrame: acceptedRenderer.captureColorFrame,
    captureDepthSummary: acceptedRenderer.captureDepthSummary,
    getResourceReceipt
  });
}

export default createHEarthRun8ER3CPersistentRenderer;

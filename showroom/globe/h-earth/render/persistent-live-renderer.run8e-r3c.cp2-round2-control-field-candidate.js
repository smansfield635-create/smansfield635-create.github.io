/** H_EARTH_CP7D_NEUTRAL_CONTROL_FIELD_RENDERER_v1 */
import {
  createHEarthRun8ER3CPersistentRenderer as createAcceptedCp2Renderer,
  H_EARTH_RUN_8E_R3C_RENDERER_ID
} from './persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js';
import {
  getHEarthTerrainControlField,
  getHEarthTerrainControlFieldReceipt,
  H_EARTH_TERRAIN_CONTROL_FIELD_ID
} from './terrain-control-field.cp2-round2.v1.js';

export { H_EARTH_RUN_8E_R3C_RENDERER_ID };
export const H_EARTH_GRATITUDE_REGION_CP7D_NEUTRAL_CONTROL_FIELD_PROFILE_ID =
  'H_EARTH_GRATITUDE_REGION_CP7D_NEUTRAL_CONTROL_FIELD_INTEGRATION_PROFILE_v1';
export const H_EARTH_CP7D_NEUTRAL_MATERIAL_MODULATION_WEIGHT = 0;
export const H_EARTH_CP7D_CONTROL_TEXTURE_SAMPLES_PER_TERRAIN_FRAGMENT = 1;
export const H_EARTH_CP7D_DYNAMIC_PROCEDURAL_OCTAVE_LOOPS = 0;

const replaceOnce = (source, before, after, label) => {
  const index = source.indexOf(before);
  if (index < 0) throw new Error(`CP7D_SHADER_TRANSFORM_MARKER_MISSING:${label}`);
  if (source.indexOf(before, index + before.length) >= 0) {
    throw new Error(`CP7D_SHADER_TRANSFORM_MARKER_NONUNIQUE:${label}`);
  }
  return `${source.slice(0, index)}${after}${source.slice(index + before.length)}`;
};

function transformTerrainFragmentShader(source) {
  if (!source.includes('float strata=stableWave') || !source.includes('vRoleCode==1u')) return source;
  let transformed = source;
  transformed = replaceOnce(
    transformed,
`uniform float uDistanceDesaturationStrength;
out vec4 outColor;`,
`uniform float uDistanceDesaturationStrength;
uniform sampler2D uTerrainControlNeutral;
uniform vec4 uTerrainControlNeutralDomain;
uniform float uTerrainControlNeutralWeight;
out vec4 outColor;`,
    'NEUTRAL_CONTROL_UNIFORMS'
  );
  transformed = replaceOnce(
    transformed,
`    float detailField=noise2(world*0.29+vec2(29.0,-17.0));
    float elevationMix=smoothstep(-1.0,34.0,vWorldPosition.y);`,
`    float detailField=noise2(world*0.29+vec2(29.0,-17.0));
    vec2 neutralMinimum=uTerrainControlNeutralDomain.xy;
    vec2 neutralMaximum=uTerrainControlNeutralDomain.zw;
    vec2 neutralUv=clamp((world-neutralMinimum)/max(neutralMaximum-neutralMinimum,vec2(0.0001)),vec2(0.0),vec2(1.0));
    vec4 neutralControlSample=texture(uTerrainControlNeutral,neutralUv);
    float neutralControlSignal=dot(neutralControlSample,vec4(0.25));
    float elevationMix=smoothstep(-1.0,34.0,vWorldPosition.y);`,
    'NEUTRAL_CONTROL_SAMPLE'
  );
  transformed = replaceOnce(
    transformed,
`    presentationContact=max(presentationContact,ravineWallContact*0.52+routeSignal*0.20);
    base=palette;`,
`    presentationContact=max(presentationContact,ravineWallContact*0.52+routeSignal*0.20);
    palette*=1.0+(neutralControlSignal-0.5)*uTerrainControlNeutralWeight;
    base=palette;`,
    'ZERO_WEIGHT_NEUTRAL_MODULATION'
  );
  return transformed;
}

function withShaderTransform(gl, operation) {
  const hadOwn = Object.prototype.hasOwnProperty.call(gl, 'shaderSource');
  const previous = hadOwn ? gl.shaderSource : null;
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
    if (hadOwn) Object.defineProperty(gl, 'shaderSource', { configurable: true, writable: true, value: previous });
    else delete gl.shaderSource;
  }
}

const cloneReceipt = (receipt, state) => ({
  ...receipt,
  presentationProfileId: H_EARTH_GRATITUDE_REGION_CP7D_NEUTRAL_CONTROL_FIELD_PROFILE_ID,
  presentationProfile: {
    ...receipt.presentationProfile,
    neutralControlFieldIntegration: true,
    activeControlFieldShaderSamplePath: true,
    materialModulationWeight: H_EARTH_CP7D_NEUTRAL_MATERIAL_MODULATION_WEIGHT,
    acceptedCp2PresentationExpectedByteIdentical: true,
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
    staticUniformUpdateCount: receipt.counters.staticUniformUpdateCount + (state.uniformsBound ? 3 : 0)
  },
  persistentObjectCounts: {
    ...receipt.persistentObjectCounts,
    textures: receipt.persistentObjectCounts.textures + (state.controlTexture ? 1 : 0)
  },
  controlField: state.fieldReceipt,
  controlFieldTexture: {
    created: Boolean(state.controlTexture),
    textureUnit: state.textureUnit,
    baseUploadCount: state.baseUploadCount,
    mipmapsGenerated: state.mipmapsGenerated,
    shaderSamplePathActive: state.shaderSamplePathActive,
    samplesPerTerrainFragment: H_EARTH_CP7D_CONTROL_TEXTURE_SAMPLES_PER_TERRAIN_FRAGMENT,
    materialModulationWeight: H_EARTH_CP7D_NEUTRAL_MATERIAL_MODULATION_WEIGHT,
    dynamicProceduralOctaveLoops: H_EARTH_CP7D_DYNAMIC_PROCEDURAL_OCTAVE_LOOPS,
    postInitializationCreationCount: state.postInitializationCreationCount,
    postInitializationUploadCount: state.postInitializationUploadCount
  },
  resourceIdentityStable:
    receipt.resourceIdentityStable === true &&
    Boolean(state.controlTexture && state.geometryProgram && state.uniformsBound),
  noPostInitializationResourceCreation:
    receipt.noPostInitializationResourceCreation === true && state.postInitializationCreationCount === 0,
  noPostInitializationBufferUpload:
    receipt.noPostInitializationBufferUpload === true && state.postInitializationUploadCount === 0
});

export function createHEarthRun8ER3CPersistentRenderer(options = {}) {
  const acceptedRenderer = createAcceptedCp2Renderer(options);
  const gl = options.canvas?.getContext?.('webgl2');
  if (!gl) throw new Error('CP7D_WEBGL2_CONTEXT_UNAVAILABLE');
  const state = {
    initialized: false,
    controlTexture: null,
    geometryProgram: null,
    controlSampler: null,
    controlDomain: null,
    neutralWeight: null,
    textureUnit: 7,
    baseUploadCount: 0,
    mipmapsGenerated: false,
    uniformsBound: false,
    shaderSamplePathActive: false,
    postInitializationCreationCount: 0,
    postInitializationUploadCount: 0,
    fieldReceipt: null
  };

  const bindControlField = () => {
    if (!state.controlTexture || !state.geometryProgram) throw new Error('CP7D_CONTROL_FIELD_RESOURCE_NOT_READY');
    gl.useProgram(state.geometryProgram);
    gl.activeTexture(gl.TEXTURE0 + state.textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, state.controlTexture);
    gl.uniform1i(state.controlSampler, state.textureUnit);
    const domain = state.fieldReceipt.domain;
    gl.uniform4f(state.controlDomain, domain.xMinimum, domain.zMinimum, domain.xMaximum, domain.zMaximum);
    gl.uniform1f(state.neutralWeight, H_EARTH_CP7D_NEUTRAL_MATERIAL_MODULATION_WEIGHT);
    state.uniformsBound = true;
    gl.activeTexture(gl.TEXTURE0);
  };

  const initialize = (packet) => {
    if (state.initialized) throw new Error('CP7D_RENDERER_ALREADY_INITIALIZED');
    const field = getHEarthTerrainControlField();
    state.fieldReceipt = getHEarthTerrainControlFieldReceipt();
    state.controlTexture = gl.createTexture();
    if (!state.controlTexture) throw new Error('CP7D_CONTROL_TEXTURE_CREATE_FAILED');
    gl.activeTexture(gl.TEXTURE0 + state.textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, state.controlTexture);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, field.width, field.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, field.bytes);
    state.baseUploadCount += 1;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_2D);
    state.mipmapsGenerated = true;
    gl.activeTexture(gl.TEXTURE0);
    const uploadError = gl.getError();
    if (uploadError !== gl.NO_ERROR) throw new Error(`CP7D_CONTROL_TEXTURE_UPLOAD_ERROR:${uploadError}`);
    try {
      withShaderTransform(gl, () => acceptedRenderer.initialize(packet));
      state.geometryProgram = gl.getParameter(gl.CURRENT_PROGRAM);
      if (!state.geometryProgram) throw new Error('CP7D_GEOMETRY_PROGRAM_NOT_CURRENT');
      state.controlSampler = gl.getUniformLocation(state.geometryProgram, 'uTerrainControlNeutral');
      state.controlDomain = gl.getUniformLocation(state.geometryProgram, 'uTerrainControlNeutralDomain');
      state.neutralWeight = gl.getUniformLocation(state.geometryProgram, 'uTerrainControlNeutralWeight');
      if (state.controlSampler === null || state.controlDomain === null || state.neutralWeight === null) {
        throw new Error('CP7D_NEUTRAL_CONTROL_UNIFORM_MISSING');
      }
      state.shaderSamplePathActive = true;
      bindControlField();
      state.initialized = true;
      return cloneReceipt(acceptedRenderer.getResourceReceipt(), state);
    } catch (error) {
      if (state.controlTexture) gl.deleteTexture(state.controlTexture);
      state.controlTexture = null;
      throw error;
    }
  };

  const renderFrame = (packet) => {
    if (!state.initialized) throw new Error('CP7D_RENDERER_NOT_INITIALIZED');
    bindControlField();
    acceptedRenderer.renderFrame(packet);
  };
  const getResourceReceipt = () => cloneReceipt(acceptedRenderer.getResourceReceipt(), state);

  return Object.freeze({
    rendererId: H_EARTH_RUN_8E_R3C_RENDERER_ID,
    presentationProfileId: H_EARTH_GRATITUDE_REGION_CP7D_NEUTRAL_CONTROL_FIELD_PROFILE_ID,
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

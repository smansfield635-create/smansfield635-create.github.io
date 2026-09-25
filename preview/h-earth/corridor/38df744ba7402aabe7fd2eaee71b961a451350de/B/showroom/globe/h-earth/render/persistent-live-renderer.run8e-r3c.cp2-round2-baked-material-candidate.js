/** H_EARTH_BM4_ONE_SAMPLE_BAKED_MATERIAL_RENDERER_v1 */
import {
  createHEarthRun8ER3CPersistentRenderer as createAcceptedCp2Renderer,
  H_EARTH_RUN_8E_R3C_RENDERER_ID
} from './persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js';
import {
  loadHEarthRound2BakedMaterialField,
  getHEarthRound2BakedMaterialFieldReceipt,
  H_EARTH_BAKED_MATERIAL_FIELD_ID,
  H_EARTH_BAKED_MATERIAL_FIELD_WIDTH,
  H_EARTH_BAKED_MATERIAL_FIELD_HEIGHT
} from './terrain-material-field.round2-baked.v1.js';

export { H_EARTH_RUN_8E_R3C_RENDERER_ID };
export const H_EARTH_GRATITUDE_REGION_BM4_BAKED_MATERIAL_PROFILE_ID =
  'H_EARTH_GRATITUDE_REGION_BM4_UNIQUE_BAKED_MATERIAL_PROFILE_v1';
export const H_EARTH_BM4_TERRAIN_TEXTURE_SAMPLES_PER_FRAGMENT = 1;
export const H_EARTH_BM4_CONTROL_FIELD_TEXTURE_SAMPLES = 0;
export const H_EARTH_BM4_DYNAMIC_PROCEDURAL_OCTAVE_LOOPS = 0;

const BAKED_FIELD_BYTES = await loadHEarthRound2BakedMaterialField();
const BAKED_FIELD_RECEIPT = getHEarthRound2BakedMaterialFieldReceipt();

const replaceOnce = (source, before, after, label) => {
  const index = source.indexOf(before);
  if (index < 0) throw new Error(`BM4_SHADER_TRANSFORM_MARKER_MISSING:${label}`);
  if (source.indexOf(before, index + before.length) >= 0) {
    throw new Error(`BM4_SHADER_TRANSFORM_MARKER_NONUNIQUE:${label}`);
  }
  return `${source.slice(0, index)}${after}${source.slice(index + before.length)}`;
};
const replaceRange = (source, start, end, replacement, label) => {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  if (startIndex < 0 || endIndex < 0) throw new Error(`BM4_SHADER_RANGE_MARKER_MISSING:${label}`);
  if (source.indexOf(start, startIndex + start.length) >= 0) throw new Error(`BM4_SHADER_RANGE_START_NONUNIQUE:${label}`);
  return `${source.slice(0, startIndex)}${replacement}${source.slice(endIndex)}`;
};

function transformTerrainFragmentShader(source) {
  if (!source.includes('float strata=stableWave') || !source.includes('vRoleCode==1u')) return source;
  let transformed = source;
  transformed = replaceOnce(
    transformed,
`uniform float uDistanceDesaturationStrength;
out vec4 outColor;`,
`uniform float uDistanceDesaturationStrength;
uniform sampler2D uTerrainBakedMaterial;
uniform vec4 uTerrainBakedMaterialDomain;
out vec4 outColor;`,
    'BAKED_MATERIAL_UNIFORMS'
  );
  transformed = replaceRange(
    transformed,
`    float broad=noise2(world*0.035);`,
`    vec2 manorCenter=vec2(80.0,-172.0);`,
`    vec2 bakedMinimum=uTerrainBakedMaterialDomain.xy;
    vec2 bakedMaximum=uTerrainBakedMaterialDomain.zw;
    vec2 bakedUv=clamp((world-bakedMinimum)/max(bakedMaximum-bakedMinimum,vec2(0.0001)),vec2(0.0),vec2(1.0));
    vec4 bakedMaterial=texture(uTerrainBakedMaterial,bakedUv);
    float elevationMix=smoothstep(-1.0,34.0,vWorldPosition.y);
    float slopeResponse=smoothstep(0.025,0.58,slope);
    float curvatureResponse=clamp(length(fwidth(n))*3.25,0.0,1.0);
    float nearDetail=1.0-smoothstep(72.0,250.0,distanceToCamera);
    float mesoField=bakedMaterial.a;
    vec3 palette=max(bakedMaterial.rgb,vec3(0.008));
    palette=mix(palette,base,0.16);
    palette=mix(palette,palette*vec3(0.84,0.91,0.95),curvatureResponse*(0.12+0.22*slopeResponse));
    palette*=mix(0.91,1.09,clamp(bakedMaterial.a*0.72+elevationMix*0.12+slopeResponse*0.16,0.0,1.0));
    float sharedFaceContact=clamp((1.0-bakedMaterial.a)*(0.16+0.34*slopeResponse)*(0.72+0.28*nearDetail),0.0,1.0);
    presentationContact=max(presentationContact,sharedFaceContact*0.24);
    presentationHighlight=max(presentationHighlight,bakedMaterial.a*(1.0-sharedFaceContact)*0.055);

`,
    'BAKED_GENERIC_TERRAIN_BASE'
  );
  return transformed;
}

function withTerrainShaderTransform(gl, operation) {
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
  presentationProfileId: H_EARTH_GRATITUDE_REGION_BM4_BAKED_MATERIAL_PROFILE_ID,
  presentationProfile: {
    ...receipt.presentationProfile,
    uniqueBakedLandformMaterialField: true,
    repeatedGenericCp2SignalFamilyRemoved: true,
    oneWorldAlignedTextureSample: true,
    runtimeProceduralTerrainSynthesis: false,
    acceptedCp2LightingPreserved: true,
    acceptedCp2ManorCavernRavineAndContactTermsPreserved: true,
    acceptedCp2RendererSourceMutated: false,
    liveDefaultSelectionMutated: false,
    geometryMutation: false,
    terrainMutation: false,
    cameraMutation: false,
    navigationMutation: false,
    touchMutation: false
  },
  counters: {
    ...receipt.counters,
    textureCreateCount: receipt.counters.textureCreateCount + (state.texture ? 1 : 0),
    staticUniformUpdateCount: receipt.counters.staticUniformUpdateCount + (state.uniformsBound ? 2 : 0)
  },
  persistentObjectCounts: {
    ...receipt.persistentObjectCounts,
    textures: receipt.persistentObjectCounts.textures + (state.texture ? 1 : 0)
  },
  bakedMaterialField: state.fieldReceipt,
  bakedMaterialTexture: {
    created: Boolean(state.texture),
    textureUnit: state.textureUnit,
    baseUploadCount: state.baseUploadCount,
    mipmapsGenerated: state.mipmapsGenerated,
    shaderSamplePathActive: state.shaderSamplePathActive,
    samplesPerTerrainFragment: H_EARTH_BM4_TERRAIN_TEXTURE_SAMPLES_PER_FRAGMENT,
    controlFieldSamples: H_EARTH_BM4_CONTROL_FIELD_TEXTURE_SAMPLES,
    dynamicProceduralOctaveLoops: H_EARTH_BM4_DYNAMIC_PROCEDURAL_OCTAVE_LOOPS,
    postInitializationCreationCount: state.postInitializationCreationCount,
    postInitializationUploadCount: state.postInitializationUploadCount
  },
  resourceIdentityStable:
    receipt.resourceIdentityStable === true && Boolean(state.texture && state.geometryProgram && state.uniformsBound),
  noPostInitializationResourceCreation:
    receipt.noPostInitializationResourceCreation === true && state.postInitializationCreationCount === 0,
  noPostInitializationBufferUpload:
    receipt.noPostInitializationBufferUpload === true && state.postInitializationUploadCount === 0
});

export function createHEarthRun8ER3CPersistentRenderer(options = {}) {
  const acceptedRenderer = createAcceptedCp2Renderer(options);
  const gl = options.canvas?.getContext?.('webgl2');
  if (!gl) throw new Error('BM4_WEBGL2_CONTEXT_UNAVAILABLE');
  const state = {
    initialized: false,
    texture: null,
    geometryProgram: null,
    sampler: null,
    domain: null,
    textureUnit: 7,
    baseUploadCount: 0,
    mipmapsGenerated: false,
    uniformsBound: false,
    shaderSamplePathActive: false,
    postInitializationCreationCount: 0,
    postInitializationUploadCount: 0,
    fieldReceipt: BAKED_FIELD_RECEIPT
  };

  const bindBakedMaterial = () => {
    if (!state.texture || !state.geometryProgram) throw new Error('BM4_BAKED_RESOURCE_NOT_READY');
    gl.useProgram(state.geometryProgram);
    gl.activeTexture(gl.TEXTURE0 + state.textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, state.texture);
    gl.uniform1i(state.sampler, state.textureUnit);
    const domain = state.fieldReceipt.domain;
    gl.uniform4f(state.domain, domain.xMinimum, domain.zMinimum, domain.xMaximum, domain.zMaximum);
    state.uniformsBound = true;
    gl.activeTexture(gl.TEXTURE0);
  };

  const initialize = (packet) => {
    if (state.initialized) throw new Error('BM4_RENDERER_ALREADY_INITIALIZED');
    if (BAKED_FIELD_BYTES.byteLength !== H_EARTH_BAKED_MATERIAL_FIELD_WIDTH * H_EARTH_BAKED_MATERIAL_FIELD_HEIGHT * 4) {
      throw new Error('BM4_BAKED_FIELD_BYTE_LENGTH_INVALID');
    }
    state.texture = gl.createTexture();
    if (!state.texture) throw new Error('BM4_BAKED_TEXTURE_CREATE_FAILED');
    gl.activeTexture(gl.TEXTURE0 + state.textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, state.texture);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA8,
      H_EARTH_BAKED_MATERIAL_FIELD_WIDTH, H_EARTH_BAKED_MATERIAL_FIELD_HEIGHT,
      0, gl.RGBA, gl.UNSIGNED_BYTE, BAKED_FIELD_BYTES
    );
    state.baseUploadCount += 1;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_2D);
    state.mipmapsGenerated = true;
    gl.activeTexture(gl.TEXTURE0);
    const uploadError = gl.getError();
    if (uploadError !== gl.NO_ERROR) throw new Error(`BM4_BAKED_TEXTURE_UPLOAD_ERROR:${uploadError}`);
    try {
      withTerrainShaderTransform(gl, () => acceptedRenderer.initialize(packet));
      state.geometryProgram = gl.getParameter(gl.CURRENT_PROGRAM);
      if (!state.geometryProgram) throw new Error('BM4_GEOMETRY_PROGRAM_NOT_CURRENT');
      state.sampler = gl.getUniformLocation(state.geometryProgram, 'uTerrainBakedMaterial');
      state.domain = gl.getUniformLocation(state.geometryProgram, 'uTerrainBakedMaterialDomain');
      if (state.sampler === null || state.domain === null) throw new Error('BM4_BAKED_UNIFORM_MISSING');
      state.shaderSamplePathActive = true;
      bindBakedMaterial();
      state.initialized = true;
      return cloneReceipt(acceptedRenderer.getResourceReceipt(), state);
    } catch (error) {
      if (state.texture) gl.deleteTexture(state.texture);
      state.texture = null;
      throw error;
    }
  };

  const renderFrame = (packet) => {
    if (!state.initialized) throw new Error('BM4_RENDERER_NOT_INITIALIZED');
    bindBakedMaterial();
    acceptedRenderer.renderFrame(packet);
    gl.activeTexture(gl.TEXTURE0);
  };

  return Object.freeze({
    rendererId: H_EARTH_RUN_8E_R3C_RENDERER_ID,
    presentationProfileId: H_EARTH_GRATITUDE_REGION_BM4_BAKED_MATERIAL_PROFILE_ID,
    bakedMaterialFieldId: H_EARTH_BAKED_MATERIAL_FIELD_ID,
    initialize,
    renderFrame,
    presentColorFrame: acceptedRenderer.presentColorFrame,
    captureColorFrame: acceptedRenderer.captureColorFrame,
    captureDepthSummary: acceptedRenderer.captureDepthSummary,
    getResourceReceipt: () => cloneReceipt(acceptedRenderer.getResourceReceipt(), state)
  });
}

export default createHEarthRun8ER3CPersistentRenderer;

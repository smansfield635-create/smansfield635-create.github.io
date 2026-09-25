/** H_EARTH_CP7E_BOUNDED_CONTROL_FIELD_MATERIAL_SYNTHESIS_v1 */
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
export const H_EARTH_GRATITUDE_REGION_CP7E_CONTROL_FIELD_PROFILE_ID =
  'H_EARTH_GRATITUDE_REGION_CP7E_BOUNDED_CONTROL_FIELD_MATERIAL_SYNTHESIS_PROFILE_v1';
export const H_EARTH_CP7E_MATERIAL_MODULATION_WEIGHT = 0.72;
export const H_EARTH_CP7E_CONTROL_TEXTURE_SAMPLES_PER_TERRAIN_FRAGMENT = 3;
export const H_EARTH_CP7E_DYNAMIC_PROCEDURAL_OCTAVE_LOOPS = 0;

const replaceOnce = (source, before, after, label) => {
  const index = source.indexOf(before);
  if (index < 0) throw new Error(`CP7E_SHADER_TRANSFORM_MARKER_MISSING:${label}`);
  if (source.indexOf(before, index + before.length) >= 0) {
    throw new Error(`CP7E_SHADER_TRANSFORM_MARKER_NONUNIQUE:${label}`);
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
uniform sampler2D uTerrainControl;
uniform vec4 uTerrainControlDomain;
uniform float uTerrainControlWeight;
out vec4 outColor;`,
    'CONTROL_FIELD_UNIFORMS'
  );
  transformed = replaceOnce(
    transformed,
`    float detailField=noise2(world*0.29+vec2(29.0,-17.0));
    float elevationMix=smoothstep(-1.0,34.0,vWorldPosition.y);`,
`    float detailField=noise2(world*0.29+vec2(29.0,-17.0));
    vec2 controlMinimum=uTerrainControlDomain.xy;
    vec2 controlMaximum=uTerrainControlDomain.zw;
    vec2 controlUv=clamp((world-controlMinimum)/max(controlMaximum-controlMinimum,vec2(0.0001)),vec2(0.001),vec2(0.999));
    vec4 controlCenter=texture(uTerrainControl,controlUv);
    vec2 downslope=controlCenter.rg*2.0-1.0;
    float downslopeMagnitude=max(length(downslope),0.0001);
    downslope/=downslopeMagnitude;
    vec2 crossSlope=vec2(-downslope.y,downslope.x);
    vec2 controlTexel=1.0/vec2(textureSize(uTerrainControl,0));
    vec4 controlForward=texture(uTerrainControl,clamp(controlUv+downslope*controlTexel*4.0,vec2(0.001),vec2(0.999)));
    vec4 controlCross=texture(uTerrainControl,clamp(controlUv+crossSlope*controlTexel*3.0,vec2(0.001),vec2(0.999)));
    float drainage=controlCenter.b;
    float landform=controlCenter.a*2.0-1.0;
    float flowDelta=controlForward.b-controlCross.b;
    float curvatureDelta=(controlForward.a-controlCross.a)*2.0;
    float alongFlow=dot(world,downslope);
    float acrossFlow=dot(world,crossSlope);
    float broadWarp=(drainage-0.5)*5.4+landform*2.2+flowDelta*4.0;
    float mesoWarp=flowDelta*6.4+curvatureDelta*2.8;
    float fineWarp=curvatureDelta*4.2+(controlCross.b-controlCenter.b)*3.4;
    float controlWeight=uTerrainControlWeight;
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
`    float strata=stableWave(world.x*0.47+world.y*0.33+vWorldPosition.y*0.79+medium*3.2+broadWarp*controlWeight);
    float crossGrain=stableWave(world.x*0.83-world.y*0.61+broad*4.8+mesoWarp*controlWeight);
    float faceBandA=stableWave(world.x*0.61+world.y*0.39+vWorldPosition.y*0.57+mesoField*4.1+mesoWarp*0.82*controlWeight);
    float faceBandB=stableWave(world.x*1.07-world.y*0.73+vWorldPosition.y*0.31+macroField*5.3+broadWarp*0.91*controlWeight);
    float faceBandC=stableWave(world.x*1.71+world.y*1.23+vWorldPosition.y*0.18+detailField*2.7+fineWarp*0.76*controlWeight);
    float crestSignal=stableWave(world.x*0.22-world.y*0.16+vWorldPosition.y*0.88+macroField*2.1+broadWarp*0.68*controlWeight);
    float terraceSignal=stableWave(world.x*0.13+world.y*0.19+vWorldPosition.y*1.18+mesoField*1.6+mesoWarp*0.74*controlWeight);`,
    'CONTROL_FIELD_PHASE_WARP'
  );
  transformed = replaceOnce(
    transformed,
`    float contourLine=contour(vWorldPosition.y);
    palette*=mix(1.0,0.56,contourLine*(0.30+0.47*slopeResponse));
    float slopeRake=stableWave(vWorldPosition.x*0.31+vWorldPosition.z*0.22+vWorldPosition.y*0.58);
    palette*=mix(0.84,1.16,slopeRake*(0.26+0.74*slopeResponse));`,
`    float contourLine=contour(vWorldPosition.y+(landform*1.4+flowDelta*1.8)*controlWeight);
    palette*=mix(1.0,0.56,contourLine*(0.30+0.47*slopeResponse));
    float slopeRake=stableWave(vWorldPosition.x*0.31+vWorldPosition.z*0.22+vWorldPosition.y*0.58+(alongFlow*0.045+acrossFlow*0.031+fineWarp*0.45)*controlWeight);
    palette*=mix(0.84,1.16,slopeRake*(0.26+0.74*slopeResponse));`,
    'CONTROL_FIELD_CONTOUR_AND_RAKE'
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
  presentationProfileId: H_EARTH_GRATITUDE_REGION_CP7E_CONTROL_FIELD_PROFILE_ID,
  presentationProfile: {
    ...receipt.presentationProfile,
    boundedControlFieldMaterialSynthesis: true,
    phaseWarpOnlyForAcceptedCp2TerrainSignals: true,
    flowAlignedBroadStructure: true,
    downslopeAlignedMesoStructure: true,
    curvatureResponsiveModulation: true,
    drainageResponsiveModulation: true,
    acceptedCp2PaletteAndAmplitudeTermsPreserved: true,
    manorCavernRavineAndContactTermsPreserved: true,
    materialModulationWeight: H_EARTH_CP7E_MATERIAL_MODULATION_WEIGHT,
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
    samplesPerTerrainFragment: H_EARTH_CP7E_CONTROL_TEXTURE_SAMPLES_PER_TERRAIN_FRAGMENT,
    materialModulationWeight: H_EARTH_CP7E_MATERIAL_MODULATION_WEIGHT,
    dynamicProceduralOctaveLoops: H_EARTH_CP7E_DYNAMIC_PROCEDURAL_OCTAVE_LOOPS,
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
  if (!gl) throw new Error('CP7E_WEBGL2_CONTEXT_UNAVAILABLE');
  const state = {
    initialized: false,
    controlTexture: null,
    geometryProgram: null,
    controlSampler: null,
    controlDomain: null,
    controlWeight: null,
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
    if (!state.controlTexture || !state.geometryProgram) throw new Error('CP7E_CONTROL_FIELD_RESOURCE_NOT_READY');
    gl.useProgram(state.geometryProgram);
    gl.activeTexture(gl.TEXTURE0 + state.textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, state.controlTexture);
    gl.uniform1i(state.controlSampler, state.textureUnit);
    const domain = state.fieldReceipt.domain;
    gl.uniform4f(state.controlDomain, domain.xMinimum, domain.zMinimum, domain.xMaximum, domain.zMaximum);
    gl.uniform1f(state.controlWeight, H_EARTH_CP7E_MATERIAL_MODULATION_WEIGHT);
    state.uniformsBound = true;
    gl.activeTexture(gl.TEXTURE0);
  };

  const initialize = (packet) => {
    if (state.initialized) throw new Error('CP7E_RENDERER_ALREADY_INITIALIZED');
    const field = getHEarthTerrainControlField();
    state.fieldReceipt = getHEarthTerrainControlFieldReceipt();
    state.controlTexture = gl.createTexture();
    if (!state.controlTexture) throw new Error('CP7E_CONTROL_TEXTURE_CREATE_FAILED');
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
    if (uploadError !== gl.NO_ERROR) throw new Error(`CP7E_CONTROL_TEXTURE_UPLOAD_ERROR:${uploadError}`);
    try {
      withShaderTransform(gl, () => acceptedRenderer.initialize(packet));
      state.geometryProgram = gl.getParameter(gl.CURRENT_PROGRAM);
      if (!state.geometryProgram) throw new Error('CP7E_GEOMETRY_PROGRAM_NOT_CURRENT');
      state.controlSampler = gl.getUniformLocation(state.geometryProgram, 'uTerrainControl');
      state.controlDomain = gl.getUniformLocation(state.geometryProgram, 'uTerrainControlDomain');
      state.controlWeight = gl.getUniformLocation(state.geometryProgram, 'uTerrainControlWeight');
      if (state.controlSampler === null || state.controlDomain === null || state.controlWeight === null) {
        throw new Error('CP7E_CONTROL_FIELD_UNIFORM_MISSING');
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
    if (!state.initialized) throw new Error('CP7E_RENDERER_NOT_INITIALIZED');
    bindControlField();
    acceptedRenderer.renderFrame(packet);
  };
  const getResourceReceipt = () => cloneReceipt(acceptedRenderer.getResourceReceipt(), state);

  return Object.freeze({
    rendererId: H_EARTH_RUN_8E_R3C_RENDERER_ID,
    presentationProfileId: H_EARTH_GRATITUDE_REGION_CP7E_CONTROL_FIELD_PROFILE_ID,
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

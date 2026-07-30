/** H_EARTH_CP5_ROUND_2_MULTISCALE_TERRAIN_CANDIDATE_v2 */
import {
  createHEarthRun8ER3CPersistentRenderer as createAcceptedCp2Renderer,
  H_EARTH_RUN_8E_R3C_RENDERER_ID
} from './persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js';

export { H_EARTH_RUN_8E_R3C_RENDERER_ID };
export const H_EARTH_GRATITUDE_REGION_CP2_ROUND2_PRESENTATION_PROFILE_ID =
  'H_EARTH_GRATITUDE_REGION_CP2_ROUND_2_MULTISCALE_NATURALISM_PROFILE_v1';
export const H_EARTH_CP5_LAWFUL_SHADER_INPUTS = Object.freeze([
  'vWorldPosition',
  'vNormal',
  'distanceToCamera',
  'fwidth'
]);

const replaceOnce = (source, before, after, label) => {
  const index = source.indexOf(before);
  if (index < 0) throw new Error(`CP5_SHADER_TRANSFORM_MARKER_MISSING:${label}`);
  if (source.indexOf(before, index + before.length) >= 0) {
    throw new Error(`CP5_SHADER_TRANSFORM_MARKER_NONUNIQUE:${label}`);
  }
  return `${source.slice(0, index)}${after}${source.slice(index + before.length)}`;
};

function transformTerrainFragmentShader(source) {
  if (!source.includes('float strata=stableWave') || !source.includes('vRoleCode==1u')) return source;
  let transformed = source;

  transformed = replaceOnce(
    transformed,
`    float strata=stableWave(world.x*0.47+world.y*0.33+vWorldPosition.y*0.79+medium*3.2);
    float crossGrain=stableWave(world.x*0.83-world.y*0.61+broad*4.8);
    float faceBandA=stableWave(world.x*0.61+world.y*0.39+vWorldPosition.y*0.57+mesoField*4.1);
    float faceBandB=stableWave(world.x*1.07-world.y*0.73+vWorldPosition.y*0.31+macroField*5.3);
    float faceBandC=stableWave(world.x*1.71+world.y*1.23+vWorldPosition.y*0.18+detailField*2.7);
    float crestSignal=stableWave(world.x*0.22-world.y*0.16+vWorldPosition.y*0.88+macroField*2.1);
    float terraceSignal=stableWave(world.x*0.13+world.y*0.19+vWorldPosition.y*1.18+mesoField*1.6);`,
`    float strata=smoothstep(0.16,0.84,clamp(medium*0.42+mesoField*0.34+macroField*0.24,0.0,1.0));
    float crossGrain=smoothstep(0.14,0.86,clamp(grain*0.48+detailField*0.32+broad*0.20,0.0,1.0));
    float faceBandA=smoothstep(0.18,0.82,clamp(mesoField*0.52+macroField*0.29+grain*0.19,0.0,1.0));
    float faceBandB=smoothstep(0.17,0.83,clamp(detailField*0.47+broad*0.31+macroField*0.22,0.0,1.0));
    float faceBandC=smoothstep(0.15,0.85,clamp(grain*0.57+detailField*0.27+mesoField*0.16,0.0,1.0));
    float crestSignal=smoothstep(0.20,0.80,clamp(macroField*0.54+mesoField*0.30+broad*0.16,0.0,1.0));
    float terraceSignal=smoothstep(0.19,0.81,clamp(mesoField*0.44+detailField*0.36+medium*0.20,0.0,1.0));`,
    'IRREGULAR_MULTISCALE_SIGNAL_SUBSTITUTION'
  );

  transformed = replaceOnce(
    transformed,
`    float contourLine=contour(vWorldPosition.y);
    palette*=mix(1.0,0.56,contourLine*(0.30+0.47*slopeResponse));
    float slopeRake=stableWave(vWorldPosition.x*0.31+vWorldPosition.z*0.22+vWorldPosition.y*0.58);
    palette*=mix(0.84,1.16,slopeRake*(0.26+0.74*slopeResponse));`,
`    float contourLine=contour(vWorldPosition.y+(macroField-0.5)*5.6+(mesoField-0.5)*2.4);
    palette*=mix(1.0,0.56,contourLine*(0.30+0.47*slopeResponse));
    float slopeRake=smoothstep(0.16,0.84,clamp(grain*0.45+detailField*0.35+mesoField*0.20,0.0,1.0));
    palette*=mix(0.84,1.16,slopeRake*(0.26+0.74*slopeResponse));`,
    'IRREGULAR_CONTOUR_AND_SLOPE_PHASE'
  );

  return transformed;
}

const cloneReceipt = (receipt) => ({
  ...receipt,
  presentationProfileId: H_EARTH_GRATITUDE_REGION_CP2_ROUND2_PRESENTATION_PROFILE_ID,
  presentationProfile: {
    ...receipt.presentationProfile,
    round2MultiscaleNaturalism: true,
    directionalRepetitionReduction: true,
    macroMesoMicroWorldSpaceVariation: true,
    slopeFlowAlignedStructure: true,
    distanceFilteredDetail: true,
    acceptedCp2ColorAndEdgeEnergyPreservedByLaw: true,
    acceptedManorAndCavernTermsPreserved: true,
    acceptedCp2RendererSourceMutated: false,
    liveDefaultSelectionMutated: false
  }
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
  if (!gl) throw new Error('CP5_ROUND2_WEBGL2_CONTEXT_UNAVAILABLE');

  const initialize = (packet) => {
    withTerrainShaderTransform(gl, () => acceptedRenderer.initialize(packet));
    return cloneReceipt(acceptedRenderer.getResourceReceipt());
  };
  const getResourceReceipt = () => cloneReceipt(acceptedRenderer.getResourceReceipt());

  return Object.freeze({
    rendererId: H_EARTH_RUN_8E_R3C_RENDERER_ID,
    presentationProfileId: H_EARTH_GRATITUDE_REGION_CP2_ROUND2_PRESENTATION_PROFILE_ID,
    initialize,
    renderFrame: acceptedRenderer.renderFrame,
    presentColorFrame: acceptedRenderer.presentColorFrame,
    captureColorFrame: acceptedRenderer.captureColorFrame,
    captureDepthSummary: acceptedRenderer.captureDepthSummary,
    getResourceReceipt
  });
}

export default createHEarthRun8ER3CPersistentRenderer;

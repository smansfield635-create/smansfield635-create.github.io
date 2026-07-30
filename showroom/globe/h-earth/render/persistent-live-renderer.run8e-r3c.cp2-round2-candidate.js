/** H_EARTH_CP5_ROUND_2_MULTISCALE_TERRAIN_CANDIDATE_v1 */
import {
  createHEarthRun8ER3CPersistentRenderer as createAcceptedCp2Renderer,
  H_EARTH_RUN_8E_R3C_RENDERER_ID
} from './persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js';

export { H_EARTH_RUN_8E_R3C_RENDERER_ID };
export const H_EARTH_GRATITUDE_REGION_CP2_ROUND2_PRESENTATION_PROFILE_ID =
  'H_EARTH_GRATITUDE_REGION_CP2_ROUND_2_MULTISCALE_NATURALISM_PROFILE_v1';

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
`float stableWave(float phase){
  float footprint=max(fwidth(phase),0.00001);
  float retained=1.0-smoothstep(0.72,1.65,footprint);
  return mix(0.5,0.5+0.5*sin(phase),retained);
}`,
`float stableWave(float phase){
  float footprint=max(fwidth(phase),0.00001);
  float retained=1.0-smoothstep(0.72,1.65,footprint);
  return mix(0.5,0.5+0.5*sin(phase),retained);
}
float fbm2(vec2 p){
  float value=0.0;
  float amplitude=0.5333333;
  mat2 turn=mat2(0.80,-0.60,0.60,0.80);
  for(int octave=0;octave<4;octave++){
    value+=amplitude*noise2(p);
    p=turn*p*2.03+vec2(11.7,-7.3);
    amplitude*=0.5;
  }
  return clamp(value,0.0,1.0);
}
float ridge2(vec2 p){
  return 1.0-abs(fbm2(p)*2.0-1.0);
}`,
    'MULTISCALE_FUNCTIONS'
  );

  transformed = replaceOnce(
    transformed,
`    float detailField=noise2(world*0.29+vec2(29.0,-17.0));
    float elevationMix=smoothstep(-1.0,34.0,vWorldPosition.y);`,
`    float detailField=noise2(world*0.29+vec2(29.0,-17.0));
    vec2 contourDirection=normalize(vec2(n.z,-n.x)+vec2(0.001,0.002));
    vec2 fallDirection=vec2(-contourDirection.y,contourDirection.x);
    vec2 flowCoordinates=vec2(dot(world,contourDirection),dot(world,fallDirection));
    float macroNatural=fbm2(world*0.021+vec2(3.1,-8.7));
    float mesoNatural=fbm2(world*0.071+vec2(-17.2,6.4));
    float microNatural=fbm2(world*0.245+vec2(31.4,-19.8));
    float flowNatural=fbm2(flowCoordinates*vec2(0.082,0.137)+vec2(vWorldPosition.y*0.031,-vWorldPosition.y*0.018));
    float ridgeNatural=ridge2(flowCoordinates*vec2(0.047,0.093)+vec2(5.2,-13.6));
    float elevationMix=smoothstep(-1.0,34.0,vWorldPosition.y);`,
    'LAWFUL_MULTISCALE_INPUTS'
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
`    float strata=mix(fbm2(flowCoordinates*vec2(0.055,0.092)+vec2(macroNatural*2.3,mesoNatural*1.7)),stableWave(world.x*0.31+world.y*0.19+vWorldPosition.y*0.54+medium*5.1),0.28);
    float crossGrain=mix(fbm2(flowCoordinates.yx*vec2(0.091,0.061)+vec2(broad*3.4,-macroNatural*2.1)),stableWave(world.x*0.49-world.y*0.37+broad*5.7),0.24);
    float faceBandA=mix(mesoNatural,stableWave(world.x*0.37+world.y*0.23+vWorldPosition.y*0.41+mesoField*6.3),0.30);
    float faceBandB=mix(flowNatural,stableWave(world.x*0.59-world.y*0.41+vWorldPosition.y*0.25+macroField*7.1),0.27);
    float faceBandC=mix(microNatural,stableWave(world.x*0.93+world.y*0.71+vWorldPosition.y*0.14+detailField*4.4),0.22);
    float crestSignal=mix(ridgeNatural,stableWave(world.x*0.16-world.y*0.11+vWorldPosition.y*0.63+macroNatural*4.7),0.26);
    float terraceSignal=mix(flowNatural,stableWave(world.x*0.09+world.y*0.13+vWorldPosition.y*0.81+mesoNatural*3.8),0.22);`,
    'ANTI_REPETITION_SIGNAL_LAW'
  );

  transformed = replaceOnce(
    transformed,
`    float directionalBreak=mix(faceBandA,faceBandB,0.35+0.45*slopeResponse);
    float fineBreak=mix(0.5,faceBandC,nearDetail);

    palette*=0.62+0.46*broad+0.24*medium+0.14*grain;
    palette*=mix(0.70,1.30,strata*0.68+crossGrain*0.32);
    palette*=mix(0.71,1.34,faceBreak);
    palette*=mix(0.86,1.15,directionalBreak);
    palette*=mix(0.93,1.08,fineBreak);`,
`    float directionalBreak=mix(faceBandA,faceBandB,0.35+0.45*slopeResponse);
    float fineBreak=mix(0.5,faceBandC,nearDetail);
    float naturalComposite=clamp(macroNatural*0.34+mesoNatural*0.31+microNatural*0.15+flowNatural*0.12+ridgeNatural*0.08,0.0,1.0);

    palette*=0.66+0.38*broad+0.20*medium+0.10*grain;
    palette*=mix(0.82,1.18,strata*0.58+crossGrain*0.42);
    palette*=mix(0.76,1.27,faceBreak);
    palette*=mix(0.91,1.10,directionalBreak);
    palette*=mix(0.95,1.06,fineBreak);
    palette*=mix(0.76,1.25,naturalComposite);`,
    'MULTISCALE_COLOR_ENERGY'
  );

  transformed = replaceOnce(
    transformed,
`    float contourLine=contour(vWorldPosition.y);
    palette*=mix(1.0,0.56,contourLine*(0.30+0.47*slopeResponse));
    float slopeRake=stableWave(vWorldPosition.x*0.31+vWorldPosition.z*0.22+vWorldPosition.y*0.58);
    palette*=mix(0.84,1.16,slopeRake*(0.26+0.74*slopeResponse));`,
`    float contourLine=contour(vWorldPosition.y);
    palette*=mix(1.0,0.78,contourLine*(0.18+0.30*slopeResponse));
    float slopeRake=mix(flowNatural,ridgeNatural,0.35+0.40*slopeResponse);
    palette*=mix(0.91,1.10,slopeRake*(0.22+0.66*slopeResponse));`,
    'PERIODIC_BAND_REDUCTION'
  );

  transformed = replaceOnce(
    transformed,
`    palette=mix(palette,palette*vec3(0.79,0.85,0.88),curvatureResponse*(0.18+0.26*slopeResponse));`,
`    palette=mix(palette,palette*vec3(0.79,0.85,0.88),curvatureResponse*(0.18+0.26*slopeResponse));
    palette+=vec3(0.025,0.018,0.010)*(flowNatural-0.5)*(0.35+0.65*slopeResponse);
    palette+=vec3(-0.012,0.014,0.020)*(ridgeNatural-0.5)*(0.24+0.44*curvatureResponse);`,
    'SLOPE_FLOW_CHROMATIC_STRUCTURE'
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

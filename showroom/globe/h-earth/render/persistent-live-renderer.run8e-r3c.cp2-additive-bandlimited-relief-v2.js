/**
 * H_EARTH_OW04_SUBTROPICAL_LIVE_PRESENTATION_ADAPTER_v1
 *
 * Bounded presentation repair over the accepted additive terrain-relief
 * renderer. It changes no geometry, camera law, navigation law, admission,
 * draw topology, depth authority or resource lifecycle. It intercepts only the
 * terrain fragment shader source during renderer construction so the inherited
 * barren brown/gray palette reads as a warm humid coastal landscape while
 * retaining exposed soil and rock where slope/elevation justify them.
 */
import {
  createHEarthRun8ER3CPersistentRenderer as createAcceptedRenderer,
  H_EARTH_RUN_8E_R3C_RENDERER_ID
} from './persistent-live-renderer.run8e-r3c.ow04-base.js';

export { H_EARTH_RUN_8E_R3C_RENDERER_ID };

export const H_EARTH_OW04_SUBTROPICAL_PRESENTATION_PROFILE_ID =
  'H_EARTH_OW04_WARM_SUBTROPICAL_COASTAL_LIVE_PRESENTATION_v1';

const substitutions = Object.freeze([
  [
    'vec3 lowland=vec3(0.29,0.27,0.19);',
    'vec3 lowland=vec3(0.20,0.31,0.17);'
  ],
  [
    'vec3 upland=vec3(0.34,0.36,0.31);',
    'vec3 upland=vec3(0.24,0.34,0.20);'
  ],
  [
    'vec3 rock=vec3(0.25,0.27,0.26);',
    'vec3 rock=vec3(0.31,0.30,0.25);'
  ],
  [
    'palette=mix(palette,base,0.27);',
    'palette=mix(palette,base,0.16); palette=mix(palette,vec3(0.29,0.40,0.22),clamp((1.0-slope)*0.20+nearDetail*0.07,0.0,0.24));'
  ]
]);

function renewTerrainPresentation(source) {
  let renewed = source;
  let replacementCount = 0;
  for (const [before, after] of substitutions) {
    if (renewed.includes(before)) {
      renewed = renewed.replace(before, after);
      replacementCount += 1;
    }
  }
  return { source: renewed, replacementCount };
}

export function createHEarthRun8ER3CPersistentRenderer(options = {}) {
  const canvas = options.canvas;
  if (!(canvas instanceof HTMLCanvasElement)) {
    return createAcceptedRenderer(options);
  }

  const gl = canvas.getContext('webgl2');
  if (!gl) return createAcceptedRenderer(options);

  const originalShaderSource = gl.shaderSource.bind(gl);
  let totalReplacementCount = 0;
  gl.shaderSource = (shader, source) => {
    if (typeof source === 'string' && source.includes('vec3 lowland=vec3(0.29,0.27,0.19);')) {
      const renewed = renewTerrainPresentation(source);
      source = renewed.source;
      totalReplacementCount += renewed.replacementCount;
    }
    return originalShaderSource(shader, source);
  };

  try {
    const renderer = createAcceptedRenderer(options);
    Object.defineProperty(renderer, 'ow04PresentationProfile', {
      value: Object.freeze({
        profileId: H_EARTH_OW04_SUBTROPICAL_PRESENTATION_PROFILE_ID,
        shaderReplacementCount: totalReplacementCount,
        geometryMutated: false,
        cameraLawMutated: false,
        navigationLawMutated: false
      }),
      enumerable: true
    });
    return renderer;
  } finally {
    gl.shaderSource = originalShaderSource;
  }
}

export default createHEarthRun8ER3CPersistentRenderer;

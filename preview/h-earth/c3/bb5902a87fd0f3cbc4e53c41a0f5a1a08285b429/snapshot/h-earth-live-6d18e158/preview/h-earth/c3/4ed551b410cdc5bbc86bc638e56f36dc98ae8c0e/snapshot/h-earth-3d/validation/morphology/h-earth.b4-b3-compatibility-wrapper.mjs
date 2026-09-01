import {
  buildHEarthB3TwoFixedMorphologyProbes as buildOriginal
} from '../../analysis/morphology/h-earth.b3-two-fixed-morphology-probes.v1.mjs?b4-original';

export function buildHEarthB3TwoFixedMorphologyProbes(authority, b2Authority) {
  const result = buildOriginal(authority, b2Authority);
  return Object.freeze({
    ...result,
    baseline: Object.freeze({ heights: result.sourceHeights })
  });
}

export default buildHEarthB3TwoFixedMorphologyProbes;

import { createMapWideEnvironmentRenderer } from '../../showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs';

export const COMPASS_MASTER_AUDRALIA_SOURCE_ID = 'COMPASS_SINGLE_MASTER_AUDRALIA_SOURCE_v1';
export const COMPASS_MASTER_AUDRALIA_BINDING = Object.freeze({
  renderer: Object.freeze({
    path: 'showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs',
    blob: '872d20b17bb0cd89d9613ca0262b25350890a617',
    role: 'AUTHORITATIVE_MAP_WIDE_AUDRALIA_ENVIRONMENT_RENDERER'
  }),
  destinationApplicationDependency: false,
  sourceMode: 'DIRECT_RENDERER_COMPONENT'
});

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const mix = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a || 1));
  return t * t * (3 - 2 * t);
};

export function createAudraliaMasterDonor(canvas) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new TypeError('AUDRALIA_MASTER_CANVAS_REQUIRED');
  const world = createMapWideEnvironmentRenderer(canvas);
  world.planetaryVantage();
  return Object.freeze({
    id: COMPASS_MASTER_AUDRALIA_SOURCE_ID,
    binding: COMPASS_MASTER_AUDRALIA_BINDING,
    render(progress = 0) {
      const p = clamp(progress);
      const settle = smooth(.08, .76, p);
      const state = world.state;
      state.distance = mix(4300, 1380, settle);
      state.pitch = mix(1.00, .865, settle);
      state.yaw = mix(-.58, -.285, settle);
      state.targetU = mix(-.35, .10, settle);
      state.targetV = mix(-3.2, -4.5, settle);
      world.render();
      return Object.freeze({
        sourceId: COMPASS_MASTER_AUDRALIA_SOURCE_ID,
        destinationApplicationDependency: false,
        progress: p,
        camera: Object.freeze({
          distance: state.distance,
          pitch: state.pitch,
          yaw: state.yaw,
          targetU: state.targetU,
          targetV: state.targetV
        })
      });
    },
    dispose() {
      world.dispose?.();
    }
  });
}

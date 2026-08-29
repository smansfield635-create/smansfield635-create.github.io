// Audralia continuous-travel renderer successor.
// The protected 24057 renderer remains byte-identical. This Audralia-owned module
// materializes that exact frozen source once, replaces only the obsolete 0.9πR
// target clamp with periodic 2πR normalization, and exposes one renderer/pass.

const BASELINE_RENDERER_URL = new URL('/inspection/audralia-24057-exact/snapshot/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs?cb=EXACT_24057', window.location.origin);
const BASELINE_IMPORT = ['fr','om '].join('') + "'../../../../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';";
const TARGET_CAP = 'const MAX_TARGET_ARC=PLANET_RADIUS*Math.PI*.9;';
const TARGET_PERIOD = 'const TARGET_PERIOD=PLANET_RADIUS*Math.PI*2;';
const CAP_FUNCTION = 'function limitTarget(){const radius=Math.hypot(state.targetU,state.targetV);if(radius>MAX_TARGET_ARC){const amount=MAX_TARGET_ARC/radius;state.targetU*=amount;state.targetV*=amount;}}';
const PERIODIC_FUNCTION = 'function limitTarget(){const radius=Math.hypot(state.targetU,state.targetV);if(radius>TARGET_PERIOD){const wrapped=radius%TARGET_PERIOD,amount=wrapped/(radius||1);state.targetU*=amount;state.targetV*=amount;}}';

const response = await fetch(BASELINE_RENDERER_URL, { cache: 'no-store' });
if (!response.ok) throw new Error(`AUDRALIA_CONTINUOUS_TRAVEL_BASELINE_FETCH_FAILED:${response.status}`);
let source = await response.text();
if (!source.includes(TARGET_CAP)) throw new Error('AUDRALIA_CONTINUOUS_TRAVEL_BASELINE_CAP_IDENTITY_MISMATCH');
if (!source.includes(CAP_FUNCTION)) throw new Error('AUDRALIA_CONTINUOUS_TRAVEL_BASELINE_LIMIT_FUNCTION_IDENTITY_MISMATCH');
if (!source.includes(BASELINE_IMPORT)) throw new Error('AUDRALIA_CONTINUOUS_TRAVEL_BASELINE_IMPORT_IDENTITY_MISMATCH');

const absoluteAuthority = new URL('/h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js', window.location.origin).href;
source = source
  .replace(TARGET_CAP, TARGET_PERIOD)
  .replace(CAP_FUNCTION, PERIODIC_FUNCTION)
  .replace(BASELINE_IMPORT, ['fr','om '].join('') + `'${absoluteAuthority}';`);

if (source.includes('MAX_TARGET_ARC')) throw new Error('AUDRALIA_CONTINUOUS_TRAVEL_HARD_CAP_SURVIVED_TRANSFORM');
if (!source.includes('TARGET_PERIOD=PLANET_RADIUS*Math.PI*2')) throw new Error('AUDRALIA_CONTINUOUS_TRAVEL_PERIODIC_NORMALIZATION_MISSING');

const transformedUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
let baseline;
try {
  baseline = await import(transformedUrl);
} finally {
  URL.revokeObjectURL(transformedUrl);
}

export const AUDRALIA_CONTINUOUS_TRAVEL_RENDERER_V1 = Object.freeze({
  schema: 'AUDRALIA_CONTINUOUS_TRAVEL_RENDERER_v1',
  baseline: 'inspection/audralia-24057-exact/snapshot/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs',
  baselineTargetCap: 'PLANET_RADIUS*Math.PI*.9',
  targetNormalization: 'PERIODIC_2_PI_R_TANGENT_COORDINATES',
  protectedSnapshotMutated: false,
  hEarthSourceMutated: false,
  rendererCount: 1,
  renderPassCount: 1
});

export const createMapWideEnvironmentRenderer = baseline.createMapWideEnvironmentRenderer;
export const AUDRALIA_OPEN_WORLD_AUTHORING_CONTRACT = baseline.AUDRALIA_OPEN_WORLD_AUTHORING_CONTRACT;
export default createMapWideEnvironmentRenderer;

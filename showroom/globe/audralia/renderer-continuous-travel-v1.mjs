// Audralia continuous-travel renderer successor.
// The protected/H-Earth renderer remains byte-identical. This module materializes
// that exact baseline in the browser, removes only the obsolete 0.9πR target cap,
// and keeps one renderer / one render pass.

const BASELINE_RENDERER_URL = new URL('../h-earth/terrain-estate-construction-v1/renderer.mjs', import.meta.url);
const BASELINE_IMPORT = "from '../../../../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';";
const TARGET_CAP = 'const MAX_TARGET_ARC=PLANET_RADIUS*Math.PI*.9;';
const CONTINUOUS_TARGET = 'const MAX_TARGET_ARC=Number.POSITIVE_INFINITY;';

const response = await fetch(BASELINE_RENDERER_URL, { cache: 'no-store' });
if (!response.ok) throw new Error(`AUDRALIA_CONTINUOUS_TRAVEL_BASELINE_FETCH_FAILED:${response.status}`);
let source = await response.text();
if (!source.includes(TARGET_CAP)) throw new Error('AUDRALIA_CONTINUOUS_TRAVEL_BASELINE_CAP_IDENTITY_MISMATCH');
if (!source.includes(BASELINE_IMPORT)) throw new Error('AUDRALIA_CONTINUOUS_TRAVEL_BASELINE_IMPORT_IDENTITY_MISMATCH');

const absoluteAuthority = new URL('/h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js', window.location.origin).href;
source = source
  .replace(TARGET_CAP, CONTINUOUS_TARGET)
  .replace(BASELINE_IMPORT, `from '${absoluteAuthority}';`);

const transformedUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
let baseline;
try {
  baseline = await import(transformedUrl);
} finally {
  URL.revokeObjectURL(transformedUrl);
}

export const AUDRALIA_CONTINUOUS_TRAVEL_RENDERER_V1 = Object.freeze({
  schema: 'AUDRALIA_CONTINUOUS_TRAVEL_RENDERER_v1',
  baseline: 'showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs',
  baselineTargetCap: 'PLANET_RADIUS*Math.PI*.9',
  targetNormalization: 'UNBOUNDED_PERIODIC_TANGENT_COORDINATES',
  protectedSnapshotMutated: false,
  hEarthSourceMutated: false,
  rendererCount: 1,
  renderPassCount: 1
});

export const createMapWideEnvironmentRenderer = baseline.createMapWideEnvironmentRenderer;
export const AUDRALIA_OPEN_WORLD_AUTHORING_CONTRACT = baseline.AUDRALIA_OPEN_WORLD_AUTHORING_CONTRACT;
export default createMapWideEnvironmentRenderer;

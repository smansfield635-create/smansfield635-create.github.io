import { createCinematicRenderer as createAcceptedPrimaryRenderer } from '../compass.orientation-cinematic.render.js';
import { createFinalCinematicRenderer as createAcceptedFinalRenderer } from '../compass.orientation-cinematic.final.js';
import { createMirrorlandMasterDonor } from './mirrorland-source.mjs';
import { createAudraliaMasterDonor } from './audralia-source.mjs';
import { createBrainMasterPresentation } from './brain-presentation.mjs';
import { createTrophyMasterPresentation } from './trophy-presentation.mjs';
import { createHouseMasterPresentation } from './house-presentation.mjs';
import { resolveMasterContext } from './context-choreography.mjs';

export const COMPASS_SINGLE_MASTER_SOURCE_ID = 'COMPASS_SINGLE_MASTER_CAPTURE_READY_SOURCE_v1';
export const COMPASS_SINGLE_MASTER_DURATION_MS = 38000;
export const COMPASS_SINGLE_MASTER_SOUNDTRACK = 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Saint-Saens_-_The_Carnival_of_the_Animals_-_07_Aquarium.ogg';

export const COMPASS_SINGLE_MASTER_SHOTS = Object.freeze([
  Object.freeze({ id: 'S01', beat: 'Arrival', startMs: 0, endMs: 4500 }),
  Object.freeze({ id: 'S02', beat: 'Orientation', startMs: 4500, endMs: 9500 }),
  Object.freeze({ id: 'S03', beat: 'Chapter One', startMs: 9500, endMs: 14500 }),
  Object.freeze({ id: 'S04', beat: 'Choice / Readiness', startMs: 14500, endMs: 19500 }),
  Object.freeze({ id: 'S05', beat: 'Threshold', startMs: 19500, endMs: 25500 }),
  Object.freeze({ id: 'S06', beat: 'Elsewhere', startMs: 25500, endMs: 30500 }),
  Object.freeze({ id: 'S07', beat: 'Breadth / Engagement', startMs: 30500, endMs: 34000 }),
  Object.freeze({ id: 'S08', beat: 'Return / Handoff', startMs: 34000, endMs: 38000 })
]);

export const COMPASS_SINGLE_MASTER_BINDING = Object.freeze({
  acceptedFloor: '97059f58f6bd437d3204b388e3886033df6f1334',
  constructionBase: 'db6589484f25d7af324ea97cff1fda63cbfd8865',
  acceptedPrimaryRenderer: Object.freeze({ path: 'assets/compass/compass.orientation-cinematic.render.js', blob: 'fe05813cf1d43817e789ce790435c84a5970b2d7', use: 'S01_S04_ACCEPTED_CINEMATOGRAPHY' }),
  acceptedFinalRenderer: Object.freeze({ path: 'assets/compass/compass.orientation-cinematic.final.js', blob: '1af6d8dc0e1cfc8ae7f6e46b962db2629881fbff', use: 'S08_ACCEPTED_COMPASS_RETURN' }),
  correctedBeats: Object.freeze(['S05_MIRRORLAND', 'S06_AUDRALIA', 'S07_BRAIN', 'S07_TROPHY', 'S07_HOUSE', 'S01_S08_CONTEXT']),
  destinationApplicationsImported: false,
  secondMasterClock: false,
  protectedRuntimeMutation: false
});

const MEDIA = Object.freeze({ schema: 'COMPASS_MAIN_HOMEPAGE_CINEMATIC_MEDIA_MANIFEST_v1' });
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a || 1)); return t * t * (3 - 2 * t); };
const DEFAULT_IDENTITY = Object.freeze({
  mode: 'CONSTELLATION',
  renderedForegroundCardinal: 'north',
  readableCardinal: 'north',
  selectedCardinal: null,
  selectedRoom: null,
  activeClusterWing: null,
  orbitQuaternion: null,
  clusterQuaternion: null,
  crystalsReceipt: null
});

const STYLE = `
[data-compass-single-master]{position:absolute;inset:0;overflow:hidden;isolation:isolate;background:#02070b;color:#f7f1df;font-family:Inter,ui-sans-serif,system-ui,sans-serif}
[data-compass-single-master] .master-replacement{position:absolute;inset:0;z-index:7;opacity:0;pointer-events:none;background:#02070b;overflow:hidden}
[data-compass-single-master] .master-replacement>canvas{display:block;width:100%;height:100%}
[data-compass-single-master] .master-s07{background:radial-gradient(ellipse at 50% 48%,rgba(87,157,174,.10),transparent 44%),radial-gradient(ellipse at 50% 52%,rgba(235,190,91,.055),transparent 60%),#02070b}
[data-compass-single-master] .master-s07__object{position:absolute;left:50%;top:50%;width:min(80vw,42rem);height:min(68vh,33rem);transform:translate(-50%,-50%);opacity:0;will-change:opacity,transform}
[data-compass-single-master] .master-s07__object canvas{display:block;width:100%;height:100%;background:transparent;border:0;box-shadow:none}
[data-compass-single-master] .master-context{position:absolute;z-index:20;width:min(38rem,42vw);opacity:0;pointer-events:none;text-shadow:0 3px 24px rgba(0,0,0,.84);will-change:opacity,transform}
[data-compass-single-master] .master-context__eyebrow{margin:0 0 .52rem;color:rgba(244,214,128,.74);font:850 .67rem/1.2 Inter,ui-sans-serif,system-ui,sans-serif;letter-spacing:.15em;text-transform:uppercase}
[data-compass-single-master] .master-context__primary{margin:0;color:rgba(255,247,220,.98);font:500 clamp(2rem,4.8vw,4.5rem)/.91 Georgia,"Times New Roman",serif;letter-spacing:-.045em}
[data-compass-single-master] .master-context__secondary{margin:.65rem 0 0;max-width:31rem;color:rgba(226,236,234,.78);font:760 clamp(.78rem,1.22vw,.96rem)/1.45 Inter,ui-sans-serif,system-ui,sans-serif}
[data-compass-single-master] .master-context[data-placement="left-low"]{left:7vw;bottom:10vh;text-align:left}
[data-compass-single-master] .master-context[data-placement="left-high"]{left:7vw;top:13vh;text-align:left}
[data-compass-single-master] .master-context[data-placement="left-mid"]{left:7vw;top:28vh;text-align:left}
[data-compass-single-master] .master-context[data-placement="right-high"]{right:7vw;top:13vh;text-align:right}
[data-compass-single-master] .master-context[data-placement="right-mid"]{right:7vw;top:28vh;text-align:right}
[data-compass-single-master] .master-context[data-placement^="right-"] .master-context__secondary{margin-left:auto}
[data-compass-single-master] .master-context[data-placement="center-low"]{left:50%;bottom:10vh;transform:translateX(-50%);text-align:center;width:min(46rem,80vw)}
[data-compass-single-master] .master-context[data-placement="center-low"] .master-context__secondary{margin-left:auto;margin-right:auto}
@media(max-width:700px){[data-compass-single-master] .master-s07__object{width:90vw;height:62vh}[data-compass-single-master] .master-context{width:82vw}[data-compass-single-master] .master-context__primary{font-size:clamp(1.8rem,7vw,3.2rem)}[data-compass-single-master] .master-context[data-placement="left-low"]{left:7vw;bottom:11vh}[data-compass-single-master] .master-context[data-placement="left-mid"],[data-compass-single-master] .master-context[data-placement="left-high"]{left:7vw;top:18vh}[data-compass-single-master] .master-context[data-placement="right-mid"],[data-compass-single-master] .master-context[data-placement="right-high"]{right:7vw;top:18vh}}
`;

function loadClassicScript(path, globalName) {
  if (globalThis[globalName]) return Promise.resolve(globalThis[globalName]);
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = path;
    script.dataset.compassSingleMasterBootstrap = globalName;
    script.onload = () => globalThis[globalName] ? resolve(globalThis[globalName]) : reject(new Error(`${globalName}_API_MISSING`));
    script.onerror = () => reject(new Error(`${globalName}_LOAD_FAILURE`));
    document.head.append(script);
  });
}

function currentShot(elapsedMs) {
  const t = clamp(Number(elapsedMs) || 0, 0, COMPASS_SINGLE_MASTER_DURATION_MS);
  return COMPASS_SINGLE_MASTER_SHOTS.find((shot) => t >= shot.startMs && t < shot.endMs) || COMPASS_SINGLE_MASTER_SHOTS.at(-1);
}
function shotProgress(shot, elapsedMs) { return clamp((elapsedMs - shot.startMs) / (shot.endMs - shot.startMs)); }
function make(tag, className = '') { const node = document.createElement(tag); if (className) node.className = className; return node; }

export async function createCompassSingleMasterSource({ stage, liveIdentity = DEFAULT_IDENTITY } = {}) {
  if (!(stage instanceof HTMLElement)) throw new TypeError('COMPASS_SINGLE_MASTER_STAGE_REQUIRED');
  const root = make('div');
  root.dataset.compassSingleMaster = COMPASS_SINGLE_MASTER_SOURCE_ID;
  root.dataset.captureReady = 'false';
  const style = make('style'); style.textContent = STYLE; root.append(style);
  stage.append(root);

  const acceptedPrimary = createAcceptedPrimaryRenderer({ stage: root, media: MEDIA });
  const acceptedFinal = createAcceptedFinalRenderer({ stage: root, media: MEDIA });
  const primaryRoot = acceptedPrimary.mount();
  const finalRoot = acceptedFinal.mount();

  const mirrorLayer = make('section', 'master-replacement master-s05');
  const mirrorCanvas = make('canvas'); mirrorLayer.append(mirrorCanvas);
  const audraliaLayer = make('section', 'master-replacement master-s06');
  const audraliaCanvas = make('canvas'); audraliaLayer.append(audraliaCanvas);
  const s07Layer = make('section', 'master-replacement master-s07');
  const brainObject = make('div', 'master-s07__object'); brainObject.dataset.kind = 'brain';
  const trophyObject = make('div', 'master-s07__object'); trophyObject.dataset.kind = 'trophy';
  const houseObject = make('div', 'master-s07__object'); houseObject.dataset.kind = 'house';
  const brainCanvas = make('canvas'); const trophyCanvas = make('canvas'); const houseCanvas = make('canvas');
  brainObject.append(brainCanvas); trophyObject.append(trophyCanvas); houseObject.append(houseCanvas); s07Layer.append(brainObject, trophyObject, houseObject);
  const context = make('div', 'master-context');
  context.innerHTML = '<p class="master-context__eyebrow"></p><h2 class="master-context__primary"></h2><p class="master-context__secondary"></p>';
  root.append(mirrorLayer, audraliaLayer, s07Layer, context);

  let mirror = null, audralia = null, brain = null, trophy = null, house = null, prepared = false, disposed = false;

  async function prepare() {
    if (prepared) return true;
    await loadClassicScript('/assets/shared/mirrorland-window.geometry.js', 'DGB_MIRRORLAND_WINDOW_GEOMETRY');
    mirror = createMirrorlandMasterDonor(mirrorCanvas);
    audralia = createAudraliaMasterDonor(audraliaCanvas);
    brain = await createBrainMasterPresentation(brainCanvas);
    trophy = await createTrophyMasterPresentation(trophyCanvas);
    house = await createHouseMasterPresentation(houseCanvas);
    prepared = true;
    root.dataset.captureReady = 'true';
    root.dataset.sourceBindings = 'S05_DIRECT_MIRRORLAND;S06_DIRECT_AUDRALIA;S07_PRESERVED_BRAIN_TROPHY_PHASE3_HOUSE;CONTEXT_SINGLE_CLOCK';
    return true;
  }

  function renderContext(frame) {
    const resolved = resolveMasterContext({
      shotId: frame.shot.id,
      elapsedMs: frame.elapsedMs,
      shotProgress: frame.shotProgress,
      viewportWidth: stage.getBoundingClientRect().width || innerWidth || 1280
    });
    if (!resolved) { context.style.opacity = '0'; return; }
    context.dataset.placement = resolved.placement;
    context.querySelector('.master-context__eyebrow').textContent = `${frame.shot.id.slice(1)} / ${String(frame.shot.beat).toUpperCase()}`;
    context.querySelector('.master-context__primary').textContent = resolved.primary;
    context.querySelector('.master-context__secondary').textContent = resolved.secondary;
    let alpha = smooth(.08, .20, frame.shotProgress) * (1 - smooth(.84, .97, frame.shotProgress));
    if (frame.shot.id === 'S07') {
      for (const boundary of [31500, 32750]) alpha *= smooth(0, 190, Math.abs(frame.elapsedMs - boundary));
    }
    if (frame.shot.id === 'S04') alpha *= smooth(0, .055, Math.abs(frame.shotProgress - .52));
    context.style.opacity = String(alpha);
    if (resolved.placement !== 'center-low') context.style.transform = `translate3d(0,${(12 - 14 * smooth(.08, .55, frame.shotProgress)).toFixed(2)}px,0)`;
  }

  function renderS07(elapsedMs) {
    const brainWeight = 1 - smooth(31200, 31550, elapsedMs);
    const trophyWeight = smooth(31200, 31550, elapsedMs) * (1 - smooth(32550, 32850, elapsedMs));
    const houseWeight = smooth(32550, 32850, elapsedMs);
    const weights = { brain: brainWeight, trophy: trophyWeight, house: houseWeight };
    for (const object of [brainObject, trophyObject, houseObject]) {
      const weight = weights[object.dataset.kind];
      object.style.opacity = String(weight);
      const offset = object.dataset.kind === 'brain' ? -7 : object.dataset.kind === 'house' ? 7 : 0;
      object.style.transform = `translate(-50%,-50%) translateX(${offset * (1 - weight)}%) scale(${(.96 + .04 * weight).toFixed(4)})`;
    }
    if (brainWeight > 0) brain?.capture?.();
    if (trophyWeight > 0) trophy?.capture?.();
    if (houseWeight > 0) house?.draw?.();
  }

  function renderAt(elapsedMs, { identity = liveIdentity } = {}) {
    if (!prepared) throw new Error('COMPASS_SINGLE_MASTER_NOT_PREPARED');
    if (disposed) throw new Error('COMPASS_SINGLE_MASTER_DISPOSED');
    const t = clamp(Number(elapsedMs) || 0, 0, COMPASS_SINGLE_MASTER_DURATION_MS - .001);
    const shot = currentShot(t);
    const frame = Object.freeze({ elapsedMs: t, shot, shotProgress: shotProgress(shot, t), liveIdentity: identity || DEFAULT_IDENTITY });
    const primaryVisible = ['S01', 'S02', 'S03', 'S04'].includes(shot.id);
    primaryRoot.style.opacity = primaryVisible ? '1' : '0';
    finalRoot.style.opacity = shot.id === 'S08' ? '1' : '0';
    mirrorLayer.style.opacity = shot.id === 'S05' ? '1' : '0';
    audraliaLayer.style.opacity = shot.id === 'S06' ? '1' : '0';
    s07Layer.style.opacity = shot.id === 'S07' ? '1' : '0';
    if (primaryVisible) acceptedPrimary.renderFrame(frame);
    if (shot.id === 'S05') mirror.render(frame.shotProgress);
    if (shot.id === 'S06') audralia.render(frame.shotProgress);
    if (shot.id === 'S07') renderS07(t);
    if (shot.id === 'S08') acceptedFinal.renderFrame(frame);
    renderContext(frame);
    root.dataset.shotId = shot.id;
    root.dataset.elapsedMs = String(Math.round(t));
    return frame;
  }

  function inspect() {
    return Object.freeze({
      id: COMPASS_SINGLE_MASTER_SOURCE_ID,
      prepared,
      disposed,
      durationMs: COMPASS_SINGLE_MASTER_DURATION_MS,
      shotCount: COMPASS_SINGLE_MASTER_SHOTS.length,
      captureReady: root.dataset.captureReady === 'true',
      binding: COMPASS_SINGLE_MASTER_BINDING,
      mirrorland: mirror?.binding || null,
      audralia: audralia?.binding || null,
      brain: brain?.binding || null,
      trophy: trophy?.binding || null,
      house: house?.binding || null
    });
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    acceptedPrimary.dispose?.();
    acceptedFinal.dispose?.();
    audralia?.dispose?.();
    root.remove();
  }

  return Object.freeze({ id: COMPASS_SINGLE_MASTER_SOURCE_ID, root, prepare, renderAt, inspect, dispose });
}

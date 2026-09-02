/** Task 20 autonomous primer and separate scene-entry paths. Pure construction only. */
import {
  GRATITUDE_GEOGRAPHY_ADAPTER_ID,
  resolveCameraSiteAnchor,
  resolveSiteAnchor,
  sampleGratitudeWorld
} from './gratitude-geography.adapter.mjs';
import {
  CARDINAL_SCENE_STATE_VERSION,
  CARDINAL_SITE_IDS,
  createCanonicalCardinalWorldEntry
} from './cardinal-scene-state.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.freeze(value);
};
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const mix = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const interpolateVector = (a, b, t) => deepFreeze({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), z: mix(a.z, b.z, t) });
const vectorNear = (a, b, tolerance = 1e-7) => Math.abs(a.x - b.x) <= tolerance && Math.abs(a.y - b.y) <= tolerance && Math.abs(a.z - b.z) <= tolerance;

export const CINEMATIC_INTRO_CONTRACT_ID = 'CHARACTERS_TASK20_AUTONOMOUS_CINEMATIC_PRIMER_v1';
export const STANDARD_SURVEY_PATH_CONTRACT_ID = 'CHARACTERS_TASK20_SEPARATE_SCENE_ENTRY_PATHS_v1';
export const CINEMATIC_RUNTIME_MS = 28000;
export const CINEMATIC_INTRO_BEAT_IDS = deepFreeze([
  'ONE_WAY_CROSSING',
  'AUDRALIA_GLOBE',
  'DESCENT_TO_GRATITUDE_COAST',
  'MIRROR_MANOR_AND_CLOCK',
  'FOUR_CHARACTER_ENVIRONMENT_FLASHES',
  'SETTLE_TO_SURVEY_HUB'
]);
export const CINEMATIC_INTRO_PHASES = deepFreeze(['READY', ...CINEMATIC_INTRO_BEAT_IDS, 'COMPLETE', 'SKIPPED']);
export const SURVEY_PATH_STAGE_IDS = deepFreeze(['SCENE_CUT', 'ENVIRONMENT_REVEAL', 'ARRIVAL_WITNESS']);

export const CINEMATIC_SOURCE_BINDINGS = deepFreeze({
  donor: {
    commit: '9cf64161dfc647021ff3f3871d6655ac5400ae12',
    indexBlob: 'e122d09cb9d41410492f16c5f33dc598d1710504',
    appBlob: '6f6d126cf4dbfc198ed950c917bfc1c3c44d345e'
  },
  planet: {
    path: 'assets/audralia/audralia.planet.js',
    blob: '4aa2abc623acef47ad8f504e72c8c0907375a7e7',
    worldSeed: 'AUDRALIA_G1_WORLD_SEED',
    topology: 'SEAMLESS_GEODESIC_NO_LATITUDE_LONGITUDE_SEAM_OWNERSHIP'
  },
  task19Scenes: {
    dataBlob: 'cef3edc7beb5fc39037e00d5ead360ef9db9cdd5',
    geometryBlob: '698dc392edd0b74547d76fb09a05bb3bb2437c15',
    stateBlob: '5dd63fc95ba8e4eede539c9853fd913aafbe9169'
  }
});

const SITE_NAMES = deepFreeze({
  WATCHFIRE_OVERLOOK: 'Watchfire Overlook',
  WATERLINE_STATION: 'Waterline Station',
  SIGNAL_LANTERN_FIELD: 'Signal Lantern Field',
  RESTORATION_BOUNDARY: 'Restoration Boundary'
});
const BEAT_SPECS = deepFreeze([
  { id: 'ONE_WAY_CROSSING', startMs: 0, durationMs: 4000, eyebrow: 'Mirrorland', heading: 'Some crossings only open one way.', body: 'A threshold appears over moonlit water. Beyond it, Audralia waits.' },
  { id: 'AUDRALIA_GLOBE', startMs: 4000, durationMs: 5000, eyebrow: 'Audralia', heading: 'One world turns in the dark.', body: 'A seamless geodesic world holds Gratitude, its coast, and every closer view that follows.' },
  { id: 'DESCENT_TO_GRATITUDE_COAST', startMs: 9000, durationMs: 5000, eyebrow: 'Gratitude Coast', heading: 'The world becomes a harbor.', body: 'Scale changes; geography does not. Moonlight finds Gratitude Harbor on the same Audralian world.' },
  { id: 'MIRROR_MANOR_AND_CLOCK', startMs: 14000, durationMs: 5000, eyebrow: 'Mirror Manor · The Clock', heading: 'The harbor keeps its bearings.', body: 'Mirror Manor and the Clock orient the coast without becoming another cardinal destination.' },
  { id: 'FOUR_CHARACTER_ENVIRONMENT_FLASHES', startMs: 19000, durationMs: 5000, eyebrow: 'Alaric · Tarian · Elara · Soren', heading: 'Four environments hold four ways of seeing.', body: 'Boundary, continuity, signal, and fracture remain distinct across four permanent places.' },
  { id: 'SETTLE_TO_SURVEY_HUB', startMs: 24000, durationMs: 4000, eyebrow: 'Mirrorland · Gratitude Harbor', heading: 'Choose a distant signal.', body: 'Survey the coast, preview an encounter, or enter a separate character scene when you are ready.' }
]);
const average = (points) => ({
  x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
  y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  z: points.reduce((sum, point) => sum + point.z, 0) / points.length
});
const terrainLook = (x, z, lift = 0) => ({ x, y: sampleGratitudeWorld(x, z).source.elevation + lift, z });

export function buildMirrorlandCinematicOpening() {
  const sites = CARDINAL_SITE_IDS.map((id) => resolveSiteAnchor(id).world);
  const center = average(sites);
  const span = Math.max(1, Math.max(...sites.map((p) => p.x)) - Math.min(...sites.map((p) => p.x)), Math.max(...sites.map((p) => p.z)) - Math.min(...sites.map((p) => p.z)));
  const maxY = Math.max(...sites.map((point) => point.y));
  const crossing = resolveSiteAnchor('CROSSING').world;
  const manor = resolveSiteAnchor('MIRROR_MANOR').world;
  const clock = resolveSiteAnchor('CLOCK').world;
  const hubEye = { x: center.x, y: maxY + span * 0.44, z: center.z + span * 0.24 };
  const hubLook = terrainLook(center.x, center.z);
  const spatialFrames = [
    { position: { x: crossing.x - 170, y: crossing.y + 125, z: crossing.z + 230 }, lookAt: { ...crossing }, visualMode: 'CROSSING' },
    { position: hubEye, lookAt: hubLook, visualMode: 'PLANET' },
    { position: { x: center.x - span * 0.52, y: maxY + span * 1.06, z: center.z + span * 0.84 }, lookAt: hubLook, visualMode: 'COAST_DESCENT' },
    { position: { x: manor.x - 70, y: Math.max(manor.y, clock.y) + 330, z: manor.z + 320 }, lookAt: terrainLook((manor.x + clock.x) / 2, (manor.z + clock.z) / 2), visualMode: 'MANOR_CLOCK' },
    { position: { x: center.x - span * 0.10, y: maxY + span * 0.49, z: center.z + span * 0.38 }, lookAt: hubLook, visualMode: 'CARDINAL_FLASHES' },
    { position: hubEye, lookAt: hubLook, visualMode: 'SURVEY_HUB' }
  ];
  const frames = BEAT_SPECS.map((spec, index) => deepFreeze({
    beatId: spec.id,
    startMs: spec.startMs,
    durationMs: spec.durationMs,
    endMs: spec.startMs + spec.durationMs,
    copy: { eyebrow: spec.eyebrow, heading: spec.heading, body: spec.body },
    ...spatialFrames[index],
    coordinateAuthority: index === 1 ? 'AUDRALIA_PLANET_GEODESIC_AUTHORITY' : GRATITUDE_GEOGRAPHY_ADAPTER_ID,
    sourceBound: true,
    reducedMotionTransition: 'STATIC_SEMANTIC_FRAME'
  }));
  return deepFreeze({
    contractId: CINEMATIC_INTRO_CONTRACT_ID,
    runtimeMs: CINEMATIC_RUNTIME_MS,
    runtimeSeconds: 28,
    sequence: [...CINEMATIC_INTRO_BEAT_IDS],
    frames,
    sourceBindings: CINEMATIC_SOURCE_BINDINGS,
    finalFrameIsInteractiveHubFrame: vectorNear(frames.at(-1).position, hubEye) && vectorNear(frames.at(-1).lookAt, hubLook),
    playLabel: 'Play primer', skipLabel: 'Skip to survey', replayLabel: 'Replay primer',
    autoplayAudio: false,
    reducedMotion: { presentation: 'IMMEDIATE_COMPLETE_SEMANTIC_SUMMARY_AND_IDENTICAL_HUB', identicalInformation: true }
  });
}

const introReceipt = (eventType, accepted, reason, fromPhase, toPhase) => deepFreeze({ schema: 'TASK20_CINEMATIC_TRANSITION_RECEIPT_v1', eventType, accepted, reason, fromPhase, toPhase });
const composeIntroState = ({ phase = 'READY', elapsedMs = 0, visitedBeatIds = [], transitionCount = 0, lastTransition = null }) => deepFreeze({
  contractId: CINEMATIC_INTRO_CONTRACT_ID,
  phase, elapsedMs, visitedBeatIds: [...visitedBeatIds], transitionCount, lastTransition,
  skipAvailable: !['COMPLETE', 'SKIPPED'].includes(phase),
  mayEnterCanonicalWorld: ['COMPLETE', 'SKIPPED'].includes(phase),
  autonomousAfterPlay: CINEMATIC_INTRO_BEAT_IDS.includes(phase),
  autoplayAudio: false
});
export function createCinematicIntroState() { return composeIntroState({}); }
const rejectIntro = (state, eventType, reason) => deepFreeze({ state, receipt: introReceipt(eventType, false, reason, state.phase, state.phase) });
const acceptIntro = (state, eventType, reason, phase, elapsedMs, visitedBeatIds) => {
  const receipt = introReceipt(eventType, true, reason, state.phase, phase);
  return deepFreeze({ state: composeIntroState({ phase, elapsedMs, visitedBeatIds, transitionCount: state.transitionCount + 1, lastTransition: receipt }), receipt });
};
const beatAt = (elapsedMs) => BEAT_SPECS.find((beat) => elapsedMs >= beat.startMs && elapsedMs < beat.startMs + beat.durationMs);

export function applyCinematicIntroEvent(state, event = {}) {
  if (state?.contractId !== CINEMATIC_INTRO_CONTRACT_ID || !CINEMATIC_INTRO_PHASES.includes(state.phase)) throw new TypeError('INVALID_CINEMATIC_INTRO_STATE');
  const type = event.type;
  if (type === 'SKIP_INTRO') {
    if (!state.skipAvailable) return rejectIntro(state, type, 'INTRO_ALREADY_RESOLVED');
    return acceptIntro(state, type, 'SKIP_TO_IDENTICAL_SURVEY_HUB', 'SKIPPED', state.elapsedMs, state.visitedBeatIds);
  }
  if (type === 'REPLAY_INTRO') return acceptIntro(state, type, 'REPLAY_RESET_TO_READY', 'READY', 0, []);
  if (type === 'PLAY_INTRO' || type === 'START_INTRO') {
    if (state.phase !== 'READY') return rejectIntro(state, type, 'PLAY_REQUIRES_READY');
    return acceptIntro(state, type, 'AUTONOMOUS_PRIMER_STARTED', CINEMATIC_INTRO_BEAT_IDS[0], 0, [CINEMATIC_INTRO_BEAT_IDS[0]]);
  }
  if (type === 'TICK_INTRO') {
    if (!CINEMATIC_INTRO_BEAT_IDS.includes(state.phase)) return rejectIntro(state, type, 'TICK_REQUIRES_ACTIVE_PRIMER');
    if (!finite(event.elapsedMs) || event.elapsedMs < state.elapsedMs) return rejectIntro(state, type, 'ELAPSED_TIME_MUST_BE_FINITE_AND_MONOTONIC');
    if (event.elapsedMs >= CINEMATIC_RUNTIME_MS) return acceptIntro(state, type, 'AUTONOMOUS_PRIMER_COMPLETED', 'COMPLETE', CINEMATIC_RUNTIME_MS, [...CINEMATIC_INTRO_BEAT_IDS]);
    const beat = beatAt(event.elapsedMs);
    return acceptIntro(state, type, 'AUTONOMOUS_TIMELINE_ADVANCED', beat.id, event.elapsedMs, CINEMATIC_INTRO_BEAT_IDS.slice(0, CINEMATIC_INTRO_BEAT_IDS.indexOf(beat.id) + 1));
  }
  if (type === 'ADVANCE_INTRO') {
    const index = CINEMATIC_INTRO_BEAT_IDS.indexOf(state.phase);
    if (index < 0) return rejectIntro(state, type, 'ADVANCE_REQUIRES_ACTIVE_PRIMER');
    const next = BEAT_SPECS[index + 1];
    return next
      ? acceptIntro(state, type, 'SEMANTIC_TEST_ADVANCE', next.id, next.startMs, CINEMATIC_INTRO_BEAT_IDS.slice(0, index + 2))
      : acceptIntro(state, type, 'SEMANTIC_TEST_COMPLETION', 'COMPLETE', CINEMATIC_RUNTIME_MS, [...CINEMATIC_INTRO_BEAT_IDS]);
  }
  return rejectIntro(state, type || 'UNKNOWN', 'UNRECOGNIZED_INTRO_EVENT');
}

export function enterCanonicalCardinalWorld(introState, { storyState = {} } = {}) {
  if (introState?.contractId !== CINEMATIC_INTRO_CONTRACT_ID || !introState.mayEnterCanonicalWorld) throw new RangeError('CINEMATIC_INTRO_NOT_RESOLVED');
  return createCanonicalCardinalWorldEntry({ entryMode: introState.phase === 'SKIPPED' ? 'INTRO_SKIPPED' : 'INTRO_COMPLETE', storyState });
}

const routeFrame = (stageId, siteId, position, lookAt, transitionFromPriorMs, meaning) => deepFreeze({ stageId, siteId, position, lookAt, transitionFromPriorMs, meaning, coordinateAuthority: GRATITUDE_GEOGRAPHY_ADAPTER_ID });
export function buildStandardSiteSurveyPath(siteId) {
  if (!CARDINAL_SITE_IDS.includes(siteId)) throw new RangeError(`UNKNOWN_CARDINAL_SITE:${siteId}`);
  const hub = buildMirrorlandCinematicOpening().frames.at(-1);
  const destination = resolveCameraSiteAnchor(siteId);
  const frames = deepFreeze([
    routeFrame('SCENE_CUT', siteId, hub.position, destination.look, 0, 'SELECTED_ENCOUNTER_CUTS_TO_A_SEPARATE_SCENE'),
    routeFrame('ENVIRONMENT_REVEAL', siteId, interpolateVector(hub.position, destination.eye, 0.72), interpolateVector(hub.lookAt, destination.look, 0.84), 620, 'ENVIRONMENT_PRECEDES_INTERPRETATION'),
    routeFrame('ARRIVAL_WITNESS', siteId, destination.eye, destination.look, 780, 'PLACE_AND_PRESENCE_RESOLVE_BEFORE_DISCOVERY')
  ]);
  return deepFreeze({
    contractId: STANDARD_SURVEY_PATH_CONTRACT_ID,
    pathId: `TASK20_SCENE_ENTRY:${siteId}`,
    kind: 'SCENE_ENTRY', toSiteId: siteId, siteName: SITE_NAMES[siteId], frames,
    stageIds: frames.map((frame) => frame.stageId), totalDurationMs: 1400,
    separateScene: true, continuousPhysicalTravelRequired: false, arrivalBeforeInspection: true,
    coordinateAuthority: GRATITUDE_GEOGRAPHY_ADAPTER_ID,
    reducedMotion: { presentation: 'SEMANTIC_CUT', identicalDestinationState: true }
  });
}
export function buildAllStandardSiteSurveyPaths() { return deepFreeze(Object.fromEntries(CARDINAL_SITE_IDS.map((siteId) => [siteId, buildStandardSiteSurveyPath(siteId)]))); }
export function buildRevealedRelationSurveyPath(sceneState, fromSiteId, toSiteId) {
  if (sceneState?.version !== CARDINAL_SCENE_STATE_VERSION) throw new TypeError('INVALID_CARDINAL_SCENE_STATE');
  const relation = sceneState.story.relations[`${fromSiteId}->${toSiteId}`];
  if (!relation) throw new RangeError('RELATION_PATH_REQUIRES_EXPLICIT_STORY_RECEIPT');
  return deepFreeze({ ...buildStandardSiteSurveyPath(toSiteId), pathId: `TASK20_REVEALED_RELATION:${fromSiteId}:${toSiteId}`, kind: 'REVEALED_RELATION', fromSiteId, relationReceipt: relation });
}
export function resolvePendingSurveyPath(sceneState) {
  if (sceneState?.version !== CARDINAL_SCENE_STATE_VERSION || !sceneState.pendingTravel) throw new RangeError('NO_PENDING_SCENE_TRANSITION');
  const pending = sceneState.pendingTravel;
  return pending.kind === 'REVEALED_RELATION'
    ? buildRevealedRelationSurveyPath(sceneState, pending.fromSiteId, pending.toSiteId)
    : buildStandardSiteSurveyPath(pending.toSiteId);
}
export function sampleSurveyPath(path, progress, { reducedMotion = false } = {}) {
  if (path?.contractId !== STANDARD_SURVEY_PATH_CONTRACT_ID || !finite(progress)) throw new TypeError('INVALID_SCENE_ENTRY_PATH');
  const normalized = clamp01(progress);
  if (reducedMotion) {
    const frame = normalized >= 1 ? path.frames.at(-1) : path.frames[0];
    return deepFreeze({ pathId: path.pathId, progress: normalized, stageId: frame.stageId, position: frame.position, lookAt: frame.lookAt, transition: 'SEMANTIC_CUT' });
  }
  const elapsed = normalized * path.totalDurationMs;
  let consumed = 0;
  for (let index = 1; index < path.frames.length; index += 1) {
    const from = path.frames[index - 1];
    const to = path.frames[index];
    if (elapsed <= consumed + to.transitionFromPriorMs || index === path.frames.length - 1) {
      const local = smooth(clamp01((elapsed - consumed) / to.transitionFromPriorMs));
      return deepFreeze({ pathId: path.pathId, progress: normalized, stageId: to.stageId, position: interpolateVector(from.position, to.position, local), lookAt: interpolateVector(from.lookAt, to.lookAt, local), transition: 'CINEMATIC_SCENE_CUT_AND_REVEAL' });
    }
    consumed += to.transitionFromPriorMs;
  }
}

export function evaluateCinematicIntroAndSurveyPaths() {
  const issues = [];
  const assert = (condition, issue) => { if (!condition) issues.push(issue); };
  const opening = buildMirrorlandCinematicOpening();
  assert(opening.runtimeMs === 28000 && opening.frames.reduce((sum, frame) => sum + frame.durationMs, 0) === 28000, 'CINEMATIC_RUNTIME_DRIFT');
  assert(opening.sequence.join('>') === CINEMATIC_INTRO_BEAT_IDS.join('>'), 'CINEMATIC_SEQUENCE_DRIFT');
  assert(opening.frames.every((frame) => frame.sourceBound), 'UNBOUND_CINEMATIC_FRAME');
  assert(opening.finalFrameIsInteractiveHubFrame, 'FILM_INTERFACE_FRAME_DIVERGENCE');
  let completed = applyCinematicIntroEvent(createCinematicIntroState(), { type: 'PLAY_INTRO' }).state;
  completed = applyCinematicIntroEvent(completed, { type: 'TICK_INTRO', elapsedMs: 28000 }).state;
  const skipped = applyCinematicIntroEvent(createCinematicIntroState(), { type: 'SKIP_INTRO' }).state;
  assert(JSON.stringify(enterCanonicalCardinalWorld(completed)) === JSON.stringify(enterCanonicalCardinalWorld(skipped)), 'SKIP_COMPLETE_HUB_DIVERGENCE');
  const paths = buildAllStandardSiteSurveyPaths();
  for (const siteId of CARDINAL_SITE_IDS) {
    const path = paths[siteId];
    const destination = resolveCameraSiteAnchor(siteId);
    assert(path.separateScene && path.stageIds.join('>') === SURVEY_PATH_STAGE_IDS.join('>'), `SCENE_PATH_ARCHITECTURE_DRIFT:${siteId}`);
    assert(vectorNear(path.frames.at(-1).position, destination.eye), `SCENE_DESTINATION_DRIFT:${siteId}`);
  }
  return deepFreeze({
    schema: 'TASK20_CINEMATIC_PRIMER_AND_SCENE_PATH_RECEIPT_v1',
    result: issues.length ? 'HELD_TASK20_CINEMATIC_PRIMER' : 'PASS_TASK20_AUTONOMOUS_CINEMATIC_PRIMER',
    eligible: issues.length === 0,
    runtimeMs: opening.runtimeMs,
    sequence: opening.sequence,
    sourceBoundPassageCount: opening.frames.filter((frame) => frame.sourceBound).length,
    scenePathCount: Object.keys(paths).length,
    issues
  });
}

export const MIRRORLAND_CINEMATIC_INTRO = deepFreeze({ contractId: CINEMATIC_INTRO_CONTRACT_ID, buildOpening: buildMirrorlandCinematicOpening, createState: createCinematicIntroState, applyEvent: applyCinematicIntroEvent, enterCanonicalWorld: enterCanonicalCardinalWorld });
export const CARDINAL_STANDARD_SURVEY_PATHS = deepFreeze({ contractId: STANDARD_SURVEY_PATH_CONTRACT_ID, buildSitePath: buildStandardSiteSurveyPath, buildAllSitePaths: buildAllStandardSiteSurveyPaths, buildRevealedRelationPath: buildRevealedRelationSurveyPath, resolvePendingPath: resolvePendingSurveyPath, samplePath: sampleSurveyPath });

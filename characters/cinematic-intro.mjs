/**
 * Task 19 optional Mirrorland overture and authored survey camera paths.
 *
 * This pure construction module creates no DOM, timers, renderer, audio,
 * persistence or navigation side effects. Every camera point is derived from
 * the admitted Gratitude geography adapter. The opening uses the same world
 * geometry at progressively closer LODs; it never substitutes a flat world.
 */

import {
  GRATITUDE_DEVELOPMENT_FRAME,
  GRATITUDE_GEOGRAPHY_ADAPTER_ID,
  resolveCameraSiteAnchor,
  resolveLodSiteAnchor,
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
const near = (left, right, tolerance = 1e-7) => Math.abs(left - right) <= tolerance;
const vectorNear = (left, right, tolerance = 1e-7) => near(left.x, right.x, tolerance)
  && near(left.y, right.y, tolerance)
  && near(left.z, right.z, tolerance);
const interpolate = (left, right, amount) => left + (right - left) * amount;
const interpolateVector = (left, right, amount) => deepFreeze({
  x: interpolate(left.x, right.x, amount),
  y: interpolate(left.y, right.y, amount),
  z: interpolate(left.z, right.z, amount)
});
const smoothstep = (amount) => amount * amount * (3 - 2 * amount);

export const CINEMATIC_INTRO_CONTRACT_ID = 'CHARACTERS_TASK19_MIRRORLAND_CINEMATIC_INTRO_v1';
export const STANDARD_SURVEY_PATH_CONTRACT_ID = 'CHARACTERS_TASK19_AUTHORED_STANDARD_SURVEY_PATHS_v1';

export const CINEMATIC_INTRO_BEAT_IDS = deepFreeze([
  'AUDRELIA_PLANET_CONTEXT',
  'GRATITUDE_CONTINENT',
  'GRATITUDE_HARBOR',
  'FOUR_CARDINAL_SIGNALS',
  'MIRROR_MANOR_CLOCK_CONTEXT',
  'VISITOR_CONTROL_INSTRUCTION'
]);

export const CINEMATIC_INTRO_PHASES = deepFreeze([
  'READY',
  ...CINEMATIC_INTRO_BEAT_IDS,
  'COMPLETE',
  'SKIPPED'
]);

export const SURVEY_PATH_STAGE_IDS = deepFreeze([
  'DISTANT_SIGNAL',
  'RELATIONAL_FIELD',
  'LOCAL_LANDMARK',
  'ARRIVAL_WITNESS'
]);

const SITE_DISPLAY_NAMES = deepFreeze({
  WATCHFIRE_OVERLOOK: 'Watchfire Overlook',
  WATERLINE_STATION: 'Waterline Station',
  SIGNAL_LANTERN_FIELD: 'Signal Lantern Field',
  RESTORATION_BOUNDARY: 'Restoration Boundary'
});

const INTRO_COPY = deepFreeze({
  AUDRELIA_PLANET_CONTEXT: {
    eyebrow: 'Mirrorland',
    heading: 'Welcome to Mirrorland.',
    body: 'This is Audrelia. The Gratitude continent turns below, and its harbor is your point of entry.',
    continuationLabel: 'Find Gratitude'
  },
  GRATITUDE_CONTINENT: {
    eyebrow: 'Audrelia · Gratitude',
    heading: 'Gratitude comes into view.',
    body: 'Follow the continent toward the coast. The harbor is held in the same living terrain, now seen at a closer scale.',
    continuationLabel: 'Approach the harbor'
  },
  GRATITUDE_HARBOR: {
    eyebrow: 'Gratitude Harbor',
    heading: 'The coast keeps its places.',
    body: 'Four permanent places stand across this harbor. Their signals can be seen before their meaning is known.',
    continuationLabel: 'Reveal the signals'
  },
  FOUR_CARDINAL_SIGNALS: {
    eyebrow: 'Four distant signals',
    heading: 'Look before you choose.',
    body: 'Watchfire Overlook, Waterline Station, Signal Lantern Field, and Restoration Boundary occupy four real sites along the coast.',
    continuationLabel: 'Take your bearings'
  },
  MIRROR_MANOR_CLOCK_CONTEXT: {
    eyebrow: 'Harbor bearings',
    heading: 'Mirror Manor and the Clock remain in view.',
    body: 'They orient the harbor without becoming another cardinal destination. The four signals remain the places you may enter.',
    continuationLabel: 'Learn how to enter'
  },
  VISITOR_CONTROL_INSTRUCTION: {
    eyebrow: 'Your passage',
    heading: 'Choose a signal.',
    body: 'Select one of the four distant signals on the coast map. Your view will follow its surveyed route. Arrive first; then inspect the place and turn each discovery card when you are ready.',
    continuationLabel: 'Enter Gratitude Harbor'
  }
});

const resolved = (siteId) => resolveSiteAnchor(siteId).world;
const cardinalWorlds = () => CARDINAL_SITE_IDS.map(resolved);
const contextWorlds = () => ['MIRROR_MANOR', 'CLOCK'].map(resolved);
const averageVector = (vectors) => ({
  x: vectors.reduce((sum, vector) => sum + vector.x, 0) / vectors.length,
  y: vectors.reduce((sum, vector) => sum + vector.y, 0) / vectors.length,
  z: vectors.reduce((sum, vector) => sum + vector.z, 0) / vectors.length
});
const maximumSpan = (vectors) => Math.max(
  Math.max(...vectors.map(({ x }) => x)) - Math.min(...vectors.map(({ x }) => x)),
  Math.max(...vectors.map(({ z }) => z)) - Math.min(...vectors.map(({ z }) => z)),
  1
);

const terrainLook = (x, z, yLift = 0) => {
  const terrain = sampleGratitudeWorld(x, z).source;
  return deepFreeze({ x, y: terrain.elevation + yLift, z });
};

const introSpatialFrame = (beatId, lod, position, lookAt, spatialTarget) => deepFreeze({
  beatId,
  lod,
  position,
  lookAt,
  spatialTarget,
  coordinateAuthority: GRATITUDE_GEOGRAPHY_ADAPTER_ID,
  sameWorldGeometry: true,
  flatReplacementWorld: false
});

export function buildMirrorlandCinematicOpening() {
  const sites = cardinalWorlds();
  const contexts = contextWorlds();
  const harborCenter = averageVector([...sites, ...contexts]);
  const cardinalCenter = averageVector(sites);
  const contextCenter = averageVector(contexts);
  const span = maximumSpan([...sites, ...contexts]);
  const maxY = Math.max(...sites.map(({ y }) => y), ...contexts.map(({ y }) => y));
  const siteLods = Object.fromEntries(CARDINAL_SITE_IDS.map((siteId) => [siteId, {
    planetary: resolveLodSiteAnchor(siteId, 'PLANETARY'),
    continental: resolveLodSiteAnchor(siteId, 'CONTINENTAL'),
    regional: resolveLodSiteAnchor(siteId, 'REGIONAL')
  }]));

  const frames = [
    introSpatialFrame(
      'AUDRELIA_PLANET_CONTEXT',
      'PLANETARY',
      { x: harborCenter.x - span * 0.62, y: maxY + span * 1.38, z: harborCenter.z + span * 1.12 },
      terrainLook(harborCenter.x, harborCenter.z),
      { world: 'AUDRELIA', continent: 'GRATITUDE', lodWitnesses: CARDINAL_SITE_IDS.map((siteId) => siteLods[siteId].planetary) }
    ),
    introSpatialFrame(
      'GRATITUDE_CONTINENT',
      'CONTINENTAL',
      { x: harborCenter.x - span * 0.42, y: maxY + span * 0.96, z: harborCenter.z + span * 0.76 },
      terrainLook(harborCenter.x, harborCenter.z),
      { continent: 'GRATITUDE', lodWitnesses: CARDINAL_SITE_IDS.map((siteId) => siteLods[siteId].continental) }
    ),
    introSpatialFrame(
      'GRATITUDE_HARBOR',
      'REGIONAL',
      { x: harborCenter.x - span * 0.26, y: maxY + span * 0.62, z: harborCenter.z + span * 0.48 },
      terrainLook(harborCenter.x, harborCenter.z),
      { region: GRATITUDE_DEVELOPMENT_FRAME.regionIdentity, siteIds: [...CARDINAL_SITE_IDS] }
    ),
    introSpatialFrame(
      'FOUR_CARDINAL_SIGNALS',
      'REGIONAL',
      { x: cardinalCenter.x - span * 0.12, y: maxY + span * 0.46, z: cardinalCenter.z + span * 0.32 },
      terrainLook(cardinalCenter.x, cardinalCenter.z),
      { signalSiteIds: [...CARDINAL_SITE_IDS], lodWitnesses: CARDINAL_SITE_IDS.map((siteId) => siteLods[siteId].regional) }
    ),
    introSpatialFrame(
      'MIRROR_MANOR_CLOCK_CONTEXT',
      'REGIONAL',
      { x: contextCenter.x - span * 0.04, y: maxY + span * 0.35, z: contextCenter.z + span * 0.28 },
      terrainLook(contextCenter.x, contextCenter.z),
      { contextIds: ['MIRROR_MANOR', 'CLOCK'], destinationAuthorityCreated: false }
    ),
    introSpatialFrame(
      'VISITOR_CONTROL_INSTRUCTION',
      'REGIONAL',
      { x: harborCenter.x, y: maxY + span * 0.44, z: harborCenter.z + span * 0.24 },
      terrainLook(cardinalCenter.x, cardinalCenter.z),
      { control: 'GRATITUDE_COAST_MAP', selectableSiteIds: [...CARDINAL_SITE_IDS] }
    )
  ].map((frame, index) => deepFreeze({
    ...frame,
    copy: INTRO_COPY[frame.beatId],
    transitionFromPriorMs: index === 0 ? 0 : [0, 2100, 1900, 1800, 1600, 1400][index],
    standardTransition: index === 0 ? 'INITIAL_FRAME' : 'CONTINUOUS_CAMERA_INTERPOLATION',
    reducedMotionTransition: index === 0 ? 'STATIC_INITIAL_FRAME' : 'STATIC_CROSSFADE'
  }));

  return deepFreeze({
    contractId: CINEMATIC_INTRO_CONTRACT_ID,
    sequence: [...CINEMATIC_INTRO_BEAT_IDS],
    frames,
    optional: true,
    skipLabel: 'Skip intro',
    skipAvailableImmediately: true,
    skipAndCompletionEnterEquivalentCanonicalState: true,
    autoplayAudio: false,
    audioPolicy: 'NO_AUTOPLAY_AUDIO',
    flatReplacementWorld: false,
    reducedMotion: {
      presentation: 'STATIC_CROSSFADE_LOD_ORIENTATION',
      identicalInformation: true,
      sourceOrder: [...CINEMATIC_INTRO_BEAT_IDS]
    },
    rendererIntegrationPerformed: false
  });
}

const introReceipt = (eventType, accepted, reason, fromPhase, toPhase) => deepFreeze({
  schema: 'TASK19_CINEMATIC_INTRO_TRANSITION_RECEIPT_v1',
  eventType,
  accepted,
  reason,
  fromPhase,
  toPhase
});

const composeIntroState = ({ phase, visitedBeatIds = [], transitionCount = 0, lastTransition = null }) => deepFreeze({
  contractId: CINEMATIC_INTRO_CONTRACT_ID,
  phase,
  visitedBeatIds: [...visitedBeatIds],
  transitionCount,
  lastTransition,
  skipAvailable: !['COMPLETE', 'SKIPPED'].includes(phase),
  mayEnterCanonicalWorld: ['COMPLETE', 'SKIPPED'].includes(phase),
  autoplayAudio: false
});

export function createCinematicIntroState() {
  return composeIntroState({ phase: 'READY' });
}

const rejectIntro = (state, eventType, reason) => deepFreeze({
  state,
  receipt: introReceipt(eventType, false, reason, state.phase, state.phase)
});

const acceptIntro = (state, eventType, reason, nextPhase, visitedBeatIds) => {
  const receipt = introReceipt(eventType, true, reason, state.phase, nextPhase);
  return deepFreeze({
    state: composeIntroState({
      phase: nextPhase,
      visitedBeatIds,
      transitionCount: state.transitionCount + 1,
      lastTransition: receipt
    }),
    receipt
  });
};

export function applyCinematicIntroEvent(state, event = {}) {
  if (state?.contractId !== CINEMATIC_INTRO_CONTRACT_ID || !CINEMATIC_INTRO_PHASES.includes(state.phase)) throw new TypeError('INVALID_CINEMATIC_INTRO_STATE');
  const eventType = event.type;
  if (eventType === 'SKIP_INTRO') {
    if (!state.skipAvailable) return rejectIntro(state, eventType, 'INTRO_ALREADY_RESOLVED');
    return acceptIntro(state, eventType, 'IMMEDIATE_SKIP_TO_EQUIVALENT_CANONICAL_WORLD_ENTRY', 'SKIPPED', state.visitedBeatIds);
  }
  if (eventType === 'START_INTRO') {
    if (state.phase !== 'READY') return rejectIntro(state, eventType, 'INTRO_START_REQUIRES_READY');
    const firstBeat = CINEMATIC_INTRO_BEAT_IDS[0];
    return acceptIntro(state, eventType, 'MIRRORLAND_WELCOME_BEGUN', firstBeat, [firstBeat]);
  }
  if (eventType === 'ADVANCE_INTRO') {
    const index = CINEMATIC_INTRO_BEAT_IDS.indexOf(state.phase);
    if (index < 0) return rejectIntro(state, eventType, 'INTRO_ADVANCE_REQUIRES_ACTIVE_BEAT');
    const nextBeat = CINEMATIC_INTRO_BEAT_IDS[index + 1];
    if (nextBeat) return acceptIntro(state, eventType, 'CINEMATIC_ORIENTATION_ADVANCED', nextBeat, [...state.visitedBeatIds, nextBeat]);
    if (state.phase !== 'VISITOR_CONTROL_INSTRUCTION') return rejectIntro(state, eventType, 'VISITOR_INSTRUCTION_REQUIRED_BEFORE_COMPLETION');
    return acceptIntro(state, eventType, 'VISITOR_INSTRUCTION_COMPLETED', 'COMPLETE', state.visitedBeatIds);
  }
  return rejectIntro(state, eventType || 'UNKNOWN', 'UNRECOGNIZED_INTRO_EVENT');
}

export function enterCanonicalCardinalWorld(introState, { storyState = {} } = {}) {
  if (introState?.contractId !== CINEMATIC_INTRO_CONTRACT_ID) throw new TypeError('INVALID_CINEMATIC_INTRO_STATE');
  if (!['COMPLETE', 'SKIPPED'].includes(introState.phase)) throw new RangeError('CINEMATIC_INTRO_NOT_RESOLVED');
  return createCanonicalCardinalWorldEntry({
    entryMode: introState.phase === 'SKIPPED' ? 'INTRO_SKIPPED' : 'INTRO_COMPLETE',
    storyState
  });
}

const routeFrame = (stageId, siteId, position, lookAt, transitionFromPriorMs, meaning) => deepFreeze({
  stageId,
  siteId,
  position,
  lookAt,
  transitionFromPriorMs,
  meaning,
  coordinateAuthority: GRATITUDE_GEOGRAPHY_ADAPTER_ID,
  interpolation: 'SMOOTHSTEP_POSITION_AND_LOOK_TARGET',
  arrivalBeforeInspection: stageId === 'ARRIVAL_WITNESS'
});

const bentVector = (from, to, amount, bendAmount) => {
  const x = interpolate(from.x, to.x, amount);
  const y = interpolate(from.y, to.y, amount);
  const z = interpolate(from.z, to.z, amount);
  const deltaX = to.x - from.x;
  const deltaZ = to.z - from.z;
  const length = Math.hypot(deltaX, deltaZ) || 1;
  return deepFreeze({
    x: x - deltaZ / length * bendAmount,
    y,
    z: z + deltaX / length * bendAmount
  });
};

const surveyOverview = () => {
  const sites = cardinalWorlds();
  const center = averageVector(sites);
  const span = maximumSpan(sites);
  const maxY = Math.max(...sites.map(({ y }) => y));
  return deepFreeze({
    eye: { x: center.x - span * 0.16, y: maxY + span * 0.43, z: center.z + span * 0.31 },
    look: terrainLook(center.x, center.z)
  });
};

const buildFramesBetween = ({ fromEye, fromLook, toSiteId, fromSiteId = null }) => {
  const destination = resolveCameraSiteAnchor(toSiteId);
  const directionSign = (fromSiteId || 'WORLD_MAP') < toSiteId ? 1 : -1;
  const distance = Math.hypot(destination.eye.x - fromEye.x, destination.eye.z - fromEye.z);
  const bend = Math.min(155, Math.max(38, distance * 0.12)) * directionSign;
  const relationalEye = bentVector(fromEye, destination.eye, 0.42, bend);
  const landmarkEye = bentVector(fromEye, destination.eye, 0.74, bend * 0.38);
  const relationalLook = interpolateVector(fromLook, destination.look, 0.58);
  const landmarkLook = interpolateVector(fromLook, destination.look, 0.88);
  return deepFreeze([
    routeFrame('DISTANT_SIGNAL', toSiteId, fromEye, destination.look, 0, 'SIGNAL_IDENTIFIED_BEFORE_DESTINATION_ENTRY'),
    routeFrame('RELATIONAL_FIELD', toSiteId, relationalEye, relationalLook, 1500, 'PLACE_READ_IN_RELATION_TO_THE_SHARED_HARBOR'),
    routeFrame('LOCAL_LANDMARK', toSiteId, landmarkEye, landmarkLook, 1450, 'LANDMARK_FORM_BECOMES_LEGIBLE_BEFORE_INTERPRETATION'),
    routeFrame('ARRIVAL_WITNESS', toSiteId, destination.eye, destination.look, 1300, 'REAL_SITE_ARRIVAL_PRECEDES_LOCAL_INSPECTION')
  ]);
};

const composeSurveyPath = ({ pathId, kind, fromSiteId = null, toSiteId, frames, relationReceipt = null }) => deepFreeze({
  contractId: STANDARD_SURVEY_PATH_CONTRACT_ID,
  pathId,
  kind,
  fromSiteId,
  toSiteId,
  siteName: SITE_DISPLAY_NAMES[toSiteId],
  frames,
  stageIds: frames.map(({ stageId }) => stageId),
  totalDurationMs: frames.slice(1).reduce((sum, frame) => sum + frame.transitionFromPriorMs, 0),
  relationReceipt,
  standardMode: 'DESTINATION_DRIVEN_AUTHORED_CINEMATIC_SURVEY_PATH',
  standardModeSnap: false,
  freeLocomotion: false,
  arrivalBeforeInspection: true,
  reducedMotion: {
    presentation: 'SEMANTIC_FRAME_CUT_OR_CROSSFADE',
    frameIds: frames.map(({ stageId }) => stageId),
    identicalDestinationState: true
  },
  coordinateAuthority: GRATITUDE_GEOGRAPHY_ADAPTER_ID,
  geographicStateChanged: false
});

export function buildStandardSiteSurveyPath(siteId) {
  if (!CARDINAL_SITE_IDS.includes(siteId)) throw new RangeError(`UNKNOWN_CARDINAL_SITE:${siteId}`);
  const overview = surveyOverview();
  const frames = buildFramesBetween({ fromEye: overview.eye, fromLook: overview.look, toSiteId: siteId });
  return composeSurveyPath({
    pathId: `STANDARD_SITE_SURVEY:${siteId}`,
    kind: 'SIGNAL_APPROACH',
    toSiteId: siteId,
    frames
  });
}

export function buildAllStandardSiteSurveyPaths() {
  return deepFreeze(Object.fromEntries(CARDINAL_SITE_IDS.map((siteId) => [siteId, buildStandardSiteSurveyPath(siteId)])));
}

export function buildRevealedRelationSurveyPath(sceneState, fromSiteId, toSiteId) {
  if (sceneState?.version !== CARDINAL_SCENE_STATE_VERSION) throw new TypeError('INVALID_CARDINAL_SCENE_STATE');
  if (!CARDINAL_SITE_IDS.includes(fromSiteId) || !CARDINAL_SITE_IDS.includes(toSiteId) || fromSiteId === toSiteId) throw new RangeError('INVALID_CARDINAL_RELATION_PATH');
  const relation = sceneState.story.relations[`${fromSiteId}->${toSiteId}`];
  if (!relation) throw new RangeError('RELATION_PATH_REQUIRES_EXPLICIT_STORY_RECEIPT');
  const origin = resolveCameraSiteAnchor(fromSiteId);
  const frames = buildFramesBetween({ fromEye: origin.eye, fromLook: origin.look, toSiteId, fromSiteId });
  return composeSurveyPath({
    pathId: `REVEALED_RELATION_SURVEY:${fromSiteId}:${toSiteId}:${relation.sourceEventId}`,
    kind: 'REVEALED_RELATION',
    fromSiteId,
    toSiteId,
    frames,
    relationReceipt: relation
  });
}

export function resolvePendingSurveyPath(sceneState) {
  if (sceneState?.version !== CARDINAL_SCENE_STATE_VERSION) throw new TypeError('INVALID_CARDINAL_SCENE_STATE');
  const pending = sceneState.pendingTravel;
  if (!pending) throw new RangeError('NO_PENDING_SURVEY_TRAVEL');
  if (pending.kind === 'SIGNAL_APPROACH') return buildStandardSiteSurveyPath(pending.toSiteId);
  if (pending.kind === 'REVEALED_RELATION') return buildRevealedRelationSurveyPath(sceneState, pending.fromSiteId, pending.toSiteId);
  throw new RangeError('UNKNOWN_PENDING_SURVEY_TRAVEL_KIND');
}

export function sampleSurveyPath(path, progress, { reducedMotion = false } = {}) {
  if (path?.contractId !== STANDARD_SURVEY_PATH_CONTRACT_ID || !Array.isArray(path.frames) || path.frames.length < 2) throw new TypeError('INVALID_STANDARD_SURVEY_PATH');
  if (!finite(progress)) throw new TypeError('SURVEY_PROGRESS_REQUIRES_FINITE_NUMBER');
  const normalized = clamp01(progress);
  if (reducedMotion) {
    const index = Math.min(path.frames.length - 1, Math.floor(normalized * path.frames.length));
    const frame = path.frames[index];
    return deepFreeze({
      pathId: path.pathId,
      progress: normalized,
      stageId: frame.stageId,
      position: frame.position,
      lookAt: frame.lookAt,
      transition: 'SEMANTIC_FRAME_CUT_OR_CROSSFADE',
      destinationStateChanged: false
    });
  }

  const elapsedMs = normalized * path.totalDurationMs;
  if (normalized === 0) {
    const frame = path.frames[0];
    return deepFreeze({ pathId: path.pathId, progress: 0, stageId: frame.stageId, position: frame.position, lookAt: frame.lookAt, transition: 'CONTINUOUS_INTERPOLATION', destinationStateChanged: false });
  }
  let consumedMs = 0;
  for (let index = 1; index < path.frames.length; index += 1) {
    const from = path.frames[index - 1];
    const to = path.frames[index];
    const segmentMs = to.transitionFromPriorMs;
    if (elapsedMs <= consumedMs + segmentMs || index === path.frames.length - 1) {
      const local = clamp01((elapsedMs - consumedMs) / segmentMs);
      const eased = smoothstep(local);
      return deepFreeze({
        pathId: path.pathId,
        progress: normalized,
        stageId: to.stageId,
        position: interpolateVector(from.position, to.position, eased),
        lookAt: interpolateVector(from.lookAt, to.lookAt, eased),
        transition: 'CONTINUOUS_INTERPOLATION',
        destinationStateChanged: false
      });
    }
    consumedMs += segmentMs;
  }
  throw new RangeError('SURVEY_PATH_SAMPLE_UNRESOLVED');
}

const playIntroToCompletion = () => {
  let state = createCinematicIntroState();
  state = applyCinematicIntroEvent(state, { type: 'START_INTRO' }).state;
  while (state.phase !== 'COMPLETE') state = applyCinematicIntroEvent(state, { type: 'ADVANCE_INTRO' }).state;
  return state;
};

export function evaluateCinematicIntroAndSurveyPaths() {
  const issues = [];
  const assert = (condition, issue) => { if (!condition) issues.push(issue); };
  const opening = buildMirrorlandCinematicOpening();
  const standardPaths = buildAllStandardSiteSurveyPaths();

  assert(opening.sequence.join('>') === CINEMATIC_INTRO_BEAT_IDS.join('>'), 'CINEMATIC_SEQUENCE_DRIFT');
  assert(opening.frames[0].copy.heading === 'Welcome to Mirrorland.', 'MIRRORLAND_WELCOME_MISSING');
  assert(opening.frames.at(-1).beatId === 'VISITOR_CONTROL_INSTRUCTION', 'VISITOR_INSTRUCTION_NOT_FINAL_BEAT');
  assert(opening.frames.at(-1).copy.body.includes('Select one of the four distant signals'), 'CONCRETE_SELECTION_INSTRUCTION_MISSING');
  assert(opening.frames.every((frame) => frame.coordinateAuthority === GRATITUDE_GEOGRAPHY_ADAPTER_ID && frame.flatReplacementWorld === false), 'INTRO_FRAME_NOT_BOUND_TO_SHARED_WORLD_GEOMETRY');
  assert(opening.autoplayAudio === false && opening.skipAvailableImmediately === true, 'OPTIONAL_SILENT_INTRO_POLICY_DRIFT');

  const completedIntro = playIntroToCompletion();
  const skippedIntro = applyCinematicIntroEvent(createCinematicIntroState(), { type: 'SKIP_INTRO' }).state;
  assert(completedIntro.visitedBeatIds.includes('VISITOR_CONTROL_INSTRUCTION'), 'STANDARD_INTRO_BYPASSED_INSTRUCTION');
  assert(JSON.stringify(enterCanonicalCardinalWorld(completedIntro)) === JSON.stringify(enterCanonicalCardinalWorld(skippedIntro)), 'INTRO_SKIP_CANONICAL_STATE_DIVERGENCE');

  assert(Object.keys(standardPaths).length === 4, 'NOT_ALL_FOUR_STANDARD_SURVEY_PATHS_CONSTRUCTED');
  const fingerprints = new Set();
  for (const siteId of CARDINAL_SITE_IDS) {
    const path = standardPaths[siteId];
    const camera = resolveCameraSiteAnchor(siteId);
    assert(path.stageIds.join('>') === SURVEY_PATH_STAGE_IDS.join('>'), `SURVEY_STAGE_DRIFT:${siteId}`);
    assert(path.standardModeSnap === false && path.totalDurationMs > 0, `STANDARD_SURVEY_SNAP_OR_DURATION_FAILURE:${siteId}`);
    assert(vectorNear(path.frames.at(-1).position, camera.eye) && vectorNear(path.frames.at(-1).lookAt, camera.look), `SURVEY_ARRIVAL_ANCHOR_DIVERGENCE:${siteId}`);
    assert(path.frames.every((frame) => frame.coordinateAuthority === GRATITUDE_GEOGRAPHY_ADAPTER_ID), `SURVEY_MULTIPLE_GEOGRAPHY_AUTHORITY:${siteId}`);
    const samples = Array.from({ length: 101 }, (_, index) => sampleSurveyPath(path, index / 100));
    assert(samples.every((sample) => finite(sample.position.x) && finite(sample.position.y) && finite(sample.position.z)), `SURVEY_NONFINITE_SAMPLE:${siteId}`);
    assert(samples.slice(1).every((sample, index) => Math.hypot(sample.position.x - samples[index].position.x, sample.position.y - samples[index].position.y, sample.position.z - samples[index].position.z) < 100), `SURVEY_DISCONTINUITY:${siteId}`);
    const reducedArrival = sampleSurveyPath(path, 1, { reducedMotion: true });
    assert(vectorNear(reducedArrival.position, camera.eye) && reducedArrival.stageId === 'ARRIVAL_WITNESS', `REDUCED_MOTION_DESTINATION_DIVERGENCE:${siteId}`);
    fingerprints.add(path.frames.map(({ position }) => `${position.x.toFixed(3)},${position.y.toFixed(3)},${position.z.toFixed(3)}`).join('|'));
  }
  assert(fingerprints.size === CARDINAL_SITE_IDS.length, 'SURVEY_PATHS_NOT_DESTINATION_DISTINCT');

  const storyState = {
    storyReceiptId: 'TASK19_CINEMATIC_EVALUATION_RELATION_FIXTURE_v1',
    revealedRelations: [{
      fromSiteId: 'WATCHFIRE_OVERLOOK',
      toSiteId: 'WATERLINE_STATION',
      sourceEventId: 'TASK19_EXPLICIT_RELATION_FIXTURE',
      chronologyState: 'P12'
    }]
  };
  const worldState = createCanonicalCardinalWorldEntry({ storyState });
  const relationPath = buildRevealedRelationSurveyPath(worldState, 'WATCHFIRE_OVERLOOK', 'WATERLINE_STATION');
  assert(relationPath.relationReceipt.sourceEventId === 'TASK19_EXPLICIT_RELATION_FIXTURE', 'RELATION_PATH_DROPPED_SOURCE_RECEIPT');
  let hiddenRelationRejected = false;
  try { buildRevealedRelationSurveyPath(worldState, 'WATCHFIRE_OVERLOOK', 'SIGNAL_LANTERN_FIELD'); } catch { hiddenRelationRejected = true; }
  assert(hiddenRelationRejected, 'UNREVEALED_RELATION_PATH_CONSTRUCTED');

  return deepFreeze({
    schema: 'TASK19_CINEMATIC_INTRO_AND_SURVEY_PATH_VERIFICATION_RECEIPT_v1',
    result: issues.length === 0 ? 'PASS_PROTECTED_CINEMATIC_INTRO_AND_SURVEY_PATHS' : 'HELD_CINEMATIC_INTRO_AND_SURVEY_PATHS',
    eligible: issues.length === 0,
    introSequence: [...CINEMATIC_INTRO_BEAT_IDS],
    welcome: opening.frames[0].copy.heading,
    instructionBeat: opening.frames.at(-1).copy,
    skipCanonicalStateEquivalent: !issues.includes('INTRO_SKIP_CANONICAL_STATE_DIVERGENCE'),
    standardSurveyPathCount: Object.keys(standardPaths).length,
    standardSurveySnapAllowed: false,
    reducedMotionCarriesIdenticalDestinationState: true,
    relationPathRequiresExplicitStoryReceipt: hiddenRelationRejected,
    issues,
    boundaries: {
      domIntegrated: false,
      cssIntegrated: false,
      rendererIntegrated: false,
      audioStarted: false,
      pageNavigationChanged: false,
      finalContinentalAuthorityCreated: false,
      characterModelsCreated: false
    }
  });
}

export const MIRRORLAND_CINEMATIC_INTRO = deepFreeze({
  contractId: CINEMATIC_INTRO_CONTRACT_ID,
  buildOpening: buildMirrorlandCinematicOpening,
  createState: createCinematicIntroState,
  applyEvent: applyCinematicIntroEvent,
  enterCanonicalWorld: enterCanonicalCardinalWorld
});

export const CARDINAL_STANDARD_SURVEY_PATHS = deepFreeze({
  contractId: STANDARD_SURVEY_PATH_CONTRACT_ID,
  buildSitePath: buildStandardSiteSurveyPath,
  buildAllSitePaths: buildAllStandardSiteSurveyPaths,
  buildRevealedRelationPath: buildRevealedRelationSurveyPath,
  resolvePendingPath: resolvePendingSurveyPath,
  samplePath: sampleSurveyPath
});

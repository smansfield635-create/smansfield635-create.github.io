/**
 * Task 19 deterministic cardinal-scene state.
 *
 * Pure state only: no DOM, renderer, geometry, prose, timers, persistence,
 * network access or final geographic authority. Every non-default presence,
 * discovery availability and relationship route requires an explicit story
 * receipt. Invalid transitions fail closed and preserve the prior state.
 */

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.freeze(value);
};
const cloneRecord = (value) => Object.fromEntries(Object.entries(value || {}));
const unique = (values) => [...new Set(values)];
const hasText = (value) => typeof value === 'string' && value.trim().length > 0;

export const CARDINAL_SCENE_STATE_VERSION = 'CARDINAL_SCENE_STATE_TASK19_v1';

export const CARDINAL_SITE_IDS = deepFreeze([
  'WATCHFIRE_OVERLOOK',
  'WATERLINE_STATION',
  'SIGNAL_LANTERN_FIELD',
  'RESTORATION_BOUNDARY'
]);

export const CARDINAL_CHARACTER_BY_SITE = deepFreeze({
  WATCHFIRE_OVERLOOK: 'ALARIC_AXION',
  WATERLINE_STATION: 'TARIAN_MERROW',
  SIGNAL_LANTERN_FIELD: 'ELARA_SYLENE',
  RESTORATION_BOUNDARY: 'SOREN_SEVRIN'
});

export const CARDINAL_PRESENCE_STATES = deepFreeze([
  'SITE_ONLY',
  'CHARACTER_TRACE',
  'CHARACTER_PRESENT'
]);

export const CARDINAL_SCENE_PHASES = deepFreeze([
  'WORLD_MAP',
  'DISTANT_SIGNAL',
  'SURVEY_APPROACH',
  'SITE_ARRIVAL',
  'LOCAL_INSPECTION',
  'KNOWLEDGE_CARD'
]);

export const CARDINAL_CARD_FACES = deepFreeze(['FACE_A_RECORD', 'FACE_B_SIGNIFICANCE']);
export const DISCOVERY_AVAILABILITY_STATES = deepFreeze(['HELD', 'AVAILABLE', 'UNAVAILABLE']);

const discoverySlot = (id, siteId, ordinal) => deepFreeze({ id, siteId, ordinal });

// State-addressable slots only. Source-grounded Face A / Face B content and
// disclosure records remain deferred to cardinal-scenes.data.mjs.
export const CARDINAL_DISCOVERY_SLOTS = deepFreeze([
  discoverySlot('ALARIC_ROUTE_TABLE', 'WATCHFIRE_OVERLOOK', 1),
  discoverySlot('ALARIC_THRESHOLD_GATE', 'WATCHFIRE_OVERLOOK', 2),
  discoverySlot('ALARIC_HELD_MARKER', 'WATCHFIRE_OVERLOOK', 3),
  discoverySlot('ALARIC_FOUR_WAY_SIGHTLINE', 'WATCHFIRE_OVERLOOK', 4),
  discoverySlot('ALARIC_UNDERFRAME_APERTURE', 'WATCHFIRE_OVERLOOK', 5),
  discoverySlot('TARIAN_TIDE_STAFF', 'WATERLINE_STATION', 1),
  discoverySlot('TARIAN_LOAD_BRIDGE', 'WATERLINE_STATION', 2),
  discoverySlot('TARIAN_COUNTERFEIT_BUOY', 'WATERLINE_STATION', 3),
  discoverySlot('TARIAN_RECOVERY_BASIN', 'WATERLINE_STATION', 4),
  discoverySlot('TARIAN_CONFLUENCE_JUNCTION', 'WATERLINE_STATION', 5),
  discoverySlot('TARIAN_SUBMERGED_FOUNDATION', 'WATERLINE_STATION', 6),
  discoverySlot('ELARA_FAINT_LANTERN', 'SIGNAL_LANTERN_FIELD', 1),
  discoverySlot('ELARA_ARCHIVE_RESONATOR', 'SIGNAL_LANTERN_FIELD', 2),
  discoverySlot('ELARA_DOUBLE_APERTURE', 'SIGNAL_LANTERN_FIELD', 3),
  discoverySlot('ELARA_CONTRADICTION_LENS', 'SIGNAL_LANTERN_FIELD', 4),
  discoverySlot('ELARA_RELATION_ARRAY', 'SIGNAL_LANTERN_FIELD', 5),
  discoverySlot('ELARA_ROOT_RECEIVER', 'SIGNAL_LANTERN_FIELD', 6),
  discoverySlot('SOREN_FINISHED_SURFACE', 'RESTORATION_BOUNDARY', 1),
  discoverySlot('SOREN_FAILED_JOINT', 'RESTORATION_BOUNDARY', 2),
  discoverySlot('SOREN_TEST_FRAME', 'RESTORATION_BOUNDARY', 3),
  discoverySlot('SOREN_RETURN_LOCK', 'RESTORATION_BOUNDARY', 4),
  discoverySlot('SOREN_FOUR_BEARING_JUNCTION', 'RESTORATION_BOUNDARY', 5),
  discoverySlot('SOREN_FOUNDATION_WITNESS', 'RESTORATION_BOUNDARY', 6)
]);

const DISCOVERY_BY_ID = new Map(CARDINAL_DISCOVERY_SLOTS.map((slot) => [slot.id, slot]));

const presenceDefault = (siteId) => deepFreeze({
  siteId,
  characterId: CARDINAL_CHARACTER_BY_SITE[siteId],
  state: 'SITE_ONLY',
  sourceEventId: null,
  chronologyState: null,
  visibleCharacterGeometryAuthorized: false,
  geometryIdentity: siteId
});

const resolvePresence = (siteId, requested) => {
  if (!requested) return presenceDefault(siteId);
  if (!CARDINAL_PRESENCE_STATES.includes(requested.state)) throw new RangeError(`INVALID_PRESENCE_STATE:${siteId}`);
  if (requested.state === 'SITE_ONLY') return presenceDefault(siteId);
  if (!hasText(requested.sourceEventId) || !hasText(requested.chronologyState)) throw new RangeError(`UNSOURCED_PRESENCE_STATE:${siteId}`);
  return deepFreeze({
    siteId,
    characterId: CARDINAL_CHARACTER_BY_SITE[siteId],
    state: requested.state,
    sourceEventId: requested.sourceEventId,
    chronologyState: requested.chronologyState,
    visibleCharacterGeometryAuthorized: requested.visibleCharacterGeometryAuthorized === true,
    geometryIdentity: siteId
  });
};

const availabilityDefault = (slot) => deepFreeze({
  discoveryId: slot.id,
  siteId: slot.siteId,
  state: 'HELD',
  predicateReceiptId: null,
  chronologyState: null
});

const resolveAvailability = (slot, requested) => {
  if (!requested) return availabilityDefault(slot);
  if (!DISCOVERY_AVAILABILITY_STATES.includes(requested.state)) throw new RangeError(`INVALID_DISCOVERY_AVAILABILITY:${slot.id}`);
  if (requested.state === 'AVAILABLE' && (!hasText(requested.predicateReceiptId) || !hasText(requested.chronologyState))) throw new RangeError(`UNSOURCED_DISCOVERY_AVAILABILITY:${slot.id}`);
  return deepFreeze({
    discoveryId: slot.id,
    siteId: slot.siteId,
    state: requested.state,
    predicateReceiptId: hasText(requested.predicateReceiptId) ? requested.predicateReceiptId : null,
    chronologyState: hasText(requested.chronologyState) ? requested.chronologyState : null
  });
};

const relationKey = (fromSiteId, toSiteId) => `${fromSiteId}->${toSiteId}`;

const resolveRelations = (relations = []) => {
  const resolved = {};
  for (const relation of relations) {
    if (!CARDINAL_SITE_IDS.includes(relation?.fromSiteId) || !CARDINAL_SITE_IDS.includes(relation?.toSiteId) || relation.fromSiteId === relation.toSiteId) throw new RangeError('INVALID_CARDINAL_RELATION');
    if (!hasText(relation.sourceEventId)) throw new RangeError(`UNSOURCED_CARDINAL_RELATION:${relation.fromSiteId}:${relation.toSiteId}`);
    const key = relationKey(relation.fromSiteId, relation.toSiteId);
    resolved[key] = deepFreeze({
      key,
      fromSiteId: relation.fromSiteId,
      toSiteId: relation.toSiteId,
      sourceEventId: relation.sourceEventId,
      chronologyState: hasText(relation.chronologyState) ? relation.chronologyState : null
    });
  }
  return deepFreeze(resolved);
};

const normalizeStoryState = (storyState = {}) => {
  const presenceBySite = {};
  for (const siteId of CARDINAL_SITE_IDS) presenceBySite[siteId] = resolvePresence(siteId, storyState.presenceBySite?.[siteId]);

  const discoveryAvailabilityById = {};
  for (const slot of CARDINAL_DISCOVERY_SLOTS) discoveryAvailabilityById[slot.id] = resolveAvailability(slot, storyState.discoveryAvailabilityById?.[slot.id]);

  return deepFreeze({
    storyReceiptId: hasText(storyState.storyReceiptId) ? storyState.storyReceiptId : 'TASK19_DEFAULT_HELD_STORY_STATE',
    chronologyState: hasText(storyState.chronologyState) ? storyState.chronologyState : null,
    presenceBySite,
    discoveryAvailabilityById,
    relations: resolveRelations(storyState.revealedRelations)
  });
};

const defaultFaces = () => Object.fromEntries(CARDINAL_DISCOVERY_SLOTS.map((slot) => [slot.id, 'FACE_A_RECORD']));

const composeState = (fields) => deepFreeze({
  version: CARDINAL_SCENE_STATE_VERSION,
  phase: fields.phase,
  selectedSiteId: fields.selectedSiteId,
  activeSiteId: fields.activeSiteId,
  pendingTravel: fields.pendingTravel,
  activeDiscoveryId: fields.activeDiscoveryId,
  activeCardFace: fields.activeDiscoveryId ? fields.cardFacesByDiscoveryId[fields.activeDiscoveryId] : null,
  discoveredIds: deepFreeze([...fields.discoveredIds]),
  cardFacesByDiscoveryId: deepFreeze(cloneRecord(fields.cardFacesByDiscoveryId)),
  story: fields.story,
  transitionCount: fields.transitionCount,
  lastTransition: fields.lastTransition,
  returnTarget: 'WORLD_MAP',
  completionMetric: null,
  sessionPersistence: 'IN_MEMORY_ONLY_NO_CROSS_SESSION_HIDDEN_KNOWLEDGE_LEAK'
});

export function createCardinalSceneState({ storyState = {} } = {}) {
  return composeState({
    phase: 'WORLD_MAP',
    selectedSiteId: null,
    activeSiteId: null,
    pendingTravel: null,
    activeDiscoveryId: null,
    discoveredIds: [],
    cardFacesByDiscoveryId: defaultFaces(),
    story: normalizeStoryState(storyState),
    transitionCount: 0,
    lastTransition: deepFreeze({ eventType: 'CANONICAL_WORLD_ENTRY', accepted: true, reason: 'INITIAL_STATE' })
  });
}

export function createCanonicalCardinalWorldEntry({ entryMode = 'INTRO_COMPLETE', storyState = {} } = {}) {
  if (!['INTRO_COMPLETE', 'INTRO_SKIPPED'].includes(entryMode)) throw new RangeError('INVALID_CANONICAL_ENTRY_MODE');
  // entryMode is deliberately not persisted: skip and completion enter the
  // identical canonical world state.
  return createCardinalSceneState({ storyState });
}

const fieldsFrom = (state) => ({
  phase: state.phase,
  selectedSiteId: state.selectedSiteId,
  activeSiteId: state.activeSiteId,
  pendingTravel: state.pendingTravel,
  activeDiscoveryId: state.activeDiscoveryId,
  discoveredIds: [...state.discoveredIds],
  cardFacesByDiscoveryId: cloneRecord(state.cardFacesByDiscoveryId),
  story: state.story,
  transitionCount: state.transitionCount,
  lastTransition: state.lastTransition
});

const transitionReceipt = (state, eventType, accepted, reason) => deepFreeze({
  schema: 'TASK19_CARDINAL_SCENE_TRANSITION_RECEIPT_v1',
  eventType,
  accepted,
  reason,
  priorTransitionCount: state.transitionCount,
  nextTransitionCount: accepted ? state.transitionCount + 1 : state.transitionCount
});

const rejected = (state, eventType, reason) => deepFreeze({ state, receipt: transitionReceipt(state, eventType, false, reason) });

const accepted = (state, eventType, reason, mutate) => {
  const fields = fieldsFrom(state);
  mutate(fields);
  fields.transitionCount = state.transitionCount + 1;
  fields.lastTransition = deepFreeze({ eventType, accepted: true, reason });
  const nextState = composeState(fields);
  return deepFreeze({ state: nextState, receipt: transitionReceipt(state, eventType, true, reason) });
};

const siteAvailableDiscoveries = (state, siteId) => CARDINAL_DISCOVERY_SLOTS.filter((slot) => slot.siteId === siteId && state.story.discoveryAvailabilityById[slot.id].state === 'AVAILABLE');

export function deriveCardinalSiteState(state, siteId) {
  if (!CARDINAL_SITE_IDS.includes(siteId)) throw new RangeError(`UNKNOWN_CARDINAL_SITE:${siteId}`);
  const presence = state.story.presenceBySite[siteId];
  const discoveries = CARDINAL_DISCOVERY_SLOTS.filter((slot) => slot.siteId === siteId).map((slot) => deepFreeze({
    ...slot,
    availability: state.story.discoveryAvailabilityById[slot.id],
    discovered: state.discoveredIds.includes(slot.id),
    persistedFace: state.cardFacesByDiscoveryId[slot.id]
  }));
  return deepFreeze({
    siteId,
    characterId: CARDINAL_CHARACTER_BY_SITE[siteId],
    presence,
    geometryIdentity: siteId,
    geometryPersistsAcrossPresenceStates: true,
    inspectionAvailable: discoveries.some((entry) => entry.availability.state === 'AVAILABLE'),
    discoveries,
    revealedRelations: Object.values(state.story.relations).filter((relation) => relation.fromSiteId === siteId),
    active: state.activeSiteId === siteId,
    selected: state.selectedSiteId === siteId
  });
}

export function deriveCardinalSceneView(state) {
  const sites = Object.fromEntries(CARDINAL_SITE_IDS.map((siteId) => [siteId, deriveCardinalSiteState(state, siteId)]));
  const activeSite = state.activeSiteId ? sites[state.activeSiteId] : null;
  return deepFreeze({
    version: 'CARDINAL_SCENE_VIEW_TASK19_v1',
    phase: state.phase,
    sites: deepFreeze(sites),
    activeSite,
    activeDiscoveryId: state.activeDiscoveryId,
    activeCardFace: state.activeCardFace,
    actions: deepFreeze({
      maySelectSignal: state.phase === 'WORLD_MAP',
      mayBeginApproach: state.phase === 'DISTANT_SIGNAL' && Boolean(state.selectedSiteId),
      mayCompleteArrival: state.phase === 'SURVEY_APPROACH' && Boolean(state.selectedSiteId),
      mayInspect: state.phase === 'SITE_ARRIVAL' && Boolean(activeSite?.inspectionAvailable),
      mayOpenDiscovery: state.phase === 'LOCAL_INSPECTION',
      mayFlipOrDismissCard: state.phase === 'KNOWLEDGE_CARD' && Boolean(state.activeDiscoveryId),
      mayReturnToMap: state.phase !== 'WORLD_MAP'
    }),
    completionMetric: null
  });
}

export function applyCardinalSceneEvent(state, event = {}) {
  if (state?.version !== CARDINAL_SCENE_STATE_VERSION) throw new TypeError('INVALID_CARDINAL_SCENE_STATE');
  const type = event.type;
  if (!hasText(type)) return rejected(state, 'UNKNOWN', 'EVENT_TYPE_REQUIRED');

  if (type === 'SELECT_SITE_SIGNAL') {
    if (state.phase !== 'WORLD_MAP') return rejected(state, type, 'SIGNAL_SELECTION_REQUIRES_WORLD_MAP');
    if (!CARDINAL_SITE_IDS.includes(event.siteId)) return rejected(state, type, 'UNKNOWN_CARDINAL_SITE');
    return accepted(state, type, 'DISTANT_SIGNAL_SELECTED_NOT_INSPECTED', (fields) => {
      fields.phase = 'DISTANT_SIGNAL';
      fields.selectedSiteId = event.siteId;
      fields.activeSiteId = null;
      fields.pendingTravel = null;
      fields.activeDiscoveryId = null;
    });
  }

  if (type === 'BEGIN_SURVEY_APPROACH') {
    if (state.phase !== 'DISTANT_SIGNAL' || !state.selectedSiteId) return rejected(state, type, 'APPROACH_REQUIRES_SELECTED_DISTANT_SIGNAL');
    return accepted(state, type, 'AUTHORED_SURVEY_APPROACH_BEGUN', (fields) => {
      fields.phase = 'SURVEY_APPROACH';
      fields.pendingTravel = deepFreeze({ kind: 'SIGNAL_APPROACH', toSiteId: state.selectedSiteId });
    });
  }

  if (type === 'COMPLETE_SITE_ARRIVAL') {
    if (state.phase !== 'SURVEY_APPROACH' || !state.selectedSiteId) return rejected(state, type, 'ARRIVAL_REQUIRES_ACTIVE_SURVEY_APPROACH');
    return accepted(state, type, 'PRESENCE_RESOLVED_BEFORE_INSPECTION', (fields) => {
      fields.phase = 'SITE_ARRIVAL';
      fields.activeSiteId = state.selectedSiteId;
      fields.pendingTravel = null;
      fields.activeDiscoveryId = null;
    });
  }

  if (type === 'BEGIN_LOCAL_INSPECTION') {
    if (state.phase !== 'SITE_ARRIVAL' || !state.activeSiteId) return rejected(state, type, 'INSPECTION_REQUIRES_SITE_ARRIVAL');
    if (siteAvailableDiscoveries(state, state.activeSiteId).length === 0) return rejected(state, type, 'NO_SOURCE_AUTHORIZED_DISCOVERY_AVAILABLE');
    return accepted(state, type, 'LOCAL_INSPECTION_BEGUN_AFTER_PRESENCE_RESOLUTION', (fields) => {
      fields.phase = 'LOCAL_INSPECTION';
    });
  }

  if (type === 'OPEN_DISCOVERY_CARD') {
    if (state.phase !== 'LOCAL_INSPECTION' || !state.activeSiteId) return rejected(state, type, 'DISCOVERY_REQUIRES_LOCAL_INSPECTION');
    const slot = DISCOVERY_BY_ID.get(event.discoveryId);
    if (!slot || slot.siteId !== state.activeSiteId) return rejected(state, type, 'DISCOVERY_NOT_IN_ACTIVE_SITE');
    if (state.story.discoveryAvailabilityById[slot.id].state !== 'AVAILABLE') return rejected(state, type, 'DISCOVERY_NOT_SOURCE_AUTHORIZED');
    return accepted(state, type, 'TWO_SIDED_KNOWLEDGE_CARD_OPENED', (fields) => {
      fields.phase = 'KNOWLEDGE_CARD';
      fields.activeDiscoveryId = slot.id;
      fields.discoveredIds = unique([...fields.discoveredIds, slot.id]);
    });
  }

  if (type === 'FLIP_DISCOVERY_CARD') {
    if (state.phase !== 'KNOWLEDGE_CARD' || !state.activeDiscoveryId) return rejected(state, type, 'CARD_FLIP_REQUIRES_OPEN_CARD');
    return accepted(state, type, 'CARD_FACE_CHANGED_SEMANTICALLY', (fields) => {
      const current = fields.cardFacesByDiscoveryId[state.activeDiscoveryId];
      fields.cardFacesByDiscoveryId[state.activeDiscoveryId] = current === 'FACE_A_RECORD' ? 'FACE_B_SIGNIFICANCE' : 'FACE_A_RECORD';
    });
  }

  if (type === 'DISMISS_DISCOVERY_CARD') {
    if (state.phase !== 'KNOWLEDGE_CARD' || !state.activeDiscoveryId) return rejected(state, type, 'CARD_DISMISS_REQUIRES_OPEN_CARD');
    return accepted(state, type, 'CARD_DISMISSED_FACE_PRESERVED_IN_SESSION', (fields) => {
      fields.phase = 'LOCAL_INSPECTION';
      fields.activeDiscoveryId = null;
    });
  }

  if (type === 'CONTINUE_SITE_INSPECTION') {
    if (!['SITE_ARRIVAL', 'LOCAL_INSPECTION'].includes(state.phase) || !state.activeSiteId) return rejected(state, type, 'CONTINUE_REQUIRES_ACTIVE_SITE');
    if (siteAvailableDiscoveries(state, state.activeSiteId).length === 0) return rejected(state, type, 'NO_SOURCE_AUTHORIZED_DISCOVERY_AVAILABLE');
    return accepted(state, type, 'SITE_INSPECTION_CONTINUES_WITHOUT_COMPLETION_PRESSURE', (fields) => {
      fields.phase = 'LOCAL_INSPECTION';
      fields.activeDiscoveryId = null;
    });
  }

  if (type === 'FOLLOW_REVEALED_RELATION') {
    if (!state.activeSiteId || !['SITE_ARRIVAL', 'LOCAL_INSPECTION', 'KNOWLEDGE_CARD'].includes(state.phase)) return rejected(state, type, 'RELATION_TRAVEL_REQUIRES_ACTIVE_SITE');
    if (!CARDINAL_SITE_IDS.includes(event.toSiteId)) return rejected(state, type, 'UNKNOWN_RELATION_TARGET');
    const relation = state.story.relations[relationKey(state.activeSiteId, event.toSiteId)];
    if (!relation) return rejected(state, type, 'RELATION_NOT_EXPLICITLY_REVEALED');
    return accepted(state, type, 'REVEALED_RELATION_SURVEY_BEGUN', (fields) => {
      fields.phase = 'SURVEY_APPROACH';
      fields.selectedSiteId = event.toSiteId;
      fields.activeSiteId = null;
      fields.pendingTravel = deepFreeze({ kind: 'REVEALED_RELATION', fromSiteId: relation.fromSiteId, toSiteId: relation.toSiteId, sourceEventId: relation.sourceEventId });
      fields.activeDiscoveryId = null;
    });
  }

  if (type === 'RETURN_TO_MAP') {
    if (state.phase === 'WORLD_MAP') return rejected(state, type, 'ALREADY_AT_WORLD_MAP');
    return accepted(state, type, 'CANONICAL_MAP_STATE_RESTORED_SESSION_DISCOVERY_PRESERVED', (fields) => {
      fields.phase = 'WORLD_MAP';
      fields.selectedSiteId = null;
      fields.activeSiteId = null;
      fields.pendingTravel = null;
      fields.activeDiscoveryId = null;
    });
  }

  return rejected(state, type, 'UNRECOGNIZED_OR_UNAUTHORIZED_EVENT');
}

export function synchronizeCardinalStoryState(state, storyState) {
  if (state?.version !== CARDINAL_SCENE_STATE_VERSION) throw new TypeError('INVALID_CARDINAL_SCENE_STATE');
  const story = normalizeStoryState(storyState);
  const fields = fieldsFrom(state);
  fields.story = story;
  const activeDiscoveryStillAvailable = !fields.activeDiscoveryId || story.discoveryAvailabilityById[fields.activeDiscoveryId].state === 'AVAILABLE';
  if (!activeDiscoveryStillAvailable) {
    fields.activeDiscoveryId = null;
    fields.phase = fields.activeSiteId ? 'SITE_ARRIVAL' : 'WORLD_MAP';
  }
  fields.transitionCount = state.transitionCount + 1;
  fields.lastTransition = deepFreeze({ eventType: 'SYNCHRONIZE_STORY_STATE', accepted: true, reason: 'EXPLICIT_STORY_RECEIPT_REPLACED' });
  return composeState(fields);
}

const transitionSequence = (initial, events) => {
  let state = initial;
  const receipts = [];
  for (const event of events) {
    const result = applyCardinalSceneEvent(state, event);
    receipts.push(result.receipt);
    state = result.state;
  }
  return deepFreeze({ state, receipts });
};

export function evaluateCardinalSceneStateContract() {
  const issues = [];
  const assert = (condition, issue) => { if (!condition) issues.push(issue); };
  const fixtureStory = {
    storyReceiptId: 'TASK19_STATE_EVALUATION_FIXTURE_v1',
    chronologyState: 'P12',
    presenceBySite: {
      WATERLINE_STATION: { state: 'CHARACTER_TRACE', sourceEventId: 'FIXTURE_TARIAN_TRACE', chronologyState: 'P12' },
      SIGNAL_LANTERN_FIELD: { state: 'CHARACTER_PRESENT', sourceEventId: 'FIXTURE_ELARA_PRESENT', chronologyState: 'P12', visibleCharacterGeometryAuthorized: false }
    },
    discoveryAvailabilityById: {
      ALARIC_ROUTE_TABLE: { state: 'AVAILABLE', predicateReceiptId: 'FIXTURE_ALARIC_ROUTE_AVAILABLE', chronologyState: 'P12' },
      ALARIC_THRESHOLD_GATE: { state: 'AVAILABLE', predicateReceiptId: 'FIXTURE_ALARIC_GATE_AVAILABLE', chronologyState: 'P12' },
      TARIAN_TIDE_STAFF: { state: 'AVAILABLE', predicateReceiptId: 'FIXTURE_TARIAN_TIDE_AVAILABLE', chronologyState: 'P12' }
    },
    revealedRelations: [
      { fromSiteId: 'WATCHFIRE_OVERLOOK', toSiteId: 'WATERLINE_STATION', sourceEventId: 'FIXTURE_NORTH_SOUTH_RELATION', chronologyState: 'P12' }
    ]
  };

  const introComplete = createCanonicalCardinalWorldEntry({ entryMode: 'INTRO_COMPLETE', storyState: fixtureStory });
  const introSkipped = createCanonicalCardinalWorldEntry({ entryMode: 'INTRO_SKIPPED', storyState: fixtureStory });
  assert(JSON.stringify(introComplete) === JSON.stringify(introSkipped), 'INTRO_SKIP_STATE_DIVERGENCE');
  assert(CARDINAL_SITE_IDS.every((siteId) => introComplete.story.presenceBySite[siteId].geometryIdentity === siteId), 'SITE_GEOMETRY_IDENTITY_NOT_PERSISTENT');
  assert(introComplete.story.presenceBySite.WATCHFIRE_OVERLOOK.state === 'SITE_ONLY', 'DEFAULT_SITE_ONLY_FAILURE');
  assert(introComplete.story.presenceBySite.WATERLINE_STATION.state === 'CHARACTER_TRACE', 'EXPLICIT_TRACE_RESOLUTION_FAILURE');
  assert(introComplete.story.presenceBySite.SIGNAL_LANTERN_FIELD.state === 'CHARACTER_PRESENT', 'EXPLICIT_PRESENT_RESOLUTION_FAILURE');
  assert(introComplete.story.presenceBySite.SIGNAL_LANTERN_FIELD.visibleCharacterGeometryAuthorized === false, 'PRESENCE_IMPROPERLY_AUTHORIZED_CHARACTER_GEOMETRY');

  const selected = applyCardinalSceneEvent(introComplete, { type: 'SELECT_SITE_SIGNAL', siteId: 'WATCHFIRE_OVERLOOK' });
  assert(selected.receipt.accepted && selected.state.phase === 'DISTANT_SIGNAL' && selected.state.activeSiteId === null, 'SELECT_EQUALS_INSPECT_FAILURE');
  const prematureInspect = applyCardinalSceneEvent(selected.state, { type: 'BEGIN_LOCAL_INSPECTION' });
  assert(!prematureInspect.receipt.accepted && prematureInspect.state === selected.state, 'PREMATURE_INSPECTION_NOT_FAIL_CLOSED');

  const sequence = transitionSequence(selected.state, [
    { type: 'BEGIN_SURVEY_APPROACH' },
    { type: 'COMPLETE_SITE_ARRIVAL' },
    { type: 'BEGIN_LOCAL_INSPECTION' },
    { type: 'OPEN_DISCOVERY_CARD', discoveryId: 'ALARIC_ROUTE_TABLE' },
    { type: 'FLIP_DISCOVERY_CARD' },
    { type: 'DISMISS_DISCOVERY_CARD' },
    { type: 'OPEN_DISCOVERY_CARD', discoveryId: 'ALARIC_ROUTE_TABLE' }
  ]);
  assert(sequence.receipts.every((receipt) => receipt.accepted), 'LAWFUL_SITE_SEQUENCE_REJECTED');
  assert(sequence.state.phase === 'KNOWLEDGE_CARD' && sequence.state.activeCardFace === 'FACE_B_SIGNIFICANCE', 'CARD_FACE_SESSION_PERSISTENCE_FAILURE');
  assert(sequence.state.discoveredIds.includes('ALARIC_ROUTE_TABLE'), 'DISCOVERY_HISTORY_NOT_PRESERVED');
  assert(sequence.state.completionMetric === null, 'COMPLETION_METER_INTRODUCED');

  const heldDiscovery = transitionSequence(introComplete, [
    { type: 'SELECT_SITE_SIGNAL', siteId: 'RESTORATION_BOUNDARY' },
    { type: 'BEGIN_SURVEY_APPROACH' },
    { type: 'COMPLETE_SITE_ARRIVAL' },
    { type: 'BEGIN_LOCAL_INSPECTION' }
  ]);
  assert(heldDiscovery.receipts.at(-1).accepted === false && heldDiscovery.state.phase === 'SITE_ARRIVAL', 'HELD_DISCOVERY_DID_NOT_FAIL_CLOSED');

  const relationTravel = applyCardinalSceneEvent(sequence.state, { type: 'FOLLOW_REVEALED_RELATION', toSiteId: 'WATERLINE_STATION' });
  assert(relationTravel.receipt.accepted && relationTravel.state.phase === 'SURVEY_APPROACH' && relationTravel.state.pendingTravel.kind === 'REVEALED_RELATION', 'EXPLICIT_RELATION_TRAVEL_FAILURE');
  const unrevealedRelation = applyCardinalSceneEvent(sequence.state, { type: 'FOLLOW_REVEALED_RELATION', toSiteId: 'SIGNAL_LANTERN_FIELD' });
  assert(!unrevealedRelation.receipt.accepted && unrevealedRelation.state === sequence.state, 'UNREVEALED_RELATION_DID_NOT_FAIL_CLOSED');

  const returned = applyCardinalSceneEvent(sequence.state, { type: 'RETURN_TO_MAP' });
  assert(returned.receipt.accepted && returned.state.phase === 'WORLD_MAP' && returned.state.activeSiteId === null && returned.state.activeDiscoveryId === null, 'RETURN_TO_MAP_STATE_FAILURE');
  assert(returned.state.discoveredIds.includes('ALARIC_ROUTE_TABLE') && returned.state.cardFacesByDiscoveryId.ALARIC_ROUTE_TABLE === 'FACE_B_SIGNIFICANCE', 'RETURN_TO_MAP_DROPPED_SESSION_STATE');

  let unsourcedPresenceRejected = false;
  try { createCardinalSceneState({ storyState: { presenceBySite: { WATCHFIRE_OVERLOOK: { state: 'CHARACTER_PRESENT' } } } }); } catch { unsourcedPresenceRejected = true; }
  assert(unsourcedPresenceRejected, 'UNSOURCED_PRESENCE_ACCEPTED');
  let unsourcedDiscoveryRejected = false;
  try { createCardinalSceneState({ storyState: { discoveryAvailabilityById: { ALARIC_ROUTE_TABLE: { state: 'AVAILABLE' } } } }); } catch { unsourcedDiscoveryRejected = true; }
  assert(unsourcedDiscoveryRejected, 'UNSOURCED_DISCOVERY_AVAILABILITY_ACCEPTED');

  const deterministicA = transitionSequence(createCardinalSceneState({ storyState: fixtureStory }), [
    { type: 'SELECT_SITE_SIGNAL', siteId: 'WATCHFIRE_OVERLOOK' },
    { type: 'BEGIN_SURVEY_APPROACH' },
    { type: 'COMPLETE_SITE_ARRIVAL' }
  ]);
  const deterministicB = transitionSequence(createCardinalSceneState({ storyState: fixtureStory }), [
    { type: 'SELECT_SITE_SIGNAL', siteId: 'WATCHFIRE_OVERLOOK' },
    { type: 'BEGIN_SURVEY_APPROACH' },
    { type: 'COMPLETE_SITE_ARRIVAL' }
  ]);
  assert(JSON.stringify(deterministicA) === JSON.stringify(deterministicB), 'DETERMINISTIC_REPLAY_DIVERGENCE');

  const counts = Object.fromEntries(CARDINAL_SITE_IDS.map((siteId) => [siteId, CARDINAL_DISCOVERY_SLOTS.filter((slot) => slot.siteId === siteId).length]));
  assert(JSON.stringify(Object.values(counts)) === JSON.stringify([5, 6, 6, 6]), 'DISCOVERY_SLOT_DISTRIBUTION_DRIFT');

  return deepFreeze({
    schema: 'TASK19_CARDINAL_SCENE_STATE_VERIFICATION_RECEIPT_v1',
    result: issues.length === 0 ? 'PASS_PROTECTED_CARDINAL_SCENE_STATE' : 'HELD_CARDINAL_SCENE_STATE',
    eligible: issues.length === 0,
    siteCount: CARDINAL_SITE_IDS.length,
    discoverySlotCount: CARDINAL_DISCOVERY_SLOTS.length,
    discoverySlotDistribution: counts,
    presenceStates: CARDINAL_PRESENCE_STATES,
    phases: CARDINAL_SCENE_PHASES,
    cardFaces: CARDINAL_CARD_FACES,
    deterministicReplayExact: !issues.includes('DETERMINISTIC_REPLAY_DIVERGENCE'),
    issues,
    boundaries: {
      geometryConstructed: false,
      discoveryContentBound: false,
      characterModelAuthorityCreated: false,
      mapUiConstructed: false,
      cinematicRendererConstructed: false,
      crossSessionPersistenceCreated: false,
      completionMeterCreated: false
    }
  });
}

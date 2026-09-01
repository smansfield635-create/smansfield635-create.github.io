/**
 * Task 19 reversible knowledge-card interaction contract.
 *
 * This is a pure controller and presentation model. It creates no DOM,
 * navigation side effect, persistence layer or public route. The later page
 * integration may render only the actions resolved here and must preserve the
 * semantic distinction between local scene actions and cross-estate routes.
 */

import {
  CARDINAL_CARD_FACES,
  CARDINAL_CHARACTER_BY_SITE,
  CARDINAL_SCENE_STATE_VERSION,
  applyCardinalSceneEvent,
  createCardinalSceneState
} from './cardinal-scene-state.mjs';
import {
  CARDINAL_DISCOVERIES,
  getCardinalDiscovery,
  evaluateCardinalScenesData
} from './cardinal-scenes.data.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.freeze(value);
};
const hasText = (value) => typeof value === 'string' && value.trim().length > 0;

export const KNOWLEDGE_CARD_CONTRACT_ID = 'CHARACTERS_TASK19_REVERSIBLE_KNOWLEDGE_CARD_v1';

export const KNOWLEDGE_CARD_INPUT_CONTRACT = deepFreeze({
  horizontalSwipeThresholdPx: 36,
  horizontalIntentRatio: 1.25,
  pointerInputs: ['TOUCH', 'PEN', 'MOUSE'],
  activationInputs: ['HORIZONTAL_SWIPE', 'TAP', 'CLICK', 'ENTER', 'SPACE'],
  dismissalInputs: ['DISMISS_CONTROL', 'ESCAPE'],
  standardTransition: 'HORIZONTAL_COIN_ROTATION',
  reducedMotionTransition: 'SEMANTIC_FACE_REPLACEMENT',
  verticalGestureOwnership: 'BROWSER_SCROLL_REMAINS_AVAILABLE',
  pinchGestureOwnership: 'BROWSER_ZOOM_REMAINS_AVAILABLE'
});

export const CARD_FOOTER_ACTION_VARIANTS = deepFreeze({
  LOCAL_CARD: {
    variant: 'LOCAL_CARD',
    styleToken: 'card-footer-tab--local-card',
    leavesCharactersPage: false,
    contrastRequired: false
  },
  LOCAL_WORLD: {
    variant: 'LOCAL_WORLD',
    styleToken: 'card-footer-tab--local-world',
    leavesCharactersPage: false,
    contrastRequired: false
  },
  CHARACTER_CONVERSATION: {
    variant: 'CHARACTER_CONVERSATION',
    styleToken: 'card-footer-tab--character-conversation',
    leavesCharactersPage: false,
    contrastRequired: true
  },
  CROSS_ESTATE_ROUTE: {
    variant: 'CROSS_ESTATE_ROUTE',
    styleToken: 'card-footer-tab--cross-estate',
    leavesCharactersPage: true,
    contrastRequired: true,
    nonColorCues: ['DISTINCT_TAB_SHAPE', 'ROUTE_GLYPH', 'EXPLICIT_LEAVES_SCENE_TEXT', 'ACCESSIBLE_DESTINATION_NAME']
  }
});

const CHARACTER_DISPLAY_NAMES = deepFreeze({
  ALARIC_AXION: 'Alaric',
  TARIAN_MERROW: 'Tarian',
  ELARA_SYLENE: 'Elara',
  SOREN_SEVRIN: 'Soren'
});

// Read-only audit at this stage found no canonical per-character conversation
// destination. A later verified binding may activate one; absence is lawful
// and must remain visually absent rather than becoming a dead link.
export const CARDINAL_CHARACTER_CONVERSATION_BINDINGS = deepFreeze(Object.fromEntries(
  Object.keys(CHARACTER_DISPLAY_NAMES).map((characterId) => [characterId, {
    characterId,
    status: 'HELD_NO_CANONICAL_DESTINATION_VERIFIED',
    destination: null,
    exposed: false
  }])
));

const nextFace = (face) => face === 'FACE_A_RECORD' ? 'FACE_B_SIGNIFICANCE' : 'FACE_A_RECORD';
const transitionFor = (reducedMotion) => reducedMotion ? KNOWLEDGE_CARD_INPUT_CONTRACT.reducedMotionTransition : KNOWLEDGE_CARD_INPUT_CONTRACT.standardTransition;

const acceptedInteraction = ({ inputKind, eventType, currentFace, reducedMotion, reason }) => deepFreeze({
  accepted: true,
  inputKind,
  reason,
  sceneEvent: { type: eventType },
  currentFace,
  nextFace: eventType === 'FLIP_DISCOVERY_CARD' ? nextFace(currentFace) : currentFace,
  transition: eventType === 'FLIP_DISCOVERY_CARD' ? transitionFor(reducedMotion) : 'NO_FACE_TRANSITION'
});

const ignoredInteraction = (inputKind, reason, currentFace) => deepFreeze({
  accepted: false,
  inputKind,
  reason,
  sceneEvent: null,
  currentFace,
  nextFace: currentFace,
  transition: 'NONE'
});

export function interpretKnowledgeCardInput({
  kind,
  key = null,
  startX = 0,
  startY = 0,
  endX = 0,
  endY = 0,
  currentFace = 'FACE_A_RECORD',
  reducedMotion = false
} = {}) {
  if (!CARDINAL_CARD_FACES.includes(currentFace)) throw new RangeError(`UNKNOWN_KNOWLEDGE_CARD_FACE:${currentFace}`);
  if (!hasText(kind)) return ignoredInteraction('UNKNOWN', 'INPUT_KIND_REQUIRED', currentFace);

  if (kind === 'DISMISS_CONTROL' || (kind === 'KEYBOARD' && key === 'Escape')) {
    return acceptedInteraction({ inputKind: kind, eventType: 'DISMISS_DISCOVERY_CARD', currentFace, reducedMotion, reason: 'DISMISS_FROM_EITHER_FACE' });
  }

  if (kind === 'CLICK_FACE' || kind === 'TAP_FACE' || (kind === 'KEYBOARD' && ['Enter', ' ', 'Spacebar'].includes(key))) {
    return acceptedInteraction({ inputKind: kind, eventType: 'FLIP_DISCOVERY_CARD', currentFace, reducedMotion, reason: 'EQUIVALENT_SEMANTIC_FACE_ACTIVATION' });
  }

  if (kind === 'POINTER_GESTURE') {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const horizontal = Math.abs(deltaX) >= KNOWLEDGE_CARD_INPUT_CONTRACT.horizontalSwipeThresholdPx
      && Math.abs(deltaX) >= Math.abs(deltaY) * KNOWLEDGE_CARD_INPUT_CONTRACT.horizontalIntentRatio;
    if (horizontal) return acceptedInteraction({ inputKind: 'HORIZONTAL_SWIPE', eventType: 'FLIP_DISCOVERY_CARD', currentFace, reducedMotion, reason: 'HORIZONTAL_SWIPE_COIN_ROTATION' });
    if (Math.abs(deltaY) > Math.abs(deltaX)) return ignoredInteraction(kind, 'VERTICAL_SCROLL_REMAINS_BROWSER_OWNED', currentFace);
    return ignoredInteraction(kind, 'GESTURE_BELOW_FLIP_THRESHOLD', currentFace);
  }

  return ignoredInteraction(kind, 'INPUT_NOT_BOUND_TO_CARD_ACTION', currentFace);
}

export function dispatchKnowledgeCardInput(sceneState, input) {
  if (sceneState?.version !== CARDINAL_SCENE_STATE_VERSION) throw new TypeError('INVALID_CARDINAL_SCENE_STATE');
  if (sceneState.phase !== 'KNOWLEDGE_CARD' || !sceneState.activeDiscoveryId) throw new RangeError('KNOWLEDGE_CARD_INPUT_REQUIRES_OPEN_CARD');
  const interpretation = interpretKnowledgeCardInput({ ...input, currentFace: sceneState.activeCardFace });
  if (!interpretation.accepted) return deepFreeze({ state: sceneState, interpretation, sceneReceipt: null });
  const result = applyCardinalSceneEvent(sceneState, interpretation.sceneEvent);
  return deepFreeze({ state: result.state, interpretation, sceneReceipt: result.receipt });
}

export function deriveKnowledgeCardPresentation(sceneState, { reducedMotion = false } = {}) {
  if (sceneState?.version !== CARDINAL_SCENE_STATE_VERSION) throw new TypeError('INVALID_CARDINAL_SCENE_STATE');
  if (sceneState.phase !== 'KNOWLEDGE_CARD' || !sceneState.activeDiscoveryId) throw new RangeError('KNOWLEDGE_CARD_PRESENTATION_REQUIRES_OPEN_CARD');
  const discovery = getCardinalDiscovery(sceneState.activeDiscoveryId);
  const currentFace = sceneState.activeCardFace;
  const visibleFace = currentFace === 'FACE_A_RECORD' ? discovery.faceA : discovery.faceB;
  const concealedFace = currentFace === 'FACE_A_RECORD' ? discovery.faceB : discovery.faceA;
  return deepFreeze({
    contractId: KNOWLEDGE_CARD_CONTRACT_ID,
    discoveryId: discovery.id,
    siteId: discovery.siteId,
    characterId: discovery.characterId,
    anchorId: discovery.anchorId,
    currentFace,
    visibleFace,
    concealedFace,
    accessibleName: `${CHARACTER_DISPLAY_NAMES[discovery.characterId]} · ${discovery.anchorId.replaceAll('_', ' ')} · ${visibleFace.label}`,
    faceInstruction: currentFace === 'FACE_A_RECORD' ? 'Show significance' : 'Show record',
    motionMode: reducedMotion ? 'REDUCED_MOTION' : 'STANDARD_MOTION',
    faceTransition: transitionFor(reducedMotion),
    dismissibleFromCurrentFace: true,
    sessionFacePersistence: true,
    crossSessionPersistence: false,
    completionMetric: null
  });
}

const validateDestination = (destination) => {
  if (!destination || destination.verification !== 'VERIFIED_CANONICAL_DESTINATION' || !hasText(destination.characterId) || !hasText(destination.destinationId)) return null;
  if (!['IN_PAGE_CHARACTER_INTERACTION', 'CROSS_ESTATE_ROUTE'].includes(destination.kind)) return null;
  if (destination.kind === 'CROSS_ESTATE_ROUTE' && (!hasText(destination.href) || !destination.href.startsWith('/'))) return null;
  if (!hasText(destination.provenance)) return null;
  return destination;
};

const action = ({ id, label, eventType = null, variant, destination = null, description }) => deepFreeze({
  id,
  label,
  description,
  eventType,
  variant: CARD_FOOTER_ACTION_VARIANTS[variant],
  destination,
  exposed: true
});

export function resolveKnowledgeCardFooterActions(sceneState, { verifiedDestinations = [] } = {}) {
  if (sceneState?.version !== CARDINAL_SCENE_STATE_VERSION) throw new TypeError('INVALID_CARDINAL_SCENE_STATE');
  if (sceneState.phase !== 'KNOWLEDGE_CARD' || !sceneState.activeSiteId) throw new RangeError('CARD_FOOTER_ACTIONS_REQUIRE_OPEN_CARD');
  const characterId = CARDINAL_CHARACTER_BY_SITE[sceneState.activeSiteId];
  const presence = sceneState.story.presenceBySite[sceneState.activeSiteId];
  const actions = [
    action({ id: 'DISMISS_CARD', label: 'Continue inspecting', eventType: 'DISMISS_DISCOVERY_CARD', variant: 'LOCAL_CARD', description: 'Close this card and remain at the current site.' }),
    action({ id: 'RETURN_TO_MAP', label: 'Return to coast map', eventType: 'RETURN_TO_MAP', variant: 'LOCAL_WORLD', description: 'Leave the card and restore the canonical coast-map state.' })
  ];

  const destination = verifiedDestinations.map(validateDestination).find((entry) => entry?.characterId === characterId) ?? null;
  let talkDisposition = presence.state === 'CHARACTER_PRESENT'
    ? 'HELD_NO_CANONICAL_DESTINATION_VERIFIED'
    : 'HELD_CHARACTER_NOT_PRESENT';

  if (presence.state === 'CHARACTER_PRESENT' && destination) {
    const name = CHARACTER_DISPLAY_NAMES[characterId];
    const crossEstate = destination.kind === 'CROSS_ESTATE_ROUTE';
    actions.push(action({
      id: 'TALK_TO_CHARACTER',
      label: crossEstate ? `Talk to ${name} · Leaves this scene` : `Talk to ${name}`,
      variant: crossEstate ? 'CROSS_ESTATE_ROUTE' : 'CHARACTER_CONVERSATION',
      destination: deepFreeze({ ...destination }),
      description: crossEstate
        ? `Open the verified ${name} destination outside the current Characters scene.`
        : `Begin the verified in-scene interaction with ${name}.`
    }));
    talkDisposition = crossEstate ? 'EXPOSED_VERIFIED_CROSS_ESTATE_ROUTE' : 'EXPOSED_VERIFIED_IN_PAGE_INTERACTION';
  }

  return deepFreeze({
    characterId,
    presenceState: presence.state,
    actions,
    talkDisposition,
    unverifiedDestinationExposed: false,
    distinctionDoesNotRelyOnColorAlone: true,
    navigationSideEffectPerformed: false
  });
}

const openFixtureCard = ({ faceB = false, presenceState = 'CHARACTER_PRESENT' } = {}) => {
  let state = createCardinalSceneState({
    storyState: {
      storyReceiptId: 'TASK19_KNOWLEDGE_CARD_FIXTURE_v1',
      chronologyState: 'FIXTURE_ONLY',
      presenceBySite: {
        WATCHFIRE_OVERLOOK: presenceState === 'SITE_ONLY' ? { state: 'SITE_ONLY' } : {
          state: presenceState,
          sourceEventId: 'FIXTURE_ALARIC_PRESENCE',
          chronologyState: 'FIXTURE_ONLY'
        }
      },
      discoveryAvailabilityById: {
        ALARIC_ROUTE_TABLE: {
          state: 'AVAILABLE',
          predicateReceiptId: 'FIXTURE_ALARIC_ROUTE_TABLE_AVAILABLE',
          chronologyState: 'FIXTURE_ONLY'
        }
      }
    }
  });
  for (const event of [
    { type: 'SELECT_SITE_SIGNAL', siteId: 'WATCHFIRE_OVERLOOK' },
    { type: 'BEGIN_SURVEY_APPROACH' },
    { type: 'COMPLETE_SITE_ARRIVAL' },
    { type: 'BEGIN_LOCAL_INSPECTION' },
    { type: 'OPEN_DISCOVERY_CARD', discoveryId: 'ALARIC_ROUTE_TABLE' }
  ]) state = applyCardinalSceneEvent(state, event).state;
  if (faceB) state = applyCardinalSceneEvent(state, { type: 'FLIP_DISCOVERY_CARD' }).state;
  return state;
};

export function evaluateKnowledgeCardContract() {
  const issues = [];
  const dataReceipt = evaluateCardinalScenesData();
  if (!dataReceipt.eligible) issues.push(...dataReceipt.issues.map((issue) => `DATA:${issue}`));

  const faceAState = openFixtureCard();
  const click = dispatchKnowledgeCardInput(faceAState, { kind: 'CLICK_FACE' });
  if (!click.sceneReceipt?.accepted || click.state.activeCardFace !== 'FACE_B_SIGNIFICANCE') issues.push('CLICK_FLIP_EQUIVALENCE_FAILURE');
  const enter = dispatchKnowledgeCardInput(faceAState, { kind: 'KEYBOARD', key: 'Enter' });
  if (!enter.sceneReceipt?.accepted || enter.state.activeCardFace !== 'FACE_B_SIGNIFICANCE') issues.push('KEYBOARD_FLIP_EQUIVALENCE_FAILURE');
  const swipe = dispatchKnowledgeCardInput(faceAState, { kind: 'POINTER_GESTURE', startX: 10, startY: 10, endX: 70, endY: 16 });
  if (!swipe.sceneReceipt?.accepted || swipe.interpretation.transition !== 'HORIZONTAL_COIN_ROTATION') issues.push('HORIZONTAL_SWIPE_FAILURE');
  const reduced = interpretKnowledgeCardInput({ kind: 'TAP_FACE', currentFace: 'FACE_A_RECORD', reducedMotion: true });
  if (!reduced.accepted || reduced.transition !== 'SEMANTIC_FACE_REPLACEMENT') issues.push('REDUCED_MOTION_FACE_REPLACEMENT_FAILURE');
  const vertical = dispatchKnowledgeCardInput(faceAState, { kind: 'POINTER_GESTURE', startX: 10, startY: 10, endX: 14, endY: 90 });
  if (vertical.interpretation.accepted || vertical.state !== faceAState) issues.push('VERTICAL_SCROLL_OWNERSHIP_FAILURE');

  const dismissA = dispatchKnowledgeCardInput(faceAState, { kind: 'DISMISS_CONTROL' });
  const faceBState = openFixtureCard({ faceB: true });
  const dismissB = dispatchKnowledgeCardInput(faceBState, { kind: 'KEYBOARD', key: 'Escape' });
  if (!dismissA.sceneReceipt?.accepted || dismissA.state.phase !== 'LOCAL_INSPECTION') issues.push('FACE_A_DISMISS_FAILURE');
  if (!dismissB.sceneReceipt?.accepted || dismissB.state.phase !== 'LOCAL_INSPECTION') issues.push('FACE_B_DISMISS_FAILURE');

  const defaultFooter = resolveKnowledgeCardFooterActions(faceAState);
  if (defaultFooter.actions.some(({ id }) => id === 'TALK_TO_CHARACTER') || defaultFooter.talkDisposition !== 'HELD_NO_CANONICAL_DESTINATION_VERIFIED') issues.push('UNVERIFIED_TALK_DESTINATION_EXPOSED');
  const unverifiedFooter = resolveKnowledgeCardFooterActions(faceAState, { verifiedDestinations: [{ characterId: 'ALARIC_AXION', destinationId: 'UNVERIFIED', kind: 'CROSS_ESTATE_ROUTE', href: '/nowhere/' }] });
  if (unverifiedFooter.actions.some(({ id }) => id === 'TALK_TO_CHARACTER')) issues.push('INVALID_ROUTE_BINDING_EXPOSED');
  const verifiedFooter = resolveKnowledgeCardFooterActions(faceAState, { verifiedDestinations: [{
    verification: 'VERIFIED_CANONICAL_DESTINATION',
    characterId: 'ALARIC_AXION',
    destinationId: 'FIXTURE_VERIFIED_ALARIC_ROOM',
    kind: 'CROSS_ESTATE_ROUTE',
    href: '/fixture-verified-alaric/',
    provenance: 'TASK19_FIXTURE_ONLY'
  }] });
  const externalAction = verifiedFooter.actions.find(({ id }) => id === 'TALK_TO_CHARACTER');
  if (!externalAction || externalAction.variant.variant !== 'CROSS_ESTATE_ROUTE' || !externalAction.variant.nonColorCues?.includes('EXPLICIT_LEAVES_SCENE_TEXT') || !externalAction.label.includes('Leaves this scene')) issues.push('CROSS_ESTATE_ROUTE_NOT_DISTINCT');
  const siteOnlyFooter = resolveKnowledgeCardFooterActions(openFixtureCard({ presenceState: 'SITE_ONLY' }), { verifiedDestinations: [externalAction?.destination].filter(Boolean) });
  if (siteOnlyFooter.actions.some(({ id }) => id === 'TALK_TO_CHARACTER')) issues.push('SITE_ONLY_IMPROPERLY_EXPOSED_TALK_ACTION');

  const presentationA = deriveKnowledgeCardPresentation(faceAState);
  const presentationB = deriveKnowledgeCardPresentation(faceBState, { reducedMotion: true });
  if (presentationA.visibleFace.label !== 'RECORD' || presentationB.visibleFace.label !== 'SIGNIFICANCE') issues.push('CARD_FACE_LABEL_FAILURE');
  if (presentationA.dismissibleFromCurrentFace !== true || presentationB.dismissibleFromCurrentFace !== true || presentationA.crossSessionPersistence !== false) issues.push('CARD_PERSISTENCE_OR_DISMISS_BOUNDARY_FAILURE');

  return deepFreeze({
    schema: 'TASK19_KNOWLEDGE_CARD_CONTRACT_RECEIPT_v1',
    result: issues.length === 0 ? 'PASS_PROTECTED_REVERSIBLE_KNOWLEDGE_CARDS_AND_ROUTE_DISTINCTION' : 'HELD_TASK19_KNOWLEDGE_CARD_CONTRACT',
    eligible: issues.length === 0,
    contractId: KNOWLEDGE_CARD_CONTRACT_ID,
    discoveryCount: CARDINAL_DISCOVERIES.length,
    supportedFaceCount: CARDINAL_CARD_FACES.length,
    inputEquivalence: ['HORIZONTAL_SWIPE', 'TAP', 'CLICK', 'KEYBOARD'],
    reducedMotionEquivalent: true,
    dismissibleFromEitherFace: true,
    defaultConversationDestinationCount: Object.values(CARDINAL_CHARACTER_CONVERSATION_BINDINGS).filter(({ exposed }) => exposed).length,
    crossEstateRouteRequiresVerifiedCanonicalDestination: true,
    crossEstateRouteUsesNonColorDistinction: true,
    issues,
    boundaries: {
      reversibleCardContractConstructed: true,
      routeActionSemanticsConstructed: true,
      unverifiedDestinationExposed: false,
      navigationSideEffectPerformed: false,
      domConstructed: false,
      cssConstructed: false,
      pageIntegrationPerformed: false,
      crossSessionPersistenceCreated: false,
      mergeAuthorityCreated: false,
      deploymentAuthorityCreated: false,
      publicationAuthorityCreated: false
    }
  });
}

export const KNOWLEDGE_CARD = deepFreeze({
  contractId: KNOWLEDGE_CARD_CONTRACT_ID,
  inputContract: KNOWLEDGE_CARD_INPUT_CONTRACT,
  footerVariants: CARD_FOOTER_ACTION_VARIANTS,
  conversationBindings: CARDINAL_CHARACTER_CONVERSATION_BINDINGS,
  interpretInput: interpretKnowledgeCardInput,
  dispatchInput: dispatchKnowledgeCardInput,
  derivePresentation: deriveKnowledgeCardPresentation,
  resolveFooterActions: resolveKnowledgeCardFooterActions,
  evaluate: evaluateKnowledgeCardContract
});

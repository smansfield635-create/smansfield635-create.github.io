/** Task 20 source-bound encounter previews. No new biography, dialogue or chronology. */
import { CARDINAL_CHARACTER_BY_SITE, CARDINAL_SITE_IDS } from './cardinal-scene-state.mjs';
import { CARDINAL_SITE_RECORDS } from './cardinal-scenes.data.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.freeze(value);
};

export const ENCOUNTER_CARD_CONTRACT_ID = 'CHARACTERS_TASK20_SOURCE_BOUND_ENCOUNTER_CARD_v1';
export const CHARACTER_DISPLAY_NAMES = deepFreeze({
  ALARIC_AXION: 'Alaric',
  TARIAN_MERROW: 'Tarian',
  ELARA_SYLENE: 'Elara',
  SOREN_SEVRIN: 'Soren'
});
export const SITE_DISPLAY_NAMES = deepFreeze({
  WATCHFIRE_OVERLOOK: 'Watchfire Overlook',
  WATERLINE_STATION: 'Waterline Station',
  SIGNAL_LANTERN_FIELD: 'Signal Lantern Field',
  RESTORATION_BOUNDARY: 'Restoration Boundary'
});

const words = (value) => value.replaceAll('_', ' ').toLowerCase();
export function deriveEncounterCard(sceneState) {
  if (sceneState?.phase !== 'ENCOUNTER_PREVIEW' || !CARDINAL_SITE_IDS.includes(sceneState.selectedSiteId)) throw new RangeError('ENCOUNTER_PREVIEW_STATE_REQUIRED');
  const siteId = sceneState.selectedSiteId;
  const record = CARDINAL_SITE_RECORDS[siteId];
  const characterId = CARDINAL_CHARACTER_BY_SITE[siteId];
  const presence = sceneState.story.presenceBySite[siteId];
  const characterName = CHARACTER_DISPLAY_NAMES[characterId];
  const placeName = SITE_DISPLAY_NAMES[siteId];
  return deepFreeze({
    contractId: ENCOUNTER_CARD_CONTRACT_ID,
    siteId,
    characterId,
    characterName,
    placeName,
    kicker: `Distant signal · ${characterName}`,
    introduction: `${placeName} asks you to ${words(record.arrivalState)}. Its environmental law is ${record.environmentalLaw.map(words).join(', ')}.`,
    presenceState: presence.state,
    presenceStatement: presence.state === 'SITE_ONLY'
      ? `The place is present. ${characterName} is not inferred to be physically here.`
      : presence.state === 'CHARACTER_TRACE'
        ? `${characterName}'s source-authorized trace is present; physical presence is not inferred.`
        : `${characterName}'s physical presence is source-authorized for this story state.`,
    actions: [
      { id: 'ENTER_CHARACTER_SCENE', label: 'Enter the scene', eventType: 'ENTER_CHARACTER_SCENE' },
      { id: 'CONTINUE_SURVEYING', label: 'Continue surveying', eventType: 'CONTINUE_SURVEYING' }
    ],
    sourceAuthority: 'TASK19_FROZEN_CARDINAL_SITE_RECORD_AND_CURRENT_STORY_RECEIPT',
    spoilerBoundary: 'NO_DISCOVERY_CONTENT_DISCLOSED_BEFORE_SCENE_ENTRY',
    newCharacterCanonCreated: false
  });
}

export function evaluateEncounterCardContract() {
  const issues = [];
  const fixture = {
    phase: 'ENCOUNTER_PREVIEW',
    selectedSiteId: 'WATCHFIRE_OVERLOOK',
    story: { presenceBySite: { WATCHFIRE_OVERLOOK: { state: 'SITE_ONLY' } } }
  };
  const card = deriveEncounterCard(fixture);
  if (card.characterName !== 'Alaric' || card.placeName !== 'Watchfire Overlook') issues.push('IDENTITY_BINDING_DRIFT');
  if (card.actions.map(({ id }) => id).join('>') !== 'ENTER_CHARACTER_SCENE>CONTINUE_SURVEYING') issues.push('ACTION_ARCHITECTURE_DRIFT');
  if (!card.introduction.includes('witness the boundary') || card.newCharacterCanonCreated) issues.push('SOURCE_BOUNDARY_DRIFT');
  return deepFreeze({
    schema: 'TASK20_ENCOUNTER_CARD_RECEIPT_v1',
    result: issues.length ? 'HELD_TASK20_ENCOUNTER_CARD' : 'PASS_TASK20_SOURCE_BOUND_ENCOUNTER_CARD',
    eligible: issues.length === 0,
    siteCount: CARDINAL_SITE_IDS.length,
    issues
  });
}

export const TASK20_ENCOUNTER_CARDS = deepFreeze({ contractId: ENCOUNTER_CARD_CONTRACT_ID, derive: deriveEncounterCard, evaluate: evaluateEncounterCardContract });

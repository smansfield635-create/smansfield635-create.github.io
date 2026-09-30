/**
 * Task 19 frozen cardinal discoveries.
 *
 * The language in this module is bound to the Task 18 architecture preserved
 * in issue #2378. It does not infer new biography, chronology, genealogy,
 * occupancy or character knowledge. Availability remains controlled by the
 * explicit story receipts consumed by cardinal-scene-state.mjs.
 */

import {
  CARDINAL_CHARACTER_BY_SITE,
  CARDINAL_DISCOVERY_SLOTS,
  CARDINAL_SITE_IDS
} from './cardinal-scene-state.mjs';
import {
  CARDINAL_SITE_GEOMETRY_AUTHORITY,
  buildCardinalSiteGeometry
} from './cardinal-scene-geometry.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.freeze(value);
};
const hasText = (value) => typeof value === 'string' && value.trim().length > 0;

export const CARDINAL_SCENES_DATA_CONTRACT_ID = 'CHARACTERS_TASK19_CARDINAL_SCENES_DATA_v1';

export const CARDINAL_DISCOVERY_SOURCE_AUTHORITY = deepFreeze({
  task18Architecture: 'issue:2378#issuecomment-5496668247',
  task19Preparation: 'issue:2378#issuecomment-5496765137',
  hiddenLineageBoundary: 'issue:2378#issuecomment-5496668247:SHARED_REVERSIBLE_CARD_ARCHITECTURE:DEEP_LINEAGE_TIER',
  authorityClass: 'FROZEN_SOURCE_COMPOSITION_NO_NEW_CHARACTER_CANON'
});

export const CARDINAL_SITE_RECORDS = deepFreeze({
  WATCHFIRE_OVERLOOK: {
    siteId: 'WATCHFIRE_OVERLOOK',
    characterId: 'ALARIC_AXION',
    landmarkId: 'WATCHFIRE_AND_ROUTE_TABLE',
    arrivalState: 'WITNESS_THE_BOUNDARY',
    discoveryCount: 5,
    environmentalLaw: ['ORIENTATION', 'BOUNDARY', 'ROUTE_AUTHORITY', 'FALSE_PATH_ELIMINATION', 'LAWFUL_CLOSURE']
  },
  WATERLINE_STATION: {
    siteId: 'WATERLINE_STATION',
    characterId: 'TARIAN_MERROW',
    landmarkId: 'LOAD_BRIDGE_AND_RECOVERY_BASIN',
    arrivalState: 'WITNESS_WHAT_MUST_KEEP_MOVING',
    discoveryCount: 6,
    environmentalLaw: ['CONTINUITY', 'CARRYING', 'CONNECTION', 'RESTORATION', 'PERSISTENCE']
  },
  SIGNAL_LANTERN_FIELD: {
    siteId: 'SIGNAL_LANTERN_FIELD',
    characterId: 'ELARA_SYLENE',
    landmarkId: 'LANTERN_ARRAY_AND_LISTENING_PAVILION',
    arrivalState: 'WITNESS_THE_SIGNAL_BEFORE_THE_CONCLUSION',
    discoveryCount: 6,
    environmentalLaw: ['SIGNAL_EMERGENCE', 'INTERPRETATION', 'CONTRADICTION_PRESERVATION', 'MEANINGFUL_CONNECTION']
  },
  RESTORATION_BOUNDARY: {
    siteId: 'RESTORATION_BOUNDARY',
    characterId: 'SOREN_SEVRIN',
    landmarkId: 'RESTORED_CAUSEWAY_AND_RETURN_LOCK',
    arrivalState: 'WITNESS_WHAT_THE_SURFACE_DENIES',
    discoveryCount: 6,
    environmentalLaw: ['FRACTURE', 'CONTRADICTION', 'FALSE_CONTINUITY', 'UNSTABLE_CERTAINTY', 'LAWFUL_RETURN']
  }
});

const standardKnowledge = deepFreeze({
  audienceKnowledge: 'OBSERVABLE_RECORD_AND_SUPPORTED_MEANING_AVAILABLE_WHEN_DISCOVERY_IS_SOURCE_AUTHORIZED',
  characterKnowledge: 'NOT_INFERRED_FROM_AUDIENCE_DISCOVERY',
  otherCardinalKnowledge: 'NOT_INFERRED_FROM_AUDIENCE_DISCOVERY',
  dextrionKnowledge: 'UNCHANGED_BY_THIS_DISCOVERY_BINDING',
  unsupportedGenealogy: 'PROHIBITED',
  chronologyState: 'HELD_TO_EXPLICIT_STORY_RECEIPT'
});

const deepLineageKnowledge = deepFreeze({
  audienceKnowledge: 'EXPLICIT_HIDDEN_LINEAGE_CONFIRMATION_ALLOWED',
  characterKnowledge: 'NOT_UPGRADED_UNLESS_SEPARATELY_SOURCED',
  otherCardinalKnowledge: 'NOT_UPGRADED',
  dextrionKnowledge: 'GOVERNED_BY_EXISTING_HIDDEN_KNOWLEDGE_LINEAGE',
  unsupportedGenealogy: 'PROHIBITED',
  chronologyState: 'EXACT_MECHANISM_DATE_AND_LOCATION_HELD_UNLESS_SEPARATELY_SOURCED'
});

const discovery = ({ id, ordinal, siteId, characterId, anchorId, geometryComponentIds, domain, deepLineage = false, faceA, faceB }) => deepFreeze({
  id,
  ordinal,
  siteId,
  characterId,
  anchorId,
  geometryComponentIds,
  domain,
  deepLineage,
  faceA: { face: 'FACE_A_RECORD', label: 'RECORD', text: faceA },
  faceB: { face: 'FACE_B_SIGNIFICANCE', label: 'SIGNIFICANCE', text: faceB },
  ...(deepLineage ? deepLineageKnowledge : standardKnowledge),
  provenance: deepLineage
    ? [CARDINAL_DISCOVERY_SOURCE_AUTHORITY.task18Architecture, CARDINAL_DISCOVERY_SOURCE_AUTHORITY.hiddenLineageBoundary]
    : [CARDINAL_DISCOVERY_SOURCE_AUTHORITY.task18Architecture],
  availabilityPredicate: {
    defaultState: 'HELD',
    requiredState: 'AVAILABLE',
    authority: 'EXPLICIT_STORY_PREDICATE_RECEIPT',
    sitePresenceAloneSufficient: false,
    siteOwnershipSufficient: false
  }
});

export const CARDINAL_DISCOVERIES = deepFreeze([
  discovery({
    id: 'ALARIC_ROUTE_TABLE', ordinal: 1, siteId: 'WATCHFIRE_OVERLOOK', characterId: 'ALARIC_AXION', anchorId: 'ROUTE_TABLE',
    geometryComponentIds: ['ALARIC_ROUTE_TABLE'], domain: 'CHARACTER',
    faceA: "Alaric watches what changes first: routes, pressure, silence, and ignored warnings.",
    faceB: "Orientation is responsibility; waiting for consensus can outlast the safe route."
  }),
  discovery({
    id: 'ALARIC_THRESHOLD_GATE', ordinal: 2, siteId: 'WATCHFIRE_OVERLOOK', characterId: 'ALARIC_AXION', anchorId: 'THRESHOLD_GATE',
    geometryComponentIds: ['ALARIC_THRESHOLD_WEST', 'ALARIC_THRESHOLD_EAST', 'ALARIC_THRESHOLD_LINTEL'], domain: 'FUNCTION',
    faceA: "A route does not become admissible merely because it reaches the gate. Required conditions must actually hold.",
    faceB: "North protects the boundary between possibility and lawful conclusion."
  }),
  discovery({
    id: 'ALARIC_HELD_MARKER', ordinal: 3, siteId: 'WATCHFIRE_OVERLOOK', characterId: 'ALARIC_AXION', anchorId: 'HELD_MARKER',
    geometryComponentIds: ['ALARIC_HELD_MARKER'], domain: 'PRESSURE',
    faceA: "One marker remains deliberately unresolved instead of being forced into a route class.",
    faceB: "Alaric would rather stop and name uncertainty than manufacture closure."
  }),
  discovery({
    id: 'ALARIC_FOUR_WAY_SIGHTLINE', ordinal: 4, siteId: 'WATCHFIRE_OVERLOOK', characterId: 'ALARIC_AXION', anchorId: 'FOUR_WAY_SIGHTLINE',
    geometryComponentIds: ['ALARIC_ROUTE_NORTH_SOUTH', 'ALARIC_ROUTE_EAST_WEST'], domain: 'RELATIONSHIPS',
    faceA: "Distinct sightlines preserve East signal, South continuity, and West pressure as separate reads.",
    faceB: "Alaric frames the field but cannot replace the other three offices."
  }),
  discovery({
    id: 'ALARIC_UNDERFRAME_APERTURE', ordinal: 5, siteId: 'WATCHFIRE_OVERLOOK', characterId: 'ALARIC_AXION', anchorId: 'UNDERFRAME_APERTURE',
    geometryComponentIds: ['ALARIC_UNDERFRAME_WEST', 'ALARIC_UNDERFRAME_EAST'], domain: 'HIDDEN_LINEAGE', deepLineage: true,
    faceA: "The four differentiated capacities share a hidden structural signature beneath ordinary human self-understanding.",
    faceB: "Deep audience confirmation: Alaric's boundary sensitivity participates in the concealed origin-lineage/UMEN human-derivative truth; Alaric does not thereby know it."
  }),

  discovery({
    id: 'TARIAN_TIDE_STAFF', ordinal: 1, siteId: 'WATERLINE_STATION', characterId: 'TARIAN_MERROW', anchorId: 'TIDE_STAFF',
    geometryComponentIds: ['TARIAN_TIDE_STAFF_HIGH', 'TARIAN_TIDE_STAFF_LOW'], domain: 'CHARACTER',
    faceA: "Water level, fatigue, distance, and available carrying capacity are treated as mission facts.",
    faceB: "Tarian keeps ambition physically honest; a future is meaningless if people cannot survive the route."
  }),
  discovery({
    id: 'TARIAN_LOAD_BRIDGE', ordinal: 2, siteId: 'WATERLINE_STATION', characterId: 'TARIAN_MERROW', anchorId: 'LOAD_BRIDGE',
    geometryComponentIds: ['TARIAN_LOAD_BRIDGE_DECK', 'TARIAN_TRUSS_NORTH', 'TARIAN_TRUSS_SOUTH'], domain: 'FUNCTION',
    faceA: "The bridge changes under weight but must preserve lawful passage rather than pretend the weight is absent.",
    faceB: "South carries continuity, cost, stabilization, recovery, and burden without becoming unlimited burden."
  }),
  discovery({
    id: 'TARIAN_COUNTERFEIT_BUOY', ordinal: 3, siteId: 'WATERLINE_STATION', characterId: 'TARIAN_MERROW', anchorId: 'COUNTERFEIT_BUOY',
    geometryComponentIds: ['TARIAN_COUNTERFEIT_BUOY'], domain: 'VULNERABILITY',
    faceA: "A convincing inserted boundary diverts attention and may produce hesitation until reciprocity, time, and behavior are tested.",
    faceB: "Tarian's relational boundary intuition is strong, but manufactured boundaries can overload it; intuition is not final proof."
  }),
  discovery({
    id: 'TARIAN_RECOVERY_BASIN', ordinal: 4, siteId: 'WATERLINE_STATION', characterId: 'TARIAN_MERROW', anchorId: 'RECOVERY_BASIN',
    geometryComponentIds: ['TARIAN_RECOVERY_BASIN'], domain: 'PRESSURE_PERSONHOOD',
    faceA: "The station provides a place where load can be set down and recovery can occur before movement resumes.",
    faceB: "Tarian must remain a person, not become infrastructure loved only for usefulness."
  }),
  discovery({
    id: 'TARIAN_CONFLUENCE_JUNCTION', ordinal: 5, siteId: 'WATERLINE_STATION', characterId: 'TARIAN_MERROW', anchorId: 'CONFLUENCE_JUNCTION',
    geometryComponentIds: ['TARIAN_CONFLUENCE_BEAM', 'TARIAN_CHANNEL_WEST', 'TARIAN_CHANNEL_EAST'], domain: 'RELATIONSHIPS',
    faceA: "Four different flows meet without becoming one undifferentiated current.",
    faceB: "North limits unlawful burden; East reopens life beyond repair; West prevents stabilization from hiding fracture; South keeps the whole passage livable."
  }),
  discovery({
    id: 'TARIAN_SUBMERGED_FOUNDATION', ordinal: 6, siteId: 'WATERLINE_STATION', characterId: 'TARIAN_MERROW', anchorId: 'SUBMERGED_FOUNDATION',
    geometryComponentIds: ['TARIAN_BRIDGE_PIER_WEST', 'TARIAN_BRIDGE_PIER_EAST'], domain: 'HIDDEN_LINEAGE', deepLineage: true,
    faceA: "Beneath visible channels, the same hidden structural signature differentiates into continuity sensitivity.",
    faceB: "Deep audience confirmation: Tarian's continuity capacity participates in the concealed origin-lineage/UMEN human-derivative truth; Tarian does not thereby know it."
  }),

  discovery({
    id: 'ELARA_FAINT_LANTERN', ordinal: 1, siteId: 'SIGNAL_LANTERN_FIELD', characterId: 'ELARA_SYLENE', anchorId: 'FAINT_LANTERN',
    geometryComponentIds: ['ELARA_FAINT_LANTERN'], domain: 'CHARACTER',
    faceA: "Elara retains a weak recurring signal that cleaner interpretations would discard.",
    faceB: "Her moral instinct is to keep the live thing from being killed too soon."
  }),
  discovery({
    id: 'ELARA_ARCHIVE_RESONATOR', ordinal: 2, siteId: 'SIGNAL_LANTERN_FIELD', characterId: 'ELARA_SYLENE', anchorId: 'ARCHIVE_RESONATOR',
    geometryComponentIds: ['ELARA_ARCHIVE_RESONATOR'], domain: 'FORMATION',
    faceA: "A longitudinal archive of anomalies, contradictory observations, unusual transmissions, and recurring signatures accumulates through THE SIGN.",
    faceB: "Dextrion recognizes Elara through a pattern across the archive, not through a contrived single clue."
  }),
  discovery({
    id: 'ELARA_DOUBLE_APERTURE', ordinal: 3, siteId: 'SIGNAL_LANTERN_FIELD', characterId: 'ELARA_SYLENE', anchorId: 'DOUBLE_APERTURE',
    geometryComponentIds: ['ELARA_DOUBLE_APERTURE_WEST', 'ELARA_DOUBLE_APERTURE_EAST'], domain: 'IDENTITY',
    faceA: "Public work and private identity remain distinct; Dextrion contacts the real person behind the public membrane.",
    faceB: "Recognition before disclosure creates trust pressure: being seen does not automatically make exposure safe."
  }),
  discovery({
    id: 'ELARA_CONTRADICTION_LENS', ordinal: 4, siteId: 'SIGNAL_LANTERN_FIELD', characterId: 'ELARA_SYLENE', anchorId: 'CONTRADICTION_LENS',
    geometryComponentIds: ['ELARA_CONTRADICTION_LENS'], domain: 'PRESSURE',
    faceA: "Two incompatible-looking signals remain visible while the field refuses premature collapse.",
    faceB: "Elara's wound is not merely being wrong; it is watching real signal get buried because authority prefers the cleaner fake."
  }),
  discovery({
    id: 'ELARA_RELATION_ARRAY', ordinal: 5, siteId: 'SIGNAL_LANTERN_FIELD', characterId: 'ELARA_SYLENE', anchorId: 'RELATION_ARRAY',
    geometryComponentIds: ['ELARA_RELATION_ARRAY_AXIS'], domain: 'RELATIONSHIPS',
    faceA: "North, South, and West alter what can be concluded, survived, and pressure-tested without replacing East's live signal.",
    faceB: "Elara opens the pattern but cannot convert interpretation into global law."
  }),
  discovery({
    id: 'ELARA_ROOT_RECEIVER', ordinal: 6, siteId: 'SIGNAL_LANTERN_FIELD', characterId: 'ELARA_SYLENE', anchorId: 'ROOT_RECEIVER',
    geometryComponentIds: ['ELARA_LISTENING_PAVILION', 'ELARA_PAVILION_POST_NW', 'ELARA_PAVILION_POST_NE', 'ELARA_PAVILION_POST_SE', 'ELARA_PAVILION_POST_SW'], domain: 'HIDDEN_LINEAGE', deepLineage: true,
    faceA: "The recurring signature beneath Elara's signal fidelity joins the differentiated pattern shared by the four.",
    faceB: "Deep audience confirmation: Elara's anomaly sensitivity participates in the concealed origin-lineage/UMEN human-derivative truth; Elara does not thereby know it."
  }),

  discovery({
    id: 'SOREN_FINISHED_SURFACE', ordinal: 1, siteId: 'RESTORATION_BOUNDARY', characterId: 'SOREN_SEVRIN', anchorId: 'FINISHED_SURFACE',
    geometryComponentIds: ['SOREN_CAUSEWAY_WEST', 'SOREN_CAUSEWAY_EAST'], domain: 'CHARACTER',
    faceA: "The restoration appears complete, but Soren does not accept polish as structural evidence.",
    faceB: "His governing truth posture is truth before comfort and resistance to performed stability."
  }),
  discovery({
    id: 'SOREN_FAILED_JOINT', ordinal: 2, siteId: 'RESTORATION_BOUNDARY', characterId: 'SOREN_SEVRIN', anchorId: 'FAILED_JOINT',
    geometryComponentIds: ['SOREN_FAILED_JOINT_WITNESS'], domain: 'FUNCTION',
    faceA: "One required connection does not carry load even though the surrounding structure looks settled.",
    faceB: "West detects false closure and the hidden failed relation before visible collapse."
  }),
  discovery({
    id: 'SOREN_TEST_FRAME', ordinal: 3, siteId: 'RESTORATION_BOUNDARY', characterId: 'SOREN_SEVRIN', anchorId: 'TEST_FRAME',
    geometryComponentIds: ['SOREN_TEST_FRAME_LINTEL', 'SOREN_TEST_FRAME_WEST', 'SOREN_TEST_FRAME_EAST', 'SOREN_LOAD_PATH_BRACE'], domain: 'PRESSURE',
    faceA: "Pressure is applied only along the actual attack path and increases specificity rather than spectacle.",
    faceB: "Soren's duty is lawful fracture exposure, not hostility or destruction for its own sake."
  }),
  discovery({
    id: 'SOREN_RETURN_LOCK', ordinal: 4, siteId: 'RESTORATION_BOUNDARY', characterId: 'SOREN_SEVRIN', anchorId: 'RETURN_LOCK',
    geometryComponentIds: ['SOREN_RETURN_LOCK_WEST', 'SOREN_RETURN_LOCK_EAST', 'SOREN_RETURN_LOCK_HEADER'], domain: 'VULNERABILITY_RECOVERY',
    faceA: "When truth is admitted, boundaries are restored, and a safe return condition exists, pressure stops.",
    faceB: "Soren must not become fracture without return; continued breaking after lawful return is West drift."
  }),
  discovery({
    id: 'SOREN_FOUR_BEARING_JUNCTION', ordinal: 5, siteId: 'RESTORATION_BOUNDARY', characterId: 'SOREN_SEVRIN', anchorId: 'FOUR_BEARING_JUNCTION',
    geometryComponentIds: ['SOREN_FOUR_BEARING_JUNCTION'], domain: 'RELATIONSHIPS',
    faceA: "North bounds the break, East protects live signal, South keeps exposure survivable, and West tests the failed relation.",
    faceB: "The complete field prevents audit from becoming indiscriminate damage."
  }),
  discovery({
    id: 'SOREN_FOUNDATION_WITNESS', ordinal: 6, siteId: 'RESTORATION_BOUNDARY', characterId: 'SOREN_SEVRIN', anchorId: 'FOUNDATION_WITNESS',
    geometryComponentIds: ['SOREN_FOUNDATION_WITNESS'], domain: 'HIDDEN_LINEAGE', deepLineage: true,
    faceA: "The same concealed structural signature expresses here as false-stability and fracture sensitivity.",
    faceB: "Deep audience confirmation: Soren's fracture sensitivity participates in the concealed origin-lineage/UMEN human-derivative truth; Soren does not thereby know it."
  })
]);

export const CARDINAL_DISCOVERY_BY_ID = deepFreeze(Object.fromEntries(CARDINAL_DISCOVERIES.map((entry) => [entry.id, entry])));

export function getCardinalDiscovery(discoveryId) {
  const record = CARDINAL_DISCOVERY_BY_ID[discoveryId];
  if (!record) throw new RangeError(`UNKNOWN_CARDINAL_DISCOVERY:${discoveryId}`);
  return record;
}

export function getCardinalSiteDiscoveries(siteId) {
  if (!CARDINAL_SITE_IDS.includes(siteId)) throw new RangeError(`UNKNOWN_CARDINAL_DISCOVERY_SITE:${siteId}`);
  return deepFreeze(CARDINAL_DISCOVERIES.filter((entry) => entry.siteId === siteId));
}

export function evaluateCardinalScenesData() {
  const issues = [];
  const ids = CARDINAL_DISCOVERIES.map(({ id }) => id);
  const stateIds = CARDINAL_DISCOVERY_SLOTS.map(({ id }) => id);
  if (CARDINAL_DISCOVERIES.length !== 23) issues.push('DISCOVERY_COUNT_NOT_TWENTY_THREE');
  if (new Set(ids).size !== 23) issues.push('DISCOVERY_IDS_NOT_UNIQUE');
  if (JSON.stringify(ids) !== JSON.stringify(stateIds)) issues.push('DISCOVERY_STATE_SLOT_ORDER_DRIFT');

  const distribution = {};
  for (const siteId of CARDINAL_SITE_IDS) {
    const site = CARDINAL_SITE_RECORDS[siteId];
    const authority = CARDINAL_SITE_GEOMETRY_AUTHORITY[siteId];
    const geometryIds = new Set(buildCardinalSiteGeometry(siteId, 'LOCAL').components.map(({ componentId }) => componentId));
    const discoveries = getCardinalSiteDiscoveries(siteId);
    distribution[siteId] = discoveries.length;
    if (site.characterId !== CARDINAL_CHARACTER_BY_SITE[siteId] || site.landmarkId !== authority.landmarkId) issues.push(`SITE_AUTHORITY_DRIFT:${siteId}`);
    if (discoveries.length !== site.discoveryCount) issues.push(`SITE_DISCOVERY_COUNT_DRIFT:${siteId}`);
    for (const record of discoveries) {
      if (record.characterId !== site.characterId) issues.push(`DISCOVERY_CHARACTER_DRIFT:${record.id}`);
      if (!hasText(record.faceA.text) || !hasText(record.faceB.text) || record.faceA.text === record.faceB.text) issues.push(`DISCOVERY_FACE_CONTENT_INVALID:${record.id}`);
      if (!hasText(record.audienceKnowledge) || !hasText(record.characterKnowledge) || !Array.isArray(record.provenance) || !hasText(record.chronologyState) || record.availabilityPredicate?.defaultState !== 'HELD') issues.push(`KNOWLEDGE_FIELDS_INCOMPLETE:${record.id}`);
      if (record.geometryComponentIds.length === 0 || record.geometryComponentIds.some((componentId) => !geometryIds.has(componentId))) issues.push(`DISCOVERY_GEOMETRY_ANCHOR_MISSING:${record.id}`);
    }
  }

  const deepLineage = CARDINAL_DISCOVERIES.filter(({ deepLineage }) => deepLineage);
  if (deepLineage.length !== 4 || new Set(deepLineage.map(({ siteId }) => siteId)).size !== 4) issues.push('DEEP_LINEAGE_DISTRIBUTION_DRIFT');
  for (const record of deepLineage) {
    if (record.audienceKnowledge !== 'EXPLICIT_HIDDEN_LINEAGE_CONFIRMATION_ALLOWED' || record.characterKnowledge !== 'NOT_UPGRADED_UNLESS_SEPARATELY_SOURCED' || record.otherCardinalKnowledge !== 'NOT_UPGRADED') issues.push(`DEEP_LINEAGE_KNOWLEDGE_LEAK:${record.id}`);
  }

  return deepFreeze({
    schema: 'TASK19_CARDINAL_SCENES_DATA_RECEIPT_v1',
    result: issues.length === 0 ? 'PASS_PROTECTED_TWENTY_THREE_FROZEN_DISCOVERIES' : 'HELD_TASK19_CARDINAL_SCENES_DATA',
    eligible: issues.length === 0,
    contractId: CARDINAL_SCENES_DATA_CONTRACT_ID,
    discoveryCount: CARDINAL_DISCOVERIES.length,
    discoveryDistribution: distribution,
    deepLineageDiscoveryCount: deepLineage.length,
    geometryAnchorCorrespondenceCount: CARDINAL_DISCOVERIES.filter((entry) => entry.geometryComponentIds.length > 0).length,
    issues,
    boundaries: {
      sourceGroundedContentBound: true,
      availabilityDefaultsHeld: true,
      audienceCharacterKnowledgeSeparated: true,
      unsupportedGenealogyCreated: false,
      newCharacterCanonCreated: false,
      chronologyInferred: false,
      routeDestinationInvented: false,
      pageIntegrationPerformed: false
    }
  });
}

export const CARDINAL_SCENES_DATA = deepFreeze({
  contractId: CARDINAL_SCENES_DATA_CONTRACT_ID,
  sourceAuthority: CARDINAL_DISCOVERY_SOURCE_AUTHORITY,
  sites: CARDINAL_SITE_RECORDS,
  discoveries: CARDINAL_DISCOVERIES,
  byId: CARDINAL_DISCOVERY_BY_ID,
  getDiscovery: getCardinalDiscovery,
  getSiteDiscoveries: getCardinalSiteDiscoveries,
  evaluate: evaluateCardinalScenesData
});

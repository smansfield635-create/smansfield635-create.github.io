/**
 * H_EARTH_OW04_COASTAL_ENTRY_PRESENTATION_ADAPTER_v1
 *
 * Keeps the accepted Run 6F navigation law intact while renewing only the
 * initial coastal-entry composition. The OW03/OW04 inspection showed that the
 * inherited COAST pose faces directly inland from the shoreline and places the
 * observer against the highland mass, making the public arrival read as a wall
 * rather than a coast. OW04 turns the initial coastal entry waterward-oblique
 * so shoreline, ocean and land remain simultaneously legible. Traversal,
 * bounds, clearance, proposal evaluation and every non-COAST waypoint remain
 * delegated to the preserved accepted navigation module.
 */
import * as base from './navigation.ow04-base.js';

export * from './navigation.ow04-base.js';

const freeze = (value) => Object.freeze(value);

export function createHEarthFunctionalLandscapeNavigationState({ waypointId = 'COAST' } = {}) {
  const result = base.createHEarthFunctionalLandscapeNavigationState({ waypointId });
  if (result?.ok !== true || waypointId !== 'COAST') return result;

  const state = freeze({
    ...result.state,
    yawDegrees: 142,
    pitchDegrees: -4,
    action: 'GOTO_WAYPOINT:COAST:OW04_WATERWARD_OBLIQUE_ENTRY'
  });

  return freeze({
    ...result,
    state,
    ow04EntryComposition: freeze({
      presentationOnly: true,
      shorelineAndOceanVisibleTogether: true,
      inheritedLandwardWallArrivalRetired: true,
      canonicalProposalLawMutated: false
    })
  });
}

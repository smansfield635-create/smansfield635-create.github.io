/**
 * H_EARTH_C3C2_OWNER_VISUAL_REPAIR_COMPATIBILITY_BRIDGE_v1
 *
 * The public H-Earth route still carries the historical
 * `visual=terrain-relief-v2` promotion token. C3C2 owner inspection proved that
 * allowing that token to select the obsolete CP2 renderer bypassed the C3C2
 * planetary-atmosphere renderer entirely. This compatibility module therefore
 * preserves the public query contract while delegating rendering to the exact
 * C3C2 baseline renderer that owns the closed-sky, celestial-reference,
 * curved-horizon-haze and extended-world presentation.
 *
 * This changes renderer selection only. It does not enlarge navigation,
 * collision, semantic-address, terrain, shoreline, or playable-world authority.
 */

export {
  H_EARTH_RUN_8E_R3C_RENDERER_ID,
  createHEarthRun8ER3CPersistentRenderer
} from './persistent-live-renderer.run8e-r3c.js';

export const H_EARTH_GRATITUDE_REGION_CP2_PRESENTATION_PROFILE_ID =
  'H_EARTH_C3C2_PLANETARY_ENVIRONMENT_COMPATIBILITY_BRIDGE_v1';

export const H_EARTH_C3C2_OWNER_VISUAL_REPAIR = Object.freeze({
  repairId: 'H_EARTH_C3C2_OWNER_VISUAL_REPAIR_COMPATIBILITY_BRIDGE_v1',
  ownerFailureBaseline: 'H_EARTH_C3C2_OWNER_INSPECTION_REPAIR_REQUIRED_20260816',
  rootCause: 'AUTO_PROMOTED_TERRAIN_RELIEF_V2_SELECTED_OBSOLETE_CP2_RENDERER_AND_BYPASSED_C3C2_PLANETARY_RENDERER',
  queryCompatibilityPreserved: true,
  delegatedRenderer: './persistent-live-renderer.run8e-r3c.js',
  c3c2AtmosphereRequired: true,
  c3c2CelestialReferenceRequired: true,
  c3c2CurvedHorizonHazeRequired: true,
  c3c2WorldContinuationRequired: true,
  accessibleRegionExpansion: false,
  navigationAuthorityMutation: false,
  collisionAuthorityMutation: false,
  shorelineAuthorityMutation: false
});

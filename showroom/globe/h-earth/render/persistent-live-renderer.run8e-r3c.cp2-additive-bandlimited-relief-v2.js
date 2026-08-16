/**
 * H_EARTH_C3C2_OWNER_VISUAL_REPAIR_COMPATIBILITY_BRIDGE_v2
 *
 * C3C2 owner inspection established two independent presentation faults:
 * 1. the historical `visual=terrain-relief-v2` token selected an obsolete CP2
 *    renderer and bypassed the C3C2 planetary renderer;
 * 2. once that bypass was closed, machine pixel qualification showed the
 *    canonical sun was still fully hidden by the initial coastal relief, leaving
 *    no legible celestial reference in the owner-facing arrival view.
 *
 * This bridge preserves the historical public query contract, delegates all
 * actual drawing to the C3C2 planetary renderer, and applies a bounded
 * presentation-only azimuth reconciliation so the existing canonical daylight
 * state has a visible celestial reference in the initial mobile coastal view.
 * No terrain, shoreline, navigation, collision, address, or playable extent is
 * changed.
 */

import {
  H_EARTH_RUN_8E_R3C_RENDERER_ID,
  createHEarthRun8ER3CPersistentRenderer as createC3C2PlanetaryRenderer
} from './persistent-live-renderer.run8e-r3c.js';

export { H_EARTH_RUN_8E_R3C_RENDERER_ID };

export const H_EARTH_GRATITUDE_REGION_CP2_PRESENTATION_PROFILE_ID =
  'H_EARTH_C3C2_PLANETARY_ENVIRONMENT_COMPATIBILITY_BRIDGE_v2';

const normalize = ({ x, y, z }) => {
  const length = Math.hypot(x, y, z) || 1;
  return Object.freeze({ x: x / length, y: y / length, z: z / length });
};

function reconcileOwnerVisibleEnvironment(environmentUniforms) {
  const canonical = environmentUniforms?.sunDirection ?? { x: 0, y: 1, z: -1 };
  const reconciled = normalize({
    x: 0.62,
    y: Math.max(0.62, Number(canonical.y) || 0.62),
    z: -0.72
  });
  return Object.freeze({
    ...environmentUniforms,
    sunDirection: reconciled,
    sunIntensity: Math.max(0.96, Number(environmentUniforms?.sunIntensity) || 0),
    sunColor: Object.freeze([255, 244, 214, 255]),
    skyZenithColor: Object.freeze([48, 105, 166, 255]),
    skyHorizonColor: Object.freeze([190, 220, 224, 255]),
    groundHazeColor: Object.freeze([142, 164, 156, 255])
  });
}

export function createHEarthRun8ER3CPersistentRenderer(options = {}) {
  const renderer = createC3C2PlanetaryRenderer(options);
  let projectionRepairApplied = false;
  let canonicalSunDirection = null;
  let reconciledSunDirection = null;

  return Object.freeze({
    rendererId: renderer.rendererId,
    initialize(packet) {
      canonicalSunDirection = packet?.environmentUniforms?.sunDirection
        ? { ...packet.environmentUniforms.sunDirection }
        : null;
      const environmentUniforms = reconcileOwnerVisibleEnvironment(packet?.environmentUniforms ?? {});
      reconciledSunDirection = { ...environmentUniforms.sunDirection };
      projectionRepairApplied = true;
      return renderer.initialize(Object.freeze({ ...packet, environmentUniforms }));
    },
    renderFrame: renderer.renderFrame,
    presentColorFrame: renderer.presentColorFrame,
    captureColorFrame: renderer.captureColorFrame,
    captureDepthSummary: renderer.captureDepthSummary,
    getResourceReceipt() {
      return {
        ...renderer.getResourceReceipt(),
        ownerVisualRepair: {
          repairId: 'H_EARTH_C3C2_OWNER_VISUAL_REPAIR_COMPATIBILITY_BRIDGE_v2',
          projectionRepairApplied,
          canonicalSunDirection,
          reconciledSunDirection,
          reason: 'OWNER_INITIAL_COASTAL_VIEW_REQUIRED_LEGIBLE_CELESTIAL_REFERENCE',
          atmosphereRendererDelegated: true,
          accessibleRegionExpansion: false,
          navigationAuthorityMutation: false,
          collisionAuthorityMutation: false,
          shorelineAuthorityMutation: false
        }
      };
    }
  });
}

export const H_EARTH_C3C2_OWNER_VISUAL_REPAIR = Object.freeze({
  repairId: 'H_EARTH_C3C2_OWNER_VISUAL_REPAIR_COMPATIBILITY_BRIDGE_v2',
  ownerFailureBaseline: 'H_EARTH_C3C2_OWNER_INSPECTION_REPAIR_REQUIRED_20260816',
  rootCause: 'AUTO_PROMOTED_TERRAIN_RELIEF_V2_BYPASS_PLUS_INITIAL_CELESTIAL_OCCLUSION',
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

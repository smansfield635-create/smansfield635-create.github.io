/**
 * H_EARTH_C3C3R5_SELECTED_LIVE_RENDERER_RECONCILIATION_v1
 *
 * The public `visual=terrain-relief-v2` route remains stable, but its renderer
 * no longer manufactures a viewport-space horizon, distant ridge, regional
 * boundary silhouette, or post-geometry depth curtain. Those effects were a
 * parallel presentation authority that could visually override the true
 * planetary frame and the now-live distant-context geometry.
 */

import {
  H_EARTH_RUN_8E_R3C_RENDERER_ID,
  createHEarthRun8ER3CPersistentRenderer as createWorldSpaceRenderer
} from './persistent-live-renderer.run8e-r3c.js';

export { H_EARTH_RUN_8E_R3C_RENDERER_ID };

export const H_EARTH_GRATITUDE_REGION_CP2_PRESENTATION_PROFILE_ID =
  'H_EARTH_C3C3R5_SELECTED_RENDERER_WORLD_SPACE_DELEGATION_v1';

export const H_EARTH_C3C3R5_SELECTED_RENDERER_RECONCILIATION = Object.freeze({
  contract: 'H_EARTH_C3C3R5_SELECTED_LIVE_RENDERER_RECONCILIATION_v1',
  publicVisualQueryPreserved: 'terrain-relief-v2',
  worldShapeAuthority: 'CANONICAL_WORLD_SPACE_DRAW_SET',
  atmosphereAuthority: 'CANONICAL_PERSISTENT_RENDERER',
  viewportSpaceHorizonProhibited: true,
  viewportSpaceRegionalRidgeProhibited: true,
  screenPinnedBoundarySilhouetteProhibited: true,
  postGeometryDepthCurtainProhibited: true,
  worldSpaceDistantContextRequired: true,
  planetRelativeCameraRequired: true,
  navigationAuthorityMutation: false,
  collisionAuthorityMutation: false,
  shorelineAuthorityMutation: false
});

export function createHEarthRun8ER3CPersistentRenderer(options = {}) {
  const renderer = createWorldSpaceRenderer(options);
  let initialized = false;
  let frameCount = 0;

  return Object.freeze({
    rendererId: renderer.rendererId,
    initialize(packet) {
      const receipt = renderer.initialize(packet);
      initialized = true;
      return receipt;
    },
    renderFrame(packet) {
      const result = renderer.renderFrame(packet);
      frameCount += 1;
      return result;
    },
    presentColorFrame: renderer.presentColorFrame,
    captureColorFrame: renderer.captureColorFrame,
    captureDepthSummary: renderer.captureDepthSummary,
    getResourceReceipt() {
      return {
        ...renderer.getResourceReceipt(),
        c3c3: {
          contract: H_EARTH_C3C3R5_SELECTED_RENDERER_RECONCILIATION.contract,
          initialized,
          frameCount,
          selectedPublicVisualContractPreserved: true,
          worldSpaceOnly: true,
          viewportSpaceHorizonPresent: false,
          viewportSpaceRegionalRidgePresent: false,
          screenPinnedBoundarySilhouettePresent: false,
          postGeometryDepthCurtainPresent: false,
          distantContextDrawSetOwnsRegionalContinuation: true,
          baseRendererOwnsAtmosphere: true,
          baseRendererOwnsTerrainMaterialLighting: true,
          preservations: {
            accessibleRegionExpansion: false,
            navigationAuthorityMutation: false,
            collisionAuthorityMutation: false,
            shorelineAuthorityMutation: false,
            openOceanPreserved: true
          }
        }
      };
    }
  });
}

export default createHEarthRun8ER3CPersistentRenderer;

/**
 * H_EARTH_GEN305_S26_SELECTED_LIVE_RENDERER_RECONCILIATION_v1
 *
 * Preserves the single C3C3R5 world-space renderer authority while adding a
 * bounded interaction tier. Camera motion may temporarily request cheaper
 * shader work and 70% interaction resolution; a full-quality frame is
 * deterministically restored after 96 ms without new pointer input.
 */

import {
  H_EARTH_RUN_8E_R3C_RENDERER_ID,
  createHEarthRun8ER3CPersistentRenderer as createWorldSpaceRenderer
} from './persistent-live-renderer.run8e-r3c.js';

export { H_EARTH_RUN_8E_R3C_RENDERER_ID };

export const H_EARTH_GRATITUDE_REGION_CP2_PRESENTATION_PROFILE_ID =
  'H_EARTH_GEN305_S26_SELECTED_RENDERER_WORLD_SPACE_DELEGATION_v1';

export const H_EARTH_GEN305_S26_INTERACTION_POLICY = Object.freeze({
  contract: 'H_EARTH_GEN305_S26_INTERACTION_PERFORMANCE_POLICY_v1',
  activeMotionDetection: 'VIEW_PROJECTION_DELTA',
  interactionRenderScale: 0.70,
  interactionShaderMode: 'INTERACTION_SIMPLIFIED_TERRAIN',
  settledShaderMode: 'FULL_C3C3R5',
  fullQualityRecoveryMs: 96,
  longFrameThresholdMs: 20,
  droppedFrameThresholdMs: 34,
  permanentQualityDowngradeProhibited: true
});

export const H_EARTH_C3C3R5_SELECTED_RENDERER_RECONCILIATION = Object.freeze({
  contract: 'H_EARTH_GEN305_S26_SELECTED_LIVE_RENDERER_RECONCILIATION_v1',
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
  shorelineAuthorityMutation: false,
  interactionPerformancePolicy: H_EARTH_GEN305_S26_INTERACTION_POLICY
});

const now = () => globalThis.performance?.now?.() ?? Date.now();
const matrixMoved = (previous, current) => {
  if (!Array.isArray(current) || current.length !== 16) return false;
  if (!previous) return false;
  let maximumDelta = 0;
  for (let index = 0; index < 16; index += 1) {
    maximumDelta = Math.max(maximumDelta, Math.abs(Number(current[index]) - Number(previous[index])));
  }
  return maximumDelta > 1e-7;
};

export function createHEarthRun8ER3CPersistentRenderer(options = {}) {
  const renderer = createWorldSpaceRenderer(options);
  let initialized = false;
  let frameCount = 0;
  let previousViewProjection = null;
  let recoveryTimer = null;
  let latestPacket = null;
  let proposalStartedAt = null;
  let previousProposalAt = null;
  let lastShaderMode = 'FULL_C3C3R5';
  let lastInteractionRenderScale = 1;

  const metrics = {
    proposalCount: 0,
    activeMotionProposalCount: 0,
    settledProposalCount: 0,
    recoveryFrameCount: 0,
    longFrameCount: 0,
    droppedFrameCount: 0,
    maximumFramePacingMs: 0,
    maximumSynchronousProposalToPresentMs: 0,
    lastFramePacingMs: 0,
    lastProposalToPresentMs: 0
  };

  const qualityPacket = (packet, interactionActive) => ({
    ...packet,
    renderQuality: Object.freeze({
      mode: interactionActive ? 'INTERACTION_REDUCED' : 'FULL_QUALITY',
      renderScale: interactionActive ? H_EARTH_GEN305_S26_INTERACTION_POLICY.interactionRenderScale : 1,
      shaderMode: interactionActive
        ? H_EARTH_GEN305_S26_INTERACTION_POLICY.interactionShaderMode
        : H_EARTH_GEN305_S26_INTERACTION_POLICY.settledShaderMode
    })
  });

  const clearRecovery = () => {
    if (recoveryTimer != null) {
      clearTimeout(recoveryTimer);
      recoveryTimer = null;
    }
  };

  const scheduleFullQualityRecovery = () => {
    clearRecovery();
    recoveryTimer = setTimeout(() => {
      recoveryTimer = null;
      if (!latestPacket || !initialized) return;
      const recoveryPacket = qualityPacket(latestPacket, false);
      renderer.renderFrame(recoveryPacket);
      renderer.presentColorFrame();
      metrics.recoveryFrameCount += 1;
      lastShaderMode = 'FULL_C3C3R5';
      lastInteractionRenderScale = 1;
    }, H_EARTH_GEN305_S26_INTERACTION_POLICY.fullQualityRecoveryMs);
  };

  return Object.freeze({
    rendererId: renderer.rendererId,
    initialize(packet) {
      const receipt = renderer.initialize(packet);
      initialized = true;
      return receipt;
    },
    renderFrame(packet) {
      const t = now();
      if (previousProposalAt != null) {
        const pacing = t - previousProposalAt;
        metrics.lastFramePacingMs = pacing;
        metrics.maximumFramePacingMs = Math.max(metrics.maximumFramePacingMs, pacing);
        if (pacing > H_EARTH_GEN305_S26_INTERACTION_POLICY.longFrameThresholdMs) metrics.longFrameCount += 1;
        if (pacing > H_EARTH_GEN305_S26_INTERACTION_POLICY.droppedFrameThresholdMs) metrics.droppedFrameCount += 1;
      }
      previousProposalAt = t;
      proposalStartedAt = t;
      metrics.proposalCount += 1;

      const currentMatrix = packet?.camera?.viewProjectionMatrix;
      const interactionActive = matrixMoved(previousViewProjection, currentMatrix);
      previousViewProjection = Array.isArray(currentMatrix) ? [...currentMatrix] : previousViewProjection;
      latestPacket = packet;

      if (interactionActive) {
        metrics.activeMotionProposalCount += 1;
        lastShaderMode = H_EARTH_GEN305_S26_INTERACTION_POLICY.interactionShaderMode;
        lastInteractionRenderScale = H_EARTH_GEN305_S26_INTERACTION_POLICY.interactionRenderScale;
        scheduleFullQualityRecovery();
      } else {
        metrics.settledProposalCount += 1;
        lastShaderMode = 'FULL_C3C3R5';
        lastInteractionRenderScale = 1;
        clearRecovery();
      }

      const result = renderer.renderFrame(qualityPacket(packet, interactionActive));
      frameCount += 1;
      return result;
    },
    presentColorFrame() {
      const result = renderer.presentColorFrame();
      if (proposalStartedAt != null) {
        const elapsed = now() - proposalStartedAt;
        metrics.lastProposalToPresentMs = elapsed;
        metrics.maximumSynchronousProposalToPresentMs = Math.max(metrics.maximumSynchronousProposalToPresentMs, elapsed);
        proposalStartedAt = null;
      }
      return result;
    },
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
          interactionPerformance: {
            policy: H_EARTH_GEN305_S26_INTERACTION_POLICY,
            activeShaderMode: lastShaderMode,
            interactionResolutionScale: lastInteractionRenderScale,
            fullQualityRecoveryPending: recoveryTimer != null,
            ...metrics
          },
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

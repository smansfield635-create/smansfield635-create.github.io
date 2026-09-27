/** H-Earth T4 additive extension contract v1.
 * This module intentionally owns no renderer lifecycle and no presentation lifecycle.
 */
import { H_EARTH_T4_FROZEN_PLACEMENT, H_EARTH_T4_INSTANCE_BUDGET } from './t4-frozen-placement-v1.js';

export const H_EARTH_T4_ADDITIVE_EXTENSION_CONTRACT_ID = 'H_EARTH_T4_PHASE5_POST_TERRAIN_ADDITIVE_EXTENSION_v1';

export function assertHEarthT4AdditiveContract(extension) {
  if (!extension || typeof extension !== 'object') throw new Error('T4_EXTENSION_REQUIRED');
  for (const forbidden of ['initialize','render','renderFrame','presentColorFrame','captureColorFrame']) {
    if (forbidden in extension) throw new Error(`T4_FORBIDDEN_LIFECYCLE_AUTHORITY:${forbidden}`);
  }
  if (typeof extension.drawAfterTerrain !== 'function') throw new Error('T4_DRAW_AFTER_TERRAIN_REQUIRED');
  return true;
}

export function createHEarthT4AdditiveExtension({ drawTufts, drawRocks } = {}) {
  if (typeof drawTufts !== 'function' || typeof drawRocks !== 'function') {
    throw new Error('T4_TWO_BATCH_DRAW_FUNCTIONS_REQUIRED');
  }
  const tufts = Object.freeze(H_EARTH_T4_FROZEN_PLACEMENT.instances.filter(instance => instance.kind === 'TUFT'));
  const rocks = Object.freeze(H_EARTH_T4_FROZEN_PLACEMENT.instances.filter(instance => instance.kind === 'ROCK'));
  if (tufts.length !== 617 || rocks.length !== 30 || tufts.length + rocks.length !== 647) {
    throw new Error('T4_FROZEN_PLACEMENT_COUNT_MISMATCH');
  }
  const extension = Object.freeze({
    contractId: H_EARTH_T4_ADDITIVE_EXTENSION_CONTRACT_ID,
    placementSha: H_EARTH_T4_FROZEN_PLACEMENT.placementSha,
    instanceBudget: H_EARTH_T4_INSTANCE_BUDGET,
    drawAfterTerrain(frameContext) {
      drawTufts(frameContext, tufts);
      drawRocks(frameContext, rocks);
      return Object.freeze({ drawCalls: 2, tufts: tufts.length, rocks: rocks.length, total: 647 });
    }
  });
  assertHEarthT4AdditiveContract(extension);
  return extension;
}

export default createHEarthT4AdditiveExtension;

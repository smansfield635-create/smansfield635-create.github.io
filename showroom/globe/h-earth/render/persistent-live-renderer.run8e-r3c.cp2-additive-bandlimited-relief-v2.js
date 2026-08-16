/**
 * H_EARTH_OW04_INSPECTION_RENDERER_BRIDGE_v1
 *
 * Public OW04 inspection renderer bridge.
 *
 * The prior additive terrain-relief shader remained a materially barren,
 * low-contrast presentation even after the OW04 world-continuation geometry
 * work. The live public route already contains the later bounded baked-material
 * renderer, which preserves the accepted Run 8E geometry/camera/navigation
 * authorities while replacing the repeated procedural terrain palette with the
 * world-aligned baked material field. OW04 selects that existing renderer for
 * exact-candidate inspection rather than duplicating or mutating its authority.
 */
export {
  createHEarthRun8ER3CPersistentRenderer,
  H_EARTH_RUN_8E_R3C_RENDERER_ID,
  H_EARTH_GRATITUDE_REGION_BM4_BAKED_MATERIAL_PROFILE_ID,
  H_EARTH_BM4_TERRAIN_TEXTURE_SAMPLES_PER_FRAGMENT,
  H_EARTH_BM4_CONTROL_FIELD_TEXTURE_SAMPLES,
  H_EARTH_BM4_DYNAMIC_PROCEDURAL_OCTAVE_LOOPS
} from './persistent-live-renderer.run8e-r3c.cp2-round2-baked-material-candidate.js';

export const H_EARTH_GRATITUDE_REGION_CP2_PRESENTATION_PROFILE_ID =
  'H_EARTH_OW04_WORLD_ALIGNED_BAKED_MATERIAL_INSPECTION_BRIDGE_v1';

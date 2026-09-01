import ma0 from './h-earth.ma0-audit-basis-freeze.v1.mjs';
import ma1 from './h-earth.ma1-existing-metric-reproduction.v1.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_MA2_DIAGNOSTIC_PASS_AUTHORITY_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_MA2_DIAGNOSTIC_PASS_AUTHORITY_v1',
  checkpoint: 'MA2',
  status: 'FIXED_A_THROUGH_H_DIAGNOSTIC_PASS_AUTHORITY',
  authorityQuestion: 'CAN_ONE_DIAGNOSTIC_RENDERER_PRODUCE_A_THROUGH_H_WITHOUT_CHANGING_CAMERA_OR_GEOMETRY',
  controllingMA1Merge: 'b78cf4b878a116c7fe4005c680df8dc01869e6ee',
  controllingMA1Result: ma1.result,
  acceptedCp2AggregateScore: ma0.frozenB4Evidence.acceptedCp2FinalFrameRepetitionScore,
  frozenSources: ma0.frozenSources,
  viewport: ma0.frozenMetricBasis.viewport,
  fixtureSceneId: 'SCENE_01_HILL_FIELD_FILL',
  passes: {
    A: {
      id: 'PASS_A_HEIGHTFIELD_AS_GRAYSCALE_ELEVATION',
      isolatedVariable: 'WORLD_SPACE_ELEVATION',
      retained: ['CANONICAL_GEOMETRY', 'FIXED_CAMERA', 'DEPTH_OCCLUSION'],
      removed: ['ACCEPTED_MATERIAL', 'DIRECTIONAL_LIGHTING', 'FOG_AND_HAZE']
    },
    B: {
      id: 'PASS_B_SLOPE_MAGNITUDE',
      isolatedVariable: 'SURFACE_SLOPE_MAGNITUDE',
      retained: ['CANONICAL_GEOMETRY', 'FIXED_CAMERA', 'DEPTH_OCCLUSION'],
      removed: ['ACCEPTED_MATERIAL', 'DIRECTIONAL_LIGHTING', 'FOG_AND_HAZE']
    },
    C: {
      id: 'PASS_C_SURFACE_NORMAL_COMPONENTS',
      isolatedVariable: 'WORLD_SPACE_SURFACE_NORMAL_COMPONENTS',
      retained: ['CANONICAL_GEOMETRY', 'FIXED_CAMERA', 'DEPTH_OCCLUSION'],
      removed: ['ACCEPTED_MATERIAL', 'DIRECTIONAL_LIGHTING', 'FOG_AND_HAZE']
    },
    D: {
      id: 'PASS_D_DEPTH_ONLY',
      isolatedVariable: 'PROJECTED_DEPTH',
      retained: ['CANONICAL_GEOMETRY', 'FIXED_CAMERA', 'DEPTH_OCCLUSION'],
      removed: ['ACCEPTED_MATERIAL', 'SURFACE_LIGHTING', 'FOG_AND_HAZE']
    },
    E: {
      id: 'PASS_E_SILHOUETTE_AND_MAJOR_EDGES_ONLY',
      isolatedVariable: 'CAMERA_VISIBLE_SILHOUETTE_AND_MAJOR_GEOMETRIC_EDGES',
      retained: ['CANONICAL_GEOMETRY', 'FIXED_CAMERA', 'DEPTH_OCCLUSION'],
      removed: ['ACCEPTED_MATERIAL', 'SURFACE_COLOR', 'FOG_AND_HAZE']
    },
    F: {
      id: 'PASS_F_CONSTANT_MATERIAL_WITH_ACCEPTED_LIGHTING',
      isolatedVariable: 'GEOMETRY_LIGHTING_RESPONSE',
      retained: ['CANONICAL_GEOMETRY', 'FIXED_CAMERA', 'ACCEPTED_LIGHT_DIRECTION', 'ACCEPTED_LIGHT_INTENSITY', 'ACCEPTED_FOG_AND_HAZE'],
      removed: ['ACCEPTED_SPATIAL_MATERIAL_VARIATION']
    },
    G: {
      id: 'PASS_G_ACCEPTED_MATERIAL_WITH_FLAT_LIGHTING',
      isolatedVariable: 'ACCEPTED_CP2_SPATIAL_MATERIAL',
      retained: ['CANONICAL_GEOMETRY', 'FIXED_CAMERA', 'ACCEPTED_CP2_MATERIAL_GENERATION', 'DISPLAY_TRANSFER'],
      removed: ['DIRECTIONAL_DIFFUSE', 'RIM', 'SPECULAR', 'DISTANCE_FOG', 'ATMOSPHERIC_HAZE']
    },
    H: {
      id: 'PASS_H_ACCEPTED_CP2_FINAL_FRAME',
      isolatedVariable: 'NONE_REFERENCE_PASS',
      retained: ['EXACT_ACCEPTED_CP2_RENDERER', 'CANONICAL_GEOMETRY', 'FIXED_CAMERA', 'ACCEPTED_MATERIAL', 'ACCEPTED_LIGHTING', 'ACCEPTED_FOG_AND_HAZE'],
      removed: []
    }
  },
  gates: {
    exactPassCount: 8,
    exactFixtureSceneCount: 1,
    deterministicReplayCount: 2,
    diagnosticHByteEquivalentToOfficialAccepted: true,
    minimumEligiblePixelCount: 1000,
    minimumMaskedLuminanceVariance: 1e-8,
    browserConsoleErrors: 0,
    pageErrors: 0
  },
  exactPathScope: [
    'h-earth-3d/control-plane/post-cp2-round2/metric-attribution/h-earth.ma2-diagnostic-pass-authority.v1.mjs',
    'h-earth-3d/validation/metric-attribution/h-earth.metric-attribution-diagnostic-renderer.v1.mjs',
    'h-earth-3d/validation/metric-attribution/h-earth.ma2-diagnostic-pass-authority-browser.mjs',
    'h-earth-3d/validation/metric-attribution/h-earth.ma2-diagnostic-pass-authority-harness.html',
    'h-earth-3d/validation/metric-attribution/h-earth.ma2-diagnostic-pass-authority.runner.mjs'
  ],
  prohibitedWork: [
    'MULTI_SCENE_DIAGNOSTIC_EXECUTION',
    'MA3_PASS_A_THROUGH_D_EXECUTION',
    'MA4_PASS_E_THROUGH_H_EXECUTION',
    'METRIC_ATTRIBUTION_CLASSIFICATION',
    'PRODUCT_CANDIDATE',
    'GEOMETRY_MUTATION',
    'CAMERA_MUTATION',
    'MATERIAL_RETUNING',
    'LIGHTING_RETUNING',
    'LIVE_ROUTE_CHANGE'
  ],
  boundaries: {
    productMutationPerformed: false,
    fixtureOnly: true,
    liveRouteChanged: false,
    userDifferentialRequired: false,
    stop: 'STOP_AFTER_MA2_PASS_AUTHORITY_RECEIPT'
  },
  nextAuthorizedCheckpointOnPass: 'MA3_EXECUTE_PASSES_A_THROUGH_D',
  result: 'MA2_DIAGNOSTIC_PASS_AUTHORITY_PASS_CLOSED'
});

export default H_EARTH_MA2_DIAGNOSTIC_PASS_AUTHORITY_v1;

/**
 * H-Earth Scratch Rebuild · Step 016B · Room 6
 * File: h-earth-3d/tests/step-004-non-rendering-harness.contract.js
 * Lane: Wiring / Harness / Review
 * Status: Static contract-test specification only.
 */

export const H_EARTH_STEP_004_CONTRACT_STATUS_CEILING = 'PASS_CANDIDATE';

export const H_EARTH_STEP_004_EXPECTED_STATIC_CHECKS = Object.freeze([
  Object.freeze({ expected: 'manifest_symbol', symbol: 'H_EARTH_MANIFEST' }),
  Object.freeze({ expected: 'state_symbols', symbol: 'H_EARTH_STATE' }),
  Object.freeze({ expected: 'receipt_symbols', symbol: 'H_EARTH_RECEIPTS' }),
  Object.freeze({ expected: 'cell_symbol', symbol: 'H_EARTH_GROUND_CELL_001' }),
  Object.freeze({ expected: 'object_registry_symbol', symbol: 'H_EARTH_GROUND_CELL_001_OBJECTS' }),
  Object.freeze({ expected: 'zone_map_symbol', symbol: 'H_EARTH_GROUND_CELL_001_ZONES' }),
  Object.freeze({ expected: 'action_symbol', symbol: 'H_EARTH_INSPECT_GROUND_ACTION' }),
  Object.freeze({ expected: 'readout_symbol', symbol: 'H_EARTH_GROUND_CONDITION_READ' }),
  Object.freeze({ expected: 'boundary_symbol', symbol: 'H_EARTH_MATRIX_BOUNDARIES' }),
  Object.freeze({ expected: 'render_placeholder_symbol', symbol: 'H_EARTH_RENDER_PLACEHOLDER' }),
  Object.freeze({ expected: 'matrix_separation', value: 'matrixCollapse === false' }),
  Object.freeze({ expected: 'deferred_claims_false', value: true }),
  Object.freeze({ expected: 'inactive_render_placeholder', value: true }),
  Object.freeze({ expected: 'non_rendering_status', value: true }),
]);

export const H_EARTH_STEP_004_NON_RENDERING_HARNESS_CONTRACT = Object.freeze({
  fileRole: 'STATIC_CONTRACT_TEST_SPECIFICATION_ONLY',
  statusCeiling: H_EARTH_STEP_004_CONTRACT_STATUS_CEILING,
  checks: H_EARTH_STEP_004_EXPECTED_STATIC_CHECKS,
  noExecutionClaims: Object.freeze({
    testExecution: false,
    ciExecution: false,
    githubActions: false,
    runtimeRunner: false,
    assertionExecutionClaim: false,
    validationClaim: false,
  }),
});

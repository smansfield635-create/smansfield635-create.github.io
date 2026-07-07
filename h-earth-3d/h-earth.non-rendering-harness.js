/**
 * H-Earth Scratch Rebuild · Step 016B · Room 6
 * File: h-earth-3d/h-earth.non-rendering-harness.js
 * Lane: Wiring / Harness / Review
 * Status: Non-rendering static harness structure only.
 */

export const H_EARTH_HARNESS_STATUS_CEILING = 'PASS_CANDIDATE';

export const H_EARTH_HARNESS_EXPECTED_REFERENCES = Object.freeze([
  'H_EARTH_MANIFEST',
  'H_EARTH_STATE',
  'H_EARTH_RECEIPTS',
  'H_EARTH_GROUND_CELL_001',
  'H_EARTH_GROUND_CELL_001_OBJECTS',
  'H_EARTH_GROUND_CELL_001_ZONES',
  'H_EARTH_INSPECT_GROUND_ACTION',
  'H_EARTH_GROUND_CONDITION_READ',
  'H_EARTH_MATRIX_BOUNDARIES',
  'H_EARTH_RENDER_PLACEHOLDER',
  'H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT',
]);

export const H_EARTH_NON_RENDERING_HARNESS = Object.freeze({
  mode: 'STATIC_CONTRACT_REVIEW_ONLY',
  statusCeiling: H_EARTH_HARNESS_STATUS_CEILING,
  expectedReferences: H_EARTH_HARNESS_EXPECTED_REFERENCES,
  nonRenderingOnly: true,
  executionClaims: Object.freeze({
    testExecution: false,
    runtimeExecution: false,
    rendererExecution: false,
    canvasBinding: false,
    webglBinding: false,
    visualPass: false,
    validation: false,
    productionReadiness: false,
    deploymentReadiness: false,
    ciExecution: false,
  }),
});

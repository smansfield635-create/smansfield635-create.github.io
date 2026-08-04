/**
 * H-Earth Scratch Rebuild · Step 016B · Room 6
 * File: h-earth-3d/h-earth.index.js
 * Lane: Wiring / Harness / Review
 * Status: GitHub-ready raw source body only.
 *
 * This file is a static index map. It has no runtime side effects,
 * no route wiring, no renderer startup, no validation claim, and no
 * production/deployment claim.
 */

export const H_EARTH_FILE_DEPENDENCY_ORDER = Object.freeze([
  {
    order: 1,
    lane: 'ROOM_2_MANIFEST_STATE_RECEIPTS',
    purpose: 'Manifest / State / Receipts',
    files: Object.freeze([
      'h-earth-3d/h-earth.manifest.js',
      'h-earth-3d/h-earth.state.js',
      'h-earth-3d/h-earth.receipts.js',
    ]),
  },
  {
    order: 2,
    lane: 'ROOM_3_CELL_OBJECTS_ZONES',
    purpose: 'Cell / Objects / Zones',
    files: Object.freeze([
      'h-earth-3d/cells/ground-cell-001.js',
      'h-earth-3d/objects/ground-cell-001.objects.js',
      'h-earth-3d/zones/ground-cell-001.zones.js',
    ]),
  },
  {
    order: 3,
    lane: 'ROOM_4_ACTION_READOUT',
    purpose: 'Action / Readout',
    files: Object.freeze([
      'h-earth-3d/actions/inspect-ground.js',
      'h-earth-3d/readouts/ground-condition-read.js',
    ]),
  },
  {
    order: 4,
    lane: 'ROOM_5_BOUNDARY_RENDER_PLACEHOLDER',
    purpose: 'Boundary / Render Placeholder',
    files: Object.freeze([
      'h-earth-3d/boundaries/matrix-boundaries.js',
      'h-earth-3d/render/render-placeholder.js',
    ]),
  },
  {
    order: 5,
    lane: 'ROOM_6_WIRING_HARNESS_REVIEW',
    purpose: 'Wiring / Matrix / Integrity / Harness / Contract Review',
    files: Object.freeze([
      'h-earth-3d/h-earth.index.js',
      'h-earth-3d/h-earth.matrix.js',
      'h-earth-3d/h-earth.integrity.js',
      'h-earth-3d/h-earth.non-rendering-harness.js',
      'h-earth-3d/tests/step-004-non-rendering-harness.contract.js',
    ]),
  },
]);

export const H_EARTH_ROOM_FILE_OWNERSHIP = Object.freeze({
  ROOM_2: Object.freeze({
    lane: 'MANIFEST_STATE_RECEIPTS',
    owns: Object.freeze([
      'h-earth-3d/h-earth.manifest.js',
      'h-earth-3d/h-earth.state.js',
      'h-earth-3d/h-earth.receipts.js',
    ]),
  }),
  ROOM_3: Object.freeze({
    lane: 'CELL_OBJECTS_ZONES',
    owns: Object.freeze([
      'h-earth-3d/cells/ground-cell-001.js',
      'h-earth-3d/objects/ground-cell-001.objects.js',
      'h-earth-3d/zones/ground-cell-001.zones.js',
    ]),
  }),
  ROOM_4: Object.freeze({
    lane: 'ACTION_READOUT',
    owns: Object.freeze([
      'h-earth-3d/actions/inspect-ground.js',
      'h-earth-3d/readouts/ground-condition-read.js',
    ]),
  }),
  ROOM_5: Object.freeze({
    lane: 'BOUNDARY_RENDER_PLACEHOLDER',
    owns: Object.freeze([
      'h-earth-3d/boundaries/matrix-boundaries.js',
      'h-earth-3d/render/render-placeholder.js',
    ]),
  }),
  ROOM_6: Object.freeze({
    lane: 'WIRING_HARNESS_REVIEW',
    owns: Object.freeze([
      'h-earth-3d/h-earth.index.js',
      'h-earth-3d/h-earth.matrix.js',
      'h-earth-3d/h-earth.integrity.js',
      'h-earth-3d/h-earth.non-rendering-harness.js',
      'h-earth-3d/tests/step-004-non-rendering-harness.contract.js',
    ]),
  }),
});

export const H_EARTH_INDEX = Object.freeze({
  project: 'DGB_H_EARTH_SCRATCH_REBUILD',
  matrix: 'H-Earth',
  chamber: 'h-earth-3d',
  step: 'STEP_016B_BASE_PATH_REISSUE',
  status: 'GITHUB_READY_RAW_SOURCE_BODY_ONLY',
  dependencyOrder: H_EARTH_FILE_DEPENDENCY_ORDER,
  roomFileOwnership: H_EARTH_ROOM_FILE_OWNERSHIP,
  claims: Object.freeze({
    githubInstallation: false,
    publicRouteIntegration: false,
    runtimeActivation: false,
    rendererActivation: false,
    canvasActivation: false,
    webglActivation: false,
    visualPass: false,
    validation: false,
    ciExecution: false,
    productionReadiness: false,
    deploymentReadiness: false,
  }),
});

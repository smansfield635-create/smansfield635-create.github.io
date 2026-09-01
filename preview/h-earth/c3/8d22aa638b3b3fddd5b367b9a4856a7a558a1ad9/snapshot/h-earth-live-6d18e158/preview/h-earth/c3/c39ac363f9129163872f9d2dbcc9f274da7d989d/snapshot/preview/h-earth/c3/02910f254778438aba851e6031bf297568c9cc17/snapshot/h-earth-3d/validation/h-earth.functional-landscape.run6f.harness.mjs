import assert from 'node:assert/strict';

import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS,
  createHEarthFunctionalLandscapeNavigationState,
  proposeHEarthFunctionalLandscapeNavigation,
  createHEarthFunctionalLandscapeCamera,
  evaluateHEarthFunctionalLandscapeNavigationState
} from '../../showroom/globe/h-earth/functional-landscape/navigation.js';

import {
  constructHEarthFunctionalLandscapeFrame
} from '../../showroom/globe/h-earth/render/functional-landscape-frame.js';

import {
  applyHEarthFunctionalLandscapeCameraRevision,
  constructHEarthFunctionalLandscapeRendererHandoff
} from '../../showroom/globe/h-earth/render/functional-landscape-compositor.js';

import {
  rasterizeHEarthFunctionalLandscapePlan
} from '../../showroom/globe/h-earth/render/renderer.functional-landscape.js';

const initial = createHEarthFunctionalLandscapeNavigationState();
assert.equal(initial.ok, true);
assert.equal(
  evaluateHEarthFunctionalLandscapeNavigationState(initial.state).eligible,
  true
);

let state = initial.state;
const waypointReceipts = [];
for (const waypointId of Object.keys(
  H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS
)) {
  const proposal = proposeHEarthFunctionalLandscapeNavigation(
    state,
    { action: 'GOTO_WAYPOINT', waypointId }
  );
  assert.equal(proposal.ok, true);
  state = proposal.state;
  const evaluation = evaluateHEarthFunctionalLandscapeNavigationState(state);
  assert.equal(evaluation.eligible, true);
  assert.equal(state.clearance >= 1.6, true);
  assert.equal(typeof state.selectedSemanticAddressId, 'string');
  waypointReceipts.push({
    waypointId,
    chunkId: state.chunkId,
    semanticAddressId: state.selectedSemanticAddressId,
    formationIds: state.formationIds,
    clearance: state.clearance
  });
}

assert.equal(
  waypointReceipts.find((entry) => entry.waypointId === 'HILL')
    .formationIds.includes('H_EARTH_NAVIGABLE_HILL_001'),
  true
);
assert.equal(
  waypointReceipts.find((entry) => entry.waypointId === 'RIDGE')
    .formationIds.includes('H_EARTH_RIDGE_BLUFF_001'),
  true
);

const belowTerrain = proposeHEarthFunctionalLandscapeNavigation(
  state,
  {
    action: 'SET_CAMERA_POSITION',
    position: {
      x: state.position.x,
      y: -999,
      z: state.position.z
    }
  }
);
assert.equal(belowTerrain.ok, true);
assert.equal(belowTerrain.state.recovered, true);
assert.equal(belowTerrain.state.clearance >= 1.6, true);
assert.equal(
  evaluateHEarthFunctionalLandscapeNavigationState(
    belowTerrain.state
  ).eligible,
  true
);

const outside = proposeHEarthFunctionalLandscapeNavigation(
  belowTerrain.state,
  {
    action: 'SET_CAMERA_POSITION',
    position: { x: -180, y: 12, z: -235 }
  }
);
assert.equal(outside.ok, false);
assert.equal(
  outside.status,
  'NAVIGATION_PROPOSAL_REJECTED_STATE_PRESERVED'
);
assert.equal(
  outside.state.position.x,
  belowTerrain.state.position.x
);
assert.equal(
  outside.state.position.z,
  belowTerrain.state.position.z
);

const moved = proposeHEarthFunctionalLandscapeNavigation(
  initial.state,
  { action: 'MOVE_FORWARD', magnitude: 5 }
);
assert.equal(moved.ok, true);
assert.equal(moved.state.position.z < initial.state.position.z, true);
assert.equal(
  evaluateHEarthFunctionalLandscapeNavigationState(moved.state).eligible,
  true
);

const baseFrame = constructHEarthFunctionalLandscapeFrame({
  frameOccurrenceId: 'H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_BASE_FRAME',
  transferOccurrenceId: 'H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_TRANSFER',
  revision: 1
});
assert.equal(baseFrame.ok, true);
assert.equal(baseFrame.primitiveCount, 18);
assert.equal(baseFrame.semanticAddressCount, 256);

const coastState = proposeHEarthFunctionalLandscapeNavigation(
  initial.state,
  { action: 'GOTO_WAYPOINT', waypointId: 'COAST' }
).state;
const camera = createHEarthFunctionalLandscapeCamera(coastState);
assert.equal(camera !== null, true);

const cameraFrame = applyHEarthFunctionalLandscapeCameraRevision({
  baseFrame,
  camera,
  cameraRevision: 1
});
assert.equal(cameraFrame.ok, true);
assert.equal(cameraFrame.primitives, baseFrame.primitives);
assert.equal(cameraFrame.admissionRecordsPreserved, true);
assert.equal(cameraFrame.westAdmissionRepeated, false);

const handoff = constructHEarthFunctionalLandscapeRendererHandoff({
  frame: cameraFrame,
  materializationExtent: { width: 320, height: 180 }
});
assert.equal(handoff.ok, true);
assert.equal(handoff.renderPlan.eligible, true);
assert.equal(handoff.renderPlan.triangles.length > 0, true);
assert.equal(
  handoff.renderPlan.rejected.some((entry) =>
    entry.reason === 'NONFINITE_VERTEX' ||
    entry.reason === 'NONFINITE_PROJECTION'),
  false
);

const raster = rasterizeHEarthFunctionalLandscapePlan(
  handoff.renderPlan
);
assert.equal(raster.ok, true);
assert.equal(raster.writtenPixelCount > 0, true);
for (let index = 3; index < raster.rgba.length; index += 4) {
  assert.equal(raster.rgba[index], 255);
}

console.log(JSON.stringify({
  receiptType: 'H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_NODE_RECEIPT',
  eligible: true,
  status: 'RUN_6F_NAVIGATION_AND_CAMERA_PASS',
  waypointCount: waypointReceipts.length,
  waypointReceipts,
  terrainRecovery: 'PASS',
  outsideTerrainRejection: 'PASS',
  semanticSelectionPersistence: 'PASS',
  primitiveMembershipPreservedAcrossCameraRevision: true,
  admittedPrimitiveCount: baseFrame.primitiveCount,
  semanticAddressCount: baseFrame.semanticAddressCount,
  acceptedRenderTriangleCount: handoff.renderPlan.triangles.length,
  rejectedRenderFragmentCount: handoff.renderPlan.rejected.length,
  skyAlphaClosure: 'PASS',
  writtenPixelCount: raster.writtenPixelCount,
  issues: []
}, null, 2));

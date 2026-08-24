import assert from 'node:assert/strict';

import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_COMPATIBILITY_MODES,
  constructHEarthFunctionalLandscapeFrame
} from '../../showroom/globe/h-earth/render/functional-landscape-frame.js';

import {
  constructHEarthFunctionalLandscapeRendererHandoff
} from '../../showroom/globe/h-earth/render/functional-landscape-compositor.js';

const frame = constructHEarthFunctionalLandscapeFrame({
  frameOccurrenceId: 'H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6E_FRAME_001',
  transferOccurrenceId: 'H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6E_TRANSFER_001',
  revision: 1
});

assert.equal(frame.ok, true);
assert.equal(frame.primitiveCount, 18);
assert.equal(
  frame.primitives.every((primitive) =>
    primitive.admitted === true &&
    primitive.admissionAuthority === 'WEST'),
  true
);
assert.equal(frame.westAggregateFrameAdmissionRecord.admitted, true);
assert.equal(frame.transfer.provisional, true);
assert.equal(frame.transfer.geometryIndexAuthority, false);
assert.equal(frame.transfer.compositorAuthority, false);
assert.equal(frame.transfer.rendererAuthority, false);
assert.equal(frame.packet001Altered, false);
assert.equal(frame.existingPacket002Altered, false);
assert.deepEqual(
  frame.compatibilityModesPreserved,
  H_EARTH_FUNCTIONAL_LANDSCAPE_COMPATIBILITY_MODES
);
assert.equal(frame.semanticAddressCount, 256);
assert.equal(frame.semanticAddressIds.length, 256);
assert.equal(frame.terrainAddressCount, 124);
assert.equal(frame.terrainAddressIds.length, 124);
assert.equal(frame.shorelineWaterAddressCount, 96);
assert.equal(frame.shorelineWaterAddressIds.length, 96);
assert.equal(frame.proxySummarizedAddressCount, 36);
assert.equal(frame.proxySummarizedAddressIds.length, 36);
assert.equal(frame.formationIds.length > 0, true);
assert.equal(frame.shorelineBandIds.length, 7);

const handoff = constructHEarthFunctionalLandscapeRendererHandoff({
  frame,
  materializationExtent: { width: 960, height: 540 }
});

assert.equal(handoff.ok, true);
assert.equal(handoff.frameOccurrenceId, frame.frameOccurrenceId);
assert.equal(handoff.rendererFrame, frame);
assert.equal(handoff.renderPlan.eligible, true);
assert.equal(handoff.renderPlan.triangles.length > 0, true);
assert.equal(handoff.visiblePrimitiveCount, 18);
assert.equal(handoff.plannedPrimitiveCount > 0, true);
assert.equal(handoff.cameraAuthorityPreserved, true);
assert.equal(handoff.viewportAuthorityPreserved, true);
assert.equal(handoff.semanticIdentityPreserved, true);
assert.equal(handoff.existingCompositorAltered, false);
assert.equal(handoff.successorCompositorAdapter, true);

console.log(JSON.stringify({
  receiptType: 'H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6E_RECEIPT',
  contractId: handoff.contractId,
  eligible: true,
  status: handoff.status,
  neutralPrimitiveCount: 18,
  admittedPrimitiveCount: frame.primitiveCount,
  semanticAddressCount: frame.semanticAddressCount,
  terrainAddressCount: frame.terrainAddressCount,
  shorelineWaterAddressCount: frame.shorelineWaterAddressCount,
  proxySummarizedAddressCount: frame.proxySummarizedAddressCount,
  formationCount: frame.formationIds.length,
  shorelineBandCount: frame.shorelineBandIds.length,
  acceptedRenderTriangleCount: handoff.renderPlan.triangles.length,
  rejectedRenderFragmentCount: handoff.renderPlan.rejected.length,
  compatibilityModesPreserved: frame.compatibilityModesPreserved,
  packet001Altered: false,
  existingPacket002Altered: false,
  existingCompositorAltered: false,
  issues: []
}, null, 2));

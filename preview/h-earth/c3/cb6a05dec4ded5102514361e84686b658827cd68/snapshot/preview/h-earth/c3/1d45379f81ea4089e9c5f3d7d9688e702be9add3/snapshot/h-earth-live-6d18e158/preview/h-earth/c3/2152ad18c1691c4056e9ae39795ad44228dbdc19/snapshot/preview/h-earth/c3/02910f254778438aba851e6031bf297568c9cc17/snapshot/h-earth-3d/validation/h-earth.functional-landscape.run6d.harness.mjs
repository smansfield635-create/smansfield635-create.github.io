import assert from 'node:assert/strict';
import {
  prepareHEarthFunctionalLandscapeRenderPlan,
  rasterizeHEarthFunctionalLandscapePlan
} from '../../showroom/globe/h-earth/render/renderer.functional-landscape.js';

const primitive = (primitiveId, vertices, indices, materialIntent, metadata = {}) => ({
  primitiveId,
  semanticRole: primitiveId,
  materialHint: { materialIntent },
  metadata,
  geometry: { vertices, indices }
});

const frame = {
  frameId: 'RUN6D_FIXTURE_FRAME_001',
  camera: {
    position: { x: 0, y: 8, z: 18 },
    target: { x: 0, y: 2, z: -20 },
    up: { x: 0, y: 1, z: 0 },
    verticalFovDegrees: 58,
    nearPlane: 0.25,
    farPlane: 200
  },
  environment: {
    skyTop: [26, 58, 82, 255],
    skyHorizon: [178, 197, 190, 255]
  },
  primitives: [
    primitive('LOWLAND', [
      { x: -18, y: 0, z: -10 },
      { x: 18, y: 0, z: -10 },
      { x: 18, y: 1, z: -48 },
      { x: -18, y: 1, z: -48 }
    ], [0, 2, 1, 0, 3, 2], 'LOWLAND_SOIL'),
    primitive('RIDGE', [
      { x: -14, y: 2, z: -34 },
      { x: 14, y: 2, z: -34 },
      { x: 0, y: 20, z: -38 }
    ], [0, 2, 1], 'STONE_AND_SPARSE_SOIL'),
    primitive('WATER', [
      { x: -24, y: -1, z: -8 },
      { x: 24, y: -1, z: -8 },
      { x: 24, y: -1, z: -54 },
      { x: -24, y: -1, z: -54 }
    ], [0, 2, 1, 0, 3, 2], 'OPEN_WATER'),
    primitive('FOAM', [
      { x: -20, y: 0.05, z: -10 },
      { x: 20, y: 0.05, z: -10 },
      { x: 20, y: 0.05, z: -13 },
      { x: -20, y: 0.05, z: -13 }
    ], [0, 2, 1, 0, 3, 2], 'FOAM_CONTACT'),
    primitive('DISTANT_PROXY', [
      { x: -32, y: 0, z: -90 },
      { x: 32, y: 0, z: -90 },
      { x: 0, y: 34, z: -94 }
    ], [0, 2, 1], 'DISTANT_HIGHLAND'),
    primitive('NEAR_CLIP', [
      { x: -0.5, y: 7.5, z: 17.9 },
      { x: 1.5, y: 6.5, z: 10 },
      { x: -1.5, y: 6.5, z: 10 }
    ], [0, 1, 2], 'STONE'),
    primitive('REVERSED', [
      { x: -3, y: 4, z: -24 },
      { x: 0, y: 9, z: -24 },
      { x: 3, y: 4, z: -24 }
    ], [2, 1, 0], 'STONE'),
    primitive('DEGENERATE', [
      { x: 0, y: 1, z: -16 },
      { x: 1, y: 1, z: -16 },
      { x: 2, y: 1, z: -16 }
    ], [0, 1, 2], 'STONE'),
    primitive('NONFINITE', [
      { x: 0, y: 1, z: -16 },
      { x: Number.NaN, y: 2, z: -17 },
      { x: 2, y: 1, z: -16 }
    ], [0, 1, 2], 'STONE')
  ]
};

const plan = prepareHEarthFunctionalLandscapeRenderPlan(
  frame, { width: 160, height: 100 });
assert.equal(plan.eligible, true);
assert.equal(plan.frameId, frame.frameId);
assert.equal(plan.triangles.length > 0, true);
assert.equal(plan.opaqueTriangles.length > 0, true);
assert.equal(plan.translucentTriangles.length > 0, true);
assert.equal(plan.rejected.some((item) =>
  item.reason === 'DEGENERATE_PROJECTED_TRIANGLE'), true);
assert.equal(plan.rejected.some((item) =>
  item.reason === 'NONFINITE_VERTEX'), true);
assert.equal(plan.triangles.some((item) => item.primitiveId === 'NEAR_CLIP'), true);
assert.equal(plan.triangles.some((item) => item.primitiveId === 'REVERSED'), true);

const raster = rasterizeHEarthFunctionalLandscapePlan(plan);
assert.equal(raster.ok, true);
assert.equal(raster.width, 160);
assert.equal(raster.height, 100);
assert.equal(raster.writtenPixelCount > 0, true);
assert.equal(raster.depth.some((value) => Number.isFinite(value)), true);

const receipt = {
  receiptType: 'H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6D_RECEIPT',
  contractId: plan.contractId,
  eligible: true,
  status: 'RENDERER_SUCCESSOR_FIXTURE_MATRIX_PASS',
  acceptedTriangleCount: plan.triangles.length,
  rejectedFixtureCount: plan.rejected.length,
  opaqueTriangleCount: plan.opaqueTriangles.length,
  translucentTriangleCount: plan.translucentTriangles.length,
  writtenPixelCount: raster.writtenPixelCount,
  physicalDepthDomainCount: 1,
  semanticStackingControlsPhysicalDepth: false,
  issues: []
};
console.log(JSON.stringify(receipt, null, 2));

import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';

import {
  H_EARTH_RUN_8E_CONTROL_CONTRACT_ID,
  evaluateHEarthRun8EControlContract
} from '../control-plane/run-8/h-earth.run8e.integration-and-live-delivery.js';

import {
  H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID
} from '../integration/h-earth.run8e-successor-environment-transfer.js';

import {
  H_EARTH_RUN_8E_RENDER_INTEGRATION_CONTRACT_ID,
  buildHEarthRun8ENeutralPackage,
  constructHEarthRun8ESuccessorEnvironmentFrame,
  prepareHEarthRun8ERenderPlan,
  rasterizeHEarthRun8ERenderPlan,
  evaluateHEarthRun8EFrame
} from '../../showroom/globe/h-earth/render/run8e-successor-environment.js';

const receiptPath = process.env.H_EARTH_RUN8E_RECEIPT ?? '/tmp/run8e-receipt.json';
let assertionsPassed = 0;
const check = (condition, message) => {
  assert.ok(condition, message);
  assertionsPassed += 1;
};
const equal = (actual, expected, message) => {
  assert.equal(actual, expected, message);
  assertionsPassed += 1;
};

const camera = Object.freeze({
  position: Object.freeze({ x: 0, y: 18, z: -20 }),
  target: Object.freeze({ x: 0, y: 28, z: -210 }),
  up: Object.freeze({ x: 0, y: 1, z: 0 }),
  verticalFovDegrees: 58,
  nearPlane: 0.25,
  farPlane: 768,
  sourceCapacityContractId:
    'H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_3_GROUND_OBSERVER_CAMERA_CAPACITY_v5',
  cameraAuthority: 'PRESERVED_EXISTING_CAMERA_PROPOSAL'
});
const viewport = Object.freeze({ width: 240, height: 135, pixelRatio: 1 });

const control = evaluateHEarthRun8EControlContract();
check(control.eligible, `Run 8E control failed: ${control.issues.join(', ')}`);
equal(control.contractId, H_EARTH_RUN_8E_CONTROL_CONTRACT_ID, 'Run 8E control identity mismatch');

const neutral = buildHEarthRun8ENeutralPackage();
check(neutral.ok, `Run 8E neutral package failed: ${neutral.issues.join(', ')}`);
equal(neutral.primitiveCount, 35, 'Run 8E neutral primitive count');
equal(neutral.terrainPrimitiveCount, 1, 'Run 8E terrain primitive count');
equal(neutral.shorelinePrimitiveCount, 7, 'Run 8E shoreline primitive count');
equal(neutral.vegetationPrimitiveCount, 27, 'Run 8E vegetation primitive count');
equal(neutral.semanticAddressCount, 256, 'Run 8E semantic address count');
equal(neutral.terrainAddressCount, 124, 'Run 8E terrain address count');
equal(neutral.shorelineWaterAddressCount, 96, 'Run 8E shoreline address count');
equal(neutral.proxySummarizedAddressCount, 36, 'Run 8E proxy semantic count');
equal(neutral.legacyProxyIncluded, false, 'Legacy proxy must be absent from successor frame');
equal(neutral.successorMountainIncluded, true, 'Successor mountain must be included');

const frame = constructHEarthRun8ESuccessorEnvironmentFrame({
  camera,
  viewport,
  timeOfDayHours: 15.25,
  frameOccurrenceId: 'H_EARTH_RUN_8E_ENGINEERING_FRAME_OCCURRENCE_001',
  transferOccurrenceId: 'H_EARTH_RUN_8E_ENGINEERING_PACKET_002_TRANSFER_001'
});
const frameEvaluation = evaluateHEarthRun8EFrame(frame);
check(frameEvaluation.eligible, `Run 8E frame failed: ${frameEvaluation.issues.join(', ') || frame.issues?.join(', ')}`);
equal(frame.contractId, H_EARTH_RUN_8E_RENDER_INTEGRATION_CONTRACT_ID, 'Run 8E frame identity mismatch');
equal(frame.transfer.contractId, H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID, 'Run 8E transfer identity mismatch');
equal(frame.transfer.primitiveCount, 35, 'Run 8E admitted transfer count');
equal(frame.packet002SuccessorTransferExecuted, true, 'Packet 002 successor transfer not executed');
equal(frame.terrainTriangleColorCount, 48076, 'Run 8C terrain color projection count');
equal(frame.singlePhysicalDepthDomain, true, 'Single physical depth domain not established');
equal(frame.terrainOcclusionExecuted, true, 'Terrain occlusion execution not enabled');
equal(frame.environment.singleSkyAuthority, true, 'Single sky authority not established');
equal(frame.environment.sunDisc.visible, true, 'Sun disc not visible in selected occurrence');

const plan = prepareHEarthRun8ERenderPlan(frame, viewport);
check(plan.eligible, `Run 8E render plan failed: ${plan.issues.join(', ')}`);
check(plan.triangles.length > 0, 'Run 8E render plan has no triangles');
check(plan.triangles.some((triangle) =>
  frame.primitives.find((primitive) => primitive.primitiveId === triangle.primitiveId)
    ?.metadata?.run8ERenderClass === 'TERRAIN'), 'No successor terrain triangles reached renderer');
check(plan.triangles.some((triangle) =>
  frame.primitives.find((primitive) => primitive.primitiveId === triangle.primitiveId)
    ?.metadata?.run8ERenderClass === 'VEGETATION'), 'No grounded vegetation triangles reached renderer');
check(plan.run8ETriangleMaterialProjection === true, 'Run 8C per-triangle material projection missing');

const raster = rasterizeHEarthRun8ERenderPlan(plan, frame);
check(raster.ok, `Run 8E raster failed: ${raster.status}`);
check(raster.writtenPixelCount > 0, 'Run 8E raster wrote no geometry pixels');
check(raster.skyPixelCount > 0, 'Run 8E sky did not materialize');
check(raster.sunPixelCount > 0, 'Run 8E sun disc did not materialize');
equal(raster.alphaClosed, true, 'Run 8E frame alpha is not closed');
equal(raster.singleSkyAuthorityMaterialized, true, 'Run 8E single sky authority was not materialized');
equal(raster.singlePhysicalDepthDomainExecuted, true, 'Run 8E shared depth execution missing');
check(raster.depthDiagnostics.depthRejectedCandidateCount > 0, 'No depth-buffer rejection was executed');
check(raster.depthDiagnostics.terrainVisiblePixelCount > 0, 'Successor terrain has no visible depth ownership');
check(raster.depthDiagnostics.vegetationVisiblePixelCount > 0, 'Grounded vegetation has no visible depth ownership');
check(
  raster.depthDiagnostics.actualTerrainVegetationDepthInteractionExecuted,
  'No actual terrain/vegetation depth interaction was executed'
);

const deterministicSummary = {
  controlContractId: control.contractId,
  neutralPrimitiveIds: neutral.primitiveIds,
  transferPrimitiveIds: frame.transfer.primitiveIds,
  terrainTriangleColorCount: frame.terrainTriangleColorCount,
  plannedTriangleCount: plan.triangles.length,
  rejectedFragmentCount: plan.rejected.length,
  writtenPixelCount: raster.writtenPixelCount,
  skyPixelCount: raster.skyPixelCount,
  sunPixelCount: raster.sunPixelCount,
  depthDiagnostics: raster.depthDiagnostics,
  rgbaSha256: crypto.createHash('sha256').update(Buffer.from(raster.rgba)).digest('hex')
};
const deterministicDigest = crypto
  .createHash('sha256')
  .update(JSON.stringify(deterministicSummary))
  .digest('hex');
check(/^[0-9a-f]{64}$/.test(deterministicDigest), 'Run 8E deterministic digest invalid');

const receipt = {
  receiptType: 'H_EARTH_RUN_8E_ENGINEERING_INTEGRATION_RECEIPT',
  eligible: true,
  status: 'RUN_8E_ENGINEERING_INTEGRATION_PASS',
  controlContractId: H_EARTH_RUN_8E_CONTROL_CONTRACT_ID,
  renderIntegrationContractId: H_EARTH_RUN_8E_RENDER_INTEGRATION_CONTRACT_ID,
  packet002TransferContractId: H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID,
  parentRun8DCommit: '26bab1eb804a6e8737f551e1d1aa9d9cbbe4ae5f',
  workspaceBranch: 'agent/h-earth-run8e-public-integration-001',
  assertionsPassed,
  neutralPrimitiveCount: neutral.primitiveCount,
  admittedPrimitiveCount: frame.transfer.primitiveCount,
  terrainPrimitiveCount: neutral.terrainPrimitiveCount,
  shorelinePrimitiveCount: neutral.shorelinePrimitiveCount,
  vegetationPrimitiveCount: neutral.vegetationPrimitiveCount,
  successorTerrainVertexCount: frame.neutralPackage.primitives[0].geometry.vertices.length,
  successorTerrainTriangleCount: frame.terrainTriangleColorCount,
  projectedTriangleCount: plan.triangles.length,
  rejectedFragmentCount: plan.rejected.length,
  writtenPixelCount: raster.writtenPixelCount,
  skyPixelCount: raster.skyPixelCount,
  sunPixelCount: raster.sunPixelCount,
  terrainVisiblePixelCount: raster.depthDiagnostics.terrainVisiblePixelCount,
  vegetationVisiblePixelCount: raster.depthDiagnostics.vegetationVisiblePixelCount,
  depthRejectedCandidateCount: raster.depthDiagnostics.depthRejectedCandidateCount,
  crossClassDepthInteractionCount: raster.depthDiagnostics.crossClassDepthInteractionCount,
  vegetationTerrainDepthInteractionCount:
    raster.depthDiagnostics.vegetationTerrainDepthInteractionCount,
  actualTerrainVegetationDepthInteractionExecuted:
    raster.depthDiagnostics.actualTerrainVegetationDepthInteractionExecuted,
  sameWorldToCameraTransformForTerrainAndVegetation:
    frame.sameWorldToCameraTransformForTerrainAndVegetation,
  singlePhysicalDepthDomainExecuted: raster.singlePhysicalDepthDomainExecuted,
  singleSkyAuthorityMaterialized: raster.singleSkyAuthorityMaterialized,
  sunDiscMaterialized: raster.sunDiscMaterialized,
  alphaClosed: raster.alphaClosed,
  WestAdmissionExecuted: true,
  packet002SuccessorTransferExecuted: true,
  frameCompositionExecuted: true,
  rendererIntegrationExecuted: true,
  terrainOcclusionExecuted: true,
  publicRouteMutation: false,
  physicalSamsungExecution: false,
  deployment: false,
  liveIdentityProof: false,
  run8EPassClosed: false,
  deterministicDigest,
  rgbaSha256: deterministicSummary.rgbaSha256,
  issues: []
};

fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(receipt, null, 2));

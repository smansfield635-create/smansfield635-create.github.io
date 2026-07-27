import {
  H_EARTH_RUN_8E_R3_CONTRACT_ID,
  evaluateHEarthRun8ER3Control
} from './h-earth.run8e-r3.live-gpu-presentation-recovery.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R3A_CONTROL_ID =
  'H_EARTH_RUN_8E_R3A_SHARED_CAMERA_GPU_PRESENTATION_CONTROL_v1';

export const H_EARTH_RUN_8E_R3A_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3A_CONTROL_ID,
  parentContractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
  checkpointId: 'RUN_8E_R3A',
  checkpointName: 'SHARED_CAMERA_GPU_PRESENTATION_CONTRACT_AND_UNIFORM_PACKET',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3a-live-renderer-contract-001',
  baseBranch: 'agent/h-earth-run8e-r2f-closure-promotion-decision-001',
  baseExactHead: '02aa90591a34968c8b6bacba926a156293ad0f76',
  currentStatus: 'PASS_CLOSED',
  requiredInputs: {
    r2PassClosed: true,
    r2FPassClosed: true,
    r2PromotionToR3InputApproved: true,
    immutablePackageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25',
    immutablePackageGitBlob: '1699654f39c9e183f4cfc6f75b20ba051641b763',
    canonicalGpuTransportContractId: 'H_EARTH_RUN_8E_R2D_DETERMINISTIC_GPU_UPLOAD_VIEWS_v1',
    canonicalGpuTransportGitBlob: '785856d7702a0e855c2672e6b8a7325ad5b3ba50',
    navigationContractId: 'H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROPOSAL_RUN_6F_v1',
    navigationSourceGitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91'
  },
  executionCustody: {
    coreHead: 'e244f82ceab3d5c780224b564ee162d4dac326d9',
    workflowRun: 30284854902,
    workflowJob: 90040012506,
    artifactId: 8660349498,
    artifactDigest: 'sha256:c76331601d89985246644e0743396450d372b01fe63c435bdcc293d25fe4eb36',
    packetManifestDigest: 'sha256:c04ccd3d365145063ca3bdd4e479b5db931e1a42c8526ad5dc9908a4bc3bd709',
    packetCount: 10,
    automaticRegistryPreflight: 'PASS',
    durablePassReceipt: '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3a.pass-closed.receipt.json',
    finalExactHead: null
  },
  requiredResults: {
    sharedNavigationStateConsumedWithoutMutation: true,
    successorTerrainCameraReconciliationPreserved: true,
    deterministicViewMatrix: true,
    deterministicProjectionMatrix: true,
    deterministicViewProjectionMatrix: true,
    environmentUniformProjectionPreserved: true,
    exactGpuBufferElementCountsPreserved: true,
    exactDrawRangesPreserved: true,
    sameCameraStateProducesSameFramePacket: true,
    differentCameraStatesProduceDifferentViewProjection: true,
    worldRebuildPerCameraMove: false,
    webglContextCreated: false,
    shaderOrProgramCreated: false,
    renderLoopCreated: false,
    publicRouteBound: false,
    visiblePresentationCreated: false
  },
  boundaries: {
    liveRenderPackageMutation: false,
    gpuTransportAdapterMutation: false,
    navigationSourceMutation: false,
    publicEnvironmentIntegrationMutation: false,
    directManipulationMutation: false,
    publicRouteMutation: false,
    webglContextCreation: false,
    shaderProgramCompilation: false,
    renderLoopCreation: false,
    gestureBinding: false,
    visiblePresentation: false,
    deployment: false,
    r3BWork: false,
    run8EPassClosed: false
  },
  nextCheckpoint: 'RUN_8E_R3B_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_ISOLATED_WEBGL2_FIXED_FRAME_EXECUTION_R3B'
});

export function evaluateHEarthRun8ER3AControl(candidate = H_EARTH_RUN_8E_R3A_CONTROL) {
  const issues = [];
  const parent = evaluateHEarthRun8ER3Control();
  if (parent.eligible !== true) issues.push(...parent.issues.map((issue) => `PARENT:${issue}`));
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3A_CONTROL_ID) issues.push('R3A_CONTROL_ID_MISMATCH');
  if (candidate?.baseExactHead !== '02aa90591a34968c8b6bacba926a156293ad0f76') issues.push('R3A_BASE_HEAD_MISMATCH');
  if (candidate?.currentStatus !== 'PASS_CLOSED') issues.push('R3A_NOT_PASS_CLOSED');
  if (candidate?.executionCustody?.workflowRun !== 30284854902) issues.push('R3A_WORKFLOW_RUN_MISMATCH');
  if (candidate?.executionCustody?.artifactDigest !==
      'sha256:c76331601d89985246644e0743396450d372b01fe63c435bdcc293d25fe4eb36') {
    issues.push('R3A_ARTIFACT_DIGEST_MISMATCH');
  }
  if (candidate?.executionCustody?.packetManifestDigest !==
      'sha256:c04ccd3d365145063ca3bdd4e479b5db931e1a42c8526ad5dc9908a4bc3bd709') {
    issues.push('R3A_PACKET_MANIFEST_DIGEST_MISMATCH');
  }
  if (candidate?.requiredInputs?.r2PromotionToR3InputApproved !== true) issues.push('R3A_INPUT_PROMOTION_NOT_APPROVED');
  if (candidate?.requiredInputs?.immutablePackageGitBlob !== '1699654f39c9e183f4cfc6f75b20ba051641b763') {
    issues.push('R3A_PACKAGE_BLOB_MISMATCH');
  }
  if (candidate?.requiredInputs?.canonicalGpuTransportGitBlob !== '785856d7702a0e855c2672e6b8a7325ad5b3ba50') {
    issues.push('R3A_GPU_ADAPTER_BLOB_MISMATCH');
  }
  if (candidate?.requiredInputs?.navigationSourceGitBlob !== '8ab3446c536fc24423d5601acce232b19fa71c91') {
    issues.push('R3A_NAVIGATION_BLOB_MISMATCH');
  }
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) {
    if (value !== false) issues.push(`R3A_BOUNDARY_VIOLATION:${key}`);
  }
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3B_NOT_STARTED') issues.push('R3B_STATE_INVALID');
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_ISOLATED_WEBGL2_FIXED_FRAME_EXECUTION_R3B') {
    issues.push('R3A_STOPPING_BOUNDARY_MISMATCH');
  }
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8E_R3A_PASS_CLOSED' : 'RUN_8E_R3A_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3A_CONTROL;

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

export const H_EARTH_RUN_8E_R3B_CONTROL_ID =
  'H_EARTH_RUN_8E_R3B_ISOLATED_WEBGL2_FIXED_FRAME_CONTROL_v1';

export const H_EARTH_RUN_8E_R3B_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R3B_CONTROL_ID,
  parentContractId: H_EARTH_RUN_8E_R3_CONTRACT_ID,
  checkpointId: 'RUN_8E_R3B',
  checkpointName: 'ISOLATED_WEBGL2_FIXED_FRAME_EXECUTION',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-run8e-r3b-isolated-webgl2-fixed-frame-001',
  baseBranch: 'agent/h-earth-run8e-r3a-live-renderer-contract-001',
  baseExactHead: '9560bc1f88800e12408a99a10032e9daf1e56713',
  currentStatus: 'PASS_CLOSED',
  requiredInputs: {
    r3APassClosed: true,
    r3AFinalExactHead: '9560bc1f88800e12408a99a10032e9daf1e56713',
    r3AContractId: 'H_EARTH_RUN_8E_R3A_SHARED_CAMERA_GPU_PRESENTATION_CONTRACT_v1',
    logicalPromotedPackageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25',
    chromiumRuntimePackageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_E7D54BDD',
    immutablePackageGitBlob: '1699654f39c9e183f4cfc6f75b20ba051641b763',
    canonicalGpuTransportGitBlob: '785856d7702a0e855c2672e6b8a7325ad5b3ba50',
    navigationSourceGitBlob: '8ab3446c536fc24423d5601acce232b19fa71c91',
    r3ALiveRendererContractGitBlob: '4e187fc38780dfb2020482b674ac331f5a65b2c1'
  },
  executionEvidence: {
    successfulExecutionHead: '1fb2bdee01806097f4785cb484c9132574dbdeaf',
    workflowRun: 30288213937,
    workflowJob: 90051195459,
    artifactId: 8661709112,
    artifactDigest: 'sha256:6f48e588064dcd194ce9136fe6d1fcdbdf3d3ef3543bb9700548554f2667e1ef',
    automaticRepositoryRegistryPreflightRun: 30288214972,
    automaticRepositoryRegistryPreflight: 'PASS',
    browserExecutionStatus: 'RUN_8E_R3B_EXECUTION_PASS',
    contextVersion: 'WebGL 2.0 (OpenGL ES 3.0 Chromium)',
    shaderCompileCount: 4,
    programLinkCount: 2,
    gpuBufferCount: 9,
    uploadedByteLength: 2145444,
    geometryDrawCallCount: 4,
    depthVisualizationDrawCallCount: 1,
    drawnIndexCount: 147120,
    fixedFrameWidth: 960,
    fixedFrameHeight: 540,
    fixedFrameByteLength: 64059,
    fixedFrameSha256: '74c3c3b136241f7ab413411dac565897a19c124f92f174e3c0f0dfb2cbbff639',
    diagnosticPageSha256: 'dc7207f8f7268761712e7af699ddd72dc6f160095beab1dd183b6aa0d68d10d9',
    executionReceiptSha256: '9352560f4c756767576550a67a1e66e99690020f56b77bbe856b8a366f7b8d60',
    colorNonClearPixelCount: 492648,
    colorUniqueBucketCount: 19,
    colorByteHash: 'fnv1a32:2d6d3436',
    depthNonClearPixelCount: 492648,
    depthUniqueBucketCount: 13,
    depthByteHash: 'fnv1a32:4971d411',
    failureAttemptsPreserved: [
      '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3b.attempt-001.failure.receipt.json',
      '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3b.attempt-002.failure.receipt.json'
    ]
  },
  requiredExecution: {
    realWebGL2Context: true,
    realVertexShaderCompile: true,
    realFragmentShaderCompile: true,
    realProgramLink: true,
    exactCanonicalGpuBuffersBound: true,
    allFourDrawRangesExecuted: true,
    realColorAttachmentOutput: true,
    realDepthAttachmentOutput: true,
    inspectableVisibleFixedFrame: true,
    screenshotArtifact: true,
    readbackReceipt: true,
    packageCameraMaterialAtmosphereDepthCorrespondence: true
  },
  rejectionConditions: [
    'CLEARED_CANVAS_ONLY',
    'SYNTHETIC_TRIANGLE_ONLY',
    'METADATA_ONLY_RECEIPT',
    'DRAW_CALL_COUNT_WITHOUT_INSPECTABLE_OUTPUT',
    'PACKET_ONLY_OR_CONTRACT_ONLY_PROOF'
  ],
  boundaries: {
    publicRouteMutation: false,
    directManipulationMutation: false,
    navigationAuthorityMutation: false,
    cameraAuthorityMutation: false,
    liveRenderPackageMutation: false,
    gpuTransportAdapterMutation: false,
    persistentGpuResourceLifecycle: false,
    continuousRenderLoop: false,
    interactionBinding: false,
    publicRouteBinding: false,
    deployment: false,
    r3CWork: false,
    run8EPassClosed: false
  },
  nextCheckpoint: 'RUN_8E_R3C_NOT_STARTED',
  stoppingBoundary: 'STOP_BEFORE_PERSISTENT_GPU_RESOURCES_AND_CONTINUOUS_CAMERA_LOOP_R3C'
});

export function evaluateHEarthRun8ER3BControl(candidate = H_EARTH_RUN_8E_R3B_CONTROL) {
  const issues = [];
  const parent = evaluateHEarthRun8ER3Control();
  if (parent.eligible !== true) issues.push(...parent.issues.map((issue) => `PARENT:${issue}`));
  if (candidate?.contractId !== H_EARTH_RUN_8E_R3B_CONTROL_ID) issues.push('R3B_CONTROL_ID_MISMATCH');
  if (candidate?.baseExactHead !== '9560bc1f88800e12408a99a10032e9daf1e56713') issues.push('R3B_BASE_HEAD_MISMATCH');
  if (!['EXECUTION_PENDING', 'PASS_CLOSED'].includes(candidate?.currentStatus)) issues.push('R3B_STATUS_INVALID');
  if (candidate?.requiredInputs?.logicalPromotedPackageIdentity !== 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25') issues.push('R3B_LOGICAL_PACKAGE_IDENTITY_MISMATCH');
  if (candidate?.requiredInputs?.chromiumRuntimePackageIdentity !== 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_E7D54BDD') issues.push('R3B_CHROMIUM_PACKAGE_IDENTITY_MISMATCH');
  for (const [key, value] of Object.entries(candidate?.requiredExecution ?? {})) {
    if (value !== true) issues.push(`R3B_REQUIRED_EXECUTION_MISSING:${key}`);
  }
  for (const [key, value] of Object.entries(candidate?.boundaries ?? {})) {
    if (value !== false) issues.push(`R3B_BOUNDARY_VIOLATION:${key}`);
  }
  if (candidate?.currentStatus === 'PASS_CLOSED') {
    if (candidate?.executionEvidence?.workflowRun !== 30288213937) issues.push('R3B_WORKFLOW_RUN_MISMATCH');
    if (candidate?.executionEvidence?.artifactDigest !== 'sha256:6f48e588064dcd194ce9136fe6d1fcdbdf3d3ef3543bb9700548554f2667e1ef') issues.push('R3B_ARTIFACT_DIGEST_MISMATCH');
    if (candidate?.executionEvidence?.geometryDrawCallCount !== 4 || candidate?.executionEvidence?.drawnIndexCount !== 147120) issues.push('R3B_DRAW_EXECUTION_IDENTITY_MISMATCH');
    if (candidate?.executionEvidence?.fixedFrameSha256 !== '74c3c3b136241f7ab413411dac565897a19c124f92f174e3c0f0dfb2cbbff639') issues.push('R3B_FIXED_FRAME_DIGEST_MISMATCH');
    if (candidate?.executionEvidence?.fixedFrameWidth !== 960 || candidate?.executionEvidence?.fixedFrameHeight !== 540) issues.push('R3B_FIXED_FRAME_DIMENSIONS_MISMATCH');
    if ((candidate?.executionEvidence?.failureAttemptsPreserved ?? []).length !== 2) issues.push('R3B_FAILURE_ATTEMPT_CUSTODY_INCOMPLETE');
  }
  if (candidate?.nextCheckpoint !== 'RUN_8E_R3C_NOT_STARTED') issues.push('R3C_STATE_INVALID');
  if (candidate?.stoppingBoundary !== 'STOP_BEFORE_PERSISTENT_GPU_RESOURCES_AND_CONTINUOUS_CAMERA_LOOP_R3C') issues.push('R3B_STOPPING_BOUNDARY_MISMATCH');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? (candidate?.currentStatus === 'PASS_CLOSED' ? 'RUN_8E_R3B_PASS_CLOSED' : 'RUN_8E_R3B_CONTROL_EXECUTION_ELIGIBLE')
      : 'RUN_8E_R3B_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R3B_CONTROL;

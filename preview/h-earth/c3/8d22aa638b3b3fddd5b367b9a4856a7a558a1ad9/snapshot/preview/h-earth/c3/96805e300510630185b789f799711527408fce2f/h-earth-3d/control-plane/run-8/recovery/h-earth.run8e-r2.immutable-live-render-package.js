const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R2_CONTRACT_ID =
  'H_EARTH_RUN_8E_R2_IMMUTABLE_LIVE_RENDER_PACKAGE_v1';

export const H_EARTH_RUN_8E_R2_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R2_CONTRACT_ID,
  programId: 'H_EARTH_RUN_8E_PHYSICAL_INTERACTION_AND_LIVE_RENDERER_RECOVERY_PROGRAM_v1',
  checkpointId: 'RUN_8E_R2',
  checkpointName: 'IMMUTABLE_LIVE_RENDER_PACKAGE_CONSTRUCTION',
  predecessor: {
    run8ER1DiagnosticCheckpoint: 'PASS_CLOSED',
    run8ER1ArchitectureDisposition: 'ESTABLISHED',
    referenceDeviceInteractionUsability: 'FAIL',
    run8E: 'FAIL_OPEN',
    run8EPassClosed: false,
    materialLedgerMergeCommit: 'a660d54b0df30e768b95e2314b918d0f263883ed'
  },
  boundedExecutionLaw: {
    checkpointSequenceLocked: true,
    laterFailureCannotInvalidateEarlierPassedCheckpoint: true,
    eachCheckpointRequiresExactCommit: true,
    eachCheckpointRequiresWorkflowResult: true,
    eachCheckpointRequiresArtifactOrDurableFailureReceipt: true,
    eachCheckpointRequiresStoppingBoundary: true,
    noCheckpointMayClaimLaterCheckpointCompletion: true
  },
  boundedSubcheckpoints: [
    {
      checkpointId: 'RUN_8E_R2A',
      name: 'CORE_PACKAGE_CONTRACT_AND_SOURCE_SHAPE_EXECUTION',
      currentStatus: 'PASS_CLOSED',
      pullRequest: 217,
      baseHead: 'a660d54b0df30e768b95e2314b918d0f263883ed',
      finalHead: '22b23594005dabdd9374501dae1c561f2dafa648',
      workflowRun: 30236189527,
      workflowJob: 89884338910,
      artifactId: 8641707377,
      artifactDigest: 'sha256:08d916a884c35b38b079b3df15ee5efe26a54043d080fb28949f59d4b531d886',
      packageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25',
      contentDigest: 'fnv1a32:fd913c25',
      stoppingBoundary: 'STOP_BEFORE_DETERMINISTIC_PACKAGE_CONSTRUCTION_AND_IMMUTABLE_BUFFER_CUSTODY_R2B'
    },
    {
      checkpointId: 'RUN_8E_R2B',
      name: 'DETERMINISTIC_PACKAGE_CONSTRUCTION_AND_IMMUTABLE_BUFFER_CUSTODY',
      currentStatus: 'PASS_CLOSED',
      pullRequest: 218,
      baseHead: '22b23594005dabdd9374501dae1c561f2dafa648',
      finalHead: '39de87edefcc037eaafa8a988dc0c84e40e3d1ba',
      workflowRun: 30237455069,
      workflowJob: 89887842669,
      artifactId: 8642098670,
      artifactDigest: 'sha256:c76ac69d171d37d2b1a15b49bafd1201bc33eabaab3cdcef2cdfe370b3068054',
      custodyManifestDigest: 'sha256:7e8eb51269053c7c49ff05c6cf1f0250e68066df408fb65ee63cd49f74316b3d',
      stoppingBoundary: 'STOP_BEFORE_SOURCE_AUTHORITY_GEOMETRY_MATERIAL_AND_PROVENANCE_CORRESPONDENCE_AUDIT_R2C'
    },
    {
      checkpointId: 'RUN_8E_R2C',
      name: 'SOURCE_AUTHORITY_GEOMETRY_MATERIAL_AND_PROVENANCE_CORRESPONDENCE_AUDIT',
      currentStatus: 'PASS_CLOSED',
      pullRequest: 219,
      baseHead: '39de87edefcc037eaafa8a988dc0c84e40e3d1ba',
      finalHead: '845b6d6acffdd461153b3474044ec533ffd4403b',
      workflowRun: 30238540238,
      workflowJob: 89890901624,
      artifactId: 8642442814,
      artifactDigest: 'sha256:545b1e1d04d58128bb2ba0caf4086621c3f52bb88e8ff2b24b64270af60a087c',
      auditManifestDigest: 'sha256:4a891f5b39a4c361a2cceaa59c9c4200aeffe7603ed9126e4fbf3209889e4dfe',
      stoppingBoundary: 'STOP_BEFORE_GPU_UPLOAD_VIEW_AND_RESOURCE_LIFECYCLE_VALIDATION_R2D'
    },
    {
      checkpointId: 'RUN_8E_R2D',
      name: 'GPU_UPLOAD_VIEW_AND_RESOURCE_LIFECYCLE_VALIDATION',
      currentStatus: 'PASS_CLOSED',
      pullRequest: 220,
      baseHead: '845b6d6acffdd461153b3474044ec533ffd4403b',
      finalHead: '9cc33fee5c82bbe47e3bb57f8bc40d1ffa3a31b9',
      workflowRun: 30240950430,
      workflowJob: 89897847174,
      artifactId: 8643236615,
      artifactDigest: 'sha256:6e8f87f8b30fd7bb5fc889d3c0d238da64ce555163a416c6d3b878c5261bdc23',
      custodyManifestDigest: 'sha256:0ef98ea0f82370278ecc946247b32a8ab615a665834abdb33fee741ae6b7ec6e',
      stoppingBoundary: 'STOP_BEFORE_REGISTRY_DURABLE_RECEIPT_AND_INDEPENDENT_SCOPE_AUDIT_R2E'
    },
    {
      checkpointId: 'RUN_8E_R2E',
      name: 'REGISTRY_DURABLE_RECEIPT_AND_INDEPENDENT_SCOPE_AUDIT',
      currentStatus: 'PASS_CLOSED',
      pullRequest: 224,
      baseHead: '9cc33fee5c82bbe47e3bb57f8bc40d1ffa3a31b9',
      finalHead: '096bfbaf45b8987041600385ae16646b00137b9b',
      workflowRun: 30281339517,
      workflowJob: 90028205616,
      artifactId: 8658930706,
      artifactDigest: 'sha256:d334c73fff5a76ed3abadbc0b1026a20e200f12866d1f2f77840b0e289e04892',
      exactOccurrenceManifestDigest: 'sha256:2ae01097d0ab58f6cfd6b2a158ee558f816a2342443b387da410879fb1f2da9a',
      stoppingBoundary: 'STOP_BEFORE_R2_CLOSURE_AND_PROMOTION_DECISION_R2F'
    },
    {
      checkpointId: 'RUN_8E_R2F',
      name: 'R2_CLOSURE_AND_PROMOTION_DECISION',
      currentStatus: 'PASS_CLOSED',
      pullRequest: 225,
      baseHead: '096bfbaf45b8987041600385ae16646b00137b9b',
      finalHead: null,
      workflowRun: 30283048662,
      workflowJob: 90033938538,
      artifactId: 8659616243,
      artifactDigest: 'sha256:a130adddfc535ce3acd28e81cd4d4c09b1c131b0cda427bc0d51fbbf9683e300',
      closureManifestDigest: 'sha256:f565c1973859fa8365bca57d06f794f81b85bce436b5887ca5c81e926a6d1a73',
      promotionToR3Input: 'APPROVED',
      stoppingBoundary: 'STOP_BEFORE_RUN_8E_R3'
    }
  ],
  package: {
    identity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25',
    contentDigest: 'fnv1a32:fd913c25',
    primitiveCount: 35,
    terrainPrimitiveCount: 1,
    shorelinePrimitiveCount: 7,
    vegetationPrimitiveCount: 27,
    semanticAddressCount: 256,
    vertexCount: 25524,
    triangleCount: 49040,
    indexCount: 147120,
    drawRangeCount: 4,
    gpuUploadBufferCount: 9,
    gpuUploadByteLengthPerCycle: 2145444,
    liveRenderPackageGitBlobSha: '1699654f39c9e183f4cfc6f75b20ba051641b763',
    gpuTransportAdapterGitBlobSha: '785856d7702a0e855c2672e6b8a7325ad5b3ba50'
  },
  establishedResults: {
    deterministicPackageConstruction: true,
    immutableBufferCustody: true,
    sourceAuthorityCorrespondence: true,
    canonicalGpuBytesExactAcrossNodeAndChromium: true,
    gpuResourceLifecycleCycleCount: 3,
    createdGpuBufferCount: 27,
    deletedGpuBufferCount: 27,
    registryRepresentationComplete: true,
    automaticRepositoryRegistryPreflight: 'PASS',
    visiblePresentationCreated: false
  },
  promotionDecision: {
    r2ConstructionClosure: 'PASS_CLOSED',
    promotionTarget: 'RUN_8E_R3_INPUT',
    promotionToR3Input: 'APPROVED',
    mainBranchPromotion: 'NOT_EXECUTED',
    mainMergeAuthorityCreated: false,
    deploymentAuthorityCreated: false,
    run8EPassAuthorityCreated: false
  },
  prohibitedMutations: [
    'PUBLIC_H_EARTH_ROUTE',
    'CURRENT_CPU_REFERENCE_RENDERER',
    'CAMERA_AUTHORITY',
    'NAVIGATION_AUTHORITY',
    'POINTER_OR_GESTURE_BINDING',
    'TERRAIN_OR_MOUNTAIN_GEOMETRY',
    'SHORELINE_GEOMETRY',
    'VEGETATION_GEOMETRY_OR_EXPANSION',
    'MATERIAL_OR_LIGHT_RETUNING',
    'VISIBLE_RENDERER_OR_RENDER_LOOP',
    'DEPLOYMENT_OR_LIVE_PROMOTION',
    'RUN_8E_PASS_CLOSED'
  ],
  stoppingBoundary: {
    currentCheckpoint: 'RUN_8E_R2F_PASS_CLOSED',
    nextCheckpoint: 'RUN_8E_R3_NOT_STARTED',
    run8ER2Complete: true,
    run8ER2FStarted: true,
    run8ER2FPassClosed: true,
    promotionToR3InputApproved: true,
    mainMergeExecuted: false,
    deploymentExecuted: false,
    run8ER3Started: false,
    run8EPassClosed: false
  }
});

export function evaluateHEarthRun8ER2Control(candidate = H_EARTH_RUN_8E_R2_CONTROL) {
  const issues = [];
  const checkpoints = candidate?.boundedSubcheckpoints ?? [];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R2_CONTRACT_ID) issues.push('R2_CONTRACT_ID_MISMATCH');
  if (candidate?.predecessor?.run8ER1DiagnosticCheckpoint !== 'PASS_CLOSED') issues.push('R1_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.run8E !== 'FAIL_OPEN') issues.push('RUN_8E_NOT_FAIL_OPEN');
  if (checkpoints.length !== 6) issues.push('R2_CHECKPOINT_COUNT_INVALID');
  for (let index = 0; index < 5; index += 1) {
    if (checkpoints[index]?.currentStatus !== 'PASS_CLOSED') issues.push(`R2${String.fromCharCode(65 + index)}_NOT_PASS_CLOSED`);
    if (index > 0 && checkpoints[index - 1]?.finalHead !== checkpoints[index]?.baseHead) {
      issues.push(`R2_STACK_CHAIN_BREAK_${index}`);
    }
  }
  const r2F = checkpoints[5];
  if (r2F?.baseHead !== '096bfbaf45b8987041600385ae16646b00137b9b') issues.push('R2F_BASE_HEAD_MISMATCH');
  if (candidate?.package?.identity !== 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25') issues.push('R2_PACKAGE_IDENTITY_MISMATCH');
  if (candidate?.package?.indexCount !== 147120) issues.push('R2_INDEX_COUNT_MISMATCH');
  if (candidate?.package?.liveRenderPackageGitBlobSha !==
      '1699654f39c9e183f4cfc6f75b20ba051641b763') issues.push('LIVE_RENDER_PACKAGE_IDENTITY_MISMATCH');
  if (candidate?.package?.gpuTransportAdapterGitBlobSha !==
      '785856d7702a0e855c2672e6b8a7325ad5b3ba50') issues.push('GPU_TRANSPORT_ADAPTER_IDENTITY_MISMATCH');
  if (candidate?.establishedResults?.registryRepresentationComplete !== true) issues.push('R2_REGISTRY_INCOMPLETE');
  if (candidate?.establishedResults?.automaticRepositoryRegistryPreflight !== 'PASS') issues.push('R2_PREFLIGHT_NOT_PASS');
  if (candidate?.promotionDecision?.mainBranchPromotion !== 'NOT_EXECUTED') issues.push('MAIN_PROMOTION_EXECUTED');
  if (candidate?.stoppingBoundary?.mainMergeExecuted !== false) issues.push('MAIN_MERGE_EXECUTED');
  if (candidate?.stoppingBoundary?.deploymentExecuted !== false) issues.push('DEPLOYMENT_EXECUTED');
  if (candidate?.stoppingBoundary?.run8ER3Started !== false) issues.push('R3_STARTED_INSIDE_R2');
  if (candidate?.stoppingBoundary?.run8EPassClosed !== false) issues.push('RUN_8E_CLOSED_INSIDE_R2');
  const pending = r2F?.currentStatus === 'EXECUTION_PENDING' &&
    candidate?.stoppingBoundary?.currentCheckpoint === 'RUN_8E_R2F_EXECUTION_PENDING' &&
    candidate?.stoppingBoundary?.run8ER2Complete === false &&
    candidate?.promotionDecision?.promotionToR3Input === 'PENDING_EXECUTION';
  const closed = r2F?.currentStatus === 'PASS_CLOSED' &&
    candidate?.stoppingBoundary?.currentCheckpoint === 'RUN_8E_R2F_PASS_CLOSED' &&
    candidate?.stoppingBoundary?.run8ER2Complete === true &&
    candidate?.stoppingBoundary?.run8ER2FPassClosed === true &&
    candidate?.stoppingBoundary?.promotionToR3InputApproved === true &&
    candidate?.promotionDecision?.r2ConstructionClosure === 'PASS_CLOSED' &&
    candidate?.promotionDecision?.promotionToR3Input === 'APPROVED';
  if (!pending && !closed) issues.push('R2F_PARENT_STATE_INVALID');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length
      ? 'RUN_8E_R2_CONTROL_FAIL'
      : closed
        ? 'RUN_8E_R2_PASS_CLOSED'
        : 'RUN_8E_R2F_EXECUTION_ELIGIBLE',
    issues
  });
}

export default H_EARTH_RUN_8E_R2_CONTROL;

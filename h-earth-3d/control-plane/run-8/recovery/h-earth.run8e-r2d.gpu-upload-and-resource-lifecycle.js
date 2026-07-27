const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R2D_CONTRACT_ID =
  'H_EARTH_RUN_8E_R2D_GPU_UPLOAD_VIEW_AND_RESOURCE_LIFECYCLE_VALIDATION_v1';

export const H_EARTH_RUN_8E_R2D_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R2D_CONTRACT_ID,
  programId: 'H_EARTH_RUN_8E_PHYSICAL_INTERACTION_AND_LIVE_RENDERER_RECOVERY_PROGRAM_v1',
  parentContractId: 'H_EARTH_RUN_8E_R2_IMMUTABLE_LIVE_RENDER_PACKAGE_v1',
  checkpointId: 'RUN_8E_R2D',
  checkpointName: 'GPU_UPLOAD_VIEW_AND_RESOURCE_LIFECYCLE_VALIDATION',
  currentStatus: 'PASS_CLOSED',
  predecessor: {
    checkpointId: 'RUN_8E_R2C',
    status: 'PASS_CLOSED',
    exactHead: '845b6d6acffdd461153b3474044ec533ffd4403b',
    packageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25',
    contentDigest: 'fnv1a32:fd913c25',
    correspondenceAuditManifestDigest:
      'sha256:4a891f5b39a4c361a2cceaa59c9c4200aeffe7603ed9126e4fbf3209889e4dfe'
  },
  executionEvidence: {
    attempt: 'R2D_ATTEMPT_004_CANONICAL_GPU_TRANSPORT',
    executionHead: 'f346df7873b366d961e1bf1dc45d0082a4607590',
    workflowRun: 30240226591,
    workflowJob: 89895687377,
    evidenceArtifact: 8642985618,
    evidenceArtifactDigest: 'sha256:9b1006036a93bfb3cf6c532c21068a37d5013ab5f8d1635cdd917655870de03c',
    passReceipt: '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.pass-closed.receipt.json',
    custodyManifestDigest: 'sha256:0ef98ea0f82370278ecc946247b32a8ab615a665834abdb33fee741ae6b7ec6e',
    canonicalUploadByteLengthPerCycle: 2145444,
    createdBufferCount: 27,
    deletedBufferCount: 27,
    contextLossObserved: true,
    contextRestoreObserved: true,
    canonicalGpuUploadBytesExactAcrossNodeAndChromium: true
  },
  discoveredTransportBoundary: {
    nodeAndChromiumRawPackageIdentityExact: false,
    nodePackageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25',
    chromiumRuntimePackageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_E7D54BDD',
    exactRawTypedBuffers: [
      'positions',
      'baseColorsLinear',
      'materialModelCodes',
      'surfaceClassCodes',
      'primitiveIndices',
      'roleCodes',
      'indices'
    ],
    runtimeDriftTypedBuffers: ['normals', 'materialParameters'],
    disposition: 'CANONICALIZE_ONLY_AT_GPU_TRANSPORT_BOUNDARY',
    canonicalGpuTransportContractId: 'H_EARTH_RUN_8E_R2D_DETERMINISTIC_GPU_UPLOAD_VIEWS_v1',
    canonicalizationDecimalPlaces: 6,
    observedMaximumAbsoluteAdjustment: 5.066394805908203e-7,
    canonicalGpuUploadBytesExact: true,
    sourceAuthorityCorrectionRequired: false,
    liveRenderPackageSourceCorrectionRequired: false
  },
  requiredProofs: [
    'WEBGL_2_CONTEXT_CREATED_IN_ISOLATED_VALIDATION_PAGE',
    'NINE_COPY_ON_REQUEST_TYPED_ARRAY_VIEWS_UPLOADED_TO_GPU_BUFFERS',
    'NORMAL_AND_MATERIAL_PARAMETER_VIEWS_CANONICALIZED_AT_TRANSPORT_BOUNDARY',
    'CANONICAL_GPU_UPLOAD_BYTES_ARE_EXACT_BETWEEN_NODE_AND_CHROMIUM',
    'CANONICALIZATION_ADJUSTMENT_REMAINS_WITHIN_FIXED_SUB_MICRO_UNIT_BOUND',
    'GPU_BUFFER_BYTE_SIZES_MATCH_TYPED_ARRAY_BYTE_LENGTHS',
    'GPU_BUFFER_TARGETS_AND_STATIC_DRAW_USAGE_MATCH_UPLOAD_MANIFEST',
    'ALL_CREATED_GPU_BUFFERS_ARE_RECOGNIZED_BY_CONTEXT',
    'FIRST_RESOURCE_SET_DELETES_CLEANLY',
    'SECOND_RESOURCE_SET_RECREATES_WITH_DISTINCT_BUFFER_OBJECTS',
    'CONTEXT_LOSS_EVENT_IS_OBSERVED_AND_DEFAULT_RESTORATION_IS_ALLOWED',
    'CONTEXT_RESTORATION_EVENT_IS_OBSERVED',
    'POST_RESTORATION_RESOURCE_SET_UPLOADS_AND_DELETES_CLEANLY',
    'NO_WEBGL_ERROR_REMAINS_AFTER_EACH_LIFECYCLE_STAGE',
    'PACKAGE_SOURCE_AND_SOURCE_AUTHORITIES_REMAIN_UNCHANGED',
    'CANONICAL_TYPED_UPLOAD_DIGESTS_REMAIN_UNCHANGED_AFTER_LIFECYCLE',
    'NO_SHADER_PROGRAM_VERTEX_ARRAY_TEXTURE_FRAMEBUFFER_OR_DRAW_CALL_IS_CREATED',
    'CI_SOFTWARE_RENDERER_TIMING_IS_NOT_PERFORMANCE_AUTHORITY'
  ],
  expectedUploadManifest: {
    sourceBufferCount: 9,
    arrayBufferCountPerCycle: 8,
    elementArrayBufferCountPerCycle: 1,
    lifecycleCycleCount: 3,
    expectedIndexType: 'UNSIGNED_INT',
    expectedUsage: 'STATIC_DRAW',
    canonicalizedFloatBufferCount: 2,
    canonicalizationDecimalPlaces: 6,
    maximumPermittedAbsoluteAdjustment: 5.1e-7
  },
  attemptReconciliation: {
    attempt001: 'PRESERVED_RUNTIME_IDENTITY_ASSUMPTION_FAILURE_BEFORE_GPU_UPLOAD',
    attempt002: 'PRESERVED_CONTEXT_RESTORE_TIMING_FAILURE_AFTER_TWO_COMPLETE_UPLOAD_DELETE_CYCLES',
    attempt003: 'PRESERVED_CROSS_RUNTIME_FLOAT32_DRIFT_AFTER_COMPLETE_GPU_LIFECYCLE',
    attempt004: 'PASS_CANONICAL_TRANSPORT_AND_COMPLETE_RESOURCE_LIFECYCLE'
  },
  permittedScope: [
    'R2D_CONTROL_OVERLAY',
    'R2D_DETERMINISTIC_GPU_TRANSPORT_ADAPTER',
    'R2D_ISOLATED_BROWSER_PROBE',
    'R2D_PLAYWRIGHT_VALIDATION_HARNESS',
    'R2D_READ_ONLY_WORKFLOW',
    'R2D_FAILURE_OR_PASS_RECEIPT',
    'PARENT_R2_CHECKPOINT_PROGRESSION_ON_CLOSURE'
  ],
  prohibitedScope: [
    'R2A_R2B_OR_R2C_HISTORY_REWRITE',
    'LIVE_RENDER_PACKAGE_SOURCE_MUTATION',
    'SOURCE_AUTHORITY_MUTATION',
    'PUBLIC_H_EARTH_ROUTE',
    'CAMERA_OR_NAVIGATION_AUTHORITY',
    'POINTER_OR_GESTURE_BINDING',
    'VISIBLE_SCENE_PRESENTATION',
    'SHADER_OR_PROGRAM_CONSTRUCTION',
    'DRAW_CALL_OR_RENDER_LOOP',
    'GEOMETRY_MATERIAL_LIGHT_OR_ATMOSPHERE_RETUNING',
    'DEPLOYMENT_OR_LIVE_PROMOTION',
    'RUN_8E_R2E_OR_LATER_EXECUTION',
    'RUN_8E_PASS_CLOSED'
  ],
  environmentClassification: {
    ciWebGL2Purpose: 'FUNCTIONAL_RESOURCE_LIFECYCLE_EVIDENCE_ONLY',
    ciPerformanceAuthority: false,
    physicalMobilePerformanceAuthority: false,
    deviceBrandSpecificImplementation: false
  },
  stoppingBoundary: {
    currentCheckpoint: 'RUN_8E_R2D_PASS_CLOSED',
    nextCheckpoint: 'RUN_8E_R2E_NOT_STARTED',
    run8ER2EStarted: false,
    run8ER3Started: false,
    publicRendererInstalled: false,
    publicInteractionRestored: false,
    run8EPassClosed: false
  }
});

export function evaluateHEarthRun8ER2DControl(candidate = H_EARTH_RUN_8E_R2D_CONTROL) {
  const issues = [];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R2D_CONTRACT_ID) issues.push('R2D_CONTRACT_ID_MISMATCH');
  if (candidate?.currentStatus !== 'PASS_CLOSED') issues.push('R2D_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.status !== 'PASS_CLOSED') issues.push('R2C_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.exactHead !== '845b6d6acffdd461153b3474044ec533ffd4403b') {
    issues.push('R2C_EXACT_HEAD_MISMATCH');
  }
  if (candidate?.executionEvidence?.workflowRun !== 30240226591) issues.push('R2D_WORKFLOW_RUN_MISMATCH');
  if (candidate?.executionEvidence?.evidenceArtifact !== 8642985618) issues.push('R2D_ARTIFACT_MISMATCH');
  if (candidate?.executionEvidence?.custodyManifestDigest !==
      'sha256:0ef98ea0f82370278ecc946247b32a8ab615a665834abdb33fee741ae6b7ec6e') {
    issues.push('R2D_CUSTODY_DIGEST_MISMATCH');
  }
  if (candidate?.executionEvidence?.createdBufferCount !== 27 ||
      candidate?.executionEvidence?.deletedBufferCount !== 27) {
    issues.push('R2D_RESOURCE_COUNT_MISMATCH');
  }
  if (candidate?.executionEvidence?.canonicalGpuUploadBytesExactAcrossNodeAndChromium !== true) {
    issues.push('R2D_CANONICAL_GPU_BYTES_NOT_EXACT');
  }
  if (candidate?.expectedUploadManifest?.sourceBufferCount !== 9) issues.push('R2D_UPLOAD_CORPUS_INVALID');
  if (candidate?.expectedUploadManifest?.lifecycleCycleCount !== 3) issues.push('R2D_LIFECYCLE_CYCLE_COUNT_INVALID');
  if (candidate?.expectedUploadManifest?.canonicalizedFloatBufferCount !== 2) {
    issues.push('R2D_CANONICALIZED_BUFFER_COUNT_INVALID');
  }
  if (!candidate?.prohibitedScope?.includes('DRAW_CALL_OR_RENDER_LOOP')) issues.push('R2D_DRAW_BOUNDARY_MISSING');
  if (candidate?.stoppingBoundary?.run8ER2EStarted !== false) issues.push('R2E_STARTED_INSIDE_R2D');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8E_R2D_CONTROL_PASS_CLOSED' : 'RUN_8E_R2D_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R2D_CONTROL;

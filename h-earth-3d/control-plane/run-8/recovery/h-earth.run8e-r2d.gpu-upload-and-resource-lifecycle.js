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
  currentStatus: 'EXECUTION_OPEN',
  predecessor: {
    checkpointId: 'RUN_8E_R2C',
    status: 'PASS_CLOSED',
    exactHead: '845b6d6acffdd461153b3474044ec533ffd4403b',
    packageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25',
    contentDigest: 'fnv1a32:fd913c25',
    correspondenceAuditManifestDigest:
      'sha256:4a891f5b39a4c361a2cceaa59c9c4200aeffe7603ed9126e4fbf3209889e4dfe'
  },
  requiredProofs: [
    'WEBGL_2_CONTEXT_CREATED_IN_ISOLATED_VALIDATION_PAGE',
    'NINE_COPY_ON_REQUEST_TYPED_ARRAY_VIEWS_UPLOADED_TO_GPU_BUFFERS',
    'GPU_BUFFER_BYTE_SIZES_MATCH_TYPED_ARRAY_BYTE_LENGTHS',
    'GPU_BUFFER_TARGETS_AND_STATIC_DRAW_USAGE_MATCH_UPLOAD_MANIFEST',
    'ALL_CREATED_GPU_BUFFERS_ARE_RECOGNIZED_BY_CONTEXT',
    'FIRST_RESOURCE_SET_DELETES_CLEANLY',
    'SECOND_RESOURCE_SET_RECREATES_WITH_DISTINCT_BUFFER_OBJECTS',
    'CONTEXT_LOSS_EVENT_IS_OBSERVED_AND_DEFAULT_RESTORATION_IS_ALLOWED',
    'CONTEXT_RESTORATION_EVENT_IS_OBSERVED',
    'POST_RESTORATION_RESOURCE_SET_UPLOADS_AND_DELETES_CLEANLY',
    'NO_WEBGL_ERROR_REMAINS_AFTER_EACH_LIFECYCLE_STAGE',
    'PACKAGE_AND_TYPED_SOURCE_DIGESTS_REMAIN_UNCHANGED',
    'NO_SHADER_PROGRAM_VERTEX_ARRAY_TEXTURE_FRAMEBUFFER_OR_DRAW_CALL_IS_CREATED',
    'CI_SOFTWARE_RENDERER_TIMING_IS_NOT_PERFORMANCE_AUTHORITY'
  ],
  expectedUploadManifest: {
    sourceBufferCount: 9,
    arrayBufferCountPerCycle: 8,
    elementArrayBufferCountPerCycle: 1,
    lifecycleCycleCount: 3,
    expectedIndexType: 'UNSIGNED_INT',
    expectedUsage: 'STATIC_DRAW'
  },
  permittedScope: [
    'R2D_CONTROL_OVERLAY',
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
    currentCheckpoint: 'RUN_8E_R2D_EXECUTION_OPEN',
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
  if (candidate?.predecessor?.status !== 'PASS_CLOSED') issues.push('R2C_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.exactHead !== '845b6d6acffdd461153b3474044ec533ffd4403b') {
    issues.push('R2C_EXACT_HEAD_MISMATCH');
  }
  if (candidate?.expectedUploadManifest?.sourceBufferCount !== 9) issues.push('R2D_UPLOAD_CORPUS_INVALID');
  if (candidate?.expectedUploadManifest?.lifecycleCycleCount !== 3) issues.push('R2D_LIFECYCLE_CYCLE_COUNT_INVALID');
  if (!candidate?.prohibitedScope?.includes('DRAW_CALL_OR_RENDER_LOOP')) issues.push('R2D_DRAW_BOUNDARY_MISSING');
  if (candidate?.stoppingBoundary?.run8ER2EStarted !== false) issues.push('R2E_STARTED_INSIDE_R2D');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8E_R2D_CONTROL_PASS' : 'RUN_8E_R2D_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R2D_CONTROL;

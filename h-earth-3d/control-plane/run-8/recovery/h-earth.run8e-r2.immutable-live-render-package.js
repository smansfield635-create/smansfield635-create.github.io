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
      requiredResult: 'PASS_CLOSED_BEFORE_R2B',
      currentStatus: 'PASS_CLOSED',
      allowedScope: [
        'R2_CONTROL_CONTRACT',
        'ISOLATED_PACKAGE_CANDIDATE',
        'CORE_VALIDATION_HARNESS',
        'READ_ONLY_WORKFLOW',
        'R2A_FAILURE_AND_PASS_RECEIPTS'
      ],
      executionEvidence: {
        attempt: 'R2A_ATTEMPT_002',
        executionStartHead: '81a85604ff6a66dbf023c41c263a69507cd5d276',
        correctedSourceHead: 'e0403370b888f0478ec51cdd96cc2fcdd267e25b',
        workflowRun: 30235565337,
        workflowJob: 89882629845,
        evidenceArtifact: 8641519551,
        evidenceArtifactDigest: 'sha256:605f28dd6e2eb6410126773cee6dc672ff40f964d88e4a7ffbfbf223ecfe095c',
        packageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25',
        contentDigest: 'fnv1a32:fd913c25',
        passReceipt: '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2a.pass-closed.receipt.json',
        predecessorFailureReceipt: '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2a.attempt-001.failure.receipt.json'
      },
      stoppingBoundary: 'STOP_BEFORE_DETERMINISTIC_PACKAGE_CONSTRUCTION_AND_IMMUTABLE_BUFFER_CUSTODY_R2B'
    },
    {
      checkpointId: 'RUN_8E_R2B',
      name: 'DETERMINISTIC_PACKAGE_CONSTRUCTION_AND_IMMUTABLE_BUFFER_CUSTODY',
      requiredResult: 'PASS_CLOSED_BEFORE_R2C',
      currentStatus: 'PASS_CLOSED',
      executionEvidence: {
        workflowRun: 30236786081,
        workflowJob: 89885991485,
        evidenceArtifact: 8641894512,
        evidenceArtifactDigest: 'sha256:fa602494403da07fe834d436b37089f66509af8a5beacf0873ff5b7ac237782e',
        packageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25',
        contentDigest: 'fnv1a32:fd913c25',
        custodyManifestDigest: 'sha256:7e8eb51269053c7c49ff05c6cf1f0250e68066df408fb65ee63cd49f74316b3d',
        passReceipt: '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2b.pass-closed.receipt.json'
      },
      stoppingBoundary: 'STOP_BEFORE_AUTHORITY_CORRESPONDENCE_AUDIT_R2C'
    },
    {
      checkpointId: 'RUN_8E_R2C',
      name: 'SOURCE_AUTHORITY_GEOMETRY_MATERIAL_AND_PROVENANCE_CORRESPONDENCE_AUDIT',
      requiredResult: 'PASS_CLOSED_BEFORE_R2D',
      currentStatus: 'NOT_STARTED',
      stoppingBoundary: 'STOP_BEFORE_GPU_UPLOAD_AND_RESOURCE_LIFECYCLE_R2D'
    },
    {
      checkpointId: 'RUN_8E_R2D',
      name: 'GPU_UPLOAD_VIEW_AND_RESOURCE_LIFECYCLE_VALIDATION',
      requiredResult: 'PASS_CLOSED_BEFORE_R2E',
      currentStatus: 'NOT_STARTED',
      stoppingBoundary: 'STOP_BEFORE_REGISTRY_AND_EXECUTION_CUSTODY_R2E'
    },
    {
      checkpointId: 'RUN_8E_R2E',
      name: 'REGISTRY_DURABLE_RECEIPT_AND_INDEPENDENT_SCOPE_AUDIT',
      requiredResult: 'PASS_CLOSED_BEFORE_R2F',
      currentStatus: 'NOT_STARTED',
      stoppingBoundary: 'STOP_BEFORE_R2_CLOSURE_AND_PROMOTION_R2F'
    },
    {
      checkpointId: 'RUN_8E_R2F',
      name: 'R2_CLOSURE_AND_PROMOTION_DECISION',
      requiredResult: 'PASS_CLOSED_TO_COMPLETE_R2',
      currentStatus: 'NOT_STARTED',
      stoppingBoundary: 'STOP_BEFORE_RUN_8E_R3'
    }
  ],
  governingLaw: [
    'DO_NOT_REBUILD_THE_WORLD_BECAUSE_THE_CAMERA_MOVED',
    'BUILD_THE_WORLD_ONCE',
    'KEEP_WORLD_CAMERA_NAVIGATION_MATERIAL_AND_LIGHT_AUTHORITIES_SHARED',
    'EXPOSE_FRESH_GPU_UPLOAD_VIEWS_WITHOUT_EXPOSING_MUTABLE_PACKAGE_STORAGE',
    'DO_NOT_CREATE_A_RENDER_LOOP_IN_R2',
    'DO_NOT_BIND_R2_TO_THE_PUBLIC_ROUTE'
  ],
  requiredConstructionInputs: [
    'RUN_8E_SUCCESSOR_NEUTRAL_PACKAGE',
    'WEST_BATCH_ADMISSION',
    'RUN_8E_PACKET_002_SUCCESSOR_TRANSFER',
    'RUN_8B_SUCCESSOR_GEOMETRY_NORMALS',
    'RUN_8C_INTRINSIC_TERRAIN_MATERIALS',
    'RUN_7C_ATMOSPHERE_AUTHORITY_DEFAULTS',
    'EXISTING_SHORELINE_AND_VEGETATION_RENDER_INTENT'
  ],
  requiredPackageOutputs: [
    'IMMUTABLE_POSITION_BUFFER_SOURCE',
    'IMMUTABLE_NORMAL_BUFFER_SOURCE',
    'IMMUTABLE_BASE_COLOR_BUFFER_SOURCE',
    'IMMUTABLE_MATERIAL_PARAMETER_BUFFER_SOURCE',
    'IMMUTABLE_MATERIAL_MODEL_CODE_BUFFER_SOURCE',
    'IMMUTABLE_SURFACE_CLASS_CODE_BUFFER_SOURCE',
    'IMMUTABLE_PRIMITIVE_INDEX_BUFFER_SOURCE',
    'IMMUTABLE_TRIANGLE_INDEX_BUFFER_SOURCE',
    'PRIMITIVE_SPAN_TABLE',
    'DRAW_RANGE_TABLE',
    'SOURCE_AUTHORITY_TABLE',
    'DEFAULT_ATMOSPHERE_UNIFORM_SEED',
    'DETERMINISTIC_PACKAGE_IDENTITY',
    'COPY_ON_REQUEST_GPU_BUFFER_VIEWS'
  ],
  correspondenceRequirements: {
    primitiveMembership: 'EXACT',
    primitiveOrder: 'DETERMINISTIC',
    geometryPositions: 'EXACT_NUMERIC_CORRESPONDENCE',
    geometryIndices: 'EXACT_TOPOLOGICAL_CORRESPONDENCE',
    normals: 'SOURCE_OR_DETERMINISTIC_GEOMETRIC_DERIVATION',
    terrainMaterials: 'RUN_8C_INTRINSIC_MATERIAL_AUTHORITY',
    shorelineAndVegetationMaterials: 'EXISTING_PRIMITIVE_RENDER_INTENT_PROJECTION',
    transparencyClasses: 'PRESERVED',
    semanticAndFormationProvenance: 'PRESERVED',
    pixelIdentity: 'NOT_REQUIRED'
  },
  expectedCorpus: {
    primitiveCount: 35,
    terrainPrimitiveCount: 1,
    shorelinePrimitiveCount: 7,
    vegetationPrimitiveCount: 27,
    semanticAddressCount: 256,
    triangleCount: 49040,
    indexCount: 147120
  },
  permittedMutations: [
    'NEW_R2_CONTROL_CONTRACT',
    'NEW_ISOLATED_R2_RENDER_PACKAGE_MODULE',
    'NEW_R2_VALIDATION_AND_DIAGNOSTIC_HARNESS',
    'NEW_R2_REGISTRY_OVERLAY',
    'NEW_READ_ONLY_R2_WORKFLOW',
    'REGISTRY_LOADER_ACTIVATION'
  ],
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
    'WEBGL_CONTEXT_OR_RENDER_LOOP',
    'DEPLOYMENT_OR_LIVE_PROMOTION',
    'RUN_8E_PASS_CLOSED'
  ],
  acceptanceCriteria: [
    'PACKAGE_BUILD_ELIGIBLE',
    'PACKAGE_OBJECT_AND_ALL_EXPOSED_SOURCE_ARRAYS_FROZEN',
    'SECOND_GET_RETURNS_SAME_CACHED_PACKAGE_OBJECT',
    'TWO_EXPLICIT_BUILDS_HAVE_IDENTICAL_DETERMINISTIC_IDENTITY',
    'GPU_VIEW_CALLS_RETURN_DISTINCT_MUTABLE_TYPED_ARRAY_COPIES',
    'GPU_VIEW_MUTATION_CANNOT_MUTATE_PACKAGE_OR_LATER_VIEWS',
    'ALL_NUMERIC_BUFFER_VALUES_FINITE',
    'ALL_INDICES_IN_RANGE',
    'PRIMITIVE_SPANS_AND_DRAW_RANGES_COVER_INDEX_BUFFER_EXACTLY',
    'EXPECTED_CORPUS_COUNTS_MATCH',
    'NO_CAMERA_VIEWPORT_WEBGL_CONTEXT_RENDER_LOOP_OR_ROUTE_BINDING_IN_PACKAGE',
    'SOURCE_AUTHORITIES_AND_R1_FAIL_OPEN_BOUNDARY_PRESERVED'
  ],
  stoppingBoundary: {
    currentCheckpoint: 'RUN_8E_R2B_PASS_CLOSED',
    nextCheckpoint: 'RUN_8E_R2C_NOT_STARTED',
    run8ER2MayCloseOnConstructionAndValidationPass: true,
    run8ER3Started: false,
    publicRendererInstalled: false,
    publicInteractionRestored: false,
    run8EPassClosed: false
  }
});

export function evaluateHEarthRun8ER2Control(candidate = H_EARTH_RUN_8E_R2_CONTROL) {
  const issues = [];
  const checkpoints = candidate?.boundedSubcheckpoints ?? [];
  const r2A = checkpoints[0];
  const r2B = checkpoints[1];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R2_CONTRACT_ID) issues.push('R2_CONTRACT_ID_MISMATCH');
  if (candidate?.predecessor?.run8ER1DiagnosticCheckpoint !== 'PASS_CLOSED') issues.push('R1_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.run8E !== 'FAIL_OPEN') issues.push('RUN_8E_NOT_FAIL_OPEN');
  if (checkpoints.length !== 6) issues.push('R2_BOUNDED_CHECKPOINT_SEQUENCE_INVALID');
  if (r2A?.checkpointId !== 'RUN_8E_R2A' || r2A?.currentStatus !== 'PASS_CLOSED') issues.push('R2A_NOT_PASS_CLOSED');
  if (r2A?.executionEvidence?.packageIdentity !== 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25') issues.push('R2A_PACKAGE_IDENTITY_MISMATCH');
  if (r2A?.executionEvidence?.contentDigest !== 'fnv1a32:fd913c25') issues.push('R2A_CONTENT_DIGEST_MISMATCH');
  if (r2B?.checkpointId !== 'RUN_8E_R2B' || r2B?.currentStatus !== 'PASS_CLOSED') issues.push('R2B_NOT_PASS_CLOSED');
  if (r2B?.executionEvidence?.custodyManifestDigest !== 'sha256:7e8eb51269053c7c49ff05c6cf1f0250e68066df408fb65ee63cd49f74316b3d') issues.push('R2B_CUSTODY_DIGEST_MISMATCH');
  if (checkpoints[5]?.checkpointId !== 'RUN_8E_R2F') issues.push('R2F_NOT_FINAL_CHECKPOINT');
  if (candidate?.expectedCorpus?.primitiveCount !== 35) issues.push('R2_PRIMITIVE_CORPUS_INVALID');
  if (candidate?.expectedCorpus?.indexCount !== 147120) issues.push('R2_INDEX_CORPUS_INVALID');
  if (!candidate?.prohibitedMutations?.includes('WEBGL_CONTEXT_OR_RENDER_LOOP')) issues.push('R2_RENDER_LOOP_BOUNDARY_MISSING');
  if (candidate?.stoppingBoundary?.run8ER3Started !== false) issues.push('R3_STARTED_INSIDE_R2');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8E_R2B_CONTROL_PASS_CLOSED' : 'RUN_8E_R2_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R2_CONTROL;

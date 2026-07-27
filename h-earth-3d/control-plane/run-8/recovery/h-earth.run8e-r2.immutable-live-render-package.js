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
      currentStatus: 'PASS_CLOSED',
      executionEvidence: {
        attempt: 'R2C_ATTEMPT_002',
        executionHead: 'efadea38fa16304de52265da84c16ec1d84afd47',
        workflowRun: 30238237230,
        workflowJob: 89890046797,
        evidenceArtifact: 8642344020,
        evidenceArtifactDigest: 'sha256:012a3c3ba16659fc93da4b62cf38a2c64f3dfc84a925551a10470ef6dcc99556',
        sourceManifestDigest: 'sha256:b0654a8fc2cffe173f0a524c8f4d0ba95eaf2c54cab99c10641a3f27480d508f',
        auditManifestDigest: 'sha256:4a891f5b39a4c361a2cceaa59c9c4200aeffe7603ed9126e4fbf3209889e4dfe',
        passReceipt: '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2c.pass-closed.receipt.json',
        predecessorFailureReceipt: '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2c.attempt-001.failure.receipt.json'
      },
      stoppingBoundary: 'STOP_BEFORE_GPU_UPLOAD_VIEW_AND_RESOURCE_LIFECYCLE_R2D'
    },
    {
      checkpointId: 'RUN_8E_R2D',
      name: 'GPU_UPLOAD_VIEW_AND_RESOURCE_LIFECYCLE_VALIDATION',
      requiredResult: 'PASS_CLOSED_BEFORE_R2E',
      currentStatus: 'PASS_CLOSED',
      executionEvidence: {
        attempt: 'R2D_ATTEMPT_004_CANONICAL_GPU_TRANSPORT',
        executionHead: 'f346df7873b366d961e1bf1dc45d0082a4607590',
        workflowRun: 30240226591,
        workflowJob: 89895687377,
        evidenceArtifact: 8642985618,
        evidenceArtifactDigest: 'sha256:9b1006036a93bfb3cf6c532c21068a37d5013ab5f8d1635cdd917655870de03c',
        custodyManifestDigest: 'sha256:0ef98ea0f82370278ecc946247b32a8ab615a665834abdb33fee741ae6b7ec6e',
        gpuUploadViewContractId: 'H_EARTH_RUN_8E_R2D_DETERMINISTIC_GPU_UPLOAD_VIEWS_v1',
        canonicalGpuUploadByteLengthPerCycle: 2145444,
        createdBufferCount: 27,
        deletedBufferCount: 27,
        canonicalGpuUploadBytesExactAcrossNodeAndChromium: true,
        passReceipt: '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.pass-closed.receipt.json',
        predecessorFailureReceipts: [
          '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.attempt-001.failure.receipt.json',
          '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.attempt-002.failure.receipt.json',
          '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2d.attempt-003.failure.receipt.json'
        ]
      },
      stoppingBoundary: 'STOP_BEFORE_REGISTRY_DURABLE_RECEIPT_AND_INDEPENDENT_SCOPE_AUDIT_R2E'
    },
    {
      checkpointId: 'RUN_8E_R2E',
      name: 'REGISTRY_DURABLE_RECEIPT_AND_INDEPENDENT_SCOPE_AUDIT',
      requiredResult: 'PASS_CLOSED_BEFORE_R2F',
      currentStatus: 'PASS_CLOSED',
      executionEvidence: {
        pullRequest: 224,
        validatedCoreHead: '481dd572eb3351e42e11f48ff75edc37c9e03d76',
        executionEvidenceHead: '2ae6c8cfad013c0ddd3d7f71990357add582ae34',
        workflowRun: 30280738790,
        workflowJob: 90026155156,
        evidenceArtifact: 8658686555,
        evidenceArtifactDigest: 'sha256:adbeab3e9b63dc6ec69282be2cb177f058b20d95203b12b6b5f89c0d53d58260',
        exactOccurrenceManifestDigest: 'sha256:2ae01097d0ab58f6cfd6b2a158ee558f816a2342443b387da410879fb1f2da9a',
        automaticRegistryPreflight: 'PASS',
        passReceipt: '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2e.pass-closed.receipt.json'
      },
      stoppingBoundary: 'STOP_BEFORE_R2_CLOSURE_AND_PROMOTION_DECISION_R2F'
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
    'CANONICALIZE_RUNTIME_DRIFT_ONLY_AT_THE_GPU_TRANSPORT_BOUNDARY',
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
    'COPY_ON_REQUEST_GPU_BUFFER_VIEWS',
    'DETERMINISTIC_CANONICAL_GPU_TRANSPORT_VIEWS'
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
    gpuTransportCanonicalization: 'NORMALS_AND_MATERIAL_PARAMETERS_ONLY',
    pixelIdentity: 'NOT_REQUIRED'
  },
  expectedCorpus: {
    primitiveCount: 35,
    terrainPrimitiveCount: 1,
    shorelinePrimitiveCount: 7,
    vegetationPrimitiveCount: 27,
    semanticAddressCount: 256,
    triangleCount: 49040,
    indexCount: 147120,
    gpuUploadBufferCount: 9,
    gpuUploadByteLengthPerCycle: 2145444
  },
  permittedMutations: [
    'NEW_R2_CONTROL_CONTRACT',
    'NEW_ISOLATED_R2_RENDER_PACKAGE_MODULE',
    'NEW_R2_VALIDATION_AND_DIAGNOSTIC_HARNESS',
    'NEW_R2_GPU_TRANSPORT_ADAPTER',
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
    'VISIBLE_RENDERER_OR_RENDER_LOOP',
    'DEPLOYMENT_OR_LIVE_PROMOTION',
    'RUN_8E_PASS_CLOSED'
  ],
  acceptanceCriteria: [
    'PACKAGE_BUILD_ELIGIBLE',
    'PACKAGE_OBJECT_AND_ALL_EXPOSED_SOURCE_ARRAYS_FROZEN',
    'DETERMINISTIC_PACKAGE_CONSTRUCTION_ESTABLISHED',
    'SOURCE_AUTHORITY_CORRESPONDENCE_ESTABLISHED',
    'CANONICAL_GPU_UPLOAD_BYTES_EXACT_ACROSS_NODE_AND_CHROMIUM',
    'THREE_GPU_RESOURCE_LIFECYCLE_CYCLES_PASS',
    'CONTEXT_LOSS_AND_RESTORATION_PASS',
    'ALL_27_GPU_BUFFERS_DELETED',
    'NO_SHADER_PROGRAM_DRAW_CALL_OR_VISIBLE_PRESENTATION_CREATED',
    'NO_CAMERA_VIEWPORT_RENDER_LOOP_OR_ROUTE_BINDING_IN_PACKAGE',
    'SOURCE_AUTHORITIES_AND_R1_FAIL_OPEN_BOUNDARY_PRESERVED',
    'R2_REGISTRY_REPRESENTATION_AND_EXECUTION_CUSTODY_PASS_CLOSED'
  ],
  stoppingBoundary: {
    currentCheckpoint: 'RUN_8E_R2E_PASS_CLOSED',
    nextCheckpoint: 'RUN_8E_R2F_NOT_STARTED',
    run8ER2MayCloseOnConstructionAndValidationPass: false,
    run8ER2EStarted: true,
    run8ER2EPassClosed: true,
    run8ER2FStarted: false,
    run8ER3Started: false,
    publicRendererInstalled: false,
    publicInteractionRestored: false,
    run8EPassClosed: false
  }
});

export function evaluateHEarthRun8ER2Control(candidate = H_EARTH_RUN_8E_R2_CONTROL) {
  const issues = [];
  const checkpoints = candidate?.boundedSubcheckpoints ?? [];
  const [r2A, r2B, r2C, r2D, r2E, r2F] = checkpoints;
  if (candidate?.contractId !== H_EARTH_RUN_8E_R2_CONTRACT_ID) issues.push('R2_CONTRACT_ID_MISMATCH');
  if (candidate?.predecessor?.run8ER1DiagnosticCheckpoint !== 'PASS_CLOSED') issues.push('R1_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.run8E !== 'FAIL_OPEN') issues.push('RUN_8E_NOT_FAIL_OPEN');
  if (checkpoints.length !== 6) issues.push('R2_BOUNDED_CHECKPOINT_SEQUENCE_INVALID');
  if (r2A?.currentStatus !== 'PASS_CLOSED') issues.push('R2A_NOT_PASS_CLOSED');
  if (r2A?.executionEvidence?.packageIdentity !== 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25') {
    issues.push('R2A_PACKAGE_IDENTITY_MISMATCH');
  }
  if (r2B?.currentStatus !== 'PASS_CLOSED') issues.push('R2B_NOT_PASS_CLOSED');
  if (r2B?.executionEvidence?.custodyManifestDigest !==
      'sha256:7e8eb51269053c7c49ff05c6cf1f0250e68066df408fb65ee63cd49f74316b3d') {
    issues.push('R2B_CUSTODY_DIGEST_MISMATCH');
  }
  if (r2C?.currentStatus !== 'PASS_CLOSED') issues.push('R2C_NOT_PASS_CLOSED');
  if (r2C?.executionEvidence?.auditManifestDigest !==
      'sha256:4a891f5b39a4c361a2cceaa59c9c4200aeffe7603ed9126e4fbf3209889e4dfe') {
    issues.push('R2C_AUDIT_DIGEST_MISMATCH');
  }
  if (r2D?.currentStatus !== 'PASS_CLOSED') issues.push('R2D_NOT_PASS_CLOSED');
  if (r2D?.executionEvidence?.workflowRun !== 30240226591) issues.push('R2D_WORKFLOW_RUN_MISMATCH');
  if (r2D?.executionEvidence?.custodyManifestDigest !==
      'sha256:0ef98ea0f82370278ecc946247b32a8ab615a665834abdb33fee741ae6b7ec6e') {
    issues.push('R2D_CUSTODY_DIGEST_MISMATCH');
  }
  if (r2D?.executionEvidence?.canonicalGpuUploadBytesExactAcrossNodeAndChromium !== true) {
    issues.push('R2D_CANONICAL_GPU_BYTES_NOT_EXACT');
  }
  if (r2E?.currentStatus !== 'PASS_CLOSED') issues.push('R2E_NOT_PASS_CLOSED');
  if (r2E?.executionEvidence?.workflowRun !== 30280738790) issues.push('R2E_WORKFLOW_RUN_MISMATCH');
  if (r2E?.executionEvidence?.evidenceArtifactDigest !==
      'sha256:adbeab3e9b63dc6ec69282be2cb177f058b20d95203b12b6b5f89c0d53d58260') {
    issues.push('R2E_ARTIFACT_DIGEST_MISMATCH');
  }
  if (r2E?.executionEvidence?.exactOccurrenceManifestDigest !==
      'sha256:2ae01097d0ab58f6cfd6b2a158ee558f816a2342443b387da410879fb1f2da9a') {
    issues.push('R2E_OCCURRENCE_MANIFEST_DIGEST_MISMATCH');
  }
  if (r2F?.checkpointId !== 'RUN_8E_R2F' || r2F?.currentStatus !== 'NOT_STARTED') {
    issues.push('R2F_STATE_INVALID');
  }
  if (candidate?.expectedCorpus?.primitiveCount !== 35) issues.push('R2_PRIMITIVE_CORPUS_INVALID');
  if (candidate?.expectedCorpus?.indexCount !== 147120) issues.push('R2_INDEX_CORPUS_INVALID');
  if (candidate?.expectedCorpus?.gpuUploadByteLengthPerCycle !== 2145444) {
    issues.push('R2_GPU_UPLOAD_BYTE_LENGTH_INVALID');
  }
  if (!candidate?.prohibitedMutations?.includes('VISIBLE_RENDERER_OR_RENDER_LOOP')) {
    issues.push('R2_RENDER_LOOP_BOUNDARY_MISSING');
  }
  if (candidate?.stoppingBoundary?.currentCheckpoint !== 'RUN_8E_R2E_PASS_CLOSED') {
    issues.push('R2E_PARENT_CURRENT_CHECKPOINT_INVALID');
  }
  if (candidate?.stoppingBoundary?.nextCheckpoint !== 'RUN_8E_R2F_NOT_STARTED') {
    issues.push('R2F_PARENT_NEXT_CHECKPOINT_INVALID');
  }
  if (candidate?.stoppingBoundary?.run8ER2EPassClosed !== true) issues.push('R2E_PARENT_NOT_PASS_CLOSED');
  if (candidate?.stoppingBoundary?.run8ER2FStarted !== false) issues.push('R2F_STARTED_INSIDE_R2E_CLOSURE');
  if (candidate?.stoppingBoundary?.run8ER3Started !== false) issues.push('R3_STARTED_INSIDE_R2');
  if (candidate?.stoppingBoundary?.run8EPassClosed !== false) issues.push('RUN_8E_CLOSED_INSIDE_R2E');
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8E_R2E_CONTROL_PASS_CLOSED' : 'RUN_8E_R2_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R2_CONTROL;

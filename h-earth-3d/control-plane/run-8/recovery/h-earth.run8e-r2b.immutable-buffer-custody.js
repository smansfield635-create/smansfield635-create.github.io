const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_R2B_CONTRACT_ID =
  'H_EARTH_RUN_8E_R2B_DETERMINISTIC_PACKAGE_AND_IMMUTABLE_BUFFER_CUSTODY_v1';

export const H_EARTH_RUN_8E_R2B_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_R2B_CONTRACT_ID,
  programId: 'H_EARTH_RUN_8E_PHYSICAL_INTERACTION_AND_LIVE_RENDERER_RECOVERY_PROGRAM_v1',
  parentContractId: 'H_EARTH_RUN_8E_R2_IMMUTABLE_LIVE_RENDER_PACKAGE_v1',
  checkpointId: 'RUN_8E_R2B',
  checkpointName: 'DETERMINISTIC_PACKAGE_CONSTRUCTION_AND_IMMUTABLE_BUFFER_CUSTODY',
  currentStatus: 'PASS_CLOSED',
  predecessor: {
    checkpointId: 'RUN_8E_R2A',
    status: 'PASS_CLOSED',
    exactHead: '22b23594005dabdd9374501dae1c561f2dafa648',
    packageIdentity: 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_FD913C25',
    contentDigest: 'fnv1a32:fd913c25'
  },
  requiredProofs: [
    'INDEPENDENT_PACKAGE_RECONSTRUCTIONS_SHARE_ONE_CONTENT_IDENTITY',
    'PACKAGE_OCCURRENCE_ID_DOES_NOT_CHANGE_CONTENT_IDENTITY',
    'PACKAGE_AND_ALL_CUSTODY_SURFACES_ARE_DEEPLY_FROZEN',
    'SOURCE_BUFFER_MUTATION_ATTEMPTS_ARE_REJECTED',
    'EXPLICIT_PACKAGE_BUILDS_DO_NOT_ALIAS_SOURCE_ARRAYS',
    'GPU_UPLOAD_VIEWS_HAVE_DISTINCT_ARRAY_BUFFERS',
    'GPU_VIEW_MUTATION_CANNOT_MUTATE_SOURCE_OR_LATER_VIEWS',
    'INDEPENDENT_DIGEST_RECOMPUTATION_MATCHES_PACKAGE_DIGEST',
    'PER_BUFFER_SHA256_CUSTODY_DIGESTS_ARE_STABLE',
    'POST_MUTATION_RECONSTRUCTION_REMAINS_IDENTICAL'
  ],
  expectedCorpus: {
    primitiveCount: 35,
    vertexCount: 25524,
    triangleCount: 49040,
    indexCount: 147120,
    sourceBufferCount: 9
  },
  permittedScope: [
    'R2B_CONTROL_OVERLAY',
    'R2B_CUSTODY_VALIDATION_HARNESS',
    'R2B_READ_ONLY_WORKFLOW',
    'R2B_FAILURE_OR_PASS_RECEIPT'
  ],
  prohibitedScope: [
    'R2A_HISTORY_REWRITE',
    'LIVE_RENDER_PACKAGE_SOURCE_MUTATION',
    'SOURCE_AUTHORITY_CORRESPONDENCE_DISPOSITION',
    'GPU_RESOURCE_CREATION_OR_UPLOAD',
    'WEBGL_CONTEXT_OR_RENDER_LOOP',
    'PUBLIC_ROUTE_BINDING',
    'CAMERA_OR_NAVIGATION_MUTATION',
    'GEOMETRY_MATERIAL_OR_LIGHT_RETUNING',
    'RUN_8E_R2C_OR_LATER_EXECUTION',
    'DEPLOYMENT_OR_RUN_8E_PASS_CLAIM'
  ],
  executionEvidence: {
    workflowRun: 30236786081,
    workflowJob: 89885991485,
    evidenceArtifact: 8641894512,
    evidenceArtifactDigest: 'sha256:fa602494403da07fe834d436b37089f66509af8a5beacf0873ff5b7ac237782e',
    custodyManifestDigest: 'sha256:7e8eb51269053c7c49ff05c6cf1f0250e68066df408fb65ee63cd49f74316b3d',
    passReceipt: '/h-earth-3d/validation/run-8e-r2/h-earth.run8e-r2b.pass-closed.receipt.json'
  },
  stoppingBoundary: {
    currentCheckpoint: 'RUN_8E_R2B_PASS_CLOSED',
    nextCheckpoint: 'RUN_8E_R2C_NOT_STARTED',
    run8ER2CStarted: false,
    run8ER3Started: false,
    run8EPassClosed: false
  }
});

export function evaluateHEarthRun8ER2BControl(candidate = H_EARTH_RUN_8E_R2B_CONTROL) {
  const issues = [];
  if (candidate?.contractId !== H_EARTH_RUN_8E_R2B_CONTRACT_ID) issues.push('R2B_CONTRACT_ID_MISMATCH');
  if (candidate?.predecessor?.status !== 'PASS_CLOSED') issues.push('R2A_NOT_PASS_CLOSED');
  if (candidate?.predecessor?.exactHead !== '22b23594005dabdd9374501dae1c561f2dafa648') {
    issues.push('R2A_EXACT_HEAD_MISMATCH');
  }
  if (candidate?.expectedCorpus?.sourceBufferCount !== 9) issues.push('R2B_BUFFER_CORPUS_INVALID');
  if (candidate?.stoppingBoundary?.run8ER2CStarted !== false) issues.push('R2C_STARTED_INSIDE_R2B');
  if (!candidate?.prohibitedScope?.includes('GPU_RESOURCE_CREATION_OR_UPLOAD')) {
    issues.push('R2B_GPU_RESOURCE_BOUNDARY_MISSING');
  }
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8E_R2B_CONTROL_PASS_CLOSED' : 'RUN_8E_R2B_CONTROL_FAIL',
    issues
  });
}

export default H_EARTH_RUN_8E_R2B_CONTROL;

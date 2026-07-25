import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

export const H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_TOOL_ID =
  'H_EARTH_CAPACITY_CAMERA_AND_RENDERER_CORRESPONDENCE_VERIFIER_v1';

export const H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H0_CONTRACT_ID =
  'H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_CURRENT_STATE_AND_AUTHORITY_LOCK_H0_v1';

const deepFreeze = value => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  Object.freeze(value);
  for (const child of Object.values(value)) {
    deepFreeze(child);
  }
  return value;
};

const canonicalize = value => {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map(key => [key, canonicalize(value[key])])
    );
  }
  return value;
};

const semanticDigest = value =>
  createHash('sha256')
    .update(JSON.stringify(canonicalize(value)))
    .digest('hex');

export const H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H0_LOCK =
  deepFreeze({
    contractId:
      H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H0_CONTRACT_ID,
    toolId:
      H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_TOOL_ID,
    checkpoint: 'H0',
    checkpointTitle: 'CURRENT_STATE_AND_AUTHORITY_LOCK',
    repository: 'smansfield635-create/smansfield635-create.github.io',
    branch: 'agent/h-earth-capacity-camera-correspondence-verifier-h0-001',
    baseBranch: 'main',
    baseCommit: 'ba0f3ecf3087f91d2cb3ff6aa4dd3c040107712e',
    authorizedCheckpointPaths: [
      'tools/h-earth-capacity-camera-renderer-correspondence-authority-lock.mjs'
    ],
    protectedProductionSources: [
      {
        path: 'showroom/globe/h-earth/capacity.js',
        gitBlob: '0b1c3f6d29735d42141e2feffc5898985e5996af',
        role: 'PRIMARY_CAPACITY_AUTHORITY'
      },
      {
        path: 'showroom/globe/h-earth/compositor.js',
        gitBlob: '480cd4519a4d3cc364be4b16acc7791aadb5071c',
        role: 'PROJECTION_AND_FRAME_CORRESPONDENCE_AUTHORITY'
      },
      {
        path: 'showroom/globe/h-earth/renderer.js',
        gitBlob: '3ff5ea1542b015fe0816dbbf6d42509f3b86b300',
        role: 'RENDERER_CONSTRUCTION_AND_MATERIALIZATION_AUTHORITY'
      },
      {
        path: 'showroom/globe/h-earth/admitted-geometry-frame.js',
        gitBlob: 'c45ed4482f0d653c4a51ea838c191f36e7769d26',
        role: 'ADMITTED_GEOMETRY_FRAME_ADAPTER'
      },
      {
        path: 'showroom/globe/h-earth/render/shoreline-preview.js',
        gitBlob: 'cf4602e5bb57d207ab19a631ff7a0da860f6d2cd',
        role: 'SHORELINE_OCCURRENCE_AGGREGATION'
      },
      {
        path: 'showroom/globe/h-earth/render/geometry-kernel.js',
        gitBlob: '91eabcc240b54ef01a52d59a237dff629d90a722',
        role: 'GEOMETRY_KERNEL_PUBLIC_FACADE'
      }
    ],
    rendererCorridorToolOccurrence: {
      toolId: 'H_EARTH_RENDERER_CORRIDOR_LANE_A_INTEGRATED_TOOL_VERIFICATION_v1',
      pullRequest: 124,
      branch: 'agent/h-earth-renderer-corridor-gate-001',
      commit: '546f6fc05174347ac797837d0b4844a2164c3cb3',
      workflowPath:
        '.github/workflows/h-earth-renderer-corridor-tool-verification.yml',
      workflowGitBlob: 'c70457cb6a0fcca51faef2c2f7440dc9cf4ca59e',
      toolVerified: true,
      mergedToMain: false,
      occurrenceStatus: 'OPEN_PR_BRANCH_OCCURRENCE'
    },
    authority: {
      verifierOwnsMeasurement: true,
      verifierOwnsProductionCapacity: false,
      verifierMayRecommendCorrectionAtH0: false,
      verifierMayApplyCorrection: false,
      productionMutationAuthority: 'NONE',
      sourcePosture: 'READ_ONLY',
      minimumMutationScopeMustBeDerivedFromEvidence: true
    },
    processScope: [
      'CAPACITY_DECLARATION',
      'CAMERA_ENVELOPE_RESOLUTION',
      'COMPOSITOR_PROJECTION',
      'RENDERER_CONSTRUCTION',
      'DOM_MATERIALIZATION',
      'ROUTE_TERMINAL_STATE'
    ],
    claims: {
      sourceCustodyLocked: true,
      productionPathsProtected: true,
      laneSeparationLocked: true,
      productionFilesChanged: 0,
      capacityJsChanged: false,
      compositorJsChanged: false,
      rendererJsChanged: false,
      productionCorrectionStarted: false,
      mergePerformed: false
    }
  });

const fail = (code, details = null) => {
  const error = new Error(code);
  error.code = code;
  error.details = details;
  throw error;
};

export function validateHEarthCapacityCameraRendererH0Lock(candidate) {
  if (!candidate || typeof candidate !== 'object') {
    fail('H0_LOCK_OBJECT_REQUIRED');
  }

  if (candidate.contractId !== H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H0_CONTRACT_ID) {
    fail('H0_CONTRACT_ID_MISMATCH');
  }

  if (candidate.toolId !== H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_TOOL_ID) {
    fail('H0_TOOL_ID_MISMATCH');
  }

  if (candidate.baseCommit !== H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H0_LOCK.baseCommit) {
    fail('H0_BASE_COMMIT_MISMATCH');
  }

  const expectedPaths =
    H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H0_LOCK.protectedProductionSources;
  const actualPaths = candidate.protectedProductionSources;

  if (!Array.isArray(actualPaths) || actualPaths.length !== expectedPaths.length) {
    fail('H0_PROTECTED_SOURCE_COUNT_MISMATCH');
  }

  expectedPaths.forEach((expected, index) => {
    const actual = actualPaths[index];
    if (actual?.path !== expected.path) {
      fail('H0_PROTECTED_SOURCE_PATH_MISMATCH', { index, expected, actual });
    }
    if (actual?.gitBlob !== expected.gitBlob) {
      fail('H0_PROTECTED_SOURCE_BLOB_MISMATCH', { index, expected, actual });
    }
    if (actual?.role !== expected.role) {
      fail('H0_PROTECTED_SOURCE_ROLE_MISMATCH', { index, expected, actual });
    }
  });

  const authorized = candidate.authorizedCheckpointPaths;
  if (
    !Array.isArray(authorized) ||
    authorized.length !== 1 ||
    authorized[0] !==
      'tools/h-earth-capacity-camera-renderer-correspondence-authority-lock.mjs'
  ) {
    fail('H0_AUTHORIZED_CHECKPOINT_PATH_SET_INVALID');
  }

  const authority = candidate.authority;
  if (authority?.verifierOwnsMeasurement !== true) {
    fail('H0_MEASUREMENT_AUTHORITY_MISSING');
  }
  if (authority?.verifierOwnsProductionCapacity !== false) {
    fail('H0_PRODUCTION_CAPACITY_AUTHORITY_PROHIBITED');
  }
  if (authority?.verifierMayApplyCorrection !== false) {
    fail('H0_PRODUCTION_MUTATION_AUTHORITY_PROHIBITED');
  }
  if (authority?.productionMutationAuthority !== 'NONE') {
    fail('H0_PRODUCTION_MUTATION_AUTHORITY_INVALID');
  }
  if (authority?.sourcePosture !== 'READ_ONLY') {
    fail('H0_SOURCE_POSTURE_INVALID');
  }

  const rendererTool = candidate.rendererCorridorToolOccurrence;
  const expectedRendererTool =
    H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H0_LOCK
      .rendererCorridorToolOccurrence;

  for (const key of [
    'toolId',
    'pullRequest',
    'branch',
    'commit',
    'workflowPath',
    'workflowGitBlob',
    'toolVerified',
    'mergedToMain',
    'occurrenceStatus'
  ]) {
    if (rendererTool?.[key] !== expectedRendererTool[key]) {
      fail('H0_RENDERER_TOOL_OCCURRENCE_MISMATCH', {
        key,
        expected: expectedRendererTool[key],
        actual: rendererTool?.[key]
      });
    }
  }

  if (
    candidate.claims?.productionFilesChanged !== 0 ||
    candidate.claims?.capacityJsChanged !== false ||
    candidate.claims?.compositorJsChanged !== false ||
    candidate.claims?.rendererJsChanged !== false ||
    candidate.claims?.productionCorrectionStarted !== false ||
    candidate.claims?.mergePerformed !== false
  ) {
    fail('H0_STOP_BOUNDARY_VIOLATION');
  }

  return deepFreeze({
    contractId: candidate.contractId,
    toolId: candidate.toolId,
    checkpoint: candidate.checkpoint,
    status: 'PASS',
    protectedProductionSourceCount: actualPaths.length,
    authorizedCheckpointPathCount: authorized.length,
    rendererCorridorToolCommit: rendererTool.commit,
    productionFilesChanged: candidate.claims.productionFilesChanged,
    semanticDigestSha256: semanticDigest(candidate)
  });
}

const clone = value => JSON.parse(JSON.stringify(value));

export function executeHEarthCapacityCameraRendererH0Controls() {
  const controls = [];
  const runPass = (id, operation) => {
    try {
      const result = operation();
      controls.push({ id, status: 'PASS', expected: 'PASS', result });
    } catch (error) {
      controls.push({
        id,
        status: 'FAIL',
        expected: 'PASS',
        error: { code: error.code || error.name, message: error.message }
      });
    }
  };
  const runFailClosed = (id, expectedCode, operation) => {
    try {
      operation();
      controls.push({ id, status: 'FAIL', expected: expectedCode, actual: 'NO_ERROR' });
    } catch (error) {
      controls.push({
        id,
        status: error.code === expectedCode ? 'PASS' : 'FAIL',
        expected: expectedCode,
        actual: error.code || error.name
      });
    }
  };

  runPass('VALID_EXACT_H0_LOCK', () =>
    validateHEarthCapacityCameraRendererH0Lock(
      H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H0_LOCK
    )
  );

  runFailClosed('PROTECTED_BLOB_DRIFT', 'H0_PROTECTED_SOURCE_BLOB_MISMATCH', () => {
    const candidate = clone(H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H0_LOCK);
    candidate.protectedProductionSources[0].gitBlob = '0000000000000000000000000000000000000000';
    validateHEarthCapacityCameraRendererH0Lock(candidate);
  });

  runFailClosed('UNAUTHORIZED_PATH_ADDITION', 'H0_AUTHORIZED_CHECKPOINT_PATH_SET_INVALID', () => {
    const candidate = clone(H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H0_LOCK);
    candidate.authorizedCheckpointPaths.push('showroom/globe/h-earth/capacity.js');
    validateHEarthCapacityCameraRendererH0Lock(candidate);
  });

  runFailClosed('PRODUCTION_MUTATION_AUTHORITY', 'H0_PRODUCTION_MUTATION_AUTHORITY_PROHIBITED', () => {
    const candidate = clone(H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H0_LOCK);
    candidate.authority.verifierMayApplyCorrection = true;
    validateHEarthCapacityCameraRendererH0Lock(candidate);
  });

  runFailClosed('RENDERER_TOOL_COMMIT_DRIFT', 'H0_RENDERER_TOOL_OCCURRENCE_MISMATCH', () => {
    const candidate = clone(H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H0_LOCK);
    candidate.rendererCorridorToolOccurrence.commit =
      '0000000000000000000000000000000000000000';
    validateHEarthCapacityCameraRendererH0Lock(candidate);
  });

  runFailClosed('STOP_BOUNDARY_VIOLATION', 'H0_STOP_BOUNDARY_VIOLATION', () => {
    const candidate = clone(H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H0_LOCK);
    candidate.claims.capacityJsChanged = true;
    candidate.claims.productionFilesChanged = 1;
    validateHEarthCapacityCameraRendererH0Lock(candidate);
  });

  const failed = controls.filter(control => control.status !== 'PASS');
  const receiptBody = {
    contractId:
      'H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H0_CONTROL_RECEIPT_v1',
    toolId: H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_TOOL_ID,
    checkpoint: 'H0',
    status: failed.length === 0 ? 'PASS' : 'FAIL',
    controlCount: controls.length,
    passedControlCount: controls.length - failed.length,
    failedControlCount: failed.length,
    controls,
    claims: {
      sourceCustodyLocked: failed.length === 0,
      productionPathsProtected: failed.length === 0,
      laneSeparationLocked: failed.length === 0,
      productionFilesChanged: 0
    }
  };

  return deepFreeze({
    ...receiptBody,
    deterministicReceiptSha256: semanticDigest(receiptBody)
  });
}

const isDirectExecution =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  const receipt = executeHEarthCapacityCameraRendererH0Controls();
  process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
  if (receipt.status !== 'PASS') {
    process.exitCode = 1;
  }
}

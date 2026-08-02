import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

import {
  H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_TOOL_ID,
  H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H0_LOCK,
  validateHEarthCapacityCameraRendererH0Lock
} from './h-earth-capacity-camera-renderer-correspondence-authority-lock.mjs';

export const H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H1_CONTRACT_ID =
  'H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_LAWFUL_MEASUREMENT_MODEL_H1_v1';

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

const fail = (code, details = null) => {
  const error = new Error(code);
  error.code = code;
  error.details = details;
  throw error;
};

const exactKeys = (value, expectedKeys, code) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail(code, { reason: 'OBJECT_REQUIRED' });
  }

  const actual = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();
  if (
    actual.length !== expected.length ||
    actual.some((key, index) => key !== expected[index])
  ) {
    fail(code, { expected, actual });
  }
};

const CAPACITY_DIMENSIONS = Object.freeze([
  'CAMERA_POSE_CAPACITY',
  'FRUSTUM_CAPACITY',
  'ADMITTED_PRIMITIVE_CAPACITY',
  'PROJECTED_FRAGMENT_CAPACITY',
  'SEMANTIC_CONTAINER_CAPACITY',
  'INTERACTION_NODE_CAPACITY',
  'FINAL_RENDERER_OWNED_DOM_CAPACITY',
  'VISIBLE_OUTPUT_CAPACITY'
]);

const CAMERA_INPUT_FIELDS = Object.freeze([
  'cameraPosition',
  'cameraTarget',
  'verticalFieldOfViewDegrees',
  'nearPlane',
  'farPlane',
  'yawDegrees',
  'pitchDegrees',
  'viewportWidth',
  'viewportHeight',
  'devicePixelRatio'
]);

const CAMERA_OUTPUT_FIELDS = Object.freeze([
  'cameraToTargetDistance',
  'nearPlaneEligibility',
  'farPlaneEligibility',
  'horizontalFieldOfViewDegrees',
  'verticalFieldOfViewDegrees',
  'aspectRatio',
  'projectionDepthRange',
  'capacityStageResults',
  'terminalClassification'
]);

const STAGE_DEFINITIONS = Object.freeze([
  Object.freeze({
    stageId: 'STAGE_1_CAMERA_POSE',
    dimensionId: 'CAMERA_POSE_CAPACITY',
    executionStatusAtH1: 'EXECUTABLE'
  }),
  Object.freeze({
    stageId: 'STAGE_2_FRUSTUM',
    dimensionId: 'FRUSTUM_CAPACITY',
    executionStatusAtH1: 'EXECUTABLE'
  }),
  Object.freeze({
    stageId: 'STAGE_3_ADMITTED_PRIMITIVES',
    dimensionId: 'ADMITTED_PRIMITIVE_CAPACITY',
    executionStatusAtH1: 'DEFINED_NOT_EXECUTED'
  }),
  Object.freeze({
    stageId: 'STAGE_4_PROJECTED_FRAGMENTS',
    dimensionId: 'PROJECTED_FRAGMENT_CAPACITY',
    executionStatusAtH1: 'DEFINED_NOT_EXECUTED'
  }),
  Object.freeze({
    stageId: 'STAGE_5_SEMANTIC_CONTAINERS',
    dimensionId: 'SEMANTIC_CONTAINER_CAPACITY',
    executionStatusAtH1: 'DEFINED_NOT_EXECUTED'
  }),
  Object.freeze({
    stageId: 'STAGE_6_INTERACTION_NODES',
    dimensionId: 'INTERACTION_NODE_CAPACITY',
    executionStatusAtH1: 'DEFINED_NOT_EXECUTED'
  }),
  Object.freeze({
    stageId: 'STAGE_7_FINAL_RENDERER_OWNED_DOM',
    dimensionId: 'FINAL_RENDERER_OWNED_DOM_CAPACITY',
    executionStatusAtH1: 'DEFINED_NOT_EXECUTED'
  }),
  Object.freeze({
    stageId: 'STAGE_8_VISIBLE_OUTPUT',
    dimensionId: 'VISIBLE_OUTPUT_CAPACITY',
    executionStatusAtH1: 'DEFINED_NOT_EXECUTED'
  })
]);

export const H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H1_CONTRACT =
  deepFreeze({
    contractId:
      H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H1_CONTRACT_ID,
    toolId:
      H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_TOOL_ID,
    checkpoint: 'H1',
    checkpointTitle: 'CAPACITY_CONTRACT_AND_LAWFUL_MEASUREMENT_MODEL',
    parentCheckpointContractId:
      H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H0_LOCK.contractId,
    parentCheckpointCommit:
      'a28e41e28dd9bd68013667f2fa046f2f045e34ba',
    branch:
      'agent/h-earth-capacity-camera-correspondence-verifier-h1-001',
    authorizedCheckpointPaths: [
      'tools/h-earth-capacity-camera-renderer-correspondence-measurement-contract.mjs'
    ],
    measurementPosture: 'READ_ONLY_CONTRACT_DEFINITION',
    capacityDimensions: CAPACITY_DIMENSIONS,
    cameraEnvelopeInputFields: CAMERA_INPUT_FIELDS,
    cameraEnvelopeOutputFields: CAMERA_OUTPUT_FIELDS,
    stageDefinitions: STAGE_DEFINITIONS,
    distinctQuantityLaw:
      'ADMITTED_PRIMITIVES != PROJECTED_FRAGMENTS != FINAL_RENDERER_OWNED_DOM_NODES',
    numericalBounds: {
      verticalFieldOfViewDegrees: { minimumExclusive: 0, maximumExclusive: 180 },
      nearPlane: { minimumExclusive: 0 },
      yawDegrees: { minimumInclusive: -180, maximumInclusive: 180 },
      pitchDegrees: { minimumInclusive: -89, maximumInclusive: 89 },
      viewportWidth: { minimumInclusive: 240, maximumInclusive: 7680 },
      viewportHeight: { minimumInclusive: 320, maximumInclusive: 4320 },
      devicePixelRatio: { minimumInclusive: 0.5, maximumInclusive: 4 }
    },
    terminalClassifications: [
      'CAMERA_AND_FRUSTUM_CONTRACT_ELIGIBLE',
      'CAMERA_POSE_INELIGIBLE',
      'FRUSTUM_INELIGIBLE',
      'MEASUREMENT_CONTRACT_INVALID'
    ],
    claims: {
      capacityContractDefined: true,
      cameraEnvelopeContractDefined: true,
      stageSeparationDefined: true,
      productionObservationPerformed: false,
      rendererExecutionPerformed: false,
      productionFilesChanged: 0,
      productionCorrectionStarted: false,
      h2Started: false,
      mergePerformed: false
    }
  });

export function validateHEarthCapacityCameraRendererH1Contract(candidate) {
  validateHEarthCapacityCameraRendererH0Lock(
    H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H0_LOCK
  );

  if (!candidate || typeof candidate !== 'object') {
    fail('H1_CONTRACT_OBJECT_REQUIRED');
  }
  if (
    candidate.contractId !==
    H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H1_CONTRACT_ID
  ) {
    fail('H1_CONTRACT_ID_MISMATCH');
  }
  if (
    candidate.toolId !==
    H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_TOOL_ID
  ) {
    fail('H1_TOOL_ID_MISMATCH');
  }
  if (
    candidate.parentCheckpointContractId !==
    H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H0_LOCK.contractId
  ) {
    fail('H1_PARENT_CHECKPOINT_CONTRACT_MISMATCH');
  }
  if (candidate.measurementPosture !== 'READ_ONLY_CONTRACT_DEFINITION') {
    fail('H1_MEASUREMENT_POSTURE_INVALID');
  }

  const paths = candidate.authorizedCheckpointPaths;
  if (
    !Array.isArray(paths) ||
    paths.length !== 1 ||
    paths[0] !==
      'tools/h-earth-capacity-camera-renderer-correspondence-measurement-contract.mjs'
  ) {
    fail('H1_AUTHORIZED_CHECKPOINT_PATH_SET_INVALID');
  }

  if (
    !Array.isArray(candidate.capacityDimensions) ||
    candidate.capacityDimensions.length !== CAPACITY_DIMENSIONS.length ||
    candidate.capacityDimensions.some(
      (dimension, index) => dimension !== CAPACITY_DIMENSIONS[index]
    )
  ) {
    fail('H1_CAPACITY_DIMENSIONS_INVALID');
  }

  if (
    !Array.isArray(candidate.cameraEnvelopeInputFields) ||
    candidate.cameraEnvelopeInputFields.length !== CAMERA_INPUT_FIELDS.length ||
    candidate.cameraEnvelopeInputFields.some(
      (field, index) => field !== CAMERA_INPUT_FIELDS[index]
    )
  ) {
    fail('H1_CAMERA_INPUT_CONTRACT_INVALID');
  }

  if (
    !Array.isArray(candidate.cameraEnvelopeOutputFields) ||
    candidate.cameraEnvelopeOutputFields.length !== CAMERA_OUTPUT_FIELDS.length ||
    candidate.cameraEnvelopeOutputFields.some(
      (field, index) => field !== CAMERA_OUTPUT_FIELDS[index]
    )
  ) {
    fail('H1_CAMERA_OUTPUT_CONTRACT_INVALID');
  }

  if (
    !Array.isArray(candidate.stageDefinitions) ||
    candidate.stageDefinitions.length !== STAGE_DEFINITIONS.length
  ) {
    fail('H1_STAGE_DEFINITION_COUNT_INVALID');
  }

  const seenStageIds = new Set();
  const seenDimensions = new Set();
  candidate.stageDefinitions.forEach((stage, index) => {
    exactKeys(
      stage,
      ['stageId', 'dimensionId', 'executionStatusAtH1'],
      'H1_STAGE_DEFINITION_KEYS_INVALID'
    );
    if (seenStageIds.has(stage.stageId)) {
      fail('H1_DUPLICATE_STAGE_ID', { stageId: stage.stageId });
    }
    if (seenDimensions.has(stage.dimensionId)) {
      fail('H1_DUPLICATE_STAGE_DIMENSION', { dimensionId: stage.dimensionId });
    }
    seenStageIds.add(stage.stageId);
    seenDimensions.add(stage.dimensionId);

    const expected = STAGE_DEFINITIONS[index];
    if (
      stage.stageId !== expected.stageId ||
      stage.dimensionId !== expected.dimensionId ||
      stage.executionStatusAtH1 !== expected.executionStatusAtH1
    ) {
      fail('H1_STAGE_DEFINITION_CONFLICT', { index, expected, actual: stage });
    }
  });

  for (const dimension of CAPACITY_DIMENSIONS) {
    if (!seenDimensions.has(dimension)) {
      fail('H1_STAGE_DIMENSION_MISSING', { dimension });
    }
  }

  if (
    candidate.distinctQuantityLaw !==
    'ADMITTED_PRIMITIVES != PROJECTED_FRAGMENTS != FINAL_RENDERER_OWNED_DOM_NODES'
  ) {
    fail('H1_DISTINCT_QUANTITY_LAW_INVALID');
  }

  if (
    candidate.claims?.productionObservationPerformed !== false ||
    candidate.claims?.rendererExecutionPerformed !== false ||
    candidate.claims?.productionFilesChanged !== 0 ||
    candidate.claims?.productionCorrectionStarted !== false ||
    candidate.claims?.h2Started !== false ||
    candidate.claims?.mergePerformed !== false
  ) {
    fail('H1_STOP_BOUNDARY_VIOLATION');
  }

  return deepFreeze({
    contractId: candidate.contractId,
    toolId: candidate.toolId,
    checkpoint: candidate.checkpoint,
    status: 'PASS',
    capacityDimensionCount: candidate.capacityDimensions.length,
    stageDefinitionCount: candidate.stageDefinitions.length,
    inputFieldCount: candidate.cameraEnvelopeInputFields.length,
    outputFieldCount: candidate.cameraEnvelopeOutputFields.length,
    semanticDigestSha256: semanticDigest(candidate)
  });
}

const finiteVector3 = (value, code) => {
  if (
    !Array.isArray(value) ||
    value.length !== 3 ||
    value.some(component => !Number.isFinite(component))
  ) {
    fail(code, { value });
  }
  return value;
};

const finiteNumber = (value, code) => {
  if (!Number.isFinite(value)) {
    fail(code, { value });
  }
  return value;
};

const withinInclusive = (value, bounds) =>
  value >= bounds.minimumInclusive && value <= bounds.maximumInclusive;

export function evaluateHEarthCapacityCameraEnvelope(
  input,
  contract = H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H1_CONTRACT
) {
  validateHEarthCapacityCameraRendererH1Contract(contract);
  exactKeys(input, CAMERA_INPUT_FIELDS, 'H1_CAMERA_INPUT_KEYS_INVALID');

  const cameraPosition = finiteVector3(
    input.cameraPosition,
    'H1_CAMERA_POSITION_NONFINITE'
  );
  const cameraTarget = finiteVector3(
    input.cameraTarget,
    'H1_CAMERA_TARGET_NONFINITE'
  );
  const verticalFieldOfViewDegrees = finiteNumber(
    input.verticalFieldOfViewDegrees,
    'H1_VERTICAL_FOV_NONFINITE'
  );
  const nearPlane = finiteNumber(input.nearPlane, 'H1_NEAR_PLANE_NONFINITE');
  const farPlane = finiteNumber(input.farPlane, 'H1_FAR_PLANE_NONFINITE');
  const yawDegrees = finiteNumber(input.yawDegrees, 'H1_YAW_NONFINITE');
  const pitchDegrees = finiteNumber(input.pitchDegrees, 'H1_PITCH_NONFINITE');
  const viewportWidth = finiteNumber(
    input.viewportWidth,
    'H1_VIEWPORT_WIDTH_NONFINITE'
  );
  const viewportHeight = finiteNumber(
    input.viewportHeight,
    'H1_VIEWPORT_HEIGHT_NONFINITE'
  );
  const devicePixelRatio = finiteNumber(
    input.devicePixelRatio,
    'H1_DEVICE_PIXEL_RATIO_NONFINITE'
  );

  const bounds = contract.numericalBounds;
  if (
    verticalFieldOfViewDegrees <=
      bounds.verticalFieldOfViewDegrees.minimumExclusive ||
    verticalFieldOfViewDegrees >=
      bounds.verticalFieldOfViewDegrees.maximumExclusive
  ) {
    fail('H1_VERTICAL_FOV_OUTSIDE_LAWFUL_RANGE');
  }
  if (nearPlane <= bounds.nearPlane.minimumExclusive) {
    fail('H1_NEAR_PLANE_INVALID');
  }
  if (farPlane <= nearPlane) {
    fail('H1_NEAR_FAR_ORDER_INVALID');
  }
  if (!withinInclusive(yawDegrees, bounds.yawDegrees)) {
    fail('H1_YAW_OUTSIDE_LAWFUL_RANGE');
  }
  if (!withinInclusive(pitchDegrees, bounds.pitchDegrees)) {
    fail('H1_PITCH_OUTSIDE_LAWFUL_RANGE');
  }
  if (
    !Number.isInteger(viewportWidth) ||
    !Number.isInteger(viewportHeight) ||
    !withinInclusive(viewportWidth, bounds.viewportWidth) ||
    !withinInclusive(viewportHeight, bounds.viewportHeight) ||
    !withinInclusive(devicePixelRatio, bounds.devicePixelRatio)
  ) {
    fail('H1_UNSUPPORTED_VIEWPORT_PROFILE', {
      viewportWidth,
      viewportHeight,
      devicePixelRatio
    });
  }

  const dx = cameraTarget[0] - cameraPosition[0];
  const dy = cameraTarget[1] - cameraPosition[1];
  const dz = cameraTarget[2] - cameraPosition[2];
  const cameraToTargetDistance = Math.hypot(dx, dy, dz);

  if (!(cameraToTargetDistance > nearPlane)) {
    fail('H1_CAMERA_TARGET_AT_OR_BEFORE_NEAR_PLANE', {
      cameraToTargetDistance,
      nearPlane
    });
  }
  if (!(cameraToTargetDistance < farPlane)) {
    fail('H1_FAR_PLANE_SHORTER_THAN_CAMERA_TARGET_DISTANCE', {
      cameraToTargetDistance,
      farPlane
    });
  }

  const aspectRatio = viewportWidth / viewportHeight;
  const verticalRadians = verticalFieldOfViewDegrees * Math.PI / 180;
  const horizontalFieldOfViewDegrees =
    2 * Math.atan(Math.tan(verticalRadians / 2) * aspectRatio) * 180 / Math.PI;

  const capacityStageResults = contract.stageDefinitions.map(stage =>
    deepFreeze({
      stageId: stage.stageId,
      dimensionId: stage.dimensionId,
      status:
        stage.executionStatusAtH1 === 'EXECUTABLE'
          ? 'PASS'
          : 'DEFINED_NOT_EXECUTED',
      claimEstablished:
        stage.executionStatusAtH1 === 'EXECUTABLE'
    })
  );

  const resultBody = {
    contractId: contract.contractId,
    toolId: contract.toolId,
    checkpoint: 'H1',
    eligible: true,
    cameraToTargetDistance,
    nearPlaneEligibility: true,
    farPlaneEligibility: true,
    horizontalFieldOfViewDegrees,
    verticalFieldOfViewDegrees,
    aspectRatio,
    projectionDepthRange: farPlane - nearPlane,
    capacityStageResults,
    terminalClassification: 'CAMERA_AND_FRUSTUM_CONTRACT_ELIGIBLE',
    claims: {
      cameraPoseMeasured: true,
      frustumMeasured: true,
      admittedPrimitiveCapacityMeasured: false,
      projectedFragmentCapacityMeasured: false,
      finalRendererOwnedDomCapacityMeasured: false,
      visibleOutputCapacityMeasured: false,
      productionObservationPerformed: false,
      rendererExecutionPerformed: false
    }
  };

  return deepFreeze({
    ...resultBody,
    semanticDigestSha256: semanticDigest(resultBody)
  });
}

const clone = value => JSON.parse(JSON.stringify(value));

const VALID_BASELINE_INPUT = deepFreeze({
  cameraPosition: [0, 14, -240],
  cameraTarget: [0, 0.6, -48],
  verticalFieldOfViewDegrees: 60,
  nearPlane: 0.25,
  farPlane: 512,
  yawDegrees: 180,
  pitchDegrees: 0,
  viewportWidth: 1440,
  viewportHeight: 900,
  devicePixelRatio: 1
});

export function executeHEarthCapacityCameraRendererH1Controls() {
  const controls = [];
  const runPass = (id, operation, predicate = value => Boolean(value)) => {
    try {
      const result = operation();
      controls.push({
        id,
        status: predicate(result) ? 'PASS' : 'FAIL',
        expected: 'PASS',
        result
      });
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

  runPass('VALID_LAWFUL_CAMERA_ENVELOPE', () =>
    evaluateHEarthCapacityCameraEnvelope(VALID_BASELINE_INPUT)
  );

  runFailClosed(
    'FAR_PLANE_SHORTER_THAN_CAMERA_TARGET',
    'H1_FAR_PLANE_SHORTER_THAN_CAMERA_TARGET_DISTANCE',
    () => evaluateHEarthCapacityCameraEnvelope({
      ...clone(VALID_BASELINE_INPUT),
      farPlane: 100
    })
  );

  runFailClosed('INVALID_NEAR_PLANE', 'H1_NEAR_PLANE_INVALID', () =>
    evaluateHEarthCapacityCameraEnvelope({
      ...clone(VALID_BASELINE_INPUT),
      nearPlane: 0
    })
  );

  runFailClosed('NEAR_GREATER_THAN_OR_EQUAL_TO_FAR', 'H1_NEAR_FAR_ORDER_INVALID', () =>
    evaluateHEarthCapacityCameraEnvelope({
      ...clone(VALID_BASELINE_INPUT),
      nearPlane: 512,
      farPlane: 512
    })
  );

  runFailClosed('NONFINITE_CAMERA_COORDINATE', 'H1_CAMERA_POSITION_NONFINITE', () =>
    evaluateHEarthCapacityCameraEnvelope({
      ...clone(VALID_BASELINE_INPUT),
      cameraPosition: [0, Number.NaN, -240]
    })
  );

  runFailClosed('UNSUPPORTED_VIEWPORT', 'H1_UNSUPPORTED_VIEWPORT_PROFILE', () =>
    evaluateHEarthCapacityCameraEnvelope({
      ...clone(VALID_BASELINE_INPUT),
      viewportWidth: 200
    })
  );

  runFailClosed('CONFLICTING_STAGE_DEFINITIONS', 'H1_STAGE_DEFINITION_CONFLICT', () => {
    const contract = clone(H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H1_CONTRACT);
    contract.stageDefinitions[3].dimensionId = 'FINAL_RENDERER_OWNED_DOM_CAPACITY';
    validateHEarthCapacityCameraRendererH1Contract(contract);
  });

  runPass(
    'DETERMINISTIC_REPEAT_DIGEST',
    () => {
      const first = evaluateHEarthCapacityCameraEnvelope(VALID_BASELINE_INPUT);
      const second = evaluateHEarthCapacityCameraEnvelope(VALID_BASELINE_INPUT);
      return {
        first: first.semanticDigestSha256,
        second: second.semanticDigestSha256,
        identical: first.semanticDigestSha256 === second.semanticDigestSha256
      };
    },
    result => result.identical === true
  );

  const failed = controls.filter(control => control.status !== 'PASS');
  const receiptBody = {
    contractId:
      'H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H1_CONTROL_RECEIPT_v1',
    toolId: H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_TOOL_ID,
    checkpoint: 'H1',
    status: failed.length === 0 ? 'PASS' : 'FAIL',
    controlCount: controls.length,
    passedControlCount: controls.length - failed.length,
    failedControlCount: failed.length,
    controls,
    claims: {
      capacityContractDefined: failed.length === 0,
      cameraEnvelopeContractDefined: failed.length === 0,
      stageSeparationDefined: failed.length === 0,
      validBaselineFixture: controls[0]?.status === 'PASS',
      invalidContractFixturesFailClosed:
        controls.slice(1, 7).every(control => control.status === 'PASS'),
      deterministicDigestVerified: controls[7]?.status === 'PASS',
      productionObservationPerformed: false,
      rendererExecutionPerformed: false,
      productionFilesChanged: 0,
      productionCorrectionStarted: false,
      h2Started: false,
      mergePerformed: false
    }
  };

  return deepFreeze({
    ...receiptBody,
    deterministicReceiptSha256: semanticDigest(receiptBody)
  });
}

const isDirectExecution =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  const receipt = executeHEarthCapacityCameraRendererH1Controls();
  console.log(JSON.stringify(receipt, null, 2));
  if (receipt.status !== 'PASS') {
    process.exitCode = 1;
  }
}

import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { executeH2Observation } from './h-earth-capacity-camera-renderer-correspondence-h2-observer.mjs';
import { executeH4Controls } from './h-earth-capacity-camera-renderer-correspondence-h4-controls.mjs';
import {
  H5_CONTRACT,
  classifyH5ToolProductRelation,
  createH5PositiveControl,
  createProductionCameraCandidate,
  deepFreeze,
  digest,
  evaluateH5CameraCandidate,
  evaluateH5CapacityCandidate,
  fail,
  requireH5CapacityReceipt,
  validateH5Contract,
  verifyH5RequiredSourceIdentity
} from './h-earth-capacity-camera-renderer-correspondence-h5-taxonomy.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const clone = value => JSON.parse(JSON.stringify(value));

const controlledBudgets = facts => ({
  admittedPrimitives: facts.budgets.environmentPrimitives,
  projectedFragments: { minimum: 1, preferredMaximum: 384, absoluteMaximum: 512 },
  semanticContainers: facts.budgets.semanticLayerContainers,
  interactionNodes: facts.budgets.interactionNodes,
  finalRendererOwnedDom: facts.budgets.totalRendererOwnedNodes
});

const lawfulCapacityCandidate = facts => ({
  cameraEligible: true,
  frustumEligible: true,
  admittedPrimitiveCount: 3,
  projectedPlanFragmentCount: 120,
  semanticContainerCount: 15,
  interactionNodeCount: 1,
  infrastructureNodeCount: 2,
  mountedProjectedFragmentNodeCount: 120,
  rendererMountSucceeded: true,
  budgets: controlledBudgets(facts),
  diagnostics: { cameraAndFrustum: { controlledFixture: true } }
});

export async function executeH5Controls({ repositoryRoot = resolve(here, '..') } = {}) {
  validateH5Contract();
  const h2 = await executeH2Observation({ repositoryRoot });
  const h4 = await executeH4Controls({ repositoryRoot });
  if (h2.status !== undefined && h2.status !== 'PASS') fail('H5_H2_OBSERVATION_NOT_PASS');
  if (h4.status !== 'PASS') fail('H5_H4_CONTROL_RECEIPT_NOT_PASS');

  const productionFacts = h2.productionFacts;
  const baseCamera = createProductionCameraCandidate(productionFacts);
  const baseCapacity = lawfulCapacityCandidate(productionFacts);
  const controls = [];

  const pass = (id, operation, predicate = value => Boolean(value)) => {
    try {
      const result = operation();
      controls.push({ id, category: 'PASS_CONTROL', status: predicate(result) ? 'PASS' : 'FAIL', expected: 'PASS', result });
    } catch (error) {
      controls.push({ id, category: 'PASS_CONTROL', status: 'FAIL', expected: 'PASS', actual: error.code ?? error.name });
    }
  };
  const failClosed = (id, expectedCode, operation) => {
    try {
      operation();
      controls.push({ id, category: 'NEGATIVE_CONTROL', status: 'FAIL', expected: expectedCode, actual: 'NO_ERROR' });
    } catch (error) {
      controls.push({ id, category: 'NEGATIVE_CONTROL', status: error.code === expectedCode ? 'PASS' : 'FAIL', expected: expectedCode, actual: error.code ?? error.name });
    }
  };

  const actualRelation = classifyH5ToolProductRelation({ toolReceipt: h4, productReceipt: h4.actualEvaluation });
  pass('ACTUAL_PRODUCT_FAILURE_TOOL_HEALTH_DISTINCTION', () => ({
    relation: actualRelation,
    productTerminalClassification: h4.actualEvaluation.terminalClassification,
    earliestNonPassStage: h4.actualEvaluation.earliestNonPassStage
  }), value => value.relation.classification === 'TOOL_PASS_PRODUCT_CAPACITY_BLOCKED_OR_FAILED' && value.productTerminalClassification === 'PROJECTED_FRAGMENT_BUDGET_UNRESOLVED');

  const positiveControl = createH5PositiveControl({
    cameraCandidate: baseCamera,
    productionFacts,
    capacityCandidate: baseCapacity,
    visibleOutputRatio: 0.75
  });
  pass('LAWFUL_FULL_STAGE_POSITIVE_CONTROL', () => positiveControl, value => value.terminalClassification === 'H5_POSITIVE_CONTROL_ELIGIBLE');

  failClosed('FAR_PLANE_TOO_SHORT', 'H5_FAR_PLANE_TOO_SHORT', () =>
    evaluateH5CameraCandidate({ ...clone(baseCamera), farPlane: 100 }, productionFacts));
  failClosed('NEAR_PLANE_INVALID', 'H5_NEAR_PLANE_INVALID', () =>
    evaluateH5CameraCandidate({ ...clone(baseCamera), nearPlane: 0 }, productionFacts));
  failClosed('TARGET_OUTSIDE_ALLOWED_BOUND', 'H5_TARGET_OUTSIDE_ALLOWED_BOUND', () =>
    evaluateH5CameraCandidate({ ...clone(baseCamera), cameraTarget: [97, 0.6, -48] }, productionFacts));
  failClosed('CAMERA_POSITION_OUTSIDE_ALLOWED_BOUND', 'H5_CAMERA_POSITION_OUTSIDE_ALLOWED_BOUND', () =>
    evaluateH5CameraCandidate({ ...clone(baseCamera), cameraPosition: [257, 14, -240] }, productionFacts));
  failClosed('FOV_OUTSIDE_ALLOWED_RANGE', 'H5_FOV_OUTSIDE_ALLOWED_RANGE', () =>
    evaluateH5CameraCandidate({ ...clone(baseCamera), verticalFieldOfViewDegrees: 70 }, productionFacts));
  failClosed('PROJECTED_FRAGMENT_BUDGET_EXCEEDED', 'H5_PROJECTED_FRAGMENT_BUDGET_EXCEEDED', () =>
    evaluateH5CapacityCandidate({ ...clone(baseCapacity), projectedPlanFragmentCount: 513, mountedProjectedFragmentNodeCount: 513 }));
  failClosed('FINAL_DOM_NODE_BUDGET_EXCEEDED', 'H5_FINAL_DOM_NODE_BUDGET_EXCEEDED', () =>
    evaluateH5CapacityCandidate({ ...clone(baseCapacity), projectedPlanFragmentCount: 431, mountedProjectedFragmentNodeCount: 431 }));
  failClosed('REQUIRED_SOURCE_IDENTITY_MISMATCH', 'H5_REQUIRED_SOURCE_IDENTITY_MISMATCH', () => {
    const custody = clone(h2.sourceCustody);
    custody[0].gitBlob = '0000000000000000000000000000000000000000';
    verifyH5RequiredSourceIdentity(custody);
  });
  failClosed('MISSING_CAPACITY_RECEIPT', 'H5_MISSING_CAPACITY_RECEIPT', () => requireH5CapacityReceipt(null));
  failClosed('MALFORMED_VIEWPORT_PROFILE', 'H5_MALFORMED_VIEWPORT_PROFILE', () =>
    evaluateH5CameraCandidate({ ...clone(baseCamera), viewportWidth: 200 }, productionFacts));

  pass('DETERMINISTIC_REPEAT_POSITIVE_CONTROL', () => {
    const repeated = createH5PositiveControl({
      cameraCandidate: baseCamera,
      productionFacts,
      capacityCandidate: baseCapacity,
      visibleOutputRatio: 0.75
    });
    return {
      first: positiveControl.deterministicReceiptSha256,
      second: repeated.deterministicReceiptSha256,
      identical: positiveControl.deterministicReceiptSha256 === repeated.deterministicReceiptSha256
    };
  }, value => value.identical === true);

  const failed = controls.filter(control => control.status !== 'PASS');
  const negativeControls = controls.filter(control => control.category === 'NEGATIVE_CONTROL');
  const body = {
    contractId: 'H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H5_CONTROL_RECEIPT_v1',
    toolId: H5_CONTRACT.toolId,
    checkpoint: 'H5',
    status: failed.length === 0 ? 'PASS' : 'FAIL',
    controlCount: controls.length,
    passedControlCount: controls.length - failed.length,
    failedControlCount: failed.length,
    positiveControlCount: 1,
    negativeControlCount: negativeControls.length,
    expectedFailureTaxonomy: H5_CONTRACT.failureTaxonomy,
    actualProductionResult: {
      toolExecution: 'PASS',
      productCapacityResult: 'BLOCKED',
      toolFailure: false,
      terminalClassification: h4.actualEvaluation.terminalClassification,
      earliestNonPassStage: h4.actualEvaluation.earliestNonPassStage,
      relationClassification: actualRelation.classification
    },
    positiveControl,
    controls,
    claims: {
      positiveControlPass: controls[1]?.status === 'PASS',
      negativeControlsFailClosed: negativeControls.length === 10 && negativeControls.every(control => control.status === 'PASS'),
      unexpectedFailureCodes: negativeControls.filter(control => control.status !== 'PASS').length,
      productFailureToolHealthControlPass: controls[0]?.status === 'PASS',
      deterministicDigestVerified: controls.at(-1)?.status === 'PASS',
      rendererExecutionPerformed: false,
      browserExecutionPerformed: false,
      productionFilesChanged: 0,
      productionCorrectionStarted: false,
      h6Started: false,
      mergePerformed: false
    }
  };
  return deepFreeze({ ...body, deterministicReceiptSha256: digest(body) });
}

const direct = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (direct) {
  const receipt = await executeH5Controls();
  console.log(JSON.stringify(receipt, null, 2));
  if (receipt.status !== 'PASS') process.exitCode = 1;
}

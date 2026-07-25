import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { executeH5Controls } from './h-earth-capacity-camera-renderer-correspondence-h5-controls.mjs';
import {
  H6_CONTRACT,
  classifyControlledCorrespondence,
  deepFreeze,
  digest,
  evaluateActualH6Correspondence,
  validateH6Contract,
  verifyRendererToolSourceCustody
} from './h-earth-capacity-camera-renderer-correspondence-h6-correspondence.mjs';

const here = dirname(fileURLToPath(import.meta.url));

export async function executeH6Controls({ repositoryRoot = resolve(here, '..') } = {}) {
  validateH6Contract();
  const rendererAggregate = JSON.parse(await readFile(resolve(repositoryRoot, 'artifacts/h-earth-renderer-corridor/aggregate.receipt.json'), 'utf8'));
  const rendererSourceCustody = JSON.parse(await readFile(resolve(repositoryRoot, 'artifacts/h-earth-capacity-camera-h6/renderer-tool-source-custody.json'), 'utf8'));
  const h5 = await executeH5Controls({ repositoryRoot });
  const actual = evaluateActualH6Correspondence({ h5Receipt: h5, rendererAggregateReceipt: rendererAggregate, rendererSourceCustody });
  const controls = [];
  const pass = (id, operation, predicate = Boolean) => {
    try {
      const result = operation();
      controls.push({ id, status: predicate(result) ? 'PASS' : 'FAIL', expected: 'PASS', result });
    } catch (error) {
      controls.push({ id, status: 'FAIL', expected: 'PASS', actual: error.code ?? error.name });
    }
  };
  const failClosed = (id, expected, operation) => {
    try {
      operation();
      controls.push({ id, status: 'FAIL', expected, actual: 'NO_ERROR' });
    } catch (error) {
      controls.push({ id, status: error.code === expected ? 'PASS' : 'FAIL', expected, actual: error.code ?? error.name });
    }
  };

  pass('ACTUAL_INDEPENDENT_CAPACITY_RENDERER_CORRESPONDENCE', () => actual,
    value => value.status === 'PASS' && value.terminalClassification === 'CAPACITY_AUTHORITY_GAP_RENDERER_NODE_BUDGET_REJECTION_CORRESPONDS');
  pass('CAPACITY_PASS_AND_RENDERER_PASS_CONTROL', () => classifyControlledCorrespondence({ capacityResult: { status: 'PASS' }, rendererResult: { status: 'PASS' } }),
    value => value === 'CAPACITY_PASS_RENDERER_PASS');
  pass('CAPACITY_NONPASS_AND_RENDERER_CAPACITY_FAILURE_CONTROL', () => classifyControlledCorrespondence({ capacityResult: { status: 'BLOCKED' }, rendererResult: { status: 'FAIL', failureClass: 'CAPACITY' } }),
    value => value === 'CAPACITY_NONPASS_RENDERER_CAPACITY_FAILURE_CORRESPONDS');
  pass('CAPACITY_PASS_RENDERER_NONCAPACITY_FAILURE_CONTROL', () => classifyControlledCorrespondence({ capacityResult: { status: 'PASS' }, rendererResult: { status: 'FAIL', failureClass: 'NONCAPACITY' } }),
    value => value === 'CAPACITY_PASS_RENDERER_NONCAPACITY_FAILURE');

  const rendererObservation = await import('./h-earth-renderer-corridor-observation.mjs');
  pass('CAPACITY_NONPASS_PREMOUNT_IDENTITY_PRESERVED_CONTROL', () => {
    const identity = rendererObservation.resolveHEarthRendererCorridorObjectIdentity({
      constructReceipt: { sourceObjectIds: ['OBJ_002_FOREGROUND_WET_SAND', 'OBJ_005_SHORELINE_FOAM_LINE', 'OBJ_007_WATER_SURFACE_PLANE'] },
      rendererConstructionSucceeded: false,
      rendererMountSucceeded: false
    });
    const classification = classifyControlledCorrespondence({
      capacityResult: { status: 'BLOCKED' },
      rendererResult: { status: 'FAIL', failureClass: 'CAPACITY' },
      premountIdentityPreserved: identity.preservationState === 'PREMOUNT_IDENTITY_PRESERVED_WITHOUT_MOUNT'
    });
    return { identity, classification };
  }, value => value.classification === 'CAPACITY_NONPASS_RENDERER_CAPACITY_FAILURE_PREMOUNT_IDENTITY_PRESERVED');

  failClosed('CIRCULAR_RECEIPT_DEPENDENCY_FAIL_CLOSED', 'H6_CIRCULAR_RECEIPT_DEPENDENCY_PROHIBITED', () =>
    classifyControlledCorrespondence({ capacityResult: { status: 'PASS' }, rendererResult: { status: 'PASS' }, circularDependency: true }));
  pass('RENDERER_TOOL_SOURCE_CUSTODY_EXACT', () => verifyRendererToolSourceCustody(rendererSourceCustody));
  pass('DETERMINISTIC_REPEAT_CORRESPONDENCE', () => {
    const repeated = evaluateActualH6Correspondence({ h5Receipt: h5, rendererAggregateReceipt: rendererAggregate, rendererSourceCustody });
    return { first: actual.deterministicReceiptSha256, second: repeated.deterministicReceiptSha256, identical: actual.deterministicReceiptSha256 === repeated.deterministicReceiptSha256 };
  }, value => value.identical === true);

  const failed = controls.filter(control => control.status !== 'PASS');
  const body = {
    contractId: 'H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H6_CONTROL_RECEIPT_v1',
    toolId: H6_CONTRACT.toolId,
    checkpoint: 'H6',
    status: failed.length === 0 ? 'PASS' : 'FAIL',
    controlCount: controls.length,
    passedControlCount: controls.length - failed.length,
    failedControlCount: failed.length,
    actualCorrespondence: actual,
    controls,
    claims: {
      rendererToolConsumption: failed.length === 0,
      independentCapacityResultPreserved: true,
      independentRendererResultPreserved: true,
      correspondenceClassificationPass: controls[0]?.status === 'PASS',
      circularProof: false,
      rendererExecutionPerformed: true,
      browserExecutionPerformed: true,
      deployedRouteExecutionPerformed: false,
      productionFilesChanged: 0,
      productionCorrectionStarted: false,
      h7Started: false,
      mergePerformed: false
    }
  };
  return deepFreeze({ ...body, deterministicReceiptSha256: digest(body) });
}

const direct = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (direct) {
  const receipt = await executeH6Controls();
  console.log(JSON.stringify(receipt, null, 2));
  if (receipt.status !== 'PASS') process.exitCode = 1;
}

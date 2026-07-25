import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { executeH2Observation } from './h-earth-capacity-camera-renderer-correspondence-h2-observer.mjs';
import { executeH3Controls } from './h-earth-capacity-camera-renderer-correspondence-h3-controls.mjs';
import {
  H4_CONTRACT,
  deepFreeze,
  digest,
  evaluateStageSeparatedCapacity,
  fail,
  validateH4Contract
} from './h-earth-capacity-camera-renderer-correspondence-h4-evaluator.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const defaultRepositoryRoot = resolve(here, '..');

const clone = value => JSON.parse(JSON.stringify(value));

const productionBudgets = facts => ({
  admittedPrimitives: facts.budgets.environmentPrimitives,
  projectedFragments: null,
  semanticContainers: facts.budgets.semanticLayerContainers,
  interactionNodes: facts.budgets.interactionNodes,
  finalRendererOwnedDom: facts.budgets.totalRendererOwnedNodes
});

const fixtureBudgets = Object.freeze({
  admittedPrimitives: Object.freeze({
    minimum: 1,
    preferredMaximum: 256,
    absoluteMaximum: 384
  }),
  projectedFragments: Object.freeze({
    minimum: 1,
    preferredMaximum: 384,
    absoluteMaximum: 512
  }),
  semanticContainers: Object.freeze({
    minimum: 15,
    preferred: 15,
    maximum: 16
  }),
  interactionNodes: Object.freeze({
    minimum: 1,
    preferredMaximum: 8,
    absoluteMaximum: 16
  }),
  finalRendererOwnedDom: Object.freeze({
    preferredMaximum: 304,
    absoluteMaximum: 448
  })
});

const lawfulFixture = overrides => ({
  cameraEligible: true,
  frustumEligible: true,
  admittedPrimitiveCount: 3,
  projectedPlanFragmentCount: 120,
  semanticContainerCount: 15,
  interactionNodeCount: 1,
  infrastructureNodeCount: 2,
  mountedProjectedFragmentNodeCount: 120,
  rendererMountSucceeded: true,
  budgets: clone(fixtureBudgets),
  diagnostics: {
    fixture: 'LAWFUL_FULL_STAGE_CAPACITY'
  },
  ...overrides
});

async function actualInput(repositoryRoot) {
  const h2 = await executeH2Observation({ repositoryRoot });
  const h3 = await executeH3Controls({ repositoryRoot });
  if (h2.status !== undefined && h2.status !== 'PASS') {
    fail('H4_H2_OBSERVATION_NOT_PASS');
  }
  if (h3.status !== 'PASS') {
    fail('H4_H3_SWEEP_NOT_PASS');
  }

  const previewModule = await import(
    pathToFileURL(
      resolve(repositoryRoot, 'showroom/globe/h-earth/render/shoreline-preview.js')
    ).href
  );
  const preview = previewModule.previewHEarthMinimumShorelineGeometry({
    requestId: 'H4_STAGE_SEPARATED_CAPACITY_OBSERVATION'
  });
  if (preview?.ok !== true || !Array.isArray(preview.primitives)) {
    fail('H4_MINIMUM_SHORELINE_PREVIEW_UNAVAILABLE', {
      status: preview?.status ?? null
    });
  }

  const profileResults = h3.sweep?.profileResults ?? [];
  const cameraAndFrustumMeasurementEligible =
    profileResults.length === 3 &&
    profileResults.every(
      result =>
        result.counts?.totalSamples === 4225 &&
        result.counts?.nonprojectableSamples === 0
    );

  return {
    h2,
    h3,
    preview,
    input: {
      cameraEligible: cameraAndFrustumMeasurementEligible,
      frustumEligible: cameraAndFrustumMeasurementEligible,
      admittedPrimitiveCount: preview.primitives.length,
      projectedPlanFragmentCount: null,
      semanticContainerCount:
        h2.productionFacts.budgets.semanticLayerContainers.preferred,
      interactionNodeCount:
        h2.productionFacts.budgets.interactionNodes.minimum,
      infrastructureNodeCount: null,
      mountedProjectedFragmentNodeCount: null,
      rendererMountSucceeded: null,
      budgets: productionBudgets(h2.productionFacts),
      diagnostics: {
        h3SweepReceiptSha256: h3.sweep.deterministicReceiptSha256,
        sourceObjectIds: preview.sourceObjectIds,
        clippingThresholdAccepted: false
      }
    }
  };
}

export async function executeH4Controls({
  repositoryRoot = defaultRepositoryRoot
} = {}) {
  validateH4Contract();

  const actual = await actualInput(repositoryRoot);
  const actualEvaluation = evaluateStageSeparatedCapacity(actual.input);
  const controls = [];

  const pass = (id, operation, predicate = value => Boolean(value)) => {
    try {
      const result = operation();
      const passed = predicate(result);
      controls.push({
        id,
        status: passed ? 'PASS' : 'FAIL',
        expected: 'PASS',
        result
      });
    } catch (error) {
      controls.push({
        id,
        status: 'FAIL',
        expected: 'PASS',
        actual: error.code ?? error.name
      });
    }
  };

  pass(
    'ACTUAL_PRODUCTION_STAGE_SEPARATION',
    () => actualEvaluation,
    value =>
      value.terminalClassification === 'PROJECTED_FRAGMENT_BUDGET_UNRESOLVED' &&
      value.earliestNonPassStage === 'STAGE_3_PROJECTED_FRAGMENTS' &&
      value.stages[0]?.status === 'PASS' &&
      value.stages[1]?.status === 'PASS' &&
      value.quantities.admittedPrimitiveCount === 3
  );

  pass(
    'LAWFUL_ALL_STAGE_CAPACITY',
    () => evaluateStageSeparatedCapacity(lawfulFixture()),
    value =>
      value.terminalClassification === 'CAPACITY_ELIGIBLE' &&
      value.earliestNonPassStage === null &&
      value.quantities.finalRendererOwnedDomNodeCount === 138 &&
      value.projectedMountRelation === 'MOUNTED_COUNT_MATCHES_PROJECTED_PLAN'
  );

  pass(
    'CAMERA_FAILURE_IDENTIFIES_STAGE_1',
    () => evaluateStageSeparatedCapacity(lawfulFixture({ cameraEligible: false })),
    value =>
      value.terminalClassification === 'CAMERA_INELIGIBLE' &&
      value.earliestNonPassStage === 'STAGE_1_CAMERA_AND_FRUSTUM'
  );

  pass(
    'ADMITTED_PRIMITIVE_FAILURE_IDENTIFIES_STAGE_2',
    () =>
      evaluateStageSeparatedCapacity(
        lawfulFixture({ admittedPrimitiveCount: 500 })
      ),
    value =>
      value.terminalClassification === 'ADMITTED_PRIMITIVE_BUDGET_NOT_MET' &&
      value.earliestNonPassStage === 'STAGE_2_ADMITTED_PRIMITIVES'
  );

  pass(
    'PROJECTED_FRAGMENT_FAILURE_IDENTIFIES_STAGE_3',
    () =>
      evaluateStageSeparatedCapacity(
        lawfulFixture({
          projectedPlanFragmentCount: 600,
          mountedProjectedFragmentNodeCount: 600
        })
      ),
    value =>
      value.terminalClassification === 'PROJECTED_FRAGMENT_BUDGET_NOT_MET' &&
      value.earliestNonPassStage === 'STAGE_3_PROJECTED_FRAGMENTS'
  );

  pass(
    'SEMANTIC_CONTAINER_FAILURE_IDENTIFIES_STAGE_4',
    () =>
      evaluateStageSeparatedCapacity(
        lawfulFixture({ semanticContainerCount: 17 })
      ),
    value =>
      value.terminalClassification === 'SEMANTIC_CONTAINER_BUDGET_NOT_MET' &&
      value.earliestNonPassStage === 'STAGE_4_SEMANTIC_CONTAINERS'
  );

  pass(
    'INTERACTION_NODE_FAILURE_IDENTIFIES_STAGE_5',
    () =>
      evaluateStageSeparatedCapacity(
        lawfulFixture({ interactionNodeCount: 17 })
      ),
    value =>
      value.terminalClassification === 'INTERACTION_NODE_BUDGET_NOT_MET' &&
      value.earliestNonPassStage === 'STAGE_5_INTERACTION_NODES'
  );

  pass(
    'FINAL_DOM_FAILURE_IDENTIFIES_STAGE_6',
    () => {
      const input = lawfulFixture({
        projectedPlanFragmentCount: 440,
        mountedProjectedFragmentNodeCount: 440
      });
      input.budgets.projectedFragments.absoluteMaximum = 500;
      input.budgets.projectedFragments.preferredMaximum = 450;
      return evaluateStageSeparatedCapacity(input);
    },
    value =>
      value.terminalClassification === 'FINAL_DOM_NODE_BUDGET_EXCEEDED' &&
      value.earliestNonPassStage === 'STAGE_6_FINAL_RENDERER_OWNED_DOM' &&
      value.quantities.finalRendererOwnedDomNodeCount === 458
  );

  pass(
    'PREMOUNT_PLAN_AND_MOUNT_COUNTS_REMAIN_DISTINCT',
    () =>
      evaluateStageSeparatedCapacity(
        lawfulFixture({
          mountedProjectedFragmentNodeCount: 0,
          rendererMountSucceeded: false
        })
      ),
    value =>
      value.terminalClassification === 'CAPACITY_EVALUATION_PREMOUNT_COMPLETE' &&
      value.projectedMountRelation ===
        'PREMOUNT_PROJECTED_PLAN_WITH_ZERO_MOUNTED_NODES' &&
      value.quantities.projectedPlanFragmentCount === 120 &&
      value.quantities.mountedProjectedFragmentNodeCount === 0
  );

  pass(
    'MOUNTED_COUNT_WITHOUT_PLAN_FAILS_CLOSED',
    () =>
      evaluateStageSeparatedCapacity(
        lawfulFixture({
          projectedPlanFragmentCount: null,
          mountedProjectedFragmentNodeCount: 1
        })
      ),
    value =>
      value.terminalClassification ===
        'MOUNTED_COUNT_WITHOUT_PROJECTED_PLAN_EVIDENCE' &&
      value.earliestNonPassStage === 'STAGE_3_PROJECTED_FRAGMENTS'
  );

  pass(
    'MULTIPLE_FAILURES_RETURN_EARLIEST_GOVERNED_STAGE',
    () =>
      evaluateStageSeparatedCapacity(
        lawfulFixture({
          admittedPrimitiveCount: 500,
          projectedPlanFragmentCount: 600,
          semanticContainerCount: 17,
          interactionNodeCount: 17,
          mountedProjectedFragmentNodeCount: 600
        })
      ),
    value =>
      value.terminalClassification === 'ADMITTED_PRIMITIVE_BUDGET_NOT_MET' &&
      value.earliestNonPassStage === 'STAGE_2_ADMITTED_PRIMITIVES'
  );

  pass(
    'DETERMINISTIC_REPEAT_STAGE_EVALUATION',
    () => {
      const repeated = evaluateStageSeparatedCapacity(actual.input);
      return {
        first: actualEvaluation.deterministicReceiptSha256,
        second: repeated.deterministicReceiptSha256,
        identical:
          actualEvaluation.deterministicReceiptSha256 ===
          repeated.deterministicReceiptSha256
      };
    },
    value => value.identical === true
  );

  const failed = controls.filter(control => control.status !== 'PASS');
  const body = {
    contractId:
      'H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H4_CONTROL_RECEIPT_v1',
    toolId: H4_CONTRACT.toolId,
    checkpoint: 'H4',
    status: failed.length === 0 ? 'PASS' : 'FAIL',
    controlCount: controls.length,
    passedControlCount: controls.length - failed.length,
    failedControlCount: failed.length,
    sourceCommit: H4_CONTRACT.sourceCommit,
    sourceObjectIds: actual.preview.sourceObjectIds,
    actualEvaluation,
    controls,
    claims: {
      stageSeparationExecuted: failed.length === 0,
      earliestRejectingStageIdentified: controls
        .slice(2, 8)
        .every(control => control.status === 'PASS'),
      planAndMountCountsDistinct: controls[8]?.status === 'PASS',
      physicalDomAccountingVerified:
        controls[1]?.status === 'PASS' && controls[7]?.status === 'PASS',
      productionProjectedFragmentBudgetIndependentlyDeclared: false,
      productionProjectedFragmentCountObserved: false,
      rendererExecutionPerformed: false,
      browserExecutionPerformed: false,
      productionFilesChanged: 0,
      productionCorrectionStarted: false,
      h5Started: false,
      mergePerformed: false
    }
  };

  return deepFreeze({
    ...body,
    deterministicReceiptSha256: digest(body)
  });
}

const direct =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (direct) {
  const receipt = await executeH4Controls();
  console.log(JSON.stringify(receipt, null, 2));
  if (receipt.status !== 'PASS') process.exitCode = 1;
}

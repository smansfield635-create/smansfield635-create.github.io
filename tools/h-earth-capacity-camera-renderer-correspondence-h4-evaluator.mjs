import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export const H4_CONTRACT = freeze(JSON.parse(await readFile(
  resolve(here, 'h-earth-capacity-camera-renderer-correspondence-h4-contract.json'),
  'utf8'
)));

export function freeze(value) {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const child of Object.values(value)) freeze(child);
  return value;
}

export const deepFreeze = freeze;

const canonical = value => Array.isArray(value)
  ? value.map(canonical)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]))
    : value;

export const digest = value =>
  createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');

export function fail(code, details = null) {
  const error = new Error(code);
  error.code = code;
  error.details = details;
  throw error;
}

export function validateH4Contract(candidate = H4_CONTRACT) {
  const expectedStages = [
    'STAGE_1_CAMERA_AND_FRUSTUM',
    'STAGE_2_ADMITTED_PRIMITIVES',
    'STAGE_3_PROJECTED_FRAGMENTS',
    'STAGE_4_SEMANTIC_CONTAINERS',
    'STAGE_5_INTERACTION_NODES',
    'STAGE_6_FINAL_RENDERER_OWNED_DOM'
  ];
  if (candidate.contractId !== H4_CONTRACT.contractId) fail('H4_CONTRACT_ID_MISMATCH');
  if (candidate.toolId !== 'H_EARTH_CAPACITY_CAMERA_AND_RENDERER_CORRESPONDENCE_VERIFIER_v1') fail('H4_TOOL_ID_MISMATCH');
  if (candidate.parentCheckpointCommit !== '5afef7fb528689ceede06d1e185d2f71e837f9b2') fail('H4_PARENT_CHECKPOINT_COMMIT_MISMATCH');
  if (candidate.sourceCommit !== 'ba0f3ecf3087f91d2cb3ff6aa4dd3c040107712e') fail('H4_SOURCE_COMMIT_MISMATCH');
  if (candidate.sourcePosture !== 'READ_ONLY_STAGE_CAPACITY_EVALUATION' || candidate.productionMutationAuthority !== 'NONE') fail('H4_AUTHORITY_BOUNDARY_INVALID');
  if (!Array.isArray(candidate.stageOrder) || candidate.stageOrder.length !== expectedStages.length || candidate.stageOrder.some((value, index) => value !== expectedStages[index])) fail('H4_STAGE_ORDER_INVALID');
  const claims = candidate.claims;
  if (claims.rendererExecutionAuthorized !== false || claims.browserExecutionAuthorized !== false || claims.productionMutationAuthorized !== false || claims.productionFilesChanged !== 0 || claims.productionCorrectionStarted !== false || claims.h5Started !== false || claims.mergePerformed !== false) fail('H4_STOP_BOUNDARY_VIOLATION');
  return true;
}

const count = (value, field) => {
  if (value === null) return null;
  if (!Number.isSafeInteger(value) || value < 0) fail('H4_CAPACITY_COUNT_INVALID', { field, value });
  return value;
};

const rangeBudget = (value, field) => {
  if (value === null) return null;
  const { minimum, preferredMaximum, absoluteMaximum } = value;
  if (![minimum, preferredMaximum, absoluteMaximum].every(Number.isSafeInteger) || minimum < 0 || preferredMaximum < minimum || absoluteMaximum < preferredMaximum) fail('H4_RANGE_BUDGET_INVALID', { field, value });
  return value;
};

const semanticBudget = value => {
  if (value === null) return null;
  const { minimum, preferred, maximum } = value;
  if (![minimum, preferred, maximum].every(Number.isSafeInteger) || minimum < 0 || preferred < minimum || maximum < preferred) fail('H4_SEMANTIC_BUDGET_INVALID', { value });
  return value;
};

const finalBudget = value => {
  if (value === null) return null;
  const { preferredMaximum, absoluteMaximum } = value;
  if (![preferredMaximum, absoluteMaximum].every(Number.isSafeInteger) || preferredMaximum < 0 || absoluteMaximum < preferredMaximum) fail('H4_FINAL_DOM_BUDGET_INVALID', { value });
  return value;
};

const resultStage = (stageId, status, classification, details = null) =>
  freeze({ stageId, status, classification, details });

const relationFor = input => {
  const plan = input.projectedPlanFragmentCount;
  const mounted = input.mountedProjectedFragmentNodeCount;
  if (input.rendererMountSucceeded === null) return 'MOUNT_STATE_UNRESOLVED';
  if (plan === null && mounted !== null) return 'MOUNTED_COUNT_WITHOUT_PROJECTED_PLAN_EVIDENCE';
  if (plan === null) return 'PROJECTED_PLAN_COUNT_UNRESOLVED';
  if (input.rendererMountSucceeded === false) return mounted === 0
    ? 'PREMOUNT_PROJECTED_PLAN_WITH_ZERO_MOUNTED_NODES'
    : 'PREMOUNT_STATE_HAS_UNEXPECTED_MOUNTED_NODES';
  if (mounted === null) return 'MOUNTED_COUNT_UNRESOLVED';
  return mounted === plan ? 'MOUNTED_COUNT_MATCHES_PROJECTED_PLAN' : 'MOUNTED_COUNT_DIVERGES_FROM_PROJECTED_PLAN';
};

const finish = (input, stages, terminalClassification, earliestNonPassStage, relation, finalCount = null) => {
  const body = {
    contractId: 'H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H4_STAGE_EVALUATION_RECEIPT_v1',
    toolId: H4_CONTRACT.toolId,
    checkpoint: 'H4',
    status: 'PASS',
    terminalClassification,
    earliestNonPassStage,
    stages,
    quantities: {
      admittedPrimitiveCount: input.admittedPrimitiveCount,
      projectedPlanFragmentCount: input.projectedPlanFragmentCount,
      mountedProjectedFragmentNodeCount: input.mountedProjectedFragmentNodeCount,
      finalRendererOwnedDomNodeCount: finalCount
    },
    projectedMountRelation: relation,
    claims: {
      stageSeparatedCapacityEvaluationPerformed: true,
      rendererExecutionPerformed: false,
      browserExecutionPerformed: false,
      productionFilesChanged: 0,
      productionCorrectionStarted: false,
      h5Started: false,
      mergePerformed: false
    }
  };
  return freeze({ ...body, deterministicReceiptSha256: digest(body) });
};

const blockTail = (stages, start, reason) => {
  for (let index = start; index < H4_CONTRACT.stageOrder.length; index += 1) {
    stages.push(resultStage(H4_CONTRACT.stageOrder[index], 'NOT_EVALUATED', reason, { blockedByEarlierStage: true }));
  }
};

const stop = (input, stages, stageIndex, status, classification, relation, details = null) => {
  stages.push(resultStage(H4_CONTRACT.stageOrder[stageIndex], status, classification, details));
  blockTail(stages, stageIndex + 1, `BLOCKED_BY_${classification}`);
  return finish(input, stages, classification, H4_CONTRACT.stageOrder[stageIndex], relation);
};

export function evaluateStageSeparatedCapacity(candidate) {
  validateH4Contract();
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) fail('H4_CAPACITY_INPUT_OBJECT_REQUIRED');
  if (typeof candidate.cameraEligible !== 'boolean') fail('H4_CAMERA_ELIGIBILITY_REQUIRED');
  if (typeof candidate.frustumEligible !== 'boolean') fail('H4_FRUSTUM_ELIGIBILITY_REQUIRED');
  if (candidate.rendererMountSucceeded !== null && typeof candidate.rendererMountSucceeded !== 'boolean') fail('H4_RENDERER_MOUNT_STATE_INVALID');

  const input = {
    ...candidate,
    admittedPrimitiveCount: count(candidate.admittedPrimitiveCount, 'admittedPrimitiveCount'),
    projectedPlanFragmentCount: count(candidate.projectedPlanFragmentCount, 'projectedPlanFragmentCount'),
    semanticContainerCount: count(candidate.semanticContainerCount, 'semanticContainerCount'),
    interactionNodeCount: count(candidate.interactionNodeCount, 'interactionNodeCount'),
    infrastructureNodeCount: count(candidate.infrastructureNodeCount, 'infrastructureNodeCount'),
    mountedProjectedFragmentNodeCount: count(candidate.mountedProjectedFragmentNodeCount, 'mountedProjectedFragmentNodeCount'),
    budgets: {
      admittedPrimitives: rangeBudget(candidate.budgets?.admittedPrimitives ?? null, 'admittedPrimitives'),
      projectedFragments: rangeBudget(candidate.budgets?.projectedFragments ?? null, 'projectedFragments'),
      semanticContainers: semanticBudget(candidate.budgets?.semanticContainers ?? null),
      interactionNodes: rangeBudget(candidate.budgets?.interactionNodes ?? null, 'interactionNodes'),
      finalRendererOwnedDom: finalBudget(candidate.budgets?.finalRendererOwnedDom ?? null)
    }
  };

  const stages = [];
  const relation = relationFor(input);
  if (!input.cameraEligible) return stop(input, stages, 0, 'FAIL', 'CAMERA_INELIGIBLE', relation);
  if (!input.frustumEligible) return stop(input, stages, 0, 'FAIL', 'FRUSTUM_INELIGIBLE', relation);
  stages.push(resultStage(H4_CONTRACT.stageOrder[0], 'PASS', 'CAMERA_AND_FRUSTUM_MEASUREMENT_ELIGIBLE', input.diagnostics?.cameraAndFrustum ?? null));

  const stageChecks = [
    {
      index: 1,
      count: input.admittedPrimitiveCount,
      budget: input.budgets.admittedPrimitives,
      unresolvedBudget: 'ADMITTED_PRIMITIVE_BUDGET_UNRESOLVED',
      unresolvedEvidence: 'ADMITTED_PRIMITIVE_EVIDENCE_UNRESOLVED',
      failure: 'ADMITTED_PRIMITIVE_BUDGET_NOT_MET',
      pass: 'ADMITTED_PRIMITIVE_CAPACITY_ELIGIBLE',
      valid: (observed, budget) => observed >= budget.minimum && observed <= budget.absoluteMaximum
    },
    {
      index: 2,
      count: input.projectedPlanFragmentCount,
      budget: input.budgets.projectedFragments,
      unresolvedBudget: 'PROJECTED_FRAGMENT_BUDGET_UNRESOLVED',
      unresolvedEvidence: 'PROJECTED_FRAGMENT_EVIDENCE_UNRESOLVED',
      failure: 'PROJECTED_FRAGMENT_BUDGET_NOT_MET',
      pass: 'PROJECTED_FRAGMENT_CAPACITY_ELIGIBLE',
      valid: (observed, budget) => observed >= budget.minimum && observed <= budget.absoluteMaximum
    },
    {
      index: 3,
      count: input.semanticContainerCount,
      budget: input.budgets.semanticContainers,
      unresolvedBudget: 'SEMANTIC_CONTAINER_BUDGET_UNRESOLVED',
      unresolvedEvidence: 'SEMANTIC_CONTAINER_EVIDENCE_UNRESOLVED',
      failure: 'SEMANTIC_CONTAINER_BUDGET_NOT_MET',
      pass: 'SEMANTIC_CONTAINER_CAPACITY_ELIGIBLE',
      valid: (observed, budget) => observed >= budget.minimum && observed <= budget.maximum
    },
    {
      index: 4,
      count: input.interactionNodeCount,
      budget: input.budgets.interactionNodes,
      unresolvedBudget: 'INTERACTION_NODE_BUDGET_UNRESOLVED',
      unresolvedEvidence: 'INTERACTION_NODE_EVIDENCE_UNRESOLVED',
      failure: 'INTERACTION_NODE_BUDGET_NOT_MET',
      pass: 'INTERACTION_NODE_CAPACITY_ELIGIBLE',
      valid: (observed, budget) => observed >= budget.minimum && observed <= budget.absoluteMaximum
    }
  ];

  for (const check of stageChecks) {
    if (check.index === 2 && relation === 'MOUNTED_COUNT_WITHOUT_PROJECTED_PLAN_EVIDENCE') {
      return stop(input, stages, 2, 'FAIL', relation, relation);
    }
    if (check.budget === null) return stop(input, stages, check.index, 'BLOCKED', check.unresolvedBudget, relation);
    if (check.count === null) return stop(input, stages, check.index, 'BLOCKED', check.unresolvedEvidence, relation);
    if (!check.valid(check.count, check.budget)) return stop(input, stages, check.index, 'FAIL', check.failure, relation, { observed: check.count, budget: check.budget });
    stages.push(resultStage(H4_CONTRACT.stageOrder[check.index], 'PASS', check.pass, { observed: check.count, budget: check.budget }));
  }

  if (['PREMOUNT_STATE_HAS_UNEXPECTED_MOUNTED_NODES', 'MOUNTED_COUNT_DIVERGES_FROM_PROJECTED_PLAN'].includes(relation)) {
    return stop(input, stages, 5, 'FAIL', relation, relation);
  }
  if (input.rendererMountSucceeded === false) {
    stages.push(resultStage(H4_CONTRACT.stageOrder[5], 'BLOCKED', 'CAPACITY_EVALUATION_PREMOUNT_COMPLETE', { projectedMountRelation: relation }));
    return finish(input, stages, 'CAPACITY_EVALUATION_PREMOUNT_COMPLETE', H4_CONTRACT.stageOrder[5], relation);
  }
  if (input.rendererMountSucceeded === null || input.infrastructureNodeCount === null || input.mountedProjectedFragmentNodeCount === null) {
    return stop(input, stages, 5, 'BLOCKED', 'FINAL_DOM_EVIDENCE_UNRESOLVED', relation);
  }
  if (input.budgets.finalRendererOwnedDom === null) {
    return stop(input, stages, 5, 'BLOCKED', 'FINAL_DOM_BUDGET_UNRESOLVED', relation);
  }

  const finalCount = input.infrastructureNodeCount + input.semanticContainerCount + input.interactionNodeCount + input.mountedProjectedFragmentNodeCount;
  const details = {
    infrastructureNodeCount: input.infrastructureNodeCount,
    semanticContainerCount: input.semanticContainerCount,
    interactionNodeCount: input.interactionNodeCount,
    mountedProjectedFragmentNodeCount: input.mountedProjectedFragmentNodeCount,
    finalRendererOwnedDomNodeCount: finalCount,
    budget: input.budgets.finalRendererOwnedDom
  };
  if (finalCount > input.budgets.finalRendererOwnedDom.absoluteMaximum) {
    stages.push(resultStage(H4_CONTRACT.stageOrder[5], 'FAIL', 'FINAL_DOM_NODE_BUDGET_EXCEEDED', details));
    return finish(input, stages, 'FINAL_DOM_NODE_BUDGET_EXCEEDED', H4_CONTRACT.stageOrder[5], relation, finalCount);
  }
  stages.push(resultStage(H4_CONTRACT.stageOrder[5], 'PASS', 'FINAL_RENDERER_OWNED_DOM_CAPACITY_ELIGIBLE', details));
  return finish(input, stages, 'CAPACITY_ELIGIBLE', null, relation, finalCount);
}

/**
 * /tools/h-earth-renderer-corridor-capacity-law.mjs
 *
 * H_EARTH_RENDERER_CORRIDOR_STAGE_SPECIFIC_CAPACITY_LAW_v1
 *
 * This gate-owned test contract separates source admission, renderer projection
 * fragmentation, and physical renderer-owned DOM materialization. It is consumed by the
 * executable renderer-corridor integration gate and the deployed-route probe.
 */

export const H_EARTH_RENDERER_CORRIDOR_CAPACITY_LAW_CONTRACT_ID =
  'H_EARTH_RENDERER_CORRIDOR_STAGE_SPECIFIC_CAPACITY_LAW_v1';

export const EXPECTED_PACKET_002_SOURCE_OBJECT_IDS = Object.freeze([
  'OBJ_002_FOREGROUND_WET_SAND',
  'OBJ_005_SHORELINE_FOAM_LINE',
  'OBJ_007_WATER_SURFACE_PLANE'
]);

export const ADMITTED_PRIMITIVE_BUDGET = Object.freeze({
  budgetId: 'ADMITTED_PRIMITIVE_BUDGET',
  stage: 'POST_WEST_ADMITTED_FRAME',
  countingUnit: 'ADMITTED_SOURCE_PRIMITIVE',
  productionOccurrenceExpected: 3,
  minimum: 1,
  preferredMaximum: 256,
  absoluteMaximum: 384
});

export const PROJECTED_FRAGMENT_BUDGET = Object.freeze({
  budgetId: 'PROJECTED_FRAGMENT_BUDGET',
  stage: 'POST_CLIPPING_RENDERER_PROJECTION_PLAN',
  countingUnit: 'PROJECTED_OR_CLIPPED_RENDER_FRAGMENT',
  minimum: 0,
  preferredMaximum: 288,
  absoluteMaximum: 432,
  lawfulEmptyScenePermittedByRenderer: true
});

export const FINAL_DOM_NODE_BUDGET = Object.freeze({
  budgetId: 'FINAL_DOM_NODE_BUDGET',
  stage: 'POST_MATERIALIZATION_RENDERER_MOUNT',
  countingUnit: 'PHYSICAL_RENDERER_OWNED_DOM_NODE',
  rendererInfrastructureNodeCount: 2,
  semanticLayerContainerCount: 15,
  interactionNodeCount: 1,
  preferredMaximum: 306,
  absoluteMaximum: 450,
  routeShellExcluded: true,
  detachedNodesExcluded: true,
  hiddenMountedNodesIncluded: true
});

export const H_EARTH_RENDERER_CORRIDOR_BUDGETS = Object.freeze({
  admittedPrimitiveBudget: ADMITTED_PRIMITIVE_BUDGET,
  projectedFragmentBudget: PROJECTED_FRAGMENT_BUDGET,
  finalDomNodeBudget: FINAL_DOM_NODE_BUDGET
});

function isNonNegativeSafeInteger(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function createCheck(id, passed, actual, budget = null) {
  return Object.freeze({
    id,
    passed: passed === true,
    actual,
    budget
  });
}

function createIssue(code, message, details = null) {
  return Object.freeze({ code, message, details });
}

export function evaluateHEarthRendererCorridorBudgets({
  admittedPrimitiveCount,
  projectedFragmentCount,
  semanticContainerCount,
  interactionNodeCount,
  finalRendererOwnedDomNodeCount,
  requireExactProductionPacket002 = true
} = {}) {
  const counts = Object.freeze({
    admittedPrimitiveCount,
    projectedFragmentCount,
    semanticContainerCount,
    interactionNodeCount,
    finalRendererOwnedDomNodeCount
  });

  const checks = [];
  const issues = [];

  for (const [field, value] of Object.entries(counts)) {
    const passed = isNonNegativeSafeInteger(value);
    checks.push(createCheck(`${field.toUpperCase()}_NON_NEGATIVE_SAFE_INTEGER`, passed, value));
    if (!passed) {
      issues.push(createIssue(
        'RENDERER_CORRIDOR_COUNT_INVALID',
        `${field} must be a non-negative safe integer.`,
        Object.freeze({ field, value })
      ));
    }
  }

  if (issues.length > 0) {
    return Object.freeze({
      eligible: false,
      status: 'RENDERER_CORRIDOR_CAPACITY_NOT_ELIGIBLE',
      contractId: H_EARTH_RENDERER_CORRIDOR_CAPACITY_LAW_CONTRACT_ID,
      counts,
      checks: Object.freeze(checks),
      issues: Object.freeze(issues),
      budgets: H_EARTH_RENDERER_CORRIDOR_BUDGETS
    });
  }

  const admittedWithinBudget =
    admittedPrimitiveCount >= ADMITTED_PRIMITIVE_BUDGET.minimum &&
    admittedPrimitiveCount <= ADMITTED_PRIMITIVE_BUDGET.absoluteMaximum;

  const exactProductionPacket002 =
    admittedPrimitiveCount === ADMITTED_PRIMITIVE_BUDGET.productionOccurrenceExpected;

  const projectedWithinBudget =
    projectedFragmentCount >= PROJECTED_FRAGMENT_BUDGET.minimum &&
    projectedFragmentCount <= PROJECTED_FRAGMENT_BUDGET.absoluteMaximum;

  const semanticContainerCountMatches =
    semanticContainerCount === FINAL_DOM_NODE_BUDGET.semanticLayerContainerCount;

  const interactionNodeCountMatches =
    interactionNodeCount === FINAL_DOM_NODE_BUDGET.interactionNodeCount;

  const expectedPhysicalDomMinimum =
    FINAL_DOM_NODE_BUDGET.rendererInfrastructureNodeCount +
    semanticContainerCount +
    interactionNodeCount +
    projectedFragmentCount;

  const physicalDomAccountingExact =
    finalRendererOwnedDomNodeCount === expectedPhysicalDomMinimum;

  const finalDomWithinBudget =
    finalRendererOwnedDomNodeCount <= FINAL_DOM_NODE_BUDGET.absoluteMaximum;

  checks.push(
    createCheck(
      'ADMITTED_PRIMITIVE_BUDGET_ELIGIBLE',
      admittedWithinBudget,
      admittedPrimitiveCount,
      ADMITTED_PRIMITIVE_BUDGET
    ),
    createCheck(
      'EXACT_THREE_PRIMITIVE_PACKET_002_OCCURRENCE',
      requireExactProductionPacket002 ? exactProductionPacket002 : true,
      admittedPrimitiveCount,
      ADMITTED_PRIMITIVE_BUDGET.productionOccurrenceExpected
    ),
    createCheck(
      'PROJECTED_FRAGMENT_BUDGET_ELIGIBLE',
      projectedWithinBudget,
      projectedFragmentCount,
      PROJECTED_FRAGMENT_BUDGET
    ),
    createCheck(
      'SEMANTIC_CONTAINER_COUNT_MATCHES_RENDERER_CONTRACT',
      semanticContainerCountMatches,
      semanticContainerCount,
      FINAL_DOM_NODE_BUDGET.semanticLayerContainerCount
    ),
    createCheck(
      'INTERACTION_NODE_COUNT_MATCHES_RENDERER_CONTRACT',
      interactionNodeCountMatches,
      interactionNodeCount,
      FINAL_DOM_NODE_BUDGET.interactionNodeCount
    ),
    createCheck(
      'FINAL_DOM_NODE_ACCOUNTING_EXACT',
      physicalDomAccountingExact,
      finalRendererOwnedDomNodeCount,
      expectedPhysicalDomMinimum
    ),
    createCheck(
      'FINAL_DOM_NODE_BUDGET_ELIGIBLE',
      finalDomWithinBudget,
      finalRendererOwnedDomNodeCount,
      FINAL_DOM_NODE_BUDGET
    )
  );

  if (!admittedWithinBudget) {
    issues.push(createIssue(
      'ADMITTED_PRIMITIVE_BUDGET_EXCEEDED',
      'The admitted source-primitive count is outside its stage-specific budget.',
      admittedPrimitiveCount
    ));
  }

  if (requireExactProductionPacket002 && !exactProductionPacket002) {
    issues.push(createIssue(
      'PRODUCTION_PACKET_002_PRIMITIVE_COUNT_MISMATCH',
      'The production minimum-shoreline Packet 002 occurrence must contain exactly three admitted primitives.',
      admittedPrimitiveCount
    ));
  }

  if (!projectedWithinBudget) {
    issues.push(createIssue(
      'PROJECTED_FRAGMENT_BUDGET_EXCEEDED',
      'The renderer projection/clipping fragment count is outside its independent budget.',
      projectedFragmentCount
    ));
  }

  if (!semanticContainerCountMatches || !interactionNodeCountMatches) {
    issues.push(createIssue(
      'RENDERER_STRUCTURAL_NODE_COUNT_MISMATCH',
      'Renderer semantic-container or interaction-node counts do not match the renderer contract.',
      Object.freeze({ semanticContainerCount, interactionNodeCount })
    ));
  }

  if (!physicalDomAccountingExact) {
    issues.push(createIssue(
      'FINAL_DOM_NODE_ACCOUNTING_MISMATCH',
      'Physical renderer-owned DOM nodes do not equal infrastructure + semantic containers + interaction nodes + projected fragments.',
      Object.freeze({
        expected: expectedPhysicalDomMinimum,
        actual: finalRendererOwnedDomNodeCount
      })
    ));
  }

  if (!finalDomWithinBudget) {
    issues.push(createIssue(
      'FINAL_DOM_NODE_BUDGET_EXCEEDED',
      'The final mounted renderer-owned DOM node count exceeds its independent budget.',
      finalRendererOwnedDomNodeCount
    ));
  }

  const eligible = checks.every((check) => check.passed === true);

  return Object.freeze({
    eligible,
    status: eligible
      ? 'RENDERER_CORRIDOR_CAPACITY_ELIGIBLE'
      : 'RENDERER_CORRIDOR_CAPACITY_NOT_ELIGIBLE',
    contractId: H_EARTH_RENDERER_CORRIDOR_CAPACITY_LAW_CONTRACT_ID,
    counts,
    accounting: Object.freeze({
      rendererInfrastructureNodeCount:
        FINAL_DOM_NODE_BUDGET.rendererInfrastructureNodeCount,
      expectedPhysicalDomNodeCount: expectedPhysicalDomMinimum,
      projectionExpansionCount:
        projectedFragmentCount - admittedPrimitiveCount
    }),
    checks: Object.freeze(checks),
    issues: Object.freeze(issues),
    budgets: H_EARTH_RENDERER_CORRIDOR_BUDGETS
  });
}

export const H_EARTH_RENDERER_CORRIDOR_CAPACITY_LAW = Object.freeze({
  contractId: H_EARTH_RENDERER_CORRIDOR_CAPACITY_LAW_CONTRACT_ID,
  rule:
    'ADMITTED_PRIMITIVE_BUDGET != PROJECTED_FRAGMENT_BUDGET != FINAL_DOM_NODE_BUDGET',
  expectedPacket002SourceObjectIds: EXPECTED_PACKET_002_SOURCE_OBJECT_IDS,
  budgets: H_EARTH_RENDERER_CORRIDOR_BUDGETS,
  evaluate: evaluateHEarthRendererCorridorBudgets
});

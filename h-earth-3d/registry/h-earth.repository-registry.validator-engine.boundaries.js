/** Target 4B-10 · Mutation and stopping-boundary evaluation. */
import { deepFreeze, stableStrings } from './h-earth.repository-registry.validator-engine.identity.js';

export function evaluateHEarthRepositoryRegistryMutationAndStoppingBoundaries(input, compositeExpansion, dependencies) {
  const failureCodes = [];
  const prohibitedMutations = stableStrings(compositeExpansion.nodes.flatMap((node) => node.prohibitedMutations ?? []));
  const requiredValidations = stableStrings(compositeExpansion.nodes.flatMap((node) => node.requiredValidations ?? []));
  const stoppingBoundaries = stableStrings(compositeExpansion.nodes.flatMap((node) => node.stoppingBoundaries ?? []));
  const withheldNodeIds = compositeExpansion.nodes
    .filter((node) => node.allowedMutationScope === 'WITHHELD')
    .map((node) => node.nodeId)
    .sort();
  const action = input.requestedAction.toUpperCase();

  const expectedInstruction = dependencies.contracts.instruction.instructionId;
  const expectedInstructionPath = '/h-earth-3d/registry/h-earth.repository-registry.tool-instruction.json';
  const instructionResolved = input.instructionSources.includes(expectedInstruction) ||
    input.instructionSources.includes(expectedInstructionPath);
  if (!instructionResolved) failureCodes.push('INSTRUCTION_IDENTITY_MISMATCH');

  if (input.requestedMutation) {
    failureCodes.push('MUTATION_AUTHORITY_NOT_ESTABLISHED');
    if (withheldNodeIds.length > 0 || prohibitedMutations.length > 0) {
      failureCodes.push('MUTATION_SCOPE_EXCEEDS_AUTHORITY');
    }
    if (stoppingBoundaries.some((boundary) => boundary.includes('REPOSITORY_MUTATION'))) {
      failureCodes.push('STOPPING_BOUNDARY_BYPASSED');
    }
  }

  if (action.includes('BYPASS_STOPPING_BOUNDARY')) failureCodes.push('STOPPING_BOUNDARY_BYPASSED');
  if (action.includes('ARRAY_POSITION') || action.includes('DIRECTORY_POSITION')) {
    failureCodes.push('ORDER_INFERRED_FROM_ARRAY_POSITION');
  }
  if (action.includes('CONTRADICT_REGISTRY') || action.includes('CONTRADICTS_REGISTRY')) {
    failureCodes.push('INSTRUCTION_CONTRADICTS_REGISTRY');
  }

  const requestedLifecyclePromotion = input.assertedLifecycleTransitions.some((transition) =>
    ['ACCEPTED', 'CANONICAL'].includes(transition.toStatus)
  );
  if (requestedLifecyclePromotion && stoppingBoundaries.some((boundary) => boundary.includes('MERGE_OR_PRODUCTION'))) {
    failureCodes.push('STOPPING_BOUNDARY_BYPASSED');
  }

  return deepFreeze({
    evaluationId: 'H_EARTH_REPOSITORY_REGISTRY_MUTATION_STOPPING_BOUNDARY_EVALUATION_v1',
    requestedMutation: input.requestedMutation,
    requestedAction: input.requestedAction,
    mutationAuthorityEstablished: false,
    mergeAuthorityEstablished: false,
    permittedMutations: Object.freeze([]),
    prohibitedMutations,
    requiredValidations,
    stoppingBoundaries,
    withheldNodeIds: Object.freeze(withheldNodeIds),
    instructionResolved,
    operationMayMutate: false,
    failureCodes: stableStrings(failureCodes),
    stoppingCondition: {
      mutationAndStoppingBoundaryEvaluationComplete: true,
      advanceBeyondTarget4B10: false,
      nextAuthorizedSubtarget: '4B-11'
    }
  });
}

export default evaluateHEarthRepositoryRegistryMutationAndStoppingBoundaries;

/** Target 4B-5 · Affected-node and relation closure. */
import { deepFreeze, stableStrings } from './h-earth.repository-registry.validator-engine.identity.js';

export function resolveHEarthRepositoryRegistryAffectedScope(input, occurrenceResolution, dependencies) {
  const facade = dependencies.registryFacade;
  const nodeIds = new Set();
  const relationIds = new Set();
  const failureCodes = [];

  for (const result of occurrenceResolution.pathResults) {
    for (const nodeId of result.nodeIds) nodeIds.add(nodeId);
  }

  for (const nodeId of input.declaredAffectedNodeIds) {
    if (facade.getHEarthRepositoryRegistryNode(nodeId)) nodeIds.add(nodeId);
    else failureCodes.push('OPERATION_SCOPE_UNRESOLVED');
  }

  for (const relationId of input.declaredAffectedRelationIds) {
    const relation = facade.getHEarthRepositoryRegistryRelation(relationId);
    if (!relation) {
      failureCodes.push('OPERATION_SCOPE_UNRESOLVED');
      continue;
    }
    relationIds.add(relationId);
    nodeIds.add(relation.fromNodeId);
    nodeIds.add(relation.toNodeId);
  }

  for (const compositeId of input.declaredCompositeUnitIds) {
    const node = facade.getHEarthRepositoryRegistryNode(compositeId);
    if (node?.nodeType === 'COMPOSITE_UNIT') nodeIds.add(compositeId);
    else failureCodes.push('OPERATION_SCOPE_UNRESOLVED');
  }

  const queue = [...nodeIds].sort();
  const processed = new Set();
  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (processed.has(nodeId)) continue;
    processed.add(nodeId);

    for (const relation of facade.getHEarthRepositoryRegistryRelationsForNode(nodeId, 'BOTH')) {
      relationIds.add(relation.relationId);
      for (const endpoint of [relation.fromNodeId, relation.toNodeId]) {
        if (!nodeIds.has(endpoint)) {
          nodeIds.add(endpoint);
          queue.push(endpoint);
        }
      }
    }

    const dependency = facade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
    if (!dependency.unresolved) {
      for (const node of dependency.nodes) {
        if (!nodeIds.has(node.nodeId)) {
          nodeIds.add(node.nodeId);
          queue.push(node.nodeId);
        }
      }
      for (const relation of dependency.relations) relationIds.add(relation.relationId);
    }
  }

  const nodes = [...nodeIds]
    .map((nodeId) => facade.getHEarthRepositoryRegistryNode(nodeId))
    .filter(Boolean)
    .sort((a, b) => a.nodeId.localeCompare(b.nodeId));
  const relations = [...relationIds]
    .map((relationId) => facade.getHEarthRepositoryRegistryRelation(relationId))
    .filter(Boolean)
    .sort((a, b) => a.relationId.localeCompare(b.relationId));

  if (nodes.length === 0) failureCodes.push('OPERATION_SCOPE_UNRESOLVED');

  return deepFreeze({
    scopeResolutionId: 'H_EARTH_REPOSITORY_REGISTRY_AFFECTED_SCOPE_CLOSURE_v1',
    seedNodeIds: stableStrings([
      ...occurrenceResolution.pathResults.flatMap((result) => result.nodeIds),
      ...input.declaredAffectedNodeIds,
      ...input.declaredCompositeUnitIds
    ]),
    affectedNodeIds: Object.freeze(nodes.map((node) => node.nodeId)),
    affectedRelationIds: Object.freeze(relations.map((relation) => relation.relationId)),
    nodes: Object.freeze(nodes),
    relations: Object.freeze(relations),
    compositeUnits: Object.freeze(nodes.filter((node) => node.nodeType === 'COMPOSITE_UNIT')),
    failureCodes: stableStrings(failureCodes),
    stoppingCondition: {
      affectedNodeAndRelationClosureComplete: true,
      advanceBeyondTarget4B5: false,
      nextAuthorizedSubtarget: '4B-6'
    }
  });
}

export default resolveHEarthRepositoryRegistryAffectedScope;

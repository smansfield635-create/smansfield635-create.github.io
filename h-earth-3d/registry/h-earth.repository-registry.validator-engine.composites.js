/** Target 4B-6 · Composite-membership expansion. */
import { deepFreeze, stableStrings } from './h-earth.repository-registry.validator-engine.identity.js';

export function expandHEarthRepositoryRegistryCompositeMembership(scopeResolution, dependencies) {
  const facade = dependencies.registryFacade;
  const nodeIds = new Set(scopeResolution.affectedNodeIds);
  const relationIds = new Set(scopeResolution.affectedRelationIds);
  const failureCodes = [];
  const queue = [...scopeResolution.affectedNodeIds].sort();
  const processed = new Set();

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (processed.has(nodeId)) continue;
    processed.add(nodeId);
    const membership = facade.getHEarthRepositoryRegistryCompositeMembership(nodeId);
    for (const unit of membership.containingUnits) {
      if (!nodeIds.has(unit.nodeId)) {
        nodeIds.add(unit.nodeId);
        queue.push(unit.nodeId);
      }
    }
    for (const member of membership.members) {
      if (!nodeIds.has(member.nodeId)) {
        nodeIds.add(member.nodeId);
        queue.push(member.nodeId);
      }
    }
    for (const relation of [...membership.containingRelations, ...membership.memberRelations]) {
      relationIds.add(relation.relationId);
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
  const compositeUnits = nodes.filter((node) => node.nodeType === 'COMPOSITE_UNIT');

  const compositeProjection = compositeUnits.map((unit) => {
    const membership = facade.getHEarthRepositoryRegistryCompositeMembership(unit.nodeId);
    const members = membership.members.map((node) => node.nodeId).sort();
    const missingMemberIds = membership.memberRelations
      .map((relation) => relation.toNodeId)
      .filter((memberId) => !nodeIds.has(memberId))
      .sort();
    if (missingMemberIds.length > 0) failureCodes.push('REQUIRED_COMPOSITE_MEMBER_MISSING');
    return deepFreeze({
      compositeUnitId: unit.nodeId,
      nodeSubtype: unit.nodeSubtype,
      cardinalCompleteness: unit.cardinalCompleteness,
      memberNodeIds: Object.freeze(members),
      membershipRelationIds: Object.freeze(membership.memberRelations.map((relation) => relation.relationId).sort()),
      containingUnitIds: Object.freeze(membership.containingUnits.map((node) => node.nodeId).sort()),
      missingMemberIds: Object.freeze(missingMemberIds)
    });
  }).sort((a, b) => a.compositeUnitId.localeCompare(b.compositeUnitId));

  return deepFreeze({
    expansionId: 'H_EARTH_REPOSITORY_REGISTRY_COMPOSITE_MEMBERSHIP_EXPANSION_v1',
    affectedNodeIds: Object.freeze(nodes.map((node) => node.nodeId)),
    affectedRelationIds: Object.freeze(relations.map((relation) => relation.relationId)),
    nodes: Object.freeze(nodes),
    relations: Object.freeze(relations),
    compositeUnits: Object.freeze(compositeUnits),
    compositeProjection: Object.freeze(compositeProjection),
    failureCodes: stableStrings(failureCodes),
    stoppingCondition: {
      compositeMembershipExpansionComplete: true,
      advanceBeyondTarget4B6: false,
      nextAuthorizedSubtarget: '4B-7'
    }
  });
}

export default expandHEarthRepositoryRegistryCompositeMembership;

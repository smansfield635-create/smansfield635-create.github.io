/** Target 4B-7 · Cardinal-structure projection and non-collapse. */
import { deepFreeze, stableStrings } from './h-earth.repository-registry.validator-engine.identity.js';

const KERNEL_ROLES = Object.freeze(['NORTH', 'EAST', 'SOUTH', 'WEST']);

export function projectHEarthRepositoryRegistryCardinalStructure(input, compositeExpansion, dependencies) {
  const facade = dependencies.registryFacade;
  const failureCodes = [];
  const nodeById = new Map(compositeExpansion.nodes.map((node) => [node.nodeId, node]));

  const cardinalParticipation = compositeExpansion.nodes
    .filter((node) => node.cardinalRole !== 'NONE' || node.cardinalCompleteness !== 'NOT_APPLICABLE')
    .map((node) => deepFreeze({
      nodeId: node.nodeId,
      nodeType: node.nodeType,
      nodeSubtype: node.nodeSubtype,
      cardinalRole: node.cardinalRole,
      cardinalStatus: node.cardinalStatus,
      cardinalCompleteness: node.cardinalCompleteness,
      authorityClass: node.authorityClass,
      lifecycleStatus: node.lifecycleStatus,
      candidateOnly: node.cardinalStatus === 'OBSERVED_CANDIDATE'
    }))
    .sort((a, b) => a.nodeId.localeCompare(b.nodeId));

  const assertionsByNode = new Map();
  for (const assertion of input.assertedCardinalRoles) {
    const prior = assertionsByNode.get(assertion.nodeId) ?? [];
    prior.push(assertion);
    assertionsByNode.set(assertion.nodeId, prior);
    const node = facade.getHEarthRepositoryRegistryNode(assertion.nodeId);
    if (!node || !nodeById.has(assertion.nodeId)) {
      failureCodes.push('OPERATION_SCOPE_UNRESOLVED');
      continue;
    }
    if (node.cardinalRole !== assertion.cardinalRole) failureCodes.push('CARDINAL_ROLE_COLLAPSE');
    if (node.cardinalStatus !== assertion.cardinalStatus) {
      failureCodes.push(
        node.cardinalStatus === 'OBSERVED_CANDIDATE'
          ? 'CANDIDATE_CARDINAL_ROLE_PROMOTED'
          : 'CARDINAL_ROLE_COLLAPSE'
      );
    }
  }
  for (const assertions of assertionsByNode.values()) {
    if (assertions.length > 1) failureCodes.push('CARDINAL_ROLE_COLLAPSE');
  }

  const kernelUnits = compositeExpansion.compositeProjection.filter((unit) => unit.nodeSubtype === 'CARDINAL_UNIT');
  const kernelChecks = kernelUnits.map((unit) => {
    const members = unit.memberNodeIds.map((nodeId) => nodeById.get(nodeId)).filter(Boolean);
    const roleCounts = Object.fromEntries(KERNEL_ROLES.map((role) => [role, members.filter((node) => node.cardinalRole === role).length]));
    const missingRoles = KERNEL_ROLES.filter((role) => roleCounts[role] === 0);
    const duplicateRoles = KERNEL_ROLES.filter((role) => roleCounts[role] > 1);
    if (missingRoles.length > 0) failureCodes.push('REQUIRED_COMPOSITE_MEMBER_MISSING');
    if (duplicateRoles.length > 0) failureCodes.push('CARDINAL_ROLE_COLLAPSE');
    return deepFreeze({
      compositeUnitId: unit.compositeUnitId,
      requiredRoles: KERNEL_ROLES,
      roleCounts: deepFreeze(roleCounts),
      missingRoles: Object.freeze(missingRoles),
      duplicateRoles: Object.freeze(duplicateRoles),
      publicFacadeOwnsMemberAuthority: false,
      compositeOwnsMemberAuthority: false
    });
  });

  const gateBCandidateChecks = compositeExpansion.compositeProjection
    .filter((unit) => unit.nodeSubtype === 'FUNCTIONAL_CONTINUITY_UNIT')
    .map((unit) => {
      const members = unit.memberNodeIds.map((nodeId) => nodeById.get(nodeId)).filter(Boolean);
      const promotedMembers = members
        .filter((node) => node.cardinalRole !== 'NONE' && node.cardinalStatus !== 'OBSERVED_CANDIDATE')
        .map((node) => node.nodeId)
        .sort();
      if (promotedMembers.length > 0) failureCodes.push('CANDIDATE_CARDINAL_ROLE_PROMOTED');
      return deepFreeze({
        compositeUnitId: unit.compositeUnitId,
        candidateRoleMemberIds: Object.freeze(members.filter((node) => node.cardinalRole !== 'NONE').map((node) => node.nodeId).sort()),
        promotedMemberIds: Object.freeze(promotedMembers),
        canonicalizationEstablished: false
      });
    });

  return deepFreeze({
    projectionId: 'H_EARTH_REPOSITORY_REGISTRY_CARDINAL_STRUCTURE_PROJECTION_v1',
    cardinalParticipation: Object.freeze(cardinalParticipation),
    kernelChecks: Object.freeze(kernelChecks),
    gateBCandidateChecks: Object.freeze(gateBCandidateChecks),
    failureCodes: stableStrings(failureCodes),
    stoppingCondition: {
      cardinalStructureProjectionComplete: true,
      advanceBeyondTarget4B7: false,
      nextAuthorizedSubtarget: '4B-8'
    }
  });
}

export default projectHEarthRepositoryRegistryCardinalStructure;

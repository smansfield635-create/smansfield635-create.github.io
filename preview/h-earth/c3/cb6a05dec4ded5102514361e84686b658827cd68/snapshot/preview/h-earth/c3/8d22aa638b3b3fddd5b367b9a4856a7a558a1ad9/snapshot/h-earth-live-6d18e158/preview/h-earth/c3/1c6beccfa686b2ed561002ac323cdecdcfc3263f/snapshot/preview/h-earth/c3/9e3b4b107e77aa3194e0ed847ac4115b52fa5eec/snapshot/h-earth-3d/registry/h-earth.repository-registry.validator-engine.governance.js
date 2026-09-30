/** Target 4B-8 · Authority, evidence, and lifecycle projection. */
import { deepFreeze, stableStrings } from './h-earth.repository-registry.validator-engine.identity.js';

const promotedLifecycle = new Set(['ACCEPTED', 'CANONICAL']);

export function projectHEarthRepositoryRegistryGovernance(input, compositeExpansion, dependencies) {
  const facade = dependencies.registryFacade;
  const failureCodes = [];
  const nodeById = new Map(compositeExpansion.nodes.map((node) => [node.nodeId, node]));
  const evidenceIds = new Set(input.evidenceReferences);

  for (const node of compositeExpansion.nodes) {
    for (const evidenceId of node.evidenceReferences ?? []) evidenceIds.add(evidenceId);
  }
  for (const relation of compositeExpansion.relations) {
    for (const evidenceId of relation.evidenceReferences ?? []) evidenceIds.add(evidenceId);
  }

  const authorityProjection = compositeExpansion.nodes.map((node) => deepFreeze({
    nodeId: node.nodeId,
    nodeType: node.nodeType,
    nodeSubtype: node.nodeSubtype,
    authorityClass: node.authorityClass,
    authorityPosture: node.authorityPosture,
    authoritySource: Object.freeze([...(node.authoritySource ?? [])]),
    authorityScope: Object.freeze([...(node.authorityScope ?? [])]),
    authorityLimitations: Object.freeze([...(node.authorityLimitations ?? [])]),
    allowedMutationScope: node.allowedMutationScope
  })).sort((a, b) => a.nodeId.localeCompare(b.nodeId));

  for (const assertion of input.assertedAuthority) {
    const node = nodeById.get(assertion.nodeId);
    if (!node) {
      failureCodes.push('OPERATION_SCOPE_UNRESOLVED');
      continue;
    }
    const claim = `${assertion.authorityClass} ${assertion.authorityClaim}`.toUpperCase();
    if (node.authorityClass === 'ORCHESTRATION_ONLY' && claim.includes('ADMISSION')) {
      failureCodes.push('ORCHESTRATION_PROMOTED_TO_ADMISSION_AUTHORITY');
    } else if (node.nodeSubtype?.includes('FACADE') && assertion.authorityClass !== node.authorityClass) {
      failureCodes.push('FACADE_PROMOTED_TO_MEMBER_AUTHORITY');
    } else if (assertion.authorityClass !== node.authorityClass) {
      failureCodes.push('AUTHORITY_COLLAPSE_OR_TRANSFER');
    }
  }

  const evidenceProjection = [...evidenceIds].sort().map((evidenceId) => {
    const evidence = facade.getHEarthRepositoryRegistryEvidence(evidenceId);
    if (!evidence) {
      failureCodes.push('REQUIRED_EVIDENCE_UNRESOLVED');
      return deepFreeze({ evidenceId, resolved: false });
    }
    if (input.evidenceReferences.includes(evidenceId) && (evidence.evidenceLimitations ?? []).length > 0) {
      failureCodes.push('OPTIONAL_EVIDENCE_LIMITATION');
    }
    return deepFreeze({
      evidenceId,
      resolved: true,
      evidenceClass: evidence.evidenceClass,
      sourceKind: evidence.sourceKind,
      sourceIdOrPath: evidence.sourceIdOrPath,
      sourceOccurrenceOrRevision: evidence.sourceOccurrenceOrRevision,
      assertionScope: Object.freeze([...(evidence.assertionScope ?? [])]),
      evidenceLimitations: Object.freeze([...(evidence.evidenceLimitations ?? [])])
    });
  });

  const lifecycleProjection = compositeExpansion.nodes.map((node) => deepFreeze({
    nodeId: node.nodeId,
    lifecycleStatus: node.lifecycleStatus,
    cardinalRole: node.cardinalRole,
    cardinalStatus: node.cardinalStatus,
    cardinalCompleteness: node.cardinalCompleteness,
    unresolvedFields: Object.freeze([...(node.unresolvedFields ?? [])]),
    repositoryOccurrences: Object.freeze([...(node.repositoryOccurrences ?? [])])
  })).sort((a, b) => a.nodeId.localeCompare(b.nodeId));

  for (const transition of input.assertedLifecycleTransitions) {
    const node = nodeById.get(transition.nodeId);
    if (!node) {
      failureCodes.push('OPERATION_SCOPE_UNRESOLVED');
      continue;
    }
    if (transition.fromStatus !== node.lifecycleStatus) failureCodes.push('LIFECYCLE_TRANSITION_UNRESOLVED');
    if (node.lifecycleStatus === 'CANDIDATE' && promotedLifecycle.has(transition.toStatus)) {
      failureCodes.push('CANDIDATE_PROMOTED_TO_CANONICAL');
    } else if (transition.toStatus !== node.lifecycleStatus) {
      failureCodes.push('LIFECYCLE_TRANSITION_UNRESOLVED');
    }
  }

  const unresolvedFields = compositeExpansion.nodes.flatMap((node) =>
    (node.unresolvedFields ?? []).map((field) => deepFreeze({
      nodeId: node.nodeId,
      field,
      criticality: dependencies.contracts.criticality.fieldCriticality[field] ?? 'CONTEXT_DEPENDENT'
    }))
  ).sort((a, b) => `${a.nodeId}:${a.field}`.localeCompare(`${b.nodeId}:${b.field}`));

  return deepFreeze({
    projectionId: 'H_EARTH_REPOSITORY_REGISTRY_GOVERNANCE_PROJECTION_v1',
    authorityProjection: Object.freeze(authorityProjection),
    evidenceProjection: Object.freeze(evidenceProjection),
    lifecycleProjection: Object.freeze(lifecycleProjection),
    unresolvedFields: Object.freeze(unresolvedFields),
    failureCodes: stableStrings(failureCodes),
    stoppingCondition: {
      authorityEvidenceLifecycleProjectionComplete: true,
      advanceBeyondTarget4B8: false,
      nextAuthorizedSubtarget: '4B-9'
    }
  });
}

export default projectHEarthRepositoryRegistryGovernance;

/** Target 4B-4 · Path and exact-occurrence resolution. */
import { deepFreeze, stableStrings } from './h-earth.repository-registry.validator-engine.identity.js';

const byPath = (a, b) => a.path.localeCompare(b.path);

export function resolveHEarthRepositoryRegistryOperationOccurrences(input, dependencies) {
  const facade = dependencies.registryFacade;
  const failureCodes = [];
  const pathResults = [];
  const assertedOccurrenceResults = [];

  for (const repositoryPath of [...input.requestedPaths].sort()) {
    const resolved = facade.resolveHEarthRepositoryRegistryPath(repositoryPath);
    if (!resolved.resolved) failureCodes.push('REQUESTED_PATH_UNRESOLVED');
    pathResults.push(deepFreeze({
      path: repositoryPath,
      resolved: resolved.resolved,
      nodeIds: Object.freeze(resolved.nodes.map((node) => node.nodeId).sort()),
      occurrences: Object.freeze(resolved.occurrences.map((occurrence) => deepFreeze({
        path: occurrence.path,
        commitSha: occurrence.commitSha,
        gitBlobSha: occurrence.gitBlobSha,
        refName: occurrence.refName,
        existenceStatus: occurrence.existenceStatus,
        fetchbackStatus: occurrence.fetchbackStatus,
        occurrenceClass: occurrence.occurrenceClass
      })).sort((a, b) => `${a.path}:${a.commitSha}:${a.gitBlobSha}`.localeCompare(`${b.path}:${b.commitSha}:${b.gitBlobSha}`)))
    }));
  }

  for (const assertion of [...input.assertedOccurrences].sort(byPath)) {
    const exact = facade.resolveHEarthRepositoryRegistryOccurrence(assertion);
    const pathResolution = facade.resolveHEarthRepositoryRegistryPath(assertion.path);
    if (!exact.resolved) {
      failureCodes.push(pathResolution.resolved ? 'OCCURRENCE_IDENTITY_DRIFT' : 'EXACT_OCCURRENCE_UNRESOLVED');
    }
    assertedOccurrenceResults.push(deepFreeze({
      asserted: deepFreeze({ ...assertion }),
      resolved: exact.resolved,
      matchedNodeIds: Object.freeze(exact.matches.map((match) => match.nodeId).sort()),
      pathExistsInRegistry: pathResolution.resolved
    }));
  }

  const exactRequired = input.requestedMutation === true ||
    input.requestedDispositionContext.requireExactOccurrenceForReadOnly === true;
  if (exactRequired) {
    for (const repositoryPath of input.requestedPaths) {
      if (!input.assertedOccurrences.some((occurrence) => occurrence.path === repositoryPath)) {
        failureCodes.push('EXACT_OCCURRENCE_UNRESOLVED');
      }
    }
  }

  if (input.requestedPaths.length === 0 && input.declaredAffectedNodeIds.length === 0) {
    failureCodes.push('OPERATION_SCOPE_UNRESOLVED');
  }

  return deepFreeze({
    resolutionId: 'H_EARTH_REPOSITORY_REGISTRY_OPERATION_OCCURRENCE_RESOLUTION_v1',
    pathResults: Object.freeze(pathResults.sort((a, b) => a.path.localeCompare(b.path))),
    assertedOccurrenceResults: Object.freeze(assertedOccurrenceResults),
    resolvedPaths: Object.freeze(pathResults.filter((result) => result.resolved)),
    resolvedOccurrences: Object.freeze(pathResults.flatMap((result) => result.occurrences)),
    failureCodes: stableStrings(failureCodes),
    stoppingCondition: {
      pathAndOccurrenceResolutionComplete: true,
      advanceBeyondTarget4B4: false,
      nextAuthorizedSubtarget: '4B-5'
    }
  });
}

export default resolveHEarthRepositoryRegistryOperationOccurrences;

/** Target 4C-3 · Canonical complete-operation builder. */
import {
  deriveHEarthRepositoryRegistryOperationScopePreview
} from '../h-earth.repository-registry.validator-engine.js';
import {
  loadHEarthRepositoryRegistryValidatorDependencies
} from '../h-earth.repository-registry.validator-engine.loader.js';
import { deepFreeze } from '../h-earth.repository-registry.validator-engine.identity.js';

export const TARGET_4C_CONTROLLING_INSTRUCTION_ID =
  'H_EARTH_REPOSITORY_REGISTRY_GITHUB_TOOL_INSTRUCTION_v1';

const dependencies = loadHEarthRepositoryRegistryValidatorDependencies();
const nodes = dependencies.registryInstance.nodes;
const evidenceRecords = dependencies.registryInstance.evidenceRecords;

function exactNode(predicate, label) {
  const matches = nodes.filter(predicate).sort((a, b) => a.nodeId.localeCompare(b.nodeId));
  if (matches.length === 0) throw new Error(`TARGET_4C_REQUIRED_NODE_NOT_FOUND:${label}`);
  return matches[0];
}

function exactEvidence(predicate, label) {
  const matches = evidenceRecords.filter(predicate).sort((a, b) => a.evidenceId.localeCompare(b.evidenceId));
  if (matches.length === 0) throw new Error(`TARGET_4C_REQUIRED_EVIDENCE_NOT_FOUND:${label}`);
  return matches[0];
}

export function getTarget4CFixtureContext() {
  const kernelNorth = exactNode(
    (node) => node.cardinalRole === 'NORTH' && node.cardinalStatus === 'EXPLICIT' && node.repositoryPaths.length > 0,
    'KERNEL_NORTH'
  );
  const gateB = exactNode(
    (node) => node.nodeId.includes('GATE_B') && node.repositoryPaths.length > 0,
    'GATE_B_PATH_BEARING_NODE'
  );
  const explicitCardinalNodes = nodes
    .filter((node) => node.cardinalStatus === 'EXPLICIT' && ['NORTH', 'EAST', 'SOUTH', 'WEST'].includes(node.cardinalRole))
    .sort((a, b) => a.cardinalRole.localeCompare(b.cardinalRole));
  const candidateCardinal = exactNode(
    (node) => node.cardinalStatus === 'OBSERVED_CANDIDATE' && node.cardinalRole !== 'NONE',
    'CANDIDATE_CARDINAL_NODE'
  );
  const adapter = exactNode(
    (node) => node.authorityClass === 'ORCHESTRATION_ONLY',
    'ORCHESTRATION_ONLY_ADAPTER'
  );
  const facade = exactNode(
    (node) => String(node.nodeSubtype).includes('FACADE'),
    'FACADE_NODE'
  );
  const genericAuthorityNode = exactNode(
    (node) => node.authorityClass !== 'ORCHESTRATION_ONLY' && !String(node.nodeSubtype).includes('FACADE'),
    'GENERIC_AUTHORITY_NODE'
  );
  const candidateLifecycleNode = exactNode(
    (node) => node.lifecycleStatus === 'CANDIDATE',
    'CANDIDATE_LIFECYCLE_NODE'
  );
  const lifecycleNode = [...nodes].sort((a, b) => a.nodeId.localeCompare(b.nodeId))[0];
  const limitedEvidence = exactEvidence(
    (record) => Array.isArray(record.evidenceLimitations) && record.evidenceLimitations.length > 0,
    'LIMITED_EVIDENCE'
  );

  return deepFreeze({
    dependenciesVerified: dependencies.identityVerified,
    kernelSeedPath: kernelNorth.repositoryPaths[0],
    gateBSeedPath: gateB.repositoryPaths[0],
    explicitCardinalNodes,
    candidateCardinal,
    adapter,
    facade,
    genericAuthorityNode,
    candidateLifecycleNode,
    lifecycleNode,
    limitedEvidence
  });
}

export function buildTarget4CCompleteOperation({
  operationId,
  seedPath,
  requestedAction = 'INSPECT_H_EARTH_ARCHITECTURE',
  operationClass = 'READ_ONLY_INSPECTION',
  requestedMutation = false,
  overrides = {}
}) {
  const seed = {
    operationId,
    operationClass,
    requestedAction,
    requestedMutation,
    requestedPaths: [seedPath],
    declaredAffectedNodeIds: [],
    declaredAffectedRelationIds: [],
    declaredCompositeUnitIds: [],
    assertedOccurrences: [],
    assertedAuthority: [],
    assertedLifecycleTransitions: [],
    assertedCardinalRoles: [],
    instructionSources: [TARGET_4C_CONTROLLING_INSTRUCTION_ID],
    evidenceReferences: [],
    requestedDispositionContext: {
      allowReviewRequired: true,
      requireExactOccurrenceForReadOnly: false,
      separateAuthorityAvailable: false
    }
  };

  const preview = deriveHEarthRepositoryRegistryOperationScopePreview(seed);
  if (!preview.valid || !preview.dependenciesVerified) {
    throw new Error(`TARGET_4C_BASELINE_PREVIEW_FAILED:${operationId}`);
  }

  const complete = {
    ...seed,
    declaredAffectedNodeIds: [...preview.affectedNodeIds],
    declaredAffectedRelationIds: [...preview.affectedRelationIds],
    declaredCompositeUnitIds: [...preview.affectedCompositeUnitIds],
    ...overrides,
    requestedDispositionContext: {
      ...seed.requestedDispositionContext,
      ...(overrides.requestedDispositionContext ?? {})
    }
  };

  return deepFreeze({
    operationInput: complete,
    preview,
    exactOccurrence: preview.occurrence.resolvedOccurrences.find((occurrence) => occurrence.path === seedPath) ?? null
  });
}

export const TARGET_4C_COMPLETE_OPERATION_BUILDER_BOUNDARY = deepFreeze({
  hardcodedAffectedNodeArrays: false,
  hardcodedAffectedRelationArrays: false,
  hardcodedCompositeArrays: false,
  usesInstalledValidatorPreview: true,
  engineSemanticsChanged: false,
  mutationAuthorityCreated: false,
  stoppingCondition: {
    canonicalCompleteOperationBuilderPass: true,
    advanceBeyondTarget4C3: false,
    nextAuthorizedSubtarget: '4C-4'
  }
});

export default buildTarget4CCompleteOperation;

/**
 * Target 4B-12 · Complete H-Earth package-aware validator engine candidate.
 * Read-only pre-mutation evaluation only. No mutation or enforcement authority.
 */
import {
  deepFreeze,
  stableStrings,
  H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_IDENTITY,
  H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_BOUNDARY
} from './h-earth.repository-registry.validator-engine.identity.js';
import { loadHEarthRepositoryRegistryValidatorDependencies } from './h-earth.repository-registry.validator-engine.loader.js';
import { validateHEarthRepositoryRegistryProposedOperation } from './h-earth.repository-registry.validator-engine.input.js';
import { resolveHEarthRepositoryRegistryOperationOccurrences } from './h-earth.repository-registry.validator-engine.occurrences.js';
import { resolveHEarthRepositoryRegistryAffectedScope } from './h-earth.repository-registry.validator-engine.scope.js';
import { expandHEarthRepositoryRegistryCompositeMembership } from './h-earth.repository-registry.validator-engine.composites.js';
import { projectHEarthRepositoryRegistryCardinalStructure } from './h-earth.repository-registry.validator-engine.cardinals.js';
import { projectHEarthRepositoryRegistryGovernance } from './h-earth.repository-registry.validator-engine.governance.js';
import { compareHEarthRepositoryRegistryDeclaredAndDerivedScope } from './h-earth.repository-registry.validator-engine.compare.js';
import { evaluateHEarthRepositoryRegistryMutationAndStoppingBoundaries } from './h-earth.repository-registry.validator-engine.boundaries.js';
import { classifyHEarthRepositoryRegistryValidationFailures } from './h-earth.repository-registry.validator-engine.decision.js';

const STEPS = Object.freeze([
  'VALIDATE_INPUT_SHAPE',
  'VERIFY_REGISTRY_IDENTITY',
  'RESOLVE_PATHS_AND_OCCURRENCES',
  'RESOLVE_AFFECTED_NODES',
  'EXPAND_RELATIONS_AND_COMPOSITES',
  'PROJECT_CARDINAL_STRUCTURE',
  'PROJECT_AUTHORITY_AND_EVIDENCE',
  'PROJECT_LIFECYCLE',
  'COMPARE_DECLARED_AND_DERIVED_SCOPE',
  'EVALUATE_MUTATION_LIMITS',
  'EVALUATE_STOPPING_BOUNDARIES',
  'CLASSIFY_FAILURES',
  'CALCULATE_FINAL_DISPOSITION',
  'EMIT_DETERMINISTIC_RECEIPT'
]);

const traceEntry = (sequence, result) => deepFreeze({ sequence, step: STEPS[sequence - 1], result });
const validOperationId = (value) => typeof value === 'string' && /^[A-Z0-9][A-Z0-9._:-]*$/.test(value);

function decisionInput(input) {
  return {
    operationId: validOperationId(input?.operationId) ? input.operationId : 'UNSPECIFIED_OPERATION',
    operationClass: input?.operationClass ?? 'READ_ONLY_INSPECTION',
    requestedAction: typeof input?.requestedAction === 'string' ? input.requestedAction : 'UNSPECIFIED_ACTION',
    requestedMutation: input?.requestedMutation === true,
    assertedLifecycleTransitions: Array.isArray(input?.assertedLifecycleTransitions) ? input.assertedLifecycleTransitions : [],
    requestedDispositionContext: {
      allowReviewRequired: input?.requestedDispositionContext?.allowReviewRequired === true,
      requireExactOccurrenceForReadOnly: input?.requestedDispositionContext?.requireExactOccurrenceForReadOnly === true,
      separateAuthorityAvailable: input?.requestedDispositionContext?.separateAuthorityAvailable === true
    }
  };
}

function identityFailureCodes(dependencies) {
  const checks = dependencies.identityChecks;
  const codes = [];
  if (!checks.registryId || !checks.schemaId || !checks.schemaVersion || !checks.candidateGitBlobSha ||
      !checks.contractId || !checks.contractVersion || !checks.candidateNotAccepted || !checks.candidateNotCanonical) {
    codes.push('REGISTRY_IDENTITY_MISMATCH');
  }
  if (!checks.registryVersion) codes.push('REGISTRY_VERSION_MISMATCH');
  if (!checks.instructionId || !checks.instructionVersion) codes.push('INSTRUCTION_IDENTITY_MISMATCH');
  return codes;
}

function projectNodes(nodes = []) {
  return Object.freeze(nodes.map((node) => deepFreeze({
    nodeId: node.nodeId,
    nodeType: node.nodeType,
    nodeSubtype: node.nodeSubtype,
    repositoryPaths: Object.freeze([...(node.repositoryPaths ?? [])]),
    authorityClass: node.authorityClass,
    cardinalRole: node.cardinalRole,
    cardinalStatus: node.cardinalStatus,
    lifecycleStatus: node.lifecycleStatus
  })).sort((a, b) => a.nodeId.localeCompare(b.nodeId)));
}

function projectRelations(relations = []) {
  return Object.freeze(relations.map((relation) => deepFreeze({
    relationId: relation.relationId,
    relationType: relation.relationType,
    fromNodeId: relation.fromNodeId,
    toNodeId: relation.toNodeId,
    lifecycleStatus: relation.lifecycleStatus,
    roleWithinComposite: relation.roleWithinComposite ?? null
  })).sort((a, b) => a.relationId.localeCompare(b.relationId)));
}

function buildReceipt(input, dependencies, components, decision, derivationTrace) {
  const operation = decisionInput(input);
  return deepFreeze({
    receiptId: `${operation.operationId}_VALIDATION_RECEIPT_v1`,
    contractIdentity: {
      contractId: H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_IDENTITY.contract.contractId,
      contractVersion: H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_IDENTITY.contract.contractVersion
    },
    registryIdentity: {
      registryId: dependencies.registryInstance.registryId,
      registryVersion: dependencies.registryInstance.registryVersion,
      schemaId: dependencies.registryInstance.schemaId,
      schemaVersion: dependencies.registryInstance.schemaVersion,
      candidateGitBlobSha: dependencies.discovery.candidateGitBlobSha
    },
    operationIdentity: {
      operationId: operation.operationId,
      operationClass: operation.operationClass,
      requestedAction: operation.requestedAction,
      requestedMutation: operation.requestedMutation
    },
    resolvedPaths: Object.freeze([...(components.occurrence?.resolvedPaths ?? [])]),
    resolvedOccurrences: Object.freeze([...(components.occurrence?.resolvedOccurrences ?? [])]),
    affectedNodes: projectNodes(components.composite?.nodes ?? []),
    affectedRelations: projectRelations(components.composite?.relations ?? []),
    affectedCompositeUnits: Object.freeze([...(components.composite?.compositeProjection ?? [])]),
    cardinalParticipation: Object.freeze([...(components.cardinal?.cardinalParticipation ?? [])]),
    authorityProjection: Object.freeze([...(components.governance?.authorityProjection ?? [])]),
    evidenceProjection: Object.freeze([...(components.governance?.evidenceProjection ?? [])]),
    lifecycleProjection: Object.freeze([...(components.governance?.lifecycleProjection ?? [])]),
    unresolvedFields: Object.freeze([...(components.governance?.unresolvedFields ?? [])]),
    permittedMutations: Object.freeze([...(components.boundaries?.permittedMutations ?? [])]),
    prohibitedMutations: Object.freeze([...(components.boundaries?.prohibitedMutations ?? [])]),
    requiredValidations: Object.freeze([...(components.boundaries?.requiredValidations ?? [])]),
    stoppingBoundaries: Object.freeze([...(components.boundaries?.stoppingBoundaries ?? [])]),
    failureCodes: stableStrings(decision.failureCodes),
    derivationTrace: Object.freeze(derivationTrace),
    finalDisposition: decision.finalDisposition
  });
}

export function deriveHEarthRepositoryRegistryOperationScopePreview(input) {
  const dependencies = loadHEarthRepositoryRegistryValidatorDependencies();
  const validation = validateHEarthRepositoryRegistryProposedOperation(input, dependencies);
  if (!validation.valid) {
    return deepFreeze({ valid: false, validation, dependenciesVerified: dependencies.identityVerified });
  }
  const occurrence = resolveHEarthRepositoryRegistryOperationOccurrences(validation.normalizedInput, dependencies);
  const scope = resolveHEarthRepositoryRegistryAffectedScope(validation.normalizedInput, occurrence, dependencies);
  const composite = expandHEarthRepositoryRegistryCompositeMembership(scope, dependencies);
  return deepFreeze({
    valid: true,
    dependenciesVerified: dependencies.identityVerified,
    affectedNodeIds: composite.affectedNodeIds,
    affectedRelationIds: composite.affectedRelationIds,
    affectedCompositeUnitIds: Object.freeze(composite.compositeUnits.map((node) => node.nodeId).sort()),
    occurrence,
    scope,
    composite
  });
}

export function validateHEarthRepositoryRegistryOperation(input) {
  const dependencies = loadHEarthRepositoryRegistryValidatorDependencies();
  const trace = [];
  const components = {};
  const accumulatedFailures = [];

  components.validation = validateHEarthRepositoryRegistryProposedOperation(input, dependencies);
  trace.push(traceEntry(1, components.validation.valid ? 'PASS' : 'FAIL'));
  accumulatedFailures.push(...components.validation.failureCodes);

  if (!components.validation.valid) {
    for (let sequence = 2; sequence <= 11; sequence += 1) {
      trace.push(traceEntry(sequence, 'NOT_EXECUTED_DUE_TO_MALFORMED_INPUT'));
    }
    const decision = classifyHEarthRepositoryRegistryValidationFailures(
      decisionInput(input),
      accumulatedFailures,
      dependencies
    );
    trace.push(traceEntry(12, `FAILURES=${decision.failureCodes.length}`));
    trace.push(traceEntry(13, decision.finalDisposition));
    trace.push(traceEntry(14, 'RECEIPT_EMITTED'));
    const receipt = buildReceipt(input, dependencies, components, decision, trace);
    return deepFreeze({
      engineIdentity: H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_IDENTITY,
      boundary: H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_BOUNDARY,
      receipt,
      decision,
      diagnostics: components
    });
  }

  const normalized = components.validation.normalizedInput;
  const identityFailures = identityFailureCodes(dependencies);
  accumulatedFailures.push(...identityFailures);
  trace.push(traceEntry(2, identityFailures.length === 0 ? 'PASS' : `FAILURES=${identityFailures.length}`));

  components.occurrence = resolveHEarthRepositoryRegistryOperationOccurrences(normalized, dependencies);
  accumulatedFailures.push(...components.occurrence.failureCodes);
  trace.push(traceEntry(3, `PATHS=${components.occurrence.pathResults.length};FAILURES=${components.occurrence.failureCodes.length}`));

  components.scope = resolveHEarthRepositoryRegistryAffectedScope(normalized, components.occurrence, dependencies);
  accumulatedFailures.push(...components.scope.failureCodes);
  trace.push(traceEntry(4, `NODES=${components.scope.affectedNodeIds.length};FAILURES=${components.scope.failureCodes.length}`));

  components.composite = expandHEarthRepositoryRegistryCompositeMembership(components.scope, dependencies);
  accumulatedFailures.push(...components.composite.failureCodes);
  trace.push(traceEntry(5, `RELATIONS=${components.composite.affectedRelationIds.length};COMPOSITES=${components.composite.compositeUnits.length}`));

  components.cardinal = projectHEarthRepositoryRegistryCardinalStructure(normalized, components.composite, dependencies);
  accumulatedFailures.push(...components.cardinal.failureCodes);
  trace.push(traceEntry(6, `CARDINAL_RECORDS=${components.cardinal.cardinalParticipation.length};FAILURES=${components.cardinal.failureCodes.length}`));

  components.governance = projectHEarthRepositoryRegistryGovernance(normalized, components.composite, dependencies);
  accumulatedFailures.push(...components.governance.failureCodes);
  trace.push(traceEntry(7, `AUTHORITY=${components.governance.authorityProjection.length};EVIDENCE=${components.governance.evidenceProjection.length}`));
  trace.push(traceEntry(8, `LIFECYCLE=${components.governance.lifecycleProjection.length};UNRESOLVED=${components.governance.unresolvedFields.length}`));

  components.comparison = compareHEarthRepositoryRegistryDeclaredAndDerivedScope(normalized, components.composite);
  accumulatedFailures.push(...components.comparison.failureCodes);
  trace.push(traceEntry(9, components.comparison.exactMatch ? 'EXACT_MATCH' : `FAILURES=${components.comparison.failureCodes.length}`));

  components.boundaries = evaluateHEarthRepositoryRegistryMutationAndStoppingBoundaries(normalized, components.composite, dependencies);
  accumulatedFailures.push(...components.boundaries.failureCodes);
  trace.push(traceEntry(10, `PROHIBITED=${components.boundaries.prohibitedMutations.length};FAILURES=${components.boundaries.failureCodes.length}`));
  trace.push(traceEntry(11, `STOPPING_BOUNDARIES=${components.boundaries.stoppingBoundaries.length}`));

  const decision = classifyHEarthRepositoryRegistryValidationFailures(normalized, accumulatedFailures, dependencies);
  trace.push(traceEntry(12, `FAILURES=${decision.failureCodes.length}`));
  trace.push(traceEntry(13, decision.finalDisposition));
  trace.push(traceEntry(14, 'RECEIPT_EMITTED'));
  const receipt = buildReceipt(normalized, dependencies, components, decision, trace);

  return deepFreeze({
    engineIdentity: H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_IDENTITY,
    boundary: H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_BOUNDARY,
    receipt,
    decision,
    diagnostics: components,
    stoppingCondition: {
      deterministicReceiptEmissionComplete: true,
      advanceBeyondTarget4B12: false,
      nextAuthorizedSubtarget: '4B-13'
    }
  });
}

export const H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE = deepFreeze({
  identity: H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_IDENTITY,
  boundary: H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_BOUNDARY,
  orderedSteps: STEPS,
  deriveHEarthRepositoryRegistryOperationScopePreview,
  validateHEarthRepositoryRegistryOperation
});

export default H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE;

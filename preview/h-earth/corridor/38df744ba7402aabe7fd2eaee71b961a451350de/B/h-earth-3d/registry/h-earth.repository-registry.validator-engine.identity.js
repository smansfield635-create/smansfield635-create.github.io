/**
 * Target 4B-1 · Package-aware validator engine identity and boundary.
 * Candidate only. This module creates no source, mutation, merge, canonical,
 * runtime, renderer, deployment, production, or workflow-enforcement authority.
 */

export function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Reflect.ownKeys(value)) deepFreeze(value[nested], seen);
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

export function stableStrings(values = []) {
  return Object.freeze([...new Set(values)].sort((a, b) => String(a).localeCompare(String(b))));
}

export const H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_IDENTITY = deepFreeze({
  engineId: 'H_EARTH_REPOSITORY_REGISTRY_PACKAGE_AWARE_VALIDATOR_ENGINE_v1',
  engineVersion: 1,
  targetNumber: 4,
  targetSubtarget: '4B-1',
  status: 'COMPLETE_CANDIDATE_NOT_ACCEPTED',
  accepted: false,
  canonical: false,
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/h-earth-repository-registry-installation-001',
  contract: {
    contractId: 'H_EARTH_REPOSITORY_REGISTRY_PACKAGE_AWARE_VALIDATOR_CONTRACT_v1',
    contractVersion: 1,
    path: '/h-earth-3d/registry/h-earth.repository-registry.validator-contract.json',
    gitBlobSha: 'a6733c868cfee1abce172c0ac901fecf3dd209b2'
  },
  registry: {
    registryId: 'H_EARTH_REPOSITORY_REGISTRY_CANDIDATE_v1',
    registryVersion: '1.0.0-candidate.1',
    schemaId: 'H_EARTH_REPOSITORY_REGISTRY_SCHEMA_v1',
    schemaVersion: 1,
    candidatePath: '/h-earth-3d/registry/h-earth.repository-registry.candidate.js',
    candidateGitBlobSha: '10ab7b203e03fde419e526d0cce2c0af42860911'
  },
  instruction: {
    instructionId: 'H_EARTH_REPOSITORY_REGISTRY_GITHUB_TOOL_INSTRUCTION_v1',
    instructionVersion: 1,
    path: '/h-earth-3d/registry/h-earth.repository-registry.tool-instruction.json',
    gitBlobSha: 'de421803f21808ce27b2ffff349af8756c4d9929'
  }
});

export const H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_BOUNDARY = deepFreeze({
  validatorEngineCandidateCreated: true,
  validatorEngineInstalled: false,
  validatorFixturesInstalled: false,
  portabilityReferencePackageInstalled: false,
  systemicComprehensionAuditExecuted: false,
  workflowEnforcementInstalled: false,
  sourceAuthorityCreated: false,
  mutationAuthorityCreated: false,
  mergeAuthorityCreated: false,
  canonicalizationAuthorityCreated: false,
  runtimeActivationCreated: false,
  rendererActivationCreated: false,
  deploymentAuthorityCreated: false,
  productionClaimCreated: false,
  mainChanged: false,
  explicitOptInReadOnlyEvaluationOnly: true
});

export const H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_4B1 = deepFreeze({
  identity: H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_IDENTITY,
  boundary: H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_BOUNDARY,
  stoppingCondition: {
    engineIdentityAndBoundaryComplete: true,
    advanceBeyondTarget4B1: false,
    nextAuthorizedSubtarget: '4B-2'
  }
});

export default H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_4B1;

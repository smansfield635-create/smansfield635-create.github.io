/** Target 4B-2 · Contract and registry loader. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// Composes accepted Step 1, post-merge, Step 2, camera-capacity,
// audit-continuity, renderer-presentation, public-route-interaction,
// compositor-camera-authority, functional-landscape Run 6, functional
// environment Runs 7C–7H, Run 7I public/live evidence, Run 8A dimensional
// reconciliation, Run 8B successor neutral geometry, Run 8C normal-light-
// material realization, Run 8D grounded vegetation, and Run 8E bounded
// integration-engineering overlays.
import registryFacade from './accepted-amendments/h-earth.repository-registry.run8e-integration-engineering-scope.js';
import {
  deepFreeze,
  H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_IDENTITY
} from './h-earth.repository-registry.validator-engine.identity.js';

const directory = path.dirname(fileURLToPath(import.meta.url));
const readJson = (fileName) => JSON.parse(fs.readFileSync(path.join(directory, fileName), 'utf8'));

const FILES = Object.freeze({
  consolidated: 'h-earth.repository-registry.validator-contract.json',
  input: 'h-earth.repository-registry.validator-contract.input.json',
  receipt: 'h-earth.repository-registry.validator-contract.receipt.json',
  dispositions: 'h-earth.repository-registry.validator-contract.dispositions.json',
  failures: 'h-earth.repository-registry.validator-contract.failures.json',
  criticality: 'h-earth.repository-registry.validator-contract.criticality.json',
  algorithm: 'h-earth.repository-registry.validator-contract.algorithm.json',
  instruction: 'h-earth.repository-registry.tool-instruction.json'
});

export function loadHEarthRepositoryRegistryValidatorDependencies() {
  const contracts = {
    consolidated: readJson(FILES.consolidated),
    input: readJson(FILES.input),
    receipt: readJson(FILES.receipt),
    dispositions: readJson(FILES.dispositions),
    failures: readJson(FILES.failures),
    criticality: readJson(FILES.criticality),
    algorithm: readJson(FILES.algorithm),
    instruction: readJson(FILES.instruction)
  };

  const registryInstance = registryFacade.getHEarthRepositoryRegistryInstance();
  const discovery = registryFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();
  const expected = H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_ENGINE_IDENTITY;
  const identityChecks = {
    contractId: contracts.consolidated.contractId === expected.contract.contractId,
    contractVersion: contracts.consolidated.contractVersion === expected.contract.contractVersion,
    registryId: registryInstance.registryId === expected.registry.registryId,
    registryVersion: registryInstance.registryVersion === expected.registry.registryVersion,
    schemaId: registryInstance.schemaId === expected.registry.schemaId,
    schemaVersion: registryInstance.schemaVersion === expected.registry.schemaVersion,
    candidateGitBlobSha: discovery.candidateGitBlobSha === expected.registry.candidateGitBlobSha,
    instructionId: contracts.instruction.instructionId === expected.instruction.instructionId,
    instructionVersion: contracts.instruction.instructionVersion === expected.instruction.instructionVersion,
    candidateNotAccepted: registryInstance.accepted === false,
    candidateNotCanonical: discovery.canonical === false
  };

  return deepFreeze({
    loaderId: 'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v1',
    files: FILES,
    contracts,
    registryFacade,
    registryInstance,
    discovery,
    identityChecks,
    identityVerified: Object.values(identityChecks).every(Boolean),
    boundary: {
      readOnly: true,
      networkDependencyRequired: false,
      mutationAuthorityCreated: false,
      workflowEnforcementInstalled: false
    },
    stoppingCondition: {
      contractAndRegistryLoaderComplete: true,
      advanceBeyondTarget4B2: false,
      nextAuthorizedSubtarget: '4B-3'
    }
  });
}

export default loadHEarthRepositoryRegistryValidatorDependencies;

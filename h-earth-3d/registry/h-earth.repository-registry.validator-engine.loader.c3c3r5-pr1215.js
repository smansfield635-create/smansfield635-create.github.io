/** C3C3R5 PR #1215 read-only registry-dependency overlay. */
import { loadHEarthRepositoryRegistryValidatorDependencies as loadBase } from './h-earth.repository-registry.validator-engine.loader.js';
import registryFacade from './accepted-amendments/h-earth.repository-registry.c3c3r5-pr1215-scope-reconciliation.js';
import { deepFreeze } from './h-earth.repository-registry.validator-engine.identity.js';

export function loadHEarthRepositoryRegistryValidatorDependencies() {
  const base = loadBase();
  const registryInstance = registryFacade.getHEarthRepositoryRegistryInstance();
  const discovery = registryFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();
  return deepFreeze({
    ...base,
    registryFacade,
    registryInstance,
    discovery,
    c3c3r5Pr1215ScopeReconciliation: true
  });
}

export default loadHEarthRepositoryRegistryValidatorDependencies;

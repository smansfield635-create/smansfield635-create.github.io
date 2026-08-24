/** Target 4E-5/4E-6 · Automatic H-Earth scope classification and read-only preflight. */
import crypto from 'node:crypto';
import {
  deriveHEarthRepositoryRegistryOperationScopePreview,
  validateHEarthRepositoryRegistryOperation
} from '../h-earth.repository-registry.validator-engine.js';
import {
  loadHEarthRepositoryRegistryValidatorDependencies
} from '../h-earth.repository-registry.validator-engine.loader.js';
import { deepFreeze } from '../h-earth.repository-registry.validator-engine.identity.js';

export const H_EARTH_AUTOMATIC_PREFLIGHT_ACTIVATION_ID =
  'H_EARTH_REPOSITORY_REGISTRY_AUTOMATIC_PREFLIGHT_ACTIVATION_v1';
export const H_EARTH_AUTOMATIC_PREFLIGHT_INSTRUCTION_ID =
  'H_EARTH_REPOSITORY_REGISTRY_GITHUB_TOOL_INSTRUCTION_v1';
export const H_EARTH_AUTOMATIC_PREFLIGHT_SCOPE_ROOTS = Object.freeze([
  '/h-earth-3d/',
  '/showroom/globe/h-earth/'
]);

const dependencies = loadHEarthRepositoryRegistryValidatorDependencies();

function normalizedPath(value) {
  if (typeof value !== 'string') return null;
  let result = value.trim().replaceAll('\\', '/');
  if (result.startsWith('./')) result = result.slice(2);
  if (!result.startsWith('/')) result = `/${result}`;
  result = result.replace(/\/{2,}/g, '/');
  return result.length > 1 && result.endsWith('/') ? result.slice(0, -1) : result;
}

function stableUnique(values) {
  return Object.freeze([...new Set(values)].sort((a, b) => a.localeCompare(b)));
}

function inHEarthScopeRoot(repositoryPath) {
  return H_EARTH_AUTOMATIC_PREFLIGHT_SCOPE_ROOTS.some((root) =>
    repositoryPath === root.slice(0, -1) || repositoryPath.startsWith(root)
  );
}

function deterministicId(payload) {
  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex').slice(0, 20).toUpperCase();
}

export function classifyAutomaticHEarthPaths(paths = []) {
  const normalizedPaths = stableUnique(paths.map(normalizedPath).filter(Boolean));
  const classifications = normalizedPaths.map((repositoryPath) => {
    const resolution = dependencies.registryFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
    const registered = resolution.resolved === true;
    const insideScopeRoot = inHEarthScopeRoot(repositoryPath);
    const classification = registered
      ? 'REGISTERED_H_EARTH_PATH'
      : insideScopeRoot
        ? 'UNREGISTERED_H_EARTH_SCOPED_PATH'
        : 'OUTSIDE_H_EARTH_SCOPE';
    return deepFreeze({
      repositoryPath,
      classification,
      registered,
      insideScopeRoot,
      resolvedNodeIds: Object.freeze((resolution.nodes ?? []).map((node) => node.nodeId).sort())
    });
  });

  return deepFreeze({
    normalizedPaths,
    classifications: Object.freeze(classifications),
    hEarthPaths: stableUnique(classifications
      .filter((entry) => entry.classification !== 'OUTSIDE_H_EARTH_SCOPE')
      .map((entry) => entry.repositoryPath)),
    outsidePaths: stableUnique(classifications
      .filter((entry) => entry.classification === 'OUTSIDE_H_EARTH_SCOPE')
      .map((entry) => entry.repositoryPath))
  });
}

function buildReadOnlyOperation({ pathClassification, taskText, mutationIntent }) {
  const requestedPaths = pathClassification.hEarthPaths;
  const seedIdentity = deterministicId({ requestedPaths, taskText, mutationIntent });
  const seed = {
    operationId: `AUTO_PREFLIGHT_${seedIdentity}`,
    operationClass: 'READ_ONLY_INSPECTION',
    requestedAction: 'AUTOMATIC_H_EARTH_PREFLIGHT',
    requestedMutation: false,
    requestedPaths: [...requestedPaths],
    declaredAffectedNodeIds: [],
    declaredAffectedRelationIds: [],
    declaredCompositeUnitIds: [],
    assertedOccurrences: [],
    assertedAuthority: [],
    assertedLifecycleTransitions: [],
    assertedCardinalRoles: [],
    instructionSources: [H_EARTH_AUTOMATIC_PREFLIGHT_INSTRUCTION_ID],
    evidenceReferences: [],
    requestedDispositionContext: {
      allowReviewRequired: true,
      requireExactOccurrenceForReadOnly: false,
      separateAuthorityAvailable: false
    }
  };

  const preview = deriveHEarthRepositoryRegistryOperationScopePreview(seed);
  const operationInput = preview.valid
    ? {
        ...seed,
        declaredAffectedNodeIds: [...preview.affectedNodeIds],
        declaredAffectedRelationIds: [...preview.affectedRelationIds],
        declaredCompositeUnitIds: [...preview.affectedCompositeUnitIds]
      }
    : seed;

  return deepFreeze({ operationInput, preview });
}

function continuationFor(disposition, mutationIntent) {
  if (disposition === 'PASS') {
    return mutationIntent
      ? 'SEPARATE_MUTATION_AUTHORITY_REQUIRED_BEFORE_CHANGE'
      : 'READ_ONLY_CONTINUATION_PERMITTED';
  }
  if (disposition === 'REVIEW_REQUIRED') return 'REPORT_LIMITATION_AND_OBTAIN_REVIEW';
  if (disposition === 'BLOCK') return 'DO_NOT_PERFORM_GOVERNED_ACTION';
  if (disposition === 'STOP') return 'RESOLVE_SCOPE_OR_IDENTITY_BEFORE_CONTINUING';
  return 'H_EARTH_PREFLIGHT_NOT_APPLICABLE';
}

export function runAutomaticHEarthPreflight({ paths = [], taskText = '', mutationIntent = false } = {}) {
  const pathClassification = classifyAutomaticHEarthPaths(paths);
  const requestIdentity = deterministicId({
    paths: pathClassification.normalizedPaths,
    taskText: typeof taskText === 'string' ? taskText : '',
    mutationIntent: mutationIntent === true
  });

  if (pathClassification.hEarthPaths.length === 0) {
    return deepFreeze({
      receiptId: `H_EARTH_AUTOMATIC_PREFLIGHT_${requestIdentity}_v1`,
      activationId: H_EARTH_AUTOMATIC_PREFLIGHT_ACTIVATION_ID,
      activationStatus: 'NOT_APPLICABLE',
      dependenciesVerified: dependencies.identityVerified,
      taskText: typeof taskText === 'string' ? taskText : '',
      mutationIntentDetected: mutationIntent === true,
      pathClassification,
      operationInput: null,
      validatorReceipt: null,
      finalDisposition: 'NOT_APPLICABLE',
      mutationMayProceed: false,
      continuation: 'H_EARTH_PREFLIGHT_NOT_APPLICABLE',
      boundaries: {
        sourceAuthorityCreated: false,
        mutationAuthorityCreated: false,
        mergeAuthorityCreated: false,
        canonicalizationAuthorityCreated: false
      }
    });
  }

  const built = buildReadOnlyOperation({
    pathClassification,
    taskText: typeof taskText === 'string' ? taskText : '',
    mutationIntent: mutationIntent === true
  });
  const validation = validateHEarthRepositoryRegistryOperation(built.operationInput);
  const finalDisposition = validation.receipt.finalDisposition;

  return deepFreeze({
    receiptId: `H_EARTH_AUTOMATIC_PREFLIGHT_${requestIdentity}_v1`,
    activationId: H_EARTH_AUTOMATIC_PREFLIGHT_ACTIVATION_ID,
    activationStatus: 'ACTIVATED',
    dependenciesVerified: dependencies.identityVerified,
    taskText: typeof taskText === 'string' ? taskText : '',
    mutationIntentDetected: mutationIntent === true,
    pathClassification,
    operationInput: built.operationInput,
    scopePreview: built.preview,
    validatorReceipt: validation.receipt,
    finalDisposition,
    mutationMayProceed: false,
    continuation: continuationFor(finalDisposition, mutationIntent === true),
    boundaries: {
      readOnlyPreflight: true,
      sourceAuthorityCreated: false,
      mutationAuthorityCreated: false,
      mergeAuthorityCreated: false,
      canonicalizationAuthorityCreated: false
    }
  });
}

export const H_EARTH_AUTOMATIC_PREFLIGHT = deepFreeze({
  activationId: H_EARTH_AUTOMATIC_PREFLIGHT_ACTIVATION_ID,
  scopeRoots: H_EARTH_AUTOMATIC_PREFLIGHT_SCOPE_ROOTS,
  classifyPaths: classifyAutomaticHEarthPaths,
  run: runAutomaticHEarthPreflight,
  boundary: {
    repositoryScoped: true,
    readOnly: true,
    automaticForCompatibleEntrypoints: true,
    allExternalToolsControlled: false,
    mutationAuthorityCreated: false
  }
});

export default H_EARTH_AUTOMATIC_PREFLIGHT;

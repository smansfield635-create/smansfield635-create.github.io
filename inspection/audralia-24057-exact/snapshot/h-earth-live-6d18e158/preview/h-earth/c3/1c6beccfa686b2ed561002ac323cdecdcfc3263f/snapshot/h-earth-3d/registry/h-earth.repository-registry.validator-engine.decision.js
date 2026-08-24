/** Target 4B-11 · Failure classification and final disposition. */
import { deepFreeze, stableStrings } from './h-earth.repository-registry.validator-engine.identity.js';

export function classifyHEarthRepositoryRegistryValidationFailures(input, failureCodes, dependencies) {
  const catalog = new Map(dependencies.contracts.failures.catalog.map((entry) => [entry.failureCode, entry]));
  const dispositions = dependencies.contracts.dispositions.dispositions;
  const normalizedCodes = new Set(failureCodes);

  for (const code of [...normalizedCodes]) {
    if (!catalog.has(code)) {
      normalizedCodes.delete(code);
      normalizedCodes.add('DERIVATION_TRACE_INCOMPLETE');
    }
  }

  const classified = [...normalizedCodes].sort().map((code) => {
    const source = catalog.get(code);
    let effectiveDisposition = source.defaultDisposition;
    let effectiveCriticality = source.criticality;

    if (code === 'EXACT_OCCURRENCE_UNRESOLVED' &&
        input.requestedMutation === false &&
        input.requestedDispositionContext.requireExactOccurrenceForReadOnly === false) {
      effectiveDisposition = 'REVIEW_REQUIRED';
      effectiveCriticality = 'NONCRITICAL';
    }

    if (code === 'LIFECYCLE_TRANSITION_UNRESOLVED' &&
        input.assertedLifecycleTransitions.length === 0) {
      effectiveDisposition = 'REVIEW_REQUIRED';
      effectiveCriticality = 'NONCRITICAL';
    }

    return deepFreeze({
      ...source,
      effectiveDisposition,
      effectiveCriticality
    });
  });

  let finalDisposition = 'PASS';
  for (const failure of classified) {
    if (dispositions[failure.effectiveDisposition].severity > dispositions[finalDisposition].severity) {
      finalDisposition = failure.effectiveDisposition;
    }
  }

  if (finalDisposition === 'REVIEW_REQUIRED' && input.requestedDispositionContext.allowReviewRequired === false) {
    finalDisposition = 'STOP';
  }

  return deepFreeze({
    decisionId: 'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DECISION_v1',
    failureCodes: stableStrings(classified.map((entry) => entry.failureCode)),
    classifiedFailures: Object.freeze(classified),
    finalDisposition,
    precedence: Object.freeze([...dependencies.contracts.dispositions.precedence]),
    mutationMayProceed: false,
    separateAuthorityRequired: finalDisposition !== 'PASS',
    decisionComplete: true,
    stoppingCondition: {
      failureClassificationAndDispositionComplete: true,
      advanceBeyondTarget4B11: false,
      nextAuthorizedSubtarget: '4B-12'
    }
  });
}

export default classifyHEarthRepositoryRegistryValidationFailures;

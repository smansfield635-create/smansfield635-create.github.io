export const H_EARTH_RENDERER_CORRIDOR_OBSERVATION_CONTRACT_ID =
  'H_EARTH_RENDERER_CORRIDOR_TERMINAL_AND_MEASUREMENT_OBSERVATION_v1';

export const LAWFUL_TERMINAL_ROUTE_STATUSES = Object.freeze([
  'PUBLIC_STAGE_RENDERER_MOUNTED',
  'PUBLIC_STAGE_SOURCE_PREVIEW_FALLBACK',
  'PUBLIC_STAGE_ERROR'
]);

const SOURCE_OBJECT_ID_PATTERN = /OBJ_\d{3}_[A-Z0-9_]+/g;

function uniqueSorted(values) {
  return Array.from(new Set(values)).sort();
}

function isNonNegativeSafeInteger(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function collectSourceObjectIds(value, output, seen = new WeakSet()) {
  if (typeof value === 'string') {
    output.push(...(value.match(SOURCE_OBJECT_ID_PATTERN) ?? []));
    return;
  }
  if (value === null || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);

  if (typeof value.sourceObjectId === 'string') output.push(value.sourceObjectId);
  if (Array.isArray(value.sourceObjectIds)) {
    output.push(...value.sourceObjectIds.filter((entry) => typeof entry === 'string'));
  }

  for (const nested of Object.values(value)) {
    collectSourceObjectIds(nested, output, seen);
  }
}

function resolveProjectedPlanFragmentCount(observation) {
  const receipt = observation?.constructReceipt;
  const candidates = [
    receipt?.projectedPrimitiveFragmentCount,
    receipt?.projectedPlanFragmentCount,
    receipt?.projectionPlan?.projectedPrimitiveFragmentCount,
    receipt?.projectionPlan?.projectedPlanFragmentCount,
    Array.isArray(receipt?.projectionPlan?.projectedFragments)
      ? receipt.projectionPlan.projectedFragments.length
      : null,
    observation?.counts?.projectedClippedFragments
  ];
  return candidates.find(isNonNegativeSafeInteger) ?? 0;
}

export function enrichHEarthRouteObservation(observation = {}) {
  const identityRoots = [
    observation.constructReceipt,
    observation.mountReceipt,
    observation.htmlEntryReceipt,
    observation.bootstrapReceipt,
    observation.bootstrapCompletion,
    observation.bootstrapStatus
  ];
  const sourceObjectIds = [];
  for (const root of identityRoots) {
    collectSourceObjectIds(root, sourceObjectIds);
  }

  const projectedPlanFragmentCount =
    resolveProjectedPlanFragmentCount(observation);
  const mountedProjectedFragmentNodeCount =
    isNonNegativeSafeInteger(observation?.counts?.projectedFragmentDomNodes)
      ? observation.counts.projectedFragmentDomNodes
      : 0;

  return Object.freeze({
    ...observation,
    observedObjectIds: uniqueSorted(sourceObjectIds),
    counts: Object.freeze({
      ...(observation.counts ?? {}),
      projectedPlanFragmentCount,
      mountedProjectedFragmentNodeCount
    }),
    terminalState: Object.freeze({
      routeStatus: observation.routeStatus ?? null,
      htmlEntryFailureObserved: Boolean(observation.htmlEntryFailure),
      lawfulTerminalRouteStatus:
        LAWFUL_TERMINAL_ROUTE_STATUSES.includes(observation.routeStatus)
    })
  });
}
